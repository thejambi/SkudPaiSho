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

	actuate(moveToAnimate, phaseIndex) {
		if (this.isCopy) {
			return;
		}
		this.actuator.actuate(this.board, this.markingManager, moveToAnimate, phaseIndex);
	}

	runNotationMove(move, phaseIndex, withActuate, ignorePathFinding) {
		var moveData = move.moveData.phases[phaseIndex];

		if (moveData.moveType === BeyondTheMaps.MoveType.EXPLORE_SEA) {
			if (withActuate && !ignorePathFinding) {
				// Discover the movement path
				var moveDistance = moveData.moveDistance ? moveData.moveDistance : 6;
				moveData.movementPath = this.board.findPathForMovement(moveData.startPoint, moveData.endPoint, moveData.landPoint, moveDistance);
			}
			this.board.moveShip(moveData.startPoint, moveData.endPoint, moveData.landPoint);
		} else if (moveData.moveType === BeyondTheMaps.MoveType.EXPLORE_LAND) {
			this.board.placeLandPiecesForPlayer(move.player, moveData.landPoints);
		}

		/* Check for enclosed land for player */
		moveData.landfillPoints = this.board.fillEnclosedLandForPlayer(move.player);
	
		if (withActuate) {
			this.actuate(move, phaseIndex);
		}
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

	revealOpenGates(player, moveNum, ignoreActuate) {
		if (moveNum === 2) {
			// guest selecting first tile
			this.board.setGuestGateOpen();
		} else {
			this.board.setOpenGatePossibleMoves(player);
		}
		
		if (!ignoreActuate) {
			this.actuate();
		}
	}

	revealPossiblePlacementPoints(tile) {
		this.board.revealPossiblePlacementPoints(tile);
		this.actuate();
	}

	revealBoatBonusPoints(boardPoint) {
		this.board.revealBoatBonusPoints(boardPoint);
		this.actuate();
	}

	markPossibleLandPointsForMovement(boardPointEnd, possiblePaths, player) {
		var possibleLandPoints = [];
		if (possiblePaths && possiblePaths.length > 0) {
			var possibleLastStepPoints = [];
			possiblePaths.forEach(path => {
				var lastPoint = path.at(-1);
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
		if (this.board.winners.length === 1) {
			return this.board.winners[0];
		} else if (this.board.winners.length > 1) {
			return "BOTH players";
		} else if (this.endGameWinners.length === 1) {
			return this.endGameWinners[0];
		} else if (this.endGameWinners.length > 1) {
			return "BOTH players";
		}
	}

	getWinReason() {
		if (this.board.winners.length === 1) {
			return " wins! The game has ended.";
		} else if (this.endGameWinners.length === 1) {
			
		}
	}

	getWinResultTypeCode() {
		if (this.board.winners.length === 1) {
			return 1;	// Harmony Ring is 1
		} else if (this.endGameWinners.length === 1) {
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
