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
		linkUrl: "https://skudpaisho.com/site/about/contact-skudpaisho/"
	},
	{
		key: "free_scroll",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951564698023784528/waterbendingscroll.png",
		linkUrl: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/50113a70-066b-4192-beef-50c1ba1ba9ff/d5y1hnx-8d0aeae8-eee8-4bc0-b26b-fccd15f08398.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzUwMTEzYTcwLTA2NmItNDE5Mi1iZWVmLTUwYzFiYTFiYTlmZlwvZDV5MWhueC04ZDBhZWFlOC1lZWU4LTRiYzAtYjI2Yi1mY2NkMTVmMDgzOTguanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.RFfTZIk6o6UHt17L4GFajHi_DE0jXmSFBTTda46FatY"
	},
	{
		key: "cute_lemurs",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951570753810227210/lemurs.png",
		linkUrl: "https://youtu.be/ncY7oQKBQmk"
	},
	{
		key: "cannoli_classes",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951575242134925332/classes.png",
		linkUrl: null
	},
	{
		key: "buy_honor",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951575412633399317/image8042.png",
		linkUrl: null
	},
	{
		key: "aunt_wu",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951579883933405194/auntwu.png",
		linkUrl: "https://avatar.fandom.com/wiki/Makapu_Village"
	},
	{
		key: "free_tiles",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951582332815552572/image8142.png",
		linkUrl: null
	},
	{
		key: "cactus_juice_artsoblique",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/951960135624962059/ArtsoBliqueCactusjuice.png",
		linkUrl: null
	},
	{
		key: "cabbage_insurance_wide",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/952022803371163669/cabbageinsurance-01.png",
		linkUrl: null
	},
	{
		key: "cabbage_insurance_tall",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/952023741695672350/cabbageinsurance-02.png",
		linkUrl: null
	},
	{
		key: "skud_this_trick",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/952038964041232424/ThisOneTrick-01.jpg",
		linkUrl: null
	},
	{
		key: "field_trips",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/953932426814586890/image8142.png",
		linkUrl: null
	},
	{
		key: "zuko_costumes",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/953946271612289054/image81342.png",
		linkUrl: null
	},
	{
		key: "learn_from_gyatso",
		imageUrl: "https://cdn.discordapp.com/attachments/951554343356731492/953954606499655720/image815542.png",
		linkUrl: null
	},
	{
		key: "",
		imageUrl: "",
		linkUrl: null
	},
];

Ads.enableAds = function(shouldShowAds) {
	Ads.Options.showAds = shouldShowAds;

	if (shouldShowAds) {
		document.documentElement.addEventListener('mouseleave', () => {
			if (Math.random() > 0.5) {
				Ads.showRandomPopupAd();
			}
		});
	}
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
		);
	}
};

Ads.showRandomPopupAd = function() {
	Ads.showAdPopup(peekRandomFromArray(Ads.AdsList).key);
};

