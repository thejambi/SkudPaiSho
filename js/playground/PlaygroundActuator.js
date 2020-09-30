// Actuator

function PlaygroundActuator(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;

	var containers = setupPaiShoBoard(
		this.gameContainer, 
		PlaygroundController.getHostTilesContainerDivs(),
		PlaygroundController.getGuestTilesContainerDivs(), 
		(gameOptionEnabled(VAGABOND_ROTATE) || gameOptionEnabled(ADEVAR_ROTATE)),
		(gameOptionEnabled(ADEVAR_ROTATE) ? ADEVAR_ROTATE : false)
	);

	this.boardContainer = containers.boardContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

PlaygroundActuator.hostTeamTilesDivId = "hostTilesContainer";
PlaygroundActuator.guestTeamTilesDivId = "guestTilesContainer";

PlaygroundActuator.prototype.actuate = function(board, tileManager) {
	var self = this;

	window.requestAnimationFrame(function () {
		self.htmlify(board, tileManager);
	});
};

PlaygroundActuator.prototype.htmlify = function(board, tileManager) {
	this.clearContainer(this.boardContainer);

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(cell);
			}
		});
	});

	var fullTileSet = new PlaygroundTileManager(true);

	self.clearContainerWithId(PlaygroundActuator.hostTeamTilesDivId);
	self.clearContainerWithId(PlaygroundActuator.guestTeamTilesDivId);

	// Go through tile piles and display
	tileManager.hostTiles.forEach(function(tile) {
		self.addTile(tile, this.hostTilesContainer);
	});
	tileManager.guestTiles.forEach(function(tile) {
		self.addTile(tile, this.guestTilesContainer);
	});
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

PlaygroundActuator.prototype.addTile = function(tile, tileContainer) {
	var theDiv = document.createElement("div");

	theDiv.classList.add("point");
	theDiv.classList.add("hasTile");

	if (tile.selectedFromPile) {
		theDiv.classList.add("selectedFromPile");
		theDiv.classList.add("drained");
	}

	var theImg = document.createElement("img");
	
	// var srcValue = getSkudTilesSrcPath();
	var srcValue = this.getTileSrcPath(tile);
	theImg.src = srcValue + tile.getImageName() + ".png";
	theDiv.appendChild(theImg);

	theDiv.setAttribute("name", tile.getNotationName());
	theDiv.setAttribute("id", tile.id);

	if (this.mobile) {
		theDiv.setAttribute("onclick", "unplayedTileClicked(this); showTileMessage(this);");
	} else {
		theDiv.setAttribute("onclick", "unplayedTileClicked(this);");
		theDiv.setAttribute("onmouseover", "showTileMessage(this);");
		theDiv.setAttribute("onmouseout", "clearMessage();");
	}

	tileContainer.appendChild(theDiv);
};

PlaygroundActuator.prototype.getTileSrcPath = function(tile) {
	var srcValue = "images/";

	var gameImgDir;
	if (tile.gameType === GameType.SkudPaiSho) {
		gameImgDir = "SkudPaiSho/" + skudTilesKey;
	} else if (tile.gameType === GameType.VagabondPaiSho) {
		gameImgDir = "Vagabond/" + localStorage.getItem(vagabondTileDesignTypeKey);
	} else if (tile.gameType === GameType.CapturePaiSho) {
		gameImgDir = "Capture";
	} else if (tile.gameType === GameType.Playground) {
		gameImgDir = "Playground";
	} else if (tile.gameType === "Adevar") {
		gameImgDir = "Adevar";
	}
	if (gameImgDir) {
		srcValue = srcValue + gameImgDir + "/";
	}

	return srcValue;
};

PlaygroundActuator.prototype.addBoardPoint = function(boardPoint) {
	var self = this;

	var theDiv = createBoardPointDiv(boardPoint);
	
	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add("activePoint");
		if (gameOptionEnabled(VAGABOND_ROTATE)) {
			theDiv.classList.add("vagabondPointRotate");
		} else if (gameOptionEnabled(ADEVAR_ROTATE)) {
			theDiv.classList.add("adevarPointRotate");
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
		}
	}

	if (boardPoint.hasTile()) {
		theDiv.classList.add("hasTile");
		
		var theImg = document.createElement("img");

		var srcValue = this.getTileSrcPath(boardPoint.tile);
		theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";
		
		theDiv.appendChild(theImg);
	}

	this.boardContainer.appendChild(theDiv);

	if (boardPoint.betweenHarmony && boardPoint.col === 16) {
		var theBr = document.createElement("div");
		theBr.classList.add("clear");
		this.boardContainer.appendChild(theBr);
	}
};


