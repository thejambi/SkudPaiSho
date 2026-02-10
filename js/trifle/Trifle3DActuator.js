// 3D Actuator for Trifle
// Extends PaiSho3DActuator with Trifle-specific game rendering
// Includes ability animation system (SLIDE, FADE_OUT, FADE_IN, POP, PULSE)

import * as THREE from 'three';
import { DEPLOY, MOVE, NotationPoint } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from '../skud-pai-sho/SkudPaiShoBoardPoint';
import {
	clearMessage,
	gameController,
	pieceAnimationLength,
	piecePlaceAnimation,
	showTileMessage,
	unplayedTileClicked,
} from '../PaiShoMain';
import { TrifleController } from './TrifleController';
import { TrifleTile } from './TrifleTile';
import { TrifleTileCodes } from './TrifleTiles';
import { getTilesForPlayer, isSamePoint } from '../ActuatorHelp';
import { PaiSho3DActuator } from '../PaiSho3DActuator';
import { TrifleAnimationType } from './animation/TrifleAnimationTypes';
import { currentTileMetadata } from './PaiShoGamesTileMetadata';
import {
	guestPlayerCode,
	hostPlayerCode,
} from '../pai-sho-common/PaiShoPlayerHelp';
import { HOST, GUEST } from '../CommonNotationObjects';
import { debug } from '../GameData';

export class Trifle3DActuator extends PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		super(gameContainer, isMobile, enableAnimations, {
			boardRotation: 45,
		});
	}

	// --- Abstract method implementations ---

	getHostTilesContainerDivs() {
		return TrifleController.getHostTilesContainerDivs();
	}

	getGuestTilesContainerDivs() {
		return TrifleController.getGuestTilesContainerDivs();
	}

	getTileImageSourceDir() {
		return "images/Trifle/chuji/";
	}

	// --- Override actuate to match Trifle's 4-param signature ---

	actuate(board, tileManager, markingManager, moveToAnimate) {
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

		// Tile piles
		this.renderTilePiles(tileManager);

		// Process ability animations after board is rendered
		if (moveToAnimate && moveToAnimate.animationInfo
				&& moveToAnimate.animationInfo.abilityAnimations) {
			this.processAbilityAnimations(moveToAnimate);
		}
	}

	// --- Tile Pile Rendering ---

	renderTilePiles(tileManager) {
		// Clear previous tile pile contents
		this.hostTilesContainer.innerHTML = this.getHostTilesContainerDivs();
		this.guestTilesContainer.innerHTML = this.getGuestTilesContainerDivs();

		// Team tiles (unplayed)
		if (tileManager.playersAreSelectingTeams() && !tileManager.hostTeamIsFull()
				|| !tileManager.playersAreSelectingTeams()) {
			tileManager.hostTiles.forEach((tile) => {
				this.addTilePileElement(tile, this.hostTilesContainer, true);
			});
		}
		if (tileManager.playersAreSelectingTeams() && !tileManager.guestTeamIsFull()
				|| !tileManager.playersAreSelectingTeams()) {
			tileManager.guestTiles.forEach((tile) => {
				this.addTilePileElement(tile, this.guestTilesContainer, true);
			});
		}

		// Team selection area — show available tiles for team building
		const savedTileId = TrifleTile.getTrifleTileId();
		if (!tileManager.hostTeamIsFull()) {
			this.addLineBreak(this.hostTilesContainer);
			this.addLineBreak(this.hostTilesContainer);
			Object.keys(TrifleTileCodes).forEach((key) => {
				if (currentTileMetadata[key] && currentTileMetadata[key].available) {
					this.addTilePileElement(
						new TrifleTile(TrifleTileCodes[key], hostPlayerCode),
						this.hostTilesContainer, true, true
					);
				}
			});
		} else if (!tileManager.guestTeamIsFull()) {
			this.addLineBreak(this.guestTilesContainer);
			this.addLineBreak(this.guestTilesContainer);
			Object.keys(TrifleTileCodes).forEach((key) => {
				if (currentTileMetadata[key] && currentTileMetadata[key].available) {
					this.addTilePileElement(
						new TrifleTile(TrifleTileCodes[key], guestPlayerCode),
						this.guestTilesContainer, true, true
					);
				}
			});
		}
		TrifleTile.resetTrifleTileId(savedTileId);

		// Captured tiles
		const hostCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, HOST);
		const guestCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, GUEST);

		if (hostCapturedTiles.length > 0) {
			this.addLineBreak(this.hostTilesContainer);
			var hostCapturedContainer = document.createElement("span");
			hostCapturedContainer.classList.add("tileLibrary");
			var capturedLabel = document.createElement("span");
			capturedLabel.innerText = "--Captured Tiles--";
			hostCapturedContainer.appendChild(capturedLabel);
			hostCapturedContainer.appendChild(document.createElement("br"));
			this.hostTilesContainer.appendChild(hostCapturedContainer);
			hostCapturedTiles.forEach((tile) => {
				this.addCapturedTilePileElement(tile, hostCapturedContainer);
			});
		}

		if (guestCapturedTiles.length > 0) {
			this.addLineBreak(this.guestTilesContainer);
			var guestCapturedContainer = document.createElement("span");
			guestCapturedContainer.classList.add("tileLibrary");
			var capturedLabel = document.createElement("span");
			capturedLabel.innerText = "--Captured Tiles--";
			guestCapturedContainer.appendChild(capturedLabel);
			guestCapturedContainer.appendChild(document.createElement("br"));
			this.guestTilesContainer.appendChild(guestCapturedContainer);
			guestCapturedTiles.forEach((tile) => {
				this.addCapturedTilePileElement(tile, guestCapturedContainer);
			});
		}
	}

	addLineBreak(container) {
		var theBr = document.createElement("br");
		theBr.classList.add("clear");
		container.appendChild(theBr);
	}

	addTilePileElement(tile, container, clickable, isForTeamSelection) {
		if (!tile) return;

		var theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (isForTeamSelection) {
			theDiv.classList.add("selectedFromPile");
		} else if (tile.selectedFromPile) {
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
				theDiv.addEventListener('click', function() {
					unplayedTileClicked(this);
					showTileMessage(this);
				});
			}
		} else if (gameController && gameController.clickToShowPointMessage) {
			if (clickable) {
				theDiv.addEventListener('click', () => {
					unplayedTileClicked(theDiv);
					var tileName = theDiv.getAttribute("name");
					if (gameController.lastClickedTileForMessage === tileName) {
						gameController.lastClickedTileForMessage = null;
						clearMessage();
					} else {
						gameController.lastClickedTileForMessage = tileName;
						showTileMessage(theDiv);
					}
				});
			}
		} else {
			if (clickable) {
				theDiv.addEventListener('click', function() { unplayedTileClicked(this); });
			}
			theDiv.addEventListener('mouseover', function() { showTileMessage(this); });
			theDiv.addEventListener('mouseout', clearMessage);
		}

		container.appendChild(theDiv);
	}

	addCapturedTilePileElement(tile, container) {
		if (!tile) return;

		var theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile || tile.tileIsSelectable) {
			theDiv.classList.add("selectedFromPile");
		}

		var theImg = document.createElement("img");
		theImg.src = this.getTileImageSourceDir() + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);

		theDiv.setAttribute("name", tile.getImageName());
		theDiv.setAttribute("id", tile.id);

		if (tile.tileIsSelectable) {
			if (this.mobile) {
				theDiv.addEventListener('click', function() {
					unplayedTileClicked(this);
					showTileMessage(this);
				});
			} else if (gameController && gameController.clickToShowPointMessage) {
				theDiv.addEventListener('click', () => {
					unplayedTileClicked(theDiv);
					showTileMessage(theDiv);
				});
			} else {
				theDiv.addEventListener('click', function() { unplayedTileClicked(this); });
				theDiv.addEventListener('mouseover', function() { showTileMessage(this); });
				theDiv.addEventListener('mouseout', clearMessage);
			}
		} else {
			if (!this.mobile) {
				theDiv.addEventListener('mouseover', function() { showTileMessage(this); });
				theDiv.addEventListener('mouseout', clearMessage);
			}
		}

		container.appendChild(theDiv);
	}

	// --- Board Point Rendering ---

	addBoardPoint3D(boardPoint, moveToAnimate) {
		if (boardPoint.isType(NON_PLAYABLE)) return;

		const x = boardPoint.col - this.gridOffset;
		const z = boardPoint.row - this.gridOffset;

		// Empty point indicators
		if (!boardPoint.hasTile() || boardPoint.occupiedByAbility) {
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
			tileId: tile.id,
		};

		// Gigantic tile scaling
		if (tile.isGigantic) {
			tileGroup.scale.set(2, 2, 2);
			tileGroup.position.y = 0.1;
		}

		// Pre-position tiles that have ability SLIDE animations at their startPoint
		// so they don't flash at the final position before the animation kicks in
		const abilitySlide = this.getAbilitySlideForTile(tile.id, moveToAnimate);
		if (abilitySlide && this.animationOn) {
			const slideStartX = abilitySlide.startPoint.col - this.gridOffset;
			const slideStartZ = abilitySlide.startPoint.row - this.gridOffset;
			tileGroup.position.set(slideStartX, 0.05, slideStartZ);
		}

		// Primary move animations
		if (moveToAnimate && this.animationOn) {
			this.handleTileAnimation(boardPoint, moveToAnimate, tileGroup);
		}

		this.tilesGroup.add(tileGroup);

		if (boardPoint.isType(MARKED)) {
			this.addMarkedIndicator(x, z);
		}
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			this.addPossibleMoveIndicator(x, z);
		}
	}

	// --- Primary Move Animation ---

	handleTileAnimation(boardPoint, moveToAnimate, tileGroup) {
		const x = boardPoint.col;
		const y = boardPoint.row;

		if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
			// Check if this tile has a pending ability SLIDE animation
			if (this.tileHasAbilitySlide(boardPoint.tile.id, moveToAnimate)) {
				return; // Let ability animation handle it
			}

			if (isSamePoint(moveToAnimate.endPoint, x, y)) {
				const moveStartPoint = new NotationPoint(moveToAnimate.startPoint);
				const startX = moveStartPoint.rowAndColumn.col - this.gridOffset;
				const startZ = moveStartPoint.rowAndColumn.row - this.gridOffset;
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
				if (piecePlaceAnimation === 1) {
					tileGroup.scale.set(2, 2, 2);
					this.animateTileScale(tileGroup, 2, 1, 500);
				}
			}
		}
	}

	tileHasAbilitySlide(tileId, moveToAnimate) {
		return !!this.getAbilitySlideForTile(tileId, moveToAnimate);
	}

	// Get the first ability SLIDE animation for a given tile, if any
	getAbilitySlideForTile(tileId, moveToAnimate) {
		if (!moveToAnimate || !moveToAnimate.animationInfo
				|| !moveToAnimate.animationInfo.abilityAnimations) {
			return null;
		}
		const abilityAnimations = moveToAnimate.animationInfo.abilityAnimations;
		if (!abilityAnimations.animations) return null;
		return abilityAnimations.animations.find(
			anim => anim.type === TrifleAnimationType.SLIDE && anim.tileId === tileId
		) || null;
	}

	// --- Ability Animation System ---

	processAbilityAnimations(moveToAnimate) {
		const animationSequence = moveToAnimate.animationInfo.abilityAnimations;
		if (!this.animationOn || !animationSequence || !animationSequence.hasAnimations()) {
			return;
		}

		// Create ghost meshes upfront for tiles no longer on the board
		// (e.g., captured tiles that need fade-out or slide animations)
		this.createGhostMeshes(animationSequence);

		animationSequence.sort();

		let currentDelay = pieceAnimationLength;
		let maxEndTime = currentDelay;

		animationSequence.animations.forEach((instruction, index) => {
			let startDelay;

			if (instruction.startsAtMoveTime) {
				// Execute immediately — tile was pre-positioned at startPoint during render
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

	// Pre-create ghost meshes for all animations targeting tiles not on the board
	createGhostMeshes(animationSequence) {
		const needsGhost = [
			TrifleAnimationType.SLIDE,
			TrifleAnimationType.FADE_OUT,
			TrifleAnimationType.PULSE
		];

		animationSequence.animations.forEach(instruction => {
			if (!needsGhost.includes(instruction.type)) return;

			// Check if tile mesh already exists on the board
			const existing = this.findTileMesh(instruction.tileId);
			if (existing) return;

			// Create ghost at startPoint
			if (!instruction.tile || !instruction.startPoint) {
				debug("Cannot create ghost mesh: missing tile or startPoint for " + instruction.type);
				return;
			}

			const x = instruction.startPoint.col - this.gridOffset;
			const z = instruction.startPoint.row - this.gridOffset;
			const srcPath = this.getTileImageSourceDir() + instruction.tile.getImageName() + ".png";
			const ghostGroup = this.buildTileMesh(srcPath, x, z);
			ghostGroup.userData = { tileId: instruction.tileId, isGhost: true };

			// startsAtMoveTime ghosts get the "lifted" scale like a normal move
			if (instruction.startsAtMoveTime) {
				ghostGroup.scale.set(1.2, 1.2, 1.2);
			}

			this.tilesGroup.add(ghostGroup);
			debug("Created ghost mesh for " + instruction.type + " tileId=" + instruction.tileId);
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

	// Find a tile's 3D mesh by tile ID (searches tilesGroup and nested children)
	findTileMesh(tileId) {
		if (!tileId) return null;
		for (const child of this.tilesGroup.children) {
			if (child.userData && child.userData.tileId === tileId) {
				return child;
			}
		}
		return null;
	}

	animateAbilitySlide(instruction) {
		const mesh = this.findTileMesh(instruction.tileId);
		if (!mesh) {
			debug("animateAbilitySlide: Could not find mesh for tileId=" + instruction.tileId);
			return;
		}

		const { startPoint, endPoint, duration } = instruction;
		const startX = startPoint.col - this.gridOffset;
		const startZ = startPoint.row - this.gridOffset;
		const endX = endPoint.col - this.gridOffset;
		const endZ = endPoint.row - this.gridOffset;

		// Position at start (may already be there from pre-positioning or ghost creation)
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

		// Start invisible, fade in
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

		// Scale up
		this.animateTileScale(mesh, 1, 1.3, halfDuration);

		// Add colored glow ring if color specified
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

		// Scale back down after half
		setTimeout(() => {
			this.animateTileScale(mesh, 1.3, 1, halfDuration);

			// Fade out glow ring
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
