import html2canvas from 'html2canvas';

import { QueryString, gameContainerDiv, showModalElem } from "./PaiShoMain";

// Skud Pai Sho specific game rules have been moved to skud-pai-sho/SkudPaiShoRules.js
// This keeps game-specific configuration separate from shared utilities and constants.

export var customBoardUrl = null;
export function setCustomBoardUrl(newValue) {
	customBoardUrl = newValue;
}

export var debugOn = false;
export function setDebugOn(value) {
	debugOn = value;
}

export var gameDevOn = false;
export function setGameDevOn(value) {
	gameDevOn = value;
}

/* Set to true if building for iOS, else set to false */
export var ios = false;

/* Set to true if building for Android, else set to false */
export var runningOnAndroid = false;

/* */

/* --- */


// Redirect if needed
if (window.location.href.includes("thegg.games")) {
	window.location.replace("https://skudpaisho.com");
}
if (shouldRedirectIfNotHttps() && window.location.href.includes("http://")) {
	window.location.replace(window.location.href.replace("http://", "https://"));
}

export function shouldRedirectIfNotHttps() {
	return false;
	//return !ios || !window.location.href.includes("localhost");
}

export function humanYearsToTreeYears(humanAge) {
	/* f(x)=x+90floor(x/10) */
	return humanAge + 90 * (Math.floor(humanAge / 10));
}


export function debug(str) {
	if (debugOn) {
		if (ios || QueryString.appType === 'ios') {
			try {
				if (typeof webkit !== 'undefined') {
					// eslint-disable-next-line no-undef
					webkit.messageHandlers.callbackHandler.postMessage(
						"{debugMessage:" + str + "}"
					);
				}
			} catch (err) {
				console.log('error');
			}
		}

		console.log(str);
	}
}

export function debugStackTrace() {
	if (debugOn) {
		console.trace();
	}
}

export function masterDebug(str) {
	console.log(str);
}

export function convertToDomObject(htmlStr) {
	var parser = new DOMParser();
	var doc = parser.parseFromString('<div class="htmlMessageDiv">' + htmlStr + '</div>', 'text/html');
	var div = doc.body.firstChild;
	return div;
}

// Tile Types

export var BASIC_FLOWER = "Basic Flower";
export var ACCENT_TILE = "Accent Tile";
export var SPECIAL_FLOWER = "Special Flower";
export var ORIGINAL_BENDER = "Original Bender";

export var ROCK = "Rock";
export var WHEEL = "Wheel";
export var KNOTWEED = "Knotweed";
export var BOAT = "Boat";

export var POND = "Pond";
export var BAMBOO = "Bamboo";
export var LION_TURTLE = "Lion Turtle";

export var WHITE_LOTUS = "White Lotus";
export var ORCHID = "Orchid";

export var BADGERMOLE = "Badgermole";
export var FLYING_BISON = "Flying Bison";
export var KOI = "Koi";
export var DRAGON = "Dragon";

/* Helpful methods, polyfills, etc */
export function TwoWayMap(map) {
	/* https://stackoverflow.com/questions/21070836/how-can-i-create-a-two-way-mapping-in-javascript-or-some-other-way-to-swap-out */
	this.map = map;
	this.reverseMap = {};
	for (var key in map) {
		var value = map[key];
		this.reverseMap[value] = key;
	}
}
TwoWayMap.prototype.lookup = function(key) { return this.map[key]; };
TwoWayMap.prototype.reverseLookup = function(key) { return this.reverseMap[key]; };

export function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function arrayIncludesAll(array1, array2) {
	for (var i = 0; i < array2.length; i++) {
		if (!array1.includes(array2[i])) {
			return false;
		}
	}
	return true;
}

export function arrayIncludesOneOf(arr, targetElements) {
	var found = false;
	if (targetElements && targetElements.length) {
		targetElements.forEach(function(targetElement) {
			if (arr.includes(targetElement)) {
				found = true;
				return true;
			}
		});
	}
	return found;
}

export function copyArray(arr) {
	var copyArr = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] instanceof Array) {
			copyArr.push(copyArray(arr[i]));
		} else if (arr[i].getCopy) {
			copyArr.push(arr[i].getCopy());
		} else {
			copyArr.push(arr[i]);
		}
	}
	return copyArr;
}

export function copyObject(mainObject) {
	var objectCopy = {}; // objectCopy will store a copy of the mainObject
	var key;
	for (key in mainObject) {
		objectCopy[key] = mainObject[key]; // copies each property to the objectCopy object
	}
	return objectCopy;
}

export function getLongestArrayFromArrayOfArrays(arrayOfArrays) {
	var longestYet = null;
	arrayOfArrays.forEach(arr => {
		if (!longestYet || longestYet.length < arr.length) {
			longestYet = arr;
		}
	});
	return longestYet;
}
export function getShortestArrayFromArrayOfArrays(arrayOfArrays) {
	var shortestYet = null;
	arrayOfArrays.forEach(arr => {
		if (!shortestYet || shortestYet.length > arr.length) {
			shortestYet = arr;
		}
	});
	return shortestYet;
}

export function arrayContainsDuplicates(array) {
	return array.length !== new Set(array).size;
}

// Array shuffle
export function shuffleArray(array) {
	var i = 0
		, j = 0
		, temp = null;

	for (i = array.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}

export function removeRandomFromArray(array) {
	if (array && array.length) {
		var randomIndex = Math.floor(Math.random() * array.length);
		var randomEntry = array.splice(randomIndex, 1)[0];
		return randomEntry;
	}
}

export function peekRandomFromArray(array) {
	if (array && array.length) {
		var randomIndex = Math.floor(Math.random() * array.length);
		var randomEntry = array[randomIndex];
		return randomEntry;
	}
}

// polyfill
if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}

if (!Array.prototype.includes) {
	Array.prototype.includes = function(searchElement /*, fromIndex*/) {
		'use strict';
		if (this == null) {
			throw new TypeError('Array.prototype.includes called on null or undefined');
		}

		var O = Object(this);
		var len = parseInt(O.length, 10) || 0;
		if (len === 0) {
			return false;
		}
		var n = parseInt(arguments[1], 10) || 0;
		var k;
		if (n >= 0) {
			k = n;
		} else {
			k = len + n;
			if (k < 0) { k = 0; }
		}
		var currentElement;
		while (k < len) {
			currentElement = O[k];
			if (searchElement === currentElement ||
				(searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
				return true;
			}
			k++;
		}
		return false;
	};
}

export function arrayIntersection(array1, array2) {
	var filteredArray = array1.filter(function(n) {
		return array2.indexOf(n) !== -1;
	});
	return filteredArray;
}

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(searchString, position) {
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};
}

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(searchString, position) {
		var subjectString = this.toString();
		if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.lastIndexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
}



// Warn if overriding existing method
if (Array.prototype.equals)
	console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
	// if the other array is a falsy value, return
	if (!array)
		return false;

	// compare lengths - can save a lot of time
	if (this.length != array.length)
		return false;

	for (var i = 0, l = this.length; i < l; i++) {
		// Check if we have nested arrays
		if (this[i] instanceof Array && array[i] instanceof Array) {
			// recurse into the nested arrays
			if (!this[i].equals(array[i]))
				return false;
		}
		else if (this[i] != array[i]) {
			// Warning - two different object instances will never be equal: {x:20} != {x:20}
			return false;
		}
	}
	return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });


/* Clipboard */
export async function copyTextToClipboard(theText, triggerButton) {
	if (!navigator.clipboard) {
		// Clipboard API not available
		return;
	}
	try {
		await navigator.clipboard.writeText(theText);
		if (triggerButton) {
			triggerButton.innerText = "Copied!";
		}
	} catch (err) {
		console.error('Failed to copy!', err);
	}
}

export async function copyDivToClipboard() {
    html2canvas(document.querySelector(".board-container")).then(canvas => {
		// document.body.appendChild(canvas)

		/*
		var dataURL = canvas.toDataURL();
		var img = new Image();
		img.src = dataURL;
		document.body.appendChild(img);
		*/

		// Convert the canvas content to a blob
		canvas.toBlob(function(blob) {
			// Copy the image to the clipboard
			navigator.clipboard.write([
				new ClipboardItem({ 'image/png': blob })
			]).then(function() {
				showModalElem("Board Image Copied!", document.createTextNode("Board image copied!"));
			}, function(err) {
				console.error('Could not copy image to clipboard: ', err);
			});
		}, 'image/png');
	});
  }

/* Date */
export function dateIsBetween(date1MMSlashDDSlashYYYY, date2MMSlashDDSlashYYYY) {
	var currentDate = new Date();

	var dateRangeBegin = Date.parse(date1MMSlashDDSlashYYYY);
	var dateRangeEnd = Date.parse(date2MMSlashDDSlashYYYY);

	return currentDate >= dateRangeBegin && currentDate <= dateRangeEnd;
}

export function dateIsAprilFools() {
  var date = new Date();
  return date.getMonth() === 3 && date.getDate() === 1;
}





/* Miscellaneous */
// function updateGinsengGameHack() {
// 	var notationText = gameController.gameNotation.notationText;
// 	setGameController(GameType.Ginseng.id);
// 	addGameOption(SWAP_BISON_AND_DRAGON_ABILITIES);
// 	setGameController(GameType.Ginseng.id, true);
// 	gameController.setGameNotation(notationText);
// }


/* Browser check */

export var browserCheck_chrome_ios = false;
export var browserCheck_chrome = false;

doBrowserCheck();

export function doBrowserCheck() {
	/* See https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome */
	// please note, 
	// that IE11 now returns undefined again for window.chrome
	// and new Opera 30 outputs true for window.chrome
	// but needs to check if window.opr is not undefined
	// and new IE Edge outputs to true now for window.chrome
	// and if not iOS Chrome check
	// so use the below updated condition
	var isChromium = window.chrome;
	var winNav = window.navigator;
	var vendorName = winNav.vendor;
	var isOpera = typeof window.opr !== "undefined";
	var isIEedge = winNav.userAgent.indexOf("Edg") > -1;
	var isIOSChrome = winNav.userAgent.match("CriOS");

	if (isIOSChrome) {
		// is Google Chrome on IOS
		browserCheck_chrome_ios = true;
	} else if (
		isChromium !== null &&
		typeof isChromium !== "undefined" &&
		vendorName === "Google Inc." &&
		isOpera === false &&
		isIEedge === false
	) {
		// is Google Chrome
		browserCheck_chrome = true;
	} else {
		// not Google Chrome 
	}
}

export function clearObject(myObject) {
	for (const prop in myObject) {
		if (Object.prototype.hasOwnProperty.call(myObject, prop)) {
		  delete myObject[prop];
		}
	  }
}


