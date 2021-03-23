
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

	this.passInSuccessionCount = 0;

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
Undergrowth.GameManager.prototype.actuate = function(move, moveAnimationBeginStep) {
	if (this.isCopy) {
		return;
	}

	this.actuator.actuate(this.board, this, move, moveAnimationBeginStep);
};

Undergrowth.GameManager.prototype.runNotationMove = function(move, withActuate, moveAnimationBeginStep) {
	debug("Running Move: " + move.fullMoveText);

	var errorFound = false;
	var bonusAllowed = false;

	if (move.moveType === Undergrowth.NotationVars.PASS_TURN) {
		this.passInSuccessionCount++;
	} else if (move.moveType === PLANTING) {
		// Just placing tile on board
		var tile = this.tileManager.grabTile(move.player, move.plantedFlowerType);
		var capturedTilesInfo = this.board.placeTile(tile, move.endPoint);

		move.plantedTile1 = tile;
		move.capturedTiles1Info = capturedTilesInfo;

		if (move.plantedFlowerType2 && move.endPoint2) {
			var tile = this.tileManager.grabTile(move.player, move.plantedFlowerType2);
			var capturedTiles2Info = this.board.placeTile(tile, move.endPoint2);

			move.plantedTile2 = tile;
			move.capturedTiles2Info = capturedTiles2Info;
		}
	}

	if (move.moveType !== Undergrowth.NotationVars.PASS_TURN) {
		this.passInSuccessionCount = 0;
	}

	if (withActuate) {
		this.actuate(move, moveAnimationBeginStep);
	}

	this.endGameWinners = [];
	// End game when all tiles have been played
	var noTilesLeft = this.tileManager.noMoreTilesLeft();
	if (noTilesLeft || this.passInSuccessionCount === 2) {
		this.endGameWinners.push(this.board.getPlayerWithMostTilesInOrTouchingCentralGardens());
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
	if (this.board.hasOpenGates()) {
		this.board.setOpenGatePossibleMoves();
	} else {
		this.board.setHarmonyPointsOpen(tile, player);
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
		msg += " won the game with more tiles touching the Central Gardens!";
	}
	return msg;
};

Undergrowth.GameManager.prototype.getScoreSummary = function() {
	return "<br />"
		+ "Host Central Tiles: " + this.board.getNumberOfTilesTouchingCentralGardensForPlayer(HOST)
		+ "<br />"
		+ "Guest Central Tiles: " + this.board.getNumberOfTilesTouchingCentralGardensForPlayer(GUEST);
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
