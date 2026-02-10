// 3D Actuator for Fire Pai Sho
// Extends PaiSho3DActuator with Fire-specific game rendering
// Fire shares tile images, harmony system, and bonus move mechanics with Skud

import * as THREE from 'three';
import { ACCENT_TILE } from '../GameData';
import { ARRANGING, PLANTING } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	ETHEREAL_ACCENT_TILES,
	HIDE_RESERVE_TILES,
	NO_HARMONY_VISUAL_AIDS,
	gameOptionEnabled,
} from '../GameOptions';
import {
	clearMessage,
	getUserGamePreference,
	pieceAnimationLength,
	piecePlaceAnimation,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { FirePaiShoController } from './FirePaiShoController';
import { FirePaiShoTileManager } from './FirePaiShoTileManager';
import { getSkudTilesSrcPath, isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';

// Harmony colors (same as Skud)
const COLOR_HOST_HARMONY = 0x66CCCC;
const COLOR_GUEST_HARMONY = 0x8877FF;
const COLOR_COMBINED_HARMONY = 0x77A2E6;

export class FirePaiSho3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		const rotateFacingRedGardens = getUserGamePreference(FirePaiShoController.boardRotationKey) !== "true";
		super(gameContainer, isMobile, enableAnimations, {
			boardRotation: rotateFacingRedGardens ? 315 : 0,
		});

		// Shared geometries for harmony effects
		this.harmonyRingGeometry = new THREE.RingGeometry(0.42, 0.52, 32);
		this.bhSphereGeometry = new THREE.SphereGeometry(0.06, 8, 8);
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return FirePaiShoController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return FirePaiShoController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		return getSkudTilesSrcPath();
	}

	// --- Game-specific rendering ---

	render3DGame(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		// Check for orchid move
		if (moveToAnimate && moveToAnimate.moveType === ARRANGING) {
			const cell = board.cells[moveToAnimate.endPoint.rowAndColumn.row][moveToAnimate.endPoint.rowAndColumn.col];
			if (cell.hasTile() && cell.tile.code === "O") {
				moveToAnimate.isOrchidMove = true;
			}
		}

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
		this.renderTilePiles(tileManager);
	}

	// --- Tile Pile Rendering ---

	renderTilePiles(tileManager) {
		// Clear previous tile pile contents
		this.hostTilesContainer.innerHTML = this.getHostTilesContainerDivs();
		this.guestTilesContainer.innerHTML = this.getGuestTilesContainerDivs();

		// Host Library
		var hostLibraryContainer = document.createElement("span");
		hostLibraryContainer.classList.add("tileLibrary");
		var hostLibraryLabel = document.createElement("span");
		hostLibraryLabel.innerText = "~Host Tile Library~";
		hostLibraryContainer.appendChild(hostLibraryLabel);
		hostLibraryContainer.appendChild(document.createElement("br"));
		this.hostTilesContainer.appendChild(hostLibraryContainer);

		tileManager.hostLibraryTiles.forEach((tile) => {
			this.addTilePileElement(tile, hostLibraryContainer, true);
		});

		// Host Reserve
		if (!gameOptionEnabled(HIDE_RESERVE_TILES)) {
			var hostReserveContainer = document.createElement("span");
			hostReserveContainer.classList.add("tileLibrary");
			var hostReserveLabel = document.createElement("span");
			hostReserveLabel.innerText = "~Host Tile Reserve~";
			hostReserveContainer.appendChild(hostReserveLabel);
			hostReserveContainer.appendChild(document.createElement("br"));
			this.hostTilesContainer.appendChild(hostReserveContainer);

			tileManager.hostReserveTiles.forEach((tile) => {
				this.addTilePileElement(tile, hostReserveContainer, false);
			});
		}

		// Guest Library
		var guestLibraryContainer = document.createElement("span");
		guestLibraryContainer.classList.add("tileLibrary");
		var guestLibraryLabel = document.createElement("span");
		guestLibraryLabel.innerText = "~Guest Tile Library~";
		guestLibraryContainer.appendChild(guestLibraryLabel);
		guestLibraryContainer.appendChild(document.createElement("br"));
		this.guestTilesContainer.appendChild(guestLibraryContainer);

		tileManager.guestLibraryTiles.forEach((tile) => {
			this.addTilePileElement(tile, guestLibraryContainer, true);
		});

		// Guest Reserve
		if (!gameOptionEnabled(HIDE_RESERVE_TILES)) {
			var guestReserveContainer = document.createElement("span");
			guestReserveContainer.classList.add("tileLibrary");
			var guestReserveLabel = document.createElement("span");
			guestReserveLabel.innerText = "~Guest Tile Reserve~";
			guestReserveContainer.appendChild(guestReserveLabel);
			guestReserveContainer.appendChild(document.createElement("br"));
			this.guestTilesContainer.appendChild(guestReserveContainer);

			tileManager.guestReserveTiles.forEach((tile) => {
				this.addTilePileElement(tile, guestReserveContainer, false);
			});
		}

		// Currently drawn reserve tile
		if (gameOptionEnabled(HIDE_RESERVE_TILES) && tileManager.currentlyDrawnReserve !== null) {
			var drawnContainer = document.createElement("span");
			drawnContainer.classList.add("tileLibrary");
			var drawnLabel = document.createElement("span");
			drawnLabel.innerText = "~Currently Drawn Reserve Tile~";
			drawnContainer.appendChild(drawnLabel);
			drawnContainer.appendChild(document.createElement("br"));
			this.guestTilesContainer.appendChild(drawnContainer);

			this.addTilePileElement(tileManager.currentlyDrawnReserve, drawnContainer, false);
		}
	}

	addTilePileElement(tile, container, clickable) {
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

		theDiv.setAttribute("name", tile.getImageName());
		theDiv.setAttribute("id", tile.id);

		if (this.mobile) {
			if (clickable) {
				theDiv.addEventListener('click', () => {
					unplayedTileClicked(theDiv);
					showTileMessage(theDiv);
				});
			}
		} else {
			if (clickable) {
				theDiv.addEventListener('click', () => unplayedTileClicked(theDiv));
			}
			theDiv.addEventListener('mouseover', () => showTileMessage(theDiv));
			theDiv.addEventListener('mouseout', clearMessage);
		}

		container.appendChild(theDiv);
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint, moveToAnimate, moveAnimationBeginStep) {
		if (boardPoint.isType(NON_PLAYABLE)) return;

		const x = boardPoint.col - 8;
		const z = boardPoint.row - 8;

		const isAnimationPointOfBoatRemovingAccentTile = this.animationOn
			&& !boardPoint.hasTile()
			&& moveToAnimate && moveToAnimate.bonusTileCode === "B"
			&& !moveToAnimate.boatBonusPoint
			&& isSamePoint(moveToAnimate.bonusEndPoint, boardPoint.col, boardPoint.row);

		// Visual state indicators for empty points
		if (!boardPoint.hasTile() && !isAnimationPointOfBoatRemovingAccentTile) {
			if (boardPoint.isType(MARKED)) {
				this.addMarkedIndicator(x, z);
			}

			if (boardPoint.isType(POSSIBLE_MOVE)) {
				this.addPossibleMoveIndicator(x, z);
			} else if (boardPoint.betweenHarmony
				&& !gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)
				&& getUserGamePreference(FirePaiShoController.hideHarmonyAidsKey) !== "true") {
				this.addBetweenHarmonyIndicator(boardPoint, x, z);
			}
			return;
		}

		// Boat removing accent tile animation
		if (isAnimationPointOfBoatRemovingAccentTile) {
			if (!this.animationOn) return;

			const tileRemovedWithBoat = moveToAnimate.tileRemovedWithBoat;
			if (tileRemovedWithBoat) {
				const srcPath = this.getTileImageSourceDir();
				const removedSrcPath = srcPath + tileRemovedWithBoat.getImageName() + ".png";
				const removedTileGroup = this.buildTileMesh(removedSrcPath, x, z);
				this.tilesGroup.add(removedTileGroup);

				const step1Delay = (1 - moveAnimationBeginStep) * pieceAnimationLength;
				setTimeout(() => {
					this.animateTileFadeOut(removedTileGroup, 300);

					if (moveToAnimate.accentTileUsed) {
						const boatSrcPath = srcPath + moveToAnimate.accentTileUsed.getImageName() + ".png";
						const boatTileGroup = this.buildTileMesh(boatSrcPath, x, z);
						boatTileGroup.scale.set(2, 2, 2);
						this.tilesGroup.add(boatTileGroup);

						this.animateTileScale(boatTileGroup, 2, 1, pieceAnimationLength);

						setTimeout(() => {
							this.animateTileFadeOut(boatTileGroup, pieceAnimationLength);
						}, pieceAnimationLength);
					}
				}, step1Delay);
			}
			return;
		}

		if (boardPoint.hasTile()) {
			const tile = boardPoint.tile;
			const srcPath = this.getTileImageSourceDir() + tile.getImageName() + ".png";
			const tileGroup = this.buildTileMesh(srcPath, x, z);
			tileGroup.userData = {
				row: boardPoint.row,
				col: boardPoint.col,
				isTile: true,
			};

			const flags = {
				boostedOnThisTurn: false,
				wasArranged: false,
				etherealizedOnThisTurn: false,
				didBonusMove: false,
			};

			if (moveToAnimate && this.animationOn) {
				this.handleTileAnimation(boardPoint, moveToAnimate, moveAnimationBeginStep, tileGroup, flags);
			}

			this.tilesGroup.add(tileGroup);

			// Harmony glow
			if (tile.harmonyOwners
				&& !gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)
				&& getUserGamePreference(FirePaiShoController.hideHarmonyAidsKey) !== "true") {
				if (this.animationOn && (flags.didBonusMove || flags.wasArranged)) {
					const delay = ((flags.didBonusMove ? 2 : 1) - moveAnimationBeginStep) * pieceAnimationLength;
					setTimeout(() => {
						this.addHarmonyGlow(tile, x, z);
					}, delay);
				} else {
					this.addHarmonyGlow(tile, x, z);
				}
			}

			// Boosted indicator
			if (tile.boosted) {
				if (flags.boostedOnThisTurn) {
					setTimeout(() => {
						this.addBoostedIndicator(x, z);
					}, pieceAnimationLength);
				} else {
					this.addBoostedIndicator(x, z);
				}
			}

			// Ethereal indicator
			if (tile.ethereal) {
				if (flags.etherealizedOnThisTurn) {
					setTimeout(() => {
						this.setTileOpacity(tileGroup, 0.5);
					}, pieceAnimationLength);
				} else {
					this.setTileOpacity(tileGroup, 0.5);
				}
			}

			if (boardPoint.isType(MARKED)) {
				this.addMarkedIndicator(x, z);
			}

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
	}

	// --- Animation Handling ---

	handleTileAnimation(boardPoint, moveToAnimate, moveAnimationBeginStep, tileGroup, flags) {
		let x = boardPoint.col, y = boardPoint.row;
		const ox = x, oy = y;
		let placedOnAccent = false;

		if (moveToAnimate.hasHarmonyBonus()) {
			if (isSamePoint(moveToAnimate.bonusEndPoint, ox, oy)) {
				placedOnAccent = true;

				if (moveToAnimate.bonusTileCode === "B" && moveToAnimate.boatBonusPoint
					&& isSamePoint(moveToAnimate.bonusEndPoint, ox, oy)) {
					tileGroup.position.y = 0.12;
				}
			} else if (moveToAnimate.boatBonusPoint && isSamePoint(moveToAnimate.boatBonusPoint, x, y)) {
				x = moveToAnimate.bonusEndPoint.rowAndColumn.col;
				y = moveToAnimate.bonusEndPoint.rowAndColumn.row;
				flags.didBonusMove = true;
			} else if (moveToAnimate.bonusTileCode === "W") {
				const dx = x - moveToAnimate.bonusEndPoint.rowAndColumn.col;
				const dy = y - moveToAnimate.bonusEndPoint.rowAndColumn.row;
				if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy && (dx + dy) !== (dx * dy)) {
					if (dx === 1 && dy > -1) y--;
					else if (dy === -1 && dx > -1) x--;
					else if (dx === -1 && dy < 1) y++;
					else x++;
					flags.didBonusMove = true;
				}
			} else if (moveToAnimate.bonusTileCode === "K") {
				const dx = x - moveToAnimate.bonusEndPoint.rowAndColumn.col;
				const dy = y - moveToAnimate.bonusEndPoint.rowAndColumn.row;
				if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy && (dx + dy) !== (dx * dy)) {
					flags.boostedOnThisTurn = true;
				}
			} else if (moveToAnimate.bonusTileCode === "Y") {
				const dx = x - moveToAnimate.bonusEndPoint.rowAndColumn.col;
				const dy = y - moveToAnimate.bonusEndPoint.rowAndColumn.row;
				if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy && (dx + dy) !== (dx * dy)) {
					flags.etherealizedOnThisTurn = true;
				}
			}
		}

		const intermediateX = x - 8;
		const intermediateZ = y - 8;

		if (moveAnimationBeginStep === 0) {
			if (moveToAnimate.moveType === ARRANGING && boardPoint.tile && boardPoint.tile.type !== ACCENT_TILE) {
				if (isSamePoint(moveToAnimate.endPoint, x, y)) {
					flags.wasArranged = true;
					const startX = moveToAnimate.startPoint.rowAndColumn.col - 8;
					const startZ = moveToAnimate.startPoint.rowAndColumn.row - 8;

					tileGroup.position.set(startX, 0.05, startZ);
					tileGroup.scale.set(1.2, 1.2, 1.2);

					this.animateTileMovement(tileGroup,
						new THREE.Vector3(startX, 0.05, startZ),
						new THREE.Vector3(intermediateX, 0.05, intermediateZ),
						pieceAnimationLength,
						1.2, 1
					);
				} else if (moveToAnimate.isOrchidMove) {
					// Orchid doesn't cause any specific tile-level effect in Fire
				}
			} else if (moveToAnimate.moveType === PLANTING) {
				if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {
					if (piecePlaceAnimation === 1) {
						if (moveToAnimate.bonusEndPoint && moveToAnimate.endPoint.samesies(moveToAnimate.bonusEndPoint)) {
							// Boat played on tile that was planted, skip animating the usual placement
						} else {
							tileGroup.scale.set(2, 2, 2);
							this.animateTileScale(tileGroup, 2, 1, 500);
						}
					}
				} else if (isSamePoint(moveToAnimate.endPoint, x, y)) {
					// The endPoint of the Plant was moved by Boat or Wheel
					if (piecePlaceAnimation === 1) {
						tileGroup.scale.set(2, 2, 2);
						this.animateTileScale(tileGroup, 2, 1, 500);
					}
				}
			}
		}

		if ((x !== ox || y !== oy) && boardPoint.tile && boardPoint.tile.boosted) {
			flags.boostedOnThisTurn = true;
		}

		if ((x !== ox || y !== oy) && boardPoint.tile && boardPoint.tile.ethereal) {
			flags.etherealizedOnThisTurn = true;
		}

		if ((x !== ox || y !== oy) && flags.didBonusMove) {
			const startX = x - 8;
			const startZ = y - 8;
			const endX = ox - 8;
			const endZ = oy - 8;

			tileGroup.position.set(startX, 0.05, startZ);

			const delay = (1 - moveAnimationBeginStep) * pieceAnimationLength;
			setTimeout(() => {
				this.animateTileMovement(tileGroup,
					new THREE.Vector3(startX, 0.05, startZ),
					new THREE.Vector3(endX, 0.05, endZ),
					pieceAnimationLength
				);
			}, delay);
		}

		if (placedOnAccent) {
			this.setTileOpacity(tileGroup, 0);
			const delay = (1 - moveAnimationBeginStep) * pieceAnimationLength;
			setTimeout(() => {
				this.setTileOpacity(tileGroup, 1);
				if (piecePlaceAnimation === 1) {
					tileGroup.scale.set(2, 2, 2);
					this.animateTileScale(tileGroup, 2, 1, 500);
				}
			}, delay);
		}
	}

	// --- Visual Effects ---

	addHarmonyGlow(tile, x, z) {
		if (!tile.harmonyOwners || tile.harmonyOwners.length === 0) return;

		let glowColor;
		const hasHost = tile.harmonyOwners.includes("HOST");
		const hasGuest = tile.harmonyOwners.includes("GUEST");

		if (hasHost && hasGuest) {
			glowColor = COLOR_COMBINED_HARMONY;
		} else if (hasHost) {
			glowColor = COLOR_HOST_HARMONY;
		} else if (hasGuest) {
			glowColor = COLOR_GUEST_HARMONY;
		} else {
			return;
		}

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

	addBoostedIndicator(x, z) {
		// Golden ring around boosted tiles
		const ringGeo = new THREE.RingGeometry(0.44, 0.54, 32);
		ringGeo.rotateX(-Math.PI / 2);
		const ringMat = new THREE.MeshBasicMaterial({
			color: 0xFFCC44,
			transparent: true,
			opacity: 0.7,
			side: THREE.DoubleSide,
		});
		const ring = new THREE.Mesh(ringGeo, ringMat);
		ring.position.set(x, 0.17, z);
		this.effectsGroup.add(ring);
	}

	// --- Override clearGroup to protect shared geometries ---

	clearGroup(group) {
		while (group.children.length > 0) {
			const child = group.children[0];
			group.remove(child);
			if (child.geometry && child.geometry !== this.discGeometry
				&& child.geometry !== this.faceGeometry
				&& child.geometry !== this.harmonyRingGeometry
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

	// --- Override dispose to clean up shared geometries ---

	dispose() {
		this.harmonyRingGeometry.dispose();
		this.bhSphereGeometry.dispose();
		super.dispose();
	}
}
