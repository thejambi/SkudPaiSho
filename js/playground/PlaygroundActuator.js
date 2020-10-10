// Actuator

function PlaygroundActuator(gameContainer, isMobile) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;

	var containers = setupPaiShoBoard(
		this.gameContainer, 
		PlaygroundController.getHostTilesContainerDivs(),
		PlaygroundController.getGuestTilesContainerDivs(), 
		(gameOptionEnabled(VAGABOND_ROTATE) || gameOptionEnabled(ADEVAR_ROTATE)),
		(gameOptionEnabled(ADEVAR_ROTATE) ? ADEVAR_ROTATE : false),
		gameOptionEnabled(PLAY_IN_SPACES)
	);

	this.boardContainer = containers.boardContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

PlaygroundActuator.hostTeamTilesDivId = "hostTilesContainer";
PlaygroundActuator.guestTeamTilesDivId = "guestTilesContainer";

PlaygroundActuator.prototype.actuate = function(board, tileManager, actuateOptions) {
	var self = this;
	this.actuateOptions = actuateOptions;

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

	if (this.actuateOptions.showTileReserve) {
		// Host Tile Reserve
		var hostTileReserveContainer = document.createElement("span");
		hostTileReserveContainer.classList.add("tileLibrary");
		var hostReserveLabel = document.createElement("span");
		hostReserveLabel.innerText = "--Host Tile Reserve--";
		hostTileReserveContainer.appendChild(hostReserveLabel);
		hostTileReserveContainer.appendChild(document.createElement("br"));
		this.hostTilesContainer.appendChild(hostTileReserveContainer);

		// Guest Tile Reserve
		var guestTileReserveContainer = document.createElement("span");
		guestTileReserveContainer.classList.add("tileLibrary");
		var guestReserveLabel = document.createElement("span");
		guestReserveLabel.innerText = "--Guest Tile Reserve--";
		guestTileReserveContainer.appendChild(guestReserveLabel);
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
			self.addTile(tile, hostTileReserveContainer, PlaygroundNotationContstants.hostReservePile);
		});
		tileManager.guestTileReserve.forEach(function(tile) {
			self.addTile(tile, guestTileReserveContainer, PlaygroundNotationContstants.guestReservePile);
		});
		tileManager.capturedTiles.forEach(function(tile) {
			self.addTile(tile, capturedTileContainer, PlaygroundNotationContstants.capturedPile);
		});
	}

	if (this.actuateOptions.showTileLibrary) {
		tileManager.hostTileLibrary.forEach(function(tile) {
			self.addTile(tile, hostTileLibraryContainer, PlaygroundNotationContstants.hostLibraryPile);
		});
		tileManager.guestTileLibrary.forEach(function(tile) {
			self.addTile(tile, guestTileLibraryContainer, PlaygroundNotationContstants.guestLibraryPile);
		});
	}
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
	} else if (tile.gameType === "Advr") {
		gameImgDir = "Adevar/" + localStorage.getItem(AdevarOptions.tileDesignTypeKey);
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


