/* Nick Pai Sho Strategic AI */

import { GUEST, HOST, MOVE, NotationPoint, RowAndColumn } from '../../CommonNotationObjects';
import { getOpponentName } from '../../pai-sho-common/PaiShoPlayerHelp';
import { NickTileCodes } from '../NickTiles';
import { NickAiHelp } from './NickAiHelp';
import { NON_PLAYABLE } from '../../skud-pai-sho/SkudPaiShoBoardPoint';

export class NickStrategicAI {
	constructor() {
		this.aiHelp = new NickAiHelp();
		this.player = null;

		// Tile values for material evaluation
		this.tileValues = {
			[NickTileCodes.WhiteLotus]: 10000,  // Can't be captured, but extremely important
			[NickTileCodes.Avatar]: 150,        // Very powerful but vulnerable
			[NickTileCodes.Air]: 50,
			[NickTileCodes.Water]: 50,
			[NickTileCodes.Earth]: 50,
			[NickTileCodes.Fire]: 50
		};

		// Capture relationships (Avatar cycle)
		// capturer -> what it can capture
		this.captureTargets = {
			[NickTileCodes.Air]: [NickTileCodes.Water, NickTileCodes.Avatar],
			[NickTileCodes.Water]: [NickTileCodes.Earth, NickTileCodes.Avatar],
			[NickTileCodes.Earth]: [NickTileCodes.Fire, NickTileCodes.Avatar],
			[NickTileCodes.Fire]: [NickTileCodes.Air, NickTileCodes.Avatar],
			[NickTileCodes.Avatar]: [NickTileCodes.Air, NickTileCodes.Water, NickTileCodes.Earth, NickTileCodes.Fire, NickTileCodes.Avatar]
		};

		// What can capture each tile
		this.capturedBy = {
			[NickTileCodes.Air]: [NickTileCodes.Fire, NickTileCodes.Avatar],
			[NickTileCodes.Water]: [NickTileCodes.Air, NickTileCodes.Avatar],
			[NickTileCodes.Earth]: [NickTileCodes.Water, NickTileCodes.Avatar],
			[NickTileCodes.Fire]: [NickTileCodes.Earth, NickTileCodes.Avatar],
			[NickTileCodes.Avatar]: [NickTileCodes.Air, NickTileCodes.Water, NickTileCodes.Earth, NickTileCodes.Fire, NickTileCodes.Avatar]
		};

		// Evaluation weights
		this.weights = {
			materialValue: 1.0,
			lotusDistanceToCenter: 50,      // Per point closer to center
			lotusInCheck: -5000,            // Very bad to leave Lotus in check
			opponentLotusInCheck: 3000,     // Good to put opponent in check
			lotusNearCenter: 200,           // Bonus for being close to center
			lotusThreatened: -800,          // Lotus is adjacent to enemy tile
			centerControl: 30,              // Controlling center area
			protectingLotus: 100,           // Friendly tiles near Lotus
			captureBonus: 1.2,              // Multiplier for captures
			avoidCapture: -80,              // Penalty for moving into capture range
			avatarNearEnemyLotus: 150,      // Avatar threatening enemy Lotus
			mobilityBonus: 5                // More moves = better position
		};
	}

	getName() {
		return "Nick Strategic AI";
	}

	getMessage() {
		return "A strategic AI that evaluates board positions based on Lotus safety, center control, material advantage, and the Avatar cycle. It prioritizes advancing the Lotus toward the center while keeping it protected.";
	}

	setPlayer(playerName) {
		this.player = playerName;
	}

	getMove(game, moveNum) {
		this.aiHelp.moveNum = moveNum;
		const moves = this.aiHelp.getAllPossibleMoves(game, this.player);

		if (!moves || moves.length === 0) {
			return null;
		}

		let bestMove = null;
		let bestScore = -Infinity;
		const opponent = getOpponentName(this.player);

		for (let i = 0; i < moves.length; i++) {
			const move = moves[i];

			// Check for immediate win (Lotus to center)
			if (this.isWinningMove(game, move)) {
				return move;
			}

			// Simulate move and evaluate
			const gameCopy = game.getCopy();
			gameCopy.runNotationMove(move);

			let score = this.evaluatePosition(gameCopy, this.player, opponent);

			// Add move-specific bonuses
			score += this.evaluateMoveSpecifics(game, move, this.player, opponent);

			// Small randomness for variety (but less than Vagabond AI)
			score += Math.random() * 3;

			if (score > bestScore) {
				bestScore = score;
				bestMove = move;
			}
		}

		return bestMove || moves[0];
	}

	evaluatePosition(game, player, opponent) {
		let score = 0;
		const board = game.board;

		// Check for win/loss
		if (game.winners && game.winners.includes(player)) {
			return 100000;
		}
		if (game.winners && game.winners.includes(opponent)) {
			return -100000;
		}

		// Get all tiles on board
		const myTiles = this.getTilesOnBoard(board, player);
		const oppTiles = this.getTilesOnBoard(board, opponent);

		// Material counting
		for (let i = 0; i < myTiles.length; i++) {
			const tile = myTiles[i].tile;
			score += (this.tileValues[tile.code] || 0) * this.weights.materialValue;
		}

		for (let i = 0; i < oppTiles.length; i++) {
			const tile = oppTiles[i].tile;
			score -= (this.tileValues[tile.code] || 0) * this.weights.materialValue;
		}

		// Lotus evaluation
		const myLotusPoint = this.findTileOnBoard(board, player, NickTileCodes.WhiteLotus);
		const oppLotusPoint = this.findTileOnBoard(board, opponent, NickTileCodes.WhiteLotus);

		if (myLotusPoint) {
			// Distance to center (0,0 in game coords)
			const rowAndCol = new RowAndColumn(myLotusPoint.row, myLotusPoint.col);
			const distanceToCenter = Math.abs(rowAndCol.x) + Math.abs(rowAndCol.y);

			// Closer to center is better
			score += (14 - distanceToCenter) * this.weights.lotusDistanceToCenter;

			// Bonus for being very close to center
			if (distanceToCenter <= 2) {
				score += this.weights.lotusNearCenter * (3 - distanceToCenter);
			}

			// Check if Lotus is in check (very bad)
			if (myLotusPoint.lotusInCheck) {
				score += this.weights.lotusInCheck;
			}

			// Check for threats to Lotus (adjacent enemy tiles)
			const surrounding = board.getSurroundingBoardPoints(myLotusPoint);
			let protectingTiles = 0;
			for (let i = 0; i < surrounding.length; i++) {
				const sp = surrounding[i];
				if (sp.hasTile()) {
					if (sp.tile.ownerName === opponent) {
						score += this.weights.lotusThreatened;
					} else {
						protectingTiles++;
					}
				}
			}
			score += protectingTiles * this.weights.protectingLotus;
		}

		if (oppLotusPoint) {
			// Distance to center for opponent
			const oppRowAndCol = new RowAndColumn(oppLotusPoint.row, oppLotusPoint.col);
			const oppDistanceToCenter = Math.abs(oppRowAndCol.x) + Math.abs(oppRowAndCol.y);

			// Opponent farther from center is better for us
			score += oppDistanceToCenter * (this.weights.lotusDistanceToCenter / 2);

			// Check if opponent Lotus is in check (good for us!)
			if (oppLotusPoint.lotusInCheck) {
				score += this.weights.opponentLotusInCheck;
			}

			// Avatar near enemy Lotus is good
			const myAvatar = this.findTileOnBoard(board, player, NickTileCodes.Avatar);
			if (myAvatar) {
				const avatarRowAndCol = new RowAndColumn(myAvatar.row, myAvatar.col);
				const distToOppLotus = Math.abs(avatarRowAndCol.x - oppRowAndCol.x) +
									   Math.abs(avatarRowAndCol.y - oppRowAndCol.y);
				if (distToOppLotus <= 2) {
					score += this.weights.avatarNearEnemyLotus * (3 - distToOppLotus);
				}
			}
		}

		// Center control bonus
		score += this.evaluateCenterControl(board, player, opponent);

		// Mobility bonus (having more possible moves is good)
		const myMobility = this.countPossibleMoves(game, player);
		const oppMobility = this.countPossibleMoves(game, opponent);
		score += (myMobility - oppMobility) * this.weights.mobilityBonus;

		return score;
	}

	evaluateMoveSpecifics(game, move, player, opponent) {
		let score = 0;
		const board = game.board;

		if (move.moveType !== MOVE) {
			return score;
		}

		const startRowAndCol = new NotationPoint(move.startPoint).rowAndColumn;
		const endRowAndCol = new NotationPoint(move.endPoint).rowAndColumn;

		const startBp = board.cells[startRowAndCol.row][startRowAndCol.col];
		const endBp = board.cells[endRowAndCol.row][endRowAndCol.col];

		if (!startBp.hasTile()) {
			return score;
		}

		const movingTile = startBp.tile;
		const tileCode = movingTile.code;

		// Moving Lotus toward center
		if (tileCode === NickTileCodes.WhiteLotus) {
			const startGameCoords = new RowAndColumn(startRowAndCol.row, startRowAndCol.col);
			const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);

			const startDist = Math.abs(startGameCoords.x) + Math.abs(startGameCoords.y);
			const endDist = Math.abs(endGameCoords.x) + Math.abs(endGameCoords.y);

			if (endDist < startDist) {
				score += 200; // Moving Lotus closer to center
			} else if (endDist > startDist) {
				score -= 50; // Moving Lotus away from center (sometimes needed for safety)
			}

			// Check if moving into danger
			const endSurrounding = board.getSurroundingBoardPoints(endBp);
			for (let i = 0; i < endSurrounding.length; i++) {
				const sp = endSurrounding[i];
				if (sp.hasTile() && sp.tile.ownerName === opponent) {
					score -= 500; // Moving Lotus next to enemy is bad
				}
			}
		}

		// Capture evaluation
		if (endBp.hasTile() && endBp.tile.ownerName === opponent) {
			const capturedCode = endBp.tile.code;
			// Check if this tile can actually capture
			if (this.canCapture(tileCode, capturedCode)) {
				score += (this.tileValues[capturedCode] || 0) * this.weights.captureBonus;

				// Extra bonus for capturing Avatar
				if (capturedCode === NickTileCodes.Avatar) {
					score += 100;
				}
			}
		}

		// Check if moving into capture range
		if (tileCode !== NickTileCodes.WhiteLotus) {
			const endSurrounding = board.getSurroundingBoardPoints(endBp);
			for (let i = 0; i < endSurrounding.length; i++) {
				const sp = endSurrounding[i];
				if (sp.hasTile() && sp.tile.ownerName === opponent) {
					if (this.canCapture(sp.tile.code, tileCode)) {
						// We're moving into a spot where we can be captured
						score += this.weights.avoidCapture;

						// But if we're capturing something valuable, it might be worth it
						if (endBp.hasTile() && endBp.tile.ownerName === opponent) {
							const capturedValue = this.tileValues[endBp.tile.code] || 0;
							const ourValue = this.tileValues[tileCode] || 0;
							if (capturedValue >= ourValue) {
								score += 60; // Trade is acceptable
							}
						}
					}
				}
			}
		}

		// Putting opponent Lotus in check (threatening move)
		const oppLotusPoint = this.findTileOnBoard(board, opponent, NickTileCodes.WhiteLotus);
		if (oppLotusPoint) {
			const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);
			const oppLotusGameCoords = new RowAndColumn(oppLotusPoint.row, oppLotusPoint.col);

			const distToOppLotus = Math.abs(endGameCoords.x - oppLotusGameCoords.x) +
								   Math.abs(endGameCoords.y - oppLotusGameCoords.y);

			// Adjacent to opponent Lotus
			if (distToOppLotus === 1) {
				score += 500; // We're putting the Lotus in check!
			} else if (distToOppLotus === 2) {
				score += 100; // Getting close to threatening the Lotus
			}
		}

		// Moving to protect our Lotus
		const myLotusPoint = this.findTileOnBoard(board, player, NickTileCodes.WhiteLotus);
		if (myLotusPoint && tileCode !== NickTileCodes.WhiteLotus) {
			const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);
			const myLotusGameCoords = new RowAndColumn(myLotusPoint.row, myLotusPoint.col);

			const distToMyLotus = Math.abs(endGameCoords.x - myLotusGameCoords.x) +
								  Math.abs(endGameCoords.y - myLotusGameCoords.y);

			// Moving to be adjacent to our Lotus (protective)
			if (distToMyLotus === 1 && myLotusPoint.lotusInCheck) {
				score += 200; // Helping protect Lotus when it's in check
			}
		}

		return score;
	}

	isWinningMove(game, move) {
		if (move.moveType !== MOVE) {
			return false;
		}

		const board = game.board;
		const startRowAndCol = new NotationPoint(move.startPoint).rowAndColumn;
		const endRowAndCol = new NotationPoint(move.endPoint).rowAndColumn;

		const startBp = board.cells[startRowAndCol.row][startRowAndCol.col];

		if (!startBp.hasTile()) {
			return false;
		}

		// Check if we're moving our Lotus to the center
		if (startBp.tile.code === NickTileCodes.WhiteLotus &&
			startBp.tile.ownerName === this.player) {
			const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);
			if (endGameCoords.x === 0 && endGameCoords.y === 0) {
				return true; // Winning move!
			}
		}

		return false;
	}

	canCapture(attackerCode, defenderCode) {
		if (defenderCode === NickTileCodes.WhiteLotus) {
			return false; // Lotus cannot be captured, only put in check
		}
		const targets = this.captureTargets[attackerCode];
		return targets && targets.includes(defenderCode);
	}

	// Helper methods
	findTileOnBoard(board, player, tileCode) {
		for (let row = 0; row < board.cells.length; row++) {
			for (let col = 0; col < board.cells[row].length; col++) {
				const bp = board.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player && bp.tile.code === tileCode) {
					return bp;
				}
			}
		}
		return null;
	}

	findAllTilesOnBoard(board, player, tileCodes) {
		const points = [];
		for (let row = 0; row < board.cells.length; row++) {
			for (let col = 0; col < board.cells[row].length; col++) {
				const bp = board.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player && tileCodes.includes(bp.tile.code)) {
					points.push(bp);
				}
			}
		}
		return points;
	}

	getTilesOnBoard(board, player) {
		const points = [];
		for (let row = 0; row < board.cells.length; row++) {
			for (let col = 0; col < board.cells[row].length; col++) {
				const bp = board.cells[row][col];
				if (!bp.isType(NON_PLAYABLE) && bp.hasTile() && bp.tile.ownerName === player) {
					points.push(bp);
				}
			}
		}
		return points;
	}

	evaluateCenterControl(board, player, opponent) {
		let score = 0;

		// Check tiles in the center region (within 3 of center)
		for (let row = 0; row < board.cells.length; row++) {
			for (let col = 0; col < board.cells[row].length; col++) {
				const bp = board.cells[row][col];
				if (!bp.isType(NON_PLAYABLE) && bp.hasTile()) {
					const gameCoords = new RowAndColumn(row, col);
					const distFromCenter = Math.abs(gameCoords.x) + Math.abs(gameCoords.y);

					if (distFromCenter <= 3) {
						if (bp.tile.ownerName === player) {
							score += this.weights.centerControl * (4 - distFromCenter);
						} else {
							score -= this.weights.centerControl * (4 - distFromCenter) * 0.5;
						}
					}
				}
			}
		}

		return score;
	}

	countPossibleMoves(game, player) {
		// This is a simplified mobility count
		let count = 0;
		const board = game.board;

		for (let row = 0; row < board.cells.length; row++) {
			for (let col = 0; col < board.cells[row].length; col++) {
				const bp = board.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player) {
					// Estimate moves based on surrounding empty spaces
					const surrounding = board.getSurroundingBoardPoints(bp);
					for (let i = 0; i < surrounding.length; i++) {
						if (!surrounding[i].hasTile()) {
							count++;
						}
					}
				}
			}
		}

		return count;
	}
}
