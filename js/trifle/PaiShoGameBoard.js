// Trifle Engine - Game Board
// Documentation: ~/Dropbox/Programming/SkudPaiSho/TheGardenGate/backend/TGGDocumentation/Trifle/
// A more reusable and global Pai Sho Board

import {
	HOST,
	NotationPoint,
	RowAndColumn,
} from '../CommonNotationObjects';
import { arrayIncludesOneOf, debug } from '../GameData';
import { paiShoBoardMaxRowOrCol } from '../pai-sho-common/PaiShoBoardHelp';
import { getOpponentName } from '../pai-sho-common/PaiShoPlayerHelp';
import {
	GATE,
	NEUTRAL,
	NON_PLAYABLE,
	POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import { currentTileMetadata } from './PaiShoGamesTileMetadata';
import { validateTileMetadataOnce } from './TrifleTileMetadataValidator';
import { TrifleAbility } from './TrifleAbility';
import { TrifleAbilityManager } from './TrifleAbilityManager';
import { TEMPLE, TrifleBoardPoint } from './TrifleBoardPoint';
import {
	TrifleAbilityCategory,
	TrifleAbilityName,
	TrifleActivationRequirement,
	TrifleAttributeType,
	TrifleDeployType,
	TrifleMovementAbility,
	TrifleMovementRestriction,
	TrifleSpecialDeployType,
	TrifleTileCategory,
	TrifleTileInfo,
	TrifleTileTeam,
	TrifleZoneAbility
} from './TrifleTileInfo';
import { TrifleBrainFactory } from './brains/BrainFactory';
import { TrifleBoardMovementMethods } from './PaiShoGameBoardMovement';
import { TrifleTriggerHelper } from './brains/TriggerHelper';

export class PaiShoGameBoard {
	constructor(tileManager, customAbilityActivationOrder, tileMetadata) {
		this.size = new RowAndColumn(17, 17);
		this.cells = this.brandNew();

		// TODO Eventually remove Trifle-specific?:
		this.hostBannerPlayed = false;
		this.guestBannerPlayed = false;

		/* Game managers pass their game's tile metadata explicitly; the global
		   currentTileMetadata fallback exists only for legacy construction paths */
		this.tileMetadata = tileMetadata || currentTileMetadata;
		validateTileMetadataOnce(this.tileMetadata);

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

	/**
	 * Seat a tile on a point, keeping both sides of the position relationship
	 * (point.tile and tile.seatedPoint) in sync. If the tile is currently seated
	 * on a point that still holds it, it is removed from there first.
	 *
	 * This is the single primitive for placing or relocating a standard tile.
	 * Ability brains must use this instead of hand-rolling removeTile()/putTile()/
	 * seatedPoint updates. Does not manage gigantic-tile extra occupied points
	 * (otherPointsOccupied); moveTile() clears those before calling this.
	 */
	relocateTile(tile, targetPoint) {
		const currentPoint = tile.seatedPoint;
		if (currentPoint && currentPoint.tile === tile) {
			currentPoint.removeTile();
		}
		targetPoint.putTile(tile);
		tile.seatedPoint = targetPoint;
	}

	putTileOnPoint(tile, notationPoint) {
		if (!tile) return;

		var point = this.getPointFromNotationPoint(notationPoint);

		this.relocateTile(tile, point);

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

	isGardenWallPoint(point) {
		return point.isType(NEUTRAL) && (point.isType(RED) || point.isType(WHITE));
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

		if (boardPointEnd.hasTile() && !capturedTiles.includes(boardPointEnd.tile)) {
			capturedTilePoints.push(boardPointEnd);
			capturedTiles.push(this.captureTileOnPoint(boardPointEnd));
		}

		capturedTiles.forEach((capturedTile) => {
			capturedTile.beingCaptured = true;
		});

		this.relocateTile(tile, boardPointEnd);

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
	 * Evaluate one tile's abilities against the current board state and last turn
	 * action, queueing any whose triggers are all met. Shared by both scan phases of
	 * processAbilities(): the board-tile scan and the captured-tile scan.
	 *
	 * @param {Object} tile - The tile whose abilities to evaluate
	 * @param {Object} pointWithTile - The tile's board point (null for captured tiles)
	 * @param {Object} lastTurnAction - What just happened (moved tile, captures, points)
	 * @param {Object} currentMoveInfo - Additional move context (passive movement flag, prompt data)
	 * @param {Object} existingAbilityActivationFlags - Flags from a previous cascade run
	 * @param {Object} abilitiesToActivate - Out: ability lists keyed by ability type
	 * @param {Array} abilitiesWithPromptTargetsNeeded - Out: abilities awaiting prompt answers
	 * @param {boolean} capturedTileScan - True to only evaluate capture-triggered abilities
	 */
	evaluateTileAbilitiesForActivation(tile, pointWithTile, lastTurnAction, currentMoveInfo, existingAbilityActivationFlags, abilitiesToActivate, abilitiesWithPromptTargetsNeeded, capturedTileScan) {
		const tileInfo = this.tileMetadata[tile.code];
		if (!tileInfo || !tileInfo.abilities) {
			return;
		}

		tileInfo.abilities.forEach((tileAbilityInfo) => {
			if (capturedTileScan && !TrifleTileInfo.tileAbilityIsTriggeredWhenCaptured(tileAbilityInfo)) {
				return;
			}

			let allTriggerConditionsMet = true;

			const triggerBrainMap = {};

			const triggerContext = {
				board: this,
				pointWithTile: pointWithTile,
				tile: tile,
				tileInfo: tileInfo,
				tileAbilityInfo: tileAbilityInfo,
				lastTurnAction: lastTurnAction,
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
					lastTurnAction: lastTurnAction
				};
				const abilityObject = new TrifleAbility(abilityContext);

				if (!abilityObject.hasNeededPromptTargetInfo()) {
					abilitiesWithPromptTargetsNeeded.push(abilityObject);
				}

				if (!this.abilityInActivatedList(abilityObject, existingAbilityActivationFlags.abilitiesActivated, TrifleAbilityCategory.instant)) {
					if (abilitiesToActivate[tileAbilityInfo.type] && abilitiesToActivate[tileAbilityInfo.type].length) {
						abilitiesToActivate[tileAbilityInfo.type].push(abilityObject);
					} else {
						abilitiesToActivate[tileAbilityInfo.type] = [abilityObject];
					}
				}
			}
		});
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

		var lastTurnAction = {
			tileMovedOrPlaced: tileMovedOrPlaced,
			tileMovedOrPlacedInfo: tileMovedOrPlacedInfo,
			boardPointStart: boardPointStart,
			boardPointEnd: boardPointEnd,
			capturedTiles: capturedTiles,
			capturedTilePoints: capturedTilePoints
		};

		/* Phase 1: Scan every tile on the board for triggered abilities. */
		this.forEachBoardPointWithTile((pointWithTile) => {
			this.evaluateTileAbilitiesForActivation(pointWithTile.tile, pointWithTile, lastTurnAction,
				currentMoveInfo, existingAbilityActivationFlags, abilitiesToActivate, abilitiesWithPromptTargetsNeeded, false);
		});

		/* Phase 2: Scan captured tiles for abilities that trigger when the tile is captured.
		   These tiles are no longer on the board, so pointWithTile is null. Only abilities
		   with capture-triggered types (e.g. whenCapturedByTargetTile) are evaluated here. */
		capturedTiles.forEach((capturedTile) => {
			this.evaluateTileAbilitiesForActivation(capturedTile, null, lastTurnAction,
				currentMoveInfo, existingAbilityActivationFlags, abilitiesToActivate, abilitiesWithPromptTargetsNeeded, true);
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
			var nextAbilityActivationFlags = this.processAbilities(tileMovedOrPlaced, tileMovedOrPlacedInfo, boardPointStart, boardPointEnd, abilityActivationFlags.tileRecords.capturedTiles, abilityActivationFlags.tileRecords.capturedTilePoints || [], currentMoveInfo, abilityActivationFlags);
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

	tileHasActiveCaptureProtectionFromCapturingTile(tile, capturingTile) {
		return this.abilityManager.abilityTargetingTileExists(TrifleAbilityName.protectFromCapture, tile);
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
				this.relocateTile(capturedTile, capturedTile.deployPoint);
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

			if (tileInfo.deployTypes.includes(TrifleDeployType.onOccupiedTile)) {
				var excludeCodes = tileInfo.deployExcludeTileCodes;
				this.forEachBoardPoint((boardPoint) => {
					if (boardPoint.hasTile()
						&& boardPoint.tile !== tile
						&& !boardPoint.isType(NON_PLAYABLE)
						&& (!excludeCodes || !excludeCodes.includes(boardPoint.tile.code))) {
						boardPoint.addType(POSSIBLE_MOVE);
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
				// if (boardPoint.tile.ownerName === tile.ownerName) {	// Removing owner check to allow for restrictions based on opponent's tiles as well. `cannotDeployAfterTileTypes` may need updating to be better handled and fully featured.
					const boardTileInfo = this.tileMetadata[boardPoint.tile.code];
					if (boardTileInfo && boardTileInfo.types) {
						tileInfo.cannotDeployAfterTileTypes.forEach((restrictedType) => {
							if (boardTileInfo.types.includes(restrictedType)) {
								blockedByTileOnBoard = true;
							}
						});
					}
				// }
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
					this.setPointAsPossibleMovement(targetPoint, tileBeingMoved, boardPointStart, null, movementInfo);
				}
			});
		}
	}

	setPointAsPossibleMovement(targetPoint, tileBeingMoved, originPoint, currentMovementPath, movementInfo) {
		// Enforce movement constraints from abilities (drawing-towards, etc)

		var movementOk = this.movementPassesConstraintChecks(targetPoint, tileBeingMoved, originPoint, movementInfo);

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
	movementPassesConstraintChecks(targetPoint, tileBeingMoved, originPoint, movementInfo) {
		const constraints = this.abilityManager.getMovementConstraintsForTile(tileBeingMoved);

		// If multiple conflicting draw abilities affect this tile, no movement is allowed
		if (constraints.length > 1) {
			return false;
		}

		// Check each constraint, passing movementInfo so brains can check flags
		for (let i = 0; i < constraints.length; i++) {
			const constraint = constraints[i];
			const result = constraint.isMovementAllowed(tileBeingMoved, originPoint, targetPoint, movementInfo);
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

	tickDurationAbilities() {
		this.abilityManager.tickDurationAbilities();
	}

	recordTilePoint(boardPoint, recordTilePointType) {
		if (!this.recordedTilePoints[recordTilePointType]) {
			this.recordedTilePoints[recordTilePointType] = {};
		}
		this.recordedTilePoints[recordTilePointType][boardPoint.tile.getOwnerCodeIdObjectString()] = boardPoint;
	}

	getBoardPointFromRowAndCol(rowAndCol) {
		return this.cells[rowAndCol.row][rowAndCol.col];
	}

	getCopy() {
		const copy = new PaiShoGameBoard(this.tileManager, this.abilityManager.abilityActivationOrder, this.tileMetadata);

		// Copy cells
		copy.cells = [];
		for (let row = 0; row < this.cells.length; row++) {
			copy.cells[row] = [];
			for (let col = 0; col < this.cells[row].length; col++) {
				copy.cells[row][col] = this.cells[row][col].getCopy();
			}
		}

		/* Relink cross-references that individual point copies can't resolve:
		   deployPoint, gigantic-tile shared occupancy, and an id -> tile map
		   used below to remap ability records onto the copy. */
		const copyTilesById = {};
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const origPoint = this.cells[row][col];
				const copyPoint = copy.cells[row][col];

				if (origPoint.occupiedByAbility && origPoint.pointOccupiedBy) {
					/* Extra point occupied by a gigantic tile: share the main
					   point's tile copy instead of a separate one */
					copyPoint.occupiedByAbility = true;
					copyPoint.pointOccupiedBy = copy.cells[origPoint.pointOccupiedBy.row][origPoint.pointOccupiedBy.col];
					copyPoint.tile = copyPoint.pointOccupiedBy.tile;
				}
				if (origPoint.otherPointsOccupied && origPoint.otherPointsOccupied.length) {
					copyPoint.otherPointsOccupied = origPoint.otherPointsOccupied.map(
						(occupiedPoint) => copy.cells[occupiedPoint.row][occupiedPoint.col]
					);
				}

				if (origPoint.hasTile() && copyPoint.hasTile()) {
					copyTilesById[copyPoint.tile.id] = copyPoint.tile;
					if (origPoint.tile.deployPoint) {
						copyPoint.tile.deployPoint = copy.cells[origPoint.tile.deployPoint.row][origPoint.tile.deployPoint.col];
					}
				}
			}
		}

		// Copy state flags
		copy.hostBannerPlayed = this.hostBannerPlayed;
		copy.guestBannerPlayed = this.guestBannerPlayed;
		copy.winners = this.winners ? [...this.winners] : [];

		// Copy recordedTilePoints, remapping recorded points to the copy's own points
		copy.recordedTilePoints = {};
		if (this.recordedTilePoints) {
			for (const pointType of Object.keys(this.recordedTilePoints)) {
				copy.recordedTilePoints[pointType] = {};
				for (const tileKey of Object.keys(this.recordedTilePoints[pointType])) {
					const recordedPoint = this.recordedTilePoints[pointType][tileKey];
					copy.recordedTilePoints[pointType][tileKey] = (recordedPoint && recordedPoint.row !== undefined)
						? copy.cells[recordedPoint.row][recordedPoint.col]
						: recordedPoint;
				}
			}
		}

		// Copy tiles awaiting resurrection (off-board, so not in the cells pass above)
		copy.capturedTilesForResurrection = this.capturedTilesForResurrection.map((capturedTile) => {
			const tileCopy = capturedTile.getCopy();
			if (capturedTile.deployPoint) {
				tileCopy.deployPoint = copy.cells[capturedTile.deployPoint.row][capturedTile.deployPoint.col];
			}
			return tileCopy;
		});

		/* Clone active ability records so ongoing effects (immobilize, protect from
		   capture, movement/deploy restrictions) constrain the copy immediately —
		   without this, simulated moves on a copy (e.g. AI evaluation) ignore all
		   active abilities until the first processAbilities run. */
		copy.abilityManager.abilities = [];
		this.abilityManager.abilities.forEach((ability) => {
			const clonedAbility = ability.cloneForBoardCopy(copy, copyTilesById);
			if (clonedAbility) {
				copy.abilityManager.abilities.push(clonedAbility);
			}
		});

		return copy;
	}
}

/* Movement system methods live in PaiShoGameBoardMovement.js */
Object.assign(PaiShoGameBoard.prototype, TrifleBoardMovementMethods);
