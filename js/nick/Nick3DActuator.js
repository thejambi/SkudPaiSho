// 3D Actuator for Nick Pai Sho
// Extends PaiSho3DActuator with Nick-specific game rendering
// Includes jumping movement animation, capture fade-out, pushed tile animation,
// and White Lotus in-check highlighting

import * as THREE from 'three';
import { HOST, MOVE, NotationPoint, RowAndColumn } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	clearMessage,
	pieceAnimationLength,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { NickController } from './NickController';
import { NickOptions } from './NickOptions';
import { NickTileCodes } from './NickTiles';
import { getTilesForPlayer, isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';

// White Lotus in-check glow color
const COLOR_LOTUS_CHECK = 0xFF4444;

export class Nick3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations, {
			boardRotation: NickOptions.viewAsGuest ? 315 : 135,
		});
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return NickController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return NickController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		return this.getTileSrcPath();
	}

	getTileSrcPath() {
		if (NickController.isUsingCustomTileDesigns()) {
			return NickController.getCustomTileDesignsUrl();
		}
		return "images/Nick/" + localStorage.getItem(NickOptions.tileDesignTypeKey) + "/";
	}

	// --- Override createFakeHtmlPoint for Nick's notation format ---
	// Nick uses (col, 16-row) notation adjustment

	createFakeHtmlPoint(userData) {
		const notationPointString = new RowAndColumn(userData.col, 16 - userData.row).notationPointString;
		return {
			getAttribute: (name) => {
				if (name === 'name') return notationPointString;
				return null;
			}
		};
	}

	// --- Override actuate to handle Nick's signature ---
	// Nick GameManager calls: actuate(board, tileManager, markingManager, moveToAnimate, moveDetails)
	// moveDetails = {capturedTiles: [], movedTile: tile, abilityActivationFlags: {}}

	actuate(board, tileManager, markingManager, moveToAnimate, moveDetails) {
		this.moveDetailsForRender = moveDetails;
		this.tileManagerForRender = tileManager;
		super.actuate(board, tileManager, markingManager, moveToAnimate, 0);
	}

	// --- Game-specific rendering ---

	render3DGame(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		// Render all board cells
		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (cell) {
					if (markingManager && markingManager.pointIsMarked(cell) && !cell.isType(MARKED)) {
						cell.addType(MARKED);
					} else if (markingManager && !markingManager.pointIsMarked(cell) && cell.isType(MARKED)) {
						cell.removeType(MARKED);
					}
					this.addBoardPoint3D(cell, moveToAnimate, this.moveDetailsForRender);
				}
			});
		});

		// Draw arrows
		if (markingManager) {
			for (const [_, arrow] of Object.entries(markingManager.arrows)) {
				this.addArrow3D(arrow[0], arrow[1]);
			}
		}

		// Tile piles
		this.renderTilePiles(this.tileManagerForRender);
	}

	// --- Tile Pile Rendering ---

	renderTilePiles(tileManager) {
		// Nick uses div IDs for tile containers
		this.clearContainerById('hostTilesContainer');
		this.clearContainerById('guestTilesContainer');

		if (!tileManager) return;

		const capturedTiles = tileManager.capturedTiles || [];
		const hostCapturedTiles = getTilesForPlayer(capturedTiles, HOST);
		const guestCapturedTiles = capturedTiles.filter(t => !hostCapturedTiles.includes(t));

		if (hostCapturedTiles.length > 0) {
			const container = document.getElementById('hostTilesContainer');
			if (container) {
				const capturedContainer = document.createElement("span");
				capturedContainer.classList.add("tileLibrary");
				const label = document.createElement("span");
				label.innerText = "--Captured Tiles--";
				capturedContainer.appendChild(label);
				capturedContainer.appendChild(document.createElement("br"));
				hostCapturedTiles.forEach((tile) => {
					this.addTilePileElement(tile, capturedContainer, true);
				});
				container.appendChild(capturedContainer);
			}
		}

		if (guestCapturedTiles.length > 0) {
			const container = document.getElementById('guestTilesContainer');
			if (container) {
				const capturedContainer = document.createElement("span");
				capturedContainer.classList.add("tileLibrary");
				const label = document.createElement("span");
				label.innerText = "--Captured Tiles--";
				capturedContainer.appendChild(label);
				capturedContainer.appendChild(document.createElement("br"));
				guestCapturedTiles.forEach((tile) => {
					this.addTilePileElement(tile, capturedContainer, true);
				});
				container.appendChild(capturedContainer);
			}
		}
	}

	clearContainerById(id) {
		const container = document.getElementById(id);
		if (container) {
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}
		}
	}

	addTilePileElement(tile, container, isCaptured) {
		if (!tile) return;

		const theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile || tile.tileIsSelectable) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		const theImg = document.createElement("img");
		theImg.src = this.getTileSrcPath() + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", tile.getNotationName());
		theDiv.setAttribute("id", tile.id);

		let clickable = !isCaptured;
		if (tile.tileIsSelectable) {
			clickable = true;
		}
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

		container.appendChild(theDiv);
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint, moveToAnimate, moveDetails) {
		if (boardPoint.isType(NON_PLAYABLE)) return;

		const x = boardPoint.col - this.gridOffset;
		const z = boardPoint.row - this.gridOffset;

		// Empty point indicators
		if (!boardPoint.hasTile() && !boardPoint.occupiedByAbility) {
			if (boardPoint.isType(MARKED)) {
				this.addMarkedIndicator(x, z);
			}
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				this.addPossibleMoveIndicator(x, z);
			}
			return;
		}

		if (boardPoint.occupiedByAbility) return;

		// Determine which tile image to show
		let displayTile = boardPoint.tile;
		const showMovedTileDuringAnimation = this.animationOn && moveDetails && moveDetails.movedTile
			&& moveToAnimate && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row);
		if (showMovedTileDuringAnimation) {
			displayTile = moveDetails.movedTile;
		}

		// Render tile
		const srcPath = this.getTileSrcPath() + displayTile.getImageName() + ".png";
		const tileGroup = this.buildTileMesh(srcPath, x, z);
		tileGroup.userData = {
			row: boardPoint.row,
			col: boardPoint.col,
			isTile: true,
		};

		// Animations
		if (moveToAnimate && this.animationOn) {
			this.handleTileAnimation(boardPoint, moveToAnimate, tileGroup, moveDetails);
		}

		this.tilesGroup.add(tileGroup);

		// After animation, swap to the actual tile image if it changed
		if (showMovedTileDuringAnimation && displayTile !== boardPoint.tile) {
			setTimeout(() => {
				if (boardPoint.hasTile()) {
					const newSrcPath = this.getTileSrcPath() + boardPoint.tile.getImageName() + ".png";
					const newTexture = this.getTexture(newSrcPath);
					tileGroup.traverse((child) => {
						if (child.material && child.material.map) {
							child.material.map = newTexture;
							child.material.needsUpdate = true;
						}
					});
				} else {
					tileGroup.visible = false;
				}
			}, pieceAnimationLength);
		}

		// Captured tile overlay at endpoint
		const capturedTile = this.getCapturedTileFromMove(moveDetails);
		if (this.animationOn && moveToAnimate && capturedTile
				&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
			const capturedSrcPath = this.getTileSrcPath() + capturedTile.getImageName() + ".png";
			const capturedGroup = this.buildTileMesh(capturedSrcPath, x, z);
			capturedGroup.position.y = 0.01;
			this.tilesGroup.add(capturedGroup);

			setTimeout(() => {
				this.animateTileFadeOut(capturedGroup, 300);
			}, pieceAnimationLength);
		}

		// White Lotus in-check glow
		if (boardPoint.tile && boardPoint.tile.code === NickTileCodes.WhiteLotus && boardPoint.lotusInCheck) {
			this.addLotusCheckGlow(x, z);
		}

		// Marked point with tile
		if (boardPoint.isType(MARKED)) {
			this.addMarkedIndicator(x, z);
		}

		// Possible move indicator on occupied point
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.addPossibleMoveIndicator(x, z);
		}
	}

	getCapturedTileFromMove(moveDetails) {
		if (moveDetails && moveDetails.capturedTiles && moveDetails.capturedTiles.length === 1) {
			return moveDetails.capturedTiles[0];
		}
		return null;
	}

	// --- White Lotus Check Indicator ---

	addLotusCheckGlow(x, z) {
		const torusGeo = new THREE.TorusGeometry(0.47, 0.04, 8, 32);
		torusGeo.rotateX(Math.PI / 2);
		const torusMat = new THREE.MeshBasicMaterial({
			color: COLOR_LOTUS_CHECK,
			transparent: true,
			opacity: 0.8,
		});
		const ring = new THREE.Mesh(torusGeo, torusMat);
		ring.position.set(x, 0.05, z);
		this.effectsGroup.add(ring);
	}

	// --- Animation Handling ---

	handleTileAnimation(boardPoint, moveToAnimate, tileGroup, moveDetails) {
		const endX = boardPoint.col;
		const endY = boardPoint.row;

		if (moveToAnimate.moveType !== MOVE) return;
		if (!boardPoint.tile && !(moveDetails && moveDetails.movedTile)) return;

		if (isSamePoint(moveToAnimate.endPoint, endX, endY)) {
			// This is the tile that was moved
			const moveStartPoint = new NotationPoint(moveToAnimate.startPoint);
			const startCol = moveStartPoint.rowAndColumn.col;
			const startRow = moveStartPoint.rowAndColumn.row;

			const startX3D = startCol - this.gridOffset;
			const startZ3D = startRow - this.gridOffset;
			const endX3D = endX - this.gridOffset;
			const endZ3D = endY - this.gridOffset;

			// Check for jump movement path
			let movementPath = moveToAnimate.endPointMovementPath;
			if (!movementPath && moveToAnimate.movementPath) {
				movementPath = moveToAnimate.movementPath;
			}

			if (movementPath && movementPath.length > 1) {
				// Multi-waypoint jump animation
				this.animateTileAlongPath(tileGroup, movementPath, endX3D, endZ3D, pieceAnimationLength);
			} else {
				// Simple A to B movement
				tileGroup.position.set(startX3D, 0.05, startZ3D);
				tileGroup.scale.set(1.2, 1.2, 1.2);

				this.animateTileMovement(tileGroup,
					new THREE.Vector3(startX3D, 0.05, startZ3D),
					new THREE.Vector3(endX3D, 0.05, endZ3D),
					pieceAnimationLength,
					1.2, 1
				);
			}
		} else {
			// Not the main moved tile - check for pushed tile
			if (moveToAnimate.promptTargetData) {
				Object.keys(moveToAnimate.promptTargetData).forEach((key) => {
					const promptDataEntry = moveToAnimate.promptTargetData[key];
					if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
						if (isSamePoint(promptDataEntry.movedTileDestinationPoint.pointText, endX, endY)) {
							const pushStartPoint = promptDataEntry.movedTilePoint;
							const pushStartCol = pushStartPoint.rowAndColumn.col;
							const pushStartRow = pushStartPoint.rowAndColumn.row;

							const pushStartX3D = pushStartCol - this.gridOffset;
							const pushStartZ3D = pushStartRow - this.gridOffset;
							const pushEndX3D = endX - this.gridOffset;
							const pushEndZ3D = endY - this.gridOffset;

							// Set initial position at push start
							tileGroup.position.set(pushStartX3D, 0.05, pushStartZ3D);

							// Delay the push animation (starts after main move)
							setTimeout(() => {
								tileGroup.scale.set(1.2, 1.2, 1.2);
								this.animateTileMovement(tileGroup,
									new THREE.Vector3(pushStartX3D, 0.05, pushStartZ3D),
									new THREE.Vector3(pushEndX3D, 0.05, pushEndZ3D),
									pieceAnimationLength * 0.8,
									1.2, 1
								);
							}, pieceAnimationLength / 1.2);
						}
					}
				});
			}
		}
	}

	// --- Multi-waypoint Path Animation ---

	animateTileAlongPath(tileGroup, movementPath, finalX, finalZ, totalDuration) {
		const numSegments = movementPath.length - 1;
		if (numSegments <= 0) return;

		const segmentDuration = totalDuration / numSegments;

		// Start at the first waypoint
		const firstPoint = new NotationPoint(movementPath[0]);
		const firstX = firstPoint.rowAndColumn.col - this.gridOffset;
		const firstZ = firstPoint.rowAndColumn.row - this.gridOffset;
		tileGroup.position.set(firstX, 0.05, firstZ);
		tileGroup.scale.set(1.2, 1.2, 1.2);

		// Animate through each waypoint
		for (let i = 1; i < movementPath.length; i++) {
			const delay = (i - 1) * segmentDuration;
			const pathPoint = new NotationPoint(movementPath[i]);
			const pointX = pathPoint.rowAndColumn.col - this.gridOffset;
			const pointZ = pathPoint.rowAndColumn.row - this.gridOffset;
			const isLast = (i === movementPath.length - 1);

			setTimeout(() => {
				const fromPos = tileGroup.position.clone();
				const toPos = new THREE.Vector3(pointX, 0.05, pointZ);
				this.animateTileHop(tileGroup, fromPos, toPos, segmentDuration, isLast);
			}, delay);
		}
	}

	// Animate a single hop of a multi-waypoint path
	animateTileHop(tileGroup, fromPos, toPos, duration, isLastHop) {
		const startTime = performance.now();

		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);

			tileGroup.position.lerpVectors(fromPos, toPos, eased);
			// Add arc for hop effect
			const arc = Math.sin(progress * Math.PI) * 0.3;
			tileGroup.position.y = fromPos.y + arc;

			if (isLastHop) {
				const scale = 1.2 + (1 - 1.2) * eased;
				tileGroup.scale.set(scale, scale, scale);
			}

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				tileGroup.position.copy(toPos);
				if (isLastHop) {
					tileGroup.scale.set(1, 1, 1);
				}
			}
		};

		requestAnimationFrame(animate);
	}
}
