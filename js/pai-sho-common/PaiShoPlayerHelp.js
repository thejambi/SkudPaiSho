
var hostPlayerCode = 'H';
var guestPlayerCode = 'G';


function getPlayerCodeFromName(playerName) {
	if (playerName === HOST) {
		return hostPlayerCode;
	} else if (playerName === GUEST) {
		return guestPlayerCode;
	}
}

function getPlayerNameFromCode(playerCode) {
	if (playerCode === hostPlayerCode) {
		return HOST;
	} else if (playerCode === guestPlayerCode) {
		return GUEST;
	}
}

function getOpponentName(playerName) {
	if (playerName === HOST) {
		return GUEST;
	} else {
		return HOST;
	}
}
