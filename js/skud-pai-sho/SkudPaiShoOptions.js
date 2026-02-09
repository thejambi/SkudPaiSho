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

export function isRoundBoardOn() {
	return localStorage.getItem(roundBoardKey) === "true";
}

export function toggleRoundBoard() {
	const newValue = !isRoundBoardOn();
	localStorage.setItem(roundBoardKey, newValue.toString());
	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
}
