/**
 * YammaActuator - Three.js 3D rendering for Yamma triangular pyramid
 *
 * Renders a tetrahedron (triangular pyramid) structure:
 * - Level 0 (base): 5 rows (15 positions)
 * - Level 1: 4 rows (10 positions)
 * - Level 2: 3 rows (6 positions)
 * - Level 3: 2 rows (3 positions)
 * - Level 4: 1 row (1 position - apex)
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PLAYER } from './YammaBoard';
import { createDivWithClass, createDivWithId, removeChildren } from '../ActuatorHelp';

export class YammaActuator {
	constructor(gameContainer, isMobile, onSlotClick, hostTilesContainerDivs, guestTilesContainerDivs) {
		this.gameContainer = gameContainer;
		this.isMobile = isMobile;
		this.onSlotClick = onSlotClick;
		this.hostTilesContainerDivs = hostTilesContainerDivs;
		this.guestTilesContainerDivs = guestTilesContainerDivs;

		// Three.js objects
		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.controls = null;

		// Game objects
		this.boardGroup = null;
		this.cubesGroup = null;
		this.slotsGroup = null;
		this.highlightGroup = null;

		// Board configuration for triangular pyramid
		this.baseRows = 6;
		this.maxLevels = 6;
		// Spacing between cube centers on same level
		this.slotSpacing = 1.1;
		this.cubeSize = 0.8;
		// For a corner-balanced cube, center height = cubeSize * √3 / 2
		this.cubeHalfHeight = this.cubeSize * Math.sqrt(3) / 2;
		// Height between stacking levels (cube bottom corner to cube bottom corner)
		this.levelHeight = this.cubeSize * 0.6;

		// Raycaster for mouse interaction
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		// Track clickable slots (recreated each actuate based on possible moves)
		this.slotMeshes = [];

		// Store current board for reference
		this.currentBoard = null;

		// Rotation selection state
		this.pendingMove = null; // { row, col, level }
		this.previewGroup = null;
		this.previewMesh = null; // Single preview cube at the board position
		this.selectedRotation = 0; // Currently selected/hovered rotation
		this.currentPlayerColor = PLAYER.WHITE; // Updated when showing rotation selection
		this.rotationArrowsGroup = null; // 3D arrows for rotation control

		// Turn indicator
		this.turnIndicatorSprite = null;
		this.boardContainerDiv = null; // Reference for colored border

		this.initialized = false;

		this.initialize();
	}

	initialize() {
		// Clear the game container
		removeChildren(this.gameContainer);

		// Create board container wrapper
		const bcontainer = createDivWithClass('board-container');
		bcontainer.classList.add('yamma-board-container');
		this.boardContainerDiv = bcontainer;

		// Create 3D container div
		const container = document.createElement('div');
		container.id = 'yamma-3d-container';
		container.style.width = '100%';
		container.style.height = '500px';
		container.style.position = 'relative';
		bcontainer.appendChild(container);

		// Create view panels container (3 perspective views)
		const viewsContainer = document.createElement('div');
		viewsContainer.id = 'yamma-views-container';
		viewsContainer.style.display = 'flex';
		viewsContainer.style.justifyContent = 'space-around';
		viewsContainer.style.padding = '10px';
		viewsContainer.style.backgroundColor = '#3d4a5c';

		this.viewCanvases = [];
		const viewLabels = ['Front View', 'Left View', 'Right View'];
		// Use smaller canvas size on mobile
		this.viewCanvasWidth = this.isMobile ? 90 : 150;
		this.viewCanvasHeight = this.isMobile ? 57 : 95;
		for (let i = 0; i < 3; i++) {
			const viewWrapper = document.createElement('div');
			viewWrapper.style.textAlign = 'center';

			const label = document.createElement('div');
			label.textContent = viewLabels[i];
			label.style.color = '#ddd';
			label.style.marginBottom = '5px';
			label.style.fontSize = this.isMobile ? '10px' : '12px';
			viewWrapper.appendChild(label);

			const canvas = document.createElement('canvas');
			canvas.width = this.viewCanvasWidth;
			canvas.height = this.viewCanvasHeight;
			canvas.style.backgroundColor = '#4a5568';
			canvas.style.borderRadius = '5px';
			this.viewCanvases.push(canvas);
			viewWrapper.appendChild(canvas);

			viewsContainer.appendChild(viewWrapper);
		}
		bcontainer.appendChild(viewsContainer);

		// Create tile pile container with game messages (standard structure)
		const tilePileContainer = createDivWithClass('tilePileContainer');

		const response = createDivWithId('response');
		const gameMessage = createDivWithClass('gameMessage');
		const hostTilesContainer = createDivWithClass('hostTilesContainer');
		const guestTilesContainer = createDivWithClass('guestTilesContainer');
		const gameMessage2 = createDivWithClass('gameMessage2');

		hostTilesContainer.innerHTML = this.hostTilesContainerDivs;
		guestTilesContainer.innerHTML = this.guestTilesContainerDivs;

		tilePileContainer.appendChild(response);
		tilePileContainer.appendChild(gameMessage);
		tilePileContainer.appendChild(hostTilesContainer);
		tilePileContainer.appendChild(guestTilesContainer);
		tilePileContainer.appendChild(gameMessage2);

		this.gameContainer.appendChild(bcontainer);
		this.gameContainer.appendChild(tilePileContainer);

		// Scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x3d4a5c);

		// Camera
		const width = container.clientWidth || 800;
		const height = container.clientHeight || 500;
		this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
		this.camera.position.set(10, 12, 10);
		this.camera.lookAt(0, 1.5, 1);

		// Renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(width, height);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		container.appendChild(this.renderer.domElement);

		// Controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;
		this.controls.minDistance = 5;
		this.controls.maxDistance = 30;
		this.controls.maxPolarAngle = Math.PI / 2.1;
		this.controls.target.set(0, 1.5, 1);

		// Lighting
		this.setupLighting();

		// Create groups
		this.boardGroup = new THREE.Group();
		this.cubesGroup = new THREE.Group();
		this.slotsGroup = new THREE.Group();
		this.highlightGroup = new THREE.Group();
		this.previewGroup = new THREE.Group();

		this.scene.add(this.boardGroup);
		this.boardGroup.add(this.slotsGroup);
		this.boardGroup.add(this.cubesGroup);
		this.boardGroup.add(this.highlightGroup);
		this.boardGroup.add(this.previewGroup);

		// Create rotation arrows for preview cube interaction
		this.createRotationArrows();

		// Create the triangular board base
		this.createBoardBase();

		// Create turn indicator sprite
		this.createTurnIndicator();

		// Event listeners
		this.setupEventListeners(container);

		// Animation loop
		this.animate();

		this.initialized = true;
	}

	setupLighting() {
		// Ambient light - brighter for better visibility
		const ambient = new THREE.AmbientLight(0xffffff, 0.7);
		this.scene.add(ambient);

		// Main directional light - brighter
		const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
		dirLight.position.set(10, 20, 10);
		dirLight.castShadow = true;
		dirLight.shadow.mapSize.width = 2048;
		dirLight.shadow.mapSize.height = 2048;
		dirLight.shadow.camera.near = 0.5;
		dirLight.shadow.camera.far = 50;
		dirLight.shadow.camera.left = -15;
		dirLight.shadow.camera.right = 15;
		dirLight.shadow.camera.top = 15;
		dirLight.shadow.camera.bottom = -15;
		this.scene.add(dirLight);

		// Fill light - brighter to reduce shadows
		const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
		fillLight.position.set(-5, 10, -5);
		this.scene.add(fillLight);
	}

	/**
	 * Create 3D rotation arrows that orbit around the preview cube.
	 * Left arrow rotates counter-clockwise, right arrow rotates clockwise.
	 */
	createRotationArrows() {
		this.rotationArrowsGroup = new THREE.Group();

		// Create curved arrow shapes for left and right rotation
		this.leftArrow = this.createArrowMesh('left');
		this.rightArrow = this.createArrowMesh('right');
		this.confirmButton = this.createConfirmMesh();

		this.rotationArrowsGroup.add(this.leftArrow);
		this.rotationArrowsGroup.add(this.rightArrow);
		this.rotationArrowsGroup.add(this.confirmButton);

		this.rotationArrowsGroup.visible = false;
		this.previewGroup.add(this.rotationArrowsGroup);
	}

	/**
	 * Create a simple arrow (triangle) for rotation control.
	 */
	createArrowMesh(direction) {
		const isLeft = direction === 'left';

		// Simple cone pointing left or right
		const geometry = new THREE.ConeGeometry(0.25, 0.4, 3);
		const material = new THREE.MeshStandardMaterial({
			color: 0x44aaff,
			emissive: 0x2266aa,
			emissiveIntensity: 0.4
		});
		const arrow = new THREE.Mesh(geometry, material);

		// Rotate cone to point horizontally (left or right)
		arrow.rotation.z = isLeft ? Math.PI / 2 : -Math.PI / 2;

		// Position on either side of the cube
		arrow.position.x = isLeft ? -this.cubeSize * 1.0 : this.cubeSize * 1.0;
		arrow.position.y = this.cubeSize * 0.3;

		// Store direction for click detection
		arrow.userData = { type: 'rotationArrow', direction };

		return arrow;
	}

	/**
	 * Create a confirm button mesh (checkmark).
	 */
	createConfirmMesh() {
		const group = new THREE.Group();

		// Create a simple sphere as confirm button
		const geometry = new THREE.SphereGeometry(0.25, 16, 16);
		const material = new THREE.MeshStandardMaterial({
			color: 0x44aa44,
			emissive: 0x228822,
			emissiveIntensity: 0.4
		});
		const sphere = new THREE.Mesh(geometry, material);

		// Add a checkmark using lines
		const checkMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
		const checkPoints = [
			new THREE.Vector3(-0.1, 0, 0.26),
			new THREE.Vector3(-0.02, -0.08, 0.26),
			new THREE.Vector3(0.12, 0.1, 0.26)
		];
		const checkGeometry = new THREE.BufferGeometry().setFromPoints(checkPoints);
		const checkLine = new THREE.Line(checkGeometry, checkMaterial);

		group.add(sphere);
		group.add(checkLine);
		group.position.set(0, -this.cubeSize * 1.0, 0);

		group.userData = { type: 'confirmButton' };
		sphere.userData = { type: 'confirmButton' };

		return group;
	}

	/**
	 * Rotate the preview cube by one step (120°) in the given direction.
	 */
	rotatePreview(direction) {
		if (!this.pendingMove) return;

		if (direction === 'left') {
			this.selectedRotation = (this.selectedRotation + 2) % 3; // -1 mod 3
		} else {
			this.selectedRotation = (this.selectedRotation + 1) % 3;
		}
		this.updatePreviewCube();
	}

	/**
	 * Confirm the rotation selection and complete the move.
	 */
	confirmRotationSelection() {
		if (!this.pendingMove) return;

		const { row, col, level } = this.pendingMove;
		const rotation = this.selectedRotation;

		this.clearRotationSelection();

		if (this.onSlotClick) {
			this.onSlotClick(row, col, level, rotation);
		}
	}

	createBoardBase() {
		// Create a triangular board base
		// Oriented so apex (row 0) is at back, wide base (row 4) is at front
		const triangleShape = new THREE.Shape();

		// Calculate triangle dimensions for equilateral triangle
		// The slots span (baseRows - 1) gaps horizontally at the base
		const padding = 0.5;
		const baseWidth = (this.baseRows - 1) * this.slotSpacing + padding * 2;
		// For equilateral triangle: height = base * sqrt(3) / 2
		const height = baseWidth * Math.sqrt(3) / 2;

		// Triangle vertices: apex at back (positive z), base at front (negative z)
		// In Shape coordinates (x, y), y becomes z after rotation
		triangleShape.moveTo(0, height / 2);              // Apex at back
		triangleShape.lineTo(-baseWidth / 2, -height / 2);     // Front left
		triangleShape.lineTo(baseWidth / 2, -height / 2);      // Front right
		triangleShape.closePath();

		const extrudeSettings = {
			depth: 0.3,
			bevelEnabled: false
		};

		const baseGeometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);
		baseGeometry.rotateX(-Math.PI / 2);

		const baseMaterial = new THREE.MeshStandardMaterial({
			color: 0x8B4513,
			roughness: 0.8,
			metalness: 0.1
		});
		const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
		baseMesh.position.y = -0.3;
		baseMesh.receiveShadow = true;
		this.boardGroup.add(baseMesh);

		// Add triangular grid lines for base level
		this.createTriangularGrid();

		// Add "Front", "Left", "Right" labels along board edges
		this.createEdgeLabels();
	}

	/**
	 * Create text labels for each edge of the triangular board.
	 */
	createEdgeLabels() {
		const labelHeight = 0.1;
		const offset = 1.2; // Distance from edge

		// Calculate board dimensions
		const maxRow = this.baseRows - 1;

		// Get corner positions
		const frontLeft = this.getWorldPosition(maxRow, 0, 0);
		const frontRight = this.getWorldPosition(maxRow, maxRow, 0);
		const apex = this.getWorldPosition(0, 0, 0);

		// Front label (along the front edge, between frontLeft and frontRight)
		// Front edge is the base of triangle (larger row numbers = more negative z)
		const frontLabel = this.createTextSprite('Front');
		frontLabel.position.set(
			(frontLeft.x + frontRight.x) / 2,
			labelHeight,
			frontLeft.z + offset * 1.2
		);
		this.boardGroup.add(frontLabel);

		// Left label (along left edge, between apex and frontLeft)
		const leftLabel = this.createTextSprite('Left');
		leftLabel.position.set(
			(apex.x + frontLeft.x) / 2 - offset * 0.8,
			labelHeight,
			(apex.z + frontLeft.z) / 2 - offset * 0.5
		);
		this.boardGroup.add(leftLabel);

		// Right label (along right edge, between apex and frontRight)
		const rightLabel = this.createTextSprite('Right');
		rightLabel.position.set(
			(apex.x + frontRight.x) / 2 + offset * 0.8,
			labelHeight,
			(apex.z + frontRight.z) / 2 - offset * 0.5
		);
		this.boardGroup.add(rightLabel);
	}

	/**
	 * Create a text sprite that always faces the camera.
	 */
	createTextSprite(text) {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.width = 128;
		canvas.height = 64;

		context.fillStyle = 'rgba(0, 0, 0, 0)';
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.font = 'bold 32px Arial';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#aaaaaa';
		context.fillText(text, canvas.width / 2, canvas.height / 2);

		const texture = new THREE.CanvasTexture(canvas);
		const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set(1.5, 0.75, 1);

		return sprite;
	}

	/**
	 * Create the turn indicator sprite that shows whose turn it is.
	 * Positioned above the board, always facing the camera.
	 */
	createTurnIndicator() {
		this.turnIndicatorSprite = this.createTurnIndicatorSprite(PLAYER.WHITE);
		this.turnIndicatorSprite.position.set(0, 6, 0);
		this.scene.add(this.turnIndicatorSprite);
	}

	/**
	 * Create a turn indicator sprite with the player's color.
	 */
	createTurnIndicatorSprite(playerColor) {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.width = 256;
		canvas.height = 64;

		// Clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Draw rounded background
		const bgColor = playerColor === PLAYER.WHITE ? '#f0f0f0' : '#1e40af';
		const textColor = playerColor === PLAYER.WHITE ? '#333333' : '#ffffff';
		const borderColor = playerColor === PLAYER.WHITE ? '#cccccc' : '#3b82f6';

		context.fillStyle = bgColor;
		context.strokeStyle = borderColor;
		context.lineWidth = 3;
		this.roundRect(context, 4, 4, canvas.width - 8, canvas.height - 8, 12);
		context.fill();
		context.stroke();

		// Draw text
		const colorName = playerColor === PLAYER.WHITE ? 'White' : 'Blue';
		context.font = 'bold 28px Arial';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = textColor;
		context.fillText(`${colorName}'s Turn`, canvas.width / 2, canvas.height / 2);

		const texture = new THREE.CanvasTexture(canvas);
		const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set(4, 1, 1);

		return sprite;
	}

	/**
	 * Helper to draw a rounded rectangle.
	 */
	roundRect(ctx, x, y, width, height, radius) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
	}

	/**
	 * Update the turn indicator to show the current player.
	 */
	updateTurnIndicator(currentPlayer, gameEnded) {
		if (!this.turnIndicatorSprite) return;

		// Remove old sprite
		this.scene.remove(this.turnIndicatorSprite);
		if (this.turnIndicatorSprite.material.map) {
			this.turnIndicatorSprite.material.map.dispose();
		}
		this.turnIndicatorSprite.material.dispose();

		// Create new sprite with updated player (unless game ended)
		if (!gameEnded) {
			const playerColor = currentPlayer === PLAYER.WHITE ? PLAYER.WHITE : PLAYER.BLUE;
			this.turnIndicatorSprite = this.createTurnIndicatorSprite(playerColor);
			this.turnIndicatorSprite.position.set(0, 6, 0);
			this.scene.add(this.turnIndicatorSprite);
		}

		// Update the board container border color
		this.updateBoardBorder(currentPlayer, gameEnded);
	}

	/**
	 * Update the colored border around the board container.
	 */
	updateBoardBorder(currentPlayer, gameEnded) {
		if (!this.boardContainerDiv) return;

		// Remove existing border classes
		this.boardContainerDiv.classList.remove('yamma-turn-white', 'yamma-turn-blue', 'yamma-game-ended');

		if (gameEnded) {
			this.boardContainerDiv.classList.add('yamma-game-ended');
		} else if (currentPlayer === PLAYER.WHITE) {
			this.boardContainerDiv.classList.add('yamma-turn-white');
		} else {
			this.boardContainerDiv.classList.add('yamma-turn-blue');
		}
	}

	createTriangularGrid() {
		const gridMaterial = new THREE.LineBasicMaterial({ color: 0x5a3a1a });

		// Draw lines connecting base level positions
		for (let row = 0; row < this.baseRows; row++) {
			const points = [];
			for (let col = 0; col <= row; col++) {
				const pos = this.getWorldPosition(row, col, 0);
				points.push(new THREE.Vector3(pos.x, 0.01, pos.z));
			}
			if (points.length > 1) {
				const geometry = new THREE.BufferGeometry().setFromPoints(points);
				const line = new THREE.Line(geometry, gridMaterial);
				this.boardGroup.add(line);
			}
		}

		// Draw diagonal lines (left edge of triangles)
		for (let col = 0; col < this.baseRows; col++) {
			const points = [];
			for (let row = col; row < this.baseRows; row++) {
				const pos = this.getWorldPosition(row, col, 0);
				points.push(new THREE.Vector3(pos.x, 0.01, pos.z));
			}
			if (points.length > 1) {
				const geometry = new THREE.BufferGeometry().setFromPoints(points);
				const line = new THREE.Line(geometry, gridMaterial);
				this.boardGroup.add(line);
			}
		}

		// Draw diagonal lines (right edge of triangles)
		for (let startRow = 0; startRow < this.baseRows; startRow++) {
			const points = [];
			let row = startRow;
			let col = 0;
			while (row < this.baseRows && col <= row) {
				const pos = this.getWorldPosition(row, col, 0);
				points.push(new THREE.Vector3(pos.x, 0.01, pos.z));
				row++;
				col++;
			}
			if (points.length > 1) {
				const geometry = new THREE.BufferGeometry().setFromPoints(points);
				const line = new THREE.Line(geometry, gridMaterial);
				this.boardGroup.add(line);
			}
		}
	}

	/**
	 * Get world position for triangular grid coordinates
	 * row: 0 to (baseRows - level - 1)
	 * col: 0 to row
	 * level: 0 to (baseRows - 1)
	 *
	 * For triangular pyramid stacking:
	 * - Base level positions form a triangular grid
	 * - Upper level positions sit at the centroid of their 3 supporting cubes
	 * - Corner-balanced cubes have their center at cubeHalfHeight above the bottom corner
	 */
	getWorldPosition(row, col, level) {
		const spacing = this.slotSpacing;

		if (level === 0) {
			// Base level: standard triangular grid
			// Row 0 has 1 position (apex of triangle at back)
			// Row 4 has 5 positions (base of triangle at front)

			// Flip the z-axis so row 0 is at back, row 4 is at front
			const maxRow = this.baseRows - 1;
			const flippedRow = maxRow - row;

			// X position: centered within the row
			const rowOffset = row * spacing * 0.5;
			const x = col * spacing - rowOffset;

			// Z position: flipped so larger rows are at front (negative z)
			const z = -flippedRow * spacing * 0.866;

			// Center the triangle
			const baseCenterZ = -maxRow * spacing * 0.866 / 2;

			return {
				x,
				y: this.cubeHalfHeight,
				z: z - baseCenterZ
			};
		} else {
			// Upper levels: position at centroid of the 3 supporting cubes
			// Support positions at level-1: (row, col), (row+1, col), (row+1, col+1)
			const support1 = this.getWorldPosition(row, col, level - 1);
			const support2 = this.getWorldPosition(row + 1, col, level - 1);
			const support3 = this.getWorldPosition(row + 1, col + 1, level - 1);

			return {
				x: (support1.x + support2.x + support3.x) / 3,
				y: level * this.levelHeight + this.cubeHalfHeight,
				z: (support1.z + support2.z + support3.z) / 3
			};
		}
	}

	createSlotMesh(row, col, level) {
		// Use hexagon shape for triangular grid slots - larger for easier clicking
		const slotGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 6);
		// Brighter golden/tan colors for each level
		const levelColors = [0xd4a574, 0xdeb887, 0xe8c89a, 0xf2d8ad, 0xfce8c0];
		const slotMaterial = new THREE.MeshStandardMaterial({
			color: levelColors[level] || 0xd4a574,
			roughness: 0.7,
			transparent: true,
			opacity: 0.7
		});

		const slot = new THREE.Mesh(slotGeometry, slotMaterial);
		const pos = this.getWorldPosition(row, col, level);

		// Position at the bottom corner where the cube would balance
		slot.position.set(pos.x, pos.y - this.cubeHalfHeight + 0.1, pos.z);
		slot.userData = { row, col, level, type: 'slot' };

		return slot;
	}

	createCubeMesh(cube) {
		const size = this.cubeSize;

		// Create cube geometry
		const geometry = new THREE.BoxGeometry(size, size, size);

		// Create materials for each face - bright and distinct colors
		const whiteMat = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			roughness: 0.3,
			metalness: 0.1
		});
		const blueMat = new THREE.MeshStandardMaterial({
			color: 0x3b82f6,
			roughness: 0.3,
			metalness: 0.1
		});

		// Face order in Three.js BoxGeometry: +X, -X, +Y, -Y, +Z, -Z
		// Indices:                            0    1    2    3    4    5
		//
		// Physical cube structure: Two pairs of opposite faces are same color,
		// one pair is different. This forces the 2+1 pattern at corners.
		// - +Y/-Y = same color (player's color)
		// - +Z/-Z = same color (opponent's color)
		// - +X/-X = different (player/opponent)
		//
		// Top corner (+1,+1,+1) = +X, +Y, +Z = player, player, opponent = 2+1
		// Bottom corner (-1,-1,-1) = -X, -Y, -Z = opponent, player, opponent = 1+2
		let materials;
		if (cube.owner === PLAYER.WHITE) {
			// +Y/-Y = white/white, +Z/-Z = blue/blue, +X/-X = white/blue
			materials = [whiteMat, blueMat, whiteMat, whiteMat, blueMat, blueMat];
		} else {
			// +Y/-Y = blue/blue, +Z/-Z = white/white, +X/-X = blue/white
			materials = [blueMat, whiteMat, blueMat, blueMat, whiteMat, whiteMat];
		}

		const mesh = new THREE.Mesh(geometry, materials);

		// To balance a cube on its corner with point straight up:
		// With 'YXZ' order, transforms apply as: Rz first, then Rx, then Ry
		// 1. Rz(45°) - align cube diagonal with view
		// 2. Rx(-35.26°) - tilt backward to balance on corner, point up
		// 3. Ry(rotation * 120°) - spin around vertical for player's choice
		mesh.rotation.order = 'YXZ';
		mesh.rotation.z = Math.PI / 4;  // 45° - align diagonal
		mesh.rotation.x = -Math.atan(1 / Math.sqrt(2));  // -35.26° - tilt onto corner
		mesh.rotation.y = (cube.rotation || 0) * (Math.PI * 2 / 3);  // Player's spin

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return mesh;
	}

	/**
	 * Create a preview cube mesh for rotation selection.
	 * Shows which faces will be which color based on the rotation choice.
	 *
	 * @param {string} playerColor - PLAYER.WHITE or PLAYER.BLUE
	 * @param {number} rotation - 0, 1, or 2 (determines which view shows opponent color)
	 * @param {boolean} highlighted - Whether this preview is currently selected
	 */
	createPreviewCubeMesh(playerColor, rotation, highlighted = false) {
		const size = this.cubeSize * 0.9; // Slightly smaller for preview

		const geometry = new THREE.BoxGeometry(size, size, size);

		// Create materials - bright colors for preview
		const whiteMat = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			roughness: 0.3,
			metalness: 0.1,
			transparent: true,
			opacity: highlighted ? 1.0 : 0.8
		});
		const blueMat = new THREE.MeshStandardMaterial({
			color: highlighted ? 0x60a5fa : 0x3b82f6,
			roughness: 0.3,
			metalness: 0.1,
			transparent: true,
			opacity: highlighted ? 1.0 : 0.8
		});

		// Face order: +X, -X, +Y, -Y, +Z, -Z (indices 0-5)
		//
		// Physical cube: Two pairs of opposite faces are same color.
		// - +Y/-Y = player's color (same)
		// - +Z/-Z = opponent's color (same)
		// - +X/-X = player/opponent (different)
		//
		// Top corner (+1,+1,+1) = player, player, opponent = 2+1
		// Bottom corner (-1,-1,-1) = opponent, player, opponent = 1+2
		let materials;
		if (playerColor === PLAYER.WHITE) {
			// +Y/-Y = white/white, +Z/-Z = blue/blue, +X/-X = white/blue
			materials = [whiteMat, blueMat, whiteMat, whiteMat, blueMat, blueMat];
		} else {
			// +Y/-Y = blue/blue, +Z/-Z = white/white, +X/-X = blue/white
			materials = [blueMat, whiteMat, blueMat, blueMat, whiteMat, whiteMat];
		}

		const mesh = new THREE.Mesh(geometry, materials);

		// Apply corner-balanced rotation with point straight up
		// With 'YXZ' order, transforms apply as: Rz first, then Rx, then Ry
		mesh.rotation.order = 'YXZ';
		mesh.rotation.z = Math.PI / 4;  // 45° - align diagonal
		mesh.rotation.x = -Math.atan(1 / Math.sqrt(2));  // -35.26° - tilt onto corner
		mesh.rotation.y = rotation * (Math.PI * 2 / 3);  // Player's spin

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		return mesh;
	}

	/**
	 * Show rotation selection UI for a pending move.
	 * Shows a side panel with rotation options and a preview cube at the board position.
	 *
	 * @param {number} row - Board row
	 * @param {number} col - Board column
	 * @param {number} level - Board level
	 * @param {string} playerColor - PLAYER.WHITE or PLAYER.BLUE
	 */
	showRotationSelection(row, col, level, playerColor) {
		this.clearRotationSelection();

		this.pendingMove = { row, col, level };
		this.currentPlayerColor = playerColor;
		this.selectedRotation = 0;

		// Create initial preview cube at the board position
		this.updatePreviewCube();

		// Show and position the rotation arrows
		if (this.rotationArrowsGroup) {
			const pos = this.getWorldPosition(row, col, level);
			this.rotationArrowsGroup.position.set(pos.x, pos.y, pos.z);
			this.rotationArrowsGroup.visible = true;
		}

		// Add a semi-transparent highlight on the selected slot
		this.highlightPosition(row, col, level, 0xffff00);
	}

	/**
	 * Update the preview cube at the board position based on selected rotation.
	 */
	updatePreviewCube() {
		if (!this.pendingMove) return;

		// Remove existing preview
		if (this.previewMesh) {
			this.previewGroup.remove(this.previewMesh);
			if (this.previewMesh.geometry) this.previewMesh.geometry.dispose();
			if (this.previewMesh.material) {
				if (Array.isArray(this.previewMesh.material)) {
					this.previewMesh.material.forEach(m => m.dispose());
				} else {
					this.previewMesh.material.dispose();
				}
			}
			this.previewMesh = null;
		}

		const { row, col, level } = this.pendingMove;
		const pos = this.getWorldPosition(row, col, level);

		// Create new preview cube with selected rotation
		this.previewMesh = this.createPreviewCubeMesh(this.currentPlayerColor, this.selectedRotation, true);
		this.previewMesh.position.set(pos.x, pos.y, pos.z);

		this.previewGroup.add(this.previewMesh);
	}

	/**
	 * Clear the rotation selection UI.
	 */
	clearRotationSelection() {
		// Hide the rotation arrows
		if (this.rotationArrowsGroup) {
			this.rotationArrowsGroup.visible = false;
		}

		// Remove preview mesh
		if (this.previewMesh) {
			this.previewGroup.remove(this.previewMesh);
			if (this.previewMesh.geometry) this.previewMesh.geometry.dispose();
			if (this.previewMesh.material) {
				if (Array.isArray(this.previewMesh.material)) {
					this.previewMesh.material.forEach(m => m.dispose());
				} else {
					this.previewMesh.material.dispose();
				}
			}
			this.previewMesh = null;
		}

		this.pendingMove = null;
		this.selectedRotation = 0;

		// Clear the highlight
		while (this.highlightGroup.children.length > 0) {
			this.highlightGroup.remove(this.highlightGroup.children[0]);
		}
	}

	/**
	 * Cancel the current rotation selection and return to normal state.
	 */
	cancelRotationSelection() {
		this.clearRotationSelection();
	}

	setupEventListeners(container) {
		// Track pointer position to distinguish clicks from drags
		let pointerDownPos = null;
		const DRAG_THRESHOLD = 5; // pixels

		const onPointerDown = (event) => {
			const clientX = event.touches ? event.touches[0].clientX : event.clientX;
			const clientY = event.touches ? event.touches[0].clientY : event.clientY;
			pointerDownPos = { x: clientX, y: clientY };
		};

		container.addEventListener('mousedown', onPointerDown);
		container.addEventListener('touchstart', onPointerDown);

		// Click/tap handler
		const onPointerUp = (event) => {
			const rect = this.renderer.domElement.getBoundingClientRect();
			let clientX, clientY;

			if (event.changedTouches) {
				clientX = event.changedTouches[0].clientX;
				clientY = event.changedTouches[0].clientY;
			} else {
				clientX = event.clientX;
				clientY = event.clientY;
			}

			// Check if this was a drag (not a click)
			const wasDrag = pointerDownPos && (
				Math.abs(clientX - pointerDownPos.x) > DRAG_THRESHOLD ||
				Math.abs(clientY - pointerDownPos.y) > DRAG_THRESHOLD
			);
			pointerDownPos = null;

			// If it was a drag, don't process as a click
			if (wasDrag) {
				return;
			}

			this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
			this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

			this.raycaster.setFromCamera(this.mouse, this.camera);

			// If rotation selection is active, check for arrow/confirm clicks first
			if (this.pendingMove && this.rotationArrowsGroup && this.rotationArrowsGroup.visible) {
				// Get all meshes from the rotation arrows group
				const arrowMeshes = [];
				this.rotationArrowsGroup.traverse((obj) => {
					if (obj.isMesh) arrowMeshes.push(obj);
				});

				const arrowIntersects = this.raycaster.intersectObjects(arrowMeshes, true);
				if (arrowIntersects.length > 0) {
					const clicked = arrowIntersects[0].object;
					// Walk up to find userData
					let obj = clicked;
					while (obj && !obj.userData?.type) {
						obj = obj.parent;
					}

					if (obj?.userData?.type === 'rotationArrow') {
						this.rotatePreview(obj.userData.direction);
						return;
					}
					if (obj?.userData?.type === 'confirmButton') {
						this.confirmRotationSelection();
						return;
					}
				}

				// Check if clicking on a slot
				const slotIntersects = this.raycaster.intersectObjects(this.slotMeshes);
				if (slotIntersects.length === 0) {
					// Clicked on empty space - cancel rotation selection
					this.cancelRotationSelection();
					return;
				}

				// A slot was clicked while rotation selection is active
				const clickedSlot = slotIntersects[0].object;
				if (clickedSlot.userData && clickedSlot.userData.type === 'slot') {
					const { row, col, level } = this.pendingMove;
					const clickedRow = clickedSlot.userData.row;
					const clickedCol = clickedSlot.userData.col;
					const clickedLevel = clickedSlot.userData.level;

					if (clickedRow === row && clickedCol === col && clickedLevel === level) {
						// Clicked the same slot - confirm the move
						this.confirmRotationSelection();
					} else {
						// Clicked a different slot - switch selection to that slot
						if (this.onSlotClick) {
							this.onSlotClick(clickedRow, clickedCol, clickedLevel);
						}
					}
				}
				return;
			}

			// Check for slot clicks (no rotation selection active)
			const intersects = this.raycaster.intersectObjects(this.slotMeshes);

			if (intersects.length > 0) {
				const slot = intersects[0].object;
				if (slot.userData && slot.userData.type === 'slot') {
					if (this.onSlotClick) {
						this.onSlotClick(slot.userData.row, slot.userData.col, slot.userData.level);
					}
				}
			}
		};

		container.addEventListener('click', onPointerUp);
		container.addEventListener('touchend', (event) => {
			event.preventDefault(); // Prevent synthetic click event on mobile
			onPointerUp(event);
		});

		// Hover effect
		const onPointerMove = (event) => {
			if (this.isMobile) return;

			const rect = this.renderer.domElement.getBoundingClientRect();
			this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

			this.raycaster.setFromCamera(this.mouse, this.camera);
			const intersects = this.raycaster.intersectObjects(this.slotMeshes);

			// Reset all slot appearances
			for (const slot of this.slotMeshes) {
				if (!slot.userData.highlighted) {
					slot.material.opacity = 0.6;
					slot.scale.set(1, 1, 1);
				}
			}

			if (intersects.length > 0) {
				const slot = intersects[0].object;
				slot.material.opacity = 1.0;
				slot.scale.set(1.3, 1.3, 1.3);
			}
		};

		container.addEventListener('mousemove', onPointerMove);

		// Resize handler
		const onResize = () => {
			const width = container.clientWidth;
			const height = container.clientHeight;
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(width, height);
		};

		window.addEventListener('resize', onResize);
	}

	animate() {
		requestAnimationFrame(() => this.animate());

		if (this.controls) {
			this.controls.update();
		}

		if (this.renderer && this.scene && this.camera) {
			this.renderer.render(this.scene, this.camera);
		}
	}

	actuate(board, winner, winningAngle, lastMove, currentPlayer) {
		if (!this.initialized) return;

		this.currentBoard = board;

		// Update the turn indicator and border
		const playerColor = currentPlayer === PLAYER.WHITE ? PLAYER.WHITE : PLAYER.BLUE;
		this.updateTurnIndicator(playerColor, winner !== null);

		// Clear existing cubes
		while (this.cubesGroup.children.length > 0) {
			this.cubesGroup.remove(this.cubesGroup.children[0]);
		}

		// Clear existing slots
		while (this.slotsGroup.children.length > 0) {
			this.slotsGroup.remove(this.slotsGroup.children[0]);
		}
		this.slotMeshes = [];

		// Clear highlights
		while (this.highlightGroup.children.length > 0) {
			this.highlightGroup.remove(this.highlightGroup.children[0]);
		}

		// Add cubes from board state
		const cubes = board.getAllCubes();
		for (const cube of cubes) {
			const mesh = this.createCubeMesh(cube);
			const pos = this.getWorldPosition(cube.row, cube.col, cube.level);

			mesh.position.set(pos.x, pos.y, pos.z);
			this.cubesGroup.add(mesh);
		}

		// Create slot markers for all possible moves
		const possibleMoves = board.getPossibleMoves();
		for (const move of possibleMoves) {
			const slot = this.createSlotMesh(move.row, move.col, move.level);
			this.slotsGroup.add(slot);
			this.slotMeshes.push(slot);
		}

		// Highlight last move
		if (lastMove) {
			this.highlightPosition(lastMove.row, lastMove.col, lastMove.level, 0x44ff44);
		}

		// Highlight winning line if game is won
		if (winner && winningAngle !== null) {
			// TODO: Implement winning line highlight for triangular grid
		}

		// Draw the 2D perspective views
		this.drawPerspectiveViews(board);
	}

	/**
	 * Draw 2D projections of the pyramid from each of the 3 viewing angles.
	 * Each view shows what color you'd see looking through each "column" of positions.
	 */
	drawPerspectiveViews(board) {
		if (!this.viewCanvases || this.viewCanvases.length < 3) return;

		const viewAngles = [0, 1, 2]; // Front, Left, Right

		for (let viewIndex = 0; viewIndex < 3; viewIndex++) {
			this.drawSingleView(this.viewCanvases[viewIndex], board, viewAngles[viewIndex]);
		}
	}

	/**
	 * Draw a single perspective view of the pyramid.
	 *
	 * For each viewing angle, we project the pyramid onto a 2D triangular grid.
	 * Each cell shows the color of the first cube visible from that angle,
	 * looking "through" the pyramid from outside.
	 *
	 * Cells are drawn as diamond-oriented squares to help visualize adjacency -
	 * only cells whose sides touch (not corners) count as being "in a row".
	 */
	drawSingleView(canvas, board, viewAngle) {
		const ctx = canvas.getContext('2d');
		const width = canvas.width;
		const height = canvas.height;

		// Clear canvas with brighter background
		ctx.fillStyle = '#4a5568';
		ctx.fillRect(0, 0, width, height);

		// For a triangular pyramid, each view shows a triangular projection
		// The projection has the same structure as the base: 6 rows

		// Scale diamond size based on canvas width
		const diamondSize = this.isMobile ? 6 : 10; // Half-diagonal of each diamond
		const startX = width / 2;
		const startY = diamondSize + (this.isMobile ? 3 : 5);

		// Draw the triangular grid for this view
		// Spacing set so diamond edges touch (no gaps)
		for (let row = 0; row < this.baseRows; row++) {
			for (let col = 0; col <= row; col++) {
				// Calculate position for this cell in the 2D view
				// Horizontal: 2 * diamondSize between adjacent cells
				// Vertical: diamondSize between rows (diamonds touch point-to-point)
				const x = startX + (col - row / 2) * (diamondSize * 2);
				const y = startY + row * diamondSize;

				// Find what color is visible at this position from this view angle
				const visibleColor = this.getVisibleColorAt(board, row, col, viewAngle);

				// Draw diamond-oriented square (rotated 45°)
				ctx.beginPath();
				ctx.moveTo(x, y - diamondSize);         // Top
				ctx.lineTo(x + diamondSize, y);         // Right
				ctx.lineTo(x, y + diamondSize);         // Bottom
				ctx.lineTo(x - diamondSize, y);         // Left
				ctx.closePath();

				if (visibleColor === 'white') {
					ctx.fillStyle = '#ffffff';
					ctx.fill();
					ctx.strokeStyle = '#e0e0e0';
					ctx.stroke();
				} else if (visibleColor === 'blue') {
					ctx.fillStyle = '#3b82f6';
					ctx.fill();
					ctx.strokeStyle = '#2563eb';
					ctx.stroke();
				} else {
					// Empty - draw outline only
					ctx.strokeStyle = '#6b7280';
					ctx.stroke();
				}
			}
		}

		// Draw view angle indicator
		ctx.fillStyle = '#d1d5db';
		ctx.font = this.isMobile ? '8px sans-serif' : '10px sans-serif';
		ctx.textAlign = 'center';
		const angleLabels = ['Front', 'Left', 'Right'];
		ctx.fillText(`Angle: ${angleLabels[viewAngle]}`, width / 2, height - (this.isMobile ? 3 : 5));
	}

	/**
	 * Get the color visible at a projected (row, col) position from a given view angle.
	 * Delegates to the board's implementation which handles the coordinate transforms
	 * and face mapping correctly.
	 */
	getVisibleColorAt(board, projRow, projCol, viewAngle) {
		return board.getVisibleColorAt(projRow, projCol, viewAngle);
	}

	highlightPosition(row, col, level, color) {
		const pos = this.getWorldPosition(row, col, level);

		const geometry = new THREE.RingGeometry(0.4, 0.52, 32);
		const material = new THREE.MeshBasicMaterial({
			color: color,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.8
		});
		const ring = new THREE.Mesh(geometry, material);
		ring.rotation.x = -Math.PI / 2;
		// Position at the bottom corner point
		ring.position.set(pos.x, pos.y - this.cubeHalfHeight + 0.15, pos.z);
		this.highlightGroup.add(ring);
	}

	showPossibleMoves(moves) {
		for (const slot of this.slotMeshes) {
			const isMatch = moves.some(m =>
				m.row === slot.userData.row &&
				m.col === slot.userData.col &&
				m.level === slot.userData.level
			);
			if (isMatch) {
				slot.userData.highlighted = true;
				slot.material.color.setHex(0x00aa00);
				slot.material.opacity = 1.0;
			}
		}
	}

	clearPossibleMoves() {
		for (const slot of this.slotMeshes) {
			slot.userData.highlighted = false;
			slot.material.opacity = 0.6;
		}
	}

	cleanup() {
		if (this.renderer) {
			this.renderer.dispose();
		}
		if (this.controls) {
			this.controls.dispose();
		}
	}
}
