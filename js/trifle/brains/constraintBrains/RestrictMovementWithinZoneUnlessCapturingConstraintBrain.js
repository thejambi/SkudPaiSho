/**
 * RestrictMovementWithinZoneUnlessCapturingConstraintBrain
 *
 * This constraint brain enforces the restrictMovementWithinZoneUnlessCapturing ability.
 * Similar to RestrictMovementWithinZone, but allows movement into the zone
 * if the move results in a capture.
 *
 * Movement rules:
 * - Target tile cannot move TO any point within the source tile's zone
 * - UNLESS the target point has an enemy tile that can be captured
 * - Target tile CAN move FROM inside the zone to outside (can escape)
 *
 * Used by tiles like:
 * - TitanArum: restricts animals and banners (zone size 2)
 * - LilyPad: restricts all tiles (zone size 1)
 */

export function TrifleRestrictMovementWithinZoneUnlessCapturingConstraintBrain(board, ability) {
	this.board = board;
	this.ability = ability;
	this.sourceTile = ability.sourceTile;
	this.sourceTilePoint = ability.sourceTilePoint;
}

/**
 * Check if movement from originPoint to targetPoint is allowed
 * @param {Object} tile - The tile being moved
 * @param {Object} originPoint - The starting position
 * @param {Object} targetPoint - The proposed ending position
 * @param {boolean} canCaptureTarget - Whether this move would capture a tile at targetPoint
 * @returns {Object} { allowed: boolean, reason?: string }
 */
TrifleRestrictMovementWithinZoneUnlessCapturingConstraintBrain.prototype.isMovementAllowed = function(tile, originPoint, targetPoint, canCaptureTarget) {
	// If this move is a capture, allow it regardless of zone
	if (canCaptureTarget) {
		return { allowed: true };
	}

	// Check if the target point is within the source tile's zone
	const isTargetInZone = this.board.pointTileZoneContainsPoint(this.sourceTilePoint, targetPoint);

	if (isTargetInZone) {
		return {
			allowed: false,
			reason: 'Cannot move into ' + this.sourceTile.code + '\'s zone unless capturing'
		};
	}

	return { allowed: true };
};
