/* Undergrowth Briar AI Help - Move Generation */

import { GUEST, HOST, NotationPoint, RowAndColumn } from '../../CommonNotationObjects';
import { GATE, NON_PLAYABLE, POSSIBLE_MOVE } from '../../skud-pai-sho/SkudPaiShoBoardPoint';
import { UndergrowthSimplicityNotationBuilder } from '../UndergrowthSimplicityGameNotation';
import { UndergrowthSimplicityTile } from '../UndergrowthSimplicityTile';

export function UndergrowthBriarAiHelp() {
}

UndergrowthBriarAiHelp.prototype.getAllPossibleMoves = function(game, player, moveIndex) {
	var placementsNeeded = this.getPlacementsNeeded(moveIndex);

	if (placementsNeeded === 1) {
		return this.getSinglePlacementMoves(game, player, moveIndex);
	} else {
		return this.getDoublePlacementMoves(game, player, moveIndex);
	}
};

UndergrowthBriarAiHelp.prototype.getPlacementsNeeded = function(moveIndex) {
	if (moveIndex === 0) return 1;  // HOST: 1 gate
	if (moveIndex === 1) return 2;  // GUEST: 2 gates
	if (moveIndex === 2) return 2;  // HOST: 1 gate + 1 normal
	return 2;                        // Normal: 2 placements
};

UndergrowthBriarAiHelp.prototype.getSinglePlacementMoves = function(game, player, moveIndex) {
	var moves = [];
	var points = this.getLegalPoints(game, player, moveIndex);

	var moveNum = this.getMoveNum(moveIndex);
	for (var i = 0; i < points.length; i++) {
		var builder = new UndergrowthSimplicityNotationBuilder();
		builder.addPlacement(new NotationPoint(this.getNotation(points[i])));
		var move = builder.getNotationMove(moveNum, player);
		if (move && move.fullMoveText) {
			moves.push(move);
		}
	}

	game.board.removePossibleMovePoints();
	return moves;
};

UndergrowthBriarAiHelp.prototype.getDoublePlacementMoves = function(game, player, moveIndex) {
	var moves = [];
	var seenMoveTexts = {};

	// Get first placement options
	var firstPoints = this.getFirstPlacementPoints(game, player, moveIndex);

	for (var i = 0; i < firstPoints.length; i++) {
		var firstPoint = firstPoints[i];
		var firstNotation = new NotationPoint(this.getNotation(firstPoint));

		// Simulate first placement on a copy
		var gameCopy = game.getCopy();
		var playerCode = player === HOST ? 'H' : 'G';
		var tile = new UndergrowthSimplicityTile(playerCode);
		var bp = gameCopy.board.cells[firstPoint.row][firstPoint.col];
		bp.putTile(tile);

		// Register gate ownership if placing on a gate
		if (bp.isType(GATE)) {
			var key = firstPoint.row + "," + firstPoint.col;
			gameCopy.board.gateOwners[key] = player;
		}

		gameCopy.board.analyzeConnections();

		// Check if first placement already wins
		if (gameCopy.board.checkForRingVictory(player)) {
			var builder = new UndergrowthSimplicityNotationBuilder();
			builder.addPlacement(firstNotation);
			var moveNum = this.getMoveNum(moveIndex);
			var move = builder.getNotationMove(moveNum, player);
			if (move && move.fullMoveText && !seenMoveTexts[move.fullMoveText]) {
				seenMoveTexts[move.fullMoveText] = true;
				moves.push(move);
			}
			continue;
		}

		// Get second placement options
		var secondPoints = this.getSecondPlacementPoints(gameCopy, player, moveIndex);

		if (secondPoints.length === 0) {
			// No second placement possible - submit with just 1
			var builder = new UndergrowthSimplicityNotationBuilder();
			builder.addPlacement(firstNotation);
			var moveNum = this.getMoveNum(moveIndex);
			var move = builder.getNotationMove(moveNum, player);
			if (move && move.fullMoveText && !seenMoveTexts[move.fullMoveText]) {
				seenMoveTexts[move.fullMoveText] = true;
				moves.push(move);
			}
		} else {
			for (var j = 0; j < secondPoints.length; j++) {
				var secondPoint = secondPoints[j];
				var secondNotation = new NotationPoint(this.getNotation(secondPoint));

				var builder = new UndergrowthSimplicityNotationBuilder();
				builder.addPlacement(firstNotation);
				builder.addPlacement(secondNotation);
				var moveNum = this.getMoveNum(moveIndex);
				var move = builder.getNotationMove(moveNum, player);
				if (move && move.fullMoveText && !seenMoveTexts[move.fullMoveText]) {
					seenMoveTexts[move.fullMoveText] = true;
					moves.push(move);
				}
			}
		}

		gameCopy.board.removePossibleMovePoints();
	}

	game.board.removePossibleMovePoints();
	return moves;
};

UndergrowthBriarAiHelp.prototype.getFirstPlacementPoints = function(game, player, moveIndex) {
	if (moveIndex === 1 || moveIndex === 2) {
		// GUEST's 2 gates or HOST's gate+normal: first placement is a gate
		game.board.setOpenGatePossibleMoves();
	} else {
		// Normal turn
		game.board.setLegalPlacementPoints(player);
	}
	return this.collectPossibleMovePoints(game);
};

UndergrowthBriarAiHelp.prototype.getSecondPlacementPoints = function(game, player, moveIndex) {
	if (moveIndex === 1) {
		// GUEST placing 2nd gate
		game.board.setOpenGatePossibleMoves();
	} else {
		// HOST gate+normal or normal turn: legal placements
		game.board.setLegalPlacementPoints(player);
	}
	var points = this.collectPossibleMovePoints(game);
	game.board.removePossibleMovePoints();
	return points;
};

UndergrowthBriarAiHelp.prototype.getLegalPoints = function(game, player, moveIndex) {
	if (moveIndex === 0) {
		// HOST placing first gate
		game.board.setOpenGatePossibleMoves();
	} else {
		game.board.setLegalPlacementPoints(player);
	}
	return this.collectPossibleMovePoints(game);
};

UndergrowthBriarAiHelp.prototype.collectPossibleMovePoints = function(game) {
	var points = [];
	for (var row = 0; row < game.board.cells.length; row++) {
		for (var col = 0; col < game.board.cells[row].length; col++) {
			var bp = game.board.cells[row][col];
			if (!bp.isType(NON_PLAYABLE) && bp.isType(POSSIBLE_MOVE)) {
				points.push(bp);
			}
		}
	}
	game.board.removePossibleMovePoints();
	return points;
};

UndergrowthBriarAiHelp.prototype.getNotation = function(boardPoint) {
	return new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString;
};

UndergrowthBriarAiHelp.prototype.getMoveNum = function(moveIndex) {
	// Matches getNotationMoveFromBuilder: first move is moveNum 1,
	// then H and G share a moveNum, incrementing each full round.
	// moveIndex 0 → 1(H), 1 → 1(G), 2 → 2(H), 3 → 2(G), 4 → 3(H), ...
	return Math.floor(moveIndex / 2) + 1;
};
