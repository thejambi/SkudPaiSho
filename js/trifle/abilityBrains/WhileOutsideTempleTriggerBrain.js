
Trifle.WhileOutsideTempleTriggerBrain = function(board) {
	this.board = board;
}

Trifle.WhileOutsideTempleTriggerBrain.prototype.isAbilityActive = function(pointWithTile, tile, tileInfo) {
	return !pointWithTile.isType(TEMPLE);
};
