// hack to make htmx work with forms using custom elements.
document.body.addEventListener('htmx:configRequest', (event) => {
	const formEl = event.composedPath().find(el => el.tagName === 'FORM');
	if (!formEl)
		return;

	// this triggers a formdata event.
	// this extracts the data of the form compatible fields.
	const formData = new FormData(formEl);

	// add the form data as request parameters
	for (const pair of formData.entries()) {
		const name = pair[0];
		const value = pair[1];

		const parameters = event.detail.parameters;
		parameters[name] ??= [];

		// for multivalued form fields, FormData.entries() may contain multiple entries with the same name
		if (Array.isArray(parameters[name]) && !parameters[name].includes(value))
			parameters[name].push(value);
	}
});
