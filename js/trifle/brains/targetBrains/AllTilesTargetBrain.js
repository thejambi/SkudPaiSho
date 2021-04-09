
Trifle.AllTilesTargetBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;

	this.targetTiles = [];
	this.targetTilePoints = [];
	
	this.setTargets();
}

Trifle.AllTilesTargetBrain.prototype.setTargets = function() {
	
	var self = this;
	this.board.forEachBoardPointWithTile(function(boardPointWithTile) {
		var targetHelper = new Trifle.TargetHelper(self.abilityObject, boardPointWithTile, self);
		if (targetHelper.tileIsTargeted()) {
			self.targetTiles.push(boardPointWithTile.tile);
			self.targetTilePoints.push(boardPointWithTile);
			debug("All Tiles Target Brain found target: ");
			debug(boardPointWithTile);
		}
	});

	this.board.tileManager.getAllTiles().forEach(function(tile) {
		var targetHelper = new Trifle.TargetHelper(self.abilityObject, null, self, tile);
		if (targetHelper.tileIsTargeted()) {
			self.targetTiles.push(tile);
			debug("All Tiles Target Brain found target: ");
			debug(tile);
		}
	});
};


