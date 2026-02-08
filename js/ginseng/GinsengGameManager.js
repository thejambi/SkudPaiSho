// Ginseng Game Manager

import {
  DRAW_ACCEPT,
  GUEST,
  HOST,
  MOVE,
  NotationPoint,
  RowAndColumn,
  SETUP,
} from '../CommonNotationObjects';
import {
  GINSENG_1_POINT_0,
  GINSENG_2_POINT_0,
  SWAP_BISON_AND_DRAGON,
  gameOptionEnabled,
} from '../GameOptions';
import { GinsengTileCodes } from './GinsengTiles';
import { GinsengTileManager } from './GinsengTileManager';
import { PaiShoMarkingManager } from '../pai-sho-common/PaiShoMarkingManager';
import { TrifleAbilityName } from '../trifle/TrifleTileInfo';
import { TrifleTile } from '../trifle/TrifleTile';
import { debug } from '../GameData';
import {
  getOpponentName,
  getPlayerCodeFromName,
} from '../pai-sho-common/PaiShoPlayerHelp';
import { setGameLogText } from '../PaiShoMain';
import { PaiShoGameBoard } from '../trifle/PaiShoGameBoard';

export var GinsengGameManager = function(actuator, ignoreActuate, isCopy) {
	this.gameLogText = '';
	this.isCopy = isCopy;

	this.actuator = actuator;

	// TrifleTileId = 1;
	TrifleTile.resetTrifleTileId();
	this.tileManager = new GinsengTileManager();
	this.markingManager = new PaiShoMarkingManager();

	this.setup(ignoreActuate);
};

GinsengGameManager.prototype.updateActuator = function(newActuator) {
	this.actuator = newActuator;
};

// Set up the game
GinsengGameManager.prototype.setup = function (ignoreActuate) {
	this.board = new PaiShoGameBoard(this.tileManager, this.buildAbilityActivationOrder());
	this.board.useBannerCaptureSystem = false;
	this.winners = [];
	this.hostBannerPlayed = false;
	this.guestBannerPlayed = false;

	// Initial setup?
	this.gameHasSetupMove = false;
	this.doBoardSetup(0);

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
GinsengGameManager.prototype.actuate = function(moveToAnimate, moveDetails) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate, moveDetails);
	setGameLogText(this.gameLogText);
};

GinsengGameManager.prototype.runNotationMove = function(move, withActuate, moveAnimationBeginStep_unused, skipAnimation) {
	debug("Running Move:");
	debug(move);

	var neededPromptInfo;

	var moveDetails;

	var abilityActivationFlags = null;

	if (move.moveType === SETUP) {
		this.doBoardSetup(move.setupNum);
	} else if (move.moveType === MOVE) {
		moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint, move);
		this.tileManager.addToCapturedTiles(moveDetails.capturedTiles);

		abilityActivationFlags = moveDetails.abilityActivationFlags;
		debug(abilityActivationFlags);

		if (abilityActivationFlags.tileRecords) {
			if (abilityActivationFlags.tileRecords.capturedTiles && abilityActivationFlags.tileRecords.capturedTiles.length) {
				this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.capturedTiles);
			}
			if (abilityActivationFlags.tileRecords.tilesMovedToPiles && abilityActivationFlags.tileRecords.tilesMovedToPiles.length) {
				this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.tilesMovedToPiles);
			}
		}

		var needToPromptUser = abilityActivationFlags 
			&& abilityActivationFlags.neededPromptInfo 
			&& abilityActivationFlags.neededPromptInfo.currentPromptTargetId;
		if (needToPromptUser) {
			neededPromptInfo = abilityActivationFlags.neededPromptInfo;
		}

		/** 
		 * Tick duration abilities at end of turn. 
		 * This ensures that ability durations are the same during move planning, UI board interaction, and move execution.
		 */
		this.board.tickDurationAbilities();

		this.buildMoveGameLogText(move, moveDetails);

		this.checkForWin();
	} else if (move.moveType === DRAW_ACCEPT) {
		this.gameHasEndedInDraw = true;
	}

	/* if (withActuate && neededPromptInfo) {
		this.actuate();
	} else  */
	if (withActuate && !skipAnimation) {
		this.actuate(move, moveDetails);
	}

	return neededPromptInfo;
};

GinsengGameManager.prototype.buildMoveGameLogText = function(move, moveDetails) {
	var startPoint = new NotationPoint(move.startPoint);
	var endPoint = new NotationPoint(move.endPoint);
	var startPointDisplay = GinsengNotationAdjustmentFunction(startPoint.rowAndColumn.row, startPoint.rowAndColumn.col);
	var endPointDisplay = GinsengNotationAdjustmentFunction(endPoint.rowAndColumn.row, endPoint.rowAndColumn.col);

	var moveNumLabel = move.moveNum + "" + getPlayerCodeFromName(move.player);

	this.gameLogText = moveNumLabel + ". " + move.player + ' moved ' + TrifleTile.getTileName(moveDetails.movedTile.code) + ' from ' + startPointDisplay + ' to ' + endPointDisplay;
	if (moveDetails.capturedTiles && moveDetails.capturedTiles.length > 0) {
		this.gameLogText += ' and captured ' + getOpponentName(move.player) + '\'s ';// + TrifleTile.getTileName(moveDetails.capturedTile.code);
		var first = true;
		moveDetails.capturedTiles.forEach(capturedTile => {
			if (!first) {
				this.gameLogText += ', ';
			} else {
				first = false;
			}
			this.gameLogText += TrifleTile.getTileName(capturedTile.code);
		});
	}
	if (moveDetails.abilityActivationFlags && moveDetails.abilityActivationFlags.tileRecords
		&& moveDetails.abilityActivationFlags.tileRecords.capturedTiles
		&& moveDetails.abilityActivationFlags.tileRecords.capturedTiles.length > 0) {
		this.gameLogText += "; ";
		var first = true;
		moveDetails.abilityActivationFlags.tileRecords.capturedTiles.forEach(movedTile => {
			if (!first) {
				this.gameLogText += ", ";
			} else {
				first = false;
			}
			this.gameLogText += movedTile.ownerName + "'s " + TrifleTile.getTileName(movedTile.code);
		});
		this.gameLogText += " moved to captured pile";
	}
	if (moveDetails.abilityActivationFlags && moveDetails.abilityActivationFlags.tileRecords
		&& moveDetails.abilityActivationFlags.tileRecords.tilesMovedToPiles
		&& moveDetails.abilityActivationFlags.tileRecords.tilesMovedToPiles.length > 0) {
		this.gameLogText += "; ";
		var first = true;
		moveDetails.abilityActivationFlags.tileRecords.tilesMovedToPiles.forEach(movedTile => {
			if (!first) {
				this.gameLogText += ", ";
			} else {
				first = false;
			}
			this.gameLogText += movedTile.ownerName + "'s " + TrifleTile.getTileName(movedTile.code);
		});
		this.gameLogText += " banished";
	}

	if (move.promptTargetData) {
		Object.keys(move.promptTargetData).forEach((key, index) => {
			var promptDataEntry = move.promptTargetData[key];
			var keyObject = JSON.parse(key);
			if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
				var movedTilePointRowAndCol = promptDataEntry.movedTilePoint.rowAndColumn;
				// TODO promptDataEntry field work needed
				var movedTileDestinationRowAndCol = promptDataEntry.movedTileDestinationPoint.rowAndColumn;
				this.gameLogText += "; Push: ";
				this.gameLogText += "(" + GinsengNotationAdjustmentFunction(movedTilePointRowAndCol.row, movedTilePointRowAndCol.col) + ")-";
				this.gameLogText += "(" + GinsengNotationAdjustmentFunction(movedTileDestinationRowAndCol.row, movedTileDestinationRowAndCol.col) + ")";
			} else if (promptDataEntry.chosenCapturedTile) {
				this.gameLogText += "; Exchange with: " + TrifleTile.getTileName(promptDataEntry.chosenCapturedTile.code);
			} else {
				this.gameLogText += " Ability?";
			}
		});
	}
};

GinsengGameManager.prototype.checkForWin = function() {
	var hostLotusPoints = this.board.getTilePoints(GinsengTileCodes.WhiteLotus, HOST);
	var guestLotusPoints = this.board.getTilePoints(GinsengTileCodes.WhiteLotus, GUEST);
	if (hostLotusPoints.length === 1) {
		var hostLotusPoint = hostLotusPoints[0];
		var hostLotusRowAndCol = new RowAndColumn(hostLotusPoint.row, hostLotusPoint.col);
		if (hostLotusRowAndCol.x < 0) {
			this.winners.push(HOST);
		}
	}

	if (guestLotusPoints.length === 1) {
		var guestLotusPoint = guestLotusPoints[0];
		var guestLotusRowAndCol = new RowAndColumn(guestLotusPoint.row, guestLotusPoint.col);
		if (guestLotusRowAndCol.x > 0) {
			this.winners.push(GUEST);
		}
	}
};

GinsengGameManager.prototype.playersAreSelectingTeams = function() {
	return this.tileManager.playersAreSelectingTeams();
};

GinsengGameManager.prototype.getPlayerTeamSelectionTileCodeList = function(player) {
	var team = this.tileManager.getPlayerTeam(player);
	var codeList = [];
	team.forEach(function(tile){
		codeList.push(tile.code);
	});
	return codeList.toString();
};

GinsengGameManager.prototype.addTileToTeam = function(tile) {
	var addedOk = this.tileManager.addToTeamIfOk(tile);
	if (addedOk) {
		this.actuate();
	}
	return this.tileManager.playerTeamIsFull(tile.ownerName);
};

GinsengGameManager.prototype.removeTileFromTeam = function(tile) {
	this.tileManager.removeTileFromTeam(tile);
	this.actuate();
};

GinsengGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

GinsengGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

GinsengGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

GinsengGameManager.prototype.revealDeployPoints = function(tile, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(tile);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

GinsengGameManager.prototype.getWinner = function() {
	if (this.winners.length === 1) {
		return this.winners[0];
	}
};

GinsengGameManager.prototype.getWinReason = function() {
	return " won the game!";
};

GinsengGameManager.prototype.getWinResultTypeCode = function() {
	if (this.winners.length === 1) {
		return 1;	// Standard win is 1
	} else if (this.gameHasEndedInDraw) {
		return 4;	// Tie/Draw is 4
	}
};

GinsengGameManager.prototype.buildAbilityActivationOrder = function() {
	return [
		TrifleAbilityName.recordTilePoint,
		TrifleAbilityName.moveTileToRecordedPoint,
		TrifleAbilityName.cancelAbilities,
		TrifleAbilityName.cancelAbilitiesTargetingTiles,
		TrifleAbilityName.protectFromCapture,
		TrifleAbilityName.moveTargetTile
	];
};

GinsengGameManager.prototype.buildAbilitySummaryLines = function() {
	var abilitySummaryLines = [];
	this.board.abilityManager.abilities.forEach((abilityObject) => {
		if (abilityObject.activated) {
			abilitySummaryLines = abilitySummaryLines.concat(abilityObject.getSummaryLines());
		}
	});

	return abilitySummaryLines;
};

GinsengGameManager.prototype.doBoardSetup = function(setupNum) {
	/* Remove all tiles from board, then set up board. */
	this.board.forEachBoardPointWithTile(boardPoint => {
		this.tileManager.putTileBack(boardPoint.removeTile());
	});

	this.board.placeTile(this.tileManager.grabTile(HOST, GinsengTileCodes.WhiteLotus), new NotationPoint("8,0"));
	var nextTileCode = GinsengTileCodes.Koi;
	if (gameOptionEnabled(GINSENG_2_POINT_0) || !gameOptionEnabled(GINSENG_1_POINT_0)) {
		nextTileCode = GinsengTileCodes.Badgermole;
	}
	this.board.placeTile(this.tileManager.grabTile(HOST, nextTileCode), new NotationPoint("7,-1"));
	if (gameOptionEnabled(GINSENG_2_POINT_0) || !gameOptionEnabled(GINSENG_1_POINT_0)) {
		nextTileCode = GinsengTileCodes.Dragon;
	}
	if (setupNum === 1 || gameOptionEnabled(SWAP_BISON_AND_DRAGON)) {
		nextTileCode = GinsengTileCodes.Bison;
	} else {
		nextTileCode = GinsengTileCodes.Dragon;
	}
	this.board.placeTile(this.tileManager.grabTile(HOST, nextTileCode), new NotationPoint("7,1"));
	nextTileCode = GinsengTileCodes.Badgermole;
	if (gameOptionEnabled(GINSENG_2_POINT_0) || !gameOptionEnabled(GINSENG_1_POINT_0)) {
		nextTileCode = GinsengTileCodes.Koi;
	}
	this.board.placeTile(this.tileManager.grabTile(HOST, nextTileCode), new NotationPoint("6,-2"));
	if (gameOptionEnabled(GINSENG_2_POINT_0) || !gameOptionEnabled(GINSENG_1_POINT_0)) {
		nextTileCode = GinsengTileCodes.Bison;
	}
	if (setupNum === 1 || gameOptionEnabled(SWAP_BISON_AND_DRAGON)) {
		nextTileCode = GinsengTileCodes.Dragon;
	} else {
		nextTileCode = GinsengTileCodes.Bison;
	}
	this.board.placeTile(this.tileManager.grabTile(HOST, nextTileCode), new NotationPoint("6,2"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GinsengTileCodes.LionTurtle), new NotationPoint("4,0"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GinsengTileCodes.Wheel), new NotationPoint("5,-3"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GinsengTileCodes.Wheel), new NotationPoint("5,3"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GinsengTileCodes.Ginseng), new NotationPoint("4,-4"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GinsengTileCodes.Ginseng), new NotationPoint("4,4"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GinsengTileCodes.Orchid), new NotationPoint("4,-5"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GinsengTileCodes.Orchid), new NotationPoint("4,5"));

	this.board.placeTile(this.tileManager.grabTile(GUEST, GinsengTileCodes.WhiteLotus), new NotationPoint("-8,0"));
	nextTileCode = GinsengTileCodes.Koi;
	if (gameOptionEnabled(GINSENG_2_POINT_0) || !gameOptionEnabled(GINSENG_1_POINT_0)) {
		nextTileCode = GinsengTileCodes.Badgermole;
	}
	this.board.placeTile(this.tileManager.grabTile(GUEST, nextTileCode), new NotationPoint("-7,1"));
	if (setupNum === 1 || gameOptionEnabled(SWAP_BISON_AND_DRAGON)) {
		nextTileCode = GinsengTileCodes.Bison;
	} else {
		nextTileCode = GinsengTileCodes.Dragon;
	}
	if (gameOptionEnabled(GINSENG_2_POINT_0) || !gameOptionEnabled(GINSENG_1_POINT_0)) {
		nextTileCode = GinsengTileCodes.Dragon;
	}
	this.board.placeTile(this.tileManager.grabTile(GUEST, nextTileCode), new NotationPoint("-7,-1"));
	nextTileCode = GinsengTileCodes.Badgermole;
	if (gameOptionEnabled(GINSENG_2_POINT_0) || !gameOptionEnabled(GINSENG_1_POINT_0)) {
		nextTileCode = GinsengTileCodes.Koi;
	}
	this.board.placeTile(this.tileManager.grabTile(GUEST, nextTileCode), new NotationPoint("-6,2"));
	if (setupNum === 1 || gameOptionEnabled(SWAP_BISON_AND_DRAGON)) {
		nextTileCode = GinsengTileCodes.Dragon;
	} else {
		nextTileCode = GinsengTileCodes.Bison;
	}
	if (gameOptionEnabled(GINSENG_2_POINT_0) || !gameOptionEnabled(GINSENG_1_POINT_0)) {
		nextTileCode = GinsengTileCodes.Bison;
	}
	this.board.placeTile(this.tileManager.grabTile(GUEST, nextTileCode), new NotationPoint("-6,-2"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GinsengTileCodes.LionTurtle), new NotationPoint("-4,0"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GinsengTileCodes.Wheel), new NotationPoint("-5,-3"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GinsengTileCodes.Wheel), new NotationPoint("-5,3"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GinsengTileCodes.Ginseng), new NotationPoint("-4,-4"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GinsengTileCodes.Ginseng), new NotationPoint("-4,4"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GinsengTileCodes.Orchid), new NotationPoint("-4,-5"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GinsengTileCodes.Orchid), new NotationPoint("-4,5"));
};

GinsengGameManager.prototype.getCopy = function() {
	var copyGame = new GinsengGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};

export function GinsengNotationAdjustmentFunction(row, col) {
	/* Return string displaying point notation for this game */
	// return "row:" + row + " col:" + col;
	return new RowAndColumn(col, 16 - row).notationPointString;
}
