# AI Opponent Interface Documentation

This document explains how to implement an AI opponent for a Pai Sho game variant and integrate it with the game controller.

## AI Class Interface

Every AI opponent must implement the following methods:

### Required Methods

#### `getName()`
Returns the display name of the AI.

```javascript
getName() {
    return "My Game Strategic AI";
}
```

#### `getMessage()`
Returns a description shown to the player about what the AI does and its difficulty level.

```javascript
getMessage() {
    return "This AI evaluates positions strategically. A challenging opponent!";
}
```

#### `setPlayer(playerName)`
Called by the system to tell the AI which player it controls (`HOST` or `GUEST`).

```javascript
setPlayer(playerName) {
    this.player = playerName;
}
```

#### `getMove(game, moveNum)`
The core AI method. Given the current game state and move number, returns a notation move object.

**Parameters:**
- `game` - A copy of the game state (GameManager instance with board, tiles, etc.)
- `moveNum` - The current move number in the game

**Returns:** A move object created by the game's NotationBuilder, or `null` if no move is available.

```javascript
getMove(game, moveNum) {
    // Get all possible moves
    var moves = this.getAllPossibleMoves(game, this.player);

    if (!moves || moves.length === 0) {
        return null;
    }

    // Select a move (randomly, strategically, etc.)
    return this.selectBestMove(moves, game);
}
```

## Example AI Implementations

### Random AI (Simplest)

```javascript
import { YourGameAiHelp } from './YourGameAiHelp';
import { removeRandomFromArray } from '../../GameData';

export function YourGameRandomAI() {
    this.aiHelp = new YourGameAiHelp();
}

YourGameRandomAI.prototype.getName = function() {
    return "Your Game Random AI";
};

YourGameRandomAI.prototype.getMessage = function() {
    return "Makes moves completely randomly.";
};

YourGameRandomAI.prototype.setPlayer = function(playerName) {
    this.player = playerName;
};

YourGameRandomAI.prototype.getMove = function(game, moveNum) {
    this.aiHelp.moveNum = moveNum;
    var moves = this.aiHelp.getAllPossibleMoves(game, this.player);
    return removeRandomFromArray(moves);
};
```

### Strategic AI (With Evaluation)

```javascript
export class YourGameStrategicAI {
    constructor() {
        this.aiHelp = new YourGameAiHelp();
        this.player = null;
    }

    getName() {
        return "Your Game Strategic AI";
    }

    getMessage() {
        return "A strategic AI that evaluates positions.";
    }

    setPlayer(playerName) {
        this.player = playerName;
    }

    getMove(game, moveNum) {
        this.aiHelp.moveNum = moveNum;
        var moves = this.aiHelp.getAllPossibleMoves(game, this.player);

        if (!moves || moves.length === 0) {
            return null;
        }

        var bestMove = null;
        var bestScore = -Infinity;

        for (var i = 0; i < moves.length; i++) {
            var move = moves[i];

            // Simulate the move
            var gameCopy = game.getCopy();
            gameCopy.runNotationMove(move);

            // Evaluate the resulting position
            var score = this.evaluatePosition(gameCopy);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove || moves[0];
    }

    evaluatePosition(game) {
        // Implement position evaluation logic
        return 0;
    }
}
```

## AI Helper Class Pattern

Most games use an "AiHelp" class to generate all possible moves. This class handles:

1. Getting deployment moves (placing tiles from the pile)
2. Getting movement moves (moving tiles on the board)

See `js/vagabond/ai/VagabondAiHelp.js` for a complete example.

Key methods:
- `getAllPossibleMoves(game, player)` - Returns all legal moves
- `getPossibleDeploymentMoves(game, player)` - Returns deployment moves
- `getPossibleMovementMoves(game, player)` - Returns movement moves

## Controller Integration

To add AI support to a game controller, implement these three methods:

### `getAiList()`

Returns an array of AI instances available for this game. Return an empty array if no AI is available.

```javascript
getAiList() {
    return [new YourGameRandomAI(), new YourGameStrategicAI()];
}
```

### `playAiTurn(finalizeMove)`

Called when it's the AI's turn to make a move.

```javascript
playAiTurn(finalizeMove) {
    if (this.theGame.getWinner()) {
        return;
    }

    var theAi = activeAi;
    if (activeAi2) {
        if (activeAi2.player === getCurrentPlayer()) {
            theAi = activeAi2;
        }
    }

    var playerMoveNum = this.gameNotation.getPlayerMoveNum();
    var self = this;

    setTimeout(function() {
        var move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);
        if (!move) {
            return;
        }
        self.gameNotation.addMove(move);
        finalizeMove();
    }, 10);
}
```

### `startAiGame(finalizeMove)`

Called when starting a game with an AI opponent. Usually just calls `playAiTurn`.

```javascript
startAiGame(finalizeMove) {
    this.playAiTurn(finalizeMove);
}
```

### `readyToShowPlayAgainstAiOption()` (Optional)

Controls when the "Play against AI" button appears in the UI. By default, PaiShoMain shows the AI option after the first move (`currentMoveIndex == 1`). If your game has a custom setup phase or different requirements, implement this method to override that behavior.

**Default behavior (if not implemented):**
```javascript
// AI option shown when currentMoveIndex == 1
```

**Custom implementation examples:**

For games with a setup phase that must complete first (like Tumbleweed):
```javascript
readyToShowPlayAgainstAiOption() {
    return this.gameNotation.moves.length === TumbleweedController.getGameSetupCompleteMoveNumber();
}
```

For games where all tiles start on the board (like Nick Pai Sho):
```javascript
readyToShowPlayAgainstAiOption() {
    // Nick Pai Sho starts with all tiles on the board, so show AI option right away after setup
    return this.gameNotation.moves.length >= 1
        && this.gameNotation.moves[0].moveType === SETUP;
}
```

**How PaiShoMain uses it:**
```javascript
if ((
    (!gameController.readyToShowPlayAgainstAiOption && currentMoveIndex == 1)
    || (gameController.readyToShowPlayAgainstAiOption && gameController.readyToShowPlayAgainstAiOption())
) && !haveBothEmails()) {
    // Show AI options...
}
```

If the method exists on the controller, it's called; otherwise the default `currentMoveIndex == 1` check is used.

## How PaiShoMain Uses the AI

The main game system (`js/PaiShoMain.js`) manages AI opponents through:

### Global Variables
- `activeAi` - The first AI player (if any)
- `activeAi2` - The second AI player (for AI vs AI games)

### Key Functions

**`setAiIndex(i)`** - Activates an AI from the controller's `getAiList()`:
```javascript
const aiList = gameController.getAiList();
activeAi = aiList[i];
activeAi.setPlayer(getCurrentPlayer());
gameController.startAiGame(finalizeMove);
```

**`playAiTurn()`** - Called after each move to trigger AI if it's their turn:
```javascript
if ((activeAi && getCurrentPlayer() === activeAi.player) ||
    (activeAi2 && getCurrentPlayer() === activeAi2.player)) {
    gameController.playAiTurn(finalizeMove);
}
```

## File Organization

Recommended file structure:
```
js/
  your-game/
    YourGameController.js    # Contains getAiList, playAiTurn, startAiGame
    ai/
      YourGameAiHelp.js      # Move generation utilities
      YourGameRandomAI.js    # Simple random AI
      YourGameStrategicAI.js # Smarter evaluation-based AI
```

## Imports Required

Typical imports for an AI class:

```javascript
import { DEPLOY, GUEST, HOST, MOVE } from '../../CommonNotationObjects';
import { YourGameNotationBuilder } from '../YourGameGameNotation';
import { YourGameAiHelp } from './YourGameAiHelp';
```

For the controller:

```javascript
import { activeAi, activeAi2, getCurrentPlayer, finalizeMove } from '../PaiShoMain';
import { YourGameRandomAI } from './ai/YourGameRandomAI';
import { YourGameStrategicAI } from './ai/YourGameStrategicAI';
```

## Summary Checklist

To add AI to a game:

1. **Create AI Helper class** (`YourGameAiHelp.js`)
   - Implement `getAllPossibleMoves(game, player)`

2. **Create AI class(es)** (`YourGameRandomAI.js`, etc.)
   - Implement `getName()`
   - Implement `getMessage()`
   - Implement `setPlayer(playerName)`
   - Implement `getMove(game, moveNum)`

3. **Update Controller** (`YourGameController.js`)
   - Import AI classes
   - Implement `getAiList()` returning array of AI instances
   - Implement `playAiTurn(finalizeMove)`
   - Implement `startAiGame(finalizeMove)`
   - Optionally implement `readyToShowPlayAgainstAiOption()` if your game has a setup phase

4. **Ensure game has `getCopy()` method**
   - The GameManager must support `getCopy()` for AI to simulate moves
