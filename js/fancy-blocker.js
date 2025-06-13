if (typeof window.fancyBlocker === 'undefined') {
	window.fancyBlocker = class {
		constructor(options) {
			this.options = Object.assign(
				{
					onClick: () => { }
				},
				options
			);
			this.blocker = document.createElement('div');
			this.blocker.className = 'fancy-blocker';
			if(this.options.spinner){
				let spinner = document.createElement('div');
				spinner.className = 'spinner';
				this.blocker.appendChild(spinner);
			}
			document.body.appendChild(this.blocker);
			return this;
		}
		show() {
			this.blocker.style.display = 'flex';
			document.body.classList.add('fancy-noscroll');
			return this;
		}
		hide() {
			this.blocker.style.display = 'none';
			document.body.classList.remove('fancy-noscroll');
			return this;
		}
		destroy() {
			this.blocker.remove();
			document.body.classList.remove('fancy-noscroll');
			return this;
		}
	};
}
