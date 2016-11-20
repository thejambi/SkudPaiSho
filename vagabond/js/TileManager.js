// Tile Manager

function TileManager() {
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

TileManager.prototype.loadTileSet = function(ownerCode) {
	var tiles = [];

	// 2 of each of these tiles
	for (var i = 0; i < 2; i++) {
		tiles.push(new Tile('S', ownerCode));
		tiles.push(new Tile('B', ownerCode));
		tiles.push(new Tile('W', ownerCode));
		tiles.push(new Tile('C', ownerCode));
	}

	// 1 of each of these tiles
	tiles.push(new Tile('L', ownerCode));
	tiles.push(new Tile('F', ownerCode));
	tiles.push(new Tile('D', ownerCode));

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
	
	return copy;
};
