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
import { NotationPoint, DEPLOY, MOVE, TEAM_SELECTION, HOST, GUEST } from '../js/CommonNotationObjects';
import { TrifleTileCodes, defineTrifleTiles, TrifleTileType, TrifleTileIdentifier } from '../js/trifle/TrifleTiles';
import { TrifleMovementType, TrifleDeployType, TrifleCaptureType, TrifleMovementAbility } from '../js/trifle/TrifleTileInfo';
import { TrifleAbilityName, TrifleZoneAbility, TrifleAbilityTriggerType, TrifleAttributeType } from '../js/trifle/TrifleTileInfo';
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
		it('should have duration property defined on Polar Bear Dog ability', () => {
			const polarBearDogInfo = TrifleTiles[TrifleTileCodes.PolarBearDog];
			expect(polarBearDogInfo).toBeDefined();
			expect(polarBearDogInfo.abilities).toBeDefined();

			const protectAbility = polarBearDogInfo.abilities.find(
				a => a.type === TrifleAbilityName.protectFromCapture
			);
			expect(protectAbility).toBeDefined();
			expect(protectAbility.duration).toBe(1);
		});

		it('should activate protectFromCapture when capturing a tile', () => {
			// Add tiles to teams first
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,  // Need a banner
				TrifleTileCodes.PolarBearDog
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly
			]);

			// Deploy HOST Polar Bear Dog
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy GUEST tile nearby that can be captured
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,4')
			}, false);

			// Get the Polar Bear Dog tile
			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, HOST);
			expect(pbdPoints.length).toBe(1);
			const pbdTile = pbdPoints[0].tile;

			// Move Polar Bear Dog to capture the Firefly (distance 4)
			gameManager.runNotationMove({
				moveType: MOVE,
				player: HOST,
				startPoint: new NotationPoint('0,0'),
				endPoint: new NotationPoint('0,4')
			}, false);

			// Check that protectFromCapture ability is now active for the Polar Bear Dog
			const hasProtection = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.protectFromCapture,
				pbdTile
			);
			expect(hasProtection).toBe(true);
		});

		it('should expire protection after opponent turn (2 ticks)', () => {
			// Add tiles to teams first
			addTilesToTeam(gameManager, HOST, [
				TrifleTileCodes.WaterBanner,
				TrifleTileCodes.PolarBearDog,
				TrifleTileCodes.Lavender
			]);
			addTilesToTeam(gameManager, GUEST, [
				TrifleTileCodes.AirBanner,
				TrifleTileCodes.Firefly,
				TrifleTileCodes.Chrysanthemum
			]);

			// Deploy HOST Polar Bear Dog
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.PolarBearDog,
				endPoint: new NotationPoint('0,0')
			}, false);

			// Deploy GUEST tile nearby that can be captured
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Firefly,
				endPoint: new NotationPoint('0,4')
			}, false);

			// Deploy another GUEST tile for their move
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: GUEST,
				tileType: TrifleTileCodes.Chrysanthemum,
				endPoint: new NotationPoint('4,4')
			}, false);

			const pbdPoints = gameManager.board.getTilePoints(TrifleTileCodes.PolarBearDog, HOST);
			const pbdTile = pbdPoints[0].tile;

			// HOST moves Polar Bear Dog to capture
			gameManager.runNotationMove({
				moveType: MOVE,
				player: HOST,
				startPoint: new NotationPoint('0,0'),
				endPoint: new NotationPoint('0,4')
			}, false);

			// Protection should be active
			let hasProtection = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.protectFromCapture,
				pbdTile
			);
			expect(hasProtection).toBe(true);

			// GUEST makes a move (this ticks duration at the start)
			gameManager.runNotationMove({
				moveType: MOVE,
				player: GUEST,
				startPoint: new NotationPoint('4,4'),
				endPoint: new NotationPoint('4,3')
			}, false);

			// After GUEST's move, duration was ticked to 0.5
			// Protection should still be active
			hasProtection = gameManager.board.abilityManager.abilityTargetingTileExists(
				TrifleAbilityName.protectFromCapture,
				pbdTile
			);
			expect(hasProtection).toBe(true);

			// Deploy another HOST tile for their next move
			// This is HOST's next turn - tick happens at start, duration -> 0
			gameManager.runNotationMove({
				moveType: DEPLOY,
				player: HOST,
				tileType: TrifleTileCodes.Lavender,
				endPoint: new NotationPoint('6,6')
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

	it('should call tickDurationAbilities at the start of each move', () => {
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

		it('should have removesTileAbilities zone ability targeting flowers', () => {
			const buffaloYakInfo = TrifleTiles[TrifleTileCodes.BuffaloYak];
			expect(buffaloYakInfo.territorialZone.abilities).toBeDefined();

			const removeAbility = buffaloYakInfo.territorialZone.abilities.find(
				a => a.type === TrifleZoneAbility.removesTileAbilities
			);
			expect(removeAbility).toBeDefined();
			expect(removeAbility.targetTileTypes).toContain(TrifleTileType.flower);
		});
	});

	describe('Zone Ability Functionality', () => {
		it('should have tileAbilitiesRemovedByZone method on board', () => {
			expect(typeof gameManager.board.tileAbilitiesRemovedByZone).toBe('function');
		});

		it('should return false when no zone affects the tile', () => {
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

			// No Buffalo Yak on the board, so abilities should NOT be removed
			const isRemoved = gameManager.board.tileAbilitiesRemovedByZone(
				flowerPoints[0].tile,
				flowerPoints[0]
			);
			expect(isRemoved).toBe(false);
		});

		it('should remove flower abilities when within Buffalo Yak zone', () => {
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

			// Flower is within Buffalo Yak's zone, so abilities should be removed
			const isRemoved = gameManager.board.tileAbilitiesRemovedByZone(
				flowerPoints[0].tile,
				flowerPoints[0]
			);
			expect(isRemoved).toBe(true);
		});

		it('should not affect flower outside Buffalo Yak zone', () => {
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

			// Flower is outside Buffalo Yak's zone, abilities should NOT be removed
			const isRemoved = gameManager.board.tileAbilitiesRemovedByZone(
				flowerPoints[0].tile,
				flowerPoints[0]
			);
			expect(isRemoved).toBe(false);
		});

		it('should not affect non-flower tiles within zone', () => {
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

			// Animal is within zone but not a flower, so abilities should NOT be removed
			const isRemoved = gameManager.board.tileAbilitiesRemovedByZone(
				animalPoints[0].tile,
				animalPoints[0]
			);
			expect(isRemoved).toBe(false);
		});

		it('should affect friendly flower tiles within zone', () => {
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
			const isRemoved = gameManager.board.tileAbilitiesRemovedByZone(
				flowerPoints[0].tile,
				flowerPoints[0]
			);
			expect(isRemoved).toBe(true);
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

		it('should have no abilities (simple banner)', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.WaterBanner];
			expect(tileInfo.abilities).toBeUndefined();
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
				TrifleAbilityTriggerType.whileTargetTileIsSurrounding
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

		it('should have captureTargetTiles ability when deployed', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.GrassWeed];
			const captureAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.captureTargetTiles
			);
			expect(captureAbility).toBeDefined();
			expect(captureAbility.triggers[0].triggerType).toBe(
				TrifleAbilityTriggerType.whenDeployed
			);
			expect(captureAbility.triggers[0].targetTileTypes).toContain(TrifleTileType.flower);
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

		it('should have requireBannerDeployInZone ability', () => {
			const tileInfo = TrifleTiles[TrifleTileCodes.WaterHyacinth];
			expect(tileInfo.abilities).toBeDefined();
			const requireBannerAbility = tileInfo.abilities.find(
				a => a.type === TrifleAbilityName.requireBannerDeployInZone
			);
			expect(requireBannerAbility).toBeDefined();
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
