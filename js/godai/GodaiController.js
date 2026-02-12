/* Godai Pai Sho */

import { DEPLOY, GUEST, HOST, MOVE, NotationPoint } from "../CommonNotationObjects.js";
import { debug } from "../GameData.js";
import { BRAND_NEW, READY_FOR_BONUS, WAITING_FOR_ENDPOINT } from '../GameConstants';
import { callSubmitMove, createGameIfThatIsOk, finalizeMove, GameType, getGameOptionsMessageElement, isAnimationsOn, rerunAll } from "../PaiShoMain.js";
import { currentMoveIndex, gameId, isInReplay, myTurn, onlinePlayEnabled, playingOnlineGame } from "../GameState";
import { userIsLoggedIn } from "../UserData.js";
import { toBullets } from '../TextHelpers';
import { GATE, NEUTRAL, POSSIBLE_MOVE } from "../skud-pai-sho/SkudPaiShoBoardPoint.js";
import { GodaiActuator } from "./GodaiActuator.js";
import { GodaiGameManager } from "./GodaiGameManager.js";
import { GodaiGameNotation, GodaiNotationBuilder } from "./GodaiNotation.js";
import { BLACK_GATE, GREEN_GATE, MOUNTAIN_ENTRANCE, MOUNTAIN_TILE, RED_GATE, RIVER_DL_TILE, RIVER_DR_TILE, RIVER_TILE, WHITE_GATE, GodaiBoardPoint, YELLOW_GATE, RIVER_MOUTH } from "./GodaiBoardPoint.js";
import { GO_EARTH, GO_EMPTY, GO_FIRE, GO_METAL, GO_WATER, GO_WOOD, GodaiTile } from "./GodaiTile.js";
import { RED, WHITE } from "../skud-pai-sho/SkudPaiShoTile.js";
import { gameOptionEnabled, GODAI_BOARD_ZONES } from "../GameOptions.js";

export var GodaiPreferences = {
    tileDesignKey: "TileDesigns",
    tileDesignTypeValues: {
        original: "Original"
    }
}

export class GodaiController {

    /** @type {GodaiActuator} */
    actuator

    /** @type {GodaiGameManager} */
    theGame

    /** @type {GodaiNotationBuilder} */
    notationBuilder

    /** @type {GodaiGameNotation} */
    gameNotation

    isPaiShoGame = true

    /**
     * Used for remembering the BoardPoint which the player clicked on
     * @type {GodaiBoardPoint | null}
     */
    mouseStartPoint

    /**
     * NOTE: The parameter's documentation was taken from GameControllerInterfaceReadme.md
     * @param {HTMLDivElement} gameContainer This is the div element that your game needs to be put in
     * @param {boolean} isMobile Boolean flag for if running on mobile device
     */
    constructor(gameContainer, isMobile) {
        this.actuator = new GodaiActuator(gameContainer, isMobile, isAnimationsOn())

        this.resetGameManager()
        this.resetNotationBuilder()
        this.resetGameNotation()
    }

    /**
     * Returns the GameType id for your game.
     * Add your game to GameType in PaiShoMain.js.
     */
    getGameTypeId() {
        return GameType.GodaiPaiSho.id
    }

    completeSetup() {

        rerunAll()
        this.callActuate()
    }

    /**
     * Called when rewinding moves.
     */
    resetGameManager() {
        this.theGame = new GodaiGameManager(this.actuator)
    }

    /**
     * Called when rewinding moves.
     */
    resetNotationBuilder() {
        this.notationBuilder = new GodaiNotationBuilder()
    }

    resetGameNotation() {
        this.gameNotation = this.getNewGameNotation()
    }

    getNewGameNotation() {
        return new GodaiGameNotation()
    }

    /**
     * Called when the game should re-render.
     */
    callActuate() {
        this.theGame.actuate()
    }

    /**
     * Called when the user's move needs to be reset, from clicking the Undo Move link.
     */
    resetMove() {
        if (this.notationBuilder.status === BRAND_NEW) {
            this.gameNotation.removeLastMove()
        }

        rerunAll()
    }

    cleanup() { }

    isSolitaire() {
        return false
    }

    getAiList() {
        return []
    }

    getCurrentPlayer() {
        if (this.gameNotation.moves.length % 2 == 0) return GUEST
        return HOST
    }

    /* EVENT METHODS */
    /**
     * Called when the player clicks on an unplayed tile
     * @param {HTMLDivElement} tileDiv 
     */
    unplayedTileClicked(tileDiv) {
        this.theGame.markingManager.clearMarkings()
        this.callActuate()

        if (this.theGame.hasEnded() && this.notationBuilder.status !== READY_FOR_BONUS) {
            return
        }

        if (!myTurn()) {
            return
        }

        if (currentMoveIndex !== this.gameNotation.moves.length) {
            debug("Can only interact if all moves are played")
            return
        }

        let divName = tileDiv.getAttribute("name")
        let tileId = parseInt(tileDiv.getAttribute("id"))
        let playerCode = divName.charAt(0)
        let tileCode = divName.substring(1)

        let player = playerCode === 'H' ? HOST : GUEST
        let tile = this.theGame.tileManager.peekTile(player, tileCode, tileId)

        if (tile.ownerName !== this.getCurrentPlayer()) {
            debug("That's not your tile")
            return
        }

        if (this.notationBuilder.status === BRAND_NEW) {
            tile.selectedFromPile = true
            this.notationBuilder.moveType = DEPLOY
            this.notationBuilder.tileType = tileCode
            this.notationBuilder.status = WAITING_FOR_ENDPOINT
            this.theGame.revealDeployPoints(tile.ownerName, tileCode)
        }
        else {
            this.theGame.hidePossibleMovePoints()
            this.resetNotationBuilder()
        }

    }

    /**
     * Called whenever the player draws an arrow.
     * 
     * Taken from VagabondController.js
     * @param {HTMLDivElement} htmlPoint 
     */
    RmbDown(htmlPoint) {
        let npText = htmlPoint.getAttribute("name")
        let notationPoint = new NotationPoint(npText)
        let rowCol = notationPoint.rowAndColumn
        this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col]
    }

    /**
     * Called whenever the player draws an arrow.
     * 
     * Taken from VagabondController.js
     * @param {HTMLDivElement} htmlPoint 
     */
    RmbUp(htmlPoint) {
        let npText = htmlPoint.getAttribute("name")
        let notationPoint = new NotationPoint(npText)
        let rowCol = notationPoint.rowAndColumn
        let mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col]

        if (mouseEndPoint == this.mouseStartPoint) {
            this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint)
        }
        else if (this.mouseStartPoint) {
            this.theGame.markingManager.toggleMarkedArrow(this.mouseStartPoint, mouseEndPoint)
        }

        this.mouseStartPoint = null
        this.callActuate()
    }

    /**
     * Called whenever the player clicks on a point
     * 
     * Taken from VagabondController.js
     * @param {HTMLDivElement} htmlPoint 
     */
    pointClicked(htmlPoint) {
        this.theGame.markingManager.clearMarkings()
        this.callActuate()

        if (this.theGame.hasEnded()) return

        if (!myTurn()) return

        if (currentMoveIndex !== this.gameNotation.moves.length) {
            debug("Can only interact if all moves are played")
            return
        }

        // Get the board point
        let npText = htmlPoint.getAttribute("name")
        let notationPoint = new NotationPoint(npText)
        let rowCol = notationPoint.rowAndColumn
        let boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col]

        if (this.notationBuilder.status === BRAND_NEW) {
            // NEW GAME
            if (boardPoint.hasTile()) {
                if (boardPoint.tile.ownerName !== this.getCurrentPlayer() || !myTurn()) {
                    debug("Not your tile!")
                    return
                }

                this.notationBuilder.status = WAITING_FOR_ENDPOINT
                this.notationBuilder.moveType = MOVE
                this.notationBuilder.startPoint = new NotationPoint(npText)

                this.theGame.revealPossibleMovePoints(boardPoint)
            }
        }
        else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
            if (boardPoint.isType(POSSIBLE_MOVE) && myTurn()) {
                // They're trying to move there! And they can! Exciting!
			    // Need the notation!
                this.theGame.hidePossibleMovePoints()

                if (!isInReplay) {
                    this.notationBuilder.endPoint = new NotationPoint(npText)
                    let move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder)
                    // Move all set. Add it to the notation and run it!
                    this.theGame.runNotationMove(move)
                    this.gameNotation.addMove(move)

                    if (onlinePlayEnabled && this.gameNotation.moves.length === 1) {
                        createGameIfThatIsOk(GameType.GodaiPaiSho.id)
                    }
                    else {
                        if (playingOnlineGame()) {
                            callSubmitMove()
                        }
                        else {
                            finalizeMove()
                        }
                    }
                }
            }
            else {
                this.theGame.hidePossibleMovePoints()
                this.resetNotationBuilder()
            }
        }
    }

    /* DISPLAY METHODS */

    /**
     * 
     * Taken from VagabondController.js
     * @param {HTMLDivElement} htmlPoint
     * @returns {{heading: string, message: Array<string>} | null}
     */
    getPointMessage(htmlPoint) {
        const messageInfo = {
            heading: "",
            message: [],
        }

        let npText = htmlPoint.getAttribute("name")
        let notationPoint = new NotationPoint(npText)
        let rowCol = notationPoint.rowAndColumn
        let boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col]

        if (boardPoint.hasTile()) {
            const tileInfo = this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName)
            messageInfo.heading = tileInfo.heading
            messageInfo.message.push(...tileInfo.message)
        }

        if (boardPoint.isType(GATE)) {
            let info = this._getGateMessage(boardPoint)
            messageInfo.heading = info.header
            messageInfo.message.push(info.message)

            return messageInfo
        }

        // Apply the board zone descriptions only when the option is enabled
        if (gameOptionEnabled(GODAI_BOARD_ZONES)) {
            if (boardPoint.isType(MOUNTAIN_ENTRANCE)) {
                messageInfo.heading = "Mountain Entry Point"
                messageInfo.message.push(this._getMountainEntranceMessage())
            }
            
            if (boardPoint.isType(RIVER_MOUTH)) {
                messageInfo.heading = "River Mouth/Mountain Entry Point"
                messageInfo.message.push(this._getRiverMouthMessage())
            }
            else if (boardPoint.isType(MOUNTAIN_ENTRANCE) && boardPoint.isType(RIVER_TILE)) {
                
            }
            else if (boardPoint.isType(RIVER_TILE)) {
                messageInfo.heading = "River Space"
                messageInfo.message.push(this._getRiverMessage(boardPoint))
            }
            else if (boardPoint.isType(MOUNTAIN_TILE)) {
                messageInfo.heading = "Mountain Point"
                messageInfo.message.push(this._getMountainMessage())
            }
        
            if (boardPoint.isType(MOUNTAIN_ENTRANCE) && boardPoint.isType(RIVER_TILE) && !boardPoint.isType(RIVER_MOUTH)) {
                messageInfo.heading = "River Space/Mountain Entry Point"
            }
        }

        // Add point data to neutral spaces
        if (boardPoint.isType(RED) && boardPoint.isType(WHITE)) {
            messageInfo.heading = "Red/White Point"
            // messageInfo.message.push(this._getNeutralPointMessage())
        }
        else if (boardPoint.isType(RED)) {
            messageInfo.heading = "Red Point"
            // messageInfo.message.push(this._getNeutralPointMessage())
        }
        else if (boardPoint.isType(WHITE)) {
            messageInfo.heading = "White Point"
            // messageInfo.message.push(this._getNeutralPointMessage())
        }
        else if (boardPoint.isType(NEUTRAL) || ( !boardPoint.isType(NEUTRAL) && !gameOptionEnabled(GODAI_BOARD_ZONES) ) ) {
            messageInfo.heading = "Neutral Point"
            // messageInfo.message.push(this._getNeutralPointMessage())
        }

        return messageInfo
    }

    _getNeutralPointMessage() {
        return ""
    }

    /** @param {GodaiBoardPoint} point */
    _getGateMessage(point) {
        let msg = "Gate."
        let header = "Gate.";
        if (point.isType(WHITE_GATE)) {
            header = "Western/White Gate"
            msg = "The Metal Tile is deployed in this Gate"
        } else if (point.isType(RED_GATE)) {
            header = "South/Red Gate"
            msg = "The Fire Tile is deployed in this Gate"
        } else if (point.isType(BLACK_GATE)) {
            header = "North/Black Gate"
            msg = "The Water Tile is deployed in this Gate"
        } else if (point.isType(GREEN_GATE)) {
            header = "Eastern/Green Gate"
            msg = "The Wood Tile is deployed in this Gate"
        } else if (point.isType(YELLOW_GATE)) {
            header = "Central/Yellow Gate"
            msg = "The Earth Tile is deployed in this Gate"
        }

        let message = [
            msg,
            "Tiles already on the board can not move onto any Gate but can move through unoccupied Gates",
            "Each player may only have up to 1 tile in all the total Gates at a time",
            "Tiles in Gates are unaffected by cycles and can not be captured",
        ]

        return { message: header + ": " + toBullets(message).outerHTML, header }
    }

    _getMountainMessage() {
        let msg = []
        msg.push("Tiles can only enter Mountains through the Mountain Entry Points")
        msg.push("If tiles wish to move off the Mountains not through the Mountain Entry Points, they have to spend a turn moving onto the River point first, after which they are off the Mountains")
        return "Mountain: " + toBullets(msg).outerHTML
    }

    _getMountainEntranceMessage() {
        let bullets = toBullets([
            "The point through which tiles can enter Mountains, either from on gates or not"
        ])
        return "Mountain Entry Point: " + bullets.outerHTML
    }

    /**
     * Should return the default string of the html content to put in the Help tab.
     * @returns {string}
     */
    getDefaultHelpMessageText() {
        return "<h4>Godai Pai Sho</h4>" +
            "<p></p>" +
            "<p>The objective of Godai Pai Sho; also known as <b>Wuxing Pai Sho</b>; is to capture one of each of your opponent's tiles using your own tiles.</p>" +
            "<p>Alternatively, a player may win if their opponent is unable to win under normal conditions.</p>" +
            '<p>For additional information, check out the <a href="https://tinyurl.com/65frxu6h" target="_blank">official ruleset.</a></p>' +
            "<p><strong><center>Capture Cycle</center></strong></p>" +
            "<p>The tiles mentioned capture the one mentioned after it:</p>" +
            "<p>Wood &gt; Earth &gt; Water &gt; Fire &gt; Metal &gt; Wood</p>" +
            "<p><strong><center>Cycles</center></strong></p>" +
            "<p>A tile that sorrounds another tile, regardless of ownership, may affect the movement of said tile. This interaction is called a <b>Cycle</b>, and the four types of cycles are described below.</p>"+
            "<ul>" +
            "<li>" +
                "<p><b>Sheng:</b> When a tile is being helped, it is in Sheng and can move up to <b>5 spaces.</b></p>" +
                "<p>Wood &gt; Fire &gt; Earth &gt; Metal &gt; Water &gt; Wood</p>" +
            "</li>" +
            "<li>" +
                "<p><b>Xie:</b> When a tile helps another tile in Sheng, it is in Xie and can move up to <b>2 spaces.</b></p>" +
                "<p>It is the inverse of the Sheng Cycle.</p>" +
                "<p>Wood &gt; Water &gt; Metal &gt; Earth &gt; Fire &gt; Wood</p>" +
            "</li>" +
            "<li><b>Ke:</b> When a tile is helped by another tile without being depleted, that tile can move up to <b>4 spaces.</b> This cycle is the same as the Capture Cycle.</li>" +
            "<li><b>Wu:</b> When a tile is sorrounded by a tile of its own type, it can move up to <b>4 spaces.</b></li>" +
            "</ul>" +
            "<p><strong><center>Cycle Contridictment</center></strong></p>" +
            "<ul>" +
            "<li>Sheng and Xie Cycles are considered <b>Extreme Cycles</b></li>" +
            "<li>Ke and Wu Cycles are considered <b>Normal Cycles</b></li>" +
            "<li>A tile cannot be affected by multiple Cycles of the same type. (i. e. No tile can be affected by two Ke Cycles, only one is considered)</li>" +
            "<li>The effects of an Extreme Cycle override that of the Normal Cycles.</li>" +
            "<li>If a tile is affected by both Extreme Cycles, it can move up to its normal movement count.</li>" +
            "<li>If a tile is affected by both Extreme Cycles, but is affected by a Normal Cycle, then it moves according to the effect of the Normal Cycle.</li>" +
            "</ul>"
    }

    /** @param {GodaiBoardPoint} point */
    _getRiverMessage(point) {
        let msg = []
        msg.push("Rivers start from the Blue Gate to the Red Gate")
        msg.push("All Water, Wood and Fire Tiles on the River float one space down the River at the end of each players' turn")
        msg.push("Earth tiles located in rivers will not be moved. Instead, they block the stream of river tiles downstream")
        msg.push("Tiles are not moved by rivers on the turn they enter")
        if (point.isType(RIVER_DL_TILE)) {
            msg.push("This river space moves tiles to the <b>South-West</b>")
        }
        if (point.isType(RIVER_DR_TILE)) {
            msg.push("This river space moves tiles to the <b>South-East</b>")
        }
        return "River Space: " + toBullets(msg).outerHTML
    }

    _getRiverMouthMessage() {
        let msg = []
        msg.push("Rivers start from the Blue Gate to the Red Gate")
        msg.push("All Water, Wood and Fire Tiles on the River float one space down the River at the end of each players' turn")
        msg.push("Earth tiles located in rivers will not be moved. Instead, they block the stream of river tiles downstream")
        msg.push("Tiles are not moved by rivers on the turn they enter")
        msg.push("Tiles on this point are at the end of the River and cannot flow down any more")
        msg.push("If two tiles simultaneously reach this point, then both tiles drown, resulting in both tiles getting captured regardless of the capture cycle. This is called <b>'The River Crash'</b>")
        return "River Mouth: " + toBullets(msg).outerHTML
    }

    /**
     * Returns the message found above the players' tileset. Included here are game options, draw offers, etc.
     * @returns {string}
     */
    getAdditionalMessage() {
        const container = document.createElement('span');

        if (this.gameNotation.moves.length === 0) {
            if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
                const joinText = document.createElement('span');
                joinText.appendChild(document.createTextNode('Click '));
                const emJoin = document.createElement('em');
                emJoin.textContent = 'Join Game';
                joinText.appendChild(emJoin);
                joinText.appendChild(document.createTextNode(' above to join another player\'s game. Or, you can start a game that other players can join by making a move.'));
                container.appendChild(joinText);
                container.appendChild(document.createElement('br'));
            }
            else {
                container.appendChild(document.createTextNode('Sign in to enable online gameplay. Or, start playing a local game by making a move.'));
            }

            container.appendChild(getGameOptionsMessageElement(GameType.GodaiPaiSho.gameOptions));
        }

        return container;
    }

    /**
     * Taken from VagabondController.js
     * @param {HTMLDivElement} tileDiv 
     * @returns {{heading: string, message: Array<string>}} Message of the tile, given by `getTheMessage(tile, ownerName)`
     */
    getTileMessage(tileDiv) {
        let divName = tileDiv.getAttribute("name")
        let tile = new GodaiTile(divName.substring(1), divName.charAt(0))
        let ownerName = divName.startsWith('G') ? GUEST : HOST
        return this.getTheMessage(tile, ownerName)
    }

    /**
     * Get the information of a especific tile.
     * @param {GodaiTile} tile 
     * @param {string} ownerName 
     * @returns {{heading: string, message: Array<string>}} Information to display
     */
    getTheMessage(tile, ownerName) {
        let tileCode = tile.code
        let message = []
        let heading = ownerName + "'s " + GodaiTile.getTileName(tileCode) + ' Tile'
        switch (tileCode) {
            case GO_WOOD:
                message.push("Basic Tile")
                message.push("Deployed on East or Green Gate")
                message.push("Moves up to " + GodaiTile.baseMovement + " spaces")
                message.push("Captures Earth Tiles")
                message.push("Encounters a <b>Shēng</b> cycle when next to a Water tile; it can move up to " + GodaiTile.shengMovement + " spaces")
                message.push("Encounters a <b>Xiè</b> cycle when next to a Fire tile; it can move up to " + GodaiTile.xieMovement + " spaces")
                message.push("Encounters a <b>Kè</b> cycle when next to a Metal tile; it can move up to " + GodaiTile.keMovement + " spaces")
                message.push("Encounters a <b>Wǔ</b> cycle when next to a Wood tile; it can move up to " + GodaiTile.wuMovement + " spaces")
                break
            case GO_EARTH:
                message.push("Basic Tile")
                message.push("Deployed on Center or Yellow Gate")
                message.push("Moves up to " + GodaiTile.baseMovement + " spaces")
                message.push("Captures Water Tiles")
                message.push("Encounters a <b>Shēng</b> cycle when next to a Fire tile; it can move up to " + GodaiTile.shengMovement + " spaces")
                message.push("Encounters a <b>Xiè</b> cycle when next to a Metal tile; it can move up to " + GodaiTile.xieMovement + " spaces")
                message.push("Encounters a <b>Kè</b> cycle when next to a Wood tile; it can move up to " + GodaiTile.keMovement + " spaces")
                message.push("Encounters a <b>Wǔ</b> cycle when next to a Earth tile; it can move up to " + GodaiTile.wuMovement + " spaces")
                message.push("Does not float on the River. 'Dams' the River, not allowing any tile downstream of it to continue flowing down the River")
                break
            case GO_WATER:
                message.push("Basic Tile")
                message.push("Deployed on North or Black Gate")
                message.push("Moves up to " + GodaiTile.baseMovement + " spaces")
                message.push("Captures Fire Tiles")
                message.push("Encounters a <b>Shēng</b> when next to a Metal tile; it can move up to " + GodaiTile.shengMovement + " spaces")
                message.push("Encounters a <b>Xiè</b> when next to a Wood tile; it can move up to " + GodaiTile.xieMovement + " spaces")
                message.push("Encounters a <b>Kè</b> when next to a Earth tile; it can move up to " + GodaiTile.keMovement + " spaces")
                message.push("Encounters a <b>Wǔ</b> when next to a Water tile; it can move up to " + GodaiTile.wuMovement + " spaces")
                break
            case GO_FIRE:
                message.push("Basic Tile")
                message.push("Deployed on South or Red Gate")
                message.push("Moves up to " + GodaiTile.baseMovement + " spaces")
                message.push("Captures Metal Tiles")
                message.push("Encounters a <b>Shēng</b> when next to a Wood tile; it can move up to " + GodaiTile.shengMovement + " spaces")
                message.push("Encounters a <b>Xiè</b> when next to a Earth tile; it can move up to " + GodaiTile.xieMovement + " spaces")
                message.push("Encounters a <b>Kè</b> when next to a Water tile; it can move up to " + GodaiTile.keMovement + " spaces")
                message.push("Encounters a <b>Wǔ</b> when next to a Fire tile; it can move up to " + GodaiTile.wuMovement + " spaces")
                break
            case GO_METAL:
                message.push("Basic Tile")
                message.push("Deployed on West or White Gate")
                message.push("Moves up to " + GodaiTile.baseMovement + " spaces")
                message.push("Captures Wood Tiles")
                message.push("Encounters a <b>Shēng</b> when next to a Earth tile; it can move up to " + GodaiTile.shengMovement + " spaces")
                message.push("Encounters a <b>Xiè</b> when next to a Water tile; it can move up to " + GodaiTile.xieMovement + " spaces")
                message.push("Encounters a <b>Kè</b> when next to a Fire tile; it can move up to " + GodaiTile.keMovement + " spaces")
                message.push("Encounters a <b>Wǔ</b> when next to a Metal tile; it can move up to " + GodaiTile.wuMovement + " spaces")
                break
            case GO_EMPTY:
                message.push("Special Tile")
                message.push("Deployed on any Gate")
                message.push("Moves up to " + GodaiTile.emptyTileMovement + " spaces")
                message.push("Can capture and be captured by any tile")
                message.push("Not affected by any cycle")
                message.push("When it captures a Basic Tile, it 'transforms' into that tile, after which it only does what that Tile does")
                message.push("If captured before transformation, it acts as a substitute for any of the required tiles still needed for the opponent to win")
                break
        }

        return {
            heading: heading,
            message: [GodaiTile.getTileName(tileCode) + ' Tile:' + toBullets(message).outerHTML]
        }
    }

    /* STATIC METHODS */

    /**
     * Returns the html representation of the tile containers for host. Each container may contain the tiles
     * that the host currently has available to deploy or plant. Each cointainer must have a class name with
     * the code of whatever tile it cointains
     * @returns {string}
     * */
    static getHostTilesContainerDivs() {
        return '' +
        '<span>~Host\'s Tile Library~</span>' +
        '<br>' +
        '<div class="HWO"></div>' +
        '<div class="HEA"></div>' +
        '<div class="HWA"></div>' +
        '<div class="HFI"></div>' +
        '<div class="HME"></div>' +
        '<br class="clear">' +
        '<div class="HEM"></div>' +
        '<br class="clear">' +
        '<span>~Host\'s Captured Tiles~</span>' +
        '<span class="tileLibrary"></span>'
    }

    /**
     * Returns the html representation of the tile containers for guest. Each container may contain the tiles
     * that the host currently has available to deploy or plant. Each cointainer must have a class name with
     * the code of whatever tile it cointains
     * @returns {string}
     * */
    /** @returns {string} */
    static getGuestTilesContainerDivs() {
        return '' +
        '<span>~Guest\'s Tile Library~</span>' +
        '<br>' +
        '<div class="GWO"></div>' +
        '<div class="GEA"></div>' +
        '<div class="GWA"></div>' +
        '<div class="GFI"></div>' +
        '<div class="GME"></div>' +
        '<br class="clear">' +
        '<div class="GEM"></div>' +
        '<br class="clear">' +
        '<span>~Guest\'s Captured Tiles~</span>' +
        '<span class="tileLibrary"></span>'
    }
}