// Vababond Board Point

import {
  ACCENT_TILE,
  BASIC_FLOWER,
  SPECIAL_FLOWER,
  arrayIncludesOneOf,
  debug,
} from '../GameData';
import {
  GATE,
  NEUTRAL,
  NON_PLAYABLE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { GUEST, HOST, RowAndColumn } from '../CommonNotationObjects';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import { BeyondTheMapsTileType } from '../beyond-the-maps/BeyondTheMapsTile';

export const TEMPLE = GATE;

export class TrifleBoardPoint {
	constructor() {
		this.types = [];
		this.row = -1;
		this.col = -1;
		this.possibleMoveTypes = [];
		this.moveDistanceRemaining = {};
		this.possibleMovementPaths = [];
		this.previousMovePointsForMovement = {};
		this.previousMovePoint = null;
	}

	setRowAndCol(row, col) {
		this.row = row;
		this.col = col;
		this.rowAndCol = new RowAndColumn(this.row, this.col);
		this.rowAndColumn = this.rowAndCol;
	}

	addType(type) {
		if (!this.types.includes(type)) {
			this.types.push(type);
		}
	}

	removeType(type) {
		for (let i = 0; i < this.types.length; i++) {
			if (this.types[i] === type) {
				this.types.splice(i, 1);
			}
		}
	}

	putTile(tile) {
		this.tile = tile;
	}

	hasTile() {
		if (this.tile) {
			return true;
		}
		return false;
	}

	isType(type) {
		return this.types.includes(type);
	}

	isOneOrMoreOfTheseTypes(types) {
		return arrayIncludesOneOf(this.types, types);
	}

	setPossibleForMovementType(movementInfo) {
		const movementTypeToAdd = TrifleBoardPoint.getMovementType(movementInfo);
		if (!this.possibleMoveTypes.includes(movementTypeToAdd)) {
			this.possibleMoveTypes.push(movementTypeToAdd);
		}
	}

	isPossibleForMovementType(movementInfo) {
		const movementTypeToCheck = TrifleBoardPoint.getMovementType(movementInfo);
		return this.possibleMoveTypes.includes(movementTypeToCheck);
	}

	clearPossibleMovementTypes() {
		this.possibleMoveTypes = [];
		this.moveDistanceRemaining = {};
		this.previousMovePointsForMovement = {};
		this.previousMovePoint = null;
	}

	clearPossibleMovementPaths() {
		this.possibleMovementPaths = [];
		this.previousMovePointsForMovement = {};
		this.previousMovePoint = null;
	}

	addPossibleMovementPath(movementPath) {
		this.possibleMovementPaths.push(movementPath);
	}

	getOnlyPossibleMovementPath() {
		if (this.possibleMovementPaths && this.possibleMovementPaths.length === 1) {
			return this.possibleMovementPaths[0];
		}
	}

	setMoveDistanceRemaining(movementInfo, distanceRemaining) {
		const movementType = TrifleBoardPoint.getMovementType(movementInfo);
		this.moveDistanceRemaining[movementType] = distanceRemaining;
	}

	getMoveDistanceRemaining(movementInfo) {
		const movementType = TrifleBoardPoint.getMovementType(movementInfo);
		return this.moveDistanceRemaining[movementType];
	}

	static getMovementType(movementInfo) {
		return movementInfo.title ? movementInfo.title : movementInfo.type;
	}

	setPreviousPointForMovement(movementInfo, previousPoint) {
		const movementType = TrifleBoardPoint.getMovementType(movementInfo);
		if (previousPoint !== this && previousPoint.previousMovePointsForMovement[movementType] !== this) {
			this.previousMovePointsForMovement[movementType] = previousPoint;
		}
	}

	setPreviousPoint(previousPoint) {
		if (previousPoint !== this && previousPoint.previousMovePoint !== this) {
			this.previousMovePoint = previousPoint;
		}
	}

	buildMovementPath(visited) {
		this.movementPath = [];

		if (!visited) {
			visited = new Set();
		}

		if (visited.has(this)) {
			return [this];
		}
		visited.add(this);

		if (this.previousMovePoint) {
			this.movementPath = this.previousMovePoint.buildMovementPath(visited).concat(this);
		} else {
			this.movementPath = [this];
		}

		return this.movementPath;
	}

	buildMovementPathsInfo() {
		this.movementPathForMoveTypes = {};

		Object.keys(this.previousMovePointsForMovement).forEach((key) => {
			const prevPoint = this.previousMovePointsForMovement[key];
			if (prevPoint) {
				const prevPointMovePathInfo = prevPoint.buildMovementPathsInfo();
				const prevPointMovePath = prevPointMovePathInfo[key];
				if (prevPointMovePath) {
					this.movementPathForMoveTypes[key] = prevPointMovePath.concat(this);
				}
			} else {
				debug("bad?");
			}
		});

		return this.movementPathForMoveTypes;
	}

	isOpenGate() {
		return !this.hasTile() && this.types.includes(GATE);
	}

	removeTile() {
		const theTile = this.tile;

		this.tile = null;

		return theTile;
	}

	drainTile() {
		if (this.tile) {
			this.tile.drain();
		}
	}

	restoreTile() {
		if (this.tile) {
			this.tile.restore();
		}
	}

	canHoldTile(tile, ignoreTileCheck) {
		// Validate this point's ability to hold given tile

		if (this.isType(NON_PLAYABLE)) {
			return false;
		}

		if (!ignoreTileCheck && this.hasTile()) {
			// This function does not take into account capturing abilities
			return false;
		}

		if (tile.type === BASIC_FLOWER) {
			if (!(this.isType(NEUTRAL) || this.isType(tile.basicColorName))) {
				// Opposing colored point
				return false;
			}

			if (this.isType(GATE)) {
				return false;
			}

			return true;
		} else if (tile.type === SPECIAL_FLOWER) {
			return true;
		} else if (tile.type === ACCENT_TILE) {
			return true;
		}

		return false;
	}

	betweenPlayerHarmony(player) {
		if (player === GUEST) {
			return this.betweenHarmonyGuest;
		} else if (player === HOST) {
			return this.betweenHarmonyHost;
		}
		return false;
	}

	getNotationPointString() {
		return this.rowAndCol.notationPointString;
	}

	getCopy() {
		const copy = new TrifleBoardPoint();

		// this.types
		for (let i = 0; i < this.types.length; i++) {
			copy.types.push(this.types[i]);
		}

		copy.setRowAndCol(this.row, this.col);

		// tile
		if (this.hasTile()) {
			copy.tile = this.tile.getCopy();
		}

		return copy;
	}

	getDebugPrintStr() {
		if (this.hasTile()) {
			if (this.tile.ownerName === GUEST) {
				if (this.tile.tileType === BeyondTheMapsTileType.LAND) {
					return "●";
				} else if (this.tile.tileType === BeyondTheMapsTileType.SHIP) {
					return '♞'; // 's'
				}
			} else if (this.tile.ownerName === HOST) {
				if (this.tile.tileType === BeyondTheMapsTileType.LAND) {
					return "◯";
				} else if (this.tile.tileType === BeyondTheMapsTileType.SHIP) {
					return '♘';	// 'S'
				}
			}
			return "X";
		} else {
			return "·";
		}
	}

	// Point makers (static factory methods)

	static neutral() {
		const point = new TrifleBoardPoint();
		point.addType(NEUTRAL);

		return point;
	}

	static gate() {
		const point = new TrifleBoardPoint();
		point.addType(GATE);

		return point;
	}

	static red() {
		const point = new TrifleBoardPoint();
		point.addType(RED);

		return point;
	}

	static white() {
		const point = new TrifleBoardPoint();
		point.addType(WHITE);

		return point;
	}

	static redWhite() {
		const point = new TrifleBoardPoint();
		point.addType(RED);
		point.addType(WHITE);

		return point;
	}

	static redWhiteNeutral() {
		const point = new TrifleBoardPoint();
		point.addType(RED);
		point.addType(WHITE);
		point.addType(NEUTRAL);

		return point;
	}

	static redNeutral() {
		const point = new TrifleBoardPoint();
		point.addType(RED);
		point.addType(NEUTRAL);

		return point;
	}

	static whiteNeutral() {
		const point = new TrifleBoardPoint();
		point.addType(WHITE);
		point.addType(NEUTRAL);

		return point;
	}
}

export default TrifleBoardPoint;
