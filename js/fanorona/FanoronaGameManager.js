// Fanorona Game Manager
// Handles game state and rules

import { GUEST, HOST } from '../CommonNotationObjects';
import { FanoronaBoard, getOppositeDirection, AllDirections, OrthogonalDirections, DiagonalDirections, Directions } from './FanoronaBoard';
import { FanoronaBoardPoint, FanoronaPiece } from './FanoronaBoardPoint';
import { CaptureType } from './FanoronaGameNotation';
import { debug } from '../GameData';
import { PIECE_ANIMATION_LENGTH, CAPTURE_ANIMATION_LENGTH } from './FanoronaActuator';

export function FanoronaGameManager(actuator, ignoreActuate, isCopy) {
	this.isCopy = isCopy;
	this.actuator = actuator;
	this.board = new FanoronaBoard();

	// Track chain capture state
	this.chainCapturePiece = null; // The piece currently doing a chain capture
	this.chainCaptureVisited = []; // Points visited during chain
	this.chainCaptureLastDirection = null; // Last direction moved (can't reverse)
	this.isFirstMove = true; // First move of the game doesn't require capture

	// Highlighted points for UI
	this.selectedPoint = null;
	this.possibleMoves = [];
	this.captureRequired = false;

	// Animation state
	this.isAnimating = false;

	if (!ignoreActuate) {
		this.actuate();
	}
}

FanoronaGameManager.prototype.actuate = function(animationData) {
	if (this.isCopy) {
		return;
	}
	this.actuator.actuate(this.board, this.selectedPoint, this.possibleMoves, animationData);
};

/**
 * Run a notation move with optional animation
 * @param {FanoronaNotationMove} move - The move to run
 * @param {boolean} withActuate - Whether to actuate after
 * @param {*} moveAnimationBeginStep_unused - Unused, for compatibility with main replay system
 * @param {boolean} skipAnimation - Whether to skip animation (false = animate, true = no animation)
 */
FanoronaGameManager.prototype.runNotationMove = function(move, withActuate, moveAnimationBeginStep_unused, skipAnimation) {
	debug("Running Move: " + move.fullMoveText);

	var self = this;
	var animate = !skipAnimation;

	if (animate && move.moves.length > 0) {
		// Run moves with animation, sequentially
		this.runMovesAnimated(move.moves, 0, function() {
			self.finishNotationMove();
			if (withActuate) {
				self.actuate();
			}
			if (onComplete) {
				onComplete();
			}
		});
	} else {
		// Run all moves immediately without animation
		move.moves.forEach(function(m) {
			self.executeMove(m.from, m.to, m.captureType);
		});

		this.finishNotationMove();

		if (withActuate) {
			this.actuate();
		}
		if (onComplete) {
			onComplete();
		}
	}
};

FanoronaGameManager.prototype.finishNotationMove = function() {
	// Reset chain capture state after a complete turn
	this.chainCapturePiece = null;
	this.chainCaptureVisited = [];
	this.chainCaptureLastDirection = null;
	this.isFirstMove = false;

	// Clear selection
	this.selectedPoint = null;
	this.possibleMoves = [];
};

/**
 * Run a sequence of moves with animation
 */
FanoronaGameManager.prototype.runMovesAnimated = function(moves, index, onComplete) {
	if (index >= moves.length) {
		if (onComplete) {
			onComplete();
		}
		return;
	}

	var self = this;
	var m = moves[index];

	this.executeMoveAnimated(m.from, m.to, m.captureType, function() {
		// Continue with next move in sequence
		self.runMovesAnimated(moves, index + 1, onComplete);
	});
};

/**
 * Execute a single move with animation
 */
FanoronaGameManager.prototype.executeMoveAnimated = function(fromNotation, toNotation, captureType, onComplete) {
	var fromPoint = this.board.getPointFromNotation(fromNotation);
	var toPoint = this.board.getPointFromNotation(toNotation);

	if (!fromPoint || !toPoint) {
		debug("Invalid move points");
		if (onComplete) onComplete();
		return;
	}

	var direction = this.board.getDirection(fromPoint, toPoint);
	if (!direction) {
		debug("Invalid move direction");
		if (onComplete) onComplete();
		return;
	}

	var piece = fromPoint.piece;

	// Calculate captured pieces BEFORE executing the move
	var capturedPoints = this.getCapturedPointNotations(fromPoint, toPoint, direction, captureType);

	// Execute the move on the board (updates state)
	this.board.movePiece(fromPoint, toPoint);

	// Handle captures
	if (captureType === CaptureType.APPROACH) {
		var captured = this.board.getPiecesInDirection(toPoint, direction, this.getEnemyPiece(piece));
		this.board.removePieces(captured);
	} else if (captureType === CaptureType.WITHDRAWAL) {
		var oppositeDir = getOppositeDirection(direction);
		var captured = this.board.getPiecesInDirection(fromPoint, oppositeDir, this.getEnemyPiece(piece));
		this.board.removePieces(captured);
	}

	// Create animation data
	var animationData = {
		fromNotation: fromNotation,
		toNotation: toNotation,
		capturedPoints: capturedPoints,
		piece: piece,
		onComplete: onComplete
	};

	this.isAnimating = true;

	// Actuate with animation
	this.actuate(animationData);

	// The actuator will call onComplete when animation finishes
};

/**
 * Get the notation strings of points that will be captured
 */
FanoronaGameManager.prototype.getCapturedPointNotations = function(fromPoint, toPoint, direction, captureType) {
	var capturedNotations = [];
	var piece = fromPoint.piece;
	var enemyPiece = this.getEnemyPiece(piece);

	if (captureType === CaptureType.APPROACH) {
		var captured = this.board.getPiecesInDirection(toPoint, direction, enemyPiece);
		captured.forEach(function(p) {
			capturedNotations.push(p.getNotationPointString());
		});
	} else if (captureType === CaptureType.WITHDRAWAL) {
		var oppositeDir = getOppositeDirection(direction);
		var captured = this.board.getPiecesInDirection(fromPoint, oppositeDir, enemyPiece);
		captured.forEach(function(p) {
			capturedNotations.push(p.getNotationPointString());
		});
	}

	return capturedNotations;
};

FanoronaGameManager.prototype.executeMove = function(fromNotation, toNotation, captureType) {
	var fromPoint = this.board.getPointFromNotation(fromNotation);
	var toPoint = this.board.getPointFromNotation(toNotation);

	if (!fromPoint || !toPoint) {
		debug("Invalid move points");
		return false;
	}

	var direction = this.board.getDirection(fromPoint, toPoint);
	if (!direction) {
		debug("Invalid move direction");
		return false;
	}

	// Move the piece
	this.board.movePiece(fromPoint, toPoint);

	// Handle captures
	if (captureType === CaptureType.APPROACH) {
		// Capture pieces in the direction of movement, starting from destination
		var captured = this.board.getPiecesInDirection(toPoint, direction, this.getEnemyPiece(toPoint.piece));
		this.board.removePieces(captured);
		debug("Approach capture: " + captured.length + " pieces");
	} else if (captureType === CaptureType.WITHDRAWAL) {
		// Capture pieces in the opposite direction, starting from the original position
		var oppositeDir = getOppositeDirection(direction);
		var captured = this.board.getPiecesInDirection(fromPoint, oppositeDir, this.getEnemyPiece(toPoint.piece));
		this.board.removePieces(captured);
		debug("Withdrawal capture: " + captured.length + " pieces");
	}

	return true;
};

FanoronaGameManager.prototype.getEnemyPiece = function(piece) {
	return piece === FanoronaPiece.WHITE ? FanoronaPiece.BLACK : FanoronaPiece.WHITE;
};

FanoronaGameManager.prototype.getPieceForPlayer = function(player) {
	return player === HOST ? FanoronaPiece.WHITE : FanoronaPiece.BLACK;
};

FanoronaGameManager.prototype.selectPoint = function(point, currentPlayer) {
	var playerPiece = this.getPieceForPlayer(currentPlayer);

	// If clicking on own piece, select it and show moves
	if (point.hasPiece() && point.piece === playerPiece) {
		// During chain capture, can only move the chain piece
		if (this.chainCapturePiece && point !== this.chainCapturePiece) {
			return { selected: false };
		}

		this.selectedPoint = point;
		this.possibleMoves = this.getPossibleMovesFrom(point, currentPlayer);
		return { selected: true, moves: this.possibleMoves };
	}

	return { selected: false };
};

FanoronaGameManager.prototype.getPossibleMovesFrom = function(fromPoint, currentPlayer) {
	var moves = [];
	var playerPiece = this.getPieceForPlayer(currentPlayer);
	var enemyPiece = this.getEnemyPiece(playerPiece);

	if (!fromPoint.hasPiece() || fromPoint.piece !== playerPiece) {
		return moves;
	}

	// Get valid directions from this point
	var directions = this.board.getDirectionsFromPoint(fromPoint);

	var self = this;
	directions.forEach(function(dir) {
		// Skip if this is the reverse of the last chain capture direction
		if (self.chainCaptureLastDirection && dir === getOppositeDirection(self.chainCaptureLastDirection)) {
			return;
		}

		var toPoint = self.board.getAdjacentPoint(fromPoint, dir);
		if (!toPoint || toPoint.hasPiece()) {
			return; // Can't move to occupied or off-board
		}

		// Check if this point was visited during chain capture
		if (self.chainCaptureVisited.includes(toPoint.getNotationPointString())) {
			return;
		}

		// Check for possible captures
		var canApproach = false;
		var canWithdraw = false;

		// Approach capture: enemy pieces in the direction of movement beyond destination
		var approachCaptures = self.board.getPiecesInDirection(toPoint, dir, enemyPiece);
		if (approachCaptures.length > 0) {
			canApproach = true;
		}

		// Withdrawal capture: enemy pieces in opposite direction from origin
		var oppositeDir = getOppositeDirection(dir);
		var withdrawCaptures = self.board.getPiecesInDirection(fromPoint, oppositeDir, enemyPiece);
		if (withdrawCaptures.length > 0) {
			canWithdraw = true;
		}

		var move = {
			to: toPoint,
			direction: dir,
			canApproach: canApproach,
			canWithdraw: canWithdraw,
			isCapture: canApproach || canWithdraw,
			approachCount: approachCaptures.length,
			withdrawCount: withdrawCaptures.length
		};

		moves.push(move);
	});

	// If in chain capture, only allow capturing moves
	if (this.chainCapturePiece) {
		moves = moves.filter(function(m) { return m.isCapture; });
	}

	return moves;
};

FanoronaGameManager.prototype.hasCapturingMoves = function(currentPlayer) {
	var playerPiece = this.getPieceForPlayer(currentPlayer);
	var pieces = this.board.getPiecesForPlayer(currentPlayer);
	var self = this;

	for (var i = 0; i < pieces.length; i++) {
		// During chain capture, only check the chain piece
		if (this.chainCapturePiece && pieces[i] !== this.chainCapturePiece) {
			continue;
		}

		var moves = this.getPossibleMovesFrom(pieces[i], currentPlayer);
		for (var j = 0; j < moves.length; j++) {
			if (moves[j].isCapture) {
				return true;
			}
		}
	}

	return false;
};

FanoronaGameManager.prototype.mustCapture = function(currentPlayer) {
	// First move doesn't require capture
	if (this.isFirstMove) {
		return false;
	}
	return this.hasCapturingMoves(currentPlayer);
};

FanoronaGameManager.prototype.canContinueChainCapture = function(fromPoint, currentPlayer) {
	var moves = this.getPossibleMovesFrom(fromPoint, currentPlayer);
	return moves.some(function(m) { return m.isCapture; });
};

FanoronaGameManager.prototype.startChainCapture = function(point, direction) {
	this.chainCapturePiece = point;
	this.chainCaptureVisited = [point.getNotationPointString()];
	this.chainCaptureLastDirection = direction;
};

FanoronaGameManager.prototype.continueChainCapture = function(toPoint, direction) {
	this.chainCapturePiece = toPoint;
	this.chainCaptureVisited.push(toPoint.getNotationPointString());
	this.chainCaptureLastDirection = direction;
};

FanoronaGameManager.prototype.hasLegalMoves = function(player) {
	var pieces = this.board.getPiecesForPlayer(player);
	var self = this;

	for (var i = 0; i < pieces.length; i++) {
		var moves = this.getPossibleMovesFrom(pieces[i], player);
		if (moves.length > 0) {
			return true;
		}
	}

	return false;
};

FanoronaGameManager.prototype.hasEnded = function() {
	return this.getWinner() !== null;
};

FanoronaGameManager.prototype.getWinner = function() {
	var whitePieces = this.board.countPieces(FanoronaPiece.WHITE);
	var blackPieces = this.board.countPieces(FanoronaPiece.BLACK);

	// Win by capturing all opponent pieces
	if (whitePieces === 0) {
		return GUEST;
	}
	if (blackPieces === 0) {
		return HOST;
	}

	// Win if opponent has no legal moves (rare)
	// Note: We'd need to know whose turn it is, so this is checked differently
	return null;
};

FanoronaGameManager.prototype.getWinReason = function() {
	var whitePieces = this.board.countPieces(FanoronaPiece.WHITE);
	var blackPieces = this.board.countPieces(FanoronaPiece.BLACK);

	if (whitePieces === 0) {
		return " captured all opponent's pieces!";
	}
	if (blackPieces === 0) {
		return " captured all opponent's pieces!";
	}

	return " won the game!";
};

FanoronaGameManager.prototype.getWinResultTypeCode = function() {
	if (this.getWinner()) {
		return 1;
	}
	return 0;
};

FanoronaGameManager.prototype.getCopy = function() {
	var copy = new FanoronaGameManager(this.actuator, true, true);
	copy.board = this.board.getCopy();
	copy.chainCapturePiece = this.chainCapturePiece;
	copy.chainCaptureVisited = this.chainCaptureVisited.slice();
	copy.chainCaptureLastDirection = this.chainCaptureLastDirection;
	copy.isFirstMove = this.isFirstMove;
	return copy;
};

FanoronaGameManager.prototype.clearSelection = function() {
	this.selectedPoint = null;
	this.possibleMoves = [];
};

/**
 * Get total animation time for a single sub-move
 */
FanoronaGameManager.prototype.getAnimationTime = function() {
	return PIECE_ANIMATION_LENGTH + CAPTURE_ANIMATION_LENGTH;
};
