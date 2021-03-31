
Trifle.CaptureTilesAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.CaptureTilesAbilityBrain.prototype.activateAbility = function() {
	debug("Capture Tiles ability activating...");
	// Attach ability to target tile
	// Get target tiles
	var targetTilePoints = this.abilityObject.targetTilePoints;

	debug("Target Tile Points:");
	debug(targetTilePoints);

	this.capturedTiles = [];

	var self = this;
	if (targetTilePoints && targetTilePoints.length > 0) {
		targetTilePoints.forEach(function(targetTilePoint) {
			var capturedTile = targetTilePoint.removeTile();
			debug("Ability is capturing tile: ");
			debug(capturedTile);
			self.capturedTiles.push(capturedTile);
		});
	}

	if (this.capturedTiles.length > 0) {
		this.abilityObject.boardChanged = true;
	}
};
