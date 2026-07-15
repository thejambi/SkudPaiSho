// Trifle Engine - Tile Metadata Validator
//
// Tile definitions are large untyped config objects; a typo'd ability name or
// trigger type used to fail silently (the BrainFactory just logs a debug line and
// the ability never fires). This validator checks every tile definition against
// the engine's enums and reports problems loudly at game construction time.

import {
	TrifleAbilityName,
	TrifleAbilityTriggerType,
	TrifleAttributeType,
	TrifleCaptureType,
	TrifleDeployType,
	TrifleMovementType,
	TrifleTargetType,
	TrifleZoneAbility
} from './TrifleTileInfo';

const validAbilityNames = new Set(Object.values(TrifleAbilityName));

/* Marker abilities are read directly by board code (not the trigger system),
   so a missing triggers array is expected for them */
const markerAbilities = new Set([
	TrifleAbilityName.resurrectAtDeployPosition
]);
const validTriggerTypes = new Set(Object.values(TrifleAbilityTriggerType));
const validTargetTypes = new Set(Object.values(TrifleTargetType));
const validMovementTypes = new Set(Object.values(TrifleMovementType));
const validDeployTypes = new Set(Object.values(TrifleDeployType));
const validCaptureTypes = new Set(Object.values(TrifleCaptureType));
const validZoneAbilities = new Set(Object.values(TrifleZoneAbility));
const validAttributeTypes = new Set(Object.values(TrifleAttributeType));

/**
 * Validate a tile metadata object (e.g. GinsengTiles) against the engine's enums.
 * Pure function: returns { errors: string[], warnings: string[] }, logs nothing.
 */
export function validateTileMetadata(tileMetadata) {
	const errors = [];
	const warnings = [];

	if (!tileMetadata) {
		return { errors, warnings };
	}

	Object.keys(tileMetadata).forEach((tileCode) => {
		const tileInfo = tileMetadata[tileCode];
		if (!tileInfo || typeof tileInfo !== 'object') {
			errors.push(tileCode + ": tile definition is not an object");
			return;
		}

		if (!tileInfo.types || !tileInfo.types.length) {
			warnings.push(tileCode + ": missing 'types' (capture-by-type and banner checks will not match this tile)");
		}

		if (tileInfo.deployTypes) {
			tileInfo.deployTypes.forEach((deployType) => {
				if (!validDeployTypes.has(deployType)) {
					errors.push(tileCode + ": unknown deploy type '" + deployType + "'");
				}
			});
		}

		if (tileInfo.movements) {
			tileInfo.movements.forEach((movementInfo, index) => {
				if (!validMovementTypes.has(movementInfo.type)) {
					errors.push(tileCode + ": movements[" + index + "] has unknown movement type '" + movementInfo.type + "'");
				}
				if (movementInfo.captureTypes) {
					movementInfo.captureTypes.forEach((captureTypeInfo) => {
						/* Capture types appear both as plain strings and as { type: ... } objects */
						const captureType = captureTypeInfo && captureTypeInfo.type !== undefined
							? captureTypeInfo.type
							: captureTypeInfo;
						if (!validCaptureTypes.has(captureType)) {
							errors.push(tileCode + ": movements[" + index + "] has unknown capture type '" + captureType + "'");
						}
					});
				}
			});
		}

		if (tileInfo.abilities) {
			tileInfo.abilities.forEach((abilityInfo, index) => {
				const abilityLabel = tileCode + ": abilities[" + index + "]"
					+ (abilityInfo.title ? " ('" + abilityInfo.title + "')" : "");

				if (!validAbilityNames.has(abilityInfo.type)) {
					errors.push(abilityLabel + " has unknown ability type '" + abilityInfo.type + "'");
				}

				if (abilityInfo.triggers) {
					abilityInfo.triggers.forEach((triggerInfo) => {
						if (!triggerInfo.triggerType) {
							errors.push(abilityLabel + " has a trigger with no triggerType");
						} else if (!validTriggerTypes.has(triggerInfo.triggerType)) {
							errors.push(abilityLabel + " has unknown trigger type '" + triggerInfo.triggerType + "'");
						}
					});
				} else if (!markerAbilities.has(abilityInfo.type)) {
					warnings.push(abilityLabel + " has no triggers (it will be evaluated as ready on every move)");
				}

				if (abilityInfo.targetTypes) {
					abilityInfo.targetTypes.forEach((targetType) => {
						if (!validTargetTypes.has(targetType)) {
							errors.push(abilityLabel + " has unknown target type '" + targetType + "'");
						}
					});
				}
			});
		}

		if (tileInfo.territorialZone && tileInfo.territorialZone.abilities) {
			tileInfo.territorialZone.abilities.forEach((zoneAbilityInfo, index) => {
				if (!validZoneAbilities.has(zoneAbilityInfo.type)) {
					errors.push(tileCode + ": territorialZone.abilities[" + index + "] has unknown zone ability type '" + zoneAbilityInfo.type + "'");
				}
			});
		}

		if (tileInfo.attributes) {
			tileInfo.attributes.forEach((attributeInfo, index) => {
				/* Attributes are plain strings in configs (engine reads them via
				   attributes.includes(...)); tolerate { type } objects too */
				const attributeType = (attributeInfo && attributeInfo.type !== undefined)
					? attributeInfo.type
					: attributeInfo;
				if (!validAttributeTypes.has(attributeType)) {
					errors.push(tileCode + ": attributes[" + index + "] has unknown attribute type '" + attributeType + "'");
				}
			});
		}
	});

	return { errors, warnings };
}

/* Tiles objects are module-level and lazily populated (clearObject + repopulate),
   so track the tile count we validated at: a board constructed before population
   sees 0 tiles, and the next construction after population re-validates. */
const validatedTileCounts = new WeakMap();

/**
 * Validate a tile metadata object once per population state, logging any findings.
 * Called from PaiShoGameBoard construction; cheap on repeat calls (AI copies).
 */
export function validateTileMetadataOnce(tileMetadata) {
	if (!tileMetadata || typeof tileMetadata !== 'object') {
		return null;
	}

	const tileCount = Object.keys(tileMetadata).length;
	if (validatedTileCounts.get(tileMetadata) === tileCount) {
		return null;
	}
	validatedTileCounts.set(tileMetadata, tileCount);

	const results = validateTileMetadata(tileMetadata);
	results.errors.forEach((message) => {
		console.error("[Trifle tile config] " + message);
	});
	results.warnings.forEach((message) => {
		console.warn("[Trifle tile config] " + message);
	});

	return results;
}
