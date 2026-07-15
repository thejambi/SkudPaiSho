import { arrayIncludesOneOf } from '../../../GameData';

/**
 * RestrictTileFromCapturingCaptureConstraintBrain
 *
 * This constraint brain enforces the restrictTileFromCapturing ability.
 * When active, the tile is restricted from capturing tiles of specific types
 * listed in restrictedFromCapturingTileTypes.
 *
 * Unlike prohibitTileFromCapturing (which blocks ALL captures), this only
 * blocks captures of specific tile types.
 */

export function TrifleRestrictTileFromCapturingCaptureConstraintBrain(board, ability) {
	this.board = board;
	this.ability = ability;
	this.restrictedFromCapturingTileTypes = ability.abilityInfo.restrictedFromCapturingTileTypes || [];
}

/**
 * Check if the capturing tile is allowed to capture the target tile
 * @param {Object} capturingTile - The tile attempting to capture
 * @param {Object} targetTile - The tile being targeted for capture
 * @param {Object} fromPoint - The point the capturing tile is moving from
 * @param {Object} targetPoint - The point with the tile to be captured
 * @returns {Object} { allowed: boolean, reason?: string }
 */
TrifleRestrictTileFromCapturingCaptureConstraintBrain.prototype.isCaptureAllowed = function(capturingTile, targetTile, fromPoint, targetPoint) {
	var targetTileInfo = this.board.tileMetadata[targetTile.code];

	if (!targetTileInfo || !targetTileInfo.types) {
		return { allowed: true };
	}

	// Check if the target tile is one of the restricted types
	if (arrayIncludesOneOf(targetTileInfo.types, this.restrictedFromCapturingTileTypes)) {
		return {
			allowed: false,
			reason: 'Restricted from capturing this tile type'
		};
	}

	return { allowed: true };
};
