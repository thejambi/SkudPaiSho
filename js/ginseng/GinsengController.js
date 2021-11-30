/* Ginseng specific UI interaction logic */

function Ginseng() {}

Ginseng.Controller = function(gameContainer, isMobile) {
	this.actuator = new Ginseng.Actuator(gameContainer, isMobile);

	Ginseng.TileInfo.initializeTrifleData();
	PaiShoGames.currentTileMetadata = Ginseng.GinsengTiles;
	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	this.isInviteOnly = true;
	this.isPaiShoGame = true;
}

Ginseng.Controller.prototype.getGameTypeId = function() {
	return GameType.Ginseng.id;
};

Ginseng.Controller.prototype.resetGameManager = function() {
	this.theGame = new Ginseng.GameManager(this.actuator);
};

Ginseng.Controller.prototype.resetNotationBuilder = function() {
	var offerDraw = false;
	if (this.notationBuilder) {
		offerDraw = this.notationBuilder.offerDraw;
	}
	this.notationBuilder = new Trifle.NotationBuilder();
	this.notationBuilder.promptTargetData = {};
	if (offerDraw) {
		this.notationBuilder.offerDraw = true;
	}
	this.checkingOutOpponentTileOrNotMyTurn = false;
};

Ginseng.Controller.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

Ginseng.Controller.prototype.getNewGameNotation = function() {
	return new Trifle.GameNotation();
};

Ginseng.Controller.getHostTilesContainerDivs = function() {
	return '';
}

Ginseng.Controller.getGuestTilesContainerDivs = function() {
	return '';
};

Ginseng.Controller.prototype.callActuate = function() {
	this.theGame.actuate();
};

Ginseng.Controller.prototype.resetMove = function() {
	this.notationBuilder.offerDraw = false;
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	} else if (this.notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}

	rerunAll();
};

Ginseng.Controller.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Ginseng Pai Sho (beta testing)</h4><p><a href='https://skudpaisho.com/site/games/ginseng-pai-sho/' target='_blank'>view the rules</a>.</p>";
};

Ginseng.Controller.prototype.getAdditionalMessage = function() {
	var msg = "";
	
	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by choosing your team. <br />";
		} else {
			msg += "Sign in to enable online gameplay. Or, start playing a local game by choosing your team.";
		}

		msg += getGameOptionsMessageHtml(GameType.Ginseng.gameOptions);
	} else if (!this.theGame.hasEnded() && myTurn()) {
		if (this.gameNotation.lastMoveHasDrawOffer() && this.promptToAcceptDraw) {
			msg += "<br />Are you sure you want to accept the draw offer and end the game?<br />";
			msg += "<span class='skipBonus' onclick='gameController.confirmAcceptDraw();'>Yes, accept draw and end the game</span>";
			msg += "<br /><br />";
		} else if (this.gameNotation.lastMoveHasDrawOffer()) {
			msg += "<br />Your opponent is offering a draw. You may <span class='skipBonus' onclick='gameController.acceptDraw();'>Accept Draw</span> or make a move to refuse the draw offer.<br />";
		} else if (this.notationBuilder.offerDraw) {
			msg += "<br />Your opponent will be able to accept or reject your draw offer once you make your move. Or, you may <span class='skipBonus' onclick='gameController.removeDrawOffer();'>remove your draw offer</span> from this move.";
		} else {
			msg += "<br /><span class='skipBonus' onclick='gameController.offerDraw();'>Offer Draw</span><br />";
		}
	} else if (!myTurn()) {
		if (this.gameNotation.lastMoveHasDrawOffer()) {
			msg += "<br />A draw has been offered.<br />";
		}
	}

	return msg;
};

Ginseng.Controller.prototype.gameHasEndedInDraw = function() {
	return this.theGame.gameHasEndedInDraw;
};

Ginseng.Controller.prototype.acceptDraw = function() {
	if (myTurn()) {
		this.promptToAcceptDraw = true;
		refreshMessage();
	}
};

Ginseng.Controller.prototype.confirmAcceptDraw = function() {
	if (myTurn()) {
		this.resetNotationBuilder();
		this.notationBuilder.moveType = DRAW_ACCEPT;

		var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.theGame.runNotationMove(move);
		// Move all set. Add it to the notation!
		this.gameNotation.addMove(move);

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}
};

Ginseng.Controller.prototype.offerDraw = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = true;
		refreshMessage();
	}
};

Ginseng.Controller.prototype.removeDrawOffer = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = false;
		refreshMessage();
	}
};

Ginseng.Controller.prototype.unplayedTileClicked = function(tileDiv) {
	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded() && this.notationBuilder.status !== READY_FOR_BONUS) {
		return;
	}

	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

	if ((tile && tile.ownerName !== getCurrentPlayer()) || !myTurn()) {
		this.checkingOutOpponentTileOrNotMyTurn = true;
	}

	/* if (this.theGame.playersAreSelectingTeams()) {
		var selectedTile = new Ginseng.Tile(tileCode, playerCode);
		if (tileDiv.classList.contains("selectedFromPile")) {
			var teamIsNowFull = this.theGame.addTileToTeam(selectedTile);
			if (teamIsNowFull) {
				this.notationBuilder.moveType = TEAM_SELECTION;
				this.notationBuilder.teamSelection = this.theGame.getPlayerTeamSelectionTileCodeList(player);
				this.completeMove();
			}
		} else if (!this.theGame.tileManager.playerTeamIsFull(selectedTile.ownerName)) {
			// Need to remove from team instead
			this.theGame.removeTileFromTeam(selectedTile);
		}
	} else  */
	if (this.notationBuilder.status === BRAND_NEW) {
		// new Deploy turn
		tile.selectedFromPile = true;

		this.notationBuilder.moveType = DEPLOY;
		this.notationBuilder.tileType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.revealDeployPoints(tile);
	} else {
		this.theGame.hidePossibleMovePoints();
		this.resetNotationBuilder();
	}
}

Ginseng.Controller.prototype.pointClicked = function(htmlPoint) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded()) {
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (this.notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {
			if (boardPoint.tile.ownerName !== getCurrentPlayer() || !myTurn()) {
				debug("That's not your tile!");
				this.checkingOutOpponentTileOrNotMyTurn = true;
			}

			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = MOVE;
			this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			this.theGame.revealPossibleMovePoints(boardPoint);
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();

			if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
				this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
				// TODO - Does move require user to choose targets?... 
				this.completeMove();
			} else {
				this.resetNotationBuilder();
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder();
		}
	} else if (this.notationBuilder.status === Trifle.NotationBuilderStatus.PROMPTING_FOR_TARGET) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.theGame.hidePossibleMovePoints();

			if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
				var sourceTileKey = JSON.stringify(this.notationBuilder.neededPromptTargetInfo.sourceTileKey);
				if (!this.notationBuilder.promptTargetData[sourceTileKey]) {
					this.notationBuilder.promptTargetData[sourceTileKey] = {};
				}
				this.notationBuilder.promptTargetData[sourceTileKey][this.notationBuilder.neededPromptTargetInfo.currentPromptTargetId] = new NotationPoint(htmlPoint.getAttribute("name"));
				// TODO - Does move require user to choose targets?... 
				var notationBuilderSave = this.notationBuilder;
				this.resetMove();
				this.notationBuilder = notationBuilderSave;
				this.completeMove();
			} else {
				this.resetNotationBuilder();
			}
		} else {
			// this.theGame.hidePossibleMovePoints();
			// this.notationBuilder.status = ?
		}
	}
};

Ginseng.Controller.prototype.completeMove = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	var neededPromptTargetInfo = this.theGame.runNotationMove(move);

	if (neededPromptTargetInfo) {
		debug("Prompting user for the rest of the move!");
		this.notationBuilder.status = Trifle.NotationBuilderStatus.PROMPTING_FOR_TARGET;
		this.notationBuilder.neededPromptTargetInfo = neededPromptTargetInfo;
	} else {
		this.gameNotation.addMove(move);
		if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
			createGameIfThatIsOk(this.getGameTypeId());
		} else {
			if (playingOnlineGame()) {
				callSubmitMove();
			} else {
				finalizeMove();
				// quickFinalizeMove();
			}
		}
	}
};

Ginseng.Controller.prototype.skipHarmonyBonus = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);
	if (playingOnlineGame()) {
		callSubmitMove();
	} else {
		finalizeMove();
	}
}

Ginseng.Controller.prototype.getTheMessage = function(tile, ownerName) {
	var message = [];

	var tileCode = tile.code;

	var heading = Trifle.Tile.getTileName(tileCode);

	message.push(Trifle.TileInfo.getReadableDescription(tileCode));

	return {
		heading: heading,
		message: message
	}
}

Ginseng.Controller.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new Ginseng.Tile(divName.substring(1), divName.charAt(0));

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	return this.getTheMessage(tile, ownerName);
}

Ginseng.Controller.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (boardPoint.hasTile()) {
		return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
	} else {
		return null;
	}
}

Ginseng.Controller.prototype.playAiTurn = function(finalizeMove) {
	// 
};

Ginseng.Controller.prototype.startAiGame = function(finalizeMove) {
	// 
};

Ginseng.Controller.prototype.getAiList = function() {
	return [];
}

Ginseng.Controller.prototype.getCurrentPlayer = function() {
	if (currentMoveIndex % 2 === 0) {	// To get right player during replay...
		return HOST;
	} else {
		return GUEST;
	}
};

Ginseng.Controller.prototype.cleanup = function() {
	// document.querySelector(".svgContainer").classList.remove("TrifleBoardRotate");
};

Ginseng.Controller.prototype.isSolitaire = function() {
	return false;
};

Ginseng.Controller.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

Ginseng.Controller.prototype.RmbDown = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
}

Ginseng.Controller.prototype.RmbUp = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (mouseEndPoint == this.mouseStartPoint) {
		this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint);
	}
	else if (this.mouseStartPoint) {
		this.theGame.markingManager.toggleMarkedArrow(this.mouseStartPoint, mouseEndPoint);
	}
	this.mouseStartPoint = null;

	this.callActuate();
}
