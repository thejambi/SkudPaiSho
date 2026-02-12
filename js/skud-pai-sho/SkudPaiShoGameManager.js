// Skud Pai Sho Game Manager

import { ARRANGING, GUEST, HOST, PLANTING } from '../CommonNotationObjects';
import {
	NO_ALT_WIN,
	OPTION_INFORMAL_START,
	SPECIAL_FLOWERS_BOUNCE,
	gameOptionEnabled,
} from '../GameOptions';
import { PaiShoMarkingManager } from "../pai-sho-common/PaiShoMarkingManager";
import {
	SPECIAL_FLOWER,
	debug,
} from '../GameData';
import {
	lessBonus,
	limitedGatesRule,
	newGatesRule,
	newSpecialFlowerRules,
} from './SkudPaiShoRules';
import { SkudPaiShoBoard } from './SkudPaiShoBoard';
import { SkudPaiShoTile } from './SkudPaiShoTile';
import { SkudPaiShoTileManager } from './SkudPaiShoTileManager';
import { getOpponentName } from '../pai-sho-common/PaiShoPlayerHelp';
import { setGameLogText } from '../GameState';

export class SkudPaiShoGameManager {
	constructor(actuator, ignoreActuate, isCopy) {
		this.gameLogText = '';
		this.isCopy = isCopy;

		this.actuator = actuator;

		this.tileManager = new SkudPaiShoTileManager();
		this.markingManager = new PaiShoMarkingManager();

		this.setup(ignoreActuate);
		this.endGameWinners = [];
	}

	// Set up the game
	setup(ignoreActuate) {
		this.board = new SkudPaiShoBoard();

		// Update the actuator
		if (!ignoreActuate) {
			this.actuate();
		}
	}

	// Sends the updated board to the actuator
	actuate(moveToAnimate, moveAnimationBeginStep) {
		if (this.isCopy) {
			return;
		}
		this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate, moveAnimationBeginStep);
		setGameLogText(this.gameLogText);
	}

	runNotationMove(move, withActuate, moveAnimationBeginStep) {
		debug("Running Move(" + (withActuate ? "" : "Not ") + "Actuated): " + move.fullMoveText);

		let errorFound = false;
		let bonusAllowed = false;

		if (move.moveNum === 0 && move.accentTiles) {
			const self = this;
			const allAccentCodes = ['R', 'W', 'K', 'B', 'R', 'W', 'K', 'B', 'M', 'P', 'T'];
			move.accentTiles.forEach(function(tileCode) {
				const i = allAccentCodes.indexOf(tileCode);
				if (i >= 0) {
					allAccentCodes.splice(i, 1);
				}
			});
			allAccentCodes.forEach(function(tileCode) {
				self.tileManager.grabTile(move.player, tileCode);
			});
			self.tileManager.unselectTiles(move.player);

			this.buildChooseAccentTileGameLogText(move);
		} else if (move.moveNum === 1) {
			this.tileManager.unselectTiles(GUEST);
			this.tileManager.unselectTiles(HOST);
		}

		if (move.moveType === PLANTING) {
			// // Check if valid plant
			if (!this.board.pointIsOpenGate(move.endPoint)) {
				// invalid
				debug("Invalid planting point: " + move.endPoint.pointText);
				errorFound = true;
				return false;
			}
			// Just placing tile on board
			const tile = this.tileManager.grabTile(move.player, move.plantedFlowerType);

			this.board.placeTile(tile, move.endPoint, this.tileManager);

			this.buildPlantingGameLogText(move, tile);
		} else if (move.moveType === ARRANGING) {
			const moveResults = this.board.moveTile(move.player, move.startPoint, move.endPoint);
			bonusAllowed = moveResults.bonusAllowed;

			move.capturedTile = moveResults.capturedTile;

			if (moveResults.bonusAllowed && move.hasHarmonyBonus()) {
				const tile = this.tileManager.grabTile(move.player, move.bonusTileCode);
				move.accentTileUsed = tile;
				if (move.boatBonusPoint) {
					this.board.placeTile(tile, move.bonusEndPoint, this.tileManager, move.boatBonusPoint);
				} else {
					const placeTileResult = this.board.placeTile(tile, move.bonusEndPoint, this.tileManager);
					if (placeTileResult && placeTileResult.tileRemovedWithBoat) {
						move.tileRemovedWithBoat = placeTileResult.tileRemovedWithBoat;
					}
				}
			} else if (!moveResults.bonusAllowed && move.hasHarmonyBonus()) {
				debug("BONUS NOT ALLOWED so I won't give it to you!");
				errorFound = true;
			}

			if (gameOptionEnabled(SPECIAL_FLOWERS_BOUNCE)
				&& move.capturedTile && move.capturedTile.type === SPECIAL_FLOWER) {
				this.tileManager.putTileBack(move.capturedTile);
			}

			this.buildArrangingGameLogText(move, moveResults);
		}

		if (withActuate) {
			this.actuate(move, moveAnimationBeginStep);
		}

		this.endGameWinners = [];
		if (this.board.winners.length === 0) {
			// If no harmony ring winners, check for player out of basic flower tiles
			const playerOutOfTiles = this.aPlayerIsOutOfBasicFlowerTiles();
			if (playerOutOfTiles && !gameOptionEnabled(NO_ALT_WIN)) {
				debug("PLAYER OUT OF TILES: " + playerOutOfTiles);
				// (Previously, on Skud Pai Sho...) If a player has more accent tiles, they win
				// var playerMoreAccentTiles = this.tileManager.getPlayerWithMoreAccentTiles();
				// if (playerMoreAccentTiles) {
				// 	debug("Player has more Accent Tiles: " + playerMoreAccentTiles)
				// 	this.endGameWinners.push(playerMoreAccentTiles);
				// } else {
				// (Previously, on Skud Pai Sho...) Calculate player with most Harmonies
				// var playerWithmostHarmonies = this.board.harmonyManager.getPlayerWithMostHarmonies();
				// Calculate player with most Harmonies crossing midlines
				const playerWithmostHarmonies = this.board.harmonyManager.getPlayerWithMostHarmoniesCrossingMidlines();
				if (playerWithmostHarmonies) {
					this.endGameWinners.push(playerWithmostHarmonies);
					debug("Most Harmonies winner: " + playerWithmostHarmonies);
				} else {
					this.endGameWinners.push(HOST);
					this.endGameWinners.push(GUEST);
					debug("Most Harmonies is a tie!");
				}
				// }
			}
		}

		this.lastPlayerName = move.player;
		this.lastMoveNum = move.moveNum;

		return bonusAllowed;
	}

	buildChooseAccentTileGameLogText(move) {
		this.gameLogText = move.moveNum + move.playerCode + '. '
			+ move.player + ' chose Accent Tiles ' + move.accentTiles;
	}
	buildPlantingGameLogText(move, tile) {
		this.gameLogText = move.moveNum + move.playerCode + '. '
			+ move.player + ' Planted ' + tile.getName() + ' at ' + move.endPoint.pointText;
	}
	buildArrangingGameLogText(move, moveResults) {
		if (!moveResults) {
			return "Invalid Move :(";
		}
		this.gameLogText = move.moveNum + move.playerCode + '. '
			+ move.player + ' moved ' + moveResults.movedTile.getName() + ' ' + move.moveTextOnly;
		if (moveResults.capturedTile) {
			this.gameLogText += ' to capture ' + getOpponentName(move.player) + '\'s ' + moveResults.capturedTile.getName();
		}
		if (moveResults.bonusAllowed && move.hasHarmonyBonus()) {
			this.gameLogText += ' and used ' + SkudPaiShoTile.getTileName(move.bonusTileCode) + ' on Harmony Bonus';
		}
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

	hidePossibleMovePoints(ignoreActuate, moveToAnimate) {
		this.board.removePossibleMovePoints();
		this.tileManager.removeSelectedTileFlags();
		if (!ignoreActuate) {
			this.actuate(moveToAnimate);
		}
	}

	revealOpenGates(player, tile, moveNum, ignoreActuate) {
		if (!gameOptionEnabled(OPTION_INFORMAL_START) && moveNum === 2) {
			// guest selecting first tile
			this.board.setGuestGateOpen();
		} else {
			this.board.setOpenGatePossibleMoves(player, tile);
		}

		if (!ignoreActuate) {
			this.actuate();
		}
	}

	playerCanBonusPlant(player) {
		if (!newGatesRule) {
			return true;
		}

		if (lessBonus) {
			return this.board.playerHasNoGrowingFlowers(player);
		} else if (limitedGatesRule) {
			// New Gate Rules: Player cannot plant on Bonus if already controlling any Gates
			return this.board.playerHasNoGrowingFlowers(player);
		} else if (newGatesRule) {
			// New Gate Rules: Player cannot plant on Bonus if already controlling two Gates
			return this.board.playerControlsLessThanTwoGates(player);
		}
	}

	revealSpecialFlowerPlacementPoints(player, tile) {
		if (!newSpecialFlowerRules) {
			this.revealOpenGates(player, tile);
			return;
		}

		this.board.revealSpecialFlowerPlacementPoints(player);
		this.actuate();
	}

	revealPossiblePlacementPoints(tile) {
		this.board.revealPossiblePlacementPoints(tile);
		this.actuate();
	}

	revealBoatBonusPoints(boardPoint) {
		this.board.revealBoatBonusPoints(boardPoint);
		this.actuate();
	}

	aPlayerIsOutOfBasicFlowerTiles() {
		return this.tileManager.aPlayerIsOutOfBasicFlowerTiles();
	}

	playerHasNotPlayedEitherSpecialTile(playerName) {
		return this.tileManager.playerHasBothSpecialTilesRemaining(playerName);
	}

	getWinner() {
		if (this.board.winners.length === 1) {
			return this.board.winners[0];
		} else if (this.board.winners.length > 1) {
			return "BOTH players";
		} else if (this.endGameWinners.length === 1) {
			return this.endGameWinners[0];
		} else if (this.endGameWinners.length > 1 || this.board.winners.length > 1) {
			return "BOTH players";
		}
	}

	getWinReason() {
		if (this.board.winners.length === 1) {
			return " created a Harmony Ring and won the game!";
		} else if (this.endGameWinners.length === 1) {
			return " won the game with the most Harmonies crossing the midlines.";
		} else if (this.board.winners.length === 2) {
			return " formed Harmony Rings for a tie!";
		} else if (this.endGameWinners.length === 2) {
			return " had the same number of Harmonies crossing the midlines for a tie!";	// Should there be any other tie breaker?
		}
	}

	getWinResultTypeCode() {
		if (this.board.winners.length === 1) {
			return 1;	// Harmony Ring is 1
		} else if (this.endGameWinners.length === 1) {
			return 3;	// Most Harmonies crossing midline
		} else if (this.endGameWinners.length > 1 || this.board.winners.length > 1) {
			return 4;	// Tie
		}
	}

	getCopy() {
		const copyGame = new SkudPaiShoGameManager(this.actuator, true, true);
		copyGame.board = this.board.getCopy();
		copyGame.tileManager = this.tileManager.getCopy();
		copyGame.lastPlayerName = this.lastPlayerName;
		copyGame.lastMoveNum = this.lastMoveNum;
		return copyGame;
	}

	getNextPlayerName() {
		if (this.lastPlayerName === HOST) {
			return GUEST;
		} else {
			return HOST;
		}
	}
}
