// Trifle Actuator

function TrifleActuator(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;

	var containers = setupPaiShoBoard(
		this.gameContainer, 
		Trifle.Controller.getHostTilesContainerDivs(),
		Trifle.Controller.getGuestTilesContainerDivs(), 
		true
	);

	this.boardContainer = containers.boardContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

TrifleActuator.imagePath = "images/Trifle/standard/";
TrifleActuator.hostTeamTilesDivId = "hostTilesContainer";
TrifleActuator.guestTeamTilesDivId = "guestTilesContainer";

TrifleActuator.prototype.actuate = function(board, tileManager) {
	var self = this;

	// self.printBoard(board);

	window.requestAnimationFrame(function () {
		self.htmlify(board, tileManager);
	});
};

TrifleActuator.prototype.htmlify = function(board, tileManager) {
	this.clearContainer(this.boardContainer);

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(cell);
			}
		});
	});

	/* Player Tiles */
	/* Team Tiles */
	// Go through tile piles and clear containers
	self.clearContainerWithId(TrifleActuator.hostTeamTilesDivId);
	self.clearContainerWithId(TrifleActuator.guestTeamTilesDivId);
	tileManager.hostTiles.forEach(function(tile) {
		self.addTeamTile(tile, HOST);
	});
	tileManager.guestTiles.forEach(function(tile) {
		self.addTeamTile(tile, GUEST);
	});

	/* Team Selection Area */
	if (!tileManager.hostTeamIsFull()) {
		this.addLineBreakInTilePile(HOST);
		this.addLineBreakInTilePile(HOST);
		Object.keys(Trifle.TileCodes).forEach(function(key,index) {
			self.addTeamTile(new Trifle.Tile(Trifle.TileCodes[key], hostPlayerCode), HOST, true);
		});
	}
	if (!tileManager.guestTeamIsFull()) {
		this.addLineBreakInTilePile(GUEST);
		this.addLineBreakInTilePile(GUEST);
		Object.keys(Trifle.TileCodes).forEach(function(key,index) {
			self.addTeamTile(new Trifle.Tile(Trifle.TileCodes[key], guestPlayerCode), GUEST, true);
		});
	}
};

TrifleActuator.prototype.clearContainer = function (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

TrifleActuator.prototype.clearContainerWithId = function(containerIdName) {
	var container = document.getElementById(containerIdName);
	if (container) {
		this.clearContainer(container);
	}
};

// TrifleActuator.prototype.clearTileContainer = function(tile) {
// 	var container = document.querySelector("." + tile.getImageName());
// 	while (container.firstChild) {
// 		container.removeChild(container.firstChild);
// 	}
// };

TrifleActuator.prototype.addLineBreakInTilePile = function(player) {
	var containerDivId = player === HOST 
								? TrifleActuator.hostTeamTilesDivId
								: TrifleActuator.guestTeamTilesDivId;
	var container = document.getElementById(containerDivId);

	var theBr = document.createElement("br");
	theBr.classList.add("clear");
	container.appendChild(theBr);
};

TrifleActuator.prototype.addTeamTile = function(tile, player, isForTeamSelection) {
	var self = this;

	var containerDivId = player === HOST 
								? TrifleActuator.hostTeamTilesDivId
								: TrifleActuator.guestTeamTilesDivId;
	var container = document.getElementById(containerDivId);

	var theDiv = document.createElement("div");

	theDiv.classList.add("point");
	theDiv.classList.add("hasTile");

	if (isForTeamSelection) {
		theDiv.classList.add("selectedFromPile");
	} else if (tile.selectedFromPile) {
		theDiv.classList.add("selectedFromPile");
		theDiv.classList.add("drained");
	}

	var theImg = document.createElement("img");

	var srcValue = TrifleActuator.imagePath;

	theImg.src = srcValue + tile.getImageName() + ".png";
	theDiv.appendChild(theImg);

	theDiv.setAttribute("name", tile.getImageName());
	theDiv.setAttribute("id", tile.id);

	if (this.mobile) {
		theDiv.setAttribute("onclick", "unplayedTileClicked(this); showTileMessage(this);");
	} else {
		theDiv.setAttribute("onclick", "unplayedTileClicked(this);");
		theDiv.setAttribute("onmouseover", "showTileMessage(this);");
		theDiv.setAttribute("onmouseout", "clearMessage();");
	}

	container.appendChild(theDiv);
};

TrifleActuator.prototype.addBoardPoint = function(boardPoint) {
	var self = this;

	var theDiv = createBoardPointDiv(boardPoint);

	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add("activePoint");
		theDiv.classList.add("vagabondPointRotate");
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			theDiv.classList.add("possibleMove");
		}
		
		if (this.mobile) {
			theDiv.setAttribute("onclick", "pointClicked(this); showPointMessage(this);");
		} else {
			theDiv.setAttribute("onclick", "pointClicked(this);");
			theDiv.setAttribute("onmouseover", "showPointMessage(this);");
			theDiv.setAttribute("onmouseout", "clearMessage();");
		}
	}

	if (boardPoint.hasTile()) {
		theDiv.classList.add("hasTile");
		
		var theImg = document.createElement("img");

		var srcValue = TrifleActuator.imagePath;
		
		theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";
		
		if (boardPoint.tile.inHarmony) {
			theDiv.classList.add(boardPoint.tile.ownerName + "harmony");
		}
		if (boardPoint.tile.drained || boardPoint.tile.trapped) {
			theDiv.classList.add("drained");
		}
		
		theDiv.appendChild(theImg);
	}

	this.boardContainer.appendChild(theDiv);

	if (boardPoint.betweenHarmony && boardPoint.col === 16) {
		var theBr = document.createElement("div");
		theBr.classList.add("clear");
		this.boardContainer.appendChild(theBr);
	}
};

TrifleActuator.prototype.printBoard = function(board) {

	debug("");
	var rowNum = 0;
	board.cells.forEach(function (row) {
		var rowStr = rowNum + "\t: ";
		row.forEach(function (boardPoint) {
			var str = boardPoint.getConsoleDisplay();
			if (str.length < 3) {
				rowStr += " ";
			}
			rowStr = rowStr + str;
			if (str.length < 2) {
				rowStr = rowStr + " ";
			}
			
		});
		debug(rowStr);
		rowNum++;
	});
	debug("");
};

