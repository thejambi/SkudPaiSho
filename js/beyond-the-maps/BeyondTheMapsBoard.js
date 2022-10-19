/* Beyond The Maps Board */

BeyondTheMaps.FULL_BOARD_SIZE_LENGTH = 18;

BeyondTheMaps.Board = class {
	constructor() {
		if (gameOptionEnabled(EDGES_12x12_GAME)) {
			this.size = new RowAndColumn(12, 12);
			this.cells = this.brandNewForFullGridSpaces();
			this.guestStartingPoint = this.cells[3][3];
			this.hostStartingPoint = this.cells[14][14];
		} else {
			this.size = new RowAndColumn(BeyondTheMaps.FULL_BOARD_SIZE_LENGTH, BeyondTheMaps.FULL_BOARD_SIZE_LENGTH);
			this.cells = this.brandNewForFullGridSpaces();
			this.guestStartingPoint = this.cells[0][0];
			this.hostStartingPoint = this.cells[17][17];
		}

		this.winners = [];
	}

	getArrayOfBoardPoints() {
		var boardPoints = [];

		for (var i = 0; i < this.size.col; i++) {
			boardPoints.push(new Trifle.BoardPoint());
		}

		return boardPoints;
	}

	brandNewForFullGridSpaces() {
		var cells = [];

		for (var row = 0; row < BeyondTheMaps.FULL_BOARD_SIZE_LENGTH; row++) {
			cells[row] = this.newRow(row, this.getArrayOfBoardPoints());
		}

		for (var row = 0; row < cells.length; row++) {
			for (var col = 0; col < cells[row].length; col++) {
				cells[row][col].row = row;
				cells[row][col].col = col;
				cells[row][col].setRowAndCol(row, col);
			}
		}

		return cells;
	};

	newRow(rowNum, points) {
		var cells = [];

		var numBlanksOnSides = (BeyondTheMaps.FULL_BOARD_SIZE_LENGTH - this.size.row) / 2;

		var nonPoint = new Trifle.BoardPoint();
		nonPoint.addType(NON_PLAYABLE);

		for (var i = 0; i < BeyondTheMaps.FULL_BOARD_SIZE_LENGTH; i++) {
			if (i < numBlanksOnSides || rowNum < numBlanksOnSides || rowNum >= (BeyondTheMaps.FULL_BOARD_SIZE_LENGTH - numBlanksOnSides)) {
				cells[i] = nonPoint;
			} else if (i < numBlanksOnSides + this.size.col || numBlanksOnSides === 0) {
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

	placeTile(tile, notationPoint) {
		var point = notationPoint.rowAndColumn;
		point = this.cells[point.row][point.col];

		var capturedTile = point.tile;

		this.putTileOnPoint(tile, notationPoint);

		return capturedTile;
	};

	putTileOnPoint(tile, notationPoint) {
		var point = notationPoint.rowAndColumn;
		point = this.cells[point.row][point.col];

		point.putTile(tile);
	};

	isValidRowCol(rowCol) {
		return rowCol.row >= 0 && rowCol.col >= 0 && rowCol.row <= this.size.row - 1 && rowCol.col <= this.size.col - 1;
	};

	getSurroundingRowAndCols(rowAndCol) {
		var rowAndCols = [];
		for (var row = rowAndCol.row - 1; row <= rowAndCol.row + 1; row++) {
			for (var col = rowAndCol.col - 1; col <= rowAndCol.col + 1; col++) {
				if ((row !== rowAndCol.row || col !== rowAndCol.col)	// Not the center given point
					&& (row >= 0 && col >= 0) && (row < BeyondTheMaps.FULL_BOARD_SIZE_LENGTH && col < BeyondTheMaps.FULL_BOARD_SIZE_LENGTH)) {	// Not outside range of the grid
					var boardPoint = this.cells[row][col];
					if (!boardPoint.isType(NON_PLAYABLE)) {	// Not non-playable
						rowAndCols.push(new RowAndColumn(row, col));
					}
				}
			}
		}
		return rowAndCols;
	}

	moveTile(notationPointStart, notationPointEnd) {
		var startRowCol = notationPointStart.rowAndColumn;
		var endRowCol = notationPointEnd.rowAndColumn;

		if (!this.isValidRowCol(startRowCol) || !this.isValidRowCol(endRowCol)) {
			debug("That point does not exist. So it's not gonna happen.");
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

		return capturedTile;
	}

	removeTile(notationPoint) {
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.cells[rowCol.row][rowCol.col];
		return boardPoint.removeTile();
	}

	canMoveTileToPoint(player, boardPointStart, boardPointEnd) {
		return boardPointStart !== boardPointEnd;
	}

	setPossibleMovePoints(boardPointStart) {
		/* if (!boardPointStart.hasTile()) {
			return;
		}
		var player = boardPointStart.tile.ownerName;
		for (var row = 0; row < this.cells.length; row++) {
			for (var col = 0; col < this.cells[row].length; col++) {
				if (this.canMoveTileToPoint(player, boardPointStart, this.cells[row][col])) {
					this.cells[row][col].addType(POSSIBLE_MOVE);
				}
			}
		} */

		if (boardPointStart.hasTile()) {
			this.setPossibleMovesForMovement({ title: "Btm", distance: boardPointStart.tile.getMoveDistance() }, boardPointStart);
		}
	}

	getAdjacentPointsPotentialPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
		var potentialMovePoints = [];
	
		if (!pointAlongTheWay) {
			pointAlongTheWay = originPoint;
		}
		var rowDifference = originPoint.row - pointAlongTheWay.row;
		var colDifference = originPoint.col - pointAlongTheWay.col;
	
		if (pointAlongTheWay.row > 0) {
			potentialMovePoints.push(this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col]);
		}
		if (pointAlongTheWay.row < BeyondTheMaps.FULL_BOARD_SIZE_LENGTH - 1) {
			potentialMovePoints.push(this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col]);
		}
		if (pointAlongTheWay.col > 0) {
			potentialMovePoints.push(this.cells[pointAlongTheWay.row][pointAlongTheWay.col - 1]);
		}
		if (pointAlongTheWay.col < BeyondTheMaps.FULL_BOARD_SIZE_LENGTH - 1) {
			potentialMovePoints.push(this.cells[pointAlongTheWay.row][pointAlongTheWay.col + 1]);
		}
	
		var finalPoints = [];
	
		var slopeOriginal = this.calculateSlopeBetweenPoints(originPoint, pointAlongTheWay);
		potentialMovePoints.forEach(potentialMovePoint => {
			if (!potentialMovePoint.isType(NON_PLAYABLE)) {
				var slopePotential = this.calculateSlopeBetweenPoints(pointAlongTheWay, potentialMovePoint);
				if (!mustPreserveDirection
						|| slopeOriginal === slopePotential
				) {
					finalPoints.push(potentialMovePoint);
				}
			}
		});
	
		return finalPoints;
	}

	calculateSlopeBetweenPoints = function(p1, p2) {
		var rise = p2.row - p1.row;
		var run = p2.col - p1.col;

		if (rise === 0) {
			if (run > 0) {
				return "PosRun";
			} else if (run < 0) {
				return "NegRun";
			}
		} else if (run === 0) {
			if (rise > 0) {
				return "PosRise";
			} else if (rise < 0) {
				return "NegRise";
			}
		}

		var slope = run === 0 ? 0 : rise / run;
		return slope;
	}

	calculateSlopeObjBetweenPoints = function(p1, p2) {
		var rise = p2.row - p1.row;
		var run = p2.col - p1.col;
		var slope = run === 0 ? 0 : rise / run;
		return {
			rise: rise,
			run: run,
			slope: slope
		};
	}

	couldMoveTileToPoint = function(tile, boardPointStart, boardPointEnd) {
		var canCapture = false;
	
		// If endpoint has a tile there that can't be captured, that is wrong.
		if (boardPointEnd.hasTile() && !canCapture) {
			return false;
		}
	
		// if (!boardPointEnd.canHoldTile(boardPointStart.tile, canCapture)) {
		// 	return false;
		// }
	
		// I guess we made it through
		return true;
	}

	tileCanMoveOntoPoint(tile, movementInfo, targetPoint, fromPoint, originPoint) {
		return this.couldMoveTileToPoint(tile, fromPoint, targetPoint);
	}

	static standardMovementFunction(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
		var mustPreserveDirection = false; //Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
		return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
	};

	setPossibleMovesForMovement(movementInfo, boardPointStart) {
		// this.setPossibleMovementPointsFromMovePoints([boardPointStart], 
		// 	BeyondTheMaps.Board.standardMovementFunction, 
		// 	boardPointStart.tile, 
		// 	movementInfo, 
		// 	boardPointStart, 
		// 	movementInfo.distance, 
		// 	0);
		this.inceptionCount = 0;
		this.setPossibleMovementPointsFromMovePointsOnePathAtATime(
			BeyondTheMaps.Board.standardMovementFunction,
			boardPointStart.tile,
			movementInfo,
			boardPointStart,
			boardPointStart,
			movementInfo.distance,
			0,
			[boardPointStart]);
		debug("Inception Count: " + this.inceptionCount);
	};

	setPossibleMovementPointsFromMovePointsOnePathAtATime = function(nextPossibleMovementPointsFunction,
																		tile,
																		movementInfo,
																		originPoint,
																		recentPoint,
																		distanceRemaining,
																		moveStepNumber,
																		currentMovementPath) {
		this.inceptionCount++;
		if (distanceRemaining === 0) {
			return;	// Complete
		}
		var self = this;
		var nextPossiblePoints = nextPossibleMovementPointsFunction(self, originPoint, recentPoint, movementInfo, moveStepNumber, currentMovementPath);
		originPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);
		nextPossiblePoints.forEach(function(adjacentPoint) {
			self.movementPointChecks++;
			// if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
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
			// }
		});
	}

	setPossibleMovementPointsFromMovePoints(movePoints, nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, distanceRemaining, moveStepNumber) {
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
				//if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
					adjacentPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);
					
					var canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
					
					/* If cannot move through point, then the distance remaining is 0, none! */
					if (!canMoveThroughPoint) {
						adjacentPoint.setMoveDistanceRemaining(movementInfo, 0);
					}
					
					if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint, originPoint)) {
						var movementOk = self.setPointAsPossibleMovement(adjacentPoint, tile, originPoint);
						if (movementOk) {
							if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
								nextPointsConfirmed.push(adjacentPoint);
							}
						}
					} else if (canMoveThroughPoint) {
						nextPointsConfirmed.push(adjacentPoint);
					}
				//}
			});
		});
	
		this.setPossibleMovementPointsFromMovePoints(nextPointsConfirmed,
			nextPossibleMovementPointsFunction, 
			tile, 
			movementInfo, 
			originPoint,
			distanceRemaining - 1,
			moveStepNumber + 1);
	}

	setPointAsPossibleMovement = function(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
		targetPoint.addType(POSSIBLE_MOVE);
		targetPoint.addPossibleMovementPath(currentMovementPath);
		return true;
	}

	canMoveHereMoreEfficientlyAlready(boardPoint, distanceRemaining, movementInfo) {
		return boardPoint.getMoveDistanceRemaining(movementInfo) >= distanceRemaining;
	}

	tileCanMoveThroughPoint(tile, movementInfo, targetPoint, fromPoint) {
		return !targetPoint.hasTile() || targetPoint.tile === tile;
	}

	removePossibleMovePoints() {
		this.cells.forEach(function(row) {
			row.forEach(function(boardPoint) {
				boardPoint.removeType(POSSIBLE_MOVE);
				boardPoint.clearPossibleMovementTypes();
				boardPoint.clearPossibleMovementPaths();
			});
		});
	}

	getBoardPointFromNotationPoint(notationPoint) {
		var rowAndCol = notationPoint.rowAndColumn;

		if (!this.isValidRowCol(rowAndCol)) {
			debug("That point does not exist. So it's not gonna happen.");
			return false;
		}

		return this.cells[rowAndCol.row][rowAndCol.col];
	}

	moveShip(notationPointStart, notationPointEnd, landNotationPoint) {
		var boardPointStart = this.getBoardPointFromNotationPoint(notationPointStart);
		var boardPointEnd = this.getBoardPointFromNotationPoint(notationPointEnd);

		var tile = boardPointStart.removeTile();

		if (!tile) {
			debug("Error: No tile to move!");
		}

		var error = boardPointEnd.putTile(tile);

		if (error) {
			debug("Error moving tile. It probably didn't get moved.");
			return false;
		}

		if (landNotationPoint) {
			this.placeLandPiecesForPlayer(tile.ownerName, [landNotationPoint]);
		}
	}

	placeLandPiecesForPlayer(playerName, landNotationPoints) {
		landNotationPoints.forEach(landNotationPoint => {
			var tile = new BeyondTheMaps.Tile(BeyondTheMaps.TileType.LAND, getPlayerCodeFromName(playerName));
			this.placeTile(tile, landNotationPoint);
		});
	}

	findPathsBetweenPoints(startPoint, endPoint, moveDistance) {
		//
	}

	markLandPointAtEndOfPathPossibleMove(moveEndPoint, lastStepPoint, player) {
		// Get "next/facing" point
		var landPoint = null;
		var nextPointArr = this.getAdjacentPointsPotentialPossibleMoves(moveEndPoint, lastStepPoint, true, null);
		if (nextPointArr && nextPointArr.length > 0) {
			var possibleLandPoint = nextPointArr[0];
			if (!possibleLandPoint.hasTile() 
				|| (possibleLandPoint.tile.tileType === BeyondTheMaps.TileType.LAND && possibleLandPoint.tile.ownerName !== player)
			) {
				landPoint = possibleLandPoint;
				landPoint.addType(POSSIBLE_MOVE);
			}
		}
		return landPoint;
	}

	getCopy() {
		var copyBoard = new BeyondTheMaps.Board();

		for (var row = 0; row < this.cells.length; row++) {
			for (var col = 0; col < this.cells[row].length; col++) {
				copyBoard.cells[row][col] = this.cells[row][col].getCopy();
			}
		}

		return copyBoard;
	}

};
