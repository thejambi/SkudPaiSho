/* For controlling Ads spaces and appearances in UI */

import { peekRandomFromArray } from "./GameData";
import { closeModal, showModalElem } from "./ModalManager";

export function Ads() {

}

Ads.Options = {
	showAds: false,
	minimalAds: false
};

Ads.AdsList = [
	/* {
		key: "wanted",
		imageUrl: "https://media.discordapp.net/attachments/951554343356731492/951565458350424164/image832.png",
		linkUrl: "https://skudpaisho.com/site/about/contact-skudpaisho/"
	}, */
	// {
	// 	key: "wanted_tall",
	// 	imageUrl: "https://skudpaisho.com/images/aprilfools/image832.png",
	// 	linkUrl: "https://skudpaisho.com/site/about/contact-skudpaisho/",
	// 	shape: "tall"
	// },
	{
		key: "free_scroll",
		imageUrl: "https://skudpaisho.com/images/aprilfools/waterbendingscroll.png",
		linkUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/50113a70-066b-4192-beef-50c1ba1ba9ff/d5y1hnx-8d0aeae8-eee8-4bc0-b26b-fccd15f08398.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzUwMTEzYTcwLTA2NmItNDE5Mi1iZWVmLTUwYzFiYTFiYTlmZlwvZDV5MWhueC04ZDBhZWFlOC1lZWU4LTRiYzAtYjI2Yi1mY2NkMTVmMDgzOTguanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.RFfTZIk6o6UHt17L4GFajHi_DE0jXmSFBTTda46FatY",
		shape: "wide"
	},
	{
		key: "cute_lemurs",
		imageUrl: "https://skudpaisho.com/images/aprilfools/lemurs.png",
		linkUrl: "https://youtu.be/ncY7oQKBQmk",
		shape: "tall"
	},
	{
		key: "cannoli_classes",
		imageUrl: "https://skudpaisho.com/images/aprilfools/classes.png",
		linkUrl: "https://www.youtube.com/watch?v=ovlLnRsLoZI",
		shape: "box"
	},
	{
		key: "buy_honor",
		imageUrl: "https://skudpaisho.com/images/aprilfools/BuyHonor.png",
		linkUrl: "https://www.youtube.com/watch?v=UjUGQNLZtQ8",
		shape: "wide"
	},
	{
		key: "aunt_wu",
		imageUrl: "https://skudpaisho.com/images/aprilfools/auntwu.png",
		linkUrl: "https://avatar.fandom.com/wiki/Makapu_Village",
		shape: "box"
	},
	{
		key: "free_tiles",
		imageUrl: "https://skudpaisho.com/images/aprilfools/FreeTiles.png",
		linkUrl: "https://skudpaisho.com/other/printable/TheGardenGate_PrintAndPlay.pdf",
		shape: "wide"
	},
	{
		key: "cactus_juice_artsoblique",
		imageUrl: "https://skudpaisho.com/images/aprilfools/ArtsoBliqueCactusjuice.png",
		linkUrl: "https://www.etsy.com/listing/728880890/drink-cactus-juice-its-the-quenchiest",
		shape: "box"
	},
	{
		key: "cabbage_insurance_wide",
		imageUrl: "https://skudpaisho.com/images/aprilfools/cabbageinsurance-01.png",
		linkUrl: "https://youtu.be/Em3IveMo3T0",
		shape: "wide"
	},
	{
		key: "cabbage_insurance_tall",
		imageUrl: "https://skudpaisho.com/images/aprilfools/cabbageinsurance-02.png",
		linkUrl: "https://youtu.be/Em3IveMo3T0",
		shape: "tall"
	},
	{
		key: "skud_this_trick",
		imageUrl: "https://skudpaisho.com/images/aprilfools/ThisOneTrick-01.jpg",
		linkUrl: "https://www.youtube.com/watch?v=F9_oBuYWiQo",
		shape: "box"
	},
	{
		key: "field_trips",
		imageUrl: "https://skudpaisho.com/images/aprilfools/FieldTrips.png",
		linkUrl: "https://www.redbubble.com/i/sticker/That-s-rough-buddy-by-maddieshields/86656766.EJUG5",
		shape: "box"
	},
	{
		key: "zuko_costumes",
		imageUrl: "https://skudpaisho.com/images/aprilfools/ZukoCostumes.png",
		linkUrl: "https://www.youtube.com/watch?v=SSq31Z1nYq4",
		shape: "tall"
	},
	{
		key: "learn_from_gyatso",
		imageUrl: "https://skudpaisho.com/images/aprilfools/LearnFromGyatso.png",
		linkUrl: "https://www.youtube.com/watch?v=zKUEECnDHjc&t=150s",
		shape: "box"
	}
];

Ads.enableAds = function(shouldShowAds) {
	Ads.Options.showAds = shouldShowAds;

	if (shouldShowAds) {
		document.documentElement.addEventListener('mouseleave', () => {
			if (Math.random() > 0.7 && !Ads.Options.minimalAds) {
				Ads.showRandomPopupAd();
			}
		});

		var topAvContainerDiv = document.getElementById("topAvContainer");
		if (topAvContainerDiv) {
			topAvContainerDiv.classList.remove("gone");
			Ads.showRandomTopAd();
			setInterval(() => Ads.showRandomTopAd(), 30000);
		}

		var footerAvContainerDiv = document.getElementById("footerAvContainer");
		if (footerAvContainerDiv) {
			footerAvContainerDiv.classList.remove("gone");
			Ads.showRandomFooterAd();
			setInterval(() => Ads.showRandomFooterAd(), 25000);
		}

		var sideMenuAvContainerDiv = document.getElementById("sideMenuAvContainer");
		if (sideMenuAvContainerDiv) {
			sideMenuAvContainerDiv.classList.remove("gone");
			Ads.showRandomSideMenuAd();
			setInterval(() => Ads.showRandomSideMenuAd(), 35000);
		}

		var chatTabAvContainerDivList = document.getElementsByClassName("chatTabAvContainer");
		if (chatTabAvContainerDivList && chatTabAvContainerDivList.length) {
			for (var i = 0; i < chatTabAvContainerDivList.length; i++) {
				var chatTabAvContainerDiv = chatTabAvContainerDivList.item(i);
				chatTabAvContainerDiv.classList.remove("gone");
			}
			Ads.showRandomChatTabAd();
			setInterval(() => Ads.showRandomChatTabAd(), 20000);
		}
	}
};

Ads.minimalAdsEnabled = function() {
	Ads.Options.minimalAds = true;

	var topAvContainerDiv = document.getElementById("topAvContainer");
	topAvContainerDiv.classList.add("gone");
	topAvContainerDiv.classList.add("gone");

	var footerAvContainerDiv = document.getElementById("footerAvContainer");
	footerAvContainerDiv.classList.add("gone");
	var footerAvContainerDiv = document.getElementById("footerAvContainer");
	footerAvContainerDiv.classList.add("gone");

	var sideMenuAvContainerDiv = document.getElementById("sideMenuAvContainer");
	sideMenuAvContainerDiv.classList.add("gone");
	var sideMenuAvContainerDiv = document.getElementById("sideMenuAvContainer");
	sideMenuAvContainerDiv.classList.add("gone");
};

Ads.getAdInfo = function(adKey) {
	var adInfo;
	Ads.AdsList.forEach(adEntry => {
		if (adEntry.key === adKey) {
			adInfo = adEntry;
			return adInfo;
		}
	});
	return adInfo;
};

Ads.getAdDiv = function(adInfo, maxWidthNum, maxHeightNum) {
	var linkUrl = adInfo.linkUrl;
	if (!linkUrl) {
		linkUrl = "https://skudpaisho.com/discord";
	}
	var txt = ""
		+ "<a href='" + linkUrl + "' target='_blank'>"
		+ "<div style='display:inline-block;position:relative;'>"
		+ "<img src='" + adInfo.imageUrl + "' style='max-width: " + maxWidthNum + "%; max-height: " + maxHeightNum + "vh' />"
		+ "<input type='button' value='[X]' style='position:absolute;right:0;top:0;opacity:0.5' />"
		+ "</div></a>";
	return txt;
};

Ads.getAdDivElement = function(adInfo, maxWidthNum, maxHeightNum) {
	var linkUrl = adInfo.linkUrl;
	if (!linkUrl) {
		linkUrl = "https://skudpaisho.com/discord";
	}
	const link = document.createElement('a');
	link.href = linkUrl;
	link.target = '_blank';

	const wrapper = document.createElement('div');
	wrapper.style.display = 'inline-block';
	wrapper.style.position = 'relative';

	const img = document.createElement('img');
	img.src = adInfo.imageUrl;
	img.style.maxWidth = maxWidthNum + '%';
	img.style.maxHeight = maxHeightNum + 'vh';
	wrapper.appendChild(img);

	const closeBtn = document.createElement('input');
	closeBtn.type = 'button';
	closeBtn.value = '[X]';
	closeBtn.style.position = 'absolute';
	closeBtn.style.right = '0';
	closeBtn.style.top = '0';
	closeBtn.style.opacity = '0.5';
	wrapper.appendChild(closeBtn);

	link.appendChild(wrapper);
	return link;
};

Ads.showAdPopup = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		const container = document.createElement('div');
		container.appendChild(Ads.getAdDivElement(adInfo, 98, 75));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode('Thanks to our sponsors that support The Garden Gate! Be sure to join '));
		const discordLink = document.createElement('a');
		discordLink.href = 'https://skudpaisho.com/discord';
		discordLink.target = '_blank';
		discordLink.textContent = 'The Garden Gate Discord';
		container.appendChild(discordLink);
		container.appendChild(document.createTextNode(' to get more involved in all things Pai Sho. '));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode('Click '));
		const hideAdsSpan = document.createElement('span');
		hideAdsSpan.classList.add('clickableText');
		hideAdsSpan.textContent = 'here to hide some of the ads';
		hideAdsSpan.onclick = () => { Ads.minimalAdsEnabled(); closeModal(); };
		container.appendChild(hideAdsSpan);
		container.appendChild(document.createTextNode('.'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createElement('br'));
		container.appendChild(document.createTextNode('Have a great day ;)'));

		showModalElem("A Message From Our Sponsors", container);
	}
};

Ads.showRandomPopupAd = function() {
	var popupAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "tall" || adInfo.shape === "box");
	Ads.showAdPopup(peekRandomFromArray(popupAdsList).key);
};

Ads.showTopAd = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		var topAvContainerDiv = document.getElementById("topAvContainer");
		if (topAvContainerDiv) {
			topAvContainerDiv.innerHTML = Ads.getAdDiv(adInfo, 98, 15);//"<a href='" + linkUrl + "' target='_blank'><img src='" + adInfo.imageUrl + "' style='max-width: 98%; max-height: 15vh' /></a>";
		}
	}
};

Ads.showRandomTopAd = function() {
	var wideAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "wide");
	Ads.showTopAd(peekRandomFromArray(wideAdsList).key);
};

Ads.showFooterAd = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		var footerAvContainerDiv = document.getElementById("footerAvContainer");
		if (footerAvContainerDiv) {
			footerAvContainerDiv.innerHTML = Ads.getAdDiv(adInfo, 98, 10);//"<a href='" + linkUrl + "' target='_blank'><img src='" + adInfo.imageUrl + "' style='max-width: 98%; max-height: 10vh' /></a>";
		}
	}
};

Ads.showRandomFooterAd = function() {
	var wideAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "wide");
	Ads.showFooterAd(peekRandomFromArray(wideAdsList).key);
};

Ads.showSideMenuAd = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		var footerAvContainerDiv = document.getElementById("sideMenuAvContainer");
		if (footerAvContainerDiv) {
			footerAvContainerDiv.innerHTML = Ads.getAdDiv(adInfo, 98, 75);//"<a href='" + linkUrl + "' target='_blank'><img src='" + adInfo.imageUrl + "' style='max-width: 98%; max-height: 75vh' /></a>";
		}
	}
};

Ads.showRandomSideMenuAd = function() {
	var tallAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "tall");
	Ads.showSideMenuAd(peekRandomFromArray(tallAdsList).key);
};

Ads.showChatTabAd = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		var chatTabAvContainerDivList = document.getElementsByClassName("chatTabAvContainer");
		if (chatTabAvContainerDivList && chatTabAvContainerDivList.length) {
			for (var i = 0; i < chatTabAvContainerDivList.length; i++) {
				var chatTabAvContainerDiv = chatTabAvContainerDivList.item(i);
				chatTabAvContainerDiv.innerHTML = Ads.getAdDiv(adInfo, 98, 50);//"<a href='" + linkUrl + "' target='_blank'><img src='" + adInfo.imageUrl + "' style='max-width: 98%; max-height: 50vh' /></a>";
			}
		}
	}
};

Ads.showRandomChatTabAd = function() {
	var boxAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "box");
	Ads.showChatTabAd(peekRandomFromArray(boxAdsList).key);
};

Ads.showSponsorMessagesTeaserPopup = function() {
	const container = document.createElement('div');
	container.appendChild(document.createTextNode('Would you like to support The Garden Gate and sponsor a message that could show here? '));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createElement('br'));
	container.appendChild(document.createTextNode('Contact @SkudPaiSho on '));
	const discordLink = document.createElement('a');
	discordLink.href = 'https://skudpaisho.com/discord';
	discordLink.target = '_blank';
	discordLink.textContent = 'The Garden Gate Discord';
	container.appendChild(discordLink);
	container.appendChild(document.createTextNode(' and consider supporting The Garden Gate on '));
	const coffeeLink = document.createElement('a');
	coffeeLink.href = 'https://buymeacoffee.com/skudpaisho';
	coffeeLink.target = '_blank';
	coffeeLink.textContent = 'Buy Me A Coffee';
	container.appendChild(coffeeLink);
	container.appendChild(document.createTextNode('.'));

	showModalElem("Sponsored Messages", container);
};

Ads.viewSponsoredMessageClicked = function() {
	if (Ads.Options.showAds) {
		Ads.showRandomPopupAd();
	} else {
		Ads.showSponsorMessagesTeaserPopup();
	}
};


