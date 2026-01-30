// Paiko AI
// Strategic AI for Paiko game

import { DEPLOY, MOVE, GUEST, HOST } from '../CommonNotationObjects';
import { PaikoMoveType, PaikoGamePhase } from './PaikoGameNotation';
import { PaikoTile, PaikoTileFacing, PaikoTileCode } from './PaikoTile';

export class PaikoAI {
	constructor() {
		this.player = null;
		this.opponent = null;
		this.moveNum = 0;
	}

	getName() {
		return "Paiko Strategic AI";
	}

	getMessage() {
		return "A strategic AI that evaluates positions based on score potential, capture threats, tile safety, and board control.";
	}

	setPlayer(playerName) {
		this.player = playerName;
		this.opponent = playerName === HOST ? GUEST : HOST;
	}

	// Main entry point - get the best move for current game state
	getMove(gameManager, moveNum) {
		this.moveNum = moveNum;

		// Handle HOST_SELECT_1 specially - need to bundle tile selection with first action
		if (gameManager.gamePhase === PaikoGamePhase.HOST_SELECT_1) {
			return this.getHostSelect1WithAction(gameManager);
		}

		if (gameManager.isSetupPhase()) {
			return this.getSetupMove(gameManager);
		}
		return this.getPlayingPhaseMove(gameManager);
	}

	// HOST_SELECT_1: Select a tile AND make the first action in one move
	getHostSelect1WithAction(gameManager) {
		// First, select a tile from priority list
		const availableTiles = gameManager.tileManager.getAvailableTileTypes(this.player);
		if (availableTiles.length === 0) {
			return null;
		}

		const tilePriority = [
			PaikoTileCode.SAI, PaikoTileCode.BOW, PaikoTileCode.SWORD,
			PaikoTileCode.EARTH, PaikoTileCode.WATER, PaikoTileCode.AIR,
			PaikoTileCode.FIRE, PaikoTileCode.LOTUS
		];

		let setupTile = null;
		for (const code of tilePriority) {
			if (availableTiles.includes(code)) {
				setupTile = code;
				break;
			}
		}

		if (!setupTile) {
			setupTile = availableTiles[0];
		}

		// Create a copy of game state with the tile drawn to hand
		const gameCopy = gameManager.getCopy();
		gameCopy.tileManager.drawTileFromReserve(this.player, setupTile);
		gameCopy.gamePhase = PaikoGamePhase.PLAYING;

		// Now generate an action move using the updated state
		const actionMove = this.getPlayingPhaseMove(gameCopy);
		if (!actionMove) {
			return null;
		}

		// Bundle the setup tile with the action move
		actionMove.moveData.setupTile = setupTile;
		return actionMove;
	}

	// ============ SETUP PHASE ============

	getSetupMove(gameManager) {
		// During setup, select all tiles at once for a single move
		// Determine how many tiles to select based on game phase
		const phase = gameManager.gamePhase;
		let targetCount;

		if (phase === PaikoGamePhase.HOST_SELECT_7) {
			targetCount = 7;
		} else if (phase === PaikoGamePhase.GUEST_SELECT_9) {
			targetCount = 9;
		} else if (phase === PaikoGamePhase.HOST_SELECT_1) {
			// HOST_SELECT_1 is bundled with the first action move
			// Return null and let getPlayingPhaseMove handle it
			return null;
		} else {
			return null;
		}

		const availableTileTypes = gameManager.tileManager.getAvailableTileTypes(this.player);
		if (availableTileTypes.length === 0) {
			return null;
		}

		// Priority order for tile selection - balanced for opening
		const tilePriority = [
			PaikoTileCode.EARTH,    // Provides cover - good for defense
			PaikoTileCode.BOW,      // Long range threat
			PaikoTileCode.SWORD,    // Good threat pattern
			PaikoTileCode.SAI,      // Versatile with shift after deploy
			PaikoTileCode.WATER,    // Can redeploy
			PaikoTileCode.AIR,      // Mobile
			PaikoTileCode.FIRE,     // Threatens all but self-threatened
			PaikoTileCode.LOTUS     // Deploy anywhere but no points
		];

		// Select tiles strategically up to target count
		const selectedTiles = [];
		const selectedCounts = {};

		// First pass: select up to 2 of each type from priority list
		for (const code of tilePriority) {
			if (selectedTiles.length >= targetCount) break;

			// Get actual count available in reserve
			const availableCount = gameManager.tileManager.getReserveTileCount(this.player, code);
			const alreadySelected = selectedCounts[code] || 0;

			// Select up to 2 of each type
			while (selectedTiles.length < targetCount &&
				   alreadySelected < 2 &&
				   (selectedCounts[code] || 0) < availableCount) {
				selectedTiles.push(code);
				selectedCounts[code] = (selectedCounts[code] || 0) + 1;
			}
		}

		// Second pass: fill remaining slots if needed (allow 3rd copy)
		for (const code of tilePriority) {
			if (selectedTiles.length >= targetCount) break;

			const availableCount = gameManager.tileManager.getReserveTileCount(this.player, code);
			while (selectedTiles.length < targetCount &&
				   (selectedCounts[code] || 0) < availableCount) {
				selectedTiles.push(code);
				selectedCounts[code] = (selectedCounts[code] || 0) + 1;
			}
		}

		if (selectedTiles.length === 0) {
			return null;
		}

		return {
			moveNum: this.moveNum,
			moveType: PaikoMoveType.SELECT_TILE,
			player: this.player,
			moveData: { selectedTiles: selectedTiles }
		};
	}

	// ============ PLAYING PHASE ============

	getPlayingPhaseMove(gameManager) {
		const possibleMoves = this.generateAllMoves(gameManager);

		if (possibleMoves.length === 0) {
			// No moves available - draw tiles
			return this.getDrawMove(gameManager);
		}

		// Evaluate each move and pick the best
		let bestMove = null;
		let bestScore = -Infinity;

		for (const move of possibleMoves) {
			const score = this.evaluateMove(gameManager, move);
			if (score > bestScore) {
				bestScore = score;
				bestMove = move;
			}
		}

		// If no good moves found, consider drawing
		if (bestScore < -50) {
			const drawMove = this.getDrawMove(gameManager);
			if (drawMove) {
				return drawMove;
			}
		}

		return bestMove;
	}

	generateAllMoves(gameManager) {
		const moves = [];

		// Generate deploy moves
		const deployMoves = this.generateDeployMoves(gameManager);
		moves.push(...deployMoves);

		// Generate shift moves
		const shiftMoves = this.generateShiftMoves(gameManager);
		moves.push(...shiftMoves);

		return moves;
	}

	generateDeployMoves(gameManager) {
		const moves = [];
		const hand = gameManager.tileManager.getHand(this.player);

		for (const tile of hand) {
			const deployPoints = gameManager.board.getPossibleDeploymentPoints(this.player, tile);

			for (const point of deployPoints) {
				const notationPoint = gameManager.board.getNotationPointFromRowCol(point.row, point.col);
				const endPointText = notationPoint.pointText;

				// For tiles with facing, try all directions
				if (tile.hasFacing()) {
					for (const facing of [PaikoTileFacing.UP, PaikoTileFacing.RIGHT, PaikoTileFacing.DOWN, PaikoTileFacing.LEFT]) {
						const move = {
							moveNum: this.moveNum,
							moveType: DEPLOY,
							player: this.player,
							moveData: {
								tileCode: tile.code,
								endPoint: endPointText,
								facing: facing
							}
						};

						// For Sai, also consider shift destinations
						if (tile.hasSpecialRule('shiftAfterDeploy')) {
							// Add move without shift
							moves.push(move);

							// Add moves with shift
							const shiftMoves = this.generateSaiShiftVariants(gameManager, move, tile);
							moves.push(...shiftMoves);
						} else {
							moves.push(move);
						}
					}
				} else {
					moves.push({
						moveNum: this.moveNum,
						moveType: DEPLOY,
						player: this.player,
						moveData: {
							tileCode: tile.code,
							endPoint: endPointText,
							facing: PaikoTileFacing.UP
						}
					});
				}
			}
		}

		return moves;
	}

	generateSaiShiftVariants(gameManager, deployMove, tile) {
		const moves = [];

		// Simulate placing Sai at deploy point to get shift destinations
		const gameCopy = gameManager.getCopy();
		const tempTile = new PaikoTile(tile.code, this.player === HOST ? 'H' : 'G');
		gameCopy.board.placeTile(tempTile, deployMove.moveData.endPoint, true);

		const shiftDestinations = gameCopy.board.getPossibleShiftDestinations(
			gameCopy.board.getPointFromNotation(deployMove.moveData.endPoint),
			this.player
		);

		for (const shiftPoint of shiftDestinations) {
			const shiftNotation = gameCopy.board.getNotationPointFromRowCol(shiftPoint.row, shiftPoint.col);
			const shiftEndPointText = shiftNotation.pointText;

			for (const shiftFacing of [PaikoTileFacing.UP, PaikoTileFacing.RIGHT, PaikoTileFacing.DOWN, PaikoTileFacing.LEFT]) {
				moves.push({
					moveNum: this.moveNum,
					moveType: DEPLOY,
					player: this.player,
					moveData: {
						tileCode: tile.code,
						endPoint: deployMove.moveData.endPoint,
						facing: deployMove.moveData.facing,
						shiftEndPoint: shiftEndPointText,
						shiftFacing: shiftFacing
					}
				});
			}
		}

		return moves;
	}

	generateShiftMoves(gameManager) {
		const moves = [];
		const playerTiles = gameManager.board.getPlayerTiles(this.player);

		for (const { tile, point } of playerTiles) {
			if (!tile.canShift()) {
				continue;
			}

			const shiftDestinations = gameManager.board.getPossibleShiftDestinations(point, this.player);

			for (const destPoint of shiftDestinations) {
				const startNotation = gameManager.board.getNotationPointFromRowCol(point.row, point.col);
				const endNotation = gameManager.board.getNotationPointFromRowCol(destPoint.row, destPoint.col);
				const startPointText = startNotation.pointText;
				const endPointText = endNotation.pointText;

				if (tile.hasFacing()) {
					for (const facing of [PaikoTileFacing.UP, PaikoTileFacing.RIGHT, PaikoTileFacing.DOWN, PaikoTileFacing.LEFT]) {
						moves.push({
							moveNum: this.moveNum,
							moveType: MOVE,
							player: this.player,
							moveData: {
								startPoint: startPointText,
								endPoint: endPointText,
								facing: facing
							}
						});
					}
				} else {
					moves.push({
						moveNum: this.moveNum,
						moveType: MOVE,
						player: this.player,
						moveData: {
							startPoint: startPointText,
							endPoint: endPointText,
							facing: PaikoTileFacing.UP
						}
					});
				}
			}
		}

		return moves;
	}

	getDrawMove(gameManager) {
		const availableTiles = gameManager.tileManager.getAvailableTileTypes(this.player);

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
			moveNum: this.moveNum,
			moveType: PaikoMoveType.DRAW,
			player: this.player,
			moveData: { drawnTiles: tilesToDraw }
		};
	}

	// ============ MOVE EVALUATION ============

	evaluateMove(gameManager, move) {
		// Create a copy of the game and apply the move
		const gameCopy = gameManager.getCopy();

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

		// Determine game phase - early game is first 4 moves
		const isEarlyGame = this.moveNum <= 4;

		// 1. Score differential (less important in early game)
		const scores = {
			host: gameState.board.calculateScore(HOST),
			guest: gameState.board.calculateScore(GUEST)
		};
		const myScore = this.player === HOST ? scores.host : scores.guest;
		const oppScore = this.player === HOST ? scores.guest : scores.host;
		const scoreDiffWeight = isEarlyGame ? 30 : 100; // Reduce score focus early
		score += (myScore - oppScore) * scoreDiffWeight;

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
		const safetyWeight = isEarlyGame ? 60 : 40; // Safety more important early
		score += safetyScore * safetyWeight;

		// 5. Positional advantage - tiles closer to opponent's side
		const positionScore = this.evaluatePosition_Positional(gameState, isEarlyGame);
		score += positionScore * 20;

		// 6. Control - threatening important spaces
		const controlScore = this.evaluateControl(gameState, isEarlyGame);
		const controlWeight = isEarlyGame ? 25 : 10; // Control more important early
		score += controlScore * controlWeight;

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

	evaluatePosition_Positional(gameState, isEarlyGame = false) {
		let score = 0;
		const myTiles = gameState.board.getPlayerTiles(this.player);

		for (const { tile, point } of myTiles) {
			// Skip Lotus (no points)
			if (tile.hasSpecialRule('noPoints')) {
				continue;
			}

			const pointValue = point.getPointsValue(this.player);

			if (isEarlyGame) {
				// Early game: prioritize centrality and homeground defense over pushing for points
				const centrality = this.getCentrality(point);

				// Bonus for central positions (where you can project threat in multiple directions)
				score += centrality * 2;

				// Bonus for defending your own territory (homeground = 0 points for you)
				if (pointValue === 0) {
					score += 2; // Good to have presence on your side early
				} else if (pointValue === 1) {
					score += 1; // Middleground is ok
				}
				// No bonus for opponent's homeground early - too risky

			} else {
				// Later game: normal scoring - value opponent territory
				score += pointValue;

				// Bonus for being in opponent's territory
				if (pointValue === 2) {
					score += 1; // Extra bonus for homeground
				}
			}
		}

		return score;
	}

	// Calculate how central a point is (0-1 scale, 1 = center)
	getCentrality(point) {
		// Board is 18x18, center is around row 8-9, col 8-9
		const centerRow = 8.5;
		const centerCol = 8.5;
		const maxDist = 8.5; // Max distance from center to edge

		const rowDist = Math.abs(point.row - centerRow);
		const colDist = Math.abs(point.col - centerCol);
		const dist = Math.max(rowDist, colDist);

		return 1 - (dist / maxDist);
	}

	evaluateControl(gameState, isEarlyGame = false) {
		let score = 0;

		// Count spaces we threaten vs opponent threatens
		gameState.board.forEachPoint((point) => {
			if (!point.isPlayable()) return;

			const myThreat = point.getThreat(this.player);
			const oppThreat = point.getThreat(this.opponent);

			let controlValue = 0.1;
			if (isEarlyGame) {
				// Early game: value central control more
				const centrality = this.getCentrality(point);
				controlValue = 0.1 + (centrality * 0.2); // Up to 0.3 for center
			}

			if (myThreat > oppThreat) {
				score += controlValue;
			} else if (oppThreat > myThreat) {
				score -= controlValue;
			}
		});

		return score;
	}
}
