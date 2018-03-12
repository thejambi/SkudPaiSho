// Board Point

var NON_PLAYABLE = "Non-Playable";
var NEUTRAL = "Neutral";

var GATE = "Gate";

var POSSIBLE_MOVE = "Possible Move";
var OPEN_GATE = "OPEN GATE";

var thinDot = "·";
var thickDot = "•";
var whiteDot = "◦";
var gateDot = "⟡";

function StreetBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

StreetBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

StreetBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

StreetBoardPoint.prototype.getConsoleDisplay = function() {
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

StreetBoardPoint.prototype.putTile = function(tile) {
	/* If have a tile, give it to the new tile */
	if (this.tile) {
		tile.captureTile(this.tile);
	}

	/* Set new tile */
	this.tile = tile;
};

StreetBoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

StreetBoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

StreetBoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

StreetBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

StreetBoardPoint.prototype.drainTile = function() {
	if (this.tile) {
		this.tile.drain();
	}
};

StreetBoardPoint.prototype.restoreTile = function() {
	if (this.tile) {
		this.tile.restore();
	}
};

StreetBoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
	// Validate this point's ability to hold given tile

	if (this.isType(NON_PLAYABLE)) {
		return false;
	}

	if (!ignoreTileCheck && this.hasTile()) {
		// This function does not take into account capturing abilities
		return false;
	}

	return true;
};

StreetBoardPoint.prototype.betweenPlayerHarmony = function(player) {
	if (player === GUEST) {
		return this.betweenHarmonyGuest;
	} else if (player === HOST) {
		return this.betweenHarmonyHost;
	}
	return false;
};

StreetBoardPoint.prototype.getCopy = function() {
	var copy = new StreetBoardPoint();

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

StreetBoardPoint.neutral = function() {
	var point = new StreetBoardPoint();
	point.addType(NEUTRAL);

	return point;
};

StreetBoardPoint.gate = function() {
	var point = new StreetBoardPoint();
	point.addType(GATE);

	return point;
};

StreetBoardPoint.red = function() {
	var point = new StreetBoardPoint();
	point.addType(RED);

	return point;
};

StreetBoardPoint.white = function() {
	var point = new StreetBoardPoint();
	point.addType(WHITE);

	return point;
};

StreetBoardPoint.redWhite = function() {
	var point = new StreetBoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

StreetBoardPoint.redWhiteNeutral = function() {
	var point = new StreetBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

StreetBoardPoint.redNeutral = function() {
	var point = new StreetBoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

StreetBoardPoint.whiteNeutral = function() {
	var point = new StreetBoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};



