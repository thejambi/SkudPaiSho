
Trifle.WhileTargetTileIsAdjacentTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
}

Trifle.WhileTargetTileIsAdjacentTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];

	/* Get adjacent tiles...  */
	var adjacentPoints = this.board.getAdjacentPoints(this.triggerContext.pointWithTile);

	var self = this;

	adjacentPoints.forEach(function(adjacentPoint) {
		if (adjacentPoint.hasTile()) {
			var triggerHelper = new Trifle.TriggerHelper(self.triggerContext, adjacentPoint);
			if (triggerHelper.tileIsTargeted()) {
				self.targetTiles.push(adjacentPoint.tile);
			}
		}
	});

	return this.targetTiles.length > 0;
};


