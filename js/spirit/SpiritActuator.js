// Spirit Actuator

import {
  NON_PLAYABLE,
  POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { SpiritController, SpiritPreferences } from './SpiritController';
import { SpiritTileManager } from './SpiritTileManager';
import {
  clearMessage,
  gameController,
  getUserGamePreference,
  pointClicked,
  showPointMessage,
  showTileMessage,
  unplayedTileClicked
} from '../PaiShoMain';
import { createBoardPointDiv, isSamePoint, setupPaiShoBoard } from '../ActuatorHelp';
import { MOVE } from '../CommonNotationObjects';
import { pieceAnimationLength } from '../PaiShoMain';
import { debug } from '../GameData';

export function SpiritActuator(gameContainer, isMobile, enableAnimations) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;
	this.animationOn = enableAnimations;

	var containers = setupPaiShoBoard(
		this.gameContainer,
		SpiritController.getHostTilesContainerDivs(),
		SpiritController.getGuestTilesContainerDivs(),
		false
	);

	this.boardContainer = containers.boardContainer;
	this.boardContainer.style.position = "relative";
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

SpiritActuator.prototype.setAnimationOn = function(isOn) {
	this.animationOn = isOn;
};

SpiritActuator.prototype.actuate = function(board, tileManager, moveToAnimate) {
	var self = this;

	window.requestAnimationFrame(function () {
		self.htmlify(board, tileManager, moveToAnimate);
	});
};

SpiritActuator.prototype.htmlify = function(board, tileManager, moveToAnimate) {
	this.clearContainer(this.boardContainer);

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(cell, moveToAnimate);
			}
		});
	});

	var fullTileSet = new SpiritTileManager();

	// Go through tile piles and clear containers
	fullTileSet.hostTiles.forEach(function(tile) {
		self.clearTileContainer(tile);
	});
	fullTileSet.guestTiles.forEach(function(tile) {
		self.clearTileContainer(tile);
	});

	// Go through tile piles and display
	tileManager.hostTiles.forEach(function(tile) {
		self.addTile(tile, this.hostTilesContainer);
	});
	tileManager.guestTiles.forEach(function(tile) {
		self.addTile(tile, this.guestTilesContainer);
	});
};

SpiritActuator.prototype.clearContainer = function (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

SpiritActuator.prototype.clearTileContainer = function (tile) {
	var container = document.querySelector("." + tile.getImageName());
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

SpiritActuator.prototype.addTile = function(tile, mainContainer) {
	var self = this;

	var container = document.querySelector("." + tile.getImageName());

	var theDiv = document.createElement("div");

	theDiv.classList.add("point");
	theDiv.classList.add("hasTile");

	if (tile.selectedFromPile) {
		theDiv.classList.add("selectedFromPile");
		theDiv.classList.add("drained");
	}

	var theImg = document.createElement("img");
	var srcValue = this.getTileImageSourceDir();
	theImg.src = srcValue + tile.getImageName() + ".png";
	theDiv.appendChild(theImg);

	theDiv.setAttribute("name", tile.getImageName());
	theDiv.setAttribute("id", tile.id);

	if (this.mobile) {
		theDiv.addEventListener('click', () => {
				unplayedTileClicked(theDiv);
				showTileMessage(theDiv);
			});
	} else {
		theDiv.addEventListener('click', () => unplayedTileClicked(theDiv));
		theDiv.addEventListener('mouseover', () => showTileMessage(theDiv));
		theDiv.addEventListener('mouseout', clearMessage);
	}

	container.appendChild(theDiv);
};

SpiritActuator.prototype.addBoardPoint = function(boardPoint, moveToAnimate) {
	var self = this;

	var theDiv = createBoardPointDiv(boardPoint);

	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add("activePoint");
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			theDiv.classList.add("possibleMove");
		}

		if (this.mobile) {
			// Using touchstart instead of click, to try it out
			theDiv.addEventListener('touchstart', function() {
				pointClicked(this);
				showPointMessage(this);
			});
		} else {
			theDiv.addEventListener('click', function() { pointClicked(this); });
			theDiv.addEventListener('mouseover', function() {
				showPointMessage(this);
				gameController.showCaptureHelpOnHover(this);
			});
			theDiv.addEventListener('mouseout', clearMessage);
		}
	}

	if (boardPoint.hasTile()) {
		theDiv.classList.add("hasTile");

		var theImg = document.createElement("img");

		if (moveToAnimate) {
			this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv);
		}

		var srcValue = this.getTileImageSourceDir();
		theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";

		if (boardPoint.tile.captureHelpFlag) {
			theDiv.classList.add("GUESTharmony");
		}
		if (boardPoint.tile.capturedByHelpFlag) {
			theDiv.classList.add("HOSTharmony");
		}

		theDiv.appendChild(theImg);

		// Handle captured tile animation (fade out effect)
		if (this.animationOn && moveToAnimate && moveToAnimate.capturedTile &&
			isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
			var theImgCaptured = document.createElement("img");
			theImgCaptured.src = srcValue + moveToAnimate.capturedTile.getImageName() + ".png";
			theImgCaptured.classList.add("underneath");
			theDiv.appendChild(theImgCaptured);

			setTimeout(function() {
				requestAnimationFrame(function() {
					theImgCaptured.style.visibility = "hidden";
				});
			}, pieceAnimationLength);
		}
	}

	this.boardContainer.appendChild(theDiv);

	if (boardPoint.betweenHarmony && boardPoint.col === 16) {
		var theBr = document.createElement("div");
		theBr.classList.add("clear");
		this.boardContainer.appendChild(theBr);
	}
};

SpiritActuator.prototype.getTileImageSourceDir = function() {
	return "images/Spirit/" + getUserGamePreference(SpiritPreferences.tileDesignKey) + "/";
};

SpiritActuator.prototype.doAnimateBoardPoint = function(boardPoint, moveToAnimate, theImg, theDiv) {
	if (!this.animationOn) return;

	var x = boardPoint.col, y = boardPoint.row, ox = x, oy = y;

	if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
		if (isSamePoint(moveToAnimate.endPoint, x, y)) {
			// This is the piece that moved - calculate offset from start position
			x = moveToAnimate.startPoint.rowAndColumn.col;
			y = moveToAnimate.startPoint.rowAndColumn.row;
			theDiv.style.zIndex = 99; // Show above other pieces
		}
	}

	var pointSizeMultiplierX = 34;
	var pointSizeMultiplierY = 34;
	var unitString = "px";

	// Responsive sizing for mobile
	if (window.innerWidth <= 612) {
		pointSizeMultiplierX = 5.5555;
		pointSizeMultiplierY = 5.611;
		unitString = "vw";
	}

	// Set initial position (offset from final position)
	theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
	theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;

	// Animate to final position (CSS transition handles the animation)
	requestAnimationFrame(function() {
		theImg.style.left = "0px";
		theImg.style.top = "0px";
	});
};

SpiritActuator.prototype.printBoard = function(board) {

	debug("");
	var rowNum = 0;
	board.cells.forEach(function (row) {
		var rowStr = rowNum + "\t: ";
		row.forEach(function (boardPoint) {
			var str = boardPoint.getConsoleDisplay();
			if (str.length < 3) {
				rowStr += " ";
			}
			rowStr = rowStr + str;
			if (str.length < 2) {
				rowStr = rowStr + " ";
			}
			
		});
		debug(rowStr);
		rowNum++;
	});
	debug("");
};

