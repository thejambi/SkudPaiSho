/* For showing users helpful tips that can be dismissed */

import { dateIsBetween } from "./GameData";
import { closeModal, showModalElem } from "./ModalManager";

export var OnBoardingKeys = {
	confirmMoveButtonHelpDismissed: "confirmMoveButtonHelpDismissed",
	gameCrafterAnnouncementDissmissed: "gameCrafterAnnouncementDismissed",
	gameCrafterCrowdSaleDismissed: "gameCrafterCrowdSaleDismissed",
	joinDiscord20211028Dismissed: "joinDiscord20211028Dismissed",
	gameCrafter202210Dissmissed: "gameCrafter202210Dismissed",
	ginseng2_0Dismissed: "ginseng2_0Dismissed",
	gameCrafterGiveaway202211Dismissed: "gameCrafterGiveaway202211Dismissed",
	passwordAnnouncementDismissed: "passwordAnnouncementDismissed"
};

export function OnboardingFunctions() {

}

OnboardingFunctions.showOnLoadAnnouncements = function() {
	if (dateIsBetween("11/01/2021", "01/24/2022")) {
		OnboardingFunctions.showJoinDiscord20211028Announcement();
	}

	if (dateIsBetween("11/11/2022", "12/30/2022")) {
		OnboardingFunctions.showGinseng2_0Announcement();
	}

	if (dateIsBetween("11/12/2022", "11/18/2022")) {
		OnboardingFunctions.showTheGameCrafterGiveaway202211Announcement();
	}

	// Most priority last:
	if (dateIsBetween("10/24/2022", "11/21/2022")) {
		OnboardingFunctions.showTheGameCrafterSet202210Announcement();
	}

	if (dateIsBetween("02/22/2023", "06/01/2023")) {
		OnboardingFunctions.showPasswordAnnouncement();
	}
};

OnboardingFunctions.closeCurrentAnnouncement = function() {
	closeModal();
	OnboardingFunctions.showOnLoadAnnouncements();
};

OnboardingFunctions.resetOnBoarding = function() {
	Object.keys(OnBoardingKeys).forEach(function(key) {
		localStorage.removeItem(OnBoardingKeys[key]);
	});
};

OnboardingFunctions.showConfirmMoveButtonHelp = function() {
	if (localStorage.getItem(OnBoardingKeys.confirmMoveButtonHelpDismissed) !== "true") {
		var yesNoOptions = {};
		yesNoOptions.yesText = "OK - Don't show again";
		yesNoOptions.yesFunction = function() {
			localStorage.setItem(OnBoardingKeys.confirmMoveButtonHelpDismissed, "true");
			OnboardingFunctions.closeCurrentAnnouncement();
		};
		yesNoOptions.noText = "Close";
		const container = document.createElement('div');
		container.appendChild(document.createTextNode('To submit your move in an online game, click the Submit Move button at the bottom of screen. '));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode('To automatically submit your moves, visit the Device Preferences from your My Games list.'));
		showModalElem("Submitting Your Move", container, false, yesNoOptions);
	}
};

OnboardingFunctions.showTheGameCrafterSetAnnouncement = function() {
	if (localStorage.getItem(OnBoardingKeys.gameCrafterAnnouncementDissmissed) !== "true") {
		var yesNoOptions = {};
		yesNoOptions.yesText = "OK - Don't show again";
		yesNoOptions.yesFunction = function() {
			localStorage.setItem(OnBoardingKeys.gameCrafterAnnouncementDissmissed, "true");
			OnboardingFunctions.closeCurrentAnnouncement();
		};
		yesNoOptions.noText = "Close";
		const container = document.createElement('div');
		container.appendChild(document.createTextNode('Coming soon, a Pai Sho set printed by TheGameCrafter, designed by The Garden Gate. And you can win a copy! '));
		const discordLink = document.createElement('a');
		discordLink.href = 'https://skudpaisho.com/discord';
		discordLink.target = '_blank';
		discordLink.textContent = 'Join the Discord';
		container.appendChild(discordLink);
		container.appendChild(document.createTextNode(' for more information on how to get a chance to win. (Hint: Be playing lots of games, and be in the Discord!)'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const imgDiv = document.createElement('div');
		imgDiv.style.textAlign = 'center';
		const img = document.createElement('img');
		img.src = 'https://cdn.discordapp.com/attachments/747893391907618927/817419423106203738/image0.jpg';
		img.style.width = '90%';
		img.style.maxWidth = '450px';
		imgDiv.appendChild(img);
		container.appendChild(imgDiv);
		showModalElem("Pai Sho Set Giveaway!", container, false, yesNoOptions);
	}
};

OnboardingFunctions.showTheGameCrafterCrowdSaleAnnouncement = function() {
	if (localStorage.getItem(OnBoardingKeys.gameCrafterCrowdSaleDismissed) !== "true") {
		var yesNoOptions = {};
		yesNoOptions.yesText = "OK - Don't show again";
		yesNoOptions.yesFunction = function() {
			localStorage.setItem(OnBoardingKeys.gameCrafterCrowdSaleDismissed, "true");
			OnboardingFunctions.closeCurrentAnnouncement();
		};
		yesNoOptions.noText = "Close";
		const container = document.createElement('div');
		container.appendChild(document.createTextNode('The Pai Sho set printed by TheGameCrafter, designed by The Garden Gate, is '));
		const saleLink = document.createElement('a');
		saleLink.href = 'https://www.thegamecrafter.com/crowdsale/the-garden-gate-pai-sho-set';
		saleLink.target = '_blank';
		saleLink.textContent = 'on sale now! Order it here!';
		container.appendChild(saleLink);
		container.appendChild(document.createTextNode(' As more copies are ordered during the sale, the price goes down for everyone. '));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode('This set includes tiles to play Skud Pai Sho, Vagabond Pai Sho, Adevăr Pai Sho, and more! '));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const discordLink = document.createElement('a');
		discordLink.href = 'https://skudpaisho.com/discord';
		discordLink.target = '_blank';
		discordLink.textContent = 'Join the Discord community';
		container.appendChild(discordLink);
		container.appendChild(document.createTextNode(' for more information.'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const imgDiv = document.createElement('div');
		imgDiv.style.textAlign = 'center';
		const imgLink = document.createElement('a');
		imgLink.href = 'https://www.thegamecrafter.com/crowdsale/the-garden-gate-pai-sho-set';
		imgLink.target = '_blank';
		const img = document.createElement('img');
		img.src = 'https://cdn.discordapp.com/attachments/747893391907618927/817419423106203738/image0.jpg';
		img.style.width = '90%';
		img.style.maxWidth = '450px';
		imgLink.appendChild(img);
		imgDiv.appendChild(imgLink);
		container.appendChild(imgDiv);
		showModalElem("On Sale Now - The Garden Gate Pai Sho Set!", container, false, yesNoOptions);
	}
};

OnboardingFunctions.showJoinDiscord20211028Announcement = function() {
	if (localStorage.getItem(OnBoardingKeys.joinDiscord20211028Dismissed) !== "true") {
		var yesNoOptions = {};
		yesNoOptions.yesText = "OK - Don't show again";
		yesNoOptions.yesFunction = function() {
			localStorage.setItem(OnBoardingKeys.joinDiscord20211028Dismissed, "true");
			OnboardingFunctions.closeCurrentAnnouncement();
		};
		yesNoOptions.noText = "Close";
		const container = document.createElement('div');
		container.appendChild(document.createTextNode("Hi! If you didn't know, there is an active Discord community for The Garden Gate. "));
		container.appendChild(document.createTextNode('Members of the community are planning a real life Pai Sho Con and want to invite you to participate in person or virtually via Discord! '));
		const discordLink = document.createElement('a');
		discordLink.href = 'https://skudpaisho.com/discord';
		discordLink.target = '_blank';
		discordLink.textContent = 'Join the Discord server';
		container.appendChild(discordLink);
		container.appendChild(document.createTextNode(' today to find out more and get involved.'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const imgDiv = document.createElement('div');
		imgDiv.style.textAlign = 'center';
		const img = document.createElement('img');
		img.src = 'https://cdn.discordapp.com/attachments/904911184803807273/904911232023265300/0001.jpg';
		img.style.width = '90%';
		img.style.maxWidth = '480px';
		imgDiv.appendChild(img);
		container.appendChild(imgDiv);
		showModalElem("The Garden Gate Community Meetup!", container, false, yesNoOptions);
	}
};

OnboardingFunctions.showTheGameCrafterGiveaway202211Announcement = function() {
	if (localStorage.getItem(OnBoardingKeys.gameCrafterGiveaway202211Dismissed) !== "true") {
		var yesNoOptions = {};
		yesNoOptions.yesText = "OK - Don't show again";
		yesNoOptions.yesFunction = function() {
			localStorage.setItem(OnBoardingKeys.gameCrafterGiveaway202211Dismissed, "true");
			OnboardingFunctions.closeCurrentAnnouncement();
		};
		yesNoOptions.noText = "Close";
		const container = document.createElement('div');
		container.appendChild(document.createTextNode("At the end of this week, I'll draw a name and give away a The Garden Gate TheGameCrafter Pai Sho set! "));
		const discordLink = document.createElement('a');
		discordLink.href = 'https://skudpaisho.com/discord';
		discordLink.target = '_blank';
		discordLink.textContent = 'Join the Discord';
		container.appendChild(discordLink);
		container.appendChild(document.createTextNode(' to find details on how to enter.'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const setLink = document.createElement('a');
		setLink.href = 'https://www.thegamecrafter.com/games/the-garden-gate-pai-sho-set';
		setLink.target = '_blank';
		setLink.textContent = 'See more details about The Garden Gate TheGameCrafter set here';
		container.appendChild(setLink);
		container.appendChild(document.createTextNode(' - The most affordable Pai Sho set! Includes the full Skud Pai Sho rulebook and tiles for Skud, Vagabond, Adevar, and Ginseng Pai Sho'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const imgDiv = document.createElement('div');
		imgDiv.style.textAlign = 'center';
		const img = document.createElement('img');
		img.src = 'https://cdn.discordapp.com/attachments/747893391907618927/817419423106203738/image0.jpg';
		img.style.width = '90%';
		img.style.maxWidth = '450px';
		imgDiv.appendChild(img);
		container.appendChild(imgDiv);
		showModalElem("Pai Sho Set Giveaway!", container, false, yesNoOptions);
	}
};

OnboardingFunctions.showTheGameCrafterSet202210Announcement = function() {
	if (localStorage.getItem(OnBoardingKeys.gameCrafter202210Dissmissed) !== "true") {
		var yesNoOptions = {};
		yesNoOptions.yesText = "OK - Don't show again";
		yesNoOptions.yesFunction = function() {
			localStorage.setItem(OnBoardingKeys.gameCrafter202210Dissmissed, "true");
			OnboardingFunctions.closeCurrentAnnouncement();
		};
		yesNoOptions.noText = "Close";
		const container = document.createElement('div');
		container.appendChild(document.createTextNode('Soon, TheGameCrafter needs to raise prices of due to rising costs of components. If you are interested in getting one of the TheGameCrafter sets we have, now is the time before the prices go up! '));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const setLink1 = document.createElement('a');
		setLink1.href = 'https://www.thegamecrafter.com/games/the-garden-gate-pai-sho-set';
		setLink1.target = '_blank';
		setLink1.textContent = 'The Garden Gate Pai Sho Set';
		container.appendChild(setLink1);
		container.appendChild(document.createTextNode(' - The most affordable Pai Sho set! Includes the full Skud Pai Sho rulebook and tiles for Skud, Vagabond, Adevar, and Ginseng Pai Sho'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const setLink2 = document.createElement('a');
		setLink2.href = 'https://www.thegamecrafter.com/games/adev%C4%83r-pai-sho-rose-edition';
		setLink2.target = '_blank';
		setLink2.textContent = 'Adevar Pai Sho - Rose Edition';
		container.appendChild(setLink2);
		container.appendChild(document.createTextNode(' - An Adevar specific set with special edition board and tiles'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const setLink3 = document.createElement('a');
		setLink3.href = 'https://www.thegamecrafter.com/games/key-pai-sho-deluxe-edition-';
		setLink3.target = '_blank';
		setLink3.textContent = 'Key Pai Sho Set';
		container.appendChild(setLink3);
		container.appendChild(document.createTextNode(' - A beautiful Key Pai Sho specific set, also good for playing Skud and Vagabond'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const discordLink = document.createElement('a');
		discordLink.href = 'https://skudpaisho.com/discord';
		discordLink.target = '_blank';
		discordLink.textContent = 'Join the Discord';
		container.appendChild(discordLink);
		container.appendChild(document.createTextNode(' to get in touch and ask any questions about the different sets.'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const imgDiv = document.createElement('div');
		imgDiv.style.textAlign = 'center';
		const img = document.createElement('img');
		img.src = 'https://cdn.discordapp.com/attachments/747893391907618927/817419423106203738/image0.jpg';
		img.style.width = '90%';
		img.style.maxWidth = '450px';
		imgDiv.appendChild(img);
		container.appendChild(imgDiv);
		showModalElem("Get your TheGameCrafter Sets now!", container, false, yesNoOptions);
	}
};

OnboardingFunctions.showGinseng2_0Announcement = function() {
	if (localStorage.getItem(OnBoardingKeys.ginseng2_0Dismissed) !== "true") {
		var yesNoOptions = {};
		yesNoOptions.yesText = "OK - Don't show again";
		yesNoOptions.yesFunction = function() {
			localStorage.setItem(OnBoardingKeys.ginseng2_0Dismissed, "true");
			OnboardingFunctions.closeCurrentAnnouncement();
		};
		yesNoOptions.noText = "Close";
		const container = document.createElement('div');
		container.appendChild(document.createTextNode("Ginseng Pai Sho is now Ginseng 2.0! Check out the changes to the rules in the Help tab of a new Ginseng game - remember to hover over the tiles to see their descriptions."));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const discordLink = document.createElement('a');
		discordLink.href = 'https://skudpaisho.com/discord';
		discordLink.target = '_blank';
		discordLink.textContent = 'Join the Discord';
		container.appendChild(discordLink);
		container.appendChild(document.createTextNode(' to join The Garden Gate community and learn more about all things Pai Sho!'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const imgDiv = document.createElement('div');
		imgDiv.style.textAlign = 'center';
		const img = document.createElement('img');
		img.src = 'images/Ginseng/gaoling/GG.png';
		img.style.width = '30%';
		img.style.maxWidth = '450px';
		imgDiv.appendChild(img);
		container.appendChild(imgDiv);
		showModalElem("Ginseng Pai Sho 2.0 is here!", container, false, yesNoOptions);
	}
};

OnboardingFunctions.showPasswordAnnouncement = function() {
	if (localStorage.getItem(OnBoardingKeys.passwordAnnouncementDismissed) !== "true") {
		var yesNoOptions = {};
		yesNoOptions.yesText = "OK - Don't show again";
		yesNoOptions.yesFunction = function() {
			localStorage.setItem(OnBoardingKeys.passwordAnnouncementDismissed, "true");
			OnboardingFunctions.closeCurrentAnnouncement();
		};
		yesNoOptions.noText = "Close";
		const container = document.createElement('div');
		container.appendChild(document.createTextNode("The Garden Gate now supports password login in addition to the email verification login system. "));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode("Existing users without a password can set a password from the option in your My Games list. "));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		const discordLink = document.createElement('a');
		discordLink.href = 'https://skudpaisho.com/discord';
		discordLink.target = '_blank';
		discordLink.textContent = 'Join the Discord';
		container.appendChild(discordLink);
		container.appendChild(document.createTextNode(' to get help or report any issues you encounter with these changes. '));
		showModalElem("Password support on The Garden Gate", container, false, yesNoOptions);
	}
};
