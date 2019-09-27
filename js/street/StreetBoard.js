/* Street Pai Sho Board */

function StreetBoard() {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	this.harmonyManager = new StreetHarmonyManager();

	this.winners = [];
	this.ableToReachPointsChecked = [];
	this.debugCount = 0;
}

StreetBoard.prototype.brandNew = function () {
	var cells = [];

	cells[0] = this.newRow(9, 
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		// StreetBoardPoint.gate(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[1] = this.newRow(11, 
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		// StreetBoardPoint.redWhiteNeutral(),
		StreetBoardPoint.gate(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(), 
		StreetBoardPoint.neutral()
		]);

	cells[2] = this.newRow(13, 
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.whiteNeutral(), 
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[3] = this.newRow(15,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.whiteNeutral(), 
		StreetBoardPoint.white(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.red(),
		StreetBoardPoint.redNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[4] = this.newRow(17,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.whiteNeutral(), 
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.redNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[5] = this.newRow(17,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.whiteNeutral(), 
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.redNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[6] = this.newRow(17,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.whiteNeutral(), 
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.redNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[7] = this.newRow(17,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.whiteNeutral(), 
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.redNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[8] = this.newRow(17,
		[StreetBoardPoint.gate(),
		StreetBoardPoint.redWhiteNeutral(), 
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.redWhiteNeutral(),
		StreetBoardPoint.gate()
		]);

	cells[9] = this.newRow(17,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.redNeutral(), 
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.whiteNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[10] = this.newRow(17,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.redNeutral(), 
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.whiteNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[11] = this.newRow(17,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.redNeutral(), 
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.whiteNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[12] = this.newRow(17,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.redNeutral(), 
		StreetBoardPoint.red(),
		StreetBoardPoint.red(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.white(),
		StreetBoardPoint.white(),
		StreetBoardPoint.whiteNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[13] = this.newRow(15,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.redNeutral(), 
		StreetBoardPoint.red(),
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.white(),
		StreetBoardPoint.whiteNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[14] = this.newRow(13,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.redNeutral(), 
		StreetBoardPoint.redWhite(),
		StreetBoardPoint.whiteNeutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[15] = this.newRow(11,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		// StreetBoardPoint.redWhiteNeutral(),
		StreetBoardPoint.gate(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	cells[16] = this.newRow(9,
		[StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		// StreetBoardPoint.gate(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral(),
		StreetBoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

StreetBoard.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new StreetBoardPoint();
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

StreetBoard.prototype.placeTile = function(tile, notationPoint) {
	this.putTileOnPoint(tile, notationPoint);

	// Things to do after a tile is placed
	this.analyzeHarmonies();
};

StreetBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

StreetBoard.prototype.isValidRowCol = function(rowCol) {
	return rowCol.row >= 0 && rowCol.col >= 0 && rowCol.row <= 16 && rowCol.col <= 16;
};

StreetBoard.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate();
};

StreetBoard.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
		debug("That point does not exist. So it's not gonna happen.");
		return false;
	}

	var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
	var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

	if (!this.canMoveTileToPoint(player, boardPointStart, boardPointEnd, false)) {
		debug("Bad move bears");
		showBadMoveModal();
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

	this.analyzeHarmonies();

	return tile;
};

StreetBoard.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	var tile = boardPointStart.tile;
	var otherTile = boardPointEnd.tile;

	if (tile.ownerName === otherTile.ownerName) {
		return false;	// Cannot capture own tile
	}

	if (!tile.capturedTile) {
		return true;
	}
};

StreetBoard.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd, markPossibleAsGo) {
	// start point must have a tile
	if (!boardPointStart.hasTile()) {
		return false;
	}

	// Tile must belong to player
	if (boardPointStart.tile.ownerName !== player) {
		return false;
	}

	if (!newKnotweedRules && boardPointStart.tile.drained) {
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

	if (!gameOptionEnabled(CLASSIC_RULES)) {
		var bonusMoves = boardPointStart.tile.capturedTile ? 1 : 0;
		numMoves += bonusMoves;
	}
	
	if (Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col) > numMoves) {
		// end point is too far away, can't move that far
		return false;
	} else {
		// Move may be possible. But there may be tiles in the way...
		if (!this.verifyAbleToReach(boardPointStart, boardPointEnd, numMoves, player, markPossibleAsGo)) {
			// debug("Tiles are in the way, so you can't reach that spot.");
			return false;
		}
	}

	// I guess we made it through
	return true;
};

StreetBoard.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves, playerMoving, markPossibleAsGo) {
  // Recursion!
  var ableToReach = this.pathFound(boardPointStart, boardPointEnd, numMoves, playerMoving, markPossibleAsGo);
  
  return ableToReach;
};

StreetBoard.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves, playerMoving, markPossibleAsGo, travelDirection) {
  if (!boardPointStart || !boardPointEnd) {
    return false; // start or end point not given
  }

  this.debugCount++;

  if (boardPointStart.isType(NON_PLAYABLE) || boardPointEnd.isType(NON_PLAYABLE)) {
  	return false;	// Paths must be through playable points
  }

  if (markPossibleAsGo) {
	if (!boardPointStart.hasTile()) {
		boardPointStart.addType(POSSIBLE_MOVE);
	}
	  if (boardPointEnd.isType(POSSIBLE_MOVE)) {
		  return true;
	  }
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

	if (travelDirection !== "DOWN") {
		// Check moving UP
		var nextRow = boardPointStart.row - 1;
		if (nextRow >= 0) {
			var nextPoint = this.cells[nextRow][boardPointStart.col];
			if (!nextPoint.hasEnemyTile(playerMoving) && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, playerMoving, markPossibleAsGo, "UP")) {
			return true; // Yay!
			}
		}
	}

	if (travelDirection !== "UP") {
		// Check moving DOWN
		nextRow = boardPointStart.row + 1;
		if (nextRow < 17) {
			var nextPoint = this.cells[nextRow][boardPointStart.col];
			if (!nextPoint.hasEnemyTile(playerMoving) && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, playerMoving, markPossibleAsGo, "DOWN")) {
			return true; // Yay!
			}
		}
	}

	if (travelDirection !== "RIGHT") {
		// Check moving LEFT
		var nextCol = boardPointStart.col - 1;
		if (nextCol >= 0) {
			var nextPoint = this.cells[boardPointStart.row][nextCol];
			if (!nextPoint.hasEnemyTile(playerMoving) && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, playerMoving, markPossibleAsGo, "LEFT")) {
			return true; // Yay!
			}
		}
	}

	if (travelDirection !== "LEFT") {
		// Check moving RIGHT
		nextCol = boardPointStart.col + 1;
		if (nextCol < 17) {
			var nextPoint = this.cells[boardPointStart.row][nextCol];
			if (!nextPoint.hasEnemyTile(playerMoving) && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, playerMoving, markPossibleAsGo, "RIGHT")) {
			return true; // Yay!
			}
		}
	}
};

StreetBoard.prototype.markSpacesBetweenHarmonies = function() {
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
		// Harmony will be in same row or same col
		if (harmony.tile1Pos.row === harmony.tile2Pos.row) {
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
				if (harmony.ownerName === GUEST) {
					self.cells[row][col].betweenHarmonyGuest = true;
				} else if (harmony.ownerName === HOST) {
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
				if (harmony.ownerName === GUEST) {
					self.cells[row][col].betweenHarmonyGuest = true;
				} else if (harmony.ownerName === HOST) {
					self.cells[row][col].betweenHarmonyHost = true;
				}
			}
		}
	});
};

StreetBoard.prototype.analyzeHarmonies = function() {
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

	this.markSpacesBetweenHarmonies();

	// this.harmonyManager.printHarmonies();

	/* Winning doesn't happen until the beginning of the turn after you form the win pattern, so GameManager needs to take care of that. */
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

StreetBoard.prototype.pointsAreNotOnMidline = function(rowAndCol1, rowAndCol2) {
	return rowAndCol1.row != 8 && rowAndCol1.col != 8 //
		&& rowAndCol2.row != 8 && rowAndCol2.col != 8;
};

StreetBoard.prototype.pointsCrossMidline = function(rowAndCol1, rowAndCol2) {
	var point1 = new RowAndColumn(rowAndCol1.row, rowAndCol1.col).getNotationPoint();
	var point2 = new RowAndColumn(rowAndCol2.row, rowAndCol2.col).getNotationPoint();
	return (point1.x > 0 && point2.x < 0) 
		|| (point1.x < 0 && point2.x > 0)
		|| (point1.y > 0 && point2.y < 0)
		|| (point1.y < 0 && point2.y > 0);
};

StreetBoard.prototype.boardPointsFormHarmony = function(bp1, bp2) {
	return bp1.tile && bp2.tile
		&& this.pointsAreNotOnMidline(bp1, bp2)
		&& this.pointsCrossMidline(bp1, bp2)
		&& bp1.tile.formsHarmonyWith(bp2.tile);
};

StreetBoard.prototype.getTileHarmonies = function(tile, rowAndCol) {
	var tileHarmonies = [];

	if (this.cells[rowAndCol.row][rowAndCol.col].isType(GATE)) {
		return tileHarmonies;
	}

	/* Left/Right */
	var leftHarmony = this.getHarmonyLeft(tile, rowAndCol);
	if (leftHarmony) {
		tileHarmonies.push(leftHarmony);
	}

	var rightHarmony = this.getHarmonyRight(tile, rowAndCol);
	if (rightHarmony) {
		tileHarmonies.push(rightHarmony);
	}
	/* --- */

	/* Up/Down */
	var upHarmony = this.getHarmonyUp(tile, rowAndCol);
	if (upHarmony) {
		tileHarmonies.push(upHarmony);
	}

	var downHarmony = this.getHarmonyDown(tile, rowAndCol);
	if (downHarmony) {
		tileHarmonies.push(downHarmony);
	}
	/* --- */

	return tileHarmonies;
};

StreetBoard.prototype.getHarmonyLeft = function(tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (!checkPoint.isType(GATE) && this.boardPointsFormHarmony(checkPoint, this.cells[endRowCol.row][endRowCol.col])) {
			var harmony = new StreetHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

StreetBoard.prototype.getHarmonyRight = function(tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (!checkPoint.isType(GATE) && this.boardPointsFormHarmony(checkPoint, this.cells[endRowCol.row][endRowCol.col])) {
			var harmony = new StreetHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

StreetBoard.prototype.getHarmonyUp = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (!checkPoint.isType(GATE) && this.boardPointsFormHarmony(checkPoint, this.cells[endRowCol.row][endRowCol.col])) {
			var harmony = new StreetHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

StreetBoard.prototype.getHarmonyDown = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (!checkPoint.isType(GATE) && this.boardPointsFormHarmony(checkPoint, this.cells[endRowCol.row][endRowCol.col])) {
			var harmony = new StreetHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

StreetBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
	if (!boardPointStart.hasTile()) {
		return;
	}
	// Apply "possible move point" type to applicable boardPoints
	var player = boardPointStart.tile.ownerName;
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			if (!this.cells[row][col].isType(POSSIBLE_MOVE)
				&& this.canMoveTileToPoint(player, boardPointStart, this.cells[row][col], true)) {
				this.cells[row][col].addType(POSSIBLE_MOVE);
			}
		}
	}
	debug(Number(this.debugCount).toLocaleString() + " movement checks");
  	this.debugCount = 0;
};

StreetBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

StreetBoard.prototype.setOpenGatePossibleMoves = function(player) {
	/* Apply "open gate" type to applicable boardPoints
	 * but only if player has less than 16 tiles on board. 
	 */
	if (this.numTilesOnBoardForPlayer(player) < 16) {
		if (player === HOST) {
			this.setHostGateOpen();
		} else {
			this.setGuestGateOpen();
		}
	}
};

StreetBoard.prototype.setGuestGateOpen = function() {
	var row = 15;	// Street Pai Sho Gates are one space closer to center
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

StreetBoard.prototype.setHostGateOpen = function() {
	var row = 1;	// Street Pai Sho Gates are one space closer to center
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

StreetBoard.prototype.isHostGateOpen = function() {
	var row = 1;	// Street Pai Sho Gates are one space closer to center
	var col = 8;
	return this.cells[row][col].isOpenGate();
};

StreetBoard.prototype.isGuestGateOpen = function() {
	var row = 15;	// Street Pai Sho Gates are one space closer to center
	var col = 8;
	return this.cells[row][col].isOpenGate();
};

StreetBoard.prototype.revealPossiblePlacementPoints = function(tile) {
	var self = this;
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			var valid = false;

			if (tile.ownerName === HOST) {
				this.setHostGateOpen();
			} else {
				this.setGuestGateOpen();
			}

			if (valid) {
				boardPoint.addType(POSSIBLE_MOVE);
			}
		});
	});
};

StreetBoard.prototype.getCopy = function() {
	var copyBoard = new StreetBoard();

	// cells
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			copyBoard.cells[row][col] = this.cells[row][col].getCopy();
		}
	}

	// Everything else...
	copyBoard.analyzeHarmonies();
	
	return copyBoard;
};

StreetBoard.prototype.aPlayerIsOutOfTilesWithoutOpenGate = function() {
	if (this.numTilesOnBoardForPlayer(HOST) === 0 && !this.isHostGateOpen()) {
		return HOST;
	} else if (this.numTilesOnBoardForPlayer(GUEST) === 0 && !this.isGuestGateOpen()) {
		return GUEST;
	}
};

StreetBoard.prototype.numTilesOnBoardForPlayer = function(player) {
	/* Includes only tiles that are not captured (underneath opponent's tiles) */
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


