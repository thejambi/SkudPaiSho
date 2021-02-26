
function MeadowBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
	this.notationRowNum = -1;
	this.notationRowString = '';
	this.notationColNum = -1;
	this.notationColString = '';
}

MeadowBoardPoint.Types = {
	nonPlayable: "Non-Playable",
	scoreTrack: "Score Track",
	normal: "Normal"
};

MeadowBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

MeadowBoardPoint.prototype.getNotationPointString = function() {
	return this.notationColString + this.notationRowString;
};

MeadowBoardPoint.prototype.setNotationRow = function(rowNum) {
	this.notationRowNum = rowNum;
	this.notationRowString = rowNum.toString();
};

MeadowBoardPoint.prototype.setNotationCol = function(colNum) {
	this.notationColNum = colNum;
	this.notationColString = String.fromCharCode(96 + colNum);
};

MeadowBoardPoint.prototype.putTile = function(tile) {
	this.tile = tile;
};

MeadowBoardPoint.prototype.hasTile = function() {
	return this.tile;
};

MeadowBoardPoint.notationPointStringMap = {};
