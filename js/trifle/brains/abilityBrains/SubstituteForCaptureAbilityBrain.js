import { debug } from '../../../GameData';
import { TrifleAbilityManager } from '../../TrifleAbilityManager';
import { TrifleTargetPromptId } from '../../TrifleTileInfo';
import {
	TrifleAnimationType,
	TrifleAnimationInstruction,
	TrifleAnimationSequence
} from '../../animation/TrifleAnimationTypes';

export function TrifleSubstituteForCaptureAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

TrifleSubstituteForCaptureAbilityBrain.prototype.promptForTarget = function(
		nextNeededPromptTargetInfo, sourceTileKeyStr, checkForTargetsOnly) {
	var promptTargetsExist = false;

	if (nextNeededPromptTargetInfo.promptId === TrifleTargetPromptId.chosenSavedTile) {
		this.abilityObject.setAbilityTargetTiles();
		var abilityTargetTiles = this.abilityObject.abilityTargetTiles;

		if (checkForTargetsOnly) {
			return abilityTargetTiles.length > 0;
		}

		if (abilityTargetTiles.length <= 1) {
			// Single target: auto-fill the prompt answer, no user interaction needed
			if (abilityTargetTiles.length === 1) {
				var sourceTileKey = JSON.stringify(
					TrifleAbilityManager.buildSourceTileKeyObject(this.abilityObject.sourceTile)
				);
				if (!this.abilityObject.promptTargetInfo) {
					this.abilityObject.promptTargetInfo = {};
				}
				if (!this.abilityObject.promptTargetInfo[sourceTileKey]) {
					this.abilityObject.promptTargetInfo[sourceTileKey] = {};
				}
				this.abilityObject.promptTargetInfo[sourceTileKey][TrifleTargetPromptId.chosenSavedTile] =
					abilityTargetTiles[0].getOwnerCodeIdObject();
			}
			return false;
		}

		// Multiple targets: mark selectable for user to choose
		abilityTargetTiles.forEach(function(targetTile) {
			promptTargetsExist = true;
			targetTile.tileIsSelectable = true;
		});
	}

	return promptTargetsExist;
};

TrifleSubstituteForCaptureAbilityBrain.prototype.activateAbility = function() {
	var targetTiles = this.abilityObject.abilityTargetTiles;
	var targetTilePoints = this.abilityObject.abilityTargetTilePoints;

	this.capturedTiles = [];
	var animations = new TrifleAnimationSequence();

	if (!targetTiles || targetTiles.length === 0) {
		return { capturedTiles: this.capturedTiles, animations: animations };
	}

	// Determine which tile to restore: use prompt selection if available, otherwise first target
	var restoredTile = targetTiles[0];
	var restoredTileOriginalPoint = targetTilePoints && targetTilePoints.length > 0
		? targetTilePoints[0]
		: null;

	var promptTargetInfo = this.abilityObject.promptTargetInfo;
	if (promptTargetInfo) {
		var sourceTileKey = JSON.stringify(
			TrifleAbilityManager.buildSourceTileKeyObject(this.abilityObject.sourceTile)
		);
		if (promptTargetInfo[sourceTileKey]
				&& promptTargetInfo[sourceTileKey][TrifleTargetPromptId.chosenSavedTile]) {
			var chosenTileKeyObject = promptTargetInfo[sourceTileKey][TrifleTargetPromptId.chosenSavedTile];

			for (var i = 0; i < targetTiles.length; i++) {
				if (targetTiles[i].ownerName === chosenTileKeyObject.ownerName
						&& targetTiles[i].code === chosenTileKeyObject.code
						&& targetTiles[i].id === chosenTileKeyObject.id) {
					restoredTile = targetTiles[i];
					restoredTileOriginalPoint = targetTilePoints && targetTilePoints.length > i
						? targetTilePoints[i]
						: null;
					break;
				}
			}
		}
	}

	var sourceTile = this.abilityObject.sourceTile;
	var sourceTilePoint = sourceTile.seatedPoint;

	// Verify source tile is still on the board
	if (!sourceTilePoint || !sourceTilePoint.hasTile()
		|| sourceTilePoint.tile !== sourceTile) {
		debug("SubstituteForCapture: Source tile not at expected position");
		return { capturedTiles: this.capturedTiles, animations: animations };
	}

	// === Record positions BEFORE board mutation for animations ===
	var sourceTilePosition = {
		row: sourceTilePoint.row,
		col: sourceTilePoint.col
	};

	var restoredTileOriginalPosition = restoredTileOriginalPoint
		? { row: restoredTileOriginalPoint.row, col: restoredTileOriginalPoint.col }
		: null;

	// === Execute board state changes ===

	// Remove source tile from the board, then place the restored tile at its
	// position. The source tile takes the hit, the saved tile takes its spot.
	sourceTilePoint.removeTile();

	sourceTilePoint.putTile(restoredTile);
	restoredTile.seatedPoint = sourceTilePoint;

	// Capture source tile (the substitute)
	this.capturedTiles.push(sourceTile);
	sourceTile.beingCapturedByAbility = true;

	// Track for resurrection if applicable
	if (sourceTile.deployPoint) {
		this.abilityObject.board.capturedTilesForResurrection.push(sourceTile);
	}

	this.abilityObject.boardChanged = true;

	debug("SubstituteForCapture: " + sourceTile.code + " captured instead of " + restoredTile.code);

	// === Build animation sequence ===

	// Animation 1: Pulse on source tile to indicate ability activation
	animations.add(new TrifleAnimationInstruction(TrifleAnimationType.PULSE, {
		tile: sourceTile,
		tileId: sourceTile.id,
		startPoint: sourceTilePosition,
		duration: 400,
		priority: 0,
		color: '#ffcc00',  // Golden glow for sacrifice ability
		abilitySource: 'substituteForCapture:pulse'
	}));

	// Animation 2: Source tile fades out (sacrificing itself)
	animations.add(new TrifleAnimationInstruction(TrifleAnimationType.FADE_OUT, {
		tile: sourceTile,
		tileId: sourceTile.id,
		startPoint: sourceTilePosition,
		duration: 600,
		delay: 100,
		priority: 1,
		parallel: true,
		abilitySource: 'substituteForCapture:fadeOut'
	}));

	// Animation 3: Saved tile appears at source tile's position
	if (restoredTileOriginalPosition) {
		// Slide in from where it was captured
		animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
			tile: restoredTile,
			tileId: restoredTile.id,
			startPoint: restoredTileOriginalPosition,
			endPoint: sourceTilePosition,
			duration: 800,
			delay: 200,
			priority: 2,
			parallel: true,
			abilitySource: 'substituteForCapture:slideIn'
		}));
	} else {
		// Pop in if we don't have original position
		animations.add(new TrifleAnimationInstruction(TrifleAnimationType.POP, {
			tile: restoredTile,
			tileId: restoredTile.id,
			endPoint: sourceTilePosition,
			duration: 600,
			delay: 500,
			priority: 2,
			abilitySource: 'substituteForCapture:popIn'
		}));
	}

	return {
		capturedTiles: this.capturedTiles,
		animations: animations
	};
};
