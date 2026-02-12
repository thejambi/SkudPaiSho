/* Key Pai Sho specific UI interaction logic */

import {
  ACCENT_TILE,
  BASIC_FLOWER,
  SPECIAL_FLOWER,
  debug,
} from '../GameData';
import {
  boatOnlyMoves,
  limitedGatesRule,
  newKnotweedRules,
  simpleCanonRules,
  simpleSpecialFlowerRule,
  specialFlowerLimitedRule,
} from '../skud-pai-sho/SkudPaiShoRules';
import {
  ARRANGING,
  GUEST,
  HOST,
  NotationPoint,
  PLANTING,
} from '../CommonNotationObjects';
import { BRAND_NEW, MOVE_DONE, READY_FOR_BONUS, WAITING_FOR_BOAT_BONUS_POINT, WAITING_FOR_BONUS_ENDPOINT, WAITING_FOR_ENDPOINT } from '../GameConstants';
import { getResetMoveElement, showResetMoveMessage } from '../GameFlow';
import { GameType, activeAi, activeAi2, addOption, callSubmitMove, createGameIfThatIsOk, currentMoveIndex, finalizeMove, gameId, getCurrentPlayer, getGameOptionsMessageElement, isAnimationsOn, myTurn, onlinePlayEnabled, playingOnlineGame, rerunAll } from '../PaiShoMain';
import { clearMessage } from '../UiInteraction';
import { getUserGamePreference, setUserGamePreference } from '../GamePrefs';
import { userIsLoggedIn } from '../UserData';
import {
  GATE,
  NEUTRAL,
  POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { KeyPaiShoActuator } from './KeyPaiShoActuator';
import { KeyPaiShoGameManager } from './KeyPaiShoGameManager';
import { KeyPaiShoOptions } from './KeyPaiShoOptions';
import { KeyPaiShoTile } from './KeyPaiShoTile';
import {
  NO_EFFECT_TILES,
  NO_HARMONY_VISUAL_AIDS,
  gameOptionEnabled,
} from '../GameOptions';
import { RED, WHITE } from '../skud-pai-sho/SkudPaiShoTile';
import { KeyPaiShoGameNotation, 
  KeyPaiShoNotationBuilder,
  KeyPaiShoNotationMove
} from './KeyPaiShoGameNotation';

export class KeyPaiShoController {
	constructor(gameContainer, isMobile) {
		/* Default game option until Effect Tiles are implemented */
		addOption(NO_EFFECT_TILES);
		/* --- */
		new KeyPaiShoOptions(); // Initialize

		this.actuator = new KeyPaiShoActuator(gameContainer, isMobile, isAnimationsOn());

		// KeyPaiShoController.loadPreferences();
		this.resetGameManager();
		this.resetNotationBuilder();
		this.resetGameNotation();

		this.hostAccentTiles = [];
		this.guestAccentTiles = [];

		this.isPaiShoGame = true;
		this.supportsMoveLogMessages = true;
	}
	static getHostTilesContainerDivs() {
		var divs = '<div class="HR3"></div><div class="HW3"></div> <div class="HRO"></div><div class="HWO"></div> <div class="HRD"></div><div class="HWD"></div> <br class="clear" /> <div class="HR"></div> <div class="HW"></div> <div class="HK"></div> <div class="HB"></div> <div class="HLO"></div> <div class="HOR"></div>';
		return divs;
	}
	static getGuestTilesContainerDivs() {
		var divs = '<div class="GR3"></div><div class="GW3"></div> <div class="GRO"></div><div class="GWO"></div> <div class="GRD"></div><div class="GWD"></div> <br class="clear" /> <div class="GR"></div> <div class="GW"></div> <div class="GK"></div> <div class="GB"></div> <div class="GLO"></div> <div class="GOR"></div>';
		return divs;
	}
	static isUsingCustomTileDesigns() {
		return localStorage.getItem(KeyPaiShoOptions.tileDesignTypeKey) === "custom";
	}
	completeSetup() {
		/* Nothing to do */
	}
	getGameTypeId() {
		return GameType.KeyPaiSho.id;
	}
	resetGameManager() {
		this.theGame = new KeyPaiShoGameManager(this.actuator);
	}
	resetNotationBuilder() {
		this.notationBuilder = new KeyPaiShoNotationBuilder();
	}
	resetGameNotation() {
		this.gameNotation = this.getNewGameNotation();
	}
	getNewGameNotation() {
		return new KeyPaiShoGameNotation();
	}
	callActuate() {
		this.theGame.actuate();
	}
	resetMove() {
		if (this.notationBuilder.status === BRAND_NEW) {
			// Remove last move
			this.gameNotation.removeLastMove();
			if (this.gameNotation.moves.length === 3) {
				this.gameNotation.removeLastMove(); // Special case for automatic Host first move
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
		return "<h4>Key Pai Sho</h4>"
			+ "<p>This game is still being programmed, but can be played with the tiles currently available. Effect Tiles will be added periodically until the complete set is available. Thank you.</p>"
			+ "<p>Key Pai Sho is a game of harmony and skill. The aim is to form an unbroken chain of harmonies around the center of the board. Harmonies follow 4 important Rules:</p>"
			+ "<ul>"
			+ "<li>Formed if one Player's Key Flower can move to another of their Flowers' squares.</li>"
			+ "<li>Blocked by opposing Flower Tiles.</li>"
			+ "<li>Need at least one space in between the Flowers.</li>"
			+ "<li>Cannot form between Flowers of the same type.</li>"
			+ "</ul>"
			+ "<p>During a turn a player can either Plant a Flower in a Gate or Move one of their Tiles. A player can have up to 2 Planted Flowers at once.</p>";
	}
	getAdditionalMessage() {
		const container = document.createElement('span');

		if (this.gameNotation.moves.length === 0) {
			if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
				const joinText = document.createElement('span');
				joinText.appendChild(document.createTextNode('Click '));
				const emJoin = document.createElement('em');
				emJoin.textContent = 'Join Game';
				joinText.appendChild(emJoin);
				joinText.appendChild(document.createTextNode(' above to join another player\'s game. Or, you can start a game that other players can join by making the first move.'));
				container.appendChild(joinText);
				container.appendChild(document.createElement('br'));
			} else {
				container.appendChild(document.createTextNode('Select 6 Effect Tiles to play with.'));
			}

			if (!playingOnlineGame()) {
				container.appendChild(getGameOptionsMessageElement(GameType.KeyPaiShogameOptions));
			}
		}

		if (this.theGame.playerMustMoveCenterLotus(this.getCurrentPlayer())) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createTextNode('Lotus must move out of the center Gate.'));
			container.appendChild(document.createElement('br'));
		}

		return container;
	}
	getExtraHarmonyBonusHelpText() {
		var container = document.createElement("span");
		container.appendChild(document.createElement("br"));
		
		var text = document.createElement("span");
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
		var messageDiv = document.createElement("div");
		
		// Create the main message text
		var mainMessage = document.createElement("span");
		mainMessage.textContent = "Harmony Bonus! Select a tile to play or ";
		
		// Create the skip link
		var skipSpan = document.createElement("span");
		skipSpan.className = "skipBonus";
		skipSpan.textContent = "skip";
		skipSpan.onclick = () => this.skipHarmonyBonus();
		
		mainMessage.appendChild(skipSpan);
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

		var divName = tileDiv.getAttribute("name"); // Like: GWD or HL
		var tileId = parseInt(tileDiv.getAttribute("id"));
		var playerCode = divName.charAt(0);
		var tileCode = divName.substring(1);

		var player = GUEST;
		if (playerCode === 'H') {
			player = HOST;
		}

		var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

		if (tile.ownerName !== getCurrentPlayer()) {
			// debug("That's not your tile!");
			return;
		}

		if (this.gameNotation.moves.length <= 1 && !gameOptionEnabled(NO_EFFECT_TILES)) {
			// Choosing Accent Tiles
			if (tile.type !== ACCENT_TILE && tile.type !== SPECIAL_FLOWER) {
				return;
			}

			if (!tile.selectedFromPile) {
				tile.selectedFromPile = true;
				var removeTileCodeFrom = this.hostAccentTiles;
				if (getCurrentPlayer() === GUEST) {
					removeTileCodeFrom = this.guestAccentTiles;
				}

				removeTileCodeFrom.splice(removeTileCodeFrom.indexOf(tileCode), 1);

				this.theGame.actuate();
				return;
			}

			tile.selectedFromPile = false;

			var accentTilesNeededToStart = 6;

			if (getCurrentPlayer() === HOST) {
				this.hostAccentTiles.push(tileCode);

				if (this.hostAccentTiles.length === accentTilesNeededToStart || (simpleCanonRules && this.hostAccentTiles.length === 2)) {
					var move = new KeyPaiShoNotationMove("0H." + this.hostAccentTiles.join());
					this.gameNotation.addMove(move);
					if (onlinePlayEnabled) {
						createGameIfThatIsOk(GameType.KeyPaiSho.id);
					} else {
						finalizeMove();
					}
				}
			} else {
				this.guestAccentTiles.push(tileCode);

				if (this.guestAccentTiles.length === accentTilesNeededToStart || (simpleCanonRules && this.guestAccentTiles.length === 2)) {
					var move = new KeyPaiShoNotationMove("0G." + this.guestAccentTiles.join());
					this.gameNotation.addMove(move);
					// No finalize move because it is still Guest's turn
					rerunAll();
					showResetMoveMessage();
				}
			}
			this.theGame.actuate();
		} else if (this.notationBuilder.status === BRAND_NEW) {
			// new Planting turn, can be basic flower
			if (tile.type !== BASIC_FLOWER && tile.type !== SPECIAL_FLOWER) {
				debug("Can only Plant a Flower tile. That's not one of them.");
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
				this.notationBuilder = new KeyPaiShoNotationBuilder();
			}
		}
	}
	RmbDown(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
	}
	RmbUp(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

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

		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

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

				this.theGame.revealPossibleMovePoints(getCurrentPlayer(), boardPoint);
			}
		} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				// They're trying to move there! And they can! Exciting!
				// Need the notation!
				this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));

				var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
				this.theGame.hidePossibleMovePoints(false, move);
				var bonusAllowed = this.theGame.runNotationMove(move);

				if (!bonusAllowed) {
					// Move all set. Add it to the notation!
					this.gameNotation.addMove(move);
					if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
						createGameIfThatIsOk(GameType.KeyPaiSho.id);
					} else {
						if (playingOnlineGame()) {
							callSubmitMove(null, null, move);
						} else {
							finalizeMove();
						}
					}
				} else {
					this.notationBuilder.status = READY_FOR_BONUS;
					this.showHarmonyBonusMessage();
				}
			} else {
				this.theGame.hidePossibleMovePoints();
				this.notationBuilder = new KeyPaiShoNotationBuilder();
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
					var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);

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
				var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
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
			var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
			this.gameNotation.addMove(move);
			if (playingOnlineGame()) {
				callSubmitMove(1, null, move);
			} else {
				finalizeMove(1);
			}
		}
	}
	getTileMessage(tileDiv) {
		var divName = tileDiv.getAttribute("name"); // Like: GWD or HL
		var tileId = parseInt(tileDiv.getAttribute("id"));

		var tile = new KeyPaiShoTile(divName.substring(1), divName.charAt(0));

		var tileMessage = this.getHelpMessageForTile(tile);

		return {
			heading: tileMessage.heading,
			message: tileMessage.message
		};
	}
	getPointMessage(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		var heading;
		var message = [];
		/* if (boardPoint.hasTile()) {
			var tileMessage = this.getHelpMessageForTile(boardPoint.tile);
			tileMessage.message.forEach(function(messageString){
				message.push(messageString);
			});
			heading = tileMessage.heading;
		    
			var tileHarmonies = this.theGame.board.harmonyManager.getHarmoniesWithThisTile(boardPoint.tile);
			if (tileHarmonies.length > 0) {
				var bullets = [];
				tileHarmonies.forEach(function(harmony) {
					var otherTile = harmony.getTileThatIsNotThisOne(boardPoint.tile);
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
		} */
		if (boardPoint.isType(NEUTRAL)) {
			message.push(this.getNeutralSpaceMessage());
		} else if (boardPoint.isType(RED)) {
			message.push(this.getRedSpaceMessage());
		} else if (boardPoint.isType(WHITE)) {
			message.push(this.getWhiteSpaceMessage());
		} else if (boardPoint.isType(GATE)) {
			message.push(this.getGatePointMessage());
		}

		return {
			heading: heading,
			message: message
		};
	}
	getNeutralSpaceMessage() {
		var msg = "<h4>Neutral Square</h4>";
		return msg;
	}
	getRedSpaceMessage() {
		var msg = "<h4>Red Square</h4>";
		return msg;
	}
	getWhiteSpaceMessage() {
		var msg = "<h4>White Square</h4>";
		return msg;
	}
	getGatePointMessage() {
		var msg = "<h4>Gate</h4>";
		return msg;
	}
	getHelpMessageForTile(tile) {
		var message = [];

		var tileCode = tile.code;

		var heading = KeyPaiShoTile.getTileName(tileCode);

		message.push(tile.ownerName + "'s tile");

		if (tile.type === BASIC_FLOWER) {
			var colorCode = tileCode.charAt(0);

			var noLandInColor = "Dark";
			if (colorCode === "R") {
				noLandInColor = "Light";
			}

			message.push("Key Flower Tile");
			message.push("Cannot enter fully " + noLandInColor + " Garden Squares");
			message.push("Cannot Move over other Tiles");
			message.push("Can Move and Harmonize up to " + tile.getMoveDistance() + " spaces " + tile.getMovementDirectionWording());
		}

		return {
			heading: heading,
			message: message
		};
	}
	playAiTurn(finalizeMove) {
		if (this.theGame.getWinner()) {
			return;
		}
		var theAi = activeAi;
		if (activeAi2) {
			if (activeAi2.player === getCurrentPlayer()) {
				theAi = activeAi2;
			}
		}

		var playerMoveNum = this.gameNotation.getPlayerMoveNum();

		if (playerMoveNum === 1 && getCurrentPlayer() === HOST) {
			// Auto mirror guest move
			// Host auto-copies Guest's first Plant
			var hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.gameNotation.moves[this.gameNotation.moves.length - 1].plantedFlowerType);
			this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
			finalizeMove();
		} else if (playerMoveNum < 3) {
			var move = theAi.getMove(this.theGame.getCopy(), playerMoveNum);
			if (!move) {
				debug("No move given...");
				return;
			}
			this.gameNotation.addMove(move);
			finalizeMove();
		} else {
			var self = this;
			setTimeout(function() {
				var move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);
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
			var hostMoveBuilder = this.notationBuilder.getFirstMoveForHost(this.gameNotation.moves[this.gameNotation.moves.length - 1].plantedFlowerType);
			this.gameNotation.addMove(this.gameNotation.getNotationMoveFromBuilder(hostMoveBuilder));
			finalizeMove();
		}
		if (this.gameNotation.getPlayerMoveNum() === 2 && getCurrentPlayer() === GUEST) {
			this.playAiTurn(finalizeMove);
		}
	}
	getAiList() {
		return [];
	}
	getCurrentPlayer() {
		if (!gameOptionEnabled(NO_EFFECT_TILES) && this.gameNotation.moves.length <= 1) {
			if (this.gameNotation.moves.length === 0) {
				return HOST;
			} else {
				return GUEST;
			}
		}

		if (this.gameNotation.moves.length < 1) {
			return HOST;
		}

		var lastPlayer = this.gameNotation.moves[this.gameNotation.moves.length - 1].player;

		if (lastPlayer === HOST) {
			return GUEST;
		} else if (lastPlayer === GUEST) {
			return HOST;
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
		var settingsDiv = document.createElement("div");

		// var heading = document.createElement("h4");
		// heading.innerText = "Key Pai Sho Preferences:";
		// settingsDiv.appendChild(heading);
		// settingsDiv.appendChild(KeyPaiShoController.buildTileDesignDropdownDiv());
		// settingsDiv.appendChild(document.createElement("br"));
		// settingsDiv.appendChild(this.buildToggleHarmonyAidsDiv());
		// settingsDiv.appendChild(document.createElement("br"));
		return settingsDiv;
	}
	/* KeyPaiShoController.buildTileDesignDropdownDiv = function(alternateLabelText) {
		var labelText = alternateLabelText ? alternateLabelText : "Tile Designs";
		return buildDropdownDiv("KeyPaiShoTileDesignDropdown", labelText + ":", tileDesignTypeValues,
								localStorage.getItem(tileDesignTypeKey),
								function() {
									setSkudTilesOption(this.value);
								});
	}; */
	buildToggleHarmonyAidsDiv() {
		var div = document.createElement("div");
		var onOrOff = getUserGamePreference(KeyPaiShoController.hideHarmonyAidsKey) !== "true" ? "on" : "off";
		
		var textSpan = document.createElement("span");
		textSpan.textContent = "Harmony aids are " + onOrOff + ": ";
		div.appendChild(textSpan);
		
		var toggleSpan = document.createElement("span");
		toggleSpan.className = "skipBonus";
		toggleSpan.textContent = "toggle";
		toggleSpan.onclick = () => this.toggleHarmonyAids();
		div.appendChild(toggleSpan);
		
		if (gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)) {
			var warningSpan = document.createElement("span");
			warningSpan.textContent = " (Will not affect games with " + NO_HARMONY_VISUAL_AIDS + " game option)";
			div.appendChild(warningSpan);
		}
		
		return div;
	}
	toggleHarmonyAids() {
		setUserGamePreference(KeyPaiShoController.hideHarmonyAidsKey,
			getUserGamePreference(KeyPaiShoController.hideHarmonyAidsKey) !== "true");
		clearMessage();
		this.callActuate();
	}
	setAnimationsOn(isAnimationsOn) {
		this.actuator.setAnimationOn(isAnimationsOn);
	}
}

/* KeyPaiShoController.loadPreferences = function() {
	var savedPreferences = JSON.parse(localStorage.getItem(SkudConstants.preferencesKey));
	if (savedPreferences) {
		SkudPreferences = savedPreferences;
	}
}; */

KeyPaiShoController.hideHarmonyAidsKey = "HideHarmonyAids";








































/* KeyPaiShoController.getCustomTileDesignsUrl = function() {
	return SkudPreferences.customTilesUrl;
}; */

/* KeyPaiShoController.prototype.setCustomTileDesignUrl = function(url) {
	SkudPreferences.customTilesUrl = url;
	localStorage.setItem(SkudConstants.preferencesKey, JSON.stringify(SkudPreferences));
	setSkudTilesOption('custom', true);
}; */
