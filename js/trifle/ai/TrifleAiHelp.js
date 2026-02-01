/**
 * Trifle AI Help
 * Provides move generation and game state evaluation utilities for AI opponents.
 */

import {
	DEPLOY,
	GUEST,
	HOST,
	MOVE,
	NotationPoint,
	RowAndColumn,
	TEAM_SELECTION,
} from '../../CommonNotationObjects';
import { NON_PLAYABLE, POSSIBLE_MOVE } from '../../skud-pai-sho/SkudPaiShoBoardPoint';
import { OldTrifleNotationBuilder } from '../OldTrifleGameNotation';
import { WAITING_FOR_ENDPOINT } from '../../PaiShoMain';
import { TrifleTileCodes } from '../TrifleTiles';
import { TrifleTileInfo, TrifleTiles } from '../TrifleTileInfo';
import { TrifleTile } from '../TrifleTile';

export function TrifleAiHelp() {
	this.moveNum = 0;
}

/**
 * Get all possible moves for a player
 */
TrifleAiHelp.prototype.getAllPossibleMoves = function(game, player) {
	// Check if still in team selection phase
	if (game.playersAreSelectingTeams()) {
		return [];
	}

	var deploymentMoves = this.getPossibleDeploymentMoves(game, player);
	var movementMoves = this.getPossibleMovementMoves(game, player);

	return deploymentMoves.concat(movementMoves);
};

/**
 * Get all possible deployment moves
 */
TrifleAiHelp.prototype.getPossibleDeploymentMoves = function(game, player) {
	var moves = [];
	var tilePile = this.getTilePile(game, player);

	for (var i = 0; i < tilePile.length; i++) {
		var tile = tilePile[i];
		game.revealDeployPoints(tile, true);
		var endPoints = this.getPossibleMovePoints(game);

		for (var j = 0; j < endPoints.length; j++) {
			var notationBuilder = new OldTrifleNotationBuilder();
			notationBuilder.moveType = DEPLOY;
			notationBuilder.tileType = tile.code;
			notationBuilder.status = WAITING_FOR_ENDPOINT;

			var endPoint = endPoints[j];
			notationBuilder.endPoint = new NotationPoint(this.getNotation(endPoint));
			var move = notationBuilder.getNotationMove(this.moveNum, player);

			game.hidePossibleMovePoints(true);

			var isDuplicate = false;
			for (var x = 0; x < moves.length; x++) {
				if (moves[x].equals(move)) {
					isDuplicate = true;
					break;
				}
			}
			if (!isDuplicate && move && move.fullMoveText) {
				moves.push(move);
			}
		}
	}

	return moves;
};

/**
 * Get all possible movement moves
 */
TrifleAiHelp.prototype.getPossibleMovementMoves = function(game, player) {
	var moves = [];
	var startPoints = this.getMovementStartPoints(game, player);

	for (var i = 0; i < startPoints.length; i++) {
		var startPoint = startPoints[i];
		game.revealPossibleMovePoints(startPoint, true);
		var endPoints = this.getPossibleMovePoints(game);

		for (var j = 0; j < endPoints.length; j++) {
			var notationBuilder = new OldTrifleNotationBuilder();
			notationBuilder.moveType = MOVE;
			notationBuilder.startPoint = new NotationPoint(this.getNotation(startPoint));
			notationBuilder.status = WAITING_FOR_ENDPOINT;

			var endPoint = endPoints[j];
			notationBuilder.endPoint = new NotationPoint(this.getNotation(endPoint));
			var move = notationBuilder.getNotationMove(this.moveNum, player);

			game.hidePossibleMovePoints(true);

			var isDuplicate = false;
			for (var x = 0; x < moves.length; x++) {
				if (moves[x].equals(move)) {
					isDuplicate = true;
					break;
				}
			}

			if (!isDuplicate) {
				moves.push(move);
			}
		}
	}

	return moves;
};

/**
 * Get team selection move
 */
TrifleAiHelp.prototype.getTeamSelectionMove = function(game, player, selectedTileCodes) {
	var notationBuilder = new OldTrifleNotationBuilder();
	notationBuilder.moveType = TEAM_SELECTION;
	notationBuilder.teamSelection = selectedTileCodes.join(',');
	return notationBuilder.getNotationMove(0, player);
};

/**
 * Get all available tiles for team selection
 */
TrifleAiHelp.prototype.getAvailableTilesForTeamSelection = function() {
	var availableTiles = [];
	Object.keys(TrifleTileCodes).forEach(function(key) {
		var tileCode = TrifleTileCodes[key];
		var tileInfo = TrifleTiles[tileCode];
		if (tileInfo && tileInfo.available) {
			availableTiles.push(tileCode);
		}
	});
	return availableTiles;
};

/**
 * Get all banner tiles
 */
TrifleAiHelp.prototype.getBannerTiles = function() {
	return [
		TrifleTileCodes.AirBanner,
		TrifleTileCodes.WaterBanner,
		TrifleTileCodes.EarthBanner,
		TrifleTileCodes.FireBanner
	];
};

/**
 * Get tile pile for player
 */
TrifleAiHelp.prototype.getTilePile = function(game, player) {
	var tilePile = game.tileManager.hostTiles;
	if (player === GUEST) {
		tilePile = game.tileManager.guestTiles;
	}
	return tilePile;
};

/**
 * Get all points marked as possible moves
 */
TrifleAiHelp.prototype.getPossibleMovePoints = function(game) {
	var points = [];
	game.board.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				if (boardPoint.isType(POSSIBLE_MOVE)) {
					points.push(boardPoint);
				}
			}
		});
	});
	return points;
};

/**
 * Get notation string for a board point
 */
TrifleAiHelp.prototype.getNotation = function(boardPoint) {
	return new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString;
};

/**
 * Get all points with player's tiles that can potentially move
 */
TrifleAiHelp.prototype.getMovementStartPoints = function(game, player) {
	var points = [];
	for (var row = 0; row < game.board.cells.length; row++) {
		for (var col = 0; col < game.board.cells[row].length; col++) {
			var startPoint = game.board.cells[row][col];
			if (startPoint.hasTile() && startPoint.tile.ownerName === player) {
				points.push(game.board.cells[row][col]);
			}
		}
	}
	return points;
};

/**
 * Count tiles on board for a player
 */
TrifleAiHelp.prototype.countPlayerTiles = function(game, player) {
	var count = 0;
	game.board.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (boardPoint.hasTile() && boardPoint.tile.ownerName === player) {
				count++;
			}
		});
	});
	return count;
};

/**
 * Find the banner tile point for a player
 */
TrifleAiHelp.prototype.findBannerPoint = function(game, player) {
	var bannerPoint = null;
	var bannerCodes = this.getBannerTiles();

	game.board.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (boardPoint.hasTile() &&
				boardPoint.tile.ownerName === player &&
				bannerCodes.includes(boardPoint.tile.code)) {
				bannerPoint = boardPoint;
			}
		});
	});
	return bannerPoint;
};

/**
 * Calculate distance between two points
 */
TrifleAiHelp.prototype.getDistance = function(point1, point2) {
	return Math.abs(point1.row - point2.row) + Math.abs(point1.col - point2.col);
};

/**
 * Check if a tile is a banner
 */
TrifleAiHelp.prototype.isBannerTile = function(tileCode) {
	return this.getBannerTiles().includes(tileCode);
};

/**
 * Check if a tile is an animal (can capture)
 */
TrifleAiHelp.prototype.isAnimalTile = function(tileCode) {
	var tileInfo = TrifleTiles[tileCode];
	return tileInfo && tileInfo.types && tileInfo.types.includes('Animal');
};

/**
 * Check if a tile is a flower
 */
TrifleAiHelp.prototype.isFlowerTile = function(tileCode) {
	var tileInfo = TrifleTiles[tileCode];
	return tileInfo && tileInfo.types && tileInfo.types.includes('Flower');
};

/**
 * Get tiles by type for team selection
 */
TrifleAiHelp.prototype.getTilesByType = function(type) {
	var tiles = [];
	Object.keys(TrifleTileCodes).forEach(function(key) {
		var tileCode = TrifleTileCodes[key];
		var tileInfo = TrifleTiles[tileCode];
		if (tileInfo && tileInfo.available && tileInfo.types && tileInfo.types.includes(type)) {
			tiles.push(tileCode);
		}
	});
	return tiles;
};

/**
 * Get tiles by element identifier
 */
TrifleAiHelp.prototype.getTilesByElement = function(element) {
	var tiles = [];
	Object.keys(TrifleTileCodes).forEach(function(key) {
		var tileCode = TrifleTileCodes[key];
		var tileInfo = TrifleTiles[tileCode];
		if (tileInfo && tileInfo.available && tileInfo.identifiers && tileInfo.identifiers.includes(element)) {
			tiles.push(tileCode);
		}
	});
	return tiles;
};
