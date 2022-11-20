/*
Should this ability target the tile on board in addition to the tile it's switching to?
*/

Trifle.ExchangeWithCapturedTileAbilityBrain = function(abilityObject) {
	this.abilityObject = abilityObject;
}

Trifle.ExchangeWithCapturedTileAbilityBrain.prototype.activateAbility = function() {
	var promptTargetInfo = this.abilityObject.promptTargetInfo;

	this.capturedTiles = [];

	var sourceTileKey = JSON.stringify(Trifle.AbilityManager.buildSourceTileKeyObject(this.abilityObject.sourceTile));

	if (promptTargetInfo
		&& promptTargetInfo[sourceTileKey]
		&& promptTargetInfo[sourceTileKey][Trifle.TargetPromptId.chosenCapturedTile]) {
		var chosenCapturedTileKeyObject = promptTargetInfo[sourceTileKey][Trifle.TargetPromptId.chosenCapturedTile];

		var chosenTile = this.abilityObject.board.tileManager.grabCapturedTile(chosenCapturedTileKeyObject.ownerName, chosenCapturedTileKeyObject.code);

		if (chosenTile) {
			// Exchange the tiles!
			var tileFromBoard = this.abilityObject.board.captureTileOnPoint(this.abilityObject.sourceTilePoint);
			this.capturedTiles.push(tileFromBoard);	// Does it count as being captured?
			tileFromBoard.beingCapturedByAbility = true;

			this.abilityObject.board.placeTile(chosenTile, this.abilityObject.sourceTilePoint);

			this.abilityObject.boardChanged = true;
		}
	}

	return {
		capturedTiles: this.capturedTiles
	};
};

Trifle.ExchangeWithCapturedTileAbilityBrain.prototype.promptForTarget = function(nextNeededPromptTargetInfo, sourceTileKeyStr) {
	var promptTargetsExist = false;

	debug("Need to prompt for target: " + nextNeededPromptTargetInfo.promptId);

	/*
	Exchange With Target Captured Tile requires these targets:
	- Trifle.TargetPromptId.chosenCapturedTile
	 */

	if (nextNeededPromptTargetInfo.promptId === Trifle.TargetPromptId.chosenCapturedTile
			&& this.abilityObject.abilityInfo.targetTypes && this.abilityObject.abilityInfo.targetTypes.length) {
		this.abilityObject.setAbilityTargetTiles();

		var abilityTargetTiles = this.abilityObject.abilityTargetTiles;

		abilityTargetTiles.forEach(targetTile => {
			promptTargetsExist = true;
			targetTile.tileIsSelectable = true;
		});
	} else {
		debug("Prompting not supported yet for this ability");
	}

	debug("promptTargetsExist for exchange with captured tile ability prompt? : " + promptTargetsExist);
	return promptTargetsExist;
};
