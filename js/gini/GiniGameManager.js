// Gini Game Manager

import {
	DEPLOY,
	DRAW_ACCEPT,
	GUEST,
	HOST,
	MOVE,
	NotationPoint,
	RowAndColumn,
} from '../CommonNotationObjects';
import { debug } from '../GameData';
import { PaiShoMarkingManager } from '../pai-sho-common/PaiShoMarkingManager';
import {
	getOpponentName,
	getPlayerCodeFromName,
} from '../pai-sho-common/PaiShoPlayerHelp';
import { setGameLogText } from '../GameState';
import { NEUTRAL, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import { PaiShoGameBoard } from '../trifle/PaiShoGameBoard';
import { TrifleTile } from '../trifle/TrifleTile';
import { TrifleAbilityName, TrifleDeployType } from '../trifle/TrifleTileInfo';
import { GiniTileManager } from './GiniTileManager';
import { GiniTileCodes, GiniTiles } from './GiniTiles';

export var ACCENT_TILE_HOME = "AccentTileHome";
export var PORTAL = "Portal";

var accentTileHomePositions = {};
accentTileHomePositions[HOST] = {};
accentTileHomePositions[HOST][GiniTileCodes.Water] = "5,4";
accentTileHomePositions[HOST][GiniTileCodes.Earth] = "5,5";
accentTileHomePositions[HOST][GiniTileCodes.Fire] = "6,4";
accentTileHomePositions[HOST][GiniTileCodes.Air] = "6,5";
accentTileHomePositions[GUEST] = {};
accentTileHomePositions[GUEST][GiniTileCodes.Water] = "-6,-5";
accentTileHomePositions[GUEST][GiniTileCodes.Earth] = "-6,-4";
accentTileHomePositions[GUEST][GiniTileCodes.Fire] = "-5,-5";
accentTileHomePositions[GUEST][GiniTileCodes.Air] = "-5,-4";

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
	this.board = new PaiShoGameBoard(this.tileManager, this.buildAbilityActivationOrder(), GiniTiles);
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

	if (move.moveType === MOVE) {
		// Fire displacement: remove occupied tile before moveTile so it isn't captured
		var startBP = this.board.getPointFromNotationPoint(new NotationPoint(move.startPoint));
		var endBP = this.board.getPointFromNotationPoint(new NotationPoint(move.endPoint));
		if (startBP.hasTile() && endBP.hasTile()) {
			var startTileInfo = this.board.tileMetadata[startBP.tile.code];
			if (startTileInfo && startTileInfo.deployTypes && startTileInfo.deployTypes.includes(TrifleDeployType.onOccupiedTile)) {
				startBP.tile._displacedTile = endBP.removeTile();
			}
		}

		moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint, move);
		this.handleCapturedTiles(moveDetails.capturedTiles);

		var abilityActivationFlags = moveDetails.abilityActivationFlags;
		debug(abilityActivationFlags);

		if (abilityActivationFlags.tileRecords) {
			if (abilityActivationFlags.tileRecords.capturedTiles && abilityActivationFlags.tileRecords.capturedTiles.length) {
				this.handleCapturedTiles(abilityActivationFlags.tileRecords.capturedTiles);
			}
			if (abilityActivationFlags.tileRecords.tilesMovedToPiles && abilityActivationFlags.tileRecords.tilesMovedToPiles.length) {
				this.handleCapturedTiles(abilityActivationFlags.tileRecords.tilesMovedToPiles);
			}
		}

		var needToPromptUser = abilityActivationFlags && abilityActivationFlags.neededPromptInfo && abilityActivationFlags.neededPromptInfo.currentPromptTargetId;
		if (needToPromptUser) {
			neededPromptInfo = abilityActivationFlags.neededPromptInfo;
		}

		// Attach animation info for actuator
		move.animationInfo = {
			startPoint: move.startPoint,
			endPoint: move.endPoint,
			movedTile: moveDetails.movedTile,
			capturedTiles: moveDetails.capturedTiles || [],
			abilityAnimations: moveDetails.animations || null
		};

		this.buildMoveGameLogText(move, moveDetails);
		this.checkForWin();
	} else if (move.moveType === DEPLOY) {
		var tile = this.tileManager.grabAccentTile(move.player, move.tileType);
		if (tile) {
			var endNotationPoint = new NotationPoint(move.endPoint);

			// Fire displacement: remove occupied tile before placing Fire
			var deployTileInfo = this.board.tileMetadata[tile.code];
			if (deployTileInfo && deployTileInfo.deployTypes && deployTileInfo.deployTypes.includes(TrifleDeployType.onOccupiedTile)) {
				var deployEndBP = this.board.getPointFromNotationPoint(endNotationPoint);
				if (deployEndBP.hasTile()) {
					tile._displacedTile = deployEndBP.removeTile();
				}
			}

			this.board.putTileOnPoint(tile, endNotationPoint);

			var tileInfo = this.board.tileMetadata[tile.code];
			var boardPointEnd = this.board.getPointFromNotationPoint(endNotationPoint);
			var capturedTiles = [];

			var abilityActivationFlags = this.board.processAbilities(tile, tileInfo, null, boardPointEnd, capturedTiles, [], move);
			this.handleCapturedTiles(capturedTiles);

			if (abilityActivationFlags.tileRecords) {
				if (abilityActivationFlags.tileRecords.capturedTiles && abilityActivationFlags.tileRecords.capturedTiles.length) {
					this.handleCapturedTiles(abilityActivationFlags.tileRecords.capturedTiles);
				}
				if (abilityActivationFlags.tileRecords.tilesMovedToPiles && abilityActivationFlags.tileRecords.tilesMovedToPiles.length) {
					this.handleCapturedTiles(abilityActivationFlags.tileRecords.tilesMovedToPiles);
				}
			}

			moveDetails = {
				movedTile: tile,
				capturedTiles: capturedTiles,
				abilityActivationFlags: abilityActivationFlags,
				animations: abilityActivationFlags.animations
			};

			move.animationInfo = {
				endPoint: move.endPoint,
				movedTile: tile,
				capturedTiles: capturedTiles,
				abilityAnimations: abilityActivationFlags.animations || null
			};

			this.checkForWin();
		}
	} else if (move.moveType === DRAW_ACCEPT) {
		this.gameHasEndedInDraw = true;
	}

	if (withActuate && !skipAnimation) {
		this.actuate(move, moveDetails);
	}

	return neededPromptInfo;
};

GiniGameManager.prototype.handleCapturedTiles = function(capturedTiles) {
	this.tileManager.addToCapturedTiles(capturedTiles);
	this.returnAccentTilesToBoard();
};

GiniGameManager.prototype.returnAccentTilesToBoard = function() {
	var self = this;
	[this.tileManager.hostAccentTiles, this.tileManager.guestAccentTiles].forEach(function(pile) {
		while (pile.length > 0) {
			var tile = pile.pop();
			var homePos = accentTileHomePositions[tile.ownerName] && accentTileHomePositions[tile.ownerName][tile.code];
			if (homePos) {
				self.board.putTileOnPoint(tile, new NotationPoint(homePos));
			}
		}
	});
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
		if (hostLotusRowAndCol.x <= -3) {
			this.winners.push(HOST);
		}
	}

	if (guestLotusPoints.length === 1) {
		var guestLotusPoint = guestLotusPoints[0];
		var guestLotusRowAndCol = new RowAndColumn(guestLotusPoint.row, guestLotusPoint.col);
		if (guestLotusRowAndCol.x >= 3) {
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

	this.expandPortalMoves(boardPoint);

	// Accent tile home positions are never valid move destinations
	this.board.forEachBoardPoint(function(bp) {
		if (bp.isType(ACCENT_TILE_HOME) && bp.isType(POSSIBLE_MOVE)) {
			bp.removeType(POSSIBLE_MOVE);
		}
	});

	// White Lotus cannot land on Temple/Portal points
	if (boardPoint.tile && boardPoint.tile.code === GiniTileCodes.WhiteLotus) {
		this.board.forEachBoardPoint(function(bp) {
			if (bp.isType(PORTAL) && bp.isType(POSSIBLE_MOVE)) {
				bp.removeType(POSSIBLE_MOVE);
			}
		});
	}

	if (!ignoreActuate) {
		this.actuate();
	}
};

GiniGameManager.prototype.expandPortalMoves = function(startingPoint) {
	/* Temples/portals are connected: jumping between them costs 0 movement.
	   When a tile can reach a portal (or starts on one), it can continue its
	   remaining movement from ALL other empty portals. */
	var board = this.board;
	var tile = startingPoint.tile;
	var tileInfo = board.tileMetadata[tile.code];
	if (!tileInfo || !tileInfo.movements || tileInfo.movements.length === 0) return;

	// Collect all portal points
	var portalPoints = [];
	board.forEachBoardPoint(function(bp) {
		if (bp.isType(PORTAL)) {
			portalPoints.push(bp);
		}
	});

	tileInfo.movements.forEach(function(movementInfo) {
		movementInfo = board.getManipulatedMovementInfo(startingPoint, movementInfo);
		var movementFunction = board.getMovementFunctionForType(movementInfo.type);
		if (!movementFunction) return;

		// Calculate total movement distance (mirrors setPossibleMovesForMovement logic)
		var overriddenDistance = board.getOverriddenMovementDistance(tile);
		var totalDistance;
		if (overriddenDistance !== null) {
			totalDistance = overriddenDistance;
		} else {
			var baseDistance = movementInfo.distance + board.getMovementExtendedDistance(startingPoint, movementInfo);
			var distanceFactor = board.getMovementDistanceFactor(tile);
			totalDistance = Math.floor(baseDistance * distanceFactor);
		}

		// Find reachable portals and their remaining movement distance
		var reachablePortals = [];
		portalPoints.forEach(function(portalPoint) {
			var distRemaining;
			if (portalPoint === startingPoint) {
				distRemaining = totalDistance;
			} else if (portalPoint.isType(POSSIBLE_MOVE)) {
				distRemaining = portalPoint.getMoveDistanceRemaining(movementInfo);
				if (distRemaining === undefined || distRemaining === null) distRemaining = 0;
				// Subtract 1: moveDistanceRemaining is set before the step decrement,
				// so it includes the step onto the portal itself
				distRemaining = distRemaining - 1;
			} else {
				return;
			}
			if (distRemaining > 0) {
				reachablePortals.push({ point: portalPoint, distance: distRemaining });
			}
		});

		if (reachablePortals.length === 0) return;

		// For each destination portal, use the best available remaining distance
		// from any reachable source portal, then continue movement expansion
		portalPoints.forEach(function(destPortal) {
			// Can't jump to an occupied portal (unless it's the starting point)
			if (destPortal.hasTile() && destPortal !== startingPoint) return;

			reachablePortals.forEach(function(source) {
				if (source.point === destPortal) return;

				var distanceRemaining = source.distance;

				// Skip if dest already has equal or better distance for this movement
				var existingDistance = destPortal.getMoveDistanceRemaining(movementInfo);
				if (existingDistance !== undefined && existingDistance !== null && existingDistance >= distanceRemaining) return;

				// Mark destination portal as a valid move and link path to source portal
				if (!destPortal.hasTile()) {
					board.setPointAsPossibleMovement(destPortal, tile, startingPoint, null, movementInfo);
					destPortal.setPossibleForMovementType(movementInfo);
					destPortal.setPreviousPoint(source.point);
				}
				destPortal.setMoveDistanceRemaining(movementInfo, distanceRemaining);

				// Continue movement expansion from the destination portal
				var moveStepNumber = totalDistance - distanceRemaining;
				board.setPossibleMovementPointsFromMovePoints(
					[destPortal],
					movementFunction,
					tile,
					movementInfo,
					startingPoint,
					distanceRemaining,
					moveStepNumber
				);
			});
		});
	});
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

	// Accent tile home positions are never valid deploy destinations
	this.board.forEachBoardPoint(function(bp) {
		if (bp.isType(ACCENT_TILE_HOME) && bp.isType(POSSIBLE_MOVE)) {
			bp.removeType(POSSIBLE_MOVE);
		}
	});

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
		TrifleAbilityName.moveTargetTile,
		TrifleAbilityName.displaceOccupiedTile,
		TrifleAbilityName.swapTwoSurroundingTiles,
		TrifleAbilityName.rotateSurroundingTilesClockwise,
		TrifleAbilityName.swapAndRelocateTile
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
	this.board.putTileOnPoint(this.tileManager.grabTile(HOST, GiniTileCodes.WhiteLotus), new NotationPoint("6,0"));
	this.board.putTileOnPoint(this.tileManager.grabTile(HOST, GiniTileCodes.Badgermole), new NotationPoint("5,-1"));
	this.board.putTileOnPoint(this.tileManager.grabTile(HOST, GiniTileCodes.Dragon), new NotationPoint("5,1"));
	this.board.putTileOnPoint(this.tileManager.grabTile(HOST, GiniTileCodes.Koi), new NotationPoint("4,-2"));
	this.board.putTileOnPoint(this.tileManager.grabTile(HOST, GiniTileCodes.Bison), new NotationPoint("4,2"));
	this.board.putTileOnPoint(this.tileManager.grabTile(HOST, GiniTileCodes.Ginseng), new NotationPoint("4,0"));

	/* Guest tiles (left side, negative x) */
	this.board.putTileOnPoint(this.tileManager.grabTile(GUEST, GiniTileCodes.WhiteLotus), new NotationPoint("-6,0"));
	this.board.putTileOnPoint(this.tileManager.grabTile(GUEST, GiniTileCodes.Badgermole), new NotationPoint("-5,1"));
	this.board.putTileOnPoint(this.tileManager.grabTile(GUEST, GiniTileCodes.Dragon), new NotationPoint("-5,-1"));
	this.board.putTileOnPoint(this.tileManager.grabTile(GUEST, GiniTileCodes.Koi), new NotationPoint("-4,2"));
	this.board.putTileOnPoint(this.tileManager.grabTile(GUEST, GiniTileCodes.Bison), new NotationPoint("-4,-2"));
	this.board.putTileOnPoint(this.tileManager.grabTile(GUEST, GiniTileCodes.Ginseng), new NotationPoint("-4,0"));

	this.board.putTileOnPoint(this.tileManager.grabAccentTile(HOST, GiniTileCodes.Water), new NotationPoint("5,4"));
	this.board.putTileOnPoint(this.tileManager.grabAccentTile(HOST, GiniTileCodes.Earth), new NotationPoint("5,5"));
	this.board.putTileOnPoint(this.tileManager.grabAccentTile(HOST, GiniTileCodes.Fire), new NotationPoint("6,4"));
	this.board.putTileOnPoint(this.tileManager.grabAccentTile(HOST, GiniTileCodes.Air), new NotationPoint("6,5"));

	this.board.putTileOnPoint(this.tileManager.grabAccentTile(GUEST, GiniTileCodes.Water), new NotationPoint("-6,-5"));
	this.board.putTileOnPoint(this.tileManager.grabAccentTile(GUEST, GiniTileCodes.Earth), new NotationPoint("-6,-4"));
	this.board.putTileOnPoint(this.tileManager.grabAccentTile(GUEST, GiniTileCodes.Fire), new NotationPoint("-5,-5"));
	this.board.putTileOnPoint(this.tileManager.grabAccentTile(GUEST, GiniTileCodes.Air), new NotationPoint("-5,-4"));

	this.customizeBoardPoints();

	// Process abilities so passive effects (e.g. Bison movement boost) are active from the start
	this.board.processAbilities(null, null, null, null, [], [], {});
};

GiniGameManager.prototype.getPoint = function(notationStr) {
	var np = new NotationPoint(notationStr);
	var rc = np.rowAndColumn;
	return this.board.cells[rc.row][rc.col];
};

GiniGameManager.prototype.setPointType = function(notationStr, addTypes, removeTypes) {
	var point = this.getPoint(notationStr);
	if (removeTypes) {
		removeTypes.forEach(function(type) { point.removeType(type); });
	}
	if (addTypes) {
		addTypes.forEach(function(type) { point.addType(type); });
	}
};

GiniGameManager.prototype.customizeBoardPoints = function() {
	/* Pure Neutral garden points are not playable in Gini.
	   Border points (redNeutral, whiteNeutral, redWhiteNeutral) remain playable. */
	for (var row = 0; row < this.board.cells.length; row++) {
		for (var col = 0; col < this.board.cells[row].length; col++) {
			var point = this.board.cells[row][col];
			if (point.isType(NEUTRAL) && !point.isType(RED) && !point.isType(WHITE)) {
				point.addType(NON_PLAYABLE);
			}
		}
	}

	/* Mark accent tile home positions (removes NON_PLAYABLE so they render and are clickable) */
	var accentHomePositions = [
		"5,4", "5,5", "6,4", "6,5",
		"-6,-5", "-6,-4", "-5,-5", "-5,-4"
	];
	var self = this;
	accentHomePositions.forEach(function(pos) {
		self.setPointType(pos, [ACCENT_TILE_HOME], [NON_PLAYABLE]);
	});

	/* Mark portal positions at the 4 gate/temple points (tips of the diamond) */
	var portalPositions = ["0,8", "0,-8", "-8,0", "8,0"];
	portalPositions.forEach(function(pos) {
		self.setPointType(pos, [PORTAL], []);
	});
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
