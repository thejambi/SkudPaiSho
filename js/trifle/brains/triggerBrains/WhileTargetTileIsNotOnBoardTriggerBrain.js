import { TrifleTriggerHelper } from '../TriggerHelper';
import { debug } from '../../../GameData';

/**
 * WhileTargetTileIsNotOnBoardTriggerBrain
 *
 * Trigger is met when NO matching target tile is on the board.
 * Scans all board tiles and checks if any match the trigger criteria
 * (targetTileTypes, targetTeams, etc.). If none match, the trigger fires.
 *
 * Note: This brain only supports a single targetTeam. If multiple teams
 * are specified, a debug warning is logged and behavior may be unexpected.
 * For multi-team logic (e.g. "either friendly OR enemy banner is missing"),
 * use WhileTargetTilesAreNotOnBoardTriggerBrain instead.
 *
 * Example:
 * - targetTeams: [friendly], targetTileTypes: [banner]
 *   -> fires when no friendly banner is on the board
 */
export class TrifleWhileTargetTileIsNotOnBoardTriggerBrain {
	constructor(triggerContext) {
		this.board = triggerContext.board;
		this.triggerContext = triggerContext;
		this.targetTiles = [];
		this.targetTilePoints = [];
	}

	isTriggerMet() {
		const triggerInfo = this.triggerContext.currentTrigger;
		const targetTeams = triggerInfo.targetTeams || [];

		if (targetTeams.length > 1) {
			debug("TrifleWhileTargetTileIsNotOnBoardTriggerBrain: Multiple targetTeams specified, but this brain only supports a single targetTeam. May not work as expected.");
		}

		let tileOnBoard = false;
		let tileNotOnBoard = true; // Assume tile is not on board until found

		this.board.forEachBoardPointWithTile((boardPointWithTile) => {
			const triggerHelper = new TrifleTriggerHelper(this.triggerContext, boardPointWithTile);
			if (triggerHelper.tileIsTargeted()) {
				tileOnBoard = true;
			}
		});

		// Trigger is met when target tile is NOT found on the board
		if (tileOnBoard) {
			tileNotOnBoard = false;
		}
		return tileNotOnBoard;
	}
}
