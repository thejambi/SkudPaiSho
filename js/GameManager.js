// Game Manager

function GameManager() {
	this.actuator = new Actuator();

	this.tileManager = new TileManager();

	this.setup();
}

// Set up the game
GameManager.prototype.setup = function () {

	this.board = new Board();

	// Update the actuator
	this.actuate();
};

// Sends the updated board to the actuator
GameManager.prototype.actuate = function () {
	this.actuator.actuate(this.board, this.tileManager);
};

GameManager.prototype.runNotationMove = function(move) {
	debug("Running Move: " + move.fullMoveText);

	var errorFound = false;
	var bonusAllowed = false;

	if (move.moveNum === 0 && move.accentTiles) {
		var self = this;
		var allAccentCodes = ['R','W','K','B','R','W','K','B'];
		move.accentTiles.forEach(function(tileCode) {
			var i = allAccentCodes.indexOf(tileCode);
			if (i >= 0) {
				allAccentCodes.splice(i, 1);
			}
		});
		allAccentCodes.forEach(function(tileCode) {
			self.tileManager.grabTile(move.player, tileCode);
		});
	}

	if (move.moveType === PLANTING) {
		// // Check if valid plant
		if (!this.board.pointIsOpenGate(move.endPoint)) {
			// invalid
			debug("Invalid planting point: " + move.endPoint.pointText);
			errorFound = true;
			return false;
		}
		// Just placing tile on board
		var tile = this.tileManager.grabTile(move.player, move.plantedFlowerType);

		this.board.placeTile(tile, move.endPoint);
	} else if (move.moveType === ARRANGING) {
		bonusAllowed = this.board.moveTile(move.player, move.startPoint, move.endPoint);

		if (bonusAllowed && move.hasHarmonyBonus()) {
			var tile = this.tileManager.grabTile(move.player, move.bonusTileCode);
			if (move.boatBonusPoint) {
				this.board.placeTile(tile, move.bonusEndPoint, move.boatBonusPoint);
			} else {
				this.board.placeTile(tile, move.bonusEndPoint);
			}
		} else if (!bonusAllowed && move.hasHarmonyBonus()) {
			debug("BONUS NOT ALLOWED so I won't give it to you!");
			errorFound = true;
		}
	}

	this.actuate();

	return bonusAllowed;
};

GameManager.prototype.revealPossibleMovePoints = function(boardPoint) {
	if (!boardPoint.hasTile()) {
		debug("Can't move non-existent tile, man");
		return;
	}
	debug(boardPoint);
	this.board.setPossibleMovePoints(boardPoint);
	this.actuate();
};

GameManager.prototype.hidePossibleMovePoints = function() {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	this.actuate();
};

GameManager.prototype.revealOpenGates = function() {
	this.board.setOpenGatePossibleMoves();
	this.actuate();
};

GameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

GameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};


