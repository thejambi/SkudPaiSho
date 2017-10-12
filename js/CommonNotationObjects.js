// Common Notation Objects and Variables

var GUEST = "GUEST";
var HOST = "HOST";

// Turn actions ----------------
var PLANTING = "Planting";
var ARRANGING = "Arranging";

var DEPLOY = "Deploy";
var MOVE = "Move";

var INITIAL_SETUP = "Initial Setup";
// -----------------------------

function RowAndColumn(row, col) {
	this.row = row;
	this.col = col;

	var x = col - 8;
	var y = 8 - row;
	this.notationPointString = x + "," + y;
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

