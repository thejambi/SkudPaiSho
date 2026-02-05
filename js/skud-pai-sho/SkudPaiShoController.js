/* Skud Pai Sho specific UI interaction logic */

import {
	ACCENT_TILE,
	BASIC_FLOWER,
	SPECIAL_FLOWER,
	dateIsAprilFools,
	debug,
} from '../GameData';
import {
	boatOnlyMoves,
	limitedGatesRule,
	lotusNoCapture,
	newKnotweedRules,
	rocksUnwheelable,
	simpleCanonRules,
	simpleRocks,
	simpleSpecialFlowerRule,
	simplest,
	specialFlowerLimitedRule,
} from './SkudPaiShoRules';
import {
	ARRANGING,
	GUEST,
	HOST,
	NotationPoint,
	PLANTING,
} from '../CommonNotationObjects';
import {
	BRAND_NEW,
	GameType,
	MOVE_DONE,
	READY_FOR_BONUS,
	WAITING_FOR_BOAT_BONUS_POINT,
	WAITING_FOR_BONUS_ENDPOINT,
	WAITING_FOR_ENDPOINT,
	activeAi,
	activeAi2,
	buildDropdownDiv,
	callSubmitMove,
	clearMessage,
	closeModal,
	createGameIfThatIsOk,
	currentMoveIndex,
	finalizeMove,
	gameId,
	getCurrentPlayer,
	getGameOptionsMessageElement,
	getGatePointMessage,
	getNeutralPointMessage,
	getRedPointMessage,
	getRedWhitePointMessage,
	getResetMoveElement,
	getUserGamePreference,
	getWhitePointMessage,
	isAnimationsOn,
	myTurn,
	onlinePlayEnabled,
	playingOnlineGame,
	rerunAll,
	setSkudTilesOption,
	setUserGamePreference,
	showModalElem,
	showResetMoveMessage,
	skudTilesKey,
	tileDesignTypeKey,
	tileDesignTypeValues,
	toBullets,
	userIsLoggedIn
} from '../PaiShoMain';
import {
	DIAGONAL_MOVEMENT,
	EVERYTHING_CAPTURE,
	NO_HARMONY_VISUAL_AIDS,
	NO_WHEELS,
	OPTION_ALL_ACCENT_TILES,
	OPTION_ANCIENT_OASIS_EXPANSION,
	OPTION_DOUBLE_ACCENT_TILES,
	OPTION_INFORMAL_START,
	gameOptionEnabled,
} from '../GameOptions';
import { GATE, NEUTRAL, POSSIBLE_MOVE } from './SkudPaiShoBoardPoint';
import { MCTS } from '../ai/MCTS';
import { RED, SkudPaiShoTile, WHITE } from './SkudPaiShoTile';
import { SkudAIv1 } from '../ai/SkudAIv1';
import { SkudStrategicAI } from '../ai/SkudStrategicAI';
import { SkudMctsGame } from './SkudMctsGame';
import { SkudPaiShoActuator } from './SkudPaiShoActuator';
import { SkudPaiShoGameManager } from './SkudPaiShoGameManager';
import {
	SkudPaiShoGameNotation,
	SkudPaiShoNotationBuilder,
	SkudPaiShoNotationMove,
} from './SkudPaiShoGameNotation';

export var SkudConstants = {
	preferencesKey: "SkudPaiShoPreferencesKey"
}
export var SkudPreferences = {
	customTilesUrl: ""
}

export class SkudPaiShoController {
	constructor(gameContainer, isMobile) {
		this.actuator = new SkudPaiShoActuator(gameContainer, isMobile, isAnimationsOn());

		SkudPaiShoController.loadPreferences();

		this.resetGameManager();
		this.resetNotationBuilder();
		this.resetGameNotation();

		this.hostAccentTiles = [];
		this.guestAccentTiles = [];

		this.isPaiShoGame = true;
		this.supportsMoveLogMessages = true;
	}

	static hideHarmonyAidsKey = "HideHarmonyAids";

	static loadPreferences() {
		const savedPreferences = JSON.parse(localStorage.getItem(SkudConstants.preferencesKey));
		if (savedPreferences) {
			SkudPreferences = savedPreferences;
		}
	}

	getGameTypeId() {
		return GameType.SkudPaiSho.id;
	}

	resetGameManager() {
		this.theGame = new SkudPaiShoGameManager(this.actuator);

		const vgame = new SkudMctsGame(GUEST);
		let iterations = 10; //more iterations -> stronger AI, more computation
		let exploration = 0.55; //1.41 //exploration vs. explotation parameter, sqrt(2) is reasonable default (c constant in UBC forumula)
		const mcts = new MCTS(vgame, GUEST, iterations, exploration);

		this.mctsGame = {
			game: vgame,
			mcts: mcts
		};
	}

	resetNotationBuilder() {
		this.notationBuilder = new SkudPaiShoNotationBuilder();	// Will be ... SkudPaiShoNotationBuilder
	}

	resetGameNotation() {
		this.gameNotation = this.getNewGameNotation();
	}

	getNewGameNotation() {
		return new SkudPaiShoGameNotation();
	}

	static getHostTilesContainerDivs = () => {
		const container = document.createElement('div');

		// Basic flower tiles
		['HR3', 'HR4', 'HR5', 'HW3', 'HW4', 'HW5'].forEach(className => {
			const div = document.createElement('div');
			div.className = className;
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr = document.createElement('br');
		clearBr.className = 'clear';
		container.appendChild(clearBr);
		container.appendChild(document.createTextNode(' '));

		// Accent and special tiles
		['HR', 'HW', 'HK', 'HB', 'HL', 'HO'].forEach(className => {
			const div = document.createElement('div');
			div.className = className;
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		// Ancient Oasis expansion tiles
		if (gameOptionEnabled(OPTION_ANCIENT_OASIS_EXPANSION)) {
			const clearBr2 = document.createElement('br');
			clearBr2.className = 'clear';
			container.appendChild(clearBr2);
			container.appendChild(document.createTextNode(' '));

			['HM', 'HP', 'HT'].forEach(className => {
				const div = document.createElement('div');
				div.className = className;
				container.appendChild(div);
				container.appendChild(document.createTextNode(' '));
			});
		}

		return container.innerHTML;
	}

	static getGuestTilesContainerDivs = () => {
		const container = document.createElement('div');

		// Basic flower tiles
		['GR3', 'GR4', 'GR5', 'GW3', 'GW4', 'GW5'].forEach(className => {
			const div = document.createElement('div');
			div.className = className;
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr = document.createElement('br');
		clearBr.className = 'clear';
		container.appendChild(clearBr);
		container.appendChild(document.createTextNode(' '));

		// Accent and special tiles
		['GR', 'GW', 'GK', 'GB', 'GL', 'GO'].forEach(className => {
			const div = document.createElement('div');
			div.className = className;
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		// Ancient Oasis expansion tiles
		if (gameOptionEnabled(OPTION_ANCIENT_OASIS_EXPANSION)) {
			const clearBr2 = document.createElement('br');
			clearBr2.className = 'clear';
			container.appendChild(clearBr2);
			container.appendChild(document.createTextNode(' '));

			['GM', 'GP', 'GT'].forEach(className => {
				const div = document.createElement('div');
				div.className = className;
				container.appendChild(div);
				container.appendChild(document.createTextNode(' '));
			});
		}

		return container.innerHTML;
	}

	callActuate() {
		this.theGame.actuate();
	}

	resetMove() {
		if (this.notationBuilder.status === BRAND_NEW) {
			// Remove last move
			this.gameNotation.removeLastMove();
			if (this.gameNotation.moves.length === 3) {
				this.gameNotation.removeLastMove();	// Special case for automatic Host first move
			}
		} else if (this.notationBuilder.status === READY_FOR_BONUS) {
			// Just rerun
		}

		if (this.gameNotation.moves.length <= 1) {
			// Choosing Accent Tiles
			if (getCurrentPlayer() === GUEST) {
				this.guestAccentTiles = [];
			} else if (getCurrentPlayer() === HOST) {
				this.hostAccentTiles = [];
			}
		}
	}

	getDefaultHelpMessageText() {
		return "<h4>Skud Pai Sho</h4> <p>Skud Pai Sho is a game of harmony. The goal is to arrange your Flower Tiles to create a ring of Harmonies that surrounds the center of the board.</p> <p>Harmonies are created when two of a player's harmonious tiles are on the same line with nothing in between them. But be careful; tiles that clash can never be lined up on the board.</p> <p>Select tiles or points on the board to learn more, and read through the <a href='https://skudpaisho.com/site/games/skud-pai-sho/' target='_blank'>rules page</a> for the full rules.</p>";
	}

	getAdditionalMessage() {
		const msgElement = document.createElement("span");

		if (this.gameNotation.moves.length === 0) {
			if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
				const onlineText = document.createElement("span");
				if (gameOptionEnabled(OPTION_ALL_ACCENT_TILES)) {
					onlineText.textContent = "Click Join Game above to join another player's game. Or, you can start a game that other players can join by selecting ALL of your Accent Tiles.";
				} else if (gameOptionEnabled(OPTION_DOUBLE_ACCENT_TILES)) {
					onlineText.textContent = "Click Join Game above to join another player's game. Or, you can start a game that other players can join by selecting 8 of your Accent Tiles.";
				} else {
					onlineText.textContent = "Click Join Game above to join another player's game. Or, you can start a game that other players can join by selecting your 4 Accent Tiles.";
				}
				msgElement.appendChild(onlineText);
			} else {
				const startText = document.createElement("span");
				if (gameOptionEnabled(OPTION_ALL_ACCENT_TILES)) {
					startText.textContent = "Select ALL Accent Tiles to begin the game.";
				} else if (gameOptionEnabled(OPTION_DOUBLE_ACCENT_TILES)) {
					startText.textContent = "Select 8 Accent Tiles to play with.";
				} else {
					startText.textContent = "Select 4 Accent Tiles to play with.";
				}
				msgElement.appendChild(startText);
			}

			if (!playingOnlineGame()) {
				if (dateIsAprilFools()) {
					const aprilFoolsDiv = document.createElement("div");
					const brBefore = document.createElement("br");
					const brAfter = document.createElement("br");
					const aprilText = document.createElement("strong");
					aprilText.textContent = "Try the Diagonal Movement and Everything Captures Everything game options, it's more fun!";
					const brInMiddle = document.createElement("br");
					const img = document.createElement("img");
					img.src = "https://skudpaisho.com/images/aprilfools/irohwink.png";
					img.width = 160;
					aprilFoolsDiv.appendChild(brBefore);
					aprilFoolsDiv.appendChild(brAfter);
					aprilFoolsDiv.appendChild(aprilText);
					aprilFoolsDiv.appendChild(brInMiddle);
					aprilFoolsDiv.appendChild(img);
					msgElement.appendChild(aprilFoolsDiv);
				}
				msgElement.appendChild(getGameOptionsMessageElement(GameType.SkudPaiSho.gameOptions));
			}
		} else if (this.gameNotation.moves.length === 1) {
			const move1Text = document.createElement("span");
			if (gameOptionEnabled(OPTION_ALL_ACCENT_TILES)) {
				move1Text.textContent = "Select ALL Accent Tiles to play with, then Plant a Basic Flower Tile.";
			} else if (gameOptionEnabled(OPTION_DOUBLE_ACCENT_TILES)) {
				move1Text.textContent = "Select 8 Accent Tiles to play with, then Plant a Basic Flower Tile.";
			} else {
				move1Text.textContent = "Select 4 Accent Tiles to play with, then Plant a Basic Flower Tile.";
			}
			msgElement.appendChild(move1Text);
		} else if (this.gameNotation.moves.length === 2) {
			const move2Text = document.createElement("span");
			move2Text.textContent = "Plant a Basic Flower Tile.";
			msgElement.appendChild(move2Text);
		} else if (!gameOptionEnabled(OPTION_INFORMAL_START) && this.gameNotation.moves.length === 4) {
			const move4Text = document.createElement("span");
			move4Text.textContent = "Now, make the first move of the game.";
			msgElement.appendChild(move4Text);
		} else if (this.gameNotation.moves.length > 2
			&& (gameOptionEnabled(DIAGONAL_MOVEMENT) || gameOptionEnabled(EVERYTHING_CAPTURE))) {
			const aprilFoolsText = document.createElement("em");
			aprilFoolsText.textContent = "April Fools! I hope you get some entertainment out of the Diagonal Movement and Everything Captures Everything game options today :)\u00A0";
			msgElement.appendChild(aprilFoolsText);
		}

		return msgElement;
	}


	/* SkudPaiShoController.prototype.getAdditionalMessageElement = function() {
		const msgElement = document.createElement("span");
		msgElement.innerText = "Play MCTS move";
		msgElement.addEventListener('click', () => {
			this.playMctsMove();
		});
		return msgElement;
	}; */

	async playMctsMove() {
		showModalElem('AI Move Loading', document.createTextNode('AI move loading...'), true);
		setTimeout(() => {
			const move = this.mctsGame.mcts.selectMove();
			if (!move) {
				showModalElem('AI Move', document.createTextNode("No AI move found :("));
				return;
			}
			this.gameNotation.addMove(move);
			finalizeMove();
			closeModal();
		}, 50);
	}

	getExtraHarmonyBonusHelpText() {
		const container = document.createElement("span");
		container.appendChild(document.createElement("br"));

		const text = document.createElement("span");
		if (!limitedGatesRule) {
			if (this.theGame.playerCanBonusPlant(getCurrentPlayer())) {
				text.textContent = "You can choose an Accent Tile, Special Flower Tile, or, since you have less than two Growing Flowers, a Basic Flower Tile.";
			} else {
				text.textContent = "You can choose an Accent Tile or a Special Flower Tile. You cannot choose a Basic Flower Tile because you have two or more Growing Flowers.";
			}
		} else {
			if (this.theGame.playerCanBonusPlant(getCurrentPlayer())) {
				text.textContent = "You can choose an Accent Tile or, since you have no Growing Flowers, a Basic or Special Flower Tile.";
			} else {
				text.textContent = "You can choose an Accent Tile or a Special Flower Tile. You cannot choose a Basic Flower Tile because you have at least one Growing Flower.";
			}
		}
		container.appendChild(text);
		return container;
	}

	showHarmonyBonusMessage() {
		const messageDiv = document.createElement("span");

		// Create the main message text
		const mainMessage = document.createElement("span");
		mainMessage.textContent = "Harmony Bonus! Select a tile to play or ";

		// Create the skip link
		const skipSpan = document.createElement("span");
		skipSpan.className = "skipBonus";
		skipSpan.textContent = "skip";
		skipSpan.onclick = () => this.skipHarmonyBonus(); mainMessage.appendChild(skipSpan);
		mainMessage.appendChild(document.createTextNode("."));

		messageDiv.appendChild(mainMessage);
		messageDiv.appendChild(document.createElement("br"));

		// Add the extra help text
		messageDiv.appendChild(this.getExtraHarmonyBonusHelpText());

		// Add the reset move element
		messageDiv.appendChild(getResetMoveElement());

		// Set it in the game message container
		document.querySelector(".gameMessage").innerHTML = "";
		document.querySelector(".gameMessage").appendChild(messageDiv);
	}

	unplayedTileClicked(tileDiv) {
		this.theGame.markingManager.clearMarkings();
		this.callActuate();

		if (this.theGame.getWinner() && this.notationBuilder.status !== READY_FOR_BONUS) {
			return;
		}
		if (!myTurn()) {
			return;
		}
		if (currentMoveIndex !== this.gameNotation.moves.length) {
			debug("Can only interact if all moves are played.");
			return;
		}

		const divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
		const tileId = parseInt(tileDiv.getAttribute("id"));
		const playerCode = divName.charAt(0);
		const tileCode = divName.substring(1);

		let player = GUEST;
		if (playerCode === 'H') {
			player = HOST;
		}

		const tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

		if (tile.ownerName !== getCurrentPlayer()) {
			// debug("That's not your tile!");
			return;
		}

		if (this.gameNotation.moves.length <= 1) {
			// Choosing Accent Tiles
			if (tile.type !== ACCENT_TILE) {
				return;
			}

			if (!tile.selectedFromPile) {
				tile.selectedFromPile = true;
				let removeTileCodeFrom = this.hostAccentTiles;
				if (getCurrentPlayer() === GUEST) {
					removeTileCodeFrom = this.guestAccentTiles;
				}

				removeTileCodeFrom.splice(removeTileCodeFrom.indexOf(tileCode), 1);

				this.theGame.actuate();
				return;
			}

			tile.selectedFromPile = false;

			let accentTilesNeededToStart = 4;
			if (gameOptionEnabled(OPTION_ALL_ACCENT_TILES)) {
				accentTilesNeededToStart = this.theGame.tileManager.numberOfAccentTilesPerPlayerSet();
			} else if (gameOptionEnabled(OPTION_DOUBLE_ACCENT_TILES)) {
				accentTilesNeededToStart = accentTilesNeededToStart * 2;
				if (gameOptionEnabled(NO_WHEELS) && !gameOptionEnabled(OPTION_ANCIENT_OASIS_EXPANSION)) {
					accentTilesNeededToStart = accentTilesNeededToStart - 2;
				}
			}

			if (getCurrentPlayer() === HOST) {
				this.hostAccentTiles.push(tileCode);

				if (this.hostAccentTiles.length === accentTilesNeededToStart || (simpleCanonRules && this.hostAccentTiles.length === 2)) {
					const move = new SkudPaiShoNotationMove("0H." + this.hostAccentTiles.join());
					this.gameNotation.addMove(move);
					if (onlinePlayEnabled) {
						createGameIfThatIsOk(GameType.SkudPaiSho.id);
					} else {
						finalizeMove();
					}
				}
			} else {
				this.guestAccentTiles.push(tileCode);

				if (this.guestAccentTiles.length === accentTilesNeededToStart || (simpleCanonRules && this.guestAccentTiles.length === 2)) {
					const move = new SkudPaiShoNotationMove("0G." + this.guestAccentTiles.join());
					this.gameNotation.addMove(move);
					// No finalize move because it is still Guest's turn
					rerunAll();
					showResetMoveMessage();
				}
			}
			this.theGame.actuate();
		} else if (this.notationBuilder.status === BRAND_NEW) {
			// new Planting turn, can be basic flower
			if (tile.type !== BASIC_FLOWER) {
				debug("Can only Plant a Basic Flower tile. That's not one of them.");
				return false;
			}

			tile.selectedFromPile = true;

			this.notationBuilder.moveType = PLANTING;
			this.notationBuilder.plantedFlowerType = tileCode;
			this.notationBuilder.status = WAITING_FOR_ENDPOINT;

			this.theGame.revealOpenGates(getCurrentPlayer(), tile, this.gameNotation.moves.length);
		} else if (this.notationBuilder.status === READY_FOR_BONUS) {
			if (simpleSpecialFlowerRule && tile.type === SPECIAL_FLOWER) {
				// Other special tile still needs to be in that player's tile pile
				if (!this.theGame.playerHasNotPlayedEitherSpecialTile(tile.ownerName)) {
					return false;
				}
			}

			tile.selectedFromPile = true;
			// Bonus Plant! Can be any tile
			this.notationBuilder.bonusTileCode = tileCode;
			this.notationBuilder.status = WAITING_FOR_BONUS_ENDPOINT;

			if (tile.type === BASIC_FLOWER && this.theGame.playerCanBonusPlant(getCurrentPlayer())) {
				this.theGame.revealOpenGates(getCurrentPlayer(), tile);
			} else if (tile.type === ACCENT_TILE) {
				this.theGame.revealPossiblePlacementPoints(tile);
			} else if (tile.type === SPECIAL_FLOWER) {
				if (!specialFlowerLimitedRule
					|| (specialFlowerLimitedRule && this.theGame.playerCanBonusPlant(getCurrentPlayer()))) {
					this.theGame.revealSpecialFlowerPlacementPoints(getCurrentPlayer(), tile);
				}
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			if (this.notationBuilder.status === WAITING_FOR_BONUS_ENDPOINT
				|| this.notationBuilder.status === WAITING_FOR_BOAT_BONUS_POINT) {
				this.notationBuilder.status = READY_FOR_BONUS;
				this.showHarmonyBonusMessage();
			} else {
				this.notationBuilder = new SkudPaiShoNotationBuilder();
			}
		}
	}


	RmbDown(htmlPoint) {
		const npText = htmlPoint.getAttribute("name");

		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
	}

	RmbUp(htmlPoint) {
		const npText = htmlPoint.getAttribute("name");

		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		const mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (mouseEndPoint == this.mouseStartPoint) {
			this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint);
		}
		else if (this.mouseStartPoint) {
			this.theGame.markingManager.toggleMarkedArrow(this.mouseStartPoint, mouseEndPoint);
		}
		this.mouseStartPoint = null;

		this.callActuate();
	}

	pointClicked(htmlPoint) {
		this.theGame.markingManager.clearMarkings();
		this.callActuate();

		if (this.theGame.getWinner() && this.notationBuilder.status !== WAITING_FOR_BONUS_ENDPOINT
			&& this.notationBuilder.status !== WAITING_FOR_BOAT_BONUS_POINT) {
			return;
		}
		if (!myTurn()) {
			return;
		}
		if (currentMoveIndex !== this.gameNotation.moves.length) {
			debug("Can only interact if all moves are played.");
			return;
		}

		const npText = htmlPoint.getAttribute("name");

		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		const boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (this.notationBuilder.status === BRAND_NEW) {
			if (boardPoint.hasTile()) {
				if (boardPoint.tile.ownerName !== getCurrentPlayer()) {
					debug("That's not your tile!");
					return;
				}

				if (boardPoint.tile.type === ACCENT_TILE) {
					return;
				}

				if (boardPoint.tile.trapped) {
					return;
				}

				if (!newKnotweedRules && boardPoint.tile.trapped) {
					return;
				}

				this.notationBuilder.status = WAITING_FOR_ENDPOINT;
				this.notationBuilder.moveType = ARRANGING;
				this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				this.theGame.revealPossibleMovePoints(boardPoint);
			}
		} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				// They're trying to move there! And they can! Exciting!
				// Need the notation!
				this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
				this.theGame.hidePossibleMovePoints(false, move);
				const bonusAllowed = this.theGame.runNotationMove(move);

				if (!gameOptionEnabled(OPTION_INFORMAL_START) && this.gameNotation.moves.length === 2) {
					// Host auto-copies Guest's first Plant
					this.gameNotation.addMove(move);
					const hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.notationBuilder.plantedFlowerType);
					this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
					rerunAll(true);
					// No finalize move because it's still Guest's turn
					showResetMoveMessage();
				} else if (!bonusAllowed) {
					// Move all set. Add it to the notation!
					this.gameNotation.addMove(move);
					if (playingOnlineGame()) {
						callSubmitMove(null, null, move);
					} else {
						finalizeMove();
					}
				} else {
					this.notationBuilder.status = READY_FOR_BONUS;
					this.showHarmonyBonusMessage();
				}
			} else {
				this.theGame.hidePossibleMovePoints();
				this.notationBuilder = new SkudPaiShoNotationBuilder();
			}
		} else if (this.notationBuilder.status === WAITING_FOR_BONUS_ENDPOINT) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {

				this.theGame.hidePossibleMovePoints();
				this.notationBuilder.bonusEndPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				// If we're placing a boat, and boardPoint is a flower...
				if (this.notationBuilder.bonusTileCode.endsWith("B") && (boatOnlyMoves || boardPoint.tile.type !== ACCENT_TILE)) {
					// Boat played on flower, need to pick flower endpoint
					this.notationBuilder.status = WAITING_FOR_BOAT_BONUS_POINT;
					this.theGame.revealBoatBonusPoints(boardPoint);
				} else {
					const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);

					this.gameNotation.addMove(move);
					if (playingOnlineGame()) {
						callSubmitMove(1, null, move);
					} else {
						finalizeMove(1);
					}
				}
			} else {
				this.theGame.hidePossibleMovePoints();
				this.notationBuilder.status = READY_FOR_BONUS;
			}
		} else if (this.notationBuilder.status === WAITING_FOR_BOAT_BONUS_POINT) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {

				this.notationBuilder.status = MOVE_DONE;

				this.theGame.hidePossibleMovePoints();
				this.notationBuilder.boatBonusPoint = new NotationPoint(htmlPoint.getAttribute("name"));
				const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
				this.gameNotation.addMove(move);
				if (playingOnlineGame()) {
					callSubmitMove(1, null, move);
				} else {
					finalizeMove(1);
				}
			} else {
				this.theGame.hidePossibleMovePoints();
				this.notationBuilder.status = READY_FOR_BONUS;
			}
		}
	}

	skipHarmonyBonus() {
		if (this.notationBuilder.status !== MOVE_DONE) {
			this.notationBuilder.status = MOVE_DONE;
			this.notationBuilder.bonusEndPoint = null;
			const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.gameNotation.addMove(move);
			if (playingOnlineGame()) {
				callSubmitMove(1, null, move);
			} else {
				finalizeMove(1);
			}
		}
	}

	getTileMessage(tileDiv) {
		const divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
		const tileId = parseInt(tileDiv.getAttribute("id"));

		const tile = new SkudPaiShoTile(divName.substring(1), divName.charAt(0));

		const tileMessage = this.getHelpMessageForTile(tile);

		return {
			heading: tileMessage.heading,
			message: tileMessage.message
		}
	}

	getPointMessage(htmlPoint) {
		const npText = htmlPoint.getAttribute("name");

		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		const boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		let heading;
		const message = [];
		if (boardPoint.hasTile()) {
			const tileMessage = this.getHelpMessageForTile(boardPoint.tile);
			tileMessage.message.forEach(function(messageString) {
				message.push(messageString);
			});
			heading = tileMessage.heading;
			// Specific tile message
			/**
			Rose
			* In Harmony with Chrysanthemum to the north
			* Trapped by Orchid
			*/
			const tileHarmonies = this.theGame.board.harmonyManager.getHarmoniesWithThisTile(boardPoint.tile);
			if (tileHarmonies.length > 0) {
				const bullets = [];
				tileHarmonies.forEach(function(harmony) {
					const otherTile = harmony.getTileThatIsNotThisOne(boardPoint.tile);
					bullets.push(otherTile.getName()
						+ " to the " + harmony.getDirectionForTile(boardPoint.tile));
				});
				message.push("<strong>Currently in Harmony with: </strong>" + toBullets(bullets));
			}

			// Drained? Trapped? Anything else?
			if (boardPoint.tile.drained) {
				message.push("Currently <em>drained</em> by a Knotweed.");
			}
			if (boardPoint.tile.trapped) {
				message.push("Currently <em>trapped</em> by an Orchid.")
			}
		}

		if (boardPoint.isType(NEUTRAL)) {
			message.push(getNeutralPointMessage());
		} else if (boardPoint.isType(RED) && boardPoint.isType(WHITE)) {
			message.push(getRedWhitePointMessage());
		} else if (boardPoint.isType(RED)) {
			message.push(getRedPointMessage());
		} else if (boardPoint.isType(WHITE)) {
			message.push(getWhitePointMessage());
		} else if (boardPoint.isType(GATE)) {
			message.push(getGatePointMessage());
		}

		return {
			heading: heading,
			message: message
		}
	}

	getHelpMessageForTile(tile) {
		const message = [];

		const tileCode = tile.code;

		let heading = SkudPaiShoTile.getTileName(tileCode);

		message.push(tile.ownerName + "'s tile");

		if (tileCode.length > 1) {
			const colorCode = tileCode.charAt(0);
			const tileNum = parseInt(tileCode.charAt(1));

			let harmTileNum = tileNum - 1;
			let harmTileColor = colorCode;
			if (harmTileNum < 3) {
				harmTileNum = 5;
				if (colorCode === 'R') {
					harmTileColor = 'W';
				} else {
					harmTileColor = 'R';
				}
			}

			const harmTile1 = SkudPaiShoTile.getTileName(harmTileColor + harmTileNum);

			harmTileNum = tileNum + 1;
			harmTileColor = colorCode;
			if (harmTileNum > 5) {
				harmTileNum = 3;
				if (colorCode === 'R') {
					harmTileColor = 'W';
				} else {
					harmTileColor = 'R';
				}
			}

			const harmTile2 = SkudPaiShoTile.getTileName(harmTileColor + harmTileNum);

			harmTileNum = tileNum;
			if (colorCode === 'R') {
				harmTileColor = 'W';
			} else {
				harmTileColor = 'R';
			}
			const clashTile = SkudPaiShoTile.getTileName(harmTileColor + harmTileNum);

			message.push("Basic Flower Tile");
			message.push("Can move up to " + tileNum + " spaces");
			message.push("Forms Harmony with " + harmTile1 + " and " + harmTile2);
			message.push("Clashes with " + clashTile);
		} else {
			if (tileCode === 'R') {
				heading = "Accent Tile: Rock";
				if (simplest) {
					message.push("The Rock disrupts Harmonies and cannot be moved by a Wheel.");
				} else if (rocksUnwheelable) {
					if (simpleRocks) {
						message.push("The Rock blocks Harmonies and cannot be moved by a Wheel.");
					} else {
						message.push("The Rock cancels Harmonies on horizontal and vertical lines it lies on. A Rock cannot be moved by a Wheel.");
					}
				} else {
					message.push("The Rock cancels Harmonies on horizontal and vertical lines it lies on.");
				}
			} else if (tileCode === 'W') {
				heading = "Accent Tile: Wheel";
				if (rocksUnwheelable || simplest) {
					message.push("The Wheel rotates all surrounding tiles one space clockwise but cannot move a Rock (cannot move tiles off the board or onto or off of a Gate).");
				} else {
					message.push("The Wheel rotates all surrounding tiles one space clockwise (cannot move tiles off the board or onto or off of a Gate).");
				}
			} else if (tileCode === 'K') {
				heading = "Accent Tile: Knotweed";
				if (newKnotweedRules) {
					message.push("The Knotweed drains surrounding Flower Tiles so they are unable to form Harmony.");
				} else {
					message.push("The Knotweed drains surrounding Basic Flower Tiles so they are unable to move or form Harmony.");
				}
			} else if (tileCode === 'B') {
				heading = "Accent Tile: Boat";
				if (simplest || rocksUnwheelable) {
					message.push("The Boat moves a Flower Tile to a surrounding space or removes an Accent tile.");
					// } else if (rocksUnwheelable) {
					// 	message.push("The Boat moves a Flower Tile to a surrounding space or removes a Rock or Knotweed tile.");
				} else {
					message.push("The Boat moves a Flower Tile to a surrounding space or removes a Knotweed tile.");
				}
			} else if (tileCode === 'L') {
				heading = "Special Flower: White Lotus";
				message.push("Can move up to 2 spaces");
				message.push("Forms Harmony with all Basic Flower Tiles of either player");
				if (!lotusNoCapture && !simplest) {
					message.push("Can be captured by any Flower Tile");
				}
			} else if (tileCode === 'O') {
				heading = "Special Flower: Orchid";
				message.push("Can move up to 6 spaces");
				message.push("Traps opponent's surrounding Blooming Flower Tiles so they cannot move");
				if (!simplest) {
					message.push("Can capture Flower Tiles if you have a Blooming White Lotus");
				}
				if (lotusNoCapture || simplest) {
					message.push("Can be captured by any Flower Tile if you have a Blooming White Lotus");
				} else {
					message.push("Can be captured by any Basic Flower Tile if your White Lotus has been played");
				}
			} else if (tileCode === 'M') {
				heading = "Accent Tile: Bamboo";
				// message.push("<em>--- Ancient Oasis Expansion rules subject to change ---</em>")
				// message.push("When played, return each surrounding tile to owner's hand");
				message.push("If played on a point surrounding a Blooming Flower Tile belonging to the owner (but not surrounding a tile in a Gate), return each surrounding tile to owner's hand when played.");
				message.push("Tiles surrounding Bamboo cannot be captured");
			} else if (tileCode === 'P') {
				heading = "Accent Tile: Pond";
				// message.push("<em>--- Ancient Oasis Expansion rules subject to change ---</em>")
				message.push("Flower Tiles may be Planted on points surrounding a Pond");
				message.push("(Tiles are Blooming after being Planted)");
			} else if (tileCode === 'T') {
				heading = "Accent Tile: Lion Turtle";
				// message.push("<em>--- Ancient Oasis Expansion rules subject to change ---</em>")
				message.push("Flower tiles surrounding a Lion Turtle form Harmony with all Basic Flower Tiles of either player");
				message.push("The owner of the Lion Turtle owns the Harmonies that include both players' tiles");
				message.push("(Overlap with other Lion Turtle tiles can combine this effect, so Harmonies can potentially belong to both players)");
			}
		}

		return {
			heading: heading,
			message: message
		}
	}

	playAiTurn(finalizeMove) {
		if (this.theGame.getWinner()) {
			return;
		}
		let theAi = activeAi;
		if (activeAi2) {
			if (activeAi2.player === getCurrentPlayer()) {
				theAi = activeAi2;
			}
		}

		const playerMoveNum = this.gameNotation.getPlayerMoveNum();

		if (playerMoveNum === 1 && getCurrentPlayer() === HOST) {
			// Auto mirror guest move
			// Host auto-copies Guest's first Plant
			const hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.gameNotation.moves[this.gameNotation.moves.length - 1].plantedFlowerType);
			this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
			finalizeMove();
		} else if (playerMoveNum < 3) {
			const move = theAi.getMove(this.theGame.getCopy(), playerMoveNum);
			if (!move) {
				debug("No move given...");
				return;
			}
			this.gameNotation.addMove(move);
			finalizeMove();
		} else {
			const self = this;
			setTimeout(function() {
				const move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);
				if (!move) {
					debug("No move given...");
					return;
				}
				self.gameNotation.addMove(move);
				finalizeMove();
			}, 10);
		}
	}

	startAiGame(finalizeMove) {
		this.playAiTurn(finalizeMove);
		if (this.gameNotation.getPlayerMoveNum() === 1) {
			this.playAiTurn(finalizeMove);
		}
		if (this.gameNotation.getPlayerMoveNum() === 1) {
			// Host auto-copies Guest's first Plant
			const hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.gameNotation.moves[this.gameNotation.moves.length - 1].plantedFlowerType);
			this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
			finalizeMove();
		}
		if (this.gameNotation.getPlayerMoveNum() === 2 && getCurrentPlayer() === GUEST) {
			this.playAiTurn(finalizeMove);
		}
	}

	getAiList() {
		return [
			// new SkudStrategicAI(), 
			new SkudAIv1()
		];
	}

	getCurrentPlayer() {
		if (this.gameNotation.moves.length <= 1) {
			if (this.gameNotation.moves.length === 0) {
				return HOST;
			} else {
				return GUEST;
			}
		}
		if (this.gameNotation.moves.length <= 2) {
			return GUEST;
		}
		const lastPlayer = this.gameNotation.moves[this.gameNotation.moves.length - 1].player;

		if (lastPlayer === HOST) {
			return GUEST;
		} else if (lastPlayer === GUEST) {
			return HOST;
		}
	}

	runMove(move, withActuate, moveAnimationBeginStep, skipAnimation) {
		this.theGame.runNotationMove(move, withActuate);

		if (this.mctsGame) {
			this.mctsGame.game.playMove(move);
		}
	}

	cleanup() {
		// Nothing.
	}

	isSolitaire() {
		return false;
	}

	setGameNotation(newGameNotation) {
		this.gameNotation.setNotationText(newGameNotation);
	}

	getAdditionalHelpTabDiv() {
		const settingsDiv = document.createElement("div");

		const heading = document.createElement("h4");
		heading.innerText = "Skud Pai Sho Preferences:";

		settingsDiv.appendChild(heading);
		settingsDiv.appendChild(SkudPaiShoController.buildTileDesignDropdownDiv());

		settingsDiv.appendChild(document.createElement("br"));

		settingsDiv.appendChild(this.buildToggleHarmonyAidsDiv());

		settingsDiv.appendChild(document.createElement("br"));
		return settingsDiv;
	}

	static buildTileDesignDropdownDiv = (alternateLabelText) => {
		const labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
		return buildDropdownDiv("skudPaiShoTileDesignDropdown", labelText + ":", tileDesignTypeValues,
			localStorage.getItem(tileDesignTypeKey),
			function() {
				setSkudTilesOption(this.value);
			});
	}

	buildToggleHarmonyAidsDiv() {
		const div = document.createElement("div");
		const onOrOff = getUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey) !== "true" ? "on" : "off";

		const textSpan = document.createElement("span");
		textSpan.textContent = "Harmony aids are " + onOrOff + ": ";
		div.appendChild(textSpan);

		const toggleSpan = document.createElement("span");
		toggleSpan.className = "skipBonus";
		toggleSpan.textContent = "toggle";
		toggleSpan.onclick = () => this.toggleHarmonyAids();
		div.appendChild(toggleSpan);

		if (gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)) {
			const warningSpan = document.createElement("span");
			warningSpan.textContent = " (Will not affect games with " + NO_HARMONY_VISUAL_AIDS + " game option)";
			div.appendChild(warningSpan);
		}

		return div;
	}

	toggleHarmonyAids() {
		setUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey,
			getUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey) !== "true");
		clearMessage();
		this.callActuate();
	}

	setAnimationsOn(isAnimationsOn) {
		this.actuator.setAnimationOn(isAnimationsOn);
	}

	static isUsingCustomTileDesigns = () => {
		return skudTilesKey === 'custom';
	}

	static getCustomTileDesignsUrl = () => {
		return SkudPreferences.customTilesUrl;
	}

	setCustomTileDesignUrl(url) {
		SkudPreferences.customTilesUrl = url;
		localStorage.setItem(SkudConstants.preferencesKey, JSON.stringify(SkudPreferences));
		setSkudTilesOption('custom', true);
	}
}
