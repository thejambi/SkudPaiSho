// SkudAIv1

function SkudAIv1() {
	this.scoreDepth = 1;	// This can't go higher than 1... Or can it?
	this.greatScoreThreshold = new Map();
	this.greatScoreThreshold.set(2, 9);
	this.greatScoreThreshold.set(1, 18);
	this.greatScoreThreshold.set(0, 16);
}

SkudAIv1.prototype.getName = function() {
	return "Skud Pai Sho automatic opponent";
};

SkudAIv1.prototype.getMessage = function() {
	return "Playing against the computer can help you learn how the game works. You should be able to beat the computer easily once you understand the game.";
};

SkudAIv1.prototype.setPlayer = function(playerName) {
	this.player = playerName;
};

/* parameters will be copies of the real thing, so you can't mess up the real game. */
SkudAIv1.prototype.getMove = function(game, moveNum) {
	this.moveNum = moveNum;

	var moves = this.getPossibleMoves(game, this.player);

	// Process moves to get the best one...
	// What makes a good move? Should I go through all moves and "score" them somehow?

	var goodMove;
	// var goodScore = 0;
	var goodScores = new Map();
	for (var moveNum = 0; moveNum < moves.length; moveNum++) {
		var move = moves[moveNum];
		// var score = this.getMoveScore(game, move, this.scoreDepth);
		// if (score > 9999 || (score > goodScore && Math.random() > 0.1)) {	// Shake it up
		// //if (score > goodScore) {
		// 	goodScore = score;
		// 	goodMove = move;
		// }
		var scores = this.getMoveScore(game, move, this.scoreDepth);
		if (scores.get(this.scoreDepth) > 9999) {
			return move;
		}
		if (Math.random() > 0.1 && this.scoreIsGood(scores, goodScores, this.scoreDepth)) {
			goodMove = move;
			goodScores = scores;
		}
	}

	if (goodMove) {
		// debug("Score: " + goodScore);
		this.ensurePlant(goodMove, game, this.player);
		return goodMove;
	}

	var randomIndex = Math.floor(Math.random() * moves.length);
	var randomMove = moves.splice(randomIndex, 1)[0];

	return randomMove;
};

SkudAIv1.prototype.scoreIsGood = function(scores, goodScores, depth) {
	if (depth <= 0) {
		debug("SCORE IS GOOD")
		return true;
	}
	if (scores.get(depth) > goodScores.get(depth) || !goodScores.get(depth)) {
		return this.scoreIsGood(scores, goodScores, depth - 1);
	} else {
		return false;
	}
};

SkudAIv1.prototype.getMoveScore = function(origGame, move, depth) {
	debug("Depth: " + depth);
	
	var copyGame = origGame.getCopy();
	copyGame.runNotationMove(move);

	// var multiplier = depth * depth;

	// var score = this.calculateScore(origGame, copyGame) * multiplier;
	var score = new Map();
	score.set(depth, this.calculateScore(origGame, copyGame));

	if (score > 99999) {
		return score;
	// } else if (score > this.greatScoreThreshold * multiplier) {
	} else if (score.get(depth) > this.greatScoreThreshold.get(depth)) {
		return this.getHighestScore(origGame, copyGame, score, depth);
	} else {
		return score;
	}
};

SkudAIv1.prototype.getHighestScore = function(origGame, newGame, highScore, depth) {
	// magic

	if (depth <= 0) {
		return highScore;
	}

	var copyGame = newGame.getCopy();

	// Get all moves, for each move...
	var moves = this.getPossibleMoves(copyGame, this.player);
	for (var i = 0; i < moves.length; i++) {
		// var score = this.getMoveScore(copyGame, moves[i], depth - 1);
		// if (score > highScore) {
		// 	highScore = score;
		// }
		// if (highScore > 999) {
		// 	return highScore;
		// }
		var scores = this.getMoveScore(copyGame, moves[i], depth - 1);
		if (scores.get(depth - 1) > highScore) {
			highScore.set(depth - 1, scores.get(depth - 1));
		}
	}

	// Returns the highest score of all searched moves
	if (highScore[1] > 0) {
		debug("highScore: " + highScore);
	}
	return highScore;
};

SkudAIv1.prototype.calculateScore = function(origGame, copyGame) {
	// Simple move scoring...
	var score = 0;

	// var copyGame = origGame.getCopy();
	// copyGame.runNotationMove(move);

	// Check for win! Win is good!
	if (copyGame.board.winners.includes(this.player) || origGame.board.winners.includes(this.player)) {
		return 9999999;
	}

	var opponent = this.getOpponent();

	// Check number of my harmonies, increase is good.
	var before = this.getNumHarmoniesForPlayer(origGame, this.player);
	var after = this.getNumHarmoniesForPlayer(copyGame, this.player);

	var moreHarmonies = after > before;
	if (after > before) {
		score += 20;
	} else if (after < before) {
		score -= 20;
	}

	// Harmonies that cross the center are better!
	before = this.getNumHamoniesCrossingCenter(origGame, this.player);
	after = this.getNumHamoniesCrossingCenter(copyGame, this.player);

	if (after > before) {
		score += 50;
	} else if (after < before) {
		score -= 20;
	}

	// Check number of opponent harmonies, decrease is good
	before = this.getNumHarmoniesForPlayer(origGame, opponent);
	after = this.getNumHarmoniesForPlayer(copyGame, opponent);

	var opponentLessHarmonies = after < before;
	if (after < before) {
		score += 3;
	} else if (after > before) {
		score -= 7;
	}

	// Check tiles in red/white gardens, increase is good
	before = this.getNumTilesInGardensForPlayer(origGame, this.player);
	after = this.getNumTilesInGardensForPlayer(copyGame, this.player);

	var moreHomeTiles = after > before;
	if (after > before) {
		score += 10;
	} else if (after < before) {
		score -= 10;
	}

	// If opponent has less tiles, that is good
	before = this.getNumTilesOnBoardForPlayer(origGame, opponent);
	after = this.getNumTilesOnBoardForPlayer(copyGame, opponent);

	var opponentLessTiles = after < before;
	if (after < before) {
		score += 8;
	}

	// Tiles on left/right/top/bottom of center
	// "Surroundness" - we want to maintain it
	// before = this.getSurroundness(origGame, this.player);
	var surroundness = this.getSurroundness(copyGame, this.player);
	before = this.getSurroundness(origGame, this.player);

	var maxSurroundness = surroundness > 3;
	if (surroundness > before) {
		score += surroundness;
	}

	// Harmony ring length is good if we do it right
	if (surroundness > 3) {
		before = this.getLongestHarmonyRingLength(origGame, this.player);
		if (before < 5) {
			after = this.getLongestHarmonyRingLength(copyGame, this.player);

			if (after > before) {
				score += 5;
			} else if (after < before) {
				score -= 2;
			}
		} else {
			score += 5;
		}
	}

	// Plant tile that can harmonize with tile on board? Good
	// TODO
	before = this.getNumTilesOnBoardForPlayer(origGame, this.player);
	after = this.getNumTilesOnBoardForPlayer(copyGame, this.player);

	if (after > before) {
		score += 5;
	}

	// return score / ((this.scoreDepth - depth) + 1);
	return score;
};

SkudAIv1.prototype.getPossibleMoves = function(thisGame, player) {
	var moves = [];

	if (this.moveNum === 0) {
		/* First turn is Accent Tile selection */
		this.addAccentSelectionMoves(moves, thisGame, player);
	} else {
		/* Get list of all Planting moves and all Arranging moves */
		this.addPlantMoves(moves, thisGame, player);
		this.addArrangeMoves(moves, thisGame, player);
	}

	return moves;
};

SkudAIv1.prototype.addAccentSelectionMoves = function(moves, game) {
	/* Status: Random, working
	*/

	var tilePile = this.getTilePile(game, this.player);

	var availableAccents = [];

	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].type === ACCENT_TILE) {
			availableAccents.push(tilePile[i]);
		}
	}

	// For now, get four random accent tiles
	var chosenAccents = [];

	var length = 4;
	if (simpleCanonRules) {
		length = 2;
	}

	for (var i = 0; i < length; i++) {
		var chosenIndex = Math.floor(Math.random() * availableAccents.length);
		var randomAccentTile = availableAccents.splice(chosenIndex, 1)[0];
		chosenAccents.push(randomAccentTile.code);
	}

	var move = new SkudPaiShoNotationMove("0" + this.player.charAt(0) + "." + chosenAccents.join());
	moves.push(move);
};

SkudAIv1.prototype.addPlantMoves = function(moves, game, player) {
	if (!this.isOpenGate(game)) {
		return;
	}

	var tilePile = this.getTilePile(game, player);

	// For each tile in player's tile reserve ("tile pile"), build Planting moves
	for (var i = 0; i < tilePile.length; i++) {
		var tile = tilePile[i];
		if (tile.type === BASIC_FLOWER) {
			// For each basic flower
			// Get possible plant points
			var convertedMoveNum = this.moveNum * 2;
			game.revealOpenGates(player, tile, convertedMoveNum, true);
			var endPoints = this.getPossibleMovePoints(game);

			for (var j = 0; j < endPoints.length; j++) {
				notationBuilder = new SkudPaiShoNotationBuilder();
				notationBuilder.moveType = PLANTING;

				notationBuilder.plantedFlowerType = tile.code;
				notationBuilder.status = WAITING_FOR_ENDPOINT;

				var endPoint = endPoints[j];

				notationBuilder.endPoint = new NotationPoint(this.getNotation(endPoint));
				var move = notationBuilder.getNotationMove(this.moveNum, player);

				game.hidePossibleMovePoints(true);

				var isDuplicate = false;
				for (var x = 0; x < moves.length; x++) {
					if (moves[x].equals(move)) {
						isDuplicate = true;
					}
				}

				if (!isDuplicate) {
					moves.push(move);
				}
			}
		}
	}
};

SkudAIv1.prototype.addArrangeMoves = function(moves, game, player) {
	var startPoints = this.getStartPoints(game, player);

	for (var i = 0; i < startPoints.length; i++) {
		var startPoint = startPoints[i];

		game.revealPossibleMovePoints(startPoint, true);

		var endPoints = this.getPossibleMovePoints(game);

		for (var j = 0; j < endPoints.length; j++) {
			notationBuilder.status = WAITING_FOR_ENDPOINT;
			notationBuilder.moveType = ARRANGING;
			notationBuilder.startPoint = new NotationPoint(this.getNotation(startPoint));

			var endPoint = endPoints[j];

			notationBuilder.endPoint = new NotationPoint(this.getNotation(endPoint));
			var move = notationBuilder.getNotationMove(this.moveNum, player);

			game.hidePossibleMovePoints(true);

			var isDuplicate = false;
			for (var x = 0; x < moves.length; x++) {
				if (moves[x].equals(move)) {
					isDuplicate = true;
				}
			}

			if (!isDuplicate) {
				moves.push(move);
			}
		}
	}
};

SkudAIv1.prototype.getCurrentPlayerForGame = function(game, notation) {
	if (notation.moves.length <= 1) {
		if (notation.moves.length === 0) {
			return HOST;
		} else {
			return GUEST;
		}
	}
	if (notation.moves.length <= 2) {
		return GUEST;
	}
	var lastPlayer = notation.moves[notation.moves.length - 1].player;

	if (lastPlayer === HOST) {
		return GUEST;
	} else if (lastPlayer === GUEST) {
		return HOST;
	}
};

SkudAIv1.prototype.getNotation = function(boardPoint) {
	return new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString;
};

SkudAIv1.prototype.getStartPoints = function(game, player) {
	var points = [];
	for (var row = 0; row < game.board.cells.length; row++) {
		for (var col = 0; col < game.board.cells[row].length; col++) {
			var startPoint = game.board.cells[row][col];
			if (startPoint.hasTile()
				&& startPoint.tile.ownerName === player
				&& startPoint.tile.type !== ACCENT_TILE
				&& !(startPoint.tile.drained || startPoint.tile.trapped)) {
				
				points.push(game.board.cells[row][col]);
			}
		}
	}
	return points;
};

SkudAIv1.prototype.getPossibleMovePoints = function(game) {
	var points = [];
	for (var row = 0; row < game.board.cells.length; row++) {
		for (var col = 0; col < game.board.cells[row].length; col++) {
			if (game.board.cells[row][col].isType(POSSIBLE_MOVE)) {
				points.push(game.board.cells[row][col]);
			}
		}
	}
	return points;
};

SkudAIv1.prototype.getBasicFlowerTileCode = function(game) {
	var tilePile = this.getTilePile(game);
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].type === BASIC_FLOWER) {
			return tilePile[i].code;
		}
	};
};


SkudAIv1.prototype.tileContainsBasicFlower = function(tilePile) {
	for (var i = 0; i < tilePile.length; i++) {
		if (tilePile[i].type === BASIC_FLOWER) {
			return true;
		}
	}
	return false;
};

SkudAIv1.prototype.getTilePile = function(game, player) {
	var tilePile = game.tileManager.hostTiles;
	if (player === GUEST) {
		tilePile = game.tileManager.guestTiles;
	}
	return tilePile;
};

SkudAIv1.prototype.isOpenGate = function(game) {
	var cells = game.board.cells;
	for (var row = 0; row < cells.length; row++) {
		for (var col = 0; col < cells[row].length; col++) {
			if (cells[row][col].isOpenGate()) {
				return true;
			}
		}
	}
};

SkudAIv1.prototype.getOpponent = function() {
	if (this.player === GUEST) {
		return HOST;
	}
	return GUEST;
};

SkudAIv1.prototype.getNumHarmoniesForPlayer = function(game, player) {
	return game.board.harmonyManager.numHarmoniesForPlayer(player);
};

SkudAIv1.prototype.getNumTilesInGardensForPlayer = function(game, player) {
	return game.board.numTilesInGardensForPlayer(player);
};

SkudAIv1.prototype.getNumTilesOnBoardForPlayer = function(game, player) {
	return game.board.numTilesOnBoardForPlayer(player);
};

SkudAIv1.prototype.getSurroundness = function(game, player) {
	return game.board.getSurroundness(player);
};

SkudAIv1.prototype.getLongestHarmonyRingLength = function(game, player) {
	return game.board.harmonyManager.ringLengthForPlayer(player);
};

SkudAIv1.prototype.getNumHamoniesCrossingCenter = function(game, player) {
	return game.board.harmonyManager.getNumCrossingCenterForPlayer(player);
};

SkudAIv1.prototype.ensurePlant = function(move, game, player) {
	if (move.moveType !== ARRANGING
		|| move.bonusTileCode
		|| !game.board.playerHasNoGrowingFlowers(this.player)) {
		return;
	}

	var moves = [];
	this.addPlantMoves(moves, game, player);

	var randomIndex = Math.floor(Math.random() * moves.length);
	var randomMove = moves.splice(randomIndex, 1)[0];

	if (!randomMove) {
		return;
	}

	move.bonusTileCode = randomMove.plantedFlowerType;

	game.revealOpenGates(player, null, 5, true);
	var endPoints = this.getPossibleMovePoints(game);

	randomIndex = Math.floor(Math.random() * endPoints.length);
	var randomEndPoint = endPoints.splice(randomIndex, 1)[0];

	move.bonusEndPoint = "(" + this.getNotation(randomEndPoint) + ")";
	move.fullMoveText += "+" + move.bonusTileCode + move.bonusEndPoint;
};
