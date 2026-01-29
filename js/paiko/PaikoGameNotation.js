// Paiko Game Notation
// Move type constants and game phase definitions
// Uses TrifleGameNotation for actual notation storage (JSON-based)

import { DEPLOY, MOVE } from '../CommonNotationObjects';

// Re-export common move types
export { DEPLOY, MOVE };

// Paiko-specific move types
export const PaikoMoveType = {
	// Setup phase - selecting initial hand
	SELECT_TILE: 'SelectTile',

	// Action phase moves (use DEPLOY and MOVE from CommonNotationObjects)
	DRAW: 'Draw',

	// Special moves
	ROTATE: 'Rotate',
	SAI_SHIFT: 'SaiShift',
	WATER_REDEPLOY: 'WaterRedeploy',

	// Capture reward - opponent chooses tiles for capturing player
	CAPTURE_REWARD: 'CaptureReward',

	// Game state
	PASS: 'Pass'
};

// Game phases
export const PaikoGamePhase = {
	// Setup phases
	HOST_SELECT_7: 'HostSelect7',
	GUEST_SELECT_9: 'GuestSelect9',
	HOST_SELECT_1: 'HostSelect1',

	// Main game
	PLAYING: 'Playing'
};
