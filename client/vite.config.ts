import cssStyleSheet from 'rollup-plugin-import-css';
import { defineConfig } from 'vite';


export default defineConfig({
	root:      './src',
	publicDir: '../public',
	build:     {
		outDir: '../dist',
	},
	plugins: [ cssStyleSheet({ include: [ '**/*.ccss' ], modules: true, minify: true }) ],
});
