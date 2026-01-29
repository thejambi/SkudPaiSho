/* Vagabond Strategic AI */

import { DEPLOY, GUEST, HOST, MOVE } from '../../CommonNotationObjects';
import { getOpponentName } from '../../pai-sho-common/PaiShoPlayerHelp';
import { VagabondTileCodes } from '../VagabondTile';
import { VagabondAiHelp } from './VagabondAiHelp';
import { NON_PLAYABLE } from '../../skud-pai-sho/SkudPaiShoBoardPoint';

export class VagabondStrategicAI {
	constructor() {
		this.aiHelp = new VagabondAiHelp();
		this.player = null;

		// Tile values for material evaluation
		this.tileValues = {
			[VagabondTileCodes.Lotus]: 1000,
			[VagabondTileCodes.SkyBison]: 80,
			[VagabondTileCodes.FlyingLemur]: 70,
			[VagabondTileCodes.Dragon]: 75,
			[VagabondTileCodes.Wheel]: 65,
			[VagabondTileCodes.Badgermole]: 45,
			[VagabondTileCodes.Chrysanthemum]: 30,
			[VagabondTileCodes.FireLily]: 25
		};

		// Evaluation weights
		this.weights = {
			materialValue: 1.0,
			lotusProtection: 500,
			lotusExposed: -400,
			lotusThreat: 300,
			dragonFireLilySynergy: 100,
			bisonBlocked: -150,
			opponentBisonBlocked: 150,
			protectedFlowers: 40,
			captureBonus: 0.8,
			centerBonus: 3
		};
	}

	getName() {
		return "Vagabond Strategic AI";
	}

	getMessage() {
		return "A strategic AI that evaluates positions based on Lotus safety, capture threats, piece synergies, and board control. A challenging opponent for intermediate players.";
	}

	setPlayer(playerName) {
		this.player = playerName;
	}

	getMove(game, moveNum) {
		this.aiHelp.moveNum = moveNum;
		var moves = this.aiHelp.getAllPossibleMoves(game, this.player);

		if (!moves || moves.length === 0) {
			return null;
		}

		var bestMove = null;
		var bestScore = -Infinity;
		var opponent = getOpponentName(this.player);

		for (var i = 0; i < moves.length; i++) {
			var move = moves[i];

			// Check for immediate win
			if (this.isWinningMove(game, move)) {
				return move;
			}

			// Simulate move and evaluate
			var gameCopy = game.getCopy();
			gameCopy.runNotationMove(move);

			var score = this.evaluatePosition(gameCopy, this.player, opponent);

			// Add move-specific bonuses
			score += this.evaluateMoveSpecifics(game, move, this.player, opponent);

			// Small randomness for variety
			score += Math.random() * 5;

			if (score > bestScore) {
				bestScore = score;
				bestMove = move;
			}
		}

		return bestMove || moves[0];
	}

	evaluatePosition(game, player, opponent) {
		var score = 0;
		var board = game.board;

		// Check for win/loss
		if (board.winners.includes(player)) {
			return 100000;
		}
		if (board.winners.includes(opponent)) {
			return -100000;
		}

		// Material counting
		var myTiles = this.getTilesOnBoard(board, player);
		var oppTiles = this.getTilesOnBoard(board, opponent);

		for (var i = 0; i < myTiles.length; i++) {
			var tile = myTiles[i].tile;
			score += (this.tileValues[tile.code] || 0) * this.weights.materialValue;
			score += this.calculateCenterBonus(myTiles[i]);
		}

		for (var i = 0; i < oppTiles.length; i++) {
			var tile = oppTiles[i].tile;
			score -= (this.tileValues[tile.code] || 0) * this.weights.materialValue;
		}

		// Lotus safety
		var myLotusPoint = this.findTileOnBoard(board, player, VagabondTileCodes.Lotus);
		var oppLotusPoint = this.findTileOnBoard(board, opponent, VagabondTileCodes.Lotus);

		if (myLotusPoint) {
			if (myLotusPoint.tile.protected) {
				score += this.weights.lotusProtection;
			}
			if (this.canBeCapturedByOpponent(board, myLotusPoint, player, opponent)) {
				score += this.weights.lotusExposed;
			}
		}

		if (oppLotusPoint) {
			if (!oppLotusPoint.tile.protected && this.canCaptureOpponentLotus(board, oppLotusPoint, player)) {
				score += this.weights.lotusThreat;
			}
		}

		// Dragon-Fire Lily synergy
		var myFireLily = this.findTileOnBoard(board, player, VagabondTileCodes.FireLily);
		var myDragon = this.findTileOnBoard(board, player, VagabondTileCodes.Dragon);

		if (myFireLily && myDragon) {
			score += this.weights.dragonFireLilySynergy;
		}

		// Bison blocking
		var myBisons = this.findAllTilesOnBoard(board, player, [VagabondTileCodes.SkyBison, VagabondTileCodes.FlyingLemur]);
		var oppBisons = this.findAllTilesOnBoard(board, opponent, [VagabondTileCodes.SkyBison, VagabondTileCodes.FlyingLemur]);

		for (var i = 0; i < myBisons.length; i++) {
			if (myBisons[i].tile.blocked) {
				score += this.weights.bisonBlocked;
			}
		}

		for (var i = 0; i < oppBisons.length; i++) {
			if (oppBisons[i].tile.blocked) {
				score += this.weights.opponentBisonBlocked;
			}
		}

		// Protected flowers
		var protectedCount = this.countProtectedFlowers(board, player);
		score += protectedCount * this.weights.protectedFlowers;

		return score;
	}

	evaluateMoveSpecifics(game, move, player, opponent) {
		var score = 0;
		var board = game.board;

		if (move.moveType === DEPLOY) {
			var tileCode = move.tileType;
			var endPoint = move.endPoint.rowAndColumn;

			// Lotus deployment evaluation
			if (tileCode === VagabondTileCodes.Lotus) {
				var hasAdjacentBadgermole = this.hasAdjacentFriendlyTile(board, endPoint, player, VagabondTileCodes.Badgermole);
				if (hasAdjacentBadgermole) {
					score += 200; // Protected deployment
				} else {
					score -= 100; // Exposed deployment
				}

				// Penalize early Lotus deployment without Badgermole on board
				var myBadgermoles = this.findAllTilesOnBoard(board, player, [VagabondTileCodes.Badgermole]);
				if (myBadgermoles.length === 0) {
					score -= 150;
				}
			}

			// Fire Lily positioning (prefer central for Dragon coverage)
			if (tileCode === VagabondTileCodes.FireLily) {
				var distFromCenter = Math.abs(endPoint.row - 8) + Math.abs(endPoint.col - 8);
				score += (16 - distFromCenter) * 3;
			}

			// Chrysanthemum placement (bonus if adjacent to enemy Bison)
			if (tileCode === VagabondTileCodes.Chrysanthemum) {
				var oppBisons = this.findAllTilesOnBoard(board, opponent, [VagabondTileCodes.SkyBison, VagabondTileCodes.FlyingLemur]);
				for (var i = 0; i < oppBisons.length; i++) {
					var dist = Math.abs(endPoint.row - oppBisons[i].row) + Math.abs(endPoint.col - oppBisons[i].col);
					if (dist === 1) {
						score += 200; // Adjacent - will block it!
					} else if (dist <= 3) {
						score += 30;
					}
				}
			}

			// Badgermole deployment (near Lotus or flowers)
			if (tileCode === VagabondTileCodes.Badgermole) {
				var myLotus = this.findTileOnBoard(board, player, VagabondTileCodes.Lotus);
				if (myLotus) {
					var dist = Math.abs(endPoint.row - myLotus.row) + Math.abs(endPoint.col - myLotus.col);
					if (dist === 1) {
						score += 250; // Adjacent to Lotus - protects it!
					} else if (dist <= 3) {
						score += 50;
					}
				}
			}
		} else if (move.moveType === MOVE) {
			var startPoint = move.startPoint.rowAndColumn;
			var endPoint = move.endPoint.rowAndColumn;
			var startBp = board.cells[startPoint.row][startPoint.col];

			if (!startBp.hasTile()) {
				return score;
			}

			var tileCode = startBp.tile.code;

			// Badgermole movement to protect Lotus
			if (tileCode === VagabondTileCodes.Badgermole) {
				var myLotus = this.findTileOnBoard(board, player, VagabondTileCodes.Lotus);
				if (myLotus && !myLotus.tile.protected) {
					var dist = Math.abs(endPoint.row - myLotus.row) + Math.abs(endPoint.col - myLotus.col);
					if (dist === 1) {
						score += 250; // Will protect Lotus
					}
				}
			}

			// Bison/Dragon movement towards opponent Lotus
			if ([VagabondTileCodes.SkyBison, VagabondTileCodes.FlyingLemur, VagabondTileCodes.Dragon].includes(tileCode)) {
				var oppLotus = this.findTileOnBoard(board, opponent, VagabondTileCodes.Lotus);
				if (oppLotus && !oppLotus.tile.protected) {
					var moveRange = tileCode === VagabondTileCodes.SkyBison ? 6 : 5;
					var dist = Math.abs(endPoint.row - oppLotus.row) + Math.abs(endPoint.col - oppLotus.col);
					if (dist <= moveRange) {
						score += 300; // Can capture Lotus next turn
					}
				}
			}

			// Capture bonus
			var endBp = board.cells[endPoint.row][endPoint.col];
			if (endBp.hasTile() && endBp.tile.ownerName !== player) {
				score += (this.tileValues[endBp.tile.code] || 0) * this.weights.captureBonus;
			}
		}

		return score;
	}

	isWinningMove(game, move) {
		if (move.moveType !== MOVE) {
			return false;
		}

		var board = game.board;
		var startPoint = move.startPoint.rowAndColumn;
		var endPoint = move.endPoint.rowAndColumn;

		var startBp = board.cells[startPoint.row][startPoint.col];
		var endBp = board.cells[endPoint.row][endPoint.col];

		if (!startBp.hasTile() || !endBp.hasTile()) {
			return false;
		}

		// Check if capturing opponent's Lotus
		return endBp.tile.code === VagabondTileCodes.Lotus &&
			   endBp.tile.ownerName !== this.player &&
			   startBp.tile.hasCaptureAbility();
	}

	// Helper methods
	findTileOnBoard(board, player, tileCode) {
		for (var row = 0; row < board.cells.length; row++) {
			for (var col = 0; col < board.cells[row].length; col++) {
				var bp = board.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player && bp.tile.code === tileCode) {
					return bp;
				}
			}
		}
		return null;
	}

	findAllTilesOnBoard(board, player, tileCodes) {
		var points = [];
		for (var row = 0; row < board.cells.length; row++) {
			for (var col = 0; col < board.cells[row].length; col++) {
				var bp = board.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player && tileCodes.includes(bp.tile.code)) {
					points.push(bp);
				}
			}
		}
		return points;
	}

	getTilesOnBoard(board, player) {
		var points = [];
		for (var row = 0; row < board.cells.length; row++) {
			for (var col = 0; col < board.cells[row].length; col++) {
				var bp = board.cells[row][col];
				if (!bp.isType(NON_PLAYABLE) && bp.hasTile() && bp.tile.ownerName === player) {
					points.push(bp);
				}
			}
		}
		return points;
	}

	hasAdjacentFriendlyTile(board, rowAndCol, player, tileCode) {
		var adjacentPoints = board.getAdjacentRowAndCols(rowAndCol);
		for (var i = 0; i < adjacentPoints.length; i++) {
			var bp = adjacentPoints[i];
			if (bp.hasTile() && bp.tile.ownerName === player && bp.tile.code === tileCode) {
				return true;
			}
		}
		return false;
	}

	canBeCapturedByOpponent(board, targetPoint, player, opponent) {
		// Check if any opponent capture piece can reach this point
		var oppCaptureTiles = this.findAllTilesOnBoard(board, opponent,
			[VagabondTileCodes.SkyBison, VagabondTileCodes.FlyingLemur, VagabondTileCodes.Wheel, VagabondTileCodes.Dragon]);

		for (var i = 0; i < oppCaptureTiles.length; i++) {
			var bp = oppCaptureTiles[i];
			if (bp.tile.blocked) {
				continue;
			}
			if (board.canMoveTileToPoint(opponent, bp, targetPoint)) {
				return true;
			}
		}
		return false;
	}

	canCaptureOpponentLotus(board, lotusPoint, player) {
		var myCaptureTiles = this.findAllTilesOnBoard(board, player,
			[VagabondTileCodes.SkyBison, VagabondTileCodes.FlyingLemur, VagabondTileCodes.Wheel, VagabondTileCodes.Dragon]);

		for (var i = 0; i < myCaptureTiles.length; i++) {
			var bp = myCaptureTiles[i];
			if (bp.tile.blocked) {
				continue;
			}
			if (board.canMoveTileToPoint(player, bp, lotusPoint)) {
				return true;
			}
		}
		return false;
	}

	countProtectedFlowers(board, player) {
		var count = 0;
		for (var row = 0; row < board.cells.length; row++) {
			for (var col = 0; col < board.cells[row].length; col++) {
				var bp = board.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player && bp.tile.isFlowerTile() && bp.tile.protected) {
					count++;
				}
			}
		}
		return count;
	}

	calculateCenterBonus(boardPoint) {
		var distFromCenter = Math.abs(boardPoint.row - 8) + Math.abs(boardPoint.col - 8);
		return Math.max(0, (16 - distFromCenter)) * this.weights.centerBonus / 16;
	}
}
