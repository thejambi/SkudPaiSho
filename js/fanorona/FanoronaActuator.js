// Fanorona Actuator
// Renders the Fanorona board using HTML elements with animation support

import { BOARD_COLS, BOARD_ROWS } from './FanoronaBoard';
import { FanoronaBoardPoint, FanoronaPiece } from './FanoronaBoardPoint';
import {
	createDivWithClass,
	createDivWithId,
	removeChildren,
} from '../ActuatorHelp';
import {
	clearMessage,
	gameController,
	pointClicked,
	showPointMessage,
} from '../PaiShoMain';

// Animation constants
export const PIECE_ANIMATION_LENGTH = 300; // ms for piece movement
export const CAPTURE_ANIMATION_LENGTH = 200; // ms for capture fade out

export function FanoronaActuator(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;
	this.animationOn = true;

	// Track piece elements for animation
	this.pieceElements = {};

	this.setupContainer();
}

FanoronaActuator.prototype.setAnimationOn = function(isOn) {
	this.animationOn = isOn;
};

FanoronaActuator.prototype.setupContainer = function() {
	removeChildren(this.gameContainer);

	// Create main board container
	var boardContainer = createDivWithClass("fanoronaBoard");

	// Create tile pile container (for messages)
	var tilePileContainer = createDivWithClass("tilePileContainer");
	var response = createDivWithId("response");
	var gameMessage = createDivWithClass("gameMessage");
	var gameMessage2 = createDivWithClass("gameMessage2");

	// Simple containers for host/guest (not really used for Fanorona but needed for structure)
	var hostTilesContainer = createDivWithClass("hostTilesContainer");
	var guestTilesContainer = createDivWithClass("guestTilesContainer");

	tilePileContainer.appendChild(response);
	tilePileContainer.appendChild(gameMessage);
	tilePileContainer.appendChild(hostTilesContainer);
	tilePileContainer.appendChild(guestTilesContainer);
	tilePileContainer.appendChild(gameMessage2);

	var bcontainer = createDivWithClass("board-container");
	bcontainer.classList.add("fanoronaBoardContainer");
	bcontainer.appendChild(boardContainer);

	this.gameContainer.appendChild(bcontainer);
	this.gameContainer.appendChild(tilePileContainer);

	this.boardContainer = boardContainer;
};

/**
 * Main actuate function
 * @param {FanoronaBoard} board - The current board state
 * @param {FanoronaBoardPoint} selectedPoint - Currently selected point (if any)
 * @param {Array} possibleMoves - Array of possible moves from selected point
 * @param {Object} animationData - Animation data for the move being animated
 *   - fromNotation: starting point notation
 *   - toNotation: ending point notation
 *   - capturedPoints: array of captured point notations
 *   - piece: the piece type being moved
 */
FanoronaActuator.prototype.actuate = function(board, selectedPoint, possibleMoves, animationData) {
	var self = this;

	window.requestAnimationFrame(function() {
		self.htmlify(board, selectedPoint, possibleMoves, animationData);
	});
};

FanoronaActuator.prototype.htmlify = function(board, selectedPoint, possibleMoves, animationData) {
	removeChildren(this.boardContainer);
	this.pieceElements = {};

	// Create SVG for board lines
	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svgElement.classList.add("fanoronaBoardLines");
	svgElement.setAttribute("viewBox", "0 0 800 400");

	// Draw the board lines
	this.drawBoardLines(svgElement);

	this.boardContainer.appendChild(svgElement);

	// Create grid container for points
	var gridContainer = createDivWithClass("fanoronaGrid");

	// Build possible moves lookup
	var possibleMoveNotations = [];
	if (possibleMoves) {
		possibleMoves.forEach(function(move) {
			possibleMoveNotations.push(move.to.getNotationPointString());
		});
	}

	// Build captured points lookup for animation
	var capturedNotations = [];
	if (animationData && animationData.capturedPoints) {
		capturedNotations = animationData.capturedPoints;
	}

	// Create points
	for (var row = 0; row < BOARD_ROWS; row++) {
		var rowDiv = createDivWithClass("fanoronaRow");

		for (var col = 0; col < BOARD_COLS; col++) {
			var point = board.cells[row][col];
			var pointDiv = this.createPointDiv(point, selectedPoint, possibleMoveNotations, animationData, capturedNotations);
			rowDiv.appendChild(pointDiv);
		}

		gridContainer.appendChild(rowDiv);
	}

	this.boardContainer.appendChild(gridContainer);

	// If animation data is present, run the animation
	if (this.animationOn && animationData && animationData.fromNotation && animationData.toNotation) {
		this.animateMove(animationData);
	}
};

FanoronaActuator.prototype.createPointDiv = function(point, selectedPoint, possibleMoveNotations, animationData, capturedNotations) {
	var pointDiv = createDivWithClass("fanoronaPoint");
	var notationString = point.getNotationPointString();

	pointDiv.setAttribute("name", notationString);
	pointDiv.setAttribute("title", notationString);
	pointDiv.setAttribute("data-row", point.row);
	pointDiv.setAttribute("data-col", point.col);

	if (this.isMobile) {
		pointDiv.classList.add("mobile");
	} else {
		pointDiv.classList.add("desktop");
	}

	// Add selection highlighting
	if (selectedPoint && point === selectedPoint) {
		pointDiv.classList.add("fanoronaSelected");
	}

	// Add possible move highlighting
	if (possibleMoveNotations.includes(notationString)) {
		pointDiv.classList.add("fanoronaPossibleMove");
	}

	// Add click handler
	var self = this;
	if (this.isMobile) {
		pointDiv.addEventListener('click', function() {
			pointClicked(this);
			showPointMessage(this);
		});
	} else {
		pointDiv.addEventListener('click', function() {
			pointClicked(this);
		});
		pointDiv.addEventListener('mouseover', function() {
			showPointMessage(this);
		});
		pointDiv.addEventListener('mouseout', function() {
			clearMessage();
		});
	}

	// Handle piece rendering with animation
	var shouldShowPiece = point.hasPiece();
	var isAnimatingFrom = animationData && animationData.fromNotation === notationString;
	var isAnimatingTo = animationData && animationData.toNotation === notationString;
	var isCaptured = capturedNotations.includes(notationString);

	// For animation: show piece at "from" position initially (it will animate to "to")
	if (this.animationOn && animationData) {
		if (isAnimatingTo) {
			// The moving piece - render at destination but position at origin initially
			var pieceDiv = this.createPieceDiv(animationData.piece);
			pieceDiv.classList.add("fanoronaAnimating");
			pieceDiv.setAttribute("data-animation-role", "moving");
			pointDiv.appendChild(pieceDiv);
			this.pieceElements.movingPiece = pieceDiv;
			this.pieceElements.toPoint = pointDiv;
		} else if (shouldShowPiece && !isAnimatingFrom) {
			// Regular piece, not involved in animation
			var pieceDiv = this.createPieceDiv(point.piece);

			// If this piece is being captured, mark it for fade-out animation
			if (isCaptured) {
				pieceDiv.classList.add("fanoronaCaptured");
				pieceDiv.setAttribute("data-animation-role", "captured");
			}

			pointDiv.appendChild(pieceDiv);
		}
	} else {
		// No animation - just render pieces normally
		if (shouldShowPiece) {
			var pieceDiv = this.createPieceDiv(point.piece);
			pointDiv.appendChild(pieceDiv);
		}
	}

	// Store reference for animation
	if (isAnimatingFrom) {
		this.pieceElements.fromPoint = pointDiv;
	}

	return pointDiv;
};

FanoronaActuator.prototype.createPieceDiv = function(pieceType) {
	var pieceDiv = createDivWithClass("fanoronaPiece");
	if (pieceType === FanoronaPiece.WHITE) {
		pieceDiv.classList.add("fanoronaWhite");
	} else {
		pieceDiv.classList.add("fanoronaBlack");
	}
	return pieceDiv;
};

FanoronaActuator.prototype.animateMove = function(animationData) {
	var self = this;
	var movingPiece = this.pieceElements.movingPiece;
	var fromPoint = this.pieceElements.fromPoint;
	var toPoint = this.pieceElements.toPoint;

	if (!movingPiece || !fromPoint || !toPoint) {
		// Can't animate, just call completion
		if (animationData.onComplete) {
			animationData.onComplete();
		}
		return;
	}

	// Calculate the offset from destination to origin
	var fromRect = fromPoint.getBoundingClientRect();
	var toRect = toPoint.getBoundingClientRect();

	var deltaX = fromRect.left - toRect.left;
	var deltaY = fromRect.top - toRect.top;

	// Position piece at origin initially (using transform)
	movingPiece.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
	movingPiece.style.transition = 'none';

	// Force reflow to apply the initial position
	movingPiece.offsetHeight;

	// Animate to destination
	requestAnimationFrame(function() {
		movingPiece.style.transition = 'transform ' + PIECE_ANIMATION_LENGTH + 'ms ease-out';
		movingPiece.style.transform = 'translate(0, 0)';
	});

	// After piece movement completes, animate captures
	setTimeout(function() {
		self.animateCaptures(animationData);
	}, PIECE_ANIMATION_LENGTH);
};

FanoronaActuator.prototype.animateCaptures = function(animationData) {
	var self = this;

	// Find all captured pieces and fade them out
	var capturedPieces = document.querySelectorAll('.fanoronaCaptured');

	if (capturedPieces.length > 0) {
		capturedPieces.forEach(function(piece) {
			piece.classList.add("fanoronaFadeOut");
		});

		// After capture animation completes, call onComplete
		setTimeout(function() {
			if (animationData.onComplete) {
				animationData.onComplete();
			}
		}, CAPTURE_ANIMATION_LENGTH);
	} else {
		// No captures to animate, call onComplete immediately
		if (animationData.onComplete) {
			animationData.onComplete();
		}
	}
};

FanoronaActuator.prototype.drawBoardLines = function(svg) {
	// Constants for positioning (matching CSS)
	var pointSpacing = 100;
	var startX = 0;
	var startY = 0;

	// Draw horizontal lines
	for (var row = 0; row < BOARD_ROWS; row++) {
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1", startX);
		line.setAttribute("y1", startY + row * pointSpacing);
		line.setAttribute("x2", startX + (BOARD_COLS - 1) * pointSpacing);
		line.setAttribute("y2", startY + row * pointSpacing);
		line.classList.add("fanoronaLine");
		svg.appendChild(line);
	}

	// Draw vertical lines
	for (var col = 0; col < BOARD_COLS; col++) {
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1", startX + col * pointSpacing);
		line.setAttribute("y1", startY);
		line.setAttribute("x2", startX + col * pointSpacing);
		line.setAttribute("y2", startY + (BOARD_ROWS - 1) * pointSpacing);
		line.classList.add("fanoronaLine");
		svg.appendChild(line);
	}

	// Draw diagonal lines (only where (row + col) is even)
	for (var row = 0; row < BOARD_ROWS; row++) {
		for (var col = 0; col < BOARD_COLS; col++) {
			if ((row + col) % 2 === 0) {
				// Draw diagonal to bottom-right if in bounds
				if (row + 1 < BOARD_ROWS && col + 1 < BOARD_COLS) {
					var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
					line.setAttribute("x1", startX + col * pointSpacing);
					line.setAttribute("y1", startY + row * pointSpacing);
					line.setAttribute("x2", startX + (col + 1) * pointSpacing);
					line.setAttribute("y2", startY + (row + 1) * pointSpacing);
					line.classList.add("fanoronaLine");
					svg.appendChild(line);
				}

				// Draw diagonal to bottom-left if in bounds
				if (row + 1 < BOARD_ROWS && col - 1 >= 0) {
					var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
					line.setAttribute("x1", startX + col * pointSpacing);
					line.setAttribute("y1", startY + row * pointSpacing);
					line.setAttribute("x2", startX + (col - 1) * pointSpacing);
					line.setAttribute("y2", startY + (row + 1) * pointSpacing);
					line.classList.add("fanoronaLine");
					svg.appendChild(line);
				}
			}
		}
	}
};
