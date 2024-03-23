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


export const template = async (options: {
	tag: string,
	template: string | Promise<string>,
	style: string | Promise<string>,
	script?: () => void,
	immediate?: boolean,
}) => {
	const { tag, script, immediate } = options;
	let { template, style  } = options;

	template = await template;
	style = await style;

	const styleScriptId = crypto.randomUUID();
	const styleScript = `<script id="${ styleScriptId }" type="module">`
		+ `registerStyle('${ styleScriptId }', '${ tag }', \`${ style.replaceAll(/[\t\n ]/g, '') }\`);`
		+ `</script>`;

	const clientScriptId = crypto.randomUUID();
	const clientScript = `<script id=${ clientScriptId } type="module">`
		+ `module.define('${ tag }', ${ script?.toString() });`
		+ (immediate ? `module.import('${ tag }');` : '')
		+ `document.getElementById('${ clientScriptId }').remove();`
		+ '</script>';

	return html`
	<${ tag }>
		${ styleScript }
		${ template }
		${ clientScript }
	</${ tag }>
	`;
};
