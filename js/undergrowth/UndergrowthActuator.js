// Actuator

Undergrowth.Actuator = function(gameContainer, isMobile, enableAnimations) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;

	this.animationOn = enableAnimations;

	var containers = setupPaiShoBoard(
		this.gameContainer, 
		Undergrowth.Controller.getHostTilesContainerDivs(),
		Undergrowth.Controller.getGuestTilesContainerDivs(), 
		false
	);

	this.boardContainer = containers.boardContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

Undergrowth.Actuator.prototype.setAnimationOn = function(isOn) {
	this.animationOn = isOn;
};

Undergrowth.Actuator.prototype.actuate = function(board, theGame, moveToAnimate, moveAnimationBeginStep) {
	var self = this;

	if (!moveAnimationBeginStep) {
		moveAnimationBeginStep = 0;
	}

	debug("Move to animate:");
	debug(moveToAnimate);

	window.requestAnimationFrame(function() {
		self.htmlify(board, theGame, moveToAnimate, moveAnimationBeginStep);
	});
};

Undergrowth.Actuator.prototype.htmlify = function(board, theGame, moveToAnimate, moveAnimationBeginStep) {
	this.clearContainer(this.boardContainer);

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(cell, moveToAnimate, moveAnimationBeginStep);
			}
		});
	});

	var fullTileSet = new Undergrowth.TileManager(true);

	// Go through tile piles and clear containers
	fullTileSet.hostTiles.forEach(function(tile) {
		self.clearTileContainer(tile);
	});
	fullTileSet.guestTiles.forEach(function(tile) {
		self.clearTileContainer(tile);
	});

	// Go through tile piles and display
	theGame.tileManager.hostTiles.forEach(function(tile) {
		self.addTile(tile, this.hostTilesContainer);
	});
	theGame.tileManager.guestTiles.forEach(function(tile) {
		self.addTile(tile, this.guestTilesContainer);
	});
};

Undergrowth.Actuator.prototype.clearContainer = function (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

Undergrowth.Actuator.prototype.clearTileContainer = function (tile) {
	var container = document.querySelector("." + tile.getImageName());
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

Undergrowth.Actuator.prototype.addTile = function(tile, mainContainer) {
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

Undergrowth.Actuator.prototype.addBoardPoint = function(boardPoint, moveToAnimate, moveAnimationBeginStep) {
	var self = this;

	var theDiv = createBoardPointDiv(boardPoint);
	
	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add("activePoint");
		if (boardPoint.isType(POSSIBLE_MOVE)) {
			theDiv.classList.add("possibleMove");
		} else if (boardPoint.betweenHarmony) {
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

		var flags = {};
		
		if (moveToAnimate) {
			this.doAnimateBoardPoint(boardPoint, moveToAnimate, moveAnimationBeginStep, theImg, flags);
		}

		var srcValue = getSkudTilesSrcPath();
		theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";
		
		if (boardPoint.tile.inHarmony) {
			theDiv.classList.add(HOST + "harmony");
		}
		if (boardPoint.tile.inClash) {
			theDiv.classList.add(GUEST + "harmony");
		}
		
		theDiv.appendChild(theImg);
	} else {
		if (moveToAnimate) {
			var capturedStepInfo = this.getPointCapturedMoveStepInfo(boardPoint, moveToAnimate);
			if (capturedStepInfo 
					&& capturedStepInfo.capturedTileInfo 
					&& capturedStepInfo.capturedTileInfo.capturedTile) {
				var theImgCaptured = document.createElement("img");
				var srcValue = getSkudTilesSrcPath();
				theImgCaptured.src = srcValue + capturedStepInfo.capturedTileInfo.capturedTile.getImageName() + ".png";
				theDiv.appendChild(theImgCaptured);
				this.doAnimateBoardPoint(boardPoint, moveToAnimate, moveAnimationBeginStep, theImgCaptured, {
					capturedStepInfo: capturedStepInfo,
					theDiv: theDiv
				});
			}
		}
	}

	this.boardContainer.appendChild(theDiv);

	if (boardPoint.betweenHarmony && boardPoint.col === 16) {
		var theBr = document.createElement("div");
		theBr.classList.add("clear");
		this.boardContainer.appendChild(theBr);
	}
};

Undergrowth.Actuator.prototype.getPointCapturedMoveStepInfo = function(boardPoint, moveToAnimate) {
	var capturedStepInfo;
	if (moveToAnimate.capturedTiles1Info && moveToAnimate.capturedTiles1Info.length) {
		moveToAnimate.capturedTiles1Info.forEach(function(capturedTileInfo) {
			if (capturedTileInfo.boardPoint.row === boardPoint.row
				&& capturedTileInfo.boardPoint.col === boardPoint.col) {
				capturedStepInfo = {
					step: 1,
					capturedTileInfo: capturedTileInfo
				}
			}
		});
	}

	if (moveToAnimate.capturedTiles2Info && moveToAnimate.capturedTiles2Info.length) {
		moveToAnimate.capturedTiles2Info.forEach(function(capturedTileInfo) {
			if (capturedTileInfo.boardPoint.row === boardPoint.row
					&& capturedTileInfo.boardPoint.col === boardPoint.col) {
				capturedStepInfo = {
					step: 2,
					capturedTileInfo: capturedTileInfo
				};
			}
		});
	}

	return capturedStepInfo;
};

Undergrowth.Actuator.prototype.doAnimateBoardPoint = function(boardPoint, moveToAnimate, moveAnimationBeginStep, theImg, flags) {
	if (!this.animationOn) {
		return;
	}

	var x = boardPoint.col, 
		y = boardPoint.row, 
		ox = x, 
		oy = y;

	var ax = x, 
		ay = y;

	var forCapturedTile = false;
	var classesToAdd = [];
	var isBetweenHarmony = false;
	var addBhHost = false;
	var addBhGuest = false;
	if (flags.capturedStepInfo) {
		forCapturedTile = true;
		if (flags.theDiv.classList.contains("betweenHarmony")) {
			isBetweenHarmony = true;
			flags.theDiv.classList.remove("betweenHarmony");
			if (flags.theDiv.classList.contains("bhHost")) {
				addBhHost = true;
				flags.theDiv.classList.remove("bhHost");
			}
			if (flags.theDiv.classList.contains("bhGuest")) {
				addBhGuest = true;
				flags.theDiv.classList.remove("bhGuest");
			}
		}
	}

	if (moveAnimationBeginStep === 0) {
		if (moveToAnimate.moveType === PLANTING) {
			if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {// Piece planted
				if (piecePlaceAnimation === 1) {
					theImg.style.transform = "scale(2)";
					theImg.style.zIndex = 99; // Show new pieces above others
					requestAnimationFrame(function() {
						theImg.style.transform = "scale(1)";
					});
				}
			}
		}

		/* Animate captured tile */
		if (forCapturedTile && flags.capturedStepInfo.step === 1) {
			requestAnimationFrame(function() {
				theImg.style.transform = "scale(0)";
				if (isBetweenHarmony) {
					setTimeout(function() {
						flags.theDiv.classList.add("betweenHarmony");
						if (addBhHost) {
							flags.theDiv.classList.add("bhHost");
						}
						if (addBhGuest) {
							flags.theDiv.classList.add("bhGuest");
						}
					}, pieceAnimationLength);
				}
			});
		}
	}

	if (moveToAnimate.endPoint2 && isSamePoint(moveToAnimate.endPoint2, ox, oy)) {
		theImg.style.visibility = "hidden";
		if (piecePlaceAnimation === 1) {
			theImg.style.transform = "scale(2)";
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

	theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
	theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;

	ax = ((ax - ox) * pointSizeMultiplierX);
	ay = ((ay - oy) * pointSizeMultiplierY);

	requestAnimationFrame(function() {
		theImg.style.left = ax+unitString;
		theImg.style.top = ay+unitString;
		// theImg.style.transform = "scale(1)";	// This will size back to normal while moving after "picked up" scale
	});
	setTimeout(function() {
		requestAnimationFrame(function() {
			theImg.style.left = "0px";
			theImg.style.top = "0px";
			theImg.style.visibility = "visible";
			theImg.style.transform = "scale(1)";	// This will size back to normal after moving

			if (forCapturedTile) {
				theImg.style.transform = "scale(0)";	// Captured tiles go away
				if (isBetweenHarmony) {
					setTimeout(function() {
						flags.theDiv.classList.add("betweenHarmony");
						if (addBhHost) {
							flags.theDiv.classList.add("bhHost");
						}
						if (addBhGuest) {
							flags.theDiv.classList.add("bhGuest");
						}
					}, pieceAnimationLength);
				}
			}
		});
	}, moveAnimationBeginStep === 0 ? pieceAnimationLength : 0);
};

