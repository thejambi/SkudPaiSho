
Trifle.MoveTargetTileAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.MoveTargetTileAbilityBrain.prototype.activateAbility = function() {
	var promptTargetInfo = this.abilityObject.promptTargetInfo;

	debug("PUSHING");

	var sourceTileKey = JSON.stringify(Trifle.AbilityManager.buildSourceTileKeyObject(this.abilityObject.sourceTile));

	if (promptTargetInfo 
			&& promptTargetInfo[sourceTileKey]
			&& promptTargetInfo[sourceTileKey][Trifle.TargetPromptId.movedTilePoint]
			&& promptTargetInfo[sourceTileKey][Trifle.TargetPromptId.movedTileDestinationPoint]) {
		var movedTilePoint = promptTargetInfo[sourceTileKey][Trifle.TargetPromptId.movedTilePoint];
		var movedTileDestinationPoint = promptTargetInfo[sourceTileKey][Trifle.TargetPromptId.movedTileDestinationPoint];
		
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

Trifle.MoveTargetTileAbilityBrain.prototype.promptForTarget = function(nextNeededPromptTargetInfo, sourceTileKeyStr, checkForTargetsOnly) {
	var promptTargetsExist = false;

	debug("Need to prompt for target: " + nextNeededPromptTargetInfo.promptId);

	/*
	Move Target Tile requires these targets:
	- Trifle.TargetPromptId.movedTilePoint
	- Trifle.TargetPromptId.movedTileDestinationPoint
	 */

	if (nextNeededPromptTargetInfo.promptId === Trifle.TargetPromptId.movedTilePoint) {
		if (this.abilityObject.abilityInfo.targetTypes.length === 1
				&& this.abilityObject.abilityInfo.targetTypes.includes(Trifle.TargetType.triggerTargetTiles)) {
			/* this.abilityObject.triggerTargetTilePoints.forEach((targetTilePoint) => {
				targetTilePoint.addType(POSSIBLE_MOVE);
			}); */	// This breaks when targeting only certain trigger targets, which we need to do
			var abilityTargetTiles = [];
			var abilityTargetTilePoints = [];
			if (this.abilityObject.abilityInfo.targetTypes && this.abilityObject.abilityInfo.targetTypes.length) {
				this.abilityObject.abilityInfo.targetTypes.forEach((targetType) => {
					var targetBrain = Trifle.BrainFactory.createTargetBrain(targetType, this.abilityObject);
		
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
	} else if (nextNeededPromptTargetInfo.promptId === Trifle.TargetPromptId.movedTileDestinationPoint
			&& !checkForTargetsOnly) {
		// this.abilityObject.board.promptForBoardPointInAVeryHackyWay();

		var movedTilePoint = this.abilityObject.promptTargetInfo[sourceTileKeyStr][Trifle.TargetPromptId.movedTilePoint];

		if (this.abilityObject.abilityInfo.targetTileMovements) {
			this.abilityObject.abilityInfo.targetTileMovements.forEach((movementInfo) => {
				movementInfo.targetTilePoint = this.abilityObject.sourceTilePoint;	// TODO targetTileTypes not being checked yet...
				this.abilityObject.board.setPossibleMovesForMovement(movementInfo, this.abilityObject.board.getBoardPointFromRowAndCol(movedTilePoint.rowAndColumn));

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
