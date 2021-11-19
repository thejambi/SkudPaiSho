
Ginseng.TileCodes = {
	WhiteLotus: "L",
	Koi: "K",
	Badgermole: "B",
	Dragon: "D",
	Bison: "FB",
	LionTurtle: "LT",
	Ginseng: "G",
	Orchid: "O",
	Wheel: "W"
};

Ginseng.TileType = {
	originalBender: "originalBender"
};

Ginseng.GinsengTiles = {};
Ginseng.TileInfo = {};

Ginseng.TileInfo.initializeTrifleData = function() {
	Trifle.TileInfo.initializeTrifleData();

	Ginseng.TileInfo.defineGinsengTiles();
};

Ginseng.TileInfo.defineGinsengTiles = function() {
	var GinsengTiles = {};

	GinsengTiles[Ginseng.TileCodes.WhiteLotus] = {
		available: true,
		movements: [
			{
				type: Trifle.MovementType.jumpSurroundingTiles,
				jumpDirections: [Trifle.MovementDirection.diagonal],
				targetTileTeams: [Trifle.TileTeam.friendly, Trifle.TileTeam.enemy],
				distance: 99
			}
		]
	};

	GinsengTiles[Ginseng.TileCodes.Koi] = {
		available: true,
		types: [Ginseng.TileType.originalBender],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		textLines: [
			"Koi | Original Bender"
		]
	};

	GinsengTiles[Ginseng.TileCodes.Dragon] = {
		available: true,
		types: [Ginseng.TileType.originalBender],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		textLines: [
			"Dragon | Original Bender"
		]
	};

	GinsengTiles[Ginseng.TileCodes.Badgermole] = {
		available: true,
		types: [Ginseng.TileType.originalBender],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		textLines: [
			"Badgermole | Original Bender"
		]
	};

	GinsengTiles[Ginseng.TileCodes.Bison] = {
		available: true,
		types: [Ginseng.TileType.originalBender],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		textLines: [
			"Bison | Original Bender"
		]
	};

	GinsengTiles[Ginseng.TileCodes.LionTurtle] = {
		available: true,
		types: [Ginseng.TileType.originalBender],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 6,
				captureTypes: [
					{
						type: Trifle.CaptureType.allExcludingCertainTiles,
						excludedTileCodes: [Ginseng.TileCodes.LionTurtle],
						activationRequirements: [
							{
								type: Trifle.ActivationRequirement.tilesNotInTemple,
								targetTileCodes: [Ginseng.TileCodes.WhiteLotus],
								targetTileTeams: [Trifle.TileTeam.friendly, Trifle.TileTeam.enemy]
							}
						]
					}
				],
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.captureTargetTiles,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenLandsAdjacentToTargetTile,
						targetTeams: [Trifle.TileTeam.enemy],
						targetTileTypes: [Ginseng.TileType.originalBender],
						activationRequirements: [
							{
								type: Trifle.ActivationRequirement.tilesNotInTemple,
								targetTileCodes: [Ginseng.TileCodes.WhiteLotus],
								targetTileTeams: [Trifle.TileTeam.friendly]
							}
						]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"Lion Turtle"
		]
	};

	GinsengTiles[Ginseng.TileCodes.Wheel] = {
		available: true,
		types: [Trifle.TileType.traveler],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		textLines: [
			"Wheel"
		]
	};

	GinsengTiles[Ginseng.TileCodes.Ginseng] = {
		available: true,
		types: [Trifle.TileType.flower],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		textLines: [
			"Ginseng"
		]
	};

	GinsengTiles[Ginseng.TileCodes.Orchid] = {
		available: true,
		types: [Trifle.TileType.flower],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [ Trifle.CaptureType.all ]
			}
		],
		textLines: [
			"Orchid"
		]
	};

	Ginseng.GinsengTiles = GinsengTiles;
};
