
function HexentaflBoard() {
	this.edgeLength = 4;
	if (gameOptionEnabled(FIVE_SIDED_BOARD)) {
		this.edgeLength = 5;
	}

	this.cells = this.brandNew();

	this.markSpecialBoardPoints();
}

HexentaflBoard.prototype.markSpecialBoardPoints = function() {
	var thronePoint = null;
	var cornerPoints = [];
	if (this.edgeLength === 4) {
		thronePoint = "d4";
		cornerPoints.push("a1");
		cornerPoints.push("d1");
		cornerPoints.push("a4");
		cornerPoints.push("g4");
		cornerPoints.push("d7");
		cornerPoints.push("g7");
	} else if (this.edgeLength === 5) {
		// todo
	}

	if (thronePoint) {
		this.getBoardPointFromNotationPoint(thronePoint).addType(HexentaflBoardPoint.Types.throne);
	}
	for (var i = 0; i < cornerPoints.length; i++) {
		this.getBoardPointFromNotationPoint(cornerPoints[i]).addType(HexentaflBoardPoint.Types.corner);
	}
};

HexentaflBoard.prototype.brandNew = function() {
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

			HexentaflBoardPoint.notationPointStringMap[bp.getNotationPointString()] = {
				row: row,
				col: col
			};
		}
	}

	return cells;
};

HexentaflBoard.prototype.newRow = function(numBlanks, numPoints) {
	var columns = [];
	var index = 0;

	var nonPoint = new HexentaflBoardPoint();
	nonPoint.addType(HexentaflBoardPoint.Types.nonPlayable);

	for (var counter = 0; counter < numBlanks; counter++) {
		columns[index] = nonPoint;
		index++;
	}

	for (counter = 0; counter < numPoints; counter++) {
		columns[index] = new HexentaflBoardPoint();
		columns[index].addType(HexentaflBoardPoint.Types.normal);
		index++;
	}

	return columns;
};

HexentaflBoard.prototype.putTileOnPoint = function(tile, notationPointString) {
	point = this.getBoardPointFromNotationPoint(notationPointString);
	point.putTile(tile);
};

HexentaflBoard.prototype.getBoardPointFromNotationPoint = function(notationPointString) {
	var rowAndCol = HexentaflBoardPoint.notationPointStringMap[notationPointString];
	if (rowAndCol) {
		point = this.cells[rowAndCol.row][rowAndCol.col];
		return point;
    }
};

HexentaflBoard.prototype.moveTile = function(notationPointStart, notationPointEnd) {
	var startPoint = this.getBoardPointFromNotationPoint(notationPointStart);
	var endPoint = this.getBoardPointFromNotationPoint(notationPointEnd);

	if (startPoint.types.includes(HexentaflBoardPoint.Types.normal)
			&& endPoint.types.includes(HexentaflBoardPoint.Types.normal)
			&& startPoint.hasTile()) {
		var tile = startPoint.removeTile();
		endPoint.putTile(tile);
		this.captureOpponentPiecesSandwichedByMove(endPoint);

		if (tile === "K") {
			this.kingOnCorner = endPoint.types.includes(HexentaflBoardPoint.Types.corner);
		}
	}

	return tile;
};

HexentaflBoard.prototype.captureOpponentPiecesSandwichedByMove = function(moveEndPoint) {
	var movedPiece = moveEndPoint.tile;
	var adjacentPoints = this.getAdjacentPoints(moveEndPoint);
	for (var adjacentPointIndex = 0; adjacentPointIndex < adjacentPoints.length; adjacentPointIndex++) {
		var adjacentPoint = adjacentPoints[adjacentPointIndex];
		if (adjacentPoint.hasTile() && this.tilesAreEnemies(movedPiece, adjacentPoint.tile)) {
			/* Potential captured piece, check points opposite/surrounding that would mean capture */
			debug(moveEndPoint);
			debug(adjacentPoint);
			var otherPoints = this.getOtherPointsNeededForCapture(adjacentPoint, moveEndPoint);
			debug(otherPoints);
			var allOtherPointsOccupied = otherPoints.length > 0;
			for (var i = 0; i < otherPoints.length; i++) {
				var otherPoint = otherPoints[i];
				allOtherPointsOccupied = allOtherPointsOccupied
						&& otherPoint 
						&& otherPoint.hasTile() 
						&& !this.tilesAreEnemies(otherPoint.tile, movedPiece);
			}
			if (allOtherPointsOccupied) {
				var capturedTile = adjacentPoint.removeTile();
				if (capturedTile === "K") {
					this.kingCaptured = true;
				}
			}
		}
	}
};

HexentaflBoard.prototype.getOtherPointsNeededForCapture = function(pointBeingCaptured, capturingPoint1) {
	var otherPoints = [];

	var tx = pointBeingCaptured.notationRowNum;
	var ty = pointBeingCaptured.notationColNum;

	var cx = capturingPoint1.notationRowNum;
	var cy = capturingPoint1.notationColNum;

	var cpNps = capturingPoint1.getNotationPointString();

	if (pointBeingCaptured.types.includes(HexentaflBoardPoint.Types.corner)) {
		var targetAdjacents = this.getAdjacentPoints(pointBeingCaptured);
		var c1Adjacents = this.getAdjacentPoints(capturingPoint1);
		for (var i = 0; i < targetAdjacents.length; i++) {
			var targetAdjacentPoint = targetAdjacents[i];
			if (targetAdjacentPoint.types.includes(HexentaflBoardPoint.Types.normal)) {
				c1IsAdjacentOrEqual = false;
				for (var j = 0; j < c1Adjacents.length; j++) {
					c1AdjPoint = c1Adjacents[j];
					if (targetAdjacentPoint.getNotationPointString() === c1AdjPoint.getNotationPointString()
							|| targetAdjacentPoint.getNotationPointString() === cpNps) {
						c1IsAdjacentOrEqual = true;
					}
				}
				if (!c1IsAdjacentOrEqual) {
					otherPoints.push(targetAdjacentPoint);
				}
			}
		}
	} else if (!pointBeingCaptured.types.includes(HexentaflBoardPoint.Types.throne)) {
		var ox = tx + (tx - cx);
		var oy = ty + (ty - cy);

		if (ox > 0 && oy > 0) {
			var oPoint = new HexentaflBoardPoint();
			oPoint.setNotationRow(ox)
			oPoint.setNotationCol(oy);
			var oPointNotationString = oPoint.getNotationPointString();
			var oPointReal = this.getBoardPointFromNotationPoint(oPointNotationString);
			if (this.rowAndColIsValid(oPointReal)) {
				otherPoints.push(this.getBoardPointFromNotationPoint(oPointNotationString));
			}
		}
	} else if (pointBeingCaptured.types.includes(HexentaflBoardPoint.Types.throne)) {
		/* King on Throne captured by 3 non-adjacent Attackers */
		var b1 = this.getAdjacentPoints(pointBeingCaptured, 1)[0];
		var b2 = this.getAdjacentPoints(pointBeingCaptured, 2)[0];
		var b3 = this.getAdjacentPoints(pointBeingCaptured, 3)[0];
		var b4 = this.getAdjacentPoints(pointBeingCaptured, 4)[0];
		var b5 = this.getAdjacentPoints(pointBeingCaptured, 5)[0];
		var b6 = this.getAdjacentPoints(pointBeingCaptured, 6)[0];

		if (b1.getNotationPointString() === cpNps 
				|| b3.getNotationPointString() === cpNps 
				|| b5.getNotationPointString() === cpNps) {
			otherPoints.push(b1);
			otherPoints.push(b3);
			otherPoints.push(b5);
		} else if (b2.getNotationPointString() === cpNps 
				|| b4.getNotationPointString() === cpNps 
				|| b6.getNotationPointString() === cpNps) {
			otherPoints.push(b2);
			otherPoints.push(b4);
			otherPoints.push(b6);
		}
		otherPoints = otherPoints.filter(function(value, index, arr){
			return value.getNotationPointString() !== cpNps;
		});
	}
	return otherPoints;
};

HexentaflBoard.prototype.tilesAreEnemies = function(tile1, tile2) {
	if ((tile1 === "K" || tile2 === "K") && (tile1 === "D" || tile2 === "D")) {
		return false;
	}
	return tile1 !== tile2;
};

HexentaflBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
	if (!boardPointStart.hasTile()) {
		return;
	}
	if (boardPointStart.tile === "K") {
		// For King piece, only mark directly adjacent spaces
		this.markEmptyAdjacentPointsAsPlayableForKing(boardPointStart);
	} else if (boardPointStart.tile === "D" || boardPointStart.tile === "A") {
		// Start at start, and add all adjacent spaces unless edge of board or tile
		for (var direction = 1; direction <= 6; direction++) {
			this.markEmptyAdjacentPointsAsPlayableInDirection(boardPointStart, direction);
		}
	}
};

HexentaflBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

HexentaflBoard.prototype.markEmptyAdjacentPointsAsPlayableForKing = function(boardPointStart) {
	var adjacents = this.getAdjacentPoints(boardPointStart);
	for (var i = 0; i < adjacents.length; i++) {
		var adjacentPoint = adjacents[i];
		if (adjacentPoint.types.includes(HexentaflBoardPoint.Types.normal)
				&& !adjacentPoint.hasTile()
				&& !adjacentPoint.types.includes(POSSIBLE_MOVE)) {
			adjacentPoint.addType(POSSIBLE_MOVE);
		}
	}
};

HexentaflBoard.prototype.markEmptyAdjacentPointsAsPlayableInDirection = function(boardPointStart, direction) {
	var adjacents = this.getAdjacentPoints(boardPointStart, direction);
	for (var i = 0; i < adjacents.length; i++) {
		var adjacentPoint = adjacents[i];
		if (adjacentPoint.types.includes(HexentaflBoardPoint.Types.normal)
				&& !adjacentPoint.hasTile()
				&& !adjacentPoint.types.includes(POSSIBLE_MOVE)) {
			if (!adjacentPoint.types.includes(HexentaflBoardPoint.Types.throne)) {
				/* Pieces may pass through throne but not occupy it */
				adjacentPoint.addType(POSSIBLE_MOVE);
			}
			this.markEmptyAdjacentPointsAsPlayableInDirection(adjacentPoint, direction);
		}
	}
};

HexentaflBoard.prototype.getAdjacentPoints = function(bp, direction) {
	var row = bp.notationRowNum;
	var col = bp.notationColNum;

	var notationPoints = [];

	var nextPoint = new HexentaflBoardPoint();

	/* Direction numbers are important, 
	 * used for capturing King on Throne (1,3,5 and 2,4,6).
	 */
	if (direction === 1 || !direction) {
		nextPoint.setNotationRow(row + 1)
		nextPoint.setNotationCol(col);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === 2 || !direction) {
		nextPoint = new HexentaflBoardPoint();
		nextPoint.setNotationRow(row + 1);
		nextPoint.setNotationCol(col + 1);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === 3 || !direction) {
		nextPoint = new HexentaflBoardPoint();
		nextPoint.setNotationRow(row);
		nextPoint.setNotationCol(col + 1);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === 4 || !direction) {
		nextPoint = new HexentaflBoardPoint();
		nextPoint.setNotationRow(row);
		nextPoint.setNotationCol(col - 1);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === 5 || !direction) {
		nextPoint = new HexentaflBoardPoint();
		nextPoint.setNotationRow(row - 1);
		nextPoint.setNotationCol(col - 1);
		notationPoints.push(nextPoint.getNotationPointString());
	}
	if (direction === 6 || !direction) {
		nextPoint = new HexentaflBoardPoint();
		nextPoint.setNotationRow(row - 1);
		nextPoint.setNotationCol(col);
		notationPoints.push(nextPoint.getNotationPointString());
	}

	var points = [];

	for (var i = 0; i < notationPoints.length; i++) {
		var rowAndCol = HexentaflBoardPoint.notationPointStringMap[notationPoints[i]];
		if (rowAndCol && this.rowAndColIsValid(rowAndCol)) {
			points.push(this.cells[rowAndCol.row][rowAndCol.col]);
		}
	}

	return points;
};

HexentaflBoard.prototype.rowAndColIsValid = function(rowAndCol) {
	return rowAndCol
			&& rowAndCol.row < this.cells.length
			&& rowAndCol.row >= 0
			&& rowAndCol.col < this.cells[rowAndCol.row].length
			&& rowAndCol.col >= 0;
};

HexentaflBoard.prototype.hasEmptyAdjacentPoint = function(bp) {
	var adjacentPoints = this.getAdjacentPoints(bp);

	for (var i = 0; i < adjacentPoints.length; i++) {
		var nextPoint = adjacentPoints[i];
		if (nextPoint.types.includes(HexentaflBoardPoint.Types.normal) && !nextPoint.hasTile()) {
			return true;
		}
	}
	return false;
};

HexentaflBoard.prototype.placeKing = function(notationPointString) {
	this.putTileOnPoint("K", notationPointString);
};

HexentaflBoard.prototype.placeDefender = function(notationPointString) {
	this.putTileOnPoint("D", notationPointString);
};

HexentaflBoard.prototype.placeAttacker = function(notationPointString) {
	this.putTileOnPoint("A", notationPointString);
};
