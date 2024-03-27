window.registerStyle = (id, name, style) => {
	if (document.head.querySelector('#' + name))
		return;

	const styleEl = document.createElement('style');
	styleEl.id = name;
	styleEl.innerHTML = style;
	document.head.appendChild(styleEl);
};
