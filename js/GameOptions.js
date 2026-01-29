import { copyArray, copyObject } from './GameData';
import { ggOptions } from './PaiShoMain';

/* Game Options - Scroll down for new game options setup */
export var OPTION_DOUBLE_TILES = "DoubleTiles";
export var OPTION_INSANE_TILES = "InsaneTiles";

export var OPTION_ALL_ACCENT_TILES = "AllAccentTiles";
export var OPTION_DOUBLE_ACCENT_TILES = "DoubleAccentTiles";
export var OPTION_ANCIENT_OASIS_EXPANSION = "AncientOasisExpansion";
export var OPTION_INFORMAL_START = "InformalStart";
export var NO_HARMONY_VISUAL_AIDS = "NoHarmonyAids";

export var OPTION_FULL_TILES = "FullTileSet";

export var CLASSIC_RULES = "ClassicRules";

export var FULL_POINTS_SCORING = "FullPointsScoring";

/* Vagabond */
export var SWAP_BISON_WITH_LEMUR = "SwapBisonWithLemur";
export var V_DOUBLE_MOVE_DISTANCE = "VDoubleMoveDistance";

/* Blooms */
export var FOUR_SIDED_BOARD = "BoardSize4";	// It's funny because the name is all wrong, but I always think of it in those words
export var SHORTER_GAME = "ShorterGame";
export var SIX_SIDED_BOARD = "BoardSize6";
export var EIGHT_SIDED_BOARD = "BoardSize8";

/* Hexentafl */
export var FIVE_SIDED_BOARD = "BoardSize5";
export var OPTION_ATTACKERS_MOVE_FIRST = "HostAttacks";
export var KING_MOVES_LIKE_PAWNS = "KingMovesLikePawns";
export var MORE_ATTACKERS = "MoreAttackers";

/* Street Pai Sho */
export var FORMAL_WIN_CONDITION = "FormalWinCondition";
export var ORIGINAL_BOARD_SETUP = "OriginalBoardSetup";
export var RELEASE_CAPTIVE_TILES = "ReleaseCaptiveTiles";
export var BONUS_MOVEMENT_5 = "BonusMovementWithCaptive";
export var BONUS_MOVEMENT_BASED_ON_NUM_CAPTIVES = "BonusMovementPerCaptive";

/* Overgrowth */
export var LESS_TILES = "LessTiles";

/* Playground */
export var PLAY_IN_SPACES = "PlayInSpaces";
export var VAGABOND_ROTATE = "VagabondBoardRotation";
export var ADEVAR_ROTATE = "AdevarBoardRotation";
export var SPECTATORS_CAN_PLAY = "AllowSpectatorsToPlay";

export var ADEVAR_GUEST_ROTATE = "AdevarBoardGuestRotation";

/* Adevar */
export var ADEVAR_LITE = "LiteGame";
export var ADEVAR_ONE_VANGUARD = "AdevarOneVanguard";

/* Game Option Legacy Map - These were stored as full names in database before current setup, must support */
export var legacyGameOptionsMap = {};
legacyGameOptionsMap[OPTION_DOUBLE_TILES] = "Double Tiles";
legacyGameOptionsMap[OPTION_INSANE_TILES] = "Insane Tiles";
legacyGameOptionsMap[OPTION_ALL_ACCENT_TILES] = "All Accent Tiles";
legacyGameOptionsMap[OPTION_DOUBLE_ACCENT_TILES] = "Double (8) Accent Tiles";
legacyGameOptionsMap[OPTION_ANCIENT_OASIS_EXPANSION] = "Ancient Oasis Expansion";
legacyGameOptionsMap[OPTION_INFORMAL_START] = "Informal Start";
legacyGameOptionsMap[NO_HARMONY_VISUAL_AIDS] = "No Harmony Visual Aids";
legacyGameOptionsMap[OPTION_FULL_TILES] = "Full tile set";
legacyGameOptionsMap[CLASSIC_RULES] = "Classic Rules";
legacyGameOptionsMap[FULL_POINTS_SCORING] = "Full points scoring";
legacyGameOptionsMap[FOUR_SIDED_BOARD] = "Board size: 4 per side";
legacyGameOptionsMap[SHORTER_GAME] = "Shorter game";
legacyGameOptionsMap[SIX_SIDED_BOARD] = "Board size: 6 per side";
legacyGameOptionsMap[EIGHT_SIDED_BOARD] = "Board size: 8 per side";
legacyGameOptionsMap[FIVE_SIDED_BOARD] = "Board size: 5 per side";
legacyGameOptionsMap[OPTION_ATTACKERS_MOVE_FIRST] = "Host plays as attackers";
legacyGameOptionsMap[KING_MOVES_LIKE_PAWNS] = "King moves like pawns";
legacyGameOptionsMap[MORE_ATTACKERS] = "More Attackers!";
legacyGameOptionsMap[FORMAL_WIN_CONDITION] = "Formal win condition";
legacyGameOptionsMap[ORIGINAL_BOARD_SETUP] = "Original Board Setup";
legacyGameOptionsMap[RELEASE_CAPTIVE_TILES] = "Release Captive Tiles";
legacyGameOptionsMap[BONUS_MOVEMENT_5] = "Bonus Movement With Captive (5)";
legacyGameOptionsMap[BONUS_MOVEMENT_BASED_ON_NUM_CAPTIVES] = "Bonus Movement (+1) Per Captive";
legacyGameOptionsMap[LESS_TILES] = "Less Tiles";
legacyGameOptionsMap[PLAY_IN_SPACES] = "Play In Spaces";
legacyGameOptionsMap[VAGABOND_ROTATE] = "Vagabond Board Rotation";
legacyGameOptionsMap[ADEVAR_ROTATE] = "Adevar Board Rotation";
legacyGameOptionsMap[ADEVAR_GUEST_ROTATE] = "Adevar Board Guest Rotation";

legacyGameOptionsMap[ADEVAR_LITE] = "Lite - Beginner Game";
// No legacy mapping needed for ADEVAR_ONE_VANGUARD (new option)

/* New Game Options Setup */

/* Game Option Descriptions - Game Options must have nice names :) */
export var gameOptionDescriptions = copyObject(legacyGameOptionsMap);
gameOptionDescriptions[SPECTATORS_CAN_PLAY] = "Allow Spectators to make moves";
gameOptionDescriptions[SWAP_BISON_WITH_LEMUR] = "Trifle Preview: Lemur instead of Bison";
gameOptionDescriptions[V_DOUBLE_MOVE_DISTANCE] = "Double Movement Distance";

/* Tumbleweed */
export var HEXHEX_11 = "hexhex11";
export var HEXHEX_6 = "hexhex6";
export var NO_REINFORCEMENT = "NoReinforcement";
export var CHOOSE_NEUTRAL_STACK_SPACE = "ChooseNeutralStackSpace";
export var RUMBLEWEED = "Rumbleweed";
export var CRUMBLEWEED = "Crumbleweed";
export var TUMBLE_6 = "Tumble6";
export var TUMBLESTONE = "Tumblestone";
gameOptionDescriptions[HEXHEX_11] = "Board Size: 11 per side";
gameOptionDescriptions[HEXHEX_6] = "Board Size: 6 per side";
gameOptionDescriptions[NO_REINFORCEMENT] = "No Reinforcement";
gameOptionDescriptions[CHOOSE_NEUTRAL_STACK_SPACE] = "Host places neutral stack";
gameOptionDescriptions[RUMBLEWEED] = "\"Rumbleweed\" (beta)";
gameOptionDescriptions[CRUMBLEWEED] = "\"Crumbleweed\" (beta)";
gameOptionDescriptions[TUMBLESTONE] = "\"Tumblestone\"";
gameOptionDescriptions[TUMBLE_6] = "Tumble-6 - First to create a 6 size settlement wins";
export var TUMPLETORE = "Tumpletore";
gameOptionDescriptions[TUMPLETORE] = "\"Tumpletore\" (beta) - Settling based on control, not settlement value";
export var NO_SETUP_PHASE = "NoSetupPhase";
gameOptionDescriptions[NO_SETUP_PHASE] = "No Setup Phase";

/* Meadow */
export var DYNAMIC_GROUP_LIMIT = "DynamicGroupLimit";
gameOptionDescriptions[DYNAMIC_GROUP_LIMIT] = "Group limit based on board size";

/* Fire */
export var HIDE_RESERVE_TILES = "HideReserveTiles";
gameOptionDescriptions[HIDE_RESERVE_TILES] = "Hide reserve tiles";
export var MIDLINE_OPENER = "MidlineOpener";							// 
gameOptionDescriptions[MIDLINE_OPENER] = "Guest midline plant";	// Old game option
export var ETHEREAL_ACCENT_TILES = "EtherealAccentTiles";
gameOptionDescriptions[ETHEREAL_ACCENT_TILES] = "Ethereal accent tiles";
export var ORIGINAL_BENDER_EXPANSION = "OriginalBenderExpansion"
gameOptionDescriptions[ORIGINAL_BENDER_EXPANSION] = "EXPANSION: Original Benders";

/* Skud */
export var DIAGONAL_MOVEMENT = "DiagonalMovement";	// April Fools 2021
gameOptionDescriptions[DIAGONAL_MOVEMENT] = "Diagonal Movement";
export var EVERYTHING_CAPTURE = "EverythingCapture";	// April Fools 2021
gameOptionDescriptions[EVERYTHING_CAPTURE] = "Everything Captures Everything";
export var NO_WHEELS = "NoWheels";
gameOptionDescriptions[NO_WHEELS] = "No Wheels";
export var IGNORE_CLASHING = "IgnoreClashing";
gameOptionDescriptions[IGNORE_CLASHING] = "Ignore Clashing Rule";
export var SPECIAL_FLOWERS_BOUNCE = "SpecialFlowersBounce";
gameOptionDescriptions[SPECIAL_FLOWERS_BOUNCE] = "Special Flower Reincarnation";
export var VARIABLE_ACCENT_TILES = "VariableAccentTiles";
gameOptionDescriptions[VARIABLE_ACCENT_TILES] = "Variable Accent Tiles";
gameOptionDescriptions[ADEVAR_ONE_VANGUARD] = "Vanguard - Only need to capture one";
export var NO_ALT_WIN = "NoAltWin";
gameOptionDescriptions[NO_ALT_WIN] = "No Alt Win Condition";

export var GINSENG_ROTATE = "GinsengBoardRotation";
gameOptionDescriptions[GINSENG_ROTATE] = "Ginseng Board Rotation";
export var GINSENG_GUEST_ROTATE = "GinsengGuestRotation";
gameOptionDescriptions[GINSENG_GUEST_ROTATE] = "Ginseng Guest Rotation";

export var FULL_GRID = "FullGrid";
gameOptionDescriptions[FULL_GRID] = "Full Grid";

export var SQUARE_SPACES = "SquareSpaces";
gameOptionDescriptions[SQUARE_SPACES] = "Square Spaces";

export var BOTTOMLESS_RESERVES = "BottomlessReserves";
gameOptionDescriptions[BOTTOMLESS_RESERVES] = "Bottomless Reserves";

export var UNDERGROWTH_SIMPLE = "UndergrowthSimple";
gameOptionDescriptions[UNDERGROWTH_SIMPLE] = "Simplicity (testing)";

export var HEXHEX_10 = "Hexhex10Board";
gameOptionDescriptions[HEXHEX_10] = "Board size: 10 per side";

/* Ginseng */
export var CAPTURE_ABILITY_TARGET_1 = "CaptureAbilityTarget1";
gameOptionDescriptions[CAPTURE_ABILITY_TARGET_1] = "Lion Turtle and Dragon Capture Limit 1";

export var LION_TURTLE_ABILITY_TARGET_TOUCHING_GARDEN = "LTAbilityTargetTouchingGarden";	// Unused
gameOptionDescriptions[LION_TURTLE_ABILITY_TARGET_TOUCHING_GARDEN] = "Lion Turtle Ability: Captures adjacent Original Benders that are touching a red/white garden";

export var LION_TURTLE_ABILITY_ANYWHERE = "LTAbilityAnywhere";	// Defunct
gameOptionDescriptions[LION_TURTLE_ABILITY_ANYWHERE] = "Lion Turtle Ability: Captures adjacent Original Benders, whether they are touching central garden or not";

export var BADGERMOLE_NOT_PREVENT_TRAP_PUSH = "BadgermoleNotPreventTrapPush";
gameOptionDescriptions[BADGERMOLE_NOT_PREVENT_TRAP_PUSH] = "Badgermole does not prevent trap/push";

export var ORIGINAL_BENDER_ABILITIES_TARGET_TOUCHING_RED_WHITE = "OrigBenderAbilitiesTargetGardenTiles";
gameOptionDescriptions[ORIGINAL_BENDER_ABILITIES_TARGET_TOUCHING_RED_WHITE] = "Original Bender Abilities only affect tiles touching Central Gardens";

export var SWAP_BISON_AND_DRAGON = "SwapBisonDragon";
gameOptionDescriptions[SWAP_BISON_AND_DRAGON] = "Swap Bison and Dragon Position";

export var SWAP_BISON_AND_DRAGON_ABILITIES = "SwapBisonDragonAbilities";
gameOptionDescriptions[SWAP_BISON_AND_DRAGON_ABILITIES] = "Swap Bison and Dragon Abilities";

export var DRAGON_CANCELS_ABILITIES = "DragonCancelsAbilities";
gameOptionDescriptions[DRAGON_CANCELS_ABILITIES] = "Dragon Cancels Abilities";

export var GINSENG_2_POINT_0 = "Ginseng2_0";
gameOptionDescriptions[GINSENG_2_POINT_0] = "Ginseng 2.0";

export var GINSENG_1_POINT_0 = "Ginseng1_0";
gameOptionDescriptions[GINSENG_1_POINT_0] = "Ginseng 1.0";

export var DIAGONAL_BISON_ABILITY_TESTING = "DiaBisonTesting";
gameOptionDescriptions[DIAGONAL_BISON_ABILITY_TESTING] = "Bison gives Diagonal movement (testing)";

export var GINSENG_GINSENG_5 = "GinsengLimit5";
gameOptionDescriptions[GINSENG_GINSENG_5] = "Ginseng protect up to 5 spaces";

export var BISON_GRANTS_FLYING = "BisonGrantsFlying";
gameOptionDescriptions[BISON_GRANTS_FLYING] = "Bison grants flying movement";

/* Key Pai Sho */
export var NO_EFFECT_TILES = "NoEffectTiles";
gameOptionDescriptions[NO_EFFECT_TILES] = "No Effect Tiles";

/* Beyond The Edges of The Maps */
export var EDGES_12x12_GAME = "12x12Game";
gameOptionDescriptions[EDGES_12x12_GAME] = "Smaller game (12x12 board)";

export var EDGES_MOVE_4_2 = "Move4_2";
gameOptionDescriptions[EDGES_MOVE_4_2] = "Less movement (4 and 2)";

export var EDGES_DICE_FOR_MOVEMENT = "EdgesRollForMovement";
gameOptionDescriptions[EDGES_DICE_FOR_MOVEMENT] = "Roll dice for movement";

/* Godai */
export var GODAI_BOARD_ZONES = "GodaiBoardZones";
gameOptionDescriptions[GODAI_BOARD_ZONES] = "Board Zones: Rivers & Mountains";

export var GODAI_EMPTY_TILE = "GodaiEmptyTile";
gameOptionDescriptions[GODAI_EMPTY_TILE] = "Play with Empty tile";

/* -------- */

export function getGameOptionDescription(optionName) {
	if (Object.prototype.hasOwnProperty.call(gameOptionDescriptions, optionName)) {
		return gameOptionDescriptions[optionName];
	} else {
		return optionName;
	}
}

export function gameOptionEnabled(optionName) {
	return ggOptions.includes(optionName) || ggOptions.includes(legacyGameOptionsMap[optionName]);
}

export function getEnabledGameOptions() {
	return copyArray(ggOptions);
}

