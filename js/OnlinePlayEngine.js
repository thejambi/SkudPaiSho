/** OnlinePlayEngine */

function OnlinePlayEngine() {
	//
}

OnlinePlayEngine.prototype.testOnlinePlay = function() {
	this.getGameTypeDesc(1, emptyCallback);
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
            toEmail: userEmail
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

OnlinePlayEngine.prototype.createGame = function(gameTypeId, gameNotationText, optionsString, loginToken, callback) {
    $.post("createGame.php",
        {
            t: gameTypeId, 
            q: gameNotationText,
            userId: loginToken.userId,
            username: loginToken.username,
            userEmail: loginToken.userEmail, 
            deviceId: loginToken.deviceId,
            options: optionsString
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
            deviceId: loginToken.deviceId
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
    $.get("getGameInfo.php?userId="+userId+"&gameId="+gameId, 
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

OnlinePlayEngine.prototype.submitMove = function(gameId, gameNotationText, loginToken, callback) {
    $.post("updateGameNotation.php",
        {
            id: gameId,
            t: gameNotationText,
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

