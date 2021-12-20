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

  if (QueryString.tu) {
	redirectToTinyUrl(QueryString.tu);
}
  
  var gameController;
  
  var localEmailKey = "localUserEmail";
  
  var tileDesignTypeKey = "tileDesignTypeKey";
  var tileDesignTypeValues = {
	  // hlowe: "Modern Tiles v1",
	  tgggyatso: "The Garden Gate Gyatso Tiles",
	  tggproject: "TGG Pai Sho Project",
	  hlowenew: "Modern Tiles",
	  vescucci: "Vescucci Tiles",
	  vescuccicolor: "Classy Vescucci",
	  minimalist: "TGG Minimalist",
	  chujimono: "Chu Ji Canon Tiles",
	  chujired: "Chu Ji Red",
	  azulejos: "Azulejos by Cannoli",
	  keygyatso: "Key Pai Sho Gyatso Style",
	  pixelsho: "Pixel Sho v1 Tiles",
	  pixelsho2: "Pixel Sho v2 Tiles",
	  xiangqi: "Xiangqi Style",
	  standard: "Pai Sho Project Tiles",
	  tggproject2: "TGG Project Alt Colors",
	  rusticgyatso: "Rustic Gyatso TGG Project Tiles",
	  tggwatertribe: "Northern Water Tribe TGG Project",
	  hlowemono: "Modern Monochrome Tiles",
	  modernwood: "Modern Wooden Tiles",
	  tggprojectmono: "TGG Pai Sho Project Monochrome",
	  vescuccicolored: "Vescucci Alt Colors",
	  vescuccicolored2: "Vescucci Alt Colors 2",
	  water: "Water-Themed Vescucci Tiles",
	  earth: "Earth-Themed Vescucci Tiles",
	  chujiblue: "Chu Ji Canon - Blue",
	  azulejosmono: "Azulejos Monocromos",
	  azulejosdemadera: "Azulejos de Madera",
	  tggroyal: "TGG Royal",
	  custom: "Use Custom Designs"
  };
  
var paiShoBoardDesignTypeKey = "paiShoBoardDesignTypeKey";
var customBoardUrlKey = "customBoardUrlKey";
var customBoardUrlArrayKey = "customBoardUrlArrayKey";
var defaultBoardDesignKey = "tgg20211007";
var paiShoBoardDesignTypeValuesDefault = {
	tgg20211007: "The Garden Gate",
	nomadic: "Nomadic",
	classy: "Classy Vescucci",
	chuji: "Chu Ji",
	mayfair: "Mayfair Filter",
	skudShop: "The Garden Gate Shop",
	// vescucci: "Vescucci Style",
	xiangqi: "Xiangqi-Style Tile Colors",
	// pixelsho: "Pixel-Sho",
	remix: "Remix",
	nomadsky: "Nomad's Sky by Morbius",
	water: "Water by Monk_Gyatso",
	watertribe: "Northern Water Tribe",
	// earth: "Earth by BoomerangGuy",
	fire: "Fire by BoomerangGuy",
	airnomad: "Air Nomads by Monk_Gyatso",
	// air: "Air Themed by Monk_Gyatso",
	// nick: "Nick style by BoomerangGuy",
	// nickoffset: "Nick offset-lines",
	// owl: "Order of the White Lotus by Geebung",
	// metal: "Metal Bender style by ohreaganoe",
	// whitethread: "White Thread by tree",
	// avatarstate: "Avatar State by el craken",
	// blowtorch: "Blowtorch by ProfPetruescu",
	azul: "Azul by Cannoli",
	// checkeredtraining: "Checkered Training Board by Aba",
	// forest: "Forest Board, dedicated to tree",
	// flowergarden: "Flower Garden by Liam_Keaggy13",
	// worldmap: "World Map by corky125",
	// goldengarden: "Golden Garden by Sidereus",
	// momo: "The Amazing Momo by TheRealMomo",
	// vaaturaava: "Vaatu Raava by mrpandaber",
	// waterarena: "Water Arena by Yagalo",
	// eartharena: "Earth Arena by Yagalo",
	// firearena: "Fire Arena by Yagalo",
	// ladenvar: "Ladenvăr by Sirstotes",
	// offsetcheckeredred: "Offset Checkered Red",
	// offsetcheckeredgreen: "Offset Checkered Green",
	lightmode: "Old Default Light Mode",
	darkmode: "Old Default Dark Mode",
	adevar: "Adevăr",
	adevarrose: "Adevăr Rose",
	applycustomboard: "Add Custom Board from URL"
};

var paiShoBoardDesignTypeValues = {};

var svgBoardDesigns = [
	"lightmode",
	"darkmode",
	"xiangqi"
];
  
var paiShoBoardDesignDropdownId = "PaiShoBoardDesignSelect";

function buildBoardDesignsValues() {
	paiShoBoardDesignTypeValues = copyObject(paiShoBoardDesignTypeValuesDefault);
	var customBoardArray = JSON.parse(localStorage.getItem(customBoardUrlArrayKey));
	
	if (customBoardArray && customBoardArray.length) {
		for (var i = 0; i < customBoardArray.length; i++) {
			var name = customBoardArray[i].name;
			var url = customBoardArray[i].url;
			if (name && url) {
				paiShoBoardDesignTypeValues["customBoard" + name.replace(/ /g,'_')] = name;
			}
		}
	}
}

function buildDropdownDiv(dropdownId, labelText, valuesObject, selectedObjectKey, onchangeFunction) {
	var containerDiv = document.createElement("div");

	var theDropdown = document.createElement("select");
	theDropdown.id = dropdownId;

	var label = document.createElement("label");
	label.for = dropdownId;
	label.innerText = labelText;

	Object.keys(valuesObject).forEach(function(key, index) {
		var option = document.createElement("option");
		option.value = key;
		option.innerText = valuesObject[key];

		if (key === selectedObjectKey) {
			option.selected = true;
		}

		theDropdown.appendChild(option);
	});

	theDropdown.onchange = onchangeFunction;

	containerDiv.appendChild(label);
	containerDiv.appendChild(theDropdown);

	return containerDiv;
}
  
function buildPaiShoBoardDesignDropdownDiv() {
	return buildDropdownDiv(paiShoBoardDesignDropdownId, "Pai Sho Board Design:", paiShoBoardDesignTypeValues,
		localStorage.getItem(paiShoBoardDesignTypeKey),
		function() {
			if (this.value === 'applycustomboard') {
				promptCustomBoardURL();
			}
			setPaiShoBoardOption(this.value);
		});
}
  
function buildPaiShoSettingsDiv() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Pai Sho Game Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(buildPaiShoBoardDesignDropdownDiv());

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
}
  
var vagabondTileDesignTypeKey = "vagabondTileDesignTypeKey";

var usernameKey = "usernameKey";
var userEmailKey = "userEmailKey";
var userIdKey = "userIdKey";
var deviceIdKey = "deviceIdKey";
var deviceTokenKey = "deviceTokenKey";

var showTimestampsKey = "showTimestamps";
var showMoveLogsInChatKey = "showMoveLogsInChat";

var welcomeTutorialDismissedKey = "welcomeTutorialDismissedKey";

var customBgColorKey = "customBgColorKey";

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
var replayIntervalLength = 2100;
var pieceAnimationLength = 1000; // Note that this must be changed in the `.point img` `transition` property as well(main.css)
var piecePlaceAnimation = 1; // 0 = None, they just appear, 1 = 

/* Online Play variables */
var onlinePlayEngine = new OnlinePlayEngine();
var appCaller;

var gameId = -1;
var lastKnownGameNotation = null;
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

var soundManager;
/* Preference values should default to true */
var animationsOnKey = "animationsOn";
var confirmMoveKey = "confirmMove";
var createNonRankedGamePreferredKey = "createNonRankedGamePreferred";

// var sendJoinGameChatMessage = false;
/* --- */
  
  window.requestAnimationFrame(function () {

	  /* Online play is enabled! */
	  onlinePlayEnabled = true;
	  /* ----------------------- */
  
	  localStorage = new LocalStorage().storage;
  
	  soundManager = new SoundManager();

	  /* Dark Mode Preferences (dark mode now default) */
	  if (!localStorage.getItem("data-theme")) {
		  /* to always have dark as default instead of system preferences */
		  var dataTheme = "dark";
		  /* to set based on preference */
		  // var dataTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  
		  // check for old theme system.
		  if (localStorage.getItem("darkMode")) {
			  dataTheme = localStorage.getItem("darkMode") === "true" ? "dark" : "light";
			  // remove old local storage variable (no longer needed).
			  localStorage.removeItem("darkMode");
		  }
  
		  localStorage.setItem("data-theme", dataTheme);
	  }

	  setWebsiteTheme(localStorage.getItem("data-theme"));
	  document.getElementById("websiteStyleDropdown").value = localStorage.getItem("data-theme");

	  var customBgColorValue = localStorage.getItem(customBgColorKey);
	  if (customBgColorValue) {
		  setBackgroundColor(customBgColorValue);
	  }
  
	  defaultEmailMessageText = document.querySelector(".footer").innerHTML;

	  buildBoardDesignsValues();
  
	  if (QueryString.game && !QueryString.gameType) {
		  QueryString.gameType = "1";
	  }
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
		  setSkudTilesOption("tgggyatso");
	  } else {
		setSkudTilesOption(localStorage.getItem(tileDesignTypeKey), true);
	  }
  
	  if (localStorage.getItem(paiShoBoardDesignTypeKey)) {
		  setPaiShoBoardOption(localStorage.getItem(paiShoBoardDesignTypeKey));
	  } else {
		  setPaiShoBoardOption(defaultBoardDesignKey);
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
  
	//   resetGlobalChats();	"Global Chats" tab is now "Links"
  
	  initialVerifyLogin();
  
	  // Open default help/chat tab
	  document.getElementById("defaultOpenTab").click();
  
	  if (!debugOn && !QueryString.game && (localStorage.getItem(welcomeTutorialDismissedKey) !== 'true' || !userIsLoggedIn())) {
		  showWelcomeTutorial();
	  } else {
		  OnboardingFunctions.showOnLoadAnnouncements();
	  }
  
	  if (QueryString.wg) {	/* `wg` for watch game id */
	  	QueryString.watchGame = QueryString.wg;
	  }
	  if (QueryString.watchGame) {
		  jumpToGame(QueryString.watchGame);
	  }
  
	  /* If a link to a private game, jump to the game. */
	  if (QueryString.ig && QueryString.h) {	/* `ig` for invite game id, `h` for host username */
		  QueryString.joinPrivateGame = QueryString.ig;
		  QueryString.hostUserName = QueryString.h;
		  QueryString.rankedGameInd = QueryString.r;
	  }
	  if (QueryString.joinPrivateGame) {
		  jumpToGame(QueryString.joinPrivateGame);
	  }
  });
  function getGameColor(gameMode) {
    switch(gameMode) {
        case "Skud Pai Sho":
            return "var(--skudcolor)";
            break;
        case "Vagabond Pai Sho":
            return "var(--vagabondcolor)";
            break;
		case "Adevăr Pai Sho":
			return "var(--adevarcolor)";
			break;
		case "Fire Pai Sho":
			return "var(--firecolor)";
			break;
		case "Ginseng Pai Sho":
			return "var(--ginsengcolor)";
			break;
        case "Capture Pai Sho":
            return "var(--capturecolor)";
            break;
        case "Spirit Pai Sho":
            return "var(--spiritcolor)";
            break;
        case "Nature's Grove: Respite":
            return "var(--solitairecolor)";
            break;
        case "Nature's Grove: Synergy":
            return "var(--coopsolitairecolor)";
            break;
        case "Nature's Grove: Overgrowth":
            return "var(--overgrowthcolor)";
            break;
        case "Undergrowth Pai Sho":
            return "var(--undergrowthcolor)";
            break;
        case "Street Pai Sho":
            return "var(--streetcolor)";
            break;
        case "Blooms":
            return "var(--bloomscolor)";
        case "Meadow":
            return "var(--meadowcolor)";
        case "heXentafl":
            return "var(--hexcolor)";
        case "Tumbleweed":
            return "var(--tumbleweedcolor)";
    }
    return "var(--othercolor)";
}
function usernameIsOneOf(theseNames) {
	if (theseNames && theseNames.length) {
		for (var i = 0; i < theseNames.length; i++) {
			if (getUsername() && getUsername().toLowerCase() === theseNames[i].toLowerCase()) {
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
  
  var userIsSignedInOk = true;
  var onlinePlayPaused = false;

  function resumeOnlinePlay() {
	onlinePlayPaused = false;
  }

function showOnlinePlayPausedModal() {
	closeGame();
	showModal("Online Play Paused", "Sorry, something was wrong and online play is currently paused. Take a break for some tea!<br /><br />You may attempt to <span class='skipBonus' onclick='resumeOnlinePlay(); closeModal();'>resume online play</span>.", true);
}

var initialVerifyLoginCallback = function initialVerifyLoginCallback(response) {
	if (response === "Results exist") {
		startLoggingOnlineStatus();
		startWatchingNumberOfGamesWhereUserTurn();
		appCaller.alertAppLoaded();
		userIsSignedInOk = true;
	} else {
		// Cannot verify user login, forget all current stuff.
		if (getUsername()) {
			// showModal("Signed Out :(", "If you were signed out unexpectedly, please send Skud this secret message via Discord: " + LZString.compressToEncodedURIComponent("Response:" + response + " LoginToken: " + JSON.stringify(getLoginToken())), true);
			//   showModal("Signed Out", "Sorry you were unexpectedly signed out :( <br /><br />Please sign in again to keep playing.");
			showOnlinePlayPausedModal();
			onlinePlayPaused = true;
		}
		/* forgetCurrentGameInfo();
		forgetOnlinePlayInfo(); */
	}

	/* Ask to join invite link game if present */
	if (QueryString.joinPrivateGame) {
		askToJoinPrivateGame(QueryString.joinPrivateGame, QueryString.hostUserName, QueryString.rankedGameInd);
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
		userIsSignedInOk = true;
	} else {
		// Cannot verify user login, forget all current stuff.
		if (getUsername()) {
			// showModal("Signed Out :(", "If you were signed out unexpectedly, please send Skud this secret message via Discord: " + LZString.compressToEncodedURIComponent("Response:" + response + " LoginToken: " + JSON.stringify(getLoginToken())), true);
			//   showModal("Signed Out", "Sorry you were unexpectedly signed out :( <br /><br />Please sign in again to keep playing.");
			showOnlinePlayPausedModal();
			onlinePlayPaused = true;
		}
		//   forgetCurrentGameInfo();
		//   forgetOnlinePlayInfo();
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

var previousCountOfGamesWhereUserTurn = 0;

function setAccountHeaderLinkText(countOfGamesWhereUserTurn) {
	var text = "Sign In";
	var numMovesText = "";
	if (userIsLoggedIn() && onlinePlayEnabled) {
		text = "My Games";
		document.title = "The Garden Gate";
		if (parseInt(countOfGamesWhereUserTurn)) {
			numMovesText = " (" + countOfGamesWhereUserTurn + ")";
			text += numMovesText;
			document.title = "(" + countOfGamesWhereUserTurn + ") The Garden Gate";
		}
	}
	document.getElementById('accountHeaderLinkText').innerText = text;
	document.getElementById('myGamesNumberMyTurn').innerText = numMovesText;

	if (countOfGamesWhereUserTurn > previousCountOfGamesWhereUserTurn) {
		notifyThisMessage("The Garden Gate: It's your turn!");
	}
	previousCountOfGamesWhereUserTurn = countOfGamesWhereUserTurn;
}

var getGameNotationCallback = function getGameNotationCallback(newGameNotation) {
	if (gameWatchIntervalValue && newGameNotation !== lastKnownGameNotation) {
		gameController.setGameNotation(decodeURIComponent(newGameNotation));
		rerunAll(true);
		lastKnownGameNotation = newGameNotation;
		showReplayControls();
	}
};

var getGameNotationAndClockCallback = function getGameNotationAndClockCallback(newGameDataJsonString) {
	if (newGameDataJsonString) {
		try {
			newGameData = JSON.parse(htmlDecode(newGameDataJsonString));
			if (newGameData.notation !== lastKnownGameNotation) {
				gameController.setGameNotation(decodeURIComponent(newGameData.notation));
				rerunAll(true);
				lastKnownGameNotation = newGameData.notation;
				showReplayControls();
				if (myTurn()) {
					GameClock.loadGameClock(GameClock.buildGameClockInstance(newGameData.clock));
					GameClock.startClock(getCurrentPlayer());
				}
			}

			if (!myTurn()) {
				GameClock.loadGameClock(GameClock.buildGameClockInstance(newGameData.clock));
				GameClock.startClock(getCurrentPlayer());
			}
		} catch(error) {
			debug("Error parsing game notation and clock data");
			debug(error);
		}
	}
};

function usernameEquals(otherUsername) {
	return otherUsername && getUsername() && otherUsername.toLowerCase() === getUsername().toLowerCase();
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
	if (currentPlayer === HOST && !getGameWinner()) {
		hostUsernameTag = "<span class='currentPlayerUsername'>";
	} else {
		hostUsernameTag = "<span>";
	}
	if (usernameEquals(currentGameData.guestUsername)) {
		hostUsernameTag += opponentOnlineIconText;
	}
	hostUsernameTag += currentGameData.hostUsername;
	if (currentGameData.isRankedGame) {
		hostUsernameTag += " (" + currentGameData.hostRating + ")";
	}
	hostUsernameTag += "</span>";

	var guestUsernameTag = "";
	if (currentPlayer === GUEST && !getGameWinner()) {
		guestUsernameTag = "<span class='currentPlayerUsername'>";
	} else {
		guestUsernameTag = "<span>";
	}
	if (usernameEquals(currentGameData.hostUsername)) {
		guestUsernameTag += opponentOnlineIconText;
	}
	guestUsernameTag += currentGameData.guestUsername;
	if (currentGameData.isRankedGame) {
		guestUsernameTag += " (" + currentGameData.guestRating + ")";
	}
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
				timestamp: row[0],
				username: row[1],
				message: row[2]
			};
			chatMessageList.push(chatMessage);
			lastChatTimestamp = chatMessage.timestamp;
		}

		var alertNewMessages = false;

		var pastMessageUsername = "";
		var lastMoveStamp = "";

		if (localStorage.getItem("data-theme") == "stotes") {
			for (var index in chatMessageList) {
				var chatMessage = chatMessageList[index];
				var chatMsgTimestamp = getTimestampString(chatMessage.timestamp);

				if (chatMessage.message[0] == "➢") {
					lastMoveStamp = "<p>" + chatMessage.message.replace(/&amp;/g, '&') + "</p>";
				} else {
					if (lastMoveStamp != "") {//Only add the most recent move stamp. The entire game doesn't need to be displayed in chat.
						newChatMessagesHtml += lastMoveStamp;
						lastMoveStamp = "";
						pastMessageUsername = "moveStamp";
					}
					newChatMessagesHtml += "<div class='chatMessage " + ((usernameEquals(chatMessage.username)) ? (' self') : ('')) + "'>";

					if (isTimestampsOn()) {
						newChatMessagesHtml += "<em>" + chatMsgTimestamp + "</em> ";
					}
					if (usernameEquals(chatMessage.username)) {
						newChatMessagesHtml += "<div class='message'>" + chatMessage.message.replace(/&amp;/g, '&') + "</div>";
					} else if (chatMessage.username == currentGameOpponentUsername) {
						newChatMessagesHtml += "<div class='message opponent'> " + chatMessage.message.replace(/&amp;/g, '&') + "</div>";
					} else {
						//Don't display the username multiple times if someone does many messages in a row.
						if (chatMessage.username == pastMessageUsername) {
							if (chatMessage.username == "SkudPaiSho") {
								newChatMessagesHtml += "<div class='message golden'> " + chatMessage.message.replace(/&amp;/g, '&') + "</div>";
							} else {
								newChatMessagesHtml += "<div class='message'>" + chatMessage.message.replace(/&amp;/g, '&') + "</div>";
							}
						} else {
							newChatMessagesHtml += "<strong>" + chatMessage.username + "</strong> <div class='message'>" + chatMessage.message.replace(/&amp;/g, '&') + "</div>";
						}
					}
					newChatMessagesHtml += "</div>";

					// The most recent message will determine whether to alert
					if (!usernameEquals(chatMessage.username)) {
						// Set chat tab color to alert new messages if newest message is not from user
						alertNewMessages = true;
					} else {
						alertNewMessages = false;
					}
					pastMessageUsername = chatMessage.username;
				}
			}
		} else {
			/* TGG Theme */
			for (var index in chatMessageList) {
				var chatMessage = chatMessageList[index];

				var isMoveLogMessage = chatMessage.message.includes("➢ ");

				if (!isMoveLogMessage || isMoveLogDisplayOn()) {

					var chatMsgTimestamp = getTimestampString(chatMessage.timestamp);

					newChatMessagesHtml += "<div class='chatMessage'>";

					if (isTimestampsOn()) {
						newChatMessagesHtml += "<em>" + chatMsgTimestamp + "</em> ";
					}

					if (isMoveLogMessage) {
						newChatMessagesHtml += chatMessage.message.replace(/&amp;/g, '&') + "</div>";
					} else {
						newChatMessagesHtml += "<strong>" + chatMessage.username + ":</strong> " + chatMessage.message.replace(/&amp;/g, '&') + "</div>";
					}

					// The most recent message will determine whether to alert
					if (!usernameEquals(chatMessage.username) && !isMoveLogMessage) {
						// Set chat tab color to alert new messages if newest message is not from user
						alertNewMessages = true;
					} else {
						alertNewMessages = false;
					}
				}
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
		newElement.classList.add("chatMessageContainer");
		chatMessagesDisplay.appendChild(newElement);
		// scroll to bottom if isScrolledToBottom
		if (isScrolledToBottom) {
			chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight;
		}
	}
};
  
function getTimestampString(timestampStr) {
	var dte = new Date(timestampStr + " UTC");

	var localeStr = dte.toLocaleString();
	if (localeStr.toLowerCase().includes("invalid")) {
		return timestampStr + " UTC";
	}
	return localeStr;
}
  
function gameWatchPulse() {
	onlinePlayEngine.getGameNotationAndClock(gameId, getGameNotationAndClockCallback);

	onlinePlayEngine.checkIfUserOnline(currentGameOpponentUsername, checkIfUserOnlineCallback);

	onlinePlayEngine.getNewChatMessages(gameId, lastChatTimestamp, getNewChatMessagesCallback);

	if (myTurn() && GameClock.currentClockIsTicking()) {
		GameClock.currentClock.updateSecondsRemaining();
		onlinePlayEngine.updateGameClock(gameId, GameClock.getCurrentGameClockJsonString(), getLoginToken(), emptyCallback);

		if (GameClock.currentClockIsOutOfTime()) {
			var hostResultCode = 0.5;
			if (getCurrentPlayer() === HOST) {
				hostResultCode = 0;
			} else if (getCurrentPlayer() === GUEST) {
				hostResultCode = 1;
			}
			var newPlayerRatings = {};
			if (currentGameData.isRankedGame && currentGameData.hostUsername !== currentGameData.guestUsername) {
				newPlayerRatings = Elo.getNewPlayerRatings(currentGameData.hostRating, currentGameData.guestRating, hostResultCode);
			}
			onlinePlayEngine.updateGameWinInfo(gameId, getOnlineGameOpponentUsername(), 11, getLoginToken(), emptyCallback, 
				currentGameData.isRankedGame, newPlayerRatings.hostRating, newPlayerRatings.guestRating, currentGameData.gameTypeId, currentGameData.hostUsername, currentGameData.guestUsername);
		}
	}
}

function clearGameWatchInterval() {
	if (gameWatchIntervalValue) {
		clearInterval(gameWatchIntervalValue);
		gameWatchIntervalValue = null;
	}
}
var REAL_TIME_GAME_WATCH_INTERVAL = 3000;
function startWatchingGameRealTime() {
	// Setup game watching...
	clearGameChats();

	/* Setup chat heading message with link to previously active game */
	// TODO
	// onlinePlayEngine

	// First pulse
	gameWatchPulse();

	clearGameWatchInterval();

	gameWatchIntervalValue = setInterval(function() {
		if (!onlinePlayPaused) {
			gameWatchPulse();
		}
	}, REAL_TIME_GAME_WATCH_INTERVAL);
}
  
/* Pai Sho Board Switches */
function setPaiShoBoardOption(newPaiShoBoardKey, isTemporary) {
	if (!paiShoBoardDesignTypeValues[newPaiShoBoardKey]) {
		newPaiShoBoardKey = defaultBoardDesignKey;
	}
	var oldClassName = paiShoBoardKey + "Board";
	gameContainerDiv.classList.remove(oldClassName);
	if (!isTemporary) {
		localStorage.setItem(paiShoBoardDesignTypeKey, newPaiShoBoardKey);
	}
	paiShoBoardKey = newPaiShoBoardKey;
	var newClassName = paiShoBoardKey + "Board";
	gameContainerDiv.classList.add(newClassName);

	applyBoardOptionToBgSvg();

	clearMessage(); // Refresh Help tab text
}

function promptCustomBoardURL() {
	if (localStorage.getItem(customBoardUrlKey)) {
		customBoardUrl = localStorage.getItem(customBoardUrlKey);
	} else {
		customBoardUrl = "https://skudpaisho.com/style/board_tgg.png";
	}
	localStorage.setItem(customBoardUrlKey, customBoardUrl);

	var message = "<p>You can use one of many fan-created board designs. See the boards in the #board-design channel in The Garden Gate Discord. Copy and paste the link to a board image to use here:</p>";
	message += "<br />Name: <input type='text' id='customBoardNameInput' name='customBoardNameInput' /><br />";
	message += "<br />URL: <input type='text' id='customBoardInput' name='customBoardInput' /><br />";
	message += "<br /><div class='clickableText' onclick='setCustomBoardFromInput()'>Apply Custom Board</div>";
	message += "<br /><br /><div class='clickableText' onclick='clearCustomBoardEntries()'>Clear Custom Boards</div>";

	showModal("Use Custom Board URL", message);
}

function clearCustomBoardEntries() {
	localStorage.removeItem(customBoardUrlArrayKey);
	buildBoardDesignsValues();
	clearMessage();
	closeModal();
}

function setCustomBoardFromInput() {
	var customBoardName = document.getElementById('customBoardNameInput').value;
	customBoardUrl = document.getElementById('customBoardInput').value;
	closeModal();

	if (customBoardName && customBoardUrl) {
		var customBoardArray = JSON.parse(localStorage.getItem(customBoardUrlArrayKey));
		if (!customBoardArray) {
			customBoardArray = [];
		}
		customBoardArray.push({
			name: customBoardName,
			url: customBoardUrl
		});
		localStorage.setItem(customBoardUrlArrayKey, JSON.stringify(customBoardArray));
		buildBoardDesignsValues();
	}

	if (customBoardUrl) {
		localStorage.setItem(customBoardUrlKey, customBoardUrl);
	}
	applyBoardOptionToBgSvg();
	clearMessage();
}
  
/* Skud Pai Sho Tile Design Switches */
function setSkudTilesOption(newSkudTilesKey, applyCustomBoolean) {
	if (newSkudTilesKey === 'custom' && !applyCustomBoolean) {
		promptForCustomTileDesigns(GameType.SkudPaiSho, SkudPreferences.customTilesUrl);
	} else {
		gameContainerDiv.classList.remove(skudTilesKey);
		localStorage.setItem(tileDesignTypeKey, newSkudTilesKey);
		skudTilesKey = newSkudTilesKey;
		gameContainerDiv.classList.add(skudTilesKey);
		gameController.callActuate();
		clearMessage(); // Refresh Help tab text
	}
}
  
  function getSelectedTileDesignTypeDisplayName() {
	  return tileDesignTypeValues[localStorage.getItem(tileDesignTypeKey)];
  }
  function getSelectedBoardDesignTypeDisplayName() {
	  return paiShoBoardDesignTypeValues[localStorage.getItem(paiShoBoardDesignTypeKey)];
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

	clearLogOnlineStatusInterval();
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

	document.title = "The Garden Gate";

	localStorage.removeItem(localEmailKey);

	forgetOnlinePlayInfo();

	updateFooter();
	clearMessage();
	setAccountHeaderLinkText();

	OnboardingFunctions.resetOnBoarding();
}

function rewindAllMoves() {
	pauseRun();
	gameController.resetGameManager();
	gameController.resetNotationBuilder();
	currentMoveIndex = 0;
	refreshMessage();
}

/**
 * moveAnimationBeginStep is the number of the step in the move to begin animation at. This could vary by game.
 * For example, in Skud Pai Sho, there can be multi-step moves when a Harmony Bonus is included. 
 * So when animating beginning at the Harmony Bonus step, the initial Arranging piece of the move will not be animated.
 */
function playNextMove(withActuate, moveAnimationBeginStep, skipAnimation) {
	if (currentMoveIndex >= gameController.gameNotation.moves.length) {
		// no more moves to run
		isInReplay = false;
		refreshMessage();
		return false;
	} else {
		isInReplay = true;
		if (withActuate && soundManager.nextMoveSoundsAreEnabled()) {
			soundManager.playSound(SoundManager.sounds.tileLand);
		}
		if (gameController.getSkipToIndex) {
			var newMoveIndex = gameController.getSkipToIndex(currentMoveIndex);
			for (currentMoveIndex; currentMoveIndex < newMoveIndex; currentMoveIndex++) {
				gameController.theGame.runNotationMove(gameController.gameNotation.moves[currentMoveIndex], false);
			}
		}
		gameController.theGame.runNotationMove(gameController.gameNotation.moves[currentMoveIndex], withActuate, moveAnimationBeginStep, skipAnimation);
		currentMoveIndex++;
		if (currentMoveIndex >= gameController.gameNotation.moves.length) {
			isInReplay = false;
			if (gameController.replayEnded) {
				gameController.replayEnded();
			}
		}
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

	gameController.resetGameManager(true);
	gameController.resetNotationBuilder();

	currentMoveIndex = 0;

	while (currentMoveIndex < moveToPlayTo) {
		playNextMove();
	}

	gameController.callActuate();

	if (soundManager.prevMoveSoundsAreEnabled()) {
		soundManager.playSound(SoundManager.sounds.tileLand);
	}

	refreshMessage();
}

function playAllMoves(moveAnimationBeginStep, skipAnimation) {
	pauseRun();
	if (currentMoveIndex >= gameController.gameNotation.moves.length - 1) {
		playPrevMove();	// If at end, jump to previous move so that final move can animate
	}
	while (currentMoveIndex < gameController.gameNotation.moves.length - 1) {
		playNextMove(false);
	}
	playNextMove(true, moveAnimationBeginStep, skipAnimation);
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

	if (getGameWinner()) {
		// There is a winner!
		msg += " <strong>" + getGameWinner() + getGameWinReason() + "</strong>";
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

	if ((playingOnlineGame() && iAmPlayerInCurrentOnlineGame() && !myTurn() && !getGameWinner()) 
			|| gameController.isSolitaire()) {
		showResetMoveMessage();
	}
}

function rerunAll(soundOkToPlay, moveAnimationBeginStep, skipAnimation) {
	gameController.resetGameManager();
	gameController.resetNotationBuilder();

	currentMoveIndex = 0;

	playAllMoves(moveAnimationBeginStep, skipAnimation);

	if (soundOkToPlay && soundManager.rerunAllSoundsAreEnabled()) {
		soundManager.playSound(SoundManager.sounds.tileLand);
	}
	refreshMessage();
}

var quickFinalizeMove = function(soundOkToPlay) {
	// gameController.resetGameManager();
	gameController.resetNotationBuilder();
	currentMoveIndex++;
	linkShortenCallback('');

	if (soundOkToPlay && soundManager.rerunAllSoundsAreEnabled()) {
		soundManager.playSound(SoundManager.sounds.tileLand);
	}

	refreshMessage();
	showResetMoveMessage();
};

var finalizeMove = function (moveAnimationBeginStep, ignoreNoEmail, okToUpdateWinInfo) {
  	rerunAll(true, moveAnimationBeginStep);

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

  		linkShortenCallback(linkUrl, ignoreNoEmail, okToUpdateWinInfo);
  	} else {
  		linkShortenCallback('', ignoreNoEmail, okToUpdateWinInfo);
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

function getGameWinner() {
	if (GameClock.playerIsOutOfTime(HOST)) {
		return GUEST;
	} else if (GameClock.playerIsOutOfTime(GUEST)) {
		return HOST;
	} else if (currentGameData && currentGameData.resultId === 9 && currentGameData.winnerUsername) {
		if (currentGameData.hostUsername === currentGameData.winnerUsername) {
			return HOST;
		} else {
			return GUEST;
		}
	} else {
		return gameController.theGame.getWinner();
	}
}

function getGameWinReason() {
	if (GameClock.aPlayerIsOutOfTime()) {
		return " won the game due to opponent running out of time";
	} else if (currentGameData && currentGameData.resultId === 9) {
		return " wins ᕕ( ᐛ )ᕗ! Opponent has resigned.";
	} else {
		return gameController.theGame.getWinReason();
	}
}
  
function linkShortenCallback(shortUrl, ignoreNoEmail, okToUpdateWinInfo) {
	var aiList = gameController.getAiList();

	var messageText = "";

	if ((
			(!gameController.readyToShowPlayAgainstAiOption && currentMoveIndex == 1) 
			|| (gameController.readyToShowPlayAgainstAiOption && gameController.readyToShowPlayAgainstAiOption())
		) && !haveBothEmails()) {
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

	if (getGameWinner()) {
		// There is a winner!
		messageText += "<br /><strong>" + getGameWinner() + getGameWinReason() + "</strong>";
		// Save winner
		if (okToUpdateWinInfo && playingOnlineGame()) {
			var winnerUsername;
			/*
				Host win: 1
				Guest win: 0
				Draw: 0.5
			*/
			var hostResultCode = 0.5;
			if (getGameWinner() === HOST) {
				winnerUsername = currentGameData.hostUsername;
				hostResultCode = 1;
			} else if (getGameWinner() === GUEST) {
				winnerUsername = currentGameData.guestUsername;
				hostResultCode = 0;
			}

			var newPlayerRatings = {};
			if (currentGameData.isRankedGame && currentGameData.hostUsername !== currentGameData.guestUsername) {
				newPlayerRatings = Elo.getNewPlayerRatings(currentGameData.hostRating, currentGameData.guestRating, hostResultCode);
			}

			if (!winnerUsername) {
				// A tie.. special case
				onlinePlayEngine.updateGameWinInfoAsTie(gameId, gameController.theGame.getWinResultTypeCode(), getLoginToken(), emptyCallback, 
					currentGameData.isRankedGame, newPlayerRatings.hostRating, newPlayerRatings.guestRating, currentGameData.gameTypeId, currentGameData.hostUsername, currentGameData.guestUsername);
			} else {
				onlinePlayEngine.updateGameWinInfo(gameId, winnerUsername, gameController.theGame.getWinResultTypeCode(), getLoginToken(), emptyCallback, 
					currentGameData.isRankedGame, newPlayerRatings.hostRating, newPlayerRatings.guestRating, currentGameData.gameTypeId, currentGameData.hostUsername, currentGameData.guestUsername);
			}
		}

		if (gameController.isSolitaire) {
			messageText += getResetMoveText();
		}
	} else if (gameController.gameHasEndedInDraw && gameController.gameHasEndedInDraw()) {
		if (okToUpdateWinInfo && playingOnlineGame()) {
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

	bodyMessage += "[BR][BR]---- Full Details: ----[BR]Move: " + gameController.gameNotation.getLastMoveText() +
		"[BR][BR]Game Notation: [BR]" + gameController.gameNotation.getNotationForEmail();

	return bodyMessage;
}

function getCurrentPlayer() {
	return gameController.getCurrentPlayer();
}

function getCurrentPlayerForReal() {
	return gameController.getCurrentPlayer();
}

function getResetMoveText() {
	if (activeAi) {
		return "";	// Hide "Undo" if playing against an AI
	}
	if (!gameController.undoMoveAllowed || gameController.undoMoveAllowed()) {
		return "<br /><span class='skipBonus' onclick='resetMove();'>Undo move</span>";
	} else {
		return "";
	}
}

function skipClicked() {
	if (gameController && gameController.skipClicked) {
		gameController.skipClicked();
	}
}

function getSkipButtonHtmlText(overrideText) {
	var text = "Skip";
	if (overrideText) {
		text = overrideText;
	}
	return "<br /><button onclick='skipClicked()' style='font-size:medium'>" + text + "</button>";
}
 
function showSkipButtonMessage(overrideText) {
	getGameMessageElement().innerHTML += getSkipButtonHtmlText(overrideText);
}

function showResetMoveMessage() {
	getGameMessageElement().innerHTML += getResetMoveText();
}

function resetMove() {
	var rerunHandledByController = gameController.resetMove();

	if (!rerunHandledByController) {
		rerunAll();
	}
	hideConfirmMoveButton();
	// $('#contactform').addClass('gone');
}
  
function myTurn() {
	var userEmail = localStorage.getItem(localEmailKey);
	if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
		if (getCurrentPlayer() === HOST) {
			return (!hostEmail && !playingOnlineGame()) ||
				(localStorage.getItem(localEmailKey) === hostEmail ||
					(currentGameData.hostUsername && usernameEquals(currentGameData.hostUsername)));
		} else {
			return (!guestEmail && !playingOnlineGame()) ||
				(localStorage.getItem(localEmailKey) === guestEmail ||
					(currentGameData.guestUsername && usernameEquals(currentGameData.guestUsername)));
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
		completeJoinGameSeek({
			gameId: newGameId
		});
	}

	showModal("Game Created!", "You just created a game. Anyone can join it by clicking on Join Game. You can even join your own game if you'd like.<br /><br />If anyone joins this game, it will show up in your list of games when you click My Games.");
};
  
var createPrivateGameCallback = function createPrivateGameCallback(newGameId) {
	finalizeMove();
	lastKnownGameNotation = gameController.gameNotation.notationTextForUrl();

	// If a solitaire game, automatically join game.
	if (gameController.isSolitaire()) {
		completeJoinGameSeek({
			gameId: newGameId
		});
	}

	var inviteLinkUrl = createInviteLinkUrl(newGameId);

	showModal("Game Created!", "You just created a private game. Send <a href='" + inviteLinkUrl + "' target='_blank'>this invite link</a> to a friend so they can join. <button onclick='copyTextToClipboard(\""+inviteLinkUrl+"\", this);' class='button'>Copy Link</button> <br /><br />When a player joins this game, it will show up in your list of games when you click My Games.", true);
};

function createInviteLinkUrl(newGameId) {
	var urlParamStr = "ig=" + newGameId + "&h=" + getUsername();
	if (!getBooleanPreference(createNonRankedGamePreferredKey) && !getGameTypeEntryFromId(currentGameData.gameTypeId).noRankedGames) {
		urlParamStr += "&r=y";
	}
	linkUrl = LZString.compressToEncodedURIComponent(urlParamStr);
	linkUrl = sandboxUrl + "?" + linkUrl;
	return linkUrl;
}

function askToJoinGame(gameId, hostUsername, rankedGameInd) {
	/* Set up QueryString as if joining through game invite link to trigger asking */
	QueryString.joinPrivateGame = gameId.toString();
	QueryString.hostUserName = hostUsername;
	QueryString.allowJoiningOwnGame = true;
	QueryString.rankedGameInd = rankedGameInd;
	jumpToGame(gameId);
}

function askToJoinPrivateGame(privateGameId, hostUserName, rankedGameInd) {
	if (userIsLoggedIn()) {
		var message = "Do you want to join this game hosted by " + hostUserName + "?";
		if (rankedGameInd === 'y' || rankedGameInd === 'Y') {
			message += "<br /><br /><strong> This is a ranked game.</strong>";
		}
		message += "<br /><br />";
		message += "<div class='clickableText' onclick='closeModal(); yesJoinPrivateGame(" + privateGameId + ");'>Yes - join game</div>";
		message += "<br /><div class='clickableText' onclick='closeModal();'>No - cancel</div>";

		if (currentGameData.hostUsername && currentGameData.guestUsername) {
			message = "A Guest has already joined this game.";
			message += "<br /><br />";
			message += "<div class='clickableText' onclick='closeModal();'>OK</div>";
		}

		if (!iAmPlayerInCurrentOnlineGame() || QueryString.allowJoiningOwnGame) {
			showModal("Join Game?", message, true);
		}
	} else {
		var message = "To join this game hosted by " + hostUserName + ", please sign in and then refresh this page.";
		message += "<br /><br />";
		message += "<div class='clickableText' onclick='closeModal();'>OK</div>";

		showModal("Sign In Before Joining Game", message);
	}
}

function yesJoinPrivateGame(privateGameId) {
	completeJoinGameSeek({
		gameId: privateGameId
	});
}

var submitMoveData = {};
var submitMoveCallback = function submitMoveCallback(resultData, move) {
	lastKnownGameNotation = gameController.gameNotation.notationTextForUrl();
	finalizeMove(submitMoveData.moveAnimationBeginStep, false, true);

	if (move && move.fullMoveText) {
		sendChat("➢ " + move.fullMoveText);
	}

	startWatchingNumberOfGamesWhereUserTurn();

	// Removing: Building this into the submit move
	// onlinePlayEngine.notifyUser(getLoginToken(), currentGameOpponentUsername, emptyCallback);
};

function clearMessage() {
	var helpTabContentDiv = document.getElementById("helpTextContent");

	// if (!defaultHelpMessageText) {	// Load help message every time
	defaultHelpMessageText = gameController.getDefaultHelpMessageText();
	// }
	helpTabContentDiv.innerHTML = defaultHelpMessageText;

	var message = getTournamentText() +
		helpTabContentDiv.innerHTML;

	helpTabContentDiv.innerHTML = message;

	if (gameController.getAdditionalHelpTabDiv) {
		var additionalDiv = gameController.getAdditionalHelpTabDiv();
		helpTabContentDiv.appendChild(additionalDiv);
	}

	if (gameController.isPaiShoGame) {
		helpTabContentDiv.appendChild(buildPaiShoSettingsDiv());
	}
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

function RmbDown(htmlPoint) {
	gameController.RmbDown(htmlPoint);
}

function RmbUp(htmlPoint) {
	gameController.RmbUp(htmlPoint);
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

// function getAltTilesOptionText() {
// 	return "<p><span class='skipBonus' onclick='toggleTileDesigns();'>Click here</span> to switch between classic, modern, and Vescucci tile designs for Skud Pai Sho.<br />Currently selected: " + getSelectedTileDesignTypeDisplayName() + "</p>";
// }

// function getAltVagabondTilesOptionText() {
// 	return "<p><span class='skipBonus' onclick='toggleVagabondTileDesigns();'>Click here</span> to switch between standard and modern tile designs for Vagabond Pai Sho.</p>";
// }

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
		paragraphs.forEach(function (str) {
			message += "<p>" + str + "</p>";
		});
	}

	return message;
}

function toBullets(paragraphs) {
	var message = "<ul>";

	paragraphs.forEach(function (str) {
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

function userHasGameAccess() {
	var gameTypeId = gameController.getGameTypeId && gameController.getGameTypeId();
	return gameTypeId 
		&& (gameDevOn 
			|| !getGameTypeEntryFromId(gameTypeId).usersWithAccess
			|| usernameIsOneOf(getGameTypeEntryFromId(gameTypeId).usersWithAccess));
}

function sandboxitize() {
	/* Verify game access if it would start a new game at move 0 */
	if (currentMoveIndex === 0 && !userHasGameAccess()) {
		return;
	}

	var notation = gameController.getNewGameNotation();
	for (var i = 0; i < currentMoveIndex; i++) {
		if (gameController.getSandboxNotationMove) {
			notation.addMove(gameController.getSandboxNotationMove(i));
		} else {
			notation.addMove(gameController.gameNotation.moves[i]);
		}
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
  
function showModal(headingHTMLText, modalMessageHTMLText, onlyCloseByClickingX, yesNoOptions) {
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

	if (yesNoOptions && yesNoOptions.yesFunction) {
		modalMessage.appendChild(document.createElement("br"));
		modalMessage.appendChild(document.createElement("br"));

		var yesDiv = document.createElement("div");
		yesDiv.innerText = yesNoOptions.yesText ? yesNoOptions.yesText : "OK";
		yesDiv.classList.add("clickableText");
		yesDiv.onclick = yesNoOptions.yesFunction;
		modalMessage.appendChild(yesDiv);

		modalMessage.appendChild(document.createElement("br"));
		var noDiv = document.createElement("div");
		noDiv.innerText = yesNoOptions.noText ? yesNoOptions.noText : "Cancel";
		noDiv.classList.add("clickableText");
		if (yesNoOptions.noFunction) {
			noDiv.onclick = yesNoOptions.noFunction;
		} else {
			noDiv.onclick = closeModal;
		}
		modalMessage.appendChild(noDiv);
	}

	// When the user clicks the button, open the modal
	modal.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		closeModal();
	};

	if (tutorialInProgress) {
		onlyCloseByClickingX = true;
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal && !onlyCloseByClickingX) {
			closeModal();
		}
	};
}
  
function closeModal() {
	document.getElementById('myMainModal').style.display = "none";
	tutorialInProgress = false;
}

var confirmMoveToSubmit = null;
var lockedInNotationTextForUrl = null;

function callSubmitMove(moveAnimationBeginStep, moveIsConfirmed, move) {
	if (!lockedInNotationTextForUrl) {
		lockedInNotationTextForUrl = gameController.gameNotation.notationTextForUrl();
	}
	submitMoveData = {
		moveAnimationBeginStep: moveAnimationBeginStep
	};
	if (moveIsConfirmed || !isMoveConfirmationRequired()) {	/* Move should be processed */
		GameClock.stopGameClock();
		if (!GameClock.currentClockIsOutOfTime()) {
			onlinePlayEngine.submitMove(gameId, encodeURIComponent(lockedInNotationTextForUrl), getLoginToken(), getGameTypeEntryFromId(currentGameData.gameTypeId).desc, submitMoveCallback,
				GameClock.getCurrentGameClockJsonString(), currentGameData.resultId, move);
			lockedInNotationTextForUrl = null;
		}
	} else {
		/* Move needs to be confirmed. Finalize move and show confirm button. */
		finalizeMove(submitMoveData.moveAnimationBeginStep);
		if (gameController.automaticallySubmitMoveRequired && gameController.automaticallySubmitMoveRequired()) {
			callSubmitMove(moveAnimationBeginStep, true, move);
		} else {
			confirmMoveToSubmit = move;
			showConfirmMoveButton();
		}
	}
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
		&& usernameBeingVerified.match(/^([A-Za-z0-9_]){3,25}$/g)) {
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
	return getUserId() &&
		getUsername() &&
		getUserEmail() &&
		getDeviceId();
}
  
function forgetCurrentGameInfo() {
	clearAiPlayers();

	if (gameWatchIntervalValue) {
		clearInterval(gameWatchIntervalValue);
		gameWatchIntervalValue = null;
	}

	gameId = -1;
	lastKnownGameNotation = null;
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
		name: "Skud Pai Sho",
		desc: "Skud Pai Sho",
		description: "Arrange flowers into position while changing the landscape of the board to outpace your opponent.",
		coverImg: "skud.png",
		color: "var(--skudcolor)",
		rulesUrl: "https://skudpaisho.com/site/games/skud-pai-sho/",
		gameOptions: [
			OPTION_INFORMAL_START,
			OPTION_DOUBLE_ACCENT_TILES,
			OPTION_ANCIENT_OASIS_EXPANSION,
			NO_HARMONY_VISUAL_AIDS,
			NO_WHEELS,
			SPECIAL_FLOWERS_BOUNCE
		],
		secretGameOptions: [
			DIAGONAL_MOVEMENT,
			EVERYTHING_CAPTURE,
			IGNORE_CLASHING,
			VARIABLE_ACCENT_TILES	// In development
		]
	},
	VagabondPaiSho: {
		id: 2,
		name: "Vagabond Pai Sho",
		desc: "Vagabond Pai Sho",
		color: "var(--vagabondcolor)",
		description: "Construct a battlefield by deploying tiles across the board, then attack your opponent’s Lotus tile.",
		coverImg: "vagabond.png",
		rulesUrl: "https://skudpaisho.com/site/games/vagabond-pai-sho/",
		gameOptions: [
			OPTION_DOUBLE_TILES,
			SWAP_BISON_WITH_LEMUR
		]
	},
	Adevar: {
		id: 12,
		name: "Adevăr Pai Sho",
		desc: "Adevăr Pai Sho",
		color: "var(--adevarcolor)",
		description: "See through your opponent’s deception and skillfully craft your own disguise to further your hidden objective.",
		coverImg: "adevar.png",
		rulesUrl: "https://skudpaisho.com/site/games/adevar-pai-sho/",
		gameOptions: [
			ADEVAR_LITE
		],
		noRankedGames: true
	},
	FirePaiSho: {
		id: 15,
		name: "Fire Pai Sho",
		desc: "Fire Pai Sho",
		color: "var(--firecolor)",
		description: "Like Skud Pai Sho, but with a twist: tiles are chosen randomly.",
		coverImg: "rose.png",
		rulesUrl: "https://drive.google.com/file/d/1C3A5Mx0P8vrpKc-X5QbRHuLt27yoMqBj/view?usp=sharing",
		gameOptions: [
			NO_HARMONY_VISUAL_AIDS,
			OPTION_DOUBLE_ACCENT_TILES,
			HIDE_RESERVE_TILES,
			MIDLINE_OPENER,
			ETHEREAL_ACCENT_TILES
		],
		noRankedGames: true	// Can take out when testing done, game ready to enable ranked games
	},
	Ginseng: {
		id: 18,
		name: "Ginseng Pai Sho",
		desc: "Ginseng Pai Sho",
		color: "var(--ginsengcolor)",
		description: "Advance your Lotus into enemy territory with the power of the original benders and protective harmonies.",
		coverImg: "ginseng.png",
		rulesUrl: "https://skudpaisho.com/site/games/ginseng-pai-sho/",
		gameOptions: [
			// CAPTURE_ABILITY_TARGET_1
		]
	},
	SolitairePaiSho: {
		id: 4,
		name: "Nature's Grove: Respite",
		desc: "Respite - Solitaire Pai Sho",
		color: "var(--solitairecolor)",
		description: "Arrange random flowers into position to achieve the highest score possible.",
		coverImg: "rose.png",
		rulesUrl: "https://skudpaisho.com/site/games/solitaire-pai-sho/",
		gameOptions: [
			OPTION_DOUBLE_TILES,
			OPTION_INSANE_TILES
		],
		noRankedGames: true
	},
	CoopSolitaire: {
		id: 6,
		desc: "Nature's Grove: Synergy",
		desc: "Synergy - Co-op Pai Sho",
		color: "var(--coopsolitairecolor)",
		description: "Arrange random flowers into position with a partner to achieve the highest score possible.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/cooperative-solitaire-pai-sho/",
		gameOptions: [
			LESS_TILES,
			OPTION_DOUBLE_TILES,
			OPTION_INSANE_TILES
		],
		noRankedGames: true
	},
	OvergrowthPaiSho: {
		id: 8,
		name: "Overgrowth Pai Sho",
		desc: "Overgrowth Pai Sho",
		color: "var(--overgrowthcolor)",
		description: "Arrange random flowers into position to get a higher score than your opponent.",
		coverImg: "rose.png",
		rulesUrl: "https://skudpaisho.com/site/games/overgrowth-pai-sho/",
		gameOptions: [
			LESS_TILES,
			OPTION_FULL_TILES,
			FULL_POINTS_SCORING
		],
		noRankedGames: true
	},
	Undergrowth: {
		id: 16,
		name: "Undergrowth Pai Sho",
		desc: "Undergrowth Pai Sho",
		color: "var(--undergrowthcolor)",
		description: "Arrange random flowers into position to get a higher score than your opponent.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/undergrowth-pai-sho/",
		gameOptions: [],
		noRankedGames: true,
		gameOptions: [
			UNDERGROWTH_SIMPLE
		]
	},
	Trifle: {
		id: 10,
		name: "Pai and Sho's Trifle",
		desc: "Pai and Sho's Trifle",
		color: "var(--triflecolor)",
		description: "Like Vagabond Pai Sho, but with new collectable tiles.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/pai-shos-trifle/",
		gameOptions: [],
		usersWithAccess: [
			'SkudPaiSho',
			'abacadaren',
			'Korron',
			'vescucci',
			'geebung02',
			'sirstotes',
			'Cannoli',
			'SpinxKreuz',
			'TheRealMomo',
			'MrsSkud',
			'markdwagner',
			'The_IceL0rd'
		],
		noRankedGames: true
	},
	CapturePaiSho: {
		id: 3,
		name: "Capture Pai Sho",
		desc: "Capture Pai Sho",
		color: "var(--capturecolor)",
		description: "A capture battle between opponents.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/capture-pai-sho/",
		gameOptions: []
	},
	SpiritPaiSho: {
		id: 17,
		name: "Spirit Pai Sho",
		desc: "Spirit Pai Sho (Beta)",
		color: "var(--spiritcolor)",
		description: "A new ruleset based on Capture Pai Sho.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/",
		gameOptions: []
	},
	StreetPaiSho: {
		id: 5,
		name: "Street Pai Sho",
		desc: "Street Pai Sho",
		color: "var(--streetcolor)",
		description: "Based on the Pai Sho scene from The Legend of Korra.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/street-pai-sho/",
		gameOptions: [
			FORMAL_WIN_CONDITION,
			ORIGINAL_BOARD_SETUP,
			RELEASE_CAPTIVE_TILES,
			BONUS_MOVEMENT_5,
			BONUS_MOVEMENT_BASED_ON_NUM_CAPTIVES
		],
		noRankedGames: true
	},
	Playground: {
		id: 7,
		name: "Pai Sho Playground",
		desc: "Pai Sho Playground",
		color: "var(--playgroundcolor)",
		description: "Move tiles freely and play around in this sandbox mode.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/pai-sho-playground/",
		gameOptions: [
			PLAY_IN_SPACES,
			VAGABOND_ROTATE,
			ADEVAR_ROTATE,
			GINSENG_ROTATE,
			SPECTATORS_CAN_PLAY,
			FULL_GRID,
			SQUARE_SPACES,
			BOTTOMLESS_RESERVES
		],
		noRankedGames: true
	},
	Blooms: {
		id: 9,
		name: "Blooms",
		desc: "Blooms",
		color: "var(--bloomscolor)",
		description: "A territory battle on a hexagonal board.",
		coverImg: "hexagon.png",
		rulesUrl: "https://www.nickbentley.games/blooms-rules/",
		gameOptions: [
			SHORTER_GAME,
			FOUR_SIDED_BOARD,
			SIX_SIDED_BOARD,
			EIGHT_SIDED_BOARD,
			HEXHEX_10
		]
	},
	Meadow: {
		id: 14,
		name: "Medo",
		desc: "Medo",
		color: "var(--meadowcolor)",
		description: "A territory battle on a hexagonal board.",
		coverImg: "hexagon.png",
		rulesUrl: "https://www.nickbentley.games/medo-rules-and-tips/",
		gameOptions: [
			SHORTER_GAME,
			FOUR_SIDED_BOARD,
			SIX_SIDED_BOARD,
			EIGHT_SIDED_BOARD,
			DYNAMIC_GROUP_LIMIT
		]
	},
	Hexentafl: {
		id: 11,
		name: "heXentafl",
		desc: "heXentafl",
		color: "var(--hexcolor)",
		description: "An asymmetrical strategy game where one player must defend their king while the opponent attacks.",
		coverImg: "hexagon.png",
		rulesUrl: "https://nxsgame.wordpress.com/2019/09/26/hexentafl/",
		gameOptions: [
			OPTION_ATTACKERS_MOVE_FIRST,
			FIVE_SIDED_BOARD,
			KING_MOVES_LIKE_PAWNS
		],
		secretGameOptions: [
			MORE_ATTACKERS
		]
	},
	Tumbleweed: {
		id: 13,
		name: "Tumbleweed",
		desc: "Tumbleweed",
		color: "var(--tumbleweedcolor)",
		description: "A hexagonal territory war where players stack tiles based on line-of-sight.",
		coverImg: "hexagon.png",
		rulesUrl: "https://www.youtube.com/watch?v=mjA_g3nwYW4",
		gameOptions: [
			HEXHEX_11,
			HEXHEX_6,
			CHOOSE_NEUTRAL_STACK_SPACE,
			NO_REINFORCEMENT,
			TUMBLE_6,
			RUMBLEWEED,
			TUMPLETORE,
			NO_SETUP_PHASE
		],
		secretGameOptions: [
			CRUMBLEWEED
		]
	}
};

function getGameControllerForGameType(gameTypeId) {
	var controller;

	var isMobile = window.mobileAndTabletcheck();

	switch (gameTypeId) {
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
		case GameType.SpiritPaiSho.id:
			controller = new SpiritController(gameContainerDiv, isMobile);
			break;
		case GameType.StreetPaiSho.id:
			controller = new StreetController(gameContainerDiv, isMobile);
			break;
		case GameType.CoopSolitaire.id:
			controller = new CoopSolitaireController(gameContainerDiv, isMobile);
			break;
		case GameType.Playground.id:
			controller = new PlaygroundController(gameContainerDiv, isMobile);
			break;
		case GameType.OvergrowthPaiSho.id:
			controller = new OvergrowthController(gameContainerDiv, isMobile);
			break;
		case GameType.Undergrowth.id:
			controller = new Undergrowth.Controller(gameContainerDiv, isMobile);
			break;
		case GameType.Blooms.id:
			controller = new BloomsController(gameContainerDiv, isMobile);
			break;
		case GameType.Meadow.id:
			controller = new MeadowController(gameContainerDiv, isMobile);
			break;
		case GameType.Trifle.id:
			// if (gameDevOn || usernamionof.... GameType.Trifle.usersWithAccess.includes(getUsername())) {
				controller = new Trifle.Controller(gameContainerDiv, isMobile);
			// } else {
			// 	closeGame();
			// }
			break;
		case GameType.Hexentafl.id:
			controller = new HexentaflController(gameContainerDiv, isMobile);
			break;
		case GameType.Adevar.id:
			controller = new AdevarController(gameContainerDiv, isMobile);
			break;
		case GameType.Tumbleweed.id:
			controller = new TumbleweedController(gameContainerDiv, isMobile);
			break;
		case GameType.FirePaiSho.id:
			controller = new FirePaiShoController(gameContainerDiv, isMobile);
			break;
		case GameType.Ginseng.id:
			controller = new Ginseng.Controller(gameContainerDiv, isMobile);
			break;
		default:
			debug("Game Controller unavailable.");
	}

	return controller;
}

function showDefaultGameOpenedMessage(show) {
	if (show) {
		document.getElementById('defaultGameMessage').classList.remove('gone');
	} else {
		document.getElementById('defaultGameMessage').classList.add('gone');
	}
}

function setGameController(gameTypeId, keepGameOptions) {
	setGameLogText('');
	var successResult = true;

	hideConfirmMoveButton();
	GameClock.clearCurrentClock();

	// Previous game controller cleanup
	if (gameController) {
		gameController.cleanup();
	}

	if (!keepGameOptions) {
		clearOptions();
	}

	// Forget current game info
	forgetCurrentGameInfo();

	showDefaultGameOpenedMessage(false);

	gameController = getGameControllerForGameType(gameTypeId);
	if (!gameController) {
		gameController = getGameControllerForGameType(GameType.VagabondPaiSho.id);
		showModal("Cannot Load Game", "This game is unavailable. Try Vagabond Pai Sho instead :)<br /><br />To know why the selected game is unavailable, ask in The Garden Gate Discord. Perhaps you have selected a new game that is coming soon!");
		successResult = false;
	}
	if (gameController.completeSetup) {
		gameController.completeSetup();
	}
	if (gameController.supportsMoveLogMessages) {
		document.getElementById("toggleMoveLogDisplayDiv").classList.remove("gone");
	} else {
		document.getElementById("toggleMoveLogDisplayDiv").classList.add("gone");
	}

	var gameTitleElements = document.getElementsByClassName('game-title-text');
	for (i = 0; i < gameTitleElements.length; i++) {
		gameTitleElements[i].innerText = getGameTypeEntryFromId(gameTypeId).desc;
	};

	isInReplay = false;

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
		currentGameData.lastUpdatedTimestamp = myGame.timestamp;
		currentGameData.isRankedGame = myGame.rankedGame;
		currentGameData.hostRating = myGame.hostRating;
		currentGameData.guestRating = myGame.guestRating;
		currentGameData.winnerUsername = myGame.winnerUsername;
		currentGameData.resultId = myGame.resultId;
		currentGameData.gameClock = myGame.gameClock;
		GameClock.loadGameClock(currentGameData.gameClock);

		hostEmail = myGame.hostUsername;
		guestEmail = myGame.guestUsername;

		startWatchingGameRealTime();
		updateFooter();

		/* Ask to join invite link game if present */
		if (QueryString.joinPrivateGame && gameId && gameId.toString() === QueryString.joinPrivateGame) {
			askToJoinPrivateGame(QueryString.joinPrivateGame, QueryString.hostUserName, QueryString.rankedGameInd);
			/* Once we ask after jumping into a game, we won't need to ask again */
			QueryString.joinPrivateGame = null;
		}
	}
};

function buildJoinGameChatMessage() {
	return "[Jamboree Note] Game joined at " + new Date().toString();
}

function buildCompletedGameChatMessage() {
	return "[Jamboree Note] Game completed at " + new Date().toString();
}

function shouldSendJamboreeNoteChat(gameTypeId) {
	return gameTypeId === GameType.Adevar.id;
}
  
function jumpToGame(gameIdChosen) {
	if (!onlinePlayEnabled) {
		return;
	}
	clearGameWatchInterval();
	forgetCurrentGameInfo();
	if (!onlinePlayPaused) {
		onlinePlayEngine.getGameInfo(getUserId(), gameIdChosen, jumpToGameCallback);
	}
}
  
function populateMyGamesList(results) {
	var resultRows = results.split('\n');
	myGamesList = [];
	for (var index in resultRows) {
		var row = resultRows[index].split('|||');
		var myGame = {
			gameId: parseInt(row[0]),
			gameTypeId: parseInt(row[1]),
			gameTypeDesc: row[2],
			hostUsername: row[3],
			hostOnline: parseInt(row[4]),
			guestUsername: row[5],
			guestOnline: parseInt(row[6]),
			isUserTurn: parseInt(row[7]),
			gameOptions: parseGameOptions(row[8]),
			winnerUsername: row[9],
			resultId: parseInt(row[10]),
			timestamp: row[11],
			hostRating: parseInt(row[12]),
			guestRating: parseInt(row[13]),
			rankedGame: row[14],
			gameClock: row[15]
		};
		if (myGame.gameClock) {
			myGame.gameClock = GameClock.decodeGameClock(myGame.gameClock);
		}
		myGamesList.push(myGame);
	}
}
  
  function getLoginToken() {
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

		if (localStorage.getItem("data-theme") == "stotes") {
			message += "<table><tr class='tr-header'><td class='first'>Game Mode</td><td>Host</td><td></td><td>Guest</td><td>Result</td><td>Date</td></tr>";
			var even = true;
			for (var index in myGamesList) {
				var myGame = myGamesList[index];

				var gId = parseInt(myGame.gameId);
				var userIsHost = usernameEquals(myGame.hostUsername);
				var opponentUsername = userIsHost ? myGame.guestUsername : myGame.hostUsername;
				
				message += "<tr onclick='jumpToGame(" + gId + "); closeModal();' class='" + ((even)?("even"):("odd")) + "'>";
				message += "<td class='first' style='color:" + getGameColor(myGame.gameTypeDesc) + ";'>" + myGame.gameTypeDesc + "</td>";
				
				message += "<td class='name'>" + myGame.hostUsername + "</td>";
				message += "<td>vs.</td>";
				message += "<td class='name'>" + myGame.guestUsername + "</td>";


				if (myGame.resultId === 10) {
					message += "<td>[inactive]</td>";
				} else if (myGame.resultId === 8) {
					message += "<td>[quit]</td>";
				} else if (usernameEquals(myGame.winnerUsername)) {
					message += "<td>[win]</td>";
				} else if (myGame.winnerUsername === opponentUsername) {
					message += "<td>[loss]</td>";
				} else {
					message += "<td>[ended]</td>";
				}
				message += "<td>" + myGame.timestamp.slice(0, 10) + "</td>";
				message += "</tr>";

				for (var i = 0; i < myGame.gameOptions.length; i++) {
					message += "<tr onclick='jumpToGame(" + gId + "); closeModal();' class='" + ((even)?("even"):("odd")) + "'><td class='first'><em>-Game Option</em></td><td colspan='5'>" + getGameOptionDescription(myGame.gameOptions[i]) + "</em></td></tr>";
				}

				even = !even;
				countOfGamesShown++;
				if (!showAll && countOfGamesShown > 20) {
					break;
				}
			}
			message += "<tr class='tr-footer'><td class='first'>Game Mode</td><td>Host</td><td></td><td>Guest</td><td>Result</td><td>Date</td></tr></table>";
		} else {
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
				if (myGame.resultId === 10) {
					gameDisplayTitle += " [inactive]";
				} else if (myGame.resultId === 8) {
					gameDisplayTitle += " [quit]";
				} else if (usernameEquals(myGame.winnerUsername)) {
					gameDisplayTitle += " [win]";
				} else if (myGame.winnerUsername === opponentUsername) {
					gameDisplayTitle += " [loss]";
				}

				message += "<div class='clickableText' onclick='jumpToGame(" + gId + "); closeModal();'>" + gameDisplayTitle + "</div>";

				countOfGamesShown++;
				if (!showAll && countOfGamesShown > 20) {
					break;
				}

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
	  if (!onlinePlayPaused) {
		onlinePlayEngine.getPastGamesForUserNew(getLoginToken(), showPastGamesCallback);
	  }
  }
  
  function showAllCompletedGames() {
	  closeModal();
  
	  showAllCompletedGamesInList = true;
	  if (!onlinePlayPaused) {
		onlinePlayEngine.getPastGamesForUserNew(getLoginToken(), showPastGamesCallback);
	  }
  }
  
  var showMyGamesCallback = function showMyGamesCallback(results) {
	var message = "No active games.";
	if (results) {
		message = "";

		populateMyGamesList(results);
		if (localStorage.getItem("data-theme") == "stotes") {
		  message += "<table><tr class='tr-header'><td class='first'>Game Mode</td><td>Host</td><td></td><td>Guest</td><td>Turn</td></tr>";
		  var even = true;
		  for (var index in myGamesList) {
			  var myGame = myGamesList[index];
  
			  var gId = parseInt(myGame.gameId);
			  
			  message += "<tr onclick='jumpToGame(" + gId + "); closeModal();' class='" + ((myGame.isUserTurn)?("highlighted-game"):((even)?("even"):("odd"))) + " '>";
			  message += "<td class='first' style='color:" + getGameColor(myGame.gameTypeDesc) + ";'>" + myGame.gameTypeDesc + "</td>";
			  
			  var icon = "";
			  if (myGame.hostOnline) {
				  icon = userOnlineIcon;
			  } else {
				  icon = userOfflineIcon;
			  }
			  message += "<td class='name'>" + icon + myGame.hostUsername + "</td>";
			  message += "<td>vs.</td>";

			  var icon = "";
			  if (myGame.guestOnline) {
				  icon = userOnlineIcon;
			  } else {
				  icon = userOfflineIcon;
			  }
			  message += "<td class='name'>" + icon + myGame.guestUsername + "</td>";
			  if (myGame.isUserTurn) {
				  message += "<td>Yours</td>";
			  } else {
				  message += "<td>Theirs</td>";
			  }
			  message += "</tr>";

			  for (var i = 0; i < myGame.gameOptions.length; i++) {
				  message += "<tr onclick='jumpToGame(" + gId + "); closeModal();' class='" + ((even)?("even"):("odd")) + "'><td class='first'><em>-Game Option</em></td><td colspan='5'>" + getGameOptionDescription(myGame.gameOptions[i]) + "</em></td></tr>";
			  }
			  even = !even;
		  }
		  message += "<tr class='tr-footer'><td class='first'>Game Mode</td><td>Host</td><td></td><td>Guest</td><td></td></tr></table>";
		} else {
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
			  var userIsGuest = usernameEquals(myGame.guestUsername);
  
			  var gameDisplayTitle = "";
  
			  if (!userIsHost) {
				  if (myGame.hostOnline) {
					  gameDisplayTitle += userOnlineIcon;
				  } else {
					  gameDisplayTitle += userOfflineIcon;
				  }
			  }
			  gameDisplayTitle += myGame.hostUsername;
			  gameDisplayTitle += " vs. ";
			  if (!userIsGuest) {
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
			  message += "<div class='clickableText' onclick='jumpToGame(" + gId + "); closeModal();'>" + gameDisplayTitle + "</div>";
			  for (var i = 0; i < myGame.gameOptions.length; i++) {
				  message += "<div>&nbsp;&bull;&nbsp;<em>Game Option: " + getGameOptionDescription(myGame.gameOptions[i]) + "</em></div>"
			  }
		  }
		}
	}
	message += "<br /><br /><div class='clickableText' onclick='showPastGamesClicked();'>Show completed games</div>";

	message += "<br /><hr /><div><span class='skipBonus' onclick='showGameStats();'>Completed Game Stats</span></div>";
	message += "<br /><div><span class='skipBonus' onclick='viewGameRankingsClicked();'><i class='fa fa-tachometer' aria-hidden='true'></i> Game Rankings</span></div>";
	message += "<br /><div><span class='skipBonus' onclick='showPreferences();'>Device Preferences</span></div><br />";

	message += "<br /><br /><div>You are currently signed in as " + getUsername() + ". <span class='skipBonus' onclick='showSignOutModal();'>Click here to sign out.</span></div>";
	// message += "<br /><div><span class='skipBonus' onclick='showAccountSettings();'>Account Settings</span></div><br />";
	showModal("Active Games", message);
};
  
  function showMyGames() {
	  if (!onlinePlayPaused) {
		showModal("Active Games", getLoadingModalText());
		onlinePlayEngine.getCurrentGamesForUserNew(getLoginToken(), showMyGamesCallback);
	  } else {
		showOnlinePlayPausedModal();
	  }
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
	  requestNotificationPermission();
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
		//   sendJoinGameChatMessage = true;
		  jumpToGame(gameSeek.gameId);
		  closeModal();
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
			askToJoinGame(gameSeek.gameId, gameSeek.hostUsername, gameSeek.rankedGame);
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
	Object.keys(GameType).forEach(function(key, index) {
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
	var message = "";
	var gameSeeksDisplayed = false;
	if (results) {
		message = "";
		var resultRows = results.split('\n');

		gameSeekList = [];

		for (var index in resultRows) {
			var row = resultRows[index].split('|||');
			var gameSeek = {
				gameId: parseInt(row[0]),
				gameTypeId: parseInt(row[1]),
				gameTypeDesc: row[2],
				hostId: row[3],
				hostUsername: row[4],
				hostOnline: parseInt(row[5]),
				gameOptions: parseGameOptions(row[6]),
				hostRating: parseInt(row[7]),
				rankedGame: row[8],
				gameClock: row[9]
			};
			if (gameSeek.gameClock) {
				gameSeek.gameClock = GameClock.decodeGameClock(gameSeek.gameClock);
			}
			gameSeekList.push(gameSeek);
		}
		var gameTypeHeading = "";
		
		if (localStorage.getItem("data-theme") == "stotes") {
			message += "<table><tr class='tr-header'><td>Game Mode</td><td>Host</td><td>Ranking</td></tr>";
			var even = true;
			for (var index in gameSeekList) {
				var gameSeek = gameSeekList[index];
				if (
					gameDevOn
					|| !getGameTypeEntryFromId(gameSeek.gameTypeId).usersWithAccess
					|| usernameIsOneOf(getGameTypeEntryFromId(gameSeek.gameTypeId).usersWithAccess)
				) {
					message += "<tr onclick='acceptGameSeekClicked(" + parseInt(gameSeek.gameId) + ");' class='gameSeekEntry " + ((even)?("even"):("odd")) + "'>";
					message += "<td style='color:" + getGameColor(gameSeek.gameTypeDesc) + ";'>" + gameSeek.gameTypeDesc + "</td>";
					
					var icon = userOfflineIcon;
					if (gameSeek.hostOnline) { icon = userOnlineIcon; }
					message += "<td>" + icon + gameSeek.hostUsername + "</td>";
					
					if (gameSeek.rankedGame) {
						message += "<td>" + gameSeek.hostRating + "</td>"
					} else {
						message += "<td>N/A</td>";
					}
					message += "</tr>";

					for (var i = 0; i < gameSeek.gameOptions.length; i++) {
						message += "<tr onclick='acceptGameSeekClicked(" + parseInt(gameSeek.gameId) + ");' class='" + ((even)?("even"):("odd")) + "'><td colspan='3'><em>-Game Option: " + getGameOptionDescription(gameSeek.gameOptions[i]) + "</em></td></tr>";
					}
					even = !even;
					gameSeeksDisplayed = true;
				}
			}
			message += "<tr class='tr-footer'><td>Game Mode</td><td>Host</td><td>Ranking</td></tr></table>";
		} else {
			for (var index in gameSeekList) {
				var gameSeek = gameSeekList[index];
				if (
					gameDevOn
					|| !getGameTypeEntryFromId(gameSeek.gameTypeId).usersWithAccess
					|| usernameIsOneOf(getGameTypeEntryFromId(gameSeek.gameTypeId).usersWithAccess)
				) {
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
					message += "<div><div class='clickableText gameSeekEntry' onclick='acceptGameSeekClicked(" + parseInt(gameSeek.gameId) + ");'>Host: " + hostOnlineOrNotIconText + gameSeek.hostUsername;
					if (gameSeek.rankedGame) {
						message += " (" + gameSeek.hostRating + ")"
					}
					message += "</div>";
					for (var i = 0; i < gameSeek.gameOptions.length; i++) {
						message += "<div>&nbsp;&bull;&nbsp;<em>Game Option: " + getGameOptionDescription(gameSeek.gameOptions[i]) + "</em></div>"
					}
					message += "</div>";
					gameSeeksDisplayed = true;
				}
			}
		}
	}

	if (!gameSeeksDisplayed) {
		message = "No games available to join. You can create a new game, or join <a href='https://discord.gg/thegardengate' target='_blank'>Join the Discord</a> to find people to play with!";
	}

	message += "<br /><br /><em><div id='activeGamesCountDisplay' style='font-size:smaller'>&nbsp;</div></em>";

	onlinePlayEngine.getActiveGamesCount(getActiveGamesCountCallback);

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
		if (!onlinePlayPaused) {
			showModal("Join a game", getLoadingModalText());
			onlinePlayEngine.getGameSeeks(getGameSeeksCallback);
		} else {
			showOnlinePlayPausedModal();
		}
	} else if (onlinePlayEnabled) {
		var message = "<span class='skipBonus' onclick='loginClicked();'>Sign in</span> to play real-time games with others online. When you are signed in, this is where you can join games against other players.";
		message += "<br /><br /><em><div id='activeGamesCountDisplay' style='font-size:smaller'>&nbsp;</div></em>";
		showModal("Join a game", message);
		onlinePlayEngine.getActiveGamesCount(getActiveGamesCountCallback);
	} else {
		showModal("Join a game", "Online play is disabled right now. Maybe you are offline. Try again later!");
	}
}

var getActiveGamesCountCallback = function getActiveGamesCountCallback(count) {
	var activeCountDiv = document.getElementById('activeGamesCountDisplay');
	if (activeCountDiv) {
		activeCountDiv.innerText = count + " games active in the past 24 hours!";
	}
};
  
/* Creating a public game */
var yesCreateGame = function yesCreateGame(gameTypeId, rankedGame) {
	var rankedInd = 'n';
	if (rankedGame && !getGameTypeEntryFromId(gameTypeId).noRankedGames) {
		rankedInd = 'y';
	}
	var gameClockJson = null;
	if (GameClock.currentClock && GameClock.currentClock.getJsonObjectString) {
		gameClockJson = GameClock.currentClock.getJsonObjectString();
	}
	onlinePlayEngine.createGame(gameTypeId, encodeURIComponent(gameController.gameNotation.notationTextForUrl()), JSON.stringify(ggOptions), '', getLoginToken(), createGameCallback,
		rankedInd, gameClockJson);
};
  
var yesCreatePrivateGame = function yesCreatePrivateGame(gameTypeId, rankedGame) {
	var rankedInd = 'n';
	if (rankedGame && !getGameTypeEntryFromId(gameTypeId).noRankedGames) {
		rankedInd = 'y';
	}
	var gameClockJson = null;
	if (GameClock.currentClock && GameClock.currentClock.getJsonObjectString) {
		gameClockJson = GameClock.currentClock.getJsonObjectString();
	}
	onlinePlayEngine.createGame(gameTypeId, encodeURIComponent(gameController.gameNotation.notationTextForUrl()), JSON.stringify(ggOptions), 'Y', getLoginToken(), createPrivateGameCallback,
		rankedInd, gameClockJson);
};

function replaceWithLoadingText(element) {
	element.innerHTML = getLoadingModalText();
}

function getCheckedValue(checkboxId) {
	var element = document.getElementById(checkboxId);
	return element && element.checked;
}
  
var getCurrentGameSeeksHostedByUserCallback = function getCurrentGameSeeksHostedByUserCallback(results) {
	var gameTypeId = tempGameTypeId;
	if (!results) {
		// If a solitaire game, automatically create game, as it'll be automatically joined.
		if (gameController.isSolitaire()) {
			yesCreateGame(gameTypeId);
		} else {
			var message = "<div>Do you want to create a game for others to join?</div>";
			if (!getGameTypeEntryFromId(gameTypeId).noRankedGames) {
				var checkedValue = getBooleanPreference(createNonRankedGamePreferredKey) ? "" : "checked='true'";
				message += "<br /><div><input id='createRankedGameCheckbox' type='checkbox' onclick='toggleBooleanPreference(createNonRankedGamePreferredKey);' " + checkedValue + "'><label for='createRankedGameCheckbox'> Ranked game (Player rankings will be affected and - coming soon - publicly viewable game)</label></div>";
			}

			if (GameClock.userHasGameClockAccess()) {
				message += "<br /><div id='timeControlsDropdownContainer'></div>";
			}

			if (!gameController.isInviteOnly) {
				message += "<br /><div class='clickableText' onclick='replaceWithLoadingText(this); yesCreateGame(" + gameTypeId + ", !getBooleanPreference(createNonRankedGamePreferredKey)); closeModal();'>Yes - create public game</div>";
			}
			message += "<br /><div class='clickableText' onclick='replaceWithLoadingText(this); yesCreatePrivateGame(" + gameTypeId + ", !getBooleanPreference(createNonRankedGamePreferredKey)); closeModal();'>Yes - create an invite-link game</div>";
			message += "<br /><div class='clickableText' onclick='closeModal(); finalizeMove();'>No - local game only</div>";
			showModal("Create game?", message);
			if (GameClock.userHasGameClockAccess()) {
				setTimeout(function() {
					var timeControlsDiv = document.getElementById("timeControlsDropdownContainer");
					if (timeControlsDiv) {
						timeControlsDiv.appendChild(GameClock.getTimeControlsDropdown());
					}
				}, 50);
			}
		}
	} else {
		finalizeMove();
		var message = "";
		if (userIsLoggedIn()) {
			message = "<div>You already have a public game waiting for an opponent. Do you want to create a private game for others to join?</div>";
			if (!getGameTypeEntryFromId(gameTypeId).noRankedGames) {
				var checkedValue = getBooleanPreference(createNonRankedGamePreferredKey) ? "" : "checked='true'";
				message += "<br /><div><input id='createRankedGameCheckbox' type='checkbox' onclick='toggleBooleanPreference(createNonRankedGamePreferredKey);' " + checkedValue + "'><label for='createRankedGameCheckbox'> Ranked game (Player rankings will be affected and - coming soon - publicly available game)</label></div>";
			}
			if (GameClock.userHasGameClockAccess()) {
				message += "<br /><div id='timeControlsDropdownContainer'></div>";
			}
			message += "<br /><div class='clickableText' onclick='replaceWithLoadingText(this); yesCreatePrivateGame(" + gameTypeId + ", !getBooleanPreference(createNonRankedGamePreferredKey)); closeModal();'>Yes - create a private game with a friend</div>";
			message += "<br /><div class='clickableText' onclick='closeModal(); finalizeMove();'>No - local game only</div>";
			showModal("Create game?", message);
		} else {
			message = "You are not signed in. ";
			message += "<br /><br />You can still play the game locally, but it will not be saved online.";
			showModal("Game Not Created", message);
			if (GameClock.userHasGameClockAccess()) {
				setTimeout(function() {
					var timeControlsDiv = document.getElementById("timeControlsDropdownContainer");
					if (timeControlsDiv) {
						timeControlsDiv.appendChild(GameClock.getTimeControlsDropdown());
					}
				}, 50);
			}
		}
	}
};
  
var tempGameTypeId;
function createGameIfThatIsOk(gameTypeId) {
	tempGameTypeId = gameTypeId;
	if (playingOnlineGame()) {
		callSubmitMove();
	} else if (userIsLoggedIn() && window.navigator.onLine && !onlinePlayPaused) {
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
			timestamp: row[0],
			username: row[1],
			message: row[2]
		};
		chatMessageList.push(chatMessage);
		lastGlobalChatTimestamp = chatMessage.timestamp;
	}

	// if (actuallyLoadMessages) {

	for (var index in chatMessageList) {
		var chatMessage = chatMessageList[index];
		newChatMessagesHtml += "<div class='chatMessage'><strong>" + chatMessage.username + ":</strong> " + chatMessage.message.replace(/&amp;/g, '&') + "</div>";
	}

	/* Prepare to add chat content and keep scrolled to bottom */
	var chatMessagesDisplay = document.getElementById('globalChatMessagesDisplay');
	// allow 1px inaccuracy by adding 1
	var isScrolledToBottom = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight <= chatMessagesDisplay.scrollTop + 1;
	var newElement = document.createElement("div");
	newElement.innerHTML = newChatMessagesHtml;
	chatMessagesDisplay.appendChild(newElement);
	// scroll to bottom if isScrolledToBottom
	if (isScrolledToBottom) {
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

/* This is AKA Display Links tab content */
function resetGlobalChats() {
	// Clear all global chats..
	//   document.getElementById('globalChatMessagesDisplay').innerHTML = "<strong>SkudPaiSho: </strong> Hi everybody! To chat with everyone, ask questions, or get help, join The Garden Gate <a href='https://discord.gg/thegardengate' target='_blank'>Discord server</a>.<hr />";
}

function fetchInitialGlobalChats() {
	//   resetGlobalChats();

	// Fetch global chats..
	//   onlinePlayEngine.getInitialGlobalChatMessages(getInitialGlobalChatsCallback);
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
	// fetchGlobalChats();
}

var LOG_ONLINE_STATUS_INTERVAL = 5000;
function startLoggingOnlineStatus() {
	onlinePlayEngine.logOnlineStatus(getLoginToken(), emptyCallback);

	// fetchInitialGlobalChats();

	clearLogOnlineStatusInterval();

	logOnlineStatusIntervalValue = setInterval(function() {
		if (!onlinePlayPaused) {
			logOnlineStatusPulse();
		}
	}, LOG_ONLINE_STATUS_INTERVAL);
}

function clearLogOnlineStatusInterval() {
	if (logOnlineStatusIntervalValue) {
		clearInterval(logOnlineStatusIntervalValue);
		logOnlineStatusIntervalValue = null;
	}
}

function setSidenavNewGameSection() {
	var message = "";

	Object.keys(GameType).forEach(function(key, index) {
		message += getSidenavNewGameEntryForGameType(GameType[key]);
	});

	document.getElementById("sidenavNewGameSection").innerHTML = message;
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function closeGame() {
	if (gameDevOn) {
		setGameController(GameType.Ginseng.id);
		return;
	}
	var defaultGameTypeIds = [
		GameType.SkudPaiSho.id,
		GameType.VagabondPaiSho.id,
		GameType.Adevar.id,
		GameType.Ginseng.id
	]
	setGameController(defaultGameTypeIds[randomIntFromInterval(0, defaultGameTypeIds.length - 1)]);
	showDefaultGameOpenedMessage(true);
}

function getSidenavNewGameEntryForGameType(gameType) {
	return "<div class='sidenavEntry'><span class='sidenavLink skipBonus' onclick='setGameController(" + gameType.id + "); closeModal();'>" + gameType.desc + "</span><span>&nbsp;-&nbsp;<i class='fa fa-book' aria-hidden='true'></i>&nbsp;</span><a href='" + gameType.rulesUrl + "' target='_blank' class='newGameRulesLink sidenavLink'>Rules</a></div>";
}

function getNewGameEntryForGameType(gameType) {
	if (
		gameDevOn
		|| !gameType.usersWithAccess
		|| usernameIsOneOf(gameType.usersWithAccess)
	) {
		if (localStorage.getItem("data-theme") == "stotes") {
			var small = "small";
			if (gameType.desc == "Skud Pai Sho") {
				small = "";
			}
			if (gameType.desc == "Adevăr Pai Sho") {
				small = "";
			}
			if (gameType.desc == "Vagabond Pai Sho") {
				small = "";
			}
			return '<div class="gameDiv '+small+'" style="background-color:'+gameType.color+';"><img ondblclick="setGameController(' + gameType.id + '); closeModal();" src="style/game-icons/' + gameType.coverImg + '"><h3 onclick="setGameController(' + gameType.id + '); closeModal();">' + gameType.desc + '</h3><div class="gameDiv-hidden"><span class="rulesSpan"><i class="fa fa-book" aria-hidden="true"></i>&nbsp;<a href="' + gameType.rulesUrl + '" target="_blank">Rules</a></span><p>'+gameType.description+'</p></div></div>';
		} else {
			return "<div class='newGameEntry'><span class='clickableText' onclick='setGameController(" + gameType.id + "); closeModal();'>" + gameType.desc + "</span><span>&nbsp;-&nbsp;<i class='fa fa-book' aria-hidden='true'></i>&nbsp;</span><a href='" + gameType.rulesUrl + "' target='_blank' class='newGameRulesLink'>Rules</a></div>";
		}
	}
	return "";
}

function newGameClicked() {
	var message = "<div class='gameDivContainer'>";

	Object.keys(GameType).forEach(function(key, index) {
		message += getNewGameEntryForGameType(GameType[key]);
	});

	message += "</div>";

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
		if (!onlinePlayPaused) {
			loadNumberOfGamesWhereUserTurn();
		}
	}, USER_TURN_GAME_WATCH_INTERVAL);
}
  
var sendChatCallback = function sendChatCallback(result) {
	document.getElementById('sendChatMessageButton').innerHTML = "Send";
	var chatMsg = document.getElementById('chatMessageInput').value;
	document.getElementById('chatMessageInput').value = "";

	if (result && result === 'true') { 	// Did not send
		document.getElementById('chatMessageInput').value = "---Message blocked by filter--- " + chatMsg;
	}
};
  
var sendChat = function(chatMessageIfDifferentFromInput) {
	var chatMessage = htmlEscape(document.getElementById('chatMessageInput').value).trim();
	if (chatMessageIfDifferentFromInput) {
		chatMessage = chatMessageIfDifferentFromInput;
	}
	chatMessage = chatMessage.replace(/\n/g, ' ');	// Convert newlines to spaces.
	if (chatMessage) {
		document.getElementById('sendChatMessageButton').innerHTML = "<i class='fa fa-circle-o-notch fa-spin fa-fw'>";
		onlinePlayEngine.sendChat(gameId, getLoginToken(), chatMessage, sendChatCallback);
	}

	processChatCommands(chatMessage);
}

var processChatCommands = function(chatMessage) {
	/* Secret easter eggs... */
	if (chatMessage.toLowerCase().includes('spoopy')) {
		new AdevarOptions();
		AdevarOptions.commenceSpoopy();
	}

	if (chatMessage.toLowerCase().includes('tree years')) {
		promptForAgeToTreeYears();
	}

	if (chatMessage.toLowerCase().includes('halloween')) {
		paiShoBoardDesignTypeValuesDefault['halloween2021'] = 'Halloween';
		buildBoardDesignsValues();
		clearMessage();
	}
};

function promptForAgeToTreeYears() {
	var message = "<br />Age: <input type='text' id='humanAgeInput' name='humanAgeInput' />";
	message += "<br /><div class='clickableText' onclick='submitHumanAge()'>Convert to tree years</div>";
	message += "<br /><div id='treeYearsResult'></div>";
	message += "<br /><br /><div>Confused? <a href='https://discord.gg/thegardengate' target='_blank'>Join the Discord</a>! :))</div>";
	showModal("How Old Are You in Tree Years?", message);
}

function submitHumanAge() {
	var age = document.getElementById("humanAgeInput").value;
	if (!isNaN(age)) {
		document.getElementById("treeYearsResult").innerText = humanYearsToTreeYears(parseInt(age, 10));
	}
}
  
document.getElementById('chatMessageInput').onkeypress = function(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13) {
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

/* document.getElementById('globalChatMessageInput').onkeypress = function(e){
	 var code = (e.keyCode ? e.keyCode : e.which);
	  if(code == 13) {
		sendGlobalChat();
	  }
}; */

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
	message += gameController.gameNotation.getNotationForEmail().replace(/\[BR\]/g, '<br />');
	message += "</div><br />";

	showModal("Game Notation", message);
}

function showGameReplayLink() {
	// if (currentGameData.hostUsername && currentGameData.guestUsername) {
	var notation = gameController.getNewGameNotation();
	for (var i = 0; i < currentMoveIndex; i++) {
		notation.addMove(gameController.gameNotation.moves[i]);
	}
	//   rerunAll();	// Seems like this shouldn't be here.

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
	var message = "Here is the <a id='gameReplayLink' href=\"" + linkUrl + "\" target='_blank'>game replay link</a> to the current point in the game.";
	if (playingOnlineGame()) {
		message += "<br /><br />";
		message += "Here is the <a href=\"" + buildSpectateUrl() + "\" target='_blank'>spectate link</a> others can use to watch the game live and participate in the Game Chat.";
	}
	showModal("Game Links", message);

	getShortUrl(linkUrl, function(shortUrl) {
		var linkTag = document.getElementById('gameReplayLink');
		if (linkTag) {
			linkTag.setAttribute("href", shortUrl);
		}
	});
}

function buildSpectateUrl() {
	if (gameId > 0) {
		linkUrl = LZString.compressToEncodedURIComponent("wg=" + gameId);
		linkUrl = sandboxUrl + "?" + linkUrl;
		return linkUrl;
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
		setTimeout(function() {
			setAiIndex(1);
		}, 2000);
	}
}

/* Sidenav */
function openNav() {
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target !== document.getElementById("mySidenav")
			&& event.target !== document.getElementById("sidenavMenuButton")
			&& event.target !== document.getElementById("siteHeading")
			&& event.target !== document.getElementById("websiteStyleDropdown")) {
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

function quitOnlineGameCallback() {
	if (currentGameData) {
		setGameController(currentGameData.gameTypeId);
	} else {
		closeGame();
	}
}

function iAmPlayerInCurrentOnlineGame() {
	return usernameEquals(currentGameData.hostUsername) || usernameEquals(currentGameData.guestUsername);
}

function quitOnlineGame() {
	// TODO eventually make it so if guest never made a move, then player only "leaves" game instead of updating the game result, so it returns to being an available game seek.
	if (gameController.guestNeverMoved && gameController.guestNeverMoved()) {
		// Guest never moved, only leave game. TODO
	}// else {....}

	if (iAmPlayerInCurrentOnlineGame()) {
		onlinePlayEngine.updateGameWinInfoAsTie(gameId, 8, getLoginToken(), quitOnlineGameCallback);
	}
}

function quitInactiveOnlineGame() {
	if (iAmPlayerInCurrentOnlineGame()
		&& !getGameWinner()
		&& (currentGameData.hostUsername === currentGameData.guestUsername
			|| (!myTurn() && onlineGameIsOldEnoughToBeQuit()))
	) {
		onlinePlayEngine.updateGameWinInfoAsTie(gameId, 10, getLoginToken(), quitOnlineGameCallback);
	}
}
  
function quitOnlineGameClicked() {
	var message = "";
	if (playingOnlineGame() && iAmPlayerInCurrentOnlineGame()
		&& !getGameWinner()
		&& (currentGameData.hostUsername === currentGameData.guestUsername
			|| (!myTurn() && onlineGameIsOldEnoughToBeQuit()))
	) {
		message = "<div>Are you sure you want to quit and end this inactive game? The game will appear as Inactive in your Completed Games list, but will become active again when your opponent plays.</div>";
		message += "<br /><div class='clickableText' onclick='closeModal(); quitInactiveOnlineGame();'>Yes - mark current game inactive</div>";
		message += "<br /><div class='clickableText' onclick='closeModal();'>No - cancel</div>";
	} else {
		message = "When playing an unfinished inactive online game, this is where you can mark the game inactive to hide it from your My Games list.";
	}

	showModal("Quit Current Online Game", message);
}

function resignOnlineGame() {
	if (playingOnlineGame()
		&& iAmPlayerInCurrentOnlineGame()
		&& !getGameWinner()
		&& myTurn()
	) {
		var hostResultCode = usernameEquals(currentGameData.hostUsername) ? 0 : 1;
		var newPlayerRatings = {};
		if (currentGameData.isRankedGame && currentGameData.hostUsername !== currentGameData.guestUsername) {
			newPlayerRatings = Elo.getNewPlayerRatings(currentGameData.hostRating, currentGameData.guestRating, hostResultCode);
		}
		onlinePlayEngine.updateGameWinInfo(gameId, getOnlineGameOpponentUsername(), 9, getLoginToken(), quitOnlineGameCallback, 
			currentGameData.isRankedGame, newPlayerRatings.hostRating, newPlayerRatings.guestRating, currentGameData.gameTypeId, currentGameData.hostUsername, currentGameData.guestUsername);
	}
}

function resignOnlineGameClicked() {
	var message = "";
	if (playingOnlineGame() 
		&& iAmPlayerInCurrentOnlineGame()
		&& !getGameWinner()
		&& myTurn()
	) {
		message = "<div>Are you sure you want to resign this game, marking it as your loss?</div>";
		message += "<br /><div class='clickableText' onclick='closeModal(); resignOnlineGame();'>Yes - resign current game</div>";
		message += "<br /><div class='clickableText' onclick='closeModal();'>No - cancel</div>";
	} else {
		message = "When playing an online game, this is where you can resign the game on your turn.";
	}

	showModal("Resign Current Online Game", message);
}

function onlineGameIsOldEnoughToBeQuit() {
	return true;
	/* var currentGameTimestampDate = buildDateFromTimestamp(currentGameData.lastUpdatedTimestamp);
	var nowDate = new Date();
	var difference = nowDate.getTime() - currentGameTimestampDate.getTime();
	var daysDifference = difference / 1000 / 60 / 60 / 24;
	return daysDifference >= 3 || usernameEquals('Zach'); */
}

function buildDateFromTimestamp(timestampStr) {
	return new Date(timestampStr.replace(" ","T"));
}

function showWelcomeScreensClicked() {
	OnboardingFunctions.resetOnBoarding();
	showWelcomeTutorial();
}
  
var tutorialInProgress = false;

function showWelcomeTutorial() {
	tutorialInProgress = true;
	showModal("The Garden Gate", "<div id='tutorialContent'></div>");
	setTimeout(function() { runTutorial(); }, 400);
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
		div1.innerHTML += "<p>Use options in the <strong class='stretchText'>&nbsp;&#8801&nbsp;</strong>side menu to create a new game, join another player's game, or to view your games that are in progress. You can have any number of online games in progress at once.</p>";
		div1.innerHTML += "<p>See the <i class='fa fa-plus-circle' aria-hidden='true'></i> New Game menu to try and learn more about any of the games you can play here.</p>";

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
	if ((playingOnlineGame() && !myTurn() && !getGameWinner())
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
	} else if (usernameIsOneOf(['SkudPaiSho','Adevar'])) {
		message = "Enter list of names:";
		message += "<br /><textarea rows = '11' cols = '40' name = 'description' id='giveawayNamesTextbox'></textarea>";
		message += "<br /><div class='clickableText' onclick='Giveaway.doIt()'>Choose name</div>";
		message += "<br /><div id='giveawayResults'>:)</div>";

		showModal("Giveaway Winner Chooser!", message);
	}
}
  
  function addGameOption(option) {
	  addOption(option);
	  setGameController(gameController.getGameTypeId(), true);
  }
  
  function getGameOptionsMessageHtml(options) {
	  var msg = "<br /><br />";
  
	  var optionsListed = false;
	  if (options && options.length > 0) {
		  msg += "<strong>Add Game Option:</strong><br />";
		for (var i = 0; i < options.length; i++) {
			if (!gameOptionEnabled(options[i])) {
				if (!gameController.optionOkToShow
						|| (gameController.optionOkToShow && gameController.optionOkToShow(options[i]))) {
					msg += "&bull;&nbsp;<span class='skipBonus' onclick='addGameOption(\"" + options[i] + "\");'>" + getGameOptionDescription(options[i]) + "</span><br />";
					optionsListed = true;
				}
			}
		}
	}

	if (!optionsListed) {
		msg = "<br /><br />";
	}
  
	  return msg;
  };
  
  function showBadMoveModal() {
	  clearGameWatchInterval();
	  showModal("Uh Oh", "A move went wrong somewhere. If you see this each time you look at this game, then this game may be corrupt due to players not both using latest updates. The app is not be compatible with new features.<br /><br />Please let your opponent know that you saw this message. You may want to quit this game and try again.<br />Live game updates have been paused.");
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
			  message += "<br /><br /><div class='modalContentHeading collapsibleHeading' onclick='toggleCollapsedContent(this, this.nextElementSibling)' class='collapsed'>Players currently signed up:<span style='float:right'>+</span></div>";
			  message += "<div class='collapsibleContent' style='display:none'>"
			  for (var i = 0; i < tournamentInfo.currentPlayers.length; i++) {
				  message += tournamentInfo.currentPlayers[i].username + "<br />";
				  if (tournamentInfo.currentPlayers[i].username === getUsername()) {
					  playerIsSignedUp = true;
				  }
			  }
			  message += "</div>"
		  }
  
		  message += "<br />";
  
		  if (tournamentInfo.rounds && tournamentInfo.rounds.length > 0) {
			  for (var i = 0; i < tournamentInfo.rounds.length; i++) {
				  var round = tournamentInfo.rounds[i];
				  var roundName = htmlEscape(round.name);
				  message += "<br /><div class='collapsibleHeading' onclick='toggleCollapsedContent(this, this.nextElementSibling)' class='collapsed'>" + roundName + "<span style='float:right'>+</span></div>";
				  message += "<div class='collapsibleContent' style='display:none;'>"
				  /* Display all games for round */
				  var gamesFoundForRound = false;
				  for (var j = 0; j < tournamentInfo.games.length; j++) {
					  var game = tournamentInfo.games[j];
					  if (game.roundId === round.id) {
						  message += "<div class='clickableText' onclick='matchGameClicked(" + game.gameId + ")'>" + htmlEscape(game.gameType) + ": ";
  
						  if (!game.gameWinnerUsername
								  && game.lastPlayedUsername
								  && game.lastPlayedUsername !== game.hostUsername) {
							  message += "<em>";
						  }
						  if (game.gameWinnerUsername && game.gameWinnerUsername === game.hostUsername) {
							  message += "[";
						  }
						  message += game.hostUsername;
						  if (game.gameWinnerUsername && game.gameWinnerUsername === game.hostUsername) {
							  message += "]";
						  }
						  if (!game.gameWinnerUsername
								  && game.lastPlayedUsername
								  && game.lastPlayedUsername !== game.hostUsername) {
							  message += "</em>";
						  }
  
						  message += " vs ";
  
						  if (!game.gameWinnerUsername
								  && game.lastPlayedUsername
								  && game.lastPlayedUsername !== game.guestUsername) {
							  message += "<em>";
						  }
						  if (game.gameWinnerUsername && game.gameWinnerUsername === game.guestUsername) {
							  message += "[";
						  }
						  message += game.guestUsername;
						  if (game.gameWinnerUsername && game.gameWinnerUsername === game.guestUsername) {
							  message += "]";
						  }
						  if (!game.gameWinnerUsername
								  && game.lastPlayedUsername
								  && game.lastPlayedUsername !== game.guestUsername) {
							  message += "</em>";
						  }

						  if (game.gameResultId && game.gameResultId === 4) {	/* 4 is tie/draw */
							message += " [draw]";
						  }
  
						  message += "</div>";
  
						  gamesFoundForRound = true;
					  }
				  }
  
				  if (!gamesFoundForRound) {
					  message += "<div><em>No games</em></div>"
				  }
				  message += "</div>"
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
	  closeModal();
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
  
		  var mostRecentRound = null;
		  if (resultData.rounds && resultData.rounds.length > 0) {
			  for (var i = 0; i < resultData.rounds.length; i++) {
				  var round = resultData.rounds[i];
				  mostRecentRound = round;
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

			  /* Automatically select the most recent Round for match creating */
			  setTimeout(function(){
				  roundClicked(mostRecentRound.id, htmlEscape(mostRecentRound.name));
			  }, 200);
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
  
//   function toggleDarkMode() {
// 	  var currentTheme = localStorage.getItem("data-theme") || "dark";
// 	  localStorage.setItem("data-theme", currentTheme === "dark" ? "light" : "dark");
// 	  applyDataTheme();
//   }
  
//   function applyDataTheme() {
// 	  var currentTheme = localStorage.getItem("data-theme") || "dark";
// 	  document.body.setAttribute("data-theme", currentTheme);
//   }
function setWebsiteTheme(theme) {
	var previousTheme = localStorage.getItem("data-theme");

	if (theme === "dark") {
		localStorage.setItem("data-theme", "dark");
		document.body.setAttribute("data-theme", "dark");
		removeExtraCSS();
	} else if (theme === "light") {
		localStorage.setItem("data-theme", "light");
		document.body.setAttribute("data-theme",  "light");
		removeExtraCSS();
	} else if (theme === "stotes") {
		localStorage.setItem("data-theme", "stotes");
		setExtraCSS("style/themes/chuji.css");
		// Add Logo
		var heading = document.getElementById("siteHeading");
		var headingHolder = heading.parentElement;
		var logo = document.createElement("img");
		logo.style = "margin-left:10px;";
		logo.src = "style/logo.png";
		logo.id = "logo";
		headingHolder.replaceChild(logo, heading);
		// Remove | Dividers
		var x = document.getElementsByClassName("headerRight");
		for(var i = 0; i < x.length; i ++) {
			if (x[i].innerHTML == "&nbsp;|&nbsp;") {
				x[i].remove();
			}
			if (x[i].innerText == "") {
				x[i].innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Shop';
				if (window.mobileAndTabletcheck()) {
					x[i].remove();
				}
		  	}
		}
	} else {
		debug("Unsupported theme chosen, default to dark.");
		localStorage.setItem("data-theme", "dark");
		document.body.setAttribute("data-theme", "dark");
		removeExtraCSS();
	}

	/* Prompt for page refresh to fully apply theme if needed (i.e. changing from stotes to dark/light for now) */
	if (previousTheme === "stotes" && theme !== previousTheme) {
		var yesNoOptions = {};
		yesNoOptions.yesText = "OK - Refresh site now";
		yesNoOptions.yesFunction = function() {
			location.reload();
		};
		yesNoOptions.noText = "Cancel - Revert theme";
		yesNoOptions.noFunction = function() {
			closeModal();
			setWebsiteTheme("stotes");
		};
		showModal(
			"Changing Theme",
			"To apply this theme, you will need to refresh the website.",
			false,
			yesNoOptions);
	}
}
function removeExtraCSS() {
	var styleLink = document.getElementById("overrideCSS");
	styleLink.href = "";
}
function setExtraCSS(fileName) {
	var styleLink = document.getElementById("overrideCSS");
	if (styleLink.href != fileName) {
		styleLink.href = fileName + "?v=2";
	}
}

/* Game Controller classes should call these for user's preferences */
function getUserGamePrefKeyName(preferenceKey) {
	return "GameType" + gameController.getGameTypeId() + preferenceKey;
}
function getUserGamePreference(preferenceKey) {
	if (gameController && gameController.getGameTypeId) {
		var keyName = getUserGamePrefKeyName(preferenceKey);
		return localStorage.getItem(keyName);
	}
}
function setUserGamePreference(preferenceKey, value) {
	if (gameController && gameController.getGameTypeId) {
		var keyName = getUserGamePrefKeyName(preferenceKey);
		localStorage.setItem(keyName, value);
	}
}

function buildPreferenceDropdownDiv(labelText, dropdownId, valuesObject, preferenceKey) {
	return buildDropdownDiv(dropdownId, labelText + ":", valuesObject,
				getUserGamePreference(preferenceKey),
				function() {
					setUserGamePreference(preferenceKey, this.value);
					gameController.callActuate();
					if (gameController.gamePreferenceSet) {
						gameController.gamePreferenceSet(preferenceKey);
					}
				});
};
  
function setGameLogText(text) {
	var newText = '';
	if (text) {
		newText = text;
	}
	document.getElementById('gameLogText').innerText = newText;
}
  
  
  
  
  
  
/* Notifications work */
function requestNotificationPermission() {
	if (Notification.permission !== "denied") {
		Notification.requestPermission().then(function(permission) {
			// If the user accepts, let's create a notification
			if (permission === "granted") {
				debug("Notifications granted");
			}
		});
	}
}
  
function notifyMe() {
	notifyThisMessage("It's your turn, bub");
}

function notifyThisMessage(message) {
	// Let's check if the browser supports notifications
	// if (!("Notification" in window)) {
	//   alert("This browser does not support desktop notification");
	// } else.....

	// Let's check whether notification permissions have already been granted
	if (!document.hasFocus() && Notification.permission === "granted") {
		// If it's okay let's create a notification
		var notification = new Notification(message);
	}

	// Otherwise, we need to ask the user for permission
	// else if (Notification.permission !== "denied") {
	//   Notification.requestPermission().then(function (permission) {
	// 	// If the user accepts, let's create a notification
	// 	if (permission === "granted") {
	// 	  var notification = new Notification(message);
	// 	}
	//   });
	// }

	// At last, if the user has denied notifications, and you
	// want to be respectful there is no need to bother them any more.
}
  
/* Keyboard shortcuts */
document.onkeyup = function(e) {
	if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 67) {
		/* Ctrl + Alt + C */
		closeGame();
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 83) {
		/* Ctrl + Alt + S */
		sandboxFromMove();
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 82) {
		/* Ctrl + Alt + R */
		toggleReplayControls();
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 39) {
		/* Ctrl + Alt + -> */
		playNextMove(true);
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 37) {
		/* Ctrl + Alt + <- */
		playPrevMove(true);
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 191) {
		/* Ctrl + Alt + / */
		playAllMoves();
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 190) {
		/* Ctrl + Alt + > */
		playNextMove(true);
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 188) {
		/* Ctrl + Alt + < */
		playPrevMove(true);
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 78) {
		/* Ctrl + Alt + N */
		newGameClicked();
	}
};
  
/* Sound */
function toggleSoundOn() {
	soundManager.toggleSoundOn();
}

function toggleAnimationsOn() {
	if (isAnimationsOn()) {
		localStorage.setItem(animationsOnKey, "false");
	} else {
		localStorage.setItem(animationsOnKey, "true");
	}
	if (gameController.setAnimationsOn) {
		gameController.setAnimationsOn(isAnimationsOn());
	}
}

function isAnimationsOn() {
	return localStorage.getItem(animationsOnKey) !== "false";
}
  
  // For iOS
window.addEventListener('touchstart', function() {
	soundManager.makeNoNoise();
}, false);

function isTimestampsOn() {
	return localStorage.getItem(showTimestampsKey) === "true";
}
function toggleTimestamps() {
	localStorage.setItem(showTimestampsKey, !isTimestampsOn());
	clearGameChats();
}
function isMoveLogDisplayOn() {
	return localStorage.getItem(showMoveLogsInChatKey) === "true";
}
function toggleMoveLogDisplay() {
	localStorage.setItem(showMoveLogsInChatKey, !isMoveLogDisplayOn());
	clearGameChats();
}

function clearGameChats() {
	document.getElementById('chatMessagesDisplay').innerHTML = "";
	lastChatTimestamp = '1970-01-01 00:00:00';
}

function isMoveConfirmationRequired() {
	return localStorage.getItem(confirmMoveKey) !== "false";
}

function toggleConfirmMovePreference() {
	localStorage.setItem(confirmMoveKey, !isMoveConfirmationRequired());
}

function showConfirmMoveButton() {
	showReplayControls();
	document.getElementById('confirmMoveButton').classList.remove('gone');
	OnboardingFunctions.showConfirmMoveButtonHelp();
}

function hideConfirmMoveButton() {
	document.getElementById('confirmMoveButton').classList.add('gone');
}

function confirmMoveClicked() {
	callSubmitMove(submitMoveData.moveAnimationBeginStep, true, confirmMoveToSubmit);
	hideConfirmMoveButton();
}

var customBackgroundColor = "";

const isValidColor = (strColor) => {
	const s = new Option().style;
	s.color = strColor;
	return s.color !== '';
}

function setBackgroundColor(colorValueStr) {
	if (isValidColor(colorValueStr)) {
		document.body.style.background = colorValueStr;
	}
}

function setCustomBgColorFromInput() {
	var customValueInput = document.getElementById("customBgColorInput");

	if (customValueInput) {
		var customValue = customValueInput.value;
		if (isValidColor(customValue)) {
			document.body.style.background = customValue;
			localStorage.setItem(customBgColorKey, customValue);
		} else {
			document.body.style.background = "";
			localStorage.removeItem(customBgColorKey);
		}
	}
}

function showPreferences() {
	var message = "";

	var checkedValue = isMoveConfirmationRequired() ? "checked='true'" : "";
	message += "<div><input id='confirmMoveBeforeSubmittingCheckbox' type='checkbox' onclick='toggleConfirmMovePreference();' " + checkedValue + "'><label for='confirmMoveBeforeSubmittingCheckbox'> Confirm move before submitting?</label></div>";

	var customBgColorValue = localStorage.getItem(customBgColorKey);
	if (!customBgColorValue) {
		customBgColorValue = "";
	}
	message += '<br /><div>Custom <code>html</code> background color code: <input type="text" id="customBgColorInput" value="'+ customBgColorValue +'" oninput="setCustomBgColorFromInput()" maxlength="15"></div>';

	var soundOnCheckedValue = soundManager.isMoveSoundsEnabled() ? "checked='true'" : "";
	message += "<br /><div><input id='soundsOnCheckBox' type='checkbox' onclick='toggleSoundOn();' " + soundOnCheckedValue + "'><label for='soundsOnCheckBox'> Move sounds enabled?</label></div>";
	
	var animationsOnCheckedValue = isAnimationsOn() ? "checked='true'" : "";
	message += "<div><input id='animationsOnCheckBox' type='checkbox' onclick='toggleAnimationsOn();' " + animationsOnCheckedValue + "'><label for='animationsOnCheckBox'> Move animations enabled?</label></div>";

	showModal("Device Preferences", message);
}

function getBooleanPreference(key, defaultValue) {
	if (defaultValue && defaultValue.toString() === "true") {
		return localStorage.getItem(key) !== "true";
	} else {
		return localStorage.getItem(key) !== "false";
	}
}
function toggleBooleanPreference(key) {
	localStorage.setItem(key, !getBooleanPreference(key));
}

function show2020GameStats(showWins) {
	onlinePlayEngine.get2020CompletedGameStats(
		getLoginToken(), 
		function(results) {
			if (results) {
				var resultData = {};
				try {
					resultData = JSON.parse(results);
				} catch (error) {
					debug("Error parsing info");
					closeModal();
					showModal("Error", "Error getting stats info.");
				}

				if (resultData.stats) {

					var message = getUsername() + "'s total completed games against other players:<br />";

					var stats = resultData.stats;

					for (var i = 0; i < stats.length; i++) {
						var totalWins = stats[i].totalWins ? stats[i].totalWins : 0;
						var winPercent = Math.round(totalWins / stats[i].totalGamesCompleted * 100);
						if (showWins) {
							message += "<br />" + stats[i].gameType + ": " + stats[i].totalGamesCompleted + " (" + totalWins + " wins, " + winPercent + "%)";
						} else {
							message += "<br />" + stats[i].gameType + ": " + stats[i].totalGamesCompleted;
						}
					}

					if (!showWins) {
						message += "<br /><br /><span class='skipBonus' onclick='show2020GameStats(true);'>Show number of wins for each game</span>";
					}

					showModal("2020 Completed Games Stats", message);
				}
			}
		}
	);
}

function showGameStats(showWins) {
	onlinePlayEngine.getCompletedGameStats(
		getLoginToken(), 
		function(results) {
			if (results) {
				var resultData = {};
				try {
					resultData = JSON.parse(results);
				} catch (error) {
					debug("Error parsing info");
					closeModal();
					showModal("Error", "Error getting stats info.");
				}

				if (resultData.stats) {

					var message = getUsername() + "'s total completed games against other players:<br />";

					var stats = resultData.stats;

					for (var i = 0; i < stats.length; i++) {
						var totalWins = stats[i].totalWins ? stats[i].totalWins : 0;
						var winPercent = Math.round(totalWins / stats[i].totalGamesCompleted * 100);
						if (showWins) {
							message += "<br />" + stats[i].gameType + ": " + stats[i].totalGamesCompleted + " (" + totalWins + " wins, " + winPercent + "%)";
						} else {
							message += "<br />" + stats[i].gameType + ": " + stats[i].totalGamesCompleted;
						}
					}

					if (!showWins) {
						message += "<br /><br /><span class='skipBonus' onclick='showGameStats(true);'>Show number of wins for each game</span>";
					}

					showModal("Completed Games Stats", message);
				}
			}
		}
	);
}

function getShortUrl(urlToShorten, callback) {
	return getTinyUrl(urlToShorten, function(tinyUrl){
		if (tinyUrl.includes(url)) {
			callback(tinyUrl);
		} else {
			var urlEnd = tinyUrl.substring(tinyUrl.indexOf(".com/")+5);
			var encodedEnd = LZString.compressToEncodedURIComponent("tu=" + urlEnd);
			callback(url + "?" + encodedEnd);
		}
	});
}

function getTinyUrl(urlToShorten, callback) {
	if (onlinePlayEnabled) {
		$.get("https://tinyurl.com/api-create.php?url="+urlToShorten, function(shortUrl){
			if (callback && shortUrl) {
				callback(shortUrl);
			}
		});
	} else {
		callback(urlToShorten);
	}
}

function redirectToTinyUrl(tinyUrlSlug) {
	window.location.replace("https://tinyurl.com/" + tinyUrlSlug);
}

function toggleCollapsedContent(headingDiv, contentDiv) {
    if (contentDiv.style.display === "block" || !contentDiv.style.display) {
		contentDiv.style.display = "none";
		headingDiv.children[0].innerText = "+";
		headingDiv.classList.add("collapsed");
    } else {
		contentDiv.style.display = "block";
		headingDiv.classList.remove("collapsed");
    }
}

function setCustomTileDesignsFromInput() {
	var url = document.getElementById('customTileDesignsUrlInput').value;
	url = url.substring(0, url.lastIndexOf("/") + 1);
	if (gameController && gameController.setCustomTileDesignUrl) {
		gameController.setCustomTileDesignUrl(url);
	}
}

function promptForCustomTileDesigns(gameType, existingCustomTilesUrl) {
	var message = "<p>You can use fan-created tile design sets. See the #custom-tile-designs channel in The Garden Gate Discord. Copy and paste the link to one of the images here:</p>";
	// message += "<br />Name: <input type='text' id='customTileDesignsNameInput' name='customTileDesignsNameInput' /><br />";
	
	message += "<br />URL: <input type='text' id='customTileDesignsUrlInput' name='customTileDesignsUrlInput'";
	if (existingCustomTilesUrl) {
		message += " value='" + existingCustomTilesUrl + "'";
	}
	message += " /><br />";
	
	message += "<br /><div class='clickableText' onclick='closeModal();setCustomTileDesignsFromInput()'>Apply Custom Tile Designs for " + gameType.desc + "</div>";
	// message += "<br /><br /><div class='clickableText' onclick='clearCustomBoardEntries()'>Clear Custom Boards</div>";

	showModal("Use Custom Tile Designs", message);
}
