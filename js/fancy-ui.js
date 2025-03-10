document.addEventListener('DOMContentLoaded', () => {
	// Masked input
	for (const elm of document.querySelectorAll("[placeholder][data-slots]")) {
		const pattern = elm.getAttribute("placeholder");
		const slots = new Set(elm.dataset.slots || "_");
		const prev = (j => Array.from(pattern, (c, i) => slots.has(c) ? j = i + 1 : j))(0);
		const first = [...pattern].findIndex(c => slots.has(c));
		const accept = new RegExp(elm.dataset.accept || "\\d", "g");
		const clean = input => {
			input = input.match(accept) || [];
			return Array.from(pattern, c =>
				input[0] === c || slots.has(c) ? input.shift() || c : c
			);
		};
		const format = () => {
			const [i, j] = [elm.selectionStart, elm.selectionEnd].map(i => {
				i = clean(elm.value.slice(0, i)).findIndex(c => slots.has(c));
				return i < 0 ? prev.at(-1) : keyBackspace ? prev[i - 1] || first : i;
			});
			elm.value = clean(elm.value).join("");
			elm.setSelectionRange(i, j);
			keyBackspace = false;
		};
		let keyBackspace = false;
		elm.addEventListener("keydown", (e) => keyBackspace = e.key === "Backspace");
		elm.addEventListener("input", format);
		elm.addEventListener("focus", format);
		elm.addEventListener("blur", () => {
			if(elm.dataset.validate && elm.value.match(new RegExp(elm.dataset.validate))){
				elm.setCustomValidity("");
			} else if(elm.dataset.validate && !elm.value.match(new RegExp(elm.dataset.validate))){
				elm.setCustomValidity(elm.title || "Invalid input");
			}
			return elm.value === pattern && (elm.value = "");
		});
	}
});