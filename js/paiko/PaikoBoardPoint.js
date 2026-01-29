// Paiko Board Point
// Represents a single cell/space on the board

import { GUEST, HOST } from '../CommonNotationObjects';

// Zone types
export const PaikoZone = {
	NON_PLAYABLE: 'non_playable',
	HOST_HOMEGROUND: 'host_homeground', // Host's Red Garden - provides cover, worth 2 points for Guest
	GUEST_HOMEGROUND: 'guest_homeground', // Guest's Red Garden - provides cover, worth 2 points for Host
	MIDDLEGROUND: 'middleground', // White Garden areas - worth 1 point
	NEUTRAL: 'neutral', // Other playable areas - worth 0 points
	BLACKED_OUT: 'blacked_out' // Special non-playable areas (only Lotus can deploy here)
};

// Point state types (for visual marking)
export const PaikoPointState = {
	POSSIBLE_MOVE: 'possible_move',
	POSSIBLE_DEPLOY: 'possible_deploy',
	THREATENED: 'threatened',
	COVERED: 'covered',
	SELECTED: 'selected'
};

export class PaikoBoardPoint {
	constructor() {
		this.row = -1;
		this.col = -1;
		this.zone = PaikoZone.NON_PLAYABLE;
		this.tile = null;
		this.states = [];

		// Cached threat/cover info (recalculated when board changes)
		this.hostThreat = 0;
		this.guestThreat = 0;
		this.hostCover = false;
		this.guestCover = false;
	}

	// Static factory methods for different zone types
	static nonPlayable() {
		const point = new PaikoBoardPoint();
		point.zone = PaikoZone.NON_PLAYABLE;
		return point;
	}

	static blackedOut() {
		const point = new PaikoBoardPoint();
		point.zone = PaikoZone.BLACKED_OUT;
		return point;
	}

	static hostHomeground() {
		const point = new PaikoBoardPoint();
		point.zone = PaikoZone.HOST_HOMEGROUND;
		return point;
	}

	static guestHomeground() {
		const point = new PaikoBoardPoint();
		point.zone = PaikoZone.GUEST_HOMEGROUND;
		return point;
	}

	static middleground() {
		const point = new PaikoBoardPoint();
		point.zone = PaikoZone.MIDDLEGROUND;
		return point;
	}

	static neutral() {
		const point = new PaikoBoardPoint();
		point.zone = PaikoZone.NEUTRAL;
		return point;
	}

	// Zone checks
	isPlayable() {
		return this.zone !== PaikoZone.NON_PLAYABLE && this.zone !== PaikoZone.BLACKED_OUT;
	}

	isPlayableOrBlack() {
		return this.zone !== PaikoZone.NON_PLAYABLE;
	}

	isBlackedOut() {
		return this.zone === PaikoZone.BLACKED_OUT;
	}

	isHomeground(player) {
		if (player === HOST) {
			return this.zone === PaikoZone.HOST_HOMEGROUND;
		}
		return this.zone === PaikoZone.GUEST_HOMEGROUND;
	}

	isOpponentHomeground(player) {
		if (player === HOST) {
			return this.zone === PaikoZone.GUEST_HOMEGROUND;
		}
		return this.zone === PaikoZone.HOST_HOMEGROUND;
	}

	isMiddleground() {
		return this.zone === PaikoZone.MIDDLEGROUND;
	}

	// Get points value if a tile of player is on this space
	getPointsValue(player) {
		if (this.isOpponentHomeground(player)) {
			return 2;
		}
		if (this.isMiddleground()) {
			return 1;
		}
		return 0;
	}

	// Tile management
	putTile(tile) {
		this.tile = tile;
	}

	hasTile() {
		return this.tile !== null;
	}

	removeTile() {
		const tile = this.tile;
		this.tile = null;
		return tile;
	}

	// State management for visual marking
	addState(state) {
		if (!this.states.includes(state)) {
			this.states.push(state);
		}
	}

	removeState(state) {
		const index = this.states.indexOf(state);
		if (index !== -1) {
			this.states.splice(index, 1);
		}
	}

	hasState(state) {
		return this.states.includes(state);
	}

	clearStates() {
		this.states = [];
	}

	// Threat/cover management
	setThreat(player, amount) {
		if (player === HOST) {
			this.hostThreat = amount;
		} else {
			this.guestThreat = amount;
		}
	}

	addThreat(player, amount) {
		if (player === HOST) {
			this.hostThreat += amount;
		} else {
			this.guestThreat += amount;
		}
	}

	getThreat(player) {
		return player === HOST ? this.hostThreat : this.guestThreat;
	}

	getOpponentThreat(player) {
		return player === HOST ? this.guestThreat : this.hostThreat;
	}

	setCover(player, hasCover) {
		if (player === HOST) {
			this.hostCover = hasCover;
		} else {
			this.guestCover = hasCover;
		}
	}

	hasCover(player) {
		return player === HOST ? this.hostCover : this.guestCover;
	}

	clearThreatAndCover() {
		this.hostThreat = 0;
		this.guestThreat = 0;
		this.hostCover = false;
		this.guestCover = false;
	}

	// Check if a tile here would be covered
	// Cover comes from: own homeground, or Lotus/Water/Sai tiles
	isTileCovered(player) {
		// Cover from homeground
		if (this.isHomeground(player)) {
			return true;
		}
		// Cover from friendly tiles
		return this.hasCover(player);
	}

	// Check if this point is threatened by opponent (for deploy restrictions)
	isThreatenedBy(player) {
		return this.getThreat(player) > 0;
	}

	// Check if this point can hold a deployed tile (basic check)
	canDeployTile(tile, player) {
		// Can't deploy on non-playable spaces
		if (!this.isPlayable()) {
			// Exception: Lotus can deploy on blacked out squares
			if (tile.hasSpecialRule('deployAnywhere') && this.zone === PaikoZone.BLACKED_OUT) {
				return true;
			}
			return false;
		}

		// Can't deploy where there's already a tile
		if (this.hasTile()) {
			return false;
		}

		return true;
	}

	// Get console display for debugging
	getConsoleDisplay() {
		if (this.tile) {
			return this.tile.getConsoleDisplay();
		}

		switch (this.zone) {
			case PaikoZone.NON_PLAYABLE:
				return ' ';
			case PaikoZone.BLACKED_OUT:
				return '#';
			case PaikoZone.HOST_HOMEGROUND:
				return 'H';
			case PaikoZone.GUEST_HOMEGROUND:
				return 'G';
			case PaikoZone.MIDDLEGROUND:
				return 'M';
			case PaikoZone.NEUTRAL:
				return '.';
			default:
				return '?';
		}
	}

	getCopy() {
		const copy = new PaikoBoardPoint();
		copy.row = this.row;
		copy.col = this.col;
		copy.zone = this.zone;
		copy.hostThreat = this.hostThreat;
		copy.guestThreat = this.guestThreat;
		copy.hostCover = this.hostCover;
		copy.guestCover = this.guestCover;

		if (this.tile) {
			copy.tile = this.tile.getCopy();
		}

		// Copy states
		this.states.forEach(state => copy.states.push(state));

		return copy;
	}
}
