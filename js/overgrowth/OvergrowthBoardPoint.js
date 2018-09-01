// Board Point

function OvergrowthBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

OvergrowthBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

OvergrowthBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

OvergrowthBoardPoint.prototype.getConsoleDisplay = function() {
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

OvergrowthBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

OvergrowthBoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

OvergrowthBoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

OvergrowthBoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

OvergrowthBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

OvergrowthBoardPoint.prototype.drainTile = function() {
	if (this.tile) {
		this.tile.drain();
	}
};

OvergrowthBoardPoint.prototype.restoreTile = function() {
	if (this.tile) {
		this.tile.restore();
	}
};

OvergrowthBoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
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

OvergrowthBoardPoint.prototype.isCompletelyWithinRedOrWhiteGarden = function() {
	return !this.isType(NEUTRAL) 
			&& ((this.isType(RED) && !this.isType(WHITE)) 
				|| (this.isType(WHITE) && !this.isType(RED)));
};

OvergrowthBoardPoint.prototype.betweenPlayerHarmony = function(player) {
	if (player === GUEST) {
		return this.betweenHarmonyGuest;
	} else if (player === HOST) {
		return this.betweenHarmonyHost;
	}
	return false;
};

OvergrowthBoardPoint.prototype.getCopy = function() {
	var copy = new OvergrowthBoardPoint();

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

OvergrowthBoardPoint.neutral = function() {
	var point = new OvergrowthBoardPoint();
	point.addType(NEUTRAL);

	return point;
};

OvergrowthBoardPoint.gate = function() {
	var point = new OvergrowthBoardPoint();
	point.addType(GATE);

	return point;
};

OvergrowthBoardPoint.red = function() {
	var point = new OvergrowthBoardPoint();
	point.addType(RED);

	return point;
};

OvergrowthBoardPoint.white = function() {
	var point = new OvergrowthBoardPoint();
	point.addType(WHITE);

	return point;
};

OvergrowthBoardPoint.redWhite = function() {
	var point = new OvergrowthBoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

OvergrowthBoardPoint.redWhiteNeutral = function() {
	var point = new OvergrowthBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

OvergrowthBoardPoint.redNeutral = function() {
	var point = new OvergrowthBoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

OvergrowthBoardPoint.whiteNeutral = function() {
	var point = new OvergrowthBoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};



