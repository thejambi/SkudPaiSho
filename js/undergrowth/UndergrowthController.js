/* Undergrowth Pai Sho specific UI interaction logic */

function Undergrowth() {};

Undergrowth.Controller = function(gameContainer, isMobile) {
	this.actuator = new Undergrowth.Actuator(gameContainer, isMobile);

	this.resetGameNotation();	// First

	this.resetGameManager();
	this.resetNotationBuilder();

	this.isPaiShoGame = true;
}

Undergrowth.Controller.prototype.getGameTypeId = function() {
	return GameType.UndergrowthPaiSho.id;
};

Undergrowth.Controller.prototype.resetGameManager = function() {
	this.theGame = new Undergrowth.GameManager(this.actuator);
};

Undergrowth.Controller.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new Undergrowth.NotationBuilder();
};

Undergrowth.Controller.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

Undergrowth.Controller.prototype.getNewGameNotation = function() {
	return new UndergrowthGameNotation();
};

Undergrowth.Controller.getHostTilesContainerDivs = function() {
	var divs = '<div class="HR3"></div> <div class="HR4"></div> <div class="HR5"></div> <div class="HW3"></div> <div class="HW4"></div> <div class="HW5"></div> <br class="clear" /> <div class="HL"></div> <div class="HO"></div>';
	return divs;
}

Undergrowth.Controller.getGuestTilesContainerDivs = function() {
	var divs = '<div class="GR3"></div> <div class="GR4"></div> <div class="GR5"></div> <div class="GW3"></div> <div class="GW4"></div> <div class="GW5"></div> <br class="clear" /> <div class="GL"></div> <div class="GO"></div>';
	return divs;
};

Undergrowth.Controller.prototype.callActuate = function() {
	this.theGame.actuate();
};

Undergrowth.Controller.prototype.resetMove = function() {
	// Remove last move
	this.gameNotation.removeLastMove();
};

Undergrowth.Controller.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Undergrowth Pai Sho</h4> <p>A placement game based on the Skud Pai Sho harmony system.</p>";
};

Undergrowth.Controller.prototype.getAdditionalMessage = function() {
	var msg = "";
	if (this.gameNotation.moves.length === 0) {
		// msg += getGameOptionsMessageHtml(GameType.UndergrowthPaiSho.gameOptions);
	}
	if (!this.theGame.getWinner()) {
		msg += "<br /><strong>" + this.theGame.getScoreSummary() + "</strong>";
	}
	return msg;
};

Undergrowth.Controller.prototype.unplayedTileClicked = function(tileDiv) {
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

	if (tile.ownerName !== getCurrentPlayer()) {
		// debug("That's not your tile!");
		return;
	}

	if (this.notationBuilder.status === BRAND_NEW) {
		tile.selectedFromPile = true;

		this.notationBuilder.moveType = PLANTING;
		this.notationBuilder.plantedFlowerType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.setAllLegalPointsOpen(getCurrentPlayer(), tile, this.gameNotation.moves.length);
	} else {
		this.theGame.hidePossibleMovePoints();
		this.notationBuilder = new Undergrowth.NotationBuilder();
	}
};

Undergrowth.Controller.prototype.pointClicked = function(htmlPoint) {
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
			if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
				createGameIfThatIsOk(GameType.Undergrowth.id);
			} else {
				if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					finalizeMove();
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new Undergrowth.NotationBuilder();
		}
	}
};

Undergrowth.Controller.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new Undergrowth.Tile(divName.substring(1), divName.charAt(0));

	var message = [];

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}
	
	var tileCode = divName.substring(1);

	var heading = Undergrowth.Tile.getTileName(tileCode);

	return {
		heading: heading,
		message: message
	}
}

Undergrowth.Controller.prototype.getPointMessage = function(htmlPoint) {
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

Undergrowth.Controller.prototype.playAiTurn = function(finalizeMove) {
	// 
};

Undergrowth.Controller.prototype.startAiGame = function(finalizeMove) {
	// 
};

Undergrowth.Controller.prototype.getAiList = function() {
	return [];
}

Undergrowth.Controller.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

Undergrowth.Controller.prototype.cleanup = function() {
	// 
};

Undergrowth.Controller.prototype.isSolitaire = function() {
	return false;
};

Undergrowth.Controller.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

Undergrowth.Controller.prototype.replayEnded = function() {
	this.theGame.actuate();
};

