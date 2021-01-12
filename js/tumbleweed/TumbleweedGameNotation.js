// Tumbleweed Notation

// --------------------------------------------- // 

var TumbleweedNotationVars = {
	SWAP: "Swap",
	PASS_TURN: "-"
};

function TumbleweedNotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

TumbleweedNotationMove.prototype.analyzeMove = function() {
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
};

TumbleweedNotationMove.prototype.isValidNotation = function() {
	return this.deployPoint || this.passTurn || this.swap;
};

TumbleweedNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};



// --------------------------------------- //

function TumbleweedNotationBuilder() {
	this.deployPoint;
	this.passTurn = false;
	this.swap = false;

	this.status = BRAND_NEW;
}

TumbleweedNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
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
};

TumbleweedNotationBuilder.prototype.setDeployPoint = function(npText) {
	this.deployPoint = npText;
};

TumbleweedNotationBuilder.prototype.moveComplete = function() {
	return this.deployPoint || this.passTurn;
};

// --------------------------------------- //



function TumbleweedGameNotation() {
	this.notationText = "";
	this.moves = [];
}

TumbleweedGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

TumbleweedGameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

TumbleweedGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

TumbleweedGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

TumbleweedGameNotation.prototype.getPlayerMoveNum = function() {
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

TumbleweedGameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
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
};

TumbleweedGameNotation.prototype.loadMoves = function() {
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
};

TumbleweedGameNotation.prototype.getNotationHtml = function() {
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

TumbleweedGameNotation.prototype.notationTextForUrl = function() {
	var str = this.notationText;
	return str;
};

TumbleweedGameNotation.prototype.getNotationForEmail = function() {
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

TumbleweedGameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

TumbleweedGameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};




