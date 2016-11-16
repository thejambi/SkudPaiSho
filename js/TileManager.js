// Tile Manager

function TileManager(forActuating) {
	if (forActuating) {
		this.hostTiles = this.loadOneOfEach('H');
		this.guestTiles = this.loadOneOfEach('G');
		return;
	}
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

TileManager.prototype.loadTileSet = function(ownerCode) {
	if (simpleCanonRules) {
		return this.loadSimpleCanonSet(ownerCode);
	} else {
		return this.loadSkudSet(ownerCode);
	}
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

TileManager.prototype.grabTile = function(player, tileCode) {
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

TileManager.prototype.peekTile = function(player, tileCode, tileId) {
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

TileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

TileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

// TileManager.prototype.putTileBack = function(tile) {
// 	var player = tile.ownerName;
// 	var tilePile = this.hostTiles;
// 	if (player === GUEST) {
// 		tilePile = this.guestTiles;
// 	}

// 	tilePile.push(tile);
// };

TileManager.prototype.getCopy = function() {
	var copy = new TileManager();

	// copy this.hostTiles and this.guestTiles
	copy.hostTiles = this.copyArr(this.hostTiles);
	copy.guestTiles = this.copyArr(this.guestTiles);
	
	return copy;
};

TileManager.prototype.copyArr = function(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		copyArr.push(arr[i].getCopy());
	}
	return copyArr;
};
