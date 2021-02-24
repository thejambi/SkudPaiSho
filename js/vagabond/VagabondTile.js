// Tile

var VagabondTileCodes = {
	SkyBison: 'S',
	Badgermole: 'B',
	Wheel: 'W',
	Chrysanthemum: 'C',
	FireLily: 'F',
	Dragon: 'D',
	Lotus: 'L',
	FlyingLemur: 'Y'
}

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
	this.selectedFromPile = false;
}

VagabondTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

VagabondTile.prototype.canMove = function(first_argument) {
	return !(this.code === 'C' || this.code === 'F');
};

VagabondTile.prototype.getMoveDistance = function() {
	if (this.code === 'L' || this.code === 'B') {
		return 1;
	} else if (this.code === 'S') {
		return 6;
	} else if (this.code === VagabondTileCodes.FlyingLemur) {
		return 5;
	}

	return 0;
};

VagabondTile.prototype.isFlowerTile = function() {
	// Must be L, C, F
	return this.code === 'L' || this.code === 'C' || this.code === 'F';
};

VagabondTile.prototype.hasCaptureAbility = function() {
	// Must be D, W, S, or FlyingLemur
	return this.code === 'D' || this.code === 'W' || this.code === 'S'
		|| this.code === VagabondTileCodes.FlyingLemur;
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
	} else if (tileCode === VagabondTileCodes.FlyingLemur) {
		name = "Flying Lemur";
	}

	return name;
};


