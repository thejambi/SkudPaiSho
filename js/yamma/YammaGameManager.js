/**
 * YammaGameManager - Manages game state and turns
 */

import { YammaBoard, PLAYER } from './YammaBoard';
import { GUEST, HOST } from '../CommonNotationObjects';

export class YammaGameManager {
	constructor(actuator) {
		this.actuator = actuator;
		this.board = new YammaBoard();

		this.currentPlayer = HOST; // HOST plays white, GUEST plays blue
		this.winner = null;
		this.winningAngle = null;
		this.moveCount = 0;
		this.isCopy = false;
	}

	actuate() {
		if (this.isCopy) {
			return;
		}
		if (this.actuator) {
			// Determine current player color based on move count
			// HOST (White) plays on even moves, GUEST (Blue) plays on odd moves
			const currentPlayerColor = this.moveCount % 2 === 0 ? PLAYER.WHITE : PLAYER.BLUE;
			this.actuator.actuate(this.board, this.winner, this.winningAngle, this.lastMove, currentPlayerColor);
		}
	}

	getPlayerColor(player) {
		return player === HOST ? PLAYER.WHITE : PLAYER.BLUE;
	}

	runNotationMove(move, withActuate) {
		if (this.winner) {
			return; // Game is over
		}

		const color = this.getPlayerColor(move.player);
		const rotation = move.rotation || 0;
		const cube = this.board.placeCube(move.row, move.col, move.level, color, rotation);

		if (cube) {
			this.lastMove = { row: move.row, col: move.col, level: move.level, rotation };
			this.moveCount++;

			// Check for winner
			const result = this.board.checkWinner();
			if (result) {
				this.winner = result.winner === PLAYER.WHITE ? HOST : GUEST;
				this.winningAngle = result.angle;
			}
		}

		if (withActuate) {
			this.actuate();
		}
	}

	getWinner() {
		return this.winner;
	}

	getWinReason() {
		if (!this.winner) {
			return "";
		}

		const angleNames = ['Front', 'Left', 'Right'];
		const angleName = angleNames[this.winningAngle] || 'unknown';

		return " achieved 4-in-a-row from the " + angleName + " perspective";
	}

	getWinResultTypeCode() {
		if (!this.winner) {
			return null;
		}
		return 1;
	}

	hasEnded() {
		return this.winner !== null || this.board.isBoardFull();
	}

	getPossibleMoves() {
		return this.board.getPossibleMoves();
	}

	getCopy() {
		const copy = new YammaGameManager();
		copy.board = this.board.getCopy();
		copy.currentPlayer = this.currentPlayer;
		copy.winner = this.winner;
		copy.winningAngle = this.winningAngle;
		copy.moveCount = this.moveCount;
		copy.lastMove = this.lastMove ? { ...this.lastMove } : null;
		copy.isCopy = true;
		return copy;
	}
}
