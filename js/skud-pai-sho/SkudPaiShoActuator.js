// Actuator

import { ACCENT_TILE, debug } from '../GameData';
import { ARRANGING, PLANTING } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from './SkudPaiShoBoardPoint';
import { NO_HARMONY_VISUAL_AIDS, gameOptionEnabled } from '../GameOptions';
import { pieceAnimationLength, piecePlaceAnimation } from '../PaiShoMain';
import { RmbDown, RmbUp, clearMessage, pointClicked, showPointMessage, showTileMessage, unplayedTileClicked } from '../UiInteraction';
import { getUserGamePreference } from '../GamePrefs';
import { SkudPaiShoController } from "./SkudPaiShoController";
import { SkudPaiShoTileManager } from './SkudPaiShoTileManager';
import {
  createBoardArrow,
  createBoardPointDiv,
  getSkudTilesSrcPath,
  isSamePoint,
  setupPaiShoBoard
} from '../ActuatorHelp';

export class SkudPaiShoActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		this.gameContainer = gameContainer;
		this.mobile = isMobile;

		this.animationOn = enableAnimations;

		const containers = setupPaiShoBoard(
			this.gameContainer,
			SkudPaiShoController.getHostTilesContainerDivs(),
			SkudPaiShoController.getGuestTilesContainerDivs(),
			false
		);

		this.boardContainer = containers.boardContainer;
		this.arrowContainer = containers.arrowContainer;
		this.hostTilesContainer = containers.hostTilesContainer;
		this.guestTilesContainer = containers.guestTilesContainer;
	}

	setAnimationOn(isOn) {
		this.animationOn = isOn;
	}

	actuate(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		// debugStackTrace();
		// self.printBoard(board);

		if (!moveAnimationBeginStep) {
			moveAnimationBeginStep = 0;
		}

		window.requestAnimationFrame(() => {
			this.htmlify(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep);
		});
	}

	htmlify(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		this.clearContainer(this.boardContainer);
		this.clearContainer(this.arrowContainer);

		if (moveToAnimate && moveToAnimate.moveType === ARRANGING) {
			const cell = board.cells[moveToAnimate.endPoint.rowAndColumn.row][moveToAnimate.endPoint.rowAndColumn.col];
			if (cell.hasTile() && cell.tile.code === "O") {
				moveToAnimate.isOrchidMove = true;
			}
		}

		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (cell) {
					if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)){
						cell.addType(MARKED);
					}
					else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)){
						cell.removeType(MARKED);
					}
					this.addBoardPoint(cell, moveToAnimate, moveAnimationBeginStep);
				}
			});
		});

		// Draw all arrows
		for (const [_, arrow] of Object.entries(markingManager.arrows)) {
			this.arrowContainer.appendChild(createBoardArrow(arrow[0], arrow[1]));
		}

		const fullTileSet = new SkudPaiShoTileManager(true);

		// Go through tile piles and clear containers
		fullTileSet.hostTiles.forEach((tile) => {
			this.clearTileContainer(tile);
		});
		fullTileSet.guestTiles.forEach((tile) => {
			this.clearTileContainer(tile);
		});

		// Go through tile piles and display
		tileManager.hostTiles.forEach((tile) => {
			this.addTile(tile, this.hostTilesContainer);
		});
		tileManager.guestTiles.forEach((tile) => {
			this.addTile(tile, this.guestTilesContainer);
		});
	}

	clearContainer(container) {
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}

	clearTileContainer(tile) {
		const container = document.querySelector("." + tile.getImageName());
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}

	addTile(tile, mainContainer) {
		const container = document.querySelector("." + tile.getImageName());

		const theDiv = document.createElement("div");

		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		const theImg = document.createElement("img");

		const srcValue = getSkudTilesSrcPath();
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

	addBoardPoint(boardPoint, moveToAnimate, moveAnimationBeginStep) {
		const theDiv = createBoardPointDiv(boardPoint);

		const isAnimationPointOfBoatRemovingAccentTile = this.animationOn
						&& !boardPoint.hasTile() 
						&& moveToAnimate && moveToAnimate.bonusTileCode === "B" 
						&& !moveToAnimate.boatBonusPoint 
						&& isSamePoint(moveToAnimate.bonusEndPoint, boardPoint.col, boardPoint.row);

		if (!boardPoint.isType(NON_PLAYABLE)) {
			theDiv.classList.add("activePoint");
			if (boardPoint.isType(MARKED)) {
				theDiv.classList.add("markedPoint");
			}	
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				theDiv.classList.add("possibleMove");
			} else if (boardPoint.betweenHarmony 
					&& !gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)
					&& getUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey) !== "true") {
				const boatRemovingPointClassesToAddAfterAnimation = [];
				if (isAnimationPointOfBoatRemovingAccentTile) {
					boatRemovingPointClassesToAddAfterAnimation.push("betweenHarmony");
					if (boardPoint.betweenHarmonyHost) {
						boatRemovingPointClassesToAddAfterAnimation.push("bhHost");
					}
					if (boardPoint.betweenHarmonyGuest) {
						boatRemovingPointClassesToAddAfterAnimation.push("bhGuest");
					}
					setTimeout(() => {
						boatRemovingPointClassesToAddAfterAnimation.forEach((classToAdd) => {
							theDiv.classList.add(classToAdd);
						});
					}, pieceAnimationLength * (2 - moveAnimationBeginStep));
				} else {
					theDiv.classList.add("betweenHarmony");
					if (boardPoint.betweenHarmonyHost) {
						theDiv.classList.add("bhHost");
					}
					if (boardPoint.betweenHarmonyGuest) {
						theDiv.classList.add("bhGuest");
					}
				}
			}

			if (this.mobile) {
				theDiv.addEventListener("click", () => {
					pointClicked(theDiv);
					showPointMessage(theDiv);
				});
			} else {
				theDiv.addEventListener('click', () => { pointClicked(theDiv)} );
				theDiv.addEventListener("mouseover", () => { showPointMessage(theDiv) });
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

		if (isAnimationPointOfBoatRemovingAccentTile) {
			// No tile here, but can animate the Boat removing the Accent Tile
			const theImg = document.createElement("img");

			if (moveToAnimate) {
				this.doAnimateBoardPoint(boardPoint, moveToAnimate, moveAnimationBeginStep,
					theImg,
					{});
			}
			theDiv.appendChild(theImg);
		} else if (boardPoint.hasTile()) {
			theDiv.classList.add("hasTile");

			const theImg = document.createElement("img");
			const flags = {
				drainedOnThisTurn: false,
				wasArranged: false,
				didBonusMove: false
			};

			if (moveToAnimate) {
				this.doAnimateBoardPoint(boardPoint, moveToAnimate, moveAnimationBeginStep, theImg, flags);
			}

			const srcValue = getSkudTilesSrcPath();
			theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";

			if (boardPoint.tile.harmonyOwners 
					&& !gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)
					&& getUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey) !== "true") {
				if (this.animationOn && (flags.didBonusMove || flags.wasArranged)) {
					setTimeout(() => {//Delay harmony outline until after a piece has moved
						for (let i = 0; i < boardPoint.tile.harmonyOwners.length; i++) {
							theDiv.classList.add(boardPoint.tile.harmonyOwners[i] + "harmony");
						}
					}, ((flags.didBonusMove ? 2 : 1) - moveAnimationBeginStep) * pieceAnimationLength);
				} else {
					for (let i = 0; i < boardPoint.tile.harmonyOwners.length; i++) {
						theDiv.classList.add(boardPoint.tile.harmonyOwners[i] + "harmony");
					}
				}
			}

			if (boardPoint.tile.drained || boardPoint.tile.trapped) {
				if (flags.drainedOnThisTurn) {
					setTimeout(() => {
						theDiv.classList.add("drained");
					}, pieceAnimationLength);
				} else {
					theDiv.classList.add("drained");
				}
			}

			theDiv.appendChild(theImg);

			/* If capturing, preserve tile being captured on board during animation */
			if (this.animationOn && moveToAnimate && moveToAnimate.capturedTile
					&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row) && moveAnimationBeginStep === 0) {
				const theImgCaptured = document.createElement("img");
				theImgCaptured.src = srcValue + moveToAnimate.capturedTile.getImageName() + ".png";
				theImgCaptured.classList.add("underneath");
				theDiv.appendChild(theImgCaptured);

				/* After animation, hide captured tile */
				setTimeout(() => {
					requestAnimationFrame(() => {
						theImgCaptured.style.visibility = "hidden";
					});
				}, pieceAnimationLength);
			}
		}

		this.boardContainer.appendChild(theDiv);

		if (boardPoint.betweenHarmony && boardPoint.col === 16) {
			const theBr = document.createElement("div");
			theBr.classList.add("clear");
			this.boardContainer.appendChild(theBr);
		}
	}

	doAnimateBoardPoint(boardPoint, moveToAnimate, moveAnimationBeginStep, theImg, flags) {
		if (!this.animationOn) {
			return;
		}

		let x = boardPoint.col, y = boardPoint.row, ox = x, oy = y, placedOnAccent = false, boatRemovingAccent = false;

		if (moveToAnimate.hasHarmonyBonus()) {
			debug(moveToAnimate.bonusTileCode);
			if (isSamePoint(moveToAnimate.bonusEndPoint, ox, oy)) {// Placed on bonus turn
				placedOnAccent = true;

				if (moveToAnimate.bonusTileCode === "B" && !moveToAnimate.boatBonusPoint && moveToAnimate.tileRemovedWithBoat && isSamePoint(moveToAnimate.bonusEndPoint, ox, oy)) {// Placement of Boat to remove Accent Tile
					const srcValue = getSkudTilesSrcPath();
					theImg.src = srcValue + moveToAnimate.tileRemovedWithBoat.getImageName() + ".png";
					boatRemovingAccent = true;
				} else if (moveToAnimate.bonusTileCode === "B" && moveToAnimate.boatBonusPoint && isSamePoint(moveToAnimate.bonusEndPoint, ox, oy)) {// Placement of Boat to move Flower Tile
					theImg.style.zIndex = 90;	// Make sure Boat shows up above the Flower Tile it moves
				}
			} else if (moveToAnimate.boatBonusPoint && isSamePoint(moveToAnimate.boatBonusPoint, x, y)) {// Moved by boat
				x = moveToAnimate.bonusEndPoint.rowAndColumn.col;
				y = moveToAnimate.bonusEndPoint.rowAndColumn.row;
				flags.didBonusMove = true;
			} else if (moveToAnimate.bonusTileCode === "W") {
				const dx = x - moveToAnimate.bonusEndPoint.rowAndColumn.col;
				const dy = y - moveToAnimate.bonusEndPoint.rowAndColumn.row;
				if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy && (dx + dy) !== (dx * dy)) {// Moved by wheel
					if (dx === 1 && dy > -1) y--;
					else if (dy === -1 && dx > -1) x--;
					else if (dx === -1 && dy < 1) y++;
					else x++;
					flags.didBonusMove = true;
				}
			} else if (moveToAnimate.bonusTileCode === "K") {
				const dx = x - moveToAnimate.bonusEndPoint.rowAndColumn.col;
				const dy = y - moveToAnimate.bonusEndPoint.rowAndColumn.row;
				if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy && (dx + dy) !== (dx * dy)) {// Trapped by knotweed
					flags.drainedOnThisTurn = true;
				}
			}
		}

		let ax = x, ay = y;

		if (moveAnimationBeginStep === 0) {
			if (moveToAnimate.moveType === ARRANGING && boardPoint.tile && boardPoint.tile.type !== ACCENT_TILE) {
				if (isSamePoint(moveToAnimate.endPoint, x, y)) {// Piece moved
					flags.wasArranged = true;
					x = moveToAnimate.startPoint.rowAndColumn.col;
					y = moveToAnimate.startPoint.rowAndColumn.row;
					theImg.style.transform = "scale(1.2)";	// Make the pieces look like they're picked up a little when moving, good idea or no?
					theImg.style.zIndex = 99;	// Make sure "picked up" pieces show up above others
				} else if (moveToAnimate.isOrchidMove) {
					const dx = x - moveToAnimate.endPoint.rowAndColumn.col;
					const dy = y - moveToAnimate.endPoint.rowAndColumn.row;
					if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy) {// Trapped by orchid
						flags.drainedOnThisTurn = true;
					}
				}
			} else if (moveToAnimate.moveType === PLANTING) {
				if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {// Piece planted
					if (piecePlaceAnimation === 1) {
						theImg.style.transform = "scale(2)";
						theImg.style.zIndex = 99; // Show new pieces above others
						requestAnimationFrame(() => {
							theImg.style.transform = "scale(1)";
						});
					}
				}
			}
		}

		if ((x !== ox || y !== oy) && boardPoint.tile && (boardPoint.tile.drained || boardPoint.tile.trapped)) {
			flags.drainedOnThisTurn = true;
		}

		let pointSizeMultiplierX = 34;
		let pointSizeMultiplierY = pointSizeMultiplierX;
		let unitString = "px";

		/* For small screen size using dynamic vw units */
		if (window.innerWidth <= 612) {
			pointSizeMultiplierX = 5.5555;
			pointSizeMultiplierY = 5.611;
			unitString = "vw";
		}

		theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
		theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;
		if (placedOnAccent && !boatRemovingAccent) {
			theImg.style.visibility = "hidden";
			if (piecePlaceAnimation === 1) {
				theImg.style.transform = "scale(2)";
			}
		}

		ax = ((ax - ox) * pointSizeMultiplierX);
		ay = ((ay - oy) * pointSizeMultiplierY);
		requestAnimationFrame(() => {
			theImg.style.left = ax+unitString;
			theImg.style.top = ay+unitString;
			// theImg.style.transform = "scale(1)";	// This will size back to normal while moving after "picked up" scale
		});
		setTimeout(() => {
			requestAnimationFrame(() => {
				theImg.style.left = "0px";
				theImg.style.top = "0px";
				theImg.style.visibility = "visible";
				theImg.style.transform = "scale(1)";	// This will size back to normal after moving

				if (boatRemovingAccent) {
					/* Change image to Boat being played */
					theImg.classList.add("noTransition");
					const srcValue = getSkudTilesSrcPath();
					theImg.src = srcValue + moveToAnimate.accentTileUsed.getImageName() + ".png";
					theImg.style.transform = "scale(2)";

					requestAnimationFrame(() => {
						/* Animate (scale 0 to shrink into disappearing) */
						theImg.classList.remove("noTransition");
						theImg.style.transform = "scale(1)";
						setTimeout(() => {
							theImg.style.visibility = "hidden";
						}, pieceAnimationLength);	// If want to hide the img after transform, perhaps if going with some other animation
					});
				}
			});
		}, moveAnimationBeginStep === 0 ? pieceAnimationLength : 0);
	}

	printBoard(board) {
		debug("");
		let rowNum = 0;
		board.cells.forEach((row) => {
			let rowStr = rowNum + "\t: ";
			row.forEach((boardPoint) => {
				const str = boardPoint.getConsoleDisplay();
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

export default SkudPaiShoActuator;
