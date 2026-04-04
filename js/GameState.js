// Shared mutable game state + derived getters.
// Dependencies: UserData, LocalStorage, SuperSandbox, CommonNotationObjects.

import { HOST, GUEST } from './CommonNotationObjects';
import { LocalStorage } from './LocalStorage';
import { isSuperSandboxMode } from './SuperSandbox';
import { localEmailKey, usernameEquals } from './UserData';

const localStorage = new LocalStorage().storage;

/* ── Mutable State ────────────────────────────────────── */

export let gameController;
export function setGameControllerRef(gc) { gameController = gc; }

export const gameContainerDiv = document.getElementById("game-container");

export let soundManager;
export function setSoundManager(sm) { soundManager = sm; }

export let gameId = -1;
export function setGameId(id) { gameId = id; }

export let currentMoveIndex = 0;
export function setCurrentMoveIndex(idx) { currentMoveIndex = idx; }

export let isInReplay = false;
export function setIsInReplay(value) { isInReplay = value; }

export let currentGameData = {};
export function setCurrentGameData(data) { currentGameData = data; }

export let onlinePlayEnabled = false;
export function setOnlinePlayEnabled(val) { onlinePlayEnabled = val; }

export let activeAi;
export let activeAi2;
export function setActiveAi(ai) { activeAi = ai; }
export function setActiveAi2(ai2) { activeAi2 = ai2; }
export function clearAiPlayers() { activeAi = null; activeAi2 = null; }

export let lastKnownGameNotation = null;
export function setLastKnownGameNotation(val) { lastKnownGameNotation = val; }

export let gameWatchIntervalValue;
export function setGameWatchIntervalValue(val) { gameWatchIntervalValue = val; }

export function clearGameWatchInterval() {
	if (gameWatchIntervalValue) {
		clearInterval(gameWatchIntervalValue);
		gameWatchIntervalValue = null;
	}
}

export let ggOptions = [];
export function addOption(option) { ggOptions.push(option); }
export function removeOption(option) { ggOptions = ggOptions.filter(o => o !== option); }
export function clearOptions() { ggOptions = []; }

/* State used by myTurn / myTurnForReal */
export let hostEmail;
export let guestEmail;
export function setHostEmail(val) { hostEmail = val; }
export function setGuestEmail(val) { guestEmail = val; }

/* ── Derived Getters ──────────────────────────────────── */

export function getCurrentPlayer() {
	return gameController.getCurrentPlayer();
}

export function playingOnlineGame() {
	return onlinePlayEnabled && gameId > 0;
}

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

export function getCurrentPlayerForReal() {
	return gameController.getCurrentPlayer();
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

export function setGameLogText(text) {
	let newText = '';
	if (text) {
		newText = text;
	}
	document.getElementById('gameLogText').innerText = newText;
}

export function getGameWinner() {
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
	if (currentGameData && currentGameData.resultId === 9) {
		return " wins ᕕ( ᐛ )ᕗ! Opponent has resigned.";
	} else {
		return gameController.theGame.getWinReason();
	}
}

export function iAmPlayerInCurrentOnlineGame() {
	return usernameEquals(currentGameData.hostUsername) || usernameEquals(currentGameData.guestUsername);
}

export const emptyCallback = (results) => {
	// Nothing to do
};
