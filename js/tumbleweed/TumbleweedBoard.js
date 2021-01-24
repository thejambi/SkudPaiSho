
var TumbleweedDirections = {
	UP_RIGHT: 1,
	DOWN_RIGHT: 2,
	DOWN: 3,
	UP: 4,
	UP_LEFT: 5,
	DOWN_LEFT: 6
}

function TumbleweedBoard() {
	this.edgeLength = 8;
	if (gameOptionEnabled(HEXHEX_11)) {
		this.edgeLength = 11;
	} else if (gameOptionEnabled(HEXHEX_6)) {
		this.edgeLength = 6;
	}

	this.cells = this.brandNew();
}

TumbleweedBoard.prototype.brandNew = function() {
	TumbleweedBoardPoint.notationPointStringMap = {};
	var cells = [];

	var numRows = this.edgeLength * 2 - 1;

	for (var rowIndex = 0; rowIndex < numRows; rowIndex++) {
		var row = rowIndex;
		
		var numPoints = this.edgeLength + row;
		if (row >= this.edgeLength) {
			numPoints = numRows - row - 1 + this.edgeLength;
		}

		var numBlanks = (numRows - numPoints) / 2;
		if (row % 2 === 1) {
			numBlanks = (numRows - 1 - numPoints) / 2;
		}

		cells[rowIndex] = this.newRow(numBlanks, numPoints);
	}

	for (var row = 0; row < cells.length; row++) {
		var mysteriousValue = Math.floor(this.edgeLength / 2);
		var firstCol = (this.edgeLength - mysteriousValue) - Math.floor(row / 2);

		for (var col = 0; col < cells[row].length; col++) {
			var bp = cells[row][col];
			bp.row = row;
			bp.col = col;

			bp.setNotationRow(numRows - row);
			bp.setNotationCol(firstCol + col);

			TumbleweedBoardPoint.notationPointStringMap[bp.getNotationPointString()] = {
				row: row,
				col: col
			};
		}
	}

	return cells;
};

TumbleweedBoard.prototype.newRow = function(numBlanks, numPoints) {
	var columns = [];
	var index = 0;

	var nonPoint = new TumbleweedBoardPoint();
	nonPoint.addType(TumbleweedBoardPoint.Types.nonPlayable);

	for (var counter = 0; counter < numBlanks; counter++) {
		columns[index] = nonPoint;
		index++;
	}

	for (counter = 0; counter < numPoints; counter++) {
		columns[index] = new TumbleweedBoardPoint();
		columns[index].addType(TumbleweedBoardPoint.Types.normal);
		index++;
	}

	return columns;
};

// TumbleweedBoard.prototype.placeTile = function(tile, notationPointString) {
// 	this.putTileOnPoint(tile, notationPointString);
// };

// TumbleweedBoard.prototype.putTileOnPoint = function(tile, notationPointString) {
// 	var rowAndCol = TumbleweedBoardPoint.notationPointStringMap[notationPointString];

// 	point = this.cells[rowAndCol.row][rowAndCol.col];
	
// 	point.putTile(tile);
// };

TumbleweedBoard.prototype.getBoardPointFromNotationPoint = function(notationPointString) {
	var rowAndCol = TumbleweedBoardPoint.notationPointStringMap[notationPointString];
	return this.cells[rowAndCol.row][rowAndCol.col];
};

TumbleweedBoard.prototype.getAdjacentPoints = function(bp) {

	var row = bp.notationRowNum;
	var col = bp.notationColNum;

	var notationPoints = [];

	var nextPoint = new TumbleweedBoardPoint();
	nextPoint.setNotationRow(row + 1)
	nextPoint.setNotationCol(col);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new TumbleweedBoardPoint();
	nextPoint.setNotationRow(row + 1);
	nextPoint.setNotationCol(col + 1);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new TumbleweedBoardPoint();
	nextPoint.setNotationRow(row);
	nextPoint.setNotationCol(col - 1);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new TumbleweedBoardPoint();
	nextPoint.setNotationRow(row);
	nextPoint.setNotationCol(col + 1);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new TumbleweedBoardPoint();
	nextPoint.setNotationRow(row - 1);
	nextPoint.setNotationCol(col - 1);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new TumbleweedBoardPoint();
	nextPoint.setNotationRow(row - 1);
	nextPoint.setNotationCol(col);
	notationPoints.push(nextPoint.getNotationPointString());

	var points = [];

	for (var i = 0; i < notationPoints.length; i++) {
		var rowAndCol = TumbleweedBoardPoint.notationPointStringMap[notationPoints[i]];
		if (rowAndCol && this.rowAndColIsValid(rowAndCol)) {
			points.push(this.cells[rowAndCol.row][rowAndCol.col]);
		}
	}

	return points;
};

TumbleweedBoard.prototype.rowAndColIsValid = function(rowAndCol) {
	return rowAndCol.row < this.cells.length
			&& rowAndCol.row >= 0
			&& rowAndCol.col < this.cells[rowAndCol.row].length
			&& rowAndCol.col >= 0;
}

TumbleweedBoard.prototype.hasEmptyAdjacentPoint = function(bp) {
	var adjacentPoints = this.getAdjacentPoints(bp);

	for (var i = 0; i < adjacentPoints.length; i++) {
		var nextPoint = adjacentPoints[i];
		if (nextPoint.types.includes(TumbleweedBoardPoint.Types.normal) && !nextPoint.hasSettlement()) {
			return true;
		}
	}
	return false;
};

TumbleweedBoard.prototype.getRandomOpenPoint = function() {
	var openPoints = [];
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.types.includes(TumbleweedBoardPoint.Types.normal) && !bp.hasSettlement()) {
				openPoints.push(bp);
			}
		}
	}
	var randomIndex = Math.floor(Math.random() * openPoints.length);
	return openPoints[randomIndex];
};

TumbleweedBoard.prototype.forEachBoardPoint = function(forEachFunc) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (boardPoint.isType(TumbleweedBoardPoint.Types.normal)) {
				forEachFunc(boardPoint);
			}
		});
	});
};

TumbleweedBoard.prototype.getAdjacentNotationPoints = function(bp, direction) {
	var row = bp.notationRowNum;
	var col = bp.notationColNum;

	var notationPoints = [];

	var nextPoint = new TumbleweedBoardPoint();

	if (direction === TumbleweedDirections.UP_RIGHT || !direction) {
		nextPoint.setNotationRow(row + 1)
		nextPoint.setNotationCol(col);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === TumbleweedDirections.DOWN_RIGHT || !direction) {
		nextPoint = new TumbleweedBoardPoint();
		nextPoint.setNotationRow(row + 1);
		nextPoint.setNotationCol(col + 1);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === TumbleweedDirections.DOWN || !direction) {
		nextPoint = new TumbleweedBoardPoint();
		nextPoint.setNotationRow(row);
		nextPoint.setNotationCol(col + 1);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === TumbleweedDirections.UP || !direction) {
		nextPoint = new TumbleweedBoardPoint();
		nextPoint.setNotationRow(row);
		nextPoint.setNotationCol(col - 1);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === TumbleweedDirections.UP_LEFT || !direction) {
		nextPoint = new TumbleweedBoardPoint();
		nextPoint.setNotationRow(row - 1);
		nextPoint.setNotationCol(col - 1);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === TumbleweedDirections.DOWN_LEFT || !direction) {
		nextPoint = new TumbleweedBoardPoint();
		nextPoint.setNotationRow(row - 1);
		nextPoint.setNotationCol(col);
		notationPoints.push(nextPoint.getNotationPointString());
	}

	return notationPoints;
};

TumbleweedBoard.prototype.getAdjacentPoints = function(bp, direction) {
	var notationPoints = this.getAdjacentNotationPoints(bp, direction);

	var points = [];

	for (var i = 0; i < notationPoints.length; i++) {
		var rowAndCol = TumbleweedBoardPoint.notationPointStringMap[notationPoints[i]];
		if (rowAndCol && this.rowAndColIsValid(rowAndCol)) {
			points.push(this.cells[rowAndCol.row][rowAndCol.col]);
		}
	}

	return points;
};

TumbleweedBoard.prototype.pointIsSeenInDirection = function(boardPoint, player, direction) {
	if (boardPoint && player && direction) {
		var adjacents = this.getAdjacentPoints(boardPoint, direction);
		for (var i = 0; i < adjacents.length; i++) {
			var adjacentPoint = adjacents[i];
			if (adjacentPoint.types.includes(TumbleweedBoardPoint.Types.normal)) {
				if (adjacentPoint.getSettlementOwner() === player) {
					return true;
				} else if (!adjacentPoint.hasSettlement()) {
					return this.pointIsSeenInDirection(adjacentPoint, player, direction);
				} else {
					return false;
				}
			}
		}
	}
};

TumbleweedBoard.prototype.getSightCount = function(boardPoint, player) {
	var sightCount = 0;
	for (var direction = 1; direction <= 6; direction++) {
		if (this.pointIsSeenInDirection(boardPoint, player, direction)) {
			sightCount++;
		}
	}
	return sightCount;
};

TumbleweedBoard.prototype.pointIsSeen = function(boardPoint, player) {
	for (var direction = 1; direction <= 6; direction++) {
		if (this.pointIsSeenInDirection(boardPoint, player, direction)) {
			return true;
		}
	}
};

TumbleweedBoard.prototype.setInitialPlacementPossibleMoves = function() {
	var self = this;
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.getSettlementValue() === 0) {
			boardPoint.addType(POSSIBLE_MOVE);
		}
	});
};

TumbleweedBoard.prototype.setSettlePointsPossibleMoves = function(player) {
	var self = this;
	this.forEachBoardPoint(function(boardPoint) {
		var sightCount = self.getSightCount(boardPoint, player);
		var sightCountRequiredToSettle = boardPoint.getSettlementValue() + 1;
		if (gameOptionEnabled(RUMBLEWEED)) {
			sightCountRequiredToSettle--;
		}
		if (gameOptionEnabled(TUMPLETORE)) {
			sightCountRequiredToSettle = self.getSightCount(boardPoint, getOpponentName(player)) + 1;
		}
		if (
			sightCount >= sightCountRequiredToSettle
		) {
			if (
				(!gameOptionEnabled(NO_REINFORCEMENT) && !gameOptionEnabled(TUMPLETORE))
				|| (!boardPoint.hasSettlement() || boardPoint.getSettlementOwner() !== player)
			) {
				boardPoint.addType(POSSIBLE_MOVE);
			}
		}
	});
};

TumbleweedBoard.prototype.createNeutralSettlement = function(notationPointString, value) {
	this.placeSettlement("NEUTRAL", notationPointString, value);
};

TumbleweedBoard.prototype.placeSettlement = function(player, notationPointString, specificValue) {
	var boardPoint = this.getBoardPointFromNotationPoint(notationPointString);

	var settlementValue = specificValue ? specificValue : 0;
	if (settlementValue === 0) {
		var playerToCheckSightCount = player;
		if (gameOptionEnabled(CRUMBLEWEED)) {
			playerToCheckSightCount = getOpponentName(player);
		}
		settlementValue = this.getSightCount(boardPoint, playerToCheckSightCount);
		if (gameOptionEnabled(RUMBLEWEED)) {
			settlementValue++;
		}
	}
	boardPoint.setSettlement(player, settlementValue);
};

TumbleweedBoard.prototype.removePossibleMovePoints = function() {
	this.forEachBoardPoint(function(boardPoint) {
		boardPoint.removeType(POSSIBLE_MOVE);
	});
};

TumbleweedBoard.prototype.doInitialSwap = function() {
	var hostPoint;
	var guestPoint;
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.getSettlementOwner() === HOST) {
			hostPoint = boardPoint;
		} else if (boardPoint.getSettlementOwner() === GUEST) {
			guestPoint = boardPoint;
		}
	});

	hostPoint.setSettlement(GUEST, 1);
	guestPoint.setSettlement(HOST, 1);
};

TumbleweedBoard.prototype.countSettlements = function(player) {
	var settlementCount = 0;
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.getSettlementOwner() === player) {
			settlementCount++;
		}
	});
	return settlementCount;
};

TumbleweedBoard.prototype.countTotalControlledSpaces = function(player) {
	var controlledSpacesCount = 0;
	var opponent = getOpponentName(player);
	var self = this;
	this.forEachBoardPoint(function(boardPoint) {
		if (!boardPoint.hasSettlement()) {
			var playerSights = self.getSightCount(boardPoint, player);
			var opponentSights = self.getSightCount(boardPoint, opponent);
			if (playerSights > opponentSights) {
				controlledSpacesCount++;
			}
		}
	});
	return controlledSpacesCount;
};

TumbleweedBoard.prototype.getAllPossiblePoints = function() {
	var possiblePoints = [];
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			possiblePoints.push(boardPoint);
		}
	});
	return possiblePoints;
};

TumbleweedBoard.prototype.allSpacesSettled = function() {
	var allSettled = true;
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.isType(TumbleweedBoardPoint.Types.normal) && !boardPoint.hasSettlement()) {
			allSettled = false;
		}
	});
	return allSettled;
};

TumbleweedBoard.prototype.getPointWithStackOfSizeAtLeast = function(targetStackSize) {
	var targetStackBoardPoint;

	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.getSettlementValue() >= targetStackSize) {
			targetStackBoardPoint = boardPoint;
		}
	});

	return targetStackBoardPoint;
};


TumbleweedBoard.prototype.getCopy = function() {
	var copyBoard = new TumbleweedBoard();

	copyBoard.cells = copyArray(this.cells);

	return copyBoard;
};

