
Trifle.WhenLandsSurroundingTargetTileTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

Trifle.WhenLandsSurroundingTargetTileTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	if (this.triggerContext.lastTurnAction.tileMovedOrPlaced === this.triggerContext.tile) {
		var surroundingPoints = this.board.getSurroundingBoardPoints(this.triggerContext.pointWithTile);

		var self = this;

		surroundingPoints.forEach(function(surroundingPoint) {
			if (surroundingPoint.hasTile()) {
				var triggerHelper = new Trifle.TriggerHelper(self.triggerContext, surroundingPoint);
				if (triggerHelper.tileIsTargeted()) {
					self.targetTiles.push(surroundingPoint.tile);
					self.targetTilePoints.push(surroundingPoint);
				}
			}
		});
	}

	return this.targetTilePoints.length > 0;
};


