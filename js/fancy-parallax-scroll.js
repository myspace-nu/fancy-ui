if (typeof window.fancyParallaxScroll === 'undefined') {
window.fancyParallaxScroll = class {
	constructor(selector = '.fancy-parallax-scroll', options) {
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
		const parallaxScroll = () => {
			for (const elm of this.nodes) {
				if ((window.scrollY + window.innerHeight) > elm.offsetTop && window.scrollY < elm.offsetTop + elm.offsetHeight) {
					const speed = Math.min(Math.max(parseFloat(elm.dataset.speed), 1), -1) || 1;
					const bottom = (((window.scrollY + window.innerHeight) - elm.offsetTop) * speed);
					const top = window.innerHeight + elm.offsetHeight;
					const percent = ((bottom / top) * 100) + (50 - (speed * 50));
					elm.style.backgroundPosition = `50% ${percent}%`;
				}
			}
		}
		window.addEventListener('load', ()=>{
			parallaxScroll();
		});
		window.addEventListener('scroll', ()=>{
			parallaxScroll();
		});
		window.addEventListener('resize', ()=>{
			parallaxScroll();
		});
		return this;
	}
}
}