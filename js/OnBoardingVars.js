/* For showing users helpful tips that can be dismissed */

var OnBoardingKeys = {
    confirmMoveButtonHelpDismissed: "confirmMoveButtonHelpDismissed",
    gameCrafterAnnouncementDissmissed: "gameCrafterAnnouncementDismissed",
    gameCrafterCrowdSaleDismissed: "gameCrafterCrowdSaleDismissed"
};

function OnboardingFunctions() {

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
            closeModal();
            localStorage.setItem(OnBoardingKeys.confirmMoveButtonHelpDismissed, "true");
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
            closeModal();
            localStorage.setItem(OnBoardingKeys.gameCrafterAnnouncementDissmissed, "true");
        };
	yesNoOptions.noText = "Close";
        showModal(
            "Pai Sho Set Giveaway!",
            "Coming soon, a Pai Sho set printed by TheGameCrafter, designed by The Garden Gate. And you can win a copy! <a href='https://discord.gg/dStDZx7' target='_blank'>Join the Discord</a> for more information on how to get a chance to win. (Hint: Be playing lots of games, and be in the Discord!)"
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
            closeModal();
            localStorage.setItem(OnBoardingKeys.gameCrafterCrowdSaleDismissed, "true");
        };
	yesNoOptions.noText = "Close";
        showModal(
            "The Garden Gate Pai Sho Set!",
            "The Pai Sho set printed by TheGameCrafter, designed by The Garden Gate, is <a href='https://www.thegamecrafter.com/crowdsale/the-garden-gate-pai-sho-set' target='_blank'>on sale now! Order it here!</a> As more copies are ordered during the sale, the price goes down for everyone. <br /><br />This set includes tiles to play Skud Pai Sho, Vagabond Pai Sho, Adevăr Pai Sho, and more! <br /><br /><a href='https://discord.gg/dStDZx7' target='_blank'>Join the Discord community</a> for more information."
            + "<br /><br /><div align='center'><a href='https://www.thegamecrafter.com/crowdsale/the-garden-gate-pai-sho-set' target='_blank'><img src='https://cdn.discordapp.com/attachments/747893391907618927/817419423106203738/image0.jpg' width='90%' style='max-width:450px'></a></div>",
            false,
            yesNoOptions);
    }
};
