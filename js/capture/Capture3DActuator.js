// 3D Actuator for Capture Pai Sho
// Extends PaiSho3DActuator with Capture-specific game rendering
// Includes capture-help visualization (colored glow rings on tiles)

import * as THREE from 'three';
import { MOVE } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	clearMessage,
	getUserGamePreference,
	pieceAnimationLength,
	piecePlaceAnimation,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { CaptureController, CapturePreferences } from './CaptureController';
import { CaptureTileManager } from './CaptureTileManager';
import { isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';

// Capture help glow colors (matching 2D CSS: GUESTharmony #87f, HOSTharmony #6CC)
const COLOR_CAN_CAPTURE = 0x8877FF;    // Purple/blue — tiles this tile can capture
const COLOR_CAPTURED_BY = 0x66CCCC;    // Teal — tiles that can capture this tile

export class Capture3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations);
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return CaptureController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return CaptureController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		return "images/Capture/" + getUserGamePreference(CapturePreferences.tileDesignKey) + "/";
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
					this.addBoardPoint3D(cell, moveToAnimate);
				}
			});
		});

		// Draw arrows
		if (markingManager) {
			for (const [_, arrow] of Object.entries(markingManager.arrows)) {
				this.addArrow3D(arrow[0], arrow[1]);
			}
		}

		// Tile piles (Capture uses named container divs like Skud)
		var fullTileSet = new CaptureTileManager();
		fullTileSet.hostTiles.forEach((tile) => {
			this.clearTileContainer(tile);
		});
		fullTileSet.guestTiles.forEach((tile) => {
			this.clearTileContainer(tile);
		});
		tileManager.hostTiles.forEach((tile) => {
			this.addTile(tile, this.hostTilesContainer);
		});
		tileManager.guestTiles.forEach((tile) => {
			this.addTile(tile, this.guestTilesContainer);
		});
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
		const srcPath = this.getTileImageSourceDir() + tile.getImageName() + ".png";
		const tileGroup = this.buildTileMesh(srcPath, x, z);
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

		// Capture help glow rings
		if (tile.captureHelpFlag) {
			this.addCaptureHelpGlow(x, z, COLOR_CAN_CAPTURE);
		}
		if (tile.capturedByHelpFlag) {
			this.addCaptureHelpGlow(x, z, COLOR_CAPTURED_BY);
		}

		// Marked point with tile
		if (boardPoint.isType(MARKED)) {
			this.addMarkedIndicator(x, z);
		}

		// Possible move indicator on occupied point
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.addPossibleMoveIndicator(x, z);
		}

		// Captured tile overlay during animation
		if (this.animationOn && moveToAnimate && moveToAnimate.capturedTile
				&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
			const capturedSrcPath = this.getTileImageSourceDir() + moveToAnimate.capturedTile.getImageName() + ".png";
			const capturedGroup = this.buildTileMesh(capturedSrcPath, x, z);
			capturedGroup.position.y = 0.01;
			this.tilesGroup.add(capturedGroup);

			setTimeout(() => {
				this.animateTileFadeOut(capturedGroup, 300);
			}, pieceAnimationLength);
		}
	}

	// --- Capture Help Glow ---

	addCaptureHelpGlow(x, z, color) {
		const ringGeo = new THREE.TorusGeometry(0.48, 0.04, 8, 32);
		ringGeo.rotateX(Math.PI / 2);
		const ringMat = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.8,
		});
		const ring = new THREE.Mesh(ringGeo, ringMat);
		ring.position.set(x, 0.12, z);
		this.effectsGroup.add(ring);
	}

	// --- Animation Handling ---

	handleTileAnimation(boardPoint, moveToAnimate, tileGroup) {
		const x = boardPoint.col;
		const y = boardPoint.row;

		if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
			if (isSamePoint(moveToAnimate.endPoint, x, y)) {
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
		}
	}
}
