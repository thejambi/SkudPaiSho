// MeadowRandomAIv1

function MeadowRandomAIv1() {
	
}

MeadowRandomAIv1.prototype.getName = function() {
	return "Meadow Random AI";
};

MeadowRandomAIv1.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

/* parameters will be copies of the real thing, so you can't mess up the real game. */
MeadowRandomAIv1.prototype.getMove = function(game, moveNum) {
	// this.moveNum = moveNum;

	// var moves = this.getPossibleMoves(game, this.player);

	// var randomIndex = Math.floor(Math.random() * moves.length);
	// var randomMove = moves.splice(randomIndex, 1)[0];

	// return randomMove;
};

MeadowRandomAIv1.prototype.getPossibleMoves = function(thisGame, player) {
	// var moves = [];
	// return moves;
};
