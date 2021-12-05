
Trifle.ChosenCapturedTileTargetBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;

	this.targetTiles = [];
	this.targetTilePoints = [];
	
	this.setTargets();
}

Trifle.ChosenCapturedTileTargetBrain.prototype.setTargets = function() {
	this.targetTiles = [];

	this.abilityObject.board.tileManager.capturedTiles.forEach(capturedTile => {
		var targetHelper = new Trifle.TargetHelper(this.abilityObject, null, this, capturedTile);
		if (targetHelper.tileIsTargeted()) {
			this.targetTiles.push(capturedTile);
		}
	});
};
