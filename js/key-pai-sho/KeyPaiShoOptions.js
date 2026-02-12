import { GameType, gameController } from '../PaiShoMain';
import { buildDropdownDiv, promptForCustomTileDesigns } from '../GamePrefs';

export function KeyPaiShoOptions() {
	if (!localStorage.getItem(KeyPaiShoOptions.tileDesignTypeKey)
		|| !KeyPaiShoOptions.tileDesignTypeValues[localStorage.getItem(KeyPaiShoOptions.tileDesignTypeKey)]) {
		KeyPaiShoOptions.setTileDesignsPreference("keygyatso", true);
	}
}

KeyPaiShoOptions.tileDesignTypeKey = "keyPaiShoTileDesignTypeKey";

KeyPaiShoOptions.tileDesignTypeValues = {
	keygyatso: "Key Pai Sho",
	custom: "Use Custom Designs"
};

KeyPaiShoOptions.setTileDesignsPreference = function(tileDesignKey, ignoreActuate) {
	if (tileDesignKey === 'custom') {
		// Not yet supported
		//promptForCustomTileDesigns(GameType.KeyPaiSho, KeyPaiShoPreferences.customTilesUrl);
	} else {
		localStorage.setItem(KeyPaiShoOptions.tileDesignTypeKey, tileDesignKey);
		if (gameController && gameController.callActuate && !ignoreActuate) {
			gameController.callActuate();
		}
	}
};

KeyPaiShoOptions.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("KeyPaiShoTileDesignDropdown", labelText + ":", KeyPaiShoOptions.tileDesignTypeValues,
							localStorage.getItem(KeyPaiShoOptions.tileDesignTypeKey),
							function() {
								KeyPaiShoOptions.setTileDesignsPreference(this.value);
							});
};


