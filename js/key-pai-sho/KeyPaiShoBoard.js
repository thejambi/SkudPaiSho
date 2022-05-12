/* Skud Pai Sho Board */

KeyPaiSho.Board = function() {
	this.size = new RowAndColumn(18, 18);
	this.cells = this.brandNew();

	this.harmonyManager = new KeyPaiSho.HarmonyManager();

	this.rockRowAndCols = [];
	this.playedWhiteLotusTiles = [];
	this.winners = [];
};

KeyPaiSho.Board.prototype.setHarmonyMinima = function(harmonyMinima) {
	this.harmonyManager.setHarmonyMinima(harmonyMinima);
};

KeyPaiSho.Board.prototype.brandNew = function () {
	var cells = [];

	cells[0] = this.newRow(6,
		[KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.nonPlayable(),
		KeyPaiSho.BoardPoint.gate(),
		KeyPaiSho.BoardPoint.nonPlayable(),
		KeyPaiSho.BoardPoint.nonPlayable(),
		KeyPaiSho.BoardPoint.neutral()
		]);

	cells[1] = this.newRow(10,
		[KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.nonPlayable(),
		KeyPaiSho.BoardPoint.nonPlayable(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral()
		]);

	cells[2] = this.newRow(12,
		[KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.whiteNeutral(),
		KeyPaiSho.BoardPoint.redNeutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral()
		]);

	cells[3] = this.newRow(14,
		[KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.whiteNeutral(),
		KeyPaiSho.BoardPoint.white(),
		KeyPaiSho.BoardPoint.red(),
		KeyPaiSho.BoardPoint.redNeutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral()
		]);

	cells[4] = this.newRow(16,
		[KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.whiteNeutral(),
		KeyPaiSho.BoardPoint.white(),
		KeyPaiSho.BoardPoint.white(),
		KeyPaiSho.BoardPoint.red(),
		KeyPaiSho.BoardPoint.red(),
		KeyPaiSho.BoardPoint.redNeutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral(),
		KeyPaiSho.BoardPoint.neutral()
		]);

	cells[5] = this.newRow(16,
		[KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral()
		]);

	cells[6] = this.newRow(18,
		[KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral()
		]);

	cells[7] = this.newRow(18,
		[KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.nonPlayable()
		]);

	cells[8] = this.newRow(18,
		[KeyPaiSho.BoardPoint.gate(),
			KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.gate(),
			KeyPaiSho.BoardPoint.nonPlayable()
		]);

	cells[9] = this.newRow(18,
		[KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.nonPlayable()
		]);

	cells[10] = this.newRow(18,
		[KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.nonPlayable()
		]);

	cells[11] = this.newRow(18,
		[KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral()
		]);

	cells[12] = this.newRow(16,
		[KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral()
		]);

	cells[13] = this.newRow(16,
		[KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral()
		]);

	cells[14] = this.newRow(14,
		[KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.red(),
			KeyPaiSho.BoardPoint.white(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral()
		]);

	cells[15] = this.newRow(12,
		[KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.redNeutral(),
			KeyPaiSho.BoardPoint.whiteNeutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral()
		]);

	cells[16] = this.newRow(10,
		[KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.gate(),
			KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.neutral()
		]);

	cells[17] = this.newRow(6,
		[KeyPaiSho.BoardPoint.neutral(),
			KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.nonPlayable(),
			KeyPaiSho.BoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

KeyPaiSho.Board.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new KeyPaiSho.BoardPoint();
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
};

KeyPaiSho.Board.prototype.forEachBoardPoint = function(forEachFunc) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				forEachFunc(boardPoint);
			}
		});
	});
};
KeyPaiSho.Board.prototype.forEachBoardPointWithTile = function(forEachFunc) {
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			forEachFunc(boardPoint);
		}
	});
};

KeyPaiSho.Board.prototype.placeTile = function(tile, notationPoint, tileManager, extraBoatPoint) {
	var tileRemovedWithBoat;

	var returnValues = {};

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
		if (tile.code === KeyPaiSho.TileCodes.Lotus 
				&& notationPoint.rowAndColumn.row === 8
				&& notationPoint.rowAndColumn.col === 8) {
			this.openTheGardenGate();
			returnValues.openGardenGate = true;
		}
		this.putTileOnPoint(tile, notationPoint);
	}
	// Things to do after a tile is placed
	this.flagAllTrappedAndDrainedTiles();
	this.analyzeHarmonies();

	/* if (tile.accentType === BOAT) {
		return {
			tileRemovedWithBoat: tileRemovedWithBoat
		};
	} */

	return returnValues;
};

KeyPaiSho.Board.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

KeyPaiSho.Board.prototype.canPlaceRock = function(boardPoint) {
	if (boardPoint.hasTile()) {
		// debug("Rock cannot be played on top of another tile");
		return false;
	}
	if (boardPoint.isType(GATE)) {
		return false;
	}
	return true;
};

KeyPaiSho.Board.prototype.placeRock = function(tile, notationPoint) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	if (!this.canPlaceRock(boardPoint)) {
		return false;
	}

	if (!boardPoint.isType(GATE)) {
		boardPoint.putTile(tile);
		this.rockRowAndCols.push(rowAndCol);
	}
};

KeyPaiSho.Board.prototype.canPlaceWheel = function(boardPoint) {
	if (boardPoint.hasTile()) {
		// debug("Wheel cannot be played on top of another tile");
		return false;
	}

	if (boardPoint.isType(GATE)) {
		return false;
	}

	// get surrounding RowAndColumn values
	var rowCols = this.getSurroundingRowAndCols(boardPoint);

	// Validate.. Wheel must not be next to a Gate, create Clash, or move tile off board

	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
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
			var moreRowCols = this.getSurroundingRowAndCols(bp);
			for (var j = 0; j < moreRowCols.length; j++) {
				var otherBp = this.cells[moreRowCols[j].row][moreRowCols[j].col];
				if (otherBp.hasTile() && otherBp.tile.accentType === ROCK) {
					return false;
				}
			}
		}

		// If a tile would be affected, verify the target
		if (bp.hasTile()) {
			var targetRowCol = this.getClockwiseRowCol(boardPoint, rowCols[i]);
			if (this.isValidRowCol(targetRowCol)) {
				var targetBp = this.cells[targetRowCol.row][targetRowCol.col];
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

	return true;
};

KeyPaiSho.Board.prototype.placeWheel = function(tile, notationPoint, ignoreCheck) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	// get surrounding RowAndColumn values
	var rowCols = this.getSurroundingRowAndCols(rowAndCol);

	if (!ignoreCheck && !this.canPlaceWheel(boardPoint)) {
		return false;
	}

	boardPoint.putTile(tile);

	// Perform rotation: Get results, then place all tiles as needed
	var results = [];
	for (var i = 0; i < rowCols.length; i++) {
		// Save tile and target rowAndCol
		var tile = this.cells[rowCols[i].row][rowCols[i].col].removeTile();
		var targetRowCol = this.getClockwiseRowCol(rowAndCol, rowCols[i]);
		if (this.isValidRowCol(targetRowCol)) {
			results.push([tile,targetRowCol]);
		}
	}

	// go through and place tiles in target points
	var self = this;
	results.forEach(function(result) {
		var bp = self.cells[result[1].row][result[1].col];
		bp.putTile(result[0]);
	});
	
	this.refreshRockRowAndCols();
};

KeyPaiSho.Board.prototype.canPlaceKnotweed = function(boardPoint) {
	if (boardPoint.hasTile()) {
		// debug("Knotweed cannot be played on top of another tile");
		return false;
	}

	if (boardPoint.isType(GATE)) {
		return false;
	}

	if (!newKnotweedRules) {
		// Knotweed can be placed next to Gate in new knotweed rules
		var rowCols = this.getSurroundingRowAndCols(boardPoint);

		// Validate: Must not be played next to Gate
		for (var i = 0; i < rowCols.length; i++) {
			var bp = this.cells[rowCols[i].row][rowCols[i].col];
			if (bp.isType(GATE)) {
				// debug("Knotweed cannot be played next to a GATE");
				return false;
			}
		}
	}

	return true;
};

KeyPaiSho.Board.prototype.placeKnotweed = function(tile, notationPoint) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	var rowCols = this.getSurroundingRowAndCols(rowAndCol);

	if (!this.canPlaceKnotweed(boardPoint)) {
		return false;
	}

	// Place tile
	boardPoint.putTile(tile);

	// "Drain" surrounding tiles
	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
		bp.drainTile();
	}
};

KeyPaiSho.Board.prototype.canPlaceBoat = function(boardPoint, tile) {
	/* if (!boardPoint.hasTile()) {
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
			var newBoard = this.getCopy();
			var notationPoint = new NotationPoint(new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
			newBoard.placeBoat(new SkudPaiShoTile('B', 'G'), notationPoint, boardPoint, true);
			var newBoardPoint = newBoard.cells[boardPoint.row][boardPoint.col];
			if (newBoard.moveCreatesDisharmony(newBoardPoint, newBoardPoint)) {
				return false;
			}
		}
	}

	return true; */
};

KeyPaiSho.Board.prototype.placeBoat = function(tile, notationPoint, extraBoatPoint, ignoreCheck) {
	// debug("extra boat point:");
	// debug(extraBoatPoint);
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	var tileRemovedWithBoat;

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

		var rowCols = this.getSurroundingRowAndCols(rowAndCol);
		// "Restore" surrounding tiles
		for (var i = 0; i < rowCols.length; i++) {
			var bp = this.cells[rowCols[i].row][rowCols[i].col];
			bp.restoreTile();
		}
		
		if (rocksUnwheelable) {
			this.refreshRockRowAndCols();
		}
	} else {
		// Can't move a tile to where it can't normally go
		var bpRowCol = extraBoatPoint.rowAndColumn;
		var destBoardPoint = this.cells[bpRowCol.row][bpRowCol.col];

		if (!destBoardPoint.canHoldTile(boardPoint.tile)) {
			debug("Boat cannot move that tile there!");
			return false;
		}

		destBoardPoint.putTile(boardPoint.removeTile());
		boardPoint.putTile(tile);
	}

	return tileRemovedWithBoat;
};

KeyPaiSho.Board.prototype.canPlaceBamboo = function(boardPoint, tile) {
	/* // if (!boardPoint.hasTile()) {
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
		var newBoard = this.getCopy();
		var notationPoint = new NotationPoint(new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
		newBoard.placeBamboo(new SkudPaiShoTile('M', 'G'), notationPoint, true);
		if (newBoard.moveCreatesDisharmony(boardPoint, boardPoint)) {
			return false;
		}
	}

	return true; */
};

KeyPaiSho.Board.prototype.placeBamboo = function(tile, notationPoint, ignoreCheck, tileManager) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	if (!ignoreCheck && !this.canPlaceBamboo(boardPoint, tile)) {
		return false;
	}

	// Option 1: Play on top of tile, return to hand
	// Option 2: All surrounding tiles returned to hand.. crazy, let's try it

	// Place tile
	boardPoint.putTile(tile);

	var rowCols = this.getSurroundingRowAndCols(rowAndCol);

	var surroundsOwnersFlowerTile = false;
	var surroundsGrowingFlower = false;
	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
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
		for (var i = 0; i < rowCols.length; i++) {
			var bp = this.cells[rowCols[i].row][rowCols[i].col];
			if (bp.hasTile()) {
				// Put it back
				var removedTile = bp.removeTile();
				if (tileManager) {
					tileManager.putTileBack(removedTile);
				}
			}
		}
	}
	
	this.refreshRockRowAndCols();
};

KeyPaiSho.Board.prototype.canPlacePond = function(boardPoint, tile) {
	return !boardPoint.hasTile() && !boardPoint.isType(GATE);
};

KeyPaiSho.Board.prototype.placePond = function(tile, notationPoint, ignoreCheck) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	if (!ignoreCheck && !this.canPlacePond(boardPoint, tile)) {
		return false;
	}

	// Place tile
	boardPoint.putTile(tile);
};

KeyPaiSho.Board.prototype.canPlaceLionTurtle = function(boardPoint, tile) {
	return !boardPoint.hasTile() 
		&& !boardPoint.isType(GATE);
};

// KeyPaiSho.Board.prototype.pointSurroundsPointSurroundingLionTurtle = function(boardPoint) {
// 	var rowCols = this.getSurroundingRowAndCols(boardPoint);
// 	for (var i = 0; i < rowCols.length; i++) {
// 		if (this.getSurroundingLionTurtleTile(rowCols[i])) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

KeyPaiSho.Board.prototype.placeLionTurtle = function(tile, notationPoint, ignoreCheck) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	if (!ignoreCheck && !this.canPlaceLionTurtle(boardPoint, tile)) {
		return false;
	}

	// Place tile
	boardPoint.putTile(tile);
};

KeyPaiSho.Board.prototype.getClockwiseRowCol = function(center, rowCol) {
	if (rowCol.row < center.row && rowCol.col <= center.col) {
		return new RowAndColumn(rowCol.row, rowCol.col+1);
	} else if (rowCol.col > center.col && rowCol.row <= center.row) {
		return new RowAndColumn(rowCol.row+1, rowCol.col);
	} else if (rowCol.row > center.row && rowCol.col >= center.col) {
		return new RowAndColumn(rowCol.row, rowCol.col-1);
	} else if (rowCol.col < center.col && rowCol.row >= center.row) {
		return new RowAndColumn(rowCol.row-1, rowCol.col);
	} else {
		debug("ERROR CLOCKWISE CALCULATING");
	}
}

KeyPaiSho.Board.prototype.getSurroundingRowAndCols = function(rowAndCol) {
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
};

KeyPaiSho.Board.prototype.refreshRockRowAndCols = function() {
	this.rockRowAndCols = [];
	var self = this;

	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (boardPoint.hasTile() && boardPoint.tile.accentType === ROCK) {
				self.rockRowAndCols.push(boardPoint);
			}
		});
	});
};

KeyPaiSho.Board.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	/* return point.isOpenGate() || this.pointIsOpenAndSurroundsPond(point); */
	return point.isOpenGate();
};

KeyPaiSho.Board.prototype.pointIsOpenCenterGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	var centerPoint = this.getBoardPoint(point.row, point.col);

	if (!centerPoint.hasTile() && centerPoint.row == 8 && centerPoint.col == 8) {
		var centerPoint2 = this.getBoardPoint(8, 9);
		var centerPoint3 = this.getBoardPoint(9, 8);
		var centerPoint4 = this.getBoardPoint(9, 9);
		
		return !centerPoint2.hasTile()
			&& !centerPoint3.hasTile()
			&& !centerPoint4.hasTile();
	}
	return false;
};

KeyPaiSho.Board.prototype.pointIsOpenAndSurroundsPond = function(boardPoint) {
	if (boardPoint.hasTile()) {
		return false;
	}
	var rowCols = this.getSurroundingRowAndCols(boardPoint);
	for (var i = 0; i < rowCols.length; i++) {
		var surroundingPoint = this.cells[rowCols[i].row][rowCols[i].col];
		if (surroundingPoint.hasTile() && surroundingPoint.tile.accentType === POND) {
			return true;
		}
	}
	return false;
};

KeyPaiSho.Board.prototype.isValidRowCol = function(rowCol) {
	return rowCol && rowCol.row >= 0 && rowCol.col >= 0 && rowCol.row <= this.size.row - 1 && rowCol.col <= this.size.col - 1;
};

KeyPaiSho.Board.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (!this.isValidRowCol(startRowCol) || !this.isValidRowCol(endRowCol)) {
		debug("That point does not exist. So it's not gonna happen.");
		return false;
	}

	var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
	var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

	var tile = boardPointStart.removeTile();
	var capturedTile = boardPointEnd.tile;

	if (!tile) {
		debug("Error: No tile to move!");
	}

	if (this.getBoardPoint(8, 8).isType(GATE)) {
		this.closeTheGardenGate();
	}

	var error = boardPointEnd.putTile(tile);

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
	this.analyzeHarmonies();

	return {
		movedTile: tile,
		capturedTile: capturedTile
	}
};

KeyPaiSho.Board.prototype.flagAllTrappedAndDrainedTiles = function() {
	// First, untrap
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile()) {
				bp.tile.trapped = false;
				if (newKnotweedRules) {
					bp.tile.drained = false;
				}
			}
		}
	}
	// Find Orchid tiles, then check surrounding opposite-player Basic Flower tiles and flag them
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (!bp.isType(GATE)) {
				this.trapTilesSurroundingPointIfNeeded(bp);
			}
			if (newKnotweedRules) {
				this.drainTilesSurroundingPointIfNeeded(bp);
			}
		}
	}
};

KeyPaiSho.Board.prototype.drainTilesSurroundingPointIfNeeded = function(boardPoint) {
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
	var rowCols = this.getSurroundingRowAndCols(boardPoint);

	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
		if (bp.hasTile() && !bp.isType(GATE) && bp.tile.type !== ACCENT_TILE && bp.tile.specialFlowerType !== ORCHID) {
			bp.tile.drained = true;
		}
	}
};

KeyPaiSho.Board.prototype.trapTilesSurroundingPointIfNeeded = function(boardPoint) {
	if (!boardPoint.hasTile()) {
		return;
	}
	if (boardPoint.tile.specialFlowerType !== ORCHID) {
		return;
	}

	var orchidOwner = boardPoint.tile.ownerName;

	// get surrounding RowAndColumn values
	var rowCols = this.getSurroundingRowAndCols(boardPoint);

	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
		if (bp.hasTile() && !bp.isType(GATE)) {
			if (bp.tile.ownerName !== orchidOwner && bp.tile.type !== ACCENT_TILE) {
				bp.tile.trapped = true;
			}
		}
	}
};

KeyPaiSho.Board.prototype.whiteLotusProtected = function(lotusTile) {
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
	var isProtected = false;
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
};

KeyPaiSho.Board.prototype.orchidCanCapture = function(orchidTile) {
	if (simpleSpecialFlowerRule || simplest) {
		return false;	// Simplest? Never can capture.
	}

	// Note: This method does not check if other tile is protected from capture.
	var orchidCanCapture = false;
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
};

KeyPaiSho.Board.prototype.orchidVulnerable = function(orchidTile) {
	if (newOrchidVulnerableRule) {
		var orchidVulnerable = false;
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
		var orchidVulnerable = false;
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

	var orchidVulnerable = false;
	this.playedWhiteLotusTiles.forEach(function(lotus) {
		if (lotus.ownerName === orchidTile.ownerName) {
			orchidVulnerable = true;
		}
	});
	if (orchidVulnerable) {
		return true;
	}
};

KeyPaiSho.Board.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	return false;

	/* if (gameOptionEnabled(EVERYTHING_CAPTURE)) {
		return true;
	}

	var tile = boardPointStart.tile;
	var otherTile = boardPointEnd.tile;

	if (tile.ownerName === otherTile.ownerName) {
		return false;	// Cannot capture own tile
	}

	// Does end point surround Bamboo? Cannot capture tiles surrounding Bamboo
	var surroundingRowCols = this.getSurroundingRowAndCols(boardPointEnd);
	for (var i = 0; i < surroundingRowCols.length; i++) {
		var surroundingPoint = this.cells[surroundingRowCols[i].row][surroundingRowCols[i].col];
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
	} */
};

/* Does no verifying that tile can reach target point with standard movement */
KeyPaiSho.Board.prototype.couldMoveTileToPoint = function(player, boardPointStart, boardPointEnd, tile) {
	// must have a tile
	if (!tile && boardPointStart.hasTile()) {
		tile = boardPointStart.tile;
	}
	if (!tile) {
		return false;
	}

	// Tile must belong to player
	if (tile.ownerName !== player) {
		return false;
	}

	// Cannot move drained or trapped tile
	if (tile.trapped) {
		return false;
	}

	if (!newKnotweedRules && tile.drained) {
		return false;
	}

	// If endpoint is a Gate, that's wrong.
	if (boardPointEnd.isType(GATE)) {
		return false;
	}
	
	var canCapture = false;
	if (boardPointEnd.hasTile()) {
		canCapture = this.canCapture(boardPointStart, boardPointEnd);
	}

	// If endpoint has a tile there that can't be captured, that is wrong.
	if (boardPointEnd.hasTile() && !canCapture) {
		return false;
	}

	if (!boardPointEnd.canHoldTile(tile, canCapture)) {
		return false;
	}

	// I guess we made it through
	return true;
};

KeyPaiSho.Board.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
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
	
	var canCapture = false;
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

	// If endpoint is too far away, that is wrong.
	var numMoves = boardPointStart.tile.getMoveDistance();
	if (Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col) > numMoves) {
		// end point is too far away, can't move that far
		return false;
	} else {
		// Move may be possible. But there may be tiles in the way...
		if (!this.verifyAbleToReach(boardPointStart, boardPointEnd, numMoves)) {
			// debug("Tiles are in the way, so you can't reach that spot.");
			return false;
		}
	}

	// What if moving the tile there creates a Disharmony on the board? That can't happen!
	if (!gameOptionEnabled(IGNORE_CLASHING) 
			&& this.moveCreatesDisharmony(boardPointStart, boardPointEnd)) {
		return false;
	}

	// I guess we made it through
	return true;
};

KeyPaiSho.Board.prototype.canTransportTileToPointWithBoat = function(boardPointStart, boardPointEnd) {
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
		var newBoard = this.getCopy();
		var newBoardPointStart = newBoard.cells[boardPointStart.row][boardPointStart.col];
		var notationPoint = new NotationPoint(new RowAndColumn(newBoardPointStart.row, newBoardPointStart.col).notationPointString);
		var notationPointEnd = new NotationPoint(new RowAndColumn(boardPointEnd.row, boardPointEnd.col).notationPointString);
		newBoard.placeBoat(new SkudPaiShoTile('B', 'G'), notationPoint, notationPointEnd, true);
		if (newBoard.moveCreatesDisharmony(newBoardPointStart, newBoardPointStart)) {
			return false;
		}
	}

	// I guess we made it through
	return true;
};

KeyPaiSho.Board.prototype.moveCreatesDisharmony = function(boardPointStart, boardPointEnd) {
	// Grab tile in end point and put the start tile there, unless points are the same
	var endTile;
	if (boardPointStart.row !== boardPointEnd.row || boardPointStart.col !== boardPointEnd.col) {
		endTile = boardPointEnd.removeTile();
		boardPointEnd.putTile(boardPointStart.removeTile());
	}

	var clashFound = false;

	// Now, analyze board for disharmonies
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var boardPoint = this.cells[row][col];
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
};

KeyPaiSho.Board.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves) {
  // Recursion!
  return this.pathFound(boardPointStart, boardPointEnd, numMoves);
};

KeyPaiSho.Board.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves) {
  if (!boardPointStart || !boardPointEnd) {
    return false; // start or end point not given
  }

  if (boardPointStart.isType(NON_PLAYABLE) || boardPointEnd.isType(NON_PLAYABLE)) {
  	return false;	// Paths must be through playable points
  }

  if (boardPointStart.row === boardPointEnd.row && boardPointStart.col === boardPointEnd.col) {
    return true; // Yay! start point equals end point
  }
  if (numMoves <= 0) {
    return false; // No more moves left
  }
  
  // Idea: Get min num moves necessary!
  var minMoves = Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col);
  
  if (minMoves === 1) {
    return true; // Yay! Only 1 space away (and remember, numMoves is more than 0)
  }

  // Check moving UP
  var nextRow = boardPointStart.row - 1;
  if (nextRow >= 0) {
    var nextPoint = this.cells[nextRow][boardPointStart.col];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1)) {
      return true; // Yay!
    }
  }

  // Check moving DOWN
  nextRow = boardPointStart.row + 1;
  if (nextRow < 17) {
    var nextPoint = this.cells[nextRow][boardPointStart.col];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1)) {
      return true; // Yay!
    }
  }

  // Check moving LEFT
  var nextCol = boardPointStart.col - 1;
  if (nextCol >= 0) {
    var nextPoint = this.cells[boardPointStart.row][nextCol];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1)) {
      return true; // Yay!
    }
  }

  // Check moving RIGHT
  nextCol = boardPointStart.col + 1;
  if (nextCol < 17) {
    var nextPoint = this.cells[boardPointStart.row][nextCol];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1)) {
      return true; // Yay!
    }
  }
};

KeyPaiSho.Board.prototype.rowBlockedByRock = function(rowNum) {
	if (simpleRocks || simplest) {
		return false;	// simpleRocks: Rocks don't disable Harmonies.
	}

	var blocked = false;
	this.rockRowAndCols.forEach(function(rowAndCol) {
		if (rowAndCol.row === rowNum) {
			blocked = true;
		}
	});
	return blocked;
};

KeyPaiSho.Board.prototype.columnBlockedByRock = function(colNum) {
	if (simpleRocks || simplest) {
		return false;	// simpleRocks: Rocks don't disable Harmonies.
	}
	
	var blocked = false;
	this.rockRowAndCols.forEach(function(rowAndCol) {
		if (rowAndCol.col === colNum) {
			blocked = true;
		}
	});
	return blocked;
};

KeyPaiSho.Board.prototype.markSpacesBetweenHarmonies = function() {
	// Unmark all
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.betweenHarmony = false;
			boardPoint.betweenHarmonyHost = false;
			boardPoint.betweenHarmonyGuest = false;
		});
	});

	// Go through harmonies, mark the spaces between them
	var self = this;
	this.harmonyManager.harmonies.forEach(function(harmony) {
		// harmony.tile1Pos.row (for example)
		// Harmony will be in same row or same col OR diagonal
		
		var firstCol = harmony.tile1Pos.col;
		var lastCol = harmony.tile2Pos.col;

		var colChange = 0;
		if (lastCol > firstCol) {
			colChange = 1;
		} else if (firstCol > lastCol) {
			colChange = -1;
		}

		var firstRow = harmony.tile1Pos.row;
		var lastRow = harmony.tile2Pos.row;
		
		var rowChange = 0;
		if (lastRow > firstRow) {
			rowChange = 1;
		} else if (firstRow > lastRow) {
			rowChange = -1;
		}
		
		var row = firstRow;
		var col = firstCol;
		while (row !== lastRow || col !== lastCol) {
			self.cells[row][col].betweenHarmony = true;
			if (harmony.hasOwner(GUEST)) {
				self.cells[row][col].betweenHarmonyGuest = true;
			}
			if (harmony.hasOwner(HOST)) {
				self.cells[row][col].betweenHarmonyHost = true;
			}

			row += rowChange;
			col += colChange;
		}
		


		/* if (harmony.tile1Pos.row === harmony.tile2Pos.row) {
			// Get smaller of the two
			var row = harmony.tile1Pos.row;
			var firstCol = harmony.tile1Pos.col;
			var lastCol = harmony.tile2Pos.col;
			if (harmony.tile2Pos.col < harmony.tile1Pos.col) {
				firstCol = harmony.tile2Pos.col;
				lastCol = harmony.tile1Pos.col;
			}
			for (var col = firstCol + 1; col < lastCol; col++) {
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
			var col = harmony.tile1Pos.col;
			var firstRow = harmony.tile1Pos.row;
			var lastRow = harmony.tile2Pos.row;
			if (harmony.tile2Pos.row < harmony.tile1Pos.row) {
				firstRow = harmony.tile2Pos.row;
				lastRow = harmony.tile1Pos.row;
			}
			for (var row = firstRow + 1; row < lastRow; row++) {
				self.cells[row][col].betweenHarmony = true;
				if (harmony.hasOwner(GUEST)) {
					self.cells[row][col].betweenHarmonyGuest = true;
				}
				if (harmony.hasOwner(HOST)) {
					self.cells[row][col].betweenHarmonyHost = true;
				}
			}
		} */
	});
};

KeyPaiSho.Board.prototype.analyzeHarmonies = function() {
	// We're going to find all harmonies on the board

	// Check along all rows, then along all columns.. Or just check all tiles?
	this.harmonyManager.clearList();

	this.forEachBoardPointWithTile(boardPoint => {
		var tileHarmonies = this.getTileHarmonies(boardPoint);
		this.harmonyManager.addHarmonies(tileHarmonies);

		boardPoint.tile.harmonyOwners = [];

		for (var i = 0; i < tileHarmonies.length; i++) {
			for (var j = 0; j < tileHarmonies[i].owners.length; j++) {
				var harmonyOwnerName = tileHarmonies[i].owners[j].ownerName;
				var harmonyTile1 = tileHarmonies[i].tile1;
				var harmonyTile2 = tileHarmonies[i].tile2;

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
	});

	/* for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var boardPoint = this.cells[row][col];
			if (boardPoint.hasTile()) {
				// Check for harmonies!
				var tileHarmonies = this.getTileHarmonies(boardPoint);
				// Add harmonies
				this.harmonyManager.addHarmonies(tileHarmonies);

				boardPoint.tile.harmonyOwners = [];

				for (var i = 0; i < tileHarmonies.length; i++) {
					for (var j = 0; j < tileHarmonies[i].owners.length; j++) {
						var harmonyOwnerName = tileHarmonies[i].owners[j].ownerName;
						var harmonyTile1 = tileHarmonies[i].tile1;
						var harmonyTile2 = tileHarmonies[i].tile2;

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
	} */

	this.markSpacesBetweenHarmonies();

	// this.harmonyManager.printHarmonies();

	this.winners = [];
	var self = this;
	var harmonyRingOwners = this.harmonyManager.harmonyRingExists();
	if (harmonyRingOwners.length > 0) {
		harmonyRingOwners.forEach(function(player) {
			if (!self.winners.includes(player)) {
				self.winners.push(player);
			}
		});
	}
};

KeyPaiSho.Board.prototype.getSurroundingLionTurtleTiles = function(boardPoint) {
	var surroundingLionTurtleTiles = [];
	var rowCols = this.getSurroundingRowAndCols(boardPoint);
	for (var i = 0; i < rowCols.length; i++) {
		var surroundingPoint = this.cells[rowCols[i].row][rowCols[i].col];
		if (surroundingPoint.hasTile() && surroundingPoint.tile.accentType === LION_TURTLE) {
			surroundingLionTurtleTiles.push(surroundingPoint.tile);
		}
	}
	return surroundingLionTurtleTiles;
};

KeyPaiSho.Board.prototype.getTileHarmonies = function(boardPoint) {
	var tile = boardPoint.tile;
	var rowAndCol = boardPoint;
	var tileHarmonies = [];

	if (this.cells[rowAndCol.row][rowAndCol.col].isType(GATE)
			|| (tile.type !== BASIC_FLOWER && tile.code !== KeyPaiSho.TileCodes.Lotus)) {
		return tileHarmonies;
	}

	var harmonyDistance = tile.getHarmonyDistance();

	if (tile.hasOrthogonalMovement()) {
		var harmony = this.getHarmonyInDirection(tile, boardPoint, 0, -1, harmonyDistance);
		if (harmony) {
			tileHarmonies.push(harmony);
		}

		harmony = this.getHarmonyInDirection(tile, boardPoint, 0, 1, harmonyDistance);
		if (harmony) {
			tileHarmonies.push(harmony);
		}

		harmony = this.getHarmonyInDirection(tile, boardPoint, -1, 0, harmonyDistance);
		if (harmony) {
			tileHarmonies.push(harmony);
		}

		var harmony = this.getHarmonyInDirection(tile, boardPoint, 1, 0, harmonyDistance);
		if (harmony) {
			tileHarmonies.push(harmony);
		}
	}

	if (tile.hasDiagonalMovement()) {
		var harmony = this.getHarmonyInDirection(tile, boardPoint, 1, -1, harmonyDistance);
		if (harmony) {
			tileHarmonies.push(harmony);
		}

		harmony = this.getHarmonyInDirection(tile, boardPoint, 1, 1, harmonyDistance);
		if (harmony) {
			tileHarmonies.push(harmony);
		}

		harmony = this.getHarmonyInDirection(tile, boardPoint, -1, 1, harmonyDistance);
		if (harmony) {
			tileHarmonies.push(harmony);
		}

		harmony = this.getHarmonyInDirection(tile, boardPoint, -1, -1, harmonyDistance);
		if (harmony) {
			tileHarmonies.push(harmony);
		}
	}

	return tileHarmonies;
};

KeyPaiSho.Board.prototype.getHarmonyInDirection = function(tile, fromPoint, rowChange, colChange, maxDistance) {
	/* Possible Harmony begins two steps away */
	var startDistance = 2;
	if (tile.code === KeyPaiSho.TileCodes.Lotus) {
		startDistance = 1;
	}
	
	var rowToCheck = fromPoint.row + rowChange;
	var colToCheck = fromPoint.col + colChange;

	var distance = 1;

	var checkPoint = this.getBoardPoint(rowToCheck, colToCheck);

	while (this.isValidRowCol(checkPoint) && !checkPoint.hasTileOfType([BASIC_FLOWER, SPECIAL_FLOWER]) && !checkPoint.isType(GATE) && distance <= maxDistance) {
		distance++;
		rowToCheck += rowChange;
		colToCheck += colChange;
		checkPoint = this.getBoardPoint(rowToCheck, colToCheck);
	}

	if (distance >= startDistance && distance <= maxDistance && this.isValidRowCol(checkPoint) 
			&& !checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile)) {
		var harmony = new KeyPaiSho.Harmony(tile, fromPoint, checkPoint.tile, checkPoint);
		return harmony;
	}
};

KeyPaiSho.Board.prototype.getHarmonyLeft = function(tile, endRowCol, maxDistance) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile() 
		&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];

		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new KeyPaiSho.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

KeyPaiSho.Board.prototype.getHarmonyRight = function(tile, endRowCol, maxDistance) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile() 
		&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];

		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new KeyPaiSho.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

KeyPaiSho.Board.prototype.getHarmonyUp = function(tile, endRowCol, maxDistance) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile() 
		&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];

		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new KeyPaiSho.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

KeyPaiSho.Board.prototype.getHarmonyDown = function(tile, endRowCol, maxDistance) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile() 
		&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];

		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new KeyPaiSho.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

KeyPaiSho.Board.prototype.hasNewHarmony = function(player, tile, startRowCol, endRowCol) {
	// To check if new harmony, first analyze harmonies and compare to previous set of harmonies
	var oldHarmonies = this.harmonyManager.harmonies;
	this.analyzeHarmonies();

	return this.harmonyManager.hasNewHarmony(player, oldHarmonies);
};

KeyPaiSho.Board.prototype.hasDisharmony = function(boardPoint) {
	if (boardPoint.isType(GATE)) {
		return false;	// Gate never has disharmony
	}

	var tile = boardPoint.tile;
	var clashFound = false;

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
};

KeyPaiSho.Board.prototype.hasDisharmonyLeft = function(tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile() 
		&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
			// debug("CLASHES Left: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
			return true;
		}
	}
};

KeyPaiSho.Board.prototype.hasDisharmonyRight = function(tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile() 
		&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
			// debug("CLASHES Right: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
			return true;
		}
	}
};

KeyPaiSho.Board.prototype.hasDisharmonyUp = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile() 
		&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
			// debug("CLASHES Up: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
			return true;
		}
	}
};

KeyPaiSho.Board.prototype.hasDisharmonyDown = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile() 
		&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
			// debug("CLASHES Down: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
			return true;
		}
	}
};

KeyPaiSho.Board.prototype.getAdjacentPointsPotentialPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
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
		if (!potentialMovePoint.isType(NON_PLAYABLE)) {
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
};

KeyPaiSho.Board.prototype.getAdjacentDiagonalPointsPotentialPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
	var diagonalPoints = [];

	if (!pointAlongTheWay) {
		pointAlongTheWay = originPoint;
	}
	var rowDifference = originPoint.row - pointAlongTheWay.row;
	var colDifference = originPoint.col - pointAlongTheWay.col;

	if (
			(!mustPreserveDirection || (mustPreserveDirection && rowDifference >= 0 && colDifference >= 0))
			&& (pointAlongTheWay.row > 0 && pointAlongTheWay.col > 0)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && rowDifference <= 0 && colDifference <= 0))
			&& (pointAlongTheWay.row < paiShoBoardMaxRowOrCol && pointAlongTheWay.col < paiShoBoardMaxRowOrCol)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference >= 0 && rowDifference <= 0))
			&& (pointAlongTheWay.col > 0 && pointAlongTheWay.row < paiShoBoardMaxRowOrCol)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference <= 0 && rowDifference >= 0))
			&& (pointAlongTheWay.col < paiShoBoardMaxRowOrCol && pointAlongTheWay.row > 0)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}

	return diagonalPoints;
};

KeyPaiSho.Board.prototype.targetPointHasTileThatCanBeCaptured = function(tile, movementInfo, originPoint, targetPoint, isDeploy) {
	return targetPoint.hasTile()
		&& this.canCapture(originPoint, targetPoint);
};

KeyPaiSho.Board.prototype.tileCanCapture = function(tile, movementInfo, fromPoint, targetPoint) {
	return tile.canCapture(targetPoint.tile)
		|| (tile.type === AdevarTileType.secondFace && targetPoint.tile.type === AdevarTileType.hiddenTile);	// Allow attempting to capture HT with any SFT
};

KeyPaiSho.Board.prototype.tileCanMoveThroughPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	// Can also check anything else that restricts tile movement through spaces on the board
	return !targetPoint.hasTile();
};

KeyPaiSho.Board.prototype.canMoveHereMoreEfficientlyAlready = function(boardPoint, distanceRemaining, movementInfo) {
	return boardPoint.getMoveDistanceRemaining(movementInfo) >= distanceRemaining;
};

KeyPaiSho.Board.prototype.getStartPointsFromGatePoint = function(boardPoint) {
	if (boardPoint.isType(GATE)) {
		var moveStartPoints = [];
		if (boardPoint.row === 16 && boardPoint.col === 8) {
			moveStartPoints = [
				this.cells[16][7],
				this.cells[15][7],
				this.cells[15][8],
				this.cells[15][9],
				this.cells[15][10],
				this.cells[16][10]
			];
		} else if (boardPoint.row === 8 && boardPoint.col === 16) {
			moveStartPoints = [
				this.cells[10][16],
				this.cells[10][15],
				this.cells[9][15],
				this.cells[8][15],
				this.cells[7][15],
				this.cells[7][16]
			];
		} else if (boardPoint.row === 0 && boardPoint.col === 8) {
			moveStartPoints = [
				this.cells[1][7],
				this.cells[2][7],
				this.cells[2][8],
				this.cells[2][9],
				this.cells[2][10],
				this.cells[1][10]
			];
		} else if (boardPoint.row === 8 && boardPoint.col === 0) {
			moveStartPoints = [
				this.cells[7][1],
				this.cells[7][2],
				this.cells[8][2],
				this.cells[9][2],
				this.cells[10][2],
				this.cells[10][1]
			];
		} else if (boardPoint.row === 8 && boardPoint.col === 8) {
			moveStartPoints = [
				this.cells[8][8],
				this.cells[8][9],
				this.cells[9][8],
				this.cells[9][9]
			];
		}
		return moveStartPoints;
	}
};

KeyPaiSho.Board.prototype.setPossibleMovePoints = function(boardPointStart) {
	if (boardPointStart.hasTile()) {
		if (boardPointStart.isType(GATE)) {
			var moveStartPoints = this.getStartPointsFromGatePoint(boardPointStart);
			var movingTile = boardPointStart.tile;
			if (boardPointStart.row === 8 && boardPointStart.col === 8) {
				boardPointStart.removeTile();
				this.closeTheGardenGate();
			}
			moveStartPoints.forEach(startPoint => {
				if (!startPoint.hasTile() 
						&& this.tileCanMoveOntoPoint(movingTile, null, startPoint, boardPointStart, boardPointStart)) {
					this.setPointAsPossibleMovement(startPoint, movingTile, boardPointStart);
					this.setPossibleMovesForMovement(
						{
							distance: movingTile.getMoveDistance() - 1,
							orthogonalMovement: movingTile.hasOrthogonalMovement(),
							diagonalMovement: movingTile.hasDiagonalMovement(),
							mustPreserveDirection: movingTile.movementMustPreserveDirection()
						}, startPoint,
						movingTile);
					this.forEachBoardPoint(boardPoint => { boardPoint.clearPossibleMovementTypes(); });
				}
			});
			if (boardPointStart.row === 8 && boardPointStart.col === 8) {
				boardPointStart.putTile(movingTile);
			}
		} else {
			this.setPossibleMovesForMovement(
				{
					distance: boardPointStart.tile.getMoveDistance(),
					orthogonalMovement: boardPointStart.tile.hasOrthogonalMovement(),
					diagonalMovement: boardPointStart.tile.hasDiagonalMovement(),
					mustPreserveDirection: boardPointStart.tile.movementMustPreserveDirection()
				}, boardPointStart);
		}
	}
};

KeyPaiSho.Board.prototype.setPossibleMovesForMovement = function(movementInfo, boardPointStart, tile) {
	if (!tile) {
		tile = boardPointStart.tile;
	}
	if (movementInfo.orthogonalMovement && movementInfo.diagonalMovement && !movementInfo.mustPreserveDirection) {
		this.setPossibleMovementPointsFromMovePoints([boardPointStart], KeyPaiSho.Board.standardPlusDiagonalMovementFunction, tile, movementInfo, boardPointStart, movementInfo.distance, 0);
	} else {
		if (movementInfo.orthogonalMovement) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], KeyPaiSho.Board.standardMovementFunction, tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} if (movementInfo.diagonalMovement) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], KeyPaiSho.Board.diagonalMovementFunction, tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		}
	}
};
KeyPaiSho.Board.standardMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	var mustPreserveDirection = movementInfo.mustPreserveDirection;	// True means the tile couldn't turn as it goes
	return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
};
KeyPaiSho.Board.diagonalMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	var mustPreserveDirection = movementInfo.mustPreserveDirection;
	return board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
};
KeyPaiSho.Board.standardPlusDiagonalMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	/* Preserve direction is not working for this... */
	var mustPreserveDirection = movementInfo.mustPreserveDirection;
	var movePoints = board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
	return movePoints.concat(board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo));
};
KeyPaiSho.Board.prototype.setPossibleMovementPointsFromMovePoints = function(movePoints, nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, distanceRemaining, moveStepNumber) {
	if (distanceRemaining === 0
			|| !movePoints
			|| movePoints.length <= 0) {
		return;	// Complete
	}

	var self = this;
	var nextPointsConfirmed = [];
	movePoints.forEach(function(recentPoint) {
		var nextPossiblePoints = nextPossibleMovementPointsFunction(self, originPoint, recentPoint, movementInfo, moveStepNumber);
		nextPossiblePoints.forEach(function(adjacentPoint) {
			if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
				adjacentPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);
				
				var canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
				
				/* If cannot move through point, then the distance remaining is 0, none! */
				if (!canMoveThroughPoint) {
					adjacentPoint.setMoveDistanceRemaining(movementInfo, 0);
				}
				
				if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint, originPoint)) {
					var movementOk = self.setPointAsPossibleMovement(adjacentPoint, tile, originPoint);
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
};

KeyPaiSho.Board.prototype.setPointAsPossibleMovement = function(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	targetPoint.addType(POSSIBLE_MOVE);
	return true;
};

KeyPaiSho.Board.prototype.tileCanMoveOntoPoint = function(tile, movementInfo, targetPoint, fromPoint, originPoint) {
	return this.couldMoveTileToPoint(tile.ownerName, originPoint, targetPoint, tile);
};

/* KeyPaiSho.Board.prototype.setPossibleMovePointsOld = function(boardPointStart) {
	if (!boardPointStart.hasTile()) {
		return;
	}
	// Apply "possible move point" type to applicable boardPoints
	var player = boardPointStart.tile.ownerName;
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			if (this.canMoveTileToPoint(player, boardPointStart, this.cells[row][col])) {
				this.cells[row][col].addType(POSSIBLE_MOVE);
			}
		}
	}
}; */

KeyPaiSho.Board.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
			boardPoint.clearPossibleMovementTypes();
		});
	});
};

KeyPaiSho.Board.prototype.setOpenGatePossibleMoves = function(player, tile) {
	// Apply "open gate" type to applicable boardPoints
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.isOpenGate()) {
				this.cells[row][col].addType(POSSIBLE_MOVE);
			}

			/* // If Pond, mark surrounding points
			if (tile && bp.hasTile() && bp.tile.accentType === POND) {
				var rowCols = this.getSurroundingRowAndCols(bp);
				for (var i = 0; i < rowCols.length; i++) {
					var surroundingPoint = this.cells[rowCols[i].row][rowCols[i].col];
					if (surroundingPoint.canHoldTile(tile)) {
						surroundingPoint.addType(POSSIBLE_MOVE);
					}
				}
			} */
		}
	}
};

KeyPaiSho.Board.prototype.setCenterPointGatePossibleMove = function(player, tile) {
	var centerPoint = this.openTheGardenGate();
	if (centerPoint) {
		centerPoint.addType(POSSIBLE_MOVE);
	}
};

KeyPaiSho.Board.prototype.openTheGardenGate = function() {
	/* Lotus: Opening The Garden Gate */
	var centerPoint = this.getBoardPoint(8, 8);
	var centerPoint2 = this.getBoardPoint(8, 9);
	var centerPoint3 = this.getBoardPoint(9, 8);
	var centerPoint4 = this.getBoardPoint(9, 9);

	if (!centerPoint.hasTile() && !centerPoint2.hasTile() && !centerPoint3.hasTile() && !centerPoint4.hasTile()) {
		centerPoint.addType(GATE);
		centerPoint2.addType(NON_PLAYABLE);
		centerPoint3.addType(NON_PLAYABLE);
		centerPoint4.addType(NON_PLAYABLE);

		return centerPoint;
	}
};

KeyPaiSho.Board.prototype.closeTheGardenGate = function() {
	var centerPoint = this.getBoardPoint(8, 8);
	var centerPoint2 = this.getBoardPoint(8, 9);
	var centerPoint3 = this.getBoardPoint(9, 8);
	var centerPoint4 = this.getBoardPoint(9, 9);

	if (!centerPoint.hasTile() && !centerPoint2.hasTile() && !centerPoint3.hasTile() && !centerPoint4.hasTile()) {
		centerPoint.removeType(GATE);
		centerPoint2.removeType(NON_PLAYABLE);
		centerPoint3.removeType(NON_PLAYABLE);
		centerPoint4.removeType(NON_PLAYABLE);

		return centerPoint;
	}
};

KeyPaiSho.Board.prototype.getBoardPoint = function(row, col) {
	return this.cells[row] && this.cells[row][col];
};

KeyPaiSho.Board.prototype.playerControlsLessThanTwoGates = function(player) {
	var count = 0;
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.isType(GATE) && bp.hasTile() && bp.tile.ownerName === player) {
				count++;
			}
		}
	}

	return count < 2;
};

KeyPaiSho.Board.prototype.playerHasNoGrowingFlowers = function(player) {
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.isType(GATE) && bp.hasTile() && bp.tile.ownerName === player) {
				return false;
			}
		}
	}

	return true;
};

KeyPaiSho.Board.prototype.playerHasCenterPointGate = function(player) {
	var centerPoint = this.cells[8][8];
	return centerPoint.isType(GATE) 
		&& centerPoint.hasTile() 
		&& centerPoint.tile.ownerName === player;
};

KeyPaiSho.Board.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	// Check each Gate for tile belonging to player, then check gate edge points
	var bpCheckList = [];
	
	var row = 0;
	var col = 8;
	var bp = this.cells[row][col];
	if (bp.hasTile() && bp.tile.ownerName === player) {
		bpCheckList.push(this.cells[row][col - 1]);
		bpCheckList.push(this.cells[row][col + 1]);
	}

	row = 16;
	var bp = this.cells[row][col];
	if (bp.hasTile() && bp.tile.ownerName === player) {
		bpCheckList.push(this.cells[row][col - 1]);
		bpCheckList.push(this.cells[row][col + 1]);
	}

	row = 8;
	col = 0;
	var bp = this.cells[row][col];
	if (bp.hasTile() && bp.tile.ownerName === player) {
		bpCheckList.push(this.cells[row - 1][col]);
		bpCheckList.push(this.cells[row + 1][col]);
	}

	col = 16;
	var bp = this.cells[row][col];
	if (bp.hasTile() && bp.tile.ownerName === player) {
		bpCheckList.push(this.cells[row - 1][col]);
		bpCheckList.push(this.cells[row + 1][col]);
	}

	bpCheckList.forEach(function(bp) {
		if (!bp.hasTile()) {
			bp.addType(POSSIBLE_MOVE);
		}
	});
};

KeyPaiSho.Board.prototype.setGuestGateOpen = function() {
	var row = 16;
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

KeyPaiSho.Board.prototype.revealPossiblePlacementPoints = function(tile) {
	var self = this;

	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			var valid = false;

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
};

KeyPaiSho.Board.prototype.revealBoatBonusPoints = function(boardPoint) {
	if (!boardPoint.hasTile()) {
		return;
	}
	
	var player = boardPoint.tile.ownerName;

	if (newKnotweedRules) {
		// New rules: All surrounding points
		var rowCols = this.getSurroundingRowAndCols(boardPoint);

		for (var i = 0; i < rowCols.length; i++) {
			var boardPointEnd = this.cells[rowCols[i].row][rowCols[i].col];
			if (this.canTransportTileToPointWithBoat(boardPoint, boardPointEnd)) {
				boardPointEnd.addType(POSSIBLE_MOVE);
			}
		}
		return;
	}
	// The rest is old and outdated...
	// Apply "possible move point" type to applicable boardPoints
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var boardPointEnd = this.cells[row][col];
			if (Math.abs(boardPoint.row - boardPointEnd.row) + Math.abs(boardPoint.col - boardPointEnd.col) === 1) {
				if (this.canMoveTileToPoint(player, boardPoint, boardPointEnd)) {
					boardPointEnd.addType(POSSIBLE_MOVE);
				}
			}
		}
	}
};

KeyPaiSho.Board.prototype.getCopy = function() {
	var copyBoard = new KeyPaiSho.Board();

	// cells
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			copyBoard.cells[row][col] = this.cells[row][col].getCopy();
		}
	}

	// playedWhiteLotusTiles
	for (var i = 0; i < this.playedWhiteLotusTiles.length; i++) {
		copyBoard.playedWhiteLotusTiles.push(this.playedWhiteLotusTiles[i].getCopy());
	}

	// Everything else...
	copyBoard.refreshRockRowAndCols();
	copyBoard.analyzeHarmonies();
	
	return copyBoard;
};

KeyPaiSho.Board.prototype.numTilesInGardensForPlayer = function(player) {
	var count = 0;
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.types.length === 1 && bp.hasTile()) {
				if (bp.isType(bp.tile.basicColorName)) {
					count++;
				}
			}
		}
	}
	return count;
};

KeyPaiSho.Board.prototype.numTilesOnBoardForPlayer = function(player) {
	var count = 0;
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile() && bp.tile.ownerName === player) {
				count++;
			}
		}
	}
	return count;
};

KeyPaiSho.Board.prototype.getSurroundness = function(player) {
	var up = 0;
	var hasUp = 0;
	var down = 0;
	var hasDown = 0;
	var left = 0;
	var hasLeft = 0;
	var right = 0;
	var hasRight = 0;
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
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
	var lowest = up;
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
};


