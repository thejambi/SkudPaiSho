// Board Point

var CENTER = "Center";

function FirePaiShoBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

FirePaiShoBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

FirePaiShoBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

FirePaiShoBoardPoint.prototype.getConsoleDisplay = function() {
	if (this.tile) {
		return this.tile.getConsoleDisplay();
	} else {
		var consoleDisplay = thinDot;

		if (this.types.includes(NON_PLAYABLE)) {
			consoleDisplay = " ";
		}

		var str = "";

		if (this.types.includes(RED)) {
			str = "R";
			consoleDisplay = thickDot;
		}
		if (this.types.includes(WHITE)) {
			str += "W";
			consoleDisplay = whiteDot;
		}
		if (this.types.includes(NEUTRAL)) {
			str += "N";
		}

		if (this.types.includes(GATE)) {
			str = "G";
			consoleDisplay = gateDot;
		}

		if (str.length > 1) {
			consoleDisplay = "+";
		}

		return consoleDisplay;
	}
};

FirePaiShoBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

FirePaiShoBoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

FirePaiShoBoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

FirePaiShoBoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

FirePaiShoBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

FirePaiShoBoardPoint.prototype.boostTile = function() {
	if (this.tile) {
		this.tile.boost();
	}
};

FirePaiShoBoardPoint.prototype.restoreTile = function() {
	if (this.tile) {
		this.tile.restore();
	}
};

FirePaiShoBoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
	// Validate this point's ability to hold given tile

	if (this.isType(NON_PLAYABLE)) {
		return false;
	}

	if (!ignoreTileCheck && this.hasTile()) {
		// This function does not take into account capturing abilities
		return false;
	}

	if (tile.type === BASIC_FLOWER) {
		if (!(this.isType(NEUTRAL) || this.isType(tile.basicColorName))) {
			// Opposing colored point
			return false;
		}

		if (this.isType(GATE)) {
			return false;
		}

		return true;
	} else if (tile.type === SPECIAL_FLOWER) {
		return true;
	} else if (tile.type === ACCENT_TILE) {
		return true;
	}

	return false;
};

FirePaiShoBoardPoint.prototype.betweenPlayerHarmony = function(player) {
	if (player === GUEST) {
		return this.betweenHarmonyGuest;
	} else if (player === HOST) {
		return this.betweenHarmonyHost;
	}
	return false;
};

FirePaiShoBoardPoint.prototype.getCopy = function() {
	var copy = new FirePaiShoBoardPoint();

	// this.types
	for (var i = 0; i < this.types.length; i++) {
		copy.types.push(this.types[i]);
	}

	// this.row
	copy.row = this.row;
	// this.col
	copy.col = this.col;

	// tile
	if (this.hasTile()) {
		copy.tile = this.tile.getCopy();
	}

	return copy;
};



// Point makers

FirePaiShoBoardPoint.neutral = function() {
	var point = new FirePaiShoBoardPoint();
	point.addType(NEUTRAL);

	return point;
};

FirePaiShoBoardPoint.gate = function() {
	var point = new FirePaiShoBoardPoint();
	point.addType(GATE);

	return point;
};

FirePaiShoBoardPoint.red = function() {
	var point = new FirePaiShoBoardPoint();
	point.addType(RED);

	return point;
};

FirePaiShoBoardPoint.white = function() {
	var point = new FirePaiShoBoardPoint();
	point.addType(WHITE);

	return point;
};

FirePaiShoBoardPoint.redWhite = function() {
	var point = new FirePaiShoBoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

FirePaiShoBoardPoint.redWhiteNeutral = function() {
	var point = new FirePaiShoBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

FirePaiShoBoardPoint.redNeutral = function() {
	var point = new FirePaiShoBoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

FirePaiShoBoardPoint.whiteNeutral = function() {
	var point = new FirePaiShoBoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

FirePaiShoBoardPoint.center = function() {
	var point = new FirePaiShoBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(CENTER);

	return point;
};



