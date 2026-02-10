// Undergrowth Simplicity Tile - Simple stone with only an owner

import { GUEST, HOST } from '../CommonNotationObjects';
import { tileIdIncrement } from '../skud-pai-sho/SkudPaiShoTile';

export function UndergrowthSimplicityTile(ownerCode) {
	this.ownerCode = ownerCode;
	if (this.ownerCode === 'G') {
		this.ownerName = GUEST;
	} else if (this.ownerCode === 'H') {
		this.ownerName = HOST;
	}
	this.id = tileIdIncrement();
	this.selectedFromPile = false;
	this.inConnection = false;
}

UndergrowthSimplicityTile.prototype.getImageName = function() {
	return this.ownerCode + "Back";
};

UndergrowthSimplicityTile.prototype.getName = function() {
	if (this.ownerName === HOST) {
		return "White Stone";
	}
	return "Black Stone";
};

UndergrowthSimplicityTile.prototype.getCopy = function() {
	var copy = new UndergrowthSimplicityTile(this.ownerCode);
	copy.inConnection = this.inConnection;
	return copy;
};
