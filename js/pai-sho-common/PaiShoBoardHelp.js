
var paiShoBoardMaxRowOrCol = 16;

function PaiShoBoardHelper(boardPointClass, size) {
	this.boardPointClass = boardPointClass;
	this.size = size;
}

PaiShoBoardHelper.prototype.putTileOnPoint = function(tile, notationPoint, cells) {
	var point = notationPoint.rowAndColumn;
	point = cells[point.row][point.col];
	
	point.putTile(tile);
};

PaiShoBoardHelper.prototype.isValidRowCol = function(rowCol) {
	return rowCol.row >= 0 && rowCol.col >= 0 && rowCol.row <= 16 && rowCol.col <= 16;
};

PaiShoBoardHelper.prototype.getClockwiseRowCol = function(center, rowCol) {
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
};

PaiShoBoardHelper.prototype.getSurroundingRowAndCols = function(rowAndCol, cells) {
	var rowAndCols = [];
	for (var row = rowAndCol.row - 1; row <= rowAndCol.row + 1; row++) {
		for (var col = rowAndCol.col - 1; col <= rowAndCol.col + 1; col++) {
			if ((row !== rowAndCol.row || col !== rowAndCol.col)	// Not the center given point
				&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) {	// Not outside range of the grid
				var boardPoint = cells[row][col];
				if (!boardPoint.isType(NON_PLAYABLE)) {	// Not non-playable
					rowAndCols.push(new RowAndColumn(row, col));
				}
			}
		}
	}
	return rowAndCols;
};

PaiShoBoardHelper.prototype.generateBoardCells = function() {
	var cells = [];

	cells[0] = this.newRow(9, 
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.gate(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[1] = this.newRow(11, 
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.redWhiteNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(), 
		this.boardPointClass.neutral()
		]);

	cells[2] = this.newRow(13, 
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.whiteNeutral(), 
		this.boardPointClass.redWhite(),
		this.boardPointClass.redNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[3] = this.newRow(15,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.whiteNeutral(), 
		this.boardPointClass.white(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.red(),
		this.boardPointClass.redNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[4] = this.newRow(17,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.whiteNeutral(), 
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.redNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[5] = this.newRow(17,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.whiteNeutral(), 
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.redNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[6] = this.newRow(17,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.whiteNeutral(), 
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.redNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[7] = this.newRow(17,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.whiteNeutral(), 
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.redNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[8] = this.newRow(17,
		[this.boardPointClass.gate(),
		this.boardPointClass.redWhiteNeutral(), 
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.redWhiteNeutral(),
		this.boardPointClass.gate()
		]);

	cells[9] = this.newRow(17,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.redNeutral(), 
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.whiteNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[10] = this.newRow(17,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.redNeutral(), 
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.whiteNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[11] = this.newRow(17,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.redNeutral(), 
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.whiteNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[12] = this.newRow(17,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.redNeutral(), 
		this.boardPointClass.red(),
		this.boardPointClass.red(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.white(),
		this.boardPointClass.white(),
		this.boardPointClass.whiteNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[13] = this.newRow(15,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.redNeutral(), 
		this.boardPointClass.red(),
		this.boardPointClass.redWhite(),
		this.boardPointClass.white(),
		this.boardPointClass.whiteNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[14] = this.newRow(13,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.redNeutral(), 
		this.boardPointClass.redWhite(),
		this.boardPointClass.whiteNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[15] = this.newRow(11,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.redWhiteNeutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	cells[16] = this.newRow(9,
		[this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.gate(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral(),
		this.boardPointClass.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

PaiShoBoardHelper.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new this.boardPointClass();
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


