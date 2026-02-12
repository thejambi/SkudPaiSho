// 3D Actuator for Vagabond Pai Sho
// Extends PaiSho3DActuator with Vagabond-specific game rendering

import * as THREE from 'three';
import { DEPLOY, MOVE } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import { pieceAnimationLength, piecePlaceAnimation } from '../PaiShoMain';
import { vagabondTileDesignTypeKey } from '../GamePrefs';
import { VagabondController } from './VagabondController';
import { VagabondTileManager } from './VagabondTileManager';
import { isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';

export class Vagabond3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations, {
			boardRotation: 45,
		});
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return VagabondController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return VagabondController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		if (VagabondController.isUsingCustomTileDesigns()) {
			return VagabondController.getCustomTileDesignsUrl();
		} else {
			return "images/Vagabond/" + localStorage.getItem(vagabondTileDesignTypeKey) + "/";
		}
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
					this.addBoardPoint3D(cell, moveToAnimate, moveAnimationBeginStep);
				}
			});
		});

		// Draw arrows
		for (const [_, arrow] of Object.entries(markingManager.arrows)) {
			this.addArrow3D(arrow[0], arrow[1]);
		}

		// Tile piles
		const getSrcPath = () => this.getTileImageSourceDir();
		const fullTileSet = new VagabondTileManager();
		fullTileSet.hostTiles.forEach((tile) => this.clearTileContainer(tile));
		fullTileSet.guestTiles.forEach((tile) => this.clearTileContainer(tile));
		tileManager.hostTiles.forEach((tile) => this.addTile(tile, this.hostTilesContainer, getSrcPath));
		tileManager.guestTiles.forEach((tile) => this.addTile(tile, this.guestTilesContainer, getSrcPath));
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint, moveToAnimate, moveAnimationBeginStep) {
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
		const srcPath = this.getTileImageSourceDir() + tile.getImageName() + ".png";
		const tileGroup = this.buildTileMesh(srcPath, x, z);
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

		// Marked point with tile
		if (boardPoint.isType(MARKED)) {
			this.addMarkedIndicator(x, z);
		}

		// Possible move with tile (capture target)
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.addPossibleMoveIndicator(x, z);
		}

		// Captured tile overlay during animation
		if (this.animationOn && moveToAnimate && moveToAnimate.capturedTile
			&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)
			&& moveAnimationBeginStep === 0) {
			const capturedSrcPath = this.getTileImageSourceDir() + moveToAnimate.capturedTile.getImageName() + ".png";
			const capturedGroup = this.buildTileMesh(capturedSrcPath, x, z);
			capturedGroup.position.y = 0.01;
			this.tilesGroup.add(capturedGroup);

			setTimeout(() => {
				this.animateTileFadeOut(capturedGroup, 300);
			}, pieceAnimationLength);
		}
	}

	// --- Animation Handling ---

	handleTileAnimation(boardPoint, moveToAnimate, moveAnimationBeginStep, tileGroup) {
		const x = boardPoint.col;
		const y = boardPoint.row;

		if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
			if (isSamePoint(moveToAnimate.endPoint, x, y) && moveAnimationBeginStep === 0) {
				// Tile was moved here - animate from start position
				const startX = moveToAnimate.startPoint.rowAndColumn.col - 8;
				const startZ = moveToAnimate.startPoint.rowAndColumn.row - 8;
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
			}
		} else if (moveToAnimate.moveType === DEPLOY) {
			if (isSamePoint(moveToAnimate.endPoint, x, y) && moveAnimationBeginStep === 0) {
				// Tile was deployed here - scale animation
				if (piecePlaceAnimation === 1) {
					tileGroup.scale.set(2, 2, 2);
					this.animateTileScale(tileGroup, 2, 1, 500);
				}
			}
		}
	}
}
