// Pai Sho Main

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);

  if (query.length > 0 && !(query.includes("game=") || query.includes("vagabond"))) {
  	// Decompress first
  	// debug("Decompressing: " + query);
  	query = LZString.decompressFromEncodedURIComponent(query);
  	// debug("Result: " + query);
  }

  var vars = query.split("&");
  if (query.includes("&amp;")) {
  	vars = query.split("&amp;");
  }
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
var defaultHelpMessageText;
var defaultEmailMessageText;

var localStorage;

var hostEmail;
var guestEmail;

var BRAND_NEW = "Brand New";
var WAITING_FOR_ENDPOINT = "Waiting for endpoint";
// var READY_FOR_BONUS = "READY_FOR_BONUS";
// var WAITING_FOR_BONUS_ENDPOINT = "WAITING_FOR_BONUS_ENDPOINT";
// var WAITING_FOR_BOAT_BONUS_POINT = "WAITING_FOR_BOAT_BONUS_POINT";

// var HOST_SELECT_ACCENTS = "HOST_SELECT_ACCENTS";

var localPlayerRole = HOST;

// var aiList = [new SkudAIv1()];
var aiList = [];
var activeAi;

window.requestAnimationFrame(function () {
	localStorage = new LocalStorage().storage;

	url = window.location.href.split('?')[0];

	theGame = new GameManager();

	debug("VAGABOND");

	gameNotation = new GameNotation();
	gameNotation.setNotationText(QueryString.game);

	hostEmail = QueryString.host;
	guestEmail = QueryString.guest;

	if (QueryString.replay === "true") {
		document.getElementById("replayControls").classList.remove("gone");
	}

	refreshNotationDisplay();

	notationBuilder = new NotationBuilder();

	rerunAll();

	defaultEmailMessageText = document.querySelector(".footer").innerHTML;

	var localUserEmail = localStorage.getItem(localEmailKey);

	localPlayerRole = getCurrentPlayer();

	if (localUserEmail) {
		if (localPlayerRole === HOST && !QueryString.host) {
			hostEmail = localUserEmail;
		} else if (localPlayerRole === GUEST && !QueryString.guest) {
			guestEmail = localUserEmail;
		}
	} else {
		if (localPlayerRole === HOST) {
			hostEmail = null;
		} else if (localPlayerRole === GUEST) {
			guestEmail = null;
		}
	}

	updateFooter();

	defaultHelpMessageText = document.querySelector(".helpText").innerHTML;

	clearMessage();
});

function promptEmail() {
	var ans = prompt("Please enter your email address:");

	if (localPlayerRole === HOST) {
		if (ans) {
			hostEmail = ans;
			localStorage.setItem(localEmailKey, hostEmail);
		}
	} else if (localPlayerRole === GUEST) {
		if (ans) {
			guestEmail = ans;
			localStorage.setItem(localEmailKey, guestEmail);
		}
	}

	updateFooter();
	clearMessage();
}

function updateFooter() {
	var userEmail = localStorage.getItem(localEmailKey);
	if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
		document.querySelector(".footer").innerHTML = gamePlayersMessage() + "You are playing as " + userEmail
		+ " | <span class='skipBonus' onclick='promptEmail();'>Edit email</span> | <span class='skipBonus' onclick='forgetEmail();'>Forget email</span>"
	} else {
		document.querySelector(".footer").innerHTML = gamePlayersMessage() + defaultEmailMessageText;
	}
}

function gamePlayersMessage() {
	if (!hostEmail && !guestEmail) {
		return "";
	}
	var msg = "";
	if (hostEmail) {
		msg += "HOST: " + hostEmail + "<br />";
	}
	if (guestEmail) {
		msg += "GUEST: " + guestEmail + "<br />";
	}
	msg += "<br />";
	return msg;
}

function forgetEmail() {
	var ok = confirm("Forgetting your email will disable email notifications. Are you sure?");
	if (!ok) {
		updateFooter();
		return;
	}

	if (localPlayerRole === HOST) {
		hostEmail = null;
	} else if (localPlayerRole === GUEST) {
		guestEmail = null;
	}

	localStorage.removeItem(localEmailKey);

	updateFooter();
	clearMessage();
}

function inputNow() {
	gameNotation.addNotationLine(document.getElementById("notationInput").value);

	refreshNotationDisplay();
}

function refreshNotationDisplay() {
	document.getElementById("notationText").innerHTML = gameNotation.getNotationHtml();
}

var currentMoveIndex = 0;

function rewindAllMoves() {
	pauseRun();
	theGame = new GameManager();
	notationBuilder = new NotationBuilder();
	currentMoveIndex = 0;
	refreshMessage();
}

function playNextMove(withActuate) {
	if (currentMoveIndex >= gameNotation.moves.length) {
		// no more moves to run
		refreshMessage();
		return false;
	} else {
		theGame.runNotationMove(gameNotation.moves[currentMoveIndex], withActuate);
		currentMoveIndex++;
		return true;
	}
}

function playPrevMove() {
	pauseRun();

	var moveToPlayTo = currentMoveIndex - 1;

	theGame = new GameManager();

	notationBuilder = new NotationBuilder();

	currentMoveIndex = 0;

	while (currentMoveIndex < moveToPlayTo) {
		playNextMove(true);
	}

	refreshMessage();
}

function playAllMoves() {
	pauseRun();
	while (playNextMove(false)) {
		// Nothing!
	}
	theGame.actuate();
}

var interval = 0;

function playPause() {
	if (gameNotation.moves.length === 0) {
		return;
	}
	if (interval === 0) {
		// Play
		document.querySelector(".playPauseButton").value = "||";
		if (playNextMove(true)) {
			interval = setInterval(function() {
				if (!playNextMove(true)) {
					pauseRun();
				}
			}, 1200);//1200);
} else {
			// All done.. restart!
			rewindAllMoves();
			playPause();
		}
	} else {
		pauseRun();
	}
}

function pauseRun() {
	clearInterval(interval);
	interval = 0;
	document.querySelector(".playPauseButton").value = ">";
}

function getAdditionalMessage() {
	var msg = "<br />";

	if (theGame.board.winners.length > 0) {
		// There is a winner!
		if (theGame.board.winners.length > 1) {
			// More than one winner?
			msg += "<br /><strong>Both players have won? It's a tie!?</strong>";
		} else {
			msg += "<br /><strong>" + theGame.board.winners[0] + " has captured the White Lotus and won the game!</strong>";
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

function finalizeMove(ignoreNoEmail) {
	rerunAll();

	// var linkUrl = url + "?";
	var linkUrl = "";
	if (hostEmail) {
		linkUrl += "host=" + hostEmail + "&";
	}
	if (guestEmail) {
		linkUrl += "guest=" + guestEmail + "&";
	}
	linkUrl += "game=" + gameNotation.notationTextForUrl();

	linkUrl += "&replay=true";

	// debug("Compressing: " + linkUrl);
	linkUrl = LZString.compressToEncodedURIComponent(linkUrl);

	linkUrl = url + "?" + linkUrl;

	if (theGame.board.winners.length > 0) {
		// Call short url because game is over
		if (!url.startsWith("file")) {
			getShortUrl(linkUrl);
		}
	}

	debug("move finalized");

	// debug("End result: " + linkUrl);

	// if (!url.startsWith("file") && !haveBothEmails()) {
	// 	getShortUrl(linkUrl, linkShortenCallback);
	// } else {
	// 	linkShortenCallback(linkUrl);//.replace(/\(/g, "%28").replace(/\)/g, "%29"));
	// }
	linkShortenCallback(linkUrl, ignoreNoEmail);
}

function showSubmitMoveForm(url) {
	// Move has completed, so need to send to "current player"
	// TODO change this to getLocalUserEmail and always send from that.
	var toEmail = getCurrentPlayerEmail();
	var fromEmail = getUserEmail();

	var bodyMessage = getEmailBody(url);

	$('#fromEmail').attr("value", fromEmail);
	$('#toEmail').attr("value", toEmail);
	$('#message').attr("value", bodyMessage);
	$('#contactform').removeClass('gone');
}

function getNoUserEmailMessage() {
	return "Recommended: <span class='skipBonus' onclick='promptEmail(); finalizeMove();'>Enter your email address</span> to be notified when it is your turn. <br /><em><span class='skipBonus' onclick='finalizeMove(true);'>Click to ignore</span></em><br /><br />";
}

function linkShortenCallback(shortUrl, ignoreNoEmail) {
	debug(shortUrl);

	var messageText = "";

	if (currentMoveIndex == 1) {
		messageText += "Thank you for Hosting a game of Pai Sho! Share <a href=\"" + shortUrl + "\">this link</a> with your friends to invite them to join you in a game."
		if (aiList.length > 0) {
			for (var i = 0; i < aiList.length; i++) {
				messageText += "<br /><span class='skipBonus' onclick='setAiIndex(" + i + ");'>Play " + aiList[i].getName() + "</span>";
			}
		}
	} else if (haveBothEmails()) {
		// messageText = "Click <span class='skipBonus' onclick=sendMail('" + shortUrl + "')>here</span> to email your move to the " + getCurrentPlayer() + ". Or, share this <a href=\"" + shortUrl + "\">link</a> with them.";
		messageText += "Or, copy and share this <a href=\"" + shortUrl + "\">link</a> with your opponent.";
		showSubmitMoveForm(shortUrl);
	} else if (activeAi && getCurrentPlayer() === activeAi.player) {
		messageText += "<span class='skipBonus' onclick='playAiTurn();'>Submit move to AI</span>";
	} else {
		messageText += "Copy this <a href=\"" + shortUrl + "\">link</a> and send to the " + getCurrentPlayer() + ".";
	}

	if (!ignoreNoEmail && !haveUserEmail()) {
		messageText = getNoUserEmailMessage();
	}

	if (theGame.board.winners.length > 0) {
		// There is a winner!
		if (theGame.board.winners.length > 1) {
			// There are two winners???
			messageText += "<br /><strong>Both players have won? It's a tie!?</strong>";
		} else {
			messageText += "<br /><strong>" + theGame.board.winners[0] + " has captured the White Lotus and won the game!</strong>";
		}
	} else {
		messageText += getResetMoveText();
	}

	document.querySelector(".gameMessage").innerHTML = messageText;

	// QUICK!
	if (activeAi && getCurrentPlayer() === activeAi.player) {
		// setTimeout(function() { playAiTurn(); }, 100);	// Didn't work?
		playAiTurn();
	}
}

function haveBothEmails() {
	return hostEmail && guestEmail && haveUserEmail();
}

function haveUserEmail() {
	if (localStorage.getItem(localEmailKey)) {
		return true;
	}
	return false;
}

function getUserEmail() {
	return localStorage.getItem(localEmailKey);
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
	// return "I just made a move in Vagabond Pai Sho! Click here to open our game: " + url;

	return "I just made move #" + gameNotation.getLastMoveNumber() + " in Vagabond Pai Sho! Click here to open our game: " + url
		+ "[BR][BR]---- Full Details: ----[BR]Move: " + gameNotation.getLastMoveText() 
		+ "[BR][BR]Game Notation: [BR]" + gameNotation.getNotationForEmail();
}

function getCurrentPlayer() {
	if (gameNotation.moves.length % 2 === 0) {
		return HOST;
	} else {
		return GUEST;
	}
}

function getResetMoveText() {
	return "<br /><br /><span class='skipBonus' onclick='resetMove();'>Undo move</span>";
}

function showResetMoveMessage() {
	document.querySelector(".gameMessage").innerHTML += getResetMoveText();
}

function resetMove() {
	if (notationBuilder.status === BRAND_NEW) {
		// Remove last move
		gameNotation.removeLastMove();
	} else if (notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}

	rerunAll();
	$('#contactform').addClass('gone');
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
	if (theGame.board.winners.length > 0 && notationBuilder.status !== READY_FOR_BONUS) {
		return;
	}
	if (!myTurn()) {
		return;
	}
	if (currentMoveIndex !== gameNotation.moves.length) {
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

	var tile = theGame.tileManager.peekTile(player, tileCode, tileId);

	if (tile.ownerName !== getCurrentPlayer()) {
		// debug("That's not your tile!");
		return;
	}

	if (notationBuilder.status === BRAND_NEW) {
		// new Deploy turn
		tile.selectedFromPile = true;

		notationBuilder.moveType = DEPLOY;
		notationBuilder.tileType = tileCode;
		notationBuilder.status = WAITING_FOR_ENDPOINT;

		theGame.revealDeployPoints(getCurrentPlayer(), tileCode);
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

			if (!boardPoint.tile.canMove()) {
				return;
			}

			notationBuilder.status = WAITING_FOR_ENDPOINT;
			notationBuilder.moveType = MOVE;
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
			theGame.runNotationMove(move);

			// Move all set. Add it to the notation!
			gameNotation.addMove(move);
			finalizeMove();
		} else {
			theGame.hidePossibleMovePoints();
			notationBuilder = new NotationBuilder();
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
		function(response) {
			debug(response.data.url);
			if(callback)
				callback(response.data.url);
		});
}

function clearMessage() {
	if (!defaultHelpMessageText) {
		defaultHelpMessageText = "<h4>Vagabond Pai Sho</h4> <p> <p>Vagabond Pai Sho is the Pai Sho variant seen in the fanfiction story <a href='https://www.fanfiction.net/s/7849861/1/Gambler-and-Vagabond'>Gambler and Vagabond</a>.</p> <p><strong>You win</strong> if you capture your opponent's White Lotus tile.</p> <p><strong>On a turn</strong>, you may either deploy a tile or move a tile.</p> <p><strong>You can't capture Flower tiles</strong> until your White Lotus has been deployed.<br /> <strong>You can't capture Non-Flower tiles</strong> until both players' White Lotus tiles have been deployed.</p> <p><strong>Hover</strong> over any tile to see how it works.<br /> <strong>Make a move</strong> and send the generated link to your opponents!</p> </p> <p>Select tiles to learn more or <a href='https://skudpaisho.wordpress.com/vagabond-pai-sho/' target='_blank'>view the rules</a>.</p>";
	}
	document.querySelector(".helpText").innerHTML = defaultHelpMessageText;
	if (!haveUserEmail()) {
		document.querySelector(".helpText").innerHTML += "<p>If you <span class='skipBonus' onclick='promptEmail()'>enter your email address</span>, you can be notified when your opponent plays a move.</p>";
	}
}

function haveUserEmail() {
	var userEmail = localStorage.getItem(localEmailKey);
	return (userEmail && userEmail.includes("@") && userEmail.includes("."));
}

function showTileMessage(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new Tile(divName.substring(1), divName.charAt(0));

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	showTheMessage(tile, ownerName);
}

function showTheMessage(tile, ownerName) {
	var message = [];

	var tileCode = tile.code;

	var heading = Tile.getTileName(tileCode);

	if (tileCode === 'L') {
		heading = "White Lotus";
		message.push("Flower Tile");
		message.push("Can move 1 space");
	} else if (tileCode === 'S') {
		heading = "Sky Bison";
		message.push("Deployed on the point inside of the small red triangles in the corners of the board");
		message.push("Can move up to six spaces, turning any number of times");
		message.push("Cannot move if a Chrysanthemum tile is adjacent to it");
		message.push("Can capture other tiles");
		message.push("A Sky Bison has a territorial zone the size of the area the tile can move within. No other Sky Bison is allowed in this zone once the Sky Bison has moved out of its starting position.");
	} else if (tileCode === 'B') {
		heading = "Badgermole";
		message.push("Can move only one space in any direction OR move directly adjacent to a Flower Tile if that Flower Tile is in the Badgermole's \"line of sight\" (meaning, the tiles lie on the same line with no other tiles in between)");
		message.push("Flower Tiles adjacent to a Badgermole are protected from capture");
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

	if (message.length > 1) {
		setMessage(toHeading(heading) + toBullets(message));
	} else {
		setMessage(toHeading(heading) + toMessage(message));
	}
}

function showPointMessage(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = theGame.board.cells[rowCol.row][rowCol.col];

	if (boardPoint.hasTile()) {
		showTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
	}
}

function setMessage(msg) {
	if (msg === document.querySelector(".helpText").innerHTML) {
		clearMessage();
	} else {
		document.querySelector(".helpText").innerHTML = msg;
	}
}

function toHeading(str) {
	return "<h4>" + str + "</h4>";
}

function toMessage(paragraphs) {
	var message = "";

	paragraphs.forEach(function(str) {
		message += "<p>" + str + "</p>";
	});

	return message;
}

function toBullets(paragraphs) {
	var message = "<ul>";

	paragraphs.forEach(function(str) {
		message += "<li>" + str + "</li>";
	});

	message += "</ul>";

	return message;
}

function getNeutralPointMessage() {
	var msg = "<h4>Neutral Point</h4>";
	msg += "<ul>";
	msg += "<li>This point is Neutral, so any tile can land here.</li>";
	msg += "<li>If a tile that is on a point touches a Neutral area of the board, that point is considered Neutral.</li>";
	msg += "</ul>";
	return msg;
}

function getRedPointMessage() {
	var msg = "<h4>Red Point</h4>";
	msg += "<p>This point is Red, so Basic White Flower Tiles are not allowed to land here.</p>";
	return msg;
}

function getWhitePointMessage() {
	var msg = "<h4>White Point</h4>";
	msg += "<p>This point is White, so Basic Red Flower Tiles are not allowed to land here.</p>";
	return msg;
}

function getRedWhitePointMessage() {
	var msg = "<h4>Red/White Point</h4>";
	msg += "<p>This point is both Red and White, so any tile is allowed to land here.</p>";
	return msg;
}

function getGatePointMessage() {
	var msg = "<h4>Gate</h4>";
	msg += '<p>This point is a Gate. When Flower Tiles are played, they are <em>Planted</em> in an open Gate.</p>';
	msg += '<p>Tiles in a Gate are considered <em>Growing</em>, and when they have moved out of the Gate, they are considered <em>Blooming</em>.</p>';
	return msg;
}


function getLink() {
	var notation = new GameNotation();
	for (var i = 0; i < currentMoveIndex; i++) {
		notation.addMove(gameNotation.moves[i]);
	}

	var linkUrl = "";
	// if (hostEmail) {
	// 	linkUrl += "host=" + hostEmail + "&";
	// }
	// if (guestEmail) {
	// 	linkUrl += "guest=" + guestEmail + "&";
	// }
	linkUrl += "game=" + notation.notationTextForUrl();

	linkUrl += "&replay=true";

	linkUrl = LZString.compressToEncodedURIComponent(linkUrl);

	linkUrl = url + "?" + linkUrl;

	if (theGame.board.winners.length > 0) {
		// Call short url because game is over
		if (!url.startsWith("file")) {
			getShortUrl(linkUrl);
		}
	}

	console.log(linkUrl);

	return linkUrl;
}

function setAiIndex(i) {
	QueryString.replay = "true";
	if (QueryString.replay === "true") {
		document.getElementById("replayControls").classList.remove("gone");
	}
	activeAi = aiList[i];
	activeAi.setPlayer(getCurrentPlayer());
	playAiTurn();
	if (gameNotation.getPlayerMoveNum() === 1) {
		playAiTurn();
	}
	if (gameNotation.getPlayerMoveNum() === 1) {
		// Host auto-copies Guest's first Plant
		var hostMoveBuilder = notationBuilder.getFirstMoveForHost(gameNotation.moves[gameNotation.moves.length - 1].plantedFlowerType);
		gameNotation.addMove(gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
		finalizeMove();
	}
	if (gameNotation.getPlayerMoveNum() === 2 && getCurrentPlayer() === GUEST) {
		playAiTurn();
	}
}

// function playAiTurn() {
// 	if (theGame.board.winners.length > 0) {
// 		return;
// 	}

// 	var playerMoveNum = gameNotation.getPlayerMoveNum();

// 	if (playerMoveNum === 1 && getCurrentPlayer() === HOST) {
// 		// Auto mirror guest move
// 		// Host auto-copies Guest's first Plant
// 		var hostMoveBuilder = notationBuilder.getFirstMoveForHost(gameNotation.moves[gameNotation.moves.length - 1].plantedFlowerType);
// 		gameNotation.addMove(gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
// 		finalizeMove();
// 		return;
// 	}

// 	var move = activeAi.getMove(theGame.getCopy(), playerMoveNum);
// 	if (!move) {
// 		debug("No move given...");
// 		return;
// 	}
// 	gameNotation.addMove(move);
// 	finalizeMove();
// }


function sandboxFromMove() {
	var link = getLink();
	window.open(link);
}






