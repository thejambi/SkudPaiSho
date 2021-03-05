/* Skud Pai Sho specific UI interaction logic */

function FirePaiShoController(gameContainer, isMobile) {
	this.actuator = new FirePaiShoActuator(gameContainer, isMobile, isAnimationsOn());
	this.gameContainer = gameContainer;
	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	this.isPaiShoGame = true;
}

FirePaiShoController.prototype.createActuator = function() {
	this.actuator = new FirePaiShoActuator(this.gameContainer, this.isMobile, isAnimationsOn());
	if (this.theGame) {
		this.theGame.updateActuator(this.actuator);
	}
};

FirePaiShoController.hideHarmonyAidsKey = "HideHarmonyAids";

FirePaiShoController.boardRotationKey = "BoardRotation";

FirePaiShoController.prototype.getGameTypeId = function() {
	return GameType.FirePaiSho.id;
};

FirePaiShoController.prototype.completeSetup = function() {
	this.createActuator();
	this.callActuate();
};

FirePaiShoController.prototype.resetGameManager = function() {
	this.theGame = new FirePaiShoGameManager(this.actuator);
};

FirePaiShoController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new FirePaiShoNotationBuilder();	// Will be ... FirePaiShoNotationBuilder
};

FirePaiShoController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

FirePaiShoController.prototype.getMoveNumber = function() {
	/* Function needed to support randomizer */
	return this.gameNotation.moves.length;
};

FirePaiShoController.prototype.getNewGameNotation = function() {
	return new FirePaiShoGameNotation();
};

FirePaiShoController.getHostTilesContainerDivs = function() {
	return '';
};

FirePaiShoController.getGuestTilesContainerDivs = function() {
	return '';
};

FirePaiShoController.prototype.callActuate = function() {
	this.theGame.actuate();
};

FirePaiShoController.prototype.resetMove = function() {
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();

	} else if (this.notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}


};

FirePaiShoController.prototype.undoMoveAllowed = function() {
	// Returning false here will automatically submit the move, bypassing the confirm button when callSubmitMove is called
	return true;
}

FirePaiShoController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Fire Pai Sho</h4> <p>Pai Sho is a game of harmony. The goal is to arrange your Flower Tiles to create a ring of Harmonies that surrounds the center of the board.</p> <p>Harmonies are created when two of a player's harmonious tiles are on the same line with nothing in between them. But be careful; tiles that clash can never be lined up on the board.</p> <p>Select tiles or points on the board to learn more.</p>";
};

FirePaiShoController.prototype.getAdditionalMessage = function() {
	var msg = "";

	msg += "<p>Host reserve tiles: " + this.theGame.tileManager.hostReserveTiles.length + "<br>Guest reserve tiles: " + this.theGame.tileManager.guestReserveTiles.length + "</p>";

	if (this.gameNotation.moves.length === 0) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
				msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by selecting Start Online Game below.<br />";
			}

		if (!playingOnlineGame()) {
			msg += getGameOptionsMessageHtml(GameType.FirePaiSho.gameOptions);
			if (onlinePlayEnabled && this.gameNotation.moves.length === 0) {
				msg += "<br><span class='skipBonus' onClick='gameController.startOnlineGame()'>Start Online Game</span><br />";
			}
		}
	}

	return msg;
};

FirePaiShoController.prototype.startOnlineGame = function() {
	createGameIfThatIsOk(GameType.FirePaiSho.id);
};

FirePaiShoController.getTileNameFromCode = function(code) {
	if (code === "W3") {
		return "White 3 Jasmine";
	}
	else if (code === "W4") {
		return "White 4 Lily";
	}
	else if (code === "W5") {
		return "White 5 White Jade";
	}
	else if (code === "R3") {
		return "Red 3 Rose";
	}
	else if (code === "R4") {
		return "Red 4 Chrysanthemum";
	}
	else if (code === "R5") {
		return "Red 5 Rhododendron";
	}
	else if (code === "R") {
		return "Rock";
	}
	else if (code === "B") {
		return "Boat";
	}
	else if (code === "K") {
		return "Knotweed";
	}
	else if (code === "W") {
		return "Wheel";
	}
	else if (code === "O") {
		return "Orchid";
	}
	else if (code === "L") {
		return "White Lotus";
	}
	else {
		return "unkown tile code";
	}
};

FirePaiShoController.getFireGatePointMessage = function() {
	var msg = "<h4>Gate</h4>";
	msg += '<p>This point is a Gate. Tiles may not be played or moved here, and harmonies cannot pass though a gate.</p>';
	return msg;
}

FirePaiShoController.prototype.getExtraHarmonyBonusHelpText = function() {

	var retstring = " <br /> Your bonus tile is: ";
	retstring += FirePaiShoController.getTileNameFromCode(this.notationBuilder.bonusTileCode);
	return retstring; 
	/** GATES RULE DONT MATTER IN FIRE PAI SHO
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
*/
};

FirePaiShoController.prototype.showHarmonyBonusMessage = function() {
	document.querySelector(".gameMessage").innerHTML = "Harmony Bonus! Play a random tile from your reserve!"
	+ this.getExtraHarmonyBonusHelpText()
	+ getResetMoveText();
};

FirePaiShoController.prototype.unplayedTileClicked = function(tileDiv) {
	if (this.theGame.getWinner() && this.notationBuilder.status !== READY_FOR_BONUS) {
		return;
	}
	if (!myTurn()) {
		return;
	}
	
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		//console.log("Can only interact if all moves are played.");
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

	var bonus = false;
	if (this.notationBuilder.status === READY_FOR_BONUS){
		bonus = true;
	}

	if (bonus){
		if (player === HOST){
			correctPile = this.theGame.tileManager.hostReserveTiles;
		}
		else {
			correctPile = this.theGame.tileManager.guestReserveTiles;
		}
	} else {
		if (player === HOST){
			correctPile = this.theGame.tileManager.hostLibraryTiles;
		}
		else {
			correctPile = this.theGame.tileManager.guestLibraryTiles;
		}
	}

	//console.log("Current player is " + playerCode + ", peeking at " + tileCode + ". Notation builder status: " + this.notationBuilder.status + ". Turn no: " + currentMoveIndex + "," + this.gameNotation.moves.length);
	

	var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId, bonus);

	if (!correctPile.includes(tile)){
		//console.log("Correct pile doesn't include he one selected. aborting the click");
		return;
	}

	if (tile.ownerName !== getCurrentPlayer()) {
		// debug("That's not your tile!");
		return;
	}

	
	/** FORGET THE CHOOSING ACCENT TILES THINGS 
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
				var move = new FirePaiShoNotationMove("0H." + this.hostAccentTiles.join());
				this.gameNotation.addMove(move);
				if (onlinePlayEnabled) {
					createGameIfThatIsOk(GameType.FirePaiSho.id);
				} else {
					finalizeMove();
				}
			}
		} else {
			this.guestAccentTiles.push(tileCode);

			if (this.guestAccentTiles.length === accentTilesNeededToStart || (simpleCanonRules && this.guestAccentTiles.length === 2)) {
				var move = new FirePaiShoNotationMove("0G." + this.guestAccentTiles.join());
				this.gameNotation.addMove(move);
				// No finalize move because it is still Guest's turn
				rerunAll();
				showResetMoveMessage();
			}
		}
		this.theGame.actuate();
	} 
	*/
	if (this.notationBuilder.status === BRAND_NEW) {
		// new Planting turn, can be basic flower -- NO WAIT CAN BE ANYTHING
//		if (tile.type !== BASIC_FLOWER) {
//			debug("Can only Plant a Basic Flower tile. That's not one of them.");
//			return false;
//		}


		tile.selectedFromPile = true;

		this.notationBuilder.moveType = PLANTING;
		this.notationBuilder.plantedFlowerType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		if (this.gameNotation.moves.length === 0)
		{
			this.theGame.revealFirstMovePlacement();
		} else{
		this.theGame.revealPossiblePlacementPoints(tile);
		}

	} else if (this.notationBuilder.status === READY_FOR_BONUS) {



/** CLICKING ON THE TILES SHOULD DO NOTHING WHEN WAITING ON A BONUS, SINCE THE TILE IS ALREADY SELECTED FOR THE PLAYER
		tile.selectedFromPile = true;
		// Bonus Plant! Can be any tile
		//console.log("Was ready for a bonus tile and now you selected one: " + tileCode);
		this.notationBuilder.bonusTileCode = tileCode;
		this.notationBuilder.status = WAITING_FOR_BONUS_ENDPOINT;
		
//		if (tile.type === BASIC_FLOWER && this.theGame.playerCanBonusPlant(getCurrentPlayer())) {
//			this.theGame.revealOpenGates(getCurrentPlayer(), tile);
//		} else if (tile.type === ACCENT_TILE) {
			this.theGame.revealPossiblePlacementPoints(tile);
//		} else if (tile.type === SPECIAL_FLOWER) {
//			if (!specialFlowerLimitedRule
//				|| (specialFlowerLimitedRule && this.theGame.playerCanBonusPlant(getCurrentPlayer()))) {
//				this.theGame.revealSpecialFlowerPlacementPoints(getCurrentPlayer(), tile);
//			}
//		}

*/

	} else if (this.notationBuilder.status === WAITING_FOR_BONUS_ENDPOINT
			|| this.notationBuilder.status === WAITING_FOR_BOAT_BONUS_POINT) {
			//this.notationBuilder.status = READY_FOR_BONUS;
			//this.showHarmonyBonusMessage();
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new FirePaiShoNotationBuilder();
	}
};

FirePaiShoController.prototype.pointClicked = function(htmlPoint) {
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
		//console.log("Brand new click on board");
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

			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = ARRANGING;
			//console.log("Waiting for endpoint on an arrange move");
			this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			this.theGame.revealPossibleMovePoints(boardPoint);
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		//console.log("Was waiting for an endpoint and you clicked one!");
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			//console.log("And that was a legit move.");
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			//console.log("Here's the notation move: " + move);
			this.theGame.hidePossibleMovePoints(false, move);
			var bonusAllowed = this.theGame.runNotationMove(move);

//			if (!gameOptionEnabled(OPTION_INFORMAL_START) && this.gameNotation.moves.length === 2) {
//				// Host auto-copies Guest's first Plant
//				this.gameNotation.addMove(move);
//				var hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.notationBuilder.plantedFlowerType);
//				this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
//				rerunAll(true);
//				// No finalize move because it's still Guest's turn
//				showResetMoveMessage();
//			} else 
			
			if (!bonusAllowed) {
				// Move all set. Add it to the notation!
				//console.log("about to add the move to the game notation");
				this.gameNotation.addMove(move);
				if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					//console.log("Now we're all set, so we're finalizing the move");
					finalizeMove();
				}
			} else {
				this.notationBuilder.status = READY_FOR_BONUS;
				
				var tile = this.theGame.drawReserveTileFromTileManager(getCurrentPlayer());
				tile.selectedFromPile = true;
				//TK STILL NEED TO MAKE THIS TILE DISPLAY SOMEWHERE....
				// Bonus Plant! Can be any tile
				var tileCode = tile.code;
				//console.log("Was ready for a bonus tile and now you selected one: " + tileCode + "and if it's an accent tile: " + tile.accentType);
				
				this.notationBuilder.bonusTileCode = tileCode;
				this.showHarmonyBonusMessage();
				this.theGame.revealPossiblePlacementPoints(tile);
				this.notationBuilder.status = WAITING_FOR_BONUS_ENDPOINT;
			}
		} else {

			//console.log("And that was totally NOT a legit move.");
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new FirePaiShoNotationBuilder();
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
				this.theGame.clearDrawnReserveTile();
				if (playingOnlineGame()) {
					callSubmitMove(1);
				} else {
					finalizeMove(1);
				}
			}
		} else {
			//this.theGame.hidePossibleMovePoints();
			//this.notationBuilder.status = READY_FOR_BONUS;
		}
	} else if (this.notationBuilder.status === WAITING_FOR_BOAT_BONUS_POINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {

			this.notationBuilder.status = MOVE_DONE;

			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.boatBonusPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.gameNotation.addMove(move);
			this.theGame.clearDrawnReserveTile();
			if (playingOnlineGame()) {
				callSubmitMove(1);
			} else {
				finalizeMove(1);
			}
		} else {
			//IF IT AS IN ILLEGAL MOVE, LET THE BOAT CHOOSE ITS PLACEMENT AGAIN
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.status = WAITING_FOR_BONUS_ENDPOINT;
			this.theGame.revealPossiblePlacementPoints(this.currentlyDrawnReserve);
		}
	}
};

FirePaiShoController.prototype.skipHarmonyBonus = function() {
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

FirePaiShoController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new FirePaiShoTile(divName.substring(1), divName.charAt(0));

	var tileMessage = this.getHelpMessageForTile(tile);

	return {
		heading: tileMessage.heading,
		message: tileMessage.message
	}
};

FirePaiShoController.prototype.getPointMessage = function(htmlPoint) {
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

		// boosted? Trapped? Anything else?
		if (boardPoint.tile.boosted) {
			message.push("Currently <em>boosted</em> by a Knotweed.");
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
		message.push(FirePaiShoController.getFireGatePointMessage());
	}

	return {
		heading: heading,
		message: message
	}
};

FirePaiShoController.prototype.getHelpMessageForTile = function(tile) {
	var message = [];

	var tileCode = tile.code;

	var heading = FirePaiShoTile.getTileName(tileCode);

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

		var harmTile1 = FirePaiShoTile.getTileName(harmTileColor + harmTileNum);

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

		var harmTile2 = FirePaiShoTile.getTileName(harmTileColor + harmTileNum);

		harmTileNum = tileNum;
		if (colorCode === 'R') {
			harmTileColor = 'W';
		} else {
			harmTileColor = 'R';
		}
		var clashTile = FirePaiShoTile.getTileName(harmTileColor + harmTileNum);

		message.push("Basic Flower Tile");
		message.push("Can move up to " + tileNum + " spaces");
		message.push("Forms Harmony with " + harmTile1 + " and " + harmTile2);
		message.push("Clashes with " + clashTile);
	} else {
		if (tileCode === 'R') {
			heading = "Accent Tile: Rock";
			if (simplest) {
				message.push("The Rock creates Harmonies along its lines and cannot be moved by a Wheel.");
			} else if (rocksUnwheelable) {
				if (simpleRocks) {
					message.push("The Rock creates Harmonies along its lines and cannot be moved by a Wheel.");
				} else {
					message.push("The Rock creates Harmonies for same-player tiles on horizontal and vertical lines it lies on. A Rock cannot be moved by a Wheel.");
				}
			} else {
				message.push("The Rock Rock creates Harmonies along its lines vertical lines it lies on.");
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
				message.push("The Knotweed boosts surrounding Flower Tiles so they will form harmony with all other same-player tiles.");
			} else {
				message.push("The Knotweed boosts surrounding Flower Tiles so they will form harmony with all other same-player tiles.");
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
			message.push("Forms Harmony with all non-Lotus Flower Tiles of either player");
			if (!lotusNoCapture && !simplest) {
				message.push("Can be captured by any Flower Tile");
			}
		} else if (tileCode === 'O') {
			heading = "Special Flower: Orchid";
			message.push("Can move up to 6 spaces");
			message.push("Forms no natural harmonies of its own, but can form harmony using the special powers of other tiles.");
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

FirePaiShoController.prototype.playAiTurn = function(finalizeMove) {
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

//	if (playerMoveNum === 1 && getCurrentPlayer() === HOST) {
//		// Auto mirror guest move
//		// Host auto-copies Guest's first Plant
//		var hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.gameNotation.moves[this.gameNotation.moves.length - 1].plantedFlowerType);
//		this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
//		finalizeMove();
//	} else 
	
	if (playerMoveNum < 3) {
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

FirePaiShoController.prototype.startAiGame = function(finalizeMove) {
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

FirePaiShoController.prototype.getAiList = function() {
	return [];
};

FirePaiShoController.prototype.getCurrentPlayer = function() {
//	if (this.gameNotation.moves.length <= 1) {
//		if (this.gameNotation.moves.length === 0) {
//			return HOST;
//		} else {
//			return GUEST;
//		}
//	}
	if (this.gameNotation.moves.length == 0) {
		return GUEST;
	}
	var lastPlayer = this.gameNotation.moves[this.gameNotation.moves.length - 1].player;

	if (lastPlayer === HOST) {
		return GUEST;
	} else if (lastPlayer === GUEST) {
		return HOST;
	}
};

FirePaiShoController.prototype.cleanup = function() {
	// Nothing.
};

FirePaiShoController.prototype.isSolitaire = function() {
	return false;
};

FirePaiShoController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

FirePaiShoController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Fire Pai Sho Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(FirePaiShoController.buildTileDesignDropdownDiv());

	settingsDiv.appendChild(document.createElement("br"));

	settingsDiv.appendChild(this.buildToggleHarmonyAidsDiv());

	settingsDiv.appendChild(document.createElement("br"));

	settingsDiv.appendChild(this.buildBoardRotateDiv());

	settingsDiv.appendChild(document.createElement("br"));

	return settingsDiv;
};

FirePaiShoController.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("FirePaiShoTileDesignDropdown", labelText + ":", tileDesignTypeValues,
							localStorage.getItem(tileDesignTypeKey),
							function() {
								setSkudTilesOption(this.value);
							});
};

FirePaiShoController.prototype.buildToggleHarmonyAidsDiv = function() {
	var div = document.createElement("div");
	var onOrOff = getUserGamePreference(FirePaiShoController.hideHarmonyAidsKey) !== "true" ? "on" : "off";
	div.innerHTML = "Harmony aids are " + onOrOff + ": <span class='skipBonus' onclick='gameController.toggleHarmonyAids();'>toggle</span>";
	if (gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)) {
		div.innerHTML += " (Will not affect games with " + NO_HARMONY_VISUAL_AIDS + " game option)";
	}
	return div;
};

FirePaiShoController.prototype.buildBoardRotateDiv = function() {
	var div = document.createElement("div");
	var orientation = getUserGamePreference(FirePaiShoController.boardRotationKey) !== "true" ? "Adevăr" : "Skud";
	div.innerHTML = "Board orientation: " + orientation + ": <span class='skipBonus' onclick='gameController.toggleBoardRotation();'>toggle</span>";
	return div;
};

FirePaiShoController.prototype.toggleHarmonyAids = function() {
	setUserGamePreference(FirePaiShoController.hideHarmonyAidsKey, 
		getUserGamePreference(FirePaiShoController.hideHarmonyAidsKey) !== "true");
	clearMessage();
	this.callActuate();
};


FirePaiShoController.prototype.toggleBoardRotation = function() {
	setUserGamePreference(FirePaiShoController.boardRotationKey, 
		getUserGamePreference(FirePaiShoController.boardRotationKey) !== "true");
	clearMessage();
	this.createActuator();
	this.callActuate();
	refreshMessage();
};

FirePaiShoController.prototype.setAnimationsOn = function(isAnimationsOn) {
	this.actuator.setAnimationOn(isAnimationsOn);
};