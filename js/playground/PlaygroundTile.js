
function PlaygroundTile(gameType, code, ownerCode) {
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

	this.gameType = gameType;
}

PlaygroundTile.prototype.getConsoleDisplay = function() {
	return this.ownerCode + "" + this.code;
};

PlaygroundTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code.substring(this.code.indexOf("_") + 1);
};

PlaygroundTile.prototype.getNotationName = function() {
	return this.ownerCode + "" + this.code;
}

PlaygroundTile.prototype.getMoveDistance = function() {
	if (this.type === BASIC_FLOWER) {
		return parseInt(this.basicValue);
	} else if (this.code === 'L') {
		return 2;
	} else if (this.code === 'O') {
		return 6;
	}
	return 0;
};

PlaygroundTile.prototype.getName = function() {
	return PlaygroundTile.getTileName(this.code);
};

PlaygroundTile.prototype.getCopy = function() {
	return new PlaygroundTile(this.code, this.ownerCode);
};


PlaygroundTile.getTileName = function(tileCode) {
	var name = "";
	
	if (tileCode.length > 1) {
		var colorCode = tileCode.charAt(0);
		var tileNum = tileCode.charAt(1);

		if (colorCode === 'R') {
			if (tileNum === '3') {
				name = "Rose";
			} else if (tileNum === '4') {
				name = "Chrysanthemum";
			} else if (tileNum === '5') {
				name = "Rhododendron";
			}
			name += " (Red " + tileNum + ")";
		} else if (colorCode === 'W') {
			if (tileNum === '3') {
				name = "Jasmine";
			} else if (tileNum === '4') {
				name = "Lily";
			} else if (tileNum === '5') {
				name = "White Jade";
			}
			name += " (White " + tileNum + ")";
		}
	} else {
		if (tileCode === 'R') {
			name = "Rock";
		} else if (tileCode === 'W') {
			name = "Wheel";
		} else if (tileCode === 'K') {
			name = "Knotweed";
		} else if (tileCode === 'B') {
			name = "Boat";
		} else if (tileCode === 'O') {
			name = "Orchid";
		} else if (tileCode === 'L') {
			name = "White Lotus";
		}
	}

	return name;
};
