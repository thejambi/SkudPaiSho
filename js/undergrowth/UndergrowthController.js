/* Undergrowth Pai Sho specific UI interaction logic */

import { GameType } from '../GameType';
import { READY_FOR_BONUS } from '../GameConstants';
import { getResetMoveElement } from '../GameFlow';
import {
  BRAND_NEW,
  WAITING_FOR_ENDPOINT,
  callSubmitMove,
  createGameIfThatIsOk,
  currentMoveIndex,
  finalizeMove,
  getCurrentPlayer,
  getGameOptionsMessageElement,
  isAnimationsOn,
  myTurn,
  onlinePlayEnabled,
  playingOnlineGame,
  refreshMessage,
} from '../PaiShoMain';
import {
  getNeutralPointMessage,
  getRedPointMessage,
  getRedWhitePointMessage,
  getWhitePointMessage,
  toHeading,
} from '../TextHelpers';
import {
  GATE,
  NEUTRAL,
  POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { GUEST, HOST, NotationPoint, PLANTING } from '../CommonNotationObjects';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import { UNDERGROWTH_SIMPLE, gameOptionEnabled } from '../GameOptions';
import { UndergrowthActuator } from './UndergrowthActuator';
import { Undergrowth3DActuator } from './Undergrowth3DActuator';
import { is3DBoardOn, buildToggle3DBoardDiv as _buildToggle3DBoardDiv, buildToggleRoundBoardDiv as _buildToggleRoundBoardDiv } from '../PaiSho3DOptions';
import { UndergrowthGameManager } from './UndergrowthGameManager';
import {
  UndergrowthGameNotation,
  UndergrowthNotationBuilder,
  UndergrowthNotationVars,
} from './UndergrowthGameNotation';
import { UndergrowthTile } from './UndergrowthTile';
import { debug } from '../GameData';
import { getOpponentName } from '../pai-sho-common/PaiShoPlayerHelp';

export function UndergrowthController(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;

	if (is3DBoardOn()) {
		this.actuator = new Undergrowth3DActuator(gameContainer, isMobile, isAnimationsOn());
	} else {
		this.actuator = new UndergrowthActuator(gameContainer, isMobile, isAnimationsOn());
	}

	this.resetGameNotation();	// First

	this.resetGameManager();
	this.resetNotationBuilder();

	this.isPaiShoGame = true;
}

UndergrowthController.prototype.getGameTypeId = function() {
	return GameType.Undergrowth.id;
};

UndergrowthController.prototype.resetGameManager = function() {
	this.theGame = new UndergrowthGameManager(this.actuator);
};

UndergrowthController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new UndergrowthNotationBuilder();
};

UndergrowthController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

UndergrowthController.prototype.getNewGameNotation = function() {
	return new UndergrowthGameNotation();
};

UndergrowthController.getHostTilesContainerDivs = function() {
	var divs = '<div class="HR3"></div> <div class="HR4"></div> <div class="HR5"></div> <div class="HW3"></div> <div class="HW4"></div> <div class="HW5"></div> <br class="clear" /> <div class="HL"></div> <div class="HO"></div>';
	return divs;
}

UndergrowthController.getGuestTilesContainerDivs = function() {
	var divs = '<div class="GR3"></div> <div class="GR4"></div> <div class="GR5"></div> <div class="GW3"></div> <div class="GW4"></div> <div class="GW5"></div> <br class="clear" /> <div class="GL"></div> <div class="GO"></div>';
	return divs;
};

UndergrowthController.prototype.callActuate = function() {
	this.theGame.actuate();
};

UndergrowthController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	} else if (this.notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}
};

UndergrowthController.prototype.getDefaultHelpMessageText = function() {
	const container = document.createElement('div');

	const h4 = document.createElement('h4');
	h4.textContent = "Undergrowth Pai Sho";
	container.appendChild(h4);

	const p1 = document.createElement('p');
	p1.textContent = "A placement game based on the Skud Pai Sho harmony system. Read the ";
	const rulesLink = document.createElement('a');
	rulesLink.href = 'https://skudpaisho.com/site/games/undergrowth-pai-sho/';
	rulesLink.target = '_blank';
	rulesLink.textContent = "rules page";
	p1.appendChild(rulesLink);
	p1.appendChild(document.createTextNode(" to get started. Summary of the rules are below."));
	container.appendChild(p1);

	const paragraphs = [
		"Two tiles are placed each turn, except the Host's first turn, where only one tile is placed.",
		"First, Gates are filled. Then tiles are placed elsewhere on the board.",
		"When placing a tile onto the board, tiles are placed on any point where a) the tile forms Harmony with the player's own tile(s) and b) the placed tile does not interrupt an existing Harmony or Disharmony on the board.",
		"After a tile is placed, remove any tile with two or more Disharmonies from the board.",
		"A player may also pass if they have no available moves.",
		"After the last piece is played or both players pass in succession, the game ends. The player with the most tiles in or touching the Central Gardens on the board wins.",
		"Same/alike tiles form Disharmony with each other.",
		"Tiles in Gates do not form Disharmony.",
		"The Orchid harmonizes with all friendly Flower Tiles, but also forms Disharmony with everything at the same time."
	];

	paragraphs.forEach(text => {
		const p = document.createElement('p');
		p.textContent = text;
		container.appendChild(p);
	});

	return container;
};

UndergrowthController.prototype.getAdditionalMessage = function() {
    var msgElement = document.createElement("span");
    
    if (this.gameNotation.moves.length === 0) {
        msgElement.appendChild(getGameOptionsMessageElement(GameType.Undergrowth.gameOptions));
    }

    if (gameOptionEnabled(UNDERGROWTH_SIMPLE)) {
        var simpleBr = document.createElement("br");
        msgElement.appendChild(simpleBr);
        var simpleText = document.createElement("span");
        simpleText.textContent = "Simplicity Rules: Your pieces form harmony with each other and disharmony with opponent's pieces.";
        msgElement.appendChild(simpleText);
        var simpleBr2 = document.createElement("br");
        msgElement.appendChild(simpleBr2);
    }

    if (!this.theGame.getWinner()) {
        var scoreBr = document.createElement("br");
        msgElement.appendChild(scoreBr);
        var scoreSpan = document.createElement("strong");
        scoreSpan.appendChild(this.theGame.getScoreSummary());
        msgElement.appendChild(scoreSpan);
    }

    if (this.notationBuilder.status === UndergrowthNotationBuilder.WAITING_FOR_SECOND_MOVE
            || this.notationBuilder.status === UndergrowthNotationBuilder.WAITING_FOR_SECOND_ENDPOINT) {
        var secondBr = document.createElement("br");
        msgElement.appendChild(secondBr);
        
        if (this.theGame.tileManager.playerIsOutOfTiles(getCurrentPlayer())) {
            var skipContainer = document.createElement("span");
            skipContainer.appendChild(document.createTextNode("Place second tile or "));
            var skipSpan = document.createElement("span");
            skipSpan.className = 'clickableText';
            skipSpan.textContent = "skip";
            skipSpan.onclick = () => this.skipSecondTile();
            skipContainer.appendChild(skipSpan);
            msgElement.appendChild(skipContainer);
        } else {
            var placeText = document.createElement("span");
            placeText.textContent = "Place second tile";
            msgElement.appendChild(placeText);
        }
        
        msgElement.appendChild(getResetMoveElement());
    } else {
        if (this.theGame.passInSuccessionCount === 1) {
            var passBr = document.createElement("br");
            msgElement.appendChild(passBr);
            var passText = document.createElement("span");
            passText.textContent = getOpponentName(this.getCurrentPlayer()) + " has passed. Passing now will end the game.";
            msgElement.appendChild(passText);
        }
        if (this.gameNotation.moves.length > 2 && myTurn() && !this.theGame.getWinner()) {
            var turnBr = document.createElement("br");
            msgElement.appendChild(turnBr);
            var passContainer = document.createElement("span");
            var passSpan = document.createElement("span");
            passSpan.className = 'skipBonus';
            passSpan.textContent = 'Pass turn';
            passSpan.onclick = () => this.passTurn();
            passContainer.appendChild(passSpan);
            passContainer.appendChild(document.createElement("br"));
            msgElement.appendChild(passContainer);
        }
    }

    return msgElement;
};

UndergrowthController.prototype.passTurn = function() {
	if (this.gameNotation.moves.length > 2) {
		this.notationBuilder.passTurn = true;
		this.notationBuilder.moveType = UndergrowthNotationVars.PASS_TURN;
		this.completeMove();
	}
};

UndergrowthController.prototype.skipSecondTile = function() {
	this.completeMove();
};

UndergrowthController.prototype.completeMove = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);

	var moveAnimationBeginStep = 0;
	if (this.notationBuilder.endPoint) {
		moveAnimationBeginStep = 1;
	}

	if (playingOnlineGame()) {
		callSubmitMove(moveAnimationBeginStep);
	} else {
		finalizeMove(moveAnimationBeginStep);
	}
};

UndergrowthController.prototype.unplayedTileClicked = function(tileDiv) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	if (!myTurn()) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

	if (tile.ownerName !== getCurrentPlayer()) {
		// debug("That's not your tile!");
		return;
	}

	if (this.notationBuilder.status === BRAND_NEW) {
		tile.selectedFromPile = true;

		this.notationBuilder.moveType = PLANTING;
		this.notationBuilder.plantedFlowerType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.setAllLegalPointsOpen(getCurrentPlayer(), tile);
	} else if (this.notationBuilder.status === UndergrowthNotationBuilder.WAITING_FOR_SECOND_MOVE) {
		tile.selectedFromPile = true;
		this.notationBuilder.plantedFlowerType2 = tileCode;
		this.notationBuilder.status = UndergrowthNotationBuilder.WAITING_FOR_SECOND_ENDPOINT;

		this.theGame.setAllLegalPointsOpen(getCurrentPlayer(), tile);
	} else {
		this.theGame.hidePossibleMovePoints();
		if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
			this.notationBuilder = new UndergrowthNotationBuilder();
		} else if (this.notationBuilder.status === UndergrowthNotationBuilder.WAITING_FOR_SECOND_ENDPOINT) {
			this.notationBuilder.status = UndergrowthNotationBuilder.WAITING_FOR_SECOND_MOVE;
		}
	}
};

UndergrowthController.prototype.RmbDown = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
}

UndergrowthController.prototype.RmbUp = function(htmlPoint) {
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

UndergrowthController.prototype.pointClicked = function(htmlPoint) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.runNotationMove(move, true);

			if (this.gameNotation.moves.length === 0) {
				this.gameNotation.addMove(move);
				if (onlinePlayEnabled) {
					createGameIfThatIsOk(GameType.Undergrowth.id);
				} else {
					finalizeMove();
				}
			} else {
				this.notationBuilder.status = UndergrowthNotationBuilder.WAITING_FOR_SECOND_MOVE;
				if (this.theGame.tileManager.playerIsOutOfTiles(getCurrentPlayer())) {
					this.completeMove();
				} else {
					refreshMessage();
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new UndergrowthNotationBuilder();
		}
	} else if (this.notationBuilder.status === UndergrowthNotationBuilder.WAITING_FOR_SECOND_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.endPoint2 = new NotationPoint(htmlPoint.getAttribute("name"));
			
			this.completeMove();
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.status = UndergrowthNotationBuilder.WAITING_FOR_SECOND_MOVE;
		}
	}
};

UndergrowthController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new UndergrowthTile(divName.substring(1), divName.charAt(0));

	var message = [];

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}
	
	var tileCode = divName.substring(1);

	var heading = UndergrowthTile.getTileName(tileCode);

	return {
		heading: heading,
		message: message
	}
}

UndergrowthController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	var message = [];
	if (boardPoint.hasTile()) {
		message.push(toHeading(boardPoint.tile.getName()));
	} else {
		if (boardPoint.isType(NEUTRAL)) {
			message.push(getNeutralPointMessage());
		} else if (boardPoint.isType(RED) && boardPoint.isType(WHITE)) {
			message.push(getRedWhitePointMessage());
		} else if (boardPoint.isType(RED)) {
			message.push(getRedPointMessage());
		} else if (boardPoint.isType(WHITE)) {
			message.push(getWhitePointMessage());
		} else if (boardPoint.isType(GATE)) {
			message.push(getNeutralPointMessage());
		}
	}

	return {
		heading: null,
		message: message
	}
}

UndergrowthController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

UndergrowthController.prototype.startAiGame = function(finalizeMove) {
	// 
};

UndergrowthController.prototype.getAiList = function() {
	return [];
}

UndergrowthController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

UndergrowthController.prototype.cleanup = function() {
	if (this.actuator && this.actuator.dispose) {
		this.actuator.dispose();
	}
};

UndergrowthController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	settingsDiv.appendChild(this.buildToggle3DBoardDiv());

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(this.buildToggleRoundBoardDiv());

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

UndergrowthController.prototype.buildToggle3DBoardDiv = function() {
	return _buildToggle3DBoardDiv();
};

UndergrowthController.prototype.buildToggleRoundBoardDiv = function() {
	return _buildToggleRoundBoardDiv();
};

UndergrowthController.prototype.set3DBoardOn = function(isOn) {
	var is3D = this.actuator instanceof Undergrowth3DActuator;
	if (isOn === is3D) return;

	if (this.actuator.dispose) {
		this.actuator.dispose();
	}

	if (isOn) {
		this.actuator = new Undergrowth3DActuator(this.gameContainer, this.isMobile, isAnimationsOn());
	} else {
		this.actuator = new UndergrowthActuator(this.gameContainer, this.isMobile, isAnimationsOn());
	}
	this.theGame.actuator = this.actuator;
	this.callActuate();
};

UndergrowthController.prototype.isSolitaire = function() {
	return false;
};

UndergrowthController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};


