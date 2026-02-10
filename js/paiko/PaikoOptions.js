import {
  GameType,
  clearMessage,
  currentGameData,
  gameController,
  usernameEquals,
} from '../PaiShoMain';

const paiko3DKey = "paikoBoard3DEnabled";

export function PaikoOptions() {
	PaikoOptions.viewAsGuest = false || PaikoOptions.viewAsGuest;
	if (currentGameData && currentGameData.gameTypeId === GameType.Paiko.id && usernameEquals(currentGameData.guestUsername)) {
		PaikoOptions.viewAsGuest = true;
	}
	if (currentGameData && currentGameData.gameTypeId === GameType.Paiko.id && usernameEquals(currentGameData.hostUsername)) {
		PaikoOptions.viewAsGuest = false;
	}
}

PaikoOptions.is3DOn = function() {
	return localStorage.getItem(paiko3DKey) === "true";
};

PaikoOptions.toggle3DOn = function() {
	var newValue = !PaikoOptions.is3DOn();
	localStorage.setItem(paiko3DKey, newValue.toString());
	if (gameController && gameController.set3DBoardOn) {
		gameController.set3DBoardOn(newValue);
	}
};

PaikoOptions.buildToggle3DBoardDiv = function() {
	var div = document.createElement("div");
	var onOrOff = PaikoOptions.is3DOn() ? "on" : "off";

	var textSpan = document.createElement("span");
	textSpan.textContent = "3D Board (experimental) is " + onOrOff + ": ";
	div.appendChild(textSpan);

	var toggleSpan = document.createElement("span");
	toggleSpan.className = "skipBonus";
	toggleSpan.textContent = "toggle";
	toggleSpan.onclick = function() {
		PaikoOptions.toggle3DOn();
		clearMessage();
	};
	div.appendChild(toggleSpan);

	return div;
};

PaikoOptions.buildToggleViewAsGuestDiv = function() {
	var div = document.createElement("div");
	var message = "Viewing board as Host";
	var linkText = "View as Guest";
	if (PaikoOptions.viewAsGuest) {
		message = "Viewing board as Guest";
		linkText = "View as Host";
	}

	var textSpan = document.createElement("span");
	textSpan.textContent = message + ": ";
	div.appendChild(textSpan);

	var toggleSpan = document.createElement("span");
	toggleSpan.className = "skipBonus";
	toggleSpan.textContent = linkText;
	toggleSpan.onclick = function() { gameController.toggleViewAsGuest(); };
	div.appendChild(toggleSpan);

	return div;
};
