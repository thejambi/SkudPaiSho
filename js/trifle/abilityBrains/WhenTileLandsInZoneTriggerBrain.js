
Trifle.WhenTileLandsInZoneTriggerBrain = function(board) {
	this.board = board;
}

Trifle.WhenTileLandsInZoneTriggerBrain.prototype.isAbilityActive = function(pointWithTile, tile, tileInfo) {
	return pointWithTile.isType(TEMPLE);
};
