/**
 * Gini Pai Sho Game Tests
 * Tests board setup, tile movement, abilities, and win conditions
 */

import { describe, it, expect, vi } from 'vitest';

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
			GiniPaiSho: { id: 210, name: 'Gini Pai Sho' }
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
import { GiniGameManager } from '../js/gini/GiniGameManager';
import { NotationPoint, MOVE, HOST, GUEST } from '../js/CommonNotationObjects';
import { GiniTileInfo, GiniTiles, GiniTileCodes } from '../js/gini/GiniTiles';
import { setCurrentTileMetadata, setCurrentTileCodes } from '../js/trifle/PaiShoGamesTileMetadata';

// Initialize tile metadata (normally done by GiniController)
GiniTileInfo.initializeTrifleData();
setCurrentTileMetadata(GiniTiles);
setCurrentTileCodes(GiniTileCodes);

/**
 * Create a fresh Gini game
 */
function createGame() {
	const mockActuator = { actuate: vi.fn() };
	return new GiniGameManager(mockActuator, true, true);
}

/**
 * Get the tile at a given internal notation position (e.g. "6,0")
 */
function getTileAt(game, notationStr) {
	const np = new NotationPoint(notationStr);
	const rc = np.rowAndColumn;
	const point = game.board.cells[rc.row][rc.col];
	return point.hasTile() ? point.tile : null;
}

/**
 * Check if a position has no tile
 */
function isEmptyAt(game, notationStr) {
	return getTileAt(game, notationStr) === null;
}

/**
 * Make a move and return any neededPromptInfo
 */
function makeMove(game, player, startStr, endStr, moveNum, promptTargetData) {
	const move = {
		moveNum: moveNum || 0,
		player: player,
		moveType: MOVE,
		startPoint: startStr,
		endPoint: endStr
	};
	if (promptTargetData) {
		move.promptTargetData = promptTargetData;
	}
	return game.runNotationMove(move, false);
}

/**
 * Get the board point types at a given notation position
 */
function getPointTypes(game, notationStr) {
	const np = new NotationPoint(notationStr);
	const rc = np.rowAndColumn;
	return game.board.cells[rc.row][rc.col].types;
}

// ─── Board Setup Tests ───

describe('Gini Board Setup', () => {
	it('should place all Host main tiles at correct starting positions', () => {
		const game = createGame();
		expect(getTileAt(game, '6,0').code).toBe(GiniTileCodes.WhiteLotus);
		expect(getTileAt(game, '5,-1').code).toBe(GiniTileCodes.Badgermole);
		expect(getTileAt(game, '5,1').code).toBe(GiniTileCodes.Dragon);
		expect(getTileAt(game, '4,-2').code).toBe(GiniTileCodes.Koi);
		expect(getTileAt(game, '4,2').code).toBe(GiniTileCodes.Bison);
		expect(getTileAt(game, '4,0').code).toBe(GiniTileCodes.Ginseng);
	});

	it('should place all Guest main tiles at correct starting positions', () => {
		const game = createGame();
		expect(getTileAt(game, '-6,0').code).toBe(GiniTileCodes.WhiteLotus);
		expect(getTileAt(game, '-5,1').code).toBe(GiniTileCodes.Badgermole);
		expect(getTileAt(game, '-5,-1').code).toBe(GiniTileCodes.Dragon);
		expect(getTileAt(game, '-4,2').code).toBe(GiniTileCodes.Koi);
		expect(getTileAt(game, '-4,-2').code).toBe(GiniTileCodes.Bison);
		expect(getTileAt(game, '-4,0').code).toBe(GiniTileCodes.Ginseng);
	});

	it('should place Host accent tiles at home positions', () => {
		const game = createGame();
		expect(getTileAt(game, '5,4').code).toBe(GiniTileCodes.Water);
		expect(getTileAt(game, '5,5').code).toBe(GiniTileCodes.Earth);
		expect(getTileAt(game, '6,4').code).toBe(GiniTileCodes.Fire);
		expect(getTileAt(game, '6,5').code).toBe(GiniTileCodes.Air);
	});

	it('should place Guest accent tiles at home positions', () => {
		const game = createGame();
		expect(getTileAt(game, '-6,-5').code).toBe(GiniTileCodes.Water);
		expect(getTileAt(game, '-6,-4').code).toBe(GiniTileCodes.Earth);
		expect(getTileAt(game, '-5,-5').code).toBe(GiniTileCodes.Fire);
		expect(getTileAt(game, '-5,-4').code).toBe(GiniTileCodes.Air);
	});

	it('should have Host main tiles owned by HOST', () => {
		const game = createGame();
		expect(getTileAt(game, '6,0').ownerName).toBe(HOST);
		expect(getTileAt(game, '4,0').ownerName).toBe(HOST);
	});

	it('should have Guest main tiles owned by GUEST', () => {
		const game = createGame();
		expect(getTileAt(game, '-6,0').ownerName).toBe(GUEST);
		expect(getTileAt(game, '-4,0').ownerName).toBe(GUEST);
	});
});

// ─── Basic Movement Tests ───

describe('Gini Basic Movement', () => {
	it('should move a tile from start to end position', () => {
		const game = createGame();
		// Move Guest Ginseng from (-4,0) to (-3,0) — 1 space
		makeMove(game, GUEST, '-4,0', '-3,0', 0);

		expect(isEmptyAt(game, '-4,0')).toBe(true);
		expect(getTileAt(game, '-3,0').code).toBe(GiniTileCodes.Ginseng);
	});

	it('should preserve tile ownership after move', () => {
		const game = createGame();
		makeMove(game, GUEST, '-4,0', '-3,0', 0);

		expect(getTileAt(game, '-3,0').ownerName).toBe(GUEST);
	});
});

// ─── Win Condition Tests ───

describe('Gini Win Condition', () => {
	it('should not have a winner at game start', () => {
		const game = createGame();
		expect(game.getWinner()).toBeUndefined();
		expect(game.hasEnded()).toBeFalsy();
	});

	it('should detect HOST win when Host White Lotus reaches negative x', () => {
		const game = createGame();
		// Manually place Host White Lotus on the Guest side (negative x)
		const lotusPoint = new NotationPoint('6,0');
		const lotusRC = lotusPoint.rowAndColumn;
		const tile = game.board.cells[lotusRC.row][lotusRC.col].removeTile();

		const destPoint = new NotationPoint('-1,0');
		const destRC = destPoint.rowAndColumn;
		game.board.cells[destRC.row][destRC.col].putTile(tile);

		game.checkForWin();
		expect(game.getWinner()).toBe(HOST);
	});

	it('should detect GUEST win when Guest White Lotus reaches positive x', () => {
		const game = createGame();
		// Manually place Guest White Lotus on the Host side (positive x)
		const lotusPoint = new NotationPoint('-6,0');
		const lotusRC = lotusPoint.rowAndColumn;
		const tile = game.board.cells[lotusRC.row][lotusRC.col].removeTile();

		const destPoint = new NotationPoint('1,0');
		const destRC = destPoint.rowAndColumn;
		game.board.cells[destRC.row][destRC.col].putTile(tile);

		game.checkForWin();
		expect(game.getWinner()).toBe(GUEST);
	});

	it('should not detect win when White Lotus is still on own side', () => {
		const game = createGame();
		// Host Lotus at x=6 (positive, own side)
		game.checkForWin();
		expect(game.getWinner()).toBeUndefined();
	});
});

// ─── Game Log Tests ───

describe('Gini Game Log', () => {
	it('should generate move log text', () => {
		const game = createGame();
		makeMove(game, GUEST, '-4,0', '-3,0', 0);

		expect(game.gameLogText).toContain('moved');
		expect(game.gameLogText).toContain('Ginseng');
	});
});
