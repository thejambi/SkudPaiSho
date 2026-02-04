import { TrifleTargetHelper } from '../TargetHelper';

export function TrifleSurroundingTilesTargetBrain(abilityObject) {
	this.abilityObject = abilityObject;
	this.board = abilityObject.board;

	this.targetTiles = [];
	this.targetTilePoints = [];
	
	this.setTargets();
}

TrifleSurroundingTilesTargetBrain.prototype.setTargets = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	var self = this;
	var sourceTilePoint = this.abilityObject.sourceTilePoint;
	var surroundingPoints = this.board.getSurroundingBoardPoints(sourceTilePoint);

	surroundingPoints.forEach(function(surroundingPoint) {
		if (!surroundingPoint.hasTile()) {
			return;
		}

		var targetHelper = new TrifleTargetHelper(self.abilityObject, surroundingPoint, self);
		if (targetHelper.tileIsTargeted()) {
			self.targetTiles.push(surroundingPoint.tile);
			self.targetTilePoints.push(surroundingPoint);
		}
	});
};

