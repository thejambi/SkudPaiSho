// Vagabond Trifle Game Manager - Game manager for Vagabond using Trifle engine

import {
  DEPLOY,
  DRAW_ACCEPT,
  GUEST,
  HOST,
  MOVE,
} from '../CommonNotationObjects';
import { VagabondTrifleTileCodes } from './VagabondTrifleTiles';
import { VagabondTrifleTileManager } from './VagabondTrifleTileManager';
import { PaiShoMarkingManager } from '../pai-sho-common/PaiShoMarkingManager';
import { TrifleAbilityName } from '../trifle/TrifleTileInfo';
import { TrifleTile } from '../trifle/TrifleTile';
import { debug } from '../GameData';
import {
  getOpponentName,
  getPlayerCodeFromName,
} from '../pai-sho-common/PaiShoPlayerHelp';
import { setGameLogText } from '../GameState';
import { PaiShoGameBoard } from '../trifle/PaiShoGameBoard';

export function VagabondTrifleGameManager(actuator, ignoreActuate, isCopy) {
	this.gameLogText = '';
	this.isCopy = isCopy;

	this.actuator = actuator;

	TrifleTile.resetTrifleTileId();
	this.tileManager = new VagabondTrifleTileManager();
	this.markingManager = new PaiShoMarkingManager();

	this.setup(ignoreActuate);
}

VagabondTrifleGameManager.prototype.updateActuator = function(newActuator) {
	this.actuator = newActuator;
};

// Set up the game
VagabondTrifleGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new PaiShoGameBoard(this.tileManager, this.buildAbilityActivationOrder());
	this.board.useBannerCaptureSystem = false; // Vagabond uses Lotus capture, not Banner
	this.winners = [];

	// Track Lotus deployment for capture rules
	this.hostLotusPlayed = false;
	this.guestLotusPlayed = false;

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
VagabondTrifleGameManager.prototype.actuate = function(moveToAnimate, moveDetails) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate, moveDetails);
	setGameLogText(this.gameLogText);
};

VagabondTrifleGameManager.prototype.runNotationMove = function(move, withActuate, moveAnimationBeginStep_unused, skipAnimation) {
	debug("Running Move:");
	debug(move);

	this.board.tickDurationAbilities();

	var moveDetails;

	if (move.moveType === DEPLOY) {
		// Deploy tile
		var tile = this.tileManager.grabTile(move.player, move.tileType);
		this.board.placeTile(tile, move.endPoint);

		// Track Lotus deployment
		if (move.tileType === VagabondTrifleTileCodes.WhiteLotus) {
			if (move.player === HOST) {
				this.hostLotusPlayed = true;
			} else {
				this.guestLotusPlayed = true;
			}
		}

		this.buildDeployGameLogText(move, tile);

	} else if (move.moveType === MOVE) {
		moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint, move);
		this.tileManager.addToCapturedTiles(moveDetails.capturedTiles);

		var abilityActivationFlags = moveDetails.abilityActivationFlags;
		debug(abilityActivationFlags);

		if (abilityActivationFlags && abilityActivationFlags.tileRecords) {
			if (abilityActivationFlags.tileRecords.capturedTiles && abilityActivationFlags.tileRecords.capturedTiles.length) {
				this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.capturedTiles);
			}
		}

		this.buildMoveGameLogText(move, moveDetails);

		// Check for win condition: Lotus capture
		this.checkForWin(moveDetails);

	} else if (move.moveType === DRAW_ACCEPT) {
		this.gameHasEndedInDraw = true;
	}

	if (withActuate && !skipAnimation) {
		this.actuate(move, moveDetails);
	}
};

VagabondTrifleGameManager.prototype.buildDeployGameLogText = function(move, tile) {
	// move.endPoint is already a NotationPoint object with pointText property
	var moveNumLabel = move.moveNum + "" + getPlayerCodeFromName(move.player);

	this.gameLogText = moveNumLabel + ". " + move.player + ' deployed ' + TrifleTile.getTileName(tile.code) + ' at ' + move.endPoint.pointText;
};

VagabondTrifleGameManager.prototype.buildMoveGameLogText = function(move, moveDetails) {
	// move.startPoint and move.endPoint are already NotationPoint objects
	var moveNumLabel = move.moveNum + "" + getPlayerCodeFromName(move.player);

	this.gameLogText = moveNumLabel + ". " + move.player + ' moved ' + TrifleTile.getTileName(moveDetails.movedTile.code) + ' from ' + move.startPoint.pointText + ' to ' + move.endPoint.pointText;

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
};

// Vagabond Win Condition: Capture opponent's White Lotus
VagabondTrifleGameManager.prototype.checkForWin = function(moveDetails) {
	if (moveDetails && moveDetails.capturedTiles) {
		moveDetails.capturedTiles.forEach((capturedTile) => {
			if (capturedTile.code === VagabondTrifleTileCodes.WhiteLotus) {
				// The player who captured the Lotus wins
				// The captured tile's owner loses
				var winner = capturedTile.ownerName === HOST ? GUEST : HOST;
				this.winners.push(winner);
			}
		});
	}

	// Also check ability-captured tiles
	if (moveDetails && moveDetails.abilityActivationFlags &&
			moveDetails.abilityActivationFlags.tileRecords &&
			moveDetails.abilityActivationFlags.tileRecords.capturedTiles) {
		moveDetails.abilityActivationFlags.tileRecords.capturedTiles.forEach((capturedTile) => {
			if (capturedTile.code === VagabondTrifleTileCodes.WhiteLotus) {
				var winner = capturedTile.ownerName === HOST ? GUEST : HOST;
				if (!this.winners.includes(winner)) {
					this.winners.push(winner);
				}
			}
		});
	}
};

VagabondTrifleGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

VagabondTrifleGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);

	if (!ignoreActuate) {
		this.actuate();
	}
};

VagabondTrifleGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

VagabondTrifleGameManager.prototype.revealDeployPoints = function(tile, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(tile);

	if (!ignoreActuate) {
		this.actuate();
	}
};

VagabondTrifleGameManager.prototype.getWinner = function() {
	if (this.winners.length === 1) {
		return this.winners[0];
	}
};

VagabondTrifleGameManager.prototype.getWinReason = function() {
	return " captured the opponent's White Lotus!";
};

VagabondTrifleGameManager.prototype.getWinResultTypeCode = function() {
	if (this.winners.length === 1) {
		return 1;	// Standard win is 1
	} else if (this.gameHasEndedInDraw) {
		return 4;	// Tie/Draw is 4
	}
};

VagabondTrifleGameManager.prototype.buildAbilityActivationOrder = function() {
	return [
		TrifleAbilityName.cancelAbilities,
		TrifleAbilityName.cancelAbilitiesTargetingTiles,
		TrifleAbilityName.protectFromCapture,
		TrifleAbilityName.immobilizeTiles,
		TrifleAbilityName.restrictMovementWithinZone
	];
};

VagabondTrifleGameManager.prototype.buildAbilitySummaryLines = function() {
	var abilitySummaryLines = [];
	this.board.abilityManager.abilities.forEach((abilityObject) => {
		if (abilityObject.activated) {
			abilitySummaryLines = abilitySummaryLines.concat(abilityObject.getSummaryLines());
		}
	});

	return abilitySummaryLines;
};

VagabondTrifleGameManager.prototype.getCopy = function() {
	var copyGame = new VagabondTrifleGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	copyGame.hostLotusPlayed = this.hostLotusPlayed;
	copyGame.guestLotusPlayed = this.guestLotusPlayed;
	return copyGame;
};

// Helper methods for AI and other components
VagabondTrifleGameManager.prototype.getHostLotusPlayed = function() {
	return this.hostLotusPlayed;
};

VagabondTrifleGameManager.prototype.getGuestLotusPlayed = function() {
	return this.guestLotusPlayed;
};

VagabondTrifleGameManager.prototype.bothLotusesPlayed = function() {
	return this.hostLotusPlayed && this.guestLotusPlayed;
};
