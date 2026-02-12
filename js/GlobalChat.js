// Global Chat Module
// Handles global chat functionality for the "Links" tab

import {
	onlinePlayEngine,
} from './PaiShoMain';
import { getLoginToken } from './UserData';
import { htmlEscape } from './TextHelpers';

// Module state
let lastGlobalChatTimestamp = '1970-01-01 00:00:00';

export function handleNewGlobalChatMessages(results) {
	const resultRows = results.split('\n');

	const chatMessageList = [];
	let newChatMessagesHtml = "";

	// var actuallyLoadMessages = true;

	// if (lastGlobalChatTimestamp === '1970-01-01 00:00:00') {
	// 	// just loading timestamp of latest message...
	// 	actuallyLoadMessages = false;
	// }

	// // So actuallyLoadMessages only turns false once...
	// lastGlobalChatTimestamp = '1970-01-02 00:00:00';

	for (const index in resultRows) {
		const row = resultRows[index].split('|||');
		const chatMessage = {
			timestamp: row[0],
			username: row[1],
			message: row[2]
		};
		chatMessageList.push(chatMessage);
		lastGlobalChatTimestamp = chatMessage.timestamp;
	}

	// if (actuallyLoadMessages) {

	for (const index in chatMessageList) {
		const chatMessage = chatMessageList[index];
		newChatMessagesHtml += "<div class='chatMessage'><strong>" + chatMessage.username + ":</strong> " + chatMessage.message.replace(/&amp;/g, '&') + "</div>";
	}

	/* Prepare to add chat content and keep scrolled to bottom */
	const chatMessagesDisplay = document.getElementById('globalChatMessagesDisplay');
	// allow 1px inaccuracy by adding 1
	const isScrolledToBottom = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight <= chatMessagesDisplay.scrollTop + 1;
	const newElement = document.createElement("div");
	newElement.innerHTML = newChatMessagesHtml;
	chatMessagesDisplay.appendChild(newElement);
	// scroll to bottom if isScrolledToBottom
	if (isScrolledToBottom) {
		chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight - chatMessagesDisplay.clientHeight;
	}
	// }
}

const getNewGlobalChatsCallback = (results) => {
	if (results != "") {
		handleNewGlobalChatMessages(results);
	}
};

export function fetchGlobalChats() {
	onlinePlayEngine.getNewChatMessages(0, lastGlobalChatTimestamp, getNewGlobalChatsCallback);
}

const getInitialGlobalChatsCallback = (results) => {
	if (results != "") {
		handleNewGlobalChatMessages(results);
	}
};

/* This is AKA Display Links tab content */
export function resetGlobalChats() {
	// Clear all global chats..
	const chatDisplay = document.getElementById('globalChatMessagesDisplay');
	while (chatDisplay.firstChild) {
		chatDisplay.removeChild(chatDisplay.firstChild);
	}

	const div = document.createElement("div");
	const strong = document.createElement("strong");
	strong.textContent = "SkudPaiSho: ";
	div.appendChild(strong);
	div.appendChild(document.createTextNode(" Welcome! Discord is the best way to chat and get help, but feel free to say hello here in the global chat."));
	const hr = document.createElement("hr");
	div.appendChild(hr);
	chatDisplay.appendChild(div);
}

export function fetchInitialGlobalChats() {
	resetGlobalChats();

	// Fetch global chats..
	onlinePlayEngine.getInitialGlobalChatMessages(getInitialGlobalChatsCallback);
}

const sendGlobalChatCallback = (result) => {
	document.getElementById('sendGlobalChatMessageButton').textContent = "Send";
	document.getElementById('globalChatMessageInput').value = "";
};

export function sendGlobalChat() {
	let chatMessage = htmlEscape(document.getElementById('globalChatMessageInput').value).trim();
	chatMessage = chatMessage.replace(/\n/g, ' ');	// Convert newlines to spaces.
	if (chatMessage) {
		const sendButton = document.getElementById('sendGlobalChatMessageButton');
		sendButton.innerHTML = "";
		const icon = document.createElement("i");
		icon.className = "fa fa-circle-o-notch fa-spin fa-fw";
		sendButton.appendChild(icon);
		onlinePlayEngine.sendChat(0, getLoginToken(), chatMessage, sendGlobalChatCallback);
	}
}
