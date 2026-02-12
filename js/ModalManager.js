// Modal display and management functions.
// Dependencies: WelcomeTutorial, OnboardingFunctions, convertToDomObject (GameData), GameState.

import { convertToDomObject } from './GameData';
import { clearGameWatchInterval } from './GameState';
import { OnboardingFunctions } from './OnBoardingVars';
import * as WelcomeTutorial from './WelcomeTutorial';

function closeNav() {
	document.getElementById("mySidenav").classList.remove("sideNavOpen");
}

export function callFailed() {
	showModalElem("", document.createTextNode("Unable to load."));
}

export function showModalElem(headingText, modalMessageElement, onlyCloseByClickingX, yesNoOptions, useInvisibleModal) {
	// Make sure sidenav is closed
	closeNav();

	// Get the modal
	const modal = document.getElementById('myMainModal');

	if (!useInvisibleModal) {
		modal.classList.add('modalDefaultBackground');
	} else {
		modal.classList.remove('modalDefaultBackground');
	}

	// Get the <span> element that closes the modal
	const span = document.getElementsByClassName("myMainModalClose")[0];

	const modalHeading = document.getElementById('modalHeading');
	modalHeading.innerHTML = headingText;

	const modalMessage = document.getElementById('modalMessage');
	modalMessage.innerHTML = '';
	modalMessage.appendChild(modalMessageElement);

	if (yesNoOptions && yesNoOptions.yesFunction) {
		modalMessage.appendChild(document.createElement("br"));
		modalMessage.appendChild(document.createElement("br"));

		const yesDiv = document.createElement("div");
		yesDiv.innerText = yesNoOptions.yesText ? yesNoOptions.yesText : "OK";
		yesDiv.classList.add("clickableText");
		yesDiv.onclick = yesNoOptions.yesFunction;
		modalMessage.appendChild(yesDiv);

		modalMessage.appendChild(document.createElement("br"));
		const noDiv = document.createElement("div");
		noDiv.innerText = yesNoOptions.noText ? yesNoOptions.noText : "Cancel";
		noDiv.classList.add("clickableText");
		if (yesNoOptions.noFunction) {
			noDiv.onclick = yesNoOptions.noFunction;
		} else {
			noDiv.onclick = closeModal;
		}
		modalMessage.appendChild(noDiv);
	}

	// When the user clicks the button, open the modal
	modal.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		closeModal();
	};

	if (WelcomeTutorial.isTutorialInProgress()) {
		onlyCloseByClickingX = true;
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal && !onlyCloseByClickingX) {
			closeModal();
		}
	};
}

export function showModal(headingHTMLText, modalMessageHTMLText, onlyCloseByClickingX, yesNoOptions, useInvisibleModal) {
	// Make sure sidenav is closed
	closeNav();

	// Get the modal
	const modal = document.getElementById('myMainModal');

	if (!useInvisibleModal) {
		modal.classList.add('modalDefaultBackground');
	} else {
		modal.classList.remove('modalDefaultBackground');
	}

	// Get the <span> element that closes the modal
	const span = document.getElementsByClassName("myMainModalClose")[0];

	const modalHeading = document.getElementById('modalHeading');
	modalHeading.innerHTML = headingHTMLText;

	const modalMessage = document.getElementById('modalMessage');
	modalMessage.innerHTML = '';
	// modalMessage.innerHTML = modalMessageHTMLText;
	modalMessage.appendChild(convertToDomObject(modalMessageHTMLText));

	if (yesNoOptions && yesNoOptions.yesFunction) {
		modalMessage.appendChild(document.createElement("br"));
		modalMessage.appendChild(document.createElement("br"));

		const yesDiv = document.createElement("div");
		yesDiv.innerText = yesNoOptions.yesText ? yesNoOptions.yesText : "OK";
		yesDiv.classList.add("clickableText");
		yesDiv.onclick = yesNoOptions.yesFunction;
		modalMessage.appendChild(yesDiv);

		modalMessage.appendChild(document.createElement("br"));
		const noDiv = document.createElement("div");
		noDiv.innerText = yesNoOptions.noText ? yesNoOptions.noText : "Cancel";
		noDiv.classList.add("clickableText");
		if (yesNoOptions.noFunction) {
			noDiv.onclick = yesNoOptions.noFunction;
		} else {
			noDiv.onclick = closeModal;
		}
		modalMessage.appendChild(noDiv);
	}

	// When the user clicks the button, open the modal
	modal.style.display = "block";

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		closeModal();
	};

	if (WelcomeTutorial.isTutorialInProgress()) {
		onlyCloseByClickingX = true;
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal && !onlyCloseByClickingX) {
			closeModal();
		}
	};
}

export function closeModal() {
	document.getElementById('myMainModal').style.display = "none";

	if (WelcomeTutorial.isTutorialInProgress() || WelcomeTutorial.isTutorialOpen()) {
		OnboardingFunctions.showOnLoadAnnouncements();
	}

	WelcomeTutorial.resetTutorialState();
}

export function showBadMoveModal() {
	clearGameWatchInterval();
	const container = document.createElement('div');
	container.appendChild(document.createTextNode("A move went wrong somewhere. If you see this each time you look at this game, then this game may be corrupt. "));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode("Please let your opponent know that you saw this message. You may want to quit this game and try again."));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode("Live game updates have been paused."));
	showModalElem("Uh Oh", container);
}

export function getLoadingModalElement() {
	const span = document.createElement("span");
	span.appendChild(document.createTextNode("Loading\u00A0"));
	const icon = document.createElement("i");
	icon.className = "fa fa-circle-o-notch fa-spin fa-fw";
	span.appendChild(icon);
	span.appendChild(document.createTextNode("\u00A0"));
	return span;
}
