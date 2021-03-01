


function TrifleAbility(tileAbilityInfo, tile, tileInfo, triggerBrain) {
    this.abilityType = tileAbilityInfo.type;
    this.abilityInfo = tileAbilityInfo;
    this.tile = tile;
    this.tileInfo = tileInfo;
    this.triggerBrain = triggerBrain;

    debug("New Ability created! " + this.abilityType + " on tile " + this.tile.code);
    this.boardChanged = false;
}

TrifleAbility.prototype.activateAbility = function() {
    // Get AbilityBrain
    
};

TrifleAbility.prototype.boardChangedAfterActivation = function() {
    return this.boardChanged;
};
