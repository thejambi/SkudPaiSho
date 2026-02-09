// Trifle Engine - Brain Factory
// Documentation: ~/Dropbox/Programming/SkudPaiSho/TheGardenGate/backend/TGGDocumentation/Trifle/

import {
  TrifleAbilityName,
  TrifleAbilityTriggerType,
  TrifleTargetType,
} from '../TrifleTileInfo';
import { debug } from '../../GameData';
import { TrifleWhileInsideTempleTriggerBrain } from './triggerBrains/WhileInsideTempleTriggerBrain';
import { TrifleWhileOutsideTempleTriggerBrain } from './triggerBrains/WhileOutsideTempleTriggerBrain';
import { TrifleWhileTargetTileIsOnBoardTriggerBrain } from './triggerBrains/WhileTargetTileIsOnBoardTriggerBrain';
import { TrifleWhileTargetTileIsAdjacentTriggerBrain } from './triggerBrains/WhileTargetTileIsAdjacentTriggerBrain';
import { TrifleWhileTargetTileIsSurroundingTriggerBrain } from './triggerBrains/WhileTargetTileIsSurroundingTriggerBrain';
import { TrifleWhileTargetTileIsWithinDistanceTriggerBrain } from './triggerBrains/WhileTargetTileIsWithinDistanceTriggerBrain';
import { TrifleWhileTargetTileIsInZoneTriggerBrain } from './triggerBrains/WhileTargetTileIsInZoneTriggerBrain';
import { TrifleWhileTargetTileIsInLineOfSightTriggerBrain } from './triggerBrains/WhileTargetTileIsInLineOfSightTriggerBrain';
import { TrifleWhenTargetTileLandsInZoneTriggerBrain } from './triggerBrains/WhenTargetTileLandsInZoneTriggerBrain';
import { TrifleWhenTargetTileMovesFromWithinZoneTriggerBrain } from './triggerBrains/WhenTargetTileMovesFromWithinZoneTriggerBrain';
import { TrifleWhenCapturedByTargetTileTriggerBrain } from './triggerBrains/WhenCapturedByTargetTileTriggerBrain';
import { TrifleWhenCapturingTargetTileTriggerBrain } from './triggerBrains/WhenCapturingTargetTileTriggerBrain';
import { TrifleWhenLandsAdjacentToTargetTileTriggerBrain } from './triggerBrains/WhenLandsAdjacentToTargetTileTriggerBrain';
import { TrifleWhenLandsSurroundingTargetTileTriggerBrain } from './triggerBrains/WhenLandsSurroundingTargetTileTriggerBrain';
import { TrifleWhenTargetTileLandsAdjacentTriggerBrain } from './triggerBrains/WhenTargetTileLandsAdjacentTriggerBrain';
import { TrifleWhenTargetTileLandsSurroundingTriggerBrain } from './triggerBrains/WhenTargetTileLandsSurroundingTriggerBrain';
import { TrifleWhenDeployedTriggerBrain } from './triggerBrains/WhenDeployedTriggerBrain';
import { TrifleWhenActiveMovementTriggerBrain } from './triggerBrains/WhenActiveMovementTriggerBrain';
import { TrifleWhenTargetTileLandsInTempleTriggerBrain } from './triggerBrains/WhenTargetTileLandsInTempleTriggerBrain';
import { TrifleWhenAdjacentFriendlyTileIsCapturedTriggerBrain } from './triggerBrains/WhenAdjacentFriendlyTileIsCapturedTriggerBrain';
import { TrifleWhileOnBoardTriggerBrain } from './triggerBrains/WhileOnBoardTriggerBrain';
import { TrifleWhileTargetTilesAreNotOnBoardTriggerBrain } from './triggerBrains/WhileTargetTilesAreNotOnBoardTriggerBrain';
import { TrifleTriggerTargetTilesTargetBrain } from './targetBrains/TriggerTargetTilesTargetBrain';
import { TrifleAllTilesTargetBrain } from './targetBrains/AllTilesTargetBrain';
import { TrifleSurroundingTilesTargetBrain } from './targetBrains/SurroundingTilesTargetBrain';
import { TrifleAdjacentTilesTargetBrain } from './targetBrains/AdjacentTilesTargetBrain';
import { TrifleThisTileTargetBrain } from './targetBrains/ThisTileTargetBrain';
import { TrifleChosenCapturedTileTargetBrain } from './targetBrains/ChosenCapturedTileTargetBrain';
import { TrifleCaptureTargetTilesAbilityBrain } from './abilityBrains/CaptureTargetTilesAbilityBrain';
import { TrifleGrowGiganticAbilityBrain } from './abilityBrains/GrowGiganticAbilityBrain';
import { TrifleRecordTilePointAbilityBrain } from './abilityBrains/RecordTilePointAbilityBrain';
import { TrifleMoveTileToRecordedPointAbilityBrain } from './abilityBrains/MoveTileToRecordedPointAbilityBrain';
import { TrifleMoveTargetTileAbilityBrain } from './abilityBrains/MoveTargetTileAbilityBrain';
import { TrifleMoveTargetTileToPileAbilityBrain } from './abilityBrains/MoveTargetTileToPileAbilityBrain';
import { TrifleExchangeWithCapturedTileAbilityBrain } from './abilityBrains/ExchangeWithCapturedTileAbilityBrain';
import { TrifleSimpleOngoingAbilityBrain } from './abilityBrains/SimpleOngoingAbilityBrain';
import { TrifleDrawTilesAlongLineOfSightConstraintBrain } from './constraintBrains/DrawTilesAlongLineOfSightConstraintBrain';
import { TrifleImmobilizeTilesConstraintBrain } from './constraintBrains/ImmobilizeTilesConstraintBrain';
import { TrifleRestrictMovementWithinZoneConstraintBrain } from './constraintBrains/RestrictMovementWithinZoneConstraintBrain';
import { TrifleRestrictMovementWithinZoneUnlessCapturingConstraintBrain } from './constraintBrains/RestrictMovementWithinZoneUnlessCapturingConstraintBrain';
import { TrifleProtectFromCaptureCaptureConstraintBrain } from './captureConstraintBrains/ProtectFromCaptureCaptureConstraintBrain';
import { TrifleProhibitTileFromCapturingCaptureConstraintBrain } from './captureConstraintBrains/ProhibitTileFromCapturingCaptureConstraintBrain';
import { TrifleRestrictTileFromCapturingCaptureConstraintBrain } from './captureConstraintBrains/RestrictTileFromCapturingCaptureConstraintBrain';
import { TrifleRequireDeployInZoneConstraintBrain } from './constraintBrains/RequireDeployInZoneConstraintBrain';
import { TrifleRestrictDeploymentInZoneConstraintBrain } from './constraintBrains/RestrictDeploymentInZoneConstraintBrain';
import { TrifleWhenTargetTileInZoneIsCapturedTriggerBrain } from './triggerBrains/WhenTargetTileInZoneIsCapturedTriggerBrain';
import { TrifleSubstituteForCaptureAbilityBrain } from './abilityBrains/SubstituteForCaptureAbilityBrain';
import { TrifleRotateSurroundingTilesClockwiseAbilityBrain } from './abilityBrains/RotateSurroundingTilesClockwiseAbilityBrain';
import { TrifleSwapTwoSurroundingTilesAbilityBrain } from './abilityBrains/SwapTwoSurroundingTilesAbilityBrain';
import { TrifleDisplaceOccupiedTileAbilityBrain } from './abilityBrains/DisplaceOccupiedTileAbilityBrain';
import { TrifleSwapAndRelocateTileAbilityBrain } from './abilityBrains/SwapAndRelocateTileAbilityBrain';
import { TrifleWhileTargetTileIsNotOnBoardTriggerBrain } from './triggerBrains/WhileTargetTileIsNotOnBoardTriggerBrain';

/**
 * Constraint categories for organizing different types of constraint brains
 */
export const ConstraintCategory = {
	MOVEMENT: 'movement',
	CAPTURE_PROHIBITION: 'captureProhibition',
	CAPTURE_PROTECTION: 'captureProtection',
	DEPLOY_RESTRICTION: 'deployRestriction'
};

/**
 * Registry mapping ability names to their constraint category and brain constructor.
 * This allows dynamic lookup of constraints by category without hard-coding each ability.
 */
const CONSTRAINT_REGISTRY = {
	[TrifleAbilityName.drawTilesAlongLineOfSight]: {
		category: ConstraintCategory.MOVEMENT,
		brain: TrifleDrawTilesAlongLineOfSightConstraintBrain
	},
	[TrifleAbilityName.immobilizeTiles]: {
		category: ConstraintCategory.MOVEMENT,
		brain: TrifleImmobilizeTilesConstraintBrain
	},
	[TrifleAbilityName.restrictMovementWithinZone]: {
		category: ConstraintCategory.MOVEMENT,
		brain: TrifleRestrictMovementWithinZoneConstraintBrain
	},
	[TrifleAbilityName.restrictMovementWithinZoneUnlessCapturing]: {
		category: ConstraintCategory.MOVEMENT,
		brain: TrifleRestrictMovementWithinZoneUnlessCapturingConstraintBrain
	},
	[TrifleAbilityName.prohibitTileFromCapturing]: {
		category: ConstraintCategory.CAPTURE_PROHIBITION,
		brain: TrifleProhibitTileFromCapturingCaptureConstraintBrain
	},
	[TrifleAbilityName.restrictTileFromCapturing]: {
		category: ConstraintCategory.CAPTURE_PROHIBITION,
		brain: TrifleRestrictTileFromCapturingCaptureConstraintBrain
	},
	[TrifleAbilityName.protectFromCapture]: {
		category: ConstraintCategory.CAPTURE_PROTECTION,
		brain: TrifleProtectFromCaptureCaptureConstraintBrain
	},
	[TrifleAbilityName.requireDeployInZone]: {
		category: ConstraintCategory.DEPLOY_RESTRICTION,
		brain: TrifleRequireDeployInZoneConstraintBrain
	},
	[TrifleAbilityName.restrictDeploymentInZone]: {
		category: ConstraintCategory.DEPLOY_RESTRICTION,
		brain: TrifleRestrictDeploymentInZoneConstraintBrain
	},
};

/**
 * Get all ability names that belong to a specific constraint category
 * @param {string} category - The constraint category to filter by
 * @returns {Array<string>} Array of ability names in that category
 */
export function getAbilityNamesForConstraintCategory(category) {
	return Object.entries(CONSTRAINT_REGISTRY)
		.filter(([_, entry]) => entry.category === category)
		.map(([abilityName]) => abilityName);
}

export function TrifleBrainFactory() {

}

TrifleBrainFactory.prototype.createTriggerBrain = function(abilityTriggerInfo, triggerContext) {
	switch(abilityTriggerInfo.triggerType) {
		case TrifleAbilityTriggerType.whileInsideTemple:
			return new TrifleWhileInsideTempleTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileOutsideTemple:
			return new TrifleWhileOutsideTempleTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileTargetTileIsOnBoard:
			return new TrifleWhileTargetTileIsOnBoardTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileTargetTilesAreNotOnBoard:
			return new TrifleWhileTargetTilesAreNotOnBoardTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileTargetTileIsNotOnBoard:
			return new TrifleWhileTargetTileIsNotOnBoardTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileTargetTileIsAdjacent:
			return new TrifleWhileTargetTileIsAdjacentTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileTargetTileIsSurrounding:
			return new TrifleWhileTargetTileIsSurroundingTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileTargetTileIsWithinDistance:
			return new TrifleWhileTargetTileIsWithinDistanceTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileTargetTileIsInZone:
			return new TrifleWhileTargetTileIsInZoneTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileTargetTileIsInLineOfSight:
			return new TrifleWhileTargetTileIsInLineOfSightTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenTargetTileLandsInZone:
			return new TrifleWhenTargetTileLandsInZoneTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenTargetTileMovesFromWithinZone:
			return new TrifleWhenTargetTileMovesFromWithinZoneTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenCapturedByTargetTile:
			return new TrifleWhenCapturedByTargetTileTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenCapturingTargetTile:
			return new TrifleWhenCapturingTargetTileTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenLandsAdjacentToTargetTile:
			return new TrifleWhenLandsAdjacentToTargetTileTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenLandsSurroundingTargetTile:
			return new TrifleWhenLandsSurroundingTargetTileTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenTargetTileLandsAdjacent:
			return new TrifleWhenTargetTileLandsAdjacentTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenTargetTileLandsSurrounding:
			return new TrifleWhenTargetTileLandsSurroundingTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenDeployed:
			return new TrifleWhenDeployedTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenActiveMovement:
			return new TrifleWhenActiveMovementTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenTargetTileLandsInTemple:
			return new TrifleWhenTargetTileLandsInTempleTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenAdjacentFriendlyTileIsCaptured:
			return new TrifleWhenAdjacentFriendlyTileIsCapturedTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whileOnBoard:
			return new TrifleWhileOnBoardTriggerBrain(triggerContext);
		case TrifleAbilityTriggerType.whenTargetTileInZoneIsCaptured:
			return new TrifleWhenTargetTileInZoneIsCapturedTriggerBrain(triggerContext);
		default:
			debug("No Trigger Brain created for trigger: " + abilityTriggerInfo.triggerType);
	}
};

TrifleBrainFactory.createAbilityBrain = function(abilityName, abilityObject) {
	switch(abilityName) {
		/* Action abilities will need specific ability brains
			but ongoing abilities that are checked for in game logic can have generic brain */
		case TrifleAbilityName.captureTargetTiles:
			return new TrifleCaptureTargetTilesAbilityBrain(abilityObject);
		case TrifleAbilityName.growGigantic:
			return new TrifleGrowGiganticAbilityBrain(abilityObject);
		case TrifleAbilityName.recordTilePoint:
			return new TrifleRecordTilePointAbilityBrain(abilityObject);
		case TrifleAbilityName.moveTileToRecordedPoint:
			return new TrifleMoveTileToRecordedPointAbilityBrain(abilityObject);
		case TrifleAbilityName.moveTargetTile:
			return new TrifleMoveTargetTileAbilityBrain(abilityObject);
		case TrifleAbilityName.moveTargetTileToPile:
			return new TrifleMoveTargetTileToPileAbilityBrain(abilityObject);
		case TrifleAbilityName.exchangeWithCapturedTile:
			return new TrifleExchangeWithCapturedTileAbilityBrain(abilityObject);
		case TrifleAbilityName.substituteForCapture:
			return new TrifleSubstituteForCaptureAbilityBrain(abilityObject);
		case TrifleAbilityName.rotateSurroundingTilesClockwise:
			return new TrifleRotateSurroundingTilesClockwiseAbilityBrain(abilityObject);
		case TrifleAbilityName.swapTwoSurroundingTiles:
			return new TrifleSwapTwoSurroundingTilesAbilityBrain(abilityObject);
		case TrifleAbilityName.displaceOccupiedTile:
			return new TrifleDisplaceOccupiedTileAbilityBrain(abilityObject);
		case TrifleAbilityName.swapAndRelocateTile:
			return new TrifleSwapAndRelocateTileAbilityBrain(abilityObject);
		default:
			return new TrifleSimpleOngoingAbilityBrain(abilityObject);
	}
};

TrifleBrainFactory.createTargetBrain = function(targetType, abilityObject) {
	switch(targetType) {
		case TrifleTargetType.triggerTargetTiles:
			return new TrifleTriggerTargetTilesTargetBrain(abilityObject);
		case TrifleTargetType.allTiles:
			return new TrifleAllTilesTargetBrain(abilityObject);
		case TrifleTargetType.surroundingTiles:
			return new TrifleSurroundingTilesTargetBrain(abilityObject);
		case TrifleTargetType.adjacentTiles:
			return new TrifleAdjacentTilesTargetBrain(abilityObject);
		case TrifleTargetType.thisTile:
			return new TrifleThisTileTargetBrain(abilityObject);
		case TrifleTargetType.chosenCapturedTile:
			return new TrifleChosenCapturedTileTargetBrain(abilityObject);
	}
};

/**
 * Create a constraint brain for any constraint type (movement, capture, etc.)
 * Uses the CONSTRAINT_REGISTRY to dynamically look up the appropriate brain constructor.
 * @param {string} abilityName - The ability type that creates this constraint
 * @param {Object} board - The game board
 * @param {Object} ability - The ability object
 * @returns {Object|null} The constraint brain or null if not applicable
 */
TrifleBrainFactory.createConstraintBrain = function(abilityName, board, ability) {
	const registryEntry = CONSTRAINT_REGISTRY[abilityName];
	if (registryEntry && registryEntry.brain) {
		return new registryEntry.brain(board, ability);
	}
	return null;
};

/**
 * @deprecated Use createConstraintBrain instead - kept for backwards compatibility
 */
TrifleBrainFactory.createCaptureConstraintBrain = function(abilityName, board, ability) {
	return TrifleBrainFactory.createConstraintBrain(abilityName, board, ability);
};

