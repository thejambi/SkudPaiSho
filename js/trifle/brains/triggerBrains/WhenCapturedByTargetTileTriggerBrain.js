
Trifle.WhenCapturedByTargetTileTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];

	this.possibleTargetTile = triggerContext.lastTurnAction.tileMovedOrPlaced;
	this.possibleTargetTileInfo = triggerContext.lastTurnAction.tileMovedOrPlacedInfo;
	this.possibleTargetTilePoint = triggerContext.lastTurnAction.boardPointEnd;

	if (!this.possibleTargetTilePoint) {
		this.possibleTargetTilePoint = triggerContext.lastTurnAction.tileMovedOrPlaced.seatedPoint;
	}

	this.thisTile = triggerContext.tile;
	this.thisTileInfo = triggerContext.tileInfo;
	this.thisTilePoint = triggerContext.pointWithTile;

	this.capturedTiles = triggerContext.lastTurnAction.capturedTiles;

	this.setAction();
}

Trifle.WhenCapturedByTargetTileTriggerBrain.prototype.setAction = function() {
	this.triggeringAction = {
		actionType: "Capture",	// TODO clean up!
		tileId: this.thisTile.tileId
	};
};

Trifle.WhenCapturedByTargetTileTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	if (this.possibleTargetTilePoint && this.possibleTargetTilePoint.tile === this.possibleTargetTile) {
		if (this.capturedTiles.includes(this.thisTile)) {
			var triggerHelper = new Trifle.TriggerHelper(this.triggerContext, this.possibleTargetTilePoint, this.possibleTargetTile);
			if (triggerHelper.tileIsTargeted()) {
				this.targetTiles.push(this.possibleTargetTilePoint.tile);
				this.targetTilePoints.push(this.possibleTargetTilePoint);
			}
		}
	}

	return this.targetTiles.length > 0;
};


