/* Skud Pai Sho Tile Manager */

function FirePaiShoTileManager(forActuating) {
	if (forActuating) {
		this.hostTiles = this.loadOneOfEach('H');
		this.guestTiles = this.loadOneOfEach('G');
		return;
	}
	this.hostLibraryTiles = this.loadLibrary('H');
	this.guestLibraryTiles = this.loadLibrary('G');
	this.hostReserveTiles = this.loadReserve('H');
	this.guestReserveTiles = this.loadReserve('G');

	/* Used to have 2 of each Ancient Oasis tile available, but now just one.
	This is to support old games if someone chose two of something. */
	this.additionalAncientOasisCount = 0;

	this.currentlyDrawnReserve = null;
}
FirePaiShoTileManager.prototype.loadLibrary = function(ownerCode) {
	var tiles = [];

	// 1 of each basic flower
	tiles.push(new FirePaiShoTile("R3", ownerCode));
	tiles.push(new FirePaiShoTile("R4", ownerCode));
	tiles.push(new FirePaiShoTile("R5", ownerCode));
	tiles.push(new FirePaiShoTile("W3", ownerCode));
	tiles.push(new FirePaiShoTile("W4", ownerCode));
	tiles.push(new FirePaiShoTile("W5", ownerCode));

	// 1 of each special flower
	tiles.push(new FirePaiShoTile('L', ownerCode));
	tiles.push(new FirePaiShoTile('O', ownerCode));

	return tiles;
}

FirePaiShoTileManager.prototype.doubleAccentTiles = function() {
	
	this.hostReserveTiles.push(new FirePaiShoTile('R', 'H'));
	this.hostReserveTiles.push(new FirePaiShoTile('W', 'H'));
	this.hostReserveTiles.push(new FirePaiShoTile('K', 'H'));
	this.hostReserveTiles.push(new FirePaiShoTile('B', 'H'));

	this.guestReserveTiles.push(new FirePaiShoTile('R', 'G'));
	this.guestReserveTiles.push(new FirePaiShoTile('W', 'G'));
	this.guestReserveTiles.push(new FirePaiShoTile('K', 'G'));
	this.guestReserveTiles.push(new FirePaiShoTile('B', 'G'));
}



FirePaiShoTileManager.prototype.loadReserve = function(ownerCode) {
	var tiles = [];

	// 1 of each basic flower
	tiles.push(new FirePaiShoTile("R3", ownerCode));
	tiles.push(new FirePaiShoTile("R4", ownerCode));
	tiles.push(new FirePaiShoTile("R5", ownerCode));
	tiles.push(new FirePaiShoTile("W3", ownerCode));
	tiles.push(new FirePaiShoTile("W4", ownerCode));
	tiles.push(new FirePaiShoTile("W5", ownerCode));

	var double = false;
	if (gameOptionEnabled(OPTION_DOUBLE_ACCENT_TILES)){
		double = true;
	}

	//1 of each accent
	tiles.push(new FirePaiShoTile('R', ownerCode));
	if (double) {tiles.push(new FirePaiShoTile('R', ownerCode));}
	tiles.push(new FirePaiShoTile('W', ownerCode));
	if (double) {tiles.push(new FirePaiShoTile('W', ownerCode));}
	tiles.push(new FirePaiShoTile('K', ownerCode));
	if (double) {tiles.push(new FirePaiShoTile('K', ownerCode));}
	tiles.push(new FirePaiShoTile('B', ownerCode));
	if (double) {tiles.push(new FirePaiShoTile('B', ownerCode));}

	return tiles;

}

/** OLD SKUD LOADING
FirePaiShoTileManager.prototype.loadTileSet = function(ownerCode) {
	if (simpleCanonRules) {
		return this.loadSimpleCanonSet(ownerCode);
	} else {
		return this.loadSkudSet(ownerCode);
	}
};
*/



FirePaiShoTileManager.prototype.loadSkudSet = function(ownerCode) {
	var tiles = [];

	// 2 of each accent tile
	for (var i = 0; i < 2; i++) {
		tiles.push(new FirePaiShoTile('R', ownerCode));
		tiles.push(new FirePaiShoTile('W', ownerCode));
		tiles.push(new FirePaiShoTile('K', ownerCode));
		tiles.push(new FirePaiShoTile('B', ownerCode));
	}

	/* 1 of each Ancient Oasis Accent Tile if expansion enabled */
	if (gameOptionEnabled(OPTION_ANCIENT_OASIS_EXPANSION)) {
		tiles.push(new FirePaiShoTile('P', ownerCode));
		tiles.push(new FirePaiShoTile('M', ownerCode));
		tiles.push(new FirePaiShoTile('T', ownerCode));
	}

	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	// 3 of each basic flower
	for (var i = 0; i < 3; i++) {
		tiles.push(new FirePaiShoTile("R3", ownerCode));
		tiles.push(new FirePaiShoTile("R4", ownerCode));
		tiles.push(new FirePaiShoTile("R5", ownerCode));
		tiles.push(new FirePaiShoTile("W3", ownerCode));
		tiles.push(new FirePaiShoTile("W4", ownerCode));
		tiles.push(new FirePaiShoTile("W5", ownerCode));
	}

	// 1 of each special flower
	tiles.push(new FirePaiShoTile('L', ownerCode));
	tiles.push(new FirePaiShoTile('O', ownerCode));

	return tiles;
};

FirePaiShoTileManager.prototype.loadSimpleCanonSet = function(ownerCode) {
	var tiles = [];

	// Accent tiles
	for (var i = 0; i < 2; i++) {
		tiles.push(new FirePaiShoTile('W', ownerCode));
	}

	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	// Basic flowers
	for (var i = 0; i < 6; i++) {
		tiles.push(new FirePaiShoTile("R3", ownerCode));
		tiles.push(new FirePaiShoTile("W5", ownerCode));
	}

	// Special flowers
	tiles.push(new FirePaiShoTile('L', ownerCode));
	tiles.push(new FirePaiShoTile('O', ownerCode));

	return tiles;
};

FirePaiShoTileManager.prototype.loadOneOfEach = function(ownerCode) {
	var tiles = [];

	tiles.push(new FirePaiShoTile('R', ownerCode));
	tiles.push(new FirePaiShoTile('W', ownerCode));
	tiles.push(new FirePaiShoTile('K', ownerCode));
	tiles.push(new FirePaiShoTile('B', ownerCode));

	if (gameOptionEnabled(OPTION_ANCIENT_OASIS_EXPANSION)) {
		tiles.push(new FirePaiShoTile('P', ownerCode));
		tiles.push(new FirePaiShoTile('M', ownerCode));
		tiles.push(new FirePaiShoTile('T', ownerCode));
	}

	tiles.push(new FirePaiShoTile("R3", ownerCode));
	tiles.push(new FirePaiShoTile("R4", ownerCode));
	tiles.push(new FirePaiShoTile("R5", ownerCode));
	tiles.push(new FirePaiShoTile("W3", ownerCode));
	tiles.push(new FirePaiShoTile("W4", ownerCode));
	tiles.push(new FirePaiShoTile("W5", ownerCode));

	tiles.push(new FirePaiShoTile('L', ownerCode));
	tiles.push(new FirePaiShoTile('O', ownerCode));

	return tiles;
};

FirePaiShoTileManager.prototype.grabTile = function(player, tileCode, bonus) {
		
	var tilePile;
	if (!bonus) {
		tilePile = this.hostLibraryTiles;
		if (player === GUEST) {
			tilePile = this.guestLibraryTiles;
		}
	} else {
		tilePile = this.hostReserveTiles;
		if (player === GUEST) {
			tilePile = this.guestReserveTiles;
		}
	}

	var tile;
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].code === tileCode) {
			newTileArr = tilePile.splice(i, 1);
			tile = newTileArr[0];
			break;
		}
	}

	if (!tile) {
		//console.log("NONE OF THAT TILE FOUND");
	/** Forget ancient oasis stuff 
		// Secretly allow 3 additional Ancient Oasis tiles to be selected 
		if (this.additionalAncientOasisCount < 3) {
			var oasisTileCodes = ['M','P','T'];
			if (oasisTileCodes.includes(tileCode)) {
				this.additionalAncientOasisCount++;
				tile = new FirePaiShoTile(tileCode, getPlayerCodeFromName(player));
			}
		}
		**/
	}

	return tile;
};

FirePaiShoTileManager.prototype.numberOfAccentTilesPerPlayerSet = function() {
	var tileSet = this.loadSkudSet(hostPlayerCode);
	var accentTileCount = 0;
	for (var i = 0; i < tileSet.length; i++) {
		if (tileSet[i].type === ACCENT_TILE) {
			accentTileCount++;
		}
	}
	return accentTileCount;
};

FirePaiShoTileManager.prototype.peekTile = function(player, tileCode, tileId, bonus) {
	//console.log("Okay, for realzies peeeking at the tile: " + player + tileCode);
	var tilePile;
	if (!bonus) {
		tilePile = this.hostLibraryTiles;
		if (player === GUEST) {
			tilePile = this.guestLibraryTiles;
		}
	} else {
		tilePile = this.hostReserveTiles;
		if (player === GUEST) {
			tilePile = this.guestReserveTiles;
		}
	}

	var tile;
	if (tileId) {
		for (var i = 0; i < tilePile.length; i++) {
			if (tilePile[i].id === tileId) {
				return tilePile[i];
			}
		}
	}

	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].code === tileCode) {
			tile = tilePile[i];
			break;
		}
	}

	if (!tile) {
		//console.log("NONE OF THAT TILE FOUND");
	}

	return tile;
};

FirePaiShoTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostLibraryTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestLibraryTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

FirePaiShoTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostLibraryTiles;
	if (player === GUEST) {
		tilePile = this.guestLibraryTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

FirePaiShoTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.hostLibraryTiles;
	if (player === GUEST) {
		tilePile = this.guestLibraryTiles;
	}

	tilePile.push(tile);
};

//TK CHANGE THIS SO IT CHECKS FOR BEING OUT OF RESERVE TILES
FirePaiShoTileManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	// Check Host
	var hostHasBasic = false;
	for (var i = 0; i < this.hostLibraryTiles.length; i++) {
		if (this.hostLibraryTiles[i].type === BASIC_FLOWER) {
			hostHasBasic = true;
			break;
		}
	}

	var guestHasBasic = false;
	for (var i = 0; i < this.guestLibraryTiles.length; i++) {
		if (this.guestLibraryTiles[i].type === BASIC_FLOWER) {
			guestHasBasic = true;
			break;
		}
	}

	if (!hostHasBasic && guestHasBasic) {
		return HOST;
	} else if (!guestHasBasic && hostHasBasic) {
		return GUEST;
	} else if (!guestHasBasic && !hostHasBasic) {
		return "BOTH PLAYERS";
	}
};

FirePaiShoTileManager.prototype.aPlayerIsOutOfReserveTiles = function() {
	var hostHasReserve = false;
	var guestHasReserve = false;
	//console.log("host reserve tile arraay length: " + this.hostReserveTiles.length);
	//console.log("guest reserve tile array length: " + this.guestReserveTiles.length);
	if (this.hostReserveTiles.length > 0) {
		hostHasReserve = true;
	}
	
	if (this.guestReserveTiles.length > 0) {
		guestHasReserve = true;
	}
	
	if (!hostHasReserve && guestHasReserve) {
		return HOST;
	} else if (!guestHasReserve && hostHasReserve) {
		return GUEST;
	} else if (!guestHasReserve && !hostHasReserve) {
		return "BOTH PLAYERS";
	}
};

FirePaiShoTileManager.prototype.getPlayerWithMoreAccentTiles = function() {
	var hostCount = 0;
	for (var i = 0; i < this.hostLibraryTiles.length; i++) {
		if (this.hostLibraryTiles[i].type === ACCENT_TILE) {
			hostCount++;
		}
	}

	var guestCount = 0;
	for (var i = 0; i < this.guestTiles.length; i++) {
		if (this.guestTiles[i].type === ACCENT_TILE) {
			guestCount++;
		}
	}

	if (hostCount > guestCount) {
		return HOST;
	} else if (guestCount > hostCount) {
		return GUEST;
	}
};

FirePaiShoTileManager.prototype.playerHasBothSpecialTilesRemaining = function(player) {
	var tilePile = this.hostLibraryTiles;
	if (player === GUEST) {
		tilePile = this.guestLibraryTiles;
	}

	var specialTileCount = 0;

	tilePile.forEach(function(tile) {
		if (tile.type === SPECIAL_FLOWER) {
			specialTileCount++;
		}
	});

	return specialTileCount > 1;
};

FirePaiShoTileManager.prototype.getCopy = function() {
	var copy = new FirePaiShoTileManager();

	// copy this.hostTiles and this.guestTiles
	copy.hostLibraryTiles = copyArray(this.hostLibraryTiles);
	copy.guestLibraryTiles = copyArray(this.guestLibraryTiles);
	copy.hostReserveTiles = copyArray(this.hostReserveTiles);
	copy.guestReserveTiles = copyArray(this.guestReserveTiles);
	
	return copy;
};

FirePaiShoTileManager.prototype.drawReserveTile = function(playerName) {
	//console.log("About to draw a random tile from the pile of " + playerName);
	var tilePile = this.getReservePile(playerName);
	if (tilePile.length > 0) {
		var tile = tilePile[Math.floor(getRandomizer().random()*tilePile.length)];
		tile = this.peekTile(playerName, tile.code, this.tileId, true);
		this.currentlyDrawnReserve = tile;
		return tile;
	}
};

FirePaiShoTileManager.prototype.clearDrawnReserveTile = function() {
	this.currentlyDrawnReserve = null;

};

FirePaiShoTileManager.prototype.getReservePile = function(playerNameOrCode) {
	var tilePile = this.hostReserveTiles;
	if (playerNameOrCode === GUEST || playerNameOrCode === guestPlayerCode) {
		tilePile = this.guestReserveTiles;
		//console.log("The tile pile I am actually grabbing is the totally the guest pile.");
	} else {
		//console.log("The tile pile I am actually grabbing is the host reserve.");
	}
	return tilePile;
};

