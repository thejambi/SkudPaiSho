import { TrifleTriggerHelper } from '../TriggerHelper';

export function TrifleWhenTargetTileInZoneIsCapturedTriggerBrain(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];

	this.thisTile = triggerContext.tile;
	this.thisTileInfo = triggerContext.tileInfo;
	this.thisTilePoint = triggerContext.pointWithTile;

	this.capturedTiles = triggerContext.lastTurnAction.capturedTiles || [];
	this.capturedTilePoints = triggerContext.lastTurnAction.capturedTilePoints || [];

	this.setAction();
}

TrifleWhenTargetTileInZoneIsCapturedTriggerBrain.prototype.setAction = function() {
	/* Identify the capture event by the captured tile ids (see
	   WhenCapturedByTargetTileTriggerBrain.setAction) */
	this.triggeringAction = {
		actionType: "CaptureSubstitution",
		capturedTileIds: (this.capturedTiles || []).map((tile) => tile.id).sort((a, b) => a - b)
	};
};

TrifleWhenTargetTileInZoneIsCapturedTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	if (!this.capturedTiles || this.capturedTiles.length === 0) {
		return false;
	}

	if (!this.thisTilePoint) {
		return false;
	}

	var self = this;

	this.capturedTiles.forEach(function(capturedTile, index) {
		var capturePoint = self.capturedTilePoints[index];

		if (!capturePoint) {
			return;
		}

		// Check if captured tile matches target criteria (team, type, etc.)
		var triggerHelper = new TrifleTriggerHelper(self.triggerContext, capturePoint, capturedTile);
		if (triggerHelper.tileIsTargeted()) {
			// Check if the capture location was within this tile's zone
			if (self.board.pointTileZoneContainsPoint(self.thisTilePoint, capturePoint)) {
				self.targetTiles.push(capturedTile);
				self.targetTilePoints.push(capturePoint);
			}
		}
	});

	return this.targetTiles.length > 0;
};
