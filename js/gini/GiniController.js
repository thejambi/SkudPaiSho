/* Gini Pai Sho specific UI interaction logic */

import { READY_FOR_BONUS } from '../GameConstants';
import {
  showResetMoveMessage,
  showSkipButtonMessage,
} from '../GameFlow';
import {
  activeAi,
  activeAi2,
  BRAND_NEW,
  GameType,
  WAITING_FOR_ENDPOINT,
  callSubmitMove,
  clearMessage,
  createGameIfThatIsOk,
  finalizeMove,
  gameController,
  gameId,
  getCurrentPlayer,
  getGameOptionsMessageElement,
  getOnlineGameOpponentUsername,
  iAmPlayerInCurrentOnlineGame,
  isAnimationsOn,
  isInReplay,
  myTurn,
  onlinePlayEnabled,
  playingOnlineGame,
  quickFinalizeMove,
  refreshMessage,
  rerunAll,
  setGameTitleText,
} from '../PaiShoMain';
import { getUsername, userIsLoggedIn, usernameIsOneOf } from '../UserData';
import {
  DEPLOY,
  DRAW_ACCEPT,
  GUEST,
  HOST,
  MOVE,
  NotationPoint,
  PASS_TURN,
} from '../CommonNotationObjects';
import { GiniActuator } from './GiniActuator';
import { Gini3DActuator } from './Gini3DActuator';
import {
  ACCENT_TILE_HOME,
  GiniGameManager,
  GiniNotationAdjustmentFunction
} from './GiniGameManager';
import { GiniOptions } from './GiniOptions';
import {
  is3DBoardOn,
  buildToggle3DBoardDiv as _buildToggle3DBoardDiv,
  buildToggleRoundBoardDiv as _buildToggleRoundBoardDiv,
} from '../PaiSho3DOptions';
import {
  GiniTileCodes,
  GiniTileInfo,
  GiniTiles,
} from './GiniTiles';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
  TrifleGameNotation,
  TrifleNotationBuilder,
  TrifleNotationBuilderStatus,
} from '../trifle/TrifleGameNotation';
import { TrifleTile } from '../trifle/TrifleTile';
import { TrifleTileInfo } from '../trifle/TrifleTileInfo';
import { PromptTargetHelper } from '../trifle/PromptTargetHelper';
import { debug, debugOn } from '../GameData';
import { getPlayerCodeFromName } from '../pai-sho-common/PaiShoPlayerHelp';
import { setCurrentTileCodes, setCurrentTileMetadata } from '../trifle/PaiShoGamesTileMetadata';

export var GiniConstants = {
	preferencesKey: "GiniPreferencesKey"
};

export function GiniController(gameContainer, isMobile) {
	new GiniOptions();
	GiniController.loadPreferences();
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;
	this.createActuator();

	GiniTileInfo.initializeTrifleData();
	setCurrentTileMetadata(GiniTiles);
	setCurrentTileCodes(GiniTileCodes);
	this.resetGameManager();
	this.resetGameNotation();
	this.resetNotationBuilder();

	this.isPaiShoGame = true;

	this.showDebugInfo = false;
	this.clickToShowPointMessage = false;
	this.lastClickedPointForMessage = null;

	this.supportsMoveLogMessages = true;
}

GiniController.loadPreferences = function() {
	const preferences = localStorage.getItem(GiniConstants.preferencesKey);
	if (preferences && preferences.length > 0) {
		try {
			GiniOptions.Preferences = JSON.parse(preferences);
			return;
		} catch(error) {
			debug("Error loading Gini preferences");
		}
	}
	GiniOptions.Preferences = {
		customTilesUrl: ""
	};
};

GiniController.prototype.createActuator = function() {
	if (is3DBoardOn()) {
		this.actuator = new Gini3DActuator(this.gameContainer, this.isMobile, isAnimationsOn());
	} else {
		this.actuator = new GiniActuator(this.gameContainer, this.isMobile, isAnimationsOn());
	}
	if (this.theGame) {
		this.theGame.updateActuator(this.actuator);
	}
};

GiniController.prototype.getGameTypeId = function() {
	return GameType.GiniPaiSho.id;
};

GiniController.prototype.resetGameManager = function() {
	this.theGame = new GiniGameManager(this.actuator);
};

GiniController.prototype.resetNotationBuilder = function() {
	var offerDraw = false;
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
};

GiniController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

GiniController.prototype.getNewGameNotation = function() {
	return new TrifleGameNotation(GUEST);
};

GiniController.getHostTilesContainerDivs = function() {
	return '';
};

GiniController.getGuestTilesContainerDivs = function() {
	return '';
};

GiniController.prototype.callActuate = function() {
	this.theGame.actuate();
};

GiniController.prototype.resetMove = function(skipAnimation) {
	this.notationBuilder.offerDraw = false;
	if (this.notationBuilder.status === BRAND_NEW) {
		this.gameNotation.removeLastMove();
	}

	rerunAll(null, null, skipAnimation);
};

GiniController.prototype.getDefaultHelpMessageText = function() {
	return '<h4>Gini Pai Sho</h4>'
		+ '<p><strong><center>How to win</center></strong></p>'
		+ '<p>To win a game of Gini Pai Sho, you must reach your "Win Line" with your White Lotus first.</p>'
		+ '<p><strong><center>Playing a Turn</center></strong></p>'
		+ '<p>Players take alternating turns. When it is your turn, select and move a tile according to its specified movement and apply any triggered abilities, or place an Accent Tile on the playing area of the board.</p>'
		+ '<p><strong><center>Main Tiles</center></strong></p>'
		+ '<p>All Main Tiles can move up to 4 spaces along the lines that are not entirely inside Neutral Gardens.</p>'
		+ '<ul>'
		+ '<li><strong>Koi</strong>: When touching a White Garden, traps all surrounding opponent tiles.</li>'
		+ '<li><strong>Badgermole</strong>: After moving, if touching a White Garden, may flip one surrounding tile over itself.</li>'
		+ '<li><strong>Dragon</strong>: After moving, if touching a Red Garden, can push one surrounding tile 1 space away.</li>'
		+ '<li><strong>Sky Bison</strong>: When touching a Red Garden, surrounding friendly tiles gain +1 movement and can move over other tiles.</li>'
		+ '<li><strong>Ginseng</strong>: Friendly tiles in line of sight (up to 4 spaces) are protected from opponent abilities. Can capture Accent Tiles (returned to owner\'s hand).</li>'
		+ '</ul>'
		+ '<p><strong><center>Accent Tiles</center></strong></p>'
		+ '<ul>'
		+ '<li><strong>Water</strong>: Place on empty spot, swap two surrounding tiles.</li>'
		+ '<li><strong>Earth</strong>: Place on empty spot, rotate surrounding tiles clockwise.</li>'
		+ '<li><strong>Fire</strong>: Place on any other tile, move that tile to a surrounding spot.</li>'
		+ '<li><strong>Air</strong>: Swap with any tile (not White Lotus), place exchanged tile anywhere.</li>'
		+ '</ul>'
		+ '<p><strong><center>White Lotus</center></strong></p>'
		+ '<p>Moves by jumping over any tiles diagonal to it, creating a potential chain jump. Cannot do anything but move.</p>';
};

GiniController.prototype.gameNotBegun = function() {
	return this.gameNotation.moves.length === 0;
};

GiniController.prototype.getAdditionalMessage = function() {
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

		container.appendChild(getGameOptionsMessageElement(GameType.GiniPaiSho.gameOptions));
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
	}

	return container;
};

GiniController.prototype.toggleDebug = function() {
	this.showDebugInfo = !this.showDebugInfo;
	clearMessage();
};

GiniController.prototype.completeSetup = function() {
	rerunAll();
	this.callActuate();
};

GiniController.prototype.startOnlineGame = function() {
	this.resetNotationBuilder();
	this.notationBuilder.currentPlayer = HOST;
	this.notationBuilder.moveType = PASS_TURN;

	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.theGame.runNotationMove(move);
	this.gameNotation.addMove(move);

	createGameIfThatIsOk(GameType.GiniPaiSho.id);
};

GiniController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Gini Preferences:";

	settingsDiv.appendChild(heading);
	// settingsDiv.appendChild(GiniOptions.buildTileDesignDropdownDiv("Tile Designs")); // Tile designs not supported

	if (!playingOnlineGame() || !iAmPlayerInCurrentOnlineGame() || getOnlineGameOpponentUsername() === getUsername()) {
		settingsDiv.appendChild(document.createElement("br"));
		settingsDiv.appendChild(GiniOptions.buildToggleViewAsGuestDiv());
	}

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(GiniOptions.buildToggleShowWinLinesDiv());

	settingsDiv.appendChild(this.buildToggle3DBoardDiv());
	if (is3DBoardOn()) {
		settingsDiv.appendChild(this.buildToggleRoundBoardDiv());
	}
	settingsDiv.appendChild(document.createElement("br"));

	if (usernameIsOneOf(["SkudPaiSho"]) || debugOn) {
		var toggleDebugText = "Enable debug Help display";
		if (this.showDebugInfo) {
			toggleDebugText = "Disable debug Help display";
		}
		var toggleDebugSpan = document.createElement("span");
		toggleDebugSpan.classList.add("skipBonus");
		toggleDebugSpan.setAttribute("onclick", "gameController.toggleDebug();");
		toggleDebugSpan.innerText = toggleDebugText;

		settingsDiv.appendChild(toggleDebugSpan);
		settingsDiv.appendChild(document.createElement("br"));
	}

	settingsDiv.appendChild(document.createElement("br"));

	return settingsDiv;
};

GiniController.prototype.toggleViewAsGuest = function() {
	GiniOptions.viewAsGuest = !GiniOptions.viewAsGuest;
	this.createActuator();
	this.callActuate();
	clearMessage();
};

GiniController.prototype.toggleShowWinLines = function() {
	GiniOptions.showWinLines = !GiniOptions.showWinLines;
	localStorage.setItem(GiniOptions.showWinLinesKey, GiniOptions.showWinLines);
	this.callActuate();
	clearMessage();
};

GiniController.prototype.gameHasEndedInDraw = function() {
	return this.theGame.gameHasEndedInDraw;
};

GiniController.prototype.acceptDraw = function() {
	if (myTurn()) {
		this.promptToAcceptDraw = true;
		refreshMessage();
	}
};

GiniController.prototype.confirmAcceptDraw = function() {
	if (myTurn()) {
		this.resetNotationBuilder();
		this.notationBuilder.moveType = DRAW_ACCEPT;

		var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.theGame.runNotationMove(move);
		this.gameNotation.addMove(move);

		if (playingOnlineGame()) {
			callSubmitMove(null, null, { fullMoveText: this.theGame.gameLogText });
		} else {
			finalizeMove();
		}
	}
};

GiniController.prototype.offerDraw = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = true;
		refreshMessage();
	}
};

GiniController.prototype.removeDrawOffer = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = false;
		refreshMessage();
	}
};

GiniController.prototype.unplayedTileClicked = function(tileDiv) {
	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded() && this.notationBuilder.status !== READY_FOR_BONUS) {
		return;
	}

	var divName = tileDiv.getAttribute("name");
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

	if ((tile && tile.ownerName !== getCurrentPlayer()) || !myTurn()) {
		this.checkingOutOpponentTileOrNotMyTurn = true;
	}

	if (this.notationBuilder.status === BRAND_NEW) {
		if (tile) {
			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = DEPLOY;
			this.notationBuilder.tileType = tileCode;

			this.theGame.revealDeployPoints(tile);
		}
	} else if (this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET) {
		if (tile.tileIsSelectable) {
			if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
				PromptTargetHelper.recordTileAnswer(this.notationBuilder.promptTargetData, this.notationBuilder.neededPromptTargetInfo, tile.getOwnerCodeIdObject());
				var notationBuilderSave = this.notationBuilder;
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
};

GiniController.prototype.pointClicked = function(htmlPoint) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded()) {
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
	var currentMovePath = boardPoint.buildMovementPath();

	if (this.notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {
			if (boardPoint.tile.ownerName !== getCurrentPlayer() || !myTurn()) {
				debug("That's not your tile!");
				this.checkingOutOpponentTileOrNotMyTurn = true;
			}

			if (boardPoint.isType(ACCENT_TILE_HOME)) {
				// Accent tile at home position - move to playing area
				this.notationBuilder.status = WAITING_FOR_ENDPOINT;
				this.notationBuilder.moveType = MOVE;
				this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				this.theGame.revealDeployPoints(boardPoint.tile);
			} else {
				this.notationBuilder.status = WAITING_FOR_ENDPOINT;
				this.notationBuilder.moveType = MOVE;
				this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				this.theGame.revealPossibleMovePoints(boardPoint);
			}
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
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
				PromptTargetHelper.recordBoardPointAnswer(this.notationBuilder.promptTargetData, this.notationBuilder.neededPromptTargetInfo, htmlPoint.getAttribute("name"));
				var notationBuilderSave = this.notationBuilder;
				this.resetMove(true);
				this.notationBuilder = notationBuilderSave;
				this.completeMove();
			} else {
				this.resetNotationBuilder();
			}
		}
	}
};

GiniController.prototype.completeMove = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	var skipAnimation = this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET;
	var neededPromptTargetInfo = this.theGame.runNotationMove(move, true, null, skipAnimation);

	if (neededPromptTargetInfo) {
		debug("Prompting user for the rest of the move!");
		this.notationBuilder.status = TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET;
		this.notationBuilder.neededPromptTargetInfo = neededPromptTargetInfo;

		if (neededPromptTargetInfo.sourceAbility.abilityInfo.optional) {
			refreshMessage();
			var abilityTitle = neededPromptTargetInfo.sourceAbility.abilityInfo.title;
			if (!abilityTitle) {
				abilityTitle = neededPromptTargetInfo.sourceAbility.abilityInfo.type;
			}
			showSkipButtonMessage("Skip ability: " + abilityTitle);
		}

		showResetMoveMessage();
	} else {
		this.gameNotation.addMove(move);
		if (playingOnlineGame()) {
			callSubmitMove(null, null, { fullMoveText: this.theGame.gameLogText });
		} else {
			quickFinalizeMove();
		}
	}
};

GiniController.prototype.skipHarmonyBonus = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);
	if (playingOnlineGame()) {
		callSubmitMove(null, null, { fullMoveText: this.theGame.gameLogText });
	} else {
		finalizeMove();
	}
};

GiniController.prototype.getTheMessage = function(tile, ownerName) {
	var message = [];

	var tileCode = tile.code;
	var heading = TrifleTile.getTileName(tileCode);

	message.push(TrifleTileInfo.getReadableDescription(tileCode));

	return {
		heading: heading,
		message: message
	};
};

GiniController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);
	var tile = new TrifleTile(tileCode, playerCode);

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	return this.getTheMessage(tile, ownerName);
};

GiniController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (boardPoint.hasTile()) {
		return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
	} else if (this.showDebugInfo) {
		var messageLines = this.theGame.buildAbilitySummaryLines();
		return {
			heading: "Active Abilities",
			message: messageLines
		};
	}
};

GiniController.prototype.playAiTurn = function(gameFinalize) {
	if (this.theGame.getWinner()) {
		return;
	}
	// No AI yet for Gini
};

GiniController.prototype.startAiGame = function(gameFinalize) {
	this.playAiTurn(gameFinalize);
};

GiniController.prototype.getAiList = function() {
	return [];
};

GiniController.prototype.getCurrentPlayer = function() {
	if (this.gameNotBegun()) {
		return GUEST;
	}
	else {
		var lastPlayer = this.gameNotation.moves[this.gameNotation.moves.length - 1].player;

		if (lastPlayer === HOST) {
			return GUEST;
		} else if (lastPlayer === GUEST) {
			return HOST;
		}
	}
};

GiniController.prototype.cleanup = function() {
	if (this.actuator && this.actuator.dispose) {
		this.actuator.dispose();
	}
};

GiniController.prototype.isSolitaire = function() {
	return false;
};

GiniController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
	if (playingOnlineGame() && iAmPlayerInCurrentOnlineGame() && getOnlineGameOpponentUsername() != getUsername()) {
		new GiniOptions();
		this.createActuator();
		clearMessage();
	}
};

GiniController.prototype.skipClicked = function() {
	PromptTargetHelper.recordSkip(this.notationBuilder.promptTargetData, this.notationBuilder.neededPromptTargetInfo);
	var notationBuilderSave = this.notationBuilder;
	this.resetMove();
	this.notationBuilder = notationBuilderSave;
	this.completeMove();
};

GiniController.prototype.RmbDown = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
};

GiniController.prototype.RmbUp = function(htmlPoint) {
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
};

GiniController.prototype.buildNotationString = function(move) {
	var playerCode = getPlayerCodeFromName(move.player);
	var moveNum = move.moveNum;

	var moveNotation = moveNum + playerCode + ".";

	if (move.moveType === DEPLOY) {
		var endRowAndCol = new NotationPoint(move.endPoint).rowAndColumn;
		moveNotation += move.tileType + "(" + GiniNotationAdjustmentFunction(endRowAndCol.row, endRowAndCol.col) + ")";
	} else if (move.moveType === MOVE) {
		var startRowAndCol = new NotationPoint(move.startPoint).rowAndColumn;
		var endRowAndCol = new NotationPoint(move.endPoint).rowAndColumn;
		moveNotation += "(" + GiniNotationAdjustmentFunction(startRowAndCol.row, startRowAndCol.col) + ")-";
		moveNotation += "(" + GiniNotationAdjustmentFunction(endRowAndCol.row, endRowAndCol.col) + ")";

		if (move.promptTargetData) {
			Object.keys(move.promptTargetData).forEach((key, index) => {
				var promptDataEntry = move.promptTargetData[key];
				if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
					var movedTilePointRowAndCol = promptDataEntry.movedTilePoint.rowAndColumn;
					var movedTileDestinationRowAndCol = promptDataEntry.movedTileDestinationPoint.rowAndColumn;
					moveNotation += "+";
					moveNotation += "(" + GiniNotationAdjustmentFunction(movedTilePointRowAndCol.row, movedTilePointRowAndCol.col) + ")-";
					moveNotation += "(" + GiniNotationAdjustmentFunction(movedTileDestinationRowAndCol.row, movedTileDestinationRowAndCol.col) + ")";
				}
			});
		}
	}

	return moveNotation;
};

GiniController.prototype.setCustomTileDesignUrl = function(url) {
	GiniOptions.Preferences.customTilesUrl = url;
	localStorage.setItem(GiniConstants.preferencesKey, JSON.stringify(GiniOptions.Preferences));
	localStorage.setItem(GiniOptions.tileDesignTypeKey, 'custom');
	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
};

GiniController.isUsingCustomTileDesigns = function() {
	return localStorage.getItem(GiniOptions.tileDesignTypeKey) === "custom";
};

GiniController.getCustomTileDesignsUrl = function() {
	return GiniOptions.Preferences.customTilesUrl;
};

GiniController.prototype.set3DBoardOn = function(isOn) {
	this.createActuator();
	this.callActuate();
};

GiniController.prototype.buildToggle3DBoardDiv = function() {
	return _buildToggle3DBoardDiv();
};

GiniController.prototype.buildToggleRoundBoardDiv = function() {
	return _buildToggleRoundBoardDiv();
};
