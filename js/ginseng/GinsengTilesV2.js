/* Ginseng 2.0 Tiles */

Ginseng.TileInfo.defineGinsengTilesV2 = function() {
	var GinsengTiles = {};

	GinsengTiles[Ginseng.TileCodes.WhiteLotus] = {
		available: true,
		types: [Ginseng.TileCodes.WhiteLotus],
		movements: [
			{
				type: Trifle.MovementType.jumpSurroundingTiles,
				jumpDirections: [Trifle.MovementDirection.diagonal],
				targetTeams: [Trifle.TileTeam.friendly, Trifle.TileTeam.enemy],
				distance: 99,
				restrictions: [
					{
						type: Trifle.MovementRestriction.restrictMovementOntoRecordedTilePoint,
						recordTilePointType: Trifle.RecordTilePointType.startPoint,
						targetTileCode: Ginseng.TileCodes.WhiteLotus,
						targetTeams: [Trifle.TileTeam.enemy]
					}
				]
			}
		],
		abilities: [
			/* {
				title: "Harmony",
				type: Trifle.AbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [Trifle.TileTeam.friendly],
						targetTileCodes: [Ginseng.TileCodes.Ginseng]
					}
				],
				targetTypes: [Trifle.TargetType.thisTile]
			}, */
			{
				title: "Remember Start Point",
				type: Trifle.AbilityName.recordTilePoint,
				priority: 1,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenDeployed,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				recordTilePointType: Trifle.RecordTilePointType.startPoint
			},
			{
				type: Trifle.AbilityName.moveTileToRecordedPoint,
				priority: 1,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenCapturedByTargetTile,
						targetTileTypes: [Trifle.TileCategory.allTileTypes]
					}
				],
				targetTypes: [Trifle.TargetType.thisTile],
				recordedPointType: Trifle.RecordTilePointType.startPoint,
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

	GinsengTiles[Ginseng.TileCodes.Koi] = {
		available: true,
		types: [Ginseng.TileType.originalBender],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: Trifle.CaptureType.all
					}
				]
			}
		],
		abilities: [
			{
				title: "Trap Enemy Tiles",
				type: Trifle.AbilityName.immobilizeTiles,
				priority: 3,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsSurrounding,
						targetTeams: [Trifle.TileTeam.enemy],
						targetTileTypes: [Trifle.TileCategory.allTileTypes],
						activationRequirements: [
							{
								type: Trifle.ActivationRequirement.tileIsOnPointOfType,
								targetTileTypes: [Trifle.TileCategory.thisTile],
								targetPointTypes: [WHITE]
							}
						]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
			}/* ,
			{
				title: "Prevent Enemy Pushing Trapped Tiles",
				type: Trifle.AbilityName.cancelAbilitiesTargetingTiles,
				priority: 3,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsSurrounding,
						targetTeams: [Trifle.TileTeam.enemy],
						targetTileTypes: [Trifle.TileCategory.allTileTypes],
						activationRequirements: [
							{
								type: Trifle.ActivationRequirement.tileIsOnPointOfType,
								targetTileTypes: [Trifle.TileCategory.thisTile],
								targetPointTypes: [WHITE]
							}
						]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				cancelAbilitiesFromTeam: Trifle.TileTeam.enemy,
				cancelAbilitiesFromTileCodes: [Ginseng.TileCodes.Bison]
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

	GinsengTiles[Ginseng.TileCodes.Dragon] = {
		available: true,
		types: [Ginseng.TileType.originalBender],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: Trifle.CaptureType.all
					}
				]
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.extendMovement,
				extendMovementType: Trifle.MovementType.standard,
				extendDistance: 1,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsSurrounding,
						targetTeams: [Trifle.TileTeam.friendly],
						activationRequirements: [
							{
								type: Trifle.ActivationRequirement.tileIsOnPointOfType,
								targetTileTypes: [Trifle.TileCategory.thisTile],
								targetPointTypes: [RED]
							}
						]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				targetTeams: [Trifle.TileTeam.friendly]
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

	GinsengTiles[Ginseng.TileCodes.Badgermole] = {
		available: true,
		types: [Ginseng.TileType.originalBender],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: Trifle.CaptureType.all
					}
				]
			}
		],
		abilities: [
			{
				title: "Active Badgermole Flip",
				type: Trifle.AbilityName.moveTargetTile,
				// priority: ?,
				isPassiveMovement: true,
				optional: true,
				neededPromptTargetsInfo: [
					{
						title: "flippedTile",
						promptId: Trifle.TargetPromptId.movedTilePoint,
						targetType: Trifle.PromptTargetType.boardPoint
					},
					{
						title: "flipLanding",
						promptId: Trifle.TargetPromptId.movedTileDestinationPoint,
						targetType: Trifle.PromptTargetType.boardPoint
					}
				],
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenLandsSurroundingTargetTile,
						targetTileTypes: [Trifle.TileCategory.allTileTypes],
						activationRequirements: [
							{
								type: Trifle.ActivationRequirement.tileIsOnPointOfType,
								targetTileTypes: [Trifle.TileCategory.thisTile],
								targetPointTypes: [WHITE]
							}
						]
					},
					{
						triggerType: Trifle.AbilityTriggerType.whenActiveMovement,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				triggerTypeToTarget: Trifle.AbilityTriggerType.whenLandsSurroundingTargetTile,
				numberOfTargetTiles: 1,
				promptTargetTitle: "flippedTile",
				targetTileMovements: [
					{
						type: Trifle.MovementType.jumpTargetTile,
						distance: 1,
						targetTileTypes: [Trifle.TileCategory.tileWithAbility],
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

	GinsengTiles[Ginseng.TileCodes.Bison] = {
		available: true,
		types: [Ginseng.TileType.originalBender],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: Trifle.CaptureType.all
					}
				]
			}
		],
		abilities: [
			{
				title: "Active Bison Push",
				type: Trifle.AbilityName.moveTargetTile,
				// priority: ?,
				isPassiveMovement: true,
				optional: true,
				neededPromptTargetsInfo: [
					{
						title: "pushedTile",
						promptId: Trifle.TargetPromptId.movedTilePoint,
						targetType: Trifle.PromptTargetType.boardPoint
					},
					{
						title: "pushLanding",
						promptId: Trifle.TargetPromptId.movedTileDestinationPoint,
						targetType: Trifle.PromptTargetType.boardPoint
					}
				],
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenLandsSurroundingTargetTile,
						targetTileTypes: [Trifle.TileCategory.allTileTypes],
						activationRequirements: [
							{
								type: Trifle.ActivationRequirement.tileIsOnPointOfType,
								targetTileTypes: [Trifle.TileCategory.thisTile],
								targetPointTypes: [RED]
							}
						]
					},
					{
						triggerType: Trifle.AbilityTriggerType.whenActiveMovement,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				triggerTypeToTarget: Trifle.AbilityTriggerType.whenLandsSurroundingTargetTile,
				numberOfTargetTiles: 1,
				promptTargetTitle: "pushedTile",
				targetTileMovements: [
					{
						type: Trifle.MovementType.awayFromTargetTileOrthogonal,
						distance: 1,
						targetTileTypes: [Trifle.TileCategory.tileWithAbility],
						regardlessOfImmobilization: true
					},
					{
						type: Trifle.MovementType.awayFromTargetTileDiagonal,
						distance: 1,
						targetTileTypes: [Trifle.TileCategory.tileWithAbility],
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

	GinsengTiles[Ginseng.TileCodes.LionTurtle] = {
		available: true,
		types: [Ginseng.TileCodes.LionTurtle],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: Trifle.CaptureType.all
					}
				],
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.cancelAbilities,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsSurrounding,
						targetTeams: [Trifle.TileTeam.enemy],
						targetTileCodes: [Trifle.TileCategory.allButThisTile]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				targetAbilityTypes: [Trifle.AbilityType.all]
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

	GinsengTiles[Ginseng.TileCodes.Wheel] = {
		available: true,
		types: [Trifle.TileType.traveler],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 99,
				captureTypes: [
					{
						type: Trifle.CaptureType.all
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
			"<strong>Movement Phase</strong>",
			"- Can move unlimited spaces in one direction on the horizontal and vertical lines.",
			"- Can capture.",
			"",
			"<strong>Effect Phase</strong>",
			"- None."
		]
	};

	GinsengTiles[Ginseng.TileCodes.Ginseng] = {
		available: true,
		types: [Trifle.TileType.flower],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.protectFromCapture,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsInLineOfSight,
						targetTeams: [Trifle.TileTeam.friendly]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles]
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

	GinsengTiles[Ginseng.TileCodes.Orchid] = {
		available: true,
		types: [Trifle.TileType.flower],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 5,
				captureTypes: [
					{
						type: Trifle.CaptureType.all
					}
				]
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.captureTargetTiles,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenCapturingTargetTile,
						targetTileTypes: [Trifle.TileCategory.allTileTypes]
					}
				],
				targetTypes: [Trifle.TargetType.thisTile],
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
	Ginseng.applyCaptureAndAbilityActivationRequirementRulesV2(GinsengTiles);

	Ginseng.GinsengTiles = GinsengTiles;
};

Ginseng.applyCaptureAndAbilityActivationRequirementRulesV2 = function(GinsengTiles) {
	Object.keys(GinsengTiles).forEach(function(key, index) {
		var tileInfo = GinsengTiles[key];
		if (tileInfo.movements && tileInfo.movements.length) {
			tileInfo.movements.forEach(function(movementInfo) {
				/* Add Capture-By-Movement Activation Requirement: Both Lotus Tiles Are Not In Temple */
				if (movementInfo.captureTypes && movementInfo.captureTypes.length) {
					movementInfo.captureTypes.forEach(function(captureTypeInfo) {
						var activationRequirement = {
							type: Trifle.ActivationRequirement.tilesNotInTemple,
							targetTileCodes: [Ginseng.TileCodes.WhiteLotus],
							targetTeams: [Trifle.TileTeam.friendly, Trifle.TileTeam.enemy]
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
				if (!tileInfo.types.includes(Ginseng.TileCodes.WhiteLotus)) {
					var movementRestriction = {
						type: Trifle.MovementRestriction.restrictMovementOntoRecordedTilePoint,
						recordTilePointType: Trifle.RecordTilePointType.startPoint,
						targetTileCode: Ginseng.TileCodes.WhiteLotus,
						targetTeams: [Trifle.TileTeam.friendly, Trifle.TileTeam.enemy]
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
			type: Trifle.AbilityName.protectFromCapture,
			triggers: [
				{
					triggerType: Trifle.AbilityTriggerType.whileInsideTemple,
					targetTileTypes: [Trifle.TileCategory.thisTile]
				}
			],
			targetTypes: [Trifle.TargetType.triggerTargetTiles]
		};
		var protectFromAbilitiesWhileInTempleAbility = {
			title: "Protect From Abilities While In Temple",
			type: Trifle.AbilityName.cancelAbilitiesTargetingTiles,
			triggers: [
				{
					triggerType: Trifle.AbilityTriggerType.whileInsideTemple,
					targetTileTypes: [Trifle.TileCategory.thisTile]
				}
			],
			targetTypes: [Trifle.TargetType.triggerTargetTiles],
			targetAbilityTypes: [Trifle.AbilityType.all]
		};
		/* var protectFromFriendlyPushAbilitiesWhileInTempleAbility = {
			title: "Protect From Friendly Push Abilities While In Temple",
			type: Trifle.AbilityName.cancelAbilitiesTargetingTiles,
			triggers: [
				{
					triggerType: Trifle.AbilityTriggerType.whileInsideTemple,
					targetTileTypes: [Trifle.TileCategory.thisTile]
				}
			],
			targetTypes: [Trifle.TargetType.triggerTargetTiles],
			targetAbilityTypes: [Trifle.AbilityName.moveTargetTile],
			cancelAbilitiesFromTeam: Trifle.TileTeam.friendly
		}; */
		var exchangeForCapturedTileIntempleAbility = {
			title: "Exchange With Captured Tile",
			type: Trifle.AbilityName.exchangeWithCapturedTile,
			optional: true,
			inevitable: true,
			neededPromptTargetsInfo: [
				{
					title: "exchangedTile",
					promptId: Trifle.TargetPromptId.chosenCapturedTile,
					targetType: Trifle.PromptTargetType.capturedTile
				}
			],
			triggers: [
				{
					triggerType: Trifle.AbilityTriggerType.whenTargetTileLandsInTemple,
					targetTileTypes: [Trifle.TileCategory.thisTile]
				},
				{
					triggerType: Trifle.AbilityTriggerType.whenActiveMovement,
					targetTileTypes: [Trifle.TileCategory.thisTile]
				}
			],
			targetTypes: [Trifle.TargetType.chosenCapturedTile],
			targetTeams: [Trifle.TileTeam.friendly],
			promptTargetTitle: "exchangedTile"
		};
		tileInfo.abilities.push(protectFromCaptureWhileInTempleAbility);
		tileInfo.abilities.push(protectFromAbilitiesWhileInTempleAbility);
		// tileInfo.abilities.push(protectFromFriendlyPushAbilitiesWhileInTempleAbility);
		if (key !== Ginseng.TileCodes.WhiteLotus) {
			tileInfo.abilities.push(exchangeForCapturedTileIntempleAbility);
		}

	});
};
