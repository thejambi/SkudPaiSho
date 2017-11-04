function DummyAppCaller() {
	//
}

DummyAppCaller.prototype.setCountOfGamesWhereUserTurn = function(count) {
	//
};

DummyAppCaller.prototype.alertAppLoaded = function() {
	//
};

/* ------------------------------------------------------------------------ */

function IOSCaller() {
	// 
}

IOSCaller.prototype.setCountOfGamesWhereUserTurn = function(count) {
	webkit.messageHandlers.callbackHandler.postMessage(
		'{"countOfGamesWhereUserTurn":"' + count + '"}'
	);
};

IOSCaller.prototype.alertAppLoaded = function() {
	webkit.messageHandlers.callbackHandler.postMessage(
		'{"appLoaded":"true"}'
	);
};

/* ------------------------------------------------------------------------ */
