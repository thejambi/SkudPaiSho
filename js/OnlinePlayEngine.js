/** OnlinePlayEngine */

function OnlinePlayEngine() {
	//
}

OnlinePlayEngine.prototype.testOnlinePlay = function() {
	this.getGameTypeDesc(1, emptyCallback);
};

OnlinePlayEngine.callCallback = function(data, status, callback) {
    if (status === 'success') {
        callback(data.trim());
    } else {
        callFailed();
    }
};

/* Calls callback with userId values that match username or emailAddress. */
OnlinePlayEngine.prototype.isUserInfoAvailable = function(username, emailAddress, callback) {
    $.get("isUserInfoAvailable.php?u=" + username + "&e=" + emailAddress, 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.userInfoExists = function(username, emailAddress, callback) {
    $.get("userInfoExists.php?u=" + username + "&e=" + emailAddress, 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.verifyLogin = function(userId, username, userEmail, deviceId, callback) {
    $.post("verifyLogin.php", 
        {
            userId: userId, 
            username: username, 
            userEmail: userEmail, 
            deviceId: deviceId
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.sendVerificationCode = function(username, userEmail, callback) {
    $.post("sendVerificationCode.php",
        {
            username: username,
            toEmail: userEmail,
            isWeb: 1
        },
        function(data, status){
            callback(data.trim());
        }
    );
};

OnlinePlayEngine.prototype.getVerificationCode = function(callback) {
    $.get("getVerificationCode.php", 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.createUser = function(username, emailAddress, callback) {
    $.post("createUser.php",
        {
            u: username,
            e: emailAddress
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.createDeviceIdForUser = function(userId, callback) {
    $.post("createDeviceIdForUser.php",
        {
            u: userId
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.logOnlineStatus = function(loginToken, callback) {
    $.post("logOnlineStatus.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.createGame = function(gameTypeId, gameNotationText, optionsString, isPrivateIndicator, loginToken, callback) {
    $.post("createGame.php",
        {
            t: gameTypeId, 
            q: gameNotationText,
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            options: optionsString,
            isPrivateIndicator: isPrivateIndicator,
            isWeb: 1
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.joinGameSeek = function(gameId, loginToken, callback) {
    $.post("joinGameSeek.php",
        {
            gameId: gameId,
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            isWeb: 1
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getGameSeeks = function(callback) {
    $.get("getGameSeeks.php", 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            } else {
                callFailed();
            }
        }
    );
};

OnlinePlayEngine.prototype.getCurrentGameSeeksHostedByUser = function(userId, gameTypeId, callback) {
    $.get("getCurrentGameSeeksHostedByUser.php?userId="+userId+"&gameTypeId="+gameTypeId, 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getCurrentGamesForUserNew = function(loginToken, callback) {
    $.post("getCurrentGamesForUserNew.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            } else {
                callFailed();
            }
        }
    );
};

OnlinePlayEngine.prototype.getPastGamesForUserNew = function(loginToken, callback) {
    $.post("getPastGamesForUserNew.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getPreviouslyActiveGameId = function(loginToken, gameId, opponentUsername, callback) {
    $.post("getPreviouslyActiveGameId.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId, 
            gameId: gameId, 
            opponentUsername: opponentUsername
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getGameInfo = function(userId, gameId, callback) {
    $.get("getGameInfo.php?userId="+userId+"&gameId="+gameId+"&isWeb=1", 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getCountOfGamesWhereUserTurn = function(userId, callback) {
    $.get("getCountOfGamesWhereUserTurn.php?userId="+userId, 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getGameNotation = function(gameId, callback) {
    $.get("getGameNotation.php?q="+gameId, 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.checkIfUserOnline = function(username, callback) {
    $.get("checkIfUserOnline.php?u="+username, 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.submitMove = function(gameId, gameNotationText, loginToken, gameTypeName, callback) {
    $.post("updateGameNotation.php",
        {
            id: gameId,
            t: gameNotationText,
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            gameTypeName: gameTypeName
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.updateGameWinInfo = function(gameId, winnerUsername, resultTypeCode, loginToken, callback) {
    $.post("updateGameWinInfo.php",
        {
            gameId: gameId,
            winnerUsername: winnerUsername,
            resultTypeCode: resultTypeCode, 
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId
        },
        function(data, status){
            if (status === 'success') {
                // debug('Game win info updated.');
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.updateGameWinInfoAsTie = function(gameId, resultTypeCode, loginToken, callback) {
    $.post("updateGameWinInfoAsTie.php",
        {
            gameId: gameId,
            resultTypeCode: resultTypeCode, 
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId
        },
        function(data, status){
            if (status === 'success') {
                // debug('Game win info updated.');
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getGameTypeDesc = function(gameTypeId, callback) {
    $.get("getGameTypeDesc.php?q="+gameTypeId, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
}

OnlinePlayEngine.prototype.sendChat = function(gameId, loginToken, chatMessage, callback) {
    $.post("sendChatMessage.php", 
        {
            gameId: gameId, 
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId, 
            chatMessage: chatMessage
        }, 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getNewChatMessages = function(gameId, lastChatTimestamp, callback) {
    $.get("getNewChatMessages.php?g="+gameId + "&t=" + encodeURIComponent(lastChatTimestamp), 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getInitialGlobalChatMessages = function(callback) {
    $.get("getInitialGlobalChatMessages.php?", 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.notifyUser = function(loginToken, userToNotify, callback) {
    $.post("notifyUser.php", 
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId, 
            userToNotify: userToNotify
        }, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getEmailNotificationsSetting = function(userId, callback) {
    $.get("getEmailNotificationsSetting.php?userId="+userId, 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

// TODO change to 'updatePreference' and pass in the preference type id
OnlinePlayEngine.prototype.updateEmailNotificationsSetting = function(userId, value, callback) {
    $.post("updateEmailNotificationsSetting.php", 
        {
            userId: userId, 
            value: value
        }, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.addUserPreferenceValue = function(loginToken, prefTypeId, value, callback) {
    $.post("addUserPreferenceValue.php", 
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId, 
            prefTypeId: prefTypeId, 
            value: value
        }, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

/* Tournaments */

OnlinePlayEngine.prototype.getCurrentTournaments = function(loginToken, callback) { 
    $.get("getCurrentTournaments.php?u="+loginToken.userId, 
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

OnlinePlayEngine.prototype.getTournamentInfo = function(tournamentId, callback) {
    $.get("getTournamentInfo.php?t="+tournamentId, 
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

OnlinePlayEngine.prototype.getManageTournamentsInfo = function(loginToken, callback) {
    $.post("getManageTournamentsInfo.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId
        },
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

OnlinePlayEngine.prototype.getManageTournamentInfo = function(loginToken, tournamentId, callback) {
    $.post("getManageTournamentInfo.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            tournamentId: tournamentId
        },
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

OnlinePlayEngine.prototype.submitTournamentSignup = function(loginToken, tournamentId, callback) {
    $.post("submitTournamentSignup.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            tournamentId: tournamentId
        },
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

OnlinePlayEngine.prototype.createTournament = function(loginToken, name, forumUrl, details, callback) {
    $.post("createTournament.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            name: name,
            forumUrl: forumUrl,
            details: details
        },
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

OnlinePlayEngine.prototype.createNewRound = function(loginToken, tournamentId, roundName, roundDetails, callback) {
    $.post("createNewRound.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            tournamentId: tournamentId,
            roundName: roundName,
            roundDetails: roundDetails
        },
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

OnlinePlayEngine.prototype.changeTournamentPlayerStatus = function(loginToken, tournamentId, usernameToChange, newTournamentPlayerStatusId, callback) {
    $.post("tournamentManagementFunctions.php",
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
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

OnlinePlayEngine.prototype.changeTournamentStatus = function(loginToken, tournamentId, newTournamentStatusId, callback) {
    $.post("tournamentManagementFunctions.php",
        {
            function: "changeTournamentStatus",
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            tournamentId: tournamentId,
            newTournamentStatusId: newTournamentStatusId
        },
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

OnlinePlayEngine.prototype.createTournamentRoundMatch = function(loginToken, roundId, gameTypeId, hostUsername, guestUsername, options, callback) {
    $.post("createTournamentRoundMatch.php",
        {
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            roundId: roundId,
            gameTypeId: gameTypeId,
            hostUsername: hostUsername,
            guestUsername: guestUsername,
            options: options
        },
        function(data, status){
            OnlinePlayEngine.callCallback(data, status, callback);
        }
    );
};

