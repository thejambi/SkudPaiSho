
Trifle.TriggerHelper = function(triggerContext, possibleTargetTilePoint) {
	this.triggerContext = triggerContext;
	this.possibleTargetTilePoint = possibleTargetTilePoint;
	this.possibleTargetTileInfo = TrifleTiles[this.possibleTargetTilePoint.tile.code];
	this.abilityInfo = this.triggerContext.tileAbilityInfo;
	this.triggerInfo = this.triggerContext.currentTrigger;
};

Trifle.TriggerHelper.prototype.tileIsTargeted = function() {
	return this.targetTeamsCheck()
			&& this.targetTileTypesCheck()
			&& this.targetTileIdentifiersCheck()
			&& this.targetTileNamesCheck();
};

Trifle.TriggerHelper.prototype.targetTeamsCheck = function() {
	if (this.triggerInfo.targetTeams) {
		var possibleTargetTileOwner = this.possibleTargetTilePoint.tile.ownerName;

		var isFriendlyTargetedTile = this.triggerInfo.targetTeams.includes(Trifle.TileTeam.friendly)
				&& possibleTargetTileOwner === this.triggerContext.tile.ownerName;
		var isEnemyTargetedTile = this.triggerInfo.targetTeams.includes(Trifle.TileTeam.enemy)
				&& possibleTargetTileOwner !== this.triggerContext.tile.ownerName;

		debug("Target teams check: ");
		debug(isFriendlyTargetedTile || isEnemyTargetedTile);
		return isFriendlyTargetedTile || isEnemyTargetedTile;
	} else {
		return true;
	}
};

Trifle.TriggerHelper.prototype.targetTileTypesCheck = function() {
	if (this.triggerInfo.targetTileTypes) {
		return this.triggerInfo.targetTileTypes.includes(Trifle.TileCategory.allTileTypes)
			|| arrayIncludesOneOf(this.possibleTargetTileInfo.types, this.triggerInfo.targetTileTypes)
			|| (this.triggerInfo.targetTileTypes.includes(Trifle.TileCategory.thisTile)
				&& this.possibleTargetTilePoint.tile === this.triggerContext.tile);
	} else {
		return true;
	}
};

Trifle.TriggerHelper.prototype.targetTileIdentifiersCheck = function() {
	if (this.triggerInfo.targetTileIdentifiers && this.possibleTargetTileInfo.identifiers) {
		return arrayIncludesOneOf(this.triggerInfo.targetTileIdentifiers, this.possibleTargetTileInfo.identifiers);
	} else {
		return true;
	}
};

Trifle.TriggerHelper.prototype.targetTileNamesCheck = function() {
	if (this.triggerInfo.targetTileCodes) {
		return arrayIncludesOneOf(this.triggerInfo.targetTileCodes, [this.possibleTargetTilePoint.tile.code]);
	} else {
		return true;
	}
};

Trifle.TriggerHelper.hasInfo = function(triggerInfo) {
	// Could be used to validate trigger info...
	var looksValid = triggerInfo.triggerType;

	if (!looksValid) {
		debug("Trigger info does not look valid: ");
		debug(triggerInfo);
	}

	return looksValid;
};
