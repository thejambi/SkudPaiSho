import { TrifleTriggerHelper } from '../TriggerHelper';

export function TrifleWhileTargetTileIsSurroundingTriggerBrain(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

TrifleWhileTargetTileIsSurroundingTriggerBrain.prototype.isTriggerMet = function() {
	/* Get surrounding tiles...  */
	var surroundingPoints = this.board.getSurroundingBoardPoints(this.triggerContext.pointWithTile);

	var self = this;

	surroundingPoints.forEach(function(surroundingPoint) {
		if (surroundingPoint.hasTile()) {
			var triggerHelper = new TrifleTriggerHelper(self.triggerContext, surroundingPoint);
			if (triggerHelper.tileIsTargeted()) {
				self.targetTiles.push(surroundingPoint.tile);
				self.targetTilePoints.push(surroundingPoint);
			}
		}
	});

	return this.targetTiles.length > 0;
};

