// Paiko Tile

import { GUEST, HOST } from '../CommonNotationObjects';

let tileId = 0;
function paikoTileIdIncrement() {
	return tileId++;
}

// Tile facing directions (used for rotation)
export const PaikoTileFacing = {
	UP: 0,
	RIGHT: 1,
	DOWN: 2,
	LEFT: 3
};

// Tile type codes - short abbreviations for notation
export const PaikoTileCode = {
	SWORD: 'Sw',
	BOW: 'Bw',
	EARTH: 'Er',
	FIRE: 'Fi',
	WATER: 'Wa',
	SAI: 'Sa',
	LOTUS: 'Lo',
	AIR: 'Ai'
};

// Tile names - used for images and display (maps code to name)
export const PaikoTileName = {
	[PaikoTileCode.SWORD]: 'Sword',
	[PaikoTileCode.BOW]: 'Bow',
	[PaikoTileCode.EARTH]: 'Earth',
	[PaikoTileCode.FIRE]: 'Fire',
	[PaikoTileCode.WATER]: 'Water',
	[PaikoTileCode.SAI]: 'Sai',
	[PaikoTileCode.LOTUS]: 'Lotus',
	[PaikoTileCode.AIR]: 'Air'
};

// Reverse lookup - name to code (for parsing notation that uses names)
export const PaikoNameToCode = {
	'Sword': PaikoTileCode.SWORD,
	'Bow': PaikoTileCode.BOW,
	'Earth': PaikoTileCode.EARTH,
	'Fire': PaikoTileCode.FIRE,
	'Water': PaikoTileCode.WATER,
	'Sai': PaikoTileCode.SAI,
	'Lotus': PaikoTileCode.LOTUS,
	'Air': PaikoTileCode.AIR
};

// Helper to get code from either code or name
export function getTileCode(codeOrName) {
	// If it's already a valid code, return it
	if (Object.values(PaikoTileCode).includes(codeOrName)) {
		return codeOrName;
	}
	// Try to look up as a name
	return PaikoNameToCode[codeOrName] || codeOrName;
}

// Helper to get name from code
export function getTileName(code) {
	return PaikoTileName[code] || code;
}

// Tile metadata definitions
// Threat patterns are defined as offsets from tile position [row, col]
// Positive row = down, Negative row = up
// Positive col = right, Negative col = left
// For tiles with facing, patterns are defined facing UP and rotated based on facing
export const PaikoTileDefinitions = {
	[PaikoTileCode.SWORD]: {
		name: 'Sword',
		moveDistance: 2,
		canShift: true,
		threatPattern: [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1],           [0, 1],
			[1, -1],  [1, 0],  [1, 1]
		],
		coverPattern: [],
		hasFacing: false,
		specialRules: {}
	},
	[PaikoTileCode.BOW]: {
		name: 'Bow',
		moveDistance: 2,
		canShift: true,
		// Facing UP: threatens 3 spaces past the space it's facing (not adjacent)
		threatPattern: [
			[-2, 0], [-3, 0], [-4, 0]
		],
		coverPattern: [],
		hasFacing: true,
		specialRules: {}
	},
	[PaikoTileCode.EARTH]: {
		name: 'Earth',
		moveDistance: 1, // Earth only shifts 1 square
		canShift: true,
		threatPattern: [
			[-2, 0], [-1, 0],
			[0, -2], [0, -1], [0, 1], [0, 2],
			[1, 0], [2, 0]
		],
		coverPattern: [],
		hasFacing: false,
		specialRules: {
			reducedMovement: true
		}
	},
	[PaikoTileCode.FIRE]: {
		name: 'Fire',
		moveDistance: 2,
		canShift: true,
		// Facing UP: threatens itself and the three spaces in front + 5 in next row
		threatPattern: [
			[-2, -2], [-2, -1], [-2, 0], [-2, 1], [-2, 2],
			[-1, -1], [-1, 0], [-1, 1],
			[0, 0] // Threatens itself
		],
		coverPattern: [],
		hasFacing: true,
		specialRules: {
			threatensAll: true, // Threatens all tiles including own
			selfThreatened: true, // Is threatened by itself (captured by 1 threat, 2 if covered)
			noDeployInThreat: true // Cannot deploy in Fire's threat
		}
	},
	[PaikoTileCode.WATER]: {
		name: 'Water',
		moveDistance: 2,
		canShift: true,
		// Threatens diagonally, covers orthogonally
		threatPattern: [
			[-1, -1], [-1, 1],
			[1, -1], [1, 1]
		],
		coverPattern: [
			[-1, 0], [0, -1], [0, 1], [1, 0]
		],
		hasFacing: false,
		specialRules: {
			canRedeploy: true // Can be redeployed instead of shifted
		}
	},
	[PaikoTileCode.SAI]: {
		name: 'Sai',
		moveDistance: 2,
		canShift: true,
		// Facing UP: threatens space directly in front, covers left and right
		threatPattern: [
			[-1, 0]
		],
		coverPattern: [
			[0, -1], [0, 1]
		],
		hasFacing: true,
		specialRules: {
			shiftAfterDeploy: true // Can shift 2 spaces immediately after deploy
		}
	},
	[PaikoTileCode.LOTUS]: {
		name: 'Lotus',
		moveDistance: 0, // Cannot shift
		canShift: false,
		threatPattern: [],
		coverPattern: [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1], [0, 0], [0, 1], // Covers itself
			[1, -1], [1, 0], [1, 1]
		],
		hasFacing: false,
		specialRules: {
			cannotShift: true,
			deployAnywhere: true, // Can be deployed in any unoccupied square
			noPoints: true, // Gives no points towards victory
			coversSelf: true
		}
	},
	[PaikoTileCode.AIR]: {
		name: 'Air',
		moveDistance: 0, // Cannot shift
		canShift: false,
		// Threatens like a knight's movement in chess
		threatPattern: [
			[-2, -1], [-2, 1],
			[-1, -2], [-1, 2],
			[1, -2], [1, 2],
			[2, -1], [2, 1]
		],
		coverPattern: [],
		hasFacing: false,
		specialRules: {
			cannotShift: true
		}
	}
};

// Helper function to rotate a pattern based on facing direction
export function rotatePattern(pattern, facing) {
	if (facing === PaikoTileFacing.UP) {
		return pattern;
	}

	return pattern.map(([row, col]) => {
		switch (facing) {
			case PaikoTileFacing.RIGHT:
				return [col, -row];
			case PaikoTileFacing.DOWN:
				return [-row, -col];
			case PaikoTileFacing.LEFT:
				return [-col, row];
			default:
				return [row, col];
		}
	});
}

export class PaikoTile {
	constructor(code, ownerCode) {
		this.code = getTileCode(code); // Normalize code (handles both names and short codes)
		this.ownerCode = ownerCode;
		if (this.ownerCode === 'G') {
			this.ownerName = GUEST;
		} else if (this.ownerCode === 'H') {
			this.ownerName = HOST;
		}
		this.id = paikoTileIdIncrement();
		this.facing = PaikoTileFacing.UP;
		this.selectedFromPile = false;
		this.justDeployed = false; // For Sai's shift-after-deploy ability
	}

	getDefinition() {
		return PaikoTileDefinitions[this.code];
	}

	getName() {
		return this.getDefinition().name;
	}

	getMoveDistance() {
		return this.getDefinition().moveDistance;
	}

	canShift() {
		return this.getDefinition().canShift;
	}

	hasFacing() {
		return this.getDefinition().hasFacing;
	}

	setFacing(facing) {
		this.facing = facing;
	}

	getFacing() {
		return this.facing;
	}

	// Get threat pattern adjusted for current facing
	getThreatPattern() {
		const def = this.getDefinition();
		if (def.hasFacing) {
			return rotatePattern(def.threatPattern, this.facing);
		}
		return def.threatPattern;
	}

	// Get cover pattern adjusted for current facing
	getCoverPattern() {
		const def = this.getDefinition();
		if (def.hasFacing) {
			return rotatePattern(def.coverPattern, this.facing);
		}
		return def.coverPattern;
	}

	getSpecialRules() {
		return this.getDefinition().specialRules || {};
	}

	// Check if tile has a specific special rule
	hasSpecialRule(rule) {
		const rules = this.getSpecialRules();
		return rules[rule] === true;
	}

	// Get threat required to capture this tile
	getThreatToCapture(isCovered) {
		/* Keep commented out - Fire actively threatens itself, it still needs normal amount of threat to be captured. */
		// if (this.hasSpecialRule('selfThreatened')) {
		// 	// Fire is captured by 1 threat, or 2 if covered
		// 	return isCovered ? 2 : 1;
		// }
		// Normal tiles: 2 threat, or 3 if covered
		return isCovered ? 3 : 2;
	}

	getImageName() {
		// Use full name for image files (e.g., HSword.png)
		return this.ownerCode + PaikoTileName[this.code];
	}

	getConsoleDisplay() {
		return this.ownerCode + this.code;
	}

	getCopy() {
		const copy = new PaikoTile(this.code, this.ownerCode);
		copy.facing = this.facing;
		copy.justDeployed = this.justDeployed;
		return copy;
	}
}

// Get all tile codes
export function getAllTileCodes() {
	return Object.values(PaikoTileCode);
}
