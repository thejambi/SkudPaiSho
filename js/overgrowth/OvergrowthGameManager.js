// Solitaire Game Manager

function OvergrowthGameManager(actuator, ignoreActuate, isCopy, existingDrawnTile, existingLastDrawnTile) {
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new OvergrowthTileManager();

	this.drawnTile = existingDrawnTile;
	this.lastDrawnTile = existingLastDrawnTile; // Save for Undo

	this.drawRandomTile();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}

OvergrowthGameManager.prototype.drawRandomTile = function() {
	if (gameController && !this.currentDrawnTileIsPresentInTileManager()) {
		this.lastDrawnTile = this.drawnTile;
		this.drawnTile = this.drawRandomTileFromTileManager(getCurrentPlayer());
	}
};

// Set up the game
OvergrowthGameManager.prototype.setup = function (ignoreActuate) {

	this.board = new OvergrowthBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
OvergrowthGameManager.prototype.actuate = function() {
	if (this.isCopy) {
		return;
	}

	if (gameController) {
		if (!this.drawnTile) {
			this.drawRandomTile();
		}
		var tile = this.tileManager.peekTile(this.drawnTile.ownerName, this.drawnTile.code, this.drawnTile.id);
		if (!tile) {
			this.drawnTile = null;
			this.lastDrawnTile = null; // Save for Undo

			this.drawRandomTile();
		}
	}

	this.actuator.actuate(this.board, this, this.drawnTile);
};

OvergrowthGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	var errorFound = false;
	var bonusAllowed = false;

	if (move.moveType === PLANTING) {
		// Just placing tile on board
		var tile = this.tileManager.grabTile(move.player, move.plantedFlowerType);

		this.board.placeTile(tile, move.endPoint);
	}

	if (withActuate) {
		this.actuate();
	}

	this.endGameWinners = [];
	// For Solitaire: end game when all tiles have been played
	var noTilesLeft = this.tileManager.noMoreTilesLeft();
	if (noTilesLeft) {
		this.endGameWinners.push(this.board.harmonyManager.getWinningPlayer());
	}

	return bonusAllowed;
};

OvergrowthGameManager.prototype.drawRandomTileFromTileManager = function(playerName) {
	return this.tileManager.drawRandomTile(playerName);
};

OvergrowthGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

OvergrowthGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

OvergrowthGameManager.prototype.setAllLegalPointsOpen = function(player, tile, ignoreActuate) {
	if (tile.type === ACCENT_TILE) {
		this.board.setSolitaireAccentPointsOpen(tile);
	} else {
		if (!this.board.setHarmonyAndClashPointsOpen(tile, player)) {
			this.board.setAllPossiblePointsOpen(tile, player);
		}
	}
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

OvergrowthGameManager.prototype.playerCanBonusPlant = function(player) {
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

OvergrowthGameManager.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

OvergrowthGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

OvergrowthGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

OvergrowthGameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

OvergrowthGameManager.prototype.getWinner = function() {
	if (this.endGameWinners.length === 1) {
		return this.endGameWinners[0];
	}
};

OvergrowthGameManager.prototype.getWinReason = function() {
	var msg = "";
	if (this.getWinner()) {
		msg += " won the game!";
	}
	return msg + "<br /><br />" + this.board.harmonyManager.getScoreSummaryText();
};

OvergrowthGameManager.prototype.getScoreSummary = function() {
	var tilesLeft = this.tileManager.guestTiles.length;
	return "<br />"
		+ this.board.harmonyManager.getScoreSummaryText()
		+ "<br />"
		+ tilesLeft + " tiles remaining.";
};

OvergrowthGameManager.prototype.getWinResultTypeCode = function() {
	if (this.endGameWinners.length === 1) {
		return 1;
	}
};

OvergrowthGameManager.prototype.currentDrawnTileIsPresentInTileManager = function() {
	if (this.drawnTile) {
		var tile = this.tileManager.peekTile(this.drawnTile.ownerName, this.drawnTile.code, this.drawnTile.id);
		return tile;
	}
	return false;
};

OvergrowthGameManager.prototype.getCopy = function() {
	var copyGame = new OvergrowthGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
