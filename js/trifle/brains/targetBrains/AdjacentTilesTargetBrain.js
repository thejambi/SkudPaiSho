import { TrifleTargetHelper } from '../TargetHelper';

export function TrifleAdjacentTilesTargetBrain(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;

	this.targetTiles = [];
	this.targetTilePoints = [];

	this.setTargets();
}

TrifleAdjacentTilesTargetBrain.prototype.setTargets = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	var self = this;
	var sourceTilePoint = this.abilityObject.sourceTilePoint;
	var adjacentPoints = this.board.getAdjacentPoints(sourceTilePoint);

	adjacentPoints.forEach(function(adjacentPoint) {
		if (!adjacentPoint.hasTile()) {
			return;
		}

		var targetHelper = new TrifleTargetHelper(self.abilityObject, adjacentPoint, self);
		if (targetHelper.tileIsTargeted()) {
			self.targetTiles.push(adjacentPoint.tile);
			self.targetTilePoints.push(adjacentPoint);
		}
	});
};
