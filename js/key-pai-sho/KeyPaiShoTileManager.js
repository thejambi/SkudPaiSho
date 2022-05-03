/* Key Pai Sho Tile Manager */

KeyPaiSho.TileManager = function(forActuating) {
	if (forActuating) {
		this.hostTiles = this.loadOneOfEach('H');
		this.guestTiles = this.loadOneOfEach('G');
		return;
	}
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');

	/* Used to have 2 of each Ancient Oasis tile available, but now just one.
	This is to support old games if someone chose two of something. */
	this.additionalAncientOasisCount = 0;
}

KeyPaiSho.TileManager.prototype.loadTileSet = function(ownerCode) {
	var tiles = [];

	if (!gameOptionEnabled(NO_EFFECT_TILES)) {
		// 1 of each accent tile
		tiles.push(new KeyPaiSho.Tile('R', ownerCode));
		tiles.push(new KeyPaiSho.Tile('W', ownerCode));
		tiles.push(new KeyPaiSho.Tile('K', ownerCode));
		tiles.push(new KeyPaiSho.Tile('B', ownerCode));

		// 1 of each special flower
		tiles.push(new KeyPaiSho.Tile(KeyPaiSho.TileCodes.Lotus, ownerCode));
		tiles.push(new KeyPaiSho.Tile(KeyPaiSho.TileCodes.Orchid, ownerCode));

		tiles.forEach(function(tile) {
			tile.selectedFromPile = true;
		});
	}

	/* Keep the next line to test White Lotus */
	// tiles.push(new KeyPaiSho.Tile(KeyPaiSho.TileCodes.Lotus, ownerCode));

	// 3 of each basic flower
	for (var i = 0; i < 3; i++) {
		tiles.push(new KeyPaiSho.Tile("R3", ownerCode));
		tiles.push(new KeyPaiSho.Tile("R4", ownerCode));
		tiles.push(new KeyPaiSho.Tile("R5", ownerCode));
		tiles.push(new KeyPaiSho.Tile("W3", ownerCode));
		tiles.push(new KeyPaiSho.Tile("W4", ownerCode));
		tiles.push(new KeyPaiSho.Tile("W5", ownerCode));
	}

	return tiles;
};

KeyPaiSho.TileManager.prototype.loadSimpleCanonSet = function(ownerCode) {
	var tiles = [];

	// Accent tiles
	for (var i = 0; i < 2; i++) {
		tiles.push(new KeyPaiSho.Tile('W', ownerCode));
	}

	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	// Basic flowers
	for (var i = 0; i < 6; i++) {
		tiles.push(new KeyPaiSho.Tile("R3", ownerCode));
		tiles.push(new KeyPaiSho.Tile("W5", ownerCode));
	}

	// Special flowers
	tiles.push(new KeyPaiSho.Tile('L', ownerCode));
	tiles.push(new KeyPaiSho.Tile('O', ownerCode));

	return tiles;
};

KeyPaiSho.TileManager.prototype.loadOneOfEach = function(ownerCode) {
	var tiles = [];

	tiles.push(new KeyPaiSho.Tile('R', ownerCode));
	tiles.push(new KeyPaiSho.Tile('W', ownerCode));
	tiles.push(new KeyPaiSho.Tile('K', ownerCode));
	tiles.push(new KeyPaiSho.Tile('B', ownerCode));

	if (gameOptionEnabled(OPTION_ANCIENT_OASIS_EXPANSION)) {
		tiles.push(new KeyPaiSho.Tile('P', ownerCode));
		tiles.push(new KeyPaiSho.Tile('M', ownerCode));
		tiles.push(new KeyPaiSho.Tile('T', ownerCode));
	}

	tiles.push(new KeyPaiSho.Tile("R3", ownerCode));
	tiles.push(new KeyPaiSho.Tile("R4", ownerCode));
	tiles.push(new KeyPaiSho.Tile("R5", ownerCode));
	tiles.push(new KeyPaiSho.Tile("W3", ownerCode));
	tiles.push(new KeyPaiSho.Tile("W4", ownerCode));
	tiles.push(new KeyPaiSho.Tile("W5", ownerCode));

	tiles.push(new KeyPaiSho.Tile(KeyPaiSho.TileCodes.Lotus, ownerCode));
	tiles.push(new KeyPaiSho.Tile(KeyPaiSho.TileCodes.Orchid, ownerCode));

	return tiles;
};

KeyPaiSho.TileManager.prototype.grabTile = function(player, tileCode) {
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
		/* Secretly allow 3 additional Ancient Oasis tiles to be selected */
		if (this.additionalAncientOasisCount < 3) {
			var oasisTileCodes = ['M','P','T'];
			if (oasisTileCodes.includes(tileCode)) {
				this.additionalAncientOasisCount++;
				tile = new KeyPaiSho.Tile(tileCode, getPlayerCodeFromName(player));
			}
		}
	}

	return tile;
};

KeyPaiSho.TileManager.prototype.numberOfAccentTilesPerPlayerSet = function() {
	var tileSet = this.loadTileSet(hostPlayerCode);
	var accentTileCount = 0;
	for (var i = 0; i < tileSet.length; i++) {
		if (tileSet[i].type === ACCENT_TILE) {
			accentTileCount++;
		}
	}
	return accentTileCount;
};

KeyPaiSho.TileManager.prototype.peekTile = function(player, tileCode, tileId) {
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

KeyPaiSho.TileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

KeyPaiSho.TileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

KeyPaiSho.TileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.push(tile);
};

KeyPaiSho.TileManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
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

KeyPaiSho.TileManager.prototype.getPlayerWithMoreAccentTiles = function() {
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

KeyPaiSho.TileManager.prototype.playerHasBothSpecialTilesRemaining = function(player) {
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

KeyPaiSho.TileManager.prototype.getCopy = function() {
	var copy = new KeyPaiSho.TileManager();

	// copy this.hostTiles and this.guestTiles
	copy.hostTiles = copyArray(this.hostTiles);
	copy.guestTiles = copyArray(this.guestTiles);
	
	return copy;
};

