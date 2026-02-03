/**
 * ProhibitTileFromCapturingCaptureConstraintBrain
 *
 * This constraint brain enforces the prohibitTileFromCapturing ability.
 * When a tile has this ability targeting it, it cannot make captures.
 *
 * Used by tiles like:
 * - Cattail: Adjacent enemy tiles cannot capture
 * - Duckweed: Enemy tiles in zone cannot capture
 */

export function TrifleProhibitTileFromCapturingCaptureConstraintBrain(board, ability) {
	this.board = board;
	this.ability = ability;
	this.sourceTile = ability.sourceTile;
}

/**
 * Check if the capturing tile is allowed to capture
 * @param {Object} capturingTile - The tile attempting to capture
 * @param {Object} targetTile - The tile being targeted for capture
 * @param {Object} fromPoint - The point the capturing tile is moving from
 * @param {Object} targetPoint - The point with the tile to be captured
 * @returns {Object} { allowed: boolean, reason?: string }
 */
TrifleProhibitTileFromCapturingCaptureConstraintBrain.prototype.isCaptureAllowed = function(capturingTile, targetTile, fromPoint, targetPoint) {
	// This ability prevents the capturing tile from making any captures
	return {
		allowed: false,
		reason: 'Tile is prohibited from capturing by ' + this.sourceTile.code
	};
};
