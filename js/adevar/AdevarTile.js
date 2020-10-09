
function AdevarTile(code, ownerCode) {
	this.code = code;
	this.ownerCode = ownerCode;
	if (this.ownerCode === 'G') {
		this.ownerName = GUEST;
	} else if (this.ownerCode === 'H') {
		this.ownerName = HOST;
	}
	this.id = tileId++;
	this.drained = false;
	this.selectedFromPile = false;
}

AdevarTile.prototype.getConsoleDisplay = function() {
	return this.ownerCode + "" + this.code;
};

AdevarTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

AdevarTile.prototype.getNotationName = function() {
	return this.ownerCode + "" + this.code;
}

AdevarTile.prototype.getMovementInfo = function() {
	return {
		distance: this.getMoveDistance()
	}
};

AdevarTile.prototype.getMoveDistance = function() {
	if (this.type === BASIC_FLOWER) {	// Adjust accordingly :)
		return parseInt(this.basicValue);
	} else if (this.code === 'Foxglove') {
		return 5;
	} else if (this.code === 'Zinnia') {
		return 4;
	} else if (this.code === 'Lilac') {
		return 3;
	} else if (this.code === 'WatersReflection') {
		return 7;
	} else if (this.code === 'IrisSecondFace') {
		return 7;
	} else if (this.code === 'OrientalLilySecondFace') {
		return 7;
	} else if (this.code === 'EcheveriaSecondFace') {
		return 7;
	}
	return 0;	// 8!? lol
};

AdevarTile.prototype.getName = function() {
	return AdevarTile.getTileName(this.code);
};

AdevarTile.prototype.getCopy = function() {
	return new AdevarTile(this.code, this.ownerCode);
};


AdevarTile.getTileName = function(tileCode) {
	return tileCode;
};
