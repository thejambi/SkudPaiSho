
Trifle.WhileTargetTileIsSurroundingTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

Trifle.WhileTargetTileIsSurroundingTriggerBrain.prototype.isTriggerMet = function() {
	/* Get surrounding tiles...  */
	var surroundingPoints = this.board.getSurroundingBoardPoints(this.triggerContext.pointWithTile);

	var self = this;

	surroundingPoints.forEach(function(surroundingPoints) {
		if (surroundingPoints.hasTile()) {
			var triggerHelper = new Trifle.TriggerHelper(self.triggerContext, surroundingPoints);
			if (triggerHelper.tileIsTargeted()) {
				self.targetTiles.push(surroundingPoints.tile);
				self.targetTilePoints.push(surroundingPoints);
			}
		}
	});

	return this.targetTiles.length > 0;
};


