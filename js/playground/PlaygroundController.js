/* Playground specific UI interaction logic */

function PlaygroundController(gameContainer, isMobile) {
	this.actuator = new PlaygroundActuator(gameContainer, isMobile, isAnimationsOn());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	showReplayControls();

	this.currentPlayingPlayer = HOST;

	this.isPaiShoGame = true;
	this.isInviteOnly = true;

	new AdevarOptions(); // Just to initialize tiles to show up
}

PlaygroundController.playgroundBoardDesign = "playgroundBoardDesign";

PlaygroundController.prototype.getGameTypeId = function() {
	return GameType.Playground.id;
};

PlaygroundController.prototype.completeSetup = function() {
	/* Initialize Playground specific preferences */
	if (!getUserGamePreference(CapturePreferences.tileDesignKey)
			|| !CapturePreferences.tileDesignTypeValues[getUserGamePreference(CapturePreferences.tileDesignKey)]) {
		setUserGamePreference(CapturePreferences.tileDesignKey, "original");
	}

	if (!getUserGamePreference(tileDesignTypeKey)) {
		setUserGamePreference(tileDesignTypeKey, "tgggyatso");
	}

	if (!getUserGamePreference(vagabondTileDesignTypeKey)) {
		setUserGamePreference(vagabondTileDesignTypeKey, "delion");
	}

	if (!getUserGamePreference(AdevarOptions.tileDesignTypeKey)) {
		setUserGamePreference(AdevarOptions.tileDesignTypeKey, "classic");
	}

	if (getUserGamePreference(PlaygroundController.playgroundBoardDesign)) {
		setPaiShoBoardOption(getUserGamePreference(PlaygroundController.playgroundBoardDesign), true);
	}
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

		msg += getGameOptionsMessageHtml(GameType.Playground.gameOptions);
	} else {
		if (this.notationBuilder.endGame) {
			msg += "Make a move to end the game. <span class='skipBonus' onClick='gameController.unsetEndOfGame()'>Remove end of game trigger</span><br /><br />";
		} else {
			msg += "<span class='skipBonus' onClick='gameController.setEndOfGame()'>End this game</span><br /><br />";
		}
	}

	if (!playingOnlineGame()) {
		msg += "<span class='skipBonus' onClick='gameController.passTurn()'>Pass Turn</span><br /><br />";
		if (!this.theGame.isUsingTileReserves()) {
			msg += "<span class='skipBonus' onClick='gameController.hideTileLibraries()'>Hide Tile Libraries</span><br />";
		}
		if (onlinePlayEnabled && this.gameNotation.moves.length > 0) {
			msg += "<span class='skipBonus' onClick='gameController.startOnlineGame()'>End Game Setup and Create Game</span><br />";
		}
	}

	return msg;
};

PlaygroundController.prototype.hideTileLibraries = function() {
	this.notationBuilder.playingPlayer = this.getCurrentPlayingPlayer();
	this.notationBuilder.moveType = PlaygroundMoveType.hideTileLibraries;
	
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);
	
	// Should not be playing online game here, but maybe in future, better support it
	if (playingOnlineGame()) {
		callSubmitMove();
	} else {
		finalizeMove();
	}
};

PlaygroundController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Pai Sho Playground Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(buildPreferenceDropdownDiv("Skud Pai Sho Tile Designs", "skudPaiShoDesignsDropdown", tileDesignTypeValues, tileDesignTypeKey));
	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(buildPreferenceDropdownDiv("Vagabond Tile Designs", "vagabondPaiShoDesignsDropdown", VagabondController.tileDesignTypeValues, vagabondTileDesignTypeKey));
	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(buildPreferenceDropdownDiv("Adevăr Tile Designs", "adevarDesignsDropdown", AdevarOptions.tileDesignTypeValues, AdevarOptions.tileDesignTypeKey));
	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(buildPreferenceDropdownDiv("Capture Tile Designs", "capturePaiShoDesignsDropdown", CapturePreferences.tileDesignTypeValues, CapturePreferences.tileDesignKey));

	settingsDiv.appendChild(document.createElement("br"));
	settingsDiv.appendChild(buildPreferenceDropdownDiv("Playground Board", "playgroundBoardDropdown", paiShoBoardDesignTypeValues, PlaygroundController.playgroundBoardDesign));

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

PlaygroundController.prototype.gamePreferenceSet = function(preferenceKey) {
	if (preferenceKey === PlaygroundController.playgroundBoardDesign) {
		setPaiShoBoardOption(getUserGamePreference(PlaygroundController.playgroundBoardDesign), true);
	}
};

PlaygroundController.prototype.startOnlineGame = function() {
	createGameIfThatIsOk(GameType.Playground.id);
};

PlaygroundController.prototype.setEndOfGame = function() {
	var yesNoOptions = {};
	yesNoOptions.yesText = "Yes - End Game and mark it Complete";
	yesNoOptions.yesFunction = function() {
		closeModal();
		gameController.confirmEndGame();
	};
	yesNoOptions.noText = "No - Cancel";
	showModal("End Game?", "Are you sure you would like to end the current game and mark it Complete?", false, yesNoOptions);
};

PlaygroundController.prototype.confirmEndGame = function() {
	this.notationBuilder.playingPlayer = this.getCurrentPlayingPlayer();
	this.notationBuilder.endGame = true;
	
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);
	
	if (playingOnlineGame()) {
		callSubmitMove();
	} else {
		finalizeMove();
	}
};

PlaygroundController.prototype.unsetEndOfGame = function() {
	this.notationBuilder.endGame = false;
	refreshMessage();
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

	if (playingOnlineGame() && !iAmPlayerInCurrentOnlineGame() && !gameOptionEnabled(SPECTATORS_CAN_PLAY)) {
		debug("Player not allowed to play.");
		return;
	}

	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var sourcePileName = tileDiv.getAttribute("data-pileName");
	var playerCode = divName.charAt(0);
	var tileCode = divName;

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile;
	if (divName !== "PossibleMove") {
		tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);
	}

	if (this.notationBuilder.status === BRAND_NEW) {
		// new Deploy turn
		tile.selectedFromPile = true;

		this.notationBuilder.playingPlayer = this.getCurrentPlayingPlayer();
		this.notationBuilder.moveType = DEPLOY;
		this.notationBuilder.tileType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;
		this.notationBuilder.sourcePileName = sourcePileName;

		this.theGame.revealAllPointsAsPossible();
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (divName === "PossibleMove") {
			// Need the notation!
			this.theGame.hidePossibleMovePoints();
			if (this.notationBuilder.moveType === DEPLOY) {
				this.notationBuilder.moveType = PlaygroundMoveType.deployToTilePile;
			} else if (this.notationBuilder.moveType === MOVE) {
				this.notationBuilder.moveType = PlaygroundMoveType.moveToTilePile;
			}
			this.notationBuilder.endPileName = sourcePileName;
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);

			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);
			
			if (playingOnlineGame()) {
				callSubmitMove();
			} else {
				finalizeMove();
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new PlaygroundNotationBuilder();
		}
	} else {
		this.theGame.hidePossibleMovePoints();
		this.resetNotationBuilder();
	}
};

PlaygroundController.prototype.getCurrentPlayingPlayer = function() {
	if (playingOnlineGame()) {
		if (usernameEquals(currentGameData.hostUsername)) {
			return HOST;
		} else if (usernameEquals(currentGameData.guestUsername)) {
			return GUEST;
		} else if (gameOptionEnabled(SPECTATORS_CAN_PLAY)) {
			return getUsername();
		}
	} else {
		return this.currentPlayingPlayer;
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

	if (playingOnlineGame() && !iAmPlayerInCurrentOnlineGame() && !gameOptionEnabled(SPECTATORS_CAN_PLAY)) {
		debug("Player not allowed to play.");
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (this.notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {
			this.notationBuilder.playingPlayer = this.getCurrentPlayingPlayer();
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
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);

			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);
			
			if (playingOnlineGame()) {
				callSubmitMove();
			} else {
				finalizeMove();
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

	var tile = new PlaygroundTile(null, divName.substring(1), divName.charAt(0));

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
	return this.getCurrentPlayingPlayer();
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

PlaygroundController.prototype.getSkipToIndex = function(currentMoveIndex) {
	for (var i = currentMoveIndex; i < this.gameNotation.moves.length; i++) {
		if (this.gameNotation.moves[i].moveType === PlaygroundMoveType.hideTileLibraries) {
			return i;
		}
	}
	return currentMoveIndex;
};

PlaygroundController.prototype.setAnimationsOn = function(isAnimationsOn) {
	this.actuator.setAnimationOn(isAnimationsOn);
};

PlaygroundController.prototype.cleanup = function() {
	setPaiShoBoardOption(localStorage.getItem(paiShoBoardDesignTypeKey));
};

PlaygroundController.prototype.selectRandomTile = function(pileName) {
	this.resetNotationBuilder();
	var randomTileDiv = this.actuator.getRandomTilePileDiv(pileName);
	if (randomTileDiv) {
		randomTileDiv.click();
	}
};

