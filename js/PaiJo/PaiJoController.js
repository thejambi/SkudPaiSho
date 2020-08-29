var PaiJoVars = {};

function PaiJoController(gameContainer, isMobile) {
	PaiJoVars = {
		DEFENDERS_PLAYER: HOST,
		ATTACKERS_PLAYER: GUEST
	}

	if (gameOptionEnabled(OPTION_ATTACKERS_MOVE_FIRST)) {
		PaiJoVars = {
			ATTACKERS_PLAYER: HOST,
			DEFENDERS_PLAYER: GUEST
		}
	}

	if (!isMobile) {
		this.additionalTilePileClass = "desktop";
	} else {
		this.additionalTilePileClass = "";
	}

	/* Board setup code determines initial tile placement pattern on the board. */
	this.attackersBoardSetupCode = 1;
	this.defendersBoardSetupCode = 1;

	if (gameOptionEnabled(FIVE_SIDED_BOARD)) {
		this.attackersBoardSetupCode = 2;
		this.defendersBoardSetupCode = 2;
	}

	this.actuator = new PaiJoActuator(gameContainer, isMobile, this.getHostTilesContainerDivs(), this.getGuestTilesContainerDivs());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();
}

PaiJoController.prototype.getGameTypeId = function() {
	return GameType.PaiJo.id;
};

/* Not required, but called from Main */
PaiJoController.prototype.completeSetup = function() {
	// Create initial board setup for Host and then Guest, but who are they?
	if (HOST === PaiJoVars.DEFENDERS_PLAYER) {
		this.addSetupForPlayerCode('D', this.defendersBoardSetupCode);
		this.addSetupForPlayerCode('A', this.attackersBoardSetupCode);
	} else {
		this.addSetupForPlayerCode('A', this.attackersBoardSetupCode);
		this.addSetupForPlayerCode('D', this.defendersBoardSetupCode);
	}

	// Finish with actuate
	rerunAll();
	this.callActuate();
};

PaiJoController.prototype.addSetupForPlayerCode = function(playerCode, boardSetupCode) {
	/* Create initial board setup based on board setup code. 
	 * (In the future, more board setup options could be added.)
	 */
	var moveText = "0" + playerCode + "." + boardSetupCode;
	debug(moveText);
	var move = new PaiJoNotationMove(moveText);
	// this.theGame.runNotationMove(move);	// May not be needed
	// Move all set. Add it to the notation!
	this.gameNotation.addMove(move);
};

/* Required */
PaiJoController.prototype.resetGameManager = function() {
	/* this.theGame required by Main */
	this.theGame = new PaiJoGameManager(this.actuator);
};

PaiJoController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new PaiJoNotationBuilder();
};

/* Not required or called from Main */
PaiJoController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

/* Required by Main */
PaiJoController.prototype.getNewGameNotation = function() {
	return new PaiJoGameNotation();
};

/* Required by Main */
PaiJoController.prototype.getHostTilesContainerDivs = function() {
	return "<div></div>";
};

/* Required by Main */
PaiJoController.prototype.getGuestTilesContainerDivs = function() {
	return "<div></div>";
};

/* Required by Main */
PaiJoController.prototype.callActuate = function() {
	this.theGame.actuate();
};

/* Required by Main */
PaiJoController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		this.gameNotation.removeLastMove();
	}

	rerunAll();
};

/* Required by Main */
PaiJoController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>PaiJo</h4>"
	+ "<p><em>A Hnefatafl-inspired game played on a hex grid.</em></p>"
	+ "<p>The Attackers begin in the corners and win by capturing the King.</p>"
	+ "<p>The King and Defenders begin in the center and win by escorting the King to a corner space.</p>"
	+ "<p>Read the rules and more about the game <a href='https://nxsgame.wordpress.com/2019/09/26/PaiJo/' target='_blank'>here</a>.</p>";
};

/* Required by Main */
PaiJoController.prototype.getAdditionalMessage = function() {
	var msg = "";
	if (this.gameNotation.moves.length <= 2) {
		msg += getGameOptionsMessageHtml(GameType.PaiJo.gameOptions);
	}
	return msg;
};

/* Using my own version of this, called directly instead of from Main */
PaiJoController.prototype.unplayedTileClicked = function(tilePileContainerDiv) {
	// No unplayed tiles in this game
};

/* Required by Main Actuator creates anything that calls pointClicked in Main. Actuator could call something like this directly instead. */
PaiJoController.prototype.pointClicked = function(htmlPoint) {
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

	var rowAndCol = PaiJoBoardPoint.notationPointStringMap[npText];
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
				createGameIfThatIsOk(this.getGameTypeId());
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

PaiJoController.prototype.tileBelongsToCurrentPlayer = function(tileCode) {
	if (this.getCurrentPlayer() === PaiJoVars.DEFENDERS_PLAYER) {
		return tileCode === "D" || tileCode === "K";
	} else {
		return tileCode === "A";
	}
};

/* Called by Main if showTileMessage used in Actuator */
PaiJoController.prototype.getTileMessage = function(tileDiv) {
	/* */
};

/* Called by Main if showPointMessage used in Actuator */
PaiJoController.prototype.getPointMessage = function(htmlPoint) {
	/* */
};

/* Required by Main (maybe only if getAiList has contents) */
PaiJoController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

/* Required by Main (maybe only if getAiList has contents) */
PaiJoController.prototype.startAiGame = function(finalizeMove) {
	// 
};

/* Required by Main */
PaiJoController.prototype.getAiList = function() {
	return [];
};

/* Required by Main */
PaiJoController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
};

/* Required by Main */
PaiJoController.prototype.cleanup = function() {
	// Nothing to do
};

/* Required by Main */
PaiJoController.prototype.isSolitaire = function() {
	return false;
};

/* Required by Main */
PaiJoController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

/* Called by Main, not required */
PaiJoController.prototype.optionOkToShow = function(option) {
	if (option === KING_MOVES_LIKE_PAWNS) {
		return gameOptionEnabled(FIVE_SIDED_BOARD);
	} else {
		return true;
	}
};
