// Trifle Notation

// --------------------------------------------- //

import { BRAND_NEW } from '../GameConstants';
import {
  DEPLOY,
  DRAW_ACCEPT,
  DRAW_OFFER,
  GUEST,
  HOST,
  MOVE,
  NotationPoint,
  TEAM_SELECTION,
} from '../CommonNotationObjects';
import { debug } from '../GameData';

export class OldTrifleNotationMove {
	constructor(text) {
		this.fullMoveText = text;
		this.analyzeMove();
	}

	analyzeMove() {
		this.valid = true;

		// Get move number
		const parts = this.fullMoveText.split(".");

		debug(parts);

		const moveNumAndPlayer = parts[0];

		this.moveNum = parseInt(moveNumAndPlayer.slice(0, -1));
		this.playerCode = moveNumAndPlayer.charAt(moveNumAndPlayer.length - 1);

		// Get player (Guest or Host)
		if (this.playerCode === 'G') {
			this.player = GUEST;
		} else if (this.playerCode === 'H') {
			this.player = HOST;
		}

		const moveText = parts[1];

		// If no move text, ignore and move on to next
		if (!moveText) {
			return;
		}

		// If starts with a ( then it's MOVE
		const char0 = moveText.charAt(0);
		if (char0 === '(') {
			this.moveType = MOVE;
		} else if (moveText.startsWith(DRAW_ACCEPT)) {	// If move is accepting a draw
			this.moveType = DRAW_ACCEPT;
		} else if (this.moveNum < 1) {
			this.moveType = TEAM_SELECTION;
			debug("they done selected a teeeem");
		} else {
			this.moveType = DEPLOY;
		}

		if (this.moveType === TEAM_SELECTION) {
			this.teamTileCodes = moveText.split(',');
		} else if (this.moveType === DEPLOY) {
			const openParenIndex = moveText.indexOf('(');
			if (openParenIndex > 0) {
				// debug("parens checks out");
			} else {
				debug("Failure to plant");
				this.valid = false;
			}

			this.tileType = moveText.substring(0, openParenIndex);

			if (moveText.endsWith(')') || moveText.endsWith(')' + DRAW_OFFER)) {
				this.endPoint = new NotationPoint(moveText.substring(moveText.indexOf('(')+1, moveText.indexOf(')')));
			} else {
				this.valid = false;
			}
		} else if (this.moveType === MOVE) {
			// Get the two points from string like: (-8,0)-(-6,3)
			const moveParts = moveText.substring(moveText.indexOf('(')+1).split(')-(');
			this.startPoint = new NotationPoint(moveParts[0]);
			this.endPoint = new NotationPoint(moveParts[1].substring(0, moveParts[1].indexOf(')')));
		}

		this.offerDraw = moveText.endsWith(DRAW_OFFER);
	}

	isValidNotation() {
		return this.valid;
	}

	equals(otherMove) {
		return this.fullMoveText === otherMove.fullMoveText;
	}
}

// --------------------------------------- //

export class OldTrifleNotationBuilder {
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
		let notationLine = moveNum + player.charAt(0) + ".";
		if (this.moveType === TEAM_SELECTION) {
			notationLine += this.teamSelection;
		} else if (this.moveType === MOVE) {
			notationLine += "(" + this.startPoint.pointText + ")-(" + this.endPoint.pointText + ")";
		} else if (this.moveType === DEPLOY) {
			notationLine += this.tileType + "(" + this.endPoint.pointText + ")";
		} else if (this.moveType === DRAW_ACCEPT) {
			notationLine += DRAW_ACCEPT;
		}

		if (this.offerDraw) {
			notationLine += DRAW_OFFER;
		}

		return new OldTrifleNotationMove(notationLine);
	}
}

// --------------------------------------- //

export class OldTrifleGameNotation {
	constructor() {
		this.notationText = "";
		this.moves = [];
	}

	setNotationText(text) {
		this.notationText = text;
		this.loadMoves();
	}

	addNotationLine(text) {
		this.notationText += ";" + text.trim();
		this.loadMoves();
	}

	addMove(move) {
		if (this.notationText) {
			this.notationText += ";" + move.fullMoveText;
		} else {
			this.notationText = move.fullMoveText;
		}
		this.loadMoves();
	}

	removeLastMove() {
		this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
		this.loadMoves();
	}

	getPlayerMoveNum() {
		let moveNum = 0;
		const lastMove = this.moves[this.moves.length-1];

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
		let player = HOST;

		const lastMove = this.moves[this.moves.length-1];

		if (lastMove) {
			moveNum = lastMove.moveNum;
			if (lastMove.player === GUEST) {
				moveNum++;
			} else {
				player = GUEST;
			}
		}

		return builder.getNotationMove(moveNum, player);
	}

	loadMoves() {
		this.moves = [];
		let lines = [];
		if (this.notationText) {
			if (this.notationText.includes(';')) {
				lines = this.notationText.split(";");
			} else {
				lines = [this.notationText];
			}
		}

		let lastPlayer = GUEST;
		lines.forEach((line) => {
			const move = new OldTrifleNotationMove(line);
			if (move.isValidNotation() && move.player !== lastPlayer) {
				this.moves.push(move);
				lastPlayer = move.player;
			} else {
				debug("the player check is broken?");
			}
		});
	}

	getNotationHtml() {
		let lines = [];
		if (this.notationText) {
			if (this.notationText.includes(';')) {
				lines = this.notationText.split(";");
			} else {
				lines = [this.notationText];
			}
		}

		let notationHtml = "";

		lines.forEach((line) => {
			notationHtml += line + "<br />";
		});

		return notationHtml;
	}

	notationTextForUrl() {
		const str = this.notationText;
		return str;
	}

	getNotationForEmail() {
		let lines = [];
		if (this.notationText) {
			if (this.notationText.includes(';')) {
				lines = this.notationText.split(";");
			} else {
				lines = [this.notationText];
			}
		}

		let notationHtml = "";

		lines.forEach((line) => {
			notationHtml += line + "[BR]";
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
