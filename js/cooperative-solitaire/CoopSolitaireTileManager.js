// Tile Manager

function CoopSolitaireTileManager(forActuating) {
	this.playerCode = 'H'
	
	if (forActuating) {
		this.tiles = this.loadOneOfEach(this.playerCode);
		return;
	}
	this.tiles = this.loadTileSet(this.playerCode);
}

CoopSolitaireTileManager.prototype.loadTileSet = function(ownerCode) {
	return this.loadSolitaireSet(ownerCode, false, true);
};

CoopSolitaireTileManager.prototype.loadSolitaireSet = function(ownerCode, doubleTiles, includeAccentTiles) {
	var tiles = [];

	// Double amount of tiles if doubleTiles enabled
	var multiplier = 1;
	if (doubleTiles) {
		multiplier = 2;
	}

	if (includeAccentTiles) {
		// 2 of each accent tile
		for (var i = 0; i < 2 * multiplier; i++) {
			tiles.push(new SolitaireTile('R', ownerCode));
			tiles.push(new SolitaireTile('W', ownerCode));
			tiles.push(new SolitaireTile('K', ownerCode));
			tiles.push(new SolitaireTile('B', ownerCode));
		}
	}

	// 3 of each basic flower
	for (var i = 0; i < 3 * multiplier; i++) {
		tiles.push(new SolitaireTile("R3", ownerCode));
		tiles.push(new SolitaireTile("R4", ownerCode));
		tiles.push(new SolitaireTile("R5", ownerCode));
		tiles.push(new SolitaireTile("W3", ownerCode));
		tiles.push(new SolitaireTile("W4", ownerCode));
		tiles.push(new SolitaireTile("W5", ownerCode));
	}

	// 1 of each special flower
	for (var i = 0; i < 1 * multiplier; i++) {
		tiles.push(new SolitaireTile('L', ownerCode));
		tiles.push(new SolitaireTile('O', ownerCode));
	}

	// 1 extra White Lotus so White Lotus Gambit is possible
	if (doubleTiles) {
		tiles.push(new SolitaireTile('L', ownerCode));
	}

	return tiles;
};

CoopSolitaireTileManager.prototype.loadSkudSet = function(ownerCode) {
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

CoopSolitaireTileManager.prototype.loadSimpleCanonSet = function(ownerCode) {
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

CoopSolitaireTileManager.prototype.loadOneOfEach = function(ownerCode) {
	var tiles = [];

	var tileMultiplier = 1;
	if (ggOptions.includes(OPTION_DOUBLE_TILES)) {
		tileMultiplier = 2;
		tiles.push(new SolitaireTile('L', ownerCode));
	}
	if (ggOptions.includes(OPTION_INSANE_TILES)) {
		tileMultiplier = 4;
	}

	for (var i = 0; i < tileMultiplier; i++) {
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
	}

	return tiles;
};

// For Solitaire
CoopSolitaireTileManager.prototype.drawRandomTile = function() {
	if (this.tiles.length > 0) {
		var tile = this.tiles[Math.floor(Math.random()*this.tiles.length)];
		return this.peekTile(this.playerCode, tile.code);
	}
};

CoopSolitaireTileManager.prototype.grabTile = function(player, tileCode) {
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

CoopSolitaireTileManager.prototype.peekTile = function(player, tileCode, tileId) {
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

CoopSolitaireTileManager.prototype.removeSelectedTileFlags = function() {
	this.tiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.tiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

CoopSolitaireTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.tiles;
	if (player === GUEST) {
		tilePile = this.tiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

CoopSolitaireTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.tiles;
	if (player === GUEST) {
		tilePile = this.tiles;
	}

	tilePile.push(tile);
};

CoopSolitaireTileManager.prototype.aPlayerIsOutOfTiles = function() {
	var guestHasTiles = this.tiles.length > 0;
	var hostHasTiles = guestHasTiles;

	return !hostHasTiles || !guestHasTiles;
};

CoopSolitaireTileManager.prototype.getPlayerWithMoreAccentTiles = function() {
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

CoopSolitaireTileManager.prototype.playerHasBothSpecialTilesRemaining = function(player) {
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

CoopSolitaireTileManager.prototype.getCopy = function() {
	var copy = new CoopSolitaireTileManager();

	// copy this.tiles and this.tiles
	copy.tiles = this.copyArr(this.tiles);
	copy.tiles = this.copyArr(this.tiles);
	
	return copy;
};

CoopSolitaireTileManager.prototype.copyArr = function(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		copyArr.push(arr[i].getCopy());
	}
	return copyArr;
};
