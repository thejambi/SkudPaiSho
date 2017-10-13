// Capture Board

function CaptureBoard() {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	this.winners = [];

	this.hlPlayed = false;
	this.glPlayed = false;
}

CaptureBoard.prototype.brandNew = function() {
	var cells = [];

	cells[0] = this.newRow(9, 
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.gate(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[1] = this.newRow(11, 
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.redWhiteNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(), 
		CaptureBoardPoint.neutral()
		]);

	cells[2] = this.newRow(13, 
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.whiteNeutral(), 
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[3] = this.newRow(15,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.whiteNeutral(), 
		CaptureBoardPoint.white(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[4] = this.newRow(17,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.whiteNeutral(), 
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[5] = this.newRow(17,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.whiteNeutral(), 
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[6] = this.newRow(17,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.whiteNeutral(), 
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[7] = this.newRow(17,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.whiteNeutral(), 
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[8] = this.newRow(17,
		[CaptureBoardPoint.gate(),
		CaptureBoardPoint.redWhiteNeutral(), 
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.redWhiteNeutral(),
		CaptureBoardPoint.gate()
		]);

	cells[9] = this.newRow(17,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.redNeutral(), 
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.whiteNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[10] = this.newRow(17,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.redNeutral(), 
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.whiteNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[11] = this.newRow(17,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.redNeutral(), 
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.whiteNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[12] = this.newRow(17,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.redNeutral(), 
		CaptureBoardPoint.red(),
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.whiteNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[13] = this.newRow(15,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.redNeutral(), 
		CaptureBoardPoint.red(),
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.white(),
		CaptureBoardPoint.whiteNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[14] = this.newRow(13,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.redNeutral(), 
		CaptureBoardPoint.redWhite(),
		CaptureBoardPoint.whiteNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[15] = this.newRow(11,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.redWhiteNeutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	cells[16] = this.newRow(9,
		[CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.gate(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral(),
		CaptureBoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

CaptureBoard.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new CaptureBoardPoint();
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

CaptureBoard.prototype.placeTile = function(tile, notationPoint, extraBoatPoint) {
	this.putTileOnPoint(tile, notationPoint);

	// Things to do after a tile is placed
	this.setPointFlags();
};

CaptureBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

CaptureBoard.prototype.getSurroundingRowAndCols = function(rowAndCol) {
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

CaptureBoard.prototype.getAdjacentRowAndCols = function(rowAndCol) {
	var rowAndCols = [];

	if (rowAndCol.row > 0) {
		rowAndCols.push(this.cells[rowAndCol.row - 1][rowAndCol.col]);
	}
	if (rowAndCol.row < 16) {
		rowAndCols.push(this.cells[rowAndCol.row + 1][rowAndCol.col]);
	}
	if (rowAndCol.col > 0) {
		rowAndCols.push(this.cells[rowAndCol.row][rowAndCol.col - 1]);
	}
	if (rowAndCol.col < 16) {
		rowAndCols.push(this.cells[rowAndCol.row][rowAndCol.col + 1]);
	}

	return rowAndCols;
};

CaptureBoard.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate();
};

CaptureBoard.prototype.getInitialTilePlacementPoints = function(player) {
	// For each tile code, grab the tile and place it on the board in the next initial placement spot
	var bpList = [];
	for (var i = 0; i < 12; i++) {
		var x = -2 + i;
		var y = 2;
		if (i > 9) {
			y += 2;
		} else if (i > 4) {
			y += 1;
		}

		if (i === 10) {
			x = -1;
		} else if (i === 11) {
			x = 1;
		} else if (i > 4) {
			x -= 5;
		}

		if (player === GUEST) {
			y = y * -1;
		}

		var notationPoint = new NotationPoint(x + "," + y);

		// bpList.push(this.cells[notationPoint.rowAndColumn.row][notationPoint.rowAndColumn.col]);
		bpList.push(notationPoint);
	}
	return bpList;
};

CaptureBoard.prototype.placeInitialTiles = function(player, tileList) {
	var notationPointList = this.getInitialTilePlacementPoints(player);
	for (var i = 0; i < 12; i++) {
		this.placeTile(tileList[i], notationPointList[i]);
	}
};

CaptureBoard.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
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

	// // If tile is capturing a White Lotus, there's a winner
	// if (boardPointEnd.hasTile() && boardPointEnd.tile.code === 'L' && tile.ownerName !== boardPointEnd.tile.ownerName) {
	// 	this.winners.push(tile.ownerName);
	// }

	var capturedTile;
	if (boardPointEnd.hasTile()) {
		capturedTile = boardPointEnd.removeTile();
	}

	boardPointEnd.putTile(tile);

	this.setPointFlags();

	return capturedTile;
};

CaptureBoard.prototype.setPointFlags = function() {
	// First, unblock, unprotect
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile()) {
				bp.tile.blocked = false;
				bp.tile.protected = false;
			}
		}
	}
};

CaptureBoard.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	var tile = boardPointStart.tile;
	var otherTile = boardPointEnd.tile;

	return tile.canCapture(otherTile);
};

CaptureBoard.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
	// start point must have a tile
	if (!boardPointStart.hasTile()) {
		return false;
	}

	// Tile must belong to player
	if (boardPointStart.tile.ownerName !== player) {
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

	// Jumping
	if (this.canJump(boardPointStart, boardPointEnd)) {
		return true;
	}

	// Normal tile movement:
	// If endpoint is too far away, that is wrong. Multiply by 2 to account for longest possible diagonal move.
	var numMoves = boardPointStart.tile.getMoveDistance();
	if (Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col) > (numMoves * 2)) {
		// end point is too far away, can't move that far
		return false;
	} else {
		// Move may be possible. But there may be tiles in the way...
		if (!this.verifyAbleToReach(boardPointStart, boardPointEnd, numMoves)) {
			return false;
		}
	}

	// I guess we made it through
	return true;
};

CaptureBoard.prototype.pointsHaveFriendlyTiles = function(bp1, bp2) {
	return bp1.hasTile() 
		&& bp2.hasTile()
		&& bp1.tile.ownerCode === bp2.tile.ownerCode;
};

CaptureBoard.prototype.canJump = function(boardPointStart, boardPointEnd) {
	// Note: Assume can capture target point tile, or target point empty

	var startRow = boardPointStart.row;
	var endRow = boardPointEnd.row;
	var startCol = boardPointStart.col;
	var endCol = boardPointEnd.col;

	if ((startCol === endCol && Math.abs(startRow - endRow) === 2)
		|| (startRow === endRow && Math.abs(startCol - endCol) === 2)
		|| (Math.abs(boardPointStart.row - boardPointEnd.row) === 1
			&& Math.abs(boardPointStart.col - boardPointEnd.col) === 1)) {
		
		if (endRow > startRow) {
			// Jumping to higher number row (down)
			if (this.pointsHaveFriendlyTiles(boardPointStart, this.cells[startRow + 1][startCol])) {
				return true;
			}
		} else if (endRow < startRow) {
			// Jumping to lower number row (up)
			if (this.pointsHaveFriendlyTiles(boardPointStart, this.cells[startRow - 1][startCol])) {
				return true;
			}
		}

		if (endCol > startCol) {
			// Jumping to higher number col (right)
			if (this.pointsHaveFriendlyTiles(boardPointStart, this.cells[startRow][startCol + 1])) {
				return true;
			}
		} else if (endCol < startCol) {
			// Jumping to lower number col (left)
			if (this.pointsHaveFriendlyTiles(boardPointStart, this.cells[startRow][startCol - 1])) {
				return true;
			}
		}
	} else if (Math.abs(boardPointStart.row - boardPointEnd.row) === 2
		&& Math.abs(boardPointStart.col - boardPointEnd.col) === 2) {
		// Row and Col both 2 away, so it's a possible jump along a diagonal
		if (endRow > startRow && endCol > startCol && this.onUpLeftDiagonal(boardPointStart)) {
			// Jumping to higher number row (down) and higher col (right)
			if (this.pointsHaveFriendlyTiles(boardPointStart, this.cells[startRow + 1][startCol + 1])) {
				return true;
			}
		} else if (endRow < startRow && endCol > startCol && this.onUpRightDiagonal(boardPointStart)) {
			// Jumping to lower number row (up) and higher col (right)
			if (this.pointsHaveFriendlyTiles(boardPointStart, this.cells[startRow - 1][startCol + 1])) {
				return true;
			}
		} else if (endRow > startRow && endCol < startCol && this.onUpRightDiagonal(boardPointStart)) {
			// Jumping to higher number row (down) and lower col (left)
			if (this.pointsHaveFriendlyTiles(boardPointStart, this.cells[startRow + 1][startCol - 1])) {
				return true;
			}
		} else if (endRow < startRow && endCol < startCol && this.onUpLeftDiagonal(boardPointStart)) {
			// Jumping to lower number row (up) and lower col (left)
			if (this.pointsHaveFriendlyTiles(boardPointStart, this.cells[startRow - 1][startCol - 1])) {
				return true;
			}
		}
	}

	return false;
};

CaptureBoard.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves) {
  // Recursion!
  return this.pathFound(boardPointStart, boardPointEnd, numMoves);
};

CaptureBoard.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves) {
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
  } else if (minMoves === 2 && this.diagonallyAdjacent(boardPointStart, boardPointEnd)) {
  	return true;
  }

  // Check moving UP
  var nextRow = boardPointStart.row - 1;
  if (this.ableToReachCheck(nextRow, boardPointStart.col, boardPointEnd, numMoves)) {
  	return true;
  }

  // Check moving DOWN
  nextRow = boardPointStart.row + 1;
  if (this.ableToReachCheck(nextRow, boardPointStart.col, boardPointEnd, numMoves)) {
  	return true;
  }

  // Check moving LEFT
  var nextCol = boardPointStart.col - 1;
  if (this.ableToReachCheck(boardPointStart.row, nextCol, boardPointEnd, numMoves)) {
  	return true;
  }

  // Check moving RIGHT
  nextCol = boardPointStart.col + 1;
  if (this.ableToReachCheck(boardPointStart.row, nextCol, boardPointEnd, numMoves)) {
  	return true;
  }

  // TODO: Check Diagonals
  // ---------------------
  if (this.onUpRightDiagonal(boardPointStart)) {
  	// Check up-right
  	nextRow = boardPointStart.row - 1;
  	nextCol = boardPointStart.col + 1;
	if (this.ableToReachCheck(nextRow, nextCol, boardPointEnd, numMoves)) {
		return true;
	}

  	// Check down-left
  	nextRow = boardPointStart.row + 1;
  	nextCol = boardPointStart.col - 1;
  	if (this.ableToReachCheck(nextRow, nextCol, boardPointEnd, numMoves)) {
		return true;
	}
  }
  if (this.onUpLeftDiagonal(boardPointStart)) {
  	// Check up-left
  	nextRow = boardPointStart.row - 1;
  	nextCol = boardPointStart.col - 1;
	if (this.ableToReachCheck(nextRow, nextCol, boardPointEnd, numMoves)) {
		return true;
	}

  	// Check down-right
  	nextRow = boardPointStart.row + 1;
  	nextCol = boardPointStart.col + 1;
  	if (this.ableToReachCheck(nextRow, nextCol, boardPointEnd, numMoves)) {
		return true;
	}
  }
};

CaptureBoard.prototype.ableToReachCheck = function(nextRow, nextCol, boardPointEnd, numMoves) {
	if (nextCol >= 0 && nextCol < 17 && nextRow >= 0 && nextRow < 17) {
		var nextPoint = this.cells[nextRow][nextCol];
		if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1)) {
			return true; // Yay!
		}
	}
	return false;
};

CaptureBoard.prototype.onUpRightDiagonal = function(boardPoint) {
	var notationPoint = new RowAndColumn(boardPoint.row, boardPoint.col).getNotationPoint();
	var x = notationPoint.x;
	var y = notationPoint.y;
	return x - y === 7 || x - y === -7;
};
CaptureBoard.prototype.onUpLeftDiagonal = function(boardPoint) {
	var notationPoint = new RowAndColumn(boardPoint.row, boardPoint.col).getNotationPoint();
	var x = notationPoint.x;
	var y = notationPoint.y;
	return x + y === 7 || x + y === -7;
};
CaptureBoard.prototype.diagonallyAdjacent = function(boardPointStart, boardPointEnd) {
	// If points are on the same diagonal, true
	return (this.onUpRightDiagonal(boardPointStart) && this.onUpRightDiagonal(boardPointEnd))
		|| (this.onUpLeftDiagonal(boardPointStart) && this.onUpLeftDiagonal(boardPointEnd));
};

CaptureBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
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

CaptureBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

CaptureBoard.prototype.getFireLilyPoint = function(player) {
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

CaptureBoard.prototype.setDeployPointsPossibleMoves = function(player, tileCode) {
	// Dragon is special
	if (tileCode === 'D') {
		// Must have Fire Lily
		var fireLilyPoint = this.getFireLilyPoint(player);

		if (!fireLilyPoint) {
			debug("No Fire Lily");
			return;
		}

		for (var row = 0; row < this.cells.length; row++) {
			for (var col = 0; col < this.cells[row].length; col++) {
				var bp = this.cells[row][col];
				if (!bp.hasTile()) {
					if (Math.abs(fireLilyPoint.row - bp.row) + Math.abs(fireLilyPoint.col - bp.col) <= 5) {
						// Point within Fire Lily range
						bp.addType(POSSIBLE_MOVE);
					}
				}
			}
		}

		return;
	}

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (!bp.hasTile()) {
				if (tileCode === 'S') {
					if (bp.isType(GATE)) {
						bp.addType(POSSIBLE_MOVE);
					}
				} else if (!bp.isType(GATE)) {
					bp.addType(POSSIBLE_MOVE);
				}
			}
		}
	}
};

CaptureBoard.prototype.setGuestGateOpen = function() {
	var row = 16;
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

CaptureBoard.prototype.revealPossiblePlacementPoints = function(tile) {
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

CaptureBoard.prototype.getPlayerTilesOnBoard = function(ownerName) {
	var playerTiles = [];
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (boardPoint.hasTile() && boardPoint.tile.ownerName === ownerName) {
				playerTiles.push(boardPoint);
			}
		});
	});
};

CaptureBoard.prototype.checkForEndOfGame = function() {
	// Check each player's tiles remaining on the board. All gone? No more captures possible?
	var hostTiles = this.getPlayerTilesOnBoard(HOST);
	var guestTiles = this.getPlayerTilesOnBoard(GUEST);

	if (hostTiles.length === 0) {
		this.winners.push(GUEST);
	} else if (guestTiles.length === 0) {
		this.winners.push(HOST);
	} else {
		var hostCannotCapture = this.playerCannotCaptureAny(hostTiles, guestTiles);
		var guestCannotCapture = this.playerCannotCaptureAny(guestTiles, hostTiles);
		if (hostCannotCapture || guestCannotCapture) {
			// Most remaining tiles wins
			// Checking >= and not using else to handle tie situation, if that's possible
			if (hostTiles.length >= guestTiles.length) {
				this.winners.push(HOST);
			}
			if (guestTiles.length >= hostTiles.length) {
				this.winners.push(GUEST);
			}
		} else {
			// Host or Guest can still capture
		}
	}
};

// CaptureBoard.prototype.getCopy = function() {
// 	var copyBoard = new CaptureBoard();

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







