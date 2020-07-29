/* Street Pai Sho Tile */

function StreetTile(ownerCode) {
	this.code = "L";
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

StreetTile.prototype.getConsoleDisplay = function() {
	return this.ownerCode + "" + this.code;
};

StreetTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

StreetTile.prototype.getMoveDistance = function() {
	if (this.capturedTile) {
		if (gameOptionEnabled(BONUS_MOVEMENT_BASED_ON_NUM_CAPTIVES)) {
			return 3 + this.getNumCaptivesInStack();
		} else if (gameOptionEnabled(BONUS_MOVEMENT_5)) {
			return 5;
		}
	}
	return 3;
};

StreetTile.prototype.getNumCaptivesInStack = function() {
	if (this.capturedTile) {
		return this.capturedTile.getNumCaptivesInStack() + 1;
	};
	return 0;
};

StreetTile.prototype.formsHarmonyWith = function(otherTile) {
	// Tiles must belong to same player
	if (otherTile.ownerName !== this.ownerName) {
		return false;
	}

	return true;
};

StreetTile.prototype.captureTile = function(otherTile) {
	if (this.capturedTile) {
		debug("Error - already has captured tile");
	}

	this.capturedTile = otherTile;
};

StreetTile.prototype.releaseCapturedTile = function() {
	var theCapturedTile = this.capturedTile;
	this.capturedTile = null;
	return theCapturedTile;
};

StreetTile.prototype.getName = function() {
	return StreetTile.getTileName(this.code);
};

StreetTile.getTileName = function(tileCode) {
	var name = "Tile";

	return name;
};

StreetTile.prototype.getCopy = function() {
	return new StreetTile(this.ownerCode);
};


