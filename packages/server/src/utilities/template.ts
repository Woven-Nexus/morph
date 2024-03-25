/* eslint-disable lit/binding-positions */
import * as esbuild from 'esbuild';

import { html } from './template-tag.js';


const trimExpr = /(?:^[\n\t ]+)|(?:[\n\t ]+$)/g;


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
	const styleScript =
	`<script id="${ styleScriptId }" type="module">`
		+ `registerStyle(`
		+ `'${ styleScriptId }',`
		+ `'${ tag }',`
		+ '`' + style
			.replaceAll(/\n+/g, ' ')
			.replaceAll(/\t+/g, ' ')
			.replaceAll(/ {2,}/g, ' ')
			+ '`);' +
	`</script>`;

	let clientScript = '';
	if (script) {
		const clientScriptId = crypto.randomUUID();
		let stringScript = script?.toString();
		stringScript = (await esbuild.transform(stringScript, { loader: 'ts' })).code;
		stringScript = stringScript.replaceAll(trimExpr, '');
		stringScript = stringScript.slice(0, -1);

		clientScript =
		`<script id=${ clientScriptId } type="module">`
			+ `module.define('${ tag }', ${ stringScript });`
			+ (immediate ? `module.import('${ tag }');` : '')
			+ `document.getElementById('${ clientScriptId }').remove();` +
		'</script>';
	}

	return html`
	<${ tag }>
		${ styleScript }
		${ template }
		${ clientScript }
	</${ tag }>
	`;
};
