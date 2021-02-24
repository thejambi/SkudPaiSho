
/* Create boardContainer, hostTilesContainer, and guestTilesContainer */
function TumbleweedActuator(gameContainer, isMobile, hostTilesContainerDivs, guestTilesContainerDivs) {
	this.gameContainer = gameContainer;
	this.isMobile = isMobile;

	removeChildren(gameContainer);

	var boardClass = "boardHexhex8";
	if (gameOptionEnabled(HEXHEX_11)) {
		boardClass = "boardHexhex11";
	} else if (gameOptionEnabled(HEXHEX_6)) {
		boardClass = "boardHexhex6";
	}
	var boardContainer = createDivWithClass(boardClass);

	var hostTilesContainer = createDivWithClass("hostTilesContainer");
	var guestTilesContainer = createDivWithClass("guestTilesContainer");

	var bcontainer = createDivWithClass("board-container");

	bcontainer.classList.add(boardClass+"bottomMargin");

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
		boardContainer: boardContainer,
		hostTilesContainer: hostTilesContainer,
		guestTilesContainer: guestTilesContainer
	}

	this.boardContainer = containers.boardContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

TumbleweedActuator.prototype.actuate = function(board, lastMove) {
	var self = this;

	window.requestAnimationFrame(function () {
		self.htmlify(board, lastMove);
	});
};

TumbleweedActuator.prototype.htmlify = function(board, lastMove) {
	removeChildren(this.boardContainer);

	var self = this;

	var rowNum = 0;
	if (board.cells[-1]) {
		var rowDiv = self.buildRowDiv(1);
		var column = board.cells[-1];

		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(rowDiv, cell, lastMove);
			}
		});
		self.boardContainer.appendChild(rowDiv);
	}
	board.cells.forEach(function(column) {
		var rowDiv = self.buildRowDiv(rowNum);
		rowNum++;
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(rowDiv, cell, lastMove);
			}
		});
		self.boardContainer.appendChild(rowDiv);
	});
};

TumbleweedActuator.prototype.buildRowDiv = function(rowNum) {
	var rowDiv = createDivWithClass("hexRow");
	if (rowNum % 2 === 1) {
		rowDiv.classList.add("hexRowIndented");
	}
	return rowDiv;
};

TumbleweedActuator.prototype.addBoardPoint = function(rowDiv, boardPoint, lastMove) {
	// var theDiv = this.createBoardPointDiv(boardPoint);
	var theDiv = document.createElement("div");

	if (boardPoint.types.includes(TumbleweedBoardPoint.Types.normal)) {
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

	if (boardPoint.types.includes(TumbleweedBoardPoint.Types.nonPlayable)) {
		theDiv.classList.add("hexagonNoShow");
	} else {
		theDiv.classList.add("hexagon");

		if (boardPoint.types.includes(TumbleweedBoardPoint.Types.normal)) {
			if (lastMove && boardPoint.getNotationPointString() === lastMove.deployPoint) {
				theDiv.classList.add("lastPlayed");
			}
			if (this.isMobile) {
				theDiv.setAttribute("onclick", "gameController.pointClicked(this); showPointMessage(this);");
			} else {
				theDiv.setAttribute("onclick", "pointClicked(this);");
				theDiv.setAttribute("onmouseover", "showPointMessage(this);");
				theDiv.setAttribute("onmouseout", "clearMessage();");
			}
			if (boardPoint.types.includes(POSSIBLE_MOVE)) {
				theDiv.classList.add("possibleMove");
			}
		}

		if (boardPoint.hasSettlement()) {
			var className = "bloomsG2";
			if (boardPoint.getSettlementOwner() === HOST) {
				className = "bloomsG1";
			} else if (boardPoint.getSettlementOwner() === GUEST) {
				className = "bloomsH2";
			}
			theDiv.classList.add(className);
			if (boardPoint.showRevealEffect) {
				theDiv.classList.add("bloomsRevealEffect");
			}

			if (!gameOptionEnabled(TUMPLETORE)) {
				theSpan.innerText = boardPoint.getSettlementValue();
				theSpan.style.fontWeight = "bold";
				theSpan.style.fontSize = "x-large";
				theSpan.style.color = "black";
				
				if (boardPoint.getSettlementOwner() !== HOST && boardPoint.getSettlementOwner() !== GUEST) {
					theSpan.style.color = "white";
				}
			}
		}
	}

	/* Add div to row */
	rowDiv.appendChild(theDiv);
};

/*TumbleweedActuator.prototype.createBoardPointDiv = function(boardPoint) {
	var theDiv = document.createElement("div");

	if (boardPoint.types.includes(TumbleweedBoardPoint.Types.normal)) {
		var notationPointString = boardPoint.getNotationPointString();
		theDiv.setAttribute("name", notationPointString);
		theDiv.setAttribute("title", notationPointString);
	}

	var theSpan = document.createElement("span");
	theDiv.appendChild(theSpan);

	return theDiv;
};*/

