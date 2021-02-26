// Skud Pai Sho Game Manager

function SkudPaiShoGameManager(actuator, ignoreActuate, isCopy) {
	this.gameLogText = '';
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new SkudPaiShoTileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}

// Set up the game
SkudPaiShoGameManager.prototype.setup = function (ignoreActuate) {
	this.board = new SkudPaiShoBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
SkudPaiShoGameManager.prototype.actuate = function (moveToAnimate, moveAnimationBeginStep) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, moveToAnimate, moveAnimationBeginStep);
	setGameLogText(this.gameLogText);
};

SkudPaiShoGameManager.prototype.runNotationMove = function(move, withActuate, moveAnimationBeginStep) {
	debug("Running Move(" + (withActuate ? "" : "Not ") + "Actuated): " + move.fullMoveText);

	var errorFound = false;
	var bonusAllowed = false;

	if (move.moveNum === 0 && move.accentTiles) {
		var self = this;
		var allAccentCodes = ['R','W','K','B','R','W','K','B','M','P','T'];
		move.accentTiles.forEach(function(tileCode) {
			var i = allAccentCodes.indexOf(tileCode);
			if (i >= 0) {
				allAccentCodes.splice(i, 1);
			}
		});
		allAccentCodes.forEach(function(tileCode) {
			self.tileManager.grabTile(move.player, tileCode);
		});
		self.tileManager.unselectTiles(move.player);

		this.buildChooseAccentTileGameLogText(move);
	} else if (move.moveNum === 1) {
		this.tileManager.unselectTiles(GUEST);
		this.tileManager.unselectTiles(HOST);
	}

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

		this.board.placeTile(tile, move.endPoint, this.tileManager);

		this.buildPlantingGameLogText(move, tile);
	} else if (move.moveType === ARRANGING) {
		moveResults = this.board.moveTile(move.player, move.startPoint, move.endPoint);
		bonusAllowed = moveResults.bonusAllowed;

		move.capturedTile = moveResults.capturedTile;

		if (moveResults.bonusAllowed && move.hasHarmonyBonus()) {
			var tile = this.tileManager.grabTile(move.player, move.bonusTileCode);
			move.accentTileUsed = tile;
			if (move.boatBonusPoint) {
				this.board.placeTile(tile, move.bonusEndPoint, this.tileManager, move.boatBonusPoint);
			} else {
				placeTileResult = this.board.placeTile(tile, move.bonusEndPoint, this.tileManager);
				if (placeTileResult && placeTileResult.tileRemovedWithBoat) {
					move.tileRemovedWithBoat = placeTileResult.tileRemovedWithBoat;
				}
			}
		} else if (!moveResults.bonusAllowed && move.hasHarmonyBonus()) {
			debug("BONUS NOT ALLOWED so I won't give it to you!");
			errorFound = true;
		}

		this.buildArrangingGameLogText(move, moveResults);
	}

	if (withActuate) {
		this.actuate(move, moveAnimationBeginStep);
	}

	this.endGameWinners = [];
	if (this.board.winners.length === 0) {
		// If no harmony ring winners, check for player out of basic flower tiles
		var playerOutOfTiles = this.aPlayerIsOutOfBasicFlowerTiles();
		if (playerOutOfTiles) {
			debug("PLAYER OUT OF TILES: " + playerOutOfTiles);
			// (Previously, on Skud Pai Sho...) If a player has more accent tiles, they win
			// var playerMoreAccentTiles = this.tileManager.getPlayerWithMoreAccentTiles();
			// if (playerMoreAccentTiles) {
			// 	debug("Player has more Accent Tiles: " + playerMoreAccentTiles)
			// 	this.endGameWinners.push(playerMoreAccentTiles);
			// } else {
				// (Previously, on Skud Pai Sho...) Calculate player with most Harmonies
				// var playerWithmostHarmonies = this.board.harmonyManager.getPlayerWithMostHarmonies();
				// Calculate player with most Harmonies crossing midlines
			var playerWithmostHarmonies = this.board.harmonyManager.getPlayerWithMostHarmoniesCrossingMidlines();
			if (playerWithmostHarmonies) {
				this.endGameWinners.push(playerWithmostHarmonies);
				debug("Most Harmonies winner: " + playerWithmostHarmonies);
			} else {
				this.endGameWinners.push(HOST);
				this.endGameWinners.push(GUEST);
				debug("Most Harmonies is a tie!");
			}
			// }
		}
	}

	return bonusAllowed;
};

SkudPaiShoGameManager.prototype.buildChooseAccentTileGameLogText = function(move) {
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' chose Accent Tiles ' + move.accentTiles;
};
SkudPaiShoGameManager.prototype.buildPlantingGameLogText = function(move, tile) {
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' Planted ' + tile.getName() + ' at ' + move.endPoint.pointText;
};
SkudPaiShoGameManager.prototype.buildArrangingGameLogText = function(move, moveResults) {
	if (!moveResults) {
		return "Invalid Move :(";
	}
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' moved ' + moveResults.movedTile.getName() + ' ' + move.moveTextOnly;
	if (moveResults.capturedTile) {
		this.gameLogText += ' to capture ' + getOpponentName(move.player) + '\'s ' + moveResults.capturedTile.getName();
	}
	if (moveResults.bonusAllowed && move.hasHarmonyBonus()) {
		this.gameLogText += ' and used ' + SkudPaiShoTile.getTileName(move.bonusTileCode) + ' on Harmony Bonus';
	}
};

SkudPaiShoGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);

	if (!ignoreActuate) {
		this.actuate();
	}
};

SkudPaiShoGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate, moveToAnimate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate(moveToAnimate);
	}
};

SkudPaiShoGameManager.prototype.revealOpenGates = function(player, tile, moveNum, ignoreActuate) {
	if (!gameOptionEnabled(OPTION_INFORMAL_START) && moveNum === 2) {
		// guest selecting first tile
		this.board.setGuestGateOpen();
	} else {
		this.board.setOpenGatePossibleMoves(player, tile);
	}

	if (!ignoreActuate) {
		this.actuate();
	}
};

SkudPaiShoGameManager.prototype.playerCanBonusPlant = function(player) {
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

SkudPaiShoGameManager.prototype.revealSpecialFlowerPlacementPoints = function(player, tile) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player, tile);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

SkudPaiShoGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

SkudPaiShoGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

SkudPaiShoGameManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	return this.tileManager.aPlayerIsOutOfBasicFlowerTiles();
};

SkudPaiShoGameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

SkudPaiShoGameManager.prototype.getWinner = function() {
	if (this.board.winners.length === 1) {
		return this.board.winners[0];
	} else if (this.board.winners.length > 1) {
		return "BOTH players";
	} else if (this.endGameWinners.length === 1) {
		return this.endGameWinners[0];
	} else if (this.endGameWinners.length > 1 || this.board.winners.length > 1) {
		return "BOTH players";
	}
};

SkudPaiShoGameManager.prototype.getWinReason = function() {
	if (this.board.winners.length === 1) {
		return " created a Harmony Ring and won the game!";
	} else if (this.endGameWinners.length === 1) {
		return " won the game with the most Harmonies crossing the midlines.";
	} else if (this.board.winners.length === 2) {
		return " formed Harmony Rings for a tie!";
	} else if (this.endGameWinners.length === 2) {
		return " had the same number of Harmonies crossing the midlines for a tie!";	// Should there be any other tie breaker?
	}
};

SkudPaiShoGameManager.prototype.getWinResultTypeCode = function() {
	if (this.board.winners.length === 1) {
		return 1;	// Harmony Ring is 1
	} else if (this.endGameWinners.length === 1) {
		if (this.tileManager.getPlayerWithMoreAccentTiles()) {
			return 2;	// More Accent Tiles remaining
		} else {
			return 3;	// Most Harmonies
		}
	} else if (this.endGameWinners.length > 1 || this.board.winners.length > 1) {
		return 4;	// Tie
	}
};

SkudPaiShoGameManager.prototype.getCopy = function() {
	var copyGame = new SkudPaiShoGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
