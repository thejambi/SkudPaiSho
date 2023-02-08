
KeyPaiSho.Options = function() {
	if (!localStorage.getItem(KeyPaiSho.Options.tileDesignTypeKey)
		|| !KeyPaiSho.Options.tileDesignTypeValues[localStorage.getItem(KeyPaiSho.Options.tileDesignTypeKey)]) {
		KeyPaiSho.Options.setTileDesignsPreference("keygyatso", true);
	}
}

KeyPaiSho.Options.tileDesignTypeKey = "keyPaiShoTileDesignTypeKey";

KeyPaiSho.Options.tileDesignTypeValues = {
	keygyatso: "Key Pai Sho",
	custom: "Use Custom Designs"
};

KeyPaiSho.Options.setTileDesignsPreference = function(tileDesignKey, ignoreActuate) {
	if (tileDesignKey === 'custom') {
		promptForCustomTileDesigns(GameType.KeyPaiSho, KeyPaiSho.Preferences.customTilesUrl);
	} else {
		localStorage.setItem(KeyPaiSho.Options.tileDesignTypeKey, tileDesignKey);
		if (gameController && gameController.callActuate && !ignoreActuate) {
			gameController.callActuate();
		}
	}
};

KeyPaiSho.Options.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("KeyPaiShoTileDesignDropdown", labelText + ":", KeyPaiSho.Options.tileDesignTypeValues,
							localStorage.getItem(KeyPaiSho.Options.tileDesignTypeKey),
							function() {
								KeyPaiSho.Options.setTileDesignsPreference(this.value);
							});
};


