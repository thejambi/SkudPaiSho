/* Skud Pai Sho Tile */

var RED = "Red";
var WHITE = "White";

var tileId = 1;

function PlaygroundTile(code, ownerCode) {
	this.code = code;
	this.ownerCode = ownerCode;
	if (this.ownerCode === 'G') {
		this.ownerName = GUEST;
	} else if (this.ownerCode === 'H') {
		this.ownerName = HOST;
	} else {
		debug("INCORRECT OWNER CODE");
	}
	this.id = tileId++;
	this.drained = false;
	this.selectedFromPile = false;

	if (this.code.length === 2 && (this.code.includes('R') || this.code.includes('W'))) {
		this.type = BASIC_FLOWER;
		this.basicColorCode = this.code.charAt(0);
		this.basicValue = this.code.charAt(1);
		if (this.basicColorCode === 'R') {
			this.basicColorName = RED;
		} else if (this.basicColorCode === 'W') {
			this.basicColorName = WHITE;
		}
	} else if (this.code === 'L' || this.code === 'O') {
		this.type = SPECIAL_FLOWER;
		this.setSpecialFlowerInfo();
	} else if (this.code === 'R' || this.code === 'W' || this.code === 'K' || this.code === 'B') {
		this.type = ACCENT_TILE;
		this.setAccentInfo();
	} else {
		debug("Error: Unknown tile type");
	}
}

PlaygroundTile.prototype.setAccentInfo = function() {
	if (this.code === 'R') {
		this.accentType = ROCK;
	} else if (this.code === 'W') {
		this.accentType = WHEEL;
	} else if (this.code === 'K') {
		this.accentType = KNOTWEED;
	} else if (this.code === 'B') {
		this.accentType = BOAT;
	}
};

PlaygroundTile.prototype.setSpecialFlowerInfo = function() {
	if (this.code === 'L') {
		this.specialFlowerType = WHITE_LOTUS;
	} else if (this.code === 'O') {
		this.specialFlowerType = ORCHID;
	}
};

PlaygroundTile.prototype.getConsoleDisplay = function() {
	if (!this.drained) {
		return this.ownerCode + "" + this.code;
	} else {
		return "*" + this.code;
	}
};

PlaygroundTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

PlaygroundTile.prototype.formsHarmonyWith = function(otherTile) {
	if (!(this.type === BASIC_FLOWER || this.code === 'L')
		|| !(otherTile.type === BASIC_FLOWER || otherTile.code === 'L')) {
		// debug("One of the tiles must be Basic Flower to form Harmony");
		return false;
	}

	if ((this.code === 'L' && otherTile.type !== BASIC_FLOWER)
		|| (otherTile.code === 'L' && this.type !== BASIC_FLOWER)) {
		return false;
	}

	if (this.drained || otherTile.drained) {
		// debug("Drained tiles cannot form Harmony.");
		return false;
	}

	// Check White Lotus (Lotus can belong to either player)
	if ((this.code === 'L' && otherTile.type === BASIC_FLOWER) 
		|| (otherTile.code === 'L' && this.type == BASIC_FLOWER)) {
		return true;
	}

	// For normal Harmonies, tiles must belong to same player
	if (otherTile.ownerName !== this.ownerName) {
		// debug("Tiles drained or have different owners - NO Harmony");
		return false;
	}

	// Same color and number difference of 1
	if (this.basicColorCode === otherTile.basicColorCode && Math.abs(this.basicValue - otherTile.basicValue) === 1) {
		return true;
		// if not that, check different color and number difference of 2?
	} else if (this.basicColorCode !== otherTile.basicColorCode && Math.abs(this.basicValue - otherTile.basicValue) === 2) {
		return true;
	}

	if (this.type !== otherTile.type) {
		// If tiles are different types, then one must be a lotus and the other not
		return true;
	}

	if (superHarmonies && this.basicValue !== otherTile.basicValue) {
		return true;
	}
};

PlaygroundTile.prototype.clashesWith = function(otherTile) {
	if (newOrchidClashRule) {
		if (this.ownerName !== otherTile.ownerName) {
			if (this.specialFlowerType === ORCHID || otherTile.specialFlowerType === ORCHID) {
				return true;
			}
		}
	}

	return (this.type === BASIC_FLOWER && otherTile.type === BASIC_FLOWER 
		&& this.basicColorCode !== otherTile.basicColorCode 
		&& this.basicValue === otherTile.basicValue);
};

PlaygroundTile.prototype.getMoveDistance = function() {
	if (this.type === BASIC_FLOWER) {
		return parseInt(this.basicValue);
	} else if (this.code === 'L') {
		return 2;
	} else if (this.code === 'O') {
		return 6;
	}
	return 0;
};

PlaygroundTile.prototype.drain = function() {
	if (this.type === BASIC_FLOWER) {
		this.drained = true;
	}
};

PlaygroundTile.prototype.restore = function() {
	this.drained = false;
};

PlaygroundTile.prototype.getName = function() {
	return PlaygroundTile.getTileName(this.code);
};

PlaygroundTile.prototype.getCopy = function() {
	return new PlaygroundTile(this.code, this.ownerCode);
};


PlaygroundTile.getTileName = function(tileCode) {
	var name = "";
	
	if (tileCode.length > 1) {
		var colorCode = tileCode.charAt(0);
		var tileNum = tileCode.charAt(1);

		if (colorCode === 'R') {
			if (tileNum === '3') {
				name = "Rose";
			} else if (tileNum === '4') {
				name = "Chrysanthemum";
			} else if (tileNum === '5') {
				name = "Rhododendron";
			}
			name += " (Red " + tileNum + ")";
		} else if (colorCode === 'W') {
			if (tileNum === '3') {
				name = "Jasmine";
			} else if (tileNum === '4') {
				name = "Lily";
			} else if (tileNum === '5') {
				name = "White Jade";
			}
			name += " (White " + tileNum + ")";
		}
	} else {
		if (tileCode === 'R') {
			name = "Rock";
		} else if (tileCode === 'W') {
			name = "Wheel";
		} else if (tileCode === 'K') {
			name = "Knotweed";
		} else if (tileCode === 'B') {
			name = "Boat";
		} else if (tileCode === 'O') {
			name = "Orchid";
		} else if (tileCode === 'L') {
			name = "White Lotus";
		}
	}

	return name;
};

PlaygroundTile.getClashTileCode = function(tileCode) {
	if (tileCode.length === 2) {
		if (tileCode.startsWith("R")) {
			return "W" + tileCode.charAt(1);
		} else if (tileCode.startsWith("W")) {
			return "R" + tileCode.charAt(1);
		}
	}
};

// Tile.getTileHeading = function(tileCode) {
// 	var heading = Tile.getTileName(tileCode);

// 	if (tileCode.length ===  1) {
// 		return heading;
// 	}

// 	// For Basic Flower Tile, add simple name (like "Red 3")

// 	heading += " (";
// 	if ()
// };






















