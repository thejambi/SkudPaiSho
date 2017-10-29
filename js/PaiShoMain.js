// Pai Sho Main

var QueryString = function () {
  var query_string = {};
  var query = window.location.search.substring(1);

  if (query.length > 0) {
  	// Decompress first
  	query = LZString.decompressFromEncodedURIComponent(query);
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

var gameController;

var localEmailKey = "localUserEmail";
var tileDesignTypeKey = "tileDesignTypeKey";

var usernameKey = "usernameKey";
var userEmailKey = "userEmailKey";
var userIdKey = "userIdKey";
var deviceIdKey = "deviceIdKey";


var url;

var defaultHelpMessageText;
var defaultEmailMessageText;

var localStorage;

var hostEmail;
var guestEmail;

var BRAND_NEW = "Brand New";
var MOVE_DONE = "Move Done";
var WAITING_FOR_ENDPOINT = "Waiting for endpoint";
var READY_FOR_BONUS = "READY_FOR_BONUS";
var WAITING_FOR_BONUS_ENDPOINT = "WAITING_FOR_BONUS_ENDPOINT";
var WAITING_FOR_BOAT_BONUS_POINT = "WAITING_FOR_BOAT_BONUS_POINT";

var HOST_SELECT_ACCENTS = "HOST_SELECT_ACCENTS";

var localPlayerRole = HOST;

var activeAi;
var activeAi2;
var sandboxUrl;
var metadata = new Object();
var replayIntervalLength = 1500;

/* Online Play variables */
var onlinePlayEngine;

var gameId = -1;
var lastKnownGameNotation = "";
var gameWatchIntervalValue;
var currentGameOpponentUsername;
var currentGameData = new Object();
var currentMoveIndex = 0;
var interval = 0;

var emailBeingVerified = "";
var usernameBeingVerified = "";
var codeToVerify = 0;
var tempUserId;
var myGamesList = [];
var gameSeekList = [];
var userOnlineIcon = "<span title='Online' style='color:#35ac19;'><i class='fa fa-user-circle-o' aria-hidden='true'></i></span>";
var userOfflineIcon = "<span title='Offline' style='color:gray;'><i class='fa fa-user-circle-o' aria-hidden='true'></i></span>";
var logOnlineStatusIntervalValue;
var userTurnCountInterval;
/* --- */

window.requestAnimationFrame(function () {
	/* Online play is enabled! */
	onlinePlayEnabled = true;
	/* ----------------------- */

	localStorage = new LocalStorage().storage;

	defaultEmailMessageText = document.querySelector(".footer").innerHTML;

	if (QueryString.gameType) {
		setGameController(parseInt(QueryString.gameType));
	} else {
		setGameController(GameType.SkudPaiSho.id);
	}

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

	if (url.startsWith("file") && !ios) {
		onlinePlayEnabled = false;
	}

	if (ios) {
		url = "http://skudpaisho.com/";
		sandboxUrl = url;
	}

	// gameController.gameNotation.setNotationText(QueryString.game);
	gameController.setGameNotation(QueryString.game);

	hostEmail = QueryString.host;
	guestEmail = QueryString.guest;

	if (gameController.gameNotation.moves.length > 1) {
		showReplayControls();
	}

	onlinePlayEngine = new OnlinePlayEngine();

	if (ios) {
		onlinePlayEngine = new OnlinePlayEngineIOS();
	}

	var localUserEmail = localStorage.getItem(localEmailKey);

	if (!userIsLoggedIn()) {
		localUserEmail = null;
		localStorage.removeItem(localEmailKey);
	}

	if (hostEmail && hostEmail != localUserEmail
		&& guestEmail && guestEmail != localUserEmail) {
		localPlayerRole = null;
	} else {
		localPlayerRole = getCurrentPlayer();

		if (localUserEmail) {
			if (localPlayerRole === HOST) {
				hostEmail = localUserEmail;
			} else if (localPlayerRole === GUEST) {
				guestEmail = localUserEmail;
			}
		} else {
			if (localPlayerRole === HOST) {
				hostEmail = null;
			} else if (localPlayerRole === GUEST) {
				guestEmail = null;
			}
		}
	}

	updateFooter();

	clearMessage();

	rerunAll();

	setAccountHeaderLinkText();

	setSidenavNewGameSection();

	if (onlinePlayEnabled) {
		onlinePlayEngine.testOnlinePlay();
		if (gameId > 0) {
			startWatchingGameRealTime();
		}
	}

	initialVerifyLogin();

	// Open default help/chat tab
	document.getElementById("defaultOpenTab").click();
});

function showReplayControls() {
	document.getElementById("replayControls").classList.remove("gone");
}

function setTileContainers() {
	document.getElementById('hostTilesContainer').innerHTML = gameController.getHostTilesContainerDivs();
	document.getElementById('guestTilesContainer').innerHTML = gameController.getGuestTilesContainerDivs();
}

var initialVerifyLoginCallback = function initialVerifyLoginCallback(response) {
				if (response === "Results exist") {
					startLoggingOnlineStatus();
					startWatchingNumberOfGamesWhereUserTurn();
				} else {
					// Cannot verify user login, forget all current stuff.
					forgetCurrentGameInfo();
					forgetOnlinePlayInfo();
				}
			};

function initialVerifyLogin() {
	if (onlinePlayEnabled) {
		onlinePlayEngine.verifyLogin(getUserId(), 
			getUsername(), 
			getUserEmail(), 
			getDeviceId(), 
			initialVerifyLoginCallback
		);
	}
}

var verifyLoginCallback = function verifyLoginCallback(response) {
				if (response === "Results exist") {
					// ok
				} else {
					// Cannot verify user login, forget all current stuff.
					forgetCurrentGameInfo();
					forgetOnlinePlayInfo();
				}
			};

function verifyLogin() {
	if (onlinePlayEnabled) {
		onlinePlayEngine.verifyLogin(getUserId(), 
			getUsername(), 
			getUserEmail(), 
			getDeviceId(), 
			verifyLoginCallback
		);
	}
}

function setAccountHeaderLinkText(countOfGamesWhereUserTurn) {
	var text = "Sign In";
	if (userIsLoggedIn() && onlinePlayEnabled) {
		text = "My Games";
		// document.title = "Skud Pai Sho";
		document.title = "The Garden Gate";
		if (parseInt(countOfGamesWhereUserTurn)) {
			text += "(" + countOfGamesWhereUserTurn + ")";
			// document.title = "(" + countOfGamesWhereUserTurn + ") Skud Pai Sho";
			document.title = "(" + countOfGamesWhereUserTurn + ") The Garden Gate";
		}
	}
	document.getElementById('accountHeaderLinkText').innerText = text;
}

var getGameNotationCallback = function getGameNotationCallback(newGameNotation) {
	if (gameWatchIntervalValue && newGameNotation !== lastKnownGameNotation) {
		// gameController.gameNotation.setNotationText(newGameNotation);
		gameController.setGameNotation(decodeURIComponent(newGameNotation));
		rerunAll();
		lastKnownGameNotation = newGameNotation;
		showReplayControls();	// TODO Put this somewhere better where it's called less often.
	}
};

function updateCurrentGameTitle(isOpponentOnline) {
	if (!currentGameData.guestUsername || !currentGameData.hostUsername) {
		document.getElementById("response").innerHTML = "";
		return;
	}
	/* --- */

	var opponentOnlineIconText = userOfflineIcon;
	if (isOpponentOnline) {
		opponentOnlineIconText = userOnlineIcon;
	}

	var title = "<strong>";
	if (currentGameData.guestUsername === getUsername()) {
		title += opponentOnlineIconText;
	}
	title += currentGameData.hostUsername;
	title += " vs. ";
	if (currentGameData.hostUsername === getUsername()) {
		title += opponentOnlineIconText;
	}
	title += currentGameData.guestUsername;
	title += "</strong>";
	
	document.getElementById("response").innerHTML = title;
}

var lastChatTimestamp = '1970-01-01 00:00:00';

var checkIfUserOnlineCallback = function checkIfUserOnlineCallback(isOpponentOnline) {
	updateCurrentGameTitle(isOpponentOnline);
};

var getNewChatMessagesCallback = function getNewChatMessagesCallback(results) {
	if (results != "") {
		var resultRows = results.split('\n');

		chatMessageList = [];
		var newChatMessagesHtml = "";

		for (var index in resultRows) {
			var row = resultRows[index].split('|||');
			var chatMessage = {
				timestamp:row[0], 
				username:row[1], 
				message:row[2]
			};
			chatMessageList.push(chatMessage);
			lastChatTimestamp = chatMessage.timestamp;
		}

		var alertNewMessages = false;

		for (var index in chatMessageList) {
			var chatMessage = chatMessageList[index];
			newChatMessagesHtml += "<div class='chatMessage'><strong>" + chatMessage.username + ":</strong> " + chatMessage.message.replace(/&amp;/g,'&') + "</div>";
			
			// The most recent message will determine whether to alert
			if (chatMessage.username != getUsername()) {
				// Set chat tab color to alert new messages if newest message is not from user
				alertNewMessages = true;
			} else {
				alertNewMessages = false;
			}
		}

		if (alertNewMessages) {
			document.getElementById('chatTab').classList.add('alertTab');
		}
		
		/* Prepare to add chat content and keep scrolled to bottom */
		var chatMessagesDisplay = document.getElementById('chatMessagesDisplay');
		// allow 1px inaccuracy by adding 1
		var isScrolledToBottom = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight <= chatMessagesDisplay.scrollTop + 1;
		var newElement = document.createElement("div");
		newElement.innerHTML = newChatMessagesHtml;
		chatMessagesDisplay.appendChild(newElement);
		// scroll to bottom if isScrolledToBottom
		if(isScrolledToBottom) {
			chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight;
		}
	}
};

function gameWatchPulse() {
	onlinePlayEngine.getGameNotation(gameId, getGameNotationCallback);
	
	onlinePlayEngine.checkIfUserOnline(currentGameOpponentUsername, checkIfUserOnlineCallback);

	onlinePlayEngine.getNewChatMessages(gameId, lastChatTimestamp, getNewChatMessagesCallback);
}

function startWatchingGameRealTime() {
	debug("Starting to watch game");

	// Setup game watching...
	document.getElementById('chatMessagesDisplay').innerHTML = "";
	lastChatTimestamp = '1970-01-01 00:00:00';

	// First pulse
	gameWatchPulse();

	if (gameWatchIntervalValue) {
		clearInterval(gameWatchIntervalValue);
		gameWatchIntervalValue = null;
		debug("Interval cleared...");
	}

	gameWatchIntervalValue = setInterval(function() {
		gameWatchPulse();
	}, 3000);
}

function setUseHLoweTiles() {
	localStorage.setItem(tileDesignTypeKey, "hlowe");
	useHLoweTiles = true;
	gameController.callActuate();
}

function setUseStandardTiles() {
	localStorage.setItem(tileDesignTypeKey, "standard");
	useHLoweTiles = false;
	gameController.callActuate();
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
}

function updateFooter() {
	var userEmail = localStorage.getItem(localEmailKey);
	if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
		document.querySelector(".footer").innerHTML = gamePlayersMessage() + "You are playing as " + userEmail
		+ " | <span class='skipBonus' onclick='promptEmail();'>Edit email</span> | <span class='skipBonus' onclick='showSignOutModal();'>Sign out</span>";
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

forgetOnlinePlayInfo = function() {
	// Forget online play info
	localStorage.removeItem(deviceIdKey);
	localStorage.removeItem(userIdKey);
	localStorage.removeItem(usernameKey);
	localStorage.removeItem(userEmailKey);
}

function showSignOutModal() {
	var message = "<div class='clickableText' onclick='signOut(true);'>Yes, sign out</div>";
	message += "<br /><div class='clickableText' onclick='signOut(false);'>Cancel</div>";

	showModal("Really sign out?", message);
}

function signOut(reallySignOut) {
	closeModal();

	if (!reallySignOut) {
		updateFooter();
		return;
	}

	if (hostEmail = getUserEmail()) {
		hostEmail = null;
	}

	if (guestUsername = getUserEmail()) {
		guestEmail = null;
	}

	// document.title = "Skud Pai Sho";
	document.title = "The Garden Gate";

	localStorage.removeItem(localEmailKey);

	forgetOnlinePlayInfo();

	updateFooter();
	clearMessage();
	setAccountHeaderLinkText();
}

function rewindAllMoves() {
	pauseRun();
	gameController.resetGameManager();
	gameController.resetNotationBuilder();
	currentMoveIndex = 0;
	refreshMessage();
}

function playNextMove(withActuate) {
	if (currentMoveIndex >= gameController.gameNotation.moves.length) {
		// no more moves to run
		refreshMessage();
		return false;
	} else {
		gameController.theGame.runNotationMove(gameController.gameNotation.moves[currentMoveIndex], withActuate);
		currentMoveIndex++;
		return true;
	}
}

function playPrevMove() {
	pauseRun();

	var moveToPlayTo = currentMoveIndex - 1;

	gameController.resetGameManager();
	gameController.resetNotationBuilder();

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
	gameController.callActuate();
}

function playPause() {
	if (gameController.gameNotation.moves.length === 0) {
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

	msg += gameController.getAdditionalMessage();

	if (gameController.theGame.getWinner()) {
		// There is a winner!
		msg += "<br /><strong>" + gameController.theGame.getWinner() + gameController.theGame.getWinReason() + "</strong>";
	}
	if (msg === "<br />") {
		msg = "";
	}
	return msg;
}

function getGameMessageElement() {
	var gameMessage = document.querySelector(".gameMessage");
	var gameMessage2 = document.querySelector(".gameMessage2");
	
	if (gameController.showGameMessageUnderneath) {
		gameMessage.innerHTML = "";
		return gameMessage2;
	} else {
		gameMessage2.innerHTML = "";
		return gameMessage;
	}
}

function refreshMessage() {
	getGameMessageElement().innerHTML = "Current Player: " + getCurrentPlayer() + getAdditionalMessage();

	if (playingOnlineGame() && !myTurn() && !gameController.theGame.getWinner()) {
		showResetMoveMessage();
	}
}

function rerunAll() {
	gameController.resetGameManager();
	gameController.resetNotationBuilder();

	currentMoveIndex = 0;

	playAllMoves();

	refreshMessage();
}

var finalizeMove = function(ignoreNoEmail) {
	rerunAll();

	// Only build url if not onlinePlay
	if (!playingOnlineGame()) {
		var linkUrl = "";
		if (hostEmail) {
			linkUrl += "host=" + hostEmail + "&";
		}
		if (guestEmail) {
			linkUrl += "guest=" + guestEmail + "&";
		}
		linkUrl += "game=" + gameController.gameNotation.notationTextForUrl();

		// Compress, then build full URL
		linkUrl = LZString.compressToEncodedURIComponent(linkUrl);

		linkUrl = url + "?" + linkUrl;

		linkShortenCallback(linkUrl, ignoreNoEmail);
	} else {
		linkShortenCallback('', ignoreNoEmail);
	}
}

function showSubmitMoveForm(url) {
	// Move has completed, so need to send to "current player"
	var toEmail = getCurrentPlayerEmail();
	
	var fromEmail = getUserEmail();

	var bodyMessage = getEmailBody(url);

	$('#fromEmail').attr("value", fromEmail);
	$('#toEmail').attr("value", toEmail);
	$('#message').attr("value", bodyMessage);
	$('#contactform').removeClass('gone');
}

function getNoUserEmailMessage() {
	return "<span class='skipBonus' onclick='loginClicked(); finalizeMove();'>Sign in</span> to play real-time games with others online. <br />";
	// return "Recommended: <span class='skipBonus' onclick='promptEmail(); finalizeMove();'>Enter your email address</span> to be notified when it is your turn. <br /><em><span class='skipBonus' onclick='finalizeMove(true);'>Click to ignore</span></em><br /><br />";
}

function playingOnlineGame() {
	return onlinePlayEnabled && gameId > 0;
}

function linkShortenCallback(shortUrl, ignoreNoEmail) {
	debug(shortUrl);

	var aiList = gameController.getAiList();

	var messageText = "";

	if (playingOnlineGame()) {
		messageText += "<em>Opponent's turn</em><br />";
	}

	if (currentMoveIndex == 1 && !haveBothEmails()) {
		if (!playingOnlineGame() && (currentGameData.gameTypeId === 1 || !currentGameData.gameTypeId)) {
			if (!ignoreNoEmail && !haveUserEmail()) {
				messageText = getNoUserEmailMessage();
			} 
			else {
				// messageText += "Thank you for Hosting a game of Pai Sho! Share <a href=\"" + shortUrl + "\">this link</a> with your friends to invite them to join you in a game.";
				messageText += "<span class='skipBonus' onclick='loginClicked(); finalizeMove();'>Sign in</span> to play real-time games with others online. <br />";
			}
		}

		if (aiList.length > 0) {
			for (var i = 0; i < aiList.length; i++) {
				messageText += "<br /><span class='skipBonus' onclick='setAiIndex(" + i + ");'>Play " + aiList[i].getName() + "</span>";
			}
			if (aiList.length > 1) {
				messageText += "<br /><span class='skipBonus' onclick='goai();'>AI vs AI</span>";
			}
			messageText += "<br />";
		}
	} else if (haveBothEmails()) {
		// messageText = "Click <span class='skipBonus' onclick=sendMail('" + shortUrl + "')>here</span> to email your move to the " + getCurrentPlayer() + ". Or, share this <a href=\"" + shortUrl + "\">link</a> with them.";
		if (!metadata.tournamentName && !playingOnlineGame()) {
			messageText += "Or, copy and share this <a href=\"" + shortUrl + "\">link</a> with your opponent.";
		}
		if (!playingOnlineGame()) {
			showSubmitMoveForm(shortUrl);
		}
	} else if ((activeAi && getCurrentPlayer() === activeAi.player) || (activeAi2 && getCurrentPlayer() === activeAi2.player)) {
		//messageText += "<span class='skipBonus' onclick='playAiTurn();'>Submit move to AI</span>";
		messageText += "<em>THINKING...</em>";
	} else if (activeAi) {
		messageText += "Playing against the computer can help you learn how the game works. You should be able to beat the computer easily once you understand the game.<br /><br />Is playing against the computer too easy? Good! <a href='http://skudpaisho.com/?BYewzgLgvGDWCuATADgQwJZlAAQOYFsMAbAOgGMR8AyXVfAUygAYAJEgJQBoB1TgaU4AhKgDt6AdwDKyemXSoiAMSIhx9AE7t4RemCgjREgOKoIurTqgBPKupBlYYAKojxwevSKoARpZtgAEVNGACYmAEYAdgBaJhDYgBYgA'>Join the creator in a game</a> to play a real game or give feedback.";
	} 
	// else if (!playingOnlineGame()) {
	// 	messageText += "Copy this <a href=\"" + shortUrl + "\">link</a> and send to the " + getCurrentPlayer() + ".";
	// }

	if (gameController.theGame.getWinner()) {
		// There is a winner!
		messageText += "<br /><strong>" + gameController.theGame.getWinner() + gameController.theGame.getWinReason() + "</strong>";
		// Save winner
		if (playingOnlineGame()) {
			var winnerUsername;
			if (gameController.theGame.getWinner() === HOST) {
				winnerUsername = currentGameData.hostUsername;
			} else if (gameController.theGame.getWinner() === GUEST) {
				winnerUsername = currentGameData.guestUsername;
			}

			if (!winnerUsername) {
				// A tie.. special case
				onlinePlayEngine.updateGameWinInfoAsTie(gameId, gameController.theGame.getWinResultTypeCode(), getLoginToken(), emptyCallback);
			} else {
				onlinePlayEngine.updateGameWinInfo(gameId, winnerUsername, gameController.theGame.getWinResultTypeCode(), getLoginToken(), emptyCallback);
			}
		}
	} else {
		messageText += gameController.getAdditionalMessage() + getResetMoveText();
	}

	getGameMessageElement().innerHTML = messageText;

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
	return localStorage.getItem(userEmailKey);
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
	var bodyMessage = "I just made move #" + gameController.gameNotation.getLastMoveNumber() + " in a game of Pai Sho! Click here to open our game: " + url;
	
	bodyMessage += "[BR][BR]---- Full Details: ----[BR]Move: " + gameController.gameNotation.getLastMoveText() 
		+ "[BR][BR]Game Notation: [BR]" + gameController.gameNotation.getNotationForEmail();

	return bodyMessage;
}

function getCurrentPlayer() {
	return gameController.getCurrentPlayer();
}

function getCurrentPlayerForReal() {
	return gameController.getCurrentPlayer();
}

function getResetMoveText() {
	return "<br /><br /><span class='skipBonus' onclick='resetMove();'>Undo move</span>";
}

function showResetMoveMessage() {
	getGameMessageElement().innerHTML += getResetMoveText();
}

function resetMove() {
	gameController.resetMove();

	rerunAll();
	$('#contactform').addClass('gone');
}

function myTurn() {
	var userEmail = localStorage.getItem(localEmailKey);
	if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
		if (getCurrentPlayer() === HOST) {
			return !hostEmail 
				|| (localStorage.getItem(localEmailKey) === hostEmail 
					|| currentGameData.hostUsername.toLowerCase() === getUsername().toLowerCase());
		} else {
			return !guestEmail 
				|| (localStorage.getItem(localEmailKey) === guestEmail 
					|| currentGameData.guestUsername.toLowerCase() === getUsername().toLowerCase());
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

var createGameCallback = function createGameCallback(newGameId) {
	finalizeMove();
	lastKnownGameNotation = gameController.gameNotation.notationTextForUrl();

	// If a solitaire game, automatically join game.
	if (gameController.isSolitaire()) {
		completeJoinGameSeek({gameId:newGameId});
	}
	
	showModal("Game Created!", "You just created a game. Anyone can join it by clicking on Join Game. You can even join your own game if you'd like.<br /><br />If anyone joins this game, it will show up in your list of games when you click My Games.");
};

var submitMoveCallback = function submitMoveCallback() {
	debug("Inside submitMoveCallback");
	lastKnownGameNotation = gameController.gameNotation.notationTextForUrl();
	finalizeMove();

	startWatchingNumberOfGamesWhereUserTurn();

	onlinePlayEngine.notifyUser(currentGameOpponentUsername, emptyCallback);
};

function clearMessage() {
	if (!defaultHelpMessageText) {
		defaultHelpMessageText = gameController.getDefaultHelpMessageText();
	}
	document.getElementById("helpTextContent").innerHTML = defaultHelpMessageText;

	var message = getTournamentText() 
		+ document.getElementById("helpTextContent").innerHTML;

	if (gameController.getGameTypeId && gameController.getGameTypeId() === GameType.SkudPaiSho.id) {
		message += getAltTilesOptionText();
	}

	document.getElementById("helpTextContent").innerHTML = message;
}

function haveUserEmail() {
	var userEmail = localStorage.getItem(localEmailKey);
	return userEmail && userEmail.includes("@") && userEmail.includes(".");
}

function unplayedTileClicked(tileDiv) {
	gameController.unplayedTileClicked(tileDiv);
}

function pointClicked(htmlPoint) {
	gameController.pointClicked(htmlPoint);
}

function displayReturnedMessage(messageReturned) {
	var heading = messageReturned.heading;
	var message = messageReturned.message;
	if (heading) {
		if (message.length > 1) {
			setMessage(toHeading(heading) + toBullets(message));
		} else {
			setMessage(toHeading(heading) + toMessage(message));
		}
	} else {
		if (message.length > 1) {
			setMessage(toBullets(message));
		} else {
			setMessage(toMessage(message));
		}
	}
}

function showTileMessage(tileDiv) {
	var messageReturned = gameController.getTileMessage(tileDiv);
	displayReturnedMessage(messageReturned);
}

function showPointMessage(htmlPoint) {
	var messageReturned = gameController.getPointMessage(htmlPoint);
	if (messageReturned) {
		displayReturnedMessage(messageReturned);
	}
}

function setMessage(msg) {
	if (msg === document.getElementById("helpTextContent").innerHTML) {
		clearMessage();
	} else {
		document.getElementById("helpTextContent").innerHTML = getTournamentText() + msg;
	}
}

function getAltTilesOptionText() {
	return "<p><span class='skipBonus' onclick='toggleTileDesigns();'>Click here</span> to switch between standard and modern tile designs for Skud Pai Sho.</p>";
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

	if (paragraphs.length === 1) {
		return paragraphs[0];
	} else if (paragraphs.length > 1) {
		paragraphs.forEach(function(str) {
			message += "<p>" + str + "</p>";
		});
	}

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

function sandboxitize() {
	var notation = notation = getGameControllerForGameType(currentGameData.gameTypeId).gameNotation;
	for (var i = 0; i < currentMoveIndex; i++) {
		notation.addMove(gameController.gameNotation.moves[i]);
	}

	setGameController(currentGameData.gameTypeId);

	if (userIsLoggedIn()) {
		currentGameData.hostUsername = getUsername();
		currentGameData.guestUsername = getUsername();
	}

	gameController.setGameNotation(notation.notationTextForUrl());
	rerunAll();
	showReplayControls();
}

function getLink(forSandbox) {
	var notation = new SkudPaiShoGameNotation();
	if (currentGameData) {
		notation = getGameControllerForGameType(currentGameData.gameTypeId).gameNotation;
	}	
	for (var i = 0; i < currentMoveIndex; i++) {
		notation.addMove(gameController.gameNotation.moves[i]);
	}

	var linkUrl = "";

	if (currentGameData && currentGameData.gameTypeId) {
		linkUrl += "gameType=" + currentGameData.gameTypeId + "&";
	}

	if (forSandbox && getUserEmail()) {
		linkUrl += "host=" + getUserEmail() + "&";
		linkUrl += "guest=" + getUserEmail() + "&";
	}

	linkUrl += "game=" + notation.notationTextForUrl();
	
	linkUrl = LZString.compressToEncodedURIComponent(linkUrl);

	linkUrl = sandboxUrl + "?" + linkUrl;

	console.log(linkUrl);
	return linkUrl;
}

function setAiIndex(i) {
	// Leave online game if needed
	if (playingOnlineGame()) {
		forgetCurrentGameInfo();
	}

	var aiList = gameController.getAiList();

	if (activeAi) {
		activeAi2 = aiList[i];
		activeAi2.setPlayer(getCurrentPlayer());
	} else {
		activeAi = aiList[i];
		activeAi.setPlayer(getCurrentPlayer());
	}
	gameController.startAiGame(finalizeMove);
}

function playAiTurn() {
	gameController.playAiTurn(finalizeMove);
}

function sandboxFromMove() {
	// var link = getLink(true);
	// openLink(link);
	sandboxitize();
}

function openLink(linkUrl) {
	if (ios) {
		webkit.messageHandlers.callbackHandler.postMessage(
            '{"linkUrl":"' + linkUrl + '"}'
        );
	} else {
		window.open(linkUrl);
	}
}

/* Modal */
function showModal(headingHTMLText, modalMessageHTMLText) {
	// Make sure sidenav is closed
	closeNav();

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

function closeModal() {
	document.getElementById('myMainModal').style.display = "none";
}

function callSubmitMove() {
	onlinePlayEngine.submitMove(gameId, encodeURIComponent(gameController.gameNotation.notationTextForUrl()), getLoginToken(), submitMoveCallback);
}

var sendVerificationCodeCallback = function sendVerificationCodeCallback(response) {
	var message;
	if (response.includes('has been sent')) {
        message = "Verification code sent to " + emailBeingVerified;
    } else {
        message = "Failed to send verification code, please try again.";
    }
	document.getElementById('verificationCodeSendResponse').innerHTML = message;
}

var isUserInfoAvailableCallback = function isUserInfoAvailableCallback(data) {
	if (data && data.length > 0) {
		// user info not available
		alert("Username or email taken.");
	} else {
		debug("Checkpoint");
		document.getElementById("verificationCodeInput").disabled=false;
		document.getElementById('verificationCodeSendResponse').innerHTML = "Sending code... <i class='fa fa-circle-o-notch fa-spin fa-fw'></i>";
		onlinePlayEngine.sendVerificationCode(usernameBeingVerified, emailBeingVerified, sendVerificationCodeCallback);
	}
};

var userInfoExistsCallback = function userInfoExistsCallback(data) {
	debug('WHOA MAN THIS IS SERIOUS ' + data);
	if (data && parseInt(data.trim()) > 0) {
		debug("Checkpoint");
		// existing userId found
		tempUserId = data.trim();
		isUserInfoAvailableCallback();	// will trigger send verification code
	} else {
		// userInfo entered was not exact match. Is it available?
		onlinePlayEngine.isUserInfoAvailable(usernameBeingVerified, emailBeingVerified, isUserInfoAvailableCallback);
	}
}

function sendVerificationCodeClicked() {
	emailBeingVerified = document.getElementById("userEmailInput").value.trim().toLowerCase();
	usernameBeingVerified = document.getElementById("usernameInput").value.trim();

	// Only continue if email and username pass validation
	if (emailBeingVerified.includes("@") && emailBeingVerified.includes(".")
		&& usernameBeingVerified.match(/^([A-Za-z0-9_])+$/g)) {
		onlinePlayEngine.userInfoExists(usernameBeingVerified, emailBeingVerified, userInfoExistsCallback);
	} else {
		alert("Need valid username and email.");
	}
}

function verifyCodeClicked() {
	if (usernameBeingVerified && usernameBeingVerified.trim() != ""
		&& emailBeingVerified && emailBeingVerified.trim() != "") {

		codeToVerify = document.getElementById("verificationCodeInput").value;
		if (codeToVerify && codeToVerify.trim() != "") {
			onlinePlayEngine.getVerificationCode(verifyCodeCallback);
		}
	}
}

var createDeviceIdCallback = function createDeviceIdCallback(generatedDeviceId) {
	closeModal();

	localStorage.setItem(deviceIdKey, parseInt(generatedDeviceId));
	localStorage.setItem(userIdKey, parseInt(tempUserId));
	localStorage.setItem(usernameKey, usernameBeingVerified);
	localStorage.setItem(userEmailKey, emailBeingVerified);

	localStorage.setItem(localEmailKey, emailBeingVerified); // Old field..

	if (localPlayerRole === HOST) {
		hostEmail = emailBeingVerified;
	} else if (localPlayerRole === GUEST) {
		guestEmail = emailBeingVerified;
	}

	emailBeingVerified = "";
	usernameBeingVerified = "";
	tempUserId = null;
	codeToVerify = 0;

	updateFooter();
	clearMessage();

	setAccountHeaderLinkText();

	initialVerifyLogin();

	showModal("<i class='fa fa-check' aria-hidden='true'></i> Email Verified", "Hi, " + getUsername() + "! Your email has been successfully verified and you are now signed in.");
}

var createUserCallback = function createUserCallback(generatedUserId) {
	tempUserId = generatedUserId;

	onlinePlayEngine.createDeviceIdForUser(tempUserId, createDeviceIdCallback);
}

// TODO actualCode should be result...
var verifyCodeCallback = function verifyCodeCallback(actualCode) {
	if (codeToVerify === actualCode) {
		if (tempUserId && tempUserId > 0) {
			createUserCallback(tempUserId);
		} else {
			onlinePlayEngine.createUser(usernameBeingVerified, emailBeingVerified, createUserCallback);
		}
	} else {
		closeModal();
		emailBeingVerified = "";
		usernameBeingVerified = "";
		tempUserId = null;
		codeToVerify = 0;
		showModal("Validation Failed", "Validation failed. Please try again.");
	}
};

function getUserId() {
	return localStorage.getItem(userIdKey);
}

function getUsername() {
	return localStorage.getItem(usernameKey);
}

function getDeviceId() {
	return localStorage.getItem(deviceIdKey);
}

function userIsLoggedIn() {
	return getUserId() 
		&& getUsername() 
		&& getUserEmail() 
		&& getDeviceId();
}

function forgetCurrentGameInfo() {
	if (gameWatchIntervalValue) {
		clearInterval(gameWatchIntervalValue);
		gameWatchIntervalValue = null;
	}

	gameId = -1;
	lastKnownGameNotation = "";
	if (gameWatchIntervalValue) {
		clearInterval(gameWatchIntervalValue);
		gameWatchIntervalValue = null;
	}
	currentGameOpponentUsername = null;
	currentGameData = new Object();
	currentMoveIndex = 0;
	pauseRun();

	// Change user to host
	hostEmail = getUserEmail();
	guestEmail = null;

	updateFooter();

	document.getElementById('chatMessagesDisplay').innerHTML = "";
	
	updateCurrentGameTitle();
}

var GameType = {
	SkudPaiSho:{id:1, desc:"Skud Pai Sho", rulesUrl:"https://skudpaisho.wordpress.com/skud-quick-reference/"}, 
	VagabondPaiSho:{id:2, desc:"Vagabond Pai Sho", rulesUrl:"https://skudpaisho.wordpress.com/vagabond-pai-sho/"}, 
	SolitairePaiSho:{id:4, desc:"Solitaire Pai Sho", rulesUrl:"https://skudpaisho.wordpress.com/more/solitaire-pai-sho/"}, 
	CapturePaiSho:{id:3, desc:"Capture Pai Sho", rulesUrl:"https://skudpaisho.wordpress.com/more/capture-pai-sho/"}
};
function getGameControllerForGameType(gameTypeId) {
	var controller;

	switch(gameTypeId) {
	    case GameType.SkudPaiSho.id:
	        controller = new SkudPaiShoController();
	        debug("You're playing Skud Pai Sho!");
	        break;
	    case GameType.VagabondPaiSho.id:
	        controller = new VagabondController();
	        debug("You're playing Vagabond Pai Sho!");
	        break;
	    case GameType.SolitairePaiSho.id:
	        controller = new SolitaireController();
	        debug("You're playing Solitaire Pai Sho!");
	        break;
	    case GameType.CapturePaiSho.id:
	    	controller = new CaptureController();
	    	debug("You're playing Capture Pai Sho!");
	    	break;
	    default:
	        debug("Defaulting to use Skud Pai Sho.");
	        controller = new SkudPaiShoController();
	}

	return controller;
}
function setGameController(gameTypeId) {
	// Previous game controller cleanup
	if (gameController) {
		gameController.cleanup();
	}

	// Forget current game info
	forgetCurrentGameInfo();

	closeModal();
	
	gameController = getGameControllerForGameType(gameTypeId);
	if (gameController.completeSetup) {
		gameController.completeSetup();
	}

	// New game stuff:
	currentGameData.gameTypeId = gameTypeId;
	defaultHelpMessageText = null;
	clearMessage();
	refreshMessage();
}

var jumpToGameCallback = function jumpToGameCallback(results) {
			if (results) {
				populateMyGamesList(results);

				var myGame = myGamesList[0];

				setGameController(myGame.gameTypeId);

				// Is user even playing this game? This could be used to "watch" games
				var userIsPlaying = myGame.hostUsername === getUsername() 
					|| myGame.guestUsername === getUsername();

				gameId = myGame.gameId;
				currentGameOpponentUsername = null;
				var opponentUsername;

				if (userIsPlaying) {
					if (myGame.hostUsername === getUsername()) {
						opponentUsername = myGame.guestUsername;
					} else {
						opponentUsername = myGame.hostUsername;
					}

					currentGameOpponentUsername = opponentUsername;
				}

				currentGameData.hostUsername = myGame.hostUsername;
				currentGameData.guestUsername = myGame.guestUsername;

				hostEmail = myGame.hostUsername;
				guestEmail = myGame.guestUsername;
				
				startWatchingGameRealTime();
				closeModal();
				updateFooter();
			}
		};

function jumpToGame(gameIdChosen) {
	if (!onlinePlayEnabled) {
		return;
	}
	onlinePlayEngine.getGameInfo(getUserId(), gameIdChosen, jumpToGameCallback);
}

function populateMyGamesList(results) {
	var resultRows = results.split('\n');
	myGamesList = [];
	for (var index in resultRows) {
		var row = resultRows[index].split('|||');
		var myGame = {
			gameId:parseInt(row[0]), 
			gameTypeId:parseInt(row[1]), 
			gameTypeDesc:row[2], 
			hostUsername:row[3], 
			hostOnline:parseInt(row[4]), 
			guestUsername:row[5], 
			guestOnline:parseInt(row[6]), 
			isUserTurn:parseInt(row[7])
		};
		myGamesList.push(myGame);
	}
}

function getLoginToken() {
	// debug("Using login token");
	return {
		userId: getUserId(), 
		username: getUsername(), 
		userEmail: getUserEmail(), 
		deviceId: getDeviceId()
	}
}

var showPastGamesCallback = function showPastGamesCallback(results) {
			var message = "No completed games.";
			if (results) {
				message = "";
				
				populateMyGamesList(results);

				var gameTypeHeading = "";
				for (var index in myGamesList) {
					var myGame = myGamesList[index];

					if (myGame.gameTypeDesc !== gameTypeHeading) {
						if (gameTypeHeading !== "") {
							message += "<br />";
						}
						gameTypeHeading = myGame.gameTypeDesc;
						message += "<div class='modalContentHeading'>" + gameTypeHeading + "</div>";
					}

					var gId = parseInt(myGame.gameId);
					var userIsHost = myGame.hostUsername === getUsername();
					var opponentUsername = userIsHost ? myGame.guestUsername : myGame.hostUsername;

					var gameDisplayTitle = myGame.hostUsername;
					gameDisplayTitle += " vs. ";
					gameDisplayTitle += myGame.guestUsername;
					
					message += "<div class='clickableText' onclick='jumpToGame(" + gId + ");'>" + gameDisplayTitle + "</div>";
				}
			}
			showModal("Completed Games", message);
		};

function showPastGamesClicked() {
	closeModal();

	onlinePlayEngine.getPastGamesForUserNew(getLoginToken(), showPastGamesCallback);
}

var showMyGamesCallback = function showMyGamesCallback(results) {
	var message = "No active games.";
	if (results) {
		message = "";
		
		populateMyGamesList(results);

		var gameTypeHeading = "";
		for (var index in myGamesList) {
			var myGame = myGamesList[index];

			if (myGame.gameTypeDesc !== gameTypeHeading) {
				if (gameTypeHeading !== "") {
					message += "<br />";
				}
				gameTypeHeading = myGame.gameTypeDesc;
				message += "<div class='modalContentHeading'>" + gameTypeHeading + "</div>";
			}

			var gId = parseInt(myGame.gameId);
			var userIsHost = myGame.hostUsername === getUsername();
			var opponentUsername = userIsHost ? myGame.guestUsername : myGame.hostUsername;

			var gameDisplayTitle = "";

			if (!userIsHost && opponentUsername != getUsername()) {
				if (myGame.hostOnline) {
					gameDisplayTitle += userOnlineIcon;
				} else {
					gameDisplayTitle += userOfflineIcon;
				}
			}
			gameDisplayTitle += myGame.hostUsername;
			gameDisplayTitle += " vs. ";
			if (userIsHost && opponentUsername != getUsername()) {
				if (myGame.guestOnline) {
					gameDisplayTitle += userOnlineIcon;
				} else {
					gameDisplayTitle += userOfflineIcon;
				}
			}
			gameDisplayTitle += myGame.guestUsername;
			if (myGame.isUserTurn) {
				gameDisplayTitle += " (Your turn)";
			}
			
			// message += "<div class='clickableText' onclick='jumpToGame(" + gId + "," + userIsHost + ",\"" + opponentUsername + "\"," + myGame.gameTypeId + ");'>" + gameDisplayTitle + "</div>";
			message += "<div class='clickableText' onclick='jumpToGame(" + gId + ");'>" + gameDisplayTitle + "</div>";
		}
	}
	message += "<br /><br /><div class='clickableText' onclick='showPastGamesClicked();'>Show completed games</div>";
	message += "<br /><br /><div>You are currently signed in as " + getUsername() + ". <span class='skipBonus' onclick='showSignOutModal();'>Click here to sign out.</span></div>";
	message += "<br /><div><span class='skipBonus' onclick='showAccountSettings();'>Account Settings</span></div><br />";
	showModal("Active Games", message);
};

function showMyGames() {
	onlinePlayEngine.getCurrentGamesForUserNew(getLoginToken(), showMyGamesCallback);
}

var emptyCallback = function emptyCallback(results) {
	// Nothing to do
};

function emailNotificationsCheckboxClicked() {
	var value = 'N';
	if (document.getElementById("emailNotificationsCheckbox").checked) {
		value = 'Y';
	}
	onlinePlayEngine.updateEmailNotificationsSetting(getUserId(), value, emptyCallback);
}

var getEmailNotificationsSettingCallback = function getEmailNotificationsSettingCallback(result) {
	document.getElementById("emailNotificationsCheckbox").checked = (result && result.startsWith("Y"));
};

function showAccountSettings() {
	var message = "Note: Email notifications are not working right now. Maybe in the future they will be back.<br />";

	message += "<div><input id='emailNotificationsCheckbox' type='checkbox' onclick='emailNotificationsCheckboxClicked();'>Email Notifications</div>";

	showModal("Settings", message);

	onlinePlayEngine.getEmailNotificationsSetting(getUserId(), getEmailNotificationsSettingCallback);
}

function accountHeaderClicked() {
	if (userIsLoggedIn() && onlinePlayEnabled) {
		showMyGames();
	} else {
		loginClicked();
	}
}

function loginClicked() {
	var msg = document.getElementById('loginModalContentContainer').innerHTML;

	if (userIsLoggedIn()) {
		msg += "<div><br /><br />You are currently signed in as " + getUsername() + "</div>";
	}
	
	showModal("Sign In", msg);
}

var completeJoinGameSeekCallback = function completeJoinGameSeekCallback(gameJoined) {
	var gameSeek = selectedGameSeek;
	if (gameJoined) {
		jumpToGame(gameSeek.gameId);
	}
};

function completeJoinGameSeek(gameSeek) {
	selectedGameSeek = gameSeek;
	onlinePlayEngine.joinGameSeek(gameSeek.gameId, getLoginToken(), completeJoinGameSeekCallback);
}

var getCurrentGamesForUserNewCallback = function getCurrentGamesForUserNewCallback(results) {
	var gameSeek = selectedGameSeek;
	if (results) {
		
		populateMyGamesList(results);

		var gameExistsWithOpponent = false;

		for (var index in myGamesList) {
			var myGame = myGamesList[index];

			var userIsHost = myGame.hostUsername === getUsername();
			var opponentUsername = userIsHost ? myGame.guestUsername : myGame.hostUsername;

			if (opponentUsername === gameSeek.hostUsername
				&& gameSeek.gameTypeId === myGame.gameTypeId) {
				gameExistsWithOpponent = true;
			}
		}

		if (gameExistsWithOpponent) {
			closeModal();
			showModal("Cannot Join Game", "You are already playing a game against that user, so you will have to finish that game first.");
		} else {
			completeJoinGameSeek(gameSeek);
		}
	} else {
		// No results, means ok to join game
		completeJoinGameSeek(gameSeek);
	}
};

var selectedGameSeek;

function acceptGameSeekClicked(gameIdChosen) {
	var gameSeek;
	for (var index in gameSeekList) {
		if (gameSeekList[index].gameId === gameIdChosen) {
			gameSeek = gameSeekList[index];
		}
	}

	if (gameSeek) {
		selectedGameSeek = gameSeek;
		onlinePlayEngine.getCurrentGamesForUserNew(getLoginToken(), getCurrentGamesForUserNewCallback);
	}
}

function tryRealTimeClicked() {
	onlinePlayEnabled = true;
	setAccountHeaderLinkText();
	initialVerifyLogin();
	rerunAll();
	closeModal();
}

var getGameSeeksCallback = function getGameSeeksCallback(results) {
	var message = "No games available to join. You should start one!";
	if (results) {
		message = "";
		var resultRows = results.split('\n');

		gameSeekList = [];

		for (var index in resultRows) {
			var row = resultRows[index].split('|||');
			var gameSeek = {
				gameId:parseInt(row[0]), 
				gameTypeId:parseInt(row[1]), 
				gameTypeDesc:row[2], 
				hostId:row[3], 
				hostUsername:row[4], 
				hostOnline:parseInt(row[5])
			};
			gameSeekList.push(gameSeek);
		}
		var gameTypeHeading = "";
		for (var index in gameSeekList) {
			var gameSeek = gameSeekList[index];
			
			var hostOnlineOrNotIconText = userOfflineIcon;
			if (gameSeek.hostOnline) {
				hostOnlineOrNotIconText = userOnlineIcon;
			}

			if (gameSeek.gameTypeDesc !== gameTypeHeading) {
				if (gameTypeHeading !== "") {
					message += "<br />";
				}
				gameTypeHeading = gameSeek.gameTypeDesc;
				message += "<div class='modalContentHeading'>" + gameTypeHeading + "</div>";
			}
			message += "<div class='clickableText' onclick='acceptGameSeekClicked(" + parseInt(gameSeek.gameId) + ");'>Host: " + hostOnlineOrNotIconText + gameSeek.hostUsername + "</div>";
		}
	}
	showModal("Join a game", message);
};

function viewGameSeeksClicked() {
	if (onlinePlayEnabled && userIsLoggedIn()) {
		onlinePlayEngine.getGameSeeks(getGameSeeksCallback);
	} else if (onlinePlayEnabled) {
		showModal("Join a game", "<span class='skipBonus' onclick='loginClicked();'>Sign in</span> to play real-time games with others online. When you are signed in, this is where you can join games against other players.");
	} else {
		showModal("Join a game", "Online play is disabled right now. Maybe you are offline. Try again later!");
	}
}

var getCurrentGameSeeksHostedByUserCallback = function getCurrentGameSeeksHostedByUserCallback(results) {
	var gameTypeId = tempGameTypeId;
	if (!results) {
		onlinePlayEngine.createGame(gameTypeId, gameController.gameNotation.notationTextForUrl(), getLoginToken(), createGameCallback);
	} else {
		finalizeMove();
		showModal("Game Not Created", "You either already have a game that is waiting for an opponent or are not logged in. <br /><br />If you're not logged in, you can still play the game locally, but it will not be saved online.");
	}
};

var tempGameTypeId;
function createGameIfThatIsOk(gameTypeId) {
	tempGameTypeId = gameTypeId;
	if (userIsLoggedIn()) {
		onlinePlayEngine.getCurrentGameSeeksHostedByUser(getUserId(), gameTypeId, getCurrentGameSeeksHostedByUserCallback);
	} else {
		finalizeMove();
	}
}

function handleNewGlobalChatMessages(results) {
	var resultRows = results.split('\n');

	chatMessageList = [];
	var newChatMessagesHtml = "";

	// var actuallyLoadMessages = true;

	// if (lastGlobalChatTimestamp === '1970-01-01 00:00:00') {
	// 	// just loading timestamp of latest message...
	// 	actuallyLoadMessages = false;
	// }

	// // So actuallyLoadMessages only turns false once...
	// lastGlobalChatTimestamp = '1970-01-02 00:00:00';

	for (var index in resultRows) {
		var row = resultRows[index].split('|||');
		var chatMessage = {
			timestamp:row[0], 
			username:row[1], 
			message:row[2]
		};
		chatMessageList.push(chatMessage);
		lastGlobalChatTimestamp = chatMessage.timestamp;
	}

	// if (actuallyLoadMessages) {

		for (var index in chatMessageList) {
			var chatMessage = chatMessageList[index];
			newChatMessagesHtml += "<div class='chatMessage'><strong>" + chatMessage.username + ":</strong> " + chatMessage.message.replace(/&amp;/g,'&') + "</div>";
		}
		
		/* Prepare to add chat content and keep scrolled to bottom */
		var chatMessagesDisplay = document.getElementById('globalChatMessagesDisplay');
		// allow 1px inaccuracy by adding 1
		var isScrolledToBottom = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight <= chatMessagesDisplay.scrollTop + 1;
		var newElement = document.createElement("div");
		newElement.innerHTML = newChatMessagesHtml;
		chatMessagesDisplay.appendChild(newElement);
		// scroll to bottom if isScrolledToBottom
		if(isScrolledToBottom) {
			chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight;
		}
	// }
}

var getNewGlobalChatsCallback = function getNewGlobalChatsCallback(results) {
	if (results != "") {
		handleNewGlobalChatMessages(results);
	}
};

var lastGlobalChatTimestamp = '1970-01-01 00:00:00';
function fetchGlobalChats() {
	onlinePlayEngine.getNewChatMessages(0, lastGlobalChatTimestamp, getNewGlobalChatsCallback);
}

var getInitialGlobalChatsCallback = function getInitialGlobalChatsCallback(results) {
	if (results != "") {
		handleNewGlobalChatMessages(results);
	}
};

function fetchInitialGlobalChats() {
	// Clear all global chats..
	document.getElementById('globalChatMessagesDisplay').innerHTML = "<strong>SkudPaiSho: </strong> Hi everybody! This global chat will show the latest messages sent to it. Say hi and see if anyone else is online :)<hr />";

	// Fetch global chats..
	onlinePlayEngine.getInitialGlobalChatMessages(getInitialGlobalChatsCallback);
}

function startLoggingOnlineStatus() {
	onlinePlayEngine.logOnlineStatus(getLoginToken(), emptyCallback);

	fetchInitialGlobalChats();

	if (logOnlineStatusIntervalValue) {
		clearInterval(logOnlineStatusIntervalValue);
		logOnlineStatusIntervalValue = null;
	}

	logOnlineStatusIntervalValue = setInterval(function() {
		onlinePlayEngine.logOnlineStatus(getLoginToken(), emptyCallback);
		verifyLogin(); // TODO Build in the verify step to the logOnlineStatus call
		fetchGlobalChats();
	}, 5000);
}

function setSidenavNewGameSection() {
	var message = getSidenavNewGameEntryForGameType(GameType.SkudPaiSho);
	message += getSidenavNewGameEntryForGameType(GameType.VagabondPaiSho);
	message += getSidenavNewGameEntryForGameType(GameType.SolitairePaiSho);
	message += getSidenavNewGameEntryForGameType(GameType.CapturePaiSho);

	document.getElementById("sidenavNewGameSection").innerHTML = message;
}

function closeGame() {
	setGameController(GameType.SkudPaiSho.id);
}

function getSidenavNewGameEntryForGameType(gameType) {
	// <div class='sidenavOption skipBonus' onclick='sandboxFromMove();'>Sandbox this game</div>
	return "<div class='sidenavEntry'><span class='sidenavLink skipBonus' onclick='setGameController(" + gameType.id + ");'>" + gameType.desc + "</span><span>&nbsp;-&nbsp;<i class='fa fa-book' aria-hidden='true'></i>&nbsp;</span><a href='" + gameType.rulesUrl + "' target='_blank' class='newGameRulesLink sidenavLink'>Rules</a></div>";
}

function getNewGameEntryForGameType(gameType) {
	return "<div class='newGameEntry'><span class='clickableText' onclick='setGameController(" + gameType.id + ");'>" + gameType.desc + "</span><span>&nbsp;-&nbsp;<i class='fa fa-book' aria-hidden='true'></i>&nbsp;</span><a href='" + gameType.rulesUrl + "' target='_blank' class='newGameRulesLink'>Rules</a></div>";
}

function newGameClicked() {
	var message = getNewGameEntryForGameType(GameType.SkudPaiSho);
	message += getNewGameEntryForGameType(GameType.VagabondPaiSho);
	message += getNewGameEntryForGameType(GameType.SolitairePaiSho);
	message += getNewGameEntryForGameType(GameType.CapturePaiSho);

	showModal("New Game", message);
}

var getCountOfGamesWhereUserTurnCallback = function getCountOfGamesWhereUserTurnCallback(count) {
	setAccountHeaderLinkText(count);
};

function loadNumberOfGamesWhereUserTurn() {
	if (onlinePlayEnabled && userIsLoggedIn()) {
		onlinePlayEngine.getCountOfGamesWhereUserTurn(getUserId(), getCountOfGamesWhereUserTurnCallback);
	}
}

function startWatchingNumberOfGamesWhereUserTurn() {
	loadNumberOfGamesWhereUserTurn();

	if (userTurnCountInterval) {
		clearInterval(userTurnCountInterval);
		userTurnCountInterval = null;
	}

	userTurnCountInterval = setInterval(function() {
		loadNumberOfGamesWhereUserTurn();
	}, 6000);
}

/* Chat */

var sendChatCallback = function sendChatCallback(result) {
	document.getElementById('sendChatMessageButton').innerHTML = "Send";
	document.getElementById('chatMessageInput').value = "";
};

var sendChat = function() {
	var chatMessage = htmlEscape(document.getElementById('chatMessageInput').value).trim();
	if (chatMessage) {
		document.getElementById('sendChatMessageButton').innerHTML = "<i class='fa fa-circle-o-notch fa-spin fa-fw'>";
		onlinePlayEngine.sendChat(gameId, getLoginToken(), chatMessage, sendChatCallback);
	}
}

document.getElementById('chatMessageInput').onkeypress = function(e){
     var code = (e.keyCode ? e.keyCode : e.which);
      if(code == 13) {
        sendChat();
      }
};

var sendGlobalChatCallback = function sendGlobalChatCallback(result) {
	document.getElementById('sendGlobalChatMessageButton').innerHTML = "Send";
	document.getElementById('globalChatMessageInput').value = "";
};

var sendGlobalChat = function() {
	var chatMessage = htmlEscape(document.getElementById('globalChatMessageInput').value).trim();
	if (chatMessage) {
		document.getElementById('sendGlobalChatMessageButton').innerHTML = "<i class='fa fa-circle-o-notch fa-spin fa-fw'>";
		onlinePlayEngine.sendChat(0, getLoginToken(), chatMessage, sendGlobalChatCallback);
	}
}

document.getElementById('globalChatMessageInput').onkeypress = function(e){
     var code = (e.keyCode ? e.keyCode : e.which);
      if(code == 13) {
        sendGlobalChat();
      }
};

function htmlEscape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function openTab(evt, tabIdName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabIdName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

function showGameNotationModal() {
	var message = "";

	message += "<div class='coordinatesNotation'>";
	message += gameController.gameNotation.getNotationForEmail().replace(/\[BR\]/g,'<br />');
	message += "</div><br />";

	showModal("Game Notation", message);
}

function showGameReplayLink() {
	if (currentGameData.hostUsername && currentGameData.guestUsername) {
		var notation = getGameControllerForGameType(currentGameData.gameTypeId).gameNotation;
		for (var i = 0; i < currentMoveIndex; i++) {
			notation.addMove(gameController.gameNotation.moves[i]);
		}
		rerunAll();

		var linkUrl = "";
		
		if (currentGameData && currentGameData.gameTypeId) {
			linkUrl += "gameType=" + currentGameData.gameTypeId + "&";
		}
		linkUrl += "host=" + currentGameData.hostUsername + "&";
		linkUrl += "guest=" + currentGameData.guestUsername + "&";

		linkUrl += "game=" + notation.notationTextForUrl();
		
		linkUrl = LZString.compressToEncodedURIComponent(linkUrl);

		linkUrl = sandboxUrl + "?" + linkUrl;

		debug("GameReplayLinkUrl: " + linkUrl);
		var message = "Here is the <a href=\"" + linkUrl + "\" target='_blank'>game replay link</a> to the current point in the game.";
		showModal("Game Replay Link", message);
	} else {
		showModal("About Game Replay", "Click this link when viewing an online game to get a sharable game replay link.");
	}
}

function openGameReplay() {
	if (currentGameData.hostUsername && currentGameData.guestUsername) {
		var notation = getGameControllerForGameType(currentGameData.gameTypeId).gameNotation;
		for (var i = 0; i < currentMoveIndex; i++) {
			notation.addMove(gameController.gameNotation.moves[i]);
		}
		rerunAll();

		var linkUrl = "";
		
		if (currentGameData && currentGameData.gameTypeId) {
			linkUrl += "gameType=" + currentGameData.gameTypeId + "&";
		}
		linkUrl += "host=" + currentGameData.hostUsername + "&";
		linkUrl += "guest=" + currentGameData.guestUsername + "&";

		linkUrl += "game=" + notation.notationTextForUrl();
		
		linkUrl = LZString.compressToEncodedURIComponent(linkUrl);

		linkUrl = sandboxUrl + "?" + linkUrl;

		debug(linkUrl);
		openLink(linkUrl);
	} else {
		showModal("About Game Replay", "Click this link when viewing an online game to open a sharable game replay link in a new window.");
	}
}

function showPrivacyPolicy() {
	var message = "";
	message += "<ul>";
	message += "<li>All online games (and associated chat conversations) are recorded and may be available to view by others.</li>";
	message += "<li>Usernames will be shown publicly to other players and anyone viewing game replays.</li>";
	message += "<li>Email addresses will never be purposefully shared with other players.</li>";
	message += "</ul>";
	showModal("Privacy Policy", message);
}

function dismissChatAlert() {
	document.getElementById('chatTab').classList.remove('alertTab');
}

function goai() {
	if (gameController.getAiList().length > 1) {
		setAiIndex(0);
		setAiIndex(1);
	}
}

/* Sidenav */
function openNav() {
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target !== document.getElementById("mySidenav")
	    	&& event.target !== document.getElementById("sidenavMenuButton")
	    	&& event.target !== document.getElementById("siteHeading")) {
	        closeNav();
	    }
	};
    // document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav").classList.add("sideNavOpen");
}

function closeNav() {
    // document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySidenav").classList.remove("sideNavOpen");
}

function aboutClicked() {
	var message = "<div><em>The Garden Gate</em> is a place to play various fan-made <em>Pai Sho</em> games created by Avatar: The Last Airbender fans who are inspired by the very idea of <em>Pai Sho</em>. A Pai Sho game is a game played on a board for the fictional game of Pai Sho as seen in Avatar: The Last Airbender.</div>";
	// var message = "<div><em>Skud Pai Sho</em> is a place to play various fan-made <em>Pai Sho</em> games created by Avatar: The Last Airbender fans who are inspired by the very idea of <em>Pai Sho</em>. A Pai Sho game is a game played on a board for the fictional game of Pai Sho as seen in Avatar: The Last Airbender.</div>";
	message += "<hr /><div> Modern tile designs by Hector Lowe<br /> ©2017 | Used with permission<br /> <a href='http://hector-lowe.com/' target='_blank'>www.hector-lowe.com</a> </div> <div class='license'><a rel='license' href='http://creativecommons.org/licenses/by-nc/3.0/us/'><img alt='Creative Commons License' style='border-width:0' src='https://i.creativecommons.org/l/by-nc/3.0/us/88x31.png' /></a>&nbsp;All other content of this work is licensed under a <a rel='license' href='http://creativecommons.org/licenses/by-nc/3.0/us/'>Creative Commons Attribution-NonCommercial 3.0 United States License</a>.</div> <br /> <div><span class='skipBonus' onclick='showPrivacyPolicy();'>Privacy policy</span></div>";
	showModal("About", message);
}

function resignGameClicked() {
	var message = "";
	if (playingOnlineGame()) {
		message = "<div>Are you sure you want to resign this game?</div>";
		message += "<br /><div class='clickableText' onclick='closeModal(); resignGame();'>Yes - resign game</div>";
		message += "<br /><div class='clickableText' onclick='closeModal();'>No - cancel</div>";
	} else {
		message = "When playing an online game, this is where you can resign or leave a game if you wish to do so.";
	}
	
	showModal("Resign Game", message);
}

function resignGameCallback() {
	if (gameController) {
		setGameController(gameController.gameTypeId);
	} else {
		setGameController(GameType.SkudPaiSho.id);
	}
}

function resignGame() {
	// TODO eventually make it so if guest never made a move, then player only "leaves" game instead of updating the game result, so it returns to being an available game seek.
	if (gameController.guestNeverMoved && gameController.guestNeverMoved()) {
		// Guest never moved, only leave game. TODO
	}// else {....}

	onlinePlayEngine.updateGameWinInfo(gameId, getOpponentPlayerEmail(), 8, getLoginToken(), resignGameCallback);
}

function showWelcomeTutorial() {
	showModal("The Garden Gate", "<div id='tutorialContent'></div>");
	runTutorial();
}

function runTutorial() {
	// 
}


