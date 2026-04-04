/**
 * YammaGameNotation - Handles move notation for saving/loading games
 *
 * Uses triangular grid coordinates: row, col, level, rotation
 * Format: "H:row,col,level,rotation" or "G:row,col,level,rotation"
 * Rotation is optional (defaults to 0) for backwards compatibility
 */

import { GUEST, HOST } from '../CommonNotationObjects';

export class YammaNotationMove {
	constructor(notation) {
		this.fullNotation = notation;
		this.player = null;
		this.row = 0;
		this.col = 0;
		this.level = 0;
		this.rotation = 0; // 0, 1, or 2 for 120° increments
		this.isSwap = false; // Pie Rule: Guest claims Host's first piece

		// For backwards compatibility with old code
		this.x = 0;
		this.y = 0;
		this.z = 0;

		if (notation) {
			this.parse(notation);
		}
	}

	parse(notation) {
		// Format: "H:row,col,level,rotation" (e.g., "H:2,1,0,1")
		// Pie Rule swap: "G:SWAP"
		// Rotation is optional for backwards compatibility
		const parts = notation.split(':');
		if (parts.length !== 2) return;

		this.player = parts[0] === 'H' ? HOST : GUEST;

		if (parts[1] === 'SWAP') {
			this.isSwap = true;
			return;
		}

		const coords = parts[1].split(',');
		if (coords.length >= 2) {
			this.row = parseInt(coords[0], 10);
			this.col = parseInt(coords[1], 10);
			this.level = coords.length >= 3 ? parseInt(coords[2], 10) : 0;
			this.rotation = coords.length >= 4 ? parseInt(coords[3], 10) : 0;

			// Keep x, y, z in sync for compatibility
			this.x = this.row;
			this.y = this.col;
			this.z = this.level;
		}
	}

	toString() {
		if (this.isSwap) {
			return 'G:SWAP';
		}
		const playerCode = this.player === HOST ? 'H' : 'G';
		return `${playerCode}:${this.row},${this.col},${this.level},${this.rotation}`;
	}
}

export class YammaNotationBuilder {
	constructor() {
		this.status = 'BRAND_NEW';
		this.row = null;
		this.col = null;
		this.level = null;
		this.rotation = 0;
	}

	setPoint(row, col, level, rotation = 0) {
		this.row = row;
		this.col = col;
		this.level = level;
		this.rotation = rotation;
		this.status = 'READY';
	}

	setRotation(rotation) {
		this.rotation = rotation % 3;
	}

	isReady() {
		return this.status === 'READY' && this.row !== null && this.col !== null && this.level !== null;
	}

	getMove(player) {
		if (!this.isReady()) return null;

		const move = new YammaNotationMove();
		move.player = player;
		move.row = this.row;
		move.col = this.col;
		move.level = this.level;
		move.rotation = this.rotation;
		move.x = this.row;
		move.y = this.col;
		move.z = this.level;
		move.fullNotation = move.toString();
		return move;
	}

	reset() {
		this.status = 'BRAND_NEW';
		this.row = null;
		this.col = null;
		this.level = null;
		this.rotation = 0;
	}
}

export class YammaGameNotation {
	constructor() {
		this.notationText = '';
		this.moves = [];
	}

	addMove(move) {
		this.moves.push(move);
		this.updateNotationText();
	}

	removeLastMove() {
		if (this.moves.length > 0) {
			this.moves.pop();
			this.updateNotationText();
		}
	}

	updateNotationText() {
		this.notationText = this.moves.map(m => m.toString()).join(';');
	}

	getPlayerMoveNum() {
		return Math.floor(this.moves.length / 2) + 1;
	}

	getNotationMoveFromBuilder(builder, player) {
		return builder.getMove(player);
	}

	setNotationText(text) {
		this.notationText = text || '';
		this.moves = [];

		if (!text || text.trim() === '') {
			return;
		}

		const moveStrings = text.split(';').filter(s => s.trim().length > 0);
		for (const moveStr of moveStrings) {
			const move = new YammaNotationMove(moveStr.trim());
			if (move.player !== null) {
				this.moves.push(move);
			}
		}
	}

	getNotationText() {
		return this.notationText;
	}

	notationTextForUrl() {
		return this.notationText;
	}

	getNotationHtml() {
		if (!this.notationText) {
			return '';
		}

		const lines = this.notationText.includes(';')
			? this.notationText.split(';')
			: [this.notationText];

		return lines.map(line => line).join('<br />');
	}

	getNotationForEmail() {
		if (!this.notationText) {
			return '';
		}

		const lines = this.notationText.includes(';')
			? this.notationText.split(';')
			: [this.notationText];

		return lines.join('[BR]');
	}

	getLastMove() {
		if (this.moves.length === 0) return null;
		return this.moves[this.moves.length - 1];
	}

	getLastMoveText() {
		const lastMove = this.getLastMove();
		return lastMove ? lastMove.toString() : '';
	}

	getLastMoveNumber() {
		return Math.floor((this.moves.length + 1) / 2);
	}
}
