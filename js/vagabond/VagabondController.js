/* Vagabond Pai Sho specific UI interaction logic */

function VagabondController(gameContainer, isMobile) {
	/* Set default preferences */
	if (!localStorage.getItem(vagabondTileDesignTypeKey)
			|| !VagabondController.tileDesignTypeValues[localStorage.getItem(vagabondTileDesignTypeKey)]) {
		localStorage.setItem(vagabondTileDesignTypeKey, "tggvagabond");
	}

	this.actuator = new VagabondActuator(gameContainer, isMobile, this.isAnimationsEnabled());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	this.isPaiShoGame = true;
}

VagabondController.animationsEnabledKey = "AnimationsEnabled";

VagabondController.prototype.getGameTypeId = function() {
	return GameType.VagabondPaiSho.id;
};

VagabondController.prototype.completeSetup = function() {
	/* peekAtOpponentMoves: Allow display of opponent piece movement */
	this.peekAtOpponentMovesPrefKey = "PeekAtOpponentMoves";
	this.peekAtOpponentMoves = getUserGamePreference(this.peekAtOpponentMovesPrefKey) === "true";
	debug("Peeky?: " + this.peekAtOpponentMoves);
	debug("!this.peek...: " + !this.peekAtOpponentMoves);

	if (gameOptionEnabled(SWAP_BISON_WITH_LEMUR)) {
		VagabondController.setTileDesignsPreference("tggvagabond");
	}
};

VagabondController.prototype.resetGameManager = function() {
	this.theGame = new VagabondGameManager(this.actuator);
};

VagabondController.prototype.resetNotationBuilder = function(applyDrawOffer) {
	this.notationBuilder = new VagabondNotationBuilder();
	if (applyDrawOffer) {
		this.notationBuilder.offerDraw = true;
	}

	this.checkingOutOpponentTileOrNotMyTurn = false;
};

VagabondController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

VagabondController.prototype.getNewGameNotation = function() {
	return new VagabondGameNotation();
};

VagabondController.getHostTilesContainerDivs = function() {
	if (gameOptionEnabled(SWAP_BISON_WITH_LEMUR)) {
		return '<div class="HC"></div> <div class="H' + VagabondTileCodes.FlyingLemur + '"></div> <div class="HB"></div> <div class="HW"></div> <br class="clear" /> <div class="HF"></div> <div class="HD"></div> <div class="H_empty"></div> <div class="HL"></div>';
	}
	return '<div class="HC"></div> <div class="HS"></div> <div class="HB"></div> <div class="HW"></div> <br class="clear" /> <div class="HF"></div> <div class="HD"></div> <div class="H_empty"></div> <div class="HL"></div>';
}

VagabondController.getGuestTilesContainerDivs = function() {
	if (gameOptionEnabled(SWAP_BISON_WITH_LEMUR)) {
		return '<div class="GC"></div> <div class="G' + VagabondTileCodes.FlyingLemur + '"></div> <div class="GB"></div> <div class="GW"></div> <br class="clear" /> <div class="GF"></div> <div class="GD"></div> <div class="G_empty"></div> <div class="GL"></div>';
	}
	return '<div class="GC"></div> <div class="GS"></div> <div class="GB"></div> <div class="GW"></div> <br class="clear" /> <div class="GF"></div> <div class="GD"></div> <div class="G_empty"></div> <div class="GL"></div>';
};

VagabondController.prototype.callActuate = function() {
	this.theGame.actuate();
};

VagabondController.prototype.resetMove = function() {
	this.notationBuilder.offerDraw = false;
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	} else if (this.notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}

	rerunAll();
};

VagabondController.prototype.getDefaultHelpMessageText = function() {
	var helpText = "<h4>Vagabond Pai Sho</h4> <p> <p>Vagabond Pai Sho is the Pai Sho variant seen in the fanfiction story <a href='https://skudpaisho.com/site/more/fanfiction-recommendations/' target='_blank'>Gambler and Vagabond (download here)</a>.</p> <p><strong>You win</strong> if you capture your opponent's White Lotus tile.</p> <p><strong>On a turn</strong>, you may either deploy a tile or move a tile.</p> <p><strong>You can't capture Flower tiles</strong> until your White Lotus has been deployed.<br /> <strong>You can't capture Non-Flower tiles</strong> until both players' White Lotus tiles have been deployed.</p> <p><strong>Hover</strong> over any tile to see how it works.</p> </p> <p>Select tiles to learn more or <a href='https://skudpaisho.com/site/games/vagabond-pai-sho/' target='_blank'>view the rules</a>.</p>";
	return helpText;
};

VagabondController.prototype.togglePeekAtOpponentMoves = function() {
	this.peekAtOpponentMoves = !this.peekAtOpponentMoves;
	setUserGamePreference(this.peekAtOpponentMovesPrefKey, this.peekAtOpponentMoves);
	clearMessage();
};

VagabondController.prototype.getAdditionalMessage = function() {
	var msg = "";

	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by making a move. <br />";
		} else {
			msg += "Sign in to enable online gameplay. Or, start playing a local game by making a move.";
		}

		msg += getGameOptionsMessageHtml(GameType.VagabondPaiSho.gameOptions);
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

VagabondController.prototype.gameHasEndedInDraw = function() {
	return this.theGame.gameHasEndedInDraw;
};

VagabondController.prototype.acceptDraw = function() {
	if (myTurn()) {
		this.promptToAcceptDraw = true;
		refreshMessage();
	}
};

VagabondController.prototype.confirmAcceptDraw = function() {
	if (myTurn() && this.gameNotation.lastMoveHasDrawOffer()) {
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

VagabondController.prototype.offerDraw = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = true;
		refreshMessage();
	}
};

VagabondController.prototype.removeDrawOffer = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = false;
		refreshMessage();
	}
};

VagabondController.prototype.unplayedTileClicked = function(tileDiv) {
	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded() && this.notationBuilder.status !== READY_FOR_BONUS) {
		return;
	}
	if (!myTurn() && !this.peekAtOpponentMoves) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length && !this.peekAtOpponentMoves) {
		debug("Can only interact if all moves are played.");
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

	if (tile.ownerName !== getCurrentPlayer() || !myTurn()) {
		// Hey, that's not your tile!
		this.checkingOutOpponentTileOrNotMyTurn = true;
		if (!this.peekAtOpponentMoves) {
			return;
		}
	}

	if (this.notationBuilder.status === BRAND_NEW) {
		// new Deploy turn
		tile.selectedFromPile = true;

		this.notationBuilder.moveType = DEPLOY;
		this.notationBuilder.tileType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		// this.theGame.revealDeployPoints(getCurrentPlayer(), tileCode); // Old
		this.theGame.revealDeployPoints(tile.ownerName, tileCode); // New
	} else {
		this.theGame.hidePossibleMovePoints();
		this.resetNotationBuilder(this.notationBuilder.offerDraw);
	}
}

VagabondController.prototype.pointClicked = function(htmlPoint) {
	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded()) {
		return;
	}
	if (!myTurn() && !this.peekAtOpponentMoves) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length && !this.peekAtOpponentMoves) {
		debug("Can only interact if all moves are played.");
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
				if (!this.peekAtOpponentMoves) {
					return;
				}
			}

			if (!boardPoint.tile.canMove()) {
				return;
			}

			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = MOVE;
			this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			this.theGame.revealPossibleMovePoints(boardPoint);
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE) && myTurn()) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();

			if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
				this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
				this.theGame.runNotationMove(move);

				// Move all set. Add it to the notation!
				this.gameNotation.addMove(move);
				if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
					createGameIfThatIsOk(GameType.VagabondPaiSho.id);
				} else {
					if (playingOnlineGame()) {
						callSubmitMove();
					} else {
						finalizeMove();
					}
				}
			} else {
				this.resetNotationBuilder();
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder(this.notationBuilder.offerDraw);
		}
	}
}

VagabondController.prototype.skipHarmonyBonus = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);
	if (playingOnlineGame()) {
		callSubmitMove();
	} else {
		finalizeMove();
	}
}

VagabondController.prototype.getTheMessage = function(tile, ownerName) {
	var message = [];

	var tileCode = tile.code;

	var heading = VagabondTile.getTileName(tileCode);

	if (tileCode === 'L') {
		heading = "White Lotus";
		message.push("Flower Tile");
		message.push("Can move 1 space");
	} else if (tileCode === VagabondTileCodes.FlyingLemur) {
		message.push("Deployed on the Temples - the points inside of the small red triangles in the corners of the board");
		message.push("Can move up to five spaces, turning any number of times, and can move over other tiles");
		message.push("Cannot move through or off of a space that is adjacent to an opponent's Chrysanthemum tile");
		message.push("Can capture other tiles");
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
		message.push("Flower Tiles adjacent to a friendly Badgermole are protected from capture");
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

	// if (message.length > 1) {
	// 	setMessage(toHeading(heading) + toBullets(message));
	// } else {
	// 	setMessage(toHeading(heading) + toMessage(message));
	// }
}

VagabondController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new VagabondTile(divName.substring(1), divName.charAt(0));

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	return this.getTheMessage(tile, ownerName);
}

VagabondController.prototype.getPointMessage = function(htmlPoint) {
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

VagabondController.prototype.playAiTurn = function(finalizeMove) {
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

VagabondController.prototype.startAiGame = function(finalizeMove) {
	this.playAiTurn(finalizeMove);
};

VagabondController.prototype.getAiList = function() {
	return [new VagabondRandomAIv1()];
}

VagabondController.prototype.getCurrentPlayer = function() {
	// if (this.gameNotation.moves.length % 2 === 0) {
	if (currentMoveIndex % 2 === 0) {	// To get right player during replay...
		return HOST;
	} else {
		return GUEST;
	}
};

VagabondController.prototype.cleanup = function() {
	// document.querySelector(".svgContainer").classList.remove("vagabondBoardRotate");
};

VagabondController.prototype.isSolitaire = function() {
	return false;
};

VagabondController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

VagabondController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Vagabond Pai Sho Preferences:";

	var movePeekingDiv = document.createElement("div");
	var movePeekingText = "Opponent move and replay peeking is ";
	if (this.peekAtOpponentMoves) {
		movePeekingText += "enabled";
	} else {
		movePeekingText += "disabled";
	}
	movePeekingText += ". ";

	movePeekingDiv.innerText = movePeekingText;

	var movePeekingToggleSpan = document.createElement("span");
	movePeekingToggleSpan.innerText = "Toggle";
	movePeekingToggleSpan.classList.add("skipBonus");
	movePeekingToggleSpan.onclick = function() {
		gameController.togglePeekAtOpponentMoves();
	};

	movePeekingDiv.appendChild(movePeekingToggleSpan);


	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(VagabondController.buildTileDesignDropdownDiv());
	settingsDiv.appendChild(movePeekingDiv);

	settingsDiv.appendChild(document.createElement("br"));
	
	settingsDiv.appendChild(this.buildToggleAnimationsDiv());

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

VagabondController.prototype.buildToggleAnimationsDiv = function() {
	var div = document.createElement("div");
	var onOrOff = this.isAnimationsEnabled() ? "on" : "off";
	div.innerHTML = "Move animations are " + onOrOff + ": <span class='skipBonus' onclick='gameController.toggleAnimations();'>toggle</span>";
	return div;
};

VagabondController.prototype.toggleAnimations = function() {
	if (this.isAnimationsEnabled()) {
		setUserGamePreference(VagabondController.animationsEnabledKey, "false");
		this.actuator.setAnimationOn(false);
	} else {
		setUserGamePreference(VagabondController.animationsEnabledKey, "true");
		this.actuator.setAnimationOn(true);
	}
	clearMessage();
};

VagabondController.prototype.isAnimationsEnabled = function() {
	/* Check !== false to default to on */
	return getUserGamePreference(VagabondController.animationsEnabledKey) !== "false";
};

/* Vagabond tile designs */
VagabondController.tileDesignTypeValues = {
	tggvagabond: "The Garden Gate Designs",
	tggclassic: "TGG Classic",
	tgggyatso: "Gyatso TGG Classic",
	tggkoiwheel: "TGG Koi-Wheel",
	vescuccikoiwheel: "Vescucci Koi-Wheel",
	vescuccikoiwheelrustic: "Rustic Vescucci Koi-Wheel",
	tggoriginal: "The Garden Gate Designs Original",
	chujired: "Chuji Red",
	classic: "Classic Pai Sho Project",
	water: "Water themed Garden Gate Designs",
	fire: "Fire themed Garden Gate Designs",
	canon: "Canon colors Garden Gate Designs",
	owl: "Order of the White Lotus Garden Gate Designs"
};

VagabondController.setTileDesignsPreference = function(tileDesignKey) {
	localStorage.setItem(vagabondTileDesignTypeKey, tileDesignKey);
	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
};

VagabondController.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("vagabondPaiShoTileDesignDropdown", labelText + ":", VagabondController.tileDesignTypeValues,
							localStorage.getItem(vagabondTileDesignTypeKey),
							function() {
								VagabondController.setTileDesignsPreference(this.value);
							});
};

VagabondController.prototype.setAnimationsOn = function(isAnimationsOn) {
	if (isAnimationsOn !== this.isAnimationsEnabled()) {
		this.toggleAnimations();
	}
};

