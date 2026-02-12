/* Skud Pai Sho Notation */

import {
  ARRANGING,
  GUEST,
  HOST,
  NotationPoint,
  PLANTING,
} from '../CommonNotationObjects';
import { BRAND_NEW } from '../GameConstants';
import { SkudPaiShoTile } from './SkudPaiShoTile';
import { debug } from '../GameData';
import { sameStart, simpleCanonRules } from './SkudPaiShoRules';

export class SkudPaiShoNotationMove {
	constructor(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

	analyzeMove() {
	this.valid = true;

	// Get move number
	const parts = this.fullMoveText.split(".");

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
	this.moveTextOnly = moveText;

	// If no move text, ignore and move on to next
	if (!moveText) {
		return;
	}

	if (this.moveNum === 0) {
		// Keep the accent tiles listed in move
		// Examples: 0H.R,R,B,K ; 0G.B,W,K,K ;
		this.accentTiles = moveText.split(',');
		return;
	}

	// If starts with an R or W, then it's Planting
	const char0 = moveText.charAt(0);
	if (char0 === 'R' || char0 === 'W') {
		this.moveType = PLANTING;
	} else if (char0 === '(') {
		this.moveType = ARRANGING;
	}

	if (this.moveType === PLANTING) {
		// Planting move stuff
		const char1 = moveText.charAt(1);
		this.plantedFlowerType = char0 + "" + char1;

		if (moveText.charAt(2) === '(') {
			// debug("parens checks out");
		} else {
			debug("Failure to plant");
			this.valid = false;
		}

		if (moveText.endsWith(')')) {
			this.endPoint = new NotationPoint(moveText.substring(moveText.indexOf('(')+1, moveText.indexOf(')')));
		} else {
			this.valid = false;
		}
	} if (this.moveType === ARRANGING) {
		// Arranging move stuff

		// Get the two points from string like: (-8,0)-(-6,3)
		const parts = moveText.substring(moveText.indexOf('(')+1).split(')-(');

		// parts.forEach(function(val){console.log(val);});

		this.startPoint = new NotationPoint(parts[0]);

		// parts[1] may have harmony bonus
		this.endPoint = new NotationPoint(parts[1].substring(0, parts[1].indexOf(')')));

		if (parts[1].includes('+') || parts[1].includes('_')) {
			// Harmony Bonus!
			let bonusChar = '+';
			if (parts[1].includes('_')) {
				bonusChar = '_';
			}
			// Get only that part:
			const bonus = parts[1].substring(parts[1].indexOf(bonusChar)+1);
			
			this.bonusTileCode = bonus.substring(0,bonus.indexOf('('));

			if (parts.length > 2) {
				this.bonusEndPoint = new NotationPoint(bonus.substring(bonus.indexOf('(')+1));
				this.boatBonusPoint = new NotationPoint(parts[2].substring(0, parts[2].indexOf(')')));
			} else {
				this.bonusEndPoint = new NotationPoint(bonus.substring(bonus.indexOf('(')+1, bonus.indexOf(')')));
			}
		}
	}
	}

	hasHarmonyBonus() {
	return typeof this.bonusTileCode !== 'undefined';
	}

	isValidNotation() {
	return this.valid;
	}

	equals(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
	}



// --------------------------------------- //
}

export class SkudPaiShoNotationBuilder {
	constructor() {
	// this.moveNum;	// Let's try making this magic
	// this.player;		// Magic
	this.moveType;

	// PLANTING
	this.plantedFlowerType;
	this.endPoint;

	// ARRANGING
	this.startPoint;
	//this.endPoint; // Also used in Planting
	this.bonusTileCode;
	this.bonusEndPoint;
	this.boatBonusPoint;

	this.status = BRAND_NEW;
}

	getFirstMoveForHost(tileCode) {
	const builder = new SkudPaiShoNotationBuilder();
	builder.moveType = PLANTING;
	builder.plantedFlowerType = SkudPaiShoTile.getClashTileCode(tileCode);

	if (simpleCanonRules || sameStart) {
		builder.plantedFlowerType = tileCode;
	}

	builder.endPoint = new NotationPoint("0,8");
	return builder;
	}

	getNotationMove(moveNum, player) {
	const bonusChar = '+';
	// if (onlinePlayEnabled) {
	// 	bonusChar = '_';
	// }
	let notationLine = moveNum + player.charAt(0) + ".";
	if (this.moveType === ARRANGING) {
		notationLine += "(" + this.startPoint.pointText + ")-(" + this.endPoint.pointText + ")";
		if (this.bonusTileCode && this.bonusEndPoint) {
			notationLine += bonusChar + this.bonusTileCode + "(" + this.bonusEndPoint.pointText + ")";
			if (this.boatBonusPoint) {
				notationLine += "-(" + this.boatBonusPoint.pointText + ")";
			}
		}
	} else if (this.moveType === PLANTING) {
		notationLine += this.plantedFlowerType + "(" + this.endPoint.pointText + ")";
	}
	
	return new SkudPaiShoNotationMove(notationLine);
	}

// --------------------------------------- //


}

export class SkudPaiShoGameNotation {
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

	let player;
	
	if (lastMove) {
		moveNum = lastMove.moveNum;
		// At game beginning:
		if (lastMove.moveNum === 0 && lastMove.player === HOST) {
			player = GUEST;
		} else if (lastMove.moveNum === 0 && lastMove.player === GUEST) {
			moveNum++;
			player = GUEST;
		} else if (lastMove.player === HOST) {	// Usual
			moveNum++;
		} else {
			player = HOST;
		}
	}
	return moveNum;
	}

	getNotationMoveFromBuilder(builder) {
	// Example simple Arranging move: 7G.(8,0)-(7,1)

	let moveNum = 1;
	let player = GUEST;

	const lastMove = this.moves[this.moves.length-1];

	if (lastMove) {
		moveNum = lastMove.moveNum;
		// At game beginning:
		if (lastMove.moveNum === 0 && lastMove.player === HOST) {
			player = GUEST;
		} else if (lastMove.moveNum === 0 && lastMove.player === GUEST) {
			moveNum++;
			player = GUEST;
		} else if (lastMove.player === HOST) {	// Usual
			moveNum++;
		} else {
			player = HOST;
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

	const self = this;
	let lastPlayer = HOST;
	lines.forEach(function(line) {
		const move = new SkudPaiShoNotationMove(line);
		if (move.moveNum === 0 && move.isValidNotation()) {
			self.moves.push(move);
		} else if (move.isValidNotation() && move.player !== lastPlayer) {
			self.moves.push(move);
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

	lines.forEach(function (line) {
		notationHtml += line + "<br />";
	});

	return notationHtml;
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

	lines.forEach(function (line) {
		notationHtml += line + "[BR]";
	});

	return notationHtml;
	}

	notationTextForUrl() {
	const str = this.notationText;
	return str;
	}

	getLastMoveText() {
	return this.moves[this.moves.length - 1].fullMoveText;
	}

	getLastMoveNumber() {
	return this.moves[this.moves.length - 1].moveNum;
	}


}
