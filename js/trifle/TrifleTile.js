// Tile

import { GUEST, HOST } from '../CommonNotationObjects';
import { debug } from '../GameData';
import { currentTileCodes, currentTileMetadata, currentTileNames } from './PaiShoGamesTileMetadata';

export let TrifleTileId = 1;

export class TrifleTile {
	constructor(code, ownerCode) {
		this.code = code;
		this.ownerCode = ownerCode;
		if (this.ownerCode === 'G') {
			this.ownerName = GUEST;
		} else if (this.ownerCode === 'H') {
			this.ownerName = HOST;
		} else {
			debug("INCORRECT OWNER CODE");
		}
		this.id = TrifleTileId++;
		this.selectedFromPile = false;
	}

	static resetTrifleTileId(value) {
		TrifleTileId = value || 1;
	}

	static getTrifleTileId() {
		return TrifleTileId;
	}

	getImageName() {
		return this.ownerCode + "" + this.code;
	}

	canMove(first_argument) {
		return !(this.code === 'C' || this.code === 'F');
	}

	getMoveDistance() {
		if (this.code === 'L' || this.code === 'B') {
			return 1;
		} else if (this.code === 'S') {
			return 6;
		}

		return 0;
	}

	isFlowerTile() {
		// Must be L, C, F
		return this.code === 'L' || this.code === 'C' || this.code === 'F';
	}

	hasCaptureAbility() {
		// Must be D, W, S
		return this.code === 'D' || this.code === 'W' || this.code === 'S';
	}

	getName() {
		return TrifleTile.getTileName(this.code);
	}

	getNotationName() {
		return this.ownerCode + "" + this.code;
	}

	getCopy() {
		const copy = new TrifleTile(this.code, this.ownerCode);
		/* Keep the same id: copies must stay addressable by keys built from the
		   original (ability records, recordedTilePoints, prompt target keys) */
		copy.id = this.id;
		copy.selectedFromPile = this.selectedFromPile;
		copy.beingCaptured = this.beingCaptured;
		copy.beingCapturedByAbility = this.beingCapturedByAbility;
		copy.moveToPile = this.moveToPile;
		copy.isGigantic = this.isGigantic;
		/* seatedPoint and deployPoint reference board points; they are relinked
		   by TrifleBoardPoint.getCopy / PaiShoGameBoard.getCopy */
		return copy;
	}

	static getTileName(tileCode) {
		let name = "";

		if (currentTileNames && currentTileNames[tileCode]) {
			name = currentTileNames[tileCode];
		} else {
			Object.keys(currentTileCodes).forEach((key) => {
				if (currentTileCodes[key] === tileCode) {
					name = key;
				}
			});
		}

		return name;
	}

	getOwnerCodeIdObject() {
		return {
			ownerName: this.ownerName,
			code: this.code,
			id: this.id
		};
	}

	getOwnerCodeIdObjectString() {
		return JSON.stringify(this.getOwnerCodeIdObject());
	}

	static getTeamLimitForTile(tileCode) {
		const tileData = currentTileMetadata[tileCode];
		if (tileData) {
			if (tileData.teamLimit) {
				return tileData.teamLimit;
			} else if (tileData.isBanner) {
				return 1;
			}
		}
		return 2;
	}
}

export default TrifleTile;
