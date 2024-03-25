import { resolve } from 'node:path';

import { libConfig } from '@roenlie/package-toolbox/vite-utils';
import { rimraf } from 'rimraf';
import { defineConfig, type LibraryOptions, type Plugin, type ResolvedConfig } from 'vite';


export default defineConfig(async (env) => {
	const cfg = await libConfig({
		build: {
			emptyOutDir: true,
			outDir:      './dist/monaco',
			lib:         {
				entry:    './src/index.ts',
				name:     'index',
				fileName: () => 'index.cjs',
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
			// This plugin makes the vitejs generated web worker wrappers
			// point to the relative /assets location instead of the root url.
			(() => {
				return {
					name:    'relative-worker-wrapper',
					enforce: 'post',
					transform(code, id) {
						if (!id.includes('.worker'))
							return;

						const index = code.indexOf('"__VITE_WORKER_ASSET');
						if (index < 0)
							return;

						const chars = [ ...code ];
						chars.splice(
							index, 0, 'import.meta.url.split("/").slice(0, -1).join("/") + ',
						);

						return chars.join('');
					},
				} as Plugin;
			})(),
			(() => {
				let cfg: ResolvedConfig;

				return {
					name:    'remove sourcemaps',
					enforce: 'post',
					configResolved(config) {
						cfg = config;
					},
					async closeBundle() {
						console.log('bundle closed');

						const path = resolve(resolve(), cfg.build.outDir).replaceAll('\\', '/');
						await rimraf(path + '/**/*.js.map', { glob: true });
					},
				} as Plugin;
			})(),
		],
	})(env);

	// libConfig seems to be merging arrays, which makes it include the default ['es'].
	// Therefor we must explicitly override the array here.
	(cfg.build!.lib as LibraryOptions).formats = [ 'umd' ];

	return cfg;
});
