/* Spirit Pai Sho specific UI interaction logic */

import {
  BRAND_NEW,
  GameType,
  WAITING_FOR_ENDPOINT,
  buildPreferenceDropdownDiv,
  callSubmitMove,
  clearMessage,
  createGameIfThatIsOk,
  currentMoveIndex,
  finalizeMove,
  gameController,
  gameId,
  getCurrentPlayer,
  getLoginToken,
  getUserGamePreference,
  myTurn,
  onlinePlayEnabled,
  onlinePlayEngine,
  playingOnlineGame,
  rerunAll,
  setUserGamePreference,
  userIsLoggedIn,
} from '../PaiShoMain';
import { GUEST, HOST, MOVE, NotationPoint } from '../CommonNotationObjects';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { SpiritActuator } from './SpiritActuator';
import { Spirit3DActuator } from './Spirit3DActuator';
import { is3DBoardOn, buildToggle3DBoardDiv as _buildToggle3DBoardDiv, buildToggleRoundBoardDiv as _buildToggleRoundBoardDiv } from '../PaiSho3DOptions';
import { SpiritGameManager } from './SpiritGameManager';
import {
  SpiritGameNotation,
  SpiritNotationBuilder,
  SpiritNotationMove,
} from './SpiritGameNotation';
import { SpiritTile } from './SpiritTile';
import { debug } from '../GameData';

export var SpiritPreferences = {
	tileDesignKey: "TileDesigns",
	tileDesignTypeValues: {
		original: "Blue and Green",
		wooden: "Wooden",
		bluepurple: "Blue and Purple",
		chuji: "Chu Ji",
		chujired: "Chu Ji Red",
	}
};

export function SpiritController(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;

	if (is3DBoardOn()) {
		this.actuator = new Spirit3DActuator(gameContainer, isMobile, this.isAnimationsEnabled());
	} else {
		this.actuator = new SpiritActuator(gameContainer, isMobile, this.isAnimationsEnabled());
	}

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.isPaiShoGame = true;
}

SpiritController.prototype.getGameTypeId = function() {
	return GameType.SpiritPaiSho.id;
};

SpiritController.prototype.completeSetup = function() {
	/* Set default preferences */
	if (!getUserGamePreference(SpiritPreferences.tileDesignKey)
			|| !SpiritPreferences.tileDesignTypeValues[getUserGamePreference(SpiritPreferences.tileDesignKey)]) {
		setUserGamePreference(SpiritPreferences.tileDesignKey, "original");
	}

	//Place tiles on board for game setup
	this.addSetupForPlayerCode('H');
	this.addSetupForPlayerCode('G');

	// Finish with actuate
	rerunAll();
	this.callActuate();
};

SpiritController.prototype.addSetupForPlayerCode = function(playerCode) {
	var tiles = this.theGame.tileManager.loadTileSet(playerCode);
	
	var moveText = "0" + playerCode + ".";
	var move = new SpiritNotationMove(moveText);
	this.theGame.runNotationMove(move);
	// Move all set. Add it to the notation!
	this.gameNotation.addMove(move);
};

SpiritController.prototype.resetGameManager = function() {
	this.theGame = new SpiritGameManager(this.actuator);
};

SpiritController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new SpiritNotationBuilder();
};

SpiritController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

SpiritController.prototype.getNewGameNotation = function() {
	return new SpiritGameNotation();
};

SpiritController.getHostTilesContainerDivs = function() {
	return '<div class="HR"></div> <div class="HW"></div> <div class="HL"></div> <div class="HM"></div> <div class="HV"></div> <div class="HH"></div> <br class="clear" /> <div class="HT"></div> <div class="HK"></div>';
};

SpiritController.getGuestTilesContainerDivs = function() {
	return '<div class="GR"></div> <div class="GW"></div> <div class="GL"></div> <div class="GM"></div> <div class="GV"></div> <div class="GH"></div> <br class="clear" /> <div class="GT"></div> <div class="GK"></div>';
};

SpiritController.prototype.callActuate = function() {
	this.theGame.actuate();
};

SpiritController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	}

	rerunAll();
};

SpiritController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Spirit Pai Sho</h4>" + this.getCommonHelpMessageChunk();
};

SpiritController.prototype.endGameNow = function() {
	onlinePlayEngine.updateGameWinInfoAsTie(gameId, gameController.theGame.getWinResultTypeCode(), getLoginToken());
};

SpiritController.prototype.getAdditionalMessage = function() {
	const container = document.createElement('span');

	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			const strong = document.createElement('strong');
			strong.textContent = 'Real-time gameplay is enabled!';
			container.appendChild(strong);
			container.appendChild(document.createTextNode(' Click '));
			const emJoin = document.createElement('em');
			emJoin.textContent = 'Join Game';
			container.appendChild(emJoin);
			container.appendChild(document.createTextNode(' above to join another player\'s game. Or, you can start a game that other players can join by making a move.'));
			container.appendChild(document.createElement('br'));
		} else {
			container.appendChild(document.createTextNode('Sign in to enable real-time gameplay. Or, start playing a local game by making a move.'));
		}
	}

	return container;
};

SpiritController.prototype.unplayedTileClicked = function(tileDiv) {
	/* Tiles are all on the board for Spirit Pai Sho */
};

SpiritController.prototype.clearCaptureHelpAndActuateIfNeeded = function() {
	var clearedTiles = this.clearCaptureHelp();
	if (clearedTiles.unflaggedCaptureTiles.length > 0 || clearedTiles.unflaggedCapturedByTiles.length > 0) {
		this.callActuate();
	}
};

SpiritController.prototype.pointClicked = function(htmlPoint) {
	this.clearCaptureHelpAndActuateIfNeeded();

	if (this.theGame.board.winners.length > 0) {
		return;
	}
	// if (!myTurn()) {
	// 	return;
	// }
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (this.notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {
			this.flagCaptureHelp(boardPoint);
			this.flagCapturedByHelp(boardPoint);

			if (boardPoint.tile.ownerName !== getCurrentPlayer() || !myTurn()) {
				debug("That's not your tile!");
				this.callActuate();
				return;
			}

			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = MOVE;
			this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			this.theGame.revealPossibleMovePoints(boardPoint);
		} else {
			this.clearCaptureHelpAndActuateIfNeeded();
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.runNotationMove(move);

			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);
			if (onlinePlayEnabled && this.gameNotation.moves.length === 3) {
				createGameIfThatIsOk(GameType.SpiritPaiSho.id);
			} else {
				if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					finalizeMove();
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder();
		}
	}
};

SpiritController.prototype.getCommonHelpMessageChunk = function() {
	return this.getCaptureCycleImageTag() + "<p>Each tile captures the next two tiles in the Capture Cycle (going clockwise).</p>";
};

SpiritController.prototype.getCaptureCycleImageTag = function() {
	return "<img src='images/Spirit/Spirit_Circle.png' style='width:100%;' />";
};

SpiritController.prototype.getTheMessage = function(tile, ownerName) {
	var message = [];

	var tileCode = tile.code;

	var heading = ownerName + "'s " + SpiritTile.getTileName(tileCode);

	message.push(this.getCommonHelpMessageChunk());

	return {
		heading: heading,
		message: message
	}
};

SpiritController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new SpiritTile(divName.substring(1), divName.charAt(0));

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	return this.getTheMessage(tile, ownerName);
};

SpiritController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (boardPoint.hasTile()) {
		return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
	} else {
		return null;
	}
};

SpiritController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

SpiritController.prototype.startAiGame = function(finalizeMove) {
	// 
};

SpiritController.prototype.getAiList = function() {
	return [];
};

SpiritController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

SpiritController.prototype.cleanup = function() {
	if (this.actuator && this.actuator.dispose) {
		this.actuator.dispose();
	}
};

SpiritController.prototype.isSolitaire = function() {
	return false;
};

SpiritController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

SpiritController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Spirit Pai Sho Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(buildPreferenceDropdownDiv("Tile Designs", "spiritPaiShoDesignsDropdown", SpiritPreferences.tileDesignTypeValues, SpiritPreferences.tileDesignKey));

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(this.buildToggleAnimationsDiv());

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(this.buildToggle3DBoardDiv());

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(this.buildToggleRoundBoardDiv());

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

SpiritController.prototype.buildToggleAnimationsDiv = function() {
	var self = this;
	var div = document.createElement("div");
	var onOrOff = this.isAnimationsEnabled() ? "on" : "off";

	var textSpan = document.createElement("span");
	textSpan.textContent = "Move animations are " + onOrOff + ": ";
	div.appendChild(textSpan);

	var toggleSpan = document.createElement("span");
	toggleSpan.className = "skipBonus";
	toggleSpan.textContent = "toggle";
	toggleSpan.onclick = function() { self.toggleAnimations(); };
	div.appendChild(toggleSpan);

	return div;
};

SpiritController.prototype.toggleAnimations = function() {
	if (this.isAnimationsEnabled()) {
		setUserGamePreference(SpiritController.animationsEnabledKey, "false");
		this.actuator.setAnimationOn(false);
	} else {
		setUserGamePreference(SpiritController.animationsEnabledKey, "true");
		this.actuator.setAnimationOn(true);
	}
	clearMessage();
};

SpiritController.prototype.isAnimationsEnabled = function() {
	// Check !== "false" to default to on
	return getUserGamePreference(SpiritController.animationsEnabledKey) !== "false";
};

SpiritController.animationsEnabledKey = "SpiritAnimationsEnabled";

SpiritController.prototype.buildToggle3DBoardDiv = function() {
	return _buildToggle3DBoardDiv();
};

SpiritController.prototype.buildToggleRoundBoardDiv = function() {
	return _buildToggleRoundBoardDiv();
};

SpiritController.prototype.set3DBoardOn = function(isOn) {
	var is3D = this.actuator instanceof Spirit3DActuator;
	if (isOn === is3D) return;

	if (this.actuator.dispose) {
		this.actuator.dispose();
	}

	if (isOn) {
		this.actuator = new Spirit3DActuator(this.gameContainer, this.isMobile, this.isAnimationsEnabled());
	} else {
		this.actuator = new SpiritActuator(this.gameContainer, this.isMobile, this.isAnimationsEnabled());
	}
	this.theGame.actuator = this.actuator;
	this.callActuate();
};

/* Spirit Pai Sho specific methods */
SpiritController.prototype.flagCaptureHelp = function(boardPoint) {
	if (boardPoint.hasTile()) {
		var selectedTile = boardPoint.tile;
		return this.theGame.board.flagPointsTileCanCapture(selectedTile);
	}
	return [];
};

SpiritController.prototype.flagCapturedByHelp = function(boardPoint) {
	if (boardPoint.hasTile()) {
		var selectedTile = boardPoint.tile;
		return this.theGame.board.flagPointsTileCapturedBy(selectedTile);
	}
	return [];
};

SpiritController.prototype.clearCaptureHelp = function() {
	return this.theGame.board.clearCaptureHelp();
};

SpiritController.prototype.showCaptureHelpOnHover = function(htmlPoint) {
	if (this.notationBuilder.status === BRAND_NEW) {
		var clearedTiles = this.clearCaptureHelp();

		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		var flaggedTiles = [];
		var flaggedCapturedByTiles = [];
		if (boardPoint.hasTile()) {
			flaggedTiles = this.flagCaptureHelp(boardPoint);
			flaggedCapturedByTiles = this.flagCapturedByHelp(boardPoint);
		}

		if (!(clearedTiles.unflaggedCaptureTiles.length === 0 && clearedTiles.unflaggedCapturedByTiles.length === 0 && flaggedTiles.length === 0 && flaggedCapturedByTiles.length === 0)
			&& (!clearedTiles.unflaggedCaptureTiles.equals(flaggedTiles) || !clearedTiles.unflaggedCapturedByTiles.equals(flaggedCapturedByTiles))) {
			this.callActuate();
		}
	}
};





