// Blooms Notation

// --------------------------------------------- // 

function BloomsNotationMove(text) {
	this.fullMoveText = text;
	this.analyzeMove();
}

BloomsNotationMove.prototype.analyzeMove = function() {
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

	// Move string like: 'H1a1,H2c4' or just 'G2d3'
	var parts = moveText.split(',');

	this.piece1 = parts[0].substring(0,2);
	this.deployPoint1 = parts[0].substring(2);

	if (parts[1]) {
		this.piece2 = parts[1].substring(0,2);
		this.deployPoint2 = parts[1].substring(2);
	}
};

BloomsNotationMove.prototype.isValidNotation = function() {
	return this.valid;
};

BloomsNotationMove.prototype.equals = function(otherMove) {
	return this.fullMoveText === otherMove.fullMoveText;
};



// --------------------------------------- //

function BloomsNotationBuilder() {
	this.piece1;
	this.deployPoint1;
	this.piece2
	this.deployPoint2;

	this.status = BRAND_NEW;
	this.selectedPiece;
}

BloomsNotationBuilder.prototype.getNotationMove = function(moveNum, player) {
	var notationLine = moveNum + player.charAt(0) + ".";
	if (this.piece1 && this.deployPoint1) {
		notationLine += this.piece1 + this.deployPoint1;
		
		if (this.piece2 && this.deployPoint2) {
			notationLine += "," + this.piece2 + this.deployPoint2;
		}
	}
	
	return new BloomsNotationMove(notationLine);
};

BloomsNotationBuilder.prototype.setDeployPoint = function(npText) {
	if (this.selectedPiece) {
		if (this.piece1) {
			this.piece2 = this.selectedPiece;
			this.deployPoint2 = npText;
		} else {
			this.piece1 = this.selectedPiece;
			this.deployPoint1 = npText;
		}
	}
};

BloomsNotationBuilder.prototype.moveComplete = function() {
	return this.piece1 && this.deployPoint1 && this.piece2 && this.deployPoint2;
};

// --------------------------------------- //



function BloomsGameNotation() {
	this.notationText = "";
	this.moves = [];
}

BloomsGameNotation.prototype.setNotationText = function(text) {
	this.notationText = text;
	this.loadMoves();
};

BloomsGameNotation.prototype.addNotationLine = function(text) {
	this.notationText += ";" + text.trim();
	this.loadMoves();
};

BloomsGameNotation.prototype.addMove = function(move) {
	if (this.notationText) {
		this.notationText += ";" + move.fullMoveText;
	} else {
		this.notationText = move.fullMoveText;
	}
	this.loadMoves();
};

BloomsGameNotation.prototype.removeLastMove = function() {
	this.notationText = this.notationText.substring(0, this.notationText.lastIndexOf(";"));
	this.loadMoves();
};

BloomsGameNotation.prototype.getPlayerMoveNum = function() {
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

BloomsGameNotation.prototype.getNotationMoveFromBuilder = function(builder) {
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

BloomsGameNotation.prototype.loadMoves = function() {
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
		var move = new BloomsNotationMove(line);
		if (move.isValidNotation() && move.player !== lastPlayer) {
			self.moves.push(move);
			lastPlayer = move.player;
		} else {
			debug("the player check is broken?");
		}
	});
};

BloomsGameNotation.prototype.getNotationHtml = function() {
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

BloomsGameNotation.prototype.notationTextForUrl = function() {
	var str = this.notationText;
	return str;
};

BloomsGameNotation.prototype.getNotationForEmail = function() {
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

BloomsGameNotation.prototype.getLastMoveText = function() {
	return this.moves[this.moves.length - 1].fullMoveText;
};

BloomsGameNotation.prototype.getLastMoveNumber = function() {
	return this.moves[this.moves.length - 1].moveNum;
};




