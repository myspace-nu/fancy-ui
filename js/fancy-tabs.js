if (typeof window.fancyTabs === 'undefined') {
window.fancyTabs = class {
	constructor(selector, options) {
		this.nodes = [];
		if (typeof selector === 'string') {
			this.nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
		} else if (Node.prototype.isPrototypeOf(selector)) {
			this.nodes.push(selector);
		} else if (NodeList.prototype.isPrototypeOf(selector) || HTMLCollection.prototype.isPrototypeOf(selector) ) {
			this.nodes = Array.prototype.slice.call(selector);
		} else if (selector => !!selector && Object.getPrototypeOf(selector) === Object.prototype) {
			// Selector is omitted and first parameter is options
			options = selector
			this.nodes = Array.prototype.slice.call(document.querySelectorAll('.fancy-tabs'));
		} else {
			this.nodes = Array.prototype.slice.call(document.querySelectorAll('.fancy-tabs'));
		}
		this.options = Object.assign({
			collapse: true
		}, options)
		for (const node of this.nodes) {
			node.currentTab = null;
			node.initTab = null;
			node.totalWidth = 0;
			node.querySelectorAll('ul.tabs>li').forEach((element, index) => {
				element.dataset['html'] = element.innerHTML;
				element.dataset['text'] = element.innerText;
				element.title = element.innerText;
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
		const onResize = () => {
			for (const node of this.nodes) {
				const ulStyle = node.querySelector('ul.tabs').currentStyle || window.getComputedStyle(node.querySelector('ul.tabs'));
				node.querySelectorAll('ul.tabs>li').forEach((element) => {
					if (node.clientWidth-parseInt(ulStyle['padding-left'])-parseInt(ulStyle['padding-right']) < node.totalWidth) {
						if(this.options.collapse){
							element.innerHTML = element.dataset['html'].replace(element.dataset['text'], (element.dataset['icon'] || ((element.dataset['text'].length > 3) ? element.dataset['text'].substring(0, 3) + '…' : element.dataset['text'])));
						} else {
							element.innerHTML = (element.dataset['icon']) ? element.dataset['html'].replace(element.dataset['text'], element.dataset['icon'] + ' ' + element.dataset['text']) : element.dataset['html'];
							element.style.width="calc(100%)";
							element.style.marginLeft="0";
						}
					} else {
						element.innerHTML = (element.dataset['icon']) ? element.dataset['html'].replace(element.dataset['text'], element.dataset['icon'] + ' ' + element.dataset['text']) : element.dataset['html'];
						element.style.width="";
						element.style.marginLeft="";
					}
				});
			}
		};
		window.addEventListener('load', () => {
			for (const node of this.nodes) {
				node.totalWidth = 0;
				node.querySelectorAll('ul.tabs>li').forEach((element, index) => {
					const style = element.currentStyle || window.getComputedStyle(element);
					node.totalWidth += (element.offsetWidth + parseInt(style['margin-left']));
				});
			}
			window.addEventListener('resize', () => {
				onResize();
			});
			onResize();
		});
		return this;
	}
}
}