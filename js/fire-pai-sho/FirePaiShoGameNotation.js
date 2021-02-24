/* Fire Pai Sho Notation */

function FirePaiShoNotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

FirePaiShoNotationMove.prototype.analyzeMove = function() {
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
	}

	var moveText = parts[1];
	this.moveTextOnly = moveText;

	// If no move text, ignore and move on to next
	if (!moveText) {
		return;
	}

	//TAKING OUT THE ACCENT TILES BIT
//	if (this.moveNum === 0) {
//		// Keep the accent tiles listed in move
//		// Examples: 0H.R,R,B,K ; 0G.B,W,K,K ;
//		this.accentTiles = moveText.split(',');
//		return;
//	}



	var char0 = moveText.charAt(0);

//	NEEDN'T BE BASICS TO PLANT
//	if (char0 === 'R' || char0 === 'W') {
//		this.moveType = PLANTING;
//	} else 

	// Get the two points from string like: (-8,0)-(-6,3)
	var parts = moveText.substring(moveText.indexOf('(')+1).split(')-(');

	if (parts.length === 2) {
		this.moveType = ARRANGING;
	}
	else {
		this.moveType = PLANTING;
	}

	if (this.moveType === PLANTING) {
		// Planting move stuff
		//console.log("We're planting!");
		if (!((char0 === 'R') || (char0 === 'W'))) {
			this.plantedFlowerType = char0;
		}
		else{
		var char1 = moveText.charAt(1);
		this.plantedFlowerType = char0 + "" + char1;
		}

//		if (moveText.charAt(2) === '(') {
//			// debug("parens checks out");
//		} else {
//			debug("Failure to plant");
//			this.valid = false;
//		}

		if (moveText.endsWith(')')) {
			this.endPoint = new NotationPoint(moveText.substring(moveText.indexOf('(')+1, moveText.indexOf(')')));
			
		} else {
			this.valid = false;
		}

		// parts[0] may have harmony bonus
		this.endPoint = new NotationPoint(parts[0].substring(0, parts[0].indexOf(')')));

		if (parts[0].includes('+') || parts[0].includes('_')) {
			//console.log("Notation move says your plant is a harmony bonus");
			// Harmony Bonus!
			var bonusChar = '+';
			if (parts[0].includes('_')) {
				bonusChar = '_';
			}
			// Get only that part:
			var bonus = parts[0].substring(parts[0].indexOf(bonusChar)+1);
			
			this.bonusTileCode = bonus.substring(0,bonus.indexOf('('));
			//console.log("Bonus tile code: " + this.bonusTileCode);

			if (parts[0].includes('*')) {
				this.bonusEndPoint = new NotationPoint(bonus.substring(bonus.indexOf('(')+1, bonus.indexOf(')')));
				//console.log("Bonus end point: " + this.bonusEndPoint);
				this.boatBonusPoint = new NotationPoint(bonus.substring(bonus.indexOf('*') + 2, bonus.length-1));
				//console.log("Boat bonus point: " + this.boatBonusPoint);
			} else {
				this.bonusEndPoint = new NotationPoint(bonus.substring(bonus.indexOf('(')+1, bonus.indexOf(')')));
				//console.log("Bonus end point: " + this.bonusEndPoint);
			}
		}
	} else if (this.moveType === ARRANGING) {
		// Arranging move stuff
		//console.log("We're arranging!");

		// parts.forEach(function(val){//console.log(val);});

		this.startPoint = new NotationPoint(parts[0]);

		// parts[1] may have harmony bonus
		this.endPoint = new NotationPoint(parts[1].substring(0, parts[1].indexOf(')')));

		if (parts[1].includes('+') || parts[1].includes('_')) {
			// Harmony Bonus!
			var bonusChar = '+';
			if (parts[1].includes('_')) {
				bonusChar = '_';
			}
			// Get only that part:
			var bonus = parts[1].substring(parts[1].indexOf(bonusChar)+1);
			
			this.bonusTileCode = bonus.substring(0,bonus.indexOf('('));

			if (bonus.includes('*')) {
				this.bonusEndPoint = new NotationPoint(bonus.substring(bonus.indexOf('(')+1), bonus.indexOf(')'));
				this.boatBonusPoint = new NotationPoint(bonus.substring(bonus.indexOf('*') + 2, bonus.length - 1));
			} else {
				this.bonusEndPoint = new NotationPoint(bonus.substring(bonus.indexOf('(')+1, bonus.indexOf(')')));
			}
		}
	}
};

FirePaiShoNotationMove.prototype.hasHarmonyBonus = function() {
	return typeof this.bonusTileCode !== 'undefined';
};

FirePaiShoNotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

FirePaiShoNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};



// --------------------------------------- //

function FirePaiShoNotationBuilder() {
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

FirePaiShoNotationBuilder.prototype.getFirstMoveForHost = function(tileCode) {
	var builder = new FirePaiShoNotationBuilder();
	builder.moveType = PLANTING;
	builder.plantedFlowerType = FirePaiShoTile.getClashTileCode(tileCode);

	builder.endPoint = new NotationPoint("0,8");
	return builder;
};

FirePaiShoNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var bonusChar = '+';
	// if (onlinePlayEnabled) {
	// 	bonusChar = '_';
	// }
	var notationLine = moveNum + player.charAt(0) + ".";
	if (this.moveType === ARRANGING) {
		notationLine += "(" + this.startPoint.pointText + ")-(" + this.endPoint.pointText + ")";
		if (this.bonusTileCode && this.bonusEndPoint) {
			notationLine += bonusChar + this.bonusTileCode + "(" + this.bonusEndPoint.pointText + ")";
			if (this.boatBonusPoint) {
				notationLine += "*(" + this.boatBonusPoint.pointText + ")";
			}
		}
	} else if (this.moveType === PLANTING) {
		notationLine += this.plantedFlowerType + "(" + this.endPoint.pointText + ")";
		if (this.bonusTileCode && this.bonusEndPoint) {
			notationLine += bonusChar + this.bonusTileCode + "(" + this.bonusEndPoint.pointText + ")";
			if (this.boatBonusPoint) {
				notationLine += "*(" + this.boatBonusPoint.pointText + ")";
			}
		}
	}
	
	return new FirePaiShoNotationMove(notationLine);
};

// --------------------------------------- //



function FirePaiShoGameNotation() {
	this.notationText = "";
	this.moves = [];
}

FirePaiShoGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

FirePaiShoGameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

FirePaiShoGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

FirePaiShoGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

FirePaiShoGameNotation.prototype.getPlayerMoveNum = function() {
	var moveNum = 1;
	var lastMove = this.moves[this.moves.length-1];

	if (lastMove) {
		moveNum = lastMove.moveNum;
		// At game beginning:
//		if (lastMove.moveNum === 0 && lastMove.player === HOST) {
//			player = GUEST;
//		} else if (lastMove.moveNum === 0 && lastMove.player === GUEST) {
//			moveNum++;
//			player = GUEST;
//		} else
//		
		if (lastMove.player === HOST) {	// Usual
			moveNum++;
		} else {
			player = HOST;
		}
	}
	return moveNum;
};

FirePaiShoGameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
	// Example simple Arranging move: 7G.(8,0)-(7,1)

	var moveNum = 1;
	var player = GUEST;

	var lastMove = this.moves[this.moves.length-1];

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
};

FirePaiShoGameNotation.prototype.loadMoves = function() {
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
	var lastPlayer = HOST;
	lines.forEach(function(line) {
		var move = new FirePaiShoNotationMove(line);
		if (move.moveNum === 0 && move.isValidNotation()) {
			self.moves.push(move);
		} else if (move.isValidNotation() && move.player !== lastPlayer) {
			self.moves.push(move);
			lastPlayer = move.player;
		} else {
			debug("the player check is broken?");
		}
	});
};

FirePaiShoGameNotation.prototype.getNotationHtml = function() {
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
};

FirePaiShoGameNotation.prototype.getNotationForEmail = function() {
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
};

FirePaiShoGameNotation.prototype.notationTextForUrl = function() {
	var str = this.notationText;
	return str;
};

FirePaiShoGameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

FirePaiShoGameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};


