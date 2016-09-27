window.fakeStorage = {
	_data: {},

	setItem: function (id, val) {
		return this._data[id] = String(val);
	},

	getItem: function (id) {
		return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
	},

	removeItem: function (id) {
		return delete this._data[id];
	},

	clear: function () {
		return this._data = {};
	}
};

function LocalStorage() {
	this.localEmailKey     = "localUserEmail";

	var supported = this.localStorageSupported();
	this.storage = supported ? window.localStorage : window.fakeStorage;

	debug(this.getUserEmail());
}

LocalStorage.prototype.localStorageSupported = function () {
	var testKey = "testPaiSho";
	var storage = window.localStorage;

	try {
		storage.setItem(testKey, "1");
		storage.removeItem(testKey);
		return true;
	} catch (error) {
		return false;
	}
};

LocalStorage.prototype.getUserEmail = function () {
	return this.storage.getItem(this.localEmailKey);
};

LocalStorage.prototype.setUserEmail = function (email) {
	this.storage.setItem(this.localEmailKey, email);
};
