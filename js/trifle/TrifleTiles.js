
Trifle.TileCodes = {
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

Trifle.TileType = {
	banner: "Banner",
	animal: "Animal",
	flower: "Flower",
	fruit: "Fruit",
	other: "Other",
	traveler: "Traveler"
};

Trifle.TileIdentifier = {
	air: "Air"
};

Trifle.TileCategory = {
	thisTile: "thisTile",
	allTileTypes: "allTileTypes",
	landingTile: "landingTile"
};

Trifle.DeployType = {
	anywhere: "anywhere",
	temple: "temple",
	adjacentToTemple: "adjacentToTemple"
};

Trifle.SpecialDeployType = {
	withinFriendlyTileZone: "withinFriendlyTileZone"
};

Trifle.MovementType = {
	standard: "standard",
	diagonal: "diagonal",
	jumpAlongLineOfSight: "jumpAlongLineOfSight",
	withinFriendlyTileZone: "withinFriendlyTileZone",
	anywhere: "anywhere",
	jumpShape: "jumpShape",
	travelShape: "travelShape"
};

Trifle.MovementRestriction = {
	// restrictedByOpponentTileZones: "restrictedByOpponentTileZones",
	// immobilizedByAdjacentOpponentTile: "immobilizedByAdjacentOpponentTile", // unused
	// immobilizedByOpponentTileZones: "immobilizedByOpponentTileZones",
	mustPreserveDirection: "mustPreserveDirection"
};

Trifle.MovementAbility = {
	// carry: "carry", // For future
	jumpOver: "jumpOver",
	chargeCapture: "chargeCapture"
};

Trifle.MoveDirection = {
	any: "any",	/* Any direction starts movement */
	straight: "straight",
	turn: "turn",
	left: "left",
	right: "right"
}

Trifle.CaptureType = {
	none: "none",
	all: "all"
};

Trifle.ZoneAbility = {
	canceledWhenInTemple: "canceledWhenInTemple", // Note: Too specific, how to split up to *dynamicize*?
	protectFriendlyTilesFromCapture: "protectFriendlyTilesFromCapture", // Too specific, can be ProtectTilesFromCapture and have a target tiles metadata
	// immobilizesOpponentTiles: "immobilizesOpponentTiles", // Outdated, replaced by ImmobilizesTiles
	immobilizesTiles: "immobilizesTiles",
	removesTileAbilities: "removesTileAbilities",	// TODO // TODO testing, etc
	restrictMovementWithinZone: "restrictMovementWithinZone",
	captureLandingTiles: "captureLandingTiles" // unused?
}

Trifle.BoardPresenceAbility = {
	increaseFriendlyTileMovementDistance: "increaseFriendlyTileMovementDistance",	// TODO replace with Ability.grantBonusMovement
	// spawnAdditionalCopies: "spawnAdditionalCopies",	// TODO,
	canBeCapturedByFriendlyTiles: "canBeCapturedByFriendlyTiles",
	drawTilesInLineOfSight: "drawTilesInLineOfSight"
	// captureProtection: "captureProtection"
}

Trifle.SpawnLocation = {
	adjacent: "adjacent"
};

Trifle.Ability = {
	captureTiles: "captureTiles",
	removeEffects: "removeEffects",
	protectFromCapture: "protectFromCapture",
	grantBonusMovement: "grantBonusMovement",
	lureTiles: "lureTiles",
	drawTilesAlongLineOfSight: "drawTilesAlongLineOfSight",
	cancelZone: "cancelZone"
};

Trifle.AbilityType = {
	protection: "protection"
};

Trifle.AbilityTrigger = {
	whenCaptured: "whenCaptured",
	whenCapturing: "whenCapturing",
	whenTileLandsInZone: "whenTileLandsInZone",
	whenTileMovesFromWithinZone: "whenTileMovesFromWithinZone",
	whileTileInLineOfSight: "whileTileInLineOfSight",
	whileOutsideTemple: "whileOutsideTemple",
	whileInsideTemple: "whileInsideTemple"
};

Trifle.TileTeam = {
	friendly: "friendly",
	enemy: "enemy"
};

Trifle.AbilitiesForType = {};

Trifle.AbilityTypes = {};

Trifle.TrifleTiles = {};

Trifle.TileInfo = {};

Trifle.TileInfo.tileIsBanner = function(tileInfo) {
	return tileInfo && tileInfo.types.includes(Trifle.TileType.banner);
};

Trifle.TileInfo.tileIsOneOfTheseTypes = function(tileInfo, types) {
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

Trifle.TileInfo.getTerritorialZone = function(tileInfo) {
	if (tileInfo.territorialZone) {
		return tileInfo.territorialZone;
	}
};

Trifle.TileInfo.movementMustPreserveDirection = function(movementInfo) {
	var mustPreserveDirection = false;
	if (movementInfo && movementInfo.restrictions && movementInfo.restrictions.length > 0) {
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === Trifle.MovementRestriction.mustPreserveDirection) {
				mustPreserveDirection = true;
				return;
			}
		});
	}
	return mustPreserveDirection;
};

Trifle.TileInfo.tileHasBoardPresenceAbility = function(tileInfo, abilityType) {
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

// Trifle.TileInfo.tileHasDrawTilesInLineOfSightAbility = function(tileInfo) {
// 	return Trifle.TileInfo.tileHasBoardPresenceAbility(tileInfo, Trifle.BoardPresenceAbility.drawTilesInLineOfSight);
// };

Trifle.TileInfo.tileCanBeCapturedByFriendlyTiles = function(tileInfo) {
	return Trifle.TileInfo.tileHasBoardPresenceAbility(tileInfo, Trifle.BoardPresenceAbility.canBeCapturedByFriendlyTiles);
};

Trifle.TileInfo.tileHasOnlyOneMovement = function(tileInfo) {
	return tileInfo && tileInfo.movements && tileInfo.movements.length === 1;
};

Trifle.TileInfo.tileHasMovementAbility = function(tileInfo, targetMovementAbilityType) {
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

Trifle.TileInfo.tileHasAbilityTrigger = function(tileInfo, abilityTrigger) {
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

Trifle.TileInfo.getAbilitiesWithAbilityTrigger = function(tileInfo, abilityTrigger) {
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

Trifle.TileInfo.getZoneAbilitiesWithAbilityTrigger = function(tileInfo, abilityTrigger) {
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

Trifle.TileInfo.initializeTrifleData = function() {
	Trifle.TileInfo.defineAbilitiesForAbilityTypes();
	Trifle.TileInfo.defineAbilityTypes();
	Trifle.TileInfo.defineTrifleTiles();
};

Trifle.TileInfo.defineAbilitiesForAbilityTypes = function () {
	AbilitiesForType = {};

	AbilitiesForType[Trifle.AbilityType.protection] = [
		Trifle.ZoneAbility.protectFriendlyTilesFromCapture,
		Trifle.Ability.protectFromCapture
	];
};

Trifle.TileInfo.defineAbilityTypes = function () {
	AbilityTypes = {};

	AbilityTypes[Trifle.ZoneAbility.protectFriendlyTilesFromCapture] = [
		Trifle.AbilityType.protection
	];

	AbilityTypes[Trifle.Ability.protectFromCapture] = [
		Trifle.AbilityType.protection
	];
};

Trifle.TileInfo.defineTrifleTiles = function() {
	TrifleTiles = {};

	/**
	 TrifleTiles[Trifle.TileCodes.TEMPLATE] = {
	 * 	types: [Trifle.TileType.?]
	 * 	deployTypes: [ DeployType.?, ... ],
	 * 	movements: [
	 * 		{
	 * 			type: Trifle.MovementType.?,
	 * 			distance: *number value*,
	 * 			captureTypes: [Trifle.CaptureType.?, ...],
	 * 			restrictions: [
	 * 				{
	 * 					type: Trifle.MovementRestriction.?,
	 * 					affectingTiles: [ Trifle.TileCodes.?, ... ],
	 * 				}, {...}, ...
	 * 			],
	 * 			abilities: [
	 * 				{
	 * 					type: Trifle.MovementAbility.?,
	 * 					targetTileTypes: [ Trifle.TileType.?, ...]
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

	TrifleTiles[Trifle.TileCodes.SkyBison] = {
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
			abilities: [
				// {
				// 	type: ZoneAbility.canceledWhenInTemple
				// },
				{
					type: Trifle.ZoneAbility.restrictMovementWithinZone,
					targetTeams: [ Trifle.TileTeam.enemy ],
					targetTileCodes: [ Trifle.TileCodes.SkyBison ]
				}
			]
		},
		abilities: [
			{
				// TODO - Test/implement
				type: Trifle.Ability.cancelZone,
				triggeringBoardStates: [Trifle.AbilityTrigger.whileInsideTemple],
				targetTileTypes: [Trifle.TileCategory.thisTile]
			}
		]
	};

	TrifleTiles[Trifle.TileCodes.Chrysanthemum] = {
		types: [Trifle.TileType.flower],
		deployTypes: [Trifle.DeployType.anywhere],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Trifle.ZoneAbility.immobilizesTiles,
					targetTeams: [Trifle.TileTeam.enemy],
					targetTileTypes: [Trifle.TileType.animal],
					targetTileIdentifiers: [Trifle.TileIdentifier.air]
				},
				{
					type: Trifle.ZoneAbility.removesTileAbilities,
					targetTeams: [Trifle.TileTeam.enemy],
					targetTileCodes: [Trifle.TileCodes.SkyBison]
				}
			]
		}
	};

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

	TrifleTiles[Trifle.TileCodes.Badgermole] = { /* Done */
		types: [Trifle.TileType.animal],
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
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Trifle.ZoneAbility.protectFriendlyTilesFromCapture,
					targetTileTypes: [Trifle.TileType.flower, Trifle.TileType.banner]
				}
			]
		}
	};

	TrifleTiles[Trifle.TileCodes.FireLily] = { /* Done */
		types: [Trifle.TileType.flower],
		deployTypes: [Trifle.DeployType.anywhere],
		territorialZone: {
			size: 5
		}
	};

	TrifleTiles[Trifle.TileCodes.Dragon] = { /* Done */
		types: [Trifle.TileType.animal],
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
		]
	};


	/* Air Tiles */
	TrifleTiles[Trifle.TileCodes.AirBanner] = { /* Todo! */
		types: [Trifle.TileType.banner],
		deployTypes: [ Trifle.DeployType.anywhere ],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 1
			}
		],
		abilities: [
			{
				// TODO! There is no ZoneAbility.grantBonusTileMovement!
				type: Trifle.ZoneAbility.grantBonusTileMovement,
				// amount: 1,
				// targetTileTypes: [Trifle.TileType.flower]
			}
		]
	};

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

	TrifleTiles[Trifle.TileCodes.FlyingLemur] = { /* Done */
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
		]
	};

	TrifleTiles[Trifle.TileCodes.HermitCrab] = { /* Done */
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
		]
	};

	TrifleTiles[Trifle.TileCodes.Firefly] = {
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
			/* {
				type: Trifle.BoardPresenceAbility.drawTilesInLineOfSight,
				conditionalBoardStates: [Trifle.AbilityTrigger.whileTileIsOutsideTemple],
				targetTeams: [Trifle.TileTeam.enemy]
			}, */
			{
				type: Trifle.Ability.drawTilesAlongLineOfSight,
				triggeringBoardStates: [Trifle.AbilityTrigger.whileTileInLineOfSight],
				activationConditions: [Trifle.AbilityTrigger.whileOutsideTemple],
				targetTeams: [Trifle.TileTeam.enemy]
			}
		]
	};

	/* TODO TrifleTiles[Trifle.TileCodes.Dandelion] = {
		types: [Trifle.TileType.flower],
		deployTypes: [Trifle.DeployType.adjacentToTemple],
		abilities: [
			{
				type: Trifle.BoardPresenceAbility.canBeCapturedByFriendlyTiles
			},
			{
				type: Trifle.BoardPresenceAbility.spawnAdditionalCopies,
				triggeringAction: : Trifle.AbilityTrigger.whenCaptured,
				amount: 2,
				location: SpawnLocation.adjacent
			}
		]
	}; */

	TrifleTiles[Trifle.TileCodes.Edelweiss] = {
		types: [Trifle.TileType.flower],
		deployTypes: [Trifle.DeployType.anywhere],
		territorialZone: {
			size: 4,
			abilities: [
				{
					type: Trifle.ZoneAbility.removesTileAbilities,
					targetTeams: [Trifle.TileTeam.friendly, Trifle.TileTeam.enemy],
					targetTileTypes: [Trifle.TileCategory.allTileTypes]
				}
			]
		}
	};

	TrifleTiles[Trifle.TileCodes.NobleRhubarb] = {
		types: [Trifle.TileType.flower],
		deployTypes: [Trifle.DeployType.anywhere],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Trifle.Ability.grantBonusMovement,
					triggeringAction: Trifle.AbilityTrigger.whenTileMovesFromWithinZone,
					// ...
				}
			]
		}
	};

	TrifleTiles[Trifle.TileCodes.Lavender] = {
		types: [Trifle.TileType.flower],
		deployTypes: [Trifle.DeployType.anywhere],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Trifle.ZoneAbility.immobilizesTiles,
					targetTeams: [Trifle.TileTeam.friendly, Trifle.TileTeam.enemy]
				}
			]
		}
	};

	TrifleTiles[Trifle.TileCodes.WaterBanner] = {	/* Done */
		types: [Trifle.TileType.banner],
		deployTypes: [ Trifle.DeployType.anywhere ],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 2
			}
		]
	};

	TrifleTiles[Trifle.TileCodes.SnowLeopard] = {
		types: [Trifle.TileType.animal],
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
				type: Trifle.Ability.removeEffects,
				triggeringBoardStates: [Trifle.AbilityTrigger.whileTileInLineOfSight],
				targetEffectTypes: [Trifle.AbilityType.protection],
				targetTileTypes: [Trifle.TileCategory.allTileTypes]
			}
		]
	};

	TrifleTiles[Trifle.TileCodes.PolarBearDog] = {
		types: [Trifle.TileType.animal],
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
				type: Trifle.Ability.protectFromCapture,
				targetTileTypes: [Trifle.TileCategory.thisTile],
				triggeringAction: Trifle.AbilityTrigger.whenCapturing,
				// triggerTargetTileType: [Trifle.TileType.flower],	// Idea: For example - ability could trigger when capturing a Flower - It'd be better to create a Trigger object that contains all the trigger info
				duration: 1,
				tileTypesProtectedFrom: [Trifle.TileCategory.allTileTypes]
				// tileTypesProtectedFrom: [Trifle.TileType.traveler]
				// tilesProtectedFrom: [Trifle.TileCodes.Wheel, Trifle.TileCodes.Dragon]
			}
		]
	};

	TrifleTiles[Trifle.TileCodes.BuffaloYak] = {
		types: [Trifle.TileType.animal],
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
		}
	};

	TrifleTiles[Trifle.TileCodes.TitanArum] = {
		types: [Trifle.TileType.flower],
		deployTypes: [ Trifle.DeployType.anywhere ],
		territorialZone: {
			size: 2,
			abilities: [
				{
					type: Trifle.ZoneAbility.restrictMovementWithinZone,
					targetTeams: [ Trifle.TileTeam.friendly, Trifle.TileTeam.enemy ],
					targetTileTypes: [ Trifle.TileType.animal, Trifle.TileType.traveler, Trifle.TileType.banner ]
				}
			]
		}
	};

	TrifleTiles[Trifle.TileCodes.LilyPad] = {
		types: [Trifle.TileType.flower],
		deployTypes: [ Trifle.DeployType.anywhere ],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Trifle.ZoneAbility.restrictMovementWithinZone,
					targetTeams: [ Trifle.TileTeam.enemy ],
					targetTileTypes: [ Trifle.TileCategory.allTileTypes ]
				}
			]
		}
	};

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

	/* Earth */

	TrifleTiles[Trifle.TileCodes.EarthBanner] = {	/* Done, Must Test */
		types: [Trifle.TileType.banner],
		deployTypes: [Trifle.DeployType.anywhere],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Trifle.ZoneAbility.protectFriendlyTilesFromCapture,
					targetTileTypes: [Trifle.TileType.flower]
				}
			]
		}
	};

	TrifleTiles[Trifle.TileCodes.SaberToothMooseLion] = {	/* DONE */
		types: [Trifle.TileType.animal],
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
				restrictions: [
					{
						type: Trifle.MovementRestriction.mustPreserveDirection
					}
				],
				abilities: [
					{
						type: Trifle.MovementAbility.chargeCapture
					}
				]
			}
		]
	};

	TrifleTiles[Trifle.TileCodes.Shirshu] = {
		types: [Trifle.TileType.animal],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 2
			},
			{
				type: Trifle.MovementType.jumpAlongLineOfSight,
				targetTileTypes: [Trifle.TileType.animal, Trifle.TileType.traveler]
			}
		],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Trifle.ZoneAbility.immobilizesTiles,
					targetTeams: [Trifle.TileTeam.enemy]
				}
			]
		}
	};

	TrifleTiles[Trifle.TileCodes.BoarQPine] = {
		types: [Trifle.TileType.animal],
		deployTypes: [Trifle.DeployType.anywhere],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 1
			}
		],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: Trifle.Ability.captureTiles,
					triggeringAction: Trifle.AbilityTrigger.whenTileLandsInZone,
					targetTileTypes: [Trifle.TileCategory.landingTile]
				}
			]
		}
	};


	TrifleTiles[Trifle.TileCodes.MessengerHawk] = {	/* DONE */
		types: [Trifle.TileType.animal],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		movements: [
			{
				type: Trifle.MovementType.anywhere,
			}
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

	/* My tile ideas */
	/* TrifleTiles[Trifle.TileCodes.AirGlider] = {
		types: [Trifle.TileType.traveler],
		deployTypes: [Trifle.DeployType.temple],
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
		]
	}; */

	/* Random tile ideas */
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

};


