
function HexentaflController(gameContainer, isMobile) {
	if (!isMobile) {
		this.additionalTilePileClass = "desktop";
	} else {
		this.additionalTilePileClass = "";
	}

	/* Board setup code determines initial tile placement pattern on the board. */
	this.hostBoardSetupCode = 1;
	this.guestBoardSetupCode = 1;

	this.actuator = new HexentaflActuator(gameContainer, isMobile, this.getHostTilesContainerDivs(), this.getGuestTilesContainerDivs());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();
}

HexentaflController.prototype.getGameTypeId = function() {
	return GameType.Hexentafl.id;
};

/* Not required, but called from Main */
HexentaflController.prototype.completeSetup = function() {
	// Create initial board setup
	this.addSetupForPlayerCode('H', this.hostBoardSetupCode);
	this.addSetupForPlayerCode('G', this.guestBoardSetupCode);

	// Finish with actuate
	rerunAll();
	this.callActuate();
};

HexentaflController.prototype.addSetupForPlayerCode = function(playerCode, boardSetupCode) {
	/* Create initial board setup based on board setup code. 
	 * (In the future, more board setup options could be added.)
	 */
	var moveText = "0" + playerCode + "." + boardSetupCode;
	debug(moveText);
	var move = new HexentaflNotationMove(moveText);
	// this.theGame.runNotationMove(move);	// May not be needed
	// Move all set. Add it to the notation!
	this.gameNotation.addMove(move);
};

/* Required */
HexentaflController.prototype.resetGameManager = function() {
	/* this.theGame required by Main */
	this.theGame = new HexentaflGameManager(this.actuator);
};

HexentaflController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new HexentaflNotationBuilder();
};

/* Not required or called from Main */
HexentaflController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

/* Required by Main */
HexentaflController.prototype.getNewGameNotation = function() {
	return new HexentaflGameNotation();
};

/* Required by Main */
HexentaflController.prototype.getHostTilesContainerDivs = function() {
	return "<div></div>";
};

/* Required by Main */
HexentaflController.prototype.getGuestTilesContainerDivs = function() {
	return "<div></div>";
};

/* Required by Main */
HexentaflController.prototype.callActuate = function() {
	this.theGame.actuate();
};

/* Required by Main */
HexentaflController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		this.gameNotation.removeLastMove();
	}

	rerunAll();
};

/* Required by Main */
HexentaflController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Hexentafl</h4>"
	+ "<p><em>A Hnefatafl-inspired game played on a hex grid.</em></p>"
	+ "<p>Read the rules and more about the game <a href='https://nxsgame.wordpress.com/2019/09/26/hexentafl/' target='_blank'>here</a>.</p>";
};

/* Required by Main */
HexentaflController.prototype.getAdditionalMessage = function() {
	var msg = "";
	return msg;
};

/* Using my own version of this, called directly instead of from Main */
HexentaflController.prototype.unplayedTileClicked = function(tilePileContainerDiv) {
	// No unplayed tiles in this game
};

/* Required by Main Actuator creates anything that calls pointClicked in Main. Actuator could call something like this directly instead. */
HexentaflController.prototype.pointClicked = function(htmlPoint) {
	if (this.theGame.getWinner()) {
		return;
	}
	if (!myTurn()) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var npText = htmlPoint.getAttribute("name"); // like 'f5'

	var rowAndCol = HexentaflBoardPoint.notationPointStringMap[npText];
	var boardPoint = this.theGame.board.cells[rowAndCol.row][rowAndCol.col];

	if (this.notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {

			if (!this.tileBelongsToCurrentPlayer(boardPoint.tile) || !myTurn()) {
				debug("That's not your tile!");
				this.callActuate();
				return;
			}

			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = MOVE;
			this.notationBuilder.startPoint = npText;

			this.theGame.revealPossibleMovePoints(boardPoint);
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.types.includes(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.endPoint = npText;
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.runNotationMove(move);

			// Move all set. Add it to the notation!
			this.gameNotation.addMove(move);
			if (onlinePlayEnabled && this.gameNotation.moves.length === 3) {	// 3 will be first move after setup
				createGameIfThatIsOk(this.getGameTypeId);
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

HexentaflController.prototype.tileBelongsToCurrentPlayer = function(tileCode) {
	if (this.getCurrentPlayer() === HOST) {
		return tileCode === "D" || tileCode === "K";
	} else {
		return tileCode === "A";
	}
};

/* Called by Main if showTileMessage used in Actuator */
HexentaflController.prototype.getTileMessage = function(tileDiv) {
	/* */
};

/* Called by Main if showPointMessage used in Actuator */
HexentaflController.prototype.getPointMessage = function(htmlPoint) {
	/* */
};

/* Required by Main (maybe only if getAiList has contents) */
HexentaflController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

/* Required by Main (maybe only if getAiList has contents) */
HexentaflController.prototype.startAiGame = function(finalizeMove) {
	// 
};

/* Required by Main */
HexentaflController.prototype.getAiList = function() {
	return [];
};

/* Required by Main */
HexentaflController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

/* Required by Main */
HexentaflController.prototype.cleanup = function() {
	// Nothing to do
};

/* Required by Main */
HexentaflController.prototype.isSolitaire = function() {
	return false;
};

/* Required by Main */
HexentaflController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

HexentaflController.prototype.completeMove = function() {
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

