// UI interaction handlers and game messaging.
// Dependencies: GameState, UserData, TextHelpers, SuperSandbox, GameFlow.

import { showResetMoveMessage } from './GameFlow';
import { activeAi, gameController, getCurrentPlayer, getGameWinner, getGameWinReason, iAmPlayerInCurrentOnlineGame, myTurn, playingOnlineGame } from './GameState';
import { toHeading, toBullets, toMessage } from './TextHelpers';
import { userIsLoggedIn } from './UserData';
import { isSuperSandboxMode, truncateMovesForSuperSandboxMode } from './SuperSandbox';

/* ── Local State ─────────────────────────────────────── */

let defaultHelpMessageText;
let metadata = {};

/* ── Registered handlers (set by PaiShoMain to avoid circular dep) ── */

let _buildPaiShoSettingsDiv = null;
export function registerBuildPaiShoSettingsDivFunction(fn) { _buildPaiShoSettingsDiv = fn; }

/* ── Helpers ─────────────────────────────────────────── */

export function getTournamentText() {
	if (metadata.tournamentMatchNotes) {
		return metadata.tournamentName + "<br />" + metadata.tournamentMatchNotes + "<br />";
	}
	return "";
}

/* ── Message Display ─────────────────────────────────── */

export function getGameMessageElement() {
	const gameMessage = document.querySelector(".gameMessage");
	const gameMessage2 = document.querySelector(".gameMessage2");

	if (gameController.showGameMessageUnderneath) {
		while (gameMessage.firstChild) {
			gameMessage.removeChild(gameMessage.firstChild);
		}
		return gameMessage2;
	} else {
		if (gameMessage2) {
			while (gameMessage2.firstChild) {
				gameMessage2.removeChild(gameMessage2.firstChild);
			}
		}
		return gameMessage;
	}
}

export function getAdditionalMessage() {
	const container = document.createElement("span");

	// Is it the player's turn?
	// TODO Could maybe get rid of this
	if (myTurn() && !userIsLoggedIn()) {
		const youSpan = document.createElement("span");
		youSpan.textContent = " (You) ";
		container.appendChild(youSpan);
	}

	const additionalMsg = gameController.getAdditionalMessage();
	if (additionalMsg) {
		if (typeof additionalMsg === 'string') {
			const msgSpan = document.createElement("span");
			msgSpan.innerHTML = additionalMsg;
			container.appendChild(msgSpan);
		} else {
			container.appendChild(additionalMsg);
		}
	}

	if (getGameWinner()) {
		// There is a winner!
		container.appendChild(document.createElement("br"));
		const winnerSpan = document.createElement("strong");
		winnerSpan.appendChild(document.createTextNode(getGameWinner()));
		const winReason = getGameWinReason();
		if (typeof winReason === 'string') {
			winnerSpan.appendChild(document.createTextNode(winReason));
		} else {
			winnerSpan.appendChild(winReason);
		}
		container.appendChild(winnerSpan);
	} else if (gameController.gameHasEndedInDraw && gameController.gameHasEndedInDraw()) {
		container.appendChild(document.createElement("br"));
		const drawSpan = document.createElement("span");
		drawSpan.textContent = "Game has ended in a draw.";
		container.appendChild(drawSpan);
	}

	return container;
}

export function refreshMessage() {
	const messageElement = getGameMessageElement();
	// Clear the message element
	while (messageElement.firstChild) {
		messageElement.removeChild(messageElement.firstChild);
	}

	if (!playingOnlineGame()) {
		const playerText = document.createElement("span");
		playerText.textContent = "Current Player: " + getCurrentPlayer();
		messageElement.appendChild(playerText);
		messageElement.appendChild(document.createElement("br"));
	}

	const additionalMsg = getAdditionalMessage();
	if (additionalMsg) {
		messageElement.appendChild(additionalMsg);
	}

	if (gameController && gameController.getAdditionalMessageElement) {
		messageElement.appendChild(gameController.getAdditionalMessageElement());
		messageElement.appendChild(document.createElement("br"));
	}

	if ((playingOnlineGame() && iAmPlayerInCurrentOnlineGame() && !myTurn() && !getGameWinner())
		|| gameController.isSolitaire()) {
		showResetMoveMessage();
	}
}

export function setMessage(msg) {
	const helpTextContent = document.getElementById("helpTextContent");

	if (msg instanceof HTMLElement) {
		// Toggle: if same content is already displayed, reset to default
		if (msg.innerHTML === helpTextContent.innerHTML) {
			clearMessage();
			return;
		}
		// Clear existing content
		while (helpTextContent.firstChild) {
			helpTextContent.removeChild(helpTextContent.firstChild);
		}
		// Add tournament text if any
		const tournamentText = getTournamentText();
		if (tournamentText) {
			const tourSpan = document.createElement('span');
			tourSpan.innerHTML = tournamentText;
			helpTextContent.appendChild(tourSpan);
		}
		helpTextContent.appendChild(msg);
	} else {
		if (msg === helpTextContent.innerHTML) {
			clearMessage();
		} else {
			helpTextContent.innerHTML = getTournamentText() + msg;
		}
	}
}

export function clearMessage() {
	const helpTabContentDiv = document.getElementById("helpTextContent");

	// Clear the div
	while (helpTabContentDiv.firstChild) {
		helpTabContentDiv.removeChild(helpTabContentDiv.firstChild);
	}

	// if (!defaultHelpMessageText) {	// Load help message every time
	defaultHelpMessageText = gameController.getDefaultHelpMessageText();
	// }

	const helpSpan = document.createElement("span");
	if (defaultHelpMessageText instanceof HTMLElement) {
		helpSpan.appendChild(defaultHelpMessageText);
	} else {
		helpSpan.innerHTML = defaultHelpMessageText;
	}
	helpTabContentDiv.appendChild(helpSpan);

	const tournamentText = getTournamentText();
	if (tournamentText) {
		const tourSpan = document.createElement("span");
		tourSpan.innerHTML = tournamentText;
		helpTabContentDiv.insertBefore(tourSpan, helpTabContentDiv.firstChild);
	}

	if (gameController.getAdditionalHelpTabDiv) {
		const additionalDiv = gameController.getAdditionalHelpTabDiv();
		if (additionalDiv) {
			helpTabContentDiv.appendChild(additionalDiv);
		}
	}

	if (gameController.isPaiShoGame && _buildPaiShoSettingsDiv) {
		helpTabContentDiv.appendChild(_buildPaiShoSettingsDiv());
	}
}

export function displayReturnedMessage(messageReturned) {
	const heading = messageReturned.heading;
	const message = messageReturned.message;
	const container = document.createElement('div');

	if (heading) {
		container.appendChild(toHeading(heading));
	}

	if (message.length > 1) {
		container.appendChild(toBullets(message));
	} else {
		container.appendChild(toMessage(message));
	}

	setMessage(container);
}

/* ── Input Handlers ──────────────────────────────────── */

export function unplayedTileClicked(tileDiv) {
	/* If super sandbox mode, sandbox game immediately */
	if (isSuperSandboxMode()) {
		truncateMovesForSuperSandboxMode();
	}

	gameController.unplayedTileClicked(tileDiv);
}

export function pointClicked(htmlPoint) {
	/* If super sandbox mode, sandbox game immediately */
	if (isSuperSandboxMode()) {
		truncateMovesForSuperSandboxMode();
	}

	gameController.pointClicked(htmlPoint);
}

export function boardTileHovered(htmlPoint) {
	if (gameController.boardTileHovered) {
		gameController.boardTileHovered(htmlPoint);
	}
}

export function boardTileUnhovered() {
	if (gameController.boardTileUnhovered) {
		gameController.boardTileUnhovered();
	}
}

export function RmbDown(htmlPoint) {
	if (gameController.RmbDown) {
		gameController.RmbDown(htmlPoint);
	}
}

export function RmbUp(htmlPoint) {
	if (gameController.RmbUp) {
		gameController.RmbUp(htmlPoint);
	}
}

export function showTileMessage(tileDiv) {
	const messageReturned = gameController.getTileMessage(tileDiv);
	displayReturnedMessage(messageReturned);
}

export function showPointMessage(htmlPoint) {
	const messageReturned = gameController.getPointMessage(htmlPoint);
	if (messageReturned) {
		displayReturnedMessage(messageReturned);
	}
}
