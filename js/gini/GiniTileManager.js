// Gini Tile Manager

import { GUEST, HOST } from '../CommonNotationObjects';
import { GiniTileCodes, GiniTileInfo } from './GiniTiles';
import { debug } from '../GameData';
import { TrifleTile } from '../trifle/TrifleTile';

export var GiniTileManager = function() {
	this.hostTiles = this.loadMainTileSet('H');
	this.guestTiles = this.loadMainTileSet('G');
	this.hostAccentTiles = this.loadAccentTileSet('H');
	this.guestAccentTiles = this.loadAccentTileSet('G');
	this.capturedTiles = [];
};

GiniTileManager.prototype.loadMainTileSet = function(ownerCode) {
	var tiles = [];

	tiles.push(new TrifleTile(GiniTileCodes.WhiteLotus, ownerCode));
	tiles.push(new TrifleTile(GiniTileCodes.Koi, ownerCode));
	tiles.push(new TrifleTile(GiniTileCodes.Badgermole, ownerCode));
	tiles.push(new TrifleTile(GiniTileCodes.Dragon, ownerCode));
	tiles.push(new TrifleTile(GiniTileCodes.Bison, ownerCode));
	tiles.push(new TrifleTile(GiniTileCodes.Ginseng, ownerCode));

	return tiles;
};

GiniTileManager.prototype.loadAccentTileSet = function(ownerCode) {
	var tiles = [];

	tiles.push(new TrifleTile(GiniTileCodes.Water, ownerCode));
	tiles.push(new TrifleTile(GiniTileCodes.Earth, ownerCode));
	tiles.push(new TrifleTile(GiniTileCodes.Fire, ownerCode));
	tiles.push(new TrifleTile(GiniTileCodes.Air, ownerCode));

	return tiles;
};

GiniTileManager.prototype.grabTile = function(player, tileCode) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}

	var tile;
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].code === tileCode) {
			var newTileArr = tilePile.splice(i, 1);
			tile = newTileArr[0];
			break;
		}
	}

	if (!tile) {
		debug("NONE OF THAT TILE FOUND IN MAIN TILES");
	}

	return tile;
};

GiniTileManager.prototype.grabAccentTile = function(player, tileCode) {
	var tilePile = this.hostAccentTiles;
	if (player === GUEST) {
		tilePile = this.guestAccentTiles;
	}

	var tile;
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].code === tileCode) {
			var newTileArr = tilePile.splice(i, 1);
			tile = newTileArr[0];
			break;
		}
	}

	if (!tile) {
		debug("NONE OF THAT ACCENT TILE FOUND");
	}

	return tile;
};

GiniTileManager.prototype.returnAccentTile = function(tile) {
	var tilePile = this.hostAccentTiles;
	if (tile.ownerName === GUEST) {
		tilePile = this.guestAccentTiles;
	}
	tilePile.push(tile);
};

GiniTileManager.prototype.peekTile = function(player, tileCode, tileId) {
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
		// Check accent tiles
		tile = this.peekAccentTile(player, tileCode, tileId);
	}

	return tile;
};

GiniTileManager.prototype.peekAccentTile = function(player, tileCode, tileId) {
	var tilePile = this.hostAccentTiles;
	if (player === GUEST) {
		tilePile = this.guestAccentTiles;
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

	return tile;
};

GiniTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.hostAccentTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestAccentTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

GiniTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.getPlayerTilePile(player);
	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	var accentPile = this.getPlayerAccentTilePile(player);
	accentPile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

GiniTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	if (GiniTileInfo.isAccentTile(tile.code)) {
		this.returnAccentTile(tile);
	} else {
		var tilePile = this.getPlayerTilePile(player);
		tilePile.push(tile);
	}
};

GiniTileManager.prototype.addToCapturedTiles = function(tiles) {
	tiles.forEach((tile) => {
		if (GiniTileInfo.isAccentTile(tile.code)) {
			// Accent tiles return to owner's hand when captured
			this.returnAccentTile(tile);
		} else if (tile.moveToPile) {
			// Custom pile handling (if needed)
			this.capturedTiles.push(tile);
		} else if ((tile.beingCaptured || tile.beingCapturedByAbility) && !tile.moveToPile) {
			this.capturedTiles.push(tile);
		}
		tile.beingCaptured = null;
		tile.beingCapturedByAbility = null;
		tile.moveToPile = null;
	});
};

GiniTileManager.prototype.getPlayerTilePile = function(player) {
	var tilePile = this.hostTiles;
	if (player === GUEST) {
		tilePile = this.guestTiles;
	}
	return tilePile;
};

GiniTileManager.prototype.getPlayerAccentTilePile = function(player) {
	var tilePile = this.hostAccentTiles;
	if (player === GUEST) {
		tilePile = this.guestAccentTiles;
	}
	return tilePile;
};

GiniTileManager.prototype.getAllTiles = function() {
	return this.hostTiles.concat(this.guestTiles)
		.concat(this.hostAccentTiles).concat(this.guestAccentTiles);
};

GiniTileManager.prototype.getCopy = function() {
	var copy = new GiniTileManager();
	return copy;
};
