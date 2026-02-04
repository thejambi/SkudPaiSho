/**
 * RequireDeployInZoneConstraintBrain
 *
 * This constraint brain enforces the requireDeployInZone ability.
 * When active, tiles of certain types must be deployed within the
 * source tile's zone.
 *
 * Deploy rules:
 * - Tiles matching deployTargetTileTypes must deploy within the source tile's zone
 * - Tiles not matching deployTargetTileTypes are unaffected
 */

export function TrifleRequireDeployInZoneConstraintBrain(board, ability) {
	this.board = board;
	this.ability = ability;
	this.sourceTile = ability.sourceTile;
	this.sourceTilePoint = ability.sourceTilePoint;
	this.deployTargetTileTypes = ability.abilityInfo.deployTargetTileTypes || [];
}

/**
 * Check if deploying a tile at a given point is allowed
 * @param {Object} deployingTile - The tile being deployed
 * @param {Object} deployingTileInfo - The tile metadata for the deploying tile
 * @param {Object} deployPoint - The proposed deploy position
 * @returns {Object} { allowed: boolean, reason?: string }
 */
TrifleRequireDeployInZoneConstraintBrain.prototype.isDeployAllowed = function(deployingTile, deployingTileInfo, deployPoint) {
	// Check if the deploying tile is one of the targeted types
	if (!deployingTileInfo || !deployingTileInfo.types) {
		return { allowed: true };
	}

	var isTargetedType = false;
	this.deployTargetTileTypes.forEach(function(targetType) {
		if (deployingTileInfo.types.includes(targetType)) {
			isTargetedType = true;
		}
	});

	if (!isTargetedType) {
		return { allowed: true };
	}

	// Deploying tile is a targeted type - must be within the source tile's zone
	var isInZone = this.board.pointTileZoneContainsPoint(this.sourceTilePoint, deployPoint);

	if (isInZone) {
		return { allowed: true };
	}

	return {
		allowed: false,
		reason: 'Must deploy within ' + this.sourceTile.code + '\'s zone'
	};
};
