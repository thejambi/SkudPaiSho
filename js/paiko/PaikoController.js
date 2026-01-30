// Paiko Controller
// Handles UI interaction for Paiko game

import {
	GameType,
	activeAi,
	activeAi2,
	callSubmitMove,
	createGameIfThatIsOk,
	currentMoveIndex,
	finalizeMove,
	getCurrentPlayer,
	myTurn,
	onlinePlayEnabled,
	playingOnlineGame,
	refreshMessage,
	rerunAll,
} from '../PaiShoMain';
import { DEPLOY, MOVE, GUEST, HOST, NotationPoint } from '../CommonNotationObjects';
import { PaikoActuator } from './PaikoActuator';
import { PaikoGameManager } from './PaikoGameManager';
import { PaikoMoveType, PaikoGamePhase } from './PaikoGameNotation';
import { PaikoMoveBuilder, PaikoBuilderStatus } from './PaikoMoveBuilder';
import { TrifleGameNotation } from '../trifle/TrifleGameNotation';
import { PaikoPointState } from './PaikoBoardPoint';
import { PaikoTile, PaikoTileFacing, PaikoTileDefinitions, PaikoTileCode, getAllTileCodes } from './PaikoTile';
import { PaikoAI } from './PaikoAI';
import { debug } from '../GameData';

export class PaikoController {
	constructor(gameContainer, isMobile) {
		this.actuator = new PaikoActuator(gameContainer, isMobile, true);

		this.resetGameManager();
		this.resetNotationBuilder();
		this.resetGameNotation();

		this.isPaiShoGame = false;
		this.selectedDrawTiles = [];
		this.selectedCaptureRewardTiles = [];
		this.pendingDeployMove = null; // For Sai deploy + shift combined move

		// For accumulating setup tiles into single moves
		this.pendingSetupTiles = [];
		// For HOST_SELECT_1 - stores the selected tile until action move is made
		this.pendingHostSetupTile = null;
		// For capture reward - stores selected tiles to bundle with the next move
		this.pendingCaptureRewardData = null;
	}

	getGameTypeId() {
		return GameType.Paiko.id;
	}

	completeSetup() {
		rerunAll();
		this.callActuate();
	}

	resetGameManager() {
		this.theGame = new PaikoGameManager(this.actuator);
	}

	resetNotationBuilder() {
		this.moveBuilder = new PaikoMoveBuilder();
	}

	resetMoveBuilder() {
		this.resetNotationBuilder();
	}

	resetGameNotation() {
		this.gameNotation = this.getNewGameNotation();
	}

	getNewGameNotation() {
		/* Using TrifleGameNotation as it is generic and JSON-based */
		return new TrifleGameNotation();
	}

	static getHostTilesContainerDivs() {
		const container = document.createElement('div');

		// Host Hand Section
		const handLabel = document.createElement('span');
		handLabel.className = 'tileLibraryLabel';
		handLabel.innerHTML = '<strong>Host Hand</strong>';
		container.appendChild(handLabel);
		container.appendChild(document.createElement('br'));

		// Hand tile containers
		['HSword', 'HBow', 'HEarth', 'HFire'].forEach(className => {
			const div = document.createElement('div');
			div.className = className + '-hand';
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr1 = document.createElement('br');
		clearBr1.className = 'clear';
		container.appendChild(clearBr1);

		['HWater', 'HSai', 'HLotus', 'HAir'].forEach(className => {
			const div = document.createElement('div');
			div.className = className + '-hand';
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr2 = document.createElement('br');
		clearBr2.className = 'clear';
		container.appendChild(clearBr2);
		container.appendChild(document.createElement('br'));

		// Host Reserve Section
		const reserveLabel = document.createElement('span');
		reserveLabel.className = 'tileLibraryLabel';
		reserveLabel.innerHTML = '<strong>Host Reserve</strong>';
		container.appendChild(reserveLabel);
		container.appendChild(document.createElement('br'));

		// Reserve tile containers
		['HSword', 'HBow', 'HEarth', 'HFire'].forEach(className => {
			const div = document.createElement('div');
			div.className = className + '-reserve';
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr3 = document.createElement('br');
		clearBr3.className = 'clear';
		container.appendChild(clearBr3);

		['HWater', 'HSai', 'HLotus', 'HAir'].forEach(className => {
			const div = document.createElement('div');
			div.className = className + '-reserve';
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr4 = document.createElement('br');
		clearBr4.className = 'clear';
		container.appendChild(clearBr4);
		container.appendChild(document.createElement('br'));

		// // Host Captured Section
		// const capturedLabel = document.createElement('span');
		// capturedLabel.className = 'tileLibraryLabel';
		// capturedLabel.innerHTML = '<strong>Host Captured</strong>';
		// container.appendChild(capturedLabel);
		// container.appendChild(document.createElement('br'));

		// const capturedDiv = document.createElement('div');
		// capturedDiv.className = 'H-captured';
		// container.appendChild(capturedDiv);

		return container.innerHTML;
	}

	static getGuestTilesContainerDivs() {
		const container = document.createElement('div');

		// Guest Hand Section
		const handLabel = document.createElement('span');
		handLabel.className = 'tileLibraryLabel';
		handLabel.innerHTML = '<strong>Guest Hand</strong>';
		container.appendChild(handLabel);
		container.appendChild(document.createElement('br'));

		// Hand tile containers
		['GSword', 'GBow', 'GEarth', 'GFire'].forEach(className => {
			const div = document.createElement('div');
			div.className = className + '-hand';
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr1 = document.createElement('br');
		clearBr1.className = 'clear';
		container.appendChild(clearBr1);

		['GWater', 'GSai', 'GLotus', 'GAir'].forEach(className => {
			const div = document.createElement('div');
			div.className = className + '-hand';
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr2 = document.createElement('br');
		clearBr2.className = 'clear';
		container.appendChild(clearBr2);
		container.appendChild(document.createElement('br'));

		// Guest Reserve Section
		const reserveLabel = document.createElement('span');
		reserveLabel.className = 'tileLibraryLabel';
		reserveLabel.innerHTML = '<strong>Guest Reserve</strong>';
		container.appendChild(reserveLabel);
		container.appendChild(document.createElement('br'));

		// Reserve tile containers
		['GSword', 'GBow', 'GEarth', 'GFire'].forEach(className => {
			const div = document.createElement('div');
			div.className = className + '-reserve';
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr3 = document.createElement('br');
		clearBr3.className = 'clear';
		container.appendChild(clearBr3);

		['GWater', 'GSai', 'GLotus', 'GAir'].forEach(className => {
			const div = document.createElement('div');
			div.className = className + '-reserve';
			container.appendChild(div);
			container.appendChild(document.createTextNode(' '));
		});

		const clearBr4 = document.createElement('br');
		clearBr4.className = 'clear';
		container.appendChild(clearBr4);
		container.appendChild(document.createElement('br'));

		// Guest Captured Section
		// const capturedLabel = document.createElement('span');
		// capturedLabel.className = 'tileLibraryLabel';
		// capturedLabel.innerHTML = '<strong>Guest Captured</strong>';
		// container.appendChild(capturedLabel);
		// container.appendChild(document.createElement('br'));

		// const capturedDiv = document.createElement('div');
		// capturedDiv.className = 'G-captured';
		// container.appendChild(capturedDiv);

		return container.innerHTML;
	}

	callActuate() {
		this.theGame.actuate();
	}

	resetMove() {
		if (this.moveBuilder.getStatus() === PaikoBuilderStatus.BRAND_NEW) {
			this.gameNotation.removeLastMove();
		}
		rerunAll();
	}

	getDefaultHelpMessageText() {
		return `<h4>Paiko</h4>
			<p>Paiko is a tactical tile game. Win by reaching 10 points!</p>
			<p><strong>Scoring:</strong></p>
			<ul>
				<li>2 points for each tile in opponent's homeground</li>
				<li>1 point for each tile in middleground</li>
			</ul>
			<p>To begin the game, HOST draws 7 tiles from their reserve. Then, GUEST draws 9. Then, HOST draws 1 more tile and takes the first turn.</p>
			<p><strong>On your turn:</strong></p>
			<ul>
				<li><strong>Deploy</strong> - Place a tile from your hand</li>
				<li><strong>Shift</strong> - Move a tile up to 2 spaces</li>
				<li><strong>Draw</strong> - Take 3 tiles from your reserve</li>
			</ul>
			<p>After your action, capture opponent tiles that are threatened by 2 of your tiles (3 if covered).</p>
			<p>If you capture tiles, your opponent must reward you by giving you a tile from your reserve!</p>
			<p>Select tiles to learn more about them.</p>`;
	}

	getAdditionalMessage() {
		const container = document.createElement('span');
		const gameInfo = this.theGame.getGameInfo();

		// Check if we need to enter capture reward mode
		// This happens when there's a pending capture reward and it's the player's turn
		if (this.theGame.hasPendingCaptureReward() &&
			myTurn() &&
			this.moveBuilder.getStatus() === PaikoBuilderStatus.BRAND_NEW) {
			this.moveBuilder.setStatus(PaikoBuilderStatus.SELECTING_CAPTURE_REWARD);
			this.moveBuilder.setPlayer(this.getCurrentPlayer());
			this.selectedCaptureRewardTiles = [];
		}

		// Show rotation options at the very top when selecting facing direction
		if (this.moveBuilder.getStatus() === PaikoBuilderStatus.SELECTING_ROTATION) {
			const rotateContainer = document.createElement('span');

			const headerP = document.createElement('p');
			headerP.innerHTML = '<strong>Select facing direction:</strong>';
			rotateContainer.appendChild(headerP);

			// Create joystick-like grid layout
			const gridDiv = document.createElement('span');
			gridDiv.style.display = 'grid';
			gridDiv.style.gridTemplateColumns = 'auto auto auto';
			gridDiv.style.gap = '4px';
			gridDiv.style.justifyContent = 'start';
			gridDiv.style.textAlign = 'center';
			gridDiv.style.marginLeft = '20px';

			const self = this;
			const createButton = (name, facing) => {
				const btn = document.createElement('span');
				btn.className = 'skipBonus';
				btn.textContent = name;
				btn.style.minWidth = '50px';
				btn.style.display = 'inline-block';
				btn.onclick = () => self.selectFacing(facing);
				return btn;
			};

			const createEmpty = () => {
				const empty = document.createElement('span');
				empty.style.minWidth = '50px';
				return empty;
			};

			// Row 1: empty, Up, empty
			gridDiv.appendChild(createEmpty());
			gridDiv.appendChild(createButton('Up', PaikoTileFacing.UP));
			gridDiv.appendChild(createEmpty());

			// Row 2: Left, empty, Right
			gridDiv.appendChild(createButton('Left', PaikoTileFacing.LEFT));
			gridDiv.appendChild(createEmpty());
			gridDiv.appendChild(createButton('Right', PaikoTileFacing.RIGHT));

			// Row 3: empty, Down, empty
			gridDiv.appendChild(createEmpty());
			gridDiv.appendChild(createButton('Down', PaikoTileFacing.DOWN));
			gridDiv.appendChild(createEmpty());

			rotateContainer.appendChild(gridDiv);
			container.appendChild(rotateContainer);
		}

		// Show draw selection UI when selecting tiles to draw
		if (this.moveBuilder.getStatus() === PaikoBuilderStatus.SELECTING_DRAW_TILES) {
			const drawContainer = document.createElement('span');

			const drawHeader = document.createElement('p');
			const remaining = 3 - (this.selectedDrawTiles?.length || 0);
			drawHeader.innerHTML = `<strong>Select tiles to draw (${remaining} remaining):</strong> Click tiles in your reserve`;
			drawContainer.appendChild(drawHeader);

			// Show selected tiles
			if (this.selectedDrawTiles && this.selectedDrawTiles.length > 0) {
				const selectedP = document.createElement('p');
				selectedP.innerHTML = '<strong>Selected:</strong> ';

				this.selectedDrawTiles.forEach((tileCode, index) => {
					if (index > 0) selectedP.appendChild(document.createTextNode(', '));
					const tileSpan = document.createElement('span');
					tileSpan.className = 'skipBonus';
					tileSpan.textContent = tileCode + ' ✕';
					tileSpan.onclick = () => this.deselectTileForDraw(index);
					selectedP.appendChild(tileSpan);
				});

				drawContainer.appendChild(selectedP);
			}

			// Show confirm/cancel buttons
			const buttonsP = document.createElement('p');

			if (this.selectedDrawTiles && this.selectedDrawTiles.length > 0) {
				const confirmSpan = document.createElement('span');
				confirmSpan.className = 'skipBonus';
				confirmSpan.textContent = 'Confirm Draw';
				confirmSpan.onclick = () => this.confirmDraw();
				buttonsP.appendChild(confirmSpan);

				buttonsP.appendChild(document.createTextNode(' | '));
			}

			const cancelSpan = document.createElement('span');
			cancelSpan.className = 'skipBonus';
			cancelSpan.textContent = 'Cancel';
			cancelSpan.onclick = () => this.cancelDraw();
			buttonsP.appendChild(cancelSpan);

			drawContainer.appendChild(buttonsP);
			container.appendChild(drawContainer);
		}

		// Show Sai shift UI after deploying Sai
		if (this.moveBuilder.getStatus() === PaikoBuilderStatus.WAITING_FOR_SAI_SHIFT) {
			const saiContainer = document.createElement('span');

			const saiHeader = document.createElement('p');
			saiHeader.innerHTML = '<strong>Sai Deployed!</strong> Sai can shift up to 2 spaces immediately. Click a destination on the board or:';
			saiContainer.appendChild(saiHeader);

			const buttonsP = document.createElement('p');
			const skipSpan = document.createElement('span');
			skipSpan.className = 'skipBonus';
			skipSpan.textContent = 'Skip Sai Shift';
			skipSpan.onclick = () => this.skipSaiShift();
			buttonsP.appendChild(skipSpan);

			saiContainer.appendChild(buttonsP);
			container.appendChild(saiContainer);
		}

		// Show capture reward UI when opponent must choose tiles for capturing player
		if (this.moveBuilder.getStatus() === PaikoBuilderStatus.SELECTING_CAPTURE_REWARD) {
			const rewardContainer = document.createElement('span');
			const pendingReward = this.theGame.getPendingCaptureReward();
			const capturingPlayer = pendingReward.capturingPlayer;
			const remaining = pendingReward.rewardCount - (this.selectedCaptureRewardTiles?.length || 0);

			const rewardHeader = document.createElement('p');
			rewardHeader.innerHTML = `<strong>Capture Reward:</strong> Your opponent captured your tiles! Choose ${remaining} tile(s) from their reserve to give them.`;
			rewardContainer.appendChild(rewardHeader);

			// Show selected tiles
			if (this.selectedCaptureRewardTiles && this.selectedCaptureRewardTiles.length > 0) {
				const selectedP = document.createElement('p');
				selectedP.innerHTML = '<strong>Selected:</strong> ';

				this.selectedCaptureRewardTiles.forEach((tileCode, index) => {
					if (index > 0) selectedP.appendChild(document.createTextNode(', '));
					const tileSpan = document.createElement('span');
					tileSpan.className = 'skipBonus';
					tileSpan.textContent = tileCode + ' ✕';
					tileSpan.onclick = () => this.deselectCaptureRewardTile(index);
					selectedP.appendChild(tileSpan);
				});

				rewardContainer.appendChild(selectedP);
			}

			// Show confirm button when all tiles are selected
			if (this.selectedCaptureRewardTiles && this.selectedCaptureRewardTiles.length >= pendingReward.rewardCount) {
				const confirmP = document.createElement('p');
				const confirmSpan = document.createElement('span');
				confirmSpan.className = 'skipBonus';
				confirmSpan.textContent = 'Confirm Reward';
				confirmSpan.onclick = () => this.confirmCaptureReward();
				confirmP.appendChild(confirmSpan);
				rewardContainer.appendChild(confirmP);
			}

			container.appendChild(rewardContainer);
		}

		// Setup phase messages
		if (gameInfo.phase === PaikoGamePhase.HOST_SELECT_7) {
			const msg = document.createElement('p');
			msg.innerHTML = `<strong>Setup Phase:</strong> Host, select ${gameInfo.remainingSelection} more tiles from your reserve.`;
			container.appendChild(msg);
		} else if (gameInfo.phase === PaikoGamePhase.GUEST_SELECT_9) {
			const msg = document.createElement('p');
			msg.innerHTML = `<strong>Setup Phase:</strong> Guest, select ${gameInfo.remainingSelection} more tiles from your reserve.`;
			container.appendChild(msg);
		} else if (gameInfo.phase === PaikoGamePhase.HOST_SELECT_1) {
			const msg = document.createElement('p');
			msg.innerHTML = `<strong>Setup Phase:</strong> Host, select ${gameInfo.remainingSelection} more tile from your reserve.`;
			container.appendChild(msg);
		} else {
			// Main game - show scores
			const scores = document.createElement('p');
			scores.innerHTML = `<strong>Scores:</strong> Host: ${gameInfo.scores.host} | Guest: ${gameInfo.scores.guest}`;
			container.appendChild(scores);

			// Show action options if not in special selection modes
			const status = this.moveBuilder.getStatus();
			if (status !== PaikoBuilderStatus.SELECTING_ROTATION &&
				status !== PaikoBuilderStatus.SELECTING_DRAW_TILES &&
				status !== PaikoBuilderStatus.SELECTING_CAPTURE_REWARD &&
				status !== PaikoBuilderStatus.WAITING_FOR_SAI_SHIFT &&
				myTurn() && !gameInfo.winner) {
				const actions = document.createElement('p');
				actions.innerHTML = '<strong>Your turn:</strong> Deploy a tile from your hand, shift a tile on the board, or ';

				const drawSpan = document.createElement('span');
				drawSpan.className = 'skipBonus';
				drawSpan.textContent = 'draw 3 tiles';
				drawSpan.onclick = () => this.drawTiles();
				actions.appendChild(drawSpan);

				container.appendChild(actions);
			}
		}

		// Winner message
		if (gameInfo.winner) {
			const winMsg = document.createElement('p');
			winMsg.innerHTML = `<strong>${this.theGame.getWinReason()}</strong>`;
			container.appendChild(winMsg);
		}

		return container;
	}

	// Handle clicking on an unplayed tile (from hand or reserve)
	unplayedTileClicked(tileDiv) {
		if (!myTurn()) {
			debug("Not your turn!");
			return;
		}

		if (currentMoveIndex !== this.gameNotation.moves.length) {
			debug("Can only interact if all moves are played.");
			return;
		}

		const pileName = tileDiv.getAttribute('data-pileName');
		const tileCode = tileDiv.getAttribute('data-tileCode');
		const currentPlayer = this.getCurrentPlayer();

		// Handle draw selection mode - clicking on reserve to select tiles to draw
		if (this.moveBuilder.getStatus() === PaikoBuilderStatus.SELECTING_DRAW_TILES) {
			const isOwnReserve = (currentPlayer === HOST && pileName === 'hostReserve') ||
				(currentPlayer === GUEST && pileName === 'guestReserve');

			if (isOwnReserve) {
				this.selectTileForDraw(tileCode);
			} else {
				debug("Select tiles from your own reserve");
			}
			return;
		}

		// Handle capture reward selection mode - clicking on opponent's (capturing player's) reserve
		if (this.moveBuilder.getStatus() === PaikoBuilderStatus.SELECTING_CAPTURE_REWARD) {
			const pendingReward = this.theGame.getPendingCaptureReward();
			if (pendingReward) {
				const capturingPlayer = pendingReward.capturingPlayer;
				const isCapturingPlayerReserve = (capturingPlayer === HOST && pileName === 'hostReserve') ||
					(capturingPlayer === GUEST && pileName === 'guestReserve');

				if (isCapturingPlayerReserve) {
					this.selectCaptureRewardTile(tileCode);
				} else {
					debug("Select tiles from your opponent's reserve");
				}
			}
			return;
		}

		// Setup phase - selecting tiles for hand
		if (this.theGame.isSetupPhase()) {
			const isHostReserve = pileName === 'hostReserve';
			const isGuestReserve = pileName === 'guestReserve';

			// Validate correct player is selecting
			if (this.theGame.gamePhase === PaikoGamePhase.HOST_SELECT_7 ||
				this.theGame.gamePhase === PaikoGamePhase.HOST_SELECT_1) {
				if (!isHostReserve) {
					debug("Host must select from Host reserve");
					return;
				}
			} else if (this.theGame.gamePhase === PaikoGamePhase.GUEST_SELECT_9) {
				if (!isGuestReserve) {
					debug("Guest must select from Guest reserve");
					return;
				}
			}

			// Handle HOST_SELECT_1 specially - store tile and wait for action move
			if (this.theGame.gamePhase === PaikoGamePhase.HOST_SELECT_1) {
				this.pendingHostSetupTile = tileCode;
				// Draw the tile to hand immediately for UI purposes
				this.theGame.tileManager.drawTileFromReserve(HOST, tileCode);
				this.theGame.gamePhase = PaikoGamePhase.PLAYING;
				this.callActuate();
				refreshMessage();
				return;
			}

			// Accumulate selected tiles
			this.pendingSetupTiles.push(tileCode);
			// Draw the tile to hand immediately for UI purposes
			this.theGame.tileManager.drawTileFromReserve(currentPlayer, tileCode);

			// Determine target count for this phase
			const targetCount = this.theGame.gamePhase === PaikoGamePhase.HOST_SELECT_7 ? 7 : 9;

			// Check if we've reached the target
			if (this.pendingSetupTiles.length >= targetCount) {
				// Create the move with all selected tiles
				this.moveBuilder.buildSelectMove(currentPlayer, [...this.pendingSetupTiles]);
				const move = this.moveBuilder.getNotationMove(this.gameNotation);
				// Don't run the move - tiles are already in hand. Just add to notation.
				this.gameNotation.addMove(move);

				// Advance game phase
				if (this.theGame.gamePhase === PaikoGamePhase.HOST_SELECT_7) {
					this.theGame.gamePhase = PaikoGamePhase.GUEST_SELECT_9;
				} else if (this.theGame.gamePhase === PaikoGamePhase.GUEST_SELECT_9) {
					this.theGame.gamePhase = PaikoGamePhase.HOST_SELECT_1;
				}

				// Reset accumulated tiles
				this.pendingSetupTiles = [];
				this.resetNotationBuilder();

				this.callActuate();

				// Start online game after HOST finishes selecting 7 tiles
				if (onlinePlayEnabled && this.theGame.gamePhase === PaikoGamePhase.GUEST_SELECT_9 && this.gameNotation.moves.length === 1) {
					this.startOnlineGame();
				} else if (playingOnlineGame()) {
					callSubmitMove();
				} else {
					finalizeMove();
				}
			} else {
				// Just update UI to show selected tile in hand
				this.callActuate();
				refreshMessage();
			}
			return;
		}

		// Main game - deploying from hand
		const isHostHand = pileName === 'hostHand';
		const isGuestHand = pileName === 'guestHand';

		if ((currentPlayer === HOST && !isHostHand) || (currentPlayer === GUEST && !isGuestHand)) {
			debug("Must deploy from your own hand");
			return;
		}

		// Start deploy action
		this.moveBuilder.setStatus(PaikoBuilderStatus.SELECTING_DEPLOY_LOCATION);
		this.moveBuilder.setMoveType(DEPLOY);
		this.moveBuilder.setTileCode(tileCode);
		this.moveBuilder.setPlayer(currentPlayer);

		// Show possible deployment points
		const tempTile = new PaikoTile(tileCode, currentPlayer === HOST ? 'H' : 'G');
		const deployPoints = this.theGame.board.getPossibleDeploymentPoints(currentPlayer, tempTile);
		this.theGame.board.markPossibleDeploys(deployPoints);

		this.callActuate();
	}

	// Handle clicking on a board point
	pointClicked(htmlPoint) {
		if (this.theGame.getWinner()) {
			return;
		}

		// Allow interaction during Sai shift even though move index doesn't match yet
		const inSaiShiftMode = this.moveBuilder.getStatus() === PaikoBuilderStatus.WAITING_FOR_SAI_SHIFT;
		if (currentMoveIndex !== this.gameNotation.moves.length && !inSaiShiftMode) {
			debug("Can only interact if all moves are played.");
			return;
		}

		const npText = htmlPoint.getAttribute('name');
		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		const boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
		const currentPlayer = this.getCurrentPlayer();

		// Handle based on current builder status
		if (this.moveBuilder.getStatus() === PaikoBuilderStatus.BRAND_NEW) {
			if (!myTurn()) {
				return;
			}

			// Clicking on own tile starts shift
			if (boardPoint.hasTile() && boardPoint.tile.ownerName === currentPlayer) {
				const tile = boardPoint.tile;

				if (!tile.canShift()) {
					debug("This tile cannot shift");
					return;
				}

				this.moveBuilder.setStatus(PaikoBuilderStatus.SELECTING_SHIFT_DESTINATION);
				this.moveBuilder.setMoveType(MOVE);
				this.moveBuilder.setStartPoint(notationPoint);
				this.moveBuilder.setPlayer(currentPlayer);

				// Show possible shift destinations
				const shiftDestinations = this.theGame.board.getPossibleShiftDestinations(boardPoint, currentPlayer);
				this.theGame.board.markPossibleMoves(shiftDestinations);

				// Mark selected point
				boardPoint.addState(PaikoPointState.SELECTED);

				this.callActuate();
			}
		} else if (this.moveBuilder.getStatus() === PaikoBuilderStatus.SELECTING_DEPLOY_LOCATION) {
			// Trying to deploy
			if (boardPoint.hasState(PaikoPointState.POSSIBLE_DEPLOY)) {
				this.theGame.board.clearAllPointStates();

				this.moveBuilder.setEndPoint(notationPoint);

				// Check if tile has facing - if so, need to select facing
				const tempTile = new PaikoTile(this.moveBuilder.getMoveData('tileCode'), currentPlayer === HOST ? 'H' : 'G');
				if (tempTile.hasFacing()) {
					this.moveBuilder.setStatus(PaikoBuilderStatus.SELECTING_ROTATION);
					this.showRotationSelector();
				} else {
					this.moveBuilder.setFacing(PaikoTileFacing.UP);
					this.finalizeDeploy();
				}
			} else {
				// Cancel deploy
				this.theGame.board.clearAllPointStates();
				this.resetNotationBuilder();
				this.callActuate();
			}
		} else if (this.moveBuilder.getStatus() === PaikoBuilderStatus.SELECTING_SHIFT_DESTINATION) {
			if (boardPoint.hasState(PaikoPointState.POSSIBLE_MOVE)) {
				this.theGame.board.clearAllPointStates();

				this.moveBuilder.setEndPoint(notationPoint);

				// Get the tile being moved
				const startPoint = this.moveBuilder.getMoveData('startPoint');
				const startNotationPoint = new NotationPoint(startPoint);
				const startRowCol = startNotationPoint.rowAndColumn;
				const startBoardPoint = this.theGame.board.cells[startRowCol.row][startRowCol.col];
				const tile = startBoardPoint.tile;

				// Check if rotating in place or actually moving
				const samePoint = startRowCol.row === rowCol.row && startRowCol.col === rowCol.col;

				if (tile.hasFacing()) {
					this.moveBuilder.setStatus(PaikoBuilderStatus.SELECTING_ROTATION);
					this.showRotationSelector();
				} else {
					if (samePoint) {
						// Can't rotate non-facing tile in place
						this.resetNotationBuilder();
						this.callActuate();
					} else {
						this.moveBuilder.setFacing(PaikoTileFacing.UP);
						this.finalizeShift();
					}
				}
			} else {
				// Cancel shift
				this.theGame.board.clearAllPointStates();
				this.resetNotationBuilder();
				this.callActuate();
			}
		} else if (this.moveBuilder.getStatus() === PaikoBuilderStatus.WAITING_FOR_SAI_SHIFT) {
			// Handle Sai shift after deploy
			if (boardPoint.hasState(PaikoPointState.POSSIBLE_MOVE)) {
				this.theGame.board.clearAllPointStates();

				// Get Sai's current position from pending shift
				const saiPoint = this.theGame.pendingSaiShift.point;
				const saiTile = this.theGame.pendingSaiShift.tile;
				const startNotationPoint = this.theGame.board.getNotationPointFromRowCol(saiPoint.row, saiPoint.col);

				this.moveBuilder.setStartPoint(startNotationPoint);
				this.moveBuilder.setEndPoint(notationPoint);

				// Sai has facing, so need to select rotation
				if (saiTile.hasFacing()) {
					this.moveBuilder.setStatus(PaikoBuilderStatus.SELECTING_ROTATION);
					this.showRotationSelector();
				} else {
					this.moveBuilder.setFacing(PaikoTileFacing.UP);
					this.finalizeSaiShift();
				}
			} else {
				// Clicking elsewhere doesn't cancel - user must click Skip or a valid destination
			}
		}
	}

	showRotationSelector() {
		// Show rotation options in UI by refreshing the message area
		// The getAdditionalMessage will show the facing direction options
		refreshMessage();
	}

	selectFacing(facing) {
		this.moveBuilder.setFacing(facing);

		// Check if this is facing selection for Sai shift (pending deploy exists)
		if (this.pendingDeployMove) {
			this.finalizeSaiShift();
		} else if (this.moveBuilder.getMoveType() === DEPLOY) {
			this.finalizeDeploy();
		} else if (this.moveBuilder.getMoveType() === MOVE) {
			// If rotating in place, change move type to ROTATE
			const startPoint = this.moveBuilder.getMoveData('startPoint');
			const endPoint = this.moveBuilder.getMoveData('endPoint');
			if (startPoint === endPoint) {
				this.moveBuilder.setMoveType(PaikoMoveType.ROTATE);
			}
			this.finalizeShift();
		}
	}

	finalizeDeploy() {
		const move = this.moveBuilder.getNotationMove(this.gameNotation);
		const tileCode = this.moveBuilder.getMoveData('tileCode');
		const endPointText = this.moveBuilder.getMoveData('endPoint');
		const currentPlayer = this.getCurrentPlayer();

		// Bundle pending setup tile if this is HOST's first action
		if (this.pendingHostSetupTile && currentPlayer === HOST) {
			move.moveData.setupTile = this.pendingHostSetupTile;
			this.pendingHostSetupTile = null;
		}

		// Bundle pending capture reward if opponent selected tiles for us
		if (this.pendingCaptureRewardData) {
			move.moveData.captureReward = this.pendingCaptureRewardData;
			this.pendingCaptureRewardData = null;
		}

		// Check if this is Sai with shift ability
		const tempTile = new PaikoTile(tileCode, currentPlayer === HOST ? 'H' : 'G');
		const isSaiWithShift = tempTile.hasSpecialRule('shiftAfterDeploy');

		// Validate move doesn't capture own tile
		const gameCopy = this.theGame.getCopy();
		gameCopy.runNotationMove(move, false);
		if (!gameCopy.validateMoveDoesntCaptureOwn(this.moveBuilder.getPlayer())) {
			debug("Move would result in your own tile being captured!");
			this.resetNotationBuilder();
			this.callActuate();
			return;
		}

		// Execute the deploy visually
		this.theGame.runNotationMove(move);

		if (isSaiWithShift) {
			// Store the pending deploy move - we'll add shift data before recording
			this.pendingDeployMove = move;

			// Enter Sai shift mode
			this.moveBuilder.setStatus(PaikoBuilderStatus.WAITING_FOR_SAI_SHIFT);

			// Show possible shift destinations for Sai
			const saiPoint = this.theGame.board.getPointFromNotation(endPointText);
			const shiftDestinations = this.theGame.board.getPossibleShiftDestinations(saiPoint, currentPlayer);
			this.theGame.board.markPossibleMoves(shiftDestinations);

			this.callActuate();
			refreshMessage();
			return;
		}

		// Normal deploy - record the move
		this.gameNotation.addMove(move);
		this.resetNotationBuilder();

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	finalizeShift() {
		const move = this.moveBuilder.getNotationMove(this.gameNotation);
		const currentPlayer = this.getCurrentPlayer();

		// Bundle pending setup tile if this is HOST's first action
		if (this.pendingHostSetupTile && currentPlayer === HOST) {
			move.moveData.setupTile = this.pendingHostSetupTile;
			this.pendingHostSetupTile = null;
		}

		// Bundle pending capture reward if opponent selected tiles for us
		if (this.pendingCaptureRewardData) {
			move.moveData.captureReward = this.pendingCaptureRewardData;
			this.pendingCaptureRewardData = null;
		}

		// Validate move doesn't capture own tile
		const gameCopy = this.theGame.getCopy();
		gameCopy.runNotationMove(move, false);
		if (!gameCopy.validateMoveDoesntCaptureOwn(this.moveBuilder.getPlayer())) {
			debug("Move would result in your own tile being captured!");
			this.resetNotationBuilder();
			this.callActuate();
			return;
		}

		this.theGame.runNotationMove(move);
		this.gameNotation.addMove(move);

		this.resetNotationBuilder();

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	// Skip the optional Sai shift after deploy
	skipSaiShift() {
		if (this.moveBuilder.getStatus() !== PaikoBuilderStatus.WAITING_FOR_SAI_SHIFT) {
			return;
		}

		// Record the deploy move without shift data
		if (this.pendingDeployMove) {
			this.gameNotation.addMove(this.pendingDeployMove);
			this.pendingDeployMove = null;
		}

		// Clear pending Sai shift state
		if (this.theGame.pendingSaiShift) {
			this.theGame.pendingSaiShift.tile.justDeployed = false;
			this.theGame.pendingSaiShift = null;
		}

		this.theGame.board.clearAllPointStates();
		this.resetNotationBuilder();

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	// Finalize the Sai shift after deploy
	finalizeSaiShift() {
		const currentPlayer = this.getCurrentPlayer();
		const endPointText = this.moveBuilder.getMoveData('endPoint');
		const facing = this.moveBuilder.getMoveData('facing');

		if (!this.pendingDeployMove) {
			debug("No pending deploy move for Sai shift!");
			return;
		}

		// Get Sai's current position (where it was deployed)
		const deployEndPoint = this.pendingDeployMove.moveData.endPoint;

		// Validate the shift doesn't capture own tile
		// Create a copy and simulate the shift
		const gameCopy = this.theGame.getCopy();
		gameCopy.board.moveTile(deployEndPoint, endPointText, true);
		const shiftedPoint = gameCopy.board.getPointFromNotation(endPointText);
		if (shiftedPoint && shiftedPoint.tile && shiftedPoint.tile.hasFacing() && facing !== undefined) {
			shiftedPoint.tile.setFacing(facing);
		}
		gameCopy.board.recalculateThreatAndCover();

		if (!gameCopy.validateMoveDoesntCaptureOwn(currentPlayer)) {
			debug("Move would result in your own tile being captured!");
			// Re-show shift destinations
			const saiPoint = this.theGame.board.getPointFromNotation(deployEndPoint);
			const shiftDestinations = this.theGame.board.getPossibleShiftDestinations(saiPoint, currentPlayer);
			this.theGame.board.markPossibleMoves(shiftDestinations);
			this.moveBuilder.setStatus(PaikoBuilderStatus.WAITING_FOR_SAI_SHIFT);
			this.callActuate();
			refreshMessage();
			return;
		}

		// Execute the shift visually on the actual game
		this.theGame.board.moveTile(deployEndPoint, endPointText, true);
		const actualShiftedPoint = this.theGame.board.getPointFromNotation(endPointText);
		if (actualShiftedPoint && actualShiftedPoint.tile) {
			if (actualShiftedPoint.tile.hasFacing() && facing !== undefined) {
				actualShiftedPoint.tile.setFacing(facing);
			}
			actualShiftedPoint.tile.justDeployed = false;
		}
		this.theGame.board.recalculateThreatAndCover();

		// Add shift data to the pending deploy move
		this.pendingDeployMove.moveData.shiftEndPoint = endPointText;
		this.pendingDeployMove.moveData.shiftFacing = facing;

		// Record the complete combined move
		this.gameNotation.addMove(this.pendingDeployMove);
		this.pendingDeployMove = null;

		// Clear pending Sai shift state
		this.theGame.pendingSaiShift = null;

		this.resetNotationBuilder();

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	// Draw action (draw up to 3 tiles from reserve)
	drawTiles() {
		if (!myTurn()) {
			return;
		}

		const currentPlayer = this.getCurrentPlayer();
		const availableTiles = this.theGame.tileManager.getAvailableTileTypes(currentPlayer);

		if (availableTiles.length === 0) {
			debug("Reserve is empty!");
			return;
		}

		// Enter draw selection mode
		this.moveBuilder.setStatus(PaikoBuilderStatus.SELECTING_DRAW_TILES);
		this.moveBuilder.setPlayer(currentPlayer);
		this.moveBuilder.setMoveType(PaikoMoveType.DRAW);
		this.selectedDrawTiles = [];

		// Refresh message to show draw selection UI
		refreshMessage();
	}

	// Select a tile to draw from reserve
	selectTileForDraw(tileCode) {
		if (this.moveBuilder.getStatus() !== PaikoBuilderStatus.SELECTING_DRAW_TILES) {
			return;
		}

		// Check if already at max
		if (this.selectedDrawTiles.length >= 3) {
			debug("Already selected 3 tiles");
			return;
		}

		// Check if tile is available in reserve
		const currentPlayer = this.getCurrentPlayer();
		const availableTiles = this.theGame.tileManager.getAvailableTileTypes(currentPlayer);
		if (!availableTiles.includes(tileCode)) {
			debug("Tile not available in reserve");
			return;
		}

		// Add to selection
		this.selectedDrawTiles.push(tileCode);

		// Auto-confirm if we've selected 3
		if (this.selectedDrawTiles.length >= 3) {
			this.confirmDraw();
		} else {
			// Refresh to show updated selection
			refreshMessage();
		}
	}

	// Remove a tile from draw selection
	deselectTileForDraw(index) {
		if (this.moveBuilder.getStatus() !== PaikoBuilderStatus.SELECTING_DRAW_TILES) {
			return;
		}

		this.selectedDrawTiles.splice(index, 1);
		refreshMessage();
	}

	// Confirm the draw action
	confirmDraw() {
		if (this.moveBuilder.getStatus() !== PaikoBuilderStatus.SELECTING_DRAW_TILES) {
			return;
		}

		if (this.selectedDrawTiles.length === 0) {
			debug("Must select at least 1 tile to draw");
			return;
		}

		const currentPlayer = this.getCurrentPlayer();
		this.moveBuilder.buildDrawMove(currentPlayer, this.selectedDrawTiles);

		const move = this.moveBuilder.getNotationMove(this.gameNotation);

		// Bundle pending setup tile if this is HOST's first action
		if (this.pendingHostSetupTile && currentPlayer === HOST) {
			move.moveData.setupTile = this.pendingHostSetupTile;
			this.pendingHostSetupTile = null;
		}

		// Bundle pending capture reward if opponent selected tiles for us
		if (this.pendingCaptureRewardData) {
			move.moveData.captureReward = this.pendingCaptureRewardData;
			this.pendingCaptureRewardData = null;
		}

		this.theGame.runNotationMove(move);
		this.gameNotation.addMove(move);

		this.selectedDrawTiles = [];
		this.resetNotationBuilder();

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	// Cancel the draw action
	cancelDraw() {
		this.selectedDrawTiles = [];
		this.resetNotationBuilder();
		refreshMessage();
	}

	// Enter capture reward selection mode
	enterCaptureRewardMode() {
		if (!this.theGame.hasPendingCaptureReward()) {
			return;
		}

		const currentPlayer = this.getCurrentPlayer();
		this.moveBuilder.setStatus(PaikoBuilderStatus.SELECTING_CAPTURE_REWARD);
		this.moveBuilder.setPlayer(currentPlayer);
		this.selectedCaptureRewardTiles = [];

		refreshMessage();
	}

	// Select a tile for capture reward (from opponent's reserve)
	selectCaptureRewardTile(tileCode) {
		if (this.moveBuilder.getStatus() !== PaikoBuilderStatus.SELECTING_CAPTURE_REWARD) {
			return;
		}

		const pendingReward = this.theGame.getPendingCaptureReward();
		if (!pendingReward) {
			return;
		}

		// Check if already at max
		if (this.selectedCaptureRewardTiles.length >= pendingReward.rewardCount) {
			debug("Already selected enough tiles");
			return;
		}

		// Check if tile is available in the capturing player's reserve
		const capturingPlayer = pendingReward.capturingPlayer;
		const availableTiles = this.theGame.tileManager.getAvailableTileTypes(capturingPlayer);
		if (!availableTiles.includes(tileCode)) {
			debug("Tile not available in reserve");
			return;
		}

		// Add to selection
		this.selectedCaptureRewardTiles.push(tileCode);

		// Auto-confirm if we've selected enough
		if (this.selectedCaptureRewardTiles.length >= pendingReward.rewardCount) {
			this.confirmCaptureReward();
		} else {
			refreshMessage();
		}
	}

	// Remove a tile from capture reward selection
	deselectCaptureRewardTile(index) {
		if (this.moveBuilder.getStatus() !== PaikoBuilderStatus.SELECTING_CAPTURE_REWARD) {
			return;
		}

		this.selectedCaptureRewardTiles.splice(index, 1);
		refreshMessage();
	}

	// Confirm the capture reward selection
	// Instead of creating a separate move, store the data to bundle with the next action move
	confirmCaptureReward() {
		if (this.moveBuilder.getStatus() !== PaikoBuilderStatus.SELECTING_CAPTURE_REWARD) {
			return;
		}

		const pendingReward = this.theGame.getPendingCaptureReward();
		if (!pendingReward) {
			return;
		}

		if (this.selectedCaptureRewardTiles.length === 0) {
			debug("Must select tiles for capture reward");
			return;
		}

		// Store the capture reward data to bundle with the next move
		this.pendingCaptureRewardData = {
			forPlayer: pendingReward.capturingPlayer,
			tiles: [...this.selectedCaptureRewardTiles]
		};

		// Execute the reward immediately so tiles go to the capturing player
		this.selectedCaptureRewardTiles.forEach(tileCode => {
			this.theGame.tileManager.drawTileFromReserve(pendingReward.capturingPlayer, tileCode);
		});

		// Clear the pending reward in game state
		this.theGame.clearPendingCaptureReward();

		this.selectedCaptureRewardTiles = [];
		this.resetNotationBuilder();

		// Now the player can make their regular move
		this.callActuate();
		refreshMessage();
	}

	getCurrentPlayer() {
		// Use the game manager's tracked current player
		return this.theGame.currentPlayer;
	}

	// Generate an HTML grid showing the tile's threat and cover patterns
	generatePatternGrid(tile, ownerName) {
		const threatPattern = tile.getThreatPattern();
		const coverPattern = tile.getCoverPattern();

		// Use 5x5 grid
		const gridSize = 5;

		// Default center position
		let centerRow = 2;
		let centerCol = 2;

		// Bow needs special positioning - offset back from facing direction
		// so its long-range threat pattern (extends 4 spaces) is visible
		if (tile.code === 'Bow') {
			const facing = tile.getFacing ? tile.getFacing() : PaikoTileFacing.UP;
			switch (facing) {
				case PaikoTileFacing.UP:
					centerRow = 4; // Move to bottom so upward threats are visible
					break;
				case PaikoTileFacing.DOWN:
					centerRow = 0; // Move to top so downward threats are visible
					break;
				case PaikoTileFacing.RIGHT:
					centerCol = 0; // Move to left so rightward threats are visible
					break;
				case PaikoTileFacing.LEFT:
					centerCol = 4; // Move to right so leftward threats are visible
					break;
			}
		}

		// Build grid data
		const grid = [];
		for (let r = 0; r < gridSize; r++) {
			grid[r] = [];
			for (let c = 0; c < gridSize; c++) {
				grid[r][c] = { threat: false, cover: false, tile: false };
			}
		}

		// Mark tile position
		grid[centerRow][centerCol].tile = true;

		// Mark threat positions
		threatPattern.forEach(([row, col]) => {
			const gridRow = centerRow + row;
			const gridCol = centerCol + col;
			if (gridRow >= 0 && gridRow < gridSize && gridCol >= 0 && gridCol < gridSize) {
				grid[gridRow][gridCol].threat = true;
			}
		});

		// Mark cover positions
		coverPattern.forEach(([row, col]) => {
			const gridRow = centerRow + row;
			const gridCol = centerCol + col;
			if (gridRow >= 0 && gridRow < gridSize && gridCol >= 0 && gridCol < gridSize) {
				grid[gridRow][gridCol].cover = true;
			}
		});

		// Generate HTML table
		const cellSize = '24px';
		const ownerColor = ownerName === HOST ? '#d44' : '#48d';
		const tileImgSrc = `images/Paiko/${ownerName === HOST ? 'H' : 'G'}${tile.code}.png`;

		// Calculate rotation for tile image based on facing
		// UP=0, RIGHT=1, DOWN=2, LEFT=3 -> 0, 90, 180, 270 degrees
		const facing = tile.getFacing ? tile.getFacing() : PaikoTileFacing.UP;
		const rotationDeg = facing * 90;

		let html = '<table style="border-collapse: collapse; margin: 8px auto;">';
		for (let r = 0; r < gridSize; r++) {
			html += '<tr>';
			for (let c = 0; c < gridSize; c++) {
				const cell = grid[r][c];
				let bgColor = '#f5f5f5';
				let content = '';
				let borderColor = '#ddd';

				if (cell.tile) {
					// Tile position - show small tile image, rotated to match facing
					bgColor = ownerColor;
					const rotateStyle = rotationDeg !== 0 ? `transform: rotate(${rotationDeg}deg);` : '';
					content = `<img src="${tileImgSrc}" style="width: 24px; height: 24px; display: block; ${rotateStyle}">`;
				} else if (cell.threat && cell.cover) {
					// Both threat and cover
					bgColor = '#b8a';
					content = '<span style="font-size: 10px; font-weight: bold; color: #fff;">T+C</span>';
				} else if (cell.threat) {
					// Threat only
					bgColor = '#e66';
					content = '<span style="font-size: 12px; font-weight: bold; color: #fff;">&nbsp</span>';
				} else if (cell.cover) {
					// Cover only
					bgColor = '#6a6';
					content = '<span style="font-size: 12px; font-weight: bold; color: #fff;">&nbsp</span>';
				}

				html += `<td style="width: ${cellSize}; height: ${cellSize}; text-align: center; vertical-align: middle; background: ${bgColor}; border: 1px solid ${borderColor};">${content}</td>`;
			}
			html += '</tr>';
		}
		html += '</table>';

		// Add legend
		html += '<div style="font-size: 11px; text-align: center; margin-top: 4px;">';
		html += '<span style="background: #e66; color: #fff; padding: 1px 4px; margin-right: 4px;">&nbsp;</span> Threat ';
		html += '<span style="background: #6a6; color: #fff; padding: 1px 4px; margin-left: 8px; margin-right: 4px;">&nbsp;</span> Cover';
		html += '</div>';

		return html;
	}

	getTheMessage(tile, ownerName, boardPoint = null) {
		const def = tile.getDefinition();
		const message = [];

		// Show pattern grid
		const patternGrid = this.generatePatternGrid(tile, ownerName);
		message.push(patternGrid);

		// message.push(`<p><strong>Move Distance:</strong> ${def.moveDistance}</p>`);	// Can remove

		if (Object.keys(def.specialRules).length > 0) {
			const rules = [];
			if (def.specialRules.reducedMovement) rules.push('Only shifts 1 space');
			if (def.specialRules.cannotShift) rules.push('Cannot shift');
			if (def.specialRules.threatensAll) rules.push('Threatens itself and tiles of both players');
			// if (def.specialRules.selfThreatened) rules.push('Captured by 1 threat (2 if covered)');	// Can remove
			if (def.specialRules.canRedeploy) rules.push('Can redeploy instead of shift');
			if (def.specialRules.shiftAfterDeploy) rules.push('Can shift after deploy');
			if (def.specialRules.deployAnywhere) rules.push('Can deploy anywhere');
			if (def.specialRules.noPoints) rules.push('Gives no victory points');
			if (def.specialRules.coversSelf) rules.push('Covers itself');

			if (rules.length > 0) {
				message.push(`<p><strong>Special:</strong> ${rules.join(', ')}</p>`);
			}
		}

		// Show threat/cover status for tiles on the board
		if (boardPoint) {
			const player = ownerName;
			const opponent = player === HOST ? GUEST : HOST;
			const opponentThreat = boardPoint.getThreat(opponent);
			const isCovered = boardPoint.isTileCovered(player);
			const threatNeeded = tile.getThreatToCapture(isCovered);

			message.push('<hr>');
			message.push(`<p><strong>Status on board:</strong></p>`);
			message.push(`<p>Threatened: ${opponentThreat} (needs ${threatNeeded} to capture)</p>`);
			message.push(`<p>In Cover: ${isCovered ? 'Yes' : 'No'}</p>`);

			if (opponentThreat >= threatNeeded) {
				message.push(`<p style="color: red;"><strong>⚠ In danger of capture!</strong></p>`);
			}
		}

		return {
			heading: `${ownerName}'s ${def.name}`,
			message: message
		};
	}

	getTileMessage(tileDiv) {
		const tileCode = tileDiv.getAttribute('data-tileCode') || tileDiv.getAttribute('name').substring(1);
		const ownerCode = tileDiv.getAttribute('name').charAt(0);

		const tile = new PaikoTile(tileCode, ownerCode);
		const ownerName = ownerCode === 'H' ? HOST : GUEST;

		return this.getTheMessage(tile, ownerName);
	}

	getPointMessage(htmlPoint) {
		const npText = htmlPoint.getAttribute('name');
		const notationPoint = new NotationPoint(npText);
		const rowCol = notationPoint.rowAndColumn;
		const boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (boardPoint.hasTile()) {
			return this.getTheMessage(boardPoint.tile, boardPoint.tile.ownerName, boardPoint);
		}

		// Show zone info
		const zone = boardPoint.zone;
		let zoneInfo = '';
		switch (zone) {
			case 'host_homeground':
				zoneInfo = 'Host Homeground (Red Garden) - Host tiles here are covered';
				break;
			case 'guest_homeground':
				zoneInfo = 'Guest Homeground (Red Garden) - Guest tiles here are covered';
				break;
			case 'middleground':
				zoneInfo = 'Middleground (White Garden) - 1 point';
				break;
			case 'blacked_out':
				zoneInfo = 'Black Square - Only Lotus can deploy here';
				break;
			default:
				zoneInfo = 'Neutral - 0 points';
		}

		const message = [`<p>${zoneInfo}</p>`];

		// Show threat information
		const hostThreat = boardPoint.hostThreat || 0;
		const guestThreat = boardPoint.guestThreat || 0;

		if (hostThreat > 0 || guestThreat > 0) {
			let threatInfo = '<p><strong>Threats:</strong> ';
			const threats = [];
			if (hostThreat > 0) {
				threats.push(`Host: ${hostThreat}`);
			}
			if (guestThreat > 0) {
				threats.push(`Guest: ${guestThreat}`);
			}
			threatInfo += threats.join(', ') + '</p>';
			message.push(threatInfo);
		}

		// Show cover information
		const hostCover = boardPoint.hostCover;
		const guestCover = boardPoint.guestCover;

		if (hostCover || guestCover) {
			let coverInfo = '<p><strong>Cover:</strong> ';
			const covers = [];
			if (hostCover) {
				covers.push('Host tiles covered here');
			}
			if (guestCover) {
				covers.push('Guest tiles covered here');
			}
			coverInfo += covers.join(', ') + '</p>';
			message.push(coverInfo);
		}

		return {
			heading: 'Board Space',
			message: message
		};
	}

	playAiTurn(finalizeMoveCallback) {
		if (this.theGame.getWinner && this.theGame.getWinner()) {
			return;
		}

		var theAi = activeAi;
		if (activeAi2) {
			if (activeAi2.player === getCurrentPlayer()) {
				theAi = activeAi2;
			}
		}

		// Handle capture reward first if pending - select tiles and bundle with the action move
		let captureRewardData = null;
		if (this.theGame.hasPendingCaptureReward()) {
			const pendingReward = this.theGame.getPendingCaptureReward();
			const capturingPlayer = pendingReward.capturingPlayer;
			const availableTiles = this.theGame.tileManager.getAvailableTileTypes(capturingPlayer);

			// AI chooses tiles for opponent (pick from priority list)
			const tilesToGive = [];
			for (let i = 0; i < pendingReward.rewardCount && i < availableTiles.length; i++) {
				tilesToGive.push(availableTiles[i % availableTiles.length]);
			}

			if (tilesToGive.length > 0) {
				captureRewardData = {
					forPlayer: capturingPlayer,
					tiles: tilesToGive
				};

				// Execute the reward immediately
				tilesToGive.forEach(tileCode => {
					this.theGame.tileManager.drawTileFromReserve(capturingPlayer, tileCode);
				});

				// Clear pending reward
				this.theGame.clearPendingCaptureReward();
			}
		}

		var playerMoveNum = this.gameNotation.getPlayerMoveNum();

		var self = this;
		setTimeout(function() {
			var move = theAi.getMove(self.theGame.getCopy(), playerMoveNum);

			if (!move) {
				debug("AI has no valid moves!");
				return;
			}

			// Bundle capture reward data with the move if we selected tiles
			if (captureRewardData) {
				move.moveData.captureReward = captureRewardData;
			}

			self.gameNotation.addMove(move);

			if (finalizeMoveCallback) {
				finalizeMoveCallback();
			}
		}, 10);
	}

	startAiGame(finalizeMoveCallback) {
		// AI plays as Guest, start with Host's setup
		this.playAiTurn(finalizeMoveCallback);
	}

	getAiList() {
		return [ new PaikoAI() ];
	}

	cleanup() {
		// Cleanup if needed
	}

	isSolitaire() {
		return false;
	}

	startOnlineGame() {
		createGameIfThatIsOk(this.getGameTypeId());
	}

	setGameNotation(newGameNotation) {
		this.gameNotation.setNotationText(newGameNotation);
	}

	getAdditionalHelpTabDiv() {
		const settingsDiv = document.createElement('div');

		// To remove
		// const heading = document.createElement('h4');
		// heading.innerText = 'Paiko Tiles:';
		// settingsDiv.appendChild(heading);

		// // Add tile info
		// const tileInfo = document.createElement('div');
		// getAllTileCodes().forEach(code => {
		// 	const def = PaikoTileDefinitions[code];
		// 	const tileDiv = document.createElement('p');
		// 	tileDiv.innerHTML = `<strong>${def.name}:</strong> Move ${def.moveDistance}, Threatens ${def.threatPattern.length} spaces`;
		// 	if (def.coverPattern.length > 0) {
		// 		tileDiv.innerHTML += `, Covers ${def.coverPattern.length} spaces`;
		// 	}
		// 	tileInfo.appendChild(tileDiv);
		// });
		// settingsDiv.appendChild(tileInfo);

		return settingsDiv;
	}
}
