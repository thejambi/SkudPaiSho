
Trifle.CaptureTargetTilesAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.CaptureTargetTilesAbilityBrain.prototype.activateAbility = function() {
	var targetTilePoints = this.abilityObject.abilityTargetTilePoints;

	this.capturedTiles = [];

	var self = this;
	if (targetTilePoints && targetTilePoints.length > 0) {
		targetTilePoints.forEach(function(targetTilePoint) {
			var tileIsCapturable = self.abilityObject.board.targetPointTileIsCapturableByTileAbility(targetTilePoint, self.abilityObject.sourceTile);
			// if (tileIsCapturable && self.abilityObject.board.capturePossibleBasedOnBannersPlayed(self.abilityObject.sourceTile.ownerName, targetTilePoint)) {
				// TODO Remove banner check, will be built in with abilities?
			if (tileIsCapturable || self.abilityObject.abilityInfo.regardlessOfCaptureProtection) {
				var capturedTile = self.abilityObject.board.captureTileOnPoint(targetTilePoint);
				capturedTile.beingCapturedByAbility = true;
				self.capturedTiles.push(capturedTile);
			}
		});
	}

	if (this.capturedTiles.length > 0) {
		this.abilityObject.boardChanged = true;
	}

	return {
		capturedTiles: this.capturedTiles
	};
};
