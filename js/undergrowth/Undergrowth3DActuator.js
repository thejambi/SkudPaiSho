// 3D Actuator for Undergrowth Pai Sho
// Extends PaiSho3DActuator with Undergrowth-specific game rendering
// Includes harmony/clash glow, between-harmony indicators, and tile placement/capture animations

import * as THREE from 'three';
import { HOST, GUEST, PLANTING } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	clearMessage,
	pieceAnimationLength,
	piecePlaceAnimation,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { UNDERGROWTH_SIMPLE, gameOptionEnabled } from '../GameOptions';
import { UndergrowthController } from './UndergrowthController';
import { UndergrowthTileManager } from './UndergrowthTileManager';
import { getSkudTilesSrcPath, isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';

// Harmony colors (matching 2D CSS: HOSTharmony #6CC, GUESTharmony #87f)
const COLOR_HOST_HARMONY = 0x66CCCC;
const COLOR_GUEST_HARMONY = 0x8877FF;
const COLOR_COMBINED_HARMONY = 0x77A2E6;

export class Undergrowth3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations);

		// Shared geometry for between-harmony spheres
		this.bhSphereGeometry = new THREE.SphereGeometry(0.08, 8, 8);
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return UndergrowthController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return UndergrowthController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		if (gameOptionEnabled(UNDERGROWTH_SIMPLE)) {
			return "images/Adevar/monochrome/";
		}
		return getSkudTilesSrcPath();
	}

	// --- Override actuate to match Undergrowth's signature ---
	// Undergrowth GameManager calls: actuate(board, theGame, markingManager, move, moveAnimationBeginStep)

	actuate(board, theGame, markingManager, moveToAnimate, moveAnimationBeginStep) {
		this.theGameForRender = theGame;
		super.actuate(board, null, markingManager, moveToAnimate, moveAnimationBeginStep || 0);
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
					this.addBoardPoint3D(cell, moveToAnimate, moveAnimationBeginStep);
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
		var fullTileSet = new UndergrowthTileManager(true);
		fullTileSet.hostTiles.forEach((tile) => {
			this.clearTileContainer(tile);
		});
		fullTileSet.guestTiles.forEach((tile) => {
			this.clearTileContainer(tile);
		});
		if (this.theGameForRender) {
			this.theGameForRender.tileManager.hostTiles.forEach((tile) => {
				this.addTile(tile, this.hostTilesContainer);
			});
			this.theGameForRender.tileManager.guestTiles.forEach((tile) => {
				this.addTile(tile, this.guestTilesContainer);
			});
		}
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint, moveToAnimate, moveAnimationBeginStep) {
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
			} else if (boardPoint.betweenHarmony) {
				this.addBetweenHarmonyIndicator(boardPoint, x, z);
			}

			// Captured tile overlay at empty point
			if (moveToAnimate && this.animationOn) {
				this.renderCapturedTileAtPoint(boardPoint, moveToAnimate, moveAnimationBeginStep, x, z);
			}
			return;
		}

		// Render tile
		const tile = boardPoint.tile;
		const srcPath = this.getTileImageSrcForTile(tile);
		const tileGroup = this.buildTileMesh(srcPath, x, z);
		tileGroup.userData = {
			row: boardPoint.row,
			col: boardPoint.col,
			isTile: true,
		};

		// Plant animation
		if (moveToAnimate && this.animationOn && moveAnimationBeginStep === 0) {
			if (moveToAnimate.moveType === PLANTING
					&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
				if (piecePlaceAnimation === 1) {
					tileGroup.scale.set(2, 2, 2);
					this.animateTileScale(tileGroup, 2, 1, 500);
				}
			}
		}

		this.tilesGroup.add(tileGroup);

		// Harmony/clash glow (Undergrowth uses HOST for harmony, GUEST for clash)
		if (tile.inHarmony) {
			this.addHarmonyGlow(x, z, COLOR_HOST_HARMONY);
		}
		if (tile.inClash) {
			this.addHarmonyGlow(x, z, COLOR_GUEST_HARMONY);
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

	// --- Tile Image Helper ---

	getTileImageSrcForTile(tile) {
		if (gameOptionEnabled(UNDERGROWTH_SIMPLE)) {
			return "images/Adevar/monochrome/" + tile.ownerCode + "Back.png";
		}
		return getSkudTilesSrcPath() + tile.getImageName() + ".png";
	}

	// --- Captured Tile Animation ---

	renderCapturedTileAtPoint(boardPoint, moveToAnimate, moveAnimationBeginStep, x, z) {
		const capturedStepInfo = this.getPointCapturedMoveStepInfo(boardPoint, moveToAnimate);
		if (!capturedStepInfo || !capturedStepInfo.capturedTileInfo || !capturedStepInfo.capturedTileInfo.capturedTile) {
			return;
		}

		const capturedTile = capturedStepInfo.capturedTileInfo.capturedTile;
		const capturedSrcPath = this.getTileImageSrcForTile(capturedTile);
		const capturedGroup = this.buildTileMesh(capturedSrcPath, x, z);
		capturedGroup.position.y = 0.01;
		this.tilesGroup.add(capturedGroup);

		const delay = capturedStepInfo.step === 1 && moveAnimationBeginStep === 0
			? 0
			: pieceAnimationLength;

		setTimeout(() => {
			this.animateTileFadeOut(capturedGroup, 300);
		}, delay);
	}

	getPointCapturedMoveStepInfo(boardPoint, moveToAnimate) {
		var capturedStepInfo;
		if (moveToAnimate.capturedTiles1Info && moveToAnimate.capturedTiles1Info.length) {
			moveToAnimate.capturedTiles1Info.forEach(function(capturedTileInfo) {
				if (capturedTileInfo.boardPoint.row === boardPoint.row
					&& capturedTileInfo.boardPoint.col === boardPoint.col) {
					capturedStepInfo = {
						step: 1,
						capturedTileInfo: capturedTileInfo
					};
				}
			});
		}
		if (moveToAnimate.capturedTiles2Info && moveToAnimate.capturedTiles2Info.length) {
			moveToAnimate.capturedTiles2Info.forEach(function(capturedTileInfo) {
				if (capturedTileInfo.boardPoint.row === boardPoint.row
					&& capturedTileInfo.boardPoint.col === boardPoint.col) {
					capturedStepInfo = {
						step: 2,
						capturedTileInfo: capturedTileInfo
					};
				}
			});
		}
		return capturedStepInfo;
	}

	// --- Harmony Rendering ---

	addHarmonyGlow(x, z, color) {
		const torusGeo = new THREE.TorusGeometry(0.47, 0.03, 8, 32);
		torusGeo.rotateX(Math.PI / 2);
		const torusMat = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: 0.7,
		});
		const ring = new THREE.Mesh(torusGeo, torusMat);
		ring.position.set(x, 0.05, z);
		this.effectsGroup.add(ring);
	}

	addBetweenHarmonyIndicator(boardPoint, x, z) {
		let color;
		if (boardPoint.betweenHarmonyHost && boardPoint.betweenHarmonyGuest) {
			color = COLOR_COMBINED_HARMONY;
		} else if (boardPoint.betweenHarmonyHost) {
			color = COLOR_HOST_HARMONY;
		} else if (boardPoint.betweenHarmonyGuest) {
			color = COLOR_GUEST_HARMONY;
		} else {
			return;
		}

		const sphereMat = new THREE.MeshBasicMaterial({ color });
		const sphere = new THREE.Mesh(this.bhSphereGeometry, sphereMat);
		sphere.position.set(x, 0.05, z);
		this.effectsGroup.add(sphere);
	}

	// --- Override clearGroup to protect shared geometries ---

	clearGroup(group) {
		while (group.children.length > 0) {
			const child = group.children[0];
			group.remove(child);
			if (child.geometry && child.geometry !== this.discGeometry
				&& child.geometry !== this.faceGeometry
				&& child.geometry !== this.bhSphereGeometry) {
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
		if (this.bhSphereGeometry) {
			this.bhSphereGeometry.dispose();
		}
		super.dispose();
	}
}
