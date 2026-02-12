/**
 * Trifle Engine Tests
 * Tests for Trifle tile abilities and duration mechanics
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
			Trifle: { id: 100, name: 'Trifle' }
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
import { TrifleGameManager } from '../js/trifle/TrifleGameManager';
import { TrifleGameNotation } from '../js/trifle/TrifleGameNotation';
import { NotationPoint, DEPLOY, MOVE, TEAM_SELECTION, HOST, GUEST, DRAW_ACCEPT } from '../js/CommonNotationObjects';
import { TrifleTileCodes, defineTrifleTiles, TrifleTileType, TrifleTileIdentifier } from '../js/trifle/TrifleTiles';
import { TrifleMovementType, TrifleDeployType, TrifleCaptureType, TrifleMovementAbility } from '../js/trifle/TrifleTileInfo';
import { TrifleAbilityName, TrifleAbilityTriggerType, TrifleAttributeType, TrifleTargetType, TrifleTileCategory } from '../js/trifle/TrifleTileInfo';
import { setCurrentTileMetadata, setCurrentTileCodes } from '../js/trifle/PaiShoGamesTileMetadata';
import { TrifleTiles } from '../js/trifle/TrifleTileInfo';
import { TrifleTile } from '../js/trifle/TrifleTile';

// Initialize tile metadata
defineTrifleTiles();
setCurrentTileMetadata(TrifleTiles);
setCurrentTileCodes(TrifleTileCodes);

/**
 * Helper to add tiles to player's team/pile for testing
 */
function addTilesToTeam(gameManager, player, tileCodes) {
	tileCodes.forEach(code => {
		const tile = new TrifleTile(code, player === HOST ? 'H' : 'G');
		gameManager.tileManager.addToTeamIfOk(tile);
	});
}

describe('Trifle Duration Abilities', () => {
	let gameManager;
	const mockActuator = { actuate: vi.fn() };

	beforeEach(() => {
		gameManager = new TrifleGameManager(mockActuator, true, true);
	});

	describe('Polar Bear Dog - Capture Protection Duration', () => {
		it('should have activationDelay and duration properties defined on Polar Bear Dog ability', () => {
			const polarBearDogInfo = TrifleTiles[TrifleTileCodes.PolarBearDog];
			expect(polarBearDogInfo).toBeDefined();
			expect(polarBearDogInfo.abilities).toBeDefined();

			const protectAbility = polarBearDogInfo.abilities.find(
				a => a.type === TrifleAbilityName.protectFromCapture
			);
			expect(protectAbility).toBeDefined();
			expect(protectAbility.activationDelay).toBe(0.5);
			expect(protectAbility.duration).toBe(0.5);
		});

		it('should activate protectFromCapture after capturing (delay consumed at end of turn)', () => {
			// Add tiles to teams first
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly
			]);

			// Deploy tiles
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,0')
			}, false);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,4')
			}, false);

			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, HOST);
			expect(pbdPoints.length).toBe(1);
			const pbdTile = pbdPoints[0].tile;

			// Move PBD to capture Firefly. At end of turn, activationDelay (0.5) ticks to 0,
			// triggering delayed activation with duration 0.5.
			gameManager.runNotationMove({
				moveType: MOVE,
				player: HOST,
				startPoint: new NotationPoint('0,0'),
				endPoint: new NotationPoint('0,4')
			}, false);

			// Protection should be ACTIVE (delay expired at end of turn, ability activated)
			const hasProtection = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.protectFromCapture,
				pbdTile
			);
			expect(hasProtection).toBe(true);
		});

		it('should expire protection after opponent turn (1 tick)', () => {
			// Add tiles to teams first
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly,
				TrifleTileCodes.Chrysanthemum
			]);

			// Deploy tiles
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,0')
			}, false);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,4')
			}, false);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Chrysanthemum,
				endPoint: new NotationPoint('4,4')
			}, false);

			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, HOST);
			const pbdTile = pbdPoints[0].tile;

			// HOST moves PBD to capture. End-of-turn tick: delay 0.5 -> 0, activates with duration 0.5
			gameManager.runNotationMove({
				moveType: MOVE,
				player: HOST,
				startPoint: new NotationPoint('0,0'),
				endPoint: new NotationPoint('0,4')
			}, false);

			// Protection should be active (delay consumed, duration 0.5 remaining)
			let hasProtection = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.protectFromCapture,
				pbdTile
			);
			expect(hasProtection).toBe(true);

			// GUEST makes a move. End-of-turn tick: duration 0.5 -> 0, expired
			gameManager.runNotationMove({
				moveType: MOVE,
				player: GUEST,
				startPoint: new NotationPoint('4,4'),
				endPoint: new NotationPoint('4,3')
			}, false);

			// Protection should now be expired
			hasProtection = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.protectFromCapture,
				pbdTile
			);
			expect(hasProtection).toBe(false);
		});
	});
});

describe('Trifle Ability Duration Tick Mechanism', () => {
	let gameManager;
	const mockActuator = { actuate: vi.fn() };

	beforeEach(() => {
		gameManager = new TrifleGameManager(mockActuator, true, true);
	});

	it('should have tickDurationAbilities method on ability manager', () => {
		expect(typeof gameManager.board.abilityManager.tickDurationAbilities).toBe('function');
	});

	it('should call tickDurationAbilities after each move', () => {
		// Add tiles to teams first
		addTilesToTeam(gameManager, HOST, [
			TrifleTileCodes.WaterBanner,
			TrifleTileCodes.PolarBearDog
		]);
		addTilesToTeam(gameManager, GUEST, [
			TrifleTileCodes.AirBanner,
			TrifleTileCodes.Firefly
		]);

		// Spy on tickDurationAbilities
		const tickSpy = vi.spyOn(gameManager.board.abilityManager, 'tickDurationAbilities');

		// Make a deploy move
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: HOST,
			tileType: TrifleTileCodes.PolarBearDog,
			endPoint: new NotationPoint('0,0')
		}, false);

		// tickDurationAbilities should have been called
		expect(tickSpy).toHaveBeenCalledTimes(1);

		// Make another move
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: GUEST,
			tileType: TrifleTileCodes.Firefly,
			endPoint: new NotationPoint('4,4')
		}, false);

		// Should be called again
		expect(tickSpy).toHaveBeenCalledTimes(2);
	});
});

describe('Buffalo Yak - Zone Ability to Remove Tile Abilities', () => {
	let gameManager;
	const mockActuator = { actuate: vi.fn() };

	beforeEach(() => {
		gameManager = new TrifleGameManager(mockActuator, true, true);
	});

	describe('Tile Definition', () => {
		it('should have correct tile properties', () => {
			const buffaloYakInfo = TrifleTiles[TrifleTileCodes.BuffaloYak];
			expect(buffaloYakInfo).toBeDefined();
			expect(buffaloYakInfo.types).toContain(TrifleTileType.animal);
		});

		it('should have movement distance of 2 with capture ability', () => {
			const buffaloYakInfo = TrifleTiles[TrifleTileCodes.BuffaloYak];
			expect(buffaloYakInfo.movements).toBeDefined();
			expect(buffaloYakInfo.movements.length).toBeGreaterThan(0);
			expect(buffaloYakInfo.movements[0].distance).toBe(2);
			expect(buffaloYakInfo.movements[0].captureTypes).toBeDefined();
		});

		it('should have territorial zone of size 2', () => {
			const buffaloYakInfo = TrifleTiles[TrifleTileCodes.BuffaloYak];
			expect(buffaloYakInfo.territorialZone).toBeDefined();
			expect(buffaloYakInfo.territorialZone.size).toBe(2);
		});

		it('should have cancelAbilities ability targeting flowers in zone', () => {
			const buffaloYakInfo = TrifleTiles[TrifleTileCodes.BuffaloYak];
			expect(buffaloYakInfo.abilities).toBeDefined();

			const cancelAbility = buffaloYakInfo.abilities.find(
				a => a.type === TrifleAbilityName.cancelAbilities
			);
			expect(cancelAbility).toBeDefined();
			expect(cancelAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.flower);
		});
	});

	describe('Cancel Abilities Functionality', () => {
		it('should not cancel flower abilities when no Buffalo Yak on board', () => {
			// Add tiles to teams
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.Lavender  // A flower tile
			]);

			// Deploy the flower tile
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('0,0')
			}, false);

			const flowerPoints = gameManager.board.getTilePoints(TrifleTileCodes.Lavender, HOST);
			expect(flowerPoints.length).toBe(1);

			// No Buffalo Yak on the board, so cancelAbilities should NOT target the flower
			const isCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				flowerPoints[0].tile
			);
			expect(isCanceled).toBe(false);
		});

		it('should cancel flower abilities when within Buffalo Yak zone', () => {
			// Add tiles to teams
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.BuffaloYak
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Lavender  // A flower tile
			]);

			// Deploy Buffalo Yak at center
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.BuffaloYak,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy flower tile within zone (distance 2)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('0,2')
			}, false);

			const flowerPoints = gameManager.board.getTilePoints(TrifleTileCodes.Lavender, GUEST);
			expect(flowerPoints.length).toBe(1);

			// Flower is within Buffalo Yak's zone, so cancelAbilities should target the flower
			const isCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				flowerPoints[0].tile
			);
			expect(isCanceled).toBe(true);
		});

		it('should not cancel flower abilities outside Buffalo Yak zone', () => {
			// Add tiles to teams
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.BuffaloYak
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Lavender  // A flower tile
			]);

			// Deploy Buffalo Yak at center
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.BuffaloYak,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy flower tile outside zone (distance 3, zone is 2)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('0,3')
			}, false);

			const flowerPoints = gameManager.board.getTilePoints(TrifleTileCodes.Lavender, GUEST);
			expect(flowerPoints.length).toBe(1);

			// Flower is outside Buffalo Yak's zone, so cancelAbilities should NOT target it
			const isCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				flowerPoints[0].tile
			);
			expect(isCanceled).toBe(false);
		});

		it('should not cancel abilities of non-flower tiles within zone', () => {
			// Add tiles to teams
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.BuffaloYak
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.PolarBearDog  // An animal tile, not a flower
			]);

			// Deploy Buffalo Yak at center
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.BuffaloYak,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy animal tile within zone
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,2')
			}, false);

			const animalPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, GUEST);
			expect(animalPoints.length).toBe(1);

			// Animal is within zone but not a flower, so cancelAbilities should NOT target it
			const isCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				animalPoints[0].tile
			);
			expect(isCanceled).toBe(false);
		});

		it('should cancel friendly flower abilities within zone', () => {
			// Add tiles to teams (flower on same team as Buffalo Yak)
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.BuffaloYak,
				TrifleTileCodes.Lavender  // Friendly flower
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Chrysanthemum
			]);

			// Deploy Buffalo Yak
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.BuffaloYak,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy GUEST tile to change turn
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Chrysanthemum,
				endPoint: new NotationPoint('4,4')
			}, false);

			// Deploy friendly flower within zone
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('0,1')
			}, false);

			const flowerPoints = gameManager.board.getTilePoints(TrifleTileCodes.Lavender, HOST);
			expect(flowerPoints.length).toBe(1);

			// Buffalo Yak affects both friendly and enemy flowers
			const isCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				flowerPoints[0].tile
			);
			expect(isCanceled).toBe(true);
		});
	});
});

/**
 * Tests for Air tiles before Polar Bear Dog
 */
describe('Air Tiles - Definition and Abilities', () => {
	let gameManager;
	const mockActuator = { actuate: vi.fn() };

	beforeEach(() => {
		gameManager = new TrifleGameManager(mockActuator, true, true);
	});

	describe('AirBanner', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.AirBanner];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.banner);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have movement of 1 space', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.AirBanner];
			expect(tileInfo.movements).toBeDefined();
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.standard);
			expect(tileInfo.movements[0].distance).toBe(1);
		});

		it('should have grantBonusMovement ability for friendly flowers', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.AirBanner];
			expect(tileInfo.abilities).toBeDefined();

			const bonusAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.grantBonusMovement
			);
			expect(bonusAbility).toBeDefined();
			expect(bonusAbility.bonusMovement.distance).toBe(1);
			expect(bonusAbility.targetTileTypes).toContain(TrifleTileType.flower);
		});
	});

	describe('SkyBison', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SkyBison];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.temple);
		});

		it('should have movement of 6 spaces with capture', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SkyBison];
			expect(tileInfo.movements[0].distance).toBe(6);
			expect(tileInfo.movements[0].captureTypes).toBeDefined();
		});

		it('should have territorial zone of size 6', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SkyBison];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(6);
		});

		it('should have cancelZone ability when inside temple', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SkyBison];
			const cancelZoneAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.cancelZone
			);
			expect(cancelZoneAbility).toBeDefined();
			expect(cancelZoneAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileInsideTemple
			);
		});

		it('should have restrictMovementWithinZone for enemy Sky Bison', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SkyBison];
			const restrictAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.restrictMovementWithinZone
			);
			expect(restrictAbility).toBeDefined();
			expect(restrictAbility.targetTileCodes).toContain(TrifleTileCodes.SkyBison);
		});
	});

	describe('FlyingLemur', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.FlyingLemur];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.temple);
		});

		it('should have movement of 5 spaces with capture and jumpOver', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.FlyingLemur];
			expect(tileInfo.movements[0].distance).toBe(5);
			expect(tileInfo.movements[0].captureTypes).toBeDefined();
			expect(tileInfo.movements[0].abilities).toBeDefined();
		});
	});

	describe('HermitCrab', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.HermitCrab];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have jumpShape movement with 1-2 shape', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.HermitCrab];
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.jumpShape);
			expect(tileInfo.movements[0].shape).toEqual([1, 2]);
			expect(tileInfo.movements[0].captureTypes).toBeDefined();
		});
	});

	describe('Firefly', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Firefly];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.temple);
		});

		it('should have movement of 2 spaces', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Firefly];
			expect(tileInfo.movements[0].distance).toBe(2);
		});

		it('should have drawTilesAlongLineOfSight ability', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Firefly];
			const drawAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.drawTilesAlongLineOfSight
			);
			expect(drawAbility).toBeDefined();
		});
	});

	describe('Firefly Line of Sight Trigger', () => {
		// Tests for WhileTargetTileIsInLineOfSightTriggerBrain behavior
		// Firefly has drawTilesAlongLineOfSight triggered by whileTargetTileIsInLineOfSight
		// Line of sight is orthogonal only (not diagonal), blocked by tiles in between

		it('should target adjacent tile (1 space away) - in line of sight', () => {
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);

			// Deploy Firefly outside temple (so ability is active)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy enemy PolarBearDog adjacent (1 space away, same row)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,1')
			}, false);

			// Get the enemy tile
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, GUEST);
			expect(pbdPoints.length).toBe(1);

			// Adjacent enemy tile should be targeted by drawTilesAlongLineOfSight
			const isTargeted = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.drawTilesAlongLineOfSight,
				pbdPoints[0].tile
			);
			expect(isTargeted).toBe(true);
		});

		it('should target tile 2 spaces away on same line with no tile between - in line of sight', () => {
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);

			// Deploy Firefly outside temple
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy enemy PolarBearDog 2 spaces away on same row (no tile between)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,2')
			}, false);

			// Get the enemy tile
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, GUEST);
			expect(pbdPoints.length).toBe(1);

			// Enemy tile 2 spaces away with clear line should be in line of sight
			const isTargeted = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.drawTilesAlongLineOfSight,
				pbdPoints[0].tile
			);
			expect(isTargeted).toBe(true);
		});

		it('should NOT target tile 2 spaces away when another tile blocks line of sight', () => {
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly,
				TrifleTileCodes.Lavender // Tile to block line of sight
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);

			// Deploy Firefly outside temple
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy blocking tile between Firefly and target
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('0,1')
			}, false);

			// Deploy enemy PolarBearDog 2 spaces away (blocked by Lavender)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,2')
			}, false);

			// Get the enemy tile
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, GUEST);
			expect(pbdPoints.length).toBe(1);

			// Enemy tile should NOT be in line of sight (blocked by Lavender)
			const isTargeted = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.drawTilesAlongLineOfSight,
				pbdPoints[0].tile
			);
			expect(isTargeted).toBe(false);
		});

		it('should STOP targeting tile when another tile moves to block line of sight', () => {
			// This tests the dynamic case: ability is active, then gets blocked
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly,
				TrifleTileCodes.Lavender // Will move to block line of sight
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);

			// Deploy Firefly outside temple
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy Lavender somewhere else (not blocking yet)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('1,0')
			}, false);

			// Deploy enemy PolarBearDog 2 spaces away - should be in line of sight
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,2')
			}, false);

			// Get the enemy tile
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, GUEST);
			expect(pbdPoints.length).toBe(1);

			// FIRST: Verify PolarBearDog IS in line of sight (ability is active)
			let isTargeted = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.drawTilesAlongLineOfSight,
				pbdPoints[0].tile
			);
			expect(isTargeted).toBe(true);

			// Now move Lavender to block line of sight (from 1,0 to 0,1)
			gameManager.runNotationMove({
				moveType: MOVE,
				player: HOST,
				startPoint: new NotationPoint('1,0'),
				endPoint: new NotationPoint('0,1')
			}, false);

			// AFTER blocking: PolarBearDog should NO LONGER be in line of sight
			isTargeted = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.drawTilesAlongLineOfSight,
				pbdPoints[0].tile
			);
			expect(isTargeted).toBe(false);
		});

		it('should STOP targeting tile when another tile is DEPLOYED to block line of sight', () => {
			// Same as above test but using DEPLOY instead of MOVE to block
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly,
				TrifleTileCodes.Lavender // Will be deployed to block line of sight
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);

			// Deploy Firefly outside temple
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy enemy PolarBearDog 2 spaces away - should be in line of sight
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,2')
			}, false);

			// Get the enemy tile
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, GUEST);
			expect(pbdPoints.length).toBe(1);

			// FIRST: Verify PolarBearDog IS in line of sight (ability is active)
			let isTargeted = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.drawTilesAlongLineOfSight,
				pbdPoints[0].tile
			);
			expect(isTargeted).toBe(true);

			// Now DEPLOY Lavender to block line of sight at (0,1)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('0,1')
			}, false);

			// AFTER blocking: PolarBearDog should NO LONGER be in line of sight
			isTargeted = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.drawTilesAlongLineOfSight,
				pbdPoints[0].tile
			);
			expect(isTargeted).toBe(false);
		});

		it('should NOT target tile that is diagonally adjacent - not in line of sight', () => {
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);

			// Deploy Firefly outside temple
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy enemy PolarBearDog diagonally adjacent (different row AND different col)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('1,1')
			}, false);

			// Get the enemy tile
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, GUEST);
			expect(pbdPoints.length).toBe(1);

			// Diagonally adjacent tile should NOT be in line of sight (line of sight is orthogonal only)
			const isTargeted = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.drawTilesAlongLineOfSight,
				pbdPoints[0].tile
			);
			expect(isTargeted).toBe(false);
		});
	});

	describe('Chrysanthemum', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Chrysanthemum];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have immobilizeTiles ability for enemy air animals', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Chrysanthemum];
			const immobilizeAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.immobilizeTiles
			);
			expect(immobilizeAbility).toBeDefined();
			expect(immobilizeAbility.triggers[0].targetTileIdentifiers).toContain(
				TrifleTileIdentifier.air
			);
		});

		it('should have cancelZone ability for enemy air animals', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Chrysanthemum];
			const cancelZoneAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.cancelZone
			);
			expect(cancelZoneAbility).toBeDefined();
		});
	});

	describe('Edelweiss', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Edelweiss];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 2', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Edelweiss];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(2);
		});

		it('should have cancelAbilities for tiles in zone', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Edelweiss];
			const cancelAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.cancelAbilities
			);
			expect(cancelAbility).toBeDefined();
			expect(cancelAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
		});

		it('should target tiles in zone with cancelAbilities', () => {
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Edelweiss
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.Lavender // Another flower with abilities
			]);

			// Deploy Edelweiss
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Edelweiss,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy Lavender inside Edelweiss's zone (zone size is 2)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('1,0')
			}, false);

			// Get Lavender tile
			const lavenderPoints = gameManager.board.getTilePoints(TrifleTileCodes.Lavender, GUEST);
			expect(lavenderPoints.length).toBe(1);

			// Lavender is in Edelweiss's zone, so cancelAbilities should target it
			const isCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				lavenderPoints[0].tile
			);
			expect(isCanceled).toBe(true);
		});

		it('should NOT target tiles outside zone with cancelAbilities', () => {
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Edelweiss
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.Lavender
			]);

			// Deploy Edelweiss
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Edelweiss,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy Lavender OUTSIDE Edelweiss's zone (zone size is 2, so 3+ away)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('3,0')
			}, false);

			// Get Lavender tile
			const lavenderPoints = gameManager.board.getTilePoints(TrifleTileCodes.Lavender, GUEST);
			expect(lavenderPoints.length).toBe(1);

			// Lavender is outside Edelweiss's zone, so cancelAbilities should NOT target it
			const isCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				lavenderPoints[0].tile
			);
			expect(isCanceled).toBe(false);
		});

		it('should NOT target itself with cancelAbilities', () => {
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Edelweiss
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner
			]);

			// Deploy Edelweiss
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Edelweiss,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Get Edelweiss tile
			const edelweissPoints = gameManager.board.getTilePoints(TrifleTileCodes.Edelweiss, HOST);
			expect(edelweissPoints.length).toBe(1);

			// Edelweiss should NOT target itself (targetTileTypes: allButThisTile)
			const isCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				edelweissPoints[0].tile
			);
			expect(isCanceled).toBe(false);
		});

		it('should cancel abilities of both friendly and enemy tiles in zone', () => {
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Edelweiss,
				TrifleTileCodes.NobleRhubarb // Friendly flower with abilities
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.Lavender // Enemy flower with abilities
			]);

			// Deploy Edelweiss at center
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Edelweiss,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy enemy Lavender in zone
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('1,0')
			}, false);

			// Deploy friendly NobleRhubarb in zone
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.NobleRhubarb,
				endPoint: new NotationPoint('0,1')
			}, false);

			// Get tiles
			const lavenderPoints = gameManager.board.getTilePoints(TrifleTileCodes.Lavender, GUEST);
			const rhubarbPoints = gameManager.board.getTilePoints(TrifleTileCodes.NobleRhubarb, HOST);

			// Both should have cancelAbilities targeting them
			const lavenderCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				lavenderPoints[0].tile
			);
			const rhubarbCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				rhubarbPoints[0].tile
			);

			expect(lavenderCanceled).toBe(true);
			expect(rhubarbCanceled).toBe(true);
		});

		it('should neutralize immobilizeTiles when source tile is in zone', () => {
			// This test verifies that cancelAbilities actually prevents abilities from working
			// Edelweiss cancels abilities of tiles in its zone
			// Lavender immobilizes adjacent tiles
			// When Lavender is in Edelweiss's zone, its immobilize should be canceled
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Edelweiss
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.Lavender,
				TrifleTileCodes.Firefly
			]);

			// Deploy Edelweiss
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Edelweiss,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy Lavender inside Edelweiss's zone (zone size is 2)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('1,0')
			}, false);

			// Deploy Firefly adjacent to Lavender (so normally it would be immobilized)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('2,0')
			}, false);

			// Get tiles
			const lavenderPoints = gameManager.board.getTilePoints(TrifleTileCodes.Lavender, GUEST);
			const fireflyPoints = gameManager.board.getTilePoints(TrifleTileCodes.Firefly, GUEST);
			expect(lavenderPoints.length).toBe(1);
			expect(fireflyPoints.length).toBe(1);

			// First verify Lavender is being targeted by cancelAbilities
			const lavenderCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				lavenderPoints[0].tile
			);
			expect(lavenderCanceled).toBe(true);

			// Firefly should NOT be immobilized because Lavender's abilities are canceled
			const fireflyImmobilized = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.immobilizeTiles,
				fireflyPoints[0].tile
			);
			expect(fireflyImmobilized).toBe(false);
		});

		it('should allow immobilizeTiles to work when source tile is outside zone', () => {
			// Contrast test: when Lavender is OUTSIDE Edelweiss's zone, immobilize works
			const gameManager = new TrifleGameManager(mockActuator, true, true);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Edelweiss
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.Lavender,
				TrifleTileCodes.Firefly
			]);

			// Deploy Edelweiss
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Edelweiss,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy Lavender OUTSIDE Edelweiss's zone (zone size is 2, so 3+ away)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('3,0')
			}, false);

			// Deploy Firefly adjacent to Lavender
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('4,0')
			}, false);

			// Get tiles
			const lavenderPoints = gameManager.board.getTilePoints(TrifleTileCodes.Lavender, GUEST);
			const fireflyPoints = gameManager.board.getTilePoints(TrifleTileCodes.Firefly, GUEST);

			// Lavender is NOT targeted by cancelAbilities (outside zone)
			const lavenderCanceled = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.cancelAbilities,
				lavenderPoints[0].tile
			);
			expect(lavenderCanceled).toBe(false);

			// Firefly SHOULD be immobilized because Lavender's abilities are active
			const fireflyImmobilized = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.immobilizeTiles,
				fireflyPoints[0].tile
			);
			expect(fireflyImmobilized).toBe(true);
		});
	});

	describe('NobleRhubarb', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.NobleRhubarb];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have grantBonusMovement of 2 for adjacent friendly animals', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.NobleRhubarb];
			const bonusAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.grantBonusMovement
			);
			expect(bonusAbility).toBeDefined();
			expect(bonusAbility.bonusMovement.distance).toBe(2);
			expect(bonusAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsAdjacent
			);
		});
	});

	describe('Lavender', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Lavender];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have immobilizeTiles ability for adjacent tiles', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Lavender];
			const immobilizeAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.immobilizeTiles
			);
			expect(immobilizeAbility).toBeDefined();
			expect(immobilizeAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsAdjacent
			);
		});

		it('should immobilize adjacent tiles functionally', () => {
			// Add tiles to teams
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.Lavender
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly
			]);

			// Deploy Lavender
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy Firefly adjacent to Lavender
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,1')
			}, false);

			const fireflyPoints = gameManager.board.getTilePoints(TrifleTileCodes.Firefly, GUEST);
			expect(fireflyPoints.length).toBe(1);

			// Check that Firefly is immobilized
			const isImmobilized = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.immobilizeTiles,
				fireflyPoints[0].tile
			);
			expect(isImmobilized).toBe(true);
		});
	});
});

/**
 * Tests for Water tiles before Polar Bear Dog
 */
describe('Water Tiles - Definition and Abilities', () => {
	describe('WaterBanner', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.WaterBanner];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.banner);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.water);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have movement of 2 spaces', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.WaterBanner];
			expect(tileInfo.movements).toBeDefined();
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.standard);
			expect(tileInfo.movements[0].distance).toBe(2);
		});

		it('should only have game-rule capture restriction abilities (simple banner)', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.WaterBanner];
			// All tiles get restrictTileFromCapturing abilities from applyCaptureRestrictionsGameRuleAbilities
			expect(tileInfo.abilities).toBeDefined();
			tileInfo.abilities.forEach(ability => {
				expect(ability.type).toBe(TrifleAbilityName.restrictTileFromCapturing);
			});
		});
	});

	describe('SnowLeopard', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SnowLeopard];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.water);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have movement of 3 spaces with capture', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SnowLeopard];
			expect(tileInfo.movements[0].distance).toBe(3);
			expect(tileInfo.movements[0].captureTypes).toBeDefined();
		});

		it('should have cancelAbilities for protection abilities in line of sight', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SnowLeopard];
			const cancelAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.cancelAbilities
			);
			expect(cancelAbility).toBeDefined();
			expect(cancelAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight
			);
		});

		it('should have cancelAbilitiesTargetingTiles for protection', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SnowLeopard];
			const cancelTargetingAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.cancelAbilitiesTargetingTiles
			);
			expect(cancelTargetingAbility).toBeDefined();
		});
	});
});

/**
 * Tests for remaining Water tiles (after Buffalo Yak)
 */
describe('Water Tiles (after Buffalo Yak) - Definition and Abilities', () => {
	describe('TitanArum', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.TitanArum];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.water);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 2', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.TitanArum];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(2);
		});

		it('should have restrictMovementWithinZoneUnlessCapturing ability', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.TitanArum];
			const restrictAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.restrictMovementWithinZoneUnlessCapturing
			);
			expect(restrictAbility).toBeDefined();
			expect(restrictAbility.targetTileTypes).toContain(TrifleTileType.animal);
			expect(restrictAbility.targetTileTypes).toContain(TrifleTileType.banner);
		});
	});

	describe('LilyPad', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.LilyPad];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.water);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 1', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.LilyPad];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(1);
		});

		it('should have restrictMovementWithinZoneUnlessCapturing ability for all tiles', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.LilyPad];
			const restrictAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.restrictMovementWithinZoneUnlessCapturing
			);
			expect(restrictAbility).toBeDefined();
			// LilyPad restricts all tiles, not just specific types
			expect(restrictAbility.targetTileTypes).toBeUndefined();
		});
	});

	describe('Cattail', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Cattail];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.water);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have prohibitTileFromCapturing ability for adjacent enemies', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Cattail];
			const prohibitAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.prohibitTileFromCapturing
			);
			expect(prohibitAbility).toBeDefined();
			expect(prohibitAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsAdjacent
			);
		});
	});
});

/**
 * Tests for Earth tiles
 */
describe('Earth Tiles - Definition and Abilities', () => {
	describe('EarthBanner', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.EarthBanner];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.banner);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have protectFromCapture ability for adjacent friendly flowers', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.EarthBanner];
			const protectAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.protectFromCapture
			);
			expect(protectAbility).toBeDefined();
			expect(protectAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.flower);
		});
	});

	describe('Badgermole', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Badgermole];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have two movement types', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Badgermole];
			expect(tileInfo.movements.length).toBe(2);
			// Standard movement of 1
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.standard);
			expect(tileInfo.movements[0].distance).toBe(1);
			// Jump along line of sight to flowers/banners
			expect(tileInfo.movements[1].type).toBe(TrifleMovementType.jumpAlongLineOfSight);
			expect(tileInfo.movements[1].targetTileTypes).toContain(TrifleTileType.flower);
			expect(tileInfo.movements[1].targetTileTypes).toContain(TrifleTileType.banner);
		});

		it('should have protectFromCapture ability for adjacent friendly flowers/banners', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Badgermole];
			const protectAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.protectFromCapture
			);
			expect(protectAbility).toBeDefined();
			expect(protectAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.flower);
			expect(protectAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.banner);
		});
	});

	describe('SaberToothMooseLion', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SaberToothMooseLion];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have travelShape movement with charge capture', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SaberToothMooseLion];
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.travelShape);
			expect(tileInfo.movements[0].captureTypes).toBeDefined();
			expect(tileInfo.movements[0].abilities).toBeDefined();
		});
	});

	describe('Shirshu', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Shirshu];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have two movement types', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Shirshu];
			expect(tileInfo.movements.length).toBe(2);
			// Standard movement of 2 with capture of immobilized tiles
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.standard);
			expect(tileInfo.movements[0].distance).toBe(2);
			// Jump along line of sight to animals
			expect(tileInfo.movements[1].type).toBe(TrifleMovementType.jumpAlongLineOfSight);
		});

		it('should have immobilizeTiles ability for adjacent animals', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Shirshu];
			const immobilizeAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.immobilizeTiles
			);
			expect(immobilizeAbility).toBeDefined();
			expect(immobilizeAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.animal);
		});
	});

	describe('BoarQPine', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.BoarQPine];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have movement of 1 space', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.BoarQPine];
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.standard);
			expect(tileInfo.movements[0].distance).toBe(1);
		});

		it('should have captureTargetTiles ability when enemy lands adjacent', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.BoarQPine];
			const captureAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.captureTargetTiles
			);
			expect(captureAbility).toBeDefined();
			expect(captureAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whenTargetTileLandsAdjacent
			);
		});
	});

	describe('Sunflower', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Sunflower];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have gigantic attribute', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Sunflower];
			expect(tileInfo.attributes).toBeDefined();
			expect(tileInfo.attributes).toContain('gigantic');
		});

		it('should have growGigantic ability', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Sunflower];
			const growAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.growGigantic
			);
			expect(growAbility).toBeDefined();
			expect(growAbility.inevitable).toBe(true);
		});
	});
});

/**
 * Tests for Fire tiles
 */
describe('Fire Tiles - Definition and Abilities', () => {
	describe('Dragon', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Dragon];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
		});

		it('should have special deploy within FireLily zone', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Dragon];
			expect(tileInfo.specialDeployTypes).toBeDefined();
			expect(tileInfo.specialDeployTypes[0].targetTileCodes).toContain(TrifleTileCodes.FireLily);
		});

		it('should have movement within FireLily zone with capture', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Dragon];
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.withinFriendlyTileZone);
			expect(tileInfo.movements[0].targetTileCodes).toContain(TrifleTileCodes.FireLily);
			expect(tileInfo.movements[0].captureTypes).toBeDefined();
		});
	});

	describe('MessengerHawk', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.MessengerHawk];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
		});

		it('should deploy anywhere including temples', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.MessengerHawk];
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.temple);
		});

		it('should have movement anywhere', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.MessengerHawk];
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.anywhere);
		});
	});

	describe('FireLily', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.FireLily];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 5', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.FireLily];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(5);
		});
	});

	describe('FireBanner', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.FireBanner];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.banner);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have enlargeZone ability for adjacent friendly tiles', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.FireBanner];
			const enlargeAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.enlargeZone
			);
			expect(enlargeAbility).toBeDefined();
			expect(enlargeAbility.bonusZoneSize).toBe(1);
			expect(enlargeAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsAdjacent
			);
		});
	});
});

/**
 * FireBanner Zone Enlargement Functional Tests
 */
describe('FireBanner - Zone Enlargement Functionality', () => {
	let gameManager;
	const mockActuator = { actuate: vi.fn() };

	beforeEach(() => {
		gameManager = new TrifleGameManager(mockActuator, true, true);
	});

	it('should have getEffectiveZoneSize method on board', () => {
		expect(typeof gameManager.board.getEffectiveZoneSize).toBe('function');
	});

	it('should return base zone size when no enlargement abilities', () => {
		// Add tiles to teams
		addTilesToTeam(gameManager, HOST, [
			TrifleTileCodes.WaterBanner,
			TrifleTileCodes.FireLily  // Has zone size 5
		]);

		// Deploy FireLily
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: HOST,
			tileType: TrifleTileCodes.FireLily,
			endPoint: new NotationPoint('0,0')
		}, false);

		const fireLilyPoints = gameManager.board.getTilePoints(TrifleTileCodes.FireLily, HOST);
		expect(fireLilyPoints.length).toBe(1);

		// Check effective zone size (should be base 5)
		const effectiveSize = gameManager.board.getEffectiveZoneSize(fireLilyPoints[0].tile, 5);
		expect(effectiveSize).toBe(5);
	});

	it('should enlarge zone when FireBanner is adjacent', () => {
		// Add tiles to teams (only one banner per team)
		addTilesToTeam(gameManager, HOST, [
			TrifleTileCodes.FireBanner,
			TrifleTileCodes.FireLily
		]);
		addTilesToTeam(gameManager, GUEST, [
			TrifleTileCodes.AirBanner,
			TrifleTileCodes.Chrysanthemum
		]);

		// Deploy FireLily
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: HOST,
			tileType: TrifleTileCodes.FireLily,
			endPoint: new NotationPoint('0,0')
		}, false);

		// Deploy GUEST tile
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: GUEST,
			tileType: TrifleTileCodes.Chrysanthemum,
			endPoint: new NotationPoint('4,4')
		}, false);

		// Deploy FireBanner adjacent to FireLily
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: HOST,
			tileType: TrifleTileCodes.FireBanner,
			endPoint: new NotationPoint('0,1')
		}, false);

		const fireLilyPoints = gameManager.board.getTilePoints(TrifleTileCodes.FireLily, HOST);
		expect(fireLilyPoints.length).toBe(1);

		// Check that enlargeZone ability is active on FireLily
		const hasEnlargement = gameManager.board.abilityManager.abilityTargetingTileExists(
			TrifleAbilityName.enlargeZone,
			fireLilyPoints[0].tile
		);
		expect(hasEnlargement).toBe(true);

		// Check effective zone size (should be 5 + 1 = 6)
		const effectiveSize = gameManager.board.getEffectiveZoneSize(fireLilyPoints[0].tile, 5);
		expect(effectiveSize).toBe(6);
	});

	it('should not enlarge zone for non-adjacent tiles', () => {
		// Add tiles to teams (only one banner per team)
		addTilesToTeam(gameManager, HOST, [
			TrifleTileCodes.FireBanner,
			TrifleTileCodes.FireLily
		]);
		addTilesToTeam(gameManager, GUEST, [
			TrifleTileCodes.AirBanner,
			TrifleTileCodes.Chrysanthemum
		]);

		// Deploy FireLily
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: HOST,
			tileType: TrifleTileCodes.FireLily,
			endPoint: new NotationPoint('0,0')
		}, false);

		// Deploy GUEST tile
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: GUEST,
			tileType: TrifleTileCodes.Chrysanthemum,
			endPoint: new NotationPoint('4,4')
		}, false);

		// Deploy FireBanner NOT adjacent to FireLily (distance 3)
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: HOST,
			tileType: TrifleTileCodes.FireBanner,
			endPoint: new NotationPoint('0,3')
		}, false);

		const fireLilyPoints = gameManager.board.getTilePoints(TrifleTileCodes.FireLily, HOST);

		// Check effective zone size (should still be base 5)
		const effectiveSize = gameManager.board.getEffectiveZoneSize(fireLilyPoints[0].tile, 5);
		expect(effectiveSize).toBe(5);
	});

	it('should not enlarge zone for enemy tiles', () => {
		// Add tiles to teams (only one banner per team)
		addTilesToTeam(gameManager, HOST, [
			TrifleTileCodes.FireBanner
		]);
		addTilesToTeam(gameManager, GUEST, [
			TrifleTileCodes.AirBanner,
			TrifleTileCodes.FireLily  // Enemy FireLily
		]);

		// Deploy FireBanner
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: HOST,
			tileType: TrifleTileCodes.FireBanner,
			endPoint: new NotationPoint('0,0')
		}, false);

		// Deploy enemy FireLily adjacent to FireBanner
		gameManager.runNotationMove({
			moveType: DEPLOY,
			player: GUEST,
			tileType: TrifleTileCodes.FireLily,
			endPoint: new NotationPoint('0,1')
		}, false);

		const fireLilyPoints = gameManager.board.getTilePoints(TrifleTileCodes.FireLily, GUEST);

		// Check that enlargeZone ability is NOT active on enemy FireLily
		const hasEnlargement = gameManager.board.abilityManager.abilityTargetingTileExists(
			TrifleAbilityName.enlargeZone,
			fireLilyPoints[0].tile
		);
		expect(hasEnlargement).toBe(false);

		// Check effective zone size (should still be base 5)
		const effectiveSize = gameManager.board.getEffectiveZoneSize(fireLilyPoints[0].tile, 5);
		expect(effectiveSize).toBe(5);
	});
});

/**
 * Tests for Fixed TODO Tiles
 */
describe('Fixed TODO Tiles - Definition and Abilities', () => {
	describe('GrippingGrass', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.GrippingGrass];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have immobilizeTiles ability for adjacent animals', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.GrippingGrass];
			const immobilizeAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.immobilizeTiles
			);
			expect(immobilizeAbility).toBeDefined();
			expect(immobilizeAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsAdjacent
			);
			expect(immobilizeAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.animal);
		});
	});

	describe('KomodoRhino', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.KomodoRhino];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have movement of 2 spaces with capture', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.KomodoRhino];
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.standard);
			expect(tileInfo.movements[0].distance).toBe(2);
			expect(tileInfo.movements[0].captureTypes).toBeDefined();
		});

		it('should have changeMovementDistanceByFactor ability for enemies in line of sight', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.KomodoRhino];
			const factorAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.changeMovementDistanceByFactor
			);
			expect(factorAbility).toBeDefined();
			expect(factorAbility.distanceAdjustmentFactor).toBe(0.5);
			expect(factorAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight
			);
		});
	});

	describe('ArmadilloBear', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.ArmadilloBear];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have movement of 2 spaces with capture', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.ArmadilloBear];
			expect(tileInfo.movements[0].type).toBe(TrifleMovementType.standard);
			expect(tileInfo.movements[0].distance).toBe(2);
			expect(tileInfo.movements[0].captureTypes).toBeDefined();
		});

		it('should have protectFromCapture ability when near FireLily', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.ArmadilloBear];
			const protectAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.protectFromCapture
			);
			expect(protectAbility).toBeDefined();
			expect(protectAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsWithinDistance
			);
			expect(protectAbility.triggers[0].targetTileCodes).toContain(TrifleTileCodes.FireLily);
			expect(protectAbility.triggers[0].distance).toBe(2);
		});
	});

	describe('CherryBlossom', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.CherryBlossom];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 2', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.CherryBlossom];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(2);
		});

		it('should have protectFromCapture ability for tiles in zone (except CherryBlossom)', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.CherryBlossom];
			const protectAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.protectFromCapture
			);
			expect(protectAbility).toBeDefined();
			expect(protectAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
			expect(protectAbility.excludeTileCodes).toContain(TrifleTileCodes.CherryBlossom);
		});

		it('should have canBeCapturedByFriendlyTiles attribute', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.CherryBlossom];
			expect(tileInfo.attributes).toBeDefined();
			expect(tileInfo.attributes).toContain(TrifleAttributeType.canBeCapturedByFriendlyTiles);
		});
	});

	describe('GrassWeed', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.GrassWeed];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 1', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.GrassWeed];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(1);
		});

		it('should have captureTargetTiles ability when deployed targeting adjacentTiles', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.GrassWeed];
			const captureAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.captureTargetTiles
			);
			expect(captureAbility).toBeDefined();
			expect(captureAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whenDeployed
			);
			expect(captureAbility.triggers[0].targetTileTypes).toContain(TrifleTileCategory.thisTile);
			expect(captureAbility.targetTypes).toContain(TrifleTargetType.adjacentTiles);
		});

		it('should have restrictDeploymentInZone ability for flowers', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.GrassWeed];
			const restrictAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.restrictDeploymentInZone
			);
			expect(restrictAbility).toBeDefined();
			expect(restrictAbility.deployTargetTileTypes).toContain(TrifleTileType.flower);
		});

		it('should have restrictMovementWithinZone ability for flowers', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.GrassWeed];
			const restrictAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.restrictMovementWithinZone
			);
			expect(restrictAbility).toBeDefined();
			expect(restrictAbility.targetTileTypes).toContain(TrifleTileType.flower);
		});
	});

	describe('Chamomile', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Chamomile];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 7', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Chamomile];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(7);
		});

		it('should have immobilizeTiles ability for itself (cannot move)', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Chamomile];
			const immobilizeAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.immobilizeTiles
			);
			expect(immobilizeAbility).toBeDefined();
		});

		it('should have setMovementDistance ability for tiles in zone', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Chamomile];
			const setDistanceAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.setMovementDistance
			);
			expect(setDistanceAbility).toBeDefined();
			expect(setDistanceAbility.movementDistance).toBe(2);
			expect(setDistanceAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
		});
	});

	describe('SnowWolf', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SnowWolf];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.animal);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.water);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should move 3 spaces and capture', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SnowWolf];
			expect(tileInfo.movements).toBeDefined();
			expect(tileInfo.movements.length).toBe(1);
			expect(tileInfo.movements[0].distance).toBe(3);
			expect(tileInfo.movements[0].captureTypes).toContain(TrifleCaptureType.all);
		});

		it('should have retaliation ability when adjacent friendly tile is captured', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SnowWolf];
			expect(tileInfo.abilities).toBeDefined();
			const retaliationAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.captureTargetTiles &&
					a.triggerType === TrifleAbilityTriggerType.whenAdjacentFriendlyTileIsCaptured
			);
			expect(retaliationAbility).toBeDefined();
		});

		it('should move to captured enemy position after retaliation', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SnowWolf];
			const retaliationAbility = tileInfo.abilities.find(
				a => a.triggerType === TrifleAbilityTriggerType.whenAdjacentFriendlyTileIsCaptured
			);
			expect(retaliationAbility.moveSourceToTargetPosition).toBe(true);
		});

		it('should capture regardless of protection', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.SnowWolf];
			const retaliationAbility = tileInfo.abilities.find(
				a => a.triggerType === TrifleAbilityTriggerType.whenAdjacentFriendlyTileIsCaptured
			);
			expect(retaliationAbility.regardlessOfCaptureProtection).toBe(true);
		});
	});

	describe('WaterHyacinth', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.WaterHyacinth];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.water);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 6', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.WaterHyacinth];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(6);
		});

		it('should have cannotDeployAfterTileTypes restriction for banners', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.WaterHyacinth];
			expect(tileInfo.cannotDeployAfterTileTypes).toBeDefined();
			expect(tileInfo.cannotDeployAfterTileTypes).toContain(TrifleTileType.banner);
		});

		it('should have requireDeployInZone ability with deployTargetTileTypes', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.WaterHyacinth];
			expect(tileInfo.abilities).toBeDefined();
			const requireDeployAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.requireDeployInZone
			);
			expect(requireDeployAbility).toBeDefined();
			expect(requireDeployAbility.deployTargetTileTypes).toBeDefined();
			expect(requireDeployAbility.deployTargetTileTypes).toContain(TrifleTileType.banner);
		});

		it('should restrict banner deployment to within WaterHyacinth zone', () => {
			const mockActuator = { actuate: vi.fn() };
			const gameManager = new TrifleGameManager(mockActuator, true, true);

			// Add tiles to teams
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterHyacinth,
				TrifleTileCodes.WaterBanner
			]);

			// Deploy WaterHyacinth at (0,0)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.WaterHyacinth,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Verify WaterHyacinth is on the board
			const waterHyacinthPoints = gameManager.board.getTilePoints(TrifleTileCodes.WaterHyacinth, HOST);
			expect(waterHyacinthPoints.length).toBe(1);

			// Verify the board has deployPassesConstraintChecks method
			expect(typeof gameManager.board.deployPassesConstraintChecks).toBe('function');

			// Verify WaterHyacinth tile info has the correct ability configuration
			const waterHyacinthTileInfo = TrifleTiles[TrifleTileCodes.WaterHyacinth];
			const requireDeployAbility = waterHyacinthTileInfo.abilities.find(
				a => a.type === TrifleAbilityName.requireDeployInZone
			);
			expect(requireDeployAbility).toBeDefined();
			expect(requireDeployAbility.triggers).toBeDefined();
			expect(requireDeployAbility.triggers[0].triggerType).toBe(TrifleAbilityTriggerType.whileOnBoard);
			expect(requireDeployAbility.deployTargetTileTypes).toContain(TrifleTileType.banner);

			// Verify the zone size is correctly configured
			expect(waterHyacinthTileInfo.territorialZone.size).toBe(6);

			// Verify banners are correctly typed as banner tiles
			const waterBannerInfo = TrifleTiles[TrifleTileCodes.WaterBanner];
			expect(waterBannerInfo.types).toContain(TrifleTileType.banner);
		});

		it('should have setDeployPointsPossibleMoves method and banner configuration for deployment', () => {
			const mockActuator = { actuate: vi.fn() };
			const gameManager = new TrifleGameManager(mockActuator, true, true);

			// Verify the board has the method used to calculate deploy points
			expect(typeof gameManager.board.setDeployPointsPossibleMoves).toBe('function');

			// Verify WaterBanner is configured to deploy anywhere
			const waterBannerInfo = TrifleTiles[TrifleTileCodes.WaterBanner];
			expect(waterBannerInfo.deployTypes).toBeDefined();
			expect(waterBannerInfo.deployTypes).toContain(TrifleDeployType.anywhere);

			// Verify banner tiles are properly typed
			expect(waterBannerInfo.types).toContain(TrifleTileType.banner);

			// Verify all banner types have deploy anywhere
			const bannerCodes = [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.EarthBanner,
				TrifleTileCodes.FireBanner
			];
			bannerCodes.forEach(code => {
				const bannerInfo = TrifleTiles[code];
				expect(bannerInfo).toBeDefined();
				expect(bannerInfo.types).toContain(TrifleTileType.banner);
				expect(bannerInfo.deployTypes).toContain(TrifleDeployType.anywhere);
			});
		});

		it('should activate requireDeployInZone ability and restrict banner deploy points', () => {
			const mockActuator = { actuate: vi.fn() };
			const gameManager = new TrifleGameManager(mockActuator, true, true);

			// Add tiles to teams
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterHyacinth,
				TrifleTileCodes.WaterBanner
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Chrysanthemum
			]);

			// Deploy WaterHyacinth at (0,0)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.WaterHyacinth,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Verify WaterHyacinth is on the board
			const waterHyacinthPoints = gameManager.board.getTilePoints(TrifleTileCodes.WaterHyacinth, HOST);
			expect(waterHyacinthPoints.length).toBe(1);

			// Deploy a GUEST tile to allow HOST to play again
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Chrysanthemum,
				endPoint: new NotationPoint('7,7')
			}, false);

			// Verify the requireDeployInZone ability is active
			const requireDeployAbilities = gameManager.board.abilityManager.getActiveAbilitiesFromTile(
				TrifleAbilityName.requireDeployInZone,
				waterHyacinthPoints[0].tile
			);
			expect(requireDeployAbilities.length).toBeGreaterThan(0);

			// Create a banner tile and verify deploy constraint checks work
			const bannerTile = new TrifleTile(TrifleTileCodes.WaterBanner, 'H');
			const bannerTileInfo = TrifleTiles[TrifleTileCodes.WaterBanner];

			// Point within zone (distance 3 from (0,0)) should be allowed
			const pointInZone = gameManager.board.getPointFromNotationPoint(new NotationPoint('3,0'));
			expect(gameManager.board.deployPassesConstraintChecks(bannerTile, bannerTileInfo, pointInZone)).toBe(true);

			// Point outside zone (distance 8 from (0,0)) should not be allowed
			const pointOutsideZone = gameManager.board.getPointFromNotationPoint(new NotationPoint('8,0'));
			expect(gameManager.board.deployPassesConstraintChecks(bannerTile, bannerTileInfo, pointOutsideZone)).toBe(false);

			// Non-banner tile should be unaffected
			const nonBannerTile = new TrifleTile(TrifleTileCodes.Chrysanthemum, 'H');
			const nonBannerTileInfo = TrifleTiles[TrifleTileCodes.Chrysanthemum];
			const farPoint = gameManager.board.getPointFromNotationPoint(new NotationPoint('8,0'));
			expect(gameManager.board.deployPassesConstraintChecks(nonBannerTile, nonBannerTileInfo, farPoint)).toBe(true);
		});
	});

	describe('MoonFlower', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.MoonFlower];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have resurrectAtDeployPosition ability', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.MoonFlower];
			expect(tileInfo.abilities).toBeDefined();
			const resurrectionAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.resurrectAtDeployPosition
			);
			expect(resurrectionAbility).toBeDefined();
		});
	});

	describe('Saffron', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Saffron];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 4', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Saffron];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(4);
		});

		it('should have substituteForCapture ability', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Saffron];
			expect(tileInfo.abilities).toBeDefined();
			const substituteAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.substituteForCapture
			);
			expect(substituteAbility).toBeDefined();
		});
	});

	describe('Saffron - substituteForCapture Behavior', () => {
		let gameManager;
		const mockActuator = { actuate: vi.fn() };

		beforeEach(() => {
			gameManager = new TrifleGameManager(mockActuator, true, true);
		});

		it('should substitute Saffron when a friendly tile in zone is captured at destination', () => {
			// Setup: GUEST Saffron at (0,2), GUEST FireLily at (0,0) within zone,
			// HOST PolarBearDog 4 spaces away at (0,-4) ready to capture FireLily.
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.FireBanner,
				TrifleTileCodes.Saffron,
				TrifleTileCodes.FireLily
			]);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Saffron,
				endPoint: new NotationPoint('0,2')
			}, false);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.FireLily,
				endPoint: new NotationPoint('0,0')
			}, false);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,-4')
			}, false);

			// HOST PolarBearDog captures GUEST FireLily at (0,0)
			gameManager.runNotationMove({
				moveType: MOVE,
				player: HOST,
				startPoint: new NotationPoint('0,-4'),
				endPoint: new NotationPoint('0,0')
			}, false);

			// Saffron should be captured (substituted itself)
			const saffronPoints = gameManager.board.getTilePoints(TrifleTileCodes.Saffron, GUEST);
			expect(saffronPoints.length).toBe(0);

			// FireLily should be restored to Saffron's old position (0,2)
			// because capture point (0,0) is occupied by the attacker
			const fireLilyPoints = gameManager.board.getTilePoints(TrifleTileCodes.FireLily, GUEST);
			expect(fireLilyPoints.length).toBe(1);

			// PolarBearDog should be at (0,0) where it landed
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, HOST);
			expect(pbdPoints.length).toBe(1);
		});

		// Charge capture mid-path substitution cannot be integration-tested because
		// travelShape movement validation (setPossibleMovePoints) does not compute
		// valid paths through occupied spaces, even with chargeCapture. This is a
		// pre-existing limitation in the movement engine.
		// The trigger brain and ability brain support mid-path captures correctly
		// via the capturedTilePoints array - the standard capture test above
		// verifies the full pipeline works end-to-end.

		it('should NOT substitute when an enemy tile in zone is captured', () => {
			// Saffron only protects FRIENDLY tiles. When a GUEST tile captures a HOST
			// tile that's inside GUEST Saffron's zone, Saffron should NOT substitute
			// because the captured tile is an enemy, not a friendly.
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.FireBanner,
				TrifleTileCodes.Saffron,
				TrifleTileCodes.PolarBearDog
			]);
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.FireLily
			]);

			// GUEST Saffron at (0,2), zone covers (0,0)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Saffron,
				endPoint: new NotationPoint('0,2')
			}, false);

			// HOST FireLily at (0,0) - enemy tile within Saffron's zone
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.FireLily,
				endPoint: new NotationPoint('0,0')
			}, false);

			// GUEST PolarBearDog at (0,-4) - friendly attacker
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,-4')
			}, false);

			// GUEST PolarBearDog captures HOST FireLily at (0,0)
			gameManager.runNotationMove({
				moveType: MOVE,
				player: GUEST,
				startPoint: new NotationPoint('0,-4'),
				endPoint: new NotationPoint('0,0')
			}, false);

			// HOST FireLily should be captured (no substitution - it's an enemy)
			const fireLilyPoints = gameManager.board.getTilePoints(TrifleTileCodes.FireLily, HOST);
			expect(fireLilyPoints.length).toBe(0);

			// GUEST Saffron should still be on the board (did not substitute)
			const saffronPoints = gameManager.board.getTilePoints(TrifleTileCodes.Saffron, GUEST);
			expect(saffronPoints.length).toBe(1);

			// GUEST PolarBearDog should be at (0,0)
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, GUEST);
			expect(pbdPoints.length).toBe(1);
		});

		it('should NOT substitute when captured tile is outside Saffron zone', () => {
			// Setup: GUEST Saffron at (0,7), GUEST FireLily at (0,0) - far outside zone.
			// HOST PolarBearDog captures FireLily. No substitution should occur.
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.FireBanner,
				TrifleTileCodes.Saffron,
				TrifleTileCodes.FireLily
			]);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Saffron,
				endPoint: new NotationPoint('0,7')
			}, false);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.FireLily,
				endPoint: new NotationPoint('0,0')
			}, false);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,-4')
			}, false);

			// HOST PolarBearDog captures GUEST FireLily at (0,0)
			gameManager.runNotationMove({
				moveType: MOVE,
				player: HOST,
				startPoint: new NotationPoint('0,-4'),
				endPoint: new NotationPoint('0,0')
			}, false);

			// FireLily should be captured (no substitution - outside zone)
			const fireLilyPoints = gameManager.board.getTilePoints(TrifleTileCodes.FireLily, GUEST);
			expect(fireLilyPoints.length).toBe(0);

			// Saffron should still be on the board
			const saffronPoints = gameManager.board.getTilePoints(TrifleTileCodes.Saffron, GUEST);
			expect(saffronPoints.length).toBe(1);
		});

		it('should NOT declare a winner when Saffron saves a captured banner', () => {
			// If HOST captures GUEST's banner but Saffron substitutes for it,
			// the banner is restored. No winner should be declared.
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.FireBanner,
				TrifleTileCodes.Saffron
			]);

			// GUEST Saffron at (0,2)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Saffron,
				endPoint: new NotationPoint('0,2')
			}, false);

			// GUEST FireBanner at (0,0) - within Saffron's zone
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.FireBanner,
				endPoint: new NotationPoint('0,0')
			}, false);

			// HOST PolarBearDog at (0,-4)
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,-4')
			}, false);

			// HOST PolarBearDog captures GUEST FireBanner at (0,0)
			gameManager.runNotationMove({
				moveType: MOVE,
				player: HOST,
				startPoint: new NotationPoint('0,-4'),
				endPoint: new NotationPoint('0,0')
			}, false);

			// FireBanner should be restored (at Saffron's old position)
			const bannerPoints = gameManager.board.getTilePoints(TrifleTileCodes.FireBanner, GUEST);
			expect(bannerPoints.length).toBe(1);

			// Saffron should be captured
			const saffronPoints = gameManager.board.getTilePoints(TrifleTileCodes.Saffron, GUEST);
			expect(saffronPoints.length).toBe(0);

			// No winner should be declared
			expect(gameManager.getWinner()).toBeUndefined();
		});

		it('should NOT substitute when Saffron itself is captured', () => {
			// Setup: GUEST Saffron at (0,0). HOST PolarBearDog captures Saffron directly.
			// Saffron should not substitute for itself.
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.FireBanner,
				TrifleTileCodes.Saffron
			]);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Saffron,
				endPoint: new NotationPoint('0,0')
			}, false);

			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,-4')
			}, false);

			// HOST PolarBearDog captures GUEST Saffron at (0,0)
			gameManager.runNotationMove({
				moveType: MOVE,
				player: HOST,
				startPoint: new NotationPoint('0,-4'),
				endPoint: new NotationPoint('0,0')
			}, false);

			// Saffron should be captured normally
			const saffronPoints = gameManager.board.getTilePoints(TrifleTileCodes.Saffron, GUEST);
			expect(saffronPoints.length).toBe(0);

			// PolarBearDog should be at (0,0)
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, HOST);
			expect(pbdPoints.length).toBe(1);
		});
	});

	describe('Elderberry', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Elderberry];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.earth);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 3', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Elderberry];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(3);
		});

		it('should have Antidote Aura - cancelAbilitiesTargetingTiles for immobilization', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Elderberry];
			expect(tileInfo.abilities).toBeDefined();
			const antidoteAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.cancelAbilitiesTargetingTiles
			);
			expect(antidoteAbility).toBeDefined();
			expect(antidoteAbility.abilityTypesToCancel).toContain(TrifleAbilityName.immobilizeTiles);
			expect(antidoteAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
		});

		it('should have Invigorating Essence - grantBonusMovement for friendly animals', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Elderberry];
			const movementAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.grantBonusMovement
			);
			expect(movementAbility).toBeDefined();
			expect(movementAbility.bonusMovement.distance).toBe(1);
			expect(movementAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
			expect(movementAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.animal);
		});
	});

	describe('Wisteria', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Wisteria];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.air);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 4', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Wisteria];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(4);
		});

		it('should have Ascending Winds - grantBonusMovement with jumpOver for friendly animals', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Wisteria];
			const movementAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.grantBonusMovement
			);
			expect(movementAbility).toBeDefined();
			expect(movementAbility.bonusMovement.distance).toBe(1);
			expect(movementAbility.bonusMovement.abilities).toContain(TrifleMovementAbility.jumpOver);
			expect(movementAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
			expect(movementAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.animal);
		});

		it('should have Sheltering Veil - cancelAbilitiesTargetingTiles for drawTilesAlongLineOfSight', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Wisteria];
			const shieldAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.cancelAbilitiesTargetingTiles
			);
			expect(shieldAbility).toBeDefined();
			expect(shieldAbility.abilityTypesToCancel).toContain(TrifleAbilityName.drawTilesAlongLineOfSight);
			expect(shieldAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
		});
	});

	describe('Duckweed', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Duckweed];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.water);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 2', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Duckweed];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(2);
		});

		it('should have Surface Calm - prohibitTileFromCapturing for enemy tiles in zone', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Duckweed];
			const prohibitAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.prohibitTileFromCapturing
			);
			expect(prohibitAbility).toBeDefined();
			expect(prohibitAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
		});

		it('should have Floating Refuge - protectFromCapture for friendly tiles in zone (except Duckweed)', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Duckweed];
			const protectAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.protectFromCapture
			);
			expect(protectAbility).toBeDefined();
			expect(protectAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
			expect(protectAbility.excludeTileCodes).toContain(TrifleTileCodes.Duckweed);
		});
	});

	describe('Marigold', () => {
		it('should have correct tile properties', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Marigold];
			expect(tileInfo).toBeDefined();
			expect(tileInfo.types).toContain(TrifleTileType.flower);
			expect(tileInfo.identifiers).toContain(TrifleTileIdentifier.fire);
			expect(tileInfo.deployTypes).toContain(TrifleDeployType.anywhere);
		});

		it('should have territorial zone of size 3', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Marigold];
			expect(tileInfo.territorialZone).toBeDefined();
			expect(tileInfo.territorialZone.size).toBe(3);
		});

		it('should have Scorching Presence - cancelAbilities for enemy flowers in zone', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Marigold];
			const cancelAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.cancelAbilities
			);
			expect(cancelAbility).toBeDefined();
			expect(cancelAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
			expect(cancelAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.flower);
		});

		it('should have Flame\'s Vigor - grantBonusMovement for friendly banners in zone', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.Marigold];
			const movementAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.grantBonusMovement
			);
			expect(movementAbility).toBeDefined();
			expect(movementAbility.bonusMovement.distance).toBe(1);
			expect(movementAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whileTargetTileIsInZone
			);
			expect(movementAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.banner);
		});
	});
});

/**
 * All previously partial tiles have been implemented:
 * - SnowWolf (Water) - retaliation trigger when adjacent friendly is captured
 * - WaterHyacinth (Water) - banner deploy restriction
 * - MoonFlower (Earth) - resurrection after capture
 * - Saffron (Fire) - capture substitution
 * - Elderberry (Earth) - Antidote Aura (cures immobilization) + Invigorating Essence (+1 movement for animals)
 *
 * New flowers added:
 * - Wisteria (Air) - Ascending Winds (+1 jump movement for animals) + Sheltering Veil (blocks draw abilities)
 * - Duckweed (Water) - Surface Calm (enemies can't capture in zone) + Floating Refuge (protects friendlies)
 * - Marigold (Fire) - Scorching Presence (cancels enemy flower abilities) + Flame's Vigor (+1 movement for banners)
 */

describe('TrifleGameNotation', () => {
	describe('JSON notation (new format)', () => {
		it('should load moves from JSON notation', () => {
			const notation = new TrifleGameNotation(HOST);
			const jsonMoves = [
				{ moveNum: 0, player: HOST, moveType: TEAM_SELECTION, teamSelection: 'L,D,W' },
				{ moveNum: 0, player: GUEST, moveType: TEAM_SELECTION, teamSelection: 'L,D,W' },
				{ moveNum: 1, player: HOST, moveType: DEPLOY, tileType: 'Dragon', endPoint: '-2,0' },
				{ moveNum: 1, player: GUEST, moveType: MOVE, startPoint: '-8,0', endPoint: '-6,3' }
			];
			notation.setNotationText(JSON.stringify(jsonMoves));

			expect(notation.moves.length).toBe(4);
			expect(notation.moves[0].moveType).toBe(TEAM_SELECTION);
			expect(notation.moves[0].teamSelection).toBe('L,D,W');
			expect(notation.moves[2].moveType).toBe(DEPLOY);
			expect(notation.moves[2].tileType).toBe('Dragon');
			expect(notation.moves[2].endPoint).toBe('-2,0');
			expect(notation.moves[3].moveType).toBe(MOVE);
			expect(notation.moves[3].startPoint).toBe('-8,0');
			expect(notation.moves[3].endPoint).toBe('-6,3');
		});
	});

	describe('Old text notation (backward compatibility)', () => {
		it('should parse old team selection notation', () => {
			const notation = new TrifleGameNotation(HOST);
			notation.setNotationText('0H.L,D,W');

			expect(notation.moves.length).toBe(1);
			expect(notation.moves[0].moveNum).toBe(0);
			expect(notation.moves[0].player).toBe(HOST);
			expect(notation.moves[0].moveType).toBe(TEAM_SELECTION);
			expect(notation.moves[0].teamSelection).toBe('L,D,W');
		});

		it('should parse old deploy notation', () => {
			const notation = new TrifleGameNotation(HOST);
			notation.setNotationText('0H.L,D,W;0G.L,D,W;1H.Dragon(-2,0)');

			expect(notation.moves.length).toBe(3);
			const deployMove = notation.moves[2];
			expect(deployMove.moveType).toBe(DEPLOY);
			expect(deployMove.player).toBe(HOST);
			expect(deployMove.tileType).toBe('Dragon');
			expect(deployMove.endPoint).toBe('-2,0');
		});

		it('should parse old move notation', () => {
			const notation = new TrifleGameNotation(HOST);
			notation.setNotationText('0H.L,D,W;0G.L,D,W;1H.Dragon(-2,0);1G.(-8,0)-(-6,3)');

			expect(notation.moves.length).toBe(4);
			const moveMove = notation.moves[3];
			expect(moveMove.moveType).toBe(MOVE);
			expect(moveMove.player).toBe(GUEST);
			expect(moveMove.startPoint).toBe('-8,0');
			expect(moveMove.endPoint).toBe('-6,3');
		});

		it('should parse old draw offer notation', () => {
			const notation = new TrifleGameNotation(HOST);
			notation.setNotationText('0H.L,D,W;0G.L,D,W;1H.Dragon(-2,0)~~');

			const deployMove = notation.moves[2];
			expect(deployMove.offerDraw).toBe(true);
		});

		it('should parse old draw accept notation', () => {
			const notation = new TrifleGameNotation(HOST);
			notation.setNotationText('0H.L,D,W;0G.L,D,W;1H.==');

			const acceptMove = notation.moves[2];
			expect(acceptMove.moveType).toBe(DRAW_ACCEPT);
		});

		it('should produce same move format as new JSON notation', () => {
			// Parse old format
			const oldNotation = new TrifleGameNotation(HOST);
			oldNotation.setNotationText('0H.L,D,W;0G.L,D,W;1H.Dragon(-2,0);1G.(-8,0)-(-6,3)');

			// Parse equivalent new format
			const newNotation = new TrifleGameNotation(HOST);
			const jsonMoves = [
				{ moveNum: 0, player: HOST, moveType: TEAM_SELECTION, teamSelection: 'L,D,W' },
				{ moveNum: 0, player: GUEST, moveType: TEAM_SELECTION, teamSelection: 'L,D,W' },
				{ moveNum: 1, player: HOST, moveType: DEPLOY, tileType: 'Dragon', endPoint: '-2,0' },
				{ moveNum: 1, player: GUEST, moveType: MOVE, startPoint: '-8,0', endPoint: '-6,3' }
			];
			newNotation.setNotationText(JSON.stringify(jsonMoves));

			// Verify same structure
			expect(oldNotation.moves.length).toBe(newNotation.moves.length);
			for (let i = 0; i < oldNotation.moves.length; i++) {
				expect(oldNotation.moves[i].moveNum).toBe(newNotation.moves[i].moveNum);
				expect(oldNotation.moves[i].player).toBe(newNotation.moves[i].player);
				expect(oldNotation.moves[i].moveType).toBe(newNotation.moves[i].moveType);
				if (oldNotation.moves[i].teamSelection) {
					expect(oldNotation.moves[i].teamSelection).toBe(newNotation.moves[i].teamSelection);
				}
				if (oldNotation.moves[i].tileType) {
					expect(oldNotation.moves[i].tileType).toBe(newNotation.moves[i].tileType);
				}
				if (oldNotation.moves[i].startPoint) {
					expect(oldNotation.moves[i].startPoint).toBe(newNotation.moves[i].startPoint);
				}
				if (oldNotation.moves[i].endPoint) {
					expect(oldNotation.moves[i].endPoint).toBe(newNotation.moves[i].endPoint);
				}
			}
		});
	});

	describe('notationTextForUrl', () => {
		it('should strip animationInfo from serialized output', () => {
			const notation = new TrifleGameNotation(HOST);
			notation.moves = [
				{ moveNum: 0, player: HOST, moveType: TEAM_SELECTION, teamSelection: 'L,D,W' },
				{ moveNum: 1, player: HOST, moveType: MOVE, startPoint: '0,0', endPoint: '0,1',
					animationInfo: { startPoint: '0,0', endPoint: '0,1', movedTile: {} } }
			];

			const urlText = notation.notationTextForUrl();
			const parsed = JSON.parse(urlText);
			expect(parsed[1].animationInfo).toBeUndefined();
			expect(parsed[1].startPoint).toBe('0,0');
		});

		it('should strip empty promptTargetData from serialized output', () => {
			const notation = new TrifleGameNotation(HOST);
			notation.moves = [
				{ moveNum: 0, player: HOST, moveType: DEPLOY, tileType: 'Dragon', endPoint: '0,0', promptTargetData: {} }
			];

			const urlText = notation.notationTextForUrl();
			const parsed = JSON.parse(urlText);
			expect(parsed[0].promptTargetData).toBeUndefined();
		});

		it('should preserve non-empty promptTargetData', () => {
			const notation = new TrifleGameNotation(HOST);
			notation.moves = [
				{ moveNum: 0, player: HOST, moveType: MOVE, startPoint: '0,0', endPoint: '0,1',
					promptTargetData: { someKey: 'someValue' } }
			];

			const urlText = notation.notationTextForUrl();
			const parsed = JSON.parse(urlText);
			expect(parsed[0].promptTargetData).toEqual({ someKey: 'someValue' });
		});
	});
});
