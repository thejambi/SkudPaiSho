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
import { TrifleAggressiveAI } from './ai/TrifleAggressiveAI';
import { TrifleDefensiveAI } from './ai/TrifleDefensiveAI';
import { debug, gameDevOn } from '../GameData';
import {
	activeAi,
	activeAi2,
	BRAND_NEW,
	GameType,
	READY_FOR_BONUS,
	WAITING_FOR_ENDPOINT,
	callSubmitMove,
	createGameIfThatIsOk,
	currentMoveIndex,
	finalizeMove,
	gameController,
	gameId,
	getCurrentPlayer,
	getGameOptionsMessageElement,
	isInReplay,
	myTurn,
	onlinePlayEnabled,
	playingOnlineGame,
	refreshMessage,
	rerunAll,
	userIsLoggedIn,
} from '../PaiShoMain';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	OldTrifleGameNotation,
	OldTrifleNotationBuilder,
} from './OldTrifleGameNotation';
import {
	setCurrentTileCodes,
	setCurrentTileMetadata
} from './PaiShoGamesTileMetadata';
import { TrifleActuator } from './TrifleActuator';
import { TrifleGameManager } from './TrifleGameManager';
import { TrifleTile } from './TrifleTile';
import { TrifleTileInfo, TrifleTiles } from './TrifleTileInfo';
import { TrifleTileCodes, defineTrifleTiles } from './TrifleTiles';

export class TrifleController {
	constructor(gameContainer, isMobile) {
		this.actuator = new TrifleActuator(gameContainer, isMobile);

		TrifleTileInfo.initializeTrifleData();
		defineTrifleTiles();
		setCurrentTileMetadata(TrifleTiles);
		setCurrentTileCodes(TrifleTileCodes);
		this.resetGameManager();
		this.resetNotationBuilder();
		this.resetGameNotation();

		this.hostAccentTiles = [];
		this.guestAccentTiles = [];

		this.isInviteOnly = true;
		this.isPaiShoGame = true;
	}

	static getHostTilesContainerDivs() {
		return '';
	}

	static getGuestTilesContainerDivs() {
		return '';
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
		this.notationBuilder = new OldTrifleNotationBuilder();
		if (offerDraw) {
			this.notationBuilder.offerDraw = true;
		}
		this.checkingOutOpponentTileOrNotMyTurn = false;
	}

	resetGameNotation() {
		this.gameNotation = this.getNewGameNotation();
	}

	getNewGameNotation() {
		return new OldTrifleGameNotation();
	}

	callActuate() {
		this.theGame.actuate();
	}

	resetMove() {
		this.notationBuilder.offerDraw = false;
		if (this.notationBuilder.status === BRAND_NEW) {
			// Remove last move
			this.gameNotation.removeLastMove();
		} else if (this.notationBuilder.status === READY_FOR_BONUS) {
			// Just rerun
		}

		rerunAll();
	}

	getDefaultHelpMessageText() {
		return "<h4>Trifle</h4> <p> <p>Trifle is inspired by Vagabond Pai Sho, the Pai Sho variant seen in the fanfiction story <a href='https://skudpaisho.com/site/more/fanfiction-recommendations/' target='_blank'>Gambler and Trifle (download here)</a>.</p> <p><strong>You win</strong> if you capture your opponent's Banner tile.</p> <p><strong>On a turn</strong>, you may either deploy a tile or move a tile.</p> <p><strong>You can't capture Flower/Banner tiles</strong> until your Banner has been deployed.<br /> <strong>You can't capture Non-Flower/Banner tiles</strong> until both players' Banner tiles have been deployed.</p> <p><strong>Hover</strong> over any tile to see how it works.</p> </p> <p>Select tiles to learn more or <a href='https://skudpaisho.com/site/games/trifle-pai-sho/' target='_blank'>view the rules</a>.</p>";
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
		this.theGame.markingManager.clearMarkings();
		this.callActuate();

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
		}
	}

	completeMove() {
		const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.theGame.runNotationMove(move);
		this.gameNotation.addMove(move);
		if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
			createGameIfThatIsOk(this.getGameTypeId());
		} else {
			if (playingOnlineGame()) {
				callSubmitMove();
			} else {
				finalizeMove();
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
			return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
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
		if (currentMoveIndex % 2 === 0) {	// To get right player during replay...
			return HOST;
		} else {
			return GUEST;
		}
	}

	cleanup() {
		// document.querySelector(".svgContainer").classList.remove("TrifleBoardRotate");
	}

	isSolitaire() {
		return false;
	}

	setGameNotation(newGameNotation) {
		this.gameNotation.setNotationText(newGameNotation);
	}
}

export default TrifleController;
