// Actuator

function Actuator() {
	this.boardContainer = document.querySelector(".pointContainer");
	this.hostTilesContainer = document.querySelector(".hostTilesContainer");
	this.guestTilesContainer = document.querySelector(".guestTilesContainer");
}

Actuator.prototype.actuate = function(board, tileManager) {
	var self = this;

	// self.printBoard(board);

	window.requestAnimationFrame(function () {
		self.htmlify(board, tileManager);
	});
};

Actuator.prototype.htmlify = function(board, tileManager) {
	this.clearContainer(this.boardContainer);

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(cell);
			}
		});
	});

	var fullTileSet = new TileManager();

	// Go through tile piles and clear containers
	fullTileSet.hostTiles.forEach(function(tile) {
		self.clearTileContainer(tile);
	});
	fullTileSet.guestTiles.forEach(function(tile) {
		self.clearTileContainer(tile);
	});

	// Go through tile piles and display
	tileManager.hostTiles.forEach(function(tile) {
		self.addTile(tile, this.hostTilesContainer);
	});
	tileManager.guestTiles.forEach(function(tile) {
		self.addTile(tile, this.guestTilesContainer);
	});
};

Actuator.prototype.clearContainer = function (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

Actuator.prototype.clearTileContainer = function (tile) {
	var container = document.querySelector("." + tile.getImageName());
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

Actuator.prototype.addTile = function (tile, mainContainer) {
	var self = this;

	var container = document.querySelector("." + tile.getImageName());

	var theDiv = document.createElement("div");

	theDiv.classList.add("point");
	theDiv.classList.add("hasTile");

	if (tile.selectedFromPile) {
		theDiv.classList.add("selectedFromPile");
		theDiv.classList.add("drained");
	}

	var theImg = document.createElement("img");
	theImg.src = "images/" + tile.getImageName() + ".png";
	theDiv.appendChild(theImg);

	theDiv.setAttribute("name", tile.getImageName());
	theDiv.setAttribute("id", tile.id);
	theDiv.setAttribute("onclick", "unplayedTileClicked(this);");

	container.appendChild(theDiv);
};

Actuator.prototype.addBoardPoint = function (boardPoint) {
	var self = this;

	// Create this: <div class="point"><img src="images/GB.png"></div>

	var theDiv = document.createElement("div");

	theDiv.classList.add("point");

	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add("activePoint");
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			theDiv.classList.add("possibleMove");
		}
		theDiv.setAttribute("name", new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString);
		theDiv.setAttribute("onclick", "pointClicked(this);");
	}

	if (boardPoint.hasTile()) {
		theDiv.classList.add("hasTile");
		
		var theImg = document.createElement("img");

		theImg.src = "images/" + boardPoint.tile.getImageName() + ".png";
		
		if (boardPoint.tile.inHarmony) {
			theDiv.classList.add(boardPoint.tile.ownerName + "harmony");
		} else if (boardPoint.tile.drained || boardPoint.tile.trapped) {
			theDiv.classList.add("drained");
		}
		
		theDiv.appendChild(theImg);
	}

	this.boardContainer.appendChild(theDiv);
};

Actuator.prototype.printBoard = function(board) {

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

