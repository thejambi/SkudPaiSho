
Trifle.AbilityManager = function(board, customAbilityActivationOrder) {
	this.board = board;
	this.tileManager = board.tileManager;
	this.abilities = [];
	this.readyAbilities = {};
	this.abilitiesWithPromptTargetsNeeded = {};
	this.abilityActivationOrder = customAbilityActivationOrder;
}

Trifle.AbilityManager.prototype.setReadyAbilities = function(readyAbilities) {
	this.readyAbilities = readyAbilities;
};

Trifle.AbilityManager.prototype.setAbilitiesWithPromptTargetsNeeded = function(abilitiesWithPromptTargetsNeeded) {
	this.abilitiesWithPromptTargetsNeeded = abilitiesWithPromptTargetsNeeded;
};

Trifle.AbilityManager.prototype.activateReadyAbilitiesOrPromptForTargets = function() {
	if (this.abilitiesWithPromptTargetsNeeded && this.abilitiesWithPromptTargetsNeeded.length > 0) {
		return this.promptForNextNeededTargets();
	} else {
		return this.activateReadyAbilities();
	}
};

Trifle.AbilityManager.prototype.activateReadyAbilities = function() {
	var boardHasChanged = false;
	var tileRecords = {
		capturedTiles: [],
		tilesMovedToPiles: []
	};
	var self = this;

	/* Mark all existing abilities as do not preserve */
	this.abilities.forEach(function(existingAbility) {
		existingAbility.preserve = false;
	});

	/* Mark abilities to preserve based on matching ready abilities */
	Object.values(this.readyAbilities).forEach(function(abilityList) {
		abilityList.forEach(function(ability) {
			self.markExistingMatchingAbility(ability);
		});
	});

	/* Deactivate abilities. New ability list is the ones that are not deactivated. */
	var newAbilities = [];
	this.abilities.forEach(function(existingAbility) {
		if (existingAbility.preserve && !self.abilityIsCanceled(existingAbility)) {
			newAbilities.push(existingAbility);
		} else {
			existingAbility.deactivate();
		}
	});
	this.abilities = newAbilities;

	/* Activate abilities! */

	// Priority "highest" abilities first
	Object.values(this.readyAbilities).forEach(function(abilityList) {
		abilityList.forEach(function(ability) {
			if (ability.isPriority(Trifle.AbilityPriorityLevel.highest)) {
				debug("!!!!Priority Ability!!!! " + ability.getTitle());
				boardHasChanged = self.doTheActivateThing(ability, tileRecords);
				if (boardHasChanged) {
					return;	// If board changes, quit!
				}
			}
		});
	});

	if (!boardHasChanged) {
		// Default ability activation order
		var abilityActivationOrder = [
			Trifle.AbilityName.cancelAbilities,
			Trifle.AbilityName.cancelAbilitiesTargetingTiles
		];

		if (this.abilityActivationOrder) {
			abilityActivationOrder = this.abilityActivationOrder;
		}

		abilityActivationOrder.forEach(function(abilityName) {
			var readyAbilitiesOfType = self.readyAbilities[abilityName];
			if (readyAbilitiesOfType && readyAbilitiesOfType.length) {
				readyAbilitiesOfType.forEach(function(ability) {
					boardHasChanged = self.doTheActivateThing(ability, tileRecords);
					if (boardHasChanged) {
						return;	// If board changes, quit loop!
					}
				});
			}
			if (boardHasChanged) {
				return;	// Quit loop
			}
		});

		if (!boardHasChanged) {
			Object.values(this.readyAbilities).forEach(function(abilityList) {
				abilityList.forEach(function(ability) {
					boardHasChanged = self.doTheActivateThing(ability, tileRecords);
					if (boardHasChanged) {
						return;	// If board changes, quit!
					}
				});
			});
		}
	}

	return {
		boardHasChanged: boardHasChanged,
		tileRecords: tileRecords
	};
};

Trifle.AbilityManager.prototype.doTheActivateThing = function(ability, tileRecords) {
	var capturedTiles = tileRecords.capturedTiles;
	var tilesMovedToPiles = tileRecords.tilesMovedToPiles;

	var boardHasChanged = false;
	if (!ability.activated) {
		var abilityIsReadyToActivate = this.addNewAbility(ability);
		if (abilityIsReadyToActivate) {
			ability.activateAbility();

			if (ability.abilityActivatedResults
					&& ability.abilityActivatedResults.capturedTiles 
					&& ability.abilityActivatedResults.capturedTiles.length) {
				ability.abilityActivatedResults.capturedTiles.forEach((capturedTile) => {
					capturedTiles.push(capturedTile);
				});
			}

			if (ability.abilityActivatedResults
					&& ability.abilityActivatedResults.tilesMovedToPiles
					&& ability.abilityActivatedResults.tilesMovedToPiles.length) {
				ability.abilityActivatedResults.tilesMovedToPiles.forEach((movedTile) => {
					tilesMovedToPiles.push(movedTile);
				});
			}
		}
		if (ability.boardChangedAfterActivation()) {
			boardHasChanged = true;
		}
	}
	return boardHasChanged;
};

/**
 * Return `true` if ability is new and not already active, aka ability is ready to activate.
 * @param {*} ability 
 */
Trifle.AbilityManager.prototype.addNewAbility = function(ability) {
	var added = false;

	if (!this.abilitiesAlreadyIncludes(ability) && !this.abilityIsCanceled(ability)) {
		this.abilities.push(ability);
		added = true;
	} else {
		// debug("No need to add ability");
	}

	return added;
};

Trifle.AbilityManager.prototype.markExistingMatchingAbility = function(otherAbility) {
	this.abilities.forEach(function(existingAbility) {
		if (existingAbility.appearsToBeTheSameAs(otherAbility)) {
			existingAbility.preserve = true;
			return;
		}
	});
};

Trifle.AbilityManager.prototype.abilitiesAlreadyIncludes = function(otherAbility) {
	var abilityFound = false;
	this.abilities.forEach(function(existingAbility) {
		if (existingAbility.appearsToBeTheSameAs(otherAbility)) {
			abilityFound = true;
			return;
		}
	});
	return abilityFound;
};

Trifle.AbilityManager.prototype.abilityTargetingTileExists = function(abilityName, tile) {
	var targetsTile = false;
	this.abilities.forEach(function(ability) {
		if (ability.abilityType === abilityName
				&& ability.abilityTargetsTile(tile)) {
			targetsTile = true;
			return;
		}
	});
	return targetsTile;
};

Trifle.AbilityManager.prototype.getAbilitiesTargetingTile = function(abilityName, tile) {
	var abilitiesTargetingTile = [];
	this.abilities.forEach(function(ability) {
		if (ability.abilityType === abilityName
				&& ability.abilityTargetsTile(tile)) {
			abilitiesTargetingTile.push(ability);
		}
	});
	return abilitiesTargetingTile;
};

Trifle.AbilityManager.prototype.getAbilitiesTargetingTileFromSourceTile = function(abilityName, tile, sourceTile) {
	var abilitiesTargetingTile = [];
	this.abilities.forEach(function(ability) {
		if (ability.abilityType === abilityName
				&& ability.sourceTile === sourceTile
				&& ability.abilityTargetsTile(tile)) {
			abilitiesTargetingTile.push(ability);
		}
	});
	return abilitiesTargetingTile;
};

Trifle.AbilityManager.prototype.abilityIsCanceled = function(abilityObject) {
	var isCanceled = false;
	var affectingCancelAbilities = this.getAbilitiesTargetingTile(Trifle.AbilityName.cancelAbilities, abilityObject.sourceTile);

	affectingCancelAbilities.forEach(function(cancelingAbility) {
		// Does canceling ability affecting tile cancel this kind of ability?
		if (cancelingAbility.abilityInfo.targetAbilityTypes.includes(Trifle.AbilityType.all)) {
			isCanceled = true;	// Dat is for sure
		}

		cancelingAbility.abilityInfo.targetAbilityTypes.forEach(function(canceledAbilityType) {
			var abilitiesForType = Trifle.AbilitiesForType[canceledAbilityType];
			if (abilitiesForType && abilitiesForType.length && abilitiesForType.includes(abilityObject.abilityInfo.type)) {
				isCanceled = true;
			}
		});
	});

	return isCanceled;
};

Trifle.AbilityManager.prototype.targetingIsCanceled = function(abilityObject, possibleTargetTile) {
	var isCanceled = false;
	var affectingCancelAbilities = this.getAbilitiesTargetingTile(Trifle.AbilityName.cancelAbilitiesTargetingTiles, possibleTargetTile);

	affectingCancelAbilities.forEach(function(cancelingAbility) {
		if (!cancelingAbility.abilityInfo.cancelAbilitiesFromTeam
			|| (
				(cancelingAbility.abilityInfo.cancelAbilitiesFromTeam === Trifle.TileTeam.enemy && abilityObject.sourceTile.ownerName !== possibleTargetTile.ownerName)
				|| (cancelingAbility.abilityInfo.cancelAbilitiesFromTeam === Trifle.TileTeam.friendly && abilityObject.sourceTile.ownerName === possibleTargetTile.ownerName)
				)
		) {
			// Does canceling ability affecting tile cancel this kind of ability?
			if (cancelingAbility.abilityInfo.targetAbilityTypes.includes(Trifle.AbilityType.all)) {
				isCanceled = true;	// Dat is for sure
			}

			cancelingAbility.abilityInfo.targetAbilityTypes.forEach(function(canceledAbilityType) {
				var abilitiesForType = Trifle.AbilitiesForType[canceledAbilityType];
				if (abilitiesForType && abilitiesForType.length && abilitiesForType.includes(abilityObject.abilityInfo.type)) {
					isCanceled = true;
				}
			});
		}
	});

	return isCanceled;
};

Trifle.AbilityManager.prototype.tickDurationAbilities = function() {
	// TODO: Something like this old tick code did:
	/* for (var i = this.activeDurationAbilities.length - 1; i >= 0; i--) {
		var durationAbilityDetails = this.activeDurationAbilities[i];
		var durationAbilityInfo = durationAbilityDetails.ability;
		durationAbilityInfo.remainingDuration -= 0.5;
		if (durationAbilityInfo.remainingDuration <= 0) {
			durationAbilityInfo.active = false;
			this.activeDurationAbilities.splice(i, 1);
			debug("Ability deactivated!");
			debug(durationAbilityInfo);
		}
	} */
};

Trifle.AbilityManager.prototype.promptForNextNeededTargets = function() {
	if (!(this.abilitiesWithPromptTargetsNeeded && this.abilitiesWithPromptTargetsNeeded.length > 0)) {
		debug("Error: No abilities that need prompt targets found");
		return {};
	}

	if (this.abilitiesWithPromptTargetsNeeded.length > 1) {
		debug("Multiple abilities that need prompt targets. Will just choose first one to prompt...");
	}

	var abilityObject = this.abilitiesWithPromptTargetsNeeded[0];

	var neededPromptInfo = {};

	neededPromptInfo.abilitySourceTile = abilityObject.sourceTile;
	neededPromptInfo.sourceAbility = abilityObject;
	neededPromptInfo.sourceTileKey = Trifle.AbilityManager.buildSourceTileKeyObject(abilityObject.sourceTile);
	var sourceTileKeyStr = JSON.stringify(neededPromptInfo.sourceTileKey);

	var nextNeededPromptTargetInfo;
	abilityObject.abilityInfo.neededPromptTargetsInfo.forEach((neededPromptTargetInfo) => {
		if (!nextNeededPromptTargetInfo 
				&& (!abilityObject.promptTargetInfo[sourceTileKeyStr] 
				|| !abilityObject.promptTargetInfo[sourceTileKeyStr][neededPromptTargetInfo.promptId])) {
			nextNeededPromptTargetInfo = neededPromptTargetInfo;
		}
	});

	if (nextNeededPromptTargetInfo) {
		neededPromptInfo.currentPromptTargetId = nextNeededPromptTargetInfo.promptId;

		var abilityBrain = Trifle.BrainFactory.createAbilityBrain(abilityObject.abilityType, abilityObject);
		abilityBrain.promptForTarget(nextNeededPromptTargetInfo, sourceTileKeyStr);
	} else {
		debug("No prompt needed");
	}

	return { neededPromptInfo: neededPromptInfo };
};

Trifle.AbilityManager.buildSourceTileKeyObject = function(abilitySourceTile) {
	return {
		tileOwner: abilitySourceTile.ownerCode,
		tileCode: abilitySourceTile.code,
		boardPoint: abilitySourceTile.seatedPoint.getNotationPointString(),
		tileId: abilitySourceTile.id
	};
};


