/* Adevar specific UI interaction logic */

function AdevarController(gameContainer, isMobile) {
	new AdevarOptions(); // Just to initialize
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;
	this.createActuator();

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	showReplayControls();

	this.isPaiShoGame = true;
}

AdevarController.prototype.createActuator = function() {
	this.actuator = new AdevarActuator(this.gameContainer, this.isMobile, isAnimationsOn());
	if (this.theGame) {
		this.theGame.updateActuator(this.actuator);
	}
};

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
	this.showLilyHelp = false;
	if (this.showLilyHelp) {
		this.showOrientalLilyHelp();
	} else {
		this.hideOrientalLilyHelp();
	}

	var message = "<h4>Adevăr Pai Sho</h4> <p>Adevăr Pai Sho is a game of strategy, deception, and wit as players sneakily accomplish their hidden objective and take down their opponent's Hidden Tile. Be careful when achieving your objective, because trying to win could be the very thing that makes you lose! ";
	message += "See the <a href='https://tinyurl.com/adevarrulebook' target='_blank'>Adevăr rules</a> and <a href='https://tinyurl.com/AdevarQuickGuideDoc' target='_blank'>Adevăr Quick Guide</a> for the full rules and more about the game.</p>";
	message += "<p>Before the game, players each choose a Hidden Tile. The game is won when a player completes the objective given to them by their chosen Hidden Tile or captures their opponent’s Hidden Tile with their corresponding Second Face tile.</p>";
	message += "<p>On a turn, players either move a tile on the board or call a new tile onto the board.</p>";
	if (this.hoveredOverLily) {
		message += "<p><img src='images/Adevar/" + localStorage.getItem(AdevarOptions.tileDesignTypeKey) + "/HOrientalLily.png' height=28px width=28px /> See the Oriental Lily garden objectives individually:"
				+ "<br />Garden A: <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(HOST, 0);'>HOST</span> <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(GUEST, 0);'>GUEST</span>"
				+ "<br />Garden B: <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(HOST, 1);'>HOST</span> <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(GUEST, 1);'>GUEST</span>"
				+ "<br />Garden C: <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(HOST, 2);'>HOST</span> <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(GUEST, 2);'>GUEST</span></p>";
	}
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

		if (gameOptionEnabled(ADEVAR_LITE)) {
			msg += "<br /><strong>Adevăr Lite</strong> is a <em>training wheels</em> mode for beginners to learn the game - players play with their Hidden Tiles revealed and win by accomplishing their chosen Hidden Tile objective.<br />";
		}

	//	if (gameOptionEnabled(BLACK_ORCHID_BUFF)) {
	//		msg += "The Black Orchid is currently the least picked HT, and frankly could use some improvement. This changes the objective to require a greater than <em> or equal</em> number of tiles in each plot.";
	//	}

		msg += getGameOptionsMessageHtml(GameType.Adevar.gameOptions);
	}

	/* if (this.hoveredOverLily) {
		msg += "<br />See the Oriental Lily garden objectives individually:"
			+ "<br />Garden A: <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(HOST, 0);'>HOST</span> <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(GUEST, 0);'>GUEST</span>"
			+ "<br />Garden B: <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(HOST, 1);'>HOST</span> <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(GUEST, 1);'>GUEST</span>"
			+ "<br />Garden C: <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(HOST, 2);'>HOST</span> <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(GUEST, 2);'>GUEST</span>";
	} */

	return msg;
};

AdevarController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Adevăr Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(AdevarOptions.buildTileDesignDropdownDiv("Tile Designs"));

	if (!playingOnlineGame() || !iAmPlayerInCurrentOnlineGame() || getOnlineGameOpponentUsername() === getUsername()) {
		settingsDiv.appendChild(document.createElement("br"));
		settingsDiv.appendChild(AdevarOptions.buildToggleViewAsGuestDiv());
	}

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

AdevarController.prototype.toggleViewAsGuest = function() {
	AdevarOptions.viewAsGuest = !AdevarOptions.viewAsGuest;
	this.createActuator();
	this.callActuate();
	clearMessage();
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
				boardPoint.tile.hidden = !boardPoint.tile.hidden && !gameOptionEnabled(ADEVAR_LITE);
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
	this.showLilyHelp = false;
	var divName = tileDiv.getAttribute("name");
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new AdevarTile(divName.substring(1), divName.charAt(0));

	var message = [];

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	var heading = this.getTileMessageHeading(tile, true);

	var tileMessages = this.getTileMessages(tile, true);
	tileMessages.forEach(function(tileMessage) {
		message.push(tileMessage);
	});

	if (this.showLilyHelp) {
		this.showOrientalLilyHelp();
	} else {
		this.hideOrientalLilyHelp();
	}

	return {
		heading: heading,
		message: message
	}
};

AdevarController.prototype.getTileMessageHeading = function(tile, inTilePile) {
	return tile.type === AdevarTileType.hiddenTile && tile.hidden && !inTilePile ? "Hidden Tile" : tile.getName();
};

AdevarController.prototype.getTileMessages = function(tile, inTilePile) {
	var tileMessages = [];
	tileMessages.push(tile.ownerName + "'s tile");

	var hiddenTileForObjective = null;
	if (tile.type === AdevarTileType.hiddenTile && (!tile.hidden || inTilePile)) {
		hiddenTileForObjective = tile;
	} else if (tile.type === AdevarTileType.secondFace) {
		hiddenTileForObjective = new AdevarTile(AdevarTileManager.htSfMap.reverseLookup(tile.code), tile.ownerCode);
	}
	if (hiddenTileForObjective) {
		tileMessages.push(this.buildHiddenTileObjectiveMessage(hiddenTileForObjective));
	}

	var otherTileMessages = this.buildOtherTileMessages(tile);
	otherTileMessages.forEach(function(msg) {
		tileMessages.push(msg);
	});

	return tileMessages;
};

AdevarController.prototype.buildOtherTileMessages = function(tile) {
	var messages = [];
	if (tile.type === AdevarTileType.basic) {
		messages.push("Basic Tile");
		messages.push("Moves up to " + tile.getMoveDistance() + " spaces");
		messages.push("Basic tiles are called onto the board next to your Gate pieces");
		messages.push("Basic tiles can capture opponent's Basic tiles of different types when being moved or called onto the board (e.g. your Lilac tiles can capture your opponent's Zinna and Foxglove tiles)");
		if (tile.code === AdevarTileCode.foxglove) {
			messages.push("Foxglove tiles can also capture the opponent's Water's Reflection tile");
		}
	} else if (tile.type === AdevarTileType.gate) {
		messages.push("Gate Tile");
		messages.push("Basic tiles, Second Face tiles, and Water's Reflection tiles are called to the board through your Gate tiles");
		messages.push("Gate tiles are called onto the board next to your Basic tiles");
	} else if (tile.type === AdevarTileType.reflection) {
		messages.push("Water's Reflection Tile");
		messages.push("Can move up to 7 spaces");
		messages.push("Can capture Second Face tiles");
		messages.push("Can be captured by Foxglove tiles");
		messages.push("Returned to tile reserve when captured and can be called back to the board through a Gate tile");
	} else if (tile.type === AdevarTileType.secondFace) {
		messages.push("Can move up to 7 spaces");
		messages.push("Can capture Vanguard tiles and its corresponding Hidden Tile");
		messages.push("Can be captured by Water's Reflection tile");
		messages.push("Returned to tile reserve when captured and can be called back to the board through a Gate tile");
		messages.push("A player may only play 2 Second Face tiles during a game");
	} else if (tile.type === AdevarTileType.vanguard) {
		messages.push("Vanguard Tile");
		messages.push("Vanguard tiles protect the Hidden Tile, so both must be captured before attempting to capture the guarded Hidden Tile");
		messages.push("Can be captured by Second Face tiles");
		messages.push("Captured Vanguard tiles regrow when an attacking Second Face tile attempts to capture the Hidden Tile but is not the corresponding Second Face, or the attacking Second Face tile is captured");
	}

	return messages;
};

AdevarController.prototype.showOrientalLilyHelp = function(player, gardenIndex) {
	if (!this.lilyHelpOn) {
		this.theGame.actuator.showOrientalLilyHighlights(player, gardenIndex);
		this.lilyHelpOn = true;
	}
};

AdevarController.prototype.hideOrientalLilyHelp = function() {
	if (this.lilyHelpOn) {
		this.theGame.actuator.hideOrientalLilyHighlights();
		this.lilyHelpOn = false;
	}
};

AdevarController.prototype.buildHiddenTileObjectiveMessage = function(hiddenTile) {
	var objective = null;
	this.showLilyHelp = false;
	switch(hiddenTile.code) {
		case AdevarTileCode.iris:
			objective = "Have 2 Basic tiles in each Red Plot, and 3 Basic tiles in each White Plot";
			break;
		case AdevarTileCode.orientalLily:
			objective = "Create one of the three Oriental Lily Garden formations with Basic tiles on your side of the board (see rules, or board highlights for Garden diagrams).";
			objective += "<br />See the Oriental Lily garden objectives individually:"
				+ "<br />Garden A: <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(HOST, 0);'>HOST</span> <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(GUEST, 0);'>GUEST</span>"
				+ "<br />Garden B: <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(HOST, 1);'>HOST</span> <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(GUEST, 1);'>GUEST</span>"
				+ "<br />Garden C: <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(HOST, 2);'>HOST</span> <span class='skipBonus' onclick='gameController.hideOrientalLilyHelp(); gameController.showOrientalLilyHelp(GUEST, 2);'>GUEST</span>";
			this.showLilyHelp = true;
			this.hoveredOverLily = true;
			refreshMessage();
			break;
		case AdevarTileCode.echeveria:
			objective = "Capture at least 2 of each of your opponent’s Basic tile types, and have at least 1 of each of your Basic tile types be captured";
			break;
		case AdevarTileCode.whiteRose:
			objective = "Call a Gate completely in your opponent's starting Open Plot";
			break;
		case AdevarTileCode.whiteLotus:
			objective = "Form a \"Harmony Ring\" similar to Skud Pai Sho using Basic tiles (Lilac - Zinnia - Foxglove order for Harmony Circle)";
			break;
		case AdevarTileCode.birdOfParadise:
			objective = "Have at least one total Basic tile in each of the 8 Plots on the board";
			break;
		case AdevarTileCode.blackOrchid:
		//	if (gameOptionEnabled(BLACK_ORCHID_BUFF)) {
				objective = "Have as many or more Basic tiles in each plot, except for the starting North and South Open Plots, than your opponent. You must have at least 1/2 a tile in those Plots.";
		//	} else {
		//		objective = "Have more Basic tiles in each plot, except for the starting North and South Open Plots, than your opponent";
		//	}
			break;
		default:
			objective = "Unknown";
			break;
	}

	/* if (!this.showLilyHelp && this.hoveredOverLily) {
		this.hoveredOverLily = false;
		refreshMessage();
	} */

	return hiddenTile.getName() + "'s Objective: " + objective;
};

AdevarController.prototype.getPointMessage = function(htmlPoint) {
	this.showLilyHelp = false;
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	var heading;
	var message = [];
	
	if (boardPoint.hasTile()) {
		heading = this.getTileMessageHeading(boardPoint.tile);
		var tileMessages = this.getTileMessages(boardPoint.tile);
		tileMessages.forEach(function(tileMessage) {
			message.push(tileMessage);
		});
	}

	/* Plot info */
	message.push(
		(boardPoint.plotTypes.length > 1 ? "Plots: " : "Plot: ")
		+ boardPoint.plotTypes.toString().replace(",", ", ")
	);

	boardPoint.plotTypes.forEach(function(plotType) {
		if ([AdevarBoardPointType.NORTH_RED_PLOT, AdevarBoardPointType.SOUTH_RED_PLOT].includes(plotType)) {
			message.push("A player may have up to two Basic tiles in each Red plot at a time");
		} else if ([AdevarBoardPointType.EAST_WHITE_PLOT, AdevarBoardPointType.WEST_WHITE_PLOT].includes(plotType)) {
			message.push("A player may have up to three Basic tiles in each White plot at a time");
		} else {
			message.push("Open plots have no Basic tile limit");
		}
	});

	if (boardPoint.plotTypes.length > 1) {
		message.push("A tile here is counted as 1/2 in each plot it is touching");
	}

	var self = this;

	boardPoint.plotTypes.forEach(function(plotType) {
		var hostPlotCount = self.theGame.board.getPlotCountForPlayer(plotType, HOST);
		var guestPlotCount = self.theGame.board.getPlotCountForPlayer(plotType, GUEST);
		message.push("Basic Tiles in " + plotType + ":<br />HOST: " + hostPlotCount + ", GUEST: " + guestPlotCount);
	});

	if (this.showLilyHelp) {
		this.showOrientalLilyHelp();
	} else {
		this.hideOrientalLilyHelp();
	}

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
	if (playingOnlineGame() && iAmPlayerInCurrentOnlineGame() && getOnlineGameOpponentUsername() != getUsername()) {
		new AdevarOptions();	// To set perspective...
		this.createActuator();
		clearMessage();
	}
};

AdevarController.prototype.getSandboxNotationMove = function(moveIndex) {
	return this.gameNotation.getMoveWithoutHiddenDetails(moveIndex);
};

AdevarController.prototype.setAnimationsOn = function(isAnimationsOn) {
	this.actuator.setAnimationOn(isAnimationsOn);
};
