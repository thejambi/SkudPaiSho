// Vagabond Trifle Tile Manager - Manages tile piles for Vagabond using Trifle engine

import { GUEST, HOST } from '../CommonNotationObjects';
import { VagabondTrifleTileCodes } from './VagabondTrifleTiles';
import { copyArray, debug } from '../GameData';
import { TrifleTile } from '../trifle/TrifleTile';
import {
  OPTION_DOUBLE_TILES,
  SWAP_BISON_WITH_LEMUR,
  gameOptionEnabled,
} from '../GameOptions';

export function VagabondTrifleTileManager() {
	this.hostTiles = this.loadTileSet('H');
	this.guestTiles = this.loadTileSet('G');
	this.capturedHostTiles = [];
	this.capturedGuestTiles = [];
}

VagabondTrifleTileManager.prototype.loadTileSet = function(ownerCode) {
	var tiles = [];

	this.addTiles(tiles, ownerCode);

	if (gameOptionEnabled(OPTION_DOUBLE_TILES)) {
		this.addTiles(tiles, ownerCode);
	}

	// Only ever 1 Lotus tile
	tiles.push(new TrifleTile(VagabondTrifleTileCodes.WhiteLotus, ownerCode));

	return tiles;
};

VagabondTrifleTileManager.prototype.addTiles = function(tiles, ownerCode) {
	// 2 of each of these tiles
	for (var i = 0; i < 2; i++) {
		if (gameOptionEnabled(SWAP_BISON_WITH_LEMUR)) {
			tiles.push(new TrifleTile(VagabondTrifleTileCodes.FlyingLemur, ownerCode));
		} else {
			tiles.push(new TrifleTile(VagabondTrifleTileCodes.SkyBison, ownerCode));
		}
		tiles.push(new TrifleTile(VagabondTrifleTileCodes.Badgermole, ownerCode));
		tiles.push(new TrifleTile(VagabondTrifleTileCodes.Wheel, ownerCode));
		tiles.push(new TrifleTile(VagabondTrifleTileCodes.Chrysanthemum, ownerCode));
	}

	// 1 of each of these tiles
	tiles.push(new TrifleTile(VagabondTrifleTileCodes.FireLily, ownerCode));
	tiles.push(new TrifleTile(VagabondTrifleTileCodes.Dragon, ownerCode));
};

VagabondTrifleTileManager.prototype.grabTile = function(player, tileCode) {
	var tilePile = this.getPlayerTilePile(player);

	var tile;
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].code === tileCode) {
			var newTileArr = tilePile.splice(i, 1);
			tile = newTileArr[0];
			break;
		}
	}

	if (!tile) {
		debug("NONE OF THAT TILE FOUND: " + tileCode);
	}

	return tile;
};

VagabondTrifleTileManager.prototype.peekTile = function(player, tileCode, tileId) {
	var tilePile = this.getPlayerTilePile(player);

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
		debug("NONE OF THAT TILE FOUND: " + tileCode);
	}

	return tile;
};

VagabondTrifleTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTiles.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

VagabondTrifleTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.getPlayerTilePile(player);

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

VagabondTrifleTileManager.prototype.putTileBack = function(tile) {
	var player = tile.ownerName;
	var tilePile = this.getPlayerTilePile(player);
	tilePile.push(tile);
};

VagabondTrifleTileManager.prototype.addToCapturedTiles = function(tiles) {
	if (!tiles) return;

	tiles.forEach((tile) => {
		if (tile.beingCaptured || tile.beingCapturedByAbility) {
			if (tile.ownerName === HOST) {
				this.capturedHostTiles.push(tile);
			} else {
				this.capturedGuestTiles.push(tile);
			}
		}
		tile.beingCaptured = null;
		tile.beingCapturedByAbility = null;
	});
};

VagabondTrifleTileManager.prototype.getPlayerTilePile = function(player) {
	if (player === GUEST) {
		return this.guestTiles;
	}
	return this.hostTiles;
};

VagabondTrifleTileManager.prototype.getCapturedTiles = function(player) {
	if (player === GUEST) {
		return this.capturedGuestTiles;
	}
	return this.capturedHostTiles;
};

VagabondTrifleTileManager.prototype.getAllTiles = function() {
	return this.hostTiles.concat(this.guestTiles);
};

VagabondTrifleTileManager.prototype.getCopy = function() {
	var copy = new VagabondTrifleTileManager();

	copy.hostTiles = [];
	this.hostTiles.forEach(function(tile) {
		copy.hostTiles.push(tile.getCopy());
	});

	copy.guestTiles = [];
	this.guestTiles.forEach(function(tile) {
		copy.guestTiles.push(tile.getCopy());
	});

	copy.capturedHostTiles = [];
	this.capturedHostTiles.forEach(function(tile) {
		copy.capturedHostTiles.push(tile.getCopy());
	});

	copy.capturedGuestTiles = [];
	this.capturedGuestTiles.forEach(function(tile) {
		copy.capturedGuestTiles.push(tile.getCopy());
	});

	return copy;
};
