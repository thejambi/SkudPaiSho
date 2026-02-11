// Undergrowth Simplicity Actuator - 2D board rendering

import { GUEST, HOST } from '../CommonNotationObjects';
import {
	MARKED,
	NON_PLAYABLE,
	POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	RmbDown,
	RmbUp,
	clearMessage,
	pieceAnimationLength,
	piecePlaceAnimation,
	pointClicked,
	showPointMessage,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import {
	createBoardArrow,
	createBoardPointDiv,
	isSamePoint,
	setupPaiShoBoard,
} from '../ActuatorHelp';
import { CENTER_POINT } from './UndergrowthSimplicityBoardPoint';

export function UndergrowthSimplicityActuator(gameContainer, isMobile, enableAnimations) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;
	this.animationOn = enableAnimations;

	var containers = setupPaiShoBoard(
		this.gameContainer,
		UndergrowthSimplicityActuator.getHostTilesContainerDivs(),
		UndergrowthSimplicityActuator.getGuestTilesContainerDivs(),
		false
	);

	this.boardContainer = containers.boardContainer;
	this.arrowContainer = containers.arrowContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

UndergrowthSimplicityActuator.getHostTilesContainerDivs = function() {
	return '<div class="HBack"></div>';
};

UndergrowthSimplicityActuator.getGuestTilesContainerDivs = function() {
	return '<div class="GBack"></div>';
};

UndergrowthSimplicityActuator.prototype.setAnimationOn = function(isOn) {
	this.animationOn = isOn;
};

UndergrowthSimplicityActuator.prototype.actuate = function(board, theGame, markingManager, moveToAnimate, moveAnimationBeginStep) {
	var self = this;

	if (!moveAnimationBeginStep) {
		moveAnimationBeginStep = 0;
	}

	window.requestAnimationFrame(function() {
		self.htmlify(board, theGame, markingManager, moveToAnimate, moveAnimationBeginStep);
	});
};

UndergrowthSimplicityActuator.prototype.htmlify = function(board, theGame, markingManager, moveToAnimate, moveAnimationBeginStep) {
	this.clearContainer(this.boardContainer);
	this.clearContainer(this.arrowContainer);

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (cell) {
				if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)) {
					cell.addType(MARKED);
				} else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)) {
					cell.removeType(MARKED);
				}
				self.addBoardPoint(cell, moveToAnimate, moveAnimationBeginStep);
			}
		});
	});

	// Draw arrows
	for (var [_, arrow] of Object.entries(markingManager.arrows)) {
		this.arrowContainer.appendChild(createBoardArrow(arrow[0], arrow[1]));
	}

	// Update tile piles - show a single stone for each player
	this.updateTilePile(this.hostTilesContainer, "HBack", "H");
	this.updateTilePile(this.guestTilesContainer, "GBack", "G");
};

UndergrowthSimplicityActuator.prototype.updateTilePile = function(container, className, ownerCode) {
	var tileContainer = container.querySelector("." + className);
	if (!tileContainer) return;

	// Clear existing
	while (tileContainer.firstChild) {
		tileContainer.removeChild(tileContainer.firstChild);
	}

	var theDiv = document.createElement("div");
	theDiv.classList.add("point");
	theDiv.classList.add("hasTile");

	var theImg = document.createElement("img");
	theImg.src = "images/Adevar/monochrome/" + ownerCode + "Back.png";
	theDiv.appendChild(theImg);

	theDiv.setAttribute("name", ownerCode + "Back");
	theDiv.setAttribute("id", ownerCode + "Stone");

	if (this.mobile) {
		theDiv.addEventListener('click', function() {
			unplayedTileClicked(theDiv);
			showTileMessage(theDiv);
		});
	} else {
		theDiv.addEventListener('click', function() { unplayedTileClicked(theDiv); });
		theDiv.addEventListener('mouseover', function() { showTileMessage(theDiv); });
		theDiv.addEventListener('mouseout', clearMessage);
	}

	tileContainer.appendChild(theDiv);
};

UndergrowthSimplicityActuator.prototype.clearContainer = function(container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

UndergrowthSimplicityActuator.prototype.addBoardPoint = function(boardPoint, moveToAnimate, moveAnimationBeginStep) {
	var theDiv = createBoardPointDiv(boardPoint);

	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add("activePoint");
		if (boardPoint.isType(MARKED)) {
			theDiv.classList.add("markedPoint");
		}
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			theDiv.classList.add("possibleMove");
		} else if (boardPoint.betweenConnection) {
			theDiv.classList.add("betweenHarmony");
			if (boardPoint.betweenConnectionHost) {
				theDiv.classList.add("bhHost");
			}
			if (boardPoint.betweenConnectionGuest) {
				theDiv.classList.add("bhGuest");
			}
		}

		if (this.mobile) {
			theDiv.addEventListener("click", function() { pointClicked(theDiv); showPointMessage(theDiv); });
		} else {
			theDiv.addEventListener("click", function() { pointClicked(theDiv); });
			theDiv.addEventListener("mouseover", function() { showPointMessage(theDiv); });
			theDiv.addEventListener('mouseout', clearMessage);
			theDiv.addEventListener('mousedown', function(e) {
				if (e.button == 2) {
					RmbDown(theDiv);
				}
			});
			theDiv.addEventListener('mouseup', function(e) {
				if (e.button == 2) {
					RmbUp(theDiv);
				}
			});
			theDiv.addEventListener('contextmenu', function(e) {
				e.preventDefault();
			});
		}
	}

	if (boardPoint.hasTile()) {
		theDiv.classList.add("hasTile");

		// Danger highlight for tiles at risk of decay or cut
		if (boardPoint.decayDanger || boardPoint.cutDanger) {
			theDiv.style.boxShadow = "inset 0 0 6px 2px rgba(220, 50, 50, 0.35)";
		}

		var theImg = document.createElement("img");
		theImg.src = "images/Adevar/monochrome/" + boardPoint.tile.ownerCode + "Back.png";

		// Show connection glow
		if (boardPoint.tile.inConnection) {
			if (boardPoint.tile.ownerName === HOST) {
				theDiv.classList.add(HOST + "harmony");
			} else {
				theDiv.classList.add(GUEST + "harmony");
			}
		}

		// Placement animation
		if (moveToAnimate && this.animationOn) {
			if (moveToAnimate.endPoint && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
				if (piecePlaceAnimation === 1) {
					theImg.style.transform = "scale(2)";
					theImg.style.zIndex = 99;
					requestAnimationFrame(function() {
						theImg.style.transform = "scale(1)";
					});
				}
			}
			if (moveToAnimate.endPoint2 && isSamePoint(moveToAnimate.endPoint2, boardPoint.col, boardPoint.row)) {
				if (piecePlaceAnimation === 1) {
					theImg.style.transform = "scale(2)";
					theImg.style.zIndex = 99;
					requestAnimationFrame(function() {
						theImg.style.transform = "scale(1)";
					});
				}
			}
		}

		theDiv.appendChild(theImg);
	}

	// Animate removed tiles (decay/cut) as fading ghosts
	if (moveToAnimate && this.animationOn && !boardPoint.hasTile()) {
		var removedTile = this.getRemovedTileAt(moveToAnimate, boardPoint.row, boardPoint.col);
		if (removedTile) {
			theDiv.classList.add("hasTile");
			var ghostImg = document.createElement("img");
			ghostImg.src = "images/Adevar/monochrome/" + removedTile.ownerCode + "Back.png";
			ghostImg.style.opacity = "1";
			ghostImg.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
			theDiv.appendChild(ghostImg);
			requestAnimationFrame(function() {
				ghostImg.style.opacity = "0";
				ghostImg.style.transform = "scale(0.3)";
			});
			ghostImg.addEventListener("transitionend", function() {
				theDiv.classList.remove("hasTile");
				theDiv.removeChild(ghostImg);
			});
		}
	}

	this.boardContainer.appendChild(theDiv);

	if (boardPoint.betweenConnection && boardPoint.col === 16) {
		var theBr = document.createElement("div");
		theBr.classList.add("clear");
		this.boardContainer.appendChild(theBr);
	}
};

UndergrowthSimplicityActuator.prototype.getRemovedTileAt = function(move, row, col) {
	if (move.decayedTiles) {
		for (var i = 0; i < move.decayedTiles.length; i++) {
			if (move.decayedTiles[i].row === row && move.decayedTiles[i].col === col) {
				return move.decayedTiles[i].tile;
			}
		}
	}
	if (move.cutTiles) {
		for (var i = 0; i < move.cutTiles.length; i++) {
			if (move.cutTiles[i].row === row && move.cutTiles[i].col === col) {
				return move.cutTiles[i].tile;
			}
		}
	}
	return null;
};
