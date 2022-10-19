/* Beyond The Edges of The Maps specific UI interaction logic */

function BeyondTheMaps() {}

BeyondTheMaps.Controller = class {
	constructor(gameContainer, isMobile) {
		this.actuator = new BeyondTheMaps.Actuator(gameContainer, isMobile, isAnimationsOn());

		this.resetGameManager();
		this.resetNotationBuilder();
		this.resetGameNotation();
	}

	getGameTypeId() {
		return GameType.BeyondTheMaps.id;
	}

	resetGameManager() {
		this.theGame = new BeyondTheMaps.GameManager(this.actuator);
	}

	resetNotationBuilder() {
		/* Purposely using Trifle game notation as it is generic and json */
		this.notationBuilder = new Trifle.NotationBuilder();
		this.notationBuilder.moveData = {};
		this.notationBuilder.moveData.phases = [];
		this.notationBuilder.phaseIndex = -1;
	}

	resetGameNotation() {
		this.gameNotation = this.getNewGameNotation();
	}

	completeSetup() {
		// Nothing
	}

	getNewGameNotation() {
		/* Purposely using Trifle game notation as it is generic and json */
		return new Trifle.GameNotation();
	}

	static getHostTilesContainerDivs() {
		return '';
	}

	static getGuestTilesContainerDivs() {
		return '';
	}

	callActuate() {
		this.theGame.actuate();
	}

	resetMove() {
		if (this.notationBuilder.status === BRAND_NEW) {
			// Remove last move
			this.gameNotation.removeLastMove();
		}

		rerunAll();
	}

	getDefaultHelpMessageText() {
		return "<h4>Beyond The Edges of The Maps</h4> <p>A game from the world of Aerwiar.</p>";
	}

	getAdditionalMessage() {
		var msg = "";

		if (this.gameNotation.moves.length === 0) {
			if (onlinePlayEnabled && gameId < 0 && userIsLoggedIn()) {
				msg += "Click <em>Join Game</em> above to join another player's game. Or, you can start a game that other players can join by making a move. <br />";
			} else {
				msg += "Sign in to enable online gameplay. Or, start playing a local game by making a move. <br />";
			}

			msg += getGameOptionsMessageHtml(GameType.BeyondTheMaps.gameOptions);
		} else {
			// 
		}

		return msg;
	}

	gamePreferenceSet(preferenceKey) {
		// 
	}

	startOnlineGame() {
		createGameIfThatIsOk(this.getGameTypeId());
	}

	unplayedTileClicked(tileDiv) {
		// Nothing to do
	}

	beginNewMovePhase() {
		this.notationBuilder.phaseIndex++;
		this.notationBuilder.moveData.phases[this.notationBuilder.phaseIndex] = {};
	}
	getCurrentMovePhase() {
		return this.notationBuilder.moveData.phases[this.notationBuilder.phaseIndex];
	}

	pointClicked(htmlPoint) {
		this.theGame.markingManager.clearMarkings();
		this.callActuate();

		if (this.theGame.getWinner() || !myTurn() || currentMoveIndex !== this.gameNotation.moves.length
				|| (playingOnlineGame() && !iAmPlayerInCurrentOnlineGame())) {
			return;
		}

		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (this.notationBuilder.status === BRAND_NEW) {
			if (boardPoint.hasTile() && boardPoint.tile.tileType === BeyondTheMaps.TileType.SHIP) {
				if (boardPoint.tile.ownerName !== getCurrentPlayer()) {
					debug("That's not your tile!");
					return;
				}
				this.notationBuilder.status = WAITING_FOR_ENDPOINT;
				this.beginNewMovePhase();
				this.getCurrentMovePhase().moveType = BeyondTheMaps.MoveType.EXPLORE_SEA;
				// this.notationBuilder.moveType = BeyondTheMaps.MoveType.EXPLORE_SEA;
				this.notationBuilder.player = this.getCurrentPlayer();
				this.getCurrentMovePhase().startPoint = new NotationPoint(htmlPoint.getAttribute("name"));
				this.notationBuilder.startBoardPoint = boardPoint;

				this.theGame.revealPossibleMovePoints(boardPoint);
				refreshMessage();
			}
		} else if (this.notationBuilder.status === WAITING_FOR_ENDPOINT) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				// They're trying to move there! And they can! Exciting!
				// Need the notation!
				this.getCurrentMovePhase().endPoint = new NotationPoint(htmlPoint.getAttribute("name"));
				var possiblePaths = boardPoint.possibleMovementPaths;
				this.theGame.hidePossibleMovePoints();

				var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);
				this.theGame.runNotationMove(move, this.notationBuilder.phaseIndex);

				var landPointsPossible = this.theGame.markPossibleLandPointsForMovement(boardPoint, possiblePaths, this.notationBuilder.player);

				if (landPointsPossible.length > 1) {
					// Land points are marked on the board as Possible points now
					this.notationBuilder.status = WAITING_FOR_BONUS_ENDPOINT;
				} else {
					if (landPointsPossible.length > 0) {
						this.getCurrentMovePhase().landPoint = new NotationPoint(landPointsPossible[0].getNotationPointString());
					}
					this.completeMove();
				}
			} else {
				this.theGame.hidePossibleMovePoints();
				this.resetNotationBuilder();
			}
		} else if (this.notationBuilder.status === WAITING_FOR_BONUS_ENDPOINT) {
			if (boardPoint.isType(POSSIBLE_MOVE)) {
				this.theGame.hidePossibleMovePoints();
				this.getCurrentMovePhase().landPoint = new NotationPoint(htmlPoint.getAttribute("name"));
				this.completeMove();
			}
		}
	}

	completeMove() {
		var move = this.gameNotation.getNotationMoveFromBuilder(this.notationBuilder);

		// Move all set. Add it to the notation!
		this.gameNotation.addMove(move);

		if (playingOnlineGame()) {
			callSubmitMove();
		} else {
			finalizeMove();
		}
	}

	getTileMessage(tileDiv) {
		var divName = tileDiv.getAttribute("name");	// Like: GW5 or HL
		var tileId = parseInt(tileDiv.getAttribute("id"));

		var tile = new BeyondTheMaps.Tile(null, divName.substring(1), divName.charAt(0));

		var message = [];

		var ownerName = HOST;
		if (divName.startsWith('G')) {
			ownerName = GUEST;
		}

		var tileCode = divName.substring(1);

		var heading = PlaygroundTile.getTileName(tileCode);

		message.push(tile.ownerName + "'s tile");

		return {
			heading: heading,
			message: message
		}
	}

	getPointMessage(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var boardPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		var heading;
		var message = [];
		if (boardPoint.hasTile()) {
			heading = boardPoint.tile.getName();
		}

		return {
			heading: heading,
			message: message
		}
	}

	playAiTurn(finalizeMove) {
		// 
	}

	startAiGame(finalizeMove) {
		// 
	}

	getAiList() {
		return [];
	}

	getCurrentPlayer() {
		if (this.gameNotation.moves.length % 2 === 0) {
			return HOST;
		} else {
			return GUEST;
		}
	}

	cleanup() {
		// Nothing.
	}

	isSolitaire() {
		return false;
	}

	setGameNotation(newGameNotation) {
		this.gameNotation.setNotationText(newGameNotation);
	}

	getSkipToIndex(currentMoveIndex) {
		for (var i = currentMoveIndex; i < this.gameNotation.moves.length; i++) {
			if (this.gameNotation.moves[i].moveType === PlaygroundMoveType.hideTileLibraries) {
				return i;
			}
		}
		return currentMoveIndex;
	}

	setAnimationsOn(isAnimationsOn) {
		this.actuator.setAnimationOn(isAnimationsOn);
	}

	runMove(move, withActuate, moveAnimationBeginStep, skipAnimation) {
		for (var phaseIndex = 0; phaseIndex < move.moveData.phases.length; phaseIndex++) {
			this.theGame.runNotationMove(move, phaseIndex, withActuate);
		}
	}

	cleanup() {
		// Nothing
	}

	RmbDown(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		this.mouseStartPoint = this.theGame.board.cells[rowCol.row][rowCol.col];
	}

	RmbUp(htmlPoint) {
		var npText = htmlPoint.getAttribute("name");

		var notationPoint = new NotationPoint(npText);
		var rowCol = notationPoint.rowAndColumn;
		var mouseEndPoint = this.theGame.board.cells[rowCol.row][rowCol.col];

		if (mouseEndPoint == this.mouseStartPoint) {
			this.theGame.markingManager.toggleMarkedPoint(mouseEndPoint);
		}
		else if (this.mouseStartPoint) {
			this.theGame.markingManager.toggleMarkedArrow(this.mouseStartPoint, mouseEndPoint);
		}
		this.mouseStartPoint = null;

		this.callActuate();
	}

};
