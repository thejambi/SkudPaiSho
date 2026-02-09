import { gameController } from '../PaiShoMain';

const board3DKey = "skudBoard3DEnabled";
const roundBoardKey = "skudRoundBoardEnabled";

export function is3DBoardOn() {
	return localStorage.getItem(board3DKey) === "true";
}

export function toggle3DBoardOn() {
	const newValue = !is3DBoardOn();
	localStorage.setItem(board3DKey, newValue.toString());
	if (gameController && gameController.set3DBoardOn) {
		gameController.set3DBoardOn(newValue);
	}
}

// Returns null for auto-detect (default), "true" for force round, "false" for force square
export function getRoundBoardPreference() {
	return localStorage.getItem(roundBoardKey);
}

// Cycles: auto -> force round -> force square -> auto
export function cycleRoundBoardPreference() {
	const current = localStorage.getItem(roundBoardKey);
	if (current === null) {
		localStorage.setItem(roundBoardKey, "true");
	} else if (current === "true") {
		localStorage.setItem(roundBoardKey, "false");
	} else {
		localStorage.removeItem(roundBoardKey);
	}
	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
}
