
Trifle.CancelZoneAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.CancelZoneAbilityBrain.prototype.activateAbility = function() {
	debug("Cancel Zone ability activating...");
	// Attach ability to target tile
	// Get target tiles
	var targetTiles = this.abilityObject.targetTiles;

	debug("Target Tiles:");
	debug(targetTiles);

	
};
