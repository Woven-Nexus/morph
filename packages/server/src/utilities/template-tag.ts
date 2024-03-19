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

	const script = `<script type="module">
registerStyle('${ tag }', \`${ style.replaceAll(/[\t\n ]/g, '') }\`);
</script>`.replaceAll(/ +/g, ' ').replaceAll(/\t+/g, '\t').replaceAll(/\n+/g, ' ');

	return html`
	<${ tag }>
		${ script }
		${ template }
	</${ tag }>
	`;
};
