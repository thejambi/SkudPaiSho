// Board Point

var NON_PLAYABLE = "Non-Playable";
var NEUTRAL = "Neutral";
var RED = "Red";
var WHITE = "White";
var GATE = "Gate";

var POSSIBLE_MOVE = "Possible Move";
var OPEN_GATE = "OPEN GATE";

var thinDot = "·";
var thickDot = "•";
var whiteDot = "◦";
var gateDot = "⟡";

function SpiritBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

SpiritBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

SpiritBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

SpiritBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

SpiritBoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

SpiritBoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

SpiritBoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

SpiritBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

SpiritBoardPoint.prototype.drainTile = function() {
	if (this.tile) {
		this.tile.drain();
	}
};

SpiritBoardPoint.prototype.restoreTile = function() {
	if (this.tile) {
		this.tile.restore();
	}
};

SpiritBoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
	// Validate this point's ability to hold given tile

	if (this.isType(NON_PLAYABLE)) {
		return false;
	}

	if (!ignoreTileCheck && this.hasTile()) {
		// This function does not take into account capturing abilities
		return false;
	}

	return false;
};

SpiritBoardPoint.prototype.getCopy = function() {
	var copy = new BoardPoint();

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
SpiritBoardPoint.neutral = function() {
	var point = new SpiritBoardPoint();
	point.addType(NEUTRAL);

	return point;
};

SpiritBoardPoint.gate = function() {
	var point = new SpiritBoardPoint();
	point.addType(GATE);

	return point;
};

SpiritBoardPoint.red = function() {
	var point = new SpiritBoardPoint();
	point.addType(RED);

	return point;
};

SpiritBoardPoint.white = function() {
	var point = new SpiritBoardPoint();
	point.addType(WHITE);

	return point;
};

SpiritBoardPoint.redWhite = function() {
	var point = new SpiritBoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

SpiritBoardPoint.redWhiteNeutral = function() {
	var point = new SpiritBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

SpiritBoardPoint.redNeutral = function() {
	var point = new SpiritBoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

SpiritBoardPoint.whiteNeutral = function() {
	var point = new SpiritBoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};



