/* Key Pai Sho specific UI interaction logic */

function KeyPaiSho() {}

KeyPaiSho.Controller = function(gameContainer, isMobile) {
	/* Default game option until Effect Tiles are implemented */
	addOption(NO_EFFECT_TILES);
	/* --- */

	new KeyPaiSho.Options();	// Initialize

	this.actuator = new KeyPaiSho.Actuator(gameContainer, isMobile, isAnimationsOn());

	// KeyPaiSho.Controller.loadPreferences();

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	this.isPaiShoGame = true;
	this.supportsMoveLogMessages = true;
}

/* KeyPaiSho.Controller.loadPreferences = function() {
	var savedPreferences = JSON.parse(localStorage.getItem(SkudConstants.preferencesKey));
	if (savedPreferences) {
		SkudPreferences = savedPreferences;
	}
}; */

KeyPaiSho.Controller.hideHarmonyAidsKey = "HideHarmonyAids";

KeyPaiSho.Controller.prototype.completeSetup = function() {
	/* Nothing to do */
};

KeyPaiSho.Controller.prototype.getGameTypeId = function() {
	return GameType.KeyPaiSho.id;
};

KeyPaiSho.Controller.prototype.resetGameManager = function() {
	this.theGame = new KeyPaiSho.GameManager(this.actuator);
};

KeyPaiSho.Controller.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new KeyPaiSho.NotationBuilder();
};

KeyPaiSho.Controller.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

KeyPaiSho.Controller.prototype.getNewGameNotation = function() {
	return new KeyPaiSho.GameNotation();
};

KeyPaiSho.Controller.getHostTilesContainerDivs = function() {
	var divs = '<div class="HR3"></div><div class="HW3"></div> <div class="HRO"></div><div class="HWO"></div> <div class="HRD"></div><div class="HWD"></div> <br class="clear" /> <div class="HR"></div> <div class="HW"></div> <div class="HK"></div> <div class="HB"></div> <div class="HLO"></div> <div class="HOR"></div>';
	return divs;
};

KeyPaiSho.Controller.getGuestTilesContainerDivs = function() {
	var divs = '<div class="GR3"></div><div class="GW3"></div> <div class="GRO"></div><div class="GWO"></div> <div class="GRD"></div><div class="GWD"></div> <br class="clear" /> <div class="GR"></div> <div class="GW"></div> <div class="GK"></div> <div class="GB"></div> <div class="GLO"></div> <div class="GOR"></div>';
	return divs;
};

KeyPaiSho.Controller.prototype.callActuate = function() {
	this.theGame.actuate();
};

KeyPaiSho.Controller.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
		if (this.gameNotation.moves.length === 3) {
			this.gameNotation.removeLastMove();	// Special case for automatic Host first move
		}
	} else if (this.notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}

	if (this.gameNotation.moves.length <= 1) {
		// Choosing Accent Tiles
		if (getCurrentPlayer() === GUEST) {
			this.guestAccentTiles = [];
		} else if (getCurrentPlayer() === HOST) {
			this.hostAccentTiles = [];
		}
	}
};

KeyPaiSho.Controller.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Key Pai Sho</h4>"
		+ "<p>This game is still being programmed, but can be played with the tiles currently available. Effect Tiles will be added periodically until the complete set is available. Thank you.</p>"
		+ "<p>Key Pai Sho is a game of harmony and skill. The aim is to form an unbroken chain of harmonies around the center of the board. Harmonies follow 4 important Rules:</p>"
		+ "<ul>"
		+ "<li>Formed if one Player's Key Flower can move to another of their Flowers' squares.</li>"
		+ "<li>Blocked by opposing Flower Tiles.</li>"
		+ "<li>Need at least one space in between the Flowers.</li>"
		+ "<li>Cannot form between Flowers of the same type.</li>"
		+ "</ul>"
		+ "<p>During a turn a player can either Plant a Flower in a Gate or Move one of their Tiles. A player can have up to 2 Planted Flowers at once.</p>";
};

KeyPaiSho.Controller.prototype.getAdditionalMessage = function() {
	var msg = "";

	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by making the first move. <br />";
		} else {
			msg += "Select 6 Effect Tiles to play with.";
		}

		if (!playingOnlineGame()) {
			msg += getGameOptionsMessageHtml(GameType.KeyPaiSho.gameOptions);
		}
	}

	if (this.theGame.playerMustMoveCenterLotus(this.getCurrentPlayer())) {
		msg += "<br />Lotus must move out of the center Gate.<br />";
	}

	return msg;
};

KeyPaiSho.Controller.prototype.getExtraHarmonyBonusHelpText = function() {
	if (!limitedGatesRule) {
		if (this.theGame.playerCanBonusPlant(getCurrentPlayer())) {
			return " <br />You can choose an Accent Tile, Special Flower Tile, or, since you have less than two Growing Flowers, a Basic Flower Tile.";
		}
		return " <br />You can choose an Accent Tile or a Special Flower Tile. You cannot choose a Basic Flower Tile because you have two or more Growing Flowers.";
	} else {
		if (this.theGame.playerCanBonusPlant(getCurrentPlayer())) {
			return " <br />You can choose an Accent Tile or, since you have no Growing Flowers, a Basic or Special Flower Tile.";
		}
		return " <br />You can choose an Accent Tile or a Special Flower Tile. You cannot choose a Basic Flower Tile because you have at least one Growing Flower.";
	}
};

KeyPaiSho.Controller.prototype.showHarmonyBonusMessage = function() {
	document.querySelector(".gameMessage").innerHTML = "Harmony Bonus! Select a tile to play or <span class='skipBonus' onclick='gameController.skipHarmonyBonus();'>skip</span>."
	+ this.getExtraHarmonyBonusHelpText()
	+ getResetMoveText();
};

KeyPaiSho.Controller.prototype.unplayedTileClicked = function(tileDiv) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	if (this.theGame.getWinner() && this.notationBuilder.status !== READY_FOR_BONUS) {
		return;
	}
	if (!myTurn()) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var divName = tileDiv.getAttribute("name");	// Like: GWD or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

	if (tile.ownerName !== getCurrentPlayer()) {
		// debug("That's not your tile!");
		return;
	}

	if (this.gameNotation.moves.length <= 1 && !gameOptionEnabled(NO_EFFECT_TILES)) {
		// Choosing Accent Tiles
		if (tile.type !== ACCENT_TILE && tile.type !== SPECIAL_FLOWER) {
			return;
		}

		if (!tile.selectedFromPile) {
			tile.selectedFromPile = true;
			var removeTileCodeFrom = this.hostAccentTiles;
			if (getCurrentPlayer() === GUEST) {
				removeTileCodeFrom = this.guestAccentTiles;
			}

			removeTileCodeFrom.splice(removeTileCodeFrom.indexOf(tileCode), 1);

			this.theGame.actuate();
			return;
		}

		tile.selectedFromPile = false;

		var accentTilesNeededToStart = 6;

		if (getCurrentPlayer() === HOST) {
			this.hostAccentTiles.push(tileCode);

			if (this.hostAccentTiles.length === accentTilesNeededToStart || (simpleCanonRules && this.hostAccentTiles.length === 2)) {
				var move = new KeyPaiSho.NotationMove("0H." + this.hostAccentTiles.join());
				this.gameNotation.addMove(move);
				if (onlinePlayEnabled) {
					createGameIfThatIsOk(GameType.KeyPaiSho.id);
				} else {
					finalizeMove();
				}
			}
		} else {
			this.guestAccentTiles.push(tileCode);

			if (this.guestAccentTiles.length === accentTilesNeededToStart || (simpleCanonRules && this.guestAccentTiles.length === 2)) {
				var move = new KeyPaiSho.NotationMove("0G." + this.guestAccentTiles.join());
				this.gameNotation.addMove(move);
				// No finalize move because it is still Guest's turn
				rerunAll();
				showResetMoveMessage();
			}
		}
		this.theGame.actuate();
	} else if (this.notationBuilder.status === BRAND_NEW) {
		// new Planting turn, can be basic flower
		if (tile.type !== BASIC_FLOWER && tile.type !== SPECIAL_FLOWER) {
			debug("Can only Plant a Flower tile. That's not one of them.");
			return false;
		}

		tile.selectedFromPile = true;

		this.notationBuilder.moveType = PLANTING;
		this.notationBuilder.plantedFlowerType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.revealOpenGates(getCurrentPlayer(), tile, this.gameNotation.moves.length);
	} else if (this.notationBuilder.status === READY_FOR_BONUS) {
		if (simpleSpecialFlowerRule && tile.type === SPECIAL_FLOWER) {
			// Other special tile still needs to be in that player's tile pile
			if (!this.theGame.playerHasNotPlayedEitherSpecialTile(tile.ownerName)) {
				return false;
			}
		}

		tile.selectedFromPile = true;
		// Bonus Plant! Can be any tile
		this.notationBuilder.bonusTileCode = tileCode;
		this.notationBuilder.status = WAITING_FOR_BONUS_ENDPOINT;

		if (tile.type === BASIC_FLOWER && this.theGame.playerCanBonusPlant(getCurrentPlayer())) {
			this.theGame.revealOpenGates(getCurrentPlayer(), tile);
		} else if (tile.type === ACCENT_TILE) {
			this.theGame.revealPossiblePlacementPoints(tile);
		} else if (tile.type === SPECIAL_FLOWER) {
			if (!specialFlowerLimitedRule
				|| (specialFlowerLimitedRule && this.theGame.playerCanBonusPlant(getCurrentPlayer()))) {
				this.theGame.revealSpecialFlowerPlacementPoints(getCurrentPlayer(), tile);
			}
		}
	} else {
		this.theGame.hidePossibleMovePoints();
		if (this.notationBuilder.status === WAITING_FOR_BONUS_ENDPOINT
			|| this.notationBuilder.status === WAITING_FOR_BOAT_BONUS_POINT) {
			this.notationBuilder.status = READY_FOR_BONUS;
			this.showHarmonyBonusMessage();
		} else {
			this.notationBuilder = new KeyPaiSho.NotationBuilder();
		}
	}
};


KeyPaiSho.Controller.prototype.RmbDown = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
}

KeyPaiSho.Controller.prototype.RmbUp = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (mouseEndPoint == this.mouseStartPoint) {
		this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint);
	}
	else if (this.mouseStartPoint) {
		this.theGame.markingManager.toggleMarkedArrow(this.mouseStartPoint, mouseEndPoint);
	}
	this.mouseStartPoint = null;

	this.callActuate();
}

KeyPaiSho.Controller.prototype.pointClicked = function(htmlPoint) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	if (this.theGame.getWinner() && this.notationBuilder.status !== WAITING_FOR_BONUS_ENDPOINT
			&& this.notationBuilder.status !== WAITING_FOR_BOAT_BONUS_POINT) {
		return;
	}
	if (!myTurn()) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (this.notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {
			if (boardPoint.tile.ownerName !== getCurrentPlayer()) {
				debug("That's not your tile!");
				return;
			}

			if (boardPoint.tile.type === ACCENT_TILE) {
				return;
			}

			if (boardPoint.tile.trapped) {
				return;
			}

			if (!newKnotweedRules && boardPoint.tile.trapped) {
				return;
			}

			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = ARRANGING;
			this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			this.theGame.revealPossibleMovePoints(getCurrentPlayer(), boardPoint);
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.hidePossibleMovePoints(false, move);
			var bonusAllowed = this.theGame.runNotationMove(move);

			if (!bonusAllowed) {
				// Move all set. Add it to the notation!
				this.gameNotation.addMove(move);
				if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
					createGameIfThatIsOk(GameType.KeyPaiSho.id);
				} else {
					if (playingOnlineGame()) {
						callSubmitMove(null, null, move);
					} else {
						finalizeMove();
					}
				}
			} else {
				this.notationBuilder.status = READY_FOR_BONUS;
				this.showHarmonyBonusMessage();
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new KeyPaiSho.NotationBuilder();
		}
	} else if (this.notationBuilder.status === WAITING_FOR_BONUS_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {

			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.bonusEndPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			// If we're placing a boat, and boardPoint is a flower...
			if (this.notationBuilder.bonusTileCode.endsWith("B") && (boatOnlyMoves || boardPoint.tile.type !== ACCENT_TILE)) {
				// Boat played on flower, need to pick flower endpoint
				this.notationBuilder.status = WAITING_FOR_BOAT_BONUS_POINT;
				this.theGame.revealBoatBonusPoints(boardPoint);
			} else {
				var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);

				this.gameNotation.addMove(move);
				if (playingOnlineGame()) {
					callSubmitMove(1, null, move);
				} else {
					finalizeMove(1);
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.status = READY_FOR_BONUS;
		}
	} else if (this.notationBuilder.status === WAITING_FOR_BOAT_BONUS_POINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {

			this.notationBuilder.status = MOVE_DONE;

			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.boatBonusPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.gameNotation.addMove(move);
			if (playingOnlineGame()) {
				callSubmitMove(1, null, move);
			} else {
				finalizeMove(1);
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.status = READY_FOR_BONUS;
		}
	}
};

KeyPaiSho.Controller.prototype.skipHarmonyBonus = function() {
	if (this.notationBuilder.status !== MOVE_DONE) {
		this.notationBuilder.status = MOVE_DONE;
		this.notationBuilder.bonusEndPoint = null;
		var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.gameNotation.addMove(move);
		if (playingOnlineGame()) {
			callSubmitMove(1, null, move);
		} else {
			finalizeMove(1);
		}
	}
};

KeyPaiSho.Controller.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GWD or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new KeyPaiSho.Tile(divName.substring(1), divName.charAt(0));

	var tileMessage = this.getHelpMessageForTile(tile);

	return {
		heading: tileMessage.heading,
		message: tileMessage.message
	}
};

KeyPaiSho.Controller.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	var heading;
	var message = [];
	/* if (boardPoint.hasTile()) {
		var tileMessage = this.getHelpMessageForTile(boardPoint.tile);
		tileMessage.message.forEach(function(messageString){
			message.push(messageString);
		});
		heading = tileMessage.heading;
		
		var tileHarmonies = this.theGame.board.harmonyManager.getHarmoniesWithThisTile(boardPoint.tile);
		if (tileHarmonies.length > 0) {
			var bullets = [];
			tileHarmonies.forEach(function(harmony) {
				var otherTile = harmony.getTileThatIsNotThisOne(boardPoint.tile);
				bullets.push(otherTile.getName()
					+ " to the " + harmony.getDirectionForTile(boardPoint.tile));
			});
			message.push("<strong>Currently in Harmony with: </strong>" + toBullets(bullets));
		}

		// Drained? Trapped? Anything else?
		if (boardPoint.tile.drained) {
			message.push("Currently <em>drained</em> by a Knotweed.");
		}
		if (boardPoint.tile.trapped) {
			message.push("Currently <em>trapped</em> by an Orchid.")
		}
	} */
	
	if (boardPoint.isType(NEUTRAL)) {
		message.push(this.getNeutralSpaceMessage());
	} else if (boardPoint.isType(RED)) {
		message.push(this.getRedSpaceMessage());
	} else if (boardPoint.isType(WHITE)) {
		message.push(this.getWhiteSpaceMessage());
	} else if (boardPoint.isType(GATE)) {
		message.push(this.getGatePointMessage());
	}

	return {
		heading: heading,
		message: message
	}
};

KeyPaiSho.Controller.prototype.getNeutralSpaceMessage = function() {
	var msg = "<h4>Neutral Square</h4>";
	return msg;
};

KeyPaiSho.Controller.prototype.getRedSpaceMessage = function() {
	var msg = "<h4>Red Square</h4>";
	return msg;
};

KeyPaiSho.Controller.prototype.getWhiteSpaceMessage = function() {
	var msg = "<h4>White Square</h4>";
	return msg;
};

KeyPaiSho.Controller.prototype.getGatePointMessage = function() {
	var msg = "<h4>Gate</h4>";
	return msg;
};

KeyPaiSho.Controller.prototype.getHelpMessageForTile = function(tile) {
	var message = [];

	var tileCode = tile.code;

	var heading = KeyPaiSho.Tile.getTileName(tileCode);

	message.push(tile.ownerName + "'s tile");

	if (tile.type === BASIC_FLOWER) {
		var colorCode = tileCode.charAt(0);

		var noLandInColor = "Dark";
		if (colorCode === "R") {
			noLandInColor = "Light";
		}

		message.push("Key Flower Tile");
		message.push("Cannot enter fully " + noLandInColor + " Garden Squares");
		message.push("Cannot Move over other Tiles");
		message.push("Can Move and Harmonize up to " + tile.getMoveDistance() + " spaces " + tile.getMovementDirectionWording());
	}

	return {
		heading: heading,
		message: message
	}
};

KeyPaiSho.Controller.prototype.playAiTurn = function(finalizeMove) {
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

	if (playerMoveNum === 1 && getCurrentPlayer() === HOST) {
		// Auto mirror guest move
		// Host auto-copies Guest's first Plant
		var hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.gameNotation.moves[this.gameNotation.moves.length - 1].plantedFlowerType);
		this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
		finalizeMove();
	} else if (playerMoveNum < 3) {
		var move = theAi.getMove(this.theGame.getCopy(), playerMoveNum);
		if (!move) {
			debug("No move given...");
			return;
		}
		this.gameNotation.addMove(move);
		finalizeMove();
	} else {
		var self = this;
		setTimeout(function(){
			var move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);
			if (!move) {
				debug("No move given...");
				return;
			}
			self.gameNotation.addMove(move);
			finalizeMove();
		}, 10);
	}
};

KeyPaiSho.Controller.prototype.startAiGame = function(finalizeMove) {
	this.playAiTurn(finalizeMove);
	if (this.gameNotation.getPlayerMoveNum() === 1) {
		this.playAiTurn(finalizeMove);
	}
	if (this.gameNotation.getPlayerMoveNum() === 1) {
		// Host auto-copies Guest's first Plant
		var hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.gameNotation.moves[this.gameNotation.moves.length - 1].plantedFlowerType);
		this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
		finalizeMove();
	}
	if (this.gameNotation.getPlayerMoveNum() === 2 && getCurrentPlayer() === GUEST) {
		this.playAiTurn(finalizeMove);
	}
};

KeyPaiSho.Controller.prototype.getAiList = function() {
	return [];
};

KeyPaiSho.Controller.prototype.getCurrentPlayer = function() {
	if (!gameOptionEnabled(NO_EFFECT_TILES) && this.gameNotation.moves.length <= 1) {
		if (this.gameNotation.moves.length === 0) {
			return HOST;
		} else {
			return GUEST;
		}
	}

	if (this.gameNotation.moves.length < 1) {
		return HOST;
	}
	
	var lastPlayer = this.gameNotation.moves[this.gameNotation.moves.length - 1].player;

	if (lastPlayer === HOST) {
		return GUEST;
	} else if (lastPlayer === GUEST) {
		return HOST;
	}
};

KeyPaiSho.Controller.prototype.cleanup = function() {
	// Nothing.
};

KeyPaiSho.Controller.prototype.isSolitaire = function() {
	return false;
};

KeyPaiSho.Controller.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

KeyPaiSho.Controller.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	// var heading = document.createElement("h4");
	// heading.innerText = "Key Pai Sho Preferences:";

	// settingsDiv.appendChild(heading);
	// settingsDiv.appendChild(KeyPaiSho.Controller.buildTileDesignDropdownDiv());

	// settingsDiv.appendChild(document.createElement("br"));
	
	// settingsDiv.appendChild(this.buildToggleHarmonyAidsDiv());
	// settingsDiv.appendChild(document.createElement("br"));
	
	return settingsDiv;
};

/* KeyPaiSho.Controller.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("KeyPaiSho.TileDesignDropdown", labelText + ":", tileDesignTypeValues,
							localStorage.getItem(tileDesignTypeKey),
							function() {
								setSkudTilesOption(this.value);
							});
}; */

KeyPaiSho.Controller.prototype.buildToggleHarmonyAidsDiv = function() {
	var div = document.createElement("div");
	var onOrOff = getUserGamePreference(KeyPaiSho.Controller.hideHarmonyAidsKey) !== "true" ? "on" : "off";
	div.innerHTML = "Harmony aids are " + onOrOff + ": <span class='skipBonus' onclick='gameController.toggleHarmonyAids();'>toggle</span>";
	if (gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)) {
		div.innerHTML += " (Will not affect games with " + NO_HARMONY_VISUAL_AIDS + " game option)";
	}
	return div;
};

KeyPaiSho.Controller.prototype.toggleHarmonyAids = function() {
	setUserGamePreference(KeyPaiSho.Controller.hideHarmonyAidsKey, 
		getUserGamePreference(KeyPaiSho.Controller.hideHarmonyAidsKey) !== "true");
	clearMessage();
	this.callActuate();
};

KeyPaiSho.Controller.prototype.setAnimationsOn = function(isAnimationsOn) {
	this.actuator.setAnimationOn(isAnimationsOn);
};

KeyPaiSho.Controller.isUsingCustomTileDesigns = function() {
	return localStorage.getItem(KeyPaiSho.Options.tileDesignTypeKey) === "custom";
};

/* KeyPaiSho.Controller.getCustomTileDesignsUrl = function() {
	return SkudPreferences.customTilesUrl;
}; */

/* KeyPaiSho.Controller.prototype.setCustomTileDesignUrl = function(url) {
	SkudPreferences.customTilesUrl = url;
	localStorage.setItem(SkudConstants.preferencesKey, JSON.stringify(SkudPreferences));
	setSkudTilesOption('custom', true);
}; */
