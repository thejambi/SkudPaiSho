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
		if (UndergrowthBriarOptions.getCenterpiece() !== "tree") {
			this.addBrambleBush(x, z);
		} else {
			this.addTree(x, z);
		}
	}

	// --- Procedural Tree ---

	addTree(x, z) {
		const treeGroup = new THREE.Group();

		// Trunk - brown cylinder
		const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.7, 8);
		const trunkMat = new THREE.MeshStandardMaterial({
			color: 0x5C3A1E,
			roughness: 0.9,
		});
		const trunk = new THREE.Mesh(trunkGeo, trunkMat);
		trunk.position.y = 0.35;
		trunk.castShadow = true;
		treeGroup.add(trunk);

		// Canopy - layered cones for a fuller look
		const canopyMat = new THREE.MeshStandardMaterial({
			color: 0x2D6B2D,
			roughness: 0.8,
		});

		// Lower canopy (wider)
		const lowerCanopyGeo = new THREE.ConeGeometry(0.45, 0.5, 8);
		const lowerCanopy = new THREE.Mesh(lowerCanopyGeo, canopyMat);
		lowerCanopy.position.y = 0.65;
		lowerCanopy.castShadow = true;
		treeGroup.add(lowerCanopy);

		// Upper canopy (narrower, overlapping)
		const upperCanopyGeo = new THREE.ConeGeometry(0.32, 0.45, 8);
		const upperCanopy = new THREE.Mesh(upperCanopyGeo, canopyMat);
		upperCanopy.position.y = 0.95;
		upperCanopy.castShadow = true;
		treeGroup.add(upperCanopy);

		treeGroup.position.set(x, 0.01, z);
		this.effectsGroup.add(treeGroup);
	}

	// --- Procedural Bramble Bush ---

	addBrambleBush(x, z) {
		const bushGroup = new THREE.Group();

		const branchMat = new THREE.MeshStandardMaterial({
			color: 0x3D2B1F,
			roughness: 0.95,
		});
		const branchMatLight = new THREE.MeshStandardMaterial({
			color: 0x5C4030,
			roughness: 0.9,
		});

		// Main branches arching out from center
		const mainBranches = [
			{ rx: 0.5, rz: 0.3, ry: 0, h: 0.6, rad: 0.035 },
			{ rx: -0.4, rz: -0.5, ry: 1.1, h: 0.55, rad: 0.03 },
			{ rx: 0.3, rz: 0.6, ry: 2.3, h: 0.65, rad: 0.04 },
			{ rx: -0.6, rz: -0.15, ry: 3.4, h: 0.5, rad: 0.03 },
			{ rx: 0.45, rz: -0.4, ry: 4.6, h: 0.58, rad: 0.035 },
			{ rx: -0.2, rz: 0.55, ry: 5.5, h: 0.52, rad: 0.03 },
		];

		mainBranches.forEach((b) => {
			const geo = new THREE.CylinderGeometry(0.015, b.rad, b.h, 5);
			const mesh = new THREE.Mesh(geo, branchMat);
			mesh.position.y = b.h / 2;

			const pivot = new THREE.Group();
			pivot.add(mesh);
			pivot.rotation.set(b.rx, b.ry, b.rz);
			pivot.castShadow = true;
			bushGroup.add(pivot);
		});

		// Cross branches that weave between the main ones
		const crossBranches = [
			{ sx: 0.15, sy: 0.25, sz: 0.1, ex: -0.12, ey: 0.4, ez: -0.15 },
			{ sx: -0.1, sy: 0.2, sz: 0.18, ex: 0.18, ey: 0.35, ez: -0.08 },
			{ sx: 0.08, sy: 0.35, sz: -0.15, ex: -0.18, ey: 0.22, ez: 0.12 },
			{ sx: -0.15, sy: 0.3, sz: -0.08, ex: 0.1, ey: 0.45, ez: 0.15 },
			{ sx: 0.2, sy: 0.15, sz: 0.05, ex: -0.05, ey: 0.5, ez: -0.2 },
			{ sx: -0.18, sy: 0.4, sz: 0.05, ex: 0.15, ey: 0.2, ez: -0.12 },
			{ sx: 0.05, sy: 0.45, sz: 0.18, ex: -0.2, ey: 0.15, ez: -0.05 },
		];

		crossBranches.forEach((cb) => {
			const start = new THREE.Vector3(cb.sx, cb.sy, cb.sz);
			const end = new THREE.Vector3(cb.ex, cb.ey, cb.ez);
			const mid = start.clone().lerp(end, 0.5);
			const length = start.distanceTo(end);

			const geo = new THREE.CylinderGeometry(0.01, 0.02, length, 4);
			const mesh = new THREE.Mesh(geo, branchMatLight);

			// Position at midpoint and orient toward endpoint
			mesh.position.copy(mid);
			const dir = end.clone().sub(start).normalize();
			const up = new THREE.Vector3(0, 1, 0);
			const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
			mesh.setRotationFromQuaternion(quat);
			mesh.castShadow = true;
			bushGroup.add(mesh);
		});

		// A few curling tendrils reaching upward
		const tendrils = [
			{ rx: 0.2, rz: 0.1, ry: 0.5, h: 0.35 },
			{ rx: -0.15, rz: -0.2, ry: 2.0, h: 0.3 },
			{ rx: 0.1, rz: 0.25, ry: 3.5, h: 0.32 },
			{ rx: -0.25, rz: 0.15, ry: 5.0, h: 0.28 },
		];

		tendrils.forEach((t) => {
			const geo = new THREE.CylinderGeometry(0.008, 0.018, t.h, 4);
			const mesh = new THREE.Mesh(geo, branchMat);
			mesh.position.y = 0.35 + t.h / 2;

			const pivot = new THREE.Group();
			pivot.add(mesh);
			pivot.rotation.set(t.rx, t.ry, t.rz);
			bushGroup.add(pivot);
		});

		bushGroup.scale.set(1.25, 1.25, 1.25);
		bushGroup.position.set(x, 0.01, z);
		this.effectsGroup.add(bushGroup);
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
