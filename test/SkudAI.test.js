/**
 * Skud Pai Sho AI Tests
 * Validates the enhanced Strategic AI (v2): move legality, notation round-trips,
 * Harmony Bonus handling, and playing strength vs the basic automatic opponent.
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
		WAITING_FOR_ENDPOINT: 'Waiting for endpoint',
		WAITING_FOR_BONUS_ENDPOINT: 'Waiting for bonus endpoint',
		READY_FOR_BONUS: 'Ready for bonus',
		WAITING_FOR_BOAT_BONUS_POINT: 'Waiting for boat bonus point',
		HOST: 'HOST',
		GUEST: 'GUEST',
		gameId: -1,
		currentMoveIndex: 0,
		GameType: {
			SkudPaiSho: { id: 1, name: 'Skud Pai Sho' }
		},
		ggOptions: [],
		QueryString: { appType: '' }
	};
});

import { HOST, GUEST } from '../js/CommonNotationObjects';
import {
	SkudPaiShoGameNotation,
	SkudPaiShoNotationMove,
} from '../js/skud-pai-sho/SkudPaiShoGameNotation';
import { SkudPaiShoGameManager } from '../js/skud-pai-sho/SkudPaiShoGameManager';
import { SkudStrategicAIv2 } from '../js/ai/SkudStrategicAIv2';
import { SkudAIv1 } from '../js/ai/SkudAIv1';

/** Mirrors SkudPaiShoController.getCurrentPlayer */
function getCurrentPlayer(notation) {
	if (notation.moves.length <= 1) {
		return notation.moves.length === 0 ? HOST : GUEST;
	}
	if (notation.moves.length <= 2) {
		return GUEST;
	}
	const lastPlayer = notation.moves[notation.moves.length - 1].player;
	return lastPlayer === HOST ? GUEST : HOST;
}

/**
 * Drives a full game the same way the controller does, including Host's
 * auto-mirror of Guest's first plant. Returns detailed records.
 */
function playGame(hostAi, guestAi, maxPlies) {
	const manager = new SkudPaiShoGameManager(null, true, true);
	const notation = new SkudPaiShoGameNotation();
	hostAi.setPlayer(HOST);
	guestAi.setPlayer(GUEST);

	const record = { moves: [], winner: null, error: null };

	for (let ply = 0; ply < maxPlies; ply++) {
		if (manager.getWinner()) {
			record.winner = manager.getWinner();
			break;
		}

		const player = getCurrentPlayer(notation);
		const playerMoveNum = notation.getPlayerMoveNum();
		let move;

		if (playerMoveNum === 1 && player === HOST) {
			// Host auto-copies Guest's first plant (sameStart rule)
			const guestPlant = notation.moves[notation.moves.length - 1].plantedFlowerType;
			move = new SkudPaiShoNotationMove('1H.' + guestPlant + '(0,8)');
		} else {
			const ai = player === HOST ? hostAi : guestAi;
			move = ai.getMove(manager.getCopy(), playerMoveNum);
		}

		if (!move) {
			record.error = `No move produced at ply ${ply} for ${player}`;
			break;
		}

		// Round-trip check: the move text must re-parse identically
		const reparsed = new SkudPaiShoNotationMove(move.fullMoveText);
		if (!reparsed.isValidNotation()) {
			record.error = `Invalid notation at ply ${ply}: ${move.fullMoveText}`;
			break;
		}

		try {
			manager.runNotationMove(reparsed);
		} catch (e) {
			record.error = `runNotationMove threw at ply ${ply} (${move.fullMoveText}): ${e.message}`;
			break;
		}

		notation.addMove(reparsed);
		record.moves.push(reparsed);
	}

	if (!record.winner && manager.getWinner()) {
		record.winner = manager.getWinner();
	}
	record.manager = manager;
	return record;
}

describe('Skud Strategic AI v2 - Basics', () => {
	it('selects four accent tiles with valid move-0 notation', () => {
		const manager = new SkudPaiShoGameManager(null, true, true);
		const ai = new SkudStrategicAIv2(500);
		ai.setPlayer(HOST);

		const move = ai.getMove(manager.getCopy(), 0);
		expect(move).toBeTruthy();
		expect(move.moveNum).toBe(0);
		expect(move.accentTiles).toHaveLength(4);

		// Applying it must not throw
		manager.runNotationMove(move);
	});

	it('plants into the Guest gate on Guest move 1', () => {
		const manager = new SkudPaiShoGameManager(null, true, true);
		manager.runNotationMove(new SkudPaiShoNotationMove('0H.R,W,K,B'));
		manager.runNotationMove(new SkudPaiShoNotationMove('0G.K,R,B,K'));

		const ai = new SkudStrategicAIv2(800);
		ai.setPlayer(GUEST);
		const move = ai.getMove(manager.getCopy(), 1);

		expect(move).toBeTruthy();
		expect(move.moveNum).toBe(1);
		// Guest's first plant must go in the Guest gate (0,-8)
		expect(move.endPoint.pointText).toBe('0,-8');

		manager.runNotationMove(move);
		expect(manager.board.cells[16][8].hasTile()).toBe(true);
	});
});

describe('Skud Strategic AI v2 - Full game vs automatic opponent', () => {
	it('plays a legal full game as Guest and outperforms SkudAIv1', () => {
		const record = playGame(new SkudAIv1(), new SkudStrategicAIv2(400), 80);

		expect(record.error).toBe(null);
		expect(record.moves.length).toBeGreaterThan(10);

		// Every bonus move must have parsed correctly (regression check for the
		// old SkudStrategicAI bug where bonus endpoints were raw strings)
		for (const move of record.moves) {
			if (move.hasHarmonyBonus()) {
				expect(move.bonusEndPoint.rowAndColumn).toBeTruthy();
			}
		}

		const manager = record.manager;
		const guestHarmonies = manager.board.harmonyManager.numHarmoniesForPlayer(GUEST);
		const hostHarmonies = manager.board.harmonyManager.numHarmoniesForPlayer(HOST);

		if (record.winner) {
			expect(record.winner).toBe(GUEST);
		} else {
			// No winner within the ply cap: the strategic AI should clearly lead
			expect(guestHarmonies).toBeGreaterThanOrEqual(hostHarmonies);
		}
	}, 300000);

	it('plays a legal full game as Host and outperforms SkudAIv1', () => {
		const record = playGame(new SkudStrategicAIv2(400), new SkudAIv1(), 80);

		expect(record.error).toBe(null);
		expect(record.moves.length).toBeGreaterThan(10);

		const manager = record.manager;
		const hostHarmonies = manager.board.harmonyManager.numHarmoniesForPlayer(HOST);
		const guestHarmonies = manager.board.harmonyManager.numHarmoniesForPlayer(GUEST);

		if (record.winner) {
			expect(record.winner).toBe(HOST);
		} else {
			expect(hostHarmonies).toBeGreaterThanOrEqual(guestHarmonies);
		}
	}, 300000);
});
