/* Game Options */
var OPTION_DOUBLE_TILES = "Double Tiles";
var OPTION_INSANE_TILES = "Insane Tiles";

var OPTION_ALL_ACCENT_TILES = "All Accent Tiles";
var OPTION_DOUBLE_ACCENT_TILES = "Double (8) Accent Tiles";
var OPTION_ANCIENT_OASIS_EXPANSION = "Ancient Oasis Expansion";

var OPTION_FULL_TILES = "Full tile set";

var CLASSIC_RULES = "Classic Rules";

var FULL_POINTS_SCORING = "Full points scoring";

function gameOptionEnabled(optionName) {
	if (ggOptions.includes(optionName)) {
		return true;
	}
}
