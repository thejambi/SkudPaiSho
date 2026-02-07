import { debug } from '../../../GameData';
import {
	TrifleAnimationType,
	TrifleAnimationInstruction,
	TrifleAnimationSequence
} from '../../animation/TrifleAnimationTypes';

export function TrifleSubstituteForCaptureAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

TrifleSubstituteForCaptureAbilityBrain.prototype.activateAbility = function() {
	var targetTiles = this.abilityObject.abilityTargetTiles;
	var targetTilePoints = this.abilityObject.abilityTargetTilePoints;

	this.capturedTiles = [];
	var animations = new TrifleAnimationSequence();

	if (!targetTiles || targetTiles.length === 0) {
		return { capturedTiles: this.capturedTiles, animations: animations };
	}

	// Default to first captured tile
	var restoredTile = targetTiles[0];
	var restoredTileOriginalPoint = targetTilePoints && targetTilePoints.length > 0
		? targetTilePoints[0]
		: null;

	var sourceTile = this.abilityObject.sourceTile;
	var sourceTilePoint = sourceTile.seatedPoint;

	// Verify source tile is still on the board
	if (!sourceTilePoint || !sourceTilePoint.hasTile()
		|| sourceTilePoint.tile !== sourceTile) {
		debug("SubstituteForCapture: Source tile not at expected position");
		return { capturedTiles: this.capturedTiles, animations: animations };
	}

	// === Record positions BEFORE board mutation for animations ===
	var sourceTilePosition = {
		row: sourceTilePoint.row,
		col: sourceTilePoint.col
	};

	var restoredTileOriginalPosition = restoredTileOriginalPoint
		? { row: restoredTileOriginalPoint.row, col: restoredTileOriginalPoint.col }
		: null;

	// === Execute board state changes ===

	// Remove source tile from the board, then place the restored tile at its
	// position. The source tile takes the hit, the saved tile takes its spot.
	sourceTilePoint.removeTile();

	sourceTilePoint.putTile(restoredTile);
	restoredTile.seatedPoint = sourceTilePoint;

	// Capture source tile (the substitute)
	this.capturedTiles.push(sourceTile);
	sourceTile.beingCapturedByAbility = true;

	// Track for resurrection if applicable
	if (sourceTile.deployPoint) {
		this.abilityObject.board.capturedTilesForResurrection.push(sourceTile);
	}

	this.abilityObject.boardChanged = true;

	debug("SubstituteForCapture: " + sourceTile.code + " captured instead of " + restoredTile.code);

	// === Build animation sequence ===

	// Animation 1: Pulse on source tile to indicate ability activation
	animations.add(new TrifleAnimationInstruction(TrifleAnimationType.PULSE, {
		tile: sourceTile,
		tileId: sourceTile.id,
		startPoint: sourceTilePosition,
		duration: 400,
		priority: 0,
		color: '#ffcc00',  // Golden glow for sacrifice ability
		abilitySource: 'substituteForCapture:pulse'
	}));

	// Animation 2: Source tile fades out (sacrificing itself)
	animations.add(new TrifleAnimationInstruction(TrifleAnimationType.FADE_OUT, {
		tile: sourceTile,
		tileId: sourceTile.id,
		startPoint: sourceTilePosition,
		duration: 600,
		delay: 100,
		priority: 1,
		parallel: true,
		abilitySource: 'substituteForCapture:fadeOut'
	}));

	// Animation 3: Saved tile appears at source tile's position
	if (restoredTileOriginalPosition) {
		// Slide in from where it was captured
		animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
			tile: restoredTile,
			tileId: restoredTile.id,
			startPoint: restoredTileOriginalPosition,
			endPoint: sourceTilePosition,
			duration: 800,
			delay: 200,
			priority: 2,
			parallel: true,
			abilitySource: 'substituteForCapture:slideIn'
		}));
	} else {
		// Pop in if we don't have original position
		animations.add(new TrifleAnimationInstruction(TrifleAnimationType.POP, {
			tile: restoredTile,
			tileId: restoredTile.id,
			endPoint: sourceTilePosition,
			duration: 600,
			delay: 500,
			priority: 2,
			abilitySource: 'substituteForCapture:popIn'
		}));
	}

	return {
		capturedTiles: this.capturedTiles,
		animations: animations
	};
};
