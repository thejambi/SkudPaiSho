// Adevar Pai Sho Game Manager

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

var AdevarOrientalLilyObjectivePoints = [
	/* Pre-3.9.6 */
	/*
	{
		HOST: [
			new NotationPoint("2,-1"),
			new NotationPoint("0,1"),
			new NotationPoint("7,-1"),
			new NotationPoint("0,6"),
			new NotationPoint("6,5")
		],
		GUEST: [
			new NotationPoint("1,-2"),
			new NotationPoint("-1,0"),
			new NotationPoint("1,-7"),
			new NotationPoint("-6,0"),
			new NotationPoint("-5,-6")
		]
	},
	{
		HOST: [
			new NotationPoint("4,-2"),
			new NotationPoint("-1,3"),
			new NotationPoint("7,-4"),
			new NotationPoint("-3,6"),
			new NotationPoint("5,4")
		],
		GUEST: [
			new NotationPoint("2,-4"),
			new NotationPoint("-3,1"),
			new NotationPoint("4,-7"),
			new NotationPoint("-6,3"),
			new NotationPoint("-4,-5")
		]
	},
	{
		HOST: [
			new NotationPoint("4,-3"),
			new NotationPoint("-2,3"),
			new NotationPoint("2,1"),
			new NotationPoint("5,2"),
			new NotationPoint("3,4"),
			new NotationPoint("5,4")
		],
		GUEST: [
			new NotationPoint("3,-4"),
			new NotationPoint("-3,2"),
			new NotationPoint("-1,-2"),
			new NotationPoint("-2,-5"),
			new NotationPoint("-4,-3"),
			new NotationPoint("-4,-5")
		]
	} */

	/* 3.9.6 Oriental Lily update */
	{	// Garden A
		HOST: [
			new NotationPoint("4,-2"),
			new NotationPoint("-1,3"),
			new NotationPoint("7,-3"),
			new NotationPoint("-2,6"),
			new NotationPoint("3,2"),
			new NotationPoint("6,2"),
			new NotationPoint("3,5")
		],
		GUEST: [
			new NotationPoint("2,-4"),
			new NotationPoint("-3,1"),
			new NotationPoint("3,-7"),
			new NotationPoint("-6,2"),
			new NotationPoint("-2,-3"),
			new NotationPoint("-2,-6"),
			new NotationPoint("-5,-3")
		]
	},
	{	// Garden B
		HOST: [
			new NotationPoint("2,-2"),
			new NotationPoint("-1,1"),
			new NotationPoint("7,-1"),
			new NotationPoint("0,6"),
			new NotationPoint("5,4")
		],
		GUEST: [
			new NotationPoint("2,-2"),
			new NotationPoint("-1,1"),
			new NotationPoint("1,-7"),
			new NotationPoint("-6,0"),
			new NotationPoint("-4,-5")
		]
	},
	{	// Garden C
		HOST: [
			new NotationPoint("4,-3"),
			new NotationPoint("-2,3"),
			new NotationPoint("2,1"),
			new NotationPoint("5,2"),
			new NotationPoint("3,4"),
			new NotationPoint("6,5")
		],
		GUEST: [
			new NotationPoint("3,-4"),
			new NotationPoint("-3,2"),
			new NotationPoint("-1,-2"),
			new NotationPoint("-2,-5"),
			new NotationPoint("-4,-3"),
			new NotationPoint("-5,-6")
		]
	}
];

function AdevarGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new AdevarTileManager();

	this.endGameWinners = [];
	this.capturedTiles = [];
	this.playersWhoHaveCapturedReflection = [];

	this.setup(ignoreActuate);
}

AdevarGameManager.prototype.updateActuator = function(newActuator) {
	this.actuator = newActuator;
};

// Set up the game
AdevarGameManager.prototype.setup = function (ignoreActuate) {

	this.usingTileReserves = false;
	this.disableUndo = false;
	this.gameLogText = "";

	this.secondFaceTilesOnBoardCount = {
		HOST: 0,
		GUEST: 0
	};

	this.secondFaceTilesPlayed = {
		HOST: [],
		GUEST: []
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
AdevarGameManager.prototype.actuate = function (moveToAnimate) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, this.capturedTiles, moveToAnimate);

	setGameLogText(this.gameLogText);
};

AdevarGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	var hiddenTileCaptured = false;
	this.disableUndo = false;

	if (move.moveType === AdevarMoveType.chooseHiddenTile) {
		// Need to do all the game setup as well as set the player's hidden tile
		var hiddenTile = this.tileManager.grabTile(move.player, move.hiddenTileCode);
		hiddenTile.hidden = !gameOptionEnabled(ADEVAR_LITE);
		hiddenTile.selectedFromPile = false;
		
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
		var homeGateTile = self.tileManager.grabTile(move.player, AdevarTileCode.gate);
		homeGateTile.isHomeGate = true;
		this.board.placeTile(homeGateTile, AdevarBoardSetupPoints.gate[move.player]);
		
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
		if (!gameOptionEnabled(ADEVAR_LITE)) {
			this.board.placeTile(self.tileManager.grabTile(move.player, AdevarTileCode.reflection), AdevarBoardSetupPoints.reflection[move.player]);
		}

		this.buildChooseHiddenTileGameLogText(move);
	} else if (move.moveType === DEPLOY) {
		var tile = this.tileManager.grabTile(move.player, move.tileType);
		var placeTileResults = this.board.placeTile(tile, move.endPoint);

		/* Record captured tile */
		if (placeTileResults.capturedTile && !placeTileResults.returnCapturedTileToHand) {
			this.capturedTiles.push(placeTileResults.capturedTile);
		}

		move.placeTileResults = placeTileResults;

		/* Return captured tile to tile reserve if needed */
		if (placeTileResults.capturedTile && placeTileResults.returnCapturedTileToHand) {
			this.tileManager.putTileBack(placeTileResults.capturedTile);
		}

		/* Remove Second Face tiles if player has played their second one */
		if (tile.type === AdevarTileType.secondFace) {
			this.secondFaceTilesOnBoardCount[move.player]++;

			if (!this.secondFaceTilesPlayed[move.player].includes(tile)) {	// If a new SF tile used
				this.secondFaceTilesPlayed[move.player].push(tile);
				if (this.secondFaceTilesPlayed[move.player].length === 2) {
					this.tileManager.removeRemainingTilesOfType(move.player, AdevarTileType.secondFace, this.secondFaceTilesPlayed[move.player]);
				}
			}

			if (this.secondFaceTilesOnBoardCount[move.player] >= 2) {
				// SF already on board, must move back to hand
				var existingSFTile = this.board.getPlayerSFTileThatIsNotThisOne(tile);
				if (existingSFTile) {
					this.tileManager.putTileBack(existingSFTile);
					this.secondFaceTilesOnBoardCount[move.player]--;
				}
			}
		}

		if (placeTileResults.capturedTile && placeTileResults.capturedTile.type === AdevarTileType.reflection) {
			/* Reflection captured, reveal captured tile owner's HT and return player's wrong SF on the board */
			this.disableUndo = true;
			this.board.revealTile(AdevarTileType.hiddenTile, placeTileResults.capturedTile.ownerName);
			move.removedSFInfo = this.board.removeSFThatCannotCaptureHT(move.player, this.playerHiddenTiles[placeTileResults.capturedTile.ownerName]);
			if (move.removedSFInfo.tileRemoved) {
				this.secondFaceTilesOnBoardCount[move.removedSFInfo.tileRemoved.ownerName]--;
				this.tileManager.putTileBack(move.removedSFInfo.tileRemoved);
			}
			this.playersWhoHaveCapturedReflection.push(move.player);
		}

		if (placeTileResults.capturedTile && placeTileResults.capturedTile.type === AdevarTileType.secondFace) {
			this.regrowVanguardsForPlayer(move.player);
			this.secondFaceTilesOnBoardCount[getOpponentName(move.player)]--;
		}

		this.buildDeployGameLogText(move, tile);
	} else if (move.moveType === MOVE) {
		var moveTileResults = this.board.moveTile(move.startPoint, move.endPoint);

		/* Record captured tile */
		if (moveTileResults.capturedTile && !moveTileResults.returnCapturedTileToHand) {
			this.capturedTiles.push(moveTileResults.capturedTile);
		}

		/* Return captured tile to tile reserve if needed */
		if (moveTileResults.capturedTile && moveTileResults.returnCapturedTileToHand) {
			this.tileManager.putTileBack(moveTileResults.capturedTile);
		}

		move.moveTileResults = moveTileResults;

		if (moveTileResults.capturedTile && moveTileResults.capturedTile.type === AdevarTileType.hiddenTile) {
			hiddenTileCaptured = true;
		}

		if (moveTileResults.wrongSFTileAttempt) {
			this.disableUndo = true;

			/* Remove SF tile (move to Captured pile) */
			this.capturedTiles.push(moveTileResults.tileMoved);

			/* Regrow Opponent Vanguards */
			var opponentName = getOpponentName(move.player);
			this.regrowVanguardsForPlayer(opponentName);

			this.secondFaceTilesOnBoardCount[move.player]--;
		}

		if (moveTileResults.capturedTile && moveTileResults.capturedTile.type === AdevarTileType.secondFace) {
			this.regrowVanguardsForPlayer(move.player);
			this.secondFaceTilesOnBoardCount[getOpponentName(move.player)]--;
		}

		if (moveTileResults.capturedTile && moveTileResults.capturedTile.type === AdevarTileType.reflection) {
			/* Reflection captured, reveal captured tile owner's HT and return player's wrong SF on the board */
			this.disableUndo = true;
			this.board.revealTile(AdevarTileType.hiddenTile, moveTileResults.capturedTile.ownerName);
			move.removedSFInfo = this.board.removeSFThatCannotCaptureHT(move.player, this.playerHiddenTiles[moveTileResults.capturedTile.ownerName]);
			if (move.removedSFInfo.tileRemoved) {
				this.secondFaceTilesOnBoardCount[move.removedSFInfo.tileRemoved.ownerName]--;
				this.tileManager.putTileBack(move.removedSFInfo.tileRemoved);
			}
			this.playersWhoHaveCapturedReflection.push(move.player);
		}

		if (moveTileResults.capturedTile && moveTileResults.capturedTile.type === AdevarTileType.hiddenTile) {
			moveTileResults.capturedTile.reveal();
		}

		this.buildMoveGameLogText(move);
	}

	this.board.countTilesInPlots();

	if (hiddenTileCaptured) {
        this.setWinByHiddenTileCaptureForPlayer(move.player);
    } else if (move.moveType !== AdevarMoveType.chooseHiddenTile) {
        this.checkWinForPlayer(move.player, hiddenTileCaptured);
    }

	if (this.endGameWinners.length > 0) {
		this.gameLogText += ". " + this.endGameWinners[0] + this.gameWinReason;
	}

	if (this.endGameWinners.length > 0) {
		// this.board.revealTile(AdevarTileType.hiddenTile, this.endGameWinners[0]);
		this.board.revealTile(AdevarTileType.hiddenTile, HOST);
		this.board.revealTile(AdevarTileType.hiddenTile, GUEST);
	}

	if (withActuate) {
		this.actuate(move);
	}
};

AdevarGameManager.prototype.buildChooseHiddenTileGameLogText = function(move) {
	this.gameLogText = this.getGameLogTextStart(move);
	this.gameLogText += move.player + " selected a Hidden Tile";
};

AdevarGameManager.prototype.buildDeployGameLogText = function(move, calledTile) {
	this.gameLogText = this.getGameLogTextStart(move);
	this.gameLogText += move.player + " called " + AdevarTile.getTileName(calledTile.code);
	if (move.placeTileResults.capturedTile) {
		this.gameLogText += " and captured " + AdevarTile.getTileName(move.placeTileResults.capturedTile.code);
	}
};

AdevarGameManager.prototype.buildMoveGameLogText = function(move) {
	this.gameLogText = this.getGameLogTextStart(move);
	this.gameLogText += move.player + " moved " + AdevarTile.getTileName(move.moveTileResults.tileMoved.code);
	if (move.moveTileResults.capturedTile) {
		this.gameLogText += " and captured " + AdevarTile.getTileName(move.moveTileResults.capturedTile.code);
	}
};

AdevarGameManager.prototype.getGameLogTextStart = function(move) {
	return move.moveNum + move.playerCode + '. ';
};

AdevarGameManager.prototype.regrowVanguardsForPlayer = function(player) {
	var tilesReplaced = this.board.regrowVanguards(player, this.getCapturedVanguardTilesForPlayer(player));
	if (tilesReplaced.length > 0) {
		var self = this;
		tilesReplaced.forEach(function(tile) {
			self.tileManager.putTileBack(tile);
		});
	}
};

AdevarGameManager.prototype.getCapturedVanguardTilesForPlayer = function(player) {
	var capturedVanguardTiles = [];
	for (var i = this.capturedTiles.length - 1; i >= 0; i--) {
		var tile = this.capturedTiles[i];
		if (tile.type === AdevarTileType.vanguard && tile.ownerName === player) {
			capturedVanguardTiles.push(tile);
			this.capturedTiles.splice(i, 1);
		}
	}
	return capturedVanguardTiles;
};

AdevarGameManager.prototype.revealAllPointsAsPossible = function() {
	this.board.setAllPointsAsPossible();
	this.actuate();
};

AdevarGameManager.prototype.revealDeployPoints = function(tile, ignoreActuate) {
	if (tile.type !== AdevarTileType.secondFace
		|| (tile.type === AdevarTileType.secondFace && this.opponentNonMatchingHTNotRevealed(tile))
	) {
		this.board.setPossibleDeployPoints(tile);
	}

	if (!ignoreActuate) {
		this.actuate();
	}
};

AdevarGameManager.prototype.opponentNonMatchingHTNotRevealed = function(sfTile) {
	var opponent = getOpponentName(sfTile.ownerName);
	return this.playerHiddenTiles[opponent].hidden
		|| AdevarTile.hiddenTileMatchesSecondFace(this.playerHiddenTiles[opponent], sfTile);
}

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

AdevarGameManager.prototype.setWinByHiddenTileCaptureForPlayer = function(player) {
	this.endGameWinners.push(player);
	this.gameWinReason = " has captured the opponent's Hidden Tile and won the game!";
};

AdevarGameManager.prototype.checkWinForPlayer = function(player) {
	var hiddenTile = this.playerHiddenTiles[player];
	if (!hiddenTile) {
		return;
	}

	var hasWin = false;

	switch(hiddenTile.code) {
		case AdevarTileCode.iris:
			/* Objective: Have 2 tiles in each Red Plot, and 3 tiles in each White Plot */
			hasWin = this.board.playerHasFullRedAndWhitePlots(player);
			break;
		case AdevarTileCode.orientalLily:
			hasWin = this.playerHasOrientalLilyWin(player);
			break;
		case AdevarTileCode.echeveria:
			hasWin = this.playerHasEcheveriaWin(player);
			break;
		case AdevarTileCode.whiteRose:
			hasWin = this.playerHasWhiteRoseWin(player);
			break;
		case AdevarTileCode.whiteLotus:
			hasWin = this.playerHasWhiteLotusWin(player);
			break;
		case AdevarTileCode.birdOfParadise:
			/* Objective: At least one Basic tile in every Plot */
			hasWin = this.board.playerHasBasicTileInEveryPlot(player);
			break;
		case AdevarTileCode.blackOrchid:
			hasWin = this.hasBlackOrchidWin(player);
			break;
		default:
			debug("No Hidden Tile Objective");
	}

	if (hasWin) {
		this.endGameWinners.push(player);
	}

	if (this.endGameWinners.length > 0) {
		this.gameWinReason = " has completed their objective and won the game!";
	}
};

AdevarGameManager.prototype.hasBlackOrchidWin = function(player) {
	/* Objective: [Beta] Call a Gate completely in opponent's starting Neutral Plot */
	// return this.board.playerHasGateInOpponentNeutralPlot(player);

	/* Objective: Have more tiles in each plot (except opponent's starting Neutral Plot) than opponent */
	//if (gameOptionEnabled(BLACK_ORCHID_BUFF)) {
		return this.board.playerHasEqualOrMoreBasicTilesInEachNonOwnedPlot(player);
//	}
//	else {
//		return this.board.playerHasMoreBasicTilesInEachNonOwnedPlot(player);
//	}
	// return this.board.playerHasMoreBasicTilesInEachNonOwnedNonRedPlot(player);
};

AdevarGameManager.prototype.playerHasWhiteLotusWin = function(player) {
	/* Objective: Form Skud Pai Sho-esque Harmony Ring with Basic tiles (3 - 4 - 5 order for Harmony Circle) */
	return this.board.analyzeHarmoniesForPlayer(player);
};

AdevarGameManager.prototype.playerHasOrientalLilyWin = function(player) {
	/* Objective: Create an Oriental Lily Garden formation with Basic tiles */
	var hasCompletedObjective = false;
	var self = this;
	AdevarOrientalLilyObjectivePoints.forEach(function(objectivePointsSet) {
		var objectivePoints = objectivePointsSet[player];
		var hasAllObjectivePoints = objectivePoints.length > 0;
		objectivePoints.forEach(function(notationPoint) {
			if (!self.board.playerHasTileOfTypeAtPoint(player, notationPoint, AdevarTileType.basic)) {
				hasAllObjectivePoints = false;
			}
		});
		if (hasAllObjectivePoints) {
			hasCompletedObjective = true;
		}
	});

	return hasCompletedObjective;
};

AdevarGameManager.prototype.playerHasWhiteRoseWin = function(player) {
	/* Objective: [Old] Capture opponent's Reflection tile */
	// return this.playersWhoHaveCapturedReflection.includes(player);

	/* Objective: [Beta] Call a Gate completely in opponent's starting Neutral Plot */
	return this.board.playerHasGateInOpponentNeutralPlot(player);
};

AdevarGameManager.prototype.playerHasEcheveriaWin = function(player) {
	/* Objective: Capture at least 2 of each of your opponent’s basic tile types, 
		as well as to have at least 1 of each of your basic tile types be captured */
	var playerHasWin = false;

	var capturedFriendlyTileCounts = {};
	var capturedEnemyTileCounts = {};

	this.capturedTiles.forEach(function(capturedTile) {
		if (capturedTile.ownerName === player) {
			// Friendly tile
			if (!capturedFriendlyTileCounts[capturedTile.code]) {
				capturedFriendlyTileCounts[capturedTile.code] = 1;
			} else {
				capturedFriendlyTileCounts[capturedTile.code]++;
			}
		} else {
			// Enemy tile
			if (!capturedEnemyTileCounts[capturedTile.code]) {
				capturedEnemyTileCounts[capturedTile.code] = 1;
			} else {
				capturedEnemyTileCounts[capturedTile.code]++;
			}
		}
	});

	playerHasWin = capturedFriendlyTileCounts[AdevarTileCode.lilac]
				&& capturedFriendlyTileCounts[AdevarTileCode.lilac] >= 1
			&& capturedFriendlyTileCounts[AdevarTileCode.zinnia]
				&& capturedFriendlyTileCounts[AdevarTileCode.zinnia] >= 1
			&& capturedFriendlyTileCounts[AdevarTileCode.foxglove]
				&& capturedFriendlyTileCounts[AdevarTileCode.foxglove] >= 1
			&& capturedEnemyTileCounts[AdevarTileCode.lilac]
				&& capturedEnemyTileCounts[AdevarTileCode.lilac] >= 2
			&& capturedEnemyTileCounts[AdevarTileCode.zinnia]
				&& capturedEnemyTileCounts[AdevarTileCode.zinnia] >= 2
			&& capturedEnemyTileCounts[AdevarTileCode.foxglove]
				&& capturedEnemyTileCounts[AdevarTileCode.foxglove] >= 2;

	return playerHasWin;
};

AdevarGameManager.prototype.getWinner = function() {
	if (this.endGameWinners.length === 1) {
		return this.endGameWinners[0];
	}
};

AdevarGameManager.prototype.getWinReason = function() {
	if (this.endGameWinners.length === 1) {
		return this.gameWinReason;
	}
};

AdevarGameManager.prototype.getWinResultTypeCode = function() {
	if (this.endGameWinners.length === 1) {
		return 1;
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
