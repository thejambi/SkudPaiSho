import { debug } from '../../../GameData';
import { NON_PLAYABLE, POSSIBLE_MOVE } from '../../../skud-pai-sho/SkudPaiShoBoardPoint';
import { TrifleAbilityManager } from '../../TrifleAbilityManager';
import { TrifleTargetPromptId } from '../../TrifleTileInfo';
import {
	TrifleAnimationType,
	TrifleAnimationInstruction,
	TrifleAnimationSequence
} from '../../animation/TrifleAnimationTypes';

export function TrifleDisplaceOccupiedTileAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

/* Offsets for all 8 surrounding positions */
TrifleDisplaceOccupiedTileAbilityBrain.surroundingOffsets = [
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
 * Get surrounding board points that are empty (valid destinations for displaced tile).
 */
TrifleDisplaceOccupiedTileAbilityBrain.prototype.getSurroundingEmptyPoints = function() {
	var board = this.abilityObject.board;
	var centerPoint = this.abilityObject.sourceTilePoint;
	var centerRow = centerPoint.row;
	var centerCol = centerPoint.col;
	var points = [];

	TrifleDisplaceOccupiedTileAbilityBrain.surroundingOffsets.forEach(function(offset) {
		var r = centerRow + offset.row;
		var c = centerCol + offset.col;
		if (r >= 0 && r < 17 && c >= 0 && c < 17) {
			var bp = board.cells[r][c];
			if (!bp.isType(NON_PLAYABLE) && !bp.hasTile()) {
				points.push(bp);
			}
		}
	});

	return points;
};

TrifleDisplaceOccupiedTileAbilityBrain.prototype.activateAbility = function() {
	debug("Displace Occupied Tile ability activating...");

	var promptTargetInfo = this.abilityObject.promptTargetInfo;
	var sourceTileKey = JSON.stringify(TrifleAbilityManager.buildSourceTileKeyObject(this.abilityObject.sourceTile));
	var animations = new TrifleAnimationSequence();

	var displacedTile = this.abilityObject.sourceTile._displacedTile;

	if (promptTargetInfo
			&& promptTargetInfo[sourceTileKey]
			&& promptTargetInfo[sourceTileKey][TrifleTargetPromptId.displacedTileDestinationPoint]
			&& displacedTile) {

		var destNotationPoint = promptTargetInfo[sourceTileKey][TrifleTargetPromptId.displacedTileDestinationPoint];
		var board = this.abilityObject.board;
		var destBoardPoint = board.getBoardPointFromRowAndCol(destNotationPoint.rowAndColumn);

		if (!destBoardPoint.hasTile()) {
			// Build SLIDE animation for the displaced tile
			animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
				tile: displacedTile,
				tileId: displacedTile.id,
				startPoint: { row: this.abilityObject.sourceTilePoint.row, col: this.abilityObject.sourceTilePoint.col },
				endPoint: { row: destBoardPoint.row, col: destBoardPoint.col },
				duration: 600,
				easing: 'ease-in-out',
				priority: 0,
				parallel: false,
				abilitySource: 'displaceOccupiedTile'
			}));

			// Place the displaced tile at the destination
			destBoardPoint.putTile(displacedTile);
			this.abilityObject.boardChanged = true;
		} else {
			debug("Displace: destination point is occupied");
		}
	} else if (!displacedTile) {
		debug("Displace: no displaced tile found on source tile");
	}

	// Clean up
	if (this.abilityObject.sourceTile._displacedTile) {
		delete this.abilityObject.sourceTile._displacedTile;
	}

	return {
		animations: animations
	};
};

TrifleDisplaceOccupiedTileAbilityBrain.prototype.promptForTarget = function(nextNeededPromptTargetInfo, sourceTileKeyStr, checkForTargetsOnly) {
	var promptTargetsExist = false;

	debug("Displace prompt for target: " + nextNeededPromptTargetInfo.promptId);

	if (nextNeededPromptTargetInfo.promptId === TrifleTargetPromptId.displacedTileDestinationPoint) {
		var surroundingEmptyPoints = this.getSurroundingEmptyPoints();
		surroundingEmptyPoints.forEach(function(bp) {
			promptTargetsExist = true;
			if (!checkForTargetsOnly) {
				bp.addType(POSSIBLE_MOVE);
			}
		});
	}

	debug("promptTargetsExist for displace? : " + promptTargetsExist);
	return promptTargetsExist;
};
