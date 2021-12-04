
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
	Saffron: "Saffron",

	/* Ginseng work */
	GinsengWhiteLotus: "GinsengWhiteLotus",
	GinsengKoi: "GinsengKoi",
	GinsengBadgermole: "GinsengBadgermole",
	GinsengDragon: "GinsengDragon",
	GinsengBison: "GinsengBison",
	GinsengLionTurtle: "GinsengLionTurtle",
	GinsengGinseng: "GinsengGinseng",
	GinsengOrchid: "GinsengOrchid",
	GinsengWheel: "GinsengWheel"
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

Trifle.TileCategory = {
	thisTile: "thisTile",
	allButThisTile: "allButThisTile",
	allTileTypes: "allTileTypes",
	landingTile: "landingTile",
	surroundingTiles: "surroundingTiles",
	tileWithAbility: "tileWithAbility"
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
	travelShape: "travelShape",
	awayFromTargetTile: "awayFromTargetTile",
	awayFromTargetTileOrthogonal: "awayFromTargetTileOrthogonal",
	awayFromTargetTileDiagonal: "awayFromTargetTileDiagonal",
	jumpSurroundingTiles: "jumpSurroundingTiles"
};

Trifle.MovementDirection = {
	orthogonal: "orthogonal",
	diagonal: "diagonal"
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
	all: "all",
	tilesTargetedByAbility: "tilesTargetedByAbility",
	allExcludingCertainTiles: "allExcludingCertainTiles"
};

Trifle.ActivationRequirement = {
	tilesNotInTemple: "tilesNotInTemple",
	tileIsOnPointOfType: "tileIsOnPointOfType"
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

Trifle.AttributeType = {
	gigantic: "gigantic"
}

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
	restrictMovementWithinZoneUnlessCapturing: "restrictMovementWithinZoneUnlessCapturing",
	cancelAbilities: "cancelAbilities",
	cancelAbilitiesTargetingTiles: "cancelAbilitiesTargetingTiles",
	prohibitTileFromCapturing: "prohibitTileFromCapturing",
	changeMovementDistanceByFactor: "changeMovementDistanceByFactor",
	growGigantic: "growGigantic",
	moveTargetTile: "moveTargetTile",
	recordTilePoint: "recordTilePoint",
	moveTileToRecordedPoint: "moveTileToRecordedPoint",
	moveTargetTileToPile: "moveTargetTileToPile"
};

Trifle.AbilityType = {
	all: "all",
	protection: "protection"
};

Trifle.AbilityPriorityLevel = {
	highest: "highest"
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
	whileTargetTileIsSurrounding: "whileTargetTileIsSurrounding",
	whenLandsAdjacentToTargetTile: "whenLandsAdjacentToTargetTile",
	whenLandsSurroundingTargetTile: "whenLandsSurroundingTargetTile",
	whenTargetTileLandsAdjacent: "whenTargetTileLandsAdjacent",
	whenTargetTileLandsSurrounding: "whenTargetTileLandsSurrounding",
	whileTargetTileIsInZone: "whileTargetTileIsInZone",
	whenDeployed: "whenDeployed",
	whenActiveMovement: "whenActiveMovement"
};

Trifle.PromptTargetType = {
	boardPoint: "boardPoint",
	tilePile: "tilePile"
};

Trifle.TargetPromptId = {
	movedTilePoint: "movedTilePoint",
	movedTileDestinationPoint: "movedTileDestinationPoint"
};

Trifle.TileTeam = {
	friendly: "friendly",
	enemy: "enemy"
};

Trifle.RecordTilePointType = {
	startPoint: "startPoint"
};

Trifle.AbilitiesForType = {};

Trifle.AbilityTypes = {};

Trifle.TrifleTiles = {};

Trifle.TileInfo = {};

Trifle.TileInfo.tileIsBanner = function(tileInfo) {
	return tileInfo && tileInfo.types && tileInfo.types.includes(Trifle.TileType.banner);
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

Trifle.TileInfo.tileAbilityIsTriggeredWhenCaptured = function(tileAbilityInfo) {
	var isTriggeredWhenCaptured = false;
	if (tileAbilityInfo.triggers) {
		tileAbilityInfo.triggers.forEach(function(triggerInfo) {
			if (triggerInfo.triggerType === Trifle.AbilityTriggerType.whenCapturedByTargetTile) {
				isTriggeredWhenCaptured = true;
			}
		});
	}
	return isTriggeredWhenCaptured;
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
				targetTileTypes: [Trifle.TileCategory.thisTile],
				triggeringActions: [Trifle.AbilityTriggerType.whenCapturingTargetTile],
				// triggerTargetTileType: [Trifle.TileType.flower],	// Idea: For example - ability could trigger when capturing a Flower - It'd be better to create a Trigger object that contains all the trigger info
				duration: 1,
				tileTypesProtectedFrom: [Trifle.TileCategory.allTileTypes]
				// tileTypesProtectedFrom: [Trifle.TileType.traveler]
				// tilesProtectedFrom: [Trifle.TileCodes.Wheel, Trifle.TileCodes.Dragon]
			}
		],
		textLines: [
			"Animal | Water",
			"If this tile captures an opponent's tile it can't be captured on your opponent next turn. Moves 4 spaces. Can capture other tiles."
		]
	};

	TrifleTiles[Trifle.TileCodes.BuffaloYak] = {	// todo
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
			"Animal | Water",
			"Flower tiles within 2 spaces have their effects nullified. Can move two spaces, and can capture."
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

	//

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

	/* Fire */

	TrifleTiles[Trifle.TileCodes.FireBanner] = {	/* todo */
		available: false,
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
		available: false,
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
			"Animal | Fire",
			"Enemy tiles in this tiles line of sight have their movement speed halved (Tiles with an odd number of space movement is decreased by half rounded down). This tile can move 2 spaces and can capture tiles."
		]
	};

	TrifleTiles[Trifle.TileCodes.ArmadilloBear] = {	/* TODO */
		available: false,
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
			"Territorial Zone: 5"
		]
	};

	TrifleTiles[Trifle.TileCodes.GrassWeed] = {	/* TODO */
		available: false,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		textLines: [
			"Flower | Fire",
			"When this Plant tile is deployed it captures all flower tiles adjacent to it. Flower tiles can't be deployed or moved to a space adjacent to this tile"
		]
	};

	TrifleTiles[Trifle.TileCodes.GrippingGrass] = {	/* TODO */
		available: false,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		textLines: [
			"Flower | Fire",
			"Animals adjacent may not move (But keep range and effects) (Can be captured through (Like the original chrysanthemum could be captured by bison))"
		]
	};

	TrifleTiles[Trifle.TileCodes.Saffron] = {	/* TODO */
		available: false,
		types: [Trifle.TileType.flower],
		identifiers: [Trifle.TileIdentifier.fire],
		deployTypes: [Trifle.DeployType.anywhere, Trifle.DeployType.temple],
		textLines: [
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
			},
			{
				type: Trifle.MovementType.anywhere,
				captureTypes: [Trifle.CaptureType.all]
			}
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
			}
		]
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

	TrifleTiles[Trifle.TileCodes.GinsengWhiteLotus] = {
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
	};

	Trifle.TrifleTiles = TrifleTiles;
};


Trifle.TileInfo.getReadableDescription = function(tileCode) {
	var tileHtml = "";

	var tileInfo = PaiShoGames.currentTileMetadata[tileCode];

	if (tileInfo.textLines) {
		tileInfo.textLines.forEach(function(textLine) {
			tileHtml += "- " + textLine + "<br />";
		});
		return tileHtml + "<br />";
	}

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

				if (movementInfo.captureTypes) {
					// tileHtml += "<br />- Can Capture: " + movementInfo.captureTypes;
					// tileHtml += "<br />Capturing Properties:";
					/* movementInfo.captureTypes.forEach((captureTypeInfoList) => {
						Object.keys(captureTypeInfoList).forEach((key, index) => {
							var captureTypeInfoEntry = captureTypeInfoList[key];
							tileHtml += "<br />- " + key + ": " + captureTypeInfoEntry;
						});
					}); */
					tileHtml += Trifle.TileInfo.getObjectSummary("Capturing Properties", movementInfo.captureTypes, 0);
				}
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

Trifle.TileInfo.getObjectSummary = function(origKey, theObject, indentDepth) {
	var indentDashStr = "";
	for (var i = 0; i < indentDepth; i++) {
		indentDashStr += "-";
	}
	var htmlSummary = "";
	if (theObject instanceof Array && !(theObject[0] instanceof Object)) {
		htmlSummary += "<br />" + indentDashStr + " " + origKey + ": " + theObject;
	} else if (theObject instanceof Object) {
		if (!isNaN(origKey)) {
			indentDepth--;
		} else {
			htmlSummary += "<br />" + indentDashStr + " " + origKey + ": ";
		}
		Object.keys(theObject).forEach((key, index) => {
			var captureTypeInfoEntry = theObject[key];
			htmlSummary += Trifle.TileInfo.getObjectSummary(key, captureTypeInfoEntry, indentDepth+1);
		});
	} else {
		htmlSummary += "<br />" + indentDashStr + " " + origKey + ": " + theObject;
	}
	return htmlSummary;
};

