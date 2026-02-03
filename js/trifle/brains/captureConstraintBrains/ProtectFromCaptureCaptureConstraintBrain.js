/**
 * ProtectFromCaptureCaptureConstraintBrain
 *
 * This constraint brain enforces the protectFromCapture ability.
 * When a tile has this ability targeting it, it cannot be captured.
 *
 * Used by tiles like:
 * - PolarBearDog: Protects itself for 1 turn after capturing
 * - Duckweed: Protects friendly tiles in its zone
 * - Temple protection (Ginseng): Tiles in temples can't be captured
 */

export function TrifleProtectFromCaptureCaptureConstraintBrain(board, ability) {
	this.board = board;
	this.ability = ability;
	this.sourceTile = ability.sourceTile;
}

/**
 * Check if capture of the target tile is allowed
 * @param {Object} capturingTile - The tile attempting to capture
 * @param {Object} targetTile - The tile being targeted for capture
 * @param {Object} fromPoint - The point the capturing tile is moving from
 * @param {Object} targetPoint - The point with the tile to be captured
 * @returns {Object} { allowed: boolean, reason?: string }
 */
TrifleProtectFromCaptureCaptureConstraintBrain.prototype.isCaptureAllowed = function(capturingTile, targetTile, fromPoint, targetPoint) {
	// This ability protects the target tile from being captured
	return {
		allowed: false,
		reason: 'Tile is protected from capture by ' + this.sourceTile.code
	};
};
