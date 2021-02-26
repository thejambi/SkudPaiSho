
function MeadowGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;
	this.actuator = actuator;

	this.hostScore = 0;
	this.guestScore = 0;
	
	this.setup(ignoreActuate);
}

MeadowGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new MeadowBoard();

	if (!ignoreActuate) {
		this.actuate();
	}
};

MeadowGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board);
};

/* Required by Main */
MeadowGameManager.prototype.runNotationMove = function(move, withActuate, isHalfMove) {
	debug("Running Move: " + move.fullMoveText);

	if (move.piece1 && move.deployPoint1) {
		this.board.placeTile(move.piece1, move.deployPoint1);
	}
	if (move.piece2 && move.deployPoint2) {
		this.board.placeTile(move.piece2, move.deployPoint2);
	}

	var numCapturedPieces = 0;
	if (!isHalfMove) {
		numCapturedPieces = this.board.captureSmotheredGroupsBelongingToPlayer(getOpponentName(move.player));
		numCapturedPieces += this.board.captureOvergrownGroupsBelongingToPlayer(getOpponentName(move.player));
	}

	if (numCapturedPieces > 0) {
		if (move.player === HOST) {
			this.hostScore += numCapturedPieces;
		} else if (move.player === GUEST) {
			this.guestScore += numCapturedPieces;
		}
	}

	if (withActuate) {
		this.actuate();
	}
};

MeadowGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

/* Required by Main */
MeadowGameManager.prototype.getWinner = function() {
	if (this.hostScore >= this.board.scoreNeededToWin) {
		return HOST;
	} else if (this.guestScore >= this.board.scoreNeededToWin) {
		return GUEST;
	}
};

/* Required by Main */
MeadowGameManager.prototype.getWinReason = function() {
	var winnerScore = this.hostScore > this.guestScore ? this.hostScore : this.guestScore;
	return " won the game with a score of " + winnerScore;
};

MeadowGameManager.prototype.getWinResultTypeCode = function() {
	if (this.getWinner()) {
		return 1;
	}
};

MeadowGameManager.prototype.getCopy = function() {
	var copyGame = new MeadowGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	return copyGame;
};

MeadowGameManager.prototype.pointIsOpen = function(npText) {
	var rowAndCol = MeadowBoardPoint.notationPointStringMap[npText];
	return rowAndCol 
		&& !this.board.cells[rowAndCol.row][rowAndCol.col].hasTile()
		&& this.board.cells[rowAndCol.row][rowAndCol.col].types.includes(MeadowBoardPoint.Types.normal);
};
