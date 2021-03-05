// Tile Manager

var STANDARD = "Standard";
var RESTRICTED_BY_OPPONENT_TILE_ZONE = "Restricted by opponent tile zone";

Trifle.TileManager = function() {
	Trifle.TileInfo.initializeTrifleData();
	this.hostTeam = [];
	this.guestTeam = [];
	this.hostTiles = [];
	this.guestTiles = [];
}

Trifle.TileManager.prototype.grabTile = function(player, tileCode) {
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

Trifle.TileManager.prototype.peekTile = function(player, tileCode, tileId) {
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

Trifle.TileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

Trifle.TileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.getPlayerTilePile(player);

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

Trifle.TileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.getPlayerTilePile(player);

	tilePile.push(tile);
};

Trifle.TileManager.prototype.getTeamSize = function() {
	return 11;
};

Trifle.TileManager.prototype.hostTeamIsFull = function() {
	return this.playerTeamIsFull(HOST);
};

Trifle.TileManager.prototype.guestTeamIsFull = function() {
	return this.playerTeamIsFull(GUEST);
};

Trifle.TileManager.prototype.playerTeamIsFull = function(player) {
	return this.getPlayerTeam(player).length >= this.getTeamSize();
};

Trifle.TileManager.prototype.playerTeamHasBanner = function(player) {
	var team = this.getPlayerTeam(player);
	for (var i = 0; i < team.length; i++) {
		var tileInfo = TrifleTiles[team[i].code];
		if (tileInfo && this.tileInfoIsBanner(tileInfo)) {
			return true;
		}
	}
	return false;
};

Trifle.TileManager.prototype.tileInfoIsBanner = function(tileInfo) {
	return tileInfo && tileInfo.types.includes(Trifle.TileType.banner);
};

Trifle.TileManager.prototype.addToTeamIfOk = function(tile) {
	var addOk = false;
	var player = tile.ownerName;
	if (!this.playerTeamIsFull(player)) {
		/* Team isn't full, that's the first check! */
		addOk = true;	// So far!

		var tileInfo = TrifleTiles[tile.code];
		/* If tile is Banner, it's ok if we don't have one */
		if (this.tileInfoIsBanner(tileInfo)) {
			addOk = addOk && !this.playerTeamHasBanner(player);
		} else {
			/* If tile is not banner, we just need to make sure we have room on the team for one or have one already */
			addOk = addOk && (this.playerTeamHasBanner(player)
					|| this.getPlayerTeam(player).length < this.getTeamSize() - 1);
		}

		var howManyAlreadyInTeam = this.countOfThisTileInTeam(tile.code, tile.ownerName);
		addOk = addOk && howManyAlreadyInTeam < Trifle.Tile.getTeamLimitForTile(tile.code);

		if (addOk) {
			this.getPlayerTeam(tile.ownerName).push(tile);
			this.getPlayerTilePile(tile.ownerName).push(tile);
		}
	}

	return addOk;
};

Trifle.TileManager.prototype.removeTileFromTeam = function(tile) {
	if (this.countOfThisTileInTeam(tile.code, tile.ownerName) > 0) {
		var playerTeam = this.getPlayerTeam(tile.ownerName);
		playerTeam.splice(playerTeam.indexOf(tile), 1);
		this.grabTile(tile.ownerName, tile.code);
	}
};

Trifle.TileManager.prototype.countOfThisTileInTeam = function(tileCode, ownerName) {
	var count = 0;
	var ownerTeam = this.getPlayerTeam(ownerName);

	for (var i = 0; i < ownerTeam.length; i++) {
		if (ownerTeam[i].code === tileCode) {
			count++;
		}
	}
	return count;
};

Trifle.TileManager.prototype.getPlayerTeam = function(player) {
	var playerTeam = this.hostTeam;
	if (player === GUEST) {
		playerTeam = this.guestTeam;
	}
	return playerTeam;
};

Trifle.TileManager.prototype.getPlayerTilePile = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}
	return tilePile;
};

Trifle.TileManager.prototype.getCopy = function() {
	var copy = new Trifle.TileManager();

	// copy this.hostTiles and this.guestTiles
	
	return copy;
};
