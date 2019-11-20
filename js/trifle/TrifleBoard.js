// Trifle Board

function TrifleBoard() {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	this.winners = [];
	this.tilePresenceAbilities = [];

	this.hostBannerPlayed = false;
	this.guestBannerPlayed = false;
}

TrifleBoard.prototype.brandNew = function () {
	var cells = [];

	cells[0] = this.newRow(9, 
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.gate(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[1] = this.newRow(11, 
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.redWhiteNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(), 
		TrifleBoardPoint.neutral()
		]);

	cells[2] = this.newRow(13, 
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.whiteNeutral(), 
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[3] = this.newRow(15,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.whiteNeutral(), 
		TrifleBoardPoint.white(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[4] = this.newRow(17,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.whiteNeutral(), 
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[5] = this.newRow(17,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.whiteNeutral(), 
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[6] = this.newRow(17,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.whiteNeutral(), 
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[7] = this.newRow(17,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.whiteNeutral(), 
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[8] = this.newRow(17,
		[TrifleBoardPoint.gate(),
		TrifleBoardPoint.redWhiteNeutral(), 
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.redWhiteNeutral(),
		TrifleBoardPoint.gate()
		]);

	cells[9] = this.newRow(17,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.redNeutral(), 
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.whiteNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[10] = this.newRow(17,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.redNeutral(), 
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.whiteNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[11] = this.newRow(17,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.redNeutral(), 
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.whiteNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[12] = this.newRow(17,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.redNeutral(), 
		TrifleBoardPoint.red(),
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.whiteNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[13] = this.newRow(15,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.redNeutral(), 
		TrifleBoardPoint.red(),
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.white(),
		TrifleBoardPoint.whiteNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[14] = this.newRow(13,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.redNeutral(), 
		TrifleBoardPoint.redWhite(),
		TrifleBoardPoint.whiteNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[15] = this.newRow(11,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.redWhiteNeutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	cells[16] = this.newRow(9,
		[TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.gate(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral(),
		TrifleBoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

TrifleBoard.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new TrifleBoardPoint();
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

TrifleBoard.prototype.placeTile = function(tile, notationPoint) {
	this.putTileOnPoint(tile, notationPoint);

	if (TrifleTileInfo.tileIsBanner(TrifleTiles[tile.code])) {
		if (tile.ownerName === HOST) {
			this.hostBannerPlayed = true;
		} else {
			this.guestBannerPlayed = true;
		}
	}

	// Things to do after a tile is placed

	/* Process abilities after placing tile */
	var tileInfo = TrifleTiles[tile.code];
	this.setTilePresenceAbilitiesForPlayer(tile.ownerName, tileInfo);

	var boardPoint = this.getPointFromNotationPoint(notationPoint);

	if (boardPoint.hasTile() && boardPoint.tile.code === tile.code) {
		this.applyZoneAbilityToTile(boardPoint);
		this.applyBoardScanAbilities();
	}
};

TrifleBoard.prototype.setTilePresenceAbilitiesForPlayer = function(playerName, tileInfo) {
	if (tileInfo && tileInfo.abilities) {
		var self = this;
		tileInfo.abilities.forEach(function(abilityInfo) {
			self.tilePresenceAbilities.push({
				playerName: playerName,
				abilityInfo: abilityInfo
			});
		});
	}
};

TrifleBoard.prototype.applyZoneAbilityToTile = function(boardPoint) {
	var tileInfo = TrifleTiles[boardPoint.tile.code];
	var tile = boardPoint.tile;
	zone = TrifleTileInfo.getTerritorialZone(tileInfo);
	if (zone) {
		tile.activeZone = {
			size: zone.size
		}
		if (zone.abilities) {
			zone.abilities.forEach(function(ability) {
				if (ability.type === ZoneAbility.canceledWhenInTemple) {
					tile.activeZone.canceled = boardPoint.isType(TEMPLE);
				}
			});
		}
	}
};

TrifleBoard.prototype.applyBoardScanAbilities = function() {
	var self = this;
	/* Clear all */
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			boardPoint.tile.protected = false;
		}
	});

	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			self.applyZoneProtectionAbilityForBoardPoint(boardPoint);
		}
	});
};

TrifleBoard.prototype.applyZoneProtectionAbilityForBoardPoint = function(boardPoint) {
	var tileInfo = TrifleTiles[boardPoint.tile.code];
	var zoneInfo = TrifleTileInfo.getTerritorialZone(tileInfo);
	if (zoneInfo && zoneInfo.abilities) {
		var self = this;
		zoneInfo.abilities.forEach(function(zoneAbility) {
			if (zoneAbility.type === ZoneAbility.protectFriendlyTilesFromCapture) {
				self.applyProtectFriendlyTilesFromCaptureAbility(boardPoint, zoneInfo, zoneAbility);
			}
		});
	}
};
TrifleBoard.prototype.applyProtectFriendlyTilesFromCaptureAbility = function(boardPoint, zoneInfo, zoneAbility) {
	var self = this;
	if (zoneAbility && zoneAbility.targetTileTypes) {
		this.forEachBoardPoint(function(targetPoint) {
			if (targetPoint.hasTile() && targetPoint.tile.ownerName === boardPoint.tile.ownerName) {
				var targetTileInfo = TrifleTiles[targetPoint.tile.code];
				if (TrifleTileInfo.tileIsOneOfTheseTypes(targetTileInfo, zoneAbility.targetTileTypes)) {
					var distanceAway = self.getDistanceBetweenPoints(boardPoint, targetPoint);
					if (distanceAway <= zoneInfo.size) {
						targetPoint.tile.protected = true;
						debug("I protected tile: " + targetPoint.tile);
					}
				}
			}
		});
	}
};

TrifleBoard.prototype.getDistanceBetweenPoints = function(bp1, bp2) {
	return Math.abs(bp1.row - bp2.row) + Math.abs(bp1.col - bp2.col)
};

TrifleBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

TrifleBoard.prototype.getPointFromNotationPoint = function(notationPoint) {
	var rowAndCol = notationPoint.rowAndColumn;
	return this.cells[rowAndCol.row][rowAndCol.col];
};

TrifleBoard.prototype.getSurroundingRowAndCols = function(rowAndCol) {
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

TrifleBoard.prototype.getSurroundingBoardPoints = function(initialBoardPoint) {
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

TrifleBoard.prototype.getAdjacentRowAndCols = function(rowAndCol) {
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
TrifleBoard.prototype.getAdjacentPoints = function(boardPointStart) {
	return this.getAdjacentRowAndCols(boardPointStart);
};

TrifleBoard.prototype.getAdjacentPointsPotentialPossibleMoves = function(boardPointStart) {
	var potentialMovePoints = [];

	if (boardPointStart.row > 0) {
		var adjacentPoint = this.cells[boardPointStart.row - 1][boardPointStart.col];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isType(POSSIBLE_MOVE)) {
			potentialMovePoints.push(adjacentPoint);
		}
	}
	if (boardPointStart.row < paiShoBoardMaxRowOrCol) {
		var adjacentPoint = this.cells[boardPointStart.row + 1][boardPointStart.col];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isType(POSSIBLE_MOVE)) {
			potentialMovePoints.push(adjacentPoint);
		}
	}
	if (boardPointStart.col > 0) {
		var adjacentPoint = this.cells[boardPointStart.row][boardPointStart.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isType(POSSIBLE_MOVE)) {
			potentialMovePoints.push(adjacentPoint);
		}
	}
	if (boardPointStart.col < paiShoBoardMaxRowOrCol) {
		var adjacentPoint = this.cells[boardPointStart.row][boardPointStart.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isType(POSSIBLE_MOVE)) {
			potentialMovePoints.push(adjacentPoint);
		}
	}

	return potentialMovePoints;
};

TrifleBoard.prototype.getAdjacentDiagonalPointsPotentialPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection) {
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
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isType(POSSIBLE_MOVE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && rowDifference <= 0 && colDifference <= 0))
			&& (pointAlongTheWay.row < paiShoBoardMaxRowOrCol && pointAlongTheWay.col < paiShoBoardMaxRowOrCol)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isType(POSSIBLE_MOVE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference >= 0 && rowDifference <= 0))
			&& (pointAlongTheWay.col > 0 && pointAlongTheWay.row < paiShoBoardMaxRowOrCol)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isType(POSSIBLE_MOVE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference <= 0 && rowDifference >= 0))
			&& (pointAlongTheWay.col < paiShoBoardMaxRowOrCol && pointAlongTheWay.row > 0)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isType(POSSIBLE_MOVE)) {
			diagonalPoints.push(adjacentPoint);
		}
	}

	return diagonalPoints;
};

TrifleBoard.prototype.calculateSlopeBetweenPoints = function(p1, p2) {
	var rise = p2.row - p1.row;
	var run = p2.col - p1.col;
	var slope = run === 0 ? 0 : rise / run;
	return slope;
};

TrifleBoard.prototype.getNextPointsForJumpShapeMovement = function(movementInfo, originPoint, pointAlongTheWay, mustPreserveDirection) {
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
			if (!point.isType(NON_PLAYABLE) && !point.isType(POSSIBLE_MOVE)
					&& (!reallyMustPreserveDirection || self.calculateSlopeBetweenPoints(pointAlongTheWay, point) === slope)) {
				finalPoints.push(point);
			}
		});
	}

	return finalPoints;
};
TrifleBoard.prototype.getPointsWithMoveStepAppliedToRow = function(startPoints, stepDistance) {
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
TrifleBoard.prototype.getPointsWithMoveStepAppliedToCol = function(startPoints, stepDistance) {
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

TrifleBoard.prototype.getPointsNextToTilesInLineOfSight = function(movementInfo, originPoint) {
	var jumpPoints = [];
	if (movementInfo.type === MovementType.jumpAlongLineOfSight && movementInfo.targetTileTypes) {
		/* Scan in all directions, if a tile found, see if it can be jumped to */
		var tileFound = false;
		for (var row = originPoint.row + 1; row < paiShoBoardMaxRowOrCol && !tileFound; row++) {
			var checkPoint = this.cells[row+1][originPoint.col]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = TrifleTiles[checkPoint.tile.code];
				if (checkPointTileInfo && TrifleTileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[row][originPoint.col]);
				}
			}
		}

		tileFound = false;
		for (var row = originPoint.row - 1; row > 0 && !tileFound; row--) {
			var checkPoint = this.cells[row-1][originPoint.col]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = TrifleTiles[checkPoint.tile.code];
				if (checkPointTileInfo && TrifleTileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[row][originPoint.col]);
				}
			}
		}

		tileFound = false;
		for (var col = originPoint.col + 1; col < paiShoBoardMaxRowOrCol && !tileFound; col++) {
			var checkPoint = this.cells[originPoint.row][col+1]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = TrifleTiles[checkPoint.tile.code];
				if (checkPointTileInfo && TrifleTileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[originPoint.row][col]);
				}
			}
		}

		tileFound = false;
		for (var col = originPoint.col - 1; col > 0 && !tileFound; col--) {
			var checkPoint = this.cells[originPoint.row][col-1]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = TrifleTiles[checkPoint.tile.code];
				if (checkPointTileInfo && TrifleTileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[originPoint.row][col]);
				}
			}
		}
	}
	return jumpPoints;
};

TrifleBoard.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate();
};

TrifleBoard.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
		return false;
	}

	var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
	var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

	// if (!this.canMoveTileToPoint(player, boardPointStart, boardPointEnd)) {
	// 	debug("Bad move bears");
	// 	showBadMoveModal();
	// 	return false;
	// }

	var tile = boardPointStart.removeTile();

	if (!tile) {
		debug("Error: No tile to move!");
	}

	// If tile is capturing a Banner tile, there's a winner
	if (boardPointEnd.hasTile() 
			&& TrifleTileInfo.tileIsBanner(TrifleTiles[boardPointEnd.tile.code])
			&& tile.ownerName !== boardPointEnd.tile.ownerName) {
		this.winners.push(tile.ownerName);
	}

	var capturedTile = boardPointEnd.tile;

	boardPointEnd.putTile(tile);

	this.setPointFlags();

	/* Process abilities after moving a tile */
	this.applyZoneAbilityToTile(boardPointEnd);
	this.applyBoardScanAbilities();

	return {
		movedTile: tile,
		startPoint: boardPointStart,
		endPoint: boardPointEnd,
		capturedTile: capturedTile
	}
};

TrifleBoard.prototype.setPointFlags = function() {
	// // First, unblock, unprotect
	// for (var row = 0; row < this.cells.length; row++) {
	// 	for (var col = 0; col < this.cells[row].length; col++) {
	// 		var bp = this.cells[row][col];
	// 		if (bp.hasTile()) {
	// 			bp.tile.blocked = false;
	// 			bp.tile.protected = false;
	// 		}
	// 	}
	// }
	// // Find Chrysanthemum tiles, then check surrounding Bison tiles to set them as blocked
	// for (var row = 0; row < this.cells.length; row++) {
	// 	for (var col = 0; col < this.cells[row].length; col++) {
	// 		var bp = this.cells[row][col];
	// 		this.blockTilesAdjacentToPointIfNeeded(bp);
	// 		this.protectTilesAdjacentToPointIfNeeded(bp);
	// 	}
	// }
};

// TrifleBoard.prototype.blockTilesAdjacentToPointIfNeeded = function(boardPoint) {
// 	if (!boardPoint.hasTile()) {
// 		return;
// 	}
// 	if (boardPoint.tile.code !== 'C') {
// 		return;
// 	}

// 	// Chrysanthemum blocks opponent's Sky Bison

// 	var chrysanthemumOwner = boardPoint.tile.ownerName;

// 	var rowCols = this.getAdjacentRowAndCols(boardPoint);

// 	for (var i = 0; i < rowCols.length; i++) {
// 		var bp = this.cells[rowCols[i].row][rowCols[i].col];
// 		if (bp.hasTile()) {
// 			if (bp.tile.code === 'S' && bp.tile.ownerName !== chrysanthemumOwner) {
// 				bp.tile.blocked = true;
// 			}
// 		}
// 	}
// };

// TrifleBoard.prototype.protectTilesAdjacentToPointIfNeeded = function(boardPoint) {
// 	if (!boardPoint.hasTile()) {
// 		return;
// 	}
// 	if (boardPoint.tile.code !== 'B') {
// 		return;
// 	}

// 	/* Badgermole protects same player's Flower Tiles */

// 	var badgermoleOwner = boardPoint.tile.ownerName;

// 	var rowCols = this.getAdjacentRowAndCols(boardPoint);

// 	for (var i = 0; i < rowCols.length; i++) {
// 		var bp = this.cells[rowCols[i].row][rowCols[i].col];
// 		if (bp.hasTile()) {
// 			if (bp.tile.isFlowerTile() && bp.tile.ownerName === badgermoleOwner) {
// 				bp.tile.protected = true;
// 			}
// 		}
// 	}
// };

TrifleBoard.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	var tile = boardPointStart.tile;
	var otherTile = boardPointEnd.tile;

	if (tile.ownerName === otherTile.ownerName) {
		return false;	// Cannot capture own tile
	}

	if (otherTile.protected) {
		return false;	// Cannot capture protected tiles
	}

	// Is tile even a tile that can capture at all?
	if (!tile.hasCaptureAbility()) {
		debug(tile.getName() + " cannot capture anything.");
		return false;
	}

	// TODO Check if tile is protected from capture...
	//

	var playerLotusPlayed = this.hostBannerPlayed;
	var otherLotusPlayed = this.guestBannerPlayed;
	if (tile.ownerName === GUEST) {
		playerLotusPlayed = this.guestBannerPlayed;
		otherLotusPlayed = this.hostBannerPlayed;
	}

	// Okay, so the tile is a tile that is able to capture things... 
	// Can the player capture Flower Tiles? (if they've played Lotus)
	if (otherTile.isFlowerTile()) {
		return playerLotusPlayed;
	} else {
		return playerLotusPlayed && otherLotusPlayed;
	}
};

TrifleBoard.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
	// start point must have a tile
	if (!boardPointStart.hasTile()) {
		return false;
	}

	// Tile must belong to player
	if (boardPointStart.tile.ownerName !== player) {
		return false;
	}

	// Cannot move blocked tile (Bison blocked by Chrysanthemum)
	// if (boardPointStart.tile.blocked) {
	// 	return false;
	// }
	
	var canCapture = false;
	if (boardPointEnd.hasTile()) {
		canCapture = this.canCapture(boardPointStart, boardPointEnd);
	}

	// If endpoint is a Gate with no tile, that's wrong.
	if (!boardPointEnd.hasTile() && boardPointEnd.isType(GATE)) {
		return false;
	}

	// If endpoint has a tile there that can't be captured, that is wrong.
	if (boardPointEnd.hasTile() && !canCapture) {
		return false;
	}

	// Sky Bison special: Cannot move into other Bison "zone"
	// if (boardPointStart.tile.code === 'S') {
	// 	// If overlaps with another Bison zone, return false
	// 	// Get all other Sky Bison tiles, check their zones
	// 	var bisons = [];	// Incorrect plural is an LOK reference
	// 	for (var row = 0; row < this.cells.length; row++) {
	// 		for (var col = 0; col < this.cells[row].length; col++) {
	// 			var bp = this.cells[row][col];
	// 			if (bp.hasTile() && bp.tile.code === 'S' && bp.tile.id !== boardPointStart.tile.id && !bp.isType(GATE) && !bp.tile.blocked
	// 				&& bp.tile.ownerCode != boardPointStart.tile.ownerCode) {
	// 				bisons.push(bp);
	// 			}
	// 		}
	// 	}

	// 	for (var i = 0; i < bisons.length; i++) {
	// 		if (Math.abs(bisons[i].row - boardPointEnd.row) + Math.abs(bisons[i].col - boardPointEnd.col) <= 6) {
	// 			return false;
	// 		}
	// 	}
	// }

	// Dragon special: Can move within Fire Lily range
	if (boardPointStart.tile.code === 'D') {
		// Must have Fire Lily
		var fireLilyPoints = this.getFireLilyPoints(boardPointStart.tile.ownerName);

		if (!fireLilyPoints || fireLilyPoints.length === 0) {
			debug("No Fire Lily");
			return false;
		}

		var closeFireLilyPoints = [];
		for (var i = 0; i < fireLilyPoints.length; i++) {
			var fp = fireLilyPoints[i];
			var dist = Math.abs(fp.row - boardPointStart.row) + Math.abs(fp.col - boardPointStart.col);
			if (dist <= 5) {
				closeFireLilyPoints.push(fp);
			}
		}

		for (var i = 0; i < closeFireLilyPoints.length; i++) {
			var fireLilyPoint = closeFireLilyPoints[i];
			if (Math.abs(fireLilyPoint.row - boardPointEnd.row) + Math.abs(fireLilyPoint.col - boardPointEnd.col) <= 5) {
				// Point inside Fire Lily range
				return true;
			}
		}
		// If we haven't returned true, we need to return false here
		return false;
	}

	// Wheel
	if (boardPointStart.tile.code === 'W') {
		var bp = boardPointStart;
		var bp2 = boardPointEnd;
		if (bp.row - bp.col === bp2.row - bp2.col) {
			// Up or Down
			// Verify no tiles in the way
			var rowStart = bp.row + 1;
			var rowEnd = bp2.row;
			if (bp.row > bp2.row) {
				rowStart = bp2.row + 1;
				rowEnd = bp.row;
			}

			// Scan for tile in the way from start to end point
			for (var row = rowStart; row < rowEnd; row++) {
				var col = row - (bp.row - bp.col);
				if (this.cells[row][col].hasTile()) {
					return false;
				}
			}

			return true;
		} else if (bp.row + bp.col === bp2.row + bp2.col) {
			// Left or Right
			// Verify no tiles in the way
			var rowStart = bp.row + 1;
			var rowEnd = bp2.row;
			if (bp.row > bp2.row) {
				rowStart = bp2.row + 1;
				rowEnd = bp.row;
			}

			if (bp2.row === 5 && bp2.col === 5) {
				debug("hi");
			}

			// Scan for tile in the way from start to end point
			for (var row = rowStart; row < rowEnd; row++) {
				var col = bp.row + bp.col - row;
				if (this.cells[row][col].hasTile()) {
					return false;
				}
			}

			return true;
		} else {
			return false;
		}
	}

	/* Special for Badgermole */
	if (boardPointStart.tile.code === 'B') {
		/* Can move directly next to Flower Tile if in line
		Is there a Flower Tile next to this end point? */
		if (this.inLineWithAdjacentFlowerTileWithNothingBetween(boardPointStart, boardPointEnd)) {
			return true;
		}
	}

	if (boardPointStart.tile.code === TrifleTileCodes.MessengerHawk) {
		/* Can move anywhere, cannot capture */
		return !boardPointEnd.hasTile();
	}

	// Normal tile movement:
	// If endpoint is too far away, that is wrong.
	var numMoves = boardPointStart.tile.getMoveDistance();
	if (Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col) > numMoves) {
		// end point is too far away, can't move that far
		return false;
	} else {
		// Move may be possible. But there may be tiles in the way...
		if (!this.verifyAbleToReach(boardPointStart, boardPointEnd, numMoves, boardPointStart.tile)) {
			return false;
		}
	}

	// I guess we made it through
	return true;
};

TrifleBoard.prototype.inLineWithAdjacentFlowerTileWithNothingBetween = function(bp, bp2) {
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

TrifleBoard.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves, movingTile) {
  // Recursion!
  return this.pathFound(boardPointStart, boardPointEnd, numMoves, movingTile);
};

TrifleBoard.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves, movingTile) {
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

TrifleBoard.prototype.pointIsNextToOpponentTile = function(bp, originalPlayerCode, tileCode) {
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

TrifleBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
	if (boardPointStart.hasTile()) {
		var playerName = boardPointStart.tile.ownerName;

		var tileInfo = TrifleTiles[boardPointStart.tile.code];
		if (tileInfo) {
			var self = this;
			if (tileInfo.movements) {
				tileInfo.movements.forEach(function(movementInfo) {
					// var distanceAdjustment = this.getMovementDistanceAdjustment(playerName, tileInfo, movementInfo);
					self.setPossibleMovesForMovement(movementInfo, boardPointStart);
				});
			}
			var bonusMovementInfo = this.getBonusMovementInfo(boardPointStart);
			this.setBonusMovementPossibleMoves(bonusMovementInfo, boardPointStart);
		}
	}
};

TrifleBoard.prototype.getBonusMovementInfo = function(originPoint) {
	var playerName = originPoint.tile.ownerName;
	var tileInfo = TrifleTiles[originPoint.tile.code];
	var bonusMovementInfo = {};
	this.tilePresenceAbilities.forEach(function(ability) {
		if (ability.playerName === playerName) {
			if (ability.abilityInfo.type === TileAbility.increaseFriendlyTileMovementDistance) {
				if (
						(
							ability.abilityInfo.targetTileTypes 
							&& ability.abilityInfo.targetTileTypes.includesOneOf(tileInfo.types)
						)
						|| !ability.abilityInfo.targetTileTypes
					) {
					bonusMovementDistance = ability.abilityInfo.amount;
					bonusMovementInfo = {
						type: MovementType.standard,
						distance: bonusMovementDistance,
						movementFunction: TrifleBoard.standardMovementFunction
					}
				}
			}
		}
	});
	if (bonusMovementInfo.type) {
		return bonusMovementInfo;
	}
};
/**
TrifleBoard.prototype.getMovementDistanceAdjustment = function(playerName, tileInfo, movementInfo) {
	// TODO check movementInfo type, only apply to standard
	self.tilePresenceAbilities.forEach(function(ability) {
		if (ability.playerName === playerName) {
			if (ability.abilityInfo.type === TileAbility.increaseFriendlyTileMovementDistance) {
				if ((ability.abilityInfo.targetTileTypes && ability.abilityInfo.targetTileTypes.includesOneOf(tileInfo.types))
						|| !ability.abilityInfo.targetTileTypes) {
					distanceAdjustment = ability.abilityInfo.amount;
				}
			}
		}
	});
};
**/

TrifleBoard.prototype.setPossibleMovesForMovement = function(movementInfo, boardPointStart) {
	this.movementPointChecks = 0;
	var isImmobilized = this.tileMovementIsImmobilized(boardPointStart.tile, movementInfo, boardPointStart);
	if (!isImmobilized) {
		if (movementInfo.type === MovementType.standard) {
			/* Standard movement, moving and turning as you go */
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], TrifleBoard.standardMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance);
		} else if (movementInfo.type === MovementType.diagonal) {
			/* Diagonal movement, jumping across the lines up/down/left/right as looking at the board */
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], TrifleBoard.diagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance);
		} else if (movementInfo.type === MovementType.jumpAlongLineOfSight) {
			/* Jump to tiles along line of sight */
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], TrifleBoard.jumpAlongLineOfSightMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, 1);
		} else if (movementInfo.type === MovementType.withinFriendlyTileZone) {
			this.setMovePointsWithinTileZone(boardPointStart, boardPointStart.tile.ownerName, boardPointStart.tile, movementInfo);
		} else if (movementInfo.type === MovementType.anywhere) {
			this.setMovePointsAnywhere(boardPointStart, movementInfo);
		} else if (movementInfo.type === MovementType.jumpShape) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], TrifleBoard.jumpShapeMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance);
		}
	}
	debug("Movement Point Checks: " + this.movementPointChecks);
};
TrifleBoard.standardMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo) {
	return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay);
};
TrifleBoard.diagonalMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo) {
	var mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
	return board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection);
};
TrifleBoard.jumpAlongLineOfSightMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo) {
	return board.getPointsNextToTilesInLineOfSight(movementInfo, originPoint);
};
TrifleBoard.jumpShapeMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo) {
	var mustPreserveDirection = TrifleTileInfo.movementMustPreserveDirection(movementInfo);
	return board.getNextPointsForJumpShapeMovement(movementInfo, originPoint, boardPointAlongTheWay, mustPreserveDirection);
};
/* TrifleBoard.prototype.setPossibleMovementPoints = function(nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, recentPoint, distanceRemaining) {
	if (distanceRemaining === 0) {
		return;	// Complete
	}
	var self = this;
	var nextPossiblePoints = nextPossibleMovementPointsFunction(self, originPoint, recentPoint, movementInfo);
	// nextPossiblePoints.forEach(function(adjacentPoint) {
	// 	self.movementPointChecks++;
	// 	if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining)) {
	// 		var canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
	// 		if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
	// 			adjacentPoint.addType(POSSIBLE_MOVE);
	// 			adjacentPoint.standardMoveDistanceRemaining = distanceRemaining;
	// 			if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
	// 				self.setPossibleMovementPoints(nextPossibleMovementPointsFunction, 
	// 						tile, 
	// 						movementInfo, 
	// 						originPoint,
	// 						adjacentPoint, 
	// 						distanceRemaining - 1);
	// 			}
	// 		} else if (canMoveThroughPoint) {
	// 			adjacentPoint.standardMoveDistanceRemaining = distanceRemaining;
	// 			self.setPossibleMovementPoints(nextPossibleMovementPointsFunction, 
	// 					tile, 
	// 					movementInfo, 
	// 					originPoint,
	// 					adjacentPoint, 
	// 					distanceRemaining - 1);
	// 		}
	// 	}
	// });

	originPoint.standardMoveDistanceRemaining = distanceRemaining;

	var nextPointsConfirmed = [];
	nextPossiblePoints.forEach(function(adjacentPoint) {
		self.movementPointChecks++;
		if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining)) {
			var canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
			if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
				adjacentPoint.addType(POSSIBLE_MOVE);
				if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
					nextPointsConfirmed.push(adjacentPoint);
				}
			} else if (canMoveThroughPoint) {
				nextPointsConfirmed.push(adjacentPoint);
			}
		}
	});
	this.setPossibleMovementPointsFromMovePoints(nextPointsConfirmed,
		nextPossibleMovementPointsFunction, 
		tile, 
		movementInfo, 
		originPoint,
		distanceRemaining - 1);
}; */

TrifleBoard.prototype.setPossibleMovementPointsFromMovePoints = function(movePoints, nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, distanceRemaining) {
	if (distanceRemaining === 0
			|| !movePoints
			|| movePoints.length <= 0) {
		return;	// Complete
	}

	debug("MovePoints: ");
	debug(movePoints);

	var self = this;
	var nextPointsConfirmed = [];
	movePoints.forEach(function(recentPoint) {
		var nextPossiblePoints = nextPossibleMovementPointsFunction(self, originPoint, recentPoint, movementInfo);
		nextPossiblePoints.forEach(function(adjacentPoint) {
			self.movementPointChecks++;
			if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining)) {
				adjacentPoint.standardMoveDistanceRemaining = distanceRemaining;
				var canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
				if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
					adjacentPoint.addType(POSSIBLE_MOVE);
					if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
						nextPointsConfirmed.push(adjacentPoint);
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
		distanceRemaining - 1);
};

TrifleBoard.prototype.getPointsMarkedAsPossibleMove = function() {
	var possibleMovePoints = [];
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			possibleMovePoints.push(boardPoint);
		}
	});
	return possibleMovePoints;
};

TrifleBoard.prototype.setBonusMovementPossibleMoves = function(bonusMovementInfo, originPoint) {
	if (bonusMovementInfo && bonusMovementInfo.type && bonusMovementInfo.distance && bonusMovementInfo.movementFunction) {
		var possibleMovePoints = this.getPointsMarkedAsPossibleMove();
		possibleMovePoints.push(originPoint);
		var self = this;
		possibleMovePoints.forEach(function(boardPoint) {
			self.setPossibleMovementPointsFromMovePoints([boardPoint], bonusMovementInfo.movementFunction, originPoint.tile, bonusMovementInfo, boardPoint, bonusMovementInfo.distance);
		});
	}
};

TrifleBoard.prototype.setMovePointsAnywhere = function(boardPointStart, movementInfo) {
	var self = this;
	this.forEachBoardPoint(function(boardPoint) {
		if (self.tileCanMoveOntoPoint(boardPointStart.tile, movementInfo, boardPoint, boardPointStart)) {
			boardPoint.addType(POSSIBLE_MOVE);
		}
	});
};

TrifleBoard.prototype.tileMovementIsImmobilized = function(tile, movementInfo, boardPointStart) {
	return this.tileMovementIsImmobilizedByMovementRestriction(tile, movementInfo, boardPointStart)
		|| this.tileMovementIsImmobilizedByZoneAbility(tile, movementInfo, boardPointStart);
};

TrifleBoard.prototype.tileMovementIsImmobilizedByZoneAbility = function(tileBeingMoved, movementInfo, boardPointStart) {
	var isImmobilized = false;
	var tileBeingMovedInfo = TrifleTiles[tileBeingMoved.code];
	var self = this;
	this.forEachBoardPointWithTile(function(boardPoint) {
		var zoneInfo = TrifleTileInfo.getTerritorialZone(TrifleTiles[boardPoint.tile.code]);
		if (zoneInfo && zoneInfo.abilities) {
			zoneInfo.abilities.forEach(function(zoneAbility) {
				if (self.tileMovementIsImmobilizedByTileZoneAbility(zoneAbility, boardPoint, tileBeingMoved, tileBeingMovedInfo, boardPointStart)) {
					isImmobilized = true;
				}
			});
		}
	});
	return isImmobilized;
};

TrifleBoard.prototype.tileMovementIsImmobilizedByTileZoneAbility = function(zoneAbility, tilePoint, tileBeingMoved, tileBeingMovedInfo, movementStartPoint) {
	var isImmobilized = false;
	if (zoneAbility.type === ZoneAbility.immobilizesOpponentTiles
			&& tilePoint.tile.ownerName !== tileBeingMovedInfo.ownerName
			&& this.pointTileZoneContainsPoint(tilePoint, movementStartPoint)) {
		if (zoneAbility.targetTileCodes) {
			if (zoneAbility.targetTileCodes.includes(tileBeingMoved.code)) {
				isImmobilized = true;
			}
		} else {
			isImmobilized = true;
		}
	}
	return isImmobilized;
};

TrifleBoard.prototype.tileMovementIsImmobilizedByMovementRestriction = function(tile, movementInfo, boardPointStart) {
	var isImmobilized = false;
	if (tile && movementInfo.restrictions) {
		var self = this;
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === MovementRestriction.immobilizedByOpponentTileZones) {
				movementRestriction.affectingTiles.forEach(function(affectingTileCode) {
					isImmobilized = self.pointIsInTileZone(boardPointStart, affectingTileCode, getOpponentName(tile.ownerName));
				});
			}
		});
	}
	return isImmobilized;
};

/**
 * Check if given boardPoint is within the zone of target tile belonging to zoneOwner.
 **/
TrifleBoard.prototype.pointIsInTileZone = function(boardPoint, targetTileCode, zoneOwner) {
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

TrifleBoard.prototype.getTilePoints = function(tileCode, ownerName) {
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

TrifleBoard.prototype.getPointsForTileCodes = function(tileCodes, ownerName) {
	var points = [];
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()
				&& tileCodes.includes(boardPoint.tile.code)
				&& boardPoint.tile.ownerName === ownerName) {
			points.push(boardPoint);
		}
	});
	return points;
};

TrifleBoard.prototype.canMoveHereMoreEfficientlyAlready = function(boardPoint, distanceRemaining) {
	// return boardPoint.isType(POSSIBLE_MOVE) && 
	return boardPoint.standardMoveDistanceRemaining >= distanceRemaining;
};

TrifleBoard.prototype.tileCanMoveOntoPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	var tileInfo = TrifleTiles[tile.code];
	var canCaptureTarget = this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
	return (!targetPoint.hasTile() || canCaptureTarget)
		&& (!targetPoint.isType(TEMPLE) || canCaptureTarget)
		&& !this.tileZonedOutOfSpace(tile, movementInfo, targetPoint)
		&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint);
};

TrifleBoard.prototype.targetPointIsEmptyOrCanBeCaptured = function(tile, movementInfo, fromPoint, targetPoint) {
	return !targetPoint.hasTile() 
		|| this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
};

TrifleBoard.prototype.targetPointHasTileTileThatCanBeCaptured = function(tile, movementInfo, fromPoint, targetPoint) {
	return targetPoint.hasTile() 
		&& this.tileCanCapture(tile, movementInfo, fromPoint, targetPoint);
};

TrifleBoard.prototype.tileCanCapture = function(tile, movementInfo, fromPoint, targetPoint) {
	var playerBannerPlayed = this.hostBannerPlayed;
	var otherBannerPlayed = this.guestBannerPlayed;
	if (tile.ownerName === GUEST) {
		playerBannerPlayed = this.guestBannerPlayed;
		otherBannerPlayed = this.hostBannerPlayed;
	}

	var targetTileInfo = TrifleTiles[targetPoint.tile.code];

	return targetTileInfo 
		&& movementInfo 
		&& movementInfo.captureTypes
		&& movementInfo.captureTypes.includes(CaptureType.all)
		&& (
			(playerBannerPlayed 
				&& TrifleTileInfo.tileIsOneOfTheseTypes(targetTileInfo, [TileType.flower, TileType.banner])
			)
			|| (playerBannerPlayed && otherBannerPlayed)
		)
		&& tile.ownerName !== targetPoint.tile.ownerName
		&& !targetPoint.tile.protected;
};

TrifleBoard.prototype.tileCanMoveThroughPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	var tileInfo = TrifleTiles[tile.code];
	return tileInfo
		&& (!targetPoint.hasTile()
				|| this.movementInfoHasAbility(movementInfo, MovementAbility.jumpOver)
			)
		&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint);
};

TrifleBoard.prototype.movementInfoHasAbility = function(movementInfo, movementAbilityType) {
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

TrifleBoard.prototype.tileZonedOutOfSpace = function(tile, movementInfo, targetPoint) {
	var isZonedOut = false;
	if (movementInfo.restrictions && movementInfo.restrictions.length > 0) {
		var self = this;
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === MovementRestriction.restrictedByOpponentTileZones) {
				movementRestriction.affectingTiles.forEach(function(affectingTileCode) {
					isZonedOut = self.pointIsInTileZone(targetPoint, affectingTileCode, getOpponentName(tile.ownerName));
				});
			}
		});
	}
	return isZonedOut;
};

TrifleBoard.prototype.tileInfoHasMovementType = function(tileInfo, movementType) {
	var movementTypeFound = false;
	tileInfo.movements.forEach(function(movementInfo) {
		if (movementInfo.type === movementType) {
			movementTypeFound = true;
		}
	});
	return movementTypeFound;
};

TrifleBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
			boardPoint.standardMoveDistanceRemaining = 0;
		});
	});
};

TrifleBoard.prototype.getFireLilyPoint = function(player) {
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

TrifleBoard.prototype.getFireLilyPoints = function(player) {
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

TrifleBoard.prototype.setDeployPointsPossibleMoves = function(player, tileCode) {
	var tileInfo = TrifleTiles[tileCode];
	if (!tileInfo) {
		debug("You need the tileInfo for " + tileCode);
	}

	var self = this;

	if (tileInfo && tileInfo.specialDeployTypes) {
		tileInfo.specialDeployTypes.forEach(function(specialDeployInfo) {
			self.setDeployPointsPossibleForSpecialDeploy(player, tileInfo, specialDeployInfo);
		});
	}

	if (tileInfo && tileInfo.deployTypes) {
		if (tileInfo.deployTypes.includes(DeployType.anywhere)) {
			this.forEachBoardPoint(function(boardPoint) {
				if (!boardPoint.hasTile()
						&& !boardPoint.isType(GATE)) {
					boardPoint.addType(POSSIBLE_MOVE);
				}
			});
		}

		if (tileInfo.deployTypes.includes(DeployType.temple)) {
			this.forEachBoardPoint(function(boardPoint) {
				if (!boardPoint.hasTile()
						&& boardPoint.isType(GATE)) {
					boardPoint.addType(POSSIBLE_MOVE);
				}
			});
		}
	}
};

TrifleBoard.prototype.setDeployPointsPossibleForSpecialDeploy = function(player, tileInfo, specialDeployInfo) {
	if (specialDeployInfo.type === SpecialDeployType.withinFriendlyTileZone) {
		this.setDeployPointsWithinTileZone(player, tileInfo, specialDeployInfo);
	}
};

TrifleBoard.prototype.setDeployPointsWithinTileZone = function(zoneOwner, tileInfo, specialDeployInfo) {
	if (specialDeployInfo.targetTileCodes && specialDeployInfo.targetTileCodes.length > 0) {
		var self = this;
		this.forEachBoardPoint(function(targetPoint) {
			if (!targetPoint.hasTile() && !targetPoint.isType(TEMPLE)
					&& self.pointIsWithinZoneOfOneOfTheseTiles(targetPoint, specialDeployInfo.targetTileCodes, zoneOwner)) {
				targetPoint.addType(POSSIBLE_MOVE);
			}
		});
	}
};

TrifleBoard.prototype.setMovePointsWithinTileZone = function(boardPointStart, zoneOwner, tileBeingMoved, movementInfo) {
	if (movementInfo.targetTileCodes && movementInfo.targetTileCodes.length > 0) {
		var self = this;
		var pointsOfZoneTiles = this.getPointsForTileCodes(movementInfo.targetTileCodes, zoneOwner);
		this.forEachBoardPoint(function(targetPoint) {
			var startAndEndPointAreInSameZone = self.oneOfTheseZonesContainsPoints(pointsOfZoneTiles, [boardPointStart, targetPoint]);
			if (startAndEndPointAreInSameZone
					&& self.tileCanMoveOntoPoint(tileBeingMoved, movementInfo, targetPoint, null)) {
				targetPoint.addType(POSSIBLE_MOVE);
			}
		});
	}
};

TrifleBoard.prototype.oneOfTheseZonesContainsPoints = function(pointsWithZones, targetPoints) {
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

TrifleBoard.prototype.pointTileZoneContainsPoint = function(pointWithZone, targetPoint) {
	return pointWithZone.hasTile() 
			&& pointWithZone.tile.activeZone 
			&& !pointWithZone.tile.activeZone.canceled 
			&& this.getDistanceBetweenPoints(pointWithZone, targetPoint) <= pointWithZone.tile.activeZone.size;
};

TrifleBoard.prototype.pointIsWithinZoneOfOneOfTheseTiles = function(targetPoint, tileCodes, zoneOwner) {
	var isInTheZone = false;
	if (tileCodes && tileCodes.length > 0) {
		var self = this;
		tileCodes.forEach(function(tileCode) {
			if (self.pointIsInTileZone(targetPoint, tileCode, zoneOwner)) {
				isInTheZone = true;
				return;
			}
		});
	}
	return isInTheZone;
};

TrifleBoard.prototype.forEachBoardPoint = function(forEachFunc) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				forEachFunc(boardPoint);
			}
		});
	});
};
TrifleBoard.prototype.forEachBoardPointDoMany = function(forEachFuncList) {
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
TrifleBoard.prototype.forEachBoardPointWithTile = function(forEachFunc) {
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			forEachFunc(boardPoint);
		}
	});
};

TrifleBoard.prototype.setGuestGateOpen = function() {
	var row = 16;
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

// TrifleBoard.prototype.getCopy = function() {
// 	var copyBoard = new Board();

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







