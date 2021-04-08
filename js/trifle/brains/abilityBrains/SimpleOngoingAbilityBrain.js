
Trifle.SimpleOngoingAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.SimpleOngoingAbilityBrain.prototype.activateAbility = function() {
	debug("Simple Ongoing ability activating...");

	var targetTiles = this.abilityObject.targetTiles;

	debug("Target Tiles:");
	debug(targetTiles);
};
