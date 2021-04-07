


Trifle.Ability = function(abilityContext) {
	this.board = abilityContext.board;
	this.abilityType = abilityContext.tileAbilityInfo.type;
	this.abilityInfo = abilityContext.tileAbilityInfo;
	this.sourceTile = abilityContext.tile;
	this.sourceTileInfo = abilityContext.tileInfo;
	this.triggerBrainMap = abilityContext.triggerBrainMap;

	this.triggerTargetTiles = [];
	this.triggerTargetTilePoints = [];
	this.setTriggerTargetTiles();

	this.abilityTargetTiles = [];
	this.abilityTargetTilePoints = [];
	this.setAbilityTargetTiles();

	this.abilityBrain = Trifle.BrainFactory.createAbilityBrain(this.abilityType, this);
	// this.abilityTargetTiles = this.abilityBrain.getTargetTiles();
	// this.abilityTargetTilePoints = this.abilityBrain.getTargetTilePoints();

	debug("New Ability created! " + this.abilityType + " from tile " + this.sourceTile.code);
	this.boardChanged = false;
}

Trifle.Ability.prototype.setAbilityTargetTiles = function() {
	this.targetBrains = [];
	
	this.abilityTargetTiles = [];
	this.abilityTargetTilePoints = [];

	var self = this;

	if (this.abilityInfo.targetTypes && this.abilityInfo.targetTypes.length) {
		this.abilityInfo.targetTypes.forEach(function(targetType) {
			var targetBrain = Trifle.BrainFactory.createTargetBrain(targetType, self);

			self.targetBrains.push(targetBrain);

			self.abilityTargetTiles = self.abilityTargetTiles.concat(targetBrain.targetTiles);
			self.abilityTargetTilePoints = self.abilityTargetTilePoints.concat(targetBrain.targetTilePoints);
		});
	} else {
		debug("--- TILE ABILITY DOES NOT HAVE TARGET TYPES---");
		debug(this.sourceTile);
	}

	
	// TODO all this ^^^^^
};

Trifle.Ability.prototype.activateAbility = function() {
	// Get AbilityBrain
	debug("Activating ability!");
	debug(this);

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

Trifle.Ability.prototype.setTriggerTargetTiles = function() {
	this.triggerTargetTiles = null;

	var self = this;

	Object.values(this.triggerBrainMap).forEach(function(triggerBrain) {
		if (triggerBrain.targetTiles && triggerBrain.targetTiles.length) {
			// TODO split tiles vs points?
			if (self.triggerTargetTiles === null) {
				self.triggerTargetTiles = triggerBrain.targetTiles;
				self.triggerTargetTilePoints = triggerBrain.targetTilePoints;
			} else {
				self.triggerTargetTiles = arrayIntersection(self.triggerTargetTiles, triggerBrain.targetTiles);
				self.triggerTargetTilePoints = arrayIntersection(self.triggerTargetTilePoints, triggerBrain.targetTilePoints);
			}
		}
	});

	if (!this.triggerTargetTiles) {
		this.triggerTargetTiles = [];
	}

	debug("Target Tiles:");
	debug(this.triggerTargetTiles);
};

Trifle.Ability.prototype.appearsToBeTheSameAs = function(otherAbility) {
	return otherAbility 
		&& this.abilityType === otherAbility.abilityType
		&& this.sourceTile.id === otherAbility.sourceTile.id
		&& this.triggerTargetTiles.equals(otherAbility.targetTiles);
};

Trifle.Ability.prototype.abilityTargetsTile = function(tile) {
	return this.abilityTargetTiles.includes(tile);
};


