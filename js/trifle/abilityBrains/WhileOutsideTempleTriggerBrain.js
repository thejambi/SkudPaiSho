
Trifle.WhileOutsideTempleTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
}

Trifle.WhileOutsideTempleTriggerBrain.prototype.isTriggerMet = function(pointWithTile, tile, tileInfo) {
	return !pointWithTile.isType(TEMPLE);
};
