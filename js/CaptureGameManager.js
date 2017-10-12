// Capture Game Manager

function CaptureGameManager(ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = new CaptureActuator();

	this.tileManager = new CaptureTileManager();

	this.setup(ignoreActuate);
}

// Set up the game
CaptureGameManager.prototype.setup = function (ignoreActuate) {

	this.board = new CaptureBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
CaptureGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager);
};

CaptureGameManager.prototype.drawRandomTile = function() {
	return this.tileManager.drawRandomTile();
};

CaptureGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	if (move.moveType === MOVE) {
		var capturedTile = this.board.moveTile(move.player, move.startPoint, move.endPoint);
		if (capturedTile) {
			this.tileManager.putTileBack(capturedTile);
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

CaptureGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

CaptureGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

CaptureGameManager.prototype.revealDeployPoints = function(player, tileCode, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(player, tileCode);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

CaptureGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

CaptureGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

CaptureGameManager.prototype.getWinner = function() {
	if (this.board.winners.length === 1) {
		return this.board.winners[0];
	}
};

CaptureGameManager.prototype.getWinReason = function() {
	return " has more tiles remaining and won the game!";
};

CaptureGameManager.prototype.getWinResultTypeCode = function() {
	if (this.board.winners.length === 1) {
		return 7;	// Capture Pai Sho win is 7
	} else if (this.endGameWinners.length > 1) {
		return 4;	// Tie
	}
};

CaptureGameManager.prototype.getCopy = function() {
	var copyGame = new CaptureGameManager(true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
