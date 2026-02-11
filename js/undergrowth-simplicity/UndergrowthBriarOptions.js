// Undergrowth Briar Options

import { clearMessage, gameController } from '../PaiShoMain';
import { AdevarOptions } from '../adevar/AdevarOptions';

var pieceStyleKey = "undergrowthBriarPieceStyle";
var centerpieceKey = "undergrowthBriarCenterpiece";

export function UndergrowthBriarOptions() {
	// Initialize default if not set
	if (!localStorage.getItem(pieceStyleKey)) {
		localStorage.setItem(pieceStyleKey, "monochrome");
	}
}

UndergrowthBriarOptions.useTileBack = function() {
	return localStorage.getItem(pieceStyleKey) === "adevarBack";
};

UndergrowthBriarOptions.togglePieceStyle = function() {
	if (UndergrowthBriarOptions.useTileBack()) {
		localStorage.setItem(pieceStyleKey, "monochrome");
	} else {
		localStorage.setItem(pieceStyleKey, "adevarBack");
	}
	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
	clearMessage();
};

UndergrowthBriarOptions.getTileSrc = function(ownerCode) {
	if (UndergrowthBriarOptions.useTileBack()) {
		var adevarKey = localStorage.getItem(AdevarOptions.tileDesignTypeKey) || "gaoling";
		return "images/Adevar/" + adevarKey + "/" + ownerCode + "Back.png";
	}
	return "images/Adevar/monochrome/" + ownerCode + "Back.png";
};

UndergrowthBriarOptions.getCenterpiece = function() {
	return localStorage.getItem(centerpieceKey) || "briar";
};

UndergrowthBriarOptions.toggleCenterpiece = function() {
	var current = UndergrowthBriarOptions.getCenterpiece();
	localStorage.setItem(centerpieceKey, current === "tree" ? "briar" : "tree");
	if (gameController && gameController.callActuate) {
		gameController.callActuate();
	}
	clearMessage();
};

UndergrowthBriarOptions.buildToggleCenterpieceDiv = function() {
	var div = document.createElement("div");

	var textSpan = document.createElement("span");
	var current = UndergrowthBriarOptions.getCenterpiece() === "tree" ? "Tree" : "Briar";
	textSpan.textContent = "3D centerpiece: " + current + " ";
	div.appendChild(textSpan);

	var toggleSpan = document.createElement("span");
	toggleSpan.className = "skipBonus";
	toggleSpan.textContent = "toggle";
	toggleSpan.onclick = function() {
		UndergrowthBriarOptions.toggleCenterpiece();
	};
	div.appendChild(toggleSpan);

	return div;
};

UndergrowthBriarOptions.buildTogglePieceStyleDiv = function() {
	var div = document.createElement("div");

	var textSpan = document.createElement("span");
	var current = UndergrowthBriarOptions.useTileBack() ? "Tile Back" : "Monochrome";
	textSpan.textContent = "Piece style: " + current + " ";
	div.appendChild(textSpan);

	var toggleSpan = document.createElement("span");
	toggleSpan.className = "skipBonus";
	toggleSpan.textContent = "toggle";
	toggleSpan.onclick = function() {
		UndergrowthBriarOptions.togglePieceStyle();
	};
	div.appendChild(toggleSpan);

	return div;
};
