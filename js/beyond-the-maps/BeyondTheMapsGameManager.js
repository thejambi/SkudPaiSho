// Beyond The Maps Game Manager

import { BeyondTheMapsBoard } from './BeyondTheMapsBoard';
import { EDGES_MOVE_4_2, gameOptionEnabled } from '../GameOptions';
import { GUEST, HOST } from '../CommonNotationObjects';
import { PaiShoMarkingManager } from '../pai-sho-common/PaiShoMarkingManager';
import { debug } from '../GameData';
import {
  guestPlayerCode,
  hostPlayerCode,
} from '../pai-sho-common/PaiShoPlayerHelp';
import BeyondTheMapsTile, { BeyondTheMapsTileType } from './BeyondTheMapsTile';

export var BeyondTheMapsMoveType = {
	EXPLORE_SEA: "ExploreSea",
	EXPLORE_LAND: "ExploreLand"
};

export class BeyondTheMapsGameManager {
	constructor(actuator, ignoreActuate, isCopy) {
		this.isCopy = isCopy;
	
		this.actuator = actuator;
	
		this.markingManager = new PaiShoMarkingManager();
	
		this.setup(ignoreActuate);
		this.endGameWinners = [];
	}

	setup(ignoreActuate) {
		this.board = new BeyondTheMapsBoard();

		this.board.hostStartingPoint.putTile(new BeyondTheMapsTile(BeyondTheMapsTileType.SHIP, hostPlayerCode));
		this.board.guestStartingPoint.putTile(new BeyondTheMapsTile(BeyondTheMapsTileType.SHIP, guestPlayerCode));
	
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

		// DEBUG
		this.debugPrintBoard();
		// debug(moveData);

		var actuateMoveData = {};

		if (moveData.moveType === BeyondTheMapsMoveType.EXPLORE_SEA) {
			if (withActuate && !ignorePathFinding) {
				// Discover the movement path
				var moveDistance = moveData.moveDistance 
					? moveData.moveDistance 
					: gameOptionEnabled(EDGES_MOVE_4_2) 
						? 4 
						: 6;
				actuateMoveData.movementPath = this.board.findPathForMovement(moveData.startPoint, moveData.endPoint, moveData.landPoint, moveDistance);
			}
			this.board.moveShip(moveData.startPoint, moveData.endPoint, moveData.landPoint);
		} else if (moveData.moveType === BeyondTheMapsMoveType.EXPLORE_LAND) {
			this.board.placeLandPiecesForPlayer(move.player, moveData.landPoints);
		}

		/* Check for enclosed land for player */
		if (!ignoreLandfill) {
			actuateMoveData.landfillPoints = this.board.fillEnclosedLandForPlayer(move.player);
		}

		if (!ignoreWinCheck) {
			if (this.board.shipsSeparatedAndAShipHasNotBeenSurrounded()) {
				this.debugPrintBoard();
				debug("WRONG STUFF");
			}

			var playersSurrounded = this.board.aShipIsSurrounded();
			if (playersSurrounded) {
				// End of game, calculate scores to find winner
				this.setEndOfGameWinners(playersSurrounded);
			}
		}
	
		if (withActuate) {
			this.actuate(move, phaseIndex, actuateMoveData);
		}

		this.lastPlayerName = move.player;
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

	markPossibleLandPointsForMovement(startPointNotationText, boardPointEnd, possiblePaths, player) {
		var boardPointStart = this.board.getBoardPointFromNotationPoint(startPointNotationText);
		var possibleLandPoints = [];
		if (boardPointStart === boardPointEnd) {
			possibleLandPoints = this.board.markLandPointsPossibleMovesForNoMovement(boardPointEnd, player);
		} else if (possiblePaths && possiblePaths.length > 0) {
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
		if (this.endGameWinners.length === 0) {
			return;
		}

		var span = document.createElement("span");

		if (this.endGameWinners.length === 1) {
			span.appendChild(document.createTextNode(" discovered more land to win!"));
		} else {
			span.appendChild(document.createTextNode(" discovered much land together!"));
		}

		span.appendChild(document.createElement("br"));
		span.appendChild(document.createElement("br"));
		span.appendChild(document.createTextNode("Host land: " + this.calculatePlayerScore(HOST)));
		span.appendChild(document.createElement("br"));
		span.appendChild(document.createTextNode("Guest land: " + this.calculatePlayerScore(GUEST)));

		return span;
	}

	getWinResultTypeCode() {
		if (this.endGameWinners.length === 1) {
			return 1; // ?
		} else if (this.endGameWinners.length > 1) {
			return 4;	// Tie
		}
	}

	getNextPlayerName = function() {
		if (this.lastPlayerName === HOST) {
			return GUEST;
		} else {
			return HOST;
		}
	};

	getCopy() {
		var copyGame = new BeyondTheMapsGameManager(this.actuator, true, true);
		copyGame.board = this.board.getCopy();
		copyGame.lastPlayerName = this.lastPlayerName;
		return copyGame;
	}

	isUsingTileReserves() {
		return this.usingTileReserves;
	}

	getShipPointForPlayer(player) {
		return this.board.shipPoints[player];
	}

	getDebugPrintBoardStr() {
		var boardStr = "";
		var row = 0;
		this.board.forEachBoardPoint(bp => {
			if (row !== bp.row) {
				boardStr += "\n";
				row = bp.row;
			}
			boardStr += " " + bp.getDebugPrintStr();
		});
		return boardStr;
	}

	debugPrintBoard() {
		debug(this.getDebugPrintBoardStr());
	}
}
