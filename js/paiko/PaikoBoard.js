// Paiko Board
// Board for Paiko game - tiles play in spaces, not on points
// Uses 18x18 grid like Adevar for space-based play

import { GUEST, HOST, NotationPoint, RowAndColumn } from '../CommonNotationObjects';
import { PaikoBoardPoint, PaikoPointState, PaikoZone } from './PaikoBoardPoint';
import { PaikoTileCode } from './PaikoTile';

export class PaikoBoard {
	constructor() {
		// 18x18 board for space-based play (like Adevar)
		this.size = new RowAndColumn(18, 18);
		this.cells = this.createBoard();
	}

	createBoard() {
		const cells = [];

		// Helper aliases for cleaner board definition
		const N = () => PaikoBoardPoint.nonPlayable();
		const M = () => PaikoBoardPoint.middleground();
		const HH = () => PaikoBoardPoint.hostHomeground();
		const GH = () => PaikoBoardPoint.guestHomeground();

		// Row 0 - Top row (6 spaces) - mirrors row 17
		cells[0] = this.createRow(6, [
			N(), N(), N(), N(), N(), N()
		]);

		// Row 1 (10 spaces)
		cells[1] = this.createRow(10, [
			N(), N(), N(), N(), N(), N(), N(), N(), N(), N()
		]);

		// Row 2 (12 spaces)
		cells[2] = this.createRow(12, [
			N(), N(), N(), N(), N(), M(), GH(), N(), N(), N(), N(), N()
		]);

		// Row 3 (14 spaces)
		cells[3] = this.createRow(14, [
			N(), N(), N(), N(), N(), M(), M(), GH(), GH(), N(), N(), N(), N(), N()
		]);

		// Row 4 (16 spaces)
		cells[4] = this.createRow(16, [
			N(), N(), N(), N(), N(), M(), M(), M(), GH(), GH(), GH(), N(), N(), N(), N(), N()
		]);

		// Row 5 (16 spaces)
		cells[5] = this.createRow(16, [
			N(), N(), N(), N(), M(), M(), M(), M(), GH(), GH(), GH(), GH(), N(), N(), N(), N()
		]);

		// Row 6 (18 spaces)
		cells[6] = this.createRow(18, [
			N(), N(), N(), N(), M(), M(), M(), M(), M(), GH(), GH(), GH(), GH(), GH(), N(), N(), N(), N()
		]);

		// Row 7 (18 spaces)
		cells[7] = this.createRow(18, [
			N(), N(), N(), M(), M(), M(), M(), M(), M(), GH(), GH(), GH(), GH(), GH(), GH(), N(), N(), N()
		]);

		// Row 8 (18 spaces) - Center top
		cells[8] = this.createRow(18, [
			N(), N(), M(), M(), M(), M(), M(), M(), M(), GH(), GH(), GH(), GH(), GH(), GH(), GH(), N(), N()
		]);

		// Row 9 (18 spaces) - Center bottom
		cells[9] = this.createRow(18, [
			N(), N(), HH(), HH(), HH(), HH(), HH(), HH(), HH(), M(), M(), M(), M(), M(), M(), M(), N(), N()
		]);

		// Row 10 (18 spaces)
		cells[10] = this.createRow(18, [
			N(), N(), N(), HH(), HH(), HH(), HH(), HH(), HH(), M(), M(), M(), M(), M(), M(), N(), N(), N()
		]);

		// Row 11 (18 spaces)
		cells[11] = this.createRow(18, [
			N(), N(), N(), N(), HH(), HH(), HH(), HH(), HH(), M(), M(), M(), M(), M(), N(), N(), N(), N()
		]);

		// Row 12 (16 spaces)
		cells[12] = this.createRow(16, [
			N(), N(), N(), N(), HH(), HH(), HH(), HH(), M(), M(), M(), M(), N(), N(), N(), N()
		]);

		// Row 13 (16 spaces)
		cells[13] = this.createRow(16, [
			N(), N(), N(), N(), N(), HH(), HH(), HH(), M(), M(), M(), N(), N(), N(), N(), N()
		]);

		// Row 14 (14 spaces)
		cells[14] = this.createRow(14, [
			N(), N(), N(), N(), N(), HH(), HH(), M(), M(), N(), N(), N(), N(), N()
		]);

		// Row 15 (12 spaces)
		cells[15] = this.createRow(12, [
			N(), N(), N(), N(), N(), HH(), M(), N(), N(), N(), N(), N()
		]);

		// Row 16 (10 spaces)
		cells[16] = this.createRow(10, [
			N(), N(), N(), N(), N(), N(), N(), N(), N(), N()
		]);

		// Row 17 - Bottom row (6 spaces)
		cells[17] = this.createRow(6, [
			N(), N(), N(), N(), N(), N()
		]);

		// Set row/col for each cell
		for (let row = 0; row < cells.length; row++) {
			for (let col = 0; col < cells[row].length; col++) {
				cells[row][col].row = row;
				cells[row][col].col = col;
			}
		}

		// Mark the black squares (only Lotus can deploy here, no movement allowed)
		// Notation points: (-1,1), (0,-1), (1,0), (2,-2)
		// Conversion: row = 8 - y, col = x + 8
		const blackSquares = [
			{ x: -1, y: 1 },  // row 7, col 7
			{ x: 0, y: -1 },  // row 9, col 8
			{ x: 1, y: 0 },   // row 8, col 9
			{ x: 2, y: -2 }   // row 10, col 10
		];

		blackSquares.forEach(({ x, y }) => {
			const row = 8 - y;
			const col = x + 8;
			if (cells[row] && cells[row][col]) {
				cells[row][col].zone = PaikoZone.BLACKED_OUT;
			}
		});

		return cells;
	}

	createRow(numColumns, points) {
		const cells = [];
		const numBlanksOnSides = (this.size.row - numColumns) / 2;

		for (let i = 0; i < this.size.row; i++) {
			if (i < numBlanksOnSides) {
				const nonPlayable = PaikoBoardPoint.nonPlayable();
				nonPlayable.row = -1;
				nonPlayable.col = i;
				cells[i] = nonPlayable;
			} else if (i < numBlanksOnSides + numColumns) {
				cells[i] = points[i - numBlanksOnSides];
			} else {
				const nonPlayable = PaikoBoardPoint.nonPlayable();
				nonPlayable.row = -1;
				nonPlayable.col = i;
				cells[i] = nonPlayable;
			}
		}

		return cells;
	}

	// Get point at row, col
	getPoint(row, col) {
		if (row >= 0 && row < this.cells.length && col >= 0 && col < this.cells[row].length) {
			return this.cells[row][col];
		}
		return null;
	}

	// Get point from notation point (accepts string or NotationPoint object)
	getPointFromNotation(notationPointOrString) {
		let rowAndCol;
		if (typeof notationPointOrString === 'string') {
			const np = new NotationPoint(notationPointOrString);
			rowAndCol = np.rowAndColumn;
		} else {
			rowAndCol = notationPointOrString.rowAndColumn;
		}
		if (!rowAndCol) {
			return null;
		}
		return this.getPoint(rowAndCol.row, rowAndCol.col);
	}

	// Place a tile on the board
	placeTile(tile, notationPoint, skipRecalculate = false) {
		const point = this.getPointFromNotation(notationPoint);
		if (point) {
			point.putTile(tile);
			if (!skipRecalculate) {
				this.recalculateThreatAndCover();
			}
			return true;
		}
		return false;
	}

	// Move a tile from one point to another
	moveTile(startNotationPoint, endNotationPoint, skipRecalculate = false) {
		const startPoint = this.getPointFromNotation(startNotationPoint);
		const endPoint = this.getPointFromNotation(endNotationPoint);

		if (startPoint && endPoint && startPoint.hasTile()) {
			const tile = startPoint.removeTile();
			endPoint.putTile(tile);
			if (!skipRecalculate) {
				this.recalculateThreatAndCover();
			}
			return tile;
		}
		return null;
	}

	// Remove a tile from the board
	removeTile(notationPoint, skipRecalculate = false) {
		const point = this.getPointFromNotation(notationPoint);
		if (point && point.hasTile()) {
			const tile = point.removeTile();
			if (!skipRecalculate) {
				this.recalculateThreatAndCover();
			}
			return tile;
		}
		return null;
	}

	// Recalculate all threat and cover values on the board
	recalculateThreatAndCover() {
		// Clear existing threat/cover
		this.forEachPoint((point) => {
			point.clearThreatAndCover();
		});

		// Calculate threat and cover from each tile
		this.forEachPoint((point) => {
			if (point.hasTile()) {
				this.applyTileThreatAndCover(point);
			}
		});
	}

	// Apply a tile's threat and cover patterns to the board
	applyTileThreatAndCover(tilePoint) {
		const tile = tilePoint.tile;
		const player = tile.ownerName;

		// Apply threat pattern
		const threatPattern = tile.getThreatPattern();
		threatPattern.forEach(([rowOffset, colOffset]) => {
			const targetRow = tilePoint.row + rowOffset;
			const targetCol = tilePoint.col + colOffset;
			const targetPoint = this.getPoint(targetRow, targetCol);

			if (targetPoint && targetPoint.isPlayable()) {
				// Fire threatens all tiles (including own)
				if (tile.hasSpecialRule('threatensAll')) {
					targetPoint.addThreat(HOST, 1);
					targetPoint.addThreat(GUEST, 1);
				} else {
					targetPoint.addThreat(player, 1);
				}
			}
		});

		// Apply cover pattern
		const coverPattern = tile.getCoverPattern();
		coverPattern.forEach(([rowOffset, colOffset]) => {
			const targetRow = tilePoint.row + rowOffset;
			const targetCol = tilePoint.col + colOffset;
			const targetPoint = this.getPoint(targetRow, targetCol);

			if (targetPoint) {
				// Cover only applies to own tiles
				targetPoint.setCover(player, true);
			}
		});
	}

	// Get all tiles belonging to a player
	getPlayerTiles(player) {
		const tiles = [];
		this.forEachPoint((point) => {
			if (point.hasTile() && point.tile.ownerName === player) {
				tiles.push({ tile: point.tile, point: point });
			}
		});
		return tiles;
	}

	// Calculate score for a player
	calculateScore(player) {
		let score = 0;
		const playerTiles = this.getPlayerTiles(player);

		playerTiles.forEach(({ tile, point }) => {
			// Lotus gives no points
			if (!tile.hasSpecialRule('noPoints')) {
				score += point.getPointsValue(player);
			}
		});

		return score;
	}

	// Check if a point is threatened by opponent
	isThreatenedByOpponent(point, player) {
		const opponent = player === HOST ? GUEST : HOST;
		return point.getThreat(opponent) > 0;
	}

	// Get possible deployment points for a player
	getPossibleDeploymentPoints(player, tile) {
		const possiblePoints = [];

		this.forEachPoint((point) => {
			if (this.canDeployAt(point, player, tile)) {
				possiblePoints.push(point);
			}
		});

		return possiblePoints;
	}

	// Check if a player can deploy a tile at a specific point
	canDeployAt(point, player, tile) {
		// Basic playability check
		if (!point.canDeployTile(tile, player)) {
			return false;
		}

		const opponent = player === HOST ? GUEST : HOST;

		// Lotus can deploy anywhere unoccupied (including blacked out)
		if (tile.hasSpecialRule('deployAnywhere')) {
			return !point.hasTile();
		}

		// Can't deploy on blacked out squares (normal tiles)
		if (point.isBlackedOut()) {
			return false;
		}

		// Can't deploy where already occupied
		if (point.hasTile()) {
			return false;
		}

		// Check if point is in player's homeground
		if (point.isHomeground(player)) {
			return true;
		}

		// Check if point is threatened by player (they control it)
		if (point.getThreat(player) > 0) {
			// But can't deploy in Fire's threat (Fire has noDeployInThreat rule)
			if (this.isThreatenedByFire(point)) {
				return false;
			}

			// Can't deploy in squares which threaten you
			if (point.getThreat(opponent) > 0) {
				return false;
			}

			return true;
		}

		return false;
	}

	// Check if a player can redeploy a tile at a specific point
	// Used for Water's special ability - can redeploy in its own threat
	canRedeployAt(point, player, tile, fromPoint) {
		// Basic playability check
		if (!point.canDeployTile(tile, player)) {
			return false;
		}

		// Can't redeploy on blacked out squares (Water is not Lotus)
		if (point.isBlackedOut()) {
			return false;
		}

		// Can't redeploy where already occupied (except the tile's current position)
		if (point.hasTile() && point !== fromPoint) {
			return false;
		}

		// Check if point is in player's homeground
		if (point.isHomeground(player)) {
			return true;
		}

		// Check if point is threatened by player (they control it)
		if (point.getThreat(player) > 0) {
			// Can't deploy in Fire's threat
			if (this.isThreatenedByFire(point)) {
				return false;
			}

			// Water CAN redeploy in its own threat (special rule)
			// The rule says "You can redeploy Water in its own threat"
			return true;
		}

		return false;
	}

	// Check if a point is threatened by any Fire tile
	isThreatenedByFire(point) {
		let threatenedByFire = false;
		this.forEachPoint((tilePoint) => {
			if (tilePoint.hasTile() && tilePoint.tile.code === PaikoTileCode.FIRE) {
				const threatPattern = tilePoint.tile.getThreatPattern();
				threatPattern.forEach(([rowOffset, colOffset]) => {
					const targetRow = tilePoint.row + rowOffset;
					const targetCol = tilePoint.col + colOffset;
					if (targetRow === point.row && targetCol === point.col) {
						threatenedByFire = true;
					}
				});
			}
		});
		return threatenedByFire;
	}

	// Get possible shift destinations for a tile at a point
	getPossibleShiftDestinations(point, player) {
		if (!point.hasTile()) {
			return [];
		}

		const tile = point.tile;
		if (!tile.canShift()) {
			return [];
		}

		const maxDistance = tile.getMoveDistance();
		const possibleDestinations = [];
		const opponent = player === HOST ? GUEST : HOST;

		// BFS to find all reachable points within movement distance
		const visited = new Set();
		const queue = [{ row: point.row, col: point.col, distance: 0 }];
		visited.add(`${point.row},${point.col}`);

		// Directions: up, down, left, right (non-diagonal)
		const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

		while (queue.length > 0) {
			const current = queue.shift();

			// Can stop at any point
			if (current.distance > 0) {
				const destPoint = this.getPoint(current.row, current.col);
				if (destPoint && !destPoint.hasTile()) {
					possibleDestinations.push(destPoint);
				}
			} else if (current.distance === 0 && tile.hasFacing()) {
				// Tiles with facing can rotate in place (stay at starting position)
				possibleDestinations.push(point);
			}

			// Can't move further than max distance
			if (current.distance >= maxDistance) {
				continue;
			}

			// Try each direction
			for (const [dr, dc] of directions) {
				const newRow = current.row + dr;
				const newCol = current.col + dc;
				const key = `${newRow},${newCol}`;

				if (visited.has(key)) {
					continue;
				}

				const nextPoint = this.getPoint(newRow, newCol);
				if (!nextPoint || !nextPoint.isPlayable()) {
					continue;
				}

				// Can't shift through tiles (including own)
				if (nextPoint.hasTile()) {
					continue;
				}

				// Can't shift through squares with enough threat to capture
				const isCovered = nextPoint.isTileCovered(player);
				const threatNeeded = tile.getThreatToCapture(isCovered);
				if (nextPoint.getThreat(opponent) >= threatNeeded) {
					continue;
				}

				visited.add(key);
				queue.push({ row: newRow, col: newCol, distance: current.distance + 1 });
			}
		}

		// Also include rotation in place (distance 0) if tile has facing
		if (tile.hasFacing()) {
			possibleDestinations.push(point);
		}

		// If tile can redeploy (Water), add all valid redeploy destinations
		if (tile.hasSpecialRule('canRedeploy')) {
			this.forEachPoint((redeployPoint) => {
				// Skip points already in shift destinations
				if (possibleDestinations.includes(redeployPoint)) {
					return;
				}

				if (this.canRedeployAt(redeployPoint, player, tile, point)) {
					possibleDestinations.push(redeployPoint);
				}
			});
		}

		return possibleDestinations;
	}

	// Check if a tile would be captured at a point
	wouldTileBeCaptured(point, player) {
		if (!point.hasTile()) {
			return false;
		}

		const tile = point.tile;
		const opponent = player === HOST ? GUEST : HOST;
		const isCovered = point.isTileCovered(player);
		const threatNeeded = tile.getThreatToCapture(isCovered);

		return point.getThreat(opponent) >= threatNeeded;
	}

	// Get tiles that would be captured after a move
	getTilesToCapture(capturedPlayer) {
		const capturedTiles = [];

		this.forEachPoint((point) => {
			if (point.hasTile() && point.tile.ownerName === capturedPlayer) {
				if (this.wouldTileBeCaptured(point, capturedPlayer)) {
					capturedTiles.push({ tile: point.tile, point: point });
				}
			}
		});

		return capturedTiles;
	}

	// Validate that a move doesn't result in own tile being captured
	moveWouldCaptureOwnTile(player) {
		const ownTiles = this.getPlayerTiles(player);
		for (const { tile, point } of ownTiles) {
			if (this.wouldTileBeCaptured(point, player)) {
				return true;
			}
		}
		return false;
	}

	// Clear all visual states
	clearAllPointStates() {
		this.forEachPoint((point) => {
			point.clearStates();
		});
	}

	// Mark possible move points
	markPossibleMoves(points) {
		points.forEach((point) => {
			point.addState(PaikoPointState.POSSIBLE_MOVE);
		});
	}

	// Mark possible deploy points
	markPossibleDeploys(points) {
		points.forEach((point) => {
			point.addState(PaikoPointState.POSSIBLE_DEPLOY);
		});
	}

	// Utility to iterate over all points
	forEachPoint(callback) {
		for (let row = 0; row < this.cells.length; row++) {
			for (let col = 0; col < this.cells[row].length; col++) {
				callback(this.cells[row][col], row, col);
			}
		}
	}

	// Get notation point from row/col
	// For 18x18 board, center is between rows 8-9 and cols 8-9
	getNotationPointFromRowCol(row, col) {
		// Convert to notation coordinates
		// Notation uses center-based coordinates
		const x = col - 8;
		const y = 8 - row;
		return new NotationPoint(`${x},${y}`);
	}

	// Print board to console for debugging
	printToConsole() {
		let output = '';
		for (let row = 0; row < this.cells.length; row++) {
			let rowStr = '';
			for (let col = 0; col < this.cells[row].length; col++) {
				rowStr += this.cells[row][col].getConsoleDisplay() + ' ';
			}
			output += rowStr + '\n';
		}
		console.log(output);
	}

	// Create a deep copy of the board
	getCopy() {
		const copy = new PaikoBoard();

		// Clear default cells
		copy.cells = [];

		// Copy all cells
		for (let row = 0; row < this.cells.length; row++) {
			copy.cells[row] = [];
			for (let col = 0; col < this.cells[row].length; col++) {
				copy.cells[row][col] = this.cells[row][col].getCopy();
			}
		}

		return copy;
	}
}
