// Nick Game Manager

import {
	DRAW_ACCEPT,
	GUEST,
	HOST,
	MOVE,
	NotationPoint,
	RowAndColumn,
	SETUP,
} from '../CommonNotationObjects';
import { PaiShoMarkingManager } from '../pai-sho-common/PaiShoMarkingManager';
import { TrifleAbilityName } from '../trifle/TrifleTileInfo';
import { TrifleTile } from '../trifle/TrifleTile';
import { debug } from '../GameData';
import {
	getOpponentName,
	getPlayerCodeFromName,
} from '../pai-sho-common/PaiShoPlayerHelp';
import { NickTileManager } from './NickTileManager';
import { NickTileCodes } from './NickTiles';
import { NickActuator } from './NickActuator';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { PaiShoGameBoard } from '../trifle/PaiShoGameBoard';
import { setGameLogText } from '../PaiShoMain';

export class NickGameManager {
	constructor(actuator, ignoreActuate, isCopy) {
		this.gameLogText = '';
		this.isCopy = isCopy;

		this.actuator = actuator;

		TrifleTile.resetTrifleTileId();
		this.tileManager = new NickTileManager();
		this.markingManager = new PaiShoMarkingManager();

		this.setup(ignoreActuate);
	}

	updateActuator(newActuator) {
		this.actuator = newActuator;
	}

	// Set up the game
	setup(ignoreActuate) {
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
	}

	// Place a tile on the board
	placeTile(owner, tileCode, notationPoint) {
		const tile = this.tileManager.grabTile(owner, tileCode);
		if (!tile) {
			debug("placeTile: tile not found for owner=" + owner + " code=" + tileCode + " at " + notationPoint);
			return;
		}
		this.board.placeTile(tile, new NotationPoint(notationPoint));
	}

	// Sends the updated board to the actuator
	actuate(moveToAnimate, moveDetails) {
		if (this.isCopy) {
			return;
		}
		this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate, moveDetails);
		setGameLogText(this.gameLogText);
	}

	runNotationMove(move, withActuate, moveAnimationBeginStep_unused, skipAnimation) {
		debug("Running Move:");
		debug(move);

		this.board.tickDurationAbilities();

		let neededPromptInfo;

		let moveDetails;

		if (move.moveType === SETUP) {
			this.doBoardSetup(move.setupNum);
		} else if (move.moveType === MOVE) {
			moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint, move);
			this.tileManager.addToCapturedTiles(moveDetails.capturedTiles);

			const abilityActivationFlags = moveDetails.abilityActivationFlags;
			debug(abilityActivationFlags);

			if (abilityActivationFlags.tileRecords) {
				if (abilityActivationFlags.tileRecords.capturedTiles && abilityActivationFlags.tileRecords.capturedTiles.length) {
					this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.capturedTiles);
				}
				if (abilityActivationFlags.tileRecords.tilesMovedToPiles && abilityActivationFlags.tileRecords.tilesMovedToPiles.length) {
					this.tileManager.addToCapturedTiles(abilityActivationFlags.tileRecords.tilesMovedToPiles);
				}
			}

			const needToPromptUser = abilityActivationFlags && abilityActivationFlags.neededPromptInfo && abilityActivationFlags.neededPromptInfo.currentPromptTargetId;
			if (needToPromptUser) {
				neededPromptInfo = abilityActivationFlags.neededPromptInfo;
			}

			this.buildMoveGameLogText(move, moveDetails);
			this.recomputeLotusCheckStatus();
			this.checkForWin(move.player);
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
	}

	buildMoveGameLogText(move, moveDetails) {
		const startPoint = new NotationPoint(move.startPoint);
		const endPoint = new NotationPoint(move.endPoint);
		const startPointDisplay = NickActuator.NotationAdjustmentFunction(startPoint.rowAndColumn.row, startPoint.rowAndColumn.col);
		const endPointDisplay = NickActuator.NotationAdjustmentFunction(endPoint.rowAndColumn.row, endPoint.rowAndColumn.col);

		const moveNumLabel = move.moveNum + "" + getPlayerCodeFromName(move.player);

		this.gameLogText = moveNumLabel + ". " + move.player + ' moved ' + TrifleTile.getTileName(moveDetails.movedTile.code) + ' from ' + startPointDisplay + ' to ' + endPointDisplay;
		if (moveDetails.capturedTiles && moveDetails.capturedTiles.length > 0) {
			this.gameLogText += ' and captured ' + getOpponentName(move.player) + '\'s ';// + TrifleTile.getTileName(moveDetails.capturedTile.code);
			let first = true;
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
			let first = true;
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
			let first = true;
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
				const promptDataEntry = move.promptTargetData[key];
				const keyObject = JSON.parse(key);
				if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
					const movedTilePointRowAndCol = promptDataEntry.movedTilePoint.rowAndColumn;
					const movedTileDestinationRowAndCol = promptDataEntry.movedTileDestinationPoint.rowAndColumn;
					this.gameLogText += "; Push: ";
					this.gameLogText += "(" + NickActuator.NotationAdjustmentFunction(movedTilePointRowAndCol.row, movedTilePointRowAndCol.col) + ")-";
					this.gameLogText += "(" + NickActuator.NotationAdjustmentFunction(movedTileDestinationRowAndCol.row, movedTileDestinationRowAndCol.col) + ")";
				} else if (promptDataEntry.chosenCapturedTile) {
					this.gameLogText += "; Exchange with: " + TrifleTile.getTileName(promptDataEntry.chosenCapturedTile.code);
				} else {
					this.gameLogText += " Ability?";
				}
			});
		}
	}

	recomputeLotusCheckStatus() {
		const hostLotusPoints = this.board.getTilePoints(NickTileCodes.WhiteLotus, HOST);
		const guestLotusPoints = this.board.getTilePoints(NickTileCodes.WhiteLotus, GUEST);
		const allLotusPoints = hostLotusPoints.concat(guestLotusPoints);
		allLotusPoints.forEach((lotusPoint) => {
			lotusPoint.lotusInCheck = false;
			lotusPoint.lotusInCheckBy = null;
			if (lotusPoint.hasTile()) {
				const surrounding = this.board.getSurroundingBoardPoints(lotusPoint);
				surrounding.forEach((sp) => {
					if (sp.hasTile() && sp.tile.ownerName !== lotusPoint.tile.ownerName) {
						lotusPoint.lotusInCheck = true;
						lotusPoint.lotusInCheckBy = sp.tile;
					}
				});
			}
		});
	}

	checkForWin(lastMovingPlayer) {
		const hostLotusPoints = this.board.getTilePoints(NickTileCodes.WhiteLotus, HOST);
		const guestLotusPoints = this.board.getTilePoints(NickTileCodes.WhiteLotus, GUEST);

		if (hostLotusPoints.length === 1) {
			const hostLotusPoint = hostLotusPoints[0];
			const hostLotusRowAndCol = new RowAndColumn(hostLotusPoint.row, hostLotusPoint.col);
			if (hostLotusRowAndCol.x === 0 && hostLotusRowAndCol.y === 0) {
				this.winners.push(HOST);
			}
		}

		if (guestLotusPoints.length === 1) {
			const guestLotusPoint = guestLotusPoints[0];
			const guestLotusRowAndCol = new RowAndColumn(guestLotusPoint.row, guestLotusPoint.col);
			if (guestLotusRowAndCol.x === 0 && guestLotusRowAndCol.y === 0) {
				this.winners.push(GUEST);
			}
		}

		// If the player who just finished their turn still has their Lotus in check, they lose.
		if (lastMovingPlayer) {
			const moverLotusPoints = this.board.getTilePoints(NickTileCodes.WhiteLotus, lastMovingPlayer);
			if (moverLotusPoints.length === 1 && moverLotusPoints[0].lotusInCheck) {
				this.winners.push(getOpponentName(lastMovingPlayer));
			}
		}
	}

	playersAreSelectingTeams() {
		return this.tileManager.playersAreSelectingTeams();
	}

	getPlayerTeamSelectionTileCodeList(player) {
		const team = this.tileManager.getPlayerTeam(player);
		const codeList = [];
		team.forEach((tile) => {
			codeList.push(tile.code);
		});
		return codeList.toString();
	}

	addTileToTeam(tile) {
		const addedOk = this.tileManager.addToTeamIfOk(tile);
		if (addedOk) {
			this.actuate();
		}
		return this.tileManager.playerTeamIsFull(tile.ownerName);
	}

	removeTileFromTeam(tile) {
		this.tileManager.removeTileFromTeam(tile);
		this.actuate();
	}

	hasEnded() {
		return this.getWinResultTypeCode() > 0;
	}

	revealPossibleMovePoints(boardPoint, ignoreActuate) {
		if (!boardPoint.hasTile()) {
			return;
		}
		this.board.setPossibleMovePoints(boardPoint);

		// Nick-specific: prevent moving your White Lotus into check
		if (boardPoint.tile && boardPoint.tile.code === NickTileCodes.WhiteLotus) {
			this.board.forEachBoardPoint((bp) => {
				if (bp.isType(POSSIBLE_MOVE)) {
					const surrounding = this.board.getSurroundingBoardPoints(bp);
					const inCheck = surrounding.some((sp) => {
						return sp.hasTile() && sp.tile.ownerName !== boardPoint.tile.ownerName;
					});
					if (inCheck) {
						bp.removeType(POSSIBLE_MOVE);
					}
				}
			});
		}

		if (!ignoreActuate) {
			this.actuate();
		}
	}

	hidePossibleMovePoints(ignoreActuate) {
		this.board.removePossibleMovePoints();
		this.tileManager.removeSelectedTileFlags();
		if (!ignoreActuate) {
			this.actuate();
		}
	}

	revealDeployPoints(tile, ignoreActuate) {
		this.board.setDeployPointsPossibleMoves(tile);
		
		if (!ignoreActuate) {
			this.actuate();
		}
	}

	getWinner() {
		if (this.winners.length === 1) {
			return this.winners[0];
		}
	}

	getWinReason() {
		return " won the game!";
	}

	getWinResultTypeCode() {
		if (this.winners.length === 1) {
			return 1;	// Standard win is 1
		} else if (this.gameHasEndedInDraw) {
			return 4;	// Tie/Draw is 4
		}
	}

	buildAbilityActivationOrder() {
		return [
			TrifleAbilityName.recordTilePoint,
			TrifleAbilityName.moveTileToRecordedPoint,
			TrifleAbilityName.cancelAbilities,
			TrifleAbilityName.cancelAbilitiesTargetingTiles,
			TrifleAbilityName.protectFromCapture,
			TrifleAbilityName.moveTargetTile
		];
	}

	buildAbilitySummaryLines() {
		let abilitySummaryLines = [];
		this.board.abilityManager.abilities.forEach((abilityObject) => {
			if (abilityObject.activated) {
				abilitySummaryLines = abilitySummaryLines.concat(abilityObject.getSummaryLines());
			}
		});

		return abilitySummaryLines;
	}

	doBoardSetup(setupNum) {
		/* Remove all tiles from board, then set up board. */
		this.board.forEachBoardPointWithTile(boardPoint => {
			this.tileManager.putTileBack(boardPoint.removeTile());
		});

		this.placeTile(HOST, NickTileCodes.WhiteLotus, "6,6");
		this.placeTile(HOST, NickTileCodes.Avatar, "4,4");

		this.placeTile(HOST, NickTileCodes.Air, "5,6");
		this.placeTile(HOST, NickTileCodes.Water, "4,6");
		this.placeTile(HOST, NickTileCodes.Earth, "3,6");
		this.placeTile(HOST, NickTileCodes.Fire, "2,6");

		this.placeTile(HOST, NickTileCodes.Earth, "6,5");
		this.placeTile(HOST, NickTileCodes.Fire, "6,4");
		this.placeTile(HOST, NickTileCodes.Air, "6,3");
		this.placeTile(HOST, NickTileCodes.Water, "6,2");

		this.placeTile(HOST, NickTileCodes.Air, "2,5");
		this.placeTile(HOST, NickTileCodes.Water, "1,7");
		this.placeTile(HOST, NickTileCodes.Earth, "5,2");
		this.placeTile(HOST, NickTileCodes.Fire, "7,1");

		this.placeTile(GUEST, NickTileCodes.WhiteLotus, "-6,-6");
		this.placeTile(GUEST, NickTileCodes.Avatar, "-4,-4");

		this.placeTile(GUEST, NickTileCodes.Air, "-5,-6");
		this.placeTile(GUEST, NickTileCodes.Water, "-4,-6");
		this.placeTile(GUEST, NickTileCodes.Earth, "-3,-6");
		this.placeTile(GUEST, NickTileCodes.Fire, "-2,-6");

		this.placeTile(GUEST, NickTileCodes.Earth, "-6,-5");
		this.placeTile(GUEST, NickTileCodes.Fire, "-6,-4");
		this.placeTile(GUEST, NickTileCodes.Air, "-6,-3");
		this.placeTile(GUEST, NickTileCodes.Water, "-6,-2");

		this.placeTile(GUEST, NickTileCodes.Air, "-2,-5");
		this.placeTile(GUEST, NickTileCodes.Water, "-1,-7");
		this.placeTile(GUEST, NickTileCodes.Earth, "-5,-2");
		this.placeTile(GUEST, NickTileCodes.Fire, "-7,-1");
	}

	getCopy() {
		const copyGame = new NickGameManager(this.actuator, true, true);
		copyGame.board = this.board.getCopy();
		copyGame.tileManager = this.tileManager.getCopy();
		copyGame.winners = this.winners ? [...this.winners] : [];
		return copyGame;
	}
}

export default NickGameManager;
