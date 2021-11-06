/* Dom Element Style Transform Helper */
class ElementStyleTransform {

	constructor(parentElement) {
		this.parentElement = parentElement;
		this.transformData = {};
	}

	setValue(name, value) {
		this.transformData[name] = value;
		this.updateTransform();
	}

	updateTransform() {
		var transformStr = "";

		Object.keys(this.transformData).forEach((key, index) => {
			var transformName = key;
			var transformValue = this.transformData[transformName];

			transformStr += " " + transformName + "(" + transformValue + ")";
		});

		this.parentElement.style.transform = transformStr;
	}
}
