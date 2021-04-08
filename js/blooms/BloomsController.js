
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
	return "<h4>Blooms</h4>"
	+ "<p><em>A game by <a href='https://www.nickbentley.games/blooms-rules/' target='_blank'>Nick Bentley</a>.</em> Blooms is a territory game that's a bit like the classical game Go, but shorter, easier to learn, and more colorful.</p>"
	+ "<h4>Definitions</h4>"
	+ "<p><em><strong>Bloom:</strong></em> A <em>bloom</em> is an entire group of connected stones on the board of the same color. A single stone (unconnected to others of the same color) is also a bloom.</p>"
	+ "<p><em><strong>Fenced:</strong></em> A bloom is <em>fenced</em> when there are no empty spaces adjacent to any of the bloom's stones.</p>"
	+ "<h4>Gameplay</h4>"
	+ "<ol>"
	+ "<li>Each player owns 2 colors of stones. To start, the Host places 1 stone of either of his or her colors on any empty space.</li>"
	+ "<li>From then on, starting with the Guest, the players take turns. On your turn, you must place 1 or 2 stones onto any empty spaces. If you place 2, they must be different colors. Then, all fenced enemy blooms are captured.</li>"
	+ "<li>The first player to have captured the set target number of stones and advancing your score-keeping stone all the way around the scoring track, wins.</li>"
	+ "</ol>"
	+ "<p>Read the official rules and more about the game <a href='https://www.nickbentley.games/blooms-rules/' target='_blank'>here</a>.</p>";
};

/* Required by Main */
BloomsController.prototype.getAdditionalMessage = function() {
	var msg = "";

	if (this.gameNotation.moves.length === 0) {
		msg += "To begin a game, the Host places one stone.";
		msg += getGameOptionsMessageHtml(GameType.Blooms.gameOptions);
	}

	if (this.notationBuilder.selectedPiece) {
		msg += "<br />Place second stone or <span class='clickableText' onclick='gameController.skipSecondPiece();'>skip</span>";
		msg += getResetMoveText();
	}

	return msg;
};

/* Using my own version of this, called directly instead of from Main */
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
BloomsController.prototype.pointClicked = function(htmlPoint, bloomId) {
	var npText = htmlPoint.getAttribute("name"); // like 'f5'

	if (this.theGame.pointIsOpen(npText)) {
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
	} else if (this.actuator.isMobile) {
		this.revealBloom(bloomId);
	}
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
	if (this.theGame.getWinner()) {
		return;
	}
	var theAi = activeAi;
	// if (activeAi2) {
	// 	if (activeAi2.player === getCurrentPlayer()) {
	// 		theAi = activeAi2;
	// 	}
	// }
	if (theAi) {
		this.playRandomMove();
	}
};

/* Required by Main (maybe only if getAiList has contents) */
BloomsController.prototype.startAiGame = function(finalizeMove) {
	this.playAiTurn(finalizeMove);
};

/* Required by Main */
BloomsController.prototype.getAiList = function() {
	return [new BloomsRandomAIv1()];
	// return [];
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
	// Nothing to do
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
	if (this.revealBloomInBoardState(bloomId)) {
		this.actuateToRevealBloom();
	}
};

BloomsController.prototype.revealBloomInBoardState = function(bloomId) {
	var prevRevealedBloomId = this.revealedBloomId;

	this.revealedBloomId = bloomId;

	var needActuate = prevRevealedBloomId !== bloomId && bloomId >= 0;
	
	if (prevRevealedBloomId >= 0) {
		this.theGame.board.clearRevealedBloom();
	}

	if (bloomId >= 0) {
		this.theGame.board.markBloomRevealed(bloomId);
	}

	return needActuate || this.actuator.isMobile;
};

BloomsController.prototype.actuateToRevealBloom = function() {
	this.callActuate();

	if (this.actuator.isMobile) {
		var self = this;
		setTimeout(function() {
			self.clearRevealedBloom();
		}, 400);
	}
};

BloomsController.prototype.clearRevealedBloomId = function(bloomId) {
	if (bloomId >= 0 && bloomId === this.revealedBloomId) {
		this.clearRevealedBloom(); 
	}
};

BloomsController.prototype.clearRevealedBloom = function() {
	this.revealedBloomId = -1;
	this.theGame.board.clearRevealedBloom();
	this.callActuate();
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

BloomsController.prototype.playRandomMove = function() {
	if (myTurn()) {
		var playerName = this.getCurrentPlayer();

		var tilePile1 = document.getElementsByName("H1")[0];
		var tilePile2 = document.getElementsByName("H2")[0];
		if (playerName === GUEST) {
			tilePile1 = document.getElementsByName("G1")[0];
			tilePile2 = document.getElementsByName("G2")[0];
		}

		// Click pile 1, then click open point
		tilePile1.click();
		var openPoint = this.theGame.board.getRandomOpenPoint();
		var pointName = openPoint.getNotationPointString();
		var pointElement = document.getElementsByName(pointName)[0];
		pointElement.click();

		// Click pile 2, then click open point
		tilePile2.click();
		openPoint = this.theGame.board.getRandomOpenPoint();
		pointName = openPoint.getNotationPointString();
		pointElement = document.getElementsByName(pointName)[0];
		pointElement.click();
	}
};

BloomsController.prototype.playABunchOfRandomMoves = function(howMany) {
	for (var i = 0; i < howMany; i++) {
		this.playRandomMove();
	}
};

/* Called by Main, not required */
BloomsController.prototype.optionOkToShow = function(option) {
	if (option === FOUR_SIDED_BOARD) {
		return !gameOptionEnabled(SIX_SIDED_BOARD)
			&& !gameOptionEnabled(EIGHT_SIDED_BOARD);
	} else if (option === SIX_SIDED_BOARD) {
		return !gameOptionEnabled(FOUR_SIDED_BOARD)
			&& !gameOptionEnabled(EIGHT_SIDED_BOARD);
	} else if (option === EIGHT_SIDED_BOARD) {
		return !gameOptionEnabled(SIX_SIDED_BOARD)
			&& !gameOptionEnabled(FOUR_SIDED_BOARD);
	} else {
		return true;
	}
};

