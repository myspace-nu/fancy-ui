document.addEventListener('DOMContentLoaded', () => {
	const getLikeRef = (elm) => {
		const article = (elm.tagName === 'ARTICLE') ? elm : elm.closest("article");
		if (!article.querySelector(".fancy-showcase-like")) { return; }
		return ((elm.tagName === 'ARTICLE') ? elm.id || elm.querySelector("a")?.href : false) || elm.closest("article")?.id || elm.closest("article")?.querySelector("a")?.href
	}
	const likes = JSON.parse(localStorage.getItem('fancy-showcase-likes') || '{}');
	for(const container of [...document.querySelectorAll('.fancy-showcase')]){
		for(const article of [...container.children].filter(el => el.tagName === 'ARTICLE')){
			if(likes[getLikeRef(article)] ){
				article.querySelector(".fancy-showcase-like").classList.add("fancy-showcase-like-active");
			}
			article.querySelector(".fancy-showcase-like")?.addEventListener("click", (elm)=>{
				if(elm.currentTarget.classList.contains("fancy-showcase-like-active")){
					elm.currentTarget.classList.remove("fancy-showcase-like-active");
				} else {
					elm.currentTarget.classList.add("fancy-showcase-like-active");
				}
				likes[getLikeRef(elm.currentTarget)] = elm.currentTarget.classList.contains("fancy-showcase-like-active");
				localStorage.setItem('fancy-showcase-likes', JSON.stringify(likes));
			});
		}
		[...container.children].filter(el => el.tagName === 'ARTICLE')
			.sort((a, b) => !!likes[getLikeRef(b)] - !!likes[getLikeRef(a)])
			.forEach(article => container.appendChild(article));


		container.addEventListener("mouseover",()=>{
			container.dataset['active'] = true;
		});
		container.addEventListener("mouseout",()=>{
			delete container.dataset['active'];
		});
		let down = false, startX = 0, startLeft = 0;
		container.addEventListener('mousedown', (e) => {
			down = true;
			container.classList.add('dragging');
			startX = e.pageX;
			startLeft = container.scrollLeft;
			e.preventDefault();
		});
		window.addEventListener('mouseup', () => {
			down = false;
			container.classList.remove('dragging');
		});
		window.addEventListener('mousemove', (e) => {
			if (!down) return;
			const dx = e.pageX - startX;
			container.scrollLeft = startLeft - dx;
		});
		container.addEventListener('touchstart', (e) => {
			startX = e.touches[0].pageX;
			startLeft = container.scrollLeft;
		}, { passive: true });
		container.addEventListener('touchmove', (e) => {
			const dx = e.touches[0].pageX - startX;
			container.scrollLeft = startLeft - dx;
		}, { passive: true });

		container.scrollTo({ left: 0, behavior: 'smooth' });
		const scrollDelay = parseInt(container.dataset['scrolldelay']);
		if(!(scrollDelay>0)) { continue; }
		setInterval(()=>{
			if(container.dataset['active']){
				return;
			}
			const items = [...container.querySelectorAll('article')];
			if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 2) {
				return container.scrollTo({ left: 0, behavior: 'smooth' });
			}
			const next = items.find(el => el.offsetLeft + el.offsetWidth > container.scrollLeft + container.clientWidth ) || items[0];
			container.scrollTo({ left: next.offsetLeft, behavior: "smooth" });
		}, scrollDelay);
	}
});