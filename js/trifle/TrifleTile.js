// Tile

var TrifleTileCodes = {
	SkyBison: 'S',
	Badgermole: 'B',
	Wheel: 'W',
	Chrysanthemum: 'C',
	FireLily: 'F',
	Dragon: 'D',
	Lotus: 'L',
	MessengerHawk: 'MH' //,
	// AirBanner: 'AB',
	// FlyingLemur: 'FLL',
	// RingTailedLemur: 'RTL'
};

function TrifleTile(code, ownerCode) {
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

TrifleTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

TrifleTile.prototype.canMove = function(first_argument) {
	return !(this.code === 'C' || this.code === 'F');
};

TrifleTile.prototype.getMoveDistance = function() {
	if (this.code === 'L' || this.code === 'B') {
		return 1;
	} else if (this.code === 'S') {
		return 6;
	}

	return 0;
};

TrifleTile.prototype.isFlowerTile = function() {
	// Must be L, C, F
	return this.code === 'L' || this.code === 'C' || this.code === 'F';
};

TrifleTile.prototype.hasCaptureAbility = function() {
	// Must be D, W, S
	return this.code === 'D' || this.code === 'W' || this.code === 'S';
};

TrifleTile.prototype.getName = function() {
	return TrifleTile.getTileName(this.code);
};

TrifleTile.prototype.getCopy = function() {
	return new TrifleTile(this.code, this.ownerCode);
};


TrifleTile.getTileName = function(tileCode) {
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
	} else {
		Object.keys(TrifleTileCodes).forEach(function(key,index) {
			if (TrifleTileCodes[key] === tileCode) {
				name = key;
			}
		});
	}

	return name;
};

TrifleTile.getTeamLimitForTile = function(tileCode) {
	var tileData = TrifleTiles[tileCode];
	if (tileData) {
		if (tileData.teamLimit) {
			return tileData.teamLimit;
		} else if (tileData.isBanner) {
			return 1;
		}
	}
	return 2;
};


