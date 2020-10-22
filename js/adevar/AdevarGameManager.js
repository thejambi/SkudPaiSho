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
	},
	gate: {
		HOST: new NotationPoint("4,3"),
		GUEST: new NotationPoint("-3,-4")
	},
	lilac: {
		HOST: [
			new NotationPoint("3,4"), 
			new NotationPoint("5,2")
		],
		GUEST: [
			new NotationPoint("-4,-3"), 
			new NotationPoint("-2,-5")
		]
	},
	zinnia: {
		HOST: [
			new NotationPoint("3,5"), 
			new NotationPoint("6,2")
		],
		GUEST: [
			new NotationPoint("-5,-3"), 
			new NotationPoint("-2,-6")
		]
	},
	foxglove: {
		HOST: [
			new NotationPoint("3,6"), 
			new NotationPoint("7,2")
		],
		GUEST: [
			new NotationPoint("-6,-3"), 
			new NotationPoint("-2,-7")
		]
	},
	reflection: {
		HOST: new NotationPoint("5,4"),
		GUEST: new NotationPoint("-4,-5")
	}
};

function AdevarGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new AdevarTileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
	this.capturedTiles = [];
}

// Set up the game
AdevarGameManager.prototype.setup = function (ignoreActuate) {

	this.usingTileReserves = false;

	this.secondFaceTilePlayedCount = {
		HOST: 0,
		GUEST: 0
	};

	this.playerHiddenTiles = {
		HOST: null,
		GUEST: null
	};

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
		
		this.playerHiddenTiles[move.player] = hiddenTile;

		this.tileManager.removeRemainingHiddenTiles(move.player);

		// Place Hidden Tile
		this.board.placeTile(hiddenTile, AdevarBoardSetupPoints.hiddenTile[move.player]);

		var self = this;

		// Place Vanguard tiles
		AdevarBoardSetupPoints.vanguard[move.player].forEach(function(vanguardPoint) {
			self.board.placeTile(self.tileManager.grabTile(move.player, AdevarTileCode.vanguard),
				vanguardPoint);
		});

		// Place Gate tiles
		this.board.placeTile(self.tileManager.grabTile(move.player, AdevarTileCode.gate), AdevarBoardSetupPoints.gate[move.player]);
		
		// Place Lilac tiles
		AdevarBoardSetupPoints.lilac[move.player].forEach(function(lilacPoint) {
			self.board.placeTile(self.tileManager.grabTile(move.player, AdevarTileCode.lilac),
				lilacPoint);
		});

		// Place Zinnia tiles
		AdevarBoardSetupPoints.zinnia[move.player].forEach(function(zinniaPoint) {
			self.board.placeTile(self.tileManager.grabTile(move.player, AdevarTileCode.zinnia),
				zinniaPoint);
		});

		// Place Foxglove tiles
		AdevarBoardSetupPoints.foxglove[move.player].forEach(function(foxglovePoint) {
			self.board.placeTile(self.tileManager.grabTile(move.player, AdevarTileCode.foxglove),
				foxglovePoint);
		});

		// Place Reflection tile
		this.board.placeTile(self.tileManager.grabTile(move.player, AdevarTileCode.reflection), AdevarBoardSetupPoints.reflection[move.player]);

	} else if (move.moveType === DEPLOY) {
		var tile = this.tileManager.grabTile(move.player, move.tileType);
		var placeTileResults = this.board.placeTile(tile, move.endPoint);

		/* Record captured tile */
		if (placeTileResults.capturedTile) {
			this.capturedTiles.push(placeTileResults.capturedTile);
		}

		/* Return captured tile to tile reserve if needed */
		if (placeTileResults.capturedTile && placeTileResults.returnCapturedTileToHand) {
			this.tileManager.putTileBack(placeTileResults.capturedTile);
		}

		/* Remove Second Face tiles if player has played their second one */
		if (tile.type === AdevarTileType.secondFace) {
			this.secondFaceTilePlayedCount[move.player]++;
			if (this.secondFaceTilePlayedCount[move.player] === 2) {
				this.tileManager.removeRemainingTilesOfType(move.player, AdevarTileType.secondFace);
			}
		}
	} else if (move.moveType === MOVE) {
		var moveTileResults = this.board.moveTile(move.startPoint, move.endPoint);

		/* Record captured tile */
		if (moveTileResults.capturedTile) {
			this.capturedTiles.push(moveTileResults.capturedTile);
		}

		/* Return captured tile to tile reserve if needed */
		if (moveTileResults.capturedTile && moveTileResults.returnCapturedTileToHand) {
			this.tileManager.putTileBack(moveTileResults.capturedTile);
		}
	}

	this.board.countTilesInPlots();

	this.checkWinForPlayer(move.player);

	if (withActuate) {
		this.actuate();
	}
};

AdevarGameManager.prototype.revealAllPointsAsPossible = function() {
	this.board.setAllPointsAsPossible();
	this.actuate();
};

AdevarGameManager.prototype.revealDeployPoints = function(tile, ignoreActuate) {
	if (tile.type !== AdevarTileType.secondFace
		|| (tile.type === AdevarTileType.secondFace && this.secondFaceTilePlayedCount[tile.ownerName] < 2)
	) {
		this.board.setPossibleDeployPoints(tile);
	}

	if (!ignoreActuate) {
		this.actuate();
	}
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

AdevarGameManager.prototype.checkWinForPlayer = function(player) {
	var hiddenTile = this.playerHiddenTiles[player];
	if (!hiddenTile) {
		return;
	}

	switch(hiddenTile.code) {
		case AdevarTileCode.birdOfParadise:
			/* Objective: At least one Basic tile in every Plot */
			if (this.board.playerHasBasicTileInEveryPlot(player)) {
				this.endGameWinners.push(player);
			}
			break;
		default:
			debug("No Hidden Tile Objective");
	}

	if (this.endGameWinners.length > 0) {
		this.gameWinReason = " has completed their objective and won the game!";
	}
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
	if (this.endGameWinners.length === 1) {
		return this.gameWinReason;
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
