// Actuator

function SkudPaiShoActuator(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;

	var containers = setupPaiShoBoard(
		this.gameContainer,
		SkudPaiShoController.getHostTilesContainerDivs(),
		SkudPaiShoController.getGuestTilesContainerDivs(),
		false
	);

	this.boardContainer = containers.boardContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

SkudPaiShoActuator.prototype.actuate = function(board, tileManager, moveToAnimate) {
	var self = this;
  debug("Game Actuated");
	// debugStackTrace();
	// self.printBoard(board);

	window.requestAnimationFrame(function() {
		self.htmlify(board, tileManager, moveToAnimate);
	});
};

SkudPaiShoActuator.prototype.htmlify = function(board, tileManager, moveToAnimate) {
	this.clearContainer(this.boardContainer);

	if (moveToAnimate && moveToAnimate.moveType === ARRANGING) {
		var cell = board.cells[moveToAnimate.endPoint.rowAndColumn.row][moveToAnimate.endPoint.rowAndColumn.col];
		if (cell.hasTile() && cell.tile.code === "O") {
			moveToAnimate.isOrchidMove = true;
		}
	}

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(cell, moveToAnimate);
			}
		});
	});

	var fullTileSet = new SkudPaiShoTileManager(true);

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

SkudPaiShoActuator.prototype.clearContainer = function (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

SkudPaiShoActuator.prototype.clearTileContainer = function (tile) {
	var container = document.querySelector("." + tile.getImageName());
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

SkudPaiShoActuator.prototype.addTile = function(tile, mainContainer) {
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

	var srcValue = getSkudTilesSrcPath();
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

SkudPaiShoActuator.prototype.addBoardPoint = function(boardPoint, moveToAnimate) {
	var self = this;

	var theDiv = createBoardPointDiv(boardPoint);

	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add("activePoint");
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			theDiv.classList.add("possibleMove");
		} else if (boardPoint.betweenHarmony && !gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)) {
			theDiv.classList.add("betweenHarmony");
			if (boardPoint.betweenHarmonyHost) {
				theDiv.classList.add("bhHost");
			}
			if (boardPoint.betweenHarmonyGuest) {
				theDiv.classList.add("bhGuest");
			}
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
		var drainedOnThisTurn = false;

		if (moveToAnimate) {
			var x = boardPoint.col, y = boardPoint.row, ox = x, oy = y, placedOnAccent = false;

			if (moveToAnimate.hasHarmonyBonus()) {
				debug(moveToAnimate.bonusTileCode);
				if (isSamePoint(moveToAnimate.bonusEndPoint, ox, oy)) {// Placed on bonus turn
					placedOnAccent = true;
				} else if (moveToAnimate.boatBonusPoint && isSamePoint(moveToAnimate.boatBonusPoint, x, y)) {// Moved by boat
					x = moveToAnimate.bonusEndPoint.rowAndColumn.col;
					y = moveToAnimate.bonusEndPoint.rowAndColumn.row;
				} else if (moveToAnimate.bonusTileCode === "W") {
					var dx = x - moveToAnimate.bonusEndPoint.rowAndColumn.col;
					var dy = y - moveToAnimate.bonusEndPoint.rowAndColumn.row;
					if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy && (dx + dy) !== (dx * dy)) {// Moved by wheel
						if (dx === 1 && dy > -1) y--;
						else if (dy === -1 && dx > -1) x--;
						else if (dx === -1 && dy < 1) y++;
						else x++;
					}
				} else if (moveToAnimate.bonusTileCode === "K") {
					var dx = x - moveToAnimate.bonusEndPoint.rowAndColumn.col;
					var dy = y - moveToAnimate.bonusEndPoint.rowAndColumn.row;
					if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy && (dx + dy) !== (dx * dy)) {// Trapped by knotweed
						drainedOnThisTurn = true;
					}
				}
			}

			var ax = x, ay = y;

			if (moveToAnimate.moveType === ARRANGING && boardPoint.tile.type !== ACCENT_TILE) {
				if (isSamePoint(moveToAnimate.endPoint, x, y)) {// Piece moved
					x = moveToAnimate.startPoint.rowAndColumn.col;
					y = moveToAnimate.startPoint.rowAndColumn.row;
				} else if (moveToAnimate.isOrchidMove) {
					var dx = x - moveToAnimate.endPoint.rowAndColumn.col;
					var dy = y - moveToAnimate.endPoint.rowAndColumn.row;
					if (-1 <= dx && 1 >= dx && -1 <= dy && 1 >= dy) {// Trapped by orchid
						drainedOnThisTurn = true;
					}
				}
			}

			if (moveToAnimate.moveType === PLANTING) {
				if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {// Piece planted
					if (piecePlaceAnimation === 1) {
						theImg.style.transform = "scale(2)";
						requestAnimationFrame(function() {
							theImg.style.transform = "scale(1)";
						});
					}
				}
			}

			if ((x !== ox || y !== oy) && (boardPoint.tile.drained || boardPoint.tile.trapped)) {
				drainedOnThisTurn = true;
			}

			theImg.style.left = ((x - ox) * 34) + "px";
			theImg.style.top = ((y - oy) * 34) + "px";
			if (placedOnAccent) {
				theImg.style.visibility = "hidden";
				if (piecePlaceAnimation === 1) {
					theImg.style.transform = "scale(2)";
				}
			}
			ax = ((ax - ox) * 34);
			ay = ((ay - oy) * 34);
			requestAnimationFrame(function() {
				theImg.style.left = ax+"px";
				theImg.style.top = ay+"px";
			});
			setTimeout(function() {
				requestAnimationFrame(function() {
					theImg.style.left = "0px";
					theImg.style.top = "0px";
					theImg.style.visibility = "visible";
					theImg.style.transform = "scale(1)";
				});
			}, pieceAnimationLength);
		}


		var srcValue = getSkudTilesSrcPath();
		theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";

		if (boardPoint.tile.harmonyOwners && !gameOptionEnabled(NO_HARMONY_VISUAL_AIDS)) {
			for (var i = 0; i < boardPoint.tile.harmonyOwners.length; i++) {
				theDiv.classList.add(boardPoint.tile.harmonyOwners[i] + "harmony");
			}
		}

		if (drainedOnThisTurn) {
			setTimeout(function() {
				theDiv.classList.add("drained");
			}, pieceAnimationLength);
		} else if (boardPoint.tile.drained || boardPoint.tile.trapped) {
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

SkudPaiShoActuator.prototype.printBoard = function(board) {

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
