import { debug } from '../../../GameData';

export function TrifleSubstituteForCaptureAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

TrifleSubstituteForCaptureAbilityBrain.prototype.activateAbility = function() {
	var targetTiles = this.abilityObject.abilityTargetTiles;

	this.capturedTiles = [];

	if (!targetTiles || targetTiles.length === 0) {
		return { capturedTiles: this.capturedTiles };
	}

	// Substitute for the first captured friendly tile (Saffron can only die once)
	var restoredTile = targetTiles[0];

	var sourceTile = this.abilityObject.sourceTile;
	var sourceTilePoint = sourceTile.seatedPoint;

	// Verify Saffron is still on the board
	if (!sourceTilePoint || !sourceTilePoint.hasTile()
		|| sourceTilePoint.tile !== sourceTile) {
		debug("SubstituteForCapture: Source tile not at expected position");
		return { capturedTiles: this.capturedTiles };
	}

	// Remove Saffron from the board, then place the restored tile at Saffron's
	// position. This is a swap: Saffron takes the hit, the saved tile takes
	// Saffron's spot.
	sourceTilePoint.removeTile();

	sourceTilePoint.putTile(restoredTile);
	restoredTile.seatedPoint = sourceTilePoint;

	// Capture Saffron
	this.capturedTiles.push(sourceTile);
	sourceTile.beingCapturedByAbility = true;

	// Track for resurrection if applicable
	if (sourceTile.deployPoint) {
		this.abilityObject.board.capturedTilesForResurrection.push(sourceTile);
	}

	this.abilityObject.boardChanged = true;

	debug("SubstituteForCapture: " + sourceTile.code + " captured instead of " + restoredTile.code);

	return {
		capturedTiles: this.capturedTiles
	};
};
