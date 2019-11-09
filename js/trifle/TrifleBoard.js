// Trifle Board

function TrifleBoard() {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	this.winners = [];

	this.hlPlayed = false;
	this.glPlayed = false;
}

TrifleBoard.prototype.brandNew = function () {
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
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

TrifleBoard.prototype.newRow = function(numColumns, points) {
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
};

TrifleBoard.prototype.placeTile = function(tile, notationPoint) {
	this.putTileOnPoint(tile, notationPoint);

	if (tile.code === 'L') {
		if (tile.ownerName === HOST) {
			this.hlPlayed = true;
		} else {
			this.glPlayed = true;
		}
	}

	// Things to do after a tile is placed
	this.setPointFlags();
};

TrifleBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

TrifleBoard.prototype.getSurroundingRowAndCols = function(rowAndCol) {
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

TrifleBoard.prototype.getSurroundingBoardPoints = function(initialBoardPoint) {
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
};

TrifleBoard.prototype.getAdjacentRowAndCols = function(rowAndCol) {
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
};
TrifleBoard.prototype.getAdjacentPoints = function(boardPointStart) {
	return this.getAdjacentRowAndCols(boardPointStart);
};

TrifleBoard.prototype.getAdjacentDiagonalPoints = function(pointAlongTheWay, originPoint) {
	var diagonalPoints = [];

	if (!pointAlongTheWay) {
		pointAlongTheWay = originPoint;
	}
	var rowDifference = originPoint.row - pointAlongTheWay.row;
	var colDifference = originPoint.col - pointAlongTheWay.col;

	if (rowDifference >= 0 && colDifference >= 0
			&& pointAlongTheWay.row > 0 && pointAlongTheWay.col > 0) {
		var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (rowDifference <= 0 && colDifference <= 0
			&& pointAlongTheWay.row < paiShoBoardMaxRowOrCol && pointAlongTheWay.col < paiShoBoardMaxRowOrCol) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (colDifference >= 0 && rowDifference <= 0
			&& pointAlongTheWay.col > 0 && pointAlongTheWay.row < paiShoBoardMaxRowOrCol) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (colDifference <= 0 && rowDifference >= 0
			&& pointAlongTheWay.col < paiShoBoardMaxRowOrCol && pointAlongTheWay.row > 0) {
		var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}

	return diagonalPoints;
};

TrifleBoard.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate();
};

TrifleBoard.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
		debug("That point does not exist. So it's not gonna happen.");
		return false;
	}

	var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
	var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

	// if (!this.canMoveTileToPoint(player, boardPointStart, boardPointEnd)) {
	// 	debug("Bad move bears");
	// 	showBadMoveModal();
	// 	return false;
	// }

	var tile = boardPointStart.removeTile();

	if (!tile) {
		debug("Error: No tile to move!");
	}

	// If tile is capturing a White Lotus, there's a winner
	if (boardPointEnd.hasTile() && boardPointEnd.tile.code === 'L' && tile.ownerName !== boardPointEnd.tile.ownerName) {
		this.winners.push(tile.ownerName);
	}

	boardPointEnd.putTile(tile);

	this.setPointFlags();
};

TrifleBoard.prototype.setPointFlags = function() {
	// // First, unblock, unprotect
	// for (var row = 0; row < this.cells.length; row++) {
	// 	for (var col = 0; col < this.cells[row].length; col++) {
	// 		var bp = this.cells[row][col];
	// 		if (bp.hasTile()) {
	// 			bp.tile.blocked = false;
	// 			bp.tile.protected = false;
	// 		}
	// 	}
	// }
	// // Find Chrysanthemum tiles, then check surrounding Bison tiles to set them as blocked
	// for (var row = 0; row < this.cells.length; row++) {
	// 	for (var col = 0; col < this.cells[row].length; col++) {
	// 		var bp = this.cells[row][col];
	// 		this.blockTilesAdjacentToPointIfNeeded(bp);
	// 		this.protectTilesAdjacentToPointIfNeeded(bp);
	// 	}
	// }
};

// TrifleBoard.prototype.blockTilesAdjacentToPointIfNeeded = function(boardPoint) {
// 	if (!boardPoint.hasTile()) {
// 		return;
// 	}
// 	if (boardPoint.tile.code !== 'C') {
// 		return;
// 	}

// 	// Chrysanthemum blocks opponent's Sky Bison

// 	var chrysanthemumOwner = boardPoint.tile.ownerName;

// 	var rowCols = this.getAdjacentRowAndCols(boardPoint);

// 	for (var i = 0; i < rowCols.length; i++) {
// 		var bp = this.cells[rowCols[i].row][rowCols[i].col];
// 		if (bp.hasTile()) {
// 			if (bp.tile.code === 'S' && bp.tile.ownerName !== chrysanthemumOwner) {
// 				bp.tile.blocked = true;
// 			}
// 		}
// 	}
// };

// TrifleBoard.prototype.protectTilesAdjacentToPointIfNeeded = function(boardPoint) {
// 	if (!boardPoint.hasTile()) {
// 		return;
// 	}
// 	if (boardPoint.tile.code !== 'B') {
// 		return;
// 	}

// 	/* Badgermole protects same player's Flower Tiles */

// 	var badgermoleOwner = boardPoint.tile.ownerName;

// 	var rowCols = this.getAdjacentRowAndCols(boardPoint);

// 	for (var i = 0; i < rowCols.length; i++) {
// 		var bp = this.cells[rowCols[i].row][rowCols[i].col];
// 		if (bp.hasTile()) {
// 			if (bp.tile.isFlowerTile() && bp.tile.ownerName === badgermoleOwner) {
// 				bp.tile.protected = true;
// 			}
// 		}
// 	}
// };

TrifleBoard.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	var tile = boardPointStart.tile;
	var otherTile = boardPointEnd.tile;

	if (tile.ownerName === otherTile.ownerName) {
		return false;	// Cannot capture own tile
	}

	if (otherTile.protected) {
		return false;	// Cannot capture protected tiles
	}

	// Is tile even a tile that can capture at all?
	if (!tile.hasCaptureAbility()) {
		debug(tile.getName() + " cannot capture anything.");
		return false;
	}

	// TODO Check if tile is protected from capture...
	//

	var playerLotusPlayed = this.hlPlayed;
	var otherLotusPlayed = this.glPlayed;
	if (tile.ownerName === GUEST) {
		playerLotusPlayed = this.glPlayed;
		otherLotusPlayed = this.hlPlayed;
	}

	// Okay, so the tile is a tile that is able to capture things... 
	// Can the player capture Flower Tiles? (if they've played Lotus)
	if (otherTile.isFlowerTile()) {
		return playerLotusPlayed;
	} else {
		return playerLotusPlayed && otherLotusPlayed;
	}
};

TrifleBoard.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
	// start point must have a tile
	if (!boardPointStart.hasTile()) {
		return false;
	}

	// Tile must belong to player
	if (boardPointStart.tile.ownerName !== player) {
		return false;
	}

	// Cannot move blocked tile (Bison blocked by Chrysanthemum)
	// if (boardPointStart.tile.blocked) {
	// 	return false;
	// }
	
	var canCapture = false;
	if (boardPointEnd.hasTile()) {
		canCapture = this.canCapture(boardPointStart, boardPointEnd);
	}

	// If endpoint is a Gate with no tile, that's wrong.
	if (!boardPointEnd.hasTile() && boardPointEnd.isType(GATE)) {
		return false;
	}

	// If endpoint has a tile there that can't be captured, that is wrong.
	if (boardPointEnd.hasTile() && !canCapture) {
		return false;
	}

	// Sky Bison special: Cannot move into other Bison "zone"
	// if (boardPointStart.tile.code === 'S') {
	// 	// If overlaps with another Bison zone, return false
	// 	// Get all other Sky Bison tiles, check their zones
	// 	var bisons = [];	// Incorrect plural is an LOK reference
	// 	for (var row = 0; row < this.cells.length; row++) {
	// 		for (var col = 0; col < this.cells[row].length; col++) {
	// 			var bp = this.cells[row][col];
	// 			if (bp.hasTile() && bp.tile.code === 'S' && bp.tile.id !== boardPointStart.tile.id && !bp.isType(GATE) && !bp.tile.blocked
	// 				&& bp.tile.ownerCode != boardPointStart.tile.ownerCode) {
	// 				bisons.push(bp);
	// 			}
	// 		}
	// 	}

	// 	for (var i = 0; i < bisons.length; i++) {
	// 		if (Math.abs(bisons[i].row - boardPointEnd.row) + Math.abs(bisons[i].col - boardPointEnd.col) <= 6) {
	// 			return false;
	// 		}
	// 	}
	// }

	// Dragon special: Can move within Fire Lily range
	if (boardPointStart.tile.code === 'D') {
		// Must have Fire Lily
		var fireLilyPoints = this.getFireLilyPoints(boardPointStart.tile.ownerName);

		if (!fireLilyPoints || fireLilyPoints.length === 0) {
			debug("No Fire Lily");
			return false;
		}

		var closeFireLilyPoints = [];
		for (var i = 0; i < fireLilyPoints.length; i++) {
			var fp = fireLilyPoints[i];
			var dist = Math.abs(fp.row - boardPointStart.row) + Math.abs(fp.col - boardPointStart.col);
			if (dist <= 5) {
				closeFireLilyPoints.push(fp);
			}
		}

		for (var i = 0; i < closeFireLilyPoints.length; i++) {
			var fireLilyPoint = closeFireLilyPoints[i];
			if (Math.abs(fireLilyPoint.row - boardPointEnd.row) + Math.abs(fireLilyPoint.col - boardPointEnd.col) <= 5) {
				// Point inside Fire Lily range
				return true;
			}
		}
		// If we haven't returned true, we need to return false here
		return false;
	}

	// Wheel
	if (boardPointStart.tile.code === 'W') {
		var bp = boardPointStart;
		var bp2 = boardPointEnd;
		if (bp.row - bp.col === bp2.row - bp2.col) {
			// Up or Down
			// Verify no tiles in the way
			var rowStart = bp.row + 1;
			var rowEnd = bp2.row;
			if (bp.row > bp2.row) {
				rowStart = bp2.row + 1;
				rowEnd = bp.row;
			}

			// Scan for tile in the way from start to end point
			for (var row = rowStart; row < rowEnd; row++) {
				var col = row - (bp.row - bp.col);
				if (this.cells[row][col].hasTile()) {
					return false;
				}
			}

			return true;
		} else if (bp.row + bp.col === bp2.row + bp2.col) {
			// Left or Right
			// Verify no tiles in the way
			var rowStart = bp.row + 1;
			var rowEnd = bp2.row;
			if (bp.row > bp2.row) {
				rowStart = bp2.row + 1;
				rowEnd = bp.row;
			}

			if (bp2.row === 5 && bp2.col === 5) {
				debug("hi");
			}

			// Scan for tile in the way from start to end point
			for (var row = rowStart; row < rowEnd; row++) {
				var col = bp.row + bp.col - row;
				if (this.cells[row][col].hasTile()) {
					return false;
				}
			}

			return true;
		} else {
			return false;
		}
	}

	/* Special for Badgermole */
	if (boardPointStart.tile.code === 'B') {
		/* Can move directly next to Flower Tile if in line
		Is there a Flower Tile next to this end point? */
		if (this.inLineWithAdjacentFlowerTileWithNothingBetween(boardPointStart, boardPointEnd)) {
			return true;
		}
	}

	if (boardPointStart.tile.code === TrifleTileCodes.MessengerHawk) {
		/* Can move anywhere, cannot capture */
		return !boardPointEnd.hasTile();
	}

	// Normal tile movement:
	// If endpoint is too far away, that is wrong.
	var numMoves = boardPointStart.tile.getMoveDistance();
	if (Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col) > numMoves) {
		// end point is too far away, can't move that far
		return false;
	} else {
		// Move may be possible. But there may be tiles in the way...
		if (!this.verifyAbleToReach(boardPointStart, boardPointEnd, numMoves, boardPointStart.tile)) {
			return false;
		}
	}

	// I guess we made it through
	return true;
};

TrifleBoard.prototype.inLineWithAdjacentFlowerTileWithNothingBetween = function(bp, bp2) {
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
};

TrifleBoard.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves, movingTile) {
  // Recursion!
  return this.pathFound(boardPointStart, boardPointEnd, numMoves, movingTile);
};

TrifleBoard.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves, movingTile) {
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

	// If this point is surrounded by a Chrysanthemum and moving tile is Sky Bison, cannot keep moving.
	if (movingTile.code === 'S' && this.pointIsNextToOpponentTile(boardPointStart, movingTile.ownerCode, 'C')) {
		return false;
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
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, movingTile)) {
      return true; // Yay!
    }
  }

  // Check moving DOWN
  nextRow = boardPointStart.row + 1;
  if (nextRow < 17) {
    var nextPoint = this.cells[nextRow][boardPointStart.col];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, movingTile)) {
      return true; // Yay!
    }
  }

  // Check moving LEFT
  var nextCol = boardPointStart.col - 1;
  if (nextCol >= 0) {
    var nextPoint = this.cells[boardPointStart.row][nextCol];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, movingTile)) {
      return true; // Yay!
    }
  }

  // Check moving RIGHT
  nextCol = boardPointStart.col + 1;
  if (nextCol < 17) {
    var nextPoint = this.cells[boardPointStart.row][nextCol];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, movingTile)) {
      return true; // Yay!
    }
  }
};

TrifleBoard.prototype.pointIsNextToOpponentTile = function(bp, originalPlayerCode, tileCode) {
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

TrifleBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
	if (boardPointStart.hasTile()) {
		var player = boardPointStart.tile.ownerName;

		var tileInfo = TrifleTiles[boardPointStart.tile.code];
		if (tileInfo) {
			var self = this;
			tileInfo.movements.forEach(function(movementInfo) {
				self.setPossibleMovesForMovement(movementInfo, boardPointStart);
			});
		}
	}
};

TrifleBoard.prototype.setPossibleMovesForMovement = function(movementInfo, boardPointStart) {
	var isImmobilized = this.tileMovementIsImmobilized(boardPointStart.tile, movementInfo, boardPointStart);
	if (!isImmobilized) {
		if (movementInfo.type === MovementType.standard) {
			/* Standard movement, moving and turning as you go */
			this.setPossibleMovementPoints(TrifleBoard.standardMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, boardPointStart, movementInfo.distance);
		} else if (movementInfo.type === MovementType.diagonal) {
			/* Diagonal movement, jumping across the lines up/down/left/right as looking at the board */
			this.setPossibleMovementPoints(TrifleBoard.diagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, boardPointStart, movementInfo.distance);
		}
	}
};

TrifleBoard.standardMovementFunction = function(board, originPoint, boardPointAlongTheWay) {
	return board.getAdjacentPoints(boardPointAlongTheWay);
};
TrifleBoard.diagonalMovementFunction = function(board, originPoint, boardPointAlongTheWay) {
	return board.getAdjacentDiagonalPoints(boardPointAlongTheWay, originPoint);
};

TrifleBoard.prototype.setPossibleMovementPoints = function(nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, recentPoint, distanceRemaining) {
	if (distanceRemaining === 0) {
		return;	// Complete
	}

	var self = this;
	nextPossibleMovementPointsFunction(self, originPoint, recentPoint).forEach(function(adjacentPoint) {
		if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining)) {
			if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
				adjacentPoint.addType(POSSIBLE_MOVE);
				adjacentPoint.standardMoveDistanceRemaining = distanceRemaining;
				self.setPossibleMovementPoints(nextPossibleMovementPointsFunction, 
						tile, 
						movementInfo, 
						originPoint,
						adjacentPoint, 
						distanceRemaining - 1);
			}
		}
	});
};

TrifleBoard.prototype.tileMovementIsImmobilized = function(tile, movementInfo, boardPointStart) {
	var isImmobilized = false;
	if (tile && movementInfo.restrictions) {
		var self = this;
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === MovementRestriction.immobilizedByOpponentTileZones) {
				movementRestriction.affectingTiles.forEach(function(affectingTileCode) {
					isImmobilized = self.pointIsInOpponentTileZone(boardPointStart, tile.ownerName, affectingTileCode);
				});
			}
		});
	}
	return isImmobilized;
};

TrifleBoard.prototype.pointIsInOpponentTileZone = function(boardPoint, ownerName, targetTileCode) {
	var insideOpponentTileZone = false;
	var opponentTileInfo = TrifleTiles[targetTileCode];
	if (opponentTileInfo && opponentTileInfo.territorialZoneSize && opponentTileInfo.territorialZoneSize > 0) {
		var targetTilePoints = this.getTilePoints(targetTileCode, getOpponentName(ownerName));
		if (targetTilePoints.length > 0) {
			targetTilePoints.forEach(function(targetTilePoint) {
				var distanceAway = Math.abs(targetTilePoint.row - boardPoint.row) + Math.abs(targetTilePoint.col - boardPoint.col);
				if (distanceAway <= opponentTileInfo.territorialZoneSize) {
					insideOpponentTileZone = true;
					return;
				}
			});
		}
	}
	return insideOpponentTileZone;
};

TrifleBoard.prototype.getTilePoints = function(tileCode, ownerName) {
	var points = [];
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()
				&& boardPoint.tile.code === tileCode
				&& boardPoint.tile.ownerName === ownerName) {
			points.push(boardPoint);
		}
	});
	return points;
};

TrifleBoard.prototype.canMoveHereMoreEfficientlyAlready = function(boardPoint, distanceRemaining) {
	return boardPoint.isType(POSSIBLE_MOVE)
		&& boardPoint.standardMoveDistanceRemaining > distanceRemaining;
};

TrifleBoard.prototype.tileCanMoveOntoPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	var tileInfo = TrifleTiles[tile.code];
	return !targetPoint.hasTile()
		&& !this.tileZonedOutOfSpace(tile, movementInfo, targetPoint)
		&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint);
};

TrifleBoard.prototype.tileZonedOutOfSpace = function(tile, movementInfo, targetPoint) {
	var isZonedOut = false;
	if (movementInfo.restrictions && movementInfo.restrictions.length > 0) {
		var self = this;
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === MovementRestriction.restrictedByOpponentTileZones) {
				movementRestriction.affectingTiles.forEach(function(affectingTileCode) {
					isZonedOut = self.pointIsInOpponentTileZone(targetPoint, tile.ownerName, affectingTileCode);
				});
			}
		});
	}
	return isZonedOut;
};

TrifleBoard.prototype.tileInfoHasMovementType = function(tileInfo, movementType) {
	var movementTypeFound = false;
	tileInfo.movements.forEach(function(movementInfo) {
		if (movementInfo.type === movementType) {
			movementTypeFound = true;
		}
	});
	return movementTypeFound;
};

TrifleBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
			boardPoint.standardMoveDistanceRemaining = 0;
		});
	});
};

TrifleBoard.prototype.getFireLilyPoint = function(player) {
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
};

TrifleBoard.prototype.getFireLilyPoints = function(player) {
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
};

TrifleBoard.prototype.setDeployPointsPossibleMoves = function(player, tileCode) {
	var tileInfo = TrifleTiles[tileCode];
	if (!tileInfo) {
		debug("You need the tileInfo for " + tileCode);
	}

	// Dragon is special
	if (tileCode === 'D') {
		// Must have Fire Lily
		var fireLilyPoints = this.getFireLilyPoints(player);

		if (!fireLilyPoints || fireLilyPoints.length === 0) {
			debug("No Fire Lily");
			return;
		}

		for (var i = 0; i < fireLilyPoints.length; i++) {
			var fireLilyPoint = fireLilyPoints[i];
			for (var row = 0; row < this.cells.length; row++) {
				for (var col = 0; col < this.cells[row].length; col++) {
					var bp = this.cells[row][col];
					if (!bp.isType(GATE) && !bp.hasTile()) {
						if (Math.abs(fireLilyPoint.row - bp.row) + Math.abs(fireLilyPoint.col - bp.col) <= 5) {
							// Point within Fire Lily range
							bp.addType(POSSIBLE_MOVE);
						}
					}
				}
			}
		}

		return;
	}

	if (tileInfo && tileInfo.deployTypes.includes(DeployType.anywhere)) {
		this.forEachBoardPoint(function(boardPoint) {
			if (!boardPoint.hasTile()
					&& !boardPoint.isType(GATE)) {
				boardPoint.addType(POSSIBLE_MOVE);
			}
		});
	}

	if (tileInfo && tileInfo.deployTypes.includes(DeployType.temple)) {
		this.forEachBoardPoint(function(boardPoint) {
			if (!boardPoint.hasTile()
					&& boardPoint.isType(GATE)) {
				boardPoint.addType(POSSIBLE_MOVE);
			}
		});
	}
};

TrifleBoard.prototype.forEachBoardPoint = function(forEachFunc) {
	this.cells.forEach(function(row) {
		row.forEach(forEachFunc);
	});
};

TrifleBoard.prototype.setGuestGateOpen = function() {
	var row = 16;
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

// TrifleBoard.prototype.getCopy = function() {
// 	var copyBoard = new Board();

// 	/*
// 	this.cells = this.brandNew();

// 	this.rockRowAndCols = [];	// call refreshRockRowAndCo...
// 	this.playedWhiteLotusTiles = [];
// 	this.winners = [];	// call analyzeHarmon...
// 	*/

// 	// cells
// 	for (var row = 0; row < this.cells.length; row++) {
// 		for (var col = 0; col < this.cells[row].length; col++) {
// 			copyBoard.cells[row][col] = this.cells[row][col].getCopy();
// 		}
// 	}

// 	// playedWhiteLotusTiles
// 	for (var i = 0; i < this.playedWhiteLotusTiles.length; i++) {
// 		copyBoard.playedWhiteLotusTiles.push(this.playedWhiteLotusTiles[i].getCopy());
// 	}
	
// 	return copyBoard;
// };







