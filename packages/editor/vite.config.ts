import { libConfig } from '@roenlie/package-toolbox/vite-utils';
import { defineConfig } from 'vite';


export default defineConfig(libConfig({
	build: {
		emptyOutDir:   true,
		rollupOptions: {
			external: undefined,
			output:   {
				preserveModules: false,
				sourcemap:       false,
			},
		},
	},
	worker: {
		rollupOptions: {
			output: {
				sourcemap: false,
			},
		},
	},
}));
