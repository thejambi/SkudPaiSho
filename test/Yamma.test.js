/**
 * Yamma Game Test
 * Tests game notation replay and projected view validation
 */

import { describe, it, expect, vi, beforeAll } from 'vitest';

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
			Yamma: { id: 100, name: 'Yamma' }
		},
		ggOptions: []
	};
});

// Import after mocking
import { YammaNotationMove } from '../js/yamma/YammaGameNotation';
import { YammaGameManager } from '../js/yamma/YammaGameManager';
import { YammaBoard, PLAYER } from '../js/yamma/YammaBoard';

describe('Yamma Game - Notation Parsing', () => {
	it('should parse Host move notation correctly', () => {
		const move = new YammaNotationMove('H:5,0,0,0');

		expect(move.player).toBe('HOST');
		expect(move.row).toBe(5);
		expect(move.col).toBe(0);
		expect(move.level).toBe(0);
		expect(move.rotation).toBe(0);
	});

	it('should parse Guest move notation correctly', () => {
		const move = new YammaNotationMove('G:5,5,0,0');

		expect(move.player).toBe('GUEST');
		expect(move.row).toBe(5);
		expect(move.col).toBe(5);
		expect(move.level).toBe(0);
		expect(move.rotation).toBe(0);
	});

	it('should parse move with level correctly', () => {
		const move = new YammaNotationMove('H:4,2,1,0');

		expect(move.player).toBe('HOST');
		expect(move.row).toBe(4);
		expect(move.col).toBe(2);
		expect(move.level).toBe(1);
		expect(move.rotation).toBe(0);
	});
});

describe('Yamma Game - Projected Views', () => {
	let gameManager;
	let board;

	beforeAll(() => {
		// Create a mock actuator
		const mockActuator = {
			actuate: vi.fn()
		};

		// Initialize game manager
		gameManager = new YammaGameManager(mockActuator);

		// Run the test game notation
		const gameNotation = [
			'H:5,0,0,0',
			'G:5,5,0,0',
			'H:0,0,0,0',
			'G:5,2,0,0',
			'H:4,2,0,0',
			'G:5,3,0,0',
			'H:4,2,1,0'
		];

		gameNotation.forEach((notationText) => {
			const move = new YammaNotationMove(notationText);
			gameManager.runNotationMove(move, false);
		});

		board = gameManager.board;
	});

	/**
	 * Helper function to convert a projected view to a string representation
	 * W = White, B = Blue, x = empty
	 */
	function viewToString(view) {
		const lines = [];
		for (let row = 0; row < view.length; row++) {
			let line = '';
			for (let col = 0; col <= row; col++) {
				const color = view[row][col];
				if (color === PLAYER.WHITE) {
					line += 'W';
				} else if (color === PLAYER.BLUE) {
					line += 'B';
				} else {
					line += 'x';
				}
			}
			lines.push(line);
		}
		return lines.join('\n');
	}

	/**
	 * Helper function to parse expected view string into comparable format
	 */
	function parseExpectedView(viewString) {
		return viewString.trim().split('\n').map(line => line.trim());
	}

	it('should produce correct Front view after game moves', () => {
		const frontView = board.buildProjectedView(0); // Front = angle 0
		const viewString = viewToString(frontView);

		const expectedFront = `
B
xx
xxx
xxxx
xxBxx
BxWWxW
		`;

		const expected = parseExpectedView(expectedFront);
		const actual = viewString.split('\n');

		console.log('Front View (actual):');
		console.log(viewString);
		console.log('\nFront View (expected):');
		console.log(expected.join('\n'));

		expect(actual).toEqual(expected);
	});

	it('should produce correct Left view after game moves', () => {
		const leftView = board.buildProjectedView(1); // Left = angle 1
		const viewString = viewToString(leftView);

		const expectedLeft = `
B
xx
xxW
xxWB
xxxxx
WxxxxW
		`;

		const expected = parseExpectedView(expectedLeft);
		const actual = viewString.split('\n');

		console.log('Left View (actual):');
		console.log(viewString);
		console.log('\nLeft View (expected):');
		console.log(expected.join('\n'));

		expect(actual).toEqual(expected);
	});

	it('should produce correct Right view after game moves', () => {
		const rightView = board.buildProjectedView(2); // Right = angle 2
		const viewString = viewToString(rightView);

		const expectedRight = `
W
xx
Wxx
BWxx
xxxxx
BxxxxW
		`;

		const expected = parseExpectedView(expectedRight);
		const actual = viewString.split('\n');

		console.log('Right View (actual):');
		console.log(viewString);
		console.log('\nRight View (expected):');
		console.log(expected.join('\n'));

		expect(actual).toEqual(expected);
	});
});

describe('Yamma Game - Board State', () => {
	it('should correctly place cubes and track their positions', () => {
		const board = new YammaBoard();

		// Place a cube at level 0
		const cube1 = board.placeCube(5, 0, 0, PLAYER.WHITE, 0);
		expect(cube1).not.toBeNull();
		expect(cube1.owner).toBe(PLAYER.WHITE);
		expect(cube1.row).toBe(5);
		expect(cube1.col).toBe(0);
		expect(cube1.level).toBe(0);

		// Verify we can retrieve it
		const retrieved = board.getCubeAt(5, 0, 0);
		expect(retrieved).toBe(cube1);
	});

	it('should require support for cubes at higher levels', () => {
		const board = new YammaBoard();

		// Cannot place at level 1 without support
		expect(board.canPlaceCube(0, 0, 1)).toBe(false);

		// Place 3 supporting cubes at level 0
		board.placeCube(0, 0, 0, PLAYER.WHITE, 0);
		board.placeCube(1, 0, 0, PLAYER.WHITE, 0);
		board.placeCube(1, 1, 0, PLAYER.WHITE, 0);

		// Now we can place at level 1
		expect(board.canPlaceCube(0, 0, 1)).toBe(true);
	});
});

describe('Yamma Game - Win Checking', () => {
	it('should detect 4-in-a-row down-left diagonal', () => {
		const board = new YammaBoard();

		// Place 4 Blue cubes in a down-left diagonal: (2,0), (3,0), (4,0), (5,0)
		// Down-left diagonal goes (row, col) -> (row+1, col)
		// With rotation 0, Blue cubes show White on rightFace (Front view)
		board.placeCube(2, 0, 0, PLAYER.BLUE, 0);
		board.placeCube(3, 0, 0, PLAYER.BLUE, 0);
		board.placeCube(4, 0, 0, PLAYER.BLUE, 0);
		board.placeCube(5, 0, 0, PLAYER.BLUE, 0);

		// Check for winner - Blue cubes show White on Front view (rightFace)
		const result = board.checkWinner();
		expect(result).not.toBeNull();
		expect(result.winner).toBe(PLAYER.WHITE); // rightFace of Blue cubes = White
		expect(result.angle).toBe(0); // Front view
	});

	it('should detect 4-in-a-row diagonally', () => {
		const board = new YammaBoard();

		// Place 4 white cubes diagonally: (2,0), (3,1), (4,2), (5,3)
		// These form a down-right diagonal
		board.placeCube(2, 0, 0, PLAYER.WHITE, 0);
		board.placeCube(3, 1, 0, PLAYER.WHITE, 0);
		board.placeCube(4, 2, 0, PLAYER.WHITE, 0);
		board.placeCube(5, 3, 0, PLAYER.WHITE, 0);

		// From Front view, White cubes show Blue (rightFace)
		const result = board.checkWinner();
		expect(result).not.toBeNull();
		expect(result.winner).toBe(PLAYER.BLUE); // rightFace of White cubes = Blue
	});

	it('should not detect a winner with only 3 in a row', () => {
		const board = new YammaBoard();

		// Place only 3 cubes in a row
		board.placeCube(5, 0, 0, PLAYER.WHITE, 0);
		board.placeCube(5, 1, 0, PLAYER.WHITE, 0);
		board.placeCube(5, 2, 0, PLAYER.WHITE, 0);

		const result = board.checkWinner();
		expect(result).toBeNull();
	});

	it('should not count diagonal corners as adjacent (only sides touching)', () => {
		const board = new YammaBoard();

		// Place cubes that only touch at corners, not sides
		// In the triangular grid, (0,0), (1,0), (2,0), (3,0) is a down-left diagonal
		// which DOES count (sides touch)
		// But alternating positions would not form a line
		board.placeCube(5, 0, 0, PLAYER.WHITE, 0);
		board.placeCube(5, 2, 0, PLAYER.WHITE, 0);
		board.placeCube(5, 4, 0, PLAYER.WHITE, 0);
		// These are not adjacent - there are gaps

		const result = board.checkWinner();
		expect(result).toBeNull();
	});
});
