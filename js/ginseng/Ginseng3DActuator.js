// 3D Actuator for Ginseng Pai Sho
// Extends PaiSho3DActuator with Ginseng-specific game rendering

import * as THREE from 'three';
import { MOVE, NotationPoint } from '../CommonNotationObjects';
import { HOST, GUEST } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	clearMessage,
	pieceAnimationLength,
	piecePlaceAnimation,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { GinsengController } from './GinsengController';
import { GinsengOptions } from './GinsengOptions';
import { getTilesForPlayer, isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';

export class Ginseng3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations, {
			boardRotation: GinsengOptions.viewAsGuest ? 270 : 90,
		});
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return GinsengController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return GinsengController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		if (GinsengController.isUsingCustomTileDesigns()) {
			return GinsengController.getCustomTileDesignsUrl();
		} else {
			return "images/Ginseng/" + localStorage.getItem(GinsengOptions.tileDesignTypeKey) + "/";
		}
	}

	// --- Game-specific rendering ---

	render3DGame(board, tileManager, markingManager, moveToAnimate, moveDetailsOrStep) {
		// In Ginseng, the 5th param is moveDetails (object), not moveAnimationBeginStep (number)
		const moveDetails = (moveDetailsOrStep && typeof moveDetailsOrStep === 'object') ? moveDetailsOrStep : null;

		// Render all board cells
		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (cell) {
					if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)) {
						cell.addType(MARKED);
					} else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)) {
						cell.removeType(MARKED);
					}
					this.addBoardPoint3D(cell, moveToAnimate, moveDetails);
				}
			});
		});

		// Draw arrows
		for (const [_, arrow] of Object.entries(markingManager.arrows)) {
			this.addArrow3D(arrow[0], arrow[1]);
		}

		// Captured tiles in HTML tile pile
		this.renderCapturedTiles(tileManager);
	}

	// --- Captured Tiles Rendering ---

	renderCapturedTiles(tileManager) {
		// Clear existing captured tile HTML before re-rendering
		this.hostTilesContainer.innerHTML = this.getHostTilesContainerDivs();
		this.guestTilesContainer.innerHTML = this.getGuestTilesContainerDivs();

		const hostCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, HOST);
		const guestCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, GUEST);

		if (hostCapturedTiles.length > 0) {
			const container = document.createElement("span");
			container.classList.add("tileLibrary");
			const label = document.createElement("span");
			label.innerText = "--Captured Tiles--";
			container.appendChild(label);
			container.appendChild(document.createElement("br"));
			hostCapturedTiles.forEach((tile) => {
				this.addCapturedTile(tile, container);
			});
			this.hostTilesContainer.appendChild(container);
		}

		if (guestCapturedTiles.length > 0) {
			const container = document.createElement("span");
			container.classList.add("tileLibrary");
			const label = document.createElement("span");
			label.innerText = "--Captured Tiles--";
			container.appendChild(label);
			container.appendChild(document.createElement("br"));
			guestCapturedTiles.forEach((tile) => {
				this.addCapturedTile(tile, container);
			});
			this.guestTilesContainer.appendChild(container);
		}
	}

	addCapturedTile(tile, container) {
		if (!tile) return;

		const theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile || tile.tileIsSelectable) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		const theImg = document.createElement("img");
		theImg.src = this.getTileImageSourceDir() + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", tile.getNotationName());
		theDiv.setAttribute("id", tile.id);

		if (tile.tileIsSelectable) {
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

		container.appendChild(theDiv);
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint, moveToAnimate, moveDetails) {
		if (boardPoint.isType(NON_PLAYABLE)) return;

		const x = boardPoint.col - 8;
		const z = boardPoint.row - 8;

		// Empty point indicators
		if (!boardPoint.hasTile()) {
			if (boardPoint.isType(MARKED)) {
				this.addMarkedIndicator(x, z);
			}
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				this.addPossibleMoveIndicator(x, z);
			}
			return;
		}

		// Render tile
		const tile = boardPoint.tile;

		// During animation, show the moved tile (before abilities may have changed it)
		let displayTile = tile;
		const showMovedTileDuringAnimation = this.animationOn && moveDetails && moveDetails.movedTile
			&& moveToAnimate && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row);
		if (showMovedTileDuringAnimation) {
			displayTile = moveDetails.movedTile;
		}

		const srcPath = this.getTileImageSourceDir() + displayTile.getImageName() + ".png";
		const tileGroup = this.buildTileMesh(srcPath, x, z);
		tileGroup.userData = {
			row: boardPoint.row,
			col: boardPoint.col,
			isTile: true,
		};

		// Animations
		if (moveToAnimate && this.animationOn) {
			this.handleTileAnimation(boardPoint, moveToAnimate, moveDetails, tileGroup);
		}

		this.tilesGroup.add(tileGroup);

		// After animation, swap to the actual tile image if it changed
		if (showMovedTileDuringAnimation && displayTile !== tile) {
			setTimeout(() => {
				const newSrcPath = this.getTileImageSourceDir() + tile.getImageName() + ".png";
				const newTexture = this.getTexture(newSrcPath);
				tileGroup.traverse((child) => {
					if (child.material && child.material.map) {
						child.material.map = newTexture;
						child.material.needsUpdate = true;
					}
				});
			}, pieceAnimationLength);
		}

		// Marked point with tile
		if (boardPoint.isType(MARKED)) {
			this.addMarkedIndicator(x, z);
		}

		// Possible move with tile (selectable target for ability prompt)
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.addSelectableTileHighlight(x, z);
		}

		// Captured tile overlay during animation
		const capturedTile = this.getCapturedTileForPoint(moveDetails, moveToAnimate, boardPoint);
		if (capturedTile) {
			const capturedSrcPath = this.getTileImageSourceDir() + capturedTile.getImageName() + ".png";
			const capturedGroup = this.buildTileMesh(capturedSrcPath, x, z);
			capturedGroup.position.y = 0.01;
			this.tilesGroup.add(capturedGroup);

			setTimeout(() => {
				this.animateTileFadeOut(capturedGroup, 300);
			}, pieceAnimationLength);
		}
	}

	getCapturedTileForPoint(moveDetails, moveToAnimate, boardPoint) {
		if (!this.animationOn || !moveToAnimate || !moveDetails) return null;
		if (!moveDetails.capturedTiles || moveDetails.capturedTiles.length === 0) return null;
		if (!isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) return null;

		// Ginseng typically has at most one captured tile from movement
		if (moveDetails.capturedTiles.length === 1) {
			return moveDetails.capturedTiles[0];
		}
		return null;
	}

	// --- Animation Handling ---

	handleTileAnimation(boardPoint, moveToAnimate, moveDetails, tileGroup) {
		const x = boardPoint.col;
		const y = boardPoint.row;

		if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
			if (isSamePoint(moveToAnimate.endPoint, x, y)) {
				// Tile was moved here - animate from start position
				const startPoint = new NotationPoint(moveToAnimate.startPoint);
				const startX = startPoint.rowAndColumn.col - 8;
				const startZ = startPoint.rowAndColumn.row - 8;
				const endX = x - 8;
				const endZ = y - 8;

				tileGroup.position.set(startX, 0.05, startZ);
				tileGroup.scale.set(1.2, 1.2, 1.2);

				this.animateTileMovement(tileGroup,
					new THREE.Vector3(startX, 0.05, startZ),
					new THREE.Vector3(endX, 0.05, endZ),
					pieceAnimationLength,
					1.2, 1
				);
			} else {
				// Check if this tile was pushed by an ability
				this.handlePushedTileAnimation(boardPoint, moveToAnimate, tileGroup);
			}
		}
	}

	handlePushedTileAnimation(boardPoint, moveToAnimate, tileGroup) {
		if (!moveToAnimate.promptTargetData) return;

		const x = boardPoint.col;
		const y = boardPoint.row;

		Object.keys(moveToAnimate.promptTargetData).forEach((key) => {
			const promptDataEntry = moveToAnimate.promptTargetData[key];
			if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
				if (isSamePoint(promptDataEntry.movedTileDestinationPoint.pointText, x, y)) {
					const moveStartPoint = promptDataEntry.movedTilePoint;
					const startX = moveStartPoint.rowAndColumn.col - 8;
					const startZ = moveStartPoint.rowAndColumn.row - 8;
					const endX = x - 8;
					const endZ = y - 8;

					// Delay push animation until after the main move
					tileGroup.position.set(startX, 0.05, startZ);

					setTimeout(() => {
						tileGroup.scale.set(1.2, 1.2, 1.2);
						this.animateTileMovement(tileGroup,
							new THREE.Vector3(startX, 0.05, startZ),
							new THREE.Vector3(endX, 0.05, endZ),
							pieceAnimationLength / 1.2,
							1.2, 1
						);
					}, pieceAnimationLength / 1.2);
				}
			}
		});
	}
}
