
Trifle.WhileInsideTempleTriggerBrain = function(board) {
	this.board = board;
}

Trifle.WhileInsideTempleTriggerBrain.prototype.isAbilityActive = function(pointWithTile, tile, tileInfo) {
	return pointWithTile.isType(TEMPLE);
};
