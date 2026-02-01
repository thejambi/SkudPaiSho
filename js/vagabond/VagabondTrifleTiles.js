// Vagabond Trifle Tiles - Tile definitions for Vagabond using Trifle engine

import {
  OPTION_DOUBLE_TILES,
  SWAP_BISON_WITH_LEMUR,
  V_DOUBLE_MOVE_DISTANCE,
  gameOptionEnabled,
} from '../GameOptions';
import {
  TrifleAbilityName,
  TrifleAbilityTriggerType,
  TrifleActivationRequirement,
  TrifleCaptureType,
  TrifleDeployType,
  TrifleMovementAbility,
  TrifleMovementRestriction,
  TrifleMovementType,
  TrifleSpecialDeployType,
  TrifleTargetType,
  TrifleTileCategory,
  TrifleTileInfo,
  TrifleTileTeam,
  TrifleZoneAbility,
} from '../trifle/TrifleTileInfo';
import { TrifleTileType } from '../trifle/TrifleTiles';
import { clearObject } from '../GameData';
import { setCurrentTileNames } from '../trifle/PaiShoGamesTileMetadata';

export var VagabondTrifleTileCodes = {
	WhiteLotus: "L",
	SkyBison: "S",
	FlyingLemur: "Y",
	Dragon: "D",
	Wheel: "W",
	Badgermole: "B",
	Chrysanthemum: "C",
	FireLily: "F"
};

export var VagabondTileType = {
	flower: "flower",
	lotus: "lotus",
	animal: "animal",
	traveler: "traveler"
};

export var VagabondTrifleTiles = {};
export var VagabondTileInfo = {};

VagabondTileInfo.initializeTrifleData = function() {
	VagabondTileInfo.setTileNames();
	TrifleTileInfo.initializeTrifleData();
	VagabondTileInfo.defineVagabondTiles();
};

VagabondTileInfo.setTileNames = function() {
	var tileNames = {};
	tileNames[VagabondTrifleTileCodes.WhiteLotus] = "White Lotus";
	tileNames[VagabondTrifleTileCodes.SkyBison] = "Sky Bison";
	tileNames[VagabondTrifleTileCodes.FlyingLemur] = "Flying Lemur";
	tileNames[VagabondTrifleTileCodes.Dragon] = "White Dragon";
	tileNames[VagabondTrifleTileCodes.Wheel] = "Wheel";
	tileNames[VagabondTrifleTileCodes.Badgermole] = "Badgermole";
	tileNames[VagabondTrifleTileCodes.Chrysanthemum] = "Chrysanthemum";
	tileNames[VagabondTrifleTileCodes.FireLily] = "Fire Lily";
	setCurrentTileNames(tileNames);
};

VagabondTileInfo.defineVagabondTiles = function() {
	clearObject(VagabondTrifleTiles);

	var moveDistanceMultiplier = gameOptionEnabled(V_DOUBLE_MOVE_DISTANCE) ? 2 : 1;

	// White Lotus - Win condition tile
	// Movement: 1 space
	// Cannot capture
	// Capturing this tile wins the game
	VagabondTrifleTiles[VagabondTrifleTileCodes.WhiteLotus] = {
		available: true,
		types: [VagabondTileType.flower, VagabondTileType.lotus],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 1 * moveDistanceMultiplier
				// No captureTypes - Lotus cannot capture
			}
		],
		isWinConditionTile: true,
		textLines: [
			"<strong>White Lotus</strong>",
			"<em>Win condition tile</em>",
			"",
			"<strong>Movement</strong>",
			"- Moves 1 space",
			"- Cannot capture",
			"",
			"<strong>Win Condition</strong>",
			"- Capture opponent's White Lotus to win"
		]
	};

	// Sky Bison - Territorial creature
	// Deploys at gates only
	// Movement: 6 spaces
	// Can capture
	// Has territorial zone of size 6
	// Blocked by adjacent enemy Chrysanthemum
	// Enemy Sky Bison cannot enter this tile's zone
	VagabondTrifleTiles[VagabondTrifleTileCodes.SkyBison] = {
		available: true,
		types: [VagabondTileType.animal],
		deployTypes: [TrifleDeployType.temple], // Gates = Temples in Trifle
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 6 * moveDistanceMultiplier,
				captureTypes: [
					{
						type: TrifleCaptureType.all
					}
				]
			}
		],
		territorialZone: {
			size: 6,
			abilities: [
				{
					type: TrifleZoneAbility.restrictMovementWithinZone,
					targetTeams: [TrifleTileTeam.enemy],
					targetTileCodes: [VagabondTrifleTileCodes.SkyBison]
				}
			]
		},
		abilities: [
			{
				title: "Blocked by Chrysanthemum",
				type: TrifleAbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.enemy],
						targetTileCodes: [VagabondTrifleTileCodes.Chrysanthemum]
					}
				],
				targetTypes: [TrifleTargetType.thisTile]
			}
		],
		textLines: [
			"<strong>Sky Bison</strong>",
			"",
			"<strong>Deployment</strong>",
			"- Deploys at Gates only",
			"",
			"<strong>Movement</strong>",
			"- Moves up to 6 spaces",
			"- Can capture",
			"",
			"<strong>Abilities</strong>",
			"- Enemy Sky Bison cannot enter this tile's zone",
			"- Blocked when adjacent to enemy Chrysanthemum"
		]
	};

	// Flying Lemur - Jump-over creature
	// Deploys at gates only
	// Movement: 5 spaces, can jump over tiles
	// Can capture
	// Blocked by adjacent enemy Chrysanthemum
	VagabondTrifleTiles[VagabondTrifleTileCodes.FlyingLemur] = {
		available: true,
		types: [VagabondTileType.animal],
		deployTypes: [TrifleDeployType.temple],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 5 * moveDistanceMultiplier,
				captureTypes: [
					{
						type: TrifleCaptureType.all
					}
				],
				abilities: [
					{
						type: TrifleMovementAbility.jumpOver
					}
				]
			}
		],
		abilities: [
			{
				title: "Blocked by Chrysanthemum",
				type: TrifleAbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.enemy],
						targetTileCodes: [VagabondTrifleTileCodes.Chrysanthemum]
					}
				],
				targetTypes: [TrifleTargetType.thisTile]
			}
		],
		textLines: [
			"<strong>Flying Lemur</strong>",
			"",
			"<strong>Deployment</strong>",
			"- Deploys at Gates only",
			"",
			"<strong>Movement</strong>",
			"- Moves up to 5 spaces",
			"- Can jump over other tiles",
			"- Can capture",
			"",
			"<strong>Abilities</strong>",
			"- Blocked when adjacent to enemy Chrysanthemum"
		]
	};

	// Dragon - Fire Lily zone restricted
	// Deploys within Fire Lily zone only
	// Movement: 5 spaces, must stay within Fire Lily zone
	// Can capture
	VagabondTrifleTiles[VagabondTrifleTileCodes.Dragon] = {
		available: true,
		types: [VagabondTileType.animal],
		specialDeployTypes: [
			{
				type: TrifleSpecialDeployType.withinFriendlyTileZone,
				targetTileCodes: [VagabondTrifleTileCodes.FireLily]
			}
		],
		movements: [
			{
				type: TrifleMovementType.withinFriendlyTileZone,
				targetTileCodes: [VagabondTrifleTileCodes.FireLily],
				distance: 5 * moveDistanceMultiplier,
				captureTypes: [
					{
						type: TrifleCaptureType.all
					}
				]
			}
		],
		textLines: [
			"<strong>White Dragon</strong>",
			"",
			"<strong>Deployment</strong>",
			"- Deploys within Fire Lily's zone only",
			"",
			"<strong>Movement</strong>",
			"- Moves up to 5 spaces",
			"- Must stay within Fire Lily's zone",
			"- Can capture"
		]
	};

	// Wheel - Unlimited diagonal movement (on grid)
	// Deploys anywhere (not gates)
	// Movement: Unlimited in one diagonal direction (appears as cardinal on rotated board)
	// Can capture
	VagabondTrifleTiles[VagabondTrifleTileCodes.Wheel] = {
		available: true,
		types: [VagabondTileType.traveler],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.diagonal,
				distance: 99, // Unlimited
				captureTypes: [
					{
						type: TrifleCaptureType.all
					}
				],
				restrictions: [
					{
						type: TrifleMovementRestriction.mustPreserveDirection
					}
				]
			}
		],
		textLines: [
			"<strong>Wheel</strong>",
			"",
			"<strong>Movement</strong>",
			"- Moves unlimited spaces in one direction",
			"- Moves along diagonals on the grid (appears as up/down/left/right on rotated board)",
			"- Can capture"
		]
	};

	// Badgermole - Flower protector
	// Deploys anywhere (not gates)
	// Movement: 1 space OR jump to flower in line-of-sight
	// Cannot capture
	// Protects adjacent friendly flowers from capture
	VagabondTrifleTiles[VagabondTrifleTileCodes.Badgermole] = {
		available: true,
		types: [VagabondTileType.animal],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 1 * moveDistanceMultiplier
				// No captureTypes - Badgermole cannot capture
			},
			{
				type: TrifleMovementType.jumpAlongLineOfSight,
				targetTileTypes: [VagabondTileType.flower],
				targetTeams: [TrifleTileTeam.friendly]
				// Jump to friendly flower tile in line-of-sight
			}
		],
		abilities: [
			{
				title: "Protect Adjacent Flowers",
				type: TrifleAbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileTypes: [VagabondTileType.flower]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"<strong>Badgermole</strong>",
			"",
			"<strong>Movement</strong>",
			"- Moves 1 space",
			"- OR jumps directly to a friendly flower in line-of-sight",
			"- Cannot capture",
			"",
			"<strong>Ability</strong>",
			"- Protects adjacent friendly flower tiles from capture"
		]
	};

	// Chrysanthemum - Blocking flower
	// Deploys anywhere (not gates)
	// Cannot move
	// Blocks adjacent enemy Sky Bison and Flying Lemur
	VagabondTrifleTiles[VagabondTrifleTileCodes.Chrysanthemum] = {
		available: true,
		types: [VagabondTileType.flower],
		deployTypes: [TrifleDeployType.anywhere],
		// No movements - Chrysanthemum cannot move
		abilities: [
			{
				title: "Block Air Creatures",
				type: TrifleAbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.enemy],
						targetTileCodes: [
							VagabondTrifleTileCodes.SkyBison,
							VagabondTrifleTileCodes.FlyingLemur
						]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"<strong>Chrysanthemum</strong>",
			"<em>Flower tile</em>",
			"",
			"<strong>Movement</strong>",
			"- Cannot move",
			"",
			"<strong>Ability</strong>",
			"- Blocks adjacent enemy Sky Bison and Flying Lemur from moving"
		]
	};

	// Fire Lily - Dragon zone provider
	// Deploys anywhere (not gates)
	// Cannot move
	// Has territorial zone of size 5 that enables Dragon deployment and movement
	VagabondTrifleTiles[VagabondTrifleTileCodes.FireLily] = {
		available: true,
		types: [VagabondTileType.flower],
		deployTypes: [TrifleDeployType.anywhere],
		// No movements - Fire Lily cannot move
		territorialZone: {
			size: 5
			// Zone enables Dragon deployment and movement (handled by Dragon's definition)
		},
		textLines: [
			"<strong>Fire Lily</strong>",
			"<em>Flower tile</em>",
			"",
			"<strong>Movement</strong>",
			"- Cannot move",
			"",
			"<strong>Zone</strong>",
			"- Creates a zone of size 5",
			"- Dragon can only deploy and move within this zone"
		]
	};

	// Apply Vagabond-specific capture rules
	applyVagabondCaptureRules(VagabondTrifleTiles);
};

// Vagabond capture rules:
// - Cannot capture Flower tiles until your Lotus is deployed
// - Cannot capture non-Flower tiles until BOTH players' Lotuses are deployed
function applyVagabondCaptureRules(tiles) {
	Object.keys(tiles).forEach(function(key) {
		var tileInfo = tiles[key];
		if (tileInfo.movements && tileInfo.movements.length) {
			tileInfo.movements.forEach(function(movementInfo) {
				if (movementInfo.captureTypes && movementInfo.captureTypes.length) {
					movementInfo.captureTypes.forEach(function(captureTypeInfo) {
						// Add requirement: Friendly Lotus must be on board to capture
						var friendlyLotusRequirement = {
							type: TrifleActivationRequirement.tileIsOnBoard,
							targetTileCodes: [VagabondTrifleTileCodes.WhiteLotus],
							targetTeams: [TrifleTileTeam.friendly]
						};

						// For capturing non-flowers, also require enemy Lotus on board
						// This is a simplified version - full implementation would need
						// different requirements for flower vs non-flower targets
						var bothLotusRequirement = {
							type: TrifleActivationRequirement.tileIsOnBoard,
							targetTileCodes: [VagabondTrifleTileCodes.WhiteLotus],
							targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy]
						};

						if (captureTypeInfo.activationRequirements) {
							captureTypeInfo.activationRequirements.push(friendlyLotusRequirement);
						} else {
							captureTypeInfo.activationRequirements = [friendlyLotusRequirement];
						}
					});
				}
			});
		}
	});
}

// Helper to check if a tile is a flower
VagabondTileInfo.tileIsFlower = function(tileInfo) {
	return tileInfo && tileInfo.types && tileInfo.types.includes(VagabondTileType.flower);
};

// Helper to check if a tile is the Lotus
VagabondTileInfo.tileIsLotus = function(tileInfo) {
	return tileInfo && tileInfo.types && tileInfo.types.includes(VagabondTileType.lotus);
};
