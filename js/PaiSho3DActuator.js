// Base 3D Actuator for Pai Sho games
// Uses Three.js to render the board in WebGL with OrbitControls
// Subclasses implement game-specific rendering via render3DGame()

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { NON_PLAYABLE } from './skud-pai-sho/SkudPaiShoBoardPoint';
import {
	RmbDown,
	RmbUp,
	clearMessage,
	pointClicked,
	showPointMessage,
	showTileMessage,
	unplayedTileClicked,
	paiShoBoardKey,
	svgBoardDesigns,
	customBoardUrlArrayKey,
	customBoardUrlKey,
} from './PaiShoMain';
import { RowAndColumn } from './CommonNotationObjects';
import { getRoundBoardPreference, isHelpCollapsed, setHelpCollapsed } from './PaiSho3DOptions';

// Common colors
const COLOR_POSSIBLE_MOVE = 0x442211;
const COLOR_MARKED = 0xFFAA00;
const COLOR_ARROW = 0xFFAA00;
const COLOR_DISC_EDGE = 0x8B7355;

export class PaiSho3DActuator {
	constructor(gameContainer, isMobile, enableAnimations, config = {}) {
		this.gameContainer = gameContainer;
		this.mobile = isMobile;
		this.animationOn = enableAnimations;

		// Config with defaults
		this.gridSize = config.gridSize || 17;
		this.gridOffset = config.gridOffset || 8;
		this.boardSurfaceSize = config.boardSurfaceSize || 18;
		this.maxCanvasSize = config.maxCanvasSize || 800;
		this.discRadius = config.discRadius || 0.42;
		this.pageMaxWidth = config.pageMaxWidth || '1400px';
		this.boardRotation = config.boardRotation || 0; // degrees to rotate view around Y axis

		// Three.js core
		this.scene = new THREE.Scene();
		this.updateSceneBackground();

		// Camera
		this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
		this.camera.position.set(0, 16, 13);

		// Rotate initial camera orbit position for games viewed from a different side
		if (this.boardRotation) {
			const angle = this.boardRotation * Math.PI / 180;
			const x = this.camera.position.x;
			const z = this.camera.position.z;
			this.camera.position.x = x * Math.cos(angle) + z * Math.sin(angle);
			this.camera.position.z = -x * Math.sin(angle) + z * Math.cos(angle);
		}

		this.camera.lookAt(0, 0, 0);

		// Renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
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
		this.controls.target.set(0, 0, 0);
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

		// Shared geometries
		this.discGeometry = new THREE.CylinderGeometry(this.discRadius, this.discRadius, 0.16, 32);
		this.discGeometry.translate(0, 0.04, 0); // Shift up so bottom sits on the board surface
		this.faceGeometry = new THREE.CircleGeometry(this.discRadius - 0.02, 32);
		this.possibleMoveRingGeometry = new THREE.RingGeometry(0.20, 0.35, 16);
		this.markedRingGeometry = new THREE.RingGeometry(0.30, 0.42, 16);
		this.clickPlaneGeometry = new THREE.PlaneGeometry(0.9, 0.9);

		// Active animations
		this.activeAnimations = [];

		// Round board auto-detection cache
		this.roundBoardCache = {};
		this.detectedRoundBoard = true;

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

	// --- Round Board Detection ---

	shouldUseRoundBoard() {
		const pref = getRoundBoardPreference();
		if (pref === "true") return true;
		if (pref === "false") return false;
		const url = this.getBoardImageUrl();
		if (this.roundBoardCache && this.roundBoardCache[url] !== undefined) {
			return this.roundBoardCache[url];
		}
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
			return true;
		}
	}

	onBoardTextureLoaded(image) {
		if (getRoundBoardPreference() !== null) return;
		if (this.roundBoardCache[this.currentBoardUrl] !== undefined) return;

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
	// Subclasses must implement getHostTilesContainerDivs() and getGuestTilesContainerDivs()

	setupContainers() {
		while (this.gameContainer.firstChild) {
			this.gameContainer.removeChild(this.gameContainer.firstChild);
		}

		const mainWrapper = document.getElementById('mainWrapper');
		if (mainWrapper) {
			this.originalMaxWidth = mainWrapper.style.maxWidth;
			mainWrapper.style.maxWidth = this.pageMaxWidth;
		}

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

		const tilePileContainer = document.createElement('div');
		tilePileContainer.classList.add('tilePileContainer', 'PaiSho');

		const response = document.createElement('div');
		response.id = 'response';
		const gameMessage = document.createElement('div');
		gameMessage.classList.add('gameMessage');

		this.hostTilesContainer = document.createElement('div');
		this.hostTilesContainer.classList.add('hostTilesContainer', 'tileContainer');
		this.hostTilesContainer.id = 'hostTilesContainer';
		this.hostTilesContainer.innerHTML = this.getHostTilesContainerDivs();

		this.guestTilesContainer = document.createElement('div');
		this.guestTilesContainer.classList.add('guestTilesContainer', 'tileContainer');
		this.guestTilesContainer.id = 'guestTilesContainer';
		this.guestTilesContainer.innerHTML = this.getGuestTilesContainerDivs();

		const gameMessage2 = document.createElement('div');
		gameMessage2.classList.add('gameMessage2');

		tilePileContainer.appendChild(response);
		tilePileContainer.appendChild(gameMessage);
		tilePileContainer.appendChild(this.hostTilesContainer);
		tilePileContainer.appendChild(this.guestTilesContainer);
		tilePileContainer.appendChild(gameMessage2);

		this.gameContainer.appendChild(bcontainer);
		this.gameContainer.appendChild(tilePileContainer);

		// Set up collapsible help panel
		this.setupCollapsibleHelp();
	}

	// --- Collapsible Help Panel ---

	setupCollapsibleHelp() {
		const helpContainer = document.getElementById('help');
		if (!helpContainer) return;

		// Add collapse button to the tab bar
		const tabBar = helpContainer.querySelector('.tab');
		if (tabBar && !tabBar.querySelector('.helpCollapseBtn3D')) {
			const collapseBtn = document.createElement('button');
			collapseBtn.className = 'helpCollapseBtn3D';
			collapseBtn.textContent = '\u00AB'; // «
			collapseBtn.title = 'Collapse Help panel';
			collapseBtn.addEventListener('click', () => this.toggleHelpCollapsed());
			tabBar.appendChild(collapseBtn);
		}

		// Add expand tab (visible only when collapsed)
		if (!helpContainer.querySelector('.helpExpandTab3D')) {
			const expandTab = document.createElement('div');
			expandTab.className = 'helpExpandTab3D';
			expandTab.textContent = 'Help / Chat';
			expandTab.title = 'Expand Help panel';
			expandTab.addEventListener('click', () => this.toggleHelpCollapsed());
			helpContainer.appendChild(expandTab);
		}

		// Apply initial collapsed state
		if (isHelpCollapsed()) {
			helpContainer.classList.add('helpCollapsed3D');
			this.maxCanvasSize = 1050;
			this.handleResize();
		}
	}

	toggleHelpCollapsed() {
		const helpContainer = document.getElementById('help');
		if (!helpContainer) return;

		const collapsed = !isHelpCollapsed();
		setHelpCollapsed(collapsed);

		if (collapsed) {
			helpContainer.classList.add('helpCollapsed3D');
			this.maxCanvasSize = 1050;
		} else {
			helpContainer.classList.remove('helpCollapsed3D');
			this.maxCanvasSize = 800;
		}

		this.handleResize();
	}

	// Abstract - subclass must override
	getHostTilesContainerDivs() {
		return '';
	}

	// Abstract - subclass must override
	getGuestTilesContainerDivs() {
		return '';
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
		const boardSize = this.boardSurfaceSize;
		const boardThickness = 0.5;
		const roundBoard = this.shouldUseRoundBoard();
		this.currentRoundBoard = roundBoard;

		this.currentBoardUrl = this.getBoardImageUrl();
		const boardTexture = this.textureLoader.load(this.currentBoardUrl, (texture) => {
			this.onBoardTextureLoaded(texture.image);
		});
		boardTexture.colorSpace = THREE.SRGBColorSpace;

		if (roundBoard) {
			boardTexture.center.set(0.5, 0.5);
			boardTexture.rotation = Math.PI / 2;
		}

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
			const radius = boardSize / 2;
			boardGeometry = new THREE.CylinderGeometry(radius, radius, boardThickness, 64);
			materials = [sideMaterial, this.boardTopMaterial, sideMaterial];
		} else {
			boardGeometry = new THREE.BoxGeometry(boardSize, boardThickness, boardSize);
			materials = [
				sideMaterial, sideMaterial,
				this.boardTopMaterial, sideMaterial,
				sideMaterial, sideMaterial,
			];
		}

		this.boardMesh = new THREE.Mesh(boardGeometry, materials);
		this.boardMesh.position.y = 0.01 - boardThickness / 2;
		this.boardMesh.receiveShadow = true;
		this.boardGroup.add(this.boardMesh);

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
		this.tableMesh.position.y = 0.009;
		this.boardGroup.add(this.tableMesh);
	}

	// --- Click Targets ---

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
				clickMesh.position.set(cell.col - this.gridOffset, 0.01, cell.row - this.gridOffset);
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

	// --- Main Actuate (Template Method) ---

	actuate(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		if (!moveAnimationBeginStep) {
			moveAnimationBeginStep = 0;
		}

		window.requestAnimationFrame(() => {
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

			// Build click targets once
			if (!this.clickTargetsBuilt) {
				this.buildClickTargets(board);
				this.clickTargetsBuilt = true;
			}

			// Delegate to subclass
			this.render3DGame(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep);
		});
	}

	// Abstract - subclass must override
	render3DGame(board, tileManager, markingManager, moveToAnimate, moveAnimationBeginStep) {
		// Override in subclass
	}

	// --- Coordinate Helper ---

	boardToWorld(col, row) {
		return {
			x: col - this.gridOffset,
			z: row - this.gridOffset,
		};
	}

	// --- Tile Mesh Building ---

	buildTileMesh(srcPath, x, z) {
		const group = new THREE.Group();

		const discMat = new THREE.MeshStandardMaterial({
			color: COLOR_DISC_EDGE,
			roughness: 0.6,
		});
		const disc = new THREE.Mesh(this.discGeometry, discMat);
		disc.castShadow = true;
		group.add(disc);

		const texture = this.getTexture(srcPath);
		const faceGeo = this.faceGeometry.clone();
		faceGeo.rotateX(-Math.PI / 2);
		// Rotate tile face so it appears upright from the rotated camera angle
		if (this.boardRotation) {
			faceGeo.rotateY(this.boardRotation * Math.PI / 180);
		}
		const faceMat = new THREE.MeshStandardMaterial({
			map: texture,
			roughness: 0.6,
			transparent: true,
		});
		const face = new THREE.Mesh(faceGeo, faceMat);
		face.position.y = 0.121;
		group.add(face);

		group.position.set(x, 0.05, z);

		return group;
	}

	// --- Animation Helpers ---

	animateTileMovement(tileGroup, fromPos, toPos, duration, fromScale, toScale) {
		const startTime = performance.now();
		const hasScale = fromScale !== undefined && toScale !== undefined;

		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);

			tileGroup.position.lerpVectors(fromPos, toPos, eased);
			const arc = Math.sin(progress * Math.PI) * 0.3;
			tileGroup.position.y = fromPos.y + arc;

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

	// --- Common Visual Indicators ---

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
		const startX = startBoardPoint.col - this.gridOffset;
		const startZ = startBoardPoint.row - this.gridOffset;
		const endX = endBoardPoint.col - this.gridOffset;
		const endZ = endBoardPoint.row - this.gridOffset;

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

		const dir = new THREE.Vector3(endX - startX, 0, endZ - startZ).normalize();
		const coneGeo = new THREE.ConeGeometry(0.1, 0.25, 8);
		const coneMat = new THREE.MeshBasicMaterial({ color: COLOR_ARROW });
		const cone = new THREE.Mesh(coneGeo, coneMat);

		cone.position.set(endX, 0.15, endZ);
		const angle = Math.atan2(dir.x, dir.z);
		cone.rotation.set(0, angle, 0);
		cone.rotateX(Math.PI / 2);

		this.arrowsGroup.add(cone);
	}

	// --- Tile Piles (2D HTML) ---

	clearTileContainer(tile) {
		const container = document.querySelector("." + tile.getImageName());
		if (container) {
			while (container.firstChild) {
				container.removeChild(container.firstChild);
			}
		}
	}

	addTile(tile, mainContainer, getTilesSrcPath) {
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
		const srcValue = getTilesSrcPath ? getTilesSrcPath() : this.getTileImageSourceDir();
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

		canvas.addEventListener('contextmenu', (e) => e.preventDefault());
		canvas.addEventListener('click', (event) => this.handleClick(event));

		if (!this.mobile) {
			canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
			canvas.addEventListener('mouseout', () => clearMessage());

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
			canvas.addEventListener('touchstart', (event) => this.handleTouchStart(event), { passive: true });
			canvas.addEventListener('touchend', (event) => this.handleTouchEnd(event), { passive: true });
		}

		this.resizeHandler = () => this.handleResize();
		window.addEventListener('resize', this.resizeHandler);
	}

	raycastBoard(event) {
		const rect = this.renderer.domElement.getBoundingClientRect();
		this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse, this.camera);

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
				&& child.geometry !== this.faceGeometry) {
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
		this.stopRenderLoop();

		// Restore help panel
		const helpContainer = document.getElementById('help');
		if (helpContainer) {
			helpContainer.classList.remove('helpCollapsed3D');
			const collapseBtn = helpContainer.querySelector('.helpCollapseBtn3D');
			if (collapseBtn) collapseBtn.remove();
			const expandTab = helpContainer.querySelector('.helpExpandTab3D');
			if (expandTab) expandTab.remove();
		}

		const mainWrapper = document.getElementById('mainWrapper');
		if (mainWrapper) {
			mainWrapper.style.maxWidth = this.originalMaxWidth || '';
		}

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

		this.discGeometry.dispose();
		this.faceGeometry.dispose();
		this.possibleMoveRingGeometry.dispose();
		this.markedRingGeometry.dispose();
		this.clickPlaneGeometry.dispose();

		for (const key in this.textureCache) {
			this.textureCache[key].dispose();
		}

		this.renderer.dispose();
		this.controls.dispose();
		window.removeEventListener('resize', this.resizeHandler);
	}
}
