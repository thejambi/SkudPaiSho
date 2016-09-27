// Board

function Board() {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	this.harmonyManager = new HarmonyManager();

	this.rockRowAndCols = [];
	this.playedWhiteLotusTiles = [];
	this.winners = [];
}

Board.prototype.brandNew = function () {
	var cells = [];

	cells[0] = this.newRow(9, 
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.gate(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[1] = this.newRow(11, 
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.redWhiteNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(), 
		BoardPoint.neutral()
		]);

	cells[2] = this.newRow(13, 
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.whiteNeutral(), 
		BoardPoint.redWhite(),
		BoardPoint.redNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[3] = this.newRow(15,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.whiteNeutral(), 
		BoardPoint.white(),
		BoardPoint.redWhite(),
		BoardPoint.red(),
		BoardPoint.redNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[4] = this.newRow(17,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.whiteNeutral(), 
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.redWhite(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.redNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[5] = this.newRow(17,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.whiteNeutral(), 
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.redWhite(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.redNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[6] = this.newRow(17,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.whiteNeutral(), 
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.redWhite(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.redNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[7] = this.newRow(17,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.whiteNeutral(), 
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.redWhite(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.redNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[8] = this.newRow(17,
		[BoardPoint.gate(),
		BoardPoint.redWhiteNeutral(), 
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhite(),
		BoardPoint.redWhiteNeutral(),
		BoardPoint.gate()
		]);

	cells[9] = this.newRow(17,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.redNeutral(), 
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.redWhite(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.whiteNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[10] = this.newRow(17,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.redNeutral(), 
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.redWhite(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.whiteNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[11] = this.newRow(17,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.redNeutral(), 
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.redWhite(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.whiteNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[12] = this.newRow(17,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.redNeutral(), 
		BoardPoint.red(),
		BoardPoint.red(),
		BoardPoint.redWhite(),
		BoardPoint.white(),
		BoardPoint.white(),
		BoardPoint.whiteNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[13] = this.newRow(15,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.redNeutral(), 
		BoardPoint.red(),
		BoardPoint.redWhite(),
		BoardPoint.white(),
		BoardPoint.whiteNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[14] = this.newRow(13,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.redNeutral(), 
		BoardPoint.redWhite(),
		BoardPoint.whiteNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[15] = this.newRow(11,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.redWhiteNeutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	cells[16] = this.newRow(9,
		[BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.gate(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral(),
		BoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

Board.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new BoardPoint();
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

Board.prototype.placeTile = function(tile, notationPoint, extraBoatPoint) {
	if (tile.type === ACCENT_TILE) {
		if (tile.accentType === ROCK) {
			this.placeRock(tile, notationPoint);
		} else if (tile.accentType === WHEEL) {
			this.placeWheel(tile, notationPoint);
		} else if (tile.accentType === KNOTWEED) {
			this.placeKnotweed(tile, notationPoint);
		} else if (tile.accentType === BOAT) {
			this.placeBoat(tile, notationPoint, extraBoatPoint);
		}
		this.analyzeHarmonies();
	} else {
		this.putTileOnPoint(tile, notationPoint);
		if (tile.specialFlowerType === WHITE_LOTUS) {
			this.playedWhiteLotusTiles.push(tile);
		}
	}
};

Board.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

Board.prototype.canPlaceRock = function(boardPoint) {
	if (boardPoint.hasTile()) {
		debug("Rock cannot be played on top of another tile");
		return false;
	}
	if (boardPoint.isType(GATE)) {
		return false;
	}
	return true;
}

Board.prototype.placeRock = function(tile, notationPoint) {
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

Board.prototype.canPlaceWheel = function(boardPoint) {
	if (boardPoint.hasTile()) {
		debug("Wheel cannot be played on top of another tile");
		return false;
	}

	if (boardPoint.isType(GATE)) {
		return false;
	}

	// get surrounding RowAndColumn values
	var rowCols = this.getSurroundingRowAndCols(boardPoint);
	// debug(rowCols);

	// Validate.. Wheel must not be next to a Gate or non-playable
	if (rowCols.length < 8) {
		// Not full, means there was non-playable
		// debug("Wheel cannot be played next to a NON-POINT");
		return false;
	}
	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
		if (bp.isType(GATE)) {
			// debug("Wheel cannot be played next to a GATE");
			return false;
		} else if (bp.hasTile() && bp.tile.drained) {
			// debug("wheel no played next to drained tile");
			return false;
		}
	}

	// TODO: A Wheel cannot move a flower into opposite-colored garden

	return true;
};

Board.prototype.placeWheel = function(tile, notationPoint) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	// if (boardPoint.hasTile()) {
	// 	debug("Wheel cannot be played on top of another tile");
	// 	return false;
	// }

	// // get surrounding RowAndColumn values
	var rowCols = this.getSurroundingRowAndCols(rowAndCol);
	// // debug(rowCols);

	// // Validate.. Wheel must not be next to a Gate or non-playable
	// if (rowCols.length < 8) {
	// 	// Not full, means there was non-playable
	// 	debug("Wheel cannot be played next to a NON-POINT");
	// 	return false;
	// }
	// for (var i = 0; i < rowCols.length; i++) {
	// 	var bp = this.cells[rowCols[i].row][rowCols[i].col];
	// 	if (bp.isType(GATE)) {
	// 		debug("Wheel cannot be played next to a GATE");
	// 		return false;
	// 	}
	// }
	if (!this.canPlaceWheel(boardPoint)) {
		return false;
	}

	boardPoint.putTile(tile);

	// Perform rotation: Get results, then place all tiles as needed
	var results = [];
	for (var i = 0; i < rowCols.length; i++) {
		// Save tile and target rowAndCol
		var tile = this.cells[rowCols[i].row][rowCols[i].col].removeTile();
		var targetRowCol = this.getClockwiseRowCol(rowAndCol, rowCols[i]);
		results.push([tile,targetRowCol]);
	}

	debug(rowAndCol.notationPointString);

	// go through and place tiles in target points
	var self = this;
	results.forEach(function(result) {
		var bp = self.cells[result[1].row][result[1].col];
		bp.putTile(result[0]);
	});
	debug("Wheel placed");
};

Board.prototype.canPlaceKnotweed = function(boardPoint) {
	if (boardPoint.hasTile()) {
		// debug("Knotweed cannot be played on top of another tile");
		return false;
	}

	if (boardPoint.isType(GATE)) {
		return false;
	}

	var rowCols = this.getSurroundingRowAndCols(boardPoint);

	// Validate: Must not be played next to Gate
	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
		if (bp.isType(GATE)) {
			// debug("Knotweed cannot be played next to a GATE");
			return false;
		}
	}

	return true;
};

Board.prototype.placeKnotweed = function(tile, notationPoint) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	// if (boardPoint.hasTile()) {
	// 	debug("Knotweed cannot be played on top of another tile");
	// 	return false;
	// }

	var rowCols = this.getSurroundingRowAndCols(rowAndCol);

	// // Validate: Must not be played next to Gate
	// for (var i = 0; i < rowCols.length; i++) {
	// 	var bp = this.cells[rowCols[i].row][rowCols[i].col];
	// 	if (bp.isType(GATE)) {
	// 		debug("Knotweed cannot be played next to a GATE");
	// 		return false;
	// 	}
	// }
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

Board.prototype.canPlaceBoat = function(boardPoint, tile) {
	if (!boardPoint.hasTile()) {
		// debug("Boat always played on top of another tile");
		return false;
	}

	if (boardPoint.tile.ownerName === tile.ownerName) {
		// debug("Cannot play BOAT on own tile");
		return false;
	}

	if (boardPoint.tile.type === ACCENT_TILE) {
		if (boardPoint.tile.accentType !== KNOTWEED) {
			// debug("Not played on Knotweed tile");
			return false;
		}
	} else if (boardPoint.tile.type !== BASIC_FLOWER) {
		return false;
	}

	return true;
};

Board.prototype.placeBoat = function(tile, notationPoint, extraBoatPoint) {
	// debug("extra boat point:");
	// debug(extraBoatPoint);
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	// if (!boardPoint.hasTile()) {
	// 	debug("Boat always played on top of another tile");
	// 	return false;
	// }

	// if (boardPoint.tile.ownerName === tile.ownerName) {
	// 	debug("Cannot play BOAT on own tile");
	// 	return false;
	// }

	if (!this.canPlaceBoat(boardPoint, tile)) {
		return false;
	}

	if (boardPoint.tile.type === ACCENT_TILE) {
		// if (boardPoint.tile.accentType !== KNOTWEED) {
		// 	debug("Not played on Knotweed tile");
		// 	return false;
		// }
		// Validated as Knotweed

		boardPoint.putTile(tile);

		var rowCols = this.getSurroundingRowAndCols(rowAndCol);
		// "Restore" surrounding tiles
		for (var i = 0; i < rowCols.length; i++) {
			var bp = this.cells[rowCols[i].row][rowCols[i].col];
			bp.restoreTile();
		}
	} else if (boardPoint.tile.type === BASIC_FLOWER) {
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
};

Board.prototype.getClockwiseRowCol = function(center, rowCol) {
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

Board.prototype.getSurroundingRowAndCols = function(rowAndCol) {
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

Board.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate();
};

Board.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
		debug("That point does not exist. So it's not gonna happen.");
		return false;
	}

	var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
	var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

	if (!this.canMoveTileToPoint(player, boardPointStart, boardPointEnd)) {
		debug("Bad move bears");
		return false;
	}

	var tile = boardPointStart.removeTile();

	if (!tile) {
		debug("Error: No tile to move!");
	}

	var error = boardPointEnd.putTile(tile);

	if (error) {
		debug("Error moving tile. It probably didn't get moved.");
		return false;
	}

	// Check for tile "trapped" by opponent Orchid
	this.flagAllTrappedTiles();

	// Check for harmonies
	return this.hasNewHarmony(player, tile, startRowCol, endRowCol);
};

Board.prototype.flagAllTrappedTiles = function() {
	// First, untrap
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile()) {
				bp.tile.trapped = false;
			}
		}
	}
	// Find Orchid tiles, then check surrounding opposite-player Basic Flower tiles and flag them
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			this.trapTilesSurroundingPointIfNeeded(bp);
		}
	}
};

Board.prototype.trapTilesSurroundingPointIfNeeded = function(boardPoint) {
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
		if (bp.hasTile()) {
			if (bp.tile.ownerName !== orchidOwner && bp.tile.type === BASIC_FLOWER) {
				bp.tile.trapped = true;
			}
		}
	}
};

Board.prototype.whiteLotusProtected = function(lotusTile) {
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

Board.prototype.orchidCanCapture = function(orchidTile) {
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

Board.prototype.orchidVulnerable = function(orchidTile) {
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

Board.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	var tile = boardPointStart.tile;
	var otherTile = boardPointEnd.tile;

	if (tile.ownerName === otherTile.ownerName) {
		return false;	// Cannot capture own tile
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
	// If vulnerable, it can be captured by basic flower
	if (otherTile.specialFlowerType === ORCHID && tile.type === BASIC_FLOWER) {
		if (this.orchidVulnerable(otherTile)) {
			return true;
		}
	}

	// Can Orchid capture?
	// If so, Orchid can capture basic or special flower
	if (tile.specialFlowerType === ORCHID && otherTile.type !== ACCENT_TILE) {
		if (this.orchidCanCapture(tile)) {
			return true;
		}
	}
};

Board.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
	// start point must have a tile
	if (!boardPointStart.hasTile()) {
		// debug("No tile to move!");
		return false;
	}

	// Tile must belong to player
	if (boardPointStart.tile.ownerName !== player) {
		// debug("You can't move a tile that isn't yours!!!");
		return false;
	}

	if (boardPointStart.tile.drained || boardPointStart.tile.trapped) {
		return false;
	}

	// If endpoint is a Gate, that's wrong.
	if (boardPointEnd.isType(GATE)) {
		// debug("You can't move into a Gate, jerk.");
		return false;
	}
	
	var canCapture = false;
	if (boardPointEnd.hasTile()) {
		// canCapture = boardPointStart.tile.canCapture(boardPointEnd.tile);
		canCapture = this.canCapture(boardPointStart, boardPointEnd);
	}

	// If endpoint has a tile there that can't be captured, that is wrong.
	if (boardPointEnd.hasTile() && !canCapture) {
		// debug("Can't move there, point already occupied and you can't capture");
		return false;
	}

	if (!boardPointEnd.canHoldTile(boardPointStart.tile) && !canCapture) {
		// debug("I found reasons you can't move tehre, OK????");
		return false;
	}

	// Cannot move into Disharmony
	// (Passing BoardPoint object, but it has the same row and col values as RowAndCol???)
	if (this.hasDisharmony(boardPointStart.tile, boardPointEnd) && !canCapture) {
		// debug("DISHARMONY found, cannot move.");
		return false;
	}

	// If endpoint is too far away, that is wrong.
	// get num Moves
	var numMoves = boardPointStart.tile.getMoveDistance();
	// (8,0)-(6,-3) : 8-6 + 0-(-3) = 5
	if (Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col) > numMoves) {
		// debug("Tile cannot move that far! NOOOOOO");
		return false;
	} else {
		// We know it's not impossible. But there may be tiles in the way...
		if (!this.verifyAbleToReach(boardPointStart, boardPointEnd, numMoves)) {
			debug("Tiles are in the way, so you can't reach that spot.");
			return false;
		}
	}

	// I guess we made it through
	return true;
};

Board.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves) {
  // Oh boy. Check all possible paths!

  // Recursion!
  return this.pathFound(boardPointStart, boardPointEnd, numMoves);
};

Board.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves) {
  if (!boardPointStart || !boardPointEnd) {
    return false; // start or end point not given
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

Board.prototype.rowBlockedByRock = function(rowNum) {
	var blocked = false;
	this.rockRowAndCols.forEach(function(rowAndCol) {
		if (rowAndCol.row === rowNum) {
			blocked = true;
		}
	});
	return blocked;
};

Board.prototype.columnBlockedByRock = function(colNum) {
	var blocked = false;
	this.rockRowAndCols.forEach(function(rowAndCol) {
		if (rowAndCol.col === colNum) {
			blocked = true;
		}
	});
	return blocked;
};

Board.prototype.analyzeHarmonies = function() {
	// We're going to find all harmonies on the board

	// Check along all rows, then along all columns.. Or just check all tiles?
	this.harmonyManager.clearList();

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var boardPoint = this.cells[row][col];
			if (boardPoint.hasTile()) {
				// Check for harmonies!
				var tileHarmonies = this.getTileHarmonies(boardPoint.tile, new RowAndColumn(row, col));
				// Add harmonies
				this.harmonyManager.addHarmonies(tileHarmonies);

				boardPoint.tile.inHarmony = tileHarmonies.length > 0;
			}
		}
	}

	this.harmonyManager.printHarmonies();

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
	// if (this.harmonyManager.harmonyRingExists()) {
	// 	debug("!!! WE HAVE A WINNER !!!");
	// }
};

Board.prototype.getTileHarmonies = function(tile, rowAndCol) {
	var tileHarmonies = [];

	if (this.cells[rowAndCol.row][rowAndCol.col].isType(GATE)) {
		return tileHarmonies;
	}

	if (!this.rowBlockedByRock(rowAndCol.row)) {
		var leftHarmony = this.getHarmonyLeft(tile, rowAndCol);
		if (leftHarmony) {
			tileHarmonies.push(leftHarmony);
		}

		var rightHarmony = this.getHarmonyRight(tile, rowAndCol);
		if (rightHarmony) {
			tileHarmonies.push(rightHarmony);
		}
	}

	if (!this.columnBlockedByRock(rowAndCol.col)) {
		var upHarmony = this.getHarmonyUp(tile, rowAndCol);
		if (upHarmony) {
			tileHarmonies.push(upHarmony);
		}

		var downHarmony = this.getHarmonyDown(tile, rowAndCol);
		if (downHarmony) {
			tileHarmonies.push(downHarmony);
		}
	}

	return tileHarmonies;
};

Board.prototype.getHarmonyLeft = function(tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

Board.prototype.getHarmonyRight = function(tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

Board.prototype.getHarmonyUp = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

Board.prototype.getHarmonyDown = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

Board.prototype.hasNewHarmony = function(player, tile, startRowCol, endRowCol) {
	// To check if new harmony, first analyze harmonies and compare to previous set of harmonies
	var oldHarmonies = this.harmonyManager.harmonies;
	this.analyzeHarmonies();

	return this.harmonyManager.hasNewHarmony(player, oldHarmonies);
};

Board.prototype.hasDisharmony = function(tile, endRowCol) {
	var clashFound = false;

	if (this.hasDisharmonyLeft(tile, endRowCol)) {
		clashFound = true;
	}

	if (this.hasDisharmonyRight(tile, endRowCol)) {
		clashFound = true;
	}

	if (this.hasDisharmonyUp(tile, endRowCol)) {
		clashFound = true;
	}

	if (this.hasDisharmonyDown(tile, endRowCol)) {
		clashFound = true;
	}

	return clashFound;
};

Board.prototype.hasDisharmonyLeft = function(tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
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

Board.prototype.hasDisharmonyRight = function(tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
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

Board.prototype.hasDisharmonyUp = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
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

Board.prototype.hasDisharmonyDown = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
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

Board.prototype.setPossibleMovePoints = function(boardPointStart) {
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
};

Board.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

Board.prototype.setOpenGatePossibleMoves = function() {
	// Apply "open gate" type to applicable boardPoints
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			if (this.cells[row][col].isOpenGate()) {
				this.cells[row][col].addType(POSSIBLE_MOVE);
			}
		}
	}
};

Board.prototype.setGuestGateOpen = function() {
	var row = 16;
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

Board.prototype.revealPossiblePlacementPoints = function(tile) {
	var self = this;
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			var valid = false;

			if (tile.accentType === ROCK && self.canPlaceRock(boardPoint)) {
				valid = true;
			} else if (tile.accentType === WHEEL && self.canPlaceWheel(boardPoint)) {
				valid = true;
			} else if (tile.accentType === KNOTWEED && self.canPlaceKnotweed(boardPoint)) {
				valid = true;
			} else if (tile.accentType === BOAT && self.canPlaceBoat(boardPoint, tile)) {
				valid = true;
			}

			if (valid) {
				boardPoint.addType(POSSIBLE_MOVE);
			}
		});
	});
};

Board.prototype.revealBoatBonusPoints = function(boardPoint) {
	if (!boardPoint.hasTile()) {
		return;
	}
	// Apply "possible move point" type to applicable boardPoints
	var player = boardPoint.tile.ownerName;
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








