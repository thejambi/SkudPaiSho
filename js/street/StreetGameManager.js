// Street Pai Sho Game Manager

function StreetGameManager(ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = new StreetActuator();

	this.tileManager = new StreetTileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}

// Set up the game
StreetGameManager.prototype.setup = function (ignoreActuate) {

	this.board = new StreetBoard();

	/* Initial board position */

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
StreetGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager);
};

StreetGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	var errorFound = false;

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
		var tileMoved = this.board.moveTile(move.player, move.startPoint, move.endPoint);
		/* If the tile moved captured a tile that had a captured tile, 
		 * the bottom-most tile gets put back in tile pile. 
		 */
		if (tileMoved.capturedTile && tileMoved.capturedTile.capturedTile) {
			this.tileManager.putTileBack(tileMoved.capturedTile.capturedTile);
		}
	} else if (INITIAL_SETUP) {
		// Place tiles on board according to board setup code
		
		// Create point list
		var pointList = [];

		switch (move.boardSetupCode) {
			case "1":
				if (move.player === HOST) {
					// North side of board
					pointList.push(new NotationPoint("-7,0"));
					pointList.push(new NotationPoint("-6,5"));
					pointList.push(new NotationPoint("-4,3"));
					pointList.push(new NotationPoint("-2,5"));
					pointList.push(new NotationPoint("0,7"));
					pointList.push(new NotationPoint("2,5"));
					pointList.push(new NotationPoint("4,3"));
					pointList.push(new NotationPoint("6,5"));
				} else if (move.player === GUEST) {
					// South side of board
					pointList.push(new NotationPoint("-6,-5"));
					pointList.push(new NotationPoint("-4,-3"));
					pointList.push(new NotationPoint("-2,-5"));
					pointList.push(new NotationPoint("0,-7"));
					pointList.push(new NotationPoint("2,-5"));
					pointList.push(new NotationPoint("4,-3"));
					pointList.push(new NotationPoint("6,-5"));
					pointList.push(new NotationPoint("7,0"));
				}
				break;
			default: 
				debug("Unknown board setup code.");
				errorFound = true;
		}

		var self = this;
		pointList.forEach(
			function(notationPoint) {
				var tile = self.tileManager.grabTile(move.player);
				self.board.placeTile(tile, notationPoint);
			}
		);
	}

	if (withActuate) {
		this.actuate();
	}

	this.endGameWinners = [];
	if (this.board.winners.length === 0) {
		// If no harmony set winners, check for player out of tiles
		var playerOutOfTiles = this.tileManager.aPlayerIsOutOfTiles();
		if (playerOutOfTiles) {
			debug("PLAYER OUT OF TILES: " + playerOutOfTiles);
			if (playerOutOfTiles === HOST) {
				this.endGameWinners.push(GUEST);
			} else {
				this.endGameWinners.push(HOST);
			}
		}
	}
};

StreetGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

StreetGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

StreetGameManager.prototype.revealOpenGates = function(player, moveNum, ignoreActuate) {
	this.board.setOpenGatePossibleMoves(player);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

StreetGameManager.prototype.playerCanBonusPlant = function(player) {
	if (!newGatesRule) {
		return true;
	}

	if (lessBonus) {
		return this.board.playerHasNoGrowingFlowers(player);
	} else if (limitedGatesRule) {
		// New Gate Rules: Player cannot plant on Bonus if already controlling any Gates
		return this.board.playerHasNoGrowingFlowers(player);
	} else if (newGatesRule) {
		// New Gate Rules: Player cannot plant on Bonus if already controlling two Gates
		return this.board.playerControlsLessThanTwoGates(player);
	}
};

StreetGameManager.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

StreetGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

StreetGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

StreetGameManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	return this.tileManager.aPlayerIsOutOfBasicFlowerTiles();
};

StreetGameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

StreetGameManager.prototype.getWinner = function() {
	if (this.board.winners.length === 1) {
		return this.board.winners[0];
	} else if (this.board.winners.length > 1) {
		return "BOTH players";
	} else if (this.endGameWinners.length === 1) {
		return this.endGameWinners[0];
	} else if (this.endGameWinners.length > 1) {
		return "BOTH players";
	}
};

StreetGameManager.prototype.getWinReason = function() {
	if (this.board.winners.length === 1) {
		return " achieved Harmony across all midlines and won the game!";
	} else if (this.endGameWinners.length === 1) {
		if (this.tileManager.getPlayerWithMoreAccentTiles()) {
			return " won the game with more Accent Tiles left.";
		} else {
			return " won the game with the most Harmonies.";
		}
	}
};

StreetGameManager.prototype.getWinResultTypeCode = function() {
	if (this.board.winners.length === 1) {
		return 1;	// Harmony Ring is 1
	} else if (this.endGameWinners.length === 1) {
		if (this.tileManager.getPlayerWithMoreAccentTiles()) {
			return 2;	// More Accent Tiles remaining
		} else {
			return 3;	// Most Harmonies
		}
	} else if (this.endGameWinners.length > 1) {
		return 4;	// Tie
	}
};

StreetGameManager.prototype.getCopy = function() {
	var copyGame = new StreetGameManager(true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
