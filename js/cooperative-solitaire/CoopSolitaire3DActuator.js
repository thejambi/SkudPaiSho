// 3D Actuator for Nature's Grove: Synergy (Cooperative Solitaire Pai Sho)
// Extends PaiSho3DActuator with CoopSolitaire-specific game rendering
// Includes harmony/clash glow and between-harmony indicators

import * as THREE from 'three';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	clearMessage,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { CoopSolitaireController } from './CoopSolitaireController';
import { CoopSolitaireTileManager } from './CoopSolitaireTileManager';
import { getSkudTilesSrcPath } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';

// Harmony colors (matching 2D CSS: HOSTharmony #6CC, GUESTharmony #87f)
const COLOR_HOST_HARMONY = 0x66CCCC;
const COLOR_GUEST_HARMONY = 0x8877FF;
const COLOR_COMBINED_HARMONY = 0x77A2E6;

export class CoopSolitaire3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations);

		// Shared geometry for between-harmony spheres
		this.bhSphereGeometry = new THREE.SphereGeometry(0.08, 8, 8);
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return CoopSolitaireController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return CoopSolitaireController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		return getSkudTilesSrcPath();
	}

	// --- Override actuate to match CoopSolitaire's signature ---
	// CoopSolitaire GameManager calls: actuate(board, theGame, markingManager, drawnTile)

	actuate(board, theGame, markingManager, drawnTile) {
		this.drawnTileForRender = drawnTile;
		this.theGameForRender = theGame;
		super.actuate(board, null, markingManager, null, 0);
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
					this.addBoardPoint3D(cell);
				}
			});
		});

		// Draw arrows
		if (markingManager) {
			for (const [_, arrow] of Object.entries(markingManager.arrows)) {
				this.addArrow3D(arrow[0], arrow[1]);
			}
		}

		// Tile piles - clear all then show drawn tile
		var fullTileSet = new CoopSolitaireTileManager(true);
		fullTileSet.tiles.forEach((tile) => {
			this.clearTileContainer(tile);
		});

		if (this.theGameForRender && !this.theGameForRender.getWinner() && this.drawnTileForRender) {
			this.addTile(this.drawnTileForRender, this.hostTilesContainer);
		}
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint) {
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

		this.tilesGroup.add(tileGroup);

		// Harmony/clash glow
		this.addHarmonyGlowForTile(tile, x, z);

		// Drained/trapped indicator
		if (tile.drained || tile.trapped) {
			this.setTileOpacity(tileGroup, 0.5);
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

	// --- Harmony Rendering ---

	addHarmonyGlowForTile(tile, x, z) {
		let glowColor = null;
		const inHarmony = tile.inHarmony;
		const inClash = tile.inClash;

		if (inHarmony && inClash) {
			glowColor = COLOR_COMBINED_HARMONY;
		} else if (inHarmony) {
			glowColor = tile.ownerName === "HOST" ? COLOR_HOST_HARMONY : COLOR_GUEST_HARMONY;
		} else if (inClash) {
			glowColor = tile.opponentName === "HOST" ? COLOR_HOST_HARMONY : COLOR_GUEST_HARMONY;
		}

		if (!glowColor) return;

		const torusGeo = new THREE.TorusGeometry(0.47, 0.03, 8, 32);
		torusGeo.rotateX(Math.PI / 2);
		const torusMat = new THREE.MeshBasicMaterial({
			color: glowColor,
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
