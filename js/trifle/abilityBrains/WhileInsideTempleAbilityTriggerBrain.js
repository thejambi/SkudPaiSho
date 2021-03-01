
Trifle.WhileInsideTempleAbilityTriggerBrain = function(board) {
	this.board = board;
}

Trifle.WhileInsideTempleAbilityTriggerBrain.prototype.isAbilityActive = function(pointWithTile, tile, tileInfo) {
	return pointWithTile.isType(TEMPLE);
};
