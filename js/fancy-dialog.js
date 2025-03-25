if (typeof window.fancyDialog === 'undefined') {
	window.fancyDialog = (options={}) => {
		options.buttons ||= ['Ok'];
		options.buttons = options.buttons.map((btn)=>{
			btn = (typeof btn === 'string') ? { text: btn } : btn;
			btn.action ||= btn.text;
			btn.type ||= 'confirm';
			return btn;
		});
		options.blocking ??= true;
		options.dismissable ??= false;
		const modal = document.createElement('div');
		modal.className = 'fancy-dialog';
		if(options.blocking){
			modal.classList.add("blocking")
		}
		const modalContent = document.createElement('div');
		modalContent.className = 'fancy-dialog-content'
		console.log();
		modalContent.innerHTML = (options.content instanceof HTMLElement && options.content.type?.match(/text/i)) ? options.content.textContent :
			(options.content instanceof HTMLElement) ? options.content.innerHTML :
			(options.content) ? options.content :
			``;
		for(const key of Object.keys(options.initialValues || {})){
			[...modalContent.querySelectorAll(`*[name="${key}"]`)].forEach(elm => {
				if(elm.tagName==='SELECT'){
					[...elm.querySelectorAll('option')].forEach(option => {
						option.selected = options.initialValues[key].includes(option.value);
					});
				} else if(['radio','checkbox'].includes(elm.type)){
					elm.checked = (elm.value===options.initialValues[key] || (elm.type==='checkbox' && options.initialValues[key]===true));
				} else {
					elm.value = options.initialValues[key];
				}
			});
		}
		modal.appendChild(modalContent)
		document.body.appendChild(modal);
		modal.style.display = 'flex';
		const closeModal = () => {
			modal.style.display = 'none';
			modal.remove();
		}
		const promise = new Promise((resolve, reject) => {
			if(options.buttons){
				const buttonDiv = document.createElement('div');
				buttonDiv.className = 'fancy-dialog-buttons';
				for(const button of options.buttons){
					const elm = document.createElement('button');
					elm.innerHTML = button.text;
					elm.addEventListener('click', () => {
						let formValues = {};
						if(modal.querySelector('form')){
							if(button.type==='confirm' && !modal.querySelector('form').reportValidity()){
								return false;
							}
							formValues = [...new FormData(modal.querySelector('form')).entries()].reduce((acc, [key, value]) => {
								acc[key] = acc.hasOwnProperty(key) ? [].concat(acc[key], value) : value;
								return acc; 
							}, {});
						}
						resolve({ action: button.action?.toLowerCase(), button:button, data: formValues });
						closeModal();
					});
					buttonDiv.appendChild(elm);
				}
				modalContent.appendChild(buttonDiv);
			}
			modal.querySelector('form')?.addEventListener('submit', (evt) => {
				evt.preventDefault();
				console.log(options);
			});
			modal.addEventListener('click', (evt) => {
				if(evt.target === modal && options.dismissable){
					resolve({}); // reject();
					closeModal();
				}
			})
			const handleKeyDown = (event) => {
				if (event.key === 'Escape' && !(event.ctrlKey || event.altKey || event.shiftKey)) {
					document.removeEventListener('keydown', handleKeyDown);
					resolve({}); // reject();
					closeModal();
				}
			}
			document.addEventListener('keydown', handleKeyDown);
		});
		return {
			promise,
			close: () => {
				closeModal();
			}
		};
	}
}
