// Tile Manager

function SolitaireTileManager(forActuating) {
	this.playerCode = 'H'
	
	if (forActuating) {
		this.tiles = this.loadOneOfEach(this.playerCode);
		return;
	}
	this.tiles = this.loadTileSet(this.playerCode);
}

SolitaireTileManager.prototype.loadTileSet = function(ownerCode) {
	return this.loadSolitaireSet(ownerCode, false, true);
};

SolitaireTileManager.prototype.loadSolitaireSet = function(ownerCode, doubleTiles, includeAccentTiles) {
	var tiles = [];

	var numAccentTiles = 2;
	var numBasicFlowerTiles = 3;

	var tileMultiplier = 1;
	if (gameOptionEnabled(OPTION_DOUBLE_TILES)) {
		tileMultiplier = 2;
		tiles.push(new SolitaireTile('L', ownerCode));
	}
	if (gameOptionEnabled(OPTION_INSANE_TILES)) {
		tileMultiplier = 4;
	}

	// Accent Tiles
	for (var i = 0; i < numAccentTiles * tileMultiplier; i++) {
		tiles.push(new SolitaireTile('R', ownerCode));
		tiles.push(new SolitaireTile('W', ownerCode));
		tiles.push(new SolitaireTile('K', ownerCode));
		tiles.push(new SolitaireTile('B', ownerCode));
	}

	// Basic flower tiles
	for (var i = 0; i < numBasicFlowerTiles * tileMultiplier; i++) {
		tiles.push(new SolitaireTile("R3", ownerCode));
		tiles.push(new SolitaireTile("R4", ownerCode));
		tiles.push(new SolitaireTile("R5", ownerCode));
		tiles.push(new SolitaireTile("W3", ownerCode));
		tiles.push(new SolitaireTile("W4", ownerCode));
		tiles.push(new SolitaireTile("W5", ownerCode));
	}

	// Special flower tiles
	for (var i = 0; i < tileMultiplier; i++) {
		tiles.push(new SolitaireTile('L', ownerCode));
		tiles.push(new SolitaireTile('O', ownerCode));
	}

	return tiles;
};

SolitaireTileManager.prototype.loadSkudSet = function(ownerCode) {
	var tiles = [];

	// 2 of each accent tile
	for (var i = 0; i < 2; i++) {
		tiles.push(new SolitaireTile('R', ownerCode));
		tiles.push(new SolitaireTile('W', ownerCode));
		tiles.push(new SolitaireTile('K', ownerCode));
		tiles.push(new SolitaireTile('B', ownerCode));
	}

	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	// 3 of each basic flower
	for (var i = 0; i < 3; i++) {
		tiles.push(new SolitaireTile("R3", ownerCode));
		tiles.push(new SolitaireTile("R4", ownerCode));
		tiles.push(new SolitaireTile("R5", ownerCode));
		tiles.push(new SolitaireTile("W3", ownerCode));
		tiles.push(new SolitaireTile("W4", ownerCode));
		tiles.push(new SolitaireTile("W5", ownerCode));
	}

	// 1 of each special flower
	tiles.push(new SolitaireTile('L', ownerCode));
	tiles.push(new SolitaireTile('O', ownerCode));

	return tiles;
};

SolitaireTileManager.prototype.loadSimpleCanonSet = function(ownerCode) {
	var tiles = [];

	// Accent tiles
	for (var i = 0; i < 2; i++) {
		tiles.push(new SolitaireTile('W', ownerCode));
	}

	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	// Basic flowers
	for (var i = 0; i < 6; i++) {
		tiles.push(new SolitaireTile("R3", ownerCode));
		tiles.push(new SolitaireTile("W5", ownerCode));
	}

	// Special flowers
	tiles.push(new SolitaireTile('L', ownerCode));
	tiles.push(new SolitaireTile('O', ownerCode));

	return tiles;
};

SolitaireTileManager.prototype.loadOneOfEach = function(ownerCode) {
	var tiles = [];

	tiles.push(new SolitaireTile('R', ownerCode));
	tiles.push(new SolitaireTile('W', ownerCode));
	tiles.push(new SolitaireTile('K', ownerCode));
	tiles.push(new SolitaireTile('B', ownerCode));

	tiles.push(new SolitaireTile("R3", ownerCode));
	tiles.push(new SolitaireTile("R4", ownerCode));
	tiles.push(new SolitaireTile("R5", ownerCode));
	tiles.push(new SolitaireTile("W3", ownerCode));
	tiles.push(new SolitaireTile("W4", ownerCode));
	tiles.push(new SolitaireTile("W5", ownerCode));

	tiles.push(new SolitaireTile('L', ownerCode));
	tiles.push(new SolitaireTile('O', ownerCode));

	return tiles;
};

// For Solitaire
SolitaireTileManager.prototype.drawRandomTile = function() {
	if (this.tiles.length > 0) {
		var tile = this.tiles[Math.floor(getRandomizer().random()*this.tiles.length)];
		return this.peekTile(this.playerCode, tile.code);
	}
};

SolitaireTileManager.prototype.grabTile = function(player, tileCode) {
	var tilePile = this.tiles;

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

SolitaireTileManager.prototype.peekTile = function(player, tileCode, tileId) {
	var tilePile = this.tiles;

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

SolitaireTileManager.prototype.removeSelectedTileFlags = function() {
	this.tiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.tiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

SolitaireTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.tiles;
	if (player === GUEST) {
		tilePile = this.tiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

SolitaireTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.tiles;
	if (player === GUEST) {
		tilePile = this.tiles;
	}

	tilePile.push(tile);
};

SolitaireTileManager.prototype.aPlayerIsOutOfTiles = function() {
	var guestHasTiles = this.tiles.length > 0;
	var hostHasTiles = guestHasTiles;

	return !hostHasTiles || !guestHasTiles;
};

SolitaireTileManager.prototype.getPlayerWithMoreAccentTiles = function() {
	var hostCount = 0;
	for (var i = 0; i < this.tiles.length; i++) {
		if (this.tiles[i].type === ACCENT_TILE) {
			hostCount++;
		}
	}

	var guestCount = 0;
	for (var i = 0; i < this.tiles.length; i++) {
		if (this.tiles[i].type === ACCENT_TILE) {
			guestCount++;
		}
	}

	if (hostCount > guestCount) {
		return HOST;
	} else if (guestCount > hostCount) {
		return GUEST;
	}
};

SolitaireTileManager.prototype.playerHasBothSpecialTilesRemaining = function(player) {
	var tilePile = this.tiles;
	if (player === GUEST) {
		tilePile = this.tiles;
	}

	var specialTileCount = 0;

	tilePile.forEach(function(tile) {
		if (tile.type === SPECIAL_FLOWER) {
			specialTileCount++;
		}
	});

	return specialTileCount > 1;
};

SolitaireTileManager.prototype.getCopy = function() {
	var copy = new SolitaireTileManager();

	// copy this.tiles and this.tiles
	copy.tiles = this.copyArr(this.tiles);
	copy.tiles = this.copyArr(this.tiles);
	
	return copy;
};

SolitaireTileManager.prototype.copyArr = function(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		copyArr.push(arr[i].getCopy());
	}
	return copyArr;
};
