
Trifle.AbilityManager = function(board) {
	this.board = board;
	this.abilities = [];
	this.readyAbilities = {};
}

Trifle.AbilityManager.prototype.setReadyAbilities = function(readyAbilities) {
	this.readyAbilities = readyAbilities;
};

Trifle.AbilityManager.prototype.activateReadyAbilities = function() {
	var boardHasChanged = false;
	var self = this;

	/* Mark all as do not preserve */
	debug("Clearing ability preserve values");
	this.abilities.forEach(function(existingAbility) {
		existingAbility.preserve = false;
	});

	/* Mark abilities to preserve based on ready abilities */
	debug("Marking preserve abilities");
	Object.values(this.readyAbilities).forEach(function(abilityList) {
		abilityList.forEach(function(ability) {
			self.markExistingMatchingAbility(ability);
		});
	});

	/* Deactivate abilities. New ability list is the ones that are not deactivated. */
	debug("Deactivating abilities");
	var newAbilities = [];
	this.abilities.forEach(function(existingAbility) {
		if (existingAbility.preserve) {
			debug("Preserving ability: ");
			debug(existingAbility);
			newAbilities.push(existingAbility);
		} else {
			existingAbility.deactivate();
		}
	});
	this.abilities = newAbilities;

	/* Activate abitlies! */
	Object.values(this.readyAbilities).forEach(function(abilityList) {
		abilityList.forEach(function(ability) {
			var abilityIsReadyToActivate = self.addNewAbility(ability);
			if (abilityIsReadyToActivate) {
				ability.activateAbility();
			}
			if (ability.boardChangedAfterActivation()) {
				boardHasChanged = true;
				debug("Board changed! Will need to process abilities again");
				return;	// If board changes, quit!
			}
		});
	});

	return {
		boardHasChanged: boardHasChanged
	};
};

/**
 * Return `true` if ability is new and not already active, aka ability is ready to activate.
 * @param {*} ability 
 */
Trifle.AbilityManager.prototype.addNewAbility = function(ability) {
	// Go through abilities and see if this one is already active
	var added = false;

	if (!this.abilitiesAlreadyIncludes(ability)) {
		this.abilities.push(ability);
		added = true;
		debug("Just added ability");
	} else {
		debug("No need to add ability");
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
				&& ability.targetsTile(tile)) {
			targetsTile = true;
			return;
		}
	});
	return targetsTile;
};


