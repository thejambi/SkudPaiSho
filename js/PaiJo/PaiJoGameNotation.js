// PaiJo Notation

// --------------------------------------------- // 
// DEFAULTS HERE ARE NOT USED IN THE PROJECT, BUT UNTOUCHED TO NOT BRING THE SITE IN CONFUSION
// PAIJO USES THE INDEX.HTML as main (iframe in PaiJoController).

function PaiJoNotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

PaiJoNotationMove.prototype.analyzeMove = function() {
	this.valid = true;

	// Get move number
	var parts = this.fullMoveText.split(".");

	var moveNumAndPlayer = parts[0];

	this.moveNum = parseInt(moveNumAndPlayer.slice(0, -1));
    this.playerCode = moveNumAndPlayer.charAt(moveNumAndPlayer.length - 1);

    // Get player (Attackers or Defenders)
	if (this.playerCode === 'A') {
		this.player = PaiJoVars.ATTACKERS_PLAYER;
	} else if (this.playerCode === 'D') {
		this.player = PaiJoVars.DEFENDERS_PLAYER;
	}

	var moveText = parts[1];

	// If no move text...
	if (!moveText) {
		this.valid = false;
		return;
	}

	if (moveText.includes('-')) {
		this.moveType = MOVE;
		// Move string like: 'Ka2-a1' or just 'a2-a1'
		var parts = moveText.split('-');

		if (parts[0].charAt(0) === 'K') {
			this.isKingMove = true;
			parts[0] = parts[0].substring(1);
		}
		this.startPoint = parts[0];
		this.endPoint = parts[1];
	} else {
		this.moveType = INITIAL_SETUP;
		this.boardSetupCode = moveText;
	}
};

PaiJoNotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

PaiJoNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};



// --------------------------------------- //

function PaiJoNotationBuilder() {
	this.isKingMove;
	this.startPoint;
	this.endPoint;

	this.status = BRAND_NEW;
}

PaiJoNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var playerChar = "A";
	if (player === PaiJoVars.DEFENDERS_PLAYER) {
		playerChar = "D";
	}
	var notationLine = moveNum + playerChar + ".";
	if (this.isKingMove) {
		notationLine += "K";
	}
	if (this.startPoint && this.endPoint) {
		notationLine += this.startPoint + "-" + this.endPoint;
	}
	
	return new PaiJoNotationMove(notationLine);
};

PaiJoNotationBuilder.prototype.moveComplete = function() {
	return this.startPoint && this.endPoint;
};

// --------------------------------------- //



function PaiJoGameNotation() {
	this.notationText = "";
	this.moves = [];
}

PaiJoGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

PaiJoGameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

PaiJoGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

PaiJoGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

PaiJoGameNotation.prototype.getPlayerMoveNum = function() {
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

PaiJoGameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
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

PaiJoGameNotation.prototype.loadMoves = function() {
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
	var firstMove = new PaiJoNotationMove(lines[0]);
	if (firstMove.player === GUEST) {
		newAttacker = PaiJoVars.DEFENDERS_PLAYER;
		newDefender = PaiJoVars.ATTACKERS_PLAYER;
		PaiJoVars = {
			DEFENDERS_PLAYER: newDefender,
			ATTACKERS_PLAYER: newAttacker
		};
	}
	lines.forEach(function(line) {
		var move = new PaiJoNotationMove(line);
		if (move.isValidNotation() && move.player !== lastPlayer) {
			self.moves.push(move);
			lastPlayer = move.player;
		} else {
			debug("the player check is broken?");
		}
	});
};

PaiJoGameNotation.prototype.getNotationHtml = function() {
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

PaiJoGameNotation.prototype.notationTextForUrl = function() {
	var str = this.notationText;
	return str;
};

PaiJoGameNotation.prototype.getNotationForEmail = function() {
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

PaiJoGameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

PaiJoGameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};




