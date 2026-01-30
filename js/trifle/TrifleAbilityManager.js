import {
  TrifleAbilitiesForType,
  TrifleAbilityName,
  TrifleAbilityType,
  TrifleTileTeam
} from './TrifleTileInfo';
import { debug } from '../GameData';
import { TrifleBrainFactory } from './brains/BrainFactory';

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
			// return this.promptForNextNeededTargets();
			const promptOjb = this.promptForNextNeededTargets();
			return Object.assign(activateObj, promptOjb);
		} else {
			// return this.activateReadyAbilities();
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
			tilesMovedToPiles: []
		};
		const abilitiesActivated = [];

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
			if (existingAbility.preserve && !this.abilityIsCanceled(existingAbility)) {
				newAbilities.push(existingAbility);	// Commenting this out... ability activation priority should take care of this now
											// NOOOOOO We need this!
			} else {
				existingAbility.deactivate();
			}
		});
		this.abilities = newAbilities;

		/* Activate abilities! */

		// Priority abilities first
		let currentPriority = 1;
		let priorityAbilityFound = true;
		while (priorityAbilityFound) {
			priorityAbilityFound = false;

			Object.values(this.readyAbilities).every(abilityList => {
				abilityList.every(ability => {
					if (ability.isPriority(currentPriority)) {
						priorityAbilityFound = true;
						debug("!!!!Priority " + currentPriority + " Ability!!!! " + ability.getTitle());
						boardHasChanged = this.doTheActivateThing(ability, tileRecords, abilitiesActivated);
						return !boardHasChanged;	// Continue if board has not changed
					}
				});
				return !boardHasChanged;	// Continue if board has not changed
			});

			currentPriority++;
		}

		if (!boardHasChanged) {
			// Default ability activation order
			let abilityActivationOrder = [
				TrifleAbilityName.cancelAbilities,
				TrifleAbilityName.cancelAbilitiesTargetingTiles
			];

			if (this.abilityActivationOrder) {
				abilityActivationOrder = this.abilityActivationOrder;
			}

			abilityActivationOrder.every(abilityName => {
				const readyAbilitiesOfType = this.readyAbilities[abilityName];
				if (readyAbilitiesOfType && readyAbilitiesOfType.length) {
					readyAbilitiesOfType.every(ability => {
						boardHasChanged = this.doTheActivateThing(ability, tileRecords, abilitiesActivated);
						return !boardHasChanged;	// Continue if board has not changed
					});
				}
				return !boardHasChanged;	// Continue if board has not changed
			});

			if (!boardHasChanged) {
				Object.values(this.readyAbilities).every(abilityList => {
					abilityList.every(ability => {
						boardHasChanged = this.doTheActivateThing(ability, tileRecords, abilitiesActivated);
						return !boardHasChanged;	// Continue if board has not changed
					});
					return !boardHasChanged;	// Continue if board has not changed
				});
			}
		}

		return {
			abilitiesActivated: abilitiesActivated,
			boardHasChanged: boardHasChanged,
			tileRecords: tileRecords
		};
	}

	doTheActivateThing(ability, tileRecords, abilitiesActivated, cascadeDepth = 0, visitedAbilityKeys = null) {
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
					});
				}

				if (ability.abilityActivatedResults
						&& ability.abilityActivatedResults.tilesMovedToPiles
						&& ability.abilityActivatedResults.tilesMovedToPiles.length) {
					ability.abilityActivatedResults.tilesMovedToPiles.forEach((movedTile) => {
						tilesMovedToPiles.push(movedTile);
					});
				}
			}
			if (ability.boardChangedAfterActivation()) {
				boardHasChanged = true;
			}

			// Now activate abilities triggered by same event
			if (abilitiesTriggeredBySameAction && abilitiesTriggeredBySameAction.length > 0) {
				abilitiesTriggeredBySameAction.forEach(otherAbility => {
					this.doTheActivateThing(otherAbility, tileRecords, abilitiesActivated, cascadeDepth + 1, visitedAbilityKeys);
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
		this.abilities.forEach((ability) => {
			if (ability.abilityType === abilityName
					&& ability.abilityTargetsTile(tile)) {
				targetsTile = true;
				return;
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
					&& ability.sourceTile === sourceTile
					&& ability.abilityTargetsTile(tile)) {
				abilitiesTargetingTile.push(ability);
			}
		});
		return abilitiesTargetingTile;
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
			}
		});

		return isCanceled;
	}

	tickDurationAbilities() {
		// TODO: Something like this old tick code did:
		/* for (var i = this.activeDurationAbilities.length - 1; i >= 0; i--) {
			var durationAbilityDetails = this.activeDurationAbilities[i];
			var durationAbilityInfo = durationAbilityDetails.ability;
			durationAbilityInfo.remainingDuration -= 0.5;
			if (durationAbilityInfo.remainingDuration <= 0) {
				durationAbilityInfo.active = false;
				this.activeDurationAbilities.splice(i, 1);
				debug("Ability deactivated!");
				debug(durationAbilityInfo);
			}
		} */
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
			const abilityBrain = TrifleBrainFactory.createAbilityBrain(abilityObject.abilityType, abilityObject);
			const promptTargetsExist = abilityBrain.promptForTarget(nextNeededPromptTargetInfo, sourceTileKeyStr);
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
