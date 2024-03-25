// hack to make htmx work with forms having shoelace components
document.body.addEventListener('htmx:configRequest', (event) => {
	if (event.target.tagName !== 'FORM')
		return;

	// this triggers a formdata event.
	const formData = new FormData(event.target);

	// add the form data as request parameters
	for (const pair of formData.entries()) {
		const name = pair[0];
		const value = pair[1];

		const parameters = event.detail.parameters;

		// for multivalued form fields, FormData.entries() may contain multiple entries with the same name
		if (parameters[name] == null)
			parameters[name] = [ value ]; // single element array
		else if (Array.isArray(parameters[name]) && !parameters[name].includes(value))
			parameters[name].push(value);
	}
});
