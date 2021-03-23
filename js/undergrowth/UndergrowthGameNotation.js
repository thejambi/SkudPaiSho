// Coop Solitaire Notation

Undergrowth.NotationMove = function(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

Undergrowth.NotationMove.prototype.analyzeMove = function() {
	this.valid = true;

	// Example move: 5H.R3(1,1)+W3(-1,-1)

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

	var char0 = moveText.charAt(0);
	this.moveType = PLANTING;

	if (this.moveType === PLANTING) {
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
			if (moveText.includes("+")) {
				var moves = moveText.split("+");
				this.endPoint = new NotationPoint(moves[0].substring(moves[0].indexOf('(')+1, moves[0].indexOf(')')));
				this.plantedFlowerType2 = moves[1].charAt(0);
				if (moves[1].charAt(1) !== '(') {
					this.plantedFlowerType2 = this.plantedFlowerType2 + "" + moves[1].charAt(1);
				}
				this.endPoint2 = new NotationPoint(moves[1].substring(moves[1].indexOf('(')+1, moves[1].indexOf(')')));
			} else {
				this.endPoint = new NotationPoint(moveText.substring(moveText.indexOf('(')+1, moveText.indexOf(')')));
			}
		} else {
			this.valid = false;
		}
	}
	debug(this);
};

Undergrowth.NotationMove.prototype.hasHarmonyBonus = function() {
	return typeof this.bonusTileCode !== 'undefined';
};

Undergrowth.NotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

Undergrowth.NotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};



// --------------------------------------- //

Undergrowth.NotationBuilder = function() {
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

Undergrowth.NotationBuilder.WAITING_FOR_SECOND_MOVE = "Waiting for second move";
Undergrowth.NotationBuilder.WAITING_FOR_SECOND_ENDPOINT = "Waiting for second endpoint";

Undergrowth.NotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	// Example move: 5H.R3(1,1)+W3(-1,-1)
	var notationLine = moveNum + player.charAt(0) + ".";
	if (this.moveType === PLANTING) {
		notationLine += this.plantedFlowerType + "(" + this.endPoint.pointText + ")";
		if (this.plantedFlowerType2 && this.endPoint2) {
			notationLine += "+" + this.plantedFlowerType2 + "(" + this.endPoint2.pointText + ")";
		}
	}
	
	return new Undergrowth.NotationMove(notationLine);
};

// --------------------------------------- //



Undergrowth.GameNotation = function() {
	this.notationText = "";
	this.moves = [];
}

Undergrowth.GameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

Undergrowth.GameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

Undergrowth.GameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

Undergrowth.GameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

Undergrowth.GameNotation.prototype.getPlayerMoveNum = function() {
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

Undergrowth.GameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
	// Example move: 5H.R3(1,1)+W3(-1,-1)

	var moveNum = 1;
	var player = HOST;

	var lastMove = this.moves[this.moves.length-1];

	if (lastMove) {
		moveNum = lastMove.moveNum;
		// At game beginning:
		if (lastMove.player === GUEST) {	// Usual
			moveNum++;
		} else {
			player = GUEST;
		}
	}

	return builder.getNotationMove(moveNum, player);
};

Undergrowth.GameNotation.prototype.loadMoves = function() {
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
		var move = new Undergrowth.NotationMove(line);
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

Undergrowth.GameNotation.prototype.getNotationHtml = function() {
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

Undergrowth.GameNotation.prototype.getNotationForEmail = function() {
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

Undergrowth.GameNotation.prototype.notationTextForUrl = function() {
	var str = this.notationText;
	return str;
};

Undergrowth.GameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

Undergrowth.GameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};


