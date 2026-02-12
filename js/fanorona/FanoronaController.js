// Fanorona Controller
// Main interface between the game and the application

import { GUEST, HOST } from '../CommonNotationObjects';
import { debug } from '../GameData';
import { getResetMoveElement } from '../GameFlow';
import {
	BRAND_NEW,
	GameType,
	callSubmitMove,
	closeModal,
	createGameIfThatIsOk,
	currentMoveIndex,
	finalizeMove,
	gameId,
	getCurrentPlayer,
	myTurn,
	onlinePlayEnabled,
	playingOnlineGame,
	rerunAll,
	showModal,
} from '../PaiShoMain';
import { userIsLoggedIn } from '../UserData';
import { FanoronaActuator } from './FanoronaActuator';
import { FanoronaGameManager } from './FanoronaGameManager';
import {
	FanoronaGameNotation,
	FanoronaNotationBuilder,
	CaptureType
} from './FanoronaGameNotation';
import { FanoronaBoardPoint, FanoronaPiece } from './FanoronaBoardPoint';
import { getOppositeDirection } from './FanoronaBoard';

export function FanoronaController(gameContainer, isMobile) {
	this.isMobile = isMobile;
	this.actuator = new FanoronaActuator(gameContainer, isMobile);

	this.resetGameManager();
	this.resetNotationBuilder();
	this.resetGameNotation();
}

FanoronaController.prototype.getGameTypeId = function() {
	return GameType.Fanorona.id;
};

FanoronaController.prototype.completeSetup = function() {
	// Nothing special needed
};

FanoronaController.prototype.resetGameManager = function() {
	this.theGame = new FanoronaGameManager(this.actuator);
};

FanoronaController.prototype.resetNotationBuilder = function() {
	this.notationBuilder = new FanoronaNotationBuilder();
};

FanoronaController.prototype.resetGameNotation = function() {
	this.gameNotation = this.getNewGameNotation();
};

FanoronaController.prototype.getNewGameNotation = function() {
	return new FanoronaGameNotation();
};

FanoronaController.prototype.callActuate = function() {
	this.theGame.actuate();
};

FanoronaController.prototype.resetMove = function() {
	if (this.notationBuilder.moves.length > 0) {
		// Move in progress - reset the builder
		this.notationBuilder.reset();
		this.theGame.clearSelection();
		this.theGame.chainCapturePiece = null;
		this.theGame.chainCaptureVisited = [];
		this.theGame.chainCaptureLastDirection = null;
	} else {
		// No move in progress - undo last move
		this.gameNotation.removeLastMove();
	}
	rerunAll();
};

FanoronaController.prototype.getDefaultHelpMessageText = function() {
	return "<h4>Fanorona</h4>"
		+ "<p><em>A traditional strategy game from Madagascar.</em></p>"
		+ "<h4>Objective</h4>"
		+ "<p>Capture all of your opponent's pieces.</p>"
		+ "<h4>Movement</h4>"
		+ "<p>Pieces move one step along lines to adjacent empty intersections. "
		+ "Diagonal moves are only allowed on intersections that have diagonal lines.</p>"
		+ "<h4>Capturing</h4>"
		+ "<p>Captures are made by either:</p>"
		+ "<ul>"
		+ "<li><strong>Approach:</strong> Move toward enemy pieces and capture all enemy pieces in that line of direction.</li>"
		+ "<li><strong>Withdrawal:</strong> Move away from enemy pieces and capture all enemy pieces in the opposite direction.</li>"
		+ "</ul>"
		+ "<p>Capturing is mandatory when possible (except on the very first move of the game).</p>"
		+ "<h4>Chain Captures</h4>"
		+ "<p>After capturing, if the same piece can make another capture, it must continue. "
		+ "During a chain capture, you cannot revisit a point or reverse direction.</p>"
		+ "<p>Read more about Fanorona <a href='https://en.wikipedia.org/wiki/Fanorona' target='_blank'>here</a>.</p>";
};

FanoronaController.prototype.getAdditionalMessage = function() {
	var msgElement = document.createElement("span");
	var game = this.theGame;
	var notation = this.notationBuilder;

	if (this.gameNotation.moves.length === 0) {
		var startText = document.createElement("span");
		if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
			startText.textContent = "Click Join Game above to join another player's game, or make the first move to start a new game.";
		} else {
			startText.textContent = "White (Host) moves first. On the first move, capturing is optional.";
		}
		msgElement.appendChild(startText);
	} else if (this.theGame.hasEnded()) {
		var endText = document.createElement("span");
		var winner = this.theGame.getWinner();
		endText.textContent = (winner === HOST ? "White" : "Black") + this.theGame.getWinReason();
		msgElement.appendChild(endText);
	} else if (notation.moves.length > 0) {
		// Move in progress (chain capture)
		var chainText = document.createElement("span");
		if (this.theGame.canContinueChainCapture(this.theGame.chainCapturePiece, getCurrentPlayer())) {
			chainText.textContent = "Chain capture in progress. Continue capturing or ";
			var endChainSpan = document.createElement("span");
			endChainSpan.className = 'clickableText';
			endChainSpan.textContent = 'end turn';
			endChainSpan.onclick = () => this.endChainCapture();
			msgElement.appendChild(chainText);
			msgElement.appendChild(endChainSpan);
		} else {
			// No more captures possible, auto-end
			this.endChainCapture();
		}
		msgElement.appendChild(document.createElement("br"));
		msgElement.appendChild(getResetMoveElement());
	}

	// Show piece counts
	var whitePieces = this.theGame.board.countPieces(FanoronaPiece.WHITE);
	var blackPieces = this.theGame.board.countPieces(FanoronaPiece.BLACK);
	var scoreDiv = document.createElement("div");
	scoreDiv.className = "fanoronaScore";
	scoreDiv.innerHTML = "<span class='fanoronaScoreHost'>White: " + whitePieces + "</span>"
		+ "<span class='fanoronaScoreGuest'>Black: " + blackPieces + "</span>";
	msgElement.appendChild(scoreDiv);

	return msgElement;
};

FanoronaController.prototype.unplayedTileClicked = function(tileDiv) {
	// Fanorona doesn't have unplayed tiles
};

FanoronaController.prototype.pointClicked = function(htmlPoint) {
	if (this.theGame.hasEnded()) {
		return;
	}
	if (!myTurn()) {
		return;
	}
	if (currentMoveIndex !== this.gameNotation.moves.length) {
		debug("Can only interact if all moves are played.");
		return;
	}

	var pointName = htmlPoint.getAttribute("name");
	var point = this.theGame.board.getPointFromNotation(pointName);

	if (!point) {
		return;
	}

	var currentPlayer = getCurrentPlayer();
	var playerPiece = this.theGame.getPieceForPlayer(currentPlayer);

	// If a piece is selected and clicking on a possible move destination
	if (this.theGame.selectedPoint && !point.hasPiece()) {
		var possibleMove = this.findPossibleMove(point);
		if (possibleMove) {
			this.handleMove(possibleMove);
			return;
		}
	}

	// Try to select a piece
	if (point.hasPiece() && point.piece === playerPiece) {
		var result = this.theGame.selectPoint(point, currentPlayer);
		if (result.selected) {
			// Check if captures are required
			var mustCapture = this.theGame.mustCapture(currentPlayer);
			if (mustCapture) {
				// Filter to only show capturing moves
				var capturingMoves = result.moves.filter(function(m) { return m.isCapture; });
				if (capturingMoves.length === 0) {
					// This piece has no capturing moves, but captures are required
					// Deselect and show message
					this.theGame.clearSelection();
					debug("This piece has no capturing moves. You must capture.");
				} else {
					this.theGame.possibleMoves = capturingMoves;
				}
			}
			this.theGame.actuate();
		}
	}
};

FanoronaController.prototype.findPossibleMove = function(toPoint) {
	for (var i = 0; i < this.theGame.possibleMoves.length; i++) {
		if (this.theGame.possibleMoves[i].to === toPoint) {
			return this.theGame.possibleMoves[i];
		}
	}
	return null;
};

FanoronaController.prototype.handleMove = function(move) {
	var fromPoint = this.theGame.selectedPoint;
	var toPoint = move.to;
	var fromNotation = fromPoint.getNotationPointString();
	var toNotation = toPoint.getNotationPointString();

	// Check if we need to choose between approach and withdrawal
	if (move.canApproach && move.canWithdraw) {
		this.showCaptureChoice(fromNotation, toNotation, move);
		return;
	}

	// Determine capture type
	var captureType = CaptureType.NONE;
	if (move.canApproach) {
		captureType = CaptureType.APPROACH;
	} else if (move.canWithdraw) {
		captureType = CaptureType.WITHDRAWAL;
	}

	this.executeMove(fromNotation, toNotation, move.direction, captureType, move.isCapture);
};

FanoronaController.prototype.showCaptureChoice = function(fromNotation, toNotation, move) {
	var self = this;

	var container = document.createElement("div");
	container.innerHTML = "<p>Choose capture type:</p>"
		+ "<p><strong>Approach</strong> will capture " + move.approachCount + " piece(s) ahead.</p>"
		+ "<p><strong>Withdrawal</strong> will capture " + move.withdrawCount + " piece(s) behind.</p>";

	var choiceDiv = document.createElement("div");
	choiceDiv.className = "fanoronaCaptureChoice";

	var approachBtn = document.createElement("button");
	approachBtn.className = "fanoronaCaptureButton";
	approachBtn.textContent = "Approach (" + move.approachCount + ")";
	approachBtn.onclick = function() {
		closeModal();
		self.executeMove(fromNotation, toNotation, move.direction, CaptureType.APPROACH, true);
	};

	var withdrawBtn = document.createElement("button");
	withdrawBtn.className = "fanoronaCaptureButton";
	withdrawBtn.textContent = "Withdrawal (" + move.withdrawCount + ")";
	withdrawBtn.onclick = function() {
		closeModal();
		self.executeMove(fromNotation, toNotation, move.direction, CaptureType.WITHDRAWAL, true);
	};

	choiceDiv.appendChild(approachBtn);
	choiceDiv.appendChild(withdrawBtn);
	container.appendChild(choiceDiv);

	showModal("Capture Choice", container);
};

FanoronaController.prototype.executeMove = function(fromNotation, toNotation, direction, captureType, isCapture) {
	// Add to notation builder
	this.notationBuilder.setStartPoint(fromNotation);
	this.notationBuilder.setEndPoint(toNotation, captureType);

	// Execute the move on the board (for visual feedback during chains)
	this.theGame.executeMove(fromNotation, toNotation, captureType);

	// Get the moved piece's new location
	var newPoint = this.theGame.board.getPointFromNotation(toNotation);

	// Check for chain capture
	if (isCapture) {
		this.theGame.continueChainCapture(newPoint, direction);

		// Check if more captures are possible
		if (this.theGame.canContinueChainCapture(newPoint, getCurrentPlayer())) {
			// Continue chain - select the piece for next move
			this.theGame.selectedPoint = newPoint;
			this.theGame.possibleMoves = this.theGame.getPossibleMovesFrom(newPoint, getCurrentPlayer());
			// Filter to only capturing moves
			this.theGame.possibleMoves = this.theGame.possibleMoves.filter(function(m) { return m.isCapture; });
			this.theGame.actuate();
			return; // Don't complete the move yet
		}
	}

	// Complete the move
	this.completeMove();
};

FanoronaController.prototype.endChainCapture = function() {
	if (this.notationBuilder.moves.length > 0) {
		this.completeMove();
	}
};

FanoronaController.prototype.completeMove = function() {
	var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);

	// Reset chain capture state
	this.theGame.chainCapturePiece = null;
	this.theGame.chainCaptureVisited = [];
	this.theGame.chainCaptureLastDirection = null;
	this.theGame.isFirstMove = false;
	this.theGame.clearSelection();

	// Add move to notation
	this.gameNotation.addMove(move);

	// Reset builder
	this.notationBuilder.reset();

	// Handle online/offline game flow
	if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
		createGameIfThatIsOk(this.getGameTypeId());
	} else {
		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}
};

FanoronaController.prototype.getTileMessage = function(tileDiv) {
	// Not used for Fanorona
	return null;
};

FanoronaController.prototype.getPointMessage = function(htmlPoint) {
	var pointName = htmlPoint.getAttribute("name");
	var point = this.theGame.board.getPointFromNotation(pointName);

	if (!point) {
		return null;
	}

	var message = "Point: " + pointName;
	if (point.hasPiece()) {
		message += "\n" + (point.piece === FanoronaPiece.WHITE ? "White" : "Black") + " piece";
	} else {
		message += "\nEmpty";
	}

	if (point.hasDiagonals) {
		message += "\nDiagonal moves allowed";
	}

	return {
		heading: pointName.toUpperCase(),
		message: message
	};
};

FanoronaController.prototype.playAiTurn = function(finalizeMove) {
	// AI not implemented yet
};

FanoronaController.prototype.startAiGame = function(finalizeMove) {
	// AI not implemented yet
};

FanoronaController.prototype.getAiList = function() {
	return []; // No AI yet
};

FanoronaController.prototype.getCurrentPlayer = function() {
	if (this.gameNotation.moves.length % 2 === 0) {
		return HOST;
	}
	return GUEST;
};

FanoronaController.prototype.cleanup = function() {
	// Nothing to clean up
};

FanoronaController.prototype.isSolitaire = function() {
	return false;
};

FanoronaController.prototype.setGameNotation = function(newGameNotation) {
	this.gameNotation.setNotationText(newGameNotation);
};

// Static methods for tile containers (not really needed for Fanorona but included for consistency)
FanoronaController.prototype.getHostTilesContainerDivs = function() {
	return "";
};

FanoronaController.prototype.getGuestTilesContainerDivs = function() {
	return "";
};
