import {
	TrifleAnimationType,
	TrifleAnimationInstruction,
	TrifleAnimationSequence
} from '../../animation/TrifleAnimationTypes';

export function TrifleCaptureTargetTilesAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

TrifleCaptureTargetTilesAbilityBrain.prototype.activateAbility = function() {
	var targetTilePoints = this.abilityObject.abilityTargetTilePoints;

	this.capturedTiles = [];
	var animations = new TrifleAnimationSequence();
	var lastCapturedPoint = null;

	// Record positions and tiles BEFORE capture for animations
	var captureRecords = [];

	// Get lastTurnAction for checking if captured tile is the one that moved
	var lastTurnAction = this.abilityObject.lastTurnAction;
	var tileMovedOrPlaced = lastTurnAction ? lastTurnAction.tileMovedOrPlaced : null;
	var boardPointStart = lastTurnAction ? lastTurnAction.boardPointStart : null;

	var self = this;
	if (targetTilePoints && targetTilePoints.length > 0) {
		targetTilePoints.forEach(function(targetTilePoint) {
			var tileIsCapturable = self.abilityObject.board.targetPointTileIsCapturableByTileAbility(targetTilePoint, self.abilityObject.sourceTile);
			var passesRestrictions = self.abilityObject.board.capturePassesCaptureProhibitionChecks(self.abilityObject.sourceTile, self.abilityObject.sourceTile.seatedPoint, targetTilePoint);
			if ((tileIsCapturable || self.abilityObject.abilityInfo.regardlessOfCaptureProtection) && passesRestrictions) {
				// Record position before capture
				var tileToCapture = targetTilePoint.tile;
				var capturePosition = { row: targetTilePoint.row, col: targetTilePoint.col };

				// Check if this is the tile that just moved - if so, record its move start position
				var moveStartPosition = null;
				if (tileMovedOrPlaced && tileToCapture.id === tileMovedOrPlaced.id && boardPointStart) {
					moveStartPosition = { row: boardPointStart.row, col: boardPointStart.col };
				}

				captureRecords.push({
					tile: tileToCapture,
					position: capturePosition,
					moveStartPosition: moveStartPosition
				});

				var capturedTile = self.abilityObject.board.captureTileOnPoint(targetTilePoint);
				capturedTile.beingCapturedByAbility = true;
				self.capturedTiles.push(capturedTile);
				lastCapturedPoint = targetTilePoint;
			}
		});
	}

	// If moveSourceToTargetPosition is set, move the source tile to the last captured tile's position
	if (this.abilityObject.abilityInfo.moveSourceToTargetPosition && lastCapturedPoint && this.capturedTiles.length > 0) {
		var sourceTile = this.abilityObject.sourceTile;
		var sourcePoint = sourceTile.seatedPoint;

		// Remove tile from current position
		if (sourcePoint) {
			sourcePoint.removeTile();
		}

		// Place tile at captured position
		lastCapturedPoint.putTile(sourceTile);
		sourceTile.seatedPoint = lastCapturedPoint;
	}

	if (this.capturedTiles.length > 0) {
		this.abilityObject.boardChanged = true;

		// === Build animation sequence ===
		var sourceTile = this.abilityObject.sourceTile;
		var sourceTilePoint = sourceTile.seatedPoint;

		// Get the source tile's end position for slide animations
		var sourceTileEndPoint = { row: sourceTilePoint.row, col: sourceTilePoint.col };

		// Check if any captured tile just moved - affects animation order
		// If a tile moved into the zone and triggered the capture, show: move -> pulse -> fade
		// Otherwise show: pulse -> slide toward source -> fade
		var hasMovingCapture = captureRecords.some(function(r) { return r.moveStartPosition; });

		// Pulse on source tile to indicate ability activation
		// Priority 1 if there's a moving capture (after the move), otherwise priority 0
		if (sourceTilePoint) {
			animations.add(new TrifleAnimationInstruction(TrifleAnimationType.PULSE, {
				tile: sourceTile,
				tileId: sourceTile.id,
				startPoint: { row: sourceTilePoint.row, col: sourceTilePoint.col },
				duration: 400,
				priority: hasMovingCapture ? 1 : 0,
				color: '#ff4444',  // Red glow for capture ability
				abilitySource: 'captureTargetTiles:pulse'
			}));
		}

		// Animation 2+: Animate each captured tile and fade out
		captureRecords.forEach(function(record, index) {
			if (record.moveStartPosition) {
				// Captured tile just moved - show its movement FIRST (priority 0), then pulse, then fade
				// Use startsAtMoveTime to begin at time 0 like a normal move animation
				animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
					tile: record.tile,
					tileId: record.tile.id,
					startPoint: record.moveStartPosition,
					endPoint: record.position,
					duration: 1000,  // Match normal move animation duration
					delay: 0,
					priority: 0,  // Before pulse
					parallel: index > 0,
					startsAtMoveTime: true,  // Start at time 0, not after primary move delay
					abilitySource: 'captureTargetTiles:moveSlide'
				}));

				// Fade out at capture position (after pulse)
				animations.add(new TrifleAnimationInstruction(TrifleAnimationType.FADE_OUT, {
					tile: record.tile,
					tileId: record.tile.id,
					startPoint: record.position,
					duration: 400,
					delay: 0,
					priority: 2,  // After pulse
					parallel: index > 0,
					abilitySource: 'captureTargetTiles:fadeOut'
				}));
			} else {
				// Tile was already on board - slide toward source tile, then fade out
				animations.add(new TrifleAnimationInstruction(TrifleAnimationType.SLIDE, {
					tile: record.tile,
					tileId: record.tile.id,
					startPoint: record.position,
					endPoint: sourceTileEndPoint,
					duration: 600,
					delay: 100,
					priority: 1,
					parallel: index > 0,
					abilitySource: 'captureTargetTiles:captureSlide'
				}));

				// Fade out at source tile position
				animations.add(new TrifleAnimationInstruction(TrifleAnimationType.FADE_OUT, {
					tile: record.tile,
					tileId: record.tile.id,
					startPoint: sourceTileEndPoint,
					duration: 400,
					delay: 0,
					priority: 2,
					parallel: index > 0,
					abilitySource: 'captureTargetTiles:fadeOut'
				}));
			}
		});
	}

	return {
		capturedTiles: this.capturedTiles,
		animations: animations
	};
};
