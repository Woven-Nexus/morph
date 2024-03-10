import { viteCopy } from '@roenlie/package-toolbox/vite-utils';
import { keystone } from 'jsxlike-template-plugin';
import { defineConfig } from 'vite';
import { viteImportCssSheet } from 'vite-plugin-import-css-sheet';


export default defineConfig((env) => ({
	root:      './src',
	publicDir: '../public',
	plugins:   [
		keystone(),
		viteImportCssSheet(),
		viteCopy({
			targets: [
				{
					from: './node_modules/@roenlie/mimic-elements/styles/*',
					to:   './public/vendor/mimic-elements',
				},
			],
			hook:     'config',
			copyOnce: true,
		}),
	],
	resolve: {
		conditions: env.mode === 'development' ? [ 'morph-workspace' ] : [],
	},
}));
