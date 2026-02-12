/* Skud Pai Sho Board */

import {
	ACCENT_TILE,
	BAMBOO,
	BASIC_FLOWER,
	BOAT,
	KNOTWEED,
	LION_TURTLE,
	ORCHID,
	POND,
	ROCK,
	WHEEL,
	WHITE_LOTUS,
	debug,
} from '../GameData';
import {
	boatOnlyMoves,
	lotusNoCapture,
	newKnotweedRules,
	newOrchidVulnerableRule,
	newWheelRule,
	rocksUnwheelable,
	simpleRocks,
	simpleSpecialFlowerRule,
	simplest,
	superRocks,
} from './SkudPaiShoRules';
import { AdevarTileType } from '../adevar/AdevarTile';
import {
	DIAGONAL_MOVEMENT,
	EVERYTHING_CAPTURE,
	IGNORE_CLASHING,
	gameOptionEnabled,
} from '../GameOptions';
import {
	GATE,
	NON_PLAYABLE,
	POSSIBLE_MOVE,
	SkudPaiShoBoardPoint,
} from './SkudPaiShoBoardPoint';
import {
	GUEST,
	HOST,
	NotationPoint,
	RowAndColumn,
} from '../CommonNotationObjects';
import {
	SkudPaiShoHarmony,
	SkudPaiShoHarmonyManager
} from './SkudPaiShoHarmony';
import { SkudPaiShoTile } from './SkudPaiShoTile';
import { paiShoBoardMaxRowOrCol } from '../pai-sho-common/PaiShoBoardHelp';
import { showBadMoveModal } from '../ModalManager';

export class SkudPaiShoBoard {
	constructor() {
		this.size = new RowAndColumn(17, 17);
		this.cells = this.brandNew();

		this.harmonyManager = new SkudPaiShoHarmonyManager();

		this.rockRowAndCols = [];
		this.playedWhiteLotusTiles = [];
		this.winners = [];
	}

	brandNew() {
		const cells = [];

		cells[0] = this.newRow(9,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.gate(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[1] = this.newRow(11,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.redWhiteNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[2] = this.newRow(13,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[3] = this.newRow(15,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[4] = this.newRow(17,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[5] = this.newRow(17,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[6] = this.newRow(17,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[7] = this.newRow(17,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[8] = this.newRow(17,
			[SkudPaiShoBoardPoint.gate(),
			SkudPaiShoBoardPoint.redWhiteNeutral(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.redWhiteNeutral(),
			SkudPaiShoBoardPoint.gate()
			]);

		cells[9] = this.newRow(17,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[10] = this.newRow(17,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[11] = this.newRow(17,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[12] = this.newRow(17,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[13] = this.newRow(15,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.red(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.white(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[14] = this.newRow(13,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.redNeutral(),
			SkudPaiShoBoardPoint.redWhite(),
			SkudPaiShoBoardPoint.whiteNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[15] = this.newRow(11,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.redWhiteNeutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		cells[16] = this.newRow(9,
			[SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.gate(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral(),
			SkudPaiShoBoardPoint.neutral()
			]);

		for (let row = 0; row < cells.length; row++) {
			for (let col = 0; col < cells[row].length; col++) {
				cells[row][col].row = row;
				cells[row][col].col = col;
			}
		}

		return cells;
	}

	newRow(numColumns, points) {
		const cells = [];

		const numBlanksOnSides = (this.size.row - numColumns) / 2;

		const nonPoint = new SkudPaiShoBoardPoint();
		nonPoint.addType(NON_PLAYABLE);

		for (let i = 0; i < this.size.row; i++) {
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

	placeTile(tile, notationPoint, tileManager, extraBoatPoint) {
		let tileRemovedWithBoat;

		if (tile.type === ACCENT_TILE) {
			if (tile.accentType === ROCK) {
				this.placeRock(tile, notationPoint);
			} else if (tile.accentType === WHEEL) {
				this.placeWheel(tile, notationPoint);
			} else if (tile.accentType === KNOTWEED) {
				this.placeKnotweed(tile, notationPoint);
			} else if (tile.accentType === BOAT) {
				tileRemovedWithBoat = this.placeBoat(tile, notationPoint, extraBoatPoint);
			} else if (tile.accentType === BAMBOO) {
				this.placeBamboo(tile, notationPoint, false, tileManager);
			} else if (tile.accentType === POND) {
				this.placePond(tile, notationPoint);
			} else if (tile.accentType === LION_TURTLE) {
				this.placeLionTurtle(tile, notationPoint);
			}
		} else {
			this.putTileOnPoint(tile, notationPoint);
			if (tile.specialFlowerType === WHITE_LOTUS) {
				this.playedWhiteLotusTiles.push(tile);
			}
		}
		// Things to do after a tile is placed
		this.flagAllTrappedAndDrainedTiles();
		this.analyzeHarmonies();

		if (tile.accentType === BOAT) {
			return {
				tileRemovedWithBoat: tileRemovedWithBoat
			};
		}
	}

	putTileOnPoint(tile, notationPoint) {
		let point = notationPoint.rowAndColumn;
		point = this.cells[point.row][point.col];

		point.putTile(tile);
	}

	canPlaceRock(boardPoint) {
		if (boardPoint.hasTile()) {
			// debug("Rock cannot be played on top of another tile");
			return false;
		}
		if (boardPoint.isType(GATE)) {
			return false;
		}
		return true;
	}

	placeRock(tile, notationPoint) {
		const rowAndCol = notationPoint.rowAndColumn;
		const boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

		if (!this.canPlaceRock(boardPoint)) {
			return false;
		}

		if (!boardPoint.isType(GATE)) {
			boardPoint.putTile(tile);
			this.rockRowAndCols.push(rowAndCol);
		}
	}

	canPlaceWheel(boardPoint) {
		if (boardPoint.hasTile()) {
			// debug("Wheel cannot be played on top of another tile");
			return false;
		}

		if (boardPoint.isType(GATE)) {
			return false;
		}

		// get surrounding RowAndColumn values
		const rowCols = this.getSurroundingRowAndCols(boardPoint);

		// Validate.. Wheel must not be next to a Gate, create Clash, or move tile off board

		for (let i = 0; i < rowCols.length; i++) {
			const bp = this.cells[rowCols[i].row][rowCols[i].col];
			if (bp.isType(GATE) && !newWheelRule) {
				// debug("Wheel cannot be played next to a GATE");
				return false;
			} else if (!newKnotweedRules && bp.hasTile() && (bp.tile.drained || bp.tile.accentType === KNOTWEED)) {
				// debug("wheel cannot be played next to drained tile or Knotweed");
				return false;
			} else if (newWheelRule) {
				if (bp.isType(GATE) && bp.hasTile()) {
					return false;	// Can't play Wheel next to Gate if Blooming tile
				}
			}

			if (rocksUnwheelable || simplest) {
				if (bp.hasTile() && bp.tile.accentType === ROCK) {
					return false; 	// Can't play Wheel next to Rock
				}
			}

			if (superRocks && bp.hasTile()) {
				// Tiles surrounding Rock cannot be moved by Wheel
				const moreRowCols = this.getSurroundingRowAndCols(bp);
				for (let j = 0; j < moreRowCols.length; j++) {
					const otherBp = this.cells[moreRowCols[j].row][moreRowCols[j].col];
					if (otherBp.hasTile() && otherBp.tile.accentType === ROCK) {
						return false;
					}
				}
			}

			// If a tile would be affected, verify the target
			if (bp.hasTile()) {
				const targetRowCol = this.getClockwiseRowCol(boardPoint, rowCols[i]);
				if (this.isValidRowCol(targetRowCol)) {
					const targetBp = this.cells[targetRowCol.row][targetRowCol.col];
					if (!targetBp.canHoldTile(bp.tile, true)) {
						return false;
					}
					if (targetBp.isType(GATE)) {
						return false;	// Can't move tile onto a Gate
					}
				} else {
					return false;	// Would move tile off board, no good
				}
			}
		}

		// Does it create Disharmony?
		if (!gameOptionEnabled(IGNORE_CLASHING)) {
			const newBoard = this.getCopy();
			const notationPoint = new NotationPoint(new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
			newBoard.placeWheel(new SkudPaiShoTile('W', 'G'), notationPoint, true);
			if (newBoard.moveCreatesDisharmony(boardPoint, boardPoint)) {
				return false;
			}
		}

		return true;
	}

	isValidRowCol(rowCol) {
		return rowCol.row >= 0 && rowCol.col >= 0 && rowCol.row <= 16 && rowCol.col <= 16;
	}

	placeWheel(tile, notationPoint, ignoreCheck) {
		const rowAndCol = notationPoint.rowAndColumn;
		const boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

		// get surrounding RowAndColumn values
		const rowCols = this.getSurroundingRowAndCols(rowAndCol);

		if (!ignoreCheck && !this.canPlaceWheel(boardPoint)) {
			return false;
		}

		boardPoint.putTile(tile);

		// Perform rotation: Get results, then place all tiles as needed
		const results = [];
		for (let i = 0; i < rowCols.length; i++) {
			// Save tile and target rowAndCol
			const tile = this.cells[rowCols[i].row][rowCols[i].col].removeTile();
			const targetRowCol = this.getClockwiseRowCol(rowAndCol, rowCols[i]);
			if (this.isValidRowCol(targetRowCol)) {
				results.push([tile, targetRowCol]);
			}
		}

		// go through and place tiles in target points
		const self = this;
		results.forEach(function(result) {
			const bp = self.cells[result[1].row][result[1].col];
			bp.putTile(result[0]);
		});

		this.refreshRockRowAndCols();
	}

	canPlaceKnotweed(boardPoint) {
		if (boardPoint.hasTile()) {
			// debug("Knotweed cannot be played on top of another tile");
			return false;
		}

		if (boardPoint.isType(GATE)) {
			return false;
		}

		if (!newKnotweedRules) {
			// Knotweed can be placed next to Gate in new knotweed rules
			const rowCols = this.getSurroundingRowAndCols(boardPoint);

			// Validate: Must not be played next to Gate
			for (let i = 0; i < rowCols.length; i++) {
				const bp = this.cells[rowCols[i].row][rowCols[i].col];
				if (bp.isType(GATE)) {
					// debug("Knotweed cannot be played next to a GATE");
					return false;
				}
			}
		}

		return true;
	}

	placeKnotweed(tile, notationPoint) {
		const rowAndCol = notationPoint.rowAndColumn;
		const boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

		const rowCols = this.getSurroundingRowAndCols(rowAndCol);

		if (!this.canPlaceKnotweed(boardPoint)) {
			return false;
		}

		// Place tile
		boardPoint.putTile(tile);

		// "Drain" surrounding tiles
		for (let i = 0; i < rowCols.length; i++) {
			const bp = this.cells[rowCols[i].row][rowCols[i].col];
			bp.drainTile();
		}
	}

	canPlaceBoat(boardPoint, tile) {
		if (!boardPoint.hasTile()) {
			// debug("Boat always played on top of another tile");
			return false;
		}

		if (boardPoint.isType(GATE)) {
			return false;
		}

		if (boardPoint.tile.type === ACCENT_TILE && !boatOnlyMoves) {
			if (boardPoint.tile.accentType !== KNOTWEED && !simplest && !rocksUnwheelable) {
				if (rocksUnwheelable && boardPoint.tile.accentType !== ROCK) {
					return false;
				} else if (!rocksUnwheelable) {
					// debug("Not played on Knotweed tile");
					return false;
				}
			} else if (!gameOptionEnabled(IGNORE_CLASHING)) {
				// Ensure no Disharmony
				const newBoard = this.getCopy();
				const notationPoint = new NotationPoint(new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
				newBoard.placeBoat(new SkudPaiShoTile('B', 'G'), notationPoint, boardPoint, true);
				const newBoardPoint = newBoard.cells[boardPoint.row][boardPoint.col];
				if (newBoard.moveCreatesDisharmony(newBoardPoint, newBoardPoint)) {
					return false;
				}
			}
		}

		return true;
	}

	placeBoat(tile, notationPoint, extraBoatPoint, ignoreCheck) {
		// debug("extra boat point:");
		// debug(extraBoatPoint);
		const rowAndCol = notationPoint.rowAndColumn;
		const boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

		let tileRemovedWithBoat;

		if (!ignoreCheck && !this.canPlaceBoat(boardPoint, tile)) {
			return false;
		}

		if (boardPoint.tile.type === ACCENT_TILE && !boatOnlyMoves) {
			// Validated as Knotweed

			// Options for Boat behavior. Uncomment ONE

			// This line replaces the Knotweed with the Boat
			//boardPoint.putTile(tile);

			// This line follows the actual current rule: Both removed from board
			tileRemovedWithBoat = boardPoint.removeTile();

			const rowCols = this.getSurroundingRowAndCols(rowAndCol);
			// "Restore" surrounding tiles
			for (let i = 0; i < rowCols.length; i++) {
				const bp = this.cells[rowCols[i].row][rowCols[i].col];
				bp.restoreTile();
			}

			if (rocksUnwheelable) {
				this.refreshRockRowAndCols();
			}
		} else {
			// Can't move a tile to where it can't normally go
			const bpRowCol = extraBoatPoint.rowAndColumn;
			const destBoardPoint = this.cells[bpRowCol.row][bpRowCol.col];

			if (!destBoardPoint.canHoldTile(boardPoint.tile)) {
				debug("Boat cannot move that tile there!");
				return false;
			}

			destBoardPoint.putTile(boardPoint.removeTile());
			boardPoint.putTile(tile);
		}

		return tileRemovedWithBoat;
	}

	canPlaceBamboo(boardPoint, tile) {
		// if (!boardPoint.hasTile()) {
		// 	// debug("Bamboo always played on top of another tile");
		// 	return false;
		// }
		// if (boardPoint.isType(GATE)) {
		// 	return false;
		// }
		// return true;


		if (boardPoint.hasTile()) {
			// debug("Bamboo cannot be played on top of another tile");
			return false;
		}

		if (boardPoint.isType(GATE)) {
			return false;
		}

		// Does it create Disharmony?
		if (!gameOptionEnabled(IGNORE_CLASHING)) {
			const newBoard = this.getCopy();
			const notationPoint = new NotationPoint(new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
			newBoard.placeBamboo(new SkudPaiShoTile('M', 'G'), notationPoint, true);
			if (newBoard.moveCreatesDisharmony(boardPoint, boardPoint)) {
				return false;
			}
		}

		return true;
	}

	placeBamboo(tile, notationPoint, ignoreCheck, tileManager) {
		const rowAndCol = notationPoint.rowAndColumn;
		const boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

		if (!ignoreCheck && !this.canPlaceBamboo(boardPoint, tile)) {
			return false;
		}

		// Option 1: Play on top of tile, return to hand
		// Option 2: All surrounding tiles returned to hand.. crazy, let's try it

		// Place tile
		boardPoint.putTile(tile);

		const rowCols = this.getSurroundingRowAndCols(rowAndCol);

		let surroundsOwnersFlowerTile = false;
		let surroundsGrowingFlower = false;
		for (let i = 0; i < rowCols.length; i++) {
			const bp = this.cells[rowCols[i].row][rowCols[i].col];
			if (!bp.isType(GATE)
				&& bp.hasTile()
				&& bp.tile.ownerName === tile.ownerName
				&& bp.tile.type !== ACCENT_TILE) {
				surroundsOwnersFlowerTile = true;
			} else if (bp.isType(GATE) && bp.hasTile()) {
				surroundsGrowingFlower = true;
			}
		}

		// Setting these will make it work the old way
		// surroundsOwnersFlowerTile = true;
		// surroundsGrowingFlower = false;

		// Return each tile to hand if surrounds Owner's Blooming Flower Tile and no Growing Flowers
		if (surroundsOwnersFlowerTile && !surroundsGrowingFlower) {
			for (let i = 0; i < rowCols.length; i++) {
				const bp = this.cells[rowCols[i].row][rowCols[i].col];
				if (bp.hasTile()) {
					// Put it back
					const removedTile = bp.removeTile();
					if (tileManager) {
						tileManager.putTileBack(removedTile);
					}
				}
			}
		}

		this.refreshRockRowAndCols();
	}

	canPlacePond(boardPoint, tile) {
		return !boardPoint.hasTile() && !boardPoint.isType(GATE);
	}

	placePond(tile, notationPoint, ignoreCheck) {
		const rowAndCol = notationPoint.rowAndColumn;
		const boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

		if (!ignoreCheck && !this.canPlacePond(boardPoint, tile)) {
			return false;
		}

		// Place tile
		boardPoint.putTile(tile);
	}

	canPlaceLionTurtle(boardPoint, tile) {
		return !boardPoint.hasTile()
			&& !boardPoint.isType(GATE);
	}

	// SkudPaiShoBoard.prototype.pointSurroundsPointSurroundingLionTurtle = function(boardPoint) {
	// 	const rowCols = this.getSurroundingRowAndCols(boardPoint);
	// 	for (let i = 0; i < rowCols.length; i++) {
	// 		if (this.getSurroundingLionTurtleTile(rowCols[i])) {
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// }

	placeLionTurtle(tile, notationPoint, ignoreCheck) {
		const rowAndCol = notationPoint.rowAndColumn;
		const boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

		if (!ignoreCheck && !this.canPlaceLionTurtle(boardPoint, tile)) {
			return false;
		}

		// Place tile
		boardPoint.putTile(tile);
	}

	getClockwiseRowCol(center, rowCol) {
		if (rowCol.row < center.row && rowCol.col <= center.col) {
			return new RowAndColumn(rowCol.row, rowCol.col + 1);
		} else if (rowCol.col > center.col && rowCol.row <= center.row) {
			return new RowAndColumn(rowCol.row + 1, rowCol.col);
		} else if (rowCol.row > center.row && rowCol.col >= center.col) {
			return new RowAndColumn(rowCol.row, rowCol.col - 1);
		} else if (rowCol.col < center.col && rowCol.row >= center.row) {
			return new RowAndColumn(rowCol.row - 1, rowCol.col);
		} else {
			debug("ERROR CLOCKWISE CALCULATING");
		}
	}

	getSurroundingRowAndCols(rowAndCol) {
		const rowAndCols = [];
		for (let row = rowAndCol.row - 1; row <= rowAndCol.row + 1; row++) {
			for (let col = rowAndCol.col - 1; col <= rowAndCol.col + 1; col++) {
				if ((row !== rowAndCol.row || col !== rowAndCol.col)	// Not the center given point
					&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) {	// Not outside range of the grid
					const boardPoint = this.cells[row][col];
					if (!boardPoint.isType(NON_PLAYABLE)) {	// Not non-playable
						rowAndCols.push(new RowAndColumn(row, col));
					}
				}
			}
		}
		return rowAndCols;
	}

	refreshRockRowAndCols() {
		this.rockRowAndCols = [];
		const self = this;

		this.cells.forEach(function(row) {
			row.forEach(function(boardPoint) {
				if (boardPoint.hasTile() && boardPoint.tile.accentType === ROCK) {
					self.rockRowAndCols.push(boardPoint);
				}
			});
		});
	}

	pointIsOpenGate(notationPoint) {
		let point = notationPoint.rowAndColumn;
		point = this.cells[point.row][point.col];

		return point.isOpenGate() || this.pointIsOpenAndSurroundsPond(point);
	}

	pointIsOpenAndSurroundsPond(boardPoint) {
		if (boardPoint.hasTile()) {
			return false;
		}
		const rowCols = this.getSurroundingRowAndCols(boardPoint);
		for (let i = 0; i < rowCols.length; i++) {
			const surroundingPoint = this.cells[rowCols[i].row][rowCols[i].col];
			if (surroundingPoint.hasTile() && surroundingPoint.tile.accentType === POND) {
				return true;
			}
		}
		return false;
	}

	moveTile(player, notationPointStart, notationPointEnd) {
		const startRowCol = notationPointStart.rowAndColumn;
		const endRowCol = notationPointEnd.rowAndColumn;

		if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
			debug("That point does not exist. So it's not gonna happen.");
			return false;
		}

		const boardPointStart = this.cells[startRowCol.row][startRowCol.col];
		const boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

		if (!this.canMoveTileToPoint(player, boardPointStart, boardPointEnd)
			&& !gameOptionEnabled(DIAGONAL_MOVEMENT)) {
			debug("Bad move bears");
			showBadMoveModal();
			return false;
		}

		const tile = boardPointStart.removeTile();
		const capturedTile = boardPointEnd.tile;

		if (!tile) {
			debug("Error: No tile to move!");
		}

		const error = boardPointEnd.putTile(tile);

		if (error) {
			debug("Error moving tile. It probably didn't get moved.");
			return false;
		}

		// Check for tile "trapped" by opponent Orchid
		this.flagAllTrappedAndDrainedTiles();

		if (gameOptionEnabled(EVERYTHING_CAPTURE)) {
			this.refreshRockRowAndCols();
		}

		// Check for harmonies
		const newHarmony = this.hasNewHarmony(player, tile, startRowCol, endRowCol);

		return {
			bonusAllowed: newHarmony,
			movedTile: tile,
			capturedTile: capturedTile
		}
	}

	flagAllTrappedAndDrainedTiles() {
		// First, untrap
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const bp = this.cells[row][col];
				if (bp.hasTile()) {
					bp.tile.trapped = false;
					if (newKnotweedRules) {
						bp.tile.drained = false;
					}
				}
			}
		}
		// Find Orchid tiles, then check surrounding opposite-player Basic Flower tiles and flag them
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const bp = this.cells[row][col];
				if (!bp.isType(GATE)) {
					this.trapTilesSurroundingPointIfNeeded(bp);
				}
				if (newKnotweedRules) {
					this.drainTilesSurroundingPointIfNeeded(bp);
				}
			}
		}
	}

	drainTilesSurroundingPointIfNeeded(boardPoint) {
		if (!newKnotweedRules) {
			return;
		}
		if (!boardPoint.hasTile()) {
			return;
		}
		if (boardPoint.tile.accentType !== KNOTWEED) {
			return;
		}

		// get surrounding RowAndColumn values
		const rowCols = this.getSurroundingRowAndCols(boardPoint);

		for (let i = 0; i < rowCols.length; i++) {
			const bp = this.cells[rowCols[i].row][rowCols[i].col];
			if (bp.hasTile() && !bp.isType(GATE) && bp.tile.type !== ACCENT_TILE && bp.tile.specialFlowerType !== ORCHID) {
				bp.tile.drained = true;
			}
		}
	}

	trapTilesSurroundingPointIfNeeded(boardPoint) {
		if (!boardPoint.hasTile()) {
			return;
		}
		if (boardPoint.tile.specialFlowerType !== ORCHID) {
			return;
		}

		const orchidOwner = boardPoint.tile.ownerName;

		// get surrounding RowAndColumn values
		const rowCols = this.getSurroundingRowAndCols(boardPoint);

		for (let i = 0; i < rowCols.length; i++) {
			const bp = this.cells[rowCols[i].row][rowCols[i].col];
			if (bp.hasTile() && !bp.isType(GATE)) {
				if (bp.tile.ownerName !== orchidOwner && bp.tile.type !== ACCENT_TILE) {
					bp.tile.trapped = true;
				}
			}
		}
	}

	whiteLotusProtected(lotusTile) {
		if (lotusNoCapture || simplest) {
			return true;
		}

		if (simpleSpecialFlowerRule) {
			return true;	// Simplest? Cannot be captured.
		}

		// Testing Lotus never protected:
		return false;

		// ----------- //

		// Protected if: player also has Blooming Orchid 
		let isProtected = false;
		this.cells.forEach(function(row) {
			row.forEach(function(boardPoint) {
				if (boardPoint.hasTile() && boardPoint.tile.specialFlowerType === ORCHID
					&& boardPoint.tile.ownerName === lotusTile.ownerName
					&& !boardPoint.isType(GATE)) {
					isProtected = true;
				}
			});
		});
		return isProtected;
	}

	orchidCanCapture(orchidTile) {
		if (simpleSpecialFlowerRule || simplest) {
			return false;	// Simplest? Never can capture.
		}

		// Note: This method does not check if other tile is protected from capture.
		let orchidCanCapture = false;
		this.cells.forEach(function(row) {
			row.forEach(function(boardPoint) {
				if (boardPoint.hasTile() && boardPoint.tile.specialFlowerType === WHITE_LOTUS
					&& boardPoint.tile.ownerName === orchidTile.ownerName
					&& !boardPoint.isType(GATE)) {
					orchidCanCapture = true;
				}
			});
		});
		return orchidCanCapture;
	}

	orchidVulnerable(orchidTile) {
		if (newOrchidVulnerableRule) {
			let orchidVulnerable = false;
			// Orchid vulnerable if opponent White Lotus is on board
			this.cells.forEach(function(row) {
				row.forEach(function(boardPoint) {
					if (boardPoint.hasTile() && boardPoint.tile.specialFlowerType === WHITE_LOTUS
						&& boardPoint.tile.ownerName !== orchidTile.ownerName) {
						orchidVulnerable = true;
					}
				});
			});
			return orchidVulnerable;
		}

		if (simpleSpecialFlowerRule) {
			return true;	// Simplest? Always vulnerable.
		}

		if (lotusNoCapture || simplest) {
			// Changing Orchid vulnerable when player has a Blooming Lotus
			let orchidVulnerable = false;
			this.cells.forEach(function(row) {
				row.forEach(function(boardPoint) {
					if (!boardPoint.isType(GATE) && boardPoint.hasTile() && boardPoint.tile.specialFlowerType === WHITE_LOTUS
						&& boardPoint.tile.ownerName === orchidTile.ownerName) {
						orchidVulnerable = true;
					}
				});
			});
			return orchidVulnerable;
		}

		/* ======= Original Rules: ======= */

		let orchidVulnerable = false;
		this.playedWhiteLotusTiles.forEach(function(lotus) {
			if (lotus.ownerName === orchidTile.ownerName) {
				orchidVulnerable = true;
			}
		});
		if (orchidVulnerable) {
			return true;
		}
	}

	canCapture(boardPointStart, boardPointEnd) {
		if (gameOptionEnabled(EVERYTHING_CAPTURE)) {
			return true;
		}

		const tile = boardPointStart.tile;
		const otherTile = boardPointEnd.tile;

		if (tile.ownerName === otherTile.ownerName) {
			return false;	// Cannot capture own tile
		}

		// Does end point surround Bamboo? Cannot capture tiles surrounding Bamboo
		const surroundingRowCols = this.getSurroundingRowAndCols(boardPointEnd);
		for (let i = 0; i < surroundingRowCols.length; i++) {
			const surroundingPoint = this.cells[surroundingRowCols[i].row][surroundingRowCols[i].col];
			if (surroundingPoint.hasTile() && surroundingPoint.tile.accentType === BAMBOO) {
				return false;	// Surrounds Bamboo
			}
		}

		// Is tile Orchid that can capture?
		// If so, Orchid can capture basic or special flower
		if (tile.specialFlowerType === ORCHID && otherTile.type !== ACCENT_TILE) {
			if (this.orchidCanCapture(tile)) {
				return true;
			}
		}

		// Check otherTile White Lotus protected from capture
		if (otherTile.specialFlowerType === WHITE_LOTUS) {
			if (this.whiteLotusProtected(otherTile)) {
				return false;	// Cannot capture otherTile any way at all
			} else if (tile.type === BASIC_FLOWER) {
				return true;	// If Lotus not protected, basic flower captures. Orchid handled in Orchid checks
			}
		}

		// Clashing Basic Flowers check
		if (tile.clashesWith(otherTile)) {
			return true;
		}

		// Orchid checks
		// Can otherTile Orchid be captured?
		// If vulnerable, it can be captured by any flower tile
		if (otherTile.specialFlowerType === ORCHID && tile.type !== ACCENT_TILE) {
			if (this.orchidVulnerable(otherTile)) {
				return true;
			}
		}
	}

	/* Does no verifying that tile can reach target point with standard movement */
	couldMoveTileToPoint(player, boardPointStart, boardPointEnd) {
		// start point must have a tile
		if (!boardPointStart.hasTile()) {
			return false;
		}

		// Tile must belong to player
		if (boardPointStart.tile.ownerName !== player) {
			return false;
		}

		// Cannot move drained or trapped tile
		if (boardPointStart.tile.trapped) {
			return false;
		}

		if (!newKnotweedRules && boardPointStart.tile.drained) {
			return false;
		}

		// If endpoint is a Gate, that's wrong.
		if (boardPointEnd.isType(GATE)) {
			return false;
		}

		let canCapture = false;
		if (boardPointEnd.hasTile()) {
			canCapture = this.canCapture(boardPointStart, boardPointEnd);
		}

		// If endpoint has a tile there that can't be captured, that is wrong.
		if (boardPointEnd.hasTile() && !canCapture) {
			return false;
		}

		if (!boardPointEnd.canHoldTile(boardPointStart.tile, canCapture)) {
			return false;
		}

		// What if moving the tile there creates a Disharmony on the board? That can't happen!
		if (!gameOptionEnabled(IGNORE_CLASHING)
			&& this.moveCreatesDisharmony(boardPointStart, boardPointEnd)) {
			return false;
		}

		// I guess we made it through
		return true;
	}

	canMoveTileToPoint(player, boardPointStart, boardPointEnd) {
		// start point must have a tile
		if (!boardPointStart.hasTile()) {
			debug("canMoveTileToPoint: Start point has no tile");
			return false;
		}

		// Tile must belong to player
		if (boardPointStart.tile.ownerName !== player) {
			debug("canMoveTileToPoint: Tile does not belong to player (owner: " + boardPointStart.tile.ownerName + ", player: " + player + ")");
			return false;
		}

		// Cannot move drained or trapped tile
		if (boardPointStart.tile.trapped) {
			debug("canMoveTileToPoint: Tile is trapped");
			return false;
		}

		if (!newKnotweedRules && boardPointStart.tile.drained) {
			debug("canMoveTileToPoint: Tile is drained (old knotweed rules)");
			return false;
		}

		// If endpoint is a Gate, that's wrong.
		if (boardPointEnd.isType(GATE)) {
			debug("canMoveTileToPoint: Cannot move to a Gate");
			return false;
		}

		let canCapture = false;
		if (boardPointEnd.hasTile()) {
			canCapture = this.canCapture(boardPointStart, boardPointEnd);
		}

		// If endpoint has a tile there that can't be captured, that is wrong.
		if (boardPointEnd.hasTile() && !canCapture) {
			debug("canMoveTileToPoint: Endpoint has a tile that cannot be captured");
			return false;
		}

		if (!boardPointEnd.canHoldTile(boardPointStart.tile, canCapture)) {
			debug("canMoveTileToPoint: Endpoint cannot hold this tile");
			return false;
		}

		// If endpoint is too far away, that is wrong.
		const numMoves = boardPointStart.tile.getMoveDistance();
		if (Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col) > numMoves) {
			debug("canMoveTileToPoint: Endpoint is too far away (distance: " + (Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col)) + ", max moves: " + numMoves + ")");
			return false;
		} else {
			// Move may be possible. But there may be tiles in the way...
			if (!this.verifyAbleToReach(boardPointStart, boardPointEnd, numMoves)) {
				debug("canMoveTileToPoint: Tiles are in the way, cannot reach destination");
				return false;
			}
		}

		// What if moving the tile there creates a Disharmony on the board? That can't happen!
		if (!gameOptionEnabled(IGNORE_CLASHING)
			&& this.moveCreatesDisharmony(boardPointStart, boardPointEnd)) {
			debug("canMoveTileToPoint: Move would create a disharmony");
			return false;
		}

		// I guess we made it through
		return true;
	}

	canTransportTileToPointWithBoat(boardPointStart, boardPointEnd) {
		// Transport Tile: used in Boat special ability

		// start point must have a tile
		if (!boardPointStart.hasTile()) {
			return false;
		}

		// If endpoint is a Gate, that's wrong.
		if (boardPointEnd.isType(GATE)) {
			return false;
		}

		// If endpoint has a tile, that is wrong.
		if (boardPointEnd.hasTile()) {
			return false;
		}

		if (!boardPointEnd.canHoldTile(boardPointStart.tile)) {
			return false;
		}

		// What if moving the tile there creates a Disharmony on the board? That can't happen!
		// if (this.moveCreatesDisharmony(boardPointStart, boardPointEnd)) {
		// 	return false;
		// }	// This disharmony check needs to first pretend that a Boat tile is on the spot the tile being moved was on. Fix is below:

		if (!gameOptionEnabled(IGNORE_CLASHING)) {
			const newBoard = this.getCopy();
			const newBoardPointStart = newBoard.cells[boardPointStart.row][boardPointStart.col];
			const notationPoint = new NotationPoint(new RowAndColumn(newBoardPointStart.row, newBoardPointStart.col).notationPointString);
			const notationPointEnd = new NotationPoint(new RowAndColumn(boardPointEnd.row, boardPointEnd.col).notationPointString);
			newBoard.placeBoat(new SkudPaiShoTile('B', 'G'), notationPoint, notationPointEnd, true);
			if (newBoard.moveCreatesDisharmony(newBoardPointStart, newBoardPointStart)) {
				return false;
			}
		}

		// I guess we made it through
		return true;
	}

	moveCreatesDisharmony(boardPointStart, boardPointEnd) {
		// Grab tile in end point and put the start tile there, unless points are the same
		let endTile;
		if (boardPointStart.row !== boardPointEnd.row || boardPointStart.col !== boardPointEnd.col) {
			endTile = boardPointEnd.removeTile();
			boardPointEnd.putTile(boardPointStart.removeTile());
		}

		let clashFound = false;

		// Now, analyze board for disharmonies
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const boardPoint = this.cells[row][col];
				if (boardPoint.hasTile()) {
					// Check for Disharmonies!
					if (this.hasDisharmony(boardPoint)) {
						clashFound = true;
						break;
					}
				}
			}
		}

		// Put tiles back the way they were if needed
		if (boardPointStart.row !== boardPointEnd.row || boardPointStart.col !== boardPointEnd.col) {
			boardPointStart.putTile(boardPointEnd.removeTile());
			boardPointEnd.putTile(endTile);
		}

		return clashFound;
	}

	verifyAbleToReach(boardPointStart, boardPointEnd, numMoves) {
		// Recursion!
		return this.pathFound(boardPointStart, boardPointEnd, numMoves);
	}

	pathFound(boardPointStart, boardPointEnd, numMoves) {
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

		const minMoves = Math.abs(startRow - endRow) + Math.abs(startCol - endCol);
		if (minMoves === 1) {
			return true;
		}

		// Check each direction with explicit variables (no reassignment)
		const upRow = startRow - 1;
		const downRow = startRow + 1;
		const leftCol = startCol - 1;
		const rightCol = startCol + 1;
		const movesLeft = numMoves - 1;

		// UP
		if (upRow >= 0) {
			const upPoint = this.cells[upRow][startCol];
			if (!upPoint.hasTile()) {
				if (this.pathFound(upPoint, boardPointEnd, movesLeft)) {
					return true;
				}
			}
		}

		// DOWN
		if (downRow < 17) {
			const downPoint = this.cells[downRow][startCol];
			if (!downPoint.hasTile()) {
				if (this.pathFound(downPoint, boardPointEnd, movesLeft)) {
					return true;
				}
			}
		}

		// LEFT
		if (leftCol >= 0) {
			const leftPoint = this.cells[startRow][leftCol];
			if (!leftPoint.hasTile()) {
				if (this.pathFound(leftPoint, boardPointEnd, movesLeft)) {
					return true;
				}
			}
		}

		// RIGHT
		if (rightCol < 17) {
			const rightPoint = this.cells[startRow][rightCol];
			if (!rightPoint.hasTile()) {
				if (this.pathFound(rightPoint, boardPointEnd, movesLeft)) {
					return true;
				}
			}
		}

		return false;
	}

	rowBlockedByRock(rowNum) {
		if (simpleRocks || simplest) {
			return false;	// simpleRocks: Rocks don't disable Harmonies.
		}

		let blocked = false;
		this.rockRowAndCols.forEach(function(rowAndCol) {
			if (rowAndCol.row === rowNum) {
				blocked = true;
			}
		});
		return blocked;
	}

	columnBlockedByRock(colNum) {
		if (simpleRocks || simplest) {
			return false;	// simpleRocks: Rocks don't disable Harmonies.
		}

		let blocked = false;
		this.rockRowAndCols.forEach(function(rowAndCol) {
			if (rowAndCol.col === colNum) {
				blocked = true;
			}
		});
		return blocked;
	}

	markSpacesBetweenHarmonies() {
		// Unmark all
		this.cells.forEach(function(row) {
			row.forEach(function(boardPoint) {
				boardPoint.betweenHarmony = false;
				boardPoint.betweenHarmonyHost = false;
				boardPoint.betweenHarmonyGuest = false;
			});
		});

		// Go through harmonies, mark the spaces between them
		const self = this;
		this.harmonyManager.harmonies.forEach(function(harmony) {
			// harmony.tile1Pos.row (for example)
			// Harmony will be in same row or same col
			if (harmony.tile1Pos.row === harmony.tile2Pos.row) {
				// Get smaller of the two
				const row = harmony.tile1Pos.row;
				let firstCol = harmony.tile1Pos.col;
				let lastCol = harmony.tile2Pos.col;
				if (harmony.tile2Pos.col < harmony.tile1Pos.col) {
					firstCol = harmony.tile2Pos.col;
					lastCol = harmony.tile1Pos.col;
				}
				for (let col = firstCol + 1; col < lastCol; col++) {
					self.cells[row][col].betweenHarmony = true;
					if (harmony.hasOwner(GUEST)) {
						self.cells[row][col].betweenHarmonyGuest = true;
					}
					if (harmony.hasOwner(HOST)) {
						self.cells[row][col].betweenHarmonyHost = true;
					}
				}
			} else if (harmony.tile2Pos.col === harmony.tile2Pos.col) {
				// Get smaller of the two
				const col = harmony.tile1Pos.col;
				let firstRow = harmony.tile1Pos.row;
				let lastRow = harmony.tile2Pos.row;
				if (harmony.tile2Pos.row < harmony.tile1Pos.row) {
					firstRow = harmony.tile2Pos.row;
					lastRow = harmony.tile1Pos.row;
				}
				for (let row = firstRow + 1; row < lastRow; row++) {
					self.cells[row][col].betweenHarmony = true;
					if (harmony.hasOwner(GUEST)) {
						self.cells[row][col].betweenHarmonyGuest = true;
					}
					if (harmony.hasOwner(HOST)) {
						self.cells[row][col].betweenHarmonyHost = true;
					}
				}
			}
		});
	}

	analyzeHarmonies() {
		// We're going to find all harmonies on the board

		// Check along all rows, then along all columns.. Or just check all tiles?
		this.harmonyManager.clearList();

		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const boardPoint = this.cells[row][col];
				if (boardPoint.hasTile()) {
					// Check for harmonies!
					const tileHarmonies = this.getTileHarmonies(boardPoint);
					// Add harmonies
					this.harmonyManager.addHarmonies(tileHarmonies);

					boardPoint.tile.harmonyOwners = [];

					for (let i = 0; i < tileHarmonies.length; i++) {
						for (let j = 0; j < tileHarmonies[i].owners.length; j++) {
							const harmonyOwnerName = tileHarmonies[i].owners[j].ownerName;
							const harmonyTile1 = tileHarmonies[i].tile1;
							const harmonyTile2 = tileHarmonies[i].tile2;

							if (!harmonyTile1.harmonyOwners) {
								harmonyTile1.harmonyOwners = [];
							}
							if (!harmonyTile2.harmonyOwners) {
								harmonyTile2.harmonyOwners = [];
							}

							if (!harmonyTile1.harmonyOwners.includes(harmonyOwnerName)) {
								harmonyTile1.harmonyOwners.push(harmonyOwnerName);
							}
							if (!harmonyTile2.harmonyOwners.includes(harmonyOwnerName)) {
								harmonyTile2.harmonyOwners.push(harmonyOwnerName);
							}
						}
					}
				}
			}
		}

		this.markSpacesBetweenHarmonies();

		// this.harmonyManager.printHarmonies();

		this.winners = [];
		const self = this;
		const harmonyRingOwners = this.harmonyManager.harmonyRingExists();
		if (harmonyRingOwners.length > 0) {
			harmonyRingOwners.forEach(function(player) {
				if (!self.winners.includes(player)) {
					self.winners.push(player);
				}
			});
		}
	}

	getSurroundingLionTurtleTiles(boardPoint) {
		const surroundingLionTurtleTiles = [];
		const rowCols = this.getSurroundingRowAndCols(boardPoint);
		for (let i = 0; i < rowCols.length; i++) {
			const surroundingPoint = this.cells[rowCols[i].row][rowCols[i].col];
			if (surroundingPoint.hasTile() && surroundingPoint.tile.accentType === LION_TURTLE) {
				surroundingLionTurtleTiles.push(surroundingPoint.tile);
			}
		}
		return surroundingLionTurtleTiles;
	}

	getTileHarmonies(boardPoint) {
		const tile = boardPoint.tile;
		const rowAndCol = boardPoint;
		const tileHarmonies = [];

		if (this.cells[rowAndCol.row][rowAndCol.col].isType(GATE)) {
			return tileHarmonies;
		}

		const surroundingLionTurtleTiles = this.getSurroundingLionTurtleTiles(rowAndCol);

		if (!this.rowBlockedByRock(rowAndCol.row)) {
			const leftHarmony = this.getHarmonyLeft(tile, rowAndCol, surroundingLionTurtleTiles);
			if (leftHarmony) {
				tileHarmonies.push(leftHarmony);
			}

			const rightHarmony = this.getHarmonyRight(tile, rowAndCol, surroundingLionTurtleTiles);
			if (rightHarmony) {
				tileHarmonies.push(rightHarmony);
			}
		}

		if (!this.columnBlockedByRock(rowAndCol.col)) {
			const upHarmony = this.getHarmonyUp(tile, rowAndCol, surroundingLionTurtleTiles);
			if (upHarmony) {
				tileHarmonies.push(upHarmony);
			}

			const downHarmony = this.getHarmonyDown(tile, rowAndCol, surroundingLionTurtleTiles);
			if (downHarmony) {
				tileHarmonies.push(downHarmony);
			}
		}

		return tileHarmonies;
	}

	getHarmonyLeft(tile, endRowCol, surroundingLionTurtleTiles) {
		let colToCheck = endRowCol.col - 1;

		while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
			colToCheck--;
		}

		if (colToCheck >= 0) {
			const checkPoint = this.cells[endRowCol.row][colToCheck];

			let newSurroundingLionTurtles = this.getSurroundingLionTurtleTiles(checkPoint);
			newSurroundingLionTurtles = newSurroundingLionTurtles.concat(surroundingLionTurtleTiles);
			const surroundsLionTurtle = newSurroundingLionTurtles.length > 0;

			if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile, surroundsLionTurtle)) {
				const harmony = new SkudPaiShoHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck), newSurroundingLionTurtles);
				return harmony;
			}
		}
	}

	getHarmonyRight(tile, endRowCol, surroundingLionTurtleTiles) {
		let colToCheck = endRowCol.col + 1;

		while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
			colToCheck++;
		}

		if (colToCheck <= 16) {
			const checkPoint = this.cells[endRowCol.row][colToCheck];

			let newSurroundingLionTurtles = this.getSurroundingLionTurtleTiles(checkPoint);
			newSurroundingLionTurtles = newSurroundingLionTurtles.concat(surroundingLionTurtleTiles);
			const surroundsLionTurtle = newSurroundingLionTurtles.length > 0;

			if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile, surroundsLionTurtle)) {
				const harmony = new SkudPaiShoHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck), newSurroundingLionTurtles);
				return harmony;
			}
		}
	}

	getHarmonyUp(tile, endRowCol, surroundingLionTurtleTiles) {
		let rowToCheck = endRowCol.row - 1;

		while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
			rowToCheck--;
		}

		if (rowToCheck >= 0) {
			const checkPoint = this.cells[rowToCheck][endRowCol.col];

			let newSurroundingLionTurtles = this.getSurroundingLionTurtleTiles(checkPoint);
			newSurroundingLionTurtles = newSurroundingLionTurtles.concat(surroundingLionTurtleTiles);
			const surroundsLionTurtle = newSurroundingLionTurtles.length > 0;

			if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile, surroundsLionTurtle)) {
				const harmony = new SkudPaiShoHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col), newSurroundingLionTurtles);
				return harmony;
			}
		}
	}

	getHarmonyDown(tile, endRowCol, surroundingLionTurtleTiles) {
		let rowToCheck = endRowCol.row + 1;

		while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
			rowToCheck++;
		}

		if (rowToCheck <= 16) {
			const checkPoint = this.cells[rowToCheck][endRowCol.col];

			let newSurroundingLionTurtles = this.getSurroundingLionTurtleTiles(checkPoint);
			newSurroundingLionTurtles = newSurroundingLionTurtles.concat(surroundingLionTurtleTiles);
			const surroundsLionTurtle = newSurroundingLionTurtles.length > 0;

			if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile, surroundsLionTurtle)) {
				const harmony = new SkudPaiShoHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col), newSurroundingLionTurtles);
				return harmony;
			}
		}
	}

	hasNewHarmony(player, tile, startRowCol, endRowCol) {
		// To check if new harmony, first analyze harmonies and compare to previous set of harmonies
		const oldHarmonies = this.harmonyManager.harmonies;
		this.analyzeHarmonies();

		return this.harmonyManager.hasNewHarmony(player, oldHarmonies);
	}

	hasDisharmony(boardPoint) {
		if (boardPoint.isType(GATE)) {
			return false;	// Gate never has disharmony
		}

		const tile = boardPoint.tile;
		let clashFound = false;

		if (this.hasDisharmonyLeft(tile, boardPoint)) {
			clashFound = true;
		}

		if (this.hasDisharmonyRight(tile, boardPoint)) {
			clashFound = true;
		}

		if (this.hasDisharmonyUp(tile, boardPoint)) {
			clashFound = true;
		}

		if (this.hasDisharmonyDown(tile, boardPoint)) {
			clashFound = true;
		}

		return clashFound;
	}

	hasDisharmonyLeft(tile, endRowCol) {
		let colToCheck = endRowCol.col - 1;

		while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
			colToCheck--;
		}

		if (colToCheck >= 0) {
			const checkPoint = this.cells[endRowCol.row][colToCheck];
			if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
				// debug("CLASHES Left: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
				return true;
			}
		}
	}

	hasDisharmonyRight(tile, endRowCol) {
		let colToCheck = endRowCol.col + 1;

		while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
			colToCheck++;
		}

		if (colToCheck <= 16) {
			const checkPoint = this.cells[endRowCol.row][colToCheck];
			if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
				// debug("CLASHES Right: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
				return true;
			}
		}
	}

	hasDisharmonyUp(tile, endRowCol) {
		let rowToCheck = endRowCol.row - 1;

		while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
			rowToCheck--;
		}

		if (rowToCheck >= 0) {
			const checkPoint = this.cells[rowToCheck][endRowCol.col];
			if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
				// debug("CLASHES Up: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
				return true;
			}
		}
	}

	hasDisharmonyDown(tile, endRowCol) {
		let rowToCheck = endRowCol.row + 1;

		while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
			rowToCheck++;
		}

		if (rowToCheck <= 16) {
			const checkPoint = this.cells[rowToCheck][endRowCol.col];
			if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
				// debug("CLASHES Down: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
				return true;
			}
		}
	}

	getAdjacentPointsPotentialPossibleMoves(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
		const potentialMovePoints = [];

		if (!pointAlongTheWay) {
			pointAlongTheWay = originPoint;
		}
		const rowDifference = originPoint.row - pointAlongTheWay.row;
		const colDifference = originPoint.col - pointAlongTheWay.col;

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

		const finalPoints = [];

		potentialMovePoints.forEach(function(potentialMovePoint) {
			if (!potentialMovePoint.isType(NON_PLAYABLE)) {
				const newRowDiff = originPoint.row - potentialMovePoint.row;
				const newColDiff = originPoint.col - potentialMovePoint.col;
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
		const diagonalPoints = [];

		if (!pointAlongTheWay) {
			pointAlongTheWay = originPoint;
		}
		const rowDifference = originPoint.row - pointAlongTheWay.row;
		const colDifference = originPoint.col - pointAlongTheWay.col;

		if (
			(!mustPreserveDirection || (mustPreserveDirection && rowDifference >= 0 && colDifference >= 0))
			&& (pointAlongTheWay.row > 0 && pointAlongTheWay.col > 0)
		) {
			const adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col - 1];
			if (!adjacentPoint.isType(NON_PLAYABLE)) {
				diagonalPoints.push(adjacentPoint);
			}
		}
		if (
			(!mustPreserveDirection || (mustPreserveDirection && rowDifference <= 0 && colDifference <= 0))
			&& (pointAlongTheWay.row < paiShoBoardMaxRowOrCol && pointAlongTheWay.col < paiShoBoardMaxRowOrCol)
		) {
			const adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col + 1];
			if (!adjacentPoint.isType(NON_PLAYABLE)) {
				diagonalPoints.push(adjacentPoint);
			}
		}
		if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference >= 0 && rowDifference <= 0))
			&& (pointAlongTheWay.col > 0 && pointAlongTheWay.row < paiShoBoardMaxRowOrCol)
		) {
			const adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col - 1];
			if (!adjacentPoint.isType(NON_PLAYABLE)) {
				diagonalPoints.push(adjacentPoint);
			}
		}
		if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference <= 0 && rowDifference >= 0))
			&& (pointAlongTheWay.col < paiShoBoardMaxRowOrCol && pointAlongTheWay.row > 0)
		) {
			const adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col + 1];
			if (!adjacentPoint.isType(NON_PLAYABLE)) {
				diagonalPoints.push(adjacentPoint);
			}
		}

		return diagonalPoints;
	}

	targetPointHasTileThatCanBeCaptured(tile, movementInfo, originPoint, targetPoint, isDeploy) {
		return targetPoint.hasTile()
			&& this.canCapture(originPoint, targetPoint);
	}

	tileCanCapture(tile, movementInfo, fromPoint, targetPoint) {
		return tile.canCapture(targetPoint.tile)
			|| (tile.type === AdevarTileType.secondFace && targetPoint.tile.type === AdevarTileType.hiddenTile);	// Allow attempting to capture HT with any SFT
	}

	tileCanMoveThroughPoint(tile, movementInfo, targetPoint, fromPoint) {
		// Can also check anything else that restricts tile movement through spaces on the board
		return !targetPoint.hasTile();
	}

	canMoveHereMoreEfficientlyAlready(boardPoint, distanceRemaining, movementInfo) {
		return boardPoint.getMoveDistanceRemaining(movementInfo) >= distanceRemaining;
	}

	setPossibleMovePoints(boardPointStart) {
		if (boardPointStart.hasTile()) {
			this.setPossibleMovesForMovement({ distance: boardPointStart.tile.getMoveDistance() }, boardPointStart);
		}
	}

	setPossibleMovesForMovement(movementInfo, boardPointStart) {
		if (gameOptionEnabled(DIAGONAL_MOVEMENT)) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], SkudPaiShoBoard.diagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], SkudPaiShoBoard.standardMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		}
	}

	static standardMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		const mustPreserveDirection = false;	// True means the tile couldn't turn as it goes
		return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
	}

	static diagonalMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		const mustPreserveDirection = false;
		return board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
	}

	static standardPlusDiagonalMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		const mustPreserveDirection = false;
		const movePoints = board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
		return movePoints.concat(board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo));
	}

	setPossibleMovementPointsFromMovePoints(movePoints, nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, distanceRemaining, moveStepNumber) {
		if (distanceRemaining === 0
			|| !movePoints
			|| movePoints.length <= 0) {
			return;	// Complete
		}

		const self = this;
		const nextPointsConfirmed = [];
		movePoints.forEach(function(recentPoint) {
			const nextPossiblePoints = nextPossibleMovementPointsFunction(self, originPoint, recentPoint, movementInfo, moveStepNumber);
			nextPossiblePoints.forEach(function(adjacentPoint) {
				if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
					adjacentPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);

					const canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);

					/* If cannot move through point, then the distance remaining is 0, none! */
					if (!canMoveThroughPoint) {
						adjacentPoint.setMoveDistanceRemaining(movementInfo, 0);
					}

					if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint, originPoint)) {
						const movementOk = self.setPointAsPossibleMovement(adjacentPoint, tile, originPoint);
						if (movementOk) {
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

	setPointAsPossibleMovement(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
		targetPoint.addType(POSSIBLE_MOVE);
		return true;
	}

	tileCanMoveOntoPoint(tile, movementInfo, targetPoint, fromPoint, originPoint) {
		return this.couldMoveTileToPoint(tile.ownerName, originPoint, targetPoint);
	}

	/* SkudPaiShoBoard.prototype.setPossibleMovePointsOld = function(boardPointStart) {
		if (!boardPointStart.hasTile()) {
			return;
		}
		// Apply "possible move point" type to applicable boardPoints
		const player = boardPointStart.tile.ownerName;
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				if (this.canMoveTileToPoint(player, boardPointStart, this.cells[row][col])) {
					this.cells[row][col].addType(POSSIBLE_MOVE);
				}
			}
		}
	}; */

	removePossibleMovePoints() {
		this.cells.forEach(function(row) {
			row.forEach(function(boardPoint) {
				boardPoint.removeType(POSSIBLE_MOVE);
				boardPoint.clearPossibleMovementTypes();
			});
		});
	}

	setOpenGatePossibleMoves(player, tile) {
		// Apply "open gate" type to applicable boardPoints
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const bp = this.cells[row][col];
				if (bp.isOpenGate()) {
					this.cells[row][col].addType(POSSIBLE_MOVE);
				}

				// If Pond, mark surrounding points
				if (tile && bp.hasTile() && bp.tile.accentType === POND) {
					const rowCols = this.getSurroundingRowAndCols(bp);
					for (let i = 0; i < rowCols.length; i++) {
						const surroundingPoint = this.cells[rowCols[i].row][rowCols[i].col];
						if (surroundingPoint.canHoldTile(tile)) {
							// If does not cause clash...
							const newBoard = this.getCopy();
							const notationPoint = new NotationPoint(new RowAndColumn(surroundingPoint.row, surroundingPoint.col).notationPointString);
							newBoard.placeTile(tile, notationPoint);
							if (gameOptionEnabled(IGNORE_CLASHING) || !newBoard.moveCreatesDisharmony(notationPoint, notationPoint)) {
								surroundingPoint.addType(POSSIBLE_MOVE);
							}
						}
					}
				}
			}
		}
	}

	playerControlsLessThanTwoGates(player) {
		let count = 0;
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const bp = this.cells[row][col];
				if (bp.isType(GATE) && bp.hasTile() && bp.tile.ownerName === player) {
					count++;
				}
			}
		}

		return count < 2;
	}

	playerHasNoGrowingFlowers(player) {
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const bp = this.cells[row][col];
				if (bp.isType(GATE) && bp.hasTile() && bp.tile.ownerName === player) {
					return false;
				}
			}
		}

		return true;
	}

	revealSpecialFlowerPlacementPoints(player) {
		// Check each Gate for tile belonging to player, then check gate edge points
		const bpCheckList = [];

		let row = 0;
		let col = 8;
		let bp = this.cells[row][col];
		if (bp.hasTile() && bp.tile.ownerName === player) {
			bpCheckList.push(this.cells[row][col - 1]);
			bpCheckList.push(this.cells[row][col + 1]);
		}

		row = 16;
		bp = this.cells[row][col];
		if (bp.hasTile() && bp.tile.ownerName === player) {
			bpCheckList.push(this.cells[row][col - 1]);
			bpCheckList.push(this.cells[row][col + 1]);
		}

		row = 8;
		col = 0;
		bp = this.cells[row][col];
		if (bp.hasTile() && bp.tile.ownerName === player) {
			bpCheckList.push(this.cells[row - 1][col]);
			bpCheckList.push(this.cells[row + 1][col]);
		}

		col = 16;
		bp = this.cells[row][col];
		if (bp.hasTile() && bp.tile.ownerName === player) {
			bpCheckList.push(this.cells[row - 1][col]);
			bpCheckList.push(this.cells[row + 1][col]);
		}

		bpCheckList.forEach(function(bp) {
			if (!bp.hasTile()) {
				bp.addType(POSSIBLE_MOVE);
			}
		});
	}

	setGuestGateOpen() {
		const row = 16;
		const col = 8;
		if (this.cells[row][col].isOpenGate()) {
			this.cells[row][col].addType(POSSIBLE_MOVE);
		}
	}

	revealPossiblePlacementPoints(tile) {
		const self = this;

		this.cells.forEach(function(row) {
			row.forEach(function(boardPoint) {
				let valid = false;

				if (
					(tile.accentType === ROCK && self.canPlaceRock(boardPoint))
					|| (tile.accentType === WHEEL && self.canPlaceWheel(boardPoint))
					|| (tile.accentType === KNOTWEED && self.canPlaceKnotweed(boardPoint))
					|| (tile.accentType === BOAT && self.canPlaceBoat(boardPoint, tile))
					|| (tile.accentType === BAMBOO && self.canPlaceBamboo(boardPoint, tile))
					|| (tile.accentType === POND && self.canPlacePond(boardPoint, tile))
					|| (tile.accentType === LION_TURTLE && self.canPlaceLionTurtle(boardPoint, tile))
				) {
					valid = true;
				}

				if (valid) {
					boardPoint.addType(POSSIBLE_MOVE);
				}
			});
		});
	}

	revealBoatBonusPoints(boardPoint) {
		if (!boardPoint.hasTile()) {
			return;
		}

		const player = boardPoint.tile.ownerName;

		if (newKnotweedRules) {
			// New rules: All surrounding points
			const rowCols = this.getSurroundingRowAndCols(boardPoint);

			for (let i = 0; i < rowCols.length; i++) {
				const boardPointEnd = this.cells[rowCols[i].row][rowCols[i].col];
				if (this.canTransportTileToPointWithBoat(boardPoint, boardPointEnd)) {
					boardPointEnd.addType(POSSIBLE_MOVE);
				}
			}
			return;
		}
		// The rest is old and outdated...
		// Apply "possible move point" type to applicable boardPoints
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const boardPointEnd = this.cells[row][col];
				if (Math.abs(boardPoint.row - boardPointEnd.row) + Math.abs(boardPoint.col - boardPointEnd.col) === 1) {
					if (this.canMoveTileToPoint(player, boardPoint, boardPointEnd)) {
						boardPointEnd.addType(POSSIBLE_MOVE);
					}
				}
			}
		}
	}

	getCopy() {
		const copyBoard = new SkudPaiShoBoard();

		// cells
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				copyBoard.cells[row][col] = this.cells[row][col].getCopy();
			}
		}

		// playedWhiteLotusTiles
		for (let i = 0; i < this.playedWhiteLotusTiles.length; i++) {
			copyBoard.playedWhiteLotusTiles.push(this.playedWhiteLotusTiles[i].getCopy());
		}

		// Everything else...
		copyBoard.refreshRockRowAndCols();
		copyBoard.analyzeHarmonies();

		return copyBoard;
	}

	numTilesInGardensForPlayer(player) {
		let count = 0;
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const bp = this.cells[row][col];
				if (bp.types.length === 1 && bp.hasTile()) {
					if (bp.isType(bp.tile.basicColorName)) {
						count++;
					}
				}
			}
		}
		return count;
	}

	numTilesOnBoardForPlayer(player) {
		let count = 0;
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const bp = this.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player) {
					count++;
				}
			}
		}
		return count;
	}

	getSurroundness(player) {
		let up = 0;
		let hasUp = 0;
		let down = 0;
		let hasDown = 0;
		let left = 0;
		let hasLeft = 0;
		let right = 0;
		let hasRight = 0;
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				const bp = this.cells[row][col];
				if (bp.hasTile() && bp.tile.ownerName === player) {
					if (bp.row > 8) {
						down++;
						hasDown = 1;
					}
					if (bp.row < 8) {
						up++;
						hasUp = 1;
					}
					if (bp.col < 8) {
						left++;
						hasLeft = 1;
					}
					if (bp.col > 8) {
						right++;
						hasRight = 1;
					}
				}
			}
		}
		// Get lowest...
		let lowest = up;
		if (down < lowest) {
			lowest = down;
		}
		if (left < lowest) {
			lowest = left;
		}
		if (right < lowest) {
			lowest = right;
		}

		if (lowest === 0) {
			return hasUp + hasDown + hasLeft + hasRight;
		} else {
			return lowest * 4;
		}
	}


}
