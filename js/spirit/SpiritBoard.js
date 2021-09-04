// Spirit Board

function SpiritBoard() {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	this.winners = [];

	this.hlPlayed = false;
	this.glPlayed = false;
}

SpiritBoard.prototype.brandNew = function() {
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

SpiritBoard.prototype.newRow = function(numColumns, points) {
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

SpiritBoard.prototype.placeTile = function(tile, notationPoint, extraBoatPoint) {
	this.putTileOnPoint(tile, notationPoint);

	// Things to do after a tile is placed
	this.setPointFlags();
};
SpiritBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

SpiritBoard.prototype.getSurroundingRowAndCols = function(rowAndCol) {
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

SpiritBoard.prototype.getAdjacentRowAndCols = function(rowAndCol) {
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

SpiritBoard.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate();
};

SpiritBoard.prototype.placeInitialTiles = function(player, tileList) {
	for (var i = 0; i < 12; i++) {
		this.placeTile(tileList[i], tileList[i].getStartingPoint());
	}
};

SpiritBoard.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
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

	if (!tile) {
		debug("Error: No tile to move!");
	}

	var capturedTile;
	if (boardPointEnd.hasTile()) {
		capturedTile = boardPointEnd.removeTile();
	}

	boardPointEnd.putTile(tile);

	this.setPointFlags();

	return capturedTile;
};

SpiritBoard.prototype.setPointFlags = function() {
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

SpiritBoard.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	var tile = boardPointStart.tile;
	var otherTile = boardPointEnd.tile;

	return tile.canCapture(otherTile);
};

SpiritBoard.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
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

	//Tile Movement
	var potentialMovementPoints = this.getTileMovements(boardPointStart)
	if (!potentialMovementPoints.contains(boardPointEnd)) {
		return false;
	}
	
	// I guess we made it through
	return true;
};

SpiritBoard.prototype.getTileMovements = function(boardPoint) {
	tileMovements = [];
	this.recursiveAddMovement(tileMovements, boardPoint, 3);
	return tileMovements;
};

SpiritBoard.prototype.recursiveAddMovement = function(tileMovements, boardPoint, numberOfMoves) {
	if (boardPoint == undefined) { return; } //End if it moves off the board
	if (tileMovements.contains(boardPoint)) { return; } //End if this spot has been checked.

	tileMovements.push(boardPoint); //Add point to the list

	//PORTAL CHECK
	if (boardPoint.isType(GATE)) {
		this.recursiveAddMovement(tileMovements, this.cells[0][8], numberOfMoves); //North Gate
		this.recursiveAddMovement(tileMovements, this.cells[8][0], numberOfMoves); //West Gate
		this.recursiveAddMovement(tileMovements, this.cells[16][0], numberOfMoves); //South Gate
		this.recursiveAddMovement(tileMovements, this.cells[0][16], numberOfMoves); //East Gate
	}

	if (numberOfMoves > 0) {
		//UP
		this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row - 1][boardPoint.col], numberOfMoves-1);
		//DOWN
		this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row + 1][boardPoint.col], numberOfMoves-1);
		//RIGHT
		this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row][boardPoint.col + 1], numberOfMoves-1);
		//LEFT
		this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row][boardPoint.col - 1], numberOfMoves-1);
		//DIAGONALS
		if (this.onUpRightDiagonal(boardPoint)) {
			//UP+RIGHT
			this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row - 1][boardPoint.col + 1], numberOfMoves-1);
			//DOWN+LEFT
			this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row + 1][boardPoint.col - 1], numberOfMoves-1);
		}
		if (this.onUpLeftDiagonal(boardPoint)) {
			//UP+LEFT
			this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row - 1][boardPoint.col - 1], numberOfMoves-1);
			//DOWN+RIGHT
			this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row + 1][boardPoint.col + 1], numberOfMoves-1);
		}
	}
}

SpiritBoard.prototype.onUpRightDiagonal = function(boardPoint) {
	var notationPoint = new RowAndColumn(boardPoint.row, boardPoint.col).getNotationPoint();
	var x = notationPoint.x;
	var y = notationPoint.y;
	return x - y === 7 || x - y === -7;
};
SpiritBoard.prototype.onUpLeftDiagonal = function(boardPoint) {
	var notationPoint = new RowAndColumn(boardPoint.row, boardPoint.col).getNotationPoint();
	var x = notationPoint.x;
	var y = notationPoint.y;
	return x + y === 7 || x + y === -7;
};
SpiritBoard.prototype.diagonallyAdjacent = function(boardPointStart, boardPointEnd) {
	// If points are on the same diagonal, true
	return (this.onUpRightDiagonal(boardPointStart) && this.onUpRightDiagonal(boardPointEnd))
		|| (this.onUpLeftDiagonal(boardPointStart) && this.onUpLeftDiagonal(boardPointEnd));
};

SpiritBoard.prototype.pointsHaveFriendlyTiles = function(bp1, bp2) {
	return bp1.hasTile() 
		&& bp2.hasTile()
		&& bp1.tile.ownerCode === bp2.tile.ownerCode;
};

SpiritBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
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

SpiritBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

// CaptureBoard.prototype.setDeployPointsPossibleMoves = function(player, tileCode) {
// 	for (var row = 0; row < this.cells.length; row++) {
// 		for (var col = 0; col < this.cells[row].length; col++) {
// 			var bp = this.cells[row][col];
// 			if (!bp.hasTile()) {
// 				bp.addType(POSSIBLE_MOVE);
// 			}
// 		}
// 	}
// };

// SpiritBoard.prototype.revealPossiblePlacementPoints = function(tile) {
// 	var self = this;
// 	this.cells.forEach(function(row) {
// 		row.forEach(function(boardPoint) {
// 			var valid = false;
// 			if (valid) {
// 				boardPoint.addType(POSSIBLE_MOVE);
// 			}
// 		});
// 	});
// };

SpiritBoard.prototype.getPlayerTilesOnBoard = function(ownerName) {
	var playerTiles = [];
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (boardPoint.hasTile() && boardPoint.tile.ownerName === ownerName) {
				playerTiles.push(boardPoint.tile);
			}
		});
	});
	return playerTiles;
};

SpiritBoard.prototype.playerCanStillCapture = function(playerTiles, opponentTiles) {
	// For each player tile, check if it can capture any of opponent's tiles
	var canCaptureSomething = false;

	playerTiles.forEach(
		function(playerTile) {
			opponentTiles.forEach(
				function(opponentTile) {
					if (playerTile.canCapture(opponentTile)) {
						canCaptureSomething = true;
						return;
					}
				}
			);
			if (canCaptureSomething) {
				return;
			}
		}
	);

	return canCaptureSomething;
};

SpiritBoard.prototype.getTilesPlayerCanCapture = function(playerTiles, opponentTiles) {
	// For each player tile, check how many opponent's tiles can be captured
	var capturesPossible = [];

	playerTiles.forEach(
		function(playerTile) {
			opponentTiles.forEach(
				function(opponentTile) {
					if (!capturesPossible.includes(opponentTile) 
							&& playerTile.canCapture(opponentTile)) {
						capturesPossible.push(opponentTile);
					}
				}
			);
		}
	);

	return capturesPossible;
};

SpiritBoard.prototype.checkForEndOfGame = function() {
	if (this.winners.length > 0) {
		return;
	}

	// Check each player's tiles remaining on the board. All gone? No more captures possible?
	var hostTiles = this.getPlayerTilesOnBoard(HOST);
	var guestTiles = this.getPlayerTilesOnBoard(GUEST);

	//Check the number of immortal tiles each player has
	var hostImmortalNum = 0;
	for (var i = 0; i < hostTiles.length; i ++) {
		if (hostTiles[i].isImmortal(guestTiles)) {
			hostImmortalNum ++;
		}
	}
	var guestImmortalNum = 0;
	for (var i = 0; i < guestTiles.length; i ++) {
		if (guestTiles[i].isImmortal(hostTiles)) {
			guestImmortalNum ++;
		}
	}
	//2 or more means you win
	if (hostImmortalNum >= 2) {
		this.winners.push(HOST);
	}
	if (guestImmortalNum >= 2) {
		this.winners.push(GUEST);
	}
	
	var hostCannotCapture = !this.playerCanStillCapture(hostTiles, guestTiles);
	var guestCannotCapture = !this.playerCanStillCapture(guestTiles, hostTiles);
	if (hostCannotCapture && guestCannotCapture) {
		//Largest number of immortal tiles wins. If it's the same it will be a tie.
		if (hostImmortalNum >= guestImmortalNum) {
			this.winners.push(HOST);
		}
		if (guestImmortalNum >= hostImmortalNum) {
			this.winners.push(GUEST);
		}
	}
};

SpiritBoard.prototype.flagPointsTileCanCapture = function(tile) {
	var flaggedTiles = [];

	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (boardPoint.hasTile() && tile.canCapture(boardPoint.tile) && !boardPoint.tile.captureHelpFlag) {
				boardPoint.tile.captureHelpFlag = true;
				flaggedTiles.push(boardPoint.tile.id);
			}
		});
	});

	return flaggedTiles;
};

SpiritBoard.prototype.flagPointsTileCapturedBy = function(tile) {
	var flaggedTiles = [];

	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (boardPoint.hasTile() && boardPoint.tile.canCapture(tile) && !boardPoint.tile.capturedByHelpFlag) {
				boardPoint.tile.capturedByHelpFlag = true;
				flaggedTiles.push(boardPoint.tile.id);
			}
		});
	});

	return flaggedTiles;
};

SpiritBoard.prototype.clearCaptureHelp = function() {
	var unflaggedCaptureTiles = [];
	var unflaggedCapturedByTiles = [];

	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (boardPoint.hasTile() && boardPoint.tile.captureHelpFlag) {
				boardPoint.tile.captureHelpFlag = false;
				unflaggedCaptureTiles.push(boardPoint.tile.id);
			}
			if (boardPoint.hasTile() && boardPoint.tile.capturedByHelpFlag) {
				boardPoint.tile.capturedByHelpFlag = false;
				unflaggedCapturedByTiles.push(boardPoint.tile.id);
			}
		});
	});

	return {unflaggedCaptureTiles: unflaggedCaptureTiles, 
			unflaggedCapturedByTiles: unflaggedCapturedByTiles};
};