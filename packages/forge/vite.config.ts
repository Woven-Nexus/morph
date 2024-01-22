import { defineConfig } from 'vite';
import { viteImportCssSheet } from 'vite-plugin-import-css-sheet';
import { viteCopy } from '@roenlie/package-toolbox/vite-utils';

export default defineConfig({
	root: './src',
	publicDir: '../public',
	plugins: [
		viteImportCssSheet(),
		viteCopy({
			targets: [
				{
					from: './node_modules/@roenlie/mimic-elements/styles/*',
					to: './public/vendor/mimic-elements',
				},
			],
			hook: 'config',
			copyOnce: true,
		}),
	],
});