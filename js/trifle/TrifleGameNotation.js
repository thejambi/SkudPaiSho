// Trifle Notation

// --------------------------------------------- // 

import { gameController } from '../GameState';
import { BRAND_NEW } from '../GameConstants';
import { DEPLOY, DRAW_ACCEPT, GUEST, MOVE, SETUP, TEAM_SELECTION } from '../CommonNotationObjects';
import { debug } from '../GameData';
import {
  getOpponentName,
  getPlayerCodeFromName,
} from '../pai-sho-common/PaiShoPlayerHelp';
import { OldTrifleNotationMove } from './OldTrifleGameNotation';

export const TrifleNotationBuilderStatus = {
	PROMPTING_FOR_TARGET: "PROMPTING_FOR_TARGET"
};

/* Because it's just json, the NotationMove object here might not be used */
export class TrifleNotationMove {
	constructor(text, promptTargetData) {
		this.fullMoveText = text;
		this.analyzeMove();
		this.promptTargetData = promptTargetData;
	}

	analyzeMove() {
		this.valid = true;
		this.moveData = JSON.parse(this.fullMoveText);
	}

	isValidNotation() {
		return this.valid;
	}

	equals(otherMove) {
		return this.fullMoveText === otherMove.fullMoveText;
	}
}


// --------------------------------------- //

export class TrifleNotationBuilder {
	constructor() {
		// this.moveNum;	// Let's try making this magic
		// this.player;		// Magic
		this.moveType;

		// DEPLOY
		this.tileType;
		this.endPoint;

		// MOVE
		this.startPoint;
		//this.endPoint; // Also used in DEPLOY

		this.status = BRAND_NEW;
	}

	getNotationMove(moveNum, player) {
		const move = {
			moveNum: moveNum,
			player: player,
			moveType: this.moveType
		};

		if (this.moveType === SETUP) {
			move.setupNum = this.boardSetupNum;
		} if (this.moveType === TEAM_SELECTION) {
			move.teamSelection = this.teamSelection;
		} else if (this.moveType === MOVE) {
			move.startPoint = this.startPoint.pointText;
			move.endPoint = this.endPoint.pointText;
		} else if (this.moveType === DEPLOY) {
			move.tileType = this.tileType;
			move.endPoint = this.endPoint.pointText;
		}

		// if (this.promptTargetData && Object.keys(this.promptTargetData).length > 0) {
		if (this.promptTargetData) {
			move.promptTargetData = this.promptTargetData;
		}

		if (this.offerDraw) {
			move.offerDraw = true;
		}

		// TODO notation cleanup
		if (this.endPointMovementPath) {
			const movementPathNotationPoints = [];
			this.endPointMovementPath.forEach(boardPoint => {
				movementPathNotationPoints.push(boardPoint.getNotationPointString());
			});
			move.endPointMovementPath = movementPathNotationPoints;
		}

		/* Catch all generic move data */
		if (this.moveData) {
			move.moveData = this.moveData;
		}

		return move;
	}
}

// --------------------------------------- //

export class TrifleGameNotation {
	constructor(firstPlayer) {
		this.notationText = "";
		this.moves = [];
		this.firstPlayer = firstPlayer;
		this.secondPlayer = getOpponentName(firstPlayer);
	}

	setNotationText(text) {
		this.notationText = text;
		this.loadMoves();
	}

	addMove(move) {
		this.moves.push(move);
	}

	removeLastMove() {
		const removedMove = this.moves.pop();
		
		debug("Removed Move:");
		debug(removedMove);
	}

	getPlayerMoveNum() {
		var moveNum = 0;
		var lastMove = this.moves[this.moves.length - 1];

		if (lastMove) {
			moveNum = lastMove.moveNum;
			if (lastMove.player === GUEST) {
				moveNum++;
			}
		}
		return moveNum;
	}

	getNotationMoveFromBuilder(builder) {
		let moveNum = 0;

		const lastMove = this.moves[this.moves.length - 1];

		if (lastMove) {
			moveNum = lastMove.moveNum;
			if (lastMove.player === this.secondPlayer) {
				moveNum++;
			}
		}

		return builder.getNotationMove(moveNum, builder.currentPlayer);
	}

	loadMoves() {
		this.moves = [];
		if (this.notationText) {
			try {
				this.moves = JSON.parse(this.notationText);
			} catch (e) {
				// Old text notation format — parse and convert
				this.moves = this.parseOldNotation(this.notationText);
			}
		}
	}

	parseOldNotation(text) {
		const moves = [];
		let lines = [];
		if (text.includes(';')) {
			lines = text.split(';');
		} else {
			lines = [text];
		}

		lines.forEach(function(line) {
			const oldMove = new OldTrifleNotationMove(line);
			if (!oldMove.isValidNotation()) {
				return;
			}

			const newMove = {
				moveNum: oldMove.moveNum,
				player: oldMove.player,
				moveType: oldMove.moveType
			};

			if (oldMove.moveType === TEAM_SELECTION) {
				newMove.teamSelection = oldMove.teamTileCodes.join(',');
			} else if (oldMove.moveType === DEPLOY) {
				newMove.tileType = oldMove.tileType;
				newMove.endPoint = oldMove.endPoint.pointText;
			} else if (oldMove.moveType === MOVE) {
				newMove.startPoint = oldMove.startPoint.pointText;
				newMove.endPoint = oldMove.endPoint.pointText;
			} else if (oldMove.moveType === DRAW_ACCEPT) {
				// No extra fields needed
			}

			if (oldMove.offerDraw) {
				newMove.offerDraw = true;
			}

			moves.push(newMove);
		});

		return moves;
	}

	buildSimplifiedNotationString(move) {
		if (gameController.buildNotationString) {
			return gameController.buildNotationString(move);
		}

		const playerCode = getPlayerCodeFromName(move.player);
		const moveNum = move.moveNum;

		return moveNum + playerCode + ".¯\\_(ツ)_/¯";
	}

	getNotationHtml() {
		let notationHtml = "";

		this.moves.forEach((move) => {
			notationHtml += this.buildSimplifiedNotationString(move) + "<br />";
		});

		return notationHtml;
	}

	notationTextForUrl() {
		// TODO Could remove the 'moveType' field if it is equal to 'MOVE'
		const str = JSON.stringify(this.moves, function(key, value) {
			if (key === 'animationInfo') return undefined;
			if (key === 'promptTargetData' && value && Object.keys(value).length === 0) return undefined;
			return value;
		});
		return str;
	}

	getNotationForEmail() {
		let notationHtml = "";

		this.moves.forEach((move) => {
			notationHtml += this.buildSimplifiedNotationString(move) + "[BR]";
		});

		return notationHtml;
	}

	getLastMoveText() {
		return this.moves[this.moves.length - 1].fullMoveText;
	}

	getLastMoveNumber() {
		return this.moves[this.moves.length - 1].moveNum;
	}

	lastMoveHasDrawOffer() {
		return this.moves[this.moves.length - 1] 
			&& this.moves[this.moves.length - 1].offerDraw;
	}
}
