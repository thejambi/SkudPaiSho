import { TrifleTargetHelper } from '../TargetHelper';

export function TrifleTriggerTargetTilesTargetBrain(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;

	this.targetTiles = [];
	this.targetTilePoints = [];

	this.setTargets();
}

TrifleTriggerTargetTilesTargetBrain.prototype.setTargets = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	var possibleTargetTiles = [];
	var possibleTargetPoints = [];

	var self = this;

	if (this.abilityObject.abilityInfo.triggerTypeToTarget) {
		var targets = this.abilityObject.getTriggerTypeTargets(this.abilityObject.abilityInfo.triggerTypeToTarget);
		possibleTargetTiles = targets.targetTiles;
		possibleTargetPoints = targets.targetTilePoints;
	} else {
		possibleTargetTiles = this.abilityObject.triggerTargetTiles;
		possibleTargetPoints = this.abilityObject.triggerTargetTilePoints;
	}
	
	/* Use the parallel tile from possibleTargetTiles rather than re-reading from the
	   board point. The trigger brain already paired tiles with points, and the board
	   state may have changed since then (e.g. a captured tile is no longer at its point). */
	possibleTargetPoints.forEach(function(boardPointWithTile, index) {
		var tileForPoint = possibleTargetTiles[index] || boardPointWithTile.tile;
		var targetHelper = new TrifleTargetHelper(self.abilityObject, boardPointWithTile, self, tileForPoint);
		if (targetHelper.tileIsTargeted()) {
			self.targetTiles.push(tileForPoint);
			self.targetTilePoints.push(boardPointWithTile);
		}
	});

	possibleTargetTiles.forEach(function(possibleTargetTile) {
		var targetHelper = new TrifleTargetHelper(self.abilityObject, null, self, possibleTargetTile);
		if (targetHelper.tileIsTargeted() && !self.targetTiles.includes(possibleTargetTile)) {
			self.targetTiles.push(possibleTargetTile);
		}
	});
};


