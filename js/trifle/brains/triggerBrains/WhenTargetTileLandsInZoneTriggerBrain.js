
Trifle.WhenTargetTileLandsInZoneTriggerBrain = function(triggerContext) {
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

Trifle.WhenTargetTileLandsInZoneTriggerBrain.prototype.isTriggerMet = function() {
	/* Look at the tile that moved, did it just land in this tile's zone? Is it targeted? */

	if (this.possibleTargetTilePoint.tile === this.possibleTargetTile) {

		var zonesPossibleTargetIsIn = this.board.getZonesPointIsWithin(this.possibleTargetTilePoint);

		var possibleTargetIsInZone = false;
		var self = this;
		zonesPossibleTargetIsIn.forEach(function(zonePoint) {
			if (zonePoint === self.thisTilePoint) {
				possibleTargetIsInZone = true;
				return;
			}
		});

		if (possibleTargetIsInZone) {
			var triggerHelper = new Trifle.TriggerHelper(this.triggerContext, this.possibleTargetTilePoint);
			if (triggerHelper.tileIsTargeted()) {
				this.targetTiles.push(this.possibleTargetTilePoint.tile);
				this.targetTilePoints.push(this.possibleTargetTilePoint);
			}
		}
	}

	return this.targetTiles.length > 0;
};
