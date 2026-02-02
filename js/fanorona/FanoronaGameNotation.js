// Fanorona Game Notation
// Handles move notation parsing and building

import { GUEST, HOST } from '../CommonNotationObjects';
import { BRAND_NEW } from '../PaiShoMain';

// Capture types
export const CaptureType = {
	APPROACH: 'A',
	WITHDRAWAL: 'W',
	NONE: ''
};

// --------------------------------------------- //
// Notation Move - represents a single turn (may include chain captures)

export function FanoronaNotationMove(text) {
	this.fullMoveText = text;
	this.moves = []; // Array of {from, to, captureType}
	this.analyzeMove();
}

FanoronaNotationMove.prototype.analyzeMove = function() {
	this.valid = true;

	// Format: "0H.e3-e4A" or "1G.d5-e4A,e4-f3W" for chains
	var parts = this.fullMoveText.split(".");

	if (parts.length < 2) {
		this.valid = false;
		return;
	}

	var moveNumAndPlayer = parts[0];
	this.moveNum = parseInt(moveNumAndPlayer.slice(0, -1));
	this.playerCode = moveNumAndPlayer.charAt(moveNumAndPlayer.length - 1);

	if (this.playerCode === 'G') {
		this.player = GUEST;
	} else if (this.playerCode === 'H') {
		this.player = HOST;
	}

	var moveText = parts[1];
	if (!moveText) {
		return;
	}

	// Parse individual moves (may be comma-separated for chains)
	var moveStrings = moveText.split(',');
	var self = this;

	moveStrings.forEach(function(moveStr) {
		var move = self.parseMove(moveStr.trim());
		if (move) {
			self.moves.push(move);
		}
	});
};

FanoronaNotationMove.prototype.parseMove = function(moveStr) {
	// Format: "e3-e4" or "e3-e4A" or "e3-e4W"
	if (!moveStr || moveStr.length < 5) {
		return null;
	}

	var from = moveStr.substring(0, 2);
	var to = moveStr.substring(3, 5);
	var captureType = CaptureType.NONE;

	if (moveStr.length > 5) {
		var typeChar = moveStr.charAt(5);
		if (typeChar === 'A') {
			captureType = CaptureType.APPROACH;
		} else if (typeChar === 'W') {
			captureType = CaptureType.WITHDRAWAL;
		}
	}

	return {
		from: from,
		to: to,
		captureType: captureType
	};
};

FanoronaNotationMove.prototype.isValidNotation = function() {
	return this.valid && this.moves.length > 0;
};

FanoronaNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};

// --------------------------------------------- //
// Notation Builder - builds a move from user interactions

export function FanoronaNotationBuilder() {
	this.status = BRAND_NEW;
	this.moves = []; // Array of {from, to, captureType}
	this.currentFrom = null;
	this.currentTo = null;
	this.pendingCaptureType = null; // When user needs to choose approach vs withdrawal
	this.visitedPoints = []; // Points visited during this turn (for chain capture validation)
	this.lastDirection = null; // Last move direction (can't reverse in chains)
}

FanoronaNotationBuilder.prototype.reset = function() {
	this.status = BRAND_NEW;
	this.moves = [];
	this.currentFrom = null;
	this.currentTo = null;
	this.pendingCaptureType = null;
	this.visitedPoints = [];
	this.lastDirection = null;
};

FanoronaNotationBuilder.prototype.setStartPoint = function(point) {
	this.currentFrom = point;
	if (this.moves.length === 0) {
		this.visitedPoints = [point];
	}
};

FanoronaNotationBuilder.prototype.setEndPoint = function(point, captureType) {
	this.currentTo = point;
	if (captureType !== undefined) {
		this.addMove(captureType);
	}
};

FanoronaNotationBuilder.prototype.setCaptureType = function(captureType) {
	this.pendingCaptureType = captureType;
	this.addMove(captureType);
};

FanoronaNotationBuilder.prototype.addMove = function(captureType) {
	if (this.currentFrom && this.currentTo) {
		this.moves.push({
			from: this.currentFrom,
			to: this.currentTo,
			captureType: captureType || CaptureType.NONE
		});
		this.visitedPoints.push(this.currentTo);
		// Set up for potential chain capture
		this.currentFrom = this.currentTo;
		this.currentTo = null;
		this.pendingCaptureType = null;
	}
};

FanoronaNotationBuilder.prototype.isChainCapture = function() {
	return this.moves.length > 0;
};

FanoronaNotationBuilder.prototype.hasVisitedPoint = function(point) {
	return this.visitedPoints.includes(point);
};

FanoronaNotationBuilder.prototype.getLastMove = function() {
	if (this.moves.length > 0) {
		return this.moves[this.moves.length - 1];
	}
	return null;
};

FanoronaNotationBuilder.prototype.needsCaptureTypeSelection = function() {
	return this.currentFrom && this.currentTo && this.pendingCaptureType === null;
};

FanoronaNotationBuilder.prototype.moveComplete = function() {
	// A move is complete when we have at least one move recorded
	// and no pending selections
	return this.moves.length > 0 && !this.needsCaptureTypeSelection();
};

FanoronaNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var notationLine = moveNum + player.charAt(0) + ".";

	var moveStrings = this.moves.map(function(move) {
		var str = move.from + "-" + move.to;
		if (move.captureType) {
			str += move.captureType;
		}
		return str;
	});

	notationLine += moveStrings.join(',');

	return new FanoronaNotationMove(notationLine);
};

// --------------------------------------------- //
// Game Notation - stores all moves

export function FanoronaGameNotation() {
	this.notationText = "";
	this.moves = [];
}

FanoronaGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

FanoronaGameNotation.prototype.addNotationLine = function(text) {
	if (this.notationText) {
		this.notationText += ";" + text.trim();
	} else {
		this.notationText = text.trim();
	}
	this.loadMoves();
};

FanoronaGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

FanoronaGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

FanoronaGameNotation.prototype.getPlayerMoveNum = function() {
	var moveNum = 0;
	var lastMove = this.moves[this.moves.length - 1];

	if (lastMove) {
		moveNum = lastMove.moveNum;
		if (lastMove.player === GUEST) {
			moveNum++;
		}
	}
	return moveNum;
};

FanoronaGameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
	var moveNum = 0;
	var player = HOST;

	var lastMove = this.moves[this.moves.length - 1];

	if (lastMove) {
		moveNum = lastMove.moveNum;
		if (lastMove.player === GUEST) {
			moveNum++;
		} else {
			player = GUEST;
		}
	}

	return builder.getNotationMove(moveNum, player);
};

FanoronaGameNotation.prototype.loadMoves = function() {
	this.moves = [];
	if (!this.notationText) {
		return;
	}

	var lines = this.notationText.includes(';')
		? this.notationText.split(";")
		: [this.notationText];

	var self = this;
	var lastPlayer = GUEST;

	lines.forEach(function(line) {
		var move = new FanoronaNotationMove(line.trim());
		if (move.isValidNotation() && move.player !== lastPlayer) {
			self.moves.push(move);
			lastPlayer = move.player;
		}
	});
};

FanoronaGameNotation.prototype.getNotationHtml = function() {
	var lines = [];
	if (this.notationText) {
		lines = this.notationText.includes(';')
			? this.notationText.split(";")
			: [this.notationText];
	}

	var notationHtml = "";
	lines.forEach(function(line) {
		notationHtml += line + "<br />";
	});

	return notationHtml;
};

FanoronaGameNotation.prototype.notationTextForUrl = function() {
	return this.notationText;
};

FanoronaGameNotation.prototype.getNotationForEmail = function() {
	var lines = [];
	if (this.notationText) {
		lines = this.notationText.includes(';')
			? this.notationText.split(";")
			: [this.notationText];
	}

	var notationHtml = "";
	lines.forEach(function(line) {
		notationHtml += line + "[BR]";
	});

	return notationHtml;
};

FanoronaGameNotation.prototype.getLastMoveText = function() {
	if (this.moves.length > 0) {
		return this.moves[this.moves.length - 1].fullMoveText;
	}
	return "";
};

FanoronaGameNotation.prototype.getLastMoveNumber = function() {
	return this.moves.length;
};
