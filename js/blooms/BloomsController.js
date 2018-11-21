
function BloomsController(gameContainer, isMobile) {
	if (!isMobile) {
		this.additionalTilePileClass = "desktop";
	} else {
		this.additionalTilePileClass = "";
	}

	this.actuator = new BloomsActuator(gameContainer, isMobile, this.getHostTilesContainerDivs(), this.getGuestTilesContainerDivs());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	// this.debugMessage = "";
}

BloomsController.prototype.getGameTypeId = function() {
	return GameType.Blooms.id;
};

/* Not required, but called from Main */
BloomsController.prototype.completeSetup = function() {
	/* Game setup completion steps here */
	/* Nothing to do */
};

/* Required */
BloomsController.prototype.resetGameManager = function() {
	/* this.theGame required by Main */
	this.theGame = new BloomsGameManager(this.actuator);
};

BloomsController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new BloomsNotationBuilder();
};

/* Not required or called from Main */
BloomsController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

/* Required by Main */
BloomsController.prototype.getNewGameNotation = function() {
	return new BloomsGameNotation();
};

/* Required by Main */
BloomsController.prototype.getHostTilesContainerDivs = function() {
	return "<div class='bloomsTileContainer'><div class='hexagon bloomsTilePileTile bloomsH1 " + this.additionalTilePileClass + "' name='H1' onclick='gameController.unplayedTileClicked(this)'><span></span></div><div class='hexagon bloomsTilePileTile bloomsH2 " + this.additionalTilePileClass + "' name='H2' onclick='gameController.unplayedTileClicked(this)'><span></span></div></div>";
};

/* Required by Main */
BloomsController.prototype.getGuestTilesContainerDivs = function() {
	return "<div class='bloomsTileContainer'><div class='hexagon bloomsTilePileTile bloomsG1 " + this.additionalTilePileClass + "' name='G1' onclick='gameController.unplayedTileClicked(this)'><span></span></div><div class='hexagon bloomsTilePileTile bloomsG2 " + this.additionalTilePileClass + "' name='G2' onclick='gameController.unplayedTileClicked(this)'><span></span></div></div>";
};

/* Required by Main */
BloomsController.prototype.callActuate = function() {
	this.theGame.actuate();
};

/* Required by Main */
BloomsController.prototype.resetMove = function() {
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
BloomsController.prototype.getDefaultHelpMessageText = function() {
	// return "<h4>Blooms</h4><br /><p>" + this.debugMessage + "</p>";
	return "<h4>Blooms</h4>";
};

/* Required by Main */
BloomsController.prototype.getAdditionalMessage = function() {
	var msg = "";

	if (this.gameNotation.moves.length === 0) {
		msg += "To begin a game, the Host places one piece.";
		msg += getGameOptionsMessageHtml(GameType.Blooms.gameOptions);
	}

	if (this.notationBuilder.selectedPiece) {
		msg += "<br />Place second piece or <span class='clickableText' onclick='gameController.skipSecondPiece();'>skip</span>";
		msg += getResetMoveText();
	}

	return msg;
};

/* Using my owne version of this, called directly instead of from Main */
BloomsController.prototype.unplayedTileClicked = function(tilePileContainerDiv) {
	this.clearSelectedTileEffects();

	this.notationBuilder.selectedPiece = null;

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

	if (player !== getCurrentPlayer()) {
		return;
	}

	// this.debugMessage = "Unplayed tile clicked<br />";

	if (tileName !== this.notationBuilder.piece1) {
		this.notationBuilder.selectedPiece = tileName;
		tilePileContainerDiv.classList.add('bloomsSelectedTile');
		this.selectedTilePileContainerDiv = tilePileContainerDiv;
	}

	// this.debugMessage = this.notationBuilder.selectedPiece + "<br />";
	// clearMessage();
};

/* Required by Main Actuator creates anything that calls pointClicked in Main. Actuator could call something like this directly instead. */
BloomsController.prototype.pointClicked = function(htmlPoint) {
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

	if (!this.notationBuilder.selectedPiece) {
		return;
	}

	this.clearSelectedTileEffects();

	var npText = htmlPoint.getAttribute("name"); // like 'f5'

	if (this.theGame.pointIsOpen(npText)) {
		this.notationBuilder.setDeployPoint(npText);

		// This can be removed since half-actuate works now, but it doesn't hurt
		htmlPoint.classList.add("blooms" + this.notationBuilder.selectedPiece);
		
		if (this.notationBuilder.moveComplete() || this.gameNotation.moves.length === 0) {
			this.completeMove();
		} else {
			// Half-move actuate
			// Get move and run it, but don't add to gameNotation
			if (this.selectedTilePileContainerDiv) {
				this.selectedTilePileContainerDiv.classList.add('hexagonNoShow');
			}
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.runNotationMove(move, true, true);
			refreshMessage();
		}
	}
	
	this.notationBuilder.selectedPiece = null;
};

/* Called by Main if showTileMessage used in Actuator */
BloomsController.prototype.getTileMessage = function(tileDiv) {
	/* */
};

/* Called by Main if showPointMessage used in Actuator */
BloomsController.prototype.getPointMessage = function(htmlPoint) {
	/* */
};

/* Required by Main (maybe only if getAiList has contents) */
BloomsController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

/* Required by Main (maybe only if getAiList has contents) */
BloomsController.prototype.startAiGame = function(finalizeMove) {
	// 
};

/* Required by Main */
BloomsController.prototype.getAiList = function() {
	return [];
};

/* Required by Main */
BloomsController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

/* Required by Main */
BloomsController.prototype.cleanup = function() {
	// 
};

/* Required by Main */
BloomsController.prototype.isSolitaire = function() {
	return false;
};

/* Required by Main */
BloomsController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

BloomsController.prototype.clearSelectedTileEffects = function() {
	var tilePileTiles = document.getElementsByClassName('bloomsTilePileTile');
	for (var i = 0; i < tilePileTiles.length; i++) {
		tilePileTiles[i].classList.remove('bloomsSelectedTile');
	}
};

BloomsController.prototype.restoreTilePileContainerDivs = function() {
	var tilePileTiles = document.getElementsByClassName('bloomsTilePileTile');
	for (var i = 0; i < tilePileTiles.length; i++) {
		tilePileTiles[i].classList.remove('hexagonNoShow');
	}
};

BloomsController.prototype.revealBloom = function(bloomId) {
	var prevRevealedBloomId = this.revealedBloomId;

	this.revealedBloomId = bloomId;

	var needActuate = prevRevealedBloomId !== bloomId
		&& prevRevealedBloomId >= 0 
		&& bloomId >= 0;
	
	if (prevRevealedBloomId >= 0) {
		this.theGame.board.clearRevealedBloom();
	}

	if (bloomId >= 0) {
		this.theGame.board.markBloomRevealed(bloomId);
	}

	if (needActuate) {
		this.callActuate();
	}
};

BloomsController.prototype.skipSecondPiece = function() {
	this.completeMove();
};

BloomsController.prototype.completeMove = function() {
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

