
function AdevarOptions() {
	// Adevar options

	this.addChristmasIfOk();

	if (!localStorage.getItem(AdevarOptions.tileDesignTypeKey)
		|| !AdevarOptions.tileDesignTypeValues[localStorage.getItem(AdevarOptions.tileDesignTypeKey)]) {
		AdevarOptions.setTileDesignsPreference("classic", true);
	}
}

AdevarOptions.tileDesignTypeKey = "adevarTileDesignTypeKey";

/* Adevar tile designs */
AdevarOptions.tileDesignTypeValues = {
	classic: "Adevar Classic",
	monochrome: "Adevar Monochrome",
	// spoopy: "Adevar Spoopy",
	icy: "Adevar Icy",
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

AdevarOptions.commenceSpoopy = function() {
	AdevarOptions.tileDesignTypeValues['spoopy'] = "Adevar Spoopy";
	AdevarOptions.setTileDesignsPreference('spoopy');
};

AdevarOptions.includeChristmas = function() {
	AdevarOptions.tileDesignTypeValues['christmas'] = "Adevar Christmas";
	AdevarOptions.tileDesignTypeValues['chu-ji-holiday'] = "Chuji Holiday";
};

AdevarOptions.prototype.addChristmasIfOk = function() {
	var currentDate = new Date();

	var targetDate = new Date();
	targetDate.setFullYear(2020);
	targetDate.setMonth(11);
	targetDate.setDate(3);

	debug(targetDate.getMonth());
	debug(targetDate.getDate());
	debug(targetDate.getFullYear());

	if (currentDate.getFullYear() >= targetDate.getFullYear()
			&& currentDate.getMonth() >= targetDate.getMonth()
			&& currentDate.getDate() >= targetDate.getDate()) {
		AdevarOptions.includeChristmas();
	}
};
