
function AdevarOptions() {
    // Adevar options
    if (!localStorage.getItem(AdevarOptions.tileDesignTypeKey)) {
        AdevarOptions.setTileDesignsPreference("spoopy");
    }
}

AdevarOptions.tileDesignTypeKey = "adevarTileDesignTypeKey";

/* Adevar tile designs */
AdevarOptions.tileDesignTypeValues = {
	classic: "Adevar Classic",
	spoopy: "Advevar Spoopy"
};

AdevarOptions.setTileDesignsPreference = function(tileDesignKey) {
	localStorage.setItem(AdevarOptions.tileDesignTypeKey, tileDesignKey);
	if (gameController && gameController.callActuate) {
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
