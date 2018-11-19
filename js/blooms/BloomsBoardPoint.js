
function BloomsBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
	this.notationRowNum = -1;
	this.notationRowString = '';
	this.notationColNum = -1;
	this.notationColString = '';
}

BloomsBoardPoint.Types = {
	nonPlayable: "Non-Playable",
	scoreTrack: "Score Track",
	normal: "Normal"
};

BloomsBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

BloomsBoardPoint.prototype.getNotationPointString = function() {
	return this.notationColString + this.notationRowString;
};

BloomsBoardPoint.prototype.setNotationRow = function(rowNum) {
	this.notationRowNum = rowNum;
	this.notationRowString = rowNum.toString();
};

BloomsBoardPoint.prototype.setNotationCol = function(colNum) {
	this.notationColNum = colNum;
	this.notationColString = String.fromCharCode(96 + colNum);
};

BloomsBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

BloomsBoardPoint.prototype.hasTile = function() {
	return this.tile;
};

BloomsBoardPoint.notationPointStringMap = {};
