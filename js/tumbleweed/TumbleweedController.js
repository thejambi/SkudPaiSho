
function TumbleweedController(gameContainer, isMobile) {
	if (!isMobile) {
		this.additionalTilePileClass = "desktop";
	} else {
		this.additionalTilePileClass = "";
	}

	this.actuator = new TumbleweedActuator(gameContainer, isMobile, this.getHostTilesContainerDivs(), this.getGuestTilesContainerDivs());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();
}

TumbleweedController.prototype.getGameTypeId = function() {
	return GameType.Tumbleweed.id;
};

/* Not required, but called from Main */
TumbleweedController.prototype.completeSetup = function() {
	/* Game setup completion steps here */
	/* Nothing to do */
};

/* Required */
TumbleweedController.prototype.resetGameManager = function() {
	/* this.theGame required by Main */
	this.theGame = new TumbleweedGameManager(this.actuator);
};

TumbleweedController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new TumbleweedNotationBuilder();
};

/* Not required or called from Main */
TumbleweedController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

/* Required by Main */
TumbleweedController.prototype.getNewGameNotation = function() {
	return new TumbleweedGameNotation();
};

/* Required by Main */
TumbleweedController.prototype.getHostTilesContainerDivs = function() {
	return "<div class='bloomsTileContainer'><div id='tumbleweedHostContainer' class='hexagon bloomsTilePileTile bloomsG1 " + this.additionalTilePileClass + "' name='H1' onclick='gameController.unplayedTileClicked(this)'><span></span></div></div>";
};

/* Required by Main */
TumbleweedController.prototype.getGuestTilesContainerDivs = function() {
	return "<div class='bloomsTileContainer'><div id='tumbleweedGuestContainer' class='hexagon bloomsTilePileTile bloomsH2 " + this.additionalTilePileClass + "' name='G1' onclick='gameController.unplayedTileClicked(this)'><span></span></div></div>";
};

/* Required by Main */
TumbleweedController.prototype.callActuate = function() {
	this.theGame.actuate();
};

/* Required by Main */
TumbleweedController.prototype.resetMove = function() {
	if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		// just rerun
	} else {
		// Remove last move
		this.gameNotation.removeLastMove();
	}

	this.clearSelectedTileEffects();
	this.restoreTilePileContainerDivs();

	rerunAll();
};

/* Required by Main */
TumbleweedController.prototype.getDefaultHelpMessageText = function() {
	var msg = "<h4>Tumbleweed</h4>"
	+ "<p>Created by Michał Zapała in 2020, Tumbleweed belongs to the territory family of games such as Go.</p>"
	+ "<p>The winner is the player that occupies the most spaces at the end of the game.</p>"
	+ "<p>On a turn, you may settle in a space or pass your turn.</p>"
	+ "<p>When settling a space, you place a stack of pieces on a space:"
	+ "<ul><li>The number of pieces in the placed stack is the number of spaces occupied by the player in the space’s line of sight";
	if (gameOptionEnabled(RUMBLEWEED)) {
		msg += " (plus 1 for Rumbleweed rules)";
	}
	msg += "</li>"
	+ "<li>If the space is occupied, the stack being placed must be larger than the stack already occupying the space</li></ul>"
	+ "<p>The board begins with a neutral settlement of 2 in the center. This stack may be overtaken as any other stack.</p>";

	msg += "<p>- See Tumbleweed on <a href='https://www.boardgamegeek.com/boardgame/318702/tumbleweed' target='_blank'>BoardGameGeek</a>";
	msg += "<br />- Watch a <a href='https://www.youtube.com/watch?v=mjA_g3nwYW4' target='_blank'>video explanation of the rules</a>";
	msg += "</p>";

	var gameOptionsEnabled = getEnabledGameOptions();
	if (gameOptionsEnabled.length > 0) {
		msg += "<p><strong>Game Options Enabled:</strong>";
		msg += "<br />";
		for (var i = 0; i < gameOptionsEnabled.length; i++) {
			msg += "<p>- ";
			msg += getGameOptionDescription(gameOptionsEnabled[i]);
			msg += "<br /><em>" + this.getGameOptionExplanation(gameOptionsEnabled[i]) + "</em>";
			msg += "</p>";
		}
		msg += "</p>";
	}

	return msg;
};

/* Required by Main */
TumbleweedController.prototype.getAdditionalMessage = function() {
	var msg = "";

	if (!this.theGame.getWinner()) {
		if (this.gameNotation.moves.length < TumbleweedController.getGameSetupCompleteMoveNumber()) {
			msg += "To begin a game, the Host places one of the Guest's pieces (red), and then one of their own.";
			if (gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE)) {
				msg += "<br />The Host will then place a neutral settlement of value 2 on the board.";
			}
			msg += "<br />Then the Guest will choose to begin playing or swap the position of the pieces on the board.";
			if (this.gameNotation.moves.length === 0) {
				msg += getGameOptionsMessageHtml(GameType.Tumbleweed.gameOptions);
			}
		} else if (this.gameNotation.moves.length === TumbleweedController.getGameSetupCompleteMoveNumber() && !gameOptionEnabled(NO_SETUP_PHASE)) {
			msg += "<br />Make the first move or choose to <span class='skipBonus' onclick='gameController.doSwap();'>swap initial pieces</span><br />";
		} else if (this.gameNotation.moves.length > TumbleweedController.getGameSetupCompleteMoveNumber()) {
			if (this.theGame.passInSuccessionCount === 1) {
				msg += "<br />" + getOpponentName(this.getCurrentPlayer()) + " has passed. Passing now will end the game and total territory will be counted.";
			}
			msg += "<br /><span class='skipBonus' onclick='gameController.passTurn();'>Pass turn</span><br />";
			msg += "<br /><span>Host settlements: " + this.theGame.hostScore + "</span>";
			msg += "<br /><span>Guest settlements: " + this.theGame.guestScore + "</span>";
		}
	}

	return msg;
};

/* Using my own version of this, called directly instead of from Main */
TumbleweedController.prototype.unplayedTileClicked = function(tilePileContainerDiv) {
	this.clearSelectedTileEffects();

	if (this.theGame.hasEnded()) {
		return;
	}
	if (!myTurn()) {
		return;
	}
	var tileName = tilePileContainerDiv.getAttribute("name");
	var playerCode = tileName.charAt(0);

	var player = GUEST;
	if (playerCode === hostPlayerCode) {
		player = HOST;
	}

	if (player !== getCurrentPlayer() && this.gameNotation.moves.length >= TumbleweedController.getGameSetupCompleteMoveNumber()) {
		return;
	}

	if (this.gameNotation.moves.length === 0) {
		// Override to have click affect GUEST piece
		tilePileContainerDiv = document.getElementById('tumbleweedGuestContainer');
	} else if (this.gameNotation.moves.length === 1) {
		// Override to have click affect HOST piece
		tilePileContainerDiv = document.getElementById('tumbleweedHostContainer');
	}

	tilePileContainerDiv.classList.add('bloomsSelectedTile');

	if (this.notationBuilder.status === BRAND_NEW) {
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;
		if (this.gameNotation.moves.length < TumbleweedController.getGameSetupCompleteMoveNumber()) {
			this.theGame.revealPossibleInitialPlacementPoints();
			var forPlayer = GUEST;
			if (this.gameNotation.moves.length === 1 || gameOptionEnabled(NO_SETUP_PHASE)) {
				forPlayer = HOST;
			} else if (gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE) && this.gameNotation.moves.length === 2) {
				forPlayer = "NEUTRAL";
			}
			this.notationBuilder.initialPlacementForPlayer = forPlayer;
		} else if (gameOptionEnabled(NO_SETUP_PHASE) && this.gameNotation.moves.length === 1) {
			this.theGame.revealPossibleInitialPlacementPoints();
			this.notationBuilder.initialPlacementForPlayer = GUEST;
		} else {
			this.theGame.revealPossibleSettlePoints(getCurrentPlayer());
		}
	} else {
		this.theGame.hidePossibleSettlePoints();
		this.resetNotationBuilder();
	}
};

/* Required by Main Actuator creates anything that calls pointClicked in Main. Actuator could call something like this directly instead. */
TumbleweedController.prototype.pointClicked = function(htmlPoint) {
	if (this.theGame.hasEnded()) {
		return;
	}
	if (!myTurn()) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	if (this.notationBuilder.status === BRAND_NEW) {
		if (this.gameNotation.moves.length < TumbleweedController.getGameSetupCompleteMoveNumber()) {
			this.theGame.revealPossibleInitialPlacementPoints(true);
			var forPlayer = GUEST;
			if (this.gameNotation.moves.length === 1 || gameOptionEnabled(NO_SETUP_PHASE)) {
				forPlayer = HOST;
			} else if (gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE) && this.gameNotation.moves.length === 2) {
				forPlayer = "NEUTRAL";
			}
			this.notationBuilder.initialPlacementForPlayer = forPlayer;
		} else if (gameOptionEnabled(NO_SETUP_PHASE) && this.gameNotation.moves.length === 1) {
			this.theGame.revealPossibleInitialPlacementPoints(true);
			this.notationBuilder.initialPlacementForPlayer = GUEST;
		} else {
			this.theGame.revealPossibleSettlePoints(getCurrentPlayer(), true);
		}
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;
	}

	var npText = htmlPoint.getAttribute("name"); // like 'f5'

	var boardPoint = this.theGame.board.getBoardPointFromNotationPoint(npText);

	/* Fake hover effect */
	if (this.actuator.isMobile) {
		htmlPoint.classList.add("hexagonHover");
		setTimeout(function() { htmlPoint.classList.remove("hexagonHover") }, 400);
	}

	if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.types.includes(POSSIBLE_MOVE)) {
			this.clearSelectedTileEffects();

			var npText = htmlPoint.getAttribute("name"); // like 'f5'

			this.notationBuilder.setDeployPoint(npText);
			this.completeMove();
		}
	}
};

/* Called by Main if showTileMessage used in Actuator */
TumbleweedController.prototype.getTileMessage = function(tileDiv) {
	/* */
};

/* Called by Main if showPointMessage used in Actuator */
TumbleweedController.prototype.getPointMessage = function(htmlPoint) {
	/* */
};

/* Required by Main (maybe only if getAiList has contents) */
TumbleweedController.prototype.playAiTurn = function(finalizeMove) {
	if (this.theGame.getWinner()) {
		return;
	}
	var theAi = activeAi;
	if (activeAi2) {
		if (activeAi2.player === getCurrentPlayer()) {
			theAi = activeAi2;
		}
	}

	var playerMoveNum = this.gameNotation.getPlayerMoveNum();

	var self = this;
	setTimeout(function() {
		var move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);
		if (!move) {
			debug("No move given...");
			return;
		}
		self.gameNotation.addMove(move);
		finalizeMove();
	}, 10);
};

/* Required by Main (maybe only if getAiList has contents) */
TumbleweedController.prototype.startAiGame = function(finalizeMove) {
	this.playAiTurn(finalizeMove);
};

/* Required by Main */
TumbleweedController.prototype.getAiList = function() {
	return [new TumbleweedRandomAIv1()];
	// return [];
};

/* Required by Main */
TumbleweedController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length < TumbleweedController.getGameSetupCompleteMoveNumber()) {
		return HOST;
	} else if (this.gameNotation.moves.length % 2 === 0) {
		if (gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE) || gameOptionEnabled(NO_SETUP_PHASE)) {
			return HOST;
		}
		return GUEST;
	} else {
		if (gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE) || gameOptionEnabled(NO_SETUP_PHASE)) {
			return GUEST;
		}
		return HOST;
	}
};

/* Required by Main */
TumbleweedController.prototype.cleanup = function() {
	// Nothing to do
};

/* Required by Main */
TumbleweedController.prototype.isSolitaire = function() {
	return false;
};

/* Required by Main */
TumbleweedController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

TumbleweedController.prototype.clearSelectedTileEffects = function() {
	var tilePileTiles = document.getElementsByClassName('bloomsTilePileTile');
	for (var i = 0; i < tilePileTiles.length; i++) {
		tilePileTiles[i].classList.remove('bloomsSelectedTile');
	}
};

TumbleweedController.prototype.restoreTilePileContainerDivs = function() {
	var tilePileTiles = document.getElementsByClassName('bloomsTilePileTile');
	for (var i = 0; i < tilePileTiles.length; i++) {
		tilePileTiles[i].classList.remove('hexagonNoShow');
	}
};

TumbleweedController.prototype.completeMove = function() {
	this.restoreTilePileContainerDivs();
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.theGame.runNotationMove(move);

	// Move all set. Add it to the notation!
	this.gameNotation.addMove(move);
	if (onlinePlayEnabled && this.gameNotation.moves.length === TumbleweedController.getGameSetupCompleteMoveNumber()) {
		createGameIfThatIsOk(this.getGameTypeId());
	} else {
		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}
};

TumbleweedController.getGameSetupCompleteMoveNumber = function() {
	if (gameOptionEnabled(NO_SETUP_PHASE)) {
		return 1;
	}
	return gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE) ? 3 : 2;
};

/* Called by Main, not required */
TumbleweedController.prototype.optionOkToShow = function(option) {
	if (option === HEXHEX_11) {
		return !gameOptionEnabled(HEXHEX_6);
	} else if (option === HEXHEX_6) {
		return !gameOptionEnabled(HEXHEX_11);
	} else if (option === NO_REINFORCEMENT) {
		return !gameOptionEnabled(TUMPLETORE);	// No Reinforcement is naturally built into Tumpletore
	} else if (option === RUMBLEWEED) {
		return !gameOptionEnabled(TUMPLETORE);
	} else if (option === TUMPLETORE) {
		return !gameOptionEnabled(RUMBLEWEED)
			&& !gameOptionEnabled(TUMBLE_6);
	} else if (option === TUMBLE_6) {
		return !gameOptionEnabled(TUMPLETORE);
	} else if (option === CRUMBLEWEED) {
		return !gameOptionEnabled(TUMPLETORE);
	} else if (option === NO_SETUP_PHASE) {
		return !gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE);
	} else if (option === CHOOSE_NEUTRAL_STACK_SPACE) {
		return !gameOptionEnabled(NO_SETUP_PHASE);
	} else {
		return true;
	}
};

TumbleweedController.prototype.getGameOptionExplanation = function(option) {
	switch (option) {
		case HEXHEX_11:
			return "Play on a hexhex11 board, the full-sized board used for competitive games.";
		case HEXHEX_6:
			return "Play on a hexhex6 board for an even shorter game.";
		case NO_REINFORCEMENT:
			return "Settling in a space you occupy is not allowed.";
		case CHOOSE_NEUTRAL_STACK_SPACE:
			return "The Host chooses where to place the initial neutral settlement.";
		case RUMBLEWEED:
			return "When settling, select any space and build a settlement with a value of ONE MORE than the number of spaces you occupy in line of sight (even if there are no sights on it), as long as the settlement value increases.";
		case CRUMBLEWEED:
			return "When settling, build a settlement with a value based on the number of spaces your opponent occupies in line of sight.";
		case TUMBLE_6:
			return "Additional win condition: The first player to build a settlement of value 6 is the winner.";
		case TUMPLETORE:
			return "No settlement values are used. You may settle in a space where you have more pieces in line of sight than your opponent does.";
		case NO_SETUP_PHASE:
			return "Setup phase of neutral settlement placement and pie rule are skipped. Players may choose their initial settlement position, starting with the Host.";
	}
};

TumbleweedController.prototype.doSwap = function() {
	if (this.gameNotation.moves.length === TumbleweedController.getGameSetupCompleteMoveNumber()) {
		this.notationBuilder.swap = true;
		this.completeMove();
	}
};

TumbleweedController.prototype.passTurn = function() {
	if (this.gameNotation.moves.length > TumbleweedController.getGameSetupCompleteMoveNumber()) {
		this.notationBuilder.passTurn = true;
		this.completeMove();
	}
};

TumbleweedController.prototype.readyToShowPlayAgainstAiOption = function() {
	return this.gameNotation.moves.length === TumbleweedController.getGameSetupCompleteMoveNumber();
};
