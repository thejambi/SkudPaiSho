// Pai Sho Main

var QueryString = function () {
  var query_string = {};
  var query = window.location.search.substring(1);

  if (query.length > 0 && !(query.includes("appType="))) {
  	// Decompress first
  	query = LZString.decompressFromEncodedURIComponent(query);
  }

  var vars = query.split("&");
  if (query.includes("&amp;")) {
  	vars = query.split("&amp;");
  }
  for (var i=0;i<vars.length;i++) {
	//   var pair = vars[i].split("="); // Old
	var pair = vars[i].split(/=(.+)/); // New (will only split into key/value, not on '=' in value)
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
var tileDesignTypeValues = {
	hlowe: "hlowe",
	hlowenew: "hlowenew",
	hlowemono: "hlowemono",
	vescucci: "vescucci",
	standard: "standard",
	pixelsho: "pixelsho",
	pixelsho2: "pixelsho2",
	xiangqi: "xiangqi"
}

var paiShoBoardDesignTypeKey = "paiShoBoardDesignTypeKey";
var paiShoBoardDesignTypeValues = {
	default: "default",
	mayfair: "mayfair",
	vescucci: "vescucci",
	xiangqi: "xiangqi",
	pixelsho: "pixelsho"
};

function getTileDesignTypeDisplayName(tileDesignTypeKey) {
	switch (tileDesignTypeKey) {
		case tileDesignTypeValues.hlowe:
			return "Modern Tiles v1";
		case tileDesignTypeValues.hlowenew:
			return "Modern Tiles";
		case tileDesignTypeValues.hlowemono:
			return "Modern Monochrome Tiles";
		case tileDesignTypeValues.vescucci:
			return "Vescucci Tiles";
		case tileDesignTypeValues.standard:
			return "Pai Sho Project Tiles";
		case tileDesignTypeValues.pixelsho:
			return "Pixel Sho v1 Tiles";
		case tileDesignTypeValues.pixelsho2:
			return "Pixel Sho v2 Tiles";
		case tileDesignTypeValues.xiangqi:
			return "Xiangqi Style";
		default:
			return tileDesignTypeKey;
	}
}

var vagabondTileDesignTypeKey = "vagabondTileDesignTypeKey";

var usernameKey = "usernameKey";
var userEmailKey = "userEmailKey";
var userIdKey = "userIdKey";
var deviceIdKey = "deviceIdKey";
var deviceTokenKey = "deviceTokenKey";

var welcomeTutorialDismissedKey = "welcomeTutorialDismissedKey";

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
var onlinePlayEngine = new OnlinePlayEngine();
var appCaller;

var gameId = -1;
var lastKnownGameNotation = "";
var gameWatchIntervalValue;
var currentGameOpponentUsername;
var currentGameData = new Object();
var currentMoveIndex = 0;
var isInReplay = false;
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

var gameContainerDiv = document.getElementById("game-container");
/* --- */

window.requestAnimationFrame(function () {
	/* Online play is enabled! */
	onlinePlayEnabled = true;
	/* ----------------------- */

	localStorage = new LocalStorage().storage;

	/* Dark Mode Preferences */
	if (localStorage.getItem("darkMode")) {
		toggleDarkMode();
	}

	defaultEmailMessageText = document.querySelector(".footer").innerHTML;

	if (QueryString.gameType) {
		clearOptions();
		if (QueryString.gameOptions) {
			var optionsArray = parseGameOptions(QueryString.gameOptions);
			for (var i = 0; i < optionsArray.length; i++) {
				addOption(optionsArray[i]);
			}
		}
		setGameController(parseInt(QueryString.gameType), true);

		gameController.setGameNotation(QueryString.game);

		if (gameController.gameNotation.moves.length > 1) {
			showReplayControls();
		}
	} else {
		closeGame();
	}

	/* Tile Design Preferences */
	if (!localStorage.getItem(tileDesignTypeKey)) {
		setSkudTilesOption(tileDesignTypeValues.hlowenew);
	} else {
		if (localStorage.getItem(tileDesignTypeKey) === tileDesignTypeValues.hlowe) {
			setSkudTilesOption(tileDesignTypeValues.hlowenew);
		} else {
			setSkudTilesOption(localStorage.getItem(tileDesignTypeKey));
		}
	}

	if (localStorage.getItem(paiShoBoardDesignTypeKey)) {
		setPaiShoBoardOption(localStorage.getItem(paiShoBoardDesignTypeKey));
	} else {
		setPaiShoBoardOption(paiShoBoardDesignTypeValues.mayfair);
	}

	if (!localStorage.getItem(vagabondTileDesignTypeKey)) {
		useDeLionTiles = true;
	} else if (localStorage.getItem(vagabondTileDesignTypeKey) === "delion") {
		useDeLionTiles = true;
	} else {
		useDeLionTiles = false;
	}
	/* --- */

	url = window.location.href.split('?')[0];
	sandboxUrl = url;

	if (url.includes("calebhugo.com")) {
		url = "https://skudpaisho.com/";
	}

	if (url.startsWith("file") && !ios && !runningOnAndroid) {
		onlinePlayEnabled = false;
	}

	if (ios || runningOnAndroid || QueryString.appType === 'ios' || QueryString.appType === 'android') {
		url = "https://skudpaisho.com/";
		sandboxUrl = url;
	}

	hostEmail = QueryString.host;
	guestEmail = QueryString.guest;

	appCaller = new DummyAppCaller();

	if (QueryString.appType === 'ios') {
		appCaller = new IOSCaller();
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
		onlinePlayEngine.testOnlinePlay(emptyCallback);
		if (gameId > 0) {
			startWatchingGameRealTime();
		}
	}

	resetGlobalChats();

	initialVerifyLogin();

	// Open default help/chat tab
	document.getElementById("defaultOpenTab").click();

	if (!QueryString.game && (localStorage.getItem(welcomeTutorialDismissedKey) !== 'true' || !userIsLoggedIn())) {
		showWelcomeTutorial();
	}
});

function usernameIsOneOf(theseNames) {
	if (theseNames && theseNames.length) {
		for (var i = 0; i < theseNames.length; i++) {
			if (getUsername() === theseNames[i]) {
				return true;
			}
		}
	}
	return false;
}

function showReplayControls() {
	if (window.navigator.onLine) {
		document.getElementById("replayControls").classList.remove("gone");
	}
}

function toggleReplayControls() {
	var id = "replayControls";
	var classToToggle = "gone";
	var replayControls = document.getElementById(id);
	if (replayControls.classList.contains(classToToggle)) {
		replayControls.classList.remove(classToToggle);
	} else {
		replayControls.classList.add(classToToggle);
	}
}

function setTileContainers() {
	document.getElementById('hostTilesContainer').innerHTML = gameController.getHostTilesContainerDivs();
	document.getElementById('guestTilesContainer').innerHTML = gameController.getGuestTilesContainerDivs();
}

var initialVerifyLoginCallback = function initialVerifyLoginCallback(response) {
				if (response === "Results exist") {
					startLoggingOnlineStatus();
					startWatchingNumberOfGamesWhereUserTurn();
					appCaller.alertAppLoaded();
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
	var numMovesText = "";
	if (userIsLoggedIn() && onlinePlayEnabled) {
		text = "My Games";
		// document.title = "Skud Pai Sho";
		document.title = "The Garden Gate";
		if (parseInt(countOfGamesWhereUserTurn)) {
			numMovesText = " (" + countOfGamesWhereUserTurn + ")";
			text += numMovesText;
			// document.title = "(" + countOfGamesWhereUserTurn + ") Skud Pai Sho";
			document.title = "(" + countOfGamesWhereUserTurn + ") The Garden Gate";
		}
	}
	document.getElementById('accountHeaderLinkText').innerText = text;
	document.getElementById('myGamesNumberMyTurn').innerText = numMovesText;
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

function usernameEquals(otherUsername) {
	return getUsername() && otherUsername.toLowerCase() === getUsername().toLowerCase();
}

function setResponseText(text) {
	var responseDiv = document.getElementById("response");
	if (responseDiv) {
		responseDiv.innerHTML = text;
	}
}

function updateCurrentGameTitle(isOpponentOnline) {
	if (!currentGameData.guestUsername || !currentGameData.hostUsername) {
		setResponseText(" ");
		return;
	}
	/* --- */

	var opponentOnlineIconText = userOfflineIcon;
	if (isOpponentOnline) {
		opponentOnlineIconText = userOnlineIcon;
	}

	var currentPlayer = getCurrentPlayer();

	// Build HOST username
	var hostUsernameTag = "";
	if (currentPlayer === HOST && !gameController.theGame.getWinner()) {
		hostUsernameTag = "<span class='currentPlayerUsername'>";
	} else {
		hostUsernameTag = "<span>";
	}
	if (usernameEquals(currentGameData.guestUsername)) {
		hostUsernameTag += opponentOnlineIconText;
	}
	hostUsernameTag += currentGameData.hostUsername;
	hostUsernameTag += "</span>";

	var guestUsernameTag = "";
	if (currentPlayer === GUEST && !gameController.theGame.getWinner()) {
		guestUsernameTag = "<span class='currentPlayerUsername'>";
	} else {
		guestUsernameTag = "<span>";
	}
	if (usernameEquals(currentGameData.hostUsername)) {
		guestUsernameTag += opponentOnlineIconText;
	}
	guestUsernameTag += currentGameData.guestUsername;
	guestUsernameTag += "</span>";

	var title = "<span>";
	title += hostUsernameTag;
	title += " vs. ";
	title += guestUsernameTag;
	title += "</span>";
	
	setResponseText(title);
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
			if (!usernameEquals(chatMessage.username)) {
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

function clearGameWatchInterval() {
	if (gameWatchIntervalValue) {
		clearInterval(gameWatchIntervalValue);
		gameWatchIntervalValue = null;
		debug("Interval cleared...");
	}
}
var REAL_TIME_GAME_WATCH_INTERVAL = 3000;
function startWatchingGameRealTime() {
	debug("Starting to watch game");

	// Setup game watching...
	document.getElementById('chatMessagesDisplay').innerHTML = "";
	lastChatTimestamp = '1970-01-01 00:00:00';

	/* Setup chat heading message with link to previously active game */
	// TODO 
	// onlinePlayEngine

	// First pulse
	gameWatchPulse();

	clearGameWatchInterval();

	gameWatchIntervalValue = setInterval(function() {
		gameWatchPulse();
	}, REAL_TIME_GAME_WATCH_INTERVAL);
}

/* Pai Sho Board Switches */
function setPaiShoBoardOption(newPaiShoBoardKey) {
	var oldClassName = paiShoBoardKey + "Board";
	gameContainerDiv.classList.remove(oldClassName);
	localStorage.setItem(paiShoBoardDesignTypeKey, newPaiShoBoardKey);
	paiShoBoardKey = newPaiShoBoardKey;
	var newClassName = paiShoBoardKey + "Board";
	gameContainerDiv.classList.add(newClassName);
	clearMessage(); // Refresh Help tab text
}

function togglePaiShoBoardDesigns() {
	var newPaiShoBoardKey = paiShoBoardDesignTypeValues.default;
	switch (paiShoBoardKey) {
		case paiShoBoardDesignTypeValues.default:
			newPaiShoBoardKey = paiShoBoardDesignTypeValues.mayfair;
			break;
		case paiShoBoardDesignTypeValues.mayfair:
			newPaiShoBoardKey = paiShoBoardDesignTypeValues.vescucci;
			break;
		case paiShoBoardDesignTypeValues.vescucci:
			newPaiShoBoardKey = paiShoBoardDesignTypeValues.xiangqi;
			break;
		case paiShoBoardDesignTypeValues.xiangqi:
			newPaiShoBoardKey = paiShoBoardDesignTypeValues.pixelsho;
			break;
		case paiShoBoardDesignTypeValues.pixelsho:
			newPaiShoBoardKey = paiShoBoardDesignTypeValues.default;
			break;
	}
	setPaiShoBoardOption(newPaiShoBoardKey);
}

/* Skud Pai Sho Tile Design Switches */
function setSkudTilesOption(newSkudTilesKey) {
	gameContainerDiv.classList.remove(skudTilesKey);
	localStorage.setItem(tileDesignTypeKey, newSkudTilesKey);
	skudTilesKey = newSkudTilesKey;
	gameContainerDiv.classList.add(skudTilesKey);
	gameController.callActuate();
	clearMessage(); // Refresh Help tab text
}

function toggleTileDesigns() {
	var newSkudTilesKey = tileDesignTypeValues.hlowenew;
	switch (skudTilesKey) {
		case tileDesignTypeValues.hlowenew:
			newSkudTilesKey = tileDesignTypeValues.hlowemono;
			break;
		case tileDesignTypeValues.hlowemono:
			newSkudTilesKey = tileDesignTypeValues.vescucci;
			break;
		case tileDesignTypeValues.vescucci:
			newSkudTilesKey = tileDesignTypeValues.pixelsho;
			break;
		case tileDesignTypeValues.pixelsho:
			newSkudTilesKey = tileDesignTypeValues.pixelsho2
			break;
		case tileDesignTypeValues.pixelsho2:
			newSkudTilesKey = tileDesignTypeValues.xiangqi;
			break;
		case tileDesignTypeValues.xiangqi:
			newSkudTilesKey = tileDesignTypeValues.standard;
			break;
	}
	setSkudTilesOption(newSkudTilesKey);
}

function getSelectedTileDesignTypeDisplayName() {
	return getTileDesignTypeDisplayName(skudTilesKey);
}
/* --- */

/* Vagabond Tile Design Switches */
function setUseDeLionVagabondTiles() {
	localStorage.setItem(vagabondTileDesignTypeKey, "delion");
	useDeLionTiles = true;
	gameController.callActuate();
}

function setUseStandardVagabondTiles() {
	localStorage.setItem(vagabondTileDesignTypeKey, "standard");
	useDeLionTiles = false;
	gameController.callActuate();
}

function toggleVagabondTileDesigns() {
	if (useDeLionTiles) {
		setUseStandardVagabondTiles();
	} else {
		setUseDeLionVagabondTiles();
	}
}
/* --- */

function promptEmail() {
	// Just call loginClicked method to open modal dialog
	loginClicked();
}

function updateFooter() {
	// var userEmail = localStorage.getItem(localEmailKey);
	// if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
	// 	document.querySelector(".footer").innerHTML = gamePlayersMessage() + "You are playing as " + userEmail
	// 	+ " | <span class='skipBonus' onclick='promptEmail();'>Edit email</span> | <span class='skipBonus' onclick='showSignOutModal();'>Sign out</span>";
	// } else {
	// 	document.querySelector(".footer").innerHTML = gamePlayersMessage() + defaultEmailMessageText;
	// }
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
	var message = "<br /><div class='clickableText' onclick='signOut(true);'>Yes, sign out</div>";
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
		isInReplay = false;
		refreshMessage();
		return false;
	} else {
		isInReplay = true;
		gameController.theGame.runNotationMove(gameController.gameNotation.moves[currentMoveIndex], withActuate);
		currentMoveIndex++;
		if (withActuate) {
			refreshMessage();	// Adding this so it updates during replay... Is this the right spot?
		}
		return true;
	}
}

function playPrevMove() {
	isInReplay = true;
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
	var msg = "";

	// Is it the player's turn?
	// TODO Could maybe get rid of this
	if (myTurn() && !userIsLoggedIn()) {
		msg = " (You) " + msg;
	}

	msg += gameController.getAdditionalMessage();

	if (gameController.theGame.getWinner()) {
		// There is a winner!
		msg += " <strong>" + gameController.theGame.getWinner() + gameController.theGame.getWinReason() + "</strong>";
	} else if (gameController.gameHasEndedInDraw && gameController.gameHasEndedInDraw()) {
		msg += "Game has ended in a draw.";
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
		if (gameMessage2) {
			gameMessage2.innerHTML = "";
		}
		return gameMessage;
	}
}

function refreshMessage() {
	var message = "";
	if (!playingOnlineGame()) {
		message += "Current Player: " + getCurrentPlayer() + "<br />";
	}
	message += getAdditionalMessage();

	getGameMessageElement().innerHTML = message;

	if ((playingOnlineGame() && iAmPlayerInCurrentOnlineGame() && !myTurn()) 
			|| gameController.isSolitaire()) {
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
		
		if (ggOptions.length > 0) {
			linkUrl += "&gameOptions=" + JSON.stringify(ggOptions);
		}

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
	/* Commenting out - 20181022
	var toEmail = getCurrentPlayerEmail();
	
	var fromEmail = getUserEmail();

	var bodyMessage = getEmailBody(url);

	$('#fromEmail').attr("value", fromEmail);
	$('#toEmail').attr("value", toEmail);
	$('#message').attr("value", bodyMessage);
	$('#contactform').removeClass('gone');
	*/
}

function getNoUserEmailMessage() {
	return "<span class='skipBonus' onclick='loginClicked(); finalizeMove();'>Sign in</span> to play games with others online. <br />";
}

function playingOnlineGame() {
	return onlinePlayEnabled && gameId > 0;
}

function linkShortenCallback(shortUrl, ignoreNoEmail) {
	debug(shortUrl);

	var aiList = gameController.getAiList();

	var messageText = "";

	if (currentMoveIndex == 1 && !haveBothEmails()) {
		if (!playingOnlineGame() && (currentGameData.gameTypeId === 1 || !currentGameData.gameTypeId)) {
			if (!ignoreNoEmail && !userIsLoggedIn()) {
				messageText = getNoUserEmailMessage() + "<br />";
			}
		}

		if (aiList.length > 0) {
			for (var i = 0; i < aiList.length; i++) {
				messageText += "<span class='skipBonus' onclick='setAiIndex(" + i + ");'>Play " + aiList[i].getName() + "</span>";
			}
			if (aiList.length > 1) {
				messageText += "<span class='skipBonus' onclick='goai();'>AI vs AI</span>";
			}
			messageText += "<br />";
		}
	} else if (haveBothEmails()) {
		if (!metadata.tournamentName && !playingOnlineGame()) {
			messageText += "Or, copy and share this <a href=\"" + shortUrl + "\">link</a> with your opponent.";
		}
		if (!playingOnlineGame()) {
			showSubmitMoveForm(shortUrl);
		}
	} else if ((activeAi && getCurrentPlayer() === activeAi.player) || (activeAi2 && getCurrentPlayer() === activeAi2.player)) {
		//messageText += "<span class='skipBonus' onclick='playAiTurn();'>Submit move to AI</span>";
		messageText += "<em>THINKING...</em>";
	} else if (activeAi && activeAi.getMessage) {
		messageText += activeAi.getMessage();
	}

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

		if (gameController.isSolitaire) {
			messageText += getResetMoveText();
		}
	} else if (gameController.gameHasEndedInDraw && gameController.gameHasEndedInDraw()) {
		if (playingOnlineGame()) {
			onlinePlayEngine.updateGameWinInfoAsTie(gameId, gameController.theGame.getWinResultTypeCode(), getLoginToken(), emptyCallback);
		}
		messageText += "Game has ended in a draw.";

		if (gameController.isSolitaire) {
			messageText += getResetMoveText();
		}
	} else {
		if (!playingOnlineGame()) {
			messageText += "Current Player: " + getCurrentPlayer() + "<br />";
		}
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
	return "<br /><span class='skipBonus' onclick='resetMove();'>Undo move</span>";
}

function showResetMoveMessage() {
	getGameMessageElement().innerHTML += getResetMoveText();
}

function resetMove() {
	gameController.resetMove();

	rerunAll();
	// $('#contactform').addClass('gone');
}

function myTurn() {
	var userEmail = localStorage.getItem(localEmailKey);
	if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
		if (getCurrentPlayer() === HOST) {
			return !hostEmail 
				|| (localStorage.getItem(localEmailKey) === hostEmail 
					|| (currentGameData.hostUsername && usernameEquals(currentGameData.hostUsername)));
		} else {
			return !guestEmail 
				|| (localStorage.getItem(localEmailKey) === guestEmail 
					|| (currentGameData.guestUsername && usernameEquals(currentGameData.guestUsername)));
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

	// Removing: Building this into the submit move
	// onlinePlayEngine.notifyUser(getLoginToken(), currentGameOpponentUsername, emptyCallback);
};

function clearMessage() {
	// if (!defaultHelpMessageText) {	// Load help message every time
		defaultHelpMessageText = gameController.getDefaultHelpMessageText();
	// }
	document.getElementById("helpTextContent").innerHTML = defaultHelpMessageText;

	var message = getTournamentText() 
		+ document.getElementById("helpTextContent").innerHTML;

	if (gameController.getGameTypeId && gameController.getGameTypeId() === GameType.SkudPaiSho.id) {
		message += getAltTilesOptionText();
	} else if (gameController.getGameTypeId && gameController.getGameTypeId() === GameType.VagabondPaiSho.id) {
		message += getAltVagabondTilesOptionText();
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
	return "<p><span class='skipBonus' onclick='toggleTileDesigns();'>Click here</span> to switch between classic, modern, and Vescucci tile designs for Skud Pai Sho.<br />Currently selected: " + getSelectedTileDesignTypeDisplayName() + "</p>"
		+ "<p><span class='skipBonus' onclick='togglePaiShoBoardDesigns();'>Click here</span> to switch between board designs for Pai Sho.</p>";	// TODO: add: <br />Currently selected: " + getSelectedTileDesignTypeDisplayName() + "
}

function getAltVagabondTilesOptionText() {
	return "<p><span class='skipBonus' onclick='toggleVagabondTileDesigns();'>Click here</span> to switch between standard and modern tile designs for Vagabond Pai Sho.</p>";
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
	var notation = gameController.getNewGameNotation();
	for (var i = 0; i < currentMoveIndex; i++) {
		notation.addMove(gameController.gameNotation.moves[i]);
	}

	setGameController(currentGameData.gameTypeId, true);

	if (userIsLoggedIn()) {
		currentGameData.hostUsername = getUsername();
		currentGameData.guestUsername = getUsername();
	}

	gameController.setGameNotation(notation.notationTextForUrl());
	rerunAll();
	showReplayControls();
}

function getLink(forSandbox) {
	var notation = gameController.getNewGameNotation();

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

function clearAiPlayers() {
	activeAi = null;
	activeAi2 = null;
}

function playAiTurn() {
	if (playingOnlineGame()) {
		clearAiPlayers();
	} else {
		gameController.playAiTurn(finalizeMove);
	}
}

function sandboxFromMove() {
	// var link = getLink(true);
	// openLink(link);
	sandboxitize();
}

function openLink(linkUrl) {
	if (ios || QueryString.appType === 'ios') {
		webkit.messageHandlers.callbackHandler.postMessage(
            '{"linkUrl":"' + linkUrl + '"}'
        );
	} else {
		window.open(linkUrl);
	}
}

/* Modal */
function callFailed() {
	showModal("", "Unable to load.");
}

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
	    closeModal();
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal && !tutorialInProgress) {
	        closeModal();
	    }
	};
}

function closeModal() {
	document.getElementById('myMainModal').style.display = "none";
	tutorialInProgress = false;
}

function callSubmitMove() {
	onlinePlayEngine.submitMove(gameId, encodeURIComponent(gameController.gameNotation.notationTextForUrl()), getLoginToken(), getGameTypeEntryFromId(currentGameData.gameTypeId).desc, submitMoveCallback);
}

var sendVerificationCodeCallback = function sendVerificationCodeCallback(response) {
	var message;
	if (response.includes('has been sent')) {
		message = "Verification code sent to " + emailBeingVerified + ". Be sure to check your spam or junk mail for the email.";
		message += "<br />Didn't get the email? Check your spam again. If it isn't there, try a different email address. Some email services reject the verification email."
    } else {
        message = "Failed to send verification code, please try again. Join the Discord for help, or try another email address.";
    }
	document.getElementById('verificationCodeSendResponse').innerHTML = message;
}

var isUserInfoAvailableCallback = function isUserInfoAvailableCallback(data) {
	if (data && data.length > 0) {
		// user info not available
		showModal("Sign In", "Username or email unavailable.<br /><br /><span class='skipBonus' onclick='loginClicked();'>Back</span>");
	} else {
		debug("Checkpoint");
		document.getElementById("verificationCodeInput").disabled=false;
		document.getElementById('verificationCodeSendResponse').innerHTML = "Sending code... <i class='fa fa-circle-o-notch fa-spin fa-fw'></i>";
		onlinePlayEngine.sendVerificationCode(usernameBeingVerified, emailBeingVerified, sendVerificationCodeCallback);
	}
};

var userInfoExistsCallback = function userInfoExistsCallback(data) {
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
	emailBeingVerified = document.getElementById("userEmailInput").value.trim().toLowerCase();
	usernameBeingVerified = document.getElementById("usernameInput").value.trim();

	// Only continue if email and username pass validation
	if (emailBeingVerified.includes("@") && emailBeingVerified.includes(".")
		&& usernameBeingVerified.match(/^([A-Za-z0-9_]){3,20}$/g)) {
		onlinePlayEngine.userInfoExists(usernameBeingVerified, emailBeingVerified, userInfoExistsCallback);
	} else {
		showModal("Sign In", "Invalid username or email. Your username cannot be too short or too long, and cannot contain spaces. <br /><br /><span class='skipBonus' onclick='loginClicked();'>Back</span>");
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
	clearAiPlayers();

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
	SkudPaiSho: {
		id: 1,
		desc: "Skud Pai Sho",
		rulesUrl: "https://skudpaisho.com/site/games/skud-pai-sho/", 
		gameOptions: [
			OPTION_DOUBLE_ACCENT_TILES, 
			OPTION_ANCIENT_OASIS_EXPANSION
		]
	},
	VagabondPaiSho: {
		id: 2,
		desc: "Vagabond Pai Sho",
		rulesUrl: "https://skudpaisho.com/site/games/vagabond-pai-sho/", 
		gameOptions: [
			OPTION_DOUBLE_TILES
		]
	},
	CapturePaiSho: {
		id: 3,
		desc: "Capture Pai Sho",
		rulesUrl: "https://skudpaisho.com/site/games/capture-pai-sho/", 
		gameOptions: []
	},
	StreetPaiSho: {
		id: 5,
		desc: "Street Pai Sho",
		rulesUrl: "https://skudpaisho.com/site/games/street-pai-sho/", 
		gameOptions: []
	},
	SolitairePaiSho: {
		id: 4,
		desc: "Solitaire Pai Sho",
		rulesUrl: "https://skudpaisho.com/site/games/solitaire-pai-sho/", 
		gameOptions: [
			OPTION_DOUBLE_TILES, 
			OPTION_INSANE_TILES
		]
	},
	CoopSolitaire: {
		id: 6,
		desc: "Cooperative Solitaire",
		rulesUrl: "https://skudpaisho.com/site/games/cooperative-solitaire-pai-sho/", 
		gameOptions: [
			OPTION_DOUBLE_TILES, 
			OPTION_INSANE_TILES
		]
	},
	OvergrowthPaiSho: {
		id: 8,
		desc: "Overgrowth Pai Sho",
		rulesUrl: "https://skudpaisho.com/site/games/overgrowth-pai-sho/", 
		gameOptions: [
			OPTION_FULL_TILES,
			FULL_POINTS_SCORING
		]
	},
	// Playground: {
	// 	id: 7,
	// 	desc: "Pai Sho Playground",
	// 	rulesUrl: "https://skudpaisho.com/site/games/pai-sho-playground/", 
	// 	gameOptions: []
	// },
	Blooms: {
		id: 9,
		desc: "Blooms",
		rulesUrl: "https://www.nickbentley.games/blooms-rules/",
		gameOptions: [
			SHORTER_GAME,
			FOUR_SIDED_BOARD,
			SIX_SIDED_BOARD
		]
	},
	// ,
	// Trifle: {
	// 	id: 10,
	// 	desc: "Pai and Sho's Trifle",
	// 	rulesUrl: "https://skudpaisho.com/site/games/pai-shos-trifle/",
	// 	gameOptions: []
	// }
	Hexentafl: {
		id: 11,
		desc: "heXentafl",
		rulesUrl: "https://nxsgame.wordpress.com/2019/09/26/hexentafl/",
		gameOptions: [
			OPTION_ATTACKERS_MOVE_FIRST,
			FIVE_SIDED_BOARD,
			KING_MOVES_LIKE_PAWNS
		],
		secretGameOptions: [
			MORE_ATTACKERS
		]
	}
};
function getGameControllerForGameType(gameTypeId) {
	var controller;

	var isMobile = window.mobileAndTabletcheck();

	switch(gameTypeId) {
	    case GameType.SkudPaiSho.id:
	        controller = new SkudPaiShoController(gameContainerDiv, isMobile);
	        break;
	    case GameType.VagabondPaiSho.id:
	        controller = new VagabondController(gameContainerDiv, isMobile);
	        break;
	    case GameType.SolitairePaiSho.id:
	        controller = new SolitaireController(gameContainerDiv, isMobile);
	        break;
	    case GameType.CapturePaiSho.id:
	    	controller = new CaptureController(gameContainerDiv, isMobile);
	    	break;
	    case GameType.StreetPaiSho.id:
	    	controller = new StreetController(gameContainerDiv, isMobile);
			break;
		case GameType.CoopSolitaire.id:
			controller = new CoopSolitaireController(gameContainerDiv, isMobile);
			break;
		// case GameType.Playground.id:
		// 	controller = new PlaygroundController(gameContainerDiv, isMobile);
		// 	break;
		case GameType.OvergrowthPaiSho.id:
			controller = new OvergrowthController(gameContainerDiv, isMobile);
			break;
		case GameType.Blooms.id:
			controller = new BloomsController(gameContainerDiv, isMobile);
			break;
		// case GameType.Trifle.id:
		// 	controller = new TrifleController(gameContainerDiv, isMobile);
		// 	break;
		case GameType.Hexentafl.id:
			controller = new HexentaflController(gameContainerDiv, isMobile);
			break;
	    default:
			debug("Game Controller unavailable.");
	}

	return controller;
}
function setGameController(gameTypeId, keepGameOptions) {
	var successResult = true;
	// Previous game controller cleanup
	if (gameController) {
		gameController.cleanup();
	}

	if (!keepGameOptions) {
		clearOptions();
	}

	// Forget current game info
	forgetCurrentGameInfo();

	closeModal();
	
	gameController = getGameControllerForGameType(gameTypeId);
	if (!gameController) {
		gameController = getGameControllerForGameType(GameType.VagabondPaiSho.id);
		debug("Defaulting to use Vagabond Pai Sho.");
		showModal("Cannot Load Game", "This game is unavailable. Try Vagabond Pai Sho instead :)<br /><br />To know why the selected game is unavailable, ask in The Garden Gate Discord. Perhaps you have selected a new game that is coming soon!");
		successResult = false;
	}
	if (gameController.completeSetup) {
		gameController.completeSetup();
	}

	// New game stuff:
	currentGameData.gameTypeId = gameTypeId;
	defaultHelpMessageText = null;
	clearMessage();
	refreshMessage();
	return successResult;
}

var jumpToGameCallback = function jumpToGameCallback(results) {
	if (results) {
		populateMyGamesList(results);
		
		var myGame = myGamesList[0];
		
		clearOptions();
		if (myGame.gameOptions) {
			for (var i = 0; i < myGame.gameOptions.length; i++) {
				addOption(myGame.gameOptions[i]);
			}
		}
		var gameControllerSuccess = setGameController(myGame.gameTypeId, true);

		if (!gameControllerSuccess) {
			return;
		}

		// Is user even playing this game? This could be used to "watch" games
		var userIsPlaying = usernameEquals(myGame.hostUsername) ||
		usernameEquals(myGame.guestUsername);
		
		gameId = myGame.gameId;
		currentGameOpponentUsername = null;
		var opponentUsername;
		
		if (userIsPlaying) {
			if (usernameEquals(myGame.hostUsername)) {
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
	clearGameWatchInterval();
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
			isUserTurn:parseInt(row[7]),
			gameOptions:parseGameOptions(row[8])
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

		var showAll = showAllCompletedGamesInList;
		var countOfGamesShown = 0;

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
			var userIsHost = usernameEquals(myGame.hostUsername);
			var opponentUsername = userIsHost ? myGame.guestUsername : myGame.hostUsername;

			var gameDisplayTitle = myGame.hostUsername;
			gameDisplayTitle += " vs. ";
			gameDisplayTitle += myGame.guestUsername;

			message += "<div class='clickableText' onclick='jumpToGame(" + gId + ");'>" + gameDisplayTitle + "</div>";

			countOfGamesShown++;
			if (!showAll && countOfGamesShown > 20) {
				break;
			}
		}
	}

	if (!showAll) {
		message += "<br /><div class='clickableText' onclick='showAllCompletedGames();'>Show all</div>";
	}

	showModal("Completed Games", message);
};

var showAllCompletedGamesInList = false;
function showPastGamesClicked() {
	closeModal();

	showAllCompletedGamesInList = false;
	onlinePlayEngine.getPastGamesForUserNew(getLoginToken(), showPastGamesCallback);
}

function showAllCompletedGames() {
	closeModal();

	showAllCompletedGamesInList = true;
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
			var userIsHost = usernameEquals(myGame.hostUsername);
			var opponentUsername = userIsHost ? myGame.guestUsername : myGame.hostUsername;

			var gameDisplayTitle = "";

			if (!userIsHost && !usernameEquals(opponentUsername)) {
				if (myGame.hostOnline) {
					gameDisplayTitle += userOnlineIcon;
				} else {
					gameDisplayTitle += userOfflineIcon;
				}
			}
			gameDisplayTitle += myGame.hostUsername;
			gameDisplayTitle += " vs. ";
			if (userIsHost && !usernameEquals(opponentUsername)) {
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
			for (var i = 0; i < myGame.gameOptions.length; i++) {
				message += "<div>&nbsp;&bull;&nbsp;<em>Game Option: " + myGame.gameOptions[i] + "</em></div>"
			}
		}
	}
	message += "<br /><br /><div class='clickableText' onclick='showPastGamesClicked();'>Show completed games</div>";
	message += "<br /><br /><div>You are currently signed in as " + getUsername() + ". <span class='skipBonus' onclick='showSignOutModal();'>Click here to sign out.</span></div>";
	// message += "<br /><div><span class='skipBonus' onclick='showAccountSettings();'>Account Settings</span></div><br />";
	showModal("Active Games", message);
};

function showMyGames() {
	showModal("Active Games", getLoadingModalText());
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

function showCurrentlyOfflineModal() {
	if (!window.navigator.onLine) {
		showModal("Currently Offline", "Currently offline, please try again when connected to the Internet. <br /><br /><span class='skipBonus' onclick='closeModal();'>OK</span>");
	}
}

function accountHeaderClicked() {
	if (!window.navigator.onLine) {
		showCurrentlyOfflineModal();
	} else if (userIsLoggedIn() && onlinePlayEnabled) {
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

			var userIsHost = usernameEquals(myGame.hostUsername);
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

function getGameTypeEntryFromId(id) {
	var gameTypeEntry = null;
	Object.keys(GameType).forEach(function(key,index) {
		if (GameType[key].id === id) {
			gameTypeEntry = GameType[key];
			return GameType[key];
		}
	});
	return gameTypeEntry;
}

function gameTypeIdSupported(id) {
	var gameTypeIdFound = false;
	Object.keys(GameType).forEach(function(key,index) {
		if (GameType[key].id === id) {
			gameTypeIdFound = true;
			return true;
		}
	});
	return gameTypeIdFound;
}

var selectedGameSeek;

function acceptGameSeekClicked(gameIdChosen) {
	var gameSeek;
	for (var index in gameSeekList) {
		if (gameSeekList[index].gameId === gameIdChosen) {
			gameSeek = gameSeekList[index];
		}
	}

	if (gameSeek 
		&& gameTypeIdSupported(gameSeek.gameTypeId) 
		&& gameOptionsSupportedForGameSeek(gameSeek)) {
		selectedGameSeek = gameSeek;
		onlinePlayEngine.getCurrentGamesForUserNew(getLoginToken(), getCurrentGamesForUserNewCallback);
	} else {
		showModal("Cannot Join Game", "This game is using new features that your version of The Garden Gate does not support.");
	}
}

function tryRealTimeClicked() {
	onlinePlayEnabled = true;
	setAccountHeaderLinkText();
	initialVerifyLogin();
	rerunAll();
	closeModal();
}

function gameOptionsSupportedForGameSeek(gameSeek) {
	var gameOptionsSupported = false;
	Object.keys(GameType).forEach(function(key,index) {
		var gameType = GameType[key];
		if (gameType.id === gameSeek.gameTypeId && gameType.gameOptions) {
			var allSupportedGameOptions = gameType.gameOptions;
			if (gameType.secretGameOptions) {
				allSupportedGameOptions = allSupportedGameOptions.concat(gameType.secretGameOptions);
			}
			gameOptionsSupported = arrayIncludesAll(allSupportedGameOptions, gameSeek.gameOptions);
			return gameOptionsSupported;
		}
	});
	return gameOptionsSupported;
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
				hostOnline:parseInt(row[5]),
				gameOptions:parseGameOptions(row[6])
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
			message += "<div><div class='clickableText gameSeekEntry' onclick='acceptGameSeekClicked(" + parseInt(gameSeek.gameId) + ");'>Host: " + hostOnlineOrNotIconText + gameSeek.hostUsername + "</div>";
			for (var i = 0; i < gameSeek.gameOptions.length; i++) {
				message += "<div>&nbsp;&bull;&nbsp;<em>Game Option: " + gameSeek.gameOptions[i] + "</em></div>"
			}
			message += "</div>";
		}
	}
	showModal("Join a game", message);
};

/* From https://css-tricks.com/snippets/javascript/unescape-html-in-js/ */
function htmlDecode(input){
	var e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function parseGameOptions(optionsJsonString) {
	try {
		var decoded = htmlDecode(optionsJsonString);
		var optionsArray = JSON.parse(decoded);
		return optionsArray;
	}
	catch(err) {
		return [];
	}
}

function viewGameSeeksClicked() {
	if (!window.navigator.onLine) {
		showCurrentlyOfflineModal();
	} else if (onlinePlayEnabled && userIsLoggedIn()) {
		showModal("Join a game", getLoadingModalText());
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
		onlinePlayEngine.createGame(gameTypeId, gameController.gameNotation.notationTextForUrl(), JSON.stringify(ggOptions), getLoginToken(), createGameCallback);
	} else {
		finalizeMove();
		var message = "";
		if (userIsLoggedIn()) {
			message = "You already have a game that is waiting for an opponent.";
		} else {
			message = "You are not signed in. ";
		}
		message += "<br /><br />You can still play the game locally, but it will not be saved online.";
		showModal("Game Not Created", message);
	}
};

var tempGameTypeId;
function createGameIfThatIsOk(gameTypeId) {
	tempGameTypeId = gameTypeId;
	if (playingOnlineGame()) {
		callSubmitMove();
	} else if (userIsLoggedIn() && window.navigator.onLine) {
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

function resetGlobalChats() {
	// Clear all global chats..
	document.getElementById('globalChatMessagesDisplay').innerHTML = "<strong>SkudPaiSho: </strong> Hi everybody! This global chat will show the latest messages sent to it for anyone signed in.<br />To get involved in the community or ask questions, join The Garden Gate <a href='https://discord.gg/dStDZx7' target='_blank'>Discord server</a> or <a href='https://forum.skudpaisho.com/' target='_blank'>The Garden Gate Forum</a>.<hr />";
}

function fetchInitialGlobalChats() {
	resetGlobalChats();

	// Fetch global chats..
	onlinePlayEngine.getInitialGlobalChatMessages(getInitialGlobalChatsCallback);
}

// var callLogOnlineStatusPulse = function callLogOnlineStatusPulse() {
// 	logOnlineStatusIntervalValue = setTimeout(function() {
// 		debug("inside timeout call");
// 		logOnlineStatusPulse();
// 	}, 5000);
// 	debug("timeout set");
// }

function logOnlineStatusPulse() {
	onlinePlayEngine.logOnlineStatus(getLoginToken(), emptyCallback);
	verifyLogin();
	fetchGlobalChats();
}

var LOG_ONLINE_STATUS_INTERVAL = 5000;
function startLoggingOnlineStatus() {
	onlinePlayEngine.logOnlineStatus(getLoginToken(), emptyCallback);

	fetchInitialGlobalChats();

	if (logOnlineStatusIntervalValue) {
		clearInterval(logOnlineStatusIntervalValue);
		logOnlineStatusIntervalValue = null;
	}

	logOnlineStatusIntervalValue = setInterval(function() {
		logOnlineStatusPulse();
	}, LOG_ONLINE_STATUS_INTERVAL);
}

function setSidenavNewGameSection() {
	var message = "";
	
	Object.keys(GameType).forEach(function(key,index) {
		message += getSidenavNewGameEntryForGameType(GameType[key]);
	});

	document.getElementById("sidenavNewGameSection").innerHTML = message;
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function closeGame() {
	setGameController(randomIntFromInterval(1,2));
}

function getSidenavNewGameEntryForGameType(gameType) {
	return "<div class='sidenavEntry'><span class='sidenavLink skipBonus' onclick='setGameController(" + gameType.id + ");'>" + gameType.desc + "</span><span>&nbsp;-&nbsp;<i class='fa fa-book' aria-hidden='true'></i>&nbsp;</span><a href='" + gameType.rulesUrl + "' target='_blank' class='newGameRulesLink sidenavLink'>Rules</a></div>";
}

function getNewGameEntryForGameType(gameType) {
	return "<div class='newGameEntry'><span class='clickableText' onclick='setGameController(" + gameType.id + ");'>" + gameType.desc + "</span><span>&nbsp;-&nbsp;<i class='fa fa-book' aria-hidden='true'></i>&nbsp;</span><a href='" + gameType.rulesUrl + "' target='_blank' class='newGameRulesLink'>Rules</a></div>";
}

function newGameClicked() {
	var message = "";
	
	Object.keys(GameType).forEach(function(key,index) {
		message += getNewGameEntryForGameType(GameType[key]);
	});

	showModal("New Game", message);
}

var getCountOfGamesWhereUserTurnCallback = function getCountOfGamesWhereUserTurnCallback(count) {
	setAccountHeaderLinkText(count);
	appCaller.setCountOfGamesWhereUserTurn(count);
};

function loadNumberOfGamesWhereUserTurn() {
	if (onlinePlayEnabled && userIsLoggedIn()) {
		onlinePlayEngine.getCountOfGamesWhereUserTurn(getUserId(), getCountOfGamesWhereUserTurnCallback);
	}
}

var USER_TURN_GAME_WATCH_INTERVAL = 6000;
function startWatchingNumberOfGamesWhereUserTurn() {
	loadNumberOfGamesWhereUserTurn();

	if (userTurnCountInterval) {
		clearInterval(userTurnCountInterval);
		userTurnCountInterval = null;
	}

	userTurnCountInterval = setInterval(function() {
		loadNumberOfGamesWhereUserTurn();
	}, USER_TURN_GAME_WATCH_INTERVAL);
}

/* Chat */

var sendChatCallback = function sendChatCallback(result) {
	document.getElementById('sendChatMessageButton').innerHTML = "Send";
	document.getElementById('chatMessageInput').value = "";
};

var sendChat = function() {
	var chatMessage = htmlEscape(document.getElementById('chatMessageInput').value).trim();
	chatMessage = chatMessage.replace(/\n/g, ' ');	// Convert newlines to spaces.
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
	chatMessage = chatMessage.replace(/\n/g, ' ');	// Convert newlines to spaces.
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
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
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
	// if (currentGameData.hostUsername && currentGameData.guestUsername) {
		var notation = gameController.getNewGameNotation();
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

		if (ggOptions.length > 0) {
			linkUrl += "&gameOptions=" + JSON.stringify(ggOptions);
		}
		
		linkUrl = LZString.compressToEncodedURIComponent(linkUrl);

		linkUrl = sandboxUrl + "?" + linkUrl;

		debug("GameReplayLinkUrl: " + linkUrl);
		var message = "Here is the <a href=\"" + linkUrl + "\" target='_blank'>game replay link</a> to the current point in the game.";
		showModal("Game Replay Link", message);
	// } else {
	// 	showModal("About Game Replay", "Click this link when viewing an online game to get a sharable game replay link.");
	// }
}

function openGameReplay() {
	if (currentGameData.hostUsername && currentGameData.guestUsername) {
		var notation = gameController.getNewGameNotation();
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

		if (ggOptions.length > 0) {
			linkUrl += "&gameOptions=" + JSON.stringify(ggOptions);
		}
		
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
	var message = "<div><em>The Garden Gate</em> is a place to play various fan-made <em>Pai Sho</em> games and other games, too. A Pai Sho game is a game played on a board for the fictional game of Pai Sho as seen in Avatar: The Last Airbender. <a href='https://skudpaisho.com/site/' target='_blank'>Learn more</a>.</div>";
	message += "<hr /><div> Modern Skud Pai Sho tile designs by Hector Lowe<br /> ©2017 | Used with permission<br /> <a href='http://hector-lowe.com/' target='_blank'>www.hector-lowe.com</a> </div> <div class='license'><a rel='license' href='http://creativecommons.org/licenses/by-nc/3.0/us/'><img alt='Creative Commons License' style='border-width:0' src='https://i.creativecommons.org/l/by-nc/3.0/us/88x31.png' /></a>&nbsp;All other content of this work is licensed under a <a rel='license' href='http://creativecommons.org/licenses/by-nc/3.0/us/'>Creative Commons Attribution-NonCommercial 3.0 United States License</a>.</div> <br /> <div><span class='skipBonus' onclick='showPrivacyPolicy();'>Privacy policy</span></div>";
	showModal("About", message);
}

function getOnlineGameOpponentUsername() {
	var opponentUsername = "";
	if (playingOnlineGame()) {
		if (usernameEquals(currentGameData.hostUsername)) {
			opponentUsername = currentGameData.guestUsername;
		} else if (usernameEquals(currentGameData.guestUsername)) {
			opponentUsername = currentGameData.hostUsername;
		}
	}
	return opponentUsername;
}

function resignGameCallback() {
	if (currentGameData) {
		setGameController(currentGameData.gameTypeId);
	} else {
		closeGame();
	}
}

function iAmPlayerInCurrentOnlineGame() {
	return usernameEquals(currentGameData.hostUsername) || usernameEquals(currentGameData.guestUsername);
}

function resignGame() {
	// TODO eventually make it so if guest never made a move, then player only "leaves" game instead of updating the game result, so it returns to being an available game seek.
	if (gameController.guestNeverMoved && gameController.guestNeverMoved()) {
		// Guest never moved, only leave game. TODO
	}// else {....}
	
	if (iAmPlayerInCurrentOnlineGame()) {
		onlinePlayEngine.updateGameWinInfo(gameId, getOnlineGameOpponentUsername(), 8, getLoginToken(), resignGameCallback);
	}
}

function resignGameClicked() {
	var message = "";
	if (playingOnlineGame() && iAmPlayerInCurrentOnlineGame() && !gameController.theGame.getWinner()) {
		message = "<div>Are you sure you want to resign this game?</div>";
		message += "<br /><div class='clickableText' onclick='closeModal(); resignGame();'>Yes - resign game</div>";
		message += "<br /><div class='clickableText' onclick='closeModal();'>No - cancel</div>";
	} else {
		message = "When playing an unfinished online game, this is where you can resign or leave a game if you wish to do so.";
	}
	
	showModal("Resign Game", message);
}

var tutorialInProgress = false;

function showWelcomeTutorial() {
	tutorialInProgress = true;
	showModal("The Garden Gate", "<div id='tutorialContent'></div>");
	setTimeout(function(){runTutorial();}, 400);
}

function runTutorial() {
	// Who knocks
	var tutContent = document.getElementById('tutorialContent');

	var div1 = document.createElement("div");
	var node = document.createTextNode("Who knocks at the Garden Gate?");
	div1.appendChild(node);
	div1.classList.add('tutContentMessage');
	div1.classList.add('tutContentFadeIn');
	tutContent.appendChild(div1);

	setTimeout(
		function() {
			var div2 = document.createElement("div");
			var node = document.createTextNode("One who has eaten the fruit...");
			div2.appendChild(node);
			div2.classList.add('tutContentMessage');
			div2.classList.add('tutContentFadeIn');
			tutContent.appendChild(div2);

			div1.classList.remove('tutContentFadeIn');
			div1.classList.add('tutContentFadeOut');

			setTimeout(
				function() {
					var div3 = document.createElement("div");
					var node = document.createTextNode("... and tasted its mysteries.");
					div3.appendChild(node);
					div3.classList.add('tutContentMessage');
					div3.classList.add('tutContentFadeIn');
					tutContent.appendChild(div3);

					setTimeout(
						function() {
							div2.classList.remove('tutContentFadeIn');
							div2.classList.add('tutContentFadeOut');
							div3.classList.remove('tutContentFadeIn');
							div3.classList.add('tutContentFadeOut');

							setTimeout(function() {
								div1.classList.add('gone');
								div2.classList.add('gone');
								div3.classList.add('gone');
								continueTutorial();
							}, 2000);
						}, 2000);
				}, 1400);
		}, 3000);
}

function continueTutorial() {
	var tutContent = document.getElementById('tutorialContent');

	if (tutContent) {
		var div1 = document.createElement("div");
		div1.innerHTML = "<p>Welcome to <em>The Garden Gate</em>, a place to play a variety of Pai Sho games and more against other players online.</p>";
		div1.innerHTML += "<p>You can sign in (or sign up) by entering your username and verifying your email address.</p>";
		div1.innerHTML += "<p>Use options in the side menu (select the <strong class='stretchText'>&nbsp;&#8801&nbsp;</strong> at the top left) to create a new game, join games set up by other players, or to view any of your games that are in progress. You can have any number of online games in progress at once.</p>";
		div1.innerHTML += "<p>Also in the side menu you can find links to the rules for all of the games you can play here.</p>";
		if (!userIsLoggedIn()) {
			div1.innerHTML += "<p><span class='skipBonus' onclick='loginClicked();'>Sign in</span> now to get started.</p>";
		}
		// div1.classList.add('tutContentMessage');
		div1.classList.add('tutContentFadeIn');
		tutContent.appendChild(div1);

		localStorage.setItem(welcomeTutorialDismissedKey, "true");
	}

	tutorialInProgress = false;
}

function iOSShake() {
	// If undo move is allowed, ask user if they wanna
	if ((playingOnlineGame() && !myTurn() && !gameController.theGame.getWinner())
		|| (!playingOnlineGame())) {
		var message = "<br /><div class='clickableText' onclick='resetMove(); closeModal();'>Yes, undo move</div>";
		message += "<br /><div class='clickableText' onclick='closeModal();'>Cancel</div>";

		showModal("Undo move?", message);
	}
}

function saveDeviceTokenIfNeeded() {
	var deviceToken = localStorage.getItem(deviceTokenKey);
	if ((ios || QueryString.appType === 'ios') && deviceToken && userIsLoggedIn()) {
		onlinePlayEngine.addUserPreferenceValue(getLoginToken(), 3, deviceToken, emptyCallback);
	}
}

function setDeviceToken(deviceToken) {
	localStorage.setItem(deviceTokenKey, deviceToken);
	saveDeviceTokenIfNeeded();
}

function openShop() {
	openLink("https://skudpaisho.com/site/buying-pai-sho/");
}

/* Options */
var ggOptions = [];

function addOption(option) {
	ggOptions.push(option);
}

function clearOptions() {
	ggOptions = [];
	closeModal();
}

function addOptionFromInput() {
	addGameOption(document.getElementById('optionAddInput').value);
	closeModal();
}

function promptAddOption() {
	var message = "";
	if (usernameIsOneOf(['SkudPaiSho'])) {
		message = "<br /><input type='text' id='optionAddInput' name='optionAddInput' />";
		message += "<br /><div class='clickableText' onclick='addOptionFromInput()'>Add</div>";
	
		if (ggOptions.length > 0) {
			message += "<br />";
			for (var i = 0; i < ggOptions.length; i++) {
				message += "<div>";
				message += ggOptions[i];
				message += "</div>";
			}
			message += "<br /><div class='clickableText' onclick='clearOptions()'>Clear Options</div>";
		}

		showModal("Secrets", message);
	}
}

function addGameOption(option) {
	addOption(option);
	setGameController(gameController.getGameTypeId(), true);
}

function getGameOptionsMessageHtml(options) {
	var msg = "<br /><br />";

	for (var i = 0; i < options.length; i++) {
		if (!gameOptionEnabled(options[i])) {
			if (!gameController.optionOkToShow
					|| (gameController.optionOkToShow && gameController.optionOkToShow(options[i]))) {
				msg += "<span class='skipBonus' onclick='addGameOption(\"" + options[i] + "\");'>&bull;&nbsp;Add game option: " + options[i] + "</span><br />";
			}
		}
	}

	return msg;
};

function showBadMoveModal() {
	showModal("Uh Oh", "A move went wrong somewhere. If you see this each time you look at this game, then this game may be corrupt due to players not both using latest updates. The app is not be compatible with new features.<br /><br />Please let your opponent know that you saw this message. You may want to resign this game and try again.");
}


/* Tournament functions */

var tournamentToManage = 0;

function getLoadingModalText() {
	var html = "Loading&nbsp;<i class='fa fa-circle-o-notch fa-spin fa-fw'></i>&nbsp;";
	return html;
}

function showPastTournamentsClicked() {
	var completeTournamentElements = document.getElementsByClassName("completeTournament");
	for (var i = 0; i < completeTournamentElements.length; i++) {
		completeTournamentElements[i].classList.remove("gone");
	}
}

var showTournamentsCallback = function showTournamentsCallback(results) {
	var message = "No current tournaments.";
	if (results) {
		message = "";

		var tourneyData = {};
		var tourneyList = [];
		var isTournamentManager = false;
		var completedTournamentsExist = false;
		try {
			tourneyData = JSON.parse(results);
			tourneyList = tourneyData.tournamentList;
			isTournamentManager = tourneyData.isTournamentManager;
		} catch (error) {
			debug("Error parsing tournament data");
			closeModal();
			showModal("Tournaments", "Error getting tournament data.");
		}

		debug(tourneyList);

		var first = true;
		var tourneyHeading = "";
		for (var index in tourneyList) {
			var tourney = tourneyList[index];

			if (tourney.status !== "Canceled") {
				if (tourney.status !== tourneyHeading) {
					tourneyHeading = tourney.status;
					if (tourneyHeading === 'Completed') {
						message += "<div class='completeTournament gone'>";
					}
					if (first) {
						first = false;
					} else {
						message += "<br />";
					}
					message += "<div class='modalContentHeading'>" + tourneyHeading + "</div>";
					if (tourneyHeading === 'Completed') {
						completedTournamentsExist = true;
					}
				} else if (tourneyHeading === 'Completed') {
					message += "<div class='completeTournament gone'>";
				}
				message += "<div class='clickableText' onclick='viewTournamentInfo(" + tourney.id + ");'>" + tourney.name + "</div>";
				if (tourneyHeading === 'Completed') {
					message += "</div>";
				}
			}
		}

		if (completedTournamentsExist) {
			message += "<br /><br /><div class='clickableText' onclick='showPastTournamentsClicked();'>Show completed tournaments</div>";
		}
		if (isTournamentManager) {
			message += "<br /><br /><div class='clickableText' onclick='manageTournamentsClicked();'>Manage Tournaments</div>";
		}

	}

	showModal("Tournaments", message);
};

function viewTournamentsClicked() {
	// showModal("Tournaments", "Tournaments are coming soon! Join the Discord and Forums to get involved!");
	showModal("Tournaments", getLoadingModalText());
	onlinePlayEngine.getCurrentTournaments(getLoginToken(), showTournamentsCallback);
}

function signUpForTournament(tournamentId, tournamentName) {
	var message = "<div class='modalContentHeading'>Tournament: " + tournamentName + "</div>";
	message += "<br /><div>Sign up to participate in this tournament?</div>";

	message += "<br /><span class='clickableText' onclick='submitTournamentSignup(" + tournamentId + ");'>Yes - Sign up!</span>";
	message += "<br /><br /><span class='clickableText' onclick='viewTournamentInfo(" + tournamentId + ");'>Cancel</span>";

	// message = "Coming soon!";
	showModal("Tournament Sign Up", message);
}

var showTournamentInfoCallback = function showTournamentInfoCallback(results) {
	var message = "No tournament info found.";
	var modalTitle = "Tournament Details";
	if (results) {
		message = "";

		var tournamentInfo = {};
		try {
			tournamentInfo = JSON.parse(results);
		} catch (error) {
			debug("Error parsing tournament info");
			closeModal();
			showModal("Tournaments", "Error getting tournament info.");
		}

		debug(tournamentInfo);

		modalTitle = tournamentInfo.name;

		message += "<div class='modalContentHeading'>" + tournamentInfo.status + " Tournament" + "</div>";

		if (tournamentInfo.details) {
			message += "<br />";
			message += tournamentInfo.details;
		}

		if (tournamentInfo.forumUrl) {
			message += "<br /><br />";
			message += "<a href='" + tournamentInfo.forumUrl + "' target='_blank' class='clickableText'>Full details <i class='fa fa-external-link'></i></a>";
		}

		var playerIsSignedUp = false;
		if (tournamentInfo.currentPlayers.length > 0) {
			message += "<br /><br /><div class='modalContentHeading'>Players currently signed up:</div>";
			for (var i = 0; i < tournamentInfo.currentPlayers.length; i++) {
				message += "<br />" + tournamentInfo.currentPlayers[i].username;
				if (tournamentInfo.currentPlayers[i].username === getUsername()) {
					playerIsSignedUp = true;
				}
			}
		}

		message += "<br />";

		if (tournamentInfo.rounds && tournamentInfo.rounds.length > 0) {
			for (var i = 0; i < tournamentInfo.rounds.length; i++) {
				var round = tournamentInfo.rounds[i];
				var roundName = htmlEscape(round.name);
				message += "<br /><div>" + roundName + "</div>";
				/* Display all games for round */
				var gamesFoundForRound = false;
				for (var j = 0; j < tournamentInfo.games.length; j++) {
					var game = tournamentInfo.games[j];
					if (game.roundId === round.id) {
						message += "<div class='clickableText' onclick='matchGameClicked(" + game.gameId + ")'>" + htmlEscape(game.gameType) + ": " + game.hostUsername + " vs " + game.guestUsername + "</div>";
						gamesFoundForRound = true;
					}
				}

				if (!gamesFoundForRound) {
					message += "<div><em>No games</em></div>"
				}
			}
		} else {
			message += "<br /><em>No rounds</em>";
		}

		if (userIsLoggedIn() && tournamentInfo.signupAvailable && !playerIsSignedUp) {
			message += "<br /><br /><div class='clickableText' onclick='signUpForTournament(" + tournamentInfo.id + ",\"" + htmlEscape(tournamentInfo.name) + "\");'>Sign up for tournament</div>";
		} else if (!userIsLoggedIn()) {
			message += "<br /><br />Sign in and start playing to participate in tournaments.";
		}
	}

	showModal(modalTitle, message);
};

function viewTournamentInfo(tournamentId) {
	showModal("Tournament Details", getLoadingModalText());
	onlinePlayEngine.getTournamentInfo(tournamentId, showTournamentInfoCallback);
}

function submitCreateTournament() {
	var name = htmlEscape(document.getElementById('createTournamentName').value);
	var forumUrl = htmlEscape(document.getElementById('createTournamentForumUrl').value);
	var details = htmlEscape(document.getElementById('createTournamentDetails').value);
	
	onlinePlayEngine.createTournament(getLoginToken(), name, forumUrl, details, manageTournamentsClicked);
}

function createNewTournamentClicked() {
	var message = "<div>Please create a thread in the Tournaments section of the forum with details about your tournament. Put the url of your tournament thread in the Forum URL field. <br /><br />Put a short summary in the Details field that will help players understand what kind of tournament this will be.</div>";
	message += "<br /><div>Name:<br /><input type='text' id='createTournamentName' /></div>";
	message += "<br /><div>Forum URL:<br /><input type='text' id='createTournamentForumUrl' /></div>";
	message += "<br /><div>1-line Summary:<br /><textarea id='createTournamentDetails'></textarea></div>";

	message += "<br /><div class='clickableText' onclick='submitCreateTournament();'>Create Tournament</div>";
	message += "<br /><div class='clickableText' onclick='manageTournamentsClicked();'>Cancel</div>";

	showModal("Create Tournament", message);
}

var goToManageTournamentCallback = function goToManageTournamentCallback(results) {
	manageTournamentClicked(tournamentToManage);
};

function createNewRound(tournamentId) {
	var roundName = document.getElementById('newRoundName').value;
	onlinePlayEngine.createNewRound(getLoginToken(), tournamentId, roundName, "", goToManageTournamentCallback);
}

function changeTournamentPlayerStatus(tournamentId, usernameToChange, newTournamentPlayerStatusId) {
	onlinePlayEngine.changeTournamentPlayerStatus(getLoginToken(), tournamentId, usernameToChange, newTournamentPlayerStatusId, goToManageTournamentCallback);
}

var manageTournamentActionData = {};

function roundClicked(id, name) {
	manageTournamentActionData.newMatchData.roundId = id;
	manageTournamentActionData.newMatchData.roundName = name;
	roundDisplay = document.getElementById('newTournamentMatchRound');
	if (roundDisplay) {
		roundDisplay.innerText = name;
	}
}

function playerNameClicked(id, username) {
	var nameDisplay;
	if (manageTournamentActionData.newMatchData.hostId > 0
		&& (!manageTournamentActionData.newMatchData.guestId
			|| manageTournamentActionData.newMatchData.guestId <= 0)) {
		manageTournamentActionData.newMatchData.guestId = id;
		manageTournamentActionData.newMatchData.guestUsername = username;
		nameDisplay = document.getElementById('newTournamentMatchGuest');
	} else {
		manageTournamentActionData.newMatchData.hostId = id;
		manageTournamentActionData.newMatchData.hostUsername = username;
		nameDisplay = document.getElementById('newTournamentMatchHost');
		manageTournamentActionData.newMatchData.guestId = 0;
		manageTournamentActionData.newMatchData.guestUsername = null;
		document.getElementById('newTournamentMatchGuest').innerText = '';
	}
	
	if (nameDisplay) {
		nameDisplay.innerText = username;
	}
}

function createNewTournamentMatch() {
	var roundId = manageTournamentActionData.newMatchData.roundId;
	var gameTypeId = currentGameData.gameTypeId;
	var hostUsername = manageTournamentActionData.newMatchData.hostUsername;
	var guestUsername = manageTournamentActionData.newMatchData.guestUsername;
	var options = JSON.stringify(ggOptions);

	onlinePlayEngine.createTournamentRoundMatch(
		getLoginToken(), 
		roundId, 
		gameTypeId, 
		hostUsername, 
		guestUsername, 
		options, 
		goToManageTournamentCallback
	);
}

function matchGameClicked(gameId) {
	jumpToGame(gameId);
}

function changeTournamentStatus(tournamentId, newTournamentStatusId) {
	onlinePlayEngine.changeTournamentStatus(
		getLoginToken(),
		tournamentId,
		newTournamentStatusId,
		goToManageTournamentCallback
	);
}

var showManageTournamentCallback = function showManageTournamentCallback(results) {
	var message = "No tournment info found."
	var modalTitle = "Manage Tournament";
	if (results) {
		message = "";

		var resultData = {};
		try {
			resultData = JSON.parse(results);
		} catch (error) {
			debug("Error parsing info");
			closeModal();
			showModal(modalTitle, "Error getting tournament info.");
		}

		manageTournamentActionData.newMatchData = {};

		debug(results);
		debug(resultData);

		message += "<div class='modalContentHeading'>" + resultData.name + "</div>";
		message += "<div>" + resultData.details + "</div>";

		message += "<br /><div>Status: " + resultData.status + "</div>";
		/* Defaults for these if statusId is 1 */
		var nextStatusId = 2;
		var nextStatusActionText = "Begin Tournament";
		if (resultData.statusId === 2) {
			nextStatusId = 3;
			nextStatusActionText = "Complete Tournament";
		} else if (resultData.statusId === 3) {
			nextStatusId = 4;
			nextStatusActionText = "Cancel Tournament";
		} else if (resultData.statusId === 4) {
			nextStatusId = 1;
			nextStatusActionText = "Restore Tournament to Upcoming";
		}
		message += "<div class='clickableText' onclick='changeTournamentStatus(" + resultData.id + "," + nextStatusId + ")'>" + nextStatusActionText + "</div>";

		if (resultData.rounds && resultData.rounds.length > 0) {
			for (var i = 0; i < resultData.rounds.length; i++) {
				var round = resultData.rounds[i];
				var roundName = htmlEscape(round.name);
				message += "<br /><div class='clickableText' onclick='roundClicked(" + round.id + ",\"" + roundName + "\")'>" + roundName + "</div>";
				/* Display all games for round */
				for (var j = 0; j < resultData.games.length; j++) {
					var game = resultData.games[j];
					if (game.roundId === round.id) {
						message += "<div class='clickableText' onclick='matchGameClicked(" + game.gameId + ")'>" + htmlEscape(game.gameType) + ":" + game.hostUsername + " vs " + game.guestUsername + "</div>";
					}
				}
			}
		} else {
			message += "<br /><em>No rounds</em>";
		}
		message += "<br /><div class='modalContentHeading'>New Round</div>";
		message += "<div>Name:<br /><input type='text' id='newRoundName' /></div>";
		message += "<div class='clickableText' onclick='createNewRound(" + resultData.id + ");'>Create Round</div>";

		/* Players */
		if (resultData.players && resultData.players.length > 1) {
			var playerStatusId = 0;
			var statusChangeLinkText = "";
			for (var i = 0; i < resultData.players.length; i++) {
				var player = resultData.players[i];
				if (player.statusId !== playerStatusId) {
					message += "<br /><div>&nbsp;&nbsp;" + player.status + "</div>";
					playerStatusId = player.statusId;
					if (playerStatusId === 1
						|| playerStatusId === 5) {
						statusChangeLinkText = "approve";
						changeStatusIdTo = 2;
					} else if (playerStatusId === 2) {
						statusChangeLinkText = "eliminate";
						changeStatusIdTo = 3;
					} else {
						statusChangeLinkText = "disqualify";
						changeStatusIdTo = 5;
					}
				}
				playerUsername = htmlEscape(player.username);
				message += "<div><span";
				if (playerStatusId !== 5) {
					message += " class='clickableText' onclick=playerNameClicked(" + player.userId + ",\"" + playerUsername + "\")";
				}
				message += ">" + playerUsername + "</span>&nbsp;(<span class='clickableText' onclick='changeTournamentPlayerStatus(" + resultData.id + ",\"" + playerUsername + "\"," + changeStatusIdTo + ")'>" + statusChangeLinkText + "</span>)</div>";
			}
		}

		/* Create new game section */
		message += "<br /><div class='modalContentHeading'>New Match</div>";
		message += "To create a new match, click the Round and players to apply.<br />Game will share the same type and options as the game you currently have open.";
		message += "<br /><em>Round:</em> <span id='newTournamentMatchRound'></span>";
		message += "<br /><em>Host:</em> <span id='newTournamentMatchHost'></span>";
		message += "<br /><em>Guest:</em> <span id='newTournamentMatchGuest'></span>";
		var currentGameTypeEntry = getGameTypeEntryFromId(currentGameData.gameTypeId);
		message += "<br /><em>Game:</em> " + htmlEscape(currentGameTypeEntry.desc);
		message += "<br /><em>Options:</em> " + JSON.stringify(ggOptions);
		message += "<div class='clickableText' onclick='createNewTournamentMatch();'>Create Match</div>";

		message += "<br /><br />";
	}

	showModal(modalTitle, message);
};

function manageTournamentClicked(tournamentId) {
	showModal("Manage Tournament", getLoadingModalText());
	tournamentToManage = tournamentId;
	onlinePlayEngine.getManageTournamentInfo(getLoginToken(), tournamentId, showManageTournamentCallback);
}

var showManageTournamentsCallback = function showManageTournamentsCallback(results) {
	var message = "No tournament info found.";
	var modalTitle = "Manage Tournaments";
	if (results) {
		message = "";

		var resultData = {};
		try {
			resultData = JSON.parse(results);
		} catch (error) {
			debug("Error parsing info");
			closeModal();
			showModal(modalTitle, "Error getting tournament info.");
		}

		debug(resultData);

		message += "<div class='modalContentHeading'>Your Tournaments</div>";

		if (resultData.tournaments 
			&& resultData.tournaments.length > 0) {
			for (var i = 0; i < resultData.tournaments.length; i++) {
				var tournament = resultData.tournaments[i];
				message += "<div class='clickableText' onclick='manageTournamentClicked(" + tournament.id + ");'>" + tournament.name + "</div>";
			}
		} else {
			message += "<em>None</em>";
		}

		message += "<br /><br />";
		message += "<div class='clickableText' onclick='createNewTournamentClicked();'>Create new tournament</div>";
	}

	showModal(modalTitle, message);
};

function manageTournamentsClicked() {
	showModal("Manage Tournaments", getLoadingModalText());
	onlinePlayEngine.getManageTournamentsInfo(getLoginToken(), showManageTournamentsCallback);
}

var signingUpForTournamentId = 0;
var submitTournamentSignupCallback = function submitTournamentSignupCallback(results) {
	viewTournamentInfo(signingUpForTournamentId);
};

function submitTournamentSignup(tournamentId) {
	showModal("Tournament Signup", getLoadingModalText());
	signingUpForTournamentId = tournamentId;
	onlinePlayEngine.submitTournamentSignup(getLoginToken(), tournamentId, submitTournamentSignupCallback);
}

var DARK_MODE_CLASS = "darkMode";
function toggleDarkMode() {
	var root = document.getElementsByTagName('html')[0];
	if (root.classList.contains(DARK_MODE_CLASS)) {
		root.classList.remove(DARK_MODE_CLASS);
		document.body.classList.remove(DARK_MODE_CLASS);
		localStorage.removeItem("darkMode");
	} else {
		root.classList.add(DARK_MODE_CLASS);
		document.body.classList.add(DARK_MODE_CLASS);
		localStorage.setItem("darkMode", "true");
	}
}

/* Game Controller classes should call these for user's preferences */
function getUserGamePrefKeyName(preferenceKey) {
	return "GameType" + gameController.getGameTypeId() + preferenceKey;
}
function getUserGamePreference(preferenceKey) {
	if (gameController && gameController.getGameTypeId) {
		debug(gameController.getGameTypeId());
		var keyName = getUserGamePrefKeyName(preferenceKey);
		return localStorage.getItem(keyName);
	}
	debug("whops");
}
function setUserGamePreference(preferenceKey, value) {
	if (gameController && gameController.getGameTypeId) {
		var keyName = getUserGamePrefKeyName(preferenceKey);
		localStorage.setItem(keyName, value);
	}
}

function setGameLogText(text) {
	document.getElementById('gameLogText').innerText = text;
}
