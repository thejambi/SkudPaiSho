// Pai Sho Main

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);

  if (query.length > 0 && !(query.includes("game=") || query.includes("canon=") 
  	|| query.includes("onlinePlayGame") 
  	|| query.includes("simplest=") 
  	|| query.includes("lessBonus=") 
  	|| query.includes("superHarmonies=") 
  	|| query.includes("completeHarmony=") 
  	|| query.includes("boatOnlyMoves=") 
  	|| query.includes("superRocks=") 
  	|| query.includes("sameStart=") 
  	|| query.includes("tournamentHost=") 
  	|| query.includes("tournamentName=") 
  	|| query.includes("tournamentMatchNotes=") 
  	|| query.includes("oneGrowingFlower=") 
  	|| query.includes("limitedGatesRule=") 
  	|| query.includes("rocksUnwheelable="))) {
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
tileDesignTypeKey = "tileDesignTypeKey";

var url;

var theGame;
var gameNotation;
var notationBuilder;
var beginPhaseData;
var defaultHelpMessageText;
var defaultEmailMessageText;

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

var localPlayerRole = HOST;

var vagabond = false;

var aiList = [new SkudAIv1()];
// var aiList = [new SkudAIv1(), new SkudAIv1()];
// var aiList = [];
var activeAi;
var activeAi2;
var sandboxUrl;
var metadata = new Object();

var onlinePlayEngine;
var gameId = -1;
var lastSubmittedGameNotation = "";

window.requestAnimationFrame(function () {
	localStorage = new LocalStorage().storage;

	if (!localStorage.getItem(tileDesignTypeKey)) {
		useHLoweTiles = true;
	} else if (localStorage.getItem(tileDesignTypeKey) === "hlowe") {
		useHLoweTiles = true;
	} else {
		useHLoweTiles = false;
	}

	url = window.location.href.split('?')[0];
	sandboxUrl = url;

	if (url.includes("calebhugo.com")) {
		url = "http://skudpaisho.com/";
	}

	theGame = new GameManager();

	if (QueryString.vagabond) {
		debug("VAGABOND");
		vagabond = true;
	}

	if (QueryString.nkr) {
		newKnotweedRules = true;
	}

	if (QueryString.canon) {
		simpleCanonRules = true;
		debug("Simple Canon rules");
	}

	if (QueryString.newSpecialFlowerRules === 'n') {
		newSpecialFlowerRules = false;
		debug("-- Old Special Flower Rules in effect --");
	} else if (QueryString.newSpecialFlowerRules) {
		newSpecialFlowerRules = true;
		debug("-- New Special Flower Rules in effect --");
	}

	if (QueryString.newGatesRule === 'n') {
		newGatesRule = false;
		debug("-- New Gates Rule is disabled --");
	} else if (QueryString.newGatesRule) {
		newGatesRule = true;
		debug("-- New Gates Rule in effect --");
	}

	if (QueryString.newOrchidVulnerableRule === 'y') {
		newOrchidVulnerableRule = true;
		debug("-- New Orchid Vulnerable rule in effect --");
	}

	if (QueryString.newOrchidClashRule === 'y') {
		newOrchidClashRule = true;
		debug("-- New Orchid Clash rule in effect --");
	}

	if (QueryString.newOrchidCaptureRule === 'y') {
		newOrchidCaptureRule = true;
		debug("-- New Orchid Capture rule in effect --");
	}

	if (QueryString.simpleSpecialFlowerRule === 'y') {
		simpleSpecialFlowerRule = true;
		debug("-- Simplest Special Flower Rule in effect --");
	}

	if (QueryString.rocksUnwheelable === 'y') {
		rocksUnwheelable = true;
		debug("-- Rocks Unwheelable rule in effect --");
	}

	oneGrowingFlower = QueryString.oneGrowingFlower === 'y';
	
	if (QueryString.limitedGatesRule === 'y') {
		limitedGatesRule = true;
	} else if (QueryString.limitedGatesRule === 'n') {
		limitedGatesRule = false;
	}

	if (QueryString.simpleRocks === 'y') {
		simpleRocks = true;
		debug("-- Simple Rocks rule in effect --");
	}

	if (QueryString.specialFlowerBonusRule === 'y') {
		specialFlowerBonusRule = true;
		debug("-- Special Flower Bonus Rule rule in effect --");
	}

	if (QueryString.simplest === 'y') {
		simplest = true;
		debug("-- 'Simplest' rules in effect --");
	}

	if (QueryString.lessBonus === 'y') {
		lessBonus = true;
	}
	if (QueryString.superHarmonies === 'y') {
		superHarmonies = true;
	}
	if (QueryString.completeHarmony === 'y') {
		completeHarmony = true;
	}

	if (QueryString.boatOnlyMoves === 'y') {
		boatOnlyMoves = true;
	}
	if (QueryString.superRocks === 'y') {
		superRocks = true;
	}
	if (QueryString.sameStart === 'y') {
		sameStart = true;
	}

	// Load metadata
	metadata.startDate = QueryString.sDate;
	metadata.endDate = QueryString.eDate;
	metadata.tournamentName = QueryString.tournamentName;
	metadata.tournamentHost = QueryString.tournamentHost;
	metadata.tournamentMatchNotes = QueryString.tournamentMatchNotes;
	// --- //

	gameNotation = new GameNotation();
	gameNotation.setNotationText(QueryString.game);

	hostEmail = QueryString.host;
	guestEmail = QueryString.guest;

	//if (QueryString.replay === "true") {
	if (gameNotation.moves.length > 1) {
		document.getElementById("replayControls").classList.remove("gone");
	}

	onlinePlayEngine = new OnlinePlayEngine();

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

		if (QueryString.onlinePlayGame === 'y') {
			onlinePlayEnabled = true;
			if (QueryString.gameId >= 0) {
				gameId = QueryString.gameId;
				debug("Game ID: " + gameId);
			}
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

	if (onlinePlayEnabled) {
		// Turn on replay controls... TODO fix when this happens.
		// document.getElementById("replayControls").classList.remove("gone");

		onlinePlayEngine.testOnlinePlay();
		if (gameId >= 0) {
			// if (QueryString.game) {
			// 	lastSubmittedGameNotation = gameNotation.notationTextForUrl();
			// }
			startWatchingGameRealTime();
		}
	}
});

var getGameNotationCallback = function(newGameNotation) {
	// if (lastSubmittedGameNotation === "") {
	// 	lastSubmittedGameNotation = newGameNotation;
	// }
	// if different, set new notation and rerunAll
	if (newGameNotation !== lastSubmittedGameNotation) {
		gameNotation.setNotationText(newGameNotation);
		rerunAll();
	} else {
		// debug("GAME NOTATION THE SAME");
	}

	if (myTurnForReal()) {
		clearInterval(gameWatchIntervalValue);
		debug("Current player turn, so not watching game...");
		return;
	}
};

var gameWatchIntervalValue;

function startWatchingGameRealTime() {
	debug("Starting to watch game");
	gameWatchIntervalValue = setInterval(function() {
		onlinePlayEngine.getGameNotation(gameId, getGameNotationCallback);
	}, 1000);
}

function setUseHLoweTiles() {
	localStorage.setItem(tileDesignTypeKey, "hlowe");
	useHLoweTiles = true;
	theGame.actuate();
}

function setUseStandardTiles() {
	localStorage.setItem(tileDesignTypeKey, "standard");
	useHLoweTiles = false;
	theGame.actuate();
}

function toggleTileDesigns() {
	if (useHLoweTiles) {
		setUseStandardTiles();
	} else {
		setUseHLoweTiles();
	}
}

function promptEmail() {
	// Just call loginClicked method to open modal dialog
	loginClicked();
	
	// var ans = prompt("Please enter your email address:");

	// if (ans) {
	// 	ans = ans.trim();
	// }

	// if (localPlayerRole === HOST) {
	// 	if (ans) {
	// 		hostEmail = ans;
	// 		localStorage.setItem(localEmailKey, hostEmail);
	// 	}
	// } else if (localPlayerRole === GUEST) {
	// 	if (ans) {
	// 		guestEmail = ans;
	// 		localStorage.setItem(localEmailKey, guestEmail);
	// 	}
	// }

	// updateFooter();
	// clearMessage();
}

function updateFooter() {
	var userEmail = localStorage.getItem(localEmailKey);
	if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
		document.querySelector(".footer").innerHTML = gamePlayersMessage() + "You are playing as " + userEmail
		+ " | <span class='skipBonus' onclick='promptEmail();'>Edit email</span> | <span class='skipBonus' onclick='forgetEmail();'>Forget email</span>";
		if (userEmail === "skudpaisho@gmail.com") {
			document.querySelector(".footer").innerHTML += "<br /><span class='skipBonus' onclick='getPublicTournamentLink();'>GetLink</span>";
		}
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
var replayIntervalLength = 800;

function playPause() {
	if (gameNotation.moves.length === 0) {
		return;
	}
	if (interval === 0) {
		// Play
		document.querySelector(".playPauseButton").innerHTML = "<i class='fa fa-pause' aria-hidden='true'></i>";
		if (playNextMove(true)) {
			interval = setInterval(function() {
				if (!playNextMove(true)) {
					pauseRun();
				}
			}, replayIntervalLength);//800);
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
	document.querySelector(".playPauseButton").innerHTML = "<i class='fa fa-play' aria-hidden='true'></i>";
}

function getAdditionalMessage() {
	var msg = "<br />";

	// Is it the player's turn?
	if (myTurn()) {
		msg = " (You)" + msg;
	}

	if (gameNotation.moves.length === 0) {
		msg += "Select 4 Accent Tiles to play with.";
	} else if (gameNotation.moves.length === 1) {
		msg += "Select 4 Accent Tiles to play with, then Plant a Basic Flower Tile.";
	} else if (gameNotation.moves.length === 2) {
		msg += "Plant a Basic Flower Tile.";
	} else if (gameNotation.moves.length === 4) {
		msg += "Now, make the first move of the game.";
	}

	//if (theGame.board.winners.length > 0) {
	if (theGame.getWinner()) {
		// There is a winner!
		// if (theGame.board.winners.length > 1) {
		// 	// More than one winner?
		// 	msg += "<br /><strong>Both players have created Harmony Rings! It's a tie!</strong>";
		// } else {
		// 	msg += "<br /><strong>" + theGame.board.winners[0] + " has created a Harmony Ring and won the game!</strong>";
		// }
		msg += "<br /><strong>" + theGame.getWinner() + theGame.getWinReason() + "</strong>";
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

	// linkUrl += "&replay=true";	// No longer needed

	if (newSpecialFlowerRules) {
		linkUrl += "&newSpecialFlowerRules=y";
	} else {
		linkUrl += "&newSpecialFlowerRules=n";
	}

	if (newGatesRule) {
		linkUrl += "&newGatesRule=y";
	} else {
		linkUrl += "&newGatesRule=n";
	}

	if (simpleCanonRules) {
		linkUrl += "&canon=y";
	}

	if (newOrchidVulnerableRule) {
		linkUrl += "&newOrchidVulnerableRule=y";
	} //else {
	// 	linkUrl += "&newOrchidVulnerableRule=n";
	// }

	if (newOrchidCaptureRule) {
		linkUrl += "&newOrchidCaptureRule=y";
	} //else {
	// 	linkUrl += "&newOrchidCaptureRule=n";
	// }

	if (newOrchidClashRule) {
		linkUrl += "&newOrchidClashRule=y";
	} //else {
	// 	linkUrl += "&newOrchidClashRule=n";
	// }

	if (simpleSpecialFlowerRule) {
		linkUrl += "&simpleSpecialFlowerRule=y";
	} //else {
	// 	linkUrl += "&simpleSpecialFlowerRule=n";
	// }

	if (rocksUnwheelable) {
		linkUrl += "&rocksUnwheelable=y";
	} //else {
	// 	linkUrl += "&rocksUnwheelable=n";
	// }

	if (limitedGatesRule) {
		linkUrl += "&limitedGatesRule=y";
	} else {
		linkUrl += "&limitedGatesRule=n";
	}

	if (simpleRocks) {
		linkUrl += "&simpleRocks=y";
	}

	if (simplest) {
		linkUrl += "&simplest=y";
	}

	if (specialFlowerBonusRule) {
		linkUrl += "&specialFlowerBonusRule=y";
	} //else {
	// 	linkUrl += "&specialFlowerBonusRule=n";
	// }

	if (lessBonus) {
		linkUrl += "&lessBonus=y";
	}
	if (superHarmonies) {
		linkUrl += "&superHarmonies=y";
	}
	if (completeHarmony) {
		linkUrl += "&completeHarmony=y";
	}
	
	if (boatOnlyMoves) {
		linkUrl += "&boatOnlyMoves=y";
	}
	if (superRocks) {
		linkUrl += "&superRocks=y";
	}
	if (sameStart) {
		linkUrl += "&sameStart=y";
	}


	// Add start date
	if (!metadata.startDate) {
		metadata.startDate = getDateString();
	}
	linkUrl += "&sDate=" + metadata.startDate;

	// Add tournament info
	if (metadata.tournamentName && metadata.tournamentHost) {
		linkUrl += "&tournamentName=" + metadata.tournamentName;
		linkUrl += "&tournamentHost=" + metadata.tournamentHost;
		linkUrl += "&tournamentMatchNotes=" + metadata.tournamentMatchNotes;
	}

	//if (theGame.board.winners.length > 0) {
	if (theGame.getWinner()) {
		// Add end date
		if (!metadata.endDate) {
			metadata.endDate = getDateString();
		}
		linkUrl += "&eDate=" + metadata.endDate;
	}

	if (onlinePlayEnabled && gameId >= 0) {
		// append to url: &onlinePlayGame=y&gameId=?, where ? is id value
		linkUrl += "&onlinePlayGame=y&gameId=" + gameId;
	}

	// debug(url + "?" + linkUrl);
	// Compress, then build full URL
	linkUrl = LZString.compressToEncodedURIComponent(linkUrl);

	linkUrl = url + "?" + linkUrl;

	// if (theGame.board.winners.length > 0) {
	if (theGame.getWinner()) {
		// Call short url because game is over
		if (!url.startsWith("file")) {
			getShortUrl(linkUrl);
		}
	}

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
	var toEmail = getCurrentPlayerEmail();

	if (metadata.tournamentHost) {
		toEmail += ", " + metadata.tournamentHost;
	}
	
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

	if (currentMoveIndex == 1 && !haveBothEmails()) {
		messageText += "Thank you for Hosting a game of Pai Sho! Share <a href=\"" + shortUrl + "\">this link</a> with your friends to invite them to join you in a game."
		if (aiList.length > 0) {
			for (var i = 0; i < aiList.length; i++) {
				messageText += "<br /><span class='skipBonus' onclick='setAiIndex(" + i + ");'>Play " + aiList[i].getName() + "</span>";
			}
		}
	} else if (haveBothEmails()) {
		// messageText = "Click <span class='skipBonus' onclick=sendMail('" + shortUrl + "')>here</span> to email your move to the " + getCurrentPlayer() + ". Or, share this <a href=\"" + shortUrl + "\">link</a> with them.";
		if (!metadata.tournamentName) {
			messageText += "Or, copy and share this <a href=\"" + shortUrl + "\">link</a> with your opponent.";
		}
		showSubmitMoveForm(shortUrl);
	} else if ((activeAi && getCurrentPlayer() === activeAi.player) || (activeAi2 && getCurrentPlayer() === activeAi2.player)) {
		//messageText += "<span class='skipBonus' onclick='playAiTurn();'>Submit move to AI</span>";
		messageText += "<em>THINKING...</em>";
	} else if (activeAi) {
		messageText += "Playing against the computer can help you learn how the game works. You should be able to beat the computer easily once you understand the game.<br /><br />Is playing against the computer too easy? Good! <a href='http://skudpaisho.com/?BYewzgLgvGDWCuATADgQwJZlAAQOYFsMAbAOgGMR8AyXVfAUygAYAJEgJQBoB1TgaU4AhKgDt6AdwDKyemXSoiAMSIhx9AE7t4RemCgjREgOKoIurTqgBPKupBlYYAKojxwevSKoARpZtgAEVNGACYmAEYAdgBaJhDYgBYgA'>Join the creator in a game</a> to play a real game or give feedback.";
	} else {
		messageText += "Copy this <a href=\"" + shortUrl + "\">link</a> and send to the " + getCurrentPlayer() + ".";
	}

	if (!ignoreNoEmail && !haveUserEmail()) {
		messageText = getNoUserEmailMessage();
	}

	//if (theGame.board.winners.length > 0) {
	if (theGame.getWinner()) {
		// There is a winner!
		// if (theGame.board.winners.length > 1) {
		// 	// There are two winners???
		// 	messageText += "<br /><strong>Both players have created Harmony Rings! It's a tie!</strong>";
		// } else {
		// 	messageText += "<br /><strong>" + theGame.board.winners[0] + " has created a Harmony Ring and won the game!</strong>";
		// }
		messageText += "<br /><strong>" + theGame.getWinner() + theGame.getWinReason() + "</strong>";
	} else {
		messageText += getResetMoveText();
	}

	document.querySelector(".gameMessage").innerHTML = messageText;

	// QUICK!
	if ((activeAi && getCurrentPlayer() === activeAi.player) || (activeAi2 && getCurrentPlayer() === activeAi2.player)) {
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
	var bodyMessage = "I just made move #" + gameNotation.getLastMoveNumber() + " in Skud Pai Sho! Click here to open our game: " + url;

	if (metadata.tournamentName) {
		bodyMessage += "[BR][BR]This is a move submission for tournament: " + metadata.tournamentName;
		bodyMessage += "[BR]Match Info:[BR]" + metadata.tournamentMatchNotes;
	}
	
	bodyMessage += "[BR][BR]---- Full Details: ----[BR]Move: " + gameNotation.getLastMoveText() 
		+ "[BR][BR]Game Notation: [BR]" + gameNotation.getNotationForEmail();

	return bodyMessage;
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

function getCurrentPlayerForReal() {
	if (gameNotation.moves.length <= 1) {
		if (gameNotation.moves.length === 0) {
			return HOST;
		} else {
			return GUEST;
		}
	}
	if (gameNotation.moves.length <= 2) {
		return GUEST;
	}
	var lastPlayer = gameNotation.moves[gameNotation.moves.length - 1].player;

	if (lastPlayer === HOST) {
		return GUEST;
	} else if (lastPlayer === GUEST) {
		return HOST;
	}
}

function getExtraHarmonyBonusHelpText() {
	if (!limitedGatesRule) {
		if (theGame.playerCanBonusPlant(getCurrentPlayer())) {
			return " <br />You can choose an Accent Tile, Special Flower Tile, or, since you have less than two Growing Flowers, a Basic Flower Tile.";
		}
		return " <br />You can choose an Accent Tile or a Special Flower Tile. You cannot choose a Basic Flower Tile because you have two or more Growing Flowers.";
	} else {
		if (theGame.playerCanBonusPlant(getCurrentPlayer())) {
			return " <br />You can choose an Accent Tile or, since you have no Growing Flowers, a Basic or Special Flower Tile.";
		}
		return " <br />You can choose an Accent Tile. You cannot choose a Basic or Special Flower Tile because you have at least one Growing Flower.";
	}
}

function showHarmonyBonusMessage() {
	document.querySelector(".gameMessage").innerHTML = "Harmony Bonus! Select a tile to play or <span class='skipBonus' onclick='skipHarmonyBonus();'>skip</span>."
	+ getExtraHarmonyBonusHelpText()
	+ getResetMoveText();
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
		if (gameNotation.moves.length === 3) {
			gameNotation.removeLastMove();	// Special case for automatic Host first move
		}
	} else if (notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}

	if (gameNotation.moves.length <= 1) {
		// Choosing Accent Tiles
		if (getCurrentPlayer() === GUEST) {
			guestAccentTiles = [];
		} else if (getCurrentPlayer() === HOST) {
			hostAccentTiles = [];
		}
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

function myTurnForReal() {
	var userEmail = localStorage.getItem(localEmailKey);
	if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
		if (getCurrentPlayerForReal() === HOST) {
			return localStorage.getItem(localEmailKey) === hostEmail;
		} else {
			return localStorage.getItem(localEmailKey) === guestEmail;
		}
	} else {
		return true;
	}
}

var createGameCallback = function(newGameId) {
	debug("INSIDE CreateMove CALLBACK with GameId: " + newGameId);
	gameId = newGameId;
	finalizeMove();
	lastSubmittedGameNotation = gameNotation.notationTextForUrl();
	startWatchingGameRealTime();
};

var submitMoveCallback = function() {
	debug("Inside submitMoveCallback");
	lastSubmittedGameNotation = gameNotation.notationTextForUrl();
	finalizeMove();
	startWatchingGameRealTime();
};

function unplayedTileClicked(tileDiv) {
	if (theGame.getWinner() && notationBuilder.status !== READY_FOR_BONUS) {
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

			if (hostAccentTiles.length === 4 || (simpleCanonRules && hostAccentTiles.length === 2)) {
				var move = new NotationMove("0H." + hostAccentTiles.join());
				gameNotation.addMove(move);
				if (onlinePlayEnabled) {
					onlinePlayEngine.createGame(gameNotation.notationTextForUrl(), getUserEmail(), createGameCallback);
				} else {
					finalizeMove();
				}
			}
		} else {
			guestAccentTiles.push(tileCode);
			
			if (guestAccentTiles.length === 4 || (simpleCanonRules && guestAccentTiles.length === 2)) {
				var move = new NotationMove("0G." + guestAccentTiles.join());
				gameNotation.addMove(move);
				// No finalize move because it is still Guest's turn
				rerunAll();
				showResetMoveMessage();
			}
		}
		theGame.actuate();
	} else if (notationBuilder.status === BRAND_NEW) {
		// new Planting turn, can be basic flower
		if (tile.type !== BASIC_FLOWER) {
			debug("Can only Plant a Basic Flower tile. That's not one of them.");
			return false;
		}

		tile.selectedFromPile = true;

		notationBuilder.moveType = PLANTING;
		notationBuilder.plantedFlowerType = tileCode;
		notationBuilder.status = WAITING_FOR_ENDPOINT;

		theGame.revealOpenGates(getCurrentPlayer(), gameNotation.moves.length);
	} else if (notationBuilder.status === READY_FOR_BONUS) {
		if (simpleSpecialFlowerRule && tile.type === SPECIAL_FLOWER) {
			// Other special tile still needs to be in that player's tile pile
			if (!theGame.playerHasNotPlayedEitherSpecialTile(tile.ownerName)) {
				return false;
			}
		}

		tile.selectedFromPile = true;
		// Bonus Plant! Can be any tile
		notationBuilder.bonusTileCode = tileCode;
		notationBuilder.status = WAITING_FOR_BONUS_ENDPOINT;

		if (tile.type === BASIC_FLOWER && theGame.playerCanBonusPlant(getCurrentPlayer())) {
			theGame.revealOpenGates(getCurrentPlayer());
		} else if (tile.type === ACCENT_TILE) {
			theGame.revealPossiblePlacementPoints(tile);
		} else if (tile.type === SPECIAL_FLOWER) {
			if (!limitedGatesRule 
				|| (limitedGatesRule && theGame.playerCanBonusPlant(getCurrentPlayer()))) {
				theGame.revealSpecialFlowerPlacementPoints(getCurrentPlayer());
			}
		}
	} else {
		theGame.hidePossibleMovePoints();
		if (notationBuilder.status === WAITING_FOR_BONUS_ENDPOINT 
			|| notationBuilder.status === WAITING_FOR_BOAT_BONUS_POINT) {
			notationBuilder.status = READY_FOR_BONUS;
			showHarmonyBonusMessage();
		} else {
			notationBuilder = new NotationBuilder();
		}
	}
}

function pointClicked(htmlPoint) {
	if (theGame.getWinner() && notationBuilder.status !== WAITING_FOR_BONUS_ENDPOINT 
			&& notationBuilder.status !== WAITING_FOR_BOAT_BONUS_POINT) {
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

			if (boardPoint.tile.trapped) {
				return;
			}

			if (!newKnotweedRules && boardPoint.tile.trapped) {
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
				// No finalize move because it's still Guest's turn
				showResetMoveMessage();
			} else if (!bonusAllowed) {
				// Move all set. Add it to the notation!
				gameNotation.addMove(move);
				if (onlinePlayEnabled) {
					onlinePlayEngine.submitMove(gameId, gameNotation.notationTextForUrl(), submitMoveCallback);
				} else {
					finalizeMove();
				}
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

			// If we're placing a boat, and boardPoint is a flower...
			if (notationBuilder.bonusTileCode.endsWith("B") && (boatOnlyMoves || boardPoint.tile.type !== ACCENT_TILE)) {
				// Boat played on flower, need to pick flower endpoint
				notationBuilder.status = WAITING_FOR_BOAT_BONUS_POINT;
				theGame.revealBoatBonusPoints(boardPoint);
			} else {
				var move = gameNotation.getNotationMoveFromBuilder(notationBuilder);
				
				gameNotation.addMove(move);
				if (onlinePlayEnabled) {
					onlinePlayEngine.submitMove(gameId, gameNotation.notationTextForUrl(), submitMoveCallback);
				} else {
					finalizeMove();
				}
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
			if (onlinePlayEnabled) {
				onlinePlayEngine.submitMove(gameId, gameNotation.notationTextForUrl(), submitMoveCallback);
			} else {
				finalizeMove();
			}
		} else {
			theGame.hidePossibleMovePoints();
			notationBuilder.status = READY_FOR_BONUS;
		}
	} else if (notationBuilder.status === READY_FOR_BONUS) {
		if (specialFlowerBonusRule) {
			//
		}
	}
}

function skipHarmonyBonus() {
	var move = gameNotation.getNotationMoveFromBuilder(notationBuilder);
	gameNotation.addMove(move);
	if (onlinePlayEnabled) {
		onlinePlayEngine.submitMove(gameId, gameNotation.notationTextForUrl(), submitMoveCallback);
	} else {
		finalizeMove();
	}
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
		defaultHelpMessageText = "<h4>Skud Pai Sho</h4> <p>Pai Sho is a game of harmony. The goal is to arrange your Flower Tiles to create a ring of Harmonies that surrounds the center of the board.</p> <p>Harmonies are created when two of a player's harmonious tiles are on the same line with nothing in between them. But be careful; tiles that clash can never be lined up on the board.</p> <p>Select tiles or points on the board to learn more or <a href='https://skudpaisho.wordpress.com/pai-sho-resources/' target='_blank'>view the resources page</a> for the rules, a video tutorial on how to play, a print and play Pai Sho set, and more!</p>";
	}
	document.querySelector(".helpText").innerHTML = defaultHelpMessageText;
	if (!haveUserEmail()) {
		document.querySelector(".helpText").innerHTML += "<p>If you <span class='skipBonus' onclick='promptEmail()'>enter your email address</span>, you can be notified when your opponent plays a move.</p>";
	}

	document.querySelector(".helpText").innerHTML = getTournamentText() 
		+ document.querySelector(".helpText").innerHTML
		+ getAltTilesOptionText();
}

function haveUserEmail() {
	var userEmail = localStorage.getItem(localEmailKey);
	return (userEmail && userEmail.includes("@") && userEmail.includes("."));
}

function showTileMessage(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));

	var tile = new Tile(divName.substring(1), divName.charAt(0));

	var message = [];

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}
	
	var tileCode = divName.substring(1);

	var heading = Tile.getTileName(tileCode);

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

		var harmTile1 = Tile.getTileName(harmTileColor + harmTileNum);

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

		var harmTile2 = Tile.getTileName(harmTileColor + harmTileNum);

		harmTileNum = tileNum;
		if (colorCode === 'R') {
			harmTileColor = 'W';
		} else {
			harmTileColor = 'R';
		}
		var clashTile = Tile.getTileName(harmTileColor + harmTileNum);

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
			message.push("Traps opponent's surrounding Flower Tiles so they cannot move");
			if (!simplest) {
				message.push("Can capture Flower Tiles if you have a Blooming White Lotus");
			}
			if (lotusNoCapture || simplest) {
				message.push("Can be captured by any Flower Tile if you have a Blooming White Lotus");
			} else {
				message.push("Can be captured by any Basic Flower Tile if your White Lotus has been played");
			}
		}
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

	var message = [];
	if (boardPoint.hasTile()) {
		message.push(toHeading(boardPoint.tile.getName()));
		// Specific tile message
		/**
		Rose
		* In Harmony with Chrysanthemum to the north
		* Trapped by Orchid
		*/
		var tileHarmonies = theGame.board.harmonyManager.getHarmoniesWithThisTile(boardPoint.tile);
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
			message.push(getGatePointMessage());
		}
	}

	setMessage(toMessage(message));
}

function setMessage(msg) {
	if (msg === document.querySelector(".helpText").innerHTML) {
		clearMessage();
	} else {
		document.querySelector(".helpText").innerHTML = getTournamentText() + msg + getAltTilesOptionText();
	}
}

function getAltTilesOptionText() {
	return "<p><span class='skipBonus' onclick='toggleTileDesigns();'>Click here</span> to switch between standard and modern tile designs.</p>";
}

function getTournamentText() {
	if (metadata.tournamentMatchNotes) {
		return metadata.tournamentName + "<br />" + metadata.tournamentMatchNotes + "<br />";
	}
	return "";
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

function getPublicTournamentLink() {
	hostEmail = null;
	guestEmail = null;
	getLink(false);
}

function getLink(forSandbox) {
	var notation = new GameNotation();
	for (var i = 0; i < currentMoveIndex; i++) {
		notation.addMove(gameNotation.moves[i]);
	}

	var linkUrl = "";

	if (forSandbox && getUserEmail()) {
		linkUrl += "host=" + getUserEmail() + "&";
		linkUrl += "guest=" + getUserEmail() + "&";
	}

	linkUrl += "game=" + notation.notationTextForUrl();
	// linkUrl += "&replay=true";
	// if (newKnotweedRules) {
	// 	linkUrl += "&nkr=y";
	// }	// No longer needed
	if (newSpecialFlowerRules) {
		linkUrl += "&newSpecialFlowerRules=y";
	} else {
		linkUrl += "&newSpecialFlowerRules=n";
	}

	if (newGatesRule) {
		linkUrl += "&newGatesRule=y";
	} else {
		linkUrl += "&newGatesRule=n";
	}

	if (simpleCanonRules) {
		linkUrl += "&canon=y";
	}

	if (newOrchidVulnerableRule) {
		linkUrl += "&newOrchidVulnerableRule=y";
	} //else {
	// 	linkUrl += "&newOrchidVulnerableRule=n";
	// }

	if (newOrchidCaptureRule) {
		linkUrl += "&newOrchidCaptureRule=y";
	} //else {
	// 	linkUrl += "&newOrchidCaptureRule=n";
	// }

	if (newOrchidClashRule) {
		linkUrl += "&newOrchidClashRule=y";
	} //else {
	// 	linkUrl += "&newOrchidClashRule=n";
	// }

	if (simpleSpecialFlowerRule) {
		linkUrl += "&simpleSpecialFlowerRule=y";
	} //else {
	// 	linkUrl += "&simpleSpecialFlowerRule=n";
	// }

	if (rocksUnwheelable) {
		linkUrl += "&rocksUnwheelable=y";
	} //else {
	// 	linkUrl += "&rocksUnwheelable=n";
	// }

	if (limitedGatesRule) {
		linkUrl += "&limitedGatesRule=y";
	} else {
		linkUrl += "&limitedGatesRule=n";
	}

	if (simpleRocks) {
		linkUrl += "&simpleRocks=y";
	}

	if (simplest) {
		linkUrl += "&simplest=y";
	}

	if (specialFlowerBonusRule) {
		linkUrl += "&specialFlowerBonusRule=y";
	} //else {
	// 	linkUrl += "&specialFlowerBonusRule=n";
	// }

	if (lessBonus) {
		linkUrl += "&lessBonus=y";
	}
	if (superHarmonies) {
		linkUrl += "&superHarmonies=y";
	}
	if (completeHarmony) {
		linkUrl += "&completeHarmony=y";
	}

	if (boatOnlyMoves) {
		linkUrl += "&boatOnlyMoves=y";
	}
	if (superRocks) {
		linkUrl += "&superRocks=y";
	}
	

	// Add start date
	if (metadata.startDate) {
		linkUrl += "&sDate=" + metadata.startDate;
	}

	// Add tournament info
	if (!forSandbox && metadata.tournamentName && metadata.tournamentHost) {
		linkUrl += "&tournamentName=" + metadata.tournamentName;
		linkUrl += "&tournamentHost=" + metadata.tournamentHost;
		linkUrl += "&tournamentMatchNotes=" + metadata.tournamentMatchNotes;
	}

	//if (theGame.board.winners.length > 0) {
	if (theGame.getWinner()) {
		// Add end date
		if (metadata.endDate) {
			linkUrl += "&eDate=" + metadata.endDate;
		}
	}

	linkUrl = LZString.compressToEncodedURIComponent(linkUrl);

	linkUrl = sandboxUrl + "?" + linkUrl;

	//if (theGame.board.winners.length > 0) {
	if (theGame.getWinner()) {
		// Call short url because game is over
		if (!sandboxUrl.startsWith("file")) {
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
	if (activeAi) {
		activeAi2 = aiList[i];
		activeAi2.setPlayer(getCurrentPlayer());
	} else {
		activeAi = aiList[i];
		activeAi.setPlayer(getCurrentPlayer());
	}
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

function playAiTurn() {
	if (theGame.getWinner()) {
		return;
	}
	var theAi = activeAi;
	if (activeAi2) {
		if (activeAi2.player === getCurrentPlayer()) {
			theAi = activeAi2;
		}
	}

	var playerMoveNum = gameNotation.getPlayerMoveNum();

	if (playerMoveNum === 1 && getCurrentPlayer() === HOST) {
		// Auto mirror guest move
		// Host auto-copies Guest's first Plant
		var hostMoveBuilder = notationBuilder.getFirstMoveForHost(gameNotation.moves[gameNotation.moves.length - 1].plantedFlowerType);
		gameNotation.addMove(gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
		finalizeMove();
	} else if (playerMoveNum < 3) {
		var move = theAi.getMove(theGame.getCopy(), playerMoveNum);
		if (!move) {
			debug("No move given...");
			return;
		}
		gameNotation.addMove(move);
		finalizeMove();
	} else {
		setTimeout(function(){
			var move = theAi.getMove(theGame.getCopy(), playerMoveNum);
			if (!move) {
				debug("No move given...");
				return;
			}
			gameNotation.addMove(move);
			finalizeMove();
		}, 10);
	}

	/*var move = activeAi.getMove(theGame.getCopy(), playerMoveNum);
	if (!move) {
		debug("No move given...");
		return;
	}
	gameNotation.addMove(move);
	finalizeMove();*/
}

function sandboxFromMove() {
	var link = getLink(true);
	window.open(link);
}

function getDateString() {
	let date = new Date();
	date = date.toISOString().slice(0,10);
	return date;
}

function hostTournamentClicked() {
	//
}

/* Modal */
function showModal(headingHTMLText, modalMessageHTMLText) {
	// Get the modal
	var modal = document.getElementById('myMainModal');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("myMainModalClose")[0];

	var modalHeading = document.getElementById('modalHeading');
	modalHeading.innerHTML = headingHTMLText;

	var modalMessage = document.getElementById('modalMessage');
	modalMessage.innerHTML = modalMessageHTMLText;

	// When the user clicks the button, open the modal 
	modal.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	};
}

var emailBeingVerified = "";

function callSendVerificationCode(userEmail) {
	emailBeingVerified = userEmail;
	onlinePlayEngine.sendVerificationCode(userEmail);
}

var codeToVerify = 0;
var verifyCodeCallback = function(actualCode) {
	if (codeToVerify === actualCode) {
		// save email
		localStorage.setItem(localEmailKey, emailBeingVerified);
		document.getElementById('myMainModal').style.display = "none";
		showModal("<i class='fa fa-check' aria-hidden='true'></i> Email Verified", "Your email has been successfully verified and you are now signed in.");
	}
	emailBeingVerified = "";
	codeToVerify = 0;

	updateFooter();
	clearMessage();
};

function verifyEmailWithCode(codeToTry) {
	codeToVerify = codeToTry;
	onlinePlayEngine.getVerificationCode(verifyCodeCallback);
}

function loginClicked() {
	var msg = "Enter your email and enter the 4-digit code sent to you to sign into SkudPaiSho.com in this browser. \
	<div style='text-align: center;'> <div> \
	<br /> Email: <input id='userEmailInput' type='text' name='userEmailInput' /> </div> \
	<div><button type='button' onclick='callSendVerificationCode(document.getElementById(\"userEmailInput\").value); document.getElementById(\"verificationCodeInput\").disabled=false;'>Send verification code</button></div> \
	<div><br /> Code: <input id='verificationCodeInput' type='text' name='verificationCodeInput' disabled /> </div> \
	<div><button id='verifyCodeBtn' type='button' onclick='verifyEmailWithCode(document.getElementById(\"verificationCodeInput\").value);'>Verify code</button></div> </div>";

	if (getUserEmail()) {
		msg += "<div><br /><br />You are currently signed in as " + getUserEmail() + "</div>";
	}
	
	showModal("Sign In", msg);
}

/* End Modal */
