// Board Point

function CoopSolitaireBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

CoopSolitaireBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

CoopSolitaireBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

CoopSolitaireBoardPoint.prototype.getConsoleDisplay = function() {
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

CoopSolitaireBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

CoopSolitaireBoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

CoopSolitaireBoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

CoopSolitaireBoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

CoopSolitaireBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

CoopSolitaireBoardPoint.prototype.drainTile = function() {
	if (this.tile) {
		this.tile.drain();
	}
};

CoopSolitaireBoardPoint.prototype.restoreTile = function() {
	if (this.tile) {
		this.tile.restore();
	}
};

CoopSolitaireBoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
	// Validate this point's ability to hold given tile

	if (this.isType(NON_PLAYABLE)) {
		return false;
	}

	if (!ignoreTileCheck && this.hasTile()) {
		// This function does not take into account capturing abilities
		return false;
	}

	// For Solitaire: GATEs are OK
	if (this.isType(GATE)) {
		return true;
	}

	if (tile.type === BASIC_FLOWER) {
		if (!(this.isType(NEUTRAL) || this.isType(tile.basicColorName))) {
			// Opposing colored point
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

CoopSolitaireBoardPoint.prototype.isCompletelyWithinRedOrWhiteGarden = function() {
	return !this.isType(NEUTRAL) 
			&& ((this.isType(RED) && !this.isType(WHITE)) 
				|| (this.isType(WHITE) && !this.isType(RED)));
};

CoopSolitaireBoardPoint.prototype.betweenPlayerHarmony = function(player) {
	if (player === GUEST) {
		return this.betweenHarmonyGuest;
	} else if (player === HOST) {
		return this.betweenHarmonyHost;
	}
	return false;
};

CoopSolitaireBoardPoint.prototype.getCopy = function() {
	var copy = new CoopSolitaireBoardPoint();

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

CoopSolitaireBoardPoint.neutral = function() {
	var point = new CoopSolitaireBoardPoint();
	point.addType(NEUTRAL);

	return point;
};

CoopSolitaireBoardPoint.gate = function() {
	var point = new CoopSolitaireBoardPoint();
	point.addType(GATE);

	return point;
};

CoopSolitaireBoardPoint.red = function() {
	var point = new CoopSolitaireBoardPoint();
	point.addType(RED);

	return point;
};

CoopSolitaireBoardPoint.white = function() {
	var point = new CoopSolitaireBoardPoint();
	point.addType(WHITE);

	return point;
};

CoopSolitaireBoardPoint.redWhite = function() {
	var point = new CoopSolitaireBoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

CoopSolitaireBoardPoint.redWhiteNeutral = function() {
	var point = new CoopSolitaireBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

CoopSolitaireBoardPoint.redNeutral = function() {
	var point = new CoopSolitaireBoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

CoopSolitaireBoardPoint.whiteNeutral = function() {
	var point = new CoopSolitaireBoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};



