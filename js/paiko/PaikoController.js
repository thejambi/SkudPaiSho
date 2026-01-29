// Paiko Controller
// Handles UI interaction for Paiko game

import {
	GameType,
	callSubmitMove,
	createGameIfThatIsOk,
	currentMoveIndex,
	finalizeMove,
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

		// Host Captured Section
		const capturedLabel = document.createElement('span');
		capturedLabel.className = 'tileLibraryLabel';
		capturedLabel.innerHTML = '<strong>Host Captured</strong>';
		container.appendChild(capturedLabel);
		container.appendChild(document.createElement('br'));

		const capturedDiv = document.createElement('div');
		capturedDiv.className = 'H-captured';
		container.appendChild(capturedDiv);

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
		const capturedLabel = document.createElement('span');
		capturedLabel.className = 'tileLibraryLabel';
		capturedLabel.innerHTML = '<strong>Guest Captured</strong>';
		container.appendChild(capturedLabel);
		container.appendChild(document.createElement('br'));

		const capturedDiv = document.createElement('div');
		capturedDiv.className = 'G-captured';
		container.appendChild(capturedDiv);

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
				<li>2 points for each tile on opponent's homeground (Red Garden)</li>
				<li>1 point for each tile on middleground (White Garden)</li>
			</ul>
			<p><strong>On your turn:</strong></p>
			<ul>
				<li><strong>Deploy</strong> - Place a tile from your hand</li>
				<li><strong>Shift</strong> - Move a tile up to 2 spaces (non-diagonal)</li>
				<li><strong>Draw</strong> - Take 3 tiles from your reserve</li>
			</ul>
			<p>After your action, capture opponent tiles that are threatened by 2 of your tiles (3 if covered).</p>`;
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
			const rotateContainer = document.createElement('p');
			rotateContainer.innerHTML = '<strong>Select facing direction:</strong> ';

			const directions = [
				{ name: 'Up', facing: PaikoTileFacing.UP },
				{ name: 'Right', facing: PaikoTileFacing.RIGHT },
				{ name: 'Down', facing: PaikoTileFacing.DOWN },
				{ name: 'Left', facing: PaikoTileFacing.LEFT }
			];

			const self = this;
			directions.forEach((d, i) => {
				if (i > 0) rotateContainer.appendChild(document.createTextNode(' | '));
				const dirSpan = document.createElement('span');
				dirSpan.className = 'skipBonus';
				dirSpan.textContent = d.name;
				dirSpan.onclick = () => self.selectFacing(d.facing);
				rotateContainer.appendChild(dirSpan);
			});

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
				actions.innerHTML = '<strong>Your turn:</strong> Click a tile in your hand to deploy, click a tile on the board to shift, or click here to ';

				const drawSpan = document.createElement('span');
				drawSpan.className = 'skipBonus';
				drawSpan.textContent = 'Draw 3 tiles';
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

			// Build selection move
			this.moveBuilder.buildSelectMove(currentPlayer, [tileCode]);

			const move = this.moveBuilder.getNotationMove(this.gameNotation);
			this.theGame.runNotationMove(move);
			this.gameNotation.addMove(move);

			this.resetNotationBuilder();

			// Start online game after HOST finishes selecting 7 tiles (phase transitions to GUEST_SELECT_9)
			if (onlinePlayEnabled && this.theGame.gamePhase === PaikoGamePhase.GUEST_SELECT_9 && this.gameNotation.moves.length === 7) {
				this.startOnlineGame();
			} else if (playingOnlineGame()) {
				callSubmitMove();
			} else {
				finalizeMove();
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

		if (this.moveBuilder.getMoveType() === DEPLOY) {
			this.finalizeDeploy();
		} else if (this.moveBuilder.getMoveType() === PaikoMoveType.SAI_SHIFT) {
			this.finalizeSaiShift();
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

		// Check if Sai was deployed and can shift
		if (this.theGame.pendingSaiShift) {
			// Enter Sai shift mode
			this.moveBuilder.setStatus(PaikoBuilderStatus.WAITING_FOR_SAI_SHIFT);
			this.moveBuilder.setMoveType(PaikoMoveType.SAI_SHIFT);
			this.moveBuilder.setMoveData('saiStartPoint', endPointText);

			// Show possible shift destinations for Sai
			const saiPoint = this.theGame.pendingSaiShift.point;
			const currentPlayer = this.getCurrentPlayer();
			const shiftDestinations = this.theGame.board.getPossibleShiftDestinations(saiPoint, currentPlayer);
			this.theGame.board.markPossibleMoves(shiftDestinations);

			this.callActuate();
			refreshMessage();
			return;
		}

		this.resetNotationBuilder();

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	finalizeShift() {
		const move = this.moveBuilder.getNotationMove(this.gameNotation);

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

		// Clear pending Sai shift
		this.theGame.pendingSaiShift.tile.justDeployed = false;
		this.theGame.pendingSaiShift = null;

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
		const startPoint = this.moveBuilder.getMoveData('startPoint');
		const endPoint = this.moveBuilder.getMoveData('endPoint');
		const facing = this.moveBuilder.getMoveData('facing');

		this.moveBuilder.buildSaiShiftMove(currentPlayer, new NotationPoint(startPoint), new NotationPoint(endPoint), facing);

		const move = this.moveBuilder.getNotationMove(this.gameNotation);

		// Validate move doesn't capture own tile
		const gameCopy = this.theGame.getCopy();
		gameCopy.runNotationMove(move, false);
		if (!gameCopy.validateMoveDoesntCaptureOwn(currentPlayer)) {
			debug("Move would result in your own tile being captured!");
			// Re-show shift destinations
			const saiPoint = this.theGame.pendingSaiShift.point;
			const shiftDestinations = this.theGame.board.getPossibleShiftDestinations(saiPoint, currentPlayer);
			this.theGame.board.markPossibleMoves(shiftDestinations);
			this.moveBuilder.setStatus(PaikoBuilderStatus.WAITING_FOR_SAI_SHIFT);
			this.callActuate();
			refreshMessage();
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

		const currentPlayer = this.getCurrentPlayer();
		this.moveBuilder.buildCaptureRewardMove(currentPlayer, this.selectedCaptureRewardTiles);

		const move = this.moveBuilder.getNotationMove(this.gameNotation);
		this.theGame.runNotationMove(move);
		this.gameNotation.addMove(move);

		this.selectedCaptureRewardTiles = [];
		this.resetNotationBuilder();

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	getCurrentPlayer() {
		// Use the game manager's tracked current player
		return this.theGame.currentPlayer;
	}

	getTheMessage(tile, ownerName, boardPoint = null) {
		const def = tile.getDefinition();
		const message = [];

		message.push(`<p><strong>Move Distance:</strong> ${def.moveDistance}</p>`);

		if (def.threatPattern.length > 0) {
			message.push(`<p><strong>Threatens:</strong> ${def.threatPattern.length} spaces</p>`);
		}

		if (def.coverPattern.length > 0) {
			message.push(`<p><strong>Provides cover:</strong> ${def.coverPattern.length} spaces</p>`);
		}

		if (Object.keys(def.specialRules).length > 0) {
			const rules = [];
			if (def.specialRules.reducedMovement) rules.push('Only shifts 1 space');
			if (def.specialRules.cannotShift) rules.push('Cannot shift');
			if (def.specialRules.threatensAll) rules.push('Threatens all tiles including own');
			if (def.specialRules.selfThreatened) rules.push('Captured by 1 threat (2 if covered)');
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
			message.push(`<p>Covered: ${isCovered ? 'Yes' : 'No'}</p>`);

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
		// AI not implemented yet
	}

	startAiGame(finalizeMoveCallback) {
		// AI not implemented yet
	}

	getAiList() {
		return [];
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

		const heading = document.createElement('h4');
		heading.innerText = 'Paiko Tiles:';
		settingsDiv.appendChild(heading);

		// Add tile info
		const tileInfo = document.createElement('div');
		getAllTileCodes().forEach(code => {
			const def = PaikoTileDefinitions[code];
			const tileDiv = document.createElement('p');
			tileDiv.innerHTML = `<strong>${def.name}:</strong> Move ${def.moveDistance}, Threatens ${def.threatPattern.length} spaces`;
			if (def.coverPattern.length > 0) {
				tileDiv.innerHTML += `, Covers ${def.coverPattern.length} spaces`;
			}
			tileInfo.appendChild(tileDiv);
		});
		settingsDiv.appendChild(tileInfo);

		return settingsDiv;
	}
}
