
Trifle.WhileInsideTempleTriggerBrain = function(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
}

Trifle.WhileInsideTempleTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	
	var isInsideTemple = this.triggerContext.pointWithTile.isType(TEMPLE);
	if (isInsideTemple) {
		this.thisTile = this.triggerContext.tile;
		this.targetTiles.push(this.thisTile);
	}

	return isInsideTemple;
};


