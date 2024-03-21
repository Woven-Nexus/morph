/* eslint-disable lit/binding-positions */
const parseTag = async (strings: TemplateStringsArray, ...values: unknown[]) => {
	let aggregator = '';

	for (let i = 0; i < strings.length; i++) {
		const string = strings[i];
		aggregator += string;

		const expr = values[i];
		if (expr === undefined)
			continue;

		let value: unknown = expr;

		if (typeof value === 'function')
			value = value();

		if (value instanceof Promise)
			value = await value;

		if (Array.isArray(value))
			value = (await Promise.all(value)).join('');

		aggregator += value;
	}

	return aggregator;
};

export const html = parseTag;
export const css = parseTag;


export const template = async (
	tag: string,
	template: string | Promise<string>,
	style: string | Promise<string>,
) => {
	template = await template;
	style = await style;

	const id = crypto.randomUUID();
	const script = `<script id="${ id }" type="module">`
		+ `registerStyle('${ id }', '${ tag }', \`${ style.replaceAll(/[\t\n ]/g, '') }\`);`
		+ `</script>`;

	return html`
	<${ tag }>
		${ script }
		${ template }
	</${ tag }>
	`;
};
