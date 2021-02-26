/* Code from or based on https://github.com/moroshko/elo.js */

window.Elo = (function() {
    function getRatingDelta(myRating, opponentRating, myGameResult) {
        if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
            return null;
        }

        var myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));

        return Math.round(32 * (myGameResult - myChanceToWin));
    }

    function getNewRating(myRating, opponentRating, myGameResult) {
        return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
    }

    function getNewPlayerRatings(hostRating, guestRating, hostResult) {
        var hostDelta = getRatingDelta(hostRating, guestRating, hostResult);
        return {
            hostRating: hostRating + hostDelta,
            guestRating: guestRating - hostDelta
        };
    }

    return {
        // getRatingDelta: getRatingDelta,
        // getNewRating: getNewRating,
        getNewPlayerRatings: getNewPlayerRatings
    };
})();
