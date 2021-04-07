
Trifle.WhenTargetTileMovesFromWithinZoneTriggerBrain = function(triggerContext) {
	this.targetTiles = [];
	this.targetTilePoints = [];
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;

	this.possibleTargetTile = triggerContext.lastTurnAction.tileMovedOrPlaced;
	this.possibleTargetTileInfo = triggerContext.lastTurnAction.tileMovedOrPlacedInfo;
	this.possibleTargetTileMovementStartPoint = triggerContext.lastTurnAction.boardPointStart;
	this.possibleTargetTileMovementEndPoint = triggerContext.lastTurnAction.boardPointEnd;

	this.thisTile = triggerContext.tile;
	this.thisTileInfo = triggerContext.tileInfo;
	this.thisTilePoint = triggerContext.pointWithTile;
}

Trifle.WhenTargetTileMovesFromWithinZoneTriggerBrain.prototype.isTriggerMet = function() {
	/* Look at the tile that moved, did it just move from this tile's zone? Is it targeted? */

	if (this.possibleTargetTileMovementStartPoint 
			&& this.possibleTargetTileMovementEndPoint.tile === this.possibleTargetTile) {

		var zonesStartPointIsIn = this.board.getZonesPointIsWithin(this.possibleTargetTileMovementStartPoint);

		var possibleTargetIsInZone = false;
		var self = this;
		zonesStartPointIsIn.forEach(function(zonePoint) {
			if (zonePoint === self.thisTilePoint) {
				possibleTargetIsInZone = true;
				return;
			}
		});

		if (possibleTargetIsInZone) {
			var triggerHelper = new Trifle.TriggerHelper(this.triggerContext, this.possibleTargetTileMovementEndPoint);
			if (triggerHelper.tileIsTargeted()) {
				this.targetTiles.push(this.possibleTargetTile);
				this.targetTilePoints.push(this.possibleTargetTileMovementEndPoint);
			}
		}
	}

	return this.targetTiles.length > 0;
};
