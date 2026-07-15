/**
 * Trifle Engine - Ability Manager unit tests
 *
 * Covers the ability activation machinery directly with stub abilities:
 * - Priority phase ordering (including gaps and mixed lists)
 * - tileRecords parallel-array invariant (capturedTiles / capturedTilePoints)
 * - Capture trigger brains' triggeringAction event identity
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
		GameType: {},
		ggOptions: [],
		gameController: {
			buildNotationString: vi.fn()
		}
	};
});

import { TrifleAbilityManager } from '../js/trifle/TrifleAbilityManager';
import { TrifleAbility } from '../js/trifle/TrifleAbility';
import { TrifleWhenCapturedByTargetTileTriggerBrain } from '../js/trifle/brains/triggerBrains/WhenCapturedByTargetTileTriggerBrain';
import { TrifleWhenCapturingTargetTileTriggerBrain } from '../js/trifle/brains/triggerBrains/WhenCapturingTargetTileTriggerBrain';
import { TrifleWhenAdjacentFriendlyTileIsCapturedTriggerBrain } from '../js/trifle/brains/triggerBrains/WhenAdjacentFriendlyTileIsCapturedTriggerBrain';
import { TrifleWhenTargetTileInZoneIsCapturedTriggerBrain } from '../js/trifle/brains/triggerBrains/WhenTargetTileInZoneIsCapturedTriggerBrain';

/* ─── Stub helpers ─── */

function createManager() {
	const boardStub = { tileManager: {} };
	const manager = new TrifleAbilityManager(boardStub);
	manager.setAbilitiesWithPromptTargetsNeeded([]);
	return manager;
}

let nextStubId = 1;

function makeStubAbility(name, activationOrder, options = {}) {
	return {
		abilityType: options.abilityType || 'stubAbilityType',
		abilityInfo: { priority: options.priority },
		sourceTile: { id: nextStubId++, code: 'Stub', ownerCode: 'H', ownerName: 'HOST' },
		triggerTargetTiles: [],
		activated: false,
		isPriority(level) { return this.abilityInfo.priority === level; },
		getTitle() { return name; },
		getTriggeringActions() { return options.triggeringActions || []; },
		activateAbility() {
			this.activated = true;
			this.abilityActivatedResults = options.results || {};
			activationOrder.push(name);
		},
		boardChangedAfterActivation() { return options.boardChanges || false; },
		appearsToBeTheSameAs() { return false; },
		abilityTargetsTile() { return false; },
		deactivate() { this.activated = false; },
		setAbilityTargetTiles() {},
		hasActivationDelay() { return false; },
		hasDuration() { return false; }
	};
}

/* ─── Priority phase (issue #4: .every() early-exit / priority gaps) ─── */

describe('TrifleAbilityManager priority activation order', () => {
	it('activates a priority ability even when a non-priority ability precedes it in the same list', () => {
		const manager = createManager();
		const activationOrder = [];

		const nonPriority = makeStubAbility('nonPriority', activationOrder);
		const priorityOne = makeStubAbility('priorityOne', activationOrder, { priority: 1 });

		// Same ability-type list, non-priority first: the priority scan must not
		// stop at the non-matching entry
		manager.setReadyAbilities({ stubAbilityType: [nonPriority, priorityOne] });
		manager.activateReadyAbilities();

		expect(activationOrder[0]).toBe('priorityOne');
		expect(activationOrder).toContain('nonPriority');
	});

	it('processes a priority level even when lower levels are absent (priority gap)', () => {
		const manager = createManager();
		const activationOrder = [];

		// cancelAbilities is first in the default activation order; a priority-2
		// ability (with no priority-1 ability present) must still beat it
		const cancelStub = makeStubAbility('cancel', activationOrder, { abilityType: 'cancelAbilities' });
		const priorityTwo = makeStubAbility('priorityTwo', activationOrder, { priority: 2 });

		manager.setReadyAbilities({
			cancelAbilities: [cancelStub],
			stubAbilityType: [priorityTwo]
		});
		manager.activateReadyAbilities();

		expect(activationOrder[0]).toBe('priorityTwo');
		expect(activationOrder).toContain('cancel');
	});

	it('activates priority levels in ascending order', () => {
		const manager = createManager();
		const activationOrder = [];

		const priorityThree = makeStubAbility('priorityThree', activationOrder, { priority: 3 });
		const priorityOne = makeStubAbility('priorityOne', activationOrder, { priority: 1 });

		manager.setReadyAbilities({
			typeA: [priorityThree],
			typeB: [priorityOne]
		});
		manager.activateReadyAbilities();

		expect(activationOrder).toEqual(['priorityOne', 'priorityThree']);
	});
});

/* ─── tileRecords parallel arrays (issue #7) ─── */

describe('TrifleAbilityManager tileRecords', () => {
	it('records capture points parallel to captured tiles from ability results', () => {
		const manager = createManager();
		const activationOrder = [];

		const capturePoint = { row: 3, col: 4 };
		const capturedTile = { id: 99, code: 'Stub', seatedPoint: capturePoint };

		const capturer = makeStubAbility('capturer', activationOrder, {
			results: { capturedTiles: [capturedTile] }
		});

		manager.setReadyAbilities({ stubAbilityType: [capturer] });
		const result = manager.activateReadyAbilities();

		expect(result.tileRecords.capturedTiles).toEqual([capturedTile]);
		// Regression: capturedTilePoints used to be missing entirely, breaking the
		// capturedTiles/capturedTilePoints parallel-array contract during cascades
		expect(result.tileRecords.capturedTilePoints).toEqual([capturePoint]);
	});
});

/* ─── Co-activation by shared triggering action ─── */

describe('TrifleAbilityManager same-action co-activation', () => {
	it('activates abilities sharing a triggering action even when the first changes the board', () => {
		const manager = createManager();
		const activationOrder = [];

		const sharedAction = { actionType: 'Capture', capturedTileIds: [42] };
		const first = makeStubAbility('first', activationOrder, {
			boardChanges: true,
			triggeringActions: [sharedAction]
		});
		const second = makeStubAbility('second', activationOrder, {
			triggeringActions: [{ actionType: 'Capture', capturedTileIds: [42] }]
		});

		manager.setReadyAbilities({ stubAbilityType: [first, second] });
		manager.activateReadyAbilities();

		// first changes the board (stopping normal iteration), but second is
		// triggered by the same action so it must co-activate in the same run
		expect(activationOrder).toEqual(['first', 'second']);
	});
});

/* ─── Capture trigger brains' triggeringAction identity (issue #3) ─── */

describe('Capture trigger brains triggeringAction', () => {
	function makeTriggerContext(overrides = {}) {
		const capturedTiles = overrides.capturedTiles || [
			{ id: 7, code: 'Stub', ownerName: 'GUEST' }
		];
		return {
			board: { tileManager: {} },
			tile: overrides.tile || { id: 21, code: 'Stub', ownerName: 'HOST' },
			tileInfo: {},
			tileAbilityInfo: {},
			pointWithTile: { row: 1, col: 1 },
			currentTrigger: {},
			lastTurnAction: {
				tileMovedOrPlaced: overrides.movedTile || { id: 30, code: 'Mover', ownerName: 'GUEST' },
				tileMovedOrPlacedInfo: {},
				boardPointStart: { row: 0, col: 0 },
				boardPointEnd: { row: 1, col: 2 },
				capturedTiles: capturedTiles,
				capturedTilePoints: overrides.capturedTilePoints || [{ row: 1, col: 1 }]
			}
		};
	}

	it('identifies the capture event by the captured tile ids (not an undefined property)', () => {
		const context = makeTriggerContext({ capturedTiles: [{ id: 7 }, { id: 5 }] });

		const brains = [
			new TrifleWhenCapturedByTargetTileTriggerBrain(context),
			new TrifleWhenCapturingTargetTileTriggerBrain(makeTriggerContext({ capturedTiles: [{ id: 7 }] })),
			new TrifleWhenAdjacentFriendlyTileIsCapturedTriggerBrain(context),
			new TrifleWhenTargetTileInZoneIsCapturedTriggerBrain(context)
		];

		brains.forEach((brain) => {
			expect(brain.triggeringAction).toBeDefined();
			// Regression: these brains read tile.tileId (which does not exist), so the
			// event identity serialized to just { actionType } and every capture
			// matched every other capture
			expect(brain.triggeringAction.capturedTileIds).toBeDefined();
			expect(brain.triggeringAction.capturedTileIds.length).toBeGreaterThan(0);
			expect(brain.triggeringAction.capturedTileIds).not.toContain(undefined);
		});
	});

	it('produces equal actions for the same capture event across different brains', () => {
		const capturedTiles = [{ id: 7 }, { id: 5 }];
		const brainA = new TrifleWhenCapturedByTargetTileTriggerBrain(
			makeTriggerContext({ capturedTiles, tile: { id: 21, ownerName: 'HOST' } }));
		const brainB = new TrifleWhenCapturedByTargetTileTriggerBrain(
			makeTriggerContext({ capturedTiles, tile: { id: 22, ownerName: 'HOST' } }));

		// Same event, different ability owners: actions must match so the
		// abilities co-activate
		expect(JSON.stringify(brainA.triggeringAction)).toBe(JSON.stringify(brainB.triggeringAction));
	});
});

/* ─── Ability identity (issue #5: JSON.stringify equality) ─── */

describe('TrifleAbility appearsToBeTheSameAs identity', () => {
	function makeAbilityRecord(abilityInfo, sourceTileId, sourceTilePoint) {
		const record = Object.create(TrifleAbility.prototype);
		record.abilityType = abilityInfo.type;
		record.abilityInfo = abilityInfo;
		record.sourceTile = { id: sourceTileId };
		record.sourceTilePoint = sourceTilePoint;
		record.triggerTargetTiles = [];
		record.triggerTargetTilePoints = [];
		return record;
	}

	const point = { row: 4, col: 4 };

	it('matches two records built from the same config entry', () => {
		const sharedInfo = { type: 'immobilizeTiles', triggers: [{ triggerType: 'whileOnBoard' }] };
		const a = makeAbilityRecord(sharedInfo, 7, point);
		const b = makeAbilityRecord(sharedInfo, 7, point);
		expect(a.appearsToBeTheSameAs(b)).toBe(true);
	});

	it('does not match records from distinct config entries even with identical content', () => {
		// Two separate config objects with equal content are different abilities
		// (e.g. duplicated game-rule abilities); serialization-based comparison
		// used to wrongly dedupe them
		const infoA = { type: 'immobilizeTiles', triggers: [{ triggerType: 'whileOnBoard' }] };
		const infoB = { type: 'immobilizeTiles', triggers: [{ triggerType: 'whileOnBoard' }] };
		const a = makeAbilityRecord(infoA, 7, point);
		const b = makeAbilityRecord(infoB, 7, point);
		expect(a.appearsToBeTheSameAs(b)).toBe(false);
	});

	it('does not match records from different source tiles', () => {
		const sharedInfo = { type: 'immobilizeTiles', triggers: [{ triggerType: 'whileOnBoard' }] };
		const a = makeAbilityRecord(sharedInfo, 7, point);
		const b = makeAbilityRecord(sharedInfo, 8, point);
		expect(a.appearsToBeTheSameAs(b)).toBe(false);
	});

	it('does not throw when a config object holds a circular reference', () => {
		// Board/point references can leak into ability config at runtime;
		// serialization-based comparison would throw on them
		const infoA = { type: 'immobilizeTiles', triggers: [{ triggerType: 'whileOnBoard' }] };
		infoA.self = infoA;
		const infoB = { type: 'immobilizeTiles', triggers: [{ triggerType: 'whileOnBoard' }] };
		const a = makeAbilityRecord(infoA, 7, point);
		const b = makeAbilityRecord(infoB, 7, point);
		expect(() => a.appearsToBeTheSameAs(b)).not.toThrow();
		expect(a.appearsToBeTheSameAs(b)).toBe(false);
	});
});

/* ─── Triggering-action matching guards ─── */

describe('TrifleAbilityManager triggering-action matching', () => {
	it('does not co-activate abilities triggered by different capture events', () => {
		const manager = createManager();
		const activationOrder = [];

		const first = makeStubAbility('first', activationOrder, {
			boardChanges: true,
			triggeringActions: [{ actionType: 'Capture', capturedTileIds: [42] }]
		});
		const other = makeStubAbility('other', activationOrder, {
			triggeringActions: [{ actionType: 'Capture', capturedTileIds: [43] }]
		});

		manager.setReadyAbilities({ stubAbilityType: [first, other] });
		manager.activateReadyAbilities();

		// first changes the board and stops the run; 'other' was triggered by a
		// different event, so it must NOT ride along
		expect(activationOrder).toEqual(['first']);
	});

	it('does not co-activate abilities with different action types', () => {
		const manager = createManager();
		const activationOrder = [];

		const first = makeStubAbility('first', activationOrder, {
			boardChanges: true,
			triggeringActions: [{ actionType: 'Capture', capturedTileIds: [42] }]
		});
		const other = makeStubAbility('other', activationOrder, {
			triggeringActions: [{ actionType: 'CaptureRetaliation', capturedTileIds: [42] }]
		});

		manager.setReadyAbilities({ stubAbilityType: [first, other] });
		manager.activateReadyAbilities();

		expect(activationOrder).toEqual(['first']);
	});
});
