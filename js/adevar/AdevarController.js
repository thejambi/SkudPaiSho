/* Adevar specific UI interaction logic */

function AdevarController(gameContainer, isMobile) {
	this.actuator = new AdevarActuator(gameContainer, isMobile, isAnimationsOn());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	showReplayControls();

	this.isPaiShoGame = true;

	new AdevarOptions(); // Just to initialize
}

AdevarController.prototype.getGameTypeId = function() {
	return GameType.Adevar.id;
};

AdevarController.prototype.resetGameManager = function(ignoreActuate) {
	this.theGame = new AdevarGameManager(this.actuator, ignoreActuate);
};

AdevarController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new AdevarNotationBuilder();
};

AdevarController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

AdevarController.prototype.getNewGameNotation = function() {
	return new AdevarGameNotation();
};

AdevarController.getHostTilesContainerDivs = function() {
	return '';
};

AdevarController.getGuestTilesContainerDivs = function() {
	return '';
};

AdevarController.prototype.callActuate = function() {
	this.theGame.actuate();
};

AdevarController.prototype.undoMoveAllowed = function() {
	return !this.theGame.getWinner()
		&& !this.theGame.disableUndo;
};

AdevarController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	}

	rerunAll();
};

AdevarController.prototype.getDefaultHelpMessageText = function() {
	var message = "<h4>Adevăr Pai Sho</h4> <p>Adevăr Pai Sho is a Pai Sho game created by Jonathan Petruescu. It's a game of strategy, deception, and wit as players sneakily accomplish their hidden objective and take down their opponent's Hidden Tile. Be careful when achieving your objective, because trying to win could be the very thing that makes you lose!</p>";
	message += "<p>See the <a href='https://skudpaisho.com/site/games/adevar-pai-sho/' target='_blank'>Adevăr page</a> for rules and more about the game.</p>";
	return message;
};

AdevarController.prototype.getAdditionalMessage = function() {
	var msg = "";
	
	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by choosing a Hidden Tile.<br />";
		} else {
			msg += "Sign in to enable online gameplay. Or, start playing a local game by choosing a Hidden Tile.<br />";
		}

		msg += getGameOptionsMessageHtml(GameType.Adevar.gameOptions);
	}

	return msg;
};

AdevarController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Adevăr Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(AdevarOptions.buildTileDesignDropdownDiv("Tile Designs"));

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

AdevarController.prototype.unplayedTileClicked = function(tileDiv) {
	if (this.theGame.getWinner()) {
		return;
	}
	
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	if (!myTurn() && !this.peekAtOpponentMoves) {
		return;
	}

	if (this.gameNotation.notationText === QueryString.game && !gameDevOn) {
		return;
	}

	var divName = tileDiv.getAttribute("name");
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName;

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

	if (tile.ownerName !== getCurrentPlayer() || !myTurn()) {
		// Hey, that's not your tile!
		this.checkingOutOpponentTileOrNotMyTurn = true;
		if (!this.peekAtOpponentMoves) {
			return;
		}
	}

	if (this.gameNotation.moves.length <= 1) {
		// Choosing Hidden Tile
		if (tile.type === AdevarTileType.hiddenTile) {
			this.notationBuilder.moveType = AdevarMoveType.chooseHiddenTile;
			this.notationBuilder.hiddenTileCode = tile.code;

			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);

			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);
			
			if (playingOnlineGame()) {
				callSubmitMove();
			} else if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
				createGameIfThatIsOk(GameType.Adevar.id);
			} else {
				finalizeMove();
			}
		}
	} else if (this.notationBuilder.status === BRAND_NEW) {
		// new Deploy turn
		tile.selectedFromPile = true;

		this.notationBuilder.playingPlayer = this.getCurrentPlayer();
		this.notationBuilder.moveType = DEPLOY;
		this.notationBuilder.tileType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.revealDeployPoints(tile);
	} else {
		this.theGame.hidePossibleMovePoints();
		this.resetNotationBuilder();
	}
};

AdevarController.prototype.pointClicked = function(htmlPoint) {
	if (this.theGame.getWinner()) {
		return;
	}

	if (this.gameNotation.notationText === QueryString.game && !gameDevOn) {
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	if (!myTurn() && !this.peekAtOpponentMoves) {
		if (boardPoint.hasTile()) {
			var userIsHost = usernameEquals(currentGameData.hostUsername);
			var userIsGuest = usernameEquals(currentGameData.guestUsername);
			var userIsTileOwner = userIsHost ? boardPoint.tile.ownerName === HOST : userIsGuest && boardPoint.tile.ownerName === GUEST;
			if (userIsTileOwner
					&& boardPoint.tile.type === AdevarTileType.hiddenTile) {
				boardPoint.tile.hidden = !boardPoint.tile.hidden;
				this.callActuate();
			}
		}
		return;
	}

	if (this.notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {
			var userIsHost = usernameEquals(currentGameData.hostUsername);
			var userIsGuest = usernameEquals(currentGameData.guestUsername);
			var userIsTileOwner = userIsHost ? boardPoint.tile.ownerName === HOST : userIsGuest && boardPoint.tile.ownerName === GUEST;
			if ((userIsTileOwner || (!playingOnlineGame() && getCurrentPlayer() === boardPoint.tile.ownerName))
					&& boardPoint.tile.type === AdevarTileType.hiddenTile) {
				boardPoint.tile.hidden = !boardPoint.tile.hidden;
				this.callActuate();
			} else {
				if (boardPoint.tile.ownerName !== getCurrentPlayer() || !myTurn()) {
					debug("That's not your tile!");
					this.checkingOutOpponentTileOrNotMyTurn = true;
					if (!this.peekAtOpponentMoves) {
						return;
					}
				}
				
				this.notationBuilder.playingPlayer = this.getCurrentPlayer();
				this.notationBuilder.status = WAITING_FOR_ENDPOINT;
				this.notationBuilder.moveType = MOVE;
				this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				this.theGame.revealPossibleMovePoints(boardPoint);
			}
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
			this.notationBuilder = new AdevarNotationBuilder();
		}
	}
};

AdevarController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new AdevarTile(divName.substring(1), divName.charAt(0));

	var message = [];

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}
	
	var tileCode = divName.substring(1);

	var heading = tile.type === AdevarTileType.hiddenTile ? "Hidden Tile" : AdevarTile.getTileName(tileCode);

	message.push(tile.ownerName + "'s tile");

	return {
		heading: heading,
		message: message
	}
};

AdevarController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	var heading;
	var message = [];
	
	if (boardPoint.hasTile()) {
		heading = boardPoint.tile.type === AdevarTileType.hiddenTile ? "Hidden Tile" : boardPoint.tile.getName();
	}

	message.push(boardPoint.types);

	return {
		heading: heading,
		message: message
	}
};

AdevarController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

AdevarController.prototype.startAiGame = function(finalizeMove) {
	// 
};

AdevarController.prototype.getAiList = function() {
	return [];
};

AdevarController.prototype.getCurrentPlayer = function() {
	if (currentMoveIndex % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

AdevarController.prototype.cleanup = function() {
	// Nothing.
};

AdevarController.prototype.isSolitaire = function() {
	return false;
};

AdevarController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

AdevarController.prototype.getSandboxNotationMove = function(moveIndex) {
	return this.gameNotation.getMoveWithoutHiddenDetails(moveIndex);
};

AdevarController.prototype.setAnimationsOn = function(isAnimationsOn) {
	this.actuator.setAnimationOn(isAnimationsOn);
};
