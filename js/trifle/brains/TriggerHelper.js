import { TrifleTileCategory, TrifleTileTeam } from '../TrifleTileInfo';
import { arrayIncludesOneOf, debug } from '../../GameData';

export function TrifleTriggerHelper(triggerContext, possibleTargetTilePoint, possibleTargetTile) {
	this.triggerContext = triggerContext;
	if (possibleTargetTile) {
		this.possibleTargetTile = possibleTargetTile;
	} else if (possibleTargetTilePoint) {
		this.possibleTargetTile = possibleTargetTilePoint.tile;
	}
	this.possibleTargetTileInfo = this.possibleTargetTile && triggerContext.board.tileMetadata[this.possibleTargetTile.code];
	this.abilityInfo = this.triggerContext.tileAbilityInfo;
	this.triggerInfo = this.triggerContext.currentTrigger;
}

TrifleTriggerHelper.prototype.tileIsTargeted = function() {
	return this.possibleTargetTile
			&& this.possibleTargetTileInfo 
			&& this.targetingIsNotCanceledCheck()
			&& this.targetTeamsCheck()
			&& this.targetTileTypesCheck()
			&& this.targetTileIdentifiersCheck()
			&& this.targetTileNamesCheck()
			&& this.targetTileBoardPointTypesCheck();
};

TrifleTriggerHelper.prototype.targetingIsNotCanceledCheck = function() {
	/* var abilityManager = this.triggerContext.board.abilityManager;
	var abilitySourceTile = this.triggerContext.tile;
	var abilityType = this.triggerContext.tileAbilityInfo.type;
	var targetingIsCanceled = abilityManager.targetingIsCanceled(abilitySourceTile, abilityType, this.possibleTargetTile);
	return !targetingIsCanceled; */
	return true;	// TODO... this checks if *ability* targeting is canceled.. what if the trigger targets a tile but the ability doesn't? Did you even THINK OF THAT
};

TrifleTriggerHelper.prototype.targetTeamsCheck = function() {
	if (this.triggerInfo.targetTeams) {
		var possibleTargetTileOwner = this.possibleTargetTile.ownerName;

		var isFriendlyTargetedTile = this.triggerInfo.targetTeams.includes(TrifleTileTeam.friendly)
				&& possibleTargetTileOwner === this.triggerContext.tile.ownerName;
		var isEnemyTargetedTile = this.triggerInfo.targetTeams.includes(TrifleTileTeam.enemy)
				&& possibleTargetTileOwner !== this.triggerContext.tile.ownerName;

		return isFriendlyTargetedTile || isEnemyTargetedTile;
	} else {
		return true;
	}
};

// TODO split into "Tile Category Check"?
TrifleTriggerHelper.prototype.targetTileTypesCheck = function() {
	if (this.triggerInfo.targetTileTypes) {
		return this.triggerInfo.targetTileTypes.includes(TrifleTileCategory.allTileTypes)
			|| arrayIncludesOneOf(this.possibleTargetTileInfo.types, this.triggerInfo.targetTileTypes)
			|| (this.triggerInfo.targetTileTypes.includes(TrifleTileCategory.thisTile)
				&& this.possibleTargetTile === this.triggerContext.tile)
			|| (this.triggerInfo.targetTileTypes.includes(TrifleTileCategory.allButThisTile)
				&& this.possibleTargetTile !== this.triggerContext.tile);
	} else {
		return true;
	}
};

TrifleTriggerHelper.prototype.targetTileIdentifiersCheck = function() {
	if (this.triggerInfo.targetTileIdentifiers && this.possibleTargetTileInfo.identifiers) {
		return arrayIncludesOneOf(this.triggerInfo.targetTileIdentifiers, this.possibleTargetTileInfo.identifiers);
	} else {
		return true;
	}
};

TrifleTriggerHelper.prototype.targetTileNamesCheck = function() {
	if (this.triggerInfo.targetTileCodes) {
		return arrayIncludesOneOf(this.triggerInfo.targetTileCodes, [this.possibleTargetTile.code])
			|| (this.triggerInfo.targetTileCodes.includes(TrifleTileCategory.allButThisTile)
				&& this.possibleTargetTile.code !== this.triggerContext.tile.code);
	} else {
		return true;
	}
};

TrifleTriggerHelper.prototype.targetTileBoardPointTypesCheck = function() {
	if (this.triggerInfo.targetTileBoardPointTypes) {
		return this.possibleTargetTile && this.possibleTargetTile.seatedPoint 
			&& this.possibleTargetTile.seatedPoint.isOneOrMoreOfTheseTypes(this.triggerInfo.targetTileBoardPointTypes);
	} else {
		return true;
	}
};

TrifleTriggerHelper.hasInfo = function(triggerInfo) {
	// Could be used to validate trigger info...
	var looksValid = triggerInfo.triggerType;

	if (!looksValid) {
		debug("Trigger info does not look valid: ");
		debug(triggerInfo);
	}

	return looksValid;
};
