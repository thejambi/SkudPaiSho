/* Skud Pai Sho Tile Manager */

function PlaygroundTileManager(forActuating) {
	if (forActuating) {
		this.hostTiles = this.loadTileSet('H');
		this.guestTiles = this.loadTileSet('G');
		return;
	}
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
}

PlaygroundTileManager.prototype.loadTileSet = function(ownerCode) {
	return this.loadPlaygroundSet(ownerCode);
};

PlaygroundTileManager.prototype.loadPlaygroundSet = function(ownerCode) {
	var tiles = [];

	// Skud Pai Sho tiles
	tiles.push(new PlaygroundTile('Skud_R', ownerCode));
	tiles.push(new PlaygroundTile('Skud_W', ownerCode));
	tiles.push(new PlaygroundTile('Skud_K', ownerCode));
	tiles.push(new PlaygroundTile('Skud_B', ownerCode));

	tiles.push(new PlaygroundTile("Skud_R3", ownerCode));
	tiles.push(new PlaygroundTile("Skud_R4", ownerCode));
	tiles.push(new PlaygroundTile("Skud_R5", ownerCode));
	tiles.push(new PlaygroundTile("Skud_W3", ownerCode));
	tiles.push(new PlaygroundTile("Skud_W4", ownerCode));
	tiles.push(new PlaygroundTile("Skud_W5", ownerCode));

	tiles.push(new PlaygroundTile('Skud_L', ownerCode));
	tiles.push(new PlaygroundTile('Skud_O', ownerCode));

	// Vagabond tiles
	

	return tiles;
};

PlaygroundTileManager.prototype.grabTile = function(player, tileCode) {
	// var tilePile = this.hostTiles;
	// if (player === GUEST) {
	// 	tilePile = this.guestTiles;
	// }

	// var tile;
	// for (var i = 0; i < tilePile.length; i++) {
	// 	if (tilePile[i].code === tileCode) {
	// 		newTileArr = tilePile.splice(i, 1);
	// 		tile = newTileArr[0];
	// 		break;
	// 	}
	// }

	// if (!tile) {
	// 	debug("NONE OF THAT TILE FOUND");
	// }

	if (player === 'G') {
		player = GUEST;
	} else if (player === 'H') {
		player = HOST;
	}

	// return tile;
	return this.peekTile(player, tileCode);
};

PlaygroundTileManager.prototype.peekTile = function(player, tileCode, tileId) {
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

PlaygroundTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

PlaygroundTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

// PlaygroundTileManager.prototype.putTileBack = function(tile) {
// 	var player = tile.ownerName;
// 	var tilePile = this.hostTiles;
// 	if (player === GUEST) {
// 		tilePile = this.guestTiles;
// 	}

// 	tilePile.push(tile);
// };

PlaygroundTileManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	// Check Host
	var hostHasBasic = false;
	for (var i = 0; i < this.hostTiles.length; i++) {
		if (this.hostTiles[i].type === BASIC_FLOWER) {
			hostHasBasic = true;
			break;
		}
	}

	var guestHasBasic = false;
	for (var i = 0; i < this.guestTiles.length; i++) {
		if (this.guestTiles[i].type === BASIC_FLOWER) {
			guestHasBasic = true;
			break;
		}
	}

	if (!hostHasBasic && guestHasBasic) {
		return HOST;
	} else if (!guestHasBasic && hostHasBasic) {
		return GUEST;
	} else if (!guestHasBasic && !hostHasBasic) {
		return "BOTH PLAYERS";
	}
};

PlaygroundTileManager.prototype.getPlayerWithMoreAccentTiles = function() {
	var hostCount = 0;
	for (var i = 0; i < this.hostTiles.length; i++) {
		if (this.hostTiles[i].type === ACCENT_TILE) {
			hostCount++;
		}
	}

	var guestCount = 0;
	for (var i = 0; i < this.guestTiles.length; i++) {
		if (this.guestTiles[i].type === ACCENT_TILE) {
			guestCount++;
		}
	}

	if (hostCount > guestCount) {
		return HOST;
	} else if (guestCount > hostCount) {
		return GUEST;
	}
};

PlaygroundTileManager.prototype.playerHasBothSpecialTilesRemaining = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	var specialTileCount = 0;

	tilePile.forEach(function(tile) {
		if (tile.type === SPECIAL_FLOWER) {
			specialTileCount++;
		}
	});

	return specialTileCount > 1;
};

PlaygroundTileManager.prototype.getCopy = function() {
	var copy = new PlaygroundTileManager();

	// copy this.hostTiles and this.guestTiles
	copy.hostTiles = this.copyArr(this.hostTiles);
	copy.guestTiles = this.copyArr(this.guestTiles);
	
	return copy;
};

PlaygroundTileManager.prototype.copyArr = function(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		copyArr.push(arr[i].getCopy());
	}
	return copyArr;
};
