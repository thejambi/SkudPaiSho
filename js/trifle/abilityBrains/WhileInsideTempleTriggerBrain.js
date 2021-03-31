
Trifle.WhileInsideTempleTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
}

Trifle.WhileInsideTempleTriggerBrain.prototype.isTriggerMet = function(pointWithTile, tile, tileInfo) {
	this.targetTiles = [];
	
	var isInsideTemple = pointWithTile.isType(TEMPLE);
	if (isInsideTemple) {
		this.thisTile = this.triggerContext.tile;
		this.targetTiles.push(this.thisTile);
	}

	return isInsideTemple;
};

Trifle.WhileInsideTempleTriggerBrain.prototype.getThisTile = function() {
	return this.thisTile;
};
