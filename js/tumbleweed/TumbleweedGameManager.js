
function TumbleweedGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;
	this.actuator = actuator;

	this.hostScore = 0;
	this.guestScore = 0;

	this.endOfGame = false;
	
	this.setup(ignoreActuate);
}

TumbleweedGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new TumbleweedBoard();

	if (!gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE)) {
		var neutralSettlementNotationPoint = "h8";
		if (gameOptionEnabled(HEXHEX_11)) {
			neutralSettlementNotationPoint = "k11";
		} else if (gameOptionEnabled(HEXHEX_6)) {
			neutralSettlementNotationPoint = "f6";
		}
		this.board.createNeutralSettlement(neutralSettlementNotationPoint, 2);
	}

	this.passInSuccessionCount = 0;

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
		this.board.doInitialSwap();
	} else if (move.passTurn) {
		this.passInSuccessionCount++;
	} else if (move.initialPlacementForPlayer) {
		initialSettlementValue = 1;
		if (move.initialPlacementForPlayer === "NEUTRAL") {
			initialSettlementValue = 2;
		}
		this.board.placeSettlement(move.initialPlacementForPlayer, move.deployPoint, initialSettlementValue);
	} else if (move.deployPoint) {
		this.board.placeSettlement(move.player, move.deployPoint);
	}

	if (!move.passTurn) {
		this.passInSuccessionCount = 0;
	}

	this.calculateScores();

	if (this.passInSuccessionCount === 2 || this.board.allSpacesSettled()) {
		// both players passed, end of game
		this.endOfGame = true;
	}

	if (withActuate) {
		this.actuate();
	}
};

TumbleweedGameManager.prototype.calculateScores = function() {
	this.hostScore = this.board.countSettlements(HOST);
	this.guestScore = this.board.countSettlements(GUEST);

	debug("HOST Score: " + this.hostScore);
	debug("GUEST Score: " + this.guestScore);
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
	if (this.endOfGame) {
		if (this.hostScore > this.guestScore) {
			return HOST;
		} else if (this.guestScore > this.hostScore) {
			return GUEST;
		} else {
			return "BOTH players";
		}
	}
};

/* Required by Main */
TumbleweedGameManager.prototype.getWinReason = function() {
	var winnerScore = this.hostScore > this.guestScore ? this.hostScore : this.guestScore;
	return " won the game with a score of " + winnerScore
		+ "<br /><span>Host settlements: " + this.hostScore + "</span>"
		+ "<br /><span>Guest settlements: " + this.guestScore + "</span>";
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
