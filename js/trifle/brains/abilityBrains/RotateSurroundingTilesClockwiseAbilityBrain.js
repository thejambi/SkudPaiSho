import { debug } from '../../../GameData';
import { NON_PLAYABLE } from '../../../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	TrifleAnimationType,
	TrifleAnimationInstruction,
	TrifleAnimationSequence
} from '../../animation/TrifleAnimationTypes';

export function TrifleRotateSurroundingTilesClockwiseAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

/* Clockwise offsets around a center point, starting from top */
TrifleRotateSurroundingTilesClockwiseAbilityBrain.clockwiseOffsets = [
	{ row: -1, col: 0 },	// top
	{ row: -1, col: 1 },	// top-right
	{ row: 0, col: 1 },	// right
	{ row: 1, col: 1 },	// bottom-right
	{ row: 1, col: 0 },	// bottom
	{ row: 1, col: -1 },	// bottom-left
	{ row: 0, col: -1 },	// left
	{ row: -1, col: -1 }	// top-left
];

TrifleRotateSurroundingTilesClockwiseAbilityBrain.prototype.activateAbility = function() {
	debug("Rotate Surrounding Tiles Clockwise ability activating...");

	var board = this.abilityObject.board;
	var centerPoint = this.abilityObject.sourceTilePoint;
	var centerRow = centerPoint.row;
	var centerCol = centerPoint.col;
	var animations = new TrifleAnimationSequence();

	/* Build ordered ring of valid surrounding positions */
	var positions = [];
	TrifleRotateSurroundingTilesClockwiseAbilityBrain.clockwiseOffsets.forEach(function(offset) {
		var r = centerRow + offset.row;
		var c = centerCol + offset.col;
		if (r >= 0 && r < 17 && c >= 0 && c < 17) {
			var bp = board.cells[r][c];
			if (!bp.isType(NON_PLAYABLE)) {
				positions.push(bp);
			}
		}
	});

	if (positions.length < 2) {
		return { animations: animations };
	}

	/* Collect tiles from each position (null if empty) */
	var tiles = positions.map(function(p) {
		return p.hasTile() ? p.tile : null;
	});

	/* Build SLIDE animation instructions before moving tiles */
	for (var i = 0; i < positions.length; i++) {
		if (tiles[i]) {
			var nextIndex = (i + 1) % positions.length;
			animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
				tile: tiles[i],
				tileId: tiles[i].id,
				startPoint: { row: positions[i].row, col: positions[i].col },
				endPoint: { row: positions[nextIndex].row, col: positions[nextIndex].col },
				duration: 600,
				easing: 'ease-in-out',
				priority: 0,
				parallel: true,
				abilitySource: 'rotateSurroundingTilesClockwise'
			}));
		}
	}

	/* Remove all tiles from the ring */
	positions.forEach(function(p) {
		if (p.hasTile()) {
			p.removeTile();
		}
	});

	/* Place each tile at the next clockwise position.
	   Tile from position[i] goes to position[(i+1) % n]. */
	for (var i = 0; i < positions.length; i++) {
		if (tiles[i]) {
			var nextIndex = (i + 1) % positions.length;
			positions[nextIndex].putTile(tiles[i]);
		}
	}

	this.abilityObject.boardChanged = true;

	return {
		animations: animations
	};
};
