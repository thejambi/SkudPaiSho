/* Pai Sho Adevar Board */

function AdevarBoard() {
	this.size = new RowAndColumn(18, 18);
	this.cells = this.brandNewForSpaces();

	this.winners = [];

	this.basicTilePlotCounts = {};

	this.harmonyManager = new AdevarHarmonyManager();

	this.markOrientalLilyObjectivePoints();
}

AdevarBoard.prototype.brandNewForSpaces = function () {
	var cells = [];

	/* You'll want to maybe make new board point types to better correspond with Adevar. 
		Also, the types used here are not accurate (points created as neutral might be red, etc). 
		You'll also need to adjust for the non-playable areas of the board near the red corners. */

	cells[0] = this.newRow(6, 
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.wall(),
		AdevarBoardPoint.wall(),
		AdevarBoardPoint.wall(),
		AdevarBoardPoint.wall(),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT])
		]);

	cells[1] = this.newRow(10, 
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT])
		]);

	cells[2] = this.newRow(12, 
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT, AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT, AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT])
		]);

	cells[3] = this.newRow(14,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT, AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT, AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT])
		]);

	cells[4] = this.newRow(16,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT, AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT, AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
		AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT])
		]);

	cells[5] = this.newRow(16,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT, AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT, AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT])
		]);

	cells[6] = this.newRow(18,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT, AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT, AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT])
		]);

	cells[7] = this.newRow(18,
		[AdevarBoardPoint.wall(),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT, AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT, AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.wall()
		]);

	cells[8] = this.newRow(18,
		[AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT, AdevarBoardPointType.EAST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.EAST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.SOUTH_RED_PLOT, AdevarBoardPointType.SOUTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall()
		]);

	cells[9] = this.newRow(18,
		[AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT, AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT, AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall()
		]);

	cells[10] = this.newRow(18,
		[AdevarBoardPoint.wall(),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT, AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT, AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.wall()
		]);

	cells[11] = this.newRow(18,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT, AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT, AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT])
		]);

	cells[12] = this.newRow(16,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT, AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT, AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT])
		]);

	cells[13] = this.newRow(16,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT, AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT, AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT])
		]);

	cells[14] = this.newRow(14,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT, AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT, AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT])
		]);

	cells[15] = this.newRow(12,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_RED_PLOT, AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_WHITE_PLOT, AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT])
		]);

	cells[16] = this.newRow(10,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT]),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT])
		]);

	cells[17] = this.newRow(6,
		[AdevarBoardPoint.newPoint([AdevarBoardPointType.NORTH_NEUTRAL_PLOT]),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.wall(),
			AdevarBoardPoint.newPoint([AdevarBoardPointType.WEST_NEUTRAL_PLOT])
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

AdevarBoard.prototype.countTilesInPlots = function() {
	this.basicTilePlotCounts = {};
	this.basicTilePlotCounts[AdevarBoardPointType.NORTH_NEUTRAL_PLOT] = { HOST: 0, GUEST: 0 };
	this.basicTilePlotCounts[AdevarBoardPointType.SOUTH_NEUTRAL_PLOT] = { HOST: 0, GUEST: 0 };
	this.basicTilePlotCounts[AdevarBoardPointType.EAST_NEUTRAL_PLOT] = { HOST: 0, GUEST: 0 };
	this.basicTilePlotCounts[AdevarBoardPointType.WEST_NEUTRAL_PLOT] = { HOST: 0, GUEST: 0 };
	this.basicTilePlotCounts[AdevarBoardPointType.NORTH_RED_PLOT] = { HOST: 0, GUEST: 0 };
	this.basicTilePlotCounts[AdevarBoardPointType.SOUTH_RED_PLOT] = { HOST: 0, GUEST: 0 };
	this.basicTilePlotCounts[AdevarBoardPointType.EAST_WHITE_PLOT] = { HOST: 0, GUEST: 0 };
	this.basicTilePlotCounts[AdevarBoardPointType.WEST_WHITE_PLOT] = { HOST: 0, GUEST: 0 };

	var self = this;
	this.forEachBoardPointWithTile(function(boardPoint) {
		if (boardPoint.tile.type === AdevarTileType.basic) {
			boardPoint.plotTypes.forEach(function(pointType) {
				self.basicTilePlotCounts[pointType][boardPoint.tile.ownerName] += 1 / boardPoint.plotTypes.length;
			});
		}
	});
};

AdevarBoard.prototype.getPlotCountForPlayer = function(plotType, player) {
	if (this.basicTilePlotCounts[plotType]) {
		return this.basicTilePlotCounts[plotType][player];
	}
	return 0;
};

AdevarBoard.prototype.placeTile = function(tile, notationPoint) {
	return this.putTileOnPoint(tile, notationPoint);
};

AdevarBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	var capturedTile = point.removeTile();

	point.putTile(tile);

	var returnCapturedTileToHand = this.shouldReturnCapturedTileToHandAfterCapture(tile, capturedTile, true);

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

	var wrongSFTile = false;

	if (capturedTile) {
		var captureTriggerFlags = this.applyTileCapturedTriggers(tile, capturedTile, boardPointStart, boardPointEnd);
		if (captureTriggerFlags.wrongSFTile) {
			wrongSFTile = true;
		}
	}

	if (wrongSFTile) {
		boardPointEnd.putTile(capturedTile);
		capturedTile = null;
	}

	var returnCapturedTileToHand = this.shouldReturnCapturedTileToHandAfterCapture(tile, capturedTile);

	return {
		capturedTile: capturedTile,
		returnCapturedTileToHand: returnCapturedTileToHand,
		tileMoved: tile,
		tileInEndPoint: boardPointEnd.tile,
		wrongSFTileAttempt: wrongSFTile
	};
};

AdevarBoard.prototype.shouldReturnCapturedTileToHandAfterCapture = function(capturingTile, capturedTile, isDeploy) {
	if (capturedTile
		&& [
			AdevarTileType.secondFace,
			AdevarTileType.reflection,
			AdevarTileType.gate
		].includes(capturedTile.type)
	) {
		return true;
	}
	
	if (isDeploy && capturingTile && [AdevarTileType.secondFace, AdevarTileType.reflection].includes(capturingTile.type)) {
		return true;
	}

	return false;
};

AdevarBoard.prototype.applyTileCapturedTriggers = function(capturingTile, capturedTile, moveStartedPoint, moveEndedPoint) {
	var returnFlags = {};

	if (capturedTile && capturedTile.type === AdevarTileType.hiddenTile) {
		/* Handle if Hidden Tile cannot be captured */
		if (!capturingTile.canCapture(capturedTile)) {
			/* Alert Game Manager to... Remove capturing SF from the game. Regrow Vanguard tiles. */
			returnFlags.wrongSFTile = true;
		}
	}

	return returnFlags;
};

AdevarBoard.prototype.removeSFThatCannotCaptureHT = function(player, targetHiddenTile) {
	var removedInfo = {};
	this.forEachBoardPointWithTile(function(boardPoint) {
		if (boardPoint.tile.type === AdevarTileType.secondFace
				&& boardPoint.tile.ownerName === player
				&& !boardPoint.tile.canCapture(targetHiddenTile)) {
			removedInfo.pointRemovedFrom = boardPoint;
			removedInfo.tileRemoved = boardPoint.removeTile();
		}
	});
	return removedInfo;
};

AdevarBoard.prototype.regrowVanguards = function(player, vanguardTiles) {
	var vanguardNotationPoints = AdevarBoardSetupPoints.vanguard[player];

	var tilesReplaced = [];

	var self = this;
	var vanguardTileIndex = 0;
	vanguardNotationPoints.forEach(function(vanguardNotationPoint) {
		var vanguardPoint = self.getPointFromNotationPoint(vanguardNotationPoint);
		var vanguardTile = vanguardTiles[vanguardTileIndex];
		if (vanguardTile) {
			var needToReplace = false;
			if (vanguardPoint.hasTile() && vanguardPoint.tile.type !== AdevarTileType.vanguard) {
				tilesReplaced.push(vanguardPoint.removeTile());
				needToReplace = true;
			}
			if (!vanguardPoint.hasTile()) {
				needToReplace = true;
			}
			if (needToReplace) {
				vanguardPoint.putTile(vanguardTile);
				vanguardTileIndex++;
			}
		}
	});

	return tilesReplaced;
};

AdevarBoard.prototype.regrowVanguardsOldVersion = function(player, vanguardTiles) {
	var vanguardNotationPoints = AdevarBoardSetupPoints.vanguard[player];

	var self = this;
	var vanguardTileIndex = 0;
	var regrowPoints = [];
	vanguardNotationPoints.forEach(function(vanguardNotationPoint) {
		var vanguardPoint = self.getPointFromNotationPoint(vanguardNotationPoint);
		var vanguardClearToRegrow = !vanguardPoint.hasTile();
		if (!vanguardClearToRegrow) {
			if (vanguardPoint.tile.type !== AdevarTileType.vanguard) {
				debug("Moving tile to make way for the Vanguard!");
				/* Move tile away... */
				var pointToMoveTo = null;
				var leastDistanceFromCenter = 99;
				var preferredPoint = null;
				var center = new NotationPoint("5,-5").rowAndColumn;
				var vanguardPointRowAndCol = new RowAndColumn(vanguardPoint.row, vanguardPoint.col);
				if (vanguardPointRowAndCol.x < 0) {
					center = new NotationPoint("-4,4").rowAndColumn;
				}
				var adjacentPoints = self.getDirectlyAdjacentPoints(vanguardPoint);
				adjacentPoints.forEach(function(adjacentPoint) {
					if (!adjacentPoint.hasTile()) {
						var adjPointRowAndCol = new RowAndColumn(adjacentPoint.row, adjacentPoint.col);
						var distanceFromCenter = Math.abs(center.row - adjacentPoint.row) + Math.abs(center.col - adjacentPoint.col);
						if (distanceFromCenter < leastDistanceFromCenter) {
							leastDistanceFromCenter = distanceFromCenter;
							pointToMoveTo = adjacentPoint;
						}
						if (distanceFromCenter === 2 && center.x !== adjPointRowAndCol.x && center.y !== adjPointRowAndCol.y) {
							preferredPoint = adjacentPoint;
						}
					}
				});
				if (preferredPoint) {
					pointToMoveTo = preferredPoint;
				}
				if (pointToMoveTo) {
					pointToMoveTo.putTile(vanguardPoint.removeTile());
					vanguardClearToRegrow = true;
				}
			}
		}

		if (vanguardClearToRegrow) {
			var vanguardTile = vanguardTiles[vanguardTileIndex];
			vanguardTileIndex++;
			if (vanguardTile) {
				regrowPoints.push(vanguardPoint);
				vanguardPoint.putTile(vanguardTile);
			}
		} else {
			debug("Vanguard cannot regrow!");
		}
	});

	return regrowPoints;	// Tiles not regrown would need to be returned to captured tile pile...
};

AdevarBoard.prototype.getPointFromNotationPoint = function(notationPoint) {
	var rowAndCol = notationPoint.rowAndColumn;
	return this.cells[rowAndCol.row][rowAndCol.col];
};

AdevarBoard.prototype.revealTile = function(tileType, player) {
	this.forEachBoardPointWithTile(function(boardPoint) {
		if (boardPoint.tile.type === tileType && boardPoint.tile.ownerName === player) {
			boardPoint.tile.reveal();
		}
	});
};

AdevarBoard.prototype.analyzeHarmoniesForPlayer = function(player) {
	this.harmonyManager.clearList();

	var self = this;
	this.forEachBoardPointWithTile(function(boardPoint) {
		if (boardPoint.tile.type === AdevarTileType.basic) {
			// Check for harmonies!
			var tileHarmonies = self.getTileHarmonies(boardPoint);
			// Add harmonies
			self.harmonyManager.addHarmonies(tileHarmonies);

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
	});

	var harmonyRingOwners = this.harmonyManager.harmonyRingExists();
	return harmonyRingOwners.includes(player);
};

AdevarBoard.prototype.getTileHarmonies = function(boardPoint) {
	var tile = boardPoint.tile;
	var rowAndCol = boardPoint;
	var tileHarmonies = [];

	var leftHarmony = this.getHarmonyLeft(tile, rowAndCol);
	if (leftHarmony) {
		tileHarmonies.push(leftHarmony);
	}

	var rightHarmony = this.getHarmonyRight(tile, rowAndCol);
	if (rightHarmony) {
		tileHarmonies.push(rightHarmony);
	}
	
	var upHarmony = this.getHarmonyUp(tile, rowAndCol);
	if (upHarmony) {
		tileHarmonies.push(upHarmony);
	}

	var downHarmony = this.getHarmonyDown(tile, rowAndCol);
	if (downHarmony) {
		tileHarmonies.push(downHarmony);
	}

	return tileHarmonies;
};

AdevarBoard.prototype.getHarmonyLeft = function(tile, endRowCol) {
	var colToCheck = endRowCol.col - 1;

	while (colToCheck >= 0 && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(NON_PLAYABLE)) {
		colToCheck--;
	}

	if (colToCheck >= 0) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];

		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new AdevarHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

AdevarBoard.prototype.getHarmonyRight = function(tile, endRowCol) {
	var colToCheck = endRowCol.col + 1;

	while (colToCheck < this.size.col && !this.cells[endRowCol.row][colToCheck].hasTile()
			&& !this.cells[endRowCol.row][colToCheck].isType(NON_PLAYABLE)) {
		colToCheck++;
	}

	if (colToCheck < this.size.col) {
		var checkPoint = this.cells[endRowCol.row][colToCheck];

		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new AdevarHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(endRowCol.row, colToCheck));
			return harmony;
		}
	}
};

AdevarBoard.prototype.getHarmonyUp = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row - 1;

	while (rowToCheck >= 0 && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(NON_PLAYABLE)) {
		rowToCheck--;
	}

	if (rowToCheck >= 0) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];

		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new AdevarHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

AdevarBoard.prototype.getHarmonyDown = function(tile, endRowCol) {
	var rowToCheck = endRowCol.row + 1;

	while (rowToCheck < this.size.row && !this.cells[rowToCheck][endRowCol.col].hasTile()
			&& !this.cells[rowToCheck][endRowCol.col].isType(NON_PLAYABLE)) {
		rowToCheck++;
	}

	if (rowToCheck < this.size.row) {
		var checkPoint = this.cells[rowToCheck][endRowCol.col];

		if (tile.formsHarmonyWith(checkPoint.tile)) {
			var harmony = new AdevarHarmony(tile, endRowCol, checkPoint.tile, new RowAndColumn(rowToCheck, endRowCol.col));
			return harmony;
		}
	}
};

AdevarBoard.prototype.playerHasGateInOpponentNeutralPlot = function(player) {
	var hasGateInOpponentNeutralPlot = false;
	var targetPlot = player === HOST ? AdevarBoardPointType.NORTH_NEUTRAL_PLOT : AdevarBoardPointType.SOUTH_NEUTRAL_PLOT;
	this.forEachBoardPointWithTile(function(boardPoint) {
		if (boardPoint.tile.type === AdevarTileType.gate && boardPoint.tile.ownerName === player
				&& boardPoint.isType(targetPlot) && boardPoint.plotTypes.length === 1) {
			hasGateInOpponentNeutralPlot = true;
		}
	});
	return hasGateInOpponentNeutralPlot;
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

AdevarBoard.prototype.tileCanMoveOntoPoint = function(tile, movementInfo, targetPoint, fromPoint, originPoint) {
	var canCaptureTarget = this.targetPointHasTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
	var targetIsNotProtectedHiddenTile = !this.targetPointHasProtectedHiddenTile(targetPoint);
	return (!targetPoint.hasTile() || canCaptureTarget)
		&& this.tileCanLandOnPointWithoutBreakingPlotCountLimits(tile, targetPoint, originPoint)
		&& targetIsNotProtectedHiddenTile;
};

AdevarBoard.prototype.targetPointHasProtectedHiddenTile = function(targetPoint) {
	return targetPoint && targetPoint.tile 
		&& targetPoint.tile.type === AdevarTileType.hiddenTile
		&& this.pointIsAdjacentToVanguard(targetPoint);
};

AdevarBoard.prototype.pointIsAdjacentToVanguard = function(boardPoint) {
	var adjacentPoints = this.getDirectlyAdjacentPoints(boardPoint);
	var vanguardFound = false;
	adjacentPoints.forEach(function(adjacentPoint) {
		if (adjacentPoint.hasTile() && adjacentPoint.tile.type === AdevarTileType.vanguard) {
			vanguardFound = true;
		}
	});
	return vanguardFound;
};

AdevarBoard.prototype.targetPointHasTileThatCanBeCaptured = function(tile, movementInfo, fromPoint, targetPoint, isDeploy) {
	/* If Deploying a SF or Reflection tile... */
	if (isDeploy && AdevarTileType.reflection === tile.type) {
		return targetPoint.hasTile()
			&& (
				(targetPoint.tile.ownerName !== tile.ownerName
					&& targetPoint.tile.type === AdevarTileType.basic)
				|| this.tileCanCapture(tile, movementInfo, fromPoint, targetPoint)
			)
	} else if (isDeploy && AdevarTileType.secondFace === tile.type) {
		return targetPoint.hasTile()
			&& targetPoint.tile.ownerName !== tile.ownerName
			&& targetPoint.tile.type === AdevarTileType.basic;
	} else {
		/* If Moving, or Deploying any other kind of tile... */
		return targetPoint.hasTile() 
			&& this.tileCanCapture(tile, movementInfo, fromPoint, targetPoint);
	}
};

AdevarBoard.prototype.tileCanCapture = function(tile, movementInfo, fromPoint, targetPoint) {
	return tile.canCapture(targetPoint.tile)
		|| (tile.type === AdevarTileType.secondFace && targetPoint.tile.type === AdevarTileType.hiddenTile);	// Allow attempting to capture HT with any SFT
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
	if (tile.type === AdevarTileType.reflection) {
		this.setPossibleDeployPointsAroundTilesOfType(tile, AdevarTileType.gate, true);
	} else if (arrayIncludesOneOf(
		[tile.type],
		[
			AdevarTileType.basic,
			AdevarTileType.secondFace
		]
	)) {
		this.setPossibleDeployPointsAroundTilesOfType(tile, AdevarTileType.gate);
	} else if (tile.type === AdevarTileType.gate) {
		this.setPossibleDeployPointsAroundTilesOfType(tile, AdevarTileType.basic);
	}
};

AdevarBoard.prototype.setPossibleDeployPointsAroundTilesOfType = function(tile, tileType, onlyHomeGate) {
	var targetTilePoints = this.getTileTypePoints(tile.ownerName, tileType);

	var self = this;
	targetTilePoints.forEach(function(targetTilePoint) {
		if ((onlyHomeGate && targetTilePoint.tile.isHomeGate) || !onlyHomeGate) {
			self.getDirectlyAdjacentPoints(targetTilePoint).forEach(function(pointNextToTargtTile) {
				if ((!pointNextToTargtTile.hasTile()
					|| self.targetPointHasTileThatCanBeCaptured(tile, null, null, pointNextToTargtTile, true))
					&& self.tileCanLandOnPointWithoutBreakingPlotCountLimits(tile, pointNextToTargtTile)) {
					pointNextToTargtTile.addType(POSSIBLE_MOVE);
				}
			});
		}
	});
};

AdevarBoard.prototype.tileCanLandOnPointWithoutBreakingPlotCountLimits = function(tile, targetPoint, movedFromPoint) {
	if (tile.type !== AdevarTileType.basic) {
		return true;	// Plot limits only apply to Basic tiles
	}

	var targetPlots = targetPoint.plotTypes;

	var targetPlotsRoomNeeded = 1 / targetPlots.length;

	var self = this;

	var plotsHaveRoom = true;	// Assuming true, then validating below

	targetPlots.forEach(function(targetPlot) {
		var targetPlotCounts = self.basicTilePlotCounts[targetPlot];
		var plotCount = targetPlotCounts[tile.ownerName];
		// subtract from plot count if movedFromPoint shares plot type
		if (movedFromPoint && movedFromPoint.plotTypes.includes(targetPlot)) {
			plotCount -= 1 / movedFromPoint.plotTypes.length;
		}
		var plotLimit = 9999;	// Neutral Plot, no limit
		if (arrayIncludesOneOf(
				[targetPlot], 
				[AdevarBoardPointType.WEST_WHITE_PLOT, AdevarBoardPointType.EAST_WHITE_PLOT])) {
			plotLimit = 3;	// White Plot limit
		} else if (arrayIncludesOneOf(
				[targetPlot], 
				[AdevarBoardPointType.NORTH_RED_PLOT, AdevarBoardPointType.SOUTH_RED_PLOT])) {
			plotLimit = 2;	// Red Plot limit
		}
		plotsHaveRoom = plotsHaveRoom && plotLimit - plotCount >= targetPlotsRoomNeeded;
	});

	return plotsHaveRoom;
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
};

AdevarBoard.prototype.playerHasBasicTileInEveryPlot = function(player) {
	var hasEveryPlot = true;
	var self = this;
	Object.keys(this.basicTilePlotCounts).forEach(function(key,index) {
		var plotCount = self.basicTilePlotCounts[key][player];
		if (plotCount < 1) {
			hasEveryPlot = false;
		}
	});

	return hasEveryPlot;
};

AdevarBoard.prototype.playerHasFullRedAndWhitePlots = function(player) {
	return this.basicTilePlotCounts[AdevarBoardPointType.NORTH_RED_PLOT][player] === 2
		&& this.basicTilePlotCounts[AdevarBoardPointType.SOUTH_RED_PLOT][player] === 2
		&& this.basicTilePlotCounts[AdevarBoardPointType.EAST_WHITE_PLOT][player] === 3
		&& this.basicTilePlotCounts[AdevarBoardPointType.WEST_WHITE_PLOT][player] === 3
};

AdevarBoard.prototype.playerHasMoreBasicTilesInEachNonOwnedPlot = function(player) {
	var opponent = getOpponentName(player);
	return this.basicTilePlotCounts[AdevarBoardPointType.NORTH_RED_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.NORTH_RED_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.SOUTH_RED_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.SOUTH_RED_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.EAST_WHITE_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.EAST_WHITE_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.WEST_WHITE_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.WEST_WHITE_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.EAST_NEUTRAL_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.EAST_NEUTRAL_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.WEST_NEUTRAL_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.WEST_NEUTRAL_PLOT][opponent];
};

AdevarBoard.prototype.playerHasEqualOrMoreBasicTilesInEachNonOwnedPlot = function(player) {
	var opponent = getOpponentName(player);
	return this.basicTilePlotCounts[AdevarBoardPointType.NORTH_RED_PLOT][player] >= this.basicTilePlotCounts[AdevarBoardPointType.NORTH_RED_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.SOUTH_RED_PLOT][player] >= this.basicTilePlotCounts[AdevarBoardPointType.SOUTH_RED_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.EAST_WHITE_PLOT][player] >= this.basicTilePlotCounts[AdevarBoardPointType.EAST_WHITE_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.WEST_WHITE_PLOT][player] >= this.basicTilePlotCounts[AdevarBoardPointType.WEST_WHITE_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.EAST_NEUTRAL_PLOT][player] >= this.basicTilePlotCounts[AdevarBoardPointType.EAST_NEUTRAL_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.WEST_NEUTRAL_PLOT][player] >= this.basicTilePlotCounts[AdevarBoardPointType.WEST_NEUTRAL_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.NORTH_RED_PLOT][player] >= .5
		&& this.basicTilePlotCounts[AdevarBoardPointType.SOUTH_RED_PLOT][player] >= .5
		&& this.basicTilePlotCounts[AdevarBoardPointType.EAST_WHITE_PLOT][player] >= .5
		&& this.basicTilePlotCounts[AdevarBoardPointType.WEST_WHITE_PLOT][player] >= .5
		&& this.basicTilePlotCounts[AdevarBoardPointType.EAST_NEUTRAL_PLOT][player] >= .5
		&& this.basicTilePlotCounts[AdevarBoardPointType.WEST_NEUTRAL_PLOT][player] >= .5;
};

/*AdevarBoard.prototype.playerHasMoreBasicTilesInEachNonOwnedNonRedPlot = function(player) {
	var opponent = getOpponentName(player);
	return this.basicTilePlotCounts[AdevarBoardPointType.EAST_WHITE_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.EAST_WHITE_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.WEST_WHITE_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.WEST_WHITE_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.EAST_NEUTRAL_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.EAST_NEUTRAL_PLOT][opponent]
		&& this.basicTilePlotCounts[AdevarBoardPointType.WEST_NEUTRAL_PLOT][player] > this.basicTilePlotCounts[AdevarBoardPointType.WEST_NEUTRAL_PLOT][opponent];
};*/

AdevarBoard.prototype.playerHasTileOfTypeAtPoint = function(player, notationPoint, tileType) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.hasTile() 
		&& point.tile.ownerName === player 
		&& point.tile.type === tileType;
};

AdevarBoard.prototype.markOrientalLilyObjectivePoints = function() {
	var self = this;
	var gardenNumber = 1;
	AdevarOrientalLilyObjectivePoints.forEach(function(objectivePointsSet) {
		var objectivePoints = objectivePointsSet[HOST];

		objectivePoints.forEach(function(notationPoint) {
			var point = notationPoint.rowAndColumn;
			point = self.cells[point.row][point.col];
			point.highlight(gardenNumber);
		});

		var objectivePointsGuest = objectivePointsSet[GUEST];
		objectivePointsGuest.forEach(function(notationPoint) {
			var point = notationPoint.rowAndColumn;
			point = self.cells[point.row][point.col];
			point.highlight(gardenNumber + 3);
		});

		gardenNumber++;
	});
};

AdevarBoard.prototype.getPlayerSFTileThatIsNotThisOne = function(sfTile) {
	var otherSfTile = null;
	this.forEachBoardPointWithTile(function(boardPointWithTile) {
		if (boardPointWithTile.tile.type === AdevarTileType.secondFace
				&& boardPointWithTile.tile.ownerName === sfTile.ownerName
				&& boardPointWithTile.tile !== sfTile) {
			otherSfTile = boardPointWithTile.removeTile();
		}
	});
	return otherSfTile;
};

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
