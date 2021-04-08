
function AdevarOptions() {
	// Adevar options
	if (!localStorage.getItem(AdevarOptions.tileDesignTypeKey)
		|| !AdevarOptions.tileDesignTypeValues[localStorage.getItem(AdevarOptions.tileDesignTypeKey)]) {
		AdevarOptions.setTileDesignsPreference("classic", true);
	}

	AdevarOptions.viewAsGuest = false;
	if (currentGameData && currentGameData.gameTypeId === GameType.Adevar.id && usernameEquals(currentGameData.guestUsername)) {
		AdevarOptions.viewAsGuest = true;
	}
}

AdevarOptions.tileDesignTypeKey = "adevarTileDesignTypeKey";

/* Adevar tile designs */
AdevarOptions.tileDesignTypeValues = {
	classic: "Adevar Classic",
	monochrome: "Adevar Monochrome",
	// spoopy: "Adevar Spoopy",
	icy: "Adevar Icy",
	irl: "Adevar TGG Red Oak & Walnut",
	chuji: "Chuji"
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

AdevarOptions.commenceSpoopy = function() {
	AdevarOptions.tileDesignTypeValues['spoopy'] = "Adevar Spoopy";
	AdevarOptions.setTileDesignsPreference('spoopy');
};
