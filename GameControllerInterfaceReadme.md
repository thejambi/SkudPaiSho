# Adding A Game - The GameController Interface

---

Incomplete / Under Construction

---

A *Game Controller* contains the game logic, necessary UI interaction handling, and renders everything needed for the game within the provided div element. 

There is a required interface for the main GameController object, and the GameNotation object.

## Starting

* Create a new directory under `js` directory
* Create a GameController javascript class/object. 
* Implement the following methods

## Constructor
Constructor takes two parameters:
* gameContainer
	* This is the div element that your game needs to be put in
* isMobile
	* Boolean flag for if running on mobile device

Example:

```
function CheckersController(gameContainer, isMobile) {
	....
}
```

## getGameTypeId
Returns the GameType id for your game. Add your game to GameType in PaiShoMain.js. 

Example:
```
CheckersController.prototype.getGameTypeId = function() {
	return GameType.Checkers.id;
};
```

## resetGameManager
Called when rewinding moves.

## resetNotationBuilder
Called when rewinding moves. 

## getNewGameNotation
Returns new game notation object for your game. 

### GameNotation interface
* moves
	* Variable: Array of moves
* addMove(move)
	* Add given move to `moves`
* notationTextForUrl()
	* Return notation text as single line string

## callActuate
Called when the game should re-render. 

## resetMove
Called when the user's move needs to be reset, from clicking the Undo Move link. 

## getDefaultHelpMessageText
Should return the default string of the html content to put in the Help tab. 

