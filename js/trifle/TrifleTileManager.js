// Tile Manager

import { GUEST, HOST } from '../CommonNotationObjects';
import { debug } from '../GameData';
import { TrifleTile } from './TrifleTile';
import { TrifleTiles } from './TrifleTileInfo';
import { TrifleTileType } from './TrifleTiles';

const STANDARD = "Standard";
const RESTRICTED_BY_OPPONENT_TILE_ZONE = "Restricted by opponent tile zone";

export class TrifleTileManager {
	constructor() {
		this.hostTeam = [];
		this.guestTeam = [];
		this.hostTiles = [];
		this.guestTiles = [];
		this.capturedTiles = [];
	}

	addToCapturedTiles(tiles) {
		tiles.forEach((tile) => {
			if ((tile.beingCaptured || tile.beingCapturedByAbility) && !tile.moveToPile) {
				this.capturedTiles.push(tile);
			}
			tile.beingCaptured = null;
			tile.beingCapturedByAbility = null;
		});
	}

	grabCapturedTile(player, tileCode) {
		let tile;
		for (let i = 0; i < this.capturedTiles.length; i++) {
			if (this.capturedTiles[i].ownerName === player
					&& this.capturedTiles[i].code === tileCode) {
				const newTileArr = this.capturedTiles.splice(i, 1);
				tile = newTileArr[0];
				break;
			}
		}

		if (!tile) {
			debug("NONE OF THAT TILE FOUND IN CAPTURED TILES");
		}

		return tile;
	}

	grabTile(player, tileCode) {
		let tilePile = this.hostTiles;
		if (player === GUEST) {
			tilePile = this.guestTiles;
		}

		let tile;
		for (let i = 0; i < tilePile.length; i++) {
			if (tilePile[i].code === tileCode) {
				const newTileArr = tilePile.splice(i, 1);
				tile = newTileArr[0];
				break;
			}
		}

		if (!tile) {
			debug("NONE OF THAT TILE FOUND");
		}

		return tile;
	}

	peekTile(player, tileCode, tileId) {
		let tilePile = this.hostTiles;
		if (player === GUEST) {
			tilePile = this.guestTiles;
		}

		let tile;
		if (tileId) {
			for (let i = 0; i < tilePile.length; i++) {
				if (tilePile[i].id === tileId) {
					return tilePile[i];
				}
			}
		}

		for (let i = 0; i < tilePile.length; i++) {
			if (tilePile[i].code === tileCode) {
				tile = tilePile[i];
				break;
			}
		}

		if (!tile) {
			this.capturedTiles.forEach((capturedTile) => {
				if (tileId && capturedTile.id === tileId) {
					tile = capturedTile;
				} else if (!tile && capturedTile.code === tileCode && capturedTile.ownerName === player) {
					tile = capturedTile;
				}
			});
		}

		if (!tile) {
			debug("NONE OF THAT TILE FOUND");
		}

		return tile;
	}

	removeSelectedTileFlags() {
		this.hostTiles.forEach(tile => {
			tile.selectedFromPile = false;
		});
		this.guestTiles.forEach(tile => {
			tile.selectedFromPile = false;
		});
		this.capturedTiles.forEach(tile => {
			tile.selectedFromPile = false;
			tile.tileIsSelectable = false;
		});
	}

	unselectTiles(player) {
		const tilePile = this.getPlayerTilePile(player);

		tilePile.forEach(tile => {
			tile.selectedFromPile = false;
		});
	}

	putTileBack(tile) {
		const player = tile.ownerName;
		const tilePile = this.getPlayerTilePile(player);

		tilePile.push(tile);
	}

	getTeamSize() {
		return 11;
	}

	hostTeamIsFull() {
		return this.playerTeamIsFull(HOST);
	}

	guestTeamIsFull() {
		return this.playerTeamIsFull(GUEST);
	}

	playerTeamIsFull(player) {
		return this.getPlayerTeam(player).length >= this.getTeamSize();
	}

	playersAreSelectingTeams() {
		return !this.hostTeamIsFull() || !this.guestTeamIsFull();
	}

	playerTeamHasBanner(player) {
		const team = this.getPlayerTeam(player);
		for (let i = 0; i < team.length; i++) {
			const tileInfo = TrifleTiles[team[i].code];
			if (tileInfo && this.tileInfoIsBanner(tileInfo)) {
				return true;
			}
		}
		return false;
	}

	tileInfoIsBanner(tileInfo) {
		return tileInfo && tileInfo.types.includes(TrifleTileType.banner);
	}

	addToTeamIfOk(tile) {
		let addOk = false;
		const player = tile.ownerName;
		if (!this.playerTeamIsFull(player)) {
			/* Team isn't full, that's the first check! */
			addOk = true;	// So far!

			const tileInfo = TrifleTiles[tile.code];
			/* If tile is Banner, it's ok if we don't have one */
			if (this.tileInfoIsBanner(tileInfo)) {
				addOk = addOk && !this.playerTeamHasBanner(player);
			} else {
				/* If tile is not banner, we just need to make sure we have room on the team for one or have one already */
				addOk = addOk && (this.playerTeamHasBanner(player)
						|| this.getPlayerTeam(player).length < this.getTeamSize() - 1);
			}

			const howManyAlreadyInTeam = this.countOfThisTileInTeam(tile.code, tile.ownerName);
			addOk = addOk && howManyAlreadyInTeam < TrifleTile.getTeamLimitForTile(tile.code);

			if (addOk) {
				this.getPlayerTeam(tile.ownerName).push(tile);
				this.getPlayerTilePile(tile.ownerName).push(tile);
			}
		}

		return addOk;
	}

	removeTileFromTeam(tile) {
		if (this.countOfThisTileInTeam(tile.code, tile.ownerName) > 0) {
			const playerTeam = this.getPlayerTeam(tile.ownerName);

			for (let i = 0; i < playerTeam.length; i++) {
				if (playerTeam[i].code === tile.code) {
					playerTeam.splice(i, 1);
					break;
				}
			}

			this.grabTile(tile.ownerName, tile.code);
		}
	}

	countOfThisTileInTeam(tileCode, ownerName) {
		let count = 0;
		const ownerTeam = this.getPlayerTeam(ownerName);

		for (let i = 0; i < ownerTeam.length; i++) {
			if (ownerTeam[i].code === tileCode) {
				count++;
			}
		}
		return count;
	}

	getPlayerTeam(player) {
		let playerTeam = this.hostTeam;
		if (player === GUEST) {
			playerTeam = this.guestTeam;
		}
		return playerTeam;
	}

	getPlayerTilePile(player) {
		let tilePile = this.hostTiles;
		if (player === GUEST) {
			tilePile = this.guestTiles;
		}
		return tilePile;
	}

	getAllTiles() {
		return this.hostTeam.concat(this.guestTeam);
	}

	getCopy() {
		const copy = new TrifleTileManager();

		// Copy teams
		this.hostTeam.forEach(tile => {
			copy.hostTeam.push(tile.getCopy());
		});
		this.guestTeam.forEach(tile => {
			copy.guestTeam.push(tile.getCopy());
		});

		// Copy tile piles
		this.hostTiles.forEach(tile => {
			copy.hostTiles.push(tile.getCopy());
		});
		this.guestTiles.forEach(tile => {
			copy.guestTiles.push(tile.getCopy());
		});

		// Copy captured tiles
		this.capturedTiles.forEach(tile => {
			copy.capturedTiles.push(tile.getCopy());
		});

		return copy;
	}
}

export default TrifleTileManager;
