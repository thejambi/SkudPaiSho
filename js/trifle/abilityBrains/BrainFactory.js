
Trifle.BrainFactory = function() {

}

Trifle.BrainFactory.prototype.createTriggerBrain = function(abilityTrigger, board) {
	switch(abilityTrigger) {
		case Trifle.AbilityTrigger.whileInsideTemple:
			return new Trifle.WhileInsideTempleTriggerBrain(board);
		case Trifle.AbilityTrigger.whileOutsideTemple:
			return new Trifle.WhileOutsideTempleTriggerBrain(board);
		case Trifle.AbilityTrigger.whenTileLandsInZone:
			return new Trifle.WhenTileLandsInZoneTriggerBrain(board);
		case Trifle.AbilityTrigger.whenCaptured:
			return new Trifle.WhenCapturedTriggerBrain(board);
		case Trifle.AbilityTrigger.whenCapturing:
			return new Trifle.WhenCapturingTriggerBrain(board);
	}
};

Trifle.BrainFactory.createAbilityBrain = function(abilityName, abilityObject) {
	switch(abilityName) {
		case Trifle.AbilityName.cancelZone:
			return new Trifle.CancelZoneAbilityBrain(abilityObject);
	}
};

