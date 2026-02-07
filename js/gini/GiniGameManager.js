// Gini Game Manager

import {
  DEPLOY,
  DRAW_ACCEPT,
  GUEST,
  HOST,
  MOVE,
  NotationPoint,
  RowAndColumn,
  SETUP,
} from '../CommonNotationObjects';
import { GiniTileCodes, GiniTileInfo } from './GiniTiles';
import { GiniTileManager } from './GiniTileManager';
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

export var GiniGameManager = function(actuator, ignoreActuate, isCopy) {
	this.gameLogText = '';
	this.isCopy = isCopy;

	this.actuator = actuator;

	TrifleTile.resetTrifleTileId();
	this.tileManager = new GiniTileManager();
	this.markingManager = new PaiShoMarkingManager();

	this.setup(ignoreActuate);
};

GiniGameManager.prototype.updateActuator = function(newActuator) {
	this.actuator = newActuator;
};

// Set up the game
GiniGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new PaiShoGameBoard(this.tileManager, this.buildAbilityActivationOrder());
	this.board.useBannerCaptureSystem = false;
	this.winners = [];

	this.gameHasSetupMove = false;
	this.doBoardSetup();

	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
GiniGameManager.prototype.actuate = function(moveToAnimate, moveDetails) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate, moveDetails);
	setGameLogText(this.gameLogText);
};

GiniGameManager.prototype.runNotationMove = function(move, withActuate, moveAnimationBeginStep_unused, skipAnimation) {
	debug("Running Move:");
	debug(move);

	this.board.tickDurationAbilities();

	var neededPromptInfo;
	var moveDetails;

	if (move.moveType === SETUP) {
		// No setup moves in Gini
	} else if (move.moveType === DEPLOY) {
		// Accent tile deployment
		var tile = this.tileManager.grabAccentTile(move.player, move.tileType);
		if (tile) {
			this.board.placeTile(tile, new NotationPoint(move.endPoint));

			// Process abilities triggered by deployment
			moveDetails = {
				capturedTiles: [],
				movedTile: tile,
				abilityActivationFlags: {}
			};

			this.buildDeployGameLogText(move, tile);
			this.checkForWin();
		}
	} else if (move.moveType === MOVE) {
		moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint, move);
		this.tileManager.addToCapturedTiles(moveDetails.capturedTiles);

		var abilityActivationFlags = moveDetails.abilityActivationFlags;
		debug(abilityActivationFlags);

		if (abilityActivationFlags.tileRecords) {
			if (abilityActivationFlags.tileRecords.capturedTiles && abilityActivationFlags.tileRecords.capturedTiles.length) {
				this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.capturedTiles);
			}
			if (abilityActivationFlags.tileRecords.tilesMovedToPiles && abilityActivationFlags.tileRecords.tilesMovedToPiles.length) {
				this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.tilesMovedToPiles);
			}
		}

		var needToPromptUser = abilityActivationFlags && abilityActivationFlags.neededPromptInfo && abilityActivationFlags.neededPromptInfo.currentPromptTargetId;
		if (needToPromptUser) {
			neededPromptInfo = abilityActivationFlags.neededPromptInfo;
		}

		this.buildMoveGameLogText(move, moveDetails);
		this.checkForWin();
	} else if (move.moveType === DRAW_ACCEPT) {
		this.gameHasEndedInDraw = true;
	}

	if (withActuate && !skipAnimation) {
		this.actuate(move, moveDetails);
	}

	return neededPromptInfo;
};

GiniGameManager.prototype.buildDeployGameLogText = function(move, tile) {
	var endPoint = new NotationPoint(move.endPoint);
	var endPointDisplay = GiniNotationAdjustmentFunction(endPoint.rowAndColumn.row, endPoint.rowAndColumn.col);

	var moveNumLabel = move.moveNum + "" + getPlayerCodeFromName(move.player);

	this.gameLogText = moveNumLabel + ". " + move.player + ' placed ' + TrifleTile.getTileName(tile.code) + ' at ' + endPointDisplay;
};

GiniGameManager.prototype.buildMoveGameLogText = function(move, moveDetails) {
	var startPoint = new NotationPoint(move.startPoint);
	var endPoint = new NotationPoint(move.endPoint);
	var startPointDisplay = GiniNotationAdjustmentFunction(startPoint.rowAndColumn.row, startPoint.rowAndColumn.col);
	var endPointDisplay = GiniNotationAdjustmentFunction(endPoint.rowAndColumn.row, endPoint.rowAndColumn.col);

	var moveNumLabel = move.moveNum + "" + getPlayerCodeFromName(move.player);

	this.gameLogText = moveNumLabel + ". " + move.player + ' moved ' + TrifleTile.getTileName(moveDetails.movedTile.code) + ' from ' + startPointDisplay + ' to ' + endPointDisplay;
	if (moveDetails.capturedTiles && moveDetails.capturedTiles.length > 0) {
		this.gameLogText += ' and captured ' + getOpponentName(move.player) + '\'s ';
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

	if (move.promptTargetData) {
		Object.keys(move.promptTargetData).forEach((key, index) => {
			var promptDataEntry = move.promptTargetData[key];
			if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
				var movedTilePointRowAndCol = promptDataEntry.movedTilePoint.rowAndColumn;
				var movedTileDestinationRowAndCol = promptDataEntry.movedTileDestinationPoint.rowAndColumn;
				this.gameLogText += "; Push: ";
				this.gameLogText += "(" + GiniNotationAdjustmentFunction(movedTilePointRowAndCol.row, movedTilePointRowAndCol.col) + ")-";
				this.gameLogText += "(" + GiniNotationAdjustmentFunction(movedTileDestinationRowAndCol.row, movedTileDestinationRowAndCol.col) + ")";
			}
		});
	}
};

GiniGameManager.prototype.checkForWin = function() {
	var hostLotusPoints = this.board.getTilePoints(GiniTileCodes.WhiteLotus, HOST);
	var guestLotusPoints = this.board.getTilePoints(GiniTileCodes.WhiteLotus, GUEST);
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

GiniGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

GiniGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);

	if (!ignoreActuate) {
		this.actuate();
	}
};

GiniGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

GiniGameManager.prototype.revealDeployPoints = function(tile, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(tile);

	if (!ignoreActuate) {
		this.actuate();
	}
};

GiniGameManager.prototype.getWinner = function() {
	if (this.winners.length === 1) {
		return this.winners[0];
	}
};

GiniGameManager.prototype.getWinReason = function() {
	return " won the game!";
};

GiniGameManager.prototype.getWinResultTypeCode = function() {
	if (this.winners.length === 1) {
		return 1;
	} else if (this.gameHasEndedInDraw) {
		return 4;
	}
};

GiniGameManager.prototype.buildAbilityActivationOrder = function() {
	return [
		TrifleAbilityName.cancelAbilities,
		TrifleAbilityName.cancelAbilitiesTargetingTiles,
		TrifleAbilityName.protectFromCapture,
		TrifleAbilityName.moveTargetTile
	];
};

GiniGameManager.prototype.buildAbilitySummaryLines = function() {
	var abilitySummaryLines = [];
	this.board.abilityManager.abilities.forEach((abilityObject) => {
		if (abilityObject.activated) {
			abilitySummaryLines = abilitySummaryLines.concat(abilityObject.getSummaryLines());
		}
	});
	return abilitySummaryLines;
};

GiniGameManager.prototype.doBoardSetup = function() {
	/* Remove all tiles from board, then set up board. */
	this.board.forEachBoardPointWithTile(boardPoint => {
		this.tileManager.putTileBack(boardPoint.removeTile());
	});

	/* Host tiles (right side, positive x) */
	this.board.placeTile(this.tileManager.grabTile(HOST, GiniTileCodes.WhiteLotus), new NotationPoint("6,0"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GiniTileCodes.Badgermole), new NotationPoint("5,-1"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GiniTileCodes.Dragon), new NotationPoint("5,1"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GiniTileCodes.Koi), new NotationPoint("4,-2"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GiniTileCodes.Bison), new NotationPoint("4,2"));
	this.board.placeTile(this.tileManager.grabTile(HOST, GiniTileCodes.Ginseng), new NotationPoint("4,0"));

	/* Guest tiles (left side, negative x) */
	this.board.placeTile(this.tileManager.grabTile(GUEST, GiniTileCodes.WhiteLotus), new NotationPoint("-6,0"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GiniTileCodes.Badgermole), new NotationPoint("-5,1"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GiniTileCodes.Dragon), new NotationPoint("-5,-1"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GiniTileCodes.Koi), new NotationPoint("-4,2"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GiniTileCodes.Bison), new NotationPoint("-4,-2"));
	this.board.placeTile(this.tileManager.grabTile(GUEST, GiniTileCodes.Ginseng), new NotationPoint("-4,0"));
};

GiniGameManager.prototype.getCopy = function() {
	var copyGame = new GiniGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};

export function GiniNotationAdjustmentFunction(row, col) {
	return new RowAndColumn(col, 16 - row).notationPointString;
}
