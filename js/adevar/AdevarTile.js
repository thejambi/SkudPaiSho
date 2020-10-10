
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
	} else if (this.code === 'Foxglove') {	// Gives the Foxglove 5 spaces of movement
		return 5;
	} else if (this.code === 'Zinnia') {	// Gives the Zinnia 4 spaces of movement
		return 4;
	} else if (this.code === 'Lilac') {		// Gives the Lilac 3 spaces of movement
		return 3;
	} else if (this.code === 'WatersReflection') {	//Gives the Reflection tile 7 spaces of movement
		return 7;
	} else if (this.code === 'IrisSecondFace') {			//
		return 7;											//
	} else if (this.code === 'OrientalLilySecondFace') {	// Gives the Second Faces tiles 7 spaces of movement
		return 7;											//
	} else if (this.code === 'EcheveriaSecondFace') {		//
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
