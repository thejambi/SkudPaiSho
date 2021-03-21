
Trifle.AbilityManager = function(board) {
    this.board = board;
    this.abilities = [];
}

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

