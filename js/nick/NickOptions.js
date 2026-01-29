import { buildDropdownDiv, clearMessage, currentGameData, gameController, GameType, promptForCustomTileDesigns, usernameEquals } from "../PaiShoMain";

export class NickOptions {
	constructor() {
		if (!localStorage.getItem(NickOptions.tileDesignTypeKey)
			|| !NickOptions.tileDesignTypeValues[localStorage.getItem(NickOptions.tileDesignTypeKey)]) {
			NickOptions.setTileDesignsPreference("fournationsgaoling", true);
		}

		NickOptions.viewAsGuest = false || NickOptions.viewAsGuest;
		if (currentGameData && currentGameData.gameTypeId === GameType.Nick.id && usernameEquals(currentGameData.guestUsername)) {
			NickOptions.viewAsGuest = true;
		}
		if (currentGameData && currentGameData.gameTypeId === GameType.Nick.id && usernameEquals(currentGameData.hostUsername)) {
			NickOptions.viewAsGuest = false;
		}
	}
}

NickOptions.tileDesignTypeKey = "nickTileDesignTypeKey";

NickOptions.tileDesignTypeValues = {
	fournationsgaoling: "Four Nations Gāolíng",
	siyuangaoling: "Sì Yuán Gāolíng",
	fournations: "Four Nations",
	siyuan: "Sì Yuán",
	custom: "Custom"
};

NickOptions.setTileDesignsPreference = function(tileDesignKey, ignoreActuate) {
	if (tileDesignKey === 'custom') {
		promptForCustomTileDesigns(GameType.Nick, NickOptions.Preferences.customTilesUrl);
	} else {
		localStorage.setItem(NickOptions.tileDesignTypeKey, tileDesignKey);
		if (gameController && gameController.callActuate && !ignoreActuate) {
			gameController.callActuate();
		}
		// Add this line to refresh the help message and update the image
		if (typeof refreshMessage === "function") {
			clearMessage();
		}
	}
};

NickOptions.buildTileDesignDropdownDiv = function(alternateLabelText) {
	const labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("NickTileDesignDropdown", labelText + ":", NickOptions.tileDesignTypeValues,
		localStorage.getItem(NickOptions.tileDesignTypeKey),
		function() {
			NickOptions.setTileDesignsPreference(this.value);
		});
};

NickOptions.buildToggleViewAsGuestDiv = function() {
	const div = document.createElement("div");
	let message = "Viewing board as Host";
	let linkText = "View as Guest";
	if (NickOptions.viewAsGuest) {
		message = "Viewing board as Guest";
		linkText = "View as Host";
	}
	div.innerHTML = message + ": <span class='skipBonus' onclick='gameController.toggleViewAsGuest();'>" + linkText + "</span>";
	return div;
};

export default NickOptions;
