
function HexentaflBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
	this.notationRowNum = -1;
	this.notationRowString = '';
	this.notationColNum = -1;
	this.notationColString = '';
}

HexentaflBoardPoint.Types = {
	nonPlayable: "Non-Playable",
	scoreTrack: "Score Track",
	normal: "Normal",
	throne: "Throne",
	corner: "Corner"
};

HexentaflBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

HexentaflBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

HexentaflBoardPoint.prototype.removeTile = function() {
	var theTile = this.tile;
	this.tile = null;
	return theTile;
};

HexentaflBoardPoint.prototype.getNotationPointString = function() {
	return this.notationColString + this.notationRowString;
};

HexentaflBoardPoint.prototype.setNotationRow = function(rowNum) {
	this.notationRowNum = rowNum;
	this.notationRowString = rowNum.toString();
};

HexentaflBoardPoint.prototype.setNotationCol = function(colNum) {
	this.notationColNum = colNum;
	this.notationColString = String.fromCharCode(96 + colNum);
};

HexentaflBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

HexentaflBoardPoint.prototype.hasTile = function() {
	return this.tile;
};

HexentaflBoardPoint.notationPointStringMap = {};
