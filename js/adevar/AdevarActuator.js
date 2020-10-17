// Actuator

function AdevarActuator(gameContainer, isMobile, enableAnimations) {
	this.gameContainer = gameContainer;
	this.mobile = isMobile;

	this.animationOn = enableAnimations

	var containers = setupPaiShoBoard(
		this.gameContainer, 
		AdevarController.getHostTilesContainerDivs(),
		AdevarController.getGuestTilesContainerDivs(), 
		true, 
		ADEVAR_ROTATE,
		true
	);

	this.boardContainer = containers.boardContainer;
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
}

AdevarActuator.hostTeamTilesDivId = "hostTilesContainer";
AdevarActuator.guestTeamTilesDivId = "guestTilesContainer";

AdevarActuator.prototype.setAnimationOn = function(isOn) {
	this.animationOn = isOn;
};

AdevarActuator.prototype.actuate = function(board, tileManager) {
	var self = this;

	window.requestAnimationFrame(function () {
		self.htmlify(board, tileManager);
	});
};

AdevarActuator.prototype.htmlify = function(board, tileManager) {
	this.clearContainer(this.boardContainer);

	var self = this;

	board.cells.forEach(function(column) {
		column.forEach(function(cell) {
			if (cell) {
				self.addBoardPoint(cell);
			}
		});
	});

	self.clearContainerWithId(AdevarActuator.hostTeamTilesDivId);
	self.clearContainerWithId(AdevarActuator.guestTeamTilesDivId);

	tileManager.hostTiles.forEach(function(tile) {
		self.addTile(tile, this.hostTilesContainer);
	});
	tileManager.guestTiles.forEach(function(tile) {
		self.addTile(tile, this.guestTilesContainer);
	});
};

AdevarActuator.prototype.clearContainer = function (container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

AdevarActuator.prototype.clearContainerWithId = function(containerIdName) {
	var container = document.getElementById(containerIdName);
	if (container) {
		this.clearContainer(container);
	}
};

AdevarActuator.prototype.clearTileContainer = function (tile) {
	var container = document.querySelector("." + tile.getNotationName());
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
};

AdevarActuator.prototype.addTile = function(tile, tileContainer) {
	if (!tile) {
		return;
	}
	var theDiv = document.createElement("div");

	theDiv.classList.add("point");
	theDiv.classList.add("hasTile");

	if (tile.selectedFromPile) {
		theDiv.classList.add("selectedFromPile");
		theDiv.classList.add("drained");
	}

	var theImg = document.createElement("img");
	
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

AdevarActuator.prototype.getTileSrcPath = function(tile) {
	var srcValue = "images/";
	var gameImgDir = "Adevar/" + localStorage.getItem(AdevarOptions.tileDesignTypeKey);
	srcValue = srcValue + gameImgDir + "/";
	return srcValue;
};

AdevarActuator.prototype.addBoardPoint = function(boardPoint) {
	var self = this;

	var theDiv = createBoardPointDiv(boardPoint);
	
	if (!boardPoint.isType(NON_PLAYABLE)) {
		theDiv.classList.add("activePoint");
		theDiv.classList.add("adevarPointRotate");

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

		var srcValue = this.getTileSrcPath(boardPoint.tile);
		theImg.src = srcValue + boardPoint.tile.getImageName() + ".png";
		
		theDiv.appendChild(theImg);
	}

	this.boardContainer.appendChild(theDiv);
};


