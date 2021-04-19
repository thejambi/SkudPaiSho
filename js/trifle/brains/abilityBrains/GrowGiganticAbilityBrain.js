
Trifle.GrowGiganticAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;
}

Trifle.GrowGiganticAbilityBrain.prototype.activateAbility = function() {
	var targetTilePoints = this.abilityObject.abilityTargetTilePoints;

	if (this.abilityObject.sourceTile.isGigantic) {
		return;	// End
	}

	this.abilityObject.sourceTile.isGigantic = true;

	var self = this;
	if (targetTilePoints && targetTilePoints.length > 0) {
		targetTilePoints.forEach(function(targetTilePoint) {
			var occupiedPoints = self.board.getGrowGiantOccupiedPoints(targetTilePoint);
			occupiedPoints.forEach(function(occupyPoint) {
				occupyPoint.putTile(self.abilityObject.sourceTile);
				occupyPoint.occupiedByAbility = true;
				occupyPoint.pointOccupiedBy = self.abilityObject.sourceTilePoint;
				// occupyPoint.isGigantic = true;
			});

			self.abilityObject.sourceTilePoint.otherPointsOccupied = occupiedPoints;
			// self.abilityObject.sourceTilePoint.isGigantic = true;
		});
	}
};
