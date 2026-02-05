/* Adevar Strategic AI */

import { GUEST, HOST, MOVE, NotationPoint, RowAndColumn, DEPLOY } from '../../CommonNotationObjects';
import { getOpponentName } from '../../pai-sho-common/PaiShoPlayerHelp';
import { AdevarTileCode, AdevarTileType } from '../AdevarTile';
import { AdevarMoveType } from '../AdevarGameNotation';
import { NON_PLAYABLE, POSSIBLE_MOVE } from '../../skud-pai-sho/SkudPaiShoBoardPoint';
import { AdevarNotationBuilder } from '../AdevarGameNotation';

export class AdevarStrategicAI {
	constructor() {
		this.player = null;
		this.selectedHiddenTile = null;

		// Hidden Tile codes available for selection
		this.hiddenTileCodes = [
			AdevarTileCode.iris,
			AdevarTileCode.orientalLily,
			AdevarTileCode.echeveria,
			AdevarTileCode.whiteRose,
			AdevarTileCode.whiteLotus,
			AdevarTileCode.birdOfParadise,
			AdevarTileCode.blackOrchid
		];

		// Tile priority for deployment (prefer advancing goals)
		this.tilePriorityForDeployment = {
			[AdevarTileCode.iris]: 10,
			[AdevarTileCode.orientalLily]: 10,
			[AdevarTileCode.echeveria]: 10,
			[AdevarTileCode.whiteRose]: 10,
			[AdevarTileCode.whiteLotus]: 10,
			[AdevarTileCode.birdOfParadise]: 10,
			[AdevarTileCode.blackOrchid]: 10,
			[AdevarTileCode.lilac]: 8,
			[AdevarTileCode.zinnia]: 6,
			[AdevarTileCode.foxglove]: 4,
			[AdevarTileCode.reflection]: 5,
			[AdevarTileCode.vanguard]: 3
		};

		// Evaluation weights
		this.weights = {
			objectiveProgress: 100,      // Moving toward objective completion
			captureOpponentHT: 10000,    // Ability to capture opponent's Hidden Tile
			secondFaceDeployment: 500,   // Second Face tiles are valuable
			tileAdvancement: 20,         // Natural tile expansion
			centralControl: 10,          // Control center areas
			threatDefense: -100,         // Avoiding being captured
			vanguardRegrowth: 50,        // Protecting vanguard positions
			bluffBonus: 80               // Bonus for deceptive bluff moves
		};

		// Bluff probability - chance to play a deceptive move instead of optimal
		this.bluffProbability = 0.25;    // 25% chance to bluff

		// Map each Hidden Tile to key objective tiles
		// This helps AI play moves consistent with different objectives
		this.objectiveTileMap = {
			[AdevarTileCode.iris]: {
				keyTiles: [AdevarTileCode.lilac, AdevarTileCode.lilac, AdevarTileCode.zinnia],
				objective: "Form Harmony Ring"
			},
			[AdevarTileCode.orientalLily]: {
				keyTiles: [AdevarTileCode.lilac, AdevarTileCode.zinnia, AdevarTileCode.foxglove],
				objective: "Create Oriental Lily Garden"
			},
			[AdevarTileCode.echeveria]: {
				keyTiles: [AdevarTileCode.lilac, AdevarTileCode.zinnia, AdevarTileCode.lilac],
				objective: "Control Plots"
			},
			[AdevarTileCode.whiteRose]: {
				keyTiles: [AdevarTileCode.lilac, AdevarTileCode.zinnia, AdevarTileCode.foxglove],
				objective: "Diverse Spread"
			},
			[AdevarTileCode.whiteLotus]: {
				keyTiles: [AdevarTileCode.lilac, AdevarTileCode.lilac, AdevarTileCode.zinnia],
				objective: "Central Control"
			},
			[AdevarTileCode.birdOfParadise]: {
				keyTiles: [AdevarTileCode.zinnia, AdevarTileCode.foxglove, AdevarTileCode.lilac],
				objective: "Expansion Pattern"
			},
			[AdevarTileCode.blackOrchid]: {
				keyTiles: [AdevarTileCode.foxglove, AdevarTileCode.zinnia, AdevarTileCode.lilac],
				objective: "Strategic Arrangement"
			}
		};
	}

	getName() {
		return "Adevar Strategic AI";
	}

	getMessage() {
		return "A strategic AI that plays Adevăr by randomly selecting a Hidden Tile and pursuing its objective while looking for opportunities to capture the opponent's Hidden Tile.";
	}

	setPlayer(playerName) {
		this.player = playerName;
	}

	getMove(game, moveNum) {
		// First move: randomly select a Hidden Tile
		if (moveNum === 0) {
			return this.getHiddenTileSelectionMove(game);
		}

		// Subsequent moves: deploy or move tiles strategically
		const moves = this.getAllPossibleMoves(game, moveNum);

		if (!moves || moves.length === 0) {
			return null;
		}

		let bestMove = null;
		let bestScore = -Infinity;
		const movesWithScores = [];

		for (let i = 0; i < moves.length; i++) {
			const move = moves[i];

			// Check for immediate winning move (capture opponent's HT)
			const gameCopy = game.getCopy();
			gameCopy.runNotationMove(move);

			if (gameCopy.endGameWinners && gameCopy.endGameWinners.length > 0) {
				return move; // Always take winning move
			}

			let score = this.evaluatePosition(gameCopy, this.player);
			movesWithScores.push({ move, score });

			if (score > bestScore) {
				bestScore = score;
				bestMove = move;
			}
		}

		// Decide whether to bluff
		if (Math.random() < this.bluffProbability) {
			const bluffMove = this.selectBluffMove(movesWithScores, bestMove);
			if (bluffMove) {
				return bluffMove;
			}
		}

		return bestMove || (moves.length > 0 ? moves[0] : null);
	}

	getHiddenTileSelectionMove(game) {
		// Randomly select a Hidden Tile
		const randomIndex = Math.floor(Math.random() * this.hiddenTileCodes.length);
		const selectedTileCode = this.hiddenTileCodes[randomIndex];

		this.selectedHiddenTile = selectedTileCode;

		// Create notation for Hidden Tile selection
		const notationBuilder = new AdevarNotationBuilder();
		const moveText = `cHT:${selectedTileCode}`;
		
		// Build the move string in format: "1H. cHT:Iris"
		const moveNum = 0;
		const playerCode = this.player === HOST ? 'H' : 'G';
		const fullMoveText = `${moveNum}${playerCode}. ${moveText}`;

		return {
			fullMoveText: fullMoveText,
			moveNum: moveNum,
			playerCode: playerCode,
			player: this.player,
			moveType: AdevarMoveType.chooseHiddenTile,
			hiddenTileCode: selectedTileCode,
			isValidNotation: function() { return true; }
		};
	}

	getAllPossibleMoves(game, moveNum) {
		const moves = [];

		// Get all possible deployment moves
		const deploymentMoves = this.getPossibleDeploymentMoves(game, moveNum);
		moves.push(...deploymentMoves);

		// Get all possible movement moves
		const movementMoves = this.getPossibleMovementMoves(game, moveNum);
		moves.push(...movementMoves);

		return moves;
	}

	getPossibleDeploymentMoves(game, moveNum) {
		const moves = [];
		const tilesInHand = this.getTilesInHand(game);

		for (let i = 0; i < tilesInHand.length; i++) {
			const tile = tilesInHand[i];

			// Get possible deploy points for this tile
			game.revealDeployPoints(tile, true);
			const deployPoints = this.getPossibleDeployPoints(game);

			for (let j = 0; j < deployPoints.length; j++) {
				const deployPoint = deployPoints[j];
				const move = this.createDeploymentMove(tile, deployPoint, moveNum);

				if (move) {
					moves.push(move);
				}
			}
		}

		return moves;
	}

	getPossibleMovementMoves(game, moveNum) {
		const moves = [];
		const startPoints = this.getMovementStartPoints(game);

		for (let i = 0; i < startPoints.length; i++) {
			const startPoint = startPoints[i];

			game.revealPossibleMovePoints(startPoint, true);
			const endPoints = this.getPossibleMovePoints(game);

			for (let j = 0; j < endPoints.length; j++) {
				const endPoint = endPoints[j];
				const move = this.createMovementMove(startPoint, endPoint, moveNum);

				if (move) {
					moves.push(move);
				}
			}

			game.hidePossibleMovePoints(true);
		}

		return moves;
	}

	getTilesInHand(game) {
		const tiles = [];
		for (let i = 0; i < game.tileManager[this.player === HOST ? 'hostTiles' : 'guestTiles'].length; i++) {
			const tile = game.tileManager[this.player === HOST ? 'hostTiles' : 'guestTiles'][i];
			if (!tile.selectedFromPile) {
				tiles.push(tile);
			}
		}
		return tiles;
	}

	getPossibleDeployPoints(game) {
		const points = [];

		game.board.cells.forEach((row) => {
			row.forEach((boardPoint) => {
				if (!boardPoint.isType(NON_PLAYABLE)) {
					if (boardPoint.isType(POSSIBLE_MOVE)) {
						points.push(boardPoint);
					}
				}
			});
		});

		return points;
	}

	getMovementStartPoints(game) {
		const points = [];
		for (let row = 0; row < game.board.cells.length; row++) {
			for (let col = 0; col < game.board.cells[row].length; col++) {
				const startPoint = game.board.cells[row][col];
				if (startPoint.hasTile() && startPoint.tile.ownerName === this.player) {
					points.push(startPoint);
				}
			}
		}
		return points;
	}

	getPossibleMovePoints(game) {
		const points = [];

		game.board.cells.forEach((row) => {
			row.forEach((boardPoint) => {
				if (!boardPoint.isType(NON_PLAYABLE)) {
					if (boardPoint.isType(POSSIBLE_MOVE)) {
						points.push(boardPoint);
					}
				}
			});
		});

		return points;
	}

	createDeploymentMove(tile, deployPoint, moveNum) {
		const notationBuilder = new AdevarNotationBuilder();
		notationBuilder.moveType = DEPLOY;
		notationBuilder.tileType = tile.code;
		notationBuilder.currentPlayer = this.player;
		notationBuilder.endPoint = new NotationPoint(this.getNotation(deployPoint));

		const playerCode = this.player === HOST ? 'H' : 'G';
		const tileTypeStr = tile.type === AdevarTileType.gate ? AdevarTileType.gate : tile.code;
		const moveText = `${this.player}${tileTypeStr}(${this.getNotation(deployPoint)})`;
		const fullMoveText = `${moveNum}${playerCode}. ${moveText}`;

		return {
			fullMoveText: fullMoveText,
			moveNum: moveNum,
			playerCode: playerCode,
			player: this.player,
			moveType: DEPLOY,
			tileOwner: this.player === HOST ? 'H' : 'G',
			tileType: tile.code,
			endPoint: new NotationPoint(this.getNotation(deployPoint)),
			isValidNotation: function() { return true; }
		};
	}

	createMovementMove(startPoint, endPoint, moveNum) {
		const playerCode = this.player === HOST ? 'H' : 'G';
		const startNotation = this.getNotation(startPoint);
		const endNotation = this.getNotation(endPoint);
		const moveText = `(${startNotation})-(${endNotation})`;
		const fullMoveText = `${moveNum}${playerCode}. ${moveText}`;

		return {
			fullMoveText: fullMoveText,
			moveNum: moveNum,
			playerCode: playerCode,
			player: this.player,
			moveType: MOVE,
			startPoint: new NotationPoint(startNotation),
			endPoint: new NotationPoint(endNotation),
			isValidNotation: function() { return true; }
		};
	}

	getNotation(boardPoint) {
		return new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString;
	}

	evaluatePosition(gameCopy, player) {
		let score = 0;

		// Bonus for capturing opponent's Hidden Tile
		if (gameCopy.capturedTiles && gameCopy.capturedTiles.length > 0) {
			for (let i = 0; i < gameCopy.capturedTiles.length; i++) {
				const tile = gameCopy.capturedTiles[i];
				if (tile.type === AdevarTileType.hiddenTile && tile.ownerName === getOpponentName(player)) {
					score += this.weights.captureOpponentHT;
				}
			}
		}

		// Count basic tiles on board to evaluate objective progress
		const basicTileCount = this.countBasicTilesForObjective(gameCopy, player);
		score += basicTileCount * this.weights.objectiveProgress;

		// Bonus for deploying Second Face tiles
		if (gameCopy.secondFaceTilesOnBoardCount && gameCopy.secondFaceTilesOnBoardCount[player]) {
			score += gameCopy.secondFaceTilesOnBoardCount[player] * this.weights.secondFaceDeployment;
		}

		// Control and tile advancement
		const tileCount = this.countPlayerTiles(gameCopy, player);
		score += tileCount * this.weights.tileAdvancement;

		return score;
	}

	selectBluffMove(movesWithScores, bestMove) {
		// Filter moves that aren't the best move (for deception)
		const bluffCandidates = movesWithScores.filter(
			m => m.score < movesWithScores[0].score && m.move !== bestMove
		);

		if (bluffCandidates.length === 0) {
			return null; // Can't bluff if no alternatives
		}

		// Sort by score descending (pick the next-best moves for bluffing)
		bluffCandidates.sort((a, b) => b.score - a.score);

		// Take top few bluff candidates to maintain some competitiveness
		const topBluffMoves = bluffCandidates.slice(0, Math.max(1, Math.floor(bluffCandidates.length * 0.3)));

		// Randomly select from good bluff candidates
		const selectedBluff = topBluffMoves[Math.floor(Math.random() * topBluffMoves.length)];
		return selectedBluff ? selectedBluff.move : null;
	}

	countBasicTilesForObjective(gameCopy, player) {
		let count = 0;

		for (let row = 0; row < gameCopy.board.cells.length; row++) {
			for (let col = 0; col < gameCopy.board.cells[row].length; col++) {
				const boardPoint = gameCopy.board.cells[row][col];
				if (boardPoint.hasTile() && boardPoint.tile.ownerName === player) {
					const tile = boardPoint.tile;
					// Count basic tiles (Iris, Oriental Lily, Echeveria, etc.)
					if ([
						AdevarTileCode.iris,
						AdevarTileCode.orientalLily,
						AdevarTileCode.echeveria,
						AdevarTileCode.whiteRose,
						AdevarTileCode.whiteLotus,
						AdevarTileCode.birdOfParadise,
						AdevarTileCode.blackOrchid
					].includes(tile.code)) {
						count++;
					}
				}
			}
		}

		return count;
	}

	countPlayerTiles(gameCopy, player) {
		let count = 0;

		for (let row = 0; row < gameCopy.board.cells.length; row++) {
			for (let col = 0; col < gameCopy.board.cells[row].length; col++) {
				const boardPoint = gameCopy.board.cells[row][col];
				if (boardPoint.hasTile() && boardPoint.tile.ownerName === player) {
					count++;
				}
			}
		}

		return count;
	}
}
