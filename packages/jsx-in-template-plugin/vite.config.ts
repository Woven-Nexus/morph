import { existsSync } from 'fs';
import { basename, dirname, join, resolve } from 'path';
import { defineConfig } from 'vite';


export default defineConfig({
	build: {
		outDir: './dist',
		lib:    {
			fileName: () => 'index.js',
			entry:    './src/index.ts',
			formats:  [ 'es' ],
		},
		rollupOptions: {
			external(source, importer, isResolved) {
				if (!importer)
					return false;
				if (isResolved) {
					console.log({ source });

					return !existsSync(source);
				}

				const resolved = join(
					resolve(dirname(importer), dirname(source)),
					basename(source, '.js') + '.ts',
				);

				return !existsSync(resolved);
			},
		},
	},
});
