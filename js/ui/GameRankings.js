/* Game Rankings UI */
function viewGameRankingsClicked() {
	showModal("Player Game Rankings", getLoadingModalText());
	onlinePlayEngine.getGameRankings(getLoginToken(), showGameRankingsCallback);
}

var showGameRankingsCallback = function showGameRankingsCallback(results) {
	if (results) {
		var resultData = {};
		try {
			resultData = JSON.parse(results);
		} catch (error) {
			debug("Error parsing info");
			closeModal();
			showModal("Error", "Error getting game rankings info.");
		}

		var message = "";

		if (resultData.playerGameRatings) {
			message = getUsername() + "'s game rankings:<br />";

			var gameRatings = resultData.playerGameRatings;

			if (gameRatings.length === 0) {
				message += "After you play a ranked game, you can see your game rankings here."
			} else {
				for (var i = 0; i < gameRatings.length; i++) {
					var gameRating = gameRatings[i];
					message += "<br />";
					message += gameRating.gameTypeDesc + ": " + gameRating.playerRating;
				}
			}
		}

		message += "<hr />";
		message += "Game Leaderboards:<br />";

		message += "<br />Coming soon!";

		showModal("Player Game Rankings", message);
	}
};

