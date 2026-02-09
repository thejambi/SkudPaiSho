// Trifle Engine - Tile Definitions
// Documentation: ~/Dropbox/Programming/SkudPaiSho/TheGardenGate/backend/TGGDocumentation/Trifle/

import {
  TrifleAbilityName,
  TrifleAbilityTriggerType,
  TrifleAbilityType,
  TrifleActivationRequirement,
  TrifleAttributeType,
  TrifleCaptureType,
  TrifleDeployType,
  TrifleMoveDirection,
  TrifleMovementAbility,
  TrifleMovementRestriction,
  TrifleMovementType,
  TriflePromptTargetType,
  TrifleSpecialDeployType,
  TrifleTargetPromptId,
  TrifleTargetType,
  TrifleTileCategory,
  TrifleTileTeam,
  TrifleTiles,
} from './TrifleTileInfo';
import { clearObject } from '../GameData';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';

export const TrifleTileCodes = {
	/* Spirit */
	// SpiritBanner: "SpiritBanner",
	// BaboonSpirit: "BaboonSpirit",
	// Cabbage: "Cabbage",
	// SpiritPortal: "SpiritPortal",
	/* Other / Future */
	// MongooseLizard: "MongooseLizard",
	AirGlider: 'AirGlider',
	// Wheel: 'Wheel',
	// Lotus: 'Lotus',
	/* --- */

	/* Air */
	AirBanner: 'AirBanner',
	SkyBison: 'SkyBison',
	FlyingLemur: "FlyingLemur",
	HermitCrab: 'HermitCrab',
	Firefly: 'Firefly',
	Chrysanthemum: 'Chrysanthemum',
	Edelweiss: 'Edelweiss',
	NobleRhubarb: 'NobleRhubarb',
	Lavender: 'Lavender',
	Wisteria: 'Wisteria',
	/* Water */
	WaterBanner: 'WaterBanner',
	SnowLeopard: "SnowLeopard",
	PolarBearDog: 'PolarBearDog',
	BuffaloYak: 'BuffaloYak',
	SnowWolf: "SnowWolf",
	TitanArum: 'TitanArum',
	LilyPad: 'LilyPad',
	Cattail: "Cattail",
	WaterHyacinth: "WaterHyacinth",
	Duckweed: "Duckweed",
	/* Earth */
	EarthBanner: 'EarthBanner',
	Badgermole: 'Badgermole',
	SaberToothMooseLion: 'SaberToothMooseLion',
	Shirshu: 'Shirshu',
	BoarQPine: 'BoarQPine',
	CherryBlossom: "CherryBlossom",
	Sunflower: "Sunflower",
	MoonFlower: "MoonFlower",
	Chamomile: "Chamomile",
	Elderberry: "Elderberry",
	/* Fire */
	FireBanner: "FireBanner",
	Dragon: 'Dragon',
	KomodoRhino: "KomodoRhino",
	ArmadilloBear: "ArmadilloBear",
	MessengerHawk: 'MessengerHawk',
	FireLily: 'FireLily',
	GrassWeed: "GrassWeed",
	GrippingGrass: "GrippingGrass",
	Saffron: "Saffron",
	Marigold: "Marigold"
};

export const TrifleTileType = {
	banner: "Banner",
	animal: "Animal",
	flower: "Flower",
	fruit: "Fruit",
	other: "Other",
	traveler: "Traveler"
};

export const TrifleTileIdentifier = {
	air: "Air",
	water: "Water",
	earth: "Earth",
	fire: "Fire"
};

/**
 * Convert a PascalCase tile code to a readable name with spaces
 * e.g., "AirBanner" -> "Air Banner", "SkyBison" -> "Sky Bison"
 */
function toReadableName(code) {
	return code.replace(/([a-z])([A-Z])/g, '$1 $2');
}

/**
 * Generate readable tile names map from TrifleTileCodes
 */
export function generateTrifleTileNames() {
	const tileNames = {};
	Object.keys(TrifleTileCodes).forEach((key) => {
		const code = TrifleTileCodes[key];
		tileNames[code] = toReadableName(code);
	});
	return tileNames;
}

export function defineTrifleTiles() {
	// var TrifleTiles = {};
	clearObject(TrifleTiles);

	/* Air */

	TrifleTiles[TrifleTileCodes.AirBanner] = {	/* Done */
		available: true,
		types: [TrifleTileType.banner],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [ TrifleDeployType.anywhere ],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 1
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.grantBonusMovement,
				bonusMovement: {
					type: TrifleMovementType.standard,
					distance: 1
				},
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.allTiles],
				targetTeams: [TrifleTileTeam.friendly],
				targetTileTypes: [TrifleTileType.flower]
			}
		],
		textLines: [
			"Banner | Air",
			"Deploys anywhere",
			"Moves 1 space",
			"While Air Banner is on the board, friendly flower tiles are granted bonus movement of 1 space"
		]
	};

	TrifleTiles[TrifleTileCodes.SkyBison] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [ TrifleDeployType.temple ],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 6,
				captureTypes: [ TrifleCaptureType.all ]
			}
		],
		territorialZone: {
			size: 6,
		},
		abilities: [
			{
				type: TrifleAbilityName.cancelZone,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileInsideTemple,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			},
			{
				type: TrifleAbilityName.restrictMovementWithinZone,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.allTiles],
				targetTeams: [TrifleTileTeam.enemy],
				targetTileCodes: [TrifleTileCodes.SkyBison]
			}
		],
		textLines: [
			"Animal | Air",
			"Deploys in Temples",
			"Moves 6 spaces, can capture",
			"Territorial Zone: 6",
			"Enemy Sky Bison may not move into this tile's Zone",
			"While inside a Temple, Sky Bison has no Zone"
		]
	};

	TrifleTiles[TrifleTileCodes.FlyingLemur] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [ TrifleDeployType.temple ],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 5,
				captureTypes: [ TrifleCaptureType.all ],
				abilities: [
					{
						type: TrifleMovementAbility.jumpOver
					}
				]
			}
		],
		textLines: [
			"Animal | Air",
			"Deploys in Temples",
			"Flies 5 spaces, can capture"
		]
	};

	TrifleTiles[TrifleTileCodes.HermitCrab] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.jumpShape,
				shape: [1, 2],
				distance: 99,
				captureTypes: [ TrifleCaptureType.all ],
				abilities: [
					{
						type: TrifleMovementAbility.jumpOver
					}
				],
				restrictions: [
					{
						type: TrifleMovementRestriction.mustPreserveDirection
					}
				]
			}
		],
		/* abilities: [
			{
				title: "Active Badgermole Flip",
				type: TrifleAbilityName.moveTargetTile,
				isPassiveMovement: true,
				optional: true,
				neededPromptTargetsInfo: [
					{
						title: "flippedTile",
						promptId: TrifleTargetPromptId.movedTilePoint,
						targetType: TriflePromptTargetType.boardPoint
					},
					{
						title: "flipLanding",
						promptId: TrifleTargetPromptId.movedTileDestinationPoint,
						targetType: TriflePromptTargetType.boardPoint
					}
				],
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenLandsSurroundingTargetTile,
						targetTileTypes: [TrifleTileCategory.allTileTypes],
						activationRequirements: [
							{
								type: TrifleActivationRequirement.tileIsOnPointOfType,
								targetTileTypes: [TrifleTileCategory.thisTile],
								targetPointTypes: [WHITE]
							}
						]
					},
					{
						triggerType: TrifleAbilityTriggerType.whenActiveMovement,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				triggerTypeToTarget: TrifleAbilityTriggerType.whenLandsSurroundingTargetTile,
				numberOfTargetTiles: 1,
				promptTargetTitle: "flippedTile",
				targetTileMovements: [
					{
						type: TrifleMovementType.jumpTargetTile,
						distance: 1,
						targetTileTypes: [TrifleTileCategory.tileWithAbility],
						regardlessOfImmobilization: true
					}
				]
			}
		], */
		textLines: [
			"Animal | Air",
			"Deploys anywhere",
			"Jumps in a 1-2 shape any number of times in same direction, jumping over pieces in path, can capture"
		]
	};

	TrifleTiles[TrifleTileCodes.Firefly] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [TrifleDeployType.temple],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 2
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.drawTilesAlongLineOfSight,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [TrifleTileTeam.enemy]
					},
					{
						triggerType: TrifleAbilityTriggerType.whileOutsideTemple,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				triggerTypeToTarget: TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight
			}
		],
		textLines: [
			"Animal | Air",
			"Deploys in Temples",
			"Moves 2 spaces",
			"While outside a Temple, enemy tiles are drawn along Firefly's line of sight",
			"(enemy tiles in Firefly's line of sight can only move if they move closer to Firefly and remain in Firefly's line of sight)"
		]
	};

	TrifleTiles[TrifleTileCodes.Chrysanthemum] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [
			{
				type: TrifleAbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.enemy],
						targetTileTypes: [TrifleTileType.animal],
						targetTileIdentifiers: [TrifleTileIdentifier.air]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			},
			{
				type: TrifleAbilityName.cancelZone,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.enemy],
						targetTileTypes: [TrifleTileType.animal],
						targetTileIdentifiers: [TrifleTileIdentifier.air]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Air",
			"Deploys anywhere",
			"Enemy Air Animals adjacent to Chrysanthemum are immobilized and have no Zone"
		]
	};

	TrifleTiles[TrifleTileCodes.Edelweiss] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 2
		},
		abilities: [
			{
				type: TrifleAbilityName.cancelAbilities,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTileTypes: [TrifleTileCategory.allButThisTile]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				targetAbilityTypes: [TrifleAbilityType.all]
			}
		],
		textLines: [
			"Flower | Air",
			"Deploys anywhere",
			"Territorial Zone: 2",
			"Abilities of other tiles in Edelweiss' Zone are canceled"
		]
	};

	TrifleTiles[TrifleTileCodes.NobleRhubarb] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [
			{
				type: TrifleAbilityName.grantBonusMovement,
				bonusMovement: {
					type: TrifleMovementType.standard,
					distance: 2
				},
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileTypes: [TrifleTileType.animal]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Air",
			"Deploys anywhere",
			"Friendly animal tiles adjacent to Noble Rhubarb have bonus movement of 2"
		]
	};

	TrifleTiles[TrifleTileCodes.Lavender] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [
			{
				type: TrifleAbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Air",
			"Deploys anywhere",
			"Tiles adjacent to Lavender are immobilized"
		]
	};

	/* Claude-created Tile */
	TrifleTiles[TrifleTileCodes.Wisteria] = {	/* Done */
		available: false,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.air],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 4
		},
		abilities: [
			{
				// Ascending Winds: Friendly animals in zone gain jump movement
				type: TrifleAbilityName.grantBonusMovement,
				bonusMovement: {
					type: TrifleMovementType.standard,
					distance: 1,
					abilities: [TrifleMovementAbility.jumpOver]
				},
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileTypes: [TrifleTileType.animal]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			},
			{
				// Sheltering Veil: Friendly tiles in zone cannot be drawn by enemy abilities
				type: TrifleAbilityName.cancelAbilitiesTargetingTiles,
				abilityTypesToCancel: [TrifleAbilityName.drawTilesAlongLineOfSight],
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.friendly]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Air",
			"Deploys anywhere",
			"Territorial Zone: 4",
			"Ascending Winds: Friendly animals in zone gain +1 jump movement",
			"Sheltering Veil: Friendly tiles in zone cannot be drawn by enemy abilities"
		]
	};

	/* Water */

	TrifleTiles[TrifleTileCodes.WaterBanner] = {	/* Done */
		available: true,
		types: [TrifleTileType.banner],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [ TrifleDeployType.anywhere ],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 2
			}
		],
		textLines: [
			"Banner | Water",
			"Deploys anywhere",
			"Moves 2 spaces"
		]
	};

	TrifleTiles[TrifleTileCodes.SnowLeopard] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 3,
				captureTypes: [ TrifleCaptureType.all ]
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.cancelAbilities,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [TrifleTileTeam.enemy]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				targetAbilityTypes: [TrifleAbilityType.protection]
			},
			{
				type: TrifleAbilityName.cancelAbilitiesTargetingTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [TrifleTileTeam.enemy]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				targetAbilityTypes: [TrifleAbilityType.protection]
			}
		],
		textLines: [
			"Animal | Water",
			"Deploys anywhere",
			"Moves 3 spaces, can capture",
			"Protection abilities coming from or applying to enemy tiles in Snow Leopard's line of sight are canceled"
		]
	};

	TrifleTiles[TrifleTileCodes.PolarBearDog] = {	/* Done - Needs manual testing */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 4,
				captureTypes: [ TrifleCaptureType.all ]
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenCapturingTargetTile,
						targetTileTypes: [TrifleTileCategory.allTileTypes]
					}
				],
				targetTypes: [TrifleTargetType.thisTile],
				duration: 1 // Lasts through opponent's next turn (ticked at end of each turn)
			}
		],
		textLines: [
			"Animal | Water",
			"If this tile captures an opponent's tile it can't be captured on your opponent next turn. Moves 4 spaces. Can capture other tiles."
		]
	};

	TrifleTiles[TrifleTileCodes.BuffaloYak] = {	/* Done - Needs manual testing */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 2,
				captureTypes: [TrifleCaptureType.all]
			}
		],
		territorialZone: {
			size: 2
		},
		abilities: [
			{
				type: TrifleAbilityName.cancelAbilities,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy],
						targetTileTypes: [TrifleTileType.flower]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				targetAbilityTypes: [TrifleAbilityType.all]
			}
		],
		textLines: [
			"Animal | Water",
			"Flower tiles within 2 spaces have their effects nullified. Can move two spaces, and can capture."
		]
	};

	TrifleTiles[TrifleTileCodes.SnowWolf] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 3,
				captureTypes: [TrifleCaptureType.all]
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.captureTargetTiles,
				moveSourceToTargetPosition: true,
				triggerType: TrifleAbilityTriggerType.whenAdjacentFriendlyTileIsCaptured,
				regardlessOfCaptureProtection: true,
				targetTriggerInfo: {
					targetType: TrifleTargetType.triggerTargetTiles
				}
			}
		],
		textLines: [
			"Animal | Water",
			"Deploys anywhere",
			"Moves 3 spaces, can capture",
			"When enemy captures adjacent friendly tile, capture that enemy and move to its space"
		]
	};

	TrifleTiles[TrifleTileCodes.TitanArum] = {	/* Done */	// TODO: Allow restrictMovementWithinZone affected tiles to move away as much as possible if they cannot escape zone?
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [ TrifleDeployType.anywhere ],
		territorialZone: {
			size: 2
		},
		abilities: [
			{
				type: TrifleAbilityName.restrictMovementWithinZoneUnlessCapturing,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.allTiles],
				targetTeams: [TrifleTileTeam.enemy, TrifleTileTeam.friendly],
				targetTileTypes: [TrifleTileType.animal, TrifleTileType.banner]
			}
		],
		textLines: [
			"Flower | Water",
			"Deploys anywhere",
			"Territorial Zone: 2",
			"Animal and Banner tiles may not move into Titan Arum's zone unless they are capturing"
		]
	};

	TrifleTiles[TrifleTileCodes.LilyPad] = {
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [ TrifleDeployType.anywhere ],
		territorialZone: {
			size: 1
		},
		abilities: [
			{
				type: TrifleAbilityName.restrictMovementWithinZoneUnlessCapturing,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.allTiles],
				targetTeams: [TrifleTileTeam.enemy, TrifleTileTeam.friendly]
			}
		],
		textLines: [
			"Flower | Water",
			"Deploys anywhere",
			"Territorial Zone: 1",
			"Tiles may not move into Lily Pad's zone unless they are capturing"
		]
	};

	TrifleTiles[TrifleTileCodes.Cattail] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [ TrifleDeployType.anywhere ],
		abilities: [
			{
				type: TrifleAbilityName.prohibitTileFromCapturing,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.enemy]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Water",
			"Deploys anywhere",
			"Enemy tiles adjacent to Cattail may not capture when moved"
		]
	};

	TrifleTiles[TrifleTileCodes.WaterHyacinth] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 6
		},
		cannotDeployAfterTileTypes: [TrifleTileType.banner],
		abilities: [
			{
				type: TrifleAbilityName.requireDeployInZone,
				deployTargetTileTypes: [TrifleTileType.banner],
				targetTypes: [TrifleTargetType.thisTile],
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileOnBoard
					}
				]
			}
		],
		textLines: [
			"Flower | Water",
			"Deploys anywhere",
			"Territorial Zone: 6",
			"Must be played before any banner",
			"Banners must be deployed within this tile's zone"
		]
	};

	/* Claude-created Tile */
	TrifleTiles[TrifleTileCodes.Duckweed] = {	/* Done */
		available: false,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 2
		},
		abilities: [
			{
				// Surface Calm: Enemy tiles in zone cannot capture
				type: TrifleAbilityName.prohibitTileFromCapturing,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.enemy]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			},
			{
				// Floating Refuge: Friendly tiles in zone are protected from capture
				type: TrifleAbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.friendly]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				excludeTileCodes: [TrifleTileCodes.Duckweed]
			}
		],
		textLines: [
			"Flower | Water",
			"Deploys anywhere",
			"Territorial Zone: 2",
			"Surface Calm: Enemy tiles in zone cannot capture",
			"Floating Refuge: Friendly tiles in zone (except Duckweed) are protected from capture"
		]
	};

	/* Earth */

	TrifleTiles[TrifleTileCodes.EarthBanner] = {	/* Done */
		available: true,
		types: [TrifleTileType.banner],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [
			{
				type: TrifleAbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileTypes: [TrifleTileType.flower]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Banner | Earth",
			"Deploys anywhere",
			"Cannot move",
			"Friendly Flowers adjacent to Earth Banner are protected from capture"
		]
	};

	TrifleTiles[TrifleTileCodes.Badgermole] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 1
			},
			{
				type: TrifleMovementType.jumpAlongLineOfSight,
				targetTileTypes: [TrifleTileType.flower, TrifleTileType.banner]
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileTypes: [TrifleTileType.flower, TrifleTileType.banner]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Animal | Earth",
			"Deploys anywhere",
			"Moves 1 space, or moves adjacent to a Flower or Banner in line of sight",
			"Friendly Flowers or Banner adjacent to Badgermole are protected from capture"
		]
	};

	TrifleTiles[TrifleTileCodes.SaberToothMooseLion] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.travelShape,
				shape: [
					TrifleMoveDirection.any,
					TrifleMoveDirection.straight,
					TrifleMoveDirection.straight
				],
				captureTypes: [TrifleCaptureType.all],
				abilities: [
					{
						type: TrifleMovementAbility.chargeCapture
					}
				]
			}
		],
		textLines: [
			"Animal | Earth",
			"Deploys anywhere",
			"Moves 3 spaces in a straight line, with Charge Capture"
		]
	};

	TrifleTiles[TrifleTileCodes.Shirshu] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 2,
				captureTypes: [
					{
						type: TrifleCaptureType.tilesTargetedByAbility,
						targetAbilities: [TrifleAbilityName.immobilizeTiles]
					}
				]
			},
			{
				type: TrifleMovementType.jumpAlongLineOfSight,
				targetTileTypes: [TrifleTileType.animal]
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTileTypes: [TrifleTileType.animal]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Animal | Earth",
			"Deploys anywhere",
			"Moves 2 spaces, can capture immobilized tiles; or moves adjacent to an Animal in line of sight",
			"Animal tiles adjacent to Shirshu are immobilized"
		]
	};

	TrifleTiles[TrifleTileCodes.BoarQPine] = {
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 1
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.captureTargetTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenTargetTileLandsAdjacent,
						targetTeams: [TrifleTileTeam.enemy]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Animal | Earth",
			"Deploys anywhere",
			"Moves 1 space",
			"Enemy tiles that land adjacent to BoarQPine are captured"
		]
	};

	TrifleTiles[TrifleTileCodes.CherryBlossom] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 2
		},
		attributes: [
			TrifleAttributeType.canBeCapturedByFriendlyTiles
		],
		abilities: [
			{
				type: TrifleAbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				excludeTileCodes: [TrifleTileCodes.CherryBlossom]
			}
		],
		textLines: [
			"Flower | Earth",
			"Deploys anywhere",
			"Territorial Zone: 2",
			"Tiles within zone cannot be captured (except Cherry Blossoms)",
			"Can be captured by friendly or enemy tiles"
		]
	};

	TrifleTiles[TrifleTileCodes.Sunflower] = {	/* Done? Need testing */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		attributes: [	// Attribute - for looking at when placing a piece, etc
			TrifleAttributeType.gigantic
		],
		abilities: [	// Ability - for when on the board
			{
				type: TrifleAbilityName.growGigantic,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				inevitable: true
			}
		],
		textLines: [
			"Flower | Earth",
			"Deploys anywhere",
			"Sunflower is a 2x2 giant tile that occupies four spaces instead of 1"
		]
	};

	TrifleTiles[TrifleTileCodes.MoonFlower] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [
			{
				type: TrifleAbilityName.resurrectAtDeployPosition
			}
		],
		textLines: [
			"Flower | Earth",
			"Deploys anywhere",
			"After capture, returns to original position when it becomes open"
		]
	};

	TrifleTiles[TrifleTileCodes.Chamomile] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 7
		},
		abilities: [
			{
				type: TrifleAbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.thisTile]
			},
			{
				type: TrifleAbilityName.setMovementDistance,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				movementDistance: 2
			}
		],
		textLines: [
			"Flower | Earth",
			"Deploys anywhere",
			"Territorial Zone: 7",
			"Chamomile cannot move",
			"All tiles in zone that can move have movement distance of 2"
		]
	};

	/* Claude-created Tile */
	TrifleTiles[TrifleTileCodes.Elderberry] = {	/* Done */
		available: false,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 3
		},
		abilities: [
			{
				// Antidote Aura: Friendly tiles in zone are cured of immobilization
				type: TrifleAbilityName.cancelAbilitiesTargetingTiles,
				abilityTypesToCancel: [TrifleAbilityName.immobilizeTiles],
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.friendly]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			},
			{
				// Invigorating Essence: Friendly animals in zone get +1 movement
				type: TrifleAbilityName.grantBonusMovement,
				bonusMovement: {
					distance: 1
				},
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileTypes: [TrifleTileType.animal]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Earth",
			"Deploys anywhere",
			"Territorial Zone: 3",
			"Antidote Aura: Friendly tiles in zone cannot be immobilized",
			"Invigorating Essence: Friendly animals in zone get +1 movement"
		]
	};

	/* Fire */

	TrifleTiles[TrifleTileCodes.FireBanner] = {	/* Done - Needs manual testing */
		available: true,
		types: [TrifleTileType.banner],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 1
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.enlargeZone,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [TrifleTileTeam.friendly]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				bonusZoneSize: 1
			}
		],
		textLines: [
			"Banner | Fire",
			"Deploys anywhere",
			"Adjacent friendly tiles have their Territorial Zone enlarged by 1"
		]
	};

	TrifleTiles[TrifleTileCodes.Dragon] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.fire],
		specialDeployTypes: [
			{
				type: TrifleSpecialDeployType.withinFriendlyTileZone,
				targetTileCodes: [TrifleTileCodes.FireLily]
			}
		],
		movements: [
			{
				type: TrifleMovementType.withinFriendlyTileZone,
				targetTileCodes: [TrifleTileCodes.FireLily],
				captureTypes: [TrifleCaptureType.all]
			}
			// ,
			// {
			// 	type: TrifleMovementType.withinFriendlyTileZone,
			// 	targetTileCodes: [TrifleTileCodes.Dragon],
			// 	captureTypes: [TrifleCaptureType.all]
			// }
		],
		textLines: [
			"Animal | Fire",
			"Deploys within Zone of friendly Fire Lily",
			"When in friendly Fire Lily Zone, may move anywhere else within that Zone, can capture"
		]
	};

	TrifleTiles[TrifleTileCodes.KomodoRhino] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 2,
				captureTypes: [TrifleCaptureType.all]
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.changeMovementDistanceByFactor,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [TrifleTileTeam.enemy]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				distanceAdjustmentFactor: 0.5
			}
		],
		textLines: [
			"Animal | Fire",
			"Deploys anywhere",
			"Moves 2 spaces, can capture",
			"Enemy tiles in line of sight have their movement halved (rounded down)"
		]
	};

	TrifleTiles[TrifleTileCodes.ArmadilloBear] = {	/* Done - Needs manual testing */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 2,
				captureTypes: [TrifleCaptureType.all]
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsWithinDistance,
						targetTileCodes: [TrifleTileCodes.FireLily],
						targetTeams: [TrifleTileTeam.friendly],
						distance: 2
					}
				],
				targetTypes: [TrifleTargetType.thisTile]
			}
		],
		textLines: [
			"Animal | Fire",
			"Deploys anywhere",
			"Moves 2 spaces, can capture",
			"Protected from capture when within 2 spaces of a friendly Fire Lily"
		]
	};

	TrifleTiles[TrifleTileCodes.MessengerHawk] = {	/* Done */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere, TrifleDeployType.temple],
		movements: [
			{
				type: TrifleMovementType.anywhere,
			}
		],
		/* abilities: [
			{
				title: "Messenger Hawk Push",
				type: TrifleAbilityName.moveTargetTile,
				isPassiveMovement: true,
				optional: true,
				neededPromptTargetsInfo: [
					{
						title: "pushedTile",
						promptId: TrifleTargetPromptId.movedTilePoint,
						targetType: TriflePromptTargetType.boardPoint
					},
					{
						title: "pushLanding",
						promptId: TrifleTargetPromptId.movedTileDestinationPoint,
						targetType: TriflePromptTargetType.boardPoint
					}
				],
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenLandsSurroundingTargetTile,
						targetTileTypes: [TrifleTileCategory.allTileTypes],
						activationRequirements: [
							{
								type: TrifleActivationRequirement.tileIsOnPointOfType,
								targetTileTypes: [TrifleTileCategory.thisTile],
								targetPointTypes: [RED]
							}
						]
					},
					{
						triggerType: TrifleAbilityTriggerType.whenActiveMovement,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				triggerTypeToTarget: TrifleAbilityTriggerType.whenLandsSurroundingTargetTile,
				numberOfTargetTiles: 1,
				promptTargetTitle: "pushedTile",
				targetTileMovements: [
					{
						type: TrifleMovementType.awayFromTargetTileOrthogonal,
						distance: 1,
						targetTileTypes: [TrifleTileCategory.tileWithAbility],
						regardlessOfImmobilization: true
					},
					{
						type: TrifleMovementType.awayFromTargetTileDiagonal,
						distance: 1,
						targetTileTypes: [TrifleTileCategory.tileWithAbility],
						regardlessOfImmobilization: true
					}
				]
			}
		], */
		textLines: [
			"Animal | Fire",
			"Deploys anywhere, including in Temples",
			"Flies anywhere, excluding Temples"
		]
	};

	TrifleTiles[TrifleTileCodes.FireLily] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 5
		},
		textLines: [
			"Flower | Fire",
			"Deploys anywhere",
			"Territorial Zone: 5",
			"Dragons love it."
		]
	};

	TrifleTiles[TrifleTileCodes.GrassWeed] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 1
		},
		abilities: [
			{
				type: TrifleAbilityName.captureTargetTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenDeployed,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.adjacentTiles],
				targetTileTypes: [TrifleTileType.flower]
			},
			{
				type: TrifleAbilityName.restrictMovementWithinZone,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.allTiles],
				targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy],
				targetTileTypes: [TrifleTileType.flower]
			},
			{
				type: TrifleAbilityName.restrictDeploymentInZone,
				deployTargetTileTypes: [TrifleTileType.flower],
				targetTypes: [TrifleTargetType.thisTile],
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileOnBoard
					}
				]
			}
		],
		textLines: [
			"Flower | Fire",
			"Deploys anywhere",
			"Territorial Zone: 1",
			"When deployed, captures all adjacent flowers",
			"Flowers cannot deploy or move adjacent to this tile"
		]
	};

	TrifleTiles[TrifleTileCodes.GrippingGrass] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [
			{
				type: TrifleAbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsAdjacent,
						targetTileTypes: [TrifleTileType.animal]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Fire",
			"Deploys anywhere",
			"Animals adjacent to Gripping Grass are immobilized"
		]
	};

	TrifleTiles[TrifleTileCodes.Saffron] = {	/* Done */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 4
		},
		abilities: [
			{
				type: TrifleAbilityName.substituteForCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenTargetTileInZoneIsCaptured,
						targetTeams: [TrifleTileTeam.friendly]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Fire",
			"Deploys anywhere",
			"Territorial Zone: 4",
			"When friendly tile is captured in zone, Saffron is captured instead"
		]
	};

	/* Claude-created Tile */
	TrifleTiles[TrifleTileCodes.Marigold] = {	/* Done */
		available: false,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere],
		territorialZone: {
			size: 3
		},
		abilities: [
			{
				// Scorching Presence: Enemy flowers in zone have abilities canceled
				type: TrifleAbilityName.cancelAbilities,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.enemy],
						targetTileTypes: [TrifleTileType.flower]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			},
			{
				// Flame's Vigor: Friendly banners in zone get +1 movement
				type: TrifleAbilityName.grantBonusMovement,
				bonusMovement: {
					distance: 1
				},
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInZone,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileTypes: [TrifleTileType.banner]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Fire",
			"Deploys anywhere",
			"Territorial Zone: 3",
			"Scorching Presence: Enemy flowers in zone have their abilities canceled",
			"Flame's Vigor: Friendly banners in zone get +1 movement"
		]
	};


	/* Example: Tile can move far without capturing, but a small distance with capturing
	TrifleTiles[TrifleTileCodes.LargeMovementNoCaptureSmallMovementDoes] = {
		types: [TrifleTileType.animal],
		deployTypes: [TrifleDeployType.anywhere, TrifleDeployType.temple],
		movements: [
			{
				title: "LargeMovement",
				type: TrifleMovementType.standard,
				distance: 9
			},
			{
				title: "SmallMovement",
				type: TrifleMovementType.standard,
				distance: 3,
				captureTypes: [TrifleCaptureType.all]
			}
		]
	}; */

	/* --- */
	/* Random tile ideas or unused tiles */

	TrifleTiles[TrifleTileCodes.AirGlider] = {
		available: false,
		types: [TrifleTileType.traveler],
		deployTypes: [TrifleDeployType.temple, TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.travelShape,
				shape: [
					TrifleMoveDirection.any,
					TrifleMoveDirection.turn,
					TrifleMoveDirection.straight,
					TrifleMoveDirection.straight,
					TrifleMoveDirection.straight
				],
				captureTypes: [TrifleCaptureType.all]
			}
			//,
			// {
			// 	type: TrifleMovementType.anywhere,
			// 	captureTypes: [TrifleCaptureType.all]
			// }
			// {
			// 	type: TrifleMovementType.standard,
			// 	distance: 4,
			// 	captureTypes: [TrifleCaptureType.all]
			// }
		], // Ability testing...
		abilities: [
			{
				type: TrifleAbilityName.moveTargetTile,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenLandsAdjacentToTargetTile,
						targetTeams: [TrifleTileTeam.friendly]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				targetTileMovements: [
					{
						type: TrifleMovementType.awayFromThisTileOrthogonal,
						distance: 2,
						targetTileTypes: [TrifleTileCategory.tileWithAbility]
					},
					{
						type: TrifleMovementType.awayFromThisTileDiagonal,
						distance: 1,
						targetTileTypes: [TrifleTileCategory.tileWithAbility]
					}
				]
			}//,
			// {	// Needs testing
			// 	type: TrifleAbilityName.growGigantic,
			// 	triggers: [
			// 		{
			// 			triggerType: TrifleAbilityTriggerType.whileTargetTileIsOnBoard,
			// 			targetTileTypes: [TrifleTileCategory.thisTile]
			// 		}
			// 	],
			// 	targetTypes: [TrifleTargetType.triggerTargetTiles],
			// 	inevitable: true
			// }
		],
		// attributes: [	// Attribute - for looking at when placing a piece, etc
		// 	TrifleAttributeType.gigantic
		// ]
	};

	/* TrifleTiles[TrifleTileCodes.Lotus] = {
		types: [TrifleTileType.banner, TrifleTileType.flower],
		deployTypes: [ DeployType.anywhere ],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 1
			}
		]
	} */

	/* TrifleTiles[TrifleTileCodes.Wheel] = {
		types: [TrifleTileType.traveler],
		deployTypes: [ TrifleDeployType.anywhere ],
		movements: [
			{
				type: TrifleMovementType.diagonal,
				distance: 15,
				captureTypes: [ TrifleCaptureType.all ],
				restrictions: [
					{
						type: TrifleMovementRestriction.mustPreserveDirection
					}
				]
			}
		]
	}; */

	/* TrifleTiles[TrifleTileCodes.Peacock] = {
		types: [TrifleTileType.animal],
		deployTypes: [TrifleDeployType.anywhere],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 2
			}
		],
		territorialZone: {
			size: 7,
			abilities: [
				{
					type: TrifleZoneAbility.opponentTilesMustMoveNearer,
					targetTileTypes: [TrifleTileType.animal]
				}
			]
		}
	}; */

	/* TrifleTiles[TrifleTileCodes.RingTailedLemur] = {
		types: [TrifleTileType.animal],
		deployTypes: [ TrifleDeployType.anywhere ],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 3,
				abilities: [
					{
						type: TrifleMovementAbility.carry,
						targetTileTypes: [ TrifleTileType.flower ]
					}
				]
			}
		]
	}; */

	/* TODO TrifleTiles[TrifleTileCodes.Dandelion] = {
		types: [TrifleTileType.flower],
		deployTypes: [TrifleDeployType.adjacentToTemple],
		abilities: [
			{
				type: Trifle.BoardPresenceAbility.canBeCapturedByFriendlyTiles
			},
			{
				type: Trifle.BoardPresenceAbility.spawnAdditionalCopies,
				triggeringAction: : TrifleAbilityTriggerType.whenCapturedByTargetTile,
				amount: 2,
				location: SpawnLocation.adjacent
			}
		]
	}; */

	/* TrifleTiles[TrifleTileCodes.Lupine] = {
		types: [TrifleTileType.flower],
		deployTypes: [ TrifleDeployType.anywhere ],
		territorialZone: {
			size: 3,
			abilities: [
				{
					type: Trifle.BoardPresenceAbility.increaseFriendlyTileMovementDistance
					// targetTeams
				}
			]
		}
	}; */

	/* TrifleTiles[TrifleTileCodes.GinsengWhiteLotus] = {
		available: true,
		//
		types: [TrifleTileType.traveler],
		deployTypes: [TrifleDeployType.temple],
		//
		movements: [
			{
				type: TrifleMovementType.jumpSurroundingTiles,
				jumpDirections: [TrifleMovementDirection.diagonal],
				targetTeams: [TrifleTileTeam.friendly],
				distance: 99
			}
		]
	}; */

	/* Apply capture restriction game rules */
	applyCaptureRestrictionsGameRuleAbilities(TrifleTiles);
}

function applyCaptureRestrictionsGameRuleAbilities(TrifleTiles) {
	Object.keys(TrifleTiles).forEach(tileCode => {
		const tileInfo = TrifleTiles[tileCode];

		/* Make sure abilities property is present */
		if (!tileInfo.abilities) {
			tileInfo.abilities = [];
		}

		/* Add Ability: Restrict from capturing Flower Tiles unless friendly Banner is deployed */
		const restrictFromCapturingFlowersAbility = {
			title: "Flower Capture Restriction Game Rule",
			type: TrifleAbilityName.restrictTileFromCapturing,
			triggers: [
				{
					triggerType: TrifleAbilityTriggerType.whileTargetTileIsNotOnBoard,
					targetTileTypes: [TrifleTileType.banner],
					targetTeams: [TrifleTileTeam.friendly]
				}
			],
			targetTypes: [TrifleTargetType.thisTile],
			restrictedFromCapturingTileTypes: [TrifleTileType.flower],
			inevitable: true,
			priority: 1
		};
		tileInfo.abilities.push(restrictFromCapturingFlowersAbility);

		/* Get all types except for Flower */
		const allNonFlowerTileTypes = Object.values(TrifleTileType).filter(type => type !== TrifleTileType.flower);

		/* Add Abilities: Restrict from capturing non-Flower Tiles unless friendly Banner AND enemy Banner are deployed (one ability for each banner) */
		const restrictFromCapturingOtherTilesAbilityFriendly = {
			title: "Non-Flower Capture Restriction Game Rule (Friendly Banner)",
			type: TrifleAbilityName.restrictTileFromCapturing,
			triggers: [
				{
					triggerType: TrifleAbilityTriggerType.whileTargetTileIsNotOnBoard,
					targetTileTypes: [TrifleTileType.banner],
					targetTeams: [TrifleTileTeam.friendly]
				}
			],
			targetTypes: [TrifleTargetType.thisTile],
			restrictedFromCapturingTileTypes: allNonFlowerTileTypes,
			inevitable: true,
			priority: 1
		};
		const restrictFromCapturingOtherTilesAbilityEnemy = {
			title: "Non-Flower Capture Restriction Game Rule (Enemy Banner)",
			type: TrifleAbilityName.restrictTileFromCapturing,
			triggers: [
				{
					triggerType: TrifleAbilityTriggerType.whileTargetTileIsNotOnBoard,
					targetTileTypes: [TrifleTileType.banner],
					targetTeams: [TrifleTileTeam.enemy]
				}
			],
			targetTypes: [TrifleTargetType.thisTile],
			restrictedFromCapturingTileTypes: allNonFlowerTileTypes,
			inevitable: true,
			priority: 1
		};
		tileInfo.abilities.push(restrictFromCapturingOtherTilesAbilityFriendly);
		tileInfo.abilities.push(restrictFromCapturingOtherTilesAbilityEnemy);
	});
}

