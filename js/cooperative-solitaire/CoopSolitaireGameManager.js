// Solitaire Game Manager

function CoopSolitaireGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new CoopSolitaireTileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}

// Set up the game
CoopSolitaireGameManager.prototype.setup = function (ignoreActuate) {

	this.board = new CoopSolitaireBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
CoopSolitaireGameManager.prototype.actuate = function() {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this, gameController.drawnTile);
};

CoopSolitaireGameManager.prototype.runNotationMove = function(move, withActuate) {
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

CoopSolitaireGameManager.prototype.drawRandomTile = function() {
	return this.tileManager.drawRandomTile();
};

CoopSolitaireGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

CoopSolitaireGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

CoopSolitaireGameManager.prototype.setAllLegalPointsOpen = function(player, tile, ignoreActuate) {
	if (tile.type === ACCENT_TILE) {
		this.board.setSolitaireAccentPointsOpen(tile);
	} else {
		if (!this.board.setHarmonyOrClashPointsOpen(tile, player)) {
			this.board.setAllPossiblePointsOpen(tile, player);
		}
	}
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

CoopSolitaireGameManager.prototype.playerCanBonusPlant = function(player) {
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

CoopSolitaireGameManager.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

CoopSolitaireGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

CoopSolitaireGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

CoopSolitaireGameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

CoopSolitaireGameManager.prototype.getWinner = function() {
	if (this.endGameWinners.length === 1) {
		return this.endGameWinners[0];
	}
};

CoopSolitaireGameManager.prototype.getWinReason = function() {
	return "<br />" + this.board.harmonyManager.getSolitaireGameSummaryText();
};

CoopSolitaireGameManager.prototype.getWinResultTypeCode = function() {
	if (this.endGameWinners.length === 1) {
		return 6;	// Solitaire game end
	}
};

CoopSolitaireGameManager.prototype.getCopy = function() {
	var copyGame = new CoopSolitaireGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
