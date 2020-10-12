// Skud Pai Sho Game Manager

var AdevarBoardSetupPoints = {
	hiddenTile: {
		HOST: new NotationPoint("6,-6"),
		GUEST: new NotationPoint("-5,5")
	},
	vanguard: {
		HOST: [
			new NotationPoint("5,-6"), 
			new NotationPoint("6,-5")
		],
		GUEST: [
			new NotationPoint("-5,4"), 
			new NotationPoint("-4,5")
		]
	}
};

function AdevarGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new AdevarTileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}

// Set up the game
AdevarGameManager.prototype.setup = function (ignoreActuate) {

	this.usingTileReserves = false;

	this.board = new AdevarBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
AdevarGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager);
};

AdevarGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	if (move.moveType === AdevarMoveType.chooseHiddenTile) {
		// Need to do all the game setup as well as set the player's hidden tile
		var hiddenTile = this.tileManager.grabTile(move.player, move.hiddenTileCode);
		hiddenTile.hidden = true;
		debug(hiddenTile);

		// Place Hidden Tile
		this.board.placeTile(hiddenTile, AdevarBoardSetupPoints.hiddenTile[move.player]);

		var self = this;

		// Place Vanguard tiles
		AdevarBoardSetupPoints.vanguard[move.player].forEach(function(vanguardPoint) {
			self.board.placeTile(self.tileManager.grabTile(move.player, AdevarTileCode.vanguard),
				vanguardPoint);
		});
		
	} else if (move.moveType === DEPLOY) {
		// Just placing tile on board
		var tile = this.tileManager.grabTile(move.player, move.tileType);
		this.board.placeTile(tile, move.endPoint);
	} else if (move.moveType === MOVE) {
		var moveTileResults = this.board.moveTile(move.startPoint, move.endPoint);
		if (moveTileResults.capturedTile && moveTileResults.putCapturedTileBackInHand) {
			this.tileManager.putTileBack(capturedTile);
		}
	}

	if (withActuate) {
		this.actuate();
	}
};

AdevarGameManager.prototype.revealAllPointsAsPossible = function() {
	this.board.setAllPointsAsPossible();
	this.actuate();
};

AdevarGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

AdevarGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

AdevarGameManager.prototype.revealOpenGates = function(player, moveNum, ignoreActuate) {
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

AdevarGameManager.prototype.playerCanBonusPlant = function(player) {
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

AdevarGameManager.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

AdevarGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

AdevarGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

AdevarGameManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	return this.tileManager.aPlayerIsOutOfBasicFlowerTiles();
};

AdevarGameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

AdevarGameManager.prototype.setWinnerIsFun = function() {
	this.setWinner = true;
};

AdevarGameManager.prototype.getWinner = function() {
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

AdevarGameManager.prototype.getWinReason = function() {
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

AdevarGameManager.prototype.getWinResultTypeCode = function() {
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

AdevarGameManager.prototype.getCopy = function() {
	var copyGame = new AdevarGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};

AdevarGameManager.prototype.isUsingTileReserves = function() {
	return this.usingTileReserves;
};
