/**
 * Trifle Animation Types
 *
 * Data structures for ability-triggered animations that flow from
 * AbilityBrains through the activation pipeline to the Actuator.
 */

export const TrifleAnimationType = {
	SLIDE: 'slide',           // Tile moves from point A to point B
	POP: 'pop',               // Tile appears with scale effect
	FADE_OUT: 'fadeOut',      // Tile fades and disappears (capture)
	FADE_IN: 'fadeIn',        // Tile fades in (resurrection)
	SWAP: 'swap',             // Two tiles exchange positions
	PULSE: 'pulse'            // Visual indicator (ability activation)
};

/**
 * Animation instruction data structure.
 * Represents a single animation to be executed by the Actuator.
 */
export class TrifleAnimationInstruction {
	constructor(type, options = {}) {
		this.type = type;
		this.tile = options.tile || null;             // The tile being animated
		this.tileId = options.tileId || null;         // Tile ID for element lookup
		this.startPoint = options.startPoint || null; // {row, col}
		this.endPoint = options.endPoint || null;     // {row, col}
		this.duration = options.duration || 1000;     // ms, default matches pieceAnimationLength
		this.delay = options.delay || 0;              // ms before starting
		this.easing = options.easing || 'ease-out';
		this.priority = options.priority || 0;        // Lower = earlier in sequence
		this.parallel = options.parallel || false;    // Can run alongside previous animation?
		this.abilitySource = options.abilitySource || null; // Source ability for debugging
		this.startsAtMoveTime = options.startsAtMoveTime || false; // Start at time 0 with primary move
		this.color = options.color || null;               // Color for pulse glow (e.g., '#ff6600')
	}
}

/**
 * Container for multiple animation instructions from abilities.
 * Handles sequencing, timing, and priority ordering.
 */
export class TrifleAnimationSequence {
	constructor() {
		this.animations = [];
		this.totalDuration = 0;
	}

	/**
	 * Add an animation instruction to the sequence.
	 */
	add(instruction) {
		this.animations.push(instruction);
		this.recalculateDuration();
		return this;
	}

	/**
	 * Merge another sequence's animations into this one.
	 */
	merge(otherSequence) {
		if (otherSequence && otherSequence.animations) {
			otherSequence.animations.forEach(anim => {
				this.animations.push(anim);
			});
			this.recalculateDuration();
		}
		return this;
	}

	/**
	 * Calculate total duration accounting for parallel animations.
	 */
	recalculateDuration() {
		let maxEndTime = 0;
		let currentTime = 0;

		this.animations.forEach((anim, index) => {
			const startTime = anim.parallel && index > 0
				? currentTime
				: currentTime;
			const endTime = startTime + anim.delay + anim.duration;
			maxEndTime = Math.max(maxEndTime, endTime);
			if (!anim.parallel) {
				currentTime = endTime;
			}
		});

		this.totalDuration = maxEndTime;
	}

	/**
	 * Sort animations by priority (lower priority number = earlier execution).
	 */
	sort() {
		this.animations.sort((a, b) => a.priority - b.priority);
		return this;
	}

	/**
	 * Check if sequence has any animations.
	 */
	hasAnimations() {
		return this.animations.length > 0;
	}
}
