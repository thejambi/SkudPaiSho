


Trifle.Ability = function(tileAbilityInfo, tile, tileInfo, triggerBrainMap) {
	this.abilityType = tileAbilityInfo.type;
	this.abilityInfo = tileAbilityInfo;
	this.sourceTile = tile;
	this.sourceTileInfo = tileInfo;
	this.triggerBrainMap = triggerBrainMap;

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

Trifle.Ability.prototype.boardChangedAfterActivation = function() {
	return this.boardChanged;
};

Trifle.Ability.prototype.setTargetTiles = function() {
	this.targetTiles = [];

	var self = this;

	if (this.abilityInfo.targetTileTypes
			&& this.abilityInfo.targetTileTypes.includes(Trifle.TileCategory.thisTile)) {
		Object.values(this.triggerBrainMap).forEach(function(triggerBrain) {
			if (triggerBrain.getThisTile) {
				var theThisTile = triggerBrain.getThisTile();
				if (!self.targetTiles.includes(theThisTile)) {
					self.targetTiles.push(theThisTile);
				}
			}
		});
	}
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
