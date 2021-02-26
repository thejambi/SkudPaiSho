// Playground Notation

// --------------------------------------------- // 

var PlaygroundMoveType = {
	endGame: "END_GAME",
	hideTileLibraries: "HideTileLibraries",
	deployToTilePile: "DeployToTilePile",
	moveToTilePile: "MoveToTilePile"
};

var PlaygroundNotationConstants = {
	moveToPile: "-mp",
	deployToPile: "-dp",
	fromPile: "-fp",
	hostLibraryPile: ":HL",
	guestLibraryPile: ":GL",
	hostReservePile: ":HR",
	guestReservePile: ":GR",
	capturedPile: ":C"
};

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
		this.moveType = PlaygroundMoveType.endGame;
	} else if (moveText.includes(PlaygroundMoveType.hideTileLibraries)) {
		this.moveType = PlaygroundMoveType.hideTileLibraries;
	} else if (moveText.includes(PlaygroundNotationConstants.moveToPile)) {
		this.moveType = PlaygroundMoveType.moveToTilePile;
	} else if (moveText.includes(PlaygroundNotationConstants.deployToPile)) {
		this.moveType = PlaygroundMoveType.deployToTilePile;
	}

	if (this.moveType === DEPLOY || this.moveType === PlaygroundMoveType.deployToTilePile) {
		var char1 = moveText.charAt(1);
		var char2 = moveText.charAt(2);
		this.tileOwner = char0;
		var parenIndex = moveText.indexOf("(");
		this.tileType;
		if (this.moveType === DEPLOY) {
			this.tileType = moveText.substring(1, parenIndex);
		} else if (this.moveType === PlaygroundMoveType.deployToTilePile) {
			this.tileType = moveText.substring(1, moveText.indexOf(PlaygroundNotationConstants.deployToPile));
		}

		if (moveText.charAt(parenIndex) === '(') {
			// debug("parens checks out");
		} else if (this.moveType === DEPLOY) {
			debug("Failure to plant");
			this.valid = false;
		}

		if (this.moveType === PlaygroundMoveType.deployToTilePile) {
			this.endPileName = moveText.substring(moveText.indexOf(PlaygroundNotationConstants.deployToPile) + PlaygroundNotationConstants.deployToPile.length, moveText.indexOf(PlaygroundNotationConstants.fromPile));
			debug(this.endPileName);
		} else if (this.moveType === DEPLOY) {
			this.endPoint = new NotationPoint(moveText.substring(parenIndex+1, moveText.indexOf(')')));
		} else {
			this.valid = false;
		}

		this.sourcePileName = moveText.substring(moveText.indexOf(PlaygroundNotationConstants.fromPile) + PlaygroundNotationConstants.fromPile.length);
	} else if (this.moveType === MOVE) {
		// Get the two points from string like: (-8,0)-(-6,3)
		var parts = moveText.substring(moveText.indexOf('(')+1).split(')-(');

		this.startPoint = new NotationPoint(parts[0]);

		this.endPoint = new NotationPoint(parts[1].substring(0, parts[1].indexOf(')')));
	} else if (this.moveType === PlaygroundMoveType.moveToTilePile) {
		this.startPoint = new NotationPoint(moveText.substring(moveText.indexOf("(") + 1, moveText.indexOf(")")));
		this.endPileName = moveText.substring(moveText.indexOf(PlaygroundNotationConstants.moveToPile) + PlaygroundNotationConstants.moveToPile.length);
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
	var playerNotationAbbr = player === HOST || player === GUEST ? player.charAt(0) : player;
	var notationLine = moveNum + playerNotationAbbr + ".";
	if (this.moveType === PlaygroundMoveType.endGame) {
		notationLine += "END";
	} else if (this.moveType === PlaygroundMoveType.hideTileLibraries) {
		notationLine += PlaygroundMoveType.hideTileLibraries;
	} else if (this.moveType === MOVE) {
		notationLine += "(" + this.startPoint.pointText + ")-(" + this.endPoint.pointText + ")";
	} else if (this.moveType === DEPLOY) {
		notationLine += this.tileType + "(" + this.endPoint.pointText + ")" + PlaygroundNotationConstants.fromPile + this.sourcePileName;
	} else if (this.moveType === PlaygroundMoveType.moveToTilePile) {
		notationLine += "(" + this.startPoint.pointText + ")" + PlaygroundNotationConstants.moveToPile + this.endPileName;
	} else if (this.moveType === PlaygroundMoveType.deployToTilePile) {
		notationLine += this.tileType + PlaygroundNotationConstants.deployToPile + this.endPileName + PlaygroundNotationConstants.fromPile + this.sourcePileName;
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
		builder.moveType = PlaygroundMoveType.endGame;
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




