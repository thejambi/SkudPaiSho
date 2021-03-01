/* Trifle specific UI interaction logic */

function Trifle() {}

Trifle.Controller = function(gameContainer, isMobile) {
	this.actuator = new TrifleActuator(gameContainer, isMobile);

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	this.isPaiShoGame = true;
}

Trifle.Controller.userIsTrifleDeveloper = function() {
	return usernameIsOneOf(
		);
};

Trifle.Controller.prototype.getGameTypeId = function() {
	return GameType.Trifle.id;
};

Trifle.Controller.prototype.resetGameManager = function() {
	this.theGame = new Trifle.GameManager(this.actuator);
};

Trifle.Controller.prototype.resetNotationBuilder = function() {
	var offerDraw = false;
	if (this.notationBuilder) {
		offerDraw = this.notationBuilder.offerDraw;
	}
	this.notationBuilder = new Trifle.NotationBuilder();
	if (offerDraw) {
		this.notationBuilder.offerDraw = true;
	}
	this.checkingOutOpponentTileOrNotMyTurn = false;
};

Trifle.Controller.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

Trifle.Controller.prototype.getNewGameNotation = function() {
	return new Trifle.GameNotation();
};

Trifle.Controller.getHostTilesContainerDivs = function() {
	return '';
}

Trifle.Controller.getGuestTilesContainerDivs = function() {
	return '';
};

Trifle.Controller.prototype.callActuate = function() {
	this.theGame.actuate();
};

Trifle.Controller.prototype.resetMove = function() {
	this.notationBuilder.offerDraw = false;
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	} else if (this.notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}

	rerunAll();
};

Trifle.Controller.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Trifle</h4> <p> <p>Trifle is inspired by Vagabond Pai Sho, the Pai Sho variant seen in the fanfiction story <a href='https://skudpaisho.com/site/more/fanfiction-recommendations/' target='_blank'>Gambler and Trifle (download here)</a>.</p> <p><strong>You win</strong> if you capture your opponent's Banner tile.</p> <p><strong>On a turn</strong>, you may either deploy a tile or move a tile.</p> <p><strong>You can't capture Flower/Banner tiles</strong> until your Banner has been deployed.<br /> <strong>You can't capture Non-Flower/Banner tiles</strong> until both players' Banner tiles have been deployed.</p> <p><strong>Hover</strong> over any tile to see how it works.</p> </p> <p>Select tiles to learn more or <a href='https://skudpaisho.com/site/games/trifle-pai-sho/' target='_blank'>view the rules</a>.</p>";
};

Trifle.Controller.prototype.getAdditionalMessage = function() {
	var msg = "";
	
	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by choosing your team. <br />";
		} else {
			msg += "Sign in to enable online gameplay. Or, start playing a local game by choosing your team.";
		}

		msg += getGameOptionsMessageHtml(GameType.Trifle.gameOptions);
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

Trifle.Controller.prototype.gameHasEndedInDraw = function() {
	return this.theGame.gameHasEndedInDraw;
};

Trifle.Controller.prototype.acceptDraw = function() {
	if (myTurn()) {
		this.promptToAcceptDraw = true;
		refreshMessage();
	}
};

Trifle.Controller.prototype.confirmAcceptDraw = function() {
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

Trifle.Controller.prototype.offerDraw = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = true;
		refreshMessage();
	}
};

Trifle.Controller.prototype.removeDrawOffer = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = false;
		refreshMessage();
	}
};

Trifle.Controller.prototype.unplayedTileClicked = function(tileDiv) {
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

	if (this.theGame.playersAreSelectingTeams()) {
		var selectedTile = new Trifle.Tile(tileCode, playerCode);
		if (tileDiv.classList.contains("selectedFromPile")) {
			debug("You picked one for the team!");
			var teamIsNowFull = this.theGame.addTileToTeam(selectedTile);
			if (teamIsNowFull) {
				debug("Gotta build notation");
				this.notationBuilder.moveType = TEAM_SELECTION;
				this.notationBuilder.teamSelection = this.theGame.getPlayerTeamSelectionTileCodeList(player);
				this.completeMove();
			}
		} else {
			// Need to remove from team instead
			debug("You are removing one from your team :(");
			this.theGame.removeTileFromTeam(selectedTile);
		}
	} else if (this.notationBuilder.status === BRAND_NEW) {
		debug("Yes, begin deploying!");
		// new Deploy turn
		tile.selectedFromPile = true;

		this.notationBuilder.moveType = DEPLOY;
		this.notationBuilder.tileType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.revealDeployPoints(tile.ownerName, tileCode);
	} else {
		this.theGame.hidePossibleMovePoints();
		this.resetNotationBuilder();
	}
}

Trifle.Controller.prototype.pointClicked = function(htmlPoint) {
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
				this.completeMove();
			} else {
				this.resetNotationBuilder();
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder();
		}
	}
};

Trifle.Controller.prototype.completeMove = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.theGame.runNotationMove(move);
	this.gameNotation.addMove(move);
	if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
		createGameIfThatIsOk(this.getGameTypeId());
	} else {
		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}
};

Trifle.Controller.prototype.skipHarmonyBonus = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);
	if (playingOnlineGame()) {
		callSubmitMove();
	} else {
		finalizeMove();
	}
}

Trifle.Controller.prototype.getTheMessage = function(tile, ownerName) {
	var message = [];

	var tileCode = tile.code;

	var heading = Trifle.Tile.getTileName(tileCode);

	if (tileCode === 'L') {
		heading = "White Lotus";
		message.push("Flower Tile");
		message.push("Can move 1 space");
	} else if (tileCode === 'S') {
		heading = "Sky Bison";
		// message.push("Deployed on the point inside of the small red triangles in the corners of the board");
		message.push("Deployed on the Temples - the points inside of the small red triangles in the corners of the board");
		message.push("Can move up to six spaces, turning any number of times, but cannot move into an opponent's Sky Bison's territorial zone");
		message.push("Cannot move through or off of a space that is adjacent to an opponent's Chrysanthemum tile");
		message.push("Can capture other tiles");
		// message.push("A Sky Bison has a territorial zone the size of the area the tile can move within. No other Sky Bison is allowed in this zone once the Sky Bison has moved out of its starting position.");
		message.push("After the Sky Bison has moved out of its temple and is not trapped by a Chrysanthemum, it creates a territorial zone 6 spaces around it");
	} else if (tileCode === 'B') {
		heading = "Badgermole";
		message.push("Can move only one space in any direction OR move directly adjacent to a Flower Tile if that Flower Tile is in the Badgermole's \"line of sight\" (meaning, the tiles lie on the same line with no other tiles in between)");
		message.push("Flower Tiles adjacent to a Badgermole are protected from capture");
	} else if (tileCode === 'W') {
		heading = "Wheel";
		message.push("Can move any number of spaces forwards, backwards, left, or right across the spaces of the board as opposed to diagonally on the lines");
		message.push("Can capture other tiles");
	} else if (tileCode === 'C') {
		heading = "Chrysanthemum";
		message.push("Flower Tile");
		message.push("Cannot move");
		message.push("Freezes opponent's Sky Bison tiles in place when adjacent");
	} else if (tileCode === 'F') {
		heading = "Fire Lily";
		message.push("Flower Tile");
		message.push("Cannot move");
		message.push("Enables deployment of White Dragon");
	} else if (tileCode === 'D') {
		heading = "White Dragon";
		message.push("Can be deployed in a 5-space area around the Fire Lily");
		message.push("Can move anywhere inside that 5-space Fire Lily zone");
		message.push("Can capture other tiles");
	}

	return {
		heading: heading,
		message: message
	}
}

Trifle.Controller.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new Trifle.Tile(divName.substring(1), divName.charAt(0));

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	return this.getTheMessage(tile, ownerName);
}

Trifle.Controller.prototype.getPointMessage = function(htmlPoint) {
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

Trifle.Controller.prototype.playAiTurn = function(finalizeMove) {
	// 
};

Trifle.Controller.prototype.startAiGame = function(finalizeMove) {
	// 
};

Trifle.Controller.prototype.getAiList = function() {
	return [];
}

Trifle.Controller.prototype.getCurrentPlayer = function() {
	if (currentMoveIndex % 2 === 0) {	// To get right player during replay...
		return HOST;
	} else {
		return GUEST;
	}
};

Trifle.Controller.prototype.cleanup = function() {
	// document.querySelector(".svgContainer").classList.remove("TrifleBoardRotate");
};

Trifle.Controller.prototype.isSolitaire = function() {
	return false;
};

Trifle.Controller.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

