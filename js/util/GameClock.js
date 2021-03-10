
function GameClock() {}

/* Time Controls */
GameClock.Controls = function(secondsStart, increment) {
    this.secondsStart = secondsStart;
    this.increment = increment;
};

GameClock.Controls.prototype.getObject = function() {
    return {
        secondsStart: this.secondsStart,
        increment: this.increment
    }
};

/* Game Time Clock */
GameClock.Clock = function(controls, hostRemainingSeconds, guestRemainingSeconds) {
    this.controls = controls;
    this.hostRemainingSeconds = hostRemainingSeconds;
    this.guestRemainingSeconds = guestRemainingSeconds;
    if (this.hostRemainingSeconds == null) { // == handles undefined
        this.hostRemainingSeconds = this.controls.secondsStart;
    }
    if (this.guestRemainingSeconds == null) { // == handles undefined
        this.guestRemainingSeconds = this.controls.secondsStart;
    }
    this.currentTimer = null;
    this.currentTimerPlayer = null;
};

GameClock.Clock.prototype.startTimer = function(player, tickCallback) {
    this.currentTimerPlayer = player;
    this.currentTimer = new GameClock.Timer();
    var secondsLeft = player === HOST ? this.hostRemainingSeconds : this.guestRemainingSeconds;
    this.currentTimer.setSecondsRemaining(secondsLeft);
    tickCallback(this.hostRemainingSeconds, this.guestRemainingSeconds);
    if (this.hostRemainingSeconds >= 0 && this.guestRemainingSeconds >= 0) {
        var self = this;
        this.currentTimer.startCountdown(function(secondsRemaining) {
            if (player === HOST) {
                self.hostRemainingSeconds = secondsRemaining;
            } else {
                self.guestRemainingSeconds = secondsRemaining;
            }
            tickCallback(self.hostRemainingSeconds, self.guestRemainingSeconds);
        });
    }
};

GameClock.Clock.prototype.stopTimer = function() {
    if (this.currentTimer) {
        var secondsRemaining = this.currentTimer.stopTimer() 
        if (secondsRemaining > 0) {
            secondsRemaining += this.controls.increment;
        }
        if (this.currentTimerPlayer === HOST) {
            this.hostRemainingSeconds = secondsRemaining;
        } else {
            this.guestRemainingSeconds = secondsRemaining;
        }
    }
};

GameClock.Clock.prototype.updateSecondsRemaining = function() {
    if (this.currentTimer) {
        if (this.currentTimerPlayer === HOST) {
            this.hostRemainingSeconds = this.currentTimer.getSecondsRemaining();
        } else {
            this.guestRemainingSeconds = this.currentTimer.getSecondsRemaining();
        }
    }
};

GameClock.Clock.prototype.getJsonObject = function() {
    return {
        controls: this.controls,
        hostRemainingSeconds: this.hostRemainingSeconds,
        guestRemainingSeconds: this.guestRemainingSeconds
    }
};

GameClock.Clock.prototype.getJsonObjectString = function() {
    return JSON.stringify(this.getJsonObject());
};


/* Timer */
GameClock.Timer = function() {
    this.secondsRemaining = null;
    this.countdownTimeoutId = null;
};

GameClock.Timer.prototype.setSecondsRemaining = function(secondsRemaining) {
    this.secondsRemaining = secondsRemaining;
};

GameClock.Timer.prototype.getSecondsRemaining = function() {
    return this.secondsRemaining;
};

GameClock.Timer.prototype.startCountdown = function(tickCallback) {
    var self = this;
    debug("*tick* Seconds remaining: " + this.secondsRemaining);
    if (this.secondsRemaining > 0) {
        this.countdownTimeoutId = setTimeout(function() {
            self.tickTimer(1, tickCallback);
        }, 1000);
    }
};

GameClock.Timer.prototype.stopTimer = function() {
    clearTimeout(this.countdownTimeoutId);
    debug("Timer stopped. Seconds left: " + this.secondsRemaining);
    return this.secondsRemaining;
};

GameClock.Timer.prototype.tickTimer = function(secondsPassed, tickCallback) {
    this.secondsRemaining -= secondsPassed;
    if (this.secondsRemaining > 0) {
        this.startCountdown(tickCallback);
    } else {
        this.stopTimer();
        debug("Out of time!");
    }
    tickCallback(this.secondsRemaining);
};


GameClock.testTimer = function(seconds) {
    var timer = new GameClock.Timer();
    timer.setSecondsRemaining(seconds);
    timer.startCountdown();
};

GameClock.currentClock = null;

GameClock.timeControlsLabelValues = {
    none: "None",
    bullet: "Bullet 1m+5s",
    blitz: "Blitz 5m+15s",
    short: "Short 10m+30s",
    medium: "Medium 15m+30s",
    long: "Long 20m+45s"
};
GameClock.timeControlsList = {
    none: null,
    bullet: new GameClock.Controls(60, 5),
    blitz: new GameClock.Controls(300, 15),
    short: new GameClock.Controls(600, 30),
    medium: new GameClock.Controls(900, 30),
    long: new GameClock.Controls(1200, 45)
};

GameClock.decodeGameClock = function(gameClockJsonString) {
    try {
        gameClockObject = JSON.parse(htmlDecode(gameClockJsonString));
        return GameClock.buildGameClockInstance(gameClockObject);
    } catch (error) {
        debug("Error parsing time controls data");
    }
    return null;
};

GameClock.buildGameClockInstance = function(gameClockObject) {
    if (gameClockObject) {
        var gameClock = new GameClock.Clock(
            new GameClock.Controls(gameClockObject.controls.secondsStart, gameClockObject.controls.increment),
            gameClockObject.hostRemainingSeconds,
            gameClockObject.guestRemainingSeconds);
        return gameClock;
    }
};

GameClock.timeControlsDropdownId = "timeControlsDropdown";

GameClock.getTimeControlsDropdown = function() {
    return buildDropdownDiv(GameClock.timeControlsDropdownId, "Time Controls:", GameClock.timeControlsLabelValues,
		"none",
		function() {
            var timeControlsKey = this.value;
            if (timeControlsKey === "none") {
                GameClock.currentClock = null;
            } else {
                GameClock.currentClock = new GameClock.Clock(GameClock.timeControlsList[timeControlsKey]);
            }
		});
};

GameClock.loadGameClock = function(newClock) {
    if (GameClock.userHasGameClockAccess()) {
        if (newClock) {
            if (GameClock.currentClock) {
                GameClock.stopGameClock();
            }
            if (playingOnlineGame()) {
                GameClock.currentClock = newClock;
            }
        }
    }
};

GameClock.userHasGameClockAccess = function() {
    return usernameIsOneOf(
        [
            'SkudPaiSho',
            'Zach',
            'Dallin',
            'Pronetowander',
            'vitheguy'
        ]);
};

GameClock.startClock = function(player) {
    if (GameClock.userHasGameClockAccess()) {
        if (GameClock.currentClock) {
            GameClock.setGameClockText("Game Clock | Host: " + GameClock.formatSecondsToMinutes(GameClock.currentClock.hostRemainingSeconds)
                        + " vs Guest: " + GameClock.formatSecondsToMinutes(GameClock.currentClock.guestRemainingSeconds));
            if (!GameClock.aPlayerIsOutOfTime() && !gameController.theGame.getWinner()) {
                GameClock.currentClock.startTimer(player,
                    function(hostSecondsRemaining, guestSecondsRemaining) {
                        GameClock.setGameClockText("Game Clock | Host: " + GameClock.formatSecondsToMinutes(hostSecondsRemaining)
                            + " vs Guest: " + GameClock.formatSecondsToMinutes(guestSecondsRemaining));
                    }
                );
                GameClock.currentClock.isTicking = true;
            }
        }
    }
};

GameClock.clearCurrentClock = function() {
    GameClock.stopGameClock();
    GameClock.currentClock = null;
    GameClock.setGameClockText("");
};

GameClock.formatSecondsToMinutes = function(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
};

GameClock.stopGameClock = function() {
    if (GameClock.currentClock) {
        GameClock.currentClock.stopTimer();
        GameClock.currentClock.isTicking = false;
    }
};

GameClock.currentClockIsTicking = function() {
    return GameClock.currentClock && GameClock.currentClock.isTicking;
};

GameClock.currentClockIsOutOfTime = function() {
    return GameClock.currentClock && GameClock.currentClock.currentTimer.secondsRemaining <= 0;
};

GameClock.aPlayerIsOutOfTime = function() {
    return GameClock.currentClock 
        && (GameClock.currentClock.hostRemainingSeconds <= 0 || GameClock.currentClock.guestRemainingSeconds <= 0);
};

GameClock.getCurrentGameClockJsonString = function() {
    if (GameClock.currentClock) {
        return GameClock.currentClock.getJsonObjectString();
    }
    return null;
};

GameClock.setGameClockText = function(text) {
    if (GameClock.userHasGameClockAccess()) {
        var newText = '';
        if (text) {
            newText = text;
        }
        document.getElementById('gameClockContainer').innerText = newText;
    }
};
