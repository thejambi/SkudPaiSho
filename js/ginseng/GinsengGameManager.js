// Trifle Game Manager

Ginseng.GameManager = function(actuator, ignoreActuate, isCopy) {
	this.gameLogText = '';
	this.isCopy = isCopy;

	this.actuator = actuator;

	Trifle.tileId = 1;
	this.tileManager = new Ginseng.TileManager();
	this.markingManager = new PaiShoMarkingManager();

	this.setup(ignoreActuate);
};

Ginseng.GameManager.prototype.updateActuator = function(newActuator) {
	this.actuator = newActuator;
};

// Set up the game
Ginseng.GameManager.prototype.setup = function (ignoreActuate) {
	this.board = new PaiShoGames.Board(this.tileManager, this.buildAbilityActivationOrder());
	this.board.useBannerCaptureSystem = false;
	this.winners = [];
	this.hostBannerPlayed = false;
	this.guestBannerPlayed = false;

	/* Initial setup */
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.WhiteLotus), new NotationPoint("8,0"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Koi), new NotationPoint("7,-1"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Dragon), new NotationPoint("7,1"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Badgermole), new NotationPoint("6,-2"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Bison), new NotationPoint("6,2"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.LionTurtle), new NotationPoint("4,0"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Wheel), new NotationPoint("5,-3"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Wheel), new NotationPoint("5,3"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Ginseng), new NotationPoint("4,-4"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Ginseng), new NotationPoint("4,4"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Orchid), new NotationPoint("4,-5"));
	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng.TileCodes.Orchid), new NotationPoint("4,5"));

	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.WhiteLotus), new NotationPoint("-8,0"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Koi), new NotationPoint("-7,1"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Dragon), new NotationPoint("-7,-1"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Badgermole), new NotationPoint("-6,2"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Bison), new NotationPoint("-6,-2"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.LionTurtle), new NotationPoint("-4,0"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Wheel), new NotationPoint("-5,-3"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Wheel), new NotationPoint("-5,3"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Ginseng), new NotationPoint("-4,-4"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Ginseng), new NotationPoint("-4,4"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Orchid), new NotationPoint("-4,-5"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng.TileCodes.Orchid), new NotationPoint("-4,5"));

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
Ginseng.GameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, this.markingManager);
	setGameLogText(this.gameLogText);
};

Ginseng.GameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Runining Move:");
	debug(move);

	this.board.tickDurationAbilities();

	var neededPromptInfo;

	if (move.moveType === DEPLOY) {
		var tile = this.tileManager.grabTile(move.player, move.tileType);
		var placeTileResults = this.board.placeTile(tile, move.endPoint);
		this.tileManager.addToCapturedTiles(placeTileResults.capturedTiles);
		this.buildDeployGameLogText(move, tile);
	} else if (move.moveType === MOVE) {
		var moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint, move);
		this.tileManager.addToCapturedTiles(moveDetails.capturedTiles);

		var abilityActivationFlags = moveDetails.abilityActivationFlags;
		debug(abilityActivationFlags);

		if (abilityActivationFlags.tileRecords) {
			if (abilityActivationFlags.tileRecords.capturedTiles && abilityActivationFlags.tileRecords.capturedTiles.length) {
				this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.capturedTiles);
			}
			if (abilityActivationFlags.tileRecords.tilesMovedToPiles && abilityActivationFlags.tileRecords.tilesMovedToPiles.length) {
				this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.tilesMovedToPiles);
			}
		}

		var needToPromptUser = abilityActivationFlags && abilityActivationFlags.neededPromptInfo && abilityActivationFlags.neededPromptInfo.currentPromptTargetId;
		if (needToPromptUser) {
			neededPromptInfo = abilityActivationFlags.neededPromptInfo;
		}

		this.buildMoveGameLogText(move, moveDetails);

		this.checkForWin();
	} else if (move.moveType === DRAW_ACCEPT) {
		this.gameHasEndedInDraw = true;
	}

	if (withActuate) {
		this.actuate();
	}

	return neededPromptInfo;
};

Ginseng.GameManager.prototype.buildTeamSelectionGameLogText = function(move) {
	// this.gameLogText = move.player + " selected their team";
};
Ginseng.GameManager.prototype.buildDeployGameLogText = function(move, tile) {
	// this.gameLogText = move.player + ' placed ' + Trifle.Tile.getTileName(tile.code) + ' at ' + move.endPoint.pointText;
};
Ginseng.GameManager.prototype.buildMoveGameLogText = function(move, moveDetails) {
	/* this.gameLogText = move.player + ' moved ' + Trifle.Tile.getTileName(moveDetails.movedTile.code) + ' from ' + move.startPoint.pointText + ' to ' + move.endPoint.pointText;
	if (moveDetails.capturedTiles && moveDetails.capturedTiles.length > 0) {
		this.gameLogText += ' and captured ' + getOpponentName(move.player) + '\'s ';// + Trifle.Tile.getTileName(moveDetails.capturedTile.code);
		var first = true;
		moveDetails.capturedTiles.forEach(function(capturedTile) {
			if (!first) {
				this.gameLogText += ',';
			} else {
				first = false;
			}
			this.gameLogText += Trifle.Tile.getTileName(capturedTile.code);
		});
	} */
};

Ginseng.GameManager.prototype.checkForWin = function() {
	var hostLotusPoints = this.board.getTilePoints(Ginseng.TileCodes.WhiteLotus, HOST);
	var guestLotusPoints = this.board.getTilePoints(Ginseng.TileCodes.WhiteLotus, GUEST);
	if (hostLotusPoints.length === 1) {
		var hostLotusPoint = hostLotusPoints[0];
		var hostLotusRowAndCol = new RowAndColumn(hostLotusPoint.row, hostLotusPoint.col);
		if (hostLotusRowAndCol.x < 0) {
			this.winners.push(HOST);
		}
	}

	if (guestLotusPoints.length === 1) {
		var guestLotusPoint = guestLotusPoints[0];
		var guestLotusRowAndCol = new RowAndColumn(guestLotusPoint.row, guestLotusPoint.col);
		if (guestLotusRowAndCol.x > 0) {
			this.winners.push(GUEST);
		}
	}
};

Ginseng.GameManager.prototype.playersAreSelectingTeams = function() {
	return this.tileManager.playersAreSelectingTeams();
};

Ginseng.GameManager.prototype.getPlayerTeamSelectionTileCodeList = function(player) {
	var team = this.tileManager.getPlayerTeam(player);
	var codeList = [];
	team.forEach(function(tile){
		codeList.push(tile.code);
	});
	return codeList.toString();
};

Ginseng.GameManager.prototype.addTileToTeam = function(tile) {
	var addedOk = this.tileManager.addToTeamIfOk(tile);
	if (addedOk) {
		this.actuate();
	}
	return this.tileManager.playerTeamIsFull(tile.ownerName);
};

Ginseng.GameManager.prototype.removeTileFromTeam = function(tile) {
	this.tileManager.removeTileFromTeam(tile);
	this.actuate();
};

Ginseng.GameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

Ginseng.GameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

Ginseng.GameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

Ginseng.GameManager.prototype.revealDeployPoints = function(tile, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(tile);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

Ginseng.GameManager.prototype.getWinner = function() {
	if (this.winners.length === 1) {
		return this.winners[0];
	}
};

Ginseng.GameManager.prototype.getWinReason = function() {
	return " won the game!";
};

Ginseng.GameManager.prototype.getWinResultTypeCode = function() {
	if (this.winners.length === 1) {
		return 1;	// Standard win is 1
	} else if (this.gameHasEndedInDraw) {
		return 4;	// Tie/Draw is 4
	}
};

Ginseng.GameManager.prototype.buildAbilityActivationOrder = function() {
	return [
		Trifle.AbilityName.recordTilePoint,
		Trifle.AbilityName.moveTileToRecordedPoint,
		Trifle.AbilityName.cancelAbilities,
		Trifle.AbilityName.cancelAbilitiesTargetingTiles,
		Trifle.AbilityName.protectFromCapture,
		Trifle.AbilityName.moveTargetTile
	];
};

Ginseng.GameManager.prototype.buildAbilitySummaryLines = function() {
	var abilitySummaryLines = [];
	this.board.abilityManager.abilities.forEach((abilityObject) => {
		if (abilityObject.activated) {
			abilitySummaryLines = abilitySummaryLines.concat(abilityObject.getSummaryLines());
		}
	});

	return abilitySummaryLines;
};

Ginseng.GameManager.prototype.getCopy = function() {
	var copyGame = new Ginseng.GameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
