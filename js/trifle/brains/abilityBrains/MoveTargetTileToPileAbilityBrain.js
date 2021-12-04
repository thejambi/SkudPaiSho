
Trifle.MoveTargetTileToPileAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.MoveTargetTileToPileAbilityBrain.prototype.activateAbility = function() {
	var targetTiles = this.abilityObject.abilityTargetTiles;

	this.movedTiles = [];

	var self = this;
	if (targetTiles && targetTiles.length > 0) {
		targetTiles.forEach(function(targetTile) {
			// Is tile on the board?
			if (targetTile.seatedPoint.hasTile() && targetTile.seatedPoint.tile === targetTile) {
				// Need to remove tile
				var capturedTile = self.abilityObject.board.captureTileOnPoint(targetTile.seatedPoint);
				self.abilityObject.boardChanged = true;
				// Does this count as being captured by ability?
				targetTile.beingCapturedByAbility = true;
			}
			targetTile.moveToPile = self.abilityObject.abilityInfo.destinationPile;
			self.movedTiles.push(targetTile);
		});
	}

	return {
		tilesMovedToPiles: this.movedTiles
	};
};
