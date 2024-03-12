
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
	surroundingTiles: "surroundingTiles",
	chosenCapturedTile: "chosenCapturedTile"
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
	orthAndDiag: "orthAndDiag",
	jumpAlongLineOfSight: "jumpAlongLineOfSight",
	withinFriendlyTileZone: "withinFriendlyTileZone",
	anywhere: "anywhere",
	jumpShape: "jumpShape",
	travelShape: "travelShape",
	awayFromTargetTile: "awayFromTargetTile",
	awayFromTargetTileOrthogonal: "awayFromTargetTileOrthogonal",
	awayFromTargetTileDiagonal: "awayFromTargetTileDiagonal",
	jumpTargetTile: "jumpTargetTile",
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
	mustPreserveDirection: "mustPreserveDirection",
	restrictMovementOntoPoints: "restrictMovementOntoPoints",
	restrictMovementOntoRecordedTilePoint: "restrictMovementOntoRecordedTilePoint"
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
	extendMovement: "extendMovement",
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
	moveTargetTileToPile: "moveTargetTileToPile",
	exchangeWithCapturedTile: "exchangeWithCapturedTile"
};

Trifle.AbilityType = {
	all: "all",
	protection: "protection"
};

Trifle.AbilityCategory = {
	instant: "instant",
	ongoing: "ongoing"
};

Trifle.AbilitiesByCategory = {};
Trifle.AbilitiesByCategory[Trifle.AbilityCategory.instant] = [
	Trifle.AbilityName.captureTargetTiles,
	Trifle.AbilityName.moveTargetTile,
	Trifle.AbilityName.recordTilePoint,
	Trifle.AbilityName.moveTileToRecordedPoint,
	Trifle.AbilityName.moveTargetTileToPile,
	Trifle.AbilityName.exchangeWithCapturedTile
];

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
	whenActiveMovement: "whenActiveMovement",
	whenTargetTileLandsInTemple: "whenTargetTileLandsInTemple"
};

Trifle.PromptTargetType = {
	boardPoint: "boardPoint",
	tilePile: "tilePile",
	capturedTile: "capturedTile"
};

Trifle.TargetPromptId = {
	movedTilePoint: "movedTilePoint",
	movedTileDestinationPoint: "movedTileDestinationPoint",
	chosenCapturedTile: "chosenCapturedTile"
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

/* TODO Does not belong in 'TileInfo' space? */
Trifle.TileInfo.abilityIsCategory = function(abilityObject, abilityCategory) {
	return Trifle.AbilitiesByCategory[abilityCategory] 
		&& Trifle.AbilitiesByCategory[abilityCategory].includes(abilityObject.abilityType);
};

Trifle.TileInfo.initializeTrifleData = function() {
	Trifle.TileInfo.defineAbilitiesForAbilityTypes();
	Trifle.TileInfo.defineAbilityTypes();
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


Trifle.TileInfo.getReadableDescription = function(tileCode) {
	var tileHtml = "";

	var tileInfo = PaiShoGames.currentTileMetadata[tileCode];

	if (tileInfo.textLines && !debugOn) {
		tileInfo.textLines.forEach(function(textLine) {
			tileHtml += textLine + "<br />";
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
				tileHtml += "<br />";
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
			tileHtml += "<br />Zone Size: " + tileInfo.territorialZone.size;
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
				tileHtml += "<br />";
				/* tileHtml += "Ability: " + abilityInfo.type;

				abilityInfo.triggers.forEach(function(triggerInfo) {
					tileHtml += "<br />- Trigger: " + triggerInfo.triggerType;
					if (triggerInfo.targetTeams) tileHtml += "<br />-- Target Tiles: " + triggerInfo.targetTeams;
					if (triggerInfo.targetTileTypes) tileHtml += "<br />-- Target Tiles: " + triggerInfo.targetTileTypes;
					if (triggerInfo.targetTileIdentifiers) tileHtml += "<br />-- Target Tile Identifiers: " + triggerInfo.targetTileIdentifiers;
				});
				tileHtml += "<br />- Ability Target Types: " + abilityInfo.targetTypes;
				if (abilityInfo.targetTeams) tileHtml += "<br />-- Target Tiles: " + abilityInfo.targetTeams;
				if (abilityInfo.targetTileTypes) tileHtml += "<br />-- Target Tiles: " + abilityInfo.targetTileTypes; */

				tileHtml += Trifle.TileInfo.getObjectSummary("Ability", abilityInfo, 0);
			});
		}

		tileHtml += "<br />";
	} else {
		tileHtml = tileCode;
	}

	return tileHtml;
};

Trifle.TileInfo.getObjectSummary = function(origKey, theObject, indentDepth) {
	if (theObject instanceof Trifle.BoardPoint) {
		return "<br />" + origKey + ": (BoardPoint object)";
	}

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

