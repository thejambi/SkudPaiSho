/**
 * Paiko Game Tests
 * Tests for Paiko game mechanics, tiles, and win conditions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock PaiShoMain before any imports that depend on it
vi.mock('../js/PaiShoMain', () => {
	return {
		setGameLogText: vi.fn(),
		showBadMoveModal: vi.fn(),
		closeModal: vi.fn(),
		showModal: vi.fn(),
		BRAND_NEW: 'Brand New',
		MOVE_DONE: 'Move Done',
		HOST: 'Host',
		GUEST: 'Guest',
		gameId: -1,
		currentMoveIndex: 0,
		GameType: {
			Paiko: { id: 200, name: 'Paiko' }
		},
		ggOptions: [],
		gameController: {
			buildNotationString: vi.fn()
		}
	};
});

// Mock GameOptions
vi.mock('../js/GameOptions', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		gameOptionEnabled: vi.fn(() => false)
	};
});

// Import after mocking
import { HOST, GUEST, DEPLOY, MOVE } from '../js/CommonNotationObjects';
import { PaikoTile, PaikoTileCode, PaikoTileFacing, PaikoTileName, rotatePattern } from '../js/paiko/PaikoTile';
import { PaikoTileManager } from '../js/paiko/PaikoTileManager';
import { PaikoBoard } from '../js/paiko/PaikoBoard';
import { PaikoGameManager } from '../js/paiko/PaikoGameManager';
import { PaikoGamePhase, PaikoMoveType } from '../js/paiko/PaikoGameNotation';

describe('PaikoTile', () => {
	describe('Tile Creation', () => {
		it('should create a tile with correct properties', () => {
			const tile = new PaikoTile(PaikoTileCode.SWORD, 'H');
			expect(tile.code).toBe(PaikoTileCode.SWORD);
			expect(tile.ownerCode).toBe('H');
			expect(tile.ownerName).toBe(HOST);
		});

		it('should create Guest tiles correctly', () => {
			const tile = new PaikoTile(PaikoTileCode.BOW, 'G');
			expect(tile.ownerCode).toBe('G');
			expect(tile.ownerName).toBe(GUEST);
		});

		it('should get correct image name', () => {
			const hostTile = new PaikoTile(PaikoTileCode.SWORD, 'H');
			const guestTile = new PaikoTile(PaikoTileCode.SWORD, 'G');
			expect(hostTile.getImageName()).toBe('HSword');
			expect(guestTile.getImageName()).toBe('GSword');
		});
	});

	describe('Tile Facing', () => {
		it('should identify tiles that have facing', () => {
			const bow = new PaikoTile(PaikoTileCode.BOW, 'H');
			const sword = new PaikoTile(PaikoTileCode.SWORD, 'H');
			expect(bow.hasFacing()).toBe(true);
			expect(sword.hasFacing()).toBe(false);
		});

		it('should set and get facing direction', () => {
			const bow = new PaikoTile(PaikoTileCode.BOW, 'H');
			bow.setFacing(PaikoTileFacing.RIGHT);
			expect(bow.getFacing()).toBe(PaikoTileFacing.RIGHT);
		});
	});

	describe('Threat and Cover Patterns', () => {
		it('should return threat pattern for Sword', () => {
			const sword = new PaikoTile(PaikoTileCode.SWORD, 'H');
			const pattern = sword.getThreatPattern();
			expect(pattern.length).toBeGreaterThan(0);
		});

		it('should return cover pattern for Water', () => {
			const water = new PaikoTile(PaikoTileCode.WATER, 'H');
			const pattern = water.getCoverPattern();
			expect(pattern.length).toBeGreaterThan(0);
		});

		it('should rotate pattern correctly', () => {
			const pattern = [[0, 1]]; // One space to the right
			const rotatedRight = rotatePattern(pattern, PaikoTileFacing.RIGHT);
			// After 90 degree clockwise rotation, [0,1] becomes [1,0]
			expect(rotatedRight[0][0]).toBe(1);
			expect(Math.abs(rotatedRight[0][1])).toBe(0); // Handle -0 vs 0
		});
	});

	describe('Special Rules', () => {
		it('should identify Lotus special rules', () => {
			const lotus = new PaikoTile(PaikoTileCode.LOTUS, 'H');
			expect(lotus.hasSpecialRule('deployAnywhere')).toBe(true);
			expect(lotus.hasSpecialRule('noPoints')).toBe(true);
		});

		it('should identify Water special rules', () => {
			const water = new PaikoTile(PaikoTileCode.WATER, 'H');
			expect(water.hasSpecialRule('canRedeploy')).toBe(true);
		});

		it('should identify Sai special rules', () => {
			const sai = new PaikoTile(PaikoTileCode.SAI, 'H');
			expect(sai.hasSpecialRule('shiftAfterDeploy')).toBe(true);
		});
	});

	describe('Tile Copying', () => {
		it('should create an independent copy', () => {
			const original = new PaikoTile(PaikoTileCode.BOW, 'H');
			original.setFacing(PaikoTileFacing.DOWN);
			const copy = original.getCopy();

			expect(copy.code).toBe(original.code);
			expect(copy.getFacing()).toBe(PaikoTileFacing.DOWN);
			expect(copy).not.toBe(original);
		});
	});
});

describe('PaikoTileManager', () => {
	let manager;

	beforeEach(() => {
		manager = new PaikoTileManager();
	});

	describe('Initialization', () => {
		it('should initialize with 24 tiles per player in reserve', () => {
			expect(manager.getReserveSize(HOST)).toBe(24);
			expect(manager.getReserveSize(GUEST)).toBe(24);
		});

		it('should have empty hands initially', () => {
			expect(manager.getHandSize(HOST)).toBe(0);
			expect(manager.getHandSize(GUEST)).toBe(0);
		});

		it('should have 3 of each tile type in reserve', () => {
			expect(manager.getReserveTileCount(HOST, PaikoTileCode.SWORD)).toBe(3);
			expect(manager.getReserveTileCount(HOST, PaikoTileCode.BOW)).toBe(3);
			expect(manager.getReserveTileCount(HOST, PaikoTileCode.LOTUS)).toBe(3);
		});
	});

	describe('Drawing Tiles', () => {
		it('should draw tile from reserve to hand', () => {
			const tile = manager.drawTileFromReserve(HOST, PaikoTileCode.SWORD);
			expect(tile).not.toBeNull();
			expect(manager.getReserveTileCount(HOST, PaikoTileCode.SWORD)).toBe(2);
			expect(manager.getHandSize(HOST)).toBe(1);
		});

		it('should return null when drawing unavailable tile', () => {
			// Draw all 3 swords
			manager.drawTileFromReserve(HOST, PaikoTileCode.SWORD);
			manager.drawTileFromReserve(HOST, PaikoTileCode.SWORD);
			manager.drawTileFromReserve(HOST, PaikoTileCode.SWORD);

			const tile = manager.drawTileFromReserve(HOST, PaikoTileCode.SWORD);
			expect(tile).toBeNull();
		});
	});

	describe('Hand Management', () => {
		it('should check if tile is in hand', () => {
			manager.drawTileFromReserve(HOST, PaikoTileCode.BOW);
			expect(manager.hasTileInHand(HOST, PaikoTileCode.BOW)).toBe(true);
			expect(manager.hasTileInHand(HOST, PaikoTileCode.SWORD)).toBe(false);
		});

		it('should get tile from hand for deployment', () => {
			manager.drawTileFromReserve(HOST, PaikoTileCode.EARTH);
			const tile = manager.getTileFromHand(HOST, PaikoTileCode.EARTH);
			expect(tile).not.toBeNull();
			expect(manager.getHandSize(HOST)).toBe(0);
		});
	});

	describe('Discard Management', () => {
		it('should add captured tiles to discard', () => {
			const tile = new PaikoTile(PaikoTileCode.FIRE, 'H');
			manager.addToDiscard(HOST, tile);
			expect(manager.getDiscard(HOST).length).toBe(1);
		});
	});

	describe('Available Tile Types', () => {
		it('should return available tile types from reserve', () => {
			const types = manager.getAvailableTileTypes(HOST);
			expect(types.length).toBe(8); // All 8 tile types
		});

		it('should not include depleted types', () => {
			// Deplete all swords
			manager.drawTileFromReserve(HOST, PaikoTileCode.SWORD);
			manager.drawTileFromReserve(HOST, PaikoTileCode.SWORD);
			manager.drawTileFromReserve(HOST, PaikoTileCode.SWORD);

			const types = manager.getAvailableTileTypes(HOST);
			expect(types).not.toContain(PaikoTileCode.SWORD);
			expect(types.length).toBe(7);
		});
	});
});

describe('PaikoBoard', () => {
	let board;

	beforeEach(() => {
		board = new PaikoBoard();
	});

	describe('Board Setup', () => {
		it('should have playable areas', () => {
			// Count playable points (middleground + homegrounds)
			let playableCount = 0;
			board.forEachPoint((point) => {
				if (point.isPlayable()) {
					playableCount++;
				}
			});
			expect(playableCount).toBeGreaterThan(0);
		});

		it('should have 4 blacked out corners', () => {
			let blackedOutCount = 0;
			board.forEachPoint((point) => {
				if (point.isBlackedOut()) {
					blackedOutCount++;
				}
			});
			expect(blackedOutCount).toBe(4);
		});

		it('should have host and guest homegrounds', () => {
			let hostHomeCount = 0;
			let guestHomeCount = 0;
			board.forEachPoint((point) => {
				if (point.zone === 'host_homeground') hostHomeCount++;
				if (point.zone === 'guest_homeground') guestHomeCount++;
			});
			expect(hostHomeCount).toBeGreaterThan(0);
			expect(guestHomeCount).toBeGreaterThan(0);
			expect(hostHomeCount).toBe(guestHomeCount); // Symmetric board
		});
	});

	describe('Tile Placement', () => {
		it('should place a tile on the board', () => {
			const tile = new PaikoTile(PaikoTileCode.SWORD, 'H');
			// Find a playable point to place the tile
			let placed = false;
			board.forEachPoint((point) => {
				if (!placed && point.isPlayable()) {
					const notation = board.getNotationPointFromRowCol(point.row, point.col);
					board.placeTile(tile, notation.pointText);
					placed = true;
				}
			});
			expect(placed).toBe(true);
		});

		it('should remove a tile from the board', () => {
			const tile = new PaikoTile(PaikoTileCode.SWORD, 'H');
			// Find a playable point
			let notationText = null;
			board.forEachPoint((point) => {
				if (!notationText && point.isPlayable()) {
					const notation = board.getNotationPointFromRowCol(point.row, point.col);
					notationText = notation.pointText;
				}
			});
			board.placeTile(tile, notationText);
			const removed = board.removeTile(notationText);
			expect(removed).not.toBeNull();
			expect(board.getPointFromNotation(notationText).hasTile()).toBe(false);
		});

		it('should move a tile between points', () => {
			const tile = new PaikoTile(PaikoTileCode.SWORD, 'H');
			// Find two adjacent playable points
			let startNotation = null;
			let endNotation = null;
			board.forEachPoint((point) => {
				if (!startNotation && point.isPlayable()) {
					startNotation = board.getNotationPointFromRowCol(point.row, point.col).pointText;
				} else if (startNotation && !endNotation && point.isPlayable()) {
					endNotation = board.getNotationPointFromRowCol(point.row, point.col).pointText;
				}
			});
			board.placeTile(tile, startNotation);
			board.moveTile(startNotation, endNotation);
			expect(board.getPointFromNotation(startNotation).hasTile()).toBe(false);
			expect(board.getPointFromNotation(endNotation).hasTile()).toBe(true);
		});
	});

	describe('Scoring', () => {
		it('should calculate score for tiles in middleground', () => {
			// Place Host tile in middleground (1 point)
			const tile = new PaikoTile(PaikoTileCode.SWORD, 'H');
			const middlePoint = board.cells.flat().find(p => p && p.zone === 'middleground');
			if (middlePoint) {
				const notation = board.getNotationPointFromRowCol(middlePoint.row, middlePoint.col);
				board.placeTile(tile, notation.pointText);
				expect(board.calculateScore(HOST)).toBe(1);
			}
		});

		it('should calculate 2 points for tiles in opponent homeground', () => {
			// Place Host tile in Guest homeground (2 points)
			const tile = new PaikoTile(PaikoTileCode.SWORD, 'H');
			const guestHome = board.cells.flat().find(p => p && p.zone === 'guest_homeground');
			if (guestHome) {
				const notation = board.getNotationPointFromRowCol(guestHome.row, guestHome.col);
				board.placeTile(tile, notation.pointText);
				expect(board.calculateScore(HOST)).toBe(2);
			}
		});

		it('should not count Lotus for points', () => {
			const lotus = new PaikoTile(PaikoTileCode.LOTUS, 'H');
			const middlePoint = board.cells.flat().find(p => p && p.zone === 'middleground');
			if (middlePoint) {
				const notation = board.getNotationPointFromRowCol(middlePoint.row, middlePoint.col);
				board.placeTile(lotus, notation.pointText);
				expect(board.calculateScore(HOST)).toBe(0);
			}
		});
	});

	describe('Threat and Cover Calculation', () => {
		it('should calculate threat from placed tiles', () => {
			const sword = new PaikoTile(PaikoTileCode.SWORD, 'H');
			// Find a playable middleground point
			let placedPoint = null;
			board.forEachPoint((point) => {
				if (!placedPoint && point.zone === 'middleground') {
					placedPoint = point;
				}
			});

			if (placedPoint) {
				const notation = board.getNotationPointFromRowCol(placedPoint.row, placedPoint.col);
				board.placeTile(sword, notation.pointText);
				board.recalculateThreatAndCover();

				// Verify some points have threat
				let hasThreat = false;
				board.forEachPoint((point) => {
					if (point.hostThreat > 0) hasThreat = true;
				});
				expect(hasThreat).toBe(true);
			}
		});
	});
});

describe('PaikoGameManager', () => {
	let gameManager;
	const mockActuator = { actuate: vi.fn() };

	beforeEach(() => {
		gameManager = new PaikoGameManager(mockActuator, true, true);
	});

	describe('Game Initialization', () => {
		it('should start in HOST_SELECT_7 phase', () => {
			expect(gameManager.gamePhase).toBe(PaikoGamePhase.HOST_SELECT_7);
		});

		it('should have HOST as starting player', () => {
			expect(gameManager.currentPlayer).toBe(HOST);
		});

		it('should have no winners initially', () => {
			expect(gameManager.getWinner()).toBeNull();
		});

		it('should not be in tie state initially', () => {
			expect(gameManager.endedInTie).toBe(false);
		});
	});

	describe('Setup Phase', () => {
		it('should be in setup phase initially', () => {
			expect(gameManager.isSetupPhase()).toBe(true);
		});

		it('should track remaining selection count', () => {
			const info = gameManager.getGameInfo();
			expect(info.remainingSelection).toBe(7); // HOST needs to select 7
		});
	});

	describe('Win Conditions', () => {
		it('should detect winner when reaching 10 points', () => {
			// Manually set up a winning state
			gameManager.gamePhase = PaikoGamePhase.PLAYING;

			// Place enough Host tiles in opponent territory to reach 10 points
			// Each tile in opponent homeground = 2 points, so need 5 tiles
			let tilesPlaced = 0;
			gameManager.board.cells.flat().forEach(point => {
				if (point && point.zone === 'guest_homeground' && tilesPlaced < 5) {
					const tile = new PaikoTile(PaikoTileCode.SWORD, 'H');
					const notation = gameManager.board.getNotationPointFromRowCol(point.row, point.col);
					gameManager.board.placeTile(tile, notation.pointText);
					tilesPlaced++;
				}
			});

			gameManager.checkForWinners();
			expect(gameManager.getWinner()).toBe(HOST);
		});

		it('should return correct win result type code for winner', () => {
			gameManager.winners.push(HOST);
			expect(gameManager.getWinResultTypeCode()).toBe(1);
		});
	});

	describe('Tie Condition', () => {
		it('should detect tie when both players lose 13+ tiles with 5 or fewer points', () => {
			gameManager.gamePhase = PaikoGamePhase.PLAYING;

			// Add 13 tiles to each player's discard (simulating captured tiles)
			for (let i = 0; i < 13; i++) {
				gameManager.tileManager.addToDiscard(HOST, new PaikoTile(PaikoTileCode.SWORD, 'H'));
				gameManager.tileManager.addToDiscard(GUEST, new PaikoTile(PaikoTileCode.SWORD, 'G'));
			}

			// Ensure scores are 5 or less (empty board = 0 points)
			gameManager.checkForWinners();

			expect(gameManager.endedInTie).toBe(true);
			expect(gameManager.getWinner()).toBe('Game ended in a tie!');
			expect(gameManager.getWinResultTypeCode()).toBe(4);
		});

		it('should not tie if a player has more than 5 points', () => {
			gameManager.gamePhase = PaikoGamePhase.PLAYING;

			// Add 13 tiles to each player's discard
			for (let i = 0; i < 13; i++) {
				gameManager.tileManager.addToDiscard(HOST, new PaikoTile(PaikoTileCode.SWORD, 'H'));
				gameManager.tileManager.addToDiscard(GUEST, new PaikoTile(PaikoTileCode.SWORD, 'G'));
			}

			// Give Host 6 points (3 tiles in opponent homeground)
			let tilesPlaced = 0;
			gameManager.board.cells.flat().forEach(point => {
				if (point && point.zone === 'guest_homeground' && tilesPlaced < 3) {
					const tile = new PaikoTile(PaikoTileCode.SWORD, 'H');
					const notation = gameManager.board.getNotationPointFromRowCol(point.row, point.col);
					gameManager.board.placeTile(tile, notation.pointText);
					tilesPlaced++;
				}
			});

			gameManager.checkForWinners();
			expect(gameManager.endedInTie).toBe(false);
		});

		it('should not tie if a player has lost fewer than 13 tiles', () => {
			gameManager.gamePhase = PaikoGamePhase.PLAYING;

			// Add only 12 tiles to Host's discard
			for (let i = 0; i < 12; i++) {
				gameManager.tileManager.addToDiscard(HOST, new PaikoTile(PaikoTileCode.SWORD, 'H'));
			}
			// Add 13 to Guest's discard
			for (let i = 0; i < 13; i++) {
				gameManager.tileManager.addToDiscard(GUEST, new PaikoTile(PaikoTileCode.SWORD, 'G'));
			}

			gameManager.checkForWinners();
			expect(gameManager.endedInTie).toBe(false);
		});

		it('should return correct win reason for tie', () => {
			gameManager.endedInTie = true;
			expect(gameManager.getWinReason()).toContain('13+ tiles');
		});
	});

	describe('Game Copy', () => {
		it('should create independent copy of game state', () => {
			gameManager.currentPlayer = GUEST;
			gameManager.endedInTie = true;

			const copy = gameManager.getCopy();

			expect(copy.currentPlayer).toBe(GUEST);
			expect(copy.endedInTie).toBe(true);
			expect(copy).not.toBe(gameManager);
		});

		it('should copy winners array', () => {
			gameManager.winners.push(HOST);
			const copy = gameManager.getCopy();

			expect(copy.winners).toContain(HOST);
			copy.winners.push(GUEST);
			expect(gameManager.winners).not.toContain(GUEST);
		});
	});

	describe('Scores', () => {
		it('should return scores for both players', () => {
			const scores = gameManager.getScores();
			expect(scores).toHaveProperty('host');
			expect(scores).toHaveProperty('guest');
			expect(scores.host).toBe(0);
			expect(scores.guest).toBe(0);
		});
	});

	describe('Capture Reward', () => {
		it('should track pending capture reward', () => {
			expect(gameManager.hasPendingCaptureReward()).toBe(false);

			gameManager.pendingCaptureReward = { rewardCount: 2, capturingPlayer: HOST };
			expect(gameManager.hasPendingCaptureReward()).toBe(true);

			const reward = gameManager.getPendingCaptureReward();
			expect(reward.rewardCount).toBe(2);
			expect(reward.capturingPlayer).toBe(HOST);
		});

		it('should clear pending capture reward', () => {
			gameManager.pendingCaptureReward = { rewardCount: 1, capturingPlayer: GUEST };
			gameManager.clearPendingCaptureReward();
			expect(gameManager.hasPendingCaptureReward()).toBe(false);
		});
	});
});

describe('Pattern Rotation', () => {
	it('should rotate pattern 90 degrees clockwise for RIGHT facing', () => {
		const pattern = [[0, 1], [-1, 0]]; // Right and Up
		const rotated = rotatePattern(pattern, PaikoTileFacing.RIGHT);
		// After 90 degree rotation: [0,1] -> [1,0], [-1,0] -> [0,1]
		expect(rotated.length).toBe(2);
		// Check the rotation happened (allow for -0 vs 0)
		const hasDown = rotated.some(p => p[0] === 1 && Math.abs(p[1]) === 0);
		const hasRight = rotated.some(p => Math.abs(p[0]) === 0 && p[1] === 1);
		expect(hasDown).toBe(true);
		expect(hasRight).toBe(true);
	});

	it('should rotate pattern 180 degrees for DOWN facing', () => {
		const pattern = [[0, 1]]; // Right
		const rotated = rotatePattern(pattern, PaikoTileFacing.DOWN);
		// After 180 degree rotation: [0,1] -> [0,-1]
		expect(Math.abs(rotated[0][0])).toBe(0);
		expect(rotated[0][1]).toBe(-1);
	});

	it('should rotate pattern 270 degrees for LEFT facing', () => {
		const pattern = [[0, 1]]; // Right
		const rotated = rotatePattern(pattern, PaikoTileFacing.LEFT);
		// After 270 degree rotation: [0,1] -> [-1,0]
		expect(rotated[0][0]).toBe(-1);
		expect(Math.abs(rotated[0][1])).toBe(0);
	});

	it('should not change pattern for UP facing', () => {
		const pattern = [[0, 1], [1, 0]];
		const rotated = rotatePattern(pattern, PaikoTileFacing.UP);
		expect(rotated).toEqual(pattern);
	});
});
