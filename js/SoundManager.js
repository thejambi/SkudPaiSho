/**
 * Sound Manager
 */
function SoundManager() {
	this.isUnlocked = false;

	this.webAudioError = false;

	this.storageManager = new LocalSoundStorageManager();
	
	this.audioArray = new Array();
    for (var i = 0; i <= 12; i++) {
        this.audioArray[i] = document.createElement("audio");
    }
    this.lastIndex = 0;
	
	if (typeof webkitAudioContext !== 'undefined') {
		this.context = new webkitAudioContext();
	} else if (typeof AudioContext !== 'undefined') {
		this.context = new AudioContext();
	}
	
	if (this.context) {
		this.regNode = this.context.createGain();
		this.regNode.connect(this.context.destination);
		this.regNode.gain.value = 0.4;
	
		this.strNode = this.context.createGain();
		this.strNode.connect(this.context.destination);
		this.strNode.gain.value = 1.0;
	}
	
	this.soundPath = "https://skudpaisho.com/sounds/";
}

SoundManager.sounds = {
	tileLand: ["tileLand2", "tileLand3", "tileLand4", "tileLand5"]
};

SoundManager.prototype.playFileData = function (fileData) {
	if (this.context && !this.webAudioError) {
		this.playFileDataWebAudio(fileData);
	} else {
		this.playFileDataHtml5(fileData);
	}
}

SoundManager.prototype.playSound = function (soundType) {
	if (this.storageManager.getSoundOff()) {
		return;
	}
	// --- //

	var fileValue = soundType;
	if (Array.isArray(soundType)) {
		fileValue = peekRandomFromArray(soundType);
	}

	var fileData = this.storageManager.getSoundFile(fileValue);
	
	if (fileData) {
		this.playFileData(fileData);
	} else {
		var self = this;
		var srcFile = this.soundPath + fileValue + ".txt";
		var xmlhttp = new XMLHttpRequest();
		
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				//console.log("Fetched for " + fileValue);
				fileData = xmlhttp.responseText;
				self.playFileData(fileData);
				self.storageManager.setSoundFile(fileValue, fileData);
			}
		}
		xmlhttp.open("GET",srcFile,true);
		xmlhttp.send();
	}
}

SoundManager.prototype.playFileDataWebAudio = function (fileData) {
	try {
		var self = this;
		var byteArray = Base64Binary.decodeArrayBuffer(fileData);
		this.context.decodeAudioData(byteArray, function(buffer) {
			var source = self.context.createBufferSource();
			source.buffer = buffer;
			//source.connect(self.context.destination);

			source.connect(self.regNode);
			source.start(0);
		}, function(err) { alert("err(decodeAudioData): " + err); });
	} catch(err) {
		this.webAudioError = true;
	}
};

SoundManager.prototype.playFileDataHtml5 = function (fileData) {
	this.lastIndex = (this.lastIndex + 1) % 12;

	this.audioArray[this.lastIndex].setAttribute("src", "data:audio/mpeg;base64," + fileData);
	this.audioArray[this.lastIndex].volume = 0.7;
	this.audioArray[this.lastIndex].play();
};

SoundManager.prototype.makeNoNoise = function () {
	if (this.unlocked || !this.context) {
		return;
	}

	var buffer = this.context.createBuffer(1, 1, 22050);
	var source = this.context.createBufferSource();
	source.buffer = buffer;
	source.connect(this.context.destination);
	source.start(0);

	var self = this;
	// by checking the play state after some time, we know if we're really unlocked
	setTimeout(function() {
		if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
			self.isUnlocked = true;
		}
	}, 0);
};

SoundManager.prototype.isMoveSoundsEnabled = function() {
	return !this.storageManager.getSoundOff();
};

SoundManager.prototype.nextMoveSoundsAreEnabled = function() {
	return !this.storageManager.getSoundOff();
};

SoundManager.prototype.prevMoveSoundsAreEnabled = function() {
	return !this.storageManager.getSoundOff();
};

SoundManager.prototype.rerunAllSoundsAreEnabled = function() {
	return !this.storageManager.getSoundOff();
};

SoundManager.prototype.toggleSoundOn = function() {
	if (this.storageManager.getSoundOff()) {
		this.storageManager.setSoundOn();
	} else {
		this.storageManager.setSoundOff();
	}
};
