// Beyond The Maps Game Manager

BeyondTheMaps.MoveType = {
	EXPLORE_SEA: "ExploreSea",
	EXPLORE_LAND: "ExploreLand"
};

BeyondTheMaps.GameManager = class {
	constructor(actuator, ignoreActuate, isCopy) {
		this.isCopy = isCopy;
	
		this.actuator = actuator;
	
		this.markingManager = new PaiShoMarkingManager();
	
		this.setup(ignoreActuate);
		this.endGameWinners = [];
	}

	setup(ignoreActuate) {
		this.board = new BeyondTheMaps.Board();

		this.board.hostStartingPoint.putTile(new BeyondTheMaps.Tile(BeyondTheMaps.TileType.SHIP, hostPlayerCode));
		this.board.guestStartingPoint.putTile(new BeyondTheMaps.Tile(BeyondTheMaps.TileType.SHIP, guestPlayerCode));
	
		if (!ignoreActuate) {
			this.actuate();
		}
	}

	actuate(moveToAnimate, phaseIndex, actuateMoveData) {
		if (this.isCopy) {
			return;
		}
		this.actuator.actuate(this.board, this.markingManager, moveToAnimate, phaseIndex, actuateMoveData);
	}

	runNotationMove(move, phaseIndex, withActuate, ignorePathFinding, ignoreWinCheck, ignoreLandfill) {
		var moveData = move.moveData.phases[phaseIndex];

		var actuateMoveData = {};

		if (moveData.moveType === BeyondTheMaps.MoveType.EXPLORE_SEA) {
			if (withActuate && !ignorePathFinding) {
				// Discover the movement path
				var moveDistance = moveData.moveDistance ? moveData.moveDistance : 6;
				actuateMoveData.movementPath = this.board.findPathForMovement(moveData.startPoint, moveData.endPoint, moveData.landPoint, moveDistance);
			}
			this.board.moveShip(moveData.startPoint, moveData.endPoint, moveData.landPoint);
		} else if (moveData.moveType === BeyondTheMaps.MoveType.EXPLORE_LAND) {
			this.board.placeLandPiecesForPlayer(move.player, moveData.landPoints);
		}

		// this.board.analyzeSeaAndLandGroups();

		/* Check for enclosed land for player */
		if (ignoreLandfill) {
			actuateMoveData.landfillPoints = this.board.fillEnclosedLandForPlayer(move.player);
		}

		if (!ignoreWinCheck) {
			var playersSurrounded = this.board.aShipIsSurrounded();
			if (playersSurrounded) {
				// End of game, calculate scores to find winner
				this.setEndOfGameWinners(playersSurrounded);
			}
		}
	
		if (withActuate) {
			this.actuate(move, phaseIndex, actuateMoveData);
		}
	}

	setEndOfGameWinners(playersSurrounded) {
		this.endGameWinners = [];
		var hostScore = this.calculatePlayerScore(HOST);
		var guestScore = this.calculatePlayerScore(GUEST);

		debug("HOST: " + hostScore + " vs GUEST: " + guestScore);

		if (hostScore >= guestScore && !this.endGameWinners.includes(HOST)) {
			this.endGameWinners.push(HOST);
		}
		if (guestScore >= hostScore && !this.endGameWinners.includes(GUEST)) {
			this.endGameWinners.push(GUEST);
		}
	}

	calculatePlayerScore(playerName) {
		return this.board.countPlayerLandPieces(playerName);
	}

	revealAllPointsAsPossible() {
		this.board.setAllPointsAsPossible();
		this.actuate();
	}

	revealPossibleMovePoints(boardPoint, ignoreActuate, moveDistance) {
		if (!boardPoint.hasTile()) {
			return;
		}
		this.board.setPossibleMovePoints(boardPoint, moveDistance);
		
		if (!ignoreActuate) {
			this.actuate();
		}
	}

	revealPossibleExploreLandPoints(playerName, ignoreActuate) {
		var possiblePointsFound = this.board.setPossibleExploreLandPointsForPlayer(playerName);

		if (!ignoreActuate) {
			this.actuate();
		}

		return possiblePointsFound;
	}

	revealPossibleContinueExploreLandPoints(playerName, boardPoint, ignoreActuate) {
		var possiblePointsFound = this.board.setPossibleContinueExploreLandPointsForPlayer(playerName, boardPoint);

		if (!ignoreActuate) {
			this.actuate();
		}

		return possiblePointsFound;
	}

	hidePossibleMovePoints(ignoreActuate) {
		this.board.removePossibleMovePoints();
		if (!ignoreActuate) {
			this.actuate();
		}
	}

	markPossibleLandPointsForMovement(boardPointEnd, possiblePaths, player) {
		var possibleLandPoints = [];
		if (possiblePaths && possiblePaths.length > 0) {
			var possibleLastStepPoints = [];
			possiblePaths.forEach(path => {
				var lastPoint = path[path.length - 1];
				if (!possibleLastStepPoints.includes(lastPoint)) {
					possibleLastStepPoints.push(lastPoint);
				}
			});

			possibleLastStepPoints.forEach(lastStepPoint => {
				var possiblePoint = this.board.markLandPointAtEndOfPathPossibleMove(boardPointEnd, lastStepPoint, player);
				if (possiblePoint) {
					possibleLandPoints.push(possiblePoint);
				}
			});
		}
		return possibleLandPoints;
	}

	getWinner() {
		if (this.endGameWinners.length === 1) {
			return this.endGameWinners[0];
		} else if (this.endGameWinners.length > 1) {
			return "BOTH players";
		}
	}

	getWinReason() {
		var msg;

		if (this.endGameWinners.length > 0) {
			if (this.endGameWinners.length === 1) {
				msg = " discovered more land to win!";
			} else if (this.endGameWinners.length > 1) {
				msg = " discovered much land together!";
			}
			msg += "<br /><br />";
			msg += "Host land: " + this.calculatePlayerScore(HOST);
			msg += "<br />";
			msg += "Guest land: " + this.calculatePlayerScore(GUEST);
		}

		return msg;
	}

	getWinResultTypeCode() {
		if (this.endGameWinners.length === 1) {
			return 1; // ?
		} else if (this.endGameWinners.length > 1) {
			return 4;	// Tie
		}
	}

	getCopy() {
		var copyGame = new BeyondTheMaps.GameManager(this.actuator, true, true);
		copyGame.board = this.board.getCopy();
		return copyGame;
	}

	isUsingTileReserves() {
		return this.usingTileReserves;
	}
};
