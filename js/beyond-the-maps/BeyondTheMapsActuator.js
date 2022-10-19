// Actuator

BeyondTheMaps.Actuator = class {

	static hostTeamTilesDivId = "hostTilesContainer";
	static guestTeamTilesDivId = "guestTilesContainer";

	constructor(gameContainer, isMobile, enableAnimations) {
		this.gameContainer = gameContainer;
		this.mobile = isMobile;

		this.animationOn = enableAnimations;

		var rotateType = false;
		
		var containers = setupPaiShoBoard(
			this.gameContainer,
			BeyondTheMaps.Controller.getHostTilesContainerDivs(),
			BeyondTheMaps.Controller.getGuestTilesContainerDivs(),
			false,
			ADEVAR_ROTATE,
			true,
			gameOptionEnabled(EDGES_12x12_GAME) ? "12grid" : "18grid"
		);

		this.boardContainer = containers.boardContainer;
		this.arrowContainer = containers.arrowContainer;
		this.hostTilesContainer = containers.hostTilesContainer;
		this.guestTilesContainer = containers.guestTilesContainer;

		this.tileContainerTileDivs = {}
	}

	setAnimationOn(isOn) {
		this.animationOn = isOn;
	}

	actuate(board, markingManager, moveToAnimate) {
		var self = this;

		this.tileContainerTileDivs = {}

		debug(moveToAnimate);

		window.requestAnimationFrame(function() {
			self.htmlify(board, markingManager, moveToAnimate);
		});
	}

	htmlify(board, markingManager, moveToAnimate) {
		this.clearContainer(this.boardContainer);
		this.clearContainer(this.arrowContainer);

		var self = this;

		board.cells.forEach(function(column) {
			column.forEach(function(cell) {
				if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)) {
					cell.addType(MARKED);
				}
				else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)) {
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

		self.clearContainerWithId(BeyondTheMaps.Actuator.hostTeamTilesDivId);
		self.clearContainerWithId(BeyondTheMaps.Actuator.guestTeamTilesDivId);

		// Go through tile piles and display
		
	}

	shouldShowTile(tile) {
		// return tile.code.includes("Skud") || tile.code.includes("Vagabond");
		return true;
	}

	clearContainer(container) {
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}

	clearContainerWithId(containerIdName) {
		var container = document.getElementById(containerIdName);
		if (container) {
			this.clearContainer(container);
		}
	}

	clearTileContainer(tile) {
		var container = document.querySelector("." + tile.getNotationName());
		while (container.firstChild) {
			container.removeChild(container.firstChild);
		}
	}

	addTile(tile, tileContainer, pileName) {
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
	}

	getTileSrcPath(tile) {
		var srcValue = "images/beyond-the-maps/tiles/";
		return srcValue;
	}

	addBoardPoint(boardPoint, moveToAnimate) {
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
	}

	doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv) {
		debug("Animating? " + this.animationOn);
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
	}

	getRandomTilePileDiv(pileName) {
		return peekRandomFromArray(this.tileContainerTileDivs[pileName]);
	}

};
