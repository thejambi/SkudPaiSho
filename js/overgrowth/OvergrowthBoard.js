// Board

function OvergrowthBoard() {
	this.size = new RowAndColumn(17, 17);

	this.boardHelper = new PaiShoBoardHelper(OvergrowthBoardPoint, this.size);

	this.cells = this.brandNew();

	this.harmonyManager = new OvergrowthHarmonyManager();

	this.rockRowAndCols = [];
	this.playedWhiteLotusTiles = [];
}

OvergrowthBoard.prototype.brandNew = function () {
	return this.boardHelper.generateBoardCells();
};

OvergrowthBoard.prototype.placeTile = function (tile, notationPoint) {
	this.boardHelper.putTileOnPoint(tile, notationPoint, this.cells);
	this.analyzeHarmonies();
};

OvergrowthBoard.prototype.markSpacesBetweenHarmonies = function () {
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

OvergrowthBoard.prototype.analyzeHarmonies = function () {
	// We're going to find all harmonies on the board - And Disharmonies!

	// Check along all rows, then along all columns.. Or just check all tiles?
	this.harmonyManager.clearList();

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var boardPoint = this.cells[row][col];
			if (boardPoint.hasTile()) {
				var tileHarmonies = this.getTileHarmonies(boardPoint.tile, new RowAndColumn(row, col));
				this.harmonyManager.addHarmonies(tileHarmonies);

				var tileClashes = this.getTileClashes(boardPoint.tile, new RowAndColumn(row, col));
				this.harmonyManager.addClashes(tileClashes);

				boardPoint.tile.inHarmony = tileHarmonies.length > 0;
				boardPoint.tile.inClash = tileClashes.length > 0;
			}
		}
	}

	this.markSpacesBetweenHarmonies();
};

OvergrowthBoard.prototype.getTileHarmonies = function (tile, rowAndCol) {
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

OvergrowthBoard.prototype.getHarmonyLeft = function (tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new OvergrowthHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

OvergrowthBoard.prototype.getHarmonyRight = function (tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new OvergrowthHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

OvergrowthBoard.prototype.getHarmonyUp = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new OvergrowthHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

OvergrowthBoard.prototype.getHarmonyDown = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new OvergrowthHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

OvergrowthBoard.prototype.getTileClashes = function (tile, rowAndCol) {
	var tileHarmonies = [];

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

	return tileHarmonies;
};

OvergrowthBoard.prototype.getClashLeft = function (tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (tile.clashesWith(checkPoint.tile)) {
			var harmony = new OvergrowthHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

OvergrowthBoard.prototype.getClashRight = function (tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (tile.clashesWith(checkPoint.tile)) {
			var harmony = new OvergrowthHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

OvergrowthBoard.prototype.getClashUp = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (tile.clashesWith(checkPoint.tile)) {
			var harmony = new OvergrowthHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

OvergrowthBoard.prototype.getClashDown = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (tile.clashesWith(checkPoint.tile)) {
			var harmony = new OvergrowthHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};
/* ******************************* */

OvergrowthBoard.prototype.hasNewHarmony = function (player, tile, startRowCol, endRowCol) {
	// To check if new harmony, first analyze harmonies and compare to previous set of harmonies
	var oldHarmonies = this.harmonyManager.harmonies;
	this.analyzeHarmonies();

	return this.harmonyManager.hasNewHarmony(player, oldHarmonies);
};

OvergrowthBoard.prototype.hasDisharmony = function (boardPoint) {
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

OvergrowthBoard.prototype.hasDisharmonyLeft = function (tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (tile.clashesWith(checkPoint.tile)) {
			// debug("CLASHES Left: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
			return true;
		}
	}
};

OvergrowthBoard.prototype.hasDisharmonyRight = function (tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile()) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];
		if (tile.clashesWith(checkPoint.tile)) {
			// debug("CLASHES Right: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
			return true;
		}
	}
};

OvergrowthBoard.prototype.hasDisharmonyUp = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (tile.clashesWith(checkPoint.tile)) {
			// debug("CLASHES Up: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
			return true;
		}
	}
};

OvergrowthBoard.prototype.hasDisharmonyDown = function (tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile()) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];
		if (tile.clashesWith(checkPoint.tile)) {
			// debug("CLASHES Down: " + tile.getConsoleDisplay() + " & " + checkPoint.tile.getConsoleDisplay());
			return true;
		}
	}
};

OvergrowthBoard.prototype.setPossibleMovePoints = function (boardPointStart) {
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

OvergrowthBoard.prototype.removePossibleMovePoints = function () {
	this.cells.forEach(function (row) {
		row.forEach(function (boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

OvergrowthBoard.prototype.setAllPossiblePointsOpen = function (tile, player) {
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.canHoldTile(tile)) {
				var newBp = bp.getCopy();
				newBp.putTile(tile);
				if (player === HOST) {
					// Clash not allowed
					if (!this.hasDisharmony(newBp)) {
						this.cells[row][col].addType(POSSIBLE_MOVE);
					}
				} else if (player === GUEST) {
					// Harmony not allowed
					if (!this.getTileHarmonies(newBp.tile, newBp).length > 0) {
						this.cells[row][col].addType(POSSIBLE_MOVE);
					}
				}
			}
		}
	}
};

OvergrowthBoard.prototype.setHarmonyAndClashPointsOpen = function(tile) {
	var possibleMovesFound = false;

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.canHoldTile(tile)) {
				var newBp = bp.getCopy();
				newBp.putTile(tile);
				if (this.hasDisharmony(newBp) || this.getTileHarmonies(newBp.tile, newBp).length > 0) {
					this.cells[row][col].addType(POSSIBLE_MOVE);
					possibleMovesFound = true;
				}
			}
		}
	}

	return possibleMovesFound;
};

OvergrowthBoard.prototype.setSolitaireAccentPointsOpen = function (tile) {
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];

			var checkBps = [];

			// Check up and down
			if (row > 2) {
				checkBps.push(this.cells[row - 2][col]);
			}
			if (row < 14) {
				checkBps.push(this.cells[row + 2][col]);
			}

			// Check left and right
			if (col > 2) {
				checkBps.push(this.cells[row][col - 2]);
			}
			if (col < 14) {
				checkBps.push(this.cells[row][col + 2]);
			}

			var checkBpIsWithinGarden = false;
			for (var i = 0; i < checkBps.length; i++) {
				if (checkBps[i].isCompletelyWithinRedOrWhiteGarden()) {
					checkBpIsWithinGarden = true;
				}
			}

			if (bp.isType(RED) && bp.isType(WHITE)) {
				checkBpIsWithinGarden = true;
			}

			if (checkBpIsWithinGarden && bp.canHoldTile(tile)) {
				this.cells[row][col].addType(POSSIBLE_MOVE);
			}
		}
	}
};

OvergrowthBoard.prototype.playerControlsLessThanTwoGates = function (player) {
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

OvergrowthBoard.prototype.playerHasNoGrowingFlowers = function (player) {
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

OvergrowthBoard.prototype.revealSpecialFlowerPlacementPoints = function (player) {
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

	bpCheckList.forEach(function (bp) {
		if (!bp.hasTile()) {
			bp.addType(POSSIBLE_MOVE);
		}
	});
};

OvergrowthBoard.prototype.setGuestGateOpen = function () {
	var row = 16;
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

OvergrowthBoard.prototype.revealPossiblePlacementPoints = function (tile) {
	var self = this;
	this.cells.forEach(function (row) {
		row.forEach(function (boardPoint) {
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

OvergrowthBoard.prototype.revealBoatBonusPoints = function (boardPoint) {
	if (!boardPoint.hasTile()) {
		return;
	}

	var player = boardPoint.tile.ownerName;

	if (newKnotweedRules) {
		// New rules: All surrounding points
		var rowCols = this.getSurroundingRowAndCols(boardPoint);

		for (var i = 0; i < rowCols.length; i++) {
			var boardPointEnd = this.cells[rowCols[i].row][rowCols[i].col];
			// if (this.canMoveTileToPoint(player, boardPoint, boardPointEnd)) {
			if (this.canTransportTileToPoint(boardPoint, boardPointEnd)) {
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

OvergrowthBoard.prototype.getCopy = function () {
	var copyBoard = new OvergrowthBoard();

	// cells
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			copyBoard.cells[row][col] = this.cells[row][col].getCopy();
		}
	}

	copyBoard.analyzeHarmonies();

	return copyBoard;
};

OvergrowthBoard.prototype.numTilesInGardensForPlayer = function (player) {
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

OvergrowthBoard.prototype.numTilesOnBoardForPlayer = function (player) {
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

OvergrowthBoard.prototype.getSurroundness = function (player) {
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