// Board

Undergrowth.Board = function() {
	this.size = new RowAndColumn(17, 17);

	this.boardHelper = new PaiShoBoardHelper(Undergrowth.BoardPoint, this.size);

	this.cells = this.brandNew();

	this.harmonyManager = new Undergrowth.HarmonyManager();

	this.rockRowAndCols = [];
	this.playedWhiteLotusTiles = [];
}

Undergrowth.Board.prototype.brandNew = function () {
	return this.boardHelper.generateBoardCells();
};

Undergrowth.Board.prototype.placeTile = function (tile, notationPoint) {
	this.boardHelper.putTileOnPoint(tile, notationPoint, this.cells);
	this.analyzeHarmonies();

	var capturedTiles = this.captureTilesWithAtLeastTwoDisharmonies();

	this.analyzeHarmonies();

	return capturedTiles;
};

Undergrowth.Board.prototype.captureTilesWithAtLeastTwoDisharmonies = function() {
	var pointsToCapture = [];
	var capturedTiles = [];

	var self = this;
	this.forEachBoardPointWithTile(function(boardPointWithTile) {
		var tileClashes = self.getTileClashes(boardPointWithTile.tile, boardPointWithTile);
		if (tileClashes.length >= 2) {
			pointsToCapture.push(boardPointWithTile);
		}
	});

	pointsToCapture.forEach(function(pointToCaptureFrom) {
		capturedTiles.push(pointToCaptureFrom.removeTile());
	});

	return capturedTiles;
};

Undergrowth.Board.prototype.forEachBoardPoint = function(forEachFunc) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				forEachFunc(boardPoint);
			}
		});
	});
};
Undergrowth.Board.prototype.forEachBoardPointWithTile = function(forEachFunc) {
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			forEachFunc(boardPoint);
		}
	});
};

Undergrowth.Board.prototype.markSpacesBetweenHarmonies = function () {
	// And Clashes!

	// Unmark all
	this.cells.forEach(function (row) {
		row.forEach(function (boardPoint) {
			boardPoint.betweenHarmony = false;
			boardPoint.betweenHarmonyHost = false; // Harmony
			boardPoint.betweenHarmonyGuest = false; // Clash
		});
	});

	// Go through harmonies, mark the spaces between them
	var self = this;
	this.harmonyManager.harmonies.forEach(function (harmony) {
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
				// if (harmony.ownerName === GUEST) {
				// 	self.cells[row][col].betweenHarmonyGuest = true;
				// } else if (harmony.ownerName === HOST) {
				self.cells[row][col].betweenHarmonyHost = true;
				// }
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
				// if (harmony.ownerName === GUEST) {
				// 	self.cells[row][col].betweenHarmonyGuest = true;
				// } else if (harmony.ownerName === HOST) {
				self.cells[row][col].betweenHarmonyHost = true;
				// }
			}
		}
	});

	this.harmonyManager.clashes.forEach(function (harmony) {
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
				self.cells[row][col].betweenHarmonyGuest = true; // Used for clashes
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
				self.cells[row][col].betweenHarmonyGuest = true;
			}
		}
	});
};

Undergrowth.Board.prototype.analyzeHarmonies = function () {
	// We're going to find all harmonies on the board - And Disharmonies!

	// Check along all rows, then along all columns.. Or just check all tiles?
	this.harmonyManager.clearList();

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var boardPoint = this.cells[row][col];
			if (boardPoint.hasTile()) {
				var tileHarmonies = this.getTileHarmonies(boardPoint.tile, new RowAndColumn(row, col));
				this.harmonyManager.addHarmonies(tileHarmonies);

				var tileClashes = this.getTileClashes(boardPoint.tile, boardPoint);
				this.harmonyManager.addClashes(tileClashes);

				boardPoint.tile.inHarmony = tileHarmonies.length > 0;
				boardPoint.tile.inClash = tileClashes.length > 0;
			}
		}
	}

	this.markSpacesBetweenHarmonies();
};

Undergrowth.Board.prototype.getTileHarmonies = function (tile, rowAndCol) {
	var tileHarmonies = [];

	var leftHarmony = this.getHarmonyLeft(tile, rowAndCol);
	if (leftHarmony) {
		tileHarmonies.push(leftHarmony);
	}

	var rightHarmony = this.getHarmonyRight(tile, rowAndCol);
	if (rightHarmony) {
		tileHarmonies.push(rightHarmony);
	}

	var upHarmony = this.getHarmonyUp(tile, rowAndCol);
	if (upHarmony) {
		tileHarmonies.push(upHarmony);
	}

	var downHarmony = this.getHarmonyDown(tile, rowAndCol);
	if (downHarmony) {
		tileHarmonies.push(downHarmony);
	}

	return tileHarmonies;
};

Undergrowth.Board.prototype.getHarmonyLeft = function (tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new Undergrowth.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

Undergrowth.Board.prototype.getHarmonyRight = function (tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new Undergrowth.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

Undergrowth.Board.prototype.getHarmonyUp = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new Undergrowth.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

Undergrowth.Board.prototype.getHarmonyDown = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new Undergrowth.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

Undergrowth.Board.prototype.getTileClashes = function (tile, boardPoint) {
	var tileHarmonies = [];

	if (!boardPoint.isType(GATE)) {

		var rowAndCol = new RowAndColumn(boardPoint.row, boardPoint.col)

		var leftHarmony = this.getClashLeft(tile, rowAndCol);
		if (leftHarmony) {
			tileHarmonies.push(leftHarmony);
		}

		var rightHarmony = this.getClashRight(tile, rowAndCol);
		if (rightHarmony) {
			tileHarmonies.push(rightHarmony);
		}

		var upHarmony = this.getClashUp(tile, rowAndCol);
		if (upHarmony) {
			tileHarmonies.push(upHarmony);
		}

		var downHarmony = this.getClashDown(tile, rowAndCol);
		if (downHarmony) {
			tileHarmonies.push(downHarmony);
		}

	}

	return tileHarmonies;
};

Undergrowth.Board.prototype.getClashLeft = function (tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
			var harmony = new Undergrowth.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

Undergrowth.Board.prototype.getClashRight = function (tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
			var harmony = new Undergrowth.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

Undergrowth.Board.prototype.getClashUp = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
			var harmony = new Undergrowth.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

Undergrowth.Board.prototype.getClashDown = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (!checkPoint.isType(GATE) && tile.clashesWith(checkPoint.tile)) {
			var harmony = new Undergrowth.Harmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

Undergrowth.Board.prototype.setPossibleMovePoints = function (boardPointStart) {
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

Undergrowth.Board.prototype.removePossibleMovePoints = function () {
	this.cells.forEach(function (row) {
		row.forEach(function (boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

Undergrowth.Board.prototype.setAllPossiblePointsOpen = function (tile, player) {
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.canHoldTile(tile) && !bp.betweenHarmony) {
				this.cells[row][col].addType(POSSIBLE_MOVE);
			}
		}
	}
};

Undergrowth.Board.prototype.setHarmonyPointsOpen = function(tile) {
	var possibleMovesFound = false;

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (!bp.betweenHarmony && bp.canHoldTile(tile)) {
				var newBp = bp.getCopy();
				newBp.putTile(tile);
				if (this.getTileHarmonies(newBp.tile, newBp).length > 0) {
					this.cells[row][col].addType(POSSIBLE_MOVE);
					possibleMovesFound = true;
				}
			}
		}
	}

	return possibleMovesFound;
};

Undergrowth.Board.prototype.setOpenGatePossibleMoves = function() {
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.isType(GATE) && !boardPoint.hasTile()) {
			boardPoint.addType(POSSIBLE_MOVE);
		}
	});
};

Undergrowth.Board.prototype.getPlayerWithMostTilesOnBoard = function() {
	var hostCount = 0;
	var guestCount = 0;

	this.forEachBoardPointWithTile(function(boardPointWithTile) {
		if (boardPointWithTile.tile.ownerName === HOST) {
			hostCount++;
		} else if (boardPointWithTile.tile.ownerName === GUEST) {
			guestCount++;
		} 
	});

	if (hostCount > guestCount) {
		return HOST;
	} else if (guestCount > hostCount) {
		return GUEST;
	}
};

Undergrowth.Board.prototype.getCopy = function () {
	var copyBoard = new Undergrowth.Board();

	// cells
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			copyBoard.cells[row][col] = this.cells[row][col].getCopy();
		}
	}

	copyBoard.analyzeHarmonies();

	return copyBoard;
};

