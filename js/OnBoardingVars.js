/* For showing users helpful tips that can be dismissed */

var OnBoardingKeys = {
    confirmMoveButtonHelpDismissed: "confirmMoveButtonHelpDismissed"
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
