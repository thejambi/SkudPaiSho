/* Nick specific UI interaction logic */

import {
	activeAi,
	activeAi2,
	BRAND_NEW,
	callSubmitMove,
	clearMessage,
	createGameIfThatIsOk,
	finalizeMove,
	gameController,
	gameId,
	getCurrentPlayer,
	GameType,
	getGameOptionsMessageElement,
	getOnlineGameOpponentUsername,
	getUsername,
	iAmPlayerInCurrentOnlineGame,
	isAnimationsOn,
	isInReplay,
	myTurn,
	onlinePlayEnabled,
	playingOnlineGame,
	quickFinalizeMove,
	READY_FOR_BONUS,
	refreshMessage,
	rerunAll,
	setAiIndex,
	setGameTitleText,
	showResetMoveMessage,
	showSkipButtonMessage,
	userIsLoggedIn,
	usernameIsOneOf,
	WAITING_FOR_ENDPOINT,
} from '../PaiShoMain';
import {
	DEPLOY,
	DRAW_ACCEPT,
	GUEST,
	HOST,
	MOVE,
	NotationPoint,
	PASS_TURN,
	SETUP,
} from '../CommonNotationObjects';
import { debug, debugOn } from '../GameData';
import { getPlayerCodeFromName } from '../pai-sho-common/PaiShoPlayerHelp';
import { setCurrentTileCodes, setCurrentTileMetadata } from '../trifle/PaiShoGamesTileMetadata';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	TrifleGameNotation,
	TrifleNotationBuilder,
	TrifleNotationBuilderStatus,
} from '../trifle/TrifleGameNotation';
import { TrifleTile } from '../trifle/TrifleTile';
import { TrifleTileInfo } from '../trifle/TrifleTileInfo';
import { NickActuator } from './NickActuator';
import { NickGameManager } from './NickGameManager';
import { NickOptions } from './NickOptions';
import { initializeTrifleData, NickTileCodes, TileInfo, getNickTiles } from './NickTiles';
import { NickStrategicAI } from './ai/NickStrategicAI';
import { NickAggressiveAI } from './ai/NickAggressiveAI';

export var NickConstants = {
	preferencesKey: "NickPreferencesKey"
};

export class NickController {
	constructor(gameContainer, isMobile) {
		new NickOptions();	// Initialize
		NickController.loadPreferences();
		this.gameContainer = gameContainer;
		this.isMobile = isMobile;
		this.createActuator();

		initializeTrifleData();
		setCurrentTileMetadata(getNickTiles());
		setCurrentTileCodes(NickTileCodes);
		this.resetGameManager();
		this.resetGameNotation();
		this.resetNotationBuilder();

		this.hostAccentTiles = [];
		this.guestAccentTiles = [];

		this.isPaiShoGame = true;

		this.showDebugInfo = false;
	}

	static loadPreferences() {
		const preferences = localStorage.getItem(NickConstants.preferencesKey);
		if (preferences && preferences.length > 0) {
			try {
				NickOptions.Preferences = JSON.parse(preferences);
				return
			} catch(error) {
				debug("Error loading Nick preferences");
			}
		}
		NickOptions.Preferences = {
			customTilesUrl: ""
		};
	}

	createActuator() {
		this.actuator = new NickActuator(this.gameContainer, this.isMobile, isAnimationsOn());
		if (this.theGame) {
			this.theGame.updateActuator(this.actuator);
		}
	}

	getGameTypeId() {
		return GameType.Nick.id;
	}

	resetGameManager() {
		this.theGame = new NickGameManager(this.actuator);
	}

	resetNotationBuilder() {
		let offerDraw = false;
		if (this.notationBuilder) {
			offerDraw = this.notationBuilder.offerDraw;
		}
		this.notationBuilder = new TrifleNotationBuilder();
		this.notationBuilder.promptTargetData = {};
		if (offerDraw) {
			this.notationBuilder.offerDraw = true;
		}
		this.checkingOutOpponentTileOrNotMyTurn = false;

		this.notationBuilder.currentPlayer = this.getCurrentPlayer();
	}

	undoMoveAllowed() {
		return !this.theGame.getWinner()
			&& !this.theGame.disableUndo;
	}

	automaticallySubmitMoveRequired() {
		return !this.undoMoveAllowed();
	}

	resetGameNotation() {
		this.gameNotation = this.getNewGameNotation();
	}

	getNewGameNotation() {
		return new TrifleGameNotation(GUEST);
	}

	static getHostTilesContainerDivs() {
		return '';
	}

	static getGuestTilesContainerDivs() {
		return '';
	}

	callActuate() {
		this.theGame.actuate();
	}

	resetMove(skipAnimation) {
		this.notationBuilder.offerDraw = false;
		if (this.notationBuilder.status === BRAND_NEW) {
			// Remove last move
			this.gameNotation.removeLastMove();
		} else if (this.notationBuilder.status === READY_FOR_BONUS) {
			// Just rerun
		}

		rerunAll(null, null, skipAnimation);
	}

	getDefaultHelpMessageText() {
		return '<h4>Nick Pai Sho</h4>'
			+ '<p><strong>Objective</strong></p>'
			+ '<ul>'
			+ '<li>Be the first player to move your White Lotus to the center of the board.</li>'
			+ '</ul>'
			+ '<p><strong>Capturing and movement</strong></p>'
			+ '<ul>'
			+ this.getNickCycleImageTag() + '<li>Capturing follows the Avatar cycle.</li>'
			+ '<li> Each tile can move to any empty surrounding space, and non-Lotus tiles can also jump over friendly tiles. Can be chained.</li>'
			+ '</ul>'
			+ '<p><strong>Important rules</strong></p>'
			+ '<p>White Lotus</p>'
			+ '<ul>'
			+ '<li>The White Lotus is your King. It cannot capture, and when it would be captured, it is instead put in check and must exit check on your turn or you lose.</li>'
			+ '<li>Can move one space in any direction, and cannot jump over other tiles.</li>'
			+ '</ul>'
			+ '<p>The Avatar</p>'
			+ '<ul>'
			+ '<li>The Avatar can capture any tile but can be captured by any tile.</li>'
			+ '<li>If your Avatar is captured, it returns to its starting point if you capture the enemy Avatar.</li>'
			+ '</ul>'
			+ '<p>For additional info, view the rule book <a href="https://skudpaisho.com/site/games/nick-pai-sho/" target="_blank">here</a>.</p>';
	}

	getNickCycleImageTag() {
		return "<img src='images/Nick/" + localStorage.getItem(NickOptions.tileDesignTypeKey) + ".png' style='width:60%;' />";
	}

	gameNotBegun() {
		return this.gameNotation.moves.length === 0
			|| (this.gameNotation.moves.length === 1 && this.gameNotation.moves[0].moveType === SETUP);
	}

	readyToShowPlayAgainstAiOption() {
		// Nick Pai Sho starts with all tiles on the board, so show AI option right away after setup
		return this.gameNotation.moves.length >= 1
			&& this.gameNotation.moves[0].moveType === SETUP;
	}

	getAdditionalMessage() {
		const container = document.createElement('span');

		if (this.gameNotBegun() && !playingOnlineGame()) {
			if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
				const joinText = document.createElement('span');
				joinText.appendChild(document.createTextNode('Click '));
				const emJoin = document.createElement('em');
				emJoin.textContent = 'Join Game';
				joinText.appendChild(emJoin);
				joinText.appendChild(document.createTextNode(' above to join another player\'s game. Or, you can start a game that other players can join by clicking '));
				const strongStart = document.createElement('strong');
				strongStart.textContent = 'Start Online Game';
				joinText.appendChild(strongStart);
				joinText.appendChild(document.createTextNode(' below.'));
				container.appendChild(joinText);
			} else {
				container.appendChild(document.createTextNode('Sign in to enable online gameplay. Or, start playing a local game.'));
			}

			container.appendChild(getGameOptionsMessageElement(GameType.Nick.gameOptions));
		} else if (!this.theGame.hasEnded() && myTurn()) {
			if (this.gameNotation.lastMoveHasDrawOffer() && this.promptToAcceptDraw) {
				container.appendChild(document.createElement('br'));
				container.appendChild(document.createTextNode('Are you sure you want to accept the draw offer and end the game?'));
				container.appendChild(document.createElement('br'));

				const confirmSpan = document.createElement('span');
				confirmSpan.className = 'skipBonus';
				confirmSpan.textContent = 'Yes, accept draw and end the game';
				confirmSpan.onclick = () => gameController.confirmAcceptDraw();
				container.appendChild(confirmSpan);
				container.appendChild(document.createElement('br'));
				container.appendChild(document.createElement('br'));
			} else if (this.gameNotation.lastMoveHasDrawOffer()) {
				container.appendChild(document.createElement('br'));
				container.appendChild(document.createTextNode('Your opponent is offering a draw. You may '));

				const acceptSpan = document.createElement('span');
				acceptSpan.className = 'skipBonus';
				acceptSpan.textContent = 'Accept Draw';
				acceptSpan.onclick = () => gameController.acceptDraw();
				container.appendChild(acceptSpan);

				container.appendChild(document.createTextNode(' or make a move to refuse the draw offer.'));
				container.appendChild(document.createElement('br'));
			} else if (this.notationBuilder.offerDraw) {
				container.appendChild(document.createElement('br'));
				container.appendChild(document.createTextNode('Your opponent will be able to accept or reject your draw offer once you make your move. Or, you may '));

				const removeSpan = document.createElement('span');
				removeSpan.className = 'skipBonus';
				removeSpan.textContent = 'remove your draw offer';
				removeSpan.onclick = () => gameController.removeDrawOffer();
				container.appendChild(removeSpan);

				container.appendChild(document.createTextNode(' from this move.'));
			} else {
				container.appendChild(document.createElement('br'));

				const offerSpan = document.createElement('span');
				offerSpan.className = 'skipBonus';
				offerSpan.textContent = 'Offer Draw';
				offerSpan.onclick = () => gameController.offerDraw();
				container.appendChild(offerSpan);

				container.appendChild(document.createElement('br'));
			}
		} else if (!myTurn()) {
			if (this.gameNotation.lastMoveHasDrawOffer()) {
				container.appendChild(document.createElement('br'));
				container.appendChild(document.createTextNode('A draw has been offered.'));
				container.appendChild(document.createElement('br'));
			}
		}

		if (!playingOnlineGame()) {
			if (onlinePlayEnabled && this.gameNotBegun()) {
				container.appendChild(document.createElement('br'));

				const startSpan = document.createElement('span');
				startSpan.className = 'skipBonus';
				startSpan.textContent = 'Start Online Game';
				startSpan.onclick = () => gameController.startOnlineGame();
				container.appendChild(startSpan);

				container.appendChild(document.createElement('br'));
			}

			// Show AI options when game is ready but no AI is active
			if (this.readyToShowPlayAgainstAiOption() && !activeAi) {
				container.appendChild(document.createElement('br'));

				const aiList = this.getAiList();
				for (let i = 0; i < aiList.length; i++) {
					const span = document.createElement('span');
					span.className = 'skipBonus';
					span.onclick = ((index) => {
						return () => setAiIndex(index);
					})(i);
					span.textContent = 'Play ' + aiList[i].getName();
					container.appendChild(span);
					container.appendChild(document.createElement('br'));
				}
			}
		}

		return container;
	}

	toggleDebug() {
		this.showDebugInfo = !this.showDebugInfo;
		clearMessage();
	}

	completeSetup() {
		// Create initial board setup
		this.addSetupMove();

		// Finish with actuate
		rerunAll();
		this.callActuate();

		setGameTitleText("Nick Pai Sho");
	}

	addSetupMove() {
		this.notationBuilder.moveType = SETUP;
		this.notationBuilder.boardSetupNum = 1;
		const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.theGame.runNotationMove(move);
		// Move all set. Add it to the notation!
		this.gameNotation.addMove(move);
	}

	startOnlineGame() {
		this.resetNotationBuilder();
		this.notationBuilder.currentPlayer = HOST;
		this.notationBuilder.moveType = PASS_TURN;

		const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.theGame.runNotationMove(move);
		// Move all set. Add it to the notation!
		this.gameNotation.addMove(move);

		createGameIfThatIsOk(GameType.Nick.id);
	}

	getAdditionalHelpTabDiv() {
		const settingsDiv = document.createElement("div");

		const heading = document.createElement("h4");
		heading.innerText = "Nick Preferences:";

		settingsDiv.appendChild(heading);
		settingsDiv.appendChild(NickOptions.buildTileDesignDropdownDiv("Tile Designs"));

		if (!playingOnlineGame() || !iAmPlayerInCurrentOnlineGame() || getOnlineGameOpponentUsername() === getUsername()) {
			settingsDiv.appendChild(document.createElement("br"));
			settingsDiv.appendChild(NickOptions.buildToggleViewAsGuestDiv());
		}

		settingsDiv.appendChild(document.createElement("br"));

		if (usernameIsOneOf(["SkudPaiSho"]) || debugOn) {
			let toggleDebugText = "Enable debug Help display";
			if (this.showDebugInfo) {
				toggleDebugText = "Disable debug Help display";
			}
			const toggleDebugSpan = document.createElement("span");
			toggleDebugSpan.classList.add("skipBonus");
			toggleDebugSpan.setAttribute("onclick", "gameController.toggleDebug();");
			toggleDebugSpan.innerText = toggleDebugText;

			settingsDiv.appendChild(toggleDebugSpan);

			settingsDiv.appendChild(document.createElement("br"));
		}

		settingsDiv.appendChild(document.createElement("br"));

		return settingsDiv;
	}

	toggleViewAsGuest() {
		NickOptions.viewAsGuest = !NickOptions.viewAsGuest;
		this.createActuator();
		this.callActuate();
		clearMessage();
	}

	gameHasEndedInDraw() {
		return this.theGame.gameHasEndedInDraw;
	}

	acceptDraw() {
		if (myTurn()) {
			this.promptToAcceptDraw = true;
			refreshMessage();
		}
	}

	confirmAcceptDraw() {
		if (myTurn()) {
			this.resetNotationBuilder();
			this.notationBuilder.moveType = DRAW_ACCEPT;

			const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.runNotationMove(move);
			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);

			if (playingOnlineGame()) {
				callSubmitMove();
			} else {
				finalizeMove();
			}
		}
	}

	offerDraw() {
		if (myTurn()) {
			this.notationBuilder.offerDraw = true;
			refreshMessage();
		}
	}

	removeDrawOffer() {
		if (myTurn()) {
			this.notationBuilder.offerDraw = false;
			refreshMessage();
		}
	}

	unplayedTileClicked(tileDiv) {
		this.promptToAcceptDraw = false;

		if (this.theGame.hasEnded() && this.notationBuilder.status !== READY_FOR_BONUS) {
			return;
		}

		const divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
		const tileId = parseInt(tileDiv.getAttribute("id"));
		const playerCode = divName.charAt(0);
		const tileCode = divName.substring(1);

		let player = GUEST;
		if (playerCode === 'H') {
			player = HOST;
		}

		const tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

		if ((tile && tile.ownerName !== getCurrentPlayer()) || !myTurn()) {
			this.checkingOutOpponentTileOrNotMyTurn = true;
		}

		/* if (this.theGame.playersAreSelectingTeams()) {
			var selectedTile = new Nick.Tile(tileCode, playerCode);
			if (tileDiv.classList.contains("selectedFromPile")) {
				var teamIsNowFull = this.theGame.addTileToTeam(selectedTile);
				if (teamIsNowFull) {
					this.notationBuilder.moveType = TEAM_SELECTION;
					this.notationBuilder.teamSelection = this.theGame.getPlayerTeamSelectionTileCodeList(player);
					this.completeMove();
				}
			} else if (!this.theGame.tileManager.playerTeamIsFull(selectedTile.ownerName)) {
				// Need to remove from team instead
				this.theGame.removeTileFromTeam(selectedTile);
			}
		} else  */
		if (this.notationBuilder.status === BRAND_NEW) {
			// new Deploy turn
			tile.selectedFromPile = true;

			this.notationBuilder.moveType = DEPLOY;
			this.notationBuilder.tileType = tileCode;
			this.notationBuilder.status = WAITING_FOR_ENDPOINT;

			this.theGame.revealDeployPoints(tile);
		} else if (this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET) {
			if (tile.tileIsSelectable) {
				if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
					const sourceTileKey = JSON.stringify(this.notationBuilder.neededPromptTargetInfo.sourceTileKey);
					if (!this.notationBuilder.promptTargetData[sourceTileKey]) {
						this.notationBuilder.promptTargetData[sourceTileKey] = {};
					}
					this.notationBuilder.promptTargetData[sourceTileKey][this.notationBuilder.neededPromptTargetInfo.currentPromptTargetId] = tile.getOwnerCodeIdObject();
					// TODO - Does move require user to choose targets?... 
					const notationBuilderSave = this.notationBuilder;
					this.resetMove(true);
					this.notationBuilder = notationBuilderSave;
					this.completeMove();
				} else {
					this.resetNotationBuilder();
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder();
		}
	}

	pointClicked(htmlPoint) {
		this.theGame.markingManager.clearMarkings();
		this.callActuate();

		this.promptToAcceptDraw = false;

		if (this.theGame.hasEnded()) {
			return;
		}

		const npText = htmlPoint.getAttribute("name");

		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		const boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
		const currentMovePath = boardPoint.buildMovementPath();

		if (this.notationBuilder.status === BRAND_NEW) {
			if (boardPoint.hasTile()) {
				// Prevent non-current player from starting a move (and seeing possible moves)
				if (boardPoint.tile.ownerName !== getCurrentPlayer() || !myTurn()) {
					debug("That's not your tile!");
					this.checkingOutOpponentTileOrNotMyTurn = true;
					return;
				}

				this.notationBuilder.status = WAITING_FOR_ENDPOINT;
				this.notationBuilder.moveType = MOVE;
				this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				this.theGame.revealPossibleMovePoints(boardPoint);
			}
		} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				// They're trying to move there! And they can! Exciting!
				// Need the notation!
				this.theGame.hidePossibleMovePoints();

				if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
					this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
					this.notationBuilder.endPointMovementPath = currentMovePath;
					this.completeMove();
				} else {
					this.resetNotationBuilder();
				}
			} else {
				this.theGame.hidePossibleMovePoints();
				this.resetNotationBuilder();
			}
		} else if (this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				this.theGame.hidePossibleMovePoints();

				if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
					const sourceTileKey = JSON.stringify(this.notationBuilder.neededPromptTargetInfo.sourceTileKey);
					if (!this.notationBuilder.promptTargetData[sourceTileKey]) {
						this.notationBuilder.promptTargetData[sourceTileKey] = {};
					}
					this.notationBuilder.promptTargetData[sourceTileKey][this.notationBuilder.neededPromptTargetInfo.currentPromptTargetId] = new NotationPoint(htmlPoint.getAttribute("name"));
					// TODO - Does move require user to choose targets?... 
					const notationBuilderSave = this.notationBuilder;
					this.resetMove(true);
					this.notationBuilder = notationBuilderSave;
					this.completeMove();
				} else {
					this.resetNotationBuilder();
				}
			} else {
				// this.theGame.hidePossibleMovePoints();
				// this.notationBuilder.status = ?
			}
		}
	}

	completeMove() {
		const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		const skipAnimation = this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET;
		const neededPromptTargetInfo = this.theGame.runNotationMove(move, true, null, skipAnimation);

		if (neededPromptTargetInfo) {
			debug("Prompting user for the rest of the move!");
			this.notationBuilder.status = TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET;
			this.notationBuilder.neededPromptTargetInfo = neededPromptTargetInfo;
			
			if (neededPromptTargetInfo.sourceAbility.abilityInfo.optional) {
				refreshMessage();
				let abilityTitle = neededPromptTargetInfo.sourceAbility.abilityInfo.title;
				if (!abilityTitle) {
					abilityTitle = neededPromptTargetInfo.sourceAbility.abilityInfo.type;
				}
				showSkipButtonMessage("Skip ability: " + abilityTitle);
			}

			showResetMoveMessage();
		} else {
			this.gameNotation.addMove(move);
			if (playingOnlineGame()) {
				callSubmitMove();
			} else {
				// finalizeMove();
				quickFinalizeMove();
			}
		}
	}

	skipHarmonyBonus() {
		const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.gameNotation.addMove(move);
		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	getTheMessage(tile, ownerName) {
		const message = [];

		const tileCode = tile.code;

		const heading = TrifleTile.getTileName(tileCode);

		message.push(TrifleTileInfo.getReadableDescription(tileCode));

		return {
			heading: heading,
			message: message
		}
	}

	getTileMessage(tileDiv) {
		const divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
		const tileId = parseInt(tileDiv.getAttribute("id"));
		const playerCode = divName.charAt(0);
		const tileCode = divName.substring(1);
		const tile = new TrifleTile(tileCode, playerCode);

		let ownerName = HOST;
		if (divName.startsWith('G')) {
			ownerName = GUEST;
		}

		return this.getTheMessage(tile, ownerName);
	}

	getPointMessage(htmlPoint) {
		const npText = htmlPoint.getAttribute("name");

		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		const boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (boardPoint.hasTile()) {
			return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
		} else if (this.showDebugInfo) {
			const messageLines = this.theGame.buildAbilitySummaryLines();
			return {
				heading: "Active Abilities",
				message: messageLines
			};
		}
	}

	playAiTurn(gameFinalize) {
		if (this.theGame.getWinner()) {
			return;
		}

		let theAi = activeAi;
		if (activeAi2) {
			if (activeAi2.player === getCurrentPlayer()) {
				theAi = activeAi2;
			}
		}

		const playerMoveNum = this.gameNotation.getPlayerMoveNum();

		const self = this;
		setTimeout(function() {
			const move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);

			if (move) {
				self.gameNotation.addMove(move);
				self.theGame.runNotationMove(move);

				if (gameFinalize) {
					gameFinalize();
				}
			}
		}, 10);
	}

	startAiGame(gameFinalize) {
		this.playAiTurn(gameFinalize);
	}

	getAiList() {
		return [new NickAggressiveAI()];
	}

	getCurrentPlayer() {
		if (this.gameNotBegun()) {
			return GUEST;
		} /* else if (this.gameNotation.moves.length > 0
				&& this.gameNotation.moves[0].moveType === PASS_TURN) {
			if (currentMoveIndex % 2 === 0) {
				return HOST;
			} else {
				return GUEST;
			}
		}  */
		else {
			const lastPlayer = this.gameNotation.moves[this.gameNotation.moves.length - 1].player;

			if (lastPlayer === HOST) {
				return GUEST;
			} else if (lastPlayer === GUEST) {
				return HOST;
			}
		}
	}

	cleanup() {
		// Nothing to do
	}

	isSolitaire() {
		return false;
	}

	setGameNotation(newGameNotation) {
		this.gameNotation.setNotationText(newGameNotation);
		if (playingOnlineGame() && iAmPlayerInCurrentOnlineGame() && getOnlineGameOpponentUsername() != getUsername()) {
			new NickOptions();	// To set perspective...
			this.createActuator();
			clearMessage();
		}
	}

	skipClicked() {
		const sourceTileKey = JSON.stringify(this.notationBuilder.neededPromptTargetInfo.sourceTileKey);
		if (!this.notationBuilder.promptTargetData[sourceTileKey]) {
			this.notationBuilder.promptTargetData[sourceTileKey] = {};
		}
		this.notationBuilder.promptTargetData[sourceTileKey].skipped = true;
		const notationBuilderSave = this.notationBuilder;
		this.resetMove();
		this.notationBuilder = notationBuilderSave;
		this.completeMove();
	}

	/* TODO Find more global way of doing RmbDown,etc methods? */

	RmbDown(htmlPoint) {
		const npText = htmlPoint.getAttribute("name");

		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
	}

	RmbUp(htmlPoint) {
		const npText = htmlPoint.getAttribute("name");

		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		const mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (mouseEndPoint == this.mouseStartPoint) {
			this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint);
		}
		else if (this.mouseStartPoint) {
			this.theGame.markingManager.toggleMarkedArrow(this.mouseStartPoint, mouseEndPoint);
		}
		this.mouseStartPoint = null;

		this.callActuate();
	}

	buildNotationString(move) {
		const playerCode = getPlayerCodeFromName(move.player);
		const moveNum = move.moveNum;

		let moveNotation = moveNum + playerCode + ".";

		if (move.moveType === MOVE) {
			const startRowAndCol = new NotationPoint(move.startPoint).rowAndColumn;
			const endRowAndCol = new NotationPoint(move.endPoint).rowAndColumn;
			moveNotation += "(" + NickActuator.NotationAdjustmentFunction(startRowAndCol.row, startRowAndCol.col) + ")-";
			moveNotation += "(" + NickActuator.NotationAdjustmentFunction(endRowAndCol.row, endRowAndCol.col) + ")";

			if (move.promptTargetData) {
				Object.keys(move.promptTargetData).forEach((key, index) => {
					const promptDataEntry = move.promptTargetData[key];
					const keyObject = JSON.parse(key);
					if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
						const movedTilePointRowAndCol = promptDataEntry.movedTilePoint.rowAndColumn;
						const movedTileDestinationRowAndCol = promptDataEntry.movedTileDestinationPoint.rowAndColumn;
						moveNotation += "+";
						moveNotation += "(" + NickActuator.NotationAdjustmentFunction(movedTilePointRowAndCol.row, movedTilePointRowAndCol.col) + ")-";
						moveNotation += "(" + NickActuator.NotationAdjustmentFunction(movedTileDestinationRowAndCol.row, movedTileDestinationRowAndCol.col) + ")";
					} else if (promptDataEntry.chosenCapturedTile) {
						moveNotation += "+" + promptDataEntry.chosenCapturedTile.code;
					} else {
						moveNotation += " Ability?";
					}
				});
			}
		}

		return moveNotation;
	}

	setCustomTileDesignUrl(url) {
		NickOptions.Preferences.customTilesUrl = url;
		localStorage.setItem(NickConstants.preferencesKey, JSON.stringify(NickOptions.Preferences));
		localStorage.setItem(NickOptions.tileDesignTypeKey, 'custom');
		if (gameController && gameController.callActuate) {
			gameController.callActuate();
		}
	}

	static isUsingCustomTileDesigns() {
		return localStorage.getItem(NickOptions.tileDesignTypeKey) === "custom";
	}

	static getCustomTileDesignsUrl() {
		return NickOptions.Preferences.customTilesUrl;
	}
}

export default NickController;
