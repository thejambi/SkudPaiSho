/* Fire Pai Sho Board */

function FirePaiShoBoard() {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	this.harmonyManager = new FirePaiShoHarmonyManager();

	this.rockRowAndCols = [];
	this.playedWhiteLotusTiles = [];
	this.winners = [];
}

FirePaiShoBoard.prototype.brandNew = function () {
	var cells = [];

	cells[0] = this.newRow(9, 
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.gate(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[1] = this.newRow(11, 
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.redWhiteNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(), 
		FirePaiShoBoardPoint.neutral()
		]);

	cells[2] = this.newRow(13, 
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.whiteNeutral(), 
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[3] = this.newRow(15,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.whiteNeutral(), 
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[4] = this.newRow(17,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.whiteNeutral(), 
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[5] = this.newRow(17,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.whiteNeutral(), 
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[6] = this.newRow(17,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.whiteNeutral(), 
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[7] = this.newRow(17,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.whiteNeutral(), 
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[8] = this.newRow(17,
		[FirePaiShoBoardPoint.gate(),
		FirePaiShoBoardPoint.redWhiteNeutral(), 
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.center(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.redWhiteNeutral(),
		FirePaiShoBoardPoint.gate()
		]);

	cells[9] = this.newRow(17,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.redNeutral(), 
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.whiteNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[10] = this.newRow(17,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.redNeutral(), 
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.whiteNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[11] = this.newRow(17,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.redNeutral(), 
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.whiteNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[12] = this.newRow(17,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.redNeutral(), 
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.whiteNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[13] = this.newRow(15,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.redNeutral(), 
		FirePaiShoBoardPoint.red(),
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.white(),
		FirePaiShoBoardPoint.whiteNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[14] = this.newRow(13,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.redNeutral(), 
		FirePaiShoBoardPoint.redWhite(),
		FirePaiShoBoardPoint.whiteNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[15] = this.newRow(11,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.redWhiteNeutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	cells[16] = this.newRow(9,
		[FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.gate(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral(),
		FirePaiShoBoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

FirePaiShoBoard.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new FirePaiShoBoardPoint();
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

FirePaiShoBoard.prototype.placeTile = function(tile, notationPoint, tileManager, extraBoatPoint) {
	var tileRemovedWithBoat;

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
	////////// Tile boost updating
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile()) {
				bp.tile.boosted = false;
			}
		}
	}
	// Find Orchid tiles, then check surrounding opposite-player Basic Flower tiles and flag them
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			this.boostTilesSurroundingPointIfNeeded(bp);
		}
	}
	/////////////
	var newHarmony = this.hasNewHarmony(tile.ownerName);
	this.analyzeHarmonies();

	if (tile.accentType === BOAT) {
		return {
			newHarmony: newHarmony,
			tileRemovedWithBoat: tileRemovedWithBoat,
			movedTile: tile
		};
	}
	else{
		return {
			newHarmony: newHarmony,
			movedTile: tile
		};
	}
};

FirePaiShoBoard.prototype.flagAllBoostedTiles = function() {
	// Tile boost updating
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile()) {
				bp.tile.boosted = false;
			}
		}
	}
	// Find Orchid tiles, then check surrounding opposite-player Basic Flower tiles and flag them
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			this.boostTilesSurroundingPointIfNeeded(bp);
		}
	}
};

FirePaiShoBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

FirePaiShoBoard.prototype.canPlaceFlower = function(boardPoint, tile) {

	//If it is properly in red without being center
	if (boardPoint.types.includes(RED) && !boardPoint.types.includes(NEUTRAL)){
		
		return false;
	}

	//if it is properly in white without being center
	if (boardPoint.types.includes(WHITE) && !boardPoint.types.includes(NEUTRAL)){
		
		return false;
	}
	
	if (boardPoint.hasTile()) {
		// debug("Flower cannot be played on top of another tile");
		return false;
	}
	if (boardPoint.isType(GATE)) {
		return false;
	}

	var newBoard = this.getCopy();
	var notationPoint = new NotationPoint(new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
	var code = tile.code;
	var player = tile.playerCode;
	var copyTile = new FirePaiShoTile(code, player);
	newBoard.placeTile(copyTile, notationPoint);
	if (newBoard.moveCreatesDisharmony(notationPoint, notationPoint)){
		return false;
	}

	return true;
};

FirePaiShoBoard.prototype.canPlaceRock = function(boardPoint) {
	if (boardPoint.hasTile()) {
		// debug("Rock cannot be played on top of another tile");
		return false;
	}
	if (boardPoint.isType(GATE)) {
		return false;
	}
	return true;
};

FirePaiShoBoard.prototype.placeRock = function(tile, notationPoint) {
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

FirePaiShoBoard.prototype.canPlaceWheel = function(boardPoint) {
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

	// Does it create Disharmony?
	var newBoard = this.getCopy();
	var notationPoint = new NotationPoint(new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
	newBoard.placeWheel(new FirePaiShoTile('W', 'G'), notationPoint, true);
	if (newBoard.moveCreatesDisharmony(boardPoint, boardPoint)) {
		return false;
	}

	return true;
};

FirePaiShoBoard.prototype.isValidRowCol = function(rowCol) {
	return rowCol.row >= 0 && rowCol.col >= 0 && rowCol.row <= 16 && rowCol.col <= 16;
};

FirePaiShoBoard.prototype.placeWheel = function(tile, notationPoint, ignoreCheck) {
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

FirePaiShoBoard.prototype.canPlaceKnotweed = function(boardPoint) {
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

FirePaiShoBoard.prototype.placeKnotweed = function(tile, notationPoint) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	var rowCols = this.getSurroundingRowAndCols(rowAndCol);

	if (!this.canPlaceKnotweed(boardPoint)) {
		return false;
	}

	// Place tile
	boardPoint.putTile(tile);

	// "Boost" surrounding tiles
	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
		bp.boostTile();
	}
};

FirePaiShoBoard.prototype.canPlaceBoat = function(boardPoint) {
	if (!boardPoint.hasTile()) {
		// debug("Boat always played on top of another tile");
		return false;
	}

	if (boardPoint.isType(GATE)) {
		return false;
	}

	if (boardPoint.tile.type === ACCENT_TILE) {
		// Ensure no Disharmony
		var newBoard = this.getCopy();
		var notationPoint = new NotationPoint(new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
		newBoard.placeBoat(new FirePaiShoTile('B', 'G'), notationPoint, boardPoint, true);
		var newBoardPoint = newBoard.cells[boardPoint.row][boardPoint.col];
		if (newBoard.moveCreatesDisharmony(newBoardPoint, newBoardPoint)) {
			return false;
		}
	}

	return true;
};

FirePaiShoBoard.prototype.placeBoat = function(tile, notationPoint, extraBoatPoint, ignoreCheck) {
	 debug(extraBoatPoint);
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	var tileRemovedWithBoat;

	if (!ignoreCheck && !this.canPlaceBoat(boardPoint)) {
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
		//console.log(bpRowCol);
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

FirePaiShoBoard.prototype.canPlaceBamboo = function(boardPoint, tile) {
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
	var newBoard = this.getCopy();
	var notationPoint = new NotationPoint(new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
	newBoard.placeBamboo(new FirePaiShoTile('M', 'G'), notationPoint, true);
	if (newBoard.moveCreatesDisharmony(boardPoint, boardPoint)) {
		return false;
	}

	return true;
};

FirePaiShoBoard.prototype.placeBamboo = function(tile, notationPoint, ignoreCheck, tileManager) {
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

FirePaiShoBoard.prototype.canPlacePond = function(boardPoint, tile) {
	return !boardPoint.hasTile() && !boardPoint.isType(GATE);
};

FirePaiShoBoard.prototype.placePond = function(tile, notationPoint, ignoreCheck) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	if (!ignoreCheck && !this.canPlacePond(boardPoint, tile)) {
		return false;
	}

	// Place tile
	boardPoint.putTile(tile);
};

FirePaiShoBoard.prototype.canPlaceLionTurtle = function(boardPoint, tile) {
	return !boardPoint.hasTile() 
		&& !boardPoint.isType(GATE);
};

// FirePaiShoBoard.prototype.pointSurroundsPointSurroundingLionTurtle = function(boardPoint) {
// 	var rowCols = this.getSurroundingRowAndCols(boardPoint);
// 	for (var i = 0; i < rowCols.length; i++) {
// 		if (this.getSurroundingLionTurtleTile(rowCols[i])) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

FirePaiShoBoard.prototype.placeLionTurtle = function(tile, notationPoint, ignoreCheck) {
	var rowAndCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowAndCol.row][rowAndCol.col];

	if (!ignoreCheck && !this.canPlaceLionTurtle(boardPoint, tile)) {
		return false;
	}

	// Place tile
	boardPoint.putTile(tile);
};

FirePaiShoBoard.prototype.getClockwiseRowCol = function(center, rowCol) {
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

FirePaiShoBoard.prototype.getSurroundingRowAndCols = function(rowAndCol) {
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

FirePaiShoBoard.prototype.refreshRockRowAndCols = function() {
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

FirePaiShoBoard.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate() || this.pointIsOpenAndSurroundsPond(point);
};

FirePaiShoBoard.prototype.pointIsOpenAndSurroundsPond = function(boardPoint) {
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

FirePaiShoBoard.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
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
		showBadMoveModal();
		return false;
	}

	var tile = boardPointStart.removeTile();
	var capturedTile = boardPointEnd.tile;

	if (!tile) {
		debug("Error: No tile to move!");
	}

	var error = boardPointEnd.putTile(tile);

	if (error) {
		debug("Error moving tile. It probably didn't get moved.");
		return false;
	}

	/////////////////Update boosting
	// Tile boost updating
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile()) {
				bp.tile.boosted = false;
			}
		}
	}
	
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			this.boostTilesSurroundingPointIfNeeded(bp);
		}
	}
	/////////////////////////

	// Check for harmonies
	var newHarmony = this.hasNewHarmony(player);

	return {
		bonusAllowed: newHarmony,
		movedTile: tile,
		capturedTile: capturedTile
	}
};


FirePaiShoBoard.prototype.boostTilesSurroundingPointIfNeeded = function(boardPoint) {

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
		if (bp.hasTile() && !bp.isType(GATE) && bp.tile.type !== ACCENT_TILE && bp.tile.specialFlowerType !== WHITE_LOTUS) {
			bp.tile.boosted = true;
		}
	}
};

FirePaiShoBoard.prototype.restoreTileIfNeeded = function(boardPoint){
	
	//console.log("Assuming a restore unless I hear otherwise");
	var restore = true;
	rowCols = this.getSurroundingRowAndCols(boardPoint);
	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
		if (bp.hasTile() && bp.tile.accentType === KNOTWEED) {
			//console.log("Nope, there is a knotweed. No restore.");
			restore = false;
		}
		if (restore) {boardPoint.restoreTile();}
	}
}

FirePaiShoBoard.prototype.boostTileIfNeeded = function(boardPoint, tile){
	
	var boost = false;
	rowCols = this.getSurroundingRowAndCols(boardPoint);
	for (var i = 0; i < rowCols.length; i++) {
		var bp = this.cells[rowCols[i].row][rowCols[i].col];
		if (bp.hasTile() && bp.tile.accentType === KNOTWEED) {
			boost = true;
		}
		if (boost) {tile.boost();}
	}
}

FirePaiShoBoard.prototype.trapTilesSurroundingPointIfNeeded = function(boardPoint) {
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

FirePaiShoBoard.prototype.whiteLotusProtected = function(lotusTile) {
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

FirePaiShoBoard.prototype.orchidCanCapture = function(orchidTile) {
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

FirePaiShoBoard.prototype.orchidVulnerable = function(orchidTile) {
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

FirePaiShoBoard.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	return false;
}
/**
 * No capturing in Fire Pai Sho!!!
	
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
	}
};
*/

FirePaiShoBoard.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
	// start point must have a tile
	if (!boardPointStart.hasTile()) {
		return false;
	}

	// Tile must belong to player
	if (boardPointStart.tile.ownerName !== player) {
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
	if (this.moveCreatesDisharmony(boardPointStart, boardPointEnd)) {
		return false;
	}

	// I guess we made it through
	return true;
};

FirePaiShoBoard.prototype.canTransportTileToPointWithBoat = function(boardPointStart, boardPointEnd) {
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

	var newBoard = this.getCopy();
	var newBoardPointStart = newBoard.cells[boardPointStart.row][boardPointStart.col];
	var notationPoint = new NotationPoint(new RowAndColumn(newBoardPointStart.row, newBoardPointStart.col).notationPointString);
	var notationPointEnd = new NotationPoint(new RowAndColumn(boardPointEnd.row, boardPointEnd.col).notationPointString);
	newBoard.placeBoat(new FirePaiShoTile('B', 'G'), notationPoint, notationPointEnd, true);
	if (newBoard.moveCreatesDisharmony(newBoardPointStart, newBoardPointStart)) {
		return false;
	}

	// I guess we made it through
	return true;
};


FirePaiShoBoard.prototype.moveCreatesDisharmony = function(boardPointStart, boardPointEnd) {
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

FirePaiShoBoard.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves) {
  // Recursion!
  return this.pathFound(boardPointStart, boardPointEnd, numMoves);
};

FirePaiShoBoard.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves) {
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

FirePaiShoBoard.prototype.rowBuffedByRock = function(rowNum) {

	var buffed = false;
	this.rockRowAndCols.forEach(function(rowAndCol) {
		if (rowAndCol.row === rowNum) {
			buffed = true;
		}
	});
	return buffed;
};

FirePaiShoBoard.prototype.columnBuffedByRock = function(colNum) {
	
	var buffed = false;
	this.rockRowAndCols.forEach(function(rowAndCol) {
		if (rowAndCol.col === colNum) {
			buffed = true;
		}
	});
	return buffed;
};

FirePaiShoBoard.prototype.markSpacesBetweenHarmonies = function() {
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
		}
	});
};

FirePaiShoBoard.prototype.analyzeHarmonies = function() {
	// We're going to find all harmonies on the board

	// Check along all rows, then along all columns.. Or just check all tiles?
	this.harmonyManager.clearList();

	for (var row = 0; row < this.cells.length; row++) {
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
	}

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

FirePaiShoBoard.prototype.getSurroundingLionTurtleTiles = function(boardPoint) {
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

FirePaiShoBoard.prototype.getTileHarmonies = function(boardPoint) {
	var tile = boardPoint.tile;
	var rowAndCol = boardPoint;
	var tileHarmonies = [];

	if (this.cells[rowAndCol.row][rowAndCol.col].isType(GATE)) {
		return tileHarmonies;
	}

	var surroundingLionTurtleTiles = this.getSurroundingLionTurtleTiles(rowAndCol);


	var leftHarmony = this.getHarmonyLeft(tile, rowAndCol, surroundingLionTurtleTiles);
	if (leftHarmony) {
		tileHarmonies.push(leftHarmony);
	}

	var rightHarmony = this.getHarmonyRight(tile, rowAndCol, surroundingLionTurtleTiles);
	if (rightHarmony) {
		tileHarmonies.push(rightHarmony);
	}



	var upHarmony = this.getHarmonyUp(tile, rowAndCol, surroundingLionTurtleTiles);
	if (upHarmony) {
		tileHarmonies.push(upHarmony);
	}

	var downHarmony = this.getHarmonyDown(tile, rowAndCol, surroundingLionTurtleTiles);
	if (downHarmony) {
		tileHarmonies.push(downHarmony);
	}


	return tileHarmonies;
};

FirePaiShoBoard.prototype.getHarmonyLeft = function(tile, endRowCol, surroundingLionTurtleTiles) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile() 
		&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];

		var newSurroundingLionTurtles = this.getSurroundingLionTurtleTiles(checkPoint);
		newSurroundingLionTurtles = newSurroundingLionTurtles.concat(surroundingLionTurtleTiles);
		var surroundsLionTurtle = newSurroundingLionTurtles.length > 0;

		var checkRowIsBuffed = this.rowBuffedByRock(endRowCol.row);

		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile, surroundsLionTurtle, checkRowIsBuffed)) {
			var harmony = new FirePaiShoHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck), newSurroundingLionTurtles);
			return harmony;
		}
	}
};

FirePaiShoBoard.prototype.getHarmonyRight = function(tile, endRowCol, surroundingLionTurtleTiles) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck <= 16 && !this.cells[endRowCol.row][colToCheck].hasTile() 
		&& !this.cells[endRowCol.row][colToCheck].isType(GATE)) {
		colToCheck++;
	}

	if (colToCheck <= 16) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];

		var newSurroundingLionTurtles = this.getSurroundingLionTurtleTiles(checkPoint);
		newSurroundingLionTurtles = newSurroundingLionTurtles.concat(surroundingLionTurtleTiles);
		var surroundsLionTurtle = newSurroundingLionTurtles.length > 0;

		var checkRowIsBuffed = this.rowBuffedByRock(endRowCol.row);

		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile, surroundsLionTurtle, checkRowIsBuffed)) {
			var harmony = new FirePaiShoHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck), newSurroundingLionTurtles);
			return harmony;
		}
	}
};

FirePaiShoBoard.prototype.getHarmonyUp = function(tile, endRowCol, surroundingLionTurtleTiles) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile() 
		&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];

		var newSurroundingLionTurtles = this.getSurroundingLionTurtleTiles(checkPoint);
		newSurroundingLionTurtles = newSurroundingLionTurtles.concat(surroundingLionTurtleTiles);
		var surroundsLionTurtle = newSurroundingLionTurtles.length > 0;

		var checkColIsBuffed = this.columnBuffedByRock(endRowCol.col);

		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile, surroundsLionTurtle, checkColIsBuffed)) {
			var harmony = new FirePaiShoHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col), newSurroundingLionTurtles);
			return harmony;
		}
	}
};

FirePaiShoBoard.prototype.getHarmonyDown = function(tile, endRowCol, surroundingLionTurtleTiles) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck <= 16 && !this.cells[rowToCheck][endRowCol.col].hasTile() 
		&& !this.cells[rowToCheck][endRowCol.col].isType(GATE)) {
		rowToCheck++;
	}

	if (rowToCheck <= 16) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];

		var newSurroundingLionTurtles = this.getSurroundingLionTurtleTiles(checkPoint);
		newSurroundingLionTurtles = newSurroundingLionTurtles.concat(surroundingLionTurtleTiles);
		var surroundsLionTurtle = newSurroundingLionTurtles.length > 0;

		var checkColIsBuffed = this.columnBuffedByRock(endRowCol.col);

		if (!checkPoint.isType(GATE) && tile.formsHarmonyWith(checkPoint.tile, surroundsLionTurtle, checkColIsBuffed)) {
			var harmony = new FirePaiShoHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col), newSurroundingLionTurtles);
			return harmony;
		}
	}
};

FirePaiShoBoard.prototype.hasNewHarmony = function(player) {
	// To check if new harmony, first analyze harmonies and compare to previous set of harmonies
	var oldHarmonies = this.harmonyManager.harmonies;
	this.analyzeHarmonies();

	return this.harmonyManager.hasNewHarmony(player, oldHarmonies);
};

FirePaiShoBoard.prototype.hasDisharmony = function(boardPoint) {
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

FirePaiShoBoard.prototype.hasDisharmonyLeft = function(tile, endRowCol) {
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

FirePaiShoBoard.prototype.hasDisharmonyRight = function(tile, endRowCol) {
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

FirePaiShoBoard.prototype.hasDisharmonyUp = function(tile, endRowCol) {
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

FirePaiShoBoard.prototype.hasDisharmonyDown = function(tile, endRowCol) {
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

FirePaiShoBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
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

FirePaiShoBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

FirePaiShoBoard.prototype.setOpenGatePossibleMoves = function(player, tile) {
	// Apply "open gate" type to applicable boardPoints
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.isOpenGate()) {
				this.cells[row][col].addType(POSSIBLE_MOVE);
			}

			// If Pond, mark surrounding points
			if (tile && bp.hasTile() && bp.tile.accentType === POND) {
				var rowCols = this.getSurroundingRowAndCols(bp);
				for (var i = 0; i < rowCols.length; i++) {
					var surroundingPoint = this.cells[rowCols[i].row][rowCols[i].col];
					if (surroundingPoint.canHoldTile(tile)) {
						// If does not cause clash...
						var newBoard = this.getCopy();
						var notationPoint = new NotationPoint(new RowAndColumn(surroundingPoint.row, surroundingPoint.col).notationPointString);
						newBoard.placeTile(tile, notationPoint);
						if (!newBoard.moveCreatesDisharmony(notationPoint, notationPoint)) {
							surroundingPoint.addType(POSSIBLE_MOVE);
						}
					}
				}
			}
		}
	}
};

FirePaiShoBoard.prototype.playerControlsLessThanTwoGates = function(player) {
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

FirePaiShoBoard.prototype.playerHasNoGrowingFlowers = function(player) {
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

FirePaiShoBoard.prototype.revealSpecialFlowerPlacementPoints = function(player) {
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

FirePaiShoBoard.prototype.setGuestGateOpen = function() {
	var row = 16;
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

FirePaiShoBoard.prototype.revealFirstMovePlacement = function() {

	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {

			if (boardPoint.types.includes(CENTER)) {
				boardPoint.addType(POSSIBLE_MOVE);
			}
			
		});
	});
};

FirePaiShoBoard.prototype.revealPossiblePlacementPoints = function(tile) {
	var self = this;

	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			var valid = false;

			if (
				(tile.accentType === ROCK && self.canPlaceRock(boardPoint))
				|| (tile.accentType === WHEEL && self.canPlaceWheel(boardPoint))
				|| (tile.accentType === KNOTWEED && self.canPlaceKnotweed(boardPoint))
				|| (tile.accentType === BOAT && self.canPlaceBoat(boardPoint))
				|| (tile.accentType === BAMBOO && self.canPlaceBamboo(boardPoint, tile))
				|| (tile.accentType === POND && self.canPlacePond(boardPoint, tile))
				|| (tile.accentType === LION_TURTLE && self.canPlaceLionTurtle(boardPoint, tile))
				|| ((tile.type === BASIC_FLOWER || tile.type === SPECIAL_FLOWER) && self.canPlaceFlower(boardPoint, tile)) //is a flower tile
			) {
				valid = true;
			}

			if (valid) {
				boardPoint.addType(POSSIBLE_MOVE);
			}
		});
	});
};



FirePaiShoBoard.prototype.revealBoatBonusPoints = function(boardPoint) {
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

FirePaiShoBoard.prototype.getCopy = function() {
	var copyBoard = new FirePaiShoBoard();

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

FirePaiShoBoard.prototype.numTilesInGardensForPlayer = function(player) {
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

FirePaiShoBoard.prototype.numTilesOnBoardForPlayer = function(player) {
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

FirePaiShoBoard.prototype.getSurroundness = function(player) {
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


