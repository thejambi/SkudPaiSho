import {
  GameType,
  buildDropdownDiv,
  currentGameData,
  gameController,
  promptForCustomTileDesigns,
  usernameEquals,
} from '../PaiShoMain';

export function GiniOptions() {
	if (!localStorage.getItem(GiniOptions.tileDesignTypeKey)
		|| !GiniOptions.tileDesignTypeValues[localStorage.getItem(GiniOptions.tileDesignTypeKey)]) {
		GiniOptions.setTileDesignsPreference("gaoling", true);
	}

	GiniOptions.viewAsGuest = false || GiniOptions.viewAsGuest;
	if (currentGameData && currentGameData.gameTypeId === GameType.GiniPaiSho.id && usernameEquals(currentGameData.guestUsername)) {
		GiniOptions.viewAsGuest = true;
	}
	if (currentGameData && currentGameData.gameTypeId === GameType.GiniPaiSho.id && usernameEquals(currentGameData.hostUsername)) {
		GiniOptions.viewAsGuest = false;
	}
}

GiniOptions.Preferences = {};

GiniOptions.tileDesignTypeKey = "giniTileDesignTypeKey";

GiniOptions.tileDesignTypeValues = {
	gaoling: "Gaoling",
	taihua: "Taihua",
	gaipan: "Gaipan",
	shujing: "Shu Jing",
	hirokucanyon: "Hiroku Canyon",
	zaofu: "Zaofu",
	agnaqela: "Agna Qel'a",
	westernairtemple: "Western Air Temple",
	patola: "Patola Mountain Range",
	xaibausgrove: "Xai Bau's Grove",
	spiritworld: "Spirit World",
	chuji: "Chu Ji Red",
	custom: "Use Custom Designs"
};

GiniOptions.setTileDesignsPreference = function(tileDesignKey, ignoreActuate) {
	if (tileDesignKey === 'custom') {
		promptForCustomTileDesigns(GameType.GiniPaiSho, GiniOptions.Preferences.customTilesUrl);
	} else {
		localStorage.setItem(GiniOptions.tileDesignTypeKey, tileDesignKey);
		if (gameController && gameController.callActuate && !ignoreActuate) {
			gameController.callActuate();
		}
	}
};

GiniOptions.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("GiniTileDesignDropdown", labelText + ":", GiniOptions.tileDesignTypeValues,
							localStorage.getItem(GiniOptions.tileDesignTypeKey),
							function() {
								GiniOptions.setTileDesignsPreference(this.value);
							});
};

GiniOptions.buildToggleViewAsGuestDiv = function() {
	var div = document.createElement("div");
	var message = "Viewing board as Host";
	var linkText = "View as Guest";
	if (GiniOptions.viewAsGuest) {
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
