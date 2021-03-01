// Tile

Trifle.Tile = function(code, ownerCode) {
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

Trifle.Tile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

Trifle.Tile.prototype.canMove = function(first_argument) {
	return !(this.code === 'C' || this.code === 'F');
};

Trifle.Tile.prototype.getMoveDistance = function() {
	if (this.code === 'L' || this.code === 'B') {
		return 1;
	} else if (this.code === 'S') {
		return 6;
	}

	return 0;
};

Trifle.Tile.prototype.isFlowerTile = function() {
	// Must be L, C, F
	return this.code === 'L' || this.code === 'C' || this.code === 'F';
};

Trifle.Tile.prototype.hasCaptureAbility = function() {
	// Must be D, W, S
	return this.code === 'D' || this.code === 'W' || this.code === 'S';
};

Trifle.Tile.prototype.getName = function() {
	return Trifle.Tile.getTileName(this.code);
};

Trifle.Tile.prototype.getCopy = function() {
	return new Trifle.Tile(this.code, this.ownerCode);
};


Trifle.Tile.getTileName = function(tileCode) {
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
		Object.keys(Trifle.TileCodes).forEach(function(key,index) {
			if (Trifle.TileCodes[key] === tileCode) {
				name = key;
			}
		});
	}

	return name;
};

Trifle.Tile.getTeamLimitForTile = function(tileCode) {
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


