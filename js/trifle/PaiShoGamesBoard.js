// A more reusable and global Pai Sho Board

PaiShoGames.Board = function(tileManager, customAbilityActivationOrder) {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	// TODO Eventually remove Trifle-specific?:
	this.hostBannerPlayed = false;
	this.guestBannerPlayed = false;
	this.useBannerCaptureSystem = false;

	this.tileMetadata = PaiShoGames.currentTileMetadata;

	this.activeDurationAbilities = [];
	this.recordedTilePoints = {};

	this.tileManager = tileManager;

	this.abilityManager = new Trifle.AbilityManager(this, customAbilityActivationOrder);

	this.brainFactory = new Trifle.BrainFactory();
}

PaiShoGames.Board.prototype.brandNew = function () {
	var cells = [];

	cells[0] = this.newRow(9, 
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.gate(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[1] = this.newRow(11, 
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redWhiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(), 
		Trifle.BoardPoint.neutral()
		]);

	cells[2] = this.newRow(13, 
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[3] = this.newRow(15,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[4] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[5] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[6] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[7] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[8] = this.newRow(17,
		[Trifle.BoardPoint.gate(),
		Trifle.BoardPoint.redWhiteNeutral(), 
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhiteNeutral(),
		Trifle.BoardPoint.gate()
		]);

	cells[9] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[10] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[11] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[12] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[13] = this.newRow(15,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[14] = this.newRow(13,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[15] = this.newRow(11,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redWhiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[16] = this.newRow(9,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.gate(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].setRowAndCol(row, col);
		}
	}

	return cells;
};

PaiShoGames.Board.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new Trifle.BoardPoint();
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

PaiShoGames.Board.prototype.placeTile = function(tile, notationPoint) {
	this.tilesCapturedByTriggeredAbility = [];
	this.putTileOnPoint(tile, notationPoint);

	// TODO Eventually remove Trifle-specific?:
	if (Trifle.TileInfo.tileIsBanner(this.tileMetadata[tile.code])) {
		if (tile.ownerName === HOST) {
			this.hostBannerPlayed = true;
		} else {
			this.guestBannerPlayed = true;
		}
	}

	// Things to do after a tile is placed

	/* Process abilities after placing tile */
	var tileInfo = this.tileMetadata[tile.code];

	var boardPoint = this.getPointFromNotationPoint(notationPoint);

	var capturedTiles = [];

	this.processAbilities(tile, tileInfo, null, boardPoint, capturedTiles, {});

	return {
		capturedTiles: capturedTiles
	}
};

PaiShoGames.Board.prototype.getDistanceBetweenPoints = function(bp1, bp2) {
	return Math.abs(bp1.row - bp2.row) + Math.abs(bp1.col - bp2.col)
};

PaiShoGames.Board.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = this.getPointFromNotationPoint(notationPoint);
	
	point.putTile(tile);
	tile.seatedPoint = point;

	/* // Check if gigantic...
	var tileInfo = this.tileMetadata[tile.code];
	var self = this;
	if (tileInfo.attributes && tileInfo.attributes.length) {
		tileInfo.attributes.forEach(function(attributeInfo) {
			if (attributeInfo.type === Trifle.AttributeType.gigantic) {
				self.setGiganticPointsOccupied(tile, point);
			}
		});
	} */
};

PaiShoGames.Board.prototype.getGrowGiantOccupiedPoints = function(boardPointToGrowGigantic) {
	/* Gigantic points to occupy - to grow to 2x2 size */
	var tileToGrow = boardPointToGrowGigantic.tile;

	var row = boardPointToGrowGigantic.row;
	var col = boardPointToGrowGigantic.col;

	if (row < 16 && col < 16) {
		var occupyPoints = [];

		occupyPoints.push(this.cells[row+1][col]);
		occupyPoints.push(this.cells[row+1][col+1]);
		occupyPoints.push(this.cells[row][col+1]);

		var pointsAreAllPlayable = true;
		occupyPoints.forEach(function(point) {
			if (point.isType(NON_PLAYABLE)) {
				pointsAreAllPlayable = false;
			}
		});

		if (pointsAreAllPlayable) {
			return occupyPoints;
		}
	}
	return false;
};

PaiShoGames.Board.prototype.getPointFromNotationPoint = function(notationPoint) {
	if (notationPoint.isType) {	// Check if it's a BoardPoint object already
		return notationPoint;	// It's actually what we want already
	}
	var rowAndCol = notationPoint.rowAndColumn;
	return this.cells[rowAndCol.row][rowAndCol.col];
};

PaiShoGames.Board.prototype.getSurroundingRowAndCols = function(rowAndCol) {
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

PaiShoGames.Board.prototype.getSurroundingBoardPoints = function(initialBoardPoint) {
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

PaiShoGames.Board.prototype.getDiagonalBoardPoints = function(initialBoardPoint) {
	var diagonalPoints = [];
	for (var row = initialBoardPoint.row - 1; row <= initialBoardPoint.row + 1; row++) {
		for (var col = initialBoardPoint.col - 1; col <= initialBoardPoint.col + 1; col++) {
			if ((row !== initialBoardPoint.row || col !== initialBoardPoint.col)	// Not the center given point
				&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) {	// Not outside range of the grid
				var boardPoint = this.cells[row][col];
				if (!boardPoint.isType(NON_PLAYABLE)
						&& boardPoint.row !== initialBoardPoint.row 
						&& boardPoint.col !== initialBoardPoint.col) {
					diagonalPoints.push(boardPoint);
				}
			}
		}
	}
	return diagonalPoints;
};

PaiShoGames.Board.prototype.getAdjacentRowAndCols = function(rowAndCol) {
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
PaiShoGames.Board.prototype.getAdjacentPoints = function(boardPointStart) {
	return this.getAdjacentRowAndCols(boardPointStart);
};

PaiShoGames.Board.prototype.getAdjacentPointsPotentialPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
	var potentialMovePoints = [];

	if (!pointAlongTheWay) {
		pointAlongTheWay = originPoint;
	}
	var rowDifference = originPoint.row - pointAlongTheWay.row;
	var colDifference = originPoint.col - pointAlongTheWay.col;

	if (pointAlongTheWay.row > 0) {
		potentialMovePoints.push(this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col]);
	}
	if (pointAlongTheWay.row < paiShoBoardMaxRowOrCol) {
		potentialMovePoints.push(this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col]);
	}
	if (pointAlongTheWay.col > 0) {
		potentialMovePoints.push(this.cells[pointAlongTheWay.row][pointAlongTheWay.col - 1]);
	}
	if (pointAlongTheWay.col < paiShoBoardMaxRowOrCol) {
		potentialMovePoints.push(this.cells[pointAlongTheWay.row][pointAlongTheWay.col + 1]);
	}

	var finalPoints = [];

	potentialMovePoints.forEach(function(potentialMovePoint) {
		if (!potentialMovePoint.isType(NON_PLAYABLE) && !potentialMovePoint.isPossibleForMovementType(movementInfo)) {
			var newRowDiff = originPoint.row - potentialMovePoint.row;
			var newColDiff = originPoint.col - potentialMovePoint.col;
			if (!mustPreserveDirection
					|| (rowDifference >= 0 && newRowDiff >= 0 && newColDiff === 0)
					|| (rowDifference <= 0 && newRowDiff <= 0 && newColDiff === 0)
					|| (colDifference >= 0 && newColDiff >= 0 && newRowDiff === 0)
					|| (colDifference <= 0 && newColDiff <= 0 && newRowDiff === 0)
			) {
				finalPoints.push(potentialMovePoint);
			}
		}
	});

	return finalPoints;
};

PaiShoGames.Board.prototype.getAdjacentDiagonalPointsPotentialPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
	var diagonalPoints = [];

	if (!pointAlongTheWay) {
		pointAlongTheWay = originPoint;
	}
	var rowDifference = originPoint.row - pointAlongTheWay.row;
	var colDifference = originPoint.col - pointAlongTheWay.col;

	if (
			(!mustPreserveDirection || (mustPreserveDirection && rowDifference >= 0 && colDifference >= 0))
			&& (pointAlongTheWay.row > 0 && pointAlongTheWay.col > 0)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && rowDifference <= 0 && colDifference <= 0))
			&& (pointAlongTheWay.row < paiShoBoardMaxRowOrCol && pointAlongTheWay.col < paiShoBoardMaxRowOrCol)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference >= 0 && rowDifference <= 0))
			&& (pointAlongTheWay.col > 0 && pointAlongTheWay.row < paiShoBoardMaxRowOrCol)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference <= 0 && rowDifference >= 0))
			&& (pointAlongTheWay.col < paiShoBoardMaxRowOrCol && pointAlongTheWay.row > 0)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			diagonalPoints.push(adjacentPoint);
		}
	}

	return diagonalPoints;
};

PaiShoGames.Board.prototype.calculateSlopeBetweenPoints = function(p1, p2) {
	var rise = p2.row - p1.row;
	var run = p2.col - p1.col;
	var slope = run === 0 ? 0 : rise / run;
	return slope;
};

PaiShoGames.Board.prototype.getNextPointsForTravelShapeMovement = function(movementInfo, moveStepNumber, originPoint, pointAlongTheWay, currentMovementPath, mustPreserveDirection) {
	var nextPoints = [];
	if (movementInfo.shape && movementInfo.shape.length > 0) {
		var travelDirection = movementInfo.shape[moveStepNumber];
		if (moveStepNumber === 0) {
			/* Direction must be 'any' */
			if (travelDirection === Trifle.MoveDirection.any) {
				nextPoints = this.getAdjacentPoints(pointAlongTheWay);
			}
		} else {
			var directionalMovements = this.getDirectionalMovements(currentMovementPath);
			if (directionalMovements[Trifle.MoveDirection.left] 
					&& (travelDirection === Trifle.MoveDirection.left || travelDirection === Trifle.MoveDirection.turn)) {
				nextPoints.push(directionalMovements[Trifle.MoveDirection.left]);
			}
			if (directionalMovements[Trifle.MoveDirection.right]
					&& (travelDirection === Trifle.MoveDirection.right || travelDirection === Trifle.MoveDirection.turn)) {
				nextPoints.push(directionalMovements[Trifle.MoveDirection.right]);
			}
			if (directionalMovements[Trifle.MoveDirection.straight] && travelDirection === Trifle.MoveDirection.straight) {
				nextPoints.push(directionalMovements[Trifle.MoveDirection.straight]);
			}
		}
	}
	return nextPoints;
};

PaiShoGames.Board.prototype.getDirectionalMovements = function(currentMovementPath) {
	var directionalMovements = {};
	if (currentMovementPath.length > 1) {
		var p1 = currentMovementPath[currentMovementPath.length - 2];
		var p2 = currentMovementPath[currentMovementPath.length - 1];

		if (p2.col > p1.col) {
			if (p2.row - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.left] = this.cells[p2.row - 1][p2.col];
			}
			if (p2.row + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.right] = this.cells[p2.row + 1][p2.col];
			}
			if (p2.col + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.straight] = this.cells[p2.row][p2.col + 1];
			}
		} else if (p2.col < p1.col) {
			if (p2.row + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.left] = this.cells[p2.row + 1][p2.col];
			}
			if (p2.row - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.right] = this.cells[p2.row - 1][p2.col];
			}
			if (p2.col - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.straight] = this.cells[p2.row][p2.col - 1];
			}
		} else if (p2.row > p1.row) {
			if (p2.col + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.left] = this.cells[p2.row][p2.col + 1];
			}
			if (p2.col - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.right] = this.cells[p2.row][p2.col - 1];
			}
			if (p2.row + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.straight] = this.cells[p2.row + 1][p2.col];
			}
		} else if (p2.row < p1.row) {
			if (p2.col - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.left] = this.cells[p2.row][p2.col - 1];
			}
			if (p2.col + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.right] = this.cells[p2.row][p2.col + 1];
			}
			if (p2.row - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.straight] = this.cells[p2.row - 1][p2.col];
			}
		}
	}
	return directionalMovements;
};

PaiShoGames.Board.prototype.getNextPointsForJumpShapeMovement = function(movementInfo, originPoint, pointAlongTheWay, mustPreserveDirection) {
	var pointsStartingWithRowStep = [];
	var pointsStartingWithColStep = [];
	var finalPoints = [];
	var slope = this.calculateSlopeBetweenPoints(originPoint, pointAlongTheWay);
	if (movementInfo.shape && movementInfo.shape.length > 0) {
		/* `shape` should only ever have two numbers, but this will work for any number of numbers. */
		for (var stepNum = 0; stepNum < movementInfo.shape.length; stepNum++) {
			var stepDistance = movementInfo.shape[stepNum];
			if (stepNum === 0) {
				pointsStartingWithRowStep = this.getPointsWithMoveStepAppliedToRow([pointAlongTheWay], stepDistance);
				pointsStartingWithColStep = this.getPointsWithMoveStepAppliedToCol([pointAlongTheWay], stepDistance);
			} else if (stepNum % 2 === 1) {	/* odd: 1,3,5... */
				pointsStartingWithRowStep = this.getPointsWithMoveStepAppliedToCol(pointsStartingWithRowStep, stepDistance);
				pointsStartingWithColStep = this.getPointsWithMoveStepAppliedToRow(pointsStartingWithColStep, stepDistance);
			} else if (stepNum % 2 === 0) {	/* even: 2,4,6... */
				pointsStartingWithRowStep = this.getPointsWithMoveStepAppliedToRow(pointsStartingWithRowStep, stepDistance);
				pointsStartingWithColStep = this.getPointsWithMoveStepAppliedToCol(pointsStartingWithColStep, stepDistance);
			}
		}

		var possibleNextPoints = pointsStartingWithRowStep.concat(pointsStartingWithColStep);
		var self = this;
		var reallyMustPreserveDirection = mustPreserveDirection && slope !== 0;
		possibleNextPoints.forEach(function(point) {
			if (!point.isType(NON_PLAYABLE) && !point.isPossibleForMovementType(movementInfo)
					&& (!reallyMustPreserveDirection || self.calculateSlopeBetweenPoints(pointAlongTheWay, point) === slope)) {
				finalPoints.push(point);
			}
		});
	}

	return finalPoints;
};
PaiShoGames.Board.prototype.getPointsWithMoveStepAppliedToRow = function(startPoints, stepDistance) {
	var nextPoints = [];
	if (startPoints && startPoints.length) {
		var self = this;
		startPoints.forEach(function(boardPointStart) {
			var nextRow1 = boardPointStart.row + stepDistance;
			if (nextRow1 <= paiShoBoardMaxRowOrCol) {
				var possibleNextPoint = self.cells[nextRow1][boardPointStart.col];
				if (!possibleNextPoint.isType(NON_PLAYABLE)) {
					nextPoints.push(possibleNextPoint);
				}
			}
			var nextRow2 = boardPointStart.row - stepDistance;
			if (nextRow2 >= 0) {
				var possibleNextPoint = self.cells[nextRow2][boardPointStart.col];
				if (!possibleNextPoint.isType(NON_PLAYABLE)) {
					nextPoints.push(possibleNextPoint);
				}
			}
		});
	}
	return nextPoints;
};
PaiShoGames.Board.prototype.getPointsWithMoveStepAppliedToCol = function(startPoints, stepDistance) {
	var nextPoints = [];
	if (startPoints && startPoints.length) {
		var self = this;
		startPoints.forEach(function(boardPointStart) {
			var nextCol1 = boardPointStart.col + stepDistance;
			if (nextCol1 <= paiShoBoardMaxRowOrCol) {
				var possibleNextPoint = self.cells[boardPointStart.row][nextCol1];
				if (!possibleNextPoint.isType(NON_PLAYABLE)) {
					nextPoints.push(possibleNextPoint);
				}
			}
			var nextCol2 = boardPointStart.col - stepDistance;
			if (nextCol2 >= 0) {
				var possibleNextPoint = self.cells[boardPointStart.row][nextCol2];
				if (!possibleNextPoint.isType(NON_PLAYABLE)) {
					nextPoints.push(possibleNextPoint);
				}
			}
		});
	}
	return nextPoints;
};

PaiShoGames.Board.prototype.targetTileMatchesTargetTeam = function(targetTile, originTile, targetTeams) {
	var matchesTargetTeam = false;

	targetTeams.forEach(function(targetTeam) {
		if (targetTeam === Trifle.TileTeam.friendly && targetTile.ownerName === originTile.ownerName) {
			matchesTargetTeam = true;
		} else if (targetTeam === Trifle.TileTeam.enemy && targetTile.ownerName !== originTile.ownerName) {
			matchesTargetTeam = true;
		}
	});

	return matchesTargetTeam;
};

PaiShoGames.Board.prototype.getJumpSurroundingTilesPointsPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
	var potentialMovePoints = [];

	var finalPoints = [];

	if (!pointAlongTheWay) {
		pointAlongTheWay = originPoint;
	}

	var surroundingPoints = this.getSurroundingBoardPoints(pointAlongTheWay);

	var self = this;
	surroundingPoints.forEach(function(surroundingPoint) {
		if (surroundingPoint.hasTile() && self.targetTileMatchesTargetTeam(surroundingPoint.tile, originPoint.tile, movementInfo.targetTeams)) {
			potentialMovePoints = [];

			if (movementInfo.jumpDirections && movementInfo.jumpDirections.includes(Trifle.MovementDirection.diagonal)
					&& surroundingPoint.row !== pointAlongTheWay.row && surroundingPoint.col !== pointAlongTheWay.col) {
				potentialMovePoints = potentialMovePoints.concat(self.getSurroundingBoardPoints(surroundingPoint));
			}
			if (movementInfo.jumpDirections && movementInfo.jumpDirections.includes(Trifle.MovementDirection.orthogonal)
					&& (surroundingPoint.row === pointAlongTheWay.row || surroundingPoint.col === pointAlongTheWay.col)) {
				potentialMovePoints = potentialMovePoints.concat(self.getSurroundingBoardPoints(surroundingPoint));
			}

			var slopeToSurrounding = self.calculateSlopeBetweenPoints(pointAlongTheWay, surroundingPoint);

			potentialMovePoints.forEach(function(potentialMovePoint) {
				var slopeToPotential = self.calculateSlopeBetweenPoints(pointAlongTheWay, potentialMovePoint);
				if (!potentialMovePoint.hasTile() && slopeToPotential === slopeToSurrounding) {	// TODO: Or can capture?
					finalPoints.push(potentialMovePoint);
				}
			});
		}
	});

	return finalPoints;
};

PaiShoGames.Board.prototype.getAwayFromTilePossibleMoves = function(targetTilePoint, originPoint, boardPointAlongTheWay) {
	var movePoints = [];

	// Get points surrounding this one. The one that is farther away from targetTilePoint with same slope is the one
	var surroundingPoints = this.getSurroundingBoardPoints(boardPointAlongTheWay);

	var originalDistance = this.getDistanceBetweenPoints(targetTilePoint, originPoint);
	var originalSlope = this.calculateSlopeBetweenPoints(targetTilePoint, originPoint);

	surroundingPoints.forEach((surroundingPoint) => {
		if (!surroundingPoint.hasTile()) {
			var distance = this.getDistanceBetweenPoints(targetTilePoint, surroundingPoint);
			var slope = this.calculateSlopeBetweenPoints(targetTilePoint, surroundingPoint);

			if (slope === originalSlope && distance > originalDistance) {
				movePoints.push(surroundingPoint);
			}
		}
	});

	return movePoints;
};

PaiShoGames.Board.prototype.getAwayFromTileOrthogonalPossibleMoves = function(targetTilePoint, originPoint, boardPointAlongTheWay) {
	var movePoints = [];

	// Get points adjacent to this one. The one that is farther away from targetTilePoint with same slope is the one
	var adjacentPoints = this.getAdjacentPoints(boardPointAlongTheWay);

	var originalDistance = this.getDistanceBetweenPoints(targetTilePoint, originPoint);
	var originalSlope = this.calculateSlopeBetweenPoints(targetTilePoint, originPoint);

	adjacentPoints.forEach((surroundingPoint) => {
		if (!surroundingPoint.hasTile()) {
			var distance = this.getDistanceBetweenPoints(targetTilePoint, surroundingPoint);
			var slope = this.calculateSlopeBetweenPoints(targetTilePoint, surroundingPoint);

			if (slope === originalSlope && distance > originalDistance) {
				movePoints.push(surroundingPoint);
			}
		}
	});

	return movePoints;
};

PaiShoGames.Board.prototype.getAwayFromTileDiagonalPossibleMoves = function(targetTilePoint, originPoint, boardPointAlongTheWay) {
	var movePoints = [];

	// Get points diagonal to this one. The one that is farther away from targetTilePoint with same slope is the one
	var diagonalPoints = this.getDiagonalBoardPoints(boardPointAlongTheWay);

	var originalDistance = this.getDistanceBetweenPoints(targetTilePoint, originPoint);
	var originalSlope = this.calculateSlopeBetweenPoints(targetTilePoint, originPoint);

	diagonalPoints.forEach((surroundingPoint) => {
		if (!surroundingPoint.hasTile()) {
			var distance = this.getDistanceBetweenPoints(targetTilePoint, surroundingPoint);
			var slope = this.calculateSlopeBetweenPoints(targetTilePoint, surroundingPoint);

			if (slope === originalSlope && distance > originalDistance) {
				movePoints.push(surroundingPoint);
			}
		}
	});

	return movePoints;
};

PaiShoGames.Board.prototype.getPointsNextToTilesInLineOfSight = function(movementInfo, originPoint) {
	var jumpPoints = [];
	if (movementInfo.type === Trifle.MovementType.jumpAlongLineOfSight && movementInfo.targetTileTypes) {
		/* Scan in all directions, if a tile found, see if it can be jumped to */
		var tileFound = false;
		for (var row = originPoint.row + 1; row < paiShoBoardMaxRowOrCol && !tileFound; row++) {
			var checkPoint = this.cells[row+1][originPoint.col]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = this.tileMetadata[checkPoint.tile.code];
				if (checkPointTileInfo && Trifle.TileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[row][originPoint.col]);
				}
			}
		}

		tileFound = false;
		for (var row = originPoint.row - 1; row > 0 && !tileFound; row--) {
			var checkPoint = this.cells[row-1][originPoint.col]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = this.tileMetadata[checkPoint.tile.code];
				if (checkPointTileInfo && Trifle.TileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[row][originPoint.col]);
				}
			}
		}

		tileFound = false;
		for (var col = originPoint.col + 1; col < paiShoBoardMaxRowOrCol && !tileFound; col++) {
			var checkPoint = this.cells[originPoint.row][col+1]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = this.tileMetadata[checkPoint.tile.code];
				if (checkPointTileInfo && Trifle.TileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[originPoint.row][col]);
				}
			}
		}

		tileFound = false;
		for (var col = originPoint.col - 1; col > 0 && !tileFound; col--) {
			var checkPoint = this.cells[originPoint.row][col-1]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = this.tileMetadata[checkPoint.tile.code];
				if (checkPointTileInfo && Trifle.TileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[originPoint.row][col]);
				}
			}
		}
	}
	return jumpPoints;
};

PaiShoGames.Board.prototype.getPointsForTilesInLineOfSight = function(originPoint) {
	var lineOfSightPoints = [];
	
	/* Scan in all directions, if a tile found, add to list */
	var tileFound = false;
	for (var row = originPoint.row + 1; row <= paiShoBoardMaxRowOrCol && !tileFound; row++) {
		var checkPoint = this.cells[row][originPoint.col];
		if (checkPoint.hasTile()) {
			tileFound = true;
			lineOfSightPoints.push(this.cells[row][originPoint.col]);
		}
	}

	tileFound = false;
	for (var row = originPoint.row - 1; row >= 0 && !tileFound; row--) {
		var checkPoint = this.cells[row][originPoint.col];
		if (checkPoint.hasTile()) {
			tileFound = true;
			lineOfSightPoints.push(this.cells[row][originPoint.col]);
		}
	}

	tileFound = false;
	for (var col = originPoint.col + 1; col <+ paiShoBoardMaxRowOrCol && !tileFound; col++) {
		var checkPoint = this.cells[originPoint.row][col];
		if (checkPoint.hasTile()) {
			tileFound = true;
			lineOfSightPoints.push(this.cells[originPoint.row][col]);
		}
	}

	tileFound = false;
	for (var col = originPoint.col - 1; col >= 0 && !tileFound; col--) {
		var checkPoint = this.cells[originPoint.row][col];
		if (checkPoint.hasTile()) {
			tileFound = true;
			lineOfSightPoints.push(this.cells[originPoint.row][col]);
		}
	}
	
	return lineOfSightPoints;
};

PaiShoGames.Board.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate();
};

PaiShoGames.Board.prototype.debugPointsOccupiedByAbility = function() {
	this.forEachBoardPoint(function(bp) {
		if (bp.occupiedByAbility) {
			debug(bp);
		}
		if (bp.otherPointsOccupied) {
			debug("Occupies other points:");
			debug(bp);
		}
	});
};

PaiShoGames.Board.prototype.moveTile = function(player, notationPointStart, notationPointEnd, currentMoveInfo) {
	this.tilesCapturedByTriggeredAbility = [];

	if (!notationPointStart.rowAndColumn) {	// Assume String representation of points if no rowAndColumn property
		notationPointStart = new NotationPoint(notationPointStart);
	}
	if (!notationPointEnd.rowAndColumn) {
		notationPointEnd = new NotationPoint(notationPointEnd);
	}

	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
		return false;
	}

	var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
	var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

	/* Does tile occupy other spaces? If so, remove the tile from those points */
	if (boardPointStart.otherPointsOccupied && boardPointStart.otherPointsOccupied.length) {
		boardPointStart.otherPointsOccupied.forEach(function(occupiedPoint) {
			occupiedPoint.occupiedByAbility = false;
			occupiedPoint.pointOccupiedBy = null;
			occupiedPoint.removeTile();
		});
	}

	var capturedTiles = [];

	/* If movement path is needed, get that */
	var movementPath = null;
	var tileInfo = this.tileMetadata[boardPointStart.tile.code];
	/* If tile has only one movement and has charge capture, if there is only one
	|* movement path, then we have all we need to perform the ability. */
	if (Trifle.TileInfo.tileHasOnlyOneMovement(tileInfo)
			&& Trifle.TileInfo.tileHasMovementAbility(tileInfo, Trifle.MovementAbility.chargeCapture)) {
		this.setPossibleMovePoints(boardPointStart);
		movementPath = boardPointEnd.getOnlyPossibleMovementPath();
		this.removePossibleMovePoints();

		var self = this;
		movementPath.forEach(function(movePathPoint) {
			if (movePathPoint.hasTile() && movePathPoint !== boardPointStart) {
				capturedTiles.push(self.captureTileOnPoint(movePathPoint));
				// capturedTiles.push(movePathPoint.removeTile());
			}
		});
	}

	var tile = boardPointStart.removeTile();

	if (!tile) {
		debug("Error: No tile to move!");
	}

	/* // If tile is capturing a Banner tile, there's a winner
	// This now happens in `captureTileOnPoint` function
	if (boardPointEnd.hasTile() 
			&& Trifle.TileInfo.tileIsBanner(this.tileMetadata[boardPointEnd.tile.code])
			&& tile.ownerName !== boardPointEnd.tile.ownerName) {
		this.winners.push(tile.ownerName);
	} */

	if (boardPointEnd.hasTile() && !capturedTiles.includes(boardPointEnd.tile)) {
		// capturedTiles.push(boardPointEnd.tile);
		capturedTiles.push(this.captureTileOnPoint(boardPointEnd));
	}

	capturedTiles.forEach((capturedTile) => {
		capturedTile.beingCaptured = true;
	});

	boardPointEnd.putTile(tile);
	tile.seatedPoint = boardPointEnd;

	this.setPointFlags();

	/* Process abilities after moving a tile */

	/* Follow Order of Abilities and Triggers in Trifle documentation */
	
	var abilityActivationFlags = this.processAbilities(tile, tileInfo, boardPointStart, boardPointEnd, capturedTiles, currentMoveInfo);

	return {
		movedTile: tile,
		startPoint: boardPointStart,
		endPoint: boardPointEnd,
		capturedTiles: capturedTiles,
		abilityActivationFlags: abilityActivationFlags
	}
};

/**
 * Process abilities on the board after a tile is moved or placed/deployed.
 * `boardPointStart` will probably be null for when a tile is placed.
 */
PaiShoGames.Board.prototype.processAbilities = function(tileMovedOrPlaced, tileMovedOrPlacedInfo, boardPointStart, boardPointEnd, capturedTiles, currentMoveInfo, existingAbilityActivationFlags) {
	if (!currentMoveInfo) {
		currentMoveInfo = {};
	}

	var abilitiesToActivate = {};
	var abilitiesWithPromptTargetsNeeded = [];

	/* 
	- Get abilities that should be active/activated
	- Activate/process them (if already active, skip)
	- Save ongoing active abilities

	Triggers to look at:
	- When Tile Moves From Within Zone
	- When Tile Captures
	- When Tile Lands In Zone
	- While Tile is In Line of Sight
	- While Inside of Temple
	- While Outside of Temple
	... Oh, yeah, it's all of them.. but in that order!

	Actually no, abilities will fire in order based on ability type.
	*/

	var self = this;

	this.forEachBoardPointWithTile(function(pointWithTile) {
		var tile = pointWithTile.tile;
		var tileInfo = self.tileMetadata[tile.code];
		if (tileInfo.abilities) {
			tileInfo.abilities.forEach(function(tileAbilityInfo) {
				var allTriggerConditionsMet = true;

				var triggerBrainMap = {};

				var triggerContext = {
					board: self,
					pointWithTile: pointWithTile,
					tile: tile,
					tileInfo: tileInfo,
					tileAbilityInfo: tileAbilityInfo,
					lastTurnAction: {
						tileMovedOrPlaced: tileMovedOrPlaced,
						tileMovedOrPlacedInfo: tileMovedOrPlacedInfo,
						boardPointStart: boardPointStart,
						boardPointEnd: boardPointEnd,
						capturedTiles: capturedTiles
					},
					isPassiveMovement: currentMoveInfo.isPassiveMovement
				};

				var triggers = tileAbilityInfo.triggers;
				if (triggers && triggers.length) {
					triggers.forEach(function(triggerInfo) {
						if (Trifle.TriggerHelper.hasInfo(triggerInfo)) {
							triggerContext.currentTrigger = triggerInfo;
							var brain = self.brainFactory.createTriggerBrain(triggerInfo, triggerContext);
							if (brain && brain.isTriggerMet && self.activationRequirementsAreMet(triggerInfo, tile, triggerContext)) {
								if (allTriggerConditionsMet && brain.isTriggerMet()) {
									triggerBrainMap[triggerInfo.triggerType] = brain;
								} else {
									allTriggerConditionsMet = false;
								}
							} else {
								allTriggerConditionsMet = false;
							}
						}
					});
				}

				if (allTriggerConditionsMet) {
					var abilityContext = {
						board: self,
						pointWithTile: pointWithTile,
						tile: tile,
						tileInfo: tileInfo,
						tileAbilityInfo: tileAbilityInfo,
						triggerBrainMap: triggerBrainMap,
						promptTargetInfo: currentMoveInfo.promptTargetData,
						isPassiveMovement: currentMoveInfo.isPassiveMovement
					}
					var abilityObject = new Trifle.Ability(abilityContext);

					// if (abilityObject.worthy()) {
						if (!abilityObject.hasNeededPromptTargetInfo()) {
							abilitiesWithPromptTargetsNeeded.push(abilityObject);
						}

						var thisKindOfAbilityList = abilitiesToActivate[tileAbilityInfo.type];

						if (thisKindOfAbilityList && thisKindOfAbilityList.length) {
							abilitiesToActivate[tileAbilityInfo.type].push(abilityObject);
						} else {
							abilitiesToActivate[tileAbilityInfo.type] = [abilityObject];
						}
					// }
				}
			});
		}
	});

	capturedTiles.forEach(function(capturedTile) {
		var tile = capturedTile;
		var tileInfo = self.tileMetadata[tile.code];

		if (tileInfo.abilities) {
			tileInfo.abilities.forEach(function(tileAbilityInfo) {
				/* Check that ability trigger is "When Captured By Target Tile" - or in future, any other triggers that apply to captured tiles */
				if (Trifle.TileInfo.tileAbilityIsTriggeredWhenCaptured(tileAbilityInfo)) {
					var allTriggerConditionsMet = true;

					var triggerBrainMap = {};

					var triggerContext = {
						board: self,
						pointWithTile: null,
						tile: tile,
						tileInfo: tileInfo,
						tileAbilityInfo: tileAbilityInfo,
						lastTurnAction: {
							tileMovedOrPlaced: tileMovedOrPlaced,
							tileMovedOrPlacedInfo: tileMovedOrPlacedInfo,
							boardPointStart: boardPointStart,
							boardPointEnd: boardPointEnd,
							capturedTiles: capturedTiles
						},
						isPassiveMovement: currentMoveInfo.isPassiveMovement
					};

					var triggers = tileAbilityInfo.triggers;
					if (triggers && triggers.length) {
						triggers.forEach(function(triggerInfo) {
							if (Trifle.TriggerHelper.hasInfo(triggerInfo)) {
								triggerContext.currentTrigger = triggerInfo;
								var brain = self.brainFactory.createTriggerBrain(triggerInfo, triggerContext);
								if (brain && brain.isTriggerMet && self.activationRequirementsAreMet(triggerInfo, tile, triggerContext)) {
									if (allTriggerConditionsMet && brain.isTriggerMet()) {
										triggerBrainMap[triggerInfo.triggerType] = brain;
									} else {
										allTriggerConditionsMet = false;
									}
								} else {
									allTriggerConditionsMet = false;
								}
							}
						});
					}

					if (allTriggerConditionsMet) {
						var abilityContext = {
							board: self,
							pointWithTile: null,
							tile: tile,
							tileInfo: tileInfo,
							tileAbilityInfo: tileAbilityInfo,
							triggerBrainMap: triggerBrainMap,
							promptTargetInfo: currentMoveInfo.promptTargetData
						}
						var abilityObject = new Trifle.Ability(abilityContext);

						// if (abilityObject.worthy()) {
							if (!abilityObject.hasNeededPromptTargetInfo()) {
								abilitiesWithPromptTargetsNeeded.push(abilityObject);
							}

							var thisKindOfAbilityList = abilitiesToActivate[tileAbilityInfo.type];

							if (thisKindOfAbilityList && thisKindOfAbilityList.length) {
								abilitiesToActivate[tileAbilityInfo.type].push(abilityObject);
							} else {
								abilitiesToActivate[tileAbilityInfo.type] = [abilityObject];
							}
						// }
					}
				}
			});
		}
	});
	
	this.abilityManager.setReadyAbilities(abilitiesToActivate);
	this.abilityManager.setAbilitiesWithPromptTargetsNeeded(abilitiesWithPromptTargetsNeeded);

	// var promptingExpected = abilitiesWithPromptTargetsNeeded.length > 0;

	var abilityActivationFlags = this.abilityManager.activateReadyAbilitiesOrPromptForTargets();

	// if (promptingExpected && abilityActivationFlags.neededPromptInfo && !abilityActivationFlags.neededPromptInfo.currentPromptTargetId) {
	// 	abilityActivationFlags = this.abilityManager.activateReadyAbilitiesOrPromptForTargets();
	// }

	/* Debugging */
	debug(this.abilityManager.abilities);

	if (abilityActivationFlags.boardHasChanged) {
		// Need to re-process abilities... 
		// Pass in some sort of context from the activation flags???
		var nextAbilityActivationFlags = this.processAbilities(tileMovedOrPlaced, tileMovedOrPlacedInfo, boardPointStart, boardPointEnd, abilityActivationFlags.tileRecords.capturedTiles, currentMoveInfo, abilityActivationFlags);
		if (nextAbilityActivationFlags.tileRecords.capturedTiles && nextAbilityActivationFlags.tileRecords.capturedTiles.length) {
			if (!abilityActivationFlags.tileRecords.capturedTiles) {
				abilityActivationFlags.tileRecords.capturedTiles = [];
			}
			abilityActivationFlags.tileRecords.capturedTiles = abilityActivationFlags.tileRecords.capturedTiles.concat(nextAbilityActivationFlags.tileRecords.capturedTiles);
		}
		if (nextAbilityActivationFlags.neededPromptInfo) {
			abilityActivationFlags.neededPromptInfo = nextAbilityActivationFlags.neededPromptInfo;
		}
	}

	return abilityActivationFlags;
};

PaiShoGames.Board.prototype.getZonesPointIsWithin = function(boardPoint) {
	var pointsOfZones = [];
	var self = this;
	this.forEachBoardPointWithTile(function(checkPoint) {
		if (checkPoint != boardPoint
				&& self.pointTileZoneContainsPoint(checkPoint, boardPoint)) {
			pointsOfZones.push(checkPoint);
		}
	});
	return pointsOfZones;
};

PaiShoGames.Board.prototype.setPointFlags = function() {
	
};

PaiShoGames.Board.prototype.inLineWithAdjacentFlowerTileWithNothingBetween = function(bp, bp2) {
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

PaiShoGames.Board.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves, movingTile) {
  // Recursion!
  return this.pathFound(boardPointStart, boardPointEnd, numMoves, movingTile);
};

PaiShoGames.Board.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves, movingTile) {
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

PaiShoGames.Board.prototype.pointIsNextToOpponentTile = function(bp, originalPlayerCode, tileCode) {
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

PaiShoGames.Board.prototype.setPossibleMovePoints = function(boardPointStart) {
	if (boardPointStart.hasTile()) {
		var playerName = boardPointStart.tile.ownerName;

		var tileInfo = this.tileMetadata[boardPointStart.tile.code];

		this.currentlyDeployingTile = boardPointStart.tile;
		this.currentlyDeployingTileInfo = tileInfo;

		if (tileInfo) {
			var self = this;
			if (tileInfo.movements) {
				tileInfo.movements.forEach(function(movementInfo) {
					self.setPossibleMovesForMovement(movementInfo, boardPointStart);
				});
			}
			var bonusMovementInfoList = this.getBonusMovementInfoList(boardPointStart);
			if (bonusMovementInfoList && bonusMovementInfoList.length > 0) {
				bonusMovementInfoList.forEach(function(bonusMovementInfo) {
					self.setBonusMovementPossibleMoves(bonusMovementInfo, boardPointStart);
				});
			}
		}
	}
};

PaiShoGames.Board.prototype.getBonusMovementInfoList = function(originPoint) {
	var tile = originPoint.tile;
	var tileInfo = this.tileMetadata[originPoint.tile.code];

	var bonusMovementInfoList = [];

	var grantBonusMovementAbilities = this.abilityManager.getAbilitiesTargetingTile(Trifle.AbilityName.grantBonusMovement, tile);

	var self = this;
	grantBonusMovementAbilities.forEach(function(ability) {
		if (ability.abilityInfo.bonusMovement) {
			ability.abilityInfo.bonusMovement.movementFunction = self.determineMovementFunction(ability.abilityInfo.bonusMovement.type);
			bonusMovementInfoList.push(ability.abilityInfo.bonusMovement);
		}
	});

	return bonusMovementInfoList;
};

PaiShoGames.Board.prototype.determineMovementFunction = function(movementType) {
	if (movementType === Trifle.MovementType.standard) {
		return PaiShoGames.Board.standardMovementFunction;
	}
};

PaiShoGames.Board.prototype.getBonusMovementInfo = function(originPoint) {
	var playerName = originPoint.tile.ownerName;
	var tileInfo = this.tileMetadata[originPoint.tile.code];
	var bonusMovementInfo = {};
	/* this.tilePresenceAbilities.forEach(function(ability) {
		if (ability.playerName === playerName) {
			if (ability.abilityInfo.type === Trifle.BoardPresenceAbility.increaseFriendlyTileMovementDistance) {
				if (
						(
							ability.abilityInfo.targetTileTypes 
								&& arrayIncludesOneOf(ability.abilityInfo.targetTileTypes, tileInfo.types)
						)
						|| !ability.abilityInfo.targetTileTypes
					) {
					bonusMovementDistance = ability.abilityInfo.amount;
					bonusMovementInfo = {
						type: Trifle.MovementType.standard,
						distance: bonusMovementDistance,
						movementFunction: PaiShoGames.Board.standardMovementFunction
					}
				}
			}
		}
	}); */
	if (bonusMovementInfo.type) {
		return bonusMovementInfo;
	}
};

PaiShoGames.Board.prototype.setPossibleMovesForBonusMovement = function(movementInfo, originPoint, movementStartPoint, tile) {
	this.movementPointChecks = 0;
	var isImmobilized = this.tileMovementIsImmobilized(tile, movementInfo, originPoint);
	if (!isImmobilized) {
		if (movementInfo.type === Trifle.MovementType.standard) {
			/* Standard movement, moving and turning as you go */
			this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGames.Board.standardMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.diagonal) {
			/* Diagonal movement, jumping across the lines up/down/left/right as looking at the board */
			this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGames.Board.diagonalMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.jumpAlongLineOfSight) {
			/* Jump to tiles along line of sight */
			this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGames.Board.jumpAlongLineOfSightMovementFunction, tile, movementInfo, movementStartPoint, 1, 0);
		} else if (movementInfo.type === Trifle.MovementType.withinFriendlyTileZone) {
			this.setMovePointsWithinTileZone(movementStartPoint, tile.ownerName, tile, movementInfo);
		} else if (movementInfo.type === Trifle.MovementType.anywhere) {
			this.setMovePointsAnywhere(movementStartPoint, movementInfo);
		} else if (movementInfo.type === Trifle.MovementType.jumpShape) {
			this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGames.Board.jumpShapeMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.travelShape) {
			this.setPossibleMovementPointsFromMovePointsOnePathAtATime(PaiShoGames.Board.travelShapeMovementFunction, tile, movementInfo, movementStartPoint, movementStartPoint, movementInfo.shape.length, 0, [movementStartPoint]);
		} else if (movementInfo.type === Trifle.MovementType.jumpSurroundingTiles) {
			this.setPossibleMovementPointsFromMovePoints([movementStartPoint], PaiShoGames.Board.jumpSurroundingTilesMovementFunction, tile, movementInfo, movementStartPoint, movementInfo.distance, 0);
		}
	}
	// debug("Movement Point Checks: " + this.movementPointChecks);
};

PaiShoGames.Board.prototype.setPossibleMovesForMovement = function(movementInfo, boardPointStart) {
	this.movementPointChecks = 0;
	var isImmobilized = this.tileMovementIsImmobilized(boardPointStart.tile, movementInfo, boardPointStart);
	if (!isImmobilized) {
		if (movementInfo.type === Trifle.MovementType.standard) {
			/* Standard movement, moving and turning as you go */
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGames.Board.standardMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.diagonal) {
			/* Diagonal movement, jumping across the lines up/down/left/right as looking at the board */
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGames.Board.diagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.jumpAlongLineOfSight) {
			/* Jump to tiles along line of sight */
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGames.Board.jumpAlongLineOfSightMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, 1, 0);
		} else if (movementInfo.type === Trifle.MovementType.withinFriendlyTileZone) {
			this.setMovePointsWithinTileZone(boardPointStart, boardPointStart.tile.ownerName, boardPointStart.tile, movementInfo);
		} else if (movementInfo.type === Trifle.MovementType.anywhere) {
			this.setMovePointsAnywhere(boardPointStart, movementInfo);
		} else if (movementInfo.type === Trifle.MovementType.jumpShape) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGames.Board.jumpShapeMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.travelShape) {
			this.setPossibleMovementPointsFromMovePointsOnePathAtATime(PaiShoGames.Board.travelShapeMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, boardPointStart, movementInfo.shape.length, 0, [boardPointStart]);
		} else if (movementInfo.type === Trifle.MovementType.jumpSurroundingTiles) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGames.Board.jumpSurroundingTilesMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.awayFromTargetTile) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGames.Board.awayFromTargetTileOrthogonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.awayFromTargetTileOrthogonal) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGames.Board.awayFromTargetTileOrthogonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.awayFromTargetTileDiagonal) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], PaiShoGames.Board.awayFromTargetTileDiagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		}
	}
	// debug("Movement Point Checks: " + this.movementPointChecks);
};
PaiShoGames.Board.standardMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	var mustPreserveDirection = Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
	return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
};
PaiShoGames.Board.diagonalMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	var mustPreserveDirection = Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
	return board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
};
PaiShoGames.Board.jumpAlongLineOfSightMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	return board.getPointsNextToTilesInLineOfSight(movementInfo, originPoint);
};
PaiShoGames.Board.jumpShapeMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	var mustPreserveDirection = Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
	return board.getNextPointsForJumpShapeMovement(movementInfo, originPoint, boardPointAlongTheWay, mustPreserveDirection);
};
PaiShoGames.Board.travelShapeMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber, currentMovementPath) {
	var mustPreserveDirection = Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
	return board.getNextPointsForTravelShapeMovement(movementInfo, moveStepNumber, originPoint, boardPointAlongTheWay, currentMovementPath, mustPreserveDirection);
};
PaiShoGames.Board.jumpSurroundingTilesMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, movementStepNumber) {
	var mustPreserveDirection = Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
	return board.getJumpSurroundingTilesPointsPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
};
PaiShoGames.Board.awayFromTargetTileMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	if (movementInfo.targetTilePoint) {
		return board.getAwayFromTilePossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
	} else {
		debug("Missing targetTilePoint");
	}
};
PaiShoGames.Board.awayFromTargetTileOrthogonalMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	if (movementInfo.targetTilePoint) {
		return board.getAwayFromTileOrthogonalPossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
	} else {
		debug("Missing targetTilePoint");
	}
};
PaiShoGames.Board.awayFromTargetTileDiagonalMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	if (movementInfo.targetTilePoint) {
		return board.getAwayFromTileDiagonalPossibleMoves(movementInfo.targetTilePoint, originPoint, boardPointAlongTheWay);
	} else {
		debug("Missing targetTilePoint");
	}
};

PaiShoGames.Board.prototype.setPossibleMovementPointsFromMovePoints = function(movePoints, nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, distanceRemaining, moveStepNumber) {
	if (distanceRemaining === 0
			|| !movePoints
			|| movePoints.length <= 0) {
		return;	// Complete
	}

	var self = this;
	var nextPointsConfirmed = [];
	movePoints.forEach(function(recentPoint) {
		var nextPossiblePoints = nextPossibleMovementPointsFunction(self, originPoint, recentPoint, movementInfo, moveStepNumber);
		nextPossiblePoints.forEach(function(adjacentPoint) {
			self.movementPointChecks++;
			if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
				adjacentPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);
				
				var canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
				
				/* If cannot move through point, then the distance remaining is 0, none! */
				if (!canMoveThroughPoint) {
					adjacentPoint.setMoveDistanceRemaining(movementInfo, 0);
				}
				
				if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
					var movementOk = self.setPointAsPossibleMovement(adjacentPoint, tile, originPoint);
					if (movementOk) {
						adjacentPoint.setPossibleForMovementType(movementInfo);
						// adjacentPoint.setPreviousPointForMovement(movementInfo, recentPoint);
						adjacentPoint.setPreviousPoint(recentPoint);
						if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
							nextPointsConfirmed.push(adjacentPoint);
						}
					}
				} else if (canMoveThroughPoint) {
					nextPointsConfirmed.push(adjacentPoint);
				}
			}
		});
	});

	this.setPossibleMovementPointsFromMovePoints(nextPointsConfirmed,
		nextPossibleMovementPointsFunction, 
		tile, 
		movementInfo, 
		originPoint,
		distanceRemaining - 1,
		moveStepNumber + 1);
};

PaiShoGames.Board.prototype.getPointsMarkedAsPossibleMove = function() {
	var possibleMovePoints = [];
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			possibleMovePoints.push(boardPoint);
		}
	});
	return possibleMovePoints;
};

PaiShoGames.Board.prototype.setPossibleMovementPointsFromMovePointsOnePathAtATime = function(nextPossibleMovementPointsFunction, 
																					tile, 
																					movementInfo, 
																					originPoint, 
																					recentPoint, 
																					distanceRemaining, 
																					moveStepNumber, 
																					currentMovementPath) {
	if (distanceRemaining === 0) {
		return;	// Complete
	}
	var self = this;
	var nextPossiblePoints = nextPossibleMovementPointsFunction(self, originPoint, recentPoint, movementInfo, moveStepNumber, currentMovementPath);
	originPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);
	nextPossiblePoints.forEach(function(adjacentPoint) {
		self.movementPointChecks++;
		if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
			var canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
			if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
				var movementOk = self.setPointAsPossibleMovement(adjacentPoint, originPoint.tile, originPoint, currentMovementPath);
				if (movementOk) {
					adjacentPoint.setPossibleForMovementType(movementInfo);
					if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
							self.setPossibleMovementPointsFromMovePointsOnePathAtATime(
								nextPossibleMovementPointsFunction,
								tile,
								movementInfo, 
								originPoint,
								adjacentPoint, 
								distanceRemaining - 1,
								moveStepNumber + 1,
								currentMovementPath.concat([adjacentPoint])
							);
					}
				}
			} else if (canMoveThroughPoint) {
				self.setPossibleMovementPointsFromMovePointsOnePathAtATime(
					nextPossibleMovementPointsFunction,
					tile,
					movementInfo, 
					originPoint,
					adjacentPoint, 
					distanceRemaining - 1,
					moveStepNumber + 1,
					currentMovementPath.concat([adjacentPoint])
				);
			}
		}
	});
};

PaiShoGames.Board.prototype.setBonusMovementPossibleMoves = function(bonusMovementInfo, originPoint) {
	/* if (bonusMovementInfo && bonusMovementInfo.type && bonusMovementInfo.distance && bonusMovementInfo.movementFunction) {
		var possibleMovePoints = this.getPointsMarkedAsPossibleMove();
		possibleMovePoints.push(originPoint);
		var self = this;
		possibleMovePoints.forEach(function(boardPoint) {
			self.setPossibleMovementPointsFromMovePoints([boardPoint], bonusMovementInfo.movementFunction, originPoint.tile, bonusMovementInfo, boardPoint, bonusMovementInfo.distance, 0);
		});
	} */

	if (bonusMovementInfo && bonusMovementInfo.type) {
		var possibleMovePoints = this.getPointsMarkedAsPossibleMove();
		possibleMovePoints.push(originPoint);
		var self = this;
		possibleMovePoints.forEach(function(boardPoint) {
			self.setPossibleMovesForBonusMovement(bonusMovementInfo, originPoint, boardPoint, originPoint.tile);
		});
	}
};

PaiShoGames.Board.prototype.setMovePointsAnywhere = function(boardPointStart, movementInfo) {
	var self = this;
	this.forEachBoardPoint(function(boardPoint) {
		if (self.tileCanMoveOntoPoint(boardPointStart.tile, movementInfo, boardPoint, boardPointStart)) {
			self.setPointAsPossibleMovement(boardPoint, boardPointStart.tile, boardPointStart);
		}
	});
};

PaiShoGames.Board.prototype.tileMovementIsImmobilized = function(tile, movementInfo, boardPointStart) {
	return !movementInfo.regardlessOfImmobilization
		&& (this.tileMovementIsImmobilizedByMovementRestriction(tile, movementInfo, boardPointStart)
		|| this.abilityManager.abilityTargetingTileExists(Trifle.AbilityName.immobilizeTiles, tile));
};

PaiShoGames.Board.prototype.tileMovementIsImmobilizedByTileZoneAbility = function(zoneAbility, tilePoint, tileBeingMoved, tileBeingMovedInfo, movementStartPoint) {
	var isImmobilized = false;
	if (
		zoneAbility.type === Trifle.ZoneAbility.immobilizesOpponentTiles
		&& tilePoint.tile.ownerName !== tileBeingMoved.ownerName
		&& this.pointTileZoneContainsPoint(tilePoint, movementStartPoint)
		&& this.abilityIsActive(tilePoint, tilePoint.tile, this.tileMetadata[tilePoint.tile.code], zoneAbility)
		) {
		if (zoneAbility.targetTileCodes) {
			if (zoneAbility.targetTileCodes.includes(tileBeingMoved.code)) {
				isImmobilized = true;
			}
		} else {
			isImmobilized = true;
		}
	}

	if (
		zoneAbility.type === Trifle.ZoneAbility.immobilizesTiles
		&& this.pointTileZoneContainsPoint(tilePoint, movementStartPoint)
		&& this.abilityIsActive(tilePoint, tilePoint.tile, this.tileMetadata[tilePoint.tile.code], zoneAbility)
	) {
		if (zoneAbility.targetTeams) {
			if (
				(zoneAbility.targetTeams.includes(Trifle.TileTeam.enemy)
					&& tilePoint.tile.ownerName !== tileBeingMoved.ownerName)
				||
				(zoneAbility.targetTeams.includes(Trifle.TileTeam.friendly)
					&& tilePoint.tile.ownerName === tileBeingMoved.ownerName)
			) {
				if (zoneAbility.targetTileCodes) {
					if (zoneAbility.targetTileCodes.includes(tileBeingMoved.code)) {
						isImmobilized = true;
					}
				} else if (zoneAbility.targetTileTypes) {
					if (arrayIncludesOneOf(tileBeingMovedInfo.types, zoneAbility.targetTileTypes)) {
						if (zoneAbility.targetTileIdentifiers) {
							if (tileBeingMovedInfo.identifiers 
									&& arrayIncludesOneOf(tileBeingMovedInfo.identifiers, zoneAbility.targetTileIdentifiers)) {
								isImmobilized = true;
							}
						} else {
							isImmobilized = true;
						}
					}
				}
			}
		}
	}

	return isImmobilized;
};

PaiShoGames.Board.prototype.tileMovementIsImmobilizedByMovementRestriction = function(tile, movementInfo, boardPointStart) {
	var isImmobilized = false;
	if (tile && movementInfo.restrictions) {
		var self = this;
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === Trifle.MovementRestriction.immobilizedByOpponentTileZones) {
				movementRestriction.affectingTiles.forEach(function(affectingTileCode) {
					isImmobilized = self.pointIsInTargetTileZone(boardPointStart, affectingTileCode, getOpponentName(tile.ownerName));
				});
			}
		});
	}
	return isImmobilized;
};

/**
 * Check if given boardPoint is within the zone of target tile belonging to zoneOwner.
 **/
PaiShoGames.Board.prototype.pointIsInTargetTileZone = function(boardPoint, targetTileCode, zoneOwner) {
	var insideTileZone = false;

	var targetTilePoints = this.getTilePoints(targetTileCode, zoneOwner);
	if (targetTilePoints.length > 0) {
		var self = this;
		targetTilePoints.forEach(function(targetTilePoint) {
			if (self.pointTileZoneContainsPoint(targetTilePoint, boardPoint)) {
				insideTileZone = true;
				return;
			}
		});
	}

	return insideTileZone;
};

PaiShoGames.Board.prototype.getTilePoints = function(tileCode, ownerName) {
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

PaiShoGames.Board.prototype.getPointsForTileCodes = function(tileCodes, ownerNames) {
	var points = [];
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()
				&& tileCodes.includes(boardPoint.tile.code)
				&& ownerNames.includes(boardPoint.tile.ownerName)) {
			points.push(boardPoint);
		}
	});
	return points;
};

PaiShoGames.Board.prototype.canMoveHereMoreEfficientlyAlready = function(boardPoint, distanceRemaining, movementInfo) {
	return boardPoint.getMoveDistanceRemaining(movementInfo) >= distanceRemaining;
};

PaiShoGames.Board.prototype.tileCanMoveOntoPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	var tileInfo = this.tileMetadata[tile.code];
	var canCaptureTarget = this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
	return (!targetPoint.hasTile() || canCaptureTarget || (targetPoint.tile === tile && targetPoint.occupiedByAbility))
		&& (!this.useTrifleTempleRules || !targetPoint.isType(TEMPLE) || canCaptureTarget)
		&& !this.tileZonedOutOfSpace(tile, movementInfo, targetPoint, canCaptureTarget)
		&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint)
		&& !this.tilePreventedFromPointByMovementRestriction(tile, movementInfo, targetPoint, fromPoint);
};

PaiShoGames.Board.prototype.tilePreventedFromPointByMovementRestriction = function(tile, movementInfo, targetPoint, fromPoint) {
	var isRestricted = false;
	if (movementInfo.restrictions) {
		movementInfo.restrictions.every(restrictionInfo => {
			if (restrictionInfo.type === Trifle.MovementRestriction.restrictMovementOntoRecordedTilePoint) {
				/* Currently supporting when has these required properties:
				 * - targetTileCode
				 * - targetTeams
				 */
				/* Is targetPoint recorded? */
				var recordedPointsOfType = this.recordedTilePoints[restrictionInfo.recordTilePointType];
				if (recordedPointsOfType) {
					var targetTileOwnerName = null;
					if (restrictionInfo.targetTeams.length === 1 && restrictionInfo.targetTeams.includes(Trifle.TileTeam.enemy)) {
						targetTileOwnerName = getOpponentName(tile.ownerName);
					} else if (restrictionInfo.targetTeams.length === 1 && restrictionInfo.targetTeams.includes(Trifle.TileTeam.friendly)) {
						targetTileOwnerName = tile.ownerName;
					}
					var tileKey = {
						ownerName: targetTileOwnerName,
						code: restrictionInfo.targetTileCode
					};
					
					Object.keys(recordedPointsOfType).forEach(function(key, index) {
						var keyObject = JSON.parse(key);
						if (keyObject.code === tileKey.code
								&& (targetTileOwnerName === null || keyObject.ownerName === targetTileOwnerName)) {
							if (recordedPointsOfType[key] === targetPoint) {
								isRestricted = true;
							}
						}
					});
				}
				return !isRestricted;	// Check next restriction if not restricted
			} else {
				debug("Movement restriction not handled here: " + restrictionInfo.type);
				return true;	// Continue to next restriction
			}
		});
	}
	return isRestricted;
};

PaiShoGames.Board.prototype.targetPointIsEmptyOrCanBeCaptured = function(tile, movementInfo, fromPoint, targetPoint) {
	return !targetPoint.hasTile() 
		|| this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
};

PaiShoGames.Board.prototype.targetPointHasTileTileThatCanBeCaptured = function(tile, movementInfo, fromPoint, targetPoint) {
	return targetPoint.hasTile() 
		&& this.tileCanCapture(tile, movementInfo, fromPoint, targetPoint)
		&& !this.tileHasActiveCaptureProtectionFromCapturingTile(targetPoint.tile, tile);
};

PaiShoGames.Board.prototype.tileHasActiveCaptureProtectionFromCapturingTile = function(tile, capturingTile) {
	return this.abilityManager.abilityTargetingTileExists(Trifle.AbilityName.protectFromCapture, tile);

	/* var tileHasActiveCaptureProtection = false;
	this.activeDurationAbilities.forEach(function(durationAbilityEntry) {
		debug("Active Duration Ability: ");
		debug(durationAbilityEntry);
		if (durationAbilityEntry.targetTile === tile) {	// OR target TileTypeMatches tile
			debug("Yes, for this tile");
			var capturingTileInfo = this.tileMetadata[capturingTile.code];
			if (durationAbilityEntry.ability.type === Trifle.AbilityName.protectFromCapture) {
				if ((durationAbilityEntry.ability.tileTypesProtectedFrom
					&& arrayIncludesOneOf(durationAbilityEntry.ability.tileTypesProtectedFrom, capturingTileInfo.types))
					||
					(durationAbilityEntry.ability.tileTypesProtectedFrom
						&& durationAbilityEntry.ability.tileTypesProtectedFrom.includes(Trifle.TileCategory.allTileTypes))
					||
					(durationAbilityEntry.ability.tilesProtectedFrom
					&& durationAbilityEntry.ability.tilesProtectedFrom.includes(capturingTile.code))
				) {
					tileHasActiveCaptureProtection = true;
					return;
				}
			}
		}
	});
	return tileHasActiveCaptureProtection; */
};

PaiShoGames.Board.prototype.capturePossibleBasedOnBannersPlayed = function(capturingPlayer, targetPoint) {
	if (!this.useBannerCaptureSystem) {
		return true;
	}

	var targetTile = targetPoint.tile;
	var targetTileInfo = this.tileMetadata[targetTile.code];

	var playerBannerPlayed = this.hostBannerPlayed;
	var otherBannerPlayed = this.guestBannerPlayed;
	if (capturingPlayer === GUEST) {
		playerBannerPlayed = this.guestBannerPlayed;
		otherBannerPlayed = this.hostBannerPlayed;
	}

	return (playerBannerPlayed && Trifle.TileInfo.tileIsOneOfTheseTypes(targetTileInfo, [Trifle.TileType.flower, Trifle.TileType.banner]))
			|| (playerBannerPlayed && otherBannerPlayed);
};

PaiShoGames.Board.prototype.tileCanCapture = function(tile, movementInfo, fromPoint, targetPoint) {
	var playerBannerPlayed = this.hostBannerPlayed;
	var otherBannerPlayed = this.guestBannerPlayed;
	if (tile.ownerName === GUEST) {
		playerBannerPlayed = this.guestBannerPlayed;
		otherBannerPlayed = this.hostBannerPlayed;
	}

	var captureProhibited = this.abilityManager.abilityTargetingTileExists(Trifle.AbilityName.prohibitTileFromCapturing, tile);

	var targetTile = targetPoint.tile;
	var targetTileInfo = this.tileMetadata[targetTile.code];

	var capturePossibleWithMovement = movementInfo
		&& movementInfo.captureTypes
		&& movementInfo.captureTypes.includes(Trifle.CaptureType.all);
	
	var self = this;
	if (movementInfo && movementInfo.captureTypes && movementInfo.captureTypes.length) {
		movementInfo.captureTypes.forEach(function(captureTypeInfo) {
			if (captureTypeInfo.type && captureTypeInfo.type === Trifle.CaptureType.all) {
				capturePossibleWithMovement = true;
			} else if (captureTypeInfo.type && captureTypeInfo.type === Trifle.CaptureType.tilesTargetedByAbility) {
				captureTypeInfo.targetAbilities.forEach(function(targetAbilityName) {
					capturePossibleWithMovement = self.abilityManager.abilityTargetingTileExists(targetAbilityName, targetPoint.tile);
				});
			} else if (captureTypeInfo.type && captureTypeInfo.type === Trifle.CaptureType.allExcludingCertainTiles) {
				if (!captureTypeInfo.excludedTileCodes.includes(targetPoint.tile.code)) {
					capturePossibleWithMovement = true;
				}
			}

			if (!self.activationRequirementsAreMet(captureTypeInfo, tile)) {
				captureProhibited = true;
			}
		});
	}

	return !captureProhibited
		&& targetTileInfo 
		&& capturePossibleWithMovement
		&& (
			!this.useBannerCaptureSystem
			|| (playerBannerPlayed 
				&& Trifle.TileInfo.tileIsOneOfTheseTypes(targetTileInfo, [Trifle.TileType.flower, Trifle.TileType.banner])
			)
			|| (playerBannerPlayed && otherBannerPlayed)
		)
		&& this.tilesBelongToDifferentOwnersOrTargetTileHasFriendlyCapture(tile, targetTile, targetTileInfo) // TODO
		&& !targetPoint.tile.protected;
};

PaiShoGames.Board.prototype.targetPointTileIsCapturableByTileAbility = function(targetPoint, capturingTile) {
	return !this.tileHasActiveCaptureProtectionFromCapturingTile(targetPoint.tile, capturingTile);
};

PaiShoGames.Board.prototype.activationRequirementsAreMet = function(abilityInfo, tile, triggerContext) {
	var activationRequirementsAreMet = true;	// Assume true, change if ever false
	if (abilityInfo.activationRequirements && abilityInfo.activationRequirements.length) {
		var self = this;
		abilityInfo.activationRequirements.forEach(function(activationRequirement) {
			if (activationRequirement.type === Trifle.ActivationRequirement.tilesNotInTemple) {
				var ownerNames = [];
				if (activationRequirement.targetTeams.includes(Trifle.TileTeam.friendly)) {
					ownerNames.push(tile.ownerName);
				}
				if (activationRequirement.targetTeams.includes(Trifle.TileTeam.enemy)) {
					ownerNames.push(getOpponentName(tile.ownerName));
				}
				requirementCheckPoints = self.getPointsForTileCodes(activationRequirement.targetTileCodes, ownerNames);
				
				requirementCheckPoints.forEach(function(checkPoint) {
					if (checkPoint.isType(TEMPLE)) {
						activationRequirementsAreMet = false;
					}
				});
			} else if (activationRequirement.type === Trifle.ActivationRequirement.tileIsOnPointOfType) {
				var tileIsPointOfTypeRequirementMet = false;
				if (activationRequirement.targetTileTypes) {
					if (activationRequirement.targetTileTypes && activationRequirement.targetTileTypes.length) {
						if (activationRequirement.targetTileTypes.includes(Trifle.TileCategory.thisTile)) {
							if (arrayIncludesOneOf(activationRequirement.targetPointTypes, triggerContext.pointWithTile.types)) {
								tileIsPointOfTypeRequirementMet = true;
							}
						}
					}
				}
				if (!tileIsPointOfTypeRequirementMet) {
					activationRequirementsAreMet = false;
				}
			}
		});
	} else {
		activationRequirementsAreMet = true;
	}
	return activationRequirementsAreMet;
};

/** Can a tile be captured by a Capture ability? */
PaiShoGames.Board.prototype.tileCanBeCaptured = function(capturingPlayer, targetPoint) {
	var playerBannerPlayed = this.hostBannerPlayed;
	var otherBannerPlayed = this.guestBannerPlayed;
	if (capturingPlayer === GUEST) {
		playerBannerPlayed = this.guestBannerPlayed;
		otherBannerPlayed = this.hostBannerPlayed;
	}

	var targetTile = targetPoint.tile;
	var targetTileInfo = this.tileMetadata[targetTile.code];

	return targetTileInfo 
		&& (
			!this.useBannerCaptureSystem
			|| (playerBannerPlayed 
				&& Trifle.TileInfo.tileIsOneOfTheseTypes(targetTileInfo, [Trifle.TileType.flower, Trifle.TileType.banner])
			)
			|| (playerBannerPlayed && otherBannerPlayed)
		)
		&& !targetPoint.tile.protected;
};

PaiShoGames.Board.prototype.tilesBelongToDifferentOwnersOrTargetTileHasFriendlyCapture = function(tile, targetTile, targetTileInfo) {
	return tile.ownerName !== targetTile.ownerName
		|| Trifle.TileInfo.tileCanBeCapturedByFriendlyTiles(targetTileInfo);
};

PaiShoGames.Board.prototype.tileCanMoveThroughPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	var tileInfo = this.tileMetadata[tile.code];
	return tileInfo
		&& (
			(!targetPoint.hasTile() || (targetPoint.tile === tile && targetPoint.occupiedByAbility))
				|| this.movementInfoHasAbility(movementInfo, Trifle.MovementAbility.jumpOver)
				|| (this.movementInfoHasAbility(movementInfo, Trifle.MovementAbility.chargeCapture) && this.tileCanMoveOntoPoint(tile, movementInfo, targetPoint, fromPoint))
			)
		&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint);
};

PaiShoGames.Board.prototype.movementInfoHasAbility = function(movementInfo, movementAbilityType) {
	var matchFound = false;
	if (movementInfo && movementInfo.abilities) {
		movementInfo.abilities.forEach(function(abilityInfo) {
			if (abilityInfo.type === movementAbilityType) {
				matchFound = true;
				return;
			}
		})
	}
	return matchFound;
};

PaiShoGames.Board.prototype.tileZonedOutOfSpace = function(tile, movementInfo, targetPoint, canCaptureTarget) {
	var isZonedOut = this.tileZonedOutOfSpaceByMovementRestriction(tile, movementInfo, targetPoint);
	
	isZonedOut = isZonedOut || this.tileZonedOutOfSpaceByAbility(tile, targetPoint, canCaptureTarget);

	return isZonedOut;
};

PaiShoGames.Board.prototype.tileZoneIsActive = function(tile) {
	return !this.abilityManager.abilityTargetingTileExists(Trifle.AbilityName.cancelZone, tile);
};

PaiShoGames.Board.prototype.tileZonedOutOfSpaceByAbility = function(tile, targetPoint, canCaptureTarget) {
	var isZonedOut = false;

	var self = this;
	this.forEachBoardPointWithTile(function(checkBoardPoint) {
		var restrictMovementWithinZoneAbilities = self.abilityManager.getAbilitiesTargetingTileFromSourceTile(Trifle.AbilityName.restrictMovementWithinZone, tile, checkBoardPoint.tile);

		if (restrictMovementWithinZoneAbilities.length
				&& self.pointTileZoneContainsPoint(checkBoardPoint, targetPoint)) {
			isZonedOut = true;
			return;
		}

		var restrictMovementWithinZoneUnlessCapturingAbilities = self.abilityManager.getAbilitiesTargetingTileFromSourceTile(Trifle.AbilityName.restrictMovementWithinZoneUnlessCapturing, tile, checkBoardPoint.tile);

		if (!canCaptureTarget && restrictMovementWithinZoneUnlessCapturingAbilities.length
				&& self.pointTileZoneContainsPoint(checkBoardPoint, targetPoint)) {
			isZonedOut = true;
			return;
		}
	});

	return isZonedOut;
};

/* PaiShoGames.Board.prototype.tileZonedOutOfSpaceByZoneAbility = function(tileCode, ownerName, targetPoint, originPoint) {
	var isZonedOut = false;

	var tileOwnerCode = getPlayerCodeFromName(ownerName);
	var tileInfo = this.tileMetadata[tileCode];

	var self = this;

	this.forEachBoardPointWithTile(function(checkBoardPoint) {
		var checkTileInfo = this.tileMetadata[checkBoardPoint.tile.code];

		// Check tile zones that can restrict movement to targetPoint 
		var zoneInfo = Trifle.TileInfo.getTerritorialZone(checkTileInfo);
		if (zoneInfo && zoneInfo.abilities) {
			zoneInfo.abilities.forEach(function(zoneAbilityInfo) {
				var abilityIsActive = self.tileZoneIsActive(checkBoardPoint.tile);
						// && self.abilityIsActive(checkBoardPoint, checkBoardPoint.tile, checkTileInfo, zoneAbilityInfo);
				if (
					(
						zoneAbilityInfo.type === Trifle.ZoneAbility.restrictMovementWithinZone
					) && (	// Zone ability target team matches
						(zoneAbilityInfo.targetTeams.includes(Trifle.TileTeam.friendly)
							&& tileOwnerCode === checkBoardPoint.tile.ownerCode)
						|| (zoneAbilityInfo.targetTeams.includes(Trifle.TileTeam.enemy)
							&& tileOwnerCode !== checkBoardPoint.tile.ownerCode)
					) && (
						(	// Zone ability target tile types matches, if present
							zoneAbilityInfo.targetTileTypes 
							&& (
								arrayIncludesOneOf(zoneAbilityInfo.targetTileTypes, tileInfo.types)
								|| zoneAbilityInfo.targetTileTypes.includes(Trifle.TileCategory.allTileTypes)
							)
						)
						|| (	// OR zone ability target tiles matches, if present
							zoneAbilityInfo.targetTileCodes 
							&& zoneAbilityInfo.targetTileCodes.includes(tileCode)
						)
					) && (
						self.pointTileZoneContainsPoint(checkBoardPoint, targetPoint)
					) && (
						abilityIsActive
					) && (	// If deploy (no originPoint) or tile origin was inside zone and movement is unable to escape zone, allow it to move farther away from center
						!originPoint
						|| (
							true
						)
					)
				) {
					isZonedOut = true;
					debug("Zoned out! For tile: " + tileCode + " by tile: " + checkBoardPoint.tile.code);
				}
			});
		}
	});

	return isZonedOut;
}; */

PaiShoGames.Board.prototype.tileZonedOutOfSpaceByMovementRestriction = function(tile, movementInfo, targetPoint) {
	var isZonedOut = false;
	if (movementInfo.restrictions && movementInfo.restrictions.length > 0) {
		var self = this;
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === Trifle.MovementRestriction.restrictedByOpponentTileZones) {
				movementRestriction.affectingTiles.forEach(function(affectingTileCode) {
					isZonedOut = self.pointIsInTargetTileZone(targetPoint, affectingTileCode, getOpponentName(tile.ownerName));
				});
			}
		});
	}
	return isZonedOut;
};

PaiShoGames.Board.prototype.tileInfoHasMovementType = function(tileInfo, movementType) {
	var movementTypeFound = false;
	tileInfo.movements.forEach(function(movementInfo) {
		if (movementInfo.type === movementType) {
			movementTypeFound = true;
		}
	});
	return movementTypeFound;
};

PaiShoGames.Board.prototype.removePossibleMovePoints = function() {
	this.forEachBoardPoint(function(boardPoint) {
		boardPoint.removeType(POSSIBLE_MOVE);
		boardPoint.clearPossibleMovementTypes();
		boardPoint.clearPossibleMovementPaths();
	});
};

PaiShoGames.Board.prototype.captureTileOnPoint = function(boardPoint) {
	var capturedTile = null;

	if (boardPoint.occupiedByAbility) {
		var occupyingPoint = boardPoint.pointOccupiedBy;
		occupyingPoint.otherPointsOccupied.forEach(function(occupiedPoint) {
			occupiedPoint.removeTile();
			occupiedPoint.occupiedByAbility = false;
			occupiedPoint.pointOccupiedBy = null;
		});
		capturedTile = occupyingPoint.removeTile();
	} else if (boardPoint.otherPointsOccupied) {
		boardPoint.otherPointsOccupied.forEach(function(occupiedPoint) {
			occupiedPoint.removeTile();
			occupiedPoint.occupiedByAbility = false;
			occupiedPoint.pointOccupiedBy = null;
		});
		capturedTile = boardPoint.removeTile();
	} else {
		capturedTile = boardPoint.removeTile();
	}

	return capturedTile;
};

PaiShoGames.Board.prototype.getFireLilyPoint = function(player) {
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

PaiShoGames.Board.prototype.getFireLilyPoints = function(player) {
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

PaiShoGames.Board.prototype.setDeployPointsPossibleMoves = function(tile) {
	var tileInfo = this.tileMetadata[tile.code];
	if (!tileInfo) {
		debug("You need the tileInfo for " + tile.code);
	}

	this.currentlyDeployingTile = tile;
	this.currentlyDeployingTileInfo = tileInfo;

	var self = this;

	if (tileInfo && tileInfo.specialDeployTypes) {
		tileInfo.specialDeployTypes.forEach(function(specialDeployInfo) {
			self.setDeployPointsPossibleForSpecialDeploy(tile, tileInfo, specialDeployInfo);
		});
	}

	if (tileInfo && tileInfo.deployTypes) {
		if (tileInfo.deployTypes.includes(Trifle.DeployType.anywhere)) {
			this.forEachBoardPoint(function(boardPoint) {
				if (!boardPoint.hasTile()
						&& !boardPoint.isType(GATE)
						&& !self.tileZonedOutOfSpaceByAbility(tile, boardPoint)
						&& self.tileCanOccupyPoint(tile, boardPoint)) {
					boardPoint.addType(POSSIBLE_MOVE);
				}
			});
		}

		if (tileInfo.deployTypes.includes(Trifle.DeployType.temple)) {
			this.forEachBoardPoint(function(boardPoint) {
				if (!boardPoint.hasTile()
						&& boardPoint.isType(GATE)
						&& !self.tileZonedOutOfSpaceByAbility(tile, boardPoint)
						&& self.tileCanOccupyPoint(tile, boardPoint)) {
					boardPoint.addType(POSSIBLE_MOVE);
				}
			});
		}

		if (tileInfo.deployTypes.includes(Trifle.DeployType.adjacentToTemple)) {
			this.forEachBoardPoint(function(templePoint) {
				if (!templePoint.hasTile() && templePoint.isType(TEMPLE)) {
					var adjacentToTemplePoints = self.getAdjacentPoints(templePoint);
					adjacentToTemplePoints.forEach(function(pointAdjacentToTemple) {
						if (!pointAdjacentToTemple.hasTile()
							&& !self.tileZonedOutOfSpaceByAbility(tile, pointAdjacentToTemple)
							&& self.tileCanOccupyPoint(tile, pointAdjacentToTemple)) {
							pointAdjacentToTemple.addType(POSSIBLE_MOVE);
						}
					});
				}
			});
		}
	}
};

PaiShoGames.Board.prototype.tileCanOccupyPoint = function(tile, boardPoint) {
	var tileInfo = this.tileMetadata[tile.code];

	if (tileInfo.attributes && tileInfo.attributes.includes(Trifle.AttributeType.gigantic)) {
		// Tile is gigantic - Allow if would not overlap with another tile
		var giganticPoints = this.getGrowGiantOccupiedPoints(boardPoint);
		var canOccupy = giganticPoints && giganticPoints.length ? true : false;
		if (giganticPoints) {
			giganticPoints.forEach(function(giganticPoint) {
				if (giganticPoint.hasTile()) {
					canOccupy = false;
				}
			});
		}
		return canOccupy;
	} else {
		return true;	// Default to true
	}
};

PaiShoGames.Board.prototype.setDeployPointsPossibleForSpecialDeploy = function(tile, tileInfo, specialDeployInfo) {
	if (specialDeployInfo.type === Trifle.SpecialDeployType.withinFriendlyTileZone) {
		this.setDeployPointsWithinTileZone(tile, tileInfo, specialDeployInfo);
	}
};

PaiShoGames.Board.prototype.setDeployPointsWithinTileZone = function(tile, tileInfo, specialDeployInfo) {
	if (specialDeployInfo.targetTileCodes && specialDeployInfo.targetTileCodes.length > 0) {
		var self = this;
		this.forEachBoardPoint(function(targetPoint) {
			if (!targetPoint.hasTile() && !targetPoint.isType(TEMPLE)
					&& self.pointIsWithinZoneOfOneOfTheseTiles(targetPoint, specialDeployInfo.targetTileCodes, tile.ownerName)
					&& !self.tileZonedOutOfSpaceByAbility(tile, targetPoint)) {
				targetPoint.addType(POSSIBLE_MOVE);
			}
		});
	}
};

PaiShoGames.Board.prototype.setMovePointsWithinTileZone = function(boardPointStart, zoneOwner, tileBeingMoved, movementInfo) {
	if (movementInfo.targetTileCodes && movementInfo.targetTileCodes.length > 0) {
		var self = this;
		var pointsOfZoneTiles = this.getPointsForTileCodes(movementInfo.targetTileCodes, [zoneOwner]);
		this.forEachBoardPoint(function(targetPoint) {
			var startAndEndPointAreInSameZone = self.oneOfTheseZonesContainsPoints(pointsOfZoneTiles, [boardPointStart, targetPoint]);
			if (startAndEndPointAreInSameZone
					&& self.tileCanMoveOntoPoint(tileBeingMoved, movementInfo, targetPoint, null)) {
				self.setPointAsPossibleMovement(targetPoint, tileBeingMoved, boardPointStart);
			}
		});
	}
};

PaiShoGames.Board.prototype.setPointAsPossibleMovement = function(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	// Enforce the drawing-towards abilities, etc

	var movementOk = false;

	/* Enforce Trifle.BoardPresenceAbility.drawOpponentTilesInLineOfSight */
	var movementOk = this.movementPassesLineOfSightTest(targetPoint, tileBeingMoved, originPoint);
	/* var movementOk = this.movementAllowedByAffectingAbilities(targetPoint, tileBeingMoved, originPoint, currentMovementPath); */

	// Future... movementOk = movementOk && this.movementcheckmethod(...)

	if (movementOk) {
		targetPoint.addType(POSSIBLE_MOVE);
	}

	if (currentMovementPath) {
		targetPoint.addPossibleMovementPath(currentMovementPath);
	}

	return movementOk;
};

/* PaiShoGames.Board.prototype.movementAllowedByAffectingAbilities = function(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	var movementOk = true;

	// Check for abilities that hinder the movement and verify movement to targetPoint is allowed

	// LureTiles
	movementOk = movementOk && this.lureTilesCheck(targetPoint, tileBeingMoved, originPoint, currentMovementPath);

	return movementOk;
}; */

/* PaiShoGames.Board.prototype.lureTilesCheck = function(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	// Is a LureTiles ability active on the board?
}; */

PaiShoGames.Board.prototype.movementPassesLineOfSightTest = function(targetPoint, tileBeingMoved, originPoint) {
	var pointsToMoveTowards = [];
	var movementPassesLineOfSightTest = true;
	var lineOfSightPoints = this.getPointsForTilesInLineOfSight(originPoint);
	var self = this;

	var drawAlongLineOfSightAbilities = this.abilityManager.getAbilitiesTargetingTile(Trifle.AbilityName.drawTilesAlongLineOfSight, tileBeingMoved);
	if (drawAlongLineOfSightAbilities && drawAlongLineOfSightAbilities.length === 1) {
		lineOfSightPoints.forEach(function(lineOfSightPoint) {
			var drawAbility = drawAlongLineOfSightAbilities[0];
			if (lineOfSightPoint.hasTile() && lineOfSightPoint.tile === drawAbility.sourceTile) {
				pointsToMoveTowards.push(lineOfSightPoint);
				/* Movement OK if:
					- Target Point is in line of sight of affecting tile
					- Tile will be closer to affecting tile than it was where it started
					- Tile be closer to where it started than the affecting tile was (did not move past the affecting tile) */
				movementPassesLineOfSightTest = self.targetPointIsInLineOfSightOfThesePoints(targetPoint, [lineOfSightPoint])
					&& self.targetPointIsCloserToThesePointsThanOriginPointIs(targetPoint, [lineOfSightPoint], originPoint)
					&& self.getDistanceBetweenPoints(originPoint, targetPoint) < self.getDistanceBetweenPoints(originPoint, lineOfSightPoint)
					|| targetPoint === drawAbility.sourceTilePoint;
				if (!movementPassesLineOfSightTest) {
					return false;
				}
			}
		});
	} else if (drawAlongLineOfSightAbilities && drawAlongLineOfSightAbilities.length > 1) {
		movementPassesLineOfSightTest = false;	// Being pulled in multiple directions, cannot satisfy both
	}

	return movementPassesLineOfSightTest;
};

PaiShoGames.Board.prototype.targetPointIsInLineOfSightOfThesePoints = function(targetPoint, checkPoints) {
	var checkPointsInLineOfSight = 0;
	var lineOfSightPoints = this.getPointsForTilesInLineOfSight(targetPoint);
	lineOfSightPoints.forEach(function(targetLineOfSightPoint) {
		if (checkPoints.includes(targetLineOfSightPoint)) {
			checkPointsInLineOfSight++;
		}
	});
	return checkPointsInLineOfSight === checkPoints.length;
};

PaiShoGames.Board.prototype.targetPointIsCloserToThesePointsThanOriginPointIs = function(targetPoint, checkPoints, originPoint) {
	var isCloserToAllCheckPoints = true;
	var self = this;
	checkPoints.forEach(function(checkPoint) {
		var targetPointDistance = self.getDistanceBetweenPoints(targetPoint, checkPoint);
		var originPointDistance = self.getDistanceBetweenPoints(originPoint, checkPoint);
		if (targetPointDistance >= originPointDistance) {
			isCloserToAllCheckPoints = false;
		}
	});
	return isCloserToAllCheckPoints;
};

PaiShoGames.Board.prototype.oneOfTheseZonesContainsPoints = function(pointsWithZones, targetPoints) {
	var self = this;
	var zoneContainingPointsFound = false;
	pointsWithZones.forEach(function(pointWithZone) {
		var targetPointsAreInZone = true;
		targetPoints.forEach(function(targetPoint) {
			targetPointsAreInZone = targetPointsAreInZone && self.pointTileZoneContainsPoint(pointWithZone, targetPoint);
		});
		if (targetPointsAreInZone) {
			zoneContainingPointsFound = true;
			return;
		}
	});
	return zoneContainingPointsFound;
};

PaiShoGames.Board.prototype.getZonePoints = function(pointWithZone) {
	var zonePoints = [];
	var self = this;
	this.forEachBoardPoint(function(boardPoint) {
		if (self.pointTileZoneContainsPoint(pointWithZone, boardPoint)) {
			zonePoints.push(boardPoint);
		}
	});
	return zonePoints;
};

PaiShoGames.Board.prototype.pointTileZoneContainsPoint = function(pointWithZone, targetPoint) {
	var tileInfo = this.tileMetadata[pointWithZone.tile.code];
	var tile = pointWithZone.tile;
	var zone = Trifle.TileInfo.getTerritorialZone(tileInfo);

	return pointWithZone.hasTile() 
			&& zone
			&& this.tileZoneIsActive(tile)
			&& this.getDistanceBetweenPoints(pointWithZone, targetPoint) <= zone.size;
};

PaiShoGames.Board.prototype.pointIsWithinZoneOfOneOfTheseTiles = function(targetPoint, tileCodes, zoneOwner) {
	var isInTheZone = false;
	if (tileCodes && tileCodes.length > 0) {
		var self = this;
		tileCodes.forEach(function(tileCode) {
			if (self.pointIsInTargetTileZone(targetPoint, tileCode, zoneOwner)) {
				isInTheZone = true;
				return;
			}
		});
	}
	return isInTheZone;
};

PaiShoGames.Board.prototype.forEachBoardPoint = function(forEachFunc) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				forEachFunc(boardPoint);
			}
		});
	});
};
PaiShoGames.Board.prototype.forEachBoardPointDoMany = function(forEachFuncList) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				forEachFuncList.forEach(function(forEachFunc) {
					forEachFunc(boardPoint);
				});
			}
		});
	});
};
PaiShoGames.Board.prototype.forEachBoardPointWithTile = function(forEachFunc) {
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			forEachFunc(boardPoint);
		}
	});
};

PaiShoGames.Board.prototype.setGuestGateOpen = function() {
	var row = 16;
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

PaiShoGames.Board.prototype.activateAbility = function(tileOwningAbility, targetTile, targetTileType, abilityInfo) {
	if (abilityInfo.duration && abilityInfo.duration > 0) {
		abilityInfo.active = true;
		abilityInfo.remainingDuration = abilityInfo.duration;
		this.activeDurationAbilities.push({
			grantingTile: tileOwningAbility,
			targetTile: targetTile,
			targetTileType: targetTileType,
			ability: abilityInfo
		});
	}
};

PaiShoGames.Board.prototype.tickDurationAbilities = function() {
	this.abilityManager.tickDurationAbilities();

	/* old: */
	/* for (var i = this.activeDurationAbilities.length - 1; i >= 0; i--) {
		var durationAbilityDetails = this.activeDurationAbilities[i];
		var durationAbilityInfo = durationAbilityDetails.ability;
		durationAbilityInfo.remainingDuration -= 0.5;
		if (durationAbilityInfo.remainingDuration <= 0) {
			durationAbilityInfo.active = false;
			this.activeDurationAbilities.splice(i, 1);
		}
	} */
};

PaiShoGames.Board.prototype.recordTilePoint = function(boardPoint, recordTilePointType) {
	if (!this.recordedTilePoints[recordTilePointType]) {
		this.recordedTilePoints[recordTilePointType] = {};
	}
	this.recordedTilePoints[recordTilePointType][boardPoint.tile.getOwnerCodeIdObjectString()] = boardPoint;
};

PaiShoGames.Board.prototype.promptForBoardPointInAVeryHackyWay = function() {
	this.forEachBoardPoint(function(boardPoint) {
		boardPoint.addType(POSSIBLE_MOVE);
	})
};

PaiShoGames.Board.prototype.getBoardPointFromRowAndCol = function(rowAndCol) {
	return this.cells[rowAndCol.row][rowAndCol.col];
};

