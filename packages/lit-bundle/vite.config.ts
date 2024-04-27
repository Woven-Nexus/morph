import { defineConfig } from 'vite';


export default defineConfig({
	build: {
		outDir: './dist',
		lib:    {
			entry:    './src/lit.ts',
			fileName: () => 'lit.js',
			formats:  [ 'es' ],
		},
		rollupOptions: {
			treeshake: false,
		},
	},
});
