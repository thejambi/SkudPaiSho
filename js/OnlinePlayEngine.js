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

OnlinePlayEngine.prototype.sendVerificationCode = function(userEmail) {
    $.post("sendVerificationCode.php",
        {
            toEmail: userEmail
        },
        function(data, status){
            if (status === 'success') {
                debug("Verification code sent.");
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

OnlinePlayEngine.prototype.createGame = function(gameNotationText, hostEmail, callback) {
    $.post("createGame.php",
        {
            q: gameNotationText,
            h: hostEmail
        },
        function(data, status){
            if (status === 'success') {
                // var element = document.getElementById("onlinePlayTest");
                // element.innerHTML = data;
                // debug(element.innerText.trim());
                // callback(element.innerText.trim());
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
                // var element = document.getElementById("onlinePlayTest");
                // element.innerHTML = data;
                // debug(element.innerText.trim());
                // callback(element.innerText.trim());
                debug(data.trim());
                callback(data.trim());
            }
        }
    );
};

OnlinePlayEngine.prototype.submitMove = function(gameId, gameNotationText, callback) {
    /*
    gameNotationText = encodeURIComponent(gameNotationText);
	debug("Submit move: " + gameId + " " + gameNotationText);
	if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var element = document.getElementById("onlinePlayTest");
            element.innerHTML = this.responseText;
            debug(element.innerText.trim());
            callback(element.innerText.trim());
        }
    };
    xmlhttp.open("GET","updateGameNotation.php?id="+gameId+"&t="+gameNotationText,true);
    xmlhttp.send();
    */

    $.post("updateGameNotation.php",
        {
            id: gameId,
            t: gameNotationText
        },
        function(data, status){
            if (status === 'success') {
                // var element = document.getElementById("onlinePlayTest");
                // element.innerHTML = data;
                // debug(element.innerText.trim());
                // callback(element.innerText.trim());
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
