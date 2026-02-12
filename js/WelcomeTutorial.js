// Welcome Tutorial Module
// Handles the onboarding tutorial shown to new users

import {
	showModalElem,
	loginClicked,
	markGameInactiveWithoutDialogKey
} from './PaiShoMain';
import { userIsLoggedIn } from './UserData';
import { OnboardingFunctions } from './OnBoardingVars';

export const welcomeTutorialDismissedKey = "welcomeTutorialDismissedKey";

let tutorialInProgress = false;
let tutorialOpen = false;

// Getters for state
export function isTutorialInProgress() {
	return tutorialInProgress;
}

export function isTutorialOpen() {
	return tutorialOpen;
}

export function resetTutorialState() {
	tutorialInProgress = false;
	tutorialOpen = false;
}

export function shouldShowWelcomeTutorial(debugOn, hasGameQuery, userLoggedIn) {
	return !debugOn
		&& !hasGameQuery
		&& (localStorage.getItem(welcomeTutorialDismissedKey) !== 'true' || !userLoggedIn);
}

export function showWelcomeScreensClicked() {
	OnboardingFunctions.resetOnBoarding();
	localStorage.setItem(markGameInactiveWithoutDialogKey, 'false');
	showWelcomeTutorial();
}

export function showWelcomeTutorial() {
	tutorialInProgress = true;
	tutorialOpen = true;
	const tutorialContent = document.createElement('div');
	tutorialContent.id = 'tutorialContent';
	showModalElem("The Garden Gate", tutorialContent);
	setTimeout(() => { runTutorial(); }, 400);
}

export function runTutorial() {
	// "Who knocks at the Garden Gate?" sequence
	const tutContent = document.getElementById('tutorialContent');

	const div1 = document.createElement("div");
	const node = document.createTextNode("Who knocks at the Garden Gate?");
	div1.appendChild(node);
	div1.classList.add('tutContentMessage');
	div1.classList.add('tutContentFadeIn');
	tutContent.appendChild(div1);

	setTimeout(
		() => {
			const div2 = document.createElement("div");
			const node = document.createTextNode("One who has eaten the fruit...");
			div2.appendChild(node);
			div2.classList.add('tutContentMessage');
			div2.classList.add('tutContentFadeIn');
			tutContent.appendChild(div2);

			div1.classList.remove('tutContentFadeIn');
			div1.classList.add('tutContentFadeOut');

			setTimeout(
				() => {
					const div3 = document.createElement("div");
					const node = document.createTextNode("... and tasted its mysteries.");
					div3.appendChild(node);
					div3.classList.add('tutContentMessage');
					div3.classList.add('tutContentFadeIn');
					tutContent.appendChild(div3);

					setTimeout(
						() => {
							div2.classList.remove('tutContentFadeIn');
							div2.classList.add('tutContentFadeOut');
							div3.classList.remove('tutContentFadeIn');
							div3.classList.add('tutContentFadeOut');

							setTimeout(() => {
								div1.classList.add('gone');
								div2.classList.add('gone');
								div3.classList.add('gone');
								continueTutorial();
							}, 2000);
						}, 2000);
				}, 1400);
		}, 3000);
}

export function continueTutorial() {
	const tutContent = document.getElementById('tutorialContent');

	if (tutContent) {
		const div1 = document.createElement("div");

		const p1 = document.createElement("p");
		p1.appendChild(document.createTextNode("Welcome to "));
		const em = document.createElement("em");
		em.textContent = "The Garden Gate";
		p1.appendChild(em);
		p1.appendChild(document.createTextNode(", a place to play a variety of Pai Sho games and more against other players online."));
		div1.appendChild(p1);

		const p2 = document.createElement("p");
		p2.textContent = "You can sign in (or sign up) by entering your username and verifying your email address.";
		div1.appendChild(p2);

		const p3 = document.createElement("p");
		p3.appendChild(document.createTextNode("Use options in the "));
		const strong = document.createElement("strong");
		strong.className = "stretchText";
		strong.textContent = "\u00A0\u2261\u00A0";
		p3.appendChild(strong);
		p3.appendChild(document.createTextNode("side menu to create a new game, join another player's game, or to view your games that are in progress. You can have any number of online games in progress at once."));
		div1.appendChild(p3);

		const p4 = document.createElement("p");
		p4.appendChild(document.createTextNode("See the "));
		const icon = document.createElement("i");
		icon.className = "fa fa-plus-circle";
		icon.setAttribute("aria-hidden", "true");
		p4.appendChild(icon);
		p4.appendChild(document.createTextNode(" New Game menu to try and learn more about any of the games you can play here."));
		div1.appendChild(p4);

		if (!userIsLoggedIn()) {
			const p5 = document.createElement("p");
			const skipSpan = document.createElement("span");
			skipSpan.className = "skipBonus";
			skipSpan.textContent = "Sign in";
			skipSpan.onclick = () => { loginClicked(); };
			p5.appendChild(skipSpan);
			p5.appendChild(document.createTextNode(" now to get started."));
			div1.appendChild(p5);
		}

		div1.classList.add('tutContentFadeIn');
		tutContent.appendChild(div1);

		localStorage.setItem(welcomeTutorialDismissedKey, "true");
	}

	tutorialInProgress = false;
}
