import {
	ADEVAR_LITE,
	ADEVAR_ONE_VANGUARD,
	ADEVAR_ROTATE,
	BISON_GRANTS_FLYING,
	BONUS_MOVEMENT_5,
	BONUS_MOVEMENT_BASED_ON_NUM_CAPTIVES,
	BOTTOMLESS_RESERVES,
	CHOOSE_NEUTRAL_STACK_SPACE,
	CRUMBLEWEED,
	DIAGONAL_BISON_ABILITY_TESTING,
	DIAGONAL_MOVEMENT,
	DYNAMIC_GROUP_LIMIT,
	EDGES_12x12_GAME,
	EDGES_DICE_FOR_MOVEMENT,
	EDGES_MOVE_4_2,
	EIGHT_SIDED_BOARD,
	ETHEREAL_ACCENT_TILES,
	EVERYTHING_CAPTURE,
	FIVE_SIDED_BOARD,
	FORMAL_WIN_CONDITION,
	FOUR_SIDED_BOARD,
	FULL_GRID,
	FULL_POINTS_SCORING,
	GINSENG_1_POINT_0,
	GINSENG_GINSENG_5,
	GINSENG_ROTATE,
	GODAI_BOARD_ZONES,
	GODAI_EMPTY_TILE,
	HEXHEX_10,
	HEXHEX_11,
	HEXHEX_6,
	HIDE_RESERVE_TILES,
	IGNORE_CLASHING,
	KING_MOVES_LIKE_PAWNS,
	LESS_TILES,
	LION_TURTLE_ABILITY_ANYWHERE,
	MIDLINE_OPENER,
	MORE_ATTACKERS,
	NO_ALT_WIN,
	NO_EFFECT_TILES,
	NO_HARMONY_VISUAL_AIDS,
	NO_REINFORCEMENT,
	NO_SETUP_PHASE,
	NO_WHEELS,
	OPTION_ANCIENT_OASIS_EXPANSION,
	OPTION_ATTACKERS_MOVE_FIRST,
	OPTION_DOUBLE_ACCENT_TILES,
	OPTION_DOUBLE_TILES,
	OPTION_FULL_TILES,
	OPTION_INFORMAL_START,
	OPTION_INSANE_TILES,
	ORIGINAL_BENDER_EXPANSION,
	ORIGINAL_BOARD_SETUP,
	PLAY_IN_SPACES,
	RELEASE_CAPTIVE_TILES,
	RUMBLEWEED,
	SHORTER_GAME,
	SIX_SIDED_BOARD,
	SPECIAL_FLOWERS_BOUNCE,
	SPECTATORS_CAN_PLAY,
	SQUARE_SPACES,
	SWAP_BISON_AND_DRAGON,
	SWAP_BISON_AND_DRAGON_ABILITIES,
	SWAP_BISON_WITH_LEMUR,
	TUMBLE_6,
	TUMPLETORE,
	UNDERGROWTH_SIMPLE,
	V_DOUBLE_MOVE_DISTANCE,
	VAGABOND_ROTATE,
	VARIABLE_ACCENT_TILES,
} from './GameOptions';

export const GameType = {
	SkudPaiSho: {
		id: 1,
		name: "Skud Pai Sho",
		desc: "Skud Pai Sho",
		description: "Arrange flowers into position while changing the landscape of the board to outpace your opponent.",
		coverImg: "skud.png",
		color: "var(--skudcolor)",
		rulesUrl: "https://skudpaisho.com/site/games/skud-pai-sho/",
		gameOptions: [
			OPTION_INFORMAL_START,
			OPTION_DOUBLE_ACCENT_TILES,
			OPTION_ANCIENT_OASIS_EXPANSION,
			NO_HARMONY_VISUAL_AIDS,
			NO_WHEELS,
			SPECIAL_FLOWERS_BOUNCE,
			NO_ALT_WIN
		],
		secretGameOptions: [
			DIAGONAL_MOVEMENT,
			EVERYTHING_CAPTURE,
			IGNORE_CLASHING,
			VARIABLE_ACCENT_TILES	// In development
		]
	},
	VagabondPaiSho: {
		id: 2,
		name: "Vagabond Pai Sho",
		desc: "Vagabond Pai Sho",
		color: "var(--vagabondcolor)",
		description: "Construct a battlefield by deploying tiles across the board, then attack your opponent's Lotus tile.",
		coverImg: "vagabond.png",
		rulesUrl: "https://skudpaisho.com/site/games/vagabond-pai-sho/",
		gameOptions: [
			OPTION_DOUBLE_TILES,
			SWAP_BISON_WITH_LEMUR
		],
		secretGameOptions: [
			V_DOUBLE_MOVE_DISTANCE
		]
	},
	Adevar: {
		id: 12,
		name: "Adevăr Pai Sho",
		desc: "Adevăr Pai Sho",
		color: "var(--adevarcolor)",
		description: "See through your opponent's deception and skillfully craft your own disguise to further your hidden objective.",
		coverImg: "adevar.png",
		rulesUrl: "https://skudpaisho.com/site/games/adevar-pai-sho/",
		gameOptions: [
			ADEVAR_LITE,
			ADEVAR_ONE_VANGUARD
		],
		noRankedGames: true
	},
	Ginseng: {
		id: 18,
		name: "Ginseng Pai Sho",
		desc: "Ginseng Pai Sho",
		color: "var(--ginsengcolor)",
		description: "Advance your Lotus into enemy territory with the power of the original benders and protective harmonies.",
		coverImg: "ginseng.png",
		rulesUrl: "https://skudpaisho.com/site/games/ginseng-pai-sho/",
		gameOptions: [
			GINSENG_GINSENG_5,
			BISON_GRANTS_FLYING
		],
		secretGameOptions: [
			LION_TURTLE_ABILITY_ANYWHERE,
			SWAP_BISON_AND_DRAGON,
			SWAP_BISON_AND_DRAGON_ABILITIES,
			GINSENG_1_POINT_0,
			DIAGONAL_BISON_ABILITY_TESTING
		]
	},
	FirePaiSho: {
		id: 15,
		name: "Fire Pai Sho",
		desc: "Fire Pai Sho",
		color: "var(--firecolor)",
		description: "Like Skud Pai Sho, but with a twist: tiles are chosen randomly.",
		coverImg: "rose.png",
		rulesUrl: "https://skudpaisho.com/site/games/fire-pai-sho/",
		gameOptions: [
			NO_HARMONY_VISUAL_AIDS,
			OPTION_DOUBLE_ACCENT_TILES,
			HIDE_RESERVE_TILES,
			ETHEREAL_ACCENT_TILES
		],
		secretGameOptions: [
			ORIGINAL_BENDER_EXPANSION,
			MIDLINE_OPENER
		]
	},
	KeyPaiSho: {
		id: 19,
		name: "Key Pai Sho",
		desc: "Key Pai Sho",
		color: "var(--keypaishocolor)",
		description: "Built to replicate the Pai Sho board states seen in ATLA Book 1.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/key-pai-sho/",
		gameOptions: [
			NO_EFFECT_TILES
		]
	},
	Nick: {
		id: 21,
		name: "Nick Pai Sho",
		desc: "Nick Pai Sho",
		color: "var(--nickcolor)",
		description: "Advance your lotus to the center of the board and protect it using the four elements and the Avatar.",
		coverImg: "nick.png",
		rulesUrl: "https://skudpaisho.com/site/games/nick-pai-sho/",
		gameOptions: [],
		noRankedGames: true
	},
	SolitairePaiSho: {
		id: 4,
		name: "Nature's Grove: Respite",
		desc: "Respite - Solitaire Pai Sho",
		// color: "var(--solitairecolor)",
		color: "var(--othercolor)",
		description: "Arrange random flowers into position to achieve the highest score possible.",
		coverImg: "rose.png",
		rulesUrl: "https://skudpaisho.com/site/games/solitaire-pai-sho/",
		gameOptions: [
			OPTION_DOUBLE_TILES,
			OPTION_INSANE_TILES
		],
		noRankedGames: true
	},
	CoopSolitaire: {
		id: 6,
		// desc: "Nature's Grove: Synergy",
		desc: "Synergy - Co-op Pai Sho",
		color: "var(--coopsolitairecolor)",
		description: "Arrange random flowers into position with a partner to achieve the highest score possible.",
		coverImg: "rose.png",
		rulesUrl: "https://skudpaisho.com/site/games/cooperative-solitaire-pai-sho/",
		gameOptions: [
			LESS_TILES,
			OPTION_DOUBLE_TILES,
			OPTION_INSANE_TILES
		],
		noRankedGames: true
	},
	OvergrowthPaiSho: {
		id: 8,
		name: "Overgrowth Pai Sho",
		desc: "Overgrowth Pai Sho",
		color: "var(--overgrowthcolor)",
		description: "Arrange random flowers into position to get a higher score than your opponent.",
		coverImg: "rose.png",
		rulesUrl: "https://skudpaisho.com/site/games/overgrowth-pai-sho/",
		gameOptions: [
			LESS_TILES,
			OPTION_FULL_TILES,
			FULL_POINTS_SCORING
		],
		noRankedGames: true
	},
	Undergrowth: {
		id: 16,
		name: "Undergrowth Pai Sho",
		desc: "Undergrowth Pai Sho",
		color: "var(--undergrowthcolor)",
		description: "Arrange random flowers into position to get a higher score than your opponent.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/undergrowth-pai-sho/",
		noRankedGames: true,
		gameOptions: [
			UNDERGROWTH_SIMPLE
		]
	},
	Trifle: {
		id: 10,
		name: "Pai and Sho's Trifle",
		desc: "Pai and Sho's Trifle",
		color: "var(--triflecolor)",
		description: "Like Vagabond Pai Sho, but with new collectable tiles.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/pai-shos-trifle/",
		gameOptions: [],
		usersWithAccess: [
			'SkudPaiSho',
			'abacadaren',
			'Korron',
			'vescucci',
			'geebung02',
			'sirstotes',
			'Cannoli',
			'SpinxKreuz',
			'TheRealMomo',
			'MrsSkud',
			'markdwagner',
			'The_IceL0rd'
		],
		noRankedGames: true
	},
	CapturePaiSho: {
		id: 3,
		name: "Capture Pai Sho",
		desc: "Capture Pai Sho",
		color: "var(--capturecolor)",
		description: "A capture battle between opponents.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/capture-pai-sho/",
		gameOptions: []
	},
	SpiritPaiSho: {
		id: 17,
		name: "Spirit Pai Sho",
		desc: "Spirit Pai Sho (Beta)",
		color: "var(--spiritcolor)",
		description: "A new ruleset based on Capture Pai Sho.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/",
		gameOptions: []
	},
	StreetPaiSho: {
		id: 5,
		name: "Street Pai Sho",
		desc: "Street Pai Sho",
		color: "var(--streetcolor)",
		description: "Based on the Pai Sho scene from The Legend of Korra.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/street-pai-sho/",
		gameOptions: [
			FORMAL_WIN_CONDITION,
			ORIGINAL_BOARD_SETUP,
			RELEASE_CAPTIVE_TILES,
			BONUS_MOVEMENT_5,
			BONUS_MOVEMENT_BASED_ON_NUM_CAPTIVES
		],
		noRankedGames: true
	},
	Playground: {
		id: 7,
		name: "Pai Sho Playground",
		desc: "Pai Sho Playground",
		color: "var(--playgroundcolor)",
		description: "Move tiles freely and play around in this sandbox mode.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/pai-sho-playground/",
		gameOptions: [
			PLAY_IN_SPACES,
			VAGABOND_ROTATE,
			ADEVAR_ROTATE,
			GINSENG_ROTATE,
			SPECTATORS_CAN_PLAY,
			FULL_GRID,
			SQUARE_SPACES,
			BOTTOMLESS_RESERVES
		],
		noRankedGames: true
	},
	Paiko: {
		id: 25,
		name: "Paiko",
		desc: "Paiko",
		color: "var(--paikocolor)",
		description: "A tactical tile game where you deploy and shift tiles to reach 10 points by controlling territory.",
		coverImg: "lotus.png",
		rulesUrl: "https://skudpaisho.com/site/games/paiko/",
		gameOptions: [],
		usersWithAccess: [
			'SkudPaiSho',
		]
	},
	BeyondTheMaps: {
		id: 20,
		name: "Beyond The Edges of The Maps",
		desc: "Beyond The Edges of The Maps",
		color: "var(--edgescolor)",
		description: "Explore the land beyond the maps.",
		coverImg: "boat.png",
		rulesUrl: "https://skudpaisho.com/site/games/beyond-the-edges-of-the-maps/",
		gameOptions: [
			EDGES_12x12_GAME,
			EDGES_MOVE_4_2,
			EDGES_DICE_FOR_MOVEMENT
		]
	},
	Blooms: {
		id: 9,
		name: "Blooms",
		desc: "Blooms",
		color: "var(--bloomscolor)",
		description: "A territory battle on a hexagonal board.",
		coverImg: "hexagon.png",
		// // rulesUrl: "https://www.nickbentley.games/blooms-rules/",
		rulesUrl: "https://boardgamegeek.com/boardgame/249095/blooms",
		gameOptions: [
			SHORTER_GAME,
			FOUR_SIDED_BOARD,
			SIX_SIDED_BOARD,
			EIGHT_SIDED_BOARD,
			HEXHEX_10
		]
	},
	Meadow: {
		id: 14,
		name: "Medo",
		desc: "Medo",
		color: "var(--meadowcolor)",
		description: "A territory battle on a hexagonal board.",
		coverImg: "hexagon.png",
		// rulesUrl: "https://www.nickbentley.games/medo-rules-and-tips/",
		rulesUrl: "https://boardgamegeek.com/boardgame/353305/medo",
		gameOptions: [
			SHORTER_GAME,
			FOUR_SIDED_BOARD,
			SIX_SIDED_BOARD,
			EIGHT_SIDED_BOARD,
			DYNAMIC_GROUP_LIMIT
		]
	},
	Hexentafl: {
		id: 11,
		name: "heXentafl",
		desc: "heXentafl",
		color: "var(--hexcolor)",
		description: "An asymmetrical strategy game where one player must defend their king while the opponent attacks.",
		coverImg: "hexagon.png",
		rulesUrl: "https://nxsgame.wordpress.com/2019/09/26/hexentafl/",
		gameOptions: [
			OPTION_ATTACKERS_MOVE_FIRST,
			FIVE_SIDED_BOARD,
			KING_MOVES_LIKE_PAWNS
		],
		secretGameOptions: [
			MORE_ATTACKERS
		]
	},
	Tumbleweed: {
		id: 13,
		name: "Tumbleweed",
		desc: "Tumbleweed",
		color: "var(--tumbleweedcolor)",
		description: "A hexagonal territory war where players stack tiles based on line-of-sight.",
		coverImg: "hexagon.png",
		rulesUrl: "https://www.youtube.com/watch?v=mjA_g3nwYW4",
		gameOptions: [
			HEXHEX_11,
			HEXHEX_6,
			CHOOSE_NEUTRAL_STACK_SPACE,
			NO_REINFORCEMENT,
			TUMBLE_6,
			RUMBLEWEED,
			TUMPLETORE,
			NO_SETUP_PHASE
		],
		secretGameOptions: [
			CRUMBLEWEED
		]
	},
	GodaiPaiSho: {
		id: 42069, // Funny random number hehe
		name: "Godai Pai Sho",
		desc: "Godai Pai Sho",
		color: "var(--othercolor)",
		description: "Capture your opponents elemental tiles while protecting your own",
		coverImg: "lotus.png",
		rulesUrl: "https://tinyurl.com/65frxu6h",
		gameOptions: [
			GODAI_BOARD_ZONES,
			GODAI_EMPTY_TILE,
		],
		usersWithAccess: [
			'SkudPaiSho',
		]
	},
	Yamma: {
		id: 22,
		name: "Yamma",
		desc: "Yamma",
		color: "var(--othercolor)",
		description: "A 3D four-in-a-row game with cubes viewed from three perspectives.",
		coverImg: "hexagon.png",
		rulesUrl: "https://boardgamegeek.com/boardgame/388435/yamma",
		gameOptions: []
	},
	TicTacToe: {
		id: 23,
		name: "Tic Tac Toe",
		desc: "Tic Tac Toe",
		color: "var(--othercolor)",
		description: "The classic game of Xs and Os. Get three in a row to win!",
		coverImg: "hexagon.png",
		rulesUrl: "https://en.wikipedia.org/wiki/Tic-tac-toe",
		gameOptions: [],
		usersWithAccess: [
			'SkudPaiSho',
		]
	},
	Hex: {
		id: 24,
		name: "Hex",
		desc: "Hex",
		color: "var(--othercolor)",
		description: "A classic abstract strategy game. Connect your two opposite edges of the board to win!",
		coverImg: "hexagon.png",
		rulesUrl: "https://en.wikipedia.org/wiki/Hex_(board_game)",
		gameOptions: [],
		usersWithAccess: [
			'SkudPaiSho',
		]
	}
};

export function getGameTypeEntryFromId(id) {
	let gameTypeEntry = null;
	Object.keys(GameType).forEach((key, index) => {
		if (GameType[key].id === id) {
			gameTypeEntry = GameType[key];
			return GameType[key];
		}
	});
	return gameTypeEntry;
}

export function gameTypeIdSupported(id) {
	let gameTypeIdFound = false;
	Object.keys(GameType).forEach((key, index) => {
		if (GameType[key].id === id) {
			gameTypeIdFound = true;
			return true;
		}
	});
	return gameTypeIdFound;
}
