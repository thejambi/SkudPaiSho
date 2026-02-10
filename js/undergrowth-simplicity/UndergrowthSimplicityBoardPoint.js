// Undergrowth Simplicity Board Point

import {
	GATE,
	NEUTRAL,
	NON_PLAYABLE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { GUEST, HOST } from '../CommonNotationObjects';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';

export var CENTER_POINT = "Center Point";

export function UndergrowthSimplicityBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
}

UndergrowthSimplicityBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

UndergrowthSimplicityBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

UndergrowthSimplicityBoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

UndergrowthSimplicityBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

UndergrowthSimplicityBoardPoint.prototype.hasTile = function() {
	if (this.tile) {
		return true;
	}
	return false;
};

UndergrowthSimplicityBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;
	this.tile = null;
	return theTile;
};

UndergrowthSimplicityBoardPoint.prototype.isOpenGate = function() {
	return !this.hasTile() && this.types.includes(GATE);
};

UndergrowthSimplicityBoardPoint.prototype.canHoldTile = function() {
	if (this.isType(NON_PLAYABLE)) {
		return false;
	}
	if (this.isType(CENTER_POINT)) {
		return false;
	}
	if (this.hasTile()) {
		return false;
	}
	return true;
};

UndergrowthSimplicityBoardPoint.prototype.isCentralGarden = function() {
	return this.isType(RED) || this.isType(WHITE);
};

UndergrowthSimplicityBoardPoint.prototype.isNeutralGardenOnly = function() {
	return this.isType(NEUTRAL) && !this.isType(RED) && !this.isType(WHITE);
};

UndergrowthSimplicityBoardPoint.prototype.getCopy = function() {
	var copy = new UndergrowthSimplicityBoardPoint();

	for (var i = 0; i < this.types.length; i++) {
		copy.types.push(this.types[i]);
	}

	copy.row = this.row;
	copy.col = this.col;

	if (this.hasTile()) {
		copy.tile = this.tile.getCopy();
	}

	copy.betweenConnection = this.betweenConnection;
	copy.betweenConnectionHost = this.betweenConnectionHost;
	copy.betweenConnectionGuest = this.betweenConnectionGuest;

	return copy;
};

UndergrowthSimplicityBoardPoint.prototype.getConsoleDisplay = function() {
	if (this.tile) {
		return this.tile.ownerCode === 'H' ? 'W' : 'B';
	}
	if (this.types.includes(NON_PLAYABLE)) {
		return " ";
	}
	if (this.types.includes(GATE)) {
		return "G";
	}
	if (this.types.includes(CENTER_POINT)) {
		return "X";
	}
	return ".";
};

// Static factory methods (required by PaiShoBoardHelper)

UndergrowthSimplicityBoardPoint.neutral = function() {
	var point = new UndergrowthSimplicityBoardPoint();
	point.addType(NEUTRAL);
	return point;
};

UndergrowthSimplicityBoardPoint.gate = function() {
	var point = new UndergrowthSimplicityBoardPoint();
	point.addType(GATE);
	return point;
};

UndergrowthSimplicityBoardPoint.red = function() {
	var point = new UndergrowthSimplicityBoardPoint();
	point.addType(RED);
	return point;
};

UndergrowthSimplicityBoardPoint.white = function() {
	var point = new UndergrowthSimplicityBoardPoint();
	point.addType(WHITE);
	return point;
};

UndergrowthSimplicityBoardPoint.redWhite = function() {
	var point = new UndergrowthSimplicityBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	return point;
};

UndergrowthSimplicityBoardPoint.redWhiteNeutral = function() {
	var point = new UndergrowthSimplicityBoardPoint();
	point.addType(RED);
	point.addType(WHITE);
	point.addType(NEUTRAL);
	return point;
};

UndergrowthSimplicityBoardPoint.redNeutral = function() {
	var point = new UndergrowthSimplicityBoardPoint();
	point.addType(RED);
	point.addType(NEUTRAL);
	return point;
};

UndergrowthSimplicityBoardPoint.whiteNeutral = function() {
	var point = new UndergrowthSimplicityBoardPoint();
	point.addType(WHITE);
	point.addType(NEUTRAL);
	return point;
};
