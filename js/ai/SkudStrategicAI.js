/**
 * SkudStrategicAI - A more strategic AI for Skud Pai Sho
 *
 * Improvements over SkudAIv1:
 * - Strategic accent tile selection (not random)
 * - Better position evaluation with harmony potential
 * - Threat detection (blocking opponent's winning paths)
 * - Center control and ring formation awareness
 * - Endgame awareness (harmony counting when tiles run out)
 */

import {
	ACCENT_TILE,
	BASIC_FLOWER,
	SPECIAL_FLOWER,
} from '../GameData';
import {
	simpleCanonRules,
} from '../skud-pai-sho/SkudPaiShoRules';
import {
	ARRANGING,
	GUEST,
	HOST,
	NotationPoint,
	PLANTING,
	RowAndColumn,
} from '../CommonNotationObjects';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	SkudPaiShoNotationBuilder,
	SkudPaiShoNotationMove,
} from '../skud-pai-sho/SkudPaiShoGameNotation';
import { WAITING_FOR_ENDPOINT } from '../GameConstants';

export function SkudStrategicAI() {
	this.player = null;
	this.moveNum = 0;
}

SkudStrategicAI.prototype.getName = function() {
	return "Strategic AI";
};

SkudStrategicAI.prototype.getMessage = function() {
	return "A more strategic opponent that considers harmony potential, threat detection, and center control. A challenging opponent for experienced players.";
};

SkudStrategicAI.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

SkudStrategicAI.prototype.getMove = function(game, moveNum) {
	this.moveNum = moveNum;

	// Move 0: Strategic accent tile selection
	if (moveNum === 0) {
		return this.selectAccentTiles(game);
	}

	var moves = this.getPossibleMoves(game, this.player);

	if (moves.length === 0) {
		return null;
	}

	// Enhance moves with harmony bonus actions where applicable
	moves = this.enhanceMovesWithBonusActions(game, moves);

	// Score all moves and find the best
	var bestMove = null;
	var bestScore = -Infinity;

	for (var i = 0; i < moves.length; i++) {
		var move = moves[i];
		var score = this.evaluateMove(game, move);

		// Immediate win detection
		if (score >= 1000000) {
			this.ensurePlant(move, game, this.player);
			return move;
		}

		// Add small random factor to break ties and add variety
		score += Math.random() * 2;

		if (score > bestScore) {
			bestScore = score;
			bestMove = move;
		}
	}

	if (bestMove) {
		this.ensurePlant(bestMove, game, this.player);
		return bestMove;
	}

	// Fallback: random move
	var randomIndex = Math.floor(Math.random() * moves.length);
	return moves[randomIndex];
};

/**
 * Select accent tiles strategically instead of randomly.
 * Prefers a balanced combination of offensive and defensive tiles.
 */
SkudStrategicAI.prototype.selectAccentTiles = function(game) {
	var tilePile = this.getTilePile(game, this.player);

	var availableAccents = [];
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].type === ACCENT_TILE) {
			availableAccents.push(tilePile[i]);
		}
	}

	// Strategic accent tile preferences (in order)
	// Wheel (W) - very versatile for positioning
	// Knotweed (K) - drains opponent harmonies
	// Rock (R) - blocks harmony lines
	// Boat (B) - transportation utility
	// Bamboo (M) - defensive protection
	// Pond (P) - defensive protection
	// Lion Turtle (T) - situational
	var preferenceOrder = ['W', 'K', 'R', 'B', 'M', 'P', 'T'];

	var chosenAccents = [];
	var numToSelect = simpleCanonRules ? 2 : 4;

	// Select tiles based on preference order
	for (var pref of preferenceOrder) {
		if (chosenAccents.length >= numToSelect) break;

		for (var j = 0; j < availableAccents.length; j++) {
			if (availableAccents[j].code === pref) {
				chosenAccents.push(pref);
				availableAccents.splice(j, 1);
				break;
			}
		}
	}

	// Fill remaining slots if needed
	while (chosenAccents.length < numToSelect && availableAccents.length > 0) {
		var randomIndex = Math.floor(Math.random() * availableAccents.length);
		chosenAccents.push(availableAccents.splice(randomIndex, 1)[0].code);
	}

	return new SkudPaiShoNotationMove("0" + this.player.charAt(0) + "." + chosenAccents.join());
};

/**
 * Enhance moves with bonus actions when they create harmonies.
 * For each move that creates a harmony, we add variants with bonus plant/arrange moves.
 */
SkudStrategicAI.prototype.enhanceMovesWithBonusActions = function(game, moves) {
	var enhancedMoves = [];
	var opponent = this.getOpponent();

	for (var i = 0; i < moves.length; i++) {
		var move = moves[i];
		enhancedMoves.push(move); // Always include the basic move

		// Check if this move creates a harmony
		var copyGame = game.getCopy();
		copyGame.runNotationMove(move);

		var harmonyBefore = game.board.harmonyManager.numHarmoniesForPlayer(this.player);
		var harmonyAfter = copyGame.board.harmonyManager.numHarmoniesForPlayer(this.player);

		// If move creates a harmony, add bonus action variants
		if (harmonyAfter > harmonyBefore) {
			// Add variants with bonus plant moves
			var plantBonusVariants = this.generateBonusPlantVariants(copyGame, move);
			enhancedMoves = enhancedMoves.concat(plantBonusVariants);

			// Add variants with bonus arrange moves
			var arrangeBonusVariants = this.generateBonusArrangeVariants(copyGame, move);
			enhancedMoves = enhancedMoves.concat(arrangeBonusVariants);
		}
	}

	return enhancedMoves;
};

/**
 * Generate bonus plant move variants for a given move.
 * Takes a move that creates harmony, and returns versions with bonus plants attached.
 */
SkudStrategicAI.prototype.generateBonusPlantVariants = function(game, baseMove) {
	var variants = [];
	var tilePile = this.getTilePile(game, this.player);
	var plantableFlowers = [];

	// Collect available basic flowers to plant
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].type === BASIC_FLOWER) {
			plantableFlowers.push(tilePile[i]);
		}
	}

	if (plantableFlowers.length === 0) {
		return variants; // No flowers left to plant
	}

	// For each plantable flower, generate placement variants
	for (var f = 0; f < plantableFlowers.length; f++) {
		var flower = plantableFlowers[f];
		game.revealOpenGates(this.player, flower, this.moveNum * 2, true);
		var endPoints = this.getPossibleMovePoints(game);

		for (var j = 0; j < endPoints.length; j++) {
			var endPoint = endPoints[j];
			var variant = baseMove.clone ? baseMove.clone() : JSON.parse(JSON.stringify(baseMove));
			
			// Add bonus plant information
			variant.bonusTileCode = flower.code;
			variant.bonusEndPoint = "(" + this.getNotation(endPoint) + ")";
			variant.fullMoveText = baseMove.fullMoveText + "+" + variant.bonusTileCode + variant.bonusEndPoint;

			// Prefer center placements for bonuses
			if (j < 3) { // Only add some of the closest options to avoid explosion
				variants.push(variant);
			}
		}

		game.hidePossibleMovePoints(true);
	}

	return variants;
};

/**
 * Generate bonus arrange move variants for a given move.
 * Takes a move that creates harmony, and returns versions with bonus arrangements attached.
 */
SkudStrategicAI.prototype.generateBonusArrangeVariants = function(game, baseMove) {
	var variants = [];
	var startPoints = this.getStartPoints(game, this.player);

	// For each tile we can move, generate movement variants
	for (var i = 0; i < startPoints.length && variants.length < 6; i++) {
		var startPoint = startPoints[i];
		game.revealPossibleMovePoints(startPoint, true);
		var endPoints = this.getPossibleMovePoints(game);

		for (var j = 0; j < endPoints.length; j++) {
			var endPoint = endPoints[j];
			var variant = baseMove.clone ? baseMove.clone() : JSON.parse(JSON.stringify(baseMove));
			
			// Add bonus arrange information
			variant.bonusStartPoint = this.getNotation(startPoint);
			variant.bonusEndPoint = "(" + this.getNotation(endPoint) + ")";
			variant.fullMoveText = baseMove.fullMoveText + "+" + this.getNotation(startPoint) + variant.bonusEndPoint;

			variants.push(variant);

			// Limit variants to avoid too many options
			if (variants.length >= 6) break;
		}

		game.hidePossibleMovePoints(true);
	}

	return variants;
};

/**
 * Evaluate a move by simulating it and scoring the resulting position.
 */
SkudStrategicAI.prototype.evaluateMove = function(game, move) {
	var copyGame = game.getCopy();
	copyGame.runNotationMove(move);

	var score = 0;
	var opponent = this.getOpponent();

	// === IMMEDIATE WIN/LOSS DETECTION ===

	// Check for our win
	if (copyGame.board.winners.includes(this.player)) {
		return 1000000;
	}

	// Check if opponent could win on their next turn (threat)
	var opponentThreatLevel = this.detectOpponentThreats(copyGame, opponent);
	if (opponentThreatLevel > 0) {
		// Penalize moves that don't address threats
		score -= opponentThreatLevel * 100;
	}

	// === HARMONY EVALUATION ===

	// Our harmonies
	var harmonyBefore = game.board.harmonyManager.numHarmoniesForPlayer(this.player);
	var harmonyAfter = copyGame.board.harmonyManager.numHarmoniesForPlayer(this.player);
	var harmonyDelta = harmonyAfter - harmonyBefore;

	score += harmonyDelta * 30;

	// Harmonies crossing center are more valuable
	var centerHarmBefore = game.board.harmonyManager.getNumCrossingCenterForPlayer(this.player);
	var centerHarmAfter = copyGame.board.harmonyManager.getNumCrossingCenterForPlayer(this.player);

	if (centerHarmAfter > centerHarmBefore) {
		score += 60;
	}

	// Opponent's harmonies (disruption is good)
	var oppHarmBefore = game.board.harmonyManager.numHarmoniesForPlayer(opponent);
	var oppHarmAfter = copyGame.board.harmonyManager.numHarmoniesForPlayer(opponent);
	var oppHarmDelta = oppHarmAfter - oppHarmBefore;

	score -= oppHarmDelta * 25; // Penalize opponent gains, reward opponent losses

	// === RING FORMATION ===

	var surroundness = copyGame.board.getSurroundness(this.player);
	var surroundnessBefore = game.board.getSurroundness(this.player);

	// Building surroundness is important for ring victory
	if (surroundness > surroundnessBefore) {
		score += 15;
	}

	// If we have good surroundness, prioritize ring length
	if (surroundness >= 3) {
		var ringLengthBefore = game.board.harmonyManager.ringLengthForPlayer(this.player);
		var ringLengthAfter = copyGame.board.harmonyManager.ringLengthForPlayer(this.player);

		if (ringLengthAfter > ringLengthBefore) {
			score += 25 + (ringLengthAfter * 5);
		}
	}

	// === POSITION QUALITY ===

	// Tiles in gardens (controlled territory)
	var gardenTilesBefore = game.board.numTilesInGardensForPlayer(this.player);
	var gardenTilesAfter = copyGame.board.numTilesInGardensForPlayer(this.player);

	score += (gardenTilesAfter - gardenTilesBefore) * 8;

	// Capturing opponent tiles
	var oppTilesBefore = game.board.numTilesOnBoardForPlayer(opponent);
	var oppTilesAfter = copyGame.board.numTilesOnBoardForPlayer(opponent);

	if (oppTilesAfter < oppTilesBefore) {
		score += 12;
	}

	// === HARMONY POTENTIAL ===

	// Evaluate tiles that could form harmonies in future moves
	score += this.evaluateHarmonyPotential(copyGame, this.player) * 3;

	// === ENDGAME AWARENESS ===

	// Check if approaching endgame (few tiles left)
	var ourTilePile = this.getTilePile(game, this.player);
	var basicFlowersLeft = this.countBasicFlowers(ourTilePile);

	if (basicFlowersLeft <= 2) {
		// In endgame, harmonies crossing center matter most
		score += centerHarmAfter * 40;
	}

	// === PLANTING BONUS ===

	// Slight preference for planting to develop the position
	if (move.moveType === PLANTING) {
		score += 5;
	}

	// === HARMONY BONUS ACTIONS ===
	// Big score boost for moves that have bonus actions attached
	// These are moves that successfully chain combo actions
	if (move.hasHarmonyBonus && move.hasHarmonyBonus()) {
		score += 100; // Significant bonus for utilizing harmony extra actions
		
		// Extra bonus if the bonus action is a plant (develops board)
		if (move.bonusTileCode && move.moveType === ARRANGING) {
			score += 40; // Arranging with a bonus plant is very productive
		}
	}

	return score;
};

/**
 * Detect if the opponent has threatening positions that could lead to a win.
 * Returns a threat level (0 = no threat, higher = more dangerous)
 */
SkudStrategicAI.prototype.detectOpponentThreats = function(game, opponent) {
	var threatLevel = 0;

	// Check opponent's surroundness and ring progress
	var oppSurroundness = game.board.getSurroundness(opponent);
	if (oppSurroundness >= 4) {
		threatLevel += 20;

		var oppRingLength = game.board.harmonyManager.ringLengthForPlayer(opponent);
		if (oppRingLength >= 6) {
			threatLevel += 50; // Very close to ring victory
		} else if (oppRingLength >= 4) {
			threatLevel += 25;
		}
	}

	// Check opponent's center-crossing harmonies (endgame threat)
	var oppCenterHarm = game.board.harmonyManager.getNumCrossingCenterForPlayer(opponent);
	var ourCenterHarm = game.board.harmonyManager.getNumCrossingCenterForPlayer(this.player);

	if (oppCenterHarm > ourCenterHarm + 2) {
		threatLevel += 15;
	}

	return threatLevel;
};

/**
 * Evaluate the potential for future harmonies based on tile positions.
 * Looks at tiles that are adjacent to empty spaces that could complete harmonies.
 */
SkudStrategicAI.prototype.evaluateHarmonyPotential = function(game, player) {
	var potential = 0;
	var cells = game.board.cells;

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			var point = cells[row][col];
			if (point.hasTile() && point.tile.ownerName === player) {
				var tile = point.tile;
				if (tile.type === BASIC_FLOWER || tile.type === SPECIAL_FLOWER) {
					// Count adjacent empty spaces that could extend harmonies
					potential += this.countAdjacentPotential(game, row, col, tile);
				}
			}
		}
	}

	return potential;
};

/**
 * Count adjacent positions that could potentially form harmonies.
 */
SkudStrategicAI.prototype.countAdjacentPotential = function(game, row, col, tile) {
	var potential = 0;
	var directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

	for (var dir of directions) {
		var newRow = row + dir[0];
		var newCol = col + dir[1];

		if (newRow >= 0 && newRow < game.board.cells.length &&
			newCol >= 0 && newCol < game.board.cells[newRow].length) {

			var adjPoint = game.board.cells[newRow][newCol];
			// Empty playable space = potential
			if (!adjPoint.hasTile() && adjPoint.types && !adjPoint.types.includes('NON_PLAYABLE')) {
				potential += 1;
			}
		}
	}

	return potential;
};

/**
 * Count basic flowers remaining in a tile pile.
 */
SkudStrategicAI.prototype.countBasicFlowers = function(tilePile) {
	var count = 0;
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].type === BASIC_FLOWER) {
			count++;
		}
	}
	return count;
};

// ===== MOVE GENERATION (same as SkudAIv1) =====

SkudStrategicAI.prototype.getPossibleMoves = function(game, player) {
	var moves = [];
	this.addPlantMoves(moves, game, player);
	this.addArrangeMoves(moves, game, player);
	return moves;
};

SkudStrategicAI.prototype.addPlantMoves = function(moves, game, player) {
	if (!this.isOpenGate(game)) {
		return;
	}

	var tilePile = this.getTilePile(game, player);

	for (var i = 0; i < tilePile.length; i++) {
		var tile = tilePile[i];
		if (tile.type === BASIC_FLOWER) {
			var convertedMoveNum = this.moveNum * 2;
			game.revealOpenGates(player, tile, convertedMoveNum, true);
			var endPoints = this.getPossibleMovePoints(game);

			for (var j = 0; j < endPoints.length; j++) {
				var notationBuilder = new SkudPaiShoNotationBuilder();
				notationBuilder.moveType = PLANTING;
				notationBuilder.plantedFlowerType = tile.code;
				notationBuilder.status = WAITING_FOR_ENDPOINT;

				var endPoint = endPoints[j];
				notationBuilder.endPoint = new NotationPoint(this.getNotation(endPoint));
				var move = notationBuilder.getNotationMove(this.moveNum, player);

				game.hidePossibleMovePoints(true);

				if (!this.isDuplicateMove(moves, move)) {
					moves.push(move);
				}
			}
		}
	}
};

SkudStrategicAI.prototype.addArrangeMoves = function(moves, game, player) {
	var startPoints = this.getStartPoints(game, player);

	for (var i = 0; i < startPoints.length; i++) {
		var startPoint = startPoints[i];
		game.revealPossibleMovePoints(startPoint, true);
		var endPoints = this.getPossibleMovePoints(game);

		for (var j = 0; j < endPoints.length; j++) {
			var notationBuilder = new SkudPaiShoNotationBuilder();
			notationBuilder.status = WAITING_FOR_ENDPOINT;
			notationBuilder.moveType = ARRANGING;
			notationBuilder.startPoint = new NotationPoint(this.getNotation(startPoint));

			var endPoint = endPoints[j];
			notationBuilder.endPoint = new NotationPoint(this.getNotation(endPoint));
			var move = notationBuilder.getNotationMove(this.moveNum, player);

			game.hidePossibleMovePoints(true);

			if (!this.isDuplicateMove(moves, move)) {
				moves.push(move);
			}
		}
	}
};

SkudStrategicAI.prototype.isDuplicateMove = function(moves, move) {
	for (var x = 0; x < moves.length; x++) {
		if (moves[x].equals(move)) {
			return true;
		}
	}
	return false;
};

// ===== HELPER METHODS =====

SkudStrategicAI.prototype.getOpponent = function() {
	return this.player === GUEST ? HOST : GUEST;
};

SkudStrategicAI.prototype.getTilePile = function(game, player) {
	return player === GUEST ? game.tileManager.guestTiles : game.tileManager.hostTiles;
};

SkudStrategicAI.prototype.isOpenGate = function(game) {
	var cells = game.board.cells;
	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			if (cells[row][col].isOpenGate()) {
				return true;
			}
		}
	}
	return false;
};

SkudStrategicAI.prototype.getStartPoints = function(game, player) {
	var points = [];
	for (var row = 0; row < game.board.cells.length; row++) {
		for (var col = 0; col < game.board.cells[row].length; col++) {
			var startPoint = game.board.cells[row][col];
			if (startPoint.hasTile() &&
				startPoint.tile.ownerName === player &&
				startPoint.tile.type !== ACCENT_TILE &&
				!(startPoint.tile.drained || startPoint.tile.trapped)) {
				points.push(startPoint);
			}
		}
	}
	return points;
};

SkudStrategicAI.prototype.getPossibleMovePoints = function(game) {
	var points = [];
	for (var row = 0; row < game.board.cells.length; row++) {
		for (var col = 0; col < game.board.cells[row].length; col++) {
			if (game.board.cells[row][col].isType(POSSIBLE_MOVE)) {
				points.push(game.board.cells[row][col]);
			}
		}
	}
	return points;
};

SkudStrategicAI.prototype.getNotation = function(boardPoint) {
	return new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString;
};

/**
 * Ensure we plant a tile if we have no growing flowers (game rule requirement).
 */
SkudStrategicAI.prototype.ensurePlant = function(move, game, player) {
	if (move.moveType !== ARRANGING ||
		move.bonusTileCode ||
		!game.board.playerHasNoGrowingFlowers(player)) {
		return;
	}

	var moves = [];
	this.addPlantMoves(moves, game, player);

	if (moves.length === 0) {
		return;
	}

	// Choose a planting move that could create harmony potential
	var bestPlantMove = moves[0];
	var bestPlantScore = -Infinity;

	for (var i = 0; i < moves.length; i++) {
		var plantMove = moves[i];
		// Simple heuristic: prefer center-adjacent positions
		var endPointStr = plantMove.endPoint ? plantMove.endPoint.pointText : '';
		var coords = endPointStr.split(',');
		if (coords.length === 2) {
			var x = parseInt(coords[0]);
			var y = parseInt(coords[1]);
			var distFromCenter = Math.abs(x) + Math.abs(y);
			var score = -distFromCenter; // Closer to center is better
			if (score > bestPlantScore) {
				bestPlantScore = score;
				bestPlantMove = plantMove;
			}
		}
	}

	move.bonusTileCode = bestPlantMove.plantedFlowerType;

	game.revealOpenGates(player, null, 5, true);
	var endPoints = this.getPossibleMovePoints(game);

	if (endPoints.length > 0) {
		// Choose endpoint closer to center
		var bestEndPoint = endPoints[0];
		var bestDist = Infinity;

		for (var i = 0; i < endPoints.length; i++) {
			var ep = endPoints[i];
			var dist = Math.abs(ep.col - 8) + Math.abs(ep.row - 8);
			if (dist < bestDist) {
				bestDist = dist;
				bestEndPoint = ep;
			}
		}

		move.bonusEndPoint = "(" + this.getNotation(bestEndPoint) + ")";
		move.fullMoveText += "+" + move.bonusTileCode + move.bonusEndPoint;
	}
};
