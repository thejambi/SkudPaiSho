// Capture Pai Sho Tile Manager

function CaptureTileManager() {
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

CaptureTileManager.prototype.loadTileSet = function(ownerCode) {
	var tiles = [];

	// 1 of each tile, in order
	tiles.push(new CaptureTile('A', ownerCode));
	tiles.push(new CaptureTile('V', ownerCode));
	tiles.push(new CaptureTile('B', ownerCode));
	tiles.push(new CaptureTile('P', ownerCode));
	tiles.push(new CaptureTile('F', ownerCode));
	tiles.push(new CaptureTile('U', ownerCode));
	tiles.push(new CaptureTile('K', ownerCode));
	tiles.push(new CaptureTile('L', ownerCode));
	tiles.push(new CaptureTile('D', ownerCode));
	tiles.push(new CaptureTile('M', ownerCode));
	tiles.push(new CaptureTile('T', ownerCode));
	tiles.push(new CaptureTile('O', ownerCode));

	return tiles;
};

CaptureTileManager.prototype.drawRandomTile = function() {
	if (this.tiles.length > 0) {
		var tile = this.tiles[Math.floor(Math.random()*this.tiles.length)];
		return this.peekTile(this.playerCode, tile.code);
	}
};

CaptureTileManager.prototype.grabTile = function(player, tileCode) {
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

CaptureTileManager.prototype.peekTile = function(player, tileCode, tileId) {
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

CaptureTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

CaptureTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

CaptureTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.push(tile);
};

CaptureTileManager.prototype.getCopy = function() {
	var copy = new CaptureTileManager();

	// copy this.hostTiles and this.guestTiles
	
	return copy;
};
