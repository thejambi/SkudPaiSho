// DEFAULTS HERE ARE NOT USED IN THE PROJECT, BUT UNTOUCHED TO NOT BRING THE SITE IN CONFUSION
// PAIJO USES THE INDEX.HTML as main (iframe in PaiJoController).

function PaiJoGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;
	this.actuator = actuator;

	this.hostScore = 0;
	this.guestScore = 0;
	
	this.setup(ignoreActuate);
}

PaiJoGameManager.prototype.setup = function(ignoreActuate) {
	this.board = new PaiJoBoard();

	if (!ignoreActuate) {
		this.actuate();
	}
};

PaiJoGameManager.prototype.actuate = function () {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board);
};

/* Required by Main */
PaiJoGameManager.prototype.runNotationMove = function(move, withActuate) {
	debug("Running Move: " + move.fullMoveText);

	if (move.moveType === INITIAL_SETUP) {
		/* Initial board setup */
		if (move.playerCode === "D") {
			var defendersPoints = [];
			var kingPoint = "";

			// Different codes for different board sizes.
			switch (move.boardSetupCode) {
				case "1":	// Default 4perSide
					kingPoint = this.board.thronePoint; //"d4";
					defendersPoints = this.board.getAdjacentNotationPointsFromNotationPoint(kingPoint,PaiJoDirections.UP);
					defendersPoints = defendersPoints.concat(this.board.getAdjacentNotationPointsFromNotationPoint(kingPoint,PaiJoDirections.DOWN_LEFT));
					defendersPoints = defendersPoints.concat(this.board.getAdjacentNotationPointsFromNotationPoint(kingPoint,PaiJoDirections.DOWN_RIGHT));
					break;
				case "2":	// Default 5perSide
					kingPoint = this.board.thronePoint;
					var defendersPoints = this.board.getAdjacentNotationPointsFromNotationPoint(kingPoint);
					break;
				default:
					debug("Unknown board setup code for " + PaiJoVars.DEFENDERS_PLAYER);
			}

			this.board.placeKing(kingPoint);

			var self = this;
			defendersPoints.forEach(
				function(pointName) {
					self.board.placeDefender(pointName);
				}
			);
		} else if (move.playerCode === "A") {
			var attackersPoints = [];

			switch (move.boardSetupCode) {
				case "1":	// Default 4perSide
					attackersPoints = this.board.cornerPoints;
					if (gameOptionEnabled(MORE_ATTACKERS)) {
						attackersPoints.push("f4");
						attackersPoints.push("d6");
						attackersPoints.push("b2");
					}
					break;
				case "2":	// Default 5perSide
					attackersPoints = this.board.cornerPoints;
					var otherAttackers = [];
					for (var i = 0; i < attackersPoints.length; i++) {
						attackerPoint = attackersPoints[i];
						var adjacentPoints = this.board.getAdjacentPoints(this.board.getBoardPointFromNotationPoint(attackerPoint));
						for (var j = 0; j < adjacentPoints.length; j++) {
							if (this.board.getValidAdjacentPoints(adjacentPoints[j]).length >= 6) {
								otherAttackers.push(adjacentPoints[j].getNotationPointString());
							}
						}
					}
					attackersPoints = attackersPoints.concat(otherAttackers);
					if (gameOptionEnabled(MORE_ATTACKERS)) {
						var removeThesePoints = ["e8","h5","b2"];
						for (var r = 0; r < removeThesePoints.length; r++) {
							var pointToRemove = removeThesePoints[r];
							var index = attackersPoints.indexOf(pointToRemove);
							if (index >= 0) {
								attackersPoints.splice(index, 1);
							}
						}
						attackersPoints.push("h4");
						attackersPoints.push("i6");
						attackersPoints.push("b1");
						attackersPoints.push("a2");
						attackersPoints.push("d8");
						attackersPoints.push("f9");
					}
					break;
				default:
					debug("Unknown board setup code for " + PaiJoVars.ATTACKERS_PLAYER);
			}

			var self = this;
			attackersPoints.forEach(
				function(pointName) {
					self.board.placeAttacker(pointName);
				}
			);
		}
	} else {
		/* Normal move */
		this.board.moveTile(move.startPoint, move.endPoint);
	}

	if (withActuate) {
		this.actuate();
	}
};

PaiJoGameManager.prototype.revealPossibleMovePoints = function(boardPoint, ignoreActuate) {
	if (!boardPoint.hasTile()) {
		return;
	}
	this.board.setPossibleMovePoints(boardPoint);
	
	if (!ignoreActuate) {
		this.actuate();
	}
};

PaiJoGameManager.prototype.hidePossibleMovePoints = function(ignoreActuate) {
	this.board.removePossibleMovePoints();
	if (!ignoreActuate) {
		this.actuate();
	}
};

PaiJoGameManager.prototype.hasEnded = function() {
	return this.getWinResultTypeCode() > 0;
};

/* Required by Main */
PaiJoGameManager.prototype.getWinner = function() {
	if (this.board.kingCaptured) {
		return PaiJoVars.ATTACKERS_PLAYER;
	}
	if (this.board.kingOnCorner) {
		return PaiJoVars.DEFENDERS_PLAYER;
	}
};

/* Required by Main */
PaiJoGameManager.prototype.getWinReason = function() {
	if (this.getWinner() === PaiJoVars.DEFENDERS_PLAYER) {
		return " wins! They escorted the King to safety!";
	} else if (this.getWinner() === PaiJoVars.ATTACKERS_PLAYER) {
		return " wins! They stormed the castle and captured the King!";
	}
};

PaiJoGameManager.prototype.getWinResultTypeCode = function() {
	if (this.getWinner()) {
		return 1;
	}
};

PaiJoGameManager.prototype.getCopy = function() {
	var copyGame = new PaiJoGameManager(this.actuator, true, true);
	copyGame.board = this.board.getCopy();
	return copyGame;
};

PaiJoGameManager.prototype.pointIsOpen = function(npText) {
	var rowAndCol = PaiJoBoardPoint.notationPointStringMap[npText];
	return rowAndCol 
		&& !this.board.cells[rowAndCol.row][rowAndCol.col].hasTile()
		&& this.board.cells[rowAndCol.row][rowAndCol.col].types.includes(PaiJoBoardPoint.Types.normal);
};
