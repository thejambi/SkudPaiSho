/* For showing users helpful tips that can be dismissed */

var OnBoardingKeys = {
	confirmMoveButtonHelpDismissed: "confirmMoveButtonHelpDismissed",
	gameCrafterAnnouncementDissmissed: "gameCrafterAnnouncementDismissed",
	gameCrafterCrowdSaleDismissed: "gameCrafterCrowdSaleDismissed",
	joinDiscord20211028Dismissed: "joinDiscord20211028Dismissed",
	gameCrafter202210Dissmissed: "gameCrafter202210Dismissed",
	ginseng2_0Dismissed: "ginseng2_0Dismissed",
	gameCrafterGiveaway202211Dismissed: "gameCrafterGiveaway202211Dismissed",
	passwordAnnouncementDismissed: "passwordAnnouncementDismissed"
};

function OnboardingFunctions() {

};

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
	Object.keys(OnBoardingKeys).forEach(function(key, index) {
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
		showModal(
			"Submitting Your Move",
			"To submit your move in an online game, click the Submit Move button at the bottom of screen. <br /><br />To automatically submit your moves, visit the Device Preferences from your My Games list.",
			false,
			yesNoOptions);
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
		showModal(
			"Pai Sho Set Giveaway!",
			"Coming soon, a Pai Sho set printed by TheGameCrafter, designed by The Garden Gate. And you can win a copy! <a href='https://skudpaisho.com/discord' target='_blank'>Join the Discord</a> for more information on how to get a chance to win. (Hint: Be playing lots of games, and be in the Discord!)"
			+ "<br /><br /><div align='center'><img src='https://cdn.discordapp.com/attachments/747893391907618927/817419423106203738/image0.jpg' width='90%' style='max-width:450px'></div>",
			false,
			yesNoOptions);
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
		showModal(
			"On Sale Now - The Garden Gate Pai Sho Set!",
			"The Pai Sho set printed by TheGameCrafter, designed by The Garden Gate, is <a href='https://www.thegamecrafter.com/crowdsale/the-garden-gate-pai-sho-set' target='_blank'>on sale now! Order it here!</a> As more copies are ordered during the sale, the price goes down for everyone. <br /><br />This set includes tiles to play Skud Pai Sho, Vagabond Pai Sho, Adevăr Pai Sho, and more! <br /><br /><a href='https://skudpaisho.com/discord' target='_blank'>Join the Discord community</a> for more information."
			+ "<br /><br /><div align='center'><a href='https://www.thegamecrafter.com/crowdsale/the-garden-gate-pai-sho-set' target='_blank'><img src='https://cdn.discordapp.com/attachments/747893391907618927/817419423106203738/image0.jpg' width='90%' style='max-width:450px'></a></div>",
			false,
			yesNoOptions);
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
		showModal(
			"The Garden Gate Community Meetup!",
			"Hi! If you didn't know, there is an active Discord community for The Garden Gate. "
			+ "Members of the community are planning a real life Pai Sho Con and want to invite you to participate in person or virtually via Discord! <a href='https://skudpaisho.com/discord' target='_blank'>Join the Discord server</a> today to find out more and get involved.<br />"
			+ "<br /><br /><div align='center'><img src='https://cdn.discordapp.com/attachments/904911184803807273/904911232023265300/0001.jpg' width='90%' style='max-width:480px'></div>",
			false,
			yesNoOptions);
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
		showModal(
			"Pai Sho Set Giveaway!",
			"At the end of this week, I'll draw a name and give away a The Garden Gate TheGameCrafter Pai Sho set! <a href='https://skudpaisho.com/discord' target='_blank'>Join the Discord</a> to find details on how to enter."
			+ "<br /><br /><a href='https://www.thegamecrafter.com/games/the-garden-gate-pai-sho-set' target='_blank'>See more details about The Garden Gate TheGameCrafter set here</a> - The most affordable Pai Sho set! Includes the full Skud Pai Sho rulebook and tiles for Skud, Vagabond, Adevar, and Ginseng Pai Sho"
			+ "<br /><br /><div align='center'><img src='https://cdn.discordapp.com/attachments/747893391907618927/817419423106203738/image0.jpg' width='90%' style='max-width:450px'></div>",
			false,
			yesNoOptions);
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
		showModal(
			"Get your TheGameCrafter Sets now!",
			"Soon, TheGameCrafter needs to raise prices of due to rising costs of components. If you are interested in getting one of the TheGameCrafter sets we have, now is the time before the prices go up! "
			+ "<br /><br /><a href='https://www.thegamecrafter.com/games/the-garden-gate-pai-sho-set' target='_blank'>The Garden Gate Pai Sho Set</a> - The most affordable Pai Sho set! Includes the full Skud Pai Sho rulebook and tiles for Skud, Vagabond, Adevar, and Ginseng Pai Sho"
			+ "<br /><br /><a href='https://www.thegamecrafter.com/games/adev%C4%83r-pai-sho-rose-edition' target='_blank'>Adevar Pai Sho - Rose Edition</a> - An Adevar specific set with special edition board and tiles"
			+ "<br /><br /><a href='https://www.thegamecrafter.com/games/key-pai-sho-deluxe-edition-' target='_blank'>Key Pai Sho Set</a> - A beautiful Key Pai Sho specific set, also good for playing Skud and Vagabond"
			+ "<br /><br /><a href='https://skudpaisho.com/discord' target='_blank'>Join the Discord</a> to get in touch and ask any questions about the different sets."
			+ "<br /><br /><div align='center'><img src='https://cdn.discordapp.com/attachments/747893391907618927/817419423106203738/image0.jpg' width='90%' style='max-width:450px'></div>",
			false,
			yesNoOptions);
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
		showModal(
			"Ginseng Pai Sho 2.0 is here!",
			"Ginseng Pai Sho is now Ginseng 2.0! Check out the changes to the rules in the Help tab of a new Ginseng game - remember to hover over the tiles to see their descriptions."
			+ "<br /><br /><a href='https://skudpaisho.com/discord' target='_blank'>Join the Discord</a> to join The Garden Gate community and learn more about all things Pai Sho!"
			+ "<br /><br /><div align='center'><img src='images/Ginseng/gaoling/GG.png' width='30%' style='max-width:450px'></div>",
			false,
			yesNoOptions);
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
		showModal(
			"Password support on The Garden Gate",
			"The Garden Gate now supports password login in addition to the email verification login system. "
			+ "<br /><br />Existing users without a password can set a password from the option in your My Games list. "
			+ "<br /><br /><a href='https://skudpaisho.com/discord' target='_blank'>Join the Discord</a> to get help or report any issues you encounter with these changes. ",
			false,
			yesNoOptions);
	}
};
