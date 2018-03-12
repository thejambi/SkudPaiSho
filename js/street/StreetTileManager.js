/* Skud Pai Sho Tile Manager */

function StreetTileManager(forActuating) {
	if (forActuating) {
		this.hostTiles = this.loadOneOfEach('H');
		this.guestTiles = this.loadOneOfEach('G');
		return;
	}
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

StreetTileManager.prototype.loadTileSet = function(ownerCode) {
	return this.loadStreetSet(ownerCode);
};

StreetTileManager.prototype.loadStreetSet = function(ownerCode) {
	var tiles = [];

	// 16 tiles
	for (var i = 0; i < 16; i++) {
		tiles.push(new StreetTile(ownerCode));
	}

	return tiles;
};

StreetTileManager.prototype.loadOneOfEach = function(ownerCode) {
	var tiles = [];

	tiles.push(new StreetTile(ownerCode));

	return tiles;
};

StreetTileManager.prototype.grabTile = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	var tile;
	for (var i = 0; i < tilePile.length; i++) {
		newTileArr = tilePile.splice(i, 1);
		tile = newTileArr[0];
		break;
	}

	if (!tile) {
		debug("NONE OF THAT TILE FOUND");
	}

	return tile;
};

StreetTileManager.prototype.peekTile = function(player, tileCode, tileId) {
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

StreetTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

StreetTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

StreetTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.push(tile);
};

StreetTileManager.prototype.aPlayerIsOutOfTiles = function() {
	if (this.guestTiles.length === 0) {
		return GUEST;
	} else if (this.hostTiles.length === 0) {
		return HOST;
	}
};

StreetTileManager.prototype.getCopy = function() {
	var copy = new StreetTileManager();

	// copy this.hostTiles and this.guestTiles
	copy.hostTiles = this.copyArr(this.hostTiles);
	copy.guestTiles = this.copyArr(this.guestTiles);
	
	return copy;
};

StreetTileManager.prototype.copyArr = function(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		copyArr.push(arr[i].getCopy());
	}
	return copyArr;
};
