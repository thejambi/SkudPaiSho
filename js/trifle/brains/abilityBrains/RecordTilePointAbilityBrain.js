
Trifle.RecordTilePointAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.RecordTilePointAbilityBrain.prototype.activateAbility = function() {
	var targetTilePoints = this.abilityObject.abilityTargetTilePoints;

	var self = this;
	if (targetTilePoints && targetTilePoints.length > 0) {
		targetTilePoints.forEach(function(targetTilePoint) {
			self.abilityObject.board.recordTilePoint(targetTilePoint, self.abilityObject.abilityInfo.recordTilePointType);
		});
	}
};
