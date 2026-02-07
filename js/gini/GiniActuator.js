// Gini Actuator

import { ElementStyleTransform } from '../util/ElementStyleTransform';
import { GINSENG_GUEST_ROTATE, GINSENG_ROTATE } from '../GameOptions';
import { GUEST, HOST, MOVE, NotationPoint } from '../CommonNotationObjects';
import { GiniController } from './GiniController';
import { GiniOptions } from './GiniOptions';
import {
  MARKED,
  NON_PLAYABLE,
  POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
  RmbDown,
  RmbUp,
  clearMessage,
  gameController,
  pieceAnimationLength,
  pointClicked,
  showPointMessage,
  showTileMessage,
  unplayedTileClicked,
} from '../PaiShoMain';
import {
  cos45,
  createBoardArrow,
  createBoardPointDiv,
  getTilesForPlayer,
  isSamePoint,
  setupPaiShoBoard,
  sin45,
} from '../ActuatorHelp';
import { debug } from '../GameData';
import { GiniNotationAdjustmentFunction } from './GiniGameManager';

export class GiniActuator {
	static hostTeamTilesDivId = "hostTilesContainer";
	static guestTeamTilesDivId = "guestTilesContainer";

	constructor(gameContainer, isMobile, enableAnimations) {
		this.gameContainer = gameContainer;
		this.mobile = isMobile;

		this.animationOn = enableAnimations;

		const containers = setupPaiShoBoard(
			this.gameContainer,
			GiniController.getHostTilesContainerDivs(),
			GiniController.getGuestTilesContainerDivs(),
			true,
			GiniOptions.viewAsGuest ? GINSENG_GUEST_ROTATE : GINSENG_ROTATE
		);

		this.boardContainer = containers.boardContainer;
		this.arrowContainer = containers.arrowContainer;
		this.hostTilesContainer = containers.hostTilesContainer;
		this.guestTilesContainer = containers.guestTilesContainer;
	}

	setAnimationOn(isOn) {
		this.animationOn = isOn;
	}

	actuate(board, tileManager, markingManager, moveToAnimate, moveDetails) {
		debug("Move to animate: ");
		debug(moveToAnimate);

		window.requestAnimationFrame(() => {
			this.htmlify(board, tileManager, markingManager, moveToAnimate, moveDetails);
		});
	}

	htmlify(board, tileManager, markingManager, moveToAnimate, moveDetails) {
		this.clearContainer(this.boardContainer);
		this.clearContainer(this.arrowContainer);

		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)){
					cell.addType(MARKED);
				}
				else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)){
					cell.removeType(MARKED);
				}
				if (cell) {
					this.addBoardPoint(cell, board, moveToAnimate, moveDetails);
				}
			});
		});

		// Draw all arrows
		for (const [_, arrow] of Object.entries(markingManager.arrows)) {
			this.arrowContainer.appendChild(createBoardArrow(arrow[0], arrow[1]));
		}

		/* Player Tiles */

		this.clearContainerWithId(GiniActuator.hostTeamTilesDivId);
		this.clearContainerWithId(GiniActuator.guestTeamTilesDivId);

		// Show accent tiles in hand
		const hostAccentTiles = tileManager.hostAccentTiles;
		const guestAccentTiles = tileManager.guestAccentTiles;

		if (hostAccentTiles.length > 0) {
			const hostAccentContainer = document.createElement("span");
			hostAccentContainer.classList.add("tileLibrary");
			const accentLabel = document.createElement("span");
			accentLabel.innerText = "--Accent Tiles--";
			hostAccentContainer.appendChild(accentLabel);
			hostAccentContainer.appendChild(document.createElement("br"));
			hostAccentTiles.forEach((tile) => {
				this.addUnplayedTile(tile, hostAccentContainer);
			});
			this.hostTilesContainer.appendChild(hostAccentContainer);
		}

		if (guestAccentTiles.length > 0) {
			const guestAccentContainer = document.createElement("span");
			guestAccentContainer.classList.add("tileLibrary");
			const accentLabel = document.createElement("span");
			accentLabel.innerText = "--Accent Tiles--";
			guestAccentContainer.appendChild(accentLabel);
			guestAccentContainer.appendChild(document.createElement("br"));
			guestAccentTiles.forEach((tile) => {
				this.addUnplayedTile(tile, guestAccentContainer);
			});
			this.guestTilesContainer.appendChild(guestAccentContainer);
		}

		// Show captured tiles
		const hostCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, HOST);
		const guestCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, GUEST);

		if (hostCapturedTiles.length > 0) {
			const hostCapturedContainer = document.createElement("span");
			hostCapturedContainer.classList.add("tileLibrary");
			const capturedLabel = document.createElement("span");
			capturedLabel.innerText = "--Captured Tiles--";
			hostCapturedContainer.appendChild(capturedLabel);
			hostCapturedContainer.appendChild(document.createElement("br"));
			hostCapturedTiles.forEach((tile) => {
				this.addTile(tile, hostCapturedContainer, true);
			});
			this.hostTilesContainer.appendChild(hostCapturedContainer);
		}

		if (guestCapturedTiles.length > 0) {
			const guestCapturedContainer = document.createElement("span");
			guestCapturedContainer.classList.add("tileLibrary");
			const capturedLabel = document.createElement("span");
			capturedLabel.innerText = "--Captured Tiles--";
			guestCapturedContainer.appendChild(capturedLabel);
			guestCapturedContainer.appendChild(document.createElement("br"));
			guestCapturedTiles.forEach((tile) => {
				this.addTile(tile, guestCapturedContainer, true);
			});
			this.guestTilesContainer.appendChild(guestCapturedContainer);
		}
	}

	addTile(tile, tileContainer, isCaptured) {
		if (!tile) {
			return;
		}
		const theDiv = document.createElement("div");

		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile || tile.tileIsSelectable) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		const theImg = document.createElement("img");

		const srcValue = this.getTileSrcPath(tile);
		theImg.src = srcValue + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", tile.getNotationName());
		theDiv.setAttribute("id", tile.id);

		const clickable = !isCaptured || tile.tileIsSelectable;
		if (clickable) {
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
		}

		tileContainer.appendChild(theDiv);
	}

	addUnplayedTile(tile, container) {
		if (!tile) {
			return;
		}
		const theDiv = document.createElement("div");

		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile || tile.tileIsSelectable) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		const theImg = document.createElement("img");

		const srcValue = this.getTileSrcPath();

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

	addBoardPoint(boardPoint, board, moveToAnimate, moveDetails) {
		const theDiv = createBoardPointDiv(boardPoint, null, GiniNotationAdjustmentFunction);

		if (!boardPoint.isType(NON_PLAYABLE)) {
			theDiv.classList.add("activePoint");
			if (boardPoint.isType(MARKED)) {
				theDiv.classList.add("markedPoint");
			}

			if (GiniOptions.viewAsGuest) {
				theDiv.classList.add("ginsengGuestPointRotate");
			} else {
				theDiv.classList.add("ginsengPointRotate");
			}

			if (boardPoint.isType(POSSIBLE_MOVE)) {
				theDiv.classList.add("possibleMove");
				theDiv.style.zIndex = 95;
			}

			if (this.mobile) {
				theDiv.addEventListener('click', () => pointClicked(theDiv));
			} else {
				theDiv.addEventListener('click', () => pointClicked(theDiv));
				theDiv.addEventListener('mouseover', () => showPointMessage(theDiv));
				theDiv.addEventListener('mouseout', clearMessage);
				theDiv.addEventListener('mousedown', (e) => { if (e.button === 2) RmbDown(theDiv); });
				theDiv.addEventListener('mouseup', (e) => { if (e.button === 2) RmbUp(theDiv); });
				theDiv.addEventListener('contextmenu', (e) => e.preventDefault());
			}
		}

		if (boardPoint.hasTile()) {
			theDiv.classList.add("hasTile");

			const theImg = document.createElement("img");
			theImg.elementStyleTransform = new ElementStyleTransform(theImg);

			const srcValue = this.getTileSrcPath();

			let tileMoved = boardPoint.tile;

			const showMovedTileDuringAnimation = this.animationOn && moveDetails && moveDetails.movedTile
												&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row);
			if (showMovedTileDuringAnimation) {
				tileMoved = moveDetails.movedTile;
			}

			theImg.src = srcValue + tileMoved.getImageName() + ".png";

			theDiv.appendChild(theImg);

			if (showMovedTileDuringAnimation) {
				setTimeout(() => {
					requestAnimationFrame(() => {
						if (boardPoint.hasTile()) {
							theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";
						} else {
							theImg.classList.add("gone");
						}
					});
				}, pieceAnimationLength);
			}

			theImg.elementStyleTransform.setValue("rotate", 270, "deg");
			if (GiniOptions.viewAsGuest) {
				theImg.elementStyleTransform.adjustValue("rotate", 180, "deg");
			}

			if (this.animationOn && moveToAnimate && moveToAnimate.moveType === MOVE) {
				this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv, moveDetails);
			}
		}

		this.boardContainer.appendChild(theDiv);
	}

	doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv, moveDetails) {
		if (moveToAnimate.endPoint) {
			var endPoint = new NotationPoint(moveToAnimate.endPoint);
			var endRowCol = endPoint.rowAndColumn;

			if (boardPoint.row === endRowCol.row && boardPoint.col === endRowCol.col) {
				var startPoint = new NotationPoint(moveToAnimate.startPoint);
				var startRowCol = startPoint.rowAndColumn;

				var distR = startRowCol.row - endRowCol.row;
				var distC = startRowCol.col - endRowCol.col;

				var absDr = Math.abs(distR);
				var absDc = Math.abs(distC);

				if (absDr === 0 || absDc === 0 || absDr === absDc) {
					theImg.style.transform = "translate(" + (distC * 34) + "px, " + (distR * 34) + "px)";
				} else {
					theImg.style.transform = "translate(" + ((distC + distR) * cos45 * 34) + "px, " + ((distR - distC) * sin45 * 34) + "px)";
				}

				requestAnimationFrame(function() {
					theImg.style.transform = "translate(0px, 0px)";
					theImg.classList.add("movingTile");
				});
			}
		}
	}

	getCapturedTileFromMove(moveDetails) {
		if (!moveDetails) return null;
		if (moveDetails.capturedTiles && moveDetails.capturedTiles.length > 0) {
			return moveDetails.capturedTiles[0];
		}
		return null;
	}

	clearContainer(container) {
		while (container && container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}

	clearContainerWithId(id) {
		const container = document.getElementById(id);
		this.clearContainer(container);
	}

	getTileSrcPath(tile) {
		if (GiniController.isUsingCustomTileDesigns()) {
			return GiniController.getCustomTileDesignsUrl();
		} else {
			let srcValue = "images/";
			// Reuse Ginseng tile art
			const gameImgDir = "Ginseng/" + localStorage.getItem(GiniOptions.tileDesignTypeKey);
			srcValue = srcValue + gameImgDir + "/";
			return srcValue;
		}
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
				rowStr += str;
			});
			debug(rowStr);
			rowNum++;
		});
	}
}
