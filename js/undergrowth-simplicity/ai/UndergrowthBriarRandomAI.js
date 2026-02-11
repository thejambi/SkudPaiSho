/* Undergrowth Briar Random AI */

import { UndergrowthBriarAiHelp } from './UndergrowthBriarAiHelp';

export function UndergrowthBriarRandomAI() {
	this.aiHelp = new UndergrowthBriarAiHelp();
}

UndergrowthBriarRandomAI.prototype.getName = function() {
	return "Briar Random AI";
};

UndergrowthBriarRandomAI.prototype.getMessage = function() {
	return "This AI makes moves completely randomly. Good for testing or a casual game.";
};

UndergrowthBriarRandomAI.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

UndergrowthBriarRandomAI.prototype.getMove = function(game, moveIndex) {
	var moves = this.aiHelp.getAllPossibleMoves(game, this.player, moveIndex);
	if (!moves || moves.length === 0) {
		return null;
	}
	var randomIndex = Math.floor(Math.random() * moves.length);
	return moves[randomIndex];
};
