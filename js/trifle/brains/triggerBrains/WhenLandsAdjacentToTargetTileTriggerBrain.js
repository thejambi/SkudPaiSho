
Trifle.WhenLandsAdjacentToTargetTileTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

Trifle.WhenLandsAdjacentToTargetTileTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	if (this.triggerContext.lastTurnAction.tileMovedOrPlaced === this.triggerContext.tile) {
		var adjacentPoints = this.board.getAdjacentPoints(this.triggerContext.pointWithTile);

		var self = this;

		adjacentPoints.forEach(function(adjacentPoint) {
			if (adjacentPoint.hasTile()) {
				var triggerHelper = new Trifle.TriggerHelper(self.triggerContext, adjacentPoint);
				if (triggerHelper.tileIsTargeted()) {
					self.targetTiles.push(adjacentPoint.tile);
					self.targetTilePoints.push(adjacentPoint);
				}
			}
		});
	}

	return this.targetTilePoints.length > 0;
};


