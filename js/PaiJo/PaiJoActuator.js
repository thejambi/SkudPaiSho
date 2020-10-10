

/* Create boardContainer, hostTilesContainer, and guestTilesContainer */
function PaiJoActuator(gameContainer, isMobile, hostTilesContainerDivs, guestTilesContainerDivs) {
	this.gameContainer =  gameContainer;
	this.isMobile = isMobile;

	removeChildren(gameContainer);

 
	 
 
	var hostTilesContainer = createDivWithClass("hostTilesContainer");
	var guestTilesContainer = createDivWithClass("guestTilesContainer");

	var bcontainer = createDivWithClass("board-container");

 
	var response = createDivWithId("response");
	var gameMessage = createDivWithClass("gameMessage");
	var tilePileContainer = createDivWithClass("tilePileContainer");
	var gameMessage2 = createDivWithClass("gameMessage2");

	var hostTilesContainerDivs = hostTilesContainerDivs;
	var guestTilesContainerDivs = guestTilesContainerDivs;
	hostTilesContainer.innerHTML = hostTilesContainerDivs;
	guestTilesContainer.innerHTML = guestTilesContainerDivs;

	tilePileContainer.appendChild(response);
	tilePileContainer.appendChild(gameMessage);
	tilePileContainer.appendChild(hostTilesContainer);
	tilePileContainer.appendChild(guestTilesContainer);
	tilePileContainer.appendChild(gameMessage2);

	gameContainer.appendChild(bcontainer);
	gameContainer.appendChild(tilePileContainer);

	var containers = {
 		hostTilesContainer: hostTilesContainer,
		guestTilesContainer: guestTilesContainer
	}

	this.boardContainer = "";
	this.hostTilesContainer = containers.hostTilesContainer;
	this.guestTilesContainer = containers.guestTilesContainer;
	
	 

	
}

PaiJoActuator.prototype.actuate = function(board) {
	var self = this;

	window.requestAnimationFrame(function () {

	});
};

 
