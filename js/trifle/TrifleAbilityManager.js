// Trifle Engine - Ability Manager
// Documentation: ~/Dropbox/Programming/SkudPaiSho/TheGardenGate/backend/TGGDocumentation/Trifle/

import {
  TrifleAbilitiesForType,
  TrifleAbilityName,
  TrifleAbilityType,
  TrifleTileTeam
} from './TrifleTileInfo';
import { debug } from '../GameData';
import { TrifleBrainFactory, ConstraintCategory, getAbilityNamesForConstraintCategory } from './brains/BrainFactory';
import { TrifleAnimationSequence } from './animation/TrifleAnimationTypes';

export class TrifleAbilityManager {
	static MAX_CASCADE_DEPTH = 10;

	constructor(board, customAbilityActivationOrder) {
		this.board = board;
		this.tileManager = board.tileManager;
		this.abilities = [];
		this.readyAbilities = {};
		this.abilitiesWithPromptTargetsNeeded = {};
		this.abilityActivationOrder = customAbilityActivationOrder;
	}

	setReadyAbilities(readyAbilities) {
		this.readyAbilities = readyAbilities;
	}

	setAbilitiesWithPromptTargetsNeeded(abilitiesWithPromptTargetsNeeded) {
		this.abilitiesWithPromptTargetsNeeded = abilitiesWithPromptTargetsNeeded;
	}

	activateReadyAbilitiesOrPromptForTargets() {
		const activateObj = this.activateReadyAbilities();
		this.ensurePromptsStillNeeded();
		if (this.abilitiesWithPromptTargetsNeeded && this.abilitiesWithPromptTargetsNeeded.length > 0) {
			const promptObj = this.promptForNextNeededTargets();
			// If prompt was auto-resolved (no currentPromptTargetId), the ability was
			// removed from prompt queue. Re-run activation so it can fire.
			if (!promptObj.neededPromptInfo || !promptObj.neededPromptInfo.currentPromptTargetId) {
				const reactivateObj = this.activateReadyAbilities();
				return Object.assign(activateObj, reactivateObj);
			}
			return Object.assign(activateObj, promptObj);
		} else {
			return activateObj;
		}
	}

	ensurePromptsStillNeeded() {
		if (this.abilitiesWithPromptTargetsNeeded && this.abilitiesWithPromptTargetsNeeded.length > 0) {
			let index = 0;
			const removeThese = [];
			this.abilitiesWithPromptTargetsNeeded.forEach(ability => {
				if (this.abilityIsCanceled(ability)) {
					removeThese.push(index);
				}
				index++;
			});
			if (removeThese.length > 0) {
				for (let i = removeThese.length - 1; i >= 0; i--) {
					const indexToRemove = removeThese[i];
					const abilityRemoved = this.abilitiesWithPromptTargetsNeeded.splice(indexToRemove, 1)[0];
					debug("No need to prompt for ability: ");
					debug(abilityRemoved);
				}
			}
		}
	}

	activateReadyAbilities() {
		let boardHasChanged = false;
		const tileRecords = {
			capturedTiles: [],
			capturedTilePoints: [],	// Parallel to capturedTiles: where each capture happened
			tilesMovedToPiles: []
		};
		const abilitiesActivated = [];
		const allAnimations = new TrifleAnimationSequence();

		/* Mark all existing abilities as do not preserve */
		this.abilities.forEach((existingAbility) => {
			existingAbility.preserve = false;
		});

		/* Mark abilities to preserve based on matching ready abilities */
		Object.values(this.readyAbilities).forEach((abilityList) => {
			abilityList.forEach((ability) => {
				this.markExistingMatchingAbility(ability);
			});
		});

		/* Deactivate abilities. New ability list is the ones that are not deactivated. */
		const newAbilities = [];
		this.abilities.forEach((existingAbility) => {
			// Preserve if:
			// 1. Marked as preserve (re-triggered this turn), actually activated, and not canceled, OR
			// 2. Has remaining duration (duration abilities should persist until expired), OR
			// 3. Has remaining activation delay (pending abilities should persist until activated)
			// Note: Non-activated abilities (e.g. blocked by a cancel at activation time) must NOT
			// be preserved, so they can be freshly added and re-evaluated when conditions change.
			const hasDurationRemaining = existingAbility.remainingDuration !== undefined
				&& existingAbility.remainingDuration > 0;
			const hasDelayRemaining = existingAbility.remainingDelay !== undefined
				&& existingAbility.remainingDelay > 0;

			if ((existingAbility.preserve && existingAbility.activated && !this.abilityIsCanceled(existingAbility))
					|| hasDurationRemaining
					|| hasDelayRemaining) {
				newAbilities.push(existingAbility);
			} else {
				existingAbility.deactivate();
			}
		});
		this.abilities = newAbilities;

		/* Refresh target tiles for preserved active abilities.
		 * Cancel state may have changed during step 3 (e.g., a cancelAbilitiesTargetingTiles
		 * ability was deactivated), which affects which tiles can be targeted.
		 * Without this refresh, an ability preserved via appearsToBeTheSameAs keeps stale
		 * abilityTargetTiles — e.g., missing a tile that was previously shielded by a
		 * now-removed cancel (the Host Koi / Guest Ginseng interaction in Gini). */
		this.abilities.forEach(ability => {
			if (ability.activated) {
				ability.setAbilityTargetTiles();
			}
		});

		/* Activate abilities! */

		// Priority abilities first, in ascending priority level.
		// Collect the distinct levels present so gaps (e.g. priorities 1 and 3 with
		// no 2) don't end the scan early.
		const priorityLevels = new Set();
		Object.values(this.readyAbilities).forEach(abilityList => {
			abilityList.forEach(ability => {
				if (ability.abilityInfo.priority) {
					priorityLevels.add(ability.abilityInfo.priority);
				}
			});
		});

		Array.from(priorityLevels).sort((a, b) => a - b).every(currentPriority => {
			Object.values(this.readyAbilities).every(abilityList => {
				abilityList.every(ability => {
					if (ability.isPriority(currentPriority)) {
						debug("!!!!Priority " + currentPriority + " Ability!!!! " + ability.getTitle());
						boardHasChanged = this.doTheActivateThing(ability, tileRecords, abilitiesActivated, allAnimations);
					}
					return !boardHasChanged;	// Continue if board has not changed
				});
				return !boardHasChanged;	// Continue if board has not changed
			});
			return !boardHasChanged;	// Continue if board has not changed
		});

		if (!boardHasChanged) {
			// Default ability activation order
			// Cancel abilities first, then capture constraints (so they're registered
			// before any action abilities like captureTargetTiles in the catch-all phase)
			let abilityActivationOrder = [
				TrifleAbilityName.cancelAbilities,
				TrifleAbilityName.cancelAbilitiesTargetingTiles,
				TrifleAbilityName.protectFromCapture,
				TrifleAbilityName.substituteForCapture,
				TrifleAbilityName.prohibitTileFromCapturing,
				TrifleAbilityName.restrictTileFromCapturing
			];

			if (this.abilityActivationOrder) {
				abilityActivationOrder = this.abilityActivationOrder;
			}

			abilityActivationOrder.every(abilityName => {
				const readyAbilitiesOfType = this.readyAbilities[abilityName];
				if (readyAbilitiesOfType && readyAbilitiesOfType.length) {
					readyAbilitiesOfType.every(ability => {
						boardHasChanged = this.doTheActivateThing(ability, tileRecords, abilitiesActivated, allAnimations);
						return !boardHasChanged;	// Continue if board has not changed
					});
				}
				return !boardHasChanged;	// Continue if board has not changed
			});

			if (!boardHasChanged) {
				Object.values(this.readyAbilities).every(abilityList => {
					abilityList.every(ability => {
						boardHasChanged = this.doTheActivateThing(ability, tileRecords, abilitiesActivated, allAnimations);
						return !boardHasChanged;	// Continue if board has not changed
					});
					return !boardHasChanged;	// Continue if board has not changed
				});
			}
		}

		return {
			abilitiesActivated: abilitiesActivated,
			boardHasChanged: boardHasChanged,
			tileRecords: tileRecords,
			animations: allAnimations
		};
	}

	doTheActivateThing(ability, tileRecords, abilitiesActivated, allAnimations, cascadeDepth = 0, visitedAbilityKeys = null) {
		const capturedTiles = tileRecords.capturedTiles;
		const tilesMovedToPiles = tileRecords.tilesMovedToPiles;

		let abilitiesTriggeredBySameAction = [];

		// Initialize visited set on first call
		if (visitedAbilityKeys === null) {
			visitedAbilityKeys = new Set();
		}

		// Build unique key for this ability
		const abilityKey = this.buildAbilityKey(ability);

		// Check for cycle
		if (visitedAbilityKeys.has(abilityKey)) {
			debug("RECURSION BLOCKED: Cycle detected for " + ability.abilityType + " from " + ability.sourceTile.code);
			return false;
		}

		// Check depth limit
		if (cascadeDepth >= TrifleAbilityManager.MAX_CASCADE_DEPTH) {
			debug("RECURSION BLOCKED: Max depth reached for " + ability.abilityType);
			return false;
		}

		// Add to visited set
		visitedAbilityKeys.add(abilityKey);

		let boardHasChanged = false;
		if (!ability.activated
				// && ability.triggerStillMet()	// I guess not this
				&& !this.abilitiesWithPromptTargetsNeeded.includes(ability)) {
			const abilityIsReadyToActivate = this.addNewAbility(ability);
			if (abilityIsReadyToActivate) {
				abilitiesTriggeredBySameAction = this.getReadyAbilitiesWithTriggeringActions(ability.getTriggeringActions());

				abilitiesActivated.push(ability);
				ability.activateAbility();

				if (ability.abilityActivatedResults
						&& ability.abilityActivatedResults.capturedTiles
						&& ability.abilityActivatedResults.capturedTiles.length) {
					ability.abilityActivatedResults.capturedTiles.forEach((capturedTile) => {
						capturedTiles.push(capturedTile);
						/* Keep capturedTilePoints parallel to capturedTiles. A captured
						   tile's seatedPoint still references where it sat when captured
						   (captureTileOnPoint does not clear it). */
						if (tileRecords.capturedTilePoints) {
							tileRecords.capturedTilePoints.push(capturedTile.seatedPoint || null);
						}
					});
				}

				if (ability.abilityActivatedResults
						&& ability.abilityActivatedResults.tilesMovedToPiles
						&& ability.abilityActivatedResults.tilesMovedToPiles.length) {
					ability.abilityActivatedResults.tilesMovedToPiles.forEach((movedTile) => {
						tilesMovedToPiles.push(movedTile);
					});
				}

				// Collect animations from ability results
				if (ability.abilityActivatedResults
						&& ability.abilityActivatedResults.animations
						&& ability.abilityActivatedResults.animations.hasAnimations()) {
					allAnimations.merge(ability.abilityActivatedResults.animations);
				}
			}
			if (ability.boardChangedAfterActivation()) {
				boardHasChanged = true;
			}

			// Now activate abilities triggered by same event
			if (abilitiesTriggeredBySameAction && abilitiesTriggeredBySameAction.length > 0) {
				abilitiesTriggeredBySameAction.forEach(otherAbility => {
					this.doTheActivateThing(otherAbility, tileRecords, abilitiesActivated, allAnimations, cascadeDepth + 1, visitedAbilityKeys);
				});
			}

			// If this is a cancelAbilities ability.. should it cancel some ability that's already active?
			if (ability.abilityType === TrifleAbilityName.cancelAbilities) {
				this.abilities.forEach(existingAbility => {
					if (existingAbility.activated && this.abilityIsCanceled(existingAbility)) {
						debug("Freshly canceled ability: " + existingAbility.abilityType + " from " + existingAbility.sourceTile.ownerCode + existingAbility.sourceTile.code);
						existingAbility.deactivate();
					}
				});
			}
		}
		return boardHasChanged;
	}

	getReadyAbilitiesWithTriggeringActions(triggeringActions) {
		const matchingReadyAbilities = [];

		if (triggeringActions && triggeringActions.length > 0) {
			Object.values(this.readyAbilities).forEach(abilityList => {
				abilityList.forEach(readyAbility => {
					if (!readyAbility.activated) {
						const readyAbilityTriggeringActions = readyAbility.getTriggeringActions();
						if (readyAbilityTriggeringActions && readyAbilityTriggeringActions.length > 0) {
							readyAbilityTriggeringActions.forEach(triggeringAction => {
								triggeringActions.forEach(tAction1 => {
									if (JSON.stringify(tAction1) == JSON.stringify(triggeringAction)) {
										matchingReadyAbilities.push(readyAbility);
									}
								});
							});
						}
					}
				});
			});
		}

		return matchingReadyAbilities;
	}

	buildAbilityKey(ability) {
		const triggerTargetIds = ability.triggerTargetTiles
			.map(tile => tile.id)
			.sort()
			.join(',');
		return `${ability.abilityType}|${ability.sourceTile.id}|${triggerTargetIds}`;
	}

	/**
	 * Return `true` if ability is new and not already active, aka ability is ready to activate.
	 * @param {*} ability
	 */
	addNewAbility(ability) {
		let added = false;

		if (!this.abilitiesAlreadyIncludes(ability) && !this.abilityIsCanceled(ability)) {
			this.abilities.push(ability);
			added = true;
		} else {
			// debug("No need to add ability");
		}

		return added;
	}

	markExistingMatchingAbility(otherAbility) {
		this.abilities.forEach((existingAbility) => {
			if (existingAbility.appearsToBeTheSameAs(otherAbility)) {
				existingAbility.preserve = true;
				return;
			}
		});
	}

	abilitiesAlreadyIncludes(otherAbility) {
		let abilityFound = false;
		this.abilities.forEach((existingAbility) => {
			if (existingAbility.appearsToBeTheSameAs(otherAbility)) {
				abilityFound = true;
				return;
			}
		});
		return abilityFound;
	}

	abilityTargetingTileExists(abilityName, tile) {
		let targetsTile = false;
		const self = this;
		this.abilities.forEach((ability) => {
			if (ability.abilityType === abilityName
					&& ability.activated
					&& ability.abilityTargetsTile(tile)) {
				// Check if targeting is canceled (e.g., by Elderberry's Antidote Aura)
				// Also check if the ability itself is canceled (e.g., source tile in Edelweiss zone)
				if (!self.targetingIsCanceled(ability.sourceTile, abilityName, tile)
						&& !self.abilityIsCanceled(ability)) {
					targetsTile = true;
				}
			}
		});
		return targetsTile;
	}

	getAbilitiesTargetingTile(abilityName, tile) {
		const abilitiesTargetingTile = [];
		this.abilities.forEach((ability) => {
			if (ability.abilityType === abilityName
					&& ability.activated
					&& ability.abilityTargetsTile(tile)) {
				abilitiesTargetingTile.push(ability);
			}
		});
		return abilitiesTargetingTile;
	}

	getAbilitiesTargetingTileFromSourceTile(abilityName, tile, sourceTile) {
		const abilitiesTargetingTile = [];
		this.abilities.forEach((ability) => {
			if (ability.abilityType === abilityName
					&& ability.activated
					&& ability.sourceTile === sourceTile
					&& ability.abilityTargetsTile(tile)) {
				abilitiesTargetingTile.push(ability);
			}
		});
		return abilitiesTargetingTile;
	}

	getActiveAbilitiesFromTile(abilityName, sourceTile) {
		const abilitiesFromTile = [];
		this.abilities.forEach((ability) => {
			if (ability.abilityType === abilityName
					&& ability.activated
					&& ability.sourceTile === sourceTile) {
				abilitiesFromTile.push(ability);
			}
		});
		return abilitiesFromTile;
	}

	abilityIsCanceled(abilityObject) {
		let isCanceled = false;

		const affectingCancelAbilities = this.getAbilitiesTargetingTile(TrifleAbilityName.cancelAbilities, abilityObject.sourceTile);

		affectingCancelAbilities.forEach((cancelingAbility) => {
			// Does canceling ability affecting tile cancel this kind of ability?
			if (cancelingAbility.abilityInfo.targetAbilityTypes.includes(TrifleAbilityType.all)) {
				isCanceled = true;
			}

			cancelingAbility.abilityInfo.targetAbilityTypes.forEach((canceledAbilityType) => {
				const abilitiesForType = TrifleAbilitiesForType[canceledAbilityType];
				if (abilitiesForType && abilitiesForType.length && abilitiesForType.includes(abilityObject.abilityInfo.type)) {
					isCanceled = true;
				} else if (abilityObject.abilityInfo.type === canceledAbilityType) {
					isCanceled = true;
				}
			});
		});

		return isCanceled;
	}

	targetingIsCanceled(abilitySourceTile, abilityType, possibleTargetTile) {
		let isCanceled = false;
		const affectingCancelAbilities = this.getAbilitiesTargetingTile(TrifleAbilityName.cancelAbilitiesTargetingTiles, possibleTargetTile);

		affectingCancelAbilities.forEach((cancelingAbility) => {
			if (!cancelingAbility.abilityInfo.cancelAbilitiesFromTeam
				|| (
					(cancelingAbility.abilityInfo.cancelAbilitiesFromTeam === TrifleTileTeam.enemy && cancelingAbility.sourceTile.ownerName !== abilitySourceTile.ownerName)
					|| (cancelingAbility.abilityInfo.cancelAbilitiesFromTeam === TrifleTileTeam.friendly && cancelingAbility.sourceTile.ownerName === abilitySourceTile.ownerName)
					)
			) {
				if (cancelingAbility.abilityInfo.targetAbilityTypes) {
					// Does canceling ability affecting tile cancel this kind of ability?
					if (cancelingAbility.abilityInfo.targetAbilityTypes.includes(TrifleAbilityType.all)) {
						isCanceled = true;
					}

					cancelingAbility.abilityInfo.targetAbilityTypes.forEach((canceledAbilityType) => {
						const abilitiesForType = TrifleAbilitiesForType[canceledAbilityType];
						if (abilitiesForType && abilitiesForType.length && abilitiesForType.includes(abilityType)) {
							isCanceled = true;
						} else if (abilityType === canceledAbilityType) {
							isCanceled = true;
						}
					});
				}

				if (cancelingAbility.abilityInfo.cancelAbilitiesFromTileCodes
						&& cancelingAbility.abilityInfo.cancelAbilitiesFromTileCodes.includes(abilitySourceTile.code)) {
					isCanceled = true;
				}

				// Check abilityTypesToCancel - direct ability name matching (e.g., immobilizeTiles)
				if (cancelingAbility.abilityInfo.abilityTypesToCancel
						&& cancelingAbility.abilityInfo.abilityTypesToCancel.includes(abilityType)) {
					isCanceled = true;
				}
			}
		});

		return isCanceled;
	}

	tickDurationAbilities() {
		for (let i = this.abilities.length - 1; i >= 0; i--) {
			const ability = this.abilities[i];

			// Tick delay for pending abilities (not yet activated)
			if (ability.hasActivationDelay() && ability.pendingActivation && !ability.activated) {
				const delayExpired = ability.tickDelay();
				if (delayExpired) {
					ability.activateDelayedAbility();
				}
				continue;
			}

			// Tick duration for active abilities, remove expired ones
			if (ability.hasDuration() && ability.activated) {
				const expired = ability.tickDuration();
				if (expired) {
					debug("Duration ability expired: " + ability.abilityType + " from " + ability.sourceTile.ownerCode + ability.sourceTile.code);
					ability.deactivate();
					this.abilities.splice(i, 1);
				}
			}
		}
	}

	/**
	 * Get constraint brains for a tile by constraint category.
	 * Dynamically looks up all ability types for the category and creates brains.
	 * @param {Object} tile - The tile to get constraints for
	 * @param {string} category - The constraint category (from ConstraintCategory)
	 * @returns {Array} Array of constraint brain objects
	 */
	getConstraintsForTile(tile, category) {
		const constraints = [];

		// Get all ability names that belong to this category
		const abilityNames = getAbilityNamesForConstraintCategory(category);

		// For each ability type, get all abilities targeting this tile and create brains
		abilityNames.forEach((abilityName) => {
			const abilities = this.getAbilitiesTargetingTile(abilityName, tile);
			abilities.forEach((ability) => {
				// Skip abilities whose targeting is canceled (e.g., by Ginseng protection)
				if (this.targetingIsCanceled(ability.sourceTile, ability.abilityType, tile)
						|| this.abilityIsCanceled(ability)) {
					return;
				}
				const constraintBrain = TrifleBrainFactory.createConstraintBrain(
					ability.abilityType,
					this.board,
					ability
				);
				if (constraintBrain) {
					constraints.push(constraintBrain);
				}
			});
		});

		return constraints;
	}

	/**
	 * Get movement constraints for a tile.
	 * @param {Object} tile - The tile to get constraints for
	 * @returns {Array} Array of constraint brain objects
	 */
	getMovementConstraintsForTile(tile) {
		return this.getConstraintsForTile(tile, ConstraintCategory.MOVEMENT);
	}

	/**
	 * Get capture constraints for a tile that is attempting to capture.
	 * @param {Object} tile - The tile attempting to capture
	 * @returns {Array} Array of capture constraint brain objects
	 */
	getCaptureConstraintsForTile(tile) {
		return this.getConstraintsForTile(tile, ConstraintCategory.CAPTURE_PROHIBITION);
	}

	/**
	 * Get capture protection constraints for a tile that might be captured.
	 * @param {Object} tile - The tile that might be captured
	 * @returns {Array} Array of capture constraint brain objects
	 */
	getCaptureProtectionForTile(tile) {
		return this.getConstraintsForTile(tile, ConstraintCategory.CAPTURE_PROTECTION);
	}

	/**
	 * Get all active deploy constraints on the board.
	 * Deploy constraints apply globally - e.g., if any Water Hyacinth is on the board,
	 * all banners (friendly and enemy) must deploy within its zone.
	 * @returns {Array} Array of deploy constraint brain objects
	 */
	getDeployConstraints() {
		const constraints = [];
		const abilityNames = getAbilityNamesForConstraintCategory(ConstraintCategory.DEPLOY_RESTRICTION);

		abilityNames.forEach((abilityName) => {
			this.abilities.forEach((ability) => {
				if (ability.abilityType === abilityName
						&& ability.activated
						&& !this.abilityIsCanceled(ability)) {
					const constraintBrain = TrifleBrainFactory.createConstraintBrain(
						ability.abilityType,
						this.board,
						ability
					);
					if (constraintBrain) {
						constraints.push(constraintBrain);
					}
				}
			});
		});

		return constraints;
	}

	promptForNextNeededTargets() {
		if (!(this.abilitiesWithPromptTargetsNeeded && this.abilitiesWithPromptTargetsNeeded.length > 0)) {
			debug("Error: No abilities that need prompt targets found");
			return {};
		}

		if (this.abilitiesWithPromptTargetsNeeded.length > 1) {
			debug("Multiple abilities that need prompt targets. Will just choose first one to prompt...");
		}

		const abilityObject = this.abilitiesWithPromptTargetsNeeded[0];

		const neededPromptInfo = {};

		neededPromptInfo.abilitySourceTile = abilityObject.sourceTile;
		neededPromptInfo.sourceAbility = abilityObject;
		neededPromptInfo.sourceTileKey = TrifleAbilityManager.buildSourceTileKeyObject(abilityObject.sourceTile);
		const sourceTileKeyStr = JSON.stringify(neededPromptInfo.sourceTileKey);

		let nextNeededPromptTargetInfo;
		abilityObject.abilityInfo.neededPromptTargetsInfo.forEach((neededPromptTargetInfo) => {
			if (!nextNeededPromptTargetInfo && abilityObject.promptTargetInfo
					&& (!abilityObject.promptTargetInfo[sourceTileKeyStr]
					|| !abilityObject.promptTargetInfo[sourceTileKeyStr][neededPromptTargetInfo.promptId])) {
				nextNeededPromptTargetInfo = neededPromptTargetInfo;
			}
		});

		if (nextNeededPromptTargetInfo) {
			debug("promptForNextNeededTargets: ability=" + abilityObject.abilityType + " promptId=" + nextNeededPromptTargetInfo.promptId);
			const abilityBrain = TrifleBrainFactory.createAbilityBrain(abilityObject.abilityType, abilityObject);
			const promptTargetsExist = abilityBrain.promptForTarget(nextNeededPromptTargetInfo, sourceTileKeyStr);
			debug("promptForNextNeededTargets: promptTargetsExist=" + promptTargetsExist);
			if (promptTargetsExist) {
				neededPromptInfo.currentPromptTargetId = nextNeededPromptTargetInfo.promptId;
			} else {
				debug("No targets available to prompt.. so no prompt needed! Removing ability from prompt list.");
				this.abilitiesWithPromptTargetsNeeded.shift();
			}
		} else {
			debug("No prompt needed, removing ability from prompt list.");
			this.abilitiesWithPromptTargetsNeeded.shift();
		}

		return { neededPromptInfo: neededPromptInfo };
	}

	static buildSourceTileKeyObject(abilitySourceTile) {
		return {
			tileOwner: abilitySourceTile.ownerCode,
			tileCode: abilitySourceTile.code,
			boardPoint: abilitySourceTile.seatedPoint.getNotationPointString(),
			tileId: abilitySourceTile.id
		};
	}
}

export default TrifleAbilityManager;
