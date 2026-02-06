// A more reusable and global Pai Sho Board

import {
	GATE,
	NON_PLAYABLE,
	POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	HOST,
	NotationPoint,
	RowAndColumn,
} from '../CommonNotationObjects';
import { TEMPLE, TrifleBoardPoint } from './TrifleBoardPoint';
import { TrifleAbility } from './TrifleAbility';
import {
	TrifleAbilityCategory,
	TrifleAbilityName,
	TrifleActivationRequirement,
	TrifleAttributeType,
	TrifleCaptureType,
	TrifleDeployType,
	TrifleMoveDirection,
	TrifleMovementAbility,
	TrifleMovementDirection,
	TrifleMovementRestriction,
	TrifleMovementType,
	TrifleSpecialDeployType,
	TrifleTileCategory,
	TrifleTileInfo,
	TrifleTileTeam,
	TrifleZoneAbility
} from './TrifleTileInfo';
import { TrifleAbilityManager } from './TrifleAbilityManager';
import { TrifleBrainFactory } from './brains/BrainFactory';
import { TrifleTriggerHelper } from './brains/TriggerHelper';
import { arrayIncludesOneOf, debug } from '../GameData';
import { currentTileMetadata } from './PaiShoGamesTileMetadata';
import { getOpponentName } from '../pai-sho-common/PaiShoPlayerHelp';
import { paiShoBoardMaxRowOrCol } from '../pai-sho-common/PaiShoBoardHelp';

export class PaiShoGameBoard {
	constructor(tileManager, customAbilityActivationOrder) {
		this.size = new RowAndColumn(17, 17);
		this.cells = this.brandNew();

		// TODO Eventually remove Trifle-specific?:
		this.hostBannerPlayed = false;
		this.guestBannerPlayed = false;

		this.tileMetadata = currentTileMetadata;

		this.activeDurationAbilities = [];
		this.recordedTilePoints = {};
		this.capturedTilesForResurrection = []; // Track tiles that may be resurrected

		this.tileManager = tileManager;

		this.abilityManager = new TrifleAbilityManager(this, customAbilityActivationOrder);

		this.brainFactory = new TrifleBrainFactory();
	}

	brandNew() {
		var cells = [];

		cells[0] = this.newRow(9,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.gate(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[1] = this.newRow(11,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.redWhiteNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[2] = this.newRow(13,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[3] = this.newRow(15,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[4] = this.newRow(17,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[5] = this.newRow(17,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[6] = this.newRow(17,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[7] = this.newRow(17,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[8] = this.newRow(17,
			[TrifleBoardPoint.gate(),
			TrifleBoardPoint.redWhiteNeutral(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.redWhiteNeutral(),
			TrifleBoardPoint.gate()
			]);

		cells[9] = this.newRow(17,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[10] = this.newRow(17,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[11] = this.newRow(17,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[12] = this.newRow(17,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[13] = this.newRow(15,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.red(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.white(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[14] = this.newRow(13,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.redNeutral(),
			TrifleBoardPoint.redWhite(),
			TrifleBoardPoint.whiteNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[15] = this.newRow(11,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.redWhiteNeutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		cells[16] = this.newRow(9,
			[TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.gate(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral(),
			TrifleBoardPoint.neutral()
			]);

		for (var row = 0; row < cells.length; row++) {
			for (var col = 0; col < cells[row].length; col++) {
				cells[row][col].setRowAndCol(row, col);
			}
		}

		return cells;
	}

	newRow(numColumns, points) {
		var cells = [];

		var numBlanksOnSides = (this.size.row - numColumns) / 2;

		var nonPoint = new TrifleBoardPoint();
		nonPoint.addType(NON_PLAYABLE);

		for (var i = 0; i < this.size.row; i++) {
			if (i < numBlanksOnSides) {
				cells[i] = nonPoint;
			} else if (i < numBlanksOnSides + numColumns) {
				if (points) {
					cells[i] = points[i - numBlanksOnSides];
				} else {
					cells[i] = nonPoint;
				}
			} else {
				cells[i] = nonPoint;
			}
		}

		return cells;
	}

	placeTile(tile, notationPoint) {
		this.tilesCapturedByTriggeredAbility = [];
		this.putTileOnPoint(tile, notationPoint);

		// TODO Eventually remove Trifle-specific?:
		if (TrifleTileInfo.tileIsBanner(this.tileMetadata[tile.code])) {
			if (tile.ownerName === HOST) {
				this.hostBannerPlayed = true;
			} else {
				this.guestBannerPlayed = true;
			}
		}

		// Things to do after a tile is placed

		/* Process abilities after placing tile */
		var tileInfo = this.tileMetadata[tile.code];

		var boardPoint = this.getPointFromNotationPoint(notationPoint);

		var capturedTiles = [];

		this.processAbilities(tile, tileInfo, null, boardPoint, capturedTiles, [], {});

		// Check for tile resurrections after abilities are processed
		var resurrectedTiles = this.checkAndPerformResurrections();

		return {
			capturedTiles: capturedTiles,
			resurrectedTiles: resurrectedTiles
		}
	}

	getDistanceBetweenPoints(bp1, bp2) {
		return Math.abs(bp1.row - bp2.row) + Math.abs(bp1.col - bp2.col)
	}

	putTileOnPoint(tile, notationPoint) {
		var point = this.getPointFromNotationPoint(notationPoint);

		point.putTile(tile);
		tile.seatedPoint = point;

		// Store deploy position for tiles with resurrection ability
		if (!tile.deployPoint) {
			const tileInfo = this.tileMetadata[tile.code];
			if (tileInfo && tileInfo.abilities) {
				const hasResurrectionAbility = tileInfo.abilities.some(
					ability => ability.type === TrifleAbilityName.resurrectAtDeployPosition
				);
				if (hasResurrectionAbility) {
					tile.deployPoint = point;
				}
			}
		}

		/* // Check if gigantic...
		const tileInfo = this.tileMetadata[tile.code];
		if (tileInfo.attributes && tileInfo.attributes.length) {
			tileInfo.attributes.forEach((attributeInfo) => {
				if (attributeInfo.type === TrifleAttributeType.gigantic) {
					this.setGiganticPointsOccupied(tile, point);
				}
			});
		} */
	}

	getGrowGiantOccupiedPoints(boardPointToGrowGigantic) {
		/* Gigantic points to occupy - to grow to 2x2 size */
		var row = boardPointToGrowGigantic.row;
		var col = boardPointToGrowGigantic.col;

		if (row < 16 && col < 16) {
			var occupyPoints = [];

			occupyPoints.push(this.cells[row + 1][col]);
			occupyPoints.push(this.cells[row + 1][col + 1]);
			occupyPoints.push(this.cells[row][col + 1]);

			var pointsAreAllPlayable = true;
			occupyPoints.forEach(function(point) {
				if (point.isType(NON_PLAYABLE)) {
					pointsAreAllPlayable = false;
				}
			});

			if (pointsAreAllPlayable) {
				return occupyPoints;
			}
		}
		return false;
	}

	getPointFromNotationPoint(notationPoint) {
		if (notationPoint.isType) {	// Check if it's a BoardPoint object already
			return notationPoint;	// It's actually what we want already
		}
		const rowAndCol = notationPoint.rowAndColumn;
		return this.cells[rowAndCol.row][rowAndCol.col];
	}

	getSurroundingRowAndCols(rowAndCol) {
		var rowAndCols = [];
		for (var row = rowAndCol.row - 1; row <= rowAndCol.row + 1; row++) {
			for (var col = rowAndCol.col - 1; col <= rowAndCol.col + 1; col++) {
				if ((row !== rowAndCol.row || col !== rowAndCol.col)	// Not the center given point
					&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) {	// Not outside range of the grid
					var boardPoint = this.cells[row][col];
					if (!boardPoint.isType(NON_PLAYABLE)) {	// Not non-playable
						rowAndCols.push(new RowAndColumn(row, col));
					}
				}
			}
		}
		return rowAndCols;
	}

	getSurroundingBoardPoints(initialBoardPoint) {
		var surroundingPoints = [];
		for (var row = initialBoardPoint.row - 1; row <= initialBoardPoint.row + 1; row++) {
			for (var col = initialBoardPoint.col - 1; col <= initialBoardPoint.col + 1; col++) {
				if ((row !== initialBoardPoint.row || col !== initialBoardPoint.col)	// Not the center given point
					&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) {	// Not outside range of the grid
					var boardPoint = this.cells[row][col];
					if (!boardPoint.isType(NON_PLAYABLE)) {	// Not non-playable
						surroundingPoints.push(boardPoint);
					}
				}
			}
		}
		return surroundingPoints;
	}

	getDiagonalBoardPoints(initialBoardPoint) {
		var diagonalPoints = [];
		for (var row = initialBoardPoint.row - 1; row <= initialBoardPoint.row + 1; row++) {
			for (var col = initialBoardPoint.col - 1; col <= initialBoardPoint.col + 1; col++) {
				if ((row !== initialBoardPoint.row || col !== initialBoardPoint.col)	// Not the center given point
					&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) {	// Not outside range of the grid
					var boardPoint = this.cells[row][col];
					if (!boardPoint.isType(NON_PLAYABLE)
						&& boardPoint.row !== initialBoardPoint.row
						&& boardPoint.col !== initialBoardPoint.col) {
						diagonalPoints.push(boardPoint);
					}
				}
			}
		}
		return diagonalPoints;
	}

	getAdjacentRowAndCols(rowAndCol) {
		var rowAndCols = [];

		if (rowAndCol.row > 0) {
			var adjacentPoint = this.cells[rowAndCol.row - 1][rowAndCol.col];
			if (!adjacentPoint.isType(NON_PLAYABLE)) {
				rowAndCols.push(adjacentPoint);
			}
		}
		if (rowAndCol.row < paiShoBoardMaxRowOrCol) {
			var adjacentPoint = this.cells[rowAndCol.row + 1][rowAndCol.col];
			if (!adjacentPoint.isType(NON_PLAYABLE)) {
				rowAndCols.push(adjacentPoint);
			}
		}
		if (rowAndCol.col > 0) {
			var adjacentPoint = this.cells[rowAndCol.row][rowAndCol.col - 1];
			if (!adjacentPoint.isType(NON_PLAYABLE)) {
				rowAndCols.push(adjacentPoint);
			}
		}
		if (rowAndCol.col < paiShoBoardMaxRowOrCol) {
			var adjacentPoint = this.cells[rowAndCol.row][rowAndCol.col + 1];
			if (!adjacentPoint.isType(NON_PLAYABLE)) {
				rowAndCols.push(adjacentPoint);
			}
		}

		return rowAndCols;
	}

	getAdjacentPoints(boardPointStart) {
		return this.getAdjacentRowAndCols(boardPointStart);
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

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
	}

	pointIsOpenGate(notationPoint) {
		var point = notationPoint.rowAndColumn;
		point = this.cells[point.row][point.col];

		return point.isOpenGate();
	}

	debugPointsOccupiedByAbility() {
		this.forEachBoardPoint(function(bp) {
			if (bp.occupiedByAbility) {
				debug(bp);
			}
			if (bp.otherPointsOccupied) {
				debug("Occupies other points:");
				debug(bp);
			}
		});
	}

	moveTile(player, notationPointStart, notationPointEnd, currentMoveInfo) {
		this.tilesCapturedByTriggeredAbility = [];

		if (!notationPointStart.rowAndColumn) {	// Assume String representation of points if no rowAndColumn property
			notationPointStart = new NotationPoint(notationPointStart);
		}
		if (!notationPointEnd.rowAndColumn) {
			notationPointEnd = new NotationPoint(notationPointEnd);
		}

		var startRowCol = notationPointStart.rowAndColumn;
		var endRowCol = notationPointEnd.rowAndColumn;

		if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
			return false;
		}

		var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
		var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

		/* Does tile occupy other spaces? If so, remove the tile from those points */
		if (boardPointStart.otherPointsOccupied && boardPointStart.otherPointsOccupied.length) {
			boardPointStart.otherPointsOccupied.forEach(function(occupiedPoint) {
				occupiedPoint.occupiedByAbility = false;
				occupiedPoint.pointOccupiedBy = null;
				occupiedPoint.removeTile();
			});
		}

		var capturedTiles = [];
		var capturedTilePoints = [];

		/* If movement path is needed, get that */
		var movementPath = null;
		var tileInfo = this.tileMetadata[boardPointStart.tile.code];
		/* If tile has only one movement and has charge capture, if there is only one
		|* movement path, then we have all we need to perform the ability. */
		if (TrifleTileInfo.tileHasOnlyOneMovement(tileInfo)
			&& TrifleTileInfo.tileHasMovementAbility(tileInfo, TrifleMovementAbility.chargeCapture)) {
			this.setPossibleMovePoints(boardPointStart);
			movementPath = boardPointEnd.getOnlyPossibleMovementPath();
			this.removePossibleMovePoints();

			movementPath.forEach((movePathPoint) => {
				if (movePathPoint.hasTile() && movePathPoint !== boardPointStart) {
					capturedTilePoints.push(movePathPoint);
					capturedTiles.push(this.captureTileOnPoint(movePathPoint));
				}
			});
		}

		var tile = boardPointStart.removeTile();

		if (!tile) {
			debug("Error: No tile to move!");
		}

		/* // If tile is capturing a Banner tile, there's a winner
		// This now happens in `captureTileOnPoint` function
		if (boardPointEnd.hasTile()
				&& TrifleTileInfo.tileIsBanner(this.tileMetadata[boardPointEnd.tile.code])
				&& tile.ownerName !== boardPointEnd.tile.ownerName) {
			this.winners.push(tile.ownerName);
		} */

		if (boardPointEnd.hasTile() && !capturedTiles.includes(boardPointEnd.tile)) {
			capturedTilePoints.push(boardPointEnd);
			capturedTiles.push(this.captureTileOnPoint(boardPointEnd));
		}

		capturedTiles.forEach((capturedTile) => {
			capturedTile.beingCaptured = true;
		});

		boardPointEnd.putTile(tile);
		tile.seatedPoint = boardPointEnd;

		this.setPointFlags();

		/* Process abilities after moving a tile */

		/* Follow Order of Abilities and Triggers in Trifle documentation */

		var abilityActivationFlags = this.processAbilities(tile, tileInfo, boardPointStart, boardPointEnd, capturedTiles, capturedTilePoints, currentMoveInfo);

		// After abilities fire, some captured tiles may have been restored to the board
		// (e.g. by substituteForCapture). Remove them from the captured list.
		capturedTiles = capturedTiles.filter(function(capturedTile) {
			var restored = capturedTile.seatedPoint && capturedTile.seatedPoint.hasTile()
				&& capturedTile.seatedPoint.tile === capturedTile;
			if (restored) {
				capturedTile.beingCaptured = false;
			}
			return !restored;
		});

		// Add tiles captured by abilities (e.g. Saffron sacrificing itself)
		if (abilityActivationFlags.tileRecords && abilityActivationFlags.tileRecords.capturedTiles) {
			capturedTiles = capturedTiles.concat(abilityActivationFlags.tileRecords.capturedTiles);
		}

		// Check for tile resurrections after abilities are processed
		var resurrectedTiles = this.checkAndPerformResurrections();

		return {
			movedTile: tile,
			startPoint: boardPointStart,
			endPoint: boardPointEnd,
			capturedTiles: capturedTiles,
			resurrectedTiles: resurrectedTiles,
			abilityActivationFlags: abilityActivationFlags,
			animations: abilityActivationFlags.animations
		}
	}

	/**
	 * Evaluate and activate tile abilities after a tile is moved or placed/deployed.
	 *
	 * Called after moveTile() or placeTile() completes. By this point, all captures
	 * have already happened and captured tiles have been removed from the board.
	 *
	 * The function works in three phases:
	 *   Phase 1 - Board tile scan: Check every tile still on the board for triggered abilities.
	 *   Phase 2 - Captured tile scan: Check captured tiles for "when captured" abilities.
	 *   Phase 3 - Activation: Hand collected abilities to the AbilityManager, which activates
	 *             them in priority order (defined by abilityActivationOrder).
	 *
	 * After activation, if any ability changed the board state (e.g. substituteForCapture
	 * restoring a tile), this function re-runs (cascade) so other abilities can react to the
	 * new board state. The existingAbilityActivationFlags parameter carries forward which
	 * instant abilities have already fired, preventing duplicates across cascade re-runs.
	 *
	 * @param {Object} tileMovedOrPlaced - The tile that was just moved or placed
	 * @param {Object} tileMovedOrPlacedInfo - Metadata for that tile
	 * @param {Object} boardPointStart - Where the tile moved from (null for placements)
	 * @param {Object} boardPointEnd - Where the tile moved to or was placed
	 * @param {Array} capturedTiles - Tiles captured during this move
	 * @param {Array} capturedTilePoints - Where each capture occurred (parallel to capturedTiles)
	 * @param {Object} currentMoveInfo - Additional move context (passive movement flag, prompt data)
	 * @param {Object} existingAbilityActivationFlags - Flags from a previous cascade run, if any
	 */
	processAbilities(tileMovedOrPlaced, tileMovedOrPlacedInfo, boardPointStart, boardPointEnd, capturedTiles, capturedTilePoints, currentMoveInfo, existingAbilityActivationFlags) {
		if (!currentMoveInfo) {
			currentMoveInfo = {};
		}
		if (!existingAbilityActivationFlags) {
			existingAbilityActivationFlags = {};
		}

		/* Abilities are grouped by type (e.g. "protectFromCapture", "substituteForCapture")
		   so the AbilityManager can activate them in the correct priority order. */
		var abilitiesToActivate = {};
		var abilitiesWithPromptTargetsNeeded = [];

		/* Phase 1: Scan every tile on the board for triggered abilities.
		   For each tile, evaluate all of its ability triggers. If every trigger on an ability
		   is met, create an AbilityObject and add it to the activation map. */
		this.forEachBoardPointWithTile((pointWithTile) => {
			const tile = pointWithTile.tile;
			const tileInfo = this.tileMetadata[tile.code];
			if (tileInfo.abilities) {
				tileInfo.abilities.forEach((tileAbilityInfo) => {
					let allTriggerConditionsMet = true;

					const triggerBrainMap = {};

					const triggerContext = {
						board: this,
						pointWithTile: pointWithTile,
						tile: tile,
						tileInfo: tileInfo,
						tileAbilityInfo: tileAbilityInfo,
						lastTurnAction: {
							tileMovedOrPlaced: tileMovedOrPlaced,
							tileMovedOrPlacedInfo: tileMovedOrPlacedInfo,
							boardPointStart: boardPointStart,
							boardPointEnd: boardPointEnd,
							capturedTiles: capturedTiles,
							capturedTilePoints: capturedTilePoints
						},
						isPassiveMovement: currentMoveInfo.isPassiveMovement
					};

					/* Evaluate each trigger on this ability. An ability may have multiple triggers
					   (AND logic): ALL must be met for the ability to activate. Each trigger brain
					   also identifies target tiles that the ability will act upon. */
					const triggers = tileAbilityInfo.triggers;
					if (triggers && triggers.length) {
						triggers.forEach((triggerInfo) => {
							if (TrifleTriggerHelper.hasInfo(triggerInfo)) {
								triggerContext.currentTrigger = triggerInfo;
								const brain = this.brainFactory.createTriggerBrain(triggerInfo, triggerContext);
								if (brain && brain.isTriggerMet && this.activationRequirementsAreMet(triggerInfo, tile, triggerContext)) {
									if (allTriggerConditionsMet && brain.isTriggerMet()) {
										triggerBrainMap[triggerInfo.triggerType] = brain;
									} else {
										allTriggerConditionsMet = false;
									}
								} else {
									allTriggerConditionsMet = false;
								}
							}
						});
					}

					/* All triggers passed - create the ability object and queue it for activation.
					   Skip if this instant ability already fired in a previous cascade run. */
					if (allTriggerConditionsMet) {
						const abilityContext = {
							board: this,
							pointWithTile: pointWithTile,
							tile: tile,
							tileInfo: tileInfo,
							tileAbilityInfo: tileAbilityInfo,
							triggerBrainMap: triggerBrainMap,
							promptTargetInfo: currentMoveInfo.promptTargetData,
							isPassiveMovement: currentMoveInfo.isPassiveMovement,
							lastTurnAction: triggerContext.lastTurnAction
						}
						const abilityObject = new TrifleAbility(abilityContext);

						if (!abilityObject.hasNeededPromptTargetInfo()) {
							abilitiesWithPromptTargetsNeeded.push(abilityObject);
						}

						if (!this.abilityInActivatedList(abilityObject, existingAbilityActivationFlags.abilitiesActivated, TrifleAbilityCategory.instant)) {
							const thisKindOfAbilityList = abilitiesToActivate[tileAbilityInfo.type];

							if (thisKindOfAbilityList && thisKindOfAbilityList.length) {
								abilitiesToActivate[tileAbilityInfo.type].push(abilityObject);
							} else {
								abilitiesToActivate[tileAbilityInfo.type] = [abilityObject];
							}
						}
					}
				});
			}
		});

		var self = this;

		/* Phase 2: Scan captured tiles for abilities that trigger when the tile is captured.
		   These tiles are no longer on the board, so pointWithTile is null. Only abilities
		   with capture-triggered types (e.g. whenCapturedByTargetTile) are evaluated here. */
		capturedTiles.forEach(function(capturedTile) {
			var tile = capturedTile;
			var tileInfo = self.tileMetadata[tile.code];

			if (tileInfo.abilities) {
				tileInfo.abilities.forEach(function(tileAbilityInfo) {
					if (TrifleTileInfo.tileAbilityIsTriggeredWhenCaptured(tileAbilityInfo)) {
						var allTriggerConditionsMet = true;

						var triggerBrainMap = {};

						var triggerContext = {
							board: self,
							pointWithTile: null,
							tile: tile,
							tileInfo: tileInfo,
							tileAbilityInfo: tileAbilityInfo,
							lastTurnAction: {
								tileMovedOrPlaced: tileMovedOrPlaced,
								tileMovedOrPlacedInfo: tileMovedOrPlacedInfo,
								boardPointStart: boardPointStart,
								boardPointEnd: boardPointEnd,
								capturedTiles: capturedTiles,
								capturedTilePoints: capturedTilePoints
							},
							isPassiveMovement: currentMoveInfo.isPassiveMovement
						};

						var triggers = tileAbilityInfo.triggers;
						if (triggers && triggers.length) {
							triggers.forEach(function(triggerInfo) {
								if (TrifleTriggerHelper.hasInfo(triggerInfo)) {
									triggerContext.currentTrigger = triggerInfo;
									var brain = self.brainFactory.createTriggerBrain(triggerInfo, triggerContext);
									if (brain && brain.isTriggerMet && self.activationRequirementsAreMet(triggerInfo, tile, triggerContext)) {
										if (allTriggerConditionsMet && brain.isTriggerMet()) {
											triggerBrainMap[triggerInfo.triggerType] = brain;
										} else {
											allTriggerConditionsMet = false;
										}
									} else {
										allTriggerConditionsMet = false;
									}
								}
							});
						}

						if (allTriggerConditionsMet) {
							var abilityContext = {
								board: self,
								pointWithTile: null,
								tile: tile,
								tileInfo: tileInfo,
								tileAbilityInfo: tileAbilityInfo,
								triggerBrainMap: triggerBrainMap,
								promptTargetInfo: currentMoveInfo.promptTargetData,
								lastTurnAction: triggerContext.lastTurnAction
							}
							var abilityObject = new TrifleAbility(abilityContext);

							if (!abilityObject.hasNeededPromptTargetInfo()) {
								abilitiesWithPromptTargetsNeeded.push(abilityObject);
							}

							if (!self.abilityInActivatedList(abilityObject, existingAbilityActivationFlags.abilitiesActivated, TrifleAbilityCategory.instant)) {
								var thisKindOfAbilityList = abilitiesToActivate[tileAbilityInfo.type];

								if (thisKindOfAbilityList && thisKindOfAbilityList.length) {
									abilitiesToActivate[tileAbilityInfo.type].push(abilityObject);
								} else {
									abilitiesToActivate[tileAbilityInfo.type] = [abilityObject];
								}
							}
						}
					}
				});
			}
		});

		/* Phase 3: Hand the collected abilities to the AbilityManager for activation.
		   The manager activates them in priority order (abilityActivationOrder), ensuring
		   effects like protectFromCapture and substituteForCapture resolve before other
		   abilities react to captures. */
		this.abilityManager.setReadyAbilities(abilitiesToActivate);
		this.abilityManager.setAbilitiesWithPromptTargetsNeeded(abilitiesWithPromptTargetsNeeded);

		var abilityActivationFlags = this.abilityManager.activateReadyAbilitiesOrPromptForTargets();

		debug(this.abilityManager.abilities);

		/* Cascade: If any ability changed the board (e.g. substituteForCapture restored a
		   tile), re-run processAbilities so other abilities can react to the new board state.
		   The current activation flags are passed forward to prevent instant abilities from
		   firing twice. Captured tiles from the cascade are merged into the result. */
		if (abilityActivationFlags.boardHasChanged) {
			var nextAbilityActivationFlags = this.processAbilities(tileMovedOrPlaced, tileMovedOrPlacedInfo, boardPointStart, boardPointEnd, abilityActivationFlags.tileRecords.capturedTiles, [], currentMoveInfo, abilityActivationFlags);
			if (nextAbilityActivationFlags.tileRecords.capturedTiles && nextAbilityActivationFlags.tileRecords.capturedTiles.length) {
				if (!abilityActivationFlags.tileRecords.capturedTiles) {
					abilityActivationFlags.tileRecords.capturedTiles = [];
				}
				abilityActivationFlags.tileRecords.capturedTiles = abilityActivationFlags.tileRecords.capturedTiles.concat(nextAbilityActivationFlags.tileRecords.capturedTiles);
			}
			if (nextAbilityActivationFlags.neededPromptInfo) {
				abilityActivationFlags.neededPromptInfo = nextAbilityActivationFlags.neededPromptInfo;
			}
		}

		return abilityActivationFlags;
	}

	abilityInActivatedList(ability, abilitiesActivated, abilityCategory) {
		var abilityFound = false;

		if (abilitiesActivated) {
			abilitiesActivated.forEach(existingAbility => {
				if (ability.appearsToBeTheSameAs(existingAbility)
					&& (!abilityCategory || TrifleTileInfo.abilityIsCategory(existingAbility, abilityCategory))
				) {
					abilityFound = true;
					return abilityFound;
				}
			});
		}

		return abilityFound;
	}

	getZonesPointIsWithin(boardPoint) {
		const pointsOfZones = [];
		this.forEachBoardPointWithTile((checkPoint) => {
			if (checkPoint != boardPoint
				&& this.pointTileZoneContainsPoint(checkPoint, boardPoint)) {
				pointsOfZones.push(checkPoint);
			}
		});
		return pointsOfZones;
	}

	setPointFlags() {

	}

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
	}

	verifyAbleToReach(boardPointStart, boardPointEnd, numMoves, movingTile) {
		// Recursion!
		return this.pathFound(boardPointStart, boardPointEnd, numMoves, movingTile);
	}

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
	}

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
	}

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
	}

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
	}

	determineMovementFunction(movementType) {
		if (movementType === TrifleMovementType.standard) {
			return PaiShoGameBoard.standardMovementFunction;
		}
	}

	setPossibleMovesForBonusMovement(movementInfo, originPoint, movementStartPoint, tile) {
		this.movementPointChecks = 0;
		var isImmobilized = this.tileMovementIsImmobilized(tile, movementInfo, originPoint);
		if (!isImmobilized) {
			if (movementInfo.type === TrifleMovementType.standard) {
				/* Standard movement, moving and turning as you go */
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGameBoard.standardMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
			} else if (movementInfo.type === TrifleMovementType.diagonal) {
				/* Diagonal movement, jumping across the lines up/down/left/right as looking at the board */
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGameBoard.diagonalMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
			} else if (movementInfo.type === TrifleMovementType.jumpAlongLineOfSight) {
				/* Jump to tiles along line of sight */
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGameBoard.jumpAlongLineOfSightMovementFunction, tile, movementInfo, movementStartPoint, 1, 0);
			} else if (movementInfo.type === TrifleMovementType.withinFriendlyTileZone) {
				this.setMovePointsWithinTileZone(movementStartPoint, tile.ownerName, tile, movementInfo);
			} else if (movementInfo.type === TrifleMovementType.anywhere) {
				this.setMovePointsAnywhere(movementStartPoint, movementInfo);
			} else if (movementInfo.type === TrifleMovementType.jumpShape) {
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGameBoard.jumpShapeMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
			} else if (movementInfo.type === TrifleMovementType.travelShape) {
				this.setPossibleMovementPointsFromMovePointsOnePathAtATime(PaiShoGameBoard.travelShapeMovementFunction, tile, movementInfo, movementStartPoint, movementStartPoint, movementInfo.shape.length, 0, [movementStartPoint]);
			} else if (movementInfo.type === TrifleMovementType.jumpSurroundingTiles) {
				this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGameBoard.jumpSurroundingTilesMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
			}
		}
		// debug("Movement Point Checks: " + this.movementPointChecks);
	}

	getMovementExtendedDistance(boardPointStart, movementInfo) {
		var extendDistance = 0;
		var extendMovementAbilities = this.abilityManager.getAbilitiesTargetingTile(TrifleAbilityName.extendMovement, boardPointStart.tile);
		extendMovementAbilities.forEach(extendAbility => {
			if (extendAbility.abilityInfo.extendDistance && extendAbility.abilityInfo.extendMovementType === movementInfo.type) {
				extendDistance += extendAbility.abilityInfo.extendDistance;
			}
		});
		return extendDistance;
	}

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
	}

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
	}

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
				if (!manipulateAbility.abilityInfo.maniputlateMovementType
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
	}

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
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.standardMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.diagonal) {
				/* Diagonal movement, jumping across the lines up/down/left/right as looking at the board */
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.diagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.orthAndDiag) {
				/* Orthogonal and Diagonal movement (surrounding spaces) */
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.orthAndDiagMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.jumpAlongLineOfSight) {
				/* Jump to tiles along line of sight */
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.jumpAlongLineOfSightMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, 1, 0);
			} else if (movementInfo.type === TrifleMovementType.withinFriendlyTileZone) {
				this.setMovePointsWithinTileZone(boardPointStart, boardPointStart.tile.ownerName, boardPointStart.tile, movementInfo);
			} else if (movementInfo.type === TrifleMovementType.anywhere) {
				this.setMovePointsAnywhere(boardPointStart, movementInfo);
			} else if (movementInfo.type === TrifleMovementType.jumpShape) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.jumpShapeMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.travelShape) {
				this.setPossibleMovementPointsFromMovePointsOnePathAtATime(PaiShoGameBoard.travelShapeMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, boardPointStart, movementInfo.shape.length, 0, [boardPointStart]);
			} else if (movementInfo.type === TrifleMovementType.jumpSurroundingTiles) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.jumpSurroundingTilesMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.awayFromTargetTile) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.awayFromTargetTileOrthogonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.awayFromTargetTileOrthogonal) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.awayFromTargetTileOrthogonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.awayFromTargetTileDiagonal) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.awayFromTargetTileDiagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			} else if (movementInfo.type === TrifleMovementType.jumpTargetTile) {
				this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGameBoard.jumpTargetTileMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementDistance, 0);
			}
		}
		// debug("Movement Point Checks: " + this.movementPointChecks);
	}

	static standardMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
		return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
	}

	static diagonalMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
		return board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
	}

	static orthAndDiagMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
		return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo)
			.concat(board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo));
	}

	static jumpAlongLineOfSightMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		return board.getPointsNextToTilesInLineOfSight(movementInfo, originPoint);
	}

	static jumpShapeMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
		return board.getNextPointsForJumpShapeMovement(movementInfo, originPoint, boardPointAlongTheWay, mustPreserveDirection);
	}

	static travelShapeMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber, currentMovementPath) {
		const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
		return board.getNextPointsForTravelShapeMovement(movementInfo, moveStepNumber, originPoint, boardPointAlongTheWay, currentMovementPath, mustPreserveDirection);
	}

	static jumpSurroundingTilesMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, movementStepNumber) {
		const mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
		return board.getJumpSurroundingTilesPointsPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
	}

	static awayFromTargetTileMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		if (movementInfo.targetTilePoint) {
			return board.getAwayFromTilePossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
		} else {
			debug("Missing targetTilePoint");
		}
	}

	static awayFromTargetTileOrthogonalMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		if (movementInfo.targetTilePoint) {
			return board.getAwayFromTileOrthogonalPossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
		} else {
			debug("Missing targetTilePoint");
		}
	}

	static awayFromTargetTileDiagonalMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		if (movementInfo.targetTilePoint) {
			return board.getAwayFromTileDiagonalPossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
		} else {
			debug("Missing targetTilePoint");
		}
	}

	static jumpTargetTileMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		if (movementInfo.targetTilePoint) {
			return board.getJumpTargetTilePossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
		} else {
			debug("Missing targetTilePoint");
		}
	}

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
						const movementOk = this.setPointAsPossibleMovement(adjacentPoint, tile, originPoint);
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
	}

	getPointsMarkedAsPossibleMove() {
		var possibleMovePoints = [];
		this.forEachBoardPoint(function(boardPoint) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				possibleMovePoints.push(boardPoint);
			}
		});
		return possibleMovePoints;
	}

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
					const movementOk = this.setPointAsPossibleMovement(adjacentPoint, originPoint.tile, originPoint, currentMovementPath);
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
	}

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
	}

	setMovePointsAnywhere(boardPointStart, movementInfo) {
		this.forEachBoardPoint((boardPoint) => {
			if (this.tileCanMoveOntoPoint(boardPointStart.tile, movementInfo, boardPoint, boardPointStart)) {
				this.setPointAsPossibleMovement(boardPoint, boardPointStart.tile, boardPointStart);
			}
		});
	}

	tileMovementIsImmobilized(tile, movementInfo, boardPointStart) {
		return !movementInfo.regardlessOfImmobilization
			&& (this.tileMovementIsImmobilizedByMovementRestriction(tile, movementInfo, boardPointStart)
				|| this.abilityManager.abilityTargetingTileExists(TrifleAbilityName.immobilizeTiles, tile));
	}

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
	}

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
	}

	/**
	 * Check if given boardPoint is within the zone of target tile belonging to zoneOwner.
	 **/
	pointIsInTargetTileZone(boardPoint, targetTileCode, zoneOwner) {
		let insideTileZone = false;

		const targetTilePoints = this.getTilePoints(targetTileCode, zoneOwner);
		if (targetTilePoints.length > 0) {
			targetTilePoints.forEach((targetTilePoint) => {
				if (this.pointTileZoneContainsPoint(targetTilePoint, boardPoint)) {
					insideTileZone = true;
					return;
				}
			});
		}

		return insideTileZone;
	}

	getTilePoints(tileCode, ownerName) {
		var points = [];
		this.forEachBoardPoint(function(boardPoint) {
			if (boardPoint.hasTile()
				&& boardPoint.tile.code === tileCode
				&& boardPoint.tile.ownerName === ownerName) {
				points.push(boardPoint);
			}
		});
		return points;
	}

	getPointsForTileCodes(tileCodes, ownerNames) {
		var points = [];
		this.forEachBoardPoint(function(boardPoint) {
			if (boardPoint.hasTile()
				&& tileCodes.includes(boardPoint.tile.code)
				&& ownerNames.includes(boardPoint.tile.ownerName)) {
				points.push(boardPoint);
			}
		});
		return points;
	}

	canMoveHereMoreEfficientlyAlready(boardPoint, distanceRemaining, movementInfo) {
		return boardPoint.getMoveDistanceRemaining(movementInfo) >= distanceRemaining;
	}

	tileCanMoveOntoPoint(tile, movementInfo, targetPoint, fromPoint) {
		var tileInfo = this.tileMetadata[tile.code];
		var canCaptureTarget = this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
		return (this.tileCanOccupyPoint(tile, targetPoint) || canCaptureTarget)	// TODO work still needed...
			&& (!targetPoint.hasTile() || canCaptureTarget || (targetPoint.tile === tile && targetPoint.occupiedByAbility))
			&& (!this.useTrifleTempleRules || !targetPoint.isType(TEMPLE) || canCaptureTarget)
			&& !this.tileZonedOutOfSpace(tile, movementInfo, targetPoint, canCaptureTarget)
			&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint)
			&& !this.tilePreventedFromPointByMovementRestriction(tile, movementInfo, targetPoint, fromPoint);
	}

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
	}

	targetPointIsEmptyOrCanBeCaptured(tile, movementInfo, fromPoint, targetPoint) {
		return !targetPoint.hasTile()
			|| this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
	}

	targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint) {
		return targetPoint.hasTile()
			&& this.tileCanCapture(tile, movementInfo, fromPoint, targetPoint)
			&& !this.tileHasActiveCaptureProtectionFromCapturingTile(targetPoint.tile, tile)
			&& this.capturePassesConstraintChecks(tile, fromPoint, targetPoint);
	}

	tileHasActiveCaptureProtectionFromCapturingTile(tile, capturingTile) {
		return this.abilityManager.abilityTargetingTileExists(TrifleAbilityName.protectFromCapture, tile);

		/* var tileHasActiveCaptureProtection = false;
		this.activeDurationAbilities.forEach(function(durationAbilityEntry) {
			debug("Active Duration Ability: ");
			debug(durationAbilityEntry);
			if (durationAbilityEntry.targetTile === tile) {	// OR target TileTypeMatches tile
				debug("Yes, for this tile");
				var capturingTileInfo = this.tileMetadata[capturingTile.code];
				if (durationAbilityEntry.ability.type === TrifleAbilityName.protectFromCapture) {
					if ((durationAbilityEntry.ability.tileTypesProtectedFrom
						&& arrayIncludesOneOf(durationAbilityEntry.ability.tileTypesProtectedFrom, capturingTileInfo.types))
						||
						(durationAbilityEntry.ability.tileTypesProtectedFrom
							&& durationAbilityEntry.ability.tileTypesProtectedFrom.includes(TrifleTileCategory.allTileTypes))
						||
						(durationAbilityEntry.ability.tilesProtectedFrom
						&& durationAbilityEntry.ability.tilesProtectedFrom.includes(capturingTile.code))
					) {
						tileHasActiveCaptureProtection = true;
						return;
					}
				}
			}
		});
		return tileHasActiveCaptureProtection; */
	}

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
	}

	targetPointTileIsCapturableByTileAbility(targetPoint, capturingTile) {
		return !this.tileHasActiveCaptureProtectionFromCapturingTile(targetPoint.tile, capturingTile);
	}

	activationRequirementsAreMet(abilityInfo, tile, triggerContext) {
		let activationRequirementsAreMet = true;	// Assume true, change if ever false
		if (abilityInfo.activationRequirements && abilityInfo.activationRequirements.length) {
			abilityInfo.activationRequirements.forEach((activationRequirement) => {
				if (activationRequirement.type === TrifleActivationRequirement.tilesNotInTemple) {
					const ownerNames = [];
					if (activationRequirement.targetTeams.includes(TrifleTileTeam.friendly)) {
						ownerNames.push(tile.ownerName);
					}
					if (activationRequirement.targetTeams.includes(TrifleTileTeam.enemy)) {
						ownerNames.push(getOpponentName(tile.ownerName));
					}
					const requirementCheckPoints = this.getPointsForTileCodes(activationRequirement.targetTileCodes, ownerNames);

					requirementCheckPoints.forEach((checkPoint) => {
						if (checkPoint.isType(TEMPLE)) {
							activationRequirementsAreMet = false;
						}
					});
				} else if (activationRequirement.type === TrifleActivationRequirement.tileIsOnPointOfType) {
					let tileIsPointOfTypeRequirementMet = false;
					if (activationRequirement.targetTileTypes) {
						if (activationRequirement.targetTileTypes && activationRequirement.targetTileTypes.length) {
							if (activationRequirement.targetTileTypes.includes(TrifleTileCategory.thisTile)) {
								if (arrayIncludesOneOf(activationRequirement.targetPointTypes, triggerContext.pointWithTile.types)) {
									tileIsPointOfTypeRequirementMet = true;
								}
							}
						}
					}
					if (!tileIsPointOfTypeRequirementMet) {
						activationRequirementsAreMet = false;
					}
				}
			});
		} else {
			activationRequirementsAreMet = true;
		}
		return activationRequirementsAreMet;
	}

	tilesBelongToDifferentOwnersOrTargetTileHasFriendlyCapture(tile, targetTile, targetTileInfo) {
		return tile.ownerName !== targetTile.ownerName
			|| TrifleTileInfo.tileCanBeCapturedByFriendlyTiles(targetTileInfo);
	}

	tileCanMoveThroughPoint(tile, movementInfo, targetPoint, fromPoint) {
		var tileInfo = this.tileMetadata[tile.code];
		return tileInfo
			&& (
				(!targetPoint.hasTile() || (targetPoint.tile === tile && targetPoint.occupiedByAbility))
				|| this.movementInfoHasAbility(movementInfo, TrifleMovementAbility.jumpOver)
				|| (this.movementInfoHasAbility(movementInfo, TrifleMovementAbility.chargeCapture) && this.tileCanMoveOntoPoint(tile, movementInfo, targetPoint, fromPoint))
			)
			&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint);
	}

	movementInfoHasAbility(movementInfo, movementAbilityType) {
		var matchFound = false;
		if (movementInfo && movementInfo.abilities) {
			movementInfo.abilities.forEach(function(abilityInfo) {
				if (abilityInfo.type === movementAbilityType) {
					matchFound = true;
					return;
				}
			})
		}
		return matchFound;
	}

	tileZonedOutOfSpace(tile, movementInfo, targetPoint, canCaptureTarget) {
		var isZonedOut = this.tileZonedOutOfSpaceByMovementRestriction(tile, movementInfo, targetPoint);

		isZonedOut = isZonedOut || this.tileZonedOutOfSpaceByAbility(tile, targetPoint, canCaptureTarget);

		return isZonedOut;
	}

	tileZoneIsActive(tile) {
		return !this.abilityManager.abilityTargetingTileExists(TrifleAbilityName.cancelZone, tile);
	}

	tileZonedOutOfSpaceByAbility(tile, targetPoint, canCaptureTarget) {
		let isZonedOut = false;

		// For gigantic tiles, check all points that would be occupied
		let pointsToCheck = [targetPoint];
		const tileInfo = this.tileMetadata[tile.code];
		if (tileInfo && tileInfo.attributes && tileInfo.attributes.includes(TrifleAttributeType.gigantic)) {
			const giganticPoints = this.getGrowGiantOccupiedPoints(targetPoint);
			if (giganticPoints) {
				pointsToCheck = pointsToCheck.concat(giganticPoints);
			}
		}

		this.forEachBoardPointWithTile((checkBoardPoint) => {
			if (isZonedOut) return;

			const restrictMovementWithinZoneAbilities = this.abilityManager.getAbilitiesTargetingTileFromSourceTile(TrifleAbilityName.restrictMovementWithinZone, tile, checkBoardPoint.tile);

			if (restrictMovementWithinZoneAbilities.length) {
				for (let i = 0; i < pointsToCheck.length; i++) {
					if (this.pointTileZoneContainsPoint(checkBoardPoint, pointsToCheck[i])) {
						isZonedOut = true;
						return;
					}
				}
			}

			const restrictMovementWithinZoneUnlessCapturingAbilities = this.abilityManager.getAbilitiesTargetingTileFromSourceTile(TrifleAbilityName.restrictMovementWithinZoneUnlessCapturing, tile, checkBoardPoint.tile);

			if (!canCaptureTarget && restrictMovementWithinZoneUnlessCapturingAbilities.length) {
				for (let i = 0; i < pointsToCheck.length; i++) {
					if (this.pointTileZoneContainsPoint(checkBoardPoint, pointsToCheck[i])) {
						isZonedOut = true;
						return;
					}
				}
			}
		});

		return isZonedOut;
	}

	/* tileZonedOutOfSpaceByZoneAbility(tileCode, ownerName, targetPoint, originPoint) {
	var isZonedOut = false;

	var tileOwnerCode = getPlayerCodeFromName(ownerName);
	var tileInfo = this.tileMetadata[tileCode];

	var self = this;

	this.forEachBoardPointWithTile(function(checkBoardPoint) {
		var checkTileInfo = this.tileMetadata[checkBoardPoint.tile.code];

		// Check tile zones that can restrict movement to targetPoint 
		var zoneInfo = TrifleTileInfo.getTerritorialZone(checkTileInfo);
		if (zoneInfo && zoneInfo.abilities) {
			zoneInfo.abilities.forEach(function(zoneAbilityInfo) {
				var abilityIsActive = self.tileZoneIsActive(checkBoardPoint.tile);
						// && self.abilityIsActive(checkBoardPoint, checkBoardPoint.tile, checkTileInfo, zoneAbilityInfo);
				if (
					(
						zoneAbilityInfo.type === TrifleZoneAbility.restrictMovementWithinZone
					) && (	// Zone ability target team matches
						(zoneAbilityInfo.targetTeams.includes(TrifleTileTeam.friendly)
							&& tileOwnerCode === checkBoardPoint.tile.ownerCode)
						|| (zoneAbilityInfo.targetTeams.includes(TrifleTileTeam.enemy)
							&& tileOwnerCode !== checkBoardPoint.tile.ownerCode)
					) && (
						(	// Zone ability target tile types matches, if present
							zoneAbilityInfo.targetTileTypes 
							&& (
								arrayIncludesOneOf(zoneAbilityInfo.targetTileTypes, tileInfo.types)
								|| zoneAbilityInfo.targetTileTypes.includes(TrifleTileCategory.allTileTypes)
							)
						)
						|| (	// OR zone ability target tiles matches, if present
							zoneAbilityInfo.targetTileCodes 
							&& zoneAbilityInfo.targetTileCodes.includes(tileCode)
						)
					) && (
						self.pointTileZoneContainsPoint(checkBoardPoint, targetPoint)
					) && (
						abilityIsActive
					) && (	// If deploy (no originPoint) or tile origin was inside zone and movement is unable to escape zone, allow it to move farther away from center
						!originPoint
						|| (
							true
						)
					)
				) {
					isZonedOut = true;
					debug("Zoned out! For tile: " + tileCode + " by tile: " + checkBoardPoint.tile.code);
				}
			});
		}
	});

	return isZonedOut;
} */

	tileZonedOutOfSpaceByMovementRestriction(tile, movementInfo, targetPoint) {
		let isZonedOut = false;
		if (movementInfo.restrictions && movementInfo.restrictions.length > 0) {
			movementInfo.restrictions.forEach((movementRestriction) => {
				if (movementRestriction.type === TrifleMovementRestriction.restrictedByOpponentTileZones) {
					movementRestriction.affectingTiles.forEach((affectingTileCode) => {
						isZonedOut = this.pointIsInTargetTileZone(targetPoint, affectingTileCode, getOpponentName(tile.ownerName));
					});
				}
			});
		}
		return isZonedOut;
	}

	tileInfoHasMovementType(tileInfo, movementType) {
		var movementTypeFound = false;
		tileInfo.movements.forEach(function(movementInfo) {
			if (movementInfo.type === movementType) {
				movementTypeFound = true;
			}
		});
		return movementTypeFound;
	}

	removePossibleMovePoints() {
		this.forEachBoardPoint(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
			boardPoint.clearPossibleMovementTypes();
			boardPoint.clearPossibleMovementPaths();
		});
	}

	captureTileOnPoint(boardPoint) {
		var capturedTile = null;

		if (boardPoint.occupiedByAbility) {
			var occupyingPoint = boardPoint.pointOccupiedBy;
			occupyingPoint.otherPointsOccupied.forEach(function(occupiedPoint) {
				occupiedPoint.removeTile();
				occupiedPoint.occupiedByAbility = false;
				occupiedPoint.pointOccupiedBy = null;
			});
			capturedTile = occupyingPoint.removeTile();
		} else if (boardPoint.otherPointsOccupied) {
			boardPoint.otherPointsOccupied.forEach(function(occupiedPoint) {
				occupiedPoint.removeTile();
				occupiedPoint.occupiedByAbility = false;
				occupiedPoint.pointOccupiedBy = null;
			});
			capturedTile = boardPoint.removeTile();
		} else {
			capturedTile = boardPoint.removeTile();
		}

		// Track tiles with resurrection ability for later resurrection
		if (capturedTile && capturedTile.deployPoint) {
			this.capturedTilesForResurrection.push(capturedTile);
		}

		return capturedTile;
	}

	/**
	 * Check if any captured tiles with resurrection ability should be resurrected.
	 * Resurrection happens when the tile's deploy position is empty.
	 */
	checkAndPerformResurrections() {
		const resurrectedTiles = [];
		const remainingCaptured = [];

		this.capturedTilesForResurrection.forEach((capturedTile) => {
			if (capturedTile.deployPoint && !capturedTile.deployPoint.hasTile()) {
				// Deploy position is empty - resurrect the tile!
				capturedTile.deployPoint.putTile(capturedTile);
				capturedTile.seatedPoint = capturedTile.deployPoint;
				resurrectedTiles.push(capturedTile);
				debug("Resurrected " + capturedTile.code + " at its deploy position");
			} else {
				// Keep tracking for future resurrection
				remainingCaptured.push(capturedTile);
			}
		});

		this.capturedTilesForResurrection = remainingCaptured;
		return resurrectedTiles;
	}

	getFireLilyPoint(player) {
		for (var row = 0; row < this.cells.length; row++) {
			for (var col = 0; col < this.cells[row].length; col++) {
				var bp = this.cells[row][col];
				if (bp.hasTile()) {
					if (bp.tile.ownerName === player && bp.tile.code === 'F') {
						return bp;
					}
				}
			}
		}
	}

	getFireLilyPoints(player) {
		var points = [];
		for (var row = 0; row < this.cells.length; row++) {
			for (var col = 0; col < this.cells[row].length; col++) {
				var bp = this.cells[row][col];
				if (bp.hasTile()) {
					if (bp.tile.ownerName === player && bp.tile.code === 'F') {
						points.push(bp);
					}
				}
			}
		}
		return points;
	}

	setDeployPointsPossibleMoves(tile) {
		var tileInfo = this.tileMetadata[tile.code];
		if (!tileInfo) {
			debug("You need the tileInfo for " + tile.code);
		}

		this.currentlyDeployingTile = tile;
		this.currentlyDeployingTileInfo = tileInfo;

		// Check if tile has deploy order restrictions (e.g., must deploy before banners)
		if (!this.tileCanBeDeployed(tile)) {
			debug("Tile " + tile.code + " cannot be deployed due to deploy order restrictions");
			return; // No possible deploy points
		}

		if (tileInfo && tileInfo.specialDeployTypes) {
			tileInfo.specialDeployTypes.forEach((specialDeployInfo) => {
				this.setDeployPointsPossibleForSpecialDeploy(tile, tileInfo, specialDeployInfo);
			});
		}

		if (tileInfo && tileInfo.deployTypes) {
			if (tileInfo.deployTypes.includes(TrifleDeployType.anywhere)) {
				this.forEachBoardPoint((boardPoint) => {
					if (!boardPoint.hasTile()
						&& !boardPoint.isType(GATE)
						&& !this.tileZonedOutOfSpaceByAbility(tile, boardPoint)
						&& this.tileCanOccupyPoint(tile, boardPoint)
						&& this.deployPassesConstraintChecks(tile, tileInfo, boardPoint)) {
						boardPoint.addType(POSSIBLE_MOVE);
					}
				});
			}

			if (tileInfo.deployTypes.includes(TrifleDeployType.temple)) {
				this.forEachBoardPoint((boardPoint) => {
					if (!boardPoint.hasTile()
						&& boardPoint.isType(GATE)
						&& !this.tileZonedOutOfSpaceByAbility(tile, boardPoint)
						&& this.tileCanOccupyPoint(tile, boardPoint)
						&& this.deployPassesConstraintChecks(tile, tileInfo, boardPoint)) {
						boardPoint.addType(POSSIBLE_MOVE);
					}
				});
			}

			if (tileInfo.deployTypes.includes(TrifleDeployType.adjacentToTemple)) {
				this.forEachBoardPoint((templePoint) => {
					if (!templePoint.hasTile() && templePoint.isType(TEMPLE)) {
						const adjacentToTemplePoints = this.getAdjacentPoints(templePoint);
						adjacentToTemplePoints.forEach((pointAdjacentToTemple) => {
							if (!pointAdjacentToTemple.hasTile()
								&& !this.tileZonedOutOfSpaceByAbility(tile, pointAdjacentToTemple)
								&& this.tileCanOccupyPoint(tile, pointAdjacentToTemple)
								&& this.deployPassesConstraintChecks(tile, tileInfo, pointAdjacentToTemple)) {
								pointAdjacentToTemple.addType(POSSIBLE_MOVE);
							}
						});
					}
				});
			}
		}
	}

	tileCanOccupyPoint(tile, boardPoint) {
		var tileInfo = this.tileMetadata[tile.code];

		if (tileInfo.attributes && tileInfo.attributes.includes(TrifleAttributeType.gigantic)) {
			// Tile is gigantic - Allow if would not overlap with another tile
			var giganticPoints = this.getGrowGiantOccupiedPoints(boardPoint);
			var canOccupy = giganticPoints && giganticPoints.length ? true : false;
			if (giganticPoints) {
				giganticPoints.forEach(function(giganticPoint) {
					if (giganticPoint.hasTile() && giganticPoint.tile !== tile) {
						canOccupy = false;
					}
				});
			}
			return canOccupy;
		} else {
			return true;	// Default to true
		}
	}

	/**
	 * Check if tile can be deployed based on deploy order restrictions
	 * (e.g., WaterHyacinth must be deployed before any banner)
	 */
	tileCanBeDeployed(tile) {
		var tileInfo = this.tileMetadata[tile.code];

		// Check if tile has cannotDeployAfterTileTypes restriction
		if (tileInfo && tileInfo.cannotDeployAfterTileTypes && tileInfo.cannotDeployAfterTileTypes.length > 0) {
			// Check if any of those tile types are already on the board for this player
			let blockedByTileOnBoard = false;
			this.forEachBoardPointWithTile((boardPoint) => {
				if (boardPoint.tile.ownerName === tile.ownerName) {
					const boardTileInfo = this.tileMetadata[boardPoint.tile.code];
					if (boardTileInfo && boardTileInfo.types) {
						tileInfo.cannotDeployAfterTileTypes.forEach((restrictedType) => {
							if (boardTileInfo.types.includes(restrictedType)) {
								blockedByTileOnBoard = true;
							}
						});
					}
				}
			});
			if (blockedByTileOnBoard) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Check if deploying a tile at a given point passes all deploy constraint checks.
	 * Uses the Brain-based constraint system via the ability manager.
	 */
	deployPassesConstraintChecks(tile, tileInfo, deployPoint) {
		const deployConstraints = this.abilityManager.getDeployConstraints();

		// For gigantic tiles, check all points that would be occupied
		let pointsToCheck = [deployPoint];
		if (tileInfo.attributes && tileInfo.attributes.includes(TrifleAttributeType.gigantic)) {
			const giganticPoints = this.getGrowGiantOccupiedPoints(deployPoint);
			if (giganticPoints) {
				pointsToCheck = pointsToCheck.concat(giganticPoints);
			}
		}

		for (let i = 0; i < deployConstraints.length; i++) {
			for (let j = 0; j < pointsToCheck.length; j++) {
				const result = deployConstraints[i].isDeployAllowed(tile, tileInfo, pointsToCheck[j]);
				if (!result.allowed) {
					return false;
				}
			}
		}

		return true;
	}

	setDeployPointsPossibleForSpecialDeploy(tile, tileInfo, specialDeployInfo) {
		if (specialDeployInfo.type === TrifleSpecialDeployType.withinFriendlyTileZone) {
			this.setDeployPointsWithinTileZone(tile, tileInfo, specialDeployInfo);
		}
	}

	setDeployPointsWithinTileZone(tile, tileInfo, specialDeployInfo) {
		if (specialDeployInfo.targetTileCodes && specialDeployInfo.targetTileCodes.length > 0) {
			this.forEachBoardPoint((targetPoint) => {
				if (!targetPoint.hasTile() && !targetPoint.isType(TEMPLE)
					&& this.pointIsWithinZoneOfOneOfTheseTiles(targetPoint, specialDeployInfo.targetTileCodes, tile.ownerName)
					&& !this.tileZonedOutOfSpaceByAbility(tile, targetPoint)) {
					targetPoint.addType(POSSIBLE_MOVE);
				}
			});
		}
	}

	setMovePointsWithinTileZone(boardPointStart, zoneOwner, tileBeingMoved, movementInfo) {
		if (movementInfo.targetTileCodes && movementInfo.targetTileCodes.length > 0) {
			const pointsOfZoneTiles = this.getPointsForTileCodes(movementInfo.targetTileCodes, [zoneOwner]);
			this.forEachBoardPoint((targetPoint) => {
				const startAndEndPointAreInSameZone = this.oneOfTheseZonesContainsPoints(pointsOfZoneTiles, [boardPointStart, targetPoint]);
				if (startAndEndPointAreInSameZone
					&& this.tileCanMoveOntoPoint(tileBeingMoved, movementInfo, targetPoint, null)) {
					this.setPointAsPossibleMovement(targetPoint, tileBeingMoved, boardPointStart);
				}
			});
		}
	}

	setPointAsPossibleMovement(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
		// Enforce movement constraints from abilities (drawing-towards, etc)

		var movementOk = this.movementPassesConstraintChecks(targetPoint, tileBeingMoved, originPoint);

		if (movementOk) {
			targetPoint.addType(POSSIBLE_MOVE);
		}

		if (currentMovementPath) {
			targetPoint.addPossibleMovementPath(currentMovementPath);
		}

		return movementOk;
	}

	/**
	 * Check if movement passes all constraint checks from affecting abilities.
	 * Uses constraint brains from the AbilityManager.
	 * @param {Object} targetPoint - The point the tile is moving to
	 * @param {Object} tileBeingMoved - The tile being moved
	 * @param {Object} originPoint - The point the tile is moving from
	 * @returns {boolean} True if movement passes all constraints
	 */
	movementPassesConstraintChecks(targetPoint, tileBeingMoved, originPoint) {
		const constraints = this.abilityManager.getMovementConstraintsForTile(tileBeingMoved);

		// If multiple conflicting draw abilities affect this tile, no movement is allowed
		if (constraints.length > 1) {
			return false;
		}

		// Check each constraint
		for (let i = 0; i < constraints.length; i++) {
			const constraint = constraints[i];
			const result = constraint.isMovementAllowed(tileBeingMoved, originPoint, targetPoint);
			if (!result.allowed) {
				return false;
			}
		}

		return true;
	}

	/* movementAllowedByAffectingAbilities(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	var movementOk = true;

	// Check for abilities that hinder the movement and verify movement to targetPoint is allowed

	// LureTiles
	movementOk = movementOk && this.lureTilesCheck(targetPoint, tileBeingMoved, originPoint, currentMovementPath);

	return movementOk;
} */

	/* lureTilesCheck(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	// Is a LureTiles ability active on the board?
} */

	/**
	 * Check if capture passes all constraint checks from affecting abilities.
	 * Uses capture constraint brains from the AbilityManager.
	 * @param {Object} capturingTile - The tile attempting to capture
	 * @param {Object} fromPoint - The point the capturing tile is moving from
	 * @param {Object} targetPoint - The point with the tile to be captured
	 * @returns {boolean} True if capture passes all constraints
	 */
	/**
	 * Check if capture passes prohibition/restriction constraints on the capturing tile.
	 * Only checks CAPTURE_PROHIBITION category (e.g., restrictTileFromCapturing, prohibitTileFromCapturing).
	 * Does NOT check CAPTURE_PROTECTION on the target tile.
	 * @param {Object} capturingTile - The tile attempting to capture
	 * @param {Object} fromPoint - The point the capturing tile is moving from (can be null for ability captures)
	 * @param {Object} targetPoint - The point with the tile to be captured
	 * @returns {boolean} True if capture passes all prohibition constraints
	 */
	capturePassesCaptureProhibitionChecks(capturingTile, fromPoint, targetPoint) {
		const targetTile = targetPoint.tile;
		if (!targetTile) {
			return true;
		}

		const captureConstraints = this.abilityManager.getCaptureConstraintsForTile(capturingTile);
		for (let i = 0; i < captureConstraints.length; i++) {
			const constraint = captureConstraints[i];
			const result = constraint.isCaptureAllowed(capturingTile, targetTile, fromPoint, targetPoint);
			if (!result.allowed) {
				return false;
			}
		}

		return true;
	}

	capturePassesConstraintChecks(capturingTile, fromPoint, targetPoint) {
		const targetTile = targetPoint.tile;
		if (!targetTile) {
			return true; // No tile to capture
		}

		// Check if capturing tile has any prohibitions
		const captureConstraints = this.abilityManager.getCaptureConstraintsForTile(capturingTile);
		for (let i = 0; i < captureConstraints.length; i++) {
			const constraint = captureConstraints[i];
			const result = constraint.isCaptureAllowed(capturingTile, targetTile, fromPoint, targetPoint);
			if (!result.allowed) {
				return false;
			}
		}

		// Check if target tile has any protection
		const protectionConstraints = this.abilityManager.getCaptureProtectionForTile(targetTile);
		for (let i = 0; i < protectionConstraints.length; i++) {
			const constraint = protectionConstraints[i];
			const result = constraint.isCaptureAllowed(capturingTile, targetTile, fromPoint, targetPoint);
			if (!result.allowed) {
				return false;
			}
		}

		return true;
	}

	movementPassesLineOfSightTest(targetPoint, tileBeingMoved, originPoint) {
		const pointsToMoveTowards = [];
		let movementPassesLineOfSightTest = true;
		const lineOfSightPoints = this.getPointsForTilesInLineOfSight(originPoint);

		const drawAlongLineOfSightAbilities = this.abilityManager.getAbilitiesTargetingTile(TrifleAbilityName.drawTilesAlongLineOfSight, tileBeingMoved);
		if (drawAlongLineOfSightAbilities && drawAlongLineOfSightAbilities.length === 1) {
			lineOfSightPoints.forEach((lineOfSightPoint) => {
				const drawAbility = drawAlongLineOfSightAbilities[0];
				if (lineOfSightPoint.hasTile() && lineOfSightPoint.tile === drawAbility.sourceTile) {
					pointsToMoveTowards.push(lineOfSightPoint);
					/* Movement OK if:
						- Target Point is in line of sight of affecting tile
						- Tile will be closer to affecting tile than it was where it started
						- Tile be closer to where it started than the affecting tile was (did not move past the affecting tile) */
					movementPassesLineOfSightTest = this.targetPointIsInLineOfSightOfThesePoints(targetPoint, [lineOfSightPoint])
						&& this.targetPointIsCloserToThesePointsThanOriginPointIs(targetPoint, [lineOfSightPoint], originPoint)
						&& this.getDistanceBetweenPoints(originPoint, targetPoint) < this.getDistanceBetweenPoints(originPoint, lineOfSightPoint)
						|| targetPoint === drawAbility.sourceTilePoint;
					if (!movementPassesLineOfSightTest) {
						return false;
					}
				}
			});
		} else if (drawAlongLineOfSightAbilities && drawAlongLineOfSightAbilities.length > 1) {
			movementPassesLineOfSightTest = false;	// Being pulled in multiple directions, cannot satisfy both
		}

		return movementPassesLineOfSightTest;
	}

	targetPointIsInLineOfSightOfThesePoints(targetPoint, checkPoints) {
		var checkPointsInLineOfSight = 0;
		var lineOfSightPoints = this.getPointsForTilesInLineOfSight(targetPoint);
		lineOfSightPoints.forEach(function(targetLineOfSightPoint) {
			if (checkPoints.includes(targetLineOfSightPoint)) {
				checkPointsInLineOfSight++;
			}
		});
		return checkPointsInLineOfSight === checkPoints.length;
	}

	targetPointIsCloserToThesePointsThanOriginPointIs(targetPoint, checkPoints, originPoint) {
		let isCloserToAllCheckPoints = true;
		checkPoints.forEach((checkPoint) => {
			const targetPointDistance = this.getDistanceBetweenPoints(targetPoint, checkPoint);
			const originPointDistance = this.getDistanceBetweenPoints(originPoint, checkPoint);
			if (targetPointDistance >= originPointDistance) {
				isCloserToAllCheckPoints = false;
			}
		});
		return isCloserToAllCheckPoints;
	}

	oneOfTheseZonesContainsPoints(pointsWithZones, targetPoints) {
		let zoneContainingPointsFound = false;
		pointsWithZones.forEach((pointWithZone) => {
			let targetPointsAreInZone = true;
			targetPoints.forEach((targetPoint) => {
				targetPointsAreInZone = targetPointsAreInZone && this.pointTileZoneContainsPoint(pointWithZone, targetPoint);
			});
			if (targetPointsAreInZone) {
				zoneContainingPointsFound = true;
				return;
			}
		});
		return zoneContainingPointsFound;
	}

	getZonePoints(pointWithZone) {
		const zonePoints = [];
		this.forEachBoardPoint((boardPoint) => {
			if (this.pointTileZoneContainsPoint(pointWithZone, boardPoint)) {
				zonePoints.push(boardPoint);
			}
		});
		return zonePoints;
	}

	pointTileZoneContainsPoint(pointWithZone, targetPoint) {
		var tileInfo = this.tileMetadata[pointWithZone.tile.code];
		var tile = pointWithZone.tile;
		var zone = TrifleTileInfo.getTerritorialZone(tileInfo);

		if (!pointWithZone.hasTile() || !zone || !this.tileZoneIsActive(tile)) {
			return false;
		}

		// Calculate effective zone size including any enlargement bonuses
		const effectiveZoneSize = this.getEffectiveZoneSize(tile, zone.size);

		return this.getDistanceBetweenPoints(pointWithZone, targetPoint) <= effectiveZoneSize;
	}

	/**
	 * Calculate the effective zone size for a tile, including bonuses from enlargeZone abilities
	 * @param {Object} tile - The tile with the zone
	 * @param {number} baseZoneSize - The base zone size from tile definition
	 * @returns {number} - The effective zone size after applying enlargement bonuses
	 */
	getEffectiveZoneSize(tile, baseZoneSize) {
		let bonusZoneSize = 0;

		// Check for enlargeZone abilities targeting this tile
		const enlargeAbilities = this.abilityManager.getAbilitiesTargetingTile(
			TrifleAbilityName.enlargeZone,
			tile
		);

		enlargeAbilities.forEach((ability) => {
			if (ability.abilityInfo.bonusZoneSize) {
				bonusZoneSize += ability.abilityInfo.bonusZoneSize;
			}
		});

		return baseZoneSize + bonusZoneSize;
	}

	pointIsWithinZoneOfOneOfTheseTiles(targetPoint, tileCodes, zoneOwner) {
		let isInTheZone = false;
		if (tileCodes && tileCodes.length > 0) {
			tileCodes.forEach((tileCode) => {
				if (this.pointIsInTargetTileZone(targetPoint, tileCode, zoneOwner)) {
					isInTheZone = true;
					return;
				}
			});
		}
		return isInTheZone;
	}

	forEachBoardPoint(forEachFunc) {
		this.cells.forEach(function(row) {
			row.forEach(function(boardPoint) {
				if (!boardPoint.isType(NON_PLAYABLE)) {
					forEachFunc(boardPoint);
				}
			});
		});
	}

	forEachBoardPointDoMany(forEachFuncList) {
		this.cells.forEach(function(row) {
			row.forEach(function(boardPoint) {
				if (!boardPoint.isType(NON_PLAYABLE)) {
					forEachFuncList.forEach(function(forEachFunc) {
						forEachFunc(boardPoint);
					});
				}
			});
		});
	}

	forEachBoardPointWithTile(forEachFunc) {
		this.forEachBoardPoint(function(boardPoint) {
			if (boardPoint.hasTile()) {
				forEachFunc(boardPoint);
			}
		});
	}

	setGuestGateOpen() {
		var row = 16;
		var col = 8;
		if (this.cells[row][col].isOpenGate()) {
			this.cells[row][col].addType(POSSIBLE_MOVE);
		}
	}

	activateAbility(tileOwningAbility, targetTile, targetTileType, abilityInfo) {
		if (abilityInfo.duration && abilityInfo.duration > 0) {
			abilityInfo.active = true;
			abilityInfo.remainingDuration = abilityInfo.duration;
			this.activeDurationAbilities.push({
				grantingTile: tileOwningAbility,
				targetTile: targetTile,
				targetTileType: targetTileType,
				ability: abilityInfo
			});
		}
	}

	tickDurationAbilities() {
		this.abilityManager.tickDurationAbilities();

		/* old: */
		/* for (var i = this.activeDurationAbilities.length - 1; i >= 0; i--) {
			var durationAbilityDetails = this.activeDurationAbilities[i];
			var durationAbilityInfo = durationAbilityDetails.ability;
			durationAbilityInfo.remainingDuration -= 0.5;
			if (durationAbilityInfo.remainingDuration <= 0) {
				durationAbilityInfo.active = false;
				this.activeDurationAbilities.splice(i, 1);
			}
		} */
	}

	recordTilePoint(boardPoint, recordTilePointType) {
		if (!this.recordedTilePoints[recordTilePointType]) {
			this.recordedTilePoints[recordTilePointType] = {};
		}
		this.recordedTilePoints[recordTilePointType][boardPoint.tile.getOwnerCodeIdObjectString()] = boardPoint;
	}

	promptForBoardPointInAVeryHackyWay() {
		this.forEachBoardPoint(function(boardPoint) {
			boardPoint.addType(POSSIBLE_MOVE);
		})
	}

	getBoardPointFromRowAndCol(rowAndCol) {
		return this.cells[rowAndCol.row][rowAndCol.col];
	}

	getCopy() {
		const copy = new PaiShoGameBoard(this.tileManager);

		// Copy cells
		copy.cells = [];
		for (let row = 0; row < this.cells.length; row++) {
			copy.cells[row] = [];
			for (let col = 0; col < this.cells[row].length; col++) {
				copy.cells[row][col] = this.cells[row][col].getCopy();
			}
		}

		// Copy state flags
		copy.hostBannerPlayed = this.hostBannerPlayed;
		copy.guestBannerPlayed = this.guestBannerPlayed;
		copy.winners = this.winners ? [...this.winners] : [];

		// Copy recordedTilePoints (deep copy needed for nested structure)
		copy.recordedTilePoints = {};
		if (this.recordedTilePoints) {
			for (const pointType of Object.keys(this.recordedTilePoints)) {
				copy.recordedTilePoints[pointType] = {};
				for (const tileKey of Object.keys(this.recordedTilePoints[pointType])) {
					copy.recordedTilePoints[pointType][tileKey] = this.recordedTilePoints[pointType][tileKey];
				}
			}
		}

		return copy;
	}
}
