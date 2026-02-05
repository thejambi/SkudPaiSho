/* Ginseng specific UI interaction logic */

import {
  activeAi,
  activeAi2,
  BRAND_NEW,
  GameType,
  READY_FOR_BONUS,
  WAITING_FOR_ENDPOINT,
  callSubmitMove,
  clearMessage,
  createGameIfThatIsOk,
  finalizeMove,
  gameController,
  gameId,
  getCurrentPlayer,
  getGameOptionsMessageElement,
  getOnlineGameOpponentUsername,
  getUsername,
  iAmPlayerInCurrentOnlineGame,
  isAnimationsOn,
  isInReplay,
  myTurn,
  onlinePlayEnabled,
  playingOnlineGame,
  quickFinalizeMove,
  refreshMessage,
  rerunAll,
  setGameTitleText,
  showResetMoveMessage,
  showSkipButtonMessage,
  userIsLoggedIn,
  usernameIsOneOf,
} from '../PaiShoMain';
import { GinsengStrategicAI } from './ai/GinsengStrategicAI';
import {
  DEPLOY,
  DRAW_ACCEPT,
  GUEST,
  HOST,
  MOVE,
  NotationPoint,
  PASS_TURN,
  SETUP,
} from '../CommonNotationObjects';
import {
  GINSENG_1_POINT_0,
  GINSENG_2_POINT_0,
  gameOptionEnabled,
} from '../GameOptions';
import { GinsengActuator } from './GinsengActuator';
import {
  GinsengGameManager,
  GinsengNotationAdjustmentFunction
} from './GinsengGameManager';
import { GinsengOptions } from './GinsengOptions';
import {
  GinsengTileCodes,
  GinsengTileInfo,
  GinsengTiles,
} from './GinsengTiles';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
  TrifleGameNotation,
  TrifleNotationBuilder,
  TrifleNotationBuilderStatus,
} from '../trifle/TrifleGameNotation';
import { TrifleTile } from '../trifle/TrifleTile';
import { TrifleTileInfo } from '../trifle/TrifleTileInfo';
import { debug, debugOn } from '../GameData';
import { getPlayerCodeFromName } from '../pai-sho-common/PaiShoPlayerHelp';
import { setCurrentTileCodes, setCurrentTileMetadata } from '../trifle/PaiShoGamesTileMetadata';

export var GinsengConstants = {
	preferencesKey: "GinsengPreferencesKey"
};

export function GinsengController(gameContainer, isMobile) {
	new GinsengOptions();	// Initialize
	GinsengController.loadPreferences();
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;
	this.createActuator();

	GinsengTileInfo.initializeTrifleData();
	setCurrentTileMetadata(GinsengTiles);
	setCurrentTileCodes(GinsengTileCodes);
	this.resetGameManager();
	this.resetGameNotation();
	this.resetNotationBuilder();

	this.hostAccentTiles = [];
	this.guestAccentTiles = [];

	this.isPaiShoGame = true;

	this.showDebugInfo = false;
	this.clickToShowPointMessage = false;
	this.lastClickedPointForMessage = null;

	this.supportsMoveLogMessages = true;

	if (gameOptionEnabled(GINSENG_1_POINT_0)) {
		this.isInviteOnly = true;
	}
}

GinsengController.loadPreferences = function() {
	const preferences = localStorage.getItem(GinsengConstants.preferencesKey);
	if (preferences && preferences.length > 0) {
		try {
			GinsengOptions.Preferences = JSON.parse(preferences);
			return
		} catch(error) {
			debug("Error loading Ginseng preferences");
		}
	}
	GinsengOptions.Preferences = {
		customTilesUrl: ""
	};
};

GinsengController.prototype.createActuator = function() {
	this.actuator = new GinsengActuator(this.gameContainer, this.isMobile, isAnimationsOn());
	if (this.theGame) {
		this.theGame.updateActuator(this.actuator);
	}
};

GinsengController.prototype.getGameTypeId = function() {
	return GameType.Ginseng.id;
};

GinsengController.prototype.resetGameManager = function() {
	this.theGame = new GinsengGameManager(this.actuator);
};

GinsengController.prototype.resetNotationBuilder = function() {
	var offerDraw = false;
	if (this.notationBuilder) {
		offerDraw = this.notationBuilder.offerDraw;
	}
	this.notationBuilder = new TrifleNotationBuilder();
	this.notationBuilder.promptTargetData = {};
	if (offerDraw) {
		this.notationBuilder.offerDraw = true;
	}
	this.checkingOutOpponentTileOrNotMyTurn = false;

	this.notationBuilder.currentPlayer = this.getCurrentPlayer();
};

GinsengController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

GinsengController.prototype.getNewGameNotation = function() {
	return new TrifleGameNotation(GUEST);
};

GinsengController.getHostTilesContainerDivs = function() {
	return '';
}

GinsengController.getGuestTilesContainerDivs = function() {
	return '';
};

GinsengController.prototype.callActuate = function() {
	this.theGame.actuate();
};

GinsengController.prototype.resetMove = function(skipAnimation) {
	this.notationBuilder.offerDraw = false;
	if (this.notationBuilder.status === BRAND_NEW) {
		// Remove last move
		this.gameNotation.removeLastMove();
	} else if (this.notationBuilder.status === READY_FOR_BONUS) {
		// Just rerun
	}

	rerunAll(null, null, skipAnimation);
};

GinsengController.prototype.getDefaultHelpMessageText = function() {
	if (gameOptionEnabled(GINSENG_2_POINT_0) || !gameOptionEnabled(GINSENG_1_POINT_0)) {
		return '<h4>Ginseng Pai Sho</h4>'
			+ '<p><strong><center>How to win</center></strong></p>'
			// + '<ul>'
			+ '<p>To win a game of Ginseng Pai Sho, you must be the first player to move your White Lotus from its starting point to the other side of the Border (or midline) and into your opponent´s territory.<p>'
			// + '</ul>'
			+ '<p><strong><center>Taking a turn</center></strong></p>'
			// + '<ul>'
			+ '<p>Players take alternating turns. When it is your turn, select and move a tile according to its specified movement and apply any triggered abilities.</p>'
			// + '</ul>'
			+ '<p><strong><center>Draw</center></strong></p>'
			// + '<ul>'
			+ '<p>If a player reaches a point where no moves are possible, the game results in a draw.</p>'
			// + '</ul>'
			+ '<p><strong><center>General rules</center></strong></p>'
			+ '<p>Here are the four fundamental rules that apply to most of the tiles in Ginseng Pai Sho, distilled for easy understanding. However, it is worth noticing that there are exceptions to this simplicity. The White Lotus, Ginseng, and Wheel do not adhere strictly to these rules. Hover over any tile to see where they might differ from the general rules.</p>'
			+ '<ul>'
			+ '<p><strong>1: Movement</strong></p>'
			+ '<ul>'
			+ '<li>Each tile is allowed to move within a range of up to 5 spaces.</li>'
			+ '<li>Tiles are played on the intersections, and may be moved along the horizontal and vertical lines; no diagonal movement allowed.</li>'
			+ '<li>Furthermore, a tile cannot pass through another; it must navigate around obstructing tiles.</li>'
			+ '</ul>'
			+ '<p><strong>2: Capturing</strong></p>'
			+ '<ul>'
			+ '<li>Tiles may capture opponent´s tiles when BOTH White Lotuses are outside Temples.</li>'
			+ '<li>You capture your opponent´s tiles by moving your tile onto theirs. Captured tiles are taken off the board and placed in the captured tiles pile.</li>'
			+ '</ul>'
			+ '<p><strong>3: Temples</strong></p>'
			+ '<ul>'
			+ '<li>The Northern and Southern Temples may only be used by the White Lotus that started there.</li>'
			+ '<li>Each tile may enter the Eastern and Western Temples.</li>'
			+ '<li>Tiles inside Temples are protected from being captured..</li>'
			+ '<li>When moving a tile into the Eastern or Western Temple, you may exchange it for one of your captured tiles.</li>'
			+ '</ul>'
			+ '<p><strong>4: Abilities</strong></p>'
			+ '<ul>'
			+ '<li>Each tile possesses a unique ability that influences other tiles on the board. Hover over the tiles to see their abilities.</li>'
			+ '</ul>'
			+ '<p>For additional info, view the rule book <a href="https://skudpaisho.com/site/games/ginseng-pai-sho/" target="_blank">here</a>.</p>';
	} else {
		return "<h4>Ginseng Pai Sho</h4>"
			+ "<p>The first player to cross the Border with their White Lotus tile wins. The Border is the midline between Host and Guest tiles.</p><h4>Temple Rules</h4><p>Tiles are protected when inside of the Eastern or Western Temple. Protected tiles cannot be captured, trapped, or pushed. A tile inside of a Temple can still use its abilities.</p><h4>White Lotus Rules</h4><p>When your White Lotus is inside of a Temple:</p><ul><li>You cannot capture tiles by movement</li><li>Your tiles’ abilities are not in effect</li></ul><p>When only your White Lotus is outside of a Temple:</p><ul><li>You cannot capture tiles by movement</li><li>Your tiles’ abilities are in effect</li></ul><p>When both White Lotuses are outside of a Temple:</p><ul><li>You can capture tiles by movement</li><li>Your tiles’ abilities are in effect</li></ul>"
			+ "<p><a href='https://skudpaisho.com/site/games/ginseng-pai-sho/' target='_blank'>view the full rules</a>.</p>";
	}
};

GinsengController.prototype.gameNotBegun = function() {
	return this.gameNotation.moves.length === 0 
		|| (this.gameNotation.moves.length === 1 && this.gameNotation.moves[0].moveType === SETUP);
};

GinsengController.prototype.getAdditionalMessage = function() {
	const container = document.createElement('span');

	if (this.gameNotBegun() && !playingOnlineGame()) {
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			const joinText = document.createElement('span');
			joinText.appendChild(document.createTextNode('Click '));
			const emJoin = document.createElement('em');
			emJoin.textContent = 'Join Game';
			joinText.appendChild(emJoin);
			joinText.appendChild(document.createTextNode(' above to join another player\'s game. Or, you can start a game that other players can join by clicking '));
			const strongStart = document.createElement('strong');
			strongStart.textContent = 'Start Online Game';
			joinText.appendChild(strongStart);
			joinText.appendChild(document.createTextNode(' below.'));
			container.appendChild(joinText);
		} else {
			container.appendChild(document.createTextNode('Sign in to enable online gameplay. Or, start playing a local game.'));
		}

		container.appendChild(getGameOptionsMessageElement(GameType.Ginseng.gameOptions));
	} else if (!this.theGame.hasEnded() && myTurn()) {
		if (this.gameNotation.lastMoveHasDrawOffer() && this.promptToAcceptDraw) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createTextNode('Are you sure you want to accept the draw offer and end the game?'));
			container.appendChild(document.createElement('br'));

			const confirmSpan = document.createElement('span');
			confirmSpan.className = 'skipBonus';
			confirmSpan.textContent = 'Yes, accept draw and end the game';
			confirmSpan.onclick = () => gameController.confirmAcceptDraw();
			container.appendChild(confirmSpan);
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));
		} else if (this.gameNotation.lastMoveHasDrawOffer()) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createTextNode('Your opponent is offering a draw. You may '));

			const acceptSpan = document.createElement('span');
			acceptSpan.className = 'skipBonus';
			acceptSpan.textContent = 'Accept Draw';
			acceptSpan.onclick = () => gameController.acceptDraw();
			container.appendChild(acceptSpan);

			container.appendChild(document.createTextNode(' or make a move to refuse the draw offer.'));
			container.appendChild(document.createElement('br'));
		} else if (this.notationBuilder.offerDraw) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createTextNode('Your opponent will be able to accept or reject your draw offer once you make your move. Or, you may '));

			const removeSpan = document.createElement('span');
			removeSpan.className = 'skipBonus';
			removeSpan.textContent = 'remove your draw offer';
			removeSpan.onclick = () => gameController.removeDrawOffer();
			container.appendChild(removeSpan);

			container.appendChild(document.createTextNode(' from this move.'));
		} else {
			container.appendChild(document.createElement('br'));

			const offerSpan = document.createElement('span');
			offerSpan.className = 'skipBonus';
			offerSpan.textContent = 'Offer Draw';
			offerSpan.onclick = () => gameController.offerDraw();
			container.appendChild(offerSpan);

			container.appendChild(document.createElement('br'));
		}
	} else if (!myTurn()) {
		if (this.gameNotation.lastMoveHasDrawOffer()) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createTextNode('A draw has been offered.'));
			container.appendChild(document.createElement('br'));
		}
	}

	if (!playingOnlineGame()) {
		if (onlinePlayEnabled && this.gameNotBegun()) {
			container.appendChild(document.createElement('br'));

			const startSpan = document.createElement('span');
			startSpan.className = 'skipBonus';
			startSpan.textContent = 'Start Online Game';
			startSpan.onclick = () => gameController.startOnlineGame();
			container.appendChild(startSpan);

			container.appendChild(document.createElement('br'));
		}
	}

	return container;
};

GinsengController.prototype.toggleDebug = function() {
	this.showDebugInfo = !this.showDebugInfo;
	clearMessage();
};

GinsengController.prototype.toggleClickToShowPointMessage = function() {
	this.clickToShowPointMessage = !this.clickToShowPointMessage;
	this.createActuator();
	this.callActuate();
	clearMessage();
};

GinsengController.prototype.completeSetup = function() {
	// Create initial board setup
	if (gameOptionEnabled(GINSENG_1_POINT_0)) {
		this.addSetupMove();
	}

	// Finish with actuate
	rerunAll();
	this.callActuate();

	if (gameOptionEnabled(GINSENG_1_POINT_0)) {
		setGameTitleText("Ginseng Pai Sho 1.0");
	}
};

GinsengController.prototype.addSetupMove = function() {
	this.notationBuilder.moveType = SETUP;
	this.notationBuilder.boardSetupNum = 1;
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.theGame.runNotationMove(move);
	// Move all set. Add it to the notation!
	this.gameNotation.addMove(move);
};

GinsengController.prototype.startOnlineGame = function() {
	this.resetNotationBuilder();
	this.notationBuilder.currentPlayer = HOST;
	this.notationBuilder.moveType = PASS_TURN;

	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.theGame.runNotationMove(move);
	// Move all set. Add it to the notation!
	this.gameNotation.addMove(move);

	createGameIfThatIsOk(GameType.Ginseng.id);
};

GinsengController.prototype.getAdditionalHelpTabDiv = function() {
	var settingsDiv = document.createElement("div");

	var heading = document.createElement("h4");
	heading.innerText = "Ginseng Preferences:";

	settingsDiv.appendChild(heading);
	settingsDiv.appendChild(GinsengOptions.buildTileDesignDropdownDiv("Tile Designs"));

	if (!playingOnlineGame() || !iAmPlayerInCurrentOnlineGame() || getOnlineGameOpponentUsername() === getUsername()) {
		settingsDiv.appendChild(document.createElement("br"));
		settingsDiv.appendChild(GinsengOptions.buildToggleViewAsGuestDiv());
	}

	settingsDiv.appendChild(document.createElement("br"));

	if (debugOn) {
		var clickToShowText = this.clickToShowPointMessage
			? "Switch to show tile info on hover"
			: "Switch to show tile info on click";
		var clickToShowSpan = document.createElement("span");
		clickToShowSpan.classList.add("skipBonus");
		clickToShowSpan.onclick = function() { gameController.toggleClickToShowPointMessage(); };
		clickToShowSpan.innerText = clickToShowText;
		settingsDiv.appendChild(clickToShowSpan);

		settingsDiv.appendChild(document.createElement("br"));
	}

	if (usernameIsOneOf(["SkudPaiSho"]) || debugOn) {
		var toggleDebugText = "Enable debug Help display";
		if (this.showDebugInfo) {
			toggleDebugText = "Disable debug Help display";
		}
		var toggleDebugSpan = document.createElement("span");
		toggleDebugSpan.classList.add("skipBonus");
		toggleDebugSpan.setAttribute("onclick", "gameController.toggleDebug();");
		toggleDebugSpan.innerText = toggleDebugText;

		settingsDiv.appendChild(toggleDebugSpan);

		settingsDiv.appendChild(document.createElement("br"));
	}

	settingsDiv.appendChild(document.createElement("br"));

	return settingsDiv;
};

GinsengController.prototype.toggleViewAsGuest = function() {
	GinsengOptions.viewAsGuest = !GinsengOptions.viewAsGuest;
	this.createActuator();
	this.callActuate();
	clearMessage();
};

GinsengController.prototype.gameHasEndedInDraw = function() {
	return this.theGame.gameHasEndedInDraw;
};

GinsengController.prototype.acceptDraw = function() {
	if (myTurn()) {
		this.promptToAcceptDraw = true;
		refreshMessage();
	}
};

GinsengController.prototype.confirmAcceptDraw = function() {
	if (myTurn()) {
		this.resetNotationBuilder();
		this.notationBuilder.moveType = DRAW_ACCEPT;

		var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
		this.theGame.runNotationMove(move);
		// Move all set. Add it to the notation!
		this.gameNotation.addMove(move);

		if (playingOnlineGame()) {
			callSubmitMove(null, null, { fullMoveText: this.theGame.gameLogText });
		} else {
			finalizeMove();
		}
	}
};

GinsengController.prototype.offerDraw = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = true;
		refreshMessage();
	}
};

GinsengController.prototype.removeDrawOffer = function() {
	if (myTurn()) {
		this.notationBuilder.offerDraw = false;
		refreshMessage();
	}
};

GinsengController.prototype.unplayedTileClicked = function(tileDiv) {
	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded() && this.notationBuilder.status !== READY_FOR_BONUS) {
		return;
	}

	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);

	var player = GUEST;
	if (playerCode === 'H') {
		player = HOST;
	}

	var tile = this.theGame.tileManager.peekTile(player, tileCode, tileId);

	if ((tile && tile.ownerName !== getCurrentPlayer()) || !myTurn()) {
		this.checkingOutOpponentTileOrNotMyTurn = true;
	}

	/* if (this.theGame.playersAreSelectingTeams()) {
		var selectedTile = new Ginseng.Tile(tileCode, playerCode);
		if (tileDiv.classList.contains("selectedFromPile")) {
			var teamIsNowFull = this.theGame.addTileToTeam(selectedTile);
			if (teamIsNowFull) {
				this.notationBuilder.moveType = TEAM_SELECTION;
				this.notationBuilder.teamSelection = this.theGame.getPlayerTeamSelectionTileCodeList(player);
				this.completeMove();
			}
		} else if (!this.theGame.tileManager.playerTeamIsFull(selectedTile.ownerName)) {
			// Need to remove from team instead
			this.theGame.removeTileFromTeam(selectedTile);
		}
	} else  */
	if (this.notationBuilder.status === BRAND_NEW) {
		// new Deploy turn
		tile.selectedFromPile = true;

		this.notationBuilder.moveType = DEPLOY;
		this.notationBuilder.tileType = tileCode;
		this.notationBuilder.status = WAITING_FOR_ENDPOINT;

		this.theGame.revealDeployPoints(tile);
	} else if (this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET) {
		if (tile.tileIsSelectable) {
			if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
				var sourceTileKey = JSON.stringify(this.notationBuilder.neededPromptTargetInfo.sourceTileKey);
				if (!this.notationBuilder.promptTargetData[sourceTileKey]) {
					this.notationBuilder.promptTargetData[sourceTileKey] = {};
				}
				this.notationBuilder.promptTargetData[sourceTileKey][this.notationBuilder.neededPromptTargetInfo.currentPromptTargetId] = tile.getOwnerCodeIdObject();
				// TODO - Does move require user to choose targets?... 
				var notationBuilderSave = this.notationBuilder;
				this.resetMove(true);
				this.notationBuilder = notationBuilderSave;
				this.completeMove();
			} else {
				this.resetNotationBuilder();
			}
		}
	} else {
		this.theGame.hidePossibleMovePoints();
		this.resetNotationBuilder();
	}
}

GinsengController.prototype.pointClicked = function(htmlPoint) {
	this.theGame.markingManager.clearMarkings();
	this.callActuate();

	this.promptToAcceptDraw = false;

	if (this.theGame.hasEnded()) {
		return;
	}

	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
	var currentMovePath = boardPoint.buildMovementPath();

	if (this.notationBuilder.status === BRAND_NEW) {
		if (boardPoint.hasTile()) {
			if (boardPoint.tile.ownerName !== getCurrentPlayer() || !myTurn()) {
				debug("That's not your tile!");
				this.checkingOutOpponentTileOrNotMyTurn = true;
			}

			this.notationBuilder.status = WAITING_FOR_ENDPOINT;
			this.notationBuilder.moveType = MOVE;
			this.notationBuilder.startPoint = new NotationPoint(htmlPoint.getAttribute("name"));

			this.theGame.revealPossibleMovePoints(boardPoint);
		}
	} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			// They're trying to move there! And they can! Exciting!
			// Need the notation!
			this.theGame.hidePossibleMovePoints();

			if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
				this.notationBuilder.endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
				this.notationBuilder.endPointMovementPath = currentMovePath;	// TODO notation cleanup ?
				this.completeMove();
			} else {
				this.resetNotationBuilder();
			}
		} else {
			this.theGame.hidePossibleMovePoints();
			this.resetNotationBuilder();
		}
	} else if (this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET) {
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.theGame.hidePossibleMovePoints();

			if (!this.checkingOutOpponentTileOrNotMyTurn && !isInReplay) {
				var sourceTileKey = JSON.stringify(this.notationBuilder.neededPromptTargetInfo.sourceTileKey);
				if (!this.notationBuilder.promptTargetData[sourceTileKey]) {
					this.notationBuilder.promptTargetData[sourceTileKey] = {};
				}
				this.notationBuilder.promptTargetData[sourceTileKey][this.notationBuilder.neededPromptTargetInfo.currentPromptTargetId] = new NotationPoint(htmlPoint.getAttribute("name"));
				// TODO - Does move require user to choose targets?... 
				var notationBuilderSave = this.notationBuilder;
				this.resetMove(true);
				this.notationBuilder = notationBuilderSave;
				this.completeMove();
			} else {
				this.resetNotationBuilder();
			}
		} else {
			// this.theGame.hidePossibleMovePoints();
			// this.notationBuilder.status = ?
		}
	}
};

GinsengController.prototype.completeMove = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	var skipAnimation = this.notationBuilder.status === TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET;
	var neededPromptTargetInfo = this.theGame.runNotationMove(move, true, null, skipAnimation);

	if (neededPromptTargetInfo) {
		debug("Prompting user for the rest of the move!");
		this.notationBuilder.status = TrifleNotationBuilderStatus.PROMPTING_FOR_TARGET;
		this.notationBuilder.neededPromptTargetInfo = neededPromptTargetInfo;
		
		if (neededPromptTargetInfo.sourceAbility.abilityInfo.optional) {
			refreshMessage();
			var abilityTitle = neededPromptTargetInfo.sourceAbility.abilityInfo.title;
			if (!abilityTitle) {
				abilityTitle = neededPromptTargetInfo.sourceAbility.abilityInfo.type;
			}
			showSkipButtonMessage("Skip ability: " + abilityTitle);
		}

		showResetMoveMessage();
	} else {
		this.gameNotation.addMove(move);
		if (playingOnlineGame()) {
			callSubmitMove(null, null, { fullMoveText: this.theGame.gameLogText });
		} else {
			// finalizeMove();
			quickFinalizeMove();
		}
	}
};

GinsengController.prototype.skipHarmonyBonus = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
	this.gameNotation.addMove(move);
	if (playingOnlineGame()) {
		callSubmitMove(null, null, { fullMoveText: this.theGame.gameLogText });
	} else {
		finalizeMove();
	}
}

GinsengController.prototype.getTheMessage = function(tile, ownerName) {
	var message = [];

	var tileCode = tile.code;

	var heading = TrifleTile.getTileName(tileCode);

	message.push(TrifleTileInfo.getReadableDescription(tileCode));

	return {
		heading: heading,
		message: message
	}
}

GinsengController.prototype.getTileMessage = function(tileDiv) {
	var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
	var tileId = parseInt(tileDiv.getAttribute("id"));
	var playerCode = divName.charAt(0);
	var tileCode = divName.substring(1);
	var tile = new TrifleTile(tileCode, playerCode);

	var ownerName = HOST;
	if (divName.startsWith('G')) {
		ownerName = GUEST;
	}

	return this.getTheMessage(tile, ownerName);
}

GinsengController.prototype.getPointMessage = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

	if (boardPoint.hasTile()) {
		return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName);
	} else if (this.showDebugInfo) {
		var messageLines = this.theGame.buildAbilitySummaryLines();
		return {
			heading: "Active Abilities",
			message: messageLines
		};
	}
}

GinsengController.prototype.playAiTurn = function(gameFinalize) {
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

	const self = this;
	setTimeout(function() {
		const move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);

		if (move) {
			self.gameNotation.addMove(move);
			self.theGame.runNotationMove(move);

			if (gameFinalize) {
				gameFinalize();
			}
		}
	}, 10);
};

GinsengController.prototype.startAiGame = function(gameFinalize) {
	this.playAiTurn(gameFinalize);
};

GinsengController.prototype.getAiList = function() {
	return [new GinsengStrategicAI()];
}

GinsengController.prototype.getCurrentPlayer = function() {
	if (this.gameNotBegun()) {
		return GUEST;
	} /* else if (this.gameNotation.moves.length > 0
			&& this.gameNotation.moves[0].moveType === PASS_TURN) {
		if (currentMoveIndex % 2 === 0) {
			return HOST;
		} else {
			return GUEST;
		}
	}  */
	else {
		var lastPlayer = this.gameNotation.moves[this.gameNotation.moves.length - 1].player;

		if (lastPlayer === HOST) {
			return GUEST;
		} else if (lastPlayer === GUEST) {
			return HOST;
		}
	}
};

GinsengController.prototype.cleanup = function() {
	// Nothing to do
};

GinsengController.prototype.isSolitaire = function() {
	return false;
};

GinsengController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
	if (playingOnlineGame() && iAmPlayerInCurrentOnlineGame() && getOnlineGameOpponentUsername() != getUsername()) {
		new GinsengOptions();	// To set perspective...
		this.createActuator();
		clearMessage();
	}
};

GinsengController.prototype.skipClicked = function() {
	var sourceTileKey = JSON.stringify(this.notationBuilder.neededPromptTargetInfo.sourceTileKey);
	if (!this.notationBuilder.promptTargetData[sourceTileKey]) {
		this.notationBuilder.promptTargetData[sourceTileKey] = {};
	}
	this.notationBuilder.promptTargetData[sourceTileKey].skipped = true;
	var notationBuilderSave = this.notationBuilder;
	this.resetMove();
	this.notationBuilder = notationBuilderSave;
	this.completeMove();
};

/* TODO Find more global way of doing RmbDown,etc methods? */

GinsengController.prototype.RmbDown = function(htmlPoint) {
	var npText = htmlPoint.getAttribute("name");

	var notationPoint = new NotationPoint(npText);
	var rowCol = notationPoint.rowAndColumn;
	this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
}

GinsengController.prototype.RmbUp = function(htmlPoint) {
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

GinsengController.prototype.buildNotationString = function(move) {
	var playerCode = getPlayerCodeFromName(move.player);
	var moveNum = move.moveNum;

	var moveNotation = moveNum + playerCode + ".";

	if (move.moveType === MOVE) {
		var startRowAndCol = new NotationPoint(move.startPoint).rowAndColumn;
		var endRowAndCol = new NotationPoint(move.endPoint).rowAndColumn;
		moveNotation += "(" + GinsengNotationAdjustmentFunction(startRowAndCol.row, startRowAndCol.col) + ")-";
		moveNotation += "(" + GinsengNotationAdjustmentFunction(endRowAndCol.row, endRowAndCol.col) + ")";

		if (move.promptTargetData) {
			Object.keys(move.promptTargetData).forEach((key, index) => {
				var promptDataEntry = move.promptTargetData[key];
				var keyObject = JSON.parse(key);
				if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
					var movedTilePointRowAndCol = promptDataEntry.movedTilePoint.rowAndColumn;
					// TODO promptDataEntry field work needed
					var movedTileDestinationRowAndCol = promptDataEntry.movedTileDestinationPoint.rowAndColumn;
					moveNotation += "+";
					moveNotation += "(" + GinsengNotationAdjustmentFunction(movedTilePointRowAndCol.row, movedTilePointRowAndCol.col) + ")-";
					moveNotation += "(" + GinsengNotationAdjustmentFunction(movedTileDestinationRowAndCol.row, movedTileDestinationRowAndCol.col) + ")";
				} else if (promptDataEntry.chosenCapturedTile) {
					moveNotation += "+" + promptDataEntry.chosenCapturedTile.code;
				} else {
					moveNotation += " Ability?";
				}
			});
		}
	}

	return moveNotation;
};

GinsengController.prototype.setCustomTileDesignUrl = function(url) {
	GinsengOptions.Preferences.customTilesUrl = url;
	localStorage.setItem(GinsengConstants.preferencesKey, JSON.stringify(GinsengOptions.Preferences));
	localStorage.setItem(GinsengOptions.tileDesignTypeKey, 'custom');
	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
};

GinsengController.isUsingCustomTileDesigns = function() {
	return localStorage.getItem(GinsengOptions.tileDesignTypeKey) === "custom";
};

GinsengController.getCustomTileDesignsUrl = function() {
	return GinsengOptions.Preferences.customTilesUrl;
};

