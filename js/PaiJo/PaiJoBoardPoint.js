// DEFAULTS HERE ARE NOT USED IN THE PROJECT, BUT UNTOUCHED TO NOT BRING THE SITE IN CONFUSION
// PAIJO USES THE INDEX.HTML as main (iframe in PaiJoController).

function PaiJoBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
	this.notationRowNum = -1;
	this.notationRowString = '';
	this.notationColNum = -1;
	this.notationColString = '';
}

PaiJoBoardPoint.Types = {
	nonPlayable: "Non-Playable",
	scoreTrack: "Score Track",
	normal: "Normal",
	throne: "Throne",
	corner: "Corner"
};

PaiJoBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

PaiJoBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

PaiJoBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;
	this.tile = null;
	return theTile;
};

PaiJoBoardPoint.prototype.getNotationPointString = function() {
	return this.notationColString + this.notationRowString;
};

PaiJoBoardPoint.prototype.setNotationRow = function(rowNum) {
	this.notationRowNum = rowNum;
	this.notationRowString = rowNum.toString();
};

PaiJoBoardPoint.prototype.setNotationCol = function(colNum) {
	this.notationColNum = colNum;
	this.notationColString = String.fromCharCode(96 + colNum);
};

PaiJoBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

PaiJoBoardPoint.prototype.hasTile = function() {
	return this.tile;
};

PaiJoBoardPoint.notationPointStringMap = {};
