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

OnlinePlayEngine.prototype.createGame = function(gameNotationText, callback) {
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
    xmlhttp.open("GET","createGame.php?q="+gameNotationText,true);
    xmlhttp.send();
};

OnlinePlayEngine.prototype.getGameNotation = function(gameId, callback) {
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
    xmlhttp.open("GET","getGameNotation.php?q="+gameId,true);
    xmlhttp.send();
};

OnlinePlayEngine.prototype.submitMove = function(gameId, gameNotationText, callback) {
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
};

OnlinePlayEngine.prototype.getGameTypeDesc = function(gameTypeId) {
	if (gameTypeId <= 0) {
        document.getElementById("onlinePlayTest").innerHTML = "";
        return;
    } else {
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
            }
        };
        xmlhttp.open("GET","getGameTypeDesc.php?q="+gameTypeId,true);
        xmlhttp.send();
    }
}


/* Example */
function showUser(str) {
    if (str == "") {
        document.getElementById("txtHint").innerHTML = "";
        return;
    } else { 
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("txtHint").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","getuser.php?q="+str,true);
        xmlhttp.send();
    }
}

