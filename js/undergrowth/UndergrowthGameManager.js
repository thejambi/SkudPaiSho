
Undergrowth.GameManager = function(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new Undergrowth.TileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}

// Set up the game
Undergrowth.GameManager.prototype.setup = function (ignoreActuate) {

	this.board = new Undergrowth.Board();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
Undergrowth.GameManager.prototype.actuate = function() {
	if (this.isCopy) {
		return;
	}

	this.actuator.actuate(this.board, this);
};

Undergrowth.GameManager.prototype.runNotationMove = function(move, withActuate) {
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

Undergrowth.GameManager.prototype.drawRandomTileFromTileManager = function(playerName) {
	return this.tileManager.drawRandomTile(playerName);
};

Undergrowth.GameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

Undergrowth.GameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

Undergrowth.GameManager.prototype.setAllLegalPointsOpen = function(player, tile, ignoreActuate) {
	if (!this.board.setHarmonyPointsOpen(tile, player)) {
		this.board.setAllPossiblePointsOpen(tile, player);
	}
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

Undergrowth.GameManager.prototype.playerCanBonusPlant = function(player) {
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

Undergrowth.GameManager.prototype.revealSpecialFlowerPlacementPoints = function(player) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

Undergrowth.GameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

Undergrowth.GameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

Undergrowth.GameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

Undergrowth.GameManager.prototype.getWinner = function() {
	if (this.endGameWinners.length === 1) {
		return this.endGameWinners[0];
	}
};

Undergrowth.GameManager.prototype.getWinReason = function() {
	var msg = "";
	if (this.getWinner()) {
		msg += " won the game!";
	}
	return msg + "<br /><br />" + this.board.harmonyManager.getScoreSummaryText();
};

Undergrowth.GameManager.prototype.getScoreSummary = function() {
	return "";
	/* var tilesLeft = this.tileManager.guestTiles.length;
	return "<br />"
		+ this.board.harmonyManager.getScoreSummaryText(); */
};

Undergrowth.GameManager.prototype.getWinResultTypeCode = function() {
	if (this.endGameWinners.length === 1) {
		return 1;
	}
};

Undergrowth.GameManager.prototype.getCopy = function() {
	var copyGame = new Undergrowth.GameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
