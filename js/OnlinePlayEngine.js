/** OnlinePlayEngine */

function OnlinePlayEngine() {
	//
}

OnlinePlayEngine.prototype.testOnlinePlay = function() {
	debug("Is this working?");
	this.getGameTypeDesc(1);
	var self = this;
	setTimeout(function() { self.getGameTypeDesc(2); }, 500);
};

/* Calls callback with userId values that match username or emailAddress. */
OnlinePlayEngine.prototype.isUserInfoAvailable = function(username, emailAddress, callback) {
    $.get("isUserInfoAvailable.php?u=" + username + "&e=" + emailAddress, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.userInfoExists = function(username, emailAddress, callback) {
    $.get("userInfoExists.php?u=" + username + "&e=" + emailAddress, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
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
            if (status === 'success') {
                debug("Verification code sent.");
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

OnlinePlayEngine.prototype.createGame = function(gameNotationText, hostUserId, callback) {
    $.post("createGame.php",
        {
            q: gameNotationText,
            h: hostUserId
        },
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
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
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getGameSeeks = function(callback) {
    $.get("getGameSeeks.php", 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getCurrentGamesForUser = function(userId, callback) {
    $.get("getCurrentGamesForUser.php?userId="+userId, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getGameNotation = function(gameId, callback) {
    $.get("getGameNotation.php?q="+gameId, 
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.submitMove = function(gameId, gameNotationText, callback) {
    $.post("updateGameNotation.php",
        {
            id: gameId,
            t: gameNotationText
        },
        function(data, status){
            if (status === 'success') {
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.getGameTypeDesc = function(gameTypeId) {
    $.get("getGameTypeDesc.php?q="+gameTypeId, 
        function(data, status){
            if (status === 'success') {
                // var element = document.getElementById("onlinePlayTest");
                // element.innerHTML = data;
                // debug(element.innerText.trim());
                debug(data.trim());
            }
        }
    );
}
