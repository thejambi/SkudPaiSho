
var TrifleTileCodes = {
	SkyBison: 'S',
	Badgermole: 'B',
	Wheel: 'W',
	Chrysanthemum: 'C',
	FireLily: 'F',
	Dragon: 'D',
	Lotus: 'L',
	MessengerHawk: 'MH',
	AirBanner: 'AB',
	FlyingLemur: 'FLL',
	RingTailedLemur: 'RTL',
	HermitCrab: 'HCR',
	Firefly: 'FF',
	Dandelion: 'DL',
	Edelweiss: 'EDW',
	AirGlider: 'AGL'
};

var TileType = {
	banner: "banner",
	animal: "animal",
	flower: "flower",
	fruit: "fruit",
	other: "other",
	traveler: "traveler"
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
	restrictedByOpponentTileZones: "restrictedByOpponentTileZones",
	// immobilizedByAdjacentOpponentTile: "immobilizedByAdjacentOpponentTile",
	immobilizedByOpponentTileZones: "immobilizedByOpponentTileZones",
	mustPreserveDirection: "mustPreserveDirection"
};

var MovementAbility = {
	carry: "carry",
	jumpOver: "jumpOver"
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
	canceledWhenInTemple: "canceledWhenInTemple",
	protectFriendlyTilesFromCapture: "protectFriendlyTilesFromCapture",
	immobilizesOpponentTiles: "immobilizesOpponentTiles",
	removesTileAbilities: "removesTileAbilities"	// TODO
}

var BoardPresenceAbility = {
	increaseFriendlyTileMovementDistance: "increaseFriendlyTileMovementDistance",
	spawnAdditionalCopies: "spawnAdditionalCopies",	// TODO,
	canBeCapturedByFriendlyTiles: "canBeCapturedByFriendlyTiles",
	drawOpponentTilesInLineOfSight: "drawOpponentTilesInLineOfSight"
}

var SpawnLocation = {
	adjacent: "adjacent"
};

var AbilityTrigger = {
	onCapture: "onCapture"
};

TileTeam = {
	friendly: "friendly",
	enemy: "enemy"
};

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

TrifleTileInfo.tileHasDrawOpponentTilesInLineOfSightAbility = function(tileInfo) {
	return TrifleTileInfo.tileHasBoardPresenceAbility(tileInfo, BoardPresenceAbility.drawOpponentTilesInLineOfSight);
};

TrifleTileInfo.tileCanBeCapturedByFriendlyTiles = function(tileInfo) {
	return TrifleTileInfo.tileHasBoardPresenceAbility(tileInfo, BoardPresenceAbility.canBeCapturedByFriendlyTiles);
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
	TrifleTiles[TrifleTileCodes.Lotus] = { /* Done */
		types: [TileType.banner, TileType.flower],
		deployTypes: [ DeployType.anywhere ],
		movements: [
			{
				type: MovementType.standard,
				distance: 1
			}
		]
	}

	TrifleTiles[TrifleTileCodes.SkyBison] = { /* Done */
		types: [TileType.animal],
		deployTypes: [ DeployType.temple ],
		movements: [
			{
				type: MovementType.standard,
				distance: 6,
				captureTypes: [ CaptureType.all ],
				restrictions: [
					{
						/* TODO Should this be an ability of the Bison zone, rather than a restriction on its movement? */
						type: MovementRestriction.restrictedByOpponentTileZones,
						affectingTiles: [ TrifleTileCodes.SkyBison ]
					}
				]
			}
		],
		territorialZone: {
			size: 6,
			abilities: [
				{
					type: ZoneAbility.canceledWhenInTemple
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.Chrysanthemum] = { /* Done */
		types: [TileType.flower],
		deployTypes: [DeployType.anywhere],
		territorialZone: {
			size: 1,
			abilities: [
				{
					type: ZoneAbility.immobilizesOpponentTiles,
					targetTileCodes: [TrifleTileCodes.SkyBison]
				}
			]
		}
	};

	TrifleTiles[TrifleTileCodes.Wheel] = { /* Done */
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
	};

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
	TrifleTiles[TrifleTileCodes.AirBanner] = { /* Done */
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
				type: BoardPresenceAbility.increaseFriendlyTileMovementDistance,
				amount: 1,
				targetTileTypes: [TileType.flower, TileType.traveler]
			}
		]
	};

	TrifleTiles[TrifleTileCodes.FlyingLemur] = {
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
	};

	TrifleTiles[TrifleTileCodes.RingTailedLemur] = { /* Done */
		types: [TileType.animal],
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
		deployTypes: [DeployType.temple],
		movements: [
			{
				type: MovementType.jumpShape,
				shape: [1, 2],
				distance: 99,
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

	TrifleTiles[TrifleTileCodes.Firefly] = { /* Done */
		types: [TileType.animal],
		deployTypes: [DeployType.anywhere],
		movements: [
			{
				type: MovementType.standard,
				distance: 2
			}
		],
		abilities: [
			{
				type: BoardPresenceAbility.drawOpponentTilesInLineOfSight
			}
		]
	};

	TrifleTiles[TrifleTileCodes.Dandelion] = {
		types: [TileType.flower],
		deployTypes: [DeployType.adjacentToTemple],
		abilities: [
			{
				type: BoardPresenceAbility.canBeCapturedByFriendlyTiles
			},
			{
				type: BoardPresenceAbility.spawnAdditionalCopies,
				triggered: AbilityTrigger.onCapture,
				amount: 2,
				location: SpawnLocation.adjacent
			}
		]
	};

	TrifleTiles[TrifleTileCodes.Edelweiss] = {
		types: [TileType.flower],
		deployTypes: [DeployType.anywhere],
		territorialZone: {
			size: 4,
			abilities: [
				{
					type: ZoneAbility.removesTileAbilities,	// TODO
					targetTeams: [TileTeam.friendly, TileTeam.enemy]
				}
			]
		}
	};



	TrifleTiles[TrifleTileCodes.MessengerHawk] = {
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
	TrifleTiles[TrifleTileCodes.AirGlider] = {
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
	};

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


