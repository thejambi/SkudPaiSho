


Trifle.Ability = function(abilityContext) {
	this.board = abilityContext.board;
	this.abilityType = abilityContext.tileAbilityInfo.type;
	this.abilityInfo = abilityContext.tileAbilityInfo;
	this.sourceTile = abilityContext.tile;
	this.sourceTileInfo = abilityContext.tileInfo;
	this.sourceTilePoint = abilityContext.pointWithTile;
	this.triggerBrainMap = abilityContext.triggerBrainMap;
	this.promptTargetInfo = abilityContext.promptTargetInfo;

	this.triggerTargetTiles = [];
	this.triggerTargetTilePoints = [];
	this.setTriggerTargetTiles();

	this.abilityTargetTiles = [];
	this.abilityTargetTilePoints = [];
	// this.setAbilityTargetTiles();	// This happens during activation now

	this.abilityBrain = Trifle.BrainFactory.createAbilityBrain(this.abilityType, this);
	// this.abilityTargetTiles = this.abilityBrain.getTargetTiles();
	// this.abilityTargetTilePoints = this.abilityBrain.getTargetTilePoints();

	this.boardChanged = false;
	this.activated = false;
}

Trifle.Ability.prototype.hasNeededPromptTargetInfo = function() {
	var hasPromptInfo = true;
	var neededPromptTargetsInfo = this.abilityInfo.neededPromptTargetsInfo;
	if (neededPromptTargetsInfo && neededPromptTargetsInfo.length >= 1) {
		// Figure out what prompt targets are needed...
		var self = this;
		neededPromptTargetsInfo.forEach(function(neededPromptTargetInfo) {
			debug(neededPromptTargetInfo);
			if (!self.promptTargetInfoPresent(neededPromptTargetInfo)) {
				debug("Need to prompt");
				hasPromptInfo = false;
			}
		})
	}
	return hasPromptInfo;
};

Trifle.Ability.prototype.promptTargetInfoPresent = function(neededPromptTargetInfo) {
	var hasTarget = false;
	if (this.promptTargetInfo && this.promptTargetInfo.length) {
		this.promptTargetInfo.forEach(function(promptTargetEntry) {
			if (promptTargetEntry.title === neededPromptTargetInfo.title) {
				hasTarget = true;
			}
		})
	}
	return hasTarget;
};

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
	this.setAbilityTargetTiles();

	this.abilityActivatedResults = this.abilityBrain.activateAbility();
	this.activated = true;
};

Trifle.Ability.prototype.deactivate = function() {
	// What needed to do?
	this.activated = false;
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
};

Trifle.Ability.prototype.getTriggerTypeTargets = function(triggerType) {
	var targetTiles = [];
	var targetTilePoints = [];

	var self = this;

	var triggerBrain = this.triggerBrainMap[triggerType];

	if (triggerBrain && triggerBrain.targetTiles && triggerBrain.targetTiles.length) {
		targetTiles = triggerBrain.targetTiles;
		targetTilePoints = triggerBrain.targetTilePoints;
	}

	return {
		targetTiles: targetTiles,
		targetTilePoints: targetTilePoints
	};
};

Trifle.Ability.prototype.appearsToBeTheSameAs = function(otherAbility) {
	return otherAbility 
		&& this.abilityType === otherAbility.abilityType
		&& this.sourceTile.id === otherAbility.sourceTile.id
		&& this.triggerTargetTiles.equals(otherAbility.triggerTargetTiles)
		&& this.sourceTilePoint === otherAbility.sourceTilePoint;
};

Trifle.Ability.prototype.abilityTargetsTile = function(tile) {
	return this.abilityTargetTiles.includes(tile);
};

Trifle.Ability.prototype.isPriority = function(priorityLevel) {
	return this.abilityInfo.priority === priorityLevel;
};

Trifle.Ability.prototype.getTitle = function() {
	if (this.abilityInfo.title) {
		return this.abilityInfo.title;
	} else {
		return this.abilityInfo.type;
	}
};

Trifle.Ability.prototype.getNeededPromptTargetInfo = function(promptTargetTitle) {
	var matchingPromptTargetInfo;
	if (this.abilityInfo.neededPromptTargetsInfo && this.abilityInfo.neededPromptTargetsInfo.length) {
		this.abilityInfo.neededPromptTargetsInfo.forEach(function(promptTargetInfo) {
			if (promptTargetInfo.title === promptTargetTitle) {
				matchingPromptTargetInfo = promptTargetInfo;
			}
		})
	}
	return matchingPromptTargetInfo;
};

