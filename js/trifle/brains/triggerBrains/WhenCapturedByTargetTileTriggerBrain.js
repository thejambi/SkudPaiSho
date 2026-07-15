import { TrifleTriggerHelper } from '../TriggerHelper';

export function TrifleWhenCapturedByTargetTileTriggerBrain(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];

	this.possibleTargetTile = triggerContext.lastTurnAction.tileMovedOrPlaced;
	this.possibleTargetTileInfo = triggerContext.lastTurnAction.tileMovedOrPlacedInfo;
	this.possibleTargetTilePoint = triggerContext.lastTurnAction.boardPointEnd;

	if (!this.possibleTargetTilePoint) {
		this.possibleTargetTilePoint = triggerContext.lastTurnAction.tileMovedOrPlaced.seatedPoint;
	}

	this.thisTile = triggerContext.tile;
	this.thisTileInfo = triggerContext.tileInfo;
	this.thisTilePoint = triggerContext.pointWithTile;

	this.capturedTiles = triggerContext.lastTurnAction.capturedTiles;

	this.setAction();
}

TrifleWhenCapturedByTargetTileTriggerBrain.prototype.setAction = function() {
	/* Identify the capture event: the set of tiles captured by the current action.
	   Abilities whose triggers share a capture event co-activate even if an earlier
	   activation changed the board (see getReadyAbilitiesWithTriggeringActions). */
	this.triggeringAction = {
		actionType: "Capture",
		capturedTileIds: (this.capturedTiles || []).map((tile) => tile.id).sort((a, b) => a - b)
	};
};

TrifleWhenCapturedByTargetTileTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	if (this.possibleTargetTilePoint && this.possibleTargetTilePoint.tile === this.possibleTargetTile) {
		if (this.capturedTiles.includes(this.thisTile)) {
			var triggerHelper = new TrifleTriggerHelper(this.triggerContext, this.possibleTargetTilePoint, this.possibleTargetTile);
			if (triggerHelper.tileIsTargeted()) {
				this.targetTiles.push(this.possibleTargetTilePoint.tile);
				this.targetTilePoints.push(this.possibleTargetTilePoint);
			}
		}
	}

	return this.targetTiles.length > 0;
};


