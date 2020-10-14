
function AdevarOptions() {
	// Adevar options
	if (!localStorage.getItem(AdevarOptions.tileDesignTypeKey)
		|| !AdevarOptions.tileDesignTypeValues[localStorage.getItem(AdevarOptions.tileDesignTypeKey)]) {
		// AdevarOptions.setTileDesignsPreference("classic", true);
		AdevarOptions.setTileDesignsPreference("spoopy", true);
	}
}

AdevarOptions.tileDesignTypeKey = "adevarTileDesignTypeKey";

/* Adevar tile designs */
AdevarOptions.tileDesignTypeValues = {
	classic: "Adevar Classic",
	monochrome: "Adevar Monochrome",
	spoopy: "Adevar Spoopy"
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
