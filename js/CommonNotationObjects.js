// Common Notation Objects and Variables

var GUEST = "GUEST";
var HOST = "HOST";
var OTHER_PLAYER = "OTHER";

// Turn actions ----------------
var PLANTING = "Planting";
var ARRANGING = "Arranging";

var DEPLOY = "Deploy";
var MOVE = "Move";

var TEAM_SELECTION = "Team Selection";

var INITIAL_SETUP = "Initial Setup";
// -----------------------------

var DRAW_OFFER = "~~"; //"≈";
var DRAW_REFUSE = "=/="; //"≠";
var DRAW_ACCEPT = "==";

// ---------

function RowAndColumn(row, col) {
	this.row = row;
	this.col = col;

	this.x = col - 8;
	this.y = 8 - row;
	this.notationPointString = this.x + "," + this.y;
}

RowAndColumn.prototype.samesies = function(other) {
	return this.row === other.row && this.col === other.col;
};

RowAndColumn.prototype.getNotationPoint = function() {
	return new NotationPoint(this.notationPointString);
};

// --------------------------------------------- // 

function NotationPoint(text) {
	this.pointText = text;

	var parts = this.pointText.split(',');

	this.x = parseInt(parts[0]);
	this.y = parseInt(parts[1]);

	var col = this.x + 8;
	var row = Math.abs(this.y - 8);

	this.rowAndColumn = new RowAndColumn(row, col);
}

NotationPoint.prototype.samesies = function(other) {
	return this.x === other.x && this.y === other.y;
};

NotationPoint.prototype.toArr = function() {
	return [this.x, this.y];
};

