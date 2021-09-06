// Spirit Game Manager

function SpiritGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new SpiritTileManager();

	this.setup(ignoreActuate);
}

// Set up the game
SpiritGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new SpiritBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
SpiritGameManager.prototype.actuate = function() {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager);
};

SpiritGameManager.prototype.drawRandomTile = function() {
	return this.tileManager.drawRandomTile();
};

SpiritGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	if (move.moveType === MOVE) {
		var capturedTile = this.board.moveTile(move.player, move.startPoint, move.endPoint);
		if (capturedTile) {
			this.tileManager.putTileBack(capturedTile);

			// Analyze board for end of game conditions
			this.board.checkForEndOfGame();
		}
	} else if (INITIAL_SETUP) {
		var tileList = [];
		// convert move.initialTileCodeList into tileList. Grab all tiles
		var self = this;
		move.initialTileCodeList.forEach(
			function(tileCode) {
				var tile = self.tileManager.grabTile(move.player, tileCode);
				tileList.push(tile);
			}
		);
		this.board.placeInitialTiles(move.player, tileList);
	}

	if (withActuate) {
		this.actuate();
	}
};

SpiritGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

SpiritGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

SpiritGameManager.prototype.revealDeployPoints = function(player, tileCode, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(player, tileCode);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

SpiritGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

SpiritGameManager.prototype.getWinner = function() {
	if (this.board.winners.length === 1) {
		return this.board.winners[0];
	} else if (this.board.winners.length > 1) {
		return "BOTH players";
	}
};

SpiritGameManager.prototype.getWinReason = function() {
	return " has more tiles remaining and won the game!";
};

SpiritGameManager.prototype.getWinResultTypeCode = function() {
	if (this.board.winners.length === 1) {
		return 7;	//TODO: Fix this number
	} else {
		return 4;	// Tie
	}
};

SpiritGameManager.prototype.getCopy = function() {
	var copyGame = new SpiritGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
