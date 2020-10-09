// Board Point

function AdevarBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

AdevarBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

AdevarBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

AdevarBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

AdevarBoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

AdevarBoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

AdevarBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

AdevarBoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
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

AdevarBoardPoint.prototype.getCopy = function() {
	var copy = new AdevarBoardPoint();

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

AdevarBoardPoint.neutral = function() {
	var point = new AdevarBoardPoint();
	point.addType(NEUTRAL);

	return point;
};

AdevarBoardPoint.gate = function() {
	var point = new AdevarBoardPoint();
	point.addType(GATE);

	return point;
};

AdevarBoardPoint.red = function() {
	var point = new AdevarBoardPoint();
	point.addType(RED);

	return point;
};

AdevarBoardPoint.white = function() {
	var point = new AdevarBoardPoint();
	point.addType(WHITE);

	return point;
};

AdevarBoardPoint.redWhite = function() {
	var point = new AdevarBoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

AdevarBoardPoint.redWhiteNeutral = function() {
	var point = new AdevarBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

AdevarBoardPoint.redNeutral = function() {
	var point = new AdevarBoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

AdevarBoardPoint.whiteNeutral = function() {
	var point = new AdevarBoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};



