// Tile Manager

var STANDARD = "Standard";
var RESTRICTED_BY_OPPONENT_TILE_ZONE = "Restricted by opponent tile zone";

Ginseng.TileManager = function() {
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
	this.capturedTiles = [];
};

Ginseng.TileManager.prototype.loadTileSet = function(ownerCode) {
	var tiles = [];

	tiles.push(new Trifle.Tile(Ginseng.TileCodes.WhiteLotus, ownerCode));
	tiles.push(new Trifle.Tile(Ginseng.TileCodes.Koi, ownerCode));
	tiles.push(new Trifle.Tile(Ginseng.TileCodes.Dragon, ownerCode));
	tiles.push(new Trifle.Tile(Ginseng.TileCodes.Badgermole, ownerCode));
	tiles.push(new Trifle.Tile(Ginseng.TileCodes.Bison, ownerCode));
	tiles.push(new Trifle.Tile(Ginseng.TileCodes.LionTurtle, ownerCode));
	for (var i = 0; i < 2; i++) {
		tiles.push(new Trifle.Tile(Ginseng.TileCodes.Wheel, ownerCode));
		tiles.push(new Trifle.Tile(Ginseng.TileCodes.Ginseng, ownerCode));
		tiles.push(new Trifle.Tile(Ginseng.TileCodes.Orchid, ownerCode));
	}

	return tiles;
};

Ginseng.TileManager.prototype.grabTile = function(player, tileCode) {
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

Ginseng.TileManager.prototype.peekTile = function(player, tileCode, tileId) {
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
		this.capturedTiles.forEach((capturedTile) => {
			if (capturedTile.id === tileId) {
				tile = capturedTile;
				debug("Found in captured tiles.. that ok?")
			}
		});
	}

	return tile;
};

Ginseng.TileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

Ginseng.TileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.getPlayerTilePile(player);

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

Ginseng.TileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.getPlayerTilePile(player);

	tilePile.push(tile);
};

Ginseng.TileManager.prototype.addToCapturedTiles = function(tiles) {
	tiles.forEach((tile) => {
		this.capturedTiles.push(tile);
	});
};

Ginseng.TileManager.prototype.getTeamSize = function() {
	return 11;
};

Ginseng.TileManager.prototype.hostTeamIsFull = function() {
	return this.playerTeamIsFull(HOST);
};

Ginseng.TileManager.prototype.guestTeamIsFull = function() {
	return this.playerTeamIsFull(GUEST);
};

Ginseng.TileManager.prototype.playerTeamIsFull = function(player) {
	return this.getPlayerTeam(player).length >= this.getTeamSize();
};

Ginseng.TileManager.prototype.playersAreSelectingTeams = function() {
	return !this.hostTeamIsFull() || !this.guestTeamIsFull();
};

Ginseng.TileManager.prototype.getPlayerTeam = function(player) {
	var playerTeam = this.hostTeam;
	if (player === GUEST) {
		playerTeam = this.guestTeam;
	}
	return playerTeam;
};

Ginseng.TileManager.prototype.getPlayerTilePile = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}
	return tilePile;
};

Ginseng.TileManager.prototype.getAllTiles = function() {
	return this.hostTeam.concat(this.guestTeam);
};

Ginseng.TileManager.prototype.getCopy = function() {
	var copy = new Ginseng.TileManager();

	// copy this.hostTiles and this.guestTiles

	return copy;
};
