
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

	// this.debugMessage = "";
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
	return "<div class='bloomsTileContainer'><div class='hexagon bloomsTilePileTile bloomsG1 " + this.additionalTilePileClass + "' name='H1' onclick='gameController.unplayedTileClicked(this)'><span></span></div></div>";
};

/* Required by Main */
TumbleweedController.prototype.getGuestTilesContainerDivs = function() {
	return "<div class='bloomsTileContainer'><div class='hexagon bloomsTilePileTile bloomsH2 " + this.additionalTilePileClass + "' name='G1' onclick='gameController.unplayedTileClicked(this)'><span></span></div></div>";
};

/* Required by Main */
TumbleweedController.prototype.callActuate = function() {
	this.theGame.actuate();
};

/* Required by Main */
TumbleweedController.prototype.resetMove = function() {
	if (this.notationBuilder.piece1 && this.notationBuilder.deployPoint1) {
		// Restore first piece, then just rerun
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
	return "<h4>Tumbleweed</h4>"
	+ "<p>It's a game!</p>";
};

/* Required by Main */
TumbleweedController.prototype.getAdditionalMessage = function() {
	var msg = "";

	if (this.gameNotation.moves.length === 0) {
		msg += "To begin a game, the Host places one stone.";
		msg += getGameOptionsMessageHtml(GameType.Tumbleweed.gameOptions);
	}

	// if (this.notationBuilder.selectedPiece) {
	// 	msg += "<br />Place second stone or <span class='clickableText' onclick='gameController.skipSecondPiece();'>skip</span>";
	// 	msg += getResetMoveText();
	// }

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

	if (player !== getCurrentPlayer() && this.gameNotation.moves.length > 2) {
		return;
	}

	tilePileContainerDiv.classList.add('bloomsSelectedTile');
	this.selectedTilePileContainerDiv = tilePileContainerDiv;

	if (this.notationBuilder.status === BRAND_NEW) {
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;
		if (this.gameNotation.moves.length <= 1) {
			this.theGame.revealPossibleInitialPlacementPoints();
			var forPlayer = HOST;
			if (this.gameNotation.moves.length == 1) {
				forPlayer = GUEST;
			}
			this.notationBuilder.initialPlacementForPlayer = forPlayer;
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
	var npText = htmlPoint.getAttribute("name"); // like 'f5'

	var boardPoint = this.theGame.board.getBoardPointFromNotationPoint(npText);

	/* Fake hover effect */
	if (this.actuator.isMobile) {
		htmlPoint.classList.add("hexagonHover");
		setTimeout(function() { htmlPoint.classList.remove("hexagonHover") }, 400);
	}

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
	// ... ?
};

/* Required by Main (maybe only if getAiList has contents) */
TumbleweedController.prototype.startAiGame = function(finalizeMove) {
	this.playAiTurn(finalizeMove);
};

/* Required by Main */
TumbleweedController.prototype.getAiList = function() {
	// return [new TumbleweedRandomAIv1()];
	return [];
};

/* Required by Main */
TumbleweedController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length <= 1) {
		return HOST;
	} else if (this.gameNotation.moves.length % 2 === 0) {
		return GUEST;
	} else {
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

/* Called by Main, not required */
TumbleweedController.prototype.optionOkToShow = function(option) {
	return true;
};

