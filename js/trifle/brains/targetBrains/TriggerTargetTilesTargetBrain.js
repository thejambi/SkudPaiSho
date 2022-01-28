
Trifle.TriggerTargetTilesTargetBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;

	this.targetTiles = [];
	this.targetTilePoints = [];

	this.setTargets();
}

Trifle.TriggerTargetTilesTargetBrain.prototype.setTargets = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	var possibleTargetTiles = [];
	var possibleTargetPoints = [];

	var self = this;

	if (this.abilityObject.abilityInfo.triggerTypeToTarget) {
		var targets = this.abilityObject.getTriggerTypeTargets(this.abilityObject.abilityInfo.triggerTypeToTarget);
		possibleTargetTiles = targets.targetTiles;
		possibleTargetPoints = targets.targetTilePoints;
	} else {
		possibleTargetTiles = this.abilityObject.triggerTargetTiles;
		possibleTargetPoints = this.abilityObject.triggerTargetTilePoints;
	}
	
	possibleTargetPoints.forEach(function(boardPointWithTile) {
		var targetHelper = new Trifle.TargetHelper(self.abilityObject, boardPointWithTile, self);
		if (targetHelper.tileIsTargeted()) {
			self.targetTiles.push(boardPointWithTile.tile);
			self.targetTilePoints.push(boardPointWithTile);
		}
	});

	possibleTargetTiles.forEach(function(possibleTargetTile) {
		var targetHelper = new Trifle.TargetHelper(self.abilityObject, null, self, possibleTargetTile);
		if (targetHelper.tileIsTargeted() && !self.targetTiles.includes(possibleTargetTile)) {
			self.targetTiles.push(possibleTargetTile);
		}
	});
};


