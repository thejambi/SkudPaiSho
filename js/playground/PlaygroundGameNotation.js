// Playground Notation

// --------------------------------------------- // 

var END_GAME = "END_GAME";

function PlaygroundNotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

PlaygroundNotationMove.prototype.analyzeMove = function() {
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

	// If starts with a ( then it's MOVE
	var char0 = moveText.charAt(0);
	if (char0 === '(') {
		this.moveType = MOVE;
	} else {
		this.moveType = DEPLOY;
	}

	if (moveText.includes("END")) {
		this.moveType = END_GAME;
	}

	if (this.moveType === DEPLOY) {
		var char1 = moveText.charAt(1);
		var char2 = moveText.charAt(2);
		this.tileOwner = char0;
		var parenIndex = moveText.indexOf("(");
		this.tileType = moveText.substring(1, parenIndex);

		if (moveText.charAt(parenIndex) === '(') {
			// debug("parens checks out");
		} else {
			debug("Failure to plant");
			this.valid = false;
		}

		if (moveText.endsWith(')')) {
			this.endPoint = new NotationPoint(moveText.substring(parenIndex+1, moveText.indexOf(')')));
		} else {
			this.valid = false;
		}
	} else if (this.moveType === MOVE) {
		// Get the two points from string like: (-8,0)-(-6,3)
		var parts = moveText.substring(moveText.indexOf('(')+1).split(')-(');

		this.startPoint = new NotationPoint(parts[0]);

		this.endPoint = new NotationPoint(parts[1].substring(0, parts[1].indexOf(')')));
	}
};

PlaygroundNotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

PlaygroundNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};



// --------------------------------------- //

function PlaygroundNotationBuilder() {
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

PlaygroundNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var notationLine = moveNum + player.charAt(0) + ".";
	if (this.moveType === END_GAME) {
		notationLine += "END";
	} else if (this.moveType === MOVE) {
		notationLine += "(" + this.startPoint.pointText + ")-(" + this.endPoint.pointText + ")";
	} else if (this.moveType === DEPLOY) {
		notationLine += this.tileType + "(" + this.endPoint.pointText + ")";
	}
	
	return new PlaygroundNotationMove(notationLine);
};

// --------------------------------------- //



function PlaygroundGameNotation() {
	this.notationText = "";
	this.moves = [];
}

PlaygroundGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

PlaygroundGameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

PlaygroundGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

PlaygroundGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

PlaygroundGameNotation.prototype.getPlayerMoveNum = function() {
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

PlaygroundGameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
	// Example simple Arranging move: 7G.(8,0)-(7,1)

	var moveNum = 0;

	var lastMove = this.moves[this.moves.length-1];

	if (lastMove) {
		moveNum = lastMove.moveNum;
		if (lastMove.player !== builder.playingPlayer) {
			moveNum++;
		}
	}

	if (builder.endGame) {
		builder.moveType = END_GAME;
	}

	return builder.getNotationMove(moveNum, builder.playingPlayer);
};

PlaygroundGameNotation.prototype.loadMoves = function() {
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
	// var lastPlayer = GUEST;
	lines.forEach(function(line) {
		var move = new PlaygroundNotationMove(line);
		// if (move.isValidNotation() && move.player !== lastPlayer) {
		self.moves.push(move);
		// 	lastPlayer = move.player;
		// } else {
		// 	debug("the player check is broken?");
		// }
	});
};

PlaygroundGameNotation.prototype.getNotationHtml = function() {
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

PlaygroundGameNotation.prototype.notationTextForUrl = function() {
	var str = this.notationText;
	return str;
};

PlaygroundGameNotation.prototype.getNotationForEmail = function() {
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

PlaygroundGameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

PlaygroundGameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};




