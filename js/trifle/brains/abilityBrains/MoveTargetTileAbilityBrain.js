
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
