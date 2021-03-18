


Trifle.Ability = function(tileAbilityInfo, tile, tileInfo, triggerBrainMap) {
	this.abilityType = tileAbilityInfo.type;
	this.abilityInfo = tileAbilityInfo;
	this.tile = tile;
	this.tileInfo = tileInfo;
	this.triggerBrainMap = triggerBrainMap;

	debug("New Ability created! " + this.abilityType + " on tile " + this.tile.code);
	this.boardChanged = false;
}

Trifle.Ability.prototype.activateAbility = function() {
	// Get AbilityBrain
	debug("Activating ability!");
	debug(this);

	this.abilityBrain = Trifle.BrainFactory.createAbilityBrain(this.abilityType, this);
	this.abilityBrain.activateAbility();
};

Trifle.Ability.prototype.boardChangedAfterActivation = function() {
	return this.boardChanged;
};
