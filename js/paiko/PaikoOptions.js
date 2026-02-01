import {
  GameType,
  currentGameData,
  gameController,
  usernameEquals,
} from '../PaiShoMain';

export function PaikoOptions() {
	PaikoOptions.viewAsGuest = false || PaikoOptions.viewAsGuest;
	if (currentGameData && currentGameData.gameTypeId === GameType.Paiko.id && usernameEquals(currentGameData.guestUsername)) {
		PaikoOptions.viewAsGuest = true;
	}
	if (currentGameData && currentGameData.gameTypeId === GameType.Paiko.id && usernameEquals(currentGameData.hostUsername)) {
		PaikoOptions.viewAsGuest = false;
	}
}

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
