// Board Point

KeyPaiSho.BoardPoint = function() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

KeyPaiSho.BoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

KeyPaiSho.BoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

KeyPaiSho.BoardPoint.prototype.getConsoleDisplay = function() {
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

KeyPaiSho.BoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

KeyPaiSho.BoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

KeyPaiSho.BoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

KeyPaiSho.BoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

KeyPaiSho.BoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

KeyPaiSho.BoardPoint.prototype.drainTile = function() {
	if (this.tile) {
		this.tile.drain();
	}
};

KeyPaiSho.BoardPoint.prototype.restoreTile = function() {
	if (this.tile) {
		this.tile.restore();
	}
};

KeyPaiSho.BoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
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

KeyPaiSho.BoardPoint.prototype.betweenPlayerHarmony = function(player) {
	if (player === GUEST) {
		return this.betweenHarmonyGuest;
	} else if (player === HOST) {
		return this.betweenHarmonyHost;
	}
	return false;
};

KeyPaiSho.BoardPoint.prototype.setMoveDistanceRemaining = function(movementInfo, distanceRemaining) {
	this.moveDistanceRemaining = distanceRemaining;
};
KeyPaiSho.BoardPoint.prototype.getMoveDistanceRemaining = function(movementInfo) {
	return this.moveDistanceRemaining;
};
KeyPaiSho.BoardPoint.prototype.clearPossibleMovementTypes = function() {
	this.moveDistanceRemaining = null;
};

KeyPaiSho.BoardPoint.prototype.getCopy = function() {
	var copy = new KeyPaiSho.BoardPoint();

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

KeyPaiSho.BoardPoint.neutral = function() {
	var point = new KeyPaiSho.BoardPoint();
	point.addType(NEUTRAL);

	return point;
};

KeyPaiSho.BoardPoint.gate = function() {
	var point = new KeyPaiSho.BoardPoint();
	point.addType(GATE);

	return point;
};

KeyPaiSho.BoardPoint.red = function() {
	var point = new KeyPaiSho.BoardPoint();
	point.addType(RED);

	return point;
};

KeyPaiSho.BoardPoint.white = function() {
	var point = new KeyPaiSho.BoardPoint();
	point.addType(WHITE);

	return point;
};

KeyPaiSho.BoardPoint.redWhite = function() {
	var point = new KeyPaiSho.BoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

KeyPaiSho.BoardPoint.redWhiteNeutral = function() {
	var point = new KeyPaiSho.BoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

KeyPaiSho.BoardPoint.redNeutral = function() {
	var point = new KeyPaiSho.BoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

KeyPaiSho.BoardPoint.whiteNeutral = function() {
	var point = new KeyPaiSho.BoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};



