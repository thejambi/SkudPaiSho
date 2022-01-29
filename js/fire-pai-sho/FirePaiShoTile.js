/* Skud Pai Sho Tile */

function FirePaiShoTile(code, ownerCode) {
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
	this.boosted = false;
	this.selectedFromPile = false;

	if (this.code.length === 2 && (this.code.includes('R') || this.code.includes('W'))) {
		this.type = BASIC_FLOWER;
		this.harmonizer = true;
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
	} else if (this.code === 'G' || this.code === 'F' || this.code === 'D' || this.code === 'Y' || this.code === 'T') {
		this.type = ORIGINAL_BENDER;
		this.setOriginalBenderInfo();
	} else {
		debug("Error: Unknown tile type");
	}
}

FirePaiShoTile.prototype.setAccentInfo = function() {
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

FirePaiShoTile.prototype.setSpecialFlowerInfo = function() {
	if (this.code === 'L') {
		this.specialFlowerType = WHITE_LOTUS;
	} else if (this.code === 'O') {
		this.specialFlowerType = ORCHID;
		this.harmonizer = true;
	}
};

FirePaiShoTile.prototype.setOriginalBenderInfo = function() {
	
		//G badgermole
		//F flying bison
		//D dragon
		//Y koi fish (yin and yang)
		//L lion turtle

	if (this.code === 'G') {
		this.originalBenderType = BADGERMOLE;
	} else if (this.code === 'F') {
		this.originalBenderType = FLYING_BISON;
	} else if (this.code === 'D') {
		this.originalBenderType = DRAGON;
	} else if (this.code === 'Y') {
		this.originalBenderType = KOI;
	} else if (this.code === 'T') {
		this.originalBenderType = LION_TURTLE;
	}
};

FirePaiShoTile.prototype.getConsoleDisplay = function() {
	if (!this.boosted) {
		return this.ownerCode + "" + this.code;
	} else {
		return "*" + this.code;
	}
};

FirePaiShoTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

FirePaiShoTile.prototype.formsHarmonyWith = function(otherTile, isBuffedByRock) {
	if (this.type === ACCENT_TILE || otherTile.type === ACCENT_TILE){
		return false;
	}
	
	if (!(this.harmonizer || this.code === 'L')
		|| !(otherTile.harmonizer || otherTile.code === 'L')) {
		return false;
	}

	if ((this.code === 'L' && !otherTile.harmonizer)
		|| (otherTile.code === 'L' && !this.harmonizer)) {
		return false;
	}

	// Check White Lotus (Lotus can belong to either player)
	if ((this.code === 'L' && otherTile.harmonizer) 
		|| (otherTile.code === 'L' && this.harmonizer)) {
		return true;
	}

	// For normal Harmonies, tiles must belong to same player
	if (otherTile.ownerName !== this.ownerName) {
		return false;
	}

	//Is boosted from knotweed or rock
	if (this.boosted || otherTile.boosted || isBuffedByRock) {
		return true;
	}

	// Same color and number difference of 1
	if (this.basicColorCode === otherTile.basicColorCode && Math.abs(this.basicValue - otherTile.basicValue) === 1) {
		return true;
		// if not that, check different color and number difference of 2?
	} else if (this.basicColorCode !== otherTile.basicColorCode && Math.abs(this.basicValue - otherTile.basicValue) === 2) {
		return true;
	}

	if (superHarmonies && this.basicValue !== otherTile.basicValue) {
		return true;
	}
};

FirePaiShoTile.prototype.clashesWith = function(otherTile) {
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

FirePaiShoTile.prototype.getMoveDistance = function() {
	if (this.type === BASIC_FLOWER) {
		return parseInt(this.basicValue);
	} else if (this.code === 'L' || this.type === ORIGINAL_BENDER) {
		return 2;
	} else if (this.code === 'O') {
		return 6;
	}
	return 0;
};

FirePaiShoTile.prototype.boost = function() {
	if (this.harmonizer) {
		this.boosted = true;
	}
};

FirePaiShoTile.prototype.restore = function() {
	this.boosted = false;
};

FirePaiShoTile.prototype.getName = function() {
	return FirePaiShoTile.getTileName(this.code);
};

FirePaiShoTile.prototype.getCopy = function() {
	return new FirePaiShoTile(this.code, this.ownerCode);
};


FirePaiShoTile.getTileName = function(tileCode) {
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
		} else if (tileCode === 'G') {
			name = "Badgermole";
		} else if (tileCode === 'F') {
			name = "Flying Bison";
		} else if (tileCode === 'D') {
			name = "Dragon";
		} else if (tileCode === 'Y') {
			name = "Koi";
		} else if (tileCode === 'T') {
			name = "Lion Turtle";
		}
	}
	return name;
};

FirePaiShoTile.getClashTileCode = function(tileCode) {
	if (tileCode.length === 2) {
		if (tileCode.startsWith("R")) {
			return "W" + tileCode.charAt(1);
		} else if (tileCode.startsWith("W")) {
			return "R" + tileCode.charAt(1);
		}
	}
};