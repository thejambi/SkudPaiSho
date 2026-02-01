
export function TrifleCaptureTargetTilesAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

TrifleCaptureTargetTilesAbilityBrain.prototype.activateAbility = function() {
	var targetTilePoints = this.abilityObject.abilityTargetTilePoints;

	this.capturedTiles = [];
	var lastCapturedPoint = null;

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
				lastCapturedPoint = targetTilePoint;
			}
		});
	}

	// If moveSourceToTargetPosition is set, move the source tile to the last captured tile's position
	if (this.abilityObject.abilityInfo.moveSourceToTargetPosition && lastCapturedPoint && this.capturedTiles.length > 0) {
		var sourceTile = this.abilityObject.sourceTile;
		var sourcePoint = sourceTile.seatedPoint;

		// Remove tile from current position
		if (sourcePoint) {
			sourcePoint.removeTile();
		}

		// Place tile at captured position
		lastCapturedPoint.putTile(sourceTile);
		sourceTile.seatedPoint = lastCapturedPoint;
	}

	if (this.capturedTiles.length > 0) {
		this.abilityObject.boardChanged = true;
	}

	return {
		capturedTiles: this.capturedTiles
	};
};
