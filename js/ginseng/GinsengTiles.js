
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

Ginseng.TilePileNames = {
	banish: "banish"
};

Ginseng.GinsengTiles = {};
Ginseng.TileInfo = {};

Ginseng.TileInfo.initializeTrifleData = function() {
	Ginseng.TileInfo.setTileNames();

	Trifle.TileInfo.initializeTrifleData();

	Ginseng.TileInfo.defineGinsengTiles();
};

Ginseng.TileInfo.setTileNames = function() {
	/* Set tile names that do not match thier keys in TileCodes */
	var tileNames = {};

	tileNames[Ginseng.TileCodes.WhiteLotus] = "White Lotus";
	tileNames[Ginseng.TileCodes.Bison] = "Flying Bison";
	tileNames[Ginseng.TileCodes.LionTurtle] = "Lion Turtle";

	PaiShoGames.currentTileNames = tileNames;
};

Ginseng.TileInfo.defineGinsengTiles = function() {
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
			{
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
			},
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
				recordedPointType: Trifle.RecordTilePointType.startPoint
			}
		],
		textLines: [
			"<strong>Movement</strong>",
			"- Moves by jumping over any tiles that are diagonal to it. Can be continued as a chain.",
			"",
			"<strong>Ability</strong>",
			"- White Lotus cannot be captured when Ginseng is in harmony with it.",
			"",
			"<strong>Other</strong>",
			"- Cannot capture.",
			"- When your White Lotus is captured, it is returned to its starting point."
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
			},
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
			}
		],
		textLines: [
			"<em>Original Bender</em>",
			"",
			"<strong>Movement</strong>",
			"- Can move 5 spaces",
			"- Can capture any tile by movement.",
			"",
			"<strong>Ability</strong>",
			"- Traps all surrounding enemy tiles when it is touching either White Garden."
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
				type: Trifle.AbilityName.captureTargetTiles,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenLandsSurroundingTargetTile,
						targetTeams: [Trifle.TileTeam.enemy],
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
				triggerTypeToTarget: Trifle.AbilityTriggerType.whenLandsSurroundingTargetTile
			}
		],
		textLines: [
			"<em>Original Bender</em>",
			"",
			"<strong>Movement</strong>",
			"- Can move 5 spaces",
			"- Can capture any tile by movement.",
			"",
			"<strong>Ability</strong>",
			"- Captures all surrounding tiles when it is touching either Red Garden."
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
				type: Trifle.AbilityName.protectFromCapture,
				priority: 2,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsSurrounding,
						targetTeams: [Trifle.TileTeam.friendly],
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
			},
			{
				title: "Protect From Enemy Abilities",
				type: Trifle.AbilityName.cancelAbilitiesTargetingTiles,
				priority: 2,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whileTargetTileIsSurrounding,
						targetTeams: [Trifle.TileTeam.friendly],
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
				targetAbilityTypes: [Trifle.AbilityType.all],
				cancelAbilitiesFromTeam: Trifle.TileTeam.enemy
			}
		],
		textLines: [
			"<em>Original Bender</em>",
			"",
			"<strong>Movement</strong>",
			"- Can move 5 spaces",
			"- Can capture any tile by movement.",
			"",
			"<strong>Ability</strong>",
			"- Protects all surrounding friendly tiles when it is touching either White Garden"
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
						distance: 2,
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
			},
			{
				title: "Passive Bison Push",
				type: Trifle.AbilityName.moveTargetTile,
				// priority: ?,
				isPassiveMovement: true,
				optional: true,
				promptForTargets: true,
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
						triggerType: Trifle.AbilityTriggerType.whenTargetTileLandsSurrounding,
						targetTeams: [Trifle.TileTeam.friendly],
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
						targetTileTypes: [Trifle.TileCategory.allTileTypes]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				triggerTypeToTarget: Trifle.AbilityTriggerType.whenTargetTileLandsSurrounding,
				numberOfTargetTiles: 1,
				promptTargetTitle: "pushedTile",
				targetTileMovements: [
					{
						type: Trifle.MovementType.awayFromTargetTileOrthogonal,
						distance: 2,
						targetTileTypes: [Trifle.TileCategory.tileWithAbility]
					},
					{
						type: Trifle.MovementType.awayFromTargetTileDiagonal,
						distance: 1,
						targetTileTypes: [Trifle.TileCategory.tileWithAbility]
					}
				]
			}
		],
		textLines: [
			"<em>Original Bender</em>",
			"",
			"<strong>Movement</strong>",
			"- Can move 5 spaces",
			"- Can capture any tile by movement.",
			"",
			"<strong>Ability</strong>",
			"- Pushes a single surrounding tile in a straight line away from itself when it is touching either Red Garden.",
			"- If you move a tile to a point surrounding your Flying Bison, you may push that tile."
		]
	};

	GinsengTiles[Ginseng.TileCodes.LionTurtle] = {
		available: true,
		types: [Ginseng.TileCodes.LionTurtle],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 6,
				captureTypes: [
					{
						type: Trifle.CaptureType.allExcludingCertainTiles,
						excludedTileCodes: [Ginseng.TileCodes.LionTurtle]
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
						targetTileTypes: [Ginseng.TileType.originalBender]
					},
					{
						triggerType: Trifle.AbilityTriggerType.whenActiveMovement,
						targetTileTypes: [Trifle.TileCategory.thisTile]
					}
				],
				targetTypes: [Trifle.TargetType.triggerTargetTiles],
				triggerTypeToTarget: Trifle.AbilityTriggerType.whenLandsAdjacentToTargetTile
			}
		],
		textLines: [
			"<strong>Movement</strong>",
			"- Can move 6 spaces",
			"- Can capture any tile by movement except the opponent's Lion Turtle",
			"",
			"<strong>Ability</strong>",
			"- Captures all adjacent Original Benders."
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
			"<strong>Movement</strong>",
			"- Can move unlimited spaces in one direction on the horizontal or vertical lines.",
			"- Can capture any tile by movement."
		]
	};

	GinsengTiles[Ginseng.TileCodes.Ginseng] = {
		available: true,
		types: [Trifle.TileType.flower],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 6
			}
		],
		abilities: [
			{
				title: "Exchange With Captured Tile",
				type: Trifle.AbilityName.exchangeWithCapturedTile,
				optional: true,
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
			}
		],
		textLines: [
			"<strong>Movement</strong>",
			"- Can move 6 spaces",
			"- Cannot capture.",
			"",
			"<strong>Ability</strong>",
			"- White Lotus cannot be captured when Ginseng is in harmony with it.",
			"- May retrieve a captured tile by being exchanged at either the Eastern or Western Temples."
		]
	};

	GinsengTiles[Ginseng.TileCodes.Orchid] = {
		available: true,
		types: [Trifle.TileType.flower],
		movements: [
			{
				type: Trifle.MovementType.standard,
				distance: 6,
				captureTypes: [
					{
						type: Trifle.CaptureType.all
					}
				]
			}
		],
		abilities: [
			{
				type: Trifle.AbilityName.moveTargetTileToPile,
				destinationPile: Ginseng.TilePileNames.banish,
				triggers: [
					{
						triggerType: Trifle.AbilityTriggerType.whenCapturingTargetTile,
						targetTeams: [Trifle.TileTeam.enemy]
					},
					{
						triggerType: Trifle.AbilityTriggerType.whenActiveMovement
					}
				],
				targetTypes: [
					Trifle.TargetType.triggerTargetTiles,
					Trifle.TargetType.thisTile
				],
				triggerTypeToTarget: Trifle.AbilityTriggerType.whenCapturingTargetTile
			},
			{
				title: "Exchange With Captured Tile",
				type: Trifle.AbilityName.exchangeWithCapturedTile,
				optional: true,
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
			}
		],
		textLines: [
			"<strong>Movement</strong>",
			"- Can move 6 spaces",
			"- Unique Capture: Orchid banishes the tile it captures and itself. Banished tiles cannot be retrieved.",
			"- Cannot capture/banish the White Lotus.",
			"",
			"<strong>Ability</strong>",
			"- May retrieve a captured tile by being exchanged at either the Eastern or Western Temples."
		]
	};

	/* Apply Capture and Ability Activation Requirements Rules */
	Ginseng.applyCaptureAndAbilityActivationRequirementRules(GinsengTiles);

	Ginseng.GinsengTiles = GinsengTiles;
};

Ginseng.applyCaptureAndAbilityActivationRequirementRules = function(GinsengTiles) {
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

		if (tileInfo.abilities && tileInfo.abilities.length) {
			tileInfo.abilities.forEach(function(abilityInfo) {
				/* Add Ability Activation Requirement: Friendly Lotus Not In A Temple */
				if (abilityInfo.type !== Trifle.AbilityName.recordTilePoint 
						&& abilityInfo.triggers && abilityInfo.triggers.length) {
					abilityInfo.triggers.forEach(function(triggerInfo) {
						var triggerActivationRequirement = {
							type: Trifle.ActivationRequirement.tilesNotInTemple,
							targetTileCodes: [Ginseng.TileCodes.WhiteLotus],
							targetTeams: [Trifle.TileTeam.friendly]
						};
						if (triggerInfo.activationRequirements) {
							triggerInfo.activationRequirements.push(triggerActivationRequirement);
						} else {
							triggerInfo["activationRequirements"] = [triggerActivationRequirement];
						}
					});
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
			title: "Protect From Enemy Abilities While Temple",
			type: Trifle.AbilityName.cancelAbilitiesTargetingTiles,
			triggers: [
				{
					triggerType: Trifle.AbilityTriggerType.whileInsideTemple,
					targetTileTypes: [Trifle.TileCategory.thisTile]
				}
			],
			targetTypes: [Trifle.TargetType.triggerTargetTiles],
			targetAbilityTypes: [Trifle.AbilityType.all],
			cancelAbilitiesFromTeam: Trifle.TileTeam.enemy
		};
		tileInfo.abilities.push(protectFromCaptureWhileInTempleAbility);
		tileInfo.abilities.push(protectFromAbilitiesWhileInTempleAbility);
		// ------

	});
};
