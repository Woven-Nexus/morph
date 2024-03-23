window.registerStyle = (id, tag, style) => {
	if (document.head.querySelector('#' + tag))
		return document.getElementById(id).remove();

	const styleEl = document.createElement('style');
	styleEl.id = tag;
	styleEl.innerHTML = style;
	document.head.appendChild(styleEl);

	document.getElementById(id).remove();
};
