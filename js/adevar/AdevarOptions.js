import { GameType, currentGameData, gameController } from '../PaiShoMain';
import { buildDropdownDiv } from '../GamePrefs';
import { usernameEquals } from '../UserData';
import { dateIsBetween } from "../GameData";

export function AdevarOptions() {
	// Adevar options
	if (dateIsBetween("10/01/2023", "11/04/2023")) {
		AdevarOptions.enableSpoopyTiles();
	}

	if (dateIsBetween("12/01/2022", "01/04/2023")) {
		AdevarOptions.enableChristmasTiles();
	}

	/* Set default tile designs */
	if (!localStorage.getItem(AdevarOptions.tileDesignTypeKey)
		|| !AdevarOptions.tileDesignTypeValues[localStorage.getItem(AdevarOptions.tileDesignTypeKey)]) {
		AdevarOptions.setTileDesignsPreference("gaoling", true);
	}

	AdevarOptions.viewAsGuest = false || AdevarOptions.viewAsGuest;
	if (currentGameData && currentGameData.gameTypeId === GameType.Adevar.id && usernameEquals(currentGameData.guestUsername)) {
		AdevarOptions.viewAsGuest = true;
	}
	if (currentGameData && currentGameData.gameTypeId === GameType.Adevar.id && usernameEquals(currentGameData.hostUsername)) {
		AdevarOptions.viewAsGuest = false;
	}
}

AdevarOptions.tileDesignTypeKey = "adevarTileDesignTypeKey";

/* Adevar tile designs */
AdevarOptions.tileDesignTypeValues = {
	gaoling: "Gaoling",
	frumos: "Frumos",
	classic: "Classic",
	sleek: "Sleek",
	monochrome: "Monochrome",
	// spoopy: "Spoopy",
	icy: "Icy",
	irl: "TGG Red Oak & Walnut",
	chuji: "Chuji by Sirstotes",
	space2: "Adevar In Space! by Sirstotes",
	asta: "Asta by Sirstotes"
};

AdevarOptions.setTileDesignsPreference = function(tileDesignKey, ignoreActuate) {
	localStorage.setItem(AdevarOptions.tileDesignTypeKey, tileDesignKey);
	if (gameController && gameController.callActuate && !ignoreActuate) {
		gameController.callActuate();
	}
};

AdevarOptions.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("AdevarPaiShoTileDesignDropdown", labelText + ":", AdevarOptions.tileDesignTypeValues,
							localStorage.getItem(AdevarOptions.tileDesignTypeKey),
							function() {
								AdevarOptions.setTileDesignsPreference(this.value);
							});
};

AdevarOptions.buildToggleViewAsGuestDiv = function() {
	var div = document.createElement("div");
	var message = "Viewing board as Host";
	var linkText = "View as Guest";
	if (AdevarOptions.viewAsGuest) {
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

AdevarOptions.enableSpoopyTiles = function() {
	AdevarOptions.tileDesignTypeValues['spoopy'] = "Spoopy";
};

AdevarOptions.enableChristmasTiles = function() {
	AdevarOptions.tileDesignTypeValues['christmas'] = "Christmas";
};

AdevarOptions.commenceSpoopy = function() {
	AdevarOptions.enableSpoopyTiles();
	AdevarOptions.setTileDesignsPreference('spoopy');
};

AdevarOptions.isSpaceTiles = function() {
	return localStorage.getItem(AdevarOptions.tileDesignTypeKey) === 'space2';
};

