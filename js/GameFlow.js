// Game flow UI elements: skip/reset buttons and their display.
// Dependencies: GameState, UiInteraction.

import { activeAi, gameController } from './GameState';
import { getGameMessageElement } from './UiInteraction';

/* ── Skip ────────────────────────────────────────────── */

export function skipClicked() {
	if (gameController && gameController.skipClicked) {
		gameController.skipClicked();
	}
}

export function getSkipButtonElement(overrideText) {
	let text = "Skip";
	if (overrideText) {
		text = overrideText;
	}

	const container = document.createElement("span");
	container.appendChild(document.createElement("br"));

	const button = document.createElement("button");
	button.style.fontSize = "medium";
	button.textContent = text;
	button.onclick = function() {
		skipClicked();
	};

	container.appendChild(button);
	return container;
}

export function showSkipButtonMessage(overrideText) {
	getGameMessageElement().appendChild(getSkipButtonElement(overrideText));
}

/* ── Reset Move ──────────────────────────────────────── */

export function getResetMoveElement() {
	if (activeAi) {
		return document.createElement("span");	// Return empty span if playing against an AI
	}

	const container = document.createElement("span");

	if (!gameController.undoMoveAllowed || gameController.undoMoveAllowed()) {
		container.appendChild(document.createElement("br"));

		const span = document.createElement("span");
		span.className = "skipBonus";
		span.textContent = "Undo move";
		span.onclick = function() {
			// resetMove stays in PaiShoMain; use window binding
			window.resetMove();
		};

		container.appendChild(span);
	}

	return container;
}

export function showResetMoveMessage() {
	getGameMessageElement().appendChild(getResetMoveElement());
}
