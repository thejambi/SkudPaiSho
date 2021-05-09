
Trifle.ProtectFromCaptureAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.ProtectFromCaptureAbilityBrain.prototype.activateAbility = function() {
	debug("Protect From Capture ability activating...");

	var targetTiles = this.abilityObject.targetTiles;

	debug("Target Tiles:");
	debug(targetTiles);
};
