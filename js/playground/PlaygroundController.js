/* Playground specific UI interaction logic */

function PlaygroundController(gameContainer, isMobile) {
	this.actuator = new PlaygroundActuator(gameContainer, isMobile);

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	showReplayControls();

	this.currentPlayingPlayer = HOST;

	this.isPaiShoGame = true;
	this.isInviteOnly = true;
}

PlaygroundController.prototype.getGameTypeId = function() {
	return GameType.Playground.id;
};

PlaygroundController.prototype.resetGameManager = function() {
	this.theGame = new PlaygroundGameManager(this.actuator);
};

PlaygroundController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new PlaygroundNotationBuilder();
};

PlaygroundController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

PlaygroundController.prototype.getNewGameNotation = function() {
	return new PlaygroundGameNotation();
};

PlaygroundController.getHostTilesContainerDivs = function() {
	return '';
};

PlaygroundController.getGuestTilesContainerDivs = function() {
	return '';
};

PlaygroundController.prototype.callActuate = function() {
	this.theGame.actuate();
};

PlaygroundController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	} else if (this.notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}

	rerunAll();
};

PlaygroundController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Pai Sho Playground</h4> <p>Do anything!</p>";
};

PlaygroundController.prototype.getAdditionalMessage = function() {
	var msg = "";
	
	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by making a move. <br />";
		} else {
			msg += "Sign in to enable online gameplay. Or, start playing a local game by making a move. <br />";
		}
	}
	if (!playingOnlineGame) {
		msg += "<span class='skipBonus' onClick='gameController.passTurn()'>End Turn</span><br />";
	}

	return msg;
};

PlaygroundController.prototype.passTurn = function() {
	if (this.currentPlayingPlayer === HOST) {
		this.currentPlayingPlayer = GUEST;
	} else {
		this.currentPlayingPlayer = HOST;
	}
	rerunAll();
}

PlaygroundController.prototype.unplayedTileClicked = function(tileDiv) {
	if (this.theGame.getWinner()) {
		return;
	}
	
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName;//divName.substring(1);

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

	if (this.notationBuilder.status === BRAND_NEW) {
		// new Deploy turn
		tile.selectedFromPile = true;

		this.notationBuilder.playingPlayer = this.currentPlayingPlayer;
		this.notationBuilder.moveType = DEPLOY;
		this.notationBuilder.tileType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.revealAllPointsAsPossible();
	} else {
		this.theGame.hidePossibleMovePoints();
		this.resetNotationBuilder();
	}
};

PlaygroundController.prototype.pointClicked = function(htmlPoint) {
	if (this.theGame.getWinner()) {
		return;
	}
	
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (this.notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {
			this.notationBuilder.playingPlayer = this.currentPlayingPlayer;
			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = MOVE;
			this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			this.theGame.revealAllPointsAsPossible();
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);

			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);
			if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
				createGameIfThatIsOk(GameType.Playground.id);
			} else {
				if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					finalizeMove();
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new PlaygroundNotationBuilder();
		}
	}
};

PlaygroundController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new PlaygroundTile(divName.substring(1), divName.charAt(0));

	var message = [];

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}
	
	var tileCode = divName.substring(1);

	var heading = PlaygroundTile.getTileName(tileCode);

	message.push(tile.ownerName + "'s tile");

	return {
		heading: heading,
		message: message
	}
};

PlaygroundController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	var heading;
	var message = [];
	if (boardPoint.hasTile()) {
		heading = boardPoint.tile.getName();
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
			message.push(getGatePointMessage());
		}
	}

	return {
		heading: heading,
		message: message
	}
};

PlaygroundController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

PlaygroundController.prototype.startAiGame = function(finalizeMove) {
	// 
};

PlaygroundController.prototype.getAiList = function() {
	return [];
};

PlaygroundController.prototype.getCurrentPlayer = function() {
	return this.currentPlayingPlayer;
};

PlaygroundController.prototype.cleanup = function() {
	// Nothing.
};

PlaygroundController.prototype.isSolitaire = function() {
	return false;
};

PlaygroundController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};
