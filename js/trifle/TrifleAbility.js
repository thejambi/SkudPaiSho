


Trifle.Ability = function(tileAbilityInfo, tile, tileInfo, triggerBrainMap) {
	this.abilityType = tileAbilityInfo.type;
	this.abilityInfo = tileAbilityInfo;
	this.sourceTile = tile;
	this.sourceTileInfo = tileInfo;
	this.triggerBrainMap = triggerBrainMap;

	this.targetTiles = [];
	this.setTargetTiles();

	debug("New Ability created! " + this.abilityType + " from tile " + this.sourceTile.code);
	this.boardChanged = false;
}

Trifle.Ability.prototype.activateAbility = function() {
	// Get AbilityBrain
	debug("Activating ability!");
	debug(this);

	this.abilityBrain = Trifle.BrainFactory.createAbilityBrain(this.abilityType, this);
	this.abilityActivatedResults = this.abilityBrain.activateAbility();
};

Trifle.Ability.prototype.deactivate = function() {
	// What needed to do?
	debug("Deactivating ability: ");
	debug(this);
};

Trifle.Ability.prototype.boardChangedAfterActivation = function() {
	return this.boardChanged;
};

Trifle.Ability.prototype.setTargetTiles = function() {
	this.targetTiles = null;

	var self = this;

	Object.values(this.triggerBrainMap).forEach(function(triggerBrain) {
		if (triggerBrain.targetTiles && triggerBrain.targetTiles.length) {
			if (self.targetTiles === null) {
				self.targetTiles = triggerBrain.targetTiles;
			} else {
				self.targetTiles = arrayIntersection(self.targetTiles, triggerBrain.targetTiles);
			}
		}
	});
	// support other target tile types.......

	debug("Target Tiles:");
	debug(this.targetTiles);

	return this.targetTiles;
};

Trifle.Ability.prototype.appearsToBeTheSameAs = function(otherAbility) {
	return otherAbility 
		&& this.abilityType === otherAbility.abilityType
		&& this.sourceTile.id === otherAbility.sourceTile.id
		&& this.targetTiles.equals(otherAbility.targetTiles);
};

Trifle.Ability.prototype.targetsTile = function(tile) {
	return this.targetTiles.includes(tile);
};
