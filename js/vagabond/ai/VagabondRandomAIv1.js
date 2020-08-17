/* Vagabond Random AI */

function VagabondRandomAIv1() {
	this.aiHelp = new VagabondAiHelp();
}

VagabondRandomAIv1.prototype.getName = function() {
	return "Vagabond Random AI";
};

VagabondRandomAIv1.prototype.getMessage = function() {
	return "This AI makes moves completely randomly, so you should be able to beat it easily if it even manages to play its Lotus. ";
};

VagabondRandomAIv1.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

VagabondRandomAIv1.prototype.getMove = function(game, moveNum) {
	this.aiHelp.moveNum = moveNum;
	var moves = this.aiHelp.getAllPossibleMoves(game, this.player);
	return removeRandomFromArray(moves);
};

