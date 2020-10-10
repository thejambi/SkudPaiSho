// Tile Manager

function OvergrowthTileManager(forActuating) {
	if (forActuating) {
		this.hostTiles = this.loadOneOfEach('H');
		this.guestTiles = this.loadOneOfEach('G');
	} else {
		this.hostTiles = this.loadTileSet('H');
		this.guestTiles = this.loadTileSet('G');
	}
}

OvergrowthTileManager.prototype.loadTileSet = function(ownerCode) {
	return this.loadPlayerTileSet(ownerCode, false, true);
};

OvergrowthTileManager.prototype.loadPlayerTileSet = function(ownerCode, doubleTiles, includeAccentTiles) {
	var tiles = [];

	var numAccentTiles = 1;
	var numBasicFlowerTiles = 2;

	if (gameOptionEnabled(LESS_TILES)) {
		numAccentTiles = 0;
		numBasicFlowerTiles = 1;
	}
	if (gameOptionEnabled(OPTION_FULL_TILES)) {
		numAccentTiles = 2;
		numBasicFlowerTiles = 3;
	}

	// Accent Tiles
	for (var i = 0; i < numAccentTiles; i++) {
		tiles.push(new OvergrowthTile('R', ownerCode));
		tiles.push(new OvergrowthTile('W', ownerCode));
		tiles.push(new OvergrowthTile('K', ownerCode));
		tiles.push(new OvergrowthTile('B', ownerCode));
	}

	// Basic flower tiles
	for (var i = 0; i < numBasicFlowerTiles; i++) {
		tiles.push(new OvergrowthTile("R3", ownerCode));
		tiles.push(new OvergrowthTile("R4", ownerCode));
		tiles.push(new OvergrowthTile("R5", ownerCode));
		tiles.push(new OvergrowthTile("W3", ownerCode));
		tiles.push(new OvergrowthTile("W4", ownerCode));
		tiles.push(new OvergrowthTile("W5", ownerCode));
	}

	// Special flower tiles
	tiles.push(new OvergrowthTile('L', ownerCode));
	tiles.push(new OvergrowthTile('O', ownerCode));

	if (ownerCode === hostPlayerCode && gameOptionEnabled(OPTION_FULL_TILES)) {
		tiles.push(new OvergrowthTile('R3', ownerCode)); /* The White Lotus opens wide to those who know her secrets. Iroh places a Rose tile in the middle of the board. */
	}

	return tiles;
};

OvergrowthTileManager.prototype.loadOneOfEach = function(ownerCode) {
	var tiles = [];

	var tileMultiplier = 1;
	if (gameOptionEnabled(OPTION_DOUBLE_TILES)) {
		tileMultiplier = 2;
		tiles.push(new OvergrowthTile('L', ownerCode));
	}
	if (gameOptionEnabled(OPTION_INSANE_TILES)) {
		tileMultiplier = 4;
	}

	for (var i = 0; i < tileMultiplier; i++) {
		tiles.push(new OvergrowthTile('R', ownerCode));
		tiles.push(new OvergrowthTile('W', ownerCode));
		tiles.push(new OvergrowthTile('K', ownerCode));
		tiles.push(new OvergrowthTile('B', ownerCode));

		tiles.push(new OvergrowthTile("R3", ownerCode));
		tiles.push(new OvergrowthTile("R4", ownerCode));
		tiles.push(new OvergrowthTile("R5", ownerCode));
		tiles.push(new OvergrowthTile("W3", ownerCode));
		tiles.push(new OvergrowthTile("W4", ownerCode));
		tiles.push(new OvergrowthTile("W5", ownerCode));

		tiles.push(new OvergrowthTile('L', ownerCode));
		tiles.push(new OvergrowthTile('O', ownerCode));
	}

	return tiles;
};

OvergrowthTileManager.prototype.noMoreTilesLeft = function() {
	return this.hostTiles.length === 0 && this.guestTiles.length === 0;
};

OvergrowthTileManager.prototype.getCopy = function() {
	var copy = new OvergrowthTileManager();

	copy.hostTiles = copyArray(this.hostTiles);
	copy.guestTiles = copyArray(this.guestTiles);
	
	return copy;
};

OvergrowthTileManager.prototype.grabTile = function(playerName, tileCode) {
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

OvergrowthTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.getTilePile(player);
	tilePile.push(tile);
};

OvergrowthTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

OvergrowthTileManager.prototype.peekTile = function(playerCode, tileCode, tileId) {
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

OvergrowthTileManager.prototype.drawRandomTile = function(playerName) {
	var tilePile = this.getTilePile(playerName);
	if (tilePile.length > 0) {
		var tile = tilePile[Math.floor(Math.random()*tilePile.length)];
		return this.peekTile(getPlayerCodeFromName(playerName), tile.code);
	}
};

OvergrowthTileManager.prototype.getTilePile = function(playerNameOrCode) {
	var tilePile = this.hostTiles;
	if (playerNameOrCode === GUEST || playerNameOrCode === guestPlayerCode) {
		tilePile = this.guestTiles;
	}
	return tilePile;
};
