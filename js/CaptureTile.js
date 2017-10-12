// Capture Pai Sho Tile

// var tileId = 1;	// common

function CaptureTile(code, ownerCode) {
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

CaptureTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

CaptureTile.prototype.getMoveDistance = function() {
	return 3;
};

CaptureTile.prototype.getName = function() {
	return CaptureTile.getTileName(this.code);
};

CaptureTile.prototype.canCapture = function(otherTile) {
	if (otherTile.ownerCode !== this.ownerCode) {
		// Can only capture other player's tiles...
		var tileOrder = ['A','V','B','P','F','U','K','L','D','M','T','O'];
		var thisIndex = tileOrder.indexOf(this.code);
		// If index of otherTile is one of the next three, then capture
		var otherIndex = tileOrder.indexOf(otherTile.code);

		if (thisIndex > otherIndex) {
			otherIndex += tileOrder.length;
		}

		return otherIndex !== thisIndex && otherIndex - thisIndex <= 3;
	} else {
		return false;
	}
};

CaptureTile.prototype.getCopy = function() {
	return new CaptureTile(this.code, this.ownerCode);
};


CaptureTile.getTileName = function(tileCode) {
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


