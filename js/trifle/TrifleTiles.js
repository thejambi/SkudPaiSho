
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
	HermitCrab: 'HCR'
};

var TileType = {
	banner: "banner",
	animal: "animal",
	flower: "flower",
	fruit: "fruit",
	other: "other"
};

var DeployType = {
	anywhere: "anywhere",
	temple: "temple"
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
	jumpShape: "jumpShape"
};

var MovementRestriction = {
	restrictedByOpponentTileZones: "restrictedByOpponentTileZones",
	// immobilizedByAdjacentOpponentTile: "immobilizedByAdjacentOpponentTile",
	immobilizedByOpponentTileZones: "immobilizedByOpponentTileZones"
};

var MovementAbility = {
	carry: "carry",
	jumpOver: "jumpOver"
};

var CaptureType = {
	none: "none",
	all: "all"
};

var ZoneAbility = {
	canceledWhenInTemple: "canceledWhenInTemple",
	protectFriendlyTilesFromCapture: "protectFriendlyTilesFromCapture",
	immobilizesOpponentTiles: "immobilizesOpponentTiles"
}

var TileAbility = {
	increaseFriendlyTileMovementDistance: "increaseFriendlyTileMovementDistance"
}

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
		types: [TileType.other],
		deployTypes: [ DeployType.anywhere ],
		movements: [
			{
				type: MovementType.diagonal,
				distance: 15,
				captureTypes: [ CaptureType.all ]
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
				type: TileAbility.increaseFriendlyTileMovementDistance,
				amount: 1,
				targetTileTypes: [TileType.flower]
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
				distance: 23,
				captureTypes: [ CaptureType.all ],
				abilities: [
					{
						type: MovementAbility.jumpOver
					}
				]
			}
		]
	};

	TrifleTiles[TrifleTileCodes.HermitCrab] = {
		types: [TileType.animal],
		deployTypes: [DeployType.temple],
		movements: [
			{
				type: MovementType.jumpShape,
				shapes: [
					{ distance: 2 },
					{ distance: 1 }
				],
				abilities: [
					{
						type: MovementAbility.jumpOver
					}
				]
			}
		]
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


};


