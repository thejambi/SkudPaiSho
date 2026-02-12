/* Trifle specific UI interaction logic */

import {
	DEPLOY,
	DRAW_ACCEPT,
	GUEST,
	HOST,
	MOVE,
	NotationPoint,
	TEAM_SELECTION,
} from '../CommonNotationObjects';
import { debug, debugOn, gameDevOn } from '../GameData';
import { READY_FOR_BONUS } from '../GameConstants';
import {
	showResetMoveMessage,
	showSkipButtonMessage,
} from '../GameFlow';
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
	GameType,
	getCurrentPlayer,
	getGameOptionsMessageElement,
	isInReplay,
	myTurn,
	onlinePlayEnabled,
	playingOnlineGame,
	quickFinalizeMove,
	refreshMessage,
	rerunAll,
	WAITING_FOR_ENDPOINT,
} from '../PaiShoMain';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { TrifleAggressiveAI } from './ai/TrifleAggressiveAI';
import { TrifleDefensiveAI } from './ai/TrifleDefensiveAI';
import {
	setCurrentTileCodes,
	setCurrentTileMetadata,
	setCurrentTileNames
} from './PaiShoGamesTileMetadata';
import { isAnimationsOn } from '../PaiShoMain';
import { userIsLoggedIn } from '../UserData';
import {
	is3DBoardOn,
	buildToggle3DBoardDiv as _buildToggle3DBoardDiv,
	buildToggleRoundBoardDiv as _buildToggleRoundBoardDiv,
} from '../PaiSho3DOptions';
import { PromptTargetHelper } from './PromptTargetHelper';
import { Trifle3DActuator } from './Trifle3DActuator';
import { TrifleActuator } from './TrifleActuator';
import { TrifleGameManager } from './TrifleGameManager';
import {
	TrifleGameNotation,
	TrifleNotationBuilder,
	TrifleNotationBuilderStatus,
} from './TrifleGameNotation';
import { TrifleTile } from './TrifleTile';
import { TrifleTileInfo, TrifleTiles } from './TrifleTileInfo';
import { defineTrifleTiles, generateTrifleTileNames, TrifleTileCodes } from './TrifleTiles';

export class TrifleController {
	constructor(gameContainer, isMobile) {
		this.gameContainer = gameContainer;
		this.isMobile = isMobile;
		this.createActuator();

		TrifleTileInfo.initializeTrifleData();
		defineTrifleTiles();
		setCurrentTileMetadata(TrifleTiles);
		setCurrentTileCodes(TrifleTileCodes);
		setCurrentTileNames(generateTrifleTileNames());
		this.resetGameManager();
		this.resetGameNotation();
		this.resetNotationBuilder();

		this.hostAccentTiles = [];
		this.guestAccentTiles = [];

		// this.isInviteOnly = true;	// Public games now allowed!
		this.isPaiShoGame = true;

		this.clickToShowPointMessage = false;
	}

	static getHostTilesContainerDivs() {
		return '';
	}

	static getGuestTilesContainerDivs() {
		return '';
	}

	createActuator() {
		if (is3DBoardOn()) {
			this.actuator = new Trifle3DActuator(this.gameContainer, this.isMobile, isAnimationsOn());
		} else {
			this.actuator = new TrifleActuator(this.gameContainer, this.isMobile, isAnimationsOn());
		}
		if (this.theGame) {
			this.theGame.actuator = this.actuator;
		}
	}

	getGameTypeId() {
		return GameType.Trifle.id;
	}

	resetGameManager() {
		this.theGame = new TrifleGameManager(this.actuator);
	}

	resetNotationBuilder() {
		let offerDraw = false;
		if (this.notationBuilder) {
			offerDraw = this.notationBuilder.offerDraw;
		}
		this.notationBuilder = new TrifleNotationBuilder();
		this.notationBuilder.promptTargetData = {};
		this.notationBuilder.currentPlayer = this.getCurrentPlayer();
		if (offerDraw) {
			this.notationBuilder.offerDraw = true;
		}
		this.checkingOutOpponentTileOrNotMyTurn = false;
	}

	resetGameNotation() {
		this.gameNotation = this.getNewGameNotation();
	}

	getNewGameNotation() {
		return new TrifleGameNotation(HOST);
	}

	callActuate() {
		this.theGame.actuate();
	}

	toggleClickToShowPointMessage() {
		this.clickToShowPointMessage = !this.clickToShowPointMessage;
		this.createActuator();
		this.callActuate();
		clearMessage();
	}

	getAdditionalHelpTabDiv() {
		const settingsDiv = document.createElement("div");

		settingsDiv.appendChild(this.buildToggle3DBoardDiv());
		if (is3DBoardOn()) {
			settingsDiv.appendChild(this.buildToggleRoundBoardDiv());
		}
		settingsDiv.appendChild(document.createElement("br"));

		if (debugOn) {
			const heading = document.createElement("h4");
			heading.innerText = "Trifle Debug Preferences:";
			settingsDiv.appendChild(heading);

			const clickToShowText = this.clickToShowPointMessage
				? "Switch to show tile info on hover"
				: "Switch to show tile info on click";
			const clickToShowSpan = document.createElement("span");
			clickToShowSpan.classList.add("skipBonus");
			clickToShowSpan.onclick = function() { gameController.toggleClickToShowPointMessage(); };
			clickToShowSpan.innerText = clickToShowText;
			settingsDiv.appendChild(clickToShowSpan);
		}

		return settingsDiv;
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
		return "<h4>Pai &amp; Sho's Trifle</h4> <p> <p>Trifle is inspired by Vagabond Pai Sho, a collectible tile game where you select a team of tiles to play with. A team is made up of one Banner tile and ten other tiles. Trifle is in Beta now for testing - things might break!</p> <p><strong>You win</strong> if you capture your opponent's Banner tile.</p> <p><strong>On a turn</strong>, you may either deploy a tile or move a tile.</p> <p><strong>You can't capture Flower/Banner tiles</strong> until your Banner has been deployed.<br /> <strong>You can't capture Non-Flower/Banner tiles</strong> until both players' Banner tiles have been deployed.</p> <p><strong>Hover</strong> over any tile to see how it works.</p> </p> <p>Select tiles to learn more or <a href='https://skudpaisho.com/site/games/pai-shos-trifle/' target='_blank'>view the rules</a>.</p>";
	}

	getAdditionalMessage() {
		const container = document.createElement('span');

		if (this.gameNotation.moves.length === 0) {
			if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
				const joinText = document.createElement('span');
				joinText.appendChild(document.createTextNode('Click '));
				const emJoin = document.createElement('em');
				emJoin.textContent = 'Join Game';
				joinText.appendChild(emJoin);
				joinText.appendChild(document.createTextNode(' above to join another player\'s game. Or, you can start a game that other players can join by choosing your team.'));
				container.appendChild(joinText);
				container.appendChild(document.createElement('br'));
			} else {
				container.appendChild(document.createTextNode('Sign in to enable online gameplay. Or, start playing a local game by choosing your team.'));
			}

			container.appendChild(getGameOptionsMessageElement(GameType.Trifle.gameOptions));
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

		return container;
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
		debug(">>> unplayedTileClicked ENTRY: status=" + this.notationBuilder.status + " divName=" + (tileDiv ? tileDiv.getAttribute("name") : 'null') + " divId=" + (tileDiv ? tileDiv.getAttribute("id") : 'null'));
		this.theGame.markingManager.clearMarkings();
		this.callActuate();

		this.promptToAcceptDraw = false;

		if (this.theGame.hasEnded() && this.notationBuilder.status !== READY_FOR_BONUS) {
			debug(">>> unplayedTileClicked: RETURNING EARLY - game has ended");
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
		debug(">>> unplayedTileClicked: peekTile result: " + (tile ? "found " + tile.code + " id=" + tile.id + " selectable=" + tile.tileIsSelectable : "NULL"));

		if ((tile && tile.ownerName !== getCurrentPlayer()) || !myTurn()) {
			this.checkingOutOpponentTileOrNotMyTurn = true;
		}

		debug(">>> unplayedTileClicked: before branching. status=" + this.notationBuilder.status + " playersSelectingTeams=" + this.theGame.playersAreSelectingTeams());
		if (this.theGame.playersAreSelectingTeams()) {
			const selectedTile = new TrifleTile(tileCode, playerCode);
			if (tileDiv.classList.contains("selectedFromPile")) {
				const teamIsNowFull = this.theGame.addTileToTeam(selectedTile);
				if (teamIsNowFull) {
					this.notationBuilder.moveType = TEAM_SELECTION;
					this.notationBuilder.teamSelection = this.theGame.getPlayerTeamSelectionTileCodeList(player);
					this.completeMove();
				}
			} else if (!this.theGame.tileManager.playerTeamIsFull(selectedTile.ownerName)) {
				// Need to remove from team instead
				this.theGame.removeTileFromTeam(selectedTile);
			}
		} else if (this.notationBuilder.status === BRAND_NEW) {
			// new Deploy turn
			tile.selectedFromPile = true;

			this.notationBuilder.moveType = DEPLOY;
			this.notationBuilder.tileType = tileCode;
			this.notationBuilder.status = WAITING_FOR_ENDPOINT;

			this.theGame.revealDeployPoints(tile);
		} else if (this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET) {
			debug("Prompt target click: tile=" + tileCode + " id=" + tileId + " player=" + player);
			debug("  tile.tileIsSelectable=" + (tile ? tile.tileIsSelectable : 'tile is null'));
			debug("  isInReplay=" + isInReplay);
			debug("  notationBuilder.neededPromptTargetInfo=" + JSON.stringify(this.notationBuilder.neededPromptTargetInfo ? this.notationBuilder.neededPromptTargetInfo.currentPromptTargetId : 'none'));
			if (tile.tileIsSelectable && !isInReplay) {
				debug("  Recording tile answer and completing move");
				PromptTargetHelper.recordTileAnswer(
					this.notationBuilder.promptTargetData,
					this.notationBuilder.neededPromptTargetInfo,
					tile.getOwnerCodeIdObject()
				);
				const notationBuilderSave = this.notationBuilder;
				this.resetMove(true);
				this.notationBuilder = notationBuilderSave;
				this.completeMove();
			} else {
				debug("  NOT processing click: selectable=" + (tile ? tile.tileIsSelectable : false) + " replay=" + isInReplay);
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder();
		}
	}

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

		if (mouseEndPoint === this.mouseStartPoint) {
			this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint);
		} else if (this.mouseStartPoint) {
			this.theGame.markingManager.toggleMarkedArrow(this.mouseStartPoint, mouseEndPoint);
		}
		this.mouseStartPoint = null;

		this.callActuate();
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

		if (this.notationBuilder.status === BRAND_NEW) {
			if (boardPoint.hasTile()) {
				if (boardPoint.tile.ownerName !== getCurrentPlayer() || !myTurn()) {
					debug("That's not your tile!");
					this.checkingOutOpponentTileOrNotMyTurn = true;
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
					this.completeMove();
				} else {
					this.resetNotationBuilder();
				}
			} else {
				this.theGame.hidePossibleMovePoints();
				this.resetNotationBuilder();
			}
		} else if (this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET) {
			debug(">>> pointClicked PROMPTING_FOR_TARGET: isPossibleMove=" + boardPoint.isType(POSSIBLE_MOVE) + " isInReplay=" + isInReplay);
			if (boardPoint.isType(POSSIBLE_MOVE) && !isInReplay) {
				debug(">>> Recording board point answer: " + htmlPoint.getAttribute("name"));
				this.theGame.hidePossibleMovePoints();

				PromptTargetHelper.recordBoardPointAnswer(
					this.notationBuilder.promptTargetData,
					this.notationBuilder.neededPromptTargetInfo,
					htmlPoint.getAttribute("name")
				);
				const notationBuilderSave = this.notationBuilder;
				this.resetMove(true);
				this.notationBuilder = notationBuilderSave;
				this.completeMove();
			}
		}
	}

	completeMove() {
		const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		const skipAnimation = this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET;
		const neededPromptTargetInfo = this.theGame.runNotationMove(move, true, null, skipAnimation);

		if (neededPromptTargetInfo) {
			debug("Prompting user for the rest of the move! promptId=" + (neededPromptTargetInfo.currentPromptTargetId || 'none'));
			debug("  Captured tiles in tileManager: " + this.theGame.tileManager.capturedTiles.length);
			this.theGame.tileManager.capturedTiles.forEach(function(t) {
				debug("    " + t.code + " id=" + t.id + " owner=" + t.ownerName + " selectable=" + t.tileIsSelectable);
			});
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
			if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
				createGameIfThatIsOk(this.getGameTypeId());
			} else {
				if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					quickFinalizeMove();
				}
			}
		}
	}

	skipClicked() {
		PromptTargetHelper.recordSkip(
			this.notationBuilder.promptTargetData,
			this.notationBuilder.neededPromptTargetInfo
		);
		const notationBuilderSave = this.notationBuilder;
		this.resetMove();
		this.notationBuilder = notationBuilderSave;
		this.completeMove();
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

	getTheMessage(tile, ownerName, boardTile) {
		const message = [];

		const tileCode = tile.code;

		const heading = TrifleTile.getTileName(tileCode);

		// Pass boardTile and abilityManager for debug info when tile is on the board
		const abilityManager = boardTile ? this.theGame.board.abilityManager : null;
		message.push(TrifleTileInfo.getReadableDescription(tileCode, boardTile, abilityManager));

		return {
			heading: heading,
			message: message
		};
	}

	getTileMessage(tileDiv) {
		const divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
		const tileId = parseInt(tileDiv.getAttribute("id"));

		const tile = new TrifleTile(divName.substring(1), divName.charAt(0));

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
			return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName, boardPoint.tile);
		} else {
			return null;
		}
	}

	playAiTurn(theFinalizeMove) {
		if (this.theGame.getWinner()) {
			return;
		}

		var theAi = activeAi;
		if (activeAi2) {
			if (activeAi2.player === getCurrentPlayer()) {
				theAi = activeAi2;
			}
		}

		var playerMoveNum = this.gameNotation.getPlayerMoveNum();
		var selfRef = this;

		setTimeout(function() {
			var move = theAi.getMove(selfRef.theGame.getCopy(), playerMoveNum);
			if (!move) {
				return;
			}
			selfRef.theGame.runNotationMove(move);
			selfRef.gameNotation.addMove(move);
			theFinalizeMove();
		}, 10);
	}

	startAiGame(theFinalizeMove) {
		this.playAiTurn(theFinalizeMove);
	}

	getAiList() {
		if (gameDevOn) {
			return [new TrifleAggressiveAI(), new TrifleDefensiveAI()];
		}
		return [];
	}

	readyToShowPlayAgainstAiOption() {
		// Show AI option from the very start, even before team selection
		return this.gameNotation.moves.length <= 1;
	}

	getCurrentPlayer() {
		if (this.gameNotation.moves.length % 2 === 0) {
			return HOST;
		} else {
			return GUEST;
		}
	}

	cleanup() {
		if (this.actuator && this.actuator.dispose) {
			this.actuator.dispose();
		}
	}

	set3DBoardOn(isOn) {
		this.createActuator();
		this.callActuate();
	}

	buildToggle3DBoardDiv() {
		return _buildToggle3DBoardDiv();
	}

	buildToggleRoundBoardDiv() {
		return _buildToggleRoundBoardDiv();
	}

	isSolitaire() {
		return false;
	}

	setGameNotation(newGameNotation) {
		this.gameNotation.setNotationText(newGameNotation);
	}
}

export default TrifleController;
