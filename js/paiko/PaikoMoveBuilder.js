// Paiko Move Builder
// Wraps TrifleNotationBuilder for building Paiko moves as JSON

import { DEPLOY, MOVE } from '../CommonNotationObjects';
import { TrifleNotationBuilder } from '../trifle/TrifleGameNotation';
import { PaikoMoveType } from './PaikoGameNotation';

// Define locally to avoid circular dependency with PaiShoMain
const BRAND_NEW = 'brand_new';

// Builder status constants
export const PaikoBuilderStatus = {
	BRAND_NEW: BRAND_NEW,
	SELECTING_TILE: 'selecting_tile',
	SELECTING_DEPLOY_LOCATION: 'selecting_deploy_location',
	SELECTING_SHIFT_DESTINATION: 'selecting_shift_destination',
	SELECTING_ROTATION: 'selecting_rotation',
	SELECTING_DRAW_TILES: 'selecting_draw_tiles',
	SELECTING_CAPTURE_REWARD: 'selecting_capture_reward',
	WAITING_FOR_SAI_SHIFT: 'waiting_for_sai_shift'
};

export class PaikoMoveBuilder {
	constructor() {
		this.notationBuilder = new TrifleNotationBuilder();
		this.notationBuilder.moveData = {};
		this.reset();
	}

	reset() {
		this.notationBuilder.status = BRAND_NEW;
		this.notationBuilder.moveType = null;
		this.notationBuilder.moveData = {};
	}

	getCopy() {
		const copy = new PaikoMoveBuilder();
		copy.notationBuilder = new TrifleNotationBuilder();
		copy.notationBuilder.status = this.notationBuilder.status;
		copy.notationBuilder.moveType = this.notationBuilder.moveType;
		copy.notationBuilder.currentPlayer = this.notationBuilder.currentPlayer;
		copy.notationBuilder.moveData = JSON.parse(JSON.stringify(this.notationBuilder.moveData));
		return copy;
	}

	getNotationMove(gameNotation) {
		return gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	}

	// Status management
	getStatus() {
		return this.notationBuilder.status;
	}

	setStatus(newStatus) {
		this.notationBuilder.status = newStatus;
	}

	// Player management
	setPlayer(player) {
		this.notationBuilder.currentPlayer = player;
	}

	getPlayer() {
		return this.notationBuilder.currentPlayer;
	}

	// Move type
	setMoveType(moveType) {
		this.notationBuilder.moveType = moveType;
	}

	getMoveType() {
		return this.notationBuilder.moveType;
	}

	// Move data accessors
	setMoveData(key, value) {
		this.notationBuilder.moveData[key] = value;
	}

	getMoveData(key) {
		return this.notationBuilder.moveData[key];
	}

	// Convenience methods for common move data

	// For SELECT_TILE moves
	setSelectedTiles(tiles) {
		this.notationBuilder.moveData.selectedTiles = tiles;
	}

	// For DEPLOY moves
	setTileCode(tileCode) {
		this.notationBuilder.moveData.tileCode = tileCode;
	}

	setEndPoint(point) {
		this.notationBuilder.endPoint = point;
		this.notationBuilder.moveData.endPoint = point.pointText;
	}

	setFacing(facing) {
		this.notationBuilder.moveData.facing = facing;
	}

	// For MOVE/SHIFT moves
	setStartPoint(point) {
		this.notationBuilder.startPoint = point;
		this.notationBuilder.moveData.startPoint = point.pointText;
	}

	// For DRAW moves
	setDrawnTiles(tiles) {
		this.notationBuilder.moveData.drawnTiles = tiles;
	}

	// Build methods for specific move types
	buildSelectMove(player, selectedTiles) {
		this.reset();
		this.setPlayer(player);
		this.setMoveType(PaikoMoveType.SELECT_TILE);
		this.setSelectedTiles(selectedTiles);
	}

	buildDeployMove(player, tileCode, endPoint, facing) {
		this.reset();
		this.setPlayer(player);
		this.setMoveType(DEPLOY);
		this.setTileCode(tileCode);
		this.setEndPoint(endPoint);
		this.setFacing(facing);
	}

	buildShiftMove(player, startPoint, endPoint, facing) {
		this.reset();
		this.setPlayer(player);
		this.setMoveType(MOVE);
		this.setStartPoint(startPoint);
		this.setEndPoint(endPoint);
		if (facing !== undefined) {
			this.setFacing(facing);
		}
	}

	buildRotateMove(player, point, facing) {
		this.reset();
		this.setPlayer(player);
		this.setMoveType(PaikoMoveType.ROTATE);
		this.setStartPoint(point);
		this.setEndPoint(point);
		this.setFacing(facing);
	}

	buildDrawMove(player, drawnTiles) {
		this.reset();
		this.setPlayer(player);
		this.setMoveType(PaikoMoveType.DRAW);
		this.setDrawnTiles(drawnTiles);
	}

	buildCaptureRewardMove(player, tileCodes) {
		this.reset();
		this.setPlayer(player);
		this.setMoveType(PaikoMoveType.CAPTURE_REWARD);
		this.notationBuilder.moveData.tileCodes = tileCodes;
	}

	buildSaiShiftMove(player, startPoint, endPoint, facing) {
		this.reset();
		this.setPlayer(player);
		this.setMoveType(PaikoMoveType.SAI_SHIFT);
		this.setStartPoint(startPoint);
		this.setEndPoint(endPoint);
		if (facing !== undefined) {
			this.setFacing(facing);
		}
	}

	buildWaterRedeployMove(player, startPoint, endPoint) {
		this.reset();
		this.setPlayer(player);
		this.setMoveType(PaikoMoveType.WATER_REDEPLOY);
		this.setStartPoint(startPoint);
		this.setEndPoint(endPoint);
	}

	buildPassMove(player) {
		this.reset();
		this.setPlayer(player);
		this.setMoveType(PaikoMoveType.PASS);
	}
}
