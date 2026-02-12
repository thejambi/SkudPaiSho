/** OnlinePlayEngine */

import $ from 'jquery';
import { emptyCallback } from './GameState';
import { callFailed } from './ModalManager';

export class OnlinePlayEngine {
	constructor() {
		//
	}
	static callCallback(data, status, callback) {
		if (status === 'success') {
			callback(data.trim());
		} else {
			callFailed();
		}
	}
	testOnlinePlay() {
		this.getGameTypeDesc(1, emptyCallback);
	}
	/* Calls callback with userId values that match username or emailAddress. */
	isUserInfoAvailable(username, emailAddress, callback) {
		$.get("backend/isUserInfoAvailable.php?u=" + username + "&e=" + emailAddress,
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	userInfoExists(username, emailAddress, callback) {
		$.get("backend/userInfoExists.php?u=" + username + "&e=" + emailAddress,
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	validateSignIn(usernameOrEmail, password, callback) {
		$.post("backend/validateSignIn.php",
			{
				usernameOrEmail: usernameOrEmail,
				password: password
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	verifyLogin(userId, username, userEmail, deviceId, callback) {
		$.post("backend/verifyLogin.php",
			{
				userId: userId,
				username: username,
				userEmail: userEmail,
				deviceId: deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	sendVerificationCode(username, userEmail, callback) {
		$.post("backend/sendVerificationCode.php",
			{
				username: username,
				toEmail: userEmail,
				isWeb: 1
			},
			function(data) {
				callback(data.trim());
			}
		);
	}
	verifyCode(code, callback) {
		$.post("backend/verifyCode.php",
			{
				code: code
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	createUser(username, emailAddress, password, callback) {
		$.post("backend/createUserWithPwd.php",
			{
				u: username,
				e: emailAddress,
				p: password
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	updateUserPassword(loginToken, existingPassword, newPassword, callback) {
		$.post("backend/updateUserPassword.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				existingPassword: existingPassword,
				newPassword: newPassword
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}

	removeUserPassword(loginToken, callback) {
		$.post("backend/removeUserPassword.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail, 
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}

	createDeviceIdForUser(userId, callback) {
		$.post("backend/createDeviceIdForUser.php",
			{
				u: userId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	logOnlineStatus(loginToken, callback) {
		$.post("backend/logOnlineStatus.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	createGame(gameTypeId, gameNotationText, optionsString, isPrivateIndicator, loginToken, callback,
		rankedGame, gameClockJson) {
		$.post("backend/createGameV2.php",
			{
				t: gameTypeId,
				q: gameNotationText,
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				options: optionsString,
				isPrivateIndicator: isPrivateIndicator,
				isWeb: 1,
				rankedGame: rankedGame,
				gameClockJson: gameClockJson
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	joinGameSeek(gameId, loginToken, callback) {
		$.post("backend/joinGameSeek.php",
			{
				gameId: gameId,
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				isWeb: 1
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getGameSeeks(callback) {
		$.get("backend/getGameSeeksV2.php",
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				} else {
					callFailed();
				}
			}
		);
	}
	getCurrentGameSeeksHostedByUser(userId, gameTypeId, callback) {
		$.get("backend/getCurrentGameSeeksHostedByUser.php?userId=" + userId + "&gameTypeId=" + gameTypeId,
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getCurrentGamesForUserNew(loginToken, callback) {
		$.post("backend/getCurrentGamesForUserNew.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				} else {
					callFailed();
				}
			}
		);
	}
	getPastGamesForUserNew(loginToken, callback) {
		$.post("backend/getPastGamesForUserV2.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getPreviouslyActiveGameId(loginToken, gameId, opponentUsername, callback) {
		$.post("backend/getPreviouslyActiveGameId.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				gameId: gameId,
				opponentUsername: opponentUsername
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getGameInfo(userId, gameId, callback) {
		$.get("backend/getGameInfoV2.php?userId=" + userId + "&gameId=" + gameId + "&isWeb=1",
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getCountOfGamesWhereUserTurn(userId, callback) {
		$.get("backend/getCountOfGamesWhereUserTurn.php?userId=" + userId,
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getGameNotation(gameId, callback) {
		$.get("backend/getGameNotation.php?q=" + gameId,
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getGameNotationAndClock(gameId, callback) {
		$.get("backend/getGameNotationAndClock.php?q=" + gameId,
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	checkIfUserOnline(username, callback) {
		$.get("backend/checkIfUserOnline.php?u=" + username,
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	submitMove(gameToUpdateId, gameNotationText, loginToken, gameTypeName, callback,
		gameClockJson, gameResultId, move) {
		$.post("backend/updateGameNotationV3.php",
			{
				id: gameToUpdateId,
				t: gameNotationText,
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				gameTypeName: gameTypeName,
				gameClockJson: gameClockJson,
				gameResultId: gameResultId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim(), move);
				}
			}
		);
	}
	updateGameClock(gameId, gameClockJson, loginToken, callback) {
		$.post("backend/updateGameValue.php",
			{
				id: gameId,
				type: 6,
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				value: gameClockJson
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	updateGameWinInfo(gameId, winnerUsername, resultTypeCode, loginToken, callback,
		updateRatings, hostRating, guestRating, gameTypeId, hostUsername, guestUsername) {
		$.post("backend/updateGameWinInfoNew.php",
			{
				gameId: gameId,
				winnerUsername: winnerUsername,
				resultTypeCode: resultTypeCode,
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				updateRatings: updateRatings,
				hostRating: hostRating,
				guestRating: guestRating,
				gameTypeId: gameTypeId,
				hostUsername: hostUsername,
				guestUsername: guestUsername
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	updateGameWinInfoAsTie(gameId, resultTypeCode, loginToken, callback,
		updateRatings, hostRating, guestRating, gameTypeId, hostUsername, guestUsername) {
		$.post("backend/updateGameWinInfoAsTieNew.php",
			{
				gameId: gameId,
				resultTypeCode: resultTypeCode,
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				updateRatings: updateRatings,
				hostRating: hostRating,
				guestRating: guestRating,
				gameTypeId: gameTypeId,
				hostUsername: hostUsername,
				guestUsername: guestUsername
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getGameTypeDesc(gameTypeId, callback) {
		$.get("backend/getGameTypeDesc.php?q=" + gameTypeId,
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	sendChat(gameId, loginToken, chatMessage, callback) {
		$.post("backend/sendChatMessage.php",
			{
				gameId: gameId,
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				chatMessage: chatMessage
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getNewChatMessages(gameId, lastChatTimestamp, callback) {
		$.get("backend/getNewChatMessages.php?g=" + gameId + "&t=" + encodeURIComponent(lastChatTimestamp),
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getInitialGlobalChatMessages(callback) {
		$.get("backend/getInitialGlobalChatMessages.php?",
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	notifyUser(loginToken, userToNotify, callback) {
		$.post("backend/notifyUser.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				userToNotify: userToNotify
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	getEmailNotificationsSetting(userId, callback) {
		$.get("backend/getEmailNotificationsSetting.php?userId=" + userId,
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	// TODO change to 'updatePreference' and pass in the preference type id
	updateEmailNotificationsSetting(userId, value, callback) {
		$.post("backend/updateEmailNotificationsSetting.php",
			{
				userId: userId,
				value: value
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	addUserPreferenceValue(loginToken, prefTypeId, value, callback) {
		$.post("backend/addUserPreferenceValue.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				prefTypeId: prefTypeId,
				value: value
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	/* Tournaments */
	getCurrentTournaments(loginToken, callback) {
		$.get("backend/getCurrentTournaments.php?u=" + loginToken.userId,
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	getTournamentInfo(tournamentId, callback) {
		$.get("backend/getTournamentInfo.php?t=" + tournamentId,
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	getManageTournamentsInfo(loginToken, callback) {
		$.post("backend/getManageTournamentsInfo.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	getManageTournamentInfo(loginToken, tournamentId, callback) {
		$.post("backend/getManageTournamentInfo.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				tournamentId: tournamentId
			},
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	submitTournamentSignup(loginToken, tournamentId, callback) {
		$.post("backend/submitTournamentSignup.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				tournamentId: tournamentId
			},
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	createTournament(loginToken, name, forumUrl, details, callback) {
		$.post("backend/createTournament.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				name: name,
				forumUrl: forumUrl,
				details: details
			},
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	createNewRound(loginToken, tournamentId, roundName, roundDetails, callback) {
		$.post("backend/createNewRound.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				tournamentId: tournamentId,
				roundName: roundName,
				roundDetails: roundDetails
			},
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	changeTournamentPlayerStatus(loginToken, tournamentId, usernameToChange, newTournamentPlayerStatusId, callback) {
		$.post("backend/tournamentManagementFunctions.php",
			{
				function: "changeTournamentPlayerStatus",
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				tournamentId: tournamentId,
				usernameToChange: usernameToChange,
				newTournamentPlayerStatusId: newTournamentPlayerStatusId
			},
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	changeTournamentStatus(loginToken, tournamentId, newTournamentStatusId, callback) {
		$.post("backend/tournamentManagementFunctions.php",
			{
				function: "changeTournamentStatus",
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				tournamentId: tournamentId,
				newTournamentStatusId: newTournamentStatusId
			},
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	createTournamentRoundMatch(loginToken, roundId, gameTypeId, hostUsername, guestUsername, options, isRanked, callback) {
		$.post("backend/createTournamentRoundMatch.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId,
				roundId: roundId,
				gameTypeId: gameTypeId,
				hostUsername: hostUsername,
				guestUsername: guestUsername,
				options: options,
				isRanked: isRanked
			},
			function(data, status) {
				OnlinePlayEngine.callCallback(data, status, callback);
			}
		);
	}
	/* Other */
	getActiveGamesCount(callback) {
		$.get("backend/getActiveGamesCount.php?",
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	get2020CompletedGameStats(loginToken, callback) {
		$.post("backend/get2020GameStatsForUser.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				} else {
					callFailed();
				}
			}
		);
	}
	getCompletedGameStats(loginToken, callback) {
		$.post("backend/getCompletedGameStatsForUser.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				} else {
					callFailed();
				}
			}
		);
	}
	getGameRankings(loginToken, callback) {
		$.post("backend/getPlayerGameRatings.php",
			{
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				} else {
					callFailed();
				}
			}
		);
	}
	/* Short Links */
	createShortLink(linkedInfo, loginToken, callback) {
		$.post("backend/createShortLink.php",
			{
				linkedInfo: linkedInfo,
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				} else {
					callFailed();
				}
			}
		);
	}
	getShortLinkInfo(slug, callback) {
		$.get("backend/getShortLinkInfo.php?slug=" + encodeURIComponent(slug),
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
	checkIfUserIsGameParticipant(gameId, loginToken, callback) {
		$.post("backend/userIsGameParticipant.php",
			{
				gameId: gameId,
				userId: loginToken.userId,
				username: loginToken.username,
				userEmail: loginToken.userEmail,
				deviceId: loginToken.deviceId
			},
			function(data, status) {
				if (status === 'success') {
					callback(data.trim());
				}
			}
		);
	}
}
