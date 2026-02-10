/* Undergrowth Simplicity - Controller */

import { GameType } from '../GameType';
import {
	BRAND_NEW,
	WAITING_FOR_ENDPOINT,
	callSubmitMove,
	createGameIfThatIsOk,
	currentMoveIndex,
	finalizeMove,
	getCurrentPlayer,
	getGameOptionsMessageElement,
	getNeutralPointMessage,
	getRedPointMessage,
	getRedWhitePointMessage,
	getResetMoveElement,
	getWhitePointMessage,
	isAnimationsOn,
	myTurn,
	onlinePlayEnabled,
	playingOnlineGame,
	refreshMessage,
	toHeading,
} from '../PaiShoMain';
import {
	GATE,
	NEUTRAL,
	POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { GUEST, HOST, NotationPoint } from '../CommonNotationObjects';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import { UndergrowthSimplicityActuator } from './UndergrowthSimplicityActuator';
import { UndergrowthSimplicityGameManager } from './UndergrowthSimplicityGameManager';
import {
	UndergrowthSimplicityGameNotation,
	UndergrowthSimplicityNotationBuilder,
	WAITING_FOR_SECOND_PLACEMENT,
} from './UndergrowthSimplicityGameNotation';
import { UndergrowthSimplicityTile } from './UndergrowthSimplicityTile';
import { debug } from '../GameData';

export function UndergrowthSimplicityController(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;

	this.actuator = new UndergrowthSimplicityActuator(gameContainer, isMobile, isAnimationsOn());

	this.resetGameNotation();
	this.resetGameManager();
	this.resetNotationBuilder();

	this.isPaiShoGame = true;
}

UndergrowthSimplicityController.prototype.getGameTypeId = function() {
	return GameType.UndergrowthSimplicity.id;
};

UndergrowthSimplicityController.prototype.resetGameManager = function() {
	this.theGame = new UndergrowthSimplicityGameManager(this.actuator);
};

UndergrowthSimplicityController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new UndergrowthSimplicityNotationBuilder();
};

UndergrowthSimplicityController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

UndergrowthSimplicityController.prototype.getNewGameNotation = function() {
	return new UndergrowthSimplicityGameNotation();
};

UndergrowthSimplicityController.prototype.callActuate = function() {
	this.theGame.actuate();
};

UndergrowthSimplicityController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		this.gameNotation.removeLastMove();
	}
	this.resetNotationBuilder();
};

UndergrowthSimplicityController.prototype.getDefaultHelpMessageText = function() {
	var container = document.createElement('div');

	var h4 = document.createElement('h4');
	h4.textContent = "Undergrowth Simplicity";
	container.appendChild(h4);

	var paragraphs = [
		"A strategic stone placement game on the Pai Sho board. Build a connected ring of stones around the center to win!",
		"Opening: Host places on 1 gate, Guest places on 2 gates, Host places on the last gate plus makes 1 normal move. Then normal turns alternate starting with Guest.",
		"Each normal turn: 1) Your stones in the Neutral Garden (outer areas) decay and are removed. 2) Opponent stones not connected to their gates are cut. 3) You place 2 stones.",
		"Stones must be placed where they have line of sight (straight, unobstructed line) to a friendly stone connected to one of your gates.",
		"Stones in the Central Gardens (inner colored areas) are permanent. Stones in the Neutral Garden are temporary and decay at the start of your next turn.",
		"Win by forming a ring of connected stones around the center (both gates must connect to the ring), or by eliminating your opponent's ability to make moves."
	];

	paragraphs.forEach(function(text) {
		var p = document.createElement('p');
		p.textContent = text;
		container.appendChild(p);
	});

	return container;
};

UndergrowthSimplicityController.prototype.getAdditionalMessage = function() {
	var msgElement = document.createElement("span");

	if (this.gameNotation.moves.length === 0) {
		msgElement.appendChild(getGameOptionsMessageElement(GameType.UndergrowthSimplicity.gameOptions));
	}

	var moveCount = this.gameNotation.moves.length;

	if (!this.theGame.getWinner()) {
		var instructionBr = document.createElement("br");
		msgElement.appendChild(instructionBr);

		var instructionText = document.createElement("span");
		if (moveCount === 0) {
			instructionText.textContent = "Host: Place your stone on a gate.";
		} else if (moveCount === 1) {
			instructionText.textContent = "Guest: Place your stones on 2 of the remaining gates.";
		} else if (moveCount === 2) {
			instructionText.textContent = "Host: Place on the last gate and make one normal placement.";
		} else {
			instructionText.textContent = "Place 2 stones on the board.";
		}
		msgElement.appendChild(instructionText);
	}

	if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		var resetBr = document.createElement("br");
		msgElement.appendChild(resetBr);
		var selectText = document.createElement("span");
		selectText.textContent = "Select a point to place your stone. ";
		msgElement.appendChild(selectText);
		msgElement.appendChild(getResetMoveElement());
	} else if (this.notationBuilder.status === WAITING_FOR_SECOND_PLACEMENT) {
		var secondBr = document.createElement("br");
		msgElement.appendChild(secondBr);
		var placeText = document.createElement("span");
		placeText.textContent = "Place second stone. ";
		msgElement.appendChild(placeText);
		msgElement.appendChild(getResetMoveElement());
	}

	return msgElement;
};

// How many placements does the current move need?
UndergrowthSimplicityController.prototype.getPlacementsNeededForCurrentMove = function() {
	var moveIndex = this.gameNotation.moves.length;
	if (moveIndex === 0) return 1;  // HOST: 1 gate
	if (moveIndex === 1) return 2;  // GUEST: 2 gates
	if (moveIndex === 2) return 2;  // HOST: 1 gate + 1 normal
	return 2;                        // Normal: 2 placements
};

UndergrowthSimplicityController.prototype.completeMove = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);

	var moveAnimationBeginStep = 0;
	if (this.notationBuilder.placements.length > 0) {
		moveAnimationBeginStep = 1;
	}

	if (playingOnlineGame()) {
		callSubmitMove(moveAnimationBeginStep);
	} else {
		finalizeMove(moveAnimationBeginStep);
	}
};

UndergrowthSimplicityController.prototype.unplayedTileClicked = function(tileDiv) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	if (!myTurn()) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	if (this.theGame.hasEnded()) {
		return;
	}

	var divName = tileDiv.getAttribute("name"); // "HBack" or "GBack"
	var playerCode = divName.charAt(0);
	var player = (playerCode === 'H') ? HOST : GUEST;

	if (player !== getCurrentPlayer()) {
		return;
	}

	var moveIndex = this.gameNotation.moves.length;

	if (this.notationBuilder.status === BRAND_NEW) {
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		// Show legal placement points based on game phase
		if (moveIndex === 0) {
			// HOST: place on any gate
			this.theGame.setOpenGatePossibleMoves();
		} else if (moveIndex === 1) {
			// GUEST: place on remaining open gates
			this.theGame.setOpenGatePossibleMoves();
		} else if (moveIndex === 2) {
			// HOST: place on last open gate
			this.theGame.setOpenGatePossibleMoves();
		} else {
			// Normal turn: show legal placements
			this.theGame.setAllLegalPointsOpen(getCurrentPlayer());
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		// Clicking tile again deselects
		this.theGame.hidePossibleMovePoints();
		this.notationBuilder = new UndergrowthSimplicityNotationBuilder();
	} else if (this.notationBuilder.status === WAITING_FOR_SECOND_PLACEMENT) {
		// Already placed first stone, auto-show legal points for second
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;
		this.theGame.hidePossibleMovePoints();

		var moveIndex = this.gameNotation.moves.length;
		if (moveIndex === 1 || (moveIndex === 2 && this.notationBuilder.placements.length === 1 && this.theGame.board.hasOpenGates())) {
			// Still placing on gates
			this.theGame.setOpenGatePossibleMoves();
		} else {
			this.theGame.setAllLegalPointsOpen(getCurrentPlayer());
		}
	}

	refreshMessage();
};

UndergrowthSimplicityController.prototype.pointClicked = function(htmlPoint) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	if (this.theGame.hasEnded()) {
		return;
	}

	var npText = htmlPoint.getAttribute("name");
	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	// Clicking own stone on the board activates placement (same as clicking tile pile)
	if (boardPoint.hasTile() && boardPoint.tile.ownerName === getCurrentPlayer() && myTurn()) {
		if (this.notationBuilder.status === BRAND_NEW || this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new UndergrowthSimplicityNotationBuilder();
			this.notationBuilder.status = WAITING_FOR_ENDPOINT;

			var moveIndex = this.gameNotation.moves.length;
			if (moveIndex <= 2) {
				this.theGame.setOpenGatePossibleMoves();
			} else {
				this.theGame.setAllLegalPointsOpen(getCurrentPlayer());
			}
			refreshMessage();
			return;
		}
	}

	if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.addPlacement(new NotationPoint(npText));

			var placementsNeeded = this.getPlacementsNeededForCurrentMove();

			if (this.notationBuilder.placements.length >= placementsNeeded) {
				// Move complete
				if (this.gameNotation.moves.length === 0 && onlinePlayEnabled) {
					// First move - create online game
					var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
					this.gameNotation.addMove(move);
					createGameIfThatIsOk(GameType.UndergrowthSimplicity.id);
				} else {
					this.completeMove();
				}
			} else {
				// Need more placements - preview the first one
				this.previewPlacement(notationPoint);

				// Auto-select for second placement
				this.showSecondPlacementOptions();

				// Edge case: if no legal points for second placement, auto-complete with just 1
				if (!this.theGame.board.hasPossibleMovePoints()) {
					this.completeMove();
				} else {
					this.notationBuilder.status = WAITING_FOR_SECOND_PLACEMENT;
					refreshMessage();
				}
			}
		} else {
			// Clicked invalid point - deselect
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new UndergrowthSimplicityNotationBuilder();
			refreshMessage();
		}
	} else if (this.notationBuilder.status === WAITING_FOR_SECOND_PLACEMENT) {
		// Auto-select stone, just need to click a valid point
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.addPlacement(new NotationPoint(npText));

			if (this.gameNotation.moves.length === 0 && onlinePlayEnabled) {
				var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
				this.gameNotation.addMove(move);
				createGameIfThatIsOk(GameType.UndergrowthSimplicity.id);
			} else {
				this.completeMove();
			}
		} else {
			// Clicked invalid point
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new UndergrowthSimplicityNotationBuilder();
			refreshMessage();
		}
	}
};

// Preview the first placement on the board before the second
UndergrowthSimplicityController.prototype.previewPlacement = function(notationPoint) {
	var playerCode = getCurrentPlayer() === HOST ? 'H' : 'G';
	var tile = new UndergrowthSimplicityTile(playerCode);
	var rowCol = notationPoint.rowAndColumn;
	var bp = this.theGame.board.cells[rowCol.row][rowCol.col];

	bp.putTile(tile);

	// Register gate ownership if placing on a gate
	if (bp.isType(GATE)) {
		var key = rowCol.row + "," + rowCol.col;
		this.theGame.board.gateOwners[key] = getCurrentPlayer();
	}

	this.theGame.board.analyzeConnections();
	this.theGame.actuate();
};

// Show legal points for the second placement
UndergrowthSimplicityController.prototype.showSecondPlacementOptions = function() {
	var moveIndex = this.gameNotation.moves.length;

	if (moveIndex === 1) {
		// GUEST placing 2nd gate
		this.theGame.setOpenGatePossibleMoves();
	} else if (moveIndex === 2) {
		// HOST: first was gate, now normal placement
		this.theGame.setAllLegalPointsOpen(getCurrentPlayer());
	} else {
		// Normal turn: second placement
		this.theGame.setAllLegalPointsOpen(getCurrentPlayer());
	}
};

UndergrowthSimplicityController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");
	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	return {
		heading: ownerName === HOST ? "White Stone" : "Black Stone",
		message: ownerName === HOST ? "Host's stone (light)" : "Guest's stone (dark)"
	};
};

UndergrowthSimplicityController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");
	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	var message = [];
	if (boardPoint.hasTile()) {
		message.push(toHeading(boardPoint.tile.getName()));
	} else {
		if (boardPoint.isType(GATE)) {
			var gateKey = rowCol.row + "," + rowCol.col;
			var owner = this.theGame.board.gateOwners[gateKey];
			if (owner) {
				message.push(owner + "'s Gate");
			} else {
				message.push("Open Gate");
			}
		} else if (boardPoint.isCentralGarden()) {
			message.push("Central Garden (permanent)");
		} else if (boardPoint.isNeutralGardenOnly()) {
			message.push("Neutral Garden (stones decay)");
		} else if (boardPoint.isType(NEUTRAL)) {
			message.push(getNeutralPointMessage());
		}
	}

	return {
		heading: null,
		message: message
	};
};

UndergrowthSimplicityController.prototype.RmbDown = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");
	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
};

UndergrowthSimplicityController.prototype.RmbUp = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");
	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (mouseEndPoint == this.mouseStartPoint) {
		this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint);
	} else if (this.mouseStartPoint) {
		this.theGame.markingManager.toggleMarkedArrow(this.mouseStartPoint, mouseEndPoint);
	}
	this.mouseStartPoint = null;
	this.callActuate();
};

UndergrowthSimplicityController.prototype.playAiTurn = function(finalizeMove) {
	// No AI yet
};

UndergrowthSimplicityController.prototype.startAiGame = function(finalizeMove) {
	// No AI yet
};

UndergrowthSimplicityController.prototype.getAiList = function() {
	return [];
};

UndergrowthSimplicityController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

UndergrowthSimplicityController.prototype.cleanup = function() {
	// Nothing to clean up for 2D
};

UndergrowthSimplicityController.prototype.isSolitaire = function() {
	return false;
};

UndergrowthSimplicityController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};
