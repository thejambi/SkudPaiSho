/* Game Options */
var OPTION_DOUBLE_TILES = "Double Tiles";
var OPTION_INSANE_TILES = "Insane Tiles";

var OPTION_ALL_ACCENT_TILES = "All Accent Tiles";
var OPTION_DOUBLE_ACCENT_TILES = "Double (8) Accent Tiles";
var OPTION_ANCIENT_OASIS_EXPANSION = "Ancient Oasis Expansion";
var OPTION_INFORMAL_START = "Informal Start";
var NO_HARMONY_VISUAL_AIDS = "No Harmony Visual Aids";

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

/* Street Pai Sho */
var FORMAL_WIN_CONDITION = "Formal win condition";
var ORIGINAL_BOARD_SETUP = "Original Board Setup";
var RELEASE_CAPTIVE_TILES = "Release Captive Tiles";
var BONUS_MOVEMENT_5 = "Bonus Movement With Captive (5)";
var BONUS_MOVEMENT_BASED_ON_NUM_CAPTIVES = "Bonus Movement (+1) Per Captive";

/* Overgrowth */
var LESS_TILES = "Less Tiles";

/* Playground */
var PLAY_IN_SPACES = "Play In Spaces";
var VAGABOND_ROTATE = "Vagabond Board Rotation";
var ADEVAR_ROTATE = "Adevar Board Rotation";

/* Adevar */
var ADEVAR_LITE = "Lite - Beginner Game";


function gameOptionEnabled(optionName) {
	return ggOptions.includes(optionName);
}
