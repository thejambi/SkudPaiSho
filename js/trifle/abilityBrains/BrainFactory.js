
function BrainFactory() {

}

BrainFactory.prototype.createTriggerBrain = function(abilityTrigger, board) {
    switch(abilityTrigger) {
        case Trifle.AbilityTrigger.whileInsideTemple:
            return new WhileInsideTempleAbilityTriggerBrain(board);
        case Trifle.AbilityTrigger.whileOutsideTemple:
            return new WhileOutsideTempleAbilityTriggerBrain(board);
    }
};

BrainFactory.prototype.createAbilityBrain = function(abilityTrigger, board) {
    switch(abilityTrigger) {
        case Trifle.AbilityTrigger.whenCaptured:
            return new WhenCapturedAbilityTriggerBrain(board);
        case Trifle.AbilityTrigger.whenCapturing:
            return new WhenCapturingAbilityTriggerBrain(board);
    }
};
