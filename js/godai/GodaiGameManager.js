import { DEPLOY, MOVE } from "../CommonNotationObjects.js"
import { debug } from "../GameData.js"
import { gameOptionEnabled, GODAI_BOARD_ZONES } from "../GameOptions.js"
import { PaiShoMarkingManager } from "../pai-sho-common/PaiShoMarkingManager.js"
import { setGameLogText } from "../GameState.js"
import { GodaiActuator } from "./GodaiActuator.js"
import { GodaiBoard } from "./GodaiBoard.js"
import { GodaiNotationMove } from "./GodaiNotation.js"
import { GodaiBoardPoint } from "./GodaiBoardPoint.js"
import { GodaiTileManager } from "./GodaiTileManager.js"

export class GodaiGameManager {

    /** @type {string} */
    gameLogText

    /** @type {boolean} */
    isCopy

    /** @type {GodaiActuator} */
    actuator

    /** @type {GodaiTileManager} */
    tileManager

    /** @type {GodaiBoard} */
    board

    /** @type {GodaiTileManager} */
    tileManager

    /** @type {PaiShoMarkingManager} */
    markingManager

    /** @type {string} */
    lastPlayerName

    constructor( actuator, ignoreActuate, isCopy ) {
        this.gameLogText = ''
        this.isCopy = isCopy
        this.actuator = actuator

        this.tileManager = new GodaiTileManager()
        this.markingManager = new PaiShoMarkingManager()

        this.setup(ignoreActuate)
    }

    /** Set up the game */
    setup(ignoreActuate) {
        this.board = new GodaiBoard()

        if (!ignoreActuate) {
            this.actuate()
        }
    }

    /**
     * @param {*} moveToAnimate 
     */
    actuate(moveToAnimate) {
        if (this.isCopy) return

        this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate)
        setGameLogText(this.gameLogText)
    }

    /**
     * 
     * @param {GodaiBoardPoint} boardPoint 
     * @param {boolean} ignoreActuate 
     */
    revealPossibleMovePoints(boardPoint, ignoreActuate) {
        if (!boardPoint.hasTile()) return

        this.board.setPossibleMovePoints(boardPoint)

        if (!ignoreActuate) {
            this.actuate()
        }
    }

    revealDeployPoints(player, tileCode, ignoreActuate) {
        this.board.setDeployPointsPossibleMoves(player, tileCode)

        if (!ignoreActuate) {
            this.actuate()
        }
    }

    hidePossibleMovePoints(ignoreActuate) {
        this.board.removePossibleMovePoints()
        this.tileManager.removeSelectedTileFlags()
        if (!ignoreActuate) {
            this.actuate()
        }
    }

    cleanup() {
    }

    /**
     * 
     * @param {GodaiNotationMove} move Move to play
     */
    runNotationMove(move, withActuate) {
        debug("From WuxingGameManager.js")
        debug("Running Move: " + move.fullMoveText + " Move type: " + move.moveType);

        if (move.moveType == MOVE) {
            let moveResults = this.board.moveTile(move.playerCode, move.startPoint, move.endPoint)

            // Did we capture a tile?
            if (moveResults && moveResults.capturedTile) {
                let capturedTile = moveResults.capturedTile
                this.tileManager.addToCapturedTiles( capturedTile, move.playerCode )
                this.board.checkForEndGame(this.tileManager)
            }

            if (moveResults && moveResults.movedTile) {
                let movedTile = moveResults.movedTile
                movedTile.gotMoved = true
            }

        }
        else if (move.moveType == DEPLOY) {
            let tile = this.tileManager.grabTile(move.playerCode, move.tileType)
            this.board.placeTile(tile, move.endPoint)
        }

        // River logic
        if (gameOptionEnabled(GODAI_BOARD_ZONES)) {
            this.board.updateRiverMoves(this.tileManager)
            this.board.checkForEndGame(this.tileManager) // In case a river crash happens
        }

        // None are moved now
        this.board.getTilesOnBoard().forEach( tile => tile.gotMoved = false )

        if (withActuate) {
            this.actuate()
        }

        this.lastPlayerName = move.playerCode
    }

    hasEnded() {
        return this.board.winners.length > 0
    }

    getWinner() {
        if (this.board.winners.length === 1) {
            return this.board.winners[0];
        } else if (this.board.winners.length > 1) {
            return "BOTH players";
        }
    }

    getWinReason() {
        return this.board.winnerReason
    }
}