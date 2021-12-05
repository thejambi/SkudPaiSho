
Trifle.WhenCapturingTargetTileTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];

	if (triggerContext.lastTurnAction.capturedTiles) {
		if (triggerContext.lastTurnAction.capturedTiles.length > 1) {
			debug("More than 1 captured tile? What to do?")
		} else if (triggerContext.lastTurnAction.capturedTiles.length === 1) {
			this.possibleTargetTile = triggerContext.lastTurnAction.capturedTiles[0];
		}
	}

	this.thisTile = triggerContext.tile;
	this.thisTileInfo = triggerContext.tileInfo;
	this.thisTilePoint = triggerContext.pointWithTile;
}

Trifle.WhenCapturingTargetTileTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	var tileMovedOrPlaced = this.triggerContext.lastTurnAction.tileMovedOrPlaced;

	if (this.thisTile === tileMovedOrPlaced && this.possibleTargetTile) {
		var triggerHelper = new Trifle.TriggerHelper(this.triggerContext, null, this.possibleTargetTile);
		if (triggerHelper.tileIsTargeted()) {
			this.targetTiles.push(this.possibleTargetTile);
		}
	}

	return this.targetTiles.length > 0;
};


