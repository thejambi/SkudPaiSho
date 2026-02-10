// Undergrowth Simplicity Game Manager

import { GUEST, HOST } from '../CommonNotationObjects';
import { GATE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { PaiShoMarkingManager } from '../pai-sho-common/PaiShoMarkingManager';
import { UndergrowthSimplicityBoard } from './UndergrowthSimplicityBoard';
import { UndergrowthSimplicityTile } from './UndergrowthSimplicityTile';
import { debug } from '../GameData';

export function UndergrowthSimplicityGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;
	this.actuator = actuator;
	this.markingManager = new PaiShoMarkingManager();
	this.setup(ignoreActuate);
	this.endGameWinners = [];
	this.winReason = "";
}

UndergrowthSimplicityGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new UndergrowthSimplicityBoard();

	if (!ignoreActuate) {
		this.actuate();
	}
};

UndergrowthSimplicityGameManager.prototype.actuate = function(move, moveAnimationBeginStep) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this, this.markingManager, move, moveAnimationBeginStep);
};

UndergrowthSimplicityGameManager.prototype.runNotationMove = function(move, withActuate, moveAnimationBeginStep) {
	debug("Running Move: " + move.fullMoveText);

	// For normal turns (move 3+), perform Decay then Cut before placement
	if (move.moveNum >= 2 && this.allGatesFilled()) {
		// Decay: Remove own stones in Neutral Garden
		var decayedTiles = this.board.performDecay(move.player);
		move.decayedTiles = decayedTiles;

		// Re-analyze connections after decay
		this.board.analyzeConnections();

		// Cut: Remove opponent stones not connected to their gates
		var cutTiles = this.board.performCut(move.player);
		move.cutTiles = cutTiles;

		// Re-analyze connections after cut
		this.board.analyzeConnections();
	}

	// Execute placements
	for (var i = 0; i < move.placements.length; i++) {
		var notationPoint = move.placements[i];
		var tile = new UndergrowthSimplicityTile(move.playerCode);
		var rowCol = notationPoint.rowAndColumn;
		var bp = this.board.cells[rowCol.row][rowCol.col];

		bp.putTile(tile);

		// If placing on a gate, register gate ownership
		if (bp.isType(GATE)) {
			var key = rowCol.row + "," + rowCol.col;
			this.board.gateOwners[key] = move.player;
		}
	}

	// Analyze connections after placement
	this.board.analyzeConnections();

	// Check win conditions
	this.checkWinConditions(move);

	if (withActuate) {
		this.actuate(move, moveAnimationBeginStep);
	}
};

UndergrowthSimplicityGameManager.prototype.allGatesFilled = function() {
	return !this.board.hasOpenGates();
};

UndergrowthSimplicityGameManager.prototype.checkWinConditions = function(move) {
	this.endGameWinners = [];

	// Ring victory check for current player
	if (this.board.checkForRingVictory(move.player)) {
		this.endGameWinners.push(move.player);
		this.winReason = "ring";
		return;
	}

	// Also check opponent (in case placement creates a ring for them somehow)
	var opponent = (move.player === HOST) ? GUEST : HOST;
	if (this.board.checkForRingVictory(opponent)) {
		this.endGameWinners.push(opponent);
		this.winReason = "ring";
		return;
	}

	// Elimination check: after all gates filled, can opponent make moves?
	if (this.allGatesFilled()) {
		// Simulate opponent's turn: they would decay their own neutral stones, then we cut them
		var boardCopy = this.board.getCopy();
		boardCopy.performDecay(opponent);
		boardCopy.analyzeConnections();
		boardCopy.performCut(opponent);
		boardCopy.analyzeConnections();

		if (!boardCopy.canPlayerMakeAnyMoves(opponent)) {
			this.endGameWinners.push(move.player);
			this.winReason = "elimination";
		}
	}
};

UndergrowthSimplicityGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	if (!ignoreActuate) {
		this.actuate();
	}
};

UndergrowthSimplicityGameManager.prototype.setAllLegalPointsOpen = function(player, ignoreActuate) {
	this.board.setLegalPlacementPoints(player);
	if (!ignoreActuate) {
		this.actuate();
	}
};

UndergrowthSimplicityGameManager.prototype.setOpenGatePossibleMoves = function(ignoreActuate) {
	this.board.setOpenGatePossibleMoves();
	if (!ignoreActuate) {
		this.actuate();
	}
};

UndergrowthSimplicityGameManager.prototype.hasEnded = function() {
	return this.getWinner() !== null && this.getWinner() !== undefined;
};

UndergrowthSimplicityGameManager.prototype.getWinner = function() {
	if (this.endGameWinners.length === 1) {
		return this.endGameWinners[0];
	}
};

UndergrowthSimplicityGameManager.prototype.getWinReason = function() {
	var container = document.createElement('span');
	if (this.winReason === "ring") {
		container.textContent = " won by forming a ring around the center!";
	} else if (this.winReason === "elimination") {
		container.textContent = " won by elimination - opponent has no legal moves!";
	} else {
		container.textContent = " won the game!";
	}
	return container;
};

UndergrowthSimplicityGameManager.prototype.getWinResultTypeCode = function() {
	if (this.endGameWinners.length === 1) {
		return 1;
	}
};

UndergrowthSimplicityGameManager.prototype.getCopy = function() {
	var copyGame = new UndergrowthSimplicityGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.endGameWinners = this.endGameWinners.slice();
	copyGame.winReason = this.winReason;
	return copyGame;
};
