
Trifle.TargetHelper = function(abilityObject, possibleTargetTilePoint, targetBrain, possibleTargetTile) {
	this.abilityObject = abilityObject;
	this.abilityInfo = abilityObject.abilityInfo;

	this.possibleTargetTilePoint = possibleTargetTilePoint;

	if (this.possibleTargetTilePoint) {
		this.possibleTargetTile = this.possibleTargetTilePoint.tile;
		this.possibleTargetTileInfo = TrifleTiles[this.possibleTargetTile.code];
	} else {
		this.possibleTargetTile = possibleTargetTile;
		this.possibleTargetTileInfo = TrifleTiles[this.possibleTargetTile.code];
	}

	this.targetBrain = targetBrain;
};

Trifle.TargetHelper.prototype.tileIsTargeted = function() {
	return this.targetTeamsCheck()
			&& this.targetTileTypesCheck()
			&& this.targetTileIdentifiersCheck()
			&& this.targetTileNamesCheck();
};

Trifle.TargetHelper.prototype.targetTeamsCheck = function() {
	if (this.abilityInfo.targetTeams) {
		var possibleTargetTileOwner = this.possibleTargetTile.ownerName;

		var isFriendlyTargetedTile = this.abilityInfo.targetTeams.includes(Trifle.TileTeam.friendly)
				&& possibleTargetTileOwner === this.abilityObject.sourceTile.ownerName;
		var isEnemyTargetedTile = this.abilityInfo.targetTeams.includes(Trifle.TileTeam.enemy)
				&& possibleTargetTileOwner !== this.abilityObject.sourceTile.ownerName;

		debug("Target teams check: ");
		debug(isFriendlyTargetedTile || isEnemyTargetedTile);
		return isFriendlyTargetedTile || isEnemyTargetedTile;
	} else {
		return true;
	}
};

Trifle.TargetHelper.prototype.targetTileTypesCheck = function() {
	if (this.abilityInfo.targetTileTypes) {
		return this.abilityInfo.targetTileTypes.includes(Trifle.TileCategory.allTileTypes)
			|| arrayIncludesOneOf(this.possibleTargetTileInfo.types, this.abilityInfo.targetTileTypes)
			|| (this.abilityInfo.targetTileTypes.includes(Trifle.TileCategory.thisTile)
				&& this.possibleTargetTile === this.abilityObject.sourceTile);
	} else {
		return true;
	}
};

Trifle.TargetHelper.prototype.targetTileIdentifiersCheck = function() {
	if (this.abilityInfo.targetTileIdentifiers && this.possibleTargetTileInfo.identifiers) {
		return arrayIncludesOneOf(this.abilityInfo.targetTileIdentifiers, this.possibleTargetTileInfo.identifiers);
	} else {
		return true;
	}
};

Trifle.TargetHelper.prototype.targetTileNamesCheck = function() {
	if (this.abilityInfo.targetTileCodes) {
		return arrayIncludesOneOf(this.abilityInfo.targetTileCodes, [this.possibleTargetTile.code]);
	} else {
		return true;
	}
};

