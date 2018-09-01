// Coop Solitaire Harmony

function OvergrowthHarmony(tile1, tile1RowAndColumn, tile2, tile2RowAndColumn) {
	this.tile1 = tile1;
	this.tile1Pos = tile1RowAndColumn;
	this.tile2 = tile2;
	this.tile2Pos = tile2RowAndColumn;

	if (this.tile1.type !== ACCENT_TILE) {
		this.ownerCode = this.tile1.ownerCode;
		this.ownerName = this.tile1.ownerName;
	} else if (this.tile2.type !== ACCENT_TILE) {
		this.ownerCode = this.tile2.ownerCode;
		this.ownerName = this.tile2.ownerName;
	} else {
		debug("ERROR: HARMONY REQUIRES A BASIC FLOWER TILE");
	}
}

OvergrowthHarmony.prototype.equals = function(otherHarmony) {
	if (this.tile1 === otherHarmony.tile1 || this.tile1 === otherHarmony.tile2) {
		if (this.tile2 === otherHarmony.tile1 || this.tile2 === otherHarmony.tile2) {
			return true;
		}
	}
	return false;
};

OvergrowthHarmony.prototype.notAnyOfThese = function(harmonies) {
	for (var i = 0; i < harmonies.length; i++) {
		if (this.equals(harmonies[i])) {
			return false;
		}
	}
	return true;
};

OvergrowthHarmony.prototype.containsTile = function(tile) {
	return (this.tile1 === tile || this.tile2 === tile);
};

OvergrowthHarmony.prototype.getTileThatIsNotThisOne = function(tile) {
	if (this.tile1 === tile) {
		return this.tile2;
	} else if (this.tile2 === tile) {
		return this.tile1;
	} else {
		debug("BOTH TILES ARE NOT THAT ONE!");
	}
};

OvergrowthHarmony.prototype.containsTilePos = function(pos) {
	return this.tile1Pos.samesies(pos) || this.tile2Pos.samesies(pos);
};

OvergrowthHarmony.prototype.getPosThatIsNotThisOne = function(pos) {
	if (this.tile1Pos.samesies(pos)) {
		return this.tile2Pos;
	} else if(this.tile2Pos.samesies(pos)) {
		return this.tile1Pos;
	} else {
		debug("	BOTH TILE POS ARE NOT THAT ONE!");
	}
};

OvergrowthHarmony.prototype.getString = function() {
	return this.ownerName + " (" + this.tile1Pos.notationPointString + ")-(" + this.tile2Pos.notationPointString + ")";
};

OvergrowthHarmony.prototype.getDirectionForTile = function(tile) {
	if (!this.containsTile(tile)) {
		return;
	}

	var thisPos = this.tile1Pos;	// Assume it's tile1
	var otherPos = this.tile2Pos;
	if (this.tile2.id === tile.id) {
		thisPos = this.tile2Pos;	// It's tile2!
		otherPos = this.tile1Pos;
	}

	if (thisPos.row === otherPos.row) {
		// Same row means East or West
		if (thisPos.col < otherPos.col) {
			return "East";
		} else {
			return "West";
		}
	} else if (thisPos.col === otherPos.col) {
		// Same col means North or South
		if (thisPos.row > otherPos.row) {
			return "North";
		} else {
			return "South";
		}
	}
};

OvergrowthHarmony.prototype.crossesCenter = function() {
	var rowHigh = this.tile1Pos.row;
	var rowLow = this.tile2Pos.row;
	if (this.tile1Pos.row < this.tile2Pos.row) {
		rowHigh = this.tile2Pos.row;
		rowLow = this.tile1Pos.row;
	}

	if (rowHigh !== rowLow) {
		return rowHigh > 8 && rowLow < 8;
	}

	var colHigh = this.tile1Pos.col;
	var colLow = this.tile2Pos.col;
	if (this.tile1Pos.col < this.tile2Pos.col) {
		colHigh = this.tile2Pos.col;
		colLow = this.tile1Pos.col;
	}

	if (colHigh !== colLow) {
		return colHigh > 8 && colLow < 8;
	}
};


// --------------------------------------------- // 


// HarmonyManager manages list of harmonies
function OvergrowthHarmonyManager() {
	this.harmonies = [];
	this.clashes = [];
}

OvergrowthHarmonyManager.prototype.printHarmonies = function() {
	debug("All Harmonies:");
	for (var i = 0; i < this.harmonies.length; i++) {
		debug(this.harmonies[i].getString());
	}
};

OvergrowthHarmonyManager.prototype.getHarmoniesWithThisTile = function(tile) {
	var results = [];
	this.harmonies.forEach(function(harmony) {
		if (harmony.containsTile(tile)) {
			results.push(harmony);
		}
	});
	return results;
};

OvergrowthHarmonyManager.prototype.getClashesWithThisTile = function(tile) {
	var results = [];
	this.clashes.forEach(function(harmony) {
		if (harmony.containsTile(tile)) {
			results.push(harmony);
		}
	});
	return results;
};

OvergrowthHarmonyManager.prototype.addHarmony = function(harmony) {
	// Add harmony if it doesn't already exist

	// Does it exist in old set of harmonies?
	var exists = false;
	for (var j = 0; j < this.harmonies.length; j++) {
		if (harmony.equals(this.harmonies[j])) {
			exists = true;
		}
	}

	if (!exists) {
		this.harmonies.push(harmony);
	} else {
		// debug("Harmony exists, ignoring");
	}
};

OvergrowthHarmonyManager.prototype.addHarmonies = function(harmoniesToAdd) {
	if (!harmoniesToAdd) {
		return;
	}

	for (var i = 0; i < harmoniesToAdd.length; i++) {
		this.addHarmony(harmoniesToAdd[i]);
	}
};

OvergrowthHarmonyManager.prototype.addClash = function(harmony) {
	// Add harmony if it doesn't already exist

	// Does it exist in old set of harmonies?
	var exists = false;
	for (var j = 0; j < this.clashes.length; j++) {
		if (harmony.equals(this.clashes[j])) {
			exists = true;
		}
	}

	if (!exists) {
		this.clashes.push(harmony);
	}
};

OvergrowthHarmonyManager.prototype.addClashes = function(harmoniesToAdd) {
	if (!harmoniesToAdd) {
		return;
	}

	for (var i = 0; i < harmoniesToAdd.length; i++) {
		this.addClash(harmoniesToAdd[i]);
	}
};

OvergrowthHarmonyManager.prototype.clearList = function() {
	this.harmonies = [];
	this.clashes = [];
};

OvergrowthHarmonyManager.prototype.getWinningPlayer = function() {
	if (this.numHarmonies() > this.numClashes()) {
		return HOST;
	} else if (this.numClashes() > this.numHarmonies()) {
		return GUEST;
	}
};

OvergrowthHarmonyManager.prototype.getScoreSummaryText = function() {
	var numHarmonies = this.numHarmonies();
	var numClashes = this.numClashes();

	var message = numHarmonies + " Harmonies <br />"
					+ numClashes + " Disharmonies <br />";

	var harmonyPoints = this.getHarmonyPoints(this.harmonies);
	var clashPoints = this.getHarmonyPoints(this.clashes);

	message += "<br />" 
			+ harmonyPoints + " Harmony Points <br />" 
			+ clashPoints + " Disharmony Points <br />";

	return message;
};

OvergrowthHarmonyManager.prototype.getHarmonyPoints = function(harmonyList) {
	var points = 0;
	for (var i = 0; i < harmonyList.length; i++) {
		var harmony = harmonyList[i];
		var direction = harmony.getDirectionForTile(harmony.tile1);
		if (direction === "North" || direction === "South") {
			// Calculate based on row
			points += Math.abs(harmony.tile1Pos.row - harmony.tile2Pos.row) + 1
		} else if (direction === "East" || direction === "West") {
			// Calculate based on column
			points += Math.abs(harmony.tile1Pos.col - harmony.tile2Pos.col) + 1;
		}
	}
	return points;
};

OvergrowthHarmonyManager.prototype.numHarmonies = function() {
	return this.harmonies.length;
};

OvergrowthHarmonyManager.prototype.numClashes = function() {
	return this.clashes.length;
};
