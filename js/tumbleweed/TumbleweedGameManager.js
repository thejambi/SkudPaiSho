
function TumbleweedGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;
	this.actuator = actuator;

	this.hostScore = 0;
	this.guestScore = 0;
	
	this.setup(ignoreActuate);
}

TumbleweedGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new TumbleweedBoard();

	this.board.createNeutralSettlement("h8", 2);

	// game option 11?...

	if (!ignoreActuate) {
		this.actuate();
	}
};

TumbleweedGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board);
};

/* Required by Main */
TumbleweedGameManager.prototype.runNotationMove = function(move, withActuate, isHalfMove) {
	debug("Running Move: " + move.fullMoveText);

	if (move.swap) {
		// 
	} else if (move.passTurn) {
		// 
	} else if (move.initialPlacementForPlayer) {
		this.board.placeSettlement(move.initialPlacementForPlayer, move.deployPoint, 1);
	} else if (move.deployPoint) {
		this.board.placeSettlement(move.player, move.deployPoint);
	}

	if (withActuate) {
		this.actuate();
	}
};

TumbleweedGameManager.prototype.revealPossibleInitialPlacementPoints = function(ignoreActuate) {
	this.board.setInitialPlacementPossibleMoves();

	if (!ignoreActuate) {
		this.actuate();
	}
};

TumbleweedGameManager.prototype.revealPossibleSettlePoints = function(player, ignoreActuate) {
	this.board.setSettlePointsPossibleMoves(player);

	if (!ignoreActuate) {
		this.actuate();
	}
};

TumbleweedGameManager.prototype.hidePossibleSettlePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

TumbleweedGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

/* Required by Main */
TumbleweedGameManager.prototype.getWinner = function() {
	if (this.hostScore >= this.board.scoreNeededToWin) {
		return HOST;
	} else if (this.guestScore >= this.board.scoreNeededToWin) {
		return GUEST;
	}
};

/* Required by Main */
TumbleweedGameManager.prototype.getWinReason = function() {
	var winnerScore = this.hostScore > this.guestScore ? this.hostScore : this.guestScore;
	return " won the game with a score of " + winnerScore;
};

TumbleweedGameManager.prototype.getWinResultTypeCode = function() {
	if (this.getWinner()) {
		return 1;
	}
};

TumbleweedGameManager.prototype.getCopy = function() {
	var copyGame = new TumbleweedGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	return copyGame;
};

TumbleweedGameManager.prototype.pointIsOpen = function(npText) {
	var rowAndCol = TumbleweedBoardPoint.notationPointStringMap[npText];
	return rowAndCol 
		&& !this.board.cells[rowAndCol.row][rowAndCol.col].hasSettlement()
		&& this.board.cells[rowAndCol.row][rowAndCol.col].types.includes(TumbleweedBoardPoint.Types.normal);
};
