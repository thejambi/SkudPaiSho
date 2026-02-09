// User Preferences Module
// Handles device preferences, sound, animations, timestamps, and custom background colors

import {
	animationsOnKey,
	showTimestampsKey,
	showMoveLogsInChatKey,
	customBgColorKey,
	confirmMoveKey,
	soundManager,
	gameController,
	clearGameChats,
	showReplayControls,
	callSubmitMove,
	submitMoveData,
	confirmMoveToSubmit,
	showModalElem,
	userIsLoggedIn,
	getLoginToken,
	isPushSupported,
	isWebPushEnabled,
	subscribeToPush,
	unsubscribeFromPush,
	isChatNotificationsEnabled,
	enableChatNotifications,
	disableChatNotifications,
} from './PaiShoMain';
import { OnboardingFunctions } from './OnBoardingVars';
import { GameClock } from './util/GameClock';
import { Ads } from './Ads';

let customBackgroundColor = "";


const isValidColor = (strColor) => {
	const s = new Option().style;
	s.color = strColor;
	return s.color !== '';
};

/* Sound */
export function toggleSoundOn() {
	soundManager.toggleSoundOn();
}

export function toggleAnimationsOn() {
	if (isAnimationsOn()) {
		localStorage.setItem(animationsOnKey, "false");
	} else {
		localStorage.setItem(animationsOnKey, "true");
	}
	if (gameController.setAnimationsOn) {
		gameController.setAnimationsOn(isAnimationsOn());
	}
}

export function isAnimationsOn() {
	return localStorage.getItem(animationsOnKey) !== "false";
}

export function isTimestampsOn() {
	return localStorage.getItem(showTimestampsKey) === "true";
}

export function toggleTimestamps() {
	localStorage.setItem(showTimestampsKey, !isTimestampsOn());
	clearGameChats();
}

export function isMoveLogDisplayOn() {
	return localStorage.getItem(showMoveLogsInChatKey) === "true";
}

export function toggleMoveLogDisplay() {
	localStorage.setItem(showMoveLogsInChatKey, !isMoveLogDisplayOn());
	clearGameChats();
}

export function isMoveConfirmationRequired() {
	return localStorage.getItem(confirmMoveKey) !== "false";
}

export function toggleConfirmMovePreference() {
	localStorage.setItem(confirmMoveKey, !isMoveConfirmationRequired());
}

export function showConfirmMoveButton() {
	showReplayControls();
	document.getElementById('confirmMoveButton').classList.remove('gone');
	OnboardingFunctions.showConfirmMoveButtonHelp();
}

export function hideConfirmMoveButton() {
	document.getElementById('confirmMoveButton').classList.add('gone');
}

export function confirmMoveClicked() {
	callSubmitMove(submitMoveData.moveAnimationBeginStep, true, confirmMoveToSubmit);
	hideConfirmMoveButton();
}

export function setBackgroundColor(colorValueStr) {
	if (isValidColor(colorValueStr)) {
		document.body.style.background = colorValueStr;
	}
}

export function setCustomBgColorFromInput() {
	const customValueInput = document.getElementById("customBgColorInput");

	if (customValueInput) {
		const customValue = customValueInput.value;
		if (isValidColor(customValue)) {
			document.body.style.background = customValue;
			localStorage.setItem(customBgColorKey, customValue);
		} else {
			document.body.style.background = "";
			localStorage.removeItem(customBgColorKey);
		}
	}
}

export function showPreferences() {
	const container = document.createElement('div');

	// Confirm move checkbox
	const confirmDiv = document.createElement('div');
	const confirmCheckbox = document.createElement('input');
	confirmCheckbox.id = 'confirmMoveBeforeSubmittingCheckbox';
	confirmCheckbox.type = 'checkbox';
	confirmCheckbox.checked = isMoveConfirmationRequired();
	confirmCheckbox.onclick = () => toggleConfirmMovePreference();
	confirmDiv.appendChild(confirmCheckbox);
	const confirmLabel = document.createElement('label');
	confirmLabel.htmlFor = 'confirmMoveBeforeSubmittingCheckbox';
	confirmLabel.textContent = ' Confirm move before submitting?';
	confirmDiv.appendChild(confirmLabel);
	container.appendChild(confirmDiv);

	// Custom background color input
	container.appendChild(document.createElement('br'));
	const bgColorDiv = document.createElement('div');
	bgColorDiv.appendChild(document.createTextNode('Custom '));
	const codeElem = document.createElement('code');
	codeElem.textContent = 'html';
	bgColorDiv.appendChild(codeElem);
	bgColorDiv.appendChild(document.createTextNode(' background color code: '));
	const bgColorInput = document.createElement('input');
	bgColorInput.type = 'text';
	bgColorInput.id = 'customBgColorInput';
	bgColorInput.value = localStorage.getItem(customBgColorKey) || '';
	bgColorInput.maxLength = 15;
	bgColorInput.oninput = () => setCustomBgColorFromInput();
	bgColorDiv.appendChild(bgColorInput);
	container.appendChild(bgColorDiv);

	// Sound checkbox
	container.appendChild(document.createElement('br'));
	const soundDiv = document.createElement('div');
	const soundCheckbox = document.createElement('input');
	soundCheckbox.id = 'soundsOnCheckBox';
	soundCheckbox.type = 'checkbox';
	soundCheckbox.checked = soundManager.isMoveSoundsEnabled();
	soundCheckbox.onclick = () => toggleSoundOn();
	soundDiv.appendChild(soundCheckbox);
	const soundLabel = document.createElement('label');
	soundLabel.htmlFor = 'soundsOnCheckBox';
	soundLabel.textContent = ' Move sounds enabled?';
	soundDiv.appendChild(soundLabel);
	container.appendChild(soundDiv);

	// Animations checkbox
	const animDiv = document.createElement('div');
	const animCheckbox = document.createElement('input');
	animCheckbox.id = 'animationsOnCheckBox';
	animCheckbox.type = 'checkbox';
	animCheckbox.checked = isAnimationsOn();
	animCheckbox.onclick = () => toggleAnimationsOn();
	animDiv.appendChild(animCheckbox);
	const animLabel = document.createElement('label');
	animLabel.htmlFor = 'animationsOnCheckBox';
	animLabel.textContent = ' Move animations enabled?';
	animDiv.appendChild(animLabel);
	container.appendChild(animDiv);

	// Game clock checkbox
	const clockDiv = document.createElement('div');
	const clockCheckbox = document.createElement('input');
	clockCheckbox.id = 'gameClockOnCheckBox';
	clockCheckbox.type = 'checkbox';
	clockCheckbox.checked = GameClock.isEnabled();
	clockCheckbox.onclick = () => GameClock.toggleEnabled();
	clockDiv.appendChild(clockCheckbox);
	const clockLabel = document.createElement('label');
	clockLabel.htmlFor = 'gameClockOnCheckBox';
	clockLabel.textContent = ' (Beta) Game Clock enabled?';
	clockDiv.appendChild(clockLabel);
	container.appendChild(clockDiv);

	// Web Push notifications checkbox (only show if supported and logged in)
	if (isPushSupported() && userIsLoggedIn()) {
		const pushDiv = document.createElement('div');
		const pushCheckbox = document.createElement('input');
		pushCheckbox.id = 'webPushCheckBox';
		pushCheckbox.type = 'checkbox';
		pushCheckbox.checked = isWebPushEnabled();
		pushCheckbox.onclick = async () => {
			if (pushCheckbox.checked) {
				// Request permission immediately on user gesture (before any await)
				const permission = await Notification.requestPermission();
				if (permission !== 'granted') {
					pushCheckbox.checked = false;
					return;
				}
				const subscription = await subscribeToPush(getLoginToken());
				if (!subscription) {
					pushCheckbox.checked = false;
				}
			} else {
				await unsubscribeFromPush();
			}
		};
		pushDiv.appendChild(pushCheckbox);
		const pushLabel = document.createElement('label');
		pushLabel.htmlFor = 'webPushCheckBox';
		pushLabel.textContent = ' Push notifications for opponent moves?';
		pushDiv.appendChild(pushLabel);
		container.appendChild(pushDiv);

		// Chat notifications checkbox (only show if push is enabled)
		const chatDiv = document.createElement('div');
		chatDiv.style.marginLeft = '20px';
		const chatCheckbox = document.createElement('input');
		chatCheckbox.id = 'chatNotificationsCheckBox';
		chatCheckbox.type = 'checkbox';
		chatCheckbox.checked = isChatNotificationsEnabled();
		chatCheckbox.disabled = !isWebPushEnabled();
		chatCheckbox.onclick = async () => {
			if (chatCheckbox.checked) {
				const success = await enableChatNotifications(getLoginToken());
				if (!success) {
					chatCheckbox.checked = false;
				}
			} else {
				await disableChatNotifications(getLoginToken());
			}
		};
		chatDiv.appendChild(chatCheckbox);
		const chatLabel = document.createElement('label');
		chatLabel.htmlFor = 'chatNotificationsCheckBox';
		chatLabel.textContent = ' Also notify for chat messages?';
		chatDiv.appendChild(chatLabel);
		container.appendChild(chatDiv);

		// Update chat checkbox state when push checkbox changes
		const originalPushClick = pushCheckbox.onclick;
		pushCheckbox.onclick = async () => {
			await originalPushClick();
			chatCheckbox.disabled = !pushCheckbox.checked;
			if (!pushCheckbox.checked) {
				chatCheckbox.checked = false;
			}
		};
	}

	// Minimal ads option
	if (Ads.Options.showAds) {
		container.appendChild(document.createElement('br'));
		const adsDiv = document.createElement('div');
		adsDiv.classList.add('clickableText');
		adsDiv.textContent = 'Minimal sponsored messages';
		adsDiv.onclick = () => Ads.minimalAdsEnabled();
		container.appendChild(adsDiv);
	}

	showModalElem("Device Preferences", container);
}

export function getBooleanPreference(key, defaultValue) {
	if (defaultValue && defaultValue.toString() === "true") {
		return localStorage.getItem(key) !== "true";
	} else {
		return localStorage.getItem(key) !== "false";
	}
}

export function toggleBooleanPreference(key) {
	localStorage.setItem(key, !getBooleanPreference(key));
}
