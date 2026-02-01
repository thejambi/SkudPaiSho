import { debug } from '../../../GameData';
import { NON_PLAYABLE } from '../../../skud-pai-sho/SkudPaiShoBoardPoint';

export function TrifleMoveTileToRecordedPointAbilityBrain(abilityObject) {
	this.abilityObject = abilityObject;
}

TrifleMoveTileToRecordedPointAbilityBrain.prototype.activateAbility = function() {
    var targetTilePoint = this.abilityObject.abilityTargetTilePoints[0];
    var targetTile = this.abilityObject.abilityTargetTiles[0];

    var recordedPointType = this.abilityObject.abilityInfo.recordedPointType;

    if (recordedPointType) {
        var board = this.abilityObject.board;
        var destinationNotationPoint = board.recordedTilePoints[recordedPointType][targetTile.getOwnerCodeIdObjectString()];
        var destinationBoardPoint = board.getPointFromNotationPoint(destinationNotationPoint);

        // If destination occupied, move the occupant to any open surrounding space (or first open board point).
        if (destinationBoardPoint && destinationBoardPoint.hasTile()) {
            var occupyingTile = destinationBoardPoint.removeTile();

            var placed = false;
            // Try immediate surrounding points first
            var surrounding = board.getSurroundingBoardPoints(destinationBoardPoint);
            for (var i = 0; i < surrounding.length && !placed; i++) {
                var sp = surrounding[i];
                if (!sp.hasTile()) {
                    sp.putTile(occupyingTile);
                    occupyingTile.seatedPoint = sp;
                    placed = true;
                }
            }

            // Fallback: scan entire board for first open playable point
            if (!placed) {
                for (var r = 0; r < board.cells.length && !placed; r++) {
                    for (var c = 0; c < board.cells[r].length && !placed; c++) {
                        var bp = board.cells[r][c];
                        if (!bp.hasTile() && !bp.isType(NON_PLAYABLE)) {
                            bp.putTile(occupyingTile);
                            occupyingTile.seatedPoint = bp;
                            placed = true;
                        }
                    }
                }
            }

            // Last resort: restore to original destination (so we don't drop the tile)
            if (!placed) {
                destinationBoardPoint.putTile(occupyingTile);
                occupyingTile.seatedPoint = destinationBoardPoint;
            }
        }

        // Now place the returning tile (this triggers ability processing as before)
        board.placeTile(targetTile, destinationNotationPoint);
        this.abilityObject.boardChanged = true;

        if (targetTile.beingCaptured || targetTile.beingCapturedByAbility) {
            targetTile.beingCaptured = null;
            targetTile.beingCapturedByAbility = null;
        }

        return {
            tileMoved: targetTile
        };
    } else {
        debug("No recorded point type defined");
    }
};
