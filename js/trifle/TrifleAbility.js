import { TrifleAbilityManager } from './TrifleAbilityManager';
import { arrayIntersection, debug } from '../GameData';
import { TrifleBrainFactory } from './brains/BrainFactory';
import { TrifleTile } from './TrifleTile';

export class TrifleAbility {
	constructor(abilityContext) {
		this.board = abilityContext.board;
		this.abilityType = abilityContext.tileAbilityInfo.type;
		this.abilityInfo = abilityContext.tileAbilityInfo;
		this.sourceTile = abilityContext.tile;
		this.sourceTileInfo = abilityContext.tileInfo;
		this.sourceTilePoint = abilityContext.pointWithTile;
		this.triggerBrainMap = abilityContext.triggerBrainMap;
		this.promptTargetInfo = abilityContext.promptTargetInfo;
		this.lastTurnAction = abilityContext.lastTurnAction;

		this.triggerTargetTiles = [];
		this.triggerTargetTilePoints = [];
		this.setTriggerTargetTiles();

		this.abilityTargetTiles = [];
		this.abilityTargetTilePoints = [];
		// this.setAbilityTargetTiles();	// This happens during activation now

		this.abilityBrain = TrifleBrainFactory.createAbilityBrain(this.abilityType, this);
		// this.abilityTargetTiles = this.abilityBrain.getTargetTiles();
		// this.abilityTargetTilePoints = this.abilityBrain.getTargetTilePoints();

		this.boardChanged = false;
		this.activated = false;
	}

	hasNeededPromptTargetInfo() {
		let hasPromptInfo = true;
		const neededPromptTargetsInfo = this.abilityInfo.neededPromptTargetsInfo;
		if (neededPromptTargetsInfo && neededPromptTargetsInfo.length >= 1) {
			// Figure out what prompt targets are needed...
			neededPromptTargetsInfo.forEach((neededPromptTargetInfo) => {
				debug(neededPromptTargetInfo);
				if (!this.promptTargetInfoPresent(neededPromptTargetInfo)) {
					debug("Need to prompt");
					hasPromptInfo = false;
				}
			});
		}

		return hasPromptInfo;
	}

	worthy() {
		return !this.abilityInfo.neededPromptTargetsInfo
			|| (this.abilityInfo.neededPromptTargetsInfo
			&& this.promptTargetsExist());
	}

	promptTargetInfoPresent(neededPromptTargetInfo) {
		const sourceTileKey = JSON.stringify(TrifleAbilityManager.buildSourceTileKeyObject(this.sourceTile));

		debug(">>> promptTargetInfoPresent: looking for key=" + sourceTileKey);
		debug(">>> promptTargetInfo exists=" + !!this.promptTargetInfo);
		if (this.promptTargetInfo) {
			debug(">>> promptTargetInfo keys=" + JSON.stringify(Object.keys(this.promptTargetInfo)));
		}

		return this.promptTargetInfo
			&& this.promptTargetInfo[sourceTileKey]
			&& (this.promptTargetInfo[sourceTileKey].skipped
				|| this.promptTargetInfo[sourceTileKey][neededPromptTargetInfo.promptId]);
	}

	promptTargetsExist() {
		let promptTargetsExist = false;

		const neededPromptInfo = {};

		neededPromptInfo.abilitySourceTile = this.sourceTile;
		neededPromptInfo.sourceAbility = this;
		neededPromptInfo.sourceTileKey = TrifleAbilityManager.buildSourceTileKeyObject(this.sourceTile);
		const sourceTileKeyStr = JSON.stringify(neededPromptInfo.sourceTileKey);

		const nextNeededPromptTargetInfo = this.abilityInfo.neededPromptTargetsInfo[0];

		if (nextNeededPromptTargetInfo) {
			const abilityBrain = TrifleBrainFactory.createAbilityBrain(this.abilityType, this);
			promptTargetsExist = abilityBrain.promptForTarget(nextNeededPromptTargetInfo, sourceTileKeyStr, true);
		}

		return promptTargetsExist;
	}

	setAbilityTargetTiles() {
		this.targetBrains = [];

		this.abilityTargetTiles = [];
		this.abilityTargetTilePoints = [];

		if (this.abilityInfo.targetTypes && this.abilityInfo.targetTypes.length) {
			this.abilityInfo.targetTypes.forEach((targetType) => {
				const targetBrain = TrifleBrainFactory.createTargetBrain(targetType, this);

				this.targetBrains.push(targetBrain);

				this.abilityTargetTiles = this.abilityTargetTiles.concat(targetBrain.targetTiles);
				this.abilityTargetTilePoints = this.abilityTargetTilePoints.concat(targetBrain.targetTilePoints);
			});
		} else {
			debug("--- TILE ABILITY DOES NOT HAVE TARGET TYPES---");
			debug(this.sourceTile);
		}

		// TODO all this ^^^^^
	}

	activateAbility() {
		debug("Activating ability: " + this.abilityInfo.type + " from " + this.sourceTile.ownerCode + this.sourceTile.code);

		// If ability has an activation delay, don't activate yet - just set up the delay
		if (this.hasActivationDelay()) {
			this.remainingDelay = this.abilityInfo.activationDelay;
			this.pendingActivation = true;
			debug("Ability has activation delay: " + this.remainingDelay);
		} else {
			this.doActivate();
		}
	}

	doActivate() {
		this.setAbilityTargetTiles();

		if (this.abilityTargetTiles.length > 0) {	// Ability must have target tile?
			this.abilityActivatedResults = this.abilityBrain.activateAbility();
			this.activated = true;
			this.pendingActivation = false;

			// Initialize duration tracking if ability has duration
			if (this.abilityInfo.duration && this.abilityInfo.duration > 0) {
				this.remainingDuration = this.abilityInfo.duration;
				debug("Ability has duration: " + this.remainingDuration);
			}
		}
	}

	activateDelayedAbility() {
		debug("Delayed ability now activating: " + this.abilityInfo.type + " from " + this.sourceTile.ownerCode + this.sourceTile.code);
		this.doActivate();
	}

	hasActivationDelay() {
		return this.abilityInfo.activationDelay && this.abilityInfo.activationDelay > 0;
	}

	tickDelay() {
		if (this.remainingDelay !== undefined) {
			this.remainingDelay -= 0.5;
			debug("Ability delay ticked, remaining: " + this.remainingDelay);
			return this.remainingDelay <= 0;
		}
		return false;
	}

	hasDuration() {
		return this.abilityInfo.duration && this.abilityInfo.duration > 0;
	}

	tickDuration() {
		if (this.remainingDuration !== undefined) {
			// Decrement by 0.5 because each player's move is a "half turn"
			// duration: 1 means "opponent's next turn" = 2 ticks (your move end + opponent move end)
			this.remainingDuration -= 0.5;
			debug("Ability duration ticked, remaining: " + this.remainingDuration);
			return this.remainingDuration <= 0;
		}
		return false;
	}

	isDurationExpired() {
		return this.remainingDuration !== undefined && this.remainingDuration <= 0;
	}

	deactivate() {
		// What needed to do?
		this.activated = false;
	}

	boardChangedAfterActivation() {
		return this.boardChanged;
	}

	setTriggerTargetTiles() {
		this.triggerTargetTiles = null;

		Object.values(this.triggerBrainMap).forEach((triggerBrain) => {
			if (triggerBrain.targetTiles && triggerBrain.targetTiles.length) {
				// TODO split tiles vs points?
				if (this.triggerTargetTiles === null) {
					this.triggerTargetTiles = triggerBrain.targetTiles;
					this.triggerTargetTilePoints = triggerBrain.targetTilePoints;
				} else {
					this.triggerTargetTiles = arrayIntersection(this.triggerTargetTiles, triggerBrain.targetTiles);
					this.triggerTargetTilePoints = arrayIntersection(this.triggerTargetTilePoints, triggerBrain.targetTilePoints);
				}
			}
		});

		if (!this.triggerTargetTiles) {
			this.triggerTargetTiles = [];
		}
	}

	getTriggerTypeTargets(triggerType) {
		let targetTiles = [];
		let targetTilePoints = [];

		const triggerBrain = this.triggerBrainMap[triggerType];

		if (triggerBrain && triggerBrain.targetTiles && triggerBrain.targetTiles.length) {
			targetTiles = triggerBrain.targetTiles;
			targetTilePoints = triggerBrain.targetTilePoints;
		}

		return {
			targetTiles: targetTiles,
			targetTilePoints: targetTilePoints
		};
	}

	appearsToBeTheSameAs(otherAbility) {
		if (!otherAbility
			|| this.abilityType !== otherAbility.abilityType
			|| this.sourceTile.id !== otherAbility.sourceTile.id
			|| this.sourceTilePoint !== otherAbility.sourceTilePoint) {
			return false;
		}

		// Compare ability definitions to distinguish abilities of the same type
		// with different configurations (e.g., two restrictTileFromCapturing with
		// different triggers or restricted tile types)
		if (!this.abilityInfoMatches(otherAbility.abilityInfo)) {
			return false;
		}

		// If ability has triggerTypeToTarget, compare targets from that specific trigger
		// This is necessary because triggerTargetTiles is the intersection of ALL trigger targets,
		// which can be empty when triggers have non-overlapping purposes (e.g., one for targeting,
		// one for conditions like "while outside temple")
		if (this.abilityInfo.triggerTypeToTarget) {
			const thisTargets = this.getTriggerTypeTargets(this.abilityInfo.triggerTypeToTarget);
			const otherTargets = otherAbility.getTriggerTypeTargets(this.abilityInfo.triggerTypeToTarget);
			return thisTargets.targetTiles.equals(otherTargets.targetTiles)
				&& thisTargets.targetTilePoints.equals(otherTargets.targetTilePoints);
		}

		// Otherwise, fall back to comparing the intersection (triggerTargetTiles)
		return this.triggerTargetTiles.equals(otherAbility.triggerTargetTiles)
			&& this.triggerTargetTilePoints.equals(otherAbility.triggerTargetTilePoints);
	}

	abilityInfoMatches(otherAbilityInfo) {
		/* Ability records hold their config entry from the shared tile metadata by
		   reference (tileInfo.abilities[i]), so two records describe the same ability
		   exactly when they hold the same config object. Reference identity also
		   distinguishes distinct config entries with identical content, which
		   serialization-based comparison wrongly deduped. */
		return this.abilityInfo === otherAbilityInfo;
	}

	abilityTargetsTile(tile) {
		return this.abilityTargetTiles.includes(tile);
	}

	isPriority(priorityLevel) {
		return this.abilityInfo.priority === priorityLevel;
	}

	getTitle() {
		if (this.abilityInfo.title) {
			return this.abilityInfo.title;
		} else {
			return this.abilityInfo.type;
		}
	}

	getNeededPromptTargetInfo(promptTargetId) {
		let matchingPromptTargetInfo;
		if (this.abilityInfo.neededPromptTargetsInfo && this.abilityInfo.neededPromptTargetsInfo.length) {
			this.abilityInfo.neededPromptTargetsInfo.forEach((promptTargetInfo) => {
				if (promptTargetInfo.promptId === promptTargetId) {
					matchingPromptTargetInfo = promptTargetInfo;
				}
			});
		}
		return matchingPromptTargetInfo;
	}

	getSummaryLines() {
		const lines = [];
		let abilityTitle = this.abilityType;
		if (this.abilityInfo.title) {
			abilityTitle = this.abilityInfo.title;
		}
		lines.push("=== " + abilityTitle + " ===");
		lines.push("- Source Tile: " + this.sourceTile.ownerName + " " + TrifleTile.getTileName(this.sourceTile.code));
		const targetTileNames = [];
		this.abilityTargetTiles.forEach((abilityTargetTile) => {
			targetTileNames.push(" " + abilityTargetTile.ownerName + " " + TrifleTile.getTileName(abilityTargetTile.code));
		});
		lines.push("- Target Tiles:" + targetTileNames);

		return lines;
	}

	triggerStillMet() {
		const triggers = this.abilityInfo.triggers;
		if (triggers && triggers.length
				&& this.sourceTilePoint.tile === this.sourceTile) {
			let allTriggerConditionsMet = true;

			triggers.forEach(triggerInfo => {
				debug("Trigger type: " + triggerInfo.triggerType);
				const triggerBrain = this.triggerBrainMap[triggerInfo.triggerType];
				allTriggerConditionsMet = allTriggerConditionsMet && triggerBrain.isTriggerMet();
				debug("allTriggerConditionsMet: " + allTriggerConditionsMet);
			});
			return allTriggerConditionsMet;
		}
		debug("Returning false");
		return false;
	}

	/**
	 * Clone this ability record for a copied board (see PaiShoGameBoard.getCopy),
	 * remapping tile and point references to the copy's objects so ongoing effects
	 * (immobilize, protect from capture, movement restrictions, etc.) constrain the
	 * copy exactly like the original before its first processAbilities run.
	 *
	 * Returns null when the source tile is no longer on the copied board (e.g. a
	 * when-captured ability record) — such a record's effect is already reflected
	 * in the copied board state.
	 *
	 * The clone carries no trigger brains; the next processAbilities run on the copy
	 * re-evaluates triggers fresh, the same as it would on the original board.
	 */
	cloneForBoardCopy(copyBoard, copyTilesById) {
		const sourceTile = copyTilesById[this.sourceTile.id];
		if (!sourceTile) {
			return null;
		}

		const mapPoint = (point) => (point && point.row !== undefined)
			? copyBoard.cells[point.row][point.col]
			: point;
		const mapTiles = (tiles) => tiles
			? tiles.map((tile) => copyTilesById[tile.id]).filter((tile) => tile)
			: [];

		const clone = Object.create(TrifleAbility.prototype);
		clone.board = copyBoard;
		clone.abilityType = this.abilityType;
		clone.abilityInfo = this.abilityInfo;
		clone.sourceTile = sourceTile;
		clone.sourceTileInfo = this.sourceTileInfo;
		clone.sourceTilePoint = mapPoint(this.sourceTilePoint);
		clone.triggerBrainMap = {};
		clone.promptTargetInfo = this.promptTargetInfo;
		clone.lastTurnAction = null;

		clone.triggerTargetTiles = mapTiles(this.triggerTargetTiles);
		clone.triggerTargetTilePoints = (this.triggerTargetTilePoints || []).map(mapPoint);
		clone.abilityTargetTiles = mapTiles(this.abilityTargetTiles);
		clone.abilityTargetTilePoints = (this.abilityTargetTilePoints || []).map(mapPoint);

		clone.abilityBrain = TrifleBrainFactory.createAbilityBrain(this.abilityType, clone);

		clone.boardChanged = false;
		clone.activated = this.activated;
		clone.pendingActivation = this.pendingActivation;
		clone.remainingDuration = this.remainingDuration;
		clone.remainingDelay = this.remainingDelay;

		return clone;
	}

	getTriggeringActions() {
		const allTriggeringActions = [];

		Object.values(this.triggerBrainMap).forEach(triggerBrain => {
			if (triggerBrain.triggeringAction) {
				allTriggeringActions.push(triggerBrain.triggeringAction);
			}
		});

		return allTriggeringActions;
	}
}

export default TrifleAbility;
