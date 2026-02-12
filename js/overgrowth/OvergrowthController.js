/* Overgrowth Pai Sho specific UI interaction logic */
import { GUEST, HOST, NotationPoint, PLANTING } from '../CommonNotationObjects';
import { debug } from '../GameData';
import { GameType } from '../GameType';
import {
	BRAND_NEW,
	callSubmitMove,
	createGameIfThatIsOk,
	currentMoveIndex,
	finalizeMove,
	getGameOptionsMessageElement,
	getCurrentPlayer,
	myTurn,
	onlinePlayEnabled,
	playingOnlineGame,
	WAITING_FOR_ENDPOINT,
} from '../PaiShoMain';
import {
	getNeutralPointMessage,
	getRedPointMessage,
	getRedWhitePointMessage,
	getWhitePointMessage,
	toHeading,
} from '../TextHelpers';
import { GATE, NEUTRAL, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import { OvergrowthActuator } from './OvergrowthActuator';
import { Overgrowth3DActuator } from './Overgrowth3DActuator';
import { is3DBoardOn, buildToggle3DBoardDiv as _buildToggle3DBoardDiv, buildToggleRoundBoardDiv as _buildToggleRoundBoardDiv } from '../PaiSho3DOptions';
import { OvergrowthGameManager } from './OvergrowthGameManager';
import { OvergrowthGameNotation, OvergrowthNotationBuilder } from './OvergrowthGameNotation';
import { OvergrowthTile } from './OvergrowthTile';

export function OvergrowthController(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;

	if (is3DBoardOn()) {
		this.actuator = new Overgrowth3DActuator(gameContainer, isMobile, false);
	} else {
		this.actuator = new OvergrowthActuator(gameContainer, isMobile);
	}

	this.showGameMessageUnderneath = true;

	this.resetGameNotation();	// First

	this.resetGameManager();
	this.resetNotationBuilder();

	this.isPaiShoGame = true;
}

OvergrowthController.prototype.getGameTypeId = function() {
	return GameType.OvergrowthPaiSho.id;
};

OvergrowthController.prototype.completeSetup = function() {
	this.callActuate();
};

OvergrowthController.prototype.resetGameManager = function() {
	if (this.theGame) {
		this.theGame = new OvergrowthGameManager(this.actuator, false, false, this.theGame.drawnTile, this.theGame.lastDrawnTile);
	} else {
		this.theGame = new OvergrowthGameManager(this.actuator);
	}
};

OvergrowthController.prototype.getMoveNumber = function() {
	return this.gameNotation.moves.length;
};

OvergrowthController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new OvergrowthNotationBuilder();
};

OvergrowthController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

OvergrowthController.prototype.getNewGameNotation = function() {
	return new OvergrowthGameNotation();
};

OvergrowthController.getHostTilesContainerDivs = function() {
	return '<div class="HR3 HR4 HR5 HW3 HW4 HW5 HR HW HK HB HL HO">';
}

OvergrowthController.getGuestTilesContainerDivs = function() {
	return '<div class="GR3 GR4 GR5 GW3 GW4 GW5 GR GW GK GB GL GO">';
};

OvergrowthController.prototype.callActuate = function() {
	this.theGame.actuate();
};

OvergrowthController.prototype.resetMove = function() {
	// Remove last move
	this.gameNotation.removeLastMove();

	if (this.theGame.drawnTile) {
		this.theGame.drawnTile.selectedFromPile = false;
		this.theGame.tileManager.putTileBack(this.theGame.drawnTile);
	}

	this.theGame.drawnTile = this.theGame.lastDrawnTile;
	this.theGame.drawnTile.selectedFromPile = false;
};

OvergrowthController.prototype.getDefaultHelpMessageText = function() {
	const container = document.createElement('div');

	const h4 = document.createElement('h4');
	h4.textContent = "Nature's Grove: Overgrowth";
	container.appendChild(h4);

	const p1 = document.createElement('p');
	p1.textContent = "A competitive variant of Nature's Grove: Respite.";
	container.appendChild(p1);

	const p2 = document.createElement('p');
	p2.textContent = "Players alternate drawing and placing a tile, following the same placement rules as Respite, with these clarifications:";
	container.appendChild(p2);

	const ul1 = document.createElement('ul');
	const li1 = document.createElement('li');
	li1.textContent = "Tiles form harmony or disharmony regardless of whose tile it is";
	ul1.appendChild(li1);
	const li2 = document.createElement('li');
	li2.textContent = "Like tiles form disharmony (for example, Rose (R3) forms disharmony with Rose (R3))";
	ul1.appendChild(li2);
	container.appendChild(ul1);

	const p3 = document.createElement('p');
	p3.textContent = "The game ends when all tiles have been played. The winner is as follows:";
	container.appendChild(p3);

	const ul2 = document.createElement('ul');
	const li3 = document.createElement('li');
	li3.textContent = "The Host wins if there are more Harmonies on the board";
	ul2.appendChild(li3);
	const li4 = document.createElement('li');
	li4.textContent = "The Guest wins if there are more Disharmonies on the board";
	ul2.appendChild(li4);
	container.appendChild(ul2);

	return container;
};

OvergrowthController.prototype.getAdditionalMessage = function() {
	const container = document.createElement('span');
	if (this.gameNotation.moves.length === 0) {
		container.appendChild(getGameOptionsMessageElement(GameType.OvergrowthPaiSho.gameOptions));
	}
	if (!this.theGame.getWinner()) {
		container.appendChild(document.createElement('br'));
		const strong = document.createElement('strong');
		strong.appendChild(this.theGame.getScoreSummary());
		container.appendChild(strong);
	}
	return container;
};

OvergrowthController.prototype.unplayedTileClicked = function(tileDiv) {
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

	if (this.notationBuilder.status === BRAND_NEW) {
		tile.selectedFromPile = true;
		this.theGame.drawnTile.selectedFromPile = true;

		this.notationBuilder.moveType = PLANTING;
		this.notationBuilder.plantedFlowerType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.setAllLegalPointsOpen(getCurrentPlayer(), tile);
	} else {
		this.theGame.hidePossibleMovePoints();
		this.notationBuilder = new OvergrowthNotationBuilder();
	}
};

OvergrowthController.prototype.RmbDown = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
}

OvergrowthController.prototype.RmbUp = function(htmlPoint) {
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

OvergrowthController.prototype.pointClicked = function(htmlPoint) {
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
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.runNotationMove(move);

			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);
			this.theGame.drawRandomTile();
			if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
				createGameIfThatIsOk(GameType.OvergrowthPaiSho.id);
			} else {
				if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					finalizeMove();
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new OvergrowthNotationBuilder();
		}
	}
};

OvergrowthController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new OvergrowthTile(divName.substring(1), divName.charAt(0));

	var message = [];

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}
	
	var tileCode = divName.substring(1);

	var heading = OvergrowthTile.getTileName(tileCode);

	return {
		heading: heading,
		message: message
	}
}

OvergrowthController.prototype.getPointMessage = function(htmlPoint) {
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

OvergrowthController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

OvergrowthController.prototype.startAiGame = function(finalizeMove) {
	// 
};

OvergrowthController.prototype.getAiList = function() {
	return [];
}

OvergrowthController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

OvergrowthController.prototype.cleanup = function() {
	if (this.actuator && this.actuator.dispose) {
		this.actuator.dispose();
	}
};

OvergrowthController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	settingsDiv.appendChild(this.buildToggle3DBoardDiv());

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(this.buildToggleRoundBoardDiv());

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

OvergrowthController.prototype.buildToggle3DBoardDiv = function() {
	return _buildToggle3DBoardDiv();
};

OvergrowthController.prototype.buildToggleRoundBoardDiv = function() {
	return _buildToggleRoundBoardDiv();
};

OvergrowthController.prototype.set3DBoardOn = function(isOn) {
	var is3D = this.actuator instanceof Overgrowth3DActuator;
	if (isOn === is3D) return;

	if (this.actuator.dispose) {
		this.actuator.dispose();
	}

	if (isOn) {
		this.actuator = new Overgrowth3DActuator(this.gameContainer, this.isMobile, false);
	} else {
		this.actuator = new OvergrowthActuator(this.gameContainer, this.isMobile);
	}
	this.theGame.actuator = this.actuator;
	this.callActuate();
};

OvergrowthController.prototype.isSolitaire = function() {
	return false;
};

OvergrowthController.prototype.setGameNotation = function(newGameNotation) {
	if (this.theGame.drawnTile) {
		this.theGame.drawnTile.selectedFromPile = false;
		this.theGame.tileManager.putTileBack(this.theGame.drawnTile);
	}
	this.resetGameManager();
	this.gameNotation.setNotationText(newGameNotation);
	this.theGame.drawRandomTile(true);
	this.theGame.actuate();
};

OvergrowthController.prototype.replayEnded = function() {
	this.theGame.actuate();
};

