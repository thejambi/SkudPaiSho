// 3D Actuator for Gini Pai Sho
// Extends PaiSho3DActuator with Gini-specific game rendering

import * as THREE from 'three';
import { MOVE, NotationPoint } from '../CommonNotationObjects';
import { HOST, GUEST } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	clearMessage,
	pieceAnimationLength,
	piecePlaceAnimation,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { GiniController } from './GiniController';
import { GiniOptions } from './GiniOptions';
import { getTilesForPlayer, isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';
import { TrifleAnimationType } from '../trifle/animation/TrifleAnimationTypes';
import { debug } from '../GameData';

export class Gini3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations, {
			boardRotation: GiniOptions.viewAsGuest ? 270 : 90,
		});
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return GiniController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return GiniController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		if (GiniController.isUsingCustomTileDesigns()) {
			return GiniController.getCustomTileDesignsUrl();
		} else {
			return "images/Ginseng/" + localStorage.getItem(GiniOptions.tileDesignTypeKey) + "/";
		}
	}

	// --- Game-specific rendering ---

	render3DGame(board, tileManager, markingManager, moveToAnimate, moveDetailsOrStep) {
		const moveDetails = (moveDetailsOrStep && typeof moveDetailsOrStep === 'object') ? moveDetailsOrStep : null;

		// Render all board cells
		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (cell) {
					if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)) {
						cell.addType(MARKED);
					} else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)) {
						cell.removeType(MARKED);
					}
					this.addBoardPoint3D(cell, moveToAnimate, moveDetails);
				}
			});
		});

		// Draw arrows
		for (const [_, arrow] of Object.entries(markingManager.arrows)) {
			this.addArrow3D(arrow[0], arrow[1]);
		}

		// Accent tiles in hand (HTML tile pile)
		this.renderAccentTiles(tileManager);

		// Captured tiles in HTML tile pile
		this.renderCapturedTiles(tileManager);

		// Win line indicators
		if (GiniOptions.showWinLines) {
			this.renderWinLines();
		}

		// Process ability animations after board is rendered
		if (moveToAnimate && moveToAnimate.animationInfo
				&& moveToAnimate.animationInfo.abilityAnimations) {
			this.processAbilityAnimations(moveToAnimate);
		}
	}

	// --- Accent Tiles Rendering ---

	renderAccentTiles(tileManager) {
		const hostAccentTiles = tileManager.hostAccentTiles;
		const guestAccentTiles = tileManager.guestAccentTiles;

		if (hostAccentTiles && hostAccentTiles.length > 0) {
			const container = document.createElement("span");
			container.classList.add("tileLibrary");
			const label = document.createElement("span");
			label.innerText = "--Accent Tiles--";
			container.appendChild(label);
			container.appendChild(document.createElement("br"));
			hostAccentTiles.forEach((tile) => {
				this.addUnplayedTile(tile, container);
			});
			this.hostTilesContainer.appendChild(container);
		}

		if (guestAccentTiles && guestAccentTiles.length > 0) {
			const container = document.createElement("span");
			container.classList.add("tileLibrary");
			const label = document.createElement("span");
			label.innerText = "--Accent Tiles--";
			container.appendChild(label);
			container.appendChild(document.createElement("br"));
			guestAccentTiles.forEach((tile) => {
				this.addUnplayedTile(tile, container);
			});
			this.guestTilesContainer.appendChild(container);
		}
	}

	addUnplayedTile(tile, container) {
		if (!tile) return;

		const theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile || tile.tileIsSelectable) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		const theImg = document.createElement("img");
		theImg.src = this.getTileImageSourceDir() + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", tile.getImageName());
		theDiv.setAttribute("id", tile.id);

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

	// --- Captured Tiles Rendering ---

	renderCapturedTiles(tileManager) {
		const hostCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, HOST);
		const guestCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, GUEST);

		if (hostCapturedTiles.length > 0) {
			const container = document.createElement("span");
			container.classList.add("tileLibrary");
			const label = document.createElement("span");
			label.innerText = "--Captured Tiles--";
			container.appendChild(label);
			container.appendChild(document.createElement("br"));
			hostCapturedTiles.forEach((tile) => {
				this.addCapturedTile(tile, container);
			});
			this.hostTilesContainer.appendChild(container);
		}

		if (guestCapturedTiles.length > 0) {
			const container = document.createElement("span");
			container.classList.add("tileLibrary");
			const label = document.createElement("span");
			label.innerText = "--Captured Tiles--";
			container.appendChild(label);
			container.appendChild(document.createElement("br"));
			guestCapturedTiles.forEach((tile) => {
				this.addCapturedTile(tile, container);
			});
			this.guestTilesContainer.appendChild(container);
		}
	}

	addCapturedTile(tile, container) {
		if (!tile) return;

		const theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile || tile.tileIsSelectable) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		const theImg = document.createElement("img");
		theImg.src = this.getTileImageSourceDir() + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", tile.getNotationName());
		theDiv.setAttribute("id", tile.id);

		if (tile.tileIsSelectable) {
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

		// During animation, show the moved tile (before abilities may have changed it)
		let displayTile = tile;
		const showMovedTileDuringAnimation = this.animationOn && moveDetails && moveDetails.movedTile
			&& moveToAnimate && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row);
		if (showMovedTileDuringAnimation) {
			displayTile = moveDetails.movedTile;
		}

		const srcPath = this.getTileImageSourceDir() + displayTile.getImageName() + ".png";
		const tileGroup = this.buildTileMesh(srcPath, x, z);
		tileGroup.userData = {
			row: boardPoint.row,
			col: boardPoint.col,
			isTile: true,
			tileId: tile.id,
		};

		// Pre-position tiles that have ability SLIDE animations at their startPoint
		const abilitySlide = this.getAbilitySlideForTile(tile.id, moveToAnimate);
		if (abilitySlide && this.animationOn) {
			const slideStartX = abilitySlide.startPoint.col - 8;
			const slideStartZ = abilitySlide.startPoint.row - 8;
			tileGroup.position.set(slideStartX, 0.05, slideStartZ);
			if (abilitySlide.startsAtMoveTime) {
				tileGroup.scale.set(1.2, 1.2, 1.2);
			}
		} else if (moveToAnimate && this.animationOn) {
			// Standard move/push animations
			this.handleTileAnimation(boardPoint, moveToAnimate, moveDetails, tileGroup);
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

		// Marked point with tile
		if (boardPoint.isType(MARKED)) {
			this.addMarkedIndicator(x, z);
		}

		// Possible move with tile (selectable target for ability prompt)
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.addSelectableTileHighlight(x, z);
		}

		// Captured tile overlay during animation
		const capturedTile = this.getCapturedTileForPoint(moveDetails, moveToAnimate, boardPoint);
		if (capturedTile) {
			const capturedSrcPath = this.getTileImageSourceDir() + capturedTile.getImageName() + ".png";
			const capturedGroup = this.buildTileMesh(capturedSrcPath, x, z);
			capturedGroup.position.y = 0.01;
			this.tilesGroup.add(capturedGroup);

			setTimeout(() => {
				this.animateTileFadeOut(capturedGroup, 300);
			}, pieceAnimationLength);
		}
	}

	getCapturedTileForPoint(moveDetails, moveToAnimate, boardPoint) {
		if (!this.animationOn || !moveToAnimate || !moveDetails) return null;
		if (!moveDetails.capturedTiles || moveDetails.capturedTiles.length === 0) return null;
		if (!isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) return null;

		if (moveDetails.capturedTiles.length === 1) {
			return moveDetails.capturedTiles[0];
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

	// --- Win Line Rendering ---

	renderWinLines() {
		// Host win line at col 5 (x = -3), Guest win line at col 11 (x = 3)
		// Adjustable values:
		const hostX = 5 - 8; // -3
		const guestX = 11 - 8; // 3
		const lineLength = 8; // length of the line (in grid units)
		const lineZ = 0; // z-center of the line

		// Host win line - subtle blue
		const hostGeo = new THREE.PlaneGeometry(0.08, lineLength);
		hostGeo.rotateX(-Math.PI / 2);
		const hostMat = new THREE.MeshBasicMaterial({
			color: 0x4444DD,
			transparent: true,
			opacity: 0.35,
			side: THREE.DoubleSide,
		});
		const hostLine = new THREE.Mesh(hostGeo, hostMat);
		hostLine.position.set(hostX, 0.02, lineZ);
		this.effectsGroup.add(hostLine);

		// Guest win line - subtle red
		const guestGeo = new THREE.PlaneGeometry(0.08, lineLength);
		guestGeo.rotateX(-Math.PI / 2);
		const guestMat = new THREE.MeshBasicMaterial({
			color: 0xDD4444,
			transparent: true,
			opacity: 0.35,
			side: THREE.DoubleSide,
		});
		const guestLine = new THREE.Mesh(guestGeo, guestMat);
		guestLine.position.set(guestX, 0.02, lineZ);
		this.effectsGroup.add(guestLine);
	}

	// --- Animation Handling ---

	handleTileAnimation(boardPoint, moveToAnimate, moveDetails, tileGroup) {
		const x = boardPoint.col;
		const y = boardPoint.row;

		if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
			if (isSamePoint(moveToAnimate.endPoint, x, y)) {
				// Tile was moved here - animate from start position
				const startPoint = new NotationPoint(moveToAnimate.startPoint);
				const startX = startPoint.rowAndColumn.col - 8;
				const startZ = startPoint.rowAndColumn.row - 8;
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
			} else {
				// Check if this tile was pushed by an ability
				this.handlePushedTileAnimation(boardPoint, moveToAnimate, tileGroup);
			}
		}
	}

	handlePushedTileAnimation(boardPoint, moveToAnimate, tileGroup) {
		if (!moveToAnimate.promptTargetData) return;

		const x = boardPoint.col;
		const y = boardPoint.row;

		Object.keys(moveToAnimate.promptTargetData).forEach((key) => {
			const promptDataEntry = moveToAnimate.promptTargetData[key];
			if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
				if (isSamePoint(promptDataEntry.movedTileDestinationPoint.pointText, x, y)) {
					const moveStartPoint = promptDataEntry.movedTilePoint;
					const startX = moveStartPoint.rowAndColumn.col - 8;
					const startZ = moveStartPoint.rowAndColumn.row - 8;
					const endX = x - 8;
					const endZ = y - 8;

					// Delay push animation until after the main move
					tileGroup.position.set(startX, 0.05, startZ);

					setTimeout(() => {
						tileGroup.scale.set(1.2, 1.2, 1.2);
						this.animateTileMovement(tileGroup,
							new THREE.Vector3(startX, 0.05, startZ),
							new THREE.Vector3(endX, 0.05, endZ),
							pieceAnimationLength / 1.2,
							1.2, 1
						);
					}, pieceAnimationLength / 1.2);
				}
			}
		});
	}

	// --- Ability Animation System ---

	getAbilitySlideForTile(tileId, moveToAnimate) {
		if (!moveToAnimate || !moveToAnimate.animationInfo
				|| !moveToAnimate.animationInfo.abilityAnimations) {
			return null;
		}
		const animations = moveToAnimate.animationInfo.abilityAnimations.animations;
		if (!animations) return null;

		return animations.find(
			anim => anim.type === TrifleAnimationType.SLIDE && anim.tileId === tileId
		) || null;
	}

	findTileMesh(tileId) {
		if (!tileId) return null;
		for (const child of this.tilesGroup.children) {
			if (child.userData && child.userData.tileId === tileId) {
				return child;
			}
		}
		return null;
	}

	createGhostMeshes(animationSequence) {
		const needsGhost = [
			TrifleAnimationType.SLIDE,
			TrifleAnimationType.FADE_OUT,
			TrifleAnimationType.PULSE
		];

		animationSequence.animations.forEach(instruction => {
			if (!needsGhost.includes(instruction.type)) return;

			const existing = this.findTileMesh(instruction.tileId);
			if (existing) return;

			if (!instruction.tile || !instruction.startPoint) {
				debug("Cannot create ghost mesh: missing tile or startPoint for " + instruction.type);
				return;
			}

			const x = instruction.startPoint.col - 8;
			const z = instruction.startPoint.row - 8;
			const srcPath = this.getTileImageSourceDir() + instruction.tile.getImageName() + ".png";
			const ghostGroup = this.buildTileMesh(srcPath, x, z);
			ghostGroup.userData = { tileId: instruction.tileId, isGhost: true };

			if (instruction.startsAtMoveTime) {
				ghostGroup.scale.set(1.2, 1.2, 1.2);
			}

			this.tilesGroup.add(ghostGroup);
		});
	}

	processAbilityAnimations(moveToAnimate) {
		const animationSequence = moveToAnimate.animationInfo.abilityAnimations;
		if (!this.animationOn || !animationSequence || !animationSequence.hasAnimations()) {
			return;
		}

		this.createGhostMeshes(animationSequence);

		animationSequence.sort();

		let currentDelay = pieceAnimationLength;
		let maxEndTime = currentDelay;

		animationSequence.animations.forEach((instruction, index) => {
			let startDelay;

			if (instruction.startsAtMoveTime) {
				this.executeAnimation3D(instruction);
				const endTime = instruction.duration;
				maxEndTime = Math.max(maxEndTime, endTime);
				return;
			} else if (instruction.parallel && index > 0) {
				startDelay = currentDelay - instruction.duration / 2;
			} else {
				startDelay = currentDelay;
			}

			const endTime = startDelay + instruction.delay + instruction.duration;
			maxEndTime = Math.max(maxEndTime, endTime);

			setTimeout(() => {
				this.executeAnimation3D(instruction);
			}, startDelay + instruction.delay);

			if (!instruction.parallel) {
				currentDelay = startDelay + instruction.delay + instruction.duration;
			}
		});
	}

	executeAnimation3D(instruction) {
		switch (instruction.type) {
			case TrifleAnimationType.SLIDE:
				this.animateAbilitySlide(instruction);
				break;
			case TrifleAnimationType.FADE_OUT:
				this.animateAbilityFadeOut(instruction);
				break;
			case TrifleAnimationType.FADE_IN:
				this.animateAbilityFadeIn(instruction);
				break;
			case TrifleAnimationType.POP:
				this.animateAbilityPop(instruction);
				break;
			case TrifleAnimationType.PULSE:
				this.animateAbilityPulse(instruction);
				break;
			default:
				debug("Unknown 3D animation type: " + instruction.type);
		}
	}

	animateAbilitySlide(instruction) {
		const mesh = this.findTileMesh(instruction.tileId);
		if (!mesh) {
			debug("animateAbilitySlide: Could not find mesh for tileId=" + instruction.tileId);
			return;
		}

		const { startPoint, endPoint, duration } = instruction;
		const startX = startPoint.col - 8;
		const startZ = startPoint.row - 8;
		const endX = endPoint.col - 8;
		const endZ = endPoint.row - 8;

		mesh.position.set(startX, 0.05, startZ);
		const startScale = instruction.startsAtMoveTime ? 1.2 : 1;

		this.animateTileMovement(mesh,
			new THREE.Vector3(startX, 0.05, startZ),
			new THREE.Vector3(endX, 0.05, endZ),
			duration,
			startScale, 1
		);
	}

	animateAbilityFadeOut(instruction) {
		const mesh = this.findTileMesh(instruction.tileId);
		if (!mesh) {
			debug("animateAbilityFadeOut: Could not find mesh for tileId=" + instruction.tileId);
			return;
		}

		this.animateTileFadeOut(mesh, instruction.duration);
	}

	animateAbilityFadeIn(instruction) {
		const mesh = this.findTileMesh(instruction.tileId);
		if (!mesh) {
			debug("animateAbilityFadeIn: Could not find mesh for tileId=" + instruction.tileId);
			return;
		}

		this.setTileOpacity(mesh, 0);
		const startTime = performance.now();
		const duration = instruction.duration;

		const animate = () => {
			const elapsed = performance.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			this.setTileOpacity(mesh, progress);
			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		};
		requestAnimationFrame(animate);
	}

	animateAbilityPop(instruction) {
		const mesh = this.findTileMesh(instruction.tileId);
		if (!mesh) {
			debug("animateAbilityPop: Could not find mesh for tileId=" + instruction.tileId);
			return;
		}

		mesh.scale.set(0, 0, 0);
		this.animateTileScale(mesh, 0, 1, instruction.duration);
	}

	animateAbilityPulse(instruction) {
		const mesh = this.findTileMesh(instruction.tileId);
		if (!mesh) {
			debug("animateAbilityPulse: Could not find mesh for tileId=" + instruction.tileId);
			return;
		}

		const duration = instruction.duration;
		const halfDuration = duration / 2;

		this.animateTileScale(mesh, 1, 1.3, halfDuration);

		let glowRing = null;
		if (instruction.color) {
			const color = new THREE.Color(instruction.color);
			const ringGeo = new THREE.TorusGeometry(0.5, 0.04, 8, 32);
			ringGeo.rotateX(Math.PI / 2);
			const ringMat = new THREE.MeshBasicMaterial({
				color: color,
				transparent: true,
				opacity: 0.8,
			});
			glowRing = new THREE.Mesh(ringGeo, ringMat);
			glowRing.position.copy(mesh.position);
			glowRing.position.y = 0.1;
			this.effectsGroup.add(glowRing);
		}

		setTimeout(() => {
			this.animateTileScale(mesh, 1.3, 1, halfDuration);

			if (glowRing) {
				const startTime = performance.now();
				const fadeAnimate = () => {
					const elapsed = performance.now() - startTime;
					const progress = Math.min(elapsed / halfDuration, 1);
					glowRing.material.opacity = 0.8 * (1 - progress);
					if (progress < 1) {
						requestAnimationFrame(fadeAnimate);
					} else {
						this.effectsGroup.remove(glowRing);
						glowRing.geometry.dispose();
						glowRing.material.dispose();
					}
				};
				requestAnimationFrame(fadeAnimate);
			}
		}, halfDuration);
	}
}
