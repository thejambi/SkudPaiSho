/* Skud AI Help */


import { ACCENT_TILE, BASIC_FLOWER } from '../GameData';
import { simpleCanonRules } from '../skud-pai-sho/SkudPaiShoRules';
import {
  ARRANGING,
  GUEST,
  NotationPoint,
  PLANTING,
  RowAndColumn,
} from '../CommonNotationObjects';
import {
  NON_PLAYABLE,
  POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
  SkudPaiShoNotationBuilder,
  SkudPaiShoNotationMove,
} from '../skud-pai-sho/SkudPaiShoGameNotation';
import { WAITING_FOR_ENDPOINT } from '../GameConstants';

export class SkudAiHelp {
	constructor() {
	}

	getAllPossibleMoves(game, player, moveNum) {
		var moves = [];

		if (moveNum === 0) {
			/* First turn is Accent Tile selection */
			this.addAccentSelectionMoves(moves, game, player);
		} else {
			/* Get list of all Planting moves and all Arranging moves */
			this.addPlantMoves(moves, game, player, moveNum);
			this.addArrangeMoves(moves, game, player, moveNum);
		}

		return moves;
	}

	addAccentSelectionMoves(moves, game, player) {
		/* Status: Random, working
		*/
	
		var tilePile = this.getTilePile(game, player);
	
		var availableAccents = [];
	
		for (var i = 0; i < tilePile.length; i++) {
			if (tilePile[i].type === ACCENT_TILE) {
				availableAccents.push(tilePile[i]);
			}
		}
	
		// For now, get four random accent tiles
		var chosenAccents = [];
	
		var length = 4;
		if (simpleCanonRules) {
			length = 2;
		}
	
		for (var i = 0; i < length; i++) {
			var chosenIndex = Math.floor(Math.random() * availableAccents.length);
			var randomAccentTile = availableAccents.splice(chosenIndex, 1)[0];
			chosenAccents.push(randomAccentTile.code);
		}
	
		var move = new SkudPaiShoNotationMove("0" + player.charAt(0) + "." + chosenAccents.join());
		moves.push(move);
	}

	addPlantMoves(moves, game, player, moveNum) {
		if (!this.isOpenGate(game)) {
			return;
		}
	
		var tilePile = this.getTilePile(game, player);
	
		// For each tile in player's tile reserve ("tile pile"), build Planting moves
		for (var i = 0; i < tilePile.length; i++) {
			var tile = tilePile[i];
			if (tile.type === BASIC_FLOWER) {
				// For each basic flower
				// Get possible plant points
				var convertedMoveNum = moveNum * 2;
				game.revealOpenGates(player, tile, convertedMoveNum, true);
				var endPoints = this.getPossibleMovePoints(game);
	
				for (var j = 0; j < endPoints.length; j++) {
					var notationBuilder = new SkudPaiShoNotationBuilder();
					notationBuilder.moveType = PLANTING;
	
					notationBuilder.plantedFlowerType = tile.code;
					notationBuilder.status = WAITING_FOR_ENDPOINT;
	
					var endPoint = endPoints[j];
	
					notationBuilder.endPoint = new NotationPoint(this.getNotation(endPoint));
					var move = notationBuilder.getNotationMove(moveNum, player);
	
					game.hidePossibleMovePoints(true);
	
					var isDuplicate = false;
					for (var x = 0; x < moves.length; x++) {
						if (moves[x].equals(move)) {
							isDuplicate = true;
						}
					}
	
					if (!isDuplicate) {
						moves.push(move);
					}
				}
			}
		}
	}

	addArrangeMoves(moves, game, player, moveNum) {
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
				var move = notationBuilder.getNotationMove(moveNum, player);
	
				game.hidePossibleMovePoints(true);
	
				var isDuplicate = false;
				for (var x = 0; x < moves.length; x++) {
					if (moves[x].equals(move)) {
						isDuplicate = true;
					}
				}
	
				if (!isDuplicate) {
					moves.push(move);
				}
			}
		}
	}

	getTilePile(game, player) {
		var tilePile = game.tileManager.hostTiles;
		if (player === GUEST) {
			tilePile = game.tileManager.guestTiles;
		}
		return tilePile;
	}

	getStartPoints(game, player) {
		var points = [];
		for (var row = 0; row < game.board.cells.length; row++) {
			for (var col = 0; col < game.board.cells[row].length; col++) {
				var startPoint = game.board.cells[row][col];
				if (startPoint.hasTile()
					&& startPoint.tile.ownerName === player
					&& startPoint.tile.type !== ACCENT_TILE
					&& !(startPoint.tile.drained || startPoint.tile.trapped)) {
					
					points.push(game.board.cells[row][col]);
				}
			}
		}
		return points;
	}

	getPossibleMovePoints(game) {
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
	}

	isOpenGate(game) {
		var cells = game.board.cells;
		for (var row = 0; row < cells.length; row++) {
			for (var col = 0; col < cells[row].length; col++) {
				if (cells[row][col].isOpenGate()) {
					return true;
				}
			}
		}
	}

	getNotation(boardPoint) {
		return new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString;
	}

}
