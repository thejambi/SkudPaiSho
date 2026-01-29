// Paiko AI
// Strategic AI for Paiko game

import { DEPLOY, MOVE, GUEST, HOST } from '../CommonNotationObjects';
import { PaikoMoveType, PaikoGamePhase } from './PaikoGameNotation';
import { PaikoTile, PaikoTileFacing, PaikoTileCode } from './PaikoTile';

export class PaikoAI {
	constructor(gameManager, player) {
		this.gameManager = gameManager;
		this.player = player;
		this.opponent = player === HOST ? GUEST : HOST;
	}

	// Main entry point - get the best move for current game state
	getBestMove() {
		if (this.gameManager.isSetupPhase()) {
			return this.getSetupMove();
		}
		return this.getPlayingPhaseMove();
	}

	// ============ SETUP PHASE ============

	getSetupMove() {
		// During setup, select tiles strategically
		// Prioritize a balanced mix of tiles
		const availableTiles = this.gameManager.tileManager.getAvailableTileTypes(this.player);

		if (availableTiles.length === 0) {
			return null;
		}

		// Priority order for tile selection
		const tilePriority = [
			PaikoTileCode.SAI,      // Sai is very versatile with shift after deploy
			PaikoTileCode.BOW,      // Long range threat
			PaikoTileCode.SWORD,    // Good threat pattern
			PaikoTileCode.EARTH,    // Provides cover
			PaikoTileCode.WATER,    // Can redeploy
			PaikoTileCode.AIR,      // Mobile
			PaikoTileCode.FIRE,     // Threatens all but self-threatened
			PaikoTileCode.LOTUS     // Deploy anywhere but no points
		];

		// Get current hand to avoid too many duplicates
		const handCounts = {};
		const hand = this.gameManager.tileManager.getHand(this.player);
		hand.forEach(tile => {
			handCounts[tile.code] = (handCounts[tile.code] || 0) + 1;
		});

		// Find best available tile we don't have too many of
		for (const code of tilePriority) {
			if (availableTiles.includes(code) && (handCounts[code] || 0) < 2) {
				return {
					moveType: PaikoMoveType.SELECT_TILE,
					player: this.player,
					moveData: { selectedTiles: [code] }
				};
			}
		}

		// Fall back to any available tile
		return {
			moveType: PaikoMoveType.SELECT_TILE,
			player: this.player,
			moveData: { selectedTiles: [availableTiles[0]] }
		};
	}

	// ============ PLAYING PHASE ============

	getPlayingPhaseMove() {
		const possibleMoves = this.generateAllMoves();

		if (possibleMoves.length === 0) {
			// No moves available - draw tiles
			return this.getDrawMove();
		}

		// Evaluate each move and pick the best
		let bestMove = null;
		let bestScore = -Infinity;

		for (const move of possibleMoves) {
			const score = this.evaluateMove(move);
			if (score > bestScore) {
				bestScore = score;
				bestMove = move;
			}
		}

		// If no good moves found, consider drawing
		if (bestScore < -50) {
			const drawMove = this.getDrawMove();
			if (drawMove) {
				return drawMove;
			}
		}

		return bestMove;
	}

	generateAllMoves() {
		const moves = [];

		// Generate deploy moves
		const deployMoves = this.generateDeployMoves();
		moves.push(...deployMoves);

		// Generate shift moves
		const shiftMoves = this.generateShiftMoves();
		moves.push(...shiftMoves);

		return moves;
	}

	generateDeployMoves() {
		const moves = [];
		const hand = this.gameManager.tileManager.getHand(this.player);

		for (const tile of hand) {
			const deployPoints = this.gameManager.board.getPossibleDeploymentPoints(this.player, tile);

			for (const point of deployPoints) {
				const notationPoint = this.gameManager.board.getNotationPointFromRowCol(point.row, point.col);

				// For tiles with facing, try all directions
				if (tile.hasFacing()) {
					for (const facing of [PaikoTileFacing.UP, PaikoTileFacing.RIGHT, PaikoTileFacing.DOWN, PaikoTileFacing.LEFT]) {
						const move = {
							moveType: DEPLOY,
							player: this.player,
							moveData: {
								tileCode: tile.code,
								endPoint: notationPoint,
								facing: facing
							}
						};

						// For Sai, also consider shift destinations
						if (tile.hasSpecialRule('shiftAfterDeploy')) {
							// Add move without shift
							moves.push(move);

							// Add moves with shift
							const shiftMoves = this.generateSaiShiftVariants(move, point, tile);
							moves.push(...shiftMoves);
						} else {
							moves.push(move);
						}
					}
				} else {
					moves.push({
						moveType: DEPLOY,
						player: this.player,
						moveData: {
							tileCode: tile.code,
							endPoint: notationPoint,
							facing: PaikoTileFacing.UP
						}
					});
				}
			}
		}

		return moves;
	}

	generateSaiShiftVariants(deployMove, deployPoint, tile) {
		const moves = [];

		// Simulate placing Sai at deploy point to get shift destinations
		const gameCopy = this.gameManager.getCopy();
		const tempTile = new PaikoTile(tile.code, this.player === HOST ? 'H' : 'G');
		gameCopy.board.placeTile(tempTile, deployMove.moveData.endPoint, true);

		const shiftDestinations = gameCopy.board.getPossibleShiftDestinations(
			gameCopy.board.getPointFromNotation(deployMove.moveData.endPoint),
			this.player
		);

		for (const shiftPoint of shiftDestinations) {
			const shiftNotation = gameCopy.board.getNotationPointFromRowCol(shiftPoint.row, shiftPoint.col);

			for (const shiftFacing of [PaikoTileFacing.UP, PaikoTileFacing.RIGHT, PaikoTileFacing.DOWN, PaikoTileFacing.LEFT]) {
				moves.push({
					moveType: DEPLOY,
					player: this.player,
					moveData: {
						tileCode: tile.code,
						endPoint: deployMove.moveData.endPoint,
						facing: deployMove.moveData.facing,
						shiftEndPoint: shiftNotation,
						shiftFacing: shiftFacing
					}
				});
			}
		}

		return moves;
	}

	generateShiftMoves() {
		const moves = [];
		const playerTiles = this.gameManager.board.getPlayerTiles(this.player);

		for (const { tile, point } of playerTiles) {
			if (!tile.canShift()) {
				continue;
			}

			const shiftDestinations = this.gameManager.board.getPossibleShiftDestinations(point, this.player);

			for (const destPoint of shiftDestinations) {
				const startNotation = this.gameManager.board.getNotationPointFromRowCol(point.row, point.col);
				const endNotation = this.gameManager.board.getNotationPointFromRowCol(destPoint.row, destPoint.col);

				if (tile.hasFacing()) {
					for (const facing of [PaikoTileFacing.UP, PaikoTileFacing.RIGHT, PaikoTileFacing.DOWN, PaikoTileFacing.LEFT]) {
						moves.push({
							moveType: MOVE,
							player: this.player,
							moveData: {
								startPoint: startNotation,
								endPoint: endNotation,
								facing: facing
							}
						});
					}
				} else {
					moves.push({
						moveType: MOVE,
						player: this.player,
						moveData: {
							startPoint: startNotation,
							endPoint: endNotation,
							facing: PaikoTileFacing.UP
						}
					});
				}
			}
		}

		return moves;
	}

	getDrawMove() {
		const availableTiles = this.gameManager.tileManager.getAvailableTileTypes(this.player);

		if (availableTiles.length === 0) {
			return null;
		}

		// Draw up to 3 tiles, prioritizing useful ones
		const tilePriority = [
			PaikoTileCode.SAI,
			PaikoTileCode.BOW,
			PaikoTileCode.SWORD,
			PaikoTileCode.EARTH,
			PaikoTileCode.WATER,
			PaikoTileCode.AIR,
			PaikoTileCode.FIRE,
			PaikoTileCode.LOTUS
		];

		const tilesToDraw = [];
		for (const code of tilePriority) {
			if (tilesToDraw.length >= 3) break;
			if (availableTiles.includes(code)) {
				tilesToDraw.push(code);
			}
		}

		// Fill remaining slots with any available
		for (const code of availableTiles) {
			if (tilesToDraw.length >= 3) break;
			if (!tilesToDraw.includes(code)) {
				tilesToDraw.push(code);
			}
		}

		if (tilesToDraw.length === 0) {
			return null;
		}

		return {
			moveType: PaikoMoveType.DRAW,
			player: this.player,
			moveData: { drawnTiles: tilesToDraw }
		};
	}

	// ============ MOVE EVALUATION ============

	evaluateMove(move) {
		// Create a copy of the game and apply the move
		const gameCopy = this.gameManager.getCopy();

		try {
			gameCopy.runNotationMove(move, false);
		} catch (e) {
			// Invalid move
			return -Infinity;
		}

		// Check if move would capture our own tile
		if (!gameCopy.validateMoveDoesntCaptureOwn(this.player)) {
			return -Infinity;
		}

		// Process captures
		gameCopy.processCapturePhase(this.player);

		// Evaluate resulting position
		return this.evaluatePosition(gameCopy);
	}

	evaluatePosition(gameState) {
		let score = 0;

		// 1. Score differential (most important)
		const scores = {
			host: gameState.board.calculateScore(HOST),
			guest: gameState.board.calculateScore(GUEST)
		};
		const myScore = this.player === HOST ? scores.host : scores.guest;
		const oppScore = this.player === HOST ? scores.guest : scores.host;
		score += (myScore - oppScore) * 100;

		// 2. Check for win
		if (myScore >= 10) {
			return 10000; // Winning move!
		}
		if (oppScore >= 10) {
			return -10000; // Losing position
		}

		// 3. Capture potential - can we capture opponent tiles next turn?
		const captureScore = this.evaluateCaptureThreats(gameState);
		score += captureScore * 50;

		// 4. Safety - are our tiles safe from capture?
		const safetyScore = this.evaluateSafety(gameState);
		score += safetyScore * 40;

		// 5. Positional advantage - tiles closer to opponent's side
		const positionScore = this.evaluatePosition_Positional(gameState);
		score += positionScore * 20;

		// 6. Control - threatening important spaces
		const controlScore = this.evaluateControl(gameState);
		score += controlScore * 10;

		return score;
	}

	evaluateCaptureThreats(gameState) {
		let score = 0;
		const opponentTiles = gameState.board.getPlayerTiles(this.opponent);

		for (const { tile, point } of opponentTiles) {
			const myThreat = point.getThreat(this.player);
			const isCovered = point.isTileCovered(this.opponent);
			const threatNeeded = tile.getThreatToCapture(isCovered);

			// Close to capturing
			if (myThreat >= threatNeeded) {
				score += 3; // Can capture this turn (but already processed)
			} else if (myThreat === threatNeeded - 1) {
				score += 2; // One more threat needed
			} else if (myThreat > 0) {
				score += 0.5; // Some threat
			}
		}

		return score;
	}

	evaluateSafety(gameState) {
		let score = 0;
		const myTiles = gameState.board.getPlayerTiles(this.player);

		for (const { tile, point } of myTiles) {
			const oppThreat = point.getThreat(this.opponent);
			const isCovered = point.isTileCovered(this.player);
			const threatNeeded = tile.getThreatToCapture(isCovered);

			if (oppThreat >= threatNeeded) {
				score -= 5; // In danger of capture!
			} else if (oppThreat === threatNeeded - 1) {
				score -= 2; // Close to danger
			} else if (isCovered) {
				score += 1; // Safely covered
			}
		}

		return score;
	}

	evaluatePosition_Positional(gameState) {
		let score = 0;
		const myTiles = gameState.board.getPlayerTiles(this.player);

		for (const { tile, point } of myTiles) {
			// Skip Lotus (no points)
			if (tile.hasSpecialRule('noPoints')) {
				continue;
			}

			const pointValue = point.getPointsValue(this.player);
			score += pointValue;

			// Bonus for being in opponent's territory
			if (pointValue === 2) {
				score += 1; // Extra bonus for homeground
			}
		}

		return score;
	}

	evaluateControl(gameState) {
		let score = 0;

		// Count spaces we threaten vs opponent threatens
		gameState.board.forEachPoint((point) => {
			if (!point.isPlayable()) return;

			const myThreat = point.getThreat(this.player);
			const oppThreat = point.getThreat(this.opponent);

			if (myThreat > oppThreat) {
				score += 0.1;
			} else if (oppThreat > myThreat) {
				score -= 0.1;
			}
		});

		return score;
	}
}
