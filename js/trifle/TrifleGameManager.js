// Trifle Game Manager

import { PaiShoMarkingManager } from "../pai-sho-common/PaiShoMarkingManager";
import { setGameLogText } from "../PaiShoMain";
import { PaiShoGameBoard } from "./PaiShoGameBoard";
import TrifleTileManager from "./TrifleTileManager";
import { debug } from "../GameData";
import { currentTileMetadata } from "./PaiShoGamesTileMetadata";
import { TrifleTileInfo } from "./TrifleTileInfo";
import { DEPLOY, DRAW_ACCEPT, HOST, MOVE, TEAM_SELECTION } from "../CommonNotationObjects";
import { TrifleTile } from "./TrifleTile";
import { getOpponentName } from "../pai-sho-common/PaiShoPlayerHelp";

export class TrifleGameManager {
	constructor(actuator, ignoreActuate, isCopy) {
		this.gameLogText = '';
		this.isCopy = isCopy;

		this.actuator = actuator;

		this.tileManager = new TrifleTileManager();
		this.markingManager = new PaiShoMarkingManager();

		this.setup(ignoreActuate);
	}

	// Set up the game
	setup(ignoreActuate) {
		this.board = new PaiShoGameBoard(this.tileManager);
		this.board.useTrifleTempleRules = true;
		this.winners = [];
		this.hostBannerPlayed = false;
		this.guestBannerPlayed = false;

		// Update the actuator
		if (!ignoreActuate) {
			this.actuate();
		}
	}

	// Sends the updated board to the actuator
	actuate(moveToAnimate) {
		if (this.isCopy) {
			return;
		}
		this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate);
		setGameLogText(this.gameLogText);
	}

	runNotationMove(move, withActuate) {
		debug("Running Move: " + move.fullMoveText);

		if (move.moveType === TEAM_SELECTION) {
			move.teamTileCodes.forEach((tileCode) => {
				const tile = new TrifleTile(tileCode, move.playerCode);
				this.tileManager.addToTeamIfOk(tile);
			});
			this.buildTeamSelectionGameLogText(move);
		} else if (move.moveType === DEPLOY) {
			const tile = this.tileManager.grabTile(move.player, move.tileType);
			this.board.placeTile(tile, move.endPoint);
			this.buildDeployGameLogText(move, tile);

			/* Banner played? Could use this in future, currently in Board. */
			if (TrifleTileInfo.tileIsBanner(currentTileMetadata[tile.code])) {
				if (tile.ownerName === HOST) {
					this.hostBannerPlayed = true;
				} else {
					this.guestBannerPlayed = true;
				}
			}
		} else if (move.moveType === MOVE) {
			const moveDetails = this.board.moveTile(move.player, move.startPoint, move.endPoint);
			this.buildMoveGameLogText(move, moveDetails);

			// Attach animation info for actuator
			move.animationInfo = {
				startPoint: move.startPoint,
				endPoint: move.endPoint,
				movedTile: moveDetails.movedTile,
				capturedTiles: moveDetails.capturedTiles || [],
				abilityAnimations: moveDetails.animations || null
			};

			// If tile is capturing a Banner tile, there's a winner
			if (moveDetails.capturedTiles && moveDetails.capturedTiles.length) {
				moveDetails.capturedTiles.forEach((capturedTile) => {
					if (capturedTile && TrifleTileInfo.tileIsBanner(currentTileMetadata[capturedTile.code])) {
						this.winners.push(getOpponentName(capturedTile.ownerName));
					}
				});
			}
		} else if (move.moveType === DRAW_ACCEPT) {
			this.gameHasEndedInDraw = true;
		}

		/** 
		 * Tick duration abilities at end of turn. 
		 * This ensures that ability durations are the same during move planning, UI board interaction, and move execution.
		 */
		this.board.tickDurationAbilities();

		if (withActuate) {
			this.actuate(move);
		}
	}

	buildTeamSelectionGameLogText(move) {
		this.gameLogText = move.player + " selected their team";
	}

	buildDeployGameLogText(move, tile) {
		this.gameLogText = move.player + ' placed ' + TrifleTile.getTileName(tile.code) + ' at ' + move.endPoint.pointText;
	}

	buildMoveGameLogText(move, moveDetails) {
		this.gameLogText = move.player + ' moved ' + TrifleTile.getTileName(moveDetails.movedTile.code) + ' from ' + move.startPoint.pointText + ' to ' + move.endPoint.pointText;
		if (moveDetails.capturedTiles && moveDetails.capturedTiles.length > 0) {
			this.gameLogText += ' and captured ' + getOpponentName(move.player) + '\'s ';// + TrifleTile.getTileName(moveDetails.capturedTile.code);
			let first = true;
			moveDetails.capturedTiles.forEach((capturedTile) => {
				if (!first) {
					this.gameLogText += ',';
				} else {
					first = false;
				}
				this.gameLogText += TrifleTile.getTileName(capturedTile.code);
			});
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
		return " has captured the opponent's Banner Tile and won the game!";
	}

	getWinResultTypeCode() {
		if (this.winners.length === 1) {
			return 1;	// Standard win is 1
		} else if (this.gameHasEndedInDraw) {
			return 4;	// Tie/Draw is 4
		}
	}

	getCopy() {
		const copyGame = new TrifleGameManager(this.actuator, true, true);
		copyGame.board = this.board.getCopy();
		copyGame.tileManager = this.tileManager.getCopy();
		return copyGame;
	}
}

export default TrifleGameManager;
