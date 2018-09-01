
var hostPlayerCode = 'H';
var guestPlayerCode = 'G';

function getPlayerCodeFromName(playerName) {
	if (playerName === HOST) {
		return hostPlayerCode;
	} else if (playerName === GUEST) {
		return guestPlayerCode;
	}
}

