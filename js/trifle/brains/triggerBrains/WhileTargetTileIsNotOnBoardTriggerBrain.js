import { TrifleTriggerHelper } from '../TriggerHelper';

/**
 * WhileTargetTileIsNotOnBoardTriggerBrain
 *
 * Inverse of WhileTargetTileIsOnBoardTriggerBrain.
 * Trigger is met when the specified target tile is NOT on the board.
 *
 * For each team in targetTeams, independently checks if at least one
 * matching tile exists on the board. Trigger fires when ANY team is
 * missing its required tile.
 *
 * Examples:
 * - targetTeams: [friendly], targetTileTypes: [banner]
 *   -> fires when no friendly banner is on the board
 * - targetTeams: [friendly, enemy], targetTileTypes: [banner]
 *   -> fires when either friendly OR enemy banner is missing
 */
export function TrifleWhileTargetTileIsNotOnBoardTriggerBrain(triggerContext) {
	this.board = triggerContext.board;
	this.triggerContext = triggerContext;
	this.targetTiles = [];
	this.targetTilePoints = [];
}

TrifleWhileTargetTileIsNotOnBoardTriggerBrain.prototype.isTriggerMet = function() {
	var self = this;
	var triggerInfo = this.triggerContext.currentTrigger;
	var targetTeams = triggerInfo.targetTeams || [];

	// For each team, independently check if at least one matching tile is on the board
	var allTeamsHaveMatchingTile = true;

	targetTeams.forEach(function(team) {
		var teamHasMatch = false;

		// Create a temporary context with just this one team for checking
		var singleTeamTriggerInfo = Object.assign({}, triggerInfo, { targetTeams: [team] });
		var singleTeamContext = Object.assign({}, self.triggerContext, { currentTrigger: singleTeamTriggerInfo });

		self.board.forEachBoardPointWithTile(function(boardPointWithTile) {
			var triggerHelper = new TrifleTriggerHelper(singleTeamContext, boardPointWithTile);
			if (triggerHelper.tileIsTargeted()) {
				teamHasMatch = true;
			}
		});

		if (!teamHasMatch) {
			allTeamsHaveMatchingTile = false;
		}
	});

	// Trigger is met when at least one required team doesn't have its tile on the board
	return !allTeamsHaveMatchingTile;
};
