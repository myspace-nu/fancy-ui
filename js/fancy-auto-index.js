if (typeof window.fancyAutoIndex === 'undefined') {
window.fancyAutoIndex = class {
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
			this.nodes = [document.body];
		} else {
			this.nodes = [document.body];
		}
		this.options = Object.assign({
			selector : 'h1,h2'
		}, options)
		for (const node of this.nodes) {
			let ul = document.createElement("ul");
			node.querySelectorAll(this.options.selector).forEach((element, index) => {
				let anchorLink = element.innerText.toLowerCase().replace(/\s+/g,"-").match(/[a-z0-9-]+/g).join("");
				let anchor = (element.querySelector("a[name]"));
				if(!anchor){
					anchor = document.createElement("a");
					anchor.setAttribute('name', anchorLink)
					element.prepend(anchor);
				}
				let a = document.createElement("a");
				a.href="#"+anchorLink;
				a.innerHTML = element.innerText;
				let li = document.createElement("li");
				li.appendChild(a);
				ul.appendChild(li);
			});
			node.toc = (typeof this.options.toc === 'string' && document.querySelector(this.options.toc)) ? document.querySelector(this.options.toc) :
				(Node.prototype.isPrototypeOf(this.options.toc)) ? this.options.toc :
				undefined;
			if(node.toc){
				node.toc.appendChild(ul);
			}
		}
		return this;
	}
}
}