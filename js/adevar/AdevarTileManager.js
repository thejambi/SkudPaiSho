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

	for (var i = 0; i < 10; i++) {
		tiles.push(new AdevarTile("Lilac", ownerCode));
	}
	
	for (var i = 0; i < 8; i++) {
		tiles.push(new AdevarTile("Zinnia", ownerCode));
	}
	
	for (var i = 0; i < 5; i++) {
		tiles.push(new AdevarTile("Foxglove", ownerCode));
	}
	
	for (var i = 0; i < 2; i++) {
		tiles.push(new AdevarTile("Gate", ownerCode));
	}
	
	tiles.push(new AdevarTile("Iris", ownerCode));
	
	tiles.push(new AdevarTile("OrientalLily", ownerCode));
	
	tiles.push(new AdevarTile("Echeveria", ownerCode));
	
	tiles.push(new AdevarTile("IrisSecondFace", ownerCode));
	
	tiles.push(new AdevarTile("OrientalLilySecondFace", ownerCode));
	
	tiles.push(new AdevarTile("EcheveriaSecondFace", ownerCode));
	
	for (var i = 0; i < 2; i++) {
		tiles.push(new AdevarTile("Vanguard", ownerCode));
	}
	
	tiles.push(new AdevarTile("WatersReflection", ownerCode));

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
		debug("NONE OF THAT TILE FOUND");
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
