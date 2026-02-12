// Undergrowth Simplicity Game Notation

import { BRAND_NEW } from '../GameConstants';
import { GUEST, HOST, NotationPoint } from '../CommonNotationObjects';
import { debug } from '../GameData';

// ============ Notation Move ============

export function UndergrowthSimplicityNotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

UndergrowthSimplicityNotationMove.prototype.analyzeMove = function() {
	this.valid = true;

	// Example moves:
	// 0H.(0,8)           - single placement
	// 1G.(-8,0)+(0,-8)   - double placement
	// 3G.(1,2)+(-1,3)    - normal turn

	var parts = this.fullMoveText.split(".");

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
		this.valid = false;
		return;
	}

	// Parse placements separated by '+'
	this.placements = [];
	var placementTexts = moveText.split("+");

	for (var i = 0; i < placementTexts.length; i++) {
		var pText = placementTexts[i].trim();
		if (pText.startsWith("(") && pText.endsWith(")")) {
			var coordText = pText.substring(1, pText.length - 1);
			try {
				this.placements.push(new NotationPoint(coordText));
			} catch (e) {
				this.valid = false;
			}
		} else {
			this.valid = false;
		}
	}

	// For convenience, set endPoint and endPoint2
	if (this.placements.length >= 1) {
		this.endPoint = this.placements[0];
	}
	if (this.placements.length >= 2) {
		this.endPoint2 = this.placements[1];
	}
};

UndergrowthSimplicityNotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

UndergrowthSimplicityNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};

// ============ Notation Builder ============

export var WAITING_FOR_SECOND_PLACEMENT = "Waiting for second placement";

export function UndergrowthSimplicityNotationBuilder() {
	this.status = BRAND_NEW;
	this.placements = []; // Array of NotationPoint
}

UndergrowthSimplicityNotationBuilder.prototype.addPlacement = function(notationPoint) {
	this.placements.push(notationPoint);
};

UndergrowthSimplicityNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var notationLine = moveNum + player.charAt(0) + ".";
	for (var i = 0; i < this.placements.length; i++) {
		if (i > 0) notationLine += "+";
		notationLine += "(" + this.placements[i].pointText + ")";
	}
	return new UndergrowthSimplicityNotationMove(notationLine);
};

// ============ Game Notation ============

export function UndergrowthSimplicityGameNotation() {
	this.notationText = "";
	this.moves = [];
}

UndergrowthSimplicityGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

UndergrowthSimplicityGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

UndergrowthSimplicityGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

UndergrowthSimplicityGameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
	var moveNum = 1;
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

UndergrowthSimplicityGameNotation.prototype.loadMoves = function() {
	this.moves = [];
	var lines = [];
	if (this.notationText) {
		if (this.notationText.includes(';')) {
			lines = this.notationText.split(";");
		} else {
			lines = [this.notationText];
		}
	}

	var self = this;
	var lastPlayer = GUEST;
	lines.forEach(function(line) {
		var move = new UndergrowthSimplicityNotationMove(line);
		if (move.moveNum === 0 && move.isValidNotation()) {
			self.moves.push(move);
		} else if (move.isValidNotation() && move.player !== lastPlayer) {
			self.moves.push(move);
			lastPlayer = move.player;
		} else {
			debug("Notation parse issue: " + line);
		}
	});
};

UndergrowthSimplicityGameNotation.prototype.getNotationHtml = function() {
	var lines = [];
	if (this.notationText) {
		if (this.notationText.includes(';')) {
			lines = this.notationText.split(";");
		} else {
			lines = [this.notationText];
		}
	}
	var notationHtml = "";
	lines.forEach(function(line) {
		notationHtml += line + "<br />";
	});
	return notationHtml;
};

UndergrowthSimplicityGameNotation.prototype.getNotationForEmail = function() {
	var lines = [];
	if (this.notationText) {
		if (this.notationText.includes(';')) {
			lines = this.notationText.split(";");
		} else {
			lines = [this.notationText];
		}
	}
	var notationHtml = "";
	lines.forEach(function(line) {
		notationHtml += line + "[BR]";
	});
	return notationHtml;
};

UndergrowthSimplicityGameNotation.prototype.notationTextForUrl = function() {
	return this.notationText;
};

UndergrowthSimplicityGameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

UndergrowthSimplicityGameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};
