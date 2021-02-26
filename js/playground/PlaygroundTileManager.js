/* Skud Pai Sho Tile Manager */

function PlaygroundTileManager(forActuating) {
	if (forActuating) {
		this.hostTileLibrary = this.loadTileSet('H');
		this.guestTileLibrary = this.loadTileSet('G');
		return;
	}
	this.hostTileLibrary = this.loadTileSet('H');
	this.guestTileLibrary = this.loadTileSet('G');

	this.hostTileReserve = [];
	this.guestTileReserve = [];

	this.capturedTiles = [];

	this.pilesByName = {};
	this.pilesByName[PlaygroundNotationConstants.hostReservePile] = this.hostTileReserve;
	this.pilesByName[PlaygroundNotationConstants.guestReservePile] = this.guestTileReserve;
	this.pilesByName[PlaygroundNotationConstants.capturedPile] = this.capturedTiles;
}

PlaygroundTileManager.prototype.loadTileSet = function(ownerCode) {
	return this.loadPlaygroundSet(ownerCode);
};

PlaygroundTileManager.prototype.loadPlaygroundSet = function(ownerCode) {
	var tiles = [];

	// Skud Pai Sho tiles
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, "Skud_R3", ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, "Skud_R4", ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, "Skud_R5", ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, "Skud_W3", ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, "Skud_W4", ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, "Skud_W5", ownerCode));
	
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, 'Skud_R', ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, 'Skud_W', ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, 'Skud_K', ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, 'Skud_B', ownerCode));

	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, 'Skud_L', ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, 'Skud_O', ownerCode));

	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, 'Skud_M', ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, 'Skud_T', ownerCode));
	tiles.push(new PlaygroundTile(GameType.SkudPaiSho, 'Skud_P', ownerCode));

	// Vagabond tiles
	tiles.push(new PlaygroundTile(GameType.VagabondPaiSho, "Vagabond_S", ownerCode));
	tiles.push(new PlaygroundTile(GameType.VagabondPaiSho, "Vagabond_B", ownerCode));
	tiles.push(new PlaygroundTile(GameType.VagabondPaiSho, "Vagabond_W", ownerCode));
	tiles.push(new PlaygroundTile(GameType.VagabondPaiSho, "Vagabond_C", ownerCode));
	tiles.push(new PlaygroundTile(GameType.VagabondPaiSho, "Vagabond_F", ownerCode));
	tiles.push(new PlaygroundTile(GameType.VagabondPaiSho, "Vagabond_D", ownerCode));
	tiles.push(new PlaygroundTile(GameType.VagabondPaiSho, "Vagabond_L", ownerCode));

	// Capture tiles
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_A", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_V", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_B", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_P", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_F", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_U", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_K", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_L", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_D", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_M", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_T", ownerCode));
	tiles.push(new PlaygroundTile(GameType.CapturePaiSho, "Capture_O", ownerCode));

	// Playground Special
	tiles.push(new PlaygroundTile(GameType.Playground, "Playground_Blank", ownerCode));

	// Adevar
	tiles.push(new PlaygroundTile("Advr", "Advr_Back", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_Lilac", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_Zinnia", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_Foxglove", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_Gate", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_Iris", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_OrientalLily", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_Echeveria", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_WhiteRose", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_WhiteLotus", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_BirdOfParadise", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_BlackOrchid", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_IrisSecondFace", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_OrientalLilySecondFace", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_EcheveriaSecondFace", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_WhiteRoseSecondFace", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_WhiteLotusSecondFace", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_BirdOfParadiseSecondFace", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_BlackOrchidSecondFace", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_Vanguard", ownerCode));
	tiles.push(new PlaygroundTile("Advr", "Advr_WatersReflection", ownerCode));

	// Warfront
	tiles.push(new PlaygroundTile("Warfront", "Warfront_Cavalry", ownerCode));
	tiles.push(new PlaygroundTile("Warfront", "Warfront_Guardian", ownerCode));
	tiles.push(new PlaygroundTile("Warfront", "Warfront_Lotus", ownerCode));
	tiles.push(new PlaygroundTile("Warfront", "Warfront_SiegeEngine", ownerCode));
	tiles.push(new PlaygroundTile("Warfront", "Warfront_Soldier", ownerCode));

	// Chess
	tiles.push(new PlaygroundTile("Chess", "Chess_K", ownerCode));
	tiles.push(new PlaygroundTile("Chess", "Chess_Q", ownerCode));
	tiles.push(new PlaygroundTile("Chess", "Chess_R", ownerCode));
	tiles.push(new PlaygroundTile("Chess", "Chess_N", ownerCode));
	tiles.push(new PlaygroundTile("Chess", "Chess_B", ownerCode));
	tiles.push(new PlaygroundTile("Chess", "Chess_P", ownerCode));

	// Other from Sirstotes
	tiles.push(new PlaygroundTile(GameType.Playground, "Playground_Water", ownerCode));
	tiles.push(new PlaygroundTile(GameType.Playground, "Playground_Earth", ownerCode));
	tiles.push(new PlaygroundTile(GameType.Playground, "Playground_Fire", ownerCode));
	tiles.push(new PlaygroundTile(GameType.Playground, "Playground_Air", ownerCode));
	tiles.push(new PlaygroundTile(GameType.Playground, "Playground_RedLotus", ownerCode));
	tiles.push(new PlaygroundTile(GameType.Playground, "Playground_Oasis", ownerCode));
	tiles.push(new PlaygroundTile(GameType.Playground, "Playground_Library", ownerCode));
	tiles.push(new PlaygroundTile(GameType.Playground, "Playground_Temple", ownerCode));

	return tiles;
};

PlaygroundTileManager.prototype.grabTile = function(player, tileCode, sourcePileName) {
	if (sourcePileName && this.pilesByName[sourcePileName]) {
		var tilePile = this.pilesByName[sourcePileName];

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
	}

	if (player === 'G') {
		player = GUEST;
	} else if (player === 'H') {
		player = HOST;
	}

	// return tile;
	return this.peekTile(player, tileCode);
};

PlaygroundTileManager.prototype.peekTile = function(player, tileCode, tileId) {
	var tilePile = this.hostTileLibrary;
	if (player === GUEST) {
		tilePile = this.guestTileLibrary;
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

PlaygroundTileManager.prototype.setZonesAsPossibleMovePoints = function() {
	var possiblePiles = [
		this.hostTileReserve,
		this.guestTileReserve,
		this.capturedTiles
	];

	var self = this;
	possiblePiles.forEach(function(tilePile) {
		self.addPossiblePointToZoneTilePile(tilePile);
	});
};

PlaygroundTileManager.prototype.removeZonePossibleMoves = function() {
	var possiblePiles = [
		this.hostTileReserve,
		this.guestTileReserve,
		this.capturedTiles
	];

	var self = this;
	possiblePiles.forEach(function(tilePile) {
		self.removePossiblePointFromZoneTilePile(tilePile);
	});
};

PlaygroundTileManager.prototype.addPossiblePointToZoneTilePile = function(tilePile) {
	tilePile.push(new PlaygroundTile("PossibleMove", "PossibleMove", ""));
};

PlaygroundTileManager.prototype.removePossiblePointFromZoneTilePile = function(tilePile) {
	for (var i = tilePile.length - 1; i >= 0 && tilePile.length > 0; i--) {
		if (tilePile[i].gameType === "PossibleMove") {
			tilePile.splice(i, 1);
		}
	}
};

PlaygroundTileManager.prototype.removeSelectedTileFlags = function() {
	this.hostTileLibrary.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
	this.guestTileLibrary.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
};

PlaygroundTileManager.prototype.unselectTiles = function(player) {
	var tilePile = this.hostTileLibrary;
	if (player === GUEST) {
		tilePile = this.guestTileLibrary;
	}

	tilePile.forEach(function(tile) {
		tile.selectedFromPile = false;
	});
}

// PlaygroundTileManager.prototype.putTileBack = function(tile) {
// 	var player = tile.ownerName;
// 	var tilePile = this.hostTileLibrary;
// 	if (player === GUEST) {
// 		tilePile = this.guestTileLibrary;
// 	}

// 	tilePile.push(tile);
// };

PlaygroundTileManager.prototype.aPlayerIsOutOfBasicFlowerTiles = function() {
	// Check Host
	var hostHasBasic = false;
	for (var i = 0; i < this.hostTileLibrary.length; i++) {
		if (this.hostTileLibrary[i].type === BASIC_FLOWER) {
			hostHasBasic = true;
			break;
		}
	}

	var guestHasBasic = false;
	for (var i = 0; i < this.guestTileLibrary.length; i++) {
		if (this.guestTileLibrary[i].type === BASIC_FLOWER) {
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
	for (var i = 0; i < this.hostTileLibrary.length; i++) {
		if (this.hostTileLibrary[i].type === ACCENT_TILE) {
			hostCount++;
		}
	}

	var guestCount = 0;
	for (var i = 0; i < this.guestTileLibrary.length; i++) {
		if (this.guestTileLibrary[i].type === ACCENT_TILE) {
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
	var tilePile = this.hostTileLibrary;
	if (player === GUEST) {
		tilePile = this.guestTileLibrary;
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

	// copy this.hostTileLibrary and this.guestTileLibrary
	copy.hostTiles = this.copyArr(this.hostTileLibrary);
	copy.guestTiles = this.copyArr(this.guestTileLibrary);
	
	return copy;
};

PlaygroundTileManager.prototype.copyArr = function(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		copyArr.push(arr[i].getCopy());
	}
	return copyArr;
};
