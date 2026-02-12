import { GameType, currentGameData, gameController } from '../PaiShoMain';
import { buildDropdownDiv, promptForCustomTileDesigns } from '../GamePrefs';
import { usernameEquals } from '../UserData';

export function GinsengOptions() {
	if (!localStorage.getItem(GinsengOptions.tileDesignTypeKey)
		|| !GinsengOptions.tileDesignTypeValues[localStorage.getItem(GinsengOptions.tileDesignTypeKey)]) {
		GinsengOptions.setTileDesignsPreference("gaoling", true);
	}

	GinsengOptions.viewAsGuest = false || GinsengOptions.viewAsGuest;
	if (currentGameData && currentGameData.gameTypeId === GameType.Ginseng.id && usernameEquals(currentGameData.guestUsername)) {
		GinsengOptions.viewAsGuest = true;
	}
	if (currentGameData && currentGameData.gameTypeId === GameType.Ginseng.id && usernameEquals(currentGameData.hostUsername)) {
		GinsengOptions.viewAsGuest = false;
	}
}

GinsengOptions.Preferences = {};

GinsengOptions.tileDesignTypeKey = "ginsengTileDesignTypeKey";

GinsengOptions.tileDesignTypeValues = {
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

GinsengOptions.setTileDesignsPreference = function(tileDesignKey, ignoreActuate) {
	if (tileDesignKey === 'custom') {
		promptForCustomTileDesigns(GameType.Ginseng, GinsengOptions.Preferences.customTilesUrl);
	} else {
		localStorage.setItem(GinsengOptions.tileDesignTypeKey, tileDesignKey);
		if (gameController && gameController.callActuate && !ignoreActuate) {
			gameController.callActuate();
		}
	}
};

GinsengOptions.buildTileDesignDropdownDiv = function(alternateLabelText) {
	var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
	return buildDropdownDiv("GinsengTileDesignDropdown", labelText + ":", GinsengOptions.tileDesignTypeValues,
							localStorage.getItem(GinsengOptions.tileDesignTypeKey),
							function() {
								GinsengOptions.setTileDesignsPreference(this.value);
							});
};

GinsengOptions.buildToggleViewAsGuestDiv = function() {
	var div = document.createElement("div");
	var message = "Viewing board as Host";
	var linkText = "View as Guest";
	if (GinsengOptions.viewAsGuest) {
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


