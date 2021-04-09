
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
	air: "Air"
};

Trifle.TileCategory = {
	thisTile: "thisTile",
	allButThisTile: "allButThisTile",
	allTileTypes: "allTileTypes",
	landingTile: "landingTile",
	surroundingTiles: "surroundingTiles"
};

Trifle.TargetType = {
	thisTile: "thisTile",			// 
	allTileTypes: "allTileTypes",	//
	landingTile: "landingTile",		//
	allTiles: "allTiles",
	triggerTargetTiles: "triggerTargetTiles",
	surroundingTiles: "surroundingTiles"
}

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

Trifle.AbilityName = {
	captureTargetTiles: "captureTargetTiles",
	removeEffects: "removeEffects",
	protectFromCapture: "protectFromCapture",
	grantBonusMovement: "grantBonusMovement",
	lureTiles: "lureTiles",
	drawTilesAlongLineOfSight: "drawTilesAlongLineOfSight",
	cancelZone: "cancelZone",
	immobilizeTiles: "immobilizeTiles",
	restrictMovementWithinZone: "restrictMovementWithinZone",
	cancelAbilities: "cancelAbilities"
};

Trifle.AbilityType = {
	all: "all",
	protection: "protection"
};

Trifle.AbilityTriggerType = {
	whenCapturedByTargetTile: "whenCapturedByTargetTile",
	whenCapturingTargetTile: "whenCapturingTargetTile",
	whenTargetTileLandsInZone: "whenTargetTileLandsInZone",
	whenTargetTileMovesFromWithinZone: "whenTargetTileMovesFromWithinZone",
	whileTargetTileIsInLineOfSight: "whileTargetTileIsInLineOfSight",
	whileOutsideTemple: "whileOutsideTemple",	// Todo change to whileTargetTileOutsideTemple?
	whileInsideTemple: "whileInsideTemple",		// ^
	whileTargetTileIsOnBoard: "whileTargetTileIsOnBoard",
	whileOnBoard: "whileOnBoard",	// Remove?
	whileTargetTileIsAdjacent: "whileTargetTileIsAdjacent",
	whenLandsAdjacentToTargetTile: "whenLandsAdjacentToTargetTile",
	whileTargetTileIsInZone: "whileTargetTileIsInZone"
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
	Trifle.AbilitiesForType = {};

	Trifle.AbilitiesForType[Trifle.AbilityType.protection] = [
		Trifle.ZoneAbility.protectFriendlyTilesFromCapture,
		Trifle.AbilityName.protectFromCapture
	];
};

Trifle.TileInfo.defineAbilityTypes = function () {
	AbilityTypes = {};

	AbilityTypes[Trifle.ZoneAbility.protectFriendlyTilesFromCapture] = [
		Trifle.AbilityType.protection
	];

	AbilityTypes[Trifle.AbilityName.protectFromCapture] = [
		Trifle.AbilityType.protection
	];
};

Trifle.TileInfo.defineTrifleTiles = function() {
	TrifleTiles = {};

	/* Air */

	TrifleTiles[Trifle.TileCodes.AirBanner] = {	/* Done */
		available: true,
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
		]
	};

	TrifleTiles[Trifle.TileCodes.Chrysanthemum] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
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
		]
	};

	TrifleTiles[Trifle.TileCodes.Edelweiss] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
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
		]
	};

	TrifleTiles[Trifle.TileCodes.NobleRhubarb] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
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
		]
	};

	TrifleTiles[Trifle.TileCodes.Lavender] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
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
		]
	};

	TrifleTiles[Trifle.TileCodes.WaterBanner] = {	/* Done */
		available: true,
		types: [Trifle.TileType.banner],
		deployTypes: [ Trifle.DeployType.anywhere ],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 2
			}
		]
	};

	TrifleTiles[Trifle.TileCodes.SnowLeopard] = {	// todo
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
				type: Trifle.AbilityName.removeEffects,
				triggeringBoardStates: [Trifle.AbilityTriggerType.whileTargetTileIsInLineOfSight],
				targetEffectTypes: [Trifle.AbilityType.protection],
				targetTileTypes: [Trifle.TileCategory.allTileTypes]
			}
		]
	};

	TrifleTiles[Trifle.TileCodes.PolarBearDog] = {	// todo
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
				type: Trifle.AbilityName.protectFromCapture,
				targetTileTypes: [Trifle.TileCategory.thisTile],
				triggeringActions: [Trifle.AbilityTriggerType.whenCapturingTargetTile],
				// triggerTargetTileType: [Trifle.TileType.flower],	// Idea: For example - ability could trigger when capturing a Flower - It'd be better to create a Trigger object that contains all the trigger info
				duration: 1,
				tileTypesProtectedFrom: [Trifle.TileCategory.allTileTypes]
				// tileTypesProtectedFrom: [Trifle.TileType.traveler]
				// tilesProtectedFrom: [Trifle.TileCodes.Wheel, Trifle.TileCodes.Dragon]
			}
		]
	};

	TrifleTiles[Trifle.TileCodes.BuffaloYak] = {	// todo
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

	TrifleTiles[Trifle.TileCodes.TitanArum] = {	/* Done */	// TODO: Allow restrictMovementWithinZone affected tiles to move away as much as possible if they cannot escape zone?
		available: true,
		types: [Trifle.TileType.flower],
		deployTypes: [ Trifle.DeployType.anywhere ],
		territorialZone: {
			size: 2,
			abilities: [
				{
					type: Trifle.ZoneAbility.restrictMovementWithinZone,
					targetTeams: [ Trifle.TileTeam.friendly, Trifle.TileTeam.enemy ],
					targetTileTypes: [ Trifle.TileType.animal, Trifle.TileType.banner ]
				}
			]
		}
	};

	TrifleTiles[Trifle.TileCodes.LilyPad] = {	// TODO convert to ability instead of zone
		// available: true,
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

	TrifleTiles[Trifle.TileCodes.Cattail] = {	// TODO
		available: true,
		types: [Trifle.TileType.flower],
		deployTypes: [ Trifle.DeployType.anywhere ]
	};

	/* Earth */

	TrifleTiles[Trifle.TileCodes.EarthBanner] = {	/* Done */
		available: true,
		types: [Trifle.TileType.banner],
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
		]
	};

	TrifleTiles[Trifle.TileCodes.Badgermole] = {	/* Done */
		available: true,
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
		]
	};

	TrifleTiles[Trifle.TileCodes.SaberToothMooseLion] = {	/* Done */
		available: true,
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
					type: Trifle.AbilityName.captureTargetTiles,
					triggeringActions: [Trifle.AbilityTriggerType.whenTargetTileLandsInZone],
					targetTileTypes: [Trifle.TileCategory.landingTile]
				}
			]
		}
	};

	/* Fire */

	TrifleTiles[Trifle.TileCodes.Dragon] = {	/* Done */
		available: true,
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

	TrifleTiles[Trifle.TileCodes.MessengerHawk] = {	/* Done */
		available: true,
		types: [Trifle.TileType.animal],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		movements: [
			{
				type: Trifle.MovementType.anywhere,
			}
		]
	};

	TrifleTiles[Trifle.TileCodes.FireLily] = {	/* Done */
		available: true,
		types: [Trifle.TileType.flower],
		deployTypes: [Trifle.DeployType.anywhere],
		territorialZone: {
			size: 5
		}
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
			},
			{
				type: Trifle.MovementType.anywhere,
				captureTypes: [Trifle.CaptureType.all]
			}
		]
		// Ability testing...
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

};


Trifle.TileInfo.getReadableDescription = function(tileCode) {
	var tileHtml = "";

	var tileInfo = TrifleTiles[tileCode];

	if (tileInfo) {
		tileHtml = "Type: " + tileInfo.types;

		if (tileInfo.identifiers) tileHtml += "<br />Identifiers: " + tileInfo.identifiers;

		if (tileInfo.deployTypes) {
			tileHtml += "<br />";
			tileHtml += "Deploy: " + tileInfo.deployTypes
		}

		if (tileInfo.specialDeployTypes) {
			tileHtml += "<br />";
			tileInfo.specialDeployTypes.forEach(function(specialDeployInfo) {
				tileHtml += "Deploy: " + specialDeployInfo.type + " of " + specialDeployInfo.targetTileCodes;
			});
		}

		if (tileInfo.movements) {
			tileInfo.movements.forEach(function(movementInfo) {
				tileHtml += "<br /><br />";
				tileHtml += "Movement type: " + movementInfo.type;
				if (movementInfo.shape) tileHtml += "</br />- Shape: " + movementInfo.shape;
				if (movementInfo.distance) tileHtml += "<br />- Distance: " + (movementInfo.distance === 99 ? "unlimited" : movementInfo.distance);
				if (movementInfo.targetTileTypes) tileHtml += "<br />- Of Tiles of Type: " + movementInfo.targetTileTypes;
				if (movementInfo.targetTileCodes) tileHtml += "<br />- Of Tiles: " + movementInfo.targetTileCodes;
				if (movementInfo.abilities) {
					movementInfo.abilities.forEach(function(movementAbilityInfo) {
						tileHtml += "<br />- Movement Ability: " + movementAbilityInfo.type;
					});
				}
				if (movementInfo.restrictions) {
					movementInfo.restrictions.forEach(function(movementRestrictionInfo) {
						tileHtml += "<br />- Movement Restriction: " + movementRestrictionInfo.type;
					});
				}

				if (movementInfo.captureTypes) tileHtml += "<br />- Can Capture: " + movementInfo.captureTypes;
			});
		}

		if (tileInfo.territorialZone) {
			tileHtml += "<br /><br />Zone Size: " + tileInfo.territorialZone.size;
			if (tileInfo.territorialZone.abilities) {
				tileInfo.territorialZone.abilities.forEach(function(ZoneAbilityInfo) {
					tileHtml += "<br />Zone Ability: " + ZoneAbilityInfo.type;
					if (ZoneAbilityInfo.targetTeams) tileHtml += "<br />- Target Tiles: " + ZoneAbilityInfo.targetTeams;
					if (ZoneAbilityInfo.targetTileCodes) tileHtml += "<br />- Target Tiles: " + ZoneAbilityInfo.targetTileCodes;
					if (ZoneAbilityInfo.targetTileTypes) tileHtml += "<br />- Target Tiles: " + ZoneAbilityInfo.targetTileTypes;
				});
			}
		}
		
		if (tileInfo.abilities) {
			tileInfo.abilities.forEach(function(abilityInfo) {
				tileHtml += "<br /><br />";
				tileHtml += "Ability: " + abilityInfo.type;
				abilityInfo.triggers.forEach(function(triggerInfo) {
					tileHtml += "<br />- Trigger: " + triggerInfo.triggerType;
					if (triggerInfo.targetTeams) tileHtml += "<br />-- Target Tiles: " + triggerInfo.targetTeams;
					if (triggerInfo.targetTileTypes) tileHtml += "<br />-- Target Tiles: " + triggerInfo.targetTileTypes;
					if (triggerInfo.targetTileIdentifiers) tileHtml += "<br />-- Target Tile Identifiers: " + triggerInfo.targetTileIdentifiers;
				});
				tileHtml += "<br />- Ability Target Types: " + abilityInfo.targetTypes;
				if (abilityInfo.targetTeams) tileHtml += "<br />-- Target Tiles: " + abilityInfo.targetTeams;
				if (abilityInfo.targetTileTypes) tileHtml += "<br />-- Target Tiles: " + abilityInfo.targetTileTypes;
			});
		}


		tileHtml += "<br />";
	} else {
		tileHtml = tileCode;
	}

	return tileHtml;
};

