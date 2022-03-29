/* For controlling Ads spaces and appearances in UI */

function Ads() {

}

Ads.Options = {
	showAds: false
};

Ads.AdsList = [
	/* {
		key: "wanted",
		imageUrl: "https://media.discordapp.net/attachments/951554343356731492/951565458350424164/image832.png",
		linkUrl: "https://skudpaisho.com/site/about/contact-skudpaisho/"
	}, */
	{
		key: "wanted_tall",
		imageUrl: "https://media.discordapp.net/attachments/951554343356731492/953949889627320330/image832.png",
		linkUrl: "https://skudpaisho.com/site/about/contact-skudpaisho/",
		shape: "tall"
	},
	{
		key: "free_scroll",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951564698023784528/waterbendingscroll.png",
		linkUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/50113a70-066b-4192-beef-50c1ba1ba9ff/d5y1hnx-8d0aeae8-eee8-4bc0-b26b-fccd15f08398.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzUwMTEzYTcwLTA2NmItNDE5Mi1iZWVmLTUwYzFiYTFiYTlmZlwvZDV5MWhueC04ZDBhZWFlOC1lZWU4LTRiYzAtYjI2Yi1mY2NkMTVmMDgzOTguanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.RFfTZIk6o6UHt17L4GFajHi_DE0jXmSFBTTda46FatY",
		shape: "wide"
	},
	{
		key: "cute_lemurs",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951570753810227210/lemurs.png",
		linkUrl: "https://youtu.be/ncY7oQKBQmk",
		shape: "tall"
	},
	{
		key: "cannoli_classes",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951575242134925332/classes.png",
		linkUrl: "https://www.youtube.com/watch?v=ovlLnRsLoZI",
		shape: "box"
	},
	{
		key: "buy_honor",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951575412633399317/image8042.png",
		linkUrl: "https://www.youtube.com/watch?v=UjUGQNLZtQ8",
		shape: "wide"
	},
	{
		key: "aunt_wu",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951579883933405194/auntwu.png",
		linkUrl: "https://avatar.fandom.com/wiki/Makapu_Village",
		shape: "box"
	},
	{
		key: "free_tiles",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951582332815552572/image8142.png",
		linkUrl: "https://skudpaisho.com/other/printable/TheGardenGate_PrintAndPlay.pdf",
		shape: "wide"
	},
	{
		key: "cactus_juice_artsoblique",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951960135624962059/ArtsoBliqueCactusjuice.png",
		linkUrl: "https://www.etsy.com/listing/728880890/drink-cactus-juice-its-the-quenchiest",
		shape: "box"
	},
	{
		key: "cabbage_insurance_wide",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/952022803371163669/cabbageinsurance-01.png",
		linkUrl: "https://youtu.be/Em3IveMo3T0",
		shape: "wide"
	},
	{
		key: "cabbage_insurance_tall",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/952023741695672350/cabbageinsurance-02.png",
		linkUrl: "https://youtu.be/Em3IveMo3T0",
		shape: "tall"
	},
	{
		key: "skud_this_trick",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/952038964041232424/ThisOneTrick-01.jpg",
		linkUrl: "https://www.youtube.com/watch?v=F9_oBuYWiQo",
		shape: "box"
	},
	{
		key: "field_trips",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/953932426814586890/image8142.png",
		linkUrl: "https://www.redbubble.com/i/sticker/That-s-rough-buddy-by-maddieshields/86656766.EJUG5",
		shape: "box"
	},
	{
		key: "zuko_costumes",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/953946271612289054/image81342.png",
		linkUrl: "https://www.youtube.com/watch?v=SSq31Z1nYq4",
		shape: "tall"
	},
	{
		key: "learn_from_gyatso",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/953954606499655720/image815542.png",
		linkUrl: "https://www.youtube.com/watch?v=nDmi5ZrIVhM",
		shape: "box"
	}
];

Ads.enableAds = function(shouldShowAds) {
	Ads.Options.showAds = shouldShowAds;

	if (shouldShowAds) {
		document.documentElement.addEventListener('mouseleave', () => {
			if (Math.random() > 0.5) {
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
	var topAvContainerDiv = document.getElementById("topAvContainer");
		topAvContainerDiv.classList.add("gone");

		var footerAvContainerDiv = document.getElementById("footerAvContainer");
		footerAvContainerDiv.classList.add("gone");

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

Ads.showAdPopup = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		var linkUrl = adInfo.linkUrl;
		if (!linkUrl) {
			linkUrl = "https://discord.gg/thegardengate";
		}
		showModal(
			"A Message From Our Sponsors",
			"<a href='" + linkUrl + "' target='_blank'><img src='" + adInfo.imageUrl + "' style='max-width: 98%; max-height: 75vh' /></a>"
			+ "<br /><br />Thanks to our sponsors that support The Garden Gate! Be sure to join <a href='https://discord.gg/thegardengate' target='_blank'>The Garden Gate Discord</a> to get more involved in all things Pai Sho. Hide some ads from Device Preferences (My Games list or Side menu).<br /><br />Have a great day ;)"
		);
	}
};

Ads.showRandomPopupAd = function() {
	var popupAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "tall" || adInfo.shape === "box");
	Ads.showAdPopup(peekRandomFromArray(popupAdsList).key);
};

Ads.showTopAd = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		var linkUrl = adInfo.linkUrl;
		if (!linkUrl) {
			linkUrl = "https://discord.gg/thegardengate";
		}
		var topAvContainerDiv = document.getElementById("topAvContainer");
		if (topAvContainerDiv) {
			topAvContainerDiv.innerHTML = "<a href='" + linkUrl + "' target='_blank'><img src='" + adInfo.imageUrl + "' style='max-width: 98%; max-height: 15vh' /></a>";
		}
	}
};

Ads.showRandomTopAd = function() {
	var wideAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "wide");
	Ads.showTopAd(peekRandomFromArray(wideAdsList).key)
};

Ads.showFooterAd = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		var linkUrl = adInfo.linkUrl;
		if (!linkUrl) {
			linkUrl = "https://discord.gg/thegardengate";
		}
		var footerAvContainerDiv = document.getElementById("footerAvContainer");
		if (footerAvContainerDiv) {
			footerAvContainerDiv.innerHTML = "<a href='" + linkUrl + "' target='_blank'><img src='" + adInfo.imageUrl + "' style='max-width: 98%; max-height: 10vh' /></a>";
		}
	}
};

Ads.showRandomFooterAd = function() {
	var wideAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "wide");
	Ads.showFooterAd(peekRandomFromArray(wideAdsList).key)
};

Ads.showSideMenuAd = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		var linkUrl = adInfo.linkUrl;
		if (!linkUrl) {
			linkUrl = "https://discord.gg/thegardengate";
		}
		var footerAvContainerDiv = document.getElementById("sideMenuAvContainer");
		if (footerAvContainerDiv) {
			footerAvContainerDiv.innerHTML = "<a href='" + linkUrl + "' target='_blank'><img src='" + adInfo.imageUrl + "' style='max-width: 98%; max-height: 75vh' /></a>";
		}
	}
};

Ads.showRandomSideMenuAd = function() {
	var tallAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "tall");
	Ads.showSideMenuAd(peekRandomFromArray(tallAdsList).key)
};

Ads.showChatTabAd = function(adKey) {
	var adInfo = Ads.getAdInfo(adKey);

	if (Ads.Options.showAds && adInfo && adInfo.imageUrl) {
		var linkUrl = adInfo.linkUrl;
		if (!linkUrl) {
			linkUrl = "https://discord.gg/thegardengate";
		}
		var chatTabAvContainerDivList = document.getElementsByClassName("chatTabAvContainer");
		if (chatTabAvContainerDivList && chatTabAvContainerDivList.length) {
			for (var i = 0; i < chatTabAvContainerDivList.length; i++) {
				var chatTabAvContainerDiv = chatTabAvContainerDivList.item(i);
				chatTabAvContainerDiv.innerHTML = "<a href='" + linkUrl + "' target='_blank'><img src='" + adInfo.imageUrl + "' style='max-width: 98%; max-height: 50vh' /></a>";
			}
		}
	}
};

Ads.showRandomChatTabAd = function() {
	var boxAdsList = Ads.AdsList.filter(adInfo => adInfo.shape === "box");
	Ads.showChatTabAd(peekRandomFromArray(boxAdsList).key)
};

Ads.showSponsorMessagesTeaserPopup = function() {
	showModal(
		"Sponsored Messages",
		"Would you like to support The Garden Gate and sponsor a message that could show here? <br /><br />Contact @SkudPaiSho on <a href='https://discord.gg/thegardengate' target='_blank'>The Garden Gate Discord</a> and consider supporting The Garden Gate on <a href='https://www.patreon.com/SkudPaiSho' target='_blank'>Patreon</a>."
	);
};

Ads.viewSponsoredMessageClicked = function() {
	if (Ads.Options.showAds) {
		Ads.showRandomPopupAd();
	} else {
		Ads.showSponsorMessagesTeaserPopup();
	}
};


