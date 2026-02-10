// 3D Actuator for Paiko
// Extends PaiSho3DActuator with Paiko-specific game rendering

import * as THREE from 'three';
import { DEPLOY, MOVE, NotationPoint } from '../CommonNotationObjects';
import {
	clearMessage,
	pieceAnimationLength,
	piecePlaceAnimation,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { PaiSho3DActuator } from '../PaiSho3DActuator';
import { PaikoController } from './PaikoController';
import { PaikoPointState, PaikoZone } from './PaikoBoardPoint';
import { PaikoTileFacing, getAllTileCodes, getTileName } from './PaikoTile';

// Zone overlay colors
const COLOR_HOST_HOMEGROUND = 0xCC4444;
const COLOR_GUEST_HOMEGROUND = 0xCC4444;
const COLOR_MIDDLEGROUND = 0xDDDDAA;
const COLOR_BLACKED_OUT = 0x222222;
const COLOR_POSSIBLE_DEPLOY = 0x44AA44;
const COLOR_SELECTED = 0x44AAFF;

export class Paiko3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations, {
			gridOffset: 8.5,
			boardSurfaceSize: 19,
		});

		// Scale grid positions by 1.2x to align with board image (matches 2D overrideScale). Note: 1.26 seems to be the ticket!
		this.gridScale = 1.26;

		// Shared geometry for zone overlay planes
		this.zoneOverlayGeometry = new THREE.PlaneGeometry(0.95, 0.95);

		// Shared geometries for square tile meshes (scaled to match grid)
		const size = this.discRadius * 2 * this.gridScale;
		this.squareBodyGeometry = new THREE.BoxGeometry(size, 0.24, size);
		this.squareFaceGeometry = new THREE.PlaneGeometry(size - 0.04, size - 0.04);
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return PaikoController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return PaikoController.getGuestTilesContainerDivs();
	}

	// --- Grid coordinate helper (applies 1.2x scale) ---

	gridToWorld(col, row) {
		return {
			x: (col - this.gridOffset) * this.gridScale,
			z: (row - this.gridOffset) * this.gridScale,
		};
	}

	// Override base class arrow drawing to use scaled coordinates
	addArrow3D(startBoardPoint, endBoardPoint) {
		const start = this.gridToWorld(startBoardPoint.col, startBoardPoint.row);
		const end = this.gridToWorld(endBoardPoint.col, endBoardPoint.row);

		const points = [
			new THREE.Vector3(start.x, 0.15, start.z),
			new THREE.Vector3(end.x, 0.15, end.z),
		];
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFAA00, linewidth: 2 });
		const line = new THREE.Line(lineGeometry, lineMaterial);
		this.arrowsGroup.add(line);

		const dir = new THREE.Vector3(end.x - start.x, 0, end.z - start.z).normalize();
		const coneGeo = new THREE.ConeGeometry(0.1, 0.25, 8);
		const coneMat = new THREE.MeshBasicMaterial({ color: 0xFFAA00 });
		const cone = new THREE.Mesh(coneGeo, coneMat);
		cone.position.set(end.x, 0.15, end.z);
		const angle = Math.atan2(dir.x, dir.z);
		cone.rotation.set(0, angle, 0);
		cone.rotateX(Math.PI / 2);
		this.arrowsGroup.add(cone);
	}

	// --- Override board surface for Paiko's square board ---

	shouldUseRoundBoard() {
		return false;
	}

	getBoardImageUrl() {
		return "style/board_Paiko_zoom.png";
	}

	buildBoardSurface() {
		const boardSize = this.boardSurfaceSize;
		const boardThickness = 0.5;
		this.currentRoundBoard = false;
		this.currentBoardUrl = this.getBoardImageUrl();

		const boardTexture = this.textureLoader.load(this.currentBoardUrl);
		boardTexture.colorSpace = THREE.SRGBColorSpace;

		const boardGeometry = new THREE.BoxGeometry(boardSize, boardThickness, boardSize);
		const sideMaterial = new THREE.MeshStandardMaterial({
			color: 0x5C4033,
			roughness: 0.8,
		});
		this.boardTopMaterial = new THREE.MeshStandardMaterial({
			map: boardTexture,
			roughness: 0.7,
			metalness: 0.0,
			transparent: true,
		});
		const materials = [
			sideMaterial, sideMaterial,
			this.boardTopMaterial, sideMaterial,
			sideMaterial, sideMaterial,
		];

		this.boardMesh = new THREE.Mesh(boardGeometry, materials);
		this.boardMesh.position.y = 0.01 - boardThickness / 2;
		this.boardMesh.receiveShadow = true;
		this.boardGroup.add(this.boardMesh);

		// Table shadow plane
		const tableGeo = new THREE.PlaneGeometry(boardSize, boardSize);
		tableGeo.rotateX(-Math.PI / 2);
		this.tableMaterial = new THREE.MeshStandardMaterial({
			color: 0x5C4033,
			roughness: 0.8,
		});
		this.tableMesh = new THREE.Mesh(tableGeo, this.tableMaterial);
		this.tableMesh.position.y = 0.009;
		this.boardGroup.add(this.tableMesh);
	}

	// --- Override buildClickTargets for Paiko's zone-based system ---

	buildClickTargets(board) {
		this.clearGroup(this.clickTargetsGroup);
		this.clickTargetMeshes = {};

		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (!cell || cell.zone === PaikoZone.NON_PLAYABLE) return;

				const pos = this.gridToWorld(cell.col, cell.row);
				const clickGeo = this.clickPlaneGeometry.clone();
				clickGeo.rotateX(-Math.PI / 2);
				const clickMat = new THREE.MeshBasicMaterial({
					visible: false,
				});
				const clickMesh = new THREE.Mesh(clickGeo, clickMat);
				clickMesh.position.set(pos.x, 0.01, pos.z);
				clickMesh.userData = {
					row: cell.row,
					col: cell.col,
					isPoint: true,
				};
				this.clickTargetsGroup.add(clickMesh);
				this.clickTargetMeshes[`${cell.row},${cell.col}`] = clickMesh;
			});
		});
	}

	// --- Game-specific rendering ---

	render3DGame(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		// Render all board cells
		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (cell) {
					this.addBoardPoint3D(cell, moveToAnimate, moveAnimationBeginStep);
				}
			});
		});

		// Draw arrows
		if (markingManager && markingManager.arrows) {
			for (const [_, arrow] of Object.entries(markingManager.arrows)) {
				this.addArrow3D(arrow[0], arrow[1]);
			}
		}

		// Render tile containers (2D HTML)
		this.renderTileContainers(tileManager);
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint, moveToAnimate, moveAnimationBeginStep) {
		if (boardPoint.zone === PaikoZone.NON_PLAYABLE) return;

		const pos = this.gridToWorld(boardPoint.col, boardPoint.row);
		const x = pos.x;
		const z = pos.z;

		// Zone overlay
		// this.addZoneOverlay(boardPoint, x, z);	// Skipping zones, probably don't need this

		// State indicators on empty points
		if (!boardPoint.hasTile()) {
			if (boardPoint.hasState(PaikoPointState.POSSIBLE_MOVE)) {
				this.addPossibleMoveIndicator(x, z);
			}
			if (boardPoint.hasState(PaikoPointState.POSSIBLE_DEPLOY)) {
				this.addStateIndicator(x, z, COLOR_POSSIBLE_DEPLOY, 0.5);
			}
			if (boardPoint.hasState(PaikoPointState.SELECTED)) {
				this.addStateIndicator(x, z, COLOR_SELECTED, 0.5);
			}
			return;
		}

		// Render tile
		const tile = boardPoint.tile;
		const srcPath = `images/Paiko/${tile.getImageName()}.png`;
		const tileGroup = this.buildTileMeshWithFacing(srcPath, x, z, tile);
		tileGroup.userData = {
			row: boardPoint.row,
			col: boardPoint.col,
			isTile: true,
		};

		// Animations
		if (moveToAnimate && this.animationOn) {
			this.handleTileAnimation(boardPoint, moveToAnimate, moveAnimationBeginStep, tileGroup);
		}

		this.tilesGroup.add(tileGroup);

		// State indicators with tile
		if (boardPoint.hasState(PaikoPointState.POSSIBLE_MOVE)) {
			this.addPossibleMoveIndicator(x, z);
		}
		if (boardPoint.hasState(PaikoPointState.POSSIBLE_DEPLOY)) {
			this.addStateIndicator(x, z, COLOR_POSSIBLE_DEPLOY, 0.4);
		}
		if (boardPoint.hasState(PaikoPointState.SELECTED)) {
			this.addStateIndicator(x, z, COLOR_SELECTED, 0.5);
		}

		// Captured tile overlay during animation
		if (this.animationOn && moveToAnimate && moveToAnimate.capturedTiles) {
			for (const captured of moveToAnimate.capturedTiles) {
				if (captured.row === boardPoint.row && captured.col === boardPoint.col) {
					const capturedSrcPath = `images/Paiko/${captured.tile.getImageName()}.png`;
					const capturedGroup = this.buildTileMeshWithFacing(capturedSrcPath, x, z, captured.tile);
					capturedGroup.position.y = 0.01;
					this.tilesGroup.add(capturedGroup);

					setTimeout(() => {
						this.animateTileFadeOut(capturedGroup, 300);
					}, pieceAnimationLength);
				}
			}
		}
	}

	// --- Zone Overlay ---

	addZoneOverlay(boardPoint, x, z) {
		let color = null;
		let opacity = 0.15;

		switch (boardPoint.zone) {
			case PaikoZone.HOST_HOMEGROUND:
				color = COLOR_HOST_HOMEGROUND;
				opacity = 0.12;
				break;
			case PaikoZone.GUEST_HOMEGROUND:
				color = COLOR_GUEST_HOMEGROUND;
				opacity = 0.12;
				break;
			case PaikoZone.MIDDLEGROUND:
				color = COLOR_MIDDLEGROUND;
				opacity = 0.08;
				break;
			case PaikoZone.BLACKED_OUT:
				color = COLOR_BLACKED_OUT;
				opacity = 0.4;
				break;
		}

		if (color === null) return;

		const overlayGeo = this.zoneOverlayGeometry.clone();
		overlayGeo.rotateX(-Math.PI / 2);
		const overlayMat = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: opacity,
			side: THREE.DoubleSide,
		});
		const overlay = new THREE.Mesh(overlayGeo, overlayMat);
		overlay.position.set(x, 0.012, z);
		this.effectsGroup.add(overlay);
	}

	// --- State Indicator ---

	addStateIndicator(x, z, color, opacity) {
		const ringGeo = this.possibleMoveRingGeometry.clone();
		ringGeo.rotateX(-Math.PI / 2);
		const ringMat = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: opacity,
			side: THREE.DoubleSide,
		});
		const ring = new THREE.Mesh(ringGeo, ringMat);
		ring.position.set(x, 0.015, z);
		this.effectsGroup.add(ring);
	}

	// --- Square Tile Mesh with Facing ---

	buildTileMeshWithFacing(srcPath, x, z, tile) {
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

		// Apply facing rotation
		if (tile.hasFacing && tile.hasFacing() && tile.getFacing() !== PaikoTileFacing.UP) {
			const facingDegrees = 90 * tile.getFacing();
			faceGeo.rotateY(facingDegrees * Math.PI / 180);
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

	// --- Tile Containers (2D HTML, Paiko-specific structure) ---

	renderTileContainers(tileManager) {
		const allTileCodes = getAllTileCodes();

		// Clear host tile containers
		this.clearPaikoTileContainer('H-hand');
		allTileCodes.forEach(code => {
			this.clearPaikoTileContainer('H' + getTileName(code) + '-reserve');
		});

		// Clear guest tile containers
		this.clearPaikoTileContainer('G-hand');
		allTileCodes.forEach(code => {
			this.clearPaikoTileContainer('G' + getTileName(code) + '-reserve');
		});

		// Sort hand tiles
		const tileOrder = [
			// Match PaikoActuator sort order
			'Sw', 'Er', 'Bw', 'Fi', 'Ai', 'Wa', 'Sa', 'Lo'
		];
		const sortTiles = (tiles) => {
			return [...tiles].sort((a, b) => {
				const aIndex = tileOrder.indexOf(a.code);
				const bIndex = tileOrder.indexOf(b.code);
				return aIndex - bIndex;
			});
		};

		// Add tiles
		sortTiles(tileManager.hostHand).forEach(tile => this.addPaikoTile(tile, 'hand'));
		sortTiles(tileManager.guestHand).forEach(tile => this.addPaikoTile(tile, 'hand'));
		tileManager.hostReserve.forEach(tile => this.addPaikoTile(tile, 'reserve'));
		tileManager.guestReserve.forEach(tile => this.addPaikoTile(tile, 'reserve'));
	}

	clearPaikoTileContainer(className) {
		const container = document.querySelector('.' + className);
		if (container) {
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}
		}
	}

	addPaikoTile(tile, pileType) {
		let containerClass = tile.getImageName() + '-' + pileType;
		if (pileType === 'hand') {
			containerClass = tile.ownerCode + '-hand';
		}
		const container = document.querySelector('.' + containerClass);
		if (!container) return;

		const theDiv = document.createElement('div');
		theDiv.classList.add('point');
		theDiv.classList.add('hasTile');

		if (tile.selectedFromPile) {
			theDiv.classList.add('selectedFromPile');
			theDiv.classList.add('drained');
		}

		const theImg = document.createElement('img');
		theImg.src = `images/Paiko/${tile.getImageName()}.png`;
		theDiv.appendChild(theImg);

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

	// --- Animation Handling ---

	handleTileAnimation(boardPoint, moveToAnimate, moveAnimationBeginStep, tileGroup) {
		const moveData = moveToAnimate.moveData || {};
		const endPointText = moveData.endPoint;
		const startPointText = moveData.startPoint;
		const shiftEndPointText = moveData.shiftEndPoint;

		const x = boardPoint.col;
		const y = boardPoint.row;

		// Sai deploy+shift: two-stage animation
		if (moveToAnimate.moveType === DEPLOY && shiftEndPointText) {
			if (this.isSamePointText(shiftEndPointText, x, y) && moveAnimationBeginStep === 0) {
				const deployPoint = this.getRowColFromPointText(startPointText);
				if (deployPoint) {
					const deployPos = this.gridToWorld(deployPoint.col, deployPoint.row);
					const endPos = this.gridToWorld(x, y);

					// Start at deploy position with pop
					tileGroup.position.set(deployPos.x, 0.05, deployPos.z);
					tileGroup.scale.set(2, 2, 2);

					// Stage 1: Scale down at deploy position
					this.animateTileScale(tileGroup, 2, 1.2, pieceAnimationLength / 2);

					// Stage 2: Slide to final position
					setTimeout(() => {
						this.animateTileMovement(tileGroup,
							new THREE.Vector3(deployPos.x, 0.05, deployPos.z),
							new THREE.Vector3(endPos.x, 0.05, endPos.z),
							pieceAnimationLength / 2,
							1.2, 1
						);
					}, pieceAnimationLength / 2);
					return;
				}
			}
		}

		// Regular deploy
		if (moveToAnimate.moveType === DEPLOY && endPointText) {
			if (this.isSamePointText(endPointText, x, y) && moveAnimationBeginStep === 0) {
				if (piecePlaceAnimation === 1) {
					tileGroup.scale.set(2, 2, 2);
					this.animateTileScale(tileGroup, 2, 1, 500);
				}
			}
			return;
		}

		// Move/shift
		if (moveToAnimate.moveType === MOVE && boardPoint.tile && startPointText) {
			if (this.isSamePointText(endPointText, x, y) && moveAnimationBeginStep === 0) {
				const startPoint = this.getRowColFromPointText(startPointText);
				if (startPoint) {
					const startPos = this.gridToWorld(startPoint.col, startPoint.row);
					const endPos = this.gridToWorld(x, y);

					tileGroup.position.set(startPos.x, 0.05, startPos.z);
					tileGroup.scale.set(1.2, 1.2, 1.2);

					this.animateTileMovement(tileGroup,
						new THREE.Vector3(startPos.x, 0.05, startPos.z),
						new THREE.Vector3(endPos.x, 0.05, endPos.z),
						pieceAnimationLength,
						1.2, 1
					);
				}
			}
		}
	}

	// --- Point text helpers (same as PaikoActuator) ---

	isSamePointText(pointText, col, row) {
		if (!pointText) return false;
		const np = new NotationPoint(pointText);
		const rc = np.rowAndColumn;
		return rc && rc.col === col && rc.row === row;
	}

	getRowColFromPointText(pointText) {
		if (!pointText) return null;
		const np = new NotationPoint(pointText);
		return np.rowAndColumn;
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

	// --- Cleanup ---

	dispose() {
		this.zoneOverlayGeometry.dispose();
		this.squareBodyGeometry.dispose();
		this.squareFaceGeometry.dispose();
		super.dispose();
	}
}
