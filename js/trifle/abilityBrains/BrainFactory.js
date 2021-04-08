
Trifle.BrainFactory = function() {

}

Trifle.BrainFactory.prototype.createTriggerBrain = function(abilityTrigger, triggerContext) {
	switch(abilityTrigger) {
		case Trifle.AbilityTrigger.whileInsideTemple:
			return new Trifle.WhileInsideTempleTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whileOutsideTemple:
			return new Trifle.WhileOutsideTempleTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whenTileLandsInZone:
			return new Trifle.WhenTileLandsInZoneTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whenCaptured:
			return new Trifle.WhenCapturedTriggerBrain(triggerContext);
		case Trifle.AbilityTrigger.whenCapturing:
			return new Trifle.WhenCapturingTriggerBrain(triggerContext);
	}
};

Trifle.BrainFactory.createAbilityBrain = function(abilityName, abilityObject) {
	switch(abilityName) {
		case Trifle.AbilityName.cancelZone:
			return new Trifle.CancelZoneAbilityBrain(abilityObject);
	}
};

