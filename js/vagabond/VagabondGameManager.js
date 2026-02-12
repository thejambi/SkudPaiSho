// Vagabond Game Manager

import { DEPLOY, DRAW_ACCEPT, GUEST, HOST, MOVE } from '../CommonNotationObjects';
import { PaiShoMarkingManager } from '../pai-sho-common/PaiShoMarkingManager';
import { VagabondBoard } from './VagabondBoard';
import { VagabondTile } from './VagabondTile';
import { VagabondTileManager } from './VagabondTileManager';
import { debug } from '../GameData';
import { getOpponentName } from '../pai-sho-common/PaiShoPlayerHelp';
import { setGameLogText } from '../GameState';

export function VagabondGameManager(actuator, ignoreActuate, isCopy) {
	this.gameLogText = '';
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new VagabondTileManager();
	this.markingManager = new PaiShoMarkingManager();

	this.setup(ignoreActuate);
}

// Set up the game
VagabondGameManager.prototype.setup = function (ignoreActuate) {

	this.board = new VagabondBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
VagabondGameManager.prototype.actuate = function (moveToAnimate) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate);
	setGameLogText(this.gameLogText);
};

VagabondGameManager.prototype.runNotationMove = function(move, withActuate) {
	if (!move || !move.fullMoveText) {
		debug("No move?");
	}
	debug("Running Move: " + move.fullMoveText);

	if (move.moveType === DEPLOY) {
		// Just placing tile on board
		var tile = this.tileManager.grabTile(move.player, move.tileType);
		this.board.placeTile(tile, move.endPoint);

		this.buildDeployGameLogText(move, tile);
	} else if (move.moveType === MOVE) {
		var moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint);

		move.capturedTile = moveDetails.capturedTile;

		this.buildMoveGameLogText(move, moveDetails);
	}

	if (move.moveType === DRAW_ACCEPT) {
		this.gameHasEndedInDraw = true;
		this.buildAcceptDrawGameLogText(move);
	}

	if (withActuate) {
		this.actuate(move);
	}

	this.lastPlayerName = move.player;
};

VagabondGameManager.prototype.buildDeployGameLogText = function(move, tile) {
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' placed ' + VagabondTile.getTileName(tile.code) + ' at ' + move.endPoint.pointText
		+ this.getPlayerHasOfferedDrawGameLogTextIfDrawOffered(move);
};
VagabondGameManager.prototype.buildMoveGameLogText = function(move, moveDetails) {
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ move.player + ' moved ' + VagabondTile.getTileName(moveDetails.movedTile.code) + ' from ' + move.startPoint.pointText + ' to ' + move.endPoint.pointText;
	if (moveDetails.capturedTile) {
		this.gameLogText += ' and captured ' + getOpponentName(move.player) + '\'s ' + VagabondTile.getTileName(moveDetails.capturedTile.code);
	}
	this.gameLogText += this.getPlayerHasOfferedDrawGameLogTextIfDrawOffered(move);
};
VagabondGameManager.prototype.buildAcceptDrawGameLogText = function(move) {
	this.gameLogText = move.moveNum + move.playerCode + '. '
		+ 'Draw offer accepted. Game has ended in a draw.';
};

VagabondGameManager.prototype.getPlayerHasOfferedDrawGameLogTextIfDrawOffered = function(move) {
	if (move.offerDraw) {
		return ". A draw has been offered.";
	}
	return "";
};

VagabondGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

VagabondGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);

	if (!ignoreActuate) {
		this.actuate();
	}
};

VagabondGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

VagabondGameManager.prototype.revealDeployPoints = function(player, tileCode, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(player, tileCode);

	if (!ignoreActuate) {
		this.actuate();
	}
};

VagabondGameManager.prototype.getWinner = function() {
	if (this.board.winners.length === 1) {
		return this.board.winners[0];
	}
};

VagabondGameManager.prototype.getWinReason = function() {
	return " has captured the White Lotus and won the game!";
};

VagabondGameManager.prototype.getWinResultTypeCode = function() {
	if (this.board.winners.length === 1) {
		return 1;	// Standard win is 1
	} else if (this.gameHasEndedInDraw) {
		return 4;	// Tie/Draw is 4
	}
};

VagabondGameManager.prototype.getNextPlayerName = function() {
	if (this.lastPlayerName === HOST) {
		return GUEST;
	} else {
		return HOST;
	}
};

VagabondGameManager.prototype.getCopy = function() {
	var copyGame = new VagabondGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	copyGame.lastPlayerName = this.lastPlayerName;
	return copyGame;
};
