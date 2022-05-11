/* Key Pai Sho Tile */

KeyPaiSho.TileCodes = {
	Lotus: 'LO',
	Orchid: 'OR'
};

KeyPaiSho.Tile = function(code, ownerCode) {
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

	if (this.code === KeyPaiSho.TileCodes.Lotus || this.code === KeyPaiSho.TileCodes.Orchid) {
		this.type = SPECIAL_FLOWER;
		this.setSpecialFlowerInfo();
	} else if (this.code.length === 2 && (this.code.includes('R') || this.code.includes('W'))) {
		this.type = BASIC_FLOWER;
		this.basicColorCode = this.code.charAt(0);
		this.basicValue = this.code.charAt(1);
		if (this.basicColorCode === 'R') {
			this.basicColorName = RED;
		} else if (this.basicColorCode === 'W') {
			this.basicColorName = WHITE;
		}
	} else if (this.code === 'R' || this.code === 'W' || this.code === 'K' || this.code === 'B'
				|| this.code === 'P' || this.code === 'M' || this.code === 'T') {
		this.type = ACCENT_TILE;
		this.setAccentInfo();
	} else {
		debug("Error: Unknown tile type");
	}
}

KeyPaiSho.Tile.prototype.setAccentInfo = function() {
	if (this.code === 'R') {
		this.accentType = ROCK;
	} else if (this.code === 'W') {
		this.accentType = WHEEL;
	} else if (this.code === 'K') {
		this.accentType = KNOTWEED;
	} else if (this.code === 'B') {
		this.accentType = BOAT;
	} else if (this.code === 'P') {
		this.accentType = POND;
	} else if (this.code === 'M') {
		this.accentType = BAMBOO;
	} else if (this.code === 'T') {
		this.accentType = LION_TURTLE;
	}
};

KeyPaiSho.Tile.prototype.setSpecialFlowerInfo = function() {
	if (this.code === KeyPaiSho.TileCodes.Lotus) {
		this.specialFlowerType = WHITE_LOTUS;
	} else if (this.code === KeyPaiSho.TileCodes.Orchid) {
		this.specialFlowerType = ORCHID;
	}
};

KeyPaiSho.Tile.prototype.getConsoleDisplay = function() {
	if (!this.drained) {
		return this.ownerCode + "" + this.code;
	} else {
		return "*" + this.code;
	}
};

KeyPaiSho.Tile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

KeyPaiSho.Tile.prototype.formsHarmonyWith = function(otherTile, surroundsLionTurtle) {
	if (this.type !== BASIC_FLOWER && this.code !== KeyPaiSho.TileCodes.Lotus) {
		return false;
	}
	
	if (this.type === BASIC_FLOWER && otherTile.type === BASIC_FLOWER && this.code === otherTile.code) {
		return false;
	}

	if (otherTile.ownerName !== this.ownerName 
		&& !(otherTile.code === KeyPaiSho.TileCodes.Lotus || this.code === KeyPaiSho.TileCodes.Lotus)) {
		return false;
	}
	return true;
};

KeyPaiSho.Tile.prototype.clashesWith = function(otherTile) {
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

KeyPaiSho.Tile.prototype.getMoveDistance = function() {
	if (this.type === BASIC_FLOWER) {
		var tileValue = parseInt(this.basicValue);
		if (tileValue === 4) {
			tileValue++;
		}
		return tileValue;
	} else if (this.code === KeyPaiSho.TileCodes.Lotus) {
		return 2;
	} else if (this.code === KeyPaiSho.TileCodes.Orchid) {
		return 1;
	}
	return 0;
};

KeyPaiSho.Tile.prototype.getHarmonyDistance = function() {
	if (this.type === BASIC_FLOWER) {
		return this.getMoveDistance();
	} else if (this.code === KeyPaiSho.TileCodes.Lotus) {
		return 20;
	}
};

KeyPaiSho.Tile.prototype.hasOrthogonalMovement = function() {
	if (this.type === BASIC_FLOWER) {
		var tileValue = parseInt(this.basicValue);
		return tileValue === 3 || tileValue === 4;
	} else {
		return this.code === KeyPaiSho.TileCodes.Lotus;
	}
};

KeyPaiSho.Tile.prototype.hasDiagonalMovement = function() {
	if (this.type === BASIC_FLOWER) {
		var tileValue = parseInt(this.basicValue);
		return tileValue === 3 || tileValue === 5;
	} else {
		return this.code === KeyPaiSho.TileCodes.Lotus;
	}
};

KeyPaiSho.Tile.prototype.getMovementDirectionWording = function() {
	var directionWording = "";
	if (this.hasOrthogonalMovement()) {
		directionWording += "Horizontally/Vertically";
	}
	if (this.hasDiagonalMovement()) {
		if (directionWording.length > 1) {
			directionWording += " and ";
		}
		directionWording += "Diagonally";
	}
	return directionWording;
};

KeyPaiSho.Tile.prototype.movementMustPreserveDirection = function() {
	if (this.code === KeyPaiSho.TileCodes.Lotus) {
		return false;
	} else {
		return true;
	}
};

KeyPaiSho.Tile.prototype.drain = function() {
	if (this.type === BASIC_FLOWER) {
		this.drained = true;
	}
};

KeyPaiSho.Tile.prototype.restore = function() {
	this.drained = false;
};

KeyPaiSho.Tile.prototype.getName = function() {
	return KeyPaiSho.Tile.getTileName(this.code);
};

KeyPaiSho.Tile.prototype.getCopy = function() {
	return new KeyPaiSho.Tile(this.code, this.ownerCode);
};


KeyPaiSho.Tile.getTileName = function(tileCode) {
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
		} else if (colorCode === 'W') {
			if (tileNum === '3') {
				name = "Lily";
			} else if (tileNum === '4') {
				name = "Jasmine";
			} else if (tileNum === '5') {
				name = "White Jade";
			}
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
		} else if (tileCode === KeyPaiSho.TileCodes.Orchid) {
			name = "Orchid";
		} else if (tileCode === KeyPaiSho.TileCodes.Lotus) {
			name = "White Lotus";
		} else if (tileCode === 'P') {
			name = "Pond";
		} else if (tileCode === 'M') {
			name = "Bamboo";
		} else if (tileCode === 'T') {
			name = "Lion Turtle";
		}
	}

	return name;
};

KeyPaiSho.Tile.getClashTileCode = function(tileCode) {
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






















