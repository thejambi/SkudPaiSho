// Trifle Actuator

import { ElementStyleTransform } from '../util/ElementStyleTransform';
import { DEPLOY, GUEST, HOST, MOVE, NotationPoint, RowAndColumn } from '../CommonNotationObjects';
import {
	MARKED,
	NON_PLAYABLE,
	POSSIBLE_MOVE,
} from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { TrifleController } from './TrifleController';
import {
	RmbDown,
	RmbUp,
	clearMessage,
	gameController,
	piecePlaceAnimation,
	pieceAnimationLength,
	pointClicked,
	showPointMessage,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { TrifleAttributeType } from './TrifleTileInfo';
import { TrifleTile } from './TrifleTile';
import { TrifleTileCodes } from './TrifleTiles';
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
import {
	guestPlayerCode,
	hostPlayerCode,
} from '../pai-sho-common/PaiShoPlayerHelp';
import { currentTileMetadata } from './PaiShoGamesTileMetadata';
import { TrifleAnimationType } from './animation/TrifleAnimationTypes';

export class TrifleActuator {
	static imagePath = "images/Trifle/chuji/";
	static hostTeamTilesDivId = "hostTilesContainer";
	static guestTeamTilesDivId = "guestTilesContainer";

	constructor(gameContainer, isMobile, enableAnimations) {
		this.gameContainer = gameContainer;
		this.mobile = isMobile;
		this.animationOn = enableAnimations !== false; // Default to true

		const containers = setupPaiShoBoard(
			this.gameContainer,
			TrifleController.getHostTilesContainerDivs(),
			TrifleController.getGuestTilesContainerDivs(),
			true
		);

		this.boardContainer = containers.boardContainer;
		this.arrowContainer = containers.arrowContainer;
		this.hostTilesContainer = containers.hostTilesContainer;
		this.guestTilesContainer = containers.guestTilesContainer;
	}

	actuate(board, tileManager, markingManager, moveToAnimate) {
		window.requestAnimationFrame(() => {
			this.htmlify(board, tileManager, markingManager, moveToAnimate);

			// Process ability animations after board is rendered
			if (moveToAnimate && moveToAnimate.animationInfo
					&& moveToAnimate.animationInfo.abilityAnimations) {
				this.processAbilityAnimations(moveToAnimate.animationInfo.abilityAnimations);
			}
		});
	}

	/**
	 * Set up startsAtMoveTime ghosts so they animate with the primary move.
	 * Called at the end of htmlify, before requestAnimationFrame callbacks fire.
	 */
	setupMoveTimeGhosts(moveToAnimate) {
		if (!this.animationOn || !moveToAnimate || !moveToAnimate.animationInfo
				|| !moveToAnimate.animationInfo.abilityAnimations) {
			return [];
		}

		const animationSequence = moveToAnimate.animationInfo.abilityAnimations;
		const ghostElements = [];

		animationSequence.animations.forEach(instruction => {
			if (!instruction.startsAtMoveTime) {
				return;
			}

			if (!instruction.tile || !instruction.startPoint) {
				return;
			}

			// Create ghost with "lifted" appearance
			const ghost = this.createGhostTileElement(instruction.tile, instruction.startPoint, true);
			if (ghost) {
				ghostElements.push({ ghost, instruction });
			}
		});

		return ghostElements;
	}

	htmlify(board, tileManager, markingManager, moveToAnimate) {
		this.clearContainer(this.boardContainer);
		this.clearContainer(this.arrowContainer);

		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)) {
					cell.addType(MARKED);
				} else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)) {
					cell.removeType(MARKED);
				}
				if (cell) {
					this.addBoardPoint(cell, board, moveToAnimate);
				}
			});
		});

		// Set up startsAtMoveTime ghosts immediately after board render
		// so they can animate in the same requestAnimationFrame batch as standard moves
		const moveTimeGhosts = this.setupMoveTimeGhosts(moveToAnimate);
		if (moveTimeGhosts.length > 0) {
			const { multiplierX, multiplierY, unitString } = this.getAnimationUnits();
			moveTimeGhosts.forEach(({ ghost, instruction }) => {
				const { startPoint, endPoint } = instruction;
				const endLeft = (endPoint.col - startPoint.col);
				const endTop = (endPoint.row - startPoint.row);

				// Schedule position animation in same frame as standard move animations
				requestAnimationFrame(() => {
					ghost.style.left = (endLeft * multiplierX) + unitString;
					ghost.style.top = (endTop * multiplierY) + unitString;
				});

				// Reset scale AFTER animation completes, just like standard moves
				setTimeout(() => {
					requestAnimationFrame(() => {
						ghost.elementStyleTransform.setValue("scale", 1);
					});
				}, pieceAnimationLength);
			});

			// Store for cleanup later
			this.moveTimeGhostElements = moveTimeGhosts.map(g => g.ghost);
		}

		// Draw all arrows
		for (const [, arrow] of Object.entries(markingManager.arrows)) {
			this.arrowContainer.appendChild(createBoardArrow(arrow[0], arrow[1]));
		}

		/* Player Tiles */
		/* Team Tiles */
		// Go through tile piles and clear containers
		this.clearContainerWithId(TrifleActuator.hostTeamTilesDivId);
		this.clearContainerWithId(TrifleActuator.guestTeamTilesDivId);
		if (tileManager.playersAreSelectingTeams() && !tileManager.hostTeamIsFull()
				|| !tileManager.playersAreSelectingTeams()) {
			tileManager.hostTiles.forEach((tile) => {
				this.addTeamTile(tile, HOST);
			});
		}
		if (tileManager.playersAreSelectingTeams() && !tileManager.guestTeamIsFull()
				|| !tileManager.playersAreSelectingTeams()) {
			tileManager.guestTiles.forEach((tile) => {
				this.addTeamTile(tile, GUEST);
			});
		}

		/* Team Selection Area */
		if (!tileManager.hostTeamIsFull()) {
			this.addLineBreakInTilePile(HOST);
			this.addLineBreakInTilePile(HOST);
			Object.keys(TrifleTileCodes).forEach((key) => {
				if (currentTileMetadata[key] && currentTileMetadata[key].available) {
					this.addTeamTile(new TrifleTile(TrifleTileCodes[key], hostPlayerCode), HOST, true);
				}
			});
		} else if (!tileManager.guestTeamIsFull()) {
			this.addLineBreakInTilePile(GUEST);
			this.addLineBreakInTilePile(GUEST);
			Object.keys(TrifleTileCodes).forEach((key) => {
				if (currentTileMetadata[key] && currentTileMetadata[key].available) {
					this.addTeamTile(new TrifleTile(TrifleTileCodes[key], guestPlayerCode), GUEST, true);
				}
			});
		}

		/* Captured Tiles */
		const hostCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, HOST);
		const guestCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, GUEST);

		if (hostCapturedTiles.length > 0) {
			this.addLineBreakInTilePile(HOST);
			const hostCapturedContainer = document.createElement("span");
			hostCapturedContainer.classList.add("tileLibrary");
			const capturedLabel = document.createElement("span");
			capturedLabel.innerText = "--Captured Tiles--";
			hostCapturedContainer.appendChild(capturedLabel);
			hostCapturedContainer.appendChild(document.createElement("br"));
			document.getElementById(TrifleActuator.hostTeamTilesDivId)
				.appendChild(hostCapturedContainer);
			hostCapturedTiles.forEach((tile) => {
				this.addCapturedTile(tile, hostCapturedContainer);
			});
		}

		if (guestCapturedTiles.length > 0) {
			this.addLineBreakInTilePile(GUEST);
			const guestCapturedContainer = document.createElement("span");
			guestCapturedContainer.classList.add("tileLibrary");
			const capturedLabel = document.createElement("span");
			capturedLabel.innerText = "--Captured Tiles--";
			guestCapturedContainer.appendChild(capturedLabel);
			guestCapturedContainer.appendChild(document.createElement("br"));
			document.getElementById(TrifleActuator.guestTeamTilesDivId)
				.appendChild(guestCapturedContainer);
			guestCapturedTiles.forEach((tile) => {
				this.addCapturedTile(tile, guestCapturedContainer);
			});
		}
	}

	clearContainer(container) {
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}

	clearContainerWithId(containerIdName) {
		const container = document.getElementById(containerIdName);
		if (container) {
			this.clearContainer(container);
		}
	}

	addLineBreakInTilePile(player) {
		const containerDivId = player === HOST
			? TrifleActuator.hostTeamTilesDivId
			: TrifleActuator.guestTeamTilesDivId;
		const container = document.getElementById(containerDivId);

		const theBr = document.createElement("br");
		theBr.classList.add("clear");
		container.appendChild(theBr);
	}

	addTeamTile(tile, player, isForTeamSelection) {
		const containerDivId = player === HOST
			? TrifleActuator.hostTeamTilesDivId
			: TrifleActuator.guestTeamTilesDivId;
		const container = document.getElementById(containerDivId);

		const theDiv = document.createElement("div");

		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (isForTeamSelection) {
			theDiv.classList.add("selectedFromPile");
		} else if (tile.selectedFromPile) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		const theImg = document.createElement("img");

		const srcValue = TrifleActuator.imagePath;

		theImg.src = srcValue + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", tile.getImageName());
		theDiv.setAttribute("id", tile.id);

		if (this.mobile) {
			theDiv.addEventListener('click', function() {
				unplayedTileClicked(this);
				showTileMessage(this);
			});
		} else if (gameController && gameController.clickToShowPointMessage) {
			theDiv.addEventListener('click', () => {
				unplayedTileClicked(theDiv);
				const tileName = theDiv.getAttribute("name");
				if (gameController.lastClickedTileForMessage === tileName) {
					gameController.lastClickedTileForMessage = null;
					clearMessage();
				} else {
					gameController.lastClickedTileForMessage = tileName;
					showTileMessage(theDiv);
				}
			});
		} else {
			theDiv.addEventListener('click', function() { unplayedTileClicked(this); });
			theDiv.addEventListener('mouseover', function() { showTileMessage(this); });
			theDiv.addEventListener('mouseout', clearMessage);
		}

		container.appendChild(theDiv);
	}

	addCapturedTile(tile, container) {
		const theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile || tile.tileIsSelectable) {
			theDiv.classList.add("selectedFromPile");
		}

		const theImg = document.createElement("img");
		theImg.src = TrifleActuator.imagePath + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", tile.getImageName());
		theDiv.setAttribute("id", tile.id);

		if (tile.tileIsSelectable) {
			if (this.mobile) {
				theDiv.addEventListener('click', function() {
					unplayedTileClicked(this);
					showTileMessage(this);
				});
			} else if (gameController && gameController.clickToShowPointMessage) {
				theDiv.addEventListener('click', () => {
					unplayedTileClicked(theDiv);
					showTileMessage(theDiv);
				});
			} else {
				theDiv.addEventListener('click', function() { unplayedTileClicked(this); });
				theDiv.addEventListener('mouseover', function() { showTileMessage(this); });
				theDiv.addEventListener('mouseout', clearMessage);
			}
		} else {
			if (!this.mobile) {
				theDiv.addEventListener('mouseover', function() { showTileMessage(this); });
				theDiv.addEventListener('mouseout', clearMessage);
			}
		}

		container.appendChild(theDiv);
	}

	addBoardPoint(boardPoint, board, moveToAnimate) {
		const theDiv = createBoardPointDiv(boardPoint);

		if (!boardPoint.isType(NON_PLAYABLE)) {
			theDiv.classList.add("activePoint");
			theDiv.classList.add("vagabondPointRotate");
			if (boardPoint.isType(MARKED)) {
				theDiv.classList.add("markedPoint");
			}
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				theDiv.classList.add("possibleMove");
				if (board.currentlyDeployingTileInfo && board.currentlyDeployingTileInfo.attributes
						&& board.currentlyDeployingTileInfo.attributes.includes(TrifleAttributeType.gigantic)) {
					// Gigantic!
					this.adjustBoardPointForGiganticDeploy(theDiv, boardPoint);
				}

				theDiv.style.zIndex = 95;
			}

			if (this.mobile) {
				theDiv.addEventListener('click', function() {
					pointClicked(this);
					showPointMessage(this);
				});
			} else if (gameController && gameController.clickToShowPointMessage) {
				theDiv.addEventListener('click', () => {
					pointClicked(theDiv);
					const pointName = theDiv.getAttribute("name");
					if (gameController.lastClickedPointForMessage === pointName) {
						gameController.lastClickedPointForMessage = null;
						clearMessage();
					} else {
						gameController.lastClickedPointForMessage = pointName;
						showPointMessage(theDiv);
					}
				});
				theDiv.addEventListener('mousedown', (e) => {
					// Right Mouse Button
					if (e.button === 2) {
						RmbDown(theDiv);
					}
				});
				theDiv.addEventListener('mouseup', (e) => {
					// Right Mouse Button
					if (e.button === 2) {
						RmbUp(theDiv);
					}
				});
				theDiv.addEventListener('contextmenu', (e) => {
					e.preventDefault();
				});
			} else {
				theDiv.addEventListener('click', function() { pointClicked(this); });
				theDiv.addEventListener('mouseover', function() { showPointMessage(this); });
				theDiv.addEventListener('mouseout', clearMessage);
				theDiv.addEventListener('mousedown', (e) => {
					// Right Mouse Button
					if (e.button === 2) {
						RmbDown(theDiv);
					}
				});
				theDiv.addEventListener('mouseup', (e) => {
					// Right Mouse Button
					if (e.button === 2) {
						RmbUp(theDiv);
					}
				});
				theDiv.addEventListener('contextmenu', (e) => {
					e.preventDefault();
				});
			}
		}

		if (boardPoint.hasTile() && !boardPoint.occupiedByAbility) {
			theDiv.classList.add("hasTile");

			// Store tile ID for animation lookup
			if (boardPoint.tile.id) {
				theDiv.setAttribute('data-tile-id', String(boardPoint.tile.id));
			}

			const theImg = document.createElement("img");
			theImg.elementStyleTransform = new ElementStyleTransform(theImg);
			theImg.elementStyleTransform.setValue("rotate", 315, "deg");

			if (moveToAnimate || boardPoint.tile.isGigantic) {
				this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv);
			}

			const srcValue = TrifleActuator.imagePath;

			theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";

			theDiv.appendChild(theImg);

			// Pre-position tiles that will be animated via SLIDE
			this.prePositionForAbilityAnimation(boardPoint, theImg, moveToAnimate);
		}

		if (boardPoint.occupiedByAbility) {
			theDiv.classList.remove("activePoint");
		}

		this.boardContainer.appendChild(theDiv);

		if (boardPoint.betweenHarmony && boardPoint.col === 16) {
			const theBr = document.createElement("div");
			theBr.classList.add("clear");
			this.boardContainer.appendChild(theBr);
		}
	}

	/**
	 * Pre-position tiles that have pending SLIDE animations so they appear at
	 * the animation start point, not the final board position.
	 */
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

		// Position tile at the animation's start point
		const { startPoint, endPoint } = slideAnimation;
		const { multiplierX, multiplierY, unitString } = this.getAnimationUnits();

		// Calculate offset from end position (where the tile is currently rendered)
		const left = (startPoint.col - endPoint.col);
		const top = (startPoint.row - endPoint.row);

		// Set starting position with no transition
		theImg.style.transition = 'none';
		theImg.style.left = (left * multiplierX) + unitString;
		theImg.style.top = (top * multiplierY) + unitString;
	}

	adjustBoardPointForGiganticDeploy(theDiv, boardPoint) {
		const x = boardPoint.col;
		const y = boardPoint.row;
		const ox = x;
		const oy = y;

		let pointSizeMultiplierX = 34;
		let pointSizeMultiplierY = pointSizeMultiplierX;
		let unitString = "px";

		/* For small screen size using dynamic vw units */
		if (window.innerWidth <= 612) {
			pointSizeMultiplierX = 5.5555;
			pointSizeMultiplierY = 5.611;
			unitString = "vw";
		}

		const scaleValue = 1;

		let left = (x - ox);
		const top = (y - oy);

		left += 0.7;

		theDiv.style.left = ((left * cos45 - top * sin45) * pointSizeMultiplierX) + unitString;
		theDiv.style.top = ((top * cos45 + left * sin45) * pointSizeMultiplierY) + unitString;

		theDiv.style.transform = "scale(" + scaleValue + ")";
	}

	doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv) {
		let x = boardPoint.col;
		let y = boardPoint.row;
		const ox = x;
		const oy = y;

		let pointSizeMultiplierX = 34;
		let pointSizeMultiplierY = pointSizeMultiplierX;
		let unitString = "px";

		/* For small screen size using dynamic vw units */
		if (window.innerWidth <= 612) {
			pointSizeMultiplierX = 5.5555;
			pointSizeMultiplierY = 5.611;
			unitString = "vw";
		}

		// Handle gigantic tile positioning (on theDiv, always)
		if (boardPoint.tile && boardPoint.tile.isGigantic) {
			const giganticLeft = 0.7;
			theDiv.style.left = ((giganticLeft * cos45) * pointSizeMultiplierX) + unitString;
			theDiv.style.top = ((giganticLeft * sin45) * pointSizeMultiplierY) + unitString;
			theDiv.style.transform = "scale(2)";
			theDiv.style.zIndex = 90;
		}

		// Animation (on theImg, which has CSS transitions)
		if (!this.animationOn || !moveToAnimate) return;

		if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
			if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {
				// Start from where tile came from
				const moveStartPoint = new NotationPoint(moveToAnimate.startPoint);
				x = moveStartPoint.rowAndColumn.col;
				y = moveStartPoint.rowAndColumn.row;
				theImg.elementStyleTransform.setValue("scale", "1.2");
				theDiv.style.zIndex = 99;
			}
		} else if (moveToAnimate.moveType === DEPLOY) {
			if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {
				if (piecePlaceAnimation === 1) {
					theImg.elementStyleTransform.setValue("scale", 2);
					theDiv.style.zIndex = 99;
					requestAnimationFrame(function() {
						theImg.elementStyleTransform.setValue("scale", 1);
					});
				}
			}
		}

		// Set initial offset position on theImg
		theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
		theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;
		// const left = (x - ox);
		// const top = (y - oy);
		// theImg.style.left = ((left * cos45 - top * sin45) * pointSizeMultiplierX) + unitString;
		// theImg.style.top = ((top * cos45 + left * sin45) * pointSizeMultiplierY) + unitString;

		// Animate to final position (CSS transition handles the slide)
		// Skip if this tile has an ability animation that will position it differently
		const hasAbilityAnimation = this.tileHasAbilityAnimation(boardPoint.tile.id, moveToAnimate);
		if (!hasAbilityAnimation) {
			requestAnimationFrame(function() {
				theImg.style.left = "0px";
				theImg.style.top = "0px";
			});
		}

		// Reset scale after animation completes
		setTimeout(function() {
			requestAnimationFrame(function() {
				theImg.elementStyleTransform.setValue("scale", 1);
			});
		}, pieceAnimationLength);
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

	// ========== Ability Animation Methods ==========

	/**
	 * Process ability-triggered animations after the primary move animation.
	 * Animations start after pieceAnimationLength (1000ms) to not overlap with
	 * the main tile movement.
	 */
	processAbilityAnimations(animationSequence) {
		if (!this.animationOn || !animationSequence || !animationSequence.hasAnimations()) {
			return;
		}

		// Sort by priority
		animationSequence.sort();

		// Create ghost elements for tiles that need to animate but aren't on the board
		// (e.g., Saffron fading out after being captured by substituteForCapture)
		const ghostElements = this.createGhostElements(animationSequence);

		let currentDelay = pieceAnimationLength; // Start after primary move animation
		let maxEndTime = currentDelay;

		animationSequence.animations.forEach((instruction, index) => {
			let startDelay;

			if (instruction.startsAtMoveTime) {
				// Already handled in htmlify -> setupMoveTimeGhosts
				// Just track the duration for cleanup timing
				const endTime = instruction.duration;
				maxEndTime = Math.max(maxEndTime, endTime);
				return;
			} else if (instruction.parallel && index > 0) {
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

		// Clean up ghost elements after all animations complete
		const allGhosts = ghostElements.concat(this.moveTimeGhostElements || []);
		if (allGhosts.length > 0) {
			setTimeout(() => {
				allGhosts.forEach(el => el.remove());
				debug("Cleaned up " + allGhosts.length + " ghost elements");
				this.moveTimeGhostElements = [];
			}, maxEndTime + 100);
		}
	}

	/**
	 * Create ghost tile elements for animations that target tiles not on the board.
	 * Returns array of created elements for cleanup.
	 */
	createGhostElements(animationSequence) {
		const ghostElements = [];
		const needsGhost = [TrifleAnimationType.FADE_OUT, TrifleAnimationType.PULSE, TrifleAnimationType.SLIDE];

		animationSequence.animations.forEach(instruction => {
			if (!needsGhost.includes(instruction.type)) {
				return;
			}

			// startsAtMoveTime ghosts are created in setupMoveTimeGhosts (called from htmlify)
			if (instruction.startsAtMoveTime) {
				return;
			}

			// Check if tile element already exists on board
			const existingElement = this.findTileElement(instruction.tileId);
			if (existingElement) {
				return;
			}

			// Need to create a ghost element
			if (!instruction.tile || !instruction.startPoint) {
				debug("Cannot create ghost element: missing tile or startPoint");
				return;
			}

			debug("Creating ghost for " + instruction.type + " at startPoint: row=" + instruction.startPoint.row + ", col=" + instruction.startPoint.col);
			const ghostElement = this.createGhostTileElement(instruction.tile, instruction.startPoint, false);
			if (ghostElement) {
				ghostElements.push(ghostElement);
			}
		});

		return ghostElements;
	}

	/**
	 * Create a ghost tile element at a specific board position.
	 * Used for animating tiles that have been removed from the board.
	 * @param {Object} tile - The tile to create a ghost for
	 * @param {Object} position - The board position {row, col}
	 * @param {boolean} startsAtMoveTime - If true, apply "lifted" scale like a normal move
	 */
	createGhostTileElement(tile, position, startsAtMoveTime) {
		// Convert row/col to notation format used by point div name attribute
		const notationPointString = new RowAndColumn(position.row, position.col).notationPointString;

		// Find the board point div by name attribute
		const targetPointDiv = this.boardContainer.querySelector(`.point[name="${notationPointString}"]`);

		if (!targetPointDiv) {
			debug("createGhostTileElement: Could not find point at " + notationPointString);
			return null;
		}

		// Create the ghost tile image
		const theImg = document.createElement("img");
		theImg.elementStyleTransform = new ElementStyleTransform(theImg);
		theImg.elementStyleTransform.setValue("rotate", 315, "deg");
		theImg.src = TrifleActuator.imagePath + tile.getImageName() + ".png";
		theImg.classList.add("ghost-tile");
		theImg.style.position = "absolute";
		theImg.style.left = "0";
		theImg.style.top = "0";
		theImg.style.zIndex = "100";

		// If this ghost is for an animation that starts at move time,
		// apply the "lifted" scale like a normal move animation
		if (startsAtMoveTime) {
			theImg.elementStyleTransform.setValue("scale", "1.2");
		}

		// Add data-tile-id directly to the img so findTileElement can find it
		// (don't set on point div - another tile may already be there)
		theImg.setAttribute('data-tile-id', String(tile.id));
		targetPointDiv.appendChild(theImg);

		return theImg;
	}

	/**
	 * Dispatch animation instruction to the appropriate handler.
	 */
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

	/**
	 * Slide a tile from startPoint to endPoint.
	 */
	animateSlide(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) {
			debug("animateSlide: Could not find tile element for " + instruction.tileId);
			return;
		}

		const { startPoint, endPoint, duration, easing } = instruction;
		const { multiplierX, multiplierY, unitString } = this.getAnimationUnits();

		// Check if this is a ghost element (created at startPoint, needs to slide to endPoint)
		const isGhost = tileElement.classList.contains('ghost-tile');

		if (isGhost) {
			// Ghost is at startPoint, animate TO endPoint
			const endLeft = (endPoint.col - startPoint.col);
			const endTop = (endPoint.row - startPoint.row);

			if (instruction.startsAtMoveTime) {
				// Ghost was created with scale 1.2 and transition already set
				// Use requestAnimationFrame like standard moves to ensure CSS sees the transition
				requestAnimationFrame(() => {
					tileElement.style.left = (endLeft * multiplierX) + unitString;
					tileElement.style.top = (endTop * multiplierY) + unitString;
					// Also animate scale back to 1
					tileElement.elementStyleTransform.setValue("scale", 1);
				});
			} else {
				// Standard ghost animation - set up transition from scratch
				tileElement.style.transition = 'none';
				tileElement.style.left = '0';
				tileElement.style.top = '0';
				tileElement.style.zIndex = '100';

				// Animate to endPoint offset
				requestAnimationFrame(() => {
					tileElement.style.transition = `left ${duration}ms ${easing}, top ${duration}ms ${easing}`;
					tileElement.style.left = (endLeft * multiplierX) + unitString;
					tileElement.style.top = (endTop * multiplierY) + unitString;
				});
			}
		} else {
			// Regular tile at endPoint, animate FROM startPoint
			const left = (startPoint.col - endPoint.col);
			const top = (startPoint.row - endPoint.row);

			// Set starting position (disable transition temporarily)
			tileElement.style.transition = 'none';
			tileElement.style.left = (left * multiplierX) + unitString;
			tileElement.style.top = (top * multiplierY) + unitString;
			tileElement.style.zIndex = '100';

			// Animate to end position (0,0)
			requestAnimationFrame(() => {
				tileElement.style.transition = `left ${duration}ms ${easing}, top ${duration}ms ${easing}`;
				tileElement.style.left = "0px";
				tileElement.style.top = "0px";
			});
		}

		// Reset z-index after animation
		setTimeout(() => {
			tileElement.style.zIndex = '';
		}, duration);
	}

	/**
	 * Fade out a tile (for captures).
	 */
	animateFadeOut(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) {
			debug("animateFadeOut: Could not find tile element for " + instruction.tileId);
			return;
		}

		const { duration, easing } = instruction;

		tileElement.style.transition = `opacity ${duration}ms ${easing}`;
		requestAnimationFrame(() => {
			tileElement.style.opacity = "0";
		});
	}

	/**
	 * Fade in a tile (for resurrections or restorations).
	 */
	animateFadeIn(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) {
			debug("animateFadeIn: Could not find tile element for " + instruction.tileId);
			return;
		}

		const { duration, easing } = instruction;

		tileElement.style.opacity = "0";
		tileElement.style.transition = `opacity ${duration}ms ${easing}`;
		requestAnimationFrame(() => {
			tileElement.style.opacity = "1";
		});
	}

	/**
	 * Pop in a tile with scale effect.
	 */
	animatePop(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) {
			debug("animatePop: Could not find tile element for " + instruction.tileId);
			return;
		}

		const { duration } = instruction;

		// Start at scale 0
		if (tileElement.elementStyleTransform) {
			tileElement.elementStyleTransform.setValue("scale", 0);
		} else {
			tileElement.style.transform = "rotate(315deg) scale(0)";
		}

		requestAnimationFrame(() => {
			tileElement.style.transition = `transform ${duration}ms ease-out`;
			if (tileElement.elementStyleTransform) {
				tileElement.elementStyleTransform.setValue("scale", 1);
			} else {
				tileElement.style.transform = "rotate(315deg) scale(1)";
			}
		});
	}

	/**
	 * Pulse a tile to indicate ability activation.
	 * If a color is specified, adds a colored glow effect.
	 */
	animatePulse(instruction) {
		const tileElement = this.findTileElement(instruction.tileId);
		if (!tileElement) {
			debug("animatePulse: Could not find tile element for " + instruction.tileId);
			return;
		}

		const { duration, color } = instruction;
		const pulseDuration = duration / 2;

		// Build transition with optional filter for glow
		const transitionProps = color
			? `transform ${pulseDuration}ms ease-in-out, filter ${pulseDuration}ms ease-in-out`
			: `transform ${pulseDuration}ms ease-in-out`;

		tileElement.style.zIndex = '100';

		// Use requestAnimationFrame to ensure browser paints before animating
		requestAnimationFrame(() => {
			tileElement.style.transition = transitionProps;

			// Scale up and add glow
			if (tileElement.elementStyleTransform) {
				tileElement.elementStyleTransform.setValue("scale", 1.3);
			} else {
				tileElement.style.transform = "rotate(315deg) scale(1.3)";
			}

			// Add colored glow using drop-shadow filter
			if (color) {
				tileElement.style.filter = `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color})`;
			}
		});

		setTimeout(() => {
			// Scale back down and fade glow
			if (tileElement.elementStyleTransform) {
				tileElement.elementStyleTransform.setValue("scale", 1);
			} else {
				tileElement.style.transform = "rotate(315deg) scale(1)";
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

	/**
	 * Find a tile's img element on the board by tile ID.
	 */
	findTileElement(tileId) {
		if (!tileId) return null;

		const tileIdStr = String(tileId);

		// First, check for ghost elements (img elements with data-tile-id)
		const ghostImg = this.boardContainer.querySelector(`img[data-tile-id="${tileIdStr}"]`);
		if (ghostImg) {
			return ghostImg;
		}

		// Search all point divs for the tile
		const allPointDivs = this.boardContainer.querySelectorAll('.point');
		for (const div of allPointDivs) {
			const dataTileId = div.getAttribute('data-tile-id');
			if (dataTileId === tileIdStr) {
				return div.querySelector('img');
			}
		}

		debug("findTileElement: No element found for tileId " + tileId);
		return null;
	}

	/**
	 * Get animation unit multipliers based on screen size.
	 */
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

	/**
	 * Check if a tile has a pending SLIDE ability animation.
	 */
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
}

export default TrifleActuator;
