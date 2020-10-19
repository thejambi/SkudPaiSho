/* Adevar Pai Sho Tile Manager */

function AdevarTileManager(forActuating) {
	if (forActuating) {
		this.hostTiles = this.loadTileSet('H');
		this.guestTiles = this.loadTileSet('G');
		return;
	}
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

AdevarTileManager.prototype.loadTileSet = function(ownerCode) {
	return this.loadAdevarSet(ownerCode);
};

AdevarTileManager.prototype.loadAdevarSet = function(ownerCode) {
	var tiles = [];

	/* Hidden Tiles - show first, and apply "selected" effect since one will be chosen */
	tiles.push(new AdevarTile(AdevarTileCode.iris, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.orientalLily, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.echeveria, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.whiteLotus, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.birdOfParadise, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.echinacea, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.whiteRose, ownerCode)); // etc

	// Apply "selected" effect to Hidden Tiles
	tiles.forEach(function(tile) {
		tile.selectedFromPile = true;
	});

	/* The rest of the tiles */

	for (var i = 0; i < 10; i++) {
		tiles.push(new AdevarTile(AdevarTileCode.lilac, ownerCode));
	}
	
	for (var i = 0; i < 8; i++) {
		tiles.push(new AdevarTile(AdevarTileCode.zinnia, ownerCode));
	}
	
	for (var i = 0; i < 5; i++) {
		tiles.push(new AdevarTile(AdevarTileCode.foxglove, ownerCode));
	}
	
	for (var i = 0; i < 2; i++) {
		tiles.push(new AdevarTile(AdevarTileCode.gate, ownerCode));
	}
	
	tiles.push(new AdevarTile(AdevarTileCode.irisSF, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.orientalLilySF, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.echeveriaSF, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.whiteLotusSF, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.birdOfParadiseSF, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.whiteRoseSF, ownerCode));
	tiles.push(new AdevarTile(AdevarTileCode.echinaceaSF, ownerCode));

	
	for (var i = 0; i < 2; i++) {
		tiles.push(new AdevarTile(AdevarTileCode.vanguard, ownerCode));
	}
	
	tiles.push(new AdevarTile(AdevarTileCode.reflection, ownerCode));

	return tiles;
};

AdevarTileManager.prototype.grabTile = function(player, tileCode) {
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
		debug("NONE OF THAT TILE FOUND: " + player + " " + tileCode);
	}

	return tile;
};

AdevarTileManager.prototype.peekTile = function(player, tileCode, tileId) {
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
		debug("NONE OF THAT TILE FOUND: " + player + " " + tileCode);
	}

	return tile;
};

AdevarTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

AdevarTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

AdevarTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.push(tile);
};

AdevarTileManager.prototype.removeRemainingHiddenTiles = function(player) {
	this.removeRemainingTilesOfType(player, AdevarTileType.hiddenTile);
};

AdevarTileManager.prototype.removeRemainingTilesOfType = function(player, tileType) {
	var tilePile = this.getTilePile(player);
	if (tilePile) {
		for (var i = tilePile.length - 1; i >= 0; i--) {
			var tile = tilePile[i];
			if (tile.type === tileType) {
				tilePile.splice(i, 1);
			}
		}
	}
};

AdevarTileManager.prototype.getTilePile = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}
	return tilePile;
};

AdevarTileManager.prototype.getCopy = function() {
	var copy = new AdevarTileManager();

	// copy this.hostTiles and this.guestTiles
	copy.hostTiles = this.copyArr(this.hostTiles);
	copy.guestTiles = this.copyArr(this.guestTiles);
	
	return copy;
};

AdevarTileManager.prototype.copyArr = function(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		copyArr.push(arr[i].getCopy());
	}
	return copyArr;
};
