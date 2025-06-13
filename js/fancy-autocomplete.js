if (typeof window.fancyAutocomplete === 'undefined') {
window.fancyAutocomplete = class {
	constructor(selector, options) {
		this.options = Object.assign({
			deduplicate: true,
			words: [],
		}, options)
		this.nodes = [];
		const instance = this;
		if (typeof selector === 'string') {
			this.nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
		} else if (typeof selector === 'object' && selector.length === undefined) {
			this.nodes.push(selector);
		} else if (typeof selector === 'object' && selector.length > 0) {
			this.nodes = Array.prototype.slice.call(selector);
		}
		for (const input of this.nodes) {
			const list = document.createElement("UL");
			list.className = "fancy-autocomplete-list";
			input.parentNode.insertBefore(list, input.nextSibling);

			let words = this.options.words.concat(input.dataset.autocomplete.split(","));
			if (this.options.deduplicate) {
			  words = [...new Set(words.map(word => word.trim()))];
			}
			let activeIndex = -1;

			const getLastWord = (value) => {
				const parts = value.split(/[\s,]+/);
				return parts[parts.length - 1];
			}

			const getBaseText = (value) => {
				const match = value.match(/^(.*?)([\s,]*)[^,\s]*$/);
				return match ? match[1] + (match[2] || "") : "";
			}

			const updateSuggestions = () => {
				const value = input.value;
				const currentWord = getLastWord(value).toLowerCase();
				list.innerHTML = "";
				activeIndex = -1;

				if (!currentWord) {
					list.style.display = "none";
					return;
				}

				const enteredWords = input.value
					.split(/[\s,]+/)
					.map(word => word.trim())
					.filter(word => word.length > 0);

				const matches = words
					.map(word => word.trim())
					.filter(word => {
						const lcWord = word.toLowerCase();
						if (this.options.deduplicate) {
							const isDuplicate = enteredWords.some(
								entered => entered.toLowerCase() === lcWord
							);
							if (isDuplicate) return false;
						}
						return lcWord.startsWith(currentWord);
					})
					.sort();
				  
				if (matches.length === 0) {
					list.style.display = "none";
					return;
				}

				const baseText = getBaseText(value);

				matches.forEach((match, index) => {
					const li = document.createElement("li");
					li.textContent = match;
					li.setAttribute("data-index", index);

					li.addEventListener("click", () => {
						input.value = baseText + match + " ";
						list.style.display = "none";
						input.focus();
					});

					list.appendChild(li);
				});

				const rect = input.getBoundingClientRect();
				list.style.width = rect.width + "px";
				list.style.display = "block";
				list.style.left = rect.left + window.scrollX + "px";
				if (rect.bottom + list.offsetHeight < window.innerHeight) { // Fits below
					list.style.top = rect.bottom + window.scrollY + "px";
				} else {
					list.style.top = rect.top + window.scrollY - list.offsetHeight + "px";
				}
			}

			const moveActive = (direction) => {
				const items = list.querySelectorAll("li");
				if (items.length === 0) return;

				activeIndex += direction;

				if (activeIndex < 0) activeIndex = items.length - 1;
				if (activeIndex >= items.length) activeIndex = 0;

				items.forEach((item, index) => {
					item.classList.toggle("active", index === activeIndex);
				});

				const activeItem = items[activeIndex];
				if (activeItem) {
					activeItem.scrollIntoView({ block: "nearest" });
				}
			}

			const selectActiveItem = () => {
				const item = list.querySelector("li.active");
				if (item) {
					item.click();
				}
			}

			input.addEventListener("input", updateSuggestions);

			input.addEventListener("keydown", (e) => {
				if (list.style.display === "block") {
					switch (e.key) {
						case "ArrowDown":
							e.preventDefault();
							moveActive(1);
							break;
						case "ArrowUp":
							e.preventDefault();
							moveActive(-1);
							break;
						case "Enter":
							e.preventDefault();
							selectActiveItem();
							break;
						case "Escape":
							list.style.display = "none";
							break;
					}
				}
			});

			document.addEventListener("click", (e) => {
				if (e.target !== input && e.target.parentNode !== list) {
					list.style.display = "none";
				}
			});
		};
		return this;
	}
}
}