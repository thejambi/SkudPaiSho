// Pai Sho Main

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
  	var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
        	query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
    	var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
    	query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
    	query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
} 
return query_string;
}();


var url;

var theGame;
var gameNotation;
var notationBuilder;
var beginPhaseData;

var hostAccentTiles = [];
var guestAccentTiles = [];

var BRAND_NEW = "Brand New";
var WAITING_FOR_ENDPOINT = "Waiting for endpoint";
var READY_FOR_BONUS = "READY_FOR_BONUS";
var WAITING_FOR_BONUS_ENDPOINT = "WAITING_FOR_BONUS_ENDPOINT";
var WAITING_FOR_BOAT_BONUS_POINT = "WAITING_FOR_BOAT_BONUS_POINT";

var HOST_SELECT_ACCENTS = "HOST_SELECT_ACCENTS";

window.requestAnimationFrame(function () {
	url = window.location.href.split('?')[0];

	theGame = new GameManager();

	gameNotation = new GameNotation();
	gameNotation.setNotationText(QueryString.game);

	refreshNotationDisplay();

	notationBuilder = new NotationBuilder();

	rerunAll();
});

function inputNow() {
	gameNotation.addNotationLine(document.getElementById("notationInput").value);

	refreshNotationDisplay();
}

function refreshNotationDisplay() {
	document.getElementById("notationText").innerHTML = gameNotation.getNotationHtml();
}

var currentMoveIndex = 0;

function playNextMove(withActuate) {
	if (currentMoveIndex >= gameNotation.moves.length) {
		// no more moves to run
		return false;
	} else {
		theGame.runNotationMove(gameNotation.moves[currentMoveIndex], withActuate);
		currentMoveIndex++;
		return true;
	}
}

function playPrevMove() {
	var moveToPlayTo = currentMoveIndex - 1;

	theGame = new GameManager();

	notationBuilder = new NotationBuilder();

	currentMoveIndex = 0;

	while (currentMoveIndex < moveToPlayTo) {
		playNextMove();
	}
}

function playAllMoves() {
	while (playNextMove(false)) {
		// Nothing!
	}
	theGame.actuate();
}

function getAdditionalMessage() {
	var msg = " ";
	if (gameNotation.moves.length === 0) {
		msg += "Select 4 Accent Tiles to play with.";
	} else if (gameNotation.moves.length === 1) {
		msg += "Select 4 Accent Tiles to play with, then Plant a Basic Flower Tile.";
	}
	return msg;
}

function refreshMessage() {
	document.querySelector(".gameMessage").innerText = "Current Player: " + getCurrentPlayer() + getAdditionalMessage();
}

function rerunAll() {
	theGame = new GameManager();
	
	notationBuilder = new NotationBuilder();

	currentMoveIndex = 0;

	playAllMoves();

	refreshMessage();
}

function finalizeMove() {
	rerunAll();

	var linkUrl = url + "?game=" + gameNotation.notationText;
	var messageText = "Copy this <a href=\"" + linkUrl + "\">link</a> and send to the " + getCurrentPlayer();

	document.querySelector(".gameMessage").innerHTML = messageText;
}

function getCurrentPlayer() {
	if (gameNotation.moves.length <= 1) {
		if (gameNotation.moves.length === 0) {
			return HOST;
		} else {
			return GUEST;
		}
	}
	if (currentMoveIndex <= 2) {
		return GUEST;
	}
	var lastPlayer = gameNotation.moves[currentMoveIndex - 1].player;

	if (lastPlayer === HOST) {
		return GUEST;
	} else if (lastPlayer === GUEST) {
		return HOST;
	}
}

function showHarmonyBonusMessage() {
	document.querySelector(".gameMessage").innerHTML = "Harmony Bonus! Select a tile to play or <span class='skipBonus' onclick='skipHarmonyBonus()'>skip</span>.";
}

function unplayedTileClicked(tileDiv) {
	if (currentMoveIndex !== gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var divName = tileDiv.getAttribute("name");	// Like: RW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile = theGame.tileManager.peekTile(player, tileCode, tileId);

	if (tile.ownerName !== getCurrentPlayer()) {
		// debug("That's not your tile!");
		return;
	}

	if (gameNotation.moves.length <= 1) {
		// Choosing Accent Tiles
		if (tile.type !== ACCENT_TILE) {
			return;
		}

		if (!tile.selectedFromPile) {
			tile.selectedFromPile = true;
			var removeTileCodeFrom = hostAccentTiles;
			if (getCurrentPlayer() === GUEST) {
				removeTileCodeFrom = guestAccentTiles;
			}

			removeTileCodeFrom.splice(removeTileCodeFrom.indexOf(tileCode), 1);

			theGame.actuate();
			return;
		}

		tile.selectedFromPile = false;
		if (getCurrentPlayer() === HOST) {
			hostAccentTiles.push(tileCode);

			if (hostAccentTiles.length === 4) {
				var move = new NotationMove("0H." + hostAccentTiles.join());
				gameNotation.addMove(move);
				finalizeMove();
			}
		} else {
			guestAccentTiles.push(tileCode);
			
			if (guestAccentTiles.length === 4) {
				var move = new NotationMove("0G." + guestAccentTiles.join());
				gameNotation.addMove(move);
				rerunAll();
			}
		}
		theGame.actuate();
	} else if (notationBuilder.status === BRAND_NEW) {
		tile.selectedFromPile = true;
		// new Planting turn, can be basic flower
		if (tile.type !== BASIC_FLOWER) {
			debug("Can only Plant a Basic Flower tile. That's not one of them.");
			return false;
		}

		notationBuilder.moveType = PLANTING;
		notationBuilder.plantedFlowerType = tileCode;
		notationBuilder.status = WAITING_FOR_ENDPOINT;

		theGame.revealOpenGates(gameNotation.moves.length);
	} else if (notationBuilder.status === READY_FOR_BONUS) {
		tile.selectedFromPile = true;
		// Bonus Plant! Can be any tile
		notationBuilder.bonusTileCode = tileCode;
		notationBuilder.status = WAITING_FOR_BONUS_ENDPOINT;

		if (tile.type === BASIC_FLOWER) {
			theGame.revealOpenGates();
		} else {
			theGame.revealPossiblePlacementPoints(tile);
		}
	} else {
		theGame.hidePossibleMovePoints();
		notationBuilder = new NotationBuilder();
	}
}

function pointClicked(htmlPoint) {
	if (currentMoveIndex !== gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = theGame.board.cells[rowCol.row][rowCol.col];

	if (notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {
			if (boardPoint.tile.ownerName !== getCurrentPlayer()) {
				debug("That's not your tile!");
				return;
			}

			if (boardPoint.tile.type === ACCENT_TILE) {
				return;
			}

			if (boardPoint.tile.drained || boardPoint.tile.trapped) {
				debug("Cannot move drained or trapped tile!");
				return;
			}

			notationBuilder.status = WAITING_FOR_ENDPOINT;
			notationBuilder.moveType = ARRANGING;
			notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			theGame.revealPossibleMovePoints(boardPoint);
		}
	} else if (notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			theGame.hidePossibleMovePoints();
			notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			
			var move = gameNotation.getNotationMoveFromBuilder(notationBuilder);
			var bonusAllowed = theGame.runNotationMove(move);

			if (gameNotation.moves.length === 2) {
				// Host auto-copies Guest's first Plant
				gameNotation.addMove(move);
				var hostMoveBuilder = notationBuilder.getFirstMoveForHost(notationBuilder.plantedFlowerType);
				gameNotation.addMove(gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
				finalizeMove();
			} else if (!bonusAllowed) {
				// Move all set. Add it to the notation!
				gameNotation.addMove(move);
				finalizeMove();
			} else {
				notationBuilder.status = READY_FOR_BONUS;
				showHarmonyBonusMessage();
			}
		} else {
			theGame.hidePossibleMovePoints();
			notationBuilder = new NotationBuilder();
		}
	} else if (notationBuilder.status === WAITING_FOR_BONUS_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {

			theGame.hidePossibleMovePoints();
			notationBuilder.bonusEndPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			// If we're placing a boat, and boardPoint is opponent's basic flower...
			if (notationBuilder.bonusTileCode.endsWith("B") && boardPoint.tile.type == BASIC_FLOWER) {
				// Boat played on basic flower, need to pick flower endpoint
				notationBuilder.status = WAITING_FOR_BOAT_BONUS_POINT;
				theGame.revealBoatBonusPoints(boardPoint);
			} else {
				var move = gameNotation.getNotationMoveFromBuilder(notationBuilder);
				
				gameNotation.addMove(move);
				finalizeMove();
			}
		} else {
			theGame.hidePossibleMovePoints();
			notationBuilder.status = READY_FOR_BONUS;
		}
	} else if (notationBuilder.status === WAITING_FOR_BOAT_BONUS_POINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			theGame.hidePossibleMovePoints();
			notationBuilder.boatBonusPoint = new NotationPoint(htmlPoint.getAttribute("name"));
			var move = gameNotation.getNotationMoveFromBuilder(notationBuilder);
			gameNotation.addMove(move);
			finalizeMove();
		} else {
			theGame.hidePossibleMovePoints();
			notationBuilder.status = READY_FOR_BONUS;
		}
	}
}

function skipHarmonyBonus() {
	var move = gameNotation.getNotationMoveFromBuilder(notationBuilder);
	gameNotation.addMove(move);
	finalizeMove();
}








