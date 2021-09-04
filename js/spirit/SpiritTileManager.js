// Spirit Pai Sho Tile Manager

function SpiritTileManager() {
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

SpiritTileManager.prototype.loadTileSet = function(ownerCode) {
	var tiles = [];

	// 1 of each tile, in order
	tiles.push(new SpiritTile('Raava', ownerCode));
	tiles.push(new SpiritTile('WanShiTong', ownerCode));
	tiles.push(new SpiritTile('La', ownerCode));
	tiles.push(new SpiritTile('MotherOfFaces', ownerCode));
	tiles.push(new SpiritTile('Vaatu', ownerCode));
	tiles.push(new SpiritTile('HeiBai', ownerCode));
	tiles.push(new SpiritTile('Tui', ownerCode));
	tiles.push(new SpiritTile('Koh', ownerCode));

	return tiles;
};

SpiritTileManager.prototype.drawRandomTile = function() {
	if (this.tiles.length > 0) {
		var tile = this.tiles[Math.floor(Math.random()*this.tiles.length)];
		return this.peekTile(this.playerCode, tile.code);
	}
};

SpiritTileManager.prototype.grabTile = function(player, tileCode) {
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

SpiritTileManager.prototype.peekTile = function(player, tileCode, tileId) {
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

SpiritTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

SpiritTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

SpiritTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.push(tile);
};

SpiritTileManager.prototype.getCopy = function() {
	var copy = new SpiritTileManager();

	// copy this.hostTiles and this.guestTiles
	
	return copy;
};
