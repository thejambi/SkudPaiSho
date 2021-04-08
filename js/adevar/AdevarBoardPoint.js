// Board Point

var AdevarBoardPointType = {
	NORTH_NEUTRAL_PLOT: "Northern Open Plot",
	EAST_NEUTRAL_PLOT: "Eastern Open Plot",
	SOUTH_NEUTRAL_PLOT: "Southern Open Plot",
	WEST_NEUTRAL_PLOT: "Western Open Plot",
	NORTH_RED_PLOT: "Northern Red Plot",
	SOUTH_RED_PLOT: "Southern Red Plot",
	WEST_WHITE_PLOT: "Western White Plot",
	EAST_WHITE_PLOT: "Eastern White Plot"
};

function AdevarBoardPoint() {
	this.types = [];
	this.plotTypes = [];
	this.row = -1;
	this.col = -1;
	this.gardenHighlightNumbers = [];
}

AdevarBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

AdevarBoardPoint.prototype.addPlotType = function(type) {
	if (!this.plotTypes.includes(type)) {
		this.plotTypes.push(type);
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

AdevarBoardPoint.prototype.isPossibleForMovementType = function(movementInfo) {
	return false; // ??
};

AdevarBoardPoint.prototype.setMoveDistanceRemaining = function(movementInfo, distanceRemaining) {
	this.moveDistanceRemaining = distanceRemaining;
};
AdevarBoardPoint.prototype.getMoveDistanceRemaining = function(movementInfo) {
	return this.moveDistanceRemaining;
};

AdevarBoardPoint.prototype.clearPossibleMovementTypes = function() {
	this.moveDistanceRemaining = null;
};

AdevarBoardPoint.prototype.highlight = function(gardenNumber) {
	this.gardenHighlightNumbers.push(gardenNumber);
};

AdevarBoardPoint.prototype.removeHighlight = function() {
	this.gardenHighlightNumbers = [];
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

AdevarBoardPoint.newPoint = function(pointTypes) {
	var point = new AdevarBoardPoint();
	pointTypes.forEach(function(pointType) {
		point.addType(pointType);
		point.addPlotType(pointType);
	});
	return point;
};

AdevarBoardPoint.neutral = function() {
	var point = new AdevarBoardPoint();
	point.addType(NEUTRAL);

	return point;
};

AdevarBoardPoint.wall = function() {
	var point = new AdevarBoardPoint();
	point.addType(NON_PLAYABLE);

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



