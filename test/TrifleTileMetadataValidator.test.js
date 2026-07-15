/**
 * Trifle Engine - Tile Metadata Validator tests
 *
 * Unit tests for the config validator, plus a sweep asserting every real game's
 * tile definitions validate clean (this is the test that catches config typos).
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

// Mock GameOptions so game-option-dependent tile definitions take their defaults
vi.mock('../js/GameOptions', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		gameOptionEnabled: vi.fn(() => false)
	};
});

/* Import game managers before tiles modules: several Tiles modules participate in
   import cycles with their GameManager and only resolve cleanly manager-first */
import '../js/gini/GiniGameManager';
import '../js/ginseng/GinsengGameManager';
import '../js/nick/NickGameManager';
import '../js/vagabond/VagabondTrifleGameManager';

import { validateTileMetadata } from '../js/trifle/TrifleTileMetadataValidator';
import { TrifleTiles } from '../js/trifle/TrifleTileInfo';
import { defineTrifleTiles } from '../js/trifle/TrifleTiles';
import { GinsengTileInfo, GinsengTiles } from '../js/ginseng/GinsengTiles';
import { GiniTileInfo, GiniTiles } from '../js/gini/GiniTiles';
import { VagabondTileInfo, VagabondTrifleTiles } from '../js/vagabond/VagabondTrifleTiles';
import { initializeTrifleData as initializeNickTiles, NickTiles } from '../js/nick/NickTiles';

/* ─── Unit tests: typo detection ─── */

describe('validateTileMetadata typo detection', () => {
	it('reports an unknown ability type', () => {
		const { errors } = validateTileMetadata({
			BadTile: {
				types: ['Animal'],
				abilities: [{ type: 'immoblizeTiles', triggers: [{ triggerType: 'whileOnBoard' }] }]
			}
		});
		expect(errors.length).toBe(1);
		expect(errors[0]).toContain('BadTile');
		expect(errors[0]).toContain('immoblizeTiles');
	});

	it('reports an unknown trigger type', () => {
		const { errors } = validateTileMetadata({
			BadTile: {
				types: ['Animal'],
				abilities: [{ type: 'immobilizeTiles', triggers: [{ triggerType: 'whileTargetIsSurounding' }] }]
			}
		});
		expect(errors.length).toBe(1);
		expect(errors[0]).toContain('whileTargetIsSurounding');
	});

	it('reports a trigger with no triggerType', () => {
		const { errors } = validateTileMetadata({
			BadTile: {
				types: ['Animal'],
				abilities: [{ type: 'immobilizeTiles', triggers: [{ targetTeams: ['enemy'] }] }]
			}
		});
		expect(errors.length).toBe(1);
		expect(errors[0]).toContain('no triggerType');
	});

	it('reports unknown target, movement, deploy, and capture types', () => {
		const { errors } = validateTileMetadata({
			BadTile: {
				types: ['Animal'],
				deployTypes: ['anywheres'],
				movements: [{ type: 'standerd', captureTypes: [{ type: 'evrything' }] }],
				abilities: [{
					type: 'immobilizeTiles',
					triggers: [{ triggerType: 'whileOnBoard' }],
					targetTypes: ['triggerTargetTilez']
				}]
			}
		});
		expect(errors.some(e => e.includes('anywheres'))).toBe(true);
		expect(errors.some(e => e.includes('standerd'))).toBe(true);
		expect(errors.some(e => e.includes('evrything'))).toBe(true);
		expect(errors.some(e => e.includes('triggerTargetTilez'))).toBe(true);
	});

	it('warns about missing types and trigger-less abilities without erroring', () => {
		const { errors, warnings } = validateTileMetadata({
			OddTile: {
				abilities: [{ type: 'immobilizeTiles', targetTypes: ['triggerTargetTiles'] }]
			}
		});
		expect(errors.length).toBe(0);
		expect(warnings.some(w => w.includes("missing 'types'"))).toBe(true);
		expect(warnings.some(w => w.includes('no triggers'))).toBe(true);
	});

	it('accepts a fully valid definition with no findings', () => {
		const { errors, warnings } = validateTileMetadata({
			GoodTile: {
				types: ['Animal'],
				deployTypes: ['anywhere'],
				movements: [{ type: 'standard', distance: 3, captureTypes: [{ type: 'all' }] }],
				abilities: [{
					type: 'immobilizeTiles',
					triggers: [{ triggerType: 'whileTargetTileIsSurrounding', targetTeams: ['enemy'] }],
					targetTypes: ['triggerTargetTiles']
				}]
			}
		});
		expect(errors).toEqual([]);
		expect(warnings).toEqual([]);
	});
});

/* ─── Sweep: every real game's tile definitions must validate clean ─── */

describe('real game tile definitions validate clean', () => {
	it('Trifle tiles have no config errors or warnings', () => {
		defineTrifleTiles();
		const { errors, warnings } = validateTileMetadata(TrifleTiles);
		expect(errors).toEqual([]);
		expect(warnings).toEqual([]);
	});

	it('Ginseng tiles have no config errors or warnings', () => {
		GinsengTileInfo.initializeTrifleData();
		const { errors, warnings } = validateTileMetadata(GinsengTiles);
		expect(errors).toEqual([]);
		expect(warnings).toEqual([]);
	});

	it('Gini tiles have no config errors or warnings', () => {
		GiniTileInfo.initializeTrifleData();
		const { errors, warnings } = validateTileMetadata(GiniTiles);
		expect(errors).toEqual([]);
		expect(warnings).toEqual([]);
	});

	it('Vagabond tiles have no config errors or warnings', () => {
		VagabondTileInfo.initializeTrifleData();
		const { errors, warnings } = validateTileMetadata(VagabondTrifleTiles);
		expect(errors).toEqual([]);
		expect(warnings).toEqual([]);
	});

	it('Nick tiles have no config errors or warnings', () => {
		initializeNickTiles();
		const { errors, warnings } = validateTileMetadata(NickTiles);
		expect(errors).toEqual([]);
		expect(warnings).toEqual([]);
	});
});
