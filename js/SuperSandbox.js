// SuperSandbox Module
// Handles Super Sandbox mode state, branch tracking, and UI

import {
	gameController,
	currentMoveIndex,
	rerunAll,
	playingOnlineGame,
	showModalElem,
	closeModal,
	setIsInReplay,
	BRAND_NEW
} from './PaiShoMain.js';

// State
let superSandboxMode = false;
let superSandboxBranches = [];
let branchIdCounter = 0;

// Branch management
function generateBranchId() {
	return ++branchIdCounter;
}

function saveBranch(branchPointMoveIndex, truncatedMoves) {
	// Store the full notation text for reliable restoration
	const fullNotationText = gameController.gameNotation.notationTextForUrl();

	// Get first move preview for display
	const firstMovePreview = truncatedMoves.length > 0
		? (truncatedMoves[0].fullMoveText || truncatedMoves[0].text || String(truncatedMoves[0]))
		: '';

	const branch = {
		id: generateBranchId(),
		branchPointMoveIndex: branchPointMoveIndex,
		moveCount: truncatedMoves.length,
		notationText: fullNotationText,
		label: `Move ${branchPointMoveIndex}`,
		firstMovePreview: firstMovePreview,
		timestamp: new Date()
	};

	superSandboxBranches.push(branch);
	return branch;
}

export function getBranches() {
	return superSandboxBranches;
}

export function clearBranches() {
	superSandboxBranches = [];
	branchIdCounter = 0;
}

export function deleteBranch(branchId) {
	const index = superSandboxBranches.findIndex(b => b.id === branchId);
	if (index !== -1) {
		superSandboxBranches.splice(index, 1);
	}
}

export function jumpToBranch(branchId) {
	const branch = superSandboxBranches.find(b => b.id === branchId);
	if (!branch) return false;

	// Save current state before jumping (if different from target)
	const currentNotation = gameController.gameNotation.notationTextForUrl();
	if (currentNotation !== branch.notationText) {
		const moves = gameController.gameNotation.moves;
		if (moves.length > 0) {
			// Save current state as a branch
			const currentBranch = {
				id: generateBranchId(),
				branchPointMoveIndex: moves.length,
				moveCount: 0, // This is the "tip" of the current line
				notationText: currentNotation,
				label: `Move ${moves.length}`,
				firstMovePreview: '',
				timestamp: new Date()
			};
			superSandboxBranches.push(currentBranch);
		}
	}

	// Restore the game to the saved notation state
	gameController.setGameNotation(branch.notationText);
	rerunAll();

	closeModal();
	return true;
}

// Super Sandbox mode state management
export function enterSuperSandboxMode() {
	superSandboxMode = true;
	showSuperSandboxIndicator();
}

export function exitSuperSandboxMode() {
	superSandboxMode = false;
	hideSuperSandboxIndicator();
	clearBranches();
}

export function isSuperSandboxMode() {
	return superSandboxMode && !playingOnlineGame();
}

// UI indicator functions
function showSuperSandboxIndicator() {
	const indicator = document.getElementById('superSandboxIndicator');
	if (indicator) {
		indicator.classList.remove('gone');
	}
	const container = document.getElementById('replayButtonContainer');
	if (container) {
		container.classList.add('superSandboxActive');
	}
}

function hideSuperSandboxIndicator() {
	const indicator = document.getElementById('superSandboxIndicator');
	if (indicator) {
		indicator.classList.add('gone');
	}
	const container = document.getElementById('replayButtonContainer');
	if (container) {
		container.classList.remove('superSandboxActive');
	}
}

// Truncation with branch saving
export function truncateMovesForSuperSandboxMode() {
	if (superSandboxMode && gameController.notationBuilder.status === BRAND_NEW) {
		setIsInReplay(false);
		const moves = gameController.gameNotation.moves;
		if (moves.length > 0 && currentMoveIndex < moves.length) {
			// Save the branch before truncating
			const truncatedMoves = moves.slice(currentMoveIndex);
			saveBranch(currentMoveIndex, truncatedMoves);

			// Now truncate
			const newMoves = moves.slice(0, currentMoveIndex);
			gameController.resetGameNotation();
			newMoves.forEach(m => { gameController.gameNotation.addMove(m); });
		}
	}
}

// Modal UI
export function showSuperSandboxInfoModal() {
	const container = document.createElement('div');

	// Description
	const description = document.createElement('p');
	description.innerHTML = "Super Sandbox mode allows you to explore game variations freely. " +
		"When you rewind to a previous move and then interact with the board, " +
		"the game is automatically sandboxed from that point, discarding any moves that came after.<br /><br />" +
		"This lets you quickly try different move sequences without manually sandboxing each time.";
	container.appendChild(description);

	// Branches section
	if (superSandboxBranches.length > 0) {
		const branchesHeader = document.createElement('h4');
		branchesHeader.textContent = 'Saved Branches';
		branchesHeader.style.marginTop = '16px';
		branchesHeader.style.marginBottom = '8px';
		container.appendChild(branchesHeader);

		const branchList = document.createElement('div');
		branchList.style.maxHeight = '200px';
		branchList.style.overflowY = 'auto';

		superSandboxBranches.forEach(branch => {
			const branchItem = document.createElement('div');
			branchItem.style.display = 'flex';
			branchItem.style.justifyContent = 'space-between';
			branchItem.style.alignItems = 'center';
			branchItem.style.padding = '6px 8px';
			branchItem.style.marginBottom = '4px';
			branchItem.style.backgroundColor = 'rgba(255,255,255,0.05)';
			branchItem.style.borderRadius = '4px';

			// Branch info and jump button
			const branchInfo = document.createElement('span');
			branchInfo.classList.add('clickableText');
			branchInfo.style.flex = '1';
			const moveCount = branch.moveCount;
			const preview = branch.firstMovePreview ? ` → ${branch.firstMovePreview}` : '';
			branchInfo.textContent = `${branch.label} (${moveCount} move${moveCount !== 1 ? 's' : ''})${preview}`;
			branchInfo.onclick = () => jumpToBranch(branch.id);
			branchItem.appendChild(branchInfo);

			// Delete button
			const deleteBtn = document.createElement('span');
			deleteBtn.classList.add('clickableText');
			deleteBtn.style.marginLeft = '12px';
			deleteBtn.style.color = '#c83737';
			deleteBtn.innerHTML = '&times;';
			deleteBtn.title = 'Delete branch';
			deleteBtn.onclick = (e) => {
				e.stopPropagation();
				deleteBranch(branch.id);
				showSuperSandboxInfoModal(); // Refresh modal
			};
			branchItem.appendChild(deleteBtn);

			branchList.appendChild(branchItem);
		});

		container.appendChild(branchList);

		// Clear all button
		if (superSandboxBranches.length > 1) {
			const clearAllBtn = document.createElement('div');
			clearAllBtn.classList.add('clickableText');
			clearAllBtn.style.marginTop = '12px';
			clearAllBtn.style.color = '#c83737';
			clearAllBtn.textContent = 'Clear all branches';
			clearAllBtn.onclick = () => {
				clearBranches();
				showSuperSandboxInfoModal(); // Refresh modal
			};
			container.appendChild(clearAllBtn);
		}
	} else {
		const noBranches = document.createElement('p');
		noBranches.style.fontStyle = 'italic';
		noBranches.style.marginTop = '16px';
		noBranches.textContent = 'No branches saved yet. Rewind and make a move to create a branch.';
		container.appendChild(noBranches);
	}

	showModalElem("Super Sandbox Mode", container);
}
