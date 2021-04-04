
Trifle.BrainFactory = function() {

}

Trifle.BrainFactory.prototype.createTriggerBrain = function(abilityTrigger, triggerContext) {
	switch(abilityTrigger) {
		case Trifle.AbilityTrigger.whileInsideTemple:
			return new Trifle.WhileInsideTempleTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whileOutsideTemple:
			return new Trifle.WhileOutsideTempleTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whileTargetTileIsAdjacent:
			return new Trifle.WhileTargetTileIsAdjacentTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whileTargetTileIsInZone:
			return new Trifle.WhileTargetTileIsInZoneTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whileTargetTileIsInLineOfSight:
			return new Trifle.WhileTargetTileIsInLineOfSightTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whenTargetTileLandsInZone:
			return new Trifle.WhenTargetTileLandsInZoneTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whenTargetTileMovesFromWithinZone:
			return new Trifle.WhenTargetTileMovesFromWithinZoneTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whenCapturedByTargetTile:
			return new Trifle.WhenCapturedByTargetTileTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whenCapturing:
			return new Trifle.WhenCapturingTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whenLandsAdjacentToTargetTile:
			return new Trifle.WhenLandsAdjacentToTargetTileTriggerBrain(triggerContext);
	}
};

Trifle.BrainFactory.createAbilityBrain = function(abilityName, abilityObject) {
	switch(abilityName) {
		case Trifle.AbilityName.cancelZone:
			return new Trifle.CancelZoneAbilityBrain(abilityObject);
		case Trifle.AbilityName.immobilizeTiles:
			return new Trifle.ImmobilizeTilesAbilityBrain(abilityObject);
		case Trifle.AbilityName.captureTargetTiles:
			return new Trifle.CaptureTargetTilesAbilityBrain(abilityObject);
	}
};

