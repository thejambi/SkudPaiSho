/**
 * Skud Pai Sho Game Test
 * Tests game notation replay, tile mechanics, harmonies, and board state validation
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Mock PaiShoMain before any imports that depend on it
vi.mock('../js/PaiShoMain', () => {
	return {
		// Mock functions that try to access DOM
		setGameLogText: vi.fn(),
		showBadMoveModal: vi.fn(),
		closeModal: vi.fn(),
		showModal: vi.fn(),
		// Mock constants
		BRAND_NEW: 'Brand New',
		MOVE_DONE: 'Move Done',
		WAITING_FOR_ENDPOINT: 'Waiting for endpoint',
		WAITING_FOR_BONUS_ENDPOINT: 'Waiting for bonus endpoint',
		READY_FOR_BONUS: 'Ready for bonus',
		WAITING_FOR_BOAT_BONUS_POINT: 'Waiting for boat bonus point',
		HOST: 'Host',
		GUEST: 'Guest',
		gameId: -1,
		currentMoveIndex: 0,
		// Mock game type
		GameType: {
			SkudPaiSho: { id: 1, name: 'Skud Pai Sho' }
		},
		// Mock game options
		ggOptions: [],
		// Mock QueryString for GameData.js debug function
		QueryString: { appType: '' }
	};
});

// Import after mocking
import { HOST, GUEST } from '../js/CommonNotationObjects';
import { SkudPaiShoNotationMove } from '../js/skud-pai-sho/SkudPaiShoGameNotation';
import { SkudPaiShoGameManager } from '../js/skud-pai-sho/SkudPaiShoGameManager';
import { SkudPaiShoTile } from '../js/skud-pai-sho/SkudPaiShoTile';
import { SkudPaiShoTileManager } from '../js/skud-pai-sho/SkudPaiShoTileManager';
import { SkudPaiShoBoard } from '../js/skud-pai-sho/SkudPaiShoBoard';
import { BASIC_FLOWER, SPECIAL_FLOWER, ACCENT_TILE, ROCK, WHEEL, KNOTWEED, BOAT, WHITE_LOTUS, ORCHID } from '../js/GameData';
import { GATE, NEUTRAL } from '../js/skud-pai-sho/SkudPaiShoBoardPoint';

describe('Skud Pai Sho Game - Notation Parsing', () => {
	it('should parse move 0 (accent tile selection) correctly', () => {
		const move = new SkudPaiShoNotationMove('0H.R,W,K,B');

		expect(move.valid).toBe(true);
		expect(move.moveNum).toBe(0);
		expect(move.playerCode).toBe('H');
		expect(move.accentTiles).toEqual(['R', 'W', 'K', 'B']);
	});

	it('should parse Guest accent tile selection correctly', () => {
		const move = new SkudPaiShoNotationMove('0G.R,W,K,B');

		expect(move.valid).toBe(true);
		expect(move.moveNum).toBe(0);
		expect(move.playerCode).toBe('G');
		expect(move.accentTiles).toEqual(['R', 'W', 'K', 'B']);
	});

	it('should parse planting moves correctly', () => {
		const move = new SkudPaiShoNotationMove('1G.R4(0,-8)');

		expect(move.valid).toBe(true);
		expect(move.moveNum).toBe(1);
		expect(move.playerCode).toBe('G');
		expect(move.moveType).toBe('Planting');
		expect(move.plantedFlowerType).toBe('R4');
		expect(move.endPoint).toBeDefined();
		expect(move.endPoint.x).toBe(0);
		expect(move.endPoint.y).toBe(-8);
	});

	it('should parse Host planting move correctly', () => {
		const move = new SkudPaiShoNotationMove('1H.R4(0,8)');

		expect(move.valid).toBe(true);
		expect(move.moveNum).toBe(1);
		expect(move.playerCode).toBe('H');
		expect(move.moveType).toBe('Planting');
		expect(move.plantedFlowerType).toBe('R4');
		expect(move.endPoint).toBeDefined();
		expect(move.endPoint.x).toBe(0);
		expect(move.endPoint.y).toBe(8);
	});

	it('should parse arranging moves correctly', () => {
		const move = new SkudPaiShoNotationMove('3G.(8,0)-(3,0)');

		expect(move.valid).toBe(true);
		expect(move.moveNum).toBe(3);
		expect(move.playerCode).toBe('G');
		expect(move.moveType).toBe('Arranging');
		expect(move.startPoint).toBeDefined();
		expect(move.startPoint.x).toBe(8);
		expect(move.startPoint.y).toBe(0);
		expect(move.endPoint).toBeDefined();
		expect(move.endPoint.x).toBe(3);
		expect(move.endPoint.y).toBe(0);
	});

	it('should parse arranging moves with harmony bonus correctly', () => {
		const move = new SkudPaiShoNotationMove('4H.(-8,0)-(-7,4)+R4(-8,0)');

		expect(move.valid).toBe(true);
		expect(move.moveNum).toBe(4);
		expect(move.playerCode).toBe('H');
		expect(move.moveType).toBe('Arranging');
		expect(move.startPoint).toBeDefined();
		expect(move.startPoint.x).toBe(-8);
		expect(move.startPoint.y).toBe(0);
		expect(move.endPoint).toBeDefined();
		expect(move.endPoint.x).toBe(-7);
		expect(move.endPoint.y).toBe(4);
		expect(move.bonusTileCode).toBeDefined();
		expect(move.bonusEndPoint).toBeDefined();
		expect(move.bonusEndPoint.x).toBe(-8);
		expect(move.bonusEndPoint.y).toBe(0);
	});

	it('should parse complex arranging move with bonus (move 5G)', () => {
		const move = new SkudPaiShoNotationMove('5G.(3,0)-(3,-4)+R3(0,-8)');

		expect(move.valid).toBe(true);
		expect(move.moveNum).toBe(5);
		expect(move.playerCode).toBe('G');
		expect(move.moveType).toBe('Arranging');
		expect(move.bonusTileCode).toBeDefined();
	});
});

describe('Skud Pai Sho Game - Game Logic', () => {
	let gameManager;

	beforeAll(() => {
		// Create a mock actuator
		const mockActuator = {
			actuate: vi.fn()
		};

		// Initialize game manager with no actuate
		gameManager = new SkudPaiShoGameManager(mockActuator, true, true);
	});

	it('should initialize a game board correctly', () => {
		expect(gameManager).toBeDefined();
		expect(gameManager.board).toBeDefined();
		expect(gameManager.board.cells).toBeDefined();
		expect(gameManager.board.cells.length).toBe(17); // Board should be 17x17
		expect(gameManager.tileManager).toBeDefined();
	});

	it('should replay a complete game from notation', () => {
		const gameNotation = [
			'0H.R,W,K,B',
			'0G.R,W,K,B',
			'1G.R4(0,-8)',
			'1H.R4(0,8)',
			'2G.R5(8,0)',
			'2H.R5(-8,0)',
			'3G.(8,0)-(3,0)',
			'3H.(0,8)-(0,4)',
			'4G.(0,-8)-(0,-4)',
			'4H.(-8,0)-(-7,4)+R4(-8,0)',
			'5G.(3,0)-(3,-4)+R3(0,-8)',
			'5H.(-8,0)-(-7,-1)+R5(8,0)',
			'6G.(0,-8)-(0,-5)+R4(0,-8)',
			'6H.(8,0)-(7,-1)+R4(8,0)',
			'7G.(0,-8)-(0,-6)+K(1,4)',
			'7H.(8,0)-(7,3)+W(-8,4)'
		];

		// Run each move through the game
		gameNotation.forEach((notationText, index) => {
			const move = new SkudPaiShoNotationMove(notationText);

			// Verify the move was parsed correctly
			expect(move.valid).toBe(true);

			// Run the move (without UI actuate to avoid DOM dependencies)
			try {
				const result = gameManager.runNotationMove(move, false);
				console.log(`✓ Move ${move.moveNum}${move.playerCode}: ${notationText}`);
			} catch (error) {
				console.error(`✗ Move ${move.moveNum}${move.playerCode} failed: ${notationText}`, error.message);
				throw error;
			}
		});

		// Verify the game state after all moves
		const board = gameManager.board;
		expect(board).toBeDefined();
		expect(board.cells).toBeDefined();

		// Check that tiles were actually placed on the board
		let tilesOnBoard = 0;
		for (let row = 0; row < board.cells.length; row++) {
			if (board.cells[row]) {
				for (let col = 0; col < board.cells[row].length; col++) {
					const point = board.cells[row][col];
					if (point && point.hasTile()) {
						tilesOnBoard++;
						console.log(`Tile at [${row},${col}]: ${point.tile?.code}`);
					}
				}
			}
		}

		// We should have multiple tiles on the board after all those moves
		expect(tilesOnBoard).toBeGreaterThan(0);
		console.log(`\nTotal tiles on board: ${tilesOnBoard}`);
	});
});

describe('SkudPaiShoTile', () => {
	describe('Basic Flower Tiles', () => {
		it('should create Red basic flower tiles correctly', () => {
			const tile = new SkudPaiShoTile('R4', 'H');
			expect(tile.type).toBe(BASIC_FLOWER);
			expect(tile.basicColorCode).toBe('R');
			expect(tile.basicColorName).toBe('Red');
			expect(tile.basicValue).toBe('4');
			expect(tile.ownerCode).toBe('H');
			expect(tile.ownerName).toBe(HOST);
		});

		it('should create White basic flower tiles correctly', () => {
			const tile = new SkudPaiShoTile('W5', 'G');
			expect(tile.type).toBe(BASIC_FLOWER);
			expect(tile.basicColorCode).toBe('W');
			expect(tile.basicColorName).toBe('White');
			expect(tile.basicValue).toBe('5');
			expect(tile.ownerCode).toBe('G');
			expect(tile.ownerName).toBe(GUEST);
		});
	});

	describe('Special Flower Tiles', () => {
		it('should create White Lotus tile correctly', () => {
			const tile = new SkudPaiShoTile('L', 'H');
			expect(tile.type).toBe(SPECIAL_FLOWER);
			expect(tile.specialFlowerType).toBe(WHITE_LOTUS);
		});

		it('should create Orchid tile correctly', () => {
			const tile = new SkudPaiShoTile('O', 'G');
			expect(tile.type).toBe(SPECIAL_FLOWER);
			expect(tile.specialFlowerType).toBe(ORCHID);
		});
	});

	describe('Accent Tiles', () => {
		it('should create Rock tile correctly', () => {
			const tile = new SkudPaiShoTile('R', 'H');
			expect(tile.type).toBe(ACCENT_TILE);
			expect(tile.accentType).toBe(ROCK);
		});

		it('should create Wheel tile correctly', () => {
			const tile = new SkudPaiShoTile('W', 'H');
			expect(tile.type).toBe(ACCENT_TILE);
			expect(tile.accentType).toBe(WHEEL);
		});

		it('should create Knotweed tile correctly', () => {
			const tile = new SkudPaiShoTile('K', 'G');
			expect(tile.type).toBe(ACCENT_TILE);
			expect(tile.accentType).toBe(KNOTWEED);
		});

		it('should create Boat tile correctly', () => {
			const tile = new SkudPaiShoTile('B', 'G');
			expect(tile.type).toBe(ACCENT_TILE);
			expect(tile.accentType).toBe(BOAT);
		});
	});

	describe('Harmony Formation', () => {
		it('should form harmony between same-color flowers with value difference of 1', () => {
			const tile1 = new SkudPaiShoTile('R3', 'H');
			const tile2 = new SkudPaiShoTile('R4', 'H');
			expect(tile1.formsHarmonyWith(tile2)).toBe(true);
		});

		it('should form harmony between different-color flowers with value difference of 2', () => {
			const tile1 = new SkudPaiShoTile('R3', 'H');
			const tile2 = new SkudPaiShoTile('W5', 'H');
			expect(tile1.formsHarmonyWith(tile2)).toBe(true);
		});

		it('should NOT form harmony between flowers with wrong value differences', () => {
			const tile1 = new SkudPaiShoTile('R3', 'H');
			const tile2 = new SkudPaiShoTile('R5', 'H'); // Same color, diff of 2
			expect(tile1.formsHarmonyWith(tile2)).toBeFalsy();
		});

		it('should NOT form harmony between different owners (without Lion Turtle)', () => {
			const tile1 = new SkudPaiShoTile('R3', 'H');
			const tile2 = new SkudPaiShoTile('R4', 'G');
			expect(tile1.formsHarmonyWith(tile2)).toBeFalsy();
		});

		it('should form harmony between White Lotus and any basic flower', () => {
			const lotus = new SkudPaiShoTile('L', 'H');
			const flower = new SkudPaiShoTile('R3', 'G'); // Different owner
			expect(lotus.formsHarmonyWith(flower)).toBe(true);
			expect(flower.formsHarmonyWith(lotus)).toBe(true);
		});

		it('should NOT form harmony between accent tiles', () => {
			const rock = new SkudPaiShoTile('R', 'H');
			const wheel = new SkudPaiShoTile('W', 'H');
			expect(rock.formsHarmonyWith(wheel)).toBeFalsy();
		});

		it('should NOT form harmony with drained tiles', () => {
			const tile1 = new SkudPaiShoTile('R3', 'H');
			const tile2 = new SkudPaiShoTile('R4', 'H');
			tile2.drained = true;
			expect(tile1.formsHarmonyWith(tile2)).toBeFalsy();
		});
	});

	describe('Tile Display', () => {
		it('should return correct image name', () => {
			const hostTile = new SkudPaiShoTile('R4', 'H');
			const guestTile = new SkudPaiShoTile('W3', 'G');
			expect(hostTile.getImageName()).toBe('HR4');
			expect(guestTile.getImageName()).toBe('GW3');
		});

		it('should return correct console display', () => {
			const tile = new SkudPaiShoTile('R4', 'H');
			expect(tile.getConsoleDisplay()).toBe('HR4');

			tile.drained = true;
			expect(tile.getConsoleDisplay()).toBe('*R4');
		});
	});
});

describe('SkudPaiShoTileManager', () => {
	let tileManager;

	beforeEach(() => {
		tileManager = new SkudPaiShoTileManager();
	});

	describe('Tile Set Loading', () => {
		it('should load tiles for both players', () => {
			expect(tileManager.hostTiles.length).toBeGreaterThan(0);
			expect(tileManager.guestTiles.length).toBeGreaterThan(0);
		});

		it('should have basic flowers in tile set', () => {
			const hostBasicFlowers = tileManager.hostTiles.filter(t => t.type === BASIC_FLOWER);
			expect(hostBasicFlowers.length).toBeGreaterThan(0);
		});

		it('should have special flowers in tile set', () => {
			const hostSpecialFlowers = tileManager.hostTiles.filter(t => t.type === SPECIAL_FLOWER);
			expect(hostSpecialFlowers.length).toBe(2); // Lotus and Orchid
		});

		it('should have accent tiles in tile set', () => {
			const hostAccentTiles = tileManager.hostTiles.filter(t => t.type === ACCENT_TILE);
			expect(hostAccentTiles.length).toBeGreaterThan(0);
		});
	});

	describe('Tile Retrieval', () => {
		it('should have tiles accessible by player arrays', () => {
			expect(tileManager.hostTiles).toBeDefined();
			expect(tileManager.guestTiles).toBeDefined();
			expect(tileManager.hostTiles.length).toBeGreaterThan(0);
			expect(tileManager.guestTiles.length).toBeGreaterThan(0);
		});

		it('should get tile by code using grabTile', () => {
			const tile = tileManager.grabTile(HOST, 'R4');
			expect(tile).not.toBeNull();
			expect(tile.code).toBe('R4');
			expect(tile.ownerName).toBe(HOST);
		});
	});

	describe('Accent Tile Management', () => {
		it('should have accent tiles in host tiles', () => {
			const accentTiles = tileManager.hostTiles.filter(t => t.type === ACCENT_TILE);
			expect(accentTiles.length).toBeGreaterThan(0);
			accentTiles.forEach(tile => {
				expect(tile.type).toBe(ACCENT_TILE);
			});
		});

		it('should have accent tiles marked as selected from pile initially', () => {
			// In Skud set, accent tiles start with selectedFromPile = true
			const selectedAccent = tileManager.hostTiles.filter(t => t.type === ACCENT_TILE && t.selectedFromPile);
			expect(selectedAccent.length).toBeGreaterThan(0);
		});
	});
});

describe('SkudPaiShoBoard', () => {
	let board;

	beforeEach(() => {
		board = new SkudPaiShoBoard();
	});

	describe('Board Setup', () => {
		it('should create a 17x17 board', () => {
			expect(board.cells.length).toBe(17);
		});

		it('should have gates on the board', () => {
			let gateCount = 0;
			for (let row = 0; row < board.cells.length; row++) {
				if (board.cells[row]) {
					for (let col = 0; col < board.cells[row].length; col++) {
						const point = board.cells[row][col];
						if (point && point.isType(GATE)) {
							gateCount++;
						}
					}
				}
			}
			expect(gateCount).toBe(4); // 4 gates
		});

		it('should have no winners initially', () => {
			expect(board.winners.length).toBe(0);
		});
	});

	describe('Point Types', () => {
		it('should have different point types', () => {
			let hasNeutral = false;
			let hasGate = false;

			for (let row = 0; row < board.cells.length; row++) {
				if (board.cells[row]) {
					for (let col = 0; col < board.cells[row].length; col++) {
						const point = board.cells[row][col];
						if (point) {
							if (point.isType(NEUTRAL)) hasNeutral = true;
							if (point.isType(GATE)) hasGate = true;
						}
					}
				}
			}

			expect(hasNeutral).toBe(true);
			expect(hasGate).toBe(true);
		});
	});

	describe('Tile Placement', () => {
		it('should place tile on board', () => {
			const tile = new SkudPaiShoTile('R4', 'H');
			const point = board.cells[8][8]; // Center point
			if (point) {
				point.putTile(tile);
				expect(point.hasTile()).toBe(true);
				expect(point.tile).toBe(tile);
			}
		});

		it('should remove tile from board', () => {
			const tile = new SkudPaiShoTile('R4', 'H');
			const point = board.cells[8][8];
			if (point) {
				point.putTile(tile);
				const removed = point.removeTile();
				expect(removed).toBe(tile);
				expect(point.hasTile()).toBe(false);
			}
		});
	});
});

describe('Skud Pai Sho - Harmony Chains', () => {
	let gameManager;
	const mockActuator = { actuate: vi.fn() };

	beforeEach(() => {
		gameManager = new SkudPaiShoGameManager(mockActuator, true, true);
	});

	it('should track harmonies on the board', () => {
		expect(gameManager.board.harmonyManager).toBeDefined();
	});

	it('should have empty harmonies initially', () => {
		const harmonies = gameManager.board.harmonyManager.harmonies;
		expect(harmonies.length).toBe(0);
	});
});

describe('Skud Pai Sho - Win Conditions', () => {
	let gameManager;
	const mockActuator = { actuate: vi.fn() };

	beforeEach(() => {
		gameManager = new SkudPaiShoGameManager(mockActuator, true, true);
	});

	it('should have no winner initially', () => {
		expect(gameManager.board.winners.length).toBe(0);
	});

	it('should track winners in board', () => {
		// Manually add a winner to test tracking
		gameManager.board.winners.push(HOST);
		expect(gameManager.board.winners).toContain(HOST);
	});
});
