/* Pai Sho Adevar Board */

function AdevarBoard() {
	this.size = new RowAndColumn(18, 18);
	this.cells = this.brandNewForSpaces();

	this.winners = [];
}

AdevarBoard.prototype.brandNewForSpaces = function () {
	var cells = [];

	/* You'll want to maybe make new board point types to better correspond with Adevar. 
		Also, the types used here are not accurate (points created as neutral might be red, etc). 
		You'll also need to adjust for the non-playable areas of the board near the red corners. */

	cells[0] = this.newRow(6, 
		[AdevarBoardPoint.neutral(),
		AdevarBoardPoint.wall(),
		AdevarBoardPoint.wall(),
		AdevarBoardPoint.wall(),
		AdevarBoardPoint.wall(),
		AdevarBoardPoint.neutral()
		]);

	cells[1] = this.newRow(10, 
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[2] = this.newRow(12, 
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[3] = this.newRow(14,
		[AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.whiteNeutral(),
		AdevarBoardPoint.white(),
		AdevarBoardPoint.red(),
		AdevarBoardPoint.redNeutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral()
		]);

	cells[4] = this.newRow(16,
		[AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.whiteNeutral(),
		AdevarBoardPoint.white(),
		AdevarBoardPoint.white(),
		AdevarBoardPoint.red(),
		AdevarBoardPoint.red(),
		AdevarBoardPoint.redNeutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral(),
		AdevarBoardPoint.neutral()
		]);

	cells[5] = this.newRow(16,
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[6] = this.newRow(18,
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[7] = this.newRow(18,
		[AdevarBoardPoint.wall(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.wall()
		]);

	cells[8] = this.newRow(18,
		[AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall()
		]);

	cells[9] = this.newRow(18,
		[AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall()
		]);

	cells[10] = this.newRow(18,
		[AdevarBoardPoint.wall(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.wall()
		]);

	cells[11] = this.newRow(18,
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[12] = this.newRow(16,
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[13] = this.newRow(16,
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[14] = this.newRow(14,
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.red(),
			AdevarBoardPoint.white(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[15] = this.newRow(12,
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.redNeutral(),
			AdevarBoardPoint.whiteNeutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[16] = this.newRow(10,
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral(),
			AdevarBoardPoint.neutral()
		]);

	cells[17] = this.newRow(6,
		[AdevarBoardPoint.neutral(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

AdevarBoard.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new AdevarBoardPoint();
	nonPoint.addType(NON_PLAYABLE);

	for (var i = 0; i < this.size.row; i++) {
		if (i < numBlanksOnSides) {
			cells[i] = nonPoint;
		} else if (i < numBlanksOnSides + numColumns || numBlanksOnSides === 0) {
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

AdevarBoard.prototype.placeTile = function(tile, notationPoint) {
	return this.putTileOnPoint(tile, notationPoint);
};

AdevarBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	var capturedTile = point.removeTile();

	point.putTile(tile);

	var returnCapturedTileToHand = this.shouldReturnCapturedTileToHandAfterCapture(tile, capturedTile);

	return {
		capturedTile: capturedTile,
		returnCapturedTileToHand: returnCapturedTileToHand
	};
};

AdevarBoard.prototype.isValidRowCol = function(rowCol) {
	return rowCol.row >= 0 && rowCol.col >= 0 && rowCol.row <= this.size.row && rowCol.col <= this.size.col;
};

AdevarBoard.prototype.moveTile = function(notationPointStart, notationPointEnd) {
	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (!this.isValidRowCol(startRowCol) || !this.isValidRowCol(endRowCol)) {
		debug("That point does not exist.");
		return false;
	}

	var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
	var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

	var tile = boardPointStart.removeTile();

	if (!tile) {
		debug("Error: No tile to move!");
	}

	var capturedTile = boardPointEnd.removeTile();
	var error = boardPointEnd.putTile(tile);

	if (error) {
		debug("Error moving tile. It probably didn't get moved.");
		return false;
	}

	if (capturedTile) {
		this.applyTileCapturedTriggers(tile, capturedTile, boardPointStart, boardPointEnd);
	}

	var returnCapturedTileToHand = this.shouldReturnCapturedTileToHandAfterCapture(tile, capturedTile);

	return {
		capturedTile: capturedTile,
		returnCapturedTileToHand: returnCapturedTileToHand
	};
};

AdevarBoard.prototype.shouldReturnCapturedTileToHandAfterCapture = function(capturingTile, capturedTile) {
	if (capturedTile) {
		if (arrayIncludesOneOf( 
			[capturedTile.type],
			[
				AdevarTileType.secondFace,
				AdevarTileType.vanguard,
				AdevarTileType.reflection,
				AdevarTileType.gate
			]
		)) {
			return true;
		}
	}

	return false;
};

AdevarBoard.prototype.applyTileCapturedTriggers = function(capturingTile, capturedTile, moveStartedPoint, moveEndedPoint) {
	if (capturedTile && capturingTile.type === AdevarTileType.reflection) {
		this.revealTile(AdevarTileType.hiddenTile, capturedTile.ownerName);
	}
};

AdevarBoard.prototype.revealTile = function(tileType, player) {
	this.forEachBoardPointWithTile(function(boardPoint) {
		if (boardPoint.tile.type === tileType && boardPoint.tile.ownerName === player) {
			boardPoint.tile.reveal();
		}
	});
};

AdevarBoard.prototype.forEachBoardPoint = function(forEachFunc) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				forEachFunc(boardPoint);
			}
		});
	});
};
AdevarBoard.prototype.forEachBoardPointWithTile = function(forEachFunc) {
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			forEachFunc(boardPoint);
		}
	});
};

AdevarBoard.prototype.removeTile = function(notationPoint) {
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowCol.row][rowCol.col];
	return boardPoint.removeTile();
};

AdevarBoard.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
	return boardPointStart !== boardPointEnd;
};

AdevarBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
	if (boardPointStart.hasTile()) {
		this.setPossibleMovesForMovement(boardPointStart.tile.getMovementInfo(), boardPointStart);
	}
};

AdevarBoard.prototype.setPossibleMovesForMovement = function(movementInfo, boardPointStart) {
	/* Standard movement, moving and turning as you go */
	this.setPossibleMovementPointsFromMovePoints([boardPointStart], AdevarBoard.standardMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
};
AdevarBoard.standardMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	var mustPreserveDirection = false;	// True means the tile couldn't turn as it goes
	return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
};
AdevarBoard.prototype.setPossibleMovementPointsFromMovePoints = function(movePoints, nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, distanceRemaining, moveStepNumber) {
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

AdevarBoard.prototype.setPointAsPossibleMovement = function(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	targetPoint.addType(POSSIBLE_MOVE);
	return true;
};

AdevarBoard.prototype.tileCanMoveOntoPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	var canCaptureTarget = this.targetPointHasTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
	return !targetPoint.hasTile() || canCaptureTarget;
};

AdevarBoard.prototype.targetPointHasTileThatCanBeCaptured = function(tile, movementInfo, fromPoint, targetPoint) {
	return targetPoint.hasTile() 
		&& this.tileCanCapture(tile, movementInfo, fromPoint, targetPoint);
};

AdevarBoard.prototype.tileCanCapture = function(tile, movementInfo, fromPoint, targetPoint) {
	return tile.canCapture(targetPoint.tile);
};

AdevarBoard.prototype.tileCanMoveThroughPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	// Can also check anything else that restricts tile movement through spaces on the board
	return !targetPoint.hasTile();
};

AdevarBoard.prototype.canMoveHereMoreEfficientlyAlready = function(boardPoint, distanceRemaining, movementInfo) {
	return boardPoint.getMoveDistanceRemaining(movementInfo) >= distanceRemaining;
};

AdevarBoard.prototype.getDirectlyAdjacentPoints = function(boardPoint) {
	var possibleAdjacentPoints = [];

	if (boardPoint.row > 0) {
		possibleAdjacentPoints.push(this.cells[boardPoint.row - 1][boardPoint.col]);
	}
	if (boardPoint.row < paiShoBoardMaxRowOrCol) {
		possibleAdjacentPoints.push(this.cells[boardPoint.row + 1][boardPoint.col]);
	}
	if (boardPoint.col > 0) {
		possibleAdjacentPoints.push(this.cells[boardPoint.row][boardPoint.col - 1]);
	}
	if (boardPoint.col < paiShoBoardMaxRowOrCol) {
		possibleAdjacentPoints.push(this.cells[boardPoint.row][boardPoint.col + 1]);
	}

	var adjacentPoints = [];

	possibleAdjacentPoints.forEach(function(boardPoint) {
		if (!boardPoint.isType(NON_PLAYABLE)) {
			adjacentPoints.push(boardPoint);
		}
	});

	return adjacentPoints;
};

AdevarBoard.prototype.getAdjacentPointsPotentialPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
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

AdevarBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
			boardPoint.clearPossibleMovementTypes();
		});
	});
};

AdevarBoard.prototype.setPossibleDeployPoints = function(tile) {
	if (arrayIncludesOneOf(
		[tile.type],
		[
			AdevarTileType.basic,
			AdevarTileType.secondFace,
			AdevarTileType.reflection
		]
	)) {
		this.setPossibleDeployPointsAroundGates(tile);
	}
};

AdevarBoard.prototype.setPossibleDeployPointsAroundGates = function(tile) {
	var gatePoints = this.getTileTypePoints(tile.ownerName, AdevarTileType.gate);

	var self = this;
	gatePoints.forEach(function(gatePoint) {
		self.getDirectlyAdjacentPoints(gatePoint).forEach(function(pointNextToGate) {
			if (!pointNextToGate.hasTile()
					|| self.targetPointHasTileThatCanBeCaptured(tile, null, null, pointNextToGate)) {
				pointNextToGate.addType(POSSIBLE_MOVE);
			}
		});
	});
};

AdevarBoard.prototype.getTileTypePoints = function(player, tileType) {
	var tilePoints = [];
	this.forEachBoardPointWithTile(function(boardPoint) {
		if (boardPoint.tile.ownerName === player
				&& boardPoint.tile.type === tileType) {
			tilePoints.push(boardPoint);
		}
	});
	return tilePoints;
};

AdevarBoard.prototype.setAllPointsAsPossible = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.addType(POSSIBLE_MOVE);
		});
	});
}

AdevarBoard.prototype.getCopy = function() {
	var copyBoard = new AdevarBoard();

	// cells
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			copyBoard.cells[row][col] = this.cells[row][col].getCopy();
		}
	}

	return copyBoard;
};