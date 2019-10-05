
function HexentaflGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;
	this.actuator = actuator;

	this.hostScore = 0;
	this.guestScore = 0;
	
	this.setup(ignoreActuate);
}

HexentaflGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new HexentaflBoard();

	if (!ignoreActuate) {
		this.actuate();
	}
};

HexentaflGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board);
};

/* Required by Main */
HexentaflGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	if (move.moveType === INITIAL_SETUP) {
		/* Initial board setup */
		if (move.player === HOST) {
			var defendersPoints = [];
			var kingPoint = "";

			// TODO check board size? No, have different codes for different sizes.
			switch (move.boardSetupCode) {
				case "1":
					defendersPoints.push("d3");
					defendersPoints.push("e5");
					defendersPoints.push("c4");
					kingPoint = "d4";
					break;
				default:
					debug("Unknown board setup code for HOST.");
			}

			this.board.placeKing(kingPoint);

			var self = this;
			defendersPoints.forEach(
				function(pointName) {
					self.board.placeDefender(pointName);
				}
			);
		} else if (move.player === GUEST) {
			var attackersPoints = [];
			var defendersPoints = [];
			var kingPoint = "";

			switch (move.boardSetupCode) {
				case "1":
					attackersPoints.push("a1");
					attackersPoints.push("d1");
					attackersPoints.push("a4");
					attackersPoints.push("g4");
					attackersPoints.push("d7");
					attackersPoints.push("g7");
					break;
				default:
					debug("Unknown board setup code for GUEST.");
			}

			var self = this;
			attackersPoints.forEach(
				function(pointName) {
					self.board.placeAttacker(pointName);
				}
			);
		}
	} else {
		/* Normal move */
		this.board.moveTile(move.startPoint, move.endPoint);
	}

	if (withActuate) {
		this.actuate();
	}
};

HexentaflGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

HexentaflGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	if (!ignoreActuate) {
		this.actuate();
	}
};

HexentaflGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

/* Required by Main */
HexentaflGameManager.prototype.getWinner = function() {
	if (this.board.kingCaptured) {
		return GUEST;
	}
	if (this.board.kingOnCorner) {
		return HOST;
	}
};

/* Required by Main */
HexentaflGameManager.prototype.getWinReason = function() {
	if (this.getWinner() === HOST) {
		return " escorted the King to safety!";
	} else if (this.getWinner() === GUEST) {
		return " stormed the castle and captured the King!";
	}
};

HexentaflGameManager.prototype.getWinResultTypeCode = function() {
	if (this.getWinner()) {
		return 1;
	}
};

HexentaflGameManager.prototype.getCopy = function() {
	var copyGame = new HexentaflGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	return copyGame;
};

HexentaflGameManager.prototype.pointIsOpen = function(npText) {
	var rowAndCol = HexentaflBoardPoint.notationPointStringMap[npText];
	return rowAndCol 
		&& !this.board.cells[rowAndCol.row][rowAndCol.col].hasTile()
		&& this.board.cells[rowAndCol.row][rowAndCol.col].types.includes(HexentaflBoardPoint.Types.normal);
};
