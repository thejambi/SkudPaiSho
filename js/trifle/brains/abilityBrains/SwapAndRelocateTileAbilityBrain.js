import { debug } from '../../../GameData';
import { NON_PLAYABLE, POSSIBLE_MOVE } from '../../../skud-pai-sho/SkudPaiShoBoardPoint';
import { TrifleAbilityManager } from '../../TrifleAbilityManager';
import { TrifleTargetPromptId } from '../../TrifleTileInfo';
import {
	TrifleAnimationType,
	TrifleAnimationInstruction,
	TrifleAnimationSequence
} from '../../animation/TrifleAnimationTypes';

export function TrifleSwapAndRelocateTileAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

/**
 * Get all board points with tiles that are valid swap targets.
 * Excludes the source tile (Air) and any tile matching excludeTileCode (White Lotus).
 */
TrifleSwapAndRelocateTileAbilityBrain.prototype.getSwappableTilePoints = function() {
	var board = this.abilityObject.board;
	var sourceTile = this.abilityObject.sourceTile;
	var excludeTileCode = this.abilityObject.abilityInfo.excludeTileCode;
	var points = [];

	board.forEachBoardPointWithTile(function(bp) {
		if (bp.tile !== sourceTile) {
			if (!excludeTileCode || bp.tile.code !== excludeTileCode) {
				points.push(bp);
			}
		}
	});

	return points;
};

/**
 * Get all empty playable board points (valid relocation destinations).
 * Excludes the Air tile's current position since it will be vacated during the swap.
 */
TrifleSwapAndRelocateTileAbilityBrain.prototype.getEmptyPlayablePoints = function() {
	var board = this.abilityObject.board;
	var points = [];

	board.forEachBoardPoint(function(bp) {
		if (!bp.hasTile() && !bp.isType(NON_PLAYABLE)) {
			points.push(bp);
		}
	});

	return points;
};

TrifleSwapAndRelocateTileAbilityBrain.prototype.activateAbility = function() {
	debug("Swap And Relocate Tile ability activating...");

	var promptTargetInfo = this.abilityObject.promptTargetInfo;
	var sourceTileKey = JSON.stringify(TrifleAbilityManager.buildSourceTileKeyObject(this.abilityObject.sourceTile));
	var animations = new TrifleAnimationSequence();

	if (promptTargetInfo
			&& promptTargetInfo[sourceTileKey]
			&& promptTargetInfo[sourceTileKey][TrifleTargetPromptId.swappedTilePoint]
			&& promptTargetInfo[sourceTileKey][TrifleTargetPromptId.relocatedTileDestinationPoint]) {

		var swappedTileNotationPoint = promptTargetInfo[sourceTileKey][TrifleTargetPromptId.swappedTilePoint];
		var relocDestNotationPoint = promptTargetInfo[sourceTileKey][TrifleTargetPromptId.relocatedTileDestinationPoint];

		var board = this.abilityObject.board;
		var swappedBoardPoint = board.getBoardPointFromRowAndCol(swappedTileNotationPoint.rowAndColumn);
		var relocDestBoardPoint = board.getBoardPointFromRowAndCol(relocDestNotationPoint.rowAndColumn);
		var airBoardPoint = this.abilityObject.sourceTilePoint;

		if (swappedBoardPoint.hasTile() && !relocDestBoardPoint.hasTile()) {
			var swappedTile = swappedBoardPoint.tile;
			var airTile = airBoardPoint.tile;

			// Air moves to where the swapped tile was
			board.relocateTile(airTile, swappedBoardPoint);

			// Swapped tile goes to the chosen relocation destination
			board.relocateTile(swappedTile, relocDestBoardPoint);

			// Animate: Air slides to swapped tile's old position
			animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
				tile: airTile,
				tileId: airTile.id,
				startPoint: { row: airBoardPoint.row, col: airBoardPoint.col },
				endPoint: { row: swappedBoardPoint.row, col: swappedBoardPoint.col },
				duration: 600,
				easing: 'ease-in-out',
				priority: 0,
				parallel: true,
				abilitySource: 'swapAndRelocateTile'
			}));

			// Animate: Swapped tile slides to relocation destination
			animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
				tile: swappedTile,
				tileId: swappedTile.id,
				startPoint: { row: swappedBoardPoint.row, col: swappedBoardPoint.col },
				endPoint: { row: relocDestBoardPoint.row, col: relocDestBoardPoint.col },
				duration: 600,
				easing: 'ease-in-out',
				priority: 0,
				parallel: true,
				abilitySource: 'swapAndRelocateTile'
			}));

			this.abilityObject.boardChanged = true;
		} else {
			debug("SwapAndRelocate: invalid state - swapped tile missing or destination occupied");
		}
	}

	return {
		animations: animations
	};
};

TrifleSwapAndRelocateTileAbilityBrain.prototype.promptForTarget = function(nextNeededPromptTargetInfo, sourceTileKeyStr, checkForTargetsOnly) {
	var promptTargetsExist = false;

	debug("SwapAndRelocate prompt for target: " + nextNeededPromptTargetInfo.promptId);

	if (nextNeededPromptTargetInfo.promptId === TrifleTargetPromptId.swappedTilePoint) {
		// Mark all swappable tiles (any tile on board except White Lotus and Air itself)
		var swappableTilePoints = this.getSwappableTilePoints();
		swappableTilePoints.forEach(function(bp) {
			promptTargetsExist = true;
			if (!checkForTargetsOnly) {
				bp.addType(POSSIBLE_MOVE);
			}
		});
	} else if (nextNeededPromptTargetInfo.promptId === TrifleTargetPromptId.relocatedTileDestinationPoint) {
		// Mark all empty playable spots as valid relocation destinations
		var emptyPoints = this.getEmptyPlayablePoints();
		emptyPoints.forEach(function(bp) {
			promptTargetsExist = true;
			if (!checkForTargetsOnly) {
				bp.addType(POSSIBLE_MOVE);
			}
		});
	}

	debug("promptTargetsExist for swapAndRelocate? : " + promptTargetsExist);
	return promptTargetsExist;
};
