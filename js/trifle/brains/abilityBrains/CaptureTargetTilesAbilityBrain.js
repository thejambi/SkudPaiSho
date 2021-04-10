
Trifle.CaptureTargetTilesAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.CaptureTargetTilesAbilityBrain.prototype.activateAbility = function() {
	var targetTilePoints = this.abilityObject.targetTilePoints;

	this.capturedTiles = [];

	var self = this;
	if (targetTilePoints && targetTilePoints.length > 0) {
		targetTilePoints.forEach(function(targetTilePoint) {
			var capturedTile = targetTilePoint.removeTile();
			self.capturedTiles.push(capturedTile);
		});
	}

	if (this.capturedTiles.length > 0) {
		this.abilityObject.boardChanged = true;
	}
};
