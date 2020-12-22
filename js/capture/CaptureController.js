/* Capture Pai Sho specific UI interaction logic */

var CapturePreferences = {
	tileDesignKey: "TileDesigns",
	tileDesignTypeValues: {
		original: "Original",
		chuji: "Chu Ji by Sirstotes",
		minimalist: "Minimalist by Sirstotes"
	}
};

function CaptureController(gameContainer, isMobile) {
	this.actuator = new CaptureActuator(gameContainer, isMobile);
	
	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	this.isPaiShoGame = true;
}

CaptureController.prototype.getGameTypeId = function() {
	return GameType.CapturePaiSho.id;
};

CaptureController.prototype.completeSetup = function() {
	/* Set default preferences */
	if (!getUserGamePreference(CapturePreferences.tileDesignKey)
			|| !CapturePreferences.tileDesignTypeValues[getUserGamePreference(CapturePreferences.tileDesignKey)]) {
		setUserGamePreference(CapturePreferences.tileDesignKey, "original");
	}

	// Randomly place tiles on board for game setup
	this.addSetupForPlayerCode('H');
	this.addSetupForPlayerCode('G');

	// Finish with actuate
	rerunAll();
	this.callActuate();
};

CaptureController.prototype.addSetupForPlayerCode = function(playerCode) {
	// Randomize list of tiles. They will be placed in that order. That will be the notation of initial placement. 
	var tiles = this.theGame.tileManager.loadTileSet(playerCode);
	shuffleArray(tiles);
	
	var moveText = "0" + playerCode + ".";
	tiles.forEach(
		function(tile) {
			moveText += tile.code;
		}
	);
	debug(moveText);
	var move = new CaptureNotationMove(moveText);
	this.theGame.runNotationMove(move);
	// Move all set. Add it to the notation!
	this.gameNotation.addMove(move);
};

CaptureController.prototype.resetGameManager = function() {
	this.theGame = new CaptureGameManager(this.actuator);
};

CaptureController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new CaptureNotationBuilder();
};

CaptureController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

CaptureController.prototype.getNewGameNotation = function() {
	return new CaptureGameNotation();
};

CaptureController.getHostTilesContainerDivs = function() {
	return '<div class="HA"></div> <div class="HV"></div> <div class="HB"></div> <div class="HP"></div> <div class="HF"></div> <div class="HU"></div> <br class="clear" /> <div class="HK"></div> <div class="HL"></div> <div class="HD"></div> <div class="HM"></div> <div class="HT"></div> <div class="HO"></div>';
};

CaptureController.getGuestTilesContainerDivs = function() {
	return '<div class="GA"></div> <div class="GV"></div> <div class="GB"></div> <div class="GP"></div> <div class="GF"></div> <div class="GU"></div> <br class="clear" /> <div class="GK"></div> <div class="GL"></div> <div class="GD"></div> <div class="GM"></div> <div class="GT"></div> <div class="GO"></div>';
};

CaptureController.prototype.callActuate = function() {
	this.theGame.actuate();
};

CaptureController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	}

	rerunAll();
};

CaptureController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Capture Pai Sho</h4>" + this.getCommonHelpMessageChunk();
};

CaptureController.prototype.endGameNow = function() {
	onlinePlayEngine.updateGameWinInfoAsTie(gameId, gameController.theGame.getWinResultTypeCode(), getLoginToken());
};

CaptureController.prototype.getAdditionalMessage = function() {
	var msg = "";//"<span class='clickableText' onclick='gameController.endGameNow();'>End this game.</span>";

	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			msg += "<strong>Real-time gameplay is enabled!</strong> Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by making a move. <br />";
		} else {
			msg += "Sign in to enable real-time gameplay. Or, start playing a local game by making a move.";
		}
	}

	return msg;
};

CaptureController.prototype.unplayedTileClicked = function(tileDiv) {
	/* Tiles are all on the board for Capture Pai Sho */
};

CaptureController.prototype.clearCaptureHelpAndActuateIfNeeded = function() {
	var clearedTiles = this.clearCaptureHelp();
	if (clearedTiles.unflaggedCaptureTiles.length > 0 || clearedTiles.unflaggedCapturedByTiles.length > 0) {
		this.callActuate();
	}
};

CaptureController.prototype.pointClicked = function(htmlPoint) {
	this.clearCaptureHelpAndActuateIfNeeded();

	if (this.theGame.board.winners.length > 0) {
		return;
	}
	// if (!myTurn()) {
	// 	return;
	// }
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
			this.flagCaptureHelp(boardPoint);
			this.flagCapturedByHelp(boardPoint);

			if (boardPoint.tile.ownerName !== getCurrentPlayer() || !myTurn()) {
				debug("That's not your tile!");
				this.callActuate();
				return;
			}

			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = MOVE;
			this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			this.theGame.revealPossibleMovePoints(boardPoint);
		} else {
			this.clearCaptureHelpAndActuateIfNeeded();
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.runNotationMove(move);

			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);
			if (onlinePlayEnabled && this.gameNotation.moves.length === 3) {
				createGameIfThatIsOk(GameType.CapturePaiSho.id);
			} else {
				if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					finalizeMove();
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder();
		}
	}
};

CaptureController.prototype.getCommonHelpMessageChunk = function() {
	return this.getCaptureCycleImageTag() + "<p>Each tile captures the next three tiles in the Capture Cycle (going clockwise). <a href='https://skudpaisho.com/site/games/capture-pai-sho/' target='_blank'>View the rules</a> to learn about how tiles move and jump on the board and more.</p><p><em>Capture Pai Sho is created and designed by <a href='https://redallure.deviantart.com/art/What-you-get-502701647' target='_blank'>Tom Ford</a>.</em></p>";
};

CaptureController.prototype.getCaptureCycleImageTag = function() {
	return "<img src='images/Capture/CaptureCycle.png' style='width:100%;' />";
};

CaptureController.prototype.getTheMessage = function(tile, ownerName) {
	var message = [];

	var tileCode = tile.code;

	var heading = ownerName + "'s " + CaptureTile.getTileName(tileCode);

	message.push(this.getCommonHelpMessageChunk());

	return {
		heading: heading,
		message: message
	}
};

CaptureController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new CaptureTile(divName.substring(1), divName.charAt(0));

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	return this.getTheMessage(tile, ownerName);
};

CaptureController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (boardPoint.hasTile()) {
		return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
	} else {
		return null;
	}
};

CaptureController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

CaptureController.prototype.startAiGame = function(finalizeMove) {
	// 
};

CaptureController.prototype.getAiList = function() {
	return [];
};

CaptureController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

CaptureController.prototype.cleanup = function() {
	// 
};

CaptureController.prototype.isSolitaire = function() {
	return false;
};

CaptureController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

CaptureController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Capture Pai Sho Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(buildPreferenceDropdownDiv("Tile Designs", "capturePaiShoDesignsDropdown", CapturePreferences.tileDesignTypeValues, CapturePreferences.tileDesignKey));

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

/* Capture Pai Sho specific methods */
CaptureController.prototype.flagCaptureHelp = function(boardPoint) {
	if (boardPoint.hasTile()) {
		var selectedTile = boardPoint.tile;
		return this.theGame.board.flagPointsTileCanCapture(selectedTile);
	}
	return [];
};

CaptureController.prototype.flagCapturedByHelp = function(boardPoint) {
	if (boardPoint.hasTile()) {
		var selectedTile = boardPoint.tile;
		return this.theGame.board.flagPointsTileCapturedBy(selectedTile);
	}
	return [];
};

CaptureController.prototype.clearCaptureHelp = function() {
	return this.theGame.board.clearCaptureHelp();
};

CaptureController.prototype.showCaptureHelpOnHover = function(htmlPoint) {
	if (this.notationBuilder.status === BRAND_NEW) {
		var clearedTiles = this.clearCaptureHelp();

		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		var flaggedTiles = [];
		var flaggedCapturedByTiles = [];
		if (boardPoint.hasTile()) {
			flaggedTiles = this.flagCaptureHelp(boardPoint);
			flaggedCapturedByTiles = this.flagCapturedByHelp(boardPoint);
		}

		if (!(clearedTiles.unflaggedCaptureTiles.length === 0 && clearedTiles.unflaggedCapturedByTiles.length === 0 && flaggedTiles.length === 0 && flaggedCapturedByTiles.length === 0)
			&& (!clearedTiles.unflaggedCaptureTiles.equals(flaggedTiles) || !clearedTiles.unflaggedCapturedByTiles.equals(flaggedCapturedByTiles))) {
			this.callActuate();
		}
	}
};





