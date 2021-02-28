
function WhileOutsideTempleAbilityTriggerBrain(board) {
	this.board = board;
}

WhileOutsideTempleAbilityTriggerBrain.prototype.isAbilityActive = function(pointWithTile, tile, tileInfo) {
	return !pointWithTile.isType(TEMPLE);
};
