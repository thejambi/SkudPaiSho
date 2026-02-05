// Paiko Tile Manager
// Manages tile reserves, hands, and discard piles

import { GUEST, HOST } from '../CommonNotationObjects';
import { PaikoTile, getAllTileCodes, getTileCode } from './PaikoTile';

export class PaikoTileManager {
	constructor() {
		// Tile reserves - what's available to draw from
		this.hostReserve = [];
		this.guestReserve = [];

		// Player hands - tiles ready to deploy
		this.hostHand = [];
		this.guestHand = [];

		// Discard piles - captured tiles
		this.hostDiscard = [];
		this.guestDiscard = [];

		this.initializeReserves();
	}

	// Initialize reserves with 3 of each tile type (8 types = 24 tiles per player)
	initializeReserves() {
		const tileCodes = getAllTileCodes();

		tileCodes.forEach(code => {
			for (let i = 0; i < 3; i++) {
				this.hostReserve.push(new PaikoTile(code, 'H'));
				this.guestReserve.push(new PaikoTile(code, 'G'));
			}
		});
	}

	getReserve(player) {
		return player === HOST ? this.hostReserve : this.guestReserve;
	}

	getHand(player) {
		return player === HOST ? this.hostHand : this.guestHand;
	}

	getDiscard(player) {
		return player === HOST ? this.hostDiscard : this.guestDiscard;
	}

	// Get tiles of a specific type from reserve
	getTilesOfTypeFromReserve(player, tileCode) {
		const code = getTileCode(tileCode); // Normalize code (handles both names and codes)
		const reserve = this.getReserve(player);
		return reserve.filter(tile => tile.code === code);
	}

	// Get count of specific tile type in reserve
	getReserveTileCount(player, tileCode) {
		return this.getTilesOfTypeFromReserve(player, tileCode).length;
	}

	// Draw a specific tile from reserve into hand
	drawTileFromReserve(player, tileCode) {
		const code = getTileCode(tileCode); // Normalize code (handles both names and codes)
		const reserve = this.getReserve(player);
		const hand = this.getHand(player);

		const index = reserve.findIndex(tile => tile.code === code);
		if (index !== -1) {
			const tile = reserve.splice(index, 1)[0];
			hand.push(tile);
			return tile;
		}
		return null;
	}

	// Get a tile from hand for deployment
	getTileFromHand(player, tileCode) {
		const code = getTileCode(tileCode); // Normalize code (handles both names and codes)
		const hand = this.getHand(player);
		const index = hand.findIndex(tile => tile.code === code);
		if (index !== -1) {
			return hand.splice(index, 1)[0];
		}
		return null;
	}

	// Check if player has tile in hand
	hasTileInHand(player, tileCode) {
		const code = getTileCode(tileCode); // Normalize code (handles both names and codes)
		const hand = this.getHand(player);
		return hand.some(tile => tile.code === code);
	}

	// Get count of specific tile type in hand
	getHandTileCount(player, tileCode) {
		const code = getTileCode(tileCode); // Normalize code (handles both names and codes)
		const hand = this.getHand(player);
		return hand.filter(tile => tile.code === code).length;
	}

	// Add captured tile to discard
	addToDiscard(player, tile) {
		const discard = this.getDiscard(player);
		discard.push(tile);
	}

	// Return a tile to hand (e.g., if move is cancelled)
	returnTileToHand(player, tile) {
		const hand = this.getHand(player);
		hand.push(tile);
	}

	// Get total hand size
	getHandSize(player) {
		return this.getHand(player).length;
	}

	// Get total reserve size
	getReserveSize(player) {
		return this.getReserve(player).length;
	}

	// Check if reserve is empty
	isReserveEmpty(player) {
		return this.getReserveSize(player) === 0;
	}

	// Get available tile types from reserve (those with at least 1 remaining)
	getAvailableTileTypes(player) {
		const reserve = this.getReserve(player);
		const available = new Set();
		reserve.forEach(tile => available.add(tile.code));
		return Array.from(available);
	}

	// Get available tile types from hand
	getAvailableTileTypesInHand(player) {
		const hand = this.getHand(player);
		const available = new Set();
		hand.forEach(tile => available.add(tile.code));
		return Array.from(available);
	}

	// Get summary of reserve for display
	getReserveSummary(player) {
		const summary = {};
		const reserve = this.getReserve(player);
		reserve.forEach(tile => {
			if (!summary[tile.code]) {
				summary[tile.code] = 0;
			}
			summary[tile.code]++;
		});
		return summary;
	}

	// Clear selectedFromPile flag on all tiles
	removeSelectedTileFlags() {
		this.hostHand.forEach(tile => tile.selectedFromPile = false);
		this.guestHand.forEach(tile => tile.selectedFromPile = false);
		this.hostReserve.forEach(tile => tile.selectedFromPile = false);
		this.guestReserve.forEach(tile => tile.selectedFromPile = false);
	}

	// Get summary of hand for display
	getHandSummary(player) {
		const summary = {};
		const hand = this.getHand(player);
		hand.forEach(tile => {
			if (!summary[tile.code]) {
				summary[tile.code] = 0;
			}
			summary[tile.code]++;
		});
		return summary;
	}

	// Create a deep copy
	getCopy() {
		const copy = new PaikoTileManager();

		// Clear default initialization
		copy.hostReserve = [];
		copy.guestReserve = [];
		copy.hostHand = [];
		copy.guestHand = [];
		copy.hostDiscard = [];
		copy.guestDiscard = [];

		// Copy reserves
		this.hostReserve.forEach(tile => copy.hostReserve.push(tile.getCopy()));
		this.guestReserve.forEach(tile => copy.guestReserve.push(tile.getCopy()));

		// Copy hands
		this.hostHand.forEach(tile => copy.hostHand.push(tile.getCopy()));
		this.guestHand.forEach(tile => copy.guestHand.push(tile.getCopy()));

		// Copy discards
		this.hostDiscard.forEach(tile => copy.hostDiscard.push(tile.getCopy()));
		this.guestDiscard.forEach(tile => copy.guestDiscard.push(tile.getCopy()));

		return copy;
	}
}
