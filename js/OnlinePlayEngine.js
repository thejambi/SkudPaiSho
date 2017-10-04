/** OnlinePlayEngine */

function OnlinePlayEngine() {
	//
}

OnlinePlayEngine.prototype.testOnlinePlay = function() {
	this.getGameTypeDesc(1);
	// var self = this;
	// setTimeout(function() { self.getGameTypeDesc(2); }, 500);
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
                callback(data.trim() === "Results exist");
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
            if (status === 'success') {
                callback("Verification code sent to " + userEmail);
            } else {
                callback("Failed to send verification code, please try again.");
            }
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

OnlinePlayEngine.prototype.logOnlineStatus = function(userId, deviceId) {
    $.post("logOnlineStatus.php",
        {
            u: userId, 
            d: deviceId
        },
        function(data, status){
            if (status === 'success') {
                //
            }
        }
    );
};

OnlinePlayEngine.prototype.createGame = function(gameTypeId, gameNotationText, hostUserId, callback) {
    $.post("createGame.php",
        {
            t: gameTypeId, 
            q: gameNotationText,
            h: hostUserId
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.joinGameSeek = function(gameId, guestUserId, callback) {
    $.post("joinGameSeek.php",
        {
            gameId: gameId,
            guestUserId: guestUserId
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

OnlinePlayEngine.prototype.getCurrentGamesForUser = function(userId, callback) {
    $.get("getCurrentGamesForUser.php?userId="+userId, 
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getPastGamesForUser = function(userId, callback) {
    $.get("getPastGamesForUser.php?userId="+userId, 
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

OnlinePlayEngine.prototype.submitMove = function(gameId, gameNotationText, userId, callback) {
    $.post("updateGameNotation.php",
        {
            id: gameId,
            t: gameNotationText,
            userId: userId
        },
        function(data, status){
            if (status === 'success') {
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.updateGameWinInfo = function(gameId, winnerUsername, resultTypeCode) {
    $.post("updateGameWinInfo.php",
        {
            gameId: gameId,
            winnerUsername: winnerUsername,
            resultTypeCode: resultTypeCode
        },
        function(data, status){
            if (status === 'success') {
                // debug('Game win info updated.');
            }
        }
    );
};

OnlinePlayEngine.prototype.updateGameWinInfoAsTie = function(gameId, resultTypeCode) {
    $.post("updateGameWinInfoAsTie.php",
        {
            gameId: gameId,
            resultTypeCode: resultTypeCode
        },
        function(data, status){
            if (status === 'success') {
                // debug('Game win info updated.');
            }
        }
    );
};

OnlinePlayEngine.prototype.getGameTypeDesc = function(gameTypeId) {
    $.get("getGameTypeDesc.php?q="+gameTypeId, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
            }
        }
    );
}

OnlinePlayEngine.prototype.sendChat = function(gameId, userId, chatMessage, callback) {
    $.post("sendChatMessage.php", 
        {
            gameId: gameId, 
            senderId: userId, 
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

OnlinePlayEngine.prototype.notifyUser = function(username) {
    $.post("notifyUser.php", 
        {
            username: username
        }, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
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
OnlinePlayEngine.prototype.updateEmailNotificationsSetting = function(userId, value) {
    $.post("updateEmailNotificationsSetting.php", 
        {
            userId: userId, 
            value: value
        }, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
            }
        }
    );
};

