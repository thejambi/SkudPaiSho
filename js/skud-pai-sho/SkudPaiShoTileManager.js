/* Skud Pai Sho Tile Manager */

function SkudPaiShoTileManager(forActuating) {
	if (forActuating) {
		this.hostTiles = this.loadOneOfEach('H');
		this.guestTiles = this.loadOneOfEach('G');
		return;
	}
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

SkudPaiShoTileManager.prototype.loadTileSet = function(ownerCode) {
	if (simpleCanonRules) {
		return this.loadSimpleCanonSet(ownerCode);
	} else {
		return this.loadSkudSet(ownerCode);
	}
};

SkudPaiShoTileManager.prototype.loadSkudSet = function(ownerCode) {
	var tiles = [];

	// 2 of each accent tile
	for (var i = 0; i < 2; i++) {
		tiles.push(new SkudPaiShoTile('R', ownerCode));
		tiles.push(new SkudPaiShoTile('W', ownerCode));
		tiles.push(new SkudPaiShoTile('K', ownerCode));
		tiles.push(new SkudPaiShoTile('B', ownerCode));
	}

	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	// 3 of each basic flower
	for (var i = 0; i < 3; i++) {
		tiles.push(new SkudPaiShoTile("R3", ownerCode));
		tiles.push(new SkudPaiShoTile("R4", ownerCode));
		tiles.push(new SkudPaiShoTile("R5", ownerCode));
		tiles.push(new SkudPaiShoTile("W3", ownerCode));
		tiles.push(new SkudPaiShoTile("W4", ownerCode));
		tiles.push(new SkudPaiShoTile("W5", ownerCode));
	}

	// 1 of each special flower
	tiles.push(new SkudPaiShoTile('L', ownerCode));
	tiles.push(new SkudPaiShoTile('O', ownerCode));

	return tiles;
};

SkudPaiShoTileManager.prototype.loadSimpleCanonSet = function(ownerCode) {
	var tiles = [];

	// Accent tiles
	for (var i = 0; i < 2; i++) {
		tiles.push(new SkudPaiShoTile('W', ownerCode));
	}

	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	// Basic flowers
	for (var i = 0; i < 6; i++) {
		tiles.push(new SkudPaiShoTile("R3", ownerCode));
		tiles.push(new SkudPaiShoTile("W5", ownerCode));
	}

	// Special flowers
	tiles.push(new SkudPaiShoTile('L', ownerCode));
	tiles.push(new SkudPaiShoTile('O', ownerCode));

	return tiles;
};

SkudPaiShoTileManager.prototype.loadOneOfEach = function(ownerCode) {
	var tiles = [];

	tiles.push(new SkudPaiShoTile('R', ownerCode));
	tiles.push(new SkudPaiShoTile('W', ownerCode));
	tiles.push(new SkudPaiShoTile('K', ownerCode));
	tiles.push(new SkudPaiShoTile('B', ownerCode));

	tiles.push(new SkudPaiShoTile("R3", ownerCode));
	tiles.push(new SkudPaiShoTile("R4", ownerCode));
	tiles.push(new SkudPaiShoTile("R5", ownerCode));
	tiles.push(new SkudPaiShoTile("W3", ownerCode));
	tiles.push(new SkudPaiShoTile("W4", ownerCode));
	tiles.push(new SkudPaiShoTile("W5", ownerCode));

	tiles.push(new SkudPaiShoTile('L', ownerCode));
	tiles.push(new SkudPaiShoTile('O', ownerCode));

	return tiles;
};

SkudPaiShoTileManager.prototype.grabTile = function(player, tileCode) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
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
		debug("NONE OF THAT TILE FOUND");
	}

	return tile;
};

SkudPaiShoTileManager.prototype.peekTile = function(player, tileCode, tileId) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
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
		debug("NONE OF THAT TILE FOUND");
	}

	return tile;
};

SkudPaiShoTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

SkudPaiShoTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

// SkudPaiShoTileManager.prototype.putTileBack = function(tile) {
// 	var player = tile.ownerName;
// 	var tilePile = this.hostTiles;
// 	if (player === GUEST) {
// 		tilePile = this.guestTiles;
// 	}

// 	tilePile.push(tile);
// };

SkudPaiShoTileManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	// Check Host
	var hostHasBasic = false;
	for (var i = 0; i < this.hostTiles.length; i++) {
		if (this.hostTiles[i].type === BASIC_FLOWER) {
			hostHasBasic = true;
			break;
		}
	}

	var guestHasBasic = false;
	for (var i = 0; i < this.guestTiles.length; i++) {
		if (this.guestTiles[i].type === BASIC_FLOWER) {
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

SkudPaiShoTileManager.prototype.getPlayerWithMoreAccentTiles = function() {
	var hostCount = 0;
	for (var i = 0; i < this.hostTiles.length; i++) {
		if (this.hostTiles[i].type === ACCENT_TILE) {
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

SkudPaiShoTileManager.prototype.playerHasBothSpecialTilesRemaining = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	var specialTileCount = 0;

	tilePile.forEach(function(tile) {
		if (tile.type === SPECIAL_FLOWER) {
			specialTileCount++;
		}
	});

	return specialTileCount > 1;
};

SkudPaiShoTileManager.prototype.getCopy = function() {
	var copy = new SkudPaiShoTileManager();

	// copy this.hostTiles and this.guestTiles
	copy.hostTiles = this.copyArr(this.hostTiles);
	copy.guestTiles = this.copyArr(this.guestTiles);
	
	return copy;
};

SkudPaiShoTileManager.prototype.copyArr = function(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		copyArr.push(arr[i].getCopy());
	}
	return copyArr;
};
