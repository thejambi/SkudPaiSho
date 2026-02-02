import { TrifleTriggerHelper } from '../TriggerHelper';

export function TrifleWhileTargetTileIsWithinDistanceTriggerBrain(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

TrifleWhileTargetTileIsWithinDistanceTriggerBrain.prototype.isTriggerMet = function() {
	/* Get tiles within specified distance (default to 1) */
	const abilityTriggerInfo = this.triggerContext.abilityTriggerInfo || {};
	const distance = abilityTriggerInfo.distance || 1;
	const centerPoint = this.triggerContext.pointWithTile;

	var self = this;

	// Check all points within the specified distance
	this.board.forEachBoardPoint(function(boardPoint) {
		if (boardPoint.hasTile() && boardPoint !== centerPoint) {
			const pointDistance = self.board.getDistanceBetweenPoints(centerPoint, boardPoint);
			if (pointDistance <= distance) {
				var triggerHelper = new TrifleTriggerHelper(self.triggerContext, boardPoint);
				if (triggerHelper.tileIsTargeted()) {
					self.targetTiles.push(boardPoint.tile);
					self.targetTilePoints.push(boardPoint);
				}
			}
		}
	});

	return this.targetTiles.length > 0;
};

