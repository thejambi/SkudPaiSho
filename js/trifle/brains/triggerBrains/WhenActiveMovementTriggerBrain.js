
Trifle.WhenActiveMovementTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

Trifle.WhenActiveMovementTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	var isActiveMovement = !this.triggerContext.isPassiveMovement;

	if (isActiveMovement) {
		var activeTilePoint = this.triggerContext.lastTurnAction.boardPointEnd;
		var activeTile = this.triggerContext.lastTurnAction.tileMovedOrPlaced;

		var triggerHelper = new Trifle.TriggerHelper(this.triggerContext, activeTilePoint);
		if (triggerHelper.tileIsTargeted()) {
			this.targetTiles.push(activeTile);
			this.targetTilePoints.push(activeTilePoint);
		}
	}

	return this.targetTiles.length > 0;
};


