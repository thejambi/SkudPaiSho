
function BloomsBoard() {
	this.edgeLength = 5;
	if (gameOptionEnabled(FOUR_SIDED_BOARD)) {
		this.edgeLength = 4;
	} else if (gameOptionEnabled(SIX_SIDED_BOARD)) {
		this.edgeLength = 6;
	} else if (gameOptionEnabled(EIGHT_SIDED_BOARD)) {
		this.edgeLength = 8;
	}

	this.scoreTracks = [];

	this.blooms = [];

	this.cells = this.brandNew();
}

BloomsBoard.prototype.brandNew = function() {
	var cells = [];

	var numRows = this.edgeLength * 2 - 1;

	if (!gameOptionEnabled(SHORTER_GAME)) {
		// Add all score track row at top
		var numPoints = this.edgeLength + 1;
		numBlanks = (numRows - 1 - numPoints) / 2 + 1;
		cells[-1] = this.newRow(numBlanks, false, numPoints, true);
	}

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
		/**
		 * Treat score track point as a blank, always have at least 
		 * one blank so there's room for score track
		 */
		numBlanks++;

		cells[rowIndex] = this.newRow(numBlanks, true, numPoints);
	}

	if (!gameOptionEnabled(SHORTER_GAME)) {
		// Add single score tracks row at bottom
		var row = rowIndex;
		var numPoints = numRows - row - 1 + this.edgeLength;
		var numBlanks = (numRows - numPoints) / 2;
		if (row % 2 === 1) {
			numBlanks = (numRows - 1 - numPoints) / 2;
		}
		numBlanks++;
		cells[rowIndex] = this.newRow(numBlanks, true, numPoints, false, true);
	}

	for (var row = 0; row < cells.length; row++) {
		var mysteriousValue = Math.floor(this.edgeLength / 2) + 1;
		var firstCol = (this.edgeLength - mysteriousValue) - Math.floor(row / 2);
		
		var firstScoreTrackOfRow = true;

		for (var col = 0; col < cells[row].length; col++) {
			var bp = cells[row][col];
			bp.row = row;
			bp.col = col;

			bp.setNotationRow(numRows - row);
			bp.setNotationCol(firstCol + col);

			BloomsBoardPoint.notationPointStringMap[bp.getNotationPointString()] = {
				row: row,
				col: col
			};

			if (bp.types.includes(BloomsBoardPoint.Types.scoreTrack)) {
				var scoreTrackNum = 0;
				if (firstScoreTrackOfRow) {
					firstScoreTrackOfRow = false;
					if (gameOptionEnabled(SHORTER_GAME)) {
						scoreTrackNum = numRows - row - 1;
					} else {
						scoreTrackNum = numRows - row;
					}
				} else {
					if (gameOptionEnabled(SHORTER_GAME)) {
						scoreTrackNum = numRows + row;
					} else {
						scoreTrackNum = numRows + row + this.edgeLength + 2;
					}
				}

				this.scoreNeededToWin = scoreTrackNum;	// The last score track point checked is always the highest one

				bp.scoreTrackString = scoreTrackNum.toString();

				this.scoreTracks[bp.scoreTrackString] = bp;
			}
		}
	}

	var scoreTrackNum = numRows + 1;
	if (!gameOptionEnabled(SHORTER_GAME) && cells[-1]) {
		for (var col = 0; col < cells[-1].length; col++) {
			var bp = cells[-1][col];
			if (bp.types.includes(BloomsBoardPoint.Types.scoreTrack)) {
				bp.scoreTrackString = scoreTrackNum.toString();
				this.scoreTracks[bp.scoreTrackString] = bp;
				scoreTrackNum++;
			}
		}
	}

	return cells;
};

BloomsBoard.prototype.getScoreTrackPoint = function() {
	var scoreTrackPoint = new BloomsBoardPoint();
	scoreTrackPoint.addType(BloomsBoardPoint.Types.scoreTrack);
	return scoreTrackPoint;
};

BloomsBoard.prototype.newRow = function(numBlanks, hasScoreTrack, numPoints, isAllScoreTracks, onlySingleScoreTracks) {
	var columns = [];
	var index = 0;

	var nonPoint = new BloomsBoardPoint();
	nonPoint.addType(BloomsBoardPoint.Types.nonPlayable);

	if (hasScoreTrack) {
		numBlanks--;
	}

	for (var counter = 0; counter < numBlanks; counter++) {
		columns[index] = nonPoint;
		index++;
	}

	if (hasScoreTrack) {
		columns[index] = this.getScoreTrackPoint();
		index++;
	}

	for (counter = 0; counter < numPoints; counter++) {
		if (onlySingleScoreTracks) {
			columns[index] = nonPoint;
		} else if (isAllScoreTracks) {
			columns[index] = this.getScoreTrackPoint();
		} else {
			columns[index] = new BloomsBoardPoint();
			columns[index].addType(BloomsBoardPoint.Types.normal);
		}
		index++;
	}

	if (hasScoreTrack) {
		columns[index] = this.getScoreTrackPoint();
		index++;
	}

	return columns;
};

BloomsBoard.prototype.placeTile = function(tile, notationPointString) {
	this.putTileOnPoint(tile, notationPointString);

	/* Don't analyze board. GameManager will call that separately. */
};

BloomsBoard.prototype.putTileOnPoint = function(tile, notationPointString) {
	var rowAndCol = BloomsBoardPoint.notationPointStringMap[notationPointString];

	point = this.cells[rowAndCol.row][rowAndCol.col];
	
	point.putTile(tile);

	this.analyzeBlooms();
};

BloomsBoard.prototype.analyzeBlooms = function() {
	this.blooms = [];

	this.knownBloomPoints = [];

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile()) {
				if (!this.knownBloomPoints.includes(bp.getNotationPointString())) {

					var bloom = [];
					
					bloom.push(bp);
					bp.bloomId = this.blooms.length;
					
					this.knownBloomPoints.push(bp.getNotationPointString());

					this.collectAdjacentPointsInBloom(bp, bloom);

					this.blooms.push(bloom);
				}
			} else {
				bp.bloomId = null;
			}
		}
	}

	debug("# of Blooms: " + this.blooms.length);
};

BloomsBoard.prototype.collectAdjacentPointsInBloom = function(bp, bloom) {
	var adjacentPoints = this.getAdjacentPoints(bp);

	for (var i = 0; i < adjacentPoints.length; i++) {
		var nextPoint = adjacentPoints[i];

		if (!this.knownBloomPoints.includes(nextPoint.getNotationPointString()) 
				&& nextPoint.hasTile()
				&& nextPoint.tile === bp.tile) {
			bloom.push(nextPoint);
			nextPoint.bloomId = bp.bloomId;
			this.knownBloomPoints.push(nextPoint.getNotationPointString());
			this.collectAdjacentPointsInBloom(nextPoint, bloom);
		}
	}
};

BloomsBoard.prototype.getAdjacentPoints = function(bp) {

	var row = bp.notationRowNum;
	var col = bp.notationColNum;

	var notationPoints = [];

	var nextPoint = new BloomsBoardPoint();
	nextPoint.setNotationRow(row + 1)
	nextPoint.setNotationCol(col);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new BloomsBoardPoint();
	nextPoint.setNotationRow(row + 1);
	nextPoint.setNotationCol(col + 1);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new BloomsBoardPoint();
	nextPoint.setNotationRow(row);
	nextPoint.setNotationCol(col - 1);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new BloomsBoardPoint();
	nextPoint.setNotationRow(row);
	nextPoint.setNotationCol(col + 1);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new BloomsBoardPoint();
	nextPoint.setNotationRow(row - 1);
	nextPoint.setNotationCol(col - 1);
	notationPoints.push(nextPoint.getNotationPointString());

	nextPoint = new BloomsBoardPoint();
	nextPoint.setNotationRow(row - 1);
	nextPoint.setNotationCol(col);
	notationPoints.push(nextPoint.getNotationPointString());

	var points = [];

	for (var i = 0; i < notationPoints.length; i++) {
		var rowAndCol = BloomsBoardPoint.notationPointStringMap[notationPoints[i]];
		if (rowAndCol && this.rowAndColIsValid(rowAndCol)) {
			points.push(this.cells[rowAndCol.row][rowAndCol.col]);
		}
	}

	return points;
};

BloomsBoard.prototype.rowAndColIsValid = function(rowAndCol) {
	return rowAndCol.row < this.cells.length
			&& rowAndCol.row >= 0
			&& rowAndCol.col < this.cells[rowAndCol.row].length
			&& rowAndCol.col >= 0;
}

BloomsBoard.prototype.hasEmptyAdjacentPoint = function(bp) {
	var adjacentPoints = this.getAdjacentPoints(bp);

	for (var i = 0; i < adjacentPoints.length; i++) {
		var nextPoint = adjacentPoints[i];
		if (nextPoint.types.includes(BloomsBoardPoint.Types.normal) && !nextPoint.hasTile()) {
			return true;
		}
	}
	return false;
};

BloomsBoard.prototype.captureFencedBloomsBelongingToPlayer = function(player) {
	var fencedBloomIds = [];

	for (var bloomIndex = 0; bloomIndex < this.blooms.length; bloomIndex++) {
		var bloom = this.blooms[bloomIndex];

		if (bloom[0].tile.startsWith(getPlayerCodeFromName(player))) {
			var bloomId = bloom[0].bloomId;

			var hasEmptyAdjacentPoint = false;

			for (var bloomPointIndex = 0; bloomPointIndex < bloom.length; bloomPointIndex++) {
				var bp = bloom[bloomPointIndex];

				if (this.hasEmptyAdjacentPoint(bp)) {
					hasEmptyAdjacentPoint = true;
					break;
				}
			}

			if (!hasEmptyAdjacentPoint) {
				fencedBloomIds.push(bloomId);
				debug("Fenced Bloom found belonging to player: " + player);
			}
		}
	}

	var numCapturedTiles = 0;

	for (var bloomIndex = 0; bloomIndex < fencedBloomIds.length; bloomIndex++) {
		var bloom = this.blooms[fencedBloomIds[bloomIndex]];

		for (var piontIndex = 0; piontIndex < bloom.length; piontIndex++) {
			var bp = bloom[piontIndex];
			bp.tile = null;
			numCapturedTiles++;
		}
	}

	debug("Captured " + numCapturedTiles + " tiles!");
	return numCapturedTiles;
};

BloomsBoard.prototype.clearRevealedBloom = function() {
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			bp.showRevealEffect = false;
		}
	}
};

BloomsBoard.prototype.markBloomRevealed = function(bloomId) {
	var bloom = this.blooms[bloomId];

	if (bloom) {
		for (var i = 0; i < bloom.length; i++) {
			bloom[i].showRevealEffect = true;
		}
	}
};

BloomsBoard.prototype.getRandomOpenPoint = function() {
	var openPoints = [];
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.types.includes(BloomsBoardPoint.Types.normal) && !bp.hasTile()) {
				openPoints.push(bp);
			}
		}
	}
	var randomIndex = Math.floor(Math.random() * openPoints.length);
	return openPoints[randomIndex];
};
