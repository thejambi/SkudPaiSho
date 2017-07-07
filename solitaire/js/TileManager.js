// Tile Manager

function TileManager(forActuating) {
	this.playerCode = 'H'
	
	if (forActuating) {
		this.tiles = this.loadOneOfEach(this.playerCode);
		return;
	}
	this.tiles = this.loadTileSet(this.playerCode);
}

TileManager.prototype.loadTileSet = function(ownerCode) {
	return this.loadSolitaireSet(ownerCode);
};

TileManager.prototype.loadSolitaireSet = function(ownerCode) {
	var tiles = [];

	// 3 of each basic flower
	for (var i = 0; i < 3; i++) {
		tiles.push(new Tile("R3", ownerCode));
		tiles.push(new Tile("R4", ownerCode));
		tiles.push(new Tile("R5", ownerCode));
		tiles.push(new Tile("W3", ownerCode));
		tiles.push(new Tile("W4", ownerCode));
		tiles.push(new Tile("W5", ownerCode));
	}

	// 1 of each special flower
	tiles.push(new Tile('L', ownerCode));
	tiles.push(new Tile('O', ownerCode));

	return tiles;
};

TileManager.prototype.loadSkudSet = function(ownerCode) {
	var tiles = [];

	// 2 of each accent tile
	for (var i = 0; i < 2; i++) {
		tiles.push(new Tile('R', ownerCode));
		tiles.push(new Tile('W', ownerCode));
		tiles.push(new Tile('K', ownerCode));
		tiles.push(new Tile('B', ownerCode));
	}

	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	// 3 of each basic flower
	for (var i = 0; i < 3; i++) {
		tiles.push(new Tile("R3", ownerCode));
		tiles.push(new Tile("R4", ownerCode));
		tiles.push(new Tile("R5", ownerCode));
		tiles.push(new Tile("W3", ownerCode));
		tiles.push(new Tile("W4", ownerCode));
		tiles.push(new Tile("W5", ownerCode));
	}

	// 1 of each special flower
	tiles.push(new Tile('L', ownerCode));
	tiles.push(new Tile('O', ownerCode));

	return tiles;
};

TileManager.prototype.loadSimpleCanonSet = function(ownerCode) {
	var tiles = [];

	// Accent tiles
	for (var i = 0; i < 2; i++) {
		tiles.push(new Tile('W', ownerCode));
	}

	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	// Basic flowers
	for (var i = 0; i < 6; i++) {
		tiles.push(new Tile("R3", ownerCode));
		tiles.push(new Tile("W5", ownerCode));
	}

	// Special flowers
	tiles.push(new Tile('L', ownerCode));
	tiles.push(new Tile('O', ownerCode));

	return tiles;
};

TileManager.prototype.loadOneOfEach = function(ownerCode) {
	var tiles = [];

	tiles.push(new Tile('R', ownerCode));
	tiles.push(new Tile('W', ownerCode));
	tiles.push(new Tile('K', ownerCode));
	tiles.push(new Tile('B', ownerCode));

	tiles.push(new Tile("R3", ownerCode));
	tiles.push(new Tile("R4", ownerCode));
	tiles.push(new Tile("R5", ownerCode));
	tiles.push(new Tile("W3", ownerCode));
	tiles.push(new Tile("W4", ownerCode));
	tiles.push(new Tile("W5", ownerCode));

	tiles.push(new Tile('L', ownerCode));
	tiles.push(new Tile('O', ownerCode));

	return tiles;
};

// For Solitaire
TileManager.prototype.drawRandomTile = function() {
	var tile = this.tiles[Math.floor(Math.random()*this.tiles.length)];
	return this.peekTile(this.playerCode, tile.code);
};

TileManager.prototype.grabTile = function(player, tileCode) {
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

TileManager.prototype.peekTile = function(player, tileCode, tileId) {
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

TileManager.prototype.removeSelectedTileFlags = function() {
	this.tiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.tiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

TileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.tiles;
	if (player === GUEST) {
		tilePile = this.tiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

TileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.tiles;
	if (player === GUEST) {
		tilePile = this.tiles;
	}

	tilePile.push(tile);
};

TileManager.prototype.aPlayerIsOutOfTiles = function() {
	var guestHasTiles = this.tiles.length > 0;
	var hostHasTiles = guestHasTiles;

	return !hostHasTiles || !guestHasTiles;
};

TileManager.prototype.getPlayerWithMoreAccentTiles = function() {
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

TileManager.prototype.playerHasBothSpecialTilesRemaining = function(player) {
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

TileManager.prototype.getCopy = function() {
	var copy = new TileManager();

	// copy this.tiles and this.tiles
	copy.tiles = this.copyArr(this.tiles);
	copy.tiles = this.copyArr(this.tiles);
	
	return copy;
};

TileManager.prototype.copyArr = function(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		copyArr.push(arr[i].getCopy());
	}
	return copyArr;
};
