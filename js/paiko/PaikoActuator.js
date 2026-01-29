// Paiko Actuator
// Handles rendering the board and tiles

import { createBoardArrow, createBoardPointDiv, setupPaiShoBoard } from '../ActuatorHelp';
import { NotationPoint } from '../CommonNotationObjects';
import { DEPLOY, MOVE, HOST, GUEST } from '../CommonNotationObjects';
import { clearMessage, gameController, pieceAnimationLength, piecePlaceAnimation, pointClicked, RmbDown, RmbUp, showPointMessage, showTileMessage, unplayedTileClicked } from '../PaiShoMain';
import { ElementStyleTransform } from '../util/ElementStyleTransform';
import { PaikoController } from './PaikoController';
import { PaikoPointState, PaikoZone } from './PaikoBoardPoint';
import { PaikoTileFacing, getAllTileCodes } from './PaikoTile';

export class PaikoActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		this.gameContainer = gameContainer;
		this.mobile = isMobile;
		this.animationOn = enableAnimations;

		// Setup Pai Sho board - using spaces mode
		const containers = setupPaiShoBoard(
			this.gameContainer,
			PaikoController.getHostTilesContainerDivs(),
			PaikoController.getGuestTilesContainerDivs(),
			false, // No board rotation
			false, // No rotation type
			true,   // Play in spaces (not on points)
			"Paiko"
		);

		this.boardContainer = containers.boardContainer;
		this.arrowContainer = containers.arrowContainer;
		this.hostTilesContainer = containers.hostTilesContainer;
		this.guestTilesContainer = containers.guestTilesContainer;
	}

	setAnimationOn(isOn) {
		this.animationOn = isOn;
	}

	actuate(board, tileManager, markingManager, moveToAnimate) {
		const self = this;

		window.requestAnimationFrame(() => {
			self.htmlify(board, tileManager, markingManager, moveToAnimate);
		});
	}

	htmlify(board, tileManager, markingManager, moveToAnimate) {
		this.clearContainer(this.boardContainer);
		this.clearContainer(this.arrowContainer);

		const self = this;

		// Render board points
		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (cell) {
					self.addBoardPoint(cell, moveToAnimate);
				}
			});
		});

		// Draw arrows if any
		if (markingManager && markingManager.arrows) {
			for (const [_, arrow] of Object.entries(markingManager.arrows)) {
				this.arrowContainer.appendChild(createBoardArrow(arrow[0], arrow[1]));
			}
		}

		// Render tile containers
		this.renderTileContainers(tileManager);
	}

	renderTileContainers(tileManager) {
		// Clear all tile containers first
		const allTileCodes = getAllTileCodes();

		// Clear host tile containers
		allTileCodes.forEach(code => {
			this.clearTileContainer('H' + code + '-hand');
			this.clearTileContainer('H' + code + '-reserve');
		});
		this.clearTileContainer('H-captured');

		// Clear guest tile containers
		allTileCodes.forEach(code => {
			this.clearTileContainer('G' + code + '-hand');
			this.clearTileContainer('G' + code + '-reserve');
		});
		this.clearTileContainer('G-captured');

		// Add tiles to their appropriate containers
		tileManager.hostHand.forEach(tile => {
			this.addTile(tile, 'hand');
		});
		tileManager.guestHand.forEach(tile => {
			this.addTile(tile, 'hand');
		});

		tileManager.hostReserve.forEach(tile => {
			this.addTile(tile, 'reserve');
		});
		tileManager.guestReserve.forEach(tile => {
			this.addTile(tile, 'reserve');
		});

		tileManager.hostDiscard.forEach(tile => {
			this.addTileToCaptured(tile);
		});
		tileManager.guestDiscard.forEach(tile => {
			this.addTileToCaptured(tile);
		});
	}

	clearTileContainer(className) {
		const container = document.querySelector('.' + className);
		if (container) {
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}
		}
	}

	addTile(tile, pileType) {
		const containerClass = tile.getImageName() + '-' + pileType;
		const container = document.querySelector('.' + containerClass);
		if (!container) {
			return;
		}

		const theDiv = document.createElement('div');
		theDiv.classList.add('point');
		theDiv.classList.add('hasTile');

		if (tile.selectedFromPile) {
			theDiv.classList.add('selectedFromPile');
			theDiv.classList.add('drained');
		}

		const theImg = document.createElement('img');
		theImg.src = this.getTileSrcPath(tile);
		theDiv.appendChild(theImg);

		// Build full pileName with owner prefix (e.g., 'hostHand', 'guestReserve')
		const ownerPrefix = tile.ownerCode === 'H' ? 'host' : 'guest';
		const fullPileName = ownerPrefix + pileType.charAt(0).toUpperCase() + pileType.slice(1);

		theDiv.setAttribute('name', tile.getImageName());
		theDiv.setAttribute('id', tile.id);
		theDiv.setAttribute('data-pileName', fullPileName);
		theDiv.setAttribute('data-tileCode', tile.code);

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

	addTileToCaptured(tile) {
		const containerClass = tile.ownerCode + '-captured';
		const container = document.querySelector('.' + containerClass);
		if (!container) {
			return;
		}

		const theDiv = document.createElement('div');
		theDiv.classList.add('point');
		theDiv.classList.add('hasTile');
		theDiv.classList.add('captured');

		const theImg = document.createElement('img');
		theImg.src = this.getTileSrcPath(tile);
		theDiv.appendChild(theImg);

		theDiv.setAttribute('name', tile.getImageName());
		theDiv.setAttribute('id', tile.id);
		theDiv.setAttribute('data-pileName', 'captured');
		theDiv.setAttribute('data-tileCode', tile.code);

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

	getTileSrcPath(tile) {
		// For now, use placeholder path - will need actual tile images
		return `images/Paiko/${tile.getImageName()}.png`;
	}

	addBoardPoint(boardPoint, moveToAnimate) {
		const self = this;

		// Pass true for useSquareSpaces - Paiko plays in spaces, not on points
		const theDiv = createBoardPointDiv(boardPoint, true);

		// Add zone-specific styling
		if (boardPoint.zone === PaikoZone.NON_PLAYABLE) {
			// Non-playable, don't add any active styling
		} else {
			theDiv.classList.add('activePoint');

			// Zone styling
			if (boardPoint.zone === PaikoZone.HOST_HOMEGROUND) {
				theDiv.classList.add('paikoHostHomeground');
			} else if (boardPoint.zone === PaikoZone.GUEST_HOMEGROUND) {
				theDiv.classList.add('paikoGuestHomeground');
			} else if (boardPoint.zone === PaikoZone.MIDDLEGROUND) {
				theDiv.classList.add('paikoMiddleground');
			} else if (boardPoint.zone === PaikoZone.BLACKED_OUT) {
				theDiv.classList.add('paikoBlackedOut');
			}

			// State styling
			if (boardPoint.hasState(PaikoPointState.POSSIBLE_MOVE)) {
				theDiv.classList.add('possibleMove');
			}
			if (boardPoint.hasState(PaikoPointState.POSSIBLE_DEPLOY)) {
				theDiv.classList.add('possibleDeploy');
			}
			if (boardPoint.hasState(PaikoPointState.SELECTED)) {
				theDiv.classList.add('selectedPoint');
			}
			if (boardPoint.hasState(PaikoPointState.THREATENED)) {
				theDiv.classList.add('threatened');
			}
			if (boardPoint.hasState(PaikoPointState.COVERED)) {
				theDiv.classList.add('covered');
			}

			// Click handlers
			if (this.mobile) {
				theDiv.addEventListener('click', function() {
					pointClicked(this);
					showPointMessage(this);
				});
			} else {
				theDiv.addEventListener('click', function() { pointClicked(this); });
				theDiv.addEventListener('mouseover', function() { showPointMessage(this); });
				theDiv.addEventListener('mouseout', clearMessage);
				theDiv.addEventListener('mousedown', e => {
					if (e.button === 2) {
						RmbDown(theDiv);
					}
				});
				theDiv.addEventListener('mouseup', e => {
					if (e.button === 2) {
						RmbUp(theDiv);
					}
				});
				theDiv.addEventListener('contextmenu', e => {
					e.preventDefault();
				});
			}
		}

		// Render tile if present
		if (boardPoint.hasTile()) {
			theDiv.classList.add('hasTile');

			const theImg = document.createElement('img');
			theImg.elementStyleTransform = new ElementStyleTransform(theImg);

			// Apply tile rotation based on facing
			const tile = boardPoint.tile;
			if (tile.hasFacing() && tile.getFacing() !== PaikoTileFacing.UP) {
				const rotationDegrees = 90 * tile.getFacing();
				theImg.elementStyleTransform.setValue('rotate', rotationDegrees, 'deg');
			}

			// Handle animation
			if (moveToAnimate) {
				this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv);
			}

			theImg.src = this.getTileSrcPath(tile);
			theDiv.appendChild(theImg);

			// Add owner indicator
			theDiv.classList.add(tile.ownerName === HOST ? 'hostTile' : 'guestTile');
		}

		this.boardContainer.appendChild(theDiv);

		// Add line break at end of row (18 columns, 0-17)
		if (boardPoint.col === 17) {
			const theBr = document.createElement('div');
			theBr.classList.add('clear');
			this.boardContainer.appendChild(theBr);
		}
	}

	doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv) {
		if (!this.animationOn) return;

		let x = boardPoint.col;
		let y = boardPoint.row;
		const ox = x;
		const oy = y;

		// Get move data from TrifleGameNotation format
		const moveData = moveToAnimate.moveData || {};
		const endPointText = moveData.endPoint ? moveData.endPoint.pointText : null;
		const startPointText = moveData.startPoint ? moveData.startPoint.pointText : null;

		if (moveToAnimate.moveType === MOVE && boardPoint.tile && startPointText) {
			if (this.isSamePointText(endPointText, x, y)) {
				const startPoint = this.getRowColFromPointText(startPointText);
				if (startPoint) {
					x = startPoint.col;
					y = startPoint.row;
					theImg.elementStyleTransform.setValue('scale', 1.2);
					theDiv.style.zIndex = 99;
				}
			}
		} else if (moveToAnimate.moveType === DEPLOY && endPointText) {
			if (this.isSamePointText(endPointText, ox, oy)) {
				if (piecePlaceAnimation === 1) {
					theImg.elementStyleTransform.setValue('scale', 2);
					theDiv.style.zIndex = 99;
					requestAnimationFrame(() => {
						theImg.elementStyleTransform.setValue('scale', 1);
					});
				}
			}
		}

		let pointSizeMultiplierX = 34;
		let pointSizeMultiplierY = pointSizeMultiplierX;
		let unitString = 'px';

		if (window.innerWidth <= 612) {
			pointSizeMultiplierX = 5.5555;
			pointSizeMultiplierY = 5.611;
			unitString = 'vw';
		}

		theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
		theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;

		requestAnimationFrame(() => {
			theImg.style.left = '0px';
			theImg.style.top = '0px';
		});

		setTimeout(() => {
			requestAnimationFrame(() => {
				theImg.elementStyleTransform.setValue('scale', 1);
			});
		}, pieceAnimationLength);
	}

	// Helper to check if a point text matches row/col
	isSamePointText(pointText, col, row) {
		if (!pointText) return false;
		const np = new NotationPoint(pointText);
		const rc = np.rowAndColumn;
		return rc && rc.col === col && rc.row === row;
	}

	// Helper to get row/col from point text
	getRowColFromPointText(pointText) {
		if (!pointText) return null;
		const np = new NotationPoint(pointText);
		return np.rowAndColumn;
	}

	clearContainer(container) {
		while (container && container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}

	clearContainerWithId(containerIdName) {
		const container = document.getElementById(containerIdName);
		if (container) {
			this.clearContainer(container);
		}
	}
}
