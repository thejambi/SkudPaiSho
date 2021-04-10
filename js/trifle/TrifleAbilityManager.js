
Trifle.AbilityManager = function(board) {
	this.board = board;
	this.tileManager = board.tileManager;
	this.abilities = [];
	this.readyAbilities = {};
}

Trifle.AbilityManager.prototype.setReadyAbilities = function(readyAbilities) {
	this.readyAbilities = readyAbilities;
};

Trifle.AbilityManager.prototype.activateReadyAbilities = function() {
	var boardHasChanged = false;
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

	var abilityActivationOrder = [
		Trifle.AbilityName.cancelAbilities
	];

	abilityActivationOrder.forEach(function(abilityName) {
		var readyAbilitiesOfType = self.readyAbilities[abilityName];
		if (readyAbilitiesOfType && readyAbilitiesOfType.length) {
			readyAbilitiesOfType.forEach(function(ability) {
				boardHasChanged = self.doTheActivateThing(ability);
				if (boardHasChanged) {
					return;	// If board changes, quit!
				}
			});
		}
		if (boardHasChanged) {
			return;
		}
	});
	if (this.readyAbilities[Trifle.AbilityName.cancelAbilities] && this.readyAbilities[Trifle.AbilityName.cancelAbilities].length) {
		this.readyAbilities[Trifle.AbilityName.cancelAbilities].forEach(function(ability) {
			boardHasChanged = self.doTheActivateThing(ability);
			if (boardHasChanged) {
				return;	// If board changes, quit!
			}
		});
	}

	if (boardHasChanged) {
		return;	// If board changes, quit!
	}

	Object.values(this.readyAbilities).forEach(function(abilityList) {
		abilityList.forEach(function(ability) {
			/* if (!ability.activated) {
				var abilityIsReadyToActivate = self.addNewAbility(ability);
				if (abilityIsReadyToActivate) {
					ability.activateAbility();
				}
				if (ability.boardChangedAfterActivation()) {
					boardHasChanged = true;
					debug("Board changed! Will need to process abilities again");
					return;	// If board changes, quit!
				}
			} */
			boardHasChanged = self.doTheActivateThing(ability);
			if (boardHasChanged) {
				return;	// If board changes, quit!
			}
		});
	});

	return {
		boardHasChanged: boardHasChanged
	};
};

Trifle.AbilityManager.prototype.doTheActivateThing = function(ability) {
	var boardHasChanged = false;
	if (!ability.activated) {
		var abilityIsReadyToActivate = this.addNewAbility(ability);
		if (abilityIsReadyToActivate) {
			ability.activateAbility();
		}
		if (ability.boardChangedAfterActivation()) {
			boardHasChanged = true;
			return;	// If board changes, quit!
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


