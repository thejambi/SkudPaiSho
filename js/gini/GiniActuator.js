// Gini Actuator

import { ElementStyleTransform } from '../util/ElementStyleTransform';
import { GINSENG_GUEST_ROTATE, GINSENG_ROTATE } from '../GameOptions';
import { GUEST, HOST, MOVE, NotationPoint, RowAndColumn } from '../CommonNotationObjects';
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
  createBoardArrow,
  createBoardPointDiv,
  getTilesForPlayer,
  isSamePoint,
  setupPaiShoBoard,
} from '../ActuatorHelp';
import { debug } from '../GameData';
import { TrifleAnimationType } from '../trifle/animation/TrifleAnimationTypes';
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

			// Process ability animations after board is rendered
			if (moveToAnimate && moveToAnimate.animationInfo
					&& moveToAnimate.animationInfo.abilityAnimations) {
				this.processAbilityAnimations(moveToAnimate.animationInfo.abilityAnimations);
			}
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

			if (GiniOptions.showWinLines) {
				if (boardPoint.col === 5) {
					theDiv.classList.add("giniHostWinLine");
				} else if (boardPoint.col === 11) {
					theDiv.classList.add("giniGuestWinLine");
				}
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
			theDiv.setAttribute('data-tile-id', String(boardPoint.tile.id));

			const theImg = document.createElement("img");
			theImg.elementStyleTransform = new ElementStyleTransform(theImg);

			// Set rotation before animation
			theImg.elementStyleTransform.setValue("rotate", 270, "deg");
			if (GiniOptions.viewAsGuest) {
				theImg.elementStyleTransform.adjustValue("rotate", 180, "deg");
			}

			// Animate before setting image src
			if (this.animationOn && moveToAnimate) {
				this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv, moveDetails);
			}

			const srcValue = this.getTileSrcPath();

			let tileMoved = boardPoint.tile;

			const showMovedTileDuringAnimation = this.animationOn && moveDetails && moveDetails.movedTile
												&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row);
			if (showMovedTileDuringAnimation) {
				tileMoved = moveDetails.movedTile;
			}

			theImg.src = srcValue + tileMoved.getImageName() + ".png";

			theDiv.appendChild(theImg);

			// Pre-position tiles that will be animated via SLIDE
			this.prePositionForAbilityAnimation(boardPoint, theImg, moveToAnimate);

			// Show captured tile underneath during animation
			const capturedTile = this.getCapturedTileFromMove(moveDetails);

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

			if (this.animationOn && moveToAnimate && capturedTile && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
				const theImgCaptured = document.createElement("img");
				theImgCaptured.elementStyleTransform = new ElementStyleTransform(theImgCaptured);
				theImgCaptured.src = srcValue + capturedTile.getImageName() + ".png";
				theImgCaptured.classList.add("underneath");

				theImgCaptured.elementStyleTransform.setValue("rotate", 270, "deg");
				if (GiniOptions.viewAsGuest) {
					theImgCaptured.elementStyleTransform.adjustValue("rotate", 180, "deg");
				}

				theDiv.appendChild(theImgCaptured);

				setTimeout(() => {
					requestAnimationFrame(() => {
						theImgCaptured.style.visibility = "hidden";
					});
				}, pieceAnimationLength);
			}
		}

		this.boardContainer.appendChild(theDiv);
	}

	doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv, moveDetails) {
		if (!this.animationOn) return;

		var startX = boardPoint.col, startY = boardPoint.row, endX = startX, endY = startY;
		var movementPath;
		var movementStepIndex = 0;

		if (moveToAnimate.moveType === MOVE && (boardPoint.tile || (moveDetails && moveDetails.movedTile))) {
			if (isSamePoint(moveToAnimate.endPoint, endX, endY)) {
				// This is the tile being moved
				var moveStartPoint = new NotationPoint(moveToAnimate.startPoint);
				startX = moveStartPoint.rowAndColumn.col;
				startY = moveStartPoint.rowAndColumn.row;
				theImg.elementStyleTransform.setValue("scale", 1.2);
				theDiv.style.zIndex = 99;

				// Get movement path for multi-point animation (e.g. Lotus jumps)
				movementPath = moveToAnimate.endPointMovementPath;
				if (!movementPath && moveToAnimate.movementPath) {
					movementPath = moveToAnimate.movementPath;
				}
			} else {
				// Check if this tile was pushed by the move (e.g. Dragon push)
				if (moveToAnimate.promptTargetData) {
					Object.keys(moveToAnimate.promptTargetData).forEach((key) => {
						var promptDataEntry = moveToAnimate.promptTargetData[key];
						if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
							if (isSamePoint(promptDataEntry.movedTileDestinationPoint.pointText, endX, endY)) {
								var pushStartPoint = promptDataEntry.movedTilePoint;
								startX = pushStartPoint.rowAndColumn.col;
								startY = pushStartPoint.rowAndColumn.row;
								setTimeout(() => {
									theImg.elementStyleTransform.setValue("scale", 1.2);
									theDiv.style.zIndex = 105;
								}, pieceAnimationLength / 1.2);
								movementStepIndex = 1;
							}
						}
					});
				}
			}
		}

		var pointSizeMultiplierX = 34;
		var pointSizeMultiplierY = pointSizeMultiplierX;
		var unitString = "px";

		if (window.innerWidth <= 612) {
			pointSizeMultiplierX = 5.5555;
			pointSizeMultiplierY = 5.611;
			unitString = "vw";
		}

		var left = (startX - endX);
		var top = (startY - endY);

		// Position tile at its origin (start) point
		theImg.style.left = (left * pointSizeMultiplierX) + unitString;
		theImg.style.top = (top * pointSizeMultiplierY) + unitString;

		if (movementPath) {
			// Multi-point animation (e.g. Lotus chain jumps)
			var numMovements = movementPath.length - 1;
			var movementAnimationLength = pieceAnimationLength / numMovements;
			var cssLength = movementAnimationLength * (1 + (0.05 * numMovements));

			theImg.style.transition = "left " + cssLength + "ms ease-out, right " + cssLength + "ms ease-out, top " + cssLength + "ms ease-out, bottom " + movementAnimationLength + "ms ease-out, transform 0.5s ease-in, opacity 0.5s";

			var movementNum = -1;
			movementPath.forEach(pathPointStr => {
				var currentMovementAnimationTime = movementAnimationLength * movementNum;
				setTimeout(() => {
					requestAnimationFrame(() => {
						var pathPoint = new NotationPoint(pathPointStr);
						var pointX = pathPoint.rowAndColumn.col;
						var pointY = pathPoint.rowAndColumn.row;
						left = (pointX - endX);
						top = (pointY - endY);
						theImg.style.left = (left * pointSizeMultiplierX) + unitString;
						theImg.style.top = (top * pointSizeMultiplierY) + unitString;
					});
				}, currentMovementAnimationTime);
				movementNum++;
			});
		} else {
			// Simple two-point animation
			// Skip if this tile has an ability animation that will position it differently
			var hasAbilityAnimation = boardPoint.tile && this.tileHasAbilityAnimation(boardPoint.tile.id, moveToAnimate);
			if (!hasAbilityAnimation) {
				setTimeout(() => {
					requestAnimationFrame(() => {
						theImg.style.left = "0px";
						theImg.style.top = "0px";
					});
				}, pieceAnimationLength * movementStepIndex);
			}
		}

		// Scale back to normal after animation
		setTimeout(() => {
			requestAnimationFrame(() => {
				theImg.elementStyleTransform.setValue("scale", 1);
			});
		}, pieceAnimationLength * (movementStepIndex + 0.5));
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

	// ========== Ability Animation Methods ==========

	processAbilityAnimations(animationSequence) {
		if (!this.animationOn || !animationSequence || !animationSequence.hasAnimations()) {
			return;
		}

		animationSequence.sort();

		const ghostElements = this.createGhostElements(animationSequence);

		let currentDelay = pieceAnimationLength;
		let maxEndTime = currentDelay;

		animationSequence.animations.forEach((instruction, index) => {
			let startDelay;

			if (instruction.parallel && index > 0) {
				startDelay = currentDelay - instruction.duration / 2;
			} else {
				startDelay = currentDelay;
			}

			const endTime = startDelay + instruction.delay + instruction.duration;
			maxEndTime = Math.max(maxEndTime, endTime);

			setTimeout(() => {
				this.executeAnimation(instruction);
			}, startDelay + instruction.delay);

			if (!instruction.parallel) {
				currentDelay = startDelay + instruction.delay + instruction.duration;
			}
		});

		if (ghostElements.length > 0) {
			setTimeout(() => {
				ghostElements.forEach(el => el.remove());
			}, maxEndTime + 100);
		}
	}

	createGhostElements(animationSequence) {
		const ghostElements = [];
		const needsGhost = [TrifleAnimationType.FADE_OUT, TrifleAnimationType.PULSE, TrifleAnimationType.SLIDE];

		animationSequence.animations.forEach(instruction => {
			if (!needsGhost.includes(instruction.type)) {
				return;
			}

			const existingElement = this.findTileElement(instruction.tileId);
			if (existingElement) {
				return;
			}

			if (!instruction.tile || !instruction.startPoint) {
				return;
			}

			const ghostElement = this.createGhostTileElement(instruction.tile, instruction.startPoint);
			if (ghostElement) {
				ghostElements.push(ghostElement);
			}
		});

		return ghostElements;
	}

	createGhostTileElement(tile, position) {
		const notationPointString = new RowAndColumn(position.row, position.col).notationPointString;
		const targetPointDiv = this.boardContainer.querySelector(`.point[name="${notationPointString}"]`);

		if (!targetPointDiv) {
			debug("createGhostTileElement: Could not find point at " + notationPointString);
			return null;
		}

		const theImg = document.createElement("img");
		theImg.elementStyleTransform = new ElementStyleTransform(theImg);
		theImg.elementStyleTransform.setValue("rotate", 270, "deg");
		if (GiniOptions.viewAsGuest) {
			theImg.elementStyleTransform.adjustValue("rotate", 180, "deg");
		}
		theImg.src = this.getTileSrcPath() + tile.getImageName() + ".png";
		theImg.classList.add("ghost-tile");
		theImg.style.position = "absolute";
		theImg.style.left = "0";
		theImg.style.top = "0";
		theImg.style.zIndex = "100";
		theImg.setAttribute('data-tile-id', String(tile.id));
		targetPointDiv.appendChild(theImg);

		return theImg;
	}

	executeAnimation(instruction) {
		switch (instruction.type) {
			case TrifleAnimationType.SLIDE:
				this.animateSlide(instruction);
				break;
			case TrifleAnimationType.FADE_OUT:
				this.animateFadeOut(instruction);
				break;
			case TrifleAnimationType.FADE_IN:
				this.animateFadeIn(instruction);
				break;
			case TrifleAnimationType.POP:
				this.animatePop(instruction);
				break;
			case TrifleAnimationType.PULSE:
				this.animatePulse(instruction);
				break;
			default:
				debug("Unknown animation type: " + instruction.type);
		}
	}

	animateSlide(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) {
			debug("animateSlide: Could not find tile element for " + instruction.tileId);
			return;
		}

		const { startPoint, endPoint, duration, easing } = instruction;
		const { multiplierX, multiplierY, unitString } = this.getAnimationUnits();

		const isGhost = tileElement.classList.contains('ghost-tile');

		if (isGhost) {
			const endLeft = (endPoint.col - startPoint.col);
			const endTop = (endPoint.row - startPoint.row);

			tileElement.style.transition = 'none';
			tileElement.style.left = '0';
			tileElement.style.top = '0';
			tileElement.style.zIndex = '100';

			requestAnimationFrame(() => {
				tileElement.style.transition = `left ${duration}ms ${easing}, top ${duration}ms ${easing}`;
				tileElement.style.left = (endLeft * multiplierX) + unitString;
				tileElement.style.top = (endTop * multiplierY) + unitString;
			});
		} else {
			const left = (startPoint.col - endPoint.col);
			const top = (startPoint.row - endPoint.row);

			tileElement.style.transition = 'none';
			tileElement.style.left = (left * multiplierX) + unitString;
			tileElement.style.top = (top * multiplierY) + unitString;
			tileElement.style.zIndex = '100';

			requestAnimationFrame(() => {
				tileElement.style.transition = `left ${duration}ms ${easing}, top ${duration}ms ${easing}`;
				tileElement.style.left = "0px";
				tileElement.style.top = "0px";
			});
		}

		setTimeout(() => {
			tileElement.style.zIndex = '';
		}, duration);
	}

	animateFadeOut(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) return;

		const { duration, easing } = instruction;
		tileElement.style.transition = `opacity ${duration}ms ${easing}`;
		requestAnimationFrame(() => {
			tileElement.style.opacity = "0";
		});
	}

	animateFadeIn(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) return;

		const { duration, easing } = instruction;
		tileElement.style.opacity = "0";
		tileElement.style.transition = `opacity ${duration}ms ${easing}`;
		requestAnimationFrame(() => {
			tileElement.style.opacity = "1";
		});
	}

	animatePop(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) return;

		const { duration } = instruction;
		if (tileElement.elementStyleTransform) {
			tileElement.elementStyleTransform.setValue("scale", 0);
		}
		requestAnimationFrame(() => {
			tileElement.style.transition = `transform ${duration}ms ease-out`;
			if (tileElement.elementStyleTransform) {
				tileElement.elementStyleTransform.setValue("scale", 1);
			}
		});
	}

	animatePulse(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) return;

		const { duration, color } = instruction;
		const pulseDuration = duration / 2;

		const transitionProps = color
			? `transform ${pulseDuration}ms ease-in-out, filter ${pulseDuration}ms ease-in-out`
			: `transform ${pulseDuration}ms ease-in-out`;

		tileElement.style.zIndex = '100';

		requestAnimationFrame(() => {
			tileElement.style.transition = transitionProps;
			if (tileElement.elementStyleTransform) {
				tileElement.elementStyleTransform.setValue("scale", 1.3);
			}
			if (color) {
				tileElement.style.filter = `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color})`;
			}
		});

		setTimeout(() => {
			if (tileElement.elementStyleTransform) {
				tileElement.elementStyleTransform.setValue("scale", 1);
			}
			if (color) {
				tileElement.style.filter = '';
			}
		}, pulseDuration);

		setTimeout(() => {
			tileElement.style.zIndex = '';
			tileElement.style.transition = '';
			tileElement.style.filter = '';
		}, duration);
	}

	findTileElement(tileId) {
		if (!tileId) return null;

		const tileIdStr = String(tileId);

		const ghostImg = this.boardContainer.querySelector(`img[data-tile-id="${tileIdStr}"]`);
		if (ghostImg) {
			return ghostImg;
		}

		const allPointDivs = this.boardContainer.querySelectorAll('.point');
		for (const div of allPointDivs) {
			const dataTileId = div.getAttribute('data-tile-id');
			if (dataTileId === tileIdStr) {
				return div.querySelector('img');
			}
		}

		return null;
	}

	getAnimationUnits() {
		let multiplierX = 34;
		let multiplierY = 34;
		let unitString = "px";

		if (window.innerWidth <= 612) {
			multiplierX = 5.5555;
			multiplierY = 5.611;
			unitString = "vw";
		}

		return { multiplierX, multiplierY, unitString };
	}

	prePositionForAbilityAnimation(boardPoint, theImg, moveToAnimate) {
		if (!moveToAnimate || !moveToAnimate.animationInfo
				|| !moveToAnimate.animationInfo.abilityAnimations) {
			return;
		}

		const abilityAnimations = moveToAnimate.animationInfo.abilityAnimations;
		if (!abilityAnimations.animations) {
			return;
		}

		const tileId = boardPoint.tile.id;
		const slideAnimation = abilityAnimations.animations.find(
			anim => anim.type === TrifleAnimationType.SLIDE && anim.tileId === tileId
		);

		if (!slideAnimation) {
			return;
		}

		const { startPoint, endPoint } = slideAnimation;
		const { multiplierX, multiplierY, unitString } = this.getAnimationUnits();

		const left = (startPoint.col - endPoint.col);
		const top = (startPoint.row - endPoint.row);

		theImg.style.transition = 'none';
		theImg.style.left = (left * multiplierX) + unitString;
		theImg.style.top = (top * multiplierY) + unitString;
	}

	tileHasAbilityAnimation(tileId, moveToAnimate) {
		if (!moveToAnimate || !moveToAnimate.animationInfo
				|| !moveToAnimate.animationInfo.abilityAnimations) {
			return false;
		}

		const abilityAnimations = moveToAnimate.animationInfo.abilityAnimations;
		if (!abilityAnimations.animations) {
			return false;
		}

		return abilityAnimations.animations.some(
			anim => anim.type === TrifleAnimationType.SLIDE && anim.tileId === tileId
		);
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
