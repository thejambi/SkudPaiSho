import {
  TrifleAbilityName,
  TrifleAbilityTriggerType,
  TrifleAbilityType,
  TrifleAttributeType,
  TrifleCaptureType,
  TrifleDeployType,
  TrifleMoveDirection,
  TrifleMovementAbility,
  TrifleMovementRestriction,
  TrifleMovementType,
  TrifleSpecialDeployType,
  TrifleTargetType,
  TrifleTileCategory,
  TrifleTileTeam,
  TrifleTiles,
  TrifleZoneAbility,
} from './TrifleTileInfo';
import { clearObject } from '../GameData';

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
	/* Fire */
	FireBanner: "FireBanner",
	Dragon: 'Dragon',
	KomodoRhino: "KomodoRhino",
	ArmadilloBear: "ArmadilloBear",
	MessengerHawk: 'MessengerHawk',
	FireLily: 'FireLily',
	GrassWeed: "GrassWeed",
	GrippingGrass: "GrippingGrass",
	Saffron: "Saffron"
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
						targetTypes: [TrifleTileType.animal]
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

	TrifleTiles[TrifleTileCodes.PolarBearDog] = {	// todo
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
				duration: 1
			}
		],
		textLines: [
			"Animal | Water",
			"If this tile captures an opponent's tile it can't be captured on your opponent next turn. Moves 4 spaces. Can capture other tiles."
		]
	};

	TrifleTiles[TrifleTileCodes.BuffaloYak] = {	// todo
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
			size: 2,
			abilities: [
				{
					type: TrifleZoneAbility.removesTileAbilities,
					targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy],
					targetTileTypes: [TrifleTileType.flower]
				}
			]
		},
		textLines: [
			"TODO",
			"Animal | Water",
			"Flower tiles within 2 spaces have their effects nullified. Can move two spaces, and can capture."
		]
	};

	TrifleTiles[TrifleTileCodes.SnowWolf] = {	// todo
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
		textLines: [
			"TODO",
			"Animal | Water",
			"Enemy tiles that capture an ally tile adjacent to this tile are captured as well then this tile moves into that space. Moves 3 spaces. Can capture other tiles."
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

	TrifleTiles[TrifleTileCodes.WaterHyacinth] = {
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.water],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [

		],
		textLines: [
			"TODO",
			"Flower | Water",
			"Deploys anywhere",
			"must be played before any banner is played. All banners must be played within 6 spaces of this tile."
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

	TrifleTiles[TrifleTileCodes.CherryBlossom] = {
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [

		],
		textLines: [
			"TODO",
			"Flower | Earth",
			"Deploys anywhere",
			"Tiles within 2 spaces may not be captured. (Any cherry blossom can be captured by either player, including any in zone)"
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

	TrifleTiles[TrifleTileCodes.MoonFlower] = {
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [

		],
		textLines: [
			"TODO",
			"Flower | Earth",
			"Deploys anywhere",
			"After capture, returns to the field in original position when it's next open."
		]
	};

	TrifleTiles[TrifleTileCodes.Chamomile] = {
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.earth],
		deployTypes: [TrifleDeployType.anywhere],
		abilities: [

		],
		textLines: [
			"TODO",
			"Flower | Earth",
			"Deploys anywhere",
			"All tiles within 7 spaces have a movement of 2. Affects all types, ignores other movement effects. Chamomile may not move."
		]
	};

	/* Fire */

	TrifleTiles[TrifleTileCodes.FireBanner] = {	/* todo */
		available: true,
		types: [TrifleTileType.banner],
		identifiers: [TrifleTileIdentifier.fire],
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
			"TODO",
			"Banner | Fire",
			"Deploys anywhere",
			"+1 to adjacent tile's territory range"
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

	TrifleTiles[TrifleTileCodes.KomodoRhino] = {	/* TODO */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere, TrifleDeployType.temple],
		movements: [
			{
				type: TrifleMovementType.anywhere,
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
				distanceAdjustmentFactor: 1/2
			}
		],
		textLines: [
			"TODO",
			"Animal | Fire",
			"Enemy tiles in this tiles line of sight have their movement speed halved (rounded down). This tile can move 2 spaces and can capture tiles."
		]
	};

	TrifleTiles[TrifleTileCodes.ArmadilloBear] = {	/* TODO */
		available: true,
		types: [TrifleTileType.animal],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere, TrifleDeployType.temple],
		movements: [
			{
				type: TrifleMovementType.anywhere,
			}
		],
		textLines: [
			"TODO",
			"Animal | Fire",
			"This tile can't be captured if it is within 2 spaces of any friendly Fire Lily tile. This tile can move 2 spaces. Can capture other tiles"
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

	TrifleTiles[TrifleTileCodes.GrassWeed] = {	/* TODO */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere, TrifleDeployType.temple],
		textLines: [
			"TODO",
			"Flower | Fire",
			"When this Plant tile is deployed it captures all flower tiles adjacent to it. Flower tiles can't be deployed or moved to a space adjacent to this tile"
		]
	};

	TrifleTiles[TrifleTileCodes.GrippingGrass] = {	/* TODO */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere, TrifleDeployType.temple],
		textLines: [
			"TODO",
			"Flower | Fire",
			"Animals may not move if beginning their movement adjacent to this tile."
		]
	};

	TrifleTiles[TrifleTileCodes.Saffron] = {	/* TODO */
		available: true,
		types: [TrifleTileType.flower],
		identifiers: [TrifleTileIdentifier.fire],
		deployTypes: [TrifleDeployType.anywhere, TrifleDeployType.temple],
		textLines: [
			"TODO",
			"Flower | Fire",
			"When a tile is captured within 4 spaces, capture this tile instead and move that piece to saffron's position"
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
}

