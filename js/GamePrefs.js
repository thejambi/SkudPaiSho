// Game preference keys, tile/board design values, and preference UI builders.
// Dependencies: GameState (gameController), ModalManager (closeModal, showModalElem), LocalStorage.

import { gameController } from './GameState';
import { closeModal, showModalElem } from './ModalManager';
import { LocalStorage } from './LocalStorage';

const localStorage = new LocalStorage().storage;

/* ── Preference Key Constants ─────────────────────────── */

export const tileDesignTypeKey = "tileDesignTypeKey";
export const tileDesignTypeValues = {
	// hlowe: "Modern Tiles v1",
	tgggyatso: "The Garden Gate Gyatso Tiles",
	gaoling: "TGG Gaoling",
	tggproject: "TGG Pai Sho Project",
	hlowenew: "Modern Tiles",
	vescucci: "Vescucci Tiles",
	vescuccicolor: "Classy Vescucci",
	minimalist: "TGG Minimalist",
	chujimono: "Chu Ji Canon Tiles",
	chujired: "Chu Ji Red",
	azulejos: "Azulejos by Cannoli",
	keygyatso: "Key Pai Sho Gyatso Style",
	pixelsho: "Pixel Sho v1 Tiles",
	pixelsho2: "Pixel Sho v2 Tiles",
	xiangqi: "Xiangqi Style",
	standard: "Pai Sho Project Tiles",
	tggproject2: "TGG Project Alt Colors",
	rusticgyatso: "Rustic Gyatso TGG Project Tiles",
	tggwatertribe: "Northern Water Tribe TGG Project",
	hlowemono: "Modern Monochrome Tiles",
	modernwood: "Modern Wooden Tiles",
	tggprojectmono: "TGG Pai Sho Project Monochrome",
	vescuccicolored: "Vescucci Alt Colors",
	vescuccicolored2: "Vescucci Alt Colors 2",
	water: "Water-Themed Vescucci Tiles",
	earth: "Earth-Themed Vescucci Tiles",
	chujiblue: "Chu Ji Canon - Blue",
	azulejosmono: "Azulejos Monocromos",
	azulejosdemadera: "Azulejos de Madera",
	tggroyal: "TGG Royal",
	custom: "Use Custom Designs"
};

export const vagabondTileDesignTypeKey = "vagabondTileDesignTypeKey";

export const paiShoBoardDesignTypeKey = "paiShoBoardDesignTypeKey";
export const customBoardUrlKey = "customBoardUrlKey";
export const customBoardUrlArrayKey = "customBoardUrlArrayKey";

export const animationsOnKey = "animationsOn";
export const confirmMoveKey = "confirmMove";
export const createNonRankedGamePreferredKey = "createNonRankedGamePreferred";

export const customBgColorKey = "customBgColorKey";

export let skudTilesKey = "tgggyatso";
export function setSkudTilesKey(val) { skudTilesKey = val; }

export let paiShoBoardKey = "default";
export function setPaiShoBoardKey(val) { paiShoBoardKey = val; }

export let paiShoBoardDesignTypeValues = {};
export function setPaiShoBoardDesignTypeValues(val) { paiShoBoardDesignTypeValues = val; }

export const svgBoardDesigns = [
	"lightmode",
	"darkmode",
	"xiangqi"
];

/* ── UI Builders ──────────────────────────────────────── */

export function buildDropdownDiv(dropdownId, labelText, valuesObject, selectedObjectKey, onchangeFunction) {
	const containerDiv = document.createElement("div");

	const theDropdown = document.createElement("select");
	theDropdown.id = dropdownId;

	const label = document.createElement("label");
	label.for = dropdownId;
	label.innerText = labelText;

	Object.keys(valuesObject).forEach((key) => {
		const option = document.createElement("option");
		option.value = key;
		option.innerText = valuesObject[key];

		if (key === selectedObjectKey) {
			option.selected = true;
		}

		theDropdown.appendChild(option);
	});

	theDropdown.onchange = onchangeFunction;

	containerDiv.appendChild(label);
	containerDiv.appendChild(theDropdown);

	return containerDiv;
}

/* ── Game Preference Accessors ────────────────────────── */

export function getUserGamePrefKeyName(preferenceKey) {
	return "GameType" + gameController.getGameTypeId() + preferenceKey;
}

export function getUserGamePreference(preferenceKey) {
	if (gameController && gameController.getGameTypeId) {
		const keyName = getUserGamePrefKeyName(preferenceKey);
		return localStorage.getItem(keyName);
	}
}

export function setUserGamePreference(preferenceKey, value) {
	if (gameController && gameController.getGameTypeId) {
		const keyName = getUserGamePrefKeyName(preferenceKey);
		localStorage.setItem(keyName, value);
	}
}

export function buildPreferenceDropdownDiv(labelText, dropdownId, valuesObject, preferenceKey) {
	return buildDropdownDiv(dropdownId, labelText + ":", valuesObject,
		getUserGamePreference(preferenceKey),
		function() {
			setUserGamePreference(preferenceKey, this.value);
			gameController.callActuate();
			if (gameController.gamePreferenceSet) {
				gameController.gamePreferenceSet(preferenceKey);
			}
		});
}

/* ── Custom Tile Designs ──────────────────────────────── */

export function setCustomTileDesignsFromInput() {
	let url = document.getElementById('customTileDesignsUrlInput').value;
	url = url.substring(0, url.lastIndexOf("/") + 1);
	if (gameController && gameController.setCustomTileDesignUrl) {
		gameController.setCustomTileDesignUrl(url);
	}
}

export function promptForCustomTileDesigns(gameType, existingCustomTilesUrl) {
	const container = document.createElement('div');

	const p = document.createElement('p');
	p.textContent = "You can use fan-created tile design sets. See the #custom-tile-designs channel in The Garden Gate Discord. Copy and paste the link to one of the images here:";
	container.appendChild(p);

	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode('URL: '));
	const urlInput = document.createElement('input');
	urlInput.type = 'text';
	urlInput.id = 'customTileDesignsUrlInput';
	urlInput.name = 'customTileDesignsUrlInput';
	if (existingCustomTilesUrl) {
		urlInput.value = existingCustomTilesUrl;
	}
	container.appendChild(urlInput);
	container.appendChild(document.createElement('br'));

	container.appendChild(document.createElement('br'));
	const applyDiv = document.createElement('div');
	applyDiv.classList.add('clickableText');
	applyDiv.textContent = 'Apply Custom Tile Designs for ' + gameType.desc;
	applyDiv.onclick = () => { closeModal(); setCustomTileDesignsFromInput(); };
	container.appendChild(applyDiv);

	showModalElem("Use Custom Tile Designs", container);
}
