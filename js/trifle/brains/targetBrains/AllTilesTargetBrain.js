
Trifle.AllTilesTargetBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;

	this.targetTiles = [];
	this.targetTilePoints = [];
	
	this.setTargets();
}

Trifle.AllTilesTargetBrain.prototype.setTargets = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];
	
	var self = this;
	this.board.forEachBoardPointWithTile(function(boardPointWithTile) {
		var targetHelper = new Trifle.TargetHelper(self.abilityObject, boardPointWithTile, self);
		if (targetHelper.tileIsTargeted()) {
			self.targetTiles.push(boardPointWithTile.tile);
			self.targetTilePoints.push(boardPointWithTile);
		}
	});

	this.board.tileManager.getAllTiles().forEach(function(tile) {
		var targetHelper = new Trifle.TargetHelper(self.abilityObject, null, self, tile);
		if (targetHelper.tileIsTargeted()) {
			self.targetTiles.push(tile);
		}
	});
};


