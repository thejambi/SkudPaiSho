// Fanorona Board Point
// Represents a single intersection on the Fanorona board

import { GUEST, HOST } from '../CommonNotationObjects';

export const FanoronaPiece = {
	WHITE: 'W',  // Host
	BLACK: 'B'   // Guest
};

export function FanoronaBoardPoint(row, col) {
	this.row = row;
	this.col = col;
	this.piece = null;

	// Determine if this point has diagonal connections
	// Diagonals exist where (row + col) is even
	this.hasDiagonals = (row + col) % 2 === 0;
}

FanoronaBoardPoint.prototype.getNotationPointString = function() {
	// Use algebraic notation: columns a-i (0-8), rows 1-5 (bottom to top)
	var colLetter = String.fromCharCode(97 + this.col); // 'a' through 'i'
	var rowNum = 5 - this.row; // Row 1 is at bottom (index 4), row 5 at top (index 0)
	return colLetter + rowNum;
};

FanoronaBoardPoint.prototype.hasPiece = function() {
	return this.piece !== null;
};

FanoronaBoardPoint.prototype.setPiece = function(piece) {
	this.piece = piece;
};

FanoronaBoardPoint.prototype.removePiece = function() {
	this.piece = null;
};

FanoronaBoardPoint.prototype.getPieceOwner = function() {
	if (this.piece === FanoronaPiece.WHITE) {
		return HOST;
	} else if (this.piece === FanoronaPiece.BLACK) {
		return GUEST;
	}
	return null;
};

FanoronaBoardPoint.prototype.getCopy = function() {
	var copy = new FanoronaBoardPoint(this.row, this.col);
	copy.piece = this.piece;
	return copy;
};

// Static method to parse notation point string
FanoronaBoardPoint.parseNotationPointString = function(notation) {
	if (!notation || notation.length !== 2) {
		return null;
	}
	var col = notation.charCodeAt(0) - 97; // 'a' = 0
	var row = 5 - parseInt(notation.charAt(1)); // '5' = row 0, '1' = row 4

	if (col < 0 || col > 8 || row < 0 || row > 4) {
		return null;
	}

	return { row: row, col: col };
};
