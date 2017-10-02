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
var replayIntervalLength = 800;

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

	setGameController(GameType.SkudPaiSho.id);

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

	if (url.startsWith("file")) {
		onlinePlayEnabled = false;
	}

	// gameController.gameNotation.setNotationText(QueryString.game);
	gameController.setGameNotation(QueryString.game);

	hostEmail = QueryString.host;
	guestEmail = QueryString.guest;

	if (gameController.gameNotation.moves.length > 1) {
		document.getElementById("replayControls").classList.remove("gone");
	}

	onlinePlayEngine = new OnlinePlayEngine();

	defaultEmailMessageText = document.querySelector(".footer").innerHTML;

	var localUserEmail = localStorage.getItem(localEmailKey);

	if (!userIsLoggedIn()) {
		localUserEmail = null;
		localStorage.removeItem(localEmailKey);
	}

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

	updateFooter();

	clearMessage();

	rerunAll();

	setAccountHeaderLinkText();

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

function setTileContainers() {
	document.getElementById('hostTilesContainer').innerHTML = gameController.getHostTilesContainerDivs();
	document.getElementById('guestTilesContainer').innerHTML = gameController.getGuestTilesContainerDivs();
}

function initialVerifyLogin() {
	if (onlinePlayEnabled) {
		onlinePlayEngine.verifyLogin(getUserId(), 
			getUsername(), 
			getUserEmail(), 
			getDeviceId(), 
			function(isVerified) {
				if (isVerified) {
					startLoggingOnlineStatus();
					startWatchingNumberOfGamesWhereUserTurn();
				} else {
					// Cannot verify user login, forget all current stuff.
					forgetCurrentGameInfo();
					forgetOnlinePlayInfo();
				}
			}
		);
	}
}

function verifyLogin() {
	if (onlinePlayEnabled) {
		onlinePlayEngine.verifyLogin(getUserId(), 
			getUsername(), 
			getUserEmail(), 
			getDeviceId(), 
			function(isVerified) {
				if (isVerified) {
					// ok
				} else {
					// Cannot verify user login, forget all current stuff.
					forgetCurrentGameInfo();
					forgetOnlinePlayInfo();
				}
			}
		);
	}
}

function setAccountHeaderLinkText(countOfGamesWhereUserTurn) {
	var text = "Sign In";
	if (userIsLoggedIn() && onlinePlayEnabled) {
		text = "My Games";
		document.title = "Skud Pai Sho";
		if (parseInt(countOfGamesWhereUserTurn)) {
			text += "(" + countOfGamesWhereUserTurn + ")";
			document.title = "(" + countOfGamesWhereUserTurn + ") Skud Pai Sho";
		}
	}
	document.getElementById('accountHeaderLinkText').innerText = text;
}

var getGameNotationCallback = function(newGameNotation) {
	if (gameWatchIntervalValue && newGameNotation !== lastKnownGameNotation) {
		// gameController.gameNotation.setNotationText(newGameNotation);
		gameController.setGameNotation(newGameNotation);
		rerunAll();
		lastKnownGameNotation = newGameNotation;
		document.getElementById("replayControls").classList.remove("gone");	// TODO Put this somewhere better where it's called less often.
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

function gameWatchPulse() {
	onlinePlayEngine.getGameNotation(gameId, getGameNotationCallback);
	
	onlinePlayEngine.checkIfUserOnline(currentGameOpponentUsername, 
		function(isOpponentOnline) {
			updateCurrentGameTitle(isOpponentOnline);
		}
	);

	onlinePlayEngine.getNewChatMessages(gameId, lastChatTimestamp, 
		function(results) {
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
				for (var index in chatMessageList) {
					var chatMessage = chatMessageList[index];
					newChatMessagesHtml += "<div class='chatMessage'><strong>" + chatMessage.username + ":</strong> " + chatMessage.message + "</div>";
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
		}
	);
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
	}, 2000);
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
		+ " | <span class='skipBonus' onclick='promptEmail();'>Edit email</span> | <span class='skipBonus' onclick='signOut();'>Sign out</span>";
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

function signOut() {
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

	forgetOnlinePlayInfo();

	updateFooter();
	clearMessage();
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
	return msg;
}

function refreshMessage() {
	document.querySelector(".gameMessage").innerHTML = "Current Player: " + getCurrentPlayer() + getAdditionalMessage();
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
				onlinePlayEngine.updateGameWinInfoAsTie(gameId, gameController.theGame.getWinResultTypeCode);
			} else {
				onlinePlayEngine.updateGameWinInfo(gameId, winnerUsername, gameController.theGame.getWinResultTypeCode());
			}
		}
	} else {
		messageText += gameController.getAdditionalMessage() + getResetMoveText();
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
	var bodyMessage = "I just made move #" + gameController.gameNotation.getLastMoveNumber() + " in Skud Pai Sho! Click here to open our game: " + url;
	
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
	document.querySelector(".gameMessage").innerHTML += getResetMoveText();
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
			return !hostEmail || localStorage.getItem(localEmailKey) === hostEmail;
		} else {
			return !guestEmail || localStorage.getItem(localEmailKey) === guestEmail;
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
	lastKnownGameNotation = gameController.gameNotation.notationTextForUrl();

	// If a solitaire game, automatic-join game.
	if (gameController.isSolitaire()) {
		completeJoinGameSeek({gameId:newGameId});
	}

	startWatchingGameRealTime();
	showModal("Game Created!", "You just created a game. Anyone can join it by clicking on Join Game. You can even join your own game if you'd like.<br /><br />If anyone joins this game, it will show up in your list of games when you click My Games.");
};

var submitMoveCallback = function() {
	debug("Inside submitMoveCallback");
	lastKnownGameNotation = gameController.gameNotation.notationTextForUrl();
	finalizeMove();
	startWatchingGameRealTime();
	startWatchingNumberOfGamesWhereUserTurn();
};

function clearMessage() {
	if (!defaultHelpMessageText) {
		defaultHelpMessageText = gameController.getDefaultHelpMessageText();
	}
	document.getElementById("helpTextContent").innerHTML = defaultHelpMessageText;
	// if (!haveUserEmail()) {
	// 	document.getElementById("helpTextContent").innerHTML += "<p>If you <span class='skipBonus' onclick='promptEmail()'>enter your email address</span>, you can be notified when your opponent plays a move.</p>";
	// }

	document.getElementById("helpTextContent").innerHTML = getTournamentText() 
		+ document.getElementById("helpTextContent").innerHTML
		+ getAltTilesOptionText();
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
		document.getElementById("helpTextContent").innerHTML = getTournamentText() + msg + getAltTilesOptionText();
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

function getLink(forSandbox) {
	var notation = new SkudPaiShoGameNotation();
	for (var i = 0; i < currentMoveIndex; i++) {
		notation.addMove(gameController.gameNotation.moves[i]);
	}

	var linkUrl = "";

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
	var link = getLink(true);
	window.open(link);
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

function closeModal() {
	document.getElementById('myMainModal').style.display = "none";
}

function callSubmitMove() {
	onlinePlayEngine.submitMove(gameId, gameController.gameNotation.notationTextForUrl(), getUserId(), submitMoveCallback);
}

var sendVerificationCodeCallback = function(message) {
	document.getElementById('verificationCodeSendResponse').innerHTML = message;
}

var isUserInfoAvailableCallback = function(data) {
	if (data && data.length > 0) {
		// user info not available
		alert("Username or email taken.");
	} else {
		document.getElementById("verificationCodeInput").disabled=false;
		document.getElementById('verificationCodeSendResponse').innerHTML = "Sending code... <i class='fa fa-circle-o-notch fa-spin fa-fw'></i>";
		onlinePlayEngine.sendVerificationCode(usernameBeingVerified, emailBeingVerified, sendVerificationCodeCallback);
	}
};

var userInfoExistsCallback = function(data) {
	if (data && parseInt(data.trim()) > 0) {
		// existing userId found
		tempUserId = data.trim();
		isUserInfoAvailableCallback();	// will trigger send verification code
	} else {
		// userInfo entered was not exact match. Is it available?
		onlinePlayEngine.isUserInfoAvailable(usernameBeingVerified, emailBeingVerified, isUserInfoAvailableCallback);
	}
}

function sendVerificationCodeClicked() {
	emailBeingVerified = document.getElementById("userEmailInput").value.trim();
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

var createDeviceIdCallback = function(generatedDeviceId) {
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

var createUserCallback = function(generatedUserId) {
	tempUserId = generatedUserId;

	onlinePlayEngine.createDeviceIdForUser(tempUserId, createDeviceIdCallback);
}

var verifyCodeCallback = function(actualCode) {
	if (codeToVerify === actualCode) {
		if (tempUserId && tempUserId > 0) {
			createUserCallback(tempUserId);
		} else {
			onlinePlayEngine.createUser(usernameBeingVerified, emailBeingVerified, createUserCallback);
		}
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

	document.getElementById('chatMessagesDisplay').innerHTML = "";
	
	updateCurrentGameTitle();
}

var GameType = {
	SkudPaiSho:{id:1, desc:"Skud Pai Sho", rulesUrl:"https://skudpaisho.wordpress.com/skud-quick-reference/"}, 
	VagabondPaiSho:{id:2, desc:"Vagabond Pai Sho", rulesUrl:"https://skudpaisho.wordpress.com/vagabond-pai-sho/"}, 
	SolitairePaiSho:{id:4, desc:"Solitaire Pai Sho", rulesUrl:"https://skudpaisho.wordpress.com/more/solitaire-pai-sho/"}, 
	CapturePaiSho:{id:3, desc:"Capture Pai Sho", rulesUrl:"https://skudpaisho.wordpress.com/more/capture-pai-sho/"}
};
function setGameController(gameTypeId) {
	// Previous game controller cleanup
	if (gameController) {
		gameController.cleanup();
	}

	// Forget current game info
	forgetCurrentGameInfo();

	closeModal();
	
	switch(gameTypeId) {
	    case GameType.SkudPaiSho.id:
	        gameController = new SkudPaiShoController();
	        debug("You're playing Skud Pai Sho!");
	        break;
	    case GameType.VagabondPaiSho.id:
	        gameController = new VagabondController();
	        debug("You're playing Vagabond Pai Sho!");
	        break;
	    case GameType.SolitairePaiSho.id:
	        gameController = new SolitaireController();
	        debug("You're playing Solitaire Pai Sho!");
	        gameController.callActuate();
	        break;
	    default:
	        debug("Defaulting to use Skud Pai Sho.");
	        gameController = new SkudPaiShoController();
	}

	// New game stuff:
	currentGameData.gameTypeId = gameTypeId;
	defaultHelpMessageText = null;
	clearMessage();
	refreshMessage();
}

function jumpToGame(gameIdChosen) {
	if (!onlinePlayEnabled) {
		return;
	}
	onlinePlayEngine.getGameInfo(getUserId(), gameIdChosen, 
		function(results) {
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

				if (getUsername() === opponentUsername) {
					hostEmail = getUserEmail();
					guestEmail = getUserEmail();
				} else if (myGame.hostUsername === getUsername()) {
					hostEmail = getUserEmail();
					guestEmail = opponentUsername;
				} else if (myGame.guestUsername === getUsername()) {
					hostEmail = opponentUsername;
					guestEmail = getUserEmail();
				} else {
					// Not host or guest, just watching
					hostEmail = null;
					guestEmail = null;
				}
				
				startWatchingGameRealTime();
				closeModal();
			}
		}
	);
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

function showPastGamesClicked() {
	closeModal();

	onlinePlayEngine.getPastGamesForUser(getUserId(), 
		function(results) {
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
		}
	);
}

function showMyGames() {
	onlinePlayEngine.getCurrentGamesForUser(getUserId(), 
		function(results) {
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
			message += "<br /><br /><div>You are currently signed in as " + getUsername() + ". <span class='skipBonus' onclick='signOut();'>Click here to sign out.</span></div>";
			showModal("Active Games", message);
		}
	);
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

function completeJoinGameSeek(gameSeek) {
	onlinePlayEngine.joinGameSeek(gameSeek.gameId, getUserId(), 
		function(gameJoined) {
			if (gameJoined) {
				// gameId = gameSeek.gameId;
				// currentGameOpponentUsername = gameSeek.hostUsername;
				// hostEmail = gameSeek.hostUsername;
				// guestEmail = getUserEmail();
				// currentGameData.hostUsername = gameSeek.hostUsername;
				// currentGameData.guestUsername = getUsername();
				// startWatchingGameRealTime();
				// closeModal();

				jumpToGame(gameSeek.gameId);
			}
		}
	);
}

function acceptGameSeekClicked(gameIdChosen) {
	var gameSeek;
	for (var index in gameSeekList) {
		if (gameSeekList[index].gameId === gameIdChosen) {
			gameSeek = gameSeekList[index];
		}
	}

	if (gameSeek) {
		onlinePlayEngine.getCurrentGamesForUser(getUserId(), 
			function(results) {
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
			}
		);
	}
}

function tryRealTimeClicked() {
	onlinePlayEnabled = true;
	setAccountHeaderLinkText();
	initialVerifyLogin();
	rerunAll();
	closeModal();
}

function viewGameSeeksClicked() {
	if (onlinePlayEnabled) {
		onlinePlayEngine.getGameSeeks(
			function(results) {
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
			}
		);
	} else {
		showModal("Join a game", "Coming soon <i class='fa fa-thumbs-o-up' aria-hidden='true'></i><br />Want to test out the real-time gameplay changes? <span class='clickableText' onclick='tryRealTimeClicked();'>Click here to try it!</span>");
	}
}

function createGameIfThatIsOk(gameTypeId) {
	if (userIsLoggedIn()) {
		onlinePlayEngine.getCurrentGameSeeksHostedByUser(getUserId(), gameTypeId, 
			function(results) {
				if (!results) {
					onlinePlayEngine.createGame(gameTypeId, gameController.gameNotation.notationTextForUrl(), getUserId(), createGameCallback);
				} else {
					finalizeMove();
					showModal("Game Not Created", "You either already have a game that is waiting for an opponent or are not logged in. <br /><br />If you're not logged in, you can still play the game locally, but it will not be saved online.");
				}
			}
		);
	} else {
		finalizeMove();
	}
}

function startLoggingOnlineStatus() {
	onlinePlayEngine.logOnlineStatus(getUserId(), getDeviceId());

	if (logOnlineStatusIntervalValue) {
		clearInterval(logOnlineStatusIntervalValue);
		logOnlineStatusIntervalValue = null;
	}

	logOnlineStatusIntervalValue = setInterval(function() {
		onlinePlayEngine.logOnlineStatus(getUserId(), getDeviceId());
		verifyLogin(); // TODO Build in the verify step to the logOnlineStatus call
	}, 4000);
}

function getNewGameEntryForGameType(gameType) {
	return "<div class='newGameEntry'><span class='clickableText' onclick='setGameController(" + gameType.id + ");'>" + gameType.desc + "</span><span>&nbsp;-&nbsp;<i class='fa fa-book' aria-hidden='true'></i>&nbsp;</span><a href='" + gameType.rulesUrl + "' target='_blank' class='newGameRulesLink'>Rules</a></div>";
}

function newGameClicked() {
	var message = getNewGameEntryForGameType(GameType.SkudPaiSho);
	message += getNewGameEntryForGameType(GameType.VagabondPaiSho);
	message += getNewGameEntryForGameType(GameType.SolitairePaiSho);

	showModal("New Game", message);
}

function loadNumberOfGamesWhereUserTurn() {
	if (onlinePlayEnabled && userIsLoggedIn()) {
		onlinePlayEngine.getCountOfGamesWhereUserTurn(getUserId(), 
			function(count) {
				setAccountHeaderLinkText(count);
			}
		);
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
	}, 5000);
}

/* Chat */

var sendChat = function() {
	var chatMessage = htmlEscape(document.getElementById('chatMessageInput').value).trim();
	if (chatMessage) {
		document.getElementById('sendChatMessageButton').innerHTML = "<i class='fa fa-circle-o-notch fa-spin fa-fw'>";
		onlinePlayEngine.sendChat(gameId, getUserId(), chatMessage, 
			function(result) {
				document.getElementById('sendChatMessageButton').innerHTML = "Send";
				document.getElementById('chatMessageInput').value = "";
			}
		);
	}
}

document.getElementById('chatMessageInput').onkeypress = function(e){
     var code = (e.keyCode ? e.keyCode : e.which);
      if(code == 13) {
        sendChat();
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