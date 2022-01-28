/* Dom Element Style Transform Helper */
class ElementStyleTransform {

	constructor(parentElement) {
		this.parentElement = parentElement;
		this.transformData = {};
	}

	setValue(name, value, unitsStr) {
		var unitsStrToUse = unitsStr;
		if (!unitsStr) {
			unitsStrToUse = "";
		}
		this.transformData[name] = {
			value: value,
			unitsStr: unitsStrToUse
		};
		this.updateTransform();
	}

	adjustValue(name, adjustmentAmount, unitsStr) {
		var existingValue = this.getValue(name);
		if (existingValue && existingValue.unitsStr === unitsStr) {
			this.setValue(name, existingValue.value + adjustmentAmount, existingValue.unitsStr);
		} else {
			this.setValue(name, adjustmentAmount, unitsStr);
		}
	}

	getValue(name) {
		return this.transformData[name];
	}

	updateTransform() {
		var transformStr = "";

		Object.keys(this.transformData).forEach((key, index) => {
			var transformName = key;
			var transformValue = this.transformData[transformName];

			transformStr += " " + transformName + "(" + transformValue.value + transformValue.unitsStr + ")";
		});

		this.parentElement.style.transform = transformStr;
	}
}
