if (typeof window.fancyContextMenu === 'undefined') {
window.fancyContextMenu = class {
	constructor(selector, options) {
		this.options = Object.assign({
			trigger: 'contextmenu',
			onClick: () => { }
		}, options)
		this.nodes = [];
		this.container;
		const instance = this;
		if (typeof selector === 'string') {
			this.nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
		} else if (typeof selector === 'object' && selector.length === undefined) {
			this.nodes.push(selector);
		} else if (typeof selector === 'object' && selector.length > 0) {
			this.nodes = Array.prototype.slice.call(selector);
		}
		try {
			this.content = (typeof this.options.content === 'string' && document.querySelector(this.options.content)) ? document.querySelector(this.options.content).innerHTML :
			(typeof this.options.content === 'object' && this.options.content.length === undefined) ? this.options.content.innerHTML :
			(typeof this.options.content === 'string') ? this.options.content :
			"";
		} catch {
			this.content = this.options.content;
		}
		for (const el of this.nodes) {
			el.addEventListener(this.options.trigger, function (e) {
				e.preventDefault();
				e.stopPropagation();
				instance.init(e);
			});
		};
		document.addEventListener('click', (e)=>{ instance.remove(e); } );
		document.addEventListener('contextmenu', (e)=>{ instance.remove(e); } );
		document.addEventListener('scroll', (e)=>{ instance.remove(e); } );
		window.addEventListener('resize', (e)=>{ instance.remove(e); } );
		return this;
	}
	init(e) {
		const instance = this;
		if (this.container) {
			this.remove();
		}
		this.container = document.createElement('div');
		this.container.style.display = 'none';
		this.container.style.position = 'fixed';
		this.container.className = 'fancy-context-menu';
		document.body.appendChild(this.container);
		this.container.innerHTML = this.content;
		this.container.style.display = '';
		if(e.clientX + this.container.offsetWidth > window.innerWidth){
			this.container.style.left = (e.clientX - this.container.offsetWidth + 10) + 'px';
			this.container.querySelectorAll("ul").forEach((el)=>{
				el.style.left=""; el.style.right="100%";
			});
		} else {
			this.container.style.left = (e.clientX - 10) + 'px';
			this.container.querySelectorAll("ul").forEach((el)=>{
				el.style.left="100%"; el.style.right="";
			});
		}
		this.container.style.top = (e.clientY > window.innerHeight / 2) ? (e.clientY - this.container.offsetHeight + 10) + 'px' : (e.clientY - 10) + 'px';
		this.container.addEventListener('click', function (evt) {
			const link = (evt.target.tagName === 'A') ? evt.target : evt.target.closest("a");
			if(link.href && link.href === location.href.split(/[#?]/)[0]){
				evt.preventDefault();
			}
			instance.options.onClick.call(this, evt, link);
		});

	}
	remove(e) {
		if (this.container) {
			this.container.remove();
			this.container = null;
		}
	}
}
}