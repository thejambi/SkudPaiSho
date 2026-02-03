/**
 * DrawTilesAlongLineOfSightConstraintBrain
 *
 * This constraint brain enforces the drawTilesAlongLineOfSight ability.
 * When a tile is affected by this ability, it must move closer to the
 * source tile along line of sight.
 *
 * Movement rules:
 * - Target tile must stay in line of sight of the drawing tile
 * - Target tile must move closer to the drawing tile
 * - Target tile cannot move past the drawing tile
 * - Target tile CAN move onto the drawing tile's point (capture attempt)
 * - If multiple draw abilities affect the tile, no movement is allowed
 */

export function TrifleDrawTilesAlongLineOfSightConstraintBrain(board, ability) {
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
TrifleDrawTilesAlongLineOfSightConstraintBrain.prototype.isMovementAllowed = function(tile, originPoint, targetPoint) {
	// Allow movement onto the source tile's point (capture attempt)
	if (targetPoint === this.sourceTilePoint) {
		return { allowed: true };
	}

	// Check if target point is in line of sight of the source tile
	if (!this.targetPointIsInLineOfSightOfSource(targetPoint)) {
		return {
			allowed: false,
			reason: 'Movement must stay in line of sight of ' + this.sourceTile.code
		};
	}

	// Check if target point is closer to source than origin point
	if (!this.targetPointIsCloserToSourceThanOrigin(targetPoint, originPoint)) {
		return {
			allowed: false,
			reason: 'Movement must bring tile closer to ' + this.sourceTile.code
		};
	}

	// Check that tile doesn't move past the source tile
	const moveDistance = this.board.getDistanceBetweenPoints(originPoint, targetPoint);
	const distanceToSource = this.board.getDistanceBetweenPoints(originPoint, this.sourceTilePoint);
	if (moveDistance >= distanceToSource) {
		return {
			allowed: false,
			reason: 'Cannot move past ' + this.sourceTile.code
		};
	}

	return { allowed: true };
};

/**
 * Check if the target point is in line of sight of the source tile
 */
TrifleDrawTilesAlongLineOfSightConstraintBrain.prototype.targetPointIsInLineOfSightOfSource = function(targetPoint) {
	const lineOfSightPoints = this.board.getPointsForTilesInLineOfSight(targetPoint);

	// Check if source tile point is in line of sight from target point
	for (let i = 0; i < lineOfSightPoints.length; i++) {
		if (lineOfSightPoints[i] === this.sourceTilePoint) {
			return true;
		}
	}

	// Also check if target point is on the same line as source
	// (for empty spaces in line of sight)
	return this.pointsAreOnSameLine(targetPoint, this.sourceTilePoint);
};

/**
 * Check if two points are on the same orthogonal line
 */
TrifleDrawTilesAlongLineOfSightConstraintBrain.prototype.pointsAreOnSameLine = function(point1, point2) {
	return point1.row === point2.row || point1.col === point2.col;
};

/**
 * Check if target point is closer to source than origin point
 */
TrifleDrawTilesAlongLineOfSightConstraintBrain.prototype.targetPointIsCloserToSourceThanOrigin = function(targetPoint, originPoint) {
	const targetDistance = this.board.getDistanceBetweenPoints(targetPoint, this.sourceTilePoint);
	const originDistance = this.board.getDistanceBetweenPoints(originPoint, this.sourceTilePoint);
	return targetDistance < originDistance;
};
