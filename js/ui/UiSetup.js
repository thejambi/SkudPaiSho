import {
	accountHeaderClicked,
	closeNav,
	discordLinkClicked,
	dismissChatAlert,
	newGameClicked,
	openNav,
	openShop,
	openTab,
	sendChat,
	sendGlobalChat,
	viewGameSeeksClicked
} from '../PaiShoMain';

import { clearMessage } from '../UiInteraction';

export function setupUiEvents() {
	/* Sidenav Open/Close */
	var sidenavOpenDiv = document.getElementById('sidenavOpenButton');
	if (sidenavOpenDiv) {
		sidenavOpenDiv.addEventListener('click', openNav);
	}

	var sidenavHeaderDiv = document.getElementById('sidenavHeaderDiv');
	if (sidenavHeaderDiv) {
		sidenavHeaderDiv.addEventListener('click', openNav);
	}

	var sidenavCloseDiv = document.getElementById('sidenavCloseDiv');
	if (sidenavCloseDiv) {
		sidenavCloseDiv.addEventListener('click', closeNav);
	}

	/* Chat Tabs */
	var helpTabHeader = document.getElementById('defaultOpenTab');
	if (helpTabHeader) {
		helpTabHeader.addEventListener('click', (event) => {
			clearMessage();	// Set Help tab text to default when clicked
			openTab(event, 'helpTextTab');
		});
	}

	var globalChatTabHeader = document.getElementById('globalChatTabHeader');
	if (globalChatTabHeader) {
		globalChatTabHeader.addEventListener('click', (event) => {
			openTab(event, 'globalChatTab');
		});
	}

	var chatTabHeader = document.getElementById('chatTab');
	if (chatTabHeader) {
		chatTabHeader.addEventListener('click', (event) => {
			openTab(event, 'gameChatTab');
			dismissChatAlert();
		});
	}

	/* New Game */
	addEventToElementId('menuNewGame', 'click', newGameClicked);
	addEventToElementId('sidenavNewGame', 'click', newGameClicked);

	/* Sign In / My Games */
	addEventToElementId('accountHeaderSpan', 'click', accountHeaderClicked);
	addEventToElementId('sidenavMyGames', 'click', accountHeaderClicked);

	/* Header */
	addEventToElementId('headerDiscordLink', 'click', discordLinkClicked);
	addEventToElementId('headerShopLink', 'click', openShop);
	addEventToElementId('headerJoinLink', 'click', viewGameSeeksClicked);



	addEventToElementId('globalChatMessageInput', 'keypress', e => {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13) {
			sendGlobalChat();
		}
	});

	addEventToElementId('chatMessageInput', 'keypress', e => {
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13) {
			sendChat();
		}
	});
}


export function addEventToElement(element, eventName, callback) {
	if (element) {
		element.addEventListener(eventName, callback);
	}
}

export function addEventToElementId(elementId, eventName, callback) {
	var element = document.getElementById(elementId);
	addEventToElement(element, eventName, callback);
}
