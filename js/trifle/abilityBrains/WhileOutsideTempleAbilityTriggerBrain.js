
Trifle.WhileOutsideTempleAbilityTriggerBrain = function(board) {
	this.board = board;
}

Trifle.WhileOutsideTempleAbilityTriggerBrain.prototype.isAbilityActive = function(pointWithTile, tile, tileInfo) {
	return !pointWithTile.isType(TEMPLE);
};
