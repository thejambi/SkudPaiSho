import { GUEST, HOST, NotationPoint, RowAndColumn } from "../CommonNotationObjects"
import { debug } from "../GameData"
import { gameOptionEnabled, GODAI_BOARD_ZONES } from "../GameOptions"
import { GATE, NEUTRAL, NON_PLAYABLE, POSSIBLE_MOVE } from "../skud-pai-sho/SkudPaiShoBoardPoint"
import { BLACK_GATE, EASTERN_RIVER, GREEN_GATE, IS_DAMMED_RIVER, MOUNTAIN_ENTRANCE, MOUNTAIN_TILE, RED_GATE, RIVER_DL_TILE, RIVER_DR_TILE, RIVER_TILE, WESTERN_RIVER, WHITE_GATE, GodaiBoardPoint, YELLOW_GATE } from "./GodaiBoardPoint"
import { canTileCaptureOther, GO_EARTH, GO_EMPTY, GO_FIRE, GO_METAL, GO_WATER, GO_WOOD, GodaiTile } from "./GodaiTile"
import { GodaiTileManager } from "./GodaiTileManager"

/**
 * Util function that gets a set of tile types
 * @param {Array<GodaiTile>} tiles 
 * @returns {Set<string>} Set of tile types
 */
function getSetOfTileTypes(tiles) {
    let set = new Set([""])
    set.delete("")
    tiles.map(tile => tile.code).forEach( type => set.add(type) )
    return set
}

/**
 * The main way a player can win is:
 * 1. The player has captured one of each tile
 * 2. If they have captured an untransformed empty tile,
 * said tile replaces one of the tiles they need to win.
 * 
 * @param {Array<GodaiTile} tiles Array of captured tiles
 * @returns {boolean} Whether the player won or not
 */
function hasPlayerWonFromMainCondition( tiles ) {
    const setOfTileTypes = getSetOfTileTypes( tiles )

    const hasWood = setOfTileTypes.has(GO_WOOD)
    const hasEarth = setOfTileTypes.has(GO_EARTH)
    const hasWater = setOfTileTypes.has(GO_WATER)
    const hasFire = setOfTileTypes.has(GO_FIRE)
    const hasMetal = setOfTileTypes.has(GO_METAL)
    const hasEmpty = setOfTileTypes.has(GO_EMPTY)

    if (hasWood && hasEarth && hasWater && hasFire && hasMetal) {
        return true // Classic win
    } else if (hasEmpty && hasEarth && hasWater && hasFire && hasMetal) {
        return true // Empty tile replaced Wood tile
    }
    else if (hasWood && hasEmpty && hasWater && hasFire && hasMetal) {
        return true // Empty tile replaced Earth tile
    }
    else if (hasWood && hasEarth && hasEmpty && hasFire && hasMetal) {
        return true // Empty tile replaced Water tile
    }
    else if (hasWood && hasEarth && hasWater && hasEmpty && hasMetal) {
        return true // Empty tile replaced Fire tile
    }
    else if (hasWood && hasEarth && hasWater && hasFire && hasEmpty) {
        return true // Empty tile replaced Metal tile
    }

    return false
}

/**
 * Checks if the `player` has won trough the alt condition.
 * 
 * @param {GodaiBoard} board board
 * @param {GodaiTileManager} tileManager 
 * @param {string} player GUEST or HOST - which player to look for the win condition
 * @returns {boolean} Whether the player won or not
 */
function hasPlayerWonFromAltCondition(board, tileManager, player) {

    // Utils refs
    const allTypeTypesSet = new Set([GO_EARTH, GO_FIRE, GO_METAL, GO_WOOD, GO_WATER])
    const opponentLibrary = player == HOST ? tileManager.guestTiles : tileManager.hostTiles
    const opponentCapturedTiles = player == HOST ? tileManager.capturedGuestTiles : tileManager.capturedHostTiles
    const allOpponentTiles = opponentLibrary.concat(
        board.getTilesOnBoard().filter( tile => tile.ownerName != player )
    )

    // Get the tile types the opponent needs to win (normally)
    let opponentCapturedTypes = getSetOfTileTypes( opponentCapturedTiles )

    let typesOpponentNeeds = new Set([""])
    typesOpponentNeeds.delete("")
    for (const type of allTypeTypesSet) {
        if (!opponentCapturedTypes.has(type)) {
            typesOpponentNeeds.add(type)
        }
    }


    // Does the opponent have a playable tile that they can use to capture those types?
    for (const type of typesOpponentNeeds) {
        const utilTile = new GodaiTile(type, player != HOST ? "G" : "H")

        let canCaptureThatType = false

        for (const tile of allOpponentTiles) {
            // This check also includes Empty Tiles, since if tile is Empty Tile,
            // Then it returns true as it can capture it
            if ( canTileCaptureOther(tile, utilTile) ) {
                canCaptureThatType = true
            }
        }

        if (!canCaptureThatType) {
            return true // We locked them out! Player wins!
        }
    }

    return false
}

/**
 * @param {GodaiTile} tile 
 */
function canTileBeMovedByRiver(tile) {
    return [GO_WOOD, GO_WATER, GO_FIRE, GO_EMPTY].includes(tile.code) && !tile.gotMoved
}

export class GodaiBoard {

    /** @type {RowAndColumn} */
    size

    /** @type {Array<Array<GodaiBoardPoint>>} */
    cells

    /** @type {Array<string>} */
    winners

    /** @type {string} */
    winnerReason = ""

    constructor() {
        this.size = new RowAndColumn(17, 17)
        this.cells = this.brandNew()
        this.winners = []
    }

    brandNew() {
        let cells = []

        cells[0] = this.newRow(9, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountainEntrance(),
            GodaiBoardPoint.blackGate(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[1] = this.newRow(11, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western( GodaiBoardPoint.eastern( GodaiBoardPoint.mountainEntranceWithRiver() ) ),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[2] = this.newRow(13, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[3] = this.newRow(15, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[4] = this.newRow(17, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[5] = this.newRow(17, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[6] = this.newRow(17, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[7] = this.newRow(17, [
            GodaiBoardPoint.mountainEntrance(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        // Horizontal midline
        cells[8] = this.newRow(17, [
            GodaiBoardPoint.whiteGate(),
            GodaiBoardPoint.western(GodaiBoardPoint.mountainEntranceWithRiverDR()),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.yellowGate(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.greenGate(),
        ])

        cells[9] = this.newRow(17, [
            GodaiBoardPoint.mountainEntrance(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[10] = this.newRow(17, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[11] = this.newRow(17, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[12] = this.newRow(17, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[13] = this.newRow(15, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutralRed(),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.neutralWhite(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[14] = this.newRow(13, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.riverDownRight()),
            GodaiBoardPoint.neutralRedWhite(),
            GodaiBoardPoint.eastern(GodaiBoardPoint.riverDownLeft()),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[15] = this.newRow(11, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.western(GodaiBoardPoint.eastern(GodaiBoardPoint.riverMouth(GodaiBoardPoint.mountainEntranceWithRiver()))),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        cells[16] = this.newRow(9, [
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountain(),
            GodaiBoardPoint.mountainEntrance(),
            GodaiBoardPoint.redGate(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
            GodaiBoardPoint.neutral(),
        ])

        for (let row = 0; row < cells.length; row++) {
            for (let col = 0; col < cells[row].length; col++) {
                cells[row][col].row = row;
                cells[row][col].col = col;
            }
        }

        return cells
    }

    /**
     * Taken from SpiritBoard.js
     * @param {number} numColumns Number of Columns to add. They're added from the center
     * @param {Array<GodaiBoardPoint>} points points to add, from left to right
     * @returns {}
     */
    newRow(numColumns, points) {
        let cells = []
        let numBlanksOnSides = (this.size.row - numColumns) / 2

        let nonPoint = new GodaiBoardPoint()
        nonPoint.addType(NON_PLAYABLE)

        for (var i = 0; i < this.size.row; i++) {
            if (i < numBlanksOnSides) {
                cells[i] = nonPoint;
            } else if (i < numBlanksOnSides + numColumns) {
                if (points) {
                    cells[i] = points[i - numBlanksOnSides];
                } else {
                    cells[i] = nonPoint;
                }
            } else {
                cells[i] = nonPoint;
            }
        }

        return cells
    }

    _getGatePoints() {
        return [
            this.cells[0][8],
            this.cells[8][0],
            this.cells[8][8],
            this.cells[8][16],
            this.cells[16][8],
        ]
    }

    /**
     * 
     * @param {string} player GUEST or HOST
     * @param {GodaiBoardPoint} bpStart 
     * @param {GodaiBoardPoint} bpEnd 
     * @returns {boolean}
     */
    _canMoveTileToPoint(player, bpStart, bpEnd) {
        // Start point must have tile
        if (!bpStart.hasTile()) {
            return false
        }

        // Tile must belong to player
        if (bpStart.tile.ownerName !== player) {
            return false
        }

        // Can't move tiles directly to gates
        if (bpEnd.isType(GATE)) {
            return false
        }

        let canCaptureEndTile = bpEnd.hasTile()
            ? this._canTileStartCaptureEnd(bpStart, bpEnd)
            : false

        // Can only move if the endpoint has a capturable tile
        if (bpEnd.hasTile() && !canCaptureEndTile) {
            return false
        }

        // Movement
        let sorroundingBPs = this.getSurroundingBoardPoints(bpStart)
        let numMoves = bpStart.tile.getMoveDistance(sorroundingBPs, bpStart.isType(GATE))

        if (Math.abs(bpStart.row - bpEnd.row) + Math.abs(bpStart.col - bpEnd.col) > numMoves) {
            // That's too far!
            return false
        }
        else {
            // Move may be possible. But there may be tiles in the way
            if (!this._verifyAbleToReach(bpStart, bpEnd, numMoves)) {
                return false
            }
        }

        // Suppose he can move
        return true
    }

    /**
     * Taken from VagabondBoard.js
     * @param {GodaiBoardPoint} bpStart 
     * @param {GodaiBoardPoint} bpEnd 
     * @param {number} numMoves 
     */
    _verifyAbleToReach(bpStart, bpEnd, numMoves) {
        // Recursion!
        return this._pathFound(bpStart, bpEnd, numMoves, bpStart)
    }

    /**
     * Minifier-safe implementation: uses unique const variables and nested if statements
     * instead of && with recursive calls to prevent Terser optimization issues
     * Taken from VagabondBoard.js
     * @param {GodaiBoardPoint} bpStart
     * @param {GodaiBoardPoint} bpEnd
     * @param {number} numMoves
     * @param {GodaiBoardPoint} trueStartingBP In case we're using board zones, we'll need to check if the path they want is Mountain -> River -> Neutral
     */
    _pathFound(bpStart, bpEnd, numMoves, trueStartingBP) {
        if (!bpStart || !bpEnd) {
            return false
        }

        if (bpStart.isType(NON_PLAYABLE) || bpEnd.isType(NON_PLAYABLE)) {
            return false
        }

        let startRow = bpStart.row
        let startCol = bpStart.col
        let endRow = bpEnd.row
        let endCol = bpEnd.col

        if (startRow === endRow && startCol === endCol) {
            return false // Moving to the same point
        }

        if (numMoves <= 0) {
            return false
        }

        let minMoves = Math.abs(startRow - endRow) + Math.abs(startCol - endCol)
        if (minMoves === 1) {
            return this._couldStepIntoNext(bpStart, bpEnd, trueStartingBP)
        }

        let movesLeft = numMoves - 1

        // Check UP - nested if instead of &&
        let upRow = startRow - 1
        if (upRow >= 0) {
            let upPoint = this.cells[upRow][startCol]
            if (!upPoint.hasTile()) {
                if (this._couldStepIntoNext(bpStart, upPoint, trueStartingBP)) {
                    if (this._pathFound(upPoint, bpEnd, movesLeft, trueStartingBP)) {
                        return true
                    }
                }
            }
        }

        // Check DOWN
        let downRow = startRow + 1
        if (downRow < 17) {
            let downPoint = this.cells[downRow][startCol]
            if (!downPoint.hasTile()) {
                if (this._couldStepIntoNext(bpStart, downPoint, trueStartingBP)) {
                    if (this._pathFound(downPoint, bpEnd, movesLeft, trueStartingBP)) {
                        return true
                    }
                }
            }
        }

        // Check LEFT
        let leftCol = startCol - 1
        if (leftCol >= 0) {
            let leftPoint = this.cells[startRow][leftCol]
            if (!leftPoint.hasTile()) {
                if (this._couldStepIntoNext(bpStart, leftPoint, trueStartingBP)) {
                    if (this._pathFound(leftPoint, bpEnd, movesLeft, trueStartingBP)) {
                        return true
                    }
                }
            }
        }

        // Check RIGHT
        let rightCol = startCol + 1
        if (rightCol < 17) {
            let rightPoint = this.cells[startRow][rightCol]
            if (!rightPoint.hasTile()) {
                if (this._couldStepIntoNext(bpStart, rightPoint, trueStartingBP)) {
                    if (this._pathFound(rightPoint, bpEnd, movesLeft, trueStartingBP)) {
                        return true
                    }
                }
            }
        }

        return false
    }

    /**
     * Util function that checks whether a tile starting from `bpStart` could directly into `nextPoint`
     * if we only follow board point logic.
     * @param {GodaiBoardPoint} startPoint 
     * @param {GodaiBoardPoint} nextPoint Point that is next to `bpStart`
     * @param {GodaiBoardPoint} trueStartingPoint Only used if we need to check if we come from a mountain
     * @returns {boolean} Wheather a tile could step into `nextPoint` or not
     */
    _couldStepIntoNext(startPoint, nextPoint, trueStartingPoint) {
        if (nextPoint.isType(POSSIBLE_MOVE)) {
            return true // We already went by this
        }

        // Board zone logic only applies if there are zones
        if (gameOptionEnabled(GODAI_BOARD_ZONES)) {
            if (startPoint.isType(RIVER_TILE) && !startPoint.isType(MOUNTAIN_ENTRANCE) && nextPoint.isType(MOUNTAIN_TILE)) {
                return false // Can't do that
            }
            else if (startPoint.isType(NEUTRAL) && nextPoint.isType(MOUNTAIN_TILE)) {
                return false // Nope can't do that
            }
            else if ( trueStartingPoint.isType(MOUNTAIN_TILE) && startPoint.isType(RIVER_TILE) && nextPoint.isType(NEUTRAL)) {
                return false // You can't move Mountain -> River -> Neutral, you stay in the river
            }
        }

        return true // Neutral board points duh
    }

    /**
     * Can the tile present in `bpStart` capture the one located in `bpEnd`?
     * @param {GodaiBoardPoint} bpStart 
     * @param {GodaiBoardPoint} bpEnd 
     * @returns {boolean}
     */
    _canTileStartCaptureEnd(bpStart, bpEnd) {
        if (bpStart.tile == null || bpEnd.tile == null) {
            return false // Can't capture a tile if there isn't one :)
        }

        let capturerTile = bpStart.tile
        let capturedTile = bpEnd.tile

        return canTileCaptureOther(capturerTile, capturedTile)
    }

    /**
     * 
     * @param {string} playerCode GUEST or HOST
     * @param {NotationPoint} notationPointStart 
     * @param {NotationPoint} notationPointEnd 
     */
    moveTile( playerCode, notationPointStart, notationPointEnd ) {
        let start = notationPointStart.rowAndColumn
        let end = notationPointEnd.rowAndColumn

        // Basic checks
        if (start.row < 0 || start.row > 16 || end.row < 0 || end.row > 16) {
            debug("That point does not exist. So it's not gonna happen.");
			return false
        }

        let bpStart = this.cells[start.row][start.col]
        let bpEnd = this.cells[end.row][end.col]

        if (!this._canMoveTileToPoint(playerCode, bpStart, bpEnd)) {
            debug("Bad move bears");
			showBadMoveModal();
			return false;
        }

        let tile = bpStart.removeTile()

        if (!tile) {
			debug("Error: No tile to move!");
		}

        // Capture the tile (but save it for later)
        let capturedTile = bpEnd.tile
        bpEnd.putTile(tile)

        return {
			movedTile: tile,
			startPoint: notationPointStart,
			endPoint: notationPointEnd,
			capturedTile: capturedTile
		};
    }

    /**
     * Taken from VagabondBoard.js
     * @param {GodaiBoardPoint} boardPointStart 
     */
    setPossibleMovePoints(boardPointStart) {
        if (!boardPointStart.hasTile()) return

        let player = boardPointStart.tile.ownerName

        // POSSIBLE POINTS
        for (const row of this.cells) {
            for (const bp of row) {
                if (!bp.isType(NON_PLAYABLE)) {
                    if (this._canMoveTileToPoint(player, boardPointStart, bp)) {
                        bp.addType(POSSIBLE_MOVE)
                    }
                }
            }
        }
    }

    /**
     * 
     * @param {string} player HOST or GUEST
     * @param {string} tileCode 
     * @returns 
     */
    setDeployPointsPossibleMoves(player, tileCode) {

        const gatePoints = this._getGatePoints()

        // A player can only deploy if they don't have one deployed on a gate already
        let playerHasTileInGate = false
        for (const gate of gatePoints) {
            if (gate.hasTile() && gate.tile.ownerName == player) {
                playerHasTileInGate = true
                break
            }
        }

        if (playerHasTileInGate) return

        for (const gate of gatePoints) {
            if (!gate.hasTile()) {
                if (tileCode == GO_EMPTY) {
                    gate.addType(POSSIBLE_MOVE)
                    continue
                }

                if (gate.isType(BLACK_GATE) && tileCode == GO_WATER) {
                    gate.addType(POSSIBLE_MOVE)
                }
                else if (gate.isType(WHITE_GATE) && tileCode == GO_METAL) {
                    gate.addType(POSSIBLE_MOVE)
                }
                else if (gate.isType(YELLOW_GATE) && tileCode == GO_EARTH) {
                    gate.addType(POSSIBLE_MOVE)
                }
                else if (gate.isType(GREEN_GATE) && tileCode == GO_WOOD) {
                    gate.addType(POSSIBLE_MOVE)
                }
                else if (gate.isType(RED_GATE) && tileCode == GO_FIRE) {
                    gate.addType(POSSIBLE_MOVE)
                }
            }
        }

    }

    removePossibleMovePoints() {
        this.cells.forEach( row => {
            row.forEach( bp => bp.removeType(POSSIBLE_MOVE) )
        } )
    }

    /**
     * 
     * @param {GodaiTile} tile 
     * @param {NotationPoint} notationPoint 
     */
    placeTile(tile, notationPoint) {
        this.putTileOnPoint(tile, notationPoint);

		// Things to do after a tile is placed

        // Nothing :)
    }

    putTileOnPoint(tile, notationPoint) {
        let p = notationPoint.rowAndColumn
        let point = this.cells[p.row][p.col]
        point.putTile(tile)
    }

    /**
     * After a move is made, we need to update the tiles located in the rivers.
     * 
     * Here are the rules regarding rivers:
     * 1. Rivers flow from the North Gate to the South Gate
     * 2. Wood, Water, Fire & Empty Tiles flow one space in the river at the end of every turn;
     * except the turn where they enter a river space.
     * 3. Metal & Earth Tiles do not flow in the river spaces.
     * 4. If an Earth Tile is located in a river, it dams its flow downstream.
     * 5. If two tiles reach the end of the rivers and they occupy the same space, both tiles are captured.
     * 6. If a tile that is supposed to move is blocked by a tile that is located in the space its supposed to be in, in doesn't move.
     * 
     * @param {GodaiTileManager} tileManager In case any tiles are captured
     */
    updateRiverMoves(tileManager) {
        const rivers = this._getRiverBoardPoints().reverse()
        const westernRiver = this._getSpecificRiverBoardPoints(WESTERN_RIVER)
        const easternRiver = this._getSpecificRiverBoardPoints(EASTERN_RIVER)

        // 1. Check if a river is blocked by an Earth Tile
        // 2. Update that river and its subsecuent river spaces
        for (const riverSpaces of [westernRiver, easternRiver]) {
            let isRiverDammed = false
            for (const bp of riverSpaces) {
                if (isRiverDammed || (bp.hasTile() && bp.tile.code == GO_EARTH)) {
                    isRiverDammed = true
                    bp.addType(IS_DAMMED_RIVER)
                }
            }
        }

        // 3. Check for river crash
        // REMEMBER TILES CAN ONLY CRASH IF THEY CAN BE MOVED BY RIVERS

        if (!rivers[0].hasTile()) {
            // Get the three final river spaces to check River Crashes
            const finalRight = rivers[1]
            const finalLeft = rivers[2]

            // They can only drown if they actually move
            if ( !finalLeft.isType(IS_DAMMED_RIVER) && !finalRight.isType(IS_DAMMED_RIVER)
                && finalLeft.hasTile() && finalRight.hasTile() ) {
                let leftTile = finalLeft.removeTile()
                let rightTile = finalRight.removeTile()

                if ( canTileBeMovedByRiver(leftTile) && canTileBeMovedByRiver(rightTile) ) {
                    for (const tile of [leftTile, rightTile]) {
                        let capturee = tile.ownerName == HOST ? GUEST : HOST
                        tileManager.addToCapturedTiles(tile, capturee)
                    }
                }
                else {
                    // Put them back!
                    finalLeft.putTile(leftTile)
                    finalRight.putTile(rightTile)
                }
            }
        }

        // 4. Finally, check every river space and move its tile, if any
        rivers.forEach( bp => this._moveTileOfRiver(bp) )

        // 5. Also reset any dammed rivers
        rivers.forEach( bp => bp.removeType(IS_DAMMED_RIVER) )

    }

    /**
     * Util function that will move the tile located in `bp` to its appropiate direction
     * as long as it isn't blocked or anything weird happens
     * @param {GodaiBoardPoint} bp WuxingBoardPoints that is garuanteed to be a river
     */
    _moveTileOfRiver(bp) {
        if (!bp.hasTile()) return // Can't do nothing here

        if (bp.isType(IS_DAMMED_RIVER)) return // No water to move tiles here

        if ( !canTileBeMovedByRiver(bp.tile) ) return // That can't move anyway!

        if ( bp.isType(RIVER_DL_TILE) ) {
            // Down left movement
            let endPoint = this.cells[bp.row+1][bp.col-1]
            if (!endPoint.hasTile()) {
                let tile = bp.removeTile()
                endPoint.putTile(tile)
            }
        }
        else if ( bp.isType(RIVER_DR_TILE) ) {
            // Down right movement
            let endPoint = this.cells[bp.row+1][bp.col+1]
            if (!endPoint.hasTile()) {
                let tile = bp.removeTile()
                endPoint.putTile(tile)
            }
        }
    }

    /**
     * Checks whether a player has won, and adds it as a winner and the reason why.
     * @param {GodaiTileManager} tileManager Contains all the tiles neccesary to check if a player has won
     */
    checkForEndGame(tileManager) {
        if (this.winners.length > 0) {
            return
        }

        if ( hasPlayerWonFromMainCondition(tileManager.capturedHostTiles) ) {
            this.winners.push(HOST)
            this.winnerReason = " has captured all captured one of each of the opponent's tiles!"
        }
        else if ( hasPlayerWonFromMainCondition(tileManager.capturedGuestTiles) ) {
            this.winners.push(GUEST)
            this.winnerReason = " has captured all captured one of each of the opponent's tiles!"
        }
        else if ( hasPlayerWonFromAltCondition(this, tileManager, HOST) ) {
            this.winners.push(HOST)
            this.winnerReason = " has prevented their opponent from winning!"
        }
        else if ( hasPlayerWonFromAltCondition(this, tileManager, GUEST) ) {
            this.winners.push(GUEST)
            this.winnerReason = " has prevented their opponent from winning!"
        }
    }

    /**
     * Gets the board points with the type `RIVER_TILE` that are located in the board.
     * Starting from top to bottom, left to right
     * @returns {Array<GodaiBoardPoint>} Array of river spaces
     */
    _getRiverBoardPoints() {
        let boardPoints = []

        for (const row of this.cells) {
            for (const bp of row) {
                if ( !bp.isType(NON_PLAYABLE) && bp.isType(RIVER_TILE)) {
                    boardPoints.push(bp)
                }
            }
        }

        return boardPoints
    }

    /**
     * @param {string} riverName WESTERN_RIVER or EASTERN_RIVER
     * @returns {Array<GodaiBoardPoint>} Western or Eastern river spaces
     */
    _getSpecificRiverBoardPoints(riverName) {
        let boardPoints = []

        for (const row of this.cells) {
            for (const bp of row) {
                if ( !bp.isType(NON_PLAYABLE) && bp.isType(RIVER_TILE) && bp.isType(riverName)) {
                    boardPoints.push(bp)
                }
            }
        }

        return boardPoints
    }

    /**
     * 
     * @param {RowAndColumn} rowAndCol 
     * @returns {Array<RowAndColumn>}
     */
    getSorroundingRowAndCols(rowAndCol) {
        let rowAndCols = [];
	    for (let row = rowAndCol.row - 1; row <= rowAndCol.row + 1; row++) {
	    	for (let col = rowAndCol.col - 1; col <= rowAndCol.col + 1; col++) {
	    		if ((row !== rowAndCol.row || col !== rowAndCol.col)	// Not the center given point
	    			&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) {	// Not outside range of the grid
	    			let boardPoint = this.cells[row][col];
	    			if (!boardPoint.isType(NON_PLAYABLE)) {	// Not non-playable
	    				rowAndCols.push(new RowAndColumn(row, col));
	    			}
	    		}
	    	}
	    }
	    return rowAndCols;
    }

    /**
     * 
     * @param {GodaiBoardPoint} initialBoardPoint 
     * @returns {Array<GodaiBoardPoint>}
     */
    getSurroundingBoardPoints(initialBoardPoint) {
		var surroundingPoints = [];
		for (var row = initialBoardPoint.row - 1; row <= initialBoardPoint.row + 1; row++) {
			for (var col = initialBoardPoint.col - 1; col <= initialBoardPoint.col + 1; col++) {
				if ((row !== initialBoardPoint.row || col !== initialBoardPoint.col) // Not the center given point
					&& (row >= 0 && col >= 0) && (row < 17 && col < 17)) { // Not outside range of the grid
					var boardPoint = this.cells[row][col];
					if (!boardPoint.isType(NON_PLAYABLE)) { // Not non-playable
						surroundingPoints.push(boardPoint);
					}
				}
			}
		}
		return surroundingPoints;
	}

    getTilesOnBoard() {
        let tiles = []

        for (const row of this.cells) {
            for (const bp of row) {
                if ( !bp.isType(NON_PLAYABLE) && bp.hasTile()) {
                    tiles.push(bp.tile)
                }
            }
        }

        return tiles
    }
}