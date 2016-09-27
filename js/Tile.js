// Tile

var RED = "Red";
var WHITE = "White";

var tileId = 1;

function Tile(code, ownerCode) {
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

Tile.prototype.setAccentInfo = function() {
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

Tile.prototype.setSpecialFlowerInfo = function() {
	if (this.code === 'L') {
		this.specialFlowerType = WHITE_LOTUS;
	} else if (this.code === 'O') {
		this.specialFlowerType = ORCHID;
	}
};

Tile.prototype.getConsoleDisplay = function() {
	if (!this.drained) {
		return this.ownerCode + "" + this.code;
	} else {
		return "*" + this.code;
	}
};

Tile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

Tile.prototype.formsHarmonyWith = function(otherTile) {
	if (!(this.type === BASIC_FLOWER || this.code === 'L')
		|| !(otherTile.type === BASIC_FLOWER || otherTile.code === 'L')) {
		// debug("One of the tiles must be Basic Flower to form Harmony");
		return false;
	}

	if ((this.code === 'L' && otherTile.type !== BASIC_FLOWER)
		|| (otherTile.code === 'L' && this.type !== BASIC_FLOWER)) {
		return false;
	}

	if (otherTile.ownerName !== this.ownerName || this.drained || otherTile.drained) {
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
};

Tile.prototype.clashesWith = function(otherTile) {
	return (this.type === BASIC_FLOWER && otherTile.type === BASIC_FLOWER 
		&& this.basicColorCode !== otherTile.basicColorCode 
		&& this.basicValue === otherTile.basicValue);
};

// Tile.prototype.canCapture = function(otherTile) {
// 	// either clash or special ability of Orchid
// 	if (this.clashesWith(otherTile)) {
// 		return true;
// 	}

// 	// TODO set up the Orchid ability checks
// 	if (this.specialFlowerType === ORCHID) {
// 		// Can capture if my Lotus
// 	}

// 	return false;
// };

Tile.prototype.getMoveDistance = function() {
	if (this.type === BASIC_FLOWER) {
		return parseInt(this.basicValue);
	} else if (this.code === 'L') {
		return 2;
	} else if (this.code === 'O') {
		return 6;
	}
	return 0;
};

Tile.prototype.drain = function() {
	if (this.type === BASIC_FLOWER) {
		this.drained = true;
	}
};

Tile.prototype.restore = function() {
	this.drained = false;
};



