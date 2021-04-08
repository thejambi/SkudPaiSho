
Trifle.WhileOutsideTempleTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

Trifle.WhileOutsideTempleTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	
	var isInsideTemple = this.triggerContext.pointWithTile.isType(TEMPLE);
	if (!isInsideTemple) {
		this.thisTile = this.triggerContext.tile;
		this.targetTiles.push(this.thisTile);
		this.targetTilePoints.push(this.triggerContext.pointWithTile);
	}

	return this.targetTiles.length > 0;
};
