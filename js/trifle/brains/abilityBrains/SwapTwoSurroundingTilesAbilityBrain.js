import { debug } from '../../../GameData';
import { NON_PLAYABLE, POSSIBLE_MOVE } from '../../../skud-pai-sho/SkudPaiShoBoardPoint';
import { TrifleAbilityManager } from '../../TrifleAbilityManager';
import { TrifleTargetPromptId } from '../../TrifleTileInfo';
import {
	TrifleAnimationType,
	TrifleAnimationInstruction,
	TrifleAnimationSequence
} from '../../animation/TrifleAnimationTypes';

export function TrifleSwapTwoSurroundingTilesAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

/* Offsets for all 8 surrounding positions */
TrifleSwapTwoSurroundingTilesAbilityBrain.surroundingOffsets = [
	{ row: -1, col: 0 },	// top
	{ row: -1, col: 1 },	// top-right
	{ row: 0, col: 1 },	// right
	{ row: 1, col: 1 },	// bottom-right
	{ row: 1, col: 0 },	// bottom
	{ row: 1, col: -1 },	// bottom-left
	{ row: 0, col: -1 },	// left
	{ row: -1, col: -1 }	// top-left
];

/**
 * Get surrounding board points that have tiles (excluding White Lotus).
 */
TrifleSwapTwoSurroundingTilesAbilityBrain.prototype.getSurroundingTilePoints = function() {
	var board = this.abilityObject.board;
	var centerPoint = this.abilityObject.sourceTilePoint;
	var centerRow = centerPoint.row;
	var centerCol = centerPoint.col;
	var excludeTileCode = this.abilityObject.abilityInfo.excludeTileCode;
	var excludePointTypes = this.abilityObject.abilityInfo.excludePointTypes || [];
	var points = [];

	TrifleSwapTwoSurroundingTilesAbilityBrain.surroundingOffsets.forEach(function(offset) {
		var r = centerRow + offset.row;
		var c = centerCol + offset.col;
		if (r >= 0 && r < 17 && c >= 0 && c < 17) {
			var bp = board.cells[r][c];
			if (!bp.isType(NON_PLAYABLE) && bp.hasTile()) {
				if (!excludeTileCode || bp.tile.code !== excludeTileCode) {
					if (!excludePointTypes.some(function(t) { return bp.isType(t); })) {
						points.push(bp);
					}
				}
			}
		}
	});

	return points;
};

TrifleSwapTwoSurroundingTilesAbilityBrain.prototype.activateAbility = function() {
	debug("Swap Two Surrounding Tiles ability activating...");

	var promptTargetInfo = this.abilityObject.promptTargetInfo;
	var sourceTileKey = JSON.stringify(TrifleAbilityManager.buildSourceTileKeyObject(this.abilityObject.sourceTile));
	var animations = new TrifleAnimationSequence();

	if (promptTargetInfo
			&& promptTargetInfo[sourceTileKey]
			&& promptTargetInfo[sourceTileKey][TrifleTargetPromptId.firstSwapTile]
			&& promptTargetInfo[sourceTileKey][TrifleTargetPromptId.secondSwapTile]) {

		var firstTileNotationPoint = promptTargetInfo[sourceTileKey][TrifleTargetPromptId.firstSwapTile];
		var secondTileNotationPoint = promptTargetInfo[sourceTileKey][TrifleTargetPromptId.secondSwapTile];

		var board = this.abilityObject.board;
		var firstBoardPoint = board.getBoardPointFromRowAndCol(firstTileNotationPoint.rowAndColumn);
		var secondBoardPoint = board.getBoardPointFromRowAndCol(secondTileNotationPoint.rowAndColumn);

		if (firstBoardPoint.hasTile() && secondBoardPoint.hasTile()) {
			var tileA = firstBoardPoint.tile;
			var tileB = secondBoardPoint.tile;

			// Build SLIDE animations before moving
			animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
				tile: tileA,
				tileId: tileA.id,
				startPoint: { row: firstBoardPoint.row, col: firstBoardPoint.col },
				endPoint: { row: secondBoardPoint.row, col: secondBoardPoint.col },
				duration: 600,
				easing: 'ease-in-out',
				priority: 0,
				parallel: true,
				abilitySource: 'swapTwoSurroundingTiles'
			}));
			animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
				tile: tileB,
				tileId: tileB.id,
				startPoint: { row: secondBoardPoint.row, col: secondBoardPoint.col },
				endPoint: { row: firstBoardPoint.row, col: firstBoardPoint.col },
				duration: 600,
				easing: 'ease-in-out',
				priority: 0,
				parallel: true,
				abilitySource: 'swapTwoSurroundingTiles'
			}));

			// Swap tiles
			firstBoardPoint.removeTile();
			secondBoardPoint.removeTile();
			firstBoardPoint.putTile(tileB);
			secondBoardPoint.putTile(tileA);

			this.abilityObject.boardChanged = true;
		} else {
			debug("Swap: one or both tiles missing from selected points");
		}
	}

	return {
		animations: animations
	};
};

TrifleSwapTwoSurroundingTilesAbilityBrain.prototype.promptForTarget = function(nextNeededPromptTargetInfo, sourceTileKeyStr, checkForTargetsOnly) {
	var promptTargetsExist = false;

	debug("Swap prompt for target: " + nextNeededPromptTargetInfo.promptId);

	if (nextNeededPromptTargetInfo.promptId === TrifleTargetPromptId.firstSwapTile) {
		// Mark all surrounding tiles (except White Lotus) as selectable
		var surroundingTilePoints = this.getSurroundingTilePoints();
		surroundingTilePoints.forEach(function(bp) {
			promptTargetsExist = true;
			if (!checkForTargetsOnly) {
				bp.addType(POSSIBLE_MOVE);
			}
		});
	} else if (nextNeededPromptTargetInfo.promptId === TrifleTargetPromptId.secondSwapTile) {
		// Mark surrounding tiles except the first selected tile
		var firstTileNotationPoint = this.abilityObject.promptTargetInfo[sourceTileKeyStr][TrifleTargetPromptId.firstSwapTile];
		var firstRC = firstTileNotationPoint.rowAndColumn;

		var surroundingTilePoints = this.getSurroundingTilePoints();
		surroundingTilePoints.forEach(function(bp) {
			if (bp.row !== firstRC.row || bp.col !== firstRC.col) {
				promptTargetsExist = true;
				if (!checkForTargetsOnly) {
					bp.addType(POSSIBLE_MOVE);
				}
			}
		});
	}

	debug("promptTargetsExist for swap? : " + promptTargetsExist);
	return promptTargetsExist;
};
