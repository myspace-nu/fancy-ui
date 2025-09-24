if (typeof window.fancyNewsCarousel === 'undefined') {
	window.fancyNewsCarousel = class {
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
				this.nodes = Array.prototype.slice.call(document.querySelectorAll('.fancy-news-carousel'));
			} else {
				this.nodes = Array.prototype.slice.call(document.querySelectorAll('.fancy-news-carousel'));
			}
			options = Object.assign({
				slideInterval: 10000,
				slideTransition: 600,
				scrollDelay: 2000,
				scrollDuration: 5000
			}, options)
			
			

			for (const root of this.nodes) {
				root.classList.add("fancy-news-carousel");
				const items = Array.from(root.querySelectorAll('section'));
				const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
				let index = 0;
				let intervalId = null;
				let bodyTimeoutId = null;
				let bodyRaf = null;
				let slideRaf = null;
				const easeInOutCubic = t => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2);
				function cancelBodyScroll(){
					if (bodyTimeoutId){ clearTimeout(bodyTimeoutId); bodyTimeoutId = null; }
					if (bodyRaf){ cancelAnimationFrame(bodyRaf); bodyRaf = null; }
				}
			  
				function cancelSlide(){
					if (slideRaf){ cancelAnimationFrame(slideRaf); slideRaf = null; }
				}
			  
				function autoScrollBody(el, duration){
					el.scrollTop = 0;
					const max = el.scrollHeight - el.clientHeight;
					if (max <= 0 || reduced) return;
					bodyTimeoutId = setTimeout(() => {
						const start = performance.now();
						const beginTop = el.scrollTop;
						const distance = max - beginTop;
						const step = now => {
							const t = Math.min(1, (now - start) / duration);
							el.scrollTop = beginTop + distance * easeInOutCubic(t);
							if (t < 1) bodyRaf = requestAnimationFrame(step);
							else bodyRaf = null;
						};
						bodyRaf = requestAnimationFrame(step);
					}, options.scrollDelay);
				}
			  
				function showSlide(i, animate = true){
					cancelBodyScroll();
					cancelSlide();

					index = (i + items.length) % items.length;
					const target = index * root.clientWidth;

					if (reduced || !animate){
						root.scrollLeft = target;
						startBodyForActive();
						return;
					}

					const start = performance.now();
					const begin = root.scrollLeft;
					const distance = target - begin;

					const step = now => {
					const t = Math.min(1, (now - start) / options.slideTransition);
					root.scrollLeft = begin + distance * easeInOutCubic(t);
					if (t < 1) slideRaf = requestAnimationFrame(step);
					else {
						slideRaf = null;
						startBodyForActive();
					}
					};
					slideRaf = requestAnimationFrame(step);
				}
			  
				function startBodyForActive(){
					const active = items[index];
					const body = active && active.querySelector('article');
					if (body) autoScrollBody(body, options.scrollDuration);
				}
			  
				function next(){ showSlide(index + 1); }
				function start(){
					showSlide(index, /*animate*/false);
					intervalId = setInterval(next, options.slideInterval);
				}
				function stop(){
					clearInterval(intervalId);
					intervalId = null;
					cancelBodyScroll();
					cancelSlide();
				}
			  
				// Pausa vid hover (valfritt men trevligt)
				root.addEventListener('mouseenter', stop);
				root.addEventListener('mouseleave', () => {
					if (!intervalId) intervalId = setInterval(next, options.slideInterval);
				});
			  
				// Avbryt vertikal autoscroll vid interaktion i body
				items.forEach(item => {
					const body = item.querySelector('article');
					if (!body) return;
					const cancel = () => cancelBodyScroll();
					['wheel','touchstart','keydown','mousedown'].forEach(evt =>
						body.addEventListener(evt, cancel, { passive:true })
					);
				});
			  
				// Om containerns storlek ändras (t.ex. responsivt), håll oss på rätt slide
				const ro = new ResizeObserver(() => {
					// hoppa direkt till korrekt position utan animation
					showSlide(index, /*animate*/false);
				});
				ro.observe(root);
				start();

			}
			const onResize = () => {

			};
			window.addEventListener('load', () => {
			});
			return this;
		}
	}
	}