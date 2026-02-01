/**
 * WhileOnBoardTriggerBrain
 *
 * Trigger brain for abilities that are active while the source tile is on the board.
 * This is a simple trigger that's always true for any tile on the board.
 */

export function TrifleWhileOnBoardTriggerBrain(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

TrifleWhileOnBoardTriggerBrain.prototype.isTriggerMet = function() {
	this.targetTiles = [];
	this.targetTilePoints = [];

	// If the tile is being evaluated, it's on the board, so the trigger is met
	// The tile itself is the target
	if (this.triggerContext.tile && this.triggerContext.pointWithTile) {
		this.thisTile = this.triggerContext.tile;
		this.targetTiles.push(this.thisTile);
		this.targetTilePoints.push(this.triggerContext.pointWithTile);
		return true;
	}

	return false;
};
