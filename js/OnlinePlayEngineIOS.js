/** OnlinePlayEngineIOS */

function OnlinePlayEngineIOS() {
	//
}

OnlinePlayEngineIOS.prototype.getCallbackName = function(callback) {
    var callbackName = callback.name;
    if (!callbackName) {
        callbackName = callback.toString().match(/^function\s*([^\s(]+)/)[1];
    }
    return callbackName;
};

OnlinePlayEngineIOS.prototype.swiftPost = function(postUrl, postData, callback) {
    debug("Attempting Swift Post");

    var callbackName = this.getCallbackName(callback);

    try {
        webkit.messageHandlers.callbackHandler.postMessage(
            '{"postUrl":"' + postUrl + '","postData":"' + postData + '","callbackName":"' + callbackName + '"}'
        );
    } catch(err) {
        console.log('error');
    }
};

OnlinePlayEngineIOS.prototype.swiftGet = function(getUrl, callback) {
    debug("Attempting Swift Get");
    try {
        webkit.messageHandlers.callbackHandler.postMessage(
            '{"getUrl":"' + getUrl + '","callbackName":"' + callback.name + '"}'
        );
    } catch(err) {
        console.log('error');
    }
};

OnlinePlayEngineIOS.prototype.testOnlinePlay = function(callback) {
	this.getGameTypeDesc(1, callback);
};

/* Calls callback with userId values that match username or emailAddress. */
OnlinePlayEngineIOS.prototype.isUserInfoAvailable = function(username, emailAddress, callback) {
    this.swiftGet("isUserInfoAvailable.php?u=" + username + "&e=" + emailAddress, callback);
};

OnlinePlayEngineIOS.prototype.userInfoExists = function(username, emailAddress, callback) {
    this.swiftGet("userInfoExists.php?u=" + username + "&e=" + emailAddress, callback);
};

OnlinePlayEngineIOS.prototype.verifyLogin = function(userId, username, userEmail, deviceId, callback) {
    this.swiftPost("verifyLogin.php", 
        "userId="+userId+"&username="+username+"&userEmail="+userEmail+"&deviceId="+deviceId, 
        callback);
};

OnlinePlayEngineIOS.prototype.sendVerificationCode = function(username, userEmail, callback) {
    this.swiftPost("sendVerificationCode.php", "username="+username+"&toEmail="+userEmail, callback);
};

OnlinePlayEngineIOS.prototype.getVerificationCode = function(callback) {
    this.swiftGet("getVerificationCode.php", callback);
};

OnlinePlayEngineIOS.prototype.createUser = function(username, emailAddress, callback) {
    this.swiftPost("createUser.php", "u="+username+"&e="+emailAddress, callback);
};

OnlinePlayEngineIOS.prototype.createDeviceIdForUser = function(userId, callback) {
    this.swiftPost("createDeviceIdForUser.php", "u="+userId, callback);
};

OnlinePlayEngineIOS.prototype.logOnlineStatus = function(loginToken, callback) {
    this.swiftPost("logOnlineStatus.php", 
        "userId=" + loginToken.userId
        + "&username=" + loginToken.username
        + "&userEmail=" + loginToken.userEmail
        + "&deviceId=" + loginToken.deviceId, 
        callback);
};

OnlinePlayEngineIOS.prototype.createGame = function(gameTypeId, gameNotationText, loginToken, callback) {
    this.swiftPost("createGame.php", 
        "t=" + gameTypeId
        + "&q=" + gameNotationText
        + "&userId=" + loginToken.userId
        + "&username=" + loginToken.username
        + "&userEmail=" + loginToken.userEmail
        + "&deviceId=" + loginToken.deviceId, 
        callback);
};

OnlinePlayEngineIOS.prototype.joinGameSeek = function(gameId, loginToken, callback) {
    this.swiftPost("joinGameSeek.php",
        "gameId=" + gameId
        + "&userId=" + loginToken.userId
        + "&username=" + loginToken.username
        + "&userEmail=" + loginToken.userEmail
        + "&deviceId=" + loginToken.deviceId,
        callback);
};

OnlinePlayEngineIOS.prototype.getGameSeeks = function(callback) {
    this.swiftGet("getGameSeeks.php", callback);
};

OnlinePlayEngineIOS.prototype.getCurrentGameSeeksHostedByUser = function(userId, gameTypeId, callback) {
    this.swiftGet("getCurrentGameSeeksHostedByUser.php?userId="+userId+"&gameTypeId="+gameTypeId, 
        callback);
};

OnlinePlayEngineIOS.prototype.getCurrentGamesForUserNew = function(loginToken, callback) {
    this.swiftPost("getCurrentGamesForUserNew.php",
        "userId=" + loginToken.userId
        + "&username=" + loginToken.username
        + "&userEmail=" + loginToken.userEmail
        + "&deviceId=" + loginToken.deviceId,
        callback);
};

OnlinePlayEngineIOS.prototype.getPastGamesForUserNew = function(loginToken, callback) {
    this.swiftPost("getPastGamesForUserNew.php",
        "userId=" + loginToken.userId
        + "&username=" + loginToken.username
        + "&userEmail=" + loginToken.userEmail
        + "&deviceId=" + loginToken.deviceId,
        callback);
}

OnlinePlayEngineIOS.prototype.getGameInfo = function(userId, gameId, callback) {
    this.swiftGet("getGameInfo.php?userId="+userId+"&gameId="+gameId, callback);
};

OnlinePlayEngineIOS.prototype.getCountOfGamesWhereUserTurn = function(userId, callback) {
    this.swiftGet("getCountOfGamesWhereUserTurn.php?userId="+userId, callback);
};

OnlinePlayEngineIOS.prototype.getGameNotation = function(gameId, callback) {
    this.swiftGet("getGameNotation.php?q="+gameId, callback);
};

OnlinePlayEngineIOS.prototype.checkIfUserOnline = function(username, callback) {
    this.swiftGet("checkIfUserOnline.php?u="+username, callback);
};

OnlinePlayEngineIOS.prototype.submitMove = function(gameId, gameNotationText, loginToken, callback) {
    this.swiftPost("updateGameNotation.php",
        "id=" + gameId
        + "&t=" + gameNotationText
        + "&userId=" + loginToken.userId
        + "&username=" + loginToken.username
        + "&userEmail=" + loginToken.userEmail
        + "&deviceId=" + loginToken.deviceId,
        callback);
};

OnlinePlayEngineIOS.prototype.updateGameWinInfo = function(gameId, winnerUsername, resultTypeCode, loginToken, callback) {
    this.swiftPost("updateGameWinInfo.php",
        "gameId=" + gameId
        + "&winnerUsername=" + winnerUsername
        + "&resultTypeCode=" + resultTypeCode
        + "&userId=" + loginToken.userId
        + "&username=" + loginToken.username
        + "&userEmail=" + loginToken.userEmail
        + "&deviceId=" + loginToken.deviceId,
        callback);
};

OnlinePlayEngineIOS.prototype.updateGameWinInfoAsTie = function(gameId, resultTypeCode, loginToken, callback) {
    this.swiftPost("updateGameWinInfoAsTie.php",
        "gameId=" + gameId
        + "&resultTypeCode=" + resultTypeCode
        + "&userId=" + loginToken.userId
        + "&username=" + loginToken.username
        + "&userEmail=" + loginToken.userEmail
        + "&deviceId=" + loginToken.deviceId,
        callback);
};

OnlinePlayEngineIOS.prototype.getGameTypeDesc = function(gameTypeId, callback) {
    this.swiftGet("getGameTypeDesc.php?q="+gameTypeId, callback);
}

OnlinePlayEngineIOS.prototype.sendChat = function(gameId, loginToken, chatMessage, callback) {
    this.swiftPost("sendChatMessage.php", 
        "gameId=" + gameId
        + "&userId=" + loginToken.userId
        + "&username=" + loginToken.username
        + "&userEmail=" + loginToken.userEmail
        + "&deviceId=" + loginToken.deviceId
        + "&chatMessage=" + chatMessage,
        callback);
};

OnlinePlayEngineIOS.prototype.getNewChatMessages = function(gameId, lastChatTimestamp, callback) {
    this.swiftGet("getNewChatMessages.php?g="+gameId + "&t=" + encodeURIComponent(lastChatTimestamp), 
        callback);
};

OnlinePlayEngineIOS.prototype.getInitialGlobalChatMessages = function(callback) {
    this.swiftGet("getInitialGlobalChatMessages.php?", callback);
};

OnlinePlayEngineIOS.prototype.notifyUser = function(username, callback) {
    this.swiftPost("notifyUser.php", "username=" + username, callback);
};

OnlinePlayEngineIOS.prototype.getEmailNotificationsSetting = function(userId, callback) {
    this.swiftGet("getEmailNotificationsSetting.php?userId="+userId, callback);
};

// TODO change to 'updatePreference' and pass in the preference type id
// TODO add loginToken
OnlinePlayEngineIOS.prototype.updateEmailNotificationsSetting = function(userId, value, callback) {
    this.swiftPost("updateEmailNotificationsSetting.php", 
        "userId=" + userId
        + "&value=" + value,
        callback);
};

