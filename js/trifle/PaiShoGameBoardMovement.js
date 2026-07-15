// Trifle Engine - Board Movement Methods
// Documentation: ~/Dropbox/Programming/SkudPaiSho/TheGardenGate/backend/TGGDocumentation/Trifle/
//
// The movement system of PaiShoGameBoard, split out for readability: possible-move
// calculation for every movement type, path shapes, movement manipulation abilities,
// immobilization checks, and movement-capture legality.
//
// These are prototype methods of PaiShoGameBoard (mixed in via Object.assign at the
// bottom of js); `this` is the board.

import {
	NotationPoint,
} from '../CommonNotationObjects';
import { arrayIncludesOneOf, debug } from '../GameData';
import { paiShoBoardMaxRowOrCol } from '../pai-sho-common/PaiShoBoardHelp';
import { getOpponentName } from '../pai-sho-common/PaiShoPlayerHelp';
import {
	NON_PLAYABLE,
	POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { TEMPLE, TrifleBoardPoint } from './TrifleBoardPoint';
import {
	TrifleAbilityName,
	TrifleCaptureType,
	TrifleMoveDirection,
	TrifleMovementAbility,
	TrifleMovementDirection,
	TrifleMovementRestriction,
	TrifleMovementType,
	TrifleTileCategory,
	TrifleTileInfo,
	TrifleTileTeam,
	TrifleZoneAbility
} from './TrifleTileInfo';

/* Movement functions: given the current point along a path, return the next
   candidate points for the movement type. Pure functions taking the board. */

function standardMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
	return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
}

function standardAndAlongGardenWallMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
	var points = board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
	if (board.isGardenWallPoint(boardPointAlongTheWay)) {
		var diagonalPoints = board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, false, movementInfo);
		diagonalPoints.forEach(function(dp) {
			if (board.isGardenWallPoint(dp)) {
				points.push(dp);
			}
		});
	}
	return points;
}

function diagonalMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
	return board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
}

function orthAndDiagMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
	return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo)
		.concat(board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo));
}

function jumpAlongLineOfSightMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	return board.getPointsNextToTilesInLineOfSight(movementInfo, originPoint);
}

function jumpShapeMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
	return board.getNextPointsForJumpShapeMovement(movementInfo, originPoint, boardPointAlongTheWay, mustPreserveDirection);
}

function travelShapeMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber, currentMovementPath) {
	const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
	return board.getNextPointsForTravelShapeMovement(movementInfo, moveStepNumber, originPoint, boardPointAlongTheWay, currentMovementPath, mustPreserveDirection);
}

function jumpSurroundingTilesMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, movementStepNumber) {
	const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
	return board.getJumpSurroundingTilesPointsPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
}

function awayFromTargetTileMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	if (movementInfo.targetTilePoint) {
		return board.getAwayFromTilePossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
	} else {
		debug("Missing targetTilePoint");
	}
}

function awayFromTargetTileOrthogonalMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	if (movementInfo.targetTilePoint) {
		return board.getAwayFromTileOrthogonalPossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
	} else {
		debug("Missing targetTilePoint");
	}
}

function awayFromTargetTileDiagonalMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	if (movementInfo.targetTilePoint) {
		return board.getAwayFromTileDiagonalPossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
	} else {
		debug("Missing targetTilePoint");
	}
}

function jumpTargetTileMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	if (movementInfo.targetTilePoint) {
		return board.getJumpTargetTilePossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
	} else {
		debug("Missing targetTilePoint");
	}
}

export const TrifleBoardMovementMethods = {

	getAdjacentPointsPotentialPossibleMoves(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
		var potentialMovePoints = [];

		if (!pointAlongTheWay) {
			pointAlongTheWay = originPoint;
		}
		var rowDifference = originPoint.row - pointAlongTheWay.row;
		var colDifference = originPoint.col - pointAlongTheWay.col;

		if (pointAlongTheWay.row > 0) {
			potentialMovePoints.push(this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col]);
		}
		if (pointAlongTheWay.row < paiShoBoardMaxRowOrCol) {
			potentialMovePoints.push(this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col]);
		}
		if (pointAlongTheWay.col > 0) {
			potentialMovePoints.push(this.cells[pointAlongTheWay.row][pointAlongTheWay.col - 1]);
		}
		if (pointAlongTheWay.col < paiShoBoardMaxRowOrCol) {
			potentialMovePoints.push(this.cells[pointAlongTheWay.row][pointAlongTheWay.col + 1]);
		}

		var finalPoints = [];

		potentialMovePoints.forEach(function(potentialMovePoint) {
			if (!potentialMovePoint.isType(NON_PLAYABLE) && !potentialMovePoint.isPossibleForMovementType(movementInfo)) {
				var newRowDiff = originPoint.row - potentialMovePoint.row;
				var newColDiff = originPoint.col - potentialMovePoint.col;
				if (!mustPreserveDirection
					|| (rowDifference >= 0 && newRowDiff >= 0 && newColDiff === 0)
					|| (rowDifference <= 0 && newRowDiff <= 0 && newColDiff === 0)
					|| (colDifference >= 0 && newColDiff >= 0 && newRowDiff === 0)
					|| (colDifference <= 0 && newColDiff <= 0 && newRowDiff === 0)
				) {
					finalPoints.push(potentialMovePoint);
				}
			}
		});

		return finalPoints;
	},

	getAdjacentDiagonalPointsPotentialPossibleMoves(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
		var diagonalPoints = [];

		if (!pointAlongTheWay) {
			pointAlongTheWay = originPoint;
		}
		var rowDifference = originPoint.row - pointAlongTheWay.row;
		var colDifference = originPoint.col - pointAlongTheWay.col;

		var ignorePreserveDirection = !mustPreserveDirection || pointAlongTheWay === originPoint;

		if (
			(ignorePreserveDirection || (mustPreserveDirection && rowDifference > 0 && colDifference > 0))
			&& (pointAlongTheWay.row > 0 && pointAlongTheWay.col > 0)
		) {
			var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col - 1];
			if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
				diagonalPoints.push(adjacentPoint);
			}
		}
		if (
			(ignorePreserveDirection || (mustPreserveDirection && rowDifference < 0 && colDifference < 0))
			&& (pointAlongTheWay.row < paiShoBoardMaxRowOrCol && pointAlongTheWay.col < paiShoBoardMaxRowOrCol)
		) {
			var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col + 1];
			if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
				diagonalPoints.push(adjacentPoint);
			}
		}
		if (
			(ignorePreserveDirection || (mustPreserveDirection && colDifference > 0 && rowDifference < 0))
			&& (pointAlongTheWay.col > 0 && pointAlongTheWay.row < paiShoBoardMaxRowOrCol)
		) {
			var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col - 1];
			if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
				diagonalPoints.push(adjacentPoint);
			}
		}
		if (
			(ignorePreserveDirection || (mustPreserveDirection && colDifference < 0 && rowDifference > 0))
			&& (pointAlongTheWay.col < paiShoBoardMaxRowOrCol && pointAlongTheWay.row > 0)
		) {
			var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col + 1];
			if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
				diagonalPoints.push(adjacentPoint);
			}
		}

		return diagonalPoints;
	},

	calculateSlopeBetweenPoints(p1, p2) {
		var rise = p2.row - p1.row;
		var run = p2.col - p1.col;
		if (run === 0) {
			if (rise === 0) {
				return 0; // same point
			}
			return (rise > 0) ? Infinity : -Infinity; // vertical line
		}
		return rise / run;
	},

	getNextPointsForTravelShapeMovement(movementInfo, moveStepNumber, originPoint, pointAlongTheWay, currentMovementPath, mustPreserveDirection) {
		var nextPoints = [];
		if (movementInfo.shape && movementInfo.shape.length > 0) {
			var travelDirection = movementInfo.shape[moveStepNumber];
			if (moveStepNumber === 0) {
				/* Direction must be 'any' */
				if (travelDirection === TrifleMoveDirection.any) {
					nextPoints = this.getAdjacentPoints(pointAlongTheWay);
				}
			} else {
				var directionalMovements = this.getDirectionalMovements(currentMovementPath);
				if (directionalMovements[TrifleMoveDirection.left]
					&& (travelDirection === TrifleMoveDirection.left || travelDirection === TrifleMoveDirection.turn)) {
					nextPoints.push(directionalMovements[TrifleMoveDirection.left]);
				}
				if (directionalMovements[TrifleMoveDirection.right]
					&& (travelDirection === TrifleMoveDirection.right || travelDirection === TrifleMoveDirection.turn)) {
					nextPoints.push(directionalMovements[TrifleMoveDirection.right]);
				}
				if (directionalMovements[TrifleMoveDirection.straight] && travelDirection === TrifleMoveDirection.straight) {
					nextPoints.push(directionalMovements[TrifleMoveDirection.straight]);
				}
			}
		}
		return nextPoints;
	},

	getDirectionalMovements(currentMovementPath) {
		var directionalMovements = {};
		if (currentMovementPath.length > 1) {
			var p1 = currentMovementPath[currentMovementPath.length - 2];
			var p2 = currentMovementPath[currentMovementPath.length - 1];

			if (p2.col > p1.col) {
				if (p2.row - 1 >= 0) {
					directionalMovements[TrifleMoveDirection.left] = this.cells[p2.row - 1][p2.col];
				}
				if (p2.row + 1 <= paiShoBoardMaxRowOrCol) {
					directionalMovements[TrifleMoveDirection.right] = this.cells[p2.row + 1][p2.col];
				}
				if (p2.col + 1 <= paiShoBoardMaxRowOrCol) {
					directionalMovements[TrifleMoveDirection.straight] = this.cells[p2.row][p2.col + 1];
				}
			} else if (p2.col < p1.col) {
				if (p2.row + 1 <= paiShoBoardMaxRowOrCol) {
					directionalMovements[TrifleMoveDirection.left] = this.cells[p2.row + 1][p2.col];
				}
				if (p2.row - 1 >= 0) {
					directionalMovements[TrifleMoveDirection.right] = this.cells[p2.row - 1][p2.col];
				}
				if (p2.col - 1 >= 0) {
					directionalMovements[TrifleMoveDirection.straight] = this.cells[p2.row][p2.col - 1];
				}
			} else if (p2.row > p1.row) {
				if (p2.col + 1 <= paiShoBoardMaxRowOrCol) {
					directionalMovements[TrifleMoveDirection.left] = this.cells[p2.row][p2.col + 1];
				}
				if (p2.col - 1 >= 0) {
					directionalMovements[TrifleMoveDirection.right] = this.cells[p2.row][p2.col - 1];
				}
				if (p2.row + 1 <= paiShoBoardMaxRowOrCol) {
					directionalMovements[TrifleMoveDirection.straight] = this.cells[p2.row + 1][p2.col];
				}
			} else if (p2.row < p1.row) {
				if (p2.col - 1 >= 0) {
					directionalMovements[TrifleMoveDirection.left] = this.cells[p2.row][p2.col - 1];
				}
				if (p2.col + 1 <= paiShoBoardMaxRowOrCol) {
					directionalMovements[TrifleMoveDirection.right] = this.cells[p2.row][p2.col + 1];
				}
				if (p2.row - 1 >= 0) {
					directionalMovements[TrifleMoveDirection.straight] = this.cells[p2.row - 1][p2.col];
				}
			}
		}
		return directionalMovements;
	},

	getNextPointsForJumpShapeMovement(movementInfo, originPoint, pointAlongTheWay, mustPreserveDirection) {
		var pointsStartingWithRowStep = [];
		var pointsStartingWithColStep = [];
		var finalPoints = [];
		var slope = this.calculateSlopeBetweenPoints(originPoint, pointAlongTheWay);
		if (movementInfo.shape && movementInfo.shape.length > 0) {
			/* `shape` should only ever have two numbers, but this will work for any number of numbers. */
			for (var stepNum = 0; stepNum < movementInfo.shape.length; stepNum++) {
				var stepDistance = movementInfo.shape[stepNum];
				if (stepNum === 0) {
					pointsStartingWithRowStep = this.getPointsWithMoveStepAppliedToRow([pointAlongTheWay], stepDistance);
					pointsStartingWithColStep = this.getPointsWithMoveStepAppliedToCol([pointAlongTheWay], stepDistance);
				} else if (stepNum % 2 === 1) {	/* odd: 1,3,5... */
					pointsStartingWithRowStep = this.getPointsWithMoveStepAppliedToCol(pointsStartingWithRowStep, stepDistance);
					pointsStartingWithColStep = this.getPointsWithMoveStepAppliedToRow(pointsStartingWithColStep, stepDistance);
				} else if (stepNum % 2 === 0) {	/* even: 2,4,6... */
					pointsStartingWithRowStep = this.getPointsWithMoveStepAppliedToRow(pointsStartingWithRowStep, stepDistance);
					pointsStartingWithColStep = this.getPointsWithMoveStepAppliedToCol(pointsStartingWithColStep, stepDistance);
				}
			}

			const possibleNextPoints = pointsStartingWithRowStep.concat(pointsStartingWithColStep);
			const reallyMustPreserveDirection = mustPreserveDirection && slope !== 0;
			possibleNextPoints.forEach((point) => {
				if (!point.isType(NON_PLAYABLE) && !point.isPossibleForMovementType(movementInfo)
					&& (!reallyMustPreserveDirection || this.calculateSlopeBetweenPoints(pointAlongTheWay, point) === slope)) {
					finalPoints.push(point);
				}
			});
		}

		return finalPoints;
	},

	getPointsWithMoveStepAppliedToRow(startPoints, stepDistance) {
		const nextPoints = [];
		if (startPoints && startPoints.length) {
			startPoints.forEach((boardPointStart) => {
				const nextRow1 = boardPointStart.row + stepDistance;
				if (nextRow1 <= paiShoBoardMaxRowOrCol) {
					const possibleNextPoint = this.cells[nextRow1][boardPointStart.col];
					if (!possibleNextPoint.isType(NON_PLAYABLE)) {
						nextPoints.push(possibleNextPoint);
					}
				}
				const nextRow2 = boardPointStart.row - stepDistance;
				if (nextRow2 >= 0) {
					const possibleNextPoint = this.cells[nextRow2][boardPointStart.col];
					if (!possibleNextPoint.isType(NON_PLAYABLE)) {
						nextPoints.push(possibleNextPoint);
					}
				}
			});
		}
		return nextPoints;
	},

	getPointsWithMoveStepAppliedToCol(startPoints, stepDistance) {
		const nextPoints = [];
		if (startPoints && startPoints.length) {
			startPoints.forEach((boardPointStart) => {
				const nextCol1 = boardPointStart.col + stepDistance;
				if (nextCol1 <= paiShoBoardMaxRowOrCol) {
					const possibleNextPoint = this.cells[boardPointStart.row][nextCol1];
					if (!possibleNextPoint.isType(NON_PLAYABLE)) {
						nextPoints.push(possibleNextPoint);
					}
				}
				const nextCol2 = boardPointStart.col - stepDistance;
				if (nextCol2 >= 0) {
					const possibleNextPoint = this.cells[boardPointStart.row][nextCol2];
					if (!possibleNextPoint.isType(NON_PLAYABLE)) {
						nextPoints.push(possibleNextPoint);
					}
				}
			});
		}
		return nextPoints;
	},

	targetTileMatchesTargetTeam(targetTile, originTile, targetTeams) {
		var matchesTargetTeam = false;

		targetTeams.forEach(function(targetTeam) {
			if (targetTeam === TrifleTileTeam.friendly && targetTile.ownerName === originTile.ownerName) {
				matchesTargetTeam = true;
			} else if (targetTeam === TrifleTileTeam.enemy && targetTile.ownerName !== originTile.ownerName) {
				matchesTargetTeam = true;
			}
		});

		return matchesTargetTeam;
	},

	getJumpSurroundingTilesPointsPossibleMoves(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
		var potentialMovePoints = [];

		var finalPoints = [];

		if (!pointAlongTheWay) {
			pointAlongTheWay = originPoint;
		}

		const surroundingPoints = this.getSurroundingBoardPoints(pointAlongTheWay);

		surroundingPoints.forEach((surroundingPoint) => {
			if (surroundingPoint.hasTile() && this.targetTileMatchesTargetTeam(surroundingPoint.tile, originPoint.tile, movementInfo.targetTeams)) {
				potentialMovePoints = [];

				if (movementInfo.jumpDirections && movementInfo.jumpDirections.includes(TrifleMovementDirection.diagonal)
					&& surroundingPoint.row !== pointAlongTheWay.row && surroundingPoint.col !== pointAlongTheWay.col) {
					potentialMovePoints = potentialMovePoints.concat(this.getSurroundingBoardPoints(surroundingPoint));
				}
				if (movementInfo.jumpDirections && movementInfo.jumpDirections.includes(TrifleMovementDirection.orthogonal)
					&& (surroundingPoint.row === pointAlongTheWay.row || surroundingPoint.col === pointAlongTheWay.col)) {
					potentialMovePoints = potentialMovePoints.concat(this.getSurroundingBoardPoints(surroundingPoint));
				}

				const slopeToSurrounding = this.calculateSlopeBetweenPoints(pointAlongTheWay, surroundingPoint);

				potentialMovePoints.forEach((potentialMovePoint) => {
					const slopeToPotential = this.calculateSlopeBetweenPoints(pointAlongTheWay, potentialMovePoint);
					if (!potentialMovePoint.hasTile() && slopeToPotential === slopeToSurrounding) {	// TODO: Or can capture?
						finalPoints.push(potentialMovePoint);
					}
				});
			}
		});

		return finalPoints;
	},

	getAwayFromTilePossibleMoves(targetTilePoint, originPoint, boardPointAlongTheWay) {
		var movePoints = [];

		// Get points surrounding this one. The one that is farther away from targetTilePoint with same slope is the one
		var surroundingPoints = this.getSurroundingBoardPoints(boardPointAlongTheWay);

		var originalDistance = this.getDistanceBetweenPoints(targetTilePoint, originPoint);
		var originalSlope = this.calculateSlopeBetweenPoints(targetTilePoint, originPoint);

		surroundingPoints.forEach((surroundingPoint) => {
			if (!surroundingPoint.hasTile()) {
				var distance = this.getDistanceBetweenPoints(targetTilePoint, surroundingPoint);
				var slope = this.calculateSlopeBetweenPoints(targetTilePoint, surroundingPoint);

				if (slope === originalSlope && distance > originalDistance) {
					movePoints.push(surroundingPoint);
				}
			}
		});

		return movePoints;
	},

	getAwayFromTileOrthogonalPossibleMoves(targetTilePoint, originPoint, boardPointAlongTheWay) {
		var movePoints = [];

		// Get points adjacent to this one. The one that is farther away from targetTilePoint with same slope is the one
		var adjacentPoints = this.getAdjacentPoints(boardPointAlongTheWay);

		var originalDistance = this.getDistanceBetweenPoints(targetTilePoint, originPoint);
		var originalSlope = this.calculateSlopeBetweenPoints(targetTilePoint, originPoint);

		adjacentPoints.forEach((surroundingPoint) => {
			if (!surroundingPoint.hasTile()) {
				var distance = this.getDistanceBetweenPoints(targetTilePoint, surroundingPoint);
				var slope = this.calculateSlopeBetweenPoints(targetTilePoint, surroundingPoint);

				if (slope === originalSlope && distance > originalDistance) {
					movePoints.push(surroundingPoint);
				}
			}
		});

		return movePoints;
	},

	getAwayFromTileDiagonalPossibleMoves(targetTilePoint, originPoint, boardPointAlongTheWay) {
		var movePoints = [];

		// Get points diagonal to this one. The one that is farther away from targetTilePoint with same slope is the one
		var diagonalPoints = this.getDiagonalBoardPoints(boardPointAlongTheWay);

		var originalDistance = this.getDistanceBetweenPoints(targetTilePoint, originPoint);
		var originalSlope = this.calculateSlopeBetweenPoints(targetTilePoint, originPoint);

		diagonalPoints.forEach((surroundingPoint) => {
			if (!surroundingPoint.hasTile()) {
				var distance = this.getDistanceBetweenPoints(targetTilePoint, surroundingPoint);
				var slope = this.calculateSlopeBetweenPoints(targetTilePoint, surroundingPoint);

				if (slope === originalSlope && distance > originalDistance) {
					movePoints.push(surroundingPoint);
				}
			}
		});

		return movePoints;
	},

	getJumpTargetTilePossibleMoves(targetTilePoint, originPoint, boardPointAlongTheWay) {
		var movePoints = [];

		// Calculate flip point
		var flipPointRow = targetTilePoint.row + (targetTilePoint.row - originPoint.row);
		var flipPointCol = targetTilePoint.col + (targetTilePoint.col - originPoint.col);

		var flipPoint = this.cells[flipPointRow][flipPointCol];

		if (!flipPoint.hasTile()) {
			movePoints.push(flipPoint);
		}

		return movePoints;
	},

	getPointsNextToTilesInLineOfSight(movementInfo, originPoint) {
		var jumpPoints = [];
		if (movementInfo.type === TrifleMovementType.jumpAlongLineOfSight && movementInfo.targetTileTypes) {
			/* Scan in all directions, if a tile found, see if it can be jumped to */
			var tileFound = false;
			for (var row = originPoint.row + 1; row < paiShoBoardMaxRowOrCol && !tileFound; row++) {
				var checkPoint = this.cells[row + 1][originPoint.col]; // Look ahead
				if (checkPoint.hasTile()) {
					tileFound = true;
					var checkPointTileInfo = this.tileMetadata[checkPoint.tile.code];
					if (checkPointTileInfo && TrifleTileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
						jumpPoints.push(this.cells[row][originPoint.col]);
					}
				}
			}

			tileFound = false;
			for (var row = originPoint.row - 1; row > 0 && !tileFound; row--) {
				var checkPoint = this.cells[row - 1][originPoint.col]; // Look ahead
				if (checkPoint.hasTile()) {
					tileFound = true;
					var checkPointTileInfo = this.tileMetadata[checkPoint.tile.code];
					if (checkPointTileInfo && TrifleTileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
						jumpPoints.push(this.cells[row][originPoint.col]);
					}
				}
			}

			tileFound = false;
			for (var col = originPoint.col + 1; col < paiShoBoardMaxRowOrCol && !tileFound; col++) {
				var checkPoint = this.cells[originPoint.row][col + 1]; // Look ahead
				if (checkPoint.hasTile()) {
					tileFound = true;
					var checkPointTileInfo = this.tileMetadata[checkPoint.tile.code];
					if (checkPointTileInfo && TrifleTileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
						jumpPoints.push(this.cells[originPoint.row][col]);
					}
				}
			}

			tileFound = false;
			for (var col = originPoint.col - 1; col > 0 && !tileFound; col--) {
				var checkPoint = this.cells[originPoint.row][col - 1]; // Look ahead
				if (checkPoint.hasTile()) {
					tileFound = true;
					var checkPointTileInfo = this.tileMetadata[checkPoint.tile.code];
					if (checkPointTileInfo && TrifleTileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
						jumpPoints.push(this.cells[originPoint.row][col]);
					}
				}
			}
		}
		return jumpPoints;
	},

	getPointsForTilesInLineOfSight(originPoint, distance) {
		var lineOfSightPoints = [];
		if (!distance) {
			distance = 99;
		}

		/* Scan in all directions, if a tile found, add to list */
		var tileFound = false;
		for (var row = originPoint.row + 1; row <= paiShoBoardMaxRowOrCol && !tileFound && row <= originPoint.row + distance; row++) {
			var checkPoint = this.cells[row][originPoint.col];
			if (checkPoint.hasTile()) {
				tileFound = true;
				lineOfSightPoints.push(this.cells[row][originPoint.col]);
			}
		}

		tileFound = false;
		for (var row = originPoint.row - 1; row >= 0 && !tileFound && row >= originPoint.row - distance; row--) {
			var checkPoint = this.cells[row][originPoint.col];
			if (checkPoint.hasTile()) {
				tileFound = true;
				lineOfSightPoints.push(this.cells[row][originPoint.col]);
			}
		}

		tileFound = false;
		for (var col = originPoint.col + 1; col <= paiShoBoardMaxRowOrCol && !tileFound && col <= originPoint.col + distance; col++) {
			var checkPoint = this.cells[originPoint.row][col];
			if (checkPoint.hasTile()) {
				tileFound = true;
				lineOfSightPoints.push(this.cells[originPoint.row][col]);
			}
		}

		tileFound = false;
		for (var col = originPoint.col - 1; col >= 0 && !tileFound && col >= originPoint.col - distance; col--) {
			var checkPoint = this.cells[originPoint.row][col];
			if (checkPoint.hasTile()) {
				tileFound = true;
				lineOfSightPoints.push(this.cells[originPoint.row][col]);
			}
		}

		return lineOfSightPoints;
	},

	inLineWithAdjacentFlowerTileWithNothingBetween(bp, bp2) {
		var flowerPoint;

		if (bp.row === bp2.row) {
			// On same row
			var scanFromCol = bp2.col + 1;
			var scanToCol = bp.col;

			if (bp.col > bp2.col && bp2.col > 0) {
				flowerPoint = this.cells[bp2.row][bp2.col - 1];
			} else if (bp.col < bp2.col && bp2.col < 16) {
				flowerPoint = this.cells[bp2.row][bp2.col + 1];

				scanFromCol = bp.col + 1;
				scanToCol = bp2.col;
			}

			/* Return false if there's a tile in-between target points */
			for (var checkCol = scanFromCol; checkCol < scanToCol; checkCol++) {
				if (this.cells[bp.row][checkCol].hasTile()) {
					return false;
				}
			}
		} else if (bp.col === bp2.col) {
			// On same col
			var scanFromRow = bp2.row + 1;
			var scanToRow = bp.row;

			if (bp.row > bp2.row && bp2.row > 0) {
				flowerPoint = this.cells[bp2.row - 1][bp2.col];
			} else if (bp.row < bp2.row && bp2.row < 16) {
				flowerPoint = this.cells[bp2.row + 1][bp2.col];

				scanFromRow = bp.row + 1;
				scanToRow = bp2.row;
			}

			/* Return false if there's a tile in-between target points */
			for (var checkRow = scanFromRow; checkRow < scanToRow; checkRow++) {
				if (this.cells[checkRow][bp.col].hasTile()) {
					return false;
				}
			}
		}

		if (flowerPoint && flowerPoint.hasTile()) {
			return flowerPoint.tile.isFlowerTile();
		}
		return false;
	},

	verifyAbleToReach(boardPointStart, boardPointEnd, numMoves, movingTile) {
		// Recursion!
		return this.pathFound(boardPointStart, boardPointEnd, numMoves, movingTile);
	},

	pathFound(boardPointStart, boardPointEnd, numMoves, movingTile) {
		// Minifier-safe implementation: uses unique const variables and nested if statements
		// to avoid issues with short-circuit && evaluation and variable reassignment
		if (!boardPointStart || !boardPointEnd) {
			return false;
		}

		if (boardPointStart.isType(NON_PLAYABLE) || boardPointEnd.isType(NON_PLAYABLE)) {
			return false;
		}

		const startRow = boardPointStart.row;
		const startCol = boardPointStart.col;
		const endRow = boardPointEnd.row;
		const endCol = boardPointEnd.col;

		if (startRow === endRow && startCol === endCol) {
			return true;
		}

		if (numMoves <= 0) {
			return false;
		}

		// If this point is surrounded by a Chrysanthemum and moving tile is Sky Bison, cannot keep moving.
		if (movingTile.code === 'S' && this.pointIsNextToOpponentTile(boardPointStart, movingTile.ownerCode, 'C')) {
			return false;
		}

		const minMoves = Math.abs(startRow - endRow) + Math.abs(startCol - endCol);

		if (minMoves === 1) {
			return true;
		}

		// Use unique const variables for each direction to avoid minifier issues
		const upRow = startRow - 1;
		const downRow = startRow + 1;
		const leftCol = startCol - 1;
		const rightCol = startCol + 1;
		const movesLeft = numMoves - 1;

		// Check moving UP - use nested if instead of && to avoid minifier breaking recursive calls
		if (upRow >= 0) {
			const upPoint = this.cells[upRow][startCol];
			if (!upPoint.hasTile()) {
				if (this.pathFound(upPoint, boardPointEnd, movesLeft, movingTile)) {
					return true;
				}
			}
		}

		// Check moving DOWN
		if (downRow < 17) {
			const downPoint = this.cells[downRow][startCol];
			if (!downPoint.hasTile()) {
				if (this.pathFound(downPoint, boardPointEnd, movesLeft, movingTile)) {
					return true;
				}
			}
		}

		// Check moving LEFT
		if (leftCol >= 0) {
			const leftPoint = this.cells[startRow][leftCol];
			if (!leftPoint.hasTile()) {
				if (this.pathFound(leftPoint, boardPointEnd, movesLeft, movingTile)) {
					return true;
				}
			}
		}

		// Check moving RIGHT
		if (rightCol < 17) {
			const rightPoint = this.cells[startRow][rightCol];
			if (!rightPoint.hasTile()) {
				if (this.pathFound(rightPoint, boardPointEnd, movesLeft, movingTile)) {
					return true;
				}
			}
		}

		return false;
	},

	pointIsNextToOpponentTile(bp, originalPlayerCode, tileCode) {
		var adjacentPoints = this.getAdjacentRowAndCols(bp);
		for (var i = 0; i < adjacentPoints.length; i++) {
			if (adjacentPoints[i].hasTile()
				&& adjacentPoints[i].tile.code === tileCode
				&& adjacentPoints[i].tile.ownerCode !== originalPlayerCode) {
				return true;
			}
		}
		return false;
	},

	setPossibleMovePoints(boardPointStart) {
		if (boardPointStart.hasTile()) {
			var playerName = boardPointStart.tile.ownerName;

			var tileInfo = this.tileMetadata[boardPointStart.tile.code];

			this.currentlyDeployingTile = boardPointStart.tile;
			this.currentlyDeployingTileInfo = tileInfo;

			if (tileInfo) {
				if (tileInfo.movements) {
					tileInfo.movements.forEach((movementInfo) => {
						movementInfo = this.getManipulatedMovementInfo(boardPointStart, movementInfo);
						this.setPossibleMovesForMovement(movementInfo, boardPointStart);
					});
				}
				const bonusMovementInfoList = this.getBonusMovementInfoList(boardPointStart);
				if (bonusMovementInfoList && bonusMovementInfoList.length > 0) {
					bonusMovementInfoList.forEach((bonusMovementInfo) => {
						this.setBonusMovementPossibleMoves(bonusMovementInfo, boardPointStart);
					});
				}
			}
		}
	},

	getBonusMovementInfoList(originPoint) {
		const tile = originPoint.tile;
		const tileInfo = this.tileMetadata[originPoint.tile.code];

		const bonusMovementInfoList = [];

		const grantBonusMovementAbilities = this.abilityManager.getAbilitiesTargetingTile(TrifleAbilityName.grantBonusMovement, tile);

		grantBonusMovementAbilities.forEach((ability) => {
			if (ability.abilityInfo.bonusMovement) {
				ability.abilityInfo.bonusMovement.movementFunction = this.determineMovementFunction(ability.abilityInfo.bonusMovement.type);
				bonusMovementInfoList.push(ability.abilityInfo.bonusMovement);
			}
		});

		return bonusMovementInfoList;
	},

	determineMovementFunction(movementType) {
		if (movementType === TrifleMovementType.standard) {
			return standardMovementFunction;
		}
	},

	setPossibleMovesForBonusMovement(movementInfo, originPoint, movementStartPoint, tile) {
		this.movementPointChecks = 0;
		var isImmobilized = this.tileMovementIsImmobilized(tile, movementInfo, originPoint);
		if (!isImmobilized) {
			if (movementInfo.type === TrifleMovementType.standard) {
				/* Standard movement, moving and turning as you go */
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], standardMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
			} else if (movementInfo.type === TrifleMovementType.diagonal) {
				/* Diagonal movement, jumping across the lines up/down/left/right as looking at the board */
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], diagonalMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
			} else if (movementInfo.type === TrifleMovementType.jumpAlongLineOfSight) {
				/* Jump to tiles along line of sight */
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], jumpAlongLineOfSightMovementFunction, tile, movementInfo, movementStartPoint, 1, 0);
			} else if (movementInfo.type === TrifleMovementType.withinFriendlyTileZone) {
				this.setMovePointsWithinTileZone(movementStartPoint, tile.ownerName, tile, movementInfo);
			} else if (movementInfo.type === TrifleMovementType.anywhere) {
				this.setMovePointsAnywhere(movementStartPoint, movementInfo);
			} else if (movementInfo.type === TrifleMovementType.jumpShape) {
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], jumpShapeMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
			} else if (movementInfo.type === TrifleMovementType.travelShape) {
				this.setPossibleMovementPointsFromMovePointsOnePathAtATime(travelShapeMovementFunction, tile, movementInfo, movementStartPoint, movementStartPoint, movementInfo.shape.length, 0, [movementStartPoint]);
			} else if (movementInfo.type === TrifleMovementType.jumpSurroundingTiles) {
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], jumpSurroundingTilesMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
			}
		}
		// debug("Movement Point Checks: " + this.movementPointChecks);
	},

	getMovementExtendedDistance(boardPointStart, movementInfo) {
		var extendDistance = 0;
		var extendMovementAbilities = this.abilityManager.getAbilitiesTargetingTile(TrifleAbilityName.extendMovement, boardPointStart.tile);
		extendMovementAbilities.forEach(extendAbility => {
			if (extendAbility.abilityInfo.extendDistance && extendAbility.abilityInfo.extendMovementType === movementInfo.type) {
				extendDistance += extendAbility.abilityInfo.extendDistance;
			}
		});
		return extendDistance;
	},

	getMovementDistanceFactor(tile) {
		// Get all changeMovementDistanceByFactor abilities targeting this tile
		const factorAbilities = this.abilityManager.getAbilitiesTargetingTile(
			TrifleAbilityName.changeMovementDistanceByFactor,
			tile
		);

		// Multiply all factors together (default is 1.0)
		let factor = 1.0;
		factorAbilities.forEach(ability => {
			if (ability.abilityInfo.distanceAdjustmentFactor) {
				factor *= ability.abilityInfo.distanceAdjustmentFactor;
			}
		});
		return factor;
	},

	getOverriddenMovementDistance(tile) {
		// Get all setMovementDistance abilities targeting this tile
		const overrideAbilities = this.abilityManager.getAbilitiesTargetingTile(
			TrifleAbilityName.setMovementDistance,
			tile
		);

		// If any override exists, return the set distance (use the first one found)
		if (overrideAbilities.length > 0 && overrideAbilities[0].abilityInfo.movementDistance !== undefined) {
			return overrideAbilities[0].abilityInfo.movementDistance;
		}
		return null; // No override
	},

	getManipulatedMovementInfo(boardPointStart, movementInfo) {
		movementInfo = { ...movementInfo };	// Copy object
		var manipulateMovementAbilities = this.abilityManager.getAbilitiesTargetingTile(TrifleAbilityName.manipulateExistingMovement, boardPointStart.tile);
		manipulateMovementAbilities.forEach(manipulateAbility => {
			if (manipulateAbility.abilityInfo.newMovementType) {
				var newMovementType = manipulateAbility.abilityInfo.newMovementType;
				if (
					(newMovementType === TrifleMovementType.diagonal && movementInfo.type === TrifleMovementType.standard)
					|| (newMovementType === TrifleMovementType.standard && movementInfo.type === TrifleMovementType.diagonal)
				) {
					movementInfo.type = TrifleMovementType.orthAndDiag;
				}
			}
			var newMovementAbilities = manipulateAbility.abilityInfo.newMovementAbilities;
			if (newMovementAbilities && newMovementAbilities.length) {
				// Does it target the movementInfo?
				if (!manipulateAbility.abilityInfo.manipulateMovementType
					|| (manipulateAbility.abilityInfo.manipulateMovementType
						&& manipulateAbility.abilityInfo.manipulateMovementType == movementInfo.type)) {
					movementInfo.abilities = movementInfo.abilities || [];
					newMovementAbilities.forEach(newMovementAbility => {
						if (!movementInfo.abilities) {
							movementInfo.abilities = [];
						}
						// If the ability is not already in the list, add it
						if (!movementInfo.abilities.includes(newMovementAbility)) {
							movementInfo.abilities.push(newMovementAbility);
						}
					});
				}
			}
		});
		return movementInfo;
	},

	setPossibleMovesForMovement(movementInfo, boardPointStart) {
		this.movementPointChecks = 0;

		// Check for movement distance override first
		var overriddenDistance = this.getOverriddenMovementDistance(boardPointStart.tile);
		var movementDistance;
		if (overriddenDistance !== null) {
			// Override takes precedence, ignores other movement effects
			movementDistance = overriddenDistance;
		} else {
			// Normal calculation with extensions and factors
			var baseDistance = movementInfo.distance + this.getMovementExtendedDistance(boardPointStart, movementInfo);
			var distanceFactor = this.getMovementDistanceFactor(boardPointStart.tile);
			movementDistance = Math.floor(baseDistance * distanceFactor);
		}

		var isImmobilized = this.tileMovementIsImmobilized(boardPointStart.tile, movementInfo, boardPointStart);
		if (!isImmobilized) {
			if (movementInfo.type === TrifleMovementType.standard) {
				/* Standard movement, moving and turning as you go */
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], standardMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.diagonal) {
				/* Diagonal movement, jumping across the lines up/down/left/right as looking at the board */
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], diagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.orthAndDiag) {
				/* Orthogonal and Diagonal movement (surrounding spaces) */
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], orthAndDiagMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.jumpAlongLineOfSight) {
				/* Jump to tiles along line of sight */
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], jumpAlongLineOfSightMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, 1, 0);
			} else if (movementInfo.type === TrifleMovementType.withinFriendlyTileZone) {
				this.setMovePointsWithinTileZone(boardPointStart, boardPointStart.tile.ownerName, boardPointStart.tile, movementInfo);
			} else if (movementInfo.type === TrifleMovementType.anywhere) {
				this.setMovePointsAnywhere(boardPointStart, movementInfo);
			} else if (movementInfo.type === TrifleMovementType.jumpShape) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], jumpShapeMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.travelShape) {
				this.setPossibleMovementPointsFromMovePointsOnePathAtATime(travelShapeMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, boardPointStart, movementInfo.shape.length, 0, [boardPointStart]);
			} else if (movementInfo.type === TrifleMovementType.jumpSurroundingTiles) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], jumpSurroundingTilesMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.awayFromTargetTile) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], awayFromTargetTileOrthogonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.awayFromTargetTileOrthogonal) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], awayFromTargetTileOrthogonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.awayFromTargetTileDiagonal) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], awayFromTargetTileDiagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.jumpTargetTile) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], jumpTargetTileMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.standardAndAlongGardenWall) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], standardAndAlongGardenWallMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			}
		}
		// debug("Movement Point Checks: " + this.movementPointChecks);
	},

	getMovementFunctionForType(movementType) {
		var functionMap = {};
		functionMap[TrifleMovementType.standard] = standardMovementFunction;
		functionMap[TrifleMovementType.diagonal] = diagonalMovementFunction;
		functionMap[TrifleMovementType.orthAndDiag] = orthAndDiagMovementFunction;
		functionMap[TrifleMovementType.jumpAlongLineOfSight] = jumpAlongLineOfSightMovementFunction;
		functionMap[TrifleMovementType.jumpShape] = jumpShapeMovementFunction;
		functionMap[TrifleMovementType.jumpSurroundingTiles] = jumpSurroundingTilesMovementFunction;
		functionMap[TrifleMovementType.awayFromTargetTile] = awayFromTargetTileOrthogonalMovementFunction;
		functionMap[TrifleMovementType.awayFromTargetTileOrthogonal] = awayFromTargetTileOrthogonalMovementFunction;
		functionMap[TrifleMovementType.awayFromTargetTileDiagonal] = awayFromTargetTileDiagonalMovementFunction;
		functionMap[TrifleMovementType.jumpTargetTile] = jumpTargetTileMovementFunction;
		functionMap[TrifleMovementType.standardAndAlongGardenWall] = standardAndAlongGardenWallMovementFunction;
		return functionMap[movementType] || null;
	},

	setPossibleMovementPointsFromMovePoints(movePoints, nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, distanceRemaining, moveStepNumber) {
		if (distanceRemaining === 0
			|| !movePoints
			|| movePoints.length <= 0) {
			return;	// Complete
		}

		const nextPointsConfirmed = [];
		movePoints.forEach((recentPoint) => {
			const nextPossiblePoints = nextPossibleMovementPointsFunction(this, originPoint, recentPoint, movementInfo, moveStepNumber);
			nextPossiblePoints.forEach((adjacentPoint) => {
				this.movementPointChecks++;
				if (!this.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
					adjacentPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);

					const canMoveThroughPoint = this.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);

					/* If cannot move through point, then the distance remaining is 0, none! */
					if (!canMoveThroughPoint) {
						adjacentPoint.setMoveDistanceRemaining(movementInfo, 0);
					}

					if (this.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
						const movementOk = this.setPointAsPossibleMovement(adjacentPoint, tile, originPoint, null, movementInfo);
						if (movementOk) {
							adjacentPoint.setPossibleForMovementType(movementInfo);
							// adjacentPoint.setPreviousPointForMovement(movementInfo, recentPoint);
							adjacentPoint.setPreviousPoint(recentPoint);
							if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
								nextPointsConfirmed.push(adjacentPoint);
							}
						}
					} else if (canMoveThroughPoint) {
						nextPointsConfirmed.push(adjacentPoint);
					}
				}
			});
		});

		this.setPossibleMovementPointsFromMovePoints(nextPointsConfirmed,
			nextPossibleMovementPointsFunction,
			tile,
			movementInfo,
			originPoint,
			distanceRemaining - 1,
			moveStepNumber + 1);
	},

	getPointsMarkedAsPossibleMove() {
		var possibleMovePoints = [];
		this.forEachBoardPoint(function(boardPoint) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				possibleMovePoints.push(boardPoint);
			}
		});
		return possibleMovePoints;
	},

	setPossibleMovementPointsFromMovePointsOnePathAtATime(nextPossibleMovementPointsFunction,
		tile,
		movementInfo,
		originPoint,
		recentPoint,
		distanceRemaining,
		moveStepNumber,
		currentMovementPath) {
		if (distanceRemaining === 0) {
			return;	// Complete
		}
		const nextPossiblePoints = nextPossibleMovementPointsFunction(this, originPoint, recentPoint, movementInfo, moveStepNumber, currentMovementPath);
		originPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);
		nextPossiblePoints.forEach((adjacentPoint) => {
			this.movementPointChecks++;
			if (!this.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
				const canMoveThroughPoint = this.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
				if (this.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
					const movementOk = this.setPointAsPossibleMovement(adjacentPoint, originPoint.tile, originPoint, currentMovementPath, movementInfo);
					if (movementOk) {
						adjacentPoint.setPossibleForMovementType(movementInfo);
						if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
							this.setPossibleMovementPointsFromMovePointsOnePathAtATime(
								nextPossibleMovementPointsFunction,
								tile,
								movementInfo,
								originPoint,
								adjacentPoint,
								distanceRemaining - 1,
								moveStepNumber + 1,
								currentMovementPath.concat([adjacentPoint])
							);
						}
					}
				} else if (canMoveThroughPoint) {
					this.setPossibleMovementPointsFromMovePointsOnePathAtATime(
						nextPossibleMovementPointsFunction,
						tile,
						movementInfo,
						originPoint,
						adjacentPoint,
						distanceRemaining - 1,
						moveStepNumber + 1,
						currentMovementPath.concat([adjacentPoint])
					);
				}
			}
		});
	},

	setBonusMovementPossibleMoves(bonusMovementInfo, originPoint) {
		/* if (bonusMovementInfo && bonusMovementInfo.type && bonusMovementInfo.distance && bonusMovementInfo.movementFunction) {
			var possibleMovePoints = this.getPointsMarkedAsPossibleMove();
			possibleMovePoints.push(originPoint);
			var self = this;
			possibleMovePoints.forEach(function(boardPoint) {
				self.setPossibleMovementPointsFromMovePoints([boardPoint], bonusMovementInfo.movementFunction, originPoint.tile, bonusMovementInfo, boardPoint, bonusMovementInfo.distance, 0);
			});
		} */

		if (bonusMovementInfo && bonusMovementInfo.type) {
			const possibleMovePoints = this.getPointsMarkedAsPossibleMove();
			possibleMovePoints.push(originPoint);
			possibleMovePoints.forEach((boardPoint) => {
				this.setPossibleMovesForBonusMovement(bonusMovementInfo, originPoint, boardPoint, originPoint.tile);
			});
		}
	},

	setMovePointsAnywhere(boardPointStart, movementInfo) {
		this.forEachBoardPoint((boardPoint) => {
			if (this.tileCanMoveOntoPoint(boardPointStart.tile, movementInfo, boardPoint, boardPointStart)) {
				this.setPointAsPossibleMovement(boardPoint, boardPointStart.tile, boardPointStart, null, movementInfo);
			}
		});
	},

	tileMovementIsImmobilized(tile, movementInfo, boardPointStart) {
		return !movementInfo.regardlessOfImmobilization
			&& (this.tileMovementIsImmobilizedByMovementRestriction(tile, movementInfo, boardPointStart)
				|| this.abilityManager.abilityTargetingTileExists(TrifleAbilityName.immobilizeTiles, tile));
	},

	tileMovementIsImmobilizedByTileZoneAbility(zoneAbility, tilePoint, tileBeingMoved, tileBeingMovedInfo, movementStartPoint) {
		var isImmobilized = false;
		if (
			zoneAbility.type === TrifleZoneAbility.immobilizesOpponentTiles
			&& tilePoint.tile.ownerName !== tileBeingMoved.ownerName
			&& this.pointTileZoneContainsPoint(tilePoint, movementStartPoint)
			&& this.abilityIsActive(tilePoint, tilePoint.tile, this.tileMetadata[tilePoint.tile.code], zoneAbility)
		) {
			if (zoneAbility.targetTileCodes) {
				if (zoneAbility.targetTileCodes.includes(tileBeingMoved.code)) {
					isImmobilized = true;
				}
			} else {
				isImmobilized = true;
			}
		}

		if (
			zoneAbility.type === TrifleZoneAbility.immobilizesTiles
			&& this.pointTileZoneContainsPoint(tilePoint, movementStartPoint)
			&& this.abilityIsActive(tilePoint, tilePoint.tile, this.tileMetadata[tilePoint.tile.code], zoneAbility)
		) {
			if (zoneAbility.targetTeams) {
				if (
					(zoneAbility.targetTeams.includes(TrifleTileTeam.enemy)
						&& tilePoint.tile.ownerName !== tileBeingMoved.ownerName)
					||
					(zoneAbility.targetTeams.includes(TrifleTileTeam.friendly)
						&& tilePoint.tile.ownerName === tileBeingMoved.ownerName)
				) {
					if (zoneAbility.targetTileCodes) {
						if (zoneAbility.targetTileCodes.includes(tileBeingMoved.code)) {
							isImmobilized = true;
						}
					} else if (zoneAbility.targetTileTypes) {
						if (arrayIncludesOneOf(tileBeingMovedInfo.types, zoneAbility.targetTileTypes)) {
							if (zoneAbility.targetTileIdentifiers) {
								if (tileBeingMovedInfo.identifiers
									&& arrayIncludesOneOf(tileBeingMovedInfo.identifiers, zoneAbility.targetTileIdentifiers)) {
									isImmobilized = true;
								}
							} else {
								isImmobilized = true;
							}
						}
					}
				}
			}
		}

		return isImmobilized;
	},

	tileMovementIsImmobilizedByMovementRestriction(tile, movementInfo, boardPointStart) {
		let isImmobilized = false;
		if (tile && movementInfo.restrictions) {
			movementInfo.restrictions.forEach((movementRestriction) => {
				if (movementRestriction.type === TrifleMovementRestriction.immobilizedByOpponentTileZones) {
					movementRestriction.affectingTiles.forEach((affectingTileCode) => {
						isImmobilized = this.pointIsInTargetTileZone(boardPointStart, affectingTileCode, getOpponentName(tile.ownerName));
					});
				}
			});
		}
		return isImmobilized;
	},

	canMoveHereMoreEfficientlyAlready(boardPoint, distanceRemaining, movementInfo) {
		return boardPoint.getMoveDistanceRemaining(movementInfo) >= distanceRemaining;
	},

	tileCanMoveOntoPoint(tile, movementInfo, targetPoint, fromPoint) {
		var tileInfo = this.tileMetadata[tile.code];
		var canCaptureTarget = this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
		return (this.tileCanOccupyPoint(tile, targetPoint) || canCaptureTarget)	// TODO work still needed...
			&& (!targetPoint.hasTile() || canCaptureTarget || (targetPoint.tile === tile && targetPoint.occupiedByAbility))
			&& (!this.useTrifleTempleRules || !targetPoint.isType(TEMPLE) || canCaptureTarget)
			&& !this.tileZonedOutOfSpace(tile, movementInfo, targetPoint, canCaptureTarget)
			&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint)
			&& !this.tilePreventedFromPointByMovementRestriction(tile, movementInfo, targetPoint, fromPoint);
	},

	tilePreventedFromPointByMovementRestriction(tile, movementInfo, targetPoint, fromPoint) {
		var isRestricted = false;
		if (movementInfo.restrictions) {
			movementInfo.restrictions.every(restrictionInfo => {
				if (restrictionInfo.type === TrifleMovementRestriction.restrictMovementOntoRecordedTilePoint) {
					/* Currently supporting when has these required properties:
					 * - targetTileCode
					 * - targetTeams
					 */
					/* Is targetPoint recorded? */
					var recordedPointsOfType = this.recordedTilePoints[restrictionInfo.recordTilePointType];
					if (recordedPointsOfType) {
						var targetTileOwnerName = null;
						if (restrictionInfo.targetTeams.length === 1 && restrictionInfo.targetTeams.includes(TrifleTileTeam.enemy)) {
							targetTileOwnerName = getOpponentName(tile.ownerName);
						} else if (restrictionInfo.targetTeams.length === 1 && restrictionInfo.targetTeams.includes(TrifleTileTeam.friendly)) {
							targetTileOwnerName = tile.ownerName;
						}
						var tileKey = {
							ownerName: targetTileOwnerName,
							code: restrictionInfo.targetTileCode
						};

						Object.keys(recordedPointsOfType).forEach(function(key, index) {
							var keyObject = JSON.parse(key);
							if (keyObject.code === tileKey.code
								&& (targetTileOwnerName === null || keyObject.ownerName === targetTileOwnerName)) {
								if (recordedPointsOfType[key] === targetPoint) {
									isRestricted = true;
								}
							}
						});
					}
					return !isRestricted;	// Check next restriction if not restricted
				} else {
					debug("Movement restriction not handled here: " + restrictionInfo.type);
					return true;	// Continue to next restriction
				}
			});
		}
		return isRestricted;
	},

	targetPointIsEmptyOrCanBeCaptured(tile, movementInfo, fromPoint, targetPoint) {
		return !targetPoint.hasTile()
			|| this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
	},

	targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint) {
		return targetPoint.hasTile()
			&& this.tileCanCapture(tile, movementInfo, fromPoint, targetPoint)
			&& !this.tileHasActiveCaptureProtectionFromCapturingTile(targetPoint.tile, tile)
			&& this.capturePassesConstraintChecks(tile, fromPoint, targetPoint);
	},

	tileCanCapture(tile, movementInfo, fromPoint, targetPoint) {
		var captureProhibited = this.abilityManager.abilityTargetingTileExists(TrifleAbilityName.prohibitTileFromCapturing, tile);

		var targetTile = targetPoint.tile;
		var targetTileInfo = this.tileMetadata[targetTile.code];

		let capturePossibleWithMovement = movementInfo
			&& movementInfo.captureTypes
			&& movementInfo.captureTypes.includes(TrifleCaptureType.all);

		if (movementInfo && movementInfo.captureTypes && movementInfo.captureTypes.length) {
			movementInfo.captureTypes.forEach((captureTypeInfo) => {
				if (captureTypeInfo.type && captureTypeInfo.type === TrifleCaptureType.all) {
					capturePossibleWithMovement = true;
				} else if (captureTypeInfo.type && captureTypeInfo.type === TrifleCaptureType.tilesTargetedByAbility) {
					captureTypeInfo.targetAbilities.forEach((targetAbilityName) => {
						capturePossibleWithMovement = this.abilityManager.abilityTargetingTileExists(targetAbilityName, targetPoint.tile);
					});
				} else if (captureTypeInfo.type && captureTypeInfo.type === TrifleCaptureType.allExcludingCertainTiles) {
					if (!captureTypeInfo.excludedTileCodes.includes(targetPoint.tile.code)) {
						capturePossibleWithMovement = true;
					}
				} else if (captureTypeInfo.type && captureTypeInfo.type === TrifleCaptureType.onlyCertainTiles) {
					if (captureTypeInfo.includedTileCodes.includes(targetPoint.tile.code)) {
						capturePossibleWithMovement = true;
					}
				} else if (captureTypeInfo.type && captureTypeInfo.type === TrifleCaptureType.onlyCertainTileTypes) {
					if (targetTileInfo && targetTileInfo.types && arrayIncludesOneOf(captureTypeInfo.includedTileTypes, targetTileInfo.types)) {
						capturePossibleWithMovement = true;
					}
				}

				if (!this.activationRequirementsAreMet(captureTypeInfo, tile)) {
					captureProhibited = true;
				}
			});
		}

		return !captureProhibited
			&& targetTileInfo
			&& capturePossibleWithMovement
			&& this.tilesBelongToDifferentOwnersOrTargetTileHasFriendlyCapture(tile, targetTile, targetTileInfo) // TODO
			&& !targetPoint.tile.protected;
	},

	tilesBelongToDifferentOwnersOrTargetTileHasFriendlyCapture(tile, targetTile, targetTileInfo) {
		return tile.ownerName !== targetTile.ownerName
			|| TrifleTileInfo.tileCanBeCapturedByFriendlyTiles(targetTileInfo);
	},

	tileCanMoveThroughPoint(tile, movementInfo, targetPoint, fromPoint) {
		var tileInfo = this.tileMetadata[tile.code];
		return tileInfo
			&& (
				(!targetPoint.hasTile() || (targetPoint.tile === tile && targetPoint.occupiedByAbility))
				|| this.movementInfoHasAbility(movementInfo, TrifleMovementAbility.jumpOver)
				|| (this.movementInfoHasAbility(movementInfo, TrifleMovementAbility.chargeCapture) && this.tileCanMoveOntoPoint(tile, movementInfo, targetPoint, fromPoint))
			)
			&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint);
	},

	removePossibleMovePoints() {
		this.forEachBoardPoint(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
			boardPoint.clearPossibleMovementTypes();
			boardPoint.clearPossibleMovementPaths();
		});
	},
};
