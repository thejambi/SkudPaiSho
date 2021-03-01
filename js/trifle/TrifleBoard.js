// Trifle Board

Trifle.Board = function() {
	this.size = new RowAndColumn(17, 17);
	this.cells = this.brandNew();

	this.winners = [];
	this.tilePresenceAbilities = [];
	this.activeDurationAbilities = [];

	this.hostBannerPlayed = false;
	this.guestBannerPlayed = false;

	this.brainFactory = new Trifle.BrainFactory();
}

Trifle.Board.prototype.brandNew = function () {
	var cells = [];

	cells[0] = this.newRow(9, 
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.gate(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[1] = this.newRow(11, 
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redWhiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(), 
		Trifle.BoardPoint.neutral()
		]);

	cells[2] = this.newRow(13, 
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[3] = this.newRow(15,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[4] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[5] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[6] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[7] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.whiteNeutral(), 
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[8] = this.newRow(17,
		[Trifle.BoardPoint.gate(),
		Trifle.BoardPoint.redWhiteNeutral(), 
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.redWhiteNeutral(),
		Trifle.BoardPoint.gate()
		]);

	cells[9] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[10] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[11] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[12] = this.newRow(17,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[13] = this.newRow(15,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.red(),
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.white(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[14] = this.newRow(13,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redNeutral(), 
		Trifle.BoardPoint.redWhite(),
		Trifle.BoardPoint.whiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[15] = this.newRow(11,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.redWhiteNeutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	cells[16] = this.newRow(9,
		[Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.gate(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral(),
		Trifle.BoardPoint.neutral()
		]);

	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			cells[row][col].row = row;
			cells[row][col].col = col;
		}
	}

	return cells;
};

Trifle.Board.prototype.newRow = function(numColumns, points) {
	var cells = [];

	var numBlanksOnSides = (this.size.row - numColumns) / 2;

	var nonPoint = new Trifle.BoardPoint();
	nonPoint.addType(NON_PLAYABLE);

	for (var i = 0; i < this.size.row; i++) {
		if (i < numBlanksOnSides) {
			cells[i] = nonPoint;
		} else if (i < numBlanksOnSides + numColumns) {
			if (points) {
				cells[i] = points[i - numBlanksOnSides];
			} else {
				cells[i] = nonPoint;
			}
		} else {
			cells[i] = nonPoint;
		}
	}

	return cells;
};

Trifle.Board.prototype.placeTile = function(tile, notationPoint) {
	this.tilesCapturedByTriggeredAbility = [];
	this.putTileOnPoint(tile, notationPoint);

	if (Trifle.TileInfo.tileIsBanner(TrifleTiles[tile.code])) {
		if (tile.ownerName === HOST) {
			this.hostBannerPlayed = true;
		} else {
			this.guestBannerPlayed = true;
		}
	}

	// Things to do after a tile is placed

	/* Process abilities after placing tile */
	var tileInfo = TrifleTiles[tile.code];

	var boardPoint = this.getPointFromNotationPoint(notationPoint);

	this.processAbilities(tile, tileInfo, null, boardPoint, []);

	if (boardPoint.hasTile() && boardPoint.tile.code === tile.code) {
		this.applyZoneAbilityToTile(boardPoint);
	}

	this.applyBoardScanAbilities();
	this.applyWhenLandsTriggers(tile, tileInfo, boardPoint, []);
};

Trifle.Board.prototype.setTilePresenceAbilitiesForPlayer = function(boardPoint, playerName, tileInfo) {
	if (tileInfo && tileInfo.abilities) {
		var self = this;
		tileInfo.abilities.forEach(function(abilityInfo) {
			if (self.abilityIsActive(boardPoint, boardPoint.tile, tileInfo, abilityInfo)) {
				self.tilePresenceAbilities.push({
					playerName: playerName,
					abilityInfo: abilityInfo
				});
			}
		});
	}
};

Trifle.Board.prototype.abilityIsActive = function(boardPoint, tile, tileInfo, abilityInfo) {
	/* Abilities defalt to active unless disabled */
	var abilityIsActive = true;

	/* What are the ways an ability can be disabled/activated?
	 */

	var self = this;
	this.forEachBoardPointWithTile(function(checkBoardPoint) {
		var checkTileInfo = TrifleTiles[checkBoardPoint.tile.code];

		/* Check tile zones that can disable abilities */
		var zoneInfo = Trifle.TileInfo.getTerritorialZone(checkTileInfo);
		if (zoneInfo && zoneInfo.abilities) {
			zoneInfo.abilities.forEach(function(zoneAbilityInfo) {
				if (
					zoneAbilityInfo.type === Trifle.ZoneAbility.removesTileAbilities
					&& (
						(zoneAbilityInfo.targetTeams.includes(Trifle.TileTeam.friendly)
							&& tile.ownerCode === checkBoardPoint.tile.ownerCode)
						|| (zoneAbilityInfo.targetTeams.includes(Trifle.TileTeam.enemy)
							&& tile.ownerCode !== checkBoardPoint.tile.ownerCode)
					) && (
						(
							zoneAbilityInfo.targetTileTypes 
							&& (
								arrayIncludesOneOf(zoneAbilityInfo.targetTileTypes, tileInfo.types)
								|| zoneAbilityInfo.targetTileTypes.includes(Trifle.TileCategory.allTileTypes)
							)
						)
						|| (
							zoneAbilityInfo.targetTileCodes 
							&& zoneAbilityInfo.targetTileCodes.includes(tile.code)
						)
					) && self.pointTileZoneContainsPoint(checkBoardPoint, boardPoint)
				) {
					abilityIsActive = false;
					debug("Ability disabled for tile: " + tile.code + " by tile: " + checkBoardPoint.tile.code);
				}
			});
		}

		/* Check RemoveEffects abilities - Moving check to a "isEffectActive" method */
		// abilityIsActive = abilityIsActive && !self.effectIsDisabledByRemoveEffectsAbility(boardPoint, tile, tileInfo, abilityInfo, checkBoardPoint, checkTileInfo);
	});

	if (abilityInfo.triggeringBoardState) {
		abilityIsActive = false;	// Defaults to inactive unless activated by triggering board state, which we'll check.... now.
		switch (abilityInfo.triggeringBoardState) {

		}
	}


	return abilityIsActive;
};

Trifle.Board.prototype.applyZoneAbilityToTile = function(boardPoint) {
	var tileInfo = TrifleTiles[boardPoint.tile.code];
	var tile = boardPoint.tile;
	zone = Trifle.TileInfo.getTerritorialZone(tileInfo);
	if (zone) {
		tile.activeZone = {
			size: zone.size
		}
		if (zone.abilities) {
			zone.abilities.forEach(function(ability) {
				if (ability.type === Trifle.ZoneAbility.canceledWhenInTemple) {
					tile.activeZone.canceled = boardPoint.isType(TEMPLE);
				}
			});
		}
	}
};

Trifle.Board.prototype.applyBoardScanAbilities = function() {
	var self = this;
	/* Clear all */
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			boardPoint.tile.protected = false;
		}
	});
	
	this.tilePresenceAbilities = [];
	this.forEachBoardPointWithTile(function(boardPoint) {
		var tileInfo = TrifleTiles[boardPoint.tile.code];
		self.setTilePresenceAbilitiesForPlayer(boardPoint, boardPoint.tile.ownerName, tileInfo);
		self.applyZoneProtectionAbilityForBoardPoint(boardPoint);
	});
};

Trifle.Board.prototype.applyZoneProtectionAbilityForBoardPoint = function(boardPoint) {
	var tileInfo = TrifleTiles[boardPoint.tile.code];
	var zoneInfo = Trifle.TileInfo.getTerritorialZone(tileInfo);
	if (zoneInfo && zoneInfo.abilities) {
		var self = this;
		zoneInfo.abilities.forEach(function(zoneAbility) {
			if (self.abilityIsActive(boardPoint, boardPoint.tile, tileInfo, zoneAbility)
					&& zoneAbility.type === Trifle.ZoneAbility.protectFriendlyTilesFromCapture) {
				self.applyProtectFriendlyTilesFromCaptureAbility(boardPoint, zoneInfo, zoneAbility);
			}
		});
	}
};
Trifle.Board.prototype.applyProtectFriendlyTilesFromCaptureAbility = function(boardPoint, zoneInfo, zoneAbility) {
	var self = this;
	if (zoneAbility && zoneAbility.targetTileTypes) {
		this.forEachBoardPoint(function(targetPoint) {
			if (targetPoint.hasTile() && targetPoint.tile.ownerName === boardPoint.tile.ownerName) {
				var targetTileInfo = TrifleTiles[targetPoint.tile.code];
				if (Trifle.TileInfo.tileIsOneOfTheseTypes(targetTileInfo, zoneAbility.targetTileTypes)) {
					var distanceAway = self.getDistanceBetweenPoints(boardPoint, targetPoint);
					if (distanceAway <= zoneInfo.size) {
						if (self.isEffectActive(targetPoint, targetTileInfo, boardPoint, zoneAbility)) {
							targetPoint.tile.protected = true;
							debug("I protected tile: " + targetPoint.tile);
						}
					}
				}
			}
		});
	}
};

Trifle.Board.prototype.isEffectActive = function(targetPoint, targetTileInfo, boardPointOfTileGrantingEffect, abilityGrantingEffect) {
	/* Effects defalt to active unless disabled */
	var effectIsActive = true;

	var self = this;
	this.forEachBoardPointWithTile(function(checkBoardPoint) {
		var checkTile = checkBoardPoint.tile;
		var checkTileInfo = TrifleTiles[checkBoardPoint.tile.code];

		/* Check tile zones that can disable effects */
		/* var zoneInfo = Trifle.TileInfo.getTerritorialZone(checkTileInfo);
		if (zoneInfo && zoneInfo.abilities) {
			zoneInfo.abilities.forEach(function(zoneAbilityInfo) {
				if (
					zoneAbilityInfo.type === Trifle.ZoneAbility.removesTileAbilities
					&& (
						(zoneAbilityInfo.targetTeams.includes(Trifle.TileTeam.friendly)
							&& tile.ownerCode === checkBoardPoint.tile.ownerCode)
						|| (zoneAbilityInfo.targetTeams.includes(Trifle.TileTeam.enemy)
							&& tile.ownerCode !== checkBoardPoint.tile.ownerCode)
					) && (
						(
							zoneAbilityInfo.targetTileTypes 
							&& (
								arrayIncludesOneOf(zoneAbilityInfo.targetTileTypes, tileInfo.types)
								|| zoneAbilityInfo.targetTileTypes.includes(Trifle.TileCategory.allTileTypes)
							)
						)
						|| (
							zoneAbilityInfo.targetTileCodes 
							&& zoneAbilityInfo.targetTileCodes.includes(tile.code)
						)
					) && self.pointTileZoneContainsPoint(checkBoardPoint, boardPoint)
				) {
					effectIsActive = false;
					debug("Ability disabled for tile: " + tile.code + " by tile: " + checkBoardPoint.tile.code);
				}
			});
		} */

		/* Check RemoveEffects abilities */
		effectIsActive = effectIsActive && !self.effectIsDisabledByRemoveEffectsAbility(targetPoint, targetTileInfo, boardPointOfTileGrantingEffect, abilityGrantingEffect, checkBoardPoint, checkTileInfo);
	});

	// if (abilityInfo.triggeringBoardState) {
	// 	effectIsActive = false;	// Defaults to inactive unless activated by triggering board state, which we'll check.... now.
	// 	switch (abilityInfo.triggeringBoardState) {
	// 	}
	// }

	return effectIsActive;
};

Trifle.Board.prototype.effectIsDisabledByRemoveEffectsAbility = function(targetPoint, targetTileInfo, boardPointOfTileGrantingEffect, abilityGrantingEffect, checkBoardPoint, checkTileInfo) {
	var effectIsDisabled = false;
	var self = this;
	if (checkTileInfo.abilities && checkTileInfo.abilities.length > 0) {
		checkTileInfo.abilities.forEach(function(checkAbilityInfo) {
			if (checkAbilityInfo.type === Trifle.Ability.removeEffects) {
				if (checkAbilityInfo.targetEffectTypes
						&& arrayIncludesOneOf(checkAbilityInfo.targetEffectTypes, AbilityTypes[abilityGrantingEffect.type])) {
					if (checkAbilityInfo.triggeringBoardState && checkAbilityInfo.triggeringBoardState === Trifle.AbilityTrigger.whileTileInLineOfSight) {
						if (self.targetPointIsInLineOfSightOfThesePoints(targetPoint, [checkBoardPoint])) {
							effectIsDisabled = true;
							debug(checkBoardPoint.tile.code + " has disabled effect granted by " + boardPointOfTileGrantingEffect.tile.code);
						}
					}
				}
			}
		});
	}

	return effectIsDisabled;
};

Trifle.Board.prototype.getDistanceBetweenPoints = function(bp1, bp2) {
	return Math.abs(bp1.row - bp2.row) + Math.abs(bp1.col - bp2.col)
};

Trifle.Board.prototype.putTileOnPoint = function(tile, notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];
	
	point.putTile(tile);
};

Trifle.Board.prototype.getPointFromNotationPoint = function(notationPoint) {
	var rowAndCol = notationPoint.rowAndColumn;
	return this.cells[rowAndCol.row][rowAndCol.col];
};

Trifle.Board.prototype.getSurroundingRowAndCols = function(rowAndCol) {
	var rowAndCols = [];
	for (var row = rowAndCol.row - 1; row <= rowAndCol.row + 1; row++) {
		for (var col = rowAndCol.col - 1; col <= rowAndCol.col + 1; col++) {
			if ((row !== rowAndCol.row || col !== rowAndCol.col)	// Not the center given point
				&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) {	// Not outside range of the grid
				var boardPoint = this.cells[row][col];
				if (!boardPoint.isType(NON_PLAYABLE)) {	// Not non-playable
					rowAndCols.push(new RowAndColumn(row, col));
				}
			}
		}
	}
	return rowAndCols;
};

Trifle.Board.prototype.getSurroundingBoardPoints = function(initialBoardPoint) {
	var surroundingPoints = [];
	for (var row = initialBoardPoint.row - 1; row <= initialBoardPoint.row + 1; row++) {
		for (var col = initialBoardPoint.col - 1; col <= initialBoardPoint.col + 1; col++) {
			if ((row !== initialBoardPoint.row || col !== initialBoardPoint.col)	// Not the center given point
				&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) {	// Not outside range of the grid
				var boardPoint = this.cells[row][col];
				if (!boardPoint.isType(NON_PLAYABLE)) {	// Not non-playable
					surroundingPoints.push(boardPoint);
				}
			}
		}
	}
	return surroundingPoints;
};

Trifle.Board.prototype.getAdjacentRowAndCols = function(rowAndCol) {
	var rowAndCols = [];

	if (rowAndCol.row > 0) {
		var adjacentPoint = this.cells[rowAndCol.row - 1][rowAndCol.col];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			rowAndCols.push(adjacentPoint);
		}
	}
	if (rowAndCol.row < paiShoBoardMaxRowOrCol) {
		var adjacentPoint = this.cells[rowAndCol.row + 1][rowAndCol.col];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			rowAndCols.push(adjacentPoint);
		}
	}
	if (rowAndCol.col > 0) {
		var adjacentPoint = this.cells[rowAndCol.row][rowAndCol.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			rowAndCols.push(adjacentPoint);
		}
	}
	if (rowAndCol.col < paiShoBoardMaxRowOrCol) {
		var adjacentPoint = this.cells[rowAndCol.row][rowAndCol.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE)) {
			rowAndCols.push(adjacentPoint);
		}
	}

	return rowAndCols;
};
Trifle.Board.prototype.getAdjacentPoints = function(boardPointStart) {
	return this.getAdjacentRowAndCols(boardPointStart);
};

/* Old method: Trifle.Board.prototype.getAdjacentPointsPotentialPossibleMoves = function(boardPointStart, movementInfo) {
	var potentialMovePoints = [];

	if (boardPointStart.row > 0) {
		var adjacentPoint = this.cells[boardPointStart.row - 1][boardPointStart.col];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			potentialMovePoints.push(adjacentPoint);
		}
	}
	if (boardPointStart.row < paiShoBoardMaxRowOrCol) {
		var adjacentPoint = this.cells[boardPointStart.row + 1][boardPointStart.col];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			potentialMovePoints.push(adjacentPoint);
		}
	}
	if (boardPointStart.col > 0) {
		var adjacentPoint = this.cells[boardPointStart.row][boardPointStart.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			potentialMovePoints.push(adjacentPoint);
		}
	}
	if (boardPointStart.col < paiShoBoardMaxRowOrCol) {
		var adjacentPoint = this.cells[boardPointStart.row][boardPointStart.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			potentialMovePoints.push(adjacentPoint);
		}
	}

	return potentialMovePoints;
}; */

Trifle.Board.prototype.getAdjacentPointsPotentialPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
	var potentialMovePoints = [];

	if (!pointAlongTheWay) {
		pointAlongTheWay = originPoint;
	}
	var rowDifference = originPoint.row - pointAlongTheWay.row;
	var colDifference = originPoint.col - pointAlongTheWay.col;

	if (pointAlongTheWay.row > 0) {
		potentialMovePoints.push(this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col]);
	}
	if (pointAlongTheWay.row < paiShoBoardMaxRowOrCol) {
		potentialMovePoints.push(this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col]);
	}
	if (pointAlongTheWay.col > 0) {
		potentialMovePoints.push(this.cells[pointAlongTheWay.row][pointAlongTheWay.col - 1]);
	}
	if (pointAlongTheWay.col < paiShoBoardMaxRowOrCol) {
		potentialMovePoints.push(this.cells[pointAlongTheWay.row][pointAlongTheWay.col + 1]);
	}

	var finalPoints = [];

	potentialMovePoints.forEach(function(potentialMovePoint) {
		if (!potentialMovePoint.isType(NON_PLAYABLE) && !potentialMovePoint.isPossibleForMovementType(movementInfo)) {
			var newRowDiff = originPoint.row - potentialMovePoint.row;
			var newColDiff = originPoint.col - potentialMovePoint.col;
			if (!mustPreserveDirection
					|| (rowDifference >= 0 && newRowDiff >= 0 && newColDiff === 0)
					|| (rowDifference <= 0 && newRowDiff <= 0 && newColDiff === 0)
					|| (colDifference >= 0 && newColDiff >= 0 && newRowDiff === 0)
					|| (colDifference <= 0 && newColDiff <= 0 && newRowDiff === 0)
			) {
				finalPoints.push(potentialMovePoint);
			}
		}
	});

	return finalPoints;
};

Trifle.Board.prototype.getAdjacentDiagonalPointsPotentialPossibleMoves = function(pointAlongTheWay, originPoint, mustPreserveDirection, movementInfo) {
	var diagonalPoints = [];

	if (!pointAlongTheWay) {
		pointAlongTheWay = originPoint;
	}
	var rowDifference = originPoint.row - pointAlongTheWay.row;
	var colDifference = originPoint.col - pointAlongTheWay.col;

	if (
			(!mustPreserveDirection || (mustPreserveDirection && rowDifference >= 0 && colDifference >= 0))
			&& (pointAlongTheWay.row > 0 && pointAlongTheWay.col > 0)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && rowDifference <= 0 && colDifference <= 0))
			&& (pointAlongTheWay.row < paiShoBoardMaxRowOrCol && pointAlongTheWay.col < paiShoBoardMaxRowOrCol)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference >= 0 && rowDifference <= 0))
			&& (pointAlongTheWay.col > 0 && pointAlongTheWay.row < paiShoBoardMaxRowOrCol)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row + 1][pointAlongTheWay.col - 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			diagonalPoints.push(adjacentPoint);
		}
	}
	if (
			(!mustPreserveDirection || (mustPreserveDirection && colDifference <= 0 && rowDifference >= 0))
			&& (pointAlongTheWay.col < paiShoBoardMaxRowOrCol && pointAlongTheWay.row > 0)
		) {
		var adjacentPoint = this.cells[pointAlongTheWay.row - 1][pointAlongTheWay.col + 1];
		if (!adjacentPoint.isType(NON_PLAYABLE) && !adjacentPoint.isPossibleForMovementType(movementInfo)) {
			diagonalPoints.push(adjacentPoint);
		}
	}

	return diagonalPoints;
};

Trifle.Board.prototype.calculateSlopeBetweenPoints = function(p1, p2) {
	var rise = p2.row - p1.row;
	var run = p2.col - p1.col;
	var slope = run === 0 ? 0 : rise / run;
	return slope;
};

Trifle.Board.prototype.getNextPointsForTravelShapeMovement = function(movementInfo, moveStepNumber, originPoint, pointAlongTheWay, currentMovementPath, mustPreserveDirection) {
	var nextPoints = [];
	if (movementInfo.shape && movementInfo.shape.length > 0) {
		var travelDirection = movementInfo.shape[moveStepNumber];
		if (moveStepNumber === 0) {
			/* Direction must be 'any' */
			if (travelDirection === Trifle.MoveDirection.any) {
				nextPoints = this.getAdjacentPoints(pointAlongTheWay);
			}
		} else {
			var directionalMovements = this.getDirectionalMovements(currentMovementPath);
			if (directionalMovements[Trifle.MoveDirection.left] 
					&& (travelDirection === Trifle.MoveDirection.left || travelDirection === Trifle.MoveDirection.turn)) {
				nextPoints.push(directionalMovements[Trifle.MoveDirection.left]);
			}
			if (directionalMovements[Trifle.MoveDirection.right]
					&& (travelDirection === Trifle.MoveDirection.right || travelDirection === Trifle.MoveDirection.turn)) {
				nextPoints.push(directionalMovements[Trifle.MoveDirection.right]);
			}
			if (directionalMovements[Trifle.MoveDirection.straight] && travelDirection === Trifle.MoveDirection.straight) {
				nextPoints.push(directionalMovements[Trifle.MoveDirection.straight]);
			}
		}
	}
	return nextPoints;
};

Trifle.Board.prototype.getDirectionalMovements = function(currentMovementPath) {
	var directionalMovements = {};
	if (currentMovementPath.length > 1) {
		var p1 = currentMovementPath[currentMovementPath.length - 2];
		var p2 = currentMovementPath[currentMovementPath.length - 1];

		if (p2.col > p1.col) {
			if (p2.row - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.left] = this.cells[p2.row - 1][p2.col];
			}
			if (p2.row + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.right] = this.cells[p2.row + 1][p2.col];
			}
			if (p2.col + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.straight] = this.cells[p2.row][p2.col + 1];
			}
		} else if (p2.col < p1.col) {
			if (p2.row + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.left] = this.cells[p2.row + 1][p2.col];
			}
			if (p2.row - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.right] = this.cells[p2.row - 1][p2.col];
			}
			if (p2.col - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.straight] = this.cells[p2.row][p2.col - 1];
			}
		} else if (p2.row > p1.row) {
			if (p2.col + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.left] = this.cells[p2.row][p2.col + 1];
			}
			if (p2.col - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.right] = this.cells[p2.row][p2.col - 1];
			}
			if (p2.row + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.straight] = this.cells[p2.row + 1][p2.col];
			}
		} else if (p2.row < p1.row) {
			if (p2.col - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.left] = this.cells[p2.row][p2.col - 1];
			}
			if (p2.col + 1 <= paiShoBoardMaxRowOrCol) {
				directionalMovements[Trifle.MoveDirection.right] = this.cells[p2.row][p2.col + 1];
			}
			if (p2.row - 1 >= 0) {
				directionalMovements[Trifle.MoveDirection.straight] = this.cells[p2.row - 1][p2.col];
			}
		}
	}
	return directionalMovements;
};

Trifle.Board.prototype.getNextPointsForJumpShapeMovement = function(movementInfo, originPoint, pointAlongTheWay, mustPreserveDirection) {
	var pointsStartingWithRowStep = [];
	var pointsStartingWithColStep = [];
	var finalPoints = [];
	var slope = this.calculateSlopeBetweenPoints(originPoint, pointAlongTheWay);
	if (movementInfo.shape && movementInfo.shape.length > 0) {
		/* `shape` should only ever have two numbers, but this will work for any number of numbers. */
		for (var stepNum = 0; stepNum < movementInfo.shape.length; stepNum++) {
			var stepDistance = movementInfo.shape[stepNum];
			if (stepNum === 0) {
				pointsStartingWithRowStep = this.getPointsWithMoveStepAppliedToRow([pointAlongTheWay], stepDistance);
				pointsStartingWithColStep = this.getPointsWithMoveStepAppliedToCol([pointAlongTheWay], stepDistance);
			} else if (stepNum % 2 === 1) {	/* odd: 1,3,5... */
				pointsStartingWithRowStep = this.getPointsWithMoveStepAppliedToCol(pointsStartingWithRowStep, stepDistance);
				pointsStartingWithColStep = this.getPointsWithMoveStepAppliedToRow(pointsStartingWithColStep, stepDistance);
			} else if (stepNum % 2 === 0) {	/* even: 2,4,6... */
				pointsStartingWithRowStep = this.getPointsWithMoveStepAppliedToRow(pointsStartingWithRowStep, stepDistance);
				pointsStartingWithColStep = this.getPointsWithMoveStepAppliedToCol(pointsStartingWithColStep, stepDistance);
			}
		}

		var possibleNextPoints = pointsStartingWithRowStep.concat(pointsStartingWithColStep);
		var self = this;
		var reallyMustPreserveDirection = mustPreserveDirection && slope !== 0;
		possibleNextPoints.forEach(function(point) {
			if (!point.isType(NON_PLAYABLE) && !point.isPossibleForMovementType(movementInfo)
					&& (!reallyMustPreserveDirection || self.calculateSlopeBetweenPoints(pointAlongTheWay, point) === slope)) {
				finalPoints.push(point);
			}
		});
	}

	return finalPoints;
};
Trifle.Board.prototype.getPointsWithMoveStepAppliedToRow = function(startPoints, stepDistance) {
	var nextPoints = [];
	if (startPoints && startPoints.length) {
		var self = this;
		startPoints.forEach(function(boardPointStart) {
			var nextRow1 = boardPointStart.row + stepDistance;
			if (nextRow1 <= paiShoBoardMaxRowOrCol) {
				var possibleNextPoint = self.cells[nextRow1][boardPointStart.col];
				if (!possibleNextPoint.isType(NON_PLAYABLE)) {
					nextPoints.push(possibleNextPoint);
				}
			}
			var nextRow2 = boardPointStart.row - stepDistance;
			if (nextRow2 >= 0) {
				var possibleNextPoint = self.cells[nextRow2][boardPointStart.col];
				if (!possibleNextPoint.isType(NON_PLAYABLE)) {
					nextPoints.push(possibleNextPoint);
				}
			}
		});
	}
	return nextPoints;
};
Trifle.Board.prototype.getPointsWithMoveStepAppliedToCol = function(startPoints, stepDistance) {
	var nextPoints = [];
	if (startPoints && startPoints.length) {
		var self = this;
		startPoints.forEach(function(boardPointStart) {
			var nextCol1 = boardPointStart.col + stepDistance;
			if (nextCol1 <= paiShoBoardMaxRowOrCol) {
				var possibleNextPoint = self.cells[boardPointStart.row][nextCol1];
				if (!possibleNextPoint.isType(NON_PLAYABLE)) {
					nextPoints.push(possibleNextPoint);
				}
			}
			var nextCol2 = boardPointStart.col - stepDistance;
			if (nextCol2 >= 0) {
				var possibleNextPoint = self.cells[boardPointStart.row][nextCol2];
				if (!possibleNextPoint.isType(NON_PLAYABLE)) {
					nextPoints.push(possibleNextPoint);
				}
			}
		});
	}
	return nextPoints;
};

Trifle.Board.prototype.getPointsNextToTilesInLineOfSight = function(movementInfo, originPoint) {
	var jumpPoints = [];
	if (movementInfo.type === Trifle.MovementType.jumpAlongLineOfSight && movementInfo.targetTileTypes) {
		/* Scan in all directions, if a tile found, see if it can be jumped to */
		var tileFound = false;
		for (var row = originPoint.row + 1; row < paiShoBoardMaxRowOrCol && !tileFound; row++) {
			var checkPoint = this.cells[row+1][originPoint.col]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = TrifleTiles[checkPoint.tile.code];
				if (checkPointTileInfo && Trifle.TileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[row][originPoint.col]);
				}
			}
		}

		tileFound = false;
		for (var row = originPoint.row - 1; row > 0 && !tileFound; row--) {
			var checkPoint = this.cells[row-1][originPoint.col]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = TrifleTiles[checkPoint.tile.code];
				if (checkPointTileInfo && Trifle.TileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[row][originPoint.col]);
				}
			}
		}

		tileFound = false;
		for (var col = originPoint.col + 1; col < paiShoBoardMaxRowOrCol && !tileFound; col++) {
			var checkPoint = this.cells[originPoint.row][col+1]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = TrifleTiles[checkPoint.tile.code];
				if (checkPointTileInfo && Trifle.TileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[originPoint.row][col]);
				}
			}
		}

		tileFound = false;
		for (var col = originPoint.col - 1; col > 0 && !tileFound; col--) {
			var checkPoint = this.cells[originPoint.row][col-1]; // Look ahead
			if (checkPoint.hasTile()) {
				tileFound = true;
				var checkPointTileInfo = TrifleTiles[checkPoint.tile.code];
				if (checkPointTileInfo && Trifle.TileInfo.tileIsOneOfTheseTypes(checkPointTileInfo, movementInfo.targetTileTypes)) {
					jumpPoints.push(this.cells[originPoint.row][col]);
				}
			}
		}
	}
	return jumpPoints;
};

Trifle.Board.prototype.getPointsForTilesInLineOfSight = function(originPoint) {
	var lineOfSightPoints = [];
	
	/* Scan in all directions, if a tile found, add to list */
	var tileFound = false;
	for (var row = originPoint.row + 1; row <= paiShoBoardMaxRowOrCol && !tileFound; row++) {
		var checkPoint = this.cells[row][originPoint.col];
		if (checkPoint.hasTile()) {
			tileFound = true;
			lineOfSightPoints.push(this.cells[row][originPoint.col]);
		}
	}

	tileFound = false;
	for (var row = originPoint.row - 1; row >= 0 && !tileFound; row--) {
		var checkPoint = this.cells[row][originPoint.col];
		if (checkPoint.hasTile()) {
			tileFound = true;
			lineOfSightPoints.push(this.cells[row][originPoint.col]);
		}
	}

	tileFound = false;
	for (var col = originPoint.col + 1; col <+ paiShoBoardMaxRowOrCol && !tileFound; col++) {
		var checkPoint = this.cells[originPoint.row][col];
		if (checkPoint.hasTile()) {
			tileFound = true;
			lineOfSightPoints.push(this.cells[originPoint.row][col]);
		}
	}

	tileFound = false;
	for (var col = originPoint.col - 1; col >= 0 && !tileFound; col--) {
		var checkPoint = this.cells[originPoint.row][col];
		if (checkPoint.hasTile()) {
			tileFound = true;
			lineOfSightPoints.push(this.cells[originPoint.row][col]);
		}
	}
	
	return lineOfSightPoints;
};

Trifle.Board.prototype.pointIsOpenGate = function(notationPoint) {
	var point = notationPoint.rowAndColumn;
	point = this.cells[point.row][point.col];

	return point.isOpenGate();
};

Trifle.Board.prototype.moveTile = function(player, notationPointStart, notationPointEnd) {
	this.tilesCapturedByTriggeredAbility = [];
	var startRowCol = notationPointStart.rowAndColumn;
	var endRowCol = notationPointEnd.rowAndColumn;

	if (startRowCol.row < 0 || startRowCol.row > 16 || endRowCol.row < 0 || endRowCol.row > 16) {
		return false;
	}

	var boardPointStart = this.cells[startRowCol.row][startRowCol.col];
	var boardPointEnd = this.cells[endRowCol.row][endRowCol.col];

	var capturedTiles = [];

	/* If movement path is needed, get that */
	var movementPath = null;
	var tileInfo = TrifleTiles[boardPointStart.tile.code];
	/* If tile has only one movement and has charge capture, if there is only one
	|* movement path, then we have all we need to perform the ability. */
	if (Trifle.TileInfo.tileHasOnlyOneMovement(tileInfo)
			&& Trifle.TileInfo.tileHasMovementAbility(tileInfo, Trifle.MovementAbility.chargeCapture)) {
		this.setPossibleMovePoints(boardPointStart);
		movementPath = boardPointEnd.getOnlyPossibleMovementPath();
		debug("Movement Path: ");
		debug(movementPath);
		this.removePossibleMovePoints();

		movementPath.forEach(function(movePathPoint) {
			if (movePathPoint.hasTile() && movePathPoint !== boardPointStart) {
				capturedTiles.push(movePathPoint.removeTile());
			}
		});
	}

	var tile = boardPointStart.removeTile();

	if (!tile) {
		debug("Error: No tile to move!");
	}

	// If tile is capturing a Banner tile, there's a winner
	if (boardPointEnd.hasTile() 
			&& Trifle.TileInfo.tileIsBanner(TrifleTiles[boardPointEnd.tile.code])
			&& tile.ownerName !== boardPointEnd.tile.ownerName) {
		this.winners.push(tile.ownerName);
	}

	if (boardPointEnd.hasTile() && !capturedTiles.includes(boardPointEnd.tile)) {
		capturedTiles.push(boardPointEnd.tile);
	}

	boardPointEnd.putTile(tile);

	this.setPointFlags();

	/* Process abilities after moving a tile */

	/* Follow Order of Abilities and Triggers in Trifle documentation */
	
	this.processAbilities(tile, tileInfo, boardPointStart, boardPointEnd, capturedTiles);

	return {
		movedTile: tile,
		startPoint: boardPointStart,
		endPoint: boardPointEnd,
		capturedTiles: capturedTiles
	}
};

/**
 * Process abilities on the board after a tile is moved or placed/deployed.
 * `boardPointStart` will probably be null for when a tile is placed.
 */
Trifle.Board.prototype.processAbilities = function(tile, tileInfo, boardPointStart, boardPointEnd, capturedTiles) {

	var abilitiesToActivate = [];

	/* 
	- Get abilities that should be active/activated
	- Activate/process them (if already active, skip)
	- Save ongoing active abilities

	Triggers to look at:
	- When Tile Moves From Within Zone
	- When Tile Captures
	- When Tile Lands In Zone
	- While Tile is In Line of Sight
	- While Inside of Temple
	- While Outside of Temple
	... Oh, yeah, it's all of them.. but in that order!

	Actually no, abilities will fire in order based on ability type.
	*/

	var self = this;

	this.forEachBoardPointWithTile(function(pointWithTile) {
		var tile = pointWithTile.tile;
		var tileInfo = TrifleTiles[tile.code];
		if (tileInfo.abilities) {
			tileInfo.abilities.forEach(function(tileAbilityInfo) {
				if (tileAbilityInfo.triggeringBoardStates && tileAbilityInfo.triggeringBoardStates.length) {
					tileAbilityInfo.triggeringBoardStates.forEach(function(triggeringState) {
						var brain = self.brainFactory.createTriggerBrain(triggeringState);
						if (brain && brain.isAbilityActive) {
							if (brain.isAbilityActive(pointWithTile, tile, tileInfo)) {
								abilitiesToActivate.push(new Trifle.Ability(tileAbilityInfo, tile, tileInfo, brain));
							}
						}
					});
				}
			});
		}
	});
	

	// TODO: How to order ability activation?
	var boardHasChanged = false;
	abilitiesToActivate.forEach(function(ability) {
		ability.activateAbility();	// ??????
		if (ability.boardChangedAfterActivation()) {
			boardHasChanged = true;
			return;
		}
	});

	if (!boardHasChanged) {
		/* --- */

		this.applyWhenLandsTriggers(tile, tileInfo, boardPointEnd, capturedTiles);

		if (capturedTiles.length > 0) {
			this.applyWhenCapturingTrigger(tile, tileInfo, boardPointEnd, capturedTiles);
		}

		/* Old abilities... */
		this.applyZoneAbilityToTile(boardPointEnd);
		this.applyBoardScanAbilities();
	}
};

Trifle.Board.prototype.applyWhenLandsTriggers = function(tile, tileInfo, boardPointEnd, capturedTiles) {
	this.applyWhenLandsInZoneTriggers(tile, tileInfo, boardPointEnd, capturedTiles);
	// Other When Lands triggers could go here...
};

Trifle.Board.prototype.applyWhenLandsInZoneTriggers = function(tile, tileInfo, boardPointEnd, capturedTiles) {
	// Get all zones landed in. Get all abilities that trigger.
	var self = this;

	var pointsOfZonesLandedIn = this.getZonesPointIsWithin(boardPointEnd);
	
	pointsOfZonesLandedIn.forEach(function(pointWithZone) {
		debug("Zone landed in: " + pointWithZone.tile.code);
		var zoneTileInfo = TrifleTiles[pointWithZone.tile.code];
		var context = {
			pointOfLandingTile: boardPointEnd,
			pointWithZone: pointWithZone
		};
		var triggeredAbilities = Trifle.TileInfo.getZoneAbilitiesWithAbilityTrigger(zoneTileInfo, Trifle.AbilityTrigger.whenTileLandsInZone);
		triggeredAbilities.forEach(function(triggeredAbility) {
			debug("Triggered ability found: ");
			debug(triggeredAbility);
			self.processAbility(triggeredAbility, context);
		});
	});
};

Trifle.Board.prototype.processAbility = function(ability, context) {
	if (ability.type === Trifle.Ability.captureTiles) {
		if (ability.triggeringAction === Trifle.AbilityTrigger.whenTileLandsInZone) {
			if (ability.targetTileTypes.includes(Trifle.TileCategory.landingTile)
					&& this.tileCanBeCaptured(context.pointWithZone.tile.ownerName, context.pointOfLandingTile)) {
				this.tilesCapturedByTriggeredAbility.push(context.pointOfLandingTile.removeTile());
				debug("Tile captured by triggered ability: ");
				debug(this.tilesCapturedByTriggeredAbility);
				// TODO apply "WhenCapturedTrigger"
			}
		}
	}
};

Trifle.Board.prototype.getZonesPointIsWithin = function(boardPoint) {
	var pointsOfZones = [];
	var self = this;
	this.forEachBoardPointWithTile(function(checkPoint) {
		if (checkPoint != boardPoint
				&& self.pointTileZoneContainsPoint(checkPoint, boardPoint)) {
			pointsOfZones.push(checkPoint);
		}
	});
	return pointsOfZones;
};

Trifle.Board.prototype.applyWhenCapturingTrigger = function(tile, tileInfo, boardPointOfTile, capturedTiles) {
	var triggeredAbilities = Trifle.TileInfo.getAbilitiesWithAbilityTrigger(tileInfo, Trifle.AbilityTrigger.whenCapturing);
	
	var self = this;
	triggeredAbilities.forEach(function(triggeredAbility) {
		// Verify any other trigger criteria here...
		debug("When capturing trigger.. triggered");

		var targetTiles = self.determineWhenCapturingTargetTiles(tile, tileInfo, triggeredAbility, boardPointOfTile, capturedTiles);
		var targetTileTypes = self.determineWhenCapturingTargetTileTypes(tile, tileInfo, triggeredAbility, boardPointOfTile, capturedTiles);
		
		if (triggeredAbility.duration && triggeredAbility.duration > 0) {
			targetTiles.forEach(function(targetTile) {
				self.activateAbility(tile, targetTile, null, triggeredAbility);
			});
			targetTileTypes.forEach(function(targetTileType) {
				self.activateAbility(tile, null, targetTileType, triggeredAbility);
			});
		}
	});
};

Trifle.Board.prototype.determineWhenCapturingTargetTiles = function(tile, tileInfo, triggeredAbility, boardPointOfTile, capturedTiles) {
	/* Currently supports TargetTileType: Trifle.TileCategory.thisTile */
	var targetTiles = [];
	if (triggeredAbility.targetTileTypes && triggeredAbility.targetTileTypes.includes(Trifle.TileCategory.thisTile)) {
		targetTiles.push(tile);
	}
	return targetTiles;
};

Trifle.Board.prototype.determineWhenCapturingTargetTileTypes = function(tile, tileInfo, triggeredAbility, boardPointOfTile, capturedTiles) {
	return [];
};

Trifle.Board.prototype.setPointFlags = function() {
	
};

/* Trifle.Board.prototype.canCapture = function(boardPointStart, boardPointEnd) {
	var tile = boardPointStart.tile;
	var otherTile = boardPointEnd.tile;

	if (tile.ownerName === otherTile.ownerName) {
		return false;	// Cannot capture own tile
	}

	if (otherTile.protected) {
		return false;	// Cannot capture protected tiles
	}

	// Is tile even a tile that can capture at all?
	if (!tile.hasCaptureAbility()) {
		debug(tile.getName() + " cannot capture anything.");
		return false;
	}

	// TODO Check if tile is protected from capture...
	//

	var playerLotusPlayed = this.hostBannerPlayed;
	var otherLotusPlayed = this.guestBannerPlayed;
	if (tile.ownerName === GUEST) {
		playerLotusPlayed = this.guestBannerPlayed;
		otherLotusPlayed = this.hostBannerPlayed;
	}

	// Okay, so the tile is a tile that is able to capture things... 
	// Can the player capture Flower Tiles? (if they've played Lotus)
	if (otherTile.isFlowerTile()) {
		return playerLotusPlayed;
	} else {
		return playerLotusPlayed && otherLotusPlayed;
	}
}; */

Trifle.Board.prototype.inLineWithAdjacentFlowerTileWithNothingBetween = function(bp, bp2) {
	var flowerPoint;

	if (bp.row === bp2.row) {
		// On same row
		var scanFromCol = bp2.col + 1;
		var scanToCol = bp.col;
		
		if (bp.col > bp2.col && bp2.col > 0) {
			flowerPoint = this.cells[bp2.row][bp2.col - 1];
		} else if (bp.col < bp2.col && bp2.col < 16) {
			flowerPoint = this.cells[bp2.row][bp2.col + 1];

			scanFromCol = bp.col + 1;
			scanToCol = bp2.col;
		}

		/* Return false if there's a tile in-between target points */
		for (var checkCol = scanFromCol; checkCol < scanToCol; checkCol++) {
			if (this.cells[bp.row][checkCol].hasTile()) {
				return false;
			}
		}
	} else if (bp.col === bp2.col) {
		// On same col
		var scanFromRow = bp2.row + 1;
		var scanToRow = bp.row;

		if (bp.row > bp2.row && bp2.row > 0) {
			flowerPoint = this.cells[bp2.row - 1][bp2.col];
		} else if (bp.row < bp2.row && bp2.row < 16) {
			flowerPoint = this.cells[bp2.row + 1][bp2.col];

			scanFromRow = bp.row + 1;
			scanToRow = bp2.row;
		}

		/* Return false if there's a tile in-between target points */
		for (var checkRow = scanFromRow; checkRow < scanToRow; checkRow++) {
			if (this.cells[checkRow][bp.col].hasTile()) {
				return false;
			}
		}
	}

	if (flowerPoint && flowerPoint.hasTile()) {
		return flowerPoint.tile.isFlowerTile();
	}
	return false;
};

Trifle.Board.prototype.verifyAbleToReach = function(boardPointStart, boardPointEnd, numMoves, movingTile) {
  // Recursion!
  return this.pathFound(boardPointStart, boardPointEnd, numMoves, movingTile);
};

Trifle.Board.prototype.pathFound = function(boardPointStart, boardPointEnd, numMoves, movingTile) {
  if (!boardPointStart || !boardPointEnd) {
    return false; // start or end point not given
  }

  if (boardPointStart.isType(NON_PLAYABLE) || boardPointEnd.isType(NON_PLAYABLE)) {
  	return false;	// Paths must be through playable points
  }

  if (boardPointStart.row === boardPointEnd.row && boardPointStart.col === boardPointEnd.col) {
    return true; // Yay! start point equals end point
  }
  if (numMoves <= 0) {
    return false; // No more moves left
  }

	// If this point is surrounded by a Chrysanthemum and moving tile is Sky Bison, cannot keep moving.
	if (movingTile.code === 'S' && this.pointIsNextToOpponentTile(boardPointStart, movingTile.ownerCode, 'C')) {
		return false;
	}
  
  // Idea: Get min num moves necessary!
  var minMoves = Math.abs(boardPointStart.row - boardPointEnd.row) + Math.abs(boardPointStart.col - boardPointEnd.col);
  
  if (minMoves === 1) {
    return true; // Yay! Only 1 space away (and remember, numMoves is more than 0)
  }

  // Check moving UP
  var nextRow = boardPointStart.row - 1;
  if (nextRow >= 0) {
    var nextPoint = this.cells[nextRow][boardPointStart.col];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, movingTile)) {
      return true; // Yay!
    }
  }

  // Check moving DOWN
  nextRow = boardPointStart.row + 1;
  if (nextRow < 17) {
    var nextPoint = this.cells[nextRow][boardPointStart.col];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, movingTile)) {
      return true; // Yay!
    }
  }

  // Check moving LEFT
  var nextCol = boardPointStart.col - 1;
  if (nextCol >= 0) {
    var nextPoint = this.cells[boardPointStart.row][nextCol];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, movingTile)) {
      return true; // Yay!
    }
  }

  // Check moving RIGHT
  nextCol = boardPointStart.col + 1;
  if (nextCol < 17) {
    var nextPoint = this.cells[boardPointStart.row][nextCol];
    if (!nextPoint.hasTile() && this.pathFound(nextPoint, boardPointEnd, numMoves - 1, movingTile)) {
      return true; // Yay!
    }
  }
};

Trifle.Board.prototype.pointIsNextToOpponentTile = function(bp, originalPlayerCode, tileCode) {
	var adjacentPoints = this.getAdjacentRowAndCols(bp);
	for (var i = 0; i < adjacentPoints.length; i++) {
		if (adjacentPoints[i].hasTile()
			&& adjacentPoints[i].tile.code === tileCode
			&& adjacentPoints[i].tile.ownerCode !== originalPlayerCode) {
			return true;
		}
	}
	return false;
}

Trifle.Board.prototype.setPossibleMovePoints = function(boardPointStart) {
	if (boardPointStart.hasTile()) {
		var playerName = boardPointStart.tile.ownerName;

		var tileInfo = TrifleTiles[boardPointStart.tile.code];
		if (tileInfo) {
			var self = this;
			if (tileInfo.movements) {
				tileInfo.movements.forEach(function(movementInfo) {
					self.setPossibleMovesForMovement(movementInfo, boardPointStart);
				});
			}
			var bonusMovementInfo = this.getBonusMovementInfo(boardPointStart);
			this.setBonusMovementPossibleMoves(bonusMovementInfo, boardPointStart);
		}
	}
};

Trifle.Board.prototype.getBonusMovementInfo = function(originPoint) {
	var playerName = originPoint.tile.ownerName;
	var tileInfo = TrifleTiles[originPoint.tile.code];
	var bonusMovementInfo = {};
	this.tilePresenceAbilities.forEach(function(ability) {
		if (ability.playerName === playerName) {
			if (ability.abilityInfo.type === Trifle.BoardPresenceAbility.increaseFriendlyTileMovementDistance) {
				if (
						(
							ability.abilityInfo.targetTileTypes 
								&& arrayIncludesOneOf(ability.abilityInfo.targetTileTypes, tileInfo.types)
						)
						|| !ability.abilityInfo.targetTileTypes
					) {
					bonusMovementDistance = ability.abilityInfo.amount;
					bonusMovementInfo = {
						type: Trifle.MovementType.standard,
						distance: bonusMovementDistance,
						movementFunction: Trifle.Board.standardMovementFunction
					}
				}
			}
		}
	});
	if (bonusMovementInfo.type) {
		return bonusMovementInfo;
	}
};

Trifle.Board.prototype.setPossibleMovesForMovement = function(movementInfo, boardPointStart) {
	this.movementPointChecks = 0;
	var isImmobilized = this.tileMovementIsImmobilized(boardPointStart.tile, movementInfo, boardPointStart);
	if (!isImmobilized) {
		if (movementInfo.type === Trifle.MovementType.standard) {
			/* Standard movement, moving and turning as you go */
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], Trifle.Board.standardMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.diagonal) {
			/* Diagonal movement, jumping across the lines up/down/left/right as looking at the board */
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], Trifle.Board.diagonalMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.jumpAlongLineOfSight) {
			/* Jump to tiles along line of sight */
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], Trifle.Board.jumpAlongLineOfSightMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, 1, 0);
		} else if (movementInfo.type === Trifle.MovementType.withinFriendlyTileZone) {
			this.setMovePointsWithinTileZone(boardPointStart, boardPointStart.tile.ownerName, boardPointStart.tile, movementInfo);
		} else if (movementInfo.type === Trifle.MovementType.anywhere) {
			this.setMovePointsAnywhere(boardPointStart, movementInfo);
		} else if (movementInfo.type === Trifle.MovementType.jumpShape) {
			this.setPossibleMovementPointsFromMovePoints([boardPointStart], Trifle.Board.jumpShapeMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, movementInfo.distance, 0);
		} else if (movementInfo.type === Trifle.MovementType.travelShape) {
			this.setPossibleMovementPointsFromMovePointsOnePathAtATime(Trifle.Board.travelShapeMovementFunction, boardPointStart.tile, movementInfo, boardPointStart, boardPointStart, movementInfo.shape.length, 0, [boardPointStart]);
		}
	}
	debug("Movement Point Checks: " + this.movementPointChecks);
};
Trifle.Board.standardMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	var mustPreserveDirection = Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
	return board.getAdjacentPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
};
Trifle.Board.diagonalMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	var mustPreserveDirection = Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
	return board.getAdjacentDiagonalPointsPotentialPossibleMoves(boardPointAlongTheWay, originPoint, mustPreserveDirection, movementInfo);
};
Trifle.Board.jumpAlongLineOfSightMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	return board.getPointsNextToTilesInLineOfSight(movementInfo, originPoint);
};
Trifle.Board.jumpShapeMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber) {
	var mustPreserveDirection = Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
	return board.getNextPointsForJumpShapeMovement(movementInfo, originPoint, boardPointAlongTheWay, mustPreserveDirection);
};
Trifle.Board.travelShapeMovementFunction = function(board, originPoint, boardPointAlongTheWay, movementInfo, moveStepNumber, currentMovementPath) {
	var mustPreserveDirection = Trifle.TileInfo.movementMustPreserveDirection(movementInfo);
	return board.getNextPointsForTravelShapeMovement(movementInfo, moveStepNumber, originPoint, boardPointAlongTheWay, currentMovementPath, mustPreserveDirection);
};

Trifle.Board.prototype.setPossibleMovementPointsFromMovePoints = function(movePoints, nextPossibleMovementPointsFunction, tile, movementInfo, originPoint, distanceRemaining, moveStepNumber) {
	if (distanceRemaining === 0
			|| !movePoints
			|| movePoints.length <= 0) {
		return;	// Complete
	}

	debug("MovePoints: ");
	debug(movePoints);

	var self = this;
	var nextPointsConfirmed = [];
	movePoints.forEach(function(recentPoint) {
		var nextPossiblePoints = nextPossibleMovementPointsFunction(self, originPoint, recentPoint, movementInfo, moveStepNumber);
		nextPossiblePoints.forEach(function(adjacentPoint) {
			self.movementPointChecks++;
			if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
				adjacentPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);
				
				var canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
				
				/* If cannot move through point, then the distance remaining is 0, none! */
				if (!canMoveThroughPoint) {
					adjacentPoint.setMoveDistanceRemaining(movementInfo, 0);
				}
				
				if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
					var movementOk = self.setPointAsPossibleMovement(adjacentPoint, tile, originPoint);
					if (movementOk) {
						adjacentPoint.setPossibleForMovementType(movementInfo);
						if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
							nextPointsConfirmed.push(adjacentPoint);
						}
					}
				} else if (canMoveThroughPoint) {
					nextPointsConfirmed.push(adjacentPoint);
				}
			}
		});
	});

	this.setPossibleMovementPointsFromMovePoints(nextPointsConfirmed,
		nextPossibleMovementPointsFunction, 
		tile, 
		movementInfo, 
		originPoint,
		distanceRemaining - 1,
		moveStepNumber + 1);
};

Trifle.Board.prototype.getPointsMarkedAsPossibleMove = function() {
	var possibleMovePoints = [];
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			possibleMovePoints.push(boardPoint);
		}
	});
	return possibleMovePoints;
};

Trifle.Board.prototype.setPossibleMovementPointsFromMovePointsOnePathAtATime = function(nextPossibleMovementPointsFunction, 
																					tile, 
																					movementInfo, 
																					originPoint, 
																					recentPoint, 
																					distanceRemaining, 
																					moveStepNumber, 
																					currentMovementPath) {
	if (distanceRemaining === 0) {
		return;	// Complete
	}
	var self = this;
	var nextPossiblePoints = nextPossibleMovementPointsFunction(self, originPoint, recentPoint, movementInfo, moveStepNumber, currentMovementPath);
	originPoint.setMoveDistanceRemaining(movementInfo, distanceRemaining);
	nextPossiblePoints.forEach(function(adjacentPoint) {
		self.movementPointChecks++;
		if (!self.canMoveHereMoreEfficientlyAlready(adjacentPoint, distanceRemaining, movementInfo)) {
			var canMoveThroughPoint = self.tileCanMoveThroughPoint(tile, movementInfo, adjacentPoint, recentPoint);
			if (self.tileCanMoveOntoPoint(tile, movementInfo, adjacentPoint, recentPoint)) {
				var movementOk = self.setPointAsPossibleMovement(adjacentPoint, originPoint.tile, originPoint, currentMovementPath);
				if (movementOk) {
					adjacentPoint.setPossibleForMovementType(movementInfo);
					if (!adjacentPoint.hasTile() || canMoveThroughPoint) {
							self.setPossibleMovementPointsFromMovePointsOnePathAtATime(
								nextPossibleMovementPointsFunction,
								tile,
								movementInfo, 
								originPoint,
								adjacentPoint, 
								distanceRemaining - 1,
								moveStepNumber + 1,
								currentMovementPath.concat([adjacentPoint])
							);
					}
				}
			} else if (canMoveThroughPoint) {
				self.setPossibleMovementPointsFromMovePointsOnePathAtATime(
					nextPossibleMovementPointsFunction,
					tile,
					movementInfo, 
					originPoint,
					adjacentPoint, 
					distanceRemaining - 1,
					moveStepNumber + 1,
					currentMovementPath.concat([adjacentPoint])
				);
			}
		}
	});
};

Trifle.Board.prototype.setBonusMovementPossibleMoves = function(bonusMovementInfo, originPoint) {
	if (bonusMovementInfo && bonusMovementInfo.type && bonusMovementInfo.distance && bonusMovementInfo.movementFunction) {
		var possibleMovePoints = this.getPointsMarkedAsPossibleMove();
		possibleMovePoints.push(originPoint);
		var self = this;
		possibleMovePoints.forEach(function(boardPoint) {
			self.setPossibleMovementPointsFromMovePoints([boardPoint], bonusMovementInfo.movementFunction, originPoint.tile, bonusMovementInfo, boardPoint, bonusMovementInfo.distance, 0);
		});
	}
};

Trifle.Board.prototype.setMovePointsAnywhere = function(boardPointStart, movementInfo) {
	var self = this;
	this.forEachBoardPoint(function(boardPoint) {
		if (self.tileCanMoveOntoPoint(boardPointStart.tile, movementInfo, boardPoint, boardPointStart)) {
			self.setPointAsPossibleMovement(boardPoint, boardPointStart.tile, boardPointStart);
		}
	});
};

Trifle.Board.prototype.tileMovementIsImmobilized = function(tile, movementInfo, boardPointStart) {
	return this.tileMovementIsImmobilizedByMovementRestriction(tile, movementInfo, boardPointStart)
		|| this.tileMovementIsImmobilizedByZoneAbility(tile, movementInfo, boardPointStart);
};

Trifle.Board.prototype.tileMovementIsImmobilizedByZoneAbility = function(tileBeingMoved, movementInfo, boardPointStart) {
	var isImmobilized = false;
	var tileBeingMovedInfo = TrifleTiles[tileBeingMoved.code];
	var self = this;
	this.forEachBoardPointWithTile(function(boardPoint) {
		var zoneInfo = Trifle.TileInfo.getTerritorialZone(TrifleTiles[boardPoint.tile.code]);
		if (zoneInfo && zoneInfo.abilities) {
			zoneInfo.abilities.forEach(function(zoneAbility) {
				if (
					self.tileMovementIsImmobilizedByTileZoneAbility(zoneAbility, boardPoint, tileBeingMoved, tileBeingMovedInfo, boardPointStart)
					) {
					isImmobilized = true;
				}
			});
		}
	});
	return isImmobilized;
};

Trifle.Board.prototype.tileMovementIsImmobilizedByTileZoneAbility = function(zoneAbility, tilePoint, tileBeingMoved, tileBeingMovedInfo, movementStartPoint) {
	var isImmobilized = false;
	if (
		zoneAbility.type === Trifle.ZoneAbility.immobilizesOpponentTiles
		&& tilePoint.tile.ownerName !== tileBeingMoved.ownerName
		&& this.pointTileZoneContainsPoint(tilePoint, movementStartPoint)
		&& this.abilityIsActive(tilePoint, tilePoint.tile, TrifleTiles[tilePoint.tile.code], zoneAbility)
		) {
		if (zoneAbility.targetTileCodes) {
			if (zoneAbility.targetTileCodes.includes(tileBeingMoved.code)) {
				isImmobilized = true;
			}
		} else {
			isImmobilized = true;
		}
	}

	if (
		zoneAbility.type === Trifle.ZoneAbility.immobilizesTiles
		&& this.pointTileZoneContainsPoint(tilePoint, movementStartPoint)
		&& this.abilityIsActive(tilePoint, tilePoint.tile, TrifleTiles[tilePoint.tile.code], zoneAbility)
	) {
		if (zoneAbility.targetTeams) {
			if (
				(zoneAbility.targetTeams.includes(Trifle.TileTeam.enemy)
					&& tilePoint.tile.ownerName !== tileBeingMoved.ownerName)
				||
				(zoneAbility.targetTeams.includes(Trifle.TileTeam.friendly)
					&& tilePoint.tile.ownerName === tileBeingMoved.ownerName)
			) {
				if (zoneAbility.targetTileCodes) {
					if (zoneAbility.targetTileCodes.includes(tileBeingMoved.code)) {
						isImmobilized = true;
					}
				} else if (zoneAbility.targetTileTypes) {
					if (arrayIncludesOneOf(tileBeingMovedInfo.types, zoneAbility.targetTileTypes)) {
						if (zoneAbility.targetTileIdentifiers) {
							if (tileBeingMovedInfo.identifiers 
									&& arrayIncludesOneOf(tileBeingMovedInfo.identifiers, zoneAbility.targetTileIdentifiers)) {
								isImmobilized = true;
							}
						} else {
							isImmobilized = true;
						}
					}
				}
			}
		}
	}

	return isImmobilized;
};

Trifle.Board.prototype.tileMovementIsImmobilizedByMovementRestriction = function(tile, movementInfo, boardPointStart) {
	var isImmobilized = false;
	if (tile && movementInfo.restrictions) {
		var self = this;
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === Trifle.MovementRestriction.immobilizedByOpponentTileZones) {
				movementRestriction.affectingTiles.forEach(function(affectingTileCode) {
					isImmobilized = self.pointIsInTargetTileZone(boardPointStart, affectingTileCode, getOpponentName(tile.ownerName));
				});
			}
		});
	}
	return isImmobilized;
};

/**
 * Check if given boardPoint is within the zone of target tile belonging to zoneOwner.
 **/
Trifle.Board.prototype.pointIsInTargetTileZone = function(boardPoint, targetTileCode, zoneOwner) {
	var insideTileZone = false;

	var targetTilePoints = this.getTilePoints(targetTileCode, zoneOwner);
	if (targetTilePoints.length > 0) {
		var self = this;
		targetTilePoints.forEach(function(targetTilePoint) {
			if (self.pointTileZoneContainsPoint(targetTilePoint, boardPoint)) {
				insideTileZone = true;
				return;
			}
		});
	}

	return insideTileZone;
};

Trifle.Board.prototype.getTilePoints = function(tileCode, ownerName) {
	var points = [];
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()
				&& boardPoint.tile.code === tileCode
				&& boardPoint.tile.ownerName === ownerName) {
			points.push(boardPoint);
		}
	});
	return points;
};

Trifle.Board.prototype.getPointsForTileCodes = function(tileCodes, ownerName) {
	var points = [];
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()
				&& tileCodes.includes(boardPoint.tile.code)
				&& boardPoint.tile.ownerName === ownerName) {
			points.push(boardPoint);
		}
	});
	return points;
};

Trifle.Board.prototype.canMoveHereMoreEfficientlyAlready = function(boardPoint, distanceRemaining, movementInfo) {
	return boardPoint.getMoveDistanceRemaining(movementInfo) >= distanceRemaining;
};

Trifle.Board.prototype.tileCanMoveOntoPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	var tileInfo = TrifleTiles[tile.code];
	var canCaptureTarget = this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
	return (!targetPoint.hasTile() || canCaptureTarget)
		&& (!targetPoint.isType(TEMPLE) || canCaptureTarget)
		&& !this.tileZonedOutOfSpace(tile, movementInfo, targetPoint)
		&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint);
};

Trifle.Board.prototype.targetPointIsEmptyOrCanBeCaptured = function(tile, movementInfo, fromPoint, targetPoint) {
	return !targetPoint.hasTile() 
		|| this.targetPointHasTileTileThatCanBeCaptured(tile, movementInfo, fromPoint, targetPoint);
};

Trifle.Board.prototype.targetPointHasTileTileThatCanBeCaptured = function(tile, movementInfo, fromPoint, targetPoint) {
	return targetPoint.hasTile() 
		&& this.tileCanCapture(tile, movementInfo, fromPoint, targetPoint)
		&& !this.tileHasActiveCaptureProtectionFromCapturingTile(targetPoint.tile, tile);
};

Trifle.Board.prototype.tileHasActiveCaptureProtectionFromCapturingTile = function(tile, capturingTile) {
	var tileHasActiveCaptureProtection = false;
	this.activeDurationAbilities.forEach(function(durationAbilityEntry) {
		debug("Active Duration Ability: ");
		debug(durationAbilityEntry);
		if (durationAbilityEntry.targetTile === tile) {	// OR target TileTypeMatches tile
			debug("Yes, for this tile");
			var capturingTileInfo = TrifleTiles[capturingTile.code];
			if (durationAbilityEntry.ability.type === Trifle.Ability.protectFromCapture) {
				if ((durationAbilityEntry.ability.tileTypesProtectedFrom
					&& arrayIncludesOneOf(durationAbilityEntry.ability.tileTypesProtectedFrom, capturingTileInfo.types))
					||
					(durationAbilityEntry.ability.tileTypesProtectedFrom
						&& durationAbilityEntry.ability.tileTypesProtectedFrom.includes(Trifle.TileCategory.allTileTypes))
					||
					(durationAbilityEntry.ability.tilesProtectedFrom
					&& durationAbilityEntry.ability.tilesProtectedFrom.includes(capturingTile.code))
				) {
					tileHasActiveCaptureProtection = true;
					return;
				}
			}
		}
	});
	return tileHasActiveCaptureProtection;
};

Trifle.Board.prototype.tileCanCapture = function(tile, movementInfo, fromPoint, targetPoint) {
	var playerBannerPlayed = this.hostBannerPlayed;
	var otherBannerPlayed = this.guestBannerPlayed;
	if (tile.ownerName === GUEST) {
		playerBannerPlayed = this.guestBannerPlayed;
		otherBannerPlayed = this.hostBannerPlayed;
	}

	var targetTile = targetPoint.tile;
	var targetTileInfo = TrifleTiles[targetTile.code];

	return targetTileInfo 
		&& movementInfo 
		&& movementInfo.captureTypes
		&& movementInfo.captureTypes.includes(Trifle.CaptureType.all)
		&& (
			(playerBannerPlayed 
				&& Trifle.TileInfo.tileIsOneOfTheseTypes(targetTileInfo, [Trifle.TileType.flower, Trifle.TileType.banner])
			)
			|| (playerBannerPlayed && otherBannerPlayed)
		)
		&& this.tilesBelongToDifferentOwnersOrTargetTileHasFriendlyCapture(tile, targetTile, targetTileInfo) // TODO
		&& !targetPoint.tile.protected;
};

/** Can a tile be captured by a Capture ability? */
Trifle.Board.prototype.tileCanBeCaptured = function(capturingPlayer, targetPoint) {
	var playerBannerPlayed = this.hostBannerPlayed;
	var otherBannerPlayed = this.guestBannerPlayed;
	if (capturingPlayer === GUEST) {
		playerBannerPlayed = this.guestBannerPlayed;
		otherBannerPlayed = this.hostBannerPlayed;
	}

	var targetTile = targetPoint.tile;
	var targetTileInfo = TrifleTiles[targetTile.code];

	return targetTileInfo 
		&& (
			(playerBannerPlayed 
				&& Trifle.TileInfo.tileIsOneOfTheseTypes(targetTileInfo, [Trifle.TileType.flower, Trifle.TileType.banner])
			)
			|| (playerBannerPlayed && otherBannerPlayed)
		)
		&& !targetPoint.tile.protected;
};

Trifle.Board.prototype.tilesBelongToDifferentOwnersOrTargetTileHasFriendlyCapture = function(tile, targetTile, targetTileInfo) {
	return tile.ownerName !== targetTile.ownerName
		|| Trifle.TileInfo.tileCanBeCapturedByFriendlyTiles(targetTileInfo);
};

Trifle.Board.prototype.tileCanMoveThroughPoint = function(tile, movementInfo, targetPoint, fromPoint) {
	var tileInfo = TrifleTiles[tile.code];
	return tileInfo
		&& (!targetPoint.hasTile()
				|| this.movementInfoHasAbility(movementInfo, Trifle.MovementAbility.jumpOver)
				|| (this.movementInfoHasAbility(movementInfo, Trifle.MovementAbility.chargeCapture) && this.tileCanMoveOntoPoint(tile, movementInfo, targetPoint, fromPoint))
			)
		&& !this.tileMovementIsImmobilized(tile, movementInfo, fromPoint);
};

Trifle.Board.prototype.movementInfoHasAbility = function(movementInfo, movementAbilityType) {
	var matchFound = false;
	if (movementInfo && movementInfo.abilities) {
		movementInfo.abilities.forEach(function(abilityInfo) {
			if (abilityInfo.type === movementAbilityType) {
				matchFound = true;
				return;
			}
		})
	}
	return matchFound;
};

Trifle.Board.prototype.tileZonedOutOfSpace = function(tile, movementInfo, targetPoint) {
	var isZonedOut = this.tileZonedOutOfSpaceByMovementRestriction(tile, movementInfo, targetPoint);
	
	isZonedOut = isZonedOut || this.tileZonedOutOfSpaceByZoneAbility(tile.code, tile.ownerName, targetPoint);

	return isZonedOut;
};

Trifle.Board.prototype.tileZonedOutOfSpaceByZoneAbility = function(tileCode, ownerName, targetPoint, originPoint) {
	var isZonedOut = false;

	var tileOwnerCode = getPlayerCodeFromName(ownerName);
	var tileInfo = TrifleTiles[tileCode];

	var self = this;

	this.forEachBoardPointWithTile(function(checkBoardPoint) {
		var checkTileInfo = TrifleTiles[checkBoardPoint.tile.code];

		/* Check tile zones that can restrict movement to targetPoint */
		var zoneInfo = Trifle.TileInfo.getTerritorialZone(checkTileInfo);
		if (zoneInfo && zoneInfo.abilities) {
			zoneInfo.abilities.forEach(function(zoneAbilityInfo) {
				var abilityIsActive = self.abilityIsActive(checkBoardPoint, checkBoardPoint.tile, checkTileInfo, zoneAbilityInfo);
				if (
					(
						zoneAbilityInfo.type === Trifle.ZoneAbility.restrictMovementWithinZone
					) && (	// Zone ability target team matches
						(zoneAbilityInfo.targetTeams.includes(Trifle.TileTeam.friendly)
							&& tileOwnerCode === checkBoardPoint.tile.ownerCode)
						|| (zoneAbilityInfo.targetTeams.includes(Trifle.TileTeam.enemy)
							&& tileOwnerCode !== checkBoardPoint.tile.ownerCode)
					) && (
						(	// Zone ability target tile types matches, if present
							zoneAbilityInfo.targetTileTypes 
							&& (
								arrayIncludesOneOf(zoneAbilityInfo.targetTileTypes, tileInfo.types)
								|| zoneAbilityInfo.targetTileTypes.includes(Trifle.TileCategory.allTileTypes)
							)
						)
						|| (	// OR zone ability target tiles matches, if present
							zoneAbilityInfo.targetTileCodes 
							&& zoneAbilityInfo.targetTileCodes.includes(tileCode)
						)
					) && (
						self.pointTileZoneContainsPoint(checkBoardPoint, targetPoint)
					) && (
						abilityIsActive
					) && (	// If deploy (no originPoint) or tile origin was inside zone and movement is unable to escape zone, allow it to move farther away from center
						!originPoint
						|| (
							true
						)
					)
				) {
					isZonedOut = true;
					debug("Zoned out! For tile: " + tileCode + " by tile: " + checkBoardPoint.tile.code);
				}
			});
		}
	});

	return isZonedOut;
};

Trifle.Board.prototype.tileZonedOutOfSpaceByMovementRestriction = function(tile, movementInfo, targetPoint) {
	var isZonedOut = false;
	if (movementInfo.restrictions && movementInfo.restrictions.length > 0) {
		var self = this;
		movementInfo.restrictions.forEach(function(movementRestriction) {
			if (movementRestriction.type === Trifle.MovementRestriction.restrictedByOpponentTileZones) {
				movementRestriction.affectingTiles.forEach(function(affectingTileCode) {
					isZonedOut = self.pointIsInTargetTileZone(targetPoint, affectingTileCode, getOpponentName(tile.ownerName));
				});
			}
		});
	}
	return isZonedOut;
};

Trifle.Board.prototype.tileInfoHasMovementType = function(tileInfo, movementType) {
	var movementTypeFound = false;
	tileInfo.movements.forEach(function(movementInfo) {
		if (movementInfo.type === movementType) {
			movementTypeFound = true;
		}
	});
	return movementTypeFound;
};

Trifle.Board.prototype.removePossibleMovePoints = function() {
	this.forEachBoardPoint(function(boardPoint) {
		boardPoint.removeType(POSSIBLE_MOVE);
		boardPoint.clearPossibleMovementTypes();
		boardPoint.clearPossibleMovementPaths();
	});
};

Trifle.Board.prototype.getFireLilyPoint = function(player) {
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile()) {
				if (bp.tile.ownerName === player && bp.tile.code === 'F') {
					return bp;
				}
			}
		}
	}
};

Trifle.Board.prototype.getFireLilyPoints = function(player) {
	var points = [];
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (bp.hasTile()) {
				if (bp.tile.ownerName === player && bp.tile.code === 'F') {
					points.push(bp);
				}
			}
		}
	}
	return points;
};

Trifle.Board.prototype.setDeployPointsPossibleMoves = function(player, tileCode) {
	var tileInfo = TrifleTiles[tileCode];
	if (!tileInfo) {
		debug("You need the tileInfo for " + tileCode);
	}

	var self = this;

	if (tileInfo && tileInfo.specialDeployTypes) {
		tileInfo.specialDeployTypes.forEach(function(specialDeployInfo) {
			self.setDeployPointsPossibleForSpecialDeploy(player, tileCode, tileInfo, specialDeployInfo);
		});
	}

	if (tileInfo && tileInfo.deployTypes) {
		if (tileInfo.deployTypes.includes(Trifle.DeployType.anywhere)) {
			this.forEachBoardPoint(function(boardPoint) {
				if (!boardPoint.hasTile()
						&& !boardPoint.isType(GATE)
						&& !self.tileZonedOutOfSpaceByZoneAbility(tileCode, player, boardPoint, null)) {
					boardPoint.addType(POSSIBLE_MOVE);
				}
			});
		}

		if (tileInfo.deployTypes.includes(Trifle.DeployType.temple)) {
			this.forEachBoardPoint(function(boardPoint) {
				if (!boardPoint.hasTile()
						&& boardPoint.isType(GATE)
						&& !self.tileZonedOutOfSpaceByZoneAbility(tileCode, player, boardPoint)) {
					boardPoint.addType(POSSIBLE_MOVE);
				}
			});
		}

		if (tileInfo.deployTypes.includes(Trifle.DeployType.adjacentToTemple)) {
			this.forEachBoardPoint(function(templePoint) {
				if (!templePoint.hasTile() && templePoint.isType(TEMPLE)) {
					var adjacentToTemplePoints = self.getAdjacentPoints(templePoint);
					adjacentToTemplePoints.forEach(function(pointAdjacentToTemple) {
						if (!pointAdjacentToTemple.hasTile()
							&& !self.tileZonedOutOfSpaceByZoneAbility(tileCode, player, pointAdjacentToTemple)) {
							pointAdjacentToTemple.addType(POSSIBLE_MOVE);
						}
					});
				}
			});
		}
	}
};

Trifle.Board.prototype.setDeployPointsPossibleForSpecialDeploy = function(player, tileCode, tileInfo, specialDeployInfo) {
	if (specialDeployInfo.type === Trifle.SpecialDeployType.withinFriendlyTileZone) {
		this.setDeployPointsWithinTileZone(player, tileCode, tileInfo, specialDeployInfo);
	}
};

Trifle.Board.prototype.setDeployPointsWithinTileZone = function(zoneOwner, tileCode, tileInfo, specialDeployInfo) {
	if (specialDeployInfo.targetTileCodes && specialDeployInfo.targetTileCodes.length > 0) {
		var self = this;
		this.forEachBoardPoint(function(targetPoint) {
			if (!targetPoint.hasTile() && !targetPoint.isType(TEMPLE)
					&& self.pointIsWithinZoneOfOneOfTheseTiles(targetPoint, specialDeployInfo.targetTileCodes, zoneOwner)
					&& !self.tileZonedOutOfSpaceByZoneAbility(tileCode, zoneOwner, targetPoint)) {
				targetPoint.addType(POSSIBLE_MOVE);
			}
		});
	}
};

Trifle.Board.prototype.setMovePointsWithinTileZone = function(boardPointStart, zoneOwner, tileBeingMoved, movementInfo) {
	if (movementInfo.targetTileCodes && movementInfo.targetTileCodes.length > 0) {
		var self = this;
		var pointsOfZoneTiles = this.getPointsForTileCodes(movementInfo.targetTileCodes, zoneOwner);
		this.forEachBoardPoint(function(targetPoint) {
			var startAndEndPointAreInSameZone = self.oneOfTheseZonesContainsPoints(pointsOfZoneTiles, [boardPointStart, targetPoint]);
			if (startAndEndPointAreInSameZone
					&& self.tileCanMoveOntoPoint(tileBeingMoved, movementInfo, targetPoint, null)) {
				self.setPointAsPossibleMovement(targetPoint, tileBeingMoved, boardPointStart);
			}
		});
	}
};

Trifle.Board.prototype.setPointAsPossibleMovement = function(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	// Enforce the drawing-towards abilities, etc

	var movementOk = false;

	/* Enforce Trifle.BoardPresenceAbility.drawOpponentTilesInLineOfSight */
	var movementOk = this.movementPassesLineOfSightTest(targetPoint, tileBeingMoved, originPoint);
	/* var movementOk = this.movementAllowedByAffectingAbilities(targetPoint, tileBeingMoved, originPoint, currentMovementPath); */

	// Future... movementOk = movementOk && this.movementcheckmethod(...)

	if (movementOk) {
		targetPoint.addType(POSSIBLE_MOVE);
	}

	if (currentMovementPath) {
		targetPoint.addPossibleMovementPath(currentMovementPath);
	}

	return movementOk;
};

/* Trifle.Board.prototype.movementAllowedByAffectingAbilities = function(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	var movementOk = true;

	// Check for abilities that hinder the movement and verify movement to targetPoint is allowed

	// LureTiles
	movementOk = movementOk && this.lureTilesCheck(targetPoint, tileBeingMoved, originPoint, currentMovementPath);

	return movementOk;
}; */

/* Trifle.Board.prototype.lureTilesCheck = function(targetPoint, tileBeingMoved, originPoint, currentMovementPath) {
	// Is a LureTiles ability active on the board?
}; */

Trifle.Board.prototype.movementPassesLineOfSightTest = function(targetPoint, tileBeingMoved, originPoint) {
	var pointsToMoveTowards = [];
	var movementPassesLineOfSightTest = true;
	var lineOfSightPoints = this.getPointsForTilesInLineOfSight(originPoint);
	var self = this;
	lineOfSightPoints.forEach(function(lineOfSightPoint) {
		if (lineOfSightPoint.hasTile()) {
			var lineOfSightTileInfo = TrifleTiles[lineOfSightPoint.tile.code];
			// todo... ability active? etc...
			/* While Tiles in Line of Sight trigger */
		}

		// if (lineOfSightPoint.hasTile() && lineOfSightPoint.tile.ownerName !== tileBeingMoved.ownerName) {
		// 	var lineOfSightTileInfo = TrifleTiles[lineOfSightPoint.tile.code];
		// 	if (Trifle.TileInfo.tileHasDrawTilesInLineOfSightAbility(lineOfSightTileInfo)) {
		// 		pointsToMoveTowards.push(lineOfSightPoint);
		// 		/* Movement OK if:
		// 			- Target Point is in line of sight of affecting tile
		// 			- Tile will be closer to affecting tile than it was where it started
		// 			- Tile be closer to where it started than the affecting tile was (did not move past the affecting tile) */
		// 		movementPassesLineOfSightTest = self.targetPointIsInLineOfSightOfThesePoints(targetPoint, [lineOfSightPoint])
		// 			&& self.targetPointIsCloserToThesePointsThanOriginPointIs(targetPoint, [lineOfSightPoint], originPoint)
		// 			&& self.getDistanceBetweenPoints(originPoint, targetPoint) < self.getDistanceBetweenPoints(originPoint, lineOfSightPoint);
		// 		if (!movementPassesLineOfSightTest) {
		// 			return false;
		// 		}
		// 	}
		// }
	});

	return movementPassesLineOfSightTest;
};

Trifle.Board.prototype.targetPointIsInLineOfSightOfThesePoints = function(targetPoint, checkPoints) {
	var checkPointsInLineOfSight = 0;
	var lineOfSightPoints = this.getPointsForTilesInLineOfSight(targetPoint);
	lineOfSightPoints.forEach(function(targetLineOfSightPoint) {
		if (checkPoints.includes(targetLineOfSightPoint)) {
			checkPointsInLineOfSight++;
		}
	});
	return checkPointsInLineOfSight === checkPoints.length;
};

Trifle.Board.prototype.targetPointIsCloserToThesePointsThanOriginPointIs = function(targetPoint, checkPoints, originPoint) {
	var isCloserToAllCheckPoints = true;
	var self = this;
	checkPoints.forEach(function(checkPoint) {
		var targetPointDistance = self.getDistanceBetweenPoints(targetPoint, checkPoint);
		var originPointDistance = self.getDistanceBetweenPoints(originPoint, checkPoint);
		if (targetPointDistance >= originPointDistance) {
			isCloserToAllCheckPoints = false;
		}
	});
	return isCloserToAllCheckPoints;
};

Trifle.Board.prototype.oneOfTheseZonesContainsPoints = function(pointsWithZones, targetPoints) {
	var self = this;
	var zoneContainingPointsFound = false;
	pointsWithZones.forEach(function(pointWithZone) {
		var targetPointsAreInZone = true;
		targetPoints.forEach(function(targetPoint) {
			targetPointsAreInZone = targetPointsAreInZone && self.pointTileZoneContainsPoint(pointWithZone, targetPoint);
		});
		if (targetPointsAreInZone) {
			zoneContainingPointsFound = true;
			return;
		}
	});
	return zoneContainingPointsFound;
};

Trifle.Board.prototype.pointTileZoneContainsPoint = function(pointWithZone, targetPoint) {
	return pointWithZone.hasTile() 
			&& pointWithZone.tile.activeZone 
			&& !pointWithZone.tile.activeZone.canceled 
			&& this.getDistanceBetweenPoints(pointWithZone, targetPoint) <= pointWithZone.tile.activeZone.size;
};

Trifle.Board.prototype.pointIsWithinZoneOfOneOfTheseTiles = function(targetPoint, tileCodes, zoneOwner) {
	var isInTheZone = false;
	if (tileCodes && tileCodes.length > 0) {
		var self = this;
		tileCodes.forEach(function(tileCode) {
			if (self.pointIsInTargetTileZone(targetPoint, tileCode, zoneOwner)) {
				isInTheZone = true;
				return;
			}
		});
	}
	return isInTheZone;
};

Trifle.Board.prototype.forEachBoardPoint = function(forEachFunc) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				forEachFunc(boardPoint);
			}
		});
	});
};
Trifle.Board.prototype.forEachBoardPointDoMany = function(forEachFuncList) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				forEachFuncList.forEach(function(forEachFunc) {
					forEachFunc(boardPoint);
				});
			}
		});
	});
};
Trifle.Board.prototype.forEachBoardPointWithTile = function(forEachFunc) {
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			forEachFunc(boardPoint);
		}
	});
};

Trifle.Board.prototype.setGuestGateOpen = function() {
	var row = 16;
	var col = 8;
	if (this.cells[row][col].isOpenGate()) {
		this.cells[row][col].addType(POSSIBLE_MOVE);
	}
};

Trifle.Board.prototype.activateAbility = function(tileOwningAbility, targetTile, targetTileType, abilityInfo) {
	if (abilityInfo.duration && abilityInfo.duration > 0) {
		abilityInfo.active = true;
		abilityInfo.remainingDuration = abilityInfo.duration;
		this.activeDurationAbilities.push({
			grantingTile: tileOwningAbility,
			targetTile: targetTile,
			targetTileType: targetTileType,
			ability: abilityInfo
		});
		debug("Activated ability!");
		debug(abilityInfo);
	}
};

Trifle.Board.prototype.tickDurationAbilities = function() {
	for (var i = this.activeDurationAbilities.length - 1; i >= 0; i--) {
		var durationAbilityDetails = this.activeDurationAbilities[i];
		var durationAbilityInfo = durationAbilityDetails.ability;
		durationAbilityInfo.remainingDuration -= 0.5;
		if (durationAbilityInfo.remainingDuration <= 0) {
			durationAbilityInfo.active = false;
			this.activeDurationAbilities.splice(i, 1);
			debug("Ability deactivated!");
			debug(durationAbilityInfo);
		}
	}
};




