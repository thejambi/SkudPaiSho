
Trifle.WhileInsideTempleTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
}

Trifle.WhileInsideTempleTriggerBrain.prototype.isTriggerMet = function(pointWithTile, tile, tileInfo) {
	var isInsideTemple = pointWithTile.isType(TEMPLE);
	if (isInsideTemple) {
		this.thisTile = this.triggerContext.tile;
	}

	return isInsideTemple;
};

Trifle.WhileInsideTempleTriggerBrain.prototype.getThisTile = function() {
	return this.thisTile;
};
