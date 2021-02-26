/* Used in Vagabond Board Rotate: */
var sin45 = cos45 = Math.sin(Math.PI / 4);

/* Used in Adevar Board Rotate */
var sin135 = Math.sin(3 * Math.PI / 4);
var cos135 = Math.cos(3 * Math.PI / 4);

function createDivWithClass(className) {
	var div = document.createElement("div");
	div.classList.add(className);
	return div;
}

function createDivWithId(idName) {
	var div = document.createElement("div");
	div.id = idName;
	return div;
}

window.mobilecheck = function () {
	var check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

window.mobileAndTabletcheck = function () {
	var check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

function removeChildren(myNode) {
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
}

function createBoardPointDiv(boardPoint) {
	var theDiv = document.createElement("div");

	theDiv.classList.add("point");

	var notationPointString = new RowAndColumn(boardPoint.row, boardPoint.col).notationPointString;

	theDiv.setAttribute("name", notationPointString);
	theDiv.setAttribute("title", "(" + notationPointString + ")");

	return theDiv;
}

function setupPaiShoBoard(gameContainer,
	hostTilesContainerDivs,
	guestTilesContainerDivs,
	rotateBoard,
	rotateType,
	playInSpaces) {

	var addVagabondBoardRotate = false;
	var addAdevarBoardRotate = false;
	var addAdevarGuestBoardRotate = false;
	// Check for existing vagabond class on board...
	if (document.querySelector(".vagabondBoardRotate")) {
		addVagabondBoardRotate = true;
	} else if (document.querySelector(".adevarBoardRotate")) {
		addAdevarBoardRotate = true;
	} else if (document.querySelector(".adevarGuestBoardRotate")) {
		addAdevarGuestBoardRotate = true;
	}

	removeChildren(gameContainer);

	var ptContainerClass = "pointContainer";
	if (playInSpaces) {
		ptContainerClass = "pointContainerForPlayInSpaces"
	}
	var boardContainer = createDivWithClass(ptContainerClass);

	var bcontainer = createDivWithClass("board-container");
	var svgContainer = createDivWithClass("svgContainer");
	var svgContainerContainer = createDivWithClass("svgContainerContainer");
	var bgSvg = createDivWithClass("bg-svg");

	applyBoardOptionToBgSvg(bgSvg);

	if (addVagabondBoardRotate) {
		svgContainer.classList.add("vagabondBoardRotate");
	} else if (addAdevarBoardRotate) {
		svgContainer.classList.add("adevarBoardRotate");
	} else if (addAdevarGuestBoardRotate) {
		svgContainer.classList.add("adevarGuestBoardRotate");
	}

	bgSvg.appendChild(boardContainer);
	svgContainer.appendChild(bgSvg);
	svgContainerContainer.appendChild(svgContainer);
	bcontainer.appendChild(svgContainerContainer);

	var response = createDivWithId("response");
	var gameMessage = createDivWithClass("gameMessage");
	var hostTilesContainer = createDivWithClass("hostTilesContainer");
	hostTilesContainer.id = "hostTilesContainer";
	var guestTilesContainer = createDivWithClass("guestTilesContainer");
	guestTilesContainer.id = "guestTilesContainer";
	var tilePileContainer = createDivWithClass("tilePileContainer");
	tilePileContainer.classList.add("PaiSho");
	var gameMessage2 = createDivWithClass("gameMessage2");

	hostTilesContainer.innerHTML = hostTilesContainerDivs;
	guestTilesContainer.innerHTML = guestTilesContainerDivs;

	tilePileContainer.appendChild(response);
	tilePileContainer.appendChild(gameMessage);
	tilePileContainer.appendChild(hostTilesContainer);
	tilePileContainer.appendChild(guestTilesContainer);
	tilePileContainer.appendChild(gameMessage2);

	gameContainer.appendChild(bcontainer);
	gameContainer.appendChild(tilePileContainer);

	var addClassAfterThisManyMs = 100;
	if (rotateBoard) {
		var rotateClass = "vagabondBoardRotate";
		if (rotateType === ADEVAR_ROTATE) {
			rotateClass = "adevarBoardRotate";
		} else if (rotateType === ADEVAR_GUEST_ROTATE) {
			rotateClass = "adevarGuestBoardRotate";
		}
		// Set Timeout to get animated board rotation
		setTimeout(function () {
			svgContainer.classList.remove("vagabondBoardRotate");
			svgContainer.classList.remove("adevarBoardRotate");
			svgContainer.classList.remove("adevarGuestBoardRotate");
			svgContainer.classList.add(rotateClass);
		}, addClassAfterThisManyMs);
	} else {
		// Set Timeout to get animated board rotation
		setTimeout(function () {
			svgContainer.classList.remove("vagabondBoardRotate");
			svgContainer.classList.remove("adevarBoardRotate");
			svgContainer.classList.remove("adevarGuestBoardRotate");
		}, addClassAfterThisManyMs);
	}

	return {
		boardContainer: boardContainer,
		hostTilesContainer: hostTilesContainer,
		guestTilesContainer: guestTilesContainer
	}
}

function applyBoardOptionToBgSvg(bgSvgIfKnown) {
	var bgSvg = bgSvgIfKnown;
	if (!bgSvg) {
		var bgsvgs = document.getElementsByClassName("bg-svg");
		if (bgsvgs && bgsvgs.length >= 1) {
			bgSvg = bgsvgs[0];
		}
	}

	if (bgSvg) {
		var extension = ".png";
		if (svgBoardDesigns.includes(paiShoBoardKey)) {
			extension = ".svg";
		}

		var boardUrl = "style/board_" + paiShoBoardKey + extension;

		if (paiShoBoardKey.includes("customBoard")) {
			var customBoardArray = JSON.parse(localStorage.getItem(customBoardUrlArrayKey));
			if (customBoardArray && customBoardArray.length) {
				for (var i = 0; i < customBoardArray.length; i++) {
					if (customBoardArray[i].name.replace(/ /g,'_') === paiShoBoardKey.substring(11)) {
						boardUrl = customBoardArray[i].url;
					}
				}
			}
		}

		var customBoardUrl = localStorage.getItem(customBoardUrlKey);
		if (paiShoBoardKey === 'applycustomboard' && customBoardUrl) {
			boardUrl = customBoardUrl;
		}

		bgSvg.style.backgroundImage = "url('" + boardUrl + "')";
	}
}

function getSkudTilesSrcPath() {
	var srcValue = "images/SkudPaiSho/" + skudTilesKey + "/";
	return srcValue;
}

function isSamePoint(movePoint, x, y) {
	return movePoint.rowAndColumn.col === x && movePoint.rowAndColumn.row === y;
}
