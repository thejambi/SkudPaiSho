// Tile Manager

import { GUEST, HOST } from "../CommonNotationObjects";

import { debug } from "../GameData";
import { TrifleTile } from "../trifle/TrifleTile";
import { NickTileCodes } from "./NickTiles";

const STANDARD = "Standard";
const RESTRICTED_BY_OPPONENT_TILE_ZONE = "Restricted by opponent tile zone";

export class NickTileManager {
	constructor() {
		this.hostTiles = this.loadTileSet('H');
		this.guestTiles = this.loadTileSet('G');
		this.capturedTiles = [];
		this.customPiles = {};
	}

	loadTileSet(ownerCode) {
		const tiles = [];

		tiles.push(new TrifleTile(NickTileCodes.WhiteLotus, ownerCode));
		tiles.push(new TrifleTile(NickTileCodes.Avatar, ownerCode));
		
		for (let i = 0; i < 3; i++) {
			tiles.push(new TrifleTile(NickTileCodes.Air, ownerCode));
			tiles.push(new TrifleTile(NickTileCodes.Water, ownerCode));
			tiles.push(new TrifleTile(NickTileCodes.Earth, ownerCode));
			tiles.push(new TrifleTile(NickTileCodes.Fire, ownerCode));
		}

		return tiles;
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
			debug("NONE OF THAT TILE FOUND");
			this.capturedTiles.forEach((capturedTile) => {
				if (capturedTile.id === tileId) {
					tile = capturedTile;
					debug("Found in captured tiles.. that ok?")
				}
			});
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

	addToCapturedTiles(tiles) {
		tiles.forEach((tile) => {
			if (tile.moveToPile) {
				this.addToPile(tile, tile.moveToPile);
			} else if ((tile.beingCaptured || tile.beingCapturedByAbility) && !tile.moveToPile) {
				this.capturedTiles.push(tile);
			}
			tile.beingCaptured = null;
			tile.beingCapturedByAbility = null;
			tile.moveToPile = null;
		});
	}

	addToPile(tile, pileName) {
		if (!this.customPiles[pileName]) {
			this.customPiles[pileName] = [];
		}
		this.customPiles[pileName].push(tile);
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
		return this.hostTiles.concat(this.guestTiles);
	}

	getCopy() {
		const copy = new NickTileManager();

		// Copy tile arrays (tiles not on board)
		copy.hostTiles = [];
		for (let i = 0; i < this.hostTiles.length; i++) {
			copy.hostTiles.push(this.hostTiles[i].getCopy());
		}

		copy.guestTiles = [];
		for (let i = 0; i < this.guestTiles.length; i++) {
			copy.guestTiles.push(this.guestTiles[i].getCopy());
		}

		copy.capturedTiles = [];
		for (let i = 0; i < this.capturedTiles.length; i++) {
			copy.capturedTiles.push(this.capturedTiles[i].getCopy());
		}

		return copy;
	}
}

export default NickTileManager;
