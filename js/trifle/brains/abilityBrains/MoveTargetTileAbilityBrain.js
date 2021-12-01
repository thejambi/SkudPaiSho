
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
			this.abilityObject.board.moveTile(this.abilityObject.sourceTile.ownerName, movedTilePoint, movedTileDestinationPoint);
			this.abilityObject.boardChanged = true;
		} else {
			debug("Wrong tile, bub");
		}
	}
};

Trifle.MoveTargetTileAbilityBrain.prototype.promptForTarget = function(nextNeededPromptTargetInfo, sourceTileKeyStr) {
	debug("Need to prompt for target: " + nextNeededPromptTargetInfo.promptId);

	/*
	Move Target Tile requires these targets:
	- Trifle.TargetPromptId.movedTilePoint
	- Trifle.TargetPromptId.movedTileDestinationPoint
	 */

	if (nextNeededPromptTargetInfo.promptId === Trifle.TargetPromptId.movedTilePoint) {
		if (this.abilityObject.abilityInfo.targetTypes.length === 1
				&& this.abilityObject.abilityInfo.targetTypes.includes(Trifle.TargetType.triggerTargetTiles)) {
			this.abilityObject.triggerTargetTilePoints.forEach((targetTilePoint) => {
				targetTilePoint.addType(POSSIBLE_MOVE);
			});
		} else {
			debug("Prompting not supported yet for this ability");
		}
	} else if (nextNeededPromptTargetInfo.promptId === Trifle.TargetPromptId.movedTileDestinationPoint) {
		// this.abilityObject.board.promptForBoardPointInAVeryHackyWay();

		var movedTilePoint = this.abilityObject.promptTargetInfo[sourceTileKeyStr][Trifle.TargetPromptId.movedTilePoint];

		if (this.abilityObject.abilityInfo.targetTileMovements) {
			this.abilityObject.abilityInfo.targetTileMovements.forEach((movementInfo) => {
				movementInfo.targetTilePoint = this.abilityObject.sourceTilePoint;	// TODO targetTileTypes not being checked yet...
				this.abilityObject.board.setPossibleMovesForMovement(movementInfo, this.abilityObject.board.getBoardPointFromRowAndCol(movedTilePoint.rowAndColumn));
			});
		} else {
			debug("Missing targetTileMovements");
		}
	}
};
