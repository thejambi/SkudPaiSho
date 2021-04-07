
Trifle.CancelZoneAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;

	this.targetTiles = [];
	this.targetTilePoints = [];
	this.setTargetTiles();
}

Trifle.CancelZoneAbilityBrain.prototype.setTargetTiles = function() {

	

	this.targetTiles = this.abilityObject.targetTiles;

	debug("Target Tiles:");
	debug(this.targetTiles);
};

Trifle.CancelZoneAbilityBrain.prototype.activateAbility = function() {
	debug("Cancel Zone ability activating...");
	// Nothing to do, ability just exists
};

Trifle.CancelZoneAbilityBrain.prototype.getTargetTiles = function() {
	return this.targetTiles;
}

Trifle.CancelZoneAbilityBrain.prototype.getTargetTilesPoints = function() {
	return this.targetTilePoints;
};
