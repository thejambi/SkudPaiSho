/* Ginseng Pai Sho Strategic AI */

import { GUEST, HOST, MOVE, NotationPoint, RowAndColumn } from '../../CommonNotationObjects';
import { getOpponentName } from '../../pai-sho-common/PaiShoPlayerHelp';
import { GinsengTileCodes } from '../GinsengTiles';
import { GinsengAiHelp } from './GinsengAiHelp';
import { NON_PLAYABLE } from '../../skud-pai-sho/SkudPaiShoBoardPoint';
import { RED, WHITE } from '../../skud-pai-sho/SkudPaiShoTile';
import { TEMPLE } from '../../trifle/TrifleBoardPoint';

export class GinsengStrategicAI {
	constructor() {
		this.aiHelp = new GinsengAiHelp();
		this.player = null;

		// Tile values for material evaluation
		this.tileValues = {
			[GinsengTileCodes.WhiteLotus]: 10000,  // Can be returned to start if captured, but extremely important
			[GinsengTileCodes.Dragon]: 120,        // Powerful capture ability
			[GinsengTileCodes.LionTurtle]: 110,    // Strong and can capture original benders
			[GinsengTileCodes.Koi]: 100,           // Trapping ability
			[GinsengTileCodes.Badgermole]: 100,    // Protection ability
			[GinsengTileCodes.Bison]: 90,          // Push ability
			[GinsengTileCodes.Wheel]: 70,          // Long range movement
			[GinsengTileCodes.Ginseng]: 80,        // Harmony protection for Lotus
			[GinsengTileCodes.Orchid]: 60          // Banishes itself when capturing
		};

		// Evaluation weights - prioritize Lotus advancement!
		this.weights = {
			materialValue: 1.0,
			lotusProgressToGoal: 200,       // Per point closer to goal - HIGH priority
			lotusProtectedByGinseng: 150,   // Lotus protected by Ginseng harmony - moderate
			lotusNearGoal: 500,             // Bonus for being close to winning
			lotusThreatened: -300,          // Lotus is adjacent to enemy tile
			ginsengInHarmony: 50,           // Ginseng protecting Lotus - low priority
			badgermoleOnWhite: 100,         // Badgermole on White Garden (protective)
			dragonOnRed: 120,               // Dragon on Red Garden (offensive)
			koiOnWhite: 80,                 // Koi on White Garden (trapping)
			bisonOnRed: 80,                 // Bison on Red Garden (push ability)
			centerControl: 15,              // Controlling center area
			protectingLotus: 30,            // Friendly tiles near Lotus
			captureBonus: 1.5,              // Multiplier for captures - be aggressive
			avoidCapture: -40,              // Penalty for moving into capture range
			mobilityBonus: 5,               // More moves = better position
			templeControl: 30,              // Tiles in temples are protected
			tileAdvancement: 25,            // Bonus for advancing other tiles toward enemy
			clearingPath: 40,               // Bonus for moving tiles that block Lotus path
			steppingStone: 150,             // Tile positioned for Lotus to jump over toward goal
			lotusJumpOpportunity: 200       // Lotus has a jump available toward goal
		};
	}

	getName() {
		return "Ginseng Strategic AI";
	}

	getMessage() {
		return "A strategic AI that evaluates board positions based on Lotus advancement toward the goal, Ginseng harmony protection, garden positioning, and material advantage. It prioritizes moving the Lotus across the border while keeping it protected.";
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

			// Check for immediate win (Lotus crossing the border)
			if (this.isWinningMove(game, move)) {
				return move;
			}

			// Simulate move and evaluate
			const gameCopy = game.getCopy();
			gameCopy.runNotationMove(move);

			let score = this.evaluatePosition(gameCopy, this.player, opponent);

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
		const myLotusPoint = this.findTileOnBoard(board, player, GinsengTileCodes.WhiteLotus);
		const oppLotusPoint = this.findTileOnBoard(board, opponent, GinsengTileCodes.WhiteLotus);

		if (myLotusPoint) {
			// Distance to goal (HOST wants x < 0, GUEST wants x > 0)
			const rowAndCol = new RowAndColumn(myLotusPoint.row, myLotusPoint.col);
			const distanceToGoal = this.getDistanceToGoal(rowAndCol, player);

			// Closer to goal is better
			score += (16 - distanceToGoal) * this.weights.lotusProgressToGoal;

			// Bonus for being very close to goal
			if (distanceToGoal <= 2) {
				score += this.weights.lotusNearGoal * (3 - distanceToGoal);
			}

			// Check if Lotus is protected by Ginseng (harmony - in line of sight)
			if (this.isLotusProtectedByGinseng(board, myLotusPoint, player)) {
				score += this.weights.lotusProtectedByGinseng;
			}

			// Check for threats to Lotus (adjacent enemy tiles)
			const surrounding = board.getSurroundingBoardPoints(myLotusPoint);
			let protectingTiles = 0;
			for (let i = 0; i < surrounding.length; i++) {
				const sp = surrounding[i];
				if (sp.hasTile()) {
					if (sp.tile.ownerName === opponent) {
						// Check if both Lotuses are outside temples (capturing enabled)
						if (this.canCaptureByMovement(board, player, opponent)) {
							score += this.weights.lotusThreatened;
						}
					} else {
						protectingTiles++;
					}
				}
			}
			score += protectingTiles * this.weights.protectingLotus;

			// Bonus for Lotus in temple (protected from capture and abilities)
			if (myLotusPoint.isType(TEMPLE)) {
				score += this.weights.templeControl * 2;
			}
		}

		if (oppLotusPoint) {
			// Opponent's distance to their goal
			const oppRowAndCol = new RowAndColumn(oppLotusPoint.row, oppLotusPoint.col);
			const oppDistanceToGoal = this.getDistanceToGoal(oppRowAndCol, opponent);

			// Opponent farther from their goal is better for us
			score += oppDistanceToGoal * (this.weights.lotusProgressToGoal / 2);
		}

		// Evaluate tile positions on gardens
		score += this.evaluateGardenPositions(board, player, opponent);

		// Evaluate Ginseng harmony
		score += this.evaluateGinsengHarmony(board, player);

		// Evaluate Lotus jump setup - stepping stones for diagonal jumps
		score += this.evaluateLotusJumpSetup(board, myLotusPoint, player);

		// Mobility bonus (having more possible moves is good)
		const myMobility = this.countPossibleMoves(game, player);
		const oppMobility = this.countPossibleMoves(game, opponent);
		score += (myMobility - oppMobility) * this.weights.mobilityBonus;

		// Temple control bonus
		score += this.evaluateTempleControl(board, player, opponent);

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

		// Moving Lotus toward goal - THIS IS THE MAIN PRIORITY
		if (tileCode === GinsengTileCodes.WhiteLotus) {
			const startDist = this.getDistanceToGoal(startRowAndCol, player);
			const endDist = this.getDistanceToGoal(endRowAndCol, player);

			if (endDist < startDist) {
				// Big bonus for moving Lotus closer to goal - scales with progress
				score += 500 + (startDist - endDist) * 100;
			} else if (endDist > startDist) {
				score -= 200; // Moving Lotus away from goal
			}

			// Avoid moving Lotus into danger, but don't be too scared
			if (this.canCaptureByMovement(board, player, opponent)) {
				const endSurrounding = board.getSurroundingBoardPoints(endBp);
				let dangerCount = 0;
				for (let i = 0; i < endSurrounding.length; i++) {
					const sp = endSurrounding[i];
					if (sp.hasTile() && sp.tile.ownerName === opponent) {
						dangerCount++;
					}
				}
				// Only penalize if there's real danger
				if (dangerCount > 0) {
					score -= dangerCount * 150;
				}
			}

			// Small bonus for moving into temple (but don't hide there)
			if (endBp.isType(TEMPLE)) {
				score += 50;
			}
		} else {
			// Bonus for advancing other tiles toward enemy territory
			const startX = startRowAndCol.x;
			const endX = endRowAndCol.x;
			if (player === HOST) {
				// HOST advances toward negative x
				if (endX < startX) {
					score += this.weights.tileAdvancement;
				}
			} else {
				// GUEST advances toward positive x
				if (endX > startX) {
					score += this.weights.tileAdvancement;
				}
			}
		}

		// Capture evaluation
		if (endBp.hasTile() && endBp.tile.ownerName === opponent) {
			if (this.canCaptureByMovement(board, player, opponent)) {
				const capturedCode = endBp.tile.code;
				score += (this.tileValues[capturedCode] || 0) * this.weights.captureBonus;

				// Special consideration for Orchid (banishes itself)
				if (tileCode === GinsengTileCodes.Orchid) {
					score -= this.tileValues[GinsengTileCodes.Orchid] * 0.8; // Orchid sacrifice cost
				}
			}
		}

		// Evaluate moving tiles to strategic garden positions
		score += this.evaluateTileToGardenMove(tileCode, endBp);

		// IMPORTANT: Check if this move creates a stepping stone for the Lotus to jump over
		if (tileCode !== GinsengTileCodes.WhiteLotus) {
			const myLotusPoint = this.findTileOnBoard(board, player, GinsengTileCodes.WhiteLotus);
			if (myLotusPoint && this.isGoodSteppingStone(board, endRowAndCol.row, endRowAndCol.col, myLotusPoint, player)) {
				score += this.weights.steppingStone; // Big bonus for setting up Lotus jumps!
			}
		}

		// Moving Ginseng - small bonus for maintaining harmony, but don't prioritize it
		if (tileCode === GinsengTileCodes.Ginseng) {
			const myLotusPoint = this.findTileOnBoard(board, player, GinsengTileCodes.WhiteLotus);
			if (myLotusPoint) {
				// Check if this move puts Ginseng in line of sight with Lotus
				if (this.wouldBeInLineOfSight(endBp, myLotusPoint)) {
					score += 30; // Small bonus for harmony - don't over-prioritize
				}
			}
		}

		// Check if moving into capture range (for non-Lotus tiles)
		if (tileCode !== GinsengTileCodes.WhiteLotus && this.canCaptureByMovement(board, player, opponent)) {
			const endSurrounding = board.getSurroundingBoardPoints(endBp);
			for (let i = 0; i < endSurrounding.length; i++) {
				const sp = endSurrounding[i];
				if (sp.hasTile() && sp.tile.ownerName === opponent) {
					// We're moving into a spot where we could be captured
					score += this.weights.avoidCapture;

					// But if we're capturing something valuable, it might be worth it
					if (endBp.hasTile() && endBp.tile.ownerName === opponent) {
						const capturedValue = this.tileValues[endBp.tile.code] || 0;
						const ourValue = this.tileValues[tileCode] || 0;
						if (capturedValue >= ourValue) {
							score += 50; // Trade is acceptable
						}
					}
				}
			}
		}

		// Threatening opponent's Lotus - be aggressive!
		const oppLotusPoint = this.findTileOnBoard(board, opponent, GinsengTileCodes.WhiteLotus);
		if (oppLotusPoint) {
			const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);
			const oppLotusGameCoords = new RowAndColumn(oppLotusPoint.row, oppLotusPoint.col);

			const distToOppLotus = Math.abs(endGameCoords.x - oppLotusGameCoords.x) +
								   Math.abs(endGameCoords.y - oppLotusGameCoords.y);

			// Adjacent to opponent Lotus - threaten them!
			if (distToOppLotus === 1) {
				score += 250; // Threatening opponent's Lotus
			} else if (distToOppLotus === 2) {
				score += 80; // Getting close
			} else if (distToOppLotus === 3) {
				score += 30; // Moving toward threat range
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

		// Check if we're moving our Lotus past the border
		if (startBp.tile.code === GinsengTileCodes.WhiteLotus &&
			startBp.tile.ownerName === this.player) {
			const endGameCoords = new RowAndColumn(endRowAndCol.row, endRowAndCol.col);

			// HOST wins when x < 0, GUEST wins when x > 0
			if (this.player === HOST && endGameCoords.x < 0) {
				return true;
			}
			if (this.player === GUEST && endGameCoords.x > 0) {
				return true;
			}
		}

		return false;
	}

	getDistanceToGoal(rowAndCol, player) {
		// HOST wants to go to x < 0 (negative x)
		// GUEST wants to go to x > 0 (positive x)
		const x = rowAndCol.x;

		if (player === HOST) {
			// HOST starts at positive x, needs to reach negative x
			// Distance is how far we are from crossing to x < 0
			return x + 1; // +1 because x=0 is the border, we need x < 0
		} else {
			// GUEST starts at negative x, needs to reach positive x
			// Distance is how far we are from crossing to x > 0
			return -x + 1; // we need x > 0
		}
	}

	isLotusProtectedByGinseng(board, lotusPoint, player) {
		// Find all friendly Ginseng tiles and check if any is in line of sight
		const ginsengPoints = this.findAllTilesOnBoard(board, player, [GinsengTileCodes.Ginseng]);

		for (let i = 0; i < ginsengPoints.length; i++) {
			if (this.isInLineOfSight(ginsengPoints[i], lotusPoint, board)) {
				return true;
			}
		}
		return false;
	}

	isInLineOfSight(point1, point2, board) {
		// Check if two points are in the same row or column with no tiles blocking
		if (point1.row !== point2.row && point1.col !== point2.col) {
			return false; // Not in same row or column
		}

		// Check for blocking tiles
		if (point1.row === point2.row) {
			const minCol = Math.min(point1.col, point2.col);
			const maxCol = Math.max(point1.col, point2.col);
			for (let col = minCol + 1; col < maxCol; col++) {
				if (board.cells[point1.row][col].hasTile()) {
					return false; // Blocked
				}
			}
		} else {
			const minRow = Math.min(point1.row, point2.row);
			const maxRow = Math.max(point1.row, point2.row);
			for (let row = minRow + 1; row < maxRow; row++) {
				if (board.cells[row][point1.col].hasTile()) {
					return false; // Blocked
				}
			}
		}

		return true;
	}

	wouldBeInLineOfSight(endPoint, lotusPoint) {
		// Simple check - same row or column
		return endPoint.row === lotusPoint.row || endPoint.col === lotusPoint.col;
	}

	canCaptureByMovement(board, player, opponent) {
		// Both Lotuses must be outside of temples for capture by movement to be enabled
		const myLotus = this.findTileOnBoard(board, player, GinsengTileCodes.WhiteLotus);
		const oppLotus = this.findTileOnBoard(board, opponent, GinsengTileCodes.WhiteLotus);

		if (!myLotus || !oppLotus) {
			return false;
		}

		return !myLotus.isType(TEMPLE) && !oppLotus.isType(TEMPLE);
	}

	evaluateGardenPositions(board, player, opponent) {
		let score = 0;
		const myTiles = this.getTilesOnBoard(board, player);

		for (let i = 0; i < myTiles.length; i++) {
			const bp = myTiles[i];
			const tile = bp.tile;

			// Check if on White Garden
			if (bp.isType(WHITE)) {
				if (tile.code === GinsengTileCodes.Badgermole) {
					score += this.weights.badgermoleOnWhite;
				} else if (tile.code === GinsengTileCodes.Koi) {
					// Check if there are enemy tiles adjacent
					const surrounding = board.getSurroundingBoardPoints(bp);
					for (let j = 0; j < surrounding.length; j++) {
						if (surrounding[j].hasTile() && surrounding[j].tile.ownerName === opponent) {
							score += this.weights.koiOnWhite; // Trapping an enemy
						}
					}
				}
			}

			// Check if on Red Garden
			if (bp.isType(RED)) {
				if (tile.code === GinsengTileCodes.Dragon) {
					score += this.weights.dragonOnRed;
				} else if (tile.code === GinsengTileCodes.Bison) {
					score += this.weights.bisonOnRed;
				}
			}
		}

		return score;
	}

	evaluateGinsengHarmony(board, player) {
		let score = 0;
		const lotusPoint = this.findTileOnBoard(board, player, GinsengTileCodes.WhiteLotus);
		if (!lotusPoint) return score;

		const ginsengPoints = this.findAllTilesOnBoard(board, player, [GinsengTileCodes.Ginseng]);
		for (let i = 0; i < ginsengPoints.length; i++) {
			if (this.isInLineOfSight(ginsengPoints[i], lotusPoint, board)) {
				score += this.weights.ginsengInHarmony;
			}
		}

		return score;
	}

	evaluateTempleControl(board, player, opponent) {
		let score = 0;

		for (let row = 0; row < board.cells.length; row++) {
			for (let col = 0; col < board.cells[row].length; col++) {
				const bp = board.cells[row][col];
				if (bp.isType(TEMPLE) && bp.hasTile()) {
					if (bp.tile.ownerName === player) {
						score += this.weights.templeControl;
					} else if (bp.tile.ownerName === opponent) {
						score -= this.weights.templeControl * 0.5;
					}
				}
			}
		}

		return score;
	}

	// Evaluate Lotus jump setup - are there stepping stones for diagonal jumps toward the goal?
	evaluateLotusJumpSetup(board, lotusPoint, player) {
		if (!lotusPoint) return 0;

		let score = 0;
		const lotusRow = lotusPoint.row;
		const lotusCol = lotusPoint.col;
		const lotusCoords = new RowAndColumn(lotusRow, lotusCol);

		// Diagonal directions: [rowDelta, colDelta]
		const diagonals = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

		for (const [dRow, dCol] of diagonals) {
			const jumpOverRow = lotusRow + dRow;
			const jumpOverCol = lotusCol + dCol;
			const landingRow = lotusRow + dRow * 2;
			const landingCol = lotusCol + dCol * 2;

			// Check bounds
			if (jumpOverRow < 0 || jumpOverRow >= board.cells.length) continue;
			if (jumpOverCol < 0 || jumpOverCol >= board.cells[jumpOverRow].length) continue;
			if (landingRow < 0 || landingRow >= board.cells.length) continue;
			if (landingCol < 0 || landingCol >= board.cells[landingRow].length) continue;

			const jumpOverPoint = board.cells[jumpOverRow][jumpOverCol];
			const landingPoint = board.cells[landingRow][landingCol];

			// Check if there's a tile to jump over and an empty landing spot
			if (jumpOverPoint.hasTile() && !landingPoint.hasTile() && !landingPoint.isType(NON_PLAYABLE)) {
				const landingCoords = new RowAndColumn(landingRow, landingCol);
				const currentDist = this.getDistanceToGoal(lotusCoords, player);
				const landingDist = this.getDistanceToGoal(landingCoords, player);

				// Is this jump moving us toward the goal?
				if (landingDist < currentDist) {
					// Great! This is a useful stepping stone
					score += this.weights.lotusJumpOpportunity;

					// Even better if we can chain jumps
					// Check if there's another tile diagonally from the landing spot
					for (const [dRow2, dCol2] of diagonals) {
						const nextJumpRow = landingRow + dRow2;
						const nextJumpCol = landingCol + dCol2;
						const nextLandRow = landingRow + dRow2 * 2;
						const nextLandCol = landingCol + dCol2 * 2;

						if (nextJumpRow >= 0 && nextJumpRow < board.cells.length &&
							nextJumpCol >= 0 && nextJumpCol < board.cells[nextJumpRow].length &&
							nextLandRow >= 0 && nextLandRow < board.cells.length &&
							nextLandCol >= 0 && nextLandCol < board.cells[nextLandRow].length) {

							const nextJumpPoint = board.cells[nextJumpRow][nextJumpCol];
							const nextLandPoint = board.cells[nextLandRow][nextLandCol];

							if (nextJumpPoint.hasTile() && !nextLandPoint.hasTile() && !nextLandPoint.isType(NON_PLAYABLE)) {
								const nextLandCoords = new RowAndColumn(nextLandRow, nextLandCol);
								if (this.getDistanceToGoal(nextLandCoords, player) < landingDist) {
									score += this.weights.lotusJumpOpportunity * 0.5; // Chain jump bonus
								}
							}
						}
					}
				}
			}
		}

		return score;
	}

	// Check if a position is a good stepping stone for the Lotus
	isGoodSteppingStone(board, tileRow, tileCol, lotusPoint, player) {
		if (!lotusPoint) return false;

		const lotusRow = lotusPoint.row;
		const lotusCol = lotusPoint.col;

		// Is this tile diagonally adjacent to the Lotus?
		const rowDiff = tileRow - lotusRow;
		const colDiff = tileCol - lotusCol;

		if (Math.abs(rowDiff) !== 1 || Math.abs(colDiff) !== 1) {
			return false; // Not diagonally adjacent
		}

		// Check if the landing spot (continuing in the same diagonal direction) is valid
		const landingRow = tileRow + rowDiff;
		const landingCol = tileCol + colDiff;

		if (landingRow < 0 || landingRow >= board.cells.length) return false;
		if (landingCol < 0 || landingCol >= board.cells[landingRow].length) return false;

		const landingPoint = board.cells[landingRow][landingCol];
		if (landingPoint.hasTile() || landingPoint.isType(NON_PLAYABLE)) {
			return false; // Can't land there
		}

		// Does this jump advance the Lotus toward the goal?
		const lotusCoords = new RowAndColumn(lotusRow, lotusCol);
		const landingCoords = new RowAndColumn(landingRow, landingCol);

		return this.getDistanceToGoal(landingCoords, player) < this.getDistanceToGoal(lotusCoords, player);
	}

	evaluateTileToGardenMove(tileCode, endBp) {
		let score = 0;

		// Bonus for moving specific tiles to their optimal gardens
		if (endBp.isType(WHITE)) {
			if (tileCode === GinsengTileCodes.Badgermole) {
				score += 80; // Badgermole wants White Garden
			} else if (tileCode === GinsengTileCodes.Koi) {
				score += 60; // Koi wants White Garden
			}
		}

		if (endBp.isType(RED)) {
			if (tileCode === GinsengTileCodes.Dragon) {
				score += 80; // Dragon wants Red Garden
			} else if (tileCode === GinsengTileCodes.Bison) {
				score += 60; // Bison wants Red Garden
			}
		}

		return score;
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

	countPossibleMoves(game, player) {
		// Simplified mobility count based on surrounding empty spaces
		let count = 0;
		const board = game.board;

		for (let row = 0; row < board.cells.length; row++) {
			for (let col = 0; col < board.cells[row].length; col++) {
				const bp = board.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player) {
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
