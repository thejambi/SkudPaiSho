// Notation

// Row and column object
function RowAndColumn(row, col) {
	this.row = row;
	this.col = col;

	var x = col - 8;
	var y = 8 - row;
	this.notationPointString = x + "," + y;
}

RowAndColumn.prototype.samesies = function(other) {
	return this.row === other.row && this.col === other.col;
};



// --------------------------------------------- // 



function NotationPoint(text) {
	this.pointText = text;

	var parts = this.pointText.split(',');

	this.x = parseInt(parts[0]);
	this.y = parseInt(parts[1]);

	var col = this.x + 8;
	var row = Math.abs(this.y - 8);

	this.rowAndColumn = new RowAndColumn(row, col);
}

NotationPoint.prototype.samesies = function(other) {
	return this.x === other.x && this.y === other.y;
};

NotationPoint.prototype.toArr = function() {
	return [this.x, this.y];
};


// --------------------------------------------- // 


var PLANTING = "Planting";
var ARRANGING = "Arranging";

var GUEST = "GUEST";
var HOST = "HOST";

function NotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

NotationMove.prototype.analyzeMove = function() {
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
	// For Solitaire, also O or L is Planting
	var char0 = moveText.charAt(0);
	if (char0 === 'R' || char0 === 'W' || char0 === 'O' || char0 === 'L') {
		this.moveType = PLANTING;
	} else if (char0 === '(') {
		this.moveType = ARRANGING;
	}

	if (this.moveType === PLANTING) {
		// Planting move stuff
		var char1 = moveText.charAt(1);
		this.plantedFlowerType = char0;
		if (char1 !== '(') {
			this.plantedFlowerType = this.plantedFlowerType + "" + char1;
		}

		if (moveText.charAt(2) === '(' || moveText.charAt(1) === '(') {
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
		var parts = moveText.substring(moveText.indexOf('(')+1).split(')-(');

		// parts.forEach(function(val){console.log(val);});

		this.startPoint = new NotationPoint(parts[0]);

		// parts[1] may have harmony bonus
		this.endPoint = new NotationPoint(parts[1].substring(0, parts[1].indexOf(')')));

		if (parts[1].includes('+')) {
			// Harmony Bonus!
			// Get only that part:
			var bonus = parts[1].substring(parts[1].indexOf('+')+1);
			
			this.bonusTileCode = bonus.substring(0,bonus.indexOf('('));

			if (parts.length > 2) {
				this.bonusEndPoint = new NotationPoint(bonus.substring(bonus.indexOf('(')+1));
				this.boatBonusPoint = new NotationPoint(parts[2].substring(0, parts[2].indexOf(')')));
			} else {
				this.bonusEndPoint = new NotationPoint(bonus.substring(bonus.indexOf('(')+1, bonus.indexOf(')')));
			}
		}
	}
};

NotationMove.prototype.hasHarmonyBonus = function() {
	return typeof this.bonusTileCode !== 'undefined';
};

NotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

NotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};



// --------------------------------------- //

function NotationBuilder() {
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

NotationBuilder.prototype.getFirstMoveForHost = function(tileCode) {
	var builder = new NotationBuilder();
	builder.moveType = PLANTING;
	builder.plantedFlowerType = Tile.getClashTileCode(tileCode);

	if (simpleCanonRules || sameStart) {
		builder.plantedFlowerType = tileCode;
	}

	builder.endPoint = new NotationPoint("0,8");
	return builder;
};

NotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var notationLine = moveNum + player.charAt(0) + ".";
	if (this.moveType === ARRANGING) {
		notationLine += "(" + this.startPoint.pointText + ")-(" + this.endPoint.pointText + ")";
		if (this.bonusTileCode && this.bonusEndPoint) {
			notationLine += "+" + this.bonusTileCode + "(" + this.bonusEndPoint.pointText + ")";
			if (this.boatBonusPoint) {
				notationLine += "-(" + this.boatBonusPoint.pointText + ")";
			}
		}
	} else if (this.moveType === PLANTING) {
		notationLine += this.plantedFlowerType + "(" + this.endPoint.pointText + ")";
	}
	
	return new NotationMove(notationLine);
};

// --------------------------------------- //



function GameNotation() {
	this.notationText = "";
	this.moves = [];
}

GameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

GameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

GameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

GameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

GameNotation.prototype.getPlayerMoveNum = function() {
	var moveNum = 0;
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
	return moveNum;
};

GameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
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

GameNotation.prototype.loadMoves = function() {
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
		var move = new NotationMove(line);
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

GameNotation.prototype.getNotationHtml = function() {
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

GameNotation.prototype.getNotationForEmail = function() {
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

GameNotation.prototype.notationTextForUrl = function() {
	var str = this.notationText;
	return str;
};

GameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

GameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};


