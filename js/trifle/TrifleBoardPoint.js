// Vababond Board Point

var NON_PLAYABLE = "Non-Playable";
var NEUTRAL = "Neutral";
var RED = "Red";
var WHITE = "White";
var GATE = "Gate";
var TEMPLE = GATE;

var POSSIBLE_MOVE = "Possible Move";
var OPEN_GATE = "OPEN GATE";

var thinDot = "·";
var thickDot = "•";
var whiteDot = "◦";
var gateDot = "⟡";

Trifle.BoardPoint = function() {
	this.types = [];
	this.row = -1;
	this.col = -1;
	this.possibleMoveTypes = [];
	this.moveDistanceRemaining = {};
	this.possibleMovementPaths = [];
}

Trifle.BoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

Trifle.BoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

// Trifle.BoardPoint.prototype.getConsoleDisplay = function() {
// 	if (this.tile) {
// 		return this.tile.getConsoleDisplay();
// 	} else {
// 		var consoleDisplay = thinDot;

// 		if (this.types.includes(NON_PLAYABLE)) {
// 			consoleDisplay = " ";
// 		}

// 		var str = "";

// 		if (this.types.includes(RED)) {
// 			str = "R";
// 			consoleDisplay = thickDot;
// 		}
// 		if (this.types.includes(WHITE)) {
// 			str += "W";
// 			consoleDisplay = whiteDot;
// 		}
// 		if (this.types.includes(NEUTRAL)) {
// 			str += "N";
// 		}

// 		if (this.types.includes(GATE)) {
// 			str = "G";
// 			consoleDisplay = gateDot;
// 		}

// 		if (str.length > 1) {
// 			consoleDisplay = "+";
// 		}

// 		return consoleDisplay;
// 	}
// };

Trifle.BoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

Trifle.BoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

Trifle.BoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

Trifle.BoardPoint.prototype.setPossibleForMovementType = function(movementInfo) {
	var movementTypeToAdd = Trifle.BoardPoint.getMovementType(movementInfo);
	if (!this.possibleMoveTypes.includes(movementTypeToAdd)) {
		this.possibleMoveTypes.push(movementTypeToAdd);
	}
};
Trifle.BoardPoint.prototype.isPossibleForMovementType = function(movementInfo) {
	var movementTypeToCheck = Trifle.BoardPoint.getMovementType(movementInfo);
	return this.possibleMoveTypes.includes(movementTypeToCheck);
};
Trifle.BoardPoint.prototype.clearPossibleMovementTypes = function() {
	this.possibleMoveTypes = [];
	this.moveDistanceRemaining = {};
};
Trifle.BoardPoint.prototype.clearPossibleMovementPaths = function() {
	this.possibleMovementPaths = [];
};
Trifle.BoardPoint.prototype.addPossibleMovementPath = function(movementPath) {
	this.possibleMovementPaths.push(movementPath);
};
Trifle.BoardPoint.prototype.getOnlyPossibleMovementPath = function() {
	if (this.possibleMovementPaths && this.possibleMovementPaths.length === 1) {
		return this.possibleMovementPaths[0];
	}
};
Trifle.BoardPoint.prototype.setMoveDistanceRemaining = function(movementInfo, distanceRemaining) {
	var movementType = Trifle.BoardPoint.getMovementType(movementInfo);
	this.moveDistanceRemaining[movementType] = distanceRemaining;
};
Trifle.BoardPoint.prototype.getMoveDistanceRemaining = function(movementInfo) {
	var movementType = Trifle.BoardPoint.getMovementType(movementInfo);
	return this.moveDistanceRemaining[movementType];
};
Trifle.BoardPoint.getMovementType = function(movementInfo) {
	return movementInfo.title ? movementInfo.title : movementInfo.type;
};

Trifle.BoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

Trifle.BoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

Trifle.BoardPoint.prototype.drainTile = function() {
	if (this.tile) {
		this.tile.drain();
	}
};

Trifle.BoardPoint.prototype.restoreTile = function() {
	if (this.tile) {
		this.tile.restore();
	}
};

Trifle.BoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
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

Trifle.BoardPoint.prototype.betweenPlayerHarmony = function(player) {
	if (player === GUEST) {
		return this.betweenHarmonyGuest;
	} else if (player === HOST) {
		return this.betweenHarmonyHost;
	}
	return false;
};

Trifle.BoardPoint.prototype.getCopy = function() {
	var copy = new Trifle.BoardPoint();

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

Trifle.BoardPoint.neutral = function() {
	var point = new Trifle.BoardPoint();
	point.addType(NEUTRAL);

	return point;
};

Trifle.BoardPoint.gate = function() {
	var point = new Trifle.BoardPoint();
	point.addType(GATE);

	return point;
};

Trifle.BoardPoint.red = function() {
	var point = new Trifle.BoardPoint();
	point.addType(RED);

	return point;
};

Trifle.BoardPoint.white = function() {
	var point = new Trifle.BoardPoint();
	point.addType(WHITE);

	return point;
};

Trifle.BoardPoint.redWhite = function() {
	var point = new Trifle.BoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

Trifle.BoardPoint.redWhiteNeutral = function() {
	var point = new Trifle.BoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

Trifle.BoardPoint.redNeutral = function() {
	var point = new Trifle.BoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

Trifle.BoardPoint.whiteNeutral = function() {
	var point = new Trifle.BoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};



