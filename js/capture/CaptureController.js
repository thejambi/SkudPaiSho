/* Capture Pai Sho specific UI interaction logic */

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
import { CaptureActuator } from './CaptureActuator';
import { Capture3DActuator } from './Capture3DActuator';
import { is3DBoardOn, buildToggle3DBoardDiv as _buildToggle3DBoardDiv, buildToggleRoundBoardDiv as _buildToggleRoundBoardDiv } from '../PaiSho3DOptions';
import { CaptureGameManager } from './CaptureGameManager';
import {
  CaptureGameNotation,
  CaptureNotationBuilder,
  CaptureNotationMove,
} from './CaptureGameNotation';
import { CaptureTile } from './CaptureTile';
import { GUEST, HOST, MOVE, NotationPoint } from '../CommonNotationObjects';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { debug, shuffleArray } from '../GameData';

export var CapturePreferences = {
	tileDesignKey: "TileDesigns",
	tileDesignTypeValues: {
		original: "Original",
		chuji: "Chu Ji by Sirstotes",
		minimalist: "Minimalist by Sirstotes",
		canon: "Canon-style"
	}
};

export function CaptureController(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;

	if (is3DBoardOn()) {
		this.actuator = new Capture3DActuator(gameContainer, isMobile, this.isAnimationsEnabled());
	} else {
		this.actuator = new CaptureActuator(gameContainer, isMobile, this.isAnimationsEnabled());
	}

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	this.isPaiShoGame = true;
}

CaptureController.prototype.getGameTypeId = function() {
	return GameType.CapturePaiSho.id;
};

CaptureController.prototype.completeSetup = function() {
	/* Set default preferences */
	if (!getUserGamePreference(CapturePreferences.tileDesignKey)
			|| !CapturePreferences.tileDesignTypeValues[getUserGamePreference(CapturePreferences.tileDesignKey)]) {
		setUserGamePreference(CapturePreferences.tileDesignKey, "original");
	}

	// Randomly place tiles on board for game setup
	this.addSetupForPlayerCode('H');
	this.addSetupForPlayerCode('G');

	// Finish with actuate
	rerunAll();
	this.callActuate();
};

CaptureController.prototype.addSetupForPlayerCode = function(playerCode) {
	// Randomize list of tiles. They will be placed in that order. That will be the notation of initial placement. 
	var tiles = this.theGame.tileManager.loadTileSet(playerCode);
	shuffleArray(tiles);
	
	var moveText = "0" + playerCode + ".";
	tiles.forEach(
		function(tile) {
			moveText += tile.code;
		}
	);
	debug(moveText);
	var move = new CaptureNotationMove(moveText);
	this.theGame.runNotationMove(move);
	// Move all set. Add it to the notation!
	this.gameNotation.addMove(move);
};

CaptureController.prototype.resetGameManager = function() {
	this.theGame = new CaptureGameManager(this.actuator);
};

CaptureController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new CaptureNotationBuilder();
};

CaptureController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

CaptureController.prototype.getNewGameNotation = function() {
	return new CaptureGameNotation();
};

CaptureController.getHostTilesContainerDivs = function() {
	return '<div class="HA"></div> <div class="HV"></div> <div class="HB"></div> <div class="HP"></div> <div class="HF"></div> <div class="HU"></div> <br class="clear" /> <div class="HK"></div> <div class="HL"></div> <div class="HD"></div> <div class="HM"></div> <div class="HT"></div> <div class="HO"></div>';
};

CaptureController.getGuestTilesContainerDivs = function() {
	return '<div class="GA"></div> <div class="GV"></div> <div class="GB"></div> <div class="GP"></div> <div class="GF"></div> <div class="GU"></div> <br class="clear" /> <div class="GK"></div> <div class="GL"></div> <div class="GD"></div> <div class="GM"></div> <div class="GT"></div> <div class="GO"></div>';
};

CaptureController.prototype.callActuate = function() {
	this.theGame.actuate();
};

CaptureController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	}

	rerunAll();
};

CaptureController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Capture Pai Sho</h4>" + this.getCommonHelpMessageChunk();
};

CaptureController.prototype.endGameNow = function() {
	onlinePlayEngine.updateGameWinInfoAsTie(gameId, gameController.theGame.getWinResultTypeCode(), getLoginToken());
};

CaptureController.prototype.getAdditionalMessage = function() {
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

CaptureController.prototype.unplayedTileClicked = function(tileDiv) {
	/* Tiles are all on the board for Capture Pai Sho */
};

CaptureController.prototype.clearCaptureHelpAndActuateIfNeeded = function() {
	var clearedTiles = this.clearCaptureHelp();
	if (clearedTiles.unflaggedCaptureTiles.length > 0 || clearedTiles.unflaggedCapturedByTiles.length > 0) {
		this.callActuate();
	}
};

CaptureController.prototype.RmbDown = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
}

CaptureController.prototype.RmbUp = function(htmlPoint) {
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

CaptureController.prototype.pointClicked = function(htmlPoint) {
	this.clearCaptureHelpAndActuateIfNeeded();
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

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
				createGameIfThatIsOk(GameType.CapturePaiSho.id);
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

CaptureController.prototype.getCommonHelpMessageChunk = function() {
	return this.getCaptureCycleImageTag() + "<p>Each tile captures the next three tiles in the Capture Cycle (going clockwise). <a href='https://skudpaisho.com/site/games/capture-pai-sho/' target='_blank'>View the rules</a> to learn about how tiles move and jump on the board and more.</p><p><em>Capture Pai Sho is created and designed by <a href='https://redallure.deviantart.com/art/What-you-get-502701647' target='_blank'>Tom Ford</a>.</em></p>";
};

CaptureController.prototype.getCaptureCycleImageTag = function() {
	return "<img src='images/Capture/CaptureCycle.png' style='width:100%;' />";
};

CaptureController.prototype.getTheMessage = function(tile, ownerName) {
	var message = [];

	var tileCode = tile.code;

	var heading = ownerName + "'s " + CaptureTile.getTileName(tileCode);

	message.push(this.getCommonHelpMessageChunk());

	return {
		heading: heading,
		message: message
	}
};

CaptureController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new CaptureTile(divName.substring(1), divName.charAt(0));

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	return this.getTheMessage(tile, ownerName);
};

CaptureController.prototype.getPointMessage = function(htmlPoint) {
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

CaptureController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

CaptureController.prototype.startAiGame = function(finalizeMove) {
	// 
};

CaptureController.prototype.getAiList = function() {
	return [];
};

CaptureController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

CaptureController.prototype.cleanup = function() {
	if (this.actuator && this.actuator.dispose) {
		this.actuator.dispose();
	}
};

CaptureController.prototype.isSolitaire = function() {
	return false;
};

CaptureController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

CaptureController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Capture Pai Sho Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(buildPreferenceDropdownDiv("Tile Designs", "capturePaiShoDesignsDropdown", CapturePreferences.tileDesignTypeValues, CapturePreferences.tileDesignKey));

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(this.buildToggleAnimationsDiv());

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(this.buildToggle3DBoardDiv());

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(this.buildToggleRoundBoardDiv());

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

CaptureController.prototype.buildToggleAnimationsDiv = function() {
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

CaptureController.prototype.toggleAnimations = function() {
	if (this.isAnimationsEnabled()) {
		setUserGamePreference(CaptureController.animationsEnabledKey, "false");
		this.actuator.setAnimationOn(false);
	} else {
		setUserGamePreference(CaptureController.animationsEnabledKey, "true");
		this.actuator.setAnimationOn(true);
	}
	clearMessage();
};

CaptureController.prototype.isAnimationsEnabled = function() {
	// Check !== "false" to default to on
	return getUserGamePreference(CaptureController.animationsEnabledKey) !== "false";
};

CaptureController.animationsEnabledKey = "CaptureAnimationsEnabled";

CaptureController.prototype.buildToggle3DBoardDiv = function() {
	return _buildToggle3DBoardDiv();
};

CaptureController.prototype.buildToggleRoundBoardDiv = function() {
	return _buildToggleRoundBoardDiv();
};

CaptureController.prototype.set3DBoardOn = function(isOn) {
	var is3D = this.actuator instanceof Capture3DActuator;
	if (isOn === is3D) return;

	if (this.actuator.dispose) {
		this.actuator.dispose();
	}

	if (isOn) {
		this.actuator = new Capture3DActuator(this.gameContainer, this.isMobile, this.isAnimationsEnabled());
	} else {
		this.actuator = new CaptureActuator(this.gameContainer, this.isMobile, this.isAnimationsEnabled());
	}
	this.theGame.actuator = this.actuator;
	this.callActuate();
};

/* Capture Pai Sho specific methods */
CaptureController.prototype.flagCaptureHelp = function(boardPoint) {
	if (boardPoint.hasTile()) {
		var selectedTile = boardPoint.tile;
		return this.theGame.board.flagPointsTileCanCapture(selectedTile);
	}
	return [];
};

CaptureController.prototype.flagCapturedByHelp = function(boardPoint) {
	if (boardPoint.hasTile()) {
		var selectedTile = boardPoint.tile;
		return this.theGame.board.flagPointsTileCapturedBy(selectedTile);
	}
	return [];
};

CaptureController.prototype.clearCaptureHelp = function() {
	return this.theGame.board.clearCaptureHelp();
};

CaptureController.prototype.showCaptureHelpOnHover = function(htmlPoint) {
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





