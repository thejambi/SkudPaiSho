/* Game Options */
var OPTION_DOUBLE_TILES = "Double Tiles";
var OPTION_INSANE_TILES = "Insane Tiles";

var OPTION_ALL_ACCENT_TILES = "All Accent Tiles";
var OPTION_DOUBLE_ACCENT_TILES = "Double (8) Accent Tiles";
var OPTION_ANCIENT_OASIS_EXPANSION = "Ancient Oasis Expansion";
var OPTION_INFORMAL_START = "Informal Start";

var OPTION_FULL_TILES = "Full tile set";

var CLASSIC_RULES = "Classic Rules";

var FULL_POINTS_SCORING = "Full points scoring";

/* Blooms */
var FOUR_SIDED_BOARD = "Board size: 4 per side";	// It's funny because the name is all wrong, but I always think of it in those words
var SHORTER_GAME = "Shorter game";
var SIX_SIDED_BOARD = "Board size: 6 per side";
var EIGHT_SIDED_BOARD = "Board size: 8 per side";

/* Hexentafl */
var FIVE_SIDED_BOARD = "Board size: 5 per side";
var OPTION_ATTACKERS_MOVE_FIRST = "Host plays as attackers";
var KING_MOVES_LIKE_PAWNS = "King moves like pawns";
var MORE_ATTACKERS = "More Attackers!";


function gameOptionEnabled(optionName) {
	return ggOptions.includes(optionName);
}
