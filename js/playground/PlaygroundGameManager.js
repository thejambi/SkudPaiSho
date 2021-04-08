// Skud Pai Sho Game Manager

function PlaygroundGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new PlaygroundTileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}

// Set up the game
PlaygroundGameManager.prototype.setup = function (ignoreActuate) {

	this.actuateOptions = {
		showTileLibrary: true,
		showTileReserve: true
	};
	this.usingTileReserves = false;

	this.board = new PlaygroundBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
PlaygroundGameManager.prototype.actuate = function (moveToAnimate) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, this.actuateOptions, moveToAnimate);
};

PlaygroundGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	if (move.moveType === PlaygroundMoveType.endGame) {
		this.board.winners.push("FUN");
	} else if (move.moveType === PlaygroundMoveType.hideTileLibraries) {
		this.usingTileReserves = true;
		this.actuateOptions.showTileLibrary = false;
	} else if (move.moveType === DEPLOY) {
		// Just placing tile on board
		var tile = this.tileManager.grabTile(move.tileOwner, move.tileType, move.sourcePileName);
		var capturedTile = this.board.placeTile(tile, move.endPoint);
		if (capturedTile) {
			this.tileManager.pilesByName[PlaygroundNotationConstants.capturedPile].push(capturedTile);
		}
	} else if (move.moveType === MOVE) {
		var capturedTile = this.board.moveTile(move.startPoint, move.endPoint);
		if (capturedTile) {
			this.tileManager.pilesByName[PlaygroundNotationConstants.capturedPile].push(capturedTile);
		}
	} else if (move.moveType === PlaygroundMoveType.hideTileLibraries) {
		this.actuateOptions.showTileLibrary = false;
	} else if (move.moveType === PlaygroundMoveType.deployToTilePile) {
		var tile = this.tileManager.grabTile(move.tileOwner, move.tileType, move.sourcePileName);
		this.tileManager.pilesByName[move.endPileName].push(tile);
	} else if (move.moveType === PlaygroundMoveType.moveToTilePile) {
		var tile = this.board.removeTile(move.startPoint);
		this.tileManager.pilesByName[move.endPileName].push(tile);
	}

	if (withActuate) {
		this.actuate(move);
	}
};

PlaygroundGameManager.prototype.revealAllPointsAsPossible = function() {
	this.board.setAllPointsAsPossible();
	this.tileManager.setZonesAsPossibleMovePoints();
	this.actuate();
};

PlaygroundGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	this.tileManager.setZonesAsPossibleMovePoints();
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

PlaygroundGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeZonePossibleMoves();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

PlaygroundGameManager.prototype.revealOpenGates = function(player, moveNum, ignoreActuate) {
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

PlaygroundGameManager.prototype.playerCanBonusPlant = function(player) {
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

PlaygroundGameManager.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

PlaygroundGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

PlaygroundGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

PlaygroundGameManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	return this.tileManager.aPlayerIsOutOfBasicFlowerTiles();
};

PlaygroundGameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

PlaygroundGameManager.prototype.setWinnerIsFun = function() {
	this.setWinner = true;
};

PlaygroundGameManager.prototype.getWinner = function() {
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

PlaygroundGameManager.prototype.getWinReason = function() {
	if (this.board.winners.length === 1) {
		return " wins! The game has ended.";
	} else if (this.endGameWinners.length === 1) {
		if (this.tileManager.getPlayerWithMoreAccentTiles()) {
			return " won the game with more Accent Tiles left.";
		} else {
			return " won the game with the most Harmonies.";
		}
	}
};

PlaygroundGameManager.prototype.getWinResultTypeCode = function() {
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

PlaygroundGameManager.prototype.getCopy = function() {
	var copyGame = new PlaygroundGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};

PlaygroundGameManager.prototype.isUsingTileReserves = function() {
	return this.usingTileReserves;
};
