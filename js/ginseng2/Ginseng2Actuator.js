// // Ginseng Actuator

// Ginseng2.Actuator = function(gameContainer, isMobile, enableAnimations) {
// 	this.gameContainer = gameContainer;
// 	this.mobile = isMobile;

// 	this.animationOn = enableAnimations;

// 	var containers = setupPaiShoBoard(
// 		this.gameContainer, 
// 		Ginseng2.Controller.getHostTilesContainerDivs(),
// 		Ginseng2.Controller.getGuestTilesContainerDivs(), 
// 		true,
// 		Ginseng.Options.viewAsGuest ? GINSENG_GUEST_ROTATE : GINSENG_ROTATE
// 	);

// 	this.boardContainer = containers.boardContainer;
// 	this.arrowContainer = containers.arrowContainer;
// 	this.hostTilesContainer = containers.hostTilesContainer;
// 	this.guestTilesContainer = containers.guestTilesContainer;
// };

// Ginseng2.Actuator.hostTeamTilesDivId = "hostTilesContainer";
// Ginseng2.Actuator.guestTeamTilesDivId = "guestTilesContainer";

// Ginseng2.Actuator.prototype.setAnimationOn = function(isOn) {
// 	this.animationOn = isOn;
// };

// Ginseng2.Actuator.prototype.actuate = function(board, tileManager, markingManager, moveToAnimate, moveDetails) {
// 	var self = this;

// 	debug("Move to animate: ");
// 	debug(moveToAnimate);

// 	window.requestAnimationFrame(function () {
// 		self.htmlify(board, tileManager, markingManager, moveToAnimate, moveDetails);
// 	});
// };

// Ginseng2.Actuator.prototype.htmlify = function(board, tileManager, markingManager, moveToAnimate, moveDetails) {
// 	this.clearContainer(this.boardContainer);
// 	this.clearContainer(this.arrowContainer);

// 	var self = this;

// 	board.cells.forEach(function(column) {
// 		column.forEach(function(cell) {
// 			if (markingManager.pointIsMarked(cell) && !cell.isType(MARKED)){
// 				cell.addType(MARKED);
// 			}
// 			else if (!markingManager.pointIsMarked(cell) && cell.isType(MARKED)){
// 				cell.removeType(MARKED);
// 			}
// 			if (cell) {
// 				self.addBoardPoint(cell, board, moveToAnimate, moveDetails);
// 			}
// 		});
// 	});

// 	// Draw all arrows
// 	for (var [_, arrow] of Object.entries(markingManager.arrows)) {
// 		this.arrowContainer.appendChild(createBoardArrow(arrow[0], arrow[1]));
// 	}

// 	/* Player Tiles */

// 	self.clearContainerWithId(Ginseng2.Actuator.hostTeamTilesDivId);
// 	self.clearContainerWithId(Ginseng2.Actuator.guestTeamTilesDivId);
	
// 	var hostCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, HOST);
// 	var guestCapturedTiles = getTilesForPlayer(tileManager.capturedTiles, GUEST);

// 	var showHostCapturedTiles = hostCapturedTiles.length > 0;
// 	if (showHostCapturedTiles) {
// 		var hostCapturedTilesContainer = document.createElement("span");
// 		hostCapturedTilesContainer.classList.add("tileLibrary");
// 		var capturedTileLabel = document.createElement("span");
// 		capturedTileLabel.innerText = "--Captured Tiles--";
// 		hostCapturedTilesContainer.appendChild(capturedTileLabel);
// 		hostCapturedTilesContainer.appendChild(document.createElement("br"));
// 		this.hostTilesContainer.appendChild(hostCapturedTilesContainer);
// 	}

// 	var showGuestCapturedTiles = guestCapturedTiles.length > 0;
// 	if (showGuestCapturedTiles) {
// 		var guestCapturedTilesContainer = document.createElement("span");
// 		guestCapturedTilesContainer.classList.add("tileLibrary");
// 		var capturedTileLabel = document.createElement("span");
// 		capturedTileLabel.innerText = "--Captured Tiles--";
// 		guestCapturedTilesContainer.appendChild(capturedTileLabel);
// 		guestCapturedTilesContainer.appendChild(document.createElement("br"));
// 		this.guestTilesContainer.appendChild(guestCapturedTilesContainer);
// 	}

// 	if (showHostCapturedTiles) {
// 		hostCapturedTiles.forEach((tile) => {
// 			this.addTile(tile, hostCapturedTilesContainer, true);
// 		});
// 	}
// 	if (showGuestCapturedTiles) {
// 		guestCapturedTiles.forEach((tile) => {
// 			this.addTile(tile, guestCapturedTilesContainer, true);
// 		});
// 	}
// };

// Ginseng2.Actuator.prototype.addTile = function(tile, tileContainer, isCaptured) {
// 	if (!tile) {
// 		return;
// 	}
// 	var theDiv = document.createElement("div");

// 	theDiv.classList.add("point");
// 	theDiv.classList.add("hasTile");

// 	if (tile.selectedFromPile || tile.tileIsSelectable) {
// 		theDiv.classList.add("selectedFromPile");
// 		theDiv.classList.add("drained");
// 	}

// 	var theImg = document.createElement("img");
	
// 	var srcValue = this.getTileSrcPath(tile);
// 	theImg.src = srcValue + tile.getImageName() + ".png";
// 	theDiv.appendChild(theImg);

// 	theDiv.setAttribute("name", tile.getNotationName());
// 	theDiv.setAttribute("id", tile.id);

// 	var clickable = !isCaptured;
// 	if (tile.tileIsSelectable) {
// 		clickable = true;
// 	}
// 	if (clickable) {
// 		if (this.mobile) {
// 			theDiv.setAttribute("onclick", "unplayedTileClicked(this); showTileMessage(this);");
// 		} else {
// 			theDiv.setAttribute("onclick", "unplayedTileClicked(this);");
// 			theDiv.setAttribute("onmouseover", "showTileMessage(this);");
// 			theDiv.setAttribute("onmouseout", "clearMessage();");
// 		}
// 	}

// 	tileContainer.appendChild(theDiv);
// };

// Ginseng2.Actuator.prototype.clearContainer = function (container) {
// 	while (container.firstChild) {
// 		container.removeChild(container.firstChild);
// 	}
// };

// Ginseng2.Actuator.prototype.clearContainerWithId = function(containerIdName) {
// 	var container = document.getElementById(containerIdName);
// 	if (container) {
// 		this.clearContainer(container);
// 	}
// };

// // Ginseng2.Actuator.prototype.clearTileContainer = function(tile) {
// // 	var container = document.querySelector("." + tile.getImageName());
// // 	while (container.firstChild) {
// // 		container.removeChild(container.firstChild);
// // 	}
// // };

// Ginseng2.Actuator.prototype.addLineBreakInTilePile = function(player) {
// 	var containerDivId = player === HOST 
// 								? Ginseng2.Actuator.hostTeamTilesDivId
// 								: Ginseng2.Actuator.guestTeamTilesDivId;
// 	var container = document.getElementById(containerDivId);

// 	var theBr = document.createElement("br");
// 	theBr.classList.add("clear");
// 	container.appendChild(theBr);
// };

// Ginseng2.Actuator.prototype.addTeamTile = function(tile, player, isForTeamSelection) {
// 	var self = this;

// 	var containerDivId = player === HOST 
// 								? Ginseng2.Actuator.hostTeamTilesDivId
// 								: Ginseng2.Actuator.guestTeamTilesDivId;
// 	var container = document.getElementById(containerDivId);

// 	var theDiv = document.createElement("div");

// 	theDiv.classList.add("point");
// 	theDiv.classList.add("hasTile");

// 	if (isForTeamSelection) {
// 		theDiv.classList.add("selectedFromPile");
// 	} else if (tile.selectedFromPile) {
// 		theDiv.classList.add("selectedFromPile");
// 		theDiv.classList.add("drained");
// 	}

// 	var theImg = document.createElement("img");

// 	var srcValue = this.getTileSrcPath();

// 	theImg.src = srcValue + tile.getImageName() + ".png";
// 	theDiv.appendChild(theImg);

// 	theDiv.setAttribute("name", tile.getImageName());
// 	theDiv.setAttribute("id", tile.id);

// 	if (this.mobile) {
// 		theDiv.setAttribute("onclick", "unplayedTileClicked(this); showTileMessage(this);");
// 	} else {
// 		theDiv.setAttribute("onclick", "unplayedTileClicked(this);");
// 		theDiv.setAttribute("onmouseover", "showTileMessage(this);");
// 		theDiv.setAttribute("onmouseout", "clearMessage();");
// 	}

// 	container.appendChild(theDiv);
// };

// Ginseng2.Actuator.prototype.addBoardPoint = function(boardPoint, board, moveToAnimate, moveDetails) {
// 	var self = this;

// 	var theDiv = createBoardPointDiv(boardPoint, null, Ginseng2.NotationAdjustmentFunction);

// 	if (!boardPoint.isType(NON_PLAYABLE)) {
// 		theDiv.classList.add("activePoint");
// 		if (boardPoint.isType(MARKED)) {
// 			theDiv.classList.add("markedPoint");
// 		}
		
// 		if (Ginseng.Options.viewAsGuest) {
// 			theDiv.classList.add("ginsengGuestPointRotate");
// 		} else {
// 			theDiv.classList.add("ginsengPointRotate");
// 		}

// 		if (boardPoint.isType(POSSIBLE_MOVE)) {
// 			theDiv.classList.add("possibleMove");
// 			if (board.currentlyDeployingTileInfo && board.currentlyDeployingTileInfo.attributes
// 					&& board.currentlyDeployingTileInfo.attributes.includes(Ginseng2.AttributeType.gigantic)) {
// 				// Gigantic!
// 				this.adjustBoardPointForGiganticDeploy(theDiv, boardPoint);
// 			}

// 			theDiv.style.zIndex = 95;
// 		}
		
// 		if (this.mobile) {
// 			theDiv.setAttribute("onclick", "pointClicked(this); showPointMessage(this);");
// 		} else {
// 			theDiv.setAttribute("onclick", "pointClicked(this);");
// 			theDiv.setAttribute("onmouseover", "showPointMessage(this);");
// 			theDiv.setAttribute("onmouseout", "clearMessage();");
// 			theDiv.addEventListener('mousedown', e => {
// 				 // Right Mouse Button
// 				if (e.button == 2) {
// 					RmbDown(theDiv);
// 				}
// 			});
// 			theDiv.addEventListener('mouseup', e => {
// 				 // Right Mouse Button
// 				if (e.button == 2) {
// 					RmbUp(theDiv);
// 				}
// 			});
// 			theDiv.addEventListener('contextmenu', e => {
// 					e.preventDefault();
// 			});
// 		}
// 	}

// 	if ((boardPoint.hasTile() && !boardPoint.occupiedByAbility)
// 			|| (moveToAnimate && !boardPoint.hasTile() 
// 				&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row))) {
// 		theDiv.classList.add("hasTile");
		
// 		var theImg = document.createElement("img");
// 		theImg.elementStyleTransform = new ElementStyleTransform(theImg);

// 		theImg.elementStyleTransform.setValue("rotate", 270, "deg");
// 		if (Ginseng.Options.viewAsGuest) {
// 			theImg.elementStyleTransform.adjustValue("rotate", 180, "deg");
// 		}

// 		if (moveToAnimate || boardPoint.tile.isGigantic) {
// 			this.doAnimateBoardPoint(boardPoint, moveToAnimate, theImg, theDiv, moveDetails);
// 		}

// 		var srcValue = this.getTileSrcPath();

// 		var tileMoved = boardPoint.tile;

// 		var showMovedTileDuringAnimation = this.animationOn && moveDetails && moveDetails.movedTile
// 											&& isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row);
// 		if (showMovedTileDuringAnimation) {
// 			tileMoved = moveDetails.movedTile;
// 		}
		
// 		theImg.src = srcValue + tileMoved.getImageName() + ".png";
		
// 		theDiv.appendChild(theImg);

// 		var capturedTile = this.getCapturedTileFromMove(moveDetails);

// 		if (showMovedTileDuringAnimation) {
// 			setTimeout(function() {
// 				requestAnimationFrame(function(){
// 					if (boardPoint.hasTile()) {
// 						theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";
// 					} else {
// 						theImg.classList.add("gone");
// 					}
// 				});
// 			}, pieceAnimationLength);
// 		}
// 		if (this.animationOn && moveToAnimate && capturedTile && isSamePoint(moveToAnimate.endPoint, boardPoint.col, boardPoint.row)) {
// 			var theImgCaptured = document.createElement("img");
// 			theImgCaptured.elementStyleTransform = new ElementStyleTransform(theImgCaptured);
// 			theImgCaptured.src = srcValue + capturedTile.getImageName() + ".png";
// 			theImgCaptured.classList.add("underneath");

// 			theImgCaptured.elementStyleTransform.setValue("rotate", 270, "deg");
// 			if (Ginseng.Options.viewAsGuest) {
// 				theImgCaptured.elementStyleTransform.adjustValue("rotate", 180, "deg");
// 			}

// 			theDiv.appendChild(theImgCaptured);

// 			/* After animation, hide captured tile */
// 			setTimeout(function() {
// 				requestAnimationFrame(function() {
// 					theImgCaptured.style.visibility = "hidden";
// 				});
// 			}, pieceAnimationLength);
// 		}
// 	}

// 	if (boardPoint.occupiedByAbility) {
// 		theDiv.classList.remove("activePoint");
// 	}

// 	this.boardContainer.appendChild(theDiv);

// 	if (boardPoint.betweenHarmony && boardPoint.col === 16) {
// 		var theBr = document.createElement("div");
// 		theBr.classList.add("clear");
// 		this.boardContainer.appendChild(theBr);
// 	}
// };

// Ginseng2.Actuator.prototype.getCapturedTileFromMove = function(moveDetails) {
// 	if (moveDetails && moveDetails.capturedTiles && moveDetails.capturedTiles.length === 1) {
// 		return moveDetails.capturedTiles[0];
// 	}
// 	return null;
// };

// /* Can remove? */
// Ginseng2.Actuator.prototype.adjustBoardPointForGiganticDeploy = function(theDiv, boardPoint) {
// 	var x = boardPoint.col, y = boardPoint.row, ox = x, oy = y;

// 	var pointSizeMultiplierX = 34;
// 	var pointSizeMultiplierY = pointSizeMultiplierX;
// 	var unitString = "px";

// 	/* For small screen size using dynamic vw units */
// 	if (window.innerWidth <= 612) {
// 		pointSizeMultiplierX = 5.5555;
// 		pointSizeMultiplierY = 5.611;
// 		unitString = "vw";
// 	}

// 	var scaleValue = 1;

// 	var left = (x - ox);
// 	var top = (y - oy);

// 	left += 0.7;
// 	// top += 0.5;
	
// 	theDiv.style.left = ((left * cos45 - top * sin45) * pointSizeMultiplierX) + unitString;
// 	theDiv.style.top = ((top * cos45 + left * sin45) * pointSizeMultiplierY) + unitString;

// 	theDiv.style.transform = "scale(" + scaleValue + ")";
// };

// Ginseng2.Actuator.prototype.doAnimateBoardPoint = function(boardPoint, moveToAnimate, theImg, theDiv, moveDetails) {
// 	if (!this.animationOn) return;

// 	var startX = boardPoint.col, startY = boardPoint.row, endX = startX, endY = startY;

// 	var movementPath;

// 	var movementStepIndex = 0;

// 	if (moveToAnimate.moveType === MOVE && (boardPoint.tile || moveDetails.movedTile)) {
// 		if (isSamePoint(moveToAnimate.endPoint, endX, endY)) {	// Piece moved
// 			var moveStartPoint = new NotationPoint(moveToAnimate.startPoint);
// 			startX = moveStartPoint.rowAndColumn.col;
// 			startY = moveStartPoint.rowAndColumn.row;
// 			theImg.elementStyleTransform.setValue("scale", 1.2);	// Make the pieces look like they're picked up a little when moving, good idea or no?
// 			theDiv.style.zIndex = 99;	// Make sure "picked up" pieces show up above others

// 			movementPath = moveToAnimate.endPointMovementPath;
// 			if (!movementPath && moveToAnimate.movementPath) {
// 				movementPath = moveToAnimate.movementPath;
// 			}
// 		} else {
// 			// Not the tile moved... is it tile pushed?
// 			if (moveToAnimate.promptTargetData) {
// 				Object.keys(moveToAnimate.promptTargetData).forEach((key, index) => {
// 					var promptDataEntry = moveToAnimate.promptTargetData[key];
// 					var keyObject = JSON.parse(key);
// 					if (promptDataEntry.movedTilePoint && promptDataEntry.movedTileDestinationPoint) {
// 						if (isSamePoint(promptDataEntry.movedTileDestinationPoint.pointText, endX, endY)) {
// 							var moveStartPoint = promptDataEntry.movedTilePoint;
// 							startX = moveStartPoint.rowAndColumn.col;
// 							startY = moveStartPoint.rowAndColumn.row;
// 							setTimeout(() => {
// 								theImg.elementStyleTransform.setValue("scale", 1.2);	// Make the pieces look like they're picked up a little when moving
// 								theDiv.style.zIndex = 99;	// Make sure "picked up" pieces show up above others
// 							}, pieceAnimationLength/1.2);
// 							movementStepIndex = 1;
// 						}
// 					}
// 				});
// 			}
// 		}
// 	}

// 	var pointSizeMultiplierX = 34;
// 	var pointSizeMultiplierY = pointSizeMultiplierX;
// 	var unitString = "px";

// 	/* For small screen size using dynamic vw units */
// 	if (window.innerWidth <= 612) {
// 		pointSizeMultiplierX = 5.5555;
// 		pointSizeMultiplierY = 5.611;
// 		unitString = "vw";
// 	}

// 	var left = (startX - endX);
// 	var top = (startY - endY);
	
// 	/* Begin tile at origin point */
// 	theImg.style.left = (left * pointSizeMultiplierX) + unitString;
// 	theImg.style.top = (top * pointSizeMultiplierY) + unitString;

// 	if (movementPath) {
// 		var numMovements = movementPath.length - 1;
// 		var movementAnimationLength = pieceAnimationLength / numMovements;
// 		var cssLength = movementAnimationLength * (1 + (0.05 * numMovements));	// Higher multiplication factor gives smoother transition
// 		theImg.style.transition = "left " + cssLength + "ms ease-out, right " + cssLength + "ms ease-out, top " + cssLength + "ms ease-out, bottom " + movementAnimationLength + "ms ease-out, transform 0.5s ease-in, opacity 0.5s";
// 		var movementNum = -1;
// 		movementPath.forEach(pathPointStr => {
// 			var currentMovementAnimationTime = movementAnimationLength * movementNum;
// 			setTimeout(function() {
// 				requestAnimationFrame(function() {
// 					var pathPoint = new NotationPoint(pathPointStr);
// 					var pointX = pathPoint.rowAndColumn.col;
// 					var pointY = pathPoint.rowAndColumn.row;
// 					left = (pointX - endX);
// 					top = (pointY - endY);
// 					theImg.style.left = (left * pointSizeMultiplierX) + unitString;
// 					theImg.style.top = (top * pointSizeMultiplierY) + unitString;
// 					debug("time: " + currentMovementAnimationTime + " left: " + left + " top: " + top);
// 				});
// 			}, currentMovementAnimationTime);
// 			movementNum++;
// 		});
// 	} else {
// 		/* Make tile be at it's current point so it animates to that point from start point */
// 		setTimeout(() => {
// 			requestAnimationFrame(function() {
// 				theImg.style.left = "0px";
// 				theImg.style.top = "0px";
// 			});
// 		}, pieceAnimationLength * movementStepIndex);
// 	}

// 	/* Scale back to normal size after animation complete */
// 	setTimeout(function() {
// 		requestAnimationFrame(function() {
// 			theImg.elementStyleTransform.setValue("scale", 1); // This will size back to normal after moving
// 		});
// 	}, pieceAnimationLength * (movementStepIndex + 0.5));
// };

// Ginseng2.Actuator.prototype.getTileSrcPath = function(tile) {
// 	if (Ginseng2.Controller.isUsingCustomTileDesigns()) {
// 		return Ginseng2.Controller.getCustomTileDesignsUrl();
// 	} else {
// 		var srcValue = "images/";
// 		var gameImgDir = "Ginseng/" + localStorage.getItem(Ginseng.Options.tileDesignTypeKey);
// 		srcValue = srcValue + gameImgDir + "/";
// 		return srcValue;
// 	}
// };

// Ginseng2.Actuator.prototype.printBoard = function(board) {

// 	debug("");
// 	var rowNum = 0;
// 	board.cells.forEach(function (row) {
// 		var rowStr = rowNum + "\t: ";
// 		row.forEach(function (boardPoint) {
// 			var str = boardPoint.getConsoleDisplay();
// 			if (str.length < 3) {
// 				rowStr += " ";
// 			}
// 			rowStr = rowStr + str;
// 			if (str.length < 2) {
// 				rowStr = rowStr + " ";
// 			}
			
// 		});
// 		debug(rowStr);
// 		rowNum++;
// 	});
// 	debug("");
// };

