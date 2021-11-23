
Trifle.ThisTileTargetBrain = class {
	constructor(abilityObject) {
		this.abilityObject = abilityObject;
		this.board = abilityObject.board;

		this.targetTiles = [];
		this.targetTilePoints = [];

		this.setTargets();
	}

	setTargets() {
		this.targetTiles = [];
		this.targetTilePoints = [];

		var targetHelper = new Trifle.TargetHelper(this.abilityObject, this.abilityObject.sourceTilePoint, this);
		if (targetHelper.tileIsTargeted()) {
			this.targetTiles.push(this.abilityObject.sourceTile);
			this.targetTilePoints.push(this.abilityObject.sourceTilePoint);
		}
	}
}

/* Version using .prototype: */
/* Trifle.ThisTileTargetBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;

	this.targetTiles = [];
	this.targetTilePoints = [];
	
	this.setTargets();
}

Trifle.ThisTileTargetBrain.prototype.setTargets = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	var targetHelper = new Trifle.TargetHelper(this.abilityObject, this.abilityObject.sourceTilePoint, this);
	if (targetHelper.tileIsTargeted()) {
		this.targetTiles.push(this.abilityObject.sourceTile);
		this.targetTilePoints.push(this.abilityObject.sourceTilePoint);
	}
}; */


