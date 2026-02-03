/**
 * RestrictMovementWithinZoneConstraintBrain
 *
 * This constraint brain enforces the restrictMovementWithinZone ability.
 * When a tile is affected by this ability, it cannot move to points
 * within the zone of the source tile.
 *
 * Movement rules:
 * - Target tile cannot move TO any point within the source tile's zone
 * - Target tile CAN move FROM inside the zone to outside (can escape)
 * - This creates a "no-go zone" that affected tiles cannot enter or stay in
 *
 * Used by tiles like:
 * - SkyBison: restricts enemy SkyBison (zone size 6)
 * - GrassWeed: restricts flowers (zone size 1)
 */

export function TrifleRestrictMovementWithinZoneConstraintBrain(board, ability) {
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
 * @returns {Object} { allowed: boolean, reason?: string }
 */
TrifleRestrictMovementWithinZoneConstraintBrain.prototype.isMovementAllowed = function(tile, originPoint, targetPoint) {
	// Check if the target point is within the source tile's zone
	const isTargetInZone = this.board.pointTileZoneContainsPoint(this.sourceTilePoint, targetPoint);

	if (isTargetInZone) {
		return {
			allowed: false,
			reason: 'Cannot move into ' + this.sourceTile.code + '\'s zone'
		};
	}

	return { allowed: true };
};
