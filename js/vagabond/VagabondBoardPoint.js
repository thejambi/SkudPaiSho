// Vababond Board Point

function VagabondBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

VagabondBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

VagabondBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

VagabondBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

VagabondBoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

VagabondBoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

VagabondBoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

VagabondBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;

	this.tile = null;

	return theTile;
};

VagabondBoardPoint.prototype.drainTile = function() {
	if (this.tile) {
		this.tile.drain();
	}
};

VagabondBoardPoint.prototype.restoreTile = function() {
	if (this.tile) {
		this.tile.restore();
	}
};

VagabondBoardPoint.prototype.canHoldTile = function(tile, ignoreTileCheck) {
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

VagabondBoardPoint.prototype.betweenPlayerHarmony = function(player) {
	if (player === GUEST) {
		return this.betweenHarmonyGuest;
	} else if (player === HOST) {
		return this.betweenHarmonyHost;
	}
	return false;
};

VagabondBoardPoint.prototype.getCopy = function() {
	var copy = new VagabondBoardPoint();

	copy.types = copyArray(this.types);

	copy.row = this.row;
	copy.col = this.col;

	if (this.hasTile()) {
		copy.tile = this.tile.getCopy();
	}

	return copy;
};



// Point makers

VagabondBoardPoint.neutral = function() {
	var point = new VagabondBoardPoint();
	point.addType(NEUTRAL);

	return point;
};

VagabondBoardPoint.gate = function() {
	var point = new VagabondBoardPoint();
	point.addType(GATE);

	return point;
};

VagabondBoardPoint.red = function() {
	var point = new VagabondBoardPoint();
	point.addType(RED);

	return point;
};

VagabondBoardPoint.white = function() {
	var point = new VagabondBoardPoint();
	point.addType(WHITE);

	return point;
};

VagabondBoardPoint.redWhite = function() {
	var point = new VagabondBoardPoint();
	point.addType(RED);
	point.addType(WHITE);

	return point;
};

VagabondBoardPoint.redWhiteNeutral = function() {
	var point = new VagabondBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};

VagabondBoardPoint.redNeutral = function() {
	var point = new VagabondBoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);

	return point;
};

VagabondBoardPoint.whiteNeutral = function() {
	var point = new VagabondBoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);

	return point;
};



