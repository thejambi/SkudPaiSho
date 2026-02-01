import { TrifleTriggerHelper } from '../TriggerHelper';

export function TrifleWhenAdjacentFriendlyTileIsCapturedTriggerBrain(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];

	// The tile that did the capturing (and moved/placed)
	this.capturingTile = triggerContext.lastTurnAction.tileMovedOrPlaced;
	this.capturingTilePoint = triggerContext.lastTurnAction.boardPointEnd;

	if (!this.capturingTilePoint && this.capturingTile) {
		this.capturingTilePoint = this.capturingTile.seatedPoint;
	}

	this.thisTile = triggerContext.tile;
	this.thisTileInfo = triggerContext.tileInfo;
	this.thisTilePoint = triggerContext.pointWithTile;

	// The tiles that were captured this turn
	this.capturedTiles = triggerContext.lastTurnAction.capturedTiles || [];
	// The points where captures happened (before tiles were removed)
	this.capturedTilePoints = triggerContext.lastTurnAction.capturedTilePoints || [];

	this.setAction();
}

TrifleWhenAdjacentFriendlyTileIsCapturedTriggerBrain.prototype.setAction = function() {
	this.triggeringAction = {
		actionType: "CaptureRetaliation",
		tileId: this.thisTile.tileId
	};
};

TrifleWhenAdjacentFriendlyTileIsCapturedTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	// Check if any captured tile was:
	// 1. Friendly (same owner as this tile)
	// 2. Adjacent to this tile at the time of capture

	if (!this.capturedTiles || this.capturedTiles.length === 0) {
		return false;
	}

	const self = this;
	let wasAdjacentFriendlyCaptured = false;

	this.capturedTiles.forEach((capturedTile, index) => {
		// Check if captured tile was friendly
		if (capturedTile.ownerName === self.thisTile.ownerName) {
			// Check if captured tile was adjacent to this tile
			// Use capturedTilePoints if available, otherwise estimate from capturing tile position
			const capturePoint = self.capturedTilePoints[index] || self.capturingTilePoint;

			if (capturePoint && self.thisTilePoint) {
				const distance = self.board.getDistanceBetweenPoints(self.thisTilePoint, capturePoint);
				if (distance === 1) {
					// Adjacent friendly tile was captured!
					wasAdjacentFriendlyCaptured = true;
				}
			}
		}
	});

	// If trigger is met, the target is the capturing enemy tile
	if (wasAdjacentFriendlyCaptured && this.capturingTile && this.capturingTilePoint) {
		// Check if the capturing tile matches target criteria
		var triggerHelper = new TrifleTriggerHelper(this.triggerContext, this.capturingTilePoint, this.capturingTile);
		if (triggerHelper.tileIsTargeted()) {
			this.targetTiles.push(this.capturingTile);
			this.targetTilePoints.push(this.capturingTilePoint);
		}
	}

	return this.targetTiles.length > 0;
};
