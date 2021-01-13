
function MeadowController(gameContainer, isMobile) {
	if (!isMobile) {
		this.additionalTilePileClass = "desktop";
	} else {
		this.additionalTilePileClass = "";
	}

	this.actuator = new MeadowActuator(gameContainer, isMobile, this.getHostTilesContainerDivs(), this.getGuestTilesContainerDivs());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	// this.debugMessage = "";
}

MeadowController.prototype.getGameTypeId = function() {
	return GameType.Meadow.id;
};

/* Not required, but called from Main */
MeadowController.prototype.completeSetup = function() {
	/* Game setup completion steps here */
	/* Nothing to do */
};

/* Required */
MeadowController.prototype.resetGameManager = function() {
	/* this.theGame required by Main */
	this.theGame = new MeadowGameManager(this.actuator);
};

MeadowController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new MeadowNotationBuilder();
};

/* Not required or called from Main */
MeadowController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

/* Required by Main */
MeadowController.prototype.getNewGameNotation = function() {
	return new MeadowGameNotation();
};

/* Required by Main */
MeadowController.prototype.getHostTilesContainerDivs = function() {
	return "<div class='bloomsTileContainer'><div class='hexagon bloomsTilePileTile meadowH1 " + this.additionalTilePileClass + "' name='H1' onclick='gameController.unplayedTileClicked(this)'><span></span></div><div class='hexagon bloomsTilePileTile meadowH2 " + this.additionalTilePileClass + "' name='H2' onclick='gameController.unplayedTileClicked(this)'><span></span></div></div>";
};

/* Required by Main */
MeadowController.prototype.getGuestTilesContainerDivs = function() {
	return "<div class='bloomsTileContainer'><div class='hexagon bloomsTilePileTile meadowG1 " + this.additionalTilePileClass + "' name='G1' onclick='gameController.unplayedTileClicked(this)'><span></span></div><div class='hexagon bloomsTilePileTile meadowG2 " + this.additionalTilePileClass + "' name='G2' onclick='gameController.unplayedTileClicked(this)'><span></span></div></div>";
};

/* Required by Main */
MeadowController.prototype.callActuate = function() {
	this.theGame.actuate();
};

/* Required by Main */
MeadowController.prototype.resetMove = function() {
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
MeadowController.prototype.getDefaultHelpMessageText = function() {
	var msg = "<h4>Meadow</h4>"
	+ "<p><em>A game by <a href='https://www.nickbentley.games/meadow-rules-and-tips/' target='_blank'>Nick Bentley</a>.</em> Meadow is a minimalist 2-player strategy game inspired by the idea of flowers competing for space in a meadow.</p>"
	+ "<h4>Definitions</h4>"
	+ "<p><em><strong>Group:</strong></em> A <em>group</em> is an entire group of connected stones on the board of the same color. A single stone (unconnected to others of the same color) is also a group.</p>"
	+ "<p><em><strong>Smothered:</strong></em> A group is <em>smothered</em> when it is not touching any empty spaces.</p>"
	+ "<p><em><strong>Overgrown:</strong></em> A group is <em>overgrown</em> when is has more than 5 stones in it.</p>"
	+ "<h4>Gameplay</h4>"
	+ "<ol>"
	+ "<li>Each player owns 2 colors of stones. To start, the Host places 1 stone of either of his or her colors on any empty space.</li>"
	+ "<li>From then on, starting with the Guest, the players take turns. On your turn, you must place 1 or 2 stones onto any empty spaces (If you place 2, they must be different colors). Then, all <em>smothered</em> enemy groups are captured, and then <em>overgrown</em> enemy groups are captured.</li>"
	+ "<li>The first player to have captured the set target number of stones and advancing your score-keeping stone all the way around the scoring track, wins.</li>"
	+ "</ol>"
	+ "<p>Read the official rules and more about the game <a href='https://www.nickbentley.games/meadow-rules-and-tips/' target='_blank'>here</a>.</p>";

	if (gameOptionEnabled(DYNAMIC_GROUP_LIMIT)) {
		msg += "<p>Group limit based on board size is enabled, so the group limit is the size of the board instead of 5.</p>";
	}

	return msg;
};

/* Required by Main */
MeadowController.prototype.getAdditionalMessage = function() {
	var msg = "";

	if (this.gameNotation.moves.length === 0) {
		msg += "To begin a game, the Host places one stone.";
		msg += getGameOptionsMessageHtml(GameType.Meadow.gameOptions);
	}

	if (this.notationBuilder.selectedPiece) {
		msg += "<br />Place second stone or <span class='clickableText' onclick='gameController.skipSecondPiece();'>skip</span>";
		msg += getResetMoveText();
	}

	return msg;
};

/* Using my own version of this, called directly instead of from Main */
MeadowController.prototype.unplayedTileClicked = function(tilePileContainerDiv) {
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

	this.notationBuilder.selectedPiece = tileName;
	tilePileContainerDiv.classList.add('bloomsSelectedTile');
	this.selectedTilePileContainerDiv = tilePileContainerDiv;

	// this.debugMessage = this.notationBuilder.selectedPiece + "<br />";
	// clearMessage();
};

/* Required by Main Actuator creates anything that calls pointClicked in Main. Actuator could call something like this directly instead. */
MeadowController.prototype.pointClicked = function(htmlPoint, bloomId) {
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
			htmlPoint.classList.add("meadow" + this.notationBuilder.selectedPiece);
			
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
MeadowController.prototype.getTileMessage = function(tileDiv) {
	/* */
};

/* Called by Main if showPointMessage used in Actuator */
MeadowController.prototype.getPointMessage = function(htmlPoint) {
	/* */
};

/* Required by Main (maybe only if getAiList has contents) */
MeadowController.prototype.playAiTurn = function(finalizeMove) {
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
MeadowController.prototype.startAiGame = function(finalizeMove) {
	this.playAiTurn(finalizeMove);
};

/* Required by Main */
MeadowController.prototype.getAiList = function() {
	return [new MeadowRandomAIv1()];
	// return [];
};

/* Required by Main */
MeadowController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

/* Required by Main */
MeadowController.prototype.cleanup = function() {
	// Nothing to do
};

/* Required by Main */
MeadowController.prototype.isSolitaire = function() {
	return false;
};

/* Required by Main */
MeadowController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

MeadowController.prototype.clearSelectedTileEffects = function() {
	var tilePileTiles = document.getElementsByClassName('bloomsTilePileTile');
	for (var i = 0; i < tilePileTiles.length; i++) {
		tilePileTiles[i].classList.remove('bloomsSelectedTile');
	}
};

MeadowController.prototype.restoreTilePileContainerDivs = function() {
	var tilePileTiles = document.getElementsByClassName('bloomsTilePileTile');
	for (var i = 0; i < tilePileTiles.length; i++) {
		tilePileTiles[i].classList.remove('hexagonNoShow');
	}
};

MeadowController.prototype.revealBloom = function(bloomId) {
	if (this.revealBloomInBoardState(bloomId)) {
		this.actuateToRevealBloom();
	}
};

MeadowController.prototype.revealBloomInBoardState = function(bloomId) {
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

MeadowController.prototype.actuateToRevealBloom = function() {
	this.callActuate();

	if (this.actuator.isMobile) {
		var self = this;
		setTimeout(function() {
			self.clearRevealedBloom();
		}, 400);
	}
};

MeadowController.prototype.clearRevealedBloomId = function(bloomId) {
	if (bloomId >= 0 && bloomId === this.revealedBloomId) {
		this.clearRevealedBloom(); 
	}
};

MeadowController.prototype.clearRevealedBloom = function() {
	this.revealedBloomId = -1;
	this.theGame.board.clearRevealedBloom();
	this.callActuate();
};

MeadowController.prototype.skipSecondPiece = function() {
	this.completeMove();
};

MeadowController.prototype.completeMove = function() {
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

MeadowController.prototype.playRandomMove = function() {
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

MeadowController.prototype.playABunchOfRandomMoves = function(howMany) {
	for (var i = 0; i < howMany; i++) {
		this.playRandomMove();
	}
};

/* Called by Main, not required */
MeadowController.prototype.optionOkToShow = function(option) {
	if (option === FOUR_SIDED_BOARD) {
		return !gameOptionEnabled(SIX_SIDED_BOARD)
			&& !gameOptionEnabled(EIGHT_SIDED_BOARD);
	} else if (option === SIX_SIDED_BOARD) {
		return !gameOptionEnabled(FOUR_SIDED_BOARD)
			&& !gameOptionEnabled(EIGHT_SIDED_BOARD);
	} else if (option === EIGHT_SIDED_BOARD) {
		return !gameOptionEnabled(SIX_SIDED_BOARD)
			&& !gameOptionEnabled(FOUR_SIDED_BOARD);
	} else if (option === DYNAMIC_GROUP_LIMIT) {
		return gameOptionEnabled(FOUR_SIDED_BOARD)
			|| gameOptionEnabled(SIX_SIDED_BOARD)
			|| gameOptionEnabled(EIGHT_SIDED_BOARD);
	} else {
		return true;
	}
};

