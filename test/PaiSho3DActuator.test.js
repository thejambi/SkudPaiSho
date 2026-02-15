/**
 * PaiSho3DActuator Tests
 * Tests for camera state preservation across actuator recreation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mock Vector3 with working clone/copy/set ---
function MockVector3(x = 0, y = 0, z = 0) {
	this.x = x;
	this.y = y;
	this.z = z;
}
MockVector3.prototype.set = function(x, y, z) {
	this.x = x; this.y = y; this.z = z;
	return this;
};
MockVector3.prototype.clone = function() {
	return new MockVector3(this.x, this.y, this.z);
};
MockVector3.prototype.copy = function(v) {
	this.x = v.x; this.y = v.y; this.z = v.z;
	return this;
};
MockVector3.prototype.normalize = function() { return this; };
MockVector3.prototype.lerpVectors = function() { return this; };

function MockVector2(x = 0, y = 0) {
	this.x = x;
	this.y = y;
}

// --- Mock geometry constructor ---
function MockGeometry() {
	this.translate = vi.fn().mockReturnValue(this);
	this.rotateX = vi.fn().mockReturnValue(this);
	this.rotateY = vi.fn().mockReturnValue(this);
	this.clone = vi.fn(() => new MockGeometry());
	this.dispose = vi.fn();
	this.setFromPoints = vi.fn().mockReturnValue(this);
}

// --- Mock Three.js ---
vi.mock('three', () => {
	function MockMaterial() {
		this.dispose = vi.fn();
		this.transparent = false;
		this.opacity = 1;
	}
	return {
		Scene: vi.fn(function() {
			this.add = vi.fn();
			this.traverse = vi.fn();
			this.children = [];
			this.background = null;
		}),
		PerspectiveCamera: vi.fn(function() {
			this.position = new MockVector3(0, 16, 13);
			this.lookAt = vi.fn();
			this.aspect = 1;
			this.updateProjectionMatrix = vi.fn();
		}),
		WebGLRenderer: vi.fn(function() {
			this.setPixelRatio = vi.fn();
			this.setSize = vi.fn();
			this.render = vi.fn();
			this.dispose = vi.fn();
			this.shadowMap = { enabled: false, type: 0 };
			this.domElement = {
				style: {},
				getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0, width: 800, height: 800 })),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			};
		}),
		Vector2: vi.fn(function(x, y) { MockVector2.call(this, x, y); }),
		Vector3: vi.fn(function(x, y, z) { MockVector3.call(this, x, y, z); }),
		Color: vi.fn(function() {}),
		Group: vi.fn(function() {
			this.children = [];
			this.add = vi.fn(function(child) { this.children.push(child); });
			this.remove = vi.fn(function(child) {
				const idx = this.children.indexOf(child);
				if (idx >= 0) this.children.splice(idx, 1);
			});
		}),
		Raycaster: vi.fn(function() {
			this.setFromCamera = vi.fn();
			this.intersectObjects = vi.fn(() => []);
		}),
		TextureLoader: vi.fn(function() {
			this.load = vi.fn((url, cb) => {
				const tex = { colorSpace: '', center: { set: vi.fn() }, rotation: 0, image: {} };
				return tex;
			});
		}),
		AmbientLight: vi.fn(function() {}),
		DirectionalLight: vi.fn(function() {
			this.position = new MockVector3();
			this.castShadow = false;
			this.shadow = {
				mapSize: { width: 0, height: 0 },
				camera: { near: 0, far: 0, left: 0, right: 0, top: 0, bottom: 0 },
			};
		}),
		Mesh: vi.fn(function() {
			this.position = new MockVector3();
			this.receiveShadow = false;
			this.castShadow = false;
			this.userData = {};
		}),
		Line: vi.fn(function() {}),
		CylinderGeometry: MockGeometry,
		CircleGeometry: MockGeometry,
		RingGeometry: MockGeometry,
		PlaneGeometry: MockGeometry,
		BoxGeometry: MockGeometry,
		BufferGeometry: MockGeometry,
		ConeGeometry: MockGeometry,
		MeshStandardMaterial: MockMaterial,
		MeshBasicMaterial: MockMaterial,
		LineBasicMaterial: MockMaterial,
		SRGBColorSpace: 'srgb',
		PCFSoftShadowMap: 2,
		DoubleSide: 2,
		MOUSE: { ROTATE: 0, PAN: 2 },
	};
});

// --- Mock OrbitControls ---
vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
	OrbitControls: vi.fn(function() {
		this.enableDamping = false;
		this.dampingFactor = 0;
		this.maxPolarAngle = 0;
		this.minDistance = 0;
		this.maxDistance = 0;
		this.target = new MockVector3();
		this.mouseButtons = {};
		this.update = vi.fn();
		this.dispose = vi.fn();
	}),
}));

// --- Mock game modules ---
vi.mock('../js/CommonNotationObjects', () => ({
	RowAndColumn: vi.fn(function(r, c) {
		this.notationPointString = `${r},${c}`;
	}),
}));

vi.mock('../js/GameData', () => ({
	debug: vi.fn(),
}));

vi.mock('../js/PaiSho3DOptions', () => ({
	getRoundBoardPreference: vi.fn(() => 'true'),
	isHelpCollapsed: vi.fn(() => false),
	setHelpCollapsed: vi.fn(),
}));

vi.mock('../js/PaiShoMain', () => ({
	RmbDown: vi.fn(),
	RmbUp: vi.fn(),
	clearMessage: vi.fn(),
	customBgColorKey: 'customBgColor',
	customBoardUrlArrayKey: 'customBoardUrlArray',
	customBoardUrlKey: 'customBoardUrl',
	paiShoBoardKey: 'default',
	pointClicked: vi.fn(),
	showPointMessage: vi.fn(),
	showTileMessage: vi.fn(),
	svgBoardDesigns: [],
	unplayedTileClicked: vi.fn(),
}));

vi.mock('../js/skud-pai-sho/SkudPaiShoBoardPoint', () => ({
	NON_PLAYABLE: 'NonPlayable',
}));

// --- Import after mocks ---
import { PaiSho3DActuator } from '../js/PaiSho3DActuator';

// Test subclass implementing abstract methods
class TestActuator extends PaiSho3DActuator {
	getHostTilesContainerDivs() { return ''; }
	getGuestTilesContainerDivs() { return ''; }
	render3DGame() {}
}

function createGameContainer() {
	return {
		firstChild: null,
		appendChild: vi.fn(),
		removeChild: vi.fn(),
		querySelector: vi.fn(() => null),
	};
}

describe('PaiSho3DActuator camera state preservation', () => {
	let rafCallbacks;

	beforeEach(() => {
		// Clear static state between tests
		PaiSho3DActuator.savedCameraState = null;

		// Ensure window has addEventListener/removeEventListener (not in setup.js mock)
		globalThis.window.addEventListener = vi.fn();
		globalThis.window.removeEventListener = vi.fn();
		globalThis.window.innerWidth = 800;
		globalThis.window.innerHeight = 800;

		// Capture requestAnimationFrame callbacks so we can invoke the render loop manually
		rafCallbacks = [];
		vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
			rafCallbacks.push(cb);
			return rafCallbacks.length;
		});
		vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
	});

	it('should have no saved camera state on first creation', () => {
		expect(PaiSho3DActuator.savedCameraState).toBeNull();

		const actuator = new TestActuator(createGameContainer(), false, false);
		// Camera should be at default position
		expect(actuator.camera.position.x).toBe(0);
		expect(actuator.camera.position.y).toBe(16);
		expect(actuator.camera.position.z).toBe(13);
	});

	it('should save camera state during render loop', () => {
		const actuator = new TestActuator(createGameContainer(), false, false);

		// Move camera to a custom position
		actuator.camera.position.set(5, 10, 7);
		actuator.controls.target.set(1, 2, 3);

		// Simulate one frame of the render loop
		expect(rafCallbacks.length).toBeGreaterThan(0);
		const renderCallback = rafCallbacks[rafCallbacks.length - 1];
		renderCallback();

		// Verify state was saved
		expect(PaiSho3DActuator.savedCameraState).not.toBeNull();
		expect(PaiSho3DActuator.savedCameraState.position.x).toBe(5);
		expect(PaiSho3DActuator.savedCameraState.position.y).toBe(10);
		expect(PaiSho3DActuator.savedCameraState.position.z).toBe(7);
		expect(PaiSho3DActuator.savedCameraState.target.x).toBe(1);
		expect(PaiSho3DActuator.savedCameraState.target.y).toBe(2);
		expect(PaiSho3DActuator.savedCameraState.target.z).toBe(3);
	});

	it('should restore camera state when a new actuator is created', () => {
		// Simulate saved state from a previous actuator
		PaiSho3DActuator.savedCameraState = {
			position: new MockVector3(3, 8, -2),
			target: new MockVector3(0.5, 1, -0.5),
		};

		const actuator = new TestActuator(createGameContainer(), false, false);

		// Camera should be restored to saved position
		expect(actuator.camera.position.x).toBe(3);
		expect(actuator.camera.position.y).toBe(8);
		expect(actuator.camera.position.z).toBe(-2);

		// Controls target should be restored
		expect(actuator.controls.target.x).toBe(0.5);
		expect(actuator.controls.target.y).toBe(1);
		expect(actuator.controls.target.z).toBe(-0.5);

		// controls.update() should have been called to apply restored state
		expect(actuator.controls.update).toHaveBeenCalled();
	});

	it('should clear saved camera state on dispose', () => {
		PaiSho3DActuator.savedCameraState = {
			position: new MockVector3(1, 2, 3),
			target: new MockVector3(0, 0, 0),
		};

		const actuator = new TestActuator(createGameContainer(), false, false);
		actuator.dispose();

		expect(PaiSho3DActuator.savedCameraState).toBeNull();
	});

	it('full lifecycle: camera state preserved across actuator recreation', () => {
		// 1. Create first actuator (simulates initial game load)
		const actuator1 = new TestActuator(createGameContainer(), false, false);

		// 2. User rotates camera to a custom angle
		actuator1.camera.position.set(-4, 12, 9);
		actuator1.controls.target.set(0, 0.5, 0);

		// 3. Render loop saves the state
		const renderCallback = rafCallbacks[rafCallbacks.length - 1];
		renderCallback();

		// 4. Game update triggers actuator recreation (the bug scenario)
		const actuator2 = new TestActuator(createGameContainer(), false, false);

		// 5. Camera should be at the user's custom angle, not reset to default
		expect(actuator2.camera.position.x).toBe(-4);
		expect(actuator2.camera.position.y).toBe(12);
		expect(actuator2.camera.position.z).toBe(9);
		expect(actuator2.controls.target.x).toBe(0);
		expect(actuator2.controls.target.y).toBe(0.5);
		expect(actuator2.controls.target.z).toBe(0);
	});

	it('saved state should be a clone, not a reference', () => {
		const actuator = new TestActuator(createGameContainer(), false, false);
		actuator.camera.position.set(1, 2, 3);

		// Run render loop to save state
		const renderCallback = rafCallbacks[rafCallbacks.length - 1];
		renderCallback();

		// Modify camera after save
		actuator.camera.position.set(99, 99, 99);

		// Saved state should still have original values (was cloned)
		expect(PaiSho3DActuator.savedCameraState.position.x).toBe(1);
		expect(PaiSho3DActuator.savedCameraState.position.y).toBe(2);
		expect(PaiSho3DActuator.savedCameraState.position.z).toBe(3);
	});
});
