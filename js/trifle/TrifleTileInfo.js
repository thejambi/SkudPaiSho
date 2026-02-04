
import { TrifleBoardPoint } from './TrifleBoardPoint';
import { TrifleTileType } from './TrifleTiles';
import { debugOn } from '../GameData';
import { getCurrentTileMetadata } from './PaiShoGamesTileMetadata';

export const TrifleTileCategory = {
	thisTile: "thisTile",
	allButThisTile: "allButThisTile",
	allTileTypes: "allTileTypes",
	landingTile: "landingTile",
	surroundingTiles: "surroundingTiles",
	tileWithAbility: "tileWithAbility"
};

export const TrifleTargetType = {
	thisTile: "thisTile",			// 
	allTileTypes: "allTileTypes",	//
	landingTile: "landingTile",		//
	allTiles: "allTiles",
	triggerTargetTiles: "triggerTargetTiles",
	surroundingTiles: "surroundingTiles",
	adjacentTiles: "adjacentTiles",
	chosenCapturedTile: "chosenCapturedTile"
}

export const TrifleDeployType = {
	anywhere: "anywhere",
	temple: "temple",
	adjacentToTemple: "adjacentToTemple"
};

export const TrifleSpecialDeployType = {
	withinFriendlyTileZone: "withinFriendlyTileZone"
};

export const TrifleMovementType = {
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

export const TrifleMovementDirection = {
	orthogonal: "orthogonal",
	diagonal: "diagonal"
};

export const TrifleMovementRestriction = {
	// restrictedByOpponentTileZones: "restrictedByOpponentTileZones",
	// immobilizedByAdjacentOpponentTile: "immobilizedByAdjacentOpponentTile", // unused
	// immobilizedByOpponentTileZones: "immobilizedByOpponentTileZones",
	mustPreserveDirection: "mustPreserveDirection",
	restrictMovementOntoPoints: "restrictMovementOntoPoints",
	restrictMovementOntoRecordedTilePoint: "restrictMovementOntoRecordedTilePoint"
};

export const TrifleMovementAbility = {
	// carry: "carry", // For future
	jumpOver: "jumpOver",
	chargeCapture: "chargeCapture"
};

export const TrifleMoveDirection = {
	any: "any",	/* Any direction starts movement */
	straight: "straight",
	turn: "turn",
	left: "left",
	right: "right"
}

export const TrifleCaptureType = {
	none: "none",
	all: "all",
	tilesTargetedByAbility: "tilesTargetedByAbility",
	allExcludingCertainTiles: "allExcludingCertainTiles"
};

export const TrifleActivationRequirement = {
	tilesNotInTemple: "tilesNotInTemple",
	tileIsOnPointOfType: "tileIsOnPointOfType"
};

export const TrifleZoneAbility = {
	canceledWhenInTemple: "canceledWhenInTemple", // Note: Too specific, how to split up to *dynamicize*?
	protectFriendlyTilesFromCapture: "protectFriendlyTilesFromCapture", // Too specific, can be ProtectTilesFromCapture and have a target tiles metadata
	// immobilizesOpponentTiles: "immobilizesOpponentTiles", // Outdated, replaced by ImmobilizesTiles
	immobilizesTiles: "immobilizesTiles",
	removesTileAbilities: "removesTileAbilities",
	restrictMovementWithinZone: "restrictMovementWithinZone",
	captureLandingTiles: "captureLandingTiles" // unused?
}

export const TrifleBoardPresenceAbility = {
	increaseFriendlyTileMovementDistance: "increaseFriendlyTileMovementDistance",	// TODO replace with Ability.grantBonusMovement
	// spawnAdditionalCopies: "spawnAdditionalCopies",	// TODO,
	canBeCapturedByFriendlyTiles: "canBeCapturedByFriendlyTiles",
	drawTilesInLineOfSight: "drawTilesInLineOfSight"
	// captureProtection: "captureProtection"
}

export const TrifleSpawnLocation = {
	adjacent: "adjacent"
};

export const TrifleAttributeType = {
	gigantic: "gigantic"
}

export const TrifleAbilityName = {
	captureTargetTiles: "captureTargetTiles",
	removeEffects: "removeEffects",
	protectFromCapture: "protectFromCapture",
	grantBonusMovement: "grantBonusMovement",
	manipulateExistingMovement: "manipulateExistingMovement",
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
	exchangeWithCapturedTile: "exchangeWithCapturedTile",
	enlargeZone: "enlargeZone",
	setMovementDistance: "setMovementDistance",
	requireDeployInZone: "requireDeployInZone",
	restrictDeploymentInZone: "restrictDeploymentInZone",
	resurrectAtDeployPosition: "resurrectAtDeployPosition",
	substituteForCapture: "substituteForCapture",
	restrictTileFromCapturing: "restrictTileFromCapturing"
};

export const TrifleAbilityType = {
	all: "all",
	protection: "protection"
};

export const TrifleAbilityCategory = {
	instant: "instant",
	ongoing: "ongoing"
};

export const TrifleAbilitiesByCategory = {};
TrifleAbilitiesByCategory[TrifleAbilityCategory.instant] = [
	TrifleAbilityName.captureTargetTiles,
	TrifleAbilityName.moveTargetTile,
	TrifleAbilityName.recordTilePoint,
	TrifleAbilityName.moveTileToRecordedPoint,
	TrifleAbilityName.moveTargetTileToPile,
	TrifleAbilityName.exchangeWithCapturedTile
];

export const TrifleAbilityPriorityLevel = {
	highest: "highest"
};

export const TrifleAbilityTriggerType = {
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
	whileTargetTileIsWithinDistance: "whileTargetTileIsWithinDistance",
	whenLandsAdjacentToTargetTile: "whenLandsAdjacentToTargetTile",
	whenLandsSurroundingTargetTile: "whenLandsSurroundingTargetTile",
	whenTargetTileLandsAdjacent: "whenTargetTileLandsAdjacent",
	whenTargetTileLandsSurrounding: "whenTargetTileLandsSurrounding",
	whileTargetTileIsInZone: "whileTargetTileIsInZone",
	whenDeployed: "whenDeployed",
	whenActiveMovement: "whenActiveMovement",
	whenTargetTileLandsInTemple: "whenTargetTileLandsInTemple",
	whenAdjacentFriendlyTileIsCaptured: "whenAdjacentFriendlyTileIsCaptured",
	whileTargetTileIsNotOnBoard: "whileTargetTileIsNotOnBoard"
};

export const TriflePromptTargetType = {
	boardPoint: "boardPoint",
	tilePile: "tilePile",
	capturedTile: "capturedTile"
};

export const TrifleTargetPromptId = {
	movedTilePoint: "movedTilePoint",
	movedTileDestinationPoint: "movedTileDestinationPoint",
	chosenCapturedTile: "chosenCapturedTile"
};

export const TrifleTileTeam = {
	friendly: "friendly",
	enemy: "enemy"
};

export const TrifleRecordTilePointType = {
	startPoint: "startPoint"
};

export let TrifleAbilitiesForType = {};

export let TrifleAbilityTypes = {};

export const TrifleTiles = {};

export const TrifleTileInfo = {};

TrifleTileInfo.tileIsBanner = function(tileInfo) {
	return tileInfo && tileInfo.types && tileInfo.types.includes(TrifleTileType.banner);
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
			if (movementRestriction.type === TrifleMovementRestriction.mustPreserveDirection) {
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

// TrifleTileInfo.tileHasDrawTilesInLineOfSightAbility = function(tileInfo) {
// 	return TrifleTileInfo.tileHasBoardPresenceAbility(tileInfo, TrifleBoardPresenceAbility.drawTilesInLineOfSight);
// };

TrifleTileInfo.tileCanBeCapturedByFriendlyTiles = function(tileInfo) {
	return TrifleTileInfo.tileHasBoardPresenceAbility(tileInfo, TrifleBoardPresenceAbility.canBeCapturedByFriendlyTiles);
};

TrifleTileInfo.tileHasOnlyOneMovement = function(tileInfo) {
	return tileInfo && tileInfo.movements && tileInfo.movements.length === 1;
};

TrifleTileInfo.tileHasMovementAbility = function(tileInfo, targetMovementAbilityType) {
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

TrifleTileInfo.tileHasAbilityTrigger = function(tileInfo, abilityTrigger) {
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

TrifleTileInfo.getAbilitiesWithAbilityTrigger = function(tileInfo, abilityTrigger) {
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

TrifleTileInfo.getZoneAbilitiesWithAbilityTrigger = function(tileInfo, abilityTrigger) {
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

TrifleTileInfo.tileAbilityIsTriggeredWhenCaptured = function(tileAbilityInfo) {
	var isTriggeredWhenCaptured = false;
	if (tileAbilityInfo.triggers) {
		tileAbilityInfo.triggers.forEach(function(triggerInfo) {
			if (triggerInfo.triggerType === TrifleAbilityTriggerType.whenCapturedByTargetTile) {
				isTriggeredWhenCaptured = true;
			}
		});
	}
	return isTriggeredWhenCaptured;
};

/* TODO Does not belong in 'TileInfo' space? */
TrifleTileInfo.abilityIsCategory = function(abilityObject, abilityCategory) {
	return TrifleAbilitiesByCategory[abilityCategory] 
		&& TrifleAbilitiesByCategory[abilityCategory].includes(abilityObject.abilityType);
};

TrifleTileInfo.initializeTrifleData = function() {
	TrifleTileInfo.defineAbilitiesForAbilityTypes();
	TrifleTileInfo.defineAbilityTypes();
};

TrifleTileInfo.defineAbilitiesForAbilityTypes = function () {
	TrifleAbilitiesForType = {};

	TrifleAbilitiesForType[TrifleAbilityType.protection] = [
		TrifleZoneAbility.protectFriendlyTilesFromCapture,
		TrifleAbilityName.protectFromCapture
	];
};

TrifleTileInfo.defineAbilityTypes = function () {
	TrifleAbilityTypes = {};

	TrifleAbilityTypes[TrifleZoneAbility.protectFriendlyTilesFromCapture] = [
		TrifleAbilityType.protection
	];

	TrifleAbilityTypes[TrifleAbilityName.protectFromCapture] = [
		TrifleAbilityType.protection
	];
};


TrifleTileInfo.getReadableDescription = function(tileCode, boardTile, abilityManager) {
	var tileHtml = "";

	var tileInfo = getCurrentTileMetadata()[tileCode];

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
					tileHtml += TrifleTileInfo.getObjectSummary("Capturing Properties", movementInfo.captureTypes, 0);
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

				tileHtml += TrifleTileInfo.getObjectSummary("Ability", abilityInfo, 0);
			});
		}

		tileHtml += "<br />";
	} else {
		tileHtml = tileCode;
	}

	// Debug: Show active abilities when debugOn is true
	if (debugOn && boardTile && abilityManager) {
		tileHtml += TrifleTileInfo.getActiveAbilitiesDebugInfo(boardTile, abilityManager);
	}

	return tileHtml;
};

TrifleTileInfo.getActiveAbilitiesDebugInfo = function(boardTile, abilityManager) {
	var debugHtml = "";

	if (!abilityManager || !abilityManager.abilities || !boardTile) {
		return debugHtml;
	}

	// Find abilities where this tile is the source
	var abilitiesFromTile = [];
	// Find abilities targeting this tile
	var abilitiesTargetingTile = [];

	abilityManager.abilities.forEach(function(ability) {
		if (ability.activated) {
			// Check if this tile is the source
			if (ability.sourceTile && ability.sourceTile.id === boardTile.id) {
				abilitiesFromTile.push(ability);
			}
			// Check if this tile is a target
			if (ability.abilityTargetsTile && ability.abilityTargetsTile(boardTile)) {
				abilitiesTargetingTile.push(ability);
			}
		}
	});

	// Display abilities from this tile
	if (abilitiesFromTile.length > 0) {
		debugHtml += "<br /><b>== Active Abilities FROM This Tile ==</b>";
		abilitiesFromTile.forEach(function(ability) {
			debugHtml += "<br />";
			var abilityTitle = ability.abilityInfo.title || ability.abilityType;
			debugHtml += "• " + abilityTitle;
			if (ability.abilityTargetTiles && ability.abilityTargetTiles.length > 0) {
				debugHtml += "<br />&nbsp;&nbsp;Targeting: ";
				var targetNames = [];
				ability.abilityTargetTiles.forEach(function(targetTile) {
					targetNames.push(targetTile.ownerCode + " " + targetTile.code);
				});
				debugHtml += targetNames.join(", ");
			}
			if (ability.remainingDuration !== undefined) {
				debugHtml += "<br />&nbsp;&nbsp;Duration remaining: " + ability.remainingDuration;
			}
		});
	}

	// Display abilities targeting this tile
	if (abilitiesTargetingTile.length > 0) {
		debugHtml += "<br /><br /><b>== Active Abilities TARGETING This Tile ==</b>";
		abilitiesTargetingTile.forEach(function(ability) {
			debugHtml += "<br />";
			var abilityTitle = ability.abilityInfo.title || ability.abilityType;
			debugHtml += "• " + abilityTitle;
			debugHtml += "<br />&nbsp;&nbsp;From: " + ability.sourceTile.ownerCode + " " + ability.sourceTile.code;
			if (ability.remainingDuration !== undefined) {
				debugHtml += "<br />&nbsp;&nbsp;Duration remaining: " + ability.remainingDuration;
			}
		});
	}

	if (abilitiesFromTile.length === 0 && abilitiesTargetingTile.length === 0) {
		debugHtml += "<br /><i>(No active abilities)</i>";
	}

	return debugHtml;
};

TrifleTileInfo.getObjectSummary = function(origKey, theObject, indentDepth) {
	if (theObject instanceof TrifleBoardPoint) {
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
			htmlSummary += TrifleTileInfo.getObjectSummary(key, captureTypeInfoEntry, indentDepth+1);
		});
	} else {
		htmlSummary += "<br />" + indentDashStr + " " + origKey + ": " + theObject;
	}
	return htmlSummary;
};

