if (typeof window.fancyTabs === 'undefined') {
window.fancyTabs = class {
	constructor(selector = '.fancy-tabs', options) {
		this.options = Object.assign({

		}, options)
		this.nodes = [];
		if (typeof selector === 'string') {
			this.nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
		} else if (typeof selector === 'object' && selector.length === undefined) {
			this.nodes.push(selector);
		} else if (typeof selector === 'object' && selector.length > 0) {
			this.nodes = Array.prototype.slice.call(selector);
		}

		for (const node of this.nodes) {
			node.currentTab = null;
			node.initTab = null;
			node.totalWidth = 0;
			node.querySelectorAll('ul.tabs>li').forEach((element, index) => {
				element.dataset['html'] = element.innerHTML;
				element.dataset['text'] = element.innerText;
				if (element.dataset['icon']) {
					element.innerHTML = element.innerHTML.replace(element.innerText, element.dataset['icon'] + ' ' + element.innerText);
				}
				const style = element.currentStyle || window.getComputedStyle(element);
				node.totalWidth += (element.offsetWidth + parseInt(style['margin-left']));
				if(element.classList.contains('active')){
					node.initTab = element;
				}
				element.addEventListener("click", (event) => {
					const li = (event.target.className === 'LI') ? event.target : event.target.closest('li');
					if (li.classList.contains('disabled')) {
						return;
					}
					li.closest('ul').querySelectorAll('li').forEach((element) => {
						element.classList.remove("active");
					});
					li.classList.add("active");
					if (node.currentTab) {
						node.querySelector(`[data-id="${node.currentTab}"]`).style.display = 'none';
					}
					if (li.dataset['opens']) {
						node.currentTab = li.dataset['opens'];
						node.querySelector(`[data-id="${node.currentTab}"]`).style.display = 'block';
					}
				});
			});
			if(node.initTab && node.initTab.dataset['opens']){
				node.initTab.click();
			}
		}
		window.addEventListener('resize', () => {
			for (const node of this.nodes) {
				node.querySelectorAll('ul.tabs>li').forEach((element) => {
					if (node.clientWidth < node.totalWidth) {
						element.innerHTML = element.dataset['html'].replace(element.dataset['text'], (element.dataset['icon'] || ((element.dataset['text'].length > 3) ? element.dataset['text'].substring(0, 3) + '…' : element.dataset['text'])));
					} else {
						element.innerHTML = (element.dataset['icon']) ? element.dataset['html'].replace(element.dataset['text'], element.dataset['icon'] + ' ' + element.dataset['text']) : element.dataset['html'];
					}
				});
			}
		});
		return this;
	}
}
}