
Trifle.TileCodes = {
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

Trifle.TileType = {
	banner: "Banner",
	animal: "Animal",
	flower: "Flower",
	fruit: "Fruit",
	other: "Other",
	traveler: "Traveler"
};

Trifle.TileIdentifier = {
	air: "Air",
	water: "Water",
	earth: "Earth",
	fire: "Fire"
};

Trifle.TileInfo.defineTrifleTiles = function() {
	var TrifleTiles = {};

	/* Air */

	TrifleTiles[Trifle.TileCodes.AirBanner] = {	/* Done */
		available: true,
		types: [Trifle.TileType.banner],
		identifiers: [Trifle.TileIdentifier.air],
		deployTypes: [ Trifle.DeployType.anywhere ],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 1
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.grantBonusMovement,
				bonusMovement: {
					type: Trifle.MovementType.standard,
					distance: 1
				},
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.allTiles],
				targetTeams: [Trifle.TileTeam.friendly],
				targetTileTypes: [Trifle.TileType.flower]
			}
		],
		textLines: [
			"Banner | Air",
			"Deploys anywhere",
			"Moves 1 space",
			"While Air Banner is on the board, friendly flower tiles are granted bonus movement of 1 space"
		]
	};

	TrifleTiles[Trifle.TileCodes.SkyBison] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.air],
		deployTypes: [ Trifle.DeployType.temple ],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 6,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		territorialZone: {
			size: 6,
		},
		abilities: [
			{
				type: Trifle.AbilityName.cancelZone,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileInsideTemple,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			},
			{
				type: Trifle.AbilityName.restrictMovementWithinZone,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.allTiles],
				targetTeams: [Trifle.TileTeam.enemy],
				targetTileCodes: [Trifle.TileCodes.SkyBison]
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

	TrifleTiles[Trifle.TileCodes.FlyingLemur] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.air],
		deployTypes: [ Trifle.DeployType.temple ],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [ Trifle.CaptureType.all ],
				abilities: [
					{
						type: Trifle.MovementAbility.jumpOver
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

	TrifleTiles[Trifle.TileCodes.HermitCrab] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.air],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.jumpShape,
				shape: [1, 2],
				distance: 99,
				captureTypes: [ Trifle.CaptureType.all ],
				abilities: [
					{
						type: Trifle.MovementAbility.jumpOver
					}
				],
				restrictions: [
					{
						type: Trifle.MovementRestriction.mustPreserveDirection
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

	TrifleTiles[Trifle.TileCodes.Firefly] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.air],
		deployTypes: [Trifle.DeployType.temple],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 2
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.drawTilesAlongLineOfSight,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [Trifle.TileTeam.enemy]
					},
					{
						triggerType: Trifle.AbilityTriggerType.whileOutsideTemple,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				triggerTypeToTarget: Trifle.AbilityTriggerType.whileTargetTileIsInLineOfSight
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

	TrifleTiles[Trifle.TileCodes.Chrysanthemum] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.air],
		deployTypes: [Trifle.DeployType.anywhere],
		abilities: [
			{
				type: Trifle.AbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [Trifle.TileTeam.enemy],
						targetTileTypes: [Trifle.TileType.animal],
						targetTileIdentifiers: [Trifle.TileIdentifier.air]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			},
			{
				type: Trifle.AbilityName.cancelZone,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [Trifle.TileTeam.enemy],
						targetTileTypes: [Trifle.TileType.animal],
						targetTileIdentifiers: [Trifle.TileIdentifier.air]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Air",
			"Deploys anywhere",
			"Enemy Air Animals adjacent to Chrysanthemum are immobilized and have no Zone"
		]
	};

	TrifleTiles[Trifle.TileCodes.Edelweiss] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.air],
		deployTypes: [Trifle.DeployType.anywhere],
		territorialZone: {
			size: 2
		},
		abilities: [
			{
				type: Trifle.AbilityName.cancelAbilities,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsInZone,
						targetTileTypes: [Trifle.TileCategory.allButThisTile]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				targetAbilityTypes: [Trifle.AbilityType.all]
			}
		],
		textLines: [
			"Flower | Air",
			"Deploys anywhere",
			"Territorial Zone: 2",
			"Abilities of other tiles in Edelweiss' Zone are canceled"
		]
	};

	TrifleTiles[Trifle.TileCodes.NobleRhubarb] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.air],
		deployTypes: [Trifle.DeployType.anywhere],
		abilities: [
			{
				type: Trifle.AbilityName.grantBonusMovement,
				bonusMovement: {
					type: Trifle.MovementType.standard,
					distance: 2
				},
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [Trifle.TileTeam.friendly],
						targetTypes: [Trifle.TileType.animal]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Air",
			"Deploys anywhere",
			"Friendly animal tiles adjacent to Noble Rhubarb have bonus movement of 2"
		]
	};

	TrifleTiles[Trifle.TileCodes.Lavender] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.air],
		deployTypes: [Trifle.DeployType.anywhere],
		abilities: [
			{
				type: Trifle.AbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsAdjacent
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Air",
			"Deploys anywhere",
			"Tiles adjacent to Lavender are immobilized"
		]
	};

	/* Water */

	TrifleTiles[Trifle.TileCodes.WaterBanner] = {	/* Done */
		available: true,
		types: [Trifle.TileType.banner],
		identifiers: [Trifle.TileIdentifier.water],
		deployTypes: [ Trifle.DeployType.anywhere ],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 2
			}
		],
		textLines: [
			"Banner | Water",
			"Deploys anywhere",
			"Moves 2 spaces"
		]
	};

	TrifleTiles[Trifle.TileCodes.SnowLeopard] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.water],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 3,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.cancelAbilities,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [Trifle.TileTeam.enemy]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				targetAbilityTypes: [Trifle.AbilityType.protection]
			},
			{
				type: Trifle.AbilityName.cancelAbilitiesTargetingTiles,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [Trifle.TileTeam.enemy]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				targetAbilityTypes: [Trifle.AbilityType.protection]
			}
		],
		textLines: [
			"Animal | Water",
			"Deploys anywhere",
			"Moves 3 spaces, can capture",
			"Protection abilities coming from or applying to enemy tiles in Snow Leopard's line of sight are canceled"
		]
	};

	TrifleTiles[Trifle.TileCodes.PolarBearDog] = {	// todo
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.water],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 4,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenCapturingTargetTile,
						targetTileTypes: [Trifle.TileCategory.allTileTypes]
					}
				],
				targetTypes: [Trifle.TargetType.thisTile],
				duration: 1
			}
		],
		textLines: [
			"Animal | Water",
			"If this tile captures an opponent's tile it can't be captured on your opponent next turn. Moves 4 spaces. Can capture other tiles."
		]
	};

	TrifleTiles[Trifle.TileCodes.BuffaloYak] = {	// todo
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.water],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 2,
				captureTypes: [Trifle.CaptureType.all]
			}
		],
		territorialZone: {
			size: 2,
			abilities: [
				{
					type: Trifle.ZoneAbility.removesTileAbilities,
					targetTeams: [Trifle.TileTeam.friendly, Trifle.TileTeam.enemy],
					targetTileTypes: [Trifle.TileType.flower]
				}
			]
		},
		textLines: [
			"TODO",
			"Animal | Water",
			"Flower tiles within 2 spaces have their effects nullified. Can move two spaces, and can capture."
		]
	};

	TrifleTiles[Trifle.TileCodes.SnowWolf] = {	// todo
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.water],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 3,
				captureTypes: [Trifle.CaptureType.all]
			}
		],
		textLines: [
			"TODO",
			"Animal | Water",
			"Enemy tiles that capture an ally tile adjacent to this tile are captured as well then this tile moves into that space. Moves 3 spaces. Can capture other tiles."
		]
	};

	TrifleTiles[Trifle.TileCodes.TitanArum] = {	/* Done */	// TODO: Allow restrictMovementWithinZone affected tiles to move away as much as possible if they cannot escape zone?
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.water],
		deployTypes: [ Trifle.DeployType.anywhere ],
		territorialZone: {
			size: 2
		},
		abilities: [
			{
				type: Trifle.AbilityName.restrictMovementWithinZoneUnlessCapturing,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.allTiles],
				targetTeams: [Trifle.TileTeam.enemy, Trifle.TileTeam.friendly],
				targetTileTypes: [Trifle.TileType.animal, Trifle.TileType.banner]
			}
		],
		textLines: [
			"Flower | Water",
			"Deploys anywhere",
			"Territorial Zone: 2",
			"Animal and Banner tiles may not move into Titan Arum's zone unless they are capturing"
		]
	};

	TrifleTiles[Trifle.TileCodes.LilyPad] = {
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.water],
		deployTypes: [ Trifle.DeployType.anywhere ],
		territorialZone: {
			size: 1
		},
		abilities: [
			{
				type: Trifle.AbilityName.restrictMovementWithinZoneUnlessCapturing,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.allTiles],
				targetTeams: [Trifle.TileTeam.enemy, Trifle.TileTeam.friendly]
			}
		],
		textLines: [
			"Flower | Water",
			"Deploys anywhere",
			"Territorial Zone: 1",
			"Tiles may not move into Lily Pad's zone unless they are capturing"
		]
	};

	TrifleTiles[Trifle.TileCodes.Cattail] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.water],
		deployTypes: [ Trifle.DeployType.anywhere ],
		abilities: [
			{
				type: Trifle.AbilityName.prohibitTileFromCapturing,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [Trifle.TileTeam.enemy]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Flower | Water",
			"Deploys anywhere",
			"Enemy tiles adjacent to Cattail may not capture when moved"
		]
	};

	TrifleTiles[Trifle.TileCodes.WaterHyacinth] = {
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.water],
		deployTypes: [Trifle.DeployType.anywhere],
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

	TrifleTiles[Trifle.TileCodes.EarthBanner] = {	/* Done */
		available: true,
		types: [Trifle.TileType.banner],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
		abilities: [
			{
				type: Trifle.AbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [Trifle.TileTeam.friendly],
						targetTileTypes: [Trifle.TileType.flower]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Banner | Earth",
			"Deploys anywhere",
			"Friendly Flowers adjacent to Earth Banner are protected from capture"
		]
	};

	TrifleTiles[Trifle.TileCodes.Badgermole] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 1
			},
			{
				type: Trifle.MovementType.jumpAlongLineOfSight,
				targetTileTypes: [Trifle.TileType.flower, Trifle.TileType.banner]
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [Trifle.TileTeam.friendly],
						targetTileTypes: [Trifle.TileType.flower, Trifle.TileType.banner]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Animal | Earth",
			"Deploys anywhere",
			"Moves 1 space, or moves adjacent to a Flower or Banner in line of sight",
			"Friendly Flowers or Banner adjacent to Badgermole are protected from capture"
		]
	};

	TrifleTiles[Trifle.TileCodes.SaberToothMooseLion] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.travelShape,
				shape: [
					Trifle.MoveDirection.any,
					Trifle.MoveDirection.straight,
					Trifle.MoveDirection.straight
				],
				captureTypes: [Trifle.CaptureType.all],
				abilities: [
					{
						type: Trifle.MovementAbility.chargeCapture
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

	TrifleTiles[Trifle.TileCodes.Shirshu] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 2,
				captureTypes: [
					{
						type: Trifle.CaptureType.tilesTargetedByAbility,
						targetAbilities: [Trifle.AbilityName.immobilizeTiles]
					}
				]
			},
			{
				type: Trifle.MovementType.jumpAlongLineOfSight,
				targetTileTypes: [Trifle.TileType.animal]
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsAdjacent,
						targetTileTypes: [Trifle.TileType.animal]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Animal | Earth",
			"Deploys anywhere",
			"Moves 2 spaces, can capture immobilized tiles; or moves adjacent to an Animal in line of sight",
			"Animal tiles adjacent to Shirshu are immobilized"
		]
	};

	TrifleTiles[Trifle.TileCodes.BoarQPine] = {
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 1
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.captureTargetTiles,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenTargetTileLandsAdjacent,
						targetTeams: [Trifle.TileTeam.enemy]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Animal | Earth",
			"Deploys anywhere",
			"Moves 1 space",
			"Enemy tiles that land adjacent to BoarQPine are captured"
		]
	};

	TrifleTiles[Trifle.TileCodes.CherryBlossom] = {
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
		abilities: [

		],
		textLines: [
			"TODO",
			"Flower | Earth",
			"Deploys anywhere",
			"Tiles within 2 spaces may not be captured. (Any cherry blossom can be captured by either player, including any in zone)"
		]
	};

	TrifleTiles[Trifle.TileCodes.Sunflower] = {	/* Done? Need testing */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
		attributes: [	// Attribute - for looking at when placing a piece, etc
			Trifle.AttributeType.gigantic
		],
		abilities: [	// Ability - for when on the board
			{
				type: Trifle.AbilityName.growGigantic,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsOnBoard,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				inevitable: true
			}
		],
		textLines: [
			"Flower | Earth",
			"Deploys anywhere",
			"Sunflower is a 2x2 giant tile that occupies four spaces instead of 1"
		]
	};

	TrifleTiles[Trifle.TileCodes.MoonFlower] = {
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
		abilities: [

		],
		textLines: [
			"TODO",
			"Flower | Earth",
			"Deploys anywhere",
			"After capture, returns to the field in original position when it's next open."
		]
	};

	TrifleTiles[Trifle.TileCodes.Chamomile] = {
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
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

	TrifleTiles[Trifle.TileCodes.FireBanner] = {	/* todo */
		available: true,
		types: [Trifle.TileType.banner],
		identifiers: [Trifle.TileIdentifier.earth],
		deployTypes: [Trifle.DeployType.anywhere],
		abilities: [
			{
				type: Trifle.AbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsAdjacent,
						targetTeams: [Trifle.TileTeam.friendly],
						targetTileTypes: [Trifle.TileType.flower]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"TODO",
			"Banner | Fire",
			"Deploys anywhere",
			"+1 to adjacent tile's territory range"
		]
	};

	TrifleTiles[Trifle.TileCodes.Dragon] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.fire],
		specialDeployTypes: [
			{
				type: Trifle.SpecialDeployType.withinFriendlyTileZone,
				targetTileCodes: [Trifle.TileCodes.FireLily]
			}
		],
		movements: [
			{
				type: Trifle.MovementType.withinFriendlyTileZone,
				targetTileCodes: [Trifle.TileCodes.FireLily],
				captureTypes: [Trifle.CaptureType.all]
			}
			// ,
			// {
			// 	type: Trifle.MovementType.withinFriendlyTileZone,
			// 	targetTileCodes: [Trifle.TileCodes.Dragon],
			// 	captureTypes: [Trifle.CaptureType.all]
			// }
		],
		textLines: [
			"Animal | Fire",
			"Deploys within Zone of friendly Fire Lily",
			"When in friendly Fire Lily Zone, may move anywhere else within that Zone, can capture"
		]
	};

	TrifleTiles[Trifle.TileCodes.KomodoRhino] = {	/* TODO */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		movements: [
			{
				type: Trifle.MovementType.anywhere,
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.changeMovementDistanceByFactor,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [Trifle.TileTeam.enemy]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				distanceAdjustmentFactor: 1/2
			}
		],
		textLines: [
			"TODO",
			"Animal | Fire",
			"Enemy tiles in this tiles line of sight have their movement speed halved (rounded down). This tile can move 2 spaces and can capture tiles."
		]
	};

	TrifleTiles[Trifle.TileCodes.ArmadilloBear] = {	/* TODO */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		movements: [
			{
				type: Trifle.MovementType.anywhere,
			}
		],
		textLines: [
			"TODO",
			"Animal | Fire",
			"This tile can't be captured if it is within 2 spaces of any friendly Fire Lily tile. This tile can move 2 spaces. Can capture other tiles"
		]
	};

	TrifleTiles[Trifle.TileCodes.MessengerHawk] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		movements: [
			{
				type: Trifle.MovementType.anywhere,
			}
		],
		textLines: [
			"Animal | Fire",
			"Deploys anywhere, including in Temples",
			"Flies anywhere, excluding Temples"
		]
	};

	TrifleTiles[Trifle.TileCodes.FireLily] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere],
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

	TrifleTiles[Trifle.TileCodes.GrassWeed] = {	/* TODO */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		textLines: [
			"TODO",
			"Flower | Fire",
			"When this Plant tile is deployed it captures all flower tiles adjacent to it. Flower tiles can't be deployed or moved to a space adjacent to this tile"
		]
	};

	TrifleTiles[Trifle.TileCodes.GrippingGrass] = {	/* TODO */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		textLines: [
			"TODO",
			"Flower | Fire",
			"Animals may not move if beginning their movement adjacent to this tile."
		]
	};

	TrifleTiles[Trifle.TileCodes.Saffron] = {	/* TODO */
		available: true,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		textLines: [
			"TODO",
			"Flower | Fire",
			"When a tile is captured within 4 spaces, capture this tile instead and move that piece to saffron's position"
		]
	};


	/* Example: Tile can move far without capturing, but a small distance with capturing
	TrifleTiles[Trifle.TileCodes.LargeMovementNoCaptureSmallMovementDoes] = {
		types: [Trifle.TileType.animal],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		movements: [
			{
				title: "LargeMovement",
				type: Trifle.MovementType.standard,
				distance: 9
			},
			{
				title: "SmallMovement",
				type: Trifle.MovementType.standard,
				distance: 3,
				captureTypes: [Trifle.CaptureType.all]
			}
		]
	}; */

	/* --- */
	/* Random tile ideas or unused tiles */

	TrifleTiles[Trifle.TileCodes.AirGlider] = {
		available: false,
		types: [Trifle.TileType.traveler],
		deployTypes: [Trifle.DeployType.temple, Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.travelShape,
				shape: [
					Trifle.MoveDirection.any,
					Trifle.MoveDirection.turn,
					Trifle.MoveDirection.straight,
					Trifle.MoveDirection.straight,
					Trifle.MoveDirection.straight
				],
				captureTypes: [Trifle.CaptureType.all]
			}
			//,
			// {
			// 	type: Trifle.MovementType.anywhere,
			// 	captureTypes: [Trifle.CaptureType.all]
			// }
			// {
			// 	type: Trifle.MovementType.standard,
			// 	distance: 4,
			// 	captureTypes: [Trifle.CaptureType.all]
			// }
		], // Ability testing...
		abilities: [
			{
				type: Trifle.AbilityName.moveTargetTile,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenLandsAdjacentToTargetTile,
						targetTeams: [Trifle.TileTeam.friendly]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				targetTileMovements: [
					{
						type: Trifle.MovementType.awayFromThisTileOrthogonal,
						distance: 2,
						targetTileTypes: [Trifle.TileCategory.tileWithAbility]
					},
					{
						type: Trifle.MovementType.awayFromThisTileDiagonal,
						distance: 1,
						targetTileTypes: [Trifle.TileCategory.tileWithAbility]
					}
				]
			}//,
			// {	// Needs testing
			// 	type: Trifle.AbilityName.growGigantic,
			// 	triggers: [
			// 		{
			// 			triggerType: Trifle.AbilityTriggerType.whileTargetTileIsOnBoard,
			// 			targetTileTypes: [Trifle.TileCategory.thisTile]
			// 		}
			// 	],
			// 	targetTypes: [Trifle.TargetType.triggerTargetTiles],
			// 	inevitable: true
			// }
		],
		// attributes: [	// Attribute - for looking at when placing a piece, etc
		// 	Trifle.AttributeType.gigantic
		// ]
	};

	/* TrifleTiles[Trifle.TileCodes.Lotus] = {
		types: [Trifle.TileType.banner, Trifle.TileType.flower],
		deployTypes: [ DeployType.anywhere ],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 1
			}
		]
	} */

	/* TrifleTiles[Trifle.TileCodes.Wheel] = {
		types: [Trifle.TileType.traveler],
		deployTypes: [ Trifle.DeployType.anywhere ],
		movements: [
			{
				type: Trifle.MovementType.diagonal,
				distance: 15,
				captureTypes: [ Trifle.CaptureType.all ],
				restrictions: [
					{
						type: Trifle.MovementRestriction.mustPreserveDirection
					}
				]
			}
		]
	}; */

	/* TrifleTiles[Trifle.TileCodes.Peacock] = {
		types: [Trifle.TileType.animal],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 2
			}
		],
		territorialZone: {
			size: 7,
			abilities: [
				{
					type: Trifle.ZoneAbility.opponentTilesMustMoveNearer,
					targetTileTypes: [Trifle.TileType.animal]
				}
			]
		}
	}; */

	/* TrifleTiles[Trifle.TileCodes.RingTailedLemur] = {
		types: [Trifle.TileType.animal],
		deployTypes: [ Trifle.DeployType.anywhere ],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 3,
				abilities: [
					{
						type: Trifle.MovementAbility.carry,
						targetTileTypes: [ Trifle.TileType.flower ]
					}
				]
			}
		]
	}; */

	/* TODO TrifleTiles[Trifle.TileCodes.Dandelion] = {
		types: [Trifle.TileType.flower],
		deployTypes: [Trifle.DeployType.adjacentToTemple],
		abilities: [
			{
				type: Trifle.BoardPresenceAbility.canBeCapturedByFriendlyTiles
			},
			{
				type: Trifle.BoardPresenceAbility.spawnAdditionalCopies,
				triggeringAction: : Trifle.AbilityTriggerType.whenCapturedByTargetTile,
				amount: 2,
				location: SpawnLocation.adjacent
			}
		]
	}; */

	/* TrifleTiles[Trifle.TileCodes.Lupine] = {
		types: [Trifle.TileType.flower],
		deployTypes: [ Trifle.DeployType.anywhere ],
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

	/* TrifleTiles[Trifle.TileCodes.GinsengWhiteLotus] = {
		available: true,
		//
		types: [Trifle.TileType.traveler],
		deployTypes: [Trifle.DeployType.temple],
		//
		movements: [
			{
				type: Trifle.MovementType.jumpSurroundingTiles,
				jumpDirections: [Trifle.MovementDirection.diagonal],
				targetTeams: [Trifle.TileTeam.friendly],
				distance: 99
			}
		]
	}; */

	Trifle.TrifleTiles = TrifleTiles;
};

