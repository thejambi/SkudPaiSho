// Vagabond Actuator

import { DEPLOY, MOVE } from "../CommonNotationObjects";
import { ElementStyleTransform } from "../util/ElementStyleTransform";
import {
  MARKED,
  NON_PLAYABLE,
  POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { pieceAnimationLength, piecePlaceAnimation } from '../PaiShoMain';
import { clearMessage, pointClicked, RmbDown, RmbUp, showPointMessage, showTileMessage, unplayedTileClicked } from '../UiInteraction';
import { vagabondTileDesignTypeKey } from '../GamePrefs';
import { VagabondController } from "./VagabondController";
import { VagabondTileManager } from './VagabondTileManager';
import {
  createBoardArrow,
  createBoardPointDiv,
  isSamePoint,
  setupPaiShoBoard
} from '../ActuatorHelp';
import { debug } from "../GameData";

export class VagabondActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		this.gameContainer = gameContainer;
		this.mobile = isMobile;

		this.animationOn = enableAnimations;

		var containers = setupPaiShoBoard(
			this.gameContainer,
			VagabondController.getHostTilesContainerDivs(),
			VagabondController.getGuestTilesContainerDivs(),
			true
		);

		this.boardContainer = containers.boardContainer;
		this.boardContainer.style.position = "relative";
		this.arrowContainer = containers.arrowContainer;
		this.hostTilesContainer = containers.hostTilesContainer;
		this.guestTilesContainer = containers.guestTilesContainer;
	}
	setAnimationOn(isOn) {
		this.animationOn = isOn;
	}
	actuate(board, tileManager, markingManager, moveToAnimate) {
		var self = this;
		debug(moveToAnimate);
		// self.printBoard(board);
		window.requestAnimationFrame(function() {
			self.htmlify(board, tileManager, markingManager, moveToAnimate);
		});
	}
	htmlify(board, tileManager, markingManager, moveToAnimate) {
		this.clearContainer(this.boardContainer);
		this.clearContainer(this.arrowContainer);

		var self = this;

		board.cells.forEach(function(column) {
			column.forEach(function(cell) {
				if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)) {
					cell.addType(MARKED);
				}
				else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)) {
					cell.removeType(MARKED);
				}
				if (cell) {
					self.addBoardPoint(cell, moveToAnimate);
				}
			});
		});

		// Draw all arrows
		for (var [_, arrow] of Object.entries(markingManager.arrows)) {
			this.arrowContainer.appendChild(createBoardArrow(arrow[0], arrow[1]));
		}

		var fullTileSet = new VagabondTileManager();

		// Go through tile piles and clear containers
		fullTileSet.hostTiles.forEach(function(tile) {
			self.clearTileContainer(tile);
		});
		fullTileSet.guestTiles.forEach(function(tile) {
			self.clearTileContainer(tile);
		});

		// Go through tile piles and display
		tileManager.hostTiles.forEach(function(tile) {
			self.addTile(tile, self.hostTilesContainer);
		});
		tileManager.guestTiles.forEach(function(tile) {
			self.addTile(tile, self.guestTilesContainer);
		});
	}
	clearContainer(container) {
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}
	clearTileContainer(tile) {
		var container = document.querySelector("." + tile.getImageName());
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}
	addTile(tile, mainContainer) {
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
	}
	addBoardPoint(boardPoint, moveToAnimate) {
		var self = this;

		var theDiv = createBoardPointDiv(boardPoint);

		if (!boardPoint.isType(NON_PLAYABLE)) {
			theDiv.classList.add("activePoint");
			// theDiv.classList.add("vagabondPointRotate");
			if (boardPoint.isType(MARKED)) {
				theDiv.classList.add("markedPoint");
			}
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				theDiv.classList.add("possibleMove");
			}

			if (this.mobile) {
				theDiv.addEventListener('click', function() {
					pointClicked(this);
					showPointMessage(this);
				});
			} else {
				theDiv.addEventListener("click", () => { pointClicked(theDiv); });
				theDiv.addEventListener("mouseover", () => { showPointMessage(theDiv); });
				theDiv.addEventListener('mouseout', clearMessage);

				theDiv.addEventListener('mousedown', e => {
					// Right Mouse Button
					if (e.button == 2) {
						RmbDown(theDiv);
					}
				});
				theDiv.addEventListener('mouseup', e => {
					// Right Mouse Button
					if (e.button == 2) {
						RmbUp(theDiv);
					}
				});
				theDiv.addEventListener('contextmenu', e => {
					e.preventDefault();
				});
			}
		}

		if (boardPoint.hasTile()) {
			theDiv.classList.add("hasTile");

			var theImg = document.createElement("img");
			theImg.elementStyleTransform = new ElementStyleTransform(theImg);
			theImg.elementStyleTransform.setValue("rotate", 315, "deg");

			if (moveToAnimate) {
				this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv);
			}

			var srcValue = this.getTileImageSourceDir();

			theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";

			theDiv.appendChild(theImg);

			if (this.animationOn && moveToAnimate && moveToAnimate.capturedTile && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
				debug("Captured " + moveToAnimate.capturedTile.code);
				var theImgCaptured = document.createElement("img");
				theImgCaptured.elementStyleTransform = new ElementStyleTransform(theImgCaptured);
				theImgCaptured.elementStyleTransform.setValue("rotate", 315, "deg");
				theImgCaptured.src = srcValue + moveToAnimate.capturedTile.getImageName() + ".png";
				theImgCaptured.classList.add("underneath");
				theDiv.appendChild(theImgCaptured);

				/* After animation, hide captured tile */
				setTimeout(function() {
					requestAnimationFrame(function() {
						theImgCaptured.style.visibility = "hidden";
					});
				}, pieceAnimationLength);
			}
		}

		this.boardContainer.appendChild(theDiv);
	}
	
	doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv) {
		debug("Animating? " + this.animationOn);
		if (!this.animationOn) return;

		var x = boardPoint.col, y = boardPoint.row, ox = x, oy = y;

		if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
			if (isSamePoint(moveToAnimate.endPoint, x, y)) { // Piece moved
				x = moveToAnimate.startPoint.rowAndColumn.col;
				y = moveToAnimate.startPoint.rowAndColumn.row;
				theImg.elementStyleTransform.setValue("scale", "1.2"); // Make the pieces look like they're picked when moving
				theDiv.style.zIndex = 99; // Make sure "picked up" pieces show up above others
			}
		} else if (moveToAnimate.moveType === DEPLOY) {
			if (isSamePoint(moveToAnimate.endPoint, ox, oy)) { // Piece planted
				if (piecePlaceAnimation === 1) {
					theImg.elementStyleTransform.setValue("scale", 2);
					theDiv.style.zIndex = 99;
					requestAnimationFrame(function() {
						theImg.elementStyleTransform.setValue("scale", 1);
					});
				}
			}
		}

		var pointSizeMultiplierX = 34;
		var pointSizeMultiplierY = pointSizeMultiplierX;
		var unitString = "px";

		/* For small screen size using dynamic vw units */
		if (window.innerWidth <= 612) {
			pointSizeMultiplierX = 5.5555;
			pointSizeMultiplierY = 5.611;
			unitString = "vw";
		}

		theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
		theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;
		
		requestAnimationFrame(function() {
			theImg.style.left = "0px";
			theImg.style.top = "0px";
		});
		setTimeout(function() {
			requestAnimationFrame(function() {
				theImg.elementStyleTransform.setValue("scale", 1); // This will size back to normal after moving
			});
		}, pieceAnimationLength);
	}
	getTileImageSourceDir() {
		if (VagabondController.isUsingCustomTileDesigns()) {
			return VagabondController.getCustomTileDesignsUrl();
		} else {
			return "images/Vagabond/" + localStorage.getItem(vagabondTileDesignTypeKey) + "/";
		}
	}
	printBoard(board) {
		debug("");
		var rowNum = 0;
		board.cells.forEach(function(row) {
			var rowStr = rowNum + "\t: ";
			row.forEach(function(boardPoint) {
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
	}
}










