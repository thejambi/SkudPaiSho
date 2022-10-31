// // Ginseng Game Manager

// Ginseng2.GameManager = function(actuator, ignoreActuate, isCopy) {
// 	this.gameLogText = '';
// 	this.isCopy = isCopy;

// 	this.actuator = actuator;

// 	Trifle.tileId = 1;
// 	this.tileManager = new Ginseng.TileManager();
// 	this.markingManager = new PaiShoMarkingManager();

// 	this.setup(ignoreActuate);
// };

// Ginseng2.GameManager.prototype.updateActuator = function(newActuator) {
// 	this.actuator = newActuator;
// };

// // Set up the game
// Ginseng2.GameManager.prototype.setup = function (ignoreActuate) {
// 	this.board = new PaiShoGames.Board(this.tileManager, this.buildAbilityActivationOrder());
// 	this.board.useBannerCaptureSystem = false;
// 	this.winners = [];
// 	this.hostBannerPlayed = false;
// 	this.guestBannerPlayed = false;

// 	// Initial setup?
// 	this.gameHasSetupMove = false;
// 	this.doBoardSetup(0);

// 	// Update the actuator
// 	if (!ignoreActuate) {
// 		this.actuate();
// 	}
// };

// // Sends the updated board to the actuator
// Ginseng2.GameManager.prototype.actuate = function(moveToAnimate, moveDetails) {
// 	if (this.isCopy) {
// 		return;
// 	}
// 	this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate, moveDetails);
// 	setGameLogText(this.gameLogText);
// };

// Ginseng2.GameManager.prototype.runNotationMove = function(move, withActuate, moveAnimationBeginStep_unused, skipAnimation) {
// 	debug("Running Move:");
// 	debug(move);

// 	this.board.tickDurationAbilities();

// 	var neededPromptInfo;

// 	var moveDetails;

// 	if (move.moveType === SETUP) {
// 		this.doBoardSetup(move.setupNum);
// 	} else if (move.moveType === MOVE) {
// 		moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint, move);
// 		this.tileManager.addToCapturedTiles(moveDetails.capturedTiles);

// 		var abilityActivationFlags = moveDetails.abilityActivationFlags;
// 		debug(abilityActivationFlags);

// 		if (abilityActivationFlags.tileRecords) {
// 			if (abilityActivationFlags.tileRecords.capturedTiles && abilityActivationFlags.tileRecords.capturedTiles.length) {
// 				this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.capturedTiles);
// 			}
// 			if (abilityActivationFlags.tileRecords.tilesMovedToPiles && abilityActivationFlags.tileRecords.tilesMovedToPiles.length) {
// 				this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.tilesMovedToPiles);
// 			}
// 		}

// 		var needToPromptUser = abilityActivationFlags && abilityActivationFlags.neededPromptInfo && abilityActivationFlags.neededPromptInfo.currentPromptTargetId;
// 		if (needToPromptUser) {
// 			neededPromptInfo = abilityActivationFlags.neededPromptInfo;
// 		}

// 		this.buildMoveGameLogText(move, moveDetails);

// 		this.checkForWin();
// 	} else if (move.moveType === DRAW_ACCEPT) {
// 		this.gameHasEndedInDraw = true;
// 	}

// 	/* if (withActuate && neededPromptInfo) {
// 		this.actuate();
// 	} else  */
// 	if (withActuate && !skipAnimation) {
// 		this.actuate(move, moveDetails);
// 	}

// 	return neededPromptInfo;
// };

// Ginseng2.GameManager.prototype.buildMoveGameLogText = function(move, moveDetails) {
// 	var startPoint = new NotationPoint(move.startPoint);
// 	var endPoint = new NotationPoint(move.endPoint);
// 	var startPointDisplay = Ginseng2.NotationAdjustmentFunction(startPoint.rowAndColumn.row, startPoint.rowAndColumn.col);
// 	var endPointDisplay = Ginseng2.NotationAdjustmentFunction(endPoint.rowAndColumn.row, endPoint.rowAndColumn.col);

// 	var moveNumLabel = move.moveNum + "" + getPlayerCodeFromName(move.player);

// 	this.gameLogText = moveNumLabel + ". " + move.player + ' moved ' + Trifle.Tile.getTileName(moveDetails.movedTile.code) + ' from ' + startPointDisplay + ' to ' + endPointDisplay;
// 	if (moveDetails.capturedTiles && moveDetails.capturedTiles.length > 0) {
// 		this.gameLogText += ' and captured ' + getOpponentName(move.player) + '\'s ';// + Trifle.Tile.getTileName(moveDetails.capturedTile.code);
// 		var first = true;
// 		moveDetails.capturedTiles.forEach(capturedTile => {
// 			if (!first) {
// 				this.gameLogText += ', ';
// 			} else {
// 				first = false;
// 			}
// 			this.gameLogText += Trifle.Tile.getTileName(capturedTile.code);
// 		});
// 	}
// 	if (moveDetails.abilityActivationFlags && moveDetails.abilityActivationFlags.tileRecords
// 		&& moveDetails.abilityActivationFlags.tileRecords.capturedTiles
// 		&& moveDetails.abilityActivationFlags.tileRecords.capturedTiles.length > 0) {
// 		this.gameLogText += "; ";
// 		var first = true;
// 		moveDetails.abilityActivationFlags.tileRecords.capturedTiles.forEach(movedTile => {
// 			if (!first) {
// 				this.gameLogText += ", ";
// 			} else {
// 				first = false;
// 			}
// 			this.gameLogText += movedTile.ownerName + "'s " + Trifle.Tile.getTileName(movedTile.code);
// 		});
// 		this.gameLogText += " moved to captured pile";
// 	}
// 	if (moveDetails.abilityActivationFlags && moveDetails.abilityActivationFlags.tileRecords
// 		&& moveDetails.abilityActivationFlags.tileRecords.tilesMovedToPiles
// 		&& moveDetails.abilityActivationFlags.tileRecords.tilesMovedToPiles.length > 0) {
// 		this.gameLogText += "; ";
// 		var first = true;
// 		moveDetails.abilityActivationFlags.tileRecords.tilesMovedToPiles.forEach(movedTile => {
// 			if (!first) {
// 				this.gameLogText += ", ";
// 			} else {
// 				first = false;
// 			}
// 			this.gameLogText += movedTile.ownerName + "'s " + Trifle.Tile.getTileName(movedTile.code);
// 		});
// 		this.gameLogText += " banished";
// 	}

// 	if (move.promptTargetData) {
// 		Object.keys(move.promptTargetData).forEach((key, index) => {
// 			var promptDataEntry = move.promptTargetData[key];
// 			var keyObject = JSON.parse(key);
// 			if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
// 				var movedTilePointRowAndCol = promptDataEntry.movedTilePoint.rowAndColumn;
// 				var movedTileDestinationRowAndCol = promptDataEntry.movedTileDestinationPoint.rowAndColumn;
// 				this.gameLogText += "; Push: ";
// 				this.gameLogText += "(" + Ginseng2.NotationAdjustmentFunction(movedTilePointRowAndCol.row, movedTilePointRowAndCol.col) + ")-";
// 				this.gameLogText += "(" + Ginseng2.NotationAdjustmentFunction(movedTileDestinationRowAndCol.row, movedTileDestinationRowAndCol.col) + ")";
// 			} else if (promptDataEntry.chosenCapturedTile) {
// 				this.gameLogText += "; Exchange with: " + Trifle.Tile.getTileName(promptDataEntry.chosenCapturedTile.code);
// 			} else {
// 				this.gameLogText += " Ability?";
// 			}
// 		});
// 	}
// };

// Ginseng2.GameManager.prototype.checkForWin = function() {
// 	var hostLotusPoints = this.board.getTilePoints(Ginseng2.TileCodes.WhiteLotus, HOST);
// 	var guestLotusPoints = this.board.getTilePoints(Ginseng2.TileCodes.WhiteLotus, GUEST);
// 	if (hostLotusPoints.length === 1) {
// 		var hostLotusPoint = hostLotusPoints[0];
// 		var hostLotusRowAndCol = new RowAndColumn(hostLotusPoint.row, hostLotusPoint.col);
// 		if (hostLotusRowAndCol.x < 0) {
// 			this.winners.push(HOST);
// 		}
// 	}

// 	if (guestLotusPoints.length === 1) {
// 		var guestLotusPoint = guestLotusPoints[0];
// 		var guestLotusRowAndCol = new RowAndColumn(guestLotusPoint.row, guestLotusPoint.col);
// 		if (guestLotusRowAndCol.x > 0) {
// 			this.winners.push(GUEST);
// 		}
// 	}
// };

// Ginseng2.GameManager.prototype.playersAreSelectingTeams = function() {
// 	return this.tileManager.playersAreSelectingTeams();
// };

// Ginseng2.GameManager.prototype.getPlayerTeamSelectionTileCodeList = function(player) {
// 	var team = this.tileManager.getPlayerTeam(player);
// 	var codeList = [];
// 	team.forEach(function(tile){
// 		codeList.push(tile.code);
// 	});
// 	return codeList.toString();
// };

// Ginseng2.GameManager.prototype.addTileToTeam = function(tile) {
// 	var addedOk = this.tileManager.addToTeamIfOk(tile);
// 	if (addedOk) {
// 		this.actuate();
// 	}
// 	return this.tileManager.playerTeamIsFull(tile.ownerName);
// };

// Ginseng2.GameManager.prototype.removeTileFromTeam = function(tile) {
// 	this.tileManager.removeTileFromTeam(tile);
// 	this.actuate();
// };

// Ginseng2.GameManager.prototype.hasEnded = function() {
// 	return this.getWinResultTypeCode() > 0;
// };

// Ginseng2.GameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
// 	if (!boardPoint.hasTile()) {
// 		return;
// 	}
// 	this.board.setPossibleMovePoints(boardPoint);
	
// 	if (!ignoreActuate) {
// 		this.actuate();
// 	}
// };

// Ginseng2.GameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
// 	this.board.removePossibleMovePoints();
// 	this.tileManager.removeSelectedTileFlags();
// 	if (!ignoreActuate) {
// 		this.actuate();
// 	}
// };

// Ginseng2.GameManager.prototype.revealDeployPoints = function(tile, ignoreActuate) {
// 	this.board.setDeployPointsPossibleMoves(tile);
	
// 	if (!ignoreActuate) {
// 		this.actuate();
// 	}
// };

// Ginseng2.GameManager.prototype.getWinner = function() {
// 	if (this.winners.length === 1) {
// 		return this.winners[0];
// 	}
// };

// Ginseng2.GameManager.prototype.getWinReason = function() {
// 	return " won the game!";
// };

// Ginseng2.GameManager.prototype.getWinResultTypeCode = function() {
// 	if (this.winners.length === 1) {
// 		return 1;	// Standard win is 1
// 	} else if (this.gameHasEndedInDraw) {
// 		return 4;	// Tie/Draw is 4
// 	}
// };

// Ginseng2.GameManager.prototype.buildAbilityActivationOrder = function() {
// 	return [
// 		Trifle.AbilityName.recordTilePoint,
// 		Trifle.AbilityName.moveTileToRecordedPoint,
// 		Trifle.AbilityName.cancelAbilities,
// 		Trifle.AbilityName.cancelAbilitiesTargetingTiles,
// 		Trifle.AbilityName.protectFromCapture,
// 		Trifle.AbilityName.moveTargetTile
// 	];
// };

// Ginseng2.GameManager.prototype.buildAbilitySummaryLines = function() {
// 	var abilitySummaryLines = [];
// 	this.board.abilityManager.abilities.forEach((abilityObject) => {
// 		if (abilityObject.activated) {
// 			abilitySummaryLines = abilitySummaryLines.concat(abilityObject.getSummaryLines());
// 		}
// 	});

// 	return abilitySummaryLines;
// };

// Ginseng2.GameManager.prototype.doBoardSetup = function(setupNum) {
// 	/* Remove all tiles from board, then set up board. */
// 	this.board.forEachBoardPointWithTile(boardPoint => {
// 		this.tileManager.putTileBack(boardPoint.removeTile());
// 	});

// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.WhiteLotus), new NotationPoint("8,0"));
// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Koi), new NotationPoint("7,-1"));
// 	if (setupNum === 1 || gameOptionEnabled(SWAP_BISON_AND_DRAGON)) {
// 		this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Bison), new NotationPoint("7,1"));
// 	} else {
// 		this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Dragon), new NotationPoint("7,1"));
// 	}
// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Badgermole), new NotationPoint("6,-2"));
// 	if (setupNum === 1 || gameOptionEnabled(SWAP_BISON_AND_DRAGON)) {
// 		this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Dragon), new NotationPoint("6,2"));
// 	} else {
// 		this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Bison), new NotationPoint("6,2"));
// 	}
// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.LionTurtle), new NotationPoint("4,0"));
// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Wheel), new NotationPoint("5,-3"));
// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Wheel), new NotationPoint("5,3"));
// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Ginseng), new NotationPoint("4,-4"));
// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Ginseng), new NotationPoint("4,4"));
// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Orchid), new NotationPoint("4,-5"));
// 	this.board.placeTile(this.tileManager.grabTile(HOST, Ginseng2.TileCodes.Orchid), new NotationPoint("4,5"));

// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.WhiteLotus), new NotationPoint("-8,0"));
// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Koi), new NotationPoint("-7,1"));
// 	if (setupNum === 1 || gameOptionEnabled(SWAP_BISON_AND_DRAGON)) {
// 		this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Bison), new NotationPoint("-7,-1"));
// 	} else {
// 		this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Dragon), new NotationPoint("-7,-1"));
// 	}
// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Badgermole), new NotationPoint("-6,2"));
// 	if (setupNum === 1 || gameOptionEnabled(SWAP_BISON_AND_DRAGON)) {
// 		this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Dragon), new NotationPoint("-6,-2"));
// 	} else {
// 		this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Bison), new NotationPoint("-6,-2"));
// 	}
// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.LionTurtle), new NotationPoint("-4,0"));
// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Wheel), new NotationPoint("-5,-3"));
// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Wheel), new NotationPoint("-5,3"));
// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Ginseng), new NotationPoint("-4,-4"));
// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Ginseng), new NotationPoint("-4,4"));
// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Orchid), new NotationPoint("-4,-5"));
// 	this.board.placeTile(this.tileManager.grabTile(GUEST, Ginseng2.TileCodes.Orchid), new NotationPoint("-4,5"));
// };

// Ginseng2.GameManager.prototype.getCopy = function() {
// 	var copyGame = new Ginseng2.GameManager(this.actuator, true, true);
// 	copyGame.board = this.board.getCopy();
// 	copyGame.tileManager = this.tileManager.getCopy();
// 	return copyGame;
// };

// Ginseng2.NotationAdjustmentFunction = function(row, col) {
// 	/* Return string displaying point notation for this game */
// 	// return "row:" + row + " col:" + col;
// 	return new RowAndColumn(col, 16 - row).notationPointString;
// };
