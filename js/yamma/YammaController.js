/**
 * YammaController - Main controller for Yamma game
 */

import { GUEST, HOST } from '../CommonNotationObjects';
import {
	activeAi,
	activeAi2,
	callSubmitMove,
	createGameIfThatIsOk,
	currentMoveIndex,
	finalizeMove,
	GameType,
	getCurrentPlayer,
	getGameOptionsMessageElement,
	myTurn,
	onlinePlayEnabled,
	playingOnlineGame,
	rerunAll,
	BRAND_NEW,
	WAITING_FOR_ENDPOINT
} from '../PaiShoMain';
import { gameOptionEnabled, YAMMA_PIE_RULE, YAMMA_SWAP_RULE } from '../GameOptions';
import { YammaActuator } from './YammaActuator';
import { PLAYER } from './YammaBoard';
import { YammaGameManager } from './YammaGameManager';
import {
	YammaGameNotation,
	YammaNotationBuilder,
	YammaNotationMove
} from './YammaGameNotation';
import { YammaRandomAI } from './ai/YammaRandomAI';
import { YammaStrategicAI } from './ai/YammaStrategicAI';

export class YammaController {
	constructor(gameContainer, isMobile) {
		this.isMobile = isMobile;

		// Create actuator with slot click callback
		// Callback receives (row, col, level, rotation) - rotation is undefined on first click
		this.actuator = new YammaActuator(
			gameContainer,
			isMobile,
			(row, col, level, rotation) => this.slotClicked(row, col, level, rotation),
			this.getHostTilesContainerDivs(),
			this.getGuestTilesContainerDivs()
		);

		this.resetGameManager();
		this.resetNotationBuilder();
		this.resetGameNotation();

		// Initial render to show available slots
		this.theGame.actuate();
	}

	getGameTypeId() {
		return GameType.Yamma.id;
	}

	completeSetup() {
		// Nothing special needed
	}

	resetGameManager() {
		this.theGame = new YammaGameManager(this.actuator);
	}

	resetNotationBuilder() {
		this.notationBuilder = new YammaNotationBuilder();
	}

	resetGameNotation() {
		this.gameNotation = this.getNewGameNotation();
	}

	getNewGameNotation() {
		return new YammaGameNotation();
	}

	getHostTilesContainerDivs() {
		return "<div class='yammaTileContainer'>" +
			"<div class='yammaPlayerIndicator yammaWhite'>White (Host)</div>" +
			"</div>";
	}

	getGuestTilesContainerDivs() {
		return "<div class='yammaTileContainer'>" +
			"<div class='yammaPlayerIndicator yammaBlue'>Blue (Guest)</div>" +
			"</div>";
	}

	callActuate() {
		this.theGame.actuate();
	}

	resetMove() {
		if (this.notationBuilder.status !== WAITING_FOR_ENDPOINT) {
			this.gameNotation.removeLastMove();
		}

		this.actuator.clearPossibleMoves();
		this.actuator.cancelRotationSelection();
		rerunAll();
	}

	getDefaultHelpMessageText() {
		return "<h4>Yamma</h4>" +
			"<p>Inspired by Khanat Sadomwattana's Yamma, this is a 3D four-in-a-row game " +
			"played on a triangular pyramid (tetrahedron).</p>" +
			"<p><strong>Objective:</strong> Be the first to get 4-in-a-row of your color " +
			"when viewed from any of the three perspectives.</p>" +
			"<p><strong>How to Play:</strong></p>" +
			"<ul>" +
			"<li>Players take turns placing cubes on available slots</li>" +
			"<li>Cubes stack in a triangular pyramid - when 3 cubes form a triangle, a new slot appears above</li>" +
			"<li>Each cube has 3 white faces and 3 blue faces at opposite corners</li>" +
			"<li>When placed, you see 2 faces of one color and 1 of the other from each viewing angle</li>" +
			"<li>Use the rotation arrows to orient your cube before confirming placement</li>" +
			"<li>Win by aligning 4 cubes of your color in a row from any viewing angle</li>" +
			"</ul>" +
			"<p><strong>Controls:</strong></p>" +
			"<ul>" +
			"<li>Click a slot marker to select placement position</li>" +
			"<li>Click the arrows to rotate the cube preview</li>" +
			"<li>Click the green button to confirm placement</li>" +
			"<li>Click elsewhere to cancel</li>" +
			"<li>Drag to rotate the view, scroll to zoom</li>" +
			"</ul>";
	}

	getAdditionalMessage() {
		const container = document.createElement('span');
		const moveCount = this.gameNotation.moves.length;

		if (this.theGame.getWinner()) {
			const winnerText = this.theGame.getWinner() === HOST ? 'White (Host)' : 'Blue (Guest)';
			const angleNames = ['Front', 'Left', 'Right'];
			const angleName = angleNames[this.theGame.winningAngle] || '';
			container.textContent = `${winnerText} wins! (4-in-a-row from ${angleName} view)`;
		} else if (this.actuator.pendingMove) {
			container.textContent = 'Use arrows to rotate, then click the green button to place.';
		} else if (moveCount === 0) {
			if (gameOptionEnabled(YAMMA_PIE_RULE)) {
				container.textContent = 'Pie Rule: Place your first cube — Guest may then claim it as their own.';
			} else {
				container.appendChild(document.createTextNode('Click a slot on the board to place your first cube.'));
				container.appendChild(getGameOptionsMessageElement(GameType.Yamma.gameOptions));
			}
		} else if (gameOptionEnabled(YAMMA_PIE_RULE) && moveCount === 1) {
			if (myTurn()) {
				container.appendChild(document.createTextNode('Pie Rule: Claim the Host\'s first piece as your own, or place a cube to play normally.'));
				container.appendChild(document.createElement('br'));
				const claimBtn = document.createElement('span');
				claimBtn.className = 'skipBonus';
				claimBtn.textContent = 'Claim Host\'s Piece';
				claimBtn.onclick = () => this.performPieRuleSwap();
				container.appendChild(claimBtn);
			} else {
				container.textContent = 'Pie Rule: Waiting for Guest to decide whether to claim your piece or place their own.';
			}
		} else if (gameOptionEnabled(YAMMA_SWAP_RULE) && moveCount < 2) {
			if (myTurn()) {
				const opponentName = moveCount === 0 ? 'Blue (Guest)' : 'White (Host)';
				container.textContent = `Swap Opening Rule: You are placing a cube for ${opponentName}.`;
			} else {
				const currentName = moveCount === 0 ? 'White (Host)' : 'Blue (Guest)';
				container.textContent = `Swap Opening Rule: ${currentName} is placing a cube for you.`;
			}
		}

		return container;
	}

	slotClicked(row, col, level, rotation) {
		if (this.theGame.hasEnded()) {
			return;
		}
		if (!myTurn()) {
			return;
		}
		if (currentMoveIndex !== this.gameNotation.moves.length) {
			return;
		}

		// Check if this is a valid move
		if (!this.theGame.board.canPlaceCube(row, col, level)) {
			return;
		}

		// If rotation is provided, complete the move with that rotation
		if (rotation !== undefined) {
			this.notationBuilder.setPoint(row, col, level, rotation);
			this.completeMove();
			return;
		}

		// No rotation provided - show rotation selection UI
		// Under Swap Opening Rule (or default new-game auto-add), first two placements
		// show the opponent's color since the cube will belong to them.
		const moveCount = this.gameNotation.moves.length;
		let playerColor = this.getCurrentPlayer() === HOST ? PLAYER.WHITE : PLAYER.BLUE;
		if (gameOptionEnabled(YAMMA_SWAP_RULE) && moveCount < 2) {
			playerColor = playerColor === PLAYER.WHITE ? PLAYER.BLUE : PLAYER.WHITE;
		}
		this.actuator.showRotationSelection(row, col, level, playerColor);
	}

	// Required for compatibility with Main's pointClicked
	pointClicked(htmlPoint) {
		// Not used for Yamma - we handle clicks in slotClicked
	}

	getTileMessage(tileDiv) {
		return '';
	}

	getPointMessage(htmlPoint) {
		return '';
	}

	playAiTurn(finalizeCallback) {
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

		var self = this;
		setTimeout(function() {
			var move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);
			if (!move) {
				return;
			}
			self.theGame.runNotationMove(move);
			self.gameNotation.addMove(move);
			finalizeCallback();
		}, 500);
	}

	startAiGame(finalizeCallback) {
		this.playAiTurn(finalizeCallback);
	}

	getAiList() {
		return [new YammaStrategicAI(), new YammaRandomAI()];
	}

	getCurrentPlayer() {
		return this.gameNotation.moves.length % 2 === 0 ? HOST : GUEST;
	}

	optionOkToShow(option) {
		if (option === YAMMA_SWAP_RULE) {
			return !gameOptionEnabled(YAMMA_PIE_RULE);
		}
		if (option === YAMMA_PIE_RULE) {
			return !gameOptionEnabled(YAMMA_SWAP_RULE);
		}
		return true;
	}

	performPieRuleSwap() {
		if (!myTurn()) return;
		if (this.theGame.hasEnded()) return;

		const swapMove = new YammaNotationMove('G:SWAP');
		this.theGame.runNotationMove(swapMove);
		this.gameNotation.addMove(swapMove);

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	cleanup() {
		if (this.actuator) {
			this.actuator.cleanup();
		}
	}

	isSolitaire() {
		return false;
	}

	setGameNotation(newGameNotation) {
		this.gameNotation.setNotationText(newGameNotation);
	}

	completeMove() {
		const player = this.getCurrentPlayer();
		const move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder, player);

		if (!move) {
			return;
		}

		this.theGame.runNotationMove(move);
		this.gameNotation.addMove(move);
		this.notationBuilder.reset();

		if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
			createGameIfThatIsOk(this.getGameTypeId());
		} else {
			if (playingOnlineGame()) {
				callSubmitMove();
			} else {
				finalizeMove();
			}
		}
	}
}
