/* Solitaire Pai Sho specific UI interaction logic */

function SolitaireController(gameContainer, isMobile) {
	this.actuator = new SolitaireActuator(gameContainer, isMobile);

	this.showGameMessageUnderneath = true;

	this.resetGameNotation();	// First

	this.resetGameManager();
	this.resetNotationBuilder();

	this.drawnTile = null;
	this.lastDrawnTile = null; // Save for Undo

	this.drawRandomTile();

	this.isPaiShoGame = true;
}

SolitaireController.prototype.getGameTypeId = function() {
	return GameType.SolitairePaiSho.id;
};

SolitaireController.prototype.completeSetup = function() {
	this.callActuate();
};

SolitaireController.prototype.drawRandomTile = function() {
	this.lastDrawnTile = this.drawnTile;
	this.drawnTile = this.theGame.drawRandomTile();
};

SolitaireController.prototype.resetGameManager = function() {
	this.theGame = new SolitaireGameManager(this.actuator);
};

SolitaireController.prototype.getMoveNumber = function() {
	return this.gameNotation.moves.length;
};

SolitaireController.prototype.undoMoveAllowed = function() {
	return false;
}

SolitaireController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new SolitaireNotationBuilder();
};

SolitaireController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

SolitaireController.prototype.getNewGameNotation = function() {
	return new SolitaireGameNotation();
};

SolitaireController.getHostTilesContainerDivs = function() {
	return '<div class="HR3 HR4 HR5 HW3 HW4 HW5 HR HW HK HB HL HO">';
}

SolitaireController.getGuestTilesContainerDivs = function() {
	return '<div></div>';
};

SolitaireController.prototype.callActuate = function() {
	// if tilemanager doesn't have drawnTile, draw tile?
	if (this.drawnTile) {
		var tile = this.theGame.tileManager.peekTile(HOST, this.drawnTile.code, this.drawnTile.id);
		if (!tile) {
			this.drawnTile = null;
			this.lastDrawnTile = null; // Save for Undo

			this.drawRandomTile();
		}
	}

	this.theGame.actuate();
};

SolitaireController.prototype.resetMove = function() {
	// Remove last move
	this.gameNotation.removeLastMove();

	if (this.drawnTile) {
		this.drawnTile.selectedFromPile = false;
		this.theGame.tileManager.putTileBack(this.drawnTile);
	} else {
		var lastMove = this.gameNotation.moves[this.gameNotation.moves.length - 1];
		var tile = new SolitaireTile(lastMove.plantedFlowerType, hostPlayerCode);
		this.theGame.tileManager.putTileBack(tile);
		this.lastDrawnTile = tile;
	}

	this.drawnTile = this.lastDrawnTile;
	this.drawnTile.selectedFromPile = false;
};

SolitaireController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Solitaire Pai Sho</h4> <p>Solitaire Pai Sho is a game of harmony, based on Skud Pai Sho. The goal of Solitaire Pai Sho is to place Flower Tiles to create a balance of Harmony and Disharmony on the board.</p> <p>Each turn, you are given a tile that's been drawn for you to place on the board. When all the tiles have been played, the game ends and your score will be calculated.</p> <p><a href='https://skudpaisho.com/site/games/solitaire-pai-sho/'>View the resources page</a> for the rules.</p>";
};

SolitaireController.prototype.getAdditionalMessage = function() {
	var msg = "";
	if (this.gameNotation.moves.length === 0) {
		msg += getGameOptionsMessageHtml(GameType.SolitairePaiSho.gameOptions);
	}
	if (!this.theGame.getWinner()) {
		msg += "<br /><strong>" + this.theGame.getWinReason() + "</strong>";
	}
	return msg;
};

SolitaireController.prototype.unplayedTileClicked = function(tileDiv) {
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

	if (this.notationBuilder.status === BRAND_NEW) {
		tile.selectedFromPile = true;
		this.drawnTile.selectedFromPile = true;

		this.notationBuilder.moveType = PLANTING;
		this.notationBuilder.plantedFlowerType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.setAllLegalPointsOpen(getCurrentPlayer(), tile);
	} else {
		this.theGame.hidePossibleMovePoints();
		this.notationBuilder = new SolitaireNotationBuilder();
	}
}

SolitaireController.prototype.pointClicked = function(htmlPoint) {
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
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			var bonusAllowed = this.theGame.runNotationMove(move);

			if (!bonusAllowed) {
				// Move all set. Add it to the notation!
				this.gameNotation.addMove(move);
				this.drawRandomTile();
				if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
					createGameIfThatIsOk(GameType.SolitairePaiSho.id);
				} else {
					if (playingOnlineGame()) {
						callSubmitMove();
					} else {
						finalizeMove();
					}
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.notationBuilder = new SolitaireNotationBuilder();
		}
	}
}

SolitaireController.prototype.skipHarmonyBonus = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);
	if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
		createGameIfThatIsOk(GameType.SolitairePaiSho.id);
	} else {
		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}
}

SolitaireController.prototype.addTileSummaryToMessageArr = function(message, tileCode) {
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

		var harmTile1 = SolitaireTile.getTileName(harmTileColor + harmTileNum);

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

		var harmTile2 = SolitaireTile.getTileName(harmTileColor + harmTileNum);

		harmTileNum = tileNum;
		if (colorCode === 'R') {
			harmTileColor = 'W';
		} else {
			harmTileColor = 'R';
		}
		var clashTile = SolitaireTile.getTileName(harmTileColor + harmTileNum);

		message.push("Forms Harmony with " + harmTile1 + ", " + harmTile2 + ", and the Lotus");
		message.push("Forms Disharmony with " + clashTile + " and the Orchid");
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
			message.push("Forms Harmony with all Flower Tiles");
		} else if (tileCode === 'O') {
			heading = "Special Flower: Orchid";
			message.push("Forms Disharmony will all Flower Tiles");
		}
	}
};

SolitaireController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new SolitaireTile(divName.substring(1), divName.charAt(0));

	var message = [];

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}
	
	var tileCode = divName.substring(1);

	var heading = SolitaireTile.getTileName(tileCode);

	this.addTileSummaryToMessageArr(message, tileCode);

	return {
		heading: heading,
		message: message
	}
}

SolitaireController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	var message = [];
	if (boardPoint.hasTile()) {
		message.push(toHeading(boardPoint.tile.getName()));
		// Specific tile message
		/**
		Rose
		* In Harmony with Chrysanthemum to the north
		* Trapped by Orchid
		*/
		// Get tile summary message and then Harmony summary
		this.addTileSummaryToMessageArr(message, boardPoint.tile.code);
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
		tileHarmonies = this.theGame.board.harmonyManager.getClashesWithThisTile(boardPoint.tile);
		if (tileHarmonies.length > 0) {
			var bullets = [];
			tileHarmonies.forEach(function(harmony) {
				var otherTile = harmony.getTileThatIsNotThisOne(boardPoint.tile);
				bullets.push(otherTile.getName() 
					+ " to the " + harmony.getDirectionForTile(boardPoint.tile));
			});
			message.push("<strong>Currently in Disharmony with: </strong>" + toBullets(bullets));
		}
	} else {
		if (boardPoint.isType(NEUTRAL)) {
			message.push(getNeutralPointMessage());
		} else if (boardPoint.isType(RED) && boardPoint.isType(WHITE)) {
			message.push(getRedWhitePointMessage());
		} else if (boardPoint.isType(RED)) {
			message.push(getRedPointMessage());
		} else if (boardPoint.isType(WHITE)) {
			message.push(getWhitePointMessage());
		} else if (boardPoint.isType(GATE)) {
			message.push(getNeutralPointMessage());
		}
	}

	return {
		heading: null,
		message: message
	}
}

SolitaireController.prototype.playAiTurn = function(finalizeMove) {
	// 
};

SolitaireController.prototype.startAiGame = function(finalizeMove) {
	// 
};

SolitaireController.prototype.getAiList = function() {
	return [];
}

SolitaireController.prototype.getCurrentPlayer = function() {
	return HOST;
};

SolitaireController.prototype.cleanup = function() {
	// 
};

SolitaireController.prototype.isSolitaire = function() {
	return true;
};

SolitaireController.prototype.setGameNotation = function(newGameNotation) {
	if (this.drawnTile) {
		this.drawnTile.selectedFromPile = false;
		this.theGame.tileManager.putTileBack(this.drawnTile);
	}
	this.resetGameManager();
	this.gameNotation.setNotationText(newGameNotation);
	this.drawRandomTile();
	this.theGame.actuate();
};

