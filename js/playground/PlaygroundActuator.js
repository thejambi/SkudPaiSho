// Actuator

function PlaygroundActuator(gameContainer, isMobile, enableAnimations) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;

	this.animationOn = enableAnimations;

	var rotateType = false;
	if (gameOptionEnabled(ADEVAR_ROTATE)) rotateType = ADEVAR_ROTATE;
	if (gameOptionEnabled(VAGABOND_ROTATE)) rotateType = VAGABOND_ROTATE;
	if (gameOptionEnabled(GINSENG_ROTATE)) rotateType = GINSENG_ROTATE;

	var containers = setupPaiShoBoard(
		this.gameContainer, 
		PlaygroundController.getHostTilesContainerDivs(),
		PlaygroundController.getGuestTilesContainerDivs(), 
		(gameOptionEnabled(VAGABOND_ROTATE) || gameOptionEnabled(ADEVAR_ROTATE) || gameOptionEnabled(GINSENG_ROTATE)),
		rotateType,
		gameOptionEnabled(PLAY_IN_SPACES)
	);

	this.boardContainer = containers.boardContainer;
	this.arrowContainer = containers.arrowContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;

	this.tileContainerTileDivs = {};
}

PlaygroundActuator.hostTeamTilesDivId = "hostTilesContainer";
PlaygroundActuator.guestTeamTilesDivId = "guestTilesContainer";

PlaygroundActuator.prototype.setAnimationOn = function(isOn) {
	this.animationOn = isOn;
};

PlaygroundActuator.prototype.actuate = function(board, tileManager, markingManager, actuateOptions, moveToAnimate) {
	var self = this;
	this.actuateOptions = actuateOptions;

	this.tileContainerTileDivs = {};

	debug(moveToAnimate);

	window.requestAnimationFrame(function () {
		self.htmlify(board, tileManager, markingManager, moveToAnimate);
	});
};

PlaygroundActuator.prototype.htmlify = function(board, tileManager, markingManager, moveToAnimate) {
	this.clearContainer(this.boardContainer);
	this.clearContainer(this.arrowContainer);

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)){
				cell.addType(MARKED);
			}
			else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)){
				cell.removeType(MARKED);
			}
			if (cell) {
				self.addBoardPoint(cell, moveToAnimate);
			}
		});
	});

	// Draw all arrows
	for (var [_, arrow] of Object.entries(markingManager.arrows)) {
		this.arrowContainer.appendChild(createBoardArrow(arrow[0], arrow[1]));
	}

	var fullTileSet = new PlaygroundTileManager(true);

	self.clearContainerWithId(PlaygroundActuator.hostTeamTilesDivId);
	self.clearContainerWithId(PlaygroundActuator.guestTeamTilesDivId);

	if (this.actuateOptions.showTileReserve) {
		// Host Tile Reserve
		var hostTileReserveContainer = document.createElement("span");
		hostTileReserveContainer.classList.add("tileLibrary");
		var hostReserveLabel = document.createElement("span");
		hostReserveLabel.innerText = "--Host Tile Reserve--";
		hostTileReserveContainer.appendChild(hostReserveLabel);
		if (tileManager.hostTileReserve.length > 1) {
			hostTileReserveContainer.appendChild(document.createElement("br"));
			var drawRandomLink = document.createElement("span");
			drawRandomLink.onclick = function(){
				gameController.selectRandomTile(PlaygroundNotationConstants.hostReservePile);
			};
			drawRandomLink.classList.add("skipBonus");
			drawRandomLink.innerText = "Select Random";
			hostTileReserveContainer.appendChild(drawRandomLink);
		}
		hostTileReserveContainer.appendChild(document.createElement("br"));
		this.hostTilesContainer.appendChild(hostTileReserveContainer);

		// Guest Tile Reserve
		var guestTileReserveContainer = document.createElement("span");
		guestTileReserveContainer.classList.add("tileLibrary");
		var guestReserveLabel = document.createElement("span");
		guestReserveLabel.innerText = "--Guest Tile Reserve--";
		guestTileReserveContainer.appendChild(guestReserveLabel);
		if (tileManager.guestTileReserve.length > 1) {
			guestTileReserveContainer.appendChild(document.createElement("br"));
			var drawRandomLink = document.createElement("span");
			drawRandomLink.onclick = function(){
				gameController.selectRandomTile(PlaygroundNotationConstants.guestReservePile);
			};
			drawRandomLink.classList.add("skipBonus");
			drawRandomLink.innerText = "Select Random";
			guestTileReserveContainer.appendChild(drawRandomLink);
		}
		guestTileReserveContainer.appendChild(document.createElement("br"));
		this.guestTilesContainer.appendChild(guestTileReserveContainer);

		// Captured/Removed Bank
		var capturedTileContainer = document.createElement("span");
		capturedTileContainer.classList.add("tileLibrary");
		var capturedTileLabel = document.createElement("span");
		capturedTileLabel.innerText = "--Captured/Removed Tiles--";
		capturedTileContainer.appendChild(capturedTileLabel);
		capturedTileContainer.appendChild(document.createElement("br"));
		this.guestTilesContainer.appendChild(capturedTileContainer);
	}

	if (this.actuateOptions.showTileLibrary) {
		// Host Tile Library
		var hostTileLibraryContainer = document.createElement("span");
		hostTileLibraryContainer.classList.add("tileLibrary");
		var hostLibraryLabel = document.createElement("span");
		hostLibraryLabel.innerText = "--Host Tile Library--";
		hostTileLibraryContainer.appendChild(hostLibraryLabel);
		hostTileLibraryContainer.appendChild(document.createElement("br"));
		this.guestTilesContainer.appendChild(hostTileLibraryContainer);

		// Guest Tile Library
		var guestTileLibraryContainer = document.createElement("span");
		guestTileLibraryContainer.classList.add("tileLibrary");
		var guestLibraryLabel = document.createElement("span");
		guestLibraryLabel.innerText = "--Guest Tile Library--";
		guestTileLibraryContainer.appendChild(guestLibraryLabel);
		guestTileLibraryContainer.appendChild(document.createElement("br"));
		this.guestTilesContainer.appendChild(guestTileLibraryContainer);
	}

	// Go through tile piles and display
	if (this.actuateOptions.showTileReserve) {
		tileManager.hostTileReserve.forEach(function(tile) {
			self.addTile(tile, hostTileReserveContainer, PlaygroundNotationConstants.hostReservePile);
		});
		tileManager.guestTileReserve.forEach(function(tile) {
			self.addTile(tile, guestTileReserveContainer, PlaygroundNotationConstants.guestReservePile);
		});
		tileManager.capturedTiles.forEach(function(tile) {
			self.addTile(tile, capturedTileContainer, PlaygroundNotationConstants.capturedPile);
		});
	}

	if (this.actuateOptions.showTileLibrary) {
		tileManager.hostTileLibrary.forEach(function(tile) {
			if (self.shouldShowTile(tile)) {
				self.addTile(tile, hostTileLibraryContainer, PlaygroundNotationConstants.hostLibraryPile);
			}
		});
		tileManager.guestTileLibrary.forEach(function(tile) {
			if (self.shouldShowTile(tile)) {
				self.addTile(tile, guestTileLibraryContainer, PlaygroundNotationConstants.guestLibraryPile);
			}
		});
	}
};

PlaygroundActuator.prototype.shouldShowTile = function(tile) {
	// return tile.code.includes("Skud") || tile.code.includes("Vagabond");
	return true;
};

PlaygroundActuator.prototype.clearContainer = function (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

PlaygroundActuator.prototype.clearContainerWithId = function(containerIdName) {
	var container = document.getElementById(containerIdName);
	if (container) {
		this.clearContainer(container);
	}
};

PlaygroundActuator.prototype.clearTileContainer = function (tile) {
	var container = document.querySelector("." + tile.getNotationName());
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

PlaygroundActuator.prototype.addTile = function(tile, tileContainer, pileName) {
	if (!tile) {
		return;
	}
	var theDiv = document.createElement("div");

	theDiv.classList.add("point");

	if (gameOptionEnabled(SQUARE_SPACES)) {
		theDiv.classList.add("pointSquare");
	}

	theDiv.classList.add("hasTile");

	if (tile.selectedFromPile || tile.gameType === "PossibleMove") {
		theDiv.classList.add("selectedFromPile");
		theDiv.classList.add("drained");
	}

	if (tile.gameType !== "PossibleMove") {
		var theImg = document.createElement("img");
		
		// var srcValue = getSkudTilesSrcPath();
		var srcValue = this.getTileSrcPath(tile);
		theImg.src = srcValue + tile.getImageName() + ".png";
		theDiv.appendChild(theImg);
	}

	theDiv.setAttribute("name", tile.getNotationName());
	theDiv.setAttribute("id", tile.id);
	theDiv.setAttribute("data-pileName", pileName);

	if (this.mobile) {
		theDiv.setAttribute("onclick", "unplayedTileClicked(this); showTileMessage(this);");
	} else {
		theDiv.setAttribute("onclick", "unplayedTileClicked(this);");
		theDiv.setAttribute("onmouseover", "showTileMessage(this);");
		theDiv.setAttribute("onmouseout", "clearMessage();");
	}

	tileContainer.appendChild(theDiv);

	if (!this.tileContainerTileDivs[pileName]) {
		this.tileContainerTileDivs[pileName] = [];
	}
	this.tileContainerTileDivs[pileName].push(theDiv);
};

PlaygroundActuator.prototype.getTileSrcPath = function(tile) {
	var srcValue = "images/";

	var gameImgDir;
	if (tile.gameType === GameType.SkudPaiSho) {
		gameImgDir = "SkudPaiSho/" + getUserGamePreference(tileDesignTypeKey);
	} else if (tile.gameType === GameType.VagabondPaiSho) {
		gameImgDir = "Vagabond/" + getUserGamePreference(vagabondTileDesignTypeKey);
	} else if (tile.gameType === GameType.CapturePaiSho) {
		gameImgDir = "Capture/" + getUserGamePreference(CapturePreferences.tileDesignKey);
	} else if (tile.gameType === GameType.Playground) {
		gameImgDir = "Playground";
	} else if (tile.gameType === "Advr") {
		gameImgDir = "Adevar/" + getUserGamePreference(AdevarOptions.tileDesignTypeKey);
	} else if (tile.gameType === "Warfront") {
		gameImgDir = "Warfront";
	} else if (tile.gameType === "Balance") {
		gameImgDir = "Balance/balance";
	} else if (tile.gameType === "Spirit") {
		gameImgDir = "Spirit/original";
	} else {
		gameImgDir = tile.gameType;
	}
	if (gameImgDir) {
		srcValue = srcValue + gameImgDir + "/";
	}

	return srcValue;
};

PlaygroundActuator.prototype.addBoardPoint = function(boardPoint, moveToAnimate) {
	var self = this;

	var theDiv = createBoardPointDiv(boardPoint);
	
	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add("activePoint");
		if (boardPoint.isType(MARKED)) {
			theDiv.classList.add("markedPoint");
		}
		if (gameOptionEnabled(VAGABOND_ROTATE)) {
			theDiv.classList.add("vagabondPointRotate");
		} else if (gameOptionEnabled(ADEVAR_ROTATE)) {
			theDiv.classList.add("adevarPointRotate");
		} else if (gameOptionEnabled(GINSENG_ROTATE)) {
			theDiv.classList.add("ginsengPointRotate");
		}
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
			theDiv.addEventListener('mousedown', e => {
				 // Right Mouse Button
				if (e.button == 2) {
					RmbDown(theDiv);
				}
			});
			theDiv.addEventListener('mouseup', e => {
				 // Right Mouse Button
				if (e.button == 2) {
					RmbUp(theDiv);
				}
			});
			theDiv.addEventListener('contextmenu', e => {
					e.preventDefault();
			});
		}
	}

	if (boardPoint.hasTile()) {
		theDiv.classList.add("hasTile");
		
		var theImg = document.createElement("img");
		theImg.elementStyleTransform = new ElementStyleTransform(theImg);

		if (gameOptionEnabled(ADEVAR_ROTATE)) {
			theImg.elementStyleTransform.setValue("rotate", 225, "deg");
		} else if (gameOptionEnabled(VAGABOND_ROTATE)) {
			theImg.elementStyleTransform.setValue("rotate", 315, "deg");
		} else if (gameOptionEnabled(GINSENG_ROTATE)) {
			theImg.elementStyleTransform.setValue("rotate", 270, "deg");
		} else if (gameOptionEnabled(GINSENG_GUEST_ROTATE)) {
			theImg.elementStyleTransform.setValue("rotate", 90, "deg");
		}

		if (boardPoint.tile.directionToFace) {
			theImg.elementStyleTransform.adjustValue("rotate", 90*boardPoint.tile.directionToFace, "deg");
		}

		if (moveToAnimate) {
			this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv);
		}

		var srcValue = this.getTileSrcPath(boardPoint.tile);
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

PlaygroundActuator.prototype.doAnimateBoardPoint = function(boardPoint, moveToAnimate, theImg, theDiv) {
	debug("Animating? "+this.animationOn);
	if (!this.animationOn) return;

	var x = boardPoint.col, y = boardPoint.row, ox = x, oy = y;

	if (moveToAnimate.moveType === MOVE && boardPoint.tile) {
		if (isSamePoint(moveToAnimate.endPoint, x, y)) {// Piece moved
			x = moveToAnimate.startPoint.rowAndColumn.col;
			y = moveToAnimate.startPoint.rowAndColumn.row;
			theImg.elementStyleTransform.setValue("scale", 1.2);	// Make the pieces look like they're picked up a little when moving, good idea or no?
			theDiv.style.zIndex = 99;	// Make sure "picked up" pieces show up above others
		}
	} else if (moveToAnimate.moveType === DEPLOY) {
		if (isSamePoint(moveToAnimate.endPoint, ox, oy)) {// Piece planted
			if (piecePlaceAnimation === 1) {
				theImg.elementStyleTransform.setValue("scale", 2);
				theDiv.style.zIndex = 99;
				requestAnimationFrame(function() {
					theImg.elementStyleTransform.setValue("scale", 1);
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

	// if (gameOptionEnabled(ADEVAR_ROTATE)) {
	// 	var left = (x - ox);
	// 	var top = (y - oy);
	// 	theImg.style.left = ((left * cos135 - top * sin135) * pointSizeMultiplierX) + unitString;
	// 	theImg.style.top = ((top * cos135 + left * sin135) * pointSizeMultiplierY) + unitString;
	// } else if (gameOptionEnabled(VAGABOND_ROTATE)) {
	// 	var left = (x - ox);
	// 	var top = (y - oy);
	// 	theImg.style.left = ((left * cos45 - top * sin45) * pointSizeMultiplierX) + unitString;
	// 	theImg.style.top = ((top * cos45 + left * sin45) * pointSizeMultiplierY) + unitString;
	// } else if (gameOptionEnabled(GINSENG_ROTATE)) {
	// 	var left = (x - ox);
	// 	var top = (y - oy);
	// 	theImg.style.left = ((left * cos90 - top * sin90) * pointSizeMultiplierX) + unitString;
	// 	theImg.style.top = ((top * cos90 + left * sin90) * pointSizeMultiplierY) + unitString;
	// } else {
	// 	theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
	// 	theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;
	// }
	theImg.style.left = ((x - ox) * pointSizeMultiplierX) + unitString;
	theImg.style.top = ((y - oy) * pointSizeMultiplierY) + unitString;

	requestAnimationFrame(function() {
		theImg.style.left = "0px";
		theImg.style.top = "0px";
	});
	setTimeout(function() {
		requestAnimationFrame(function() {
			theImg.elementStyleTransform.setValue("scale", 1);	// This will size back to normal after moving
		});
	}, pieceAnimationLength);
};

PlaygroundActuator.prototype.getRandomTilePileDiv = function(pileName) {
	return peekRandomFromArray(this.tileContainerTileDivs[pileName]);
};

