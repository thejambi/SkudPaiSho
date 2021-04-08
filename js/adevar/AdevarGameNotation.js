// Adevar Notation

// --------------------------------------------- // 

var AdevarMoveType = {
	chooseHiddenTile: "cHT:"
};

function AdevarNotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

AdevarNotationMove.prototype.analyzeMove = function() {
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

	if (moveText.includes(AdevarMoveType.chooseHiddenTile)) {
		this.moveType = AdevarMoveType.chooseHiddenTile;
	}

	if (this.moveType === AdevarMoveType.chooseHiddenTile) {
		// Like: cHT:Echeveria
		this.hiddenTileCode = moveText.substring(moveText.indexOf(AdevarMoveType.chooseHiddenTile) + AdevarMoveType.chooseHiddenTile.length);
	} else if (this.moveType === DEPLOY) {
		var char1 = moveText.charAt(1);
		var char2 = moveText.charAt(2);
		this.tileOwner = char0;
		var parenIndex = moveText.indexOf("(");
		this.tileType;
		if (this.moveType === DEPLOY) {
			this.tileType = moveText.substring(1, parenIndex);
		}

		if (moveText.charAt(parenIndex) === '(') {
			// debug("parens checks out");
		} else {
			debug("Failure to plant");
			this.valid = false;
		}

		this.endPoint = new NotationPoint(moveText.substring(parenIndex+1, moveText.indexOf(')')));
	} else if (this.moveType === MOVE) {
		// Get the two points from string like: (-8,0)-(-6,3)
		var parts = moveText.substring(moveText.indexOf('(')+1).split(')-(');

		this.startPoint = new NotationPoint(parts[0]);

		this.endPoint = new NotationPoint(parts[1].substring(0, parts[1].indexOf(')')));
	} 
};

AdevarNotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

AdevarNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};

AdevarNotationMove.prototype.copyWithoutHiddenDetails = function() {
	if (this.moveType === AdevarMoveType.chooseHiddenTile) {
		return new AdevarNotationMove(this.fullMoveText.replace(this.hiddenTileCode, AdevarTileCode.blankHiddenTile));
	} else {
		return this;
	}
};



// --------------------------------------- //

function AdevarNotationBuilder() {
	this.moveType;

	// DEPLOY
	this.tileType;
	this.endPoint;

	// MOVE
	this.startPoint;
	//this.endPoint; // Also used in DEPLOY

	// Choose Hidden Tile
	this.hiddenTileCode;

	this.status = BRAND_NEW;
}

AdevarNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var notationLine = moveNum + player.charAt(0) + ".";
	if (this.moveType === AdevarMoveType.chooseHiddenTile) {
		notationLine += AdevarMoveType.chooseHiddenTile + this.hiddenTileCode;
	} else if (this.moveType === MOVE) {
		notationLine += "(" + this.startPoint.pointText + ")-(" + this.endPoint.pointText + ")";
	} else if (this.moveType === DEPLOY) {
		notationLine += this.tileType + "(" + this.endPoint.pointText + ")";
	}
	
	return new AdevarNotationMove(notationLine);
};

// --------------------------------------- //



function AdevarGameNotation() {
	this.notationText = "";
	this.moves = [];
}

AdevarGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

AdevarGameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

AdevarGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

AdevarGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

AdevarGameNotation.prototype.getPlayerMoveNum = function() {
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

AdevarGameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
	// Example simple Arranging move: 7G.(8,0)-(7,1)

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

AdevarGameNotation.prototype.loadMoves = function() {
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
	lines.forEach(function(line) {
		var move = new AdevarNotationMove(line);
		self.moves.push(move);
	});
};

AdevarGameNotation.prototype.getNotationHtml = function() {
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

AdevarGameNotation.prototype.notationTextForUrl = function() {
	var str = this.notationText;
	return str;
};

AdevarGameNotation.prototype.getNotationForEmail = function() {
	var lines = [];
	if (this.notationText && this.notationText.includes("1H.")) {
		if (this.notationText.includes(';')) {
			lines = this.notationText.substring(this.notationText.indexOf("1H.")).split(";");
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

AdevarGameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

AdevarGameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};

AdevarGameNotation.prototype.getMoveWithoutHiddenDetails = function(moveIndex) {
	return this.moves[moveIndex].copyWithoutHiddenDetails();
};




