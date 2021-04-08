/* Tumbleweed Random AI */

function TumbleweedRandomAIv1() {
}

TumbleweedRandomAIv1.prototype.getName = function() {
	return "Tumbleweed Random AI";
};

TumbleweedRandomAIv1.prototype.getMessage = function() {
	return "This AI makes moves completely randomly, so you should be able to beat it easily. ";
};

TumbleweedRandomAIv1.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

TumbleweedRandomAIv1.prototype.getMove = function(game, moveNum) {
	var moves = [];

	game.revealPossibleSettlePoints(this.player, true);
	var endPoints = game.board.getAllPossiblePoints();

	var notationBuilder = new TumbleweedNotationBuilder();
	notationBuilder.passTurn = true;
	var passMove = notationBuilder.getNotationMove(moveNum, this.player);
	moves.push(passMove);

	for (var j = 0; j < endPoints.length; j++) {
		notationBuilder = new TumbleweedNotationBuilder();
		notationBuilder.setDeployPoint(endPoints[j].getNotationPointString());

		var move = notationBuilder.getNotationMove(moveNum, this.player);

		game.hidePossibleSettlePoints(true);

		moves.push(move);
	}

	return removeRandomFromArray(moves);
};

