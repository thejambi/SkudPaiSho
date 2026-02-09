// 3D Actuator for Skud Pai Sho
// Uses Three.js to render the board in WebGL with OrbitControls

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ACCENT_TILE } from '../GameData';
import { ARRANGING, PLANTING, RowAndColumn } from '../CommonNotationObjects';
import { MARKED, NON_PLAYABLE, POSSIBLE_MOVE } from './SkudPaiShoBoardPoint';
import { NO_HARMONY_VISUAL_AIDS, gameOptionEnabled } from '../GameOptions';
import {
	RmbDown,
	RmbUp,
	clearMessage,
	getUserGamePreference,
	pieceAnimationLength,
	piecePlaceAnimation,
	pointClicked,
	showPointMessage,
	showTileMessage,
	unplayedTileClicked,
	paiShoBoardKey,
	svgBoardDesigns,
	customBoardUrlArrayKey,
	customBoardUrlKey,
} from '../PaiShoMain';
import { SkudPaiShoController } from './SkudPaiShoController';
import { SkudPaiShoTileManager } from './SkudPaiShoTileManager';
import { getSkudTilesSrcPath, isSamePoint } from '../ActuatorHelp';
import { getRoundBoardPreference } from './SkudPaiShoOptions';

// Colors matching 2D CSS
const COLOR_HOST_HARMONY = 0x66CCCC;
const COLOR_GUEST_HARMONY = 0x8877FF;
const COLOR_COMBINED_HARMONY = 0x77A2E6;
const COLOR_POSSIBLE_MOVE = 0x442211;
const COLOR_SELECTED = 0xCC66CC;
const COLOR_MARKED = 0xFFAA00;
const COLOR_ARROW = 0xFFAA00;
const COLOR_DISC_EDGE = 0x8B7355;

// Board point type colors for small dot indicators on empty points
const COLOR_RED_POINT = 0xCC3333;
const COLOR_WHITE_POINT = 0xCCCCCC;
const COLOR_NEUTRAL_POINT = 0x888888;
const COLOR_GATE_POINT = 0xDDDD44;

export class SkudPaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations) {
		this.gameContainer = gameContainer;
		this.mobile = isMobile;
		this.animationOn = enableAnimations;

		// Three.js core
		this.scene = new THREE.Scene();
		this.updateSceneBackground();

		// Camera
		this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
		this.camera.position.set(0, 20, 13);
		this.camera.lookAt(0, 0, 0);

		// Renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.maxCanvasSize = 800;
		const size = Math.min(this.maxCanvasSize, window.innerWidth);
		this.renderer.setSize(size, size);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// Build DOM structure
		this.setupContainers();

		// OrbitControls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.08;
		this.controls.maxPolarAngle = Math.PI / 2.1;
		this.controls.minDistance = 5;
		this.controls.maxDistance = 40;
		this.controls.target.set(0, -1, 0);
		// Disable right-click panning (reserved for arrow marking)
		this.controls.mouseButtons = {
			LEFT: THREE.MOUSE.ROTATE,
			MIDDLE: THREE.MOUSE.PAN,
			RIGHT: null
		};

		// Lights
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
		this.scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
		directionalLight.position.set(5, 10, 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 1024;
		directionalLight.shadow.mapSize.height = 1024;
		directionalLight.shadow.camera.near = 0.5;
		directionalLight.shadow.camera.far = 50;
		directionalLight.shadow.camera.left = -12;
		directionalLight.shadow.camera.right = 12;
		directionalLight.shadow.camera.top = 12;
		directionalLight.shadow.camera.bottom = -12;
		this.scene.add(directionalLight);

		// Raycaster
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		// Texture cache
		this.textureLoader = new THREE.TextureLoader();
		this.textureCache = {};

		// Scene groups
		this.boardGroup = new THREE.Group();
		this.clickTargetsGroup = new THREE.Group();
		this.tilesGroup = new THREE.Group();
		this.effectsGroup = new THREE.Group();
		this.arrowsGroup = new THREE.Group();
		this.scene.add(this.boardGroup);
		this.scene.add(this.clickTargetsGroup);
		this.scene.add(this.tilesGroup);
		this.scene.add(this.effectsGroup);
		this.scene.add(this.arrowsGroup);

		// Shared geometries (reused across actuate calls)
		this.discGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.24, 32);
		this.faceGeometry = new THREE.CircleGeometry(0.40, 32);
		this.harmonyRingGeometry = new THREE.RingGeometry(0.42, 0.52, 32);
		this.possibleMoveRingGeometry = new THREE.RingGeometry(0.20, 0.35, 16);
		this.markedRingGeometry = new THREE.RingGeometry(0.30, 0.42, 16);
		this.bhSphereGeometry = new THREE.SphereGeometry(0.06, 8, 8);
		this.pointDotGeometry = new THREE.SphereGeometry(0.04, 8, 8);
		this.clickPlaneGeometry = new THREE.PlaneGeometry(0.9, 0.9);

		// Active animations
		this.activeAnimations = [];

		// Round board auto-detection cache (url -> boolean)
		this.roundBoardCache = {};
		this.detectedRoundBoard = true; // default to round

		// Build static board surface
		this.buildBoardSurface();

		// Event listeners
		this.setupEventListeners();

		// Render loop
		this.animationFrameId = null;
		this.startRenderLoop();
	}

	setAnimationOn(isOn) {
		this.animationOn = isOn;
	}

	shouldUseRoundBoard() {
		const pref = getRoundBoardPreference();
		if (pref === "true") return true;
		if (pref === "false") return false;
		// Auto mode: check cache for current board URL
		const url = this.getBoardImageUrl();
		if (this.roundBoardCache && this.roundBoardCache[url] !== undefined) {
			return this.roundBoardCache[url];
		}
		// Not yet detected, default to round
		return true;
	}

	detectImageRoundness(image) {
		try {
			const canvas = document.createElement('canvas');
			const size = Math.min(image.width, image.height);
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(image, 0, 0, size, size);

			const margin = Math.max(2, Math.floor(size * 0.02));
			const corners = [
				[margin, margin],
				[size - 1 - margin, margin],
				[margin, size - 1 - margin],
				[size - 1 - margin, size - 1 - margin]
			];

			let transparentCorners = 0;
			for (const [x, y] of corners) {
				const pixel = ctx.getImageData(x, y, 1, 1).data;
				if (pixel[3] < 128) transparentCorners++;
			}

			return transparentCorners >= 3;
		} catch (e) {
			// CORS or other error - default to round
			return true;
		}
	}

	onBoardTextureLoaded(image) {
		if (getRoundBoardPreference() !== null) return; // Manual override, skip
		if (this.roundBoardCache[this.currentBoardUrl] !== undefined) return; // Already cached

		const isRound = this.detectImageRoundness(image);
		this.roundBoardCache[this.currentBoardUrl] = isRound;
		this.detectedRoundBoard = isRound;

		if (isRound !== this.currentRoundBoard) {
			this.clearGroup(this.boardGroup);
			this.buildBoardSurface();
		}
	}

	updateSceneBackground() {
		const bgColor = getComputedStyle(document.body).backgroundColor;
		this.scene.background = new THREE.Color(bgColor || '#1a1a2e');
	}

	// --- Container Setup ---

	setupContainers() {
		// Clear game container
		while (this.gameContainer.firstChild) {
			this.gameContainer.removeChild(this.gameContainer.firstChild);
		}

		// Widen page content area to accommodate larger 3D board
		const mainWrapper = document.getElementById('mainWrapper');
		if (mainWrapper) {
			this.originalMaxWidth = mainWrapper.style.maxWidth;
			mainWrapper.style.maxWidth = '1400px';
		}

		// Board container with canvas (override CSS width for larger 3D view)
		const bcontainer = document.createElement('div');
		bcontainer.classList.add('board-container');
		const canvasSize = Math.min(this.maxCanvasSize, window.innerWidth) + 'px';
		bcontainer.style.width = canvasSize;

		const canvasWrapper = document.createElement('div');
		canvasWrapper.classList.add('svgContainerContainer');
		canvasWrapper.style.position = 'relative';
		canvasWrapper.style.width = canvasSize;
		canvasWrapper.style.boxShadow = 'inset 0 0 12px rgba(0,0,0,0.5)';
		canvasWrapper.style.borderRadius = '4px';
		canvasWrapper.style.overflow = 'hidden';
		this.renderer.domElement.style.display = 'block';
		canvasWrapper.appendChild(this.renderer.domElement);
		bcontainer.appendChild(canvasWrapper);

		// Tile pile container (same structure as 2D)
		const tilePileContainer = document.createElement('div');
		tilePileContainer.classList.add('tilePileContainer', 'PaiSho');

		const response = document.createElement('div');
		response.id = 'response';
		const gameMessage = document.createElement('div');
		gameMessage.classList.add('gameMessage');

		this.hostTilesContainer = document.createElement('div');
		this.hostTilesContainer.classList.add('hostTilesContainer', 'tileContainer');
		this.hostTilesContainer.id = 'hostTilesContainer';
		this.hostTilesContainer.innerHTML = SkudPaiShoController.getHostTilesContainerDivs();

		this.guestTilesContainer = document.createElement('div');
		this.guestTilesContainer.classList.add('guestTilesContainer', 'tileContainer');
		this.guestTilesContainer.id = 'guestTilesContainer';
		this.guestTilesContainer.innerHTML = SkudPaiShoController.getGuestTilesContainerDivs();

		const gameMessage2 = document.createElement('div');
		gameMessage2.classList.add('gameMessage2');

		tilePileContainer.appendChild(response);
		tilePileContainer.appendChild(gameMessage);
		tilePileContainer.appendChild(this.hostTilesContainer);
		tilePileContainer.appendChild(this.guestTilesContainer);
		tilePileContainer.appendChild(gameMessage2);

		this.gameContainer.appendChild(bcontainer);
		this.gameContainer.appendChild(tilePileContainer);
	}

	// --- Board Surface ---

	getBoardImageUrl() {
		let boardKeyToUse = paiShoBoardKey;
		let extension = ".png";
		if (svgBoardDesigns.includes(boardKeyToUse)) {
			extension = ".svg";
		}
		let boardUrl = "style/board_" + boardKeyToUse + extension;

		if (boardKeyToUse.includes("customBoard")) {
			const customBoardArray = JSON.parse(localStorage.getItem(customBoardUrlArrayKey));
			if (customBoardArray && customBoardArray.length) {
				for (let i = 0; i < customBoardArray.length; i++) {
					if (customBoardArray[i].name.replace(/ /g, '_') === boardKeyToUse.substring(11)) {
						boardUrl = customBoardArray[i].url;
					}
				}
			}
		}

		const customBoardUrl = localStorage.getItem(customBoardUrlKey);
		if (boardKeyToUse === 'applycustomboard' && customBoardUrl) {
			boardUrl = customBoardUrl;
		}

		return boardUrl;
	}

	buildBoardSurface() {
		// Board as a thick slab with the texture on top.
		// The 2D board image has 17px padding on each side (= 0.5 cell widths).
		// The tile grid is 17 cells of 34px each = 578px, inside a 612px image.
		// So the board must be 18 units (17 cells + 0.5 padding each side)
		// to match the texture's grid alignment.
		const boardSize = 18;
		const boardThickness = 0.5;
		const roundBoard = this.shouldUseRoundBoard();
		this.currentRoundBoard = roundBoard;

		this.currentBoardUrl = this.getBoardImageUrl();
		const boardTexture = this.textureLoader.load(this.currentBoardUrl, (texture) => {
			this.onBoardTextureLoaded(texture.image);
		});
		boardTexture.colorSpace = THREE.SRGBColorSpace;

		// CylinderGeometry top cap UVs map (u→Z, v→X) while BoxGeometry
		// top face maps (u→X, v→-Z). Rotate texture -90° to compensate.
		if (roundBoard) {
			boardTexture.center.set(0.5, 0.5);
			boardTexture.rotation = -Math.PI / 2;
		}

		// Top face: board image. Sides/bottom: solid color.
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

		let boardGeometry;
		let materials;

		if (roundBoard) {
			// CylinderGeometry material order: [side, top, bottom]
			const radius = boardSize / 2;
			boardGeometry = new THREE.CylinderGeometry(radius, radius, boardThickness, 64);
			materials = [sideMaterial, this.boardTopMaterial, sideMaterial];
		} else {
			// BoxGeometry face order: +x, -x, +y (top), -y (bottom), +z, -z
			boardGeometry = new THREE.BoxGeometry(boardSize, boardThickness, boardSize);
			materials = [
				sideMaterial, sideMaterial,
				this.boardTopMaterial, sideMaterial,
				sideMaterial, sideMaterial,
			];
		}

		this.boardMesh = new THREE.Mesh(boardGeometry, materials);
		// Position so the top face is at y = 0.01 (same as before)
		this.boardMesh.position.y = 0.01 - boardThickness / 2;
		this.boardMesh.receiveShadow = true;
		this.boardGroup.add(this.boardMesh);

		// "Table" surface just below the board top — visible through transparent
		// areas of the board image. Color syncs with the page background.
		let tableGeo;
		if (roundBoard) {
			tableGeo = new THREE.CircleGeometry(boardSize / 2, 64);
			tableGeo.rotateX(-Math.PI / 2);
		} else {
			tableGeo = new THREE.PlaneGeometry(boardSize, boardSize);
			tableGeo.rotateX(-Math.PI / 2);
		}
		this.tableMaterial = new THREE.MeshStandardMaterial({
			color: 0x5C4033,
			roughness: 0.8,
		});
		this.tableMesh = new THREE.Mesh(tableGeo, this.tableMaterial);
		this.tableMesh.position.y = 0.009; // just under board top face
		this.boardGroup.add(this.tableMesh);
	}

	buildClickTargets(board) {
		this.clearGroup(this.clickTargetsGroup);
		this.clickTargetMeshes = {};

		board.cells.forEach((column) => {
			column.forEach((cell) => {
				if (!cell || cell.isType(NON_PLAYABLE)) return;

				const clickGeo = this.clickPlaneGeometry.clone();
				clickGeo.rotateX(-Math.PI / 2);
				const clickMat = new THREE.MeshBasicMaterial({
					visible: false,
				});
				const clickMesh = new THREE.Mesh(clickGeo, clickMat);
				clickMesh.position.set(cell.col - 8, 0.01, cell.row - 8);
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

	// --- Texture Management ---

	getTexture(path) {
		if (!this.textureCache[path]) {
			this.textureCache[path] = this.textureLoader.load(path);
			this.textureCache[path].colorSpace = THREE.SRGBColorSpace;
		}
		return this.textureCache[path];
	}

	// --- Main Actuate ---

	actuate(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		if (!moveAnimationBeginStep) {
			moveAnimationBeginStep = 0;
		}

		window.requestAnimationFrame(() => {
			this.render3D(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep);
		});
	}

	render3D(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		// Sync scene background with page background
		this.updateSceneBackground();

		// Rebuild board if round preference or board design changed
		const newRoundBoard = this.shouldUseRoundBoard();
		const newBoardUrl = this.getBoardImageUrl();
		if (newRoundBoard !== this.currentRoundBoard || newBoardUrl !== this.currentBoardUrl) {
			this.clearGroup(this.boardGroup);
			this.buildBoardSurface();
		}

		// Clear dynamic groups
		this.clearGroup(this.tilesGroup);
		this.clearGroup(this.effectsGroup);
		this.clearGroup(this.arrowsGroup);
		this.activeAnimations = [];

		// Build click targets (only once, or when board changes)
		if (!this.clickTargetsBuilt) {
			this.buildClickTargets(board);
			this.clickTargetsBuilt = true;
		}

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
					// Handle markings
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

		// Tile piles (reuse 2D HTML approach)
		const fullTileSet = new SkudPaiShoTileManager(true);
		fullTileSet.hostTiles.forEach((tile) => this.clearTileContainer(tile));
		fullTileSet.guestTiles.forEach((tile) => this.clearTileContainer(tile));
		tileManager.hostTiles.forEach((tile) => this.addTile(tile, this.hostTilesContainer));
		tileManager.guestTiles.forEach((tile) => this.addTile(tile, this.guestTilesContainer));
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
			// Marked point indicator
			if (boardPoint.isType(MARKED)) {
				this.addMarkedIndicator(x, z);
			}

			// Possible move indicator
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				this.addPossibleMoveIndicator(x, z);
			} else if (boardPoint.betweenHarmony
				&& !gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)
				&& getUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey) !== "true") {
				// Between-harmony dot indicators
				this.addBetweenHarmonyIndicator(boardPoint, x, z);
			}
			return;
		}

		// Handle tile on this point
		if (isAnimationPointOfBoatRemovingAccentTile) {
			if (!this.animationOn) return; // No tile here when not animating

			// Boat removing accent tile animation:
			// 1. Show removed accent tile (t=0 to t=1s)
			// 2. Swap to boat image, scale 2x->1x (t=1s to t=2s)
			// 3. Fade out the boat (t=2s to t=3s)
			const tileRemovedWithBoat = moveToAnimate.tileRemovedWithBoat;
			if (tileRemovedWithBoat) {
				// Show the removed accent tile
				const removedSrcPath = getSkudTilesSrcPath() + tileRemovedWithBoat.getImageName() + ".png";
				const removedTileGroup = this.buildTileMesh(removedSrcPath, x, z);
				this.tilesGroup.add(removedTileGroup);

				const step1Delay = (1 - moveAnimationBeginStep) * pieceAnimationLength;
				setTimeout(() => {
					// Fade out the removed accent tile
					this.animateTileFadeOut(removedTileGroup, 300);

					// Show the boat tile appearing
					if (moveToAnimate.accentTileUsed) {
						const boatSrcPath = getSkudTilesSrcPath() + moveToAnimate.accentTileUsed.getImageName() + ".png";
						const boatTileGroup = this.buildTileMesh(boatSrcPath, x, z);
						boatTileGroup.scale.set(2, 2, 2);
						this.tilesGroup.add(boatTileGroup);

						// Scale boat down
						this.animateTileScale(boatTileGroup, 2, 1, pieceAnimationLength);

						// Then fade out the boat
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
			const srcPath = getSkudTilesSrcPath() + tile.getImageName() + ".png";
			const tileGroup = this.buildTileMesh(srcPath, x, z);
			tileGroup.userData = {
				row: boardPoint.row,
				col: boardPoint.col,
				isTile: true,
			};

			// Animation flags
			const flags = {
				drainedOnThisTurn: false,
				wasArranged: false,
				didBonusMove: false,
			};

			// Handle animations
			if (moveToAnimate && this.animationOn) {
				this.handleTileAnimation(boardPoint, moveToAnimate, moveAnimationBeginStep, tileGroup, flags);
			}

			this.tilesGroup.add(tileGroup);

			// Harmony glow
			if (tile.harmonyOwners
				&& !gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)
				&& getUserGamePreference(SkudPaiShoController.hideHarmonyAidsKey) !== "true") {
				if (this.animationOn && (flags.didBonusMove || flags.wasArranged)) {
					const delay = ((flags.didBonusMove ? 2 : 1) - moveAnimationBeginStep) * pieceAnimationLength;
					setTimeout(() => {
						this.addHarmonyGlow(tile, x, z);
					}, delay);
				} else {
					this.addHarmonyGlow(tile, x, z);
				}
			}

			// Drained/trapped
			if (tile.drained || tile.trapped) {
				if (flags.drainedOnThisTurn) {
					setTimeout(() => {
						this.setTileOpacity(tileGroup, 0.5);
					}, pieceAnimationLength);
				} else {
					this.setTileOpacity(tileGroup, 0.5);
				}
			}

			// Marked point
			if (boardPoint.isType(MARKED)) {
				this.addMarkedIndicator(x, z);
			}

			// Possible move with tile (shouldn't usually happen but handle it)
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				this.addPossibleMoveIndicator(x, z);
			}

			// Captured tile overlay during animation
			if (this.animationOn && moveToAnimate && moveToAnimate.capturedTile
				&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)
				&& moveAnimationBeginStep === 0) {
				const capturedSrcPath = getSkudTilesSrcPath() + moveToAnimate.capturedTile.getImageName() + ".png";
				const capturedGroup = this.buildTileMesh(capturedSrcPath, x, z);
				capturedGroup.position.y = 0.01; // Below the capturing tile
				this.tilesGroup.add(capturedGroup);

				setTimeout(() => {
					this.animateTileFadeOut(capturedGroup, 300);
				}, pieceAnimationLength);
			}
		}
	}

	// --- Tile Mesh Building ---

	buildTileMesh(srcPath, x, z) {
		const group = new THREE.Group();

		// Disc body
		const discMat = new THREE.MeshStandardMaterial({
			color: COLOR_DISC_EDGE,
			roughness: 0.6,
		});
		const disc = new THREE.Mesh(this.discGeometry, discMat);
		disc.castShadow = true;
		group.add(disc);

		// Texture face on top
		const texture = this.getTexture(srcPath);
		const faceGeo = this.faceGeometry.clone();
		faceGeo.rotateX(-Math.PI / 2);
		const faceMat = new THREE.MeshStandardMaterial({
			map: texture,
			roughness: 0.3,
			transparent: true,
		});
		const face = new THREE.Mesh(faceGeo, faceMat);
		face.position.y = 0.121;
		group.add(face);

		group.position.set(x, 0.05, z);

		return group;
	}

	// --- Animation Handling ---

	handleTileAnimation(boardPoint, moveToAnimate, moveAnimationBeginStep, tileGroup, flags) {
		let x = boardPoint.col, y = boardPoint.row;
		const ox = x, oy = y;
		let placedOnAccent = false;

		// Bonus move handling
		if (moveToAnimate.hasHarmonyBonus()) {
			if (isSamePoint(moveToAnimate.bonusEndPoint, ox, oy)) {
				placedOnAccent = true;

				if (moveToAnimate.bonusTileCode === "B" && moveToAnimate.boatBonusPoint
					&& isSamePoint(moveToAnimate.bonusEndPoint, ox, oy)) {
					// Boat moving a flower - show boat above
					tileGroup.position.y = 0.12;
				}
			} else if (moveToAnimate.boatBonusPoint && isSamePoint(moveToAnimate.boatBonusPoint, x, y)) {
				// Moved by boat
				x = moveToAnimate.bonusEndPoint.rowAndColumn.col;
				y = moveToAnimate.bonusEndPoint.rowAndColumn.row;
				flags.didBonusMove = true;
			} else if (moveToAnimate.bonusTileCode === "W") {
				const dx = x - moveToAnimate.bonusEndPoint.rowAndColumn.col;
				const dy = y - moveToAnimate.bonusEndPoint.rowAndColumn.row;
				if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy && (dx + dy) !== (dx * dy)) {
					// Wheel rotation
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
					flags.drainedOnThisTurn = true;
				}
			}
		}

		// Save intermediate position (after bonus, before arrange)
		// This is the arrange endpoint / pre-bonus position
		const intermediateX = x - 8;
		const intermediateZ = y - 8;

		// Main move animation
		if (moveAnimationBeginStep === 0) {
			if (moveToAnimate.moveType === ARRANGING && boardPoint.tile && boardPoint.tile.type !== ACCENT_TILE) {
				if (isSamePoint(moveToAnimate.endPoint, x, y)) {
					// Piece was moved here - animate from start to arrange endpoint
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
					const dx = x - moveToAnimate.endPoint.rowAndColumn.col;
					const dy = y - moveToAnimate.endPoint.rowAndColumn.row;
					if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy) {
						flags.drainedOnThisTurn = true;
					}
				}
			} else if (moveToAnimate.moveType === PLANTING) {
				if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {
					if (piecePlaceAnimation === 1) {
						tileGroup.scale.set(2, 2, 2);
						this.animateTileScale(tileGroup, 2, 1, 500);
					}
				}
			}
		}

		// Bonus move animation (boat moving a tile, wheel rotating)
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

		// Handle drained state for moved tiles
		if ((x !== ox || y !== oy) && boardPoint.tile && (boardPoint.tile.drained || boardPoint.tile.trapped)) {
			flags.drainedOnThisTurn = true;
		}

		// Accent tile placement animation (hidden then appears with bonus effect)
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

	animateTileMovement(tileGroup, fromPos, toPos, duration, fromScale, toScale) {
		const startTime = performance.now();
		const hasScale = fromScale !== undefined && toScale !== undefined;

		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			// Ease-out cubic
			const eased = 1 - Math.pow(1 - progress, 3);

			tileGroup.position.lerpVectors(fromPos, toPos, eased);
			// Arc lift
			const arc = Math.sin(progress * Math.PI) * 0.3;
			tileGroup.position.y = fromPos.y + arc;

			// Smooth scale transition during movement
			if (hasScale) {
				const scale = fromScale + (toScale - fromScale) * eased;
				tileGroup.scale.set(scale, scale, scale);
			}

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				tileGroup.position.copy(toPos);
				tileGroup.scale.set(toScale || 1, toScale || 1, toScale || 1);
			}
		};

		requestAnimationFrame(animate);
	}

	animateTileScale(tileGroup, fromScale, toScale, duration) {
		const startTime = performance.now();

		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			const scale = fromScale + (toScale - fromScale) * eased;
			tileGroup.scale.set(scale, scale, scale);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				tileGroup.scale.set(toScale, toScale, toScale);
			}
		};

		requestAnimationFrame(animate);
	}

	animateTileFadeOut(tileGroup, duration) {
		const startTime = performance.now();

		tileGroup.traverse((child) => {
			if (child.material) {
				child.material.transparent = true;
			}
		});

		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			tileGroup.traverse((child) => {
				if (child.material) {
					child.material.opacity = 1 - progress;
				}
			});

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				tileGroup.visible = false;
			}
		};

		requestAnimationFrame(animate);
	}

	setTileOpacity(tileGroup, opacity) {
		tileGroup.traverse((child) => {
			if (child.material) {
				child.material.transparent = true;
				child.material.opacity = opacity;
			}
		});
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

		// Glowing ring around the tile disc, matching tile thickness
		const torusGeo = new THREE.TorusGeometry(0.47, 0.03, 8, 32);
		torusGeo.rotateX(Math.PI / 2); // lay flat
		const torusMat = new THREE.MeshBasicMaterial({
			color: glowColor,
			transparent: true,
			opacity: 0.7,
		});
		const ring = new THREE.Mesh(torusGeo, torusMat);
		ring.position.set(x, 0.05, z); // at tile disc center height
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

	addPossibleMoveIndicator(x, z) {
		const ringGeo = this.possibleMoveRingGeometry.clone();
		ringGeo.rotateX(-Math.PI / 2);
		const ringMat = new THREE.MeshBasicMaterial({
			color: COLOR_POSSIBLE_MOVE,
			transparent: true,
			opacity: 0.7,
			side: THREE.DoubleSide,
		});
		const ring = new THREE.Mesh(ringGeo, ringMat);
		ring.position.set(x, 0.015, z);
		this.effectsGroup.add(ring);
	}

	addMarkedIndicator(x, z) {
		const ringGeo = this.markedRingGeometry.clone();
		ringGeo.rotateX(-Math.PI / 2);
		const ringMat = new THREE.MeshBasicMaterial({
			color: COLOR_MARKED,
			transparent: true,
			opacity: 0.6,
			side: THREE.DoubleSide,
		});
		const ring = new THREE.Mesh(ringGeo, ringMat);
		ring.position.set(x, 0.02, z);
		this.effectsGroup.add(ring);
	}

	// --- Arrows ---

	addArrow3D(startBoardPoint, endBoardPoint) {
		const startX = startBoardPoint.col - 8;
		const startZ = startBoardPoint.row - 8;
		const endX = endBoardPoint.col - 8;
		const endZ = endBoardPoint.row - 8;

		// Line
		const points = [
			new THREE.Vector3(startX, 0.15, startZ),
			new THREE.Vector3(endX, 0.15, endZ),
		];
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
		const lineMaterial = new THREE.LineBasicMaterial({
			color: COLOR_ARROW,
			linewidth: 2,
		});
		const line = new THREE.Line(lineGeometry, lineMaterial);
		this.arrowsGroup.add(line);

		// Arrowhead cone
		const dir = new THREE.Vector3(endX - startX, 0, endZ - startZ).normalize();
		const coneGeo = new THREE.ConeGeometry(0.1, 0.25, 8);
		const coneMat = new THREE.MeshBasicMaterial({ color: COLOR_ARROW });
		const cone = new THREE.Mesh(coneGeo, coneMat);

		// Position arrowhead at the end
		cone.position.set(endX, 0.15, endZ);

		// Rotate to point in direction of arrow
		const angle = Math.atan2(dir.x, dir.z);
		cone.rotation.set(0, angle, 0);
		// Tilt forward so cone points along the arrow direction
		cone.rotateX(Math.PI / 2);

		this.arrowsGroup.add(cone);
	}

	// --- Tile Piles (2D HTML, copied from SkudPaiShoActuator) ---

	clearTileContainer(tile) {
		const container = document.querySelector("." + tile.getImageName());
		if (container) {
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}
		}
	}

	addTile(tile, mainContainer) {
		const container = document.querySelector("." + tile.getImageName());
		if (!container) return;

		const theDiv = document.createElement("div");
		theDiv.classList.add("point");
		theDiv.classList.add("hasTile");

		if (tile.selectedFromPile) {
			theDiv.classList.add("selectedFromPile");
			theDiv.classList.add("drained");
		}

		const theImg = document.createElement("img");
		const srcValue = getSkudTilesSrcPath();
		theImg.src = srcValue + tile.getImageName() + ".png";
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

	// --- Interaction (Raycasting) ---

	setupEventListeners() {
		const canvas = this.renderer.domElement;

		// Prevent context menu
		canvas.addEventListener('contextmenu', (e) => e.preventDefault());

		// Click
		canvas.addEventListener('click', (event) => this.handleClick(event));

		if (!this.mobile) {
			// Hover
			canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
			canvas.addEventListener('mouseout', () => clearMessage());

			// Right-click for arrow marking
			canvas.addEventListener('mousedown', (event) => {
				if (event.button === 2) {
					const hit = this.raycastBoard(event);
					if (hit) {
						RmbDown(this.createFakeHtmlPoint(hit.userData));
					}
				}
			});
			canvas.addEventListener('mouseup', (event) => {
				if (event.button === 2) {
					const hit = this.raycastBoard(event);
					if (hit) {
						RmbUp(this.createFakeHtmlPoint(hit.userData));
					}
				}
			});
		} else {
			// Mobile: tap vs orbit discrimination
			canvas.addEventListener('touchstart', (event) => this.handleTouchStart(event), { passive: true });
			canvas.addEventListener('touchend', (event) => this.handleTouchEnd(event), { passive: true });
		}

		// Resize
		this.resizeHandler = () => this.handleResize();
		window.addEventListener('resize', this.resizeHandler);
	}

	raycastBoard(event) {
		const rect = this.renderer.domElement.getBoundingClientRect();
		this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse, this.camera);

		// Check tiles first
		const tileHits = this.raycaster.intersectObjects(this.tilesGroup.children, true);
		if (tileHits.length > 0) {
			let obj = tileHits[0].object;
			while (obj && !obj.userData.isTile && obj.parent && obj.parent !== this.tilesGroup) {
				obj = obj.parent;
			}
			if (obj && obj.userData.isTile) {
				return obj;
			}
		}

		// Check invisible click targets
		const clickHits = this.raycaster.intersectObjects(this.clickTargetsGroup.children, false);
		if (clickHits.length > 0) {
			return clickHits[0].object;
		}

		return null;
	}

	createFakeHtmlPoint(userData) {
		const notationPointString = new RowAndColumn(userData.row, userData.col).notationPointString;
		return {
			getAttribute: (name) => {
				if (name === 'name') return notationPointString;
				return null;
			}
		};
	}

	handleClick(event) {
		const hit = this.raycastBoard(event);
		if (hit) {
			const fakePoint = this.createFakeHtmlPoint(hit.userData);
			pointClicked(fakePoint);
			if (this.mobile) {
				showPointMessage(fakePoint);
			}
		}
	}

	handleMouseMove(event) {
		const hit = this.raycastBoard(event);
		if (hit) {
			showPointMessage(this.createFakeHtmlPoint(hit.userData));
		}
	}

	handleTouchStart(event) {
		if (event.touches.length === 1) {
			this.touchStartTime = performance.now();
			this.touchStartPos = {
				x: event.touches[0].clientX,
				y: event.touches[0].clientY,
			};
		}
	}

	handleTouchEnd(event) {
		if (this.touchStartTime) {
			const elapsed = performance.now() - this.touchStartTime;
			const changedTouch = event.changedTouches[0];
			const dx = changedTouch.clientX - this.touchStartPos.x;
			const dy = changedTouch.clientY - this.touchStartPos.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			// Tap: short duration + small movement
			if (elapsed < 300 && distance < 10) {
				this.handleClick({
					clientX: changedTouch.clientX,
					clientY: changedTouch.clientY,
				});
			}
			this.touchStartTime = null;
		}
	}

	// --- Responsive ---

	handleResize() {
		const size = Math.min(this.maxCanvasSize, window.innerWidth);
		this.camera.aspect = 1;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(size, size);
		const sizeStr = size + 'px';
		const bcontainer = this.gameContainer.querySelector('.board-container');
		const canvasWrapper = this.gameContainer.querySelector('.svgContainerContainer');
		if (bcontainer) bcontainer.style.width = sizeStr;
		if (canvasWrapper) canvasWrapper.style.width = sizeStr;
	}

	// --- Render Loop ---

	startRenderLoop() {
		const animate = () => {
			this.animationFrameId = requestAnimationFrame(animate);
			this.controls.update();
			this.renderer.render(this.scene, this.camera);
		};
		animate();
	}

	stopRenderLoop() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	// --- Cleanup ---

	clearGroup(group) {
		while (group.children.length > 0) {
			const child = group.children[0];
			group.remove(child);
			if (child.geometry && child.geometry !== this.discGeometry
				&& child.geometry !== this.faceGeometry
				&& child.geometry !== this.bhSphereGeometry
				&& child.geometry !== this.pointDotGeometry) {
				child.geometry.dispose();
			}
			if (child.material) {
				if (Array.isArray(child.material)) {
					child.material.forEach((m) => m.dispose());
				} else {
					child.material.dispose();
				}
			}
			// Recurse into groups
			if (child.children && child.children.length > 0) {
				this.clearGroup(child);
			}
		}
	}

	dispose() {
		this.stopRenderLoop();

		// Restore original page width
		const mainWrapper = document.getElementById('mainWrapper');
		if (mainWrapper) {
			mainWrapper.style.maxWidth = this.originalMaxWidth || '';
		}

		// Dispose all scene objects
		this.scene.traverse((object) => {
			if (object.geometry) object.geometry.dispose();
			if (object.material) {
				if (Array.isArray(object.material)) {
					object.material.forEach((m) => m.dispose());
				} else {
					object.material.dispose();
				}
			}
		});

		// Dispose shared geometries
		this.discGeometry.dispose();
		this.faceGeometry.dispose();
		this.harmonyRingGeometry.dispose();
		this.possibleMoveRingGeometry.dispose();
		this.markedRingGeometry.dispose();
		this.bhSphereGeometry.dispose();
		this.pointDotGeometry.dispose();
		this.clickPlaneGeometry.dispose();

		// Dispose textures
		for (const key in this.textureCache) {
			this.textureCache[key].dispose();
		}

		// Dispose renderer
		this.renderer.dispose();

		// Remove controls
		this.controls.dispose();

		// Remove event listeners
		window.removeEventListener('resize', this.resizeHandler);
	}
}
