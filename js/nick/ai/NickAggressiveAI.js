/* Nick Pai Sho Aggressive AI */

import { GUEST, HOST, MOVE, NotationPoint, RowAndColumn } from '../../CommonNotationObjects';
import { getOpponentName } from '../../pai-sho-common/PaiShoPlayerHelp';
import { NickTileCodes } from '../NickTiles';
import { NickAiHelp } from './NickAiHelp';
import { NON_PLAYABLE } from '../../skud-pai-sho/SkudPaiShoBoardPoint';

export class NickAggressiveAI {
	constructor() {
		this.aiHelp = new NickAiHelp();
		this.player = null;

		// Tile values for material evaluation
		this.tileValues = {
			[NickTileCodes.WhiteLotus]: 10000,  // Still valuable but not as sacred
			[NickTileCodes.Avatar]: 150,        // Very powerful, high priority
			[NickTileCodes.Air]: 50,
			[NickTileCodes.Water]: 50,
			[NickTileCodes.Earth]: 50,
			[NickTileCodes.Fire]: 50
		};

		// Capture relationships (Avatar cycle)
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

		// Evaluation weights - AGGRESSIVE FOCUS
		this.weights = {
			materialValue: 0.8,							// Captures are valued, but not at the expense of aggression
			lotusDistanceToCenter: 20,					// Still want to advance, but not paramount
			lotusInCheck: -1000,						// Less catastrophic - willing to take risks
			opponentLotusInCheck: 8000,					// HUGE BONUS - pinning opponent is critical
			lotusNearCenter: 50,						// Bonus is reduced
			lotusThreatened: -200,						// Much less scary - accept risks
			centerControl: 15,							// Low priority
			protectingLotus: 20,						// Minimal - focus on attack not defense
			captureBonus: 2.0,							// DOUBLED - captures are highly rewarded
			avoidCapture: -20,							// Low penalty - willing to take risks
			avatarNearEnemyLotus: 500,					// TRIPLED - aggressive Avatar positioning
			mobilityBonus: 3,							// Still valuable but not as important
			aggressiveAdvance: 400,						// NEW: Bonus for moving toward enemy Lotus
			captureAnyTile: 150,						// NEW: Bonus for any capture
			elementCycleAdvantage: 80,					// NEW: Bonus for favorable matchups
			threatMultiplier: 1.5						// NEW: Threat posture is more valuable
		};
	}

	getName() {
		return "Nick Aggressive AI";
	}

	getMessage() {
		return "An aggressive AI that prioritizes attacking, capturing tiles, and threatening the opponent's Lotus. Plays offensively with high-risk moves and pursues material advantage through capture chains.";
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

			// Higher randomness for variety (more human-like)
			score += Math.random() * 10;

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

		// Material counting - less important for aggressive play
		for (let i = 0; i < myTiles.length; i++) {
			const tile = myTiles[i].tile;
			score += (this.tileValues[tile.code] || 0) * this.weights.materialValue;
		}

		for (let i = 0; i < oppTiles.length; i++) {
			const tile = oppTiles[i].tile;
			score -= (this.tileValues[tile.code] || 0) * this.weights.materialValue;
		}

		// Lotus evaluation - less defensive focus
		const myLotusPoint = this.findTileOnBoard(board, player, NickTileCodes.WhiteLotus);
		const oppLotusPoint = this.findTileOnBoard(board, opponent, NickTileCodes.WhiteLotus);

		if (myLotusPoint) {
			// Distance to center - less important
			const rowAndCol = new RowAndColumn(myLotusPoint.row, myLotusPoint.col);
			const distanceToCenter = Math.abs(rowAndCol.x) + Math.abs(rowAndCol.y);

			score += (14 - distanceToCenter) * this.weights.lotusDistanceToCenter;

			// Less emphasis on being very close to center
			if (distanceToCenter <= 2) {
				score += this.weights.lotusNearCenter;
			}

			// Check if Lotus is in check - much less catastrophic
			if (myLotusPoint.lotusInCheck) {
				score += this.weights.lotusInCheck;
			}

			// Check for threats to Lotus - aggressive players accept threats
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

			// Opponent farther from center is somewhat good
			score += oppDistanceToCenter * (this.weights.lotusDistanceToCenter / 4);

			// Check if opponent Lotus is in check - VERY GOOD for us!
			if (oppLotusPoint.lotusInCheck) {
				score += this.weights.opponentLotusInCheck;
			}

			// Avatar near enemy Lotus is VERY good - aggressive priority
			const myAvatar = this.findTileOnBoard(board, player, NickTileCodes.Avatar);
			if (myAvatar) {
				const avatarRowAndCol = new RowAndColumn(myAvatar.row, myAvatar.col);
				const distToOppLotus = Math.abs(avatarRowAndCol.x - oppRowAndCol.x) +
									   Math.abs(avatarRowAndCol.y - oppRowAndCol.y);
				if (distToOppLotus <= 3) {
					score += this.weights.avatarNearEnemyLotus * (4 - Math.min(distToOppLotus, 3));
				}
			}

			// Aggressive advance - multiple tiles near enemy Lotus is good
			let tilesNearOppLotus = 0;
			for (let i = 0; i < myTiles.length; i++) {
				const tileRowAndCol = new RowAndColumn(myTiles[i].row, myTiles[i].col);
				const distToOppLotus = Math.abs(tileRowAndCol.x - oppRowAndCol.x) +
									   Math.abs(tileRowAndCol.y - oppRowAndCol.y);
				if (distToOppLotus <= 2) {
					tilesNearOppLotus++;
				}
			}
			score += tilesNearOppLotus * 150; // Bonus for army concentration near enemy
		}

		// Center control bonus - less important
		score += this.evaluateCenterControl(board, player, opponent) * 0.5;

		// Mobility bonus - still valuable
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

		// Moving Lotus toward center - less critical
		if (tileCode === NickTileCodes.WhiteLotus) {
			const startGameCoords = new RowAndColumn(startRowAndCol.row, startRowAndCol.col);
			const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);

			const startDist = Math.abs(startGameCoords.x) + Math.abs(startGameCoords.y);
			const endDist = Math.abs(endGameCoords.x) + Math.abs(endGameCoords.y);

			if (endDist < startDist) {
				score += 100; // Modest bonus for advancing Lotus
			} else if (endDist > startDist) {
				score -= 10; // Minimal penalty for moving away
			}

			// Check if moving into danger - less penalty
			const endSurrounding = board.getSurroundingBoardPoints(endBp);
			let dangerCount = 0;
			for (let i = 0; i < endSurrounding.length; i++) {
				const sp = endSurrounding[i];
				if (sp.hasTile() && sp.tile.ownerName === opponent) {
					dangerCount++;
				}
			}
			
			// Only penalize if surrounded by many enemies
			if (dangerCount > 1) {
				score -= 150 * dangerCount;
			}
		}

		// Capture evaluation - HIGHLY REWARDED
		if (endBp.hasTile() && endBp.tile.ownerName === opponent) {
			const capturedCode = endBp.tile.code;
			// Check if this tile can actually capture
			if (this.canCapture(tileCode, capturedCode)) {
				const captureValue = (this.tileValues[capturedCode] || 0) * this.weights.captureBonus;
				score += captureValue;

				// Extra bonus for captures
				score += this.weights.captureAnyTile;

				// Extra bonus for capturing Avatar
				if (capturedCode === NickTileCodes.Avatar) {
					score += 500;
				}
				
				// Bonus for Avatar capturing anything
				if (tileCode === NickTileCodes.Avatar) {
					score += 200;
				}
			}
		}

		// Check if moving into capture range - much lower penalty
		if (tileCode !== NickTileCodes.WhiteLotus) {
			const endSurrounding = board.getSurroundingBoardPoints(endBp);
			for (let i = 0; i < endSurrounding.length; i++) {
				const sp = endSurrounding[i];
				if (sp.hasTile() && sp.tile.ownerName === opponent) {
					if (this.canCapture(sp.tile.code, tileCode)) {
						// Much lower penalty for risky moves
						score += this.weights.avoidCapture;

						// But if we're capturing something, it might be worth it
						if (endBp.hasTile() && endBp.tile.ownerName === opponent) {
							const capturedValue = this.tileValues[endBp.tile.code] || 0;
							const ourValue = this.tileValues[tileCode] || 0;
							if (capturedValue >= ourValue * 0.7) {
								score += 200; // Aggressive trades are good
							}
						}
					}
				}
			}
		}

		// Putting opponent Lotus in check - VERY HIGH PRIORITY
		const oppLotusPoint = this.findTileOnBoard(board, opponent, NickTileCodes.WhiteLotus);
		if (oppLotusPoint) {
			const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);
			const oppLotusGameCoords = new RowAndColumn(oppLotusPoint.row, oppLotusPoint.col);

			const distToOppLotus = Math.abs(endGameCoords.x - oppLotusGameCoords.x) +
								   Math.abs(endGameCoords.y - oppLotusGameCoords.y);

			// Adjacent to opponent Lotus - check threat
			if (distToOppLotus === 1) {
				score += 2000; // Huge bonus for putting Lotus in check!
			} else if (distToOppLotus === 2) {
				score += 600; // Good bonus for getting close
			} else if (distToOppLotus === 3) {
				score += 200; // Smaller bonus for being nearby
			}
		}

		// Moving to support attacks on enemy Lotus
		if (tileCode !== NickTileCodes.WhiteLotus && oppLotusPoint) {
			const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);
			const oppLotusGameCoords = new RowAndColumn(oppLotusPoint.row, oppLotusPoint.col);

			const distToOppLotus = Math.abs(endGameCoords.x - oppLotusGameCoords.x) +
								  Math.abs(endGameCoords.y - oppLotusGameCoords.y);

			// Moving closer to enemy Lotus is good
			if (distToOppLotus <= 2) {
				score += this.weights.aggressiveAdvance * (3 - distToOppLotus);
			}
		}

		// Aggressive repositioning - moving toward center (where fights happen)
		const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);
		const endDistFromCenter = Math.abs(endGameCoords.x) + Math.abs(endGameCoords.y);
		if (endDistFromCenter <= 4) {
			score += 100; // Bonus for being in the action zone
		}

		// Element cycle advantage
		if (tileCode !== NickTileCodes.WhiteLotus && 
			tileCode !== NickTileCodes.Avatar && 
			endBp.hasTile() === false) {
			// Check what enemy elements are nearby
			const endSurrounding = board.getSurroundingBoardPoints(endBp);
			for (let i = 0; i < endSurrounding.length; i++) {
				const sp = endSurrounding[i];
				if (sp.hasTile() && sp.tile.ownerName === opponent && 
					sp.tile.code !== NickTileCodes.WhiteLotus) {
					if (this.canCapture(tileCode, sp.tile.code)) {
						score += this.weights.elementCycleAdvantage; // Bonus for favorable matchups nearby
					}
				}
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

		// Check tiles in the center region (within 4 of center for aggressive play)
		for (let row = 0; row < board.cells.length; row++) {
			for (let col = 0; col < board.cells[row].length; col++) {
				const bp = board.cells[row][col];
				if (!bp.isType(NON_PLAYABLE) && bp.hasTile()) {
					const gameCoords = new RowAndColumn(row, col);
					const distFromCenter = Math.abs(gameCoords.x) + Math.abs(gameCoords.y);

					if (distFromCenter <= 4) {
						if (bp.tile.ownerName === player) {
							score += this.weights.centerControl * (5 - distFromCenter);
						} else {
							score -= this.weights.centerControl * (5 - distFromCenter) * 0.3;
						}
					}
				}
			}
		}

		return score;
	}

	countPossibleMoves(game, player) {
		// Simplified mobility count
		let count = 0;
		const board = game.board;

		for (let row = 0; row < board.cells.length; row++) {
			for (let col = 0; col < board.cells[row].length; col++) {
				const bp = board.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player) {
					// Count moves based on surrounding empty spaces
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
