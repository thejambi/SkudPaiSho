/* Ginseng 2.0 Tiles */
import {
  DIAGONAL_BISON_ABILITY_TESTING,
  SWAP_BISON_AND_DRAGON_ABILITIES,
  gameOptionEnabled,
} from '../GameOptions';
import {
  GinsengTileCodes,
  GinsengTileType,
  GinsengTiles
} from './GinsengTiles';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import {
  TrifleAbilityName,
  TrifleAbilityTriggerType,
  TrifleAbilityType,
  TrifleActivationRequirement,
  TrifleCaptureType,
  TrifleMovementAbility,
  TrifleMovementDirection,
  TrifleMovementRestriction,
  TrifleMovementType,
  TriflePromptTargetType,
  TrifleRecordTilePointType,
  TrifleTargetPromptId,
  TrifleTargetType,
  TrifleTileCategory,
  TrifleTileTeam,
} from '../trifle/TrifleTileInfo';
import { TrifleTileType } from '../trifle/TrifleTiles';
import { clearObject } from '../GameData';

export function defineGinsengTilesV2() {
	// var GinsengTiles = {};
	clearObject(GinsengTiles);

	GinsengTiles[GinsengTileCodes.WhiteLotus] = {
		available: true,
		types: [GinsengTileCodes.WhiteLotus],
		movements: [
			{
				type: TrifleMovementType.jumpSurroundingTiles,
				jumpDirections: [TrifleMovementDirection.diagonal],
				targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy],
				distance: 99,
				restrictions: [
					{
						type: TrifleMovementRestriction.restrictMovementOntoRecordedTilePoint,
						recordTilePointType: TrifleRecordTilePointType.startPoint,
						targetTileCode: GinsengTileCodes.WhiteLotus,
						targetTeams: [TrifleTileTeam.enemy]
					}
				]
			}
		],
		abilities: [
			/* {
				title: "Harmony",
				type: TrifleAbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [TrifleTileTeam.friendly],
						targetTileCodes: [GinsengTileCodes.Ginseng]
					}
				],
				targetTypes: [TrifleTargetType.thisTile]
			}, */
			{
				title: "Remember Start Point",
				type: TrifleAbilityName.recordTilePoint,
				priority: 1,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenDeployed,
						targetTileTypes: [TrifleTileCategory.thisTile]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				recordTilePointType: TrifleRecordTilePointType.startPoint
			},
			{
				type: TrifleAbilityName.moveTileToRecordedPoint,
				priority: 1,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenCapturedByTargetTile,
						targetTileTypes: [TrifleTileCategory.allTileTypes]
					}
				],
				targetTypes: [TrifleTargetType.thisTile],
				recordedPointType: TrifleRecordTilePointType.startPoint,
				inevitable: true
			}
		],
		textLines: [
			"<strong>Movement Phase</strong>",
			"- Moves by jumping over any tiles that are diagonal to it. Can be continued as a chain.",
			"- Cannot capture.",
			"",
			"<strong>Effect Phase</strong>",
			"- None.",
			"",
			"<strong>Note</strong>",
			"- Capturing is only allowed when <strong>both</strong> White Lotus tiles are outside Temples.",
			"- When captured, White Lotus is returned to its Temple."
		]
	};

	GinsengTiles[GinsengTileCodes.Koi] = {
		available: true,
		types: [GinsengTileType.originalBender],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: TrifleCaptureType.all
					}
				]
			}
		],
		abilities: [
			{
				title: "Trap Enemy Tiles",
				type: TrifleAbilityName.immobilizeTiles,
				priority: 3,
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
			}/* ,
			{
				title: "Prevent Enemy Pushing Trapped Tiles",
				type: TrifleAbilityName.cancelAbilitiesTargetingTiles,
				priority: 3,
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
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				cancelAbilitiesFromTeam: TrifleTileTeam.enemy,
				cancelAbilitiesFromTileCodes: [GinsengTileCodes.Bison]
			} */
		],
		textLines: [
			"<strong>Movement Phase</strong>",
			"- Can move 5 spaces.",
			"- Can capture.",
			"",
			"<strong>Effect Phase (static ability)</strong>",
			"- Traps all surrounding enemy tiles when it is touching a White Garden."
		]
	};

	if (!gameOptionEnabled(SWAP_BISON_AND_DRAGON_ABILITIES)) {
		// Default ability
		GinsengTiles[GinsengTileCodes.Dragon] = {
			available: true,
			types: [GinsengTileType.originalBender],
			movements: [
				{
					type: TrifleMovementType.standard,
					distance: 5,
					captureTypes: [
						{
							type: TrifleCaptureType.all
						}
					]
				}
			],
			abilities: [
				{
					title: "Active Dragon Push",
					type: TrifleAbilityName.moveTargetTile,
					// priority: ?,
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
				"<strong>Movement Phase</strong>",
				"- Can move 5 spaces.",
				"- Can capture.",
				"",
				"<strong>Effect Phase (dynamic ability)</strong>",
				"- May push any one surrounding tile 1 space away from itself when it is touching a Red Garden."
			]
		};
	} else {
		// Swapped ability
		GinsengTiles[GinsengTileCodes.Dragon] = {
			available: true,
			types: [GinsengTileType.originalBender],
			movements: [
				{
					type: TrifleMovementType.standard,
					distance: 5,
					captureTypes: [
						{
							type: TrifleCaptureType.all
						}
					]
				}
			],
			abilities: [
				{
					type: TrifleAbilityName.extendMovement,
					extendMovementType: TrifleMovementType.standard,
					extendDistance: 1,
					triggers: [
						{
							triggerType: TrifleAbilityTriggerType.whileTargetTileIsSurrounding,
							targetTeams: [TrifleTileTeam.friendly],
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
					targetTeams: [TrifleTileTeam.friendly]
				}
			],
			textLines: [
				"<strong>Movement Phase</strong>",
				"- Can move 5 spaces.",
				"- Can capture.",
				"",
				"<strong>Effect Phase (static ability)</strong>",
				"- All surrounding friendly tiles are boosted with +1 movement when it is touching a Red Garden. <em>(does not affect White Lotus and Wheel)</em>"
			]
		};
	}

	GinsengTiles[GinsengTileCodes.Badgermole] = {
		available: true,
		types: [GinsengTileType.originalBender],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: TrifleCaptureType.all
					}
				]
			}
		],
		abilities: [
			{
				title: "Active Badgermole Flip",
				type: TrifleAbilityName.moveTargetTile,
				// priority: ?,
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
			"<strong>Movement Phase</strong>",
			"- Can move 5 spaces.",
			"- Can capture.",
			"",
			"<strong>Effect Phase (dynamic ability)</strong>",
			"- May move any one surrounding tile over itself when it is touching a White Garden."
		]
	};

	if (!gameOptionEnabled(SWAP_BISON_AND_DRAGON_ABILITIES)) {
		// Default ability
		GinsengTiles[GinsengTileCodes.Bison] = {
			available: true,
			types: [GinsengTileType.originalBender],
			movements: [
				{
					type: TrifleMovementType.standard,
					distance: 5,
					captureTypes: [
						{
							type: TrifleCaptureType.all
						}
					]
				}
			],
			abilities: [
				gameOptionEnabled(DIAGONAL_BISON_ABILITY_TESTING)
					? {
						type: TrifleAbilityName.manipulateExistingMovement,
						newMovementType: TrifleMovementType.diagonal,
						triggers: [
							{
								triggerType: TrifleAbilityTriggerType.whileTargetTileIsSurrounding,
								targetTeams: [TrifleTileTeam.friendly],
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
						targetTeams: [TrifleTileTeam.friendly]
					}
					: {
						type: TrifleAbilityName.extendMovement,
						extendMovementType: TrifleMovementType.standard,
						extendDistance: 1,
						triggers: [
							{
								triggerType: TrifleAbilityTriggerType.whileTargetTileIsSurrounding,
								targetTeams: [TrifleTileTeam.friendly],
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
						targetTeams: [TrifleTileTeam.friendly]
					}, 
					{
						type: TrifleAbilityName.manipulateExistingMovement,
						manipulateMovementType: TrifleMovementType.standard,
						newMovementAbilities: [
							{
								type: TrifleMovementAbility.jumpOver
							}
						],
						triggers: [
							{
								triggerType: TrifleAbilityTriggerType.whileTargetTileIsSurrounding,
								targetTeams: [TrifleTileTeam.friendly],
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
						targetTeams: [TrifleTileTeam.friendly],
						excludeTileCodes: [GinsengTileCodes.Wheel]
					}
			],
			textLines: [
				"<strong>Movement Phase</strong>",
				"- Can move 5 spaces.",
				"- Can capture.",
				"",
				"<strong>Effect Phase (static ability)</strong>",
				"- All surrounding friendly tiles are boosted with +1 movement when it is touching a Red Garden. <em>(does not affect White Lotus and Wheel)</em>"
			]
		};
	} else {
		// Swapped ability
		GinsengTiles[GinsengTileCodes.Bison] = {
			available: true,
			types: [GinsengTileType.originalBender],
			movements: [
				{
					type: TrifleMovementType.standard,
					distance: 5,
					captureTypes: [
						{
							type: TrifleCaptureType.all
						}
					]
				}
			],
			abilities: [
				{
					title: "Active Bison Push",
					type: TrifleAbilityName.moveTargetTile,
					// priority: ?,
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
				"<strong>Movement Phase</strong>",
				"- Can move 5 spaces.",
				"- Can capture.",
				"",
				"<strong>Effect Phase (dynamic ability)</strong>",
				"- May push any one surrounding tile 1 space away from itself when it is touching a Red Garden."
			]
		};
	}

	GinsengTiles[GinsengTileCodes.LionTurtle] = {
		available: true,
		types: [GinsengTileCodes.LionTurtle],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: TrifleCaptureType.all
					}
				],
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.cancelAbilities,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsSurrounding,
						targetTeams: [TrifleTileTeam.enemy],
						targetTileCodes: [TrifleTileCategory.allButThisTile]
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles],
				targetAbilityTypes: [TrifleAbilityType.all]
			}
		],
		textLines: [
			"<strong>Movement Phase</strong>",
			"- Can move 5 spaces.",
			"- Can capture.",
			"",
			"<strong>Effect Phase (static ability)</strong>",
			"- Removes all abilities of surrounding enemy tiles."
		]
	};

	GinsengTiles[GinsengTileCodes.Wheel] = {
		available: true,
		types: [TrifleTileType.traveler],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 99,
				captureTypes: [
					{
						type: TrifleCaptureType.all
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
			"<strong>Movement Phase</strong>",
			"- Can move unlimited spaces in one direction on the horizontal and vertical lines.",
			"- Can capture.",
			"",
			"<strong>Effect Phase</strong>",
			"- None."
		]
	};

	GinsengTiles[GinsengTileCodes.Ginseng] = {
		available: true,
		types: [TrifleTileType.flower],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 5
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [TrifleTileTeam.friendly],
						sightDistance: 5
					}
				],
				targetTypes: [TrifleTargetType.triggerTargetTiles]
			}
		],
		textLines: [
			"<strong>Movement Phase</strong>",
			"- Can move 5 spaces.",
			"- Cannot capture.",
			"",
			"<strong>Effect Phase (static ability)</strong>",
			"- Protects all friendly tiles from capture that are in line of sight. <em>(tiles in \"line of sight\" are tiles on the same line and with no tiles between them)</em>"
		]
	};

	GinsengTiles[GinsengTileCodes.Orchid] = {
		available: true,
		types: [TrifleTileType.flower],
		movements: [
			{
				type: TrifleMovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: TrifleCaptureType.all
					}
				]
			}
		],
		abilities: [
			{
				type: TrifleAbilityName.captureTargetTiles,
				triggers: [
					{
						triggerType: TrifleAbilityTriggerType.whenCapturingTargetTile,
						targetTileTypes: [TrifleTileCategory.allTileTypes]
					}
				],
				targetTypes: [TrifleTargetType.thisTile],
				regardlessOfCaptureProtection: true
			}
		],
		textLines: [
			"<strong>Movement Phase</strong>",
			"- Can move 5 spaces.",
			"- Can capture.",
			"",
			"<strong>Effect Phase (dynamic ability)</strong>",
			"- When Orchid captures a tile, it also captures itself. <em>(ie, it is also removed from the board)</em>"
		]
	};

	/* Apply Capture and Ability Activation Requirements Rules */
	applyCaptureAndAbilityActivationRequirementRulesV2(GinsengTiles);
}

function applyCaptureAndAbilityActivationRequirementRulesV2(GinsengTiles) {
	Object.keys(GinsengTiles).forEach(function(key, index) {
		var tileInfo = GinsengTiles[key];
		if (tileInfo.movements && tileInfo.movements.length) {
			tileInfo.movements.forEach(function(movementInfo) {
				/* Add Capture-By-Movement Activation Requirement: Both Lotus Tiles Are Not In Temple */
				if (movementInfo.captureTypes && movementInfo.captureTypes.length) {
					movementInfo.captureTypes.forEach(function(captureTypeInfo) {
						var activationRequirement = {
							type: TrifleActivationRequirement.tilesNotInTemple,
							targetTileCodes: [GinsengTileCodes.WhiteLotus],
							targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy]
						};
						if (captureTypeInfo.activationRequirements) {
							captureTypeInfo.activationRequirements.push(activationRequirement);
						} else {
							captureTypeInfo["activationRequirements"] = [activationRequirement];
						}
					});
				}

				/* Add Movement Restriction For All Tiles Except Lotus: 
				 * Cannot Move Onto Any Lotus Starting Point
				 */
				if (!tileInfo.types.includes(GinsengTileCodes.WhiteLotus)) {
					var movementRestriction = {
						type: TrifleMovementRestriction.restrictMovementOntoRecordedTilePoint,
						recordTilePointType: TrifleRecordTilePointType.startPoint,
						targetTileCode: GinsengTileCodes.WhiteLotus,
						targetTeams: [TrifleTileTeam.friendly, TrifleTileTeam.enemy]
					};
					if (movementInfo.restrictions) {
						movementInfo.restrictions.push(movementRestriction);
					} else {
						movementInfo["restrictions"] = [movementRestriction];
					}
				}
			});
		}

		/* Add Ability: Protect Tiles While In A Temple */
		if (!tileInfo.abilities) {
			tileInfo.abilities = [];
		}
		var protectFromCaptureWhileInTempleAbility = {
			title: "Protect From Capture While In Temple",
			type: TrifleAbilityName.protectFromCapture,
			triggers: [
				{
					triggerType: TrifleAbilityTriggerType.whileInsideTemple,
					targetTileTypes: [TrifleTileCategory.thisTile]
				}
			],
			targetTypes: [TrifleTargetType.triggerTargetTiles],
			inevitable: true
		};
		/* var protectFromAbilitiesWhileInTempleAbility = {
			title: "Protect From Abilities While In Temple",
			type: TrifleAbilityName.cancelAbilitiesTargetingTiles,
			triggers: [
				{
					triggerType: TrifleAbilityTriggerType.whileInsideTemple,
					targetTileTypes: [TrifleTileCategory.thisTile]
				}
			],
			targetTypes: [TrifleTargetType.triggerTargetTiles],
			targetAbilityTypes: [TrifleAbilityType.all]
		}; */
		/* var protectFromFriendlyPushAbilitiesWhileInTempleAbility = {
			title: "Protect From Friendly Push Abilities While In Temple",
			type: TrifleAbilityName.cancelAbilitiesTargetingTiles,
			triggers: [
				{
					triggerType: TrifleAbilityTriggerType.whileInsideTemple,
					targetTileTypes: [TrifleTileCategory.thisTile]
				}
			],
			targetTypes: [TrifleTargetType.triggerTargetTiles],
			targetAbilityTypes: [TrifleAbilityName.moveTargetTile],
			cancelAbilitiesFromTeam: TrifleTileTeam.friendly
		}; */
		var exchangeForCapturedTileIntempleAbility = {
			title: "Exchange With Captured Tile",
			type: TrifleAbilityName.exchangeWithCapturedTile,
			optional: true,
			inevitable: true,
			neededPromptTargetsInfo: [
				{
					title: "exchangedTile",
					promptId: TrifleTargetPromptId.chosenCapturedTile,
					targetType: TriflePromptTargetType.capturedTile
				}
			],
			triggers: [
				{
					triggerType: TrifleAbilityTriggerType.whenTargetTileLandsInTemple,
					targetTileTypes: [TrifleTileCategory.thisTile]
				},
				{
					triggerType: TrifleAbilityTriggerType.whenActiveMovement,
					targetTileTypes: [TrifleTileCategory.thisTile]
				}
			],
			targetTypes: [TrifleTargetType.chosenCapturedTile],
			targetTeams: [TrifleTileTeam.friendly],
			promptTargetTitle: "exchangedTile"
		};
		tileInfo.abilities.push(protectFromCaptureWhileInTempleAbility);
		//tileInfo.abilities.push(protectFromAbilitiesWhileInTempleAbility);	// Removing 6/5/24 per Gyatso
		// tileInfo.abilities.push(protectFromFriendlyPushAbilitiesWhileInTempleAbility);
		if (key !== GinsengTileCodes.WhiteLotus) {
			tileInfo.abilities.push(exchangeForCapturedTileIntempleAbility);
		}

	});
}
