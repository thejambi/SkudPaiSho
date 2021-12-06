
Trifle.TriggerHelper = function(triggerContext, possibleTargetTilePoint, possibleTargetTile) {
	this.triggerContext = triggerContext;
	if (possibleTargetTile) {
		this.possibleTargetTile = possibleTargetTile;
	} else if (possibleTargetTilePoint) {
		this.possibleTargetTile = possibleTargetTilePoint.tile;
	}
	this.possibleTargetTileInfo = PaiShoGames.currentTileMetadata[this.possibleTargetTile.code];
	this.abilityInfo = this.triggerContext.tileAbilityInfo;
	this.triggerInfo = this.triggerContext.currentTrigger;
};

Trifle.TriggerHelper.prototype.tileIsTargeted = function() {
	return this.targetingIsNotCanceledCheck()
			&& this.targetTeamsCheck()
			&& this.targetTileTypesCheck()
			&& this.targetTileIdentifiersCheck()
			&& this.targetTileNamesCheck();
};

Trifle.TriggerHelper.prototype.targetingIsNotCanceledCheck = function() {
	var abilityManager = this.triggerContext.board.abilityManager;
	var abilitySourceTile = this.triggerContext.tile;
	var abilityType = this.triggerContext.tileAbilityInfo.type;
	var targetingIsCanceled = abilityManager.targetingIsCanceled(abilitySourceTile, abilityType, this.possibleTargetTile);
	return !targetingIsCanceled;
};

Trifle.TriggerHelper.prototype.targetTeamsCheck = function() {
	if (this.triggerInfo.targetTeams) {
		var possibleTargetTileOwner = this.possibleTargetTile.ownerName;

		var isFriendlyTargetedTile = this.triggerInfo.targetTeams.includes(Trifle.TileTeam.friendly)
				&& possibleTargetTileOwner === this.triggerContext.tile.ownerName;
		var isEnemyTargetedTile = this.triggerInfo.targetTeams.includes(Trifle.TileTeam.enemy)
				&& possibleTargetTileOwner !== this.triggerContext.tile.ownerName;

		return isFriendlyTargetedTile || isEnemyTargetedTile;
	} else {
		return true;
	}
};

// TODO split into "Tile Category Check"?
Trifle.TriggerHelper.prototype.targetTileTypesCheck = function() {
	if (this.triggerInfo.targetTileTypes) {
		return this.triggerInfo.targetTileTypes.includes(Trifle.TileCategory.allTileTypes)
			|| arrayIncludesOneOf(this.possibleTargetTileInfo.types, this.triggerInfo.targetTileTypes)
			|| (this.triggerInfo.targetTileTypes.includes(Trifle.TileCategory.thisTile)
				&& this.possibleTargetTile === this.triggerContext.tile)
			|| (this.triggerInfo.targetTileTypes.includes(Trifle.TileCategory.allButThisTile)
				&& this.possibleTargetTile !== this.triggerContext.tile);
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
		return arrayIncludesOneOf(this.triggerInfo.targetTileCodes, [this.possibleTargetTile.code]);
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
