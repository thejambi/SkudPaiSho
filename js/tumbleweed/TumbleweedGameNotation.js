// Tumbleweed Notation

import { GUEST, HOST } from '../CommonNotationObjects';
import { getPlayerCodeFromName, getPlayerNameFromCode, guestPlayerCode, hostPlayerCode } from '../pai-sho-common/PaiShoPlayerHelp';
import { CHOOSE_NEUTRAL_STACK_SPACE, gameOptionEnabled } from '../GameOptions';
import { debug } from '../GameData';
import { BRAND_NEW } from '../GameConstants';

// --------------------------------------------- //

const TumbleweedNotationVars = {
	SWAP: "Swap",
	PASS_TURN: "-"
};

export class TumbleweedNotationMove {
	constructor(text) {
		this.fullMoveText = text;
		this.analyzeMove();
	}

	analyzeMove() {
		this.valid = true;

		// Get move number
		var parts = this.fullMoveText.split(".");

		var moveNumAndPlayer = parts[0];

		this.moveNum = parseInt(moveNumAndPlayer.slice(0, -1));
		this.playerCode = moveNumAndPlayer.charAt(moveNumAndPlayer.length - 1);

		// Get player (Guest or Host)
		if (this.playerCode === 'G') {
			this.player = GUEST;
		} else if (this.playerCode === 'H') {
			this.player = HOST;
		} else if (this.playerCode === "N") {
			this.player = "NEUTRAL";
		}

		var moveText = parts[1];

		// If no move text, ignore and move on to next
		if (!moveText) {
			this.valid = false;
			return;
		}

		// Move string like: 'a1' or 'd3' or pass turn
		if (moveText === TumbleweedNotationVars.PASS_TURN) {
			this.passTurn = true;
		} else if (moveText === TumbleweedNotationVars.SWAP) {
			this.swap = true;
		} else if (moveText.includes(hostPlayerCode) || moveText.includes(guestPlayerCode) || moveText.includes("N")) {
			var placementPlayerCode = moveText.substring(0,1);
			this.initialPlacementForPlayer = placementPlayerCode === "N" ? "NEUTRAL" : getPlayerNameFromCode(placementPlayerCode);
			this.deployPoint = moveText.substring(1);
		} else {
			this.deployPoint = moveText;
		}
	}

	isValidNotation() {
		return this.deployPoint || this.passTurn || this.swap;
	}

	equals(otherMove) {
		return this.fullMoveText === otherMove.fullMoveText;
	}
}

// --------------------------------------- //

export class TumbleweedNotationBuilder {
	constructor() {
		this.deployPoint;
		this.passTurn = false;
		this.swap = false;

		this.status = BRAND_NEW;
	}

	getNotationMove(moveNum, player) {
		var notationLine = moveNum + player.charAt(0) + ".";
		if (this.passTurn) {
			notationLine += TumbleweedNotationVars.PASS_TURN;
		} else if (this.swap) {
			notationLine += TumbleweedNotationVars.SWAP;
		} else if (this.initialPlacementForPlayer) {
			var playerCode = this.initialPlacementForPlayer === "NEUTRAL" ? "N" : getPlayerCodeFromName(this.initialPlacementForPlayer);
			notationLine += playerCode + this.deployPoint;
		} else if (this.deployPoint) {
			notationLine += this.deployPoint;
		}

		return new TumbleweedNotationMove(notationLine);
	}

	setDeployPoint(npText) {
		this.deployPoint = npText;
	}

	moveComplete() {
		return this.deployPoint || this.passTurn;
	}
}

// --------------------------------------- //

export class TumbleweedGameNotation {
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
		var moveNum = 0;
		var lastMove = this.moves[this.moves.length-1];

		if (lastMove) {
			moveNum = lastMove.moveNum;
			if (lastMove.player === GUEST) {
				moveNum++;
			}
		}
		return moveNum;
	}

	getNotationMoveFromBuilder(builder) {
		var moveNum = 0;
		var player = HOST;

		var lastMove = this.moves[this.moves.length-1];

		if (lastMove) {
			moveNum = lastMove.moveNum;
			if (lastMove.player === GUEST) {
				moveNum++;
			} else if (
					(gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE) && lastMove.initialPlacementForPlayer === "NEUTRAL")
					|| (!gameOptionEnabled(CHOOSE_NEUTRAL_STACK_SPACE) && lastMove.initialPlacementForPlayer === HOST)
			) {
				moveNum++;
				player = GUEST;
			} else if (lastMove.moveNum <= 1) {
				player = HOST;
			} else {
				player = GUEST;
			}
		}

		return builder.getNotationMove(moveNum, player);
	}

	loadMoves() {
		this.moves = [];
		var lines = [];
		if (this.notationText) {
			if (this.notationText.includes(';')) {
				lines = this.notationText.split(";");
			} else {
				lines = [this.notationText];
			}
		}

		var self = this;
		var lastPlayer = GUEST;
		lines.forEach(function(line) {
			var move = new TumbleweedNotationMove(line);
			if (move.isValidNotation() && (move.player !== lastPlayer || move.moveNum <= 1)) {
				self.moves.push(move);
				lastPlayer = move.player;
			} else {
				debug("the player check is broken?");
			}
		});
	}

	getNotationHtml() {
		var lines = [];
		if (this.notationText) {
			if (this.notationText.includes(';')) {
				lines = this.notationText.split(";");
			} else {
				lines = [this.notationText];
			}
		}

		var notationHtml = "";

		lines.forEach(function (line) {
			notationHtml += line + "<br />";
		});

		return notationHtml;
	}

	notationTextForUrl() {
		var str = this.notationText;
		return str;
	}

	getNotationForEmail() {
		var lines = [];
		if (this.notationText) {
			if (this.notationText.includes(';')) {
				lines = this.notationText.split(";");
			} else {
				lines = [this.notationText];
			}
		}

		var notationHtml = "";

		lines.forEach(function (line) {
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
}
