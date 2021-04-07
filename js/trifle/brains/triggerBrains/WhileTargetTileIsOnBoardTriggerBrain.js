
Trifle.WhileTargetTileIsOnBoardTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

Trifle.WhileTargetTileIsOnBoardTriggerBrain.prototype.isTriggerMet = function() {
	var self = this;
	this.board.forEachBoardPointWithTile(function(boardPointWithTile) {
		var triggerHelper = new Trifle.TriggerHelper(self.triggerContext, boardPointWithTile);
		if (triggerHelper.tileIsTargeted()) {
			self.targetTiles.push(boardPointWithTile.tile);
			self.targetTilePoints.push(boardPointWithTile);
		}
	});

	return this.targetTiles.length > 0;
};


