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

function playNextMove() {
	if (currentMoveIndex >= gameNotation.moves.length) {
		// no more moves to run
		return false;
	} else {
		theGame.runNotationMove(gameNotation.moves[currentMoveIndex]);
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
	while (playNextMove()) {
		// Nothing!
	}
	theGame.actuate();
}

function rerunAll() {
	theGame = new GameManager();
	
	notationBuilder = new NotationBuilder();

	currentMoveIndex = 0;

	playAllMoves();

	debug(getCurrentPlayer());
}

function getCurrentPlayer() {
	if (gameNotation.moves.length === 0) {
		if (hostAccentTiles.length < 4) {
			return HOST;
		} else {
			return GUEST;
		}
	}
	if (currentMoveIndex === 0) {
		return GUEST;
	}
	var lastPlayer = gameNotation.moves[currentMoveIndex - 1].player;

	if (lastPlayer === HOST) {
		return GUEST;
	} else if (lastPlayer === GUEST) {
		return HOST;
	}
}

function unplayedTileClicked(tileDiv) {
	if (currentMoveIndex !== gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var divName = tileDiv.getAttribute("name");	// Like: RW5 or HL
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile = theGame.tileManager.peekTile(player, tileCode);

	if (tile.ownerName !== getCurrentPlayer()) {
		// debug("That's not your tile!");
		return;
	}


	tile.selectedFromPile = true;

	// For PLANTING!
	if (gameNotation.moves.length === 0) {
		// Choosing Accent Tiles

	} else if (notationBuilder.status === BRAND_NEW) {
		// new Planting turn, can be basic flower
		if (tile.type !== BASIC_FLOWER) {
			debug("Can only Plant a Basic Flower tile. That's not one of them.");
			return false;
		}

		notationBuilder.moveType = PLANTING;
		notationBuilder.plantedFlowerType = tileCode;
		notationBuilder.status = WAITING_FOR_ENDPOINT;

		theGame.revealOpenGates();
	} else if (notationBuilder.status === READY_FOR_BONUS) {
		// Bonus Plant! Can be any tile
		notationBuilder.bonusTileCode = tileCode;
		notationBuilder.status = WAITING_FOR_BONUS_ENDPOINT;

		if (tile.type === BASIC_FLOWER) {
			theGame.revealOpenGates();
		} else {
			theGame.revealPossiblePlacementPoints(tile);
		}
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

			if (!bonusAllowed) {
				// Move all set. Add it to the notation!
				gameNotation.addMove(move);
				rerunAll();
			} else {
				// They need to be able to add their Harmony Bonus to the current move
				debug("You'll get your bonus soon!");
				notationBuilder.status = READY_FOR_BONUS;
				document.querySelector(".bonusContainer").classList.remove("hidden");
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
				document.querySelector(".bonusContainer").classList.add("hidden");
				rerunAll();
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
			rerunAll();
		} else {
			theGame.hidePossibleMovePoints();
			notationBuilder.status = READY_FOR_BONUS;
		}
	}
}

function skipHarmonyBonus() {
	document.querySelector(".bonusContainer").classList.add("hidden");
	var move = gameNotation.getNotationMoveFromBuilder(notationBuilder);
	gameNotation.addMove(move);
	rerunAll();
}








