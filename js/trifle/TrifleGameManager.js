// Trifle Game Manager

function TrifleGameManager(actuator, ignoreActuate, isCopy) {
	this.gameLogText = '';
	this.isCopy = isCopy;

	this.actuator = actuator;

	this.tileManager = new TrifleTileManager();

	this.setup(ignoreActuate);
}

// Set up the game
TrifleGameManager.prototype.setup = function (ignoreActuate) {

	this.board = new TrifleBoard();

	// Update the actuator
	if (!ignoreActuate) {
		this.actuate();
	}
};

// Sends the updated board to the actuator
TrifleGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.tileManager);
	setGameLogText(this.gameLogText);
};

TrifleGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	if (move.moveType === TEAM_SELECTION) {
		var self = this;
		move.teamTileCodes.forEach(function(tileCode){
			var tile = new TrifleTile(tileCode, move.playerCode);
			self.tileManager.addToTeamIfOk(tile);
		});
		this.buildTeamSelectionGameLogText(move);
	} else if (move.moveType === DEPLOY) {
		var tile = this.tileManager.grabTile(move.player, move.tileType);
		this.board.placeTile(tile, move.endPoint);
		this.buildDeployGameLogText(move, tile);
	} else if (move.moveType === MOVE) {
		var moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint);
		this.buildMoveGameLogText(move, moveDetails);
	} else if (move.moveType === DRAW_ACCEPT) {
		this.gameHasEndedInDraw = true;
	}

	if (withActuate) {
		this.actuate();
	}
};

TrifleGameManager.prototype.buildTeamSelectionGameLogText = function(move) {
	this.gameLogText = move.player + "'s team: " + move.teamTileCodes;
};
TrifleGameManager.prototype.buildDeployGameLogText = function(move, tile) {
	this.gameLogText = move.player + ' placed ' + TrifleTile.getTileName(tile.code) + ' at ' + move.endPoint.pointText;
};
TrifleGameManager.prototype.buildMoveGameLogText = function(move, moveDetails) {
	this.gameLogText = move.player + ' moved ' + TrifleTile.getTileName(moveDetails.movedTile.code) + ' from ' + move.startPoint.pointText + ' to ' + move.endPoint.pointText;
	if (moveDetails.capturedTile) {
		this.gameLogText += ' and captured ' + getOpponentName(move.player) + '\'s ' + TrifleTile.getTileName(moveDetails.capturedTile.code);
	}
};

TrifleGameManager.prototype.playersAreSelectingTeams = function() {
	return !this.tileManager.hostTeamIsFull() || !this.tileManager.guestTeamIsFull();
};

TrifleGameManager.prototype.getPlayerTeamSelectionTileCodeList = function(player) {
	var team = this.tileManager.getPlayerTeam(player);
	var codeList = [];
	team.forEach(function(tile){
		codeList.push(tile.code);
	});
	return codeList.toString();
};

TrifleGameManager.prototype.addTileToTeam = function(tile) {
	var addedOk = this.tileManager.addToTeamIfOk(tile);
	if (addedOk) {
		this.actuate();
	}
	return this.tileManager.playerTeamIsFull(tile.ownerName);
};

TrifleGameManager.prototype.removeTileFromTeam = function(tile) {
	this.tileManager.removeTileFromTeam(tile);
	this.actuate();
};

TrifleGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

TrifleGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

TrifleGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	this.tileManager.removeSelectedTileFlags();
	if (!ignoreActuate) {
		this.actuate();
	}
};

TrifleGameManager.prototype.revealDeployPoints = function(player, tileCode, ignoreActuate) {
	this.board.setDeployPointsPossibleMoves(player, tileCode);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

TrifleGameManager.prototype.getWinner = function() {
	if (this.board.winners.length === 1) {
		return this.board.winners[0];
	}
};

TrifleGameManager.prototype.getWinReason = function() {
	return " has captured the opponent's Banner Tile and won the game!";
};

TrifleGameManager.prototype.getWinResultTypeCode = function() {
	if (this.board.winners.length === 1) {
		return 1;	// Standard win is 1
	} else if (this.gameHasEndedInDraw) {
		return 4;	// Tie/Draw is 4
	}
};

TrifleGameManager.prototype.getCopy = function() {
	var copyGame = new TrifleGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	copyGame.tileManager = this.tileManager.getCopy();
	return copyGame;
};
