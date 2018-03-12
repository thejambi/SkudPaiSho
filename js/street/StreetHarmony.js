/* Skud Pai Sho Harmony */

function StreetHarmony(tile1, tile1RowAndColumn, tile2, tile2RowAndColumn) {
	this.tile1 = tile1;
	this.tile1Pos = new RowAndColumn(tile1RowAndColumn.row, tile1RowAndColumn.col);
	this.tile2 = tile2;
	this.tile2Pos = new RowAndColumn(tile2RowAndColumn.row, tile2RowAndColumn.col);

	this.ownerCode = this.tile1.ownerCode;
	this.ownerName = this.tile1.ownerName;
}

StreetHarmony.prototype.equals = function(otherHarmony) {
	if (this.ownerName === otherHarmony.ownerName && this.ownerCode === otherHarmony.ownerCode) {
		if (this.tile1 === otherHarmony.tile1 || this.tile1 === otherHarmony.tile2) {
			if (this.tile2 === otherHarmony.tile1 || this.tile2 === otherHarmony.tile2) {
				return true;
			}
		}
	}
	return false;
};

StreetHarmony.prototype.notAnyOfThese = function(harmonies) {
	for (var i = 0; i < harmonies.length; i++) {
		if (this.equals(harmonies[i])) {
			return false;
		}
	}
	return true;
};

StreetHarmony.prototype.containsTile = function(tile) {
	return (this.tile1 === tile || this.tile2 === tile);
};

StreetHarmony.prototype.getTileThatIsNotThisOne = function(tile) {
	if (this.tile1 === tile) {
		return this.tile2;
	} else if (this.tile2 === tile) {
		return this.tile1;
	} else {
		debug("BOTH TILES ARE NOT THAT ONE!");
	}
};

StreetHarmony.prototype.containsTilePos = function(pos) {
	return this.tile1Pos.samesies(pos) || this.tile2Pos.samesies(pos);
};

StreetHarmony.prototype.getPosThatIsNotThisOne = function(pos) {
	if (this.tile1Pos.samesies(pos)) {
		return this.tile2Pos;
	} else if(this.tile2Pos.samesies(pos)) {
		return this.tile1Pos;
	} else {
		debug("	BOTH TILE POS ARE NOT THAT ONE!");
	}
};

StreetHarmony.prototype.getString = function() {
	return this.ownerName + " (" + this.tile1Pos.notationPointString + ")-(" + this.tile2Pos.notationPointString + ")";
};

StreetHarmony.prototype.getDirectionForTile = function(tile) {
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

StreetHarmony.prototype.crossesCenter = function() {
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
function StreetHarmonyManager() {
	this.harmonies = [];
}

StreetHarmonyManager.prototype.printHarmonies = function() {
	debug("All Harmonies:");
	for (var i = 0; i < this.harmonies.length; i++) {
		debug(this.harmonies[i].getString());
	}
};

StreetHarmonyManager.prototype.getHarmoniesWithThisTile = function(tile) {
	var results = [];
	this.harmonies.forEach(function(harmony) {
		if (harmony.containsTile(tile)) {
			results.push(harmony);
		}
	});
	return results;
};

StreetHarmonyManager.prototype.addHarmony = function(harmony) {
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

StreetHarmonyManager.prototype.addHarmonies = function(harmoniesToAdd) {
	if (!harmoniesToAdd) {
		return;
	}

	for (var i = 0; i < harmoniesToAdd.length; i++) {
		this.addHarmony(harmoniesToAdd[i]);
	}
};

StreetHarmonyManager.prototype.clearList = function() {
	this.harmonies = [];
};

StreetHarmonyManager.prototype.numHarmoniesForPlayer = function(player) {
	var count = 0;
	for (var i = 0; i < this.harmonies.length; i++) {
		if (this.harmonies[i].ownerName === player) {
			count++;
		}
	}
	return count;
};

StreetHarmonyManager.prototype.getPlayerWithMostHarmonies = function() {
	var hostCount = this.numHarmoniesForPlayer(HOST);
	var guestCount = this.numHarmoniesForPlayer(GUEST);

	if (guestCount > hostCount) {
		return GUEST;
	} else if (hostCount > guestCount) {
		return HOST;
	}
};

StreetHarmonyManager.prototype.getNumCrossingCenterForPlayer = function(player) {
	var count = 0;
	for (var i = 0; i < this.harmonies.length; i++) {
		if (this.harmonies[i].ownerName === player) {
			if (this.harmonies[i].crossesCenter()) {
				count++;
			}
		}
	}
	return count;
};

StreetHarmonyManager.prototype.ringLengthForPlayer = function(player) {
	var rings = this.getHarmonyChains();
	var longest = 0;

	for (var i = 0; i < rings.length; i++) {
		var ring = rings[i];
		var h = ring.pop();	// LOL
		var playerName = h.ownerName;
		if (playerName === player) {
			var veryNice = true;
			if (veryNice && ring.length > longest) {
				longest = ring.length;
			}
		}
	}

	return longest;
};

StreetHarmonyManager.prototype.getPlayerWithLongestChain = function() {
	var hostLength = this.ringLengthForPlayer(HOST);
	var guestLength = this.ringLengthForPlayer(GUEST);

	if (guestLength > hostLength) {
		return GUEST;
	} else if (hostLength > guestLength) {
		return HOST;
	}
};

StreetHarmonyManager.prototype.hasNewHarmony = function(player, oldHarmonies) {
	// There's a new harmony if a player's tile has a harmony with a tile it didn't before
	
	// If current harmony list has one that oldHarmonies does not
	var newHarmonies = [];

	for (var i = 0; i < this.harmonies.length; i++) {

		// Does it belong to player?
		if (this.harmonies[i].ownerName === player) {

			// Does it exist in old set of harmonies?
			var exists = false;
			for (var j = 0; j < oldHarmonies.length; j++) {
				if (this.harmonies[i].equals(oldHarmonies[j])) {
					// Existing Harmony
					exists = true;
				}
			}

			if (!exists) {
				newHarmonies.push(this.harmonies[i]);
			}
		}
	}

	return newHarmonies.length > 0;
};

StreetHarmonyManager.prototype.getHarmonyChains = function() {
	var self = this;

	var rings = [];

	for (var i = 0; i < this.harmonies.length; i++) {
		var hx = this.harmonies[i];

		var chain = [];
		chain.push(hx);

		var startTile = hx.tile2;
		var startTilePos = hx.tile2Pos;
		var targetTile = hx.tile1;
		var targetTilePos = hx.tile1Pos;

		var ringFound = this.lookForRing(startTile, targetTile, chain);
		
		if (ringFound[0]) {
			var ringExists = false;
			
			rings.forEach(function(ring) {
				if (self.ringsMatch(ring, ringFound[1])) {
					ringExists = true;
				}
			});

			if (!ringExists) {
				rings.push(ringFound[1]);
			}
		}
	}

	return rings;
};

StreetHarmonyManager.prototype.checkHarmoniesAcrossAllMidlinesForPlayer = function(playerName) {
	var crossesNorth = false;
	var crossesEast = false;
	var crossesSouth = false;
	var crossesWest = false;

	for (var i = 0; i < this.harmonies.length; i++) {
		var harmony = this.harmonies[i];

		if (harmony.ownerName === playerName) {
			var t1 = harmony.tile1;
			var p1 = harmony.tile1Pos.getNotationPoint();
			var t2 = harmony.tile2;
			var p2 = harmony.tile2Pos.getNotationPoint();

			/* Check West */
			if (p1.x < 0 && p2.x === p1.x) {
				crossesWest = true;
			}
			/* Check East */
			if (p1.x > 0 && p2.x === p1.x) {
				crossesEast = true;
			}
			/* Check South */
			if (p1.y < 0 && p2.y === p1.y) {
				crossesSouth = true;
			}
			/* Check North */
			if (p1.y > 0 && p2.y === p1.y) {
				crossesNorth = true;
			}
		}
	}

	return crossesNorth && crossesEast && crossesSouth && crossesWest;
};

StreetHarmonyManager.prototype.harmonyRingExists = function() {
	// // Chain of harmonies around the center of the board

	var self = this;

	// // var rings = [];
	// var rings = this.getHarmonyChains();

	var verifiedHarmonyRingOwners = [];
	// rings.forEach(function(ring) {
	// 	debug(ring);
	// 	var playerName = self.verifyHarmonyRing(ring);
	// 	if (playerName) {
	// 		verifiedHarmonyRingOwners.push(playerName);
	// 	}
	// });

	// // return verifiedHarmonyRings.length > 0;
	// return verifiedHarmonyRingOwners;

	/* --- */
	/* Harmonies across all midlines? */

	if (this.checkHarmoniesAcrossAllMidlinesForPlayer(HOST)) {
		verifiedHarmonyRingOwners.push(HOST);
	}

	if (this.checkHarmoniesAcrossAllMidlinesForPlayer(GUEST)) {
		verifiedHarmonyRingOwners.push(GUEST);
	}

	return verifiedHarmonyRingOwners;
	
	// TODO account for owner
};

// I think this works.
StreetHarmonyManager.prototype.verifyHarmonyRing = function(ring) {
	// Verify harmonies in ring go around center of board
	// debug("In verifyHarmonyRing()");

	// If completeHarmony rule, ring must contain harmonies of 3, 4, and 5 flower tiles
	if (completeHarmony && !this.ringContains345(ring)) {
		return false;
	}

	// We have to go through the harmonies and create an array of the points of the 'shape' that the harmony ring makes
	var shapePoints = [];

	var h = ring.pop();	// LOL
	var playerName = h.ownerName;
	shapePoints.push(new NotationPoint(h.tile1Pos.notationPointString).toArr());
	shapePoints.push(new NotationPoint(h.tile2Pos.notationPointString).toArr());

	var lastTilePos = h.tile2Pos;

	var count = 0;
	while (ring.length > 0 && count < 400) {
		// Go through ring and find next point in the harmony 'shape'
		for (var i = 0; i < ring.length; i++) {
			h = ring[i];
			if (h.containsTilePos(lastTilePos)) {
				lastTilePos = h.getPosThatIsNotThisOne(lastTilePos);
				var np = new NotationPoint(lastTilePos.notationPointString);
				if (!np.samesies(new NotationPoint(shapePoints[0][0] + "," + shapePoints[0][1]))) {
					shapePoints.push(np.toArr());
				}
				ring.splice(i, 1);
			}
		}
		count++;
		// debug("last tile Pos: " + lastTilePos.notationPointString);
		// ring.forEach(function(h){ debug(h.tile1Pos.notationPointString + " - " + h.tile2Pos.notationPointString); });
		// debug("-----")
	}

	if (count > 390) {
		debug("THERE WAS A PROBLEM CONNECTING THE DOTS");
		return false;
	}

	if (this.isCenterInsideShape(shapePoints)) {
		// debug("WINNER");
		return playerName;
	} else {
		return false;
	}
};


StreetHarmonyManager.prototype.ringsMatch = function(ring1, ring2) {
	// Must be same size to qualify as matching
	if (ring1.length !== ring2.length) {
		return false;
	}

	// They're the same length if we're here
	// Now, all harmonies must match 
	var h1Matches = false;
	ring1.forEach(function(h1) {
		h1Matches = false;
		ring2.forEach(function(h2) {
			if (h1.equals(h2)) {
				h1Matches = true;
			}
		});
		if (!h1Matches) {
			return false;
		}
	});

	return h1Matches;
};

StreetHarmonyManager.prototype.lookForRing = function(t1, tx, chain) {
	// Look for different harmony that includes t1
	for (var i = 0; i < this.harmonies.length; i++) {
		var hx = this.harmonies[i];
		if (hx.containsTile(t1) && hx.notAnyOfThese(chain)) {
			chain.push(hx);
			if (hx.containsTile(tx)) {
				return [true, chain];
			} else {
				var newStartTile = hx.getTileThatIsNotThisOne(t1);
				return this.lookForRing(newStartTile, tx, chain);
			}
		}
	}
	return [false];
};






