
function BloomsGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;
	this.actuator = actuator;

	this.hostScore = 0;
	this.guestScore = 0;
	
	this.setup(ignoreActuate);
}

BloomsGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new BloomsBoard();

	if (!ignoreActuate) {
		this.actuate();
	}
};

BloomsGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board);
};

/* Required by Main */
BloomsGameManager.prototype.runNotationMove = function(move, withActuate, isHalfMove) {
	debug("Running Move: " + move.fullMoveText);

	if (move.piece1 && move.deployPoint1) {
		this.board.placeTile(move.piece1, move.deployPoint1);
	}
	if (move.piece2 && move.deployPoint2) {
		this.board.placeTile(move.piece2, move.deployPoint2);
	}

	var numCapturedPieces = 0;
	if (!isHalfMove) {
		numCapturedPieces = this.board.captureFencedBloomsBelongingToPlayer(getOpponentName(move.player));
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

BloomsGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

/* Required by Main */
BloomsGameManager.prototype.getWinner = function() {
	if (this.hostScore > this.board.scoreNeededToWin) {
		return HOST;
	} else if (this.guestScore > this.board.scoreNeededToWin) {
		return GUEST;
	}
};

/* Required by Main */
BloomsGameManager.prototype.getWinReason = function() {
	var winnerScore = this.hostScore > this.guestScore ? this.hostScore : this.guestScore;
	return " won the game with a score of " + winnerScore;
};

BloomsGameManager.prototype.getWinResultTypeCode = function() {
	if (this.getWinner()) {
		return 1;
	}
};

BloomsGameManager.prototype.getCopy = function() {
	var copyGame = new BloomsGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	return copyGame;
};

BloomsGameManager.prototype.pointIsOpen = function(npText) {
	var rowAndCol = BloomsBoardPoint.notationPointStringMap[npText];
	return !this.board.cells[rowAndCol.row][rowAndCol.col].hasTile();
};
