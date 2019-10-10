
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
		if (move.playerCode === "D") {
			var defendersPoints = [];
			var kingPoint = "";

			// Different codes for different board sizes.
			switch (move.boardSetupCode) {
				case "1":	// Default 4perSide
					kingPoint = this.board.thronePoint; //"d4";
					defendersPoints = this.board.getAdjacentNotationPointsFromNotationPoint(kingPoint,HexentaflDirections.UP);
					defendersPoints = defendersPoints.concat(this.board.getAdjacentNotationPointsFromNotationPoint(kingPoint,HexentaflDirections.DOWN_LEFT));
					defendersPoints = defendersPoints.concat(this.board.getAdjacentNotationPointsFromNotationPoint(kingPoint,HexentaflDirections.DOWN_RIGHT));
					break;
				case "2":	// Default 5perSide
					kingPoint = this.board.thronePoint;
					var defendersPoints = this.board.getAdjacentNotationPointsFromNotationPoint(kingPoint);
					break;
				default:
					debug("Unknown board setup code for " + HexentaflVars.DEFENDERS_PLAYER);
			}

			this.board.placeKing(kingPoint);

			var self = this;
			defendersPoints.forEach(
				function(pointName) {
					self.board.placeDefender(pointName);
				}
			);
		} else if (move.playerCode === "A") {
			var attackersPoints = [];

			switch (move.boardSetupCode) {
				case "1":	// Default 4perSide
					attackersPoints = this.board.cornerPoints;
					break;
				case "2":	// Default 5perSide
					attackersPoints = this.board.cornerPoints;
					break;
				default:
					debug("Unknown board setup code for " + HexentaflVars.ATTACKERS_PLAYER);
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
		return HexentaflVars.ATTACKERS_PLAYER;
	}
	if (this.board.kingOnCorner) {
		return HexentaflVars.DEFENDERS_PLAYER;
	}
};

/* Required by Main */
HexentaflGameManager.prototype.getWinReason = function() {
	if (this.getWinner() === HexentaflVars.DEFENDERS_PLAYER) {
		return " wins! They escorted the King to safety!";
	} else if (this.getWinner() === HexentaflVars.ATTACKERS_PLAYER) {
		return " wins! They stormed the castle and captured the King!";
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
