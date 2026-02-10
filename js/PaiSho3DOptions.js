// Shared 3D Board Preferences
// Single localStorage keys for all games - 3D is a display preference, not game logic

import { clearMessage, gameController } from './PaiShoMain';

const board3DKey = "paiShoBoard3DEnabled";
const roundBoardKey = "paiShoRoundBoardEnabled";
const helpCollapsedKey = "paiShoHelp3DCollapsed";

// One-time migration from old Skud-specific keys to shared keys
const oldBoard3DKey = "skudBoard3DEnabled";
const oldRoundBoardKey = "skudRoundBoardEnabled";

if (localStorage.getItem(board3DKey) === null && localStorage.getItem(oldBoard3DKey) !== null) {
	localStorage.setItem(board3DKey, localStorage.getItem(oldBoard3DKey));
	localStorage.removeItem(oldBoard3DKey);
}
if (localStorage.getItem(roundBoardKey) === null && localStorage.getItem(oldRoundBoardKey) !== null) {
	localStorage.setItem(roundBoardKey, localStorage.getItem(oldRoundBoardKey));
	localStorage.removeItem(oldRoundBoardKey);
}

export function is3DBoardOn() {
	return localStorage.getItem(board3DKey) === "true";
}

export function toggle3DBoardOn() {
	const newValue = !is3DBoardOn();
	localStorage.setItem(board3DKey, newValue.toString());
	if (gameController && gameController.set3DBoardOn) {
		gameController.set3DBoardOn(newValue);
	}
}

// Returns null for auto-detect (default), "true" for force round, "false" for force square
export function getRoundBoardPreference() {
	return localStorage.getItem(roundBoardKey);
}

// Cycles: auto -> force round -> force square -> auto
export function cycleRoundBoardPreference() {
	const current = localStorage.getItem(roundBoardKey);
	if (current === null) {
		localStorage.setItem(roundBoardKey, "true");
	} else if (current === "true") {
		localStorage.setItem(roundBoardKey, "false");
	} else {
		localStorage.removeItem(roundBoardKey);
	}
	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
}

// --- Help Panel Collapse (3D only) ---

export function isHelpCollapsed() {
	return localStorage.getItem(helpCollapsedKey) === "true";
}

export function setHelpCollapsed(collapsed) {
	localStorage.setItem(helpCollapsedKey, collapsed.toString());
}

// --- Shared UI Toggle Helpers ---

export function buildToggle3DBoardDiv() {
	var div = document.createElement("div");
	var onOrOff = is3DBoardOn() ? "on" : "off";

	var textSpan = document.createElement("span");
	textSpan.textContent = "3D Board (experimental) is " + onOrOff + ": ";
	div.appendChild(textSpan);

	var toggleSpan = document.createElement("span");
	toggleSpan.className = "skipBonus";
	toggleSpan.textContent = "toggle";
	toggleSpan.onclick = function() {
		toggle3DBoardOn();
		clearMessage();
	};
	div.appendChild(toggleSpan);

	return div;
}

export function buildToggleRoundBoardDiv() {
	var div = document.createElement("div");
	var pref = getRoundBoardPreference();
	var stateText;
	if (pref === null) stateText = "auto";
	else if (pref === "true") stateText = "on";
	else stateText = "off";

	var textSpan = document.createElement("span");
	textSpan.textContent = "Round board (3D only): " + stateText + " ";
	div.appendChild(textSpan);

	var toggleSpan = document.createElement("span");
	toggleSpan.className = "skipBonus";
	toggleSpan.textContent = "toggle";
	toggleSpan.onclick = function() {
		cycleRoundBoardPreference();
		clearMessage();
	};
	div.appendChild(toggleSpan);

	return div;
}
