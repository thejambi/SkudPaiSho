/* Vagabond Pai Sho specific UI interaction logic */

/* import { Client } from 'boardgame.io/client'; */

import {
  BRAND_NEW,
  GameType,
  READY_FOR_BONUS,
  WAITING_FOR_ENDPOINT,
  activeAi,
  activeAi2,
  buildDropdownDiv,
  callSubmitMove,
  clearMessage,
  closeModal,
  createGameIfThatIsOk,
  currentMoveIndex,
  finalizeMove,
  gameController,
  gameId,
  getCurrentPlayer,
  getGameOptionsMessageElement,
  getUserGamePreference,
  isInReplay,
  myTurn,
  onlinePlayEnabled,
  playingOnlineGame,
  promptForCustomTileDesigns,
  refreshMessage,
  rerunAll,
  setUserGamePreference,
  showModalElem,
  userIsLoggedIn,
  vagabondTileDesignTypeKey
} from '../PaiShoMain';
import {
  DEPLOY,
  DRAW_ACCEPT,
  GUEST,
  HOST,
  MOVE,
  NotationPoint
} from '../CommonNotationObjects';
import { POSSIBLE_MOVE } from "../skud-pai-sho/SkudPaiShoBoardPoint";
import { SWAP_BISON_WITH_LEMUR, gameOptionEnabled } from '../GameOptions';
import { VagabondActuator } from './VagabondActuator';
import { VagabondGameManager } from './VagabondGameManager';
import {
  VagabondGameNotation,
  VagabondNotationBuilder,
} from './VagabondGameNotation';
import { VagabondMctsGame, VagabondNotationBgIoGame } from './VagabondNotationBgIoGame';
import { VagabondRandomAIv1 } from './ai/VagabondRandomAIv1';
import { VagabondStrategicAI } from './ai/VagabondStrategicAI';
import { VagabondTile, VagabondTileCodes } from './VagabondTile';
import { dateIsAprilFools, debug } from "../GameData";
import { MCTS } from '../ai/MCTS';

export var VagabondConstants = {
	preferencesKey: "VagabondPreferencesKey"
};
export var VagabondPreferences = {
	customTilesUrl: ""
};

export class VagabondController {
	constructor(gameContainer, isMobile) {
		/* Set default preferences */
		if (!localStorage.getItem(vagabondTileDesignTypeKey)
			|| !VagabondController.tileDesignTypeValues[localStorage.getItem(vagabondTileDesignTypeKey)]) {
			localStorage.setItem(vagabondTileDesignTypeKey, "tggvagabond");
		}

		VagabondController.loadPreferences();

		this.actuator = new VagabondActuator(gameContainer, isMobile, this.isAnimationsEnabled());

		this.resetGameManager();
		this.resetNotationBuilder();
		this.resetGameNotation();

		this.hostAccentTiles = [];
		this.guestAccentTiles = [];

		this.isPaiShoGame = true;
	}
	static loadPreferences() {
		var savedPreferences = JSON.parse(localStorage.getItem(VagabondConstants.preferencesKey));
		if (savedPreferences) {
			VagabondPreferences = savedPreferences;
		}
	}
	static tileDesignSupportsLemur(designKey) {
		if (!designKey) {
			designKey = localStorage.getItem(vagabondTileDesignTypeKey);
		}
		return [
			'tggvagabond',
			'tggoriginal',
			'gaoling',
			'gaolingkoiwheel'
		].includes(designKey);
	}
	static getHostTilesContainerDivs() {
		if (gameOptionEnabled(SWAP_BISON_WITH_LEMUR)) {
			return '<div class="HC"></div> <div class="H' + VagabondTileCodes.FlyingLemur + '"></div> <div class="HB"></div> <div class="HW"></div> <br class="clear" /> <div class="HF"></div> <div class="HD"></div> <div class="H_empty"></div> <div class="HL"></div>';
		}
		return '<div class="HC"></div> <div class="HS"></div> <div class="HB"></div> <div class="HW"></div> <br class="clear" /> <div class="HF"></div> <div class="HD"></div> <div class="H_empty"></div> <div class="HL"></div>';
	}
	static getGuestTilesContainerDivs() {
		if (gameOptionEnabled(SWAP_BISON_WITH_LEMUR)) {
			return '<div class="GC"></div> <div class="G' + VagabondTileCodes.FlyingLemur + '"></div> <div class="GB"></div> <div class="GW"></div> <br class="clear" /> <div class="GF"></div> <div class="GD"></div> <div class="G_empty"></div> <div class="GL"></div>';
		}
		return '<div class="GC"></div> <div class="GS"></div> <div class="GB"></div> <div class="GW"></div> <br class="clear" /> <div class="GF"></div> <div class="GD"></div> <div class="G_empty"></div> <div class="GL"></div>';
	}
	static setTileDesignsPreference(tileDesignKey) {
		if (tileDesignKey === 'custom') {
			promptForCustomTileDesigns(GameType.VagabondPaiSho, VagabondPreferences.customTilesUrl);
		} else {
			localStorage.setItem(vagabondTileDesignTypeKey, tileDesignKey);
			if (gameController && gameController.callActuate) {
				gameController.callActuate();
			}
		}
	}
	static isUsingCustomTileDesigns() {
		return localStorage.getItem(vagabondTileDesignTypeKey) === "custom";
	}
	static getCustomTileDesignsUrl() {
		return VagabondPreferences.customTilesUrl;
	}
	static buildTileDesignDropdownDiv(alternateLabelText) {
		var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
		return buildDropdownDiv("vagabondPaiShoTileDesignDropdown", labelText + ":",
			VagabondController.buildDesignTypeValuesForDropdown(),
			localStorage.getItem(vagabondTileDesignTypeKey),
			function() {
				VagabondController.setTileDesignsPreference(this.value);
			});
	}
	static buildDesignTypeValuesForDropdown() {
		var designValues = {};
		Object.keys(VagabondController.tileDesignTypeValues).forEach(function(key, index) {
			if (!gameOptionEnabled(SWAP_BISON_WITH_LEMUR)
				|| VagabondController.tileDesignSupportsLemur(key)) {
				designValues[key] = VagabondController.tileDesignTypeValues[key];
			}
		});
		return designValues;
	}
	getGameTypeId() {
		return GameType.VagabondPaiSho.id;
	}
	completeSetup() {
		/* peekAtOpponentMoves: Allow display of opponent piece movement */
		this.peekAtOpponentMovesPrefKey = "PeekAtOpponentMoves";
		this.peekAtOpponentMoves = getUserGamePreference(this.peekAtOpponentMovesPrefKey) === "true";
		debug("Peeky?: " + this.peekAtOpponentMoves);
		debug("!this.peek...: " + !this.peekAtOpponentMoves);

		if (gameOptionEnabled(SWAP_BISON_WITH_LEMUR)
			&& !VagabondController.tileDesignSupportsLemur()) {
			VagabondController.setTileDesignsPreference("tggvagabond");
		}
	}
	resetGameManager() {
		this.theGame = new VagabondGameManager(this.actuator);

		var vgame = new VagabondMctsGame(GUEST);
		let iterations = 500; //more iterations -> stronger AI, more computation
		let exploration = 0.55; //1.41 //exploration vs. explotation parameter, sqrt(2) is reasonable default (c constant in UBC forumula)
		var mcts = new MCTS(vgame, GUEST, iterations, exploration);

		this.mctsGame = {
			game: vgame,
			mcts: mcts
		};

		if (this.bgIoGameClient) {
			this.bgIoGameClient.stop();
		}

		// this.bgIoGameClient = Client({
		// 	game: VagabondNotationBgIoGame
		// });
		// this.bgIoGameClient.start();
	}
	resetNotationBuilder(applyDrawOffer) {
		this.notationBuilder = new VagabondNotationBuilder();
		if (applyDrawOffer) {
			this.notationBuilder.offerDraw = true;
		}

		this.checkingOutOpponentTileOrNotMyTurn = false;
	}
	resetGameNotation() {
		this.gameNotation = this.getNewGameNotation();
	}
	getNewGameNotation() {
		return new VagabondGameNotation();
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
		var helpText = "<h4>Vagabond Pai Sho</h4> <p> <p>Vagabond Pai Sho is the Pai Sho variant seen in the fanfiction story <a href='https://skudpaisho.com/site/more/fanfiction-recommendations/' target='_blank'>Gambler and Vagabond (download here)</a>.</p> <p><strong>You win</strong> if you capture your opponent's White Lotus tile.</p> <p><strong>On a turn</strong>, you may either deploy a tile or move a tile.</p> <p><strong>You can't capture Flower tiles</strong> until your White Lotus has been deployed.<br /> <strong>You can't capture Non-Flower tiles</strong> until both players' White Lotus tiles have been deployed.</p> <p><strong>Hover</strong> over any tile to see how it works.</p> </p> <p>Select tiles to learn more or <a href='https://skudpaisho.com/site/games/vagabond-pai-sho/' target='_blank'>view the rules</a>.</p>";
		return helpText;
	}
	togglePeekAtOpponentMoves() {
		this.peekAtOpponentMoves = !this.peekAtOpponentMoves;
		setUserGamePreference(this.peekAtOpponentMovesPrefKey, this.peekAtOpponentMoves);
		clearMessage();
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
				joinText.appendChild(document.createTextNode(' above to join another player\'s game. Or, you can start a game that other players can join by making a move.'));
				container.appendChild(joinText);
				container.appendChild(document.createElement('br'));
			} else {
				container.appendChild(document.createTextNode('Sign in to enable online gameplay. Or, start playing a local game by making a move.'));
			}

			if (dateIsAprilFools()) {
				container.appendChild(document.createElement('br'));
				container.appendChild(document.createElement('br'));
				const strongEl = document.createElement('strong');
				strongEl.appendChild(document.createTextNode('Try the Double Movement Distance game option, it\'s more fun!'));
				strongEl.appendChild(document.createElement('br'));
				const img = document.createElement('img');
				img.src = 'https://skudpaisho.com/images/aprilfools/irohwink.png';
				img.width = 160;
				strongEl.appendChild(img);
				container.appendChild(strongEl);
			}

			container.appendChild(getGameOptionsMessageElement(GameType.VagabondPaiSho.gameOptions));
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
	/* VagabondController.prototype.getAdditionalMessageElement = function() {
		var msgElement = document.createElement("span");
		msgElement.innerText = "Play MCTS move";
		msgElement.addEventListener('click', () => {
			this.playMctsMove();
		});
		return msgElement;
	}; */
	playMctsMove() {
		showModalElem('AI Move Loading', document.createTextNode('AI move loading...'), true);
		setTimeout(() => {
			var move = this.mctsGame.mcts.selectMove();
			if (!move) {
				showModalElem('AI Move', document.createTextNode("No AI move found :("));
				return;
			}
			this.gameNotation.addMove(move);
			finalizeMove();
			closeModal();
		}, 50);
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
		if (myTurn() && this.gameNotation.lastMoveHasDrawOffer()) {
			this.resetNotationBuilder();
			this.notationBuilder.moveType = DRAW_ACCEPT;

			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
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
		if (!myTurn() && !this.peekAtOpponentMoves) {
			return;
		}
		if (currentMoveIndex !== this.gameNotation.moves.length && !this.peekAtOpponentMoves) {
			debug("Can only interact if all moves are played.");
			return;
		}

		var divName = tileDiv.getAttribute("name"); // Like: GW5 or HL
		var tileId = parseInt(tileDiv.getAttribute("id"));
		var playerCode = divName.charAt(0);
		var tileCode = divName.substring(1);

		var player = GUEST;
		if (playerCode === 'H') {
			player = HOST;
		}

		var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

		if (tile.ownerName !== this.getCurrentPlayer() || !myTurn()) {
			// Hey, that's not your tile!
			this.checkingOutOpponentTileOrNotMyTurn = true;
			if (!this.peekAtOpponentMoves) {
				return;
			}
		}

		if (this.notationBuilder.status === BRAND_NEW) {
			// new Deploy turn
			tile.selectedFromPile = true;

			this.notationBuilder.moveType = DEPLOY;
			this.notationBuilder.tileType = tileCode;
			this.notationBuilder.status = WAITING_FOR_ENDPOINT;

			// this.theGame.revealDeployPoints(getCurrentPlayer(), tileCode); // Old
			this.theGame.revealDeployPoints(tile.ownerName, tileCode); // New
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder(this.notationBuilder.offerDraw);
		}
	}
	RmbDown(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
	}
	RmbUp(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (mouseEndPoint == this.mouseStartPoint) {
			this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint);
		}
		else if (this.mouseStartPoint) {
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
		if (!myTurn() && !this.peekAtOpponentMoves) {
			return;
		}
		if (currentMoveIndex !== this.gameNotation.moves.length && !this.peekAtOpponentMoves) {
			debug("Can only interact if all moves are played.");
			return;
		}

		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (this.notationBuilder.status === BRAND_NEW) {
			if (boardPoint.hasTile()) {
				if (boardPoint.tile.ownerName !== this.getCurrentPlayer() || !myTurn()) {
					debug("That's not your tile!");
					this.checkingOutOpponentTileOrNotMyTurn = true;
					if (!this.peekAtOpponentMoves) {
						return;
					}
				}

				if (!boardPoint.tile.canMove()) {
					return;
				}

				this.notationBuilder.status = WAITING_FOR_ENDPOINT;
				this.notationBuilder.moveType = MOVE;
				this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				this.theGame.revealPossibleMovePoints(boardPoint);
			}
		} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
			if (boardPoint.isType(POSSIBLE_MOVE) && myTurn()) {
				// They're trying to move there! And they can! Exciting!
				// Need the notation!
				this.theGame.hidePossibleMovePoints();

				if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
					this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));

					var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
					this.theGame.runNotationMove(move);

					// Move all set. Add it to the notation!
					this.gameNotation.addMove(move);
					if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
						createGameIfThatIsOk(GameType.VagabondPaiSho.id);
					} else {
						if (playingOnlineGame()) {
							callSubmitMove();
						} else {
							finalizeMove();
						}
					}
				} else {
					this.resetNotationBuilder();
				}
			} else {
				this.theGame.hidePossibleMovePoints();
				this.resetNotationBuilder(this.notationBuilder.offerDraw);
			}
		}
	}
	// VagabondController.prototype.skipHarmonyBonus = function() {
	// 	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	// 	this.gameNotation.addMove(move);
	// 	if (playingOnlineGame()) {
	// 		callSubmitMove();
	// 	} else {
	// 		finalizeMove();
	// 	}
	// }
	getTheMessage(tile, ownerName) {
		var message = [];

		var tileCode = tile.code;

		var heading = VagabondTile.getTileName(tileCode);

		if (tileCode === 'L') {
			heading = "White Lotus";
			message.push("Flower Tile");
			message.push("Can move 1 space");
		} else if (tileCode === VagabondTileCodes.FlyingLemur) {
			message.push("Deployed on the Temples - the points inside of the small red triangles in the corners of the board");
			message.push("Can move up to five spaces, turning any number of times, and can move over other tiles");
			message.push("Cannot move through or off of a space that is adjacent to an opponent's Chrysanthemum tile");
			message.push("Can capture other tiles");
		} else if (tileCode === 'S') {
			heading = "Sky Bison";
			// message.push("Deployed on the point inside of the small red triangles in the corners of the board");
			message.push("Deployed on the Temples - the points inside of the small red triangles in the corners of the board");
			message.push("Can move up to six spaces, turning any number of times, but cannot move into an opponent's Sky Bison's territorial zone");
			message.push("Cannot move through or off of a space that is adjacent to an opponent's Chrysanthemum tile");
			message.push("Can capture other tiles");
			// message.push("A Sky Bison has a territorial zone the size of the area the tile can move within. No other Sky Bison is allowed in this zone once the Sky Bison has moved out of its starting position.");
			message.push("After the Sky Bison has moved out of its temple and is not trapped by a Chrysanthemum, it creates a territorial zone 6 spaces around it");
		} else if (tileCode === 'B') {
			heading = "Badgermole";
			message.push("Can move only one space in any direction OR move directly adjacent to a Flower Tile if that Flower Tile is in the Badgermole's \"line of sight\" (meaning, the tiles lie on the same line with no other tiles in between)");
			message.push("Flower Tiles adjacent to a friendly Badgermole are protected from capture");
		} else if (tileCode === 'W') {
			heading = "Wheel";
			message.push("Can move any number of spaces forwards, backwards, left, or right across the spaces of the board as opposed to diagonally on the lines");
			message.push("Can capture other tiles");
		} else if (tileCode === 'C') {
			heading = "Chrysanthemum";
			message.push("Flower Tile");
			message.push("Cannot move");
			message.push("Freezes opponent's Sky Bison tiles in place when adjacent");
		} else if (tileCode === 'F') {
			heading = "Fire Lily";
			message.push("Flower Tile");
			message.push("Cannot move");
			message.push("Enables deployment of White Dragon");
		} else if (tileCode === 'D') {
			heading = "White Dragon";
			message.push("Can be deployed in a 5-space area around the Fire Lily");
			message.push("Can move anywhere inside that 5-space Fire Lily zone");
			message.push("Can capture other tiles");
		}

		return {
			heading: heading,
			message: message
		};

		// if (message.length > 1) {
		// 	setMessage(toHeading(heading) + toBullets(message));
		// } else {
		// 	setMessage(toHeading(heading) + toMessage(message));
		// }
	}
	getTileMessage(tileDiv) {
		var divName = tileDiv.getAttribute("name"); // Like: GW5 or HL
		var tileId = parseInt(tileDiv.getAttribute("id"));

		var tile = new VagabondTile(divName.substring(1), divName.charAt(0));

		var ownerName = HOST;
		if (divName.startsWith('G')) {
			ownerName = GUEST;
		}

		return this.getTheMessage(tile, ownerName);
	}
	getPointMessage(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (boardPoint.hasTile()) {
			return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
		} else {
			return null;
		}
	}
	playAiTurn(finalizeMove) {
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

		var self = this;
		setTimeout(function() {
			var move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);
			if (!move) {
				debug("No move given...");
				return;
			}
			self.gameNotation.addMove(move);
			finalizeMove();
		}, 10);
	}
	startAiGame(finalizeMove) {
		this.playAiTurn(finalizeMove);
	}
	getAiList() {
		return [new VagabondRandomAIv1(), new VagabondStrategicAI()];
	}
	getCurrentPlayer() {
		// if (this.gameNotation.moves.length % 2 === 0) {
		if (currentMoveIndex % 2 === 0) { // To get right player during replay...
			return HOST;
		} else {
			return GUEST;
		}
	}
	runMove(move, withActuate, moveAnimationBeginStep, skipAnimation) {
		this.theGame.runNotationMove(move, withActuate);

		if (this.bgIoGameClient) {
			this.bgIoGameClient.moves.addMoveNotation(move.fullMoveText);
		}

		if (this.mctsGame) {
			this.mctsGame.game.playMove(move);
		}
	}
	cleanup() {
		// document.querySelector(".svgContainer").classList.remove("vagabondBoardRotate");
		if (this.bgIoGameClient) {
			this.bgIoGameClient.stop();
		}
	}
	isSolitaire() {
		return false;
	}
	setGameNotation(newGameNotation) {
		this.gameNotation.setNotationText(newGameNotation);
	}
	getAdditionalHelpTabDiv() {
		var settingsDiv = document.createElement("div");

		var heading = document.createElement("h4");
		heading.innerText = "Vagabond Pai Sho Preferences:";

		var movePeekingDiv = document.createElement("div");
		var movePeekingText = "Opponent move and replay peeking is ";
		if (this.peekAtOpponentMoves) {
			movePeekingText += "enabled";
		} else {
			movePeekingText += "disabled";
		}
		movePeekingText += ". ";

		movePeekingDiv.innerText = movePeekingText;

		var movePeekingToggleSpan = document.createElement("span");
		movePeekingToggleSpan.innerText = "Toggle";
		movePeekingToggleSpan.classList.add("skipBonus");
		movePeekingToggleSpan.onclick = () => {
			this.togglePeekAtOpponentMoves();
		};

		movePeekingDiv.appendChild(movePeekingToggleSpan);


		settingsDiv.appendChild(heading);
		settingsDiv.appendChild(VagabondController.buildTileDesignDropdownDiv());
		settingsDiv.appendChild(movePeekingDiv);

		settingsDiv.appendChild(document.createElement("br"));

		settingsDiv.appendChild(this.buildToggleAnimationsDiv());

		settingsDiv.appendChild(document.createElement("br"));
		return settingsDiv;
	}
	buildToggleAnimationsDiv() {
		var div = document.createElement("div");
		var onOrOff = this.isAnimationsEnabled() ? "on" : "off";
		
		var textSpan = document.createElement("span");
		textSpan.textContent = "Move animations are " + onOrOff + ": ";
		div.appendChild(textSpan);
		
		var toggleSpan = document.createElement("span");
		toggleSpan.className = "skipBonus";
		toggleSpan.textContent = "toggle";
	toggleSpan.onclick = () => this.toggleAnimations();
		div.appendChild(toggleSpan);
		
		return div;
	}
	toggleAnimations() {
		if (this.isAnimationsEnabled()) {
			setUserGamePreference(VagabondController.animationsEnabledKey, "false");
			this.actuator.setAnimationOn(false);
		} else {
			setUserGamePreference(VagabondController.animationsEnabledKey, "true");
			this.actuator.setAnimationOn(true);
		}
		clearMessage();
	}
	isAnimationsEnabled() {
		/* Check !== false to default to on */
		return getUserGamePreference(VagabondController.animationsEnabledKey) !== "false";
	}
	setCustomTileDesignUrl(url) {
		VagabondPreferences.customTilesUrl = url;
		localStorage.setItem(VagabondConstants.preferencesKey, JSON.stringify(VagabondPreferences));
		localStorage.setItem(vagabondTileDesignTypeKey, 'custom');
		if (gameController && gameController.callActuate) {
			gameController.callActuate();
		}
	}
	setAnimationsOn(isAnimationsOn) {
		if (isAnimationsOn !== this.isAnimationsEnabled()) {
			this.toggleAnimations();
		}
	}
}


VagabondController.animationsEnabledKey = "AnimationsEnabled";








































/* Vagabond tile designs */
VagabondController.tileDesignTypeValues = {
	tggvagabond: "The Garden Gate Designs",
	gaoling: "Gaoling",
	tgggyatso: "Gyatso TGG Classic",
	keygyatso: "Key Pai Sho Gyatso Style",
	tggoriginal: "The Garden Gate Designs Original",
	chujired: "Chuji Red",
	tggclassic: "TGG Classic",
	classic: "Classic Pai Sho Project",
	water: "Water themed Garden Gate Designs",
	fire: "Fire themed Garden Gate Designs",
	canon: "Canon colors Garden Gate Designs",
	owl: "Order of the White Lotus Garden Gate Designs",
	royal: "TGG Royal",
	gaolingkoiwheel: "Gaoling Koi-Wheel",
	keygyatsokoi: "Key Pai Sho Koi-Wheel",
	keygyatsokoi2: "Key Pai Sho Koi-Wheel Mobile",
	tggkoiwheel: "TGG Koi-Wheel",
	vescuccikoiwheel: "Vescucci Koi-Wheel",
	vescuccikoiwheelrustic: "Rustic Vescucci Koi-Wheel",
	royalkoiwheel: "TGG Royal Koi-Wheel",
	custom: "Use Custom Designs"
};








