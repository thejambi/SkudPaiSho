/* Overgrowth Pai Sho specific UI interaction logic */

function OvergrowthController(gameContainer, isMobile) {
	this.actuator = new OvergrowthActuator(gameContainer, isMobile);

	this.showGameMessageUnderneath = true;

	this.resetGameNotation();	// First

	this.resetGameManager();
	this.resetNotationBuilder();

	this.isPaiShoGame = true;
}

OvergrowthController.prototype.getGameTypeId = function() {
	return GameType.OvergrowthPaiSho.id;
};

OvergrowthController.prototype.completeSetup = function() {
	this.callActuate();
};

OvergrowthController.prototype.resetGameManager = function() {
	if (this.theGame) {
		this.theGame = new OvergrowthGameManager(this.actuator, false, false, this.theGame.drawnTile, this.theGame.lastDrawnTile);
	} else {
		this.theGame = new OvergrowthGameManager(this.actuator);
	}
};

OvergrowthController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new OvergrowthNotationBuilder();
};

OvergrowthController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

OvergrowthController.prototype.getNewGameNotation = function() {
	return new OvergrowthGameNotation();
};

OvergrowthController.getHostTilesContainerDivs = function() {
	return '<div class="HR3 HR4 HR5 HW3 HW4 HW5 HR HW HK HB HL HO">';
}

OvergrowthController.getGuestTilesContainerDivs = function() {
	return '<div class="GR3 GR4 GR5 GW3 GW4 GW5 GR GW GK GB GL GO">';
};

OvergrowthController.prototype.callActuate = function() {
	this.theGame.actuate();
};

OvergrowthController.prototype.resetMove = function() {
	// Remove last move
	this.gameNotation.removeLastMove();

	if (this.theGame.drawnTile) {
		this.theGame.drawnTile.selectedFromPile = false;
		this.theGame.tileManager.putTileBack(this.theGame.drawnTile);
	}

	this.theGame.drawnTile = this.lastDrawnTile;
	this.theGame.drawnTile.selectedFromPile = false;
};

OvergrowthController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Overgrowth Pai Sho</h4> <p>A competitive variant of Solitaire Pai Sho.</p><p>Players alternate drawing and placing a tile, following the same placement rules as Solitaire Pai Sho, with these clarifications:<ul><li>Tiles form harmony or disharmony regardless of whose tile it is</li><li>Like tiles form disharmony (for example, Rose (R3) forms disharmony with Rose (R3))</li></ul></p><p>The game ends when all tiles have been played. The winner is as follows: <ul><li>The Host wins if there are more Harmonies on the board</li><li>The Guest wins if there are more Disharmonies on the board</li></ul></p>";
};

OvergrowthController.prototype.getAdditionalMessage = function() {
	var msg = "";
	if (this.gameNotation.moves.length === 0) {
		msg += getGameOptionsMessageHtml(GameType.OvergrowthPaiSho.gameOptions);
	}
	if (!this.theGame.getWinner()) {
		msg += "<br /><strong>" + this.theGame.getScoreSummary() + "</strong>";
	}
	return msg;
};

OvergrowthController.prototype.unplayedTileClicked = function(tileDiv) {
	if (!myTurn()) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
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

	if (this.notationBuilder.status === BRAND_NEW) {
		tile.selectedFromPile = true;
		this.theGame.drawnTile.selectedFromPile = true;

		this.notationBuilder.moveType = PLANTING;
		this.notationBuilder.plantedFlowerType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.setAllLegalPointsOpen(getCurrentPlayer(), tile);
	} else {
		this.theGame.hidePossibleMovePoints();
		this.notationBuilder = new OvergrowthNotationBuilder();
	}
};

OvergrowthController.prototype.pointClicked = function(htmlPoint) {
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.runNotationMove(move);

			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);
			this.theGame.drawRandomTile();
			if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
				createGameIfThatIsOk(GameType.OvergrowthPaiSho.id);
			} else {
				if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					finalizeMove();
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new OvergrowthNotationBuilder();
		}
	}
};

OvergrowthController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new OvergrowthTile(divName.substring(1), divName.charAt(0));

	var message = [];

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}
	
	var tileCode = divName.substring(1);

	var heading = OvergrowthTile.getTileName(tileCode);

	return {
		heading: heading,
		message: message
	}
}

OvergrowthController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	var message = [];
	if (boardPoint.hasTile()) {
		message.push(toHeading(boardPoint.tile.getName()));
	} else {
		if (boardPoint.isType(NEUTRAL)) {
			message.push(getNeutralPointMessage());
		} else if (boardPoint.isType(RED) && boardPoint.isType(WHITE)) {
			message.push(getRedWhitePointMessage());
		} else if (boardPoint.isType(RED)) {
			message.push(getRedPointMessage());
		} else if (boardPoint.isType(WHITE)) {
			message.push(getWhitePointMessage());
		} else if (boardPoint.isType(GATE)) {
			message.push(getNeutralPointMessage());
		}
	}

	return {
		heading: null,
		message: message
	}
}

OvergrowthController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

OvergrowthController.prototype.startAiGame = function(finalizeMove) {
	// 
};

OvergrowthController.prototype.getAiList = function() {
	return [];
}

OvergrowthController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

OvergrowthController.prototype.cleanup = function() {
	// 
};

OvergrowthController.prototype.isSolitaire = function() {
	return false;
};

OvergrowthController.prototype.setGameNotation = function(newGameNotation) {
	if (this.theGame.drawnTile) {
		this.theGame.drawnTile.selectedFromPile = false;
		this.theGame.tileManager.putTileBack(this.theGame.drawnTile);
	}
	this.resetGameManager();
	this.gameNotation.setNotationText(newGameNotation);
	this.theGame.drawRandomTile();
	this.theGame.actuate();
};

