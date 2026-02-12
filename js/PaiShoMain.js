// Pai Sho Main

import $ from 'jquery';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import { loadGameController } from "./GameControllerLoader";
import { Ads } from "./Ads";
import { DummyAppCaller, IOSCaller } from "./AppCaller";
import { GUEST, HOST } from "./CommonNotationObjects";
import {
	DIAGONAL_MOVEMENT,
	EVERYTHING_CAPTURE,
	V_DOUBLE_MOVE_DISTANCE,
	gameOptionEnabled,
	getGameOptionDescription,
} from './GameOptions';
import { GameType, gameTypeIdSupported, getGameTypeEntryFromId } from './GameType';
import { Elo } from "./util/elo";
import { GameClock } from "./util/GameClock";
import { Giveaway } from "./util/Giveaway";
// Re-export for backward compatibility
export { GameType, gameTypeIdSupported, getGameTypeEntryFromId };
// HonoraryTitleChecker moved to GameStats module
import { applyBoardOptionToBgSvg, mobileAndTabletcheck } from "./ActuatorHelp";
import {
	arrayIncludesAll,
	convertToDomObject,
	copyDivToClipboard,
	copyObject,
	copyTextToClipboard,
	customBoardUrl,
	dateIsAprilFools,
	dateIsBetween,
	debug,
	debugOn,
	gameDevOn,
	humanYearsToTreeYears,
	ios,
	randomIntFromInterval,
	runningOnAndroid,
	setCustomBoardUrl,
	setDebugOn,
	setGameDevOn
} from './GameData';
import * as GameStats from './GameStats';
import {
	fetchGlobalChats,
	fetchInitialGlobalChats,
	resetGlobalChats
} from './GlobalChat';
import { LocalStorage } from "./LocalStorage";
import {
	notifyThisMessage,
	requestNotificationPermission
} from './Notifications';
import { OnboardingFunctions } from "./OnBoardingVars";
import { OnlinePlayEngine } from "./OnlinePlayEngine";
import { viewGameRankingsClicked } from './ui/GameRankings';
import { PREF_IOS_DEVICE_TOKEN } from './preferenceTypes';
import { SoundManager } from "./SoundManager";
import { setupHtmlEventHandlers } from './ui/HtmlEventHandlers';
import { buildLoginModalContentElement } from './ui/LoginModal';
import { buildSignUpModalContentElement } from './ui/SignUpModal';
import { addEventToElement, setupUiEvents } from './ui/UiSetup';
import {
	getBooleanPreference,
	hideConfirmMoveButton,
	isMoveConfirmationRequired,
	isMoveLogDisplayOn,
	isTimestampsOn,
	setBackgroundColor,
	showConfirmMoveButton,
	showPreferences,
	toggleBooleanPreference
} from './UserPreferences';
import {
	initWebPush,
	saveWebPushSubscriptionIfNeeded
} from './WebPush';
import * as WelcomeTutorial from './WelcomeTutorial';
import {
	enterSuperSandboxMode,
	exitSuperSandboxMode,
	isSuperSandboxMode,
	truncateMovesForSuperSandboxMode
} from './SuperSandbox.js';


export const QueryString = (() => {
	const query_string = {};
	let query = window.location.search.substring(1);

	// Short link params (sl=) are not compressed, so skip decompression for them
	const isShortLink = query.startsWith("sl=");

	if (query.length > 0 && !(query.includes("appType=") || query.includes("gameInApp=")) && !isShortLink) {
		// Decompress first
		query = decompressFromEncodedURIComponent(query);
	}

	let vars = query.split("&");
	if (query.includes("&amp;")) {
		vars = query.split("&amp;");
	}
	for (let i = 0; i < vars.length; i++) {
		//   const pair = vars[i].split("="); // Old
		const pair = vars[i].split(/=(.+)/); // New (will only split into key/value, not on '=' in value)
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			const arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
})();

if (QueryString.tu) {
	redirectToTinyUrl(QueryString.tu);
}

// Declared early so it's available for shortLinkDataReady
export const onlinePlayEngine = new OnlinePlayEngine();

// Store raw short link info for debugging
export let rawShortLinkInfo = null;

// Promise that resolves when short link data (if any) has been loaded and applied
export const shortLinkDataReady = QueryString.sl
	? new Promise((resolve) => {
		onlinePlayEngine.getShortLinkInfo(QueryString.sl, (linkedInfo) => {
			rawShortLinkInfo = linkedInfo;
			if (linkedInfo) {
				// Decompress and parse the linked info
				const decompressed = decompressFromEncodedURIComponent(linkedInfo);
				if (decompressed) {
					// Parse and merge into QueryString
					let vars = decompressed.split("&");
					if (decompressed.includes("&amp;")) {
						vars = decompressed.split("&amp;");
					}
					for (let i = 0; i < vars.length; i++) {
						const pair = vars[i].split(/=(.+)/);
						if (pair[0] && pair[1] !== undefined) {
							QueryString[pair[0]] = decodeURIComponent(pair[1]);
						}
					}
				}
			}
			resolve();
		});
	})
	: Promise.resolve();

export let gameController;

export let skudTilesKey = "tgggyatso";
export let paiShoBoardKey = "default";

const localEmailKey = "localUserEmail";

export const tileDesignTypeKey = "tileDesignTypeKey";
export const tileDesignTypeValues = {
	// hlowe: "Modern Tiles v1",
	tgggyatso: "The Garden Gate Gyatso Tiles",
	gaoling: "TGG Gaoling",
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

export const paiShoBoardDesignTypeKey = "paiShoBoardDesignTypeKey";
export const customBoardUrlKey = "customBoardUrlKey";
export const customBoardUrlArrayKey = "customBoardUrlArrayKey";
const defaultBoardDesignKey = "tgg20211007";
const paiShoBoardDesignTypeValuesDefault = {
	tgg20211007: "The Garden Gate",
	tenzin: "Tenzin",
	gaoling: "Gaoling",
	classy: "Classy Vescucci",
	nomadic: "Nomadic",
	chuji: "Chu Ji",
	mayfair: "Mayfair Filter",
	skudShop: "The Garden Gate Shop",
	// vescucci: "Vescucci Style",
	// xiangqi: "Xiangqi-Style Tile Colors",
	pixelsho: "Pixel-Sho",
	remix: "Remix",
	nomadsky: "Nomad's Sky by Morbius",
	water: "Water by Monk_Gyatso",
	// watertribe: "Northern Water Tribe",
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
	// adevarrose: "Adevăr Rose Old",
	adevarrose2: "Adevăr Rose",
	applycustomboard: "Add Custom Board from URL"
};

export let paiShoBoardDesignTypeValues = {};

export const svgBoardDesigns = [
	"lightmode",
	"darkmode",
	"xiangqi"
];

const paiShoBoardDesignDropdownId = "PaiShoBoardDesignSelect";

export function buildBoardDesignsValues() {
	paiShoBoardDesignTypeValues = copyObject(paiShoBoardDesignTypeValuesDefault);
	const customBoardArray = JSON.parse(localStorage.getItem(customBoardUrlArrayKey));

	if (customBoardArray && customBoardArray.length) {
		for (let i = 0; i < customBoardArray.length; i++) {
			const name = customBoardArray[i].name;
			const url = customBoardArray[i].url;
			if (name && url) {
				paiShoBoardDesignTypeValues["customBoard" + name.replace(/ /g, '_')] = name;
			}
		}
	}
}

export function buildDropdownDiv(dropdownId, labelText, valuesObject, selectedObjectKey, onchangeFunction) {
	const containerDiv = document.createElement("div");

	const theDropdown = document.createElement("select");
	theDropdown.id = dropdownId;

	const label = document.createElement("label");
	label.for = dropdownId;
	label.innerText = labelText;

	Object.keys(valuesObject).forEach((key) => {
		const option = document.createElement("option");
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

export function buildPaiShoBoardDesignDropdownDiv() {
	return buildDropdownDiv(paiShoBoardDesignDropdownId, "Pai Sho Board Design:", paiShoBoardDesignTypeValues,
		localStorage.getItem(paiShoBoardDesignTypeKey),
		function() {
			if (this.value === 'applycustomboard') {
				promptCustomBoardURL();
			}
			setPaiShoBoardOption(this.value);
		});
}

export function buildPaiShoSettingsDiv() {
	const settingsDiv = document.createElement("div");

	const heading = document.createElement("h4");
	heading.innerText = "Pai Sho Game Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(buildPaiShoBoardDesignDropdownDiv());

	settingsDiv.appendChild(document.createElement("br"));
	return settingsDiv;
}

export const vagabondTileDesignTypeKey = "vagabondTileDesignTypeKey";

const usernameKey = "usernameKey";
const userEmailKey = "userEmailKey";
const userIdKey = "userIdKey";
const deviceIdKey = "deviceIdKey";
const deviceTokenKey = "deviceTokenKey";

export const showTimestampsKey = "showTimestamps";
export const showMoveLogsInChatKey = "showMoveLogsInChat";

export const customBgColorKey = "customBgColorKey";

export const markGameInactiveWithoutDialogKey = "markGameInactiveWithoutDialogKey";

export const favoriteGameTypesKey = "favoriteGameTypesKey";

let url;

let defaultHelpMessageText;
// var defaultEmailMessageText;

let localStorage;

let hostEmail;
let guestEmail;

export const BRAND_NEW = "Brand New";
export const MOVE_DONE = "Move Done";
export const WAITING_FOR_ENDPOINT = "Waiting for endpoint";
export const READY_FOR_BONUS = "READY_FOR_BONUS";
export const WAITING_FOR_BONUS_ENDPOINT = "WAITING_FOR_BONUS_ENDPOINT";
export const WAITING_FOR_BOAT_BONUS_POINT = "WAITING_FOR_BOAT_BONUS_POINT";

export const HOST_SELECT_ACCENTS = "HOST_SELECT_ACCENTS";

let localPlayerRole = HOST;

export let activeAi;
export let activeAi2;
let sandboxUrl;
let metadata = {};
export const replayIntervalLength = 2100;
export const pieceAnimationLength = 1000; // Note that this must be changed in the `.point img` `transition` property as well(main.css)
export const piecePlaceAnimation = 1; // 0 = None, they just appear, 1 =

/* Online Play variables */
let appCaller;

export let onlinePlayEnabled = false;
export let gameId = -1;
export let lastKnownGameNotation = null;
export let gameWatchIntervalValue;
export let currentGameOpponentUsername;
export let currentGameData = {};
export let currentMoveIndex = 0;
export let isInReplay = false;
export function setIsInReplay(value) {
	isInReplay = value;
}
export let interval = 0;

export let emailBeingVerified = "";
export let usernameBeingVerified = "";
export let passwordBeingVerified = "";
export let tempUserId;
export let myGamesList = [];
export let gameSeekList = [];
// User status icon functions
export function getUserOnlineIcon() {
	return "<span title='Online' style='color:#35ac19;'><i class='fa-regular fa-circle-user' aria-hidden='true'></i></span>";
}

export function getUserOfflineIcon() {
	return "<span title='Offline' style='color:gray;'><i class='fa-regular fa-circle-user' aria-hidden='true'></i></span>";
}

// DOM element versions of icon functions
function createUserOnlineIconElement() {
	const span = document.createElement('span');
	span.title = 'Online';
	span.style.color = '#35ac19';

	const icon = document.createElement('i');
	icon.className = 'fa-regular fa-circle-user';
	icon.setAttribute('aria-hidden', 'true');

	span.appendChild(icon);
	return span;
}

function createUserOfflineIconElement() {
	const span = document.createElement('span');
	span.title = 'Offline';
	span.style.color = 'gray';

	const icon = document.createElement('i');
	icon.className = 'fa-regular fa-circle-user';
	icon.setAttribute('aria-hidden', 'true');

	span.appendChild(icon);
	return span;
}
export let logOnlineStatusIntervalValue;
export let userTurnCountInterval;

export const gameContainerDiv = document.getElementById("game-container");

export let soundManager;
/* Preference values should default to true */
export const animationsOnKey = "animationsOn";
export const confirmMoveKey = "confirmMove";
export const createNonRankedGamePreferredKey = "createNonRankedGamePreferred";

// var sendJoinGameChatMessage = false;
/* --- */

/* Favorite Game Types Functions */
export function getFavoriteGameTypeIds() {
	return JSON.parse(localStorage.getItem(favoriteGameTypesKey)) || [];
}

export function isGameTypeFavorite(gameTypeId) {
	const favorites = getFavoriteGameTypeIds();
	return favorites.includes(gameTypeId);
}

export function toggleFavoriteGameType(gameTypeId) {
	let favorites = getFavoriteGameTypeIds();
	const index = favorites.indexOf(gameTypeId);
	if (index > -1) {
		favorites.splice(index, 1);
	} else {
		favorites.push(gameTypeId);
	}
	localStorage.setItem(favoriteGameTypesKey, JSON.stringify(favorites));
	return favorites.includes(gameTypeId);
}

export function sortGameTypesWithFavoritesFirst(gameTypeKeys) {
	const favorites = getFavoriteGameTypeIds();
	return [...gameTypeKeys].sort((a, b) => {
		const aIsFavorite = favorites.includes(GameType[a].id);
		const bIsFavorite = favorites.includes(GameType[b].id);
		if (aIsFavorite && !bIsFavorite) return -1;
		if (!aIsFavorite && bIsFavorite) return 1;
		return 0;
	});
}

export function sortGameListWithFavoritesFirst(gameList) {
	const favorites = getFavoriteGameTypeIds();
	return [...gameList].sort((a, b) => {
		const aIsFavorite = favorites.includes(a.gameTypeId);
		const bIsFavorite = favorites.includes(b.gameTypeId);
		if (aIsFavorite && !bIsFavorite) return -1;
		if (!aIsFavorite && bIsFavorite) return 1;
		return 0;
	});
}
/* --- */

window.requestAnimationFrame(function() {
	// Wait for short link data to be loaded (if any) before initializing
	shortLinkDataReady.then(async () => {

	setupUiEvents();
	setupHtmlEventHandlers();

	// Initialize service worker for push notifications
	initWebPush();

	// Listen for messages from service worker (e.g., notification clicks)
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.addEventListener('message', (event) => {
			if (event.data?.type === 'NAVIGATE_TO_GAME' && event.data?.gameId) {
				jumpToGameIfPlayerIsInGame(event.data.gameId);
			}
		});
	}

	/* Online play is enabled! */
	onlinePlayEnabled = true;
	/* ----------------------- */

	localStorage = new LocalStorage().storage;

	soundManager = new SoundManager();

	// Initialize GameStats module
	GameStats.initGameStats({
		onlinePlayEngine,
		getLoginToken,
		getUsername,
		showModalElem,
		closeModal
	});

	/* Dark Mode Preferences (dark mode now default) */
	if (!localStorage.getItem("data-theme")) {
		/* to always have dark as default instead of system preferences */
		let dataTheme = "dark";
		/* to set based on preference */
		// let dataTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

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

	const customBgColorValue = localStorage.getItem(customBgColorKey);
	if (customBgColorValue) {
		setBackgroundColor(customBgColorValue);
	}

	// defaultEmailMessageText = document.querySelector(".footer").innerHTML;

	buildBoardDesignsValues();

	  if (dateIsAprilFools()) {
		  Ads.enableAds(true);
		  GameType.SkudPaiSho.gameOptions.push(DIAGONAL_MOVEMENT, EVERYTHING_CAPTURE);
		  GameType.VagabondPaiSho.gameOptions.push(V_DOUBLE_MOVE_DISTANCE);
	  }

	if (QueryString.game && !QueryString.gameType) {
		QueryString.gameType = "1";
	}
	if (QueryString.gameType) {
		clearOptions();
		if (QueryString.gameOptions) {
			const optionsArray = parseGameOptions(QueryString.gameOptions);
			for (let i = 0; i < optionsArray.length; i++) {
				addOption(optionsArray[i]);
			}
		}
		await setGameController(parseInt(QueryString.gameType), true);

		gameController.setGameNotation(QueryString.game);

		if (!QueryString.game || QueryString.game.length < 3) {
			sandboxFromMove();
		}

		if (gameController.gameNotation.moves.length > 1) {
			showReplayControls();
		}
	} else {
		await closeGame();
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

	// if ((url.startsWith("file") || url.includes("localhost")) && !ios && !runningOnAndroid) {
	if ((url.startsWith("file")) && !ios && !runningOnAndroid) {
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

	let localUserEmail = localStorage.getItem(localEmailKey);

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

	resetGlobalChats();	//"Global Chats" tab is now "Links"

	initialVerifyLogin();

	// Open default help/chat tab
	document.getElementById("defaultOpenTab").click();

	if (dateIsBetween("04/01/2023", "04/02/2023")) {
		Ads.enableAds(true);
		GameType.SkudPaiSho.gameOptions.push(DIAGONAL_MOVEMENT, EVERYTHING_CAPTURE);
	}

	if (WelcomeTutorial.shouldShowWelcomeTutorial(debugOn, QueryString.game, userIsLoggedIn())) {
		WelcomeTutorial.showWelcomeTutorial();
	} else {
		OnboardingFunctions.showOnLoadAnnouncements();
	}

	if (QueryString.wg) {	/* `wg` for watch game id */
		QueryString.watchGame = QueryString.wg;
	}
	if (QueryString.watchGame) {
		jumpToGame(QueryString.watchGame);
	}

	if (QueryString.gameInApp) {	/* `gameInApp` for game id to open from app notification */
		jumpToGameIfPlayerIsInGame(QueryString.gameInApp);
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
	}); // end shortLinkDataReady.then()
});
export function getGameColor(gameMode) {
	switch (gameMode) {
	case "Skud Pai Sho":
		return "var(--skudcolor)";
	case "Vagabond Pai Sho":
		return "var(--vagabondcolor)";
	case "Adevăr Pai Sho":
		return "var(--adevarcolor)";
	case "Fire Pai Sho":
		return "var(--firecolor)";
	case "Ginseng Pai Sho":
		return "var(--ginsengcolor)";
	case "Capture Pai Sho":
		return "var(--capturecolor)";
	case "Spirit Pai Sho":
		return "var(--spiritcolor)";
	case "Nature's Grove: Respite":
		return "var(--solitairecolor)";
	case "Nature's Grove: Synergy":
		return "var(--coopsolitairecolor)";
	case "Nature's Grove: Overgrowth":
		return "var(--overgrowthcolor)";
	case "Undergrowth Pai Sho":
		return "var(--undergrowthcolor)";
	case "Street Pai Sho":
		return "var(--streetcolor)";
		 case "Nick Pai Sho":
            return "var(--nickcolor)";
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
export function usernameIsOneOf(theseNames) {
	if (theseNames && theseNames.length) {
		for (let i = 0; i < theseNames.length; i++) {
			if (getUsername() && getUsername().toLowerCase() === theseNames[i].toLowerCase()) {
				return true;
			}
		}
	}
	return false;
}

export function showReplayControls() {
	if (window.navigator.onLine) {
		document.getElementById("replayControls").classList.remove("gone");
	}
}

export function toggleReplayControls() {
	const id = "replayControls";
	const classToToggle = "gone";
	const replayControls = document.getElementById(id);
	if (replayControls.classList.contains(classToToggle)) {
		replayControls.classList.remove(classToToggle);
	} else {
		replayControls.classList.add(classToToggle);
	}
}

export function setTileContainers() {
	document.getElementById('hostTilesContainer').innerHTML = gameController.getHostTilesContainerDivs();
	document.getElementById('guestTilesContainer').innerHTML = gameController.getGuestTilesContainerDivs();
}

export let userIsSignedInOk = true;
let onlinePlayPaused = false;

export function resumeOnlinePlay() {
	onlinePlayPaused = false;
}

function showOnlinePlayPausedModal() {
	closeGame();
	const modalElement = convertToDomObject("Sorry, something was wrong and online play is currently paused. Take a break for some tea!<br /><br />You may attempt to <span id='resumeOnlinePlaySpan' class='skipBonus'>resume online play</span>.");
	const resumeOnlinePlaySpan = modalElement.querySelector('#resumeOnlinePlaySpan');
	addEventToElement(resumeOnlinePlaySpan, 'click', () => { resumeOnlinePlay(); closeModal(); });
	showModalElem("Online Play Paused", modalElement, true);
}

const initialVerifyLoginCallback = (response) => {
	if (response === "Results exist") {
		startLoggingOnlineStatus();
		startWatchingNumberOfGamesWhereUserTurn();
		appCaller.alertAppLoaded();
		userIsSignedInOk = true;
		// Subscribe to web push notifications if supported
		saveWebPushSubscriptionIfNeeded(getLoginToken());
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

export function initialVerifyLogin() {
	if (onlinePlayEnabled) {
		onlinePlayEngine.verifyLogin(getUserId(),
			getUsername(),
			getUserEmail(),
			getDeviceId(),
			initialVerifyLoginCallback
		);
	}
}

const verifyLoginCallback = (response) => {
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

export function verifyLogin() {
	if (onlinePlayEnabled) {
		onlinePlayEngine.verifyLogin(getUserId(),
			getUsername(),
			getUserEmail(),
			getDeviceId(),
			verifyLoginCallback
		);
	}
}

let previousCountOfGamesWhereUserTurn = 0;

export function setAccountHeaderLinkText(countOfGamesWhereUserTurn) {
	let text = "Sign In";
	let numMovesText = "";
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

/* var getGameNotationCallback = function getGameNotationCallback(newGameNotation) {
	if (gameWatchIntervalValue && newGameNotation !== lastKnownGameNotation) {
		gameController.setGameNotation(decodeURIComponent(newGameNotation));
		rerunAll(true);
		lastKnownGameNotation = newGameNotation;
		showReplayControls();
	}
}; */

const getGameNotationAndClockCallback = (newGameDataJsonString) => {
	if (newGameDataJsonString) {
		try {
			const newGameData = JSON.parse(htmlDecode(newGameDataJsonString));
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
		} catch (error) {
			debug("Error parsing game notation and clock data");
			debug(error);
		}
	}
};

export function usernameEquals(otherUsername) {
	return otherUsername && getUsername() && otherUsername.toLowerCase() === getUsername().toLowerCase();
}

export function setResponseText(text) {
	const responseDiv = document.getElementById("response");
	if (responseDiv) {
		responseDiv.innerHTML = text;
	}
}

export function updateCurrentGameTitle(isOpponentOnline) {
	if (!currentGameData.guestUsername || !currentGameData.hostUsername) {
		setResponseText(" ");
		return;
	}
	/* --- */

	let opponentOnlineIconText = getUserOfflineIcon();
	if (isOpponentOnline) {
		opponentOnlineIconText = getUserOnlineIcon();
	}

	const currentPlayer = getCurrentPlayer();

	// Build HOST username
	let hostUsernameTag = "";
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

	let guestUsernameTag = "";
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

	let title = "<span>";
	title += hostUsernameTag;
	title += " vs. ";
	title += guestUsernameTag;
	title += "</span>";

	setResponseText(title);
}

let lastChatTimestamp = '1970-01-01 00:00:00';

const checkIfUserOnlineCallback = (isOpponentOnline) => {
	updateCurrentGameTitle(isOpponentOnline);
};

// Chat message DOM builder functions (Phase 2 refactoring)
function createMoveStampElement(message) {
	const p = document.createElement("p");
	p.textContent = message.replace(/&amp;/g, '&');
	return p;
}

function createStotesChatMessageElement(chatMessage, showTimestamp, pastMessageUsername) {
	const messageDiv = document.createElement("div");
	messageDiv.className = 'chatMessage';

	if (usernameEquals(chatMessage.username)) {
		messageDiv.classList.add('self');
	}

	if (showTimestamp) {
		const timestamp = document.createElement("em");
		timestamp.textContent = getTimestampString(chatMessage.timestamp);
		messageDiv.appendChild(timestamp);
		messageDiv.appendChild(document.createTextNode(" "));
	}

	const contentDiv = document.createElement("div");
	contentDiv.className = 'message';
	contentDiv.textContent = chatMessage.message.replace(/&amp;/g, '&');

	if (usernameEquals(chatMessage.username)) {
		// User's own message
		messageDiv.appendChild(contentDiv);
	} else if (chatMessage.username === currentGameOpponentUsername) {
		// Opponent's message
		contentDiv.classList.add('opponent');
		contentDiv.textContent = " " + chatMessage.message.replace(/&amp;/g, '&');
		messageDiv.appendChild(contentDiv);
	} else {
		// Other user's message
		if (chatMessage.username !== pastMessageUsername) {
			const usernameStrong = document.createElement("strong");
			usernameStrong.textContent = chatMessage.username;
			messageDiv.appendChild(usernameStrong);
			messageDiv.appendChild(document.createTextNode(" "));
		}

		if (chatMessage.username === "SkudPaiSho" && chatMessage.username === pastMessageUsername) {
			contentDiv.classList.add('golden');
			contentDiv.textContent = " " + chatMessage.message.replace(/&amp;/g, '&');
		}

		messageDiv.appendChild(contentDiv);
	}

	return messageDiv;
}

function createTggChatMessageElement(chatMessage, showTimestamp, isMoveLogMessage) {
	const messageDiv = document.createElement("div");
	messageDiv.className = 'chatMessage';

	if (showTimestamp) {
		const timestamp = document.createElement("em");
		timestamp.textContent = getTimestampString(chatMessage.timestamp);
		messageDiv.appendChild(timestamp);
		messageDiv.appendChild(document.createTextNode(" "));
	}

	if (isMoveLogMessage) {
		messageDiv.appendChild(document.createTextNode(chatMessage.message.replace(/&amp;/g, '&')));
	} else {
		const usernameStrong = document.createElement("strong");
		usernameStrong.textContent = chatMessage.username + ":";
		messageDiv.appendChild(usernameStrong);
		messageDiv.appendChild(document.createTextNode(" " + chatMessage.message.replace(/&amp;/g, '&')));
	}

	return messageDiv;
}

const getNewChatMessagesCallback = (results) => {
	if (results != "") {
		const resultRows = results.split('\n');

		const chatMessageList = [];

		for (const index in resultRows) {
			const row = resultRows[index].split('|||');
			const chatMessage = {
				timestamp: row[0],
				username: row[1],
				message: row[2]
			};
			chatMessageList.push(chatMessage);
			lastChatTimestamp = chatMessage.timestamp;
		}

		let alertNewMessages = false;
		const containerElement = document.createElement("div");
		containerElement.classList.add("chatMessageContainer");

		if (localStorage.getItem("data-theme") == "stotes") {
			let pastMessageUsername = "";
			let lastMoveStampElement = null;

			for (const index in chatMessageList) {
				const chatMessage = chatMessageList[index];

				if (chatMessage.message[0] == "➢") {
					lastMoveStampElement = createMoveStampElement(chatMessage.message);
				} else {
					if (lastMoveStampElement) {
						// Only add the most recent move stamp. The entire game doesn't need to be displayed in chat.
						containerElement.appendChild(lastMoveStampElement);
						lastMoveStampElement = null;
						pastMessageUsername = "moveStamp";
					}

					const messageElement = createStotesChatMessageElement(chatMessage, isTimestampsOn(), pastMessageUsername);
					containerElement.appendChild(messageElement);

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
			for (const index in chatMessageList) {
				const chatMessage = chatMessageList[index];

				const isMoveLogMessage = chatMessage.message.includes("➢ ");

				if (!isMoveLogMessage || isMoveLogDisplayOn()) {
					const messageElement = createTggChatMessageElement(chatMessage, isTimestampsOn(), isMoveLogMessage);
					containerElement.appendChild(messageElement);

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
		const chatMessagesDisplay = document.getElementById('chatMessagesDisplay');
		// allow 1px inaccuracy by adding 1
		const isScrolledToBottom = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight <= chatMessagesDisplay.scrollTop + 1;
		chatMessagesDisplay.appendChild(containerElement);
		// scroll to bottom if isScrolledToBottom
		if (isScrolledToBottom) {
			chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight;
		}
	}
};

export function getTimestampString(timestampStr) {
	const dte = new Date(timestampStr + " UTC");

	const localeStr = dte.toLocaleString();
	if (localeStr.toLowerCase().includes("invalid")) {
		return timestampStr + " UTC";
	}
	return localeStr;
}

export function gameWatchPulse() {
	onlinePlayEngine.getGameNotationAndClock(gameId, getGameNotationAndClockCallback);

	onlinePlayEngine.checkIfUserOnline(currentGameOpponentUsername, checkIfUserOnlineCallback);

	onlinePlayEngine.getNewChatMessages(gameId, lastChatTimestamp, getNewChatMessagesCallback);

	if (myTurn() && GameClock.currentClockIsTicking()) {
		GameClock.currentClock.updateSecondsRemaining();
		onlinePlayEngine.updateGameClock(gameId, GameClock.getCurrentGameClockJsonString(), getLoginToken(), emptyCallback);

		/* if (GameClock.currentClockIsOutOfTime()) {
			let hostResultCode = 0.5;
			if (getCurrentPlayer() === HOST) {
				hostResultCode = 0;
			} else if (getCurrentPlayer() === GUEST) {
				hostResultCode = 1;
			}
			let newPlayerRatings = {};
			if (currentGameData.isRankedGame && currentGameData.hostUsername !== currentGameData.guestUsername) {
				newPlayerRatings = Elo.getNewPlayerRatings(currentGameData.hostRating, currentGameData.guestRating, hostResultCode);
			}
			onlinePlayEngine.updateGameWinInfo(gameId, getOnlineGameOpponentUsername(), 11, getLoginToken(), emptyCallback,
				currentGameData.isRankedGame, newPlayerRatings.hostRating, newPlayerRatings.guestRating, currentGameData.gameTypeId, currentGameData.hostUsername, currentGameData.guestUsername);
		} */
	}
}

export function clearGameWatchInterval() {
	if (gameWatchIntervalValue) {
		clearInterval(gameWatchIntervalValue);
		gameWatchIntervalValue = null;
	}
}
const REAL_TIME_GAME_WATCH_INTERVAL = 3000;
export function startWatchingGameRealTime() {
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
export function setPaiShoBoardOption(newPaiShoBoardKey, isTemporary) {
	if (!paiShoBoardDesignTypeValues[newPaiShoBoardKey]) {
		newPaiShoBoardKey = defaultBoardDesignKey;
	}
	const oldClassName = paiShoBoardKey + "Board";
	gameContainerDiv.classList.remove(oldClassName);
	if (!isTemporary) {
		localStorage.setItem(paiShoBoardDesignTypeKey, newPaiShoBoardKey);
	}
	paiShoBoardKey = newPaiShoBoardKey;
	const newClassName = paiShoBoardKey + "Board";
	gameContainerDiv.classList.add(newClassName);

	if (gameController.isPaiShoGame) {
		applyBoardOptionToBgSvg();
	}

	clearMessage(); // Refresh Help tab text
}

export function promptCustomBoardURL() {
    if (localStorage.getItem(customBoardUrlKey)) {
        setCustomBoardUrl(localStorage.getItem(customBoardUrlKey));
    } else {
        setCustomBoardUrl("https://skudpaisho.com/style/board_tgg.png");
    }
    localStorage.setItem(customBoardUrlKey, customBoardUrl);

    // Create the main container
    const container = document.createElement("div");

    // Create paragraph
    const paragraph = document.createElement("p");
    paragraph.textContent = "You can use one of many fan-created board designs. See the boards in the #board-design channel in The Garden Gate Discord. Copy and paste the link to a board image to use here:";
    container.appendChild(paragraph);

    container.appendChild(document.createElement("br"));

    // Name input section
    const nameLabel = document.createElement("span");
    nameLabel.textContent = "Name: ";
    container.appendChild(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "customBoardNameInput";
    nameInput.name = "customBoardNameInput";
    container.appendChild(nameInput);

    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));

    // URL input section
    const urlLabel = document.createElement("span");
    urlLabel.textContent = "URL: ";
    container.appendChild(urlLabel);

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.id = "customBoardInput";
    urlInput.name = "customBoardInput";
    container.appendChild(urlInput);

    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));

    // Apply button
    const applyButton = document.createElement("div");
    applyButton.className = "clickableText";
    applyButton.textContent = "Apply Custom Board";
    applyButton.onclick = function() {
        setCustomBoardFromInput();
    };
    container.appendChild(applyButton);

    // Saved boards list
    const customBoardArray = JSON.parse(localStorage.getItem(customBoardUrlArrayKey));
    if (customBoardArray && customBoardArray.length > 0) {
        container.appendChild(document.createElement("br"));

        const listHeading = document.createElement("p");
        listHeading.innerHTML = "<b>Your Custom Boards:</b>";
        container.appendChild(listHeading);

        customBoardArray.forEach(function(board, index) {
            const row = document.createElement("div");
            row.style.marginBottom = "6px";

            const nameLink = document.createElement("a");
            nameLink.textContent = board.name;
            nameLink.style.fontWeight = "bold";
            nameLink.style.cursor = "pointer";
            nameLink.className = "clickableText";
            nameLink.onclick = function() {
                var boardKey = "customBoard" + board.name.replace(/ /g, '_');
                setPaiShoBoardOption(boardKey);
            };
            row.appendChild(nameLink);

            row.appendChild(document.createTextNode(" — "));

            const urlLink = document.createElement("a");
            const displayUrl = board.url.length > 40 ? board.url.substring(0, 40) + "..." : board.url;
            urlLink.textContent = displayUrl;
            urlLink.title = board.url;
            urlLink.href = board.url;
            urlLink.target = "_blank";
            urlLink.style.fontSize = "0.85em";
            urlLink.style.opacity = "0.8";
            row.appendChild(urlLink);

            row.appendChild(document.createTextNode(" "));

            const removeLink = document.createElement("span");
            removeLink.className = "clickableText";
            removeLink.textContent = "Remove";
            removeLink.style.fontSize = "0.85em";
            removeLink.onclick = function() {
                removeCustomBoardEntry(index);
            };
            row.appendChild(removeLink);

            container.appendChild(row);
        });
    }

    container.appendChild(document.createElement("br"));
    container.appendChild(document.createElement("br"));

    // Clear button
    const clearButton = document.createElement("div");
    clearButton.className = "clickableText";
    clearButton.textContent = "Clear Custom Boards";
    clearButton.onclick = function() {
        clearCustomBoardEntries();
    };
    container.appendChild(clearButton);

    showModalElem("Use Custom Board URL", container);
}

export function clearCustomBoardEntries() {
	localStorage.removeItem(customBoardUrlArrayKey);
	buildBoardDesignsValues();
	clearMessage();
	closeModal();
}

export function removeCustomBoardEntry(index) {
	let customBoardArray = JSON.parse(localStorage.getItem(customBoardUrlArrayKey));
	if (customBoardArray) {
		customBoardArray.splice(index, 1);
		if (customBoardArray.length > 0) {
			localStorage.setItem(customBoardUrlArrayKey, JSON.stringify(customBoardArray));
		} else {
			localStorage.removeItem(customBoardUrlArrayKey);
		}
		buildBoardDesignsValues();
		clearMessage();
		promptCustomBoardURL();
	}
}

export function setCustomBoardFromInput() {
	const customBoardName = document.getElementById('customBoardNameInput').value;
	setCustomBoardUrl(document.getElementById('customBoardInput').value);
	closeModal();

	if (customBoardName && customBoardUrl) {
		let customBoardArray = JSON.parse(localStorage.getItem(customBoardUrlArrayKey));
		if (!customBoardArray) {
			customBoardArray = [];
		}
		customBoardArray.push({
			name: customBoardName,
			url: customBoardUrl
		});
		localStorage.setItem(customBoardUrlArrayKey, JSON.stringify(customBoardArray));
		buildBoardDesignsValues();
		var boardKey = "customBoard" + customBoardName.replace(/ /g, '_');
		setPaiShoBoardOption(boardKey);
	}

	if (customBoardUrl) {
		localStorage.setItem(customBoardUrlKey, customBoardUrl);
	}
	applyBoardOptionToBgSvg();
}

/* Skud Pai Sho Tile Design Switches */
export async function setSkudTilesOption(newSkudTilesKey, applyCustomBoolean) {
	if (newSkudTilesKey === 'custom' && !applyCustomBoolean) {
		const { SkudPreferences } = await import("./skud-pai-sho/SkudPaiShoController");
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

export function getSelectedTileDesignTypeDisplayName() {
	return tileDesignTypeValues[localStorage.getItem(tileDesignTypeKey)];
}
export function getSelectedBoardDesignTypeDisplayName() {
	return paiShoBoardDesignTypeValues[localStorage.getItem(paiShoBoardDesignTypeKey)];
}

/* --- */

// function promptEmail() {
// 	// Just call loginClicked method to open modal dialog
// 	loginClicked();
// }

export function updateFooter() {
	// var userEmail = localStorage.getItem(localEmailKey);
	// if (userEmail && userEmail.includes("@") && userEmail.includes(".")) {
	// 	document.querySelector(".footer").innerHTML = gamePlayersMessage() + "You are playing as " + userEmail
	// 	+ " | <span class='skipBonus' onclick='promptEmail();'>Edit email</span> | <span class='skipBonus' onclick='showSignOutModal();'>Sign out</span>";
	// } else {
	// 	document.querySelector(".footer").innerHTML = gamePlayersMessage() + defaultEmailMessageText;
	// }
}

// function gamePlayersMessage() {
// 	if (!hostEmail && !guestEmail) {
// 		return "";
// 	}
// 	var msg = "";
// 	if (hostEmail) {
// 		msg += "HOST: " + hostEmail + "<br />";
// 	}
// 	if (guestEmail) {
// 		msg += "GUEST: " + guestEmail + "<br />";
// 	}
// 	msg += "<br />";
// 	return msg;
// }

export function forgetOnlinePlayInfo() {
	// Forget online play info
	localStorage.removeItem(deviceIdKey);
	localStorage.removeItem(userIdKey);
	localStorage.removeItem(usernameKey);
	localStorage.removeItem(userEmailKey);

	clearLogOnlineStatusInterval();
}

export function showSignOutModal() {
	const container = document.createElement('div');
	container.appendChild(document.createElement('br'));

	const yesDiv = document.createElement('div');
	yesDiv.classList.add('clickableText');
	yesDiv.textContent = 'Yes, sign out';
	yesDiv.onclick = () => signOut(true);
	container.appendChild(yesDiv);

	container.appendChild(document.createElement('br'));

	const cancelDiv = document.createElement('div');
	cancelDiv.classList.add('clickableText');
	cancelDiv.textContent = 'Cancel';
	cancelDiv.onclick = () => signOut(false);
	container.appendChild(cancelDiv);

	showModalElem("Really sign out?", container);
}

export function showChangePasswordModal() {
	const msgContent = document.getElementById('changePasswordModalContentContainer').cloneNode(true);
	msgContent.style.display = '';
	showModalElem("Update Password", msgContent);
}

export function signOut(reallySignOut) {
	closeModal();

	if (!reallySignOut) {
		updateFooter();
		return;
	}

	if (hostEmail == getUserEmail()) {
		hostEmail = null;
	}

	if (guestEmail == getUserEmail()) {
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

export function rewindAllMoves() {
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
export function playNextMove(withActuate, moveAnimationBeginStep, skipAnimation) {
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
			const newMoveIndex = gameController.getSkipToIndex(currentMoveIndex);
			for (currentMoveIndex; currentMoveIndex < newMoveIndex; currentMoveIndex++) {
				if (gameController.runMove) {
					gameController.runMove(gameController.gameNotation.moves[currentMoveIndex], false);
				} else {
					gameController.theGame.runNotationMove(gameController.gameNotation.moves[currentMoveIndex], false);
				}
			}
		}
		if (gameController.runMove) {
			gameController.runMove(gameController.gameNotation.moves[currentMoveIndex], withActuate, moveAnimationBeginStep, skipAnimation);
		} else {
			gameController.theGame.runNotationMove(gameController.gameNotation.moves[currentMoveIndex], withActuate, moveAnimationBeginStep, skipAnimation);
		}
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

export function playPrevMove() {
	isInReplay = true;
	pauseRun();

	const moveToPlayTo = currentMoveIndex - 1;

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

export function playAllMoves(moveAnimationBeginStep, skipAnimation) {
	pauseRun();
	if (currentMoveIndex >= gameController.gameNotation.moves.length - 1) {
		playPrevMove();	// If at end, jump to previous move so that final move can animate
	}
	while (currentMoveIndex < gameController.gameNotation.moves.length - 1) {
		playNextMove(false);
	}
	playNextMove(true, moveAnimationBeginStep, skipAnimation);
}

export function playPause() {
	if (gameController.gameNotation.moves.length === 0) {
		return;
	}
	if (interval === 0) {
		// Play
		const playButton = document.querySelector(".playPauseButton");
		playButton.innerHTML = "";
		const pauseIcon = document.createElement("i");
		pauseIcon.className = "fa fa-pause";
		pauseIcon.setAttribute("aria-hidden", "true");
		playButton.appendChild(pauseIcon);
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

export function pauseRun() {
	clearInterval(interval);
	interval = 0;
	const playButton = document.querySelector(".playPauseButton");
	playButton.innerHTML = "";
	const playIcon = document.createElement("i");
	playIcon.className = "fa fa-play";
	playIcon.setAttribute("aria-hidden", "true");
	playButton.appendChild(playIcon);
}

export function getAdditionalMessage() {
	const container = document.createElement("span");

	// Is it the player's turn?
	// TODO Could maybe get rid of this
	if (myTurn() && !userIsLoggedIn()) {
		const youSpan = document.createElement("span");
		youSpan.textContent = " (You) ";
		container.appendChild(youSpan);
	}

	const additionalMsg = gameController.getAdditionalMessage();
	if (additionalMsg) {
		if (typeof additionalMsg === 'string') {
			const msgSpan = document.createElement("span");
			msgSpan.innerHTML = additionalMsg;
			container.appendChild(msgSpan);
		} else {
			container.appendChild(additionalMsg);
		}
	}

	if (getGameWinner()) {
		// There is a winner!
		container.appendChild(document.createElement("br"));
		const winnerSpan = document.createElement("strong");
		winnerSpan.appendChild(document.createTextNode(getGameWinner()));
		const winReason = getGameWinReason();
		if (typeof winReason === 'string') {
			winnerSpan.appendChild(document.createTextNode(winReason));
		} else {
			winnerSpan.appendChild(winReason);
		}
		container.appendChild(winnerSpan);
	} else if (gameController.gameHasEndedInDraw && gameController.gameHasEndedInDraw()) {
		container.appendChild(document.createElement("br"));
		const drawSpan = document.createElement("span");
		drawSpan.textContent = "Game has ended in a draw.";
		container.appendChild(drawSpan);
	}

	return container;
}

export function getGameMessageElement() {
	const gameMessage = document.querySelector(".gameMessage");
	const gameMessage2 = document.querySelector(".gameMessage2");

	if (gameController.showGameMessageUnderneath) {
		while (gameMessage.firstChild) {
			gameMessage.removeChild(gameMessage.firstChild);
		}
		return gameMessage2;
	} else {
		if (gameMessage2) {
			while (gameMessage2.firstChild) {
				gameMessage2.removeChild(gameMessage2.firstChild);
			}
		}
		return gameMessage;
	}
}

export function refreshMessage() {
	const messageElement = getGameMessageElement();
	// Clear the message element
	while (messageElement.firstChild) {
		messageElement.removeChild(messageElement.firstChild);
	}

	if (!playingOnlineGame()) {
		const playerText = document.createElement("span");
		playerText.textContent = "Current Player: " + getCurrentPlayer();
		messageElement.appendChild(playerText);
		messageElement.appendChild(document.createElement("br"));
	}

	const additionalMsg = getAdditionalMessage();
	if (additionalMsg) {
		messageElement.appendChild(additionalMsg);
	}

	if (gameController && gameController.getAdditionalMessageElement) {
		messageElement.appendChild(gameController.getAdditionalMessageElement());
		messageElement.appendChild(document.createElement("br"));
	}

	if ((playingOnlineGame() && iAmPlayerInCurrentOnlineGame() && !myTurn() && !getGameWinner())
		|| gameController.isSolitaire()) {
		showResetMoveMessage();
	}
}

export function rerunAll(soundOkToPlay, moveAnimationBeginStep, skipAnimation) {
	gameController.resetGameManager();
	gameController.resetNotationBuilder();

	currentMoveIndex = 0;

	playAllMoves(moveAnimationBeginStep, skipAnimation);

	if (soundOkToPlay && soundManager.rerunAllSoundsAreEnabled()) {
		soundManager.playSound(SoundManager.sounds.tileLand);
	}
	refreshMessage();
}

export function quickFinalizeMove(soundOkToPlay) {
	// gameController.resetGameManager();
	gameController.resetNotationBuilder();
	currentMoveIndex++;
	linkShortenCallback('');

	if (soundOkToPlay && soundManager.rerunAllSoundsAreEnabled()) {
		soundManager.playSound(SoundManager.sounds.tileLand);
	}

	refreshMessage();
	showResetMoveMessage();
}

export function finalizeMove(moveAnimationBeginStep, ignoreNoEmail, okToUpdateWinInfo) {
	rerunAll(true, moveAnimationBeginStep);

	// Only build url if not onlinePlay
	if (!playingOnlineGame()) {
		let linkUrl = "";
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
		// linkUrl = LZString.compressToEncodedURIComponent(linkUrl);
		linkUrl = compressToEncodedURIComponent(linkUrl);

		linkUrl = url + "?" + linkUrl;

		if (gameController.runMove && gameController.isStillRunningMove && gameController.isStillRunningMove()) {
			debug("Move still running");
			let checkCount = 0;
			let checkRunningInterval = setInterval(() => {
				checkCount++;
				if (!gameController.isStillRunningMove()) {
					debug("Move done running");
					linkShortenCallback(linkUrl, ignoreNoEmail, okToUpdateWinInfo);
					clearInterval(checkRunningInterval);
				}
				if (checkCount > 4) {
					clearInterval(checkRunningInterval);
					showModalElem("Error submitting move", document.createTextNode("Error finalizing move. Sorry about that :("));
				}
			}, replayIntervalLength / 2);
		} else {
			linkShortenCallback(linkUrl, ignoreNoEmail, okToUpdateWinInfo);
		}
	} else {
		if (gameController.runMove && gameController.isStillRunningMove && gameController.isStillRunningMove()) {
			debug("Move still running");
			let checkCount = 0;
			let checkRunningInterval = setInterval(() => {
				checkCount++;
				if (!gameController.isStillRunningMove()) {
					debug("Move done running");
					linkShortenCallback('', ignoreNoEmail, okToUpdateWinInfo);
					clearInterval(checkRunningInterval);
				}
				if (checkCount > 4) {
					clearInterval(checkRunningInterval);
					showModalElem("Error submitting move", document.createTextNode("Error finalizing move. Sorry about that :("));
				}
			}, replayIntervalLength / 2);
		} else {
			linkShortenCallback('', ignoreNoEmail, okToUpdateWinInfo);
		}
	}
}

// function showSubmitMoveForm(/* url */) {
// 	// Move has completed, so need to send to "current player"
// 	/* Commenting out - 20181022
// 	var toEmail = getCurrentPlayerEmail();
 
// 	var fromEmail = getUserEmail();
 
// 	var bodyMessage = getEmailBody(url);
 
// 	$('#fromEmail').attr("value", fromEmail);
// 	$('#toEmail').attr("value", toEmail);
// 	$('#message').attr("value", bodyMessage);
// 	$('#contactform').removeClass('gone');
// 	*/
// }

export function getNoUserEmailMessage() {
	const container = document.createElement("span");

	const signInSpan = document.createElement("span");
	signInSpan.className = "skipBonus";
	signInSpan.textContent = "Sign in";
	signInSpan.onclick = () => {
		loginClicked();
		finalizeMove();
	};

	container.appendChild(signInSpan);
	container.appendChild(document.createTextNode(" to play games with others online. "));
	container.appendChild(document.createElement("br"));

	return container;
}

export function playingOnlineGame() {
	return onlinePlayEnabled && gameId > 0;
}

export function getGameWinner() {
	/* if (GameClock.playerIsOutOfTime(HOST)) {
		return GUEST;
	} else if (GameClock.playerIsOutOfTime(GUEST)) {
		return HOST;
	} else  */
	if (currentGameData && currentGameData.resultId === 9 && currentGameData.winnerUsername) {
		if (currentGameData.hostUsername === currentGameData.winnerUsername) {
			return HOST;
		} else {
			return GUEST;
		}
	} else {
		return gameController.theGame.getWinner();
	}
}

export function getGameWinReason() {
	/* if (GameClock.aPlayerIsOutOfTime()) {
		return " won the game due to opponent running out of time";
	} else  */
	if (currentGameData && currentGameData.resultId === 9) {
		return " wins ᕕ( ᐛ )ᕗ! Opponent has resigned.";
	} else {
		return gameController.theGame.getWinReason();
	}
}

export function linkShortenCallback(shortUrl, ignoreNoEmail, okToUpdateWinInfo) {
    const aiList = gameController.getAiList();

    const messageText = document.createElement("span");

    if ((
        (!gameController.readyToShowPlayAgainstAiOption && currentMoveIndex == 1)
        || (gameController.readyToShowPlayAgainstAiOption && gameController.readyToShowPlayAgainstAiOption())
    ) && !haveBothEmails()) {
        if (!playingOnlineGame() && (currentGameData.gameTypeId === 1 || !currentGameData.gameTypeId)) {
            if (!ignoreNoEmail && !userIsLoggedIn()) {
                messageText.appendChild(getNoUserEmailMessage());
            }
        }

        if (aiList.length > 0) {
            for (let i = 0; i < aiList.length; i++) {
                const span = document.createElement("span");
                span.className = 'skipBonus';
                span.onclick = (function(index) {
					return function() {
						setAiIndex(index);
					};
				})(i);
                span.innerText = "Play " + aiList[i].getName();
                messageText.appendChild(span);
				messageText.appendChild(document.createElement("br"));
            }
            if (aiList.length > 1) {
                const aiVsAiSpan = document.createElement("span");
                aiVsAiSpan.className = 'skipBonus';
                aiVsAiSpan.onclick = goai;
                aiVsAiSpan.innerText = "AI vs AI";
                messageText.appendChild(aiVsAiSpan);
            }
            messageText.appendChild(document.createElement("br"));
        }
    } else if (haveBothEmails()) {
        if (!metadata.tournamentName && !playingOnlineGame()) {
            const link = document.createElement("a");
            link.href = shortUrl;
            link.innerText = "link";
            messageText.appendChild(document.createTextNode("Or, copy and share this "));
            messageText.appendChild(link);
            messageText.appendChild(document.createTextNode(" with your opponent."));
        }
        /* if (!playingOnlineGame()) {
            showSubmitMoveForm(shortUrl);
        } */
    } else if ((activeAi && getCurrentPlayer() === activeAi.player) || (activeAi2 && getCurrentPlayer() === activeAi2.player)) {
        //messageText += "<span class='skipBonus' onclick='playAiTurn();'>Submit move to AI</span>";
        const thinkingEm = document.createElement("em");
        thinkingEm.innerText = "THINKING...";
        messageText.appendChild(thinkingEm);
    } else if (activeAi && activeAi.getMessage) {
        messageText.appendChild(document.createTextNode(activeAi.getMessage()));
    }

    if (getGameWinner()) {
        // There is a winner!
        messageText.appendChild(document.createElement("br"));
        const winnerStrong = document.createElement("strong");
        winnerStrong.appendChild(document.createTextNode(getGameWinner()));
        const winReason = getGameWinReason();
        if (typeof winReason === 'string') {
            winnerStrong.appendChild(document.createTextNode(winReason));
        } else {
            winnerStrong.appendChild(winReason);
        }
        messageText.appendChild(winnerStrong);
        // Save winner
        if (okToUpdateWinInfo && playingOnlineGame()) {
            let winnerUsername;
            /*
                Host win: 1
                Guest win: 0
                Draw: 0.5
            */
            let hostResultCode = 0.5;
            if (getGameWinner() === HOST) {
                winnerUsername = currentGameData.hostUsername;
                hostResultCode = 1;
            } else if (getGameWinner() === GUEST) {
                winnerUsername = currentGameData.guestUsername;
                hostResultCode = 0;
            }

            let newPlayerRatings = {};
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
            messageText.appendChild(getResetMoveElement());
        }
    } else if (gameController.gameHasEndedInDraw && gameController.gameHasEndedInDraw()) {
        if (okToUpdateWinInfo && playingOnlineGame()) {
            onlinePlayEngine.updateGameWinInfoAsTie(gameId, gameController.theGame.getWinResultTypeCode(), getLoginToken(), emptyCallback);
        }
        messageText.appendChild(document.createTextNode("Game has ended in a draw."));

        if (gameController.isSolitaire) {
            messageText.appendChild(getResetMoveElement());
        }
    } else {
        if (!playingOnlineGame()) {
            messageText.appendChild(document.createTextNode("Current Player: " + getCurrentPlayer()));
            messageText.appendChild(document.createElement("br"));
        }
		const additionalMsgElem = gameController.getAdditionalMessage();
		if (typeof additionalMsgElem === 'string') {
			messageText.appendChild(document.createTextNode(additionalMsgElem));
		} else if (additionalMsgElem) {
			messageText.appendChild(additionalMsgElem);
		}
		messageText.appendChild(getResetMoveElement());
	}

	const gameMessageElement = getGameMessageElement();
	while (gameMessageElement.firstChild) {
		gameMessageElement.removeChild(gameMessageElement.firstChild);
	}
	gameMessageElement.appendChild(messageText);

	if (gameController && gameController.getAdditionalMessageElement) {
		getGameMessageElement().appendChild(document.createElement("br"));
		getGameMessageElement().appendChild(gameController.getAdditionalMessageElement());
		getGameMessageElement().appendChild(document.createElement("br"));
	}

	// QUICK!
	if ((activeAi && getCurrentPlayer() === activeAi.player) || (activeAi2 && getCurrentPlayer() === activeAi2.player)) {
		// setTimeout(function() { playAiTurn(); }, 100);	// Didn't work?
		playAiTurn();
	}
}

export function haveBothEmails() {
	return hostEmail && guestEmail && haveUserEmail();
}

export function getUserEmail() {
	return localStorage.getItem(userEmailKey);
}

export function getCurrentPlayerEmail() {
	let address;
	if (getCurrentPlayer() === HOST) {
		address = hostEmail;
	} else if (getCurrentPlayer() === GUEST) {
		address = guestEmail;
	}
	return address;
}

export function getOpponentPlayerEmail() {
	let address;
	if (getCurrentPlayer() === HOST) {
		address = guestEmail;
	} else if (getCurrentPlayer() === GUEST) {
		address = hostEmail;
	}
	return address;
}

export function getEmailBody(url) {
	let bodyMessage = "I just made move #" + gameController.gameNotation.getLastMoveNumber() + " in a game of Pai Sho! Click here to open our game: " + url;

	bodyMessage += "[BR][BR]---- Full Details: ----[BR]Move: " + gameController.gameNotation.getLastMoveText() +
		"[BR][BR]Game Notation: [BR]" + gameController.gameNotation.getNotationForEmail();

	return bodyMessage;
}

export function getCurrentPlayer() {
	return gameController.getCurrentPlayer();
}

export function getCurrentPlayerForReal() {
	return gameController.getCurrentPlayer();
}

// export function getResetMoveText() {
// 	if (activeAi) {
// 		return "";	// Hide "Undo" if playing against an AI
// 	}
// 	if (!gameController.undoMoveAllowed || gameController.undoMoveAllowed()) {
// 		return "<br /><span class='skipBonus' onclick='resetMove();'>Undo move</span>";
// 	} else {
// 		return "";
// 	}
// }

export function getResetMoveElement() {
    if (activeAi) {
        return document.createElement("span");	// Return empty span if playing against an AI
    }

    const container = document.createElement("span");

    if (!gameController.undoMoveAllowed || gameController.undoMoveAllowed()) {
        container.appendChild(document.createElement("br"));

        const span = document.createElement("span");
        span.className = "skipBonus";
        span.textContent = "Undo move";
        span.onclick = function() {
            resetMove();
        };

        container.appendChild(span);
    }

    return container;
}

export function skipClicked() {
	if (gameController && gameController.skipClicked) {
		gameController.skipClicked();
	}
}

// getSkipButtonHtmlText removed - use getSkipButtonElement instead

export function getSkipButtonElement(overrideText) {
    let text = "Skip";
    if (overrideText) {
        text = overrideText;
    }

    const container = document.createElement("span");
    container.appendChild(document.createElement("br"));

    const button = document.createElement("button");
    button.style.fontSize = "medium";
    button.textContent = text;
    button.onclick = function() {
        skipClicked();
    };

    container.appendChild(button);
    return container;
}

export function showSkipButtonMessage(overrideText) {
    getGameMessageElement().appendChild(getSkipButtonElement(overrideText));
}

export function showResetMoveMessage() {
    getGameMessageElement().appendChild(getResetMoveElement());
}

export function resetMove() {
	lockedInNotationTextForUrlData = null;
	const rerunHandledByController = gameController.resetMove();

	if (!rerunHandledByController) {
		rerunAll();
	}
	hideConfirmMoveButton();
	// $('#contactform').addClass('gone');
}

window.resetMove = resetMove

export function myTurn() {
	if (isSuperSandboxMode()) {
		return true;
	}

	const userEmail = localStorage.getItem(localEmailKey);
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

export function myTurnForReal() {
	const userEmail = localStorage.getItem(localEmailKey);
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

const createGameCallback = (newGameId) => {
	finalizeMove();
	lastKnownGameNotation = gameController.gameNotation.notationTextForUrl();

	// If a solitaire game, automatically join game.
	if (gameController.isSolitaire()) {
		completeJoinGameSeek({
			gameId: newGameId
		});
	}

	const container = document.createElement('div');
	container.appendChild(document.createTextNode("You just created a game. Anyone can join it by clicking on Join Game. You can even join your own game if you'd like."));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode("If anyone joins this game, it will show up in your list of games when you click My Games."));
	showModalElem("Game Created!", container);
};

const createPrivateGameCallback = (newGameId) => {
	finalizeMove();
	lastKnownGameNotation = gameController.gameNotation.notationTextForUrl();

	// If a solitaire game, automatically join game.
	if (gameController.isSolitaire()) {
		completeJoinGameSeek({
			gameId: newGameId
		});
	}

	const inviteLinkUrl = createInviteLinkUrl(newGameId);

	const container = document.createElement('div');
	container.appendChild(document.createTextNode("You just created a private game. Send "));
	const inviteLink = document.createElement('a');
	inviteLink.href = inviteLinkUrl;
	inviteLink.target = '_blank';
	inviteLink.textContent = 'this invite link';
	container.appendChild(inviteLink);
	container.appendChild(document.createTextNode(" to a friend so they can join. "));
	const copyBtn = document.createElement('button');
	copyBtn.classList.add('button');
	copyBtn.textContent = 'Copy Link';
	copyBtn.onclick = function() { copyTextToClipboard(inviteLinkUrl, this); };
	container.appendChild(copyBtn);
	container.appendChild(document.createTextNode(" "));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode("When a player joins this game, it will show up in your list of games when you click My Games."));
	showModalElem("Game Created!", container, true);
};

export function createInviteLinkUrl(newGameId) {
	let urlParamStr = "ig=" + newGameId + "&h=" + getUsername();
	if (!getBooleanPreference(createNonRankedGamePreferredKey) && !getGameTypeEntryFromId(currentGameData.gameTypeId).noRankedGames) {
		urlParamStr += "&r=y";
	}
	let linkUrl = compressToEncodedURIComponent(urlParamStr);
	linkUrl = sandboxUrl + "?" + linkUrl;
	return linkUrl;
}

export function askToJoinGame(gameId, hostUsername, rankedGameInd) {
	/* Set up QueryString as if joining through game invite link to trigger asking */
	QueryString.joinPrivateGame = gameId.toString();
	QueryString.hostUserName = hostUsername;
	QueryString.allowJoiningOwnGame = true;
	QueryString.rankedGameInd = rankedGameInd;
	jumpToGame(gameId);
}

export function askToJoinPrivateGame(privateGameId, hostUserName, rankedGameInd, gameClock) {
	if (userIsLoggedIn()) {
		const container = document.createElement('div');

		if (currentGameData.hostUsername && currentGameData.guestUsername) {
			container.appendChild(document.createTextNode("A Guest has already joined this game."));
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));
			const okDiv = document.createElement('div');
			okDiv.classList.add('clickableText');
			okDiv.textContent = 'OK';
			okDiv.onclick = () => closeModal();
			container.appendChild(okDiv);
		} else {
			container.appendChild(document.createTextNode("Do you want to join this game hosted by " + hostUserName + "?"));

			if (rankedGameInd === 'y' || rankedGameInd === 'Y') {
				container.appendChild(document.createElement('br'));
				container.appendChild(document.createElement('br'));
				const strongRanked = document.createElement('strong');
				strongRanked.textContent = ' This is a ranked game.';
				container.appendChild(strongRanked);
			}

			if (gameClock && GameClock.isEnabled()) {
				container.appendChild(document.createElement('br'));
				container.appendChild(document.createElement('br'));
				const strongClock = document.createElement('strong');
				strongClock.textContent = 'This game has a game clock (beta): ' + gameClock.getLabelText();
				container.appendChild(strongClock);
				container.appendChild(document.createElement('br'));
				const clockLink = document.createElement('a');
				clockLink.href = 'https://forum.skudpaisho.com/showthread.php?tid=158';
				clockLink.target = '_blank';
				clockLink.textContent = 'Read about the Game Clock feature.';
				container.appendChild(clockLink);
			}

			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));

			const yesDiv = document.createElement('div');
			yesDiv.classList.add('clickableText');
			yesDiv.textContent = 'Yes - join game';
			yesDiv.onclick = () => { closeModal(); yesJoinPrivateGame(privateGameId); };
			container.appendChild(yesDiv);

			container.appendChild(document.createElement('br'));

			const noDiv = document.createElement('div');
			noDiv.classList.add('clickableText');
			noDiv.textContent = 'No - cancel';
			noDiv.onclick = () => closeModal();
			container.appendChild(noDiv);
		}

		if (!iAmPlayerInCurrentOnlineGame() || QueryString.allowJoiningOwnGame) {
			showModalElem("Join Game?", container, true);
		}
	} else {
		const container = document.createElement('div');
		container.appendChild(document.createTextNode("To join this game hosted by " + hostUserName + ", please sign in and then refresh this page."));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const okDiv = document.createElement('div');
		okDiv.classList.add('clickableText');
		okDiv.textContent = 'OK';
		okDiv.onclick = () => closeModal();
		container.appendChild(okDiv);

		showModalElem("Sign In Before Joining Game", container);
	}
}

export function yesJoinPrivateGame(privateGameId) {
	completeJoinGameSeek({
		gameId: privateGameId
	});
}

export let submitMoveData = {};
const submitMoveCallback = (resultData, move) => {
	lastKnownGameNotation = gameController.gameNotation.notationTextForUrl();
	finalizeMove(submitMoveData.moveAnimationBeginStep, false, true);

	if (move && move.fullMoveText) {
		sendChat("➢ " + move.fullMoveText);
	}

	startWatchingNumberOfGamesWhereUserTurn();

	closeModal();

	// Removing: Building this into the submit move
	// onlinePlayEngine.notifyUser(getLoginToken(), currentGameOpponentUsername, emptyCallback);
};

export function clearMessage() {
	const helpTabContentDiv = document.getElementById("helpTextContent");

	// Clear the div
	while (helpTabContentDiv.firstChild) {
		helpTabContentDiv.removeChild(helpTabContentDiv.firstChild);
	}

	// if (!defaultHelpMessageText) {	// Load help message every time
	defaultHelpMessageText = gameController.getDefaultHelpMessageText();
	// }

	const helpSpan = document.createElement("span");
	if (defaultHelpMessageText instanceof HTMLElement) {
		helpSpan.appendChild(defaultHelpMessageText);
	} else {
		helpSpan.innerHTML = defaultHelpMessageText;
	}
	helpTabContentDiv.appendChild(helpSpan);

	const tournamentText = getTournamentText();
	if (tournamentText) {
		const tourSpan = document.createElement("span");
		tourSpan.innerHTML = tournamentText;
		helpTabContentDiv.insertBefore(tourSpan, helpTabContentDiv.firstChild);
	}

	if (gameController.getAdditionalHelpTabDiv) {
		const additionalDiv = gameController.getAdditionalHelpTabDiv();
		if (additionalDiv) {
			helpTabContentDiv.appendChild(additionalDiv);
		}
	}

	if (gameController.isPaiShoGame) {
		helpTabContentDiv.appendChild(buildPaiShoSettingsDiv());
	}
}

export function haveUserEmail() {
	const userEmail = localStorage.getItem(localEmailKey);
	return userEmail && userEmail.includes("@") && userEmail.includes(".");
}

export function unplayedTileClicked(tileDiv) {
	/* If super sandbox mode, sandbox game immediately */
	if (isSuperSandboxMode()) {
		truncateMovesForSuperSandboxMode();
	}

	gameController.unplayedTileClicked(tileDiv);
}

export function pointClicked(htmlPoint) {
	/* If super sandbox mode, sandbox game immediately */
	if (isSuperSandboxMode()) {
		truncateMovesForSuperSandboxMode();
	}

	gameController.pointClicked(htmlPoint);
}

export function boardTileHovered(htmlPoint) {
	if (gameController.boardTileHovered) {
		gameController.boardTileHovered(htmlPoint);
	}
}

export function boardTileUnhovered() {
	if (gameController.boardTileUnhovered) {
		gameController.boardTileUnhovered();
	}
}

export function RmbDown(htmlPoint) {
	if (gameController.RmbDown) {
		gameController.RmbDown(htmlPoint);
	}
}

export function RmbUp(htmlPoint) {
	if (gameController.RmbUp) {
		gameController.RmbUp(htmlPoint);
	}
}

export function displayReturnedMessage(messageReturned) {
	const heading = messageReturned.heading;
	const message = messageReturned.message;
	const container = document.createElement('div');

	if (heading) {
		container.appendChild(toHeading(heading));
	}

	if (message.length > 1) {
		container.appendChild(toBullets(message));
	} else {
		container.appendChild(toMessage(message));
	}

	setMessage(container);
}

export function showTileMessage(tileDiv) {
	const messageReturned = gameController.getTileMessage(tileDiv);
	displayReturnedMessage(messageReturned);
}

export function showPointMessage(htmlPoint) {
	const messageReturned = gameController.getPointMessage(htmlPoint);
	if (messageReturned) {
		displayReturnedMessage(messageReturned);
	}
}

export function setMessage(msg) {
	const helpTextContent = document.getElementById("helpTextContent");

	if (msg instanceof HTMLElement) {
		// Toggle: if same content is already displayed, reset to default
		if (msg.innerHTML === helpTextContent.innerHTML) {
			clearMessage();
			return;
		}
		// Clear existing content
		while (helpTextContent.firstChild) {
			helpTextContent.removeChild(helpTextContent.firstChild);
		}
		// Add tournament text if any
		const tournamentText = getTournamentText();
		if (tournamentText) {
			const tourSpan = document.createElement('span');
			tourSpan.innerHTML = tournamentText;
			helpTextContent.appendChild(tourSpan);
		}
		helpTextContent.appendChild(msg);
	} else {
		if (msg === helpTextContent.innerHTML) {
			clearMessage();
		} else {
			helpTextContent.innerHTML = getTournamentText() + msg;
		}
	}
}

// function getAltTilesOptionText() {
// 	return "<p><span class='skipBonus' onclick='toggleTileDesigns();'>Click here</span> to switch between classic, modern, and Vescucci tile designs for Skud Pai Sho.<br />Currently selected: " + getSelectedTileDesignTypeDisplayName() + "</p>";
// }

// function getAltVagabondTilesOptionText() {
// 	return "<p><span class='skipBonus' onclick='toggleVagabondTileDesigns();'>Click here</span> to switch between standard and modern tile designs for Vagabond Pai Sho.</p>";
// }

export function getTournamentText() {
	if (metadata.tournamentMatchNotes) {
		return metadata.tournamentName + "<br />" + metadata.tournamentMatchNotes + "<br />";
	}
	return "";
}

export function toHeading(str) {
	const h4 = document.createElement('h4');
	if (str instanceof HTMLElement) {
		h4.appendChild(str);
	} else {
		h4.textContent = str;
	}
	return h4;
}

export function toMessage(paragraphs) {
	const container = document.createElement('span');

	if (paragraphs.length === 1) {
		const item = paragraphs[0];
		if (item instanceof HTMLElement) {
			container.appendChild(item);
		} else {
			container.innerHTML = item;
		}
	} else if (paragraphs.length > 1) {
		paragraphs.forEach((item) => {
			const p = document.createElement('p');
			if (item instanceof HTMLElement) {
				p.appendChild(item);
			} else {
				p.innerHTML = item;
			}
			container.appendChild(p);
		});
	}

	return container;
}

export function toBullets(paragraphs) {
	const ul = document.createElement('ul');

	paragraphs.forEach((item) => {
		const li = document.createElement('li');
		if (item instanceof HTMLElement) {
			li.appendChild(item);
		} else {
			li.innerHTML = item;
		}
		ul.appendChild(li);
	});

	return ul;
}

export function getNeutralPointMessage() {
	let msg = "<h4>Neutral Point</h4>";
	msg += "<ul>";
	msg += "<li>This point is Neutral, so any tile can land here.</li>";
	msg += "<li>If a tile that is on a point touches a Neutral area of the board, that point is considered Neutral.</li>";
	msg += "</ul>";
	return msg;
}

export function getRedPointMessage() {
	let msg = "<h4>Red Point</h4>";
	msg += "<p>This point is Red, so Basic White Flower Tiles are not allowed to land here.</p>";
	return msg;
}

export function getWhitePointMessage() {
	let msg = "<h4>White Point</h4>";
	msg += "<p>This point is White, so Basic Red Flower Tiles are not allowed to land here.</p>";
	return msg;
}

export function getRedWhitePointMessage() {
	let msg = "<h4>Red/White Point</h4>";
	msg += "<p>This point is both Red and White, so any tile is allowed to land here.</p>";
	return msg;
}

export function getGatePointMessage() {
	let msg = "<h4>Gate</h4>";
	msg += '<p>This point is a Gate. When Flower Tiles are played, they are <em>Planted</em> in an open Gate.</p>';
	msg += '<p>Tiles in a Gate are considered <em>Growing</em>, and when they have moved out of the Gate, they are considered <em>Blooming</em>.</p>';
	return msg;
}

export function userHasGameAccess() {
	const gameTypeId = gameController.getGameTypeId && gameController.getGameTypeId();
	return gameTypeId
		&& (gameDevOn
			|| !getGameTypeEntryFromId(gameTypeId).usersWithAccess
			|| usernameIsOneOf(getGameTypeEntryFromId(gameTypeId).usersWithAccess));
}

export async function sandboxitize(isSuperSandbox) {
	/* Verify game access if it would start a new game at move 0 */
	if (currentMoveIndex === 0 && !userHasGameAccess()) {
		return;
	}

	const notation = gameController.getNewGameNotation();
	for (let i = 0; i < currentMoveIndex; i++) {
		if (gameController.getSandboxNotationMove) {
			notation.addMove(gameController.getSandboxNotationMove(i));
		} else {
			notation.addMove(gameController.gameNotation.moves[i]);
		}
	}

	await setGameController(currentGameData.gameTypeId, true);

	if (isSuperSandbox) {
		enterSuperSandboxMode();
	}

	if (userIsLoggedIn()) {
		currentGameData.hostUsername = getUsername();
		currentGameData.guestUsername = getUsername();
	}

	gameController.setGameNotation(notation.notationTextForUrl());
	rerunAll();
	showReplayControls();
}

export function getLink(forSandbox) {
	const notation = gameController.getNewGameNotation();

	for (let i = 0; i < currentMoveIndex; i++) {
		notation.addMove(gameController.gameNotation.moves[i]);
	}

	let linkUrl = "";

	if (currentGameData && currentGameData.gameTypeId) {
		linkUrl += "gameType=" + currentGameData.gameTypeId + "&";
	}

	if (forSandbox && getUserEmail()) {
		linkUrl += "host=" + getUserEmail() + "&";
		linkUrl += "guest=" + getUserEmail() + "&";
	}

	linkUrl += "game=" + notation.notationTextForUrl();

	linkUrl = compressToEncodedURIComponent(linkUrl);

	linkUrl = sandboxUrl + "?" + linkUrl;

	console.log(linkUrl);
	return linkUrl;
}

export function setAiIndex(i) {
	// Leave online game if needed
	if (playingOnlineGame()) {
		forgetCurrentGameInfo();
	}

	const aiList = gameController.getAiList();

	if (activeAi) {
		activeAi2 = aiList[i];
		activeAi2.setPlayer(getCurrentPlayer());
	} else {
		activeAi = aiList[i];
		activeAi.setPlayer(getCurrentPlayer());
	}
	gameController.startAiGame(finalizeMove);
}

export function clearAiPlayers() {
	activeAi = null;
	activeAi2 = null;
}

export function playAiTurn() {
	if (playingOnlineGame()) {
		clearAiPlayers();
	} else {
		gameController.playAiTurn(finalizeMove);
	}
}

export function sandboxFromMove() {
	superSandboxFromMove();
}

export function superSandboxFromMove() {
	sandboxitize(true);
}

export function openLink(linkUrl) {
	if (ios || QueryString.appType === 'ios') {
		// eslint-disable-next-line no-undef
		webkit.messageHandlers.callbackHandler.postMessage(
			'{"linkUrl":"' + linkUrl + '"}'
		);
	} else {
		window.open(linkUrl);
	}
}

/* Modal */
export function callFailed() {
	showModalElem("", document.createTextNode("Unable to load."));
}

export function showModalElem(headingText, modalMessageElement, onlyCloseByClickingX, yesNoOptions, useInvisibleModal) {
	// Make sure sidenav is closed
	closeNav();

	// Get the modal
	const modal = document.getElementById('myMainModal');

	if (!useInvisibleModal) {
		modal.classList.add('modalDefaultBackground');
	} else {
		modal.classList.remove('modalDefaultBackground');
	}

	// Get the <span> element that closes the modal
	const span = document.getElementsByClassName("myMainModalClose")[0];

	const modalHeading = document.getElementById('modalHeading');
	modalHeading.innerHTML = headingText;

	const modalMessage = document.getElementById('modalMessage');
	modalMessage.innerHTML = '';
	modalMessage.appendChild(modalMessageElement);

	if (yesNoOptions && yesNoOptions.yesFunction) {
		modalMessage.appendChild(document.createElement("br"));
		modalMessage.appendChild(document.createElement("br"));

		const yesDiv = document.createElement("div");
		yesDiv.innerText = yesNoOptions.yesText ? yesNoOptions.yesText : "OK";
		yesDiv.classList.add("clickableText");
		yesDiv.onclick = yesNoOptions.yesFunction;
		modalMessage.appendChild(yesDiv);

		modalMessage.appendChild(document.createElement("br"));
		const noDiv = document.createElement("div");
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
	span.onclick = function() {
		closeModal();
	};

	if (WelcomeTutorial.isTutorialInProgress()) {
		onlyCloseByClickingX = true;
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal && !onlyCloseByClickingX) {
			closeModal();
		}
	};
}

export function showModal(headingHTMLText, modalMessageHTMLText, onlyCloseByClickingX, yesNoOptions, useInvisibleModal) {
	// Make sure sidenav is closed
	closeNav();

	// Get the modal
	const modal = document.getElementById('myMainModal');

	if (!useInvisibleModal) {
		modal.classList.add('modalDefaultBackground');
	} else {
		modal.classList.remove('modalDefaultBackground');
	}

	// Get the <span> element that closes the modal
	const span = document.getElementsByClassName("myMainModalClose")[0];

	const modalHeading = document.getElementById('modalHeading');
	modalHeading.innerHTML = headingHTMLText;

	const modalMessage = document.getElementById('modalMessage');
	modalMessage.innerHTML = '';
	// modalMessage.innerHTML = modalMessageHTMLText;
	modalMessage.appendChild(convertToDomObject(modalMessageHTMLText));

	if (yesNoOptions && yesNoOptions.yesFunction) {
		modalMessage.appendChild(document.createElement("br"));
		modalMessage.appendChild(document.createElement("br"));

		const yesDiv = document.createElement("div");
		yesDiv.innerText = yesNoOptions.yesText ? yesNoOptions.yesText : "OK";
		yesDiv.classList.add("clickableText");
		yesDiv.onclick = yesNoOptions.yesFunction;
		modalMessage.appendChild(yesDiv);

		modalMessage.appendChild(document.createElement("br"));
		const noDiv = document.createElement("div");
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
	span.onclick = function() {
		closeModal();
	};

	if (WelcomeTutorial.isTutorialInProgress()) {
		onlyCloseByClickingX = true;
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal && !onlyCloseByClickingX) {
			closeModal();
		}
	};
}

export function closeModal() {
	document.getElementById('myMainModal').style.display = "none";

	if (WelcomeTutorial.isTutorialInProgress() || WelcomeTutorial.isTutorialOpen()) {
		OnboardingFunctions.showOnLoadAnnouncements();
	}

	WelcomeTutorial.resetTutorialState();
}

export let confirmMoveToSubmit = null;
let lockedInNotationTextForUrlData = null;

export function showCallSubmitMoveModal() {
	showModalElem(
		"Submitting Move",
		getLoadingModalElement(),
		true,
		null,
		true
	);
}

export function callSubmitMove(moveAnimationBeginStep, moveIsConfirmed, move) {
	if (!lockedInNotationTextForUrlData || (playingOnlineGame() && lockedInNotationTextForUrlData.gameId === gameId)) {
		lockedInNotationTextForUrlData = {
			gameId: gameId,
			notationText: gameController.gameNotation.notationTextForUrl()
		};
	}
	submitMoveData = {
		moveAnimationBeginStep: moveAnimationBeginStep
	};
	if (moveIsConfirmed || !isMoveConfirmationRequired()) {	/* Move should be processed */
		GameClock.stopGameClock();
		// if (!GameClock.currentClockIsOutOfTime()) {
		showCallSubmitMoveModal();
		onlinePlayEngine.submitMove(gameId, encodeURIComponent(lockedInNotationTextForUrlData.notationText), getLoginToken(), getGameTypeEntryFromId(currentGameData.gameTypeId).desc, submitMoveCallback,
			GameClock.getCurrentGameClockJsonString(), currentGameData.resultId, move);
		lockedInNotationTextForUrlData = null;
		// }
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

const sendVerificationCodeCallback = (response) => {
	const messageElement = document.getElementById('verificationCodeSendResponse');
	let message;
	if (response.includes('has been sent')) {
		message = "Verification code sent to " + emailBeingVerified + ". Be sure to check your spam or junk mail for the email.";
		message += "<br />Didn't get the email? Check your spam again. If it isn't there, try a different email address. Some email services reject the verification email.";
	} else {
		message = "Failed to send verification code, please try again. Join the Discord for help, or try another email address.";
	}

	const span = document.createElement("span");
	span.innerHTML = message;
	messageElement.innerHTML = "";
	messageElement.appendChild(span);
};

const isUserInfoAvailableCallback = (data) => {
	if (data && data.length > 0) {
		// user info not available
		const container = document.createElement('div');
		container.appendChild(document.createTextNode("Username or email unavailable."));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const backSpan = document.createElement('span');
		backSpan.classList.add('skipBonus');
		backSpan.textContent = 'Back';
		backSpan.onclick = () => loginClicked();
		container.appendChild(backSpan);
		showModalElem("Sign In", container);
	} else {
		document.getElementById("verificationCodeInput").disabled = false;
		const responseElement = document.getElementById('verificationCodeSendResponse');
		responseElement.innerHTML = "";
		const textSpan = document.createElement("span");
		textSpan.textContent = "Sending code... ";
		responseElement.appendChild(textSpan);
		const icon = document.createElement("i");
		icon.className = "fa fa-circle-o-notch fa-spin fa-fw";
		responseElement.appendChild(icon);
		onlinePlayEngine.sendVerificationCode(usernameBeingVerified, emailBeingVerified, sendVerificationCodeCallback);
	}
};

const userInfoExistsCallback = (data) => {
	if (data && parseInt(data.trim()) > 0) {
		// existing userId found
		tempUserId = data.trim();
		isUserInfoAvailableCallback();	// will trigger send verification code
	} else {
		// userInfo entered was not exact match. Is it available?
		onlinePlayEngine.isUserInfoAvailable(usernameBeingVerified, emailBeingVerified, isUserInfoAvailableCallback);
	}
};

const validateSignInCallback = (data) => {
	const signInResults = JSON.parse(data);

	if (signInResults.loginResult === "Success") {
		tempUserId = signInResults.userId;
		usernameBeingVerified = signInResults.userUsername;
		emailBeingVerified = signInResults.userEmail;

		createUserCallback(tempUserId);
	} else {
		showModalElem("Sign In", document.createTextNode("Sign in failed with provided account info. Please try again."));
	}
};

export function submitSignInClicked() {
	const usernameOrEmail = document.getElementById("usernameInput").value.trim();
	const userPassword = document.getElementById("userPasswordInput").value.trim();

	if ((usernameIsValid(usernameOrEmail) || emailIsValid(usernameOrEmail))
		&& passwordIsValid(userPassword, userPassword)) {
		onlinePlayEngine.validateSignIn(usernameOrEmail, userPassword, validateSignInCallback);
	} else {
		const container = document.createElement('div');
		container.appendChild(document.createTextNode("Invalid username or password. "));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const backSpan = document.createElement('span');
		backSpan.classList.add('skipBonus');
		backSpan.textContent = 'Back';
		backSpan.onclick = () => loginClicked();
		container.appendChild(backSpan);
		showModalElem("Sign In", container);
	}
}

export function sendVerificationCodeClicked() {
	emailBeingVerified = document.getElementById("userEmailInput").value.trim().toLowerCase();
	usernameBeingVerified = document.getElementById("usernameInput").value.trim();
	passwordBeingVerified = document.getElementById("userPasswordInput").value.trim();
	const passwordCheck = document.getElementById("userPasswordCheckInput").value.trim();

	// Only continue if email and username pass validation
	if (emailIsValid(emailBeingVerified)
		&& (passwordIsValid(passwordBeingVerified, passwordCheck) || passwordBeingVerified === '')
		&& usernameIsValid(usernameBeingVerified)) {
		onlinePlayEngine.userInfoExists(usernameBeingVerified, encodeURIComponent(emailBeingVerified), userInfoExistsCallback);
	} else {
		const container = document.createElement('div');
		container.appendChild(document.createTextNode("Invalid username, email, or password. Your username cannot be too short or too long, and cannot contain spaces. Your password must be at least 8 characters and can contain common special characters. "));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const backSpan = document.createElement('span');
		backSpan.classList.add('skipBonus');
		backSpan.textContent = 'Back';
		backSpan.onclick = () => loginClicked();
		container.appendChild(backSpan);
		showModalElem("Sign Up", container);
		passwordBeingVerified = "";
	}
}

export function usernameIsValid(usernameBeingVerified) {
	return usernameBeingVerified.match(/^([A-Za-z0-9_]){3,25}$/g);
}

export function passwordIsValid(passwordBeingVerified, passwordCheck) {
	return passwordBeingVerified === passwordCheck
		&& passwordBeingVerified.match(/^([A-Za-z0-9!@#$%^&*()_\-+={}:;<,>.?]){8,64}$/g);
}

export function emailIsValid(emailBeingVerified) {
	return emailBeingVerified.includes("@") && emailBeingVerified.includes(".");
}

export function verifyCodeClicked() {
	if (usernameBeingVerified && usernameBeingVerified.trim() != ""
		&& emailBeingVerified && emailBeingVerified.trim() != "") {

		const codeToVerify = document.getElementById("verificationCodeInput").value;
		if (codeToVerify && codeToVerify.trim() != "") {
			onlinePlayEngine.verifyCode(codeToVerify, verifyCodeCallback);
		}
	}
}

export function forgetPasswordClicked() {
	if (userIsLoggedIn()) {
		const yesNoOptions = {};
		yesNoOptions.yesText = "Yes - Remove my password";
		yesNoOptions.yesFunction = function() {
			onlinePlayEngine.removeUserPassword(getLoginToken(), removePasswordCallback);
		};
		yesNoOptions.noText = "Close";
		showModalElem(
			"Remove password?",
			document.createTextNode("Really remove "),
			false,
			yesNoOptions
		);
	}
}

const createDeviceIdCallback = (generatedDeviceId) => {
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

	updateFooter();
	clearMessage();

	setAccountHeaderLinkText();

	initialVerifyLogin();

	const container = document.createElement('div');
	container.appendChild(document.createTextNode("Hi, " + getUsername() + "! You are now signed in. The Garden Gate will remember you next time you come, unless you "));
	const strongElem = document.createElement('strong');
	strongElem.textContent = 'sign out';
	container.appendChild(strongElem);
	container.appendChild(document.createTextNode(" from the bottom of the My Games list."));

	const headingContainer = document.createElement('span');
	const icon = document.createElement('i');
	icon.classList.add('fa', 'fa-check');
	icon.setAttribute('aria-hidden', 'true');
	headingContainer.appendChild(icon);
	headingContainer.appendChild(document.createTextNode(" Successfully Signed In"));

	showModalElem(headingContainer.innerHTML, container);
};

const createUserCallback = (generatedUserId) => {
	tempUserId = generatedUserId;
	onlinePlayEngine.createDeviceIdForUser(tempUserId, createDeviceIdCallback);
};

const updatePasswordCallback = (data) => {
	let msg = "";
	if (data === 'Success') {
		msg = "Password successfully updated.";
	} else {
		msg = "Password update failed.";
	}

	showModalElem("Update Password", document.createTextNode(msg));
};

const removePasswordCallback = (data) => {
	let msg = "";
	if (data === 'Password removed.') {
		msg = "Password removed. You will be able to sign in using email verification, or set a password from the bottom of the My Games list.";
	} else {
		msg = "Password update failed.";
	}

	showModalElem("Remove Password", document.createTextNode(msg));
};

export function updatePasswordClicked() {
	if (userIsLoggedIn()) {
		const existingPassword = document.getElementById("userExistingPasswordInput").value.trim();
		const newPassword = document.getElementById("userPasswordInput").value.trim();
		const passwordCheck = document.getElementById("userPasswordCheckInput").value.trim();
		if (passwordIsValid(newPassword, passwordCheck)) {
			onlinePlayEngine.updateUserPassword(getLoginToken(), existingPassword, newPassword, updatePasswordCallback);
		} else {
			updatePasswordCallback("fail");
		}
	}
}

const verifyCodeCallback = (result) => {
	if (result === "verified") {
		if (tempUserId && tempUserId > 0) {
			createUserCallback(tempUserId);
		} else {
			onlinePlayEngine.createUser(usernameBeingVerified, emailBeingVerified, passwordBeingVerified, createUserCallback);
			passwordBeingVerified = "";
		}
	} else {
		closeModal();
		emailBeingVerified = "";
		usernameBeingVerified = "";
		tempUserId = null;
		showModalElem("Validation Failed", document.createTextNode("Validation failed. Please try again."));
	}
};

export function getUserId() {
	return localStorage.getItem(userIdKey);
}

export function getUsername() {
	return localStorage.getItem(usernameKey);
}

export function getDeviceId() {
	return localStorage.getItem(deviceIdKey);
}

export function userIsLoggedIn() {
	return getUserId() &&
		getUsername() &&
		getUserEmail() &&
		getDeviceId();
}

export function forgetCurrentGameInfo() {
	clearAiPlayers();

	// Exit sandbox mode. Any other places we need to do this?
	exitSuperSandboxMode();

	lockedInNotationTextForUrlData = null;

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
	currentGameData = {};
	currentMoveIndex = 0;
	pauseRun();

	// Change user to host
	hostEmail = getUserEmail();
	guestEmail = null;

	updateFooter();

	document.getElementById('chatMessagesDisplay').innerHTML = "";

	updateCurrentGameTitle();
}

export async function getGameControllerForGameType(gameTypeId) {
	const isMobile = mobileAndTabletcheck();
	return await loadGameController(gameTypeId, gameContainerDiv, isMobile);
}

export function showDefaultGameOpenedMessage(show) {
	if (show) {
		document.getElementById('defaultGameMessage').classList.remove('gone');
	} else {
		document.getElementById('defaultGameMessage').classList.add('gone');
	}
}

export function setGameTitleText(gameTitle) {
	const gameTitleElements = document.getElementsByClassName('game-title-text');
	for (let i = 0; i < gameTitleElements.length; i++) {
		gameTitleElements[i].innerText = gameTitle;
	}
}

export async function setGameController(gameTypeId, keepGameOptions) {
	setGameLogText('');

	let successResult = true;

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

	// Show loading indicator while game code downloads
	gameContainerDiv.innerHTML = '';
	gameContainerDiv.appendChild(getLoadingModalElement());

	gameController = await getGameControllerForGameType(gameTypeId);
	if (!gameController) {
		gameController = await getGameControllerForGameType(GameType.VagabondPaiSho.id);
		const container = document.createElement('div');
		container.appendChild(document.createTextNode("This game is unavailable. Try Vagabond Pai Sho instead :)"));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode("To know why the selected game is unavailable, ask in The Garden Gate Discord. Perhaps you have selected a new game that is coming soon!"));
		showModalElem("Cannot Load Game", container);
		successResult = false;
	}

	setGameTitleText(getGameTypeEntryFromId(gameTypeId).desc);

	if (gameController.completeSetup) {
		gameController.completeSetup();
	}

	if (gameController.supportsMoveLogMessages) {
		document.getElementById("toggleMoveLogDisplayDiv").classList.remove("gone");
	} else {
		document.getElementById("toggleMoveLogDisplayDiv").classList.add("gone");
	}

	isInReplay = false;

	// New game stuff:
	currentGameData.gameTypeId = gameTypeId;
	defaultHelpMessageText = null;
	clearMessage();
	refreshMessage();

	// Show AI options on game load if controller supports it
	if (gameController.readyToShowPlayAgainstAiOption && gameController.readyToShowPlayAgainstAiOption()) {
		linkShortenCallback('');
	}

	return successResult;
}

const jumpToGameCallback = async (results) => {
	if (results) {
		populateMyGamesList(results);

		const myGame = myGamesList[0];

		clearOptions();
		if (myGame.gameOptions) {
			for (let i = 0; i < myGame.gameOptions.length; i++) {
				addOption(myGame.gameOptions[i]);
			}
		}
		const gameControllerSuccess = await setGameController(myGame.gameTypeId, true);

		if (!gameControllerSuccess) {
			return;
		}

		// Is user even playing this game? This could be used to "watch" games
		const userIsPlaying = usernameEquals(myGame.hostUsername) ||
			usernameEquals(myGame.guestUsername);

		gameId = myGame.gameId;
		currentGameOpponentUsername = null;
		let opponentUsername;

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
			askToJoinPrivateGame(QueryString.joinPrivateGame, QueryString.hostUserName, QueryString.rankedGameInd, currentGameData.gameClock);
			/* Once we ask after jumping into a game, we won't need to ask again */
			QueryString.joinPrivateGame = null;
		}
	}
};

export function buildJoinGameChatMessage() {
	return "[Jamboree Note] Game joined at " + new Date().toString();
}

export function buildCompletedGameChatMessage() {
	return "[Jamboree Note] Game completed at " + new Date().toString();
}

export function shouldSendJamboreeNoteChat(gameTypeId) {
	return gameTypeId === GameType.Adevar.id;
}

export function jumpToGame(gameIdChosen) {
	if (!onlinePlayEnabled) {
		return;
	}
	clearGameWatchInterval();
	forgetCurrentGameInfo();
	if (!onlinePlayPaused) {
		onlinePlayEngine.getGameInfo(getUserId(), gameIdChosen, jumpToGameCallback);
	}
}

function jumpToGameIfPlayerIsInGame(gameId) {
	if (!onlinePlayEnabled) {
		return;
	}
	if (userIsLoggedIn()) {
		onlinePlayEngine.checkIfUserIsGameParticipant(gameId, getLoginToken(), (results) => {
			if (results && results.trim() === 'yes') {
				jumpToGame(gameId);
			}
		});
	}
}

export function populateMyGamesList(results) {
	const resultRows = results.split('\n');
	myGamesList = [];
	for (const index in resultRows) {
		const row = resultRows[index].split('|||');
		const myGame = {
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

export function getLoginToken() {
	return {
		userId: getUserId(),
		username: getUsername(),
		userEmail: getUserEmail(),
		deviceId: getDeviceId()
	};
}

const showPastGamesCallback = (results) => {
	const container = document.createElement('div');
	let showAll;

	if (results) {
		showAll = showAllCompletedGamesInList;
		let countOfGamesShown = 0;

		populateMyGamesList(results);

		if (localStorage.getItem("data-theme") == "stotes") {
			const table = document.createElement('table');
			const headerRow = document.createElement('tr');
			headerRow.classList.add('tr-header');
			['Game Mode', 'Host', '', 'Guest', 'Result', 'Date'].forEach((text, idx) => {
				const td = document.createElement('td');
				if (idx === 0) td.classList.add('first');
				td.textContent = text;
				headerRow.appendChild(td);
			});
			table.appendChild(headerRow);

			let even = true;
			for (const index in myGamesList) {
				const myGame = myGamesList[index];

				const gId = parseInt(myGame.gameId);
				const userIsHost = usernameEquals(myGame.hostUsername);
				const opponentUsername = userIsHost ? myGame.guestUsername : myGame.hostUsername;

				const row = document.createElement('tr');
				row.classList.add(even ? 'even' : 'odd');
				row.onclick = () => { jumpToGame(gId); closeModal(); };

				const gameTypeTd = document.createElement('td');
				gameTypeTd.classList.add('first');
				gameTypeTd.style.color = getGameColor(myGame.gameTypeDesc);
				gameTypeTd.textContent = myGame.gameTypeDesc;
				row.appendChild(gameTypeTd);

				const hostTd = document.createElement('td');
				hostTd.classList.add('name');
				hostTd.textContent = myGame.hostUsername;
				row.appendChild(hostTd);

				const vsTd = document.createElement('td');
				vsTd.textContent = 'vs.';
				row.appendChild(vsTd);

				const guestTd = document.createElement('td');
				guestTd.classList.add('name');
				guestTd.textContent = myGame.guestUsername;
				row.appendChild(guestTd);

				const resultTd = document.createElement('td');
				if (myGame.resultId === 10) {
					resultTd.textContent = '[inactive]';
				} else if (myGame.resultId === 8) {
					resultTd.textContent = '[quit]';
				} else if (usernameEquals(myGame.winnerUsername)) {
					resultTd.textContent = '[win]';
				} else if (myGame.winnerUsername === opponentUsername) {
					resultTd.textContent = '[loss]';
				} else {
					resultTd.textContent = '[ended]';
				}
				row.appendChild(resultTd);

				const dateTd = document.createElement('td');
				dateTd.textContent = myGame.timestamp.slice(0, 10);
				row.appendChild(dateTd);

				table.appendChild(row);

				for (let i = 0; i < myGame.gameOptions.length; i++) {
					const optRow = document.createElement('tr');
					optRow.classList.add(even ? 'even' : 'odd');
					optRow.onclick = () => { jumpToGame(gId); closeModal(); };
					const optTd1 = document.createElement('td');
					optTd1.classList.add('first');
					const optEm = document.createElement('em');
					optEm.textContent = '-Game Option';
					optTd1.appendChild(optEm);
					optRow.appendChild(optTd1);
					const optTd2 = document.createElement('td');
					optTd2.colSpan = 5;
					optTd2.textContent = getGameOptionDescription(myGame.gameOptions[i]);
					optRow.appendChild(optTd2);
					table.appendChild(optRow);
				}

				even = !even;
				countOfGamesShown++;
				if (!showAll && countOfGamesShown > 20) {
					break;
				}
			}

			const footerRow = document.createElement('tr');
			footerRow.classList.add('tr-footer');
			['Game Mode', 'Host', '', 'Guest', 'Result', 'Date'].forEach((text, idx) => {
				const td = document.createElement('td');
				if (idx === 0) td.classList.add('first');
				td.textContent = text;
				footerRow.appendChild(td);
			});
			table.appendChild(footerRow);
			container.appendChild(table);
		} else {
			let gameTypeHeading = "";
			for (const index in myGamesList) {
				const myGame = myGamesList[index];

				if (myGame.gameTypeDesc !== gameTypeHeading) {
					if (gameTypeHeading !== "") {
						container.appendChild(document.createElement('br'));
					}
					gameTypeHeading = myGame.gameTypeDesc;
					const headingDiv = document.createElement('div');
					headingDiv.classList.add('modalContentHeading');
					headingDiv.textContent = gameTypeHeading;
					container.appendChild(headingDiv);
				}

				const gId = parseInt(myGame.gameId);
				const userIsHost = usernameEquals(myGame.hostUsername);
				const opponentUsername = userIsHost ? myGame.guestUsername : myGame.hostUsername;

				let gameDisplayTitle = myGame.hostUsername;
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

				const gameDiv = document.createElement('div');
				gameDiv.classList.add('clickableText');
				gameDiv.textContent = gameDisplayTitle;
				gameDiv.onclick = () => { jumpToGame(gId); closeModal(); };
				container.appendChild(gameDiv);

				countOfGamesShown++;
				if (!showAll && countOfGamesShown > 20) {
					break;
				}

			}
		}

	} else {
		container.appendChild(document.createTextNode("No completed games."));
	}

	if (!showAll) {
		container.appendChild(document.createElement('br'));
		const showAllDiv = document.createElement('div');
		showAllDiv.classList.add('clickableText');
		showAllDiv.textContent = 'Show all';
		showAllDiv.onclick = () => showAllCompletedGames();
		container.appendChild(showAllDiv);
	}

	showModalElem("Completed Games", container);
};

let showAllCompletedGamesInList = false;
export function showPastGamesClicked() {
	closeModal();

	showAllCompletedGamesInList = false;
	if (!onlinePlayPaused) {
		onlinePlayEngine.getPastGamesForUserNew(getLoginToken(), showPastGamesCallback);
	}
}

export function showAllCompletedGames() {
	closeModal();

	showAllCompletedGamesInList = true;
	if (!onlinePlayPaused) {
		onlinePlayEngine.getPastGamesForUserNew(getLoginToken(), showPastGamesCallback);
	}
}

// Helper functions for building My Games list DOM elements
function createGameRowStotesTheme(myGame, even) {
	const gId = parseInt(myGame.gameId);
	const tr = document.createElement('tr');
	tr.className = myGame.isUserTurn ? 'highlighted-game' : (even ? 'even' : 'odd');
	tr.onclick = () => {
		jumpToGame(gId);
		closeModal();
	};

	// Game Mode column
	const tdGameMode = document.createElement('td');
	tdGameMode.className = 'first';
	tdGameMode.style.color = getGameColor(myGame.gameTypeDesc);
	tdGameMode.textContent = myGame.gameTypeDesc;
	tr.appendChild(tdGameMode);

	// Host column
	const tdHost = document.createElement('td');
	tdHost.className = 'name';
	if (myGame.hostOnline) {
		tdHost.appendChild(createUserOnlineIconElement());
	} else {
		tdHost.appendChild(createUserOfflineIconElement());
	}
	tdHost.appendChild(document.createTextNode(myGame.hostUsername));
	tr.appendChild(tdHost);

	// VS column
	const tdVs = document.createElement('td');
	tdVs.textContent = 'vs.';
	tr.appendChild(tdVs);

	// Guest column
	const tdGuest = document.createElement('td');
	tdGuest.className = 'name';
	if (myGame.guestOnline) {
		tdGuest.appendChild(createUserOnlineIconElement());
	} else {
		tdGuest.appendChild(createUserOfflineIconElement());
	}
	tdGuest.appendChild(document.createTextNode(myGame.guestUsername));
	tr.appendChild(tdGuest);

	// Turn column
	const tdTurn = document.createElement('td');
	tdTurn.textContent = myGame.isUserTurn ? 'Yours' : 'Theirs';
	tr.appendChild(tdTurn);

	return tr;
}

function createGameOptionRowStotesTheme(myGame, even) {
	const gId = parseInt(myGame.gameId);
	const gameOptions = [];

	for (let i = 0; i < myGame.gameOptions.length; i++) {
		const tr = document.createElement('tr');
		tr.className = even ? 'even' : 'odd';
		tr.onclick = () => {
			jumpToGame(gId);
			closeModal();
		};

		const tdFirst = document.createElement('td');
		tdFirst.className = 'first';
		const em = document.createElement('em');
		em.textContent = '-Game Option';
		tdFirst.appendChild(em);
		tr.appendChild(tdFirst);

		const tdOption = document.createElement('td');
		tdOption.colSpan = 5;
		tdOption.textContent = getGameOptionDescription(myGame.gameOptions[i]);
		tr.appendChild(tdOption);

		gameOptions.push(tr);
	}

	return gameOptions;
}

function createGameEntryDefaultTheme(myGame, gameColor) {
	const gId = parseInt(myGame.gameId);
	const userIsHost = usernameEquals(myGame.hostUsername);
	const userIsGuest = usernameEquals(myGame.guestUsername);

	// Create card container
	const entryDiv = document.createElement('div');
	entryDiv.classList.add('myGameEntry');
	if (myGame.isUserTurn) {
		entryDiv.classList.add('yourTurn');
	}
	entryDiv.style.setProperty('--game-color', gameColor);
	entryDiv.onclick = () => {
		jumpToGame(gId);
		closeModal();
	};

	// Content container
	const contentDiv = document.createElement('div');
	contentDiv.classList.add('myGameEntryContent');

	// Players line
	const playersDiv = document.createElement('div');
	playersDiv.classList.add('myGamePlayers');

	if (!userIsHost) {
		if (myGame.hostOnline) {
			playersDiv.appendChild(createUserOnlineIconElement());
		} else {
			playersDiv.appendChild(createUserOfflineIconElement());
		}
	}
	playersDiv.appendChild(document.createTextNode(myGame.hostUsername));
	playersDiv.appendChild(document.createTextNode(' vs. '));

	if (!userIsGuest) {
		if (myGame.guestOnline) {
			playersDiv.appendChild(createUserOnlineIconElement());
		} else {
			playersDiv.appendChild(createUserOfflineIconElement());
		}
	}
	playersDiv.appendChild(document.createTextNode(myGame.guestUsername));

	if (myGame.isUserTurn) {
		const turnSpan = document.createElement('span');
		turnSpan.classList.add('myGameTurnIndicator');
		turnSpan.textContent = '(Your turn)';
		playersDiv.appendChild(turnSpan);
	}

	contentDiv.appendChild(playersDiv);

	// Add game options
	for (let i = 0; i < myGame.gameOptions.length; i++) {
		const optionDiv = document.createElement('div');
		optionDiv.classList.add('myGameOption');
		optionDiv.textContent = '• ' + getGameOptionDescription(myGame.gameOptions[i]);
		contentDiv.appendChild(optionDiv);
	}

	entryDiv.appendChild(contentDiv);
	return entryDiv;
}

function createClickableDiv(text, onclickFn) {
	const div = document.createElement('div');
	div.className = 'clickableText';
	div.textContent = text;
	div.onclick = onclickFn;
	return div;
}

function createSpanWithClick(text, onclickFn) {
	const span = document.createElement('span');
	span.className = 'skipBonus';
	span.textContent = text;
	span.onclick = onclickFn;
	return span;
}

const showMyGamesCallback = (results) => {
	const container = document.createElement('div');

	if (!results) {
		container.textContent = 'No active games.';
	} else {
		populateMyGamesList(results);

		// Sort with favorites first
		myGamesList = sortGameListWithFavoritesFirst(myGamesList);

		if (localStorage.getItem("data-theme") == "stotes") {
			// Build table for stotes theme
			const table = document.createElement('table');

			// Header row
			const headerRow = document.createElement('tr');
			headerRow.className = 'tr-header';
			['Game Mode', 'Host', '', 'Guest', 'Turn'].forEach((text, index) => {
				const th = document.createElement('td');
				if (index === 0) th.className = 'first';
				th.textContent = text;
				headerRow.appendChild(th);
			});
			table.appendChild(headerRow);

			// Game rows
			let even = true;
			for (const index in myGamesList) {
				const myGame = myGamesList[index];

				// Main game row
				table.appendChild(createGameRowStotesTheme(myGame, even));

				// Game option rows
				const optionRows = createGameOptionRowStotesTheme(myGame, even);
				optionRows.forEach(row => table.appendChild(row));

				even = !even;
			}

			// Footer row
			const footerRow = document.createElement('tr');
			footerRow.className = 'tr-footer';
			['Game Mode', 'Host', '', 'Guest', ''].forEach((text, index) => {
				const td = document.createElement('td');
				if (index === 0) td.className = 'first';
				td.textContent = text;
				footerRow.appendChild(td);
			});
			table.appendChild(footerRow);

			container.appendChild(table);
		} else {
			// Build divs for default theme
			let gameTypeHeading = "";
			let currentSection = null;

			for (const index in myGamesList) {
				const myGame = myGamesList[index];
				const gameTypeEntry = getGameTypeEntryFromId(myGame.gameTypeId);

				// Resolve the game color
				let gameColor = gameTypeEntry?.color || 'var(--othercolor)';
				if (gameColor && gameColor.startsWith('var(')) {
					const varName = gameColor.match(/var\((--[\w-]+)\)/)?.[1];
					if (varName) {
						gameColor = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
					}
				}

				// Create new section when game type changes
				if (myGame.gameTypeDesc !== gameTypeHeading) {
					gameTypeHeading = myGame.gameTypeDesc;

					currentSection = document.createElement('div');
					currentSection.classList.add('myGamesSection');

					// Create heading with icon and colored border
					const headingDiv = document.createElement('div');
					headingDiv.classList.add('joinGameHeading');
					headingDiv.style.setProperty('--game-color', gameColor);

					if (gameTypeEntry?.coverImg) {
						const headingIcon = document.createElement('img');
						headingIcon.classList.add('joinGameHeadingIcon');
						headingIcon.src = 'style/game-icons/' + gameTypeEntry.coverImg;
						headingIcon.alt = gameTypeHeading;
						headingDiv.appendChild(headingIcon);
					}

					const headingText = document.createElement('span');
					headingText.textContent = gameTypeHeading;
					headingDiv.appendChild(headingText);

					// Add favorite star indicator to heading
					if (gameTypeEntry && isGameTypeFavorite(gameTypeEntry.id)) {
						const starIndicator = document.createElement('span');
						starIndicator.className = 'favoriteStar';
						starIndicator.innerHTML = "<i class='fa-solid fa-star' aria-hidden='true'></i>";
						headingDiv.appendChild(starIndicator);
					}

					currentSection.appendChild(headingDiv);
					container.appendChild(currentSection);
				}

				// Add game entry
				currentSection.appendChild(createGameEntryDefaultTheme(myGame, gameColor));
			}
		}
	}

	// Add footer links
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	container.appendChild(createClickableDiv('Show completed games', showPastGamesClicked));

	container.appendChild(document.createElement('br'));
	const hr = document.createElement('hr');
	container.appendChild(hr);

	const statsDiv = document.createElement('div');
	statsDiv.appendChild(createSpanWithClick('Completed Game Stats', showGameStats));
	container.appendChild(statsDiv);

	container.appendChild(document.createElement('br'));

	const rankingsDiv = document.createElement('div');
	const rankingsSpan = createSpanWithClick('Game Rankings', viewGameRankingsClicked);
	const icon = document.createElement('i');
	icon.className = 'fa fa-tachometer';
	icon.setAttribute('aria-hidden', 'true');
	rankingsSpan.insertBefore(icon, rankingsSpan.firstChild);
	rankingsSpan.insertBefore(document.createTextNode(' '), icon.nextSibling);
	rankingsDiv.appendChild(rankingsSpan);
	container.appendChild(rankingsDiv);

	container.appendChild(document.createElement('br'));

	const prefsDiv = document.createElement('div');
	prefsDiv.appendChild(createSpanWithClick('Device Preferences', showPreferences));
	container.appendChild(prefsDiv);

	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));

	const signedInDiv = document.createElement('div');
	signedInDiv.textContent = 'You are currently signed in as ' + getUsername() + '.';
	container.appendChild(signedInDiv);

	const passwordDiv = document.createElement('div');
	passwordDiv.appendChild(createSpanWithClick('Click here to update your password.', showChangePasswordModal));
	container.appendChild(passwordDiv);

	const signOutDiv = document.createElement('div');
	signOutDiv.appendChild(createSpanWithClick('Click here to sign out.', showSignOutModal));
	container.appendChild(signOutDiv);

	showModalElem("Active Games", container);
};

export function showMyGames() {
	if (!onlinePlayPaused) {
		showModalElem("Active Games", getLoadingModalElement());
		onlinePlayEngine.getCurrentGamesForUserNew(getLoginToken(), showMyGamesCallback);
	} else {
		showOnlinePlayPausedModal();
	}
}

export const emptyCallback = (results) => {
	// Nothing to do
};

export function emailNotificationsCheckboxClicked() {
	let value = 'N';
	if (document.getElementById("emailNotificationsCheckbox").checked) {
		value = 'Y';
	}
	onlinePlayEngine.updateEmailNotificationsSetting(getUserId(), value, emptyCallback);
}

/* var getEmailNotificationsSettingCallback = function getEmailNotificationsSettingCallback(result) {
	document.getElementById("emailNotificationsCheckbox").checked = (result && result.startsWith("Y"));
}; */
/* export function showAccountSettings() {
	let message = "Note: Email notifications are not working right now. Maybe in the future they will be back.<br />";

	message += "<div><input id='emailNotificationsCheckbox' type='checkbox' onclick='emailNotificationsCheckboxClicked();'>Email Notifications</div>";

	showModal("Settings", message);

	onlinePlayEngine.getEmailNotificationsSetting(getUserId(), getEmailNotificationsSettingCallback);
} */

export function showCurrentlyOfflineModal() {
	if (!window.navigator.onLine) {
		const containerDiv = document.createElement("div");

		const messageText = document.createTextNode("Currently offline, please try again when connected to the Internet.");
		containerDiv.appendChild(messageText);

		const lineBreak1 = document.createElement("br");
		containerDiv.appendChild(lineBreak1);

		const lineBreak2 = document.createElement("br");
		containerDiv.appendChild(lineBreak2);

		const okButton = document.createElement("span");
		okButton.className = "skipBonus";
		okButton.textContent = "OK";
		okButton.onclick = function() {
			closeModal();
		};
		containerDiv.appendChild(okButton);
		showModalElem("Currently Offline", containerDiv);
	}
}

export function accountHeaderClicked() {
	if (!window.navigator.onLine) {
		showCurrentlyOfflineModal();
	} else if (userIsLoggedIn() && onlinePlayEnabled) {
		showMyGames();
	} else {
		loginClicked();
	}
	requestNotificationPermission();
}

export function loginClicked() {
	const loginModalContentElement = buildLoginModalContentElement();
	showModalElem("Sign In", loginModalContentElement);
}

export function signUpClicked() {
	let msgContent;

	if (userIsLoggedIn()) {
		msgContent = document.createElement('div');
		msgContent.appendChild(document.createElement('br'));
		msgContent.appendChild(document.createElement('br'));
		msgContent.appendChild(document.createTextNode("You are currently signed in as " + getUsername()));
	} else {
		msgContent = buildSignUpModalContentElement();
	}

	showModalElem("Sign Up", msgContent);
}

const completeJoinGameSeekCallback = (gameJoined) => {
	const gameSeek = selectedGameSeek;
	if (gameJoined) {
		//   sendJoinGameChatMessage = true;
		jumpToGame(gameSeek.gameId);
		closeModal();
	}
};

export function completeJoinGameSeek(gameSeek) {
	selectedGameSeek = gameSeek;
	onlinePlayEngine.joinGameSeek(gameSeek.gameId, getLoginToken(), completeJoinGameSeekCallback);
}

const getCurrentGamesForUserNewCallback = (results) => {
	const gameSeek = selectedGameSeek;
	if (results) {

		populateMyGamesList(results);

		let gameExistsWithOpponent = false;

		for (const index in myGamesList) {
			const myGame = myGamesList[index];

			const userIsHost = usernameEquals(myGame.hostUsername);
			const opponentUsername = userIsHost ? myGame.guestUsername : myGame.hostUsername;

			if (opponentUsername === gameSeek.hostUsername
				&& gameSeek.gameTypeId === myGame.gameTypeId) {
				gameExistsWithOpponent = true;
			}
		}

		if (gameExistsWithOpponent) {
			closeModal();
			showModalElem("Cannot Join Game", document.createTextNode("You are already playing a game against that user, so you will have to finish that game first."));
		} else {
			askToJoinGame(gameSeek.gameId, gameSeek.hostUsername, gameSeek.rankedGame);
		}
	} else {
		// No results, means ok to join game
		completeJoinGameSeek(gameSeek);
	}
};

let selectedGameSeek;

export function acceptGameSeekClicked(gameIdChosen) {
	let gameSeek;
	for (const index in gameSeekList) {
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
		showModalElem("Cannot Join Game", document.createTextNode("This game is using new features that your version of The Garden Gate does not support."));
	}
}

export function tryRealTimeClicked() {
	onlinePlayEnabled = true;
	setAccountHeaderLinkText();
	initialVerifyLogin();
	rerunAll();
	closeModal();
}

export function gameOptionsSupportedForGameSeek(gameSeek) {
	let gameOptionsSupported = false;
	Object.keys(GameType).forEach((key, index) => {
		const gameType = GameType[key];
		if (gameType.id === gameSeek.gameTypeId && gameType.gameOptions) {
			let allSupportedGameOptions = gameType.gameOptions;
			if (gameType.secretGameOptions) {
				allSupportedGameOptions = allSupportedGameOptions.concat(gameType.secretGameOptions);
			}
			gameOptionsSupported = arrayIncludesAll(allSupportedGameOptions, gameSeek.gameOptions);
			return gameOptionsSupported;
		}
	});
	return gameOptionsSupported;
}

const getGameSeeksCallback = (results) => {
	const container = document.createElement('div');
	let gameSeeksDisplayed = false;
	if (results) {
		const resultRows = results.split('\n');

		gameSeekList = [];

		for (const index in resultRows) {
			const row = resultRows[index].split('|||');
			const gameSeek = {
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

		// Sort with favorites first
		gameSeekList = sortGameListWithFavoritesFirst(gameSeekList);

		let gameTypeHeading = "";

		if (localStorage.getItem("data-theme") == "stotes") {
			const table = document.createElement('table');
			const headerRow = document.createElement('tr');
			headerRow.classList.add('tr-header');
			const headerGameMode = document.createElement('td');
			headerGameMode.textContent = 'Game Mode';
			const headerHost = document.createElement('td');
			headerHost.textContent = 'Host';
			const headerRanking = document.createElement('td');
			headerRanking.textContent = 'Ranking';
			headerRow.appendChild(headerGameMode);
			headerRow.appendChild(headerHost);
			headerRow.appendChild(headerRanking);
			table.appendChild(headerRow);

			let even = true;
			for (const index in gameSeekList) {
				const gameSeek = gameSeekList[index];
				if (
					gameDevOn
					|| !getGameTypeEntryFromId(gameSeek.gameTypeId).usersWithAccess
					|| usernameIsOneOf(getGameTypeEntryFromId(gameSeek.gameTypeId).usersWithAccess)
				) {
					const gId = parseInt(gameSeek.gameId);
					const row = document.createElement('tr');
					row.classList.add('gameSeekEntry', even ? 'even' : 'odd');
					row.onclick = () => acceptGameSeekClicked(gId);

					const gameModeTd = document.createElement('td');
					gameModeTd.style.color = getGameColor(gameSeek.gameTypeDesc);
					gameModeTd.textContent = gameSeek.gameTypeDesc;
					row.appendChild(gameModeTd);

					const hostTd = document.createElement('td');
					const iconSpan = document.createElement('span');
					iconSpan.innerHTML = gameSeek.hostOnline ? getUserOnlineIcon() : getUserOfflineIcon();
					hostTd.appendChild(iconSpan);
					hostTd.appendChild(document.createTextNode(gameSeek.hostUsername));
					row.appendChild(hostTd);

					const rankingTd = document.createElement('td');
					rankingTd.textContent = gameSeek.rankedGame ? gameSeek.hostRating : 'N/A';
					row.appendChild(rankingTd);

					table.appendChild(row);

					for (let i = 0; i < gameSeek.gameOptions.length; i++) {
						const optionRow = document.createElement('tr');
						optionRow.classList.add(even ? 'even' : 'odd');
						optionRow.onclick = () => acceptGameSeekClicked(gId);
						const optionTd = document.createElement('td');
						optionTd.colSpan = 3;
						const emElem = document.createElement('em');
						emElem.textContent = '-Game Option: ' + getGameOptionDescription(gameSeek.gameOptions[i]);
						optionTd.appendChild(emElem);
						optionRow.appendChild(optionTd);
						table.appendChild(optionRow);
					}
					even = !even;
					gameSeeksDisplayed = true;
				}
			}

			const footerRow = document.createElement('tr');
			footerRow.classList.add('tr-footer');
			const footerGameMode = document.createElement('td');
			footerGameMode.textContent = 'Game Mode';
			const footerHost = document.createElement('td');
			footerHost.textContent = 'Host';
			const footerRanking = document.createElement('td');
			footerRanking.textContent = 'Ranking';
			footerRow.appendChild(footerGameMode);
			footerRow.appendChild(footerHost);
			footerRow.appendChild(footerRanking);
			table.appendChild(footerRow);

			container.appendChild(table);
		} else {
			let currentSection = null;

			for (const index in gameSeekList) {
				const gameSeek = gameSeekList[index];
				const gameTypeEntry = getGameTypeEntryFromId(gameSeek.gameTypeId);

				if (
					gameDevOn
					|| !gameTypeEntry.usersWithAccess
					|| usernameIsOneOf(gameTypeEntry.usersWithAccess)
				) {
					// Create new section when game type changes
					if (gameSeek.gameTypeDesc !== gameTypeHeading) {
						gameTypeHeading = gameSeek.gameTypeDesc;

						// Resolve the game color
						let gameColor = gameTypeEntry.color || 'var(--othercolor)';
						if (gameColor && gameColor.startsWith('var(')) {
							const varName = gameColor.match(/var\((--[\w-]+)\)/)?.[1];
							if (varName) {
								gameColor = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
							}
						}

						currentSection = document.createElement('div');
						currentSection.classList.add('joinGameSection');

						// Create heading with icon and colored border
						const headingDiv = document.createElement('div');
						headingDiv.classList.add('joinGameHeading');
						headingDiv.style.setProperty('--game-color', gameColor);

						if (gameTypeEntry.coverImg) {
							const headingIcon = document.createElement('img');
							headingIcon.classList.add('joinGameHeadingIcon');
							headingIcon.src = 'style/game-icons/' + gameTypeEntry.coverImg;
							headingIcon.alt = gameTypeHeading;
							headingDiv.appendChild(headingIcon);
						}

						const headingText = document.createElement('span');
						headingText.textContent = gameTypeHeading;
						headingDiv.appendChild(headingText);

						// Add favorite star indicator to heading
						if (isGameTypeFavorite(gameTypeEntry.id)) {
							const starIndicator = document.createElement('span');
							starIndicator.className = 'favoriteStar';
							starIndicator.innerHTML = "<i class='fa-solid fa-star' aria-hidden='true'></i>";
							headingDiv.appendChild(starIndicator);
						}

						currentSection.appendChild(headingDiv);
						container.appendChild(currentSection);
					}

					// Resolve the game color for entry hover
					let entryColor = gameTypeEntry.color || 'var(--othercolor)';
					if (entryColor && entryColor.startsWith('var(')) {
						const varName = entryColor.match(/var\((--[\w-]+)\)/)?.[1];
						if (varName) {
							entryColor = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
						}
					}

					const gId = parseInt(gameSeek.gameId);

					// Create card-style entry
					const entryDiv = document.createElement('div');
					entryDiv.classList.add('gameSeekEntry');
					entryDiv.style.setProperty('--game-color', entryColor);
					entryDiv.onclick = () => acceptGameSeekClicked(gId);

					// Content container
					const contentDiv = document.createElement('div');
					contentDiv.classList.add('gameSeekEntryContent');

					// Host line
					const hostDiv = document.createElement('div');
					hostDiv.classList.add('gameSeekHost');
					const iconSpan = document.createElement('span');
					iconSpan.innerHTML = gameSeek.hostOnline ? getUserOnlineIcon() : getUserOfflineIcon();
					hostDiv.appendChild(iconSpan);
					let hostText = ' ' + gameSeek.hostUsername;
					if (gameSeek.rankedGame) {
						hostText += ' (' + gameSeek.hostRating + ')';
					}
					hostDiv.appendChild(document.createTextNode(hostText));
					contentDiv.appendChild(hostDiv);

					// Game options
					for (let i = 0; i < gameSeek.gameOptions.length; i++) {
						const optionDiv = document.createElement('div');
						optionDiv.classList.add('gameSeekOption');
						optionDiv.textContent = '• ' + getGameOptionDescription(gameSeek.gameOptions[i]);
						contentDiv.appendChild(optionDiv);
					}

					entryDiv.appendChild(contentDiv);
					currentSection.appendChild(entryDiv);
					gameSeeksDisplayed = true;
				}
			}
		}
	}

	if (!gameSeeksDisplayed) {
		container.innerHTML = '';
		container.appendChild(document.createTextNode('No games available to join. You can create a new game, or '));
		const discordLink = document.createElement('a');
		discordLink.href = 'https://skudpaisho.com/discord';
		discordLink.target = '_blank';
		discordLink.textContent = 'Join the Discord';
		container.appendChild(discordLink);
		container.appendChild(document.createTextNode(' to find people to play with!'));
	}

	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	const emElem = document.createElement('em');
	const activeCountDiv = document.createElement('div');
	activeCountDiv.id = 'activeGamesCountDisplay';
	activeCountDiv.style.fontSize = 'smaller';
	activeCountDiv.innerHTML = '&nbsp;';
	emElem.appendChild(activeCountDiv);
	container.appendChild(emElem);

	onlinePlayEngine.getActiveGamesCount(getActiveGamesCountCallback);

	showModalElem("Join a game", container);
};

/* From https://css-tricks.com/snippets/javascript/unescape-html-in-js/ */
export function htmlDecode(input) {
	const e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export function parseGameOptions(optionsJsonString) {
	try {
		const decoded = htmlDecode(optionsJsonString);
		const optionsArray = JSON.parse(decoded);
		return optionsArray;
	}
	catch (err) {
		return [];
	}
}

export function viewGameSeeksClicked() {
	if (!window.navigator.onLine) {
		showCurrentlyOfflineModal();
	} else if (onlinePlayEnabled && userIsLoggedIn()) {
		if (!onlinePlayPaused) {
			showModalElem("Join a game", getLoadingModalElement());
			onlinePlayEngine.getGameSeeks(getGameSeeksCallback);
		} else {
			showOnlinePlayPausedModal();
		}
	} else if (onlinePlayEnabled) {
		const container = document.createElement('div');
		const signInSpan = document.createElement('span');
		signInSpan.classList.add('skipBonus');
		signInSpan.textContent = 'Sign in';
		signInSpan.onclick = () => loginClicked();
		container.appendChild(signInSpan);
		container.appendChild(document.createTextNode(" to play real-time games with others online. When you are signed in, this is where you can join games against other players."));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const emElem = document.createElement('em');
		const activeCountDiv = document.createElement('div');
		activeCountDiv.id = 'activeGamesCountDisplay';
		activeCountDiv.style.fontSize = 'smaller';
		activeCountDiv.innerHTML = '&nbsp;';
		emElem.appendChild(activeCountDiv);
		container.appendChild(emElem);
		showModalElem("Join a game", container);
		onlinePlayEngine.getActiveGamesCount(getActiveGamesCountCallback);
	} else {
		showModalElem("Join a game", document.createTextNode("Online play is disabled right now. Maybe you are offline. Try again later!"));
	}
}

const getActiveGamesCountCallback = (count) => {
	const activeCountDiv = document.getElementById('activeGamesCountDisplay');
	const countNum = parseInt(count, 10);
	if (activeCountDiv && Number.isFinite(countNum)) {
		activeCountDiv.innerText = countNum + " games active in the past 24 hours!";
	}
};

/* Creating a public game */
const yesCreateGame = (gameTypeId, rankedGame) => {
	let rankedInd = 'n';
	if (rankedGame && !getGameTypeEntryFromId(gameTypeId).noRankedGames) {
		rankedInd = 'y';
	}
	let gameClockJson = null;
	if (GameClock.currentClock && GameClock.currentClock.getJsonObjectString) {
		gameClockJson = GameClock.currentClock.getJsonObjectString();
	}
	onlinePlayEngine.createGame(gameTypeId, encodeURIComponent(gameController.gameNotation.notationTextForUrl()), JSON.stringify(ggOptions), '', getLoginToken(), createGameCallback,
		rankedInd, gameClockJson);
};

const yesCreatePrivateGame = (gameTypeId, rankedGame) => {
	let rankedInd = 'n';
	if (rankedGame && !getGameTypeEntryFromId(gameTypeId).noRankedGames) {
		rankedInd = 'y';
	}
	let gameClockJson = null;
	if (GameClock.currentClock && GameClock.currentClock.getJsonObjectString) {
		gameClockJson = GameClock.currentClock.getJsonObjectString();
	}
	onlinePlayEngine.createGame(gameTypeId, encodeURIComponent(gameController.gameNotation.notationTextForUrl()), JSON.stringify(ggOptions), 'Y', getLoginToken(), createPrivateGameCallback,
		rankedInd, gameClockJson);
};

export function replaceWithLoadingText(element) {
	element.innerHTML = getLoadingModalElement().innerHTML;
}

export function getCheckedValue(checkboxId) {
	const element = document.getElementById(checkboxId);
	return element && element.checked;
}

const getCurrentGameSeeksHostedByUserCallback = (results) => {
	const gameTypeId = tempGameTypeId;
	if (!results) {
		// If a solitaire game, automatically create game, as it'll be automatically joined.
		if (gameController.isSolitaire()) {
			yesCreateGame(gameTypeId);
		} else {
			const container = document.createElement('div');

			const questionDiv = document.createElement('div');
			questionDiv.textContent = 'Do you want to create a game for others to join?';
			container.appendChild(questionDiv);

			if (!getGameTypeEntryFromId(gameTypeId).noRankedGames) {
				if (!getBooleanPreference(createNonRankedGamePreferredKey)) {
					toggleBooleanPreference(createNonRankedGamePreferredKey);
				}
				container.appendChild(document.createElement('br'));
				const rankedDiv = document.createElement('div');
				const rankedCheckbox = document.createElement('input');
				rankedCheckbox.id = 'createRankedGameCheckbox';
				rankedCheckbox.type = 'checkbox';
				rankedCheckbox.checked = false;
				rankedCheckbox.onclick = () => toggleBooleanPreference(createNonRankedGamePreferredKey);
				rankedDiv.appendChild(rankedCheckbox);
				const rankedLabel = document.createElement('label');
				rankedLabel.htmlFor = 'createRankedGameCheckbox';
				rankedLabel.textContent = ' Ranked game (Player rankings will be affected and - in the future - publicly viewable game)';
				rankedDiv.appendChild(rankedLabel);
				container.appendChild(rankedDiv);
			}

			if (GameClock.userHasGameClockAccess()) {
				container.appendChild(document.createElement('br'));
				const timeControlsDiv = document.createElement('div');
				timeControlsDiv.id = 'timeControlsDropdownContainer';
				container.appendChild(timeControlsDiv);
			}

			if (!gameController.isInviteOnly) {
				container.appendChild(document.createElement('br'));
				const publicGameDiv = document.createElement('div');
				publicGameDiv.classList.add('clickableText');
				publicGameDiv.textContent = 'Yes - create public game';
				publicGameDiv.onclick = function() {
					replaceWithLoadingText(this);
					yesCreateGame(gameTypeId, !getBooleanPreference(createNonRankedGamePreferredKey));
					closeModal();
				};
				container.appendChild(publicGameDiv);
			}

			container.appendChild(document.createElement('br'));
			const privateGameDiv = document.createElement('div');
			privateGameDiv.classList.add('clickableText');
			privateGameDiv.textContent = 'Yes - create an invite-link game';
			privateGameDiv.onclick = function() {
				replaceWithLoadingText(this);
				yesCreatePrivateGame(gameTypeId, !getBooleanPreference(createNonRankedGamePreferredKey));
				closeModal();
			};
			container.appendChild(privateGameDiv);

			container.appendChild(document.createElement('br'));
			const localOnlyDiv = document.createElement('div');
			localOnlyDiv.classList.add('clickableText');
			localOnlyDiv.textContent = 'No - local game only';
			localOnlyDiv.onclick = () => { closeModal(); finalizeMove(); };
			container.appendChild(localOnlyDiv);

			showModalElem("Create game?", container);

			if (GameClock.userHasGameClockAccess()) {
				setTimeout(() => {
					const timeControlsDiv = document.getElementById("timeControlsDropdownContainer");
					if (timeControlsDiv) {
						timeControlsDiv.appendChild(GameClock.getTimeControlsDropdown());
						const timeControlsLinkSpan = document.createElement("span");
						const link = document.createElement("a");
						link.href = "https://forum.skudpaisho.com/showthread.php?tid=158";
						link.target = "_blank";
						link.textContent = "Read about the Game Clock feature.";
						timeControlsLinkSpan.appendChild(link);
						timeControlsDiv.appendChild(timeControlsLinkSpan);
					}
				}, 50);
			}
		}
	} else {
		finalizeMove();
		if (userIsLoggedIn()) {
			const container = document.createElement('div');

			const questionDiv = document.createElement('div');
			questionDiv.textContent = 'You already have a public game waiting for an opponent. Do you want to create a private game for others to join?';
			container.appendChild(questionDiv);

			if (!getGameTypeEntryFromId(gameTypeId).noRankedGames) {
				container.appendChild(document.createElement('br'));
				const rankedDiv = document.createElement('div');
				const rankedCheckbox = document.createElement('input');
				rankedCheckbox.id = 'createRankedGameCheckbox';
				rankedCheckbox.type = 'checkbox';
				rankedCheckbox.checked = !getBooleanPreference(createNonRankedGamePreferredKey);
				rankedCheckbox.onclick = () => toggleBooleanPreference(createNonRankedGamePreferredKey);
				rankedDiv.appendChild(rankedCheckbox);
				const rankedLabel = document.createElement('label');
				rankedLabel.htmlFor = 'createRankedGameCheckbox';
				rankedLabel.textContent = ' Ranked game (Player rankings will be affected and - coming soon - publicly available game)';
				rankedDiv.appendChild(rankedLabel);
				container.appendChild(rankedDiv);
			}

			if (GameClock.userHasGameClockAccess()) {
				container.appendChild(document.createElement('br'));
				const timeControlsDiv = document.createElement('div');
				timeControlsDiv.id = 'timeControlsDropdownContainer';
				container.appendChild(timeControlsDiv);
			}

			container.appendChild(document.createElement('br'));
			const privateGameDiv = document.createElement('div');
			privateGameDiv.classList.add('clickableText');
			privateGameDiv.textContent = 'Yes - create a private game with a friend';
			privateGameDiv.onclick = function() {
				replaceWithLoadingText(this);
				yesCreatePrivateGame(gameTypeId, !getBooleanPreference(createNonRankedGamePreferredKey));
				closeModal();
			};
			container.appendChild(privateGameDiv);

			container.appendChild(document.createElement('br'));
			const localOnlyDiv = document.createElement('div');
			localOnlyDiv.classList.add('clickableText');
			localOnlyDiv.textContent = 'No - local game only';
			localOnlyDiv.onclick = () => { closeModal(); finalizeMove(); };
			container.appendChild(localOnlyDiv);

			showModalElem("Create game?", container);
		} else {
			const notSignedInContainer = document.createElement('div');
			notSignedInContainer.appendChild(document.createTextNode("You are not signed in. "));
			notSignedInContainer.appendChild(document.createElement('br'));
			notSignedInContainer.appendChild(document.createElement('br'));
			notSignedInContainer.appendChild(document.createTextNode("You can still play the game locally, but it will not be saved online."));
			showModalElem("Game Not Created", notSignedInContainer);
			if (GameClock.userHasGameClockAccess()) {
				setTimeout(() => {
					const timeControlsDiv = document.getElementById("timeControlsDropdownContainer");
					if (timeControlsDiv) {
						timeControlsDiv.appendChild(GameClock.getTimeControlsDropdown());
						const timeControlsLinkSpan = document.createElement("span");
						timeControlsLinkSpan.innerHTML = "<a href='https://forum.skudpaisho.com/showthread.php?tid=158' target='_blank'>Read about the Game Clock feature.</a>";
						timeControlsDiv.appendChild(timeControlsLinkSpan);
					}
				}, 50);
			}
		}
	}
};

let tempGameTypeId;
export function createGameIfThatIsOk(gameTypeId) {
	tempGameTypeId = gameTypeId;
	if (playingOnlineGame()) {
		callSubmitMove();
	} else if (userIsLoggedIn() && window.navigator.onLine && !onlinePlayPaused) {
		onlinePlayEngine.getCurrentGameSeeksHostedByUser(getUserId(), gameTypeId, getCurrentGameSeeksHostedByUserCallback);
	} else {
		finalizeMove();
	}
}

/* Global Chat - delegated to GlobalChat module */
// Re-exported from GlobalChat module
export {
	fetchGlobalChats, fetchInitialGlobalChats, handleNewGlobalChatMessages, resetGlobalChats, sendGlobalChat
} from './GlobalChat';

// var callLogOnlineStatusPulse = function callLogOnlineStatusPulse() {
// 	logOnlineStatusIntervalValue = setTimeout(function() {
// 		debug("inside timeout call");
// 		logOnlineStatusPulse();
// 	}, 5000);
// 	debug("timeout set");
// }

export function logOnlineStatusPulse() {
	onlinePlayEngine.logOnlineStatus(getLoginToken(), emptyCallback);
	verifyLogin();
	fetchGlobalChats();
}

const LOG_ONLINE_STATUS_INTERVAL = 5000;
export function startLoggingOnlineStatus() {
	onlinePlayEngine.logOnlineStatus(getLoginToken(), emptyCallback);

	fetchInitialGlobalChats();

	clearLogOnlineStatusInterval();

	logOnlineStatusIntervalValue = setInterval(() => {
		if (!onlinePlayPaused) {
			logOnlineStatusPulse();
		}
	}, LOG_ONLINE_STATUS_INTERVAL);
}

export function clearLogOnlineStatusInterval() {
	if (logOnlineStatusIntervalValue) {
		clearInterval(logOnlineStatusIntervalValue);
		logOnlineStatusIntervalValue = null;
	}
}

export function setSidenavNewGameSection() {
	const section = document.getElementById("sidenavNewGameSection");
	section.innerHTML = "";

	Object.keys(GameType).forEach((key) => {
		section.appendChild(getSidenavNewGameEntryForGameType(GameType[key]));
	});
}

export async function closeGame() {
	if (gameDevOn) {
		await setGameController(GameType.Trifle.id);
		return;
	}
	const defaultGameTypeIds = [
		GameType.SkudPaiSho.id,
		GameType.VagabondPaiSho.id,
		GameType.Adevar.id,
		GameType.Ginseng.id
	];
	await setGameController(defaultGameTypeIds[randomIntFromInterval(0, defaultGameTypeIds.length - 1)]);
	showDefaultGameOpenedMessage(true);
}

export function getSidenavNewGameEntryForGameType(gameType) {
	const div = document.createElement('div');
	div.className = 'sidenavEntry';

	const span = document.createElement('span');
	span.className = 'sidenavLink skipBonus';
	span.textContent = gameType.desc;
	span.onclick = async function() {
		await setGameController(gameType.id);
		closeModal();
	};
	div.appendChild(span);

	const separator = document.createElement('span');
	separator.innerHTML = '&nbsp;-&nbsp;<i class="fa fa-book" aria-hidden="true"></i>&nbsp;';
	div.appendChild(separator);

	const rulesLink = document.createElement('a');
	rulesLink.href = gameType.rulesUrl;
	rulesLink.target = '_blank';
	rulesLink.className = 'newGameRulesLink sidenavLink';
	rulesLink.textContent = 'Rules';
	div.appendChild(rulesLink);

	return div;
}

function getNewGameEntryForGameType(gameType) {
	const newGameElem = document.createElement('div');

	if (
		gameDevOn
		|| !gameType.usersWithAccess
		|| usernameIsOneOf(gameType.usersWithAccess)
	) {
		if (localStorage.getItem("data-theme") == "stotes") {
			let small = true;
			if (gameType.desc == "Skud Pai Sho") {
				small = false;
			}
			if (gameType.desc == "Adevăr Pai Sho") {
				small = false;
			}
			if (gameType.desc == "Vagabond Pai Sho") {
				small = false;
			}
			// return '<div class="gameDiv ' + small + '" style="background-color:' + gameType.color + ';"><img ondblclick="setGameController(' + gameType.id + '); closeModal();" src="style/game-icons/' + gameType.coverImg + '"><h3 onclick="setGameController(' + gameType.id + '); closeModal();">' + gameType.desc + '</h3><div class="gameDiv-hidden"><span class="rulesSpan"><i class="fa fa-book" aria-hidden="true"></i>&nbsp;<a href="' + gameType.rulesUrl + '" target="_blank">Rules</a></span><p>' + gameType.description + '</p></div></div>';
			newGameElem.classList.add('gameDiv');
			if (small) {
				newGameElem.classList.add('small');
			}
			newGameElem.style.backgroundColor = gameType.color;

			// Image
			const img = document.createElement('img');
			img.src = 'style/game-icons/' + gameType.coverImg;
			img.ondblclick = async function() {
				await setGameController(gameType.id);
				closeModal();
			};
			newGameElem.appendChild(img);

			// Title
			const h3 = document.createElement('h3');
			h3.textContent = gameType.desc;
			h3.onclick = async function() {
				await setGameController(gameType.id);
				closeModal();
			};
			newGameElem.appendChild(h3);

			// Hidden expandable section
			const hiddenDiv = document.createElement('div');
			hiddenDiv.className = 'gameDiv-hidden';

			const rulesSpan = document.createElement('span');
			rulesSpan.className = 'rulesSpan';
			rulesSpan.innerHTML = '<i class="fa fa-book" aria-hidden="true"></i>&nbsp;';
			const rulesLink = document.createElement('a');
			rulesLink.href = gameType.rulesUrl;
			rulesLink.target = '_blank';
			rulesLink.textContent = 'Rules';
			rulesSpan.appendChild(rulesLink);
			hiddenDiv.appendChild(rulesSpan);

			const descP = document.createElement('p');
			descP.textContent = gameType.description;
			hiddenDiv.appendChild(descP);

			newGameElem.appendChild(hiddenDiv);

			// Create favorite star toggle for stotes theme
			const starButtonStotes = document.createElement('span');
			starButtonStotes.className = 'favoriteToggle';
			starButtonStotes.style.position = 'absolute';
			starButtonStotes.style.top = '5px';
			starButtonStotes.style.right = '5px';
			const isFavoriteStotes = isGameTypeFavorite(gameType.id);
			starButtonStotes.innerHTML = isFavoriteStotes
				? "<i class='fa-solid fa-star' aria-hidden='true'></i>"
				: "<i class='fa-solid fa-star' aria-hidden='true'></i>";
			if (isFavoriteStotes) {
				starButtonStotes.classList.add('favorited');
			}
			starButtonStotes.title = isFavoriteStotes ? 'Remove from favorites' : 'Add to favorites';
			starButtonStotes.onclick = function(e) {
				e.stopPropagation();
				const nowFavorite = toggleFavoriteGameType(gameType.id);
				this.innerHTML = nowFavorite
					? "<i class='fa-solid fa-star' aria-hidden='true'></i>"
					: "<i class='fa-solid fa-star' aria-hidden='true'></i>";
				this.classList.toggle('favorited', nowFavorite);
				this.title = nowFavorite ? 'Remove from favorites' : 'Add to favorites';
			};
			newGameElem.style.position = 'relative';
			newGameElem.appendChild(starButtonStotes);

			return newGameElem;
		} else {
			// Create the card div element
			const div = document.createElement("div");
			div.className = "newGameEntry";

			// Resolve the actual color value from CSS variable reference (e.g., "var(--skudcolor)" -> "#c83737")
			let gameColor = gameType.color;
			if (gameColor && gameColor.startsWith('var(')) {
				const varName = gameColor.match(/var\((--[\w-]+)\)/)?.[1];
				if (varName) {
					gameColor = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
				}
			}
			div.style.setProperty('--game-color', gameColor);

			// Create thumbnail image
			const thumbnail = document.createElement("img");
			thumbnail.className = "newGameThumbnail";
			thumbnail.src = 'style/game-icons/' + gameType.coverImg;
			thumbnail.alt = gameType.desc;

			// Create content container
			const contentDiv = document.createElement("div");
			contentDiv.className = "newGameEntryContent";

			// Create the span element for clickable text
			const spanClickableText = document.createElement("span");
			spanClickableText.className = "newGameTitle";
			spanClickableText.textContent = gameType.desc;

			// Create the anchor element for rules link
			const anchorRules = document.createElement("a");
			anchorRules.href = gameType.rulesUrl;
			anchorRules.target = "_blank";
			anchorRules.className = "newGameRulesLink";
			anchorRules.innerHTML = "<i class='fa fa-book' aria-hidden='true'></i> Rules";
			anchorRules.onclick = function(e) {
				e.stopPropagation();
			};

			// Create favorite star toggle
			const starButton = document.createElement('span');
			starButton.className = 'favoriteToggle';
			const isFavorite = isGameTypeFavorite(gameType.id);
			starButton.innerHTML = isFavorite
				? "<i class='fa-solid fa-star' aria-hidden='true'></i>"
				: "<i class='fa-solid fa-star' aria-hidden='true'></i>";
			if (isFavorite) {
				starButton.classList.add('favorited');
			}
			starButton.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
			starButton.onclick = function(e) {
				e.stopPropagation();
				const nowFavorite = toggleFavoriteGameType(gameType.id);
				this.innerHTML = nowFavorite
					? "<i class='fa-solid fa-star' aria-hidden='true'></i>"
					: "<i class='fa-solid fa-star' aria-hidden='true'></i>";
				this.classList.toggle('favorited', nowFavorite);
				this.title = nowFavorite ? 'Remove from favorites' : 'Add to favorites';
			};

			// Append text, star, and rules to content
			contentDiv.appendChild(spanClickableText);
			contentDiv.appendChild(starButton);
			contentDiv.appendChild(anchorRules);

			// Append thumbnail and content to card
			div.appendChild(thumbnail);
			div.appendChild(contentDiv);

			// Make entire card clickable
			div.onclick = async function() {
				await setGameController(gameType.id);
				closeModal();
			};

			return div;
		}
	}
	return newGameElem;
}

export function newGameClicked() {
	const messageElem = document.createElement('div');
	messageElem.className = 'gameDivContainer';

	// Sort game types with favorites first
	const sortedKeys = sortGameTypesWithFavoritesFirst(Object.keys(GameType));

	sortedKeys.forEach((key, index) => {
		const newGameEntryElem = getNewGameEntryForGameType(GameType[key]);
		messageElem.appendChild(newGameEntryElem);
	});

	showModalElem("New Game", messageElem);
}

const getCountOfGamesWhereUserTurnCallback = (count) => {
	setAccountHeaderLinkText(count);
	appCaller.setCountOfGamesWhereUserTurn(count);
};

export function loadNumberOfGamesWhereUserTurn() {
	if (onlinePlayEnabled && userIsLoggedIn()) {
		onlinePlayEngine.getCountOfGamesWhereUserTurn(getUserId(), getCountOfGamesWhereUserTurnCallback);
	}
}

const USER_TURN_GAME_WATCH_INTERVAL = 6000;
export function startWatchingNumberOfGamesWhereUserTurn() {
	loadNumberOfGamesWhereUserTurn();

	if (userTurnCountInterval) {
		clearInterval(userTurnCountInterval);
		userTurnCountInterval = null;
	}

	userTurnCountInterval = setInterval(() => {
		if (!onlinePlayPaused) {
			loadNumberOfGamesWhereUserTurn();
		}
	}, USER_TURN_GAME_WATCH_INTERVAL);
}

const sendChatCallback = (result) => {
	document.getElementById('sendChatMessageButton').textContent = "Send";
	const chatMsg = document.getElementById('chatMessageInput').value;
	document.getElementById('chatMessageInput').value = "";

	if (result && result === 'true') { 	// Did not send
		document.getElementById('chatMessageInput').value = "---Message blocked by filter--- " + chatMsg;
	} else if (result && result === 'revoked') {
		document.getElementById('chatMessageInput').value = "Chat privilege denied, contact mods in Discord for help.";
	}
};

export function sendChat(chatMessageIfDifferentFromInput) {
	let chatMessage = htmlEscape(document.getElementById('chatMessageInput').value).trim();
	if (chatMessageIfDifferentFromInput) {
		chatMessage = chatMessageIfDifferentFromInput;
	}
	chatMessage = chatMessage.replace(/\n/g, ' ');	// Convert newlines to spaces.
	if (chatMessage) {
		const chatCommandsProcessed = processChatCommands(chatMessage);
		if (!chatCommandsProcessed) {
			const sendButton = document.getElementById('sendChatMessageButton');
		sendButton.innerHTML = "";
		const icon = document.createElement("i");
		icon.className = "fa fa-circle-o-notch fa-spin fa-fw";
		sendButton.appendChild(icon);
			if (playingOnlineGame()) {
				onlinePlayEngine.sendChat(gameId, getLoginToken(), chatMessage, sendChatCallback);
			} else {
				getNewChatMessagesCallback('na||| |||' + chatMessage);
				sendChatCallback();
			}
		} else {
			sendChatCallback();
		}
	}

	processChatEasterEggCommands(chatMessage);
}

const processChatCommands = (chatMessage) => {
	if (chatMessage.toLowerCase().includes('/d6 2')) {
		document.getElementById("rollD6LinkAboveChat").classList.remove('gone');
		sendChat((getUsername() !== null ? getUsername() : "Player")
			+ " rolled: " + randomIntFromInterval(1, 6).toString()
			+ " & " + randomIntFromInterval(1, 6).toString());
		return true;
	}

	return false;
};

const processChatEasterEggCommands = async (chatMessage) => {
	/* Secret easter eggs... */
	if (chatMessage.toLowerCase().includes('spoopy')) {
		const { AdevarOptions } = await import('./adevar/AdevarOptions');
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

	if (chatMessage.toLowerCase().includes("april fools")) {	// April Fools!
		Ads.enableAds(true);
	}

	if (chatMessage.toLowerCase().includes("/giveawaydrawing")) {
		showGiveawayDrawingModal();
	}
};

export function promptForAgeToTreeYears() {
	const container = document.createElement('div');
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode('Age: '));
	const ageInput = document.createElement('input');
	ageInput.type = 'text';
	ageInput.id = 'humanAgeInput';
	ageInput.name = 'humanAgeInput';
	container.appendChild(ageInput);

	container.appendChild(document.createElement('br'));
	const convertDiv = document.createElement('div');
	convertDiv.classList.add('clickableText');
	convertDiv.textContent = 'Convert to tree years';
	convertDiv.onclick = () => submitHumanAge();
	container.appendChild(convertDiv);

	container.appendChild(document.createElement('br'));
	const resultDiv = document.createElement('div');
	resultDiv.id = 'treeYearsResult';
	container.appendChild(resultDiv);

	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	const confusedDiv = document.createElement('div');
	confusedDiv.appendChild(document.createTextNode('Confused? '));
	const discordLink = document.createElement('a');
	discordLink.href = 'https://skudpaisho.com/discord';
	discordLink.target = '_blank';
	discordLink.textContent = 'Join the Discord';
	confusedDiv.appendChild(discordLink);
	confusedDiv.appendChild(document.createTextNode('! :))'));
	container.appendChild(confusedDiv);

	showModalElem("How Old Are You in Tree Years?", container);
}

export function submitHumanAge() {
	const age = document.getElementById("humanAgeInput").value;
	if (!isNaN(age)) {
		document.getElementById("treeYearsResult").innerText = humanYearsToTreeYears(parseInt(age, 10));
	}
}

// IN UI SETUP
// document.getElementById('chatMessageInput').onkeypress = function(e) {
// 	var code = (e.keyCode ? e.keyCode : e.which);
// 	if (code == 13) {
// 		sendChat();
// 	}
// };

// sendGlobalChat - moved to GlobalChat module

// In UI SETUP
// document.getElementById('globalChatMessageInput').onkeypress = function(e) {
// 	var code = (e.keyCode ? e.keyCode : e.which);
// 	if (code == 13) {
// 		sendGlobalChat();
// 	}
// };

export function htmlEscape(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function openTab(evt, tabIdName) {
	let i, tabcontent, tablinks;
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

export function showGameNotationModal() {
	const container = document.createElement('div');
	const notationDiv = document.createElement('div');
	notationDiv.classList.add('coordinatesNotation');
	notationDiv.innerHTML = gameController.gameNotation.getNotationForEmail().replace(/\[BR\]/g, '<br />');
	container.appendChild(notationDiv);
	container.appendChild(document.createElement('br'));

	showModalElem("Game Notation", container);
}

export function showGameReplayLink() {
	// if (currentGameData.hostUsername && currentGameData.guestUsername) {
	const notation = gameController.getNewGameNotation();
	for (let i = 0; i < currentMoveIndex; i++) {
		notation.addMove(gameController.gameNotation.moves[i]);
	}
	//   rerunAll();	// Seems like this shouldn't be here.

	let linkUrl = "";

	if (currentGameData && currentGameData.gameTypeId) {
		linkUrl += "gameType=" + currentGameData.gameTypeId + "&";
	}
	linkUrl += "host=" + currentGameData.hostUsername + "&";
	linkUrl += "guest=" + currentGameData.guestUsername + "&";

	linkUrl += "game=" + notation.notationTextForUrl();

	if (ggOptions.length > 0) {
		linkUrl += "&gameOptions=" + JSON.stringify(ggOptions);
	}

	linkUrl = compressToEncodedURIComponent(linkUrl);

	linkUrl = sandboxUrl + "?" + linkUrl;

	debug("GameReplayLinkUrl: " + linkUrl);
	const container = document.createElement('div');
	container.appendChild(document.createTextNode("Here is the "));
	const replayLink = document.createElement('a');
	replayLink.id = 'gameReplayLink';
	replayLink.href = linkUrl;
	replayLink.target = '_blank';
	replayLink.textContent = 'game replay link';
	container.appendChild(replayLink);
	container.appendChild(document.createTextNode(" to the current point in the game."));
	const copyReplayBtn = document.createElement('button');
	copyReplayBtn.id = 'copyGameLinkButton';
	copyReplayBtn.disabled = true;
	copyReplayBtn.classList.add('button', 'gone');
	copyReplayBtn.textContent = 'Copy Link';
	container.appendChild(copyReplayBtn);
	container.appendChild(document.createTextNode(" "));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));

	if (playingOnlineGame()) {
		const spectateUrl = buildSpectateUrl();
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode("Here is the "));
		const spectateLink = document.createElement('a');
		spectateLink.href = spectateUrl;
		spectateLink.target = '_blank';
		spectateLink.textContent = 'spectate link';
		container.appendChild(spectateLink);
		container.appendChild(document.createTextNode(" others can use to watch the game live and participate in the Game Chat. "));
		const copySpectateBtn = document.createElement('button');
		copySpectateBtn.classList.add('button');
		copySpectateBtn.textContent = 'Copy Link';
		copySpectateBtn.onclick = function() { copyTextToClipboard(spectateUrl, this); };
		container.appendChild(copySpectateBtn);
		container.appendChild(document.createTextNode(" "));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
	}
	showModalElem("Game Links", container);

	getShortUrl(linkUrl, (shortUrl) => {
		const linkTag = document.getElementById('gameReplayLink');
		if (linkTag) {
			linkTag.setAttribute("href", shortUrl);
		}
		const copyLinkButton = document.getElementById('copyGameLinkButton');
		if (copyLinkButton) {
			copyLinkButton.disabled = false;
			copyLinkButton.classList.remove('gone');
			copyLinkButton.onclick = function() {
				copyTextToClipboard(shortUrl, copyLinkButton);
			};
		}
	});
}

export function buildSpectateUrl() {
	if (gameId > 0) {
		let linkUrl = compressToEncodedURIComponent("wg=" + gameId);
		linkUrl = sandboxUrl + "?" + linkUrl;
		return linkUrl;
	}
}

export function showPrivacyPolicy() {
	const container = document.createElement('div');
	const ul = document.createElement('ul');

	const li1 = document.createElement('li');
	li1.textContent = "All online games (and associated chat conversations) are recorded and may be available to view by others.";
	ul.appendChild(li1);

	const li2 = document.createElement('li');
	li2.textContent = "Usernames will be shown publicly to other players and anyone viewing game replays.";
	ul.appendChild(li2);

	const li3 = document.createElement('li');
	li3.textContent = "Email addresses will never be purposefully shared with other players.";
	ul.appendChild(li3);

	container.appendChild(ul);
	showModalElem("Privacy Policy", container);
}

export function dismissChatAlert() {
	document.getElementById('chatTab').classList.remove('alertTab');
}

export function goai() {
	if (gameController.getAiList().length > 1) {
		setAiIndex(0);
		setTimeout(function() {
			setAiIndex(1);
		}, 2000);
	}
}

/* Sidenav */
export function openNav() {
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

export function closeNav() {
	// document.getElementById("mySidenav").style.width = "0";
	document.getElementById("mySidenav").classList.remove("sideNavOpen");
}

export function aboutClicked() {
	const container = document.createElement('div');

	const introDiv = document.createElement('div');
	const em1 = document.createElement('em');
	em1.textContent = 'The Garden Gate';
	introDiv.appendChild(em1);
	introDiv.appendChild(document.createTextNode(' is a place to play various fan-made '));
	const em2 = document.createElement('em');
	em2.textContent = 'Pai Sho';
	introDiv.appendChild(em2);
	introDiv.appendChild(document.createTextNode(' games and other games, too. A Pai Sho game is a game played on a board for the fictional game of Pai Sho as seen in Avatar: The Last Airbender. '));
	const learnMoreLink = document.createElement('a');
	learnMoreLink.href = 'https://skudpaisho.com/site/';
	learnMoreLink.target = '_blank';
	learnMoreLink.textContent = 'Learn more';
	introDiv.appendChild(learnMoreLink);
	introDiv.appendChild(document.createTextNode('.'));
	container.appendChild(introDiv);

	container.appendChild(document.createElement('hr'));

	const creditsDiv = document.createElement('div');
	creditsDiv.appendChild(document.createTextNode(' Modern Skud Pai Sho tile designs by Hector Lowe'));
	creditsDiv.appendChild(document.createElement('br'));
	creditsDiv.appendChild(document.createTextNode(' ©2017 | Used with permission'));
	creditsDiv.appendChild(document.createElement('br'));
	creditsDiv.appendChild(document.createTextNode(' '));
	const hectorLink = document.createElement('a');
	hectorLink.href = 'http://hector-lowe.com/';
	hectorLink.target = '_blank';
	hectorLink.textContent = 'www.hector-lowe.com';
	creditsDiv.appendChild(hectorLink);
	creditsDiv.appendChild(document.createTextNode(' '));
	container.appendChild(creditsDiv);

	const licenseDiv = document.createElement('div');
	licenseDiv.classList.add('license');
	const ccLink = document.createElement('a');
	ccLink.rel = 'license';
	ccLink.href = 'http://creativecommons.org/licenses/by-nc/3.0/us/';
	const ccImg = document.createElement('img');
	ccImg.alt = 'Creative Commons License';
	ccImg.style.borderWidth = '0';
	ccImg.src = 'https://i.creativecommons.org/l/by-nc/3.0/us/88x31.png';
	ccLink.appendChild(ccImg);
	licenseDiv.appendChild(ccLink);
	licenseDiv.appendChild(document.createTextNode('\u00A0All other content of this work is licensed under a '));
	const ccLink2 = document.createElement('a');
	ccLink2.rel = 'license';
	ccLink2.href = 'http://creativecommons.org/licenses/by-nc/3.0/us/';
	ccLink2.textContent = 'Creative Commons Attribution-NonCommercial 3.0 United States License';
	licenseDiv.appendChild(ccLink2);
	licenseDiv.appendChild(document.createTextNode('.'));
	container.appendChild(licenseDiv);

	container.appendChild(document.createElement('br'));

	const privacyDiv = document.createElement('div');
	const privacySpan = document.createElement('span');
	privacySpan.classList.add('skipBonus');
	privacySpan.textContent = 'Privacy policy';
	privacySpan.onclick = () => showPrivacyPolicy();
	privacyDiv.appendChild(privacySpan);
	container.appendChild(privacyDiv);

	showModalElem("About", container);
}

export function getOnlineGameOpponentUsername() {
	let opponentUsername = "";
	if (playingOnlineGame()) {
		if (usernameEquals(currentGameData.hostUsername)) {
			opponentUsername = currentGameData.guestUsername;
		} else if (usernameEquals(currentGameData.guestUsername)) {
			opponentUsername = currentGameData.hostUsername;
		}
	}
	return opponentUsername;
}

export async function quitOnlineGameCallback() {
	if (currentGameData) {
		await setGameController(currentGameData.gameTypeId);
	} else {
		await closeGame();
	}
}

export function iAmPlayerInCurrentOnlineGame() {
	return usernameEquals(currentGameData.hostUsername) || usernameEquals(currentGameData.guestUsername);
}

export function quitOnlineGame() {
	// TODO eventually make it so if guest never made a move, then player only "leaves" game instead of updating the game result, so it returns to being an available game seek.
	if (gameController.guestNeverMoved && gameController.guestNeverMoved()) {
		// Guest never moved, only leave game. TODO
	}// else {....}

	if (iAmPlayerInCurrentOnlineGame()) {
		onlinePlayEngine.updateGameWinInfoAsTie(gameId, 8, getLoginToken(), quitOnlineGameCallback);
	}
}

export function quitInactiveOnlineGame() {
	if (iAmPlayerInCurrentOnlineGame()
		&& !getGameWinner()
		&& (currentGameData.hostUsername === currentGameData.guestUsername
			|| (!myTurn() && onlineGameIsOldEnoughToBeQuit()))
	) {
		onlinePlayEngine.updateGameWinInfoAsTie(gameId, 10, getLoginToken(), quitOnlineGameCallback);
	}
}

export function quitOnlineGameClicked() {
	const container = document.createElement('div');

	if (playingOnlineGame() && iAmPlayerInCurrentOnlineGame()
		&& !getGameWinner()
		&& (currentGameData.hostUsername === currentGameData.guestUsername
			|| (!myTurn() && onlineGameIsOldEnoughToBeQuit()))
	) {
		const questionDiv = document.createElement('div');
		questionDiv.textContent = "Are you sure you want to quit and end this inactive game? The game will appear as Inactive in your Completed Games list, but will become active again when your opponent plays.";
		container.appendChild(questionDiv);

		container.appendChild(document.createElement('br'));
		const yesDiv = document.createElement('div');
		yesDiv.classList.add('clickableText');
		yesDiv.textContent = 'Yes - mark current game inactive';
		yesDiv.onclick = () => { closeModal(); quitInactiveOnlineGame(); };
		container.appendChild(yesDiv);

		container.appendChild(document.createElement('br'));
		const noDiv = document.createElement('div');
		noDiv.classList.add('clickableText');
		noDiv.textContent = 'No - cancel';
		noDiv.onclick = () => closeModal();
		container.appendChild(noDiv);
	} else {
		container.appendChild(document.createTextNode("When playing an unfinished inactive online game, this is where you can mark the game inactive to hide it from your My Games list."));
	}

	showModalElem("Quit Current Online Game", container);
}

export function doNotShowMarkInactiveDialogAgain() {
	localStorage.setItem(markGameInactiveWithoutDialogKey, 'true');
}

export function markGameInactiveClicked() {
	// Do they want to have it take immediate action? Or do they want the dialog to show?
	if (playingOnlineGame() && iAmPlayerInCurrentOnlineGame()
		&& !getGameWinner()
		&& (currentGameData.hostUsername === currentGameData.guestUsername
			|| (!myTurn() && onlineGameIsOldEnoughToBeQuit()))
	) {
		if (localStorage.getItem(markGameInactiveWithoutDialogKey) === 'true') {
			quitInactiveOnlineGame();
		} else {
			const container = document.createElement('div');

			const questionDiv = document.createElement('div');
			questionDiv.textContent = "Are you sure you want mark this game inactive? The game will appear as Inactive in your Completed Games list, but will become active again when your opponent plays.";
			container.appendChild(questionDiv);

			container.appendChild(document.createElement('br'));
			const yesDiv = document.createElement('div');
			yesDiv.classList.add('clickableText');
			yesDiv.textContent = 'Yes - mark current game inactive';
			yesDiv.onclick = () => { closeModal(); quitInactiveOnlineGame(); };
			container.appendChild(yesDiv);

			container.appendChild(document.createElement('br'));
			const yesDontShowDiv = document.createElement('div');
			yesDontShowDiv.classList.add('clickableText');
			yesDontShowDiv.textContent = "Yes - mark current game inactive and don't show this again";
			yesDontShowDiv.onclick = () => { closeModal(); doNotShowMarkInactiveDialogAgain(); quitInactiveOnlineGame(); };
			container.appendChild(yesDontShowDiv);

			container.appendChild(document.createElement('br'));
			const noDiv = document.createElement('div');
			noDiv.classList.add('clickableText');
			noDiv.textContent = 'No - cancel';
			noDiv.onclick = () => closeModal();
			container.appendChild(noDiv);

			showModalElem("Mark Current Game Inactive", container);
		}
	} else {
		showModalElem("Mark Current Game Inactive", document.createTextNode("When playing an unfinished inactive online game, this is where you can mark the game inactive to hide it from your My Games list."));
	}
}

export function resignOnlineGame() {
	if (playingOnlineGame()
		&& iAmPlayerInCurrentOnlineGame()
		&& !getGameWinner()
		&& myTurn()
	) {
		const hostResultCode = usernameEquals(currentGameData.hostUsername) ? 0 : 1;
		let newPlayerRatings = {};
		if (currentGameData.isRankedGame && currentGameData.hostUsername !== currentGameData.guestUsername) {
			newPlayerRatings = Elo.getNewPlayerRatings(currentGameData.hostRating, currentGameData.guestRating, hostResultCode);
		}
		onlinePlayEngine.updateGameWinInfo(gameId, getOnlineGameOpponentUsername(), 9, getLoginToken(), quitOnlineGameCallback,
			currentGameData.isRankedGame, newPlayerRatings.hostRating, newPlayerRatings.guestRating, currentGameData.gameTypeId, currentGameData.hostUsername, currentGameData.guestUsername);
	}
}

export function resignOnlineGameClicked() {
	const container = document.createElement('div');

	if (playingOnlineGame()
		&& iAmPlayerInCurrentOnlineGame()
		&& !getGameWinner()
		&& myTurn()
	) {
		const questionDiv = document.createElement('div');
		questionDiv.textContent = "Are you sure you want to resign this game, marking it as your loss?";
		container.appendChild(questionDiv);

		container.appendChild(document.createElement('br'));
		const yesDiv = document.createElement('div');
		yesDiv.classList.add('clickableText');
		yesDiv.textContent = 'Yes - resign current game';
		yesDiv.onclick = () => { closeModal(); resignOnlineGame(); };
		container.appendChild(yesDiv);

		container.appendChild(document.createElement('br'));
		const noDiv = document.createElement('div');
		noDiv.classList.add('clickableText');
		noDiv.textContent = 'No - cancel';
		noDiv.onclick = () => closeModal();
		container.appendChild(noDiv);
	} else {
		container.appendChild(document.createTextNode("When playing an online game, this is where you can resign the game on your turn."));
	}

	showModalElem("Resign Current Online Game", container);
}

export function onlineGameIsOldEnoughToBeQuit() {
	return true;
	/* const currentGameTimestampDate = buildDateFromTimestamp(currentGameData.lastUpdatedTimestamp);
	const nowDate = new Date();
	const difference = nowDate.getTime() - currentGameTimestampDate.getTime();
	const daysDifference = difference / 1000 / 60 / 60 / 24;
	return daysDifference >= 3 || usernameEquals('Zach'); */
}

export function buildDateFromTimestamp(timestampStr) {
	return new Date(timestampStr.replace(" ", "T"));
}

export function showWelcomeScreensClicked() {
	WelcomeTutorial.showWelcomeScreensClicked();
}

export function iOSShake() {
	// If undo move is allowed, ask user if they wanna
	if ((playingOnlineGame() && !myTurn() && !getGameWinner())
		|| (!playingOnlineGame())) {
		const container = document.createElement('div');
		container.appendChild(document.createElement('br'));

		const yesDiv = document.createElement('div');
		yesDiv.classList.add('clickableText');
		yesDiv.textContent = 'Yes, undo move';
		yesDiv.onclick = () => { resetMove(); closeModal(); };
		container.appendChild(yesDiv);

		container.appendChild(document.createElement('br'));

		const cancelDiv = document.createElement('div');
		cancelDiv.classList.add('clickableText');
		cancelDiv.textContent = 'Cancel';
		cancelDiv.onclick = () => closeModal();
		container.appendChild(cancelDiv);

		showModalElem("Undo move?", container);
	}
}

export function saveDeviceTokenIfNeeded() {
	const deviceToken = localStorage.getItem(deviceTokenKey);
	if ((ios || QueryString.appType === 'ios') && deviceToken && userIsLoggedIn()) {
		onlinePlayEngine.addUserPreferenceValue(getLoginToken(), PREF_IOS_DEVICE_TOKEN, deviceToken, emptyCallback);
	}
}

export function setDeviceToken(deviceToken) {
	localStorage.setItem(deviceTokenKey, deviceToken);
	saveDeviceTokenIfNeeded();
}

export function openShop() {
	openLink("https://skudpaisho.com/site/buying-pai-sho/");
}

export function discordLinkClicked() {
	openLink("https://skudpaisho.com/discord");
}

/* Options */
export let ggOptions = [];

export function addOption(option) {
	ggOptions.push(option);
}

export function clearOptions() {
	ggOptions = [];
}

export function addOptionFromInput() {
	addGameOption(document.getElementById('optionAddInput').value);
	closeModal();
}

export function promptAddOption() {
	if (Ads.Options.showAds) {
		Ads.showRandomPopupAd();
	}

	const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	if (usernameIsOneOf(['SkudPaiSho']) || isLocalDev) {
		// Enable debug modes when opening the secrets modal
		setDebugOn(true);
		setGameDevOn(true);

		const container = document.createElement('div');

		// --- Current Game Info Section ---
		const gameInfoHeader = document.createElement('div');
		gameInfoHeader.style.fontWeight = 'bold';
		gameInfoHeader.textContent = 'Current Game Info:';
		container.appendChild(gameInfoHeader);
		container.appendChild(document.createElement('br'));

		const gameIdDiv = document.createElement('div');
		gameIdDiv.textContent = 'Game ID: ' + (gameId > 0 ? gameId : 'N/A (local game)');
		container.appendChild(gameIdDiv);

		const gameTypeDiv = document.createElement('div');
		gameTypeDiv.textContent = 'Game Type: ' + (gameController ? gameController.getGameTypeId() : 'N/A');
		container.appendChild(gameTypeDiv);

		const moveCountDiv = document.createElement('div');
		moveCountDiv.textContent = 'Move Count: ' + (gameController && gameController.gameNotation ? gameController.gameNotation.moves.length : 0);
		container.appendChild(moveCountDiv);

		const onlineStatusDiv = document.createElement('div');
		onlineStatusDiv.textContent = 'Online Game: ' + (playingOnlineGame() ? 'Yes' : 'No');
		container.appendChild(onlineStatusDiv);

		const usernameDiv = document.createElement('div');
		usernameDiv.textContent = 'Username: ' + (getUsername() || 'Not logged in');
		container.appendChild(usernameDiv);

		const hostDiv = document.createElement('div');
		hostDiv.classList.add('clickableText');
		hostDiv.textContent = 'Host: ' + (currentGameData.hostUsername || 'N/A');
		hostDiv.onclick = () => {
			const input = document.getElementById('winnerUsernameInput');
			if (input && currentGameData.hostUsername) {
				input.value = currentGameData.hostUsername;
			}
		};
		container.appendChild(hostDiv);

		const guestDiv = document.createElement('div');
		guestDiv.classList.add('clickableText');
		guestDiv.textContent = 'Guest: ' + (currentGameData.guestUsername || 'N/A');
		guestDiv.onclick = () => {
			const input = document.getElementById('winnerUsernameInput');
			if (input && currentGameData.guestUsername) {
				input.value = currentGameData.guestUsername;
			}
		};
		container.appendChild(guestDiv);

		// --- Game Notation Section (collapsible) ---
		container.appendChild(document.createElement('br'));
		const notationHeader = document.createElement('div');
		notationHeader.style.fontWeight = 'bold';
		notationHeader.classList.add('clickableText');
		notationHeader.textContent = '▶ Game Notation';
		container.appendChild(notationHeader);

		const notationContent = document.createElement('div');
		notationContent.style.display = 'none';
		notationContent.style.marginLeft = '10px';

		const notationPre = document.createElement('pre');
		notationPre.style.whiteSpace = 'pre-wrap';
		notationPre.style.wordBreak = 'break-all';
		notationPre.style.maxHeight = '300px';
		notationPre.style.overflow = 'auto';
		notationPre.style.fontSize = '12px';
		notationPre.style.textAlign = 'left';
		if (gameController && gameController.gameNotation && gameController.gameNotation.moves.length > 0) {
			const lines = gameController.gameNotation.moves.map(function(move) {
				return JSON.stringify(move, function(key, value) {	// TODO should this logic be handled by the game?
					if (key === 'animationInfo') return undefined;
					if (key === 'promptTargetData' && value && Object.keys(value).length === 0) return undefined;
					return value;
				});
			});
			notationPre.textContent = lines.join('\n');
		} else {
			notationPre.textContent = '(no moves)';
		}
		notationContent.appendChild(notationPre);

		notationHeader.onclick = () => {
			const isCollapsed = notationContent.style.display === 'none';
			notationContent.style.display = isCollapsed ? 'block' : 'none';
			notationHeader.textContent = (isCollapsed ? '▼' : '▶') + ' Game Notation';
		};

		container.appendChild(notationContent);

		// --- Separator ---
		container.appendChild(document.createElement('br'));
		const separator1 = document.createElement('hr');
		separator1.style.border = '1px solid #ccc';
		separator1.style.margin = '10px 0';
		container.appendChild(separator1);

		// --- Set Win Info Section (collapsible) ---
		const winInfoHeader = document.createElement('div');
		winInfoHeader.style.fontWeight = 'bold';
		winInfoHeader.classList.add('clickableText');
		winInfoHeader.textContent = '▶ Set Win Info';
		container.appendChild(winInfoHeader);

		const winInfoContent = document.createElement('div');
		winInfoContent.style.display = 'none';
		winInfoContent.style.marginLeft = '10px';

		const winnerLabel = document.createElement('label');
		winnerLabel.textContent = 'Winner Username: ';
		winInfoContent.appendChild(winnerLabel);

		const winnerInput = document.createElement('input');
		winnerInput.type = 'text';
		winnerInput.id = 'winnerUsernameInput';
		winnerInput.placeholder = '(blank for ties)';
		winInfoContent.appendChild(winnerInput);
		winInfoContent.appendChild(document.createElement('br'));

		const resultCodeLabel = document.createElement('label');
		resultCodeLabel.textContent = 'Result Code: ';
		winInfoContent.appendChild(resultCodeLabel);

		const resultCodeSelect = document.createElement('select');
		resultCodeSelect.id = 'resultCodeInput';
		const resultCodeOptions = [
			{ value: 1, text: '1 - Standard Win' },
			{ value: 2, text: '2 - Alt Win (More Accents)' },
			{ value: 3, text: '3 - Alt Win (More Harmonies)' },
			{ value: 4, text: '4 - Tie' },
			{ value: 5, text: '5 - Error' },
			{ value: 8, text: '8 - Player Quit' },
			{ value: 11, text: '11 - Other' }
		];
		resultCodeOptions.forEach(opt => {
			const option = document.createElement('option');
			option.value = opt.value;
			option.textContent = opt.text;
			if (opt.value === 1) option.selected = true;
			resultCodeSelect.appendChild(option);
		});
		winInfoContent.appendChild(resultCodeSelect);
		winInfoContent.appendChild(document.createElement('br'));

		const winInfoStatusDiv = document.createElement('div');
		winInfoStatusDiv.id = 'winInfoStatus';
		winInfoStatusDiv.style.fontStyle = 'italic';
		winInfoContent.appendChild(winInfoStatusDiv);

		const submitWinInfoDiv = document.createElement('div');
		submitWinInfoDiv.classList.add('clickableText');
		submitWinInfoDiv.textContent = 'Submit Win Info';
		submitWinInfoDiv.onclick = () => {
			const winnerUsername = document.getElementById('winnerUsernameInput').value;
			const resultCode = parseInt(document.getElementById('resultCodeInput').value, 10);
			const statusDiv = document.getElementById('winInfoStatus');

			if (gameId <= 0) {
				statusDiv.textContent = 'Error: No online game active';
				return;
			}

			statusDiv.textContent = 'Submitting...';
			onlinePlayEngine.updateGameWinInfo(
				gameId,
				winnerUsername,
				resultCode,
				getLoginToken(),
				(result) => {
					statusDiv.textContent = 'Result: ' + JSON.stringify(result);
				},
				false, // updateRatings
				currentGameData.hostRating,
				currentGameData.guestRating,
				gameController.getGameTypeId(),
				currentGameData.hostUsername,
				currentGameData.guestUsername
			);
		};
		winInfoContent.appendChild(submitWinInfoDiv);

		winInfoHeader.onclick = () => {
			const isCollapsed = winInfoContent.style.display === 'none';
			winInfoContent.style.display = isCollapsed ? 'block' : 'none';
			winInfoHeader.textContent = (isCollapsed ? '▼' : '▶') + ' Set Win Info';
		};

		container.appendChild(winInfoContent);

		// --- Separator ---
		container.appendChild(document.createElement('br'));
		const separatorWin = document.createElement('hr');
		separatorWin.style.border = '1px solid #ccc';
		separatorWin.style.margin = '10px 0';
		container.appendChild(separatorWin);

		// --- Debug Settings Section ---
		const debugHeader = document.createElement('div');
		debugHeader.style.fontWeight = 'bold';
		debugHeader.textContent = 'Debug Settings:';
		container.appendChild(debugHeader);
		container.appendChild(document.createElement('br'));

		const debugToggleDiv = document.createElement('div');
		debugToggleDiv.classList.add('clickableText');
		debugToggleDiv.textContent = 'Debug Mode: ' + (debugOn ? 'ON' : 'OFF') + ' (click to toggle)';
		debugToggleDiv.onclick = () => {
			setDebugOn(!debugOn);
			debugToggleDiv.textContent = 'Debug Mode: ' + (debugOn ? 'ON' : 'OFF') + ' (click to toggle)';
		};
		container.appendChild(debugToggleDiv);

		const gameDevToggleDiv = document.createElement('div');
		gameDevToggleDiv.classList.add('clickableText');
		gameDevToggleDiv.textContent = 'Game Dev Mode: ' + (gameDevOn ? 'ON' : 'OFF') + ' (click to toggle)';
		gameDevToggleDiv.onclick = () => {
			setGameDevOn(!gameDevOn);
			gameDevToggleDiv.textContent = 'Game Dev Mode: ' + (gameDevOn ? 'ON' : 'OFF') + ' (click to toggle)';
		};
		container.appendChild(gameDevToggleDiv);

		// --- Separator ---
		container.appendChild(document.createElement('br'));
		const separator2 = document.createElement('hr');
		separator2.style.border = '1px solid #ccc';
		separator2.style.margin = '10px 0';
		container.appendChild(separator2);

		// --- Game Options Section ---
		const gameOptionsHeader = document.createElement('div');
		gameOptionsHeader.style.fontWeight = 'bold';
		gameOptionsHeader.textContent = 'Game Options:';
		container.appendChild(gameOptionsHeader);

		const optionInput = document.createElement('input');
		optionInput.type = 'text';
		optionInput.id = 'optionAddInput';
		optionInput.name = 'optionAddInput';
		container.appendChild(optionInput);

		container.appendChild(document.createElement('br'));
		const addDiv = document.createElement('div');
		addDiv.classList.add('clickableText');
		addDiv.textContent = 'Add';
		addDiv.onclick = () => addOptionFromInput();
		container.appendChild(addDiv);

		if (ggOptions.length > 0) {
			container.appendChild(document.createElement('br'));
			for (let i = 0; i < ggOptions.length; i++) {
				const optDiv = document.createElement('div');
				optDiv.textContent = ggOptions[i];
				container.appendChild(optDiv);
			}
			container.appendChild(document.createElement('br'));
			const clearDiv = document.createElement('div');
			clearDiv.classList.add('clickableText');
			clearDiv.textContent = 'Clear Options';
			clearDiv.onclick = () => clearOptions();
			container.appendChild(clearDiv);
		}

		// --- Separator ---
		container.appendChild(document.createElement('br'));
		const separator3 = document.createElement('hr');
		separator3.style.border = '1px solid #ccc';
		separator3.style.margin = '10px 0';
		container.appendChild(separator3);

		// --- Ads Section ---
		const adsHeader = document.createElement('div');
		adsHeader.style.fontWeight = 'bold';
		adsHeader.textContent = 'Ads:';
		container.appendChild(adsHeader);
		container.appendChild(document.createElement('br'));

		const enableAdsDiv = document.createElement('div');
		enableAdsDiv.classList.add('clickableText');
		enableAdsDiv.textContent = 'Enable Ads';
		enableAdsDiv.onclick = () => Ads.enableAds(true);
		container.appendChild(enableAdsDiv);

		const adDiv = document.createElement('div');
		adDiv.classList.add('clickableText');
		adDiv.textContent = 'Show Ad';
		adDiv.onclick = () => Ads.showRandomPopupAd();
		container.appendChild(adDiv);

		// --- Separator ---
		container.appendChild(document.createElement('br'));
		const separator4 = document.createElement('hr');
		separator4.style.border = '1px solid #ccc';
		separator4.style.margin = '10px 0';
		container.appendChild(separator4);

		// --- QueryString Section (collapsible) ---
		const queryStringHeader = document.createElement('div');
		queryStringHeader.style.fontWeight = 'bold';
		queryStringHeader.classList.add('clickableText');
		queryStringHeader.textContent = '▶ QueryString';
		container.appendChild(queryStringHeader);

		const queryStringContent = document.createElement('div');
		queryStringContent.style.display = 'none';
		queryStringContent.style.marginLeft = '10px';

		const rawQueryString = window.location.search.substring(1);
		if (rawQueryString) {
			const rawLabel = document.createElement('div');
			rawLabel.style.fontSize = '0.85em';
			rawLabel.style.fontWeight = 'bold';
			rawLabel.textContent = 'Raw (compressed):';
			queryStringContent.appendChild(rawLabel);

			const rawDiv = document.createElement('div');
			rawDiv.style.fontSize = '0.8em';
			rawDiv.style.wordBreak = 'break-all';
			rawDiv.style.marginBottom = '4px';
			rawDiv.style.fontFamily = 'monospace';
			rawDiv.textContent = rawQueryString;
			queryStringContent.appendChild(rawDiv);

			const copyRawBtn = document.createElement('span');
			copyRawBtn.classList.add('clickableText');
			copyRawBtn.style.fontSize = '0.8em';
			copyRawBtn.textContent = 'Copy to Clipboard';
			copyRawBtn.onclick = () => copyTextToClipboard(rawQueryString, copyRawBtn);
			queryStringContent.appendChild(copyRawBtn);
			queryStringContent.appendChild(document.createElement('br'));

			const decompressedLabel = document.createElement('div');
			decompressedLabel.style.fontSize = '0.85em';
			decompressedLabel.style.fontWeight = 'bold';
			decompressedLabel.textContent = 'Decompressed:';
			queryStringContent.appendChild(decompressedLabel);
		}

		if (rawShortLinkInfo) {
			const shortLinkLabel = document.createElement('div');
			shortLinkLabel.style.fontSize = '0.85em';
			shortLinkLabel.style.fontWeight = 'bold';
			shortLinkLabel.style.marginTop = '8px';
			shortLinkLabel.textContent = 'Short Link Info (raw):';
			queryStringContent.appendChild(shortLinkLabel);

			const shortLinkDiv = document.createElement('div');
			shortLinkDiv.style.fontSize = '0.8em';
			shortLinkDiv.style.wordBreak = 'break-all';
			shortLinkDiv.style.marginBottom = '4px';
			shortLinkDiv.style.fontFamily = 'monospace';
			shortLinkDiv.textContent = rawShortLinkInfo;
			queryStringContent.appendChild(shortLinkDiv);

			const copyShortLinkBtn = document.createElement('span');
			copyShortLinkBtn.classList.add('clickableText');
			copyShortLinkBtn.style.fontSize = '0.8em';
			copyShortLinkBtn.textContent = 'Copy to Clipboard';
			copyShortLinkBtn.onclick = () => copyTextToClipboard(rawShortLinkInfo, copyShortLinkBtn);
			queryStringContent.appendChild(copyShortLinkBtn);
			queryStringContent.appendChild(document.createElement('br'));
		}

		const queryStringProps = Object.keys(QueryString).filter(key => QueryString[key] !== undefined && QueryString[key] !== '');
		if (queryStringProps.length > 0) {
			queryStringProps.forEach(key => {
				const propDiv = document.createElement('div');
				propDiv.style.fontSize = '0.9em';
				propDiv.textContent = key + ': ' + QueryString[key];
				queryStringContent.appendChild(propDiv);
			});
		} else {
			const noneDiv = document.createElement('div');
			noneDiv.style.fontStyle = 'italic';
			noneDiv.textContent = '(no query parameters)';
			queryStringContent.appendChild(noneDiv);
		}

		queryStringHeader.onclick = () => {
			const isCollapsed = queryStringContent.style.display === 'none';
			queryStringContent.style.display = isCollapsed ? 'block' : 'none';
			queryStringHeader.textContent = (isCollapsed ? '▼' : '▶') + ' QueryString';
		};

		container.appendChild(queryStringContent);

		showModalElem("Secrets", container);
	} else if (usernameIsOneOf(['SkudPaiSho', 'Adevar'])) {
		showGiveawayDrawingModal();
	}
}

export function showGiveawayDrawingModal() {
	const container = document.createElement('div');
	container.appendChild(document.createTextNode('Enter list of names:'));
	container.appendChild(document.createElement('br'));

	const textarea = document.createElement('textarea');
	textarea.rows = 11;
	textarea.cols = 40;
	textarea.name = 'description';
	textarea.id = 'giveawayNamesTextbox';
	container.appendChild(textarea);

	container.appendChild(document.createElement('br'));
	const chooseDiv = document.createElement('div');
	chooseDiv.classList.add('clickableText');
	chooseDiv.textContent = 'Choose name';
	chooseDiv.onclick = () => Giveaway.doIt();
	container.appendChild(chooseDiv);

	container.appendChild(document.createElement('br'));
	const resultsDiv = document.createElement('div');
	resultsDiv.id = 'giveawayResults';
	resultsDiv.textContent = ':)';
	container.appendChild(resultsDiv);

	showModalElem("Giveaway Winner Chooser!", container);
}

export async function addGameOption(option) {
	addOption(option);
	await setGameController(gameController.getGameTypeId(), true);
}

export function getGameOptionsMessageElement(options) {
	// Create the main container
    const container = document.createElement('span');
    container.style.marginTop = '20px';

    let optionsListed = false;

    if (options && options.length > 0) {
		container.appendChild(document.createElement('br'));
        // Create a strong element for the title
        const strong = document.createElement('strong');
        strong.textContent = 'Add Game Option:';
        container.appendChild(strong);
        container.appendChild(document.createElement('br'));

        for (let i = 0; i < options.length; i++) {
            if (!gameOptionEnabled(options[i])) {
                if (!gameController.optionOkToShow
                    || (gameController.optionOkToShow && gameController.optionOkToShow(options[i]))) {
                    // Create a bullet point
                    const bullet = document.createElement('span');
                    bullet.innerHTML = '&bull;&nbsp;';

                    // Create the clickable span
                    const span = document.createElement('span');
                    span.className = 'skipBonus';
                    span.textContent = getGameOptionDescription(options[i]);
                    span.onclick = ((option) => {
                        return () => {
                            addGameOption(option);
                        };
                    })(options[i]);

                    bullet.appendChild(span);
                    container.appendChild(bullet);
                    container.appendChild(document.createElement('br'));

                    optionsListed = true;
                }
            }
        }
    }

    if (!optionsListed) {
        container.innerHTML = '';
        container.style.marginTop = '20px';
    }

    return container;
}

export function showBadMoveModal() {
	clearGameWatchInterval();
	const container = document.createElement('div');
	container.appendChild(document.createTextNode("A move went wrong somewhere. If you see this each time you look at this game, then this game may be corrupt. "));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode("Please let your opponent know that you saw this message. You may want to quit this game and try again."));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode("Live game updates have been paused."));
	showModalElem("Uh Oh", container);
}


/* Utility function for loading modals */
export function getLoadingModalElement() {
	const span = document.createElement("span");
	span.appendChild(document.createTextNode("Loading\u00A0"));
	const icon = document.createElement("i");
	icon.className = "fa fa-circle-o-notch fa-spin fa-fw";
	span.appendChild(icon);
	span.appendChild(document.createTextNode("\u00A0"));
	return span;
}

/* Tournament functions - Re-exported from TournamentManager module */
export {
	changeTournamentPlayerStatus, changeTournamentStatus, createNewRound, createNewTournamentClicked, createNewTournamentMatch, manageTournamentClicked,
	manageTournamentsClicked, matchGameClicked, playerNameClicked, roundClicked, showPastTournamentsClicked, signUpForTournament, submitCreateTournament, submitTournamentSignup, viewTournamentInfo, viewTournamentsClicked
} from './TournamentManager';

/* Game Rankings - Re-exported from GameRankings module */
export {
	viewGameRankingsClicked
} from './ui/GameRankings';

//   function toggleDarkMode() {
// 	  var currentTheme = localStorage.getItem("data-theme") || "dark";
// 	  localStorage.setItem("data-theme", currentTheme === "dark" ? "light" : "dark");
// 	  applyDataTheme();
//   }

//   function applyDataTheme() {
// 	  var currentTheme = localStorage.getItem("data-theme") || "dark";
// 	  document.body.setAttribute("data-theme", currentTheme);
//   }
export function setWebsiteTheme(theme) {
	const previousTheme = localStorage.getItem("data-theme");

	if (theme === "dark") {
		localStorage.setItem("data-theme", "dark");
		document.body.setAttribute("data-theme", "dark");
		removeExtraCSS();
	} else if (theme === "light") {
		localStorage.setItem("data-theme", "light");
		document.body.setAttribute("data-theme", "light");
		removeExtraCSS();
	} else if (theme === "stotes") {
		localStorage.setItem("data-theme", "stotes");
		setExtraCSS("style/themes/chuji.css");
		// Add Logo
		const heading = document.getElementById("siteHeading");
		const headingHolder = heading.parentElement;
		const logo = document.createElement("img");
		logo.style = "margin-left:10px;";
		logo.src = "style/logo.png";
		logo.id = "logo";
		headingHolder.replaceChild(logo, heading);
		// Remove | Dividers
		const x = document.getElementsByClassName("headerRight");
		for (let i = 0; i < x.length; i++) {
			if (x[i].innerHTML.includes("|")) {
				x[i].classList.add("gone");
			}
			if (x[i].innerText == "") {
				// x[i].innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i> Shop';
				if (mobileAndTabletcheck()) {
					x[i].classList.add("gone");
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
		const yesNoOptions = {};
		yesNoOptions.yesText = "OK - Refresh site now";
		yesNoOptions.yesFunction = function() {
			location.reload();
		};
		yesNoOptions.noText = "Cancel - Revert theme";
		yesNoOptions.noFunction = function() {
			closeModal();
			setWebsiteTheme("stotes");
		};
		showModalElem(
			"Changing Theme",
			document.createTextNode("To apply this theme, you will need to refresh the website."),
			false,
			yesNoOptions);
	}
}
export function removeExtraCSS() {
	const styleLink = document.getElementById("overrideCSS");
	styleLink.href = "";
}
export function setExtraCSS(fileName) {
	const styleLink = document.getElementById("overrideCSS");
	if (styleLink.href != fileName) {
		styleLink.href = fileName + "?v=2";
	}
}

/* Game Controller classes should call these for user's preferences */
export function getUserGamePrefKeyName(preferenceKey) {
	return "GameType" + gameController.getGameTypeId() + preferenceKey;
}
export function getUserGamePreference(preferenceKey) {
	if (gameController && gameController.getGameTypeId) {
		const keyName = getUserGamePrefKeyName(preferenceKey);
		return localStorage.getItem(keyName);
	}
}
export function setUserGamePreference(preferenceKey, value) {
	if (gameController && gameController.getGameTypeId) {
		const keyName = getUserGamePrefKeyName(preferenceKey);
		localStorage.setItem(keyName, value);
	}
}

export function buildPreferenceDropdownDiv(labelText, dropdownId, valuesObject, preferenceKey) {
	return buildDropdownDiv(dropdownId, labelText + ":", valuesObject,
		getUserGamePreference(preferenceKey),
		function() {
			setUserGamePreference(preferenceKey, this.value);
			gameController.callActuate();
			if (gameController.gamePreferenceSet) {
				gameController.gamePreferenceSet(preferenceKey);
			}
		});
}

export function setGameLogText(text) {
	let newText = '';
	if (text) {
		newText = text;
	}
	document.getElementById('gameLogText').innerText = newText;
}






/* Notifications - delegated to Notifications module */
// Re-exported from Notifications module
export {
	notifyMe,
	notifyThisMessage, requestNotificationPermission
} from './Notifications';

// Re-exported from WebPush module
export {
	disableChatNotifications, enableChatNotifications, isChatNotificationsEnabled, isPushSupported,
	isWebPushEnabled,
	subscribeToPush,
	unsubscribeFromPush
} from './WebPush';

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
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 80) {
		/* Ctrl + Alt + P */
		copyDivToClipboard();	// TODO fix name, which games are supported, etc
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode) == 68) {
		/* Ctrl + Alt + D */
		promptAddOption();
	} else if (e.ctrlKey && e.altKey && (e.which || e.keyCode)) {
		if (gameController && gameController.shortcutKey) {
			gameController.shortcutKey(e.which || e.keyCode);
		}
	}
};

/* User Preferences - delegated to UserPreferences module */

// For iOS - keep in main file as it's a global event listener
window.addEventListener('touchstart', function() {
	soundManager.makeNoNoise();
}, false);

// Keep clearGameChats here as it's used internally by PaiShoMain
export function clearGameChats() {
	document.getElementById('chatMessagesDisplay').innerHTML = "";
	lastChatTimestamp = '1970-01-01 00:00:00';
}

// Re-export preference functions from UserPreferences module
export {
	confirmMoveClicked, getBooleanPreference, hideConfirmMoveButton, isAnimationsOn, isMoveConfirmationRequired, isMoveLogDisplayOn, isTimestampsOn, setBackgroundColor,
	setCustomBgColorFromInput, showConfirmMoveButton, showPreferences, toggleAnimationsOn, toggleBooleanPreference, toggleConfirmMovePreference, toggleMoveLogDisplay, toggleSoundOn, toggleTimestamps
} from './UserPreferences';

// Re-export game stats functions from GameStats module
export const show2020GameStats = GameStats.show2020GameStats;
export const showGameStats = GameStats.showGameStats;
export const getHonoraryTitleMessage = GameStats.getHonoraryTitleMessage;

export function getShortUrl(urlToShorten, callback) {
	if (onlinePlayEnabled && userIsLoggedIn()) {
		// Extract just the query string (the compressed params after the ?)
		const queryStart = urlToShorten.indexOf('?');
		const linkedInfo = queryStart >= 0 ? urlToShorten.substring(queryStart + 1) : urlToShorten;

		onlinePlayEngine.createShortLink(linkedInfo, getLoginToken(), (slug) => {
			if (slug && !slug.startsWith("ERROR")) {
				// Return URL with uncompressed sl= param
				callback(url + "?sl=" + slug);
			} else {
				// Fallback to full URL on error
				callback(urlToShorten);
			}
		});
	} else {
		// Not logged in or online play disabled, return full URL
		callback(urlToShorten);
	}
}

export function getTinyUrl(urlToShorten, callback) {
	if (onlinePlayEnabled) {
		$.get("https://tinyurl.com/api-create.php?url=" + urlToShorten, function(shortUrl) {
			if (callback && shortUrl) {
				callback(shortUrl);
			}
		});
	} else {
		callback(urlToShorten);
	}
}

export function redirectToTinyUrl(tinyUrlSlug) {
	window.location.replace("https://tinyurl.com/" + tinyUrlSlug);
}

export function toggleCollapsedContent(headingDiv, contentDiv) {
	if (contentDiv.style.display === "block" || !contentDiv.style.display) {
		contentDiv.style.display = "none";
		headingDiv.children[0].innerText = "+";
		headingDiv.classList.add("collapsed");
	} else {
		contentDiv.style.display = "block";
		headingDiv.classList.remove("collapsed");
	}
}

export function setCustomTileDesignsFromInput() {
	let url = document.getElementById('customTileDesignsUrlInput').value;
	url = url.substring(0, url.lastIndexOf("/") + 1);
	if (gameController && gameController.setCustomTileDesignUrl) {
		gameController.setCustomTileDesignUrl(url);
	}
}

export function promptForCustomTileDesigns(gameType, existingCustomTilesUrl) {
	const container = document.createElement('div');

	const p = document.createElement('p');
	p.textContent = "You can use fan-created tile design sets. See the #custom-tile-designs channel in The Garden Gate Discord. Copy and paste the link to one of the images here:";
	container.appendChild(p);

	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode('URL: '));
	const urlInput = document.createElement('input');
	urlInput.type = 'text';
	urlInput.id = 'customTileDesignsUrlInput';
	urlInput.name = 'customTileDesignsUrlInput';
	if (existingCustomTilesUrl) {
		urlInput.value = existingCustomTilesUrl;
	}
	container.appendChild(urlInput);
	container.appendChild(document.createElement('br'));

	container.appendChild(document.createElement('br'));
	const applyDiv = document.createElement('div');
	applyDiv.classList.add('clickableText');
	applyDiv.textContent = 'Apply Custom Tile Designs for ' + gameType.desc;
	applyDiv.onclick = () => { closeModal(); setCustomTileDesignsFromInput(); };
	container.appendChild(applyDiv);

	showModalElem("Use Custom Tile Designs", container);
}







