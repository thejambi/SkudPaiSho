// 3D Actuator for Undergrowth Simplicity (Briar)
// Extends PaiSho3DActuator with Briar-specific game rendering
// Includes connection glow, between-connection indicators, placement/removal animations

import * as THREE from 'three';
import { HOST, GUEST } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	clearMessage,
	piecePlaceAnimation,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';
import { UndergrowthBriarOptions } from './UndergrowthBriarOptions';
import { CENTER_POINT } from './UndergrowthSimplicityBoardPoint';

// Connection glow colors (matching 2D CSS: HOSTharmony #6CC, GUESTharmony #87f)
const COLOR_HOST_CONNECTION = 0x66CCCC;
const COLOR_GUEST_CONNECTION = 0x8877FF;
const COLOR_COMBINED_CONNECTION = 0x77A2E6;
const COLOR_DANGER = 0xDC3232;
const COLOR_CENTER_KNOTWEED = 0x88AA44;

export class UndergrowthSimplicity3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations);

		// Shared geometry for between-connection spheres
		this.bhSphereGeometry = new THREE.SphereGeometry(0.08, 8, 8);
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return '<div class="HBack"></div>';
	}

	getGuestTilesContainerDivs() {
		return '<div class="GBack"></div>';
	}

	// --- Override actuate to match Undergrowth Simplicity's signature ---
	// GameManager calls: actuate(board, theGame, markingManager, moveToAnimate, moveAnimationBeginStep)

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

		// Tile piles - show a single stone for each player
		this.updateTilePile3D(this.hostTilesContainer, "HBack", "H");
		this.updateTilePile3D(this.guestTilesContainer, "GBack", "G");
	}

	// --- Tile Pile Rendering (HTML, same as 2D) ---

	updateTilePile3D(container, className, ownerCode) {
		var tileContainer = container.querySelector("." + className);
		if (!tileContainer) return;

		// Clear existing
		while (tileContainer.firstChild) {
			tileContainer.removeChild(tileContainer.firstChild);
		}

		var theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		var theImg = document.createElement("img");
		theImg.src = UndergrowthBriarOptions.getTileSrc(ownerCode);
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", ownerCode + "Back");
		theDiv.setAttribute("id", ownerCode + "Stone");

		if (this.mobile) {
			theDiv.addEventListener('click', function() {
				unplayedTileClicked(theDiv);
				showTileMessage(theDiv);
			});
		} else {
			theDiv.addEventListener('click', function() { unplayedTileClicked(theDiv); });
			theDiv.addEventListener('mouseover', function() { showTileMessage(theDiv); });
			theDiv.addEventListener('mouseout', clearMessage);
		}

		tileContainer.appendChild(theDiv);
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint, moveToAnimate, moveAnimationBeginStep) {
		if (boardPoint.isType(NON_PLAYABLE)) return;

		const x = boardPoint.col - this.gridOffset;
		const z = boardPoint.row - this.gridOffset;

		// Render center point knotweed indicator
		if (boardPoint.isType(CENTER_POINT) && !boardPoint.hasTile()) {
			this.addCenterPointIndicator(x, z);
		}

		// Empty point indicators
		if (!boardPoint.hasTile()) {
			if (boardPoint.isType(MARKED)) {
				this.addMarkedIndicator(x, z);
			}
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				this.addPossibleMoveIndicator(x, z);
			} else if (boardPoint.betweenConnection) {
				this.addBetweenConnectionIndicator(boardPoint, x, z);
			}

			// Removed tile animation (decay/cut) at empty point
			if (moveToAnimate && this.animationOn) {
				this.renderRemovedTileAtPoint(boardPoint, moveToAnimate, x, z);
			}
			return;
		}

		// Render tile (stone)
		const tile = boardPoint.tile;
		const srcPath = UndergrowthBriarOptions.getTileSrc(tile.ownerCode);
		const tileGroup = this.buildTileMesh(srcPath, x, z);
		tileGroup.userData = {
			row: boardPoint.row,
			col: boardPoint.col,
			isTile: true,
		};

		// Danger highlight for tiles at risk of decay or cut
		if (boardPoint.decayDanger || boardPoint.cutDanger) {
			this.addDangerGlow(x, z);
		}

		// Placement animation
		if (moveToAnimate && this.animationOn) {
			if (moveToAnimate.endPoint && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
				if (piecePlaceAnimation === 1) {
					tileGroup.scale.set(2, 2, 2);
					this.animateTileScale(tileGroup, 2, 1, 500);
				}
			}
			if (moveToAnimate.endPoint2 && isSamePoint(moveToAnimate.endPoint2, boardPoint.col, boardPoint.row)) {
				if (piecePlaceAnimation === 1) {
					tileGroup.scale.set(2, 2, 2);
					this.animateTileScale(tileGroup, 2, 1, 500);
				}
			}
		}

		this.tilesGroup.add(tileGroup);

		// Connection glow
		if (tile.inConnection) {
			if (tile.ownerName === HOST) {
				this.addConnectionGlow(x, z, COLOR_HOST_CONNECTION);
			} else {
				this.addConnectionGlow(x, z, COLOR_GUEST_CONNECTION);
			}
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

	// --- Center Point Indicator ---

	addCenterPointIndicator(x, z) {
		// Semi-transparent knotweed disc at center
		const geo = new THREE.CylinderGeometry(0.38, 0.38, 0.06, 32);
		const mat = new THREE.MeshStandardMaterial({
			color: COLOR_CENTER_KNOTWEED,
			transparent: true,
			opacity: 0.5,
			roughness: 0.6,
		});
		const mesh = new THREE.Mesh(geo, mat);
		mesh.position.set(x, 0.03, z);
		this.effectsGroup.add(mesh);
	}

	// --- Connection Glow ---

	addConnectionGlow(x, z, color) {
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

	// --- Danger Glow ---

	addDangerGlow(x, z) {
		const torusGeo = new THREE.TorusGeometry(0.47, 0.02, 8, 32);
		torusGeo.rotateX(Math.PI / 2);
		const torusMat = new THREE.MeshBasicMaterial({
			color: COLOR_DANGER,
			transparent: true,
			opacity: 0.35,
		});
		const ring = new THREE.Mesh(torusGeo, torusMat);
		ring.position.set(x, 0.06, z);
		this.effectsGroup.add(ring);
	}

	// --- Between-Connection Indicator ---

	addBetweenConnectionIndicator(boardPoint, x, z) {
		let color;
		if (boardPoint.betweenConnectionHost && boardPoint.betweenConnectionGuest) {
			color = COLOR_COMBINED_CONNECTION;
		} else if (boardPoint.betweenConnectionHost) {
			color = COLOR_HOST_CONNECTION;
		} else if (boardPoint.betweenConnectionGuest) {
			color = COLOR_GUEST_CONNECTION;
		} else {
			return;
		}

		const sphereMat = new THREE.MeshBasicMaterial({ color });
		const sphere = new THREE.Mesh(this.bhSphereGeometry, sphereMat);
		sphere.position.set(x, 0.05, z);
		this.effectsGroup.add(sphere);
	}

	// --- Removed Tile Animation (Decay/Cut) ---

	renderRemovedTileAtPoint(boardPoint, moveToAnimate, x, z) {
		var removedTile = this.getRemovedTileAt(moveToAnimate, boardPoint.row, boardPoint.col);
		if (!removedTile) return;

		const srcPath = UndergrowthBriarOptions.getTileSrc(removedTile.ownerCode);
		const ghostGroup = this.buildTileMesh(srcPath, x, z);
		ghostGroup.position.y = 0.05;
		this.tilesGroup.add(ghostGroup);

		// Fade out and scale down the ghost tile
		setTimeout(() => {
			this.animateTileFadeOut(ghostGroup, 600);
			this.animateTileScale(ghostGroup, 1, 0.3, 600);
		}, 50);
	}

	getRemovedTileAt(move, row, col) {
		if (move.decayedTiles) {
			for (var i = 0; i < move.decayedTiles.length; i++) {
				if (move.decayedTiles[i].row === row && move.decayedTiles[i].col === col) {
					return move.decayedTiles[i].tile;
				}
			}
		}
		if (move.cutTiles) {
			for (var i = 0; i < move.cutTiles.length; i++) {
				if (move.cutTiles[i].row === row && move.cutTiles[i].col === col) {
					return move.cutTiles[i].tile;
				}
			}
		}
		return null;
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
