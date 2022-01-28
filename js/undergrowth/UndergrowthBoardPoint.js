// Board Point

Undergrowth.BoardPoint = function() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

Undergrowth.BoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

Undergrowth.BoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

Undergrowth.BoardPoint.prototype.getConsoleDisplay = function() {
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

Undergrowth.BoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

Undergrowth.BoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

Undergrowth.BoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

Undergrowth.BoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

Undergrowth.BoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

Undergrowth.BoardPoint.prototype.drainTile = function() {
	if (this.tile) {
		this.tile.drain();
	}
};

Undergrowth.BoardPoint.prototype.restoreTile = function() {
	if (this.tile) {
		this.tile.restore();
	}
};

Undergrowth.BoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
	// Validate this point's ability to hold given tile

	if (this.isType(NON_PLAYABLE)) {
		return false;
	}

	if (!ignoreTileCheck && this.hasTile()) {
		// This function does not take into account capturing abilities
		return false;
	}

	if (gameOptionEnabled(UNDERGROWTH_SIMPLE)) {
		return true;
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

Undergrowth.BoardPoint.prototype.isCompletelyWithinRedOrWhiteGarden = function() {
	return !this.isType(NEUTRAL) 
			&& ((this.isType(RED) && !this.isType(WHITE)) 
				|| (this.isType(WHITE) && !this.isType(RED)));
};

Undergrowth.BoardPoint.prototype.betweenPlayerHarmony = function(player) {
	if (player === GUEST) {
		return this.betweenHarmonyGuest;
	} else if (player === HOST) {
		return this.betweenHarmonyHost;
	}
	return false;
};

Undergrowth.BoardPoint.prototype.getCopy = function() {
	var copy = new Undergrowth.BoardPoint();

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

Undergrowth.BoardPoint.neutral = function() {
	var point = new Undergrowth.BoardPoint();
	point.addType(NEUTRAL);

	return point;
};

Undergrowth.BoardPoint.gate = function() {
	var point = new Undergrowth.BoardPoint();
	point.addType(GATE);

	return point;
};

Undergrowth.BoardPoint.red = function() {
	var point = new Undergrowth.BoardPoint();
	point.addType(RED);

	return point;
};

Undergrowth.BoardPoint.white = function() {
	var point = new Undergrowth.BoardPoint();
	point.addType(WHITE);

	return point;
};

Undergrowth.BoardPoint.redWhite = function() {
	var point = new Undergrowth.BoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

Undergrowth.BoardPoint.redWhiteNeutral = function() {
	var point = new Undergrowth.BoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

Undergrowth.BoardPoint.redNeutral = function() {
	var point = new Undergrowth.BoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

Undergrowth.BoardPoint.whiteNeutral = function() {
	var point = new Undergrowth.BoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};



