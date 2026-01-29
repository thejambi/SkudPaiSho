// Paiko Game Manager
// Handles game state, rules, and move execution

import { DEPLOY, MOVE, GUEST, HOST, NotationPoint } from '../CommonNotationObjects';
import { PaikoBoard } from './PaikoBoard';
import { PaikoTileManager } from './PaikoTileManager';
import { PaikoMoveType, PaikoGamePhase } from './PaikoGameNotation';
import { PaikoTile, PaikoTileFacing, PaikoTileCode } from './PaikoTile';
import { PaiShoMarkingManager } from '../pai-sho-common/PaiShoMarkingManager';

const WINNING_SCORE = 10;

export class PaikoGameManager {
	constructor(actuator, ignoreActuate, isCopy) {
		this.actuator = actuator;
		this.isCopy = isCopy;

		this.board = new PaikoBoard();
		this.tileManager = new PaikoTileManager();
		this.markingManager = new PaiShoMarkingManager();

		this.currentPlayer = HOST;
		this.gamePhase = PaikoGamePhase.HOST_SELECT_7;

		// Track if action phase is complete (for turn management)
		this.actionPhaseComplete = false;

		// Track pending Sai shift (Sai can shift after deploy)
		this.pendingSaiShift = null;

		// Track pending capture rewards
		// When tiles are captured, the opponent chooses tiles for the capturer to draw
		// { rewardCount: number, capturingPlayer: HOST/GUEST }
		this.pendingCaptureReward = null;

		// Winners
		this.winners = [];

		if (!ignoreActuate) {
			this.actuate();
		}
	}

	actuate(moveToAnimate) {
		if (this.actuator) {
			this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate);
		}
	}

	setup(gameNotation) {
		// Reset board and tiles
		this.board = new PaikoBoard();
		this.tileManager = new PaikoTileManager();
		this.winners = [];

		// Replay all moves
		if (gameNotation && gameNotation.moves) {
			gameNotation.moves.forEach((move) => {
				this.runNotationMove(move, false);
			});
		}
	}

	// Execute a move from notation (TrifleGameNotation format)
	runNotationMove(move, withActuate = true) {
		if (!move) {
			return false;
		}

		// Get move data - TrifleGameNotation stores additional data in moveData
		const moveData = move.moveData || {};
		const moveType = move.moveType;
		const player = move.player;

		let moveSuccess = false;

		switch (moveType) {
			case PaikoMoveType.SELECT_TILE:
				moveSuccess = this.executeSelectTile(player, moveData);
				break;

			case DEPLOY:
				moveSuccess = this.executeDeploy(player, moveData);
				break;

			case MOVE:
				moveSuccess = this.executeShift(player, moveData);
				break;

			case PaikoMoveType.ROTATE:
				moveSuccess = this.executeRotate(player, moveData);
				break;

			case PaikoMoveType.DRAW:
				moveSuccess = this.executeDraw(player, moveData);
				break;

			case PaikoMoveType.SAI_SHIFT:
				moveSuccess = this.executeSaiShift(player, moveData);
				break;

			case PaikoMoveType.WATER_REDEPLOY:
				moveSuccess = this.executeWaterRedeploy(player, moveData);
				break;

			case PaikoMoveType.PASS:
				moveSuccess = true;
				break;

			case PaikoMoveType.CAPTURE_REWARD:
				moveSuccess = this.executeCaptureReward(player, moveData);
				break;

			case PaikoMoveType.END_GAME:
				moveSuccess = true;
				break;
		}

		if (moveSuccess) {
			// Update current player
			this.updateCurrentPlayer(move);

			// Check for captures after action moves
			if (this.isActionMove(move.moveType)) {
				this.processCapturePhase(move.player);
			}

			// Check for winners
			this.checkForWinners();

			if (withActuate) {
				this.actuate(move);
			}
		}

		return moveSuccess;
	}

	isActionMove(moveType) {
		return [
			DEPLOY,
			MOVE,
			PaikoMoveType.ROTATE,
			PaikoMoveType.DRAW,
			PaikoMoveType.WATER_REDEPLOY
		].includes(moveType);
	}

	// Execute tile selection during setup
	executeSelectTile(player, moveData) {
		const selectedTiles = moveData.selectedTiles || [];

		selectedTiles.forEach((tileCode) => {
			this.tileManager.drawTileFromReserve(player, tileCode);
		});

		// Update game phase
		if (this.gamePhase === PaikoGamePhase.HOST_SELECT_7) {
			if (this.tileManager.getHandSize(HOST) >= 7) {
				this.gamePhase = PaikoGamePhase.GUEST_SELECT_9;
			}
		} else if (this.gamePhase === PaikoGamePhase.GUEST_SELECT_9) {
			if (this.tileManager.getHandSize(GUEST) >= 9) {
				this.gamePhase = PaikoGamePhase.HOST_SELECT_1;
			}
		} else if (this.gamePhase === PaikoGamePhase.HOST_SELECT_1) {
			if (this.tileManager.getHandSize(HOST) >= 8) {
				this.gamePhase = PaikoGamePhase.PLAYING;
			}
		}

		return true;
	}

	// Execute deploy move
	executeDeploy(player, moveData) {
		const tileCode = moveData.tileCode;
		const endPoint = moveData.endPoint;
		const facing = moveData.facing;

		// Get tile from hand
		const tile = this.tileManager.getTileFromHand(player, tileCode);
		if (!tile) {
			return false;
		}

		// Set facing
		if (tile.hasFacing() && facing !== undefined) {
			tile.setFacing(facing);
		}

		// Place on board
		this.board.placeTile(tile, endPoint);

		// Check for Sai shift ability
		if (tile.hasSpecialRule('shiftAfterDeploy')) {
			tile.justDeployed = true;
			this.pendingSaiShift = { tile, point: this.board.getPointFromNotation(endPoint) };
		}

		return true;
	}

	// Execute shift move
	executeShift(player, moveData) {
		const startPointText = moveData.startPoint;
		const endPointText = moveData.endPoint;
		const facing = moveData.facing;

		const startPoint = this.board.getPointFromNotation(startPointText);
		if (!startPoint || !startPoint.hasTile()) {
			return false;
		}

		const tile = this.board.moveTile(startPointText, endPointText);
		if (!tile) {
			return false;
		}

		// Update facing if provided
		if (facing !== undefined && tile.hasFacing()) {
			tile.setFacing(facing);
			// Recalculate threat/cover since facing pattern changed
			this.board.recalculateThreatAndCover();
		}

		// Clear any pending Sai shift
		this.pendingSaiShift = null;
		tile.justDeployed = false;

		return true;
	}

	// Execute rotate in place
	executeRotate(player, moveData) {
		const startPointText = moveData.startPoint;
		const facing = moveData.facing;

		const point = this.board.getPointFromNotation(startPointText);
		if (!point || !point.hasTile()) {
			return false;
		}

		const tile = point.tile;
		if (!tile.hasFacing()) {
			return false;
		}

		tile.setFacing(facing);

		// Recalculate threat/cover since pattern changed
		this.board.recalculateThreatAndCover();

		// Clear any pending Sai shift
		this.pendingSaiShift = null;
		tile.justDeployed = false;

		return true;
	}

	// Execute draw move
	executeDraw(player, moveData) {
		const drawnTiles = moveData.drawnTiles || [];

		if (drawnTiles.length > 3) {
			return false;
		}

		drawnTiles.forEach((tileCode) => {
			this.tileManager.drawTileFromReserve(player, tileCode);
		});

		return true;
	}

	// Execute Sai's post-deploy shift
	executeSaiShift(player, moveData) {
		if (!this.pendingSaiShift) {
			return false;
		}

		const startPointText = moveData.startPoint;
		const endPointText = moveData.endPoint;
		const facing = moveData.facing;

		const tile = this.board.moveTile(startPointText, endPointText);
		if (!tile) {
			return false;
		}

		if (facing !== undefined && tile.hasFacing()) {
			tile.setFacing(facing);
			// Recalculate threat/cover since facing pattern changed
			this.board.recalculateThreatAndCover();
		}

		tile.justDeployed = false;
		this.pendingSaiShift = null;

		return true;
	}

	// Execute Water's redeploy ability
	executeWaterRedeploy(player, moveData) {
		const startPointText = moveData.startPoint;
		const endPointText = moveData.endPoint;

		const startPoint = this.board.getPointFromNotation(startPointText);
		if (!startPoint || !startPoint.hasTile()) {
			return false;
		}

		const tile = startPoint.tile;
		if (tile.code !== PaikoTileCode.WATER) {
			return false;
		}

		// Move water to new position
		this.board.moveTile(startPointText, endPointText);

		return true;
	}

	// Process capture phase after action
	// Returns the number of tiles captured
	processCapturePhase(activePlayer) {
		const opponent = activePlayer === HOST ? GUEST : HOST;

		// Get tiles that would be captured
		const capturedTiles = this.board.getTilesToCapture(opponent);

		capturedTiles.forEach(({ tile, point }) => {
			// Remove from board
			const removedTile = this.board.removeTile(
				this.board.getNotationPointFromRowCol(point.row, point.col)
			);

			// Add to discard pile
			this.tileManager.addToDiscard(opponent, removedTile);
		});

		// If any tiles were captured, set up pending capture reward
		// The opponent (whose turn is next) will choose tiles for the capturing player
		if (capturedTiles.length > 0) {
			const availableTypes = this.tileManager.getAvailableTileTypes(activePlayer);
			if (availableTypes.length > 0) {
				this.pendingCaptureReward = {
					rewardCount: capturedTiles.length,
					capturingPlayer: activePlayer
				};
			}
		}

		return capturedTiles.length;
	}

	// Execute capture reward move (opponent chose tiles for capturing player)
	executeCaptureReward(player, moveData) {
		if (!this.pendingCaptureReward) {
			return false;
		}

		const tileCodes = moveData.tileCodes || [];
		const capturingPlayer = this.pendingCaptureReward.capturingPlayer;

		// Draw the selected tiles into the capturing player's hand
		tileCodes.forEach(tileCode => {
			this.tileManager.drawTileFromReserve(capturingPlayer, tileCode);
		});

		// Clear pending reward
		this.pendingCaptureReward = null;

		return true;
	}

	// Check if there's a pending capture reward
	hasPendingCaptureReward() {
		return this.pendingCaptureReward !== null;
	}

	// Get pending capture reward info
	getPendingCaptureReward() {
		return this.pendingCaptureReward;
	}

	// Update current player after move
	updateCurrentPlayer(move) {
		// Capture reward doesn't change the current player - it's part of the opponent's turn
		if (move.moveType === PaikoMoveType.CAPTURE_REWARD) {
			return;
		}

		if (this.gamePhase === PaikoGamePhase.HOST_SELECT_7) {
			this.currentPlayer = HOST;
		} else if (this.gamePhase === PaikoGamePhase.GUEST_SELECT_9) {
			this.currentPlayer = GUEST;
		} else if (this.gamePhase === PaikoGamePhase.HOST_SELECT_1) {
			this.currentPlayer = HOST;
		} else if (this.gamePhase === PaikoGamePhase.PLAYING) {
			// After setup phase ends (HOST_SELECT_1 -> PLAYING), HOST goes first
			// Otherwise alternate turns in main game
			if (move.moveType === PaikoMoveType.SELECT_TILE) {
				// This was the last setup move, HOST takes first playing turn
				this.currentPlayer = HOST;
			} else {
				// Normal alternating turns
				this.currentPlayer = move.player === HOST ? GUEST : HOST;
			}
		}
	}

	// Check for game winners
	checkForWinners() {
		const hostScore = this.board.calculateScore(HOST);
		const guestScore = this.board.calculateScore(GUEST);

		if (hostScore >= WINNING_SCORE) {
			if (!this.winners.includes(HOST)) {
				this.winners.push(HOST);
			}
		}
		if (guestScore >= WINNING_SCORE) {
			if (!this.winners.includes(GUEST)) {
				this.winners.push(GUEST);
			}
		}
	}

	getWinner() {
		if (this.winners.length === 0) {
			return null;
		}
		// If both players reach 10 at the same time, the active player wins
		// For now, return first winner
		return this.winners[0];
	}

	getWinReason() {
		const winner = this.getWinner();
		if (!winner) {
			return null;
		}
		const score = this.board.calculateScore(winner);
		return `${winner === HOST ? 'Host' : 'Guest'} reached ${score} points!`;
	}

	getWinResultTypeCode() {
		return this.getWinner() ? 1 : 0;
	}

	// Get current scores
	getScores() {
		return {
			host: this.board.calculateScore(HOST),
			guest: this.board.calculateScore(GUEST)
		};
	}

	// Get possible moves for current player
	getPossibleMoves(player) {
		const moves = {
			deploys: [],
			shifts: [],
			draws: []
		};

		if (this.gamePhase !== PaikoGamePhase.PLAYING) {
			return moves;
		}

		// Get tiles that can be deployed
		const handTiles = this.tileManager.getAvailableTileTypesInHand(player);
		handTiles.forEach((tileCode) => {
			const tempTile = new PaikoTile(tileCode, player === HOST ? 'H' : 'G');
			const deployPoints = this.board.getPossibleDeploymentPoints(player, tempTile);

			if (deployPoints.length > 0) {
				moves.deploys.push({
					tileCode,
					points: deployPoints
				});
			}
		});

		// Get tiles that can shift
		this.board.getPlayerTiles(player).forEach(({ tile, point }) => {
			if (tile.canShift()) {
				const shiftDestinations = this.board.getPossibleShiftDestinations(point, player);
				if (shiftDestinations.length > 0) {
					moves.shifts.push({
						tile,
						fromPoint: point,
						toPoints: shiftDestinations
					});
				}
			}
		});

		// Draw is always possible if reserve is not empty
		if (!this.tileManager.isReserveEmpty(player)) {
			moves.draws = this.tileManager.getAvailableTileTypes(player);
		}

		return moves;
	}

	// Validate that a move wouldn't capture own tile
	validateMoveDoesntCaptureOwn(player) {
		return !this.board.moveWouldCaptureOwnTile(player);
	}

	// Get tiles remaining in setup selection
	getRemainingSelectionCount() {
		switch (this.gamePhase) {
			case PaikoGamePhase.HOST_SELECT_7:
				return 7 - this.tileManager.getHandSize(HOST);
			case PaikoGamePhase.GUEST_SELECT_9:
				return 9 - this.tileManager.getHandSize(GUEST);
			case PaikoGamePhase.HOST_SELECT_1:
				return 8 - this.tileManager.getHandSize(HOST);
			default:
				return 0;
		}
	}

	// Check if we're in setup phase
	isSetupPhase() {
		return this.gamePhase !== PaikoGamePhase.PLAYING;
	}

	// Get a copy of the game state for AI/validation
	getCopy() {
		const copy = new PaikoGameManager(null, true, true);

		copy.board = this.board.getCopy();
		copy.tileManager = this.tileManager.getCopy();
		copy.currentPlayer = this.currentPlayer;
		copy.gamePhase = this.gamePhase;
		copy.actionPhaseComplete = this.actionPhaseComplete;
		copy.winners = [...this.winners];

		if (this.pendingSaiShift) {
			// Find the corresponding tile and point in the copy
			const originalPoint = this.pendingSaiShift.point;
			const copyPoint = copy.board.getPoint(originalPoint.row, originalPoint.col);
			copy.pendingSaiShift = { tile: copyPoint.tile, point: copyPoint };
		}

		if (this.pendingCaptureReward) {
			copy.pendingCaptureReward = { ...this.pendingCaptureReward };
		}

		return copy;
	}

	// Get game info for display
	getGameInfo() {
		return {
			phase: this.gamePhase,
			currentPlayer: this.currentPlayer,
			scores: this.getScores(),
			hostHandSize: this.tileManager.getHandSize(HOST),
			guestHandSize: this.tileManager.getHandSize(GUEST),
			hostReserveSize: this.tileManager.getReserveSize(HOST),
			guestReserveSize: this.tileManager.getReserveSize(GUEST),
			winner: this.getWinner(),
			remainingSelection: this.getRemainingSelectionCount()
		};
	}
}
