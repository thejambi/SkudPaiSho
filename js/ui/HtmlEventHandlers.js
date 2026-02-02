// HTML Event Handlers Module
// Centralizes event listener setup for HTML elements that previously used inline onclick handlers

import {
	viewGameSeeksClicked,
	viewTournamentsClicked,
	viewGameRankingsClicked,
	toggleReplayControls,
	sandboxFromMove,
	showGameReplayLink,
	showGameNotationModal,
	markGameInactiveClicked,
	resignOnlineGameClicked,
	closeGame,
	aboutClicked,
	showWelcomeScreensClicked,
	openShop,
	promptAddOption,
	showPreferences,
	setWebsiteTheme,
	confirmMoveClicked,
	rewindAllMoves,
	playPrevMove,
	playPause,
	playNextMove,
	pauseRun,
	playAllMoves,
	updatePasswordClicked,
	forgetPasswordClicked,
	sendGlobalChat,
	sendChat,
	dismissChatAlert,
	toggleTimestamps,
	toggleMoveLogDisplay,
	superSandboxFromMove
} from '../PaiShoMain';
import { showSuperSandboxInfoModal } from '../SuperSandbox.js';
import { addEventToElementId } from './UiSetup';

export function setupHtmlEventHandlers() {
	// Sidenav Menu - Play section
	addEventToElementId('sidenavJoinGame', 'click', viewGameSeeksClicked);
	addEventToElementId('sidenavTournaments', 'click', viewTournamentsClicked);
	addEventToElementId('sidenavGameRankings', 'click', viewGameRankingsClicked);

	// Sidenav Menu - Current Game section
	addEventToElementId('sidenavToggleReplay', 'click', toggleReplayControls);
	addEventToElementId('sidenavSandbox', 'click', sandboxFromMove);
	addEventToElementId('sidenavSuperSandbox', 'click', superSandboxFromMove);
	addEventToElementId('sidenavGameLink', 'click', showGameReplayLink);
	addEventToElementId('sidenavShowNotation', 'click', showGameNotationModal);
	addEventToElementId('sidenavMarkInactive', 'click', markGameInactiveClicked);
	addEventToElementId('sidenavResign', 'click', resignOnlineGameClicked);
	addEventToElementId('sidenavCloseGame', 'click', closeGame);

	// Sidenav Menu - About section
	addEventToElementId('sidenavAbout', 'click', aboutClicked);
	addEventToElementId('sidenavWelcomeScreens', 'click', showWelcomeScreensClicked);
	addEventToElementId('sidenavShop', 'click', openShop);

	// Sidenav Menu - Other section
	addEventToElementId('sidenavOtherHeader', 'click', promptAddOption);
	addEventToElementId('sidenavPreferences', 'click', showPreferences);

	// Website theme dropdown
	const websiteStyleDropdown = document.getElementById('websiteStyleDropdown');
	if (websiteStyleDropdown) {
		websiteStyleDropdown.addEventListener('change', function() {
			setWebsiteTheme(this.value);
		});
	}

	// Reload website
	const sidenavReload = document.getElementById('sidenavReload');
	if (sidenavReload) {
		sidenavReload.addEventListener('click', () => {
			location.reload(true);
		});
	}

	// Chat - Global chat
	addEventToElementId('sendGlobalChatMessageButton', 'click', sendGlobalChat);

	// Chat - Game chat
	addEventToElementId('sendChatMessageButton', 'click', () => sendChat());

	const gameChatTab = document.getElementById('gameChatTab');
	if (gameChatTab) {
		gameChatTab.addEventListener('click', dismissChatAlert);
	}

	// Chat - Toggle options (these are dynamically shown, so may not exist initially)
	addEventToElementId('toggleTimestampsLink', 'click', toggleTimestamps);
	addEventToElementId('toggleMoveLogDisplayDiv', 'click', toggleMoveLogDisplay);

	// Dice roll link in chat
	const rollD6Link = document.getElementById('rollD6LinkAboveChat');
	if (rollD6Link) {
		rollD6Link.addEventListener('click', () => {
			sendChat("/d6 2");
		});
	}

	// Replay Controls
	addEventToElementId('superSandboxIndicator', 'click', showSuperSandboxInfoModal);
	addEventToElementId('confirmMoveBtn', 'click', confirmMoveClicked);
	addEventToElementId('rewindAllBtn', 'click', rewindAllMoves);
	addEventToElementId('playPrevBtn', 'click', playPrevMove);
	addEventToElementId('playPauseBtn', 'click', playPause);

	const playNextBtn = document.getElementById('playNextBtn');
	if (playNextBtn) {
		playNextBtn.addEventListener('click', () => {
			playNextMove(true);
			pauseRun();
		});
	}

	addEventToElementId('playAllBtn', 'click', playAllMoves);
	addEventToElementId('replayControlsCloseBtn', 'click', toggleReplayControls);

	// Password Modal
	addEventToElementId('updatePasswordBtn', 'click', updatePasswordClicked);
	addEventToElementId('forgetPasswordLink', 'click', forgetPasswordClicked);
}
