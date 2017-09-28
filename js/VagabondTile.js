// Tile

var tileId = 1;

function VagabondTile(code, ownerCode) {
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
	// this.drained = false;
	this.selectedFromPile = false;

	// if (this.code.length === 2 && (this.code.includes('R') || this.code.includes('W'))) {
	// 	this.type = BASIC_FLOWER;
	// 	this.basicColorCode = this.code.charAt(0);
	// 	this.basicValue = this.code.charAt(1);
	// 	if (this.basicColorCode === 'R') {
	// 		this.basicColorName = RED;
	// 	} else if (this.basicColorCode === 'W') {
	// 		this.basicColorName = WHITE;
	// 	}
	// } else if (this.code === 'L' || this.code === 'O') {
	// 	this.type = SPECIAL_FLOWER;
	// 	this.setSpecialFlowerInfo();
	// } else if (this.code === 'R' || this.code === 'W' || this.code === 'K' || this.code === 'B') {
	// 	this.type = ACCENT_TILE;
	// 	this.setAccentInfo();
	// } else {
	// 	debug("Error: Unknown tile type");
	// }
}

VagabondTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

VagabondTile.prototype.canMove = function(first_argument) {
	return !(this.code === 'C' || this.code === 'F');
};

VagabondTile.prototype.getMoveDistance = function() {
	// if (this.type === BASIC_FLOWER) {
	// 	return parseInt(this.basicValue);
	// } else if (this.code === 'L') {
	// 	return 2;
	// } else if (this.code === 'O') {
	// 	return 6;
	// }

	if (this.code === 'L' || this.code === 'B') {
		return 1;
	} else if (this.code === 'S') {
		return 6;
	}

	return 0;
};

VagabondTile.prototype.isFlowerTile = function() {
	// Must be L, C, F
	return this.code === 'L' || this.code === 'C' || this.code === 'F';
};

VagabondTile.prototype.hasCaptureAbility = function() {
	// Must be D, W, S
	return this.code === 'D' || this.code === 'W' || this.code === 'S';
};

VagabondTile.prototype.getName = function() {
	return VagabondTile.getTileName(this.code);
};

VagabondTile.prototype.getCopy = function() {
	return new VagabondTile(this.code, this.ownerCode);
};


VagabondTile.getTileName = function(tileCode) {
	var name = "";
	
	if (tileCode === 'L') {
		name = "White Lotus";
	} else if (tileCode === 'S') {
		name = "Sky Bison";
	} else if (tileCode === 'B') {
		name = "Badgermole";
	} else if (tileCode === 'W') {
		name = "Wheel";
	} else if (tileCode === 'C') {
		name = "Chrysanthemum";
	} else if (tileCode === 'F') {
		name = "Fire Lily";
	} else if (tileCode === 'D') {
		name = "White Dragon";
	}

	return name;
};


