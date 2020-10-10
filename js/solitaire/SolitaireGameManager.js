// Solitaire Game Manager

function SolitaireGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new SolitaireTileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}

// Set up the game
SolitaireGameManager.prototype.setup = function (ignoreActuate) {

	this.board = new SolitaireBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
SolitaireGameManager.prototype.actuate = function() {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this, gameController.drawnTile);
};

SolitaireGameManager.prototype.runNotationMove = function(move, withActuate) {
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
		// For Solitaire: end game when a player out of all tiles
		var playerOutOfTiles = this.tileManager.aPlayerIsOutOfTiles();
		if (playerOutOfTiles) {
			debug("PLAYER OUT OF TILES: " + playerOutOfTiles);
			this.endGameWinners.push(HOST);
		}
	}

	return bonusAllowed;
};

SolitaireGameManager.prototype.drawRandomTile = function() {
	return this.tileManager.drawRandomTile();
};

SolitaireGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

SolitaireGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

SolitaireGameManager.prototype.setAllLegalPointsOpen = function(player, tile, ignoreActuate) {
	if (tile.type === ACCENT_TILE) {
		this.board.setSolitaireAccentPointsOpen(tile);
	} else {
		if (!this.board.setHarmonyAndClashPointsOpen(tile)) {
			this.board.setAllPossiblePointsOpen(tile);
		}
	}
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

SolitaireGameManager.prototype.playerCanBonusPlant = function(player) {
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

SolitaireGameManager.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

SolitaireGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

SolitaireGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

SolitaireGameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

SolitaireGameManager.prototype.getWinner = function() {
	if (this.endGameWinners.length === 1) {
		return this.endGameWinners[0];
	}
};

SolitaireGameManager.prototype.getWinReason = function() {
	return "<br />" + this.board.harmonyManager.getSolitaireGameSummaryText();
};

SolitaireGameManager.prototype.getWinResultTypeCode = function() {
	if (this.endGameWinners.length === 1) {
		return 6;	// Solitaire game end
	}
};

SolitaireGameManager.prototype.getCopy = function() {
	var copyGame = new SolitaireGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
