/* Skud Pai Sho specific UI interaction logic */

function SkudPaiShoController(gameContainer, isMobile) {
	this.actuator = new SkudPaiShoActuator(gameContainer, isMobile, isAnimationsOn());

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	this.isPaiShoGame = true;
}

SkudPaiShoController.hideHarmonyAidsKey = "HideHarmonyAids";

SkudPaiShoController.prototype.getGameTypeId = function() {
	return GameType.SkudPaiSho.id;
};

SkudPaiShoController.prototype.resetGameManager = function() {
	this.theGame = new SkudPaiShoGameManager(this.actuator);
};

SkudPaiShoController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new SkudPaiShoNotationBuilder();	// Will be ... SkudPaiShoNotationBuilder
};

SkudPaiShoController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

SkudPaiShoController.prototype.getNewGameNotation = function() {
	return new SkudPaiShoGameNotation();
};

SkudPaiShoController.getHostTilesContainerDivs = function() {
	var divs = '<div class="HR3"></div> <div class="HR4"></div> <div class="HR5"></div> <div class="HW3"></div> <div class="HW4"></div> <div class="HW5"></div> <br class="clear" /> <div class="HR"></div> <div class="HW"></div> <div class="HK"></div> <div class="HB"></div> <div class="HL"></div> <div class="HO"></div>';
	if (gameOptionEnabled(OPTION_ANCIENT_OASIS_EXPANSION)) {
		divs += '<br class="clear" /> <div class="HM"></div> <div class="HP"></div> <div class="HT"></div>';
	}
	return divs;
};

SkudPaiShoController.getGuestTilesContainerDivs = function() {
	var divs = '<div class="GR3"></div> <div class="GR4"></div> <div class="GR5"></div> <div class="GW3"></div> <div class="GW4"></div> <div class="GW5"></div> <br class="clear" /> <div class="GR"></div> <div class="GW"></div> <div class="GK"></div> <div class="GB"></div> <div class="GL"></div> <div class="GO"></div>';
	if (gameOptionEnabled(OPTION_ANCIENT_OASIS_EXPANSION)) {
		divs += '<br class="clear" /> <div class="GM"></div> <div class="GP"></div> <div class="GT"></div>';
	}
	return divs;
};

SkudPaiShoController.prototype.callActuate = function() {
	this.theGame.actuate();
};

SkudPaiShoController.prototype.resetMove = function() {
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

SkudPaiShoController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Skud Pai Sho</h4> <p>Skud Pai Sho is a game of harmony. The goal is to arrange your Flower Tiles to create a ring of Harmonies that surrounds the center of the board.</p> <p>Harmonies are created when two of a player's harmonious tiles are on the same line with nothing in between them. But be careful; tiles that clash can never be lined up on the board.</p> <p>Select tiles or points on the board to learn more, and read through the <a href='https://skudpaisho.com/site/games/skud-pai-sho/' target='_blank'>rules page</a> for the full rules.</p>";
};

SkudPaiShoController.prototype.getAdditionalMessage = function() {
	var msg = "";

	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			if (gameOptionEnabled(OPTION_ALL_ACCENT_TILES)) {
				msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by selecting ALL of your Accent Tiles. <br />";
			} else if (gameOptionEnabled(OPTION_DOUBLE_ACCENT_TILES)) {
				msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by selecting 8 of your Accent Tiles. <br />";
			} else {
				msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by selecting your 4 Accent Tiles. <br />";
			}
		} else {
			if (gameOptionEnabled(OPTION_ALL_ACCENT_TILES)) {
				msg += "Select ALL Accent Tiles to begin the game.";
			} else if (gameOptionEnabled(OPTION_DOUBLE_ACCENT_TILES)) {
				msg += "Select 8 Accent Tiles to play with.";
			} else {
				msg += "Select 4 Accent Tiles to play with.";
			}
		}

		if (!playingOnlineGame()) {
			msg += getGameOptionsMessageHtml(GameType.SkudPaiSho.gameOptions);
		}
	} else if (this.gameNotation.moves.length === 1) {
		if (gameOptionEnabled(OPTION_ALL_ACCENT_TILES)) {
			msg += "Select ALL Accent Tiles to play with,";
		} else if (gameOptionEnabled(OPTION_DOUBLE_ACCENT_TILES)) {
			msg += "Select 8 Accent Tiles to play with,";
		} else {
			msg += "Select 4 Accent Tiles to play with,";
		}
		msg += " then Plant a Basic Flower Tile."
	} else if (this.gameNotation.moves.length === 2) {
		msg += "Plant a Basic Flower Tile.";
	} else if (!gameOptionEnabled(OPTION_INFORMAL_START) && this.gameNotation.moves.length === 4) {
		msg += "Now, make the first move of the game.";
	}

	return msg;
};

SkudPaiShoController.prototype.getExtraHarmonyBonusHelpText = function() {
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

SkudPaiShoController.prototype.showHarmonyBonusMessage = function() {
	document.querySelector(".gameMessage").innerHTML = "Harmony Bonus! Select a tile to play or <span class='skipBonus' onclick='gameController.skipHarmonyBonus();'>skip</span>."
	+ this.getExtraHarmonyBonusHelpText()
	+ getResetMoveText();
};

SkudPaiShoController.prototype.unplayedTileClicked = function(tileDiv) {
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

	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
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

	if (this.gameNotation.moves.length <= 1) {
		// Choosing Accent Tiles
		if (tile.type !== ACCENT_TILE) {
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

		var accentTilesNeededToStart = 4;
		if (gameOptionEnabled(OPTION_ALL_ACCENT_TILES)) {
			accentTilesNeededToStart = this.theGame.tileManager.numberOfAccentTilesPerPlayerSet();
		} else if (gameOptionEnabled(OPTION_DOUBLE_ACCENT_TILES)) {
			accentTilesNeededToStart = accentTilesNeededToStart * 2;
		}

		if (getCurrentPlayer() === HOST) {
			this.hostAccentTiles.push(tileCode);

			if (this.hostAccentTiles.length === accentTilesNeededToStart || (simpleCanonRules && this.hostAccentTiles.length === 2)) {
				var move = new SkudPaiShoNotationMove("0H." + this.hostAccentTiles.join());
				this.gameNotation.addMove(move);
				if (onlinePlayEnabled) {
					createGameIfThatIsOk(GameType.SkudPaiSho.id);
				} else {
					finalizeMove();
				}
			}
		} else {
			this.guestAccentTiles.push(tileCode);

			if (this.guestAccentTiles.length === accentTilesNeededToStart || (simpleCanonRules && this.guestAccentTiles.length === 2)) {
				var move = new SkudPaiShoNotationMove("0G." + this.guestAccentTiles.join());
				this.gameNotation.addMove(move);
				// No finalize move because it is still Guest's turn
				rerunAll();
				showResetMoveMessage();
			}
		}
		this.theGame.actuate();
	} else if (this.notationBuilder.status === BRAND_NEW) {
		// new Planting turn, can be basic flower
		if (tile.type !== BASIC_FLOWER) {
			debug("Can only Plant a Basic Flower tile. That's not one of them.");
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
			this.notationBuilder = new SkudPaiShoNotationBuilder();
		}
	}
};

SkudPaiShoController.prototype.pointClicked = function(htmlPoint) {
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

			this.theGame.revealPossibleMovePoints(boardPoint);
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.theGame.hidePossibleMovePoints(false, move);
			var bonusAllowed = this.theGame.runNotationMove(move);

			if (!gameOptionEnabled(OPTION_INFORMAL_START) && this.gameNotation.moves.length === 2) {
				// Host auto-copies Guest's first Plant
				this.gameNotation.addMove(move);
				var hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.notationBuilder.plantedFlowerType);
				this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
				rerunAll(true);
				// No finalize move because it's still Guest's turn
				showResetMoveMessage();
			} else if (!bonusAllowed) {
				// Move all set. Add it to the notation!
				this.gameNotation.addMove(move);
				if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					finalizeMove();
				}
			} else {
				this.notationBuilder.status = READY_FOR_BONUS;
				this.showHarmonyBonusMessage();
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new SkudPaiShoNotationBuilder();
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
					callSubmitMove(1);
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
				callSubmitMove(1);
			} else {
				finalizeMove(1);
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.status = READY_FOR_BONUS;
		}
	}
};

SkudPaiShoController.prototype.skipHarmonyBonus = function() {
	if (this.notationBuilder.status !== MOVE_DONE) {
		this.notationBuilder.status = MOVE_DONE;
		this.notationBuilder.bonusEndPoint = null;
		var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.gameNotation.addMove(move);
		if (playingOnlineGame()) {
			callSubmitMove(1);
		} else {
			finalizeMove(1);
		}
	}
};

SkudPaiShoController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new SkudPaiShoTile(divName.substring(1), divName.charAt(0));

	var tileMessage = this.getHelpMessageForTile(tile);

	return {
		heading: tileMessage.heading,
		message: tileMessage.message
	}
};

SkudPaiShoController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	var heading;
	var message = [];
	if (boardPoint.hasTile()) {
		var tileMessage = this.getHelpMessageForTile(boardPoint.tile);
		tileMessage.message.forEach(function(messageString){
			message.push(messageString);
		});
		heading = tileMessage.heading;
		// Specific tile message
		/**
		Rose
		* In Harmony with Chrysanthemum to the north
		* Trapped by Orchid
		*/
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
	}
	
	if (boardPoint.isType(NEUTRAL)) {
		message.push(getNeutralPointMessage());
	} else if (boardPoint.isType(RED) && boardPoint.isType(WHITE)) {
		message.push(getRedWhitePointMessage());
	} else if (boardPoint.isType(RED)) {
		message.push(getRedPointMessage());
	} else if (boardPoint.isType(WHITE)) {
		message.push(getWhitePointMessage());
	} else if (boardPoint.isType(GATE)) {
		message.push(getGatePointMessage());
	}

	return {
		heading: heading,
		message: message
	}
};

SkudPaiShoController.prototype.getHelpMessageForTile = function(tile) {
	var message = [];

	var tileCode = tile.code;

	var heading = SkudPaiShoTile.getTileName(tileCode);

	message.push(tile.ownerName + "'s tile");

	if (tileCode.length > 1) {
		var colorCode = tileCode.charAt(0);
		var tileNum = parseInt(tileCode.charAt(1));

		var harmTileNum = tileNum - 1;
		var harmTileColor = colorCode;
		if (harmTileNum < 3) {
			harmTileNum = 5;
			if (colorCode === 'R') {
				harmTileColor = 'W';
			} else {
				harmTileColor = 'R';
			}
		}

		var harmTile1 = SkudPaiShoTile.getTileName(harmTileColor + harmTileNum);

		harmTileNum = tileNum + 1;
		harmTileColor = colorCode;
		if (harmTileNum > 5) {
			harmTileNum = 3;
			if (colorCode === 'R') {
				harmTileColor = 'W';
			} else {
				harmTileColor = 'R';
			}
		}

		var harmTile2 = SkudPaiShoTile.getTileName(harmTileColor + harmTileNum);

		harmTileNum = tileNum;
		if (colorCode === 'R') {
			harmTileColor = 'W';
		} else {
			harmTileColor = 'R';
		}
		var clashTile = SkudPaiShoTile.getTileName(harmTileColor + harmTileNum);

		message.push("Basic Flower Tile");
		message.push("Can move up to " + tileNum + " spaces");
		message.push("Forms Harmony with " + harmTile1 + " and " + harmTile2);
		message.push("Clashes with " + clashTile);
	} else {
		if (tileCode === 'R') {
			heading = "Accent Tile: Rock";
			if (simplest) {
				message.push("The Rock disrupts Harmonies and cannot be moved by a Wheel.");
			} else if (rocksUnwheelable) {
				if (simpleRocks) {
					message.push("The Rock blocks Harmonies and cannot be moved by a Wheel.");
				} else {
					message.push("The Rock cancels Harmonies on horizontal and vertical lines it lies on. A Rock cannot be moved by a Wheel.");
				}
			} else {
				message.push("The Rock cancels Harmonies on horizontal and vertical lines it lies on.");
			}
		} else if (tileCode === 'W') {
			heading = "Accent Tile: Wheel";
			if (rocksUnwheelable || simplest) {
				message.push("The Wheel rotates all surrounding tiles one space clockwise but cannot move a Rock (cannot move tiles off the board or onto or off of a Gate).");
			} else {
				message.push("The Wheel rotates all surrounding tiles one space clockwise (cannot move tiles off the board or onto or off of a Gate).");
			}
		} else if (tileCode === 'K') {
			heading = "Accent Tile: Knotweed";
			if (newKnotweedRules) {
				message.push("The Knotweed drains surrounding Flower Tiles so they are unable to form Harmony.");
			} else {
				message.push("The Knotweed drains surrounding Basic Flower Tiles so they are unable to move or form Harmony.");
			}
		} else if (tileCode === 'B') {
			heading = "Accent Tile: Boat";
			if (simplest || rocksUnwheelable) {
				message.push("The Boat moves a Flower Tile to a surrounding space or removes an Accent tile.");
			} else if (rocksUnwheelable) {
				message.push("The Boat moves a Flower Tile to a surrounding space or removes a Rock or Knotweed tile.");
			} else {
				message.push("The Boat moves a Flower Tile to a surrounding space or removes a Knotweed tile.");
			}
		} else if (tileCode === 'L') {
			heading = "Special Flower: White Lotus";
			message.push("Can move up to 2 spaces");
			message.push("Forms Harmony with all Basic Flower Tiles of either player");
			if (!lotusNoCapture && !simplest) {
				message.push("Can be captured by any Flower Tile");
			}
		} else if (tileCode === 'O') {
			heading = "Special Flower: Orchid";
			message.push("Can move up to 6 spaces");
			message.push("Traps opponent's surrounding Blooming Flower Tiles so they cannot move");
			if (!simplest) {
				message.push("Can capture Flower Tiles if you have a Blooming White Lotus");
			}
			if (lotusNoCapture || simplest) {
				message.push("Can be captured by any Flower Tile if you have a Blooming White Lotus");
			} else {
				message.push("Can be captured by any Basic Flower Tile if your White Lotus has been played");
			}
		} else if (tileCode === 'M') {
			heading = "Accent Tile: Bamboo";
			message.push("<em>--- Ancient Oasis Expansion rules subject to change ---</em>")
			// message.push("When played, return each surrounding tile to owner's hand");
			message.push("If played on a point surrounding a Blooming Flower Tile belonging to the owner (but not surrounding a tile in a Gate), return each surrounding tile to owner's hand when played.");
			message.push("Tiles surrounding Bamboo cannot be captured");
		} else if (tileCode === 'P') {
			heading = "Accent Tile: Pond";
			message.push("<em>--- Ancient Oasis Expansion rules subject to change ---</em>")
			message.push("Flower Tiles may be Planted on points surrounding a Pond");
			message.push("(Tiles are Blooming after being Planted)");
		} else if (tileCode === 'T') {
			heading = "Accent Tile: Lion Turtle";
			message.push("<em>--- Ancient Oasis Expansion rules subject to change ---</em>")
			message.push("Flower tiles surrounding a Lion Turtle form Harmony with all Basic Flower Tiles of either player");
			message.push("The owner of the Lion Turtle owns the Harmonies that include both players' tiles");
			message.push("(Overlap with other Lion Turtle tiles can combine this effect, so Harmonies can potentially belong to both players)");
		}
	}

	return {
		heading: heading,
		message: message
	}
};

SkudPaiShoController.prototype.playAiTurn = function(finalizeMove) {
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

SkudPaiShoController.prototype.startAiGame = function(finalizeMove) {
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

SkudPaiShoController.prototype.getAiList = function() {
	return [new SkudAIv1()];
};

SkudPaiShoController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length <= 1) {
		if (this.gameNotation.moves.length === 0) {
			return HOST;
		} else {
			return GUEST;
		}
	}
	if (this.gameNotation.moves.length <= 2) {
		return GUEST;
	}
	var lastPlayer = this.gameNotation.moves[this.gameNotation.moves.length - 1].player;

	if (lastPlayer === HOST) {
		return GUEST;
	} else if (lastPlayer === GUEST) {
		return HOST;
	}
};

SkudPaiShoController.prototype.cleanup = function() {
	// Nothing.
};

SkudPaiShoController.prototype.isSolitaire = function() {
	return false;
};

SkudPaiShoController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

SkudPaiShoController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Skud Pai Sho Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(SkudPaiShoController.buildTileDesignDropdownDiv());

	settingsDiv.appendChild(document.createElement("br"));

	settingsDiv.appendChild(this.buildToggleHarmonyAidsDiv());

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
};

SkudPaiShoController.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("skudPaiShoTileDesignDropdown", labelText + ":", tileDesignTypeValues,
							localStorage.getItem(tileDesignTypeKey),
							function() {
								setSkudTilesOption(this.value);
							});
};

SkudPaiShoController.prototype.buildToggleHarmonyAidsDiv = function() {
	var div = document.createElement("div");
	var onOrOff = getUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey) !== "true" ? "on" : "off";
	div.innerHTML = "Harmony aids are " + onOrOff + ": <span class='skipBonus' onclick='gameController.toggleHarmonyAids();'>toggle</span>";
	if (gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)) {
		div.innerHTML += " (Will not affect games with " + NO_HARMONY_VISUAL_AIDS + " game option)";
	}
	return div;
};

SkudPaiShoController.prototype.toggleHarmonyAids = function() {
	setUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey, 
		getUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey) !== "true");
	clearMessage();
	this.callActuate();
};

SkudPaiShoController.prototype.setAnimationsOn = function(isAnimationsOn) {
	this.actuator.setAnimationOn(isAnimationsOn);
};
