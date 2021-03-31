
Trifle.TriggerHelper = function(triggerContext, possibleTargetTilePoint) {
	this.triggerContext = triggerContext;
	this.possibleTargetTilePoint = possibleTargetTilePoint;
	this.possibleTargetTileInfo = TrifleTiles[this.possibleTargetTilePoint.tile.code];
	this.abilityInfo = this.triggerContext.tileAbilityInfo;
};

Trifle.TriggerHelper.prototype.tileIsTargeted = function() {
	return this.targetTeamsCheck()
			&& this.targetTileTypesCheck()
			&& this.targetTileIdentifiersCheck()
			&& this.targetTileNamesCheck();
};

Trifle.TriggerHelper.prototype.targetTeamsCheck = function() {
	if (this.abilityInfo.targetTeams) {
		var possibleTargetTileOwner = this.possibleTargetTilePoint.tile.ownerName;

		var isFriendlyTargetedTile = this.abilityInfo.targetTeams.includes(Trifle.TileTeam.friendly)
				&& possibleTargetTileOwner === this.triggerContext.tile.ownerName;
		var isEnemyTargetedTile = this.abilityInfo.targetTeams.includes(Trifle.TileTeam.enemy)
				&& possibleTargetTileOwner !== this.triggerContext.tile.ownerName;

		debug("Target teams check: ");
		debug(isFriendlyTargetedTile || isEnemyTargetedTile);
		return isFriendlyTargetedTile || isEnemyTargetedTile;
	} else {
		return true;
	}
};

Trifle.TriggerHelper.prototype.targetTileTypesCheck = function() {
	if (this.abilityInfo.targetTileTypes) {
		return this.abilityInfo.targetTileTypes.includes(Trifle.TileCategory.allTileTypes)
			|| arrayIncludesOneOf(this.possibleTargetTileInfo.types, this.abilityInfo.targetTileTypes);
	} else {
		return true;
	}
};

Trifle.TriggerHelper.prototype.targetTileIdentifiersCheck = function() {
	if (this.abilityInfo.targetTileIdentifiers && this.possibleTargetTileInfo.identifiers) {
		return arrayIncludesOneOf(this.abilityInfo.targetTileIdentifiers, this.possibleTargetTileInfo.identifiers);
	} else {
		return true;
	}
};

Trifle.TriggerHelper.prototype.targetTileNamesCheck = function() {
	if (this.abilityInfo.targetTileCodes) {
		return arrayIncludesOneOf(this.abilityInfo.targetTileCodes, [this.possibleTargetTilePoint.tile.code]);
	} else {
		return true;
	}
};
