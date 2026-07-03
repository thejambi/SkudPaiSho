/**
 * Consistency checks for YammaSearch internals vs. ground-truth YammaBoard
 * methods. The strategic AI's search maintains projected views and win
 * detection incrementally; these property tests verify that the incremental
 * state always matches a full rebuild, at every pyramid level.
 */

import { describe, it, expect, vi } from 'vitest';

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
		GameType: { Yamma: { id: 100, name: 'Yamma' } },
		ggOptions: []
	};
});

import { YammaBoard, PLAYER } from '../js/yamma/YammaBoard';
import { YammaSearch } from '../js/yamma/ai/YammaStrategicAI';

function randomInt(n) {
	return Math.floor(Math.random() * n);
}

describe('YammaSearch consistency', () => {
	it('incremental views match rebuilt views over random playouts', () => {
		for (let trial = 0; trial < 200; trial++) {
			const board = new YammaBoard();
			const search = new YammaSearch(board, 0, false);
			let color = PLAYER.WHITE;
			let gameDecided = false;
			for (let step = 0; step < 56; step++) {
				const positions = board.getPossibleMoves();
				if (positions.length === 0) break;
				const pos = positions[randomInt(positions.length)];
				const child = { row: pos.row, col: pos.col, level: pos.level, rotation: randomInt(3) };

				const undo = search.place(child, color);
				const incWinner = search.winnerAfterPlacementColor(undo, color);
				const trueResult = board.checkWinner(color);
				const trueWinner = trueResult ? trueResult.winner : null;

				// Compare views at every step, all the way to a full board,
				// so upper pyramid levels are exercised too
				for (let v = 0; v < 3; v++) {
					const rebuilt = board.buildProjectedView(v);
					expect(search.getViewGrid(v), `trial ${trial} step ${step} view ${v} after placing ${JSON.stringify(child)} ${color}`).toEqual(rebuilt);
				}

				// Winner comparison is only meaningful before any win exists
				// (incremental detection assumes no pre-existing 4-in-a-row)
				if (!gameDecided) {
					expect(incWinner, `trial ${trial} step ${step} winner mismatch after ${JSON.stringify(child)} ${color}`).toBe(trueWinner);
					if (trueWinner) gameDecided = true;
				}

				color = color === PLAYER.WHITE ? PLAYER.BLUE : PLAYER.WHITE;
			}
		}
	}, 60000);

	it('place/unplace restores board and views exactly', () => {
		for (let trial = 0; trial < 50; trial++) {
			const board = new YammaBoard();
			const search = new YammaSearch(board, 0, false);
			let color = PLAYER.WHITE;
			// Random prefix
			for (let step = 0; step < randomInt(20); step++) {
				const positions = board.getPossibleMoves();
				const pos = positions[randomInt(positions.length)];
				search.place({ row: pos.row, col: pos.col, level: pos.level, rotation: randomInt(3) }, color);
				color = color === PLAYER.WHITE ? PLAYER.BLUE : PLAYER.WHITE;
			}
			const viewsBefore = JSON.stringify([search.getViewGrid(0), search.getViewGrid(1), search.getViewGrid(2)]);
			const boardBefore = JSON.stringify(board.levels);

			const positions = board.getPossibleMoves();
			if (positions.length === 0) continue;
			const pos = positions[randomInt(positions.length)];
			const undo = search.place({ row: pos.row, col: pos.col, level: pos.level, rotation: randomInt(3) }, color);
			search.unplace(undo);

			expect(JSON.stringify([search.getViewGrid(0), search.getViewGrid(1), search.getViewGrid(2)])).toBe(viewsBefore);
			expect(JSON.stringify(board.levels)).toBe(boardBefore);
		}
	}, 30000);
});
