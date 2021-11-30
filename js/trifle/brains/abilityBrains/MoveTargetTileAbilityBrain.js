
Trifle.MoveTargetTileAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.MoveTargetTileAbilityBrain.prototype.activateAbility = function() {
	/* var targetTilePoint = this.abilityObject.abilityTargetTilePoints[0];
	var targetTile = this.abilityObject.abilityTargetTiles[0];

	var recordedPointType = this.abilityObject.abilityInfo.recordedPointType;

	if (recordedPointType) {
		var destinationPoint = this.abilityObject.board.recordedTilePoints[recordedPointType][targetTile.id];
		this.abilityObject.board.placeTile(targetTile, destinationPoint);
		this.abilityObject.boardChanged = true;
	} else {
		debug("No recorded point type defined");
	} */

	var promptTargetInfo = this.abilityObject.promptTargetInfo;
	if (promptTargetInfo 
			&& promptTargetInfo[Trifle.TargetPromptId.movedTilePoint]
			&& promptTargetInfo[Trifle.TargetPromptId.movedTileDestinationPoint]) {
		var movedTilePoint = promptTargetInfo[Trifle.TargetPromptId.movedTilePoint];
		var movedTileDestinationPoint = promptTargetInfo[Trifle.TargetPromptId.movedTileDestinationPoint];
		
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
