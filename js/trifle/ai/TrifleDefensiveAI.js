/**
 * Trifle Defensive AI
 *
 * Strategy: Focuses on protecting the banner, controlling zones, and immobilizing enemies.
 *
 * Preferred tiles:
 * - EarthBanner (protects adjacent flowers)
 * - Badgermole (protects adjacent tiles, jumps to flowers)
 * - CherryBlossom (zone protection)
 * - SkyBison (large zone, restricts enemy bison)
 * - TitanArum (movement restriction zone)
 * - Lavender (immobilizes all adjacent)
 * - GrippingGrass (immobilizes animals)
 * - Edelweiss (cancels abilities in zone)
 * - Cattail (prevents adjacent captures)
 */

import { GUEST, HOST, TEAM_SELECTION } from '../../CommonNotationObjects';
import { getOpponentName } from '../../pai-sho-common/PaiShoPlayerHelp';
import { removeRandomFromArray } from '../../GameData';
import { TrifleAiHelp } from './TrifleAiHelp';
import { TrifleTileCodes } from '../TrifleTiles';
import { TrifleTiles, TrifleTileInfo } from '../TrifleTileInfo';

export function TrifleDefensiveAI() {
	this.aiHelp = new TrifleAiHelp();
	this.player = null;

	// Preferred defensive tiles with weights
	this.preferredTiles = {
		// Earth protection synergy
		[TrifleTileCodes.EarthBanner]: 10,
		[TrifleTileCodes.Badgermole]: 9,
		[TrifleTileCodes.CherryBlossom]: 9,
		[TrifleTileCodes.MoonFlower]: 7,
		[TrifleTileCodes.Sunflower]: 6,
		[TrifleTileCodes.Chamomile]: 7,

		// Zone control
		[TrifleTileCodes.SkyBison]: 9,
		[TrifleTileCodes.TitanArum]: 8,
		[TrifleTileCodes.LilyPad]: 7,
		[TrifleTileCodes.Edelweiss]: 8,
		[TrifleTileCodes.WaterHyacinth]: 6,

		// Immobilization
		[TrifleTileCodes.Lavender]: 9,
		[TrifleTileCodes.GrippingGrass]: 8,
		[TrifleTileCodes.Chrysanthemum]: 7,
		[TrifleTileCodes.Shirshu]: 7,

		// Anti-capture
		[TrifleTileCodes.Cattail]: 8,
		[TrifleTileCodes.PolarBearDog]: 6,
		[TrifleTileCodes.Saffron]: 7,

		// Capture abilities for defense
		[TrifleTileCodes.BoarQPine]: 8,
		[TrifleTileCodes.SnowWolf]: 7,

		// Other banners as backup
		[TrifleTileCodes.AirBanner]: 5,
		[TrifleTileCodes.WaterBanner]: 5,
		[TrifleTileCodes.FireBanner]: 4,
	};
}

TrifleDefensiveAI.prototype.getName = function() {
	return "Trifle Defensive AI";
};

TrifleDefensiveAI.prototype.getMessage = function() {
	return "A defensive AI that prioritizes protecting its banner and controlling zones. Uses immobilization and protection abilities to frustrate attackers.";
};

TrifleDefensiveAI.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

TrifleDefensiveAI.prototype.getMove = function(game, moveNum) {
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
 * Select team with defensive preferences
 */
TrifleDefensiveAI.prototype.selectTeam = function(game) {
	var selectedTiles = [];
	var availableTiles = this.aiHelp.getAvailableTilesForTeamSelection();
	var bannerTiles = this.aiHelp.getBannerTiles();
	var teamSize = 11;

	// First, select a banner - prefer EarthBanner for protection
	var bannerWeights = bannerTiles.map(b => ({
		code: b,
		weight: this.preferredTiles[b] || 3
	}));
	bannerWeights.sort((a, b) => b.weight - a.weight);

	// Add some randomness to banner selection
	var bannerIndex = Math.random() < 0.6 ? 0 : Math.floor(Math.random() * bannerWeights.length);
	selectedTiles.push(bannerWeights[bannerIndex].code);

	// Filter out banners from available
	var nonBannerTiles = availableTiles.filter(t =>
		!bannerTiles.includes(t) && !selectedTiles.includes(t)
	);

	// If we picked EarthBanner, strongly prefer Badgermole and protective flowers
	if (selectedTiles[0] === TrifleTileCodes.EarthBanner) {
		var earthSynergy = [
			TrifleTileCodes.Badgermole,
			TrifleTileCodes.CherryBlossom,
			TrifleTileCodes.MoonFlower
		];
		earthSynergy.forEach(function(tile) {
			if (nonBannerTiles.includes(tile) && selectedTiles.length < teamSize) {
				selectedTiles.push(tile);
				nonBannerTiles = nonBannerTiles.filter(t => t !== tile);
			}
		});
	}

	// Build weighted pool for remaining selections
	while (selectedTiles.length < teamSize && nonBannerTiles.length > 0) {
		var weightedTiles = nonBannerTiles.map(t => ({
			code: t,
			weight: this.preferredTiles[t] || 3
		}));

		var totalWeight = weightedTiles.reduce((sum, t) => sum + t.weight, 0);
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
			var countOfTile = selectedTiles.filter(t => t === selectedTile).length;
			if (countOfTile < 2) {
				selectedTiles.push(selectedTile);
			}
			if (countOfTile >= 1) {
				nonBannerTiles = nonBannerTiles.filter(t => t !== selectedTile);
			}
		}
	}

	return this.aiHelp.getTeamSelectionMove(game, this.player, selectedTiles);
};

/**
 * Select the best move with defensive evaluation
 */
TrifleDefensiveAI.prototype.selectBestMove = function(moves, game) {
	var self = this;
	var scoredMoves = [];

	moves.forEach(function(move) {
		var score = self.evaluateMove(move, game);
		scoredMoves.push({ move: move, score: score });
	});

	// Sort by score descending
	scoredMoves.sort(function(a, b) { return b.score - a.score; });

	// Add some randomness - pick from top moves
	var topMoves = scoredMoves.slice(0, Math.min(5, scoredMoves.length));

	var weights = topMoves.map(function(m, i) {
		return Math.pow(0.6, i);
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
 * Evaluate a move with defensive priorities
 */
TrifleDefensiveAI.prototype.evaluateMove = function(move, game) {
	var self = this;
	var score = 0;
	var opponent = getOpponentName(this.player);

	// Simulate the move
	var gameCopy = game.getCopy();
	try {
		gameCopy.runNotationMove(move, false);
	} catch (e) {
		return -1000;
	}

	// Check for win
	if (gameCopy.getWinner() === this.player) {
		return 10000;
	}

	// Check if we're losing (very bad)
	if (gameCopy.getWinner() === opponent) {
		return -10000;
	}

	// Count tiles - avoid losing tiles
	var myTilesBefore = this.aiHelp.countPlayerTiles(game, this.player);
	var myTilesAfter = this.aiHelp.countPlayerTiles(gameCopy, this.player);
	var lostTiles = myTilesBefore - myTilesAfter;
	score -= lostTiles * 50;

	// Still value captures but less than aggressive AI
	var opponentTilesBefore = this.aiHelp.countPlayerTiles(game, opponent);
	var opponentTilesAfter = this.aiHelp.countPlayerTiles(gameCopy, opponent);
	var capturedTiles = opponentTilesBefore - opponentTilesAfter;
	score += capturedTiles * 50;

	// Get banner positions
	var myBannerPoint = this.aiHelp.findBannerPoint(game, this.player);
	var myBannerPointAfter = this.aiHelp.findBannerPoint(gameCopy, this.player);

	// Deploying near our banner is good for protection
	if (move.moveType === 'DEPLOY') {
		var tileCode = move.tileType;
		var endRow = move.endPoint.rowAndColumn.row;
		var endCol = move.endPoint.rowAndColumn.col;

		// Prefer defensive tiles
		if (this.preferredTiles[tileCode]) {
			score += this.preferredTiles[tileCode];
		}

		// Prefer flowers for their abilities
		if (this.aiHelp.isFlowerTile(tileCode)) {
			score += 10;
		}

		// Deploy protectors near banner
		if (myBannerPoint) {
			var distanceToBanner = Math.abs(endRow - myBannerPoint.row) + Math.abs(endCol - myBannerPoint.col);
			if (distanceToBanner <= 3) {
				score += 20; // Near banner is good
				if (tileCode === TrifleTileCodes.Badgermole ||
					tileCode === TrifleTileCodes.CherryBlossom ||
					tileCode === TrifleTileCodes.Lavender ||
					tileCode === TrifleTileCodes.GrippingGrass) {
					score += 30; // Especially protective tiles
				}
			}
		}

		// Deploying immobilizers in the path of enemy attackers
		if (tileCode === TrifleTileCodes.Lavender ||
			tileCode === TrifleTileCodes.GrippingGrass ||
			tileCode === TrifleTileCodes.Chrysanthemum) {
			// Check if near enemy tiles
			var nearEnemyTile = false;
			game.board.cells.forEach(function(row) {
				row.forEach(function(boardPoint) {
					if (boardPoint.hasTile() && boardPoint.tile.ownerName === opponent) {
						var dist = Math.abs(endRow - boardPoint.row) + Math.abs(endCol - boardPoint.col);
						if (dist <= 2) {
							nearEnemyTile = true;
						}
					}
				});
			});
			if (nearEnemyTile) {
				score += 25;
			}
		}
	}

	// Moving: prefer staying near banner or moving to block threats
	if (move.moveType === 'MOVE') {
		var startRow = move.startPoint.rowAndColumn.row;
		var startCol = move.startPoint.rowAndColumn.col;
		var endRow = move.endPoint.rowAndColumn.row;
		var endCol = move.endPoint.rowAndColumn.col;

		if (myBannerPoint) {
			var distanceFromBannerBefore = Math.abs(startRow - myBannerPoint.row) + Math.abs(startCol - myBannerPoint.col);
			var distanceFromBannerAfter = Math.abs(endRow - myBannerPoint.row) + Math.abs(endCol - myBannerPoint.col);

			// Don't move too far from banner
			if (distanceFromBannerAfter > 5) {
				score -= 10;
			}

			// Moving closer to banner when threatened is good
			if (distanceFromBannerAfter < distanceFromBannerBefore && distanceFromBannerBefore > 3) {
				score += 5;
			}
		}

		// Check if this move blocks an enemy path to our banner
		var enemyTilesNearBanner = 0;
		if (myBannerPoint) {
			game.board.cells.forEach(function(row) {
				row.forEach(function(boardPoint) {
					if (boardPoint.hasTile() && boardPoint.tile.ownerName === opponent) {
						var dist = Math.abs(boardPoint.row - myBannerPoint.row) +
						          Math.abs(boardPoint.col - myBannerPoint.col);
						if (dist <= 4) {
							enemyTilesNearBanner++;
						}
					}
				});
			});
		}

		// If enemies near banner, value moves that put us between them
		if (enemyTilesNearBanner > 0 && myBannerPoint) {
			var isBlocking = false;
			game.board.cells.forEach(function(row) {
				row.forEach(function(boardPoint) {
					if (boardPoint.hasTile() && boardPoint.tile.ownerName === opponent) {
						// Check if our end point is between enemy and banner
						var enemyToBanner = Math.abs(boardPoint.row - myBannerPoint.row) +
						                   Math.abs(boardPoint.col - myBannerPoint.col);
						var enemyToUs = Math.abs(boardPoint.row - endRow) + Math.abs(boardPoint.col - endCol);
						var usToBanner = Math.abs(endRow - myBannerPoint.row) + Math.abs(endCol - myBannerPoint.col);

						if (enemyToUs + usToBanner <= enemyToBanner + 2 && enemyToUs < enemyToBanner) {
							isBlocking = true;
						}
					}
				});
			});
			if (isBlocking) {
				score += 30;
			}
		}
	}

	// Small random factor for variety
	score += Math.random() * 5;

	return score;
};
