
/* Create boardContainer, hostTilesContainer, and guestTilesContainer */
function PaiJoActuator(gameContainer, isMobile, hostTilesContainerDivs, guestTilesContainerDivs) {
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;

	removeChildren(gameContainer);

	var boardContainer = createDivWithClass("PaiJoBoard");

	if (gameOptionEnabled(FIVE_SIDED_BOARD)) {
		boardContainer.classList.add("PaiJo5perSide");
	}

	var boardContainerWithRotate = createDivWithClass("PaiJoBoardRotate");
	boardContainer.appendChild(boardContainerWithRotate);

	var hostTilesContainer = createDivWithClass("hostTilesContainer");
	var guestTilesContainer = createDivWithClass("guestTilesContainer");

	var bcontainer = createDivWithClass("board-container");

	bcontainer.appendChild(boardContainer);

	var response = createDivWithId("response");
	var gameMessage = createDivWithClass("gameMessage");
	var tilePileContainer = createDivWithClass("tilePileContainer");
	var gameMessage2 = createDivWithClass("gameMessage2");

	var hostTilesContainerDivs = hostTilesContainerDivs;
	var guestTilesContainerDivs = guestTilesContainerDivs;
	hostTilesContainer.innerHTML = hostTilesContainerDivs;
	guestTilesContainer.innerHTML = guestTilesContainerDivs;

	tilePileContainer.appendChild(response);
	tilePileContainer.appendChild(gameMessage);
	tilePileContainer.appendChild(hostTilesContainer);
	tilePileContainer.appendChild(guestTilesContainer);
	tilePileContainer.appendChild(gameMessage2);

	gameContainer.appendChild(bcontainer);
	gameContainer.appendChild(tilePileContainer);

	var containers = {
		boardContainer: boardContainerWithRotate,
		hostTilesContainer: hostTilesContainer,
		guestTilesContainer: guestTilesContainer
	}

	this.boardContainer = containers.boardContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

PaiJoActuator.prototype.actuate = function(board) {
	var self = this;

	window.requestAnimationFrame(function () {
		self.htmlify(board);
	});
};

PaiJoActuator.prototype.htmlify = function(board) {
	removeChildren(this.boardContainer);

	var self = this;

	var rowNum = 0;
	if (board.cells[-1]) {
		var rowDiv = self.buildRowDiv(1);
		var column = board.cells[-1];

		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(rowDiv, cell);
			}
		});
		self.boardContainer.appendChild(rowDiv);
	}
	board.cells.forEach(function(column) {
		var rowDiv = self.buildRowDiv(rowNum);
		rowNum++;
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(rowDiv, cell);
			}
		});
		self.boardContainer.appendChild(rowDiv);
	});
};

PaiJoActuator.prototype.buildRowDiv = function(rowNum) {
	var rowDiv = createDivWithClass("hexRow");
	if (rowNum % 2 === 1) {
		rowDiv.classList.add("hexRowIndented");
	}
	return rowDiv;
};

PaiJoActuator.prototype.addBoardPoint = function(rowDiv, boardPoint) {
	var theDiv = document.createElement("div");

	if (boardPoint.types.includes(PaiJoBoardPoint.Types.normal)) {
		var notationPointString = boardPoint.getNotationPointString();
		theDiv.setAttribute("name", notationPointString);
		theDiv.setAttribute("title", notationPointString);
	}

	var theSpan = document.createElement("span");
	theDiv.appendChild(theSpan);

	if (this.isMobile) {
		theDiv.classList.add("mobile");
	} else {
		theDiv.classList.add("desktop");
	}

	if (boardPoint.types.includes(PaiJoBoardPoint.Types.nonPlayable)) {
		theDiv.classList.add("hexagonNoShow");
	} else {
		theDiv.classList.add("hexagon");

		if (boardPoint.types.includes(PaiJoBoardPoint.Types.normal)) {
			if (this.isMobile) {
				theDiv.setAttribute("onclick", "gameController.pointClicked(this); showPointMessage(this);");
			} else {
				theDiv.setAttribute("onclick", "pointClicked(this);");
				theDiv.setAttribute("onmouseover", "showPointMessage(this);");
				
				var onmouseoutText = "clearMessage();";
				theDiv.setAttribute("onmouseout", onmouseoutText);
			}
			if (boardPoint.types.includes(POSSIBLE_MOVE)) {
				theDiv.classList.add("possibleMove");
			}
		}

		if (boardPoint.hasTile()) {
			theDiv.classList.add("PaiJo" + boardPoint.tile);
			if (boardPoint.tile === "K") {
				// var kingTextDiv = document.createElement("div");
				// kingTextDiv.innerHTML = "&#9812;"; //"&#9818;";
				// kingTextDiv.classList.add("PaiJoKingText");
				// theSpan.appendChild(kingTextDiv);
			}
		} else {
			if (boardPoint.types.includes(PaiJoBoardPoint.Types.throne)) {
				theDiv.classList.add("throne");
			}
			if (boardPoint.types.includes(PaiJoBoardPoint.Types.corner)) {
				theDiv.classList.add("corner");
			}
		}
	}

	/* Show Score */
	var scoreNeededToWin = gameController.theGame.board.scoreNeededToWin;
	var hostScore = gameController.theGame.hostScore;
	var guestScore = scoreNeededToWin - gameController.theGame.guestScore;	/* Guest starts scoring from his side */

	if (hostScore > scoreNeededToWin) {
		hostScore = scoreNeededToWin;
	}
	if (guestScore < 0) {
		guestScore = 0;
	}

	var hostScoreString = hostScore.toString();
	var guestScoreString = guestScore.toString();
	
	if (boardPoint.types.includes(PaiJoBoardPoint.Types.scoreTrack)) {
		theDiv.classList.add("hexagonScore");

		if (hostScoreString === boardPoint.scoreTrackString) {
			theDiv.classList.add("hexScoreHost");
		}
		if (guestScoreString === boardPoint.scoreTrackString) {
			theDiv.classList.add("hexScoreGuest");
		}
	}

	/* Add div to row */
	rowDiv.appendChild(theDiv);
};

