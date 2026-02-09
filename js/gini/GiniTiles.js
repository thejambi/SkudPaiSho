import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import {
  TrifleAbilityName,
  TrifleAbilityTriggerType,
  TrifleActivationRequirement,
  TrifleCaptureType,
  TrifleMovementDirection,
  TrifleMovementType,
  TriflePromptTargetType,
  TrifleTargetPromptId,
  TrifleTargetType,
  TrifleTileCategory,
  TrifleTileInfo,
  TrifleTileTeam,
} from '../trifle/TrifleTileInfo';
import { TrifleTileType } from '../trifle/TrifleTiles';
import { clearObject } from '../GameData';
import { setCurrentTileNames } from '../trifle/PaiShoGamesTileMetadata';

export var GiniTileCodes = {
	WhiteLotus: "L",
	Koi: "K",
	Badgermole: "B",
	Dragon: "D",
	Bison: "FB",
	Ginseng: "G",
	Water: "WA",
	Earth: "EA",
	Fire: "FI",
	Air: "AI"
};

export var GiniTileType = {
	mainTile: "mainTile",
	accentTile: "accentTile"
};

export var GiniTiles = {};
export var GiniTileInfo = {};

GiniTileInfo.initializeTrifleData = function() {
	GiniTileInfo.setTileNames();
	TrifleTileInfo.initializeTrifleData();
	GiniTileInfo.defineGiniTiles();
};

GiniTileInfo.setTileNames = function() {
	var tileNames = {};

	tileNames[GiniTileCodes.WhiteLotus] = "White Lotus";
	tileNames[GiniTileCodes.Bison] = "Sky Bison";
	tileNames[GiniTileCodes.Water] = "Water";
	tileNames[GiniTileCodes.Earth] = "Earth";
	tileNames[GiniTileCodes.Fire] = "Fire";
	tileNames[GiniTileCodes.Air] = "Air";

	setCurrentTileNames(tileNames);
};

GiniTileInfo.isAccentTile = function(tileCode) {
	return tileCode === GiniTileCodes.Water
		|| tileCode === GiniTileCodes.Earth
		|| tileCode === GiniTileCodes.Fire
		|| tileCode === GiniTileCodes.Air;
};

GiniTileInfo.defineGiniTiles = function() {
	clearObject(GiniTiles);

	/* === WHITE LOTUS === */
	GiniTiles[GiniTileCodes.WhiteLotus] = {
		available: true,
		types: [GiniTileCodes.WhiteLotus],
		movements: [
			{
				type: TrifleMovementType.jumpSurroundingTiles,
				jumpDirections: [TrifleMovementDirection.diagonal],
				targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy],
				distance: 99
			}
		],
		abilities: [],
		textLines: [
			"<strong>Movement</strong>",
			"- Moves by jumping over any tiles that are diagonal to it, creating a potential chain jump.",
			"",
			"<strong>Other</strong>",
			"- The White Lotus cannot do anything but move."
		]
	};

	/* === KOI === */
	GiniTiles[GiniTileCodes.Koi] = {
		available: true,
		types: [GiniTileType.mainTile],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 4
			}
		],
		abilities: [
			{
				title: "Trap Enemy Tiles",
				type: TrifleAbilityName.immobilizeTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsSurrounding,
						targetTeams: [TrifleTileTeam.enemy],
						targetTileTypes: [TrifleTileCategory.allTileTypes],
						activationRequirements: [
							{
								type: TrifleActivationRequirement.tileIsOnPointOfType,
								targetTileTypes: [TrifleTileCategory.thisTile],
								targetPointTypes: [WHITE]
							}
						]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"<strong>Movement</strong>",
			"- Moves up to 4 spaces.",
			"",
			"<strong>Ability</strong>",
			"- When touching a White Garden, the Koi traps all surrounding tiles that belong to your opponent."
		]
	};

	/* === BADGERMOLE === */
	GiniTiles[GiniTileCodes.Badgermole] = {
		available: true,
		types: [GiniTileType.mainTile],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 4
			}
		],
		abilities: [
			{
				title: "Badgermole Flip",
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
		],
		textLines: [
			"<strong>Movement</strong>",
			"- Moves up to 4 spaces.",
			"",
			"<strong>Ability</strong>",
			"- After moving, and if touching a White Garden, the Badgermole may flip one surrounding tile over itself."
		]
	};

	/* === DRAGON === */
	GiniTiles[GiniTileCodes.Dragon] = {
		available: true,
		types: [GiniTileType.mainTile],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 4
			}
		],
		abilities: [
			{
				title: "Dragon Push",
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
		],
		textLines: [
			"<strong>Movement</strong>",
			"- Moves up to 4 spaces.",
			"",
			"<strong>Ability</strong>",
			"- After moving, and if touching a Red Garden, the Dragon can push one surrounding tile 1 space away from itself."
		]
	};

	/* === SKY BISON === */
	GiniTiles[GiniTileCodes.Bison] = {
		available: true,
		types: [GiniTileType.mainTile],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 4
			}
		],
		abilities: [
			{
				title: "Grant Bonus Movement",
				type: TrifleAbilityName.grantBonusMovement,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsSurrounding,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileTypes: [TrifleTileCategory.allTileTypes],
						activationRequirements: [
							{
								type: TrifleActivationRequirement.tileIsOnPointOfType,
								targetTileTypes: [TrifleTileCategory.thisTile],
								targetPointTypes: [RED]
							}
						]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				bonusMovement: {
					type: TrifleMovementType.standard,
					distance: 1
				}
			}
		],
		textLines: [
			"<strong>Movement</strong>",
			"- Moves up to 4 spaces.",
			"",
			"<strong>Ability</strong>",
			"- When touching a Red Garden, all surrounding tiles that are yours gain +1 movement and the ability to move over other tiles (this does not apply to the White Lotus)."
		]
	};

	/* === GINSENG === */
	GiniTiles[GiniTileCodes.Ginseng] = {
		available: true,
		types: [GiniTileType.mainTile],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 4
			}
		],
		abilities: [
			{
				title: "Protect Friendly Tiles",
				type: TrifleAbilityName.cancelAbilitiesTargetingTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileTypes: [TrifleTileCategory.allTileTypes],
						lineOfSightDistance: 4
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"<strong>Movement</strong>",
			"- Moves up to 4 spaces.",
			"",
			"<strong>Ability</strong>",
			"- Any of your tiles in line of sight (up to 4 spaces) from the Ginseng are not affected from your opponent's tile abilities.",
			"- The Ginseng tile may capture Accent Tiles of both players. Once an Accent Tile is captured, return it to the owner's hand."
		]
	};

	/* === ACCENT TILES === */

	/* Water */
	GiniTiles[GiniTileCodes.Water] = {
		available: true,
		types: [GiniTileType.accentTile],
		movements: [],
		abilities: [
			{
				title: "Swap Surrounding Tiles",
				type: TrifleAbilityName.swapTwoSurroundingTiles,
				optional: true,
				excludeTileCode: GiniTileCodes.WhiteLotus,
				neededPromptTargetsInfo: [
					{
						title: "firstSwapTile",
						promptId: TrifleTargetPromptId.firstSwapTile,
						targetType: TriflePromptTargetType.boardPoint
					},
					{
						title: "secondSwapTile",
						promptId: TrifleTargetPromptId.secondSwapTile,
						targetType: TriflePromptTargetType.boardPoint
					}
				],
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenActiveMovement,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.surroundingTiles]
			}
		],
		textLines: [
			"<strong>Accent Tile</strong>",
			"- Place on any empty spot.",
			"- Then, swap the positions of two surrounding tiles of either player, excluding the White Lotus."
		]
	};

	/* Earth */
	GiniTiles[GiniTileCodes.Earth] = {
		available: true,
		types: [GiniTileType.accentTile],
		movements: [],
		abilities: [
			{
				title: "Rotate Surrounding Tiles",
				type: TrifleAbilityName.rotateSurroundingTilesClockwise,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenActiveMovement,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.surroundingTiles]
			}
		],
		textLines: [
			"<strong>Accent Tile</strong>",
			"- Place on any empty spot.",
			"- Then, rotate all surrounding tiles one space clockwise."
		]
	};

	/* Fire */
	GiniTiles[GiniTileCodes.Fire] = {
		available: true,
		types: [GiniTileType.accentTile],
		movements: [],
		abilities: [
			/* TODO: Phase 5 - place on any other tile, move that tile to surrounding spot */
		],
		textLines: [
			"<strong>Accent Tile</strong>",
			"- Place this tile on any other tile and then move that tile to a surrounding spot."
		]
	};

	/* Air */
	GiniTiles[GiniTileCodes.Air] = {
		available: true,
		types: [GiniTileType.accentTile],
		movements: [],
		abilities: [
			/* TODO: Phase 5 - swap with any tile, place exchanged tile anywhere */
		],
		textLines: [
			"<strong>Accent Tile</strong>",
			"- Swap your Air tile with any other tile (excluding the White Lotus), then place the exchanged tile on any free spot on the board."
		]
	};
};
