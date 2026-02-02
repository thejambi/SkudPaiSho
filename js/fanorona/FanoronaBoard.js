// Fanorona Board
// 9x5 grid with diagonal connections on alternating points

import { GUEST, HOST } from '../CommonNotationObjects';
import { FanoronaBoardPoint, FanoronaPiece } from './FanoronaBoardPoint';

export const BOARD_COLS = 9;
export const BOARD_ROWS = 5;

// Direction vectors: [rowDelta, colDelta]
export const Directions = {
	N:  [-1,  0],
	NE: [-1,  1],
	E:  [ 0,  1],
	SE: [ 1,  1],
	S:  [ 1,  0],
	SW: [ 1, -1],
	W:  [ 0, -1],
	NW: [-1, -1]
};

export const OrthogonalDirections = ['N', 'E', 'S', 'W'];
export const DiagonalDirections = ['NE', 'SE', 'SW', 'NW'];
export const AllDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function getOppositeDirection(dir) {
	const opposites = {
		'N': 'S', 'S': 'N',
		'E': 'W', 'W': 'E',
		'NE': 'SW', 'SW': 'NE',
		'NW': 'SE', 'SE': 'NW'
	};
	return opposites[dir];
}

export function FanoronaBoard() {
	this.cells = [];
	this.initializeBoard();
}

FanoronaBoard.prototype.initializeBoard = function() {
	// Create the 5x9 grid
	for (var row = 0; row < BOARD_ROWS; row++) {
		this.cells[row] = [];
		for (var col = 0; col < BOARD_COLS; col++) {
			this.cells[row][col] = new FanoronaBoardPoint(row, col);
		}
	}

	// Set up initial piece positions
	// White (Host) on rows 3-4 (bottom two rows) and left half of middle row
	// Black (Guest) on rows 0-1 (top two rows) and right half of middle row
	// Center point (row 2, col 4) is empty

	// Top two rows: Black pieces
	for (var row = 0; row < 2; row++) {
		for (var col = 0; col < BOARD_COLS; col++) {
			this.cells[row][col].setPiece(FanoronaPiece.BLACK);
		}
	}

	// Bottom two rows: White pieces
	for (var row = 3; row < BOARD_ROWS; row++) {
		for (var col = 0; col < BOARD_COLS; col++) {
			this.cells[row][col].setPiece(FanoronaPiece.WHITE);
		}
	}

	// Middle row: alternating, starting with White on the left
	// W B W B _ B W B W (center is empty)
	var middleRow = 2;
	for (var col = 0; col < BOARD_COLS; col++) {
		if (col === 4) {
			// Center point is empty
			continue;
		}
		if (col % 2 === 0) {
			this.cells[middleRow][col].setPiece(FanoronaPiece.WHITE);
		} else {
			this.cells[middleRow][col].setPiece(FanoronaPiece.BLACK);
		}
	}
};

FanoronaBoard.prototype.getPoint = function(row, col) {
	if (row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS) {
		return this.cells[row][col];
	}
	return null;
};

FanoronaBoard.prototype.getPointFromNotation = function(notation) {
	var coords = FanoronaBoardPoint.parseNotationPointString(notation);
	if (coords) {
		return this.getPoint(coords.row, coords.col);
	}
	return null;
};

FanoronaBoard.prototype.isValidPoint = function(row, col) {
	return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
};

FanoronaBoard.prototype.getDirectionsFromPoint = function(point) {
	// Get valid directions from a point
	// Orthogonal directions are always valid
	// Diagonal directions only valid if point has diagonals
	if (point.hasDiagonals) {
		return AllDirections;
	}
	return OrthogonalDirections;
};

FanoronaBoard.prototype.getAdjacentPoint = function(point, direction) {
	var delta = Directions[direction];
	var newRow = point.row + delta[0];
	var newCol = point.col + delta[1];
	return this.getPoint(newRow, newCol);
};

FanoronaBoard.prototype.getDirection = function(fromPoint, toPoint) {
	// Determine direction from one point to another
	var rowDelta = toPoint.row - fromPoint.row;
	var colDelta = toPoint.col - fromPoint.col;

	for (var dir in Directions) {
		if (Directions[dir][0] === rowDelta && Directions[dir][1] === colDelta) {
			return dir;
		}
	}
	return null;
};

FanoronaBoard.prototype.areAdjacent = function(point1, point2) {
	var rowDiff = Math.abs(point1.row - point2.row);
	var colDiff = Math.abs(point1.col - point2.col);

	// Must be within 1 step
	if (rowDiff > 1 || colDiff > 1) {
		return false;
	}
	if (rowDiff === 0 && colDiff === 0) {
		return false;
	}

	// Orthogonal moves are always valid
	if (rowDiff === 0 || colDiff === 0) {
		return true;
	}

	// Diagonal moves require both points to have diagonals
	return point1.hasDiagonals && point2.hasDiagonals;
};

FanoronaBoard.prototype.movePiece = function(fromPoint, toPoint) {
	if (fromPoint.hasPiece() && !toPoint.hasPiece()) {
		toPoint.setPiece(fromPoint.piece);
		fromPoint.removePiece();
		return true;
	}
	return false;
};

FanoronaBoard.prototype.captureInDirection = function(startPoint, direction, skipFirst) {
	// Capture all enemy pieces in the given direction
	// startPoint is where the capturing piece is now
	// skipFirst: if true, skip the first adjacent point (for approach captures, we start capturing from the destination)
	var captured = [];
	var currentPoint = startPoint;
	var skipped = !skipFirst;

	while (true) {
		var nextPoint = this.getAdjacentPoint(currentPoint, direction);
		if (!nextPoint) {
			break;
		}
		if (!skipped) {
			skipped = true;
			currentPoint = nextPoint;
			continue;
		}
		if (!nextPoint.hasPiece()) {
			break;
		}
		// Check if it's an enemy piece (opposite of starting piece)
		if (nextPoint.piece !== startPoint.piece) {
			captured.push(nextPoint);
			currentPoint = nextPoint;
		} else {
			// Hit a friendly piece, stop
			break;
		}
	}

	return captured;
};

FanoronaBoard.prototype.getPiecesInDirection = function(startPoint, direction, enemyPiece) {
	// Get all pieces in a direction that match enemyPiece
	var pieces = [];
	var currentPoint = startPoint;

	while (true) {
		var nextPoint = this.getAdjacentPoint(currentPoint, direction);
		if (!nextPoint || !nextPoint.hasPiece()) {
			break;
		}
		if (nextPoint.piece !== enemyPiece) {
			break;
		}
		pieces.push(nextPoint);
		currentPoint = nextPoint;
	}

	return pieces;
};

FanoronaBoard.prototype.removePieces = function(points) {
	points.forEach(function(point) {
		point.removePiece();
	});
};

FanoronaBoard.prototype.countPieces = function(pieceType) {
	var count = 0;
	for (var row = 0; row < BOARD_ROWS; row++) {
		for (var col = 0; col < BOARD_COLS; col++) {
			if (this.cells[row][col].piece === pieceType) {
				count++;
			}
		}
	}
	return count;
};

FanoronaBoard.prototype.getPiecesForPlayer = function(player) {
	var piece = player === HOST ? FanoronaPiece.WHITE : FanoronaPiece.BLACK;
	var pieces = [];
	for (var row = 0; row < BOARD_ROWS; row++) {
		for (var col = 0; col < BOARD_COLS; col++) {
			if (this.cells[row][col].piece === piece) {
				pieces.push(this.cells[row][col]);
			}
		}
	}
	return pieces;
};

FanoronaBoard.prototype.getCopy = function() {
	var copy = new FanoronaBoard();
	// Clear the default initialization
	copy.cells = [];
	for (var row = 0; row < BOARD_ROWS; row++) {
		copy.cells[row] = [];
		for (var col = 0; col < BOARD_COLS; col++) {
			copy.cells[row][col] = this.cells[row][col].getCopy();
		}
	}
	return copy;
};
