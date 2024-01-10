import { defineConfig } from 'vite';
import { viteImportCssSheet } from 'vite-plugin-import-css-sheet';


export default defineConfig({
	root:      './src',
	publicDir: '../public',
	build:     {
		outDir:        '../dist',
		rollupOptions: {
			input: [
				'./src/index.html',
				'./src/login.html',
			],
		},
	},
	plugins: [ viteImportCssSheet() ],
});
