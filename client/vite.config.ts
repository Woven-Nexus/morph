import { readFileSync } from 'fs';
import { defineConfig } from 'vite';


export default defineConfig({
	root:      './src',
	publicDir: '../public',
	build:     {
		outDir: '../dist',
	},
	plugins: [
		(() => {
			const styleMap = new Map<string, string>();
			const minifyCSS = (content: string) => {
				content = content
					.replaceAll(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '')
					.replaceAll(/ {2,}/g, ' ')
					.replaceAll(/ ([{:}]) /g, '$1')
					.replaceAll(/([{:}]) /g, '$1')
					.replaceAll(/([;,]) /g, '$1')
					.replaceAll(/ !/g, '!');

				return content;
			};

			return {
				name: 'inline-css-modules',
				load(id) {
					if (!id.endsWith('.ccss'))
						return;

					let transformed = styleMap.get(id);
					if (!transformed) {
						const file = readFileSync(id, { encoding: 'utf8' });
						const minified = JSON.stringify(minifyCSS(file));
						const newCode =
						`const sheet = new CSSStyleSheet();` +
						`sheet.replaceSync(${ minified });` +
						`export default sheet;`;

						styleMap.set(id, newCode);
						transformed = newCode;
					}

					return transformed;
				},
				handleHotUpdate(ctx) {
					if (ctx.file.endsWith('.ccss'))
						styleMap.delete(ctx.file);
				},
			};
		})(),
	],
});
