import { TrifleTileCategory, TrifleTileTeam } from '../TrifleTileInfo';
import { arrayIncludesOneOf, debug } from '../../GameData';

export function TrifleTargetHelper(abilityObject, possibleTargetTilePoint, targetBrain, possibleTargetTile) {
	this.abilityObject = abilityObject;
	this.abilityInfo = abilityObject.abilityInfo;
	this.tileMetadata = abilityObject.board.tileMetadata;

	this.possibleTargetTilePoint = possibleTargetTilePoint;

	/* When an explicit tile is provided, use it — the tile at the point may have
	   changed since the trigger brain identified targets (e.g. captured tiles). */
	if (possibleTargetTile) {
		this.possibleTargetTile = possibleTargetTile;
		this.possibleTargetTileInfo = this.tileMetadata[this.possibleTargetTile.code];
	} else if (this.possibleTargetTilePoint && this.possibleTargetTilePoint.hasTile()) {
		this.possibleTargetTile = this.possibleTargetTilePoint.tile;
		this.possibleTargetTileInfo = this.tileMetadata[this.possibleTargetTile.code];
	} else {
		debug("No posible target tile found!");
	}

	this.targetBrain = targetBrain;
}

TrifleTargetHelper.prototype.tileIsTargeted = function() {
	return this.possibleTargetTile
			&& this.targetingIsNotCanceledCheck()
			&& this.targetTeamsCheck()
			&& this.targetTileTypesCheck()
			&& this.targetTileIdentifiersCheck()
			&& this.targetTileNamesCheck()
			&& this.targetTileIsNotExcludedCheck();
};

TrifleTargetHelper.prototype.targetingIsNotCanceledCheck = function() {
	if (this.abilityInfo.inevitable) {
		return true;
	}
	var abilityManager = this.abilityObject.board.abilityManager;
	var targetingIsCanceled = abilityManager.targetingIsCanceled(this.abilityObject.sourceTile, this.abilityObject.abilityInfo.type, this.possibleTargetTile);
	return !targetingIsCanceled;
};

TrifleTargetHelper.prototype.targetTeamsCheck = function() {
	if (this.abilityInfo.targetTeams) {
		var possibleTargetTileOwner = this.possibleTargetTile.ownerName;

		var isFriendlyTargetedTile = this.abilityInfo.targetTeams.includes(TrifleTileTeam.friendly)
				&& possibleTargetTileOwner === this.abilityObject.sourceTile.ownerName;
		var isEnemyTargetedTile = this.abilityInfo.targetTeams.includes(TrifleTileTeam.enemy)
				&& possibleTargetTileOwner !== this.abilityObject.sourceTile.ownerName;

		return isFriendlyTargetedTile || isEnemyTargetedTile;
	} else {
		return true;
	}
};

TrifleTargetHelper.prototype.targetTileTypesCheck = function() {
	if (this.abilityInfo.targetTileTypes) {
		return this.abilityInfo.targetTileTypes.includes(TrifleTileCategory.allTileTypes)
			|| arrayIncludesOneOf(this.possibleTargetTileInfo.types, this.abilityInfo.targetTileTypes)
			|| (this.abilityInfo.targetTileTypes.includes(TrifleTileCategory.thisTile)
				&& this.possibleTargetTile === this.abilityObject.sourceTile)
			|| (this.abilityInfo.targetTileTypes.includes(TrifleTileCategory.allButThisTile)
				&& this.possibleTargetTile !== this.abilityObject.sourceTile);
	} else {
		return true;
	}
};

TrifleTargetHelper.prototype.targetTileIdentifiersCheck = function() {
	if (this.abilityInfo.targetTileIdentifiers && this.possibleTargetTileInfo.identifiers) {
		return arrayIncludesOneOf(this.abilityInfo.targetTileIdentifiers, this.possibleTargetTileInfo.identifiers);
	} else {
		return true;
	}
};

TrifleTargetHelper.prototype.targetTileNamesCheck = function() {
	if (this.abilityInfo.targetTileCodes) {
		return arrayIncludesOneOf(this.abilityInfo.targetTileCodes, [this.possibleTargetTile.code])
			|| (this.abilityInfo.targetTileCodes.includes(TrifleTileCategory.allButThisTile)
				&& this.possibleTargetTile.code !== this.abilityObject.sourceTile.code);
	} else {
		return true;
	}
};

TrifleTargetHelper.prototype.targetTileIsNotExcludedCheck = function() {
	if (this.abilityInfo.excludeTileCodes) {
		var excluded = this.abilityInfo.excludeTileCodes.includes(this.possibleTargetTile.code);
		if (excluded) {
			debug("Target tile " + this.possibleTargetTile.code + " is excluded by ability: " + this.abilityInfo.type);
		}
		return !excluded;
	} else {
		return true;
	}
};

