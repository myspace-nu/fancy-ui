if (typeof window.fancyAlert === "undefined") {
	window.fancyAlertBox = class {
		constructor(instance, message, options) {
			options = Object.assign(
				{ closeButton: true, icon: "&#128712;", timeout: false, type: "info" },
				options
			);
			this.node = document.createElement("div");
			this.close = () => {
				let node = this.node;
				this.node.style.transition = "all 1s ease";
				this.node.style.transform = "scale(0)";
				this.node.addEventListener("transitionend", function () {
					node.remove();
				});
			};
			this.node.classList.add("fancy-alert", `fancy-alert-${options.type}`);
			if (options.discrete) {
				this.node.classList.add("fancy-alert-discrete");
			}
			if (options.icon) {
				let iconElm = document.createElement("div");
				iconElm.classList.add("fancy-alert-icon");
				iconElm.innerHTML = options.icon;
				this.node.append(iconElm);
			}
			let messageElm = document.createElement("div");
			messageElm.classList.add("fancy-alert-message");
			messageElm.innerHTML = message;
			this.node.append(messageElm);
			if (options.closeButton) {
				let closeElm = document.createElement("div");
				closeElm.classList.add("fancy-alert-close");
				closeElm.innerHTML = "&#x2715;";
				closeElm.addEventListener("click", (evt) => {
					this.close(evt.target.closest(".fancy-alert"));
				});
				this.node.append(closeElm);
			}
			instance.node.prepend(this.node);
			if (options.timeout) {
				window.setTimeout(() => {
					this.close();
				}, options.timeout);
			}
			return this;
		}
		close() {
			this.close();
		}

	};
	window.fancyAlert = class {
		constructor(selector, options) {
			this.options = Object.assign(
				{
					onClick: () => { }
				},
				options
			);
			this.container;
			const instance = this;
			if (typeof selector === "string") {
				this.node = document.querySelector(selector);
			} else if (Node.prototype.isPrototypeOf(selector)) {
				this.node = selector;
			}
			if (!this.node) {
				this.node = document.body;
			}
			return this;
		}
		show(message, options) {
			return new fancyAlertBox(this, message, options)
		}
	};
}
