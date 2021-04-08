
Trifle.SurroundingTilesTargetBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;

	this.targetTiles = [];
	this.targetTilePoints = [];
	
	this.setTargets();
}

Trifle.SurroundingTilesTargetBrain.prototype.setTargets = function() {
	var self = this;
	
	this.abilityObject.triggerTargetTilePoints.forEach(function(boardPointWithTile) {
		var targetHelper = new Trifle.TargetHelper(self.abilityObject, boardPointWithTile, self);
		if (targetHelper.tileIsTargeted()) {
			self.targetTiles.push(boardPointWithTile.tile);
			self.targetTilePoints.push(boardPointWithTile);
			debug("Surrounding Tiles Target Brain found target: ");
			debug(boardPointWithTile);
		}
	});
};


