
Trifle.WhenDeployedTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

Trifle.WhenDeployedTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	if (!this.triggerContext.lastTurnAction.boardPointStart) {
		var possibleTargetTile = this.triggerContext.lastTurnAction.tileMovedOrPlaced;
		var possibleTargetPoint = this.triggerContext.lastTurnAction.boardPointEnd;

		var triggerHelper = new Trifle.TriggerHelper(this.triggerContext, possibleTargetPoint);

		if (triggerHelper.tileIsTargeted(possibleTargetTile)) {
			this.targetTiles.push(possibleTargetTile);
			this.targetTilePoints.push(possibleTargetPoint);
		}
	}

	return this.targetTilePoints.length > 0;
};


