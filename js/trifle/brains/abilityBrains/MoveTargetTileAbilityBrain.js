import { POSSIBLE_MOVE } from '../../../skud-pai-sho/SkudPaiShoBoardPoint';
import { TrifleAbilityManager } from '../../TrifleAbilityManager';
import { TrifleBrainFactory } from '../BrainFactory';
import { TrifleTargetPromptId, TrifleTargetType } from '../../TrifleTileInfo';
import { debug } from '../../../GameData';

export function TrifleMoveTargetTileAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

TrifleMoveTargetTileAbilityBrain.prototype.activateAbility = function() {
	var promptTargetInfo = this.abilityObject.promptTargetInfo;

	debug("PUSHING");

	var sourceTileKey = JSON.stringify(TrifleAbilityManager.buildSourceTileKeyObject(this.abilityObject.sourceTile));

	if (promptTargetInfo 
			&& promptTargetInfo[sourceTileKey]
			&& promptTargetInfo[sourceTileKey][TrifleTargetPromptId.movedTilePoint]
			&& promptTargetInfo[sourceTileKey][TrifleTargetPromptId.movedTileDestinationPoint]) {
		var movedTilePoint = promptTargetInfo[sourceTileKey][TrifleTargetPromptId.movedTilePoint];
		var movedTileDestinationPoint = promptTargetInfo[sourceTileKey][TrifleTargetPromptId.movedTileDestinationPoint];
		
		var movedTileBoardPoint = this.abilityObject.board.getBoardPointFromRowAndCol(movedTilePoint.rowAndColumn);
		var movedTileDestBoardPoint = this.abilityObject.board.getBoardPointFromRowAndCol(movedTileDestinationPoint.rowAndColumn);
		
		if (movedTileBoardPoint.hasTile() && this.abilityObject.abilityTargetTiles.includes(movedTileBoardPoint.tile)
				&& !movedTileDestBoardPoint.hasTile()) {
			// Ok, tile is targeted and destination point is clear!
			// TODO verify dest point is able to be reached by movement
			var currentMoveInfo = {
				isPassiveMovement: this.abilityObject.abilityInfo.isPassiveMovement
			};
			this.abilityObject.board.moveTile(this.abilityObject.sourceTile.ownerName, movedTilePoint, movedTileDestinationPoint, currentMoveInfo);
			this.abilityObject.boardChanged = true;
		} else {
			debug("Wrong tile, bub");
		}
	}
};

TrifleMoveTargetTileAbilityBrain.prototype.promptForTarget = function(nextNeededPromptTargetInfo, sourceTileKeyStr, checkForTargetsOnly) {
	var promptTargetsExist = false;

	debug("Need to prompt for target: " + nextNeededPromptTargetInfo.promptId);

	/*
	Move Target Tile requires these targets:
	- TrifleTargetPromptId.movedTilePoint
	- TrifleTargetPromptId.movedTileDestinationPoint
	 */

	if (nextNeededPromptTargetInfo.promptId === TrifleTargetPromptId.movedTilePoint) {
		if (this.abilityObject.abilityInfo.targetTypes.length === 1
				&& this.abilityObject.abilityInfo.targetTypes.includes(TrifleTargetType.triggerTargetTiles)) {
			/* this.abilityObject.triggerTargetTilePoints.forEach((targetTilePoint) => {
				targetTilePoint.addType(POSSIBLE_MOVE);
			}); */	// This breaks when targeting only certain trigger targets, which we need to do
			var abilityTargetTiles = [];
			var abilityTargetTilePoints = [];
			if (this.abilityObject.abilityInfo.targetTypes && this.abilityObject.abilityInfo.targetTypes.length) {
				this.abilityObject.abilityInfo.targetTypes.forEach((targetType) => {
					var targetBrain = TrifleBrainFactory.createTargetBrain(targetType, this.abilityObject);
		
					abilityTargetTiles = abilityTargetTiles.concat(targetBrain.targetTiles);
					abilityTargetTilePoints = abilityTargetTilePoints.concat(targetBrain.targetTilePoints);
				});
			}

			abilityTargetTilePoints.forEach((targetTilePoint) => {
				promptTargetsExist = true;
				if (!checkForTargetsOnly) {
					targetTilePoint.addType(POSSIBLE_MOVE);
				}
			});
		} else {
			debug("Prompting not supported yet for this ability");
		}
	} else if (nextNeededPromptTargetInfo.promptId === TrifleTargetPromptId.movedTileDestinationPoint
			&& !checkForTargetsOnly) {
		var movedTilePoint = this.abilityObject.promptTargetInfo[sourceTileKeyStr][TrifleTargetPromptId.movedTilePoint];

		if (this.abilityObject.abilityInfo.targetTileMovements) {
			this.abilityObject.abilityInfo.targetTileMovements.forEach((movementInfo) => {
				// Clone movementInfo to avoid mutating the shared tile definition (which causes circular reference errors in JSON.stringify)
				const movementInfoWithTarget = { ...movementInfo, targetTilePoint: this.abilityObject.sourceTilePoint };
				this.abilityObject.board.setPossibleMovesForMovement(movementInfoWithTarget, this.abilityObject.board.getBoardPointFromRowAndCol(movedTilePoint.rowAndColumn));

				// Can check for any possible movements that were marked.. but for now, assume there are some
				promptTargetsExist = true;
			});
		} else {
			debug("Missing targetTileMovements");
		}
	}

	debug("promptTargetsExist for move target tile ability prompt? : " + promptTargetsExist);
	return promptTargetsExist;
};
