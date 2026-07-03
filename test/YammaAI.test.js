/**
 * Yamma Strategic AI Tests
 * Tests tactical correctness (winning, blocking, avoiding suicidal rotations)
 * and overall playing strength.
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
		HOST: 'HOST',
		GUEST: 'GUEST',
		gameId: -1,
		currentMoveIndex: 0,
		GameType: {
			Yamma: { id: 100, name: 'Yamma' }
		},
		ggOptions: []
	};
});

import { YammaGameManager } from '../js/yamma/YammaGameManager';
import { PLAYER } from '../js/yamma/YammaBoard';
import { YammaStrategicAI } from '../js/yamma/ai/YammaStrategicAI';
import { YammaRandomAI } from '../js/yamma/ai/YammaRandomAI';
import { HOST, GUEST } from '../js/CommonNotationObjects';

/**
 * Rotation cheat sheet for these tests (see YammaCube):
 * - A cube shows its owner's color in two views and the opponent's in one.
 * - View v sees cube face index (v + 2) % 3, where faces (for rotation 0)
 *   are [owner, owner, opponent] rotated left by `rotation`.
 * - For a cube in column 0 of the base level at (r, 0, 0):
 *   view 0 projects to (r, 0), view 1 to (5, r), view 2 to (5-r, 5-r).
 */

function playFullGame(hostAi, guestAi) {
	const manager = new YammaGameManager();
	hostAi.setPlayer(HOST);
	guestAi.setPlayer(GUEST);

	let safety = 0;
	while (!manager.hasEnded() && safety < 60) {
		const ai = manager.moveCount % 2 === 0 ? hostAi : guestAi;
		const move = ai.getMove(manager.getCopy(), Math.floor(manager.moveCount / 2) + 1);
		expect(move).toBeTruthy();
		manager.runNotationMove(move);
		safety++;
	}
	return manager.getWinner();
}

describe('Yamma Strategic AI - Tactics', () => {
	it('returns a legal move on an empty board', () => {
		const manager = new YammaGameManager();
		const ai = new YammaStrategicAI(200);
		ai.setPlayer(HOST);

		const move = ai.getMove(manager.getCopy(), 1);
		expect(move).toBeTruthy();
		manager.runNotationMove(move);
		expect(manager.board.getAllCubes().length).toBe(1);
	});

	it('takes an immediate winning move', () => {
		const manager = new YammaGameManager();
		// White has 3-in-a-row down column 0 in the Front view (rotation 2
		// shows white in views 0 and 2). (2,0,0) completes 4-in-a-row.
		manager.board.placeCube(3, 0, 0, PLAYER.WHITE, 2);
		manager.board.placeCube(4, 0, 0, PLAYER.WHITE, 2);
		manager.board.placeCube(5, 0, 0, PLAYER.WHITE, 2);
		// Scattered blue cubes with no threats
		manager.board.placeCube(5, 1, 0, PLAYER.BLUE, 0);
		manager.board.placeCube(4, 3, 0, PLAYER.BLUE, 0);
		manager.moveCount = 5;

		const ai = new YammaStrategicAI(500);
		ai.setPlayer(HOST);

		const move = ai.getMove(manager.getCopy(), 4);
		expect(move).toBeTruthy();
		expect({ row: move.row, col: move.col, level: move.level })
			.toEqual({ row: 2, col: 0, level: 0 });

		manager.runNotationMove(move);
		expect(manager.getWinner()).toBe(HOST);
	});

	it('blocks the opponent\'s win with the only safe rotation', () => {
		const manager = new YammaGameManager();
		// Blue has 3-in-a-row down column 0 in the Front view AND along the
		// (0,0),(1,1),(2,2) diagonal of the Right view (rotation 2 shows blue
		// in views 0 and 2). Blue wins next turn at (2,0,0) with any rotation.
		manager.board.placeCube(3, 0, 0, PLAYER.BLUE, 2);
		manager.board.placeCube(4, 0, 0, PLAYER.BLUE, 2);
		manager.board.placeCube(5, 0, 0, PLAYER.BLUE, 2);
		// White cubes elsewhere, no threats (rotation 1 keeps their blue
		// faces harmless in view 2)
		manager.board.placeCube(5, 3, 0, PLAYER.WHITE, 1);
		manager.board.placeCube(5, 4, 0, PLAYER.WHITE, 1);
		manager.moveCount = 6;

		const ai = new YammaStrategicAI(1000);
		ai.setPlayer(HOST);

		const move = ai.getMove(manager.getCopy(), 4);
		expect(move).toBeTruthy();

		// The only defense: occupy (2,0,0). White's cube at (2,0,0) projects
		// into both of blue's lines, so rotations 0 and 1 would complete a
		// blue 4-in-a-row instantly (white cubes have one blue face).
		// Only rotation 2 blocks safely.
		expect({ row: move.row, col: move.col, level: move.level, rotation: move.rotation })
			.toEqual({ row: 2, col: 0, level: 0, rotation: 2 });

		manager.runNotationMove(move);
		expect(manager.getWinner()).toBe(null);

		// Verify no immediate blue win remains anywhere
		const positions = manager.board.getPossibleMoves();
		for (const pos of positions) {
			for (let rotation = 0; rotation < 3; rotation++) {
				const boardCopy = manager.board.getCopy();
				boardCopy.placeCube(pos.row, pos.col, pos.level, PLAYER.BLUE, rotation);
				const result = boardCopy.checkWinner(PLAYER.BLUE);
				expect(result && result.winner === PLAYER.BLUE).toBeFalsy();
			}
		}
	});
});

describe('Yamma Strategic AI - Strength', () => {
	it('beats the Random AI as Host', () => {
		const winner = playFullGame(new YammaStrategicAI(100), new YammaRandomAI());
		expect(winner).toBe(HOST);
	}, 60000);

	it('beats the Random AI as Guest', () => {
		const winner = playFullGame(new YammaRandomAI(), new YammaStrategicAI(100));
		expect(winner).toBe(GUEST);
	}, 60000);
});
