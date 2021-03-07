/* For showing users helpful tips that can be dismissed */

var OnBoardingKeys = {
    confirmMoveButtonHelpDismissed: "confirmMoveButtonHelpDismissed",
    gameCrafterAnnouncementDissmissed: "gameCrafterAnnouncementDismissed"
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
