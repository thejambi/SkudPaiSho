
function TumbleweedBoardPoint() {
	this.types = [];
	this.row = -1;
	this.col = -1;
	this.notationRowNum = -1;
	this.notationRowString = '';
	this.notationColNum = -1;
	this.notationColString = '';
	this.settlement = null;
}

TumbleweedBoardPoint.notationPointStringMap = {};

TumbleweedBoardPoint.Types = {
	nonPlayable: "Non-Playable",
	normal: "Normal"
};

TumbleweedBoardPoint.prototype.addType = function(type) {
	if (!this.types.includes(type)) {
		this.types.push(type);
	}
};

TumbleweedBoardPoint.prototype.isType = function(type) {
	return this.types.includes(type);
};

TumbleweedBoardPoint.prototype.removeType = function(type) {
	for (var i = 0; i < this.types.length; i++) {
		if (this.types[i] === type) {
			this.types.splice(i, 1);
		}
	}
};

TumbleweedBoardPoint.prototype.getNotationPointString = function() {
	return this.notationColString + this.notationRowString;
};

TumbleweedBoardPoint.prototype.setNotationRow = function(rowNum) {
	this.notationRowNum = rowNum;
	this.notationRowString = rowNum.toString();
};

TumbleweedBoardPoint.prototype.setNotationCol = function(colNum) {
	this.notationColNum = colNum;
	this.notationColString = String.fromCharCode(96 + colNum);
};

TumbleweedBoardPoint.prototype.setSettlement = function(player, value) {
	this.settlement = {
		ownerName: player,
		value: value
	};
};

TumbleweedBoardPoint.prototype.hasSettlement = function() {
	return this.settlement != null;
};

TumbleweedBoardPoint.prototype.getSettlementOwner = function() {
	return this.settlement && this.settlement.ownerName;
};

TumbleweedBoardPoint.prototype.getSettlementValue = function() {
	return this.hasSettlement() ? this.settlement.value : 0;
};

