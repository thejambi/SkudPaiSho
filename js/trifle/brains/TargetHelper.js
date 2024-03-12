
Trifle.TargetHelper = function(abilityObject, possibleTargetTilePoint, targetBrain, possibleTargetTile) {
	this.abilityObject = abilityObject;
	this.abilityInfo = abilityObject.abilityInfo;
	this.tileMetadata = PaiShoGames.currentTileMetadata;

	this.possibleTargetTilePoint = possibleTargetTilePoint;

	if (this.possibleTargetTilePoint && this.possibleTargetTilePoint.hasTile()) {
		this.possibleTargetTile = this.possibleTargetTilePoint.tile;
		this.possibleTargetTileInfo = this.tileMetadata[this.possibleTargetTile.code];
	} else if (possibleTargetTile) {
		this.possibleTargetTile = possibleTargetTile;
		this.possibleTargetTileInfo = this.tileMetadata[this.possibleTargetTile.code];
	} else {
		debug("No posible target tile found!");
	}

	this.targetBrain = targetBrain;
};

Trifle.TargetHelper.prototype.tileIsTargeted = function() {
	return this.possibleTargetTile
			&& this.targetingIsNotCanceledCheck()
			&& this.targetTeamsCheck()
			&& this.targetTileTypesCheck()
			&& this.targetTileIdentifiersCheck()
			&& this.targetTileNamesCheck();
};

Trifle.TargetHelper.prototype.targetingIsNotCanceledCheck = function() {
	if (this.abilityInfo.inevitable) {
		return true;
	}
	var abilityManager = this.abilityObject.board.abilityManager;
	var targetingIsCanceled = abilityManager.targetingIsCanceled(this.abilityObject.sourceTile, this.abilityObject.abilityInfo.type, this.possibleTargetTile);
	return !targetingIsCanceled;
};

Trifle.TargetHelper.prototype.targetTeamsCheck = function() {
	if (this.abilityInfo.targetTeams) {
		var possibleTargetTileOwner = this.possibleTargetTile.ownerName;

		var isFriendlyTargetedTile = this.abilityInfo.targetTeams.includes(Trifle.TileTeam.friendly)
				&& possibleTargetTileOwner === this.abilityObject.sourceTile.ownerName;
		var isEnemyTargetedTile = this.abilityInfo.targetTeams.includes(Trifle.TileTeam.enemy)
				&& possibleTargetTileOwner !== this.abilityObject.sourceTile.ownerName;

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
				&& this.possibleTargetTile === this.abilityObject.sourceTile)
			|| (this.abilityInfo.targetTileTypes.includes(Trifle.TileCategory.allButThisTile)
				&& this.possibleTargetTile !== this.abilityObject.sourceTile);
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
		return arrayIncludesOneOf(this.abilityInfo.targetTileCodes, [this.possibleTargetTile.code])
			|| (this.abilityInfo.targetTileCodes.includes(Trifle.TileCategory.allButThisTile)
				&& this.possibleTargetTile.code !== this.abilityObject.sourceTile.code);
	} else {
		return true;
	}
};

