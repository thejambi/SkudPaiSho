/* Skud Pai Sho Notation */

function StreetNotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

StreetNotationMove.prototype.analyzeMove = function() {
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

	// If starts with an L, then it's Planting
	var char0 = moveText.charAt(0);
	if (char0 === 'L') {
		this.moveType = PLANTING;
	} else if (char0 === '(') {
		this.moveType = ARRANGING;
	} else {
		this.moveType = INITIAL_SETUP;
	}

	if (this.moveType === INITIAL_SETUP) {
		// Move contains board setup code
		this.boardSetupCode = moveText;
	} else if (this.moveType === PLANTING) {
		// Planting move stuff
		// var char1 = moveText.charAt(1);
		this.plantedFlowerType = char0;

		if (moveText.charAt(1) === '(') {
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

		this.startPoint = new NotationPoint(parts[0]);

		this.endPoint = new NotationPoint(parts[1].substring(0, parts[1].indexOf(')')));
	}
};

StreetNotationMove.prototype.hasHarmonyBonus = function() {
	return typeof this.bonusTileCode !== 'undefined';
};

StreetNotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

StreetNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};



// --------------------------------------- //

function StreetNotationBuilder() {
	// this.moveNum;	// Magic
	// this.player;		// Magic
	this.moveType;

	// PLANTING
	this.plantedFlowerType;
	this.endPoint;

	// ARRANGING
	this.startPoint;
	/* this.endPoint; // Also used in Planting */
	this.bonusTileCode;
	this.bonusEndPoint;
	this.boatBonusPoint;

	this.status = BRAND_NEW;
}

StreetNotationBuilder.prototype.getFirstMoveForHost = function(tileCode) {
	var builder = new StreetNotationBuilder();
	builder.moveType = PLANTING;
	builder.plantedFlowerType = StreetTile.getClashTileCode(tileCode);

	if (simpleCanonRules || sameStart) {
		builder.plantedFlowerType = tileCode;
	}

	builder.endPoint = new NotationPoint("0,8");
	return builder;
};

StreetNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var bonusChar = '+';
	
	var notationLine = moveNum + player.charAt(0) + ".";
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
	
	return new StreetNotationMove(notationLine);
};

// --------------------------------------- //



function StreetGameNotation() {
	this.notationText = "";
	this.moves = [];
}

StreetGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

StreetGameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

StreetGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

StreetGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

StreetGameNotation.prototype.getPlayerMoveNum = function() {
	var moveNum = 0;
	var lastMove = this.moves[this.moves.length-1];

	if (lastMove) {
		moveNum = lastMove.moveNum;
		if (lastMove.player === GUEST) {
			moveNum++;
		}
	}
	return moveNum;
};

StreetGameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
	var moveNum = 0;
	var player = HOST;

	var lastMove = this.moves[this.moves.length-1];

	if (lastMove) {
		moveNum = lastMove.moveNum;
		if (lastMove.player === GUEST) {
			moveNum++;
		} else {
			player = GUEST;
		}
	}

	return builder.getNotationMove(moveNum, player);
};

StreetGameNotation.prototype.loadMoves = function() {
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
		var move = new StreetNotationMove(line);
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

StreetGameNotation.prototype.getNotationHtml = function() {
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

StreetGameNotation.prototype.getNotationForEmail = function() {
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

StreetGameNotation.prototype.notationTextForUrl = function() {
	var str = this.notationText;
	return str;
};

StreetGameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

StreetGameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};


