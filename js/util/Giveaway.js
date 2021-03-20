
function Giveaway() {}

Giveaway.doIt = function() {
    var textBox = document.getElementById('giveawayNamesTextbox');
    var list = textBox.value.split('\n');
    
    shuffleArray(list);
    debug(list);

    var resultsDiv = document.getElementById('giveawayResults');

    var timer = new GameClock.Timer();
    timer.setSecondsRemaining(5);
    resultsDiv.innerText = 5 + "...";
    
    timer.outOfTimeCallback = function() {
        var winnerName = peekRandomFromArray(list);
        resultsDiv.innerHTML = "The winner is: <strong>" + winnerName + "</strong> !!!";
    };

    timer.startCountdown(function(secondsRemaining) {
        if (secondsRemaining > 0) {
            resultsDiv.innerText = secondsRemaining + "...";
        }
    });

};

