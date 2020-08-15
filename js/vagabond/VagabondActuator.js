// Vagabond Actuator

function VagabondActuator(gameContainer, isMobile, enableAnimations) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;

	this.animationOn = enableAnimations;

	var containers = setupPaiShoBoard(
		this.gameContainer,
		VagabondController.getHostTilesContainerDivs(),
		VagabondController.getGuestTilesContainerDivs(),
		true
	);

	this.boardContainer = containers.boardContainer;
	this.boardContainer.style.position = "relative";
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

VagabondActuator.prototype.setAnimationOn = function(isOn) {
	this.animationOn = isOn;
};

VagabondActuator.prototype.actuate = function(board, tileManager, moveToAnimate) {
	var self = this;
	debug(moveToAnimate);
	// self.printBoard(board);

	window.requestAnimationFrame(function () {
		self.htmlify(board, tileManager, moveToAnimate);
	});
};

VagabondActuator.prototype.htmlify = function(board, tileManager, moveToAnimate) {
	this.clearContainer(this.boardContainer);

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(cell, moveToAnimate);
			}
		});
	});

	var fullTileSet = new VagabondTileManager();

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

VagabondActuator.prototype.clearContainer = function (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

VagabondActuator.prototype.clearTileContainer = function (tile) {
	var container = document.querySelector("." + tile.getImageName());
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

VagabondActuator.prototype.addTile = function(tile, mainContainer) {
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

	var srcValue = this.getTileImageSourceDir();

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

VagabondActuator.prototype.addBoardPoint = function(boardPoint, moveToAnimate) {
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

		if (moveToAnimate) {
			this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv);
		}

		var srcValue = this.getTileImageSourceDir();

		theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";

		theDiv.appendChild(theImg);

		if (this.animationOn && moveToAnimate && moveToAnimate.capturedTile && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
			debug("Captured " + moveToAnimate.capturedTile.code);
			var theImgCaptured = document.createElement("img");
			theImgCaptured.src = srcValue + moveToAnimate.capturedTile.getImageName() + ".png";
			theImgCaptured.classList.add("underneath");
			theDiv.appendChild(theImgCaptured);

			/* After animation, hide captured tile */
			setTimeout(function() {
				requestAnimationFrame(function() {
					theImgCaptured.style.visibility = "hidden";
				});
			}, pieceAnimationLength);
		}
	}

	this.boardContainer.appendChild(theDiv);

	if (boardPoint.betweenHarmony && boardPoint.col === 16) {
		var theBr = document.createElement("div");
		theBr.classList.add("clear");
		this.boardContainer.appendChild(theBr);
	}
};

VagabondActuator.prototype.doAnimateBoardPoint = function(boardPoint, moveToAnimate, theImg, theDiv) {
	debug("Animating? "+this.animationOn);
	if (!this.animationOn) return;

	var x = boardPoint.col, y = boardPoint.row, ox = x, oy = y;

	if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
		if (isSamePoint(moveToAnimate.endPoint, x, y)) {// Piece moved
			x = moveToAnimate.startPoint.rowAndColumn.col;
			y = moveToAnimate.startPoint.rowAndColumn.row;
			theImg.style.transform = "scale(1.2)";	// Make the pieces look like they're picked up a little when moving, good idea or no?
			theDiv.style.zIndex = 99;	// Make sure "picked up" pieces show up above others
		}
	} else if (moveToAnimate.moveType === DEPLOY) {
		if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {// Piece planted
			if (piecePlaceAnimation === 1) {
				theImg.style.transform = "scale(2)";
				theDiv.style.zIndex = 99;
				requestAnimationFrame(function() {
					theImg.style.transform = "scale(1)";
				});
			}
		}
	}

	var pointSizeMultiplierX = 34;
	var pointSizeMultiplierY = pointSizeMultiplierX;
	var unitString = "px";

	/* For small screen size using dynamic vw units */
	if (window.innerWidth <= 612) {
		pointSizeMultiplierX = 5.5555;
		pointSizeMultiplierY = 5.611;
		unitString = "vw";
	}

	/*theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
	theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;*/
	var left = (x - ox);
	var top = (y - oy);
	theImg.style.left = ((left * cos45 - top * sin45) * pointSizeMultiplierX) + unitString;
	theImg.style.top = ((top * cos45 + left * sin45) * pointSizeMultiplierY) + unitString;

	requestAnimationFrame(function() {
		theImg.style.left = "0px";
		theImg.style.top = "0px";
	});
	setTimeout(function() {
		requestAnimationFrame(function() {
			theImg.style.transform = "scale(1)";	// This will size back to normal after moving
		});
	}, pieceAnimationLength);
}

VagabondActuator.prototype.getTileImageSourceDir = function() {
	return "images/Vagabond/" + localStorage.getItem("vagabondTileDesignTypeKey") + "/";
};

VagabondActuator.prototype.printBoard = function(board) {
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
