// Tile Manager

Undergrowth.TileManager = function(forActuating) {
	if (forActuating) {
		this.hostTiles = this.loadOneOfEach('H');
		this.guestTiles = this.loadOneOfEach('G');
	} else {
		this.hostTiles = this.loadTileSet('H');
		this.guestTiles = this.loadTileSet('G');
	}
}

Undergrowth.TileManager.prototype.loadTileSet = function(ownerCode) {
	return this.loadPlayerTileSet(ownerCode, false, true);
};

Undergrowth.TileManager.prototype.loadOneOfEach = function(ownerCode) {
	var tiles = [];

	var simplicity = gameOptionEnabled(UNDERGROWTH_SIMPLE);

	tiles.push(new Undergrowth.Tile("R3", ownerCode, simplicity));
	tiles.push(new Undergrowth.Tile("R4", ownerCode, simplicity));
	tiles.push(new Undergrowth.Tile("R5", ownerCode, simplicity));
	tiles.push(new Undergrowth.Tile("W3", ownerCode, simplicity));
	tiles.push(new Undergrowth.Tile("W4", ownerCode, simplicity));
	tiles.push(new Undergrowth.Tile("W5", ownerCode, simplicity));

	tiles.push(new Undergrowth.Tile('L', ownerCode, simplicity));
	tiles.push(new Undergrowth.Tile('O', ownerCode, simplicity));

	return tiles;
};

Undergrowth.TileManager.prototype.loadPlayerTileSet = function(ownerCode) {
	var tiles = [];

	var simplicity = gameOptionEnabled(UNDERGROWTH_SIMPLE);
	// Basic flower tiles
	for (var i = 0; i < 3; i++) {
		tiles.push(new Undergrowth.Tile("R3", ownerCode, simplicity));
		tiles.push(new Undergrowth.Tile("R4", ownerCode, simplicity));
		tiles.push(new Undergrowth.Tile("R5", ownerCode, simplicity));
		tiles.push(new Undergrowth.Tile("W3", ownerCode, simplicity));
		tiles.push(new Undergrowth.Tile("W4", ownerCode, simplicity));
		tiles.push(new Undergrowth.Tile("W5", ownerCode, simplicity));
	}

	// Special flower tiles
	tiles.push(new Undergrowth.Tile('L', ownerCode, simplicity));
	tiles.push(new Undergrowth.Tile('O', ownerCode, simplicity));

	return tiles;
};

Undergrowth.TileManager.prototype.noMoreTilesLeft = function() {
	return this.hostTiles.length === 0 && this.guestTiles.length === 0;
};

Undergrowth.TileManager.prototype.aPlayerHasNoMoreTilesLeft = function() {
	return this.hostTiles.length === 0 || this.guestTiles.length === 0;
};

Undergrowth.TileManager.prototype.playerIsOutOfTiles = function(playerName) {
	return this.getTilePile(playerName).length === 0;
};

Undergrowth.TileManager.prototype.getCopy = function() {
	var copy = new Undergrowth.TileManager();

	copy.hostTiles = copyArray(this.hostTiles);
	copy.guestTiles = copyArray(this.guestTiles);
	
	return copy;
};

Undergrowth.TileManager.prototype.grabTile = function(playerName, tileCode) {
	var tilePile = this.getTilePile(playerName);

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

Undergrowth.TileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.getTilePile(player);
	tilePile.push(tile);
};

Undergrowth.TileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

Undergrowth.TileManager.prototype.peekTile = function(playerCode, tileCode, tileId) {
	var tilePile = this.getTilePile(playerCode);

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

Undergrowth.TileManager.prototype.getTilePile = function(playerNameOrCode) {
	var tilePile = this.hostTiles;
	if (playerNameOrCode === GUEST || playerNameOrCode === guestPlayerCode) {
		tilePile = this.guestTiles;
	}
	return tilePile;
};
