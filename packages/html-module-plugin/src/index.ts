import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { isElementNode, isParentNode } from '@parse5/tools';
import { type DefaultTreeAdapterMap, parse } from 'parse5';
import type { Plugin } from 'vite';

type Node = DefaultTreeAdapterMap['node'];

interface Options {
	exportIds?: boolean;
}


/**
 * Transforms HTML files to support the HTML modules proposal, which enables
 * importing HTML into JavaScript modules.
 *
 * This plugin enables HTML module support in Rollup by transforming HTML files
 * that are imported with a `{type: 'html'}` attribute into JavaScript modules
 * that export DOM nodes.
 */
export const htmlModules = (options?: Options): Plugin => {
	const virtualModules = new Map<string, string>();
	const filetypes = [ '.ts', '.mts', '.js', '.mjs' ] as const;
	const illegalChars: Record<string, string> = {
		'\\': '\\\\', // Preserve any escape sequences in the source:
		'`':  '\\`',  // Escape backticks:
		'$':  '\\$',  // Escape ${} interpolation:
	};

	const importAssertRegex = (str: string, type: string) =>
		new RegExp(str + `['"] *(?:with|assert) *{[(?:\r?\n) \t]*type: *['"]${ type }['"][(?:\r?\n) ]*};`);

	const convert = (str: string) => {
		let res = '';
		for (const c of str)
			res += illegalChars[c] || c;

		return `\`${ res }\``;
	};

	return {
		enforce: 'pre',
		name:    'vite-plugin-html-modules',
		async resolveId(source, importer) {
			if (!source.endsWith('.html'))
				return;
			if (!importer)
				return;

			const resolvedId = await this.resolve(source, importer);
			importer = importer?.split('?')[0];

			if (resolvedId && filetypes.some(str => importer?.endsWith(str))) {
				const importerContent = await readFile(importer!, { encoding: 'utf8' });
				const regxp = importAssertRegex(source, 'html');

				if (regxp.test(importerContent)) {
					const modId = '\0virtual:' + randomUUID().replaceAll('-', '');
					virtualModules.set(modId, resolvedId.id);

					return modId;
				}
			}
		},
		async load(id) {
			if (!virtualModules.has(id))
				return;

			const realId = virtualModules.get(id)!;
			this.addWatchFile(realId);

			const code = await readFile(realId, { encoding: 'utf8' });

			let elementExports = '';

			if (options?.exportIds ?? false) {
				const ast = parse(code);

				// Walk the parse5 AST to find all elements with id attributes.
				const exportedIds = new Set<string>();
				const walk = (node: Node) => {
					if (isElementNode(node)) {
						const idAttr = node.attrs.find((attr: any) => attr.name === 'id');
						if (idAttr !== undefined)
							exportedIds.add(idAttr.value);
					}
					if (isParentNode(node))
						node.childNodes.forEach(walk);
				};
				walk(ast);

				elementExports = [ ...exportedIds ]
					.map((id, index) => isValidExportName(id)
						? `export const ${ id } = doc.querySelector('#${ id }');`
						: `const export${ index } = doc.querySelector('#${ id }');\nexport {export${ index } as '${ id }'};`)
					.join('\n');
			}

			// Escape the HTML source so that it can be used in a template literal.
			const escapedCode = convert(code);

			return ''
			+ 'const parser = new DOMParser();\n'
			+ `const doc = parser.parseFromString(${ escapedCode }, 'text/html');\n`
			+ `export default doc;\n`
			+ `${ elementExports }`;
		},
	};
};


const isValidExportName = (name: string) => {
	return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
};
