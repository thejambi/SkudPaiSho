/**
 * Trifle Aggressive AI
 *
 * Strategy: Focuses on attacking, capturing tiles, and threatening the enemy banner.
 *
 * Preferred tiles:
 * - Dragon + FireLily combo (powerful zone control and mobility)
 * - PolarBearDog (protected after capturing)
 * - SaberToothMooseLion (charge capture)
 * - SnowLeopard (cancels protection)
 * - GrassWeed (captures flowers on deploy)
 * - KomodoRhino (slows enemies)
 * - MessengerHawk (flies anywhere)
 * - FireBanner (zone enlargement)
 */

import { GUEST, HOST, TEAM_SELECTION } from '../../CommonNotationObjects';
import { getOpponentName } from '../../pai-sho-common/PaiShoPlayerHelp';
import { removeRandomFromArray } from '../../GameData';
import { TrifleAiHelp } from './TrifleAiHelp';
import { TrifleTileCodes } from '../TrifleTiles';
import { TrifleTiles, TrifleTileInfo } from '../TrifleTileInfo';

export function TrifleAggressiveAI() {
	this.aiHelp = new TrifleAiHelp();
	this.player = null;

	// Preferred aggressive tiles with weights (higher = more likely to pick)
	this.preferredTiles = {
		// Fire synergy - Dragon combo is powerful
		[TrifleTileCodes.FireLily]: 10,
		[TrifleTileCodes.Dragon]: 10,
		[TrifleTileCodes.FireBanner]: 8,
		[TrifleTileCodes.KomodoRhino]: 7,
		[TrifleTileCodes.ArmadilloBear]: 6,
		[TrifleTileCodes.MessengerHawk]: 8,

		// Strong attackers
		[TrifleTileCodes.PolarBearDog]: 9,
		[TrifleTileCodes.SaberToothMooseLion]: 9,
		[TrifleTileCodes.SnowLeopard]: 8,
		[TrifleTileCodes.SnowWolf]: 7,
		[TrifleTileCodes.FlyingLemur]: 7,
		[TrifleTileCodes.HermitCrab]: 6,
		[TrifleTileCodes.SkyBison]: 7,

		// Disruptive flowers
		[TrifleTileCodes.GrassWeed]: 8,
		[TrifleTileCodes.Saffron]: 6,
		[TrifleTileCodes.BoarQPine]: 7,

		// Other banners
		[TrifleTileCodes.WaterBanner]: 5,
		[TrifleTileCodes.AirBanner]: 5,
		[TrifleTileCodes.EarthBanner]: 4,
	};
}

TrifleAggressiveAI.prototype.getName = function() {
	return "Trifle Aggressive AI";
};

TrifleAggressiveAI.prototype.getMessage = function() {
	return "An aggressive AI that prioritizes capturing tiles and threatening your banner. Favors high-mobility attackers and the Dragon/FireLily combo.";
};

TrifleAggressiveAI.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

TrifleAggressiveAI.prototype.getMove = function(game, moveNum) {
	this.aiHelp.moveNum = moveNum;

	// Handle team selection phase - only if AI's player hasn't selected yet
	if (game.playersAreSelectingTeams() && !game.tileManager.playerTeamIsFull(this.player)) {
		return this.selectTeam(game);
	}

	var moves = this.aiHelp.getAllPossibleMoves(game, this.player);

	if (!moves || moves.length === 0) {
		return null;
	}

	return this.selectBestMove(moves, game);
};

/**
 * Select team with aggressive preferences
 */
TrifleAggressiveAI.prototype.selectTeam = function(game) {
	var selectedTiles = [];
	var availableTiles = this.aiHelp.getAvailableTilesForTeamSelection();
	var bannerTiles = this.aiHelp.getBannerTiles();
	var teamSize = 11;

	// First, select a banner - prefer FireBanner for zone enlargement
	var bannerWeights = bannerTiles.map(b => ({
		code: b,
		weight: this.preferredTiles[b] || 3
	}));
	bannerWeights.sort((a, b) => b.weight - a.weight);

	// Add some randomness to banner selection
	var bannerIndex = Math.random() < 0.6 ? 0 : Math.floor(Math.random() * bannerWeights.length);
	selectedTiles.push(bannerWeights[bannerIndex].code);

	// Filter out banners and already selected from available
	var nonBannerTiles = availableTiles.filter(t =>
		!bannerTiles.includes(t) && !selectedTiles.includes(t)
	);

	// If we picked FireBanner, strongly prefer FireLily and Dragon
	if (selectedTiles[0] === TrifleTileCodes.FireBanner) {
		if (nonBannerTiles.includes(TrifleTileCodes.FireLily)) {
			selectedTiles.push(TrifleTileCodes.FireLily);
			nonBannerTiles = nonBannerTiles.filter(t => t !== TrifleTileCodes.FireLily);
		}
		if (nonBannerTiles.includes(TrifleTileCodes.Dragon)) {
			selectedTiles.push(TrifleTileCodes.Dragon);
			nonBannerTiles = nonBannerTiles.filter(t => t !== TrifleTileCodes.Dragon);
		}
	}

	// Build weighted pool for remaining selections
	while (selectedTiles.length < teamSize && nonBannerTiles.length > 0) {
		var weightedTiles = nonBannerTiles.map(t => ({
			code: t,
			weight: this.preferredTiles[t] || 3
		}));

		// Calculate total weight
		var totalWeight = weightedTiles.reduce((sum, t) => sum + t.weight, 0);

		// Random weighted selection
		var random = Math.random() * totalWeight;
		var cumulative = 0;
		var selectedTile = null;

		for (var i = 0; i < weightedTiles.length; i++) {
			cumulative += weightedTiles[i].weight;
			if (random <= cumulative) {
				selectedTile = weightedTiles[i].code;
				break;
			}
		}

		if (selectedTile) {
			// Check if we can add this tile (max 2 of same tile)
			var countOfTile = selectedTiles.filter(t => t === selectedTile).length;
			if (countOfTile < 2) {
				selectedTiles.push(selectedTile);
			}
			// Remove from pool after 2 selections
			if (countOfTile >= 1) {
				nonBannerTiles = nonBannerTiles.filter(t => t !== selectedTile);
			}
		}
	}

	return this.aiHelp.getTeamSelectionMove(game, this.player, selectedTiles);
};

/**
 * Select the best move with aggressive evaluation
 */
TrifleAggressiveAI.prototype.selectBestMove = function(moves, game) {
	var self = this;
	var scoredMoves = [];

	moves.forEach(function(move) {
		var score = self.evaluateMove(move, game);
		scoredMoves.push({ move: move, score: score });
	});

	// Sort by score descending
	scoredMoves.sort(function(a, b) { return b.score - a.score; });

	// Add some randomness - pick from top moves with weighted probability
	var topMoves = scoredMoves.slice(0, Math.min(5, scoredMoves.length));

	// Weight towards higher scores
	var weights = topMoves.map(function(m, i) {
		return Math.pow(0.6, i); // First has weight 1, second 0.6, third 0.36, etc.
	});
	var totalWeight = weights.reduce(function(a, b) { return a + b; }, 0);
	var random = Math.random() * totalWeight;
	var cumulative = 0;

	for (var i = 0; i < weights.length; i++) {
		cumulative += weights[i];
		if (random <= cumulative) {
			return topMoves[i].move;
		}
	}

	return topMoves[0].move;
};

/**
 * Evaluate a move with aggressive priorities
 */
TrifleAggressiveAI.prototype.evaluateMove = function(move, game) {
	var score = 0;
	var opponent = getOpponentName(this.player);

	// Simulate the move
	var gameCopy = game.getCopy();
	gameCopy.runNotationMove(move, false);

	// Check for win (capturing banner)
	if (gameCopy.getWinner() === this.player) {
		return 10000; // Winning move
	}

	// Count captures - highly valued
	var myTilesBefore = this.aiHelp.countPlayerTiles(game, this.player);
	var myTilesAfter = this.aiHelp.countPlayerTiles(gameCopy, this.player);
	var opponentTilesBefore = this.aiHelp.countPlayerTiles(game, opponent);
	var opponentTilesAfter = this.aiHelp.countPlayerTiles(gameCopy, opponent);

	var capturedTiles = opponentTilesBefore - opponentTilesAfter;
	score += capturedTiles * 100;

	// Bonus for capturing animals (can capture)
	if (capturedTiles > 0 && move.moveType === 'MOVE') {
		score += 25; // Bonus for successful capture
	}

	// Check if we're threatening the enemy banner after this move
	var enemyBannerPoint = this.aiHelp.findBannerPoint(gameCopy, opponent);
	if (enemyBannerPoint) {
		// Check if any of our tiles can capture it next turn
		var ourTiles = this.aiHelp.getMovementStartPoints(gameCopy, this.player);
		ourTiles.forEach(function(point) {
			gameCopy.revealPossibleMovePoints(point, true);
			var possibleMoves = self.aiHelp.getPossibleMovePoints(gameCopy);
			possibleMoves.forEach(function(endPoint) {
				if (endPoint.row === enemyBannerPoint.row && endPoint.col === enemyBannerPoint.col) {
					score += 500; // Threatening banner is very valuable
				}
			});
			gameCopy.hidePossibleMovePoints(true);
		});
	}

	// Prefer deploying attackers early
	if (move.moveType === 'DEPLOY') {
		var tileCode = move.tileType;
		if (this.aiHelp.isAnimalTile(tileCode)) {
			score += 20; // Prefer deploying animals
		}
		if (this.preferredTiles[tileCode]) {
			score += this.preferredTiles[tileCode]; // Bonus for preferred tiles
		}

		// Dragon deployment bonus if near FireLily
		if (tileCode === TrifleTileCodes.Dragon) {
			score += 30;
		}
	}

	// Moving closer to enemy banner is good
	if (move.moveType === 'MOVE' && enemyBannerPoint) {
		var startPoint = game.board.getPointFromNotation(move.startPoint);
		var endPoint = game.board.getPointFromNotation(move.endPoint);
		if (startPoint && endPoint) {
			var distanceBefore = this.aiHelp.getDistance(startPoint, enemyBannerPoint);
			var distanceAfter = this.aiHelp.getDistance(endPoint, enemyBannerPoint);
			if (distanceAfter < distanceBefore) {
				score += (distanceBefore - distanceAfter) * 5;
			}
		}
	}

	// Small random factor
	score += Math.random() * 5;

	return score;
};

var self;
TrifleAggressiveAI.prototype.evaluateMove = function(move, game) {
	self = this;
	var score = 0;
	var opponent = getOpponentName(this.player);

	// Simulate the move
	var gameCopy = game.getCopy();
	try {
		gameCopy.runNotationMove(move, false);
	} catch (e) {
		return -1000; // Invalid move
	}

	// Check for win (capturing banner)
	if (gameCopy.getWinner() === this.player) {
		return 10000;
	}

	// Count captures
	var opponentTilesBefore = this.aiHelp.countPlayerTiles(game, opponent);
	var opponentTilesAfter = this.aiHelp.countPlayerTiles(gameCopy, opponent);
	var capturedTiles = opponentTilesBefore - opponentTilesAfter;
	score += capturedTiles * 100;

	// Prefer deploying aggressive tiles
	if (move.moveType === 'DEPLOY') {
		var tileCode = move.tileType;
		if (this.aiHelp.isAnimalTile(tileCode)) {
			score += 15;
		}
		if (this.preferredTiles[tileCode]) {
			score += this.preferredTiles[tileCode];
		}
		if (tileCode === TrifleTileCodes.Dragon) {
			score += 30;
		}
		if (tileCode === TrifleTileCodes.FireLily) {
			score += 25;
		}
	}

	// Moving towards enemy banner
	var enemyBannerPoint = this.aiHelp.findBannerPoint(game, opponent);
	if (move.moveType === 'MOVE' && enemyBannerPoint) {
		var startRow = move.startPoint.rowAndColumn.row;
		var startCol = move.startPoint.rowAndColumn.col;
		var endRow = move.endPoint.rowAndColumn.row;
		var endCol = move.endPoint.rowAndColumn.col;

		var distanceBefore = Math.abs(startRow - enemyBannerPoint.row) + Math.abs(startCol - enemyBannerPoint.col);
		var distanceAfter = Math.abs(endRow - enemyBannerPoint.row) + Math.abs(endCol - enemyBannerPoint.col);

		if (distanceAfter < distanceBefore) {
			score += (distanceBefore - distanceAfter) * 5;
		}
	}

	// Small random factor for variety
	score += Math.random() * 5;

	return score;
};
