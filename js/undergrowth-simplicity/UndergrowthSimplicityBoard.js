// Undergrowth Simplicity Board - Core game logic

import {
	GATE,
	NON_PLAYABLE,
	POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { GUEST, HOST, NotationPoint, RowAndColumn } from '../CommonNotationObjects';
import { PaiShoBoardHelper } from '../pai-sho-common/PaiShoBoardHelp';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import { UndergrowthSimplicityBoardPoint, CENTER_POINT } from './UndergrowthSimplicityBoardPoint';
import { debug } from '../GameData';

export function UndergrowthSimplicityBoard() {
	this.size = new RowAndColumn(17, 17);
	this.boardHelper = new PaiShoBoardHelper(UndergrowthSimplicityBoardPoint, this.size);
	this.cells = this.brandNew();

	// Mark center point as non-playable and LOS-blocking
	this.cells[8][8].addType(CENTER_POINT);

	this.connections = [];
	this.gateOwners = {}; // key: "row,col" => playerName
}

UndergrowthSimplicityBoard.prototype.brandNew = function() {
	return this.boardHelper.generateBoardCells();
};

// ============ Board iteration helpers ============

UndergrowthSimplicityBoard.prototype.forEachBoardPoint = function(forEachFunc) {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			if (!boardPoint.isType(NON_PLAYABLE)) {
				forEachFunc(boardPoint);
			}
		});
	});
};

UndergrowthSimplicityBoard.prototype.forEachBoardPointWithTile = function(forEachFunc) {
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile()) {
			forEachFunc(boardPoint);
		}
	});
};

// ============ Line of Sight ============

// Returns the first tile visible in given direction from (row, col)
// Stops at any tile (regardless of color), center point, or board edge
// Returns {row, col, tile} or null
UndergrowthSimplicityBoard.prototype.getVisibleTileInDirection = function(row, col, dRow, dCol) {
	var r = row + dRow;
	var c = col + dCol;
	while (r >= 0 && r <= 16 && c >= 0 && c <= 16) {
		var bp = this.cells[r][c];
		if (bp.isType(NON_PLAYABLE)) {
			r += dRow;
			c += dCol;
			continue;
		}
		// Center point blocks LOS
		if (bp.isType(CENTER_POINT)) {
			return null;
		}
		if (bp.hasTile()) {
			return { row: r, col: c, tile: bp.tile };
		}
		r += dRow;
		c += dCol;
	}
	return null;
};

// ============ Connection Analysis ============

UndergrowthSimplicityBoard.prototype.analyzeConnections = function() {
	this.connections = [];

	var self = this;

	// Clear inConnection flags
	this.forEachBoardPointWithTile(function(bp) {
		bp.tile.inConnection = false;
	});

	// Only check right and down to avoid duplicates
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			var bp = this.cells[row][col];
			if (!bp.hasTile() || bp.isType(NON_PLAYABLE)) continue;

			// Check right
			var rightVisible = this.getVisibleTileInDirection(row, col, 0, 1);
			if (rightVisible && rightVisible.tile.ownerName === bp.tile.ownerName) {
				this.connections.push({
					tile1Pos: new RowAndColumn(row, col),
					tile2Pos: new RowAndColumn(rightVisible.row, rightVisible.col),
					ownerName: bp.tile.ownerName,
					tile1: bp.tile,
					tile2: rightVisible.tile
				});
				bp.tile.inConnection = true;
				rightVisible.tile.inConnection = true;
			}

			// Check down
			var downVisible = this.getVisibleTileInDirection(row, col, 1, 0);
			if (downVisible && downVisible.tile.ownerName === bp.tile.ownerName) {
				this.connections.push({
					tile1Pos: new RowAndColumn(row, col),
					tile2Pos: new RowAndColumn(downVisible.row, downVisible.col),
					ownerName: bp.tile.ownerName,
					tile1: bp.tile,
					tile2: downVisible.tile
				});
				bp.tile.inConnection = true;
				downVisible.tile.inConnection = true;
			}
		}
	}

	this.markSpacesBetweenConnections();
};

// ============ Mark spaces between connections (visual indicators) ============

UndergrowthSimplicityBoard.prototype.markSpacesBetweenConnections = function() {
	// Unmark all
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.betweenConnection = false;
			boardPoint.betweenConnectionHost = false;
			boardPoint.betweenConnectionGuest = false;
		});
	});

	var self = this;
	this.connections.forEach(function(conn) {
		if (conn.tile1Pos.row === conn.tile2Pos.row) {
			// Same row - mark columns between
			var row = conn.tile1Pos.row;
			var firstCol = Math.min(conn.tile1Pos.col, conn.tile2Pos.col);
			var lastCol = Math.max(conn.tile1Pos.col, conn.tile2Pos.col);
			for (var col = firstCol + 1; col < lastCol; col++) {
				self.cells[row][col].betweenConnection = true;
				if (conn.ownerName === HOST) {
					self.cells[row][col].betweenConnectionHost = true;
				}
				if (conn.ownerName === GUEST) {
					self.cells[row][col].betweenConnectionGuest = true;
				}
			}
		} else if (conn.tile1Pos.col === conn.tile2Pos.col) {
			// Same column - mark rows between
			var col = conn.tile1Pos.col;
			var firstRow = Math.min(conn.tile1Pos.row, conn.tile2Pos.row);
			var lastRow = Math.max(conn.tile1Pos.row, conn.tile2Pos.row);
			for (var row = firstRow + 1; row < lastRow; row++) {
				self.cells[row][col].betweenConnection = true;
				if (conn.ownerName === HOST) {
					self.cells[row][col].betweenConnectionHost = true;
				}
				if (conn.ownerName === GUEST) {
					self.cells[row][col].betweenConnectionGuest = true;
				}
			}
		}
	});
};

// ============ Supply Line Check (BFS from gates) ============

// Returns Set of "row,col" strings that are connected to a gate for this player
UndergrowthSimplicityBoard.prototype.getConnectedToGates = function(playerName) {
	var visited = new Set();
	var queue = [];

	// Start from all gates owned by this player that have a tile
	var self = this;
	var gatePositions = this.getGatePositions();
	gatePositions.forEach(function(gatePos) {
		var key = gatePos.row + "," + gatePos.col;
		if (self.gateOwners[key] === playerName) {
			var gateBp = self.cells[gatePos.row][gatePos.col];
			if (gateBp.hasTile() && gateBp.tile.ownerName === playerName) {
				visited.add(key);
				queue.push({ row: gatePos.row, col: gatePos.col });
			}
		}
	});

	// BFS through connections
	while (queue.length > 0) {
		var current = queue.shift();
		for (var i = 0; i < this.connections.length; i++) {
			var conn = this.connections[i];
			if (conn.ownerName !== playerName) continue;
			var otherPos = null;
			if (conn.tile1Pos.row === current.row && conn.tile1Pos.col === current.col) {
				otherPos = conn.tile2Pos;
			} else if (conn.tile2Pos.row === current.row && conn.tile2Pos.col === current.col) {
				otherPos = conn.tile1Pos;
			}
			if (otherPos) {
				var otherKey = otherPos.row + "," + otherPos.col;
				if (!visited.has(otherKey)) {
					visited.add(otherKey);
					queue.push({ row: otherPos.row, col: otherPos.col });
				}
			}
		}
	}

	return visited;
};

// ============ Decay ============

// Remove all own stones in purely Neutral Garden
UndergrowthSimplicityBoard.prototype.performDecay = function(playerName) {
	var removedTiles = [];
	this.forEachBoardPointWithTile(function(bp) {
		if (bp.tile.ownerName === playerName && bp.isNeutralGardenOnly()) {
			removedTiles.push({ row: bp.row, col: bp.col, tile: bp.removeTile() });
		}
	});
	return removedTiles;
};

// ============ Cut ============

// Remove all opponent stones not connected to their gates
UndergrowthSimplicityBoard.prototype.performCut = function(cuttingPlayer) {
	var opponentName = (cuttingPlayer === HOST) ? GUEST : HOST;
	var connectedSet = this.getConnectedToGates(opponentName);
	var removedTiles = [];

	this.forEachBoardPointWithTile(function(bp) {
		if (bp.tile.ownerName === opponentName) {
			var key = bp.row + "," + bp.col;
			if (!connectedSet.has(key)) {
				removedTiles.push({ row: bp.row, col: bp.col, tile: bp.removeTile() });
			}
		}
	});

	return removedTiles;
};

// ============ Legal Placement ============

// Check if a stone can be placed at (row, col). connectedSet is optional optimization.
UndergrowthSimplicityBoard.prototype.canPlaceStone = function(playerName, row, col, connectedSet) {
	var bp = this.cells[row][col];
	if (!bp.canHoldTile()) return false;

	// Check: does this point have LOS to a friendly stone connected to a gate?
	if (!connectedSet) {
		connectedSet = this.getConnectedToGates(playerName);
	}

	var directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
	for (var d = 0; d < directions.length; d++) {
		var visible = this.getVisibleTileInDirection(row, col, directions[d][0], directions[d][1]);
		if (visible && visible.tile.ownerName === playerName) {
			var key = visible.row + "," + visible.col;
			if (connectedSet.has(key)) return true;
		}
	}
	return false;
};

UndergrowthSimplicityBoard.prototype.setLegalPlacementPoints = function(playerName) {
	var connectedSet = this.getConnectedToGates(playerName);
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			if (this.canPlaceStone(playerName, row, col, connectedSet)) {
				this.cells[row][col].addType(POSSIBLE_MOVE);
			}
		}
	}
};

UndergrowthSimplicityBoard.prototype.hasAnyLegalPlacements = function(playerName) {
	var connectedSet = this.getConnectedToGates(playerName);
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			if (this.canPlaceStone(playerName, row, col, connectedSet)) {
				return true;
			}
		}
	}
	return false;
};

UndergrowthSimplicityBoard.prototype.setOpenGatePossibleMoves = function() {
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.isType(GATE) && !boardPoint.hasTile()) {
			boardPoint.addType(POSSIBLE_MOVE);
		}
	});
};

UndergrowthSimplicityBoard.prototype.hasOpenGates = function() {
	var openGateFound = false;
	this.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.isType(GATE) && !boardPoint.hasTile()) {
			openGateFound = true;
		}
	});
	return openGateFound;
};

UndergrowthSimplicityBoard.prototype.hasPossibleMovePoints = function() {
	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			if (this.cells[row][col].isType(POSSIBLE_MOVE)) {
				return true;
			}
		}
	}
	return false;
};

UndergrowthSimplicityBoard.prototype.removePossibleMovePoints = function() {
	this.cells.forEach(function(row) {
		row.forEach(function(boardPoint) {
			boardPoint.removeType(POSSIBLE_MOVE);
		});
	});
};

// ============ Gate helpers ============

UndergrowthSimplicityBoard.prototype.getGatePositions = function() {
	return [
		{ row: 0, col: 8 },   // North
		{ row: 16, col: 8 },  // South
		{ row: 8, col: 0 },   // West
		{ row: 8, col: 16 }   // East
	];
};

UndergrowthSimplicityBoard.prototype.getPlayerGates = function(playerName) {
	var gates = [];
	var self = this;
	this.getGatePositions().forEach(function(gatePos) {
		var key = gatePos.row + "," + gatePos.col;
		if (self.gateOwners[key] === playerName) {
			gates.push(gatePos);
		}
	});
	return gates;
};

// ============ Ring Detection ============

UndergrowthSimplicityBoard.prototype.checkForRingVictory = function(playerName) {
	// Get all connections for this player
	var playerConnections = this.connections.filter(function(c) {
		return c.ownerName === playerName;
	});

	if (playerConnections.length < 4) return false; // Need at least 4 connections to form a ring

	// Find rings (cycles in the connection graph)
	var rings = this.findRings(playerConnections);

	for (var i = 0; i < rings.length; i++) {
		var ring = rings[i];
		var shapePoints = this.ringToShapePoints(ring);
		if (shapePoints && this.isCenterInsideShape(shapePoints)) {
			// Verify both gates connect to the ring
			if (this.bothGatesConnectToRing(playerName, ring)) {
				return true;
			}
		}
	}
	return false;
};

// Adapted from SkudPaiShoHarmonyManager.getHarmonyChains()
UndergrowthSimplicityBoard.prototype.findRings = function(playerConnections) {
	var rings = [];
	var self = this;

	for (var i = 0; i < playerConnections.length; i++) {
		var conn = playerConnections[i];
		var chain = [conn];
		var startPos = conn.tile2Pos;
		var targetPos = conn.tile1Pos;

		var foundRings = this.lookForRings(startPos, targetPos, chain, playerConnections);

		if (foundRings && foundRings.length > 0) {
			foundRings.forEach(function(ringFound) {
				var ringExists = false;
				rings.forEach(function(existingRing) {
					if (self.ringsMatch(existingRing, ringFound)) {
						ringExists = true;
					}
				});
				if (!ringExists) {
					rings.push(ringFound);
				}
			});
		}
	}

	return rings;
};

// Adapted from SkudPaiShoHarmonyManager.lookForRings()
UndergrowthSimplicityBoard.prototype.lookForRings = function(currentPos, targetPos, originalChain, playerConnections) {
	var rings = [];
	var keepLookingAt = [];

	for (var i = 0; i < playerConnections.length; i++) {
		var currentChain = originalChain.slice();
		var conn = playerConnections[i];
		if (this.connectionContainsPos(conn, currentPos) && this.connectionNotInChain(conn, currentChain)) {
			currentChain.push(conn);
			var otherPos = this.getOtherPos(conn, currentPos);
			if (otherPos.samesies(targetPos)) {
				// Complete ring found
				rings.push(currentChain);
			} else {
				keepLookingAt.push({ conn: conn, chain: currentChain, otherPos: otherPos });
			}
		}
	}

	for (var j = 0; j < keepLookingAt.length; j++) {
		var item = keepLookingAt[j];
		var moreRings = this.lookForRings(item.otherPos, targetPos, item.chain, playerConnections);
		rings = rings.concat(moreRings);
	}

	return rings;
};

UndergrowthSimplicityBoard.prototype.connectionContainsPos = function(conn, pos) {
	return conn.tile1Pos.samesies(pos) || conn.tile2Pos.samesies(pos);
};

UndergrowthSimplicityBoard.prototype.getOtherPos = function(conn, pos) {
	if (conn.tile1Pos.samesies(pos)) {
		return conn.tile2Pos;
	}
	return conn.tile1Pos;
};

UndergrowthSimplicityBoard.prototype.connectionNotInChain = function(conn, chain) {
	for (var i = 0; i < chain.length; i++) {
		if (this.connectionsEqual(conn, chain[i])) {
			return false;
		}
	}
	return true;
};

UndergrowthSimplicityBoard.prototype.connectionsEqual = function(c1, c2) {
	return (c1.tile1Pos.samesies(c2.tile1Pos) && c1.tile2Pos.samesies(c2.tile2Pos))
		|| (c1.tile1Pos.samesies(c2.tile2Pos) && c1.tile2Pos.samesies(c2.tile1Pos));
};

UndergrowthSimplicityBoard.prototype.ringsMatch = function(ring1, ring2) {
	if (ring1.length !== ring2.length) return false;
	var self = this;
	var allMatch = true;
	ring1.forEach(function(c1) {
		var found = false;
		ring2.forEach(function(c2) {
			if (self.connectionsEqual(c1, c2)) {
				found = true;
			}
		});
		if (!found) allMatch = false;
	});
	return allMatch;
};

// Convert a ring (array of connections) to an array of shape points in notation coords
UndergrowthSimplicityBoard.prototype.ringToShapePoints = function(ring) {
	var shapePoints = [];
	var ringCopy = ring.slice();

	var conn = ringCopy.pop();
	shapePoints.push(new NotationPoint(conn.tile1Pos.notationPointString).toArr());
	shapePoints.push(new NotationPoint(conn.tile2Pos.notationPointString).toArr());

	var lastPos = conn.tile2Pos;
	var count = 0;

	while (ringCopy.length > 0 && count < 400) {
		var found = false;
		for (var i = 0; i < ringCopy.length; i++) {
			var c = ringCopy[i];
			if (this.connectionContainsPos(c, lastPos)) {
				lastPos = this.getOtherPos(c, lastPos);
				var np = new NotationPoint(lastPos.notationPointString);
				if (!(np.x === shapePoints[0][0] && np.y === shapePoints[0][1])) {
					shapePoints.push(np.toArr());
				}
				ringCopy.splice(i, 1);
				found = true;
				break;
			}
		}
		if (!found) break;
		count++;
	}

	if (count > 390) {
		debug("Problem connecting ring dots");
		return null;
	}

	return shapePoints;
};

// Winding number algorithm - adapted from SkudPaiShoHarmonyManager.isCenterInsideShape()
UndergrowthSimplicityBoard.prototype.isCenterInsideShape = function(vs) {
	var x = 0;
	var y = 0;
	var wn = 0;

	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = parseFloat(vs[i][0]), yi = parseFloat(vs[i][1]);
		var xj = parseFloat(vs[j][0]), yj = parseFloat(vs[j][1]);

		// If on the line, doesn't count
		if ((xi === 0 && xj === 0 && yi * yj < 0)
			|| (yi === 0 && yj === 0 && xi * xj < 0)) {
			return false;
		}

		// If one of the points is 0,0 that won't count
		if ((xi === 0 && yi === 0) || (xj === 0 && yj === 0)) {
			return false;
		}

		if (yj <= y) {
			if (yi > y) {
				if (this.isLeft([xj, yj], [xi, yi], [x, y]) > 0) {
					wn++;
				}
			}
		} else {
			if (yi <= y) {
				if (this.isLeft([xj, yj], [xi, yi], [x, y]) < 0) {
					wn--;
				}
			}
		}
	}

	return wn !== 0;
};

UndergrowthSimplicityBoard.prototype.isLeft = function(P0, P1, P2) {
	return ((P1[0] - P0[0]) * (P2[1] - P0[1]) - (P2[0] - P0[0]) * (P1[1] - P0[1]));
};

// Verify both of the player's gates connect to the ring
UndergrowthSimplicityBoard.prototype.bothGatesConnectToRing = function(playerName, ring) {
	// Get all positions in the ring
	var ringPositions = new Set();
	ring.forEach(function(conn) {
		ringPositions.add(conn.tile1Pos.row + "," + conn.tile1Pos.col);
		ringPositions.add(conn.tile2Pos.row + "," + conn.tile2Pos.col);
	});

	// Check that each gate individually connects to the ring
	var playerGates = this.getPlayerGates(playerName);
	for (var g = 0; g < playerGates.length; g++) {
		var gateBp = this.cells[playerGates[g].row][playerGates[g].col];
		if (!gateBp.hasTile() || gateBp.tile.ownerName !== playerName) {
			return false; // Gate doesn't have player's stone
		}

		// BFS from this single gate to see if it reaches a ring position
		var gateConnectsToRing = this.gateReachesRing(playerGates[g], playerName, ringPositions);
		if (!gateConnectsToRing) return false;
	}

	return true;
};

// BFS from a single gate through connections to see if it reaches any ring position
UndergrowthSimplicityBoard.prototype.gateReachesRing = function(gatePos, playerName, ringPositions) {
	var visited = new Set();
	var queue = [];
	var startKey = gatePos.row + "," + gatePos.col;
	visited.add(startKey);
	queue.push({ row: gatePos.row, col: gatePos.col });

	if (ringPositions.has(startKey)) return true;

	while (queue.length > 0) {
		var current = queue.shift();
		for (var i = 0; i < this.connections.length; i++) {
			var conn = this.connections[i];
			if (conn.ownerName !== playerName) continue;
			var otherPos = null;
			if (conn.tile1Pos.row === current.row && conn.tile1Pos.col === current.col) {
				otherPos = conn.tile2Pos;
			} else if (conn.tile2Pos.row === current.row && conn.tile2Pos.col === current.col) {
				otherPos = conn.tile1Pos;
			}
			if (otherPos) {
				var otherKey = otherPos.row + "," + otherPos.col;
				if (!visited.has(otherKey)) {
					if (ringPositions.has(otherKey)) return true;
					visited.add(otherKey);
					queue.push({ row: otherPos.row, col: otherPos.col });
				}
			}
		}
	}

	return false;
};

// ============ Elimination Check ============

UndergrowthSimplicityBoard.prototype.canPlayerMakeAnyMoves = function(playerName) {
	return this.hasAnyLegalPlacements(playerName);
};

// ============ Place tile ============

UndergrowthSimplicityBoard.prototype.placeTile = function(tile, notationPoint) {
	this.boardHelper.putTileOnPoint(tile, notationPoint, this.cells);
};

// ============ Copy ============

UndergrowthSimplicityBoard.prototype.getCopy = function() {
	var copyBoard = new UndergrowthSimplicityBoard();

	for (var row = 0; row < this.cells.length; row++) {
		for (var col = 0; col < this.cells[row].length; col++) {
			copyBoard.cells[row][col] = this.cells[row][col].getCopy();
		}
	}

	// Copy gate owners
	for (var key in this.gateOwners) {
		copyBoard.gateOwners[key] = this.gateOwners[key];
	}

	copyBoard.analyzeConnections();

	return copyBoard;
};
