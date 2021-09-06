// Spirit Pai Sho Tile

// var tileId = 1;	// common

function SpiritTile(code, ownerCode) {
	this.code = code;
	this.ownerCode = ownerCode;
	if (this.ownerCode === 'G') {
		this.ownerName = GUEST;
	} else if (this.ownerCode === 'H') {
		this.ownerName = HOST;
	} else {
		debug("INCORRECT OWNER CODE");
	}
	this.id = tileId++;
	this.selectedFromPile = false;
}

SpiritTile.prototype.getImageName = function() {
	return this.ownerCode + "" + this.code;
};

SpiritTile.prototype.getMoveDistance = function() {
	return 3;
};

SpiritTile.prototype.getName = function() {
	return SpiritTile.getTileName(this.code);
};

SpiritTile.prototype.canCapture = function(otherTile) {
	if (otherTile.ownerCode !== this.ownerCode) {
		// Can only capture other player's tiles...
		var tileOrder = ['Raava','WanShiTong','La','MotherOfFaces','Vaatu','HeiBai','Tui','Koh'];
		var thisIndex = tileOrder.indexOf(this.code);
		// If index of otherTile is one of the next three, then capture
		var otherIndex = tileOrder.indexOf(otherTile.code);

		if (thisIndex > otherIndex) {
			otherIndex += tileOrder.length;
		}

		return otherIndex !== thisIndex && otherIndex - thisIndex <= 2;
	} else {
		return false;
	}
};

SpiritTile.prototype.isImmortal = function(otherTiles) {
	for(var i = 0; i < otherTiles.length; i ++) {
		if (otherTiles[i].canCapture(this)) {
			return false;
		}
	}
	return true;
}

SpiritTile.prototype.getCopy = function() {
	return new SpiritTile(this.code, this.ownerCode);
};

SpiritTile.getTileName = function(tileCode) {
	var name = "";
	
	if (tileCode === 'Raava') {
		name = "Raava";
	} else if (tileCode === 'WanShiTong') {
		name = "Wan Shi Tong";
	} else if (tileCode === 'La') {
		name = "La";
	} else if (tileCode === 'MotherOfFaces') {
		name = "Mother Of Faces";
	} else if (tileCode === 'Vaatu') {
		name = "Vaatu";
	} else if (tileCode === 'HeiBai') {
		name = "Hei Bai";
	} else if (tileCode === 'Tui') {
		name = "Tui";
	} else if (tileCode === 'Koh') {
		name = "Koh";
	}

	return name;
};

SpiritTile.prototype.getStartingPoint = function() {
	var x = 0;
	var y = 0;

	if (tileCode === 'Raava') {
		x = 1;
		y = 1;
	} else if (tileCode === 'WanShiTong') {
		x = 4;
		y = -1;
	} else if (tileCode === 'La') {
		x = 3;
		y = 2;
	} else if (tileCode === 'MotherOfFaces') {
		x = 1;
		y = -4;
	} else if (tileCode === 'Vaatu') {
		x = 5;
		y = 0;
	} else if (tileCode === 'HeiBai') {
		x = 2;
		y = 2;
	} else if (tileCode === 'Tui') {
		x = 3;
		y = -2;
	} else if (tileCode === 'Koh') {
		x = 4;
		y = 1;
	}
	if (this.ownerCode === 'G') {
		x = -x;
		y = -y;
	}
	return new NotationPoint(x +","+ y);
};