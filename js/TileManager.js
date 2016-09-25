// Tile Manager

function TileManager() {
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

TileManager.prototype.loadTileSet = function(ownerCode) {
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

	// 2 of each accent tile 	JUST 1 FOR NOW
	for (var i = 0; i < 2; i++) {
		tiles.push(new Tile('R', ownerCode));
		tiles.push(new Tile('W', ownerCode));
		tiles.push(new Tile('K', ownerCode));
		tiles.push(new Tile('B', ownerCode));
	}

	// 1 of each special flower
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

TileManager.prototype.peekTile = function(player, tileCode) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	var tile;
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
		tile.selectedFromPile = false;;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

// TileManager.prototype.putTileBack = function(tile) {
// 	var player = tile.ownerName;
// 	var tilePile = this.hostTiles;
// 	if (player === GUEST) {
// 		tilePile = this.guestTiles;
// 	}

// 	tilePile.push(tile);
// };

