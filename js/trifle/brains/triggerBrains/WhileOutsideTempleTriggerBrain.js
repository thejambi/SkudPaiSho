
Trifle.WhileOutsideTempleTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;

	// TODO 
}

Trifle.WhileOutsideTempleTriggerBrain.prototype.isTriggerMet = function() {
	return !this.triggerContext.pointWithTile.isType(TEMPLE);
};
