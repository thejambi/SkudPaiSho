import { BRAND_NEW } from '../GameConstants';
import { BeyondTheMapsMoveType } from './BeyondTheMapsGameManager';
import { TrifleNotationBuilder } from '../trifle/TrifleGameNotation';
import { copyArray } from '../GameData';

export class BtmMoveBuilder {
	constructor() {
		this.notationBuilder = new TrifleNotationBuilder();
		this.notationBuilder.moveData = {};
		this.notationBuilder.moveData.phases = [];
		this.notationBuilder.phaseIndex = -1;
	}

	getCopy() {
		var copy = new BtmMoveBuilder();
		copy.notationBuilder = new TrifleNotationBuilder();
		copy.notationBuilder.player = this.notationBuilder.player;
		copy.notationBuilder.currentPlayer = this.notationBuilder.currentPlayer;
		copy.notationBuilder.phaseIndex = this.notationBuilder.phaseIndex;
		copy.notationBuilder.moveData = JSON.parse(JSON.stringify(this.notationBuilder.moveData));
		
		return copy;
	}

	getNotationMove(gameNotation) {
		return gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	}

	getStatus() {
		return this.notationBuilder.status;
	}
	setStatus(newStatus) {
		this.notationBuilder.status = newStatus;
	}

	setPlayer(newPlayer) {
		this.notationBuilder.player = newPlayer;
		this.notationBuilder.currentPlayer = newPlayer;
	}
	getPlayer() {
		return this.notationBuilder.player;
	}

	getPhaseIndex() {
		return this.notationBuilder.phaseIndex;
	}

	getNumPhases() {
		return this.notationBuilder.moveData.phases.length;
	}

	resetPhase() {
		this.notationBuilder.moveData.phases.pop();
		this.notationBuilder.phaseIndex--;
		this.notationBuilder.status = BRAND_NEW;
	}

	beginNewPhase() {
		this.notationBuilder.phaseIndex++;
		this.notationBuilder.moveData.phases[this.notationBuilder.phaseIndex] = {};
	}

	getCurrentPhase() {
		return this.notationBuilder.moveData.phases[this.notationBuilder.phaseIndex];
	}

	canExploreSea() {
		var canExploreSea = true;
		if (this.notationBuilder.moveData.phases.length > 0) {
			this.notationBuilder.moveData.phases.forEach(phaseData => {
				if (phaseData.moveType === BeyondTheMapsMoveType.EXPLORE_SEA) {
					canExploreSea = false;
				}
			});
		}
		return canExploreSea;
	}
	
	canExploreLand() {
		var canExploreLand = true;
		if (this.notationBuilder.moveData.phases.length > 0) {
			this.notationBuilder.moveData.phases.forEach(phaseData => {
				if (phaseData.moveType === BeyondTheMapsMoveType.EXPLORE_LAND) {
					canExploreLand = false;
				}
			});
		}
		return canExploreLand;
	}

}
