var PaiJoVars = {};

function PaiJoController(gameContainer, isMobile) {
	PaiJoVars = {
 	}

	if (gameOptionEnabled(OPTION_ATTACKERS_MOVE_FIRST)) {
		PaiJoVars = {
 		}
	}

	if (!isMobile) {
		this.additionalTilePileClass = "desktop";
	} else {
		this.additionalTilePileClass = "";
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
	 
	this.callActuate();
};

PaiJoController.prototype.addSetupForPlayerCode = function(playerCode, boardSetupCode) {
	 
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
	return '<div><a href="/js/PaiJo/index.html" target="_blank">Fullscreen</a><br><br></div>';
};

/* Required by Main */
PaiJoController.prototype.callActuate = function() {
	this.theGame.actuate();
		$(".board-container").css("overflow-x","hidden"); 
	$(".board-container").css("height","500px");
	$(".board-container").html("<iframe src='./js/PaiJo/index_embedded.html' style='width:99%;height:99%;'></iframe>");
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
	return '<a target="_blank" href="http://paisho.pbworks.com/w/page/102793894/Modern%20Pai%20Sho"> Source info - paisho.pbworks </a>'+
'<p>The Game goes as follows:<br>You can only move one tile per turn. Each piece can only move to a space directly adjacent to it, or jump a piece that is owned by the player moving.</p>'+
'<p>&nbsp;</p><p>Elemental:<br>Water: Wins against Earth, Losses to Air, Neutral with Fire <br>' +
'Fire: Wins against Air, Losses to Earth, Neutral with Water <br>Earth:&nbsp;Wins against Fire, Losses to Water, Neutral with Air <br>'+
'Air:&nbsp;Wins against Water, Losses to Fire, Neutral with Earth </p><br><p>Special: <br>'+
'Avatar: Wins against Every, Losses to Every, Neutral with none<br>White Lotus: Wins against none, Losses to Every, Neutral with none</p>'+ 
'<p>&nbsp;</p><p>The White Lotus piece can\'t jump and has one turn to escape "death" when it becomes in danger.'+
'<br>Ever piece that become adjacent with a piece that it beats removes that piece, and if it is adjacent to a piece that beats it, it is removed.<br>'+
'The Avatar piece beats any piece it attacks, and is beaten by any piece that attacks it. It then respawns at it\'s starting location if no piece is in the Avatars starting location(the place in started the game at) and no enemy piece is attacking that spot.'+
'<br>After a piece is moved, it can be moved again to jump any piece owned by the player (this can be done as the first move too) any number of times, with the exception of the White Lotus, which can\'t jump any piece.<br>'+
'When the White Lotus in under attack rather than instantly be removed from the board, it has one turn to be moved to a save location, if that proves impossible the attacking player has won.</p>'+
'<p>&nbsp;</p><p>You win either by killing the opponents white lotus (DOMINANCE), or getting your safely to the center of the board for one full turn cycle.</p>  </div>'
 
};

/* Required by Main */
PaiJoController.prototype.getAdditionalMessage = function() {
	var msg = "";
	if (this.gameNotation.moves.length <= 2) {
		msg += getGameOptionsMessageHtml(GameType.PaiJo.gameOptions);
	}
	return msg;
};

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
			return "";

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

 
