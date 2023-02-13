
function AdevarOptions() {
	// Adevar options
	if (dateIsBetween("10/01/2023", "11/04/2023")) {
		AdevarOptions.enableSpoopyTiles();
	}

	if (dateIsBetween("12/01/2022", "01/04/2023")) {
		AdevarOptions.enableChristmasTiles();
	}

	if (!localStorage.getItem(AdevarOptions.tileDesignTypeKey)
		|| !AdevarOptions.tileDesignTypeValues[localStorage.getItem(AdevarOptions.tileDesignTypeKey)]) {
		AdevarOptions.setTileDesignsPreference("classic", true);
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
	classic: "Adevar Classic",
	sleek: "Adevar Sleek",
	monochrome: "Adevar Monochrome",
	// spoopy: "Adevar Spoopy",
	icy: "Adevar Icy",
	irl: "Adevar TGG Red Oak & Walnut",
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
	div.innerHTML = message + ": <span class='skipBonus' onclick='gameController.toggleViewAsGuest();'>" + linkText + "</span>";
	return div;
};

AdevarOptions.enableSpoopyTiles = function() {
	AdevarOptions.tileDesignTypeValues['spoopy'] = "Adevar Spoopy";
};

AdevarOptions.enableChristmasTiles = function() {
	AdevarOptions.tileDesignTypeValues['christmas'] = "Adevar Christmas";
};

AdevarOptions.commenceSpoopy = function() {
	AdevarOptions.enableSpoopyTiles();
	AdevarOptions.setTileDesignsPreference('spoopy');
};

AdevarOptions.isSpaceTiles = function() {
	return localStorage.getItem(AdevarOptions.tileDesignTypeKey) === 'space2';
};

