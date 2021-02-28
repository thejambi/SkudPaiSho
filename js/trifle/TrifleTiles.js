
var TrifleTileCodes = {
	/* Spirit */
	// SpiritBanner: "SpiritBanner",
	// BaboonSpirit: "BaboonSpirit",
	// Cabbage: "Cabbage",
	// SpiritPortal: "SpiritPortal",
	/* Other / Future */
	// MongooseLizard: "MongooseLizard",
	// AirGlider: 'AirGlider',
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
	MoonFlower: "Moon Flower",
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

var TileType = {
	banner: "Banner",
	animal: "Animal",
	flower: "Flower",
	fruit: "Fruit",
	other: "Other",
	traveler: "Traveler"
};

var TileIdentifier = {
	air: "Air"
};

var TileCategory = {
	thisTile: "thisTile",
	allTileTypes: "allTileTypes",
	landingTile: "landingTile"
};

var DeployType = {
	anywhere: "anywhere",
	temple: "temple",
	adjacentToTemple: "adjacentToTemple"
};

var SpecialDeployType = {
	withinFriendlyTileZone: "withinFriendlyTileZone"
};

var MovementType = {
	standard: "standard",
	diagonal: "diagonal",
	jumpAlongLineOfSight: "jumpAlongLineOfSight",
	withinFriendlyTileZone: "withinFriendlyTileZone",
	anywhere: "anywhere",
	jumpShape: "jumpShape",
	travelShape: "travelShape"
};

var MovementRestriction = {
	// restrictedByOpponentTileZones: "restrictedByOpponentTileZones",
	// immobilizedByAdjacentOpponentTile: "immobilizedByAdjacentOpponentTile", // unused
	// immobilizedByOpponentTileZones: "immobilizedByOpponentTileZones",
	mustPreserveDirection: "mustPreserveDirection"
};

var MovementAbility = {
	// carry: "carry", // For future
	jumpOver: "jumpOver",
	chargeCapture: "chargeCapture"
};

var MoveDirection = {
	any: "any",	/* Any direction starts movement */
	straight: "straight",
	turn: "turn",
	left: "left",
	right: "right"
}

var CaptureType = {
	none: "none",
	all: "all"
};

var ZoneAbility = {
	canceledWhenInTemple: "canceledWhenInTemple", // Note: Too specific, how to split up to *dynamicize*?
	protectFriendlyTilesFromCapture: "protectFriendlyTilesFromCapture", // Too specific, can be ProtectTilesFromCapture and have a target tiles metadata
	// immobilizesOpponentTiles: "immobilizesOpponentTiles", // Outdated, replaced by ImmobilizesTiles
	immobilizesTiles: "immobilizesTiles",
	removesTileAbilities: "removesTileAbilities",	// TODO // TODO testing, etc
	restrictMovementWithinZone: "restrictMovementWithinZone",
	captureLandingTiles: "captureLandingTiles" // unused?
}

var BoardPresenceAbility = {
	increaseFriendlyTileMovementDistance: "increaseFriendlyTileMovementDistance",	// TODO replace with Ability.grantBonusMovement
	// spawnAdditionalCopies: "spawnAdditionalCopies",	// TODO,
	canBeCapturedByFriendlyTiles: "canBeCapturedByFriendlyTiles",
	drawTilesInLineOfSight: "drawTilesInLineOfSight"
	// captureProtection: "captureProtection"
}

var SpawnLocation = {
	adjacent: "adjacent"
};

var Ability = {
	captureTiles: "captureTiles",
	removeEffects: "removeEffects",
	protectFromCapture: "protectFromCapture",
	grantBonusMovement: "grantBonusMovement",
	lureTiles: "lureTiles",
	drawTilesAlongLineOfSight: "drawTilesAlongLineOfSight",
	cancelZone: "cancelZone"
};

var AbilityType = {
	protection: "protection"
};

var AbilityTrigger = {
	whenCaptured: "whenCaptured",
	whenCapturing: "whenCapturing",
	whenTileLandsInZone: "whenTileLandsInZone",
	whenTileMovesFromWithinZone: "whenTileMovesFromWithinZone",
	whileTileInLineOfSight: "whileTileInLineOfSight",
	whileOutsideTemple: "whileOutsideTemple",
	whileInsideTemple: "whileInsideTemple"
};

var TileTeam = {
	friendly: "friendly",
	enemy: "enemy"
};

var AbilitiesForType = {};

var AbilityTypes = {};

var TrifleTiles = {};

var TrifleTileInfo = {};

TrifleTileInfo.tileIsBanner = function(tileInfo) {
	return tileInfo && tileInfo.types.includes(TileType.banner);
};

TrifleTileInfo.tileIsOneOfTheseTypes = function(tileInfo, types) {
	var isTargetType = false;
	if (tileInfo) {
		types.forEach(function(type) {
			if (tileInfo.types.includes(type)) {
				isTargetType = true;
				return;
			}
		});
	}
	return isTargetType;
};

TrifleTileInfo.getTerritorialZone = function(tileInfo) {
	if (tileInfo.territorialZone) {
		return tileInfo.territorialZone;
	}
};

TrifleTileInfo.movementMustPreserveDirection = function(movementInfo) {
	var mustPreserveDirection = false;
	if (movementInfo && movementInfo.restrictions && movementInfo.restrictions.length > 0) {
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === MovementRestriction.mustPreserveDirection) {
				mustPreserveDirection = true;
				return;
			}
		});
	}
	return mustPreserveDirection;
};

TrifleTileInfo.tileHasBoardPresenceAbility = function(tileInfo, abilityType) {
	var result = false;
	if (tileInfo && tileInfo.abilities) {
		tileInfo.abilities.forEach(function(ability) {
			if (ability.type === abilityType) {
				result = true;
				return;
			}
		});
	}
	return result;
};

// TrifleTileInfo.tileHasDrawTilesInLineOfSightAbility = function(tileInfo) {
// 	return TrifleTileInfo.tileHasBoardPresenceAbility(tileInfo, BoardPresenceAbility.drawTilesInLineOfSight);
// };

TrifleTileInfo.tileCanBeCapturedByFriendlyTiles = function(tileInfo) {
	return TrifleTileInfo.tileHasBoardPresenceAbility(tileInfo, BoardPresenceAbility.canBeCapturedByFriendlyTiles);
};

TrifleTileInfo.tileHasOnlyOneMovement = function(tileInfo) {
	return tileInfo && tileInfo.movements && tileInfo.movements.length === 1;
};

TrifleTileInfo.tileHasMovementAbility = function(tileInfo, targetMovementAbilityType) {
	var tileHasMovementAbility = false;
	if (tileInfo && tileInfo.movements) {
		tileInfo.movements.forEach(function(movementInfo) {
			if (movementInfo.abilities) {
				movementInfo.abilities.forEach(function(movementAbilityInfo) {
					if (movementAbilityInfo.type === targetMovementAbilityType) {
						tileHasMovementAbility = true;
						return;	// Escape .forEach
					}
				});
			}
		});
	}
	return tileHasMovementAbility;
};

TrifleTileInfo.tileHasAbilityTrigger = function(tileInfo, abilityTrigger) {
	var tileHasAbilityTrigger = false;
	if (tileInfo && tileInfo.abilities) {
		tileInfo.abilities.forEach(function(abilityInfo) {
			if (abilityInfo.triggeringAction === abilityTrigger) {
				tileHasAbilityTrigger = true;
				return;	// Escape .forEach
			}
		});
	}
	return tileHasAbilityTrigger;
};

TrifleTileInfo.getAbilitiesWithAbilityTrigger = function(tileInfo, abilityTrigger) {
	var abilitiesWithTrigger = [];
	if (tileInfo && tileInfo.abilities) {
		tileInfo.abilities.forEach(function(abilityInfo) {
			if (abilityInfo.triggeringAction === abilityTrigger) {
				abilitiesWithTrigger.push(abilityInfo);
			}
		});
	}
	return abilitiesWithTrigger;
};

TrifleTileInfo.getZoneAbilitiesWithAbilityTrigger = function(tileInfo, abilityTrigger) {
	var abilitiesWithTrigger = [];
	if (tileInfo && tileInfo.territorialZone && tileInfo.territorialZone.abilities) {
		tileInfo.territorialZone.abilities.forEach(function(abilityInfo) {
			if (abilityInfo.triggeringAction === abilityTrigger) {
				abilitiesWithTrigger.push(abilityInfo);
			}
		});
	}
	return abilitiesWithTrigger;
};

TrifleTileInfo.initializeTrifleData = function() {
	TrifleTileInfo.defineAbilitiesForAbilityTypes();
	TrifleTileInfo.defineAbilityTypes();
	TrifleTileInfo.defineTrifleTiles();
};

TrifleTileInfo.defineAbilitiesForAbilityTypes = function () {
	AbilitiesForType = {};

	AbilitiesForType[AbilityType.protection] = [
		ZoneAbility.protectFriendlyTilesFromCapture,
		Ability.protectFromCapture
	];
};

TrifleTileInfo.defineAbilityTypes = function () {
	AbilityTypes = {};

	AbilityTypes[ZoneAbility.protectFriendlyTilesFromCapture] = [
		AbilityType.protection
	];

	AbilityTypes[Ability.protectFromCapture] = [
		AbilityType.protection
	];
};

TrifleTileInfo.defineTrifleTiles = function() {
	TrifleTiles = {};

	/**
	 TrifleTiles[TrifleTileCodes.TEMPLATE] = {
	 * 	types: [TileType.?]
	 * 	deployTypes: [ DeployType.?, ... ],
	 * 	movements: [
	 * 		{
	 * 			type: MovementType.?,
	 * 			distance: *number value*,
	 * 			captureTypes: [CaptureType.?, ...],
	 * 			restrictions: [
	 * 				{
	 * 					type: MovementRestriction.?,
	 * 					affectingTiles: [ TrifleTileCodes.?, ... ],
	 * 				}, {...}, ...
	 * 			],
	 * 			abilities: [
	 * 				{
	 * 					type: MovementAbility.?,
	 * 					targetTileTypes: [ TileType.?, ...]
	 * 				}, {...}, ...
	 * 			]
	 * 		}, {...}, ...
	 * 	],
	 * 	territorialZone: 
			{
				size: *number value*,
				abilities: [
					{
						type: ZoneAbility.?
					}
				]
			}
	 }
	**/

	/* Vagabond Tiles */
	/* TrifleTiles[TrifleTileCodes.Lotus] = {
		types: [TileType.banner, TileType.flower],
		deployTypes: [ DeployType.anywhere ],
		movements: [
			{
				type: MovementType.standard,
				distance: 1
			}
		]
	} */

	TrifleTiles[TrifleTileCodes.SkyBison] = {
		types: [TileType.animal],
		identifiers: [TileIdentifier.air],
		deployTypes: [ DeployType.temple ],
		movements: [
			{
				type: MovementType.standard,
				distance: 6,
				captureTypes: [ CaptureType.all ]
			}
		],
		territorialZone: {
			size: 6,
			abilities: [
				// {
				// 	type: ZoneAbility.canceledWhenInTemple
				// },
				{
					type: ZoneAbility.restrictMovementWithinZone,
					targetTeams: [ TileTeam.enemy ],
					targetTileCodes: [ TrifleTileCodes.SkyBison ]
				}
			]
		},
		abilities: [
			{
				// TODO - Test/implement
				type: Ability.cancelZone,
				triggeringBoardStates: [AbilityTrigger.whileInsideTemple],
				targetTileTypes: [TileCategory.thisTile]
			}
		]
	};

	TrifleTiles[TrifleTileCodes.Chrysanthemum] = {
		types: [TileType.flower],
		deployTypes: [DeployType.anywhere],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: ZoneAbility.immobilizesTiles,
					targetTeams: [TileTeam.enemy],
					targetTileTypes: [TileType.animal],
					targetTileIdentifiers: [TileIdentifier.air]
				},
				{
					type: ZoneAbility.removesTileAbilities,
					targetTeams: [TileTeam.enemy],
					targetTileCodes: [TrifleTileCodes.SkyBison]
				}
			]
		}
	};

	/* TrifleTiles[TrifleTileCodes.Wheel] = {
		types: [TileType.traveler],
		deployTypes: [ DeployType.anywhere ],
		movements: [
			{
				type: MovementType.diagonal,
				distance: 15,
				captureTypes: [ CaptureType.all ],
				restrictions: [
					{
						type: MovementRestriction.mustPreserveDirection
					}
				]
			}
		]
	}; */

	TrifleTiles[TrifleTileCodes.Badgermole] = { /* Done */
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.standard,
				distance: 1
			},
			{
				type: MovementType.jumpAlongLineOfSight,
				targetTileTypes: [TileType.flower, TileType.banner]
			}
		],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: ZoneAbility.protectFriendlyTilesFromCapture,
					targetTileTypes: [TileType.flower, TileType.banner]
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.FireLily] = { /* Done */
		types: [TileType.flower],
		deployTypes: [DeployType.anywhere],
		territorialZone: {
			size: 5
		}
	};

	TrifleTiles[TrifleTileCodes.Dragon] = { /* Done */
		types: [TileType.animal],
		specialDeployTypes: [
			{
				type: SpecialDeployType.withinFriendlyTileZone,
				targetTileCodes: [TrifleTileCodes.FireLily]
			}
		],
		movements: [
			{
				type: MovementType.withinFriendlyTileZone,
				targetTileCodes: [TrifleTileCodes.FireLily],
				captureTypes: [CaptureType.all]
			}
		]
	};


	/* Air Tiles */
	TrifleTiles[TrifleTileCodes.AirBanner] = { /* Todo! */
		types: [TileType.banner],
		deployTypes: [ DeployType.anywhere ],
		movements: [
			{
				type: MovementType.standard,
				distance: 1
			}
		],
		abilities: [
			{
				// TODO! There is no ZoneAbility.grantBonusTileMovement!
				type: ZoneAbility.grantBonusTileMovement,
				// amount: 1,
				// targetTileTypes: [TileType.flower]
			}
		]
	};

	/* TrifleTiles[TrifleTileCodes.RingTailedLemur] = {
		types: [TileType.animal],
		deployTypes: [ DeployType.anywhere ],
		movements: [
			{
				type: MovementType.standard,
				distance: 3,
				abilities: [
					{
						type: MovementAbility.carry,
						targetTileTypes: [ TileType.flower ]
					}
				]
			}
		]
	}; */

	TrifleTiles[TrifleTileCodes.FlyingLemur] = { /* Done */
		types: [TileType.animal],
		identifiers: [TileIdentifier.air],
		deployTypes: [ DeployType.temple ],
		movements: [
			{
				type: MovementType.standard,
				distance: 5,
				captureTypes: [ CaptureType.all ],
				abilities: [
					{
						type: MovementAbility.jumpOver
					}
				]
			}
		]
	};

	TrifleTiles[TrifleTileCodes.HermitCrab] = { /* Done */
		types: [TileType.animal],
		identifiers: [TileIdentifier.air],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.jumpShape,
				shape: [1, 2],
				distance: 99,
				captureTypes: [ CaptureType.all ],
				abilities: [
					{
						type: MovementAbility.jumpOver
					}
				],
				restrictions: [
					{
						type: MovementRestriction.mustPreserveDirection
					}
				]
			}
		]
	};

	TrifleTiles[TrifleTileCodes.Firefly] = {
		types: [TileType.animal],
		identifiers: [TileIdentifier.air],
		deployTypes: [DeployType.temple],
		movements: [
			{
				type: MovementType.standard,
				distance: 2
			}
		],
		abilities: [
			/* {
				type: BoardPresenceAbility.drawTilesInLineOfSight,
				conditionalBoardStates: [AbilityTrigger.whileTileIsOutsideTemple],
				targetTeams: [TileTeam.enemy]
			}, */
			{
				type: Ability.drawTilesAlongLineOfSight,
				triggeringBoardStates: [AbilityTrigger.whileTileInLineOfSight],
				activationConditions: [AbilityTrigger.whileOutsideTemple],
				targetTeams: [TileTeam.enemy]
			}
		]
	};

	/* TODO TrifleTiles[TrifleTileCodes.Dandelion] = {
		types: [TileType.flower],
		deployTypes: [DeployType.adjacentToTemple],
		abilities: [
			{
				type: BoardPresenceAbility.canBeCapturedByFriendlyTiles
			},
			{
				type: BoardPresenceAbility.spawnAdditionalCopies,
				triggeringAction: : AbilityTrigger.whenCaptured,
				amount: 2,
				location: SpawnLocation.adjacent
			}
		]
	}; */

	TrifleTiles[TrifleTileCodes.Edelweiss] = {
		types: [TileType.flower],
		deployTypes: [DeployType.anywhere],
		territorialZone: {
			size: 4,
			abilities: [
				{
					type: ZoneAbility.removesTileAbilities,
					targetTeams: [TileTeam.friendly, TileTeam.enemy],
					targetTileTypes: [TileCategory.allTileTypes]
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.NobleRhubarb] = {
		types: [TileType.flower],
		deployTypes: [DeployType.anywhere],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Ability.grantBonusMovement,
					triggeringAction: AbilityTrigger.whenTileMovesFromWithinZone,
					// ...
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.Lavender] = {
		types: [TileType.flower],
		deployTypes: [DeployType.anywhere],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: ZoneAbility.immobilizesTiles,
					targetTeams: [TileTeam.friendly, TileTeam.enemy]
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.WaterBanner] = {	/* Done */
		types: [TileType.banner],
		deployTypes: [ DeployType.anywhere ],
		movements: [
			{
				type: MovementType.standard,
				distance: 2
			}
		]
	};

	TrifleTiles[TrifleTileCodes.SnowLeopard] = {
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.standard,
				distance: 3,
				captureTypes: [ CaptureType.all ]
			}
		],
		abilities: [
			{
				type: Ability.removeEffects,
				triggeringBoardStates: [AbilityTrigger.whileTileInLineOfSight],
				targetEffectTypes: [AbilityType.protection],
				targetTileTypes: [TileCategory.allTileTypes]
			}
		]
	};

	TrifleTiles[TrifleTileCodes.PolarBearDog] = {
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.standard,
				distance: 4,
				captureTypes: [ CaptureType.all ]
			}
		],
		abilities: [
			{
				type: Ability.protectFromCapture,
				targetTileTypes: [TileCategory.thisTile],
				triggeringAction: AbilityTrigger.whenCapturing,
				// triggerTargetTileType: [TileType.flower],	// Idea: For example - ability could trigger when capturing a Flower - It'd be better to create a Trigger object that contains all the trigger info
				duration: 1,
				tileTypesProtectedFrom: [TileCategory.allTileTypes]
				// tileTypesProtectedFrom: [TileType.traveler]
				// tilesProtectedFrom: [TrifleTileCodes.Wheel, TrifleTileCodes.Dragon]
			}
		]
	};

	TrifleTiles[TrifleTileCodes.BuffaloYak] = {
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.standard,
				distance: 2,
				captureTypes: [CaptureType.all]
			}
		],
		territorialZone: {
			size: 2,
			abilities: [
				{
					type: ZoneAbility.removesTileAbilities,
					targetTeams: [TileTeam.friendly, TileTeam.enemy],
					targetTileTypes: [TileType.flower]
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.TitanArum] = {
		types: [TileType.flower],
		deployTypes: [ DeployType.anywhere ],
		territorialZone: {
			size: 2,
			abilities: [
				{
					type: ZoneAbility.restrictMovementWithinZone,
					targetTeams: [ TileTeam.friendly, TileTeam.enemy ],
					targetTileTypes: [ TileType.animal, TileType.traveler, TileType.banner ]
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.LilyPad] = {
		types: [TileType.flower],
		deployTypes: [ DeployType.anywhere ],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: ZoneAbility.restrictMovementWithinZone,
					targetTeams: [ TileTeam.enemy ],
					targetTileTypes: [ TileCategory.allTileTypes ]
				}
			]
		}
	};

	/* TrifleTiles[TrifleTileCodes.Lupine] = {
		types: [TileType.flower],
		deployTypes: [ DeployType.anywhere ],
		territorialZone: {
			size: 3,
			abilities: [
				{
					type: BoardPresenceAbility.increaseFriendlyTileMovementDistance
					// targetTeams
				}
			]
		}
	}; */

	/* Earth */

	TrifleTiles[TrifleTileCodes.EarthBanner] = {	/* Done, Must Test */
		type: [TileType.banner],
		deployTypes: [DeployType.anywhere],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: ZoneAbility.protectFriendlyTilesFromCapture,
					targetTileTypes: [TileType.flower]
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.SaberToothMooseLion] = {	/* DONE */
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.travelShape,
				shape: [
					MoveDirection.any,
					MoveDirection.straight,
					MoveDirection.straight
				],
				captureTypes: [CaptureType.all],
				restrictions: [
					{
						type: MovementRestriction.mustPreserveDirection
					}
				],
				abilities: [
					{
						type: MovementAbility.chargeCapture
					}
				]
			}
		]
	};

	TrifleTiles[TrifleTileCodes.Shirshu] = {
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.standard,
				distance: 2
			},
			{
				type: MovementType.jumpAlongLineOfSight,
				targetTileTypes: [TileType.animal, TileType.traveler]
			}
		],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: ZoneAbility.immobilizesTiles,
					targetTeams: [TileTeam.enemy]
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.BoarQPine] = {
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.standard,
				distance: 1
			}
		],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Ability.captureTiles,
					triggeringAction: AbilityTrigger.whenTileLandsInZone,
					targetTileTypes: [TileCategory.landingTile]
				}
			]
		}
	};


	TrifleTiles[TrifleTileCodes.MessengerHawk] = {	/* DONE */
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere, DeployType.temple],
		movements: [
			{
				type: MovementType.anywhere,
			}
		]
	};


	/* Example: Tile can move far without capturing, but a small distance with capturing
	TrifleTiles[TrifleTileCodes.LargeMovementNoCaptureSmallMovementDoes] = {
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere, DeployType.temple],
		movements: [
			{
				title: "LargeMovement",
				type: MovementType.standard,
				distance: 9
			},
			{
				title: "SmallMovement",
				type: MovementType.standard,
				distance: 3,
				captureTypes: [CaptureType.all]
			}
		]
	}; */

	/* My tile ideas */
	/* TrifleTiles[TrifleTileCodes.AirGlider] = {
		types: [TileType.traveler],
		deployTypes: [DeployType.temple],
		movements: [
			{
				type: MovementType.travelShape,
				shape: [
					MoveDirection.any,
					MoveDirection.turn,
					MoveDirection.straight,
					MoveDirection.straight,
					MoveDirection.straight
				],
				captureTypes: [CaptureType.all]
			}
		]
	}; */

	/* Random tile ideas */
	/* TrifleTiles[TrifleTileCodes.Peacock] = {
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.standard,
				distance: 2
			}
		],
		territorialZone: {
			size: 7,
			abilities: [
				{
					type: ZoneAbility.opponentTilesMustMoveNearer,
					targetTileTypes: [TileType.animal]
				}
			]
		}
	}; */

};


