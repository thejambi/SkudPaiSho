// Text formatting helpers and point message generators.
// Pure functions with zero dependencies on game state.

export function toHeading(str) {
	const h4 = document.createElement('h4');
	if (str instanceof HTMLElement) {
		h4.appendChild(str);
	} else {
		h4.textContent = str;
	}
	return h4;
}

export function toMessage(paragraphs) {
	const container = document.createElement('span');

	if (paragraphs.length === 1) {
		const item = paragraphs[0];
		if (item instanceof HTMLElement) {
			container.appendChild(item);
		} else {
			container.innerHTML = item;
		}
	} else if (paragraphs.length > 1) {
		paragraphs.forEach((item) => {
			const p = document.createElement('p');
			if (item instanceof HTMLElement) {
				p.appendChild(item);
			} else {
				p.innerHTML = item;
			}
			container.appendChild(p);
		});
	}

	return container;
}

export function toBullets(paragraphs) {
	const ul = document.createElement('ul');

	paragraphs.forEach((item) => {
		const li = document.createElement('li');
		if (item instanceof HTMLElement) {
			li.appendChild(item);
		} else {
			li.innerHTML = item;
		}
		ul.appendChild(li);
	});

	return ul;
}

export function getNeutralPointMessage() {
	let msg = "<h4>Neutral Point</h4>";
	msg += "<ul>";
	msg += "<li>This point is Neutral, so any tile can land here.</li>";
	msg += "<li>If a tile that is on a point touches a Neutral area of the board, that point is considered Neutral.</li>";
	msg += "</ul>";
	return msg;
}

export function getRedPointMessage() {
	let msg = "<h4>Red Point</h4>";
	msg += "<p>This point is Red, so Basic White Flower Tiles are not allowed to land here.</p>";
	return msg;
}

export function getWhitePointMessage() {
	let msg = "<h4>White Point</h4>";
	msg += "<p>This point is White, so Basic Red Flower Tiles are not allowed to land here.</p>";
	return msg;
}

export function getRedWhitePointMessage() {
	let msg = "<h4>Red/White Point</h4>";
	msg += "<p>This point is both Red and White, so any tile is allowed to land here.</p>";
	return msg;
}

export function getGatePointMessage() {
	let msg = "<h4>Gate</h4>";
	msg += '<p>This point is a Gate. When Flower Tiles are played, they are <em>Planted</em> in an open Gate.</p>';
	msg += '<p>Tiles in a Gate are considered <em>Growing</em>, and when they have moved out of the Gate, they are considered <em>Blooming</em>.</p>';
	return msg;
}

export function htmlDecode(input) {
	const e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export function htmlEscape(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
