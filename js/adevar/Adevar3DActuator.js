// 3D Actuator for Adevar Pai Sho
// Extends PaiSho3DActuator with Adevar-specific game rendering

import * as THREE from 'three';
import { DEPLOY, GUEST, HOST, MOVE } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	clearMessage,
	pieceAnimationLength,
	piecePlaceAnimation,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { AdevarController } from './AdevarController';
import { AdevarOptions } from './AdevarOptions';
import { AdevarTileType } from './AdevarTile';
import { getTilesForPlayer, isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';

export class Adevar3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations, {
			boardRotation: AdevarOptions.viewAsGuest ? 315 : 135,
			gridOffset: 8.5,
		});

		// Shared geometries for square tile meshes (space tiles mode)
		if (AdevarOptions.isSpaceTiles()) {
			const size = this.discRadius * 2;
			this.squareBodyGeometry = new THREE.BoxGeometry(size, 0.24, size);
			this.squareFaceGeometry = new THREE.PlaneGeometry(size - 0.04, size - 0.04);
		}
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return AdevarController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return AdevarController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		return "images/Adevar/" + localStorage.getItem(AdevarOptions.tileDesignTypeKey) + "/";
	}

	// --- Override actuate to handle Adevar's different signature ---
	// Adevar GameManager calls: actuate(board, tileManager, markingManager, capturedTiles, moveToAnimate)
	// Base class expects: actuate(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep)

	actuate(board, tileManager, markingManager, capturedTiles, moveToAnimate) {
		this.capturedTilesForRender = capturedTiles;
		super.actuate(board, tileManager, markingManager, moveToAnimate, 0);
	}

	// --- Game-specific rendering ---

	render3DGame(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		// Render all board cells
		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (cell) {
					if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)) {
						cell.addType(MARKED);
					} else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)) {
						cell.removeType(MARKED);
					}
					this.addBoardPoint3D(cell, moveToAnimate);
				}
			});
		});

		// Draw arrows
		for (const [_, arrow] of Object.entries(markingManager.arrows)) {
			this.addArrow3D(arrow[0], arrow[1]);
		}

		// Tile piles (tile reserves + captured tiles)
		this.renderTilePiles(tileManager, this.capturedTilesForRender);
	}

	// --- Tile Pile Rendering ---

	renderTilePiles(tileManager, capturedTiles) {
		// Clear previous tile pile contents
		this.hostTilesContainer.innerHTML = this.getHostTilesContainerDivs();
		this.guestTilesContainer.innerHTML = this.getGuestTilesContainerDivs();

		const hostCapturedTiles = getTilesForPlayer(capturedTiles, HOST);
		const guestCapturedTiles = getTilesForPlayer(capturedTiles, GUEST);

		// Host tile reserve
		var hostTileReserveContainer = document.createElement("span");
		hostTileReserveContainer.classList.add("tileLibraryNoMargin");
		hostTileReserveContainer.appendChild(document.createElement("br"));
		this.hostTilesContainer.appendChild(hostTileReserveContainer);

		tileManager.hostTiles.forEach((tile) => {
			this.addTilePileElement(tile, hostTileReserveContainer, false);
		});

		if (hostCapturedTiles.length > 0) {
			var hostCapturedContainer = document.createElement("span");
			hostCapturedContainer.classList.add("tileLibrary");
			var label = document.createElement("span");
			label.innerText = "--Captured Tiles--";
			hostCapturedContainer.appendChild(label);
			hostCapturedContainer.appendChild(document.createElement("br"));
			hostCapturedTiles.forEach((tile) => {
				this.addTilePileElement(tile, hostCapturedContainer, true);
			});
			this.hostTilesContainer.appendChild(hostCapturedContainer);
		}

		// Guest tile reserve
		var guestTileReserveContainer = document.createElement("span");
		guestTileReserveContainer.classList.add("tileLibraryNoMargin");
		guestTileReserveContainer.appendChild(document.createElement("br"));
		this.guestTilesContainer.appendChild(guestTileReserveContainer);

		tileManager.guestTiles.forEach((tile) => {
			this.addTilePileElement(tile, guestTileReserveContainer, false);
		});

		if (guestCapturedTiles.length > 0) {
			var guestCapturedContainer = document.createElement("span");
			guestCapturedContainer.classList.add("tileLibrary");
			var label = document.createElement("span");
			label.innerText = "--Captured Tiles--";
			guestCapturedContainer.appendChild(label);
			guestCapturedContainer.appendChild(document.createElement("br"));
			guestCapturedTiles.forEach((tile) => {
				this.addTilePileElement(tile, guestCapturedContainer, true);
			});
			this.guestTilesContainer.appendChild(guestCapturedContainer);
		}
	}

	addTilePileElement(tile, container, isCaptured) {
		if (!tile) return;

		var theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		var theImg = document.createElement("img");
		theImg.src = this.getTileImageSourceDir() + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", tile.getNotationName());
		theDiv.setAttribute("id", tile.id);

		if (!isCaptured) {
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

	// --- Square Tile Mesh (for Space Tiles mode) ---

	buildSquareTileMesh(srcPath, x, z, isHost) {
		const group = new THREE.Group();

		const bodyMat = new THREE.MeshStandardMaterial({
			color: 0xBBBBBB,
			roughness: 0.6,
		});
		const body = new THREE.Mesh(this.squareBodyGeometry, bodyMat);
		body.castShadow = true;
		group.add(body);

		const texture = this.getTexture(srcPath);
		const faceGeo = this.squareFaceGeometry.clone();
		faceGeo.rotateX(-Math.PI / 2);
		// Space tiles: HOST facing Guest, GUEST facing Host - working correctly if rotating HOST tiles 180 (aka PI)
		if (isHost) {
			faceGeo.rotateY(Math.PI);
		}
		const faceMat = new THREE.MeshStandardMaterial({
			map: texture,
			roughness: 0.6,
			transparent: true,
		});
		const face = new THREE.Mesh(faceGeo, faceMat);
		face.position.y = 0.121;
		group.add(face);

		group.position.set(x, 0.05, z);
		return group;
	}

	buildTileMeshForTile(srcPath, x, z, tile) {
		if (AdevarOptions.isSpaceTiles()) {
			return this.buildSquareTileMesh(srcPath, x, z, tile.ownerName === HOST);
		}
		return this.buildTileMesh(srcPath, x, z);
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint, moveToAnimate) {
		if (boardPoint.isType(NON_PLAYABLE)) return;

		const x = boardPoint.col - this.gridOffset;
		const z = boardPoint.row - this.gridOffset;

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

		// During animation, show the moved tile (before it may have changed at the endpoint)
		let displayTile = tile;
		const showMovedTileDuringAnimation = this.animationOn && moveToAnimate && moveToAnimate.moveTileResults
			&& moveToAnimate.moveTileResults.tileMoved
			&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row);
		if (showMovedTileDuringAnimation) {
			displayTile = moveToAnimate.moveTileResults.tileMoved;
		}

		const srcPath = this.getTileImageSourceDir() + displayTile.getImageName() + ".png";
		const tileGroup = this.buildTileMeshForTile(srcPath, x, z, displayTile);
		tileGroup.userData = {
			row: boardPoint.row,
			col: boardPoint.col,
			isTile: true,
		};

		// Animations
		if (moveToAnimate && this.animationOn) {
			this.handleTileAnimation(boardPoint, moveToAnimate, tileGroup);
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

		// Wrong SF attempt: show HT at endpoint, then hide the moved tile after animation
		if (this.animationOn && moveToAnimate && moveToAnimate.moveTileResults
			&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)
			&& moveToAnimate.moveTileResults.tileMoved !== moveToAnimate.moveTileResults.tileInEndPoint) {
			// The moved SF tile disappears after animation (it gets captured)
			setTimeout(() => {
				this.setTileOpacity(tileGroup, 0);
			}, pieceAnimationLength * 1.6);
		}

		// Marked point with tile
		if (boardPoint.isType(MARKED)) {
			this.addMarkedIndicator(x, z);
		}

		// Possible move with tile (selectable target)
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.addSelectableTileHighlight(x, z);
		}

		// Captured tile overlay during animation
		const capturedTile = this.getCapturedTileFromMove(moveToAnimate, boardPoint);
		if (capturedTile) {
			const capturedSrcPath = this.getTileImageSourceDir() + capturedTile.getImageName() + ".png";
			const capturedGroup = this.buildTileMeshForTile(capturedSrcPath, x, z, capturedTile);
			capturedGroup.position.y = 0.01;
			this.tilesGroup.add(capturedGroup);

			setTimeout(() => {
				this.animateTileFadeOut(capturedGroup, 300);
			}, pieceAnimationLength);
		}
	}

	getCapturedTileFromMove(moveToAnimate, boardPoint) {
		if (!this.animationOn || !moveToAnimate) return null;
		if (!isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) return null;

		if (moveToAnimate.placeTileResults && moveToAnimate.placeTileResults.capturedTile) {
			return moveToAnimate.placeTileResults.capturedTile;
		}
		if (moveToAnimate.moveTileResults && moveToAnimate.moveTileResults.capturedTile) {
			return moveToAnimate.moveTileResults.capturedTile;
		}
		return null;
	}

	// --- Selectable Tile Highlight ---

	addSelectableTileHighlight(x, z) {
		const ringGeo = new THREE.RingGeometry(0.44, 0.54, 32);
		ringGeo.rotateX(-Math.PI / 2);
		const ringMat = new THREE.MeshBasicMaterial({
			color: 0x44AAFF,
			transparent: true,
			opacity: 0.8,
			side: THREE.DoubleSide,
		});
		const ring = new THREE.Mesh(ringGeo, ringMat);
		ring.position.set(x, 0.17, z);
		this.effectsGroup.add(ring);
	}

	// --- Override clearGroup to protect shared square geometries ---

	clearGroup(group) {
		while (group.children.length > 0) {
			const child = group.children[0];
			group.remove(child);
			if (child.geometry && child.geometry !== this.discGeometry
				&& child.geometry !== this.faceGeometry
				&& child.geometry !== this.squareBodyGeometry
				&& child.geometry !== this.squareFaceGeometry) {
				child.geometry.dispose();
			}
			if (child.material) {
				if (Array.isArray(child.material)) {
					child.material.forEach((m) => m.dispose());
				} else {
					child.material.dispose();
				}
			}
			if (child.children && child.children.length > 0) {
				this.clearGroup(child);
			}
		}
	}

	dispose() {
		if (this.squareBodyGeometry) {
			this.squareBodyGeometry.dispose();
		}
		if (this.squareFaceGeometry) {
			this.squareFaceGeometry.dispose();
		}
		super.dispose();
	}

	// --- Animation Handling ---

	handleTileAnimation(boardPoint, moveToAnimate, tileGroup) {
		const x = boardPoint.col;
		const y = boardPoint.row;

		if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
			if (isSamePoint(moveToAnimate.endPoint, x, y)) {
				// Tile was moved here - animate from start position
				const startX = moveToAnimate.startPoint.rowAndColumn.col - this.gridOffset;
				const startZ = moveToAnimate.startPoint.rowAndColumn.row - this.gridOffset;
				const endX = x - this.gridOffset;
				const endZ = y - this.gridOffset;

				tileGroup.position.set(startX, 0.05, startZ);
				tileGroup.scale.set(1.2, 1.2, 1.2);

				this.animateTileMovement(tileGroup,
					new THREE.Vector3(startX, 0.05, startZ),
					new THREE.Vector3(endX, 0.05, endZ),
					pieceAnimationLength,
					1.2, 1
				);
			}
		} else if (moveToAnimate.moveType === DEPLOY) {
			if (isSamePoint(moveToAnimate.endPoint, x, y)) {
				// Tile was deployed here - scale animation
				if (piecePlaceAnimation === 1) {
					tileGroup.scale.set(2, 2, 2);
					this.animateTileScale(tileGroup, 2, 1, 500);
				}
			}
		}
	}
}
