/* eslint-disable lit/binding-positions */
import * as esbuild from 'esbuild';


const trimExpr = /(?:^[\n\t ]+)|(?:[\n\t ]+$)/g;


export const template = async (options: {
	name: string,
	template: string | Promise<string>,
	style: string | Promise<string>,
	script?: () => void,
	immediate?: boolean,
}) => {
	const { name, script, immediate } = options;
	let { template, style  } = options;

	template = await template;
	style = (await style)
		.replaceAll(/\n+/g, ' ')
		.replaceAll(/\t+/g, ' ')
		.replaceAll(/ {2,}/g, ' ');

	const styleId = 'style-' + name;
	const scriptId = crypto.randomUUID();
	const scriptContent: string[] = [
		`const __styleEl = document.body.querySelector('#${ styleId }')`,
		`if (!document.head.querySelector('#${ styleId }'))`,
		`document.head.appendChild(__styleEl);`,
		`else __styleEl.remove();`,
		`document.getElementById('${ scriptId }').remove();`,
	];

	if (script) {
		let stringScript = script?.toString();
		stringScript = (await esbuild.transform(stringScript, { loader: 'ts' })).code;
		stringScript = stringScript.replaceAll(trimExpr, '');
		stringScript = stringScript.slice(0, -1);

		scriptContent.push(
			`module.define('${ name }', ${ stringScript });`,
			(immediate ? `module.import('${ name }');` : ''),
		);
	}

	const styleTag =
	`<style id="${ styleId }">`
		+ style +
	`</style>`;

	const scriptTag =
	`<script id="${ scriptId }" type="module">`
		+ scriptContent.join('\n') +
	`</script>`;

	return styleTag + scriptTag + template;
};
