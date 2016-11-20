// Game Manager

function GameManager(ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = new Actuator();

	this.tileManager = new TileManager();

	this.setup(ignoreActuate);
}

// Set up the game
GameManager.prototype.setup = function (ignoreActuate) {

	this.board = new Board();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
GameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager);
};

GameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	if (move.moveType === DEPLOY) {
		// Just placing tile on board
		var tile = this.tileManager.grabTile(move.player, move.tileType);

		this.board.placeTile(tile, move.endPoint);
	} else if (move.moveType === MOVE) {
		this.board.moveTile(move.player, move.startPoint, move.endPoint);
	}

	if (withActuate) {
		this.actuate();
	}
};

GameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

GameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

GameManager.prototype.revealDeployPoints = function(player, tileCode, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(player, tileCode);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

GameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

GameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

GameManager.prototype.getCopy = function() {
	var copyGame = new GameManager(true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
