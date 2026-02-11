/* Undergrowth Briar Strategic AI */

import { GUEST, HOST } from '../../CommonNotationObjects';
import { NON_PLAYABLE } from '../../skud-pai-sho/SkudPaiShoBoardPoint';
import { CENTER_POINT } from '../UndergrowthSimplicityBoardPoint';
import { UndergrowthBriarAiHelp } from './UndergrowthBriarAiHelp';

export function UndergrowthBriarStrategicAI() {
	this.aiHelp = new UndergrowthBriarAiHelp();
	this.player = null;
}

UndergrowthBriarStrategicAI.prototype.getName = function() {
	return "Briar Strategic AI";
};

UndergrowthBriarStrategicAI.prototype.getMessage = function() {
	return "A strategic AI that evaluates positions based on connectivity, ring progress, and territory control.";
};

UndergrowthBriarStrategicAI.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

UndergrowthBriarStrategicAI.prototype.getMove = function(game, moveIndex) {
	var moves = this.aiHelp.getAllPossibleMoves(game, this.player, moveIndex);

	if (!moves || moves.length === 0) {
		return null;
	}

	var opponent = this.player === HOST ? GUEST : HOST;
	var bestMove = null;
	var bestScore = -Infinity;

	for (var i = 0; i < moves.length; i++) {
		var move = moves[i];

		// Simulate move
		var gameCopy = game.getCopy();
		gameCopy.runNotationMove(move);

		// Check for immediate win
		if (gameCopy.hasEnded() && gameCopy.getWinner() === this.player) {
			return move;
		}

		var score = this.evaluatePosition(gameCopy, this.player, opponent);

		// Small randomness for variety
		score += Math.random() * 3;

		if (score > bestScore) {
			bestScore = score;
			bestMove = move;
		}
	}

	return bestMove || moves[0];
};

UndergrowthBriarStrategicAI.prototype.evaluatePosition = function(game, player, opponent) {
	var score = 0;
	var board = game.board;

	// Win/loss
	if (game.hasEnded()) {
		if (game.getWinner() === player) return 100000;
		if (game.getWinner() === opponent) return -100000;
	}

	// Stone counts
	var myStones = this.getPlayerStones(board, player);
	var oppStones = this.getPlayerStones(board, opponent);
	score += myStones.length * 10;
	score -= oppStones.length * 10;

	// Connection counts
	var myConnections = 0;
	var oppConnections = 0;
	for (var i = 0; i < board.connections.length; i++) {
		if (board.connections[i].ownerName === player) myConnections++;
		else if (board.connections[i].ownerName === opponent) oppConnections++;
	}
	score += myConnections * 15;
	score -= oppConnections * 15;

	// Gate connectivity (stones connected to gates are safer and more useful)
	var myConnectedSet = board.getConnectedToGates(player);
	var oppConnectedSet = board.getConnectedToGates(opponent);
	score += myConnectedSet.size * 25;
	score -= oppConnectedSet.size * 20;

	// Positional bonuses per stone
	for (var i = 0; i < myStones.length; i++) {
		var bp = myStones[i];
		// Central garden bonus (no decay)
		if (bp.isCentralGarden()) {
			score += 8;
		}
		// Neutral garden penalty (will decay)
		if (bp.isNeutralGardenOnly()) {
			score -= 5;
		}
		// Cut danger penalty (disconnected from gates)
		var key = bp.row + "," + bp.col;
		if (!myConnectedSet.has(key)) {
			score -= 12;
		}
		// Near-center bonus (closer to forming ring)
		var distToCenter = Math.abs(bp.row - 8) + Math.abs(bp.col - 8);
		score += Math.max(0, (12 - distToCenter)) * 1.5;
	}

	// Opponent positional penalties (mirror)
	for (var i = 0; i < oppStones.length; i++) {
		var bp = oppStones[i];
		if (bp.isCentralGarden()) {
			score -= 6;
		}
		var key = bp.row + "," + bp.col;
		if (!oppConnectedSet.has(key)) {
			score += 8; // Opponent disconnected is good for us
		}
		var distToCenter = Math.abs(bp.row - 8) + Math.abs(bp.col - 8);
		score -= Math.max(0, (12 - distToCenter)) * 1.0;
	}

	// Ring progress: reward having stones in multiple quadrants around center
	score += this.evaluateRingProgress(board, player) * 20;
	score -= this.evaluateRingProgress(board, opponent) * 15;

	// Opponent mobility: fewer legal moves for opponent is good
	var oppHasMoves = board.hasAnyLegalPlacements(opponent);
	if (!oppHasMoves) {
		score += 500; // Near elimination
	}

	return score;
};

UndergrowthBriarStrategicAI.prototype.getPlayerStones = function(board, player) {
	var stones = [];
	board.forEachBoardPointWithTile(function(bp) {
		if (bp.tile.ownerName === player) {
			stones.push(bp);
		}
	});
	return stones;
};

UndergrowthBriarStrategicAI.prototype.evaluateRingProgress = function(board, player) {
	// Count how many quadrants around center have connected stones
	// Quadrants: NW (row<8,col<8), NE (row<8,col>8), SW (row>8,col<8), SE (row>8,col>8)
	var connectedSet = board.getConnectedToGates(player);
	var quadrants = { NW: false, NE: false, SW: false, SE: false };

	board.forEachBoardPointWithTile(function(bp) {
		if (bp.tile.ownerName !== player) return;
		var key = bp.row + "," + bp.col;
		if (!connectedSet.has(key)) return;

		// Only count stones within reasonable ring distance
		var dist = Math.abs(bp.row - 8) + Math.abs(bp.col - 8);
		if (dist > 8) return;

		if (bp.row < 8 && bp.col < 8) quadrants.NW = true;
		if (bp.row < 8 && bp.col > 8) quadrants.NE = true;
		if (bp.row > 8 && bp.col < 8) quadrants.SW = true;
		if (bp.row > 8 && bp.col > 8) quadrants.SE = true;
	});

	var count = 0;
	if (quadrants.NW) count++;
	if (quadrants.NE) count++;
	if (quadrants.SW) count++;
	if (quadrants.SE) count++;
	return count;
};
