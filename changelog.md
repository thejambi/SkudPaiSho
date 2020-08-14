#8/11/2020:
 - **main.css**:
   - Added relative position and transitions for `.point img`
 - **Brain**:
   - Tried to figure out how this code works
   - Tried to think of ways to do stuff

#8/12/2020
 - **PaiShoMain.js**:
   - `playAllMoves` now calls the final `playNextMove` with `withActuate = true`, instead of using `gameController.callActuate();`
   - Changed `replayIntervalLength` to `2100`, since the piece animations can now take up to two seconds(one for arranging, one for accent tile movement).
   - Added `pieceAnimationLength`.
   - Added `piecePlaceAnimation`(See comments for more info).
 - **ActuatorHelp.js**:
   - Added `isSamePoint`
 - **SkudPaiShoGameManager.js**:
   - Passes `moveToAnimate` to the actuator
   - `hidePossibleMovePoints` can now take a `moveToAnimate` parameter and pass it on to `actuate`
 - **SkudPaiShoController.js**:
   - Now passes `move` to `theGame.hidePossibleMovePoints`, allowing it to be actuated. This is important for moves that result in harmony and don't get finalized immediately.
 - **SkudPaiShoActuator.js**:
   - Added animations(See Animations section)
   - `htmlify` adds `isOrchidMove` flag for animating "drainage"
 - **main.css**:
   - Added fix for antialiasing errors: https://stackoverflow.com/questions/6492027/css-transform-jagged-edges-in-chrome
 - **GameData.js**:
   - Added `debugStackTrace`.

#8/13/2020
 - **SkudPaiShoActuator.js**
   - Created `flags` object to pass into `doAnimateBoardPoint`
   - Delayed harmony outline until after a piece has finished moving

#Issues
**Known Issues**
 - When you create harmony on a move, then finish the move by using or skipping your bonus, it reanimates the entire move. I haven't found a good way to get around this since `finalizeMove` gets called, which replays all moves
 - I haven't done the Ancient Oasis stuff I don't even know how those tiles work yet
 - Harmony bonuses have no animation, and I don't know how the actuator will be able to know which harmony bonuses are new and which aren't.

#Animations
**How I did the animations**
A `moveToAnimate` is passed to the actuator. This is a `SkudPaiShoNotationMove`, the same one passed into `SkudPaiShoGameManager.runNotationMove`.
As the actuator loops over all of the cells, if a cell with a tile in it is found to be the _endpoint_ of a placement or arrangement(determined using the `moveToAnimate`), then that tile's image is sent back to the _startpoint_(or stays where it is, if its a placement) and is animated into place with CSS transitions.
**Flaws**
I didn't like doing it this way, but I didn't want to change much of the code that was already there and this was the least-intrusive way. I would have preferred to save board states and interpolate between them, but this was difficult on account of the board being destroyed and remade(including all of the tiles) every time the game is actuated, and whenever a move is played the board is cleared and all moves are rerun.

The biggest issue is there may be a gamemode or expansion where the final board state and the last move aren't enough to determine where tiles came from, in which case a new method would have to be found.
