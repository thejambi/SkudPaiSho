
Trifle.WhenTargetTileLandsSurroundingTriggerBrain = function(triggerContext) {
	this.targetTiles = [];
	this.targetTilePoints = [];
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;

	this.possibleTargetTile = triggerContext.lastTurnAction.tileMovedOrPlaced;
	this.possibleTargetTileInfo = triggerContext.lastTurnAction.tileMovedOrPlacedInfo;
	this.possibleTargetTilePoint = triggerContext.lastTurnAction.boardPointEnd;

	this.thisTile = triggerContext.tile;
	this.thisTileInfo = triggerContext.tileInfo;
	this.thisTilePoint = triggerContext.pointWithTile;
}

Trifle.WhenTargetTileLandsSurroundingTriggerBrain.prototype.isTriggerMet = function() {
	/* Look at the tile that moved, did it just land surrounding this tile? Is it targeted? */

	if (this.possibleTargetTilePoint && this.possibleTargetTilePoint.tile === this.possibleTargetTile) {

		var surroundingPoints = this.board.getSurroundingBoardPoints(this.thisTilePoint);

		var possibleTargetIsSurrounding = false;
		var self = this;
		surroundingPoints.forEach(function(surroundingPoint) {
			if (surroundingPoint === self.possibleTargetTilePoint) {
				possibleTargetIsSurrounding = true;
				return;
			}
		});

		if (possibleTargetIsSurrounding) {
			var triggerHelper = new Trifle.TriggerHelper(this.triggerContext, this.possibleTargetTilePoint);
			if (triggerHelper.tileIsTargeted()) {
				this.targetTiles.push(this.possibleTargetTilePoint.tile);
				this.targetTilePoints.push(this.possibleTargetTilePoint);
			}
		}
	}

	return this.targetTiles.length > 0;
};
