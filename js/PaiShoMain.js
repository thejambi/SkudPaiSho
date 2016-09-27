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

localEmailKey = "localUserEmail";

var url;

var theGame;
var gameNotation;
var notationBuilder;
var beginPhaseData;

var localStorage;

var hostAccentTiles = [];
var guestAccentTiles = [];

var hostEmail;
var guestEmail;

var BRAND_NEW = "Brand New";
var WAITING_FOR_ENDPOINT = "Waiting for endpoint";
var READY_FOR_BONUS = "READY_FOR_BONUS";
var WAITING_FOR_BONUS_ENDPOINT = "WAITING_FOR_BONUS_ENDPOINT";
var WAITING_FOR_BOAT_BONUS_POINT = "WAITING_FOR_BOAT_BONUS_POINT";

var HOST_SELECT_ACCENTS = "HOST_SELECT_ACCENTS";

window.requestAnimationFrame(function () {
	localStorage = new LocalStorage().storage;

	url = window.location.href.split('?')[0];

	theGame = new GameManager();

	gameNotation = new GameNotation();
	gameNotation.setNotationText(QueryString.game);

	hostEmail = QueryString.host;
	guestEmail = QueryString.guest;

	refreshNotationDisplay();

	notationBuilder = new NotationBuilder();

	rerunAll();

	var localUserEmail = localStorage.getItem(localEmailKey);

	if (localUserEmail) {
		if (getCurrentPlayer() === HOST && !QueryString.host) {
			hostEmail = localUserEmail;
		} else if (getCurrentPlayer() === GUEST && !QueryString.guest) {
			guestEmail = localUserEmail;
		}
	}

	updateFooter();
});

function promptEmail() {
	var ans = prompt("Please enter your email address:");

	if (getCurrentPlayer() === HOST && !QueryString.host) {
		if (ans) {
			hostEmail = ans;
			localStorage.setItem(localEmailKey, hostEmail);
		}
	} else if (getCurrentPlayer() === GUEST && !QueryString.guest) {
		if (ans) {
			guestEmail = ans;
			localStorage.setItem(localEmailKey, guestEmail);
		}
	}

	updateFooter();
}

function updateFooter() {
	var userEmail = localStorage.getItem(localEmailKey);
	if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
		document.querySelector(".footer").innerHTML = "You are playing as " + userEmail
		+ ". Click <span class='skipBonus' onclick='promptEmail()'>here</span> to edit email."
	}
}

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
	} else if (gameNotation.moves.length === 2) {
		msg += "Plant a Basic Flower Tile.";
	}

	if (theGame.board.winners.length > 0) {
		// There is a winner!
		if (theGame.board.winners.length > 1) {
			// There are two winners???
		} else {
			msg += "<strong>" + theGame.board.winners[0] + " has created a Harmony Ring and won the game!</strong>";
		}
	}
	return msg;
}

function refreshMessage() {
	document.querySelector(".gameMessage").innerHTML = "Current Player: " + getCurrentPlayer() + getAdditionalMessage();
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

	var linkUrl = url + "?";
	if (hostEmail) {
		linkUrl += "host=" + hostEmail + "&";
	}
	if (guestEmail) {
		linkUrl += "guest=" + guestEmail + "&";
	}
	linkUrl += "game=" + gameNotation.notationTextForUrl();

	if (!url.startsWith("file")) {
		getShortUrl(linkUrl, linkShortenCallback);
	} else {
		linkShortenCallback(encodeURI(linkUrl).replace(/\(/g, "%28").replace(/\)/g, "%29"));
	}
}

function showSubmitMoveForm(url) {
	// From current player
	var fromEmail = getCurrentPlayerEmail();

	// To other player
	var toEmail = getOpponentPlayerEmail();

	var bodyMessage = getEmailBody(url);

	$('#fromEmail').attr("value", fromEmail);
	$('#toEmail').attr("value", toEmail);
	$('#message').attr("value", bodyMessage);
	$('#contactform').removeClass('gone');
}

function linkShortenCallback(shortUrl) {
	var messageText = "Copy this <a href=\"" + shortUrl + "\">link</a> and send to the " + getCurrentPlayer();

	if (haveBothEmails()) {
		// messageText = "Click <span class='skipBonus' onclick=sendMail('" + shortUrl + "')>here</span> to email your move to the " + getCurrentPlayer() + ". Or, share this <a href=\"" + shortUrl + "\">link</a> with them.";
		messageText = "Or, copy and share this <a href=\"" + shortUrl + "\">link</a> with your opponent.";
		showSubmitMoveForm(shortUrl);
	}

	if (theGame.board.winners.length > 0) {
		// There is a winner!
		if (theGame.board.winners.length > 1) {
			// There are two winners???
		} else {
			messageText += "<strong>" + theGame.board.winners[0] + " has created a Harmony Ring and won the game!</strong>";
		}
	}

	document.querySelector(".gameMessage").innerHTML = messageText;
}

function haveBothEmails() {
	return hostEmail && guestEmail;
}

function getCurrentPlayerEmail() {
	var address;
	if (getCurrentPlayer() === HOST) {
		address = hostEmail;
	} else if (getCurrentPlayer() === GUEST) {
		address = guestEmail;
	}
	return address;
}

function getOpponentPlayerEmail() {
	var address;
	if (getCurrentPlayer() === HOST) {
		address = guestEmail;
	} else if (getCurrentPlayer() === GUEST) {
		address = hostEmail;
	}
	return address;
}

function getEmailBody(url) {
	return "It is your move in Skud Pai Sho! Click here to open our game: " + url;
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

function myTurn() {
	var userEmail = localStorage.getItem(localEmailKey);
	if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
		if (getCurrentPlayer() === HOST) {
			return localStorage.getItem(localEmailKey) === hostEmail;
		} else {
			return localStorage.getItem(localEmailKey) === guestEmail;
		}
	} else {
		return true;
	}
}

function unplayedTileClicked(tileDiv) {
	if (theGame.board.winners.length > 0) {
		return;
	}
	if (!myTurn()) {
		return;
	}
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

		if (tile.type !== ACCENT_TILE) {
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
	if (theGame.board.winners.length > 0) {
		return;
	}
	if (!myTurn()) {
		return;
	}
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
				rerunAll();
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


// This is from http://stackoverflow.com/questions/1771397/jquery-on-the-fly-url-shortener 
function getShortUrl(url, callback) {
	var accessToken = 'ebedc9186c2eecb1a28b3d6aca8a3ceacb6ece63';
	var url = 'https://api-ssl.bitly.com/v3/shorten?access_token=' + accessToken + '&longUrl=' + encodeURIComponent(url);

	$.getJSON(
		url,
		{},
		function(response)
		{
			if(callback)
				callback(response.data.url);
		}
		);
}







