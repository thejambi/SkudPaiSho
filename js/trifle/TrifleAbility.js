


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

Trifle.Ability.prototype.worthy = function() {
	return !this.abilityInfo.neededPromptTargetsInfo
		|| (this.abilityInfo.neededPromptTargetsInfo
		&& this.promptTargetsExist());
};

Trifle.Ability.prototype.promptTargetInfoPresent = function(neededPromptTargetInfo) {
	var hasTarget = false;

	var sourceTileKey = JSON.stringify(Trifle.AbilityManager.buildSourceTileKeyObject(this.sourceTile));

	return this.promptTargetInfo 
		&& this.promptTargetInfo[sourceTileKey]
		&& (this.promptTargetInfo[sourceTileKey].skipped
			|| this.promptTargetInfo[sourceTileKey][neededPromptTargetInfo.promptId]);
};

Trifle.Ability.prototype.promptTargetsExist = function() {
	var promptTargetsExist = false;

	var abilityObject = this;

	var neededPromptInfo = {};

	neededPromptInfo.abilitySourceTile = abilityObject.sourceTile;
	neededPromptInfo.sourceAbility = abilityObject;
	neededPromptInfo.sourceTileKey = Trifle.AbilityManager.buildSourceTileKeyObject(abilityObject.sourceTile);
	var sourceTileKeyStr = JSON.stringify(neededPromptInfo.sourceTileKey);

	var nextNeededPromptTargetInfo = abilityObject.abilityInfo.neededPromptTargetsInfo[0];
	// abilityObject.abilityInfo.neededPromptTargetsInfo.forEach((neededPromptTargetInfo) => {
	// 	if (!nextNeededPromptTargetInfo 
	// 			&& (!abilityObject.promptTargetInfo[sourceTileKeyStr] 
	// 			|| !abilityObject.promptTargetInfo[sourceTileKeyStr][neededPromptTargetInfo.promptId])) {
	// 		nextNeededPromptTargetInfo = neededPromptTargetInfo;
	// 	}
	// });

	if (nextNeededPromptTargetInfo) {
		var abilityBrain = Trifle.BrainFactory.createAbilityBrain(abilityObject.abilityType, abilityObject);
		promptTargetsExist = abilityBrain.promptForTarget(nextNeededPromptTargetInfo, sourceTileKeyStr, true);
	}

	return promptTargetsExist;
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
	this.setAbilityTargetTiles();

	if (this.abilityTargetTiles.length > 0) {	// Ability must have target tile?
		this.abilityActivatedResults = this.abilityBrain.activateAbility();
		this.activated = true;
	}
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
		&& this.triggerTargetTilePoints.equals(otherAbility.triggerTargetTilePoints)
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

Trifle.Ability.prototype.getNeededPromptTargetInfo = function(promptTargetId) {
	var matchingPromptTargetInfo;
	if (this.abilityInfo.neededPromptTargetsInfo && this.abilityInfo.neededPromptTargetsInfo.length) {
		this.abilityInfo.neededPromptTargetsInfo.forEach(function(promptTargetInfo) {
			if (promptTargetInfo.promptId === promptTargetId) {
				matchingPromptTargetInfo = promptTargetInfo;
			}
		})
	}
	return matchingPromptTargetInfo;
};

Trifle.Ability.prototype.getSummaryLines = function() {
	var lines = [];
	var abilityTitle = this.abilityType;
	if (this.abilityInfo.title) {
		abilityTitle = this.abilityInfo.title;
	}
	lines.push("=== " + abilityTitle + " ===");
	lines.push("- Source Tile: " + this.sourceTile.ownerName + " " + Trifle.Tile.getTileName(this.sourceTile.code));
	var targetTileNames = [];
	this.abilityTargetTiles.forEach((abilityTargetTile) => {
		targetTileNames.push(" " + abilityTargetTile.ownerName + " " + Trifle.Tile.getTileName(abilityTargetTile.code));
	});
	lines.push("- Target Tiles:" + targetTileNames);

	return lines;
};

Trifle.Ability.prototype.triggerStillMet = function() {
	var triggers = this.abilityInfo.triggers;
	if (triggers && triggers.length
			&& this.sourceTilePoint.tile === this.sourceTile) {
		var allTriggerConditionsMet = true;

		triggers.forEach(triggerInfo => {
			// if (Trifle.TriggerHelper.hasInfo(triggerInfo)) {
			// 	triggerContext.currentTrigger = triggerInfo;
			// 	var brain = self.brainFactory.createTriggerBrain(triggerInfo, triggerContext);
			// 	if (brain && brain.isTriggerMet && self.activationRequirementsAreMet(triggerInfo, tile, triggerContext)) {
			// 		if (allTriggerConditionsMet && brain.isTriggerMet()) {
			// 			triggerBrainMap[triggerInfo.triggerType] = brain;
			// 		} else {
			// 			allTriggerConditionsMet = false;
			// 		}
			// 	} else {
			// 		allTriggerConditionsMet = false;
			// 	}
			// }
			debug("Trigger type: " + triggerInfo.triggerType);
			var triggerBrain = this.triggerBrainMap[triggerInfo.triggerType];
			allTriggerConditionsMet = allTriggerConditionsMet && triggerBrain.isTriggerMet();
			debug("allTriggerConditionsMet: " + allTriggerConditionsMet);
		});
		return allTriggerConditionsMet;
	}
	debug("Returning false");
	return false;
};

Trifle.Ability.prototype.getTriggeringActions = function() {
	var allTriggeringActions = [];

	Object.values(this.triggerBrainMap).forEach(triggerBrain => {
		if (triggerBrain.triggeringAction) {
			allTriggeringActions.push(triggerBrain.triggeringAction);
		}
	});

	return allTriggeringActions;
};

