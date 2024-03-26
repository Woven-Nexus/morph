import { resolve } from 'node:path';

import { libConfig } from '@roenlie/package-toolbox/vite-utils';
import { rimraf } from 'rimraf';
import { defineConfig, type LibraryOptions, type Plugin, type ResolvedConfig } from 'vite';


export default defineConfig(async (env) => {
	const cfg = await libConfig({
		build: {
			reportCompressedSize: false,
			emptyOutDir:          true,
			outDir:               './dist',
			lib:                  {
				entry:    './src/index.ts',
				name:     'monaco-editor-wc',
				fileName: () => 'monaco-editor-wc.js',
				formats:  [ 'umd' ],
			},
			rollupOptions: {
				external: undefined,
				output:   {
					preserveModules: false,
					sourcemap:       false,
				},
			},
		},
		plugins: [
			// For some reason, worker sourcemaps are always generated.
			(() => {
				let cfg: ResolvedConfig;

				return {
					name:    'remove-worker-sourcemaps',
					enforce: 'post',
					configResolved(config) {
						cfg = config;
					},
					async closeBundle() {
						const path = resolve(resolve(), cfg.build.outDir).replaceAll('\\', '/');
						await rimraf(path + '/assets');
					},
				} as Plugin;
			})(),
		],
		worker: {
			rollupOptions: {
				output: {
					sourcemap: false,
				},
			},
		},
	})(env);

	// libConfig seems to be merging arrays, which makes it include the default ['es'].
	// Therefor we must explicitly override the array here.
	(cfg.build!.lib as LibraryOptions).formats = [ 'umd' ];

	return cfg;
});
