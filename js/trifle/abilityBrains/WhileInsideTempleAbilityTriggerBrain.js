
function WhileInsideTempleAbilityTriggerBrain(board) {
	this.board = board;
}

WhileInsideTempleAbilityTriggerBrain.prototype.isAbilityActive = function(pointWithTile, tile, tileInfo) {
	return pointWithTile.isType(TEMPLE);
};
