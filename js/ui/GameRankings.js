/* Game Rankings UI */
import {
  closeModal,
  getLoadingModalElement,
  onlinePlayEngine,
  showModalElem,
} from '../PaiShoMain';
import { getLoginToken, getUsername } from '../UserData';
import { debug } from '../GameData';

export function viewGameRankingsClicked() {
	showModalElem("Player Game Rankings", getLoadingModalElement());
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
			showModalElem("Error", document.createTextNode("Error getting game rankings info."));
			return;
		}

		const container = document.createElement('div');

		if (resultData.playerGameRatings) {
			container.appendChild(document.createTextNode(getUsername() + "'s game rankings:"));
			container.appendChild(document.createElement('br'));

			var gameRatings = resultData.playerGameRatings;

			if (gameRatings.length === 0) {
				container.appendChild(document.createTextNode("After you play a ranked game, you can see your game rankings here."));
			} else {
				for (var i = 0; i < gameRatings.length; i++) {
					var gameRating = gameRatings[i];
					container.appendChild(document.createElement('br'));
					container.appendChild(document.createTextNode(gameRating.gameTypeDesc + ": " + gameRating.playerRating));
				}
			}
		}

		container.appendChild(document.createElement('hr'));
		container.appendChild(document.createTextNode("Game Leaderboards:"));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode("Coming soon!"));

		showModalElem("Player Game Rankings", container);
	}
};

