/* Ginseng AI Helper */

import {
	MOVE,
	NotationPoint,
	RowAndColumn,
} from '../../CommonNotationObjects';
import { NON_PLAYABLE, POSSIBLE_MOVE } from '../../skud-pai-sho/SkudPaiShoBoardPoint';
import { TrifleNotationBuilder } from '../../trifle/TrifleGameNotation';

export class GinsengAiHelp {
	constructor() {
		this.moveNum = 0;
	}

	getAllPossibleMoves(game, player) {
		// Ginseng only has movement moves (no deployment - tiles are pre-placed)
		return this.getPossibleMovementMoves(game, player);
	}

	getPossibleMovementMoves(game, player) {
		const moves = [];
		const startPoints = this.getMovementStartPoints(game, player);

		for (let i = 0; i < startPoints.length; i++) {
			const startPoint = startPoints[i];

			game.revealPossibleMovePoints(startPoint, true);

			const endPoints = this.getPossibleMovePoints(game);

			for (let j = 0; j < endPoints.length; j++) {
				const notationBuilder = new TrifleNotationBuilder();
				notationBuilder.moveType = MOVE;
				notationBuilder.startPoint = new NotationPoint(this.getNotation(startPoint));
				notationBuilder.currentPlayer = player;

				const endPoint = endPoints[j];

				notationBuilder.endPoint = new NotationPoint(this.getNotation(endPoint));
				const move = notationBuilder.getNotationMove(this.moveNum, player);

				game.hidePossibleMovePoints(true);

				// Check for duplicates
				let isDuplicate = false;
				for (let x = 0; x < moves.length; x++) {
					if (this.movesAreEqual(moves[x], move)) {
						isDuplicate = true;
						break;
					}
				}

				if (!isDuplicate) {
					moves.push(move);
				}
			}
		}

		return moves;
	}

	movesAreEqual(move1, move2) {
		return move1.startPoint === move2.startPoint &&
			   move1.endPoint === move2.endPoint;
	}

	getPossibleMovePoints(game) {
		const points = [];

		game.board.cells.forEach((row) => {
			row.forEach((boardPoint) => {
				if (!boardPoint.isType(NON_PLAYABLE)) {
					if (boardPoint.isType(POSSIBLE_MOVE)) {
						points.push(boardPoint);
					}
				}
			});
		});

		return points;
	}

	getNotation(boardPoint) {
		return new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString;
	}

	getMovementStartPoints(game, player) {
		const points = [];
		for (let row = 0; row < game.board.cells.length; row++) {
			for (let col = 0; col < game.board.cells[row].length; col++) {
				const startPoint = game.board.cells[row][col];
				if (startPoint.hasTile() && startPoint.tile.ownerName === player) {
					points.push(game.board.cells[row][col]);
				}
			}
		}
		return points;
	}
}
