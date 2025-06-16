if (typeof window.fancySlider === 'undefined') {
window.fancySlider = class {
	constructor(selector, options){
		this.options = Object.assign({
			history: true,
			navigation: false,
			pagination: false,
			preloadImages: true,
			autoplayDelay: 5000,
			useZoom: false,
			zoomPercent: 200,
			onShow: ()=>{},
			onStart: ()=>{},
			onStop: ()=>{}
		}, options)
		if(typeof selector === 'string')
			selector = document.querySelectorAll(selector);
		if(typeof selector === 'object' && selector.length > 1){
			let instances = [];
			selector.forEach(element => {
				instances.push(new fancySlider(element))
			});
			return instances;
		}
		this.element = selector[0];
		this.currentSlide = null;
		this.isZoomed = false;

		// Save initial slide classes
		this.element.querySelectorAll(".slide").forEach((element,index) => {
			element.dataset['initialClasses'] = element.className;
		});

		// Preload images
		if(this.options.preloadImages){
			this.element.querySelectorAll("img").forEach((element) => {
				let img=new Image();
				img.src=element.src;
			});
			this.element.querySelectorAll("div").forEach((element) => {
				if(element.style['background-image']){
					let img=new Image();
					img.src=element.style['background-image'].match(/url\(["']?([^"']*)["']?\)/)[1];
				}
			});
		}

		// History (Prev / Next)
		if(this.options.history){
			let navlink;
			navlink = document.createElement("a");
			navlink.innerHTML = "&#10094;";
			navlink.addEventListener("click", (evt)=>{
				this.backward();
			});
			navlink.classList.add("prev")
			this.element.appendChild(navlink);
			navlink = document.createElement("a");
			navlink.innerHTML = "&#10095;";
			navlink.addEventListener("click", (evt)=>{
				this.forward();
			});
			navlink.classList.add("next")
			this.element.appendChild(navlink);
		}

		// Navigation
		if(this.options.navigation){
			let nav = document.createElement("nav")
			this.element.querySelectorAll(".slide").forEach((element,index) => {
				let navlink = document.createElement("a")
				navlink.addEventListener("click", (evt)=>{
					this.show(index+1);
					if(this.options.autoplay){
						this.start();
					}
				});
				nav.appendChild(navlink);
			});
			this.element.appendChild(nav);
		}

		// Navigation
		if(this.options.pagination){
			this.paginationElement = document.createElement("div");
			this.paginationElement.className = "pagination";
			let appendTo = (typeof this.options.pagination === 'boolean') ? this.element :
				(typeof this.options.pagination === 'string' && document.querySelector(this.options.pagination)) ? document.querySelector(this.options.pagination) :
				(typeof this.options.pagination === 'object') ? this.options.pagination :
				this.element;
			appendTo.appendChild(this.paginationElement);
		}

		if(this.options.useZoom){
			this.element.addEventListener("mouseenter", (event)=>{
				let slides = this.element.querySelectorAll(".slide");
				const div = slides[this.currentSlide-1];
				div.style.backgroundSize = `${Math.min(Math.max(this.options.zoomPercent,100),500)}%`;
				this.isZoomed = true;
			});
			this.element.addEventListener("mouseleave", (event)=>{
				let slides = this.element.querySelectorAll(".slide");
				const div = slides[this.currentSlide-1];
				div.style.backgroundSize = "cover";
				this.isZoomed = false;
			});
			this.element.addEventListener("mousemove", (event)=>{
				let slides = this.element.querySelectorAll(".slide");
				const div = slides[this.currentSlide-1];
				const rect = div.getBoundingClientRect();
				const xPct = ((event.clientX - rect.left) / rect.width)  * 100;
				const yPct = ((event.clientY - rect.top)  / rect.height) * 100;
				div.style.backgroundPosition = `${xPct}% ${yPct}%`;
			});
		}
		if(this.options.autoplay){
			this.start();
		}

		this.show(1);
		return this;
	}
	show(n){
		if(this.isZoomed){
			let isZoomed = this.isZoomed;
			this.element.dispatchEvent(new Event('mouseleave'));
			this.isZoomed = isZoomed;
		}
		let slides = this.element.querySelectorAll(".slide");
		let direction = (n>this.currentSlide) ? "Right" : "Left";
		let revDirection = (direction=="Right") ? "Left" : "Right";
		// Hide previous slide
		if(this.currentSlide>=1){
			setTimeout((i)=>{
				slides[i-1].className =
					(slides[i-1].dataset["transition"] == "slide") ? slides[i-1].dataset["initialClasses"] + " slide-slideOut" + revDirection :
					(slides[i-1].dataset["transition"] == "rotate") ? slides[i-1].dataset["initialClasses"] + " slide-rotateOut" + revDirection :
					slides[i-1].dataset["initialClasses"] + " slide-fadeOut";
			},50,this.currentSlide)
		}

		this.currentSlide = (typeof n === 'undefined') ? this.currentSlide : n;
		this.currentSlide =
			(this.currentSlide > slides.length) ? 1 :
			(this.currentSlide < 1) ? slides.length :
			this.currentSlide;

		// Show new slide
		slides[this.currentSlide-1].style.display="none";
		setTimeout((i)=>{
			slides[i-1].style.display="block";
			slides[i-1].className =
				(slides[i-1].dataset["transition"] == "slide") ? slides[i-1].dataset["initialClasses"] + " slide-slideIn" + direction :
				(slides[i-1].dataset["transition"] == "rotate") ? slides[i-1].dataset["initialClasses"] + " slide-rotateIn" + direction :
				slides[i-1].dataset["initialClasses"] + " slide-fadeIn";
		},50,this.currentSlide)

		this.element.querySelectorAll("nav a").forEach((element,index) => {
			element.classList.remove("active");
			if(index === this.currentSlide-1){
				element.classList.add("active");
			}
		});
		if(this.options.pagination){
			this.paginationElement.innerHTML = this.currentSlide + " / " + slides.length;		 
		}
		this.options.onShow.call(this,this);
		if(this.isZoomed){
			let isZoomed = this.isZoomed;
			this.element.dispatchEvent(new Event('mouseenter'));
			this.isZoomed = isZoomed;
		}
	}
	start(){
		this.stop();
		this.timer = setInterval(()=>{
			this.show(this.currentSlide+1);
		}, this.options.autoplayDelay);
		this.options.onStart.call(this,this);
	}
	stop(){
		if(this.timer)
			clearInterval(this.timer);
		this.options.onStop.call(this,this);
	}
	forward(){
		this.show(this.currentSlide+1);
		if(this.options.autoplay)
			this.start();
	}
	backward(){
		this.show(this.currentSlide-1);
		if(this.options.autoplay)
			this.start();
	}
}
}