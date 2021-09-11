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
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.gate(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[1] = this.newRow(11, 
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.redWhiteNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(), 
		SpiritBoardPoint.neutral()
		]);

	cells[2] = this.newRow(13, 
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.whiteNeutral(), 
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[3] = this.newRow(15,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.whiteNeutral(), 
		SpiritBoardPoint.white(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[4] = this.newRow(17,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.whiteNeutral(), 
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[5] = this.newRow(17,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.whiteNeutral(), 
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[6] = this.newRow(17,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.whiteNeutral(), 
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[7] = this.newRow(17,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.whiteNeutral(), 
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[8] = this.newRow(17,
		[SpiritBoardPoint.gate(),
		SpiritBoardPoint.redWhiteNeutral(), 
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.redWhiteNeutral(),
		SpiritBoardPoint.gate()
		]);

	cells[9] = this.newRow(17,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.redNeutral(), 
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.whiteNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[10] = this.newRow(17,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.redNeutral(), 
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.whiteNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[11] = this.newRow(17,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.redNeutral(), 
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.whiteNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[12] = this.newRow(17,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.redNeutral(), 
		SpiritBoardPoint.red(),
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.whiteNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[13] = this.newRow(15,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.redNeutral(), 
		SpiritBoardPoint.red(),
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.white(),
		SpiritBoardPoint.whiteNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[14] = this.newRow(13,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.redNeutral(), 
		SpiritBoardPoint.redWhite(),
		SpiritBoardPoint.whiteNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[15] = this.newRow(11,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.redWhiteNeutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
		]);

	cells[16] = this.newRow(9,
		[SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.gate(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral(),
		SpiritBoardPoint.neutral()
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

	var nonPoint = new SpiritBoardPoint();
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
	for (var i = 0; i < tileList.length; i++) {
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
	var potentialMovementPoints = this.getTileMovements(boardPointStart);
	if (!potentialMovementPoints.includes(boardPointEnd)) {
		return false;
	}
	
	// I guess we made it through
	return true;
};

SpiritBoard.prototype.getTileMovements = function(boardPoint) {
	tileMovements = [];
	this.recursiveAddMovement(tileMovements, boardPoint, 3, 0);
	return tileMovements;
};

/*function get_srrndng_spaces(tile,pos,dir,layer,maxlayer)
	if tile:can_go_thru(pos) then
		spaces = {{x=pos.x,y=pos.y}}
		if layer < maxlayer then
			if (dir != 0) then
			 spaces = combine(spaces,get_srrndng_spaces(tile,{x=pos.x+1,y=pos.y},2,layer+1,maxlayer))
			end
			if (dir != 1) then
			 spaces = combine(spaces,get_srrndng_spaces(tile,{x=pos.x,y=pos.y-1},3,layer+1,maxlayer))
			end
			if (dir != 2) then
			 spaces = combine(spaces,get_srrndng_spaces(tile,{x=pos.x-1,y=pos.y},0,layer+1,maxlayer))
			end
			if (dir != 3) then
			 spaces = combine(spaces,get_srrndng_spaces(tile,{x=pos.x,y=pos.y+1},1,layer+1,maxlayer))
			end
		end
		return spaces
	elseif tile:can_end_at(pos) then
		return {{x=pos.x,y=pos.y}}
	else
		return {}
	end
end
function flower:get_possible_pos()
	positions={}
	if self.onboard then
		if not self.trapped then
			positions=combine(positions,get_srrndng_spaces(self,{x=self.pos.x+1,y=self.pos.y},2,1,self.movement))
			positions=combine(positions,get_srrndng_spaces(self,{x=self.pos.x,y=self.pos.y-1},3,1,self.movement))
			positions=combine(positions,get_srrndng_spaces(self,{x=self.pos.x-1,y=self.pos.y},0,1,self.movement))
			positions=combine(positions,get_srrndng_spaces(self,{x=self.pos.x,y=self.pos.y+1},1,1,self.movement))
			foreach(positions, function(p)
				if (not self:can_end_at(p)) del(positions,p)
			end)
		end
	else
		if get_tile_or_false({x=0,y=8},tilesonboard)==false then
			add(positions, {x=0,y=8})
		end
		if get_tile_or_false({x=0,y=-8},tilesonboard)==false then
			add(positions, {x=0,y=-8})
		end
		if get_tile_or_false({x=8,y=0},tilesonboard)==false then
			add(positions, {x=8,y=0})
		end
		if get_tile_or_false({x=-8,y=0},tilesonboard)==false then
			add(positions, {x=-8,y=0})
		end
	end
	return positions
end */

SpiritBoard.prototype.recursiveAddMovement = function(tileMovements, boardPoint, numberOfMoves, direction) {
	if (!boardPoint) { return; } //End if it moves off the board
	//if (tileMovements.includes(boardPoint)) { return; } //End if this spot has been checked.

	tileMovements.push(boardPoint); //Add point to the list
	//PORTAL CHECK
	if (boardPoint.isType(GATE) && direction != 9) {
		if(boardPoint != this.cells[0][8]) {this.recursiveAddMovement(tileMovements, this.cells[0][8], numberOfMoves, 9);} //North Gate
		if(boardPoint != this.cells[8][0]) {this.recursiveAddMovement(tileMovements, this.cells[8][0], numberOfMoves, 9);} //West Gate
		if(boardPoint != this.cells[16][8]) {this.recursiveAddMovement(tileMovements, this.cells[16][8], numberOfMoves, 9);} //South Gate
		if(boardPoint != this.cells[8][16]) {this.recursiveAddMovement(tileMovements, this.cells[8][16], numberOfMoves, 9);} //East Gate
	}
	if (numberOfMoves > 0) {
		//UP
		if (direction != 4) {if(this.cells[boardPoint.row - 1]){this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row - 1][boardPoint.col], numberOfMoves-1, 2);}}
		//DOWN
		if (direction != 2) {if(this.cells[boardPoint.row + 1]){this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row + 1][boardPoint.col], numberOfMoves-1, 4);}}
		//RIGHT
		if (direction != 1) {this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row][boardPoint.col + 1], numberOfMoves-1, 3);}
		//LEFT
		if (direction != 3) {this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row][boardPoint.col - 1], numberOfMoves-1, 1);}
		//DIAGONALS
		if (this.onUpRightDiagonal(boardPoint)) {
			//UP+RIGHT
			if (direction != 5) {if(this.cells[boardPoint.row - 1]){this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row - 1][boardPoint.col + 1], numberOfMoves-1, 6);}}
			//DOWN+LEFT
			if (direction != 6) {if(this.cells[boardPoint.row + 1]){this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row + 1][boardPoint.col - 1], numberOfMoves-1, 5);}}
		}
		if (this.onUpLeftDiagonal(boardPoint)) {
			//UP+LEFT
			if (direction != 7) {if(this.cells[boardPoint.row - 1]){this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row - 1][boardPoint.col - 1], numberOfMoves-1, 8);}}
			//DOWN+RIGHT
			if (direction != 8) {if(this.cells[boardPoint.row + 1]){this.recursiveAddMovement(tileMovements, this.cells[boardPoint.row + 1][boardPoint.col + 1], numberOfMoves-1, 7);}}
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