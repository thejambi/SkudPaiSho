// Tournament Management Module
// Handles all tournament-related functionality including viewing, creating, and managing tournaments

import {
	closeModal,
	onlinePlayEngine,
	toggleCollapsedContent,
	jumpToGame,
	currentGameData,
	ggOptions,
	getGameTypeEntryFromId,
	showModalElem,
	getLoadingModalElement,
} from './PaiShoMain';
import { getLoginToken, getUsername, userIsLoggedIn } from './UserData';
import { htmlEscape } from './TextHelpers';
import { debug } from './GameData';

// Module state
let tournamentToManage = 0;
let manageTournamentActionData = {};
let signingUpForTournamentId = 0;

// Tournament List View
export function showPastTournamentsClicked() {
	const completeTournamentElements = document.getElementsByClassName("completeTournament");
	for (let i = 0; i < completeTournamentElements.length; i++) {
		completeTournamentElements[i].classList.remove("gone");
	}
}

const showTournamentsCallback = (results) => {
	const dialogHeading = "Tournaments and Events";
	const container = document.createElement('div');

	if (results) {
		let tourneyData = {};
		let tourneyList = [];
		let isTournamentManager = false;
		let completedTournamentsExist = false;
		try {
			tourneyData = JSON.parse(results);
			tourneyList = tourneyData.tournamentList;
			isTournamentManager = tourneyData.isTournamentManager;
		} catch (error) {
			debug("Error parsing tournament data");
			closeModal();
			showModalElem(dialogHeading, document.createTextNode("Error getting tournament data."));
			return;
		}

		debug(tourneyList);

		let first = true;
		let tourneyHeading = "";
		let completedWrapper = null;
		for (const index in tourneyList) {
			const tourney = tourneyList[index];

			if (tourney.status !== "Canceled") {
				if (tourney.status !== tourneyHeading) {
					tourneyHeading = tourney.status;
					if (tourneyHeading === 'Completed') {
						completedWrapper = document.createElement('div');
						completedWrapper.classList.add('completeTournament', 'gone');
						completedTournamentsExist = true;
					}
					if (first) {
						first = false;
					} else {
						const target = completedWrapper || container;
						target.appendChild(document.createElement('br'));
					}
					const headingDiv = document.createElement('div');
					headingDiv.classList.add('modalContentHeading');
					headingDiv.textContent = tourneyHeading;
					const target = completedWrapper || container;
					target.appendChild(headingDiv);
				}

				const tourneyDiv = document.createElement('div');
				tourneyDiv.classList.add('clickableText');
				tourneyDiv.textContent = tourney.name;
				const tourneyId = tourney.id;
				tourneyDiv.onclick = () => viewTournamentInfo(tourneyId);

				if (tourneyHeading === 'Completed' && completedWrapper) {
					const itemWrapper = document.createElement('div');
					itemWrapper.classList.add('completeTournament', 'gone');
					itemWrapper.appendChild(tourneyDiv);
					container.appendChild(itemWrapper);
				} else {
					container.appendChild(tourneyDiv);
				}
			}
		}

		if (completedTournamentsExist) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));
			const showPastDiv = document.createElement('div');
			showPastDiv.classList.add('clickableText');
			showPastDiv.textContent = 'Show completed tournaments';
			showPastDiv.onclick = () => showPastTournamentsClicked();
			container.appendChild(showPastDiv);
		}
		if (isTournamentManager) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));
			const manageDiv = document.createElement('div');
			manageDiv.classList.add('clickableText');
			manageDiv.textContent = 'Manage Tournaments';
			manageDiv.onclick = () => manageTournamentsClicked();
			container.appendChild(manageDiv);
		}

	} else {
		container.appendChild(document.createTextNode("No current tournaments."));
	}

	showModalElem(dialogHeading, container);
};

export function viewTournamentsClicked() {
	showModalElem("Tournaments and Events", getLoadingModalElement());
	onlinePlayEngine.getCurrentTournaments(getLoginToken(), showTournamentsCallback);
}

// Tournament Signup
export function signUpForTournament(tournamentId, tournamentName) {
	const container = document.createElement('div');

	const headingDiv = document.createElement('div');
	headingDiv.classList.add('modalContentHeading');
	headingDiv.textContent = 'Tournament: ' + tournamentName;
	container.appendChild(headingDiv);

	container.appendChild(document.createElement('br'));
	const questionDiv = document.createElement('div');
	questionDiv.textContent = 'Sign up to participate in this tournament?';
	container.appendChild(questionDiv);

	container.appendChild(document.createElement('br'));
	const yesSpan = document.createElement('span');
	yesSpan.classList.add('clickableText');
	yesSpan.textContent = 'Yes - Sign up!';
	yesSpan.onclick = () => submitTournamentSignup(tournamentId);
	container.appendChild(yesSpan);

	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	const cancelSpan = document.createElement('span');
	cancelSpan.classList.add('clickableText');
	cancelSpan.textContent = 'Cancel';
	cancelSpan.onclick = () => viewTournamentInfo(tournamentId);
	container.appendChild(cancelSpan);

	showModalElem("Tournament Sign Up", container);
}

const submitTournamentSignupCallback = (results) => {
	viewTournamentInfo(signingUpForTournamentId);
};

export function submitTournamentSignup(tournamentId) {
	showModalElem("Tournament Signup", getLoadingModalElement());
	signingUpForTournamentId = tournamentId;
	onlinePlayEngine.submitTournamentSignup(getLoginToken(), tournamentId, submitTournamentSignupCallback);
}

// Tournament Info View
const showTournamentInfoCallback = (results) => {
	const container = document.createElement('div');
	let modalTitle = "Tournament Details";

	if (results) {
		let tournamentInfo = {};
		try {
			tournamentInfo = JSON.parse(results);
		} catch (error) {
			debug("Error parsing tournament info");
			closeModal();
			showModalElem("Tournaments", document.createTextNode("Error getting tournament info."));
			return;
		}

		debug(tournamentInfo);

		modalTitle = tournamentInfo.name;

		const statusDiv = document.createElement('div');
		statusDiv.classList.add('modalContentHeading');
		statusDiv.textContent = 'Event status: ' + tournamentInfo.status;
		container.appendChild(statusDiv);

		if (tournamentInfo.details) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createTextNode(tournamentInfo.details));
		}

		if (tournamentInfo.forumUrl) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));
			const forumLink = document.createElement('a');
			forumLink.href = tournamentInfo.forumUrl;
			forumLink.target = '_blank';
			forumLink.classList.add('clickableText');
			forumLink.textContent = 'Full details ';
			const icon = document.createElement('i');
			icon.classList.add('fa', 'fa-external-link');
			forumLink.appendChild(icon);
			container.appendChild(forumLink);
		}

		let playerIsSignedUp = false;
		if (tournamentInfo.currentPlayers.length > 0) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));
			const playersHeading = document.createElement('div');
			playersHeading.classList.add('modalContentHeading', 'collapsibleHeading', 'collapsed');
			playersHeading.textContent = 'Players currently signed up:';
			const plusSpan = document.createElement('span');
			plusSpan.style.float = 'right';
			plusSpan.textContent = '+';
			playersHeading.appendChild(plusSpan);
			playersHeading.onclick = function() { toggleCollapsedContent(this, this.nextElementSibling); };
			container.appendChild(playersHeading);

			const playersContent = document.createElement('div');
			playersContent.classList.add('collapsibleContent');
			playersContent.style.display = 'none';
			for (let i = 0; i < tournamentInfo.currentPlayers.length; i++) {
				playersContent.appendChild(document.createTextNode(tournamentInfo.currentPlayers[i].username));
				playersContent.appendChild(document.createElement('br'));
				if (tournamentInfo.currentPlayers[i].username === getUsername()) {
					playerIsSignedUp = true;
				}
			}
			container.appendChild(playersContent);
		}

		container.appendChild(document.createElement('br'));

		if (tournamentInfo.rounds && tournamentInfo.rounds.length > 0) {
			for (let i = 0; i < tournamentInfo.rounds.length; i++) {
				const round = tournamentInfo.rounds[i];
				const roundName = htmlEscape(round.name);

				container.appendChild(document.createElement('br'));
				const roundHeading = document.createElement('div');
				roundHeading.classList.add('collapsibleHeading', 'collapsed');
				roundHeading.textContent = roundName;
				const plusSpan = document.createElement('span');
				plusSpan.style.float = 'right';
				plusSpan.textContent = '+';
				roundHeading.appendChild(plusSpan);
				roundHeading.onclick = function() { toggleCollapsedContent(this, this.nextElementSibling); };
				container.appendChild(roundHeading);

				const roundContent = document.createElement('div');
				roundContent.classList.add('collapsibleContent');
				roundContent.style.display = 'none';

				/* Display all games for round */
				let gamesFoundForRound = false;
				for (let j = 0; j < tournamentInfo.games.length; j++) {
					const game = tournamentInfo.games[j];
					if (game.roundId === round.id) {
						const gameDiv = document.createElement('div');
						gameDiv.classList.add('clickableText');
						const gameId = game.gameId;
						gameDiv.onclick = () => matchGameClicked(gameId);

						gameDiv.appendChild(document.createTextNode(htmlEscape(game.gameType) + ': '));

						// Host player
						const hostWaiting = !game.gameWinnerUsername && game.lastPlayedUsername && game.lastPlayedUsername !== game.hostUsername;
						const hostWon = game.gameWinnerUsername && game.gameWinnerUsername === game.hostUsername;
						if (hostWaiting) {
							const em = document.createElement('em');
							em.textContent = (hostWon ? '[' : '') + game.hostUsername + (hostWon ? ']' : '');
							gameDiv.appendChild(em);
						} else {
							gameDiv.appendChild(document.createTextNode((hostWon ? '[' : '') + game.hostUsername + (hostWon ? ']' : '')));
						}

						gameDiv.appendChild(document.createTextNode(' vs '));

						// Guest player
						const guestWaiting = !game.gameWinnerUsername && game.lastPlayedUsername && game.lastPlayedUsername !== game.guestUsername;
						const guestWon = game.gameWinnerUsername && game.gameWinnerUsername === game.guestUsername;
						if (guestWaiting) {
							const em = document.createElement('em');
							em.textContent = (guestWon ? '[' : '') + game.guestUsername + (guestWon ? ']' : '');
							gameDiv.appendChild(em);
						} else {
							gameDiv.appendChild(document.createTextNode((guestWon ? '[' : '') + game.guestUsername + (guestWon ? ']' : '')));
						}

						if (game.gameResultId && game.gameResultId === 4) {
							gameDiv.appendChild(document.createTextNode(' [draw]'));
						}

						roundContent.appendChild(gameDiv);
						gamesFoundForRound = true;
					}
				}

				if (!gamesFoundForRound) {
					const noGamesDiv = document.createElement('div');
					const noGamesEm = document.createElement('em');
					noGamesEm.textContent = 'No games';
					noGamesDiv.appendChild(noGamesEm);
					roundContent.appendChild(noGamesDiv);
				}
				container.appendChild(roundContent);
			}

		} else {
			container.appendChild(document.createElement('br'));
			const noRoundsEm = document.createElement('em');
			noRoundsEm.textContent = 'No rounds';
			container.appendChild(noRoundsEm);
		}

		if (userIsLoggedIn() && tournamentInfo.signupAvailable && !playerIsSignedUp) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));
			const signupDiv = document.createElement('div');
			signupDiv.classList.add('clickableText');
			signupDiv.textContent = 'Sign up for tournament';
			const tId = tournamentInfo.id;
			const tName = htmlEscape(tournamentInfo.name);
			signupDiv.onclick = () => signUpForTournament(tId, tName);
			container.appendChild(signupDiv);
		} else if (!userIsLoggedIn()) {
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createElement('br'));
			container.appendChild(document.createTextNode('Sign in and start playing to participate in tournaments.'));
		}
	} else {
		container.appendChild(document.createTextNode("No tournament info found."));
	}

	showModalElem(modalTitle, container);
};

export function viewTournamentInfo(tournamentId) {
	showModalElem("Tournament Details", getLoadingModalElement());
	onlinePlayEngine.getTournamentInfo(tournamentId, showTournamentInfoCallback);
}

// Tournament Creation
export function submitCreateTournament() {
	const name = htmlEscape(document.getElementById('createTournamentName').value);
	const forumUrl = htmlEscape(document.getElementById('createTournamentForumUrl').value);
	const details = htmlEscape(document.getElementById('createTournamentDetails').value);

	onlinePlayEngine.createTournament(getLoginToken(), name, forumUrl, details, manageTournamentsClicked);
}

export function createNewTournamentClicked() {
	const container = document.createElement('div');

	const instructionsDiv = document.createElement('div');
	instructionsDiv.appendChild(document.createTextNode('Please create a thread in the Tournaments section of the forum with details about your tournament. Put the url of your tournament thread in the Forum URL field. '));
	instructionsDiv.appendChild(document.createElement('br'));
	instructionsDiv.appendChild(document.createElement('br'));
	instructionsDiv.appendChild(document.createTextNode('Put a short summary in the Details field that will help players understand what kind of tournament this will be.'));
	container.appendChild(instructionsDiv);

	container.appendChild(document.createElement('br'));
	const nameDiv = document.createElement('div');
	nameDiv.appendChild(document.createTextNode('Name:'));
	nameDiv.appendChild(document.createElement('br'));
	const nameInput = document.createElement('input');
	nameInput.type = 'text';
	nameInput.id = 'createTournamentName';
	nameDiv.appendChild(nameInput);
	container.appendChild(nameDiv);

	container.appendChild(document.createElement('br'));
	const urlDiv = document.createElement('div');
	urlDiv.appendChild(document.createTextNode('Forum URL:'));
	urlDiv.appendChild(document.createElement('br'));
	const urlInput = document.createElement('input');
	urlInput.type = 'text';
	urlInput.id = 'createTournamentForumUrl';
	urlDiv.appendChild(urlInput);
	container.appendChild(urlDiv);

	container.appendChild(document.createElement('br'));
	const detailsDiv = document.createElement('div');
	detailsDiv.appendChild(document.createTextNode('1-line Summary:'));
	detailsDiv.appendChild(document.createElement('br'));
	const detailsTextarea = document.createElement('textarea');
	detailsTextarea.id = 'createTournamentDetails';
	detailsDiv.appendChild(detailsTextarea);
	container.appendChild(detailsDiv);

	container.appendChild(document.createElement('br'));
	const createDiv = document.createElement('div');
	createDiv.classList.add('clickableText');
	createDiv.textContent = 'Create Tournament';
	createDiv.onclick = () => submitCreateTournament();
	container.appendChild(createDiv);

	container.appendChild(document.createElement('br'));
	const cancelDiv = document.createElement('div');
	cancelDiv.classList.add('clickableText');
	cancelDiv.textContent = 'Cancel';
	cancelDiv.onclick = () => manageTournamentsClicked();
	container.appendChild(cancelDiv);

	showModalElem("Create Tournament", container);
}

// Tournament Management
const goToManageTournamentCallback = (results) => {
	manageTournamentClicked(tournamentToManage);
};

export function createNewRound(tournamentId) {
	const roundName = document.getElementById('newRoundName').value;
	onlinePlayEngine.createNewRound(getLoginToken(), tournamentId, roundName, "", goToManageTournamentCallback);
}

export function changeTournamentPlayerStatus(tournamentId, usernameToChange, newTournamentPlayerStatusId) {
	onlinePlayEngine.changeTournamentPlayerStatus(getLoginToken(), tournamentId, usernameToChange, newTournamentPlayerStatusId, goToManageTournamentCallback);
}

export function roundClicked(id, name) {
	manageTournamentActionData.newMatchData.roundId = id;
	manageTournamentActionData.newMatchData.roundName = name;
	const roundDisplay = document.getElementById('newTournamentMatchRound');
	if (roundDisplay) {
		roundDisplay.innerText = name;
	}
}

export function playerNameClicked(id, username) {
	let nameDisplay;
	if (manageTournamentActionData.newMatchData.hostId > 0
		&& (!manageTournamentActionData.newMatchData.guestId
			|| manageTournamentActionData.newMatchData.guestId <= 0)) {
		manageTournamentActionData.newMatchData.guestId = id;
		manageTournamentActionData.newMatchData.guestUsername = username;
		nameDisplay = document.getElementById('newTournamentMatchGuest');
	} else {
		manageTournamentActionData.newMatchData.hostId = id;
		manageTournamentActionData.newMatchData.hostUsername = username;
		nameDisplay = document.getElementById('newTournamentMatchHost');
		manageTournamentActionData.newMatchData.guestId = 0;
		manageTournamentActionData.newMatchData.guestUsername = null;
		document.getElementById('newTournamentMatchGuest').innerText = '';
	}

	if (nameDisplay) {
		nameDisplay.innerText = username;
	}
}

export function createNewTournamentMatch() {
	const roundId = manageTournamentActionData.newMatchData.roundId;
	const gameTypeId = currentGameData.gameTypeId;
	const hostUsername = manageTournamentActionData.newMatchData.hostUsername;
	const guestUsername = manageTournamentActionData.newMatchData.guestUsername;
	const options = JSON.stringify(ggOptions);
	const isRanked = currentGameData.isRankedGame;

	onlinePlayEngine.createTournamentRoundMatch(
		getLoginToken(),
		roundId,
		gameTypeId,
		hostUsername,
		guestUsername,
		options,
		isRanked,
		goToManageTournamentCallback
	);
}

export function matchGameClicked(gameId) {
	jumpToGame(gameId);
	closeModal();
}

export function changeTournamentStatus(tournamentId, newTournamentStatusId) {
	onlinePlayEngine.changeTournamentStatus(
		getLoginToken(),
		tournamentId,
		newTournamentStatusId,
		goToManageTournamentCallback
	);
}

const showManageTournamentCallback = (results) => {
	const container = document.createElement('div');
	const modalTitle = "Manage Tournament";

	if (results) {
		let resultData = {};
		try {
			resultData = JSON.parse(results);
		} catch (error) {
			debug("Error parsing info");
			closeModal();
			showModalElem(modalTitle, document.createTextNode("Error getting tournament info."));
			return;
		}

		manageTournamentActionData.newMatchData = {};

		debug(results);
		debug(resultData);

		const nameDiv = document.createElement('div');
		nameDiv.classList.add('modalContentHeading');
		nameDiv.textContent = resultData.name;
		container.appendChild(nameDiv);

		const detailsDiv = document.createElement('div');
		detailsDiv.textContent = resultData.details;
		container.appendChild(detailsDiv);

		container.appendChild(document.createElement('br'));
		const statusDiv = document.createElement('div');
		statusDiv.textContent = 'Status: ' + resultData.status;
		container.appendChild(statusDiv);

		/* Defaults for these if statusId is 1 */
		let nextStatusId = 2;
		let nextStatusActionText = "Begin Tournament";
		if (resultData.statusId === 2) {
			nextStatusId = 3;
			nextStatusActionText = "Complete Tournament";
		} else if (resultData.statusId === 3) {
			nextStatusId = 4;
			nextStatusActionText = "Cancel Tournament";
		} else if (resultData.statusId === 4) {
			nextStatusId = 1;
			nextStatusActionText = "Restore Tournament to Upcoming";
		}

		const statusActionDiv = document.createElement('div');
		statusActionDiv.classList.add('clickableText');
		statusActionDiv.textContent = nextStatusActionText;
		const tournamentId = resultData.id;
		const statusToSet = nextStatusId;
		statusActionDiv.onclick = () => changeTournamentStatus(tournamentId, statusToSet);
		container.appendChild(statusActionDiv);

		let mostRecentRound = null;
		if (resultData.rounds && resultData.rounds.length > 0) {
			for (let i = 0; i < resultData.rounds.length; i++) {
				const round = resultData.rounds[i];
				mostRecentRound = round;
				const roundName = htmlEscape(round.name);

				container.appendChild(document.createElement('br'));
				const roundDiv = document.createElement('div');
				roundDiv.classList.add('clickableText');
				roundDiv.textContent = roundName;
				const rId = round.id;
				const rName = roundName;
				roundDiv.onclick = () => roundClicked(rId, rName);
				container.appendChild(roundDiv);

				/* Display all games for round */
				for (let j = 0; j < resultData.games.length; j++) {
					const game = resultData.games[j];
					if (game.roundId === round.id) {
						const gameDiv = document.createElement('div');
						gameDiv.classList.add('clickableText');
						gameDiv.textContent = htmlEscape(game.gameType) + ':' + game.hostUsername + ' vs ' + game.guestUsername;
						const gId = game.gameId;
						gameDiv.onclick = () => matchGameClicked(gId);
						container.appendChild(gameDiv);
					}
				}
			}

			/* Automatically select the most recent Round for match creating */
			setTimeout(() => {
				roundClicked(mostRecentRound.id, htmlEscape(mostRecentRound.name));
			}, 200);
		} else {
			container.appendChild(document.createElement('br'));
			const noRoundsEm = document.createElement('em');
			noRoundsEm.textContent = 'No rounds';
			container.appendChild(noRoundsEm);
		}

		container.appendChild(document.createElement('br'));
		const newRoundHeading = document.createElement('div');
		newRoundHeading.classList.add('modalContentHeading');
		newRoundHeading.textContent = 'New Round';
		container.appendChild(newRoundHeading);

		const roundNameDiv = document.createElement('div');
		roundNameDiv.appendChild(document.createTextNode('Name:'));
		roundNameDiv.appendChild(document.createElement('br'));
		const roundNameInput = document.createElement('input');
		roundNameInput.type = 'text';
		roundNameInput.id = 'newRoundName';
		roundNameDiv.appendChild(roundNameInput);
		container.appendChild(roundNameDiv);

		const createRoundDiv = document.createElement('div');
		createRoundDiv.classList.add('clickableText');
		createRoundDiv.textContent = 'Create Round';
		createRoundDiv.onclick = () => createNewRound(tournamentId);
		container.appendChild(createRoundDiv);

		let changeStatusIdTo;
		/* Players */
		if (resultData.players && resultData.players.length > 1) {
			let playerStatusId = 0;
			let statusChangeLinkText = "";
			for (let i = 0; i < resultData.players.length; i++) {
				const player = resultData.players[i];
				if (player.statusId !== playerStatusId) {
					container.appendChild(document.createElement('br'));
					const playerStatusDiv = document.createElement('div');
					playerStatusDiv.innerHTML = '&nbsp;&nbsp;' + player.status;
					container.appendChild(playerStatusDiv);
					playerStatusId = player.statusId;
					if (playerStatusId === 1 || playerStatusId === 5) {
						statusChangeLinkText = "approve";
						changeStatusIdTo = 2;
					} else if (playerStatusId === 2) {
						statusChangeLinkText = "eliminate";
						changeStatusIdTo = 3;
					} else {
						statusChangeLinkText = "disqualify";
						changeStatusIdTo = 5;
					}
				}
				const playerUsername = htmlEscape(player.username);

				const playerDiv = document.createElement('div');
				const nameSpan = document.createElement('span');
				nameSpan.textContent = playerUsername;
				if (playerStatusId !== 5) {
					nameSpan.classList.add('clickableText');
					const pUserId = player.userId;
					const pUsername = playerUsername;
					nameSpan.onclick = () => playerNameClicked(pUserId, pUsername);
				}
				playerDiv.appendChild(nameSpan);

				const spaceText = document.createTextNode('\u00A0(');
				playerDiv.appendChild(spaceText);

				const statusSpan = document.createElement('span');
				statusSpan.classList.add('clickableText');
				statusSpan.textContent = statusChangeLinkText;
				const pUsername = playerUsername;
				const statusIdToChange = changeStatusIdTo;
				statusSpan.onclick = () => changeTournamentPlayerStatus(tournamentId, pUsername, statusIdToChange);
				playerDiv.appendChild(statusSpan);

				playerDiv.appendChild(document.createTextNode(')'));
				container.appendChild(playerDiv);
			}
		}

		/* Create new game section */
		container.appendChild(document.createElement('br'));
		const newMatchHeading = document.createElement('div');
		newMatchHeading.classList.add('modalContentHeading');
		newMatchHeading.textContent = 'New Match';
		container.appendChild(newMatchHeading);

		container.appendChild(document.createTextNode('To create a new match, click the Round and players to apply.'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode('Game will share the same type and options as the game you currently have open.'));

		container.appendChild(document.createElement('br'));
		const roundEm = document.createElement('em');
		roundEm.textContent = 'Round:';
		container.appendChild(roundEm);
		container.appendChild(document.createTextNode(' '));
		const roundSpan = document.createElement('span');
		roundSpan.id = 'newTournamentMatchRound';
		container.appendChild(roundSpan);

		container.appendChild(document.createElement('br'));
		const hostEm = document.createElement('em');
		hostEm.textContent = 'Host:';
		container.appendChild(hostEm);
		container.appendChild(document.createTextNode(' '));
		const hostSpan = document.createElement('span');
		hostSpan.id = 'newTournamentMatchHost';
		container.appendChild(hostSpan);

		container.appendChild(document.createElement('br'));
		const guestEm = document.createElement('em');
		guestEm.textContent = 'Guest:';
		container.appendChild(guestEm);
		container.appendChild(document.createTextNode(' '));
		const guestSpan = document.createElement('span');
		guestSpan.id = 'newTournamentMatchGuest';
		container.appendChild(guestSpan);

		const currentGameTypeEntry = getGameTypeEntryFromId(currentGameData.gameTypeId);

		container.appendChild(document.createElement('br'));
		const gameEm = document.createElement('em');
		gameEm.textContent = 'Game:';
		container.appendChild(gameEm);
		container.appendChild(document.createTextNode(' ' + htmlEscape(currentGameTypeEntry.desc)));

		container.appendChild(document.createElement('br'));
		const optionsEm = document.createElement('em');
		optionsEm.textContent = 'Options:';
		container.appendChild(optionsEm);
		container.appendChild(document.createTextNode(' ' + JSON.stringify(ggOptions)));

		container.appendChild(document.createElement('br'));
		const rankedEm = document.createElement('em');
		rankedEm.textContent = 'Is Ranked?:';
		container.appendChild(rankedEm);
		container.appendChild(document.createTextNode(' ' + (currentGameData.isRankedGame === 'Y' ? 'Yes' : 'No')));

		const createMatchDiv = document.createElement('div');
		createMatchDiv.classList.add('clickableText');
		createMatchDiv.textContent = 'Create Match';
		createMatchDiv.onclick = () => createNewTournamentMatch();
		container.appendChild(createMatchDiv);

		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
	} else {
		container.appendChild(document.createTextNode("No tournment info found."));
	}

	showModalElem(modalTitle, container);
};

export function manageTournamentClicked(tournamentId) {
	showModalElem("Manage Tournament", getLoadingModalElement());
	tournamentToManage = tournamentId;
	onlinePlayEngine.getManageTournamentInfo(getLoginToken(), tournamentId, showManageTournamentCallback);
}

const showManageTournamentsCallback = (results) => {
	const container = document.createElement('div');
	const modalTitle = "Manage Tournaments";

	if (results) {
		let resultData = {};
		try {
			resultData = JSON.parse(results);
		} catch (error) {
			debug("Error parsing info");
			closeModal();
			showModalElem(modalTitle, document.createTextNode("Error getting tournament info."));
			return;
		}

		const headingDiv = document.createElement('div');
		headingDiv.classList.add('modalContentHeading');
		headingDiv.textContent = 'Your Tournaments';
		container.appendChild(headingDiv);

		if (resultData.tournaments && resultData.tournaments.length > 0) {
			for (let i = 0; i < resultData.tournaments.length; i++) {
				const tournament = resultData.tournaments[i];
				const tournamentDiv = document.createElement('div');
				tournamentDiv.classList.add('clickableText');
				tournamentDiv.textContent = tournament.name;
				const tId = tournament.id;
				tournamentDiv.onclick = () => manageTournamentClicked(tId);
				container.appendChild(tournamentDiv);
			}
		} else {
			const noneEm = document.createElement('em');
			noneEm.textContent = 'None';
			container.appendChild(noneEm);
		}

		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));

		const createDiv = document.createElement('div');
		createDiv.classList.add('clickableText');
		createDiv.textContent = 'Create new tournament';
		createDiv.onclick = () => createNewTournamentClicked();
		container.appendChild(createDiv);
	} else {
		container.appendChild(document.createTextNode("No tournament info found."));
	}

	showModalElem(modalTitle, container);
};

export function manageTournamentsClicked() {
	showModalElem("Manage Tournaments", getLoadingModalElement());
	onlinePlayEngine.getManageTournamentsInfo(getLoginToken(), showManageTournamentsCallback);
}
