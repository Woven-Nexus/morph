import { resolve } from 'node:path';

import { libConfig } from '@roenlie/package-toolbox/vite-utils';
import { rimraf } from 'rimraf';
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite';


export default defineConfig(libConfig({
	build: {
		outDir:               './dist',
		emptyOutDir:          true,
		reportCompressedSize: false,
		lib:                  {
			entry:    './src/index.ts',
			name:     'monaco-editor-wc',
			fileName: () => 'monaco-editor-wc.js',
		},
		rollupOptions: {
			external: [],
			output:   {
				manualChunks:    () => 'index',
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
}));
