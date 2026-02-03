/**
 * ImmobilizeTilesConstraintBrain
 *
 * This constraint brain enforces the immobilizeTiles ability.
 * When a tile is affected by this ability, it cannot move at all.
 *
 * Movement rules:
 * - Target tile cannot move to any point
 * - This is an absolute block on all movement
 * - The only exception is if movement has regardlessOfImmobilization flag
 *   (handled at a higher level before this brain is invoked)
 */

export function TrifleImmobilizeTilesConstraintBrain(board, ability) {
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
TrifleImmobilizeTilesConstraintBrain.prototype.isMovementAllowed = function(tile, originPoint, targetPoint) {
	// Immobilization blocks ALL movement
	return {
		allowed: false,
		reason: 'Tile is immobilized by ' + this.sourceTile.code
	};
};
