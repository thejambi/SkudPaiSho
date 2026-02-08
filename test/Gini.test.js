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
import { ACCENT_TILE_HOME, GiniGameManager } from '../js/gini/GiniGameManager';
import { NotationPoint, MOVE, HOST, GUEST } from '../js/CommonNotationObjects';
import { GiniTileInfo, GiniTiles, GiniTileCodes } from '../js/gini/GiniTiles';
import { NON_PLAYABLE, NEUTRAL } from '../js/skud-pai-sho/SkudPaiShoBoardPoint';
import { RED, WHITE } from '../js/skud-pai-sho/SkudPaiShoTile';
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

	it('should mark accent tile positions with ACCENT_TILE_HOME type', () => {
		const game = createGame();
		var hostPositions = ["5,4", "5,5", "6,4", "6,5"];
		var guestPositions = ["-6,-5", "-6,-4", "-5,-5", "-5,-4"];
		hostPositions.concat(guestPositions).forEach(pos => {
			expect(getPointTypes(game, pos)).toContain(ACCENT_TILE_HOME);
		});
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

// ─── Board Layout Tests ───

describe('Gini Board Layout', () => {
	it('should make pure Neutral garden points NON_PLAYABLE', () => {
		const game = createGame();
		// "-4,8" → row 0, col 4: a pure neutral point in the top corner
		expect(getPointTypes(game, '-4,8')).toContain(NON_PLAYABLE);
		expect(getPointTypes(game, '-4,8')).toContain(NEUTRAL);
	});

	it('should keep Red/White border points playable', () => {
		const game = createGame();
		// "-4,3" → row 5, col 4: whiteNeutral border point
		var whiteNeutralPoint = getPointTypes(game, '-4,3');
		expect(whiteNeutralPoint).toContain(WHITE);
		expect(whiteNeutralPoint).toContain(NEUTRAL);
		expect(whiteNeutralPoint).not.toContain(NON_PLAYABLE);

		// "4,3" → row 5, col 12: redNeutral border point
		var redNeutralPoint = getPointTypes(game, '4,3');
		expect(redNeutralPoint).toContain(RED);
		expect(redNeutralPoint).toContain(NEUTRAL);
		expect(redNeutralPoint).not.toContain(NON_PLAYABLE);
	});

	it('should keep Red and White garden points playable', () => {
		const game = createGame();
		// A pure red point
		var redPoint = getPointTypes(game, '1,0');
		expect(redPoint).toContain(RED);
		expect(redPoint).not.toContain(NON_PLAYABLE);

		// A pure white point
		var whitePoint = getPointTypes(game, '-1,0');
		expect(whitePoint).toContain(WHITE);
		expect(whitePoint).not.toContain(NON_PLAYABLE);
	});

	it('should keep accent tile home positions playable despite being in neutral zone', () => {
		const game = createGame();
		var accentPoint = getPointTypes(game, '5,4');
		expect(accentPoint).toContain(ACCENT_TILE_HOME);
		expect(accentPoint).not.toContain(NON_PLAYABLE);
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

// ─── Accent Tile Movement Tests ───

describe('Gini Accent Tile Movement', () => {
	it('should move an accent tile from home to a playable position', () => {
		const game = createGame();
		// Move Guest Water accent tile from home "-6,-5" to an empty spot "-3,1" (white garden)
		makeMove(game, GUEST, '-6,-5', '-3,1', 0);

		expect(isEmptyAt(game, '-6,-5')).toBe(true);
		expect(getTileAt(game, '-3,1').code).toBe(GiniTileCodes.Water);
	});

	it('should preserve accent tile ownership after move', () => {
		const game = createGame();
		makeMove(game, GUEST, '-6,-5', '-3,1', 0);

		expect(getTileAt(game, '-3,1').ownerName).toBe(GUEST);
	});

	it('should allow Host accent tile movement', () => {
		const game = createGame();
		// Move Host Fire accent tile from home "6,4" to an empty spot "3,1" (red garden)
		makeMove(game, HOST, '6,4', '3,1', 0);

		expect(isEmptyAt(game, '6,4')).toBe(true);
		expect(getTileAt(game, '3,1').code).toBe(GiniTileCodes.Fire);
		expect(getTileAt(game, '3,1').ownerName).toBe(HOST);
	});

	it('should not capture tiles along the accent tile movement path', () => {
		const game = createGame();
		// Host Dragon is at "5,1", which is between accent home "6,4" and a destination
		// Verify Dragon stays in place after accent tile move
		expect(getTileAt(game, '5,1').code).toBe(GiniTileCodes.Dragon);

		makeMove(game, HOST, '6,4', '3,1', 0);

		// Dragon should still be there
		expect(getTileAt(game, '5,1').code).toBe(GiniTileCodes.Dragon);
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

// ─── Earth Rotation Tests ───

describe('Gini Earth Accent Tile - Rotate Surrounding Tiles', () => {
	/**
	 * Helper: manually move a tile from one notation position to another (no game logic)
	 */
	function manualMoveTile(game, fromStr, toStr) {
		const fromNp = new NotationPoint(fromStr);
		const fromRc = fromNp.rowAndColumn;
		const toNp = new NotationPoint(toStr);
		const toRc = toNp.rowAndColumn;
		const tile = game.board.cells[fromRc.row][fromRc.col].removeTile();
		game.board.cells[toRc.row][toRc.col].putTile(tile);
	}

	it('should rotate surrounding tiles clockwise when Earth is placed', () => {
		const game = createGame();

		// Set up: move Guest Koi from (-4,2) to (0,1) — a white garden point
		manualMoveTile(game, '-4,2', '0,1');
		// Move Guest Dragon from (-5,-1) to (1,0) — a red garden point (south of 0,1)
		manualMoveTile(game, '-5,-1', '1,0');

		// Verify setup
		expect(getTileAt(game, '0,1').code).toBe(GiniTileCodes.Koi);
		expect(getTileAt(game, '1,0').code).toBe(GiniTileCodes.Dragon);

		// Now move Guest Earth accent tile from home to (0,0) — center, between the two tiles
		// (0,0) = row 8, col 8. Koi at (0,1) = row 7, col 8 — directly above. Dragon at (1,0) = row 7, col 9 — top-right.
		// Wait, let me recalculate. NotationPoint "x,y": row = 8-y, col = x+8.
		// (0,0) → row=8, col=8
		// (0,1) → row=7, col=8 — that's directly above (0,0) in row terms
		// (1,0) → row=8, col=9 — that's directly to the right of (0,0)
		// Clockwise from top: top(row-1,col) → top-right(row-1,col+1) → right(row,col+1) → ...
		// Koi at top (row 7, col 8), Dragon at right (row 8, col 9)
		// After clockwise rotation: Koi moves from top to top-right, Dragon moves from right to bottom-right
		makeMove(game, GUEST, '-6,-4', '0,0', 0);

		// Earth should now be at (0,0)
		expect(getTileAt(game, '0,0').code).toBe(GiniTileCodes.Earth);

		// Koi was at top (0,1) → should rotate to top-right (1,1)
		expect(isEmptyAt(game, '0,1')).toBe(true);
		expect(getTileAt(game, '1,1').code).toBe(GiniTileCodes.Koi);

		// Dragon was at right (1,0) → should rotate to bottom-right (1,-1)
		expect(isEmptyAt(game, '1,0')).toBe(true);
		expect(getTileAt(game, '1,-1').code).toBe(GiniTileCodes.Dragon);
	});

	it('should not move the Earth tile itself during rotation', () => {
		const game = createGame();
		manualMoveTile(game, '-4,2', '0,1');

		makeMove(game, GUEST, '-6,-4', '0,0', 0);

		expect(getTileAt(game, '0,0').code).toBe(GiniTileCodes.Earth);
	});

	it('should handle rotation with no surrounding tiles', () => {
		const game = createGame();

		// Move Earth to an isolated empty area — (0,0) center with no surrounding tiles
		// Clear any tiles near center first
		// At game start, no tiles near center, so this should work
		makeMove(game, GUEST, '-6,-4', '0,0', 0);

		// Earth should be placed without error
		expect(getTileAt(game, '0,0').code).toBe(GiniTileCodes.Earth);
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
