// Game Manager

function GameManager(ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = new Actuator();

	this.tileManager = new TileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
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

	if (move.moveType === PLANTING) {
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

	this.endGameWinners = [];
	if (this.board.winners.length === 0) {
		// If no harmony ring winners, check for player out of basic flower tiles
		// For Solitaire: end game when a player out of all tiles
		var playerOutOfTiles = this.tileManager.aPlayerIsOutOfTiles();
		if (playerOutOfTiles) {
			debug("PLAYER OUT OF TILES: " + playerOutOfTiles);
			// If a player has more accent tiles, they win
			var playerMoreAccentTiles = this.tileManager.getPlayerWithMoreAccentTiles();
			if (playerMoreAccentTiles) {
				debug("Player has more Accent Tiles: " + playerMoreAccentTiles)
				this.endGameWinners.push(playerMoreAccentTiles);
			} else {
				// Calculate player with most Harmonies
				var playerWithmostHarmonies = this.board.harmonyManager.getPlayerWithMostHarmonies();
				if (playerWithmostHarmonies) {
					this.endGameWinners.push(playerWithmostHarmonies);
					debug("Most Harmonies winner: " + playerWithmostHarmonies);
				} else {
					this.endGameWinners.push(HOST);
					this.endGameWinners.push(GUEST);
					debug("Most Harmonies is a tie!");
				}
			}
		}
	}

	return bonusAllowed;
};

GameManager.prototype.drawRandomTile = function() {
	return this.tileManager.drawRandomTile();
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

GameManager.prototype.setAllLegalPointsOpen = function(player, tile, ignoreActuate) {
	// Really should be: setAllLegalPointsOpen that blocks clashing garden placement
	this.board.setAllPointsOpen(tile);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

GameManager.prototype.playerCanBonusPlant = function(player) {
	if (!newGatesRule) {
		return true;
	}

	if (lessBonus) {
		return this.board.playerHasNoGrowingFlowers(player);
	} else if (newGatesRule) {
		// New Gate Rules: Player cannot plant on Bonus if already controlling two Gates
		return this.board.playerControlsLessThanTwoGates(player);
	}
};

GameManager.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
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

GameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

GameManager.prototype.getWinner = function() {
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

GameManager.prototype.getWinReason = function() {
	// if (this.board.winners.length === 1) {
	// 	return " created a Harmony Ring and won the game!";
	// } else if (this.endGameWinners.length === 1) {
	// 	if (this.tileManager.getPlayerWithMoreAccentTiles()) {
	// 		return " won the game with more Accent Tiles left.";
	// 	} else {
	// 		return " won the game with the most Harmonies.";
	// 	}
	// }
	return this.board.harmonyManager.getSolitaireGameSummaryText();
};

GameManager.prototype.getCopy = function() {
	var copyGame = new GameManager(true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
