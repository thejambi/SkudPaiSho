// Skud Pai Sho Game Manager

function FirePaiShoGameManager(actuator, ignoreActuate, isCopy) {
	this.gameLogText = '';
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new FirePaiShoTileManager();

	this.setup(ignoreActuate);
	this.endGameWinners = [];
}


FirePaiShoGameManager.prototype.updateActuator = function(newActuator) {
	this.actuator = newActuator;
};

// Set up the game
FirePaiShoGameManager.prototype.setup = function (ignoreActuate) {
	this.board = new FirePaiShoBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
FirePaiShoGameManager.prototype.actuate = function (moveToAnimate, moveAnimationBeginStep) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, moveToAnimate, moveAnimationBeginStep);
	setGameLogText(this.gameLogText);
};

FirePaiShoGameManager.prototype.runNotationMove = function(move, withActuate, moveAnimationBeginStep) {
	//console.log("Running Move(" + (withActuate ? "" : "Not ") + "Actuated): " + move.fullMoveText);

	var errorFound = false;
	var bonusAllowed = false;

	/** 
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
*/
	if (move.moveType === PLANTING) {
//		// // Check if valid plant
//		if (!this.board.pointIsOpenGate(move.endPoint)) {
//			// invalid
//			console("Invalid planting point: " + move.endPoint.pointText);
//			errorFound = true;
//			return false;
//		}
		// Just placing tile on board
		var bonus = move.hasHarmonyBonus();

		var tile = this.tileManager.grabTile(move.player, move.plantedFlowerType, false);

		moveResults = this.board.placeTile(tile, move.endPoint, this.tileManager);
		
		//console.log("planting");
		//console.log("Bonus allowed: " + bonusAllowed);
		//console.log("Has harmony bonus: " + move.hasHarmonyBonus());

		
		if (bonus) {
			//console.log("about to grab a tile:" + move.playerCode + ", " + move.bonusTileCode);

			var tile = this.tileManager.grabTile(move.player, move.bonusTileCode, true);
			move.accentTileUsed = tile;
			if (move.boatBonusPoint) {
				this.board.placeTile(tile, move.bonusEndPoint, this.tileManager, move.boatBonusPoint);
			} else {
				placeTileResult = this.board.placeTile(tile, move.bonusEndPoint, this.tileManager);
				if (placeTileResult && placeTileResult.tileRemovedWithBoat) {
					move.tileRemovedWithBoat = placeTileResult.tileRemovedWithBoat;
				}
			}
		}
		 else if (!moveResults.bonusAllowed && move.hasHarmonyBonus()) {
			debug("BONUS NOT ALLOWED so I won't give it to you!");
			errorFound = true;
		}
		else {
			bonusAllowed = moveResults.newHarmony;
		}

		this.buildPlantingGameLogText(move, tile, moveResults);
	} else if (move.moveType === ARRANGING) {
		moveResults = this.board.moveTile(move.player, move.startPoint, move.endPoint);
		bonusAllowed = moveResults.bonusAllowed;
		//console.log("moving");
		//console.log("Bonus allowed: " + bonusAllowed);
		//console.log("Has harmony bonus: " + move.hasHarmonyBonus());

		move.capturedTile = moveResults.capturedTile;

		if (moveResults.bonusAllowed && move.hasHarmonyBonus()) {
			var tile = this.tileManager.grabTile(move.player, move.bonusTileCode, true);
			move.accentTileUsed = tile;
			if (move.boatBonusPoint) {
				this.board.placeTile(tile, move.bonusEndPoint, this.tileManager, move.boatBonusPoint);
			} else {
				placeTileResult = this.board.placeTile(tile, move.bonusEndPoint, this.tileManager);
				if (placeTileResult && placeTileResult.tileRemovedWithBoat) {
					move.tileRemovedWithBoat = placeTileResult.tileRemovedWithBoat;
				}
			}
		}
		
		else if (!moveResults.bonusAllowed && move.hasHarmonyBonus()) {
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
		// If no harmony ring winners, check for player out of reserve tiles
		var playerOutOfTiles = this.aPlayerIsOutOfReserveTiles();
		//console.log(playerOutOfTiles);
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

FirePaiShoGameManager.prototype.buildChooseAccentTileGameLogText = function(move) {
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' chose Accent Tiles ' + move.accentTiles;
};
FirePaiShoGameManager.prototype.buildPlantingGameLogText = function(move, tile, moveResults) {
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' Planted ' + tile.getName() + ' at ' + move.endPoint.pointText;
	
	if (moveResults.bonusAllowed && move.hasHarmonyBonus()) {
		this.gameLogText += ' and used ' + FirePaiShoTile.getTileName(move.bonusTileCode) + ' on Harmony Bonus';
	}
};
FirePaiShoGameManager.prototype.buildArrangingGameLogText = function(move, moveResults) {
	if (!moveResults) {
		return "Invalid Move :(";
	}
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' moved ' + moveResults.movedTile.getName() + ' ' + move.moveTextOnly;
	if (moveResults.capturedTile) {
		this.gameLogText += ' to capture ' + getOpponentName(move.player) + '\'s ' + moveResults.capturedTile.getName();
	}
	if (moveResults.bonusAllowed && move.hasHarmonyBonus()) {
		this.gameLogText += ' and used ' + FirePaiShoTile.getTileName(move.bonusTileCode) + ' on Harmony Bonus';
	}
};

FirePaiShoGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);

	if (!ignoreActuate) {
		this.actuate();
	}
};

FirePaiShoGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate, moveToAnimate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate(moveToAnimate);
	}
};

FirePaiShoGameManager.prototype.revealOpenGates = function(player, tile, moveNum, ignoreActuate) {
//	if (!gameOptionEnabled(OPTION_INFORMAL_START) && moveNum === 2) {
//		// guest selecting first tile
//		this.board.setGuestGateOpen();
//	} else {
		this.board.setOpenGatePossibleMoves(player, tile);
//	}

	if (!ignoreActuate) {
		this.actuate();
	}
};

FirePaiShoGameManager.prototype.playerCanBonusPlant = function(player) {
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

FirePaiShoGameManager.prototype.revealSpecialFlowerPlacementPoints = function(player, tile) {
	if (!newSpecialFlowerRules) {
		this.revealOpenGates(player, tile);
		return;
	}

	this.board.revealSpecialFlowerPlacementPoints(player);
	this.actuate();
};

FirePaiShoGameManager.prototype.revealPossiblePlacementPoints = function(tile) {
	this.board.revealPossiblePlacementPoints(tile);
	this.actuate();
};

FirePaiShoGameManager.prototype.revealFirstMovePlacement = function(tile) {
	this.board.revealFirstMovePlacement();
	this.actuate();
};

FirePaiShoGameManager.prototype.revealBoatBonusPoints = function(boardPoint) {
	this.board.revealBoatBonusPoints(boardPoint);
	this.actuate();
};

FirePaiShoGameManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	return this.tileManager.aPlayerIsOutOfBasicFlowerTiles();
};

FirePaiShoGameManager.prototype.aPlayerIsOutOfReserveTiles = function() {
	return this.tileManager.aPlayerIsOutOfReserveTiles();
};

FirePaiShoGameManager.prototype.playerHasNotPlayedEitherSpecialTile = function(playerName) {
	return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
};

FirePaiShoGameManager.prototype.getWinner = function() {
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

FirePaiShoGameManager.prototype.getWinReason = function() {
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

FirePaiShoGameManager.prototype.getWinResultTypeCode = function() {
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

FirePaiShoGameManager.prototype.getCopy = function() {
	var copyGame = new FirePaiShoGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};

FirePaiShoGameManager.prototype.drawReserveTileFromTileManager = function(playerName) {
	return this.tileManager.drawReserveTile(playerName);
};

FirePaiShoGameManager.prototype.clearDrawnReserveTile = function() {
	return this.tileManager.clearDrawnReserveTile();
};