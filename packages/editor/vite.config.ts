import { libConfig } from '@roenlie/package-toolbox/vite-utils';
import { defineConfig, type Plugin } from 'vite';


export default defineConfig(libConfig({
	build: {
		emptyOutDir:   true,
		outDir:        './dist/monaco',
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
	],
	worker: {
		rollupOptions: {
			output: {
				sourcemap: false,
			},
		},
	},
}));
