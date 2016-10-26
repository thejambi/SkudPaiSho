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
		self.tileManager.unselectTiles(move.player);
	} else if (move.moveNum === 1) {
		this.tileManager.unselectTiles(GUEST);
		this.tileManager.unselectTiles(HOST);
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

	if (withActuate) {
		this.actuate();
	}

	return bonusAllowed;
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

GameManager.prototype.revealOpenGates = function(player, moveNum, ignoreActuate) {
	if (moveNum === 2) {
		// guest selecting first tile
		this.board.setGuestGateOpen();
	} else {
		this.board.setOpenGatePossibleMoves(player);
	}
	
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
