
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

	var self = this;

	if (this.abilityObject.abilityInfo.triggerTypeToTarget) {
		var targets = this.abilityObject.getTriggerTypeTargets(this.abilityObject.abilityInfo.triggerTypeToTarget);
		this.targetTiles = targets.targetTiles;
		this.targetTilePoints = targets.targetTilePoints;
	} else {
		this.abilityObject.triggerTargetTilePoints.forEach(function(boardPointWithTile) {
			var targetHelper = new Trifle.TargetHelper(self.abilityObject, boardPointWithTile, self);
			if (targetHelper.tileIsTargeted()) {
				self.targetTiles.push(boardPointWithTile.tile);
				self.targetTilePoints.push(boardPointWithTile);
			}
		});

		this.abilityObject.triggerTargetTiles.forEach(function(possibleTargetTile) {
			var targetHelper = new Trifle.TargetHelper(self.abilityObject, null, self, possibleTargetTile);
			if (targetHelper.tileIsTargeted() && !self.targetTiles.includes(possibleTargetTile)) {
				self.targetTiles.push(possibleTargetTile);
			}
		});
	}
};


