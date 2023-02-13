
BeyondTheMaps.TileType = {
	SHIP: "Ship",
	LAND: "Land"
};

BeyondTheMaps.Tile = class {
	constructor(tileType, ownerCode) {
		this.tileType = tileType;
		this.ownerCode = ownerCode;
		if (this.ownerCode === 'G') {
			this.ownerName = GUEST;
		} else if (this.ownerCode === 'H') {
			this.ownerName = HOST;
		}
		this.id = tileId++;
	}

	getConsoleDisplay() {
		return this.ownerCode + "" + this.tileType;
	}

	getImageName() {
		return this.ownerCode + "" + this.tileType;
	}

	getNotationName() {
		return this.ownerCode + "" + this.tileType;
	}

	getName() {
		return BeyondTheMaps.Tile.getTileName(this.tileType);
	}

	getMoveDistance() {
		return gameOptionEnabled(EDGES_MOVE_4_2) ? 4 : 6;
	}

	getCopy() {
		return new BeyondTheMaps.Tile(this.tileType, this.ownerCode);
	}

	static getTileName(tileType) {
		return tileType;
	}

};
