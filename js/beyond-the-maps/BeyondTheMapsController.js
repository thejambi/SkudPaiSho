/* Beyond The Edges of The Maps specific UI interaction logic */

import { WAITING_FOR_BONUS_ENDPOINT, replayIntervalLength } from '../GameConstants';
import {
  activeAi,
  BRAND_NEW,
  GameType,
  WAITING_FOR_ENDPOINT,
  callSubmitMove,
  closeModal,
  createGameIfThatIsOk,
  currentMoveIndex,
  finalizeMove,
  gameId,
  getCurrentPlayer,
  getGameOptionsMessageElement,
  iAmPlayerInCurrentOnlineGame,
  isAnimationsOn,
  myTurn,
  onlinePlayEnabled,
  playingOnlineGame,
  refreshMessage,
  rerunAll,
  showModalElem,
  showReplayControls,
} from '../PaiShoMain';
import { userIsLoggedIn } from '../UserData';
import { BeyondTheMapsActuator } from './BeyondTheMapsActuator';
import {
  BeyondTheMapsGameManager,
  BeyondTheMapsMoveType,
} from './BeyondTheMapsGameManager';
import { BeyondTheMapsMctsGame, BtmAction, BtmGame } from './ai/BeyondTheMapsMctsGame';
import { BtmMoveBuilder } from './BtmMoveBuilder';
import { EDGES_12x12_GAME, EDGES_DICE_FOR_MOVEMENT, EDGES_MOVE_4_2, gameOptionEnabled } from '../GameOptions';
import { GUEST, HOST, NotationPoint } from '../CommonNotationObjects';
import { MCTS } from '../ai/MCTS';
import { MCTSPlayer } from '../ai/jsmcts';
import { POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { PlaygroundMoveType } from '../playground/PlaygroundGameNotation';
import { PlaygroundTile } from '../playground/PlaygroundTile';
import { TrifleGameNotation } from '../trifle/TrifleGameNotation';
import { debug } from '../GameData';
import { getRandomizer } from '../../js_util/MersenneTwisterRandom';
import BeyondTheMapsTile, { BeyondTheMapsTileType } from './BeyondTheMapsTile';
import { BeyondTheMapsStrategicAI } from './ai/BeyondTheMapsStrategicAI';

export class BeyondTheMapsController {
	constructor(gameContainer, isMobile) {
		this.actuator = new BeyondTheMapsActuator(gameContainer, isMobile, isAnimationsOn());

		this.resetGameManager();
		this.resetMoveBuilder();
		this.resetGameNotation();
		this.messageToPlayer = "";

		showReplayControls();

		this.randomSeed = getRandomizer().random() * 10000;
	}

	getGameTypeId() {
		return GameType.BeyondTheMaps.id;
	}

	resetGameManager() {
		this.theGame = new BeyondTheMapsGameManager(this.actuator);

		var vgame = new BeyondTheMapsMctsGame(GUEST);
		let iterations = 2; //more iterations -> stronger AI, more computation
		let exploration = 0.55; //1.41 //exploration vs. explotation parameter, sqrt(2) is reasonable default (c constant in UBC forumula)
		var mcts = new MCTS(vgame, GUEST, iterations, exploration);

		this.mctsGame = {
			game: vgame,
			mcts: mcts
		};


		var maxTrials = 1;
		var maxTime = 100;

		var btmGame = new BtmGame();
		var mctsPlayer = new MCTSPlayer({ nTrials: maxTrials });

		this.jsMctsGame = {
			maxTrials: maxTrials,
			maxTime: maxTime,
			game: btmGame,
			mctsPlayer: mctsPlayer
		};
		this.jsMctsGame.mctsPlayer.searchCallback = (state) => {
			debug("searchCallback");
		};
	}

	resetNotationBuilder() {
		this.resetMoveBuilder();
	}

	resetMoveBuilder() {
		this.moveBuilder = new BtmMoveBuilder();
	}

	resetGameNotation() {
		// TODO: Create GameNotationManager to encapsulate things better so this class doesn't need the gameNotation as much?
		this.gameNotation = this.getNewGameNotation();
	}

	completeSetup() {
		// Nothing to do
	}

	getNewGameNotation() {
		/* Purposely using Trifle game notation as it is generic and json */
		return new TrifleGameNotation();
	}

	static getHostTilesContainerDivs() {
		return '';
	}

	static getGuestTilesContainerDivs() {
		return '';
	}

	callActuate() {
		this.theGame.actuate();
	}

	resetMove() {
		if (this.moveBuilder.getStatus() === BRAND_NEW) {
			// Remove last move
			this.gameNotation.removeLastMove();
		}

		rerunAll();
		return true;
	}

	getDefaultHelpMessageText() {
		return "<h4>Beyond The Edges of The Maps</h4>"
			+ "<p>A fan-made game inspired by the world of Aerwiar from <a href='https://www.wingfeathersaga.com/' target='_blank'>The Wingfeather Saga by Andrew Peterson</a>.</p>"
			+ "<p>Players attempt to sail beyond the edges of the maps to discover the most land as they draw ever closer to each other and one of the ships is immobilized. Whoever has the most discovered land at the end of the game wins.</p>"
			+ "<p>On a turn, players explore by sea and explore by land.</p>"
			+ "<p>Click on your ship to explore by sea, click on your land to explore by land.</p>"
			+ "<p>The starting player begins by exploring by sea only.</p>"
			+ "<p>View <a href='https://skudpaisho.com/site/games/beyond-the-edges-of-the-maps/' target='_blank'>the full rules</a> for more.</p>"
	}

	getAdditionalMessage() {
		return '';
	}

	getAdditionalMessageElement() {
		var msgContainer = document.createElement('span');

		if (this.gameNotation.moves.length === 0) {
			var msgP = document.createElement('p');
			
			if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
				msgP.appendChild(document.createTextNode("Click "));
				var em1 = document.createElement("em");
				em1.textContent = "Join Game";
				msgP.appendChild(em1);
				msgP.appendChild(document.createTextNode(" above to join another player's game. Or, you can start a game that other players can join by exploring by sea as Host (the light colored ship). "));
				msgP.appendChild(document.createElement("br"));
			} else {
				msgP.textContent = "Sign in to enable online gameplay. Or, start playing a local game by exploring by sea as Host (the light colored ship). ";
				msgP.appendChild(document.createElement("br"));
			}

			msgContainer.appendChild(msgP);

			msgContainer.appendChild(getGameOptionsMessageElement(GameType.BeyondTheMaps.gameOptions));
		} else if (!this.theGame.getWinner()) {
			var msgP = document.createElement('p');
			
			if (this.messageToPlayer) {
				msgP.appendChild(document.createElement("br"));
				msgP.appendChild(document.createTextNode(this.messageToPlayer));
			}
			
			if (gameOptionEnabled(EDGES_DICE_FOR_MOVEMENT)) {
				var diceRolls = this.getDiceRolls();
				msgP.appendChild(document.createTextNode("This turn: Move " + diceRolls.high + " by sea and " + diceRolls.low + " by land."));
			} else {
				msgP.appendChild(document.createTextNode("Click your ship to explore by sea, click your land to explore by land."));
			}

			msgP.appendChild(document.createElement("br"));
			msgP.appendChild(document.createTextNode("Host land: " + this.theGame.calculatePlayerScore(HOST)));
			msgP.appendChild(document.createElement("br"));
			msgP.appendChild(document.createTextNode("Guest land: " + this.theGame.calculatePlayerScore(GUEST)));

			msgContainer.appendChild(msgP);
		}

		return msgContainer;
	}

	/* getAdditionalMessageElement() {
		var msgElement = document.createElement("button");
		msgElement.innerText = "Play MCTS move";
		msgElement.addEventListener('click', () => {
			// this.playMctsMove(true);
			this.computerMove(true);
		});
		return msgElement;
	} */

	computerMove(autoKeepGoing) {
		if (this.theGame.getWinResultTypeCode() > 0) {
			return;
		}
		showModalElem('AI Move Loading', document.createTextNode('AI move loading...'), true);
        var state = this.jsMctsGame.mctsPlayer.startThinking(this.jsMctsGame.game);
        state.startTime = Date.now();
        this.mctsTimer = window.setTimeout(() => {
          this.computerMove_continue(state, autoKeepGoing)
        }, 10);
      }
      computerMove_continue(state, autoKeepGoing) {
        var now = Date.now();
        if (now-state.startTime < this.jsMctsGame.maxTime 
			&& this.jsMctsGame.mctsPlayer.continueThinking(state, 1000)) {
        //   $("#msg").text("Thinking... ("+Math.ceil((this.jsMctsGame.maxTime-(now-state.startTime))/1000)+"s)");
          this.mctsTimer = window.setTimeout(() => {
            this.computerMove_continue(state, autoKeepGoing)
          }, 10);
          return;
		} else {
			var chosenAction = this.jsMctsGame.mctsPlayer.stopThinking(state);
			// $(cells[a.pos-1]).addClass("marked"+computerPlayer);
			// $(cells[a.pos-1]).addClass("movehilite");
			this.jsMctsGame.game.doAction(chosenAction);
			// play_continue();
			this.gameNotation.addMove(chosenAction.move);
			finalizeMove();
			closeModal();

			// 
			if (autoKeepGoing) {
				setTimeout(() => {
					this.computerMove(autoKeepGoing);
				}, 1500);
			}
		}
      }
	
	async playMctsMove(autoPlayNext) {
		showModalElem('AI Move Loading', document.createTextNode('AI move loading...'), true);
		setTimeout(() => {
			var move = this.mctsGame.mcts.selectMove();
			if (!move) {
				showModalElem('AI Move', document.createTextNode("No AI move found :("));
				return;
			}
			this.gameNotation.addMove(move);
			finalizeMove();
			closeModal();

			if (autoPlayNext) {
				setTimeout(() => {
					this.playMctsMove(autoPlayNext);
				}, 2000);
			}
		}, 50);
	}

	gamePreferenceSet(preferenceKey) {
		// 
	}

	startOnlineGame() {
		createGameIfThatIsOk(this.getGameTypeId());
	}

	unplayedTileClicked(tileDiv) {
		// Nothing to do
	}

	pointClicked(htmlPoint) {
		this.getDiceRolls();
		this.theGame.markingManager.clearMarkings();
		this.callActuate();

		if (this.theGame.getWinner() || !myTurn() || currentMoveIndex !== this.gameNotation.moves.length
				|| (playingOnlineGame() && !iAmPlayerInCurrentOnlineGame())
				|| this.isStillRunningMove()) {
			return;
		}

		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (this.moveBuilder.getStatus() === BRAND_NEW) {
			if (boardPoint.hasTile()) {
				if (boardPoint.tile.ownerName !== getCurrentPlayer()) {
					debug("That's not your tile!");
					return;
				}
				
				if (boardPoint.tile.tileType === BeyondTheMapsTileType.SHIP
						&& this.moveBuilder.canExploreSea()) {
					this.moveBuilder.setStatus(WAITING_FOR_ENDPOINT);
					this.moveBuilder.beginNewPhase();
					this.moveBuilder.getCurrentPhase().moveType = BeyondTheMapsMoveType.EXPLORE_SEA;
					this.moveBuilder.setPlayer(this.getCurrentPlayer());
					this.moveBuilder.getCurrentPhase().startPoint = npText;

					var moveDistance = 6;
					if (gameOptionEnabled(EDGES_MOVE_4_2)) {
						moveDistance = 4;
					} else if (gameOptionEnabled(EDGES_DICE_FOR_MOVEMENT)) {
						var diceRolls = this.getDiceRolls();
						moveDistance = diceRolls.high;
					}

					this.theGame.revealPossibleMovePoints(boardPoint, false, moveDistance);
					refreshMessage();
				} else if (boardPoint.tile.tileType === BeyondTheMapsTileType.LAND
						&& this.moveBuilder.canExploreLand()) {
					this.moveBuilder.setStatus(WAITING_FOR_ENDPOINT);
					this.moveBuilder.beginNewPhase();
					this.moveBuilder.getCurrentPhase().moveType = BeyondTheMapsMoveType.EXPLORE_LAND;
					this.moveBuilder.setPlayer(this.getCurrentPlayer());

					var possiblePointsFound = this.theGame.revealPossibleExploreLandPoints(this.getCurrentPlayer());

					if (!possiblePointsFound) {
						if (this.moveBuilder.getPhaseIndex() === 0) {
							this.messageToPlayer = "Explore Sea first";
						} else {
							this.completeMovePhase();
						}
						this.moveBuilder.resetPhase();
					}

					refreshMessage();
				}
			}
		} else if (this.moveBuilder.getStatus() === WAITING_FOR_ENDPOINT) {
			if (boardPoint.isType(POSSIBLE_MOVE) 
					&& this.moveBuilder.getCurrentPhase().moveType === BeyondTheMapsMoveType.EXPLORE_SEA) {
				// They're trying to move their Ship there! And they can! Exciting!
				this.moveBuilder.getCurrentPhase().endPoint = npText;
				var possiblePaths = boardPoint.possibleMovementPaths;
				this.theGame.hidePossibleMovePoints();

				var move = this.moveBuilder.getNotationMove(this.gameNotation);
				this.theGame.runNotationMove(move, this.moveBuilder.getPhaseIndex(), false, true, true, true);

				var landPointsPossible = this.theGame.markPossibleLandPointsForMovement(this.moveBuilder.getCurrentPhase().startPoint, boardPoint, possiblePaths, this.moveBuilder.getPlayer());

				if (landPointsPossible.length > 1) {
					// Land points are marked on the board as Possible points now
					this.moveBuilder.setStatus(WAITING_FOR_BONUS_ENDPOINT);
				} else {
					if (landPointsPossible.length > 0) {
						this.moveBuilder.getCurrentPhase().landPoint = landPointsPossible[0].getNotationPointString();
						this.theGame.board.placeLandPiecesForPlayer(this.getCurrentPlayer(), [this.moveBuilder.getCurrentPhase().landPoint]);
						this.theGame.board.fillEnclosedLandForPlayer(this.getCurrentPlayer());
					}
					this.theGame.hidePossibleMovePoints();
					this.completeMovePhase();
				}
			} else if (boardPoint.isType(POSSIBLE_MOVE) 
					&& this.moveBuilder.getCurrentPhase().moveType === BeyondTheMapsMoveType.EXPLORE_LAND) {
				// Adding land woo!
				this.theGame.hidePossibleMovePoints();
				if (!this.moveBuilder.getCurrentPhase().landPoints) {
					this.moveBuilder.getCurrentPhase().landPoints = [];
				}
				this.moveBuilder.getCurrentPhase().landPoints.push(htmlPoint.getAttribute("name"));

				var move = this.moveBuilder.getNotationMove(this.gameNotation);
				this.theGame.runNotationMove(move, this.moveBuilder.getPhaseIndex(), false, true, true, true);

				var exploreLandNumber = 3;
				if (gameOptionEnabled(EDGES_MOVE_4_2)) {
					exploreLandNumber = 2;
				} else if (gameOptionEnabled(EDGES_DICE_FOR_MOVEMENT)) {
					var diceRolls = this.getDiceRolls();
					exploreLandNumber = diceRolls.low;
				}

				if (this.moveBuilder.getCurrentPhase().landPoints.length < exploreLandNumber) {
					// More!
					var landIsPossible = this.theGame.revealPossibleContinueExploreLandPoints(this.getCurrentPlayer(), boardPoint);
					if (!landIsPossible) {
						this.completeMovePhase();
					}
				} else {
					this.completeMovePhase();
				}
			}
		} else if (this.moveBuilder.getStatus() === WAITING_FOR_BONUS_ENDPOINT) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				this.moveBuilder.getCurrentPhase().landPoint = npText;
				
				this.theGame.board.placeLandPiecesForPlayer(this.getCurrentPlayer(), [this.moveBuilder.getCurrentPhase().landPoint]);
				this.theGame.board.fillEnclosedLandForPlayer(this.getCurrentPlayer());
				this.theGame.hidePossibleMovePoints();
				
				this.completeMovePhase();
			}
		}
	}

	getDiceRolls() {
		var randomizer = getRandomizer(this.randomSeed);

		var roll1 = Math.floor(randomizer.random() * 6 + 1);
		var roll2 = Math.floor(randomizer.random() * 6 + 1);

		var diceRolls = {
			high: roll1 > roll2 ? roll1 : roll2,
			low: roll1 < roll2 ? roll1 : roll2
		};

		debug(diceRolls);

		return diceRolls;
	}

	completeMove() {
		var move = this.moveBuilder.getNotationMove(this.gameNotation);

		// Move all set. Add it to the notation!
		this.gameNotation.addMove(move);

		if (playingOnlineGame()) {
			callSubmitMove();
		} else if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
			this.startOnlineGame();
		} else {
			finalizeMove();
		}

		if (this.mctsGame.game.state.playerName !== move.player) {
			// this.playMctsMove();
			// this.computerMove();
		}
	}

	completeMovePhase() {
		this.messageToPlayer = "";
		refreshMessage();

		var moveIsComplete = this.moveBuilder.getNumPhases() >= 2
							|| this.gameNotation.moves.length === 0;

		this.moveBuilder.setStatus(BRAND_NEW);

		if (moveIsComplete) {
			this.completeMove();
		}
	}

	getTileMessage(tileDiv) {
		var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
		var tileId = parseInt(tileDiv.getAttribute("id"));

		var tile = new BeyondTheMapsTile(null, divName.substring(1), divName.charAt(0));

		var message = [];

		var ownerName = HOST;
		if (divName.startsWith('G')) {
			ownerName = GUEST;
		}

		var tileCode = divName.substring(1);

		var heading = PlaygroundTile.getTileName(tileCode);

		message.push(tile.ownerName + "'s tile");

		return {
			heading: heading,
			message: message
		}
	}

	getPointMessage(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		var heading;
		var message = [];
		if (boardPoint.hasTile()) {
			heading = boardPoint.tile.getName();
		}

		return {
			heading: heading,
			message: message
		}
	}

	playAiTurn(finalizeCallback) {
		var self = this;
		var playerMoveNum = this.gameNotation.moves.length;

		setTimeout(function() {
			var move = activeAi.getMove(self.theGame.getCopy(), playerMoveNum);
			if (!move) {
				return;
			}
			self.gameNotation.addMove(move);
			finalizeCallback();
		}, 500);
	}

	startAiGame(finalizeMove) {
		this.playAiTurn(finalizeMove);
	}

	getAiList() {
		return [new BeyondTheMapsStrategicAI()];
	}

	getCurrentPlayer() {
		if (this.gameNotation.moves.length % 2 === 0) {
			return HOST;
		} else {
			return GUEST;
		}
	}

	cleanup() {
		// Nothing.
	}

	isSolitaire() {
		return false;
	}

	// Convert row/col to chess-like notation (e.g., "c6")
	// Shared logic used by both controller and actuator
	static rowColToChessNotation(row, col) {
		const is12x12 = gameOptionEnabled(EDGES_12x12_GAME);
		const offset = is12x12 ? 3 : 0;
		const boardSize = is12x12 ? 12 : 18;
		const adjustedCol = col - offset;
		const adjustedRow = row - offset;
		const letter = String.fromCharCode('a'.charCodeAt(0) + adjustedCol);
		const number = boardSize - adjustedRow;
		return letter + number;
	}

	// Convert notation point string (e.g., "-5,3") to chess-like format (e.g., "c6")
	toChessNotation(pointStr) {
		const parts = pointStr.split(',');
		const x = parseInt(parts[0]);
		const y = parseInt(parts[1]);
		// Convert back to row/col (standard Pai Sho coordinate system)
		const col = x + 8;
		const row = 8 - y;
		return BeyondTheMapsController.rowColToChessNotation(row, col);
	}

	buildNotationString(move) {
		const playerCode = move.player === HOST ? 'H' : 'G';
		let notation = move.moveNum + playerCode + '.';

		if (move.moveData && move.moveData.phases) {
			const phaseParts = [];
			move.moveData.phases.forEach(phase => {
				if (phase.moveType === BeyondTheMapsMoveType.EXPLORE_SEA) {
					let seaPart = this.toChessNotation(phase.startPoint) + '-' + this.toChessNotation(phase.endPoint);
					if (phase.landPoint) {
						seaPart += '+' + this.toChessNotation(phase.landPoint);
					}
					phaseParts.push(seaPart);
				} else if (phase.moveType === BeyondTheMapsMoveType.EXPLORE_LAND) {
					if (phase.landPoints && phase.landPoints.length > 0) {
						const chessPoints = phase.landPoints.map(p => this.toChessNotation(p));
						phaseParts.push('+' + chessPoints.join(','));
					}
				}
			});
			notation += phaseParts.join(';');
		}

		return notation;
	}

	setGameNotation(newGameNotation) {
		this.gameNotation.setNotationText(newGameNotation);
	}

	getSkipToIndex(currentMoveIndex) {
		for (var i = currentMoveIndex; i < this.gameNotation.moves.length; i++) {
			if (this.gameNotation.moves[i].moveType === PlaygroundMoveType.hideTileLibraries) {
				return i;
			}
		}
		return currentMoveIndex;
	}

	setAnimationsOn(isAnimationsOn) {
		this.actuator.setAnimationOn(isAnimationsOn);
	}

	runMove(move, withActuate, moveAnimationBeginStep, skipAnimation) {
		this.currentlyRunningMove = true;
		if (withActuate && !skipAnimation) {
			var numPhases = move.moveData.phases.length;
			var phaseIndex = 0;
			this.theGame.runNotationMove(move, phaseIndex, withActuate, false, phaseIndex !== (numPhases - 1));
			// refreshMessage();
			phaseIndex++;
			if (numPhases > phaseIndex) {
				debug("MORE THAN ONE PHASE");
				var phaseInterval = setTimeout(() => {
					this.theGame.runNotationMove(move, phaseIndex, withActuate);
					refreshMessage();
					phaseIndex++;
					if (phaseIndex >= numPhases) {
						clearTimeout(phaseInterval);
						this.currentlyRunningMove = false;
					}
				}, (replayIntervalLength * 0.9) / numPhases);
			} else {
				this.currentlyRunningMove = false;
			}
		} else {
			for (var phaseIndex = 0; phaseIndex < move.moveData.phases.length; phaseIndex++) {
				this.theGame.runNotationMove(move, phaseIndex, withActuate);
			}
			this.currentlyRunningMove = false;
		}

		// 
		if (this.mctsGame) {
			this.mctsGame.game.playMove(move);
		}
		if (this.jsMctsGame) {
			this.jsMctsGame.game.doAction(new BtmAction(move));
		}
	}

	isStillRunningMove() {
		return this.currentlyRunningMove;
	}

	getMoveNumber() {
		return this.gameNotation.moves.length;
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

}
