
Trifle.ImmobilizeTilesAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.ImmobilizeTilesAbilityBrain.prototype.activateAbility = function() {
	debug("Immobilize Tiles ability activating...");
	// Attach ability to target tile
	// Get target tiles
	var targetTiles = this.abilityObject.targetTiles;

	debug("Target Tiles:");
	debug(targetTiles);

	
};
