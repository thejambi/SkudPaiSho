/* Pai Sho Playground Board */

function PlaygroundBoard() {
	this.size = new RowAndColumn(17, 17);

	if (gameOptionEnabled(FULL_GRID)) {
		if (gameOptionEnabled(PLAY_IN_SPACES)) {
			this.size = new RowAndColumn(18, 18);
			this.cells = this.brandNewForFullGridSpaces();
		} else {
			this.cells = this.brandNewForFullGrid();
		}
	} else if (gameOptionEnabled(PLAY_IN_SPACES)) {
		this.size = new RowAndColumn(18, 18);
		this.cells = this.brandNewForSpaces();
	} else {
		this.cells = this.brandNew();
	}

	this.harmonyManager = new PlaygroundHarmonyManager();

	this.rockRowAndCols = [];
	this.playedWhiteLotusTiles = [];
	this.winners = [];
}

PlaygroundBoard.prototype.brandNewForSpaces = function () {
	var cells = [];

	cells[0] = this.newRow(6, 
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.gate(),
		PlaygroundBoardPoint.gate(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[1] = this.newRow(10, 
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[2] = this.newRow(12, 
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[3] = this.newRow(14,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[4] = this.newRow(16,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[5] = this.newRow(16,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[6] = this.newRow(18,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[7] = this.newRow(18,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[8] = this.newRow(18,
		[PlaygroundBoardPoint.gate(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral()
		]);

	cells[9] = this.newRow(18,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[10] = this.newRow(18,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[11] = this.newRow(18,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[12] = this.newRow(16,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[13] = this.newRow(16,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[14] = this.newRow(14,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[15] = this.newRow(12,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[16] = this.newRow(10,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[17] = this.newRow(6,
		[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

PlaygroundBoard.prototype.brandNew = function () {
	var cells = [];

	cells[0] = this.newRow(9, 
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.gate(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[1] = this.newRow(11, 
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.redWhiteNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(), 
		PlaygroundBoardPoint.neutral()
		]);

	cells[2] = this.newRow(13, 
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.whiteNeutral(), 
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[3] = this.newRow(15,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.whiteNeutral(), 
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[4] = this.newRow(17,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.whiteNeutral(), 
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[5] = this.newRow(17,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.whiteNeutral(), 
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[6] = this.newRow(17,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.whiteNeutral(), 
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[7] = this.newRow(17,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.whiteNeutral(), 
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[8] = this.newRow(17,
		[PlaygroundBoardPoint.gate(),
		PlaygroundBoardPoint.redWhiteNeutral(), 
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.redWhiteNeutral(),
		PlaygroundBoardPoint.gate()
		]);

	cells[9] = this.newRow(17,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.redNeutral(), 
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.whiteNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[10] = this.newRow(17,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.redNeutral(), 
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.whiteNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[11] = this.newRow(17,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.redNeutral(), 
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.whiteNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[12] = this.newRow(17,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.redNeutral(), 
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.whiteNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[13] = this.newRow(15,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.redNeutral(), 
		PlaygroundBoardPoint.red(),
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.white(),
		PlaygroundBoardPoint.whiteNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[14] = this.newRow(13,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.redNeutral(), 
		PlaygroundBoardPoint.redWhite(),
		PlaygroundBoardPoint.whiteNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[15] = this.newRow(11,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.redWhiteNeutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	cells[16] = this.newRow(9,
		[PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.gate(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral(),
		PlaygroundBoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

PlaygroundBoard.prototype.brandNewForFullGrid = function () {
	var cells = [];

	for (var i = 0; i < 17; i++) {
		cells[i] = this.newRow(17,
			[PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.redNeutral(), 
			PlaygroundBoardPoint.red(),
			PlaygroundBoardPoint.red(),
			PlaygroundBoardPoint.redWhite(),
			PlaygroundBoardPoint.white(),
			PlaygroundBoardPoint.white(),
			PlaygroundBoardPoint.whiteNeutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral()
			]
		);
	}

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

PlaygroundBoard.prototype.brandNewForFullGridSpaces = function () {
	var cells = [];

	for (var i = 0; i < 18; i++) {
		cells[i] = this.newRow(18,
			[PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
				PlaygroundBoardPoint.neutral(),
			PlaygroundBoardPoint.neutral()
			]
		);
	}

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

PlaygroundBoard.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new PlaygroundBoardPoint();
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

PlaygroundBoard.prototype.placeTile = function(tile, notationPoint, extraBoatPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	var capturedTile = point.tile;

	this.putTileOnPoint(tile, notationPoint);

	return capturedTile;
};

PlaygroundBoard.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

PlaygroundBoard.prototype.isValidRowCol = function(rowCol) {
	return rowCol.row >= 0 && rowCol.col >= 0 && rowCol.row <= 16 && rowCol.col <= 16;
};

PlaygroundBoard.prototype.getClockwiseRowCol = function(center, rowCol) {
	if (rowCol.row < center.row && rowCol.col <= center.col) {
		return new RowAndColumn(rowCol.row, rowCol.col+1);
	} else if (rowCol.col > center.col && rowCol.row <= center.row) {
		return new RowAndColumn(rowCol.row+1, rowCol.col);
	} else if (rowCol.row > center.row && rowCol.col >= center.col) {
		return new RowAndColumn(rowCol.row, rowCol.col-1);
	} else if (rowCol.col < center.col && rowCol.row >= center.row) {
		return new RowAndColumn(rowCol.row-1, rowCol.col);
	} else {
		debug("ERROR CLOCKWISE CALCULATING");
	}
}

PlaygroundBoard.prototype.getSurroundingRowAndCols = function(rowAndCol) {
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

PlaygroundBoard.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate();
};

PlaygroundBoard.prototype.moveTile = function(notationPointStart, notationPointEnd) {
	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
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
};

PlaygroundBoard.prototype.removeTile = function(notationPoint) {
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.cells[rowCol.row][rowCol.col];
	return boardPoint.removeTile();
};

PlaygroundBoard.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	return true;
};

PlaygroundBoard.prototype.canMoveTileToPoint = function(player, boardPointStart, boardPointEnd) {
	return boardPointStart !== boardPointEnd;
};

PlaygroundBoard.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves) {
  // Recursion!
  return this.pathFound(boardPointStart, boardPointEnd, numMoves);
};

PlaygroundBoard.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves) {
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
  
  // Idea: Get min num moves necessary!
  var minMoves = Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col);
  
  if (minMoves === 1) {
    return true; // Yay! Only 1 space away (and remember, numMoves is more than 0)
  }

  // Check moving UP
  var nextRow = boardPointStart.row - 1;
  if (nextRow >= 0) {
    var nextPoint = this.cells[nextRow][boardPointStart.col];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1)) {
      return true; // Yay!
    }
  }

  // Check moving DOWN
  nextRow = boardPointStart.row + 1;
  if (nextRow < 17) {
    var nextPoint = this.cells[nextRow][boardPointStart.col];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1)) {
      return true; // Yay!
    }
  }

  // Check moving LEFT
  var nextCol = boardPointStart.col - 1;
  if (nextCol >= 0) {
    var nextPoint = this.cells[boardPointStart.row][nextCol];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1)) {
      return true; // Yay!
    }
  }

  // Check moving RIGHT
  nextCol = boardPointStart.col + 1;
  if (nextCol < 17) {
    var nextPoint = this.cells[boardPointStart.row][nextCol];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1)) {
      return true; // Yay!
    }
  }
};

PlaygroundBoard.prototype.setPossibleMovePoints = function(boardPointStart) {
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

PlaygroundBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

PlaygroundBoard.prototype.setOpenGatePossibleMoves = function(player) {
	// Apply "open gate" type to applicable boardPoints
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.isOpenGate()) {
				this.cells[row][col].addType(POSSIBLE_MOVE);
			}
		}
	}
};

PlaygroundBoard.prototype.setAllPointsAsPossible = function() {
	var self = this;
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.addType(POSSIBLE_MOVE);
		});
	});
}

PlaygroundBoard.prototype.getCopy = function() {
	var copyBoard = new PlaygroundBoard();

	// cells
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			copyBoard.cells[row][col] = this.cells[row][col].getCopy();
		}
	}

	return copyBoard;
};


