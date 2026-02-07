import { NotationPoint } from '../CommonNotationObjects';

/**
 * Static utility for managing prompt target data in the notation builder.
 * Eliminates duplicated sourceTileKey/promptTargetData logic across controllers.
 */
export class PromptTargetHelper {
	/**
	 * Record a board point selection (e.g., for moveTargetTile prompts).
	 * @param {Object} promptTargetData - The notationBuilder.promptTargetData object
	 * @param {Object} neededPromptInfo - From notationBuilder.neededPromptTargetInfo
	 * @param {string} pointText - The htmlPoint name attribute (e.g., "0,8")
	 */
	static recordBoardPointAnswer(promptTargetData, neededPromptInfo, pointText) {
		const sourceTileKey = JSON.stringify(neededPromptInfo.sourceTileKey);
		if (!promptTargetData[sourceTileKey]) {
			promptTargetData[sourceTileKey] = {};
		}
		promptTargetData[sourceTileKey][neededPromptInfo.currentPromptTargetId] = new NotationPoint(pointText);
	}

	/**
	 * Record a captured tile selection (e.g., for exchangeWithCapturedTile prompts).
	 * @param {Object} promptTargetData - The notationBuilder.promptTargetData object
	 * @param {Object} neededPromptInfo - From notationBuilder.neededPromptTargetInfo
	 * @param {Object} tileIdObject - Result of tile.getOwnerCodeIdObject()
	 */
	static recordTileAnswer(promptTargetData, neededPromptInfo, tileIdObject) {
		const sourceTileKey = JSON.stringify(neededPromptInfo.sourceTileKey);
		if (!promptTargetData[sourceTileKey]) {
			promptTargetData[sourceTileKey] = {};
		}
		promptTargetData[sourceTileKey][neededPromptInfo.currentPromptTargetId] = tileIdObject;
	}

	/**
	 * Record that the user chose to skip an optional ability.
	 * @param {Object} promptTargetData - The notationBuilder.promptTargetData object
	 * @param {Object} neededPromptInfo - From notationBuilder.neededPromptTargetInfo
	 */
	static recordSkip(promptTargetData, neededPromptInfo) {
		const sourceTileKey = JSON.stringify(neededPromptInfo.sourceTileKey);
		if (!promptTargetData[sourceTileKey]) {
			promptTargetData[sourceTileKey] = {};
		}
		promptTargetData[sourceTileKey].skipped = true;
	}
}
