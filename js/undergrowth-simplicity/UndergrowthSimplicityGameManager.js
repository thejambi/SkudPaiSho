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

	// Check ring victory (before end-of-turn processing)
	this.checkWinConditions(move);

	// End-of-turn: process decay and cut for the next player's perspective
	// so the board is ready when the next player sees it
	if (!this.hasEnded() && this.allGatesFilled()) {
		var nextPlayer = (move.player === HOST) ? GUEST : HOST;

		// Decay: next player's neutral-zone stones are removed
		var decayedTiles = this.board.performDecay(nextPlayer);
		move.decayedTiles = decayedTiles;

		this.board.analyzeConnections();

		// Cut: next player cuts current player's disconnected stones
		var cutTiles = this.board.performCut(nextPlayer);
		move.cutTiles = cutTiles;

		this.board.analyzeConnections();

		// Elimination: can the next player make any moves?
		if (!this.board.canPlayerMakeAnyMoves(nextPlayer)) {
			this.endGameWinners.push(move.player);
			this.winReason = "elimination";
		}
	}

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
